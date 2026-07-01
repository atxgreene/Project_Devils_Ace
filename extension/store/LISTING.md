# Chrome Web Store listing — copy & answers

Paste these into the Developer Dashboard fields when you create the item.

## Product name
Devil's Ace — Blackjack Practice Coach

## Summary (132-char limit)
Practice-only blackjack trainer: card-counting HUD + basic-strategy & live index-play coach. Not for real-money gambling.

## Category
Education  *(alternative: Productivity — there is no "gambling" category; keep the educational framing)*

## Language
English (United States)

## Detailed description
Drill your blackjack game like the pros — at home, for practice.

Devil's Ace floats a draggable heads-up display over your browser so you can rehearse card counting and perfect strategy on free-play / demo tables. You tap each card as it's dealt; the extension does the running count, true count, decks-remaining estimate, and a count-based bet suggestion. A Coach tab tells you the mathematically correct play for any hand — and factors in your live true count to flag Illustrious 18 / Fab 4 index deviations and insurance decisions.

FEATURES
• Count HUD — running & true count, decks left, suggested bet; six systems (Hi-Lo, KO, Hi-Opt I, Omega II, Zen, Red 7)
• Strategy Coach — correct basic-strategy play for your rules (decks, H17/S17, DAS, late surrender)
• Live index deviations — Illustrious 18 + Fab 4 flagged at your current true count, with insurance advice
• Red/Black colour switch (for the Red 7 system), undo, reset
• Global hotkey (Alt+Shift+C) to show/hide the overlay
• Draggable, collapsible overlay rendered in a Shadow DOM so it never clashes with the page

PRIVACY
No data collected, nothing transmitted, no servers, no analytics. Your settings are stored locally. The extension does not read the pages you visit — you enter the cards manually.

IMPORTANT — PRACTICE ONLY
This is an educational training aid. It is not for use during real-money online blackjack: using counting/strategy assistance there violates gambling operators' terms of service and may be illegal where you live. Card counting itself is a legal mental skill; this tool exists to help you learn it.

## Single purpose (required statement)
A practice/training overlay that helps a user rehearse blackjack card counting and basic strategy by tracking a count they enter manually and showing the correct play. It has one purpose: blackjack practice coaching.

## Permission justifications
- **activeTab** — The overlay is injected only into the tab the user explicitly activates (toolbar click or keyboard shortcut). No broad host access.
- **scripting** — Used to programmatically inject the overlay's script into that active tab on user action.
- **storage** — Saves the user's chosen counting system and table rules locally so they persist.
- **host permissions** — None requested.

## Privacy practices (Data use disclosures)
- Does the item collect or use personal/sensitive user data? **No.**
- Personally identifiable info: No · Health: No · Financial/payment: No · Authentication: No · Personal communications: No · Location: No · Web history: No · User activity: No · Website content: No
- Remote code: **No** (all code is packaged in the extension).
- Certify compliance with the Developer Program Policies: **Yes**
- Privacy policy URL: https://atxgreene.github.io/Project_Devils_Ace/privacy.html

## Assets
- Store icon: 128×128 — `extension/icons/icon128.png`
- Screenshots (1280×800): `extension/store/screenshots/`
- (Optional) small promo tile 440×280 — not required for submission.

## Recommended visibility
**Unlisted** to start — installable by anyone with the link (no dev mode), but not shown in public search, which lowers the profile of a gambling-adjacent tool while you confirm it passes review. You can switch to Public later.
