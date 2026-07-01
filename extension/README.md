# Devil's Ace — Blackjack Practice Coach (Chrome extension)

A Manifest V3 companion to the [Devil's Ace trainer](../). It floats a draggable **card-counting HUD** and **basic-strategy coach** over any tab so you can drill your count and decisions while you practice.

> ### ⚠︎ Practice / training only
> This is a learning aid. Using count- or strategy-assistance software while playing **real-money online blackjack** violates essentially every casino's Terms of Service and can be **illegal** depending on where you live (many jurisdictions have "gambling device" / cheating statutes). Tools built for that purpose are also rejected from the Chrome Web Store — which is why this is shipped as a **load-unpacked** personal practice tool, not a published extension.
>
> It does **not** scrape casino sites, read game state, place bets, or automate play. **You** tap the cards; it just does the math. Use it on free-play / demo tables or alongside the trainer.

## What it does
- **Count tab** — tap each card as it's dealt (with a Black/Red colour switch that the Red 7 system uses). Shows running count, true count, decks remaining (from a shoe-size setting), and a count-based suggested bet. Undo / reset.
- **Coach tab** — pick the dealer's up-card and your cards; it shows the correct play for your rules **and factors in your live true count from the Count tab**, flagging **Illustrious 18 / Fab 4** index deviations (and insurance at TC ≥ +3). When the count changes the play, it highlights the deviation and shows the index rule.
- Six counting systems (Hi-Lo, KO, Hi-Opt I, Omega II, Zen, Red 7) and rule toggles (decks, H17/S17, DAS, late surrender), shared via the popup.
- **Global hotkey `Alt+Shift+C`** to show/hide the overlay on the current tab (rebind at `chrome://extensions/shortcuts`).
- Draggable, collapsible overlay in a Shadow DOM so it never clashes with the page's styles.

## Privacy & permissions
- Permissions: `activeTab`, `scripting`, `storage` — **no broad host permissions**. The overlay is only injected into the current tab when *you* click the toolbar button.
- Nothing is sent anywhere. No network calls, no analytics. Settings live in `chrome.storage.sync`; the count lives in memory for the session.

## Install (load unpacked)
1. Open `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode** (top-right).
3. Click **Load unpacked** and select this `extension/` folder.
4. Pin the ♠ icon, open a practice page, click the icon, set your system/rules, and hit **Show / hide overlay on this tab**.

## Publishing to the Chrome Web Store
To make it installable in one click (no developer mode), see [`store/SUBMISSION.md`](./store/SUBMISSION.md) for the step-by-step, [`store/LISTING.md`](./store/LISTING.md) for the ready-to-paste listing copy + permission justifications, and [`store/screenshots/`](./store/screenshots) for the 1280×800 assets. Privacy policy is hosted at https://atxgreene.github.io/Project_Devils_Ace/privacy.html. Publishing requires your own Google developer account (one-time $5) and passes through Google's review.

## Files
- `manifest.json` — MV3 manifest
- `popup.html` / `popup.js` — settings + inject/toggle button
- `content.js` — the overlay: counting engine, strategy + index-deviation engine, HUD (self-contained, no dependencies)
- `background.js` — service worker for the `Alt+Shift+C` toggle command
- `icons/` — action icons
