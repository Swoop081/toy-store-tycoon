# Toy Store Tycoon v0.5.0 — Franchise Universe + Collector Economy

GitHub Pages-ready mobile-first build. This release supersedes v0.4.0 and preserves the complete Living Market + Store Operations simulation while making the fictional toy industry itself persistent, reactive and collectible.

## What is new in v0.5

### Living franchise universe
All 8 original toy franchises now persist as evolving brands with their own:
- Brand Health
- Fan Sentiment
- Collector Heat
- Nostalgia
- Generation
- Wave
- Current media property
- Event history

The eight franchises remain fully original: GearMorph, Luma Life, Starward Frontier, Pocket Beasts, Mythic Forge, Nitro Street, Little World and Ultra League.

### Franchise Hub
Every franchise now has a premium mobile detail view showing:
- Original franchise lore and tagline
- Current generation / wave
- Brand Health
- Fan Sentiment
- Collector Heat
- Nostalgia
- Current fictional movie/show/media property
- Current and legacy products
- Hottest product
- Franchise event timeline
- Owned collector pieces from that universe

### Fictional media events
Franchise demand can now be moved by fictional entertainment and fandom events such as:
- Breakout shows / media hits
- Bad reviews and fan backlash
- Anniversary celebrations
- Fan-favourite reveals
- Price/value backlash
- Full franchise reboots

Media events feed directly into product hype, fan sentiment, brand health and collector demand.

### Generations, waves, reissues and reboots
Products are now identified as part of a franchise generation / wave and can carry mainline, fan or collector-edition status.

Long saves no longer run out of toy releases. On later retail years the industry schedules fresh waves and legacy reissues. Weak or ageing franchises can also reboot into a new generation.

Discontinued products can therefore return years later as anniversary reissues, reboot launches or new waves.

### Nostalgia economy
Discontinued and clearance products can gain renewed demand as franchise nostalgia grows.

Collectors respond especially strongly to nostalgia, so forgotten sealed inventory can become commercially useful again instead of remaining permanently dead stock.

### Limited editions and exclusives
Scarce products can now display:
- Collector Limited / Fan Edition / Mainline designation
- Limited production-run size
- Supplier-exclusive status
- Fictional media tie-in

These attributes feed the collector fantasy and make scarce releases easier to identify visually.

### Shipment chase variants
Supplier cartons can now contain individually tracked special pieces:
- Colour Variant
- Metallic Variant
- Ultra-Rare Chase
- Prototype Colourway

The chance is influenced by product scarcity. Pre-order cartons have improved condition odds because they arrive factory-sealed at launch.

Special pulls are removed from ordinary shelf stock and automatically moved into the Collector Vault, so total owned capacity remains consistent.

### Product condition
Every special collector piece has its own box condition:
- Mint
- Near Mint
- Shelf Wear
- Damaged Box

Condition directly affects its secondary-market value.

### Collector Vault
A new Collector Vault tracks every special pull individually.

For each collectible you can:
- Hold it while the market evolves
- Display it in-store as a collector attraction
- Remove it from display
- Sell it immediately into the secondary market

One displayed piece can act as an in-store attraction and increases collector interest, especially for products from the same franchise.

### Dynamic secondary market
Collector-piece value changes with:
- Variant rarity
- Box condition
- Product RRP
- Product scarcity
- Current hype
- Franchise Collector Heat
- Franchise Nostalgia
- Time held

Holding a rare piece can pay off after a hit reboot or nostalgia surge, but values can also weaken if a franchise cools.

Collector sales add directly to cash, lifetime revenue and profit and are tracked separately in the Empire screen.

### Franchise-aware retail demand
Normal store sales now also react to:
- Brand Health
- Fan Sentiment
- Active media boosts
- Nostalgia on ageing/discontinued products
- Collector Vault display attraction

This sits on top of the existing price, hype, quality, scarcity, shelf placement, staff service and seasonal demand model.

### Premium presentation additions
- Franchise Pulse horizontal rail
- Franchise hero screens
- Brand-health meters
- Media cards
- Franchise history timeline
- Collector Vault cards
- Rarity badges
- Condition labels
- Live collector-market values
- Collector-economy summary on Store, Market, Products and Empire screens

## Systems retained from v0.4
- 48 products across 8 original fictional franchises.
- 84-day compressed retail year.
- Staff: Cashier, Floor Assistant, Stockroom and Store Manager.
- 8 / 10 / 12 hour opening schedules.
- Checkout queues and abandoned baskets.
- Shelf-facing stock separate from stockroom inventory.
- Six customer archetypes and multi-item baskets.
- Satisfaction, cleanliness and maintenance.
- Shoplifting / damaged-stock shrinkage.
- Visible permanent store improvements.
- Gift-wrap revenue.
- Rival retaliation and reactive pricing.
- Supplier relationships and allocation limits.
- Pre-orders and launch-day delivery.
- Hidden demand potential and surprise launch hits/flops.
- Shelf placement / merchandising bonuses.
- Persistent rival inventory and shared supplier stock.
- Weighted-average inventory cost basis.
- Full daily financial breakdown.
- Local autosave and offline PWA support.

## Save migration
v0.5 uses the save key `toyStoreTycoon.v0.5`.

Compatible v0.4, v0.3, v0.2 and v0.1 local saves are detected and migrated automatically. Existing staff, store operations, supplier relationships, product inventory, prices and market state are retained. The new franchise and collector systems are added around the existing business rather than resetting it.

## Deploy to GitHub Pages
1. Extract this ZIP.
2. Upload the **contents** of the `Toy-Store-Tycoon-v0.5-Franchise-Universe-Collector-Economy` folder to the root of your GitHub repository.
3. In GitHub, open **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Choose `main` and `/ (root)`.
6. Open the resulting GitHub Pages URL on iPhone Safari.
7. Use **Share → Add to Home Screen** for the standalone PWA experience.

The service-worker cache is versioned as `toy-store-tycoon-v0.5.0`, so replacing the previous GitHub Pages build invalidates the older v0.4 cache.

## Files
- `index.html` — app shell
- `styles.css` — premium mobile presentation, store-world and collector/franchise UI
- `game.js` — complete local simulation, operations, franchise and collector economy
- `manifest.json` — PWA configuration
- `sw.js` — offline/service-worker cache
- `assets/icons/` — Home Screen / PWA icons

## Runtime checks completed
- JavaScript syntax check passed.
- Service-worker syntax check passed.
- Manifest validation passed.
- Fresh v0.5 mobile boot passed with no runtime errors.
- Market → Franchise Hub navigation passed.
- Supplier ordering / chase-variant extraction passed.
- Collector Vault sale and valuation passed.
- Inventory-capacity accounting across collector pulls passed.
- Franchise event simulation passed.
- Retail-year rollover created 8 future waves/reissues successfully.
- End-of-day v0.5 simulation passed.
- v0.4 → v0.5 save migration passed while retaining store operations and staff.

No backend is required for this build. All gameplay and saves remain local to the browser/device.
