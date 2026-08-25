# Toy Store Tycoon v0.1 — Retail Tycoon Foundation

A mobile-first, static GitHub Pages prototype for the fresh Toy Store Tycoon project.

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
- Per-save product display-name editor
- Per-save local artwork replacement using IndexedDB
- Draxon packaging mockup included as the first real product asset

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server.

Example:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

Upload the contents of this folder to a GitHub repository and enable GitHub Pages from the repository root. No build step or backend is required.

## Art pipeline

The game is currently designed around **one package image per product**. The recommended master canvas is 1600×1600 with the complete retail package visible and uncropped. Until a product receives final art, the game displays a branded placeholder package.

The supplied Draxon mockup is at `assets/draxon-package.jpeg`.
