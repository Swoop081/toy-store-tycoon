# Toy Store Tycoon v0.1.7 — Full Catalogue Product Art

A mobile-first, static GitHub Pages prototype for Toy Store Tycoon.

## v0.1.7 release

- Promotes v0.1.6 Cache-Busting into the new working build without changing gameplay or economy logic.
- Integrates the final **43 supplied canonical product images**, completing the art pass for the entire catalogue.
- All **76 product SKUs** now have a real product image; no catalogue product should fall back to a branded placeholder.
- Newly completed families: **Starlight Girls (8), BrickWorks (5), BlastForce (8), SquishLab (8), Cuddle Crew (6), Bright Table Games (6), Mystery Critters (2)**.
- Preserves the previously integrated 33 images for Raiders of the Galaxy, Cyber Warriors, Global Command, Metro Mutants and Velocity Racers.
- The newly supplied JPEG assets are copied into the build **without re-encoding or generative modification**.
- Correct canonical board-game brand name is **Bright Table Games**.

## Cache-busting

- Core static files are release-versioned as `styles.v0.1.7.css`, `data.v0.1.7.js`, and `app.v0.1.7.js`.
- Product artwork, branding, icons and manifest references receive a `?v=0.1.7` token at runtime.
- `manifest.webmanifest` starts the installed PWA at `./?v=0.1.7`.
- If an iPhone has an older GitHub Pages document cached, open the deployed site once with `?v=0.1.7`.

## Complete product-art coverage — 76 SKUs

- Raiders of the Galaxy — 6
- Cyber Warriors — 4
- Global Command — 5
- Metro Mutants — 6
- Velocity Racers — 12
- Starlight Girls — 8
- BrickWorks — 5
- BlastForce — 8
- SquishLab — 8
- Cuddle Crew — 6
- Bright Table Games — 6
- Mystery Critters — 2

## Gameplay retained from v0.1.6

- Main Menu / New Store / Continue
- Opening-order onboarding and recommended quantities
- Product pricing and eight store departments
- Shelf/backroom inventory and automatic restocking
- Daily trading simulation, customer chatter, lost sales, trends and basket add-ons
- Persistent AI rivals: Toy Barn, PlaySaver and Collector's Corner
- Daily P&L and end-of-day summary
- Supplier orders with two-day lead time
- Inventory recommendations and filters
- Market, competitor and Business/store-health screens
- Local browser saves
- Canonical product names and art; no per-save product renaming or local-art replacement

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

Upload the contents of this folder to a GitHub repository and enable GitHub Pages from the repository root. No build step or backend is required.
