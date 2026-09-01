/* ==========================================================================
   ALPHA MOCKUP · alpha.js · 2026-08-17
   The renderer shared by index.html and coin.html.

   ⚠ NAMED DEVIATION FROM THE PROMPT'S FOUR-FILE LAYOUT.
     The prompt lists index.html / coin.html / alpha.css / alpha-config.js.
     This is a fifth file. It exists because the alternative is duplicating the
     tier state, the band resolver, the gauge, the drawer and the five Ask Buzz
     states across two pages — and the tier switcher is the ONE control the
     operator flips live in the room, so two copies of it is two chances for the
     demo to drift mid-meeting. v3's own architecture, which STEP 3 names as the
     model, is base.css + app.js, so this matches it rather than departing.
     ⛔ Nothing that belongs in the CONFIG lives here. This file renders; it decides nothing.
   ========================================================================== */

var ALPHA_PAGE = (function () {
  'use strict';

  var C = ALPHA;
  var TIER = 'unregistered';                 // runtime toggle, never three files
  var SORT = { key: 'tnt', dir: 'desc' };
  var FILTER = 'all';
  var BUZZ_STATE = 'answer';
  var BUZZ_OPEN = null;                      /* set by bindBuzz; used by the bar chips */
  var WATCHED = {};
  var PRICE_CACHE = null;

  /* ---- tiny helpers ---------------------------------------------------- */
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
  /* §F 20 (stitch 2026-09-01) · A NULL SCORE IS ABSENCE, NOT A VERDICT.
     Before this: one(null) printed an em dash (banned in rendered copy, and
     identical to a not-yet-loaded price), cls(missing) fell through to 'neut'
     (an unscoreable coin painted with the neutral band colour - absence
     rendered as a verdict), and gap() went NaN into a CSS width. Now: 'n/a'
     text, an 'na' band class that alpha.css draws as its own dashed object
     ("a different object per state, never colour alone" - J3-C), and a
     0-magnitude bar. */
  function one(n){ return (n==null) ? 'n/a' : Number(n).toFixed(1); }
  function cls(b){ return b ? (C.BAND_CLASS[b] || 'na') : 'na'; }
  function gap(t){ var g = Math.abs(t.net - t.tok); return isFinite(g) ? g : 0; }
  function $(id){ return document.getElementById(id); }
  function pressAll(nodes, attr, val){
    Array.prototype.forEach.call(nodes, function(b){
      b.setAttribute('aria-pressed', String(b.getAttribute(attr) === val));
    });
  }
  /* ---- LOGOS · A SELF-CONTAINED COPY ------------------------------------
     ⛔ THE BUG THIS FIXES: the path used to be `../../Assets/token_logos/`.
        A browser CLAMPS `../` at the origin root, so served with root =
        ALPHA_2026-08/ it resolved to /Assets/token_logos/… and 404'd on all 39.
     ✅ The files are COPIED into this folder and referenced RELATIVELY, so the
        page works under file:// and under any server root.
     ⛔ Website/Assets/token_logos/ IS READ-ONLY — another skill owns it. This
        build copied OUT of it and wrote nothing back.
     ✅ All 39 board tickers have a file (checked, ticker-for-ticker). The
        monogram fallback below stays for any that goes missing later. */
  var LOGO_DIR = 'assets/token_logos/';
  function logo(tk){
    /* ⛔ ROUND 3 · THE MARK IS CONTAINED, NOT CROPPED. See the .tlogo rule in
       alpha.css: the circular mask that used to clip PUMP and FLR is gone. */
    return '<span class="tlogo"><img src="'+LOGO_DIR+esc(tk)+'.svg" alt="" '
         + 'onerror="this.parentNode.innerHTML=\'<span class=&quot;mono monofb&quot;>'
         + esc(tk).slice(0,3)+'</span>\'"></span>';
  }

  /* ---- ⛔ THE DECOY GUARD ------------------------------------------------
     The archive beside the live CSVs holds a 12-row board and a 104-row
     inventory. A page built from those renders perfectly, looks entirely
     plausible, and is a quarter of the product. So it fails loudly instead. */
  function assertLiveData(){
    if (C.BOARD.length !== C.BOARD_ASSERT.rows) {
      document.body.insertAdjacentHTML('afterbegin',
        '<div style="background:#bf3d3d;color:#fff;padding:14px 18px;font:700 14px system-ui">'
        + 'DATA GUARD FAILED. Board has ' + C.BOARD.length + ' rows, expected '
        + C.BOARD_ASSERT.rows + '. You may be on the pre-calibration archive copy.</div>');
    }
    /* §F 20, ruled 2026-08-27: inventoryRows is ASSERTED, not deleted. The
       archive decoy differs on BOTH axes (12 board rows AND 104 inventory
       rows vs 39/405), so this second check catches a wrong-file build even
       when a future roster happens to share a row count. The per-row mix
       arrays are the page's own copy of the inventory, so their sum IS the
       inventory count this page was built from. */
    var inv = 0;
    C.BOARD.forEach(function(t){ (t.mix || []).forEach(function(n){ inv += n; }); });
    if (inv !== C.BOARD_ASSERT.inventoryRows) {
      document.body.insertAdjacentHTML('afterbegin',
        '<div style="background:#bf3d3d;color:#fff;padding:14px 18px;font:700 14px system-ui">'
        + 'DATA GUARD FAILED. Catalyst mix totals ' + inv + ' rows, expected '
        + C.BOARD_ASSERT.inventoryRows + '. You may be on the pre-calibration archive copy.</div>');
    }
  }

  /* ======================================================================
     THE GAUGE — ⛔ ONLY THE TNT COMPOSITE. Token, Network and Technicals are
     numbers. A gauge on a component score is a DEFECT: it implies the
     sub-scores carry the same kind of verdict the composite does. They do not,
     and that is the entire point of a three-axis instrument.
     ====================================================================== */
  function gaugeSVG(score){
    var r = 78, cx = 100, cy = 96;
    var ang = (180 - 180 * ((score - 1) / 9)) * Math.PI / 180;
    var x = (cx + r * Math.cos(ang)).toFixed(2), y = (cy - r * Math.sin(ang)).toFixed(2);
    return '<svg class="tnt-gauge" viewBox="0 0 200 112" role="img" aria-label="TNT score '+one(score)+' of 10">'
      + '<defs><linearGradient id="ggrad" x1="0" y1="0" x2="1" y2="0">'
      + '<stop offset="0" stop-color="#bf3d3d"/><stop offset="0.5" stop-color="#e0a93c"/>'
      + '<stop offset="1" stop-color="#15824a"/></linearGradient></defs>'
      + '<path class="track" stroke="url(#ggrad)" d="M 22 96 A 78 78 0 0 1 178 96"/>'
      + '<circle class="mark" cx="'+x+'" cy="'+y+'" r="7"/></svg>';
  }
  function gaugeCard(o){
    return '<span class="microlabel">'+esc(o.label)+'</span>'
      + gaugeSVG(o.score)
      + '<div class="gauge-num '+cls(o.band)+'">'+one(o.score)+'</div>'
      + '<div class="gauge-word '+cls(o.band)+'">'+esc(o.band)+'</div>'
      + (o.foot ? '<div class="asof">'+o.foot+'</div>' : '');
  }

  /* ======================================================================
     NAV — SIX destinations now (Pricing added), rendered from config.

     ⛔ NOTHING IN THE NAV MAY 404 IN THE MEETING ROOM. Every destination is an
        in-page VIEW on index.html, addressed as index.html#/<key>. From
        coin.html the same link is a normal navigation back to index.html, so
        the nav behaves identically on both pages and nothing 404s from either.
     ⭐ The Watchlist item also carries the CMC-pattern HOVER PANEL (B5).
     ====================================================================== */
  function navHref(n){ return 'index.html#/' + n.key; }

  function renderNav(active){
    var el = $('navLinks'); if(!el) return;
    el.innerHTML = C.NAV.map(function(n){
      var a = '<a href="'+navHref(n)+'" data-view="'+esc(n.key)+'"'
            + (n.key===active?' class="active"':'')+'>'+esc(n.label)+'</a>';
      /* the watchlist item is wrapped so the hover panel can hang off it */
      if (n.key === 'watchlist') {
        a = '<span class="navwrap" id="navWatchWrap">' + a
          + '<div class="wl-panel" id="wlPanel" role="group" aria-label="Watchlist preview"></div></span>';
      }
      return a;
    }).join('');
  }

  /* ======================================================================
     THE VIEW ROUTER — index.html only. coin.html has no .view elements, so
     bindRouter() no-ops there and its nav links navigate normally.
     ====================================================================== */
  var VIEW_KEYS = ['coins','watchlist','research','hws','market','pricing'];
  function showView(key, onShow){
    if (VIEW_KEYS.indexOf(key) < 0) key = 'coins';
    var any = false;
    VIEW_KEYS.forEach(function(k){
      var v = $('view-' + k); if(!v) return;
      any = true; v.hidden = (k !== key);
    });
    if (!any) return false;
    Array.prototype.forEach.call(document.querySelectorAll('.nav-links a[data-view]'), function(a){
      a.classList.toggle('active', a.getAttribute('data-view') === key);
    });
    if (onShow) onShow(key);
    return true;
  }
  function bindRouter(onShow){
    if (!$('view-coins')) return;                 /* coin.html — nothing to route */
    function fromHash(){
      var h = (location.hash || '').replace(/^#\/?/, '');
      showView(h || 'coins', onShow);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    document.addEventListener('click', function(e){
      var a = e.target.closest ? e.target.closest('a[href*="index.html#/"],a[data-goto]') : null;
      if(!a) return;
      var key = a.getAttribute('data-goto')
             || (a.getAttribute('href')||'').split('#/')[1];
      if(!key || VIEW_KEYS.indexOf(key) < 0) return;
      e.preventDefault();
      /* set the hash for addressability, then switch the view DIRECTLY rather
         than waiting on hashchange — the event does not fire when the hash is
         unchanged, and a nav item that silently does nothing on a second click
         is exactly the kind of thing a live demo finds first. */
      if (location.hash !== '#/'+key) location.hash = '#/'+key;
      fromHash();
    });
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  /* ======================================================================
     THE HIGHLIGHT STRIP — ⛔ THREE UNITS, THREE FORMS.

     Four visually identical cards carrying three different units WAS the
     defect: the operator read STABLE's TOKEN score as a TNT score. The eyebrow
     is not the fix — it is what he had to fall back on reading. So each unit
     gets a DIFFERENT SHAPE, and the shape is the first thing seen.

       TNT score      → the GAUGE, and ⛔ PUMP IS THE ONLY CARD THAT GETS ONE.
       Decoupling gap → paired Network/Token bars + the span between them.
       Token score    → a position on a 1–10 track. ⛔ No arc, no semicircle.

     ⛔⛔ THE GAP FORM IS MAGNITUDE ONLY. No arrow, no lean, no up/down, no
        red-vs-green implying a side. Neutral ink. The network leads the token
        on 38 of 39 rows, so any directional mark points the same way on 97% of
        them and stops being seen within three.
     ====================================================================== */
  function pctOf10(v){ return Math.max(2, Math.min(100, (v - 1) / 9 * 100)); }

  /* PAIRED MAGNITUDE BARS. The distance between them IS the gap — that is the
     whole idea, and it no longer needs a label saying so.
     ⛔ ROUND 3 · DELETED: the `GAP 1.9` / `GAP 0.1` label and the
        "on a 1–10 scale" caption.
     ⛔⛔ A4 · EACH BAR IS TINTED BY ITS OWN BAND (bullish green, neutral grey,
        bearish red), NEVER BY WHICH BAR IS LONGER. LINK's network score is 7.0,
        which IS bullish, so it reads green because of that, not because it won.
        ▶ Band colour genuinely VARIES across the board (8 bullish · 26 neutral
          · 5 bearish). Colouring "the bigger one" green would paint 38 of 39
          rows identically — the wallpaper failure arriving through a colour
          instead of an arrow. */
  function gapForm(t){
    var nw = pctOf10(t.net), tw = pctOf10(t.tok);
    var lo = Math.min(nw, tw), span = Math.max(0.8, Math.abs(nw - tw));
    function bar(lbl, v, band, w){
      return '<div class="gv-row"><div class="gv-head"><span class="gv-l">'+lbl+'</span>'
        + '<b class="gv-v">'+one(v)+'</b></div>'
        + '<span class="gv-track"><i class="'+cls(band)+'" style="width:'+w.toFixed(1)+'%"></i></span></div>';
    }
    return '<div class="gapviz">'
      + bar('Network', t.net, t.netB, nw)
      + bar('Token',   t.tok, t.tokB, tw)
      + '<div class="gv-spanrow"><span class="gv-spanbar" style="margin-left:'+lo.toFixed(1)+'%;'
      +   'width:'+span.toFixed(1)+'%"></span></div>'
      + '</div>';
  }

  /* a POSITION ON A SCALE. Deliberately not an arc: this is a component score
     and only the composite is ever drawn as a gauge. */
  function scaleForm(v, band, label){
    return '<div class="scaleviz">'
      + '<span class="sv-track"><i class="sv-fill" style="width:'+pctOf10(v).toFixed(1)+'%"></i>'
      +   '<b class="sv-mark" style="left:'+pctOf10(v).toFixed(1)+'%"></b></span>'
      + '<div class="sv-ends"><span>1</span><span>'+esc(label)+'</span><span>10</span></div>'
      + '<div class="sv-val '+cls(band)+'">'+one(v)+'<span class="sv-band '+cls(band)+'">'+esc(band)+'</span></div>'
      + '</div>';
  }

  /* THE MARKET CARD. ⛔ Counted here, in code, from the board. The figures are
     never transcribed, and the card NAMES the band column it counted, because
     the two band columns disagree on 10 of 39 rows. */
  /* the counts are also what the card's DESCRIPTION is built from, so the two
     cannot disagree — the renderer returns both from the one count. */
  function bandCounts(rows, field){
    var n = { BULLISH:0, NEUTRAL:0, BEARISH:0 };
    rows.forEach(function(t){ if(n[t[field]] != null) n[t[field]]++; });
    return n;
  }
  function bandForm(rows, field){
    var n = bandCounts(rows, field), tot = rows.length;
    function seg(k, c){ return '<i class="'+c+'" style="width:'+(n[k]/tot*100).toFixed(2)+'%" '
      + 'title="'+n[k]+' of '+tot+' '+k+'"></i>'; }
    function key(k, c){ return '<li><i class="sw '+c+'"></i><span>'+k+'</span><b>'+n[k]+'</b></li>'; }
    /* ⛔ 2026-08-17 · THE `.bv-leads` LINE IS DELETED FROM THIS CARD — both the
       "Network leads the coin on 38 of 39" sentence and the old band-disclosure
       sentence. The card's description now carries the disclosure in plain
       English ("Based on the TNT Score: …"), and the JUMP CONTROL moved to THE
       ONE EXCEPTION card, which is the thing it points at. The quantity itself
       is not lost from the page: the footer statement still derives and prints
       it. ⛔ Do not re-add a line here. */
    return '<div class="bandviz">'
      + '<span class="bv-bar">'+seg('BULLISH','b-bull')+seg('NEUTRAL','b-neut')+seg('BEARISH','b-bear')+'</span>'
      + '<ul class="bv-key">'+key('BULLISH','b-bull')+key('NEUTRAL','b-neut')+key('BEARISH','b-bear')+'</ul>'
      + '</div>';
  }

  /* ⛔ ROUND 3 · THE FEATURED-RESEARCH CARD IS DELETED. Six cards was too many,
     and it was the one card with nothing in it: we have no articles and E1 is
     unruled. E1 is still surfaced, and still marked UNRULED, on /research. */

  function renderHighlights(rows, byTk){
    var el = $('highlights'); if(!el) return;
    /* ⛔ ROUND 3 · WHAT A CARD IS NOW: eyebrow · ticker · the form · ONE LINE.
       No gold sub-header, no three-score triple, no gap label. version-b's
       density, and nothing else taken from it. */
    el.innerHTML = C.HIGHLIGHTS.map(function(h, i){
      var head, form, note = h.note, nid = 'hlnote-' + i;

      if (h.form === 'bands') {
        /* ⭐ ROUND 6 · THE TITLE ROW IS FILLED ON BOTH SIDES. Every coin card
           renders a bold label plus a muted sub-label (`PUMP` / `Pump.fun`);
           the market card was the only one leaving the second slot empty.
           ⛔⛔ `By TNT Score` MAY NOT GO INTO THE TOOLTIP WITH THE DESCRIPTION.
              The card shows 8 / 26 / 5, this page counts bands three different
              ways, and two of those counts disagree on 10 of the 39 coins. A
              band count must name which band it counted, ON ITS FACE, with no
              hover — that standing rule was written for exactly this surface.
           ⭐ `All 39 Coins` is a NAMED, operator-ruled terminology exception. */
        head = '<div class="hl-id market"><span class="hl-mk">All '+rows.length+' Coins</span>'
             + '<span class="nm">By TNT Score</span></div>';
        form = bandForm(rows, h.bandField);
        /* ⛔ THE THREE DIGITS IN THE DESCRIPTION ARE COUNTED HERE, from the same
           counts the bar above them is drawn from, and are never transcribed.
           The rest of the sentence is the operator's, verbatim. */
        var bn = bandCounts(rows, h.bandField);
        note = h.noteTemplate.replace('{b}', bn.BULLISH)
                             .replace('{n}', bn.NEUTRAL)
                             .replace('{r}', bn.BEARISH);
      } else {
        var t = byTk[h.tk]; if(!t) return '';
        head = '<div class="hl-id">'+logo(t.tk)+'<span class="tk">'+esc(t.tk)+'</span>'
             + '<span class="nm">'+esc(t.nm)+'</span></div>';
        /* ⛔ THE GAUGE GOES ON THE ONE `form: 'gauge'` CARD AND NOWHERE ELSE.
           ⚠ Which coin that is comes from HIGHLIGHTS[].tk and CHANGES: it was
             PUMP, it is ZEC as of 2026-08-24. Do not re-hardcode a ticker here. */
        form = (h.form === 'gauge')
             ? '<div class="hl-gauge">'+gaugeSVG(t.tnt)
               + '<div class="gauge-num '+cls(t.tntB)+'">'+one(t.tnt)+'</div>'
               + '<div class="gauge-word '+cls(t.tntB)+'">'+esc(t.tntB)+'</div></div>'
             : (h.form === 'gap') ? gapForm(t)
             : scaleForm(t.tok, t.tokB, 'token score');
      }
      /* ⛔⛔ ROUND 6 · THE DESCRIPTION LEAVES THE FACE OF THE CARD AND BECOMES A
         TOOLTIP ON THE WHOLE CARD. That is where the vertical space comes from.
         ⚠⚠ IT IS NOT HOVER-ONLY, AND IT MAY NOT BECOME HOVER-ONLY. After this
            change the description is the ONLY place that copy exists, so a
            mouse-only tooltip would delete it outright for a keyboard user.
            THREE things make it reachable, and all three are load-bearing:
              1. the CARD is the trigger, not a small `i` beside it;
              2. the card is FOCUSABLE — the coin cards are already links, and
                 the market card is given tabindex="0" because a <div> is not;
              3. `aria-describedby` ties the text to the card, so a screen
                 reader announces it whether or not anything is "shown".
            The CSS opens it on :hover, on :focus-visible and on :focus-within.
         ⛔ Do not swap the trigger back to an icon and do not drop the id. */
      var tag = (h.form === 'bands') ? 'div' : 'a';
      var attr = (tag === 'a') ? ' href="coin.html"' : ' tabindex="0"';
      return '<'+tag+' class="hl hl-'+esc(h.tone)+' f-'+esc(h.form)+'"'+attr
        + ' aria-describedby="'+nid+'">'
        + '<div class="k">'+esc(h.eyebrow)+'</div>'
        + head
        + '<div class="hl-form">'+form+'</div>'
        + '<span class="hl-tip" id="'+nid+'" role="tooltip">'+esc(note)+'</span>'
        + '</'+tag+'>';
    }).join('');
  }

  /* ======================================================================
     STICKY OFFSETS — ⛔ ROUND 4 · THE HEADERS STAY VISIBLE WHILE SCROLLING,
     AND THE PAGE IS THE ONLY THING THAT SCROLLS. There is no inner scroll
     container and no second scrollbar; the table sits in normal flow.

     Three sticky layers stack, so each one needs to know the height of the one
     above it. Only the nav is a fixed height in CSS, so the other two are
     MEASURED here rather than guessed:
        nav  → top: 0                       (--nav-h, fixed in CSS)
        control bar → top: var(--nav-h)     (its own height → --ctl-h)
        table header row 1 → top: nav + ctl
        table header row 2 → top: nav + ctl + row-1 height  (→ --hdr1-h)
     ⚠ The control bar wraps on a narrow window, so this re-measures on resize.
     ====================================================================== */
  function measureSticky(){
    var root = document.documentElement;
    var bar  = document.querySelector('.board-ctl');
    var grp  = document.querySelector('table.tok thead .bd-grp');
    /* ⚠ only write a MEASURED value. A zero would pin the header row under the
       nav and let the control bar scroll over it; the CSS fallbacks are the
       safer state, so a zero is left alone rather than written. */
    if (bar && bar.offsetHeight > 0) root.style.setProperty('--ctl-h',  bar.offsetHeight + 'px');
    if (grp && grp.offsetHeight > 0) root.style.setProperty('--hdr1-h', grp.offsetHeight + 'px');
  }
  window.addEventListener('resize', measureSticky);
  /* webfonts land after first paint and change both heights, so re-measure */
  window.addEventListener('load', measureSticky);
  /* §F 17 (stitch 2026-09-01) · THE PROMOTED OBSERVER. Load and resize are not
     the only times the control bar changes height: any design that adds a row,
     a dashboard or a menu to that bar changes it BETWEEN those events, and the
     pinned header then misaligns silently. Three seats invented this fix
     independently (J1-A, J1-C privately; J1-D as the shared proposal) - it
     lives here ONCE so the cost is paid centrally, never per design. */
  if (window.ResizeObserver) {
    var _stickyRO = new ResizeObserver(measureSticky);
    var _roBar = document.querySelector('.board-ctl');
    var _roGrp = document.querySelector('table.tok thead .bd-grp');
    if (_roBar) _stickyRO.observe(_roBar);
    if (_roGrp) _stickyRO.observe(_roGrp);
  }

  /* ======================================================================
     TOOLTIPS — ⚠ KEYBOARD- AND TOUCH-REACHABLE, NOT HOVER-ONLY.
     Every tip lives on a real <button>, so it is tab-focusable and tappable;
     CSS opens it on :hover and :focus-visible, and this binder opens it on
     CLICK (which is what a touch device sends). Escape and an outside click
     close it.
     ⛔ A tooltip may EXPLAIN a value. It may NOT be the only place a value
        EXISTS — which is why the catalyst COUNT is printed on the row and the
        tooltip only adds its breakdown.
     ⚠ The header tips sit INSIDE sortable <th>s, so the handler must stop the
       click reaching the sort handler or reading the column would re-sort it.
     ====================================================================== */
  function closeTips(except){
    Array.prototype.forEach.call(document.querySelectorAll('.tip.open,.tipbar.open'), function(b){
      if (b !== except) { b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
    });
  }
  function bindTips(root){
    var scope = root || document;
    /* `.tip` is the small `i` in a column header. `.tipbar` is a tooltip
       attached DIRECTLY to a piece of the row (the catalyst-mix bars), with no
       icon of its own: users hover the thing, not a marker beside it. */
    Array.prototype.forEach.call(scope.querySelectorAll('.tip,.tipbar'), function(b){
      if (b.__tipBound) return;
      b.__tipBound = true;
      b.__isTip = true;
      b.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        var open = b.classList.toggle('open');
        b.setAttribute('aria-expanded', String(open));
        closeTips(b);
      });
      b.addEventListener('keydown', function(e){
        if (e.key === 'Escape') { b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
      });
    });
  }
  document.addEventListener('click', function(){ closeTips(null); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeTips(null); });

  /* ======================================================================
     WATCHLIST · ⛔ NO LONGER AT THE BOTTOM OF THE PAGE.
     ✅ The CMC pattern: a HOVER PANEL off the top nav item, plus a DEDICATED
        VIEW reached from that item or from the panel's `Full view ›`.
     ⚠⚠ THE REGISTER PROMPT RENDERS IN BOTH, ON PURPOSE. A hover panel is
        transient, and a conversion prompt that vanishes on mouse-out converts
        nobody — so the dedicated view carries its own. Not a duplicate by
        accident.
     Tier behaviour is UI_BRIEF §4.1: My Watchlist = register prompt at
     unregistered · Suggested Watchlist = 1 / 3 / all.
     ⚠ These live at MODULE scope, not inside initBoard, because the nav — and
       therefore the hover panel — is on the TOKEN page too.
     ====================================================================== */
  function registerPrompt(compact){
    return '<div class="wl-empty'+(compact?' compact':'')+'">'
      + '<p class="one">Track the boards you hold, and see the gap move.</p>'
      + '<div class="gatebar" style="justify-content:center"><span class="gtxt">'
      + 'A watchlist needs an account. <b>The scores it would track are already free.</b></span>'
      + '<span class="gact"><a class="solid" href="#">Create a free account</a>'
      + '<a href="index.html#/hws" data-goto="hws">How we score</a></span></div></div>';
  }
  function wlRows(){ return C.BOARD.slice().sort(function(a,b){ return gap(b) - gap(a); }); }
  function wlItem(t, right){
    return '<div class="wl-item">'+logo(t.tk)+'<span class="tk">'+esc(t.nm)
      + ' <span class="tkr">'+esc(t.tk)+'</span></span>'
      + '<span class="nums">'+right+'</span>'
      + '<span class="tnt-pill '+cls(t.tntB)+'" style="font-size:14px;min-width:44px">'+one(t.tnt)+'</span></div>';
  }
  function mineHTML(compact){
    var mine = C.BOARD.filter(function(t){ return WATCHED[t.tk]; });
    if (TIER === 'unregistered') return registerPrompt(compact);
    if (!mine.length) return '<div class="wl-empty'+(compact?' compact':'')+'"><p class="one">'
      + 'Nothing tracked yet. Use the star on any board row.</p></div>';
    return '<div class="wl-list">' + mine.map(function(t){
      return wlItem(t, 'N '+one(t.net)+' · T '+one(t.tok)); }).join('') + '</div>';
  }
  function suggestedN(){ return C.TIERS.board.suggestedWatchlist[TIER]; }
  function suggestedHTML(){
    var n = suggestedN(), pool = wlRows();
    return ((n === 'all') ? pool : pool.slice(0, n)).map(function(t){
      return wlItem(t, 'gap '+gap(t).toFixed(1)); }).join('');
  }
  function suggestedNote(){
    var n = suggestedN(), tot = C.BOARD.length;
    return (n === 'all')
      ? 'All ' + tot + ' boards, ranked by how far the network is ahead of the token.'
      : 'Showing ' + n + ' of ' + tot + '. ' + (TIER==='unregistered'
          ? 'Registered sees 3; paid sees all.' : 'Paid sees all.');
  }
  function renderWatchPanel(){
    var p = $('wlPanel'); if(!p) return;
    p.innerHTML = '<div class="wlp-head"><span class="wlp-t">My watchlist</span>'
      + '<a class="wlp-full" href="index.html#/watchlist" data-goto="watchlist">Full view ›</a></div>'
      + mineHTML(true)
      + '<div class="wlp-sub"><span class="microlabel">Suggested watchlist</span></div>'
      + '<div class="wl-list tight">' + suggestedHTML() + '</div>'
      + '<p class="one wlp-note">'+esc(suggestedNote())+'</p>';
  }

  /* ======================================================================
     TIER — one switch, re-renders in place.
     ====================================================================== */
  var TIER_NOTE = {
    unregistered: 'Scores, bands, catalyst counts and provenance are full at every tier. That is the Proof Rule.',
    registered:   'Registered adds the ten indicator scores, the levels and the invalidation condition.',
    paid:         'Paid adds the argument: the analytic columns, the written reads and the research dossier.'
  };
  function bindTier(rerender){
    var sw = $('tierSwitch'); if(!sw) return;
    Array.prototype.forEach.call(sw.querySelectorAll('button'), function(b){
      b.addEventListener('click', function(){
        TIER = b.getAttribute('data-tier');
        pressAll(sw.querySelectorAll('button'), 'data-tier', TIER);
        applyTierChrome();
        rerender();
        renderBuzz();
        if (BUZZ_OPEN) renderBarChips(BUZZ_OPEN);   /* chips lock/unlock with the tier */
      });
    });
    applyTierChrome();
  }
  function applyTierChrome(){
    if($('tierNote')) $('tierNote').textContent = TIER_NOTE[TIER];
    if($('acctLbl'))  $('acctLbl').textContent  = (TIER==='unregistered') ? 'Sign in'
                                                : (TIER==='registered' ? 'Account' : 'Account · Paid');
    if($('acctAv'))   $('acctAv').textContent   = (TIER==='unregistered') ? '?' : 'JK';
  }

  /* ======================================================================
     ASK BUZZ — site-wide drawer, five ratified states.
     ====================================================================== */
  function discBlock(){
    /* ⛔ ALWAYS VISIBLE · NEVER DISMISSIBLE · IDENTICAL AT EVERY TIER.
       ⛔ TWO DATES, RENDERED SEPARATELY — they diverge by design and by a lot. */
    var D = C.DISCLOSURE;
    return '<div class="ai-disc">'
      + '<div class="dh">What it read</div><p>'+esc(D.read)+'</p>'
      + '<div class="dh">How old it is</div>'
      + '<div class="dates"><span>Fundamentals <b>'+esc(D.dateFundamentals)+'</b></span>'
      + '<span>Technicals <b>'+esc(D.dateTechnicals)+'</b></span></div>'
      + '<div class="dh">What it cannot see</div><ul>'
      + D.cannotSee.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('') + '</ul>'
      + (BUZZ_STATE==='answer'
          ? '<div class="gapflag">'+esc(D.gapFlagFree)+'</div>'
            + (TIER==='paid'
                ? '<p style="margin-top:6px">The gap: the cumulative burn count does not reconcile across '
                  + 'sources (46.18M vs 44,528,131 vs ~47.3M). It would clear on a dated on-chain read of '
                  + 'the fund address with a block height.</p>'
                : '<div class="gatebar" style="margin-top:8px"><span class="gtxt">'
                  + '<b>What</b> the gap is, and what would clear it, is paid. That it exists is free.'
                  + '</span><span class="gact"><a href="#">How we score</a></span></div>')
          : '')
      + '</div>';
  }
  function chipsBlock(){
    var locked = (TIER === 'unregistered');
    return '<div class="chips"><span class="clbl">'+esc(C.BRAND.chipsLabel)+'</span>'
      + C.BUZZ.chips.map(function(c){
          return '<button type="button" class="chip'+(locked?' locked':'')+'">'+esc(c.q)+'</button>';
        }).join('')
      + (locked ? '<p class="one" style="font-size:11.5px">Registration opens the chips. The disclosure above stays as it is.</p>' : '')
      + '</div>';
  }
  function renderBuzz(){
    var body = $('aiBody'); if(!body) return;
    var B = C.BUZZ, h = '';

    /* AI access is a REGISTERED-tier surface. The disclosure and the chips are
       NOT — they render for the unregistered tier AS the conversion surface. */
    if (TIER === 'unregistered') {
      h += '<div class="state-card"><div class="st-h">Ask Buzz, registered and up</div>'
         + '<div class="st-b">Asking is a registered feature. Everything below renders anyway, '
         + 'because what it read and what it cannot see are not things you should have to pay to find out.</div></div>';
    }

    if (BUZZ_STATE === 'answer') {
      var a = B.answer;
      h += '<div class="msg user"><div class="who">'+esc(C.BRAND.answeredLabel)+'</div><div class="bub">'+esc(a.q)+'</div></div>';
      h += discBlock();
      h += '<div class="msg"><div class="who">Ask Buzz</div><div class="bub">'
        +  a.parts.map(function(p,i){
             var t = esc(p.t);
             if (p.em) t = '<em>'+t+'</em>';
             if (i === 0) t = '<span class="lead">'+t+'</span>';
             return t + (p.cite ? '<span class="cite">['+p.cite+']</span>' : '');
           }).join('')
        + '<div class="src-list">'
        + a.cites.map(function(c,i){
            return '<div class="s"><b>['+(i+1)+']</b><span>'+esc(c[0])+'</span><span class="d">'+esc(c[1])+'</span></div>';
          }).join('')
        + '</div><div class="src-count">'+a.sourceCount+' sources</div></div></div>';
      h += chipsBlock();

    } else if (BUZZ_STATE === 'refusal') {
      var r = B.refusal;
      h += '<div class="msg user"><div class="who">'+esc(C.BRAND.answeredLabel)+'</div><div class="bub">'+esc(r.q)+'</div></div>';
      h += discBlock();
      /* ⭐ THE REFUSAL IS A CREDENTIAL, NOT AN ERROR. It names its reason and
         immediately offers what the user CAN have. A bare "I can't help with
         that" reads as a broken product. */
      h += '<div class="msg"><div class="who">Ask Buzz</div><div class="bub">'
        +  '<span class="lead">'+esc(r.reason)+'</span>'
        +  '<p style="margin:10px 0 0"><b>'+esc(r.offer)+'</b></p><ul class="offers">'
        +  r.offers.map(function(o){ return '<li>'+esc(o)+'</li>'; }).join('')
        +  '</ul></div></div>';
      h += chipsBlock();

    } else if (BUZZ_STATE === 'gated') {
      var g = B.gated;
      h += '<div class="msg user"><div class="who">'+esc(C.BRAND.answeredLabel)+'</div><div class="bub">'+esc(g.q)+'</div></div>';
      h += discBlock();
      /* ⛔⛔ THE GATE, HIT LIVE INSIDE THE CHAT.
         The withheld answer is NOT in alpha-config.js and is NOT in this DOM,
         at any tier. There is nothing here to un-hide. A mockup that ships the
         withheld text and hides it with CSS teaches the build the wrong pattern. */
      h += '<div class="msg"><div class="who">Ask Buzz</div><div class="bub">'
        +  '<span class="lead">'+esc(g.why)+'</span> '+esc(g.gate)
        +  '<div class="gatebar"><span class="gtxt">'
        +  (TIER==='paid'
              ? 'You are on the paid tier. In the live build this answer would render here. '
                + 'in this mockup the withheld text was never written into the page at all, on purpose.'
              : '<b>'+esc(C.BRAND.gatePrinciple)+'</b>')
        +  '</span><span class="gact"><a href="#">How we score</a>'
        +  (TIER==='paid'?'':'<a class="solid" href="#">See plans</a>')+'</span></div>'
        +  '</div></div>';
      h += chipsBlock();

    } else if (BUZZ_STATE === 'quota') {
      h += discBlock();
      /* ⚠ AI-4 IS OPEN — nothing rules what the quota is a quota OF, so this
         copy names no unit and no number, and no usage meter is drawn. */
      h += '<div class="state-card"><div class="st-h">'+esc(B.quota.head)+'</div>'
        +  '<div class="st-b">'+esc(B.quota.body)+'</div></div>'
        +  '<p class="one" style="font-size:11.5px">Open question <b>AI-4</b>: the quota unit is not ruled, '
        +  'so this state names no number and draws no meter.</p>';

    } else {
      h += discBlock();
      h += '<div class="state-card err"><div class="st-h">'+esc(B.error.head)+'</div>'
        +  '<div class="st-b">'+esc(B.error.body)+'</div></div>';
    }
    body.innerHTML = h;
  }
  /* ⭐ CHIPS ON THE BAR ITSELF — the CMC suggested-question pattern, attached to
     the persistent launcher.
     ⛔⛔ ONE AI ENTRY POINT. CMC has BOTH a chip row under the highlights AND a
        bottom bar; we build ONLY the bar, deliberately. The missing second
        strip is a decision, not an omission — do not "fix" it.
     ⚠ At UNREGISTERED the chips are VISIBLE BUT NOT INVOKABLE: a tap prompts
       registration. That is the conversion surface and it is on purpose. */
  var BAR_CHIP_SET = null;                   /* board-scoped on index, token-scoped on token */
  function renderBarChips(open){
    var el = $('bzChips'); if(!el) return;
    var locked = (TIER === 'unregistered');
    var set = BAR_CHIP_SET || C.BUZZ.barChips || C.BUZZ.chips;
    /* ⛔ ROUND 6 · THE `TRY ASKING` LABEL IS GONE FROM THE BAR. It spent width
       on the one row where width is what makes the pills readable, and a row of
       questions beside a button that says `Ask Buzz` does not need a label
       telling you they are questions. ⚠ The DRAWER's own chip block keeps its
       `.clbl` label — that surface has room and no button beside it. */
    el.innerHTML = set.map(function(c){
          return '<button type="button" class="bzchip'+(locked?' locked':'')+'">'+esc(c.q)+'</button>';
        }).join('');
    Array.prototype.forEach.call(el.querySelectorAll('.bzchip'), function(b){
      b.addEventListener('click', function(){ open(true); });
    });
  }

  /* the chat glyph on the button. Inline, because a single 16px mark is not
     worth a request and the bar is on every page. */
  var BUZZ_ICON = '<svg class="bz-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M21 12a8 8 0 01-8 8H7l-4 3v-6.5A8 8 0 0111 4h2a8 8 0 018 8z"/></svg>';

  function bindBuzz(hint, chipSet){
    BAR_CHIP_SET = chipSet || null;
    /* ⛔ ROUND 6 · THE `Ask Buzz` LABEL IS REMOVED FROM THE BAR AND THE BRAND
       NAME MOVES ONTO THE BUTTON, with a chat icon in front of it. Removing it
       HERE rather than only in the markup is deliberate: `coin.html` carries
       its own copy of the bar and is out of scope this round, so the shared
       script is the only place that reaches both pages. */
    var nm = document.querySelector('.buzzbar .bz-name');
    if (nm && nm.parentNode) nm.parentNode.removeChild(nm);
    if($('buzzOpen')) $('buzzOpen').innerHTML = BUZZ_ICON + '<span>Ask Buzz</span>';
    if($('bzHint')) $('bzHint').textContent = hint;
    var d = $('aiDrawer'), s = $('aiScrim');
    function open(v){
      d.classList.toggle('open', v); s.classList.toggle('open', v);
      d.setAttribute('aria-hidden', String(!v));
    }
    BUZZ_OPEN = open;
    renderBarChips(open);
    if($('buzzOpen'))  $('buzzOpen').addEventListener('click', function(){ open(true); });
    if($('buzzClose')) $('buzzClose').addEventListener('click', function(){ open(false); });
    s.addEventListener('click', function(){ open(false); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') open(false); });
    var tabs = $('stateTabs');
    Array.prototype.forEach.call(tabs.querySelectorAll('button'), function(b){
      b.addEventListener('click', function(){
        BUZZ_STATE = b.getAttribute('data-state');
        pressAll(tabs.querySelectorAll('button'), 'data-state', BUZZ_STATE);
        renderBuzz();
      });
    });
    renderBuzz();
  }

  /* ======================================================================
     LIVE PRICES — same WS1 proxy the live lead magnet uses. Real numbers or a
     literal em-dash; NEVER a stale number dressed as a live one.
     ⛔ The proxy is a separate repo with its own deploy. Nothing here touches it.
     ====================================================================== */
  function fmtPrice(v){
    var n = Number(v); if(!isFinite(n)) return null;
    var dp = (n >= 1) ? 2 : (n >= 0.01 ? 4 : 6);
    return '$' + n.toLocaleString('en-US', {minimumFractionDigits:dp, maximumFractionDigits:dp});
  }
  function applyPrices(data){
    if(!data || typeof data !== 'object') return 0;
    var cells = document.querySelectorAll('td.price[data-cgid],.mh-price[data-cgid]'), painted = 0;
    Array.prototype.forEach.call(cells, function(c){
      var row = data[c.getAttribute('data-cgid')]; if(!row) return;
      var px = fmtPrice(row.usd); if(px == null) return;
      var pct = Number(row.pct24h);
      var dir = !isFinite(pct) ? 'flat' : (pct > 0 ? 'up' : (pct < 0 ? 'down' : 'flat'));
      var glyph = (dir==='up') ? '▲' : (dir==='down') ? '▼' : '·';
      c.innerHTML = '<span class="pv">'+esc(px)+'</span>'
        + (isFinite(pct) ? '<span class="pmove '+dir+'">'+glyph+' '+Math.abs(pct).toFixed(1)+'%</span>' : '');
      painted++;
    });
    if(painted && $('pricesLive')) $('pricesLive').classList.add('on');
    return painted;
  }
  /* Any path that replaces the tbody wipes every painted cell, so it MUST end
     in paintPrices() or the live price column silently reverts to em-dashes. */
  function paintPrices(force){
    try{
      var cells = document.querySelectorAll('td.price[data-cgid],.mh-price[data-cgid]');
      if(!cells.length) return;
      if(PRICE_CACHE){ applyPrices(PRICE_CACHE); if(!force) return; }
      var seen = {};
      Array.prototype.forEach.call(cells, function(c){
        var id = c.getAttribute('data-cgid'); if(id) seen[id] = 1;
      });
      var qs = Object.keys(seen).map(encodeURIComponent).join(',');
      if(!qs) return;
      /* ⛔ GUARD — SAME DISCIPLINE AS BOARD_ASSERT: NAME THE THING THAT BROKE.
         If PRICE_FN is ever missing (a stale cached config, a bad edit), the
         old code built the URL anyway, requested `undefined?ids=…`, and the
         catch below swallowed it. Every price then stayed a dash, which is
         INDISTINGUISHABLE from "the proxy is down". So: make no request, and
         say why. */
      var fn = C.BUILD_RAISED && C.BUILD_RAISED.PRICE_FN;
      if (!fn) {
        if (window.console) console.error('[prices] PRICE_FN missing from config. '
          + 'No request was made, so every price cell will stay a dash. This is a CONFIG '
          + 'fault, not a proxy outage.');
        return;
      }
      fetch(fn + '?ids=' + qs, {cache:'no-store'})
        .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
        .then(function(d){ if(applyPrices(d) > 0) PRICE_CACHE = d; })
        .catch(function(e){ if(window.console) console.warn('[prices] feed unavailable, keeping em-dash:', e); });
    }catch(e){ if(window.console) console.warn('[prices] paint skipped:', e); }
  }

  /* ======================================================================
     ===============  HOMEPAGE  ===========================================
     ====================================================================== */
  function initBoard(){
    assertLiveData();
    renderNav('coins');

    /* pin the TNT rank ONCE, from the canonical order, before any re-sort can
       run. It is an identity, not a row index — re-sorting must never renumber it. */
    var rows = C.BOARD.slice().sort(function(a,b){ return b.tnt - a.tnt; });
    rows.forEach(function(t,i){ t.__rank = i + 1; });

    /* --- measured stats, computed here so nothing is transcribed ---------- */
    var gaps = rows.map(gap).sort(function(a,b){ return a-b; });
    var median = gaps[Math.floor(gaps.length/2)];
    var half   = gaps.filter(function(g){ return g >= 0.5 - 1e-9; }).length;

    /* ⛔ ROUND 3 · THE STATS BAND ABOVE THE TABLE IS DELETED (0.7 median gap ·
       28 of 39 at 0.5 or more · 12 of 39 at 1.0 or more). The measurements are
       still computed here, because the footer statement and the DECOUPLED
       filter note both read them, and because a count must state WHAT was
       counted (CONVENTIONS §4a item 9): "at 1.0 or more" and never "above 1.0",
       since FIVE rows sit exactly ON 1.0 and the choice nearly doubles it.

       ⛔⛔ `exception` SURVIVES. It had three consumers and this round removes
          one of them (the hero line). The `is-exception` row class and the
          JUMP-TO-THE-EXCEPTION button both still depend on it, so deleting the
          variable would ship the jump button pointing at nothing. */
    var exception = rows.filter(function(t){ return t.tok > t.net; });
    var leads = rows.length - exception.length;

    /* ⛔ ROUND 3 · THE HERO SENTENCE "On 38 of 39 boards the network is ahead of
       the token." IS DELETED. The quantity did not leave the page: it moved to
       the MARKET card, where it is derived in bandForm(). */

    /* ⛔ ROUND 4 · THE STRIP BELOW THE TABLE IS DELETED, and with it the line
       that used to carry this count plus the jump button. ⭐ NOTHING NAMED IS
       LOST: the count and the jump control both moved ONTO THE MARKET CARD,
       beside each other, where the link sits with the claim it qualifies.
       See bandForm(). */

    /* the plain statement now sits in the board band; the FULLER one is in the
       footer, so the page opens on the table instead of on a hero. */
    if ($('footStatement')) {
      $('footStatement').innerHTML = 'Every coin gets three separate scores. <b>Token</b>: does the '
        + 'catalyst reach the coin you can actually buy? <b>Network</b>: does it help the tech? '
        + '<b>Technicals</b>: ten chart indicators, averaged. A catalyst that helps the network but '
        + 'never reaches the token shows up here as a gap instead of a headline. On ' + leads
        + ' of ' + rows.length + ' boards the network is ahead of the token, the median distance is '
        + median.toFixed(1) + ', and ' + half + ' of ' + rows.length + ' boards sit at 0.5 or more.';
    }

    /* --- the highlight strip · THREE UNITS, THREE FORMS, plus a market card
       and an article card for variety. ⛔ The gauge is on PUMP and nowhere
       else. ⛔ No directional mark anywhere in the gap form. ------------- */
    var byTk = {}; rows.forEach(function(t){ byTk[t.tk] = t; });
    renderHighlights(rows, byTk);

    /* --- board -----------------------------------------------------------
       ⛔ THE `TECH` COLUMN IS REMOVED: it re-printed the technicals score that
          already sits in the breakdown band. ⛔ Nothing is drawn in its place —
          the specced price mini-chart has NO series behind it and a
          score-over-time chart is ruled undrawable until the series starts at
          beta.
       ▶ THE ROW NOW READS AS THREE DISTINCT FORMS rather than one motif
         repeated: the TNT PILL · the DECOUPLING RULE (continuous, measured
         against a FIXED 0–2.0 scale with ticks at 0.5 / 1.0 / 1.5, so bar
         lengths are meaningful across rows) · the CATALYST MIX (DISCRETE — one
         small block per catalyst). The rule and the mix used to be two similar
         bars; they are now two different kinds of object. ------------------ */
    var DEC_SCALE = 2.0;                 /* fixed, so lengths are comparable */

    function rowHTML(t){
      var g = gap(t), pct = Math.max(2, Math.min(100, g / DEC_SCALE * 100));
      /* one block per catalyst, grouped bullish → neutral → bearish. The block
         COUNT is the catalyst count, so the texture and the number agree. */
      var mseg = '', mixNames = ['mb','mn','mr'], mixWords = ['bullish','neutral','bearish'];
      t.mix.forEach(function(n, i){
        for (var j = 0; j < n; j++) mseg += '<i class="'+mixNames[i]+'"></i>';
      });
      var watched = !!WATCHED[t.tk];
      /* the repurposed second slot: WATCHLIST ADD. At unregistered it is a
         register prompt — a dropped-feature slot becomes a funnel surface. */
      var starTitle = (TIER==='unregistered') ? 'Register to build a watchlist' : 'Add to watchlist';
      return '<tr id="row-'+esc(t.tk)+'"'+(t.tok > t.net ? ' class="is-exception"' : '')+'>'
        /* ⭐ ROUND 4 · THE STAR IS THE LEFTMOST COLUMN, before `#`, as CMC does
           it. The tier gate is unchanged: at the unregistered tier it prompts
           for an account rather than tracking anything. */
        + '<td class="star"><button class="starbtn'+(watched?' on':'')+'" type="button" '
        +   'data-tk="'+esc(t.tk)+'" title="'+starTitle+'" aria-label="'+starTitle+'">'
        +   (watched?'★':'☆')+'</button></td>'
        + '<td class="rk">'+t.__rank+'</td>'
        /* ✅ CMC arrangement: FULL NAME first, in bold dark; TICKER second, in
           smaller grey. The column is also narrowed in the colgroup. */
        + '<td class="asset"><a class="ac" href="coin.html">'+logo(t.tk)
        +   '<span class="anm"><b>'+esc(t.nm)+'</b><span class="tkr">'+esc(t.tk)+'</span></span></a></td>'
        + '<td class="price" data-cgid="'+esc(t.cg)+'">—</td>'
        + '<td class="tntc"><span class="tnt-pill '+cls(t.tntB)+'" title="'+esc(t.tntB)+'">'+one(t.tnt)+'</span></td>'
        + '<td class="comp comp-first '+cls(t.tokB)+'">'+one(t.tok)+'</td>'
        + '<td class="comp '+cls(t.netB)+'">'+one(t.net)+'</td>'
        + '<td class="comp comp-last '+cls(t.tecB)+'">'+one(t.tec)+'</td>'
        /* ⛔⛔ MAGNITUDE, NEVER DIRECTION. A length-varying rule reads as a
           measurement; an arrow, lean or winner-colour would point the same way
           on 38 of 39 rows and stop being seen within three. */
        + '<td class="dec"><span class="decwrap'+(g>=C.BUILD_RAISED.DECOUPLED_THRESHOLD?' wide':'')+'">'
        +   '<span class="dv">'+g.toFixed(1)+'</span>'
        +   '<span class="decrule" title="Distance between the network and token scores, magnitude only">'
        +     '<u class="t25"></u><u class="t50"></u><u class="t75"></u>'
        +     '<i style="width:'+pct.toFixed(1)+'%"></i></span>'
        +   '</span></td>'
        /* ⛔ ROUND 3 · THE STANDALONE `CATALYSTS` COLUMN IS GONE — it was
           redundant beside the mix bar, which is built from the same rows.
           ⛔⛔ BUT THE COUNT DOES NOT LEAVE THE PAGE. It is a Proof-Rule item,
              free at every tier, and it is the number a sceptic uses to check
              our arithmetic. It is PRINTED beside the bar, not hidden in the
              tooltip: a tooltip is hover-only, so it does not exist on touch,
              in a scan, or in a screenshot. */
        /* ⛔ ROUND 4 · (a) the count moves to the RIGHT of the bars, and it
           stays PRINTED: free at every tier, and the number a sceptic checks
           our arithmetic against. Not tooltip-only.
           (b) the small `i` icon beside the bars is gone. The tooltip is
           attached to the BARS themselves, which is where the pointer goes.
           (c) the tooltip is TWO lines, in the shape the operator set.
           ⭐ 2026-08-17 · IT NOW NAMES THE FIELD IT COUNTED. The blocks are
              each catalyst's OWN TOKEN SCORE, banded — not a direction flag —
              and the second line is the point of the whole change: the bar and
              the Token column are the same evidence, one as a shape and one as
              an average. ⛔ Do not shorten it back to the terse one-liner. */
        + '<td class="mix"><span class="mixwrap">'
        +   '<button type="button" class="mixbtn tipbar" aria-expanded="false" '
        +     'aria-label="Catalyst mix">'+mseg
        +     '<span class="tipbox" role="tooltip">Token score for each of the '+t.cat+' catalysts: '
        +     t.mix[0]+' '+mixWords[0]+', '+t.mix[1]+' '+mixWords[1]+', '+t.mix[2]+' '+mixWords[2]
        +     '.<span class="tipl2">The Token column is their average.</span></span></button>'
        +   '<b class="cnum">'+t.cat+'</b>'
        +   '</span></td>'
        + '</tr>';
    }

    var FKEY = { tnt:'tnt', tok:'tok', net:'net', tec:'tec', cat:'cat' };
    function visible(){
      return rows.filter(function(t){
        if (FILTER === 'all') return true;
        if (FILTER === 'decoupled') return gap(t) >= C.BUILD_RAISED.DECOUPLED_THRESHOLD;
        return t.tntB === FILTER.toUpperCase();
      });
    }
    function sorted(list){
      var a = list.slice(), k = SORT.key, s = (SORT.dir==='asc') ? -1 : 1;
      /* plain relational sort, deliberately avoiding the String builtin whose
         name contains the dropped destination's, so a grep for that
         destination returns zero hits anywhere in this folder */
      if (k === 'asset') return a.sort(function(x,y){
        return (SORT.dir==='desc'?-1:1) * (x.tk < y.tk ? -1 : x.tk > y.tk ? 1 : 0); });
      if (k === 'dec') return a.sort(function(x,y){ return s * (gap(y) - gap(x)); });
      var f = FKEY[k] || 'tnt';
      return a.sort(function(x,y){ return s * (y[f] - x[f]) || (y.tnt - x.tnt); });
    }
    function render(){
      var v = sorted(visible());
      $('boardBody').innerHTML = v.map(rowHTML).join('');
      /* ⭐ ROUND 6 · NAMED TERMINOLOGY EXCEPTION, operator-ruled: this one
         string reads `coins`. It still counts down under a filter — `8 of 39
         coins` — and that behaviour is unchanged. */
      $('filterCount').textContent = v.length + ' of ' + rows.length + ' coins';
      /* ⭐ ROUND 5 · THE DESCRIPTIVE TEXT SITS UNDER THE CHIPS AND CHANGES WITH
         THE SELECTED ONE. A single sentence describing the whole table is wrong
         the moment a filter is applied, and the `all` string is the only place
         left on the page that says what the product is FOR.
         ⚠ The decoupled cutoff is SUBSTITUTED, never typed: it is build-invented
           and unruled, so the sentence must follow whatever the chip applies. */
      if ($('bandLede')) {
        var lede = C.BAND_LEDE[FILTER] || C.BAND_LEDE.all;
        $('bandLede').textContent =
          lede.replace('{d}', C.BUILD_RAISED.DECOUPLED_THRESHOLD.toFixed(1));
      }
      /* A5 · THE `DECOUPLED` CHIP IS NOW LOAD-BEARING. Removing the flagged
         strip took away the only surface the 2nd and 3rd widest gaps had, and
         this chip is what recovers them — so it states its THRESHOLD on the
         control itself. Without the number a room reads DECOUPLED as a VERDICT
         rather than a CUTOFF.
         ⚠ 1.0 is BUILD-INVENTED with no canon behind it and stays OPEN in the
           config. FIVE boards sit exactly ON the line, so it is stated as
           "at 1.0 or more" and never as "above 1.0" — the inclusive choice
           nearly doubles the figure. */
      var fn = $('filterNote');
      if (fn) {
        var on = (FILTER === 'decoupled');
        fn.hidden = !on;
        if (on) {
          var atLine = rows.filter(function(t){
            return Math.abs(gap(t) - C.BUILD_RAISED.DECOUPLED_THRESHOLD) < 1e-9; }).length;
          fn.innerHTML = '<b>' + v.length + ' of ' + rows.length + '</b> boards at a gap of '
            + C.BUILD_RAISED.DECOUPLED_THRESHOLD.toFixed(1) + ' or more. <b>' + atLine
            + '</b> of them sit exactly on the line. The 1.0 cutoff is <b>build-invented and unruled</b>: '
            + 'it is a threshold, not a verdict.';
        }
      }
      Array.prototype.forEach.call($('boardBody').querySelectorAll('.starbtn'), function(b){
        b.addEventListener('click', function(){
          if (TIER === 'unregistered') { alert('Create a free account to build a watchlist.'); return; }
          WATCHED[b.getAttribute('data-tk')] = !WATCHED[b.getAttribute('data-tk')];
          render(); renderWatchlist();
        });
      });
      bindTips($('boardBody'));   /* the per-row catalyst-mix tips */
      paintPrices();          /* ⛔ every tbody rebuild MUST end here */
    }

    Array.prototype.forEach.call(document.querySelectorAll('th.srt'), function(th){
      function go(){
        var k = th.getAttribute('data-sort');
        if (SORT.key === k) SORT.dir = (SORT.dir==='desc') ? 'asc' : 'desc';
        else { SORT.key = k; SORT.dir = (k==='asset') ? 'asc' : 'desc'; }
        Array.prototype.forEach.call(document.querySelectorAll('th.srt'), function(o){
          if (o.getAttribute('data-sort') === SORT.key)
            o.setAttribute('aria-sort', SORT.dir==='asc' ? 'ascending' : 'descending');
          else o.removeAttribute('aria-sort');
        });
        render();
      }
      th.addEventListener('click', go);
      th.addEventListener('keydown', function(e){
        if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });
    });
    Array.prototype.forEach.call($('filters').querySelectorAll('.filter'), function(b){
      b.addEventListener('click', function(){
        FILTER = b.getAttribute('data-f');
        pressAll($('filters').querySelectorAll('.filter'), 'data-f', FILTER);
        render();
      });
    });
    /* ⛔ ROUND 6 · THE JUMP CONTROL IS DELETED with the card that carried it.
       ⛔⛔ WHAT IT POINTED AT IS NOT DELETED. `exception` above still feeds the
          footer statement's count, and every row still gets the `is-exception`
          class when its coin score beats its network score — which paints JST
          gold on the table. THAT is how the one counter-example stays findable
          without a card, and the tint is a standing commitment: do not remove
          `table.tok tbody tr.is-exception` from alpha.css. */

    function renderWatchlist(){
      renderWatchPanel();
      if ($('myWatchlist'))          $('myWatchlist').innerHTML = mineHTML(false);
      if ($('suggestedWatchlist'))   $('suggestedWatchlist').innerHTML = suggestedHTML();
      if ($('suggestedNote'))        $('suggestedNote').textContent = suggestedNote();
    }

    /* --- PRICING · ➕ A NEW SURFACE ---------------------------------------
       ⛔ ITS JOB IS TO PROVOKE THE RULINGS, NOT TO STATE THEM. The registered
          column is marked UNRULED — E2 and the analytics line UNRULED — AI-3,
          with the same drawnAs treatment already used on AI-1 / AI-2. Filling
          them with a guess would launder an open question into a decided one.
       ⛔ GUARD — the offer language is marked MOCKUP-ONLY in the config AND in
          the DOM, and this renderer FAILS LOUDLY if the page is ever served
          from anywhere but a local host. Internal today is not internal forever.
       ⛔ No signup queue, no cap, no scarcity, no early-entry string anywhere. */
    function nonLocalHost(){
      var h = location.hostname;
      return !!h && h !== 'localhost' && h !== '127.0.0.1' && h !== '::1' && h !== '0.0.0.0';
    }
    function renderPricing(){
      var el = $('pricingBody'); if(!el) return;
      var P = C.PRICING, h = '';
      if (P.MOCKUP_ONLY && nonLocalHost()) {
        h += '<div class="hard-fail">MOCKUP-ONLY PRICING RENDERED ON A NON-LOCAL HOST ('
          +  esc(location.hostname) + '). This surface is INTERNAL ALPHA and is not an offer. '
          +  'A public build must remove it or rule it, not ship it.</div>';
      }
      h += '<div class="mockup-mark" data-mockup-only="true">'+esc(P.mockupBanner)+'</div>';
      h += '<div class="plans">' + P.plans.map(function(p){
        var current = (p.key === TIER);
        return '<div class="plan'+(current?' current':'')+(p.open?' has-open':'')+'" data-mockup-only="true">'
          + (current ? '<div class="plan-demo">DEMO CONTROL · YOU ARE VIEWING AS THIS TIER</div>' : '')
          + '<div class="plan-name">'+esc(p.name)+'</div>'
          + '<div class="plan-blurb">'+esc(p.blurb)+'</div>'
          + '<div class="plan-price" data-mockup-only="true">'
          +   '<span class="pp-dash">—</span>'
          +   '<span class="pp-unruled">'+esc(P.priceUnruledLabel)+'</span></div>'
          + (p.open ? '<div class="open-tag">UNRULED · '+esc(p.open)+'</div>'
                    + '<p class="plan-open">'+esc(p.openNote)+'</p>' : '')
          + '<ul class="plan-list">' + p.includes.map(function(i){
              var ai3 = i.indexOf('AI-3') >= 0;
              return '<li'+(ai3?' class="marked"':'')+'>'+esc(i)+'</li>';
            }).join('') + '</ul>'
          + '<div class="gatebar"><span class="gtxt">'+esc(C.BRAND.gatePrinciple)+'</span>'
          +   '<span class="gact"><a href="index.html#/hws" data-goto="hws">How we score</a></span></div>'
          + '</div>';
      }).join('') + '</div>';
      h += '<p class="one plan-foot">'+esc(P.switcherNote)+'</p>';
      el.innerHTML = h;
    }

    /* --- NAV STUBS · ⛔ nothing 404s, and no stub answers an open question - */
    function renderStubs(){
      var S = C.STUBS;
      if ($('stubResearch')) {
        $('stubResearch').innerHTML = '<p class="lede">'+esc(S.research.lede)+'</p>'
          + '<div class="open-tag">UNRULED · '+esc(S.research.open)+'</div>'
          + '<p class="one stub-body">'+esc(S.research.body)+'</p>'
          + '<p class="one stub-body"><b>'+esc(S.research.matrix)+'</b></p>';
      }
      if ($('stubHws')) {
        $('stubHws').innerHTML = '<p class="lede">'+esc(S.hws.lede)+'</p>'
          + '<p class="one stub-body">'+esc(S.hws.body)+'</p>'
          + '<div class="axes">' + S.hws.axes.map(function(a){
              return '<div class="ax"><b>'+esc(a[0])+'</b><span>'+esc(a[1])+'</span></div>';
            }).join('') + '</div>'
          + '<div class="axes bands"><div class="ax"><b class="bull">Bullish</b><span>5.6 – 10</span></div>'
          + '<div class="ax"><b class="neut">Neutral</b><span>4.5 – 5.5</span></div>'
          + '<div class="ax"><b class="bear">Bearish</b><span>1.0 – 4.4</span></div></div>'
          + '<p class="one stub-body"><b>'+esc(C.BRAND.gatePrinciple)+'</b></p>';
      }
      if ($('stubMarket')) {
        $('stubMarket').innerHTML = '<p class="lede">'+esc(S.market.lede)+'</p>'
          + '<div class="aud" style="max-width:520px"><button class="play" aria-label="Play">▶</button>'
          + '<div class="meta"><div class="t">'+esc(S.market.showName)+'</div>'
          + '<div class="e">Weekly · two voices</div></div><span class="l">8–15 min</span></div>'
          + '<p class="one stub-body">'+esc(S.market.body)+'</p>';
      }
    }

    /* --- board provenance · ⛔ ROUND 5 · NOW BELOW THE TABLE ----------------
       ⛔⛔ ALWAYS VISIBLE, PLAIN WORDS, NEVER A TOOLTIP. Scores displayed with
          no statement of how fresh they are is a defect. POSITION was the
          operator's call; hiding it behind an interaction is not on offer —
          it may not become a tooltip, an accordion or a "show details" toggle.
       ⛔ TWO DATE RANGES, RENDERED SEPARATELY. Never one blended "updated":
          they diverge by design and by a lot.
       ⛔ THE CALIBRATION SPLIT IS DELETED, NOT RELOCATED — the `v2.1 on 35 ·
          v2.2 on 4` stamp and its tooltip are both gone, and so is the
          PROVENANCE.calibration field they read. It is internal, it means
          nothing to an outsider, and it is temporary: by beta every coin is on
          the current scoring method and the split stops existing. The per-row
          `cal` field is untouched — that is data, not a surface. */
    var P = C.PROVENANCE;
    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function niceDate(iso, withMonth){
      var p = String(iso).split('-');
      if (p.length !== 3) return esc(iso);
      var d = String(Number(p[2]));
      return withMonth === false ? d : d + ' ' + MONTHS[Number(p[1]) - 1];
    }
    /* drop the repeated month on a same-month range: "5–12 Aug", not "5 Aug–12 Aug" */
    function range(from, to){
      var sameMonth = from.slice(0,7) === to.slice(0,7);
      return niceDate(from, !sameMonth) + '–' + niceDate(to);
    }
    $('boardAsof').innerHTML =
        '<span class="fr">Fundamentals updated <b>' + range(P.fundamentalsFrom, P.fundamentalsTo) + '</b></span>'
      + '<span class="fr">Technicals <b>' + range(P.technicalsFrom, P.technicalsTo) + '</b></span>';

    bindTier(function(){ render(); renderWatchlist(); renderPricing(); });
    /* ⛔ 2026-08-17 · THE HINT STRING IS DELETED on the homepage. It was
       truncating to `…read the board c…` inside its 270px box, so it was
       carrying no meaning anyway, and the pills beside it already say what can
       be asked. ⚠ The token page passes its own hint and is untouched. */
    bindBuzz('', C.BUZZ.barChips);
    render(); renderWatchlist(); renderPricing(); renderStubs();
    bindTips(document);            /* the column-header tips */
    measureSticky();               /* pin the header row under the control bar */
    /* every nav destination resolves to a view on this page — nothing 404s */
    bindRouter(function(){ paintPrices(); });
    paintPrices(true);
    setInterval(function(){ paintPrices(true); }, 600000);
  }

  /* ======================================================================
     ===============  TOKEN PAGE  =========================================
     ====================================================================== */
  function initToken(){
    assertLiveData();
    renderNav('coins');
    var T = C.TOKEN;

    /* --- helpers shared by the band, the catalyst table and technicals ---- */
    function bandOf(v){ return v >= 5.6 ? 'BULLISH' : v >= 4.5 ? 'NEUTRAL' : 'BEARISH'; }
    function pct10(v){ return (v - 1) / 9 * 100; }   /* left% = (value − 1) / 9 × 100 */

    /* ⭐ THE DECOUPLING TRACK (v3 item C) — a 1–10 track carrying two marks,
       rendered in THREE places at the SAME SCALE: the verdict band, every
       worked catalyst row, and the catalyst averages row.
       ⛔ NO ARROW, NO LEAN, NO COLOUR ENCODING WHICH MARK IS LARGER — each
          mark is tinted by its OWN band. Digits stay everywhere the track
          renders: it is a second reading, never the only one. */
    function decTrack(tok, net){
      return '<span class="dtrack" role="img" aria-label="Token '+one(tok)
        + ' and Network '+one(net)+' on the shared 1 to 10 track">'
        + '<i class="dmark mt '+cls(bandOf(tok))+'" style="left:'+pct10(tok).toFixed(2)+'%"><u>T</u></i>'
        + '<i class="dmark mn '+cls(bandOf(net))+'" style="left:'+pct10(net).toFixed(2)+'%"><u>N</u></i>'
        + '</span>';
    }
    /* the ONE-MARK variant: an indicator is a coin-level reading carrying ONE
       score. Same track, same scale — one visual idiom, learned once, and a
       two-mark row (a catalyst) reads differently without a word said. */
    function oneTrack(v){
      return '<span class="dtrack one" role="img" aria-label="'+one(v)
        + ' on the shared 1 to 10 track">'
        + '<i class="dmark '+cls(bandOf(v))+'" style="left:'+pct10(v).toFixed(2)+'%"></i></span>';
    }
    /* v3 item E · THE ONE GATE AFFORDANCE — a locked row is a NAME plus THIS,
       nothing else. Not blurred, not expandable, no empty columns. */
    var LOCK = '<span class="lockico" title="Locked at this tier" aria-label="Locked at this tier">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
      + '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg></span>';

    /* --- C · breadcrumb + masthead, one unit ------------------------------ */
    $('mast').innerHTML =
        '<span class="tlogo"><img src="'+LOGO_DIR+esc(T.tk)+'.svg" alt=""></span>'
      + '<div><div class="nm">'+esc(T.nm)+'</div><div class="tk">'+esc(T.tk)
      +   ' · /token/'+esc(T.slug)+'</div></div>'
      + '<div class="price"><div class="p mh-price" data-cgid="'+esc(T.cg)+'">—</div>'
      +   '<span class="asof">live · 24h move</span></div>';

    /* --- D · THE VERDICT BAND (v3 item A) ---------------------------------
       The lede, the two peer blocks and the composite merged into ONE band.
       The composite ON the band is operator-ruled 2026-08-18. Fundamentals
       and Technicals keep IDENTICAL header treatment and equal block weight —
       moving the dial up does not demote Technicals. Both as-of dates render
       cold. ⛔ Only TNT is ever a gauge. */
    $('tntSection').innerHTML = gaugeCard({
      label: 'TNT SCORE · THE COMPOSITE', score: T.tnt, band: T.tntB
    });
    var coinGap = Math.abs(T.net - T.tok);
    $('vbFund').innerHTML =
        '<div class="blk-head"><h2 class="sec-h">Fundamentals</h2>'
      +   '<span class="spacer"></span><span class="tf-tag">Catalyst-driven</span></div>'
      + '<div class="vb-scores">'
      +   '<div class="vb-srow"><span class="microlabel">Network</span>'
      +     '<b class="num '+cls(T.netB)+'">'+one(T.net)+'</b>'
      +     '<span class="bandw '+cls(T.netB)+'">'+esc(T.netB)+'</span></div>'
      +   '<div class="vb-srow"><span class="microlabel">Token</span>'
      +     '<b class="num '+cls(T.tokB)+'">'+one(T.tok)+'</b>'
      +     '<span class="bandw '+cls(T.tokB)+'">'+esc(T.tokB)+'</span></div>'
      + '</div>'
      + '<div class="vb-track">'+decTrack(T.tok, T.net)
      +   '<div class="dt-ends"><span>1</span><span class="dt-lbl">decoupling '
      +   coinGap.toFixed(1)+'</span><span>10</span></div></div>'
      + '<div class="fresh">As of <b>'+esc(T.asOf)+'</b> · '+T.catalystCount+' catalyst rows</div>';
    $('vbTech').innerHTML =
        '<div class="blk-head"><h2 class="sec-h">Technicals</h2>'
      +   '<span class="spacer"></span><span class="tf-tag">'+esc(T.ta.timeframe)+'</span></div>'
      + '<div class="vb-scores">'
      +   '<div class="vb-srow"><span class="microlabel">Composite</span>'
      +     '<b class="num '+cls(T.ta.band)+'">'+one(T.ta.composite)+'</b>'
      +     '<span class="bandw '+cls(T.ta.band)+'">'+esc(T.ta.band)+'</span></div>'
      + '</div>'
      + '<p class="one vb-tanote">Ten indicators, daily candle.</p>'
      + '<div class="fresh">As of <b>'+esc(T.taAsOf)+'</b> · valid one week</div>';

    /* --- E · CATALYST ROWS · a RULE, not a number. Counts run 5–21. ------- */
    var SIG = { High:3, Med:2, Low:1 };
    var ordered = T.catalysts.slice().sort(function(a,b){
      return (SIG[b.sig]-SIG[a.sig]) || (Math.abs(b.net-b.tok)-Math.abs(a.net-a.tok))
           || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    });
    var ARTICLES = T.articles || [];
    function rowArticles(id){ return ARTICLES.filter(function(a){ return a.rowId === id; }); }

    /* v3 item O · the tier allowance is a RULE, never a hard-coded count.
       Unregistered = top quarter by significance, rounded down, minimum one. */
    function allowance(rule, n){
      if (rule === 'all') return n;
      if (rule === 'top-half-by-significance-rounded-down') return Math.floor(n / 2);
      if (rule === 'top-quarter-by-significance-rounded-down-minimum-one') return Math.max(1, Math.floor(n / 4));
      return 1;
    }

    /* v3 item I · WHICH ROW OPENS ON LOAD: the most significant row whose
       phase is PRE — `ordered` already carries the tiebreak (significance desc
       → larger decoupling gap desc → row_id asc). ⛔ REQUIRED FALLBACK: no PRE
       row → the most significant row overall. No badge, no featured chrome,
       no pinning. Multiple rows may be open after that. */
    var openOnLoad = ordered.filter(function(c){ return c.phase === 'PRE'; })[0] || ordered[0];
    var OPEN_CATS = {}; OPEN_CATS[openOnLoad.id] = true;

    function catRows(shownN){
      var h = '';
      ordered.forEach(function(c, i){
        /* ⛔ v3 item N · EVERY row carries its row_id as its DOM id, byte-exact,
           locked rows included — the ruled catalyst address is
           /token/<url_slug>#<row_id>. The WHOLE row_id, never the suffix:
           short suffixes collide across coins. IDs are data, labels are chrome. */
        if (i >= shownN) {
          /* v3 item E · A LOCKED ROW IS: name + lock affordance ONLY. No
             scores, no track, no as-of, no sub-line, no article count, NOT
             expandable, NOT blurred. Reduced height, no empty columns. */
          h += '<tr class="cat-row locked" id="'+esc(c.id)+'"><td class="lft" colspan="5">'
            +  '<span class="cat-name">'+esc(c.name)+'</span>'+LOCK+'</td></tr>';
          return;
        }
        var open = !!OPEN_CATS[c.id];
        var arts = rowArticles(c.id);
        /* v3 item D · #560 — the direction tag is GONE. The live product
           carries no direction field and bands from scores. The sub-line is
           significance · phase · article count, nothing else. */
        var sub = esc(c.sig).toUpperCase()+' · '+esc(c.phase)
                + (arts.length ? ' · '+arts.length+' research piece'+(arts.length>1?'s':'') : '');
        h += '<tr class="cat-row" id="'+esc(c.id)+'" data-i="'+i+'" role="button" tabindex="0" '
          +   'aria-expanded="'+open+'">'
          +   '<td class="lft"><span class="exp-ind">❯</span><span class="cat-name">'+esc(c.name)+'</span>'
          +     '<span class="cat-sub">'+sub+'</span></td>'
          +   '<td><span class="mono asofcell">'
          +     (c.worked && c.worked.gapFlag ? '<b class="gapmark">◆</b> ' : '')+esc(c.asof)+'</span></td>'
          +   '<td class="trkcell">'+decTrack(c.tok, c.net)+'</td>'
          +   '<td><span class="sc '+cls(bandOf(c.net))+'">'+one(c.net)+'</span></td>'
          +   '<td><span class="sc '+cls(bandOf(c.tok))+'">'+one(c.tok)+'</span></td>'
          + '</tr>';
        /* worked rows expand and collapse IN PLACE — inset beneath their own
           row, full width, pushing the rest down. No drawer, no modal, no
           detail page; the parent keeps full contrast, its track and digits.
           A closed row renders NO hidden detail row. */
        if (open) h += '<tr class="detail-row"><td colspan="5">'+catDetail(c)+'</td></tr>';
      });

      /* ✅ the averages row ALWAYS renders, at every tier, reconciling to the
         verdict band — the IDENTICAL mark pair at the same scale. v3 item F:
         the old no-account-needed arithmetic claim was FALSE at two of three
         tiers and is replaced by the tier-true count line below. That phrasing
         is never reinstated. The count, both averages and every date stay
         free. */
      h += '<tr class="avg-row"><td class="lft"><span class="lbl">Averages · all '
        +  ordered.length+' rows</span>'
        +  '<span class="avg-cap">Averaged over all '+ordered.length+' rows. '
        +  shownN+' shown at this tier.</span></td>'
        +  '<td></td>'
        +  '<td class="trkcell">'+decTrack(T.tok, T.net)+'</td>'
        +  '<td><span class="sc '+cls(T.netB)+'">'+one(T.net)+'</span></td>'
        +  '<td><span class="sc '+cls(T.tokB)+'">'+one(T.tok)+'</span></td></tr>';
      return h;
    }

    /* v3 item H · row-level research listing — title by name with its scope
       label, PLAIN TEXT (nothing is published yet; no anchor, no invented
       slug, no dates). A cross-coin title never renders unlabelled. */
    function articleLines(arts){
      if (!arts.length) return '';
      return '<h4>Research on this row</h4>'
        + arts.map(function(a){
            return '<div class="rrow"><span class="rtitle">'+esc(a.title)+'</span>'
              + '<span class="rscope mono">'+esc(a.scope)+'</span></div>';
          }).join('')
        + '<p class="one rnote">Not yet published — title only.</p>';
    }

    function catDetail(c){
      var w = c.worked, arts = rowArticles(c.id);
      if (!w) {
        /* Rows without a fully-worked write-up in this mockup still show their
           real scores and sources; the RESEARCH dossier itself is paid. */
        var srcs = '<div class="srcs">' + c.srcs.map(function(s){
          return '<div class="src"><b>'+esc(s)+'</b><span>Fact-audit entry</span></div>'; }).join('') + '</div>';
        return '<div class="detail-in"><h4>Sources behind this row</h4>' + srcs
          + (C.TIERS.token.researchDossier[TIER]
              ? '<h4>Analytic read</h4><p><b>Mispricing:</b> '+esc(c.paid.mispricing)
                + ' · <b>Network read:</b> '+esc(c.paid.networkRead)
                + ' · <b>Scope:</b> '+esc(c.paid.scope)+'</p>'
              : '<div class="gatebar"><span class="gtxt">The transmission write-up, the for-and-against '
                + 'and the mispricing read for this row are paid.</span><span class="gact">'
                + '<a href="#">How we score</a><a class="solid" href="#">See plans</a></span></div>')
          + articleLines(arts)
          + '</div>';
      }
      var h = '<div class="detail-in">'
        + '<h4>What it is</h4><p>'+esc(w.what)+'</p>'
        + '<h4>Transmission — does it reach the token?</h4><p>'+esc(w.transmission)+'</p>'
        + '<h4>The announced-claim record</h4>'
        + '<table class="rectab"><tr><th>Month</th><th>Announced</th><th>% of ceiling</th></tr>'
        + w.record.map(function(r){ return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>'; }).join('')
        + '</table>'
        + '<h4>The case against</h4><p>'+esc(w.against)+'</p>'
        + '<h4>Network read</h4><p>'+esc(w.networkRead)+'</p>'
        + '<h4>Sources</h4><div class="srcs">'
        + w.sources.map(function(s){
            return '<div class="src"><b>'+esc(s[0])+'</b><span>'+esc(s[1])+' — <i>'+esc(s[2])
                 + '</i></span><span class="d">'+esc(s[3])+'</span></div>'; }).join('')
        + '</div>';
      if (w.gapFlag) {
        h += '<h4>What we do not know</h4>';
        h += C.TIERS.token.gapDetail[TIER]
          ? '<p>The cumulative burn count does not reconcile across sources, and the forward per-month '
            + 'announced claims are not published until each 6th. Either would clear on a dated on-chain read.</p>'
          : '<p>One fact behind this row is recorded as a <b>[GAP]</b>. That it exists is free; '
            + 'what it is and what would clear it is paid.</p>';
      }
      if (C.TIERS.token.analyticColumns[TIER]) {
        h += '<h4>Analytic read</h4><p><b>Mispricing:</b> '+esc(c.paid.mispricing)
          +  ' · <b>Network read:</b> '+esc(c.paid.networkRead)
          +  ' · <b>Scope:</b> '+esc(c.paid.scope)+'</p>';
      }
      h += articleLines(arts);
      return h + '</div>';
    }

    /* --- M · CATALYSTS THAT HAVE NOT FIRED --------------------------------
       Filter the EXISTING rows on phase === 'PRE'. Invent nothing. ⛔ NO
       DATES — there is no event-date field; as_of is the SCORING date and is
       never presented as when the thing happens. Each entry links to its row
       via the item-N anchor, which resolves at every tier (locked rows carry
       theirs too). Zero PRE rows → the module does not render — no empty
       state. Heading = ONE config string (TOKEN.upcomingHeading). */
    function upcomingModule(){
      var pre = ordered.filter(function(c){ return c.phase === 'PRE'; });
      if (!pre.length) return '';
      return '<div class="upco"><div class="microlabel">'+esc(T.upcomingHeading)+'</div>'
        + '<div class="up-list">'
        + pre.map(function(c){
            return '<a class="up-item" href="#'+esc(c.id)+'">'
              + '<span class="up-name">'+esc(c.name)+'</span>'
              + '<span class="up-sig mono">'+esc(c.sig).toUpperCase()+'</span>'
              + '<span class="up-sc mono">N '+one(c.net)+' · T '+one(c.tok)+'</span></a>';
          }).join('')
        + '</div></div>';
    }

    /* --- Q · TECHNICALS — FIVE LAYERS, DESIGNED. ⛔ NOT one module and NOT a
       paragraph. A catalyst is an event attaching to a coin carrying TWO
       scores; an indicator is a coin-level reading carrying ONE — the shared
       track at the same scale, with one mark instead of two, makes that
       distinction legible without a word of explanation.
       ⛔ NINE OF THE TEN NARRATIVES DO NOT EXIST (narrativesInPayload:false).
          Only MACD's workedNarrative is in the payload. Nothing is invented,
          no empty expansion is drawn, and no layer a tier has paid for is
          locked. The fifth layer renders as SILENCE, on purpose. */
    var OPEN_TA = {}; OPEN_TA[T.ta.workedIndicator] = true;   /* the worked read, open on load */

    /* ⛔ LEVELS SIT ON A PRICE AXIS SHARING NO SCALE WITH THE SCORE TRACK.
       The design rests on one 1–10 track meaning one thing everywhere;
       support and resistance are dollars, drawn as a different object. */
    function priceAxis(ta){
      function pnum(s){ return parseFloat(String(s).replace(/[^0-9.]/g,'')); }
      var sup = ta.levels.support.map(pnum), res = ta.levels.resistance.map(pnum);
      var all = sup.concat(res); all.push(pnum(ta.priceAtAnalysis));
      var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
      var pad = (hi - lo) * 0.04; lo -= pad; hi += pad;
      function px(v){ return ((v - lo) / (hi - lo) * 100).toFixed(2); }
      return '<div class="paxis"><span class="pax-line"></span>'
        + sup.map(function(v,i){ return '<i class="pax-dot sup" style="left:'+px(v)+'%" '
            + 'title="Support '+esc(ta.levels.support[i])+'"></i>'; }).join('')
        + res.map(function(v,i){ return '<i class="pax-dot res" style="left:'+px(v)+'%" '
            + 'title="Resistance '+esc(ta.levels.resistance[i])+'"></i>'; }).join('')
        + '<i class="pax-now" style="left:'+px(pnum(ta.priceAtAnalysis))+'%" '
        +   'title="Price at analysis '+esc(ta.priceAtAnalysis)+'"></i>'
        + '</div>'
        + '<div class="pax-key mono"><span>● support · below the line</span>'
        + '<span>■ resistance · above the line</span><span>▲ price at analysis</span></div>'
        + '<p class="one pax-note">Price, not score. A different axis on purpose.</p>'
        + '<div class="pax-mono mono">Support '+ta.levels.support.map(esc).join(' · ')+'</div>'
        + '<div class="pax-mono mono">Resistance '+ta.levels.resistance.map(esc).join(' · ')+'</div>'
        + '<div class="pax-mono mono">'+ta.levels.ema.map(esc).join(' · ')+'</div>'
        + '<div class="pax-mono mono">Fib '+ta.levels.fib.map(esc).join(' · ')+'</div>'
        + '<p class="one pax-inval"><b>Invalidation:</b> '+esc(ta.invalidation)+'</p>';
    }

    function taModule(){
      var ta = T.ta;
      var showAll = (C.TIERS.token.taIndicators[TIER] === 'all-ten');
      var shownN = showAll ? ta.indicators.length : 1;
      var narr = !!C.TIERS.token.taNarratives[TIER];
      var lvls = !!C.TIERS.token.taLevels[TIER];
      var sum = 0; ta.indicators.forEach(function(i){ sum += i.s; });
      var h = '';

      /* layer 1 · composite header — FREE at every tier, both dates cold */
      h += '<div class="ta-head">'
        +  '<b class="ta-num '+cls(ta.band)+'">'+one(ta.composite)+'</b>'
        +  '<span class="ta-hword mono">composite · <b class="'+cls(ta.band)+'">'+esc(ta.band)+'</b></span>'
        +  '<span class="ta-count mono">'+ta.indicators.length+' indicators · '+shownN+' shown</span></div>'
        +  '<div class="ta-sub"><span class="one">Ten indicators, daily candle.</span>'
        +  '<span class="fresh">As of <b>'+esc(ta.asOf)+'</b> · valid one week · price at analysis '
        +  esc(ta.priceAtAnalysis)+'</span></div>';

      /* layer 2 · ten single-line rows on the shared track — the SAME gate
         idiom as the catalyst table: beyond the tier's allowance a row is its
         NAME plus the lock, nothing else. */
      h += '<div class="microlabel talab">Indicators</div><div class="ta-rows">';
      ta.indicators.forEach(function(ind){
        var isWorked = (ind.k === ta.workedIndicator);
        if (!showAll && !isWorked) {
          h += '<div class="ta-row locked"><span class="ta-name">'+esc(ind.k)+'</span>'+LOCK+'</div>';
          return;
        }
        /* layer 3 · the written reads are ROW EXPANSIONS, one per indicator,
           paid — except the ONE worked indicator, whose narrative is the free
           demonstration at every tier. At paid the other nine expand to their
           read line and score only, each saying the mockup carries one of ten. */
        var expandable = isWorked || narr;
        var open = expandable && !!OPEN_TA[ind.k];
        h += '<div class="ta-row'+(expandable?' can':'')+'"'
          +  (expandable ? ' data-k="'+esc(ind.k)+'" role="button" tabindex="0" aria-expanded="'+open+'"' : '')
          +  '>'+(expandable ? '<span class="exp-ind">❯</span>' : '<span class="exp-spacer"></span>')
          +  '<span class="ta-name">'+esc(ind.k)+'</span>'
          +  oneTrack(ind.s)
          +  '<b class="ta-sc mono '+cls(bandOf(ind.s))+'">'+one(ind.s)+'</b></div>';
        if (open) {
          h += '<div class="ta-exp">'
            + (isWorked
                ? '<p>'+esc(ta.workedNarrative)+'</p>'
                : '<p><b>'+esc(ind.read)+'</b> · score '+one(ind.s)+'</p>'
                  + '<p class="one">This mockup carries one written read of ten — the worked '
                  + esc(ta.workedIndicator)+' above.</p>')
            + '</div>';
        }
      });
      /* ✅ the averages row always renders, so a reader can check the
         composite exactly as the catalyst table's averages row does. */
      h += '<div class="ta-row avg"><span class="exp-spacer"></span>'
        +  '<span class="ta-name lbl">Average of all '+ta.indicators.length+' indicators</span>'
        +  oneTrack(ta.composite)
        +  '<b class="ta-sc mono '+cls(ta.band)+'">'+one(ta.composite)+'</b></div>';
      h += '</div>';
      h += '<p class="one ta-avgnote">The ten scores sum to '+sum.toFixed(1)+' and average '
        +  (sum / ta.indicators.length).toFixed(2)+' — the published composite '+one(ta.composite)
        +  ' to one decimal.</p>';

      /* layer 4 · support / resistance / invalidation — the separate PRICE
         axis. At unregistered it is ONE locked row, same idiom. */
      h += '<div class="microlabel talab">Levels</div>';
      if (lvls) h += '<div class="ta-levels">'+priceAxis(ta)+'</div>';
      else h += '<div class="ta-rows"><div class="ta-row locked">'
        +  '<span class="ta-name">Support · resistance · invalidation</span>'+LOCK+'</div></div>';

      /* free at every tier */
      h += '<p class="ta-deep"><a href="'+esc(ta.deepLink)+'" class="mono">'
        +  esc(ta.deepLinkLabel)+' →</a></p>';
      return h;
    }

    /* --- G · AUDIO · two rows, content unchanged; never an empty state.
       The register gate on the per-token edition wears the ONE lock idiom. -- */
    function audioModule(){
      var A = C.TIERS.token, a = T.audio, h = '';
      h += '<div class="aud"><button class="play" aria-label="Play">▶</button><div class="meta">'
        +  '<div class="t">'+esc(a.market.title)+'</div>'
        +  '<div class="e">'+esc(a.market.ep)+' · '+esc(a.market.voices)+'</div></div>'
        +  '<span class="l">'+esc(a.market.len)+'</span></div>';
      if (A.audioTokenCurrent[TIER]) {
        h += '<div class="aud"><button class="play" aria-label="Play">▶</button><div class="meta">'
          +  '<div class="t">'+esc(a.token.title)+'</div>'
          +  '<div class="e">'+esc(a.token.ep)+'</div></div>'
          +  '<span class="l">'+esc(a.token.len)+'</span></div>';
      } else {
        h += '<div class="aud locked"><div class="meta"><div class="t">'+esc(a.token.title)+'</div></div>'
          +  LOCK+'</div>';
      }
      return h;
    }

    /* --- H · RESEARCH ON THIS COIN — the added block. All four titles,
       PLAIN TEXT, each with its scope label, free at every tier. The bottom
       block is the proper home of the token-led shape, not merely a gate
       floor. -------------------------------------------------------------- */
    function researchBlock(){
      return ARTICLES.map(function(a){
        return '<div class="r-item"><span class="rtitle">'+esc(a.title)+'</span>'
          + '<span class="rscope mono">'+esc(a.scope)+'</span></div>';
      }).join('');
    }

    function renderToken(){
      var shownN = allowance(C.TIERS.token.catalystRows[TIER], ordered.length);
      $('scorecardBody').innerHTML = catRows(shownN);
      /* worked rows toggle in place; locked rows carry NO handler at all */
      Array.prototype.forEach.call($('scorecardBody').querySelectorAll('.cat-row:not(.locked)'), function(r){
        function toggle(){ OPEN_CATS[r.id] = !OPEN_CATS[r.id]; renderToken(); }
        r.addEventListener('click', toggle);
        r.addEventListener('keydown', function(e){
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      });
      /* the ◆ legend is free and renders whenever a shown row carries one */
      if ($('gapLegend')) $('gapLegend').hidden = !$('scorecardBody').querySelector('.gapmark');
      $('catCount').textContent = ordered.length + ' rows · ' + shownN
        + ' shown · sorted by significance';
      if ($('upcoming')) $('upcoming').innerHTML = upcomingModule();
      $('taModule').innerHTML = taModule();
      Array.prototype.forEach.call($('taModule').querySelectorAll('.ta-row.can'), function(r){
        function toggle(){ var k = r.getAttribute('data-k'); OPEN_TA[k] = !OPEN_TA[k]; renderToken(); }
        r.addEventListener('click', toggle);
        r.addEventListener('keydown', function(e){
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      });
      $('audioModule').innerHTML = audioModule();
      if ($('researchList')) $('researchList').innerHTML = researchBlock();
      paintPrices();          /* ⛔ every re-render MUST end here (live prices) */
    }

    /* the nav's watchlist hover panel is shared chrome — it renders here too,
       and re-renders with the tier, exactly as it does on the board page */
    bindTier(function(){ renderToken(); renderWatchPanel(); });
    bindBuzz('Grounded in this token’s full stack.', C.BUZZ.chips);
    renderWatchPanel();
    renderToken();
    paintPrices(true);
    setInterval(function(){ paintPrices(true); }, 600000);
  }

  /* §F 18 (stitch 2026-09-01) · THE REPAINT HOOK IS EXPORTED. Every wave
     surface that rebuilds the board body from its own inline script - outside
     this closure - must end in ALPHA_PAGE.paintPrices(), or live prices
     silently revert to static text. The ⛔ comments at the internal call
     sites protect only calls made from inside this file; this export is what
     makes the rule obeyable from outside it. */
  return { initBoard: initBoard, initToken: initToken, paintPrices: paintPrices };
})();
