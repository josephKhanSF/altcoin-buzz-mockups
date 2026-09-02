/* ==========================================================================
   ALPHA MOCKUP · alpha-config.js  ·  2026-08-17
   Altcoin Buzz TNT Score — Version Alpha, homepage + token page.

   ⭐⭐ THIS FILE IS THE DELIVERABLE. THE HTML IS THE WRAPPER.
   The pages are expected to be thrown away. This object is not: it is the
   list of things we have NOT decided, rendered so the room can see the cost
   of each one.

   HOW TO READ IT
     // OPEN — <id>   a genuinely open question from UI_BRIEF §3. The page
                      renders FROM it. Closing it in the meeting = editing
                      one line here, not re-laying-out a page.
     // BUILD-RAISED  a decision this build had to take to draw anything, that
                      no canon file rules. Named so it is not laundered into
                      settled by having been drawn.
     // MEASURED      derived from disk 2026-08-17; the command is stated.

   DATA PROVENANCE — read from disk 2026-08-17, live files, NOT the archive:
     Channels/CH-003-altcoin-buzz/Leads/Token Scorecard/tnt_scoreboard.csv     39 rows
     Channels/CH-003-altcoin-buzz/Leads/Token Scorecard/catalyst_inventory.csv 405 rows
   (The decoy at .../Token Scorecard/archive/PRE_CALIBRATION_2026-07/ holds
    12 and 104 rows. Neither was read. Row counts are asserted at runtime —
    see BOARD_ASSERT below; a wrong-file build fails loudly instead of
    rendering a plausible quarter of the product.)
   ========================================================================== */

