# Toy Store Tycoon v0.5.1 — Premium Toy Identity Overhaul

GitHub Pages-ready mobile-first build. This release supersedes v0.5.0 and keeps the complete Franchise Universe + Collector Economy / Store Operations / Living Market simulation while substantially rebuilding how the toys themselves look inside the game.

## What changed in v0.5.1

### Toys now read as actual physical toys
The old generic/placeholder-style product presentation has been replaced with a richer self-contained toy rendering system. Products now appear inside clear retail packaging with illustrated toy forms rather than relying on a single generic symbol per franchise.

The 48 current products can visually resolve into different toy constructions, including:
- Transforming mechs, wheeled mech-haulers, winged mechs and dual packs.
- Fashion dolls, twin doll sets, roadsters, dreamhouses, wardrobes and beach playsets.
- Starfighters, cruisers, speeders, space outposts and action figures.
- Creature figures, mystery eggs, multipacks and battle arenas.
- Fantasy warriors, twin packs, wyverns, castles and siege toys.
- Die-cast cars, multipacks, loop tracks, haulers and garages.
- Preschool buses, farms, construction toys, plush bears, kitchens and pretend markets.
- Superhero figures, hero multipacks, bikes and headquarters playsets.

Product colour palettes also vary within each franchise, so two products from the same brand no longer look like identical recoloured cards.

### Eight distinct packaging identities
Every fictional franchise now has its own retail packaging architecture rather than sharing one box template.

- **GearMorph** — angular mechanical boxes, cyan window edging, transformation callouts and MECH // SHIFT styling.
- **Luma Life** — glossy rounded doll boxes, lifestyle styling and bright fashion palettes.
- **Starward Frontier** — dark premium sci-fi boxes, luminous window treatment and fleet-series presentation.
- **Pocket Beasts** — playful rounded creature packs, bright collection messaging and egg/arena-friendly presentation.
- **Mythic Forge** — darker fantasy packaging with metallic/stone-like framing and collector-fantasy typography.
- **Nitro Street** — racing/blister-card inspired packaging with speed stripes and die-cast presentation.
- **Little World** — soft rounded preschool boxes with light friendly colours and simple age-led presentation.
- **Ultra League** — bold angular superhero packaging with high-contrast power-series branding.

### Proper front-of-box details
Packaging now includes franchise-specific logos, product name, generation/wave, collector/mainline designation, age badge, product numbering, limited-edition ribbons and product-specific feature callouts such as:
- `TRANSFORMS • 12 STEPS`
- `VEHICLE ⇄ MECH`
- `FASHION ROADSTER`
- `GALACTIC PLAYSET`
- `MYSTERY CREATURE INSIDE`
- `FORTRESS PLAYSET`
- `DIE-CAST SPEED SERIES`
- `PLAY • LEARN • IMAGINE`
- `POWER SERIES`

### Better packaging scale throughout the game
The new physical packs are integrated into:
- Supplier / Market product cards.
- Product detail and ordering sheets.
- Store shelves.
- Trend Alert hero cards.
- Product inventory.
- Franchise Hub product rails.
- Collector Vault cards.
- Store displays and other compact product placements.

Close-up product sheets use a much larger, cleaner package render while shelf/vault uses retain readable compact variants.

### Self-contained GitHub Pages presentation
No external image CDN, paid art service or generated image dependency is required for this pass. The toy illustrations and packaging are produced by the app itself using HTML/CSS and inline SVG-style vector shapes, so the build stays portable, offline-capable and GitHub Pages friendly.

### One-time visual-remaster splash
Existing saves receive a one-time in-game notice explaining that the toy aisle has been remastered. Gameplay progress is not reset.

## Gameplay retained from v0.5.0
- 48 products across 8 original franchises.
- Franchise Brand Health, Fan Sentiment, Collector Heat and Nostalgia.
- Fictional media hits/flops, fan backlash, anniversaries and reboots.
- Generations, waves, reissues and long-term release scheduling.
- Mainline / Fan / Collector editions, limited runs and supplier exclusives.
- Individually tracked Colour Variant, Metallic Variant, Ultra-Rare Chase and Prototype Colourway pulls.
- Mint / Near Mint / Shelf Wear / Damaged Box collector condition.
- Collector Vault, in-store display and dynamic secondary-market values.
- 84-day compressed retail year and seasonal demand.
- Product lifecycle and hidden demand potential.
- Pre-orders and launch-day delivery.
- Shelf merchandising / stockroom separation.
- Four suppliers with relationship pricing and allocation effects.
- Persistent rival stock, buying, selling, price wars and rumours.
- Staff, checkout capacity, queues, abandoned baskets and six customer archetypes.
- Satisfaction, cleanliness, maintenance, shrinkage and permanent shop upgrades.
- Weighted-average inventory cost basis and full end-of-day finances.
- Local autosave and offline PWA support.

## Save migration
v0.5.1 uses the save key `toyStoreTycoon.v0.5.1`.

Compatible v0.5, v0.4, v0.3, v0.2 and v0.1 saves are detected and migrated automatically. Existing business state, inventory, pricing, staff, rivals, suppliers, franchise history and Collector Vault pieces are retained.

## Deploy to GitHub Pages
1. Extract this ZIP.
2. Upload the **contents** of the `Toy-Store-Tycoon-v0.5.1-Premium-Toy-Identity-Overhaul` folder to the root of the GitHub repository.
3. In GitHub open **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Choose `main` and `/ (root)`.
6. Open the Pages URL on iPhone Safari.
7. Use **Share → Add to Home Screen** for the standalone PWA experience.

The service-worker cache is versioned as `toy-store-tycoon-v0.5.1`, so the previous v0.5 cache is replaced after deployment.

## Files
- `index.html` — app shell.
- `styles.css` — premium mobile UI plus the new franchise packaging architectures.
- `game.js` — complete simulation plus product-specific toy/vector rendering.
- `manifest.json` — PWA configuration.
- `sw.js` — offline/service-worker cache.
- `assets/icons/` — Home Screen / PWA icons.

## Validation completed
- JavaScript syntax check passed.
- Service-worker syntax check passed.
- Manifest JSON validation passed.
- v0.5.1 save key / v0.5 migration path confirmed in source.
- All 48 products remain present across all 8 franchises.
- Product renderer includes distinct category/product branches for vehicles, figures, creatures, playsets, buildings, multipacks and accessories.
- Package renderer is used consistently by Market, ordering sheets, Store, Products, Franchise Hub and Collector Vault.

No backend is required. All gameplay and saves remain local to the browser/device.
