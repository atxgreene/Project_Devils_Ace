# Project Devil's Ace ♠

**Don't Bust. Beat the House.** — a full blackjack **advantage-play trainer**. A local-first, offline-capable PWA that teaches everything a card counter actually needs, from perfect basic strategy to true-count conversion, index deviations, and a Monte-Carlo edge simulator.

🔗 **Live:** https://atxgreene.github.io/Project_Devils_Ace/

## Modes

- **Play a Shoe** — A live, playable multi-deck table for virtual money. The running/true count updates as cards come out, the app suggests a bet off the true count, and an optional **coach** flags any deviation from correct strategy in real time. Full rules: hit/stand/double/split (to 4 hands)/surrender, dealer H17/S17, blackjack pays 3:2, dealer peek, count-based insurance, and a shuffle at ~75% penetration. Bankroll and the shoe persist across hands; you can hide the count to practice keeping it yourself.
- **Basic Strategy Trainer** — Deals random hands; you pick Hit / Stand / Double / Split / Surrender and get instant feedback with the reasoning. Accuracy, streak, and hand counters persist locally. Perfect play cuts the house edge to ~0.5%.
- **Card Counting Drill** — Cards flash one at a time at an adjustable speed; keep the running count and enter it at the end. Supports six systems: **Hi-Lo, KO, Hi-Opt I, Omega II, Zen Count, Red 7** (balanced & unbalanced, level 1 & 2).
- **True Count Conversion** — Drill the running-count ÷ decks-remaining division that actually drives your bets and deviations.
- **Deviations — Illustrious 18 + Fab 4** — Given a hand and a true count, choose the correct index play. This is where most of a counter's added edge comes from. Includes a full Hi-Lo index reference table.
- **Camera Count Assist** *(experimental)* — Point your device camera at the table; on-device canvas CV detects when a card is in frame and reads its **red/black colour** (which the Red 7 system needs), while the app automates the running/true count and bet suggestion. Rank is a one-tap keypad (with an opt-in best-effort auto-guess, beta). No frames ever leave the device; falls back to a fully-functional manual mode with no camera. For at-home practice only.
- **Edge Simulator** — Monte-Carlo model of a counting session with **back-counting / Wonging** (enter only above a chosen true count), optional **Kelly bet sizing**, and a full metrics panel: expected $/session and $/hour, player edge, session standard deviation, risk of ruin, share of sessions in profit, median end bankroll, and **N0** (hands needed to overcome one SD of variance), plus sampled bankroll trajectories.
- **Live Strategy Chart** — Full hard / soft / pairs chart that regenerates instantly for your exact rules.

## Chrome extension (practice companion)

A Manifest V3 browser extension in [`extension/`](./extension) floats the counting HUD + strategy coach over any tab so you can drill while practicing. **Training only** — it doesn't read casino game state, bet, or automate anything (you tap the cards); using count assistance on real-money online blackjack breaks casinos' terms and may be illegal. Load it unpacked from `chrome://extensions`. See [extension/README.md](./extension/README.md).

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
