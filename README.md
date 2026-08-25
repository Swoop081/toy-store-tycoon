# Toy Store Tycoon v0.1.6 — Cache-Busting

A mobile-first, static GitHub Pages prototype for the fresh Toy Store Tycoon project.


## Safari / GitHub Pages cache-busting

- Core CSS and JavaScript files now use release-versioned filenames (`styles.v0.1.6.css`, `data.v0.1.6.js`, `app.v0.1.6.js`) so Safari cannot reuse an older build file after deployment.
- Product artwork, branding, icons and the web-app manifest receive a `?v=0.1.6` cache-busting version token.
- The HTML includes no-cache metadata as an additional safeguard for navigation documents.
- The installed web-app manifest starts at `./?v=0.1.6`, helping iOS home-screen launches request the current release URL.
- After uploading a new release to GitHub Pages, if Safari is already holding an older `index.html`, open the site once with `?v=0.1.6` appended to the URL. From v0.1.6 onward, release-versioned core files prevent the old CSS/JS bundle problem.

## Included in this milestone

- Main Menu / New Store / Continue
- Opening-order onboarding
- 12 fictional first-build product families across six suppliers
- Recommended opening order with editable quantities
- Immediate first delivery and shelf stocking
- Product pricing
- Eight visual store departments
- Backroom + shelf inventory
- Automatic restocking from backroom
- Daily customer trading simulation
- Customer chatter, lost sales, product trends and basket add-ons
- Three persistent AI rivals: Toy Barn, PlaySaver and Collector's Corner
- Daily P&L and end-of-day summary
- Normal supplier orders with two-day delivery lead time
- Inventory recommendations and filters
- Market and competitor screens
- Business / store-health screen
- Local save in browser storage

## Product identity update

- Removes the per-save **Edit Display Name** option from product details.
- Removes the per-save **Replace Local Artwork** and reset-artwork controls.
- Product names and supplied packaging artwork are now canonical game content.
- Existing legacy save data remains compatible; any old custom product-name overrides are ignored/removed when the save is loaded.
- Store naming remains unchanged: players can still name their toy store when starting a new game.

## Branding integration

- Adds the supplied **Toy Store Tycoon** logo to the launch/main-menu screen as a transparent PNG.
- Adds GitHub Pages/PWA app-icon support using the supplied square logo composition.
- Includes 192×192 and 512×512 web-app icons, a 180×180 Apple touch icon, a 32×32 favicon, and `manifest.webmanifest`.
- The launch-page logo uses a transparent background; the app icons preserve the supplied clean white square composition for reliable home-screen presentation.

## Product-art integration

Five complete product families now use supplied retail-package artwork instead of placeholders. All **33 product images** are stored as transparent PNGs and wired directly into the live catalogue.

### Raiders of the Galaxy — 6
- Draxon — Galactic Champion
- Skullfang — Tyrant of the Dead Moon
- Ironclaw — Beast of Vargos
- Nyra — Guardian of the Star Crystal
- Castle Astralon
- Ravager Battle Beast

### Cyber Warriors — 4
- Vanguard Prime — Commander of the Guardians
- Overlord X — Emperor of the Dominion
- Zipstrike — Street Scout
- Skyrazor — Dominion Air Commander

### Global Command — 5
- Major Valor — Field Commander
- Nightblade — Covert Operative
- Serpent King — Supreme Enemy Commander
- White Viper — Shadow Assassin
- Jackal Strike Buggy

### Metro Mutants — 6
- Blitz — Fearless Leader
- Riot — Street Brawler
- Gearbox — Tech Genius
- Jinx — Party Dude
- Underground Hideout
- Street Slammer

### Velocity Racers — 12
- Blaze GT
- Night Fang
- Turbo Wasp
- Road Titan
- Neon Phantom
- Inferno Van
- Aero Bullet
- Gravehowl X
- Blaze GT — Velocity Gold Edition
- Loop Strike
- Crash Canyon
- Velocity City Garage

The latest supplied evergreen Velocity City Garage package is used; the earlier holiday-decorated version is intentionally excluded.

The supplied artwork is preserved at its native 1024×1024 resolution. White studio backgrounds are removed while preserving the complete retail packaging and soft edge antialiasing.

## Art pipeline

The game uses **one packaging image per product** for the first-build art pass. Product art is displayed with `object-fit: contain`, so package proportions remain intact. Manufacturer names/logos and age markings are not required in the artwork; product metadata belongs to the game UI/data layer.

Remaining product families continue to use branded placeholders until their final packaging images are supplied.

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server.

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

Upload the contents of this folder to a GitHub repository and enable GitHub Pages from the repository root. No build step or backend is required.
