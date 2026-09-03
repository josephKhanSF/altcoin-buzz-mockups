/* ═══════════════════════════════════════════════════════════════════════════
   `#649` · THE MARKET KEY-TAKEAWAY SIDECAR · 2026-09-03
   The EDITORIAL layer of the `#/market` dashboard: one to three plain-English
   lines per module, written like an expert explaining what is really
   happening. Read by the market engine in index.html; nothing here computes.

   ⛔⛔ A TAKEAWAY IS A CLAIM ABOUT THE CURRENT STATE, SO IT IS NEVER ONE STRING.
      Every slot is a BRANCH SET keyed by a branch id the engine picks from
      state it already computes (band splits, shelf means, catalyst pressure,
      the parity relation). One sentence set per branch. The trigger for each
      branch is registered, next to its prose, in
      Website/DUMMY_DATA_MANIFEST_2026-09-01.md §3b (`#649`).
   ⛔ SECTOR AND COIN NAMES ARE NEVER TYPED INTO A SENTENCE. A `{token}` is
      filled by the engine from the shelf list as computed, in order, through
      the `names` map below, so the mapping is editorial and visible. A token
      with a capital first letter (`{Bull}`) is capitalised: it opens a sentence.
   ⛔ HOUSE RULES ON EVERY STRING: no digit, no percentage, no em dash, no
      instruction to the reader (descriptive only, operator ruling 1, 2026-09-03).
      The three team-approved samples (M1-left `tec_leads`, M7 `most_above`,
      M5's clause wording) are carried VERBATIM; they set the register.
   ⛔ REV-1, 2026-09-03 · EVERY SLOT CARRIES A `short` BRANCH. The engine holds
      an ASSEMBLED string to `60` words (operator ruling B). A slot that blows
      the ceiling renders its `short` instead, so `short` is (a) the SHORTEST
      standalone string in its set, (b) NAME-FREE, so the fallback cannot itself
      grow, and (c) TRUE IN EVERY BRANCH of that slot, because the guard fires
      without knowing which branch was picked. A `short` is a guard, not a
      state read: it should never be what the board renders.
   ⛔ A CLAUSE NAMES AT MOST THREE SHELVES, then `and others` (ruling C). The
      engine caps the list; the wording of the clause is untouched.
   ═══════════════════════════════════════════════════════════════════════════ */
