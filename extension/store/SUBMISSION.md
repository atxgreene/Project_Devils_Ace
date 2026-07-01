# Publishing to the Chrome Web Store — step by step

This makes the extension installable in one click (no developer mode). It has to be **you** who submits it — publishing needs your Google account, a one-time fee, and Google's review. Everything on the code side is ready.

## 0. Before you start — the honest caveats
- **One-time $5 fee** to register as a Chrome Web Store developer (Google's charge, not mine).
- **Review** takes anywhere from a few hours to a few business days.
- **Policy risk:** gambling-related tools get extra scrutiny. This is scoped and labelled as an educational *practice* tool with no real-money assistance and no page scraping, which is the compliant framing — but approval is Google's call. If it's rejected, see "If it gets rejected" below.
- Recommended: publish **Unlisted** first (installable by link, hidden from search).

## 1. Build the upload package
From the repo root:
```
cd extension
zip -r ../devils-ace-extension-v1.0.0.zip \
  manifest.json content.js background.js popup.html popup.js icons \
  -x '*.DS_Store'
```
That ZIP (also delivered to you in chat) is exactly what you upload — it contains only the runtime files, no docs/store assets.

## 2. Register (one time)
1. Go to the **Chrome Web Store Developer Dashboard**: https://chrome.google.com/webstore/devconsole
2. Sign in with the Google account you want to own the listing.
3. Pay the one-time **$5** registration fee and accept the developer agreement.
4. (Recommended) Complete the developer email verification and, if prompted, publisher verification.

## 3. Create the item
1. Click **Add new item** → upload `devils-ace-extension-v1.0.0.zip`.
2. Fill the **Store listing** tab from [`LISTING.md`](./LISTING.md): product name, summary, detailed description, category (Education), language, and upload the **screenshots** in [`screenshots/`](./screenshots) (1280×800) and the 128×128 icon.
3. **Privacy** tab: set the privacy policy URL to
   `https://atxgreene.github.io/Project_Devils_Ace/privacy.html`
   and answer the data-use questions exactly as listed in `LISTING.md` (everything "No", no remote code, certify compliance).
4. **Permissions justification**: paste the activeTab / scripting / storage justifications from `LISTING.md`.
5. Set **Visibility** to **Unlisted** (or Public if you prefer).

## 4. Submit
Click **Submit for review**. You'll get an email on approval; the item then installs from its Web Store link with no developer mode.

## 5. Updating later
Bump `"version"` in `manifest.json`, re-zip, and upload a new package to the same item.

## If it gets rejected (gambling policy)
1. Read the rejection reason — it names the specific policy.
2. Common fixes: strengthen the "practice only / not for real-money" language, make the educational purpose the headline, ensure no wording implies beating real casinos.
3. **Alternative store:** the **Microsoft Edge Add-ons** store (https://partner.microsoft.com/dashboard/microsoftedge) takes the same MV3 package, is free to register, and is often more permissive for educational tools. Edge users then install with one click too.
4. **Fallback:** the current load-unpacked instructions in the main README always work for you and anyone technical.

> Note: distributing a signed `.crx` outside a store only auto-installs for **enterprise-managed** browsers (via admin policy). For regular users, the Web Store (Chrome or Edge) is the only no-dev-mode path.
