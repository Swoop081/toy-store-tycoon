# Toy Store Tycoon v0.1.2 — Four-Line Product Art Pass

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

## Product-art integration

The first four complete product families now use supplied retail-package artwork instead of placeholders. All 21 images are stored as transparent PNGs and wired directly into the live catalogue:

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

The source images were supplied at 1024×1024. Their native resolution is preserved; the white studio background has been removed while retaining the complete packaging and soft edge antialiasing.

## Art pipeline

The game uses **one packaging image per product** for the first-build art pass. Product art is displayed with `object-fit: contain`, so package proportions remain intact. Manufacturer names/logos and age markings are not required in the artwork; product metadata belongs to the game UI/data layer.

Remaining products continue to use branded placeholders until their final package images are supplied.

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server.

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

Upload the contents of this folder to a GitHub repository and enable GitHub Pages from the repository root. No build step or backend is required.