window.MARKET_TAKEAWAYS = {

  /* shelf name (as `window.SECTOR_MAPS` publishes it) → the plain-English
     phrase a sentence uses. `L1/L2` carries digits and `Unassigned` is not a
     sector, which is why this map exists rather than the raw label.
     ⚠ Every SECTOR phrase is PLURAL (the M5 clauses conjugate plural: "have");
     the ecosystem phrases are singular and only ever meet singular verbs (M6). */
  names: {
    'DePIN':      'DePIN coins',
    'CEX':        'exchange tokens',
    'Memecoins':  'memecoins',
    'Privacy':    'privacy coins',
    'RWA':        'real-world asset coins',
    'AI':         'AI coins',
    'DEX':        'DEX coins',
    'DeFi':       'DeFi coins',
    'L1/L2':      'layer-one chains',
    'Unassigned': 'unsorted coins',
    'ETH Ecosystem':       'the Ethereum ecosystem',
    'SOL Ecosystem':       'the Solana ecosystem',
    'BNB Ecosystem':       'the BNB ecosystem',
    'SUI Ecosystem':       'the Sui ecosystem',
    'Robinhood Ecosystem': 'the Robinhood ecosystem'
  },

  slots: {

    /* ── M1-left · Where the green comes from ─────────────────────────────
       Branches on which axis carries more bullish band words: Technicals
       against Token (the axis the score exists to measure). */
    sxmM1Lp: {
      tec_leads: 'The market is going up, but not because the coins got better. Money is coming in and prices are rising. That is all. Most of these projects have not done anything new yet. A coin that is going up is not the same as a coin that has earned it.',
      tok_leads: 'The green here comes from the coins themselves, not from the charts. More coins are bullish on what their projects actually capture than on price alone. That is the harder kind of green to earn, and the kind that does not depend on money flowing in.',
      level:     'The charts and the coins agree for now. As many coins are bullish on what they capture as on price. Neither the money coming in nor the projects themselves is the whole story; the two are moving together.',
      short:     'The charts and the coins are counted apart here. A coin going up and a coin getting better are not the same thing, and this card keeps the two separate.'
    },

    /* ── M1-right · Average TNT by sector ──────────────────────────────────
       Branches on which shelf tops the averages and whether it is deep. */
    sxmM1Rp: {
      thin_on_top: 'The best-looking averages belong to the smallest sectors. A sector with only a few coins has an average that is really just those coins. The big sectors sit lower, because many coins pull each other toward the middle.',
      deep_on_top: 'The highest average on the board belongs to {top}, and that is a big sector, so many coins share the result. A small sector’s average is really just a few coins, so it says less.',
      no_deep:     'No sector here has enough coins for its average to mean much. Each average is really a handful of coins, so the sector label says little about any one of them.',
      short:       'Each bar is a sector average. A sector with only a few coins has an average that is really just those coins.'
    },

    /* ── M7 · The decoupling field ─────────────────────────────────────────
       Branches on the share of marks above the parity line (chart ahead of
       token) against below it. */
    sxmM7p: {
      all_above:  'Imagine a line where the price and the real progress of a coin agree. Every coin is above that line. Prices have moved up faster than the projects have moved forward, without a single exception. That gap will close one day, up or down.',
      most_above: 'Imagine a line where the price and the real progress of a coin agree. Almost every coin is above that line. Their prices have moved up faster than the projects have moved forward. That gap will close one day, up or down. The few coins below the line are the opposite: real progress, price not yet caught up.',
      split:      'Imagine a line where the price and the real progress of a coin agree. The coins are spread on both sides of it. Some have prices running ahead of their progress; others have progress their price has not yet caught up with. There is no single market story here.',
      most_below: 'Imagine a line where the price and the real progress of a coin agree. Almost every coin is below that line. The projects have moved forward faster than their prices have. The few coins above the line are the opposite: price ahead of progress.',
      all_below:  'Imagine a line where the price and the real progress of a coin agree. Every coin is below that line. The projects have moved forward faster than their prices, without a single exception. Price has not caught up with progress anywhere on the board.',
      short:      'Each mark is a coin, with its price read across and its real progress read up. The dashed line is where the two agree.'
    },

    /* ── M3 · Spread ───────────────────────────────────────────────────────
       Branches on whether every deep shelf straddles the board mean. */
    sxmM3p: {
      straddle_all: 'Every big sector has coins on both sides of the board average. The sector label does not tell you whether a coin is strong or weak. Inside each sector the strong and the weak sit together, so the coin matters more than the sector.',
      apart:        'Not every big sector straddles the board average. For {apart}, every coin is on the same side of it, so there the sector label does say something about the coin. Elsewhere the strong and the weak sit together.',
      no_deep:      'No sector here is big enough to straddle anything. Each row is a handful of coins on one ruler, so a row’s spread is just those few coins, not a picture of a sector.',
      short:        'Each row is one sector spread along the board ruler. Where a row crosses the board average, its strong and its weak coins sit together.'
    },

    /* ── M4 · Score source ─────────────────────────────────────────────────
       Branches on the sign of the Technicals-minus-Token gap across shelves. */
    sxmM4p: {
      charts_ahead_all: 'In every sector the chart score sits above the token score. The price charts look better than what the coins can actually capture, and that is true across the whole board, not in one corner of it. This is a market story, not a sector story.',
      tokens_ahead_all: 'In every sector the token score sits above the chart score. What the coins can actually capture looks better than their price charts, across the whole board. Progress is ahead of price everywhere, not in one corner of the market.',
      mixed:            'The sectors do not agree. In {charts} the chart score sits above the token score. In {tokens} the token score leads. Price and progress are not moving together across the board; each sector has its own story.',
      level:            'In every sector the chart score and the token score sit at the same place. Price and progress are moving together everywhere, which is the rarest state on this board.',
      short:            'Every sector here is read twice, once on the charts and once on the coins. The gap between those two reads is what this card shows.'
    },

    /* ── M5 · Catalyst pressure ────────────────────────────────────────────
       Composed: an opener chosen by the depth of the net-bullish shelves,
       then one clause per non-empty group (bullish · balanced · bearish),
       in that order. The clause wording is the team’s own. `flat_only`
       replaces the whole thing when no shelf is clearly on either side. */
    sxmM5p: {
      opener_small: 'The small sectors have the most good news coming.',
      opener_big:   'The big sectors have the most good news coming.',
      opener_mixed: 'The good news is spread across big and small sectors.',
      bull:         '{Bull} have more events that help them than events that hurt them.',
      flat:         '{Flat} have good and bad news in equal amounts.',
      bear:         '{Bear} have more bad news than good.',
      flat_only:    'No sector has clearly more good news than bad right now. The events on every shelf are roughly balanced between the ones that help and the ones that hurt. That is a quiet board, not a bad one.',
      short:        'Every sector here carries its own mix of good news and bad. This card is that mix as it stands, with no history read and no trend drawn.'
    },

    /* ── M6 · Ecosystem head-to-head ───────────────────────────────────────
       Branches on the gap between the two highest ecosystem means. */
    sxmM6p: {
      close: '{A} and {b} score almost the same on average. Neither camp is clearly ahead, and the ecosystem label does not separate them. What separates coins here is the coin itself, not which chain it lives on.',
      clear: '{A} scores clearly higher than {b} on average. Here the ecosystem label does say something: the coins on one chain are, taken together, in better shape than the coins on the other.',
      one:   'Only {a} has coins here, so there is nothing to compare it against yet. Its figures stand on their own.',
      none:  'No coin carries an ecosystem yet, so there is no head-to-head to read. This is a real state, not an error.',
      short: 'Each camp here is the average of its own coins. A camp with few coins is just those coins.'
    },

    /* ── M2 + M8 · Zero in ─────────────────────────────────────────────────
       Branches on how many deep shelves have a majority of coins above the
       board mean. */
    sxmM8p: {
      all_above: 'In every big sector, more than half the coins score above the board average. The average is held down by a small number of low scores, not by any one sector. The pinned coins on each row are the ones carrying their sector.',
      all_below: 'In every big sector, fewer than half the coins score above the board average. The average is held up by a small number of high scores, not by any one sector. Most coins in the big sectors sit below the line the few strong ones set.',
      split:     'The most coins above the board average are in {top}; the fewest are in {bottom}. A sector’s place here is about how many of its coins are strong, not how strong its best coin is.',
      even:      'In {top}, exactly half the coins sit above the board average and half below. A sector’s place here is about how many of its coins are strong, not how strong its best coin is.',
      no_deep:   'No sector here has enough coins to be ranked with confidence. Each row is a few coins, and its place in the list is set by one or two of them.',
      short:     'Every big sector here is read on how many of its coins beat the board average, not on how strong its best coin is.'
    }
  }
};
