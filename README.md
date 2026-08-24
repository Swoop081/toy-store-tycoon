# Toy Store Tycoon v0.7.0 — Multi-Store Expansion + Regional Management

**Current GitHub Pages baseline**

v0.7 turns the single successful toy shop into a growing regional chain while preserving the full v0.6 Retail War, v0.5 franchise/collector economy, v0.4 store operations and the premium large-text mobile presentation.

## What is new

### Multiple persistent store locations
The player can now operate up to five distinct locations:

1. **Town Centre — Independent High Street**
   - Existing starting shop.
   - Balanced demand and heavy price competition.
   - Daily rent: **$320**.

2. **Family Suburbs — Suburban Family Store**
   - Fit-out: **$18,000** + **$4,000 bond**.
   - Daily rent: **$390**.
   - Strong Luma Life, Pocket Beasts and Little World demand.

3. **Collector District — Collector Boutique**
   - Fit-out: **$24,000** + **$6,000 bond**.
   - Daily rent: **$440**.
   - Lower traffic but much stronger premium/collector demand.

4. **Shopping Centre — High-Traffic Mall Store**
   - Fit-out: **$42,000** + **$10,000 bond**.
   - Daily rent: **$790**.
   - Huge traffic, expensive occupancy and strong big-brand launch performance.

5. **Retail Park — Large Format Toy Store**
   - Fit-out: **$60,000** + **$12,000 bond**.
   - Daily rent: **$980**.
   - Destination shopping with strong large-range, vehicle and playset demand.

Each branch independently owns its:
- inventory and shelf quantities;
- prices and merchandising positions;
- staff roster;
- opening hours and store operations;
- upgrades and franchise displays;
- pre-orders;
- rating and reputation;
- daily sales, customers and operating profit;
- lifetime revenue and profit.

Cash, suppliers, franchise health, Collector Vault, Retail War, market hype and corporate loyalty remain company-wide.

## Active Store switching
A new large mobile location selector appears on **Store**, **Market** and **Products**.

Switching branch changes the actual game context. Supplier orders and pre-orders go to the currently selected branch, and its own staff/inventory/operations are loaded into the normal game screens.

The top date display also shows the active-location icon.

## Local demand differences
Locations are not cosmetic skins. Their customer mix changes product demand.

Examples:
- **Family Suburbs** strongly favours preschool, fashion-doll and collectible-creature ranges.
- **Collector District** favours scarce GearMorph, Starward Frontier, Mythic Forge, Pocket Beasts and Ultra League stock.
- **Shopping Centre** rewards mainstream hot launches and impulse-friendly ranges.
- **Retail Park** performs well with die-cast, large playsets and broad destination ranges.

Territory share from v0.6 also feeds into local branch traffic.

## Branch managers
Every branch can have a dedicated manager. Candidate managers have skill, salary and a persistent management trait:

- **Sales Driver** — more branch traffic.
- **Merchandising Ace** — stronger product conversion.
- **Cost Cutter** — lower operating/rent costs.
- **Collector Specialist** — stronger scarce-toy demand.
- **Inventory Hawk** — faster automatic shelf replenishment.
- **Community Hero** — stronger service/satisfaction.

Manager autonomy can be set to:
- **Low** — player remains hands-on; weaker passive efficiency.
- **Medium** — manager handles routine staffing/restocking/pricing.
- **High** — manager actively reacts to local demand and prices.

Branches without a manager continue trading when inactive, but at materially lower efficiency.

Manager salary is charged as a real operating cost.

## Passive branch simulation
Only one store is directly displayed at a time, but every other open branch continues trading when a day advances.

Inactive locations simulate:
- customer traffic;
- local product preferences;
- live market hype;
- price sensitivity;
- shelf replenishment;
- transactions and basket size;
- wages;
- manager salary;
- rent and maintenance;
- stockouts;
- satisfaction;
- rating changes;
- branch profit/loss.

A high-autonomy manager can also make routine price adjustments around hype and clearance status.

## Regional stock transfers
The Empire screen can send stock from any store to any other open location.

- Transfer cost: **$35 + $1.50 per unit**.
- Inventory leaves the sending store immediately.
- Delivery arrives the next trading day.
- Original weighted-average acquisition cost is preserved.
- Incoming stock arrives into the destination branch for local sale.
- Transfers are shown in a regional logistics queue.

This allows the player to rescue a selling-out branch using stock that is stagnating elsewhere.

## Regional Empire dashboard
The Empire screen is now a real chain-management hub with:
- number of locations;
- stock across the whole chain;
- chain inventory/collector value;
- expansion spend;
- lifetime chain sales and operating profit;
- one large card per store;
- branch last-day sales/profit/rating/stock;
- manager status and autonomy;
- Manage Store / Manager / Move Stock actions;
- transfer queue;
- expansion opportunities.

The previous Supplier Relationships, Franchise Portfolio, Collector Vault, Store Operations, branded displays, business upgrades and Toy Club systems remain available below the regional layer.

## Chain day summary
End-of-day results now add a regional summary showing:
- chain sales;
- chain operating profit;
- number of trading stores;
- total chain visitors;
- stock-transfer arrivals;
- launch stock delivered to inactive branches.

The active branch also now pays its own rent as part of daily operating profit.

## Readability
The large-text mobile rules from v0.5.3/v0.6 remain locked. Multi-store cards, manager decisions, expansion costs, location selectors and transfer screens all use the larger mobile type scale rather than dense desktop-style tables.

## Save migration
Save key: `toyStoreTycoon.v0.7`

The build automatically migrates the current single-store business from:
- v0.6
- v0.5.3
- v0.5.2
- v0.5.1
- v0.5
- v0.4
- v0.3
- v0.2
- v0.1

The existing shop becomes **Town Centre / S001** with its inventory, staff, operations, prices, upgrades, displays, customer state and history preserved. New chain data is layered on top.

## GitHub Pages deployment
1. Extract the ZIP.
2. Upload the **contents** of `Toy-Store-Tycoon-v0.7-Multi-Store-Regional-Management/` to the root of the GitHub repository.
3. In GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.
4. Open the Pages URL on iPhone Safari.
5. Use **Share → Add to Home Screen** for the standalone PWA experience.

The service-worker cache is versioned as `toy-store-tycoon-v0.7.0`, so the v0.6 cached build will be replaced after deployment/reload.

## Validation performed
- JavaScript syntax checks for `game.js`, `v06.js`, `v07.js` and `sw.js`.
- Fresh mobile boot into a one-store v0.7 chain.
- Empire regional dashboard render.
- Opened Family Suburbs from starting cash.
- Hired a persistent branch manager.
- Transferred five GearMorph units Town Centre → Family Suburbs.
- Advanced the trading day and confirmed transfer arrival.
- Confirmed inactive branch simulation and combined chain P&L.
- Switched active store and confirmed its separate stock/staff context.
- Confirmed supplier purchase goes only to the selected branch.
- Simulated a five-location chain for 30 consecutive days without runtime exceptions.
- Tested conversion of a v0.6-style single-store state into the v0.7 chain structure while preserving cash, stock and staff.
- Validated all service-worker asset paths and ZIP integrity.

## Main files
- `index.html`
- `styles.css`
- `game.js`
- `v06.js`
- `v07.js`
- `manifest.json`
- `sw.js`
- `assets/`

No backend is required. The game remains a static GitHub Pages-compatible PWA with local persistent saves.
