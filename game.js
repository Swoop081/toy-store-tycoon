const VERSION = '0.4.0';
const SAVE_KEY = 'toyStoreTycoon.v0.4';
const LEGACY_SAVE_KEYS = ['toyStoreTycoon.v0.3','toyStoreTycoon.v0.2','toyStoreTycoon.v0.1'];

const brands = {
  gearmorph:{name:'GearMorph',glyph:'🤖',grad:'linear-gradient(145deg,#12c2e9,#7b4dff 52%,#ff4f87)',category:'Transforming Mechs'},
  lumalife:{name:'Luma Life',glyph:'👗',grad:'linear-gradient(145deg,#ff75b5,#ffb45f 55%,#ffe66d)',category:'Fashion & Lifestyle'},
  starward:{name:'Starward Frontier',glyph:'🚀',grad:'linear-gradient(145deg,#162b6f,#4a6fff 55%,#5de7ff)',category:'Space Adventure'},
  pocketbeasts:{name:'Pocket Beasts',glyph:'🐲',grad:'linear-gradient(145deg,#53d88b,#30c9ba 50%,#ffe454)',category:'Collectible Creatures'},
  mythicforge:{name:'Mythic Forge',glyph:'⚔️',grad:'linear-gradient(145deg,#56338e,#9a51da 52%,#ff826d)',category:'Fantasy Action'},
  nitrostreet:{name:'Nitro Street',glyph:'🏎️',grad:'linear-gradient(145deg,#ff3b30,#ff8c00 52%,#ffd60a)',category:'Die-cast & Racing'},
  littleworld:{name:'Little World',glyph:'🧸',grad:'linear-gradient(145deg,#54c7ec,#68e0cf 55%,#ffda79)',category:'Preschool Play'},
  ultraleague:{name:'Ultra League',glyph:'🦸',grad:'linear-gradient(145deg,#e52d27,#b31217 52%,#5b2cff)',category:'Super Heroes'}
};

const productSeeds = {
  gearmorph:[
    ['Inferno Prime',32,59.99,82],['Storm Talon',24,44.99,68],['Titan Hauler',46,89.99,61],['Volt Saber',16,29.99,76],['Shadow Convoy',38,69.99,73],['Neon Scout Duo',14,27.99,58]
  ],
  lumalife:[
    ['City Lights Luma',19,39.99,72],['Dreamhouse Studio',58,119.99,66],['Weekend Roadster',28,59.99,64],['Starlight Wardrobe',13,29.99,55],['Luma & Luna Twin Set',25,54.99,78],['Beach Club Playset',33,69.99,60]
  ],
  starward:[
    ['Eclipse Fighter',29,59.99,70],['Titan Cruiser',64,119.99,84],['Nova Ranger Figure',12,24.99,63],['Void Captain Deluxe',20,44.99,74],['Outpost Seven Playset',49,99.99,57],['Solar Speeder',22,49.99,68]
  ],
  pocketbeasts:[
    ['Emberling Starter',8,19.99,88],['Moonhorn Figure',10,24.99,77],['Mystery Nest Egg',6,14.99,92],['Crystal Drake Deluxe',23,49.99,81],['Forest Friends 5-Pack',15,34.99,69],['Battle Burrow Arena',36,79.99,72]
  ],
  mythicforge:[
    ['Dragon King Varr',21,44.99,65],['Castle Blackspire',62,129.99,54],['Wolf Knight Kael',17,34.99,71],['Frost Wyvern',27,59.99,75],['Siege Ram',24,49.99,52],['Runeblade Twin Pack',15,32.99,67]
  ],
  nitrostreet:[
    ['Hyper GT Twin Pack',7,16.99,79],['Mega Loop Track',31,69.99,70],['Street Kings 10-Pack',19,39.99,61],['Turbo Hauler',24,54.99,59],['Night Racer Limited',11,27.99,83],['Drift City Garage',38,84.99,62]
  ],
  littleworld:[
    ['Happy Town Bus',16,34.99,62],['Busy Builder Yard',29,64.99,58],['Animal Friends Farm',26,59.99,73],['Bedtime Bear',12,29.99,68],['Rainbow Kitchen',34,74.99,55],['My First Market',31,69.99,64]
  ],
  ultraleague:[
    ['Solar Sentinel',17,39.99,75],['Titan Woman Deluxe',21,49.99,69],['Shadow Spark Bike',25,59.99,66],['Ultra HQ Tower',69,139.99,53],['Velocity Kid',14,32.99,81],['Villains United 3-Pack',23,52.99,70]
  ]
};

const products = [];
let pid = 1;
Object.entries(productSeeds).forEach(([brand,rows])=>rows.forEach((r,i)=>{
  products.push({
    id:'P'+String(pid++).padStart(3,'0'), brand, name:r[0], wholesale:r[1], rrp:r[2], baseDemand:r[3],
    supplierStock: 30 + ((i*17 + pid*13) % 95), launchDay: i===0 ? 1 : ([6,13,21,30,42][i-1] + (Object.keys(brands).indexOf(brand)%4)),
    quality: 55 + ((pid*11)%40), scarcity: 35 + ((pid*7)%55)
  });
}));

const rivalTemplates = [
  {id:'mega',name:'MegaToy',logo:'🏬',strategy:'Aggressive discounter',aggression:88,pricing:.88,buyPower:95,rumor:35,rep:4.0,grad:'linear-gradient(145deg,#1261ff,#12c2e9)'},
  {id:'collector',name:"Collector's Cave",logo:'💎',strategy:'Rare & limited specialist',aggression:58,pricing:1.18,buyPower:52,rumor:15,rep:4.6,grad:'linear-gradient(145deg,#3b1b63,#a044ff)'},
  {id:'family',name:'Family Toy Co.',logo:'🎈',strategy:'Trusted family retailer',aggression:42,pricing:.98,buyPower:64,rumor:5,rep:4.8,grad:'linear-gradient(145deg,#ff7a18,#ffd200)'},
  {id:'trend',name:'Trend Zone',logo:'⚡',strategy:'Chases every craze',aggression:76,pricing:1.04,buyPower:73,rumor:25,rep:4.1,grad:'linear-gradient(145deg,#ff416c,#ff4b2b)'}
];

const upgrades = [
  {id:'stockroom',name:'Bigger Stockroom',icon:'📦',desc:'+80 inventory capacity',cost:4500,max:3},
  {id:'marketing',name:'Local Marketing',icon:'📣',desc:'+6% customer traffic per level',cost:3200,max:3},
  {id:'service',name:'Customer Service',icon:'😊',desc:'Improves rating resilience',cost:2800,max:3},
  {id:'analytics',name:'Trend Scanner',icon:'📈',desc:'More accurate market signals',cost:5200,max:2}
];


const supplierTemplates = {
  playco:{id:'playco',name:'PlayCo Distribution',icon:'🚚',desc:'Reliable mainstream wholesaler',baseRel:58,brands:['gearmorph','lumalife','nitrostreet','littleworld']},
  collectorDirect:{id:'collectorDirect',name:'Collector Direct',icon:'💎',desc:'Rare, limited and premium allocations',baseRel:44,brands:['pocketbeasts','mythicforge','ultraleague']},
  budget:{id:'budget',name:'Budget Imports',icon:'📦',desc:'Cheap stock, uneven availability',baseRel:50,brands:['nitrostreet','littleworld','lumalife']},
  northstar:{id:'northstar',name:'NorthStar Toys',icon:'⭐',desc:'Premium launches and exclusives',baseRel:48,brands:['starward','gearmorph','pocketbeasts','ultraleague']}
};
const supplierByBrand={gearmorph:'playco',lumalife:'playco',starward:'northstar',pocketbeasts:'collectorDirect',mythicforge:'collectorDirect',nitrostreet:'budget',littleworld:'budget',ultraleague:'northstar'};
const shelfPlacements={window:{name:'Front Window',icon:'✨',factor:1.45,capacity:3},feature:{name:'Entrance Feature',icon:'🎯',factor:1.25,capacity:4},main:{name:'Main Shelves',icon:'🛍️',factor:1.0,capacity:999},back:{name:'Back Corner',icon:'📦',factor:.68,capacity:999}};
const displayDefs={
  gearmorph:{name:'GearMorph Power Wall',cost:3600},lumalife:{name:'Luma Life Style Stage',cost:3400},starward:{name:'Starward Launch Bay',cost:4200},pocketbeasts:{name:'Pocket Beasts Collector Wall',cost:3900},
  mythicforge:{name:'Mythic Forge Castle Endcap',cost:3700},nitrostreet:{name:'Nitro Street Race Tower',cost:3200},littleworld:{name:'Little World Play Zone',cost:3000},ultraleague:{name:'Ultra League Hero Stand',cost:3800}
};
const retailMonths=['July','August','September','October','November','December','January','February','March','April','May','June'];

const staffDefs={
  cashier:{name:'Cashiers',icon:'🧾',wage:145,hire:350,desc:'Serve checkout queues. More cashiers prevent abandoned baskets.'},
  floor:{name:'Floor Staff',icon:'😊',wage:135,hire:300,desc:'Help shoppers, improve conversion and reduce shoplifting.'},
  stock:{name:'Stockroom Crew',icon:'📦',wage:140,hire:325,desc:'Keep shelves full during busy trading days.'},
  manager:{name:'Store Manager',icon:'📋',wage:230,hire:900,desc:'Boosts staff efficiency, satisfaction and store condition.'}
};
const customerTypes={
  parent:{name:'Parents',icon:'👨‍👩‍👧',weight:30,price:.92,scarcity:.9,quality:1.18,basket:1.45},
  kid:{name:'Kids',icon:'🧒',weight:22,price:.82,scarcity:1.0,quality:.95,basket:1.15},
  collector:{name:'Collectors',icon:'💎',weight:14,price:1.25,scarcity:1.55,quality:1.08,basket:1.2},
  bargain:{name:'Bargain Hunters',icon:'🏷️',weight:16,price:.62,scarcity:.75,quality:.9,basket:1.35},
  gift:{name:'Gift Buyers',icon:'🎁',weight:12,price:.98,scarcity:1.0,quality:1.2,basket:1.7},
  impulse:{name:'Impulse Shoppers',icon:'✨',weight:6,price:.9,scarcity:1.0,quality:.85,basket:2.0}
};
const facilityDefs={
  checkout2:{name:'Second Checkout',icon:'🧾',cost:4200,desc:'Adds another register and raises queue capacity.'},
  lighting:{name:'Premium Lighting',icon:'💡',cost:3100,desc:'Makes displays pop and improves shopper conversion.'},
  collector:{name:'Collector Cabinet',icon:'💎',cost:4800,desc:'Boosts collector purchases and scarce-product appeal.'},
  security:{name:'Security Cameras',icon:'📹',cost:3600,desc:'Cuts shoplifting losses significantly.'},
  giftwrap:{name:'Gift-Wrapping Station',icon:'🎁',cost:2900,desc:'Adds paid gift wrap and lifts gift-buyer satisfaction.'},
  demozone:{name:'Toy Demo Zone',icon:'🎮',cost:5200,desc:'Kids linger longer and impulse purchases increase.'},
  biggerfloor:{name:'Expanded Shop Floor',icon:'🏬',cost:8500,desc:'Raises traffic ceiling and gives the store a flagship feel.'}
};

function freshState(){
  const inventory={};
  const starting=['P001','P007','P013','P019','P025','P031','P037','P043'];
  starting.forEach((id,idx)=>{
    const p=getProduct(id); inventory[id]={qty:8 + (idx%4)*2, price:p.rrp, soldToday:0,totalSold:0,lastProfit:0};
  });
  const market={};
  products.forEach((p,idx)=> market[p.id]={hype:clamp(p.baseDemand + ((idx*13)%19)-9,20,96),trend:((idx%5)-2),buzz:'steady'});
  const rivals={};
  rivalTemplates.forEach((r,ri)=>{
    const prices={};
    products.forEach((p,idx)=> prices[p.id]=roundMoney(p.rrp*(r.pricing + ((((idx+ri*2)%9)-4)/100))));
    rivals[r.id]={cash:70000+ri*18000,rep:r.rep,share:17+ri*2,prices,activity:'Watching the market.'};
  });
  return {
    version:VERSION, day:1,cash:25000,todaySales:0,todayProfit:0,rating:4.2,reputation:55,
    customersToday:0,totalRevenue:0,totalProfit:0,inventory,market,rivals,
    supplierStock:Object.fromEntries(products.map(p=>[p.id,p.supplierStock])),
    upgrades:{stockroom:0,marketing:0,service:0,analytics:0},
    marketShare:18, lastEvent:'Grand Opening', eventLog:['Day 1: Your independent toy shop opened.'],
    chatter:[], sound:true, tab:'store', tutorialShown:false, orderCount:0
  };
}

let state = loadState();
// v0.4 bootstrap defaults must exist before the first render, including when
// a v0.3 save is loaded before the deeper migration layer executes below.
state.staff=state.staff||{cashier:1,floor:1,stock:1,manager:0};
state.facilities=state.facilities||{};
state.openHours=state.openHours||8;
state.storeCondition=Number.isFinite(state.storeCondition)?state.storeCondition:92;
state.satisfaction=Number.isFinite(state.satisfaction)?state.satisfaction:78;
state.shrinkageTotal=state.shrinkageTotal||0;
state.giftWrapRevenue=state.giftWrapRevenue||0;
state.lastOps=state.lastOps||{queueLost:0,shrinkage:0,wages:0,avgBasket:0,conversion:0,stockouts:0,persona:{},served:0,items:0,giftWrap:0};
Object.entries(state.inventory||{}).forEach(([id,inv])=>{ if(!Number.isFinite(inv.shelfQty)) inv.shelfQty=Math.min(inv.qty,7); });
let currentFilter='all';
let sheetQty=1;

const screen=document.getElementById('screen');
const sheet=document.getElementById('sheet');
const sheetContent=document.getElementById('sheetContent');
const sheetBackdrop=document.getElementById('sheetBackdrop');
const toastEl=document.getElementById('toast');
const splash=document.getElementById('eventSplash');

function getProduct(id){ return products.find(p=>p.id===id); }
function getBrand(id){ return brands[id]; }
function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function roundMoney(n){ return Math.round(n*100)/100; }
function money(n){ return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:n<100?2:0}).format(n); }
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function weightedChance(pct){ return Math.random()*100<pct; }
function saveState(){ try{ localStorage.setItem(SAVE_KEY,JSON.stringify(state)); }catch(e){} updateStats(); }
function loadState(){
  try{
    const keys=[SAVE_KEY,...LEGACY_SAVE_KEYS];
    for(const key of keys){
      const raw=localStorage.getItem(key);
      if(!raw) continue;
      const s=JSON.parse(raw);
      if(s && s.inventory && s.market && s.rivals){
        s.version=VERSION;
        s.tab=s.tab||'store';
        s.sound=s.sound!==false;
        localStorage.setItem(SAVE_KEY,JSON.stringify(s));
        return s;
      }
    }
  }catch(e){}
  return freshState();
}
function resetGame(){ if(confirm('Start a brand new toy empire? This clears the current local save.')){ state=freshState(); saveState(); render(); toast('New game started'); } }

function inventoryUsed(){ return Object.values(state.inventory).reduce((a,x)=>a+x.qty,0); }
function inventoryCapacity(){ return 180 + state.upgrades.stockroom*80; }
function inventoryValue(){ return Object.entries(state.inventory).reduce((a,[id,x])=>a+x.qty*getProduct(id).wholesale,0); }
function hypeLabel(v){ return v>=85?'VIRAL':v>=72?'HOT':v>=58?'RISING':v>=42?'STEADY':'COOL'; }
function heat(v){ return v>=85?'🔥🔥🔥':v>=70?'🔥🔥':v>=56?'🔥':'•'; }
function brandStyle(p){ return `--brand-grad:${getBrand(p.brand).grad}`; }