var ALPHA = (function () {
  'use strict';

  /* ======================================================================
     1 · OPEN QUESTIONS — UI_BRIEF §3. Nothing here is hard-coded in markup.
     ====================================================================== */
  var OPEN = {

    // OPEN — AI-1 · SCOPE. The 2026-08-17 ruling STRUCK REQ-30's single-token
    // boundary. Still open: whose coins may Ask Buzz look across — the user's
    // own watchlist only, or the whole board?
    // ⛔ DRAWING THE SITE-WIDE LAUNCHER DOES NOT SETTLE THIS. The launcher is a
    //    SURFACE ruling; this is a SCOPE ruling. They are different questions.
    // Bites: whether cross-coin chips are offered at all, and the wording of
    // disclosure part 3 (which currently reads "no other token" and is BACKWARDS).
    // Owner: operator.
    AI_1_SCOPE: {
      status: 'OPEN',
      choices: ['watchlist-only', 'whole-board'],
      drawnAs: 'whole-board',          // ⚠ DRAWN, NOT RULED. Shown so the room can react.
      owner: 'operator'
    },

    // OPEN — AI-2 · DEPTH. Structured COLUMNS only (a query over a table), or
    // the dossier PROSE too (a synthesis over eight documents)?
    // W4's view, offered not imposed: columns-only is strongest — cheaper, and
    // it avoids the cross-file blending that threatens citation accuracy, which
    // is the differentiator.
    // Bites: what an answer can look like and how citations render.
    // Owner: operator.
    AI_2_DEPTH: {
      status: 'OPEN',
      choices: ['columns-only', 'columns-plus-prose'],
      drawnAs: 'columns-plus-prose',   // ⚠ DRAWN, NOT RULED — the flagship answer
                                       //   cites RESEARCH prose. If AI-2 closes at
                                       //   columns-only, that answer is not buildable.
      owner: 'operator'
    },

    // OPEN — AI-3 · TIER. mispricing / network_read / impact_scope are PAID
    // (W4 §5 L370), so a cross-coin analytic query IS a paid query.
    // Answering AI-2 partly answers this. Bites: which chips carry a gatebar.
    AI_3_TIER: { status: 'OPEN', follows: 'AI-2', drawnAs: 'analytic-columns-paid' },

    // OPEN — AI-4 · LIMITS + FEATURE SET. Operator-raised 2026-08-17.
    // ITEM-3b says "graduated quotas" and NEVER SAYS A QUOTA OF WHAT.
    // Bites: the quota-exhausted state's copy, and whether a usage meter
    // renders at all. Unowned in every file read.
    AI_4_LIMITS: {
      status: 'OPEN',
      quotaUnit: null,                 // ⛔ deliberately null — no unit is ruled
      showUsageMeter: false,           // ⚠ BUILD CHOICE: a meter would imply a unit
      quotaCopy: 'You have used this period’s Ask Buzz allowance.',
      owner: 'operator / W3'
    },

    // OPEN — E1 / O2 · does a .com ARTICLE carry the ANALYTIC READ (the "so what")?
    // Digits-only is ruled; the analytic read is NOT. On the critical path for
    // pricing; does NOT block these two pages. Rendered here only so the slide
    // can say it is open.
    E1_ARTICLE_DEPTH: { status: 'OPEN', owner: 'operator + W3, before pricing' },

    // OPEN — E2 · WHAT IS THE REGISTERED TIER FOR?
    // It lost notifications to the broadcast ruling and nearly lost per-token
    // audio to the 250-coin ruling — both from other lanes, neither announced.
    // ⭐ It is the MIDDLE COLUMN of the tier toggle, i.e. the one the funnel
    //    runs through. Flip the switch to `registered` in the room and this
    //    question answers itself visually.
    E2_REGISTERED_TIER: { status: 'OPEN', owner: 'NEEDS AN OWNER' },

    // OPEN — COIN CATEGORY. RWA / L1 / DeFi is recorded NOWHERE. Not one of
    // tnt_scoreboard.csv's 23 columns is a chain/sector/category field, and
    // THAT HAS NOT CHANGED: three consumers are still waiting on it.
    // ⭐ 2026-09-02 (#592, #636) · THE CHIP IS NOW DRAWN, and this entry is
    //    REWRITTEN to say so rather than deleted. The sector programme ruled
    //    the row in (J3 `#612 §3`, J6 `#613 §1`), so the old "no sector chip
    //    is drawn" ban is no longer true and a stale ban is worse than none.
    // ⛔ WHAT IT IS DRAWN FROM IS A HAND-AUTHORED PROP MAP IN index.html
    //    (#591, #626) — one map, in the page, registered in
    //    Website/DUMMY_DATA_MANIFEST_2026-09-01.md. It is NOT config data, it
    //    is NOT derived from any CSV, and it must not be moved in here: this
    //    entry is a STATUS RECORD, not a data home.
    // ⛔ DO NOT DELETE THIS ENTRY. The record of the missing column is the
    //    only thing on the page that says the three consumers are still blocked.
    COIN_CATEGORY: {
      status: 'BLOCKED ON A CSV COLUMN',
      drawn: true,
      source: 'hand-authored prop map in index.html (#591) — production source is D5\'s CoinGecko category lookup, not yet a CSV column'
    },

    // OPEN — EMPTY / OUTAGE STATES. "no current TA article" · "no prior read" ·
    // OPEN-9's outage states are ONE unwritten spec. Every module needs a
    // defined empty state and none is ruled.
    // ✅ EXCEPT AUDIO, which IS ruled: never empty — latest episode, or no module.
    EMPTY_STATES: { status: 'OPEN — Step 2', audioRuled: 'never empty' },

    // OPEN — url_slug IS NOT YET A COLUMN. Proposed, site-owned, seeded from
    // lower(ticker). coingecko_id was weighed and REJECTED (disagrees with the
    // ticker on 37 of 39 rows, blank for FLR, and a third party would own our
    // permanent addresses). Slug lives HERE, never in markup.
    URL_SLUG: { status: 'PROPOSED', rule: 'lower(ticker)', rejected: 'coingecko_id' }
  };

  /* ======================================================================
     2 · BUILD-RAISED DECISIONS — taken to draw anything, ruled by nobody.
     ⛔ Read this section as a list of things to CONFIRM in the meeting.
     ====================================================================== */
  var BUILD_RAISED = {

    // BUILD-RAISED · THE "#" COLUMN IS NOT A MARKET-CAP RANK.
    // The brief calls column 1 "MARKET RANK". We hold NO market-cap, volume or
    // supply field anywhere in the 23 columns. What the live lead magnet
    // actually does — and its own comment says so — is pin the TNT rank ONCE
    // from the canonical order so a re-sort never renumbers it. That is the
    // behaviour the brief praises ("rows read 1 · 11 · 13 · 4 · 8 when sorted
    // by Token"); the LABEL "market rank" is a misreading of it.
    // ▶ DRAWN AS: stable TNT rank, pinned once, never renumbered.
    // ⛔ A market-cap rank would have to be invented. It was not.
    RANK_BASIS: 'tnt-rank-pinned-once',

    // BUILD-RAISED · NO PRICE MINI-CHART. Column 8 in the brief is a per-row
    // price mini-chart. We hold NO price history: the CSV carries one spot
    // price, and the live proxy returns { usd, pct24h } only. A drawn price
    // chart would be invented data wearing the costume of a measurement — the
    // expensive kind.
    // ▶ SUBSTITUTED: a CATALYST MIX bar (bull / neutral / bear segments per
    //   token, counted from catalyst_inventory.csv `direction`). Real, varies
    //   row to row, costs nothing, and is on-message. Counts reconcile to
    //   catalyst_count on 39 of 39 rows (checked).
    ROW_TEXTURE: 'catalyst-mix-bar (price mini-chart NOT drawn — no price series exists)',

    // OPEN — DECOUPLED-THRESHOLD (build-raised; not in brief §3, needs a ruling)
    // The DECOUPLED filter chip needs a number and canon gives none.
    // MEASURED over all 39 rows: |network − token| median 0.7 · max 1.9 (LINK) ·
    // min 0.1 · >= 0.5 on 28 of 39 (72%) · >= 1.0 on 12 of 39 (31%).
    // ⚠ Quote it as "31% at 1.0 or more". STRICTLY above 1.0 is 7 of 39 = 18%,
    //   because FIVE ROWS SIT AT EXACTLY 1.0 — the inclusive/exclusive choice
    //   nearly doubles the figure (CONVENTIONS §4a item 9).
    DECOUPLED_THRESHOLD: 1.0,

    // BUILD-RAISED · impact_scope IS BOTH "KEPT" AND "PAID".
    // UI_BRIEF §1a keeps the impact_scope ROW TAG as a v3 conformance; §4.2
    // lists impact_scope among the PAID analytic columns. Both are true of
    // different things, so this build reads it as: the COMPONENT survives, the
    // TIER MATRIX governs when it renders.
    // ▶ DRAWN AS: tag renders at PAID only; free tiers get the gatebar.
    // ⛔ CONFIRM THIS IN THE ROOM — if the tag is meant to be free, it is a
    //    one-line change here, but it is a tier-matrix change, not a style one.
    IMPACT_SCOPE_TIER: 'paid',

    // BUILD-RAISED · WHICH CATALYST ROW IS THE FREE ONE.
    // §4.2 says unregistered sees "the single HIGHEST-SIGNIFICANCE row, fully
    // worked". HYPE has FIVE rows at significance High, so significance alone
    // does not pick one. Counts run 5–21 across the board, so this must be a
    // RULE, not a number.
    // ▶ RULE DRAWN: significance desc (High > Med > Low), then |network − token|
    //   desc (the widest divergence is the most on-message row), then row_id.
    FREE_ROW_RULE: 'significance desc, then |net-tok| desc, then row_id asc',

    // BUILD-RAISED · THE `TECH` COLUMN IS REMOVED FROM THE BOARD (2026-08-17 pm).
    // It rendered the SAME technicals score already sitting in the TECHNICALS
    // column of the score-breakdown band — the operator's own note. The specced
    // column-8 price mini-chart that would have filled the slot is DROPPED: no
    // price series exists anywhere (the proxy asks for no per-coin series and
    // returns { usd, pct24h }; the config holds zero time series), and a
    // score-over-time chart is separately ruled undrawable until the series
    // starts at beta.
    // ▶ THE ROW NOW READS AS THREE DISTINCT FORMS, not one motif repeated:
    //   the TNT pill · the DECOUPLING RULE (a continuous measure against a
    //   fixed 0–2.0 scale with ticks) · the CATALYST MIX (discrete per-catalyst
    //   blocks). The rule and the mix were previously two similar bars, which
    //   is the repetition the redesign exists to cure.
    TECH_COLUMN: 'removed — duplicated the TECHNICALS breakdown column',

    // BUILD-RAISED · WHICH BAND THE MARKET CARD COUNTS.
    // TWO band columns exist and THEY DISAGREE ON 10 OF 39 ROWS.
    // Re-derived from the 39 BOARD rows below, 2026-08-17:
    //   tnt_band     (tntB) = 8 BULLISH · 26 NEUTRAL · 5 BEARISH
    //   verdict_band (vb)   = 1 BULLISH · 34 NEUTRAL · 4 BEARISH
    // ▶ DRAWN: tnt_band, AND THE CARD SAYS SO. An unlabelled "8 BULLISH" is a
    //   credibility failure on the one surface whose job is to be checkable.
    // ⛔ The renderer COUNTS the rows; these figures are a check, not a source.
    MARKET_CARD_BAND: 'tnt_band',

    // BUILD-RAISED · NO PRICE POINT. The new pricing surface needs a number and
    // canon rules none. Nothing is invented: every amount is null and renders
    // as a marked placeholder. ⛔ CONFIRM IN THE ROOM — a price is a ruling.
    PRICE_POINT: null,

    // BUILD-RAISED · PRICES. The CSV price is stale by design (build mode).
    // Live price + 24h move are painted from the SAME WS1 proxy the live lead
    // magnet uses. Fallback is a literal em-dash, NEVER a stale number.
    // ⛔ The proxy is a SEPARATE repo with its own deploy. Nothing here touches it.
    PRICE_FN: 'https://altcoin-buzz-price-proxy.netlify.app/.netlify/functions/prices'
  };

  /* ======================================================================
     3 · BRAND + COPY STRINGS
     ⛔ The pre-06-18 brand is RETIRED. It appears SEVEN times in v3 including
        its <title>, a visible .crumb eyebrow and base.css itself, and is not
        carried anywhere in this folder. The current string is below, literally.
        Do not infer a brand string.
     ====================================================================== */
  var BRAND = {
    name: 'Altcoin Buzz TNT Score',
    // The one question, live and public on the lead magnet today.
    question: 'Is the news really going to move the token?',
    questionEyebrow: 'BUILT TO ANSWER ONE QUESTION',
    // The AI is PUBLICLY NAMED. Never "AI assistant".
    ai: 'Ask Buzz',
    chipsLabel: 'TRY ASKING',
    answeredLabel: 'YOU ASKED',
    // Gatebar copy, one-sentence source of truth (W4 L403).
    gatePrinciple: 'Free gets you the score and everything needed to check it. Paid gets you the argument behind it.',
    // ⭐ EVERY gatebar links here (operator decision 5a item 3).
    howWeScore: '/how-we-score',
    // Audio product names — RULED 2026-08-17, no longer open. Hard-coded.
    audioShow: 'THE WEEKLY SCOREBOARD',
    audioToken: 'SCORECARD MINUTE'
  };

  /* PRIMARY NAV — five destinations (brief §2.1).
     ⛔ NOT the three-item nav in STEP1_ia-url-scheme; that file is superseded
        in four places. `How We Score` in primary nav overturns REQ-11;
        `/market` in primary nav from day one is operator-ruled.
     ⛔ The dropped destination marked DROP at STEP 1 is absent, by design. */
  /* ➕ blurb (stitch 2026-09-01, §R.10 item 7): the one-line plain-English
     description each destination shows in the phone menu panel. Seat A's STOP
     flag asked for exactly this home; the panel reads it from here so the
     strings live once, in config, not per page. */
  var NAV = [
    { label: 'Coins',         href: '/',             key: 'coins',     blurb: 'Every major coin, scored and ranked' },
    { label: 'Watchlist',     href: '/watchlist',    key: 'watchlist', blurb: 'The coins you are tracking' },
    { label: 'Research',      href: '/research',     key: 'research',  blurb: 'The write-ups behind each score' },
    { label: 'How We Score',  href: '/how-we-score', key: 'hws',       blurb: 'What Token, Network and Technicals measure' },
    { label: 'Market',        href: '/market',       key: 'market',    blurb: 'Where scores are moving right now' },
    /* ➕ PRICING — a NEW destination, added 2026-08-17.
       ⛔ A RE-RULING, NOT A NEW IDEA: monetisation was ruled to come at Beta;
          the operator moved it to Alpha so the team can react to what
          monetisation looks like and close E2 / AI-3.
       ⛔ ALPHA IS INTERNAL ONLY. See PRICING.MOCKUP_ONLY below. */
    { label: 'Pricing',       href: '/pricing',      key: 'pricing',   blurb: 'Plans, and what each one includes' }
  ];

  /* ======================================================================
     4 · TIERS — RUNTIME TOGGLE, NOT THREE FILES.
     Every cell below is UI_BRIEF §4.1 / §4.2, which is the REQ-10 single-source
     matrix proposal. THREE levels, no fourth invented.
     ⛔ No surface may state a gating fact absent from this table, and no
        version of it may gate a Proof Rule item.
     ====================================================================== */
  var TIERS = {
    order: ['unregistered', 'registered', 'paid'],
    label: { unregistered: 'Unregistered', registered: 'Registered', paid: 'Paid' },

    /* --- §4.1 HOMEPAGE / BOARD --- */
    board: {
      everyToken:        { unregistered: true, registered: true, paid: true },
      scoresAndBands:    { unregistered: true, registered: true, paid: true },
      catalystCount:     { unregistered: true, registered: true, paid: true },  // PROOF RULE — never gated
      provenanceStamps:  { unregistered: true, registered: true, paid: true },  // PROOF RULE — never gated
      howWeScore:        { unregistered: true, registered: true, paid: true },
      search:            { unregistered: true, registered: true, paid: true },
      myWatchlist:       { unregistered: 'register-prompt', registered: true, paid: true },
      suggestedWatchlist:{ unregistered: 1, registered: 3, paid: 'all' },
      notifications:     { unregistered: true, registered: true, paid: true },
      articles:          { unregistered: true, registered: true, paid: true }
    },

    /* --- §4.2 TOKEN PAGE --- */
    token: {
      scoresBandsCountProvenance: { unregistered: true, registered: true, paid: true },
      // Counts run 5–21 across the board, so this is a RULE, not a number.
      // ⭐ v3 2026-08-18 · unregistered changed from the single
      //    highest-significance row to the TOP QUARTER by significance, rounded
      //    down, minimum one — Math.max(1, Math.floor(n / 4)). On HYPE (13)
      //    that is 3. Verified across every count that exists: zero inversions,
      //    zero ties with the registered tier. UI_BRIEF §4.2 edited in step.
      catalystRows:      { unregistered: 'top-quarter-by-significance-rounded-down-minimum-one',
                           registered:   'top-half-by-significance-rounded-down',
                           paid:         'all' },
      analyticColumns:   { unregistered: false, registered: false, paid: true },  // mispricing · network_read · impact_scope
      gapFlag:           { unregistered: true, registered: true, paid: true },    // THAT it rests on a [GAP] — free
      gapDetail:         { unregistered: false, registered: false, paid: true },  // WHAT the gap is / what clears it — paid
      researchDossier:   { unregistered: false, registered: false, paid: true },
      taComposite:       { unregistered: true, registered: true, paid: true },
      taIndicators:      { unregistered: 'one-fully-worked', registered: 'all-ten', paid: 'all-ten' },
      taNarratives:      { unregistered: false, registered: false, paid: true },  // ⛔ the layer the handoff dropped
      taLevels:          { unregistered: false, registered: true, paid: true },
      taInvalidation:    { unregistered: false, registered: true, paid: true },
      taDeepLink:        { unregistered: true, registered: true, paid: true },
      taWeeklyMonthly:   { unregistered: false, registered: false, paid: 'post-beta' },
      scoreHistory:      { unregistered: false, registered: false, paid: 'NOT AT LAUNCH' },
      aiAccess:          { unregistered: false, registered: 'quota', paid: 'quota+buy' },
      aiPaidCitations:   { unregistered: false, registered: false, paid: true },
      aiDisclosure:      { unregistered: true, registered: true, paid: true },    // ⛔ IDENTICAL at every tier
      aiChips:           { unregistered: 'visible-not-invokable', registered: true, paid: true },
      audioMarket:       { unregistered: true, registered: true, paid: true },
      audioTokenCurrent: { unregistered: false, registered: true, paid: true },
      audioTokenArchive: { unregistered: false, registered: false, paid: true },
      tradeSetups:       { unregistered: false, registered: false, paid: false }  // ⛔ not on .com at ANY tier
    }
  };

  /* ======================================================================
     5 · BANDS — the resolver. Gold NEVER touches a score.
     ====================================================================== */
  var BANDS = { BEARISH: [1.0, 4.4], NEUTRAL: [4.5, 5.5], BULLISH: [5.6, 10.0] };
  var BAND_CLASS = { BULLISH: 'bull', NEUTRAL: 'neut', BEARISH: 'bear' };

  /* ======================================================================
     6 · THE BOARD — 39 rows, verbatim from tnt_scoreboard.csv 2026-08-17.
     `mix` = [Bull, Neutral, Bear] counts of each catalyst's OWN TOKEN SCORE,
     banded on the standing thresholds (bearish 1.0–4.4 · neutral 4.5–5.5 ·
     bullish 5.6–10.0). ⛔ NOT the `direction` field, which was what it counted
     before 2026-08-17 and which said the opposite on nearly every row.
     ▶ Because the row's Token score IS the arithmetic mean of its catalysts'
       token scores, the mix bar is the DISTRIBUTION BEHIND the Token column's
       average — the shape behind the number, not a second opinion.
     Totals across all 405 catalyst rows: 95 bullish · 227 neutral · 83 bearish.
     Nothing here is authored. Nothing here is rounded.
     ====================================================================== */
  var BOARD = [
    {"tk":"ZEC","nm":"Zcash","slug":"zec","tnt":6.7,"tntB":"BULLISH","tok":5.6,"tokB":"BULLISH","net":5.7,"netB":"BULLISH","tec":7.7,"tecB":"BULLISH","vb":"BULLISH","cat":11,"cg":"zcash","asof":"2026-07-22","taof":"2026-08-24","cal":"v2.1","mix":[7,2,2]},
    {"tk":"ETHFI","nm":"Ether.fi","slug":"ethfi","tnt":6.4,"tntB":"BULLISH","tok":5.5,"tokB":"NEUTRAL","net":6.1,"netB":"BULLISH","tec":7.3,"tecB":"BULLISH","vb":"NEUTRAL","cat":11,"cg":"ether-fi","asof":"2026-07-20","taof":"2026-08-24","cal":"v2.1","mix":[6,5,0]},
    {"tk":"JUP","nm":"Jupiter","slug":"jup","tnt":6.2,"tntB":"BULLISH","tok":5.5,"tokB":"NEUTRAL","net":5.8,"netB":"BULLISH","tec":6.8,"tecB":"BULLISH","vb":"NEUTRAL","cat":10,"cg":"jupiter-exchange-solana","asof":"2026-07-24","taof":"2026-08-24","cal":"v2.1","mix":[5,5,0]},
    {"tk":"AAVE","nm":"Aave","slug":"aave","tnt":6.6,"tntB":"BULLISH","tok":5.4,"tokB":"NEUTRAL","net":5.8,"netB":"BULLISH","tec":7.7,"tecB":"BULLISH","vb":"NEUTRAL","cat":12,"cg":"aave","asof":"2026-07-22","taof":"2026-08-24","cal":"v2.1","mix":[3,9,0]},
    {"tk":"INJ","nm":"Injective","slug":"inj","tnt":6.1,"tntB":"BULLISH","tok":5.4,"tokB":"NEUTRAL","net":5.8,"netB":"BULLISH","tec":6.7,"tecB":"BULLISH","vb":"NEUTRAL","cat":9,"cg":"injective-protocol","asof":"2026-07-22","taof":"2026-08-24","cal":"v2.1","mix":[3,6,0]},
    {"tk":"JST","nm":"JUST","slug":"jst","tnt":5.0,"tntB":"NEUTRAL","tok":5.4,"tokB":"NEUTRAL","net":5.3,"netB":"NEUTRAL","tec":4.6,"tecB":"NEUTRAL","vb":"NEUTRAL","cat":9,"cg":"just","asof":"2026-07-24","taof":"2026-08-24","cal":"v2.1","mix":[2,7,0]},
    {"tk":"LIT","nm":"Lighter","slug":"lit","tnt":6.5,"tntB":"BULLISH","tok":5.4,"tokB":"NEUTRAL","net":5.8,"netB":"BULLISH","tec":7.6,"tecB":"BULLISH","vb":"NEUTRAL","cat":11,"cg":"lighter","asof":"2026-07-24","taof":"2026-08-24","cal":"v2.1","mix":[7,2,2]},
    {"tk":"XDC","nm":"XDC Network","slug":"xdc","tnt":5.9,"tntB":"BULLISH","tok":5.4,"tokB":"NEUTRAL","net":6.1,"netB":"BULLISH","tec":6.3,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"xdce-crowd-sale","asof":"2026-07-24","taof":"2026-08-24","cal":"v2.1","mix":[5,3,0]},
    {"tk":"CRO","nm":"Cronos","slug":"cro","tnt":5.8,"tntB":"BULLISH","tok":5.2,"tokB":"NEUTRAL","net":5.6,"netB":"BULLISH","tec":6.3,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"crypto-com-chain","asof":"2026-07-24","taof":"2026-08-24","cal":"v2.1","mix":[4,3,1]},
    {"tk":"TRX","nm":"TRON","slug":"trx","tnt":6.2,"tntB":"BULLISH","tok":5.2,"tokB":"NEUTRAL","net":5.5,"netB":"NEUTRAL","tec":7.1,"tecB":"BULLISH","vb":"NEUTRAL","cat":10,"cg":"tron","asof":"2026-07-06","taof":"2026-08-24","cal":"v2.1","mix":[5,3,2]},
    {"tk":"VVV","nm":"Venice","slug":"vvv","tnt":6.1,"tntB":"BULLISH","tok":5.2,"tokB":"NEUTRAL","net":5.4,"netB":"NEUTRAL","tec":6.9,"tecB":"BULLISH","vb":"NEUTRAL","cat":10,"cg":"venice-token","asof":"2026-07-30","taof":"2026-08-24","cal":"v2.1","mix":[5,3,2]},
    {"tk":"ADA","nm":"Cardano","slug":"ada","tnt":5.8,"tntB":"BULLISH","tok":5.1,"tokB":"NEUTRAL","net":5.5,"netB":"NEUTRAL","tec":6.5,"tecB":"BULLISH","vb":"NEUTRAL","cat":12,"cg":"cardano","asof":"2026-07-22","taof":"2026-08-24","cal":"v2.1","mix":[1,10,1]},
    {"tk":"LINK","nm":"Chainlink","slug":"link","tnt":6.4,"tntB":"BULLISH","tok":5.1,"tokB":"NEUTRAL","net":7.0,"netB":"BULLISH","tec":7.5,"tecB":"BULLISH","vb":"NEUTRAL","cat":15,"cg":"chainlink","asof":"2026-07-20","taof":"2026-08-24","cal":"v2.1","mix":[5,9,1]},
    {"tk":"LTC","nm":"Litecoin","slug":"ltc","tnt":6.0,"tntB":"BULLISH","tok":5.1,"tokB":"NEUTRAL","net":5.5,"netB":"NEUTRAL","tec":6.9,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"litecoin","asof":"2026-07-22","taof":"2026-08-24","cal":"v2.1","mix":[0,8,0]},
    {"tk":"SUN","nm":"Sun","slug":"sun","tnt":4.5,"tntB":"NEUTRAL","tok":5.1,"tokB":"NEUTRAL","net":5.8,"netB":"BULLISH","tec":3.8,"tecB":"BEARISH","vb":"NEUTRAL","cat":7,"cg":"sun-token","asof":"2026-07-22","taof":"2026-08-24","cal":"v2.1","mix":[0,7,0]},
    {"tk":"HBAR","nm":"Hedera","slug":"hbar","tnt":5.9,"tntB":"BULLISH","tok":5.0,"tokB":"NEUTRAL","net":6.0,"netB":"BULLISH","tec":6.7,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"hedera-hashgraph","asof":"2026-07-23","taof":"2026-08-24","cal":"v2.1","mix":[0,8,0]},
    {"tk":"JTO","nm":"Jito","slug":"jto","tnt":5.6,"tntB":"BULLISH","tok":5.0,"tokB":"NEUTRAL","net":6.0,"netB":"BULLISH","tec":6.1,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"jito-governance-token","asof":"2026-07-24","taof":"2026-08-24","cal":"v2.1","mix":[1,6,1]},
    {"tk":"LDO","nm":"Lido DAO","slug":"ldo","tnt":6.0,"tntB":"BULLISH","tok":5.0,"tokB":"NEUTRAL","net":5.8,"netB":"BULLISH","tec":7.0,"tecB":"BULLISH","vb":"NEUTRAL","cat":9,"cg":"lido-dao","asof":"2026-07-23","taof":"2026-08-24","cal":"v2.1","mix":[2,5,2]},
    {"tk":"PUMP","nm":"Pump.fun","slug":"pump","tnt":6.3,"tntB":"BULLISH","tok":5.0,"tokB":"NEUTRAL","net":5.7,"netB":"BULLISH","tec":7.6,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"pump-fun","asof":"2026-07-22","taof":"2026-08-24","cal":"v2.1","mix":[2,4,2]},
    {"tk":"VIRTUAL","nm":"Virtuals Protocol","slug":"virtual","tnt":5.9,"tntB":"BULLISH","tok":5.0,"tokB":"NEUTRAL","net":5.7,"netB":"BULLISH","tec":6.8,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"virtual-protocol","asof":"2026-07-22","taof":"2026-08-24","cal":"v2.1","mix":[2,5,1]},
    {"tk":"ENA","nm":"Ethena","slug":"ena","tnt":6.3,"tntB":"BULLISH","tok":4.9,"tokB":"NEUTRAL","net":5.4,"netB":"NEUTRAL","tec":7.6,"tecB":"BULLISH","vb":"NEUTRAL","cat":12,"cg":"ethena","asof":"2026-07-13","taof":"2026-08-24","cal":"v2.1","mix":[3,6,3]},
    /* ⚠ `cg` CORRECTED 2026-08-17 (round 4), THIS ROW ONLY. The old value was
       CoinGecko's WEB PAGE slug, which is not its API id. The proxy returned
       200 with 38 of 39 ids and FLR simply absent from the payload, so the row
       showed a dash and looked identical to "the feed is down". The API id is
       "flare-networks"; probed directly, it returns a price and the old value
       returns nothing.
       ⛔ THE FAILURE MODE IS WHY THIS NOTE STAYS: a bad `cg` does NOT error. It
          returns 200 with the row silently missing, so the page degrades to
          something indistinguishable from an outage. Never assume a dash means
          the feed is down until the id has been probed on its own.
       ✅ RECONCILED 2026-08-24. tnt_scoreboard.csv now also carries
          "flare-networks", so source and page agree and this is no longer a
          local patch held against the CSV. Verified before the board rebuild
          that day — had the CSV still held the old slug, regenerating `cg`
          from it would have reinstated the defect. Nothing outstanding. */
    {"tk":"FLR","nm":"Flare","slug":"flr","tnt":5.7,"tntB":"BULLISH","tok":4.9,"tokB":"NEUTRAL","net":6.1,"netB":"BULLISH","tec":6.3,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"flare-networks","asof":"2026-08-06","taof":"2026-08-24","cal":"v2.2","mix":[1,6,1]},
    {"tk":"AERO","nm":"Aerodrome","slug":"aero","tnt":5.8,"tntB":"BULLISH","tok":4.8,"tokB":"NEUTRAL","net":5.6,"netB":"BULLISH","tec":6.7,"tecB":"BULLISH","vb":"NEUTRAL","cat":16,"cg":"aerodrome-finance","asof":"2026-07-29","taof":"2026-08-24","cal":"v2.1","mix":[2,9,5]},
    {"tk":"ARB","nm":"Arbitrum","slug":"arb","tnt":5.8,"tntB":"BULLISH","tok":4.8,"tokB":"NEUTRAL","net":5.5,"netB":"NEUTRAL","tec":6.8,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"arbitrum","asof":"2026-07-24","taof":"2026-08-24","cal":"v2.1","mix":[1,5,2]},
    {"tk":"DEXE","nm":"DeXe","slug":"dexe","tnt":4.9,"tntB":"NEUTRAL","tok":4.8,"tokB":"NEUTRAL","net":5.3,"netB":"NEUTRAL","tec":4.9,"tecB":"NEUTRAL","vb":"NEUTRAL","cat":10,"cg":"dexe","asof":"2026-07-24","taof":"2026-08-24","cal":"v2.1","mix":[2,4,4]},
    {"tk":"PI","nm":"Pi Network","slug":"pi","tnt":4.5,"tntB":"NEUTRAL","tok":4.8,"tokB":"NEUTRAL","net":5.4,"netB":"NEUTRAL","tec":4.2,"tecB":"BEARISH","vb":"NEUTRAL","cat":9,"cg":"pi-network","asof":"2026-07-22","taof":"2026-08-24","cal":"v2.1","mix":[1,6,2]},
    {"tk":"XMR","nm":"Monero","slug":"xmr","tnt":5.6,"tntB":"BULLISH","tok":4.8,"tokB":"NEUTRAL","net":5.5,"netB":"NEUTRAL","tec":6.3,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"monero","asof":"2026-07-23","taof":"2026-08-24","cal":"v2.1","mix":[1,5,2]},
    {"tk":"XRP","nm":"XRP (XRP Ledger)","slug":"xrp","tnt":5.9,"tntB":"BULLISH","tok":4.7,"tokB":"NEUTRAL","net":5.6,"netB":"BULLISH","tec":7.1,"tecB":"BULLISH","vb":"NEUTRAL","cat":21,"cg":"ripple","asof":"2026-08-10","taof":"2026-08-24","cal":"v2.2","mix":[0,16,5]},
    {"tk":"DOGE","nm":"Dogecoin","slug":"doge","tnt":5.9,"tntB":"BULLISH","tok":4.7,"tokB":"NEUTRAL","net":5.3,"netB":"NEUTRAL","tec":7.1,"tecB":"BULLISH","vb":"NEUTRAL","cat":10,"cg":"dogecoin","asof":"2026-07-07","taof":"2026-08-24","cal":"v2.1","mix":[1,6,3]},
    {"tk":"POL","nm":"Polygon","slug":"pol","tnt":6.0,"tntB":"BULLISH","tok":4.7,"tokB":"NEUTRAL","net":5.7,"netB":"BULLISH","tec":7.2,"tecB":"BULLISH","vb":"NEUTRAL","cat":12,"cg":"polygon-ecosystem-token","asof":"2026-07-27","taof":"2026-08-24","cal":"v2.1","mix":[2,6,4]},
    {"tk":"W","nm":"Wormhole","slug":"w","tnt":5.6,"tntB":"BULLISH","tok":4.7,"tokB":"NEUTRAL","net":6.0,"netB":"BULLISH","tec":6.3,"tecB":"BULLISH","vb":"NEUTRAL","cat":5,"cg":"wormhole","asof":"2026-07-13","taof":"2026-08-24","cal":"v2.1","mix":[1,3,1]},
    {"tk":"HYPE","nm":"Hyperliquid","slug":"hype","tnt":5.9,"tntB":"BULLISH","tok":4.6,"tokB":"NEUTRAL","net":5.3,"netB":"NEUTRAL","tec":7.1,"tecB":"BULLISH","vb":"NEUTRAL","cat":13,"cg":"hyperliquid","asof":"2026-08-04","taof":"2026-08-24","cal":"v2.2","mix":[4,4,5]},
    {"tk":"ONDO","nm":"Ondo","slug":"ondo","tnt":5.4,"tntB":"NEUTRAL","tok":4.6,"tokB":"NEUTRAL","net":6.1,"netB":"BULLISH","tec":6.0,"tecB":"BULLISH","vb":"NEUTRAL","cat":11,"cg":"ondo-finance","asof":"2026-07-20","taof":"2026-08-24","cal":"v2.1","mix":[0,10,1]},
    {"tk":"PYTH","nm":"Pyth Network","slug":"pyth","tnt":5.9,"tntB":"BULLISH","tok":4.6,"tokB":"NEUTRAL","net":5.6,"netB":"BULLISH","tec":7.1,"tecB":"BULLISH","vb":"NEUTRAL","cat":20,"cg":"pyth-network","asof":"2026-07-29","taof":"2026-08-24","cal":"v2.1","mix":[4,11,5]},
    {"tk":"ZRO","nm":"LayerZero","slug":"zro","tnt":5.8,"tntB":"BULLISH","tok":4.5,"tokB":"NEUTRAL","net":5.8,"netB":"BULLISH","tec":6.9,"tecB":"BULLISH","vb":"NEUTRAL","cat":8,"cg":"layerzero","asof":"2026-07-22","taof":"2026-08-24","cal":"v2.1","mix":[2,2,4]},
    {"tk":"BEAT","nm":"Audiera","slug":"beat","tnt":4.1,"tntB":"BEARISH","tok":4.4,"tokB":"BEARISH","net":5.4,"netB":"NEUTRAL","tec":3.6,"tecB":"BEARISH","vb":"BEARISH","cat":7,"cg":"audiera","asof":"2026-07-23","taof":"2026-08-24","cal":"v2.1","mix":[2,3,2]},
    {"tk":"SOL","nm":"Solana","slug":"sol","tnt":5.8,"tntB":"BULLISH","tok":4.4,"tokB":"BEARISH","net":5.6,"netB":"BULLISH","tec":7.0,"tecB":"BULLISH","vb":"BEARISH","cat":20,"cg":"solana","asof":"2026-08-12","taof":"2026-08-24","cal":"v2.2","mix":[3,8,9]},
    {"tk":"BTC","nm":"Bitcoin","slug":"btc","tnt":5.8,"tntB":"BULLISH","tok":4.2,"tokB":"BEARISH","net":4.8,"netB":"NEUTRAL","tec":7.4,"tecB":"BULLISH","vb":"BEARISH","cat":8,"cg":"bitcoin","asof":"2026-07-06","taof":"2026-08-24","cal":"v2.1","mix":[0,3,5]},
    {"tk":"STABLE","nm":"Stable","slug":"stable","tnt":4.1,"tntB":"BEARISH","tok":3.9,"tokB":"BEARISH","net":5.5,"netB":"NEUTRAL","tec":4.2,"tecB":"BEARISH","vb":"BEARISH","cat":7,"cg":"stable-2","asof":"2026-07-24","taof":"2026-08-24","cal":"v2.1","mix":[0,4,3]}
  ];

  /* ⛔ THE DECOY GUARD. The archive holds a 12-row board and a 104-row
     inventory. A page built from those renders perfectly and is a quarter of
     the product. So the count is asserted, loudly, at load. */
  var BOARD_ASSERT = { rows: 39, inventoryRows: 405, source: 'live CSV, not archive/' };

  /* ======================================================================
     7 · BOARD-LEVEL PROVENANCE — a Proof Rule item, free at every tier.
     ⛔ TWO DATES, RENDERED SEPARATELY. Never one blended "UPDATED": they
        diverge by design and by a lot.
     ⚠ Board dates ARE old. That is the expected state of build mode, not a
       finding. Rendered honestly; the stamp is a trust surface.
     ====================================================================== */
  /* ⛔ ROUND 5 · THE `calibration` FIELD IS DELETED, not commented out and not
     relocated. The split it carried (`v2.1 on 35 · v2.2 on 4`) was internal,
     meant nothing to an outsider, and is temporary — by beta every coin is on
     the current scoring method. ⚠ The per-row `cal` field in BOARD is untouched:
     that is data, and this was a surface. */
  var PROVENANCE = {
    fundamentalsFrom: '2026-07-06', fundamentalsTo: '2026-08-12',
    technicalsFrom:   '2026-08-05', technicalsTo:   '2026-08-12'
  };

  /* ======================================================================
     7b · ⛔⛔ DELETED 2026-09-02 (`#643`) — THE BAND-LEDE BLOCK, ALL FIVE
     STRINGS, AND ITS EXPORT. The operator ruled "both ledes" off the homepage:
     "we can use tooltips if people want an explanation. i dont want to add the
     text. it needs to look very clean." The chip-lede paragraph came out of
     index.html in the same pass and `render()`'s reader lines went with it, so
     nothing on either page reads this object any more.
     ⛔ THE IDENTIFIER IS NOT SPELLED ANYWHERE IN THIS COMMENT, ON PURPOSE —
        the dispatch's own completion check is `grep -rn` for it across both
        copies returning ZERO, and a tombstone that names the corpse fails it.
     ⚠⚠ THE FOUR SIBLINGS WENT WITH `all`, AND THAT WAS THE ACTUAL DECISION —
        `SPEC #643 §5` item 2 flagged their fate as UNDETERMINED. They were
        ONE surface: the same paragraph, re-written per chip by the same three
        lines. With the element gone there is no surface left for
        `bullish` / `neutral` / `bearish` / `decoupled` to render into, so
        keeping them would have left dead config, not a live feature.
     ⛔ NOTHING THEY SAID IS LOST FROM THE PRODUCT: the band cutoffs they
        recited now live in the mini-dashboard's gauge tooltip (`#643`) and in
        the TNT column header tooltip, both SUBSTITUTED from `BANDS`; the
        decoupled cutoff and the on-the-line count are still printed cold by
        `#filterNote`, which this deletion does not touch.
     ▶ Deleted rather than commented out — `CONVENTIONS §0` rule 3.
     ====================================================================== */

  /* ======================================================================
     8 · THE HIGHLIGHT STRIP — version-b's FORM, contents RE-DERIVED 2026-08-17,
     REBUILT 2026-08-17 (evening) from the operator's homepage review.
     ⛔ version-b's own four are stale and carry a RETIRED SCORING MODEL
        (signed integers +9 / +6 / +13 / 0). The live scale is 1–10 to one
        decimal. A stale SCALE is worse than a stale label.

     ⛔⛔ THE DEFECT THIS REBUILD CURES — FOUR VISUALLY IDENTICAL CARDS CARRYING
        THREE DIFFERENT UNITS. The operator, who designed the scoring system,
        read STABLE's 3.9 as a TNT score. It is a TOKEN score; STABLE's TNT is
        4.2 and was never on the card. If the author of the instrument reads it
        wrong, a room will.
     ▶ SO EACH UNIT NOW GETS A DIFFERENT FORM, and `unit` is stated on the card:
          TNT score      → `gauge`   (the gauge rule: TNT and nothing else)
          Decoupling gap → `gap`     (paired Network/Token bars + the span)
          Token score    → `scale`   (a position on a 1–10 track. NO ARC.)
     ⛔ THE EYEBROW IS NOT THE FIX — it is what the operator had to fall back
        on reading. The FORM is the fix; the eyebrow and `unit` back it up.

     ⛔⛔ MAGNITUDE, NEVER DIRECTION on the `gap` cards. Measured over all 39
        rows: the network leads the token on 38 of 39 (only JST goes the other
        way, by 0.1), so an arrow / lean / winner-colour points the same way on
        97% of rows and stops being seen within three. Neutral ink only.
     ====================================================================== */
  /* ⛔ ROUND 3 · LESS OF IT. The strip was six cards, each carrying an eyebrow,
     a gold sub-header, a form, a three-score triple AND a prose note. That is
     the clutter the review named.
     ▶ DENSITY TARGET = version-b's SIGNALS STRIP: eyebrow · ticker · the form ·
       ONE SHORT LINE. Nothing else.
     ⛔ TAKEN FROM version-b: its layout and density ONLY. ⛔ NOT its retired
        signed-integer scale (+9 / +6 / +13 / 0), NOT its SAMPLE chips, and NOT
        its arrow. All three are ruled out.
     DELETED THIS ROUND: the FEATURED RESEARCH card · the TOKEN/NETWORK/
     TECHNICALS triple · the `unit` gold sub-header on every card · the GAP
     labels and the "on a 1–10 scale" caption. */
  /* ⛔⛔ ROUND 4 · A HARD CAP ON EVERY CARD DESCRIPTION: MAX 15 WORDS, MAX 3
     LINES, PLAIN ENGLISH. ⛔ No internal vocabulary anywhere a user can read
     it: no column names, no underscores, no `tnt_band` / `verdict_band`.
     ✅ Written for a non-native English speaker who has never seen this
     project. Word counts are in the comment beside each line. */
  var HIGHLIGHTS = [
    { form: 'gauge', tone: 'green', eyebrow: 'HIGHEST TNT ON THE BOARD', tk: 'ZEC',
      // ⛔ THE ONLY GAUGE ON THE STRIP, AND ON THE HOMEPAGE. The holder is NAMED
      //    here, not classified: "gauges on the TNT boxes" is a BINARY and
      //    there are THREE units, so applying it would put a gauge on STABLE's
      //    TOKEN score, which is a defect against the gauge rule.
      // ⚠ `tk` IS A SUPERLATIVE AND MUST BE RE-CHECKED AFTER EVERY TA BATCH.
      //    Held PUMP until 2026-08-24; the batch that day put ZEC on top at 6.7
      //    and dropped PUMP (6.3) to 5th. The eyebrow is a claim about the
      //    board, so it goes stale silently — the number on the card is derived
      //    and stays right even while the card names the wrong coin.
      //    ⛔ THE LEAD IS 0.1 (ZEC 6.7 · AAVE 6.6). Expect this to move again.
      note: 'The highest overall score on the board. The charts are doing the work.' },   // 13 words

    { form: 'gap', tone: 'ink', eyebrow: 'WIDEST DECOUPLING', tk: 'LINK',
      note: 'The biggest gap between what the tech gets and what the coin gets.' },       // 13 words

    { form: 'scale', tone: 'red', eyebrow: 'WEAKEST TOKEN CASE', tk: 'STABLE',
      note: 'The weakest case that news here reaches the coin you can buy.' },            // 12 words

    /* ⛔⛔ ROUND 6 · `THE ONE EXCEPTION` CARD IS DELETED — FIVE CARDS BECOME
       FOUR, and the jump control (`Show it on the table`) goes with it.
       ▶ WHY, and it is not a change of mind about the counter-example: at
         100–150 coins there will almost certainly not BE one exception, so a
         card whose whole premise is the singular does not survive scale.
       ⛔⛔ THE COMMITMENT IT CARRIED SURVIVES ELSEWHERE AND MUST NOT BE
          REMOVED: `exception` in alpha.js and the `is-exception` row class
          both stand, so JST still renders as a GOLD-TINTED ROW on the table
          and stays findable without the card. A thesis with one honest
          counter-example is more credible than one without — the card was the
          convenience, the row tint is the commitment. */

    /* ➕ A MARKET-LEVEL CARD. The strip already carries TWO decoupling items
       (LINK, JST); a third would make it three of the same idea, which is the
       exact problem the variety instruction exists to solve. A "network leads
       token on 38 of 39" card was considered and REJECTED for that reason.
       ▶ THIS CARD SAYS SOMETHING ABOUT THE MARKET. The others say something
         about our method.
       ⛔⛔ AND IT NAMES WHICH BAND IT COUNTED. There are TWO band columns and
          they DISAGREE ON 10 OF 39 ROWS. An unlabelled "8 BULLISH" is a
          credibility failure waiting to happen on the one surface whose whole
          job is to be checkable — a reviewer cross-checking the verdict band
          finds 1, not 8.
       ⛔ The counts are COUNTED IN THE RENDERER from BOARD, never transcribed.

       ⭐⭐ A5 · IT ALSO CARRIES THE ONE QUANTIFIED STATEMENT OF THE THESIS.
          Three deletions this round each removed a number: the GAP labels, the
          hero's "on 38 of 39 boards" line, and the stats band above the table.
          Together they would have left the decoupling claim with NO QUANTITY
          anywhere on the homepage, turning a measurement into a picture, on the
          product whose whole pitch is that a sceptic can check it.
          ▶ So the leads-count lands here, DERIVED IN THE RENDERER, never typed. */
    /* ⛔⛔ THE DISCLOSURE IS NOT DELETED BY THE 15-WORD CAP — IT IS CARRIED BY
       THE COUNT ITSELF. `Based on the TNT Score` IS the which-band disclosure,
       in plain English, so nothing has to be relocated to keep it.
       ⭐ OPERATOR-AUTHORED 2026-08-17, and used VERBATIM. 12 words rendered.
       ⛔ THE THREE DIGITS ARE NOT TYPED HERE. `{b}` `{n}` `{r}` are filled by
          bandForm() from the counted rows, so the sentence cannot drift from
          the data the bar beside it draws. Everything else is literal.
       ⛔ If any future rewrite would drop the `Based on the TNT Score` clause,
          stop and report it rather than shipping the shorter version: the page
          now counts bands THREE ways (overall TNT · per-row verdict · the
          per-catalyst token band on the mix bar) and every surface that shows
          a band count must say which band it counted. */
    { form: 'bands', tone: 'market', eyebrow: 'THE MARKET · BAND MIX',
      bandField: 'tntB',
      noteTemplate: 'Based on the TNT Score: {b} coins bullish, {n} neutral, {r} bearish.' }  // 12 words

    /* ⛔ THE FEATURED-RESEARCH CARD WAS DELETED THIS ROUND (six cards was too
       many). Nothing is lost by it: it never carried an article, because we
       have none and E1 is unruled. E1 is still surfaced, and still marked
       UNRULED, on the /research view. */
  ];

  /* ======================================================================
     9 · THE TOKEN PAGE — HYPE (Hyperliquid).
     Chosen because the live lead magnet already features it, so the room sees
     continuity. Every figure below is read from RESEARCH / FACT_AUDIT / the
     two CSVs / the 2026-08-12 TA file. NOTHING IS AUTHORED.
     ====================================================================== */
  var TOKEN = {
    tk: 'HYPE', nm: 'Hyperliquid', slug: 'hype', cg: 'hyperliquid',
    leadId: '20260624-hype_hold-572fd0c1',
    asOf: '2026-08-04', taAsOf: '2026-08-12', cal: 'v2.2',
    tnt: 4.8, tntB: 'NEUTRAL', tok: 4.6, tokB: 'NEUTRAL',
    net: 5.3, netB: 'NEUTRAL', tec: 5.0, tecB: 'NEUTRAL', verdict: 'NEUTRAL',
    catalystCount: 13,

    /* --- v3 2026-08-18 · THE FOUR ARTICLES -------------------------------
       ⛔ Titles VERBATIM, rendered as PLAIN TEXT — none is published yet, so
          no href, no anchor, no invented slug, no dates/authors/read-times/
          thumbnails. Free at every tier.
       ▶ PLACEMENT RULE: a token-led piece is about the whole coin and has no
         single row to sit on → bottom block only (rowId null). A catalyst-led
         piece sits ON its row (rowId) AND in the bottom block. So exactly TWO
         of thirteen rows carry a row-level article, ONE each.
       ⛔ A cross-coin title never sits unlabelled beside a single-coin one —
          `scope` is the label and it always renders with the title.         */
    articles: [
      { title: 'HIP-3 Made Hyperliquid Bigger. Did It Make HYPE Stronger?',
        shape: 'token-led', scope: 'about this coin', rowId: null },
      { title: 'What HYPE Holders Actually Own: Validator Authority and the Unlock Calendar',
        shape: 'token-led', scope: 'about this coin', rowId: null },
      { title: 'Every Big Buyback Engine, Side by Side. Why the Token Scores Split.',
        shape: 'catalyst-led', scope: 'compares 6 coins', rowId: 'hype-buyback' },
      { title: 'Five Coins Carrying a Cliff',
        shape: 'catalyst-led', scope: 'compares 5 coins', rowId: 'hype-unlocks' }
    ],

    /* v3 item M · the not-yet-fired module's heading. ONE STRING, ONE PLACE —
       the operator may flip it to 'Not yet fired' without a build round. */
    upcomingHeading: 'Upcoming',

    /* --- 13 catalyst rows, verbatim from catalyst_inventory.csv ------------
       `paid` holds the three PAID analytic columns. The renderer NEVER writes
       them into the DOM below the paid tier — see the note at §12.            */
    catalysts: [
      { id:'hype-unlocks', name:'Core-contributor unlock cadence', net:5.0, tok:2.0,
        phase:'PRE', dir:'Bear', sig:'High', asof:'2026-08-04',
        srcs:['F-019','F-062','F-071','X-01','X-05','X-06'],
        paid:{ mispricing:'UNDER', networkRead:'NEUTRAL', scope:'TOKEN-SPECIFIC' },
        /* the fully-worked free row — see FREE_ROW_RULE */
        worked:{
          what:'Hyperliquid’s Core Contributor allocation is 238M HYPE and every unlock calendar in circulation derives a uniform ~9,916,666 HYPE/month ceiling from it. That projection is a ceiling, not a distribution: the Hyper Foundation announces a specific claim ahead of the 6th of each month, and the announced amount has never once approached the authorisation.',
          transmission:'TOKEN-driving, BEARISH — at a magnitude one order of magnitude smaller than the headline. Released HYPE is HYPE reaching HYPE’s float, so it captures unintermediated. The 2026-08-06 tranche was announced at 433,000 HYPE / $22.74M against a ~$35.3M monthly buyback bid: 0.64× the bid, and 0.19% of released supply.',
          against:'The bearish content that survives is not the tranche, it is the ceiling. The Foundation retains the authorisation to claim 9.92M in any month — a $530M event at 15× the monthly bid. Seven tracked months at 1.4%–17.6% of authorisation is a behavioural record, not a covenant.',
          record:[['Nov 2025','1,745,746','17.6%'],['Jan 2026','1,125,766','11.4%'],['Feb 2026','140,333','1.4%'],
                  ['Mar 2026','173,217','1.7%'],['Apr 2026','~330,000','3.3%'],['Aug 2026','433,000','4.4%']],
          networkRead:'Vesting changes who holds the token, not what the chain can do.',
          gapFlag:true,
          sources:[
            ['F-062','Next unlock 2026-08-06: 433,000 HYPE worth $22.74M, 0.19% of the 454.99M released supply','tokenomist.ai/hyperliquid via beincrypto','2026-08-03'],
            ['F-063','The ~9.92M/month figure is a projected ceiling; "the projected unlock alone overstated supply risk by 30–57× across tracked months"','tokenomist.ai/research','2026-04-01'],
            ['F-064','Verified announced-claim record, Nov 2025 → Apr 2026, checked against on-chain transactions','tokenomist.ai/research · crypto.news','2026-04-01'],
            ['F-065','Vesting-contract state: 405.41M unlocked, ~3.19M claimed = 0.79% claim rate','tokenomist.ai/supply-analytics','2026-03-23'],
            ['F-071','The ceiling figure in circulation: "$314M unlock" across CoinTelegraph, CryptoNews, CoinMarketCap, The Defiant','as catalogued at tokenomist.ai/research','2026-04-01']
          ]
        } },
      { id:'hype-hyperevm', name:'HyperEVM + HIP-3 / HIP-4 and the RWA turn', net:8.0, tok:5.7,
        phase:'ONGOING', dir:'Bull', sig:'High', asof:'2026-08-04',
        srcs:['F-140','F-160','F-046','F-060','X-16','X-17'],
        paid:{ mispricing:'OVER', networkRead:'LIFTS', scope:'TOKEN-SPECIFIC' } },
      { id:'hype-coinbase-treasury', name:'Coinbase USDC treasury / AQAv2', net:5.0, tok:7.2,
        phase:'PRE', dir:'Bull', sig:'High', asof:'2026-08-04',
        srcs:['F-024','F-030','F-186','X-08','X-09'],
        paid:{ mispricing:'UNDER', networkRead:'NEUTRAL', scope:'TOKEN-SPECIFIC' } },
      { id:'hype-buyback', name:'Assistance Fund buyback engine (burn)', net:5.0, tok:5.7,
        phase:'ONGOING', dir:'Bull', sig:'High', asof:'2026-08-04',
        srcs:['F-001','F-014','F-034','F-172','F-176','X-02','X-25'],
        paid:{ mispricing:'OVER', networkRead:'NEUTRAL', scope:'TOKEN-SPECIFIC' } },
      { id:'hype-competition', name:'Perp-DEX + CEX fee competition', net:3.5, tok:3.6,
        phase:'ONGOING', dir:'Bear', sig:'High', asof:'2026-08-04',
        srcs:['F-090','F-108','F-171','X-22','X-24','X-25'],
        paid:{ mispricing:'UNDER', networkRead:'DRAGS', scope:'SECTOR' } },
      { id:'hype-holder-rights', name:'Token-holder rights & validator authority', net:5.0, tok:3.8,
        phase:'STRUCTURAL', dir:'Bear', sig:'High', asof:'2026-08-04',
        srcs:['F-047','F-061','F-193','X-04','X-20'],
        paid:{ mispricing:'UNDER', networkRead:'NEUTRAL', scope:'TOKEN-SPECIFIC' } },
      { id:'hype-staking-lock', name:'Staking float-lock and whale accumulation', net:6.8, tok:4.5,
        phase:'ONGOING', dir:'Bull', sig:'Med', asof:'2026-08-04',
        srcs:['F-015','F-023','F-025','X-19'],
        paid:{ mispricing:'OVER', networkRead:'LIFTS', scope:'TOKEN-SPECIFIC' } },
      { id:'hype-etf', name:'Spot HYPE ETFs (THYP, BHYP, HYPG)', net:5.0, tok:3.3,
        phase:'ONGOING', dir:'Bear', sig:'Med', asof:'2026-08-04',
        srcs:['F-087','X-13','X-14','X-15'],
        paid:{ mispricing:'UNDER', networkRead:'NEUTRAL', scope:'TOKEN-SPECIFIC' } },
      { id:'hype-jurisdiction', name:'Non-US jurisdictional characterisation risk', net:5.0, tok:3.8,
        phase:'POST', dir:'Bear', sig:'Med', asof:'2026-08-04',
        srcs:['F-128','F-139','X-23'],
        paid:{ mispricing:'UNDER', networkRead:'NEUTRAL', scope:'TOKEN-SPECIFIC' } },
      { id:'hype-corporate-treasuries', name:'Corporate HYPE treasuries', net:5.0, tok:5.2,
        phase:'ONGOING', dir:'Bull', sig:'Med', asof:'2026-08-04',
        srcs:['F-161','F-170','X-11'],
        paid:{ mispricing:'OVER', networkRead:'NEUTRAL', scope:'TOKEN-SPECIFIC' } },
      { id:'hype-fee-switch', name:'Governance re-allocation of the fee stream (fee-switch / HIP-5 / AF2)', net:5.0, tok:5.0,
        phase:'PRE', dir:'Neutral', sig:'Med', asof:'2026-08-04',
        srcs:['F-035','F-045','F-191'],
        paid:{ mispricing:'UNDER', networkRead:'NEUTRAL', scope:'TOKEN-SPECIFIC' } },
      { id:'hype-cftc-perps', name:'US regulatory thread (CFTC / SEC / Reg 40.11)', net:5.0, tok:4.7,
        phase:'PRE', dir:'Bull', sig:'Low', asof:'2026-08-04',
        srcs:['F-119','F-127','F-139'],
        paid:{ mispricing:'OVER', networkRead:'NEUTRAL', scope:'SECTOR' } },
      { id:'hype-cex-listings', name:'Major-venue spot listings', net:5.0, tok:5.6,
        phase:'POST', dir:'Bull', sig:'Low', asof:'2026-08-04',
        srcs:['F-109','F-118','X-21'],
        paid:{ mispricing:'FAIRLY', networkRead:'NEUTRAL', scope:'TOKEN-SPECIFIC' } }
    ],

    /* --- TECHNICALS · FIVE LAYERS, FIVE DIFFERENT TIERS -------------------
       ⛔ NOT ONE MODULE. The incoming handoff listed this as a flat settled
          list and OMITTED the paid NARRATIVES layer entirely; building from
          that row alone draws an ungated technicals module and silently drops
          a paid surface.
       Source: Leads/TA/20260812/HYPE_USDT · AUGUST 12, 2026.md              */
    ta: {
      composite: 5.0, band: 'NEUTRAL', asOf: '2026-08-12',
      timeframe: 'Daily candle', priceAtAnalysis: '$54.62',
      // layer 1 — FREE: composite + band (above)
      // layer 2 — ONE worked indicator free / all ten registered
      indicators: [
        { k:'RSI (14)',                    read:'Below 50, cooling but not oversold',        s:4.5, b:'Neutral' },
        { k:'EMAs (20 / 50 / 100 / 200)',  read:'Short-term bearish tilt, long-term supportive', s:4.0, b:'Bearish' },
        { k:'Bollinger Bands',             read:'Price in middle band, range-bound volatility',  s:4.5, b:'Neutral' },
        { k:'Fibonacci',                   read:'Caught between key retracement zones',      s:5.5, b:'Neutral' },
        { k:'Support',                     read:'Tight cluster of levels at $53.77, $52.67, $51.13', s:6.5, b:'Bullish' },
        { k:'Resistance',                  read:'Stacked and heavy, $56.12 and above',       s:3.0, b:'Bearish' },
        { k:'Trendline',                   read:'Descending but price clinging to it',       s:6.5, b:'Bullish' },
        { k:'MACD',                        read:'Line above signal, histogram positive, recovery hint', s:7.0, b:'Bullish' },
        { k:'On-Balance Volume',           read:'Falling, selling pressure visible',         s:3.0, b:'Bearish' },
        { k:'Chart Patterns',              read:'Symmetrical triangle, breakout imminent',   s:5.0, b:'Neutral' }
      ],
      // the ONE fully worked at unregistered — MACD, the strongest single signal
      workedIndicator: 'MACD',
      workedNarrative: 'MACD is the strongest bullish signal in this analysis. The MACD line at −1.720227 is now sitting above the signal line at −2.062414, and the histogram is positive at 0.342187. This crossover, even in negative territory, signals that momentum is beginning to reverse or at least stabilize.',
      // layer 4 — LEVELS: registered
      levels: {
        support:    ['$53.77', '$52.67', '$51.13', '$38.59'],
        resistance: ['$56.12', '$58.01', '$60.48', '$63.05'],
        ema:        ['EMA 20 $55.96', 'EMA 50 $58.38', 'EMA 100 $56.42', 'EMA 200 $47.47'],
        fib:        ['0.236 $47.32', '0.382 $52.99', '0.500 $57.56', '0.618 $62.14']
      },
      // layer 5 — INVALIDATION: registered
      invalidation: 'Break above $56.12 with volume flips to bullish; break below $51.13 confirms downtrend.',
      // free at every tier
      deepLink: 'https://altcoinbuzz.io',
      deepLinkLabel: 'Read the full technical analysis on altcoinbuzz.io',
      // ⛔ NARRATIVES (the ten written reads) are PAID and are NOT in this file.
      narrativesInPayload: false,
      // ⛔ Ruled off .com at every tier (TIERS.token.tradeSetups). The source
      //    article's entry/stop/target content is deliberately not read into
      //    this object, and the page renders SILENCE about it — no row, no
      //    lock, no mention (v3 item Q, decision 3).
      tradeSetupInPayload: false
    },

    /* --- AUDIO · never an empty state. Latest episode, or no module. ------- */
    audio: {
      token:  { title: 'SCORECARD MINUTE', ep: 'HYPE · as of 2026-08-04', len: '2:10',
                note: 'Every edition speaks its as-of date aloud in the first ten seconds.' },
      market: { title: 'THE WEEKLY SCOREBOARD', ep: 'Week of 2026-08-10', len: '11:40', voices: 'two voices' }
    }
  };

  /* ======================================================================
     10 · THE AI DISCLOSURE BLOCK — four parts, ALWAYS VISIBLE, NEVER
     DISMISSIBLE, IDENTICAL AT EVERY TIER INCLUDING UNREGISTERED.
     ⛔ TWO DATES, RENDERED SEPARATELY. Never one blended "UPDATED".
     ====================================================================== */
  var DISCLOSURE = {
    read: 'Answered from HYPE’s scorecard (13 catalyst rows) and its research file.',
    dateFundamentals: '2026-08-04',
    dateTechnicals:   '2026-08-12',
    // PART 3 · WHAT IT CANNOT SEE — rendered FROM CONFIG, not from markup,
    // because AI-1 rewrites it. ⚠ v3/W4's line reads "no other token"; the
    // 2026-08-17 ruling STRUCK exactly that boundary, so that phrasing is now
    // BACKWARDS and is deliberately absent below.
    cannotSee: [
      'The open web, and general crypto knowledge outside our own audited material.',
      'Anything published after the dates above.',
      'Price action, order books and positioning.',
      'Anything not carried by a RESEARCH file or a FACT_AUDIT entry.'
    ],
    // PART 4 · WHAT IT DOES NOT KNOW. The FLAG is free; WHAT the gap is and
    // what would clear it is PAID.
    gapFlagFree: 'This answer rests on one fact recorded as a [GAP].',
    gapDetailTier: 'paid'
  };

  /* ======================================================================
     11 · ASK BUZZ — FIVE RATIFIED STATES (OPEN-4), all switchable in the demo.
     ⛔ THE FLAGSHIP ANSWER IS A DISCONFIRMATION, NOT A DESCRIPTION.
        If the flagship answer describes the token, the review concludes we
        built a worse Wikipedia — and it will be right.
     ====================================================================== */
  var BUZZ = {
    states: ['answer', 'refusal', 'gated', 'quota', 'error'],

    /* (a) NORMAL GROUNDED EXCHANGE — the flagship. It names a circulating
       bullish claim, DATES it, and shows what is wrong with it. */
    answer: {
      q: 'Everyone says the HYPE buyback is a floor under the price. Is it?',
      parts: [
        { t: 'No. The number doing the work in that claim is roughly double the live one.' },
        { t: 'The claim in circulation is that the Assistance Fund buys back around 7% of market cap a year, described as ' },
        { t: '"the strongest revenue sharing mechanism"', em: true },
        { t: ' anywhere in crypto. That framing was set in March 2026 and the 7% figure still travels.', cite: 1 },
        { t: ' The live intensity is 3.0–3.5%. The 7% only reproduces if you put a rolling 365-day numerator ($770.96M) over a current market cap ($12.85B), a mismatch of vintages.', cite: 2 },
        { t: ' On the current 30-day flow the engine buys $34.7M a month, which is 54% of its own trailing-year average and down 33.2% against the prior disjoint 30-day window.', cite: 3 },
        { t: ' And netted against the staking issuance running beside it, the two mechanisms together ADD 0.18–0.23M HYPE a month. The burn does not cover the issuance.', cite: 4 },
        { t: ' The stock is real: 46.18M HYPE permanently gone, 4.6% of nominal max supply. The floor is not.', cite: 5 },
        { t: ' The loudest advocate of the floor thesis exited the position on 2026-06-04 and denied re-entering four days later.', cite: 6 }
      ],
      cites: [
        ['crypto.news · "Why HYPE is different: inside Hyperliquid’s buyback"', '2026-05-27'],
        ['FACT_AUDIT F-008 · buyback intensity derivation', '2026-08-04'],
        ['FACT_AUDIT F-004 · DeFiLlama dailyHoldersRevenue, chart-reconciled', '2026-08-04'],
        ['FACT_AUDIT F-018 · net structural float change', '2026-08-04'],
        ['FACT_AUDIT F-015 · cumulative burn 46.18M HYPE', '2026-08-03'],
        ['FACT_AUDIT F-020 · position exited 2026-06-04, re-entry denied 2026-06-08', '2026-06-08']
      ],
      sourceCount: 6,
      // Part 4 of the disclosure fires on this answer: it touches a [GAP].
      touchesGap: true
    },

    /* (b) REFUSAL AS A CREDENTIAL, NOT AN ERROR.
       It names its reason AND immediately offers what the user CAN have.
       ⛔ A bare "I can't help with that" reads as a broken product. */
    refusal: {
      q: 'Should I buy it?',
      reason: 'I don’t answer buy, sell or hold questions. Not as a disclaimer, but because a score is not a recommendation and pretending otherwise would make every other answer here worth less.',
      offer: 'What I can give you instead:',
      offers: [
        'The scorecard: all 13 catalyst rows, with the arithmetic that produces 4.6 and 5.3.',
        'The technicals read: the composite, and the condition that would invalidate it.',
        'The against-case: the strongest argument on the other side of the loudest catalyst.'
      ]
    },

    /* (c) THE GATE, HIT LIVE INSIDE THE CHAT.
       ⛔⛔ THE WITHHELD ANSWER IS NOT IN THIS FILE AND NOT IN THE DOM.
       There is no `answer` key here on purpose. A mockup that ships the
       withheld text and hides it with CSS teaches the build the wrong pattern.
       Withheld content is ABSENT; the gatebar stands in its place. */
    gated: {
      q: 'Which of my coins is most overpriced relative to what the network is doing?',
      why: 'That answer reads the mispricing and network_read columns.',
      gate: 'Those two columns are the paid product. The scores, the bands and the catalyst counts they are built from are free, on every token, right now.'
    },

    /* (d) QUOTA EXHAUSTED. ⚠ AI-4 IS OPEN: nothing rules what the quota is a
       quota OF, so this copy deliberately names no unit and no number. */
    quota: {
      head: 'Ask Buzz allowance used',
      body: 'You have used this period’s Ask Buzz allowance. The scorecard, the technicals and every catalyst row stay open.'
    },

    /* (e) ERROR / MODEL UNAVAILABLE. */
    error: {
      head: 'Ask Buzz is unavailable',
      body: 'The model is not responding. Nothing on this page depends on it. Every score, band, catalyst row and date above was written before the question was asked.'
    },

    /* ~3 SUGGESTED-QUESTION CHIPS beneath the latest answer.
       ⚠ AT UNREGISTERED THESE ARE VISIBLE BUT NOT INVOKABLE — a tap prompts
         registration. That is DELIBERATE (W4 L391: the chips and the disclosure
         render for the unregistered tier AS THE CONVERSION SURFACE). It is not
         a defect and must not be "fixed".
       ⚠ THE CHIP SET IS NOT SETTLED — only the count and the placement are.
         Chip 3 is cross-coin, which AI-1 may or may not permit. */
    /* ⛔ ROUND 6 · THE PILLS ARE SHORT AND CLICKABLE — MAX 7 WORDS, TARGET ~5.
       They were full sentences of up to 11 words, and they TRUNCATED in the bar,
       so the reader got half a question and no way to see the rest. A pill is a
       tap target with a label on it, not a sentence.
       ⚠ NEW COPY, so the frozen-terminology rule does not bind these — but the
         standalone word `board` is deliberately not written back into any of
         them. ⛔ `token score` STAYS: that names a SCORE, not the asset. */
    chips: [
      { q: 'Strongest argument against HYPE?',      scope: 'token' },        // 4 words
      { q: 'Which catalyst moved the token score?', scope: 'token' },        // 6 words
      { q: 'Widest network-to-token gap?',          scope: 'cross-coin' }    // 3 words · depends on AI-1
    ],

    /* ⭐ CHIPS ON THE BAR ITSELF — the CMC suggested-question pattern, attached
       to the persistent bottom-anchored launcher.
       ⛔⛔ ONE AI ENTRY POINT. CoinMarketCap has BOTH a chip row under the
          highlights AND a bottom bar. WE BUILD ONLY ONE, DELIBERATELY. The
          second strip is not missing; it was not built. Do not "fix" it.
       ⚠ VISIBLE-BUT-NOT-INVOKABLE at unregistered — a tap prompts registration.
         That is the conversion surface, built on purpose (W4 L391).
       ⚠ THE CHIP SET IS NOT SETTLED — only the count and the placement are.
         These are BOARD-scoped because the launcher sits on the board page, and
         AI-1 / AI-2 are still OPEN on how far a cross-coin question may reach. */
    /* ⛔ ROUND 6 · SAME RULE AS `chips` ABOVE — max 7 words, target ~5. These
       are the pills on the bar itself, which is where the truncation was
       actually happening. */
    /* ⭐ ROUND 7 · FIVE PILLS, NOT THREE. ⛔ Every one has to be a question THIS
       TABLE CAN ACTUALLY ANSWER, from what is already on screen — a suggested
       question the product cannot serve is a promise broken on the first tap.
       The two new ones read the CATALYST MIX column and the provenance line
       under the table respectively. */
    barChips: [
      { q: 'Which coin has the widest gap?',    scope: 'board' },   // 6 words
      { q: 'Bullish network, bearish coin?',    scope: 'board' },   // 4 words
      { q: 'Which coin has the most catalysts?', scope: 'board' },  // 6 words · reads the mix column
      { q: 'How fresh are these scores?',       scope: 'board' },   // 5 words · reads the provenance line
      { q: 'How is the TNT score built?',       scope: 'method' }   // 6 words
    ]
  };

  /* ======================================================================
     11b · PRICING / SUBSCRIBE — ➕ A NEW SURFACE, 2026-08-17.

     ⛔⛔ THIS IS A RE-RULING, NOT A NEW IDEA. Monetisation was ruled to arrive
        at Beta. The operator changed that ruling for Alpha, because the team
        cannot give the feedback that closes E2 and AI-3 without seeing what
        monetisation looks like.

     ⭐⭐ THE CONTEXT THAT GOVERNS HOW IT IS BUILT: ALPHA IS INTERNAL ONLY AND IS
        NOT SHARED PUBLICLY — the meeting runs from localhost and there is no
        deploy. That is why this does not breach the canon rule against
        publishing an offer: that rule governs PUBLIC surfaces, and this is not
        one. ⚠ INTERNAL TODAY DOES NOT MEAN INTERNAL FOREVER.

     ⛔ THE PAGE'S JOB IS TO PROVOKE THE RULINGS, NOT TO STATE THEM.

     ⛔ GUARD 1 of 2 — THE CONFIG HALF. The DOM half is the data-mockup-only
        attribute and the banner in alpha.js; together they make a future PUBLIC
        build FAIL LOUDLY rather than ship this silently. alpha.js checks the
        host at render and paints a red banner off localhost / file://.
     ⛔ GUARD 2 of 2 — NO SIGNUP QUEUE, NO CAP, NO SCARCITY, NO EARLY-ENTRY
        STRING. The 500 free-beta offer is WITHDRAWN ENTIRELY and this re-ruling
        does NOT revive it. Prices and tiers only.
     ====================================================================== */
  var PRICING = {
    MOCKUP_ONLY: true,
    mockupBanner: 'MOCKUP ONLY · INTERNAL ALPHA. No offer is being made here, and no price point has been ruled.',

    /* ⛔⛔ NOTHING IN CANON RULES A PRICE POINT, SO NO NUMBER IS INVENTED.
       An invented price that looks plausible is the expensive kind of invention:
       it would be quoted back in the meeting as if it had been decided. Every
       amount below is null and renders as a MARKED placeholder. */
    priceUnruled: true,
    priceUnruledLabel: 'PRICE POINT NOT RULED',
    switcherNote: 'The dark bar at the top of this page is a DEMO CONTROL, not a purchase control. It changes what you are shown; it buys nothing.',

    plans: [
      { key: 'unregistered', name: 'Free', price: null,
        blurb: 'The score, and everything needed to check it.',
        open: null,
        /* every line below is a UI_BRIEF §4.1 / §4.2 row — nothing is invented */
        includes: [
          'Every token on the board, with all scores and bands, free',
          'The catalyst count on every token',
          'The provenance stamps: as-of, technicals-as-of, calibration',
          'How We Score, and search across tokens and catalysts',
          'One fully-worked catalyst row per token, with its sources',
          'One fully-worked technical indicator',
          'The weekly show, and every article',
          'The Ask Buzz disclosure block, identical at every tier'
        ] },

      { key: 'registered', name: 'Registered', price: null,
        blurb: 'An account, a watchlist, and the ten indicator scores.',
        /* 🚨 A THREE-COLUMN PRICE TABLE STRUCTURALLY REQUIRES THIS COLUMN, and
           E2 — what the registered tier is FOR — IS UNRULED and has NO OWNER.
           ⛔ Filling it with a guess launders an open question into a decided
              one. Leaving it blank answers it badly. So it is MARKED, with the
              same drawnAs treatment already used on AI-1 / AI-2. */
        open: 'E2', drawnAs: 'tier-column-drawn-contents-unruled',
        openNote: 'What the registered tier is FOR is not ruled. The rows below are the tier-matrix rows that already land here. They are not a proposition, and this column is the first thing the meeting should rule on.',
        includes: [
          'My Watchlist',
          'The suggested watchlist, three boards',
          'Ask Buzz, with a quota',
          'The top half of every scorecard by significance',
          'All ten technical indicator scores',
          'The levels, and the condition that would invalidate the read',
          'The per-token audio edition'
        ] },

      { key: 'paid', name: 'Paid', price: null,
        blurb: 'The argument behind the score.',
        open: 'AI-3', drawnAs: 'analytics-lines-marked-unruled',
        openNote: 'Which analytics are paid is AI-3, and it is open. The three analytic columns are drawn here because §4.2 already lists them as paid. How far that extends is not ruled.',
        includes: [
          'Every catalyst row on every token',
          'The analytic columns: mispricing, network read, impact scope  ⟵ AI-3',
          'The ten written technical reads',
          'The RESEARCH dossier: transmission, for and against, discourse check',
          'What a [GAP] actually is, and what would clear it',
          'The suggested watchlist in full',
          'The per-token audio archive',
          'Weekly and monthly timeframes, post-Beta',
          'The score-over-time series, once it exists. Not at launch.'
        ] }
    ]
  };

  /* ======================================================================
     11c · NAV STUBS — ⛔ NOTHING IN THE NAV MAY 404 IN THE MEETING ROOM.
     ⚠ A stub that answers an OPEN question has ruled it by drawing it. The
       Research stub therefore lists NO article categories: E1 is the
       operator's, and a category list IS an answer to it.
     ====================================================================== */
  var STUBS = {
    research: {
      title: 'Research',
      lede: 'Articles are housed here.',
      open: 'E1',
      body: 'What a .com article carries, whether it stops at the facts or also carries the analytic read (the "so what"), is open question E1, and it is the operator’s to close. This stub deliberately lists no sections, no categories and no example pieces, because a list of them would be an answer to E1 drawn rather than ruled.',
      matrix: 'Tier matrix §4.1: articles are free at every tier.'
    },
    hws: {
      title: 'How We Score',
      lede: 'Every gatebar on this site links here.',
      body: 'A paywall that publishes the method behind the output it is withholding is the most honest conversion surface this product can own, and it costs one link.',
      axes: [
        ['Token', 'Does the catalyst reach the coin you can actually buy?'],
        ['Network', 'Does it help the tech?'],
        ['Technicals', 'Ten chart indicators, averaged. Daily candle, valid one week.']
      ]
    },
    market: {
      title: 'Market',
      lede: 'The weekly show.',
      body: 'Two voices, 8–15 minutes, weekly. Every edition speaks its as-of date aloud in the first ten seconds. The current edition is open to everyone; the archive is paid.',
      showName: 'THE WEEKLY SCOREBOARD'
    }
  };

  /* ======================================================================
     12 · GATING HELPER — the pattern the build should inherit.
     ⛔ WITHHELD CONTENT IS ABSENT FROM THE DOM. It is never written and then
        blurred. v3's `.gated .num{filter:blur(7px)}` is exactly the wrong
        pattern and is NOT carried into alpha.css.
     ⚠ Honest limit of a one-file mockup: because the tier is a RUNTIME toggle,
       the paid strings for the SCORECARD must exist in this file for the demo
       to be able to flip to paid. What the renderer guarantees is that they are
       never written to the DOM below their tier. The ONE place the stricter
       rule is demonstrated end-to-end is BUZZ.gated above, which carries no
       answer text at all, at any tier.
     ====================================================================== */
  function allows(matrix, key, tier) {
    var v = matrix[key];
    return v ? v[tier] : false;
  }

  return {
    OPEN: OPEN, BUILD_RAISED: BUILD_RAISED, BRAND: BRAND, NAV: NAV,
    TIERS: TIERS, BANDS: BANDS, BAND_CLASS: BAND_CLASS,
    BOARD: BOARD, BOARD_ASSERT: BOARD_ASSERT, PROVENANCE: PROVENANCE,
    HIGHLIGHTS: HIGHLIGHTS, TOKEN: TOKEN, DISCLOSURE: DISCLOSURE, BUZZ: BUZZ,
    PRICING: PRICING, STUBS: STUBS,
    allows: allows
  };
})();
