# Toy Store Tycoon v0.3.0 — Living Market + Retail Strategy

A premium, mobile-first toy-retail tycoon game designed for iPhone Safari/Home Screen and hosted entirely on GitHub Pages.

## What changed in v0.3

### Living product market
- Products now move through visible lifecycle states: **Rumour → Announced → Launch → Peak → Stable → Decline → Clearance → Discontinued**.
- Future product launches are spread across the retail calendar instead of all appearing in the opening week.
- Every product has a **hidden underlying demand potential** separate from the visible hype score.
- Launch reception can create genuine surprise hits and flops: reviews/word-of-mouth can sharply change hidden potential on launch.
- Hype now tends to move toward the hidden market reality over time rather than behaving as pure random noise.
- Product quality, scarcity, lifecycle, season, pricing, competitor price and merchandising all contribute to sales.

### Pre-orders and launch-day risk
- Products can be pre-ordered before launch.
- Pre-orders commit the **full cash cost immediately**, so capital is genuinely tied up before the player knows whether the toy will succeed.
- Pre-orders reserve stockroom capacity and supplier allocation.
- Committed inventory automatically arrives at the start of launch day.
- Quick order buttons support 10 / 25 / 50 / maximum-unit buying decisions.

### Real merchandising
- Inventory can be placed in **Front Window, Entrance Feature, Main Shelves or Back Corner**.
- Front Window capacity: 3 products; **+45% visibility**.
- Entrance Feature capacity: 4 products; **+25% visibility**.
- Main Shelves: normal visibility.
- Back Corner: **−32% visibility**.
- Shelf placement directly changes simulated sales.
- Product setup sheets now combine pricing and merchandising in one mobile-friendly screen.

### Supplier relationships
Four named supplier businesses now power the market:
- **PlayCo Distribution** — reliable mainstream wholesaler.
- **Collector Direct** — rare, limited and premium stock.
- **Budget Imports** — cheap stock and uneven availability.
- **NorthStar Toys** — premium launches and exclusives.

Supplier relationships now:
- improve as the player places orders,
- reduce wholesale buying prices,
- increase the player's maximum allocation on scarce products,
- track lifetime spend and order history.

### Proper inventory cost basis
- Every inventory position records its real weighted-average acquisition cost.
- Buying later at a cheaper supplier price does not retroactively change the profit on older stock.
- Pre-order deliveries preserve the price actually committed at pre-order time.
- Product margin and operating-profit calculations use actual inventory cost basis.

### Franchise displays
- Each of the 8 fictional franchises has a permanent branded store display upgrade.
- Building a display increases that franchise's sales visibility by **18%**.
- Displays are purchased from the Empire screen and remain part of the local save.

### Smarter rival stores
The four existing rivals now hold actual simulated inventory rather than acting only as price modifiers.
- Rivals buy units from the same supplier availability pool as the player.
- Rival purchases can exhaust stock before the player orders.
- Rivals sell their inventory each day and track last-day revenue.
- **MegaToy** buys heavily and starts price wars.
- **Collector's Cave** targets scarce products and charges collector premiums.
- **Trend Zone** aggressively chases the highest-hype stock.
- **Family Toy Co.** uses steadier mainstream pricing.
- Rival cards show their total units, biggest current inventory position and live strategy.
- Rival rumours can temporarily damage visible market buzz.

### Retail calendar and seasonality
- One compressed retail year is **84 trading days**: 7 days per month.
- The game begins in **July**, providing time to prepare for the Christmas rush.
- Seasonal demand modifiers include:
  - July school holidays,
  - October holiday build-up,
  - November gift season,
  - December Christmas rush,
  - January clearance slowdown,
  - April Easter trade.
- The current date and retail season now appear throughout the game.

### End-of-day presentation
Every trading day now ends with a premium summary showing:
- sales,
- operating profit/loss,
- customers,
- best seller,
- slowest seller,
- strongest market momentum,
- launch-day deliveries,
- major market events.

The completed day's figures remain visible instead of being cleared before the player can read them.

### Customer intelligence
- Customer conversations now label themselves as stronger demand signals, price signals, social signals, collector signals or unverified rumours.
- Chatter remains imperfect information rather than exposing the hidden demand calculation.

## Premium presentation retained from v0.2

- Animated living store floor with shelves, checkout, deliveries and shoppers.
- Physical original toy-packaging presentation rendered in HTML/CSS/JavaScript.
- 8 original fictional toy franchises and 48 products.
- Original toy silhouettes for robots, dolls, spacecraft, creatures, fantasy figures, cars, preschool toys and superheroes.
- Rival storefront scenes, product packaging, full-screen events and mobile motion/press feedback.
- Large iPhone touch targets, bottom navigation, safe-area handling and Home Screen/PWA mode.

## Save migration

v0.3 automatically imports compatible local saves from:
- v0.2
- v0.1

New v0.3 fields such as suppliers, shelf placements, rival inventory, product hidden potential and inventory cost basis are added during migration without intentionally wiping existing cash, stock, prices or progression.

## Publish on GitHub Pages

1. Create or open your GitHub repository, e.g. `toy-store-tycoon`.
2. Upload **the contents of this folder** to the repository root, replacing the older build files.
3. In GitHub: **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Open the Pages URL on iPhone and refresh after deployment.
7. Safari: **Share → Add to Home Screen** for standalone app-like mode.

The v0.3 service worker uses a new cache version and removes older cached builds during activation. If an already-installed Home Screen copy briefly shows the old UI after deployment, close and reopen it once.

## IP / artwork direction

All included brands, product names, package layouts, fictional toy designs and storefront presentation are original game content. The build does not include licensed commercial toy brands, copied characters, copied logos or third-party product artwork.

## Local-first architecture

The entire game currently runs in static HTML/CSS/JavaScript. No paid server is required. Save data remains in the browser on the player's device. Online features such as cloud saves or shared events can be added later through a lightweight backend without replacing the GitHub Pages frontend.

## Resetting during testing

Open **Empire → Reset Local Save**.