function updateStats(){
  document.getElementById('cashStat').textContent=money(state.cash);
  document.getElementById('salesStat').textContent=money(state.todaySales);
  document.getElementById('ratingStat').textContent=state.rating.toFixed(1)+' ★';
  document.getElementById('dayStat').textContent=state.day;
  document.getElementById('soundBtn').textContent=state.sound?'🔊':'🔇';
}

function productNumber(p){ return Number(p.id.slice(1)); }
function seriesLabel(p){ return `WAVE ${1 + (productNumber(p)%4)}`; }
function brandWord(p){ return getBrand(p.brand).name.toUpperCase(); }

function toyModel(p){
  const n=productNumber(p)%6;
  if(p.brand==='gearmorph') return `<div class="toy-model robot variant-${n}"><i class="robot-head"></i><i class="robot-body"></i><i class="robot-arm left"></i><i class="robot-arm right"></i><i class="robot-leg left"></i><i class="robot-leg right"></i><b class="robot-core"></b></div>`;
  if(p.brand==='lumalife') return `<div class="toy-model doll variant-${n}"><i class="doll-head"></i><i class="doll-hair"></i><i class="doll-body"></i><i class="doll-skirt"></i><i class="doll-leg left"></i><i class="doll-leg right"></i></div>`;
  if(p.brand==='starward') return `<div class="toy-model ship variant-${n}"><i class="ship-wing left"></i><i class="ship-wing right"></i><i class="ship-body"></i><i class="ship-cockpit"></i><i class="ship-engine left"></i><i class="ship-engine right"></i></div>`;
  if(p.brand==='pocketbeasts') return `<div class="toy-model beast variant-${n}"><i class="beast-body"></i><i class="beast-head"></i><i class="beast-ear left"></i><i class="beast-ear right"></i><i class="beast-eye left"></i><i class="beast-eye right"></i><i class="beast-tail"></i></div>`;
  if(p.brand==='mythicforge') return `<div class="toy-model warrior variant-${n}"><i class="warrior-head"></i><i class="warrior-body"></i><i class="warrior-shield"></i><i class="warrior-sword"></i><i class="warrior-leg left"></i><i class="warrior-leg right"></i></div>`;
  if(p.brand==='nitrostreet') return `<div class="toy-model car variant-${n}"><i class="car-body"></i><i class="car-cabin"></i><i class="car-stripe"></i><i class="car-wheel left"></i><i class="car-wheel right"></i></div>`;
  if(p.brand==='littleworld') return `<div class="toy-model bear variant-${n}"><i class="bear-body"></i><i class="bear-head"></i><i class="bear-ear left"></i><i class="bear-ear right"></i><i class="bear-face"></i><i class="bear-foot left"></i><i class="bear-foot right"></i></div>`;
  return `<div class="toy-model hero-figure variant-${n}"><i class="hero-head"></i><i class="hero-body"></i><i class="hero-cape"></i><i class="hero-arm left"></i><i class="hero-arm right"></i><i class="hero-leg left"></i><i class="hero-leg right"></i><b class="hero-emblem">U</b></div>`;
}

function packageArt(p,compact=false){
  const b=getBrand(p.brand);
  return `<div class="toy-package ${compact?'compact':''}">
    <div class="pack-top"><span class="pack-brand">${brandWord(p)}</span><span class="pack-wave">${seriesLabel(p)}</span></div>
    <div class="pack-window">${toyModel(p)}<span class="pack-spark one"></span><span class="pack-spark two"></span></div>
    <div class="pack-bottom"><strong>${p.name}</strong><span>${b.category}</span></div>
    <div class="pack-corner">${String(productNumber(p)).padStart(2,'0')}</div>
  </div>`;
}

function productArt(p,large=false){
  const m=state.market[p.id];
  return `<div class="product-art ${large?'large-art':''}" style="${brandStyle(p)}">
    <span class="brand-badge">${getBrand(p.brand).name}</span>
    <span class="heat-badge">${heat(m.hype)} ${hypeLabel(m.hype)}</span>
    <div class="package-stage">${packageArt(p,false)}</div>
  </div>`;
}

function miniProductCard(p,context='market'){
  const inv=state.inventory[p.id];
  const m=state.market[p.id];
  const price=inv?inv.price:p.rrp;
  return `<article class="mini-card" onclick="${context==='inventory'?`openPriceSheet('${p.id}')`:`openBuySheet('${p.id}')`}">
    ${productArt(p)}
    <div class="mini-body"><h3>${p.name}</h3><div class="subtle">${getBrand(p.brand).category}</div>
    <div class="price-line"><strong>${money(price)}</strong><span>${inv?`${inv.qty} in stock`:`Wholesale ${money(p.wholesale)}`}</span></div></div>
  </article>`;
}

function render(){
  updateStats();
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.tab));
  if(state.tab==='store') renderStore();
  if(state.tab==='market') renderMarket();
  if(state.tab==='products') renderProducts();
  if(state.tab==='rivals') renderRivals();
  if(state.tab==='empire') renderEmpire();
}

function renderStoreWorld(owned,chatter,hottest){
  const shelf=owned.slice(0,6);
  const fallback=products.filter(p=>p.launchDay<=state.day).slice(0,6);
  const stock=shelf.length?shelf:fallback;
  const shopperCount=clamp(Math.round((state.customersToday||34)/18),3,6);
  const shoppers=Array.from({length:shopperCount},(_,i)=>{
    const bubble=i<2 && chatter[i]?`<div class="shopper-bubble">${chatter[i].text}</div>`:'';
    return `<div class="shopper shopper-${i+1}">${bubble}<i class="shopper-head"></i><i class="shopper-body"></i><i class="shopper-arm left"></i><i class="shopper-arm right"></i><i class="shopper-leg left"></i><i class="shopper-leg right"></i></div>`;
  }).join('');
  return `<div class="store-world">
    <div class="store-ceiling"><i></i><i></i><i></i></div>
    <div class="store-back-wall">
      <div class="store-logo-sign"><span>TOY</span><b>STORE</b><small>TYCOON</small></div>
      <div class="launch-poster" style="${brandStyle(hottest)}" onclick="openBuySheet('${hottest.id}')"><span>HOT DROP</span>${packageArt(hottest,true)}<strong>${hottest.name}</strong></div>
      <div class="service-sign">⭐ ${state.rating.toFixed(1)}<small>LOCAL FAVOURITE</small></div>
    </div>
    <div class="store-floor">
      <div class="shelf-wall shelf-left">${stock.slice(0,3).map(p=>{const ownedQty=state.inventory[p.id]?.qty||0;return `<div class="shelf-product" style="${brandStyle(p)}" onclick="${ownedQty?`openPriceSheet('${p.id}')`:`openBuySheet('${p.id}')`}">${packageArt(p,true)}<span>${ownedQty||'NEW'}</span></div>`}).join('')}<div class="shelf-plank"></div></div>
      <div class="shelf-wall shelf-right">${stock.slice(3,6).map(p=>{const ownedQty=state.inventory[p.id]?.qty||0;return `<div class="shelf-product" style="${brandStyle(p)}" onclick="${ownedQty?`openPriceSheet('${p.id}')`:`openBuySheet('${p.id}')`}">${packageArt(p,true)}<span>${ownedQty||'NEW'}</span></div>`}).join('')}<div class="shelf-plank"></div></div>
      <div class="checkout"><div class="register">▰</div><div class="counter-sign">CHECKOUT</div><div class="shopping-bag">T</div></div>
      <div class="delivery-cart"><div>📦</div><span>${inventoryUsed()} units</span></div>
      ${shoppers}
    </div>
    <div class="store-glow"></div>
  </div>`;
}

function renderStore(){
  const hottest=products.filter(p=>p.launchDay<=state.day+4).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype)[0];
  const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0).map(getProduct);
  const low=owned.filter(p=>state.inventory[p.id].qty<=3).sort((a,b)=>state.inventory[a.id].qty-state.inventory[b.id].qty);
  const hotOwned=[...owned].sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype).slice(0,6);
  const chatter=getChatter();
  screen.innerHTML=`
    <section class="store-world-wrap">
      ${renderStoreWorld(hotOwned,chatter,hottest)}
      <div class="store-command-card"><div><span class="kicker">DAY ${state.day} · YOUR FIRST STORE</span><h2>${state.customersToday?'Another day in the books.':'Doors are ready to open.'}</h2><p>${state.customersToday?`${state.customersToday} customers visited · ${money(state.todaySales)} sales today.`:'Watch the floor, listen to shoppers and react before your rivals do.'}</p></div><button class="primary-btn next-day-btn" onclick="endDay()">OPEN NEXT DAY <b>→</b></button></div>
    </section>

    <section class="section"><div class="section-head"><div><h2>🔥 Trend Alert</h2><p>The product customers are chasing right now</p></div><button onclick="switchTab('market')">Market</button></div>
      <div class="trend-feature" style="${brandStyle(hottest)}" onclick="openBuySheet('${hottest.id}')"><div class="trend-copy"><span class="kicker">${hypeLabel(state.market[hottest.id].hype)} · ${getBrand(hottest.brand).name}</span><strong>${hottest.name}</strong><p>Buzz is ${state.market[hottest.id].trend>=0?'climbing':'cooling'} · ${state.supplierStock[hottest.id]} supplier units left.</p><div class="trend-price"><span>Wholesale</span><b>${money(hottest.wholesale)}</b></div></div><div class="trend-pack">${packageArt(hottest,true)}</div></div>
    </section>

    <section class="section"><div class="section-head"><div><h2>Hot on Your Shelves</h2><p>Tap a box to adjust its price</p></div><button onclick="switchTab('products')">All</button></div>
      <div class="rail">${hotOwned.length?hotOwned.map(p=>miniProductCard(p,'inventory')).join(''):'<div class="empty">No stock yet.</div>'}</div></section>

    <section class="section"><div class="section-head"><div><h2>Customer Buzz</h2><p>Conversations are free market research</p></div></div>
      ${chatter.map(c=>`<div class="chatter premium-chatter"><div class="avatar">${c.avatar}</div><div><p>“${c.text}”</p><small>${c.note}</small></div><span class="buzz-wave">〰</span></div>`).join('')}
    </section>

    <section class="section"><div class="grid2">
      <div class="action-card accent visual-action" onclick="switchTab('market')"><div class="action-orb">📦</div><h3>Buy Stock</h3><p>${inventoryUsed()} / ${inventoryCapacity()} units stored.</p></div>
      <div class="action-card ${low.length?'warn':''} visual-action" onclick="switchTab('products')"><div class="action-orb">${low.length?'⚠️':'✓'}</div><h3>${low.length?low.length+' Low Stock':'Stock Healthy'}</h3><p>${low.length?'Potential lost sales if these sell out.':'Your shelves are ready for customers.'}</p></div>
      <div class="action-card visual-action" onclick="switchTab('rivals')"><div class="action-orb">⚔️</div><h3>Rival Watch</h3><p>${rivalTemplates[0].name}: ${state.rivals.mega.activity}</p></div>
      <div class="action-card visual-action" onclick="switchTab('empire')"><div class="action-orb">📊</div><h3>${state.marketShare.toFixed(0)}% Share</h3><p>Local toy market · ${state.rating.toFixed(1)} ★ rating.</p></div>
    </div></section>`;
}
function getChatter(){
  const hot=products.filter(p=>p.launchDay<=state.day+2).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype).slice(0,5);
  const rival=rand(rivalTemplates);
  const lines=[
    p=>({avatar:'🧒',text:`Everyone at school is talking about ${p.name}!`,note:`Strong signal for ${getBrand(p.brand).name}`}),
    p=>({avatar:'👩',text:`Do you have ${p.name}? ${rival.name} was sold out.`,note:'A rival stockout can create opportunity'}),
    p=>({avatar:'👨',text:`That seems expensive… but my kid really wants ${p.name}.`,note:'High hype can support prices above RRP'}),
    p=>({avatar:'🧑',text:`I heard the new ${getBrand(p.brand).name} range might be huge this Christmas.`,note:'Rumour — useful, but not guaranteed'}),
    p=>({avatar:'👧',text:`The ${p.name} videos are everywhere right now!`,note:'Social buzz is lifting demand'})
  ];
  return hot.slice(0,3).map((p,i)=>lines[(state.day+i)%lines.length](p));
}

function renderMarket(){
  const available=products.filter(p=>p.launchDay<=state.day+5);
  const filtered=available.filter(p=>currentFilter==='all'||p.brand===currentFilter).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype);
  screen.innerHTML=`
    <section class="section"><div class="section-head"><div><h2>Supplier Market</h2><p>Buy before the craze — or get trapped with a flop.</p></div></div>
      <div class="toolbar"><button class="chip ${currentFilter==='all'?'active':''}" onclick="setFilter('all')">All</button>${Object.entries(brands).map(([id,b])=>`<button class="chip ${currentFilter===id?'active':''}" onclick="setFilter('${id}')">${b.glyph} ${b.name}</button>`).join('')}</div>
      <div class="market-grid">${filtered.map(p=>marketCard(p)).join('')}</div>
    </section>`;
}

function marketCard(p){
  const m=state.market[p.id], stock=state.supplierStock[p.id]||0;
  const rivalCount=rivalTemplates.filter(r=>state.rivals[r.id].prices[p.id] && Math.abs(state.rivals[r.id].prices[p.id]-p.rrp)<p.rrp*.3).length;
  const launch=p.launchDay>state.day?`Launches in ${p.launchDay-state.day} day${p.launchDay-state.day===1?'':'s'}`:'Available now';
  return `<article class="market-card">${productArt(p)}<div class="market-body">
    <div class="brand-name">${getBrand(p.brand).name} · ${launch}</div><div class="market-title-row"><h3>${p.name}</h3><strong>${money(p.rrp)}</strong></div>
    <div class="metrics"><div class="metric"><span>Wholesale</span><strong>${money(p.wholesale)}</strong></div><div class="metric"><span>Supplier</span><strong>${stock} left</strong></div><div class="metric"><span>Rival Interest</span><strong>${rivalCount}/4</strong></div></div>
    <div class="button-row"><button class="secondary-btn" onclick="openProductInfo('${p.id}')">DETAILS</button><button class="primary-btn" ${stock<=0?'disabled':''} onclick="openBuySheet('${p.id}')">${stock?'ORDER STOCK':'SOLD OUT'}</button></div>
  </div></article>`;
}

function setFilter(f){ currentFilter=f; renderMarket(); }

function renderProducts(){
  const owned=Object.keys(state.inventory).map(getProduct).filter(Boolean).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype);
  const totalUnits=inventoryUsed();
  screen.innerHTML=`<section class="section"><div class="section-head"><div><h2>Your Products</h2><p>${totalUnits} units · ${money(inventoryValue())} wholesale value</p></div></div>
    ${owned.length?owned.map(p=>inventoryRow(p)).join(''):`<div class="empty"><div class="emoji">📦</div><h3>Your shelves are empty</h3><p>Order products from the Market.</p><button class="primary-btn" onclick="switchTab('market')">OPEN MARKET</button></div>`}
  </section>`;
}

function inventoryRow(p){
  const inv=state.inventory[p.id], m=state.market[p.id];
  const margin=inv.price-p.wholesale;
  return `<div class="inventory-row" style="${brandStyle(p)}" onclick="openPriceSheet('${p.id}')">
    <div class="inventory-thumb">${packageArt(p,true)}</div><div><h3>${p.name}</h3><p>${getBrand(p.brand).name} · ${heat(m.hype)} ${hypeLabel(m.hype)}</p><p><strong>${money(inv.price)}</strong> · <span class="${margin>=0?'profit':'loss'}">${margin>=0?'+':''}${money(margin)}/unit</span> · ${inv.soldToday||0} sold today</p></div><div class="stock-pill">${inv.qty} left</div>
  </div>`;
}

