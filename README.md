# A Little Universe — server-backed short birthday links

This version fixes long share URLs by saving each birthday in Netlify Blobs and sharing only a short ID such as `/?gift=abc123def4`. Photos and an optional small gift song are saved with the birthday data, not put in the URL. The background music remains a separate `hum-mar-jayenge.mp3` file.

## Important deployment change

The old Netlify Drop/static-only deployment cannot run the Netlify Function needed for short links. Deploy this folder through a Git-connected Netlify site so Netlify builds `netlify/functions/gifts.mjs` and installs `@netlify/blobs`.

## Deploy via GitHub (phone-friendly route)

1. Upload the contents of this folder to the root of the existing GitHub repository. Make sure `index.html`, `hum-mar-jayenge.mp3`, `package.json`, and `netlify.toml` are in the root, and `netlify/functions/gifts.mjs` is present.
2. In Netlify, open the existing site and go to **Site configuration → Build & deploy → Continuous deployment** (wording may vary), then link the existing GitHub repository. If Netlify asks to import a repository, choose `iteshsaif-del/Birthday-wishes-`.
3. Set the build command to `npm run build` and publish directory to `.` if prompted. `netlify.toml` also specifies these settings.
4. Trigger a new deploy and wait for it to finish. Netlify Functions and Blobs are needed; merely dragging this folder into Netlify Drop will not enable server-side storage.
5. Open the site, create a new birthday, and generate a link. It should look like `https://your-site.netlify.app/?gift=0123abcdef`.
6. Test that link in an incognito tab. Existing `#gift=...` links continue to work with the legacy decoder as long as the payload is intact, but create new links for future gifts.

## Notes

- Each share link is a random ID backed by Netlify Blobs. Anyone who has the link can view that gift.
- The saved gift does not automatically expire or have a delete UI.
- This is designed for Netlify's current Node.js Functions runtime and Netlify Blobs. Check the deploy log if the function fails to build.
