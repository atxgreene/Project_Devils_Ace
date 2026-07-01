# Project Devil's Ace ♠

**Don't Bust. Beat the House.** — a full blackjack **advantage-play trainer**. A local-first, offline-capable PWA that teaches everything a card counter actually needs, from perfect basic strategy to true-count conversion, index deviations, and a Monte-Carlo edge simulator.

🔗 **Live:** https://atxgreene.github.io/Project_Devils_Ace/

## Modes

- **Basic Strategy Trainer** — Deals random hands; you pick Hit / Stand / Double / Split / Surrender and get instant feedback with the reasoning. Accuracy, streak, and hand counters persist locally. Perfect play cuts the house edge to ~0.5%.
- **Card Counting Drill** — Cards flash one at a time at an adjustable speed; keep the running count and enter it at the end. Supports six systems: **Hi-Lo, KO, Hi-Opt I, Omega II, Zen Count, Red 7** (balanced & unbalanced, level 1 & 2).
- **True Count Conversion** — Drill the running-count ÷ decks-remaining division that actually drives your bets and deviations.
- **Deviations — Illustrious 18 + Fab 4** — Given a hand and a true count, choose the correct index play. This is where most of a counter's added edge comes from.
- **Edge Simulator** — Monte-Carlo model of a counting session: set rules, bankroll, bet spread, and penetration, then see expected value, player edge, risk of ruin, and sampled bankroll trajectories.
- **Live Strategy Chart** — Full hard / soft / pairs chart that regenerates instantly for your exact rules.

## Rules engine

Basic strategy is computed from first principles for your configured rules and validated against a canonical 6-deck reference chart:

- 1 / 2 / 4 / 6 / 8 decks
- Dealer **Hits or Stands on Soft 17** (H17 / S17)
- **Double After Split** (DAS / NDAS)
- **Late Surrender** on/off

## Tech

- Single-file HTML + vanilla JS, **zero external dependencies** — all card logic, strategy tables, counting systems, and the simulator are self-contained, so it renders and runs fully offline.
- Installable PWA (service worker + manifest), LocalStorage persistence, zero telemetry.
- GitHub Pages deployment.

## Disclaimer

Educational tool only. Card counting is legal, but casinos are private businesses and may bar advantage players. The simulator is a statistical model that assumes disciplined play and honest games — variance is real and no tool guarantees a win.