function renderRivals(){
  screen.innerHTML=`<section class="section"><div class="section-head"><div><h2>Local Rivals</h2><p>They buy, discount, hoard stock and occasionally play dirty.</p></div></div>
    ${rivalTemplates.map(r=>rivalCard(r)).join('')}
  </section>`;
}

function rivalStorefront(r){
  const sale=r.id==='mega'?'EVERYDAY LOW':r.id==='collector'?'RARE DROPS':r.id==='family'?'FAMILY VALUE':'TRENDING NOW';
  return `<div class="rival-storefront ${r.id}"><div class="storefront-roof"></div><div class="storefront-sign"><span>${r.logo}</span><b>${r.name}</b></div><div class="storefront-window left"><i></i><i></i><strong>${sale}</strong></div><div class="storefront-door"><span>OPEN</span></div><div class="storefront-window right"><i></i><i></i><b>SALE</b></div><div class="storefront-pavement"></div></div>`;
}

function rivalCard(r){
  const s=state.rivals[r.id];
  return `<article class="rival-card premium-rival"><div class="rival-banner" style="--rival-grad:${r.grad};background:${r.grad}">${rivalStorefront(r)}<div class="rival-overlay"><div><div class="kicker">${r.strategy}</div><h3>${r.name}</h3></div><div class="rival-share-badge">${s.share.toFixed(0)}%<small>SHARE</small></div></div></div>
    <div class="rival-body"><div class="rival-meta"><div class="metric"><span>Market Share</span><strong>${s.share.toFixed(0)}%</strong></div><div class="metric"><span>Reputation</span><strong>${s.rep.toFixed(1)} ★</strong></div><div class="metric"><span>Aggression</span><strong>${r.aggression}</strong></div></div>
    <div class="activity rival-activity"><span>LIVE</span><b>${s.activity}</b></div><div class="button-row" style="margin-top:10px"><button class="secondary-btn" onclick="compareRival('${r.id}')">COMPARE PRICES</button><button class="primary-btn" onclick="counterRival('${r.id}')">RUN PROMO</button></div></div></article>`;
}
function renderEmpire(){
  const net=state.cash+inventoryValue();
  const nextTarget=50000;
  const progress=clamp(net/nextTarget*100,0,100);
  screen.innerHTML=`<section class="empire-hero"><div class="kicker">YOUR COMPANY</div><h2>Independent & hungry.</h2><p>Build local trust, outsmart the chains and turn one colourful shop into a toy empire.</p><div class="divider"></div><div class="metrics"><div class="metric"><span>Net Worth</span><strong>${money(net)}</strong></div><div class="metric"><span>Lifetime Sales</span><strong>${money(state.totalRevenue)}</strong></div><div class="metric"><span>Market Share</span><strong>${state.marketShare.toFixed(1)}%</strong></div></div><div class="field-label">Next milestone · ${money(nextTarget)}</div><div class="progress"><span style="width:${progress}%"></span></div></section>
    <section class="section"><div class="section-head"><div><h2>Store Upgrades</h2><p>Permanent improvements to your first location</p></div></div>${upgrades.map(u=>upgradeCard(u)).join('')}</section>
    <section class="section"><div class="section-head"><div><h2>Business Record</h2></div></div><div class="grid2"><div class="action-card"><div class="emoji">💵</div><h3>${money(state.totalProfit)}</h3><p>Lifetime operating profit</p></div><div class="action-card"><div class="emoji">👥</div><h3>${state.customersToday}</h3><p>Customers today</p></div></div></section>
    <section class="section"><button class="secondary-btn wide" onclick="showLog()">VIEW EVENT HISTORY</button><button class="danger-btn wide" style="margin-top:9px" onclick="resetGame()">RESET LOCAL SAVE</button><p class="small-note">v${VERSION} · Save data is stored locally in this browser on this device.</p></section>`;
}

function upgradeCard(u){
  const lvl=state.upgrades[u.id]||0, cost=Math.round(u.cost*(1+lvl*.55)), maxed=lvl>=u.max;
  return `<div class="upgrade-card"><div><h3>${u.icon} ${u.name} · Lv ${lvl}/${u.max}</h3><p>${u.desc}</p></div><button class="${maxed?'secondary-btn':'primary-btn'}" ${maxed?'disabled':''} onclick="buyUpgrade('${u.id}')">${maxed?'MAX':money(cost)}</button></div>`;
}

function buyUpgrade(id){
  const u=upgrades.find(x=>x.id===id), lvl=state.upgrades[id]||0;
  if(lvl>=u.max) return;
  const cost=Math.round(u.cost*(1+lvl*.55));
  if(state.cash<cost) return toast('Not enough cash');
  state.cash-=cost; state.upgrades[id]++; state.eventLog.unshift(`Day ${state.day}: Upgraded ${u.name} to level ${state.upgrades[id]}.`); saveState(); renderEmpire(); toast(`${u.name} upgraded`);
}

function openBuySheet(id){
  const p=getProduct(id), m=state.market[id], stock=state.supplierStock[id]||0;
  sheetQty=Math.min(5,stock||1);
  const inv=state.inventory[id];
  sheetContent.innerHTML=`<div class="sheet-art package-sheet" style="${brandStyle(p)}">${packageArt(p,false)}</div><div class="brand-name">${getBrand(p.brand).name}</div><h2>${p.name}</h2>
    <div class="metrics"><div class="metric"><span>Wholesale</span><strong>${money(p.wholesale)}</strong></div><div class="metric"><span>RRP</span><strong>${money(p.rrp)}</strong></div><div class="metric"><span>Buzz</span><strong>${heat(m.hype)} ${hypeLabel(m.hype)}</strong></div></div>
    <p class="subtle">${marketInsight(p)}</p><div class="divider"></div><div class="field-label">Order quantity · Supplier has ${stock}</div>
    <div class="stepper"><button onclick="changeQty(-1,'${id}')">−</button><strong id="qtyValue">${sheetQty}</strong><button onclick="changeQty(1,'${id}')">+</button></div>
    <button class="primary-btn wide" id="orderBtn" onclick="buyStock('${id}')">ORDER ${sheetQty} · ${money(sheetQty*p.wholesale)}</button>
    <p class="small-note">Stockroom: ${inventoryUsed()} / ${inventoryCapacity()} units. ${inv?`You already own ${inv.qty}.`:''}</p>`;
  openSheet();
}

function marketInsight(p){
  const m=state.market[p.id], analytics=state.upgrades.analytics||0;
  if(analytics===0){
    if(m.hype>=80) return 'Customers are talking about this constantly. It could be a breakout hit — if the hype is real.';
    if(m.hype>=60) return 'Interest is healthy, but there is still uncertainty around how long the demand will last.';
    return 'Buzz is muted. This could be overlooked value, or it could become dead stock.';
  }
  const signal=Math.round(m.hype + (analytics===1?(Math.random()*12-6):(Math.random()*5-2.5)));
  return `Trend Scanner estimates demand around ${clamp(signal,10,99)}/100. Recent momentum is ${m.trend>1?'accelerating':m.trend<-1?'falling':'fairly stable'}.`;
}

function changeQty(delta,id){
  const p=getProduct(id), max=Math.min(state.supplierStock[id]||0, Math.max(0,inventoryCapacity()-inventoryUsed()));
  sheetQty=clamp(sheetQty+delta,1,Math.max(1,max));
  document.getElementById('qtyValue').textContent=sheetQty;
  document.getElementById('orderBtn').textContent=`ORDER ${sheetQty} · ${money(sheetQty*p.wholesale)}`;
}

function buyStock(id){
  const p=getProduct(id), stock=state.supplierStock[id]||0, capacityLeft=inventoryCapacity()-inventoryUsed();
  const qty=Math.min(sheetQty,stock,capacityLeft);
  if(qty<=0) return toast('No stockroom space or supplier stock');
  const cost=qty*p.wholesale;
  if(state.cash<cost) return toast('Not enough cash for that order');
  state.cash-=cost; state.supplierStock[id]-=qty; state.orderCount++;
  if(!state.inventory[id]) state.inventory[id]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0};
  state.inventory[id].qty+=qty;
  state.eventLog.unshift(`Day ${state.day}: Ordered ${qty} × ${p.name} for ${money(cost)}.`);
  saveState(); closeSheet(); render(); toast(`${qty} × ${p.name} ordered`);
}

function openPriceSheet(id){
  const p=getProduct(id), inv=state.inventory[id], m=state.market[id];
  const rivalPrices=rivalTemplates.map(r=>state.rivals[r.id].prices[id]).filter(Boolean).sort((a,b)=>a-b);
  const low=rivalPrices[0]||p.rrp;
  sheetContent.innerHTML=`<div class="sheet-art package-sheet" style="${brandStyle(p)}">${packageArt(p,false)}</div><div class="brand-name">${getBrand(p.brand).name}</div><h2>${p.name}</h2>
    <div class="metrics"><div class="metric"><span>Your Stock</span><strong>${inv.qty}</strong></div><div class="metric"><span>Sold Today</span><strong>${inv.soldToday||0}</strong></div><div class="metric"><span>Buzz</span><strong>${heat(m.hype)} ${hypeLabel(m.hype)}</strong></div></div>
    <label class="field-label" for="priceInput">Your shelf price</label><input id="priceInput" class="price-input" type="number" min="1" step="0.50" value="${inv.price.toFixed(2)}" />
    <div class="button-row"><button class="secondary-btn" onclick="setPricePreset('${id}',${p.rrp})">RRP ${money(p.rrp)}</button><button class="secondary-btn" onclick="setPricePreset('${id}',${low})">MATCH ${money(low)}</button></div>
    <button class="primary-btn wide" style="margin-top:9px" onclick="savePrice('${id}')">UPDATE PRICE</button>
    <p class="small-note">Wholesale ${money(p.wholesale)} · Lowest observed rival ${money(low)}. High hype can support prices above RRP, but customers may walk if you push too far.</p>`;
  openSheet();
}
function setPricePreset(id,v){ document.getElementById('priceInput').value=Number(v).toFixed(2); }
function savePrice(id){
  const value=parseFloat(document.getElementById('priceInput').value);
  if(!Number.isFinite(value)||value<=0) return toast('Enter a valid price');
  state.inventory[id].price=roundMoney(value); saveState(); closeSheet(); render(); toast(`Price updated to ${money(value)}`);
}

function openProductInfo(id){
  const p=getProduct(id), m=state.market[id];
  sheetContent.innerHTML=`<div class="sheet-art package-sheet" style="${brandStyle(p)}">${packageArt(p,false)}</div><div class="brand-name">${getBrand(p.brand).category}</div><h2>${p.name}</h2><p>${marketInsight(p)}</p>
  <div class="metrics"><div class="metric"><span>Product Quality</span><strong>${p.quality}/100</strong></div><div class="metric"><span>Scarcity</span><strong>${p.scarcity}/100</strong></div><div class="metric"><span>Trend</span><strong>${m.trend>0?'↑':m.trend<0?'↓':'→'} ${Math.abs(m.trend)}</strong></div></div><button class="primary-btn wide" onclick="closeSheet();openBuySheet('${id}')">ORDER STOCK</button>`;
  openSheet();
}

function compareRival(id){
  const r=rivalTemplates.find(x=>x.id===id), s=state.rivals[id];
  const owned=Object.keys(state.inventory).map(getProduct).filter(Boolean).slice(0,10);
  sheetContent.innerHTML=`<h2>${r.logo} ${r.name}</h2><p class="subtle">Compare shelf prices on products you currently stock.</p>${owned.map(p=>{const mine=state.inventory[p.id].price,theirs=s.prices[p.id],diff=mine-theirs;return `<div class="inventory-row" style="grid-template-columns:55px 1fr auto;${brandStyle(p)}"><div class="inventory-thumb" style="width:55px;height:55px">${packageArt(p,true)}</div><div><h3>${p.name}</h3><p>You ${money(mine)} · ${r.name} ${money(theirs)}</p></div><div class="stock-pill ${diff>0?'hot':'profit'}">${diff>0?'+':''}${money(diff)}</div></div>`}).join('')}<button class="secondary-btn wide" onclick="closeSheet()">DONE</button>`;
  openSheet();
}

function counterRival(id){
  const cost=900;
  if(state.cash<cost) return toast('You need $900 for a local promotion');
  state.cash-=cost; state.reputation=clamp(state.reputation+3,0,100); state.marketShare=clamp(state.marketShare+0.5,1,80); state.rivals[id].share=Math.max(4,state.rivals[id].share-.5);
  state.eventLog.unshift(`Day ${state.day}: Ran a $900 promotion against ${rivalTemplates.find(r=>r.id===id).name}.`); saveState(); renderRivals(); toast('Local promotion launched');
}

function openSheet(){ sheet.classList.remove('hidden');sheetBackdrop.classList.remove('hidden'); }
function closeSheet(){ sheet.classList.add('hidden');sheetBackdrop.classList.add('hidden'); }
function toast(msg){ toastEl.textContent=msg;toastEl.classList.remove('hidden');clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.add('hidden'),2200); }
function showSplash(title,body,icon='🔥'){
  splash.innerHTML=`<div class="event-inner"><div class="event-icon">${icon}</div><div class="kicker">MARKET EVENT</div><h2>${title}</h2><p>${body}</p><button class="primary-btn" onclick="closeSplash()">BACK TO STORE</button></div>`;
  splash.classList.remove('hidden');
}
function closeSplash(){ splash.classList.add('hidden'); render(); }

function switchTab(tab){ state.tab=tab; saveState(); render(); window.scrollTo({top:0,behavior:'smooth'}); }

function endDay(){
  simulateCustomers();
  simulateMarket();
  simulateRivals();
  state.day++;
  products.forEach(p=>{ if(state.inventory[p.id]) state.inventory[p.id].soldToday=0; });
  const event=maybeMajorEvent();
  replenishSuppliers();
  saveState();
  if(event) showSplash(event.title,event.body,event.icon); else { render(); toast(`Day ${state.day} begins`); }
}

function simulateCustomers(){
  const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0);
  let traffic=Math.round(58*(1+state.upgrades.marketing*.06)*(0.9+state.rating/10));
  traffic += Math.round((Math.random()-.5)*15); traffic=Math.max(25,traffic);
  state.customersToday=traffic; state.todaySales=0; state.todayProfit=0;
  owned.forEach(id=>{
    const p=getProduct(id), inv=state.inventory[id], m=state.market[id];
    const competitorLow=Math.min(...rivalTemplates.map(r=>state.rivals[r.id].prices[id]||9999));
    const priceRatio=inv.price/p.rrp;
    let priceScore=priceRatio<=.85?1.35:priceRatio<=1?1.12:priceRatio<=1.15?(.98-(priceRatio-1)*.8):Math.max(.28,1.0-(priceRatio-1)*2.15);
    if(inv.price>competitorLow*1.12) priceScore*=.72;
    const appeal=(m.hype*.62+p.quality*.23+p.scarcity*.15)/100;
    let expected=traffic*(appeal*.11)*priceScore;
    expected*=.78+Math.random()*.48;
    let sold=Math.min(inv.qty,Math.max(0,Math.round(expected)));
    inv.qty-=sold; inv.soldToday=sold; inv.totalSold=(inv.totalSold||0)+sold;
    const revenue=sold*inv.price, profit=sold*(inv.price-p.wholesale);
    inv.lastProfit=profit; state.todaySales+=revenue; state.todayProfit+=profit; state.cash+=revenue; state.totalRevenue+=revenue; state.totalProfit+=profit;
  });
  state.todaySales=roundMoney(state.todaySales); state.todayProfit=roundMoney(state.todayProfit); state.cash=roundMoney(state.cash); state.totalRevenue=roundMoney(state.totalRevenue); state.totalProfit=roundMoney(state.totalProfit);
  const gouged=owned.filter(id=>state.inventory[id].price>getProduct(id).rrp*1.35 && state.market[id].hype<82).length;
  const service=(state.upgrades.service||0);
  state.rating=clamp(state.rating + (gouged?-.05*gouged:.012+service*.005) + (Math.random()-.5)*.02,2.8,5);
  state.marketShare=clamp(state.marketShare + (state.todayProfit>900?.18:-.04) + (Math.random()-.5)*.16,4,65);
}

