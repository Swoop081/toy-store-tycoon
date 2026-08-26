# Toy Store Tycoon v0.1.12 — Sunnyvale Helpers Launch Range

Built from the verified v0.1.11 Store Shelf Art + Status Hotfix baseline.

## v0.1.12 additions

- Adds the complete **Sunnyvale Helpers** preschool brand as a new PlayBurst Toys franchise.
- Adds **8 new catalogue SKUs**, taking the live catalogue from 76 to **84 products**:
  - Leo & Fire Engine
  - Mia & Ambulance
  - Harper & Tow Truck
  - Noah & Rescue Helicopter
  - Sunnyvale Adventure Bus
  - Community Helpers 4-Pack
  - Sunnyvale Rescue Station
  - Sunnyvale Town Centre
- Adds a ninth store department: **Preschool & Learning — Sunnyvale Helpers**, with its own 24-space display bay.
- Adds preschool demand affinity for Parent and Child + Parent customer types so the new line participates naturally in the simulation.
- Adds launch-range wholesale/RRP, demand, shelf-space and opening-order recommendations across entry vehicles, multipacks and premium playsets.

## Product art

- Integrates all 8 user-supplied Sunnyvale Helpers images as canonical game assets.
- Each source image has been converted from studio-white JPEG to **1024×1024 RGBA PNG with real transparency** around the complete retail package silhouette.
- Product artwork itself is preserved; only the external studio background/shadow field is removed.
- Existing canonical product assets are carried forward unchanged.

## Cache busting

- Core static files: `styles.v0.1.12.css`, `data.v0.1.12.js`, `app.v0.1.12.js`.
- Runtime product art, branding and icon URLs use `?v=0.1.12`.
- PWA start URL uses `./?v=0.1.12`.

## Packaging note

This build **does include `assets/`** because it introduces new image assets compared with v0.1.11, in accordance with the Toy Store Tycoon packaging rule.
