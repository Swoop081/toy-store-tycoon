# Toy Store Tycoon v0.4.0 — Store Operations + Customer Experience

**Current GitHub Pages baseline:** v0.4.0  
**Created:** 24 August 2026  
**Platform:** mobile-first HTML/CSS/JavaScript PWA for GitHub Pages

v0.4 builds directly on **v0.3 Living Market + Retail Strategy**. The living product market, lifecycle system, seasonal retail calendar, pre-orders, suppliers, merchandising, rivals, hype, pricing and original premium toy presentation remain intact. This update makes the **physical shop itself** a meaningful simulation.

## Major additions

### Staff and daily payroll
The first store now has four staff groups:

- **Cashiers** — increase checkout capacity and prevent completed baskets being abandoned in queues.
- **Floor Staff** — improve service coverage and reduce shrinkage.
- **Stockroom Crew** — refill shop-floor shelves from back-room inventory.
- **Store Managers** — improve staff efficiency, satisfaction and store-condition resilience.

Hiring has an upfront cost and every employee has a daily wage. Longer trading hours proportionally increase payroll.

### Opening hours
Choose an **8, 10 or 12 hour trading day**. Longer hours create more potential traffic, but also cost more in wages and wear the store faster.

### Real shop-floor stock
Inventory is no longer treated as if every unit is instantly available to customers.

Each owned product now tracks:

- total inventory
- units physically on the shelf
- stock remaining in the back room
- merchandising position

Front Window, Entrance Feature, Main Shelves and Back Corner still change visibility, but now also have different shelf capacities. Products can visibly sell out on the shop floor while additional stock remains in the back room. Stockroom staff replenish shelves between and during trading cycles according to available labour capacity.

### Customer archetypes
Daily traffic is now made up of six different shopper groups:

- **Parents** — value quality and sensible pricing.
- **Kids** — heavily influenced by hype and visual appeal.
- **Collectors** — tolerate premiums for scarce products.
- **Bargain Hunters** — strongly price sensitive.
- **Gift Buyers** — favour quality and larger baskets.
- **Impulse Shoppers** — especially responsive to presentation and store features.

Each group evaluates products differently instead of sharing one universal demand formula.

### Multi-item baskets
Customers can now buy more than one toy per visit. The daily results track:

- completed baskets
- items sold
- average basket value
- conversion rate

This makes cross-selling, displays, store quality and customer mix matter in addition to simple unit sales.

### Checkout queues and abandoned baskets
Completed baskets must make it through your checkout capacity. If customer demand overwhelms available cashiers/registers, shoppers abandon purchases and those items return to stock.

A **Second Checkout** can be installed as a permanent visible upgrade.

### Customer satisfaction
A persistent satisfaction score now responds to:

- queue losses
- floor-staff coverage
- store condition
- service upgrades
- store manager coverage
- gift wrapping
- stock availability

Satisfaction feeds back into store rating and market-share performance.

### Store condition and maintenance
The shop gradually wears down as it trades, especially during long opening hours. Poor condition eventually hurts customer experience and traffic.

A **$450 maintenance service** restores condition.

### Shoplifting / shrinkage
Busy trading days can lose inventory to shrinkage. Losses are recorded at inventory cost and reduce daily profit.

Shrinkage is reduced by:

- stronger floor-staff coverage
- **Security Cameras**

Lifetime shrinkage is retained in the save.

### Visible store facilities
New permanent facilities change both simulation behaviour and the actual in-game store scene:

- **Second Checkout** — more queue capacity
- **Premium Lighting** — stronger conversion / impulse appeal
- **Collector Cabinet** — better collector performance
- **Security Cameras** — substantially lower shrinkage
- **Gift-Wrapping Station** — paid gift wrap and better gift-buyer satisfaction
- **Toy Demo Zone** — stronger kid and impulse shopping
- **Expanded Shop Floor** — raises traffic ceiling and visually expands the store

Purchased facilities appear in the animated Store scene rather than existing only as numerical bonuses.

### Rival retaliation
Rivals continue to buy and sell real inventory from the shared supplier pool. They now also react more aggressively when your local market share grows. MegaToy can launch retaliation sales, Trend Zone can copy hot-category strategies, Collector's Cave protects scarce stock, and rumour activity becomes more aggressive under competitive pressure.

### Expanded end-of-day report
The trading-day results now include operations metrics alongside sales:

- sales
- net daily profit after payroll/shrinkage
- average basket
- conversion
- baskets served
- staff cost
- queue abandonment
- shrinkage
- launch deliveries
- market events
- satisfaction

## Existing v0.3 systems retained

- 48 products across 8 original fictional toy franchises
- premium self-contained physical toy packaging visuals
- animated living store world
- 84-day compressed retail calendar
- Christmas, November gifting, January clearance, Easter and school-holiday effects
- hidden product potential versus visible hype
- product lifecycle states
- surprise launch hits/flops
- pre-orders and launch-day deliveries
- weighted-average inventory cost accounting
- supplier relationships and allocations
- shelf merchandising positions
- franchise display upgrades
- real rival inventory and shared supplier stock depletion
- pricing, price wars and rumours
- persistent local saves and offline PWA support

## Save compatibility

v0.4 uses the save key:

`toyStoreTycoon.v0.4`

It automatically imports compatible local saves from:

- `toyStoreTycoon.v0.3`
- `toyStoreTycoon.v0.2`
- `toyStoreTycoon.v0.1`

New operations fields are added safely on migration, including staff, facilities, opening hours, shelf quantities, store condition and customer satisfaction.

## GitHub Pages deployment

1. Extract this ZIP.
2. Upload the **contents inside** `Toy-Store-Tycoon-v0.4-Store-Operations-Customer-Experience/` to the root of the existing GitHub repository.
3. Commit the replacement files to the branch used by GitHub Pages.
4. GitHub Pages will serve the updated build automatically.
5. On iPhone, reopen the Home Screen/PWA version. v0.4 uses a new service-worker cache name so the old v0.3 assets are removed during activation.

If Safari temporarily displays an old build, close the Home Screen app completely and reopen it once after GitHub Pages finishes deploying.

## Main files

- `index.html` — app shell
- `styles.css` — premium mobile UI + v0.4 operations visuals
- `game.js` — full market, rival, store-operations and customer simulation
- `manifest.json` — installable PWA metadata
- `sw.js` — offline/cache support
- `assets/icons/` — PWA icons

No external backend is required for this build. The simulation and saves remain local to the player's device/browser.