function simulateMarket(){
  products.forEach(p=>{
    const m=state.market[p.id];
    let change=(Math.random()-.5)*10 + m.trend*.55;
    if(p.launchDay===state.day+1) change+=Math.random()*8;
    if(p.launchDay<state.day-12) change-=Math.random()*2.4;
    m.hype=clamp(Math.round(m.hype+change),18,99);
    m.trend=clamp(Math.round(change/2),-5,5);
    m.buzz=hypeLabel(m.hype).toLowerCase();
  });
}

function simulateRivals(){
  rivalTemplates.forEach(r=>{
    const s=state.rivals[r.id];
    const target=rand(products.filter(p=>p.launchDay<=state.day+4));
    const m=state.market[target.id];
    if(r.id==='mega' && weightedChance(55)){
      s.prices[target.id]=roundMoney(target.rrp*(.78+Math.random()*.12));
      s.activity=`Cut ${target.name} to ${money(s.prices[target.id])}. A price war may be starting.`;
    } else if(r.id==='collector' && m.hype>76){
      s.prices[target.id]=roundMoney(target.rrp*(1.18+Math.random()*.22));
      s.activity=`Raised ${target.name} above RRP as collector demand surged.`;
    } else if(r.id==='trend'){
      const take=Math.min(state.supplierStock[target.id]||0,4+Math.floor(Math.random()*12));
      state.supplierStock[target.id]=Math.max(0,(state.supplierStock[target.id]||0)-take);
      s.activity=`Bought ${take} units of ${target.name} chasing the trend.`;
    } else {
      s.activity=`Featured ${getBrand(target.brand).name} in its front window.`;
    }
    if(weightedChance(r.rumor)){
      const rumorTarget=rand(products);
      state.market[rumorTarget.id].hype=clamp(state.market[rumorTarget.id].hype-(3+Math.floor(Math.random()*7)),18,99);
      s.activity=`Customers are repeating a negative rumour about ${rumorTarget.name}. Source unverified.`;
    }
    s.share=clamp(s.share+(Math.random()-.5)*.55,5,38);
  });
}

function maybeMajorEvent(){
  if(state.day===2) return {icon:'🎄',title:'Holiday Buzz Begins',body:'Parents are starting to plan gift lists. High-hype products will become more sensitive to shortages over the next few days.'};
  if(state.day%4!==0 && !weightedChance(18)) return null;
  const p=rand(products.filter(x=>x.launchDay<=state.day+2));
  const good=weightedChance(58);
  if(good){
    const boost=12+Math.floor(Math.random()*18); state.market[p.id].hype=clamp(state.market[p.id].hype+boost,18,99); state.market[p.id].trend=5;
    const body=rand([
      `A huge wave of social chatter has pushed ${p.name} into must-have territory. Shops with stock may be able to command a premium.`,
      `${p.name} has become the surprise toy of the week. Rival stores are scrambling for supplier allocations.`,
      `A glowing review sent ${p.name} searches soaring. Demand has jumped sharply overnight.`
    ]);
    state.eventLog.unshift(`Day ${state.day}: ${p.name} hype surged.`); return {icon:getBrand(p.brand).glyph,title:`${p.name} EXPLODES`,body};
  } else {
    const drop=13+Math.floor(Math.random()*18); state.market[p.id].hype=clamp(state.market[p.id].hype-drop,18,99); state.market[p.id].trend=-5;
    const body=rand([
      `${p.name} opened to weak reviews and customers are losing interest. Heavy stockholders may need to mark it down.`,
      `The launch buzz around ${p.name} has collapsed. Suppliers are suddenly much easier to negotiate with.`,
      `Customers have moved on from ${p.name}. Expect slower sales unless pricing gets aggressive.`
    ]);
    state.eventLog.unshift(`Day ${state.day}: ${p.name} hype collapsed.`); return {icon:'📉',title:`HYPE CRASH`,body};
  }
}

function replenishSuppliers(){
  products.forEach(p=>{
    let add=Math.floor(Math.random()*7);
    if(state.market[p.id].hype>85) add=Math.floor(add*.35);
    state.supplierStock[p.id]=clamp((state.supplierStock[p.id]||0)+add,0,150);
  });
}

function showLog(){
  sheetContent.innerHTML=`<h2>📜 Event History</h2>${state.eventLog.slice(0,30).map(x=>`<div class="activity" style="margin:8px 0">${x}</div>`).join('')}<button class="secondary-btn wide" onclick="closeSheet()">DONE</button>`;openSheet();
}

sheetBackdrop.addEventListener('click',closeSheet);
document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>switchTab(btn.dataset.tab)));
document.getElementById('soundBtn').addEventListener('click',()=>{state.sound=!state.sound;saveState();toast(state.sound?'Sound on':'Sound off');});

if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{})); }

render();
if(!state.tutorialShown){
  state.tutorialShown=true; saveState();
  setTimeout(()=>showSplash('WELCOME TO YOUR STORE','You have $25,000, one small shop and four ambitious rivals. Listen to customers, buy stock before trends peak, set your own prices and survive the products that flop.','🧸'),350);
}

window.switchTab=switchTab;window.endDay=endDay;window.openBuySheet=openBuySheet;window.openPriceSheet=openPriceSheet;window.openProductInfo=openProductInfo;window.setFilter=setFilter;window.changeQty=changeQty;window.buyStock=buyStock;window.setPricePreset=setPricePreset;window.savePrice=savePrice;window.closeSheet=closeSheet;window.closeSplash=closeSplash;window.compareRival=compareRival;window.counterRival=counterRival;window.buyUpgrade=buyUpgrade;window.showLog=showLog;window.resetGame=resetGame;


/* ==========================================================================\n   v0.3 — Living Market + Retail Strategy\n   Deeper economy overrides. Function declarations intentionally replace the\n   earlier v0.2 implementations while retaining the premium visual system.\n   ========================================================================== */
function gameDate(day=state?.day||1){
  const i=Math.max(0,day-1), monthIndex=Math.floor((i%84)/7), dom=(i%7)+1, year=Math.floor(i/84)+1;
  return {month:retailMonths[monthIndex],day:dom,year,label:`${retailMonths[monthIndex]} ${dom}`,short:`${retailMonths[monthIndex].slice(0,3)} ${dom}`,monthIndex};
}
function seasonFactor(day=state.day){
  const m=gameDate(day).month;
  if(m==='December') return 1.58;
  if(m==='November') return 1.30;
  if(m==='October') return 1.12;
  if(m==='July') return 1.10;
  if(m==='January') return .78;
  if(m==='April') return 1.08;
  return 1;
}
function seasonName(day=state.day){
  const m=gameDate(day).month;
  if(m==='December') return 'CHRISTMAS RUSH';
  if(m==='November') return 'GIFT SEASON';
  if(m==='October') return 'HOLIDAY BUILD-UP';
  if(m==='January') return 'CLEARANCE SEASON';
  if(m==='April') return 'EASTER TRADE';
  if(m==='July') return 'SCHOOL HOLIDAYS';
  return 'REGULAR TRADE';
}
function supplierFor(p){ return supplierTemplates[supplierByBrand[p.brand]]; }
function supplierStateFor(p){ return state.suppliers[supplierByBrand[p.brand]]; }
function supplierDiscount(p){ const rel=supplierStateFor(p).relationship; return clamp((rel-45)*.0018,0,.075); }
function effectiveWholesale(p){ return roundMoney(p.wholesale*(1-supplierDiscount(p))); }
function maxOrderAllocation(p){ return Math.max(20,Math.round(28+(supplierStateFor(p).relationship-40)*1.35)); }
function preorderUnits(){ return Object.values(state.preorders||{}).reduce((a,x)=>a+x.qty,0); }
function placementCount(key,except=null){ return Object.entries(state.placements||{}).filter(([id,v])=>id!==except && v===key && (state.inventory[id]?.qty||0)>0).length; }
function placementFactor(id){ return shelfPlacements[state.placements?.[id]||'main']?.factor||1; }
function displayFactor(p){ return state.displays?.[p.brand]?1.18:1; }
function lifecycleFor(p,day=state.day){
  const rel=day-p.launchDay;
  if(rel<=-5) return {key:'rumour',name:'Rumour',icon:'👂',factor:.48};
  if(rel<0) return {key:'announced',name:'Announced',icon:'📣',factor:.72};
  if(rel<=2) return {key:'launch',name:'Launch',icon:'🚀',factor:1.28};
  if(rel<=8) return {key:'peak',name:'Peak',icon:'🔥',factor:1.18};
  if(rel<=18) return {key:'stable',name:'Stable',icon:'🟢',factor:1};
  if(rel<=30) return {key:'decline',name:'Decline',icon:'↘️',factor:.82};
  if(rel<=45) return {key:'clearance',name:'Clearance',icon:'🏷️',factor:.62};
  return {key:'discontinued',name:'Discontinued',icon:'📦',factor:.42};
}
function latentPotential(p){ return clamp(p.baseDemand + ((productNumber(p)*17)%31)-15 + Math.round((p.quality-70)*.22),18,99); }
function migrateState(s){
  s.version=VERSION; s.tab=s.tab||'store'; s.sound=s.sound!==false;
  s.preorders=s.preorders||{}; s.placements=s.placements||{}; s.displays=s.displays||{};
  s.suppliers=s.suppliers||Object.fromEntries(Object.values(supplierTemplates).map(x=>[x.id,{relationship:x.baseRel,totalSpend:0,orders:0}]));
  Object.values(supplierTemplates).forEach(x=>{ if(!s.suppliers[x.id]) s.suppliers[x.id]={relationship:x.baseRel,totalSpend:0,orders:0}; });
  products.forEach((p,idx)=>{
    if(!s.market[p.id]) s.market[p.id]={hype:p.baseDemand,trend:0,buzz:'steady'};
    if(!Number.isFinite(s.market[p.id].potential)) s.market[p.id].potential=latentPotential(p);
    if(s.inventory[p.id]){ if(!Number.isFinite(s.inventory[p.id].avgCost)) s.inventory[p.id].avgCost=p.wholesale; if(!s.placements[p.id]) s.placements[p.id]=(idx%7===0?'window':idx%5===0?'feature':'main'); }
  });
  rivalTemplates.forEach((r,ri)=>{
    const rs=s.rivals[r.id]; if(!rs) return;
    rs.inventory=rs.inventory||{}; rs.cash=Number.isFinite(rs.cash)?rs.cash:70000+ri*18000; rs.lastSales=rs.lastSales||0;
  });
  s.lastSummary=s.lastSummary||null; s.reputation=Number.isFinite(s.reputation)?s.reputation:55;
  return s;
}
function freshState(){
  const inventory={}; const placements={};
  const starting=['P001','P007','P013','P019','P025','P031','P037','P043'];
  starting.forEach((id,idx)=>{ const p=getProduct(id); inventory[id]={qty:8+(idx%4)*2,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:p.wholesale}; placements[id]=idx<2?'window':idx<4?'feature':'main'; });
  const market={}; products.forEach((p,idx)=> market[p.id]={hype:clamp(p.baseDemand+((idx*13)%19)-9,20,96),trend:((idx%5)-2),buzz:'steady',potential:latentPotential(p)});
  const rivals={}; rivalTemplates.forEach((r,ri)=>{ const prices={},rinv={}; products.forEach((p,idx)=>{ prices[p.id]=roundMoney(p.rrp*(r.pricing+((((idx+ri*2)%9)-4)/100))); if(idx%11===ri) rinv[p.id]=4+((idx+ri*3)%10); }); rivals[r.id]={cash:70000+ri*18000,rep:r.rep,share:17+ri*2,prices,inventory:rinv,lastSales:0,activity:'Watching the market.'}; });
  return {version:VERSION,day:1,cash:25000,todaySales:0,todayProfit:0,rating:4.2,reputation:55,customersToday:0,totalRevenue:0,totalProfit:0,inventory,market,rivals,supplierStock:Object.fromEntries(products.map(p=>[p.id,p.supplierStock])),upgrades:{stockroom:0,marketing:0,service:0,analytics:0},marketShare:18,lastEvent:'Grand Opening',eventLog:['Day 1: Your independent toy shop opened.'],chatter:[],sound:true,tab:'store',tutorialShown:false,orderCount:0,preorders:{},placements,displays:{},suppliers:Object.fromEntries(Object.values(supplierTemplates).map(x=>[x.id,{relationship:x.baseRel,totalSpend:0,orders:0}])),lastSummary:null};
}
function loadState(){
  try{
    for(const key of [SAVE_KEY,...LEGACY_SAVE_KEYS]){
      const raw=localStorage.getItem(key); if(!raw) continue;
      const s=JSON.parse(raw); if(s&&s.inventory&&s.market&&s.rivals){ const m=migrateState(s); localStorage.setItem(SAVE_KEY,JSON.stringify(m)); return m; }
    }
  }catch(e){}
  return freshState();
}
function updateStats(){
  document.getElementById('cashStat').textContent=money(state.cash);
  document.getElementById('salesStat').textContent=money(state.todaySales);
  document.getElementById('ratingStat').textContent=state.rating.toFixed(1)+' ★';
  document.getElementById('dayStat').textContent=gameDate().short;
  document.getElementById('soundBtn').textContent=state.sound?'🔊':'🔇';
}
function marketInsight(p){
  const m=state.market[p.id], analytics=state.upgrades.analytics||0, life=lifecycleFor(p), s=supplierFor(p);
  const base=analytics===0?(m.hype>=80?'Customer chatter is intense, but hype can still be wrong.':m.hype>=60?'Interest looks healthy, though the staying power is uncertain.':'Buzz is muted — possible sleeper hit or future dead stock.'):`Trend Scanner estimates demand at ${clamp(Math.round(m.hype+(analytics===1?(Math.random()*10-5):(Math.random()*4-2))),10,99)}/100 and momentum is ${m.trend>1?'accelerating':m.trend<-1?'falling':'stable'}.`;
  return `${life.icon} ${life.name} lifecycle · ${base} ${s.name} relationship ${supplierStateFor(p).relationship.toFixed(0)}/100.`;
}
function getChatter(){
  const hot=products.filter(p=>p.launchDay<=state.day+5).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype).slice(0,7), rival=rand(rivalTemplates);
  const lines=[
    p=>({avatar:'🧒',text:`Everyone at school is talking about ${p.name}!`,note:'STRONG SIGNAL · repeated kid demand'}),
    p=>({avatar:'👩',text:`Do you have ${p.name}? ${rival.name} was sold out.`,note:'STRONG SIGNAL · rival stockout'}),
    p=>({avatar:'👨',text:`That seems expensive… but my kid really wants ${p.name}.`,note:'PRICE SIGNAL · high willingness to pay'}),
    p=>({avatar:'🧑',text:`I heard the new ${getBrand(p.brand).name} range might be huge this ${gameDate().month==='December'?'week':'season'}.`,note:'RUMOUR · useful but unverified'}),
    p=>({avatar:'👧',text:`The ${p.name} videos are everywhere right now!`,note:'SOCIAL SIGNAL · momentum rising'}),
    p=>({avatar:'🧔',text:`Collectors are already asking what allocation you got for ${p.name}.`,note:'COLLECTOR SIGNAL · scarcity matters'})
  ];
  return hot.slice(0,3).map((p,i)=>lines[(state.day+i)%lines.length](p));
}
function calendarBanner(){
  const d=gameDate(), sf=seasonFactor();
  return `<div class="calendar-banner"><div><span class="kicker">RETAIL CALENDAR · YEAR ${d.year}</span><h3>${d.month} ${d.day}</h3><p>${seasonName()} · customer demand ${sf>1?`+${Math.round((sf-1)*100)}%`:sf<1?`${Math.round((sf-1)*100)}%`:'normal'}.</p></div><div class="calendar-month">${d.month.slice(0,3).toUpperCase()}<b>${d.day}</b></div></div>`;
}
function renderStore(){
  const hottest=products.filter(p=>p.launchDay<=state.day+5).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype)[0];
  const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0).map(getProduct);
  const front=[...owned].sort((a,b)=>(placementFactor(b.id)*state.market[b.id].hype)-(placementFactor(a.id)*state.market[a.id].hype)).slice(0,6);
  const low=owned.filter(p=>state.inventory[p.id].qty<=3); const chatter=getChatter(); const preorderCount=preorderUnits();
  screen.innerHTML=`<section class="store-world-wrap">${renderStoreWorld(front,chatter,hottest)}<div class="store-command-card"><div><span class="kicker">${gameDate().label.toUpperCase()} · ${seasonName()}</span><h2>${state.lastSummary?'Ready for the next trading day.':'Doors are ready to open.'}</h2><p>${state.lastSummary?`${state.lastSummary.customers} customers last day · ${money(state.lastSummary.sales)} sales.`:'Listen to shoppers, merchandise the right toys and react before rivals do.'}</p></div><button class="primary-btn next-day-btn" onclick="endDay()">TRADE TODAY <b>→</b></button></div></section>
  <section class="section">${calendarBanner()}</section>
  ${preorderCount?`<section class="section"><div class="preorder-strip" onclick="switchTab('market')"><span>🚚</span><div><b>${preorderCount} pre-order units committed</b><small>Cash is already tied up · deliveries arrive on launch day.</small></div><strong>VIEW →</strong></div></section>`:''}
  <section class="section"><div class="section-head"><div><h2>🔥 Trend Alert</h2><p>${lifecycleFor(hottest).icon} ${lifecycleFor(hottest).name} · ${supplierFor(hottest).name}</p></div><button onclick="switchTab('market')">Market</button></div><div class="trend-feature" style="${brandStyle(hottest)}" onclick="openBuySheet('${hottest.id}')"><div class="trend-copy"><span class="kicker">${hypeLabel(state.market[hottest.id].hype)} · ${getBrand(hottest.brand).name}</span><strong>${hottest.name}</strong><p>Buzz is ${state.market[hottest.id].trend>=0?'climbing':'cooling'} · ${state.supplierStock[hottest.id]} supplier units left.</p><div class="trend-price"><span>${hottest.launchDay>state.day?'Pre-order cost':'Wholesale'}</span><b>${money(effectiveWholesale(hottest))}</b></div></div><div class="trend-pack">${packageArt(hottest,true)}</div></div></section>
  <section class="section"><div class="section-head"><div><h2>Prime Shelf Space</h2><p>Front displays materially increase sales</p></div><button onclick="switchTab('products')">Merchandise</button></div><div class="rail">${front.length?front.map(p=>miniProductCard(p,'inventory')).join(''):'<div class="empty">No stock yet.</div>'}</div></section>
  <section class="section"><div class="section-head"><div><h2>Customer Buzz</h2><p>Signals can be strong, weak or completely wrong</p></div></div>${chatter.map(c=>`<div class="chatter premium-chatter"><div class="avatar">${c.avatar}</div><div><p>“${c.text}”</p><small>${c.note}</small></div><span class="buzz-wave">〰</span></div>`).join('')}</section>
  <section class="section"><div class="grid2"><div class="action-card accent visual-action" onclick="switchTab('market')"><div class="action-orb">📦</div><h3>Buy & Pre-order</h3><p>${inventoryUsed()} stored · ${preorderCount} incoming.</p></div><div class="action-card ${low.length?'warn':''} visual-action" onclick="switchTab('products')"><div class="action-orb">🪟</div><h3>Merchandise</h3><p>${placementCount('window')}/3 window · ${placementCount('feature')}/4 entrance.</p></div><div class="action-card visual-action" onclick="switchTab('rivals')"><div class="action-orb">⚔️</div><h3>Rival Watch</h3><p>${state.rivals.mega.activity}</p></div><div class="action-card visual-action" onclick="switchTab('empire')"><div class="action-orb">🤝</div><h3>Suppliers</h3><p>Relationships unlock better buying prices.</p></div></div></section>`;
}
function renderMarket(){
  const available=products.filter(p=>p.launchDay<=state.day+7 || lifecycleFor(p).key!=='rumour');
  const filtered=available.filter(p=>currentFilter==='all'||p.brand===currentFilter).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype);
  const preorders=Object.entries(state.preorders||{}).filter(([,x])=>x.qty>0);
  screen.innerHTML=`<section class="section">${calendarBanner()}${preorders.length?`<div class="preorder-panel"><span class="kicker">INCOMING LAUNCH STOCK</span>${preorders.map(([id,x])=>`<div><b>${getProduct(id).name}</b><span>${x.qty} units · arrives ${gameDate(getProduct(id).launchDay).label}</span></div>`).join('')}</div>`:''}<div class="section-head"><div><h2>Supplier Market</h2><p>Commit early, read the lifecycle and manage supplier relationships.</p></div></div><div class="toolbar"><button class="chip ${currentFilter==='all'?'active':''}" onclick="setFilter('all')">All</button>${Object.entries(brands).map(([id,b])=>`<button class="chip ${currentFilter===id?'active':''}" onclick="setFilter('${id}')">${b.glyph} ${b.name}</button>`).join('')}</div><div class="market-grid">${filtered.map(p=>marketCard(p)).join('')}</div></section>`;
}
function marketCard(p){
  const m=state.market[p.id], stock=state.supplierStock[p.id]||0, life=lifecycleFor(p), sup=supplierFor(p), ss=supplierStateFor(p), pre=p.launchDay>state.day;
  const rivalCount=rivalTemplates.filter(r=>(state.rivals[r.id].inventory?.[p.id]||0)>0).length;
  return `<article class="market-card">${productArt(p)}<div class="market-body"><div class="market-tag-row"><span class="lifecycle-chip ${life.key}">${life.icon} ${life.name}</span><span class="supplier-chip">${sup.icon} ${sup.name}</span></div><div class="brand-name">${getBrand(p.brand).name} · ${pre?`Launches ${gameDate(p.launchDay).label}`:'Available now'}</div><div class="market-title-row"><h3>${p.name}</h3><strong>${money(p.rrp)}</strong></div><div class="metrics"><div class="metric"><span>Your Cost</span><strong>${money(effectiveWholesale(p))}</strong></div><div class="metric"><span>Supplier</span><strong>${stock} left</strong></div><div class="metric"><span>Rivals Holding</span><strong>${rivalCount}/4</strong></div></div><div class="supplier-rel"><span>Relationship ${ss.relationship.toFixed(0)}/100</span><div><i style="width:${ss.relationship}%"></i></div></div><div class="button-row"><button class="secondary-btn" onclick="openProductInfo('${p.id}')">DETAILS</button><button class="primary-btn" ${stock<=0?'disabled':''} onclick="openBuySheet('${p.id}')">${stock?(pre?'PRE-ORDER':'ORDER STOCK'):'SOLD OUT'}</button></div></div></article>`;
}
function openBuySheet(id){
  const p=getProduct(id),m=state.market[id],stock=state.supplierStock[id]||0,life=lifecycleFor(p),sup=supplierFor(p),pre=p.launchDay>state.day,unit=effectiveWholesale(p);
  sheetQty=Math.min(5,stock||1); const inv=state.inventory[id], incoming=state.preorders[id]?.qty||0;
  sheetContent.innerHTML=`<div class="sheet-art package-sheet" style="${brandStyle(p)}">${packageArt(p,false)}</div><div class="market-tag-row"><span class="lifecycle-chip ${life.key}">${life.icon} ${life.name}</span><span class="supplier-chip">${sup.icon} ${sup.name}</span></div><h2>${p.name}</h2><div class="metrics"><div class="metric"><span>Your Cost</span><strong>${money(unit)}</strong></div><div class="metric"><span>RRP</span><strong>${money(p.rrp)}</strong></div><div class="metric"><span>Buzz</span><strong>${heat(m.hype)} ${hypeLabel(m.hype)}</strong></div></div><p class="subtle">${marketInsight(p)}</p>${pre?`<div class="commit-warning">🔒 PRE-ORDER: the full ${money(unit)} per unit is paid now and tied up until launch on ${gameDate(p.launchDay).label}.</div>`:''}<div class="divider"></div><div class="field-label">${pre?'Commit quantity':'Order quantity'} · Supplier has ${stock} · Your allocation ${maxOrderAllocation(p)}</div><div class="stepper"><button onclick="changeQty(-1,'${id}')">−</button><strong id="qtyValue">${sheetQty}</strong><button onclick="changeQty(1,'${id}')">+</button></div><div class="quick-qty"><button onclick="setOrderQty('${id}',10)">10</button><button onclick="setOrderQty('${id}',25)">25</button><button onclick="setOrderQty('${id}',50)">50</button><button onclick="setOrderQty('${id}',999)">MAX</button></div><button class="primary-btn wide" id="orderBtn" onclick="buyStock('${id}')">${pre?'COMMIT':'ORDER'} ${sheetQty} · ${money(sheetQty*unit)}</button><p class="small-note">Capacity committed: ${inventoryUsed()+preorderUnits()} / ${inventoryCapacity()} units. ${inv?`You own ${inv.qty}.`:''} ${incoming?`${incoming} already incoming.`:''}</p>`; openSheet();
}
function changeQty(delta,id){
  const p=getProduct(id),max=Math.min(state.supplierStock[id]||0,maxOrderAllocation(p),Math.max(0,inventoryCapacity()-inventoryUsed()-preorderUnits())),unit=effectiveWholesale(p),pre=p.launchDay>state.day;
  sheetQty=clamp(sheetQty+delta,1,Math.max(1,max)); document.getElementById('qtyValue').textContent=sheetQty; document.getElementById('orderBtn').textContent=`${pre?'COMMIT':'ORDER'} ${sheetQty} · ${money(sheetQty*unit)}`;
}
function setOrderQty(id,q){ const p=getProduct(id),max=Math.min(state.supplierStock[id]||0,maxOrderAllocation(p),Math.max(0,inventoryCapacity()-inventoryUsed()-preorderUnits())); sheetQty=clamp(q,1,Math.max(1,max)); const unit=effectiveWholesale(p),pre=p.launchDay>state.day; document.getElementById('qtyValue').textContent=sheetQty; document.getElementById('orderBtn').textContent=`${pre?'COMMIT':'ORDER'} ${sheetQty} · ${money(sheetQty*unit)}`; }
function buyStock(id){
  const p=getProduct(id), stock=state.supplierStock[id]||0, capacityLeft=inventoryCapacity()-inventoryUsed()-preorderUnits(), qty=Math.min(sheetQty,stock,maxOrderAllocation(p),capacityLeft), unit=effectiveWholesale(p), cost=roundMoney(qty*unit), sup=supplierStateFor(p), pre=p.launchDay>state.day;
  if(qty<=0) return toast('No stockroom capacity or supplier stock'); if(state.cash<cost) return toast('Not enough cash for that commitment');
  state.cash=roundMoney(state.cash-cost); state.supplierStock[id]-=qty; state.orderCount++; sup.totalSpend=roundMoney((sup.totalSpend||0)+cost); sup.orders=(sup.orders||0)+1; sup.relationship=clamp(sup.relationship+.45+Math.min(1.2,qty/30),0,100);
  if(pre){ const old=state.preorders[id]||{qty:0,cost:0}; state.preorders[id]={qty:old.qty+qty,cost:roundMoney(old.cost+cost),unitCost:unit,committedDay:state.day}; state.eventLog.unshift(`Day ${state.day}: Pre-ordered ${qty} × ${p.name} for ${money(cost)}.`); }
  else { if(!state.inventory[id]) state.inventory[id]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:unit}; const inv=state.inventory[id],oldQty=inv.qty,oldCost=(inv.avgCost||p.wholesale)*oldQty; inv.qty+=qty; inv.avgCost=roundMoney((oldCost+cost)/Math.max(1,inv.qty)); if(!state.placements[id]) state.placements[id]='main'; state.eventLog.unshift(`Day ${state.day}: Ordered ${qty} × ${p.name} for ${money(cost)}.`); }
  saveState(); closeSheet(); render(); toast(pre?`${qty} × ${p.name} committed`:`${qty} × ${p.name} ordered`);
}
function renderProducts(){
  const owned=Object.keys(state.inventory).map(getProduct).filter(p=>p&&(state.inventory[p.id]?.qty||0)>0).sort((a,b)=>placementFactor(b.id)-placementFactor(a.id)||state.market[b.id].hype-state.market[a.id].hype);
  screen.innerHTML=`<section class="section"><div class="merch-overview"><div><span>✨ FRONT WINDOW</span><b>${placementCount('window')}/3</b></div><div><span>🎯 ENTRANCE FEATURE</span><b>${placementCount('feature')}/4</b></div><div><span>📦 CAPACITY</span><b>${inventoryUsed()+preorderUnits()}/${inventoryCapacity()}</b></div></div><div class="section-head"><div><h2>Your Products</h2><p>Pricing + shelf placement jointly determine sales.</p></div></div>${owned.length?owned.map(p=>inventoryRow(p)).join(''):`<div class="empty"><div class="emoji">📦</div><h3>Your shelves are empty</h3><p>Order products from the Market.</p><button class="primary-btn" onclick="switchTab('market')">OPEN MARKET</button></div>`}</section>`;
}
function inventoryRow(p){
  const inv=state.inventory[p.id],m=state.market[p.id],margin=inv.price-(inv.avgCost||p.wholesale),pl=shelfPlacements[state.placements[p.id]||'main'],life=lifecycleFor(p);
  return `<div class="inventory-row" style="${brandStyle(p)}" onclick="openPriceSheet('${p.id}')"><div class="inventory-thumb">${packageArt(p,true)}</div><div><div class="inventory-tags"><span>${pl.icon} ${pl.name}</span><span>${life.icon} ${life.name}</span></div><h3>${p.name}</h3><p>${getBrand(p.brand).name} · ${heat(m.hype)} ${hypeLabel(m.hype)}</p><p><strong>${money(inv.price)}</strong> · <span class="${margin>=0?'profit':'loss'}">${margin>=0?'+':''}${money(margin)}/unit</span> · ${inv.soldToday||0} sold</p></div><div class="stock-pill">${inv.qty} left</div></div>`;
}
function openPriceSheet(id){
  const p=getProduct(id),inv=state.inventory[id],m=state.market[id],rivalPrices=rivalTemplates.map(r=>state.rivals[r.id].prices[id]).filter(Boolean).sort((a,b)=>a-b),low=rivalPrices[0]||p.rrp,current=state.placements[id]||'main';
  sheetContent.innerHTML=`<div class="sheet-art package-sheet" style="${brandStyle(p)}">${packageArt(p,false)}</div><div class="brand-name">${getBrand(p.brand).name} · ${lifecycleFor(p).icon} ${lifecycleFor(p).name}</div><h2>${p.name}</h2><div class="metrics"><div class="metric"><span>Your Stock</span><strong>${inv.qty}</strong></div><div class="metric"><span>Sold Last Day</span><strong>${inv.soldToday||0}</strong></div><div class="metric"><span>Buzz</span><strong>${heat(m.hype)} ${hypeLabel(m.hype)}</strong></div></div><label class="field-label" for="priceInput">Your shelf price</label><input id="priceInput" class="price-input" type="number" min="1" step="0.50" value="${inv.price.toFixed(2)}"/><div class="button-row"><button class="secondary-btn" onclick="setPricePreset('${id}',${p.rrp})">RRP ${money(p.rrp)}</button><button class="secondary-btn" onclick="setPricePreset('${id}',${low})">MATCH ${money(low)}</button></div><div class="divider"></div><div class="field-label">Shelf placement · directly changes visibility</div><div class="placement-grid">${Object.entries(shelfPlacements).map(([key,x])=>`<button class="placement-btn ${current===key?'active':''}" onclick="setPlacement('${id}','${key}')"><span>${x.icon}</span><b>${x.name}</b><small>${key==='window'?'+45% sales visibility':key==='feature'?'+25% sales visibility':key==='back'?'−32% visibility':'Normal visibility'}</small></button>`).join('')}</div><button class="primary-btn wide" style="margin-top:10px" onclick="savePrice('${id}')">SAVE PRODUCT SETUP</button><p class="small-note">Average unit cost ${money(inv.avgCost||p.wholesale)} · Lowest rival ${money(low)}.</p>`; openSheet();
}
function setPlacement(id,key){
  const def=shelfPlacements[key]; if(!def) return; if(placementCount(key,id)>=def.capacity) return toast(`${def.name} is full`); state.placements[id]=key; saveState(); openPriceSheet(id); toast(`Moved to ${def.name}`);
}
function savePrice(id){ const value=parseFloat(document.getElementById('priceInput').value); if(!Number.isFinite(value)||value<=0)return toast('Enter a valid price'); state.inventory[id].price=roundMoney(value); saveState(); closeSheet(); render(); toast(`Product setup saved`); }
function openProductInfo(id){
  const p=getProduct(id),m=state.market[id],life=lifecycleFor(p),sup=supplierFor(p),rs=rivalTemplates.filter(r=>(state.rivals[r.id].inventory?.[id]||0)>0);
  sheetContent.innerHTML=`<div class="sheet-art package-sheet" style="${brandStyle(p)}">${packageArt(p,false)}</div><div class="market-tag-row"><span class="lifecycle-chip ${life.key}">${life.icon} ${life.name}</span><span class="supplier-chip">${sup.icon} ${sup.name}</span></div><h2>${p.name}</h2><p>${marketInsight(p)}</p><div class="metrics"><div class="metric"><span>Quality</span><strong>${p.quality}/100</strong></div><div class="metric"><span>Scarcity</span><strong>${p.scarcity}/100</strong></div><div class="metric"><span>Rivals Holding</span><strong>${rs.length}/4</strong></div></div><div class="commit-warning">The visible hype score is not the true demand curve. Reviews, launch reception and word-of-mouth can still move this product sharply.</div><button class="primary-btn wide" onclick="closeSheet();openBuySheet('${id}')">${p.launchDay>state.day?'PRE-ORDER':'ORDER STOCK'}</button>`; openSheet();
}
function renderRivals(){
  screen.innerHTML=`<section class="section"><div class="section-head"><div><h2>Local Rivals</h2><p>Each rival now holds inventory, prices it and reacts to the market.</p></div></div>${rivalTemplates.map(r=>rivalCard(r)).join('')}</section>`;
}
function rivalCard(r){
  const s=state.rivals[r.id], holdings=Object.entries(s.inventory||{}).filter(([,q])=>q>0).sort((a,b)=>b[1]-a[1]), top=holdings[0]?getProduct(holdings[0][0]):null;
  return `<article class="rival-card premium-rival"><div class="rival-banner" style="--rival-grad:${r.grad};background:${r.grad}">${rivalStorefront(r)}<div class="rival-overlay"><div><div class="kicker">${r.strategy}</div><h3>${r.name}</h3></div><div class="rival-share-badge">${s.share.toFixed(0)}%<small>SHARE</small></div></div></div><div class="rival-body"><div class="rival-meta"><div class="metric"><span>Market Share</span><strong>${s.share.toFixed(0)}%</strong></div><div class="metric"><span>Stock Units</span><strong>${holdings.reduce((a,x)=>a+x[1],0)}</strong></div><div class="metric"><span>Last Sales</span><strong>${money(s.lastSales||0)}</strong></div></div>${top?`<div class="rival-holding"><span>BIGGEST POSITION</span><b>${top.name}</b><small>${holdings[0][1]} units · ${money(s.prices[top.id])}</small></div>`:''}<div class="activity rival-activity"><span>LIVE</span><b>${s.activity}</b></div><div class="button-row" style="margin-top:10px"><button class="secondary-btn" onclick="compareRival('${r.id}')">COMPARE PRICES</button><button class="primary-btn" onclick="counterRival('${r.id}')">RUN PROMO</button></div></div></article>`;
}
function renderEmpire(){
  const net=state.cash+inventoryValue(),nextTarget=50000,progress=clamp(net/nextTarget*100,0,100);
  screen.innerHTML=`<section class="empire-hero"><div class="kicker">YOUR COMPANY · ${gameDate().label}</div><h2>Build leverage, not just shelves.</h2><p>Supplier relationships, franchise displays and store upgrades now shape the economics of every order.</p><div class="divider"></div><div class="metrics"><div class="metric"><span>Net Worth</span><strong>${money(net)}</strong></div><div class="metric"><span>Lifetime Sales</span><strong>${money(state.totalRevenue)}</strong></div><div class="metric"><span>Market Share</span><strong>${state.marketShare.toFixed(1)}%</strong></div></div><div class="field-label">Next milestone · ${money(nextTarget)}</div><div class="progress"><span style="width:${progress}%"></span></div></section><section class="section"><div class="section-head"><div><h2>Supplier Relationships</h2><p>Ordering consistently earns better wholesale pricing.</p></div></div>${Object.values(supplierTemplates).map(s=>supplierCard(s)).join('')}</section><section class="section"><div class="section-head"><div><h2>Franchise Displays</h2><p>Permanent branded displays boost that franchise by 18%.</p></div></div><div class="display-grid">${Object.entries(displayDefs).map(([brand,d])=>displayCard(brand,d)).join('')}</div></section><section class="section"><div class="section-head"><div><h2>Store Upgrades</h2><p>Permanent improvements to your first location</p></div></div>${upgrades.map(u=>upgradeCard(u)).join('')}</section><section class="section"><button class="secondary-btn wide" onclick="showLog()">VIEW EVENT HISTORY</button><button class="danger-btn wide" style="margin-top:9px" onclick="resetGame()">RESET LOCAL SAVE</button><p class="small-note">v${VERSION} · Local-first GitHub Pages save.</p></section>`;
}
function supplierCard(s){ const x=state.suppliers[s.id], discount=Math.max(0,(x.relationship-45)*.18); return `<div class="supplier-card"><div class="supplier-icon">${s.icon}</div><div><h3>${s.name}</h3><p>${s.desc}</p><div class="supplier-rel"><span>${x.relationship.toFixed(0)}/100 relationship · up to ${discount.toFixed(1)}% buying discount</span><div><i style="width:${x.relationship}%"></i></div></div></div><strong>${money(x.totalSpend||0)}<small>spent</small></strong></div>`; }
function displayCard(brand,d){ const b=brands[brand],owned=!!state.displays[brand]; return `<div class="display-card" style="--display-grad:${b.grad}"><div class="display-art" style="background:${b.grad}"><span>${b.glyph}</span></div><div><h3>${d.name}</h3><p>${b.name} sales visibility +18%</p></div><button class="${owned?'secondary-btn':'primary-btn'}" ${owned?'disabled':''} onclick="buyDisplay('${brand}')">${owned?'BUILT':money(d.cost)}</button></div>`; }
function buyDisplay(brand){ const d=displayDefs[brand]; if(state.displays[brand])return; if(state.cash<d.cost)return toast('Not enough cash for this display'); state.cash-=d.cost; state.displays[brand]=true; state.eventLog.unshift(`Day ${state.day}: Built ${d.name}.`); saveState(); renderEmpire(); toast(`${d.name} installed`); }
function processPreorders(){
  const delivered=[]; Object.entries({...state.preorders}).forEach(([id,x])=>{ const p=getProduct(id); if(p.launchDay>state.day)return; if(!state.inventory[id])state.inventory[id]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:roundMoney((x.cost||0)/Math.max(1,x.qty))}; const inv=state.inventory[id],oldQty=inv.qty,oldCost=(inv.avgCost||p.wholesale)*oldQty,incomingCost=x.cost||((x.unitCost||p.wholesale)*x.qty); inv.qty+=x.qty; inv.avgCost=roundMoney((oldCost+incomingCost)/Math.max(1,inv.qty)); if(!state.placements[id])state.placements[id]='main'; delivered.push(`${x.qty} × ${p.name}`); delete state.preorders[id]; state.eventLog.unshift(`Day ${state.day}: Launch delivery arrived — ${x.qty} × ${p.name}.`); }); return delivered;
}
function simulateCustomers(){
  const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0); owned.forEach(id=>state.inventory[id].soldToday=0);
  let traffic=Math.round(58*(1+state.upgrades.marketing*.06)*(0.9+state.rating/10)*seasonFactor()); traffic+=Math.round((Math.random()-.5)*15); traffic=Math.max(20,traffic);
  state.customersToday=traffic; state.todaySales=0; state.todayProfit=0;
  owned.forEach(id=>{ const p=getProduct(id),inv=state.inventory[id],m=state.market[id],competitorLow=Math.min(...rivalTemplates.map(r=>state.rivals[r.id].prices[id]||9999)),priceRatio=inv.price/p.rrp,life=lifecycleFor(p);
    let priceScore=priceRatio<=.8?1.42:priceRatio<=1?1.13:priceRatio<=1.15?(.99-(priceRatio-1)*.7):Math.max(.20,1-(priceRatio-1)*2.25); if(inv.price>competitorLow*1.12)priceScore*=.70;
    const appeal=(m.hype*.56+p.quality*.24+p.scarcity*.10+m.potential*.10)/100; let expected=traffic*(appeal*.105)*priceScore*life.factor*placementFactor(id)*displayFactor(p); expected*=.74+Math.random()*.52;
    const sold=Math.min(inv.qty,Math.max(0,Math.round(expected))); inv.qty-=sold; inv.soldToday=sold; inv.totalSold=(inv.totalSold||0)+sold; const revenue=sold*inv.price,profit=sold*(inv.price-(inv.avgCost||p.wholesale)); inv.lastProfit=profit; state.todaySales+=revenue; state.todayProfit+=profit; state.cash+=revenue; state.totalRevenue+=revenue; state.totalProfit+=profit;
  });
  ['todaySales','todayProfit','cash','totalRevenue','totalProfit'].forEach(k=>state[k]=roundMoney(state[k])); const gouged=owned.filter(id=>state.inventory[id].price>getProduct(id).rrp*1.35&&state.market[id].hype<82).length,service=state.upgrades.service||0; state.rating=clamp(state.rating+(gouged?-.045*gouged:.012+service*.005)+(Math.random()-.5)*.02,2.8,5); state.marketShare=clamp(state.marketShare+(state.todayProfit>900?.16:-.04)+(Math.random()-.5)*.14,4,65);
}
function simulateMarket(){
  products.forEach(p=>{ const m=state.market[p.id],life=lifecycleFor(p); let change=(m.potential-m.hype)*.10+(Math.random()-.5)*7+m.trend*.30;
    if(life.key==='launch' && p.launchDay===state.day){ const reviewShock=Math.round((Math.random()-.46)*34); m.potential=clamp(m.potential+reviewShock,15,99); change+=reviewShock*.45; }
    if(life.key==='peak')change+=1.3; if(life.key==='decline')change-=1.1; if(life.key==='clearance')change-=1.8; if(gameDate().month==='December'&&m.potential>62)change+=2.2;
    m.hype=clamp(Math.round(m.hype+change),15,99); m.trend=clamp(Math.round(change/2),-5,5); m.buzz=hypeLabel(m.hype).toLowerCase();
  });
}
function simulateRivals(){
  rivalTemplates.forEach(r=>{ const s=state.rivals[r.id], inv=s.inventory||(s.inventory={}), candidates=products.filter(p=>p.launchDay<=state.day+4), ranked=[...candidates].sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype), target=r.id==='trend'?ranked[0]:r.id==='collector'?ranked.find(p=>p.scarcity>65)||ranked[0]:rand(ranked.slice(0,12)), m=state.market[target.id], life=lifecycleFor(target);
    // sell existing stock
    let rev=0; Object.entries(inv).forEach(([id,q])=>{ if(q<=0)return; const p=getProduct(id),h=state.market[id].hype,pr=s.prices[id]||p.rrp; const units=Math.min(q,Math.max(0,Math.round((h/100)*2.5*seasonFactor()*(.7+Math.random()*.7)))); inv[id]-=units; rev+=units*pr; }); s.lastSales=roundMoney(rev); s.cash=roundMoney(s.cash+rev);
    // buy strategically
    if((m.hype>58||r.id==='mega')&&(state.supplierStock[target.id]||0)>0){ let want=r.id==='mega'?8+Math.floor(Math.random()*14):r.id==='trend'?10+Math.floor(Math.random()*16):r.id==='collector'?4+Math.floor(target.scarcity/15):4+Math.floor(Math.random()*8); if(life.key==='clearance')want=Math.floor(want*.35); const take=Math.min(state.supplierStock[target.id]||0,want); if(take>0){ state.supplierStock[target.id]-=take; inv[target.id]=(inv[target.id]||0)+take; s.cash-=take*target.wholesale; } }
    if(r.id==='mega'&&weightedChance(65)){ s.prices[target.id]=roundMoney(target.rrp*(.78+Math.random()*.13)); s.activity=`Price war: cut ${target.name} to ${money(s.prices[target.id])} while holding ${inv[target.id]||0} units.`; }
    else if(r.id==='collector'&&m.hype>72){ s.prices[target.id]=roundMoney(target.rrp*(1.14+Math.random()*.24)); s.activity=`Collector premium: ${target.name} at ${money(s.prices[target.id])}; ${inv[target.id]||0} units held.`; }
    else if(r.id==='trend'){ s.prices[target.id]=roundMoney(target.rrp*(.96+Math.random()*.14)); s.activity=`Chased ${target.name}; now holding ${inv[target.id]||0} units.`; }
    else { s.prices[target.id]=roundMoney(target.rrp*(.92+Math.random()*.11)); s.activity=`Featured ${getBrand(target.brand).name} and adjusted ${target.name} to ${money(s.prices[target.id])}.`; }
    if(weightedChance(r.rumor)){ const rumorTarget=rand(ranked.slice(0,10)); const hit=3+Math.floor(Math.random()*7); state.market[rumorTarget.id].hype=clamp(state.market[rumorTarget.id].hype-hit,15,99); s.activity=`Unverified rumour is circulating about ${rumorTarget.name}. Buzz fell ${hit} points.`; }
    s.share=clamp(s.share+(rev>2500?.16:-.02)+(Math.random()-.5)*.45,5,38);
  });
}
function maybeMajorEvent(){
  if(state.day%4!==0&&!weightedChance(20))return null; const p=rand(products.filter(x=>x.launchDay<=state.day+2)),good=weightedChance(56);
  if(good){ const boost=10+Math.floor(Math.random()*18); state.market[p.id].potential=clamp(state.market[p.id].potential+Math.floor(boost*.65),15,99); state.market[p.id].hype=clamp(state.market[p.id].hype+boost,15,99); state.market[p.id].trend=5; state.eventLog.unshift(`Day ${state.day}: ${p.name} hype surged.`); return {icon:getBrand(p.brand).glyph,title:`${p.name} EXPLODES`,body:`Word-of-mouth has broken through. Demand jumped ${boost} points and rivals are scrambling for stock.`}; }
  const drop=11+Math.floor(Math.random()*17); state.market[p.id].potential=clamp(state.market[p.id].potential-Math.floor(drop*.7),15,99); state.market[p.id].hype=clamp(state.market[p.id].hype-drop,15,99); state.market[p.id].trend=-5; state.eventLog.unshift(`Day ${state.day}: ${p.name} hype collapsed.`); return {icon:'📉',title:'HYPE CRASH',body:`${p.name} took a major hit. Buzz fell ${drop} points; heavy stockholders may need to mark it down.`};
}
function replenishSuppliers(){ products.forEach(p=>{ let add=Math.floor(Math.random()*7); if(state.market[p.id].hype>85)add=Math.floor(add*.3); if(lifecycleFor(p).key==='clearance')add+=3; state.supplierStock[p.id]=clamp((state.supplierStock[p.id]||0)+add,0,150); }); }
function buildDaySummary(completedDay){
  const sold=Object.entries(state.inventory).map(([id,x])=>({p:getProduct(id),sold:x.soldToday||0,profit:x.lastProfit||0})).sort((a,b)=>b.sold-a.sold), best=sold[0], worst=[...sold].sort((a,b)=>a.sold-b.sold)[0], trend=[...products].sort((a,b)=>state.market[b.id].trend-state.market[a.id].trend)[0];
  return {day:completedDay,date:gameDate(completedDay).label,sales:state.todaySales,profit:state.todayProfit,customers:state.customersToday,best:best?.p?.name||'No sales',bestQty:best?.sold||0,worst:worst?.p?.name||'—',worstQty:worst?.sold||0,trend:trend?.name||'—',trendMove:state.market[trend?.id]?.trend||0};
}
function showDaySummary(summary,event,deliveries=[]){
  splash.innerHTML=`<div class="day-summary"><div class="day-summary-top"><span class="kicker">${summary.date.toUpperCase()} COMPLETE</span><h2>${summary.profit>=0?'Strong trading day.':'A tough day at the tills.'}</h2><p>${seasonName(summary.day)} · ${summary.customers} customers visited.</p></div><div class="day-summary-grid"><div><span>SALES</span><b>${money(summary.sales)}</b></div><div><span>OPERATING PROFIT</span><b class="${summary.profit>=0?'profit':'loss'}">${money(summary.profit)}</b></div><div><span>BEST SELLER</span><b>${summary.best}</b><small>${summary.bestQty} sold</small></div><div><span>SLOWEST</span><b>${summary.worst}</b><small>${summary.worstQty} sold</small></div></div><div class="summary-news"><div><span>📈 MARKET</span><b>${summary.trend}</b><small>Momentum ${summary.trendMove>=0?'+':''}${summary.trendMove}</small></div>${deliveries.length?`<div><span>🚚 LAUNCH DELIVERY</span><b>${deliveries.join(', ')}</b><small>Now available to merchandise</small></div>`:''}${event?`<div class="major"><span>${event.icon} MARKET EVENT</span><b>${event.title}</b><small>${event.body}</small></div>`:''}</div><button class="primary-btn wide" onclick="closeSplash()">START ${gameDate(state.day).label.toUpperCase()} →</button></div>`; splash.classList.remove('hidden');
}
function endDay(){
  const completed=state.day; simulateCustomers(); simulateMarket(); simulateRivals(); const event=maybeMajorEvent(),summary=buildDaySummary(completed); state.lastSummary=summary; state.day++; const deliveries=processPreorders(); replenishSuppliers(); saveState(); showDaySummary(summary,event,deliveries);
}

function inventoryValue(){ return Object.entries(state.inventory).reduce((a,[id,x])=>a+x.qty*(x.avgCost||getProduct(id).wholesale),0); }

/* ==========================================================================
   v0.4 — Store Operations + Customer Experience
   Staff, queues, shop-floor stock, customer archetypes, baskets, satisfaction,
   shrinkage, maintenance and visible facilities.
   ========================================================================== */
function ensureV04State(s){
  s.staff=s.staff||{cashier:1,floor:1,stock:1,manager:0};
  Object.keys(staffDefs).forEach(k=>{ if(!Number.isFinite(s.staff[k])) s.staff[k]=k==='manager'?0:1; });
  s.facilities=s.facilities||{}; s.openHours=s.openHours||8; s.storeCondition=Number.isFinite(s.storeCondition)?s.storeCondition:92;
  s.satisfaction=Number.isFinite(s.satisfaction)?s.satisfaction:78; s.shrinkageTotal=s.shrinkageTotal||0; s.giftWrapRevenue=s.giftWrapRevenue||0;
  s.lastOps=s.lastOps||{queueLost:0,shrinkage:0,wages:0,avgBasket:0,conversion:0,stockouts:0,persona:{}};
  Object.entries(s.inventory||{}).forEach(([id,inv])=>{ const p=getProduct(id); if(!p)return; if(!Number.isFinite(inv.shelfQty)) inv.shelfQty=Math.min(inv.qty,shelfCapacityFor(id)); });
  return s;
}
const _v03MigrateState=migrateState;
migrateState=function(s){ return ensureV04State(_v03MigrateState(s)); };
const _v03FreshState=freshState;
freshState=function(){ return ensureV04State(_v03FreshState()); };
state=ensureV04State(state);
function shelfCapacityFor(id){
  const place=state?.placements?.[id]||'main';
  return place==='window'?8:place==='feature'?10:place==='back'?5:7;
}
function staffEfficiency(){ return 1+(state.staff.manager||0)*.12; }
function checkoutLanes(){ return 1+(state.facilities.checkout2?1:0); }
function checkoutCapacity(){ return Math.round(checkoutLanes()*Math.max(1,state.staff.cashier||0)*(34+(state.facilities.lighting?2:0))*staffEfficiency()*(state.openHours/8)); }
function stockerCapacity(){ return Math.round((state.staff.stock||0)*42*staffEfficiency()); }
function payrollCost(){ return Object.entries(staffDefs).reduce((a,[k,d])=>a+(state.staff[k]||0)*d.wage*(state.openHours/8),0); }
function trafficCeiling(){ return state.facilities.biggerfloor?190:135; }
function customerTypePick(){
  const entries=Object.entries(customerTypes), total=entries.reduce((a,[,x])=>a+x.weight,0); let roll=Math.random()*total;
  for(const [k,x] of entries){ roll-=x.weight; if(roll<=0)return k; } return 'parent';
}
function operatingHealth(){
  const staffNeed=Math.max(1,(state.customersToday||60)/55), floorCover=(state.staff.floor||0)/staffNeed;
  return clamp((state.storeCondition*.38)+(state.satisfaction*.38)+(state.rating/5*100*.24)+Math.min(8,floorCover*4),0,100);
}
function facilityBadges(){
  return Object.entries(state.facilities).filter(([,v])=>v).map(([id])=>`<span>${facilityDefs[id]?.icon||'✓'} ${facilityDefs[id]?.name||id}</span>`).join('');
}
function renderStoreWorld(owned,chatter,hottest){
  const shelf=owned.slice(0,6), fallback=products.filter(p=>p.launchDay<=state.day).slice(0,6), stock=shelf.length?shelf:fallback;
  const shopperCount=clamp(Math.round((state.lastOps?.served||state.customersToday||48)/22),3,7);
  const shoppers=Array.from({length:shopperCount},(_,i)=>{ const bubble=i<2&&chatter[i]?`<div class="shopper-bubble">${chatter[i].text}</div>`:''; return `<div class="shopper shopper-${i+1}">${bubble}<i class="shopper-head"></i><i class="shopper-body"></i><i class="shopper-arm left"></i><i class="shopper-arm right"></i><i class="shopper-leg left"></i><i class="shopper-leg right"></i></div>`; }).join('');
  const queueDots=Math.min(5,Math.max(1,Math.round((state.lastOps?.queueLost||0)/5)+1));
  return `<div class="store-world ${state.facilities.lighting?'facility-lighting':''} ${state.facilities.biggerfloor?'facility-expanded':''}">
    <div class="store-ceiling"><i></i><i></i><i></i>${state.facilities.security?'<b class="security-camera">📹</b>':''}</div>
    <div class="store-back-wall"><div class="store-logo-sign"><span>TOY</span><b>STORE</b><small>TYCOON</small></div><div class="launch-poster" style="${brandStyle(hottest)}" onclick="openBuySheet('${hottest.id}')"><span>HOT DROP</span>${packageArt(hottest,true)}<strong>${hottest.name}</strong></div><div class="service-sign">⭐ ${state.rating.toFixed(1)}<small>${Math.round(state.satisfaction)}% HAPPY</small></div></div>
    <div class="store-floor">
      <div class="shelf-wall shelf-left">${stock.slice(0,3).map(p=>{const inv=state.inventory[p.id],q=inv?.shelfQty||0;return `<div class="shelf-product ${q<=1?'shelf-empty':''}" style="${brandStyle(p)}" onclick="${inv?`openPriceSheet('${p.id}')`:`openBuySheet('${p.id}')`}">${q?packageArt(p,true):'<div class="empty-hook">SOLD<br>OUT</div>'}<span>${q} shelf</span></div>`}).join('')}<div class="shelf-plank"></div></div>
      <div class="shelf-wall shelf-right">${stock.slice(3,6).map(p=>{const inv=state.inventory[p.id],q=inv?.shelfQty||0;return `<div class="shelf-product ${q<=1?'shelf-empty':''}" style="${brandStyle(p)}" onclick="${inv?`openPriceSheet('${p.id}')`:`openBuySheet('${p.id}')`}">${q?packageArt(p,true):'<div class="empty-hook">SOLD<br>OUT</div>'}<span>${q} shelf</span></div>`}).join('')}<div class="shelf-plank"></div></div>
      ${state.facilities.collector?'<div class="collector-cabinet">💎<small>COLLECTORS</small></div>':''}
      ${state.facilities.demozone?'<div class="demo-zone">🎮<small>TRY ME!</small></div>':''}
      ${state.facilities.giftwrap?'<div class="gift-wrap-station">🎁<small>GIFT WRAP</small></div>':''}
      <div class="checkout ${checkoutLanes()>1?'checkout-double':''}"><div class="register">▰</div>${checkoutLanes()>1?'<div class="register second">▰</div>':''}<div class="counter-sign">CHECKOUT</div><div class="shopping-bag">T</div>${Array.from({length:queueDots},(_,i)=>`<i class="queue-dot q${i}"></i>`).join('')}</div>
      <div class="delivery-cart"><div>📦</div><span>${inventoryUsed()} total</span></div>${shoppers}
    </div><div class="store-glow"></div></div>`;
}
function operationsPanel(){
  const o=state.lastOps||{}, wages=payrollCost(), cond=Math.round(state.storeCondition), sat=Math.round(state.satisfaction);
  return `<section class="section"><div class="section-head"><div><h2>🏬 Store Operations</h2><p>The floor now affects what actually reaches the till.</p></div><button onclick="switchTab('empire')">Manage</button></div>
  <div class="ops-grid"><div class="ops-card"><span>😊 SATISFACTION</span><b>${sat}%</b><div class="mini-meter"><i style="width:${sat}%"></i></div></div><div class="ops-card"><span>🧹 CONDITION</span><b>${cond}%</b><div class="mini-meter"><i style="width:${cond}%"></i></div></div><div class="ops-card"><span>🧾 CHECKOUT</span><b>${checkoutCapacity()}</b><small>basket capacity/day</small></div><div class="ops-card"><span>👥 PAYROLL</span><b>${money(wages)}</b><small>per trading day</small></div></div>
  ${o.queueLost?`<div class="operation-alert warn">⚠️ <b>${o.queueLost} baskets abandoned</b> because checkout queues were too long last day.</div>`:''}
  ${o.stockouts?`<div class="operation-alert">📦 <b>${o.stockouts} shelf stockouts</b> restricted sales. Add stockroom crew or move more stock onto shelves.</div>`:''}
  ${facilityBadges()?`<div class="facility-badges">${facilityBadges()}</div>`:''}</section>`;
}
function renderStore(){
  const hottest=products.filter(p=>p.launchDay<=state.day+5).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype)[0], owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0).map(getProduct), front=[...owned].sort((a,b)=>(placementFactor(b.id)*state.market[b.id].hype)-(placementFactor(a.id)*state.market[a.id].hype)).slice(0,6), chatter=getChatter(), preorderCount=preorderUnits();
  screen.innerHTML=`<section class="store-world-wrap">${renderStoreWorld(front,chatter,hottest)}<div class="store-command-card"><div><span class="kicker">${gameDate().label.toUpperCase()} · ${seasonName()}</span><h2>${state.lastSummary?'Your team is ready for another day.':'Your first store is ready to trade.'}</h2><p>${state.lastSummary?`${state.lastSummary.customers} visitors · ${money(state.lastSummary.sales)} sales last day.`:'Keep shelves full, queues moving and customers happy.'}</p></div><button class="primary-btn next-day-btn" onclick="endDay()">TRADE TODAY <b>→</b></button></div></section>
  <section class="section">${calendarBanner()}</section>${operationsPanel()}
  ${preorderCount?`<section class="section"><div class="preorder-strip" onclick="switchTab('market')"><span>🚚</span><div><b>${preorderCount} pre-order units committed</b><small>Cash is tied up · deliveries arrive on launch day.</small></div><strong>VIEW →</strong></div></section>`:''}
  <section class="section"><div class="section-head"><div><h2>💬 Customer Intelligence</h2><p>Real shoppers are your earliest market research.</p></div></div>${chatter.map(c=>`<div class="chatter"><span>${c.avatar}</span><div><b>“${c.text}”</b><small>${c.note}</small></div></div>`).join('')}</section>
  <section class="section"><div class="section-head"><div><h2>🔥 Hot on Your Shelves</h2><p>Tap a toy to adjust price and merchandising.</p></div><button onclick="switchTab('products')">All stock</button></div><div class="rail">${front.length?front.map(p=>miniProductCard(p,'inventory')).join(''):'<div class="empty">Order stock from the Market.</div>'}</div></section>`;
}
function staffCard(k){ const d=staffDefs[k], count=state.staff[k]||0; return `<div class="staff-card"><div><span class="staff-icon">${d.icon}</span><h3>${d.name} · ${count}</h3><p>${d.desc}</p><small>${money(d.wage)}/day each</small></div><div class="staff-controls"><button onclick="changeStaff('${k}',-1)" ${count<=(k==='manager'?0:1)?'disabled':''}>−</button><b>${count}</b><button onclick="changeStaff('${k}',1)">+</button></div></div>`; }
function facilityCard(id){ const d=facilityDefs[id], owned=!!state.facilities[id]; return `<div class="upgrade-card"><div><h3>${d.icon} ${d.name}</h3><p>${d.desc}</p></div><button class="${owned?'secondary-btn':'primary-btn'}" ${owned?'disabled':''} onclick="buyFacility('${id}')">${owned?'INSTALLED':money(d.cost)}</button></div>`; }
function renderEmpire(){
  const net=state.cash+inventoryValue(), progress=clamp(net/50000*100,0,100);
  screen.innerHTML=`<section class="empire-hero"><div class="kicker">YOUR COMPANY · STORE #1</div><h2>Run the floor like a retailer.</h2><p>Market instincts get stock through the door. Operations turn that stock into loyal customers and profit.</p><div class="divider"></div><div class="metrics"><div class="metric"><span>Net Worth</span><strong>${money(net)}</strong></div><div class="metric"><span>Satisfaction</span><strong>${Math.round(state.satisfaction)}%</strong></div><div class="metric"><span>Market Share</span><strong>${state.marketShare.toFixed(1)}%</strong></div></div><div class="field-label">Next milestone · $50,000</div><div class="progress"><span style="width:${progress}%"></span></div></section>
  <section class="section"><div class="section-head"><div><h2>👥 Your Team</h2><p>Daily wages are deducted after every trading day.</p></div></div>${Object.keys(staffDefs).map(staffCard).join('')}</section>
  <section class="section"><div class="section-head"><div><h2>🕒 Opening Hours</h2><p>Longer days create more traffic but also increase wages and wear.</p></div></div><div class="hours-picker">${[8,10,12].map(h=>`<button class="${state.openHours===h?'active':''}" onclick="setOpenHours(${h})">${h} HOURS</button>`).join('')}</div></section>
  <section class="section"><div class="section-head"><div><h2>🏗️ Visible Store Improvements</h2><p>These upgrades alter both simulation performance and the shop scene.</p></div></div>${Object.keys(facilityDefs).map(facilityCard).join('')}</section>
  <section class="section"><div class="section-head"><div><h2>🧹 Maintenance</h2><p>Condition ${Math.round(state.storeCondition)}% · poor condition reduces satisfaction and traffic.</p></div><button onclick="performMaintenance()">SERVICE · $450</button></div><div class="mini-meter large"><i style="width:${state.storeCondition}%"></i></div></section>
  <section class="section"><div class="section-head"><div><h2>Existing Business Upgrades</h2></div></div>${upgrades.map(u=>upgradeCard(u)).join('')}</section>
  <section class="section"><button class="secondary-btn wide" onclick="showLog()">VIEW EVENT HISTORY</button><button class="danger-btn wide" style="margin-top:9px" onclick="resetGame()">RESET LOCAL SAVE</button><p class="small-note">v${VERSION} · Save data is stored locally in this browser on this device.</p></section>`;
}
function changeStaff(k,delta){ const min=k==='manager'?0:1, next=clamp((state.staff[k]||0)+delta,min,5); if(next===state.staff[k])return; if(delta>0&&state.cash<staffDefs[k].hire)return toast('Not enough cash to hire'); if(delta>0){state.cash-=staffDefs[k].hire; state.eventLog.unshift(`Day ${state.day}: Hired an additional ${staffDefs[k].name.toLowerCase()}.`);} state.staff[k]=next; saveState(); renderEmpire(); toast(delta>0?'Staff member hired':'Staff member released'); }
function setOpenHours(h){ state.openHours=h; saveState(); renderEmpire(); toast(`${h}-hour trading day selected`); }
function buyFacility(id){ const d=facilityDefs[id]; if(state.facilities[id])return; if(state.cash<d.cost)return toast('Not enough cash'); state.cash-=d.cost; state.facilities[id]=true; if(id==='biggerfloor')state.reputation=clamp(state.reputation+4,0,100); state.eventLog.unshift(`Day ${state.day}: Installed ${d.name}.`); saveState(); renderEmpire(); toast(`${d.name} installed`); }
function performMaintenance(){ if(state.cash<450)return toast('Not enough cash'); state.cash-=450; state.storeCondition=clamp(state.storeCondition+18,0,100); state.eventLog.unshift(`Day ${state.day}: Store maintenance completed.`); saveState(); renderEmpire(); toast('Store condition improved'); }
function refillShelves(){
  let capacity=stockerCapacity(); const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0).sort((a,b)=>placementFactor(b)-placementFactor(a)); let stockouts=0;
  owned.forEach(id=>{ const inv=state.inventory[id], cap=shelfCapacityFor(id); if(!Number.isFinite(inv.shelfQty))inv.shelfQty=Math.min(inv.qty,cap); const need=Math.max(0,Math.min(cap,inv.qty)-inv.shelfQty), add=Math.min(need,capacity); inv.shelfQty+=add; capacity-=add; if(inv.shelfQty<=0&&inv.qty>0)stockouts++; }); return stockouts;
}
function simulateCustomers(){
  const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0&&getProduct(id).launchDay<=state.day); owned.forEach(id=>{const inv=state.inventory[id];inv.soldToday=0;inv.lastProfit=0;if(!Number.isFinite(inv.shelfQty))inv.shelfQty=Math.min(inv.qty,shelfCapacityFor(id));});
  refillShelves();
  let traffic=Math.round(58*(1+state.upgrades.marketing*.06)*(0.78+state.rating/8)*seasonFactor()*(state.openHours/8)); traffic=Math.round(traffic*(.82+state.storeCondition/500)*(state.facilities.biggerfloor?1.13:1)); traffic+=Math.round((Math.random()-.5)*13); traffic=clamp(traffic,18,trafficCeiling());
  const personaCounts={}; let baskets=[], stockouts=0, attemptedPurchases=0;
  const weightedProducts=()=>owned.filter(id=>state.inventory[id].shelfQty>0);
  for(let c=0;c<traffic;c++){
    const typeKey=customerTypePick(), type=customerTypes[typeKey]; personaCounts[typeKey]=(personaCounts[typeKey]||0)+1; const available=weightedProducts(); if(!available.length){stockouts++;continue;}
    const wants=1+(Math.random()<Math.min(.72,(type.basket-1)*.55)?1:0)+(Math.random()<Math.max(0,(type.basket-1)*.18)?1:0), basket=[];
    for(let n=0;n<wants;n++){
      const scored=available.map(id=>{const p=getProduct(id),inv=state.inventory[id],m=state.market[id],life=lifecycleFor(p),priceRatio=inv.price/p.rrp; let priceFit=priceRatio<=.85?1.3:priceRatio<=1?1.12:Math.max(.12,1-(priceRatio-1)*(2.35/type.price)); let score=(m.hype*.48+m.potential*.16+p.quality*.18*type.quality+p.scarcity*.12*type.scarcity)*priceFit*life.factor*placementFactor(id)*displayFactor(p); if(typeKey==='collector'&&state.facilities.collector)score*=1.24;if(typeKey==='kid'&&state.facilities.demozone)score*=1.18;if(typeKey==='impulse'&&state.facilities.lighting)score*=1.14; return {id,score:score*(.8+Math.random()*.4)};}).sort((a,b)=>b.score-a.score);
      const pick=scored[0]; if(!pick||pick.score<26)continue; const inv=state.inventory[pick.id]; if(inv.shelfQty<=0)continue; attemptedPurchases++; inv.shelfQty--; inv.qty--; basket.push(pick.id);
    }
    if(basket.length)baskets.push({type:typeKey,items:basket});
  }
  const capacity=checkoutCapacity(), queueLost=Math.max(0,baskets.length-capacity); if(queueLost>0){ const lost=baskets.splice(capacity); lost.forEach(b=>b.items.forEach(id=>{const inv=state.inventory[id];inv.qty++;inv.shelfQty=Math.min(shelfCapacityFor(id),inv.shelfQty+1);})); }
  state.todaySales=0;state.todayProfit=0;let itemCount=0,giftWrap=0;
  baskets.forEach(b=>{b.items.forEach(id=>{const p=getProduct(id),inv=state.inventory[id];inv.soldToday++;inv.totalSold=(inv.totalSold||0)+1; const rev=inv.price, prof=rev-(inv.avgCost||p.wholesale);inv.lastProfit+=prof;state.todaySales+=rev;state.todayProfit+=prof;state.cash+=rev;state.totalRevenue+=rev;state.totalProfit+=prof;itemCount++;}); if(state.facilities.giftwrap&&(b.type==='gift'||Math.random()<.12)){giftWrap+=4.5;}});
  if(giftWrap){state.todaySales+=giftWrap;state.todayProfit+=giftWrap;state.cash+=giftWrap;state.totalRevenue+=giftWrap;state.totalProfit+=giftWrap;state.giftWrapRevenue+=giftWrap;}
  const floorCover=Math.min(1.25,(state.staff.floor||0)*staffEfficiency()/Math.max(1,traffic/60)), baseShrink=Math.round(itemCount*(.025+Math.random()*.025)*(state.facilities.security?.28:1)*(floorCover<.75?1.55:1)); let shrinkage=0;
  if(baseShrink>0&&owned.length){ for(let i=0;i<baseShrink;i++){ const candidates=owned.filter(id=>state.inventory[id].qty>0); if(!candidates.length)break; const id=rand(candidates),inv=state.inventory[id];inv.qty--;inv.shelfQty=Math.min(inv.shelfQty,inv.qty);shrinkage+=(inv.avgCost||getProduct(id).wholesale); } state.cash-=shrinkage;state.todayProfit-=shrinkage;state.totalProfit-=shrinkage;state.shrinkageTotal+=shrinkage; }
  const wages=payrollCost();state.cash-=wages;state.todayProfit-=wages;state.totalProfit-=wages;
  const conversion=traffic?baskets.length/traffic:0, avgBasket=baskets.length?state.todaySales/baskets.length:0, queuePenalty=traffic?queueLost/traffic*42:0, conditionPenalty=Math.max(0,(78-state.storeCondition)*.18), serviceBoost=(state.staff.floor||0)*2.4*staffEfficiency()+(state.upgrades.service||0)*2+(state.staff.manager||0)*2.5+(state.facilities.giftwrap?1.5:0);
  const targetSat=clamp(68+serviceBoost-queuePenalty-conditionPenalty-stockouts*.25,25,98);state.satisfaction=clamp(state.satisfaction*.72+targetSat*.28,20,99); state.rating=clamp(state.rating+(state.satisfaction>80?.018:state.satisfaction<55?-.035:-.004)+(Math.random()-.5)*.015,2.7,5);state.storeCondition=clamp(state.storeCondition-(1.2+state.openHours*.08)*(state.facilities.biggerfloor?1.08:1)+(state.staff.manager||0)*.35,20,100);state.marketShare=clamp(state.marketShare+(conversion>.48?.13:-.05)+(state.satisfaction>82?.07:0)+(Math.random()-.5)*.10,4,65);
  state.customersToday=traffic;state.lastOps={queueLost,shrinkage:roundMoney(shrinkage),wages:roundMoney(wages),avgBasket:roundMoney(avgBasket),conversion:Math.round(conversion*100),stockouts,persona:personaCounts,served:baskets.length,items:itemCount,giftWrap:roundMoney(giftWrap)};
  ['todaySales','todayProfit','cash','totalRevenue','totalProfit','shrinkageTotal','giftWrapRevenue'].forEach(k=>state[k]=roundMoney(state[k]||0));
}
function simulateRivals(){
  const beforeShare=state.marketShare; const _stateSummary=state.lastOps; // retain v0.3 strategic rival simulation body through a compact equivalent
  rivalTemplates.forEach(r=>{const s=state.rivals[r.id],inv=s.inventory||(s.inventory={}),ranked=products.filter(p=>p.launchDay<=state.day+4).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype),target=r.id==='collector'?(ranked.find(p=>p.scarcity>70)||ranked[0]):ranked[Math.min(ranked.length-1,Math.floor(Math.random()*Math.min(10,ranked.length)))]; if(!target)return; let rev=0;Object.entries(inv).forEach(([id,q])=>{if(q<=0)return;const p=getProduct(id),units=Math.min(q,Math.max(0,Math.round(state.market[id].hype/45*seasonFactor()*(.7+Math.random()*.5))));inv[id]-=units;rev+=units*(s.prices[id]||p.rrp);});s.cash+=rev;s.lastSales=roundMoney(rev);const pressure=state.marketShare>22||beforeShare>22;let want=4+Math.floor(Math.random()*8);if(r.id==='mega')want+=6;if(r.id==='trend'&&state.market[target.id].hype>72)want+=8;const take=Math.min(state.supplierStock[target.id]||0,want);if(take>0){state.supplierStock[target.id]-=take;inv[target.id]=(inv[target.id]||0)+take;s.cash-=take*target.wholesale;}if(r.id==='mega'&&pressure){s.prices[target.id]=roundMoney(target.rrp*(.74+Math.random()*.1));s.activity=`RETALIATION SALE: undercut ${target.name} to ${money(s.prices[target.id])} after your market share climbed.`;}else if(r.id==='collector'){s.prices[target.id]=roundMoney(target.rrp*(1.12+Math.random()*.22));s.activity=`Secured scarce ${target.name}; ${inv[target.id]||0} units now held.`;}else if(r.id==='trend'){s.activity=`Copied your hot-category strategy and loaded up on ${target.name}.`;}else{s.activity=`Promoted ${getBrand(target.brand).name} to protect family traffic.`;}if(weightedChance(r.rumor+(pressure?8:0))){const rumor=ranked[0];state.market[rumor.id].hype=clamp(state.market[rumor.id].hype-(3+Math.floor(Math.random()*6)),15,99);s.activity=`A negative rumour about ${rumor.name} is circulating locally. Source unverified.`;}s.share=clamp(s.share+(rev>2200?.12:-.02)+(Math.random()-.5)*.3,5,38);});
}
function buildDaySummary(completedDay){
  const sold=Object.entries(state.inventory).map(([id,x])=>({p:getProduct(id),sold:x.soldToday||0,profit:x.lastProfit||0})).sort((a,b)=>b.sold-a.sold),best=sold[0],worst=[...sold].sort((a,b)=>a.sold-b.sold)[0],trend=[...products].sort((a,b)=>state.market[b.id].trend-state.market[a.id].trend)[0],o=state.lastOps||{};
  return {day:completedDay,date:gameDate(completedDay).label,sales:state.todaySales,profit:state.todayProfit,customers:state.customersToday,best:best?.p?.name||'No sales',bestQty:best?.sold||0,worst:worst?.p?.name||'—',worstQty:worst?.sold||0,trend:trend?.name||'—',trendMove:state.market[trend?.id]?.trend||0,ops:o,satisfaction:Math.round(state.satisfaction)};
}
function showDaySummary(summary,event,deliveries=[]){
  const o=summary.ops||{}; splash.innerHTML=`<div class="day-summary"><div class="day-summary-top"><span class="kicker">${summary.date.toUpperCase()} COMPLETE</span><h2>${summary.profit>=0?'The tills closed in the black.':'Operations dragged the day into the red.'}</h2><p>${summary.customers} visitors · ${summary.satisfaction}% satisfaction.</p></div><div class="day-summary-grid"><div><span>SALES</span><b>${money(summary.sales)}</b></div><div><span>NET DAY PROFIT</span><b class="${summary.profit>=0?'profit':'loss'}">${money(summary.profit)}</b></div><div><span>AVG BASKET</span><b>${money(o.avgBasket||0)}</b><small>${o.items||0} items sold</small></div><div><span>CONVERSION</span><b>${o.conversion||0}%</b><small>${o.served||0} baskets served</small></div></div><div class="summary-news"><div><span>👥 STAFF COST</span><b>-${money(o.wages||0)}</b><small>${state.openHours}-hour trading day</small></div>${o.queueLost?`<div class="major"><span>🧾 QUEUE LOSS</span><b>${o.queueLost} abandoned baskets</b><small>Add cashiers or a second checkout.</small></div>`:''}${o.shrinkage?`<div><span>🕵️ SHRINKAGE</span><b>-${money(o.shrinkage)}</b><small>Security and floor staff reduce losses.</small></div>`:''}${deliveries.length?`<div><span>🚚 DELIVERY</span><b>${deliveries.join(', ')}</b><small>Ready to merchandise.</small></div>`:''}${event?`<div class="major"><span>${event.icon} MARKET EVENT</span><b>${event.title}</b><small>${event.body}</small></div>`:''}</div><button class="primary-btn wide" onclick="closeSplash()">START ${gameDate(state.day).label.toUpperCase()} →</button></div>`;splash.classList.remove('hidden');
}
// Ensure launch deliveries receive usable shelf stock.
const _v03ProcessPreorders=processPreorders;
processPreorders=function(){const delivered=_v03ProcessPreorders();Object.entries(state.inventory).forEach(([id,inv])=>{if(!Number.isFinite(inv.shelfQty))inv.shelfQty=Math.min(inv.qty,shelfCapacityFor(id));});return delivered;};
window.changeStaff=changeStaff;window.setOpenHours=setOpenHours;window.buyFacility=buyFacility;window.performMaintenance=performMaintenance;
saveState();
