const VERSION = '0.7.0';
const SAVE_KEY = 'toyStoreTycoon.v0.7';
const LEGACY_SAVE_KEYS = ['toyStoreTycoon.v0.6','toyStoreTycoon.v0.5.3','toyStoreTycoon.v0.5.2','toyStoreTycoon.v0.5.1','toyStoreTycoon.v0.5','toyStoreTycoon.v0.4','toyStoreTycoon.v0.3','toyStoreTycoon.v0.2','toyStoreTycoon.v0.1'];

const brands = {
  gearmorph:{name:'GearMorph',glyph:'🤖',grad:'linear-gradient(145deg,#12c2e9,#7b4dff 52%,#ff4f87)',category:'Transforming Robots & Vehicles'},
  lumalife:{name:'Luma Life',glyph:'👗',grad:'linear-gradient(145deg,#ff75b5,#ffb45f 55%,#ffe66d)',category:'Fashion Dolls, Dreamhouses & Style'},
  starward:{name:'Starward Frontier',glyph:'🚀',grad:'linear-gradient(145deg,#162b6f,#4a6fff 55%,#5de7ff)',category:'Space Saga Figures, Ships & Playsets'},
  pocketbeasts:{name:'Pocket Beasts',glyph:'🐲',grad:'linear-gradient(145deg,#53d88b,#30c9ba 50%,#ffe454)',category:'Collectible Creatures & Battle Sets'},
  mythicforge:{name:'Mythic Forge',glyph:'⚔️',grad:'linear-gradient(145deg,#56338e,#9a51da 52%,#ff826d)',category:'Fantasy Warriors, Beasts & Castles'},
  nitrostreet:{name:'Nitro Street',glyph:'🏎️',grad:'linear-gradient(145deg,#ff3b30,#ff8c00 52%,#ffd60a)',category:'Die-cast Cars, Tracks & Garages'},
  littleworld:{name:'Little World',glyph:'🧸',grad:'linear-gradient(145deg,#54c7ec,#68e0cf 55%,#ffda79)',category:'Preschool Vehicles, Plush & Playsets'},
  ultraleague:{name:'Ultra League',glyph:'🦸',grad:'linear-gradient(145deg,#e52d27,#b31217 52%,#5b2cff)',category:'Superheroes, Villains & Vehicles'}
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

function packPalette(p){
  const palettes={
    gearmorph:[['#ff4b55','#143968','#68f4ff','#0b1327'],['#ff9f2f','#3a1a78','#62e9ff','#161126'],['#7aff7a','#26477a','#f7ec58','#071a28'],['#f74aff','#17366a','#50f8ff','#120c22']],
    lumalife:[['#ff66ae','#8a57ff','#ffe05e','#fff5fb'],['#ff8c72','#ff4fb1','#74dcff','#fff6ee'],['#9b72ff','#ff78c5','#a6ffdd','#fff8ff'],['#ff5f8d','#ffb44e','#8ee6ff','#fff6f2']],
    starward:[['#47d9ff','#3158ff','#ffda65','#07112d'],['#ff5d80','#465cff','#70f5ff','#080d25'],['#7dffdb','#254ba8','#ffd25f','#07152d'],['#b475ff','#2356ff','#55eaff','#080b21']],
    pocketbeasts:[['#62dc77','#1fb6a1','#ffe15f','#f5fff2'],['#ff8f59','#42cf8f','#fff06b','#f7fff0'],['#68a7ff','#5ce0b7','#ffdc67','#f2fffb'],['#c475ff','#43d7a2','#ffe673','#fbf6ff']],
    mythicforge:[['#8e58d8','#3b275d','#ff9a62','#171021'],['#547eea','#27335e','#9cf2ff','#0f1327'],['#cf5353','#44245f','#ffd16a','#1d1017'],['#58bca4','#33255b','#ffa86c','#101b1b']],
    nitrostreet:[['#ff3c35','#15191f','#ffd34d','#08090d'],['#ff8a18','#252029','#68e8ff','#0b0c10'],['#46c9ff','#15253b','#ff506d','#080b10'],['#b6ff35','#1c2023','#ff5b39','#090b0c']],
    littleworld:[['#59c9f2','#ffca59','#ff7c9e','#fff9ea'],['#62dbb4','#ffbe4e','#7aa6ff','#f7fff8'],['#ffab68','#62cfe4','#8cd97a','#fff8ed'],['#ac8eff','#67dbd0','#ffd469','#faf6ff']],
    ultraleague:[['#ef3f49','#2546b8','#ffd94f','#111534'],['#8a53ff','#ef3d71','#6ff4ff','#160d2d'],['#ff6a35','#273dc1','#ffe45d','#111535'],['#35c3ff','#5231aa','#ff527a','#0d1530']]
  };
  const arr=palettes[p.brand]; return arr[productNumber(p)%arr.length];
}
function brandLogoMarkup(brand){
  return `<img class="brand-logo-asset" src="assets/brands/${brand}.svg" alt="${getBrand(brand).name}">`;
}
function productFeature(p){
  const name=p.name.toLowerCase();
  if(p.brand==='gearmorph') return name.includes('duo')?'2 FIGURE TEAM':name.includes('hauler')||name.includes('convoy')?'VEHICLE ⇄ MECH':'TRANSFORMS • 12 STEPS';
  if(p.brand==='lumalife') return name.includes('roadster')?'FASHION ROADSTER':name.includes('house')||name.includes('playset')?'DOLL + PLAYSET':'STYLE + STORY';
  if(p.brand==='starward') return name.includes('playset')?'GALACTIC PLAYSET':name.includes('figure')||name.includes('captain')?'5.5” ACTION FIGURE':'FLEET SERIES';
  if(p.brand==='pocketbeasts') return name.includes('egg')?'MYSTERY CREATURE INSIDE':name.includes('arena')?'BATTLE + DISPLAY':'COLLECT • TRAIN • DISCOVER';
  if(p.brand==='mythicforge') return name.includes('castle')?'FORTRESS PLAYSET':name.includes('wyvern')?'WINGED BEAST SERIES':'LEGENDS AWAKEN';
  if(p.brand==='nitrostreet') return name.includes('track')||name.includes('garage')?'STUNT CITY SYSTEM':name.includes('hauler')?'RACE TRANSPORTER':'DIE-CAST SPEED SERIES';
  if(p.brand==='littleworld') return name.includes('bear')?'SOFT FRIEND COLLECTION':'PLAY • LEARN • IMAGINE';
  return name.includes('tower')?'HERO HQ PLAYSET':name.includes('bike')?'VEHICLE + HERO':'POWER SERIES';
}
function packAge(p){ return p.brand==='littleworld'?'3+':p.brand==='nitrostreet'?'5+':p.brand==='lumalife'?'6+':p.brand==='pocketbeasts'?'6+':'8+'; }
function toySvgWrap(body,p,view='0 0 160 140'){
  return `<svg class="toy-svg" viewBox="${view}" aria-hidden="true" focusable="false">${body}</svg>`;
}
function toyVisual(p){
  const [a,b,c,d]=packPalette(p), n=productNumber(p)%6, name=p.name.toLowerCase();
  const shadow=`<ellipse cx="80" cy="126" rx="48" ry="8" fill="rgba(0,0,0,.16)"/>`;
  if(p.brand==='gearmorph'){
    const robot=(x=0,scale=1)=>`<g transform="translate(${x} 2) scale(${scale})"><path d="M47 50 L59 33 L101 33 L114 51 L108 81 L96 87 L92 119 L72 119 L68 88 L54 81 Z" fill="${b}" stroke="${d}" stroke-width="4"/><path d="M60 37 L69 20 L91 20 L101 37 L94 49 L66 49 Z" fill="${a}" stroke="${d}" stroke-width="4"/><rect x="70" y="29" width="20" height="6" rx="3" fill="${c}"/><path d="M62 53 L80 45 L99 53 L92 78 L69 78 Z" fill="${a}"/><circle cx="80" cy="61" r="9" fill="${c}" stroke="white" stroke-width="3"/><path d="M48 54 L30 67 L36 92 L49 84" fill="${a}" stroke="${d}" stroke-width="4"/><path d="M112 54 L130 67 L124 92 L109 84" fill="${a}" stroke="${d}" stroke-width="4"/><path d="M70 85 L61 118 L76 121 L82 91" fill="${b}" stroke="${d}" stroke-width="4"/><path d="M91 85 L99 118 L84 121 L79 91" fill="${b}" stroke="${d}" stroke-width="4"/>${name.includes('hauler')||name.includes('convoy')?`<circle cx="43" cy="86" r="9" fill="#151922" stroke="${c}" stroke-width="3"/><circle cx="116" cy="86" r="9" fill="#151922" stroke="${c}" stroke-width="3"/>`:''}${name.includes('talon')?`<path d="M53 51 L20 32 L34 70 Z" fill="${c}" stroke="${d}" stroke-width="3"/><path d="M106 51 L139 32 L126 70 Z" fill="${c}" stroke="${d}" stroke-width="3"/>`:''}${name.includes('saber')?`<path d="M125 68 L145 21" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path d="M123 69 L145 21" stroke="white" stroke-width="2" stroke-linecap="round"/>`:''}</g>`;
    return toySvgWrap(`${shadow}${name.includes('duo')?robot(-22,.78)+robot(42,.78):robot()}`,p);
  }
  if(p.brand==='lumalife'){
    const doll=(x=0,accent=a)=>`<g transform="translate(${x} 0)"><circle cx="80" cy="39" r="17" fill="#eeb995"/><path d="M62 39 Q62 13 80 13 Q105 14 99 49 Q93 31 64 39" fill="${b}"/><path d="M72 58 Q80 51 89 58 L99 94 L63 94 Z" fill="${accent}"/><path d="M63 91 L98 91 L110 113 L52 113 Z" fill="${c}"/><path d="M69 112 L67 127 M92 112 L94 127" stroke="#d6997a" stroke-width="7" stroke-linecap="round"/><circle cx="74" cy="38" r="2" fill="#472f38"/><circle cx="87" cy="38" r="2" fill="#472f38"/><path d="M76 47 Q81 51 86 47" fill="none" stroke="#d15f72" stroke-width="2"/></g>`;
    if(name.includes('roadster')) return toySvgWrap(`${shadow}<path d="M24 84 Q36 64 61 64 H106 Q127 66 139 86 L133 106 H26 Z" fill="${a}" stroke="${b}" stroke-width="5"/><path d="M57 65 L73 48 H105 L119 66" fill="#c8f6ff" stroke="${b}" stroke-width="4"/><circle cx="49" cy="106" r="13" fill="#29233a"/><circle cx="116" cy="106" r="13" fill="#29233a"/>${doll(12,c).replace('translate(12 0)','translate(18 -19) scale(.55)')}`,p);
    if(name.includes('dreamhouse')) return toySvgWrap(`${shadow}<path d="M29 116 V49 L79 19 L132 50 V116 Z" fill="#fff0f8" stroke="${a}" stroke-width="6"/><path d="M20 51 L79 11 L140 51" fill="none" stroke="${b}" stroke-width="9"/><rect x="42" y="60" width="29" height="25" rx="4" fill="${c}"/><rect x="89" y="59" width="25" height="57" rx="4" fill="${a}"/><circle cx="108" cy="88" r="3" fill="#fff"/>${doll(-42).replace('translate(-42 0)','translate(-42 35) scale(.58)')}`,p);
    if(name.includes('wardrobe')) return toySvgWrap(`${shadow}<rect x="27" y="31" width="63" height="89" rx="9" fill="${b}" stroke="${a}" stroke-width="5"/><rect x="34" y="39" width="49" height="73" rx="5" fill="#fff8fc"/><path d="M45 54 H74 M58 54 V99" stroke="${c}" stroke-width="4"/><path d="M47 66 L58 58 L70 66 L66 88 H50 Z" fill="${a}"/>${doll(44).replace('translate(44 0)','translate(42 13) scale(.76)')}`,p);
    if(name.includes('twin')) return toySvgWrap(`${shadow}${doll(-30,a).replace('translate(-30 0)','translate(-30 5) scale(.82)')}${doll(32,c).replace('translate(32 0)','translate(32 5) scale(.82)')}`,p);
    if(name.includes('beach')) return toySvgWrap(`${shadow}<path d="M29 104 H136" stroke="#e7c779" stroke-width="16"/><path d="M112 28 V101" stroke="${b}" stroke-width="5"/><path d="M81 43 Q112 7 145 43 Z" fill="${a}"/><rect x="102" y="87" width="26" height="17" rx="4" fill="${c}"/>${doll(-34).replace('translate(-34 0)','translate(-34 15) scale(.83)')}`,p);
    return toySvgWrap(`${shadow}${doll()}`,p);
  }
  if(p.brand==='starward'){
    if(name.includes('figure')||name.includes('captain')) return toySvgWrap(`${shadow}<g><circle cx="80" cy="29" r="15" fill="#d39b7c"/><path d="M65 44 H95 L104 91 L91 99 L90 124 H74 L71 99 L57 91 Z" fill="${b}" stroke="${d}" stroke-width="4"/><path d="M66 48 L80 61 L94 48 L99 71 L80 83 L61 71 Z" fill="${a}"/><path d="M58 55 L39 78 M102 55 L124 80" stroke="${c}" stroke-width="9" stroke-linecap="round"/><rect x="72" y="22" width="17" height="5" rx="2" fill="${c}"/>${name.includes('captain')?`<path d="M95 47 L117 39 L109 92 L99 86" fill="${a}" opacity=".8"/>`:''}</g>`,p);
    if(name.includes('outpost')) return toySvgWrap(`${shadow}<path d="M35 112 V54 L55 39 H105 L125 55 V112" fill="${b}" stroke="${c}" stroke-width="5"/><rect x="67" y="24" width="27" height="73" rx="5" fill="${a}"/><circle cx="80" cy="46" r="10" fill="${c}"/><path d="M23 112 H138" stroke="${a}" stroke-width="10"/><path d="M19 52 L47 67 M140 52 L112 67" stroke="${c}" stroke-width="5"/>`,p);
    const shipWide=name.includes('cruiser');
    return toySvgWrap(`${shadow}<g transform="translate(0 ${shipWide?3:8})"><path d="M18 78 L66 55 L81 21 L96 55 L143 79 L106 89 L92 119 H69 L55 89 Z" fill="${b}" stroke="${d}" stroke-width="5"/><path d="M67 57 L81 31 L95 57 L104 78 L58 78 Z" fill="${a}"/><path d="M30 79 L9 100 L58 93" fill="${c}"/><path d="M132 79 L151 100 L104 93" fill="${c}"/><ellipse cx="81" cy="59" rx="11" ry="18" fill="#bdf6ff"/>${shipWide?`<rect x="42" y="67" width="78" height="16" rx="8" fill="${a}"/><circle cx="49" cy="84" r="5" fill="${c}"/><circle cx="112" cy="84" r="5" fill="${c}"/>`:''}${name.includes('speeder')?`<path d="M47 73 L26 54 M116 73 L139 53" stroke="${a}" stroke-width="8"/>`:''}</g>`,p);
  }
  if(p.brand==='pocketbeasts'){
    if(name.includes('egg')) return toySvgWrap(`${shadow}<path d="M80 17 Q117 34 117 78 Q117 119 80 123 Q43 118 43 78 Q43 34 80 17 Z" fill="${a}" stroke="${b}" stroke-width="6"/><path d="M49 67 Q80 48 111 67" fill="none" stroke="${c}" stroke-width="7"/><circle cx="80" cy="74" r="14" fill="${c}"/><path d="M74 74 L80 65 L87 74 L80 83 Z" fill="${b}"/>`,p);
    if(name.includes('arena')) return toySvgWrap(`${shadow}<ellipse cx="80" cy="101" rx="61" ry="25" fill="${b}" stroke="${a}" stroke-width="6"/><ellipse cx="80" cy="98" rx="42" ry="15" fill="${c}"/><path d="M34 87 L22 47 L46 59 M126 87 L139 47 L115 58" stroke="${a}" stroke-width="8"/><circle cx="64" cy="74" r="16" fill="${a}"/><circle cx="99" cy="76" r="15" fill="#ff885d"/>`,p);
    const beast=(x=0,scale=1,col=a)=>`<g transform="translate(${x} 0) scale(${scale})"><ellipse cx="80" cy="83" rx="30" ry="32" fill="${col}" stroke="${b}" stroke-width="5"/><circle cx="80" cy="49" r="25" fill="${col}" stroke="${b}" stroke-width="5"/><path d="M61 33 L52 14 L72 28 M98 32 L108 13 L91 28" fill="${c}" stroke="${b}" stroke-width="4"/><circle cx="71" cy="47" r="5" fill="white"/><circle cx="89" cy="47" r="5" fill="white"/><circle cx="72" cy="48" r="2" fill="#17252c"/><circle cx="90" cy="48" r="2" fill="#17252c"/><path d="M74 61 Q80 66 87 60" fill="none" stroke="${b}" stroke-width="3"/><path d="M109 81 Q142 75 128 50" fill="none" stroke="${b}" stroke-width="9" stroke-linecap="round"/>${name.includes('moonhorn')?`<path d="M79 28 L86 5 L91 30" fill="${c}" stroke="${b}" stroke-width="3"/>`:''}${name.includes('drake')?`<path d="M53 70 L27 55 L43 84 M107 70 L134 55 L118 85" fill="${c}" stroke="${b}" stroke-width="4"/>`:''}</g>`;
    if(name.includes('5-pack')) return toySvgWrap(`${shadow}${[-48,-24,0,24,48].map((x,i)=>beast(x,.42,[a,c,'#ff8a68','#6aa8ff','#d27aff'][i])).join('')}`,p);
    return toySvgWrap(`${shadow}${beast()}`,p);
  }
  if(p.brand==='mythicforge'){
    if(name.includes('castle')) return toySvgWrap(`${shadow}<path d="M25 120 V54 H48 V35 H65 V53 H96 V34 H114 V53 H136 V120 Z" fill="${b}" stroke="${d}" stroke-width="5"/><path d="M69 120 V83 Q80 67 94 83 V120" fill="#17111f"/><path d="M35 45 V24 M124 44 V21" stroke="${a}" stroke-width="9"/><path d="M35 25 L57 32 L35 40 M124 22 L103 29 L124 36" fill="${c}"/>`,p);
    if(name.includes('wyvern')) return toySvgWrap(`${shadow}<path d="M75 42 Q93 27 108 45 L104 64 Q119 76 119 97 Q101 92 91 80 L81 118 L65 117 L69 82 Q47 97 28 92 Q35 69 57 60 L57 45 Z" fill="${a}" stroke="${d}" stroke-width="5"/><path d="M62 58 L29 37 L50 75 M99 58 L132 35 L111 76" fill="${c}" stroke="${b}" stroke-width="4"/><path d="M75 41 L82 17 L88 43" fill="${c}"/>`,p);
    if(name.includes('siege')) return toySvgWrap(`${shadow}<rect x="35" y="66" width="89" height="44" rx="8" fill="${b}" stroke="${d}" stroke-width="5"/><circle cx="50" cy="111" r="15" fill="#372b38" stroke="${a}" stroke-width="5"/><circle cx="111" cy="111" r="15" fill="#372b38" stroke="${a}" stroke-width="5"/><path d="M33 73 L124 52 L141 59 L126 69 L34 87" fill="${a}"/><path d="M50 64 L61 39 H102 L114 61" fill="none" stroke="${c}" stroke-width="7"/>`,p);
    const warrior=(x=0,scale=1)=>`<g transform="translate(${x} 0) scale(${scale})"><circle cx="80" cy="31" r="14" fill="#d49a78"/><path d="M63 45 L96 45 L104 88 L90 96 L89 122 H71 L69 96 L56 88 Z" fill="${b}" stroke="${d}" stroke-width="4"/><path d="M62 48 L80 58 L97 48 L93 74 L80 82 L66 74 Z" fill="${a}"/><circle cx="47" cy="69" r="17" fill="${c}" stroke="${d}" stroke-width="4"/><path d="M111 84 L132 31" stroke="${c}" stroke-width="6"/><path d="M127 28 L139 17" stroke="${a}" stroke-width="5"/>${name.includes('wolf')?`<path d="M67 24 L61 8 L73 18 M93 24 L100 8 L89 18" fill="${c}"/>`:''}</g>`;
    if(name.includes('twin')) return toySvgWrap(`${shadow}${warrior(-34,.78)}${warrior(37,.78)}`,p);
    return toySvgWrap(`${shadow}${warrior()}`,p);
  }
  if(p.brand==='nitrostreet'){
    const car=(x=0,y=0,scale=1,col=a)=>`<g transform="translate(${x} ${y}) scale(${scale})"><path d="M30 84 Q39 61 65 57 H103 Q119 61 132 84 L128 101 H29 Z" fill="${col}" stroke="${d}" stroke-width="5"/><path d="M62 60 L75 45 H103 L115 63" fill="#bceeff" stroke="${b}" stroke-width="4"/><path d="M43 82 H120" stroke="${c}" stroke-width="5"/><circle cx="49" cy="102" r="12" fill="#17191c" stroke="${c}" stroke-width="3"/><circle cx="111" cy="102" r="12" fill="#17191c" stroke="${c}" stroke-width="3"/></g>`;
    if(name.includes('loop')) return toySvgWrap(`${shadow}<circle cx="82" cy="67" r="47" fill="none" stroke="${a}" stroke-width="13"/><circle cx="82" cy="67" r="28" fill="none" stroke="${c}" stroke-width="4"/>${car(23,52,.55,b)}`,p);
    if(name.includes('10-pack')) return toySvgWrap(`${shadow}${[0,1,2,3,4].map(i=>car(-46+(i%3)*46,4+Math.floor(i/3)*42,.42,[a,b,c,'#7d64ff','#65dc78'][i])).join('')}`,p);
    if(name.includes('twin')) return toySvgWrap(`${shadow}${car(-26,-9,.75,a)}${car(36,35,.65,c)}`,p);
    if(name.includes('hauler')) return toySvgWrap(`${shadow}<rect x="22" y="55" width="94" height="48" rx="8" fill="${b}" stroke="${d}" stroke-width="5"/><path d="M116 68 H139 L145 89 V103 H113 Z" fill="${a}" stroke="${d}" stroke-width="5"/><rect x="35" y="66" width="63" height="9" rx="4" fill="${c}"/><circle cx="48" cy="107" r="13" fill="#16181c"/><circle cx="116" cy="107" r="13" fill="#16181c"/>${car(-8,12,.42,c)}`,p);
    if(name.includes('garage')) return toySvgWrap(`${shadow}<path d="M27 113 V43 H132 V113" fill="${b}" stroke="${d}" stroke-width="5"/><path d="M28 67 H131 M28 90 H131" stroke="${c}" stroke-width="7"/><path d="M41 43 V28 H118 V43" stroke="${a}" stroke-width="9"/>${car(-30,19,.42,a)}${car(17,42,.42,c)}`,p);
    return toySvgWrap(`${shadow}${car()}`,p);
  }
  if(p.brand==='littleworld'){
    if(name.includes('bus')) return toySvgWrap(`${shadow}<rect x="25" y="45" width="111" height="62" rx="15" fill="${a}" stroke="${b}" stroke-width="5"/><rect x="38" y="55" width="69" height="25" rx="7" fill="#dffaff"/><rect x="112" y="56" width="14" height="36" rx="5" fill="${c}"/><circle cx="48" cy="108" r="13" fill="#47545f"/><circle cx="114" cy="108" r="13" fill="#47545f"/><circle cx="61" cy="68" r="8" fill="#ffc39d"/><circle cx="85" cy="68" r="8" fill="#8b5d43"/>`,p);
    if(name.includes('bear')) return toySvgWrap(`${shadow}<circle cx="80" cy="70" r="38" fill="#d8a56e"/><circle cx="55" cy="39" r="15" fill="#d8a56e"/><circle cx="105" cy="39" r="15" fill="#d8a56e"/><circle cx="69" cy="65" r="4" fill="#3a302c"/><circle cx="91" cy="65" r="4" fill="#3a302c"/><ellipse cx="80" cy="78" rx="13" ry="10" fill="#f1c99b"/><path d="M76 78 L80 82 L84 78" fill="none" stroke="#3b2f2a" stroke-width="3"/><path d="M48 98 Q80 124 112 98" fill="${c}"/>`,p);
    if(name.includes('farm')) return toySvgWrap(`${shadow}<path d="M35 117 V61 L80 31 L125 61 V117 Z" fill="#f6f0d5" stroke="${a}" stroke-width="5"/><path d="M28 63 L80 26 L133 63" fill="none" stroke="#e8584c" stroke-width="11"/><rect x="67" y="81" width="27" height="36" fill="#db6c48"/><circle cx="44" cy="90" r="11" fill="#fff" stroke="${b}" stroke-width="4"/><circle cx="116" cy="90" r="11" fill="#f0d2ad" stroke="${b}" stroke-width="4"/>`,p);
    if(name.includes('builder')) return toySvgWrap(`${shadow}<rect x="33" y="86" width="83" height="30" rx="7" fill="${c}" stroke="${b}" stroke-width="5"/><circle cx="50" cy="118" r="12" fill="#53616b"/><circle cx="103" cy="118" r="12" fill="#53616b"/><path d="M80 84 V36 H94 V82 M87 40 L128 58" stroke="${a}" stroke-width="9"/><path d="M128 58 L119 74" stroke="${b}" stroke-width="6"/>`,p);
    if(name.includes('kitchen')) return toySvgWrap(`${shadow}<rect x="31" y="35" width="98" height="82" rx="8" fill="#fff7e4" stroke="${a}" stroke-width="5"/><rect x="42" y="49" width="33" height="26" rx="5" fill="${c}"/><circle cx="101" cy="63" r="13" fill="#c8e9f8"/><rect x="45" y="84" width="69" height="27" rx="5" fill="${b}"/><circle cx="57" cy="92" r="4" fill="${a}"/><circle cx="72" cy="92" r="4" fill="${a}"/>`,p);
    if(name.includes('market')) return toySvgWrap(`${shadow}<path d="M33 119 V55 H126 V119" fill="#fff6df" stroke="${b}" stroke-width="5"/><path d="M25 55 H135 L125 34 H36 Z" fill="${a}"/><path d="M38 35 V55 M58 35 V55 M78 35 V55 M98 35 V55 M118 35 V55" stroke="#fff" stroke-width="7"/><rect x="48" y="76" width="62" height="12" rx="4" fill="${c}"/><circle cx="59" cy="73" r="7" fill="#ff6969"/><circle cx="81" cy="73" r="7" fill="#6fd47c"/><circle cx="103" cy="73" r="7" fill="#f2bd45"/>`,p);
    return toySvgWrap(`${shadow}<circle cx="80" cy="68" r="35" fill="${a}"/><circle cx="61" cy="53" r="8" fill="white"/><circle cx="99" cy="53" r="8" fill="white"/><path d="M59 84 Q80 101 102 84" fill="none" stroke="${b}" stroke-width="6"/>`,p);
  }
  // Ultra League
  if(name.includes('tower')) return toySvgWrap(`${shadow}<path d="M49 121 L59 37 L80 18 L102 38 L113 121 Z" fill="${b}" stroke="${d}" stroke-width="5"/><path d="M80 18 V119" stroke="${a}" stroke-width="8"/><path d="M56 64 H105 M53 91 H109" stroke="${c}" stroke-width="5"/><circle cx="80" cy="46" r="10" fill="${c}"/><path d="M73 46 L80 36 L88 46 L80 57 Z" fill="${a}"/>`,p);
  if(name.includes('bike')) return toySvgWrap(`${shadow}<circle cx="48" cy="99" r="24" fill="none" stroke="${b}" stroke-width="8"/><circle cx="116" cy="99" r="24" fill="none" stroke="${b}" stroke-width="8"/><path d="M48 99 L72 66 L95 99 H48 L84 99 L107 68" fill="none" stroke="${a}" stroke-width="8"/><circle cx="84" cy="46" r="10" fill="#d49b7b"/><path d="M75 55 L96 56 L105 78 L82 83 L69 69 Z" fill="${c}"/>`,p);
  const hero=(x=0,scale=1,col=a)=>`<g transform="translate(${x} 0) scale(${scale})"><circle cx="80" cy="28" r="14" fill="#d9a07f"/><path d="M64 42 H96 L104 84 L91 93 L89 122 H72 L70 94 L57 85 Z" fill="${col}" stroke="${d}" stroke-width="4"/><path d="M62 47 L80 58 L97 47 L92 74 L80 84 L67 74 Z" fill="${b}"/><path d="M59 49 L42 84 M101 49 L120 84" stroke="${col}" stroke-width="9" stroke-linecap="round"/><path d="M96 45 Q128 52 116 103 L99 88" fill="${b}" opacity=".9"/><path d="M75 58 L80 50 L86 58 L80 69 Z" fill="${c}"/></g>`;
  if(name.includes('3-pack')) return toySvgWrap(`${shadow}${hero(-45,.62,a)}${hero(0,.72,b)}${hero(47,.62,c)}`,p);
  return toySvgWrap(`${shadow}${hero()}`,p);
}
function packageArt(p,compact=false){
  const meta=typeof v05ProductMeta==='function'?v05ProductMeta(p):null;
  return `<div class="real-package ${compact?'compact':''} brand-${p.brand}" style="${brandStyle(p)}">
    <img src="assets/products/${p.id}.webp" alt="${p.name} toy package" loading="lazy" draggable="false">
    ${meta?.limited?`<span class="real-pack-limited">LIMITED</span>`:''}
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
   Staff, queues, baskets, shelf restocking, shrinkage, cleanliness and visible
   store improvements. These declarations intentionally override v0.3 where
   needed while preserving its market, supplier and rival systems.
   ========================================================================== */

function v04StaffRoles(){
  return {
    cashier:{name:'Cashier',icon:'🧾',wage:145,checkout:34,service:4,restock:0,security:0,desc:'Keeps checkout queues moving.'},
    floor:{name:'Floor Assistant',icon:'🙋',wage:128,checkout:4,service:12,restock:5,security:7,desc:'Helps shoppers, tidies displays and deters theft.'},
    stock:{name:'Stockroom',icon:'📦',wage:136,checkout:0,service:2,restock:24,security:2,desc:'Gets deliveries onto shelves before demand is lost.'},
    manager:{name:'Store Manager',icon:'🎧',wage:198,checkout:10,service:10,restock:10,security:5,desc:'Boosts the whole team and stabilises busy days.'}
  };
}
function v04UpgradeDefs(){
  return {
    secondCheckout:{name:'Second Checkout',icon:'🧾',cost:4800,desc:'+42 transactions/day before queues bite.'},
    lighting:{name:'Premium Lighting',icon:'💡',cost:3200,desc:'+6% traffic and a brighter premium store.'},
    collectorCabinet:{name:'Collector Cabinet',icon:'💎',cost:4300,desc:'+28% collector appeal on scarce products.'},
    demoZone:{name:'Demo Play Zone',icon:'🎮',cost:5600,desc:'+10% traffic; kids and impulse shoppers linger longer.'},
    security:{name:'Security Cameras',icon:'📹',cost:3600,desc:'Cuts shoplifting and damaged-stock losses by 70%.'},
    giftWrap:{name:'Gift Wrap Counter',icon:'🎁',cost:2400,desc:'Adds profitable gift wrap and lifts gift-buyer satisfaction.'},
    biggerFloor:{name:'Expand Shop Floor',icon:'🏗️',cost:8800,desc:'+12% traffic, larger shelf targets and +2 staff capacity.'}
  };
}
function v04CustomerTypes(){
  return [
    {id:'parent',name:'Parents',icon:'👩‍👦',weight:30,price:.82,quality:1.18,hype:.95,scarcity:.88,basket:1.6,service:1.15},
    {id:'kid',name:'Kids',icon:'🧒',weight:18,price:.72,quality:.90,hype:1.30,scarcity:1.00,basket:1.35,service:.75},
    {id:'collector',name:'Collectors',icon:'🧔',weight:15,price:1.05,quality:1.05,hype:1.05,scarcity:1.55,basket:1.45,service:.88},
    {id:'bargain',name:'Bargain Hunters',icon:'🏷️',weight:14,price:1.35,quality:.80,hype:.72,scarcity:.65,basket:1.25,service:.70},
    {id:'gift',name:'Gift Buyers',icon:'🎁',weight:18,price:.92,quality:1.16,hype:1.02,scarcity:.95,basket:2.05,service:1.18},
    {id:'impulse',name:'Impulse Shoppers',icon:'✨',weight:5,price:.76,quality:.82,hype:1.18,scarcity:1.05,basket:1.85,service:.62}
  ];
}
function v04StaffNames(){ return ['Mia','Noah','Sophie','Liam','Ruby','Jack','Ava','Leo','Zoe','Ethan','Chloe','Max','Isla','Oscar','Maya','Finn','Ella','Arlo','Lucy','Kai']; }
function v04MakeStaff(role,idx=0){
  const defs=v04StaffRoles(), d=defs[role], names=v04StaffNames();
  return {id:`S${Date.now().toString(36)}${idx}${Math.floor(Math.random()*900+100)}`,name:names[(state?.staff?.nextId||idx)%names.length],role,skill:58+Math.floor(Math.random()*25),service:54+Math.floor(Math.random()*30),fatigue:8+Math.floor(Math.random()*9),days:0,wage:d.wage};
}
function v04DefaultOperations(){
  return {hours:10,cleanliness:88,maintenance:90,security:0,secondCheckout:0,lighting:0,collectorCabinet:0,demoZone:0,giftWrap:0,biggerFloor:0,lastDeepCleanDay:0};
}
function v04DefaultCustomerStats(){
  return {buyers:0,transactions:0,basketUnits:0,avgBasket:0,abandoned:0,queuePeak:0,satisfaction:78,giftWraps:0,shrinkUnits:0,shrinkCost:0,wages:0,maintenanceCost:0,grossProfit:0,restocked:0,stockoutMisses:0,types:{}};
}
function v04StaffCapacity(){ return 6 + (state.operations?.biggerFloor?2:0); }
function v04HoursFactor(){ return state.operations.hours===8?.88:state.operations.hours===12?1.18:1; }
function v04WageFactor(){ return state.operations.hours===8?.84:state.operations.hours===12?1.22:1; }
function v04Team(){ return state.staff?.team||[]; }
function v04RoleCount(role){ return v04Team().filter(s=>s.role===role).length; }
function v04StaffPerf(staff){ return clamp((staff.skill||60)/70 * (1-(staff.fatigue||0)*.004),.55,1.4); }
function v04ManagerBoost(){ return 1 + Math.min(.16,v04RoleCount('manager')*.08); }
function v04CheckoutCapacity(){
  const defs=v04StaffRoles(); let cap=34; // owner can always serve a few customers
  v04Team().forEach(s=>{ cap += defs[s.role].checkout*v04StaffPerf(s); });
  if(state.operations.secondCheckout) cap+=42;
  return Math.round(cap*v04ManagerBoost());
}
function v04RestockCapacity(){
  const defs=v04StaffRoles(); let cap=12;
  v04Team().forEach(s=>{ cap += defs[s.role].restock*v04StaffPerf(s); });
  return Math.round(cap*v04ManagerBoost());
}
function v04ServiceScore(){
  const defs=v04StaffRoles(); let score=48+(state.upgrades.service||0)*7;
  v04Team().forEach(s=>{ score += defs[s.role].service*v04StaffPerf(s); });
  if(state.operations.giftWrap) score+=3;
  return clamp(score,35,100);
}
function v04SecurityScore(){
  const defs=v04StaffRoles(); let score=12;
  v04Team().forEach(s=>{ score += defs[s.role].security*v04StaffPerf(s); });
  if(state.operations.security) score+=48;
  return clamp(score,0,100);
}
function v04ShelfTarget(id){
  const place=state.placements?.[id]||'main';
  let target=place==='window'?6:place==='feature'?7:place==='back'?4:8;
  if(state.operations?.biggerFloor) target+=2;
  return target;
}
function v04ShelfUnits(){ return Object.values(state.inventory).reduce((a,x)=>a+Math.min(x.qty||0,x.shelfQty||0),0); }
function v04StockroomUnits(){ return Math.max(0,inventoryUsed()-v04ShelfUnits()); }
function v04EnsureShelf(inv,id){ if(!Number.isFinite(inv.shelfQty)) inv.shelfQty=Math.min(inv.qty||0,v04ShelfTarget(id)); inv.shelfQty=clamp(inv.shelfQty,0,inv.qty||0); }
function v04RestockShelves(){
  let capacity=v04RestockCapacity(), moved=0;
  const ids=Object.keys(state.inventory).filter(id=>(state.inventory[id]?.qty||0)>0).sort((a,b)=>placementFactor(b)-placementFactor(a)||state.market[b].hype-state.market[a].hype);
  ids.forEach(id=>{
    if(capacity<=0)return; const inv=state.inventory[id]; v04EnsureShelf(inv,id);
    const need=Math.max(0,Math.min(v04ShelfTarget(id),inv.qty)-inv.shelfQty); const move=Math.min(need,capacity);
    inv.shelfQty+=move; capacity-=move; moved+=move;
  });
  return moved;
}
function v04WeightedPick(items,scoreFn){
  if(!items.length)return null; const weights=items.map(x=>Math.max(.001,scoreFn(x))), total=weights.reduce((a,b)=>a+b,0); let r=Math.random()*total;
  for(let i=0;i<items.length;i++){ r-=weights[i]; if(r<=0)return items[i]; }
  return items[items.length-1];
}
function v04PickCustomerType(){ return v04WeightedPick(v04CustomerTypes(),x=>x.weight); }
function v04ProductScore(p,type){
  const inv=state.inventory[p.id],m=state.market[p.id], life=lifecycleFor(p); if(!inv||inv.shelfQty<=0)return 0;
  const priceRatio=inv.price/p.rrp, discount=Math.max(0,1-priceRatio), premium=Math.max(0,priceRatio-1);
  let priceScore=(1.10 - Math.max(0,priceRatio-.85)*type.price*.62 + discount*type.price*.45 - premium*type.price*.18);
  if(type.id==='collector' && p.scarcity>70) priceScore+=premium*.22;
  if(type.id==='bargain') priceScore+=discount*1.2;
  let score=(m.hype/100)*type.hype*1.8+(p.quality/100)*type.quality*.9+(p.scarcity/100)*type.scarcity*.55;
  score*=Math.max(.12,priceScore)*placementFactor(p.id)*displayFactor(p)*life.factor;
  if(type.id==='collector'&&state.operations.collectorCabinet)score*=1.28;
  if(type.id==='kid'&&state.operations.demoZone)score*=1.22;
  if(type.id==='impulse'&&state.operations.demoZone)score*=1.15;
  return Math.max(.02,score);
}
function v04PurchaseChance(type,p){
  const inv=state.inventory[p.id], score=v04ProductScore(p,type), priceRatio=inv.price/p.rrp;
  let chance=.38+Math.min(.40,score*.12)+(v04ServiceScore()-55)*.002;
  if(priceRatio>1.35 && state.market[p.id].hype<82)chance-=.17;
  if(type.id==='bargain'&&priceRatio<.9)chance+=.18;
  if(type.id==='collector'&&p.scarcity>78)chance+=.12;
  return clamp(chance,.10,.92);
}
function v04MaintenanceCost(){ return Math.round(48 + state.operations.hours*7 + Object.keys(v04UpgradeDefs()).filter(k=>state.operations[k]).length*9); }
function v04DailyWages(){ return roundMoney(v04Team().reduce((a,s)=>a+(s.wage||v04StaffRoles()[s.role].wage)*v04WageFactor(),0)); }
function v04UpdateStaffAfterDay(){
  const manager=v04RoleCount('manager')>0;
  v04Team().forEach(s=>{
    const fatigueGain=state.operations.hours===12?12:state.operations.hours===10?7:3;
    s.fatigue=clamp((s.fatigue||0)+fatigueGain-(manager?5:3),0,95);
    s.days=(s.days||0)+1;
    if(s.days%6===0)s.skill=clamp((s.skill||60)+1,45,95);
    if(s.days%8===0)s.service=clamp((s.service||60)+1,45,95);
  });
}
function v04ShopVisualFlags(){
  const o=state.operations||{}; return [o.secondCheckout?'2 CHECKOUTS':null,o.lighting?'PREMIUM LIGHTING':null,o.collectorCabinet?'COLLECTOR CABINET':null,o.demoZone?'DEMO ZONE':null,o.security?'SECURITY':null,o.giftWrap?'GIFT WRAP':null,o.biggerFloor?'EXPANDED FLOOR':null].filter(Boolean);
}

function migrateState(s){
  s.version=VERSION; s.tab=s.tab||'store'; s.sound=s.sound!==false;
  s.preorders=s.preorders||{}; s.placements=s.placements||{}; s.displays=s.displays||{};
  s.suppliers=s.suppliers||Object.fromEntries(Object.values(supplierTemplates).map(x=>[x.id,{relationship:x.baseRel,totalSpend:0,orders:0}]));
  Object.values(supplierTemplates).forEach(x=>{ if(!s.suppliers[x.id])s.suppliers[x.id]={relationship:x.baseRel,totalSpend:0,orders:0}; });
  s.operations={...v04DefaultOperations(),...(s.operations||{})};
  s.staff=s.staff||{nextId:3,team:[{id:'S1',name:'Mia',role:'cashier',skill:68,service:72,fatigue:10,days:0,wage:v04StaffRoles().cashier.wage},{id:'S2',name:'Noah',role:'floor',skill:64,service:76,fatigue:9,days:0,wage:v04StaffRoles().floor.wage}]};
  s.staff.team=Array.isArray(s.staff.team)?s.staff.team:[]; s.staff.nextId=Number.isFinite(s.staff.nextId)?s.staff.nextId:s.staff.team.length+1;
  s.customerStats={...v04DefaultCustomerStats(),...(s.customerStats||{})};
  products.forEach((p,idx)=>{
    if(!s.market[p.id])s.market[p.id]={hype:p.baseDemand,trend:0,buzz:'steady'};
    if(!Number.isFinite(s.market[p.id].potential))s.market[p.id].potential=latentPotential(p);
    if(s.inventory[p.id]){
      if(!Number.isFinite(s.inventory[p.id].avgCost))s.inventory[p.id].avgCost=p.wholesale;
      if(!s.placements[p.id])s.placements[p.id]=(idx%7===0?'window':idx%5===0?'feature':'main');
      if(!Number.isFinite(s.inventory[p.id].shelfQty))s.inventory[p.id].shelfQty=Math.min(s.inventory[p.id].qty||0,(s.placements[p.id]==='window'?6:s.placements[p.id]==='feature'?7:8));
      s.inventory[p.id].shelfQty=clamp(s.inventory[p.id].shelfQty,0,s.inventory[p.id].qty||0);
    }
  });
  rivalTemplates.forEach((r,ri)=>{ const rs=s.rivals[r.id]; if(!rs)return; rs.inventory=rs.inventory||{}; rs.cash=Number.isFinite(rs.cash)?rs.cash:70000+ri*18000; rs.lastSales=rs.lastSales||0; rs.pressure=rs.pressure||0; });
  s.lastSummary=s.lastSummary||null; s.reputation=Number.isFinite(s.reputation)?s.reputation:55;
  return s;
}
function freshState(){
  const inventory={},placements={}; const starting=['P001','P007','P013','P019','P025','P031','P037','P043'];
  starting.forEach((id,idx)=>{ const p=getProduct(id),qty=8+(idx%4)*2; inventory[id]={qty,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:p.wholesale,shelfQty:Math.min(qty,idx<2?6:idx<4?7:8)}; placements[id]=idx<2?'window':idx<4?'feature':'main'; });
  const market={}; products.forEach((p,idx)=>market[p.id]={hype:clamp(p.baseDemand+((idx*13)%19)-9,20,96),trend:((idx%5)-2),buzz:'steady',potential:latentPotential(p)});
  const rivals={}; rivalTemplates.forEach((r,ri)=>{ const prices={},rinv={}; products.forEach((p,idx)=>{ prices[p.id]=roundMoney(p.rrp*(r.pricing+((((idx+ri*2)%9)-4)/100))); if(idx%11===ri)rinv[p.id]=4+((idx+ri*3)%10); }); rivals[r.id]={cash:70000+ri*18000,rep:r.rep,share:17+ri*2,prices,inventory:rinv,lastSales:0,pressure:0,activity:'Watching the market.'}; });
  return {version:VERSION,day:1,cash:25000,todaySales:0,todayProfit:0,rating:4.2,reputation:55,customersToday:0,totalRevenue:0,totalProfit:0,inventory,market,rivals,supplierStock:Object.fromEntries(products.map(p=>[p.id,p.supplierStock])),upgrades:{stockroom:0,marketing:0,service:0,analytics:0},marketShare:18,lastEvent:'Grand Opening',eventLog:['Day 1: Your independent toy shop opened.'],chatter:[],sound:true,tab:'store',tutorialShown:false,orderCount:0,preorders:{},placements,displays:{},suppliers:Object.fromEntries(Object.values(supplierTemplates).map(x=>[x.id,{relationship:x.baseRel,totalSpend:0,orders:0}])),lastSummary:null,operations:v04DefaultOperations(),staff:{nextId:3,team:[{id:'S1',name:'Mia',role:'cashier',skill:68,service:72,fatigue:10,days:0,wage:v04StaffRoles().cashier.wage},{id:'S2',name:'Noah',role:'floor',skill:64,service:76,fatigue:9,days:0,wage:v04StaffRoles().floor.wage}]},customerStats:v04DefaultCustomerStats()};
}
function loadState(){
  try{
    for(const key of [SAVE_KEY,...LEGACY_SAVE_KEYS]){
      const raw=localStorage.getItem(key); if(!raw)continue; const s=JSON.parse(raw);
      if(s&&s.inventory&&s.market&&s.rivals){ const m=migrateState(s); localStorage.setItem(SAVE_KEY,JSON.stringify(m)); return m; }
    }
  }catch(e){}
  return freshState();
}

function renderStoreWorld(owned,chatter,hottest){
  const shelf=owned.slice(0,6),fallback=products.filter(p=>p.launchDay<=state.day).slice(0,6),stock=shelf.length?shelf:fallback;
  const stats=state.customerStats||v04DefaultCustomerStats(), shopperCount=clamp(Math.round((state.customersToday||42)/20),3,7);
  const shoppers=Array.from({length:shopperCount},(_,i)=>{ const bubble=i<2&&chatter[i]?`<div class="shopper-bubble">${chatter[i].text}</div>`:''; return `<div class="shopper shopper-${(i%6)+1}">${bubble}<i class="shopper-head"></i><i class="shopper-body"></i><i class="shopper-arm left"></i><i class="shopper-arm right"></i><i class="shopper-leg left"></i><i class="shopper-leg right"></i></div>`; }).join('');
  const visual=v04ShopVisualFlags();
  return `<div class="store-world v04-world ${state.operations.lighting?'premium-lit':''}">
    <div class="store-ceiling"><i></i><i></i><i></i>${state.operations.lighting?'<i></i><i></i>':''}</div>
    <div class="store-back-wall"><div class="store-logo-sign"><span>TOY</span><b>STORE</b><small>TYCOON</small></div><div class="launch-poster" style="${brandStyle(hottest)}" onclick="openBuySheet('${hottest.id}')"><span>HOT DROP</span>${packageArt(hottest,true)}<strong>${hottest.name}</strong></div><div class="service-sign">😊 ${Math.round(stats.satisfaction||78)}<small>SATISFACTION</small></div></div>
    <div class="store-floor ${state.operations.biggerFloor?'expanded-floor':''}">
      <div class="shelf-wall shelf-left">${stock.slice(0,3).map(p=>{const inv=state.inventory[p.id],q=inv?.shelfQty||0,total=inv?.qty||0,empty=total>0&&q===0;return `<div class="shelf-product ${empty?'shelf-empty':''}" style="${brandStyle(p)}" onclick="${total?`openPriceSheet('${p.id}')`:`openBuySheet('${p.id}')`}">${q?packageArt(p,true):'<div class="empty-facing">SOLD<br>THROUGH</div>'}<span>${q} shelf / ${total}</span></div>`}).join('')}<div class="shelf-plank"></div></div>
      <div class="shelf-wall shelf-right">${stock.slice(3,6).map(p=>{const inv=state.inventory[p.id],q=inv?.shelfQty||0,total=inv?.qty||0,empty=total>0&&q===0;return `<div class="shelf-product ${empty?'shelf-empty':''}" style="${brandStyle(p)}" onclick="${total?`openPriceSheet('${p.id}')`:`openBuySheet('${p.id}')`}">${q?packageArt(p,true):'<div class="empty-facing">RESTOCK<br>NEEDED</div>'}<span>${q} shelf / ${total}</span></div>`}).join('')}<div class="shelf-plank"></div></div>
      ${state.operations.collectorCabinet?'<div class="collector-cabinet">💎<small>COLLECTOR</small></div>':''}
      ${state.operations.demoZone?'<div class="demo-zone">🎮<small>TRY ME</small></div>':''}
      ${state.operations.giftWrap?'<div class="gift-counter">🎁<small>WRAP</small></div>':''}
      ${state.operations.security?'<div class="security-cam">📹</div>':''}
      <div class="checkout ${state.operations.secondCheckout?'checkout-double':''}"><div class="register">▰</div>${state.operations.secondCheckout?'<div class="register second">▰</div>':''}<div class="counter-sign">CHECKOUT</div><div class="shopping-bag">T</div></div>
      <div class="delivery-cart"><div>📦</div><span>${v04StockroomUnits()} stockroom</span></div>${shoppers}
    </div><div class="store-glow"></div>
    ${visual.length?`<div class="world-upgrades">${visual.slice(0,4).map(x=>`<span>${x}</span>`).join('')}</div>`:''}
  </div>`;
}

function v04OperationsPanel(){
  const stats=state.customerStats||v04DefaultCustomerStats(), team=v04Team();
  return `<div class="ops-dashboard"><div class="ops-top"><div><span class="kicker">STORE OPERATIONS</span><h3>${state.operations.hours}-hour trading day</h3><p>${team.length}/${v04StaffCapacity()} staff · ${v04CheckoutCapacity()} checkout capacity · ${v04RestockCapacity()} restock units/day</p></div><button class="secondary-btn compact-btn" onclick="openHoursSheet()">HOURS</button></div><div class="ops-meter-grid"><div><span>😊 SATISFACTION</span><b>${Math.round(stats.satisfaction||78)}%</b><i><em style="width:${stats.satisfaction||78}%"></em></i></div><div><span>✨ CLEANLINESS</span><b>${Math.round(state.operations.cleanliness)}%</b><i><em style="width:${state.operations.cleanliness}%"></em></i></div><div><span>🧾 QUEUE CAPACITY</span><b>${v04CheckoutCapacity()}</b><small>${stats.abandoned||0} abandoned last day</small></div><div><span>📦 SHELF STOCK</span><b>${v04ShelfUnits()}</b><small>${v04StockroomUnits()} waiting in stockroom</small></div></div><div class="ops-actions"><button onclick="openStaffSheet()">👥 STAFF</button><button onclick="deepCleanStore()">🧹 DEEP CLEAN</button><button onclick="openStoreUpgrades()">🏗️ SHOP UPGRADES</button></div></div>`;
}
function renderStore(){
  const hottest=products.filter(p=>p.launchDay<=state.day+5).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype)[0];
  const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0).map(getProduct), front=[...owned].sort((a,b)=>(placementFactor(b.id)*state.market[b.id].hype)-(placementFactor(a.id)*state.market[a.id].hype)).slice(0,6), low=owned.filter(p=>(state.inventory[p.id].shelfQty||0)<=1), chatter=getChatter(), preorderCount=preorderUnits(), cs=state.customerStats||v04DefaultCustomerStats();
  screen.innerHTML=`<section class="store-world-wrap">${renderStoreWorld(front,chatter,hottest)}<div class="store-command-card"><div><span class="kicker">${gameDate().label.toUpperCase()} · ${seasonName()}</span><h2>${state.lastSummary?'Set the floor for today.':'Your doors are ready to open.'}</h2><p>${state.lastSummary?`${state.lastSummary.customers} visitors · ${state.lastSummary.transactions||0} baskets · ${money(state.lastSummary.sales)} sales last day.`:'Staff, shelf stock and checkout capacity now directly affect every sale.'}</p></div><button class="primary-btn next-day-btn" onclick="endDay()">OPEN FOR ${state.operations.hours}H <b>→</b></button></div></section>
  <section class="section">${v04OperationsPanel()}</section>
  <section class="section">${calendarBanner()}</section>
  ${preorderCount?`<section class="section"><div class="preorder-strip" onclick="switchTab('market')"><span>🚚</span><div><b>${preorderCount} pre-order units committed</b><small>Cash is tied up · deliveries land in the stockroom on launch day.</small></div><strong>VIEW →</strong></div></section>`:''}
  <section class="section"><div class="section-head"><div><h2>🔥 Trend Alert</h2><p>${lifecycleFor(hottest).icon} ${lifecycleFor(hottest).name} · ${supplierFor(hottest).name}</p></div><button onclick="switchTab('market')">Market</button></div><div class="trend-feature" style="${brandStyle(hottest)}" onclick="openBuySheet('${hottest.id}')"><div class="trend-copy"><span class="kicker">${hypeLabel(state.market[hottest.id].hype)} · ${getBrand(hottest.brand).name}</span><strong>${hottest.name}</strong><p>Buzz is ${state.market[hottest.id].trend>=0?'climbing':'cooling'} · ${state.supplierStock[hottest.id]} supplier units left.</p><div class="trend-price"><span>${hottest.launchDay>state.day?'Pre-order cost':'Wholesale'}</span><b>${money(effectiveWholesale(hottest))}</b></div></div><div class="trend-pack">${packageArt(hottest,true)}</div></div></section>
  <section class="section"><div class="section-head"><div><h2>Customer Mix</h2><p>Different shoppers value price, hype, quality and scarcity differently.</p></div></div><div class="customer-mix">${v04CustomerTypes().map(t=>`<div><span>${t.icon}</span><b>${t.name}</b><small>${cs.types?.[t.id]||0} last day</small></div>`).join('')}</div></section>
  <section class="section"><div class="section-head"><div><h2>Customer Buzz</h2><p>Listen for real demand signals — and occasional nonsense.</p></div></div>${chatter.map(c=>`<div class="chatter premium-chatter"><div class="avatar">${c.avatar}</div><div><p>“${c.text}”</p><small>${c.note}</small></div><span class="buzz-wave">〰</span></div>`).join('')}</section>
  <section class="section"><div class="grid2"><div class="action-card accent visual-action" onclick="switchTab('market')"><div class="action-orb">📦</div><h3>Buy & Pre-order</h3><p>${inventoryUsed()} owned · ${preorderCount} incoming.</p></div><div class="action-card ${low.length?'warn':''} visual-action" onclick="switchTab('products')"><div class="action-orb">🪟</div><h3>Restock & Merchandise</h3><p>${low.length} shelf facings critically low.</p></div><div class="action-card visual-action" onclick="openStaffSheet()"><div class="action-orb">👥</div><h3>Team</h3><p>${v04Team().length} staff · ${money(v04DailyWages())} estimated wages.</p></div><div class="action-card visual-action" onclick="switchTab('rivals')"><div class="action-orb">⚔️</div><h3>Rival Watch</h3><p>${state.rivals.mega.activity}</p></div></div></section>`;
}

function inventoryRow(p){
  const inv=state.inventory[p.id],m=state.market[p.id],margin=inv.price-(inv.avgCost||p.wholesale),pl=shelfPlacements[state.placements[p.id]||'main'],life=lifecycleFor(p); v04EnsureShelf(inv,p.id);
  const stockroom=Math.max(0,inv.qty-inv.shelfQty), shelfPct=Math.round(Math.min(1,inv.shelfQty/Math.max(1,v04ShelfTarget(p.id)))*100);
  return `<div class="inventory-row v04-inventory" style="${brandStyle(p)}" onclick="openPriceSheet('${p.id}')"><div class="inventory-thumb">${packageArt(p,true)}</div><div><div class="inventory-tags"><span>${pl.icon} ${pl.name}</span><span>${life.icon} ${life.name}</span></div><h3>${p.name}</h3><p>${getBrand(p.brand).name} · ${heat(m.hype)} ${hypeLabel(m.hype)}</p><div class="shelf-mini"><i><em style="width:${shelfPct}%"></em></i><small>${inv.shelfQty} shelf · ${stockroom} stockroom</small></div><p><strong>${money(inv.price)}</strong> · <span class="${margin>=0?'profit':'loss'}">${margin>=0?'+':''}${money(margin)}/unit</span> · ${inv.soldToday||0} sold</p></div><div class="stock-pill ${inv.shelfQty===0&&inv.qty>0?'hot':''}">${inv.qty} total</div></div>`;
}
function renderProducts(){
  const owned=Object.keys(state.inventory).map(getProduct).filter(p=>p&&(state.inventory[p.id]?.qty||0)>0).sort((a,b)=>placementFactor(b.id)-placementFactor(a.id)||state.market[b.id].hype-state.market[a.id].hype);
  screen.innerHTML=`<section class="section"><div class="merch-overview"><div><span>✨ FRONT WINDOW</span><b>${placementCount('window')}/3</b></div><div><span>🎯 ENTRANCE FEATURE</span><b>${placementCount('feature')}/4</b></div><div><span>📦 STOCKROOM</span><b>${v04StockroomUnits()}</b></div></div><div class="restock-banner"><div><span>📦</span><div><b>Shelf replenishment capacity ${v04RestockCapacity()} units/day</b><small>Stockroom staff refill high-priority displays first when you open.</small></div></div><button onclick="manualRestock()">RESTOCK NOW</button></div><div class="section-head"><div><h2>Your Products</h2><p>Stock in the building does not sell until it reaches a shelf.</p></div></div>${owned.length?owned.map(p=>inventoryRow(p)).join(''):`<div class="empty"><div class="emoji">📦</div><h3>Your shelves are empty</h3><p>Order products from the Market.</p><button class="primary-btn" onclick="switchTab('market')">OPEN MARKET</button></div>`}</section>`;
}
function manualRestock(){ if(state.operations.preRestockedDay===state.day)return toast('Pre-opening restock already used today'); const moved=v04RestockShelves(); state.operations.preRestockedDay=state.day; saveState(); renderProducts(); toast(moved?`${moved} units moved onto shelves`:'Shelves are already full'); }
function setPlacement(id,key){
  const def=shelfPlacements[key]; if(!def)return; if(placementCount(key,id)>=def.capacity)return toast(`${def.name} is full`); const inv=state.inventory[id]; state.placements[id]=key; v04EnsureShelf(inv,id); inv.shelfQty=Math.min(inv.shelfQty,v04ShelfTarget(id),inv.qty); saveState(); openPriceSheet(id); toast(`Moved to ${def.name}`);
}
function openPriceSheet(id){
  const p=getProduct(id),inv=state.inventory[id],m=state.market[id],rivalPrices=rivalTemplates.map(r=>state.rivals[r.id].prices[id]).filter(Boolean).sort((a,b)=>a-b),low=rivalPrices[0]||p.rrp,current=state.placements[id]||'main'; v04EnsureShelf(inv,id);
  sheetContent.innerHTML=`<div class="sheet-art package-sheet" style="${brandStyle(p)}">${packageArt(p,false)}</div><div class="brand-name">${getBrand(p.brand).name} · ${lifecycleFor(p).icon} ${lifecycleFor(p).name}</div><h2>${p.name}</h2><div class="metrics"><div class="metric"><span>Total Stock</span><strong>${inv.qty}</strong></div><div class="metric"><span>On Shelf</span><strong>${inv.shelfQty}</strong></div><div class="metric"><span>Stockroom</span><strong>${Math.max(0,inv.qty-inv.shelfQty)}</strong></div></div><label class="field-label" for="priceInput">Your shelf price</label><input id="priceInput" class="price-input" type="number" min="1" step="0.50" value="${inv.price.toFixed(2)}"/><div class="button-row"><button class="secondary-btn" onclick="setPricePreset('${id}',${p.rrp})">RRP ${money(p.rrp)}</button><button class="secondary-btn" onclick="setPricePreset('${id}',${low})">MATCH ${money(low)}</button></div><div class="divider"></div><div class="field-label">Shelf placement · target facing changes with zone</div><div class="placement-grid">${Object.entries(shelfPlacements).map(([key,x])=>`<button class="placement-btn ${current===key?'active':''}" onclick="setPlacement('${id}','${key}')"><span>${x.icon}</span><b>${x.name}</b><small>${key==='window'?'+45% visibility · 6 facing':key==='feature'?'+25% visibility · 7 facing':key==='back'?'−32% visibility · 4 facing':'Normal visibility · 8 facing'}</small></button>`).join('')}</div><button class="primary-btn wide" style="margin-top:10px" onclick="savePrice('${id}')">SAVE PRODUCT SETUP</button><p class="small-note">Average unit cost ${money(inv.avgCost||p.wholesale)} · Lowest rival ${money(low)}. Stockroom replenishment occurs before each trading day.</p>`; openSheet();
}

function buyStock(id){
  const p=getProduct(id),stock=state.supplierStock[id]||0,capacityLeft=inventoryCapacity()-inventoryUsed()-preorderUnits(),qty=Math.min(sheetQty,stock,maxOrderAllocation(p),capacityLeft),unit=effectiveWholesale(p),cost=roundMoney(qty*unit),sup=supplierStateFor(p),pre=p.launchDay>state.day;
  if(qty<=0)return toast('No stockroom capacity or supplier stock'); if(state.cash<cost)return toast('Not enough cash for that commitment');
  state.cash=roundMoney(state.cash-cost); state.supplierStock[id]-=qty; state.orderCount++; sup.totalSpend=roundMoney((sup.totalSpend||0)+cost); sup.orders=(sup.orders||0)+1; sup.relationship=clamp(sup.relationship+.45+Math.min(1.2,qty/30),0,100);
  if(pre){ const old=state.preorders[id]||{qty:0,cost:0}; state.preorders[id]={qty:old.qty+qty,cost:roundMoney(old.cost+cost),unitCost:unit,committedDay:state.day}; state.eventLog.unshift(`Day ${state.day}: Pre-ordered ${qty} × ${p.name} for ${money(cost)}.`); }
  else { if(!state.inventory[id])state.inventory[id]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:unit,shelfQty:0}; const inv=state.inventory[id],oldQty=inv.qty,oldCost=(inv.avgCost||p.wholesale)*oldQty; inv.qty+=qty; inv.avgCost=roundMoney((oldCost+cost)/Math.max(1,inv.qty)); v04EnsureShelf(inv,id); if(!state.placements[id])state.placements[id]='main'; state.eventLog.unshift(`Day ${state.day}: Ordered ${qty} × ${p.name} into the stockroom for ${money(cost)}.`); }
  saveState(); closeSheet(); render(); toast(pre?`${qty} × ${p.name} committed`:`${qty} units delivered to stockroom`);
}
function processPreorders(){
  const delivered=[]; Object.entries({...state.preorders}).forEach(([id,x])=>{ const p=getProduct(id); if(p.launchDay>state.day)return; if(!state.inventory[id])state.inventory[id]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:roundMoney((x.cost||0)/Math.max(1,x.qty)),shelfQty:0}; const inv=state.inventory[id],oldQty=inv.qty,oldCost=(inv.avgCost||p.wholesale)*oldQty,incomingCost=x.cost||((x.unitCost||p.wholesale)*x.qty); inv.qty+=x.qty; inv.avgCost=roundMoney((oldCost+incomingCost)/Math.max(1,inv.qty)); v04EnsureShelf(inv,id); if(!state.placements[id])state.placements[id]='main'; delivered.push(`${x.qty} × ${p.name}`); delete state.preorders[id]; state.eventLog.unshift(`Day ${state.day}: Launch delivery arrived in stockroom — ${x.qty} × ${p.name}.`); }); return delivered;
}

function openHoursSheet(){
  sheetContent.innerHTML=`<h2>🕒 Opening Hours</h2><p class="subtle">Longer days increase traffic, but wages and fatigue rise too.</p><div class="hours-grid">${[8,10,12].map(h=>{const tf=h===8?'−12% traffic':h===12?'+18% traffic':'Normal traffic',wf=h===8?'−16% wages':h===12?'+22% wages':'Normal wages';return `<button class="hours-option ${state.operations.hours===h?'active':''}" onclick="setOpeningHours(${h})"><b>${h} HOURS</b><span>${tf}</span><small>${wf}</small></button>`}).join('')}</div><div class="metrics"><div class="metric"><span>Checkout capacity</span><strong>${v04CheckoutCapacity()}</strong></div><div class="metric"><span>Current wages</span><strong>${money(v04DailyWages())}</strong></div><div class="metric"><span>Cleanliness</span><strong>${Math.round(state.operations.cleanliness)}%</strong></div></div><button class="secondary-btn wide" onclick="closeSheet()">DONE</button>`; openSheet();
}
function setOpeningHours(h){ if(![8,10,12].includes(h))return; state.operations.hours=h; saveState(); openHoursSheet(); toast(`${h}-hour trading day selected`); }
function openStaffSheet(){
  const defs=v04StaffRoles(),team=v04Team();
  sheetContent.innerHTML=`<h2>👥 Store Team</h2><p class="subtle">Staff are paid every trading day. Skill improves with experience; long hours increase fatigue.</p><div class="staff-summary"><div><span>TEAM</span><b>${team.length}/${v04StaffCapacity()}</b></div><div><span>DAILY WAGES</span><b>${money(v04DailyWages())}</b></div><div><span>CHECKOUT</span><b>${v04CheckoutCapacity()}</b></div><div><span>RESTOCK</span><b>${v04RestockCapacity()}</b></div></div>${team.map(s=>{const d=defs[s.role];return `<div class="staff-card"><div class="staff-avatar">${d.icon}</div><div><h3>${s.name} · ${d.name}</h3><p>Skill ${Math.round(s.skill)} · Service ${Math.round(s.service)} · Fatigue ${Math.round(s.fatigue)}%</p><small>${d.desc}</small></div><div class="staff-pay"><b>${money((s.wage||d.wage)*v04WageFactor())}</b><small>/day</small><button onclick="fireStaff('${s.id}')">REMOVE</button></div></div>`}).join('')}<div class="divider"></div><div class="field-label">Hire staff</div><div class="hire-grid">${Object.entries(defs).map(([key,d])=>`<button onclick="hireStaff('${key}')"><span>${d.icon}</span><b>${d.name}</b><small>${money(d.wage)}/10h day</small></button>`).join('')}</div><button class="secondary-btn wide" onclick="closeSheet()">DONE</button>`; openSheet();
}
function hireStaff(role){ const defs=v04StaffRoles(),d=defs[role]; if(!d)return; if(v04Team().length>=v04StaffCapacity())return toast('Your current shop floor cannot support more staff'); const n=v04MakeStaff(role,state.staff.nextId++); state.staff.team.push(n); state.eventLog.unshift(`Day ${state.day}: Hired ${n.name} as ${d.name}.`); saveState(); openStaffSheet(); toast(`${n.name} joined the team`); }
function fireStaff(id){ const i=state.staff.team.findIndex(s=>s.id===id); if(i<0)return; const s=state.staff.team[i]; if(!confirm(`Remove ${s.name} from the roster?`))return; state.staff.team.splice(i,1); state.eventLog.unshift(`Day ${state.day}: ${s.name} left the store team.`); saveState(); openStaffSheet(); toast(`${s.name} removed`); }
function deepCleanStore(){ const cost=180; if(state.cash<cost)return toast('You need $180 for a deep clean'); state.cash=roundMoney(state.cash-cost); state.operations.cleanliness=clamp(state.operations.cleanliness+28,0,100); state.operations.lastDeepCleanDay=state.day; state.eventLog.unshift(`Day ${state.day}: Paid ${money(cost)} for a deep clean.`); saveState(); render(); toast('Store cleaned and reset'); }
function openStoreUpgrades(){
  const defs=v04UpgradeDefs(); sheetContent.innerHTML=`<h2>🏗️ Shop Improvements</h2><p class="subtle">These upgrades change both the simulation and the visible store floor.</p><div class="shop-upgrade-grid">${Object.entries(defs).map(([key,d])=>{const owned=!!state.operations[key];return `<div class="shop-upgrade-card ${owned?'owned':''}"><div>${d.icon}</div><section><h3>${d.name}</h3><p>${d.desc}</p></section><button ${owned?'disabled':''} onclick="buyStoreUpgrade('${key}')">${owned?'BUILT':money(d.cost)}</button></div>`}).join('')}</div><button class="secondary-btn wide" onclick="closeSheet()">DONE</button>`; openSheet();
}
function buyStoreUpgrade(key){ const d=v04UpgradeDefs()[key]; if(!d||state.operations[key])return; if(state.cash<d.cost)return toast('Not enough cash for this upgrade'); state.cash=roundMoney(state.cash-d.cost); state.operations[key]=1; state.eventLog.unshift(`Day ${state.day}: Installed ${d.name}.`); saveState(); openStoreUpgrades(); toast(`${d.name} installed`); }

function simulateCustomers(){
  const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0); owned.forEach(id=>{state.inventory[id].soldToday=0;state.inventory[id].lastProfit=0;v04EnsureShelf(state.inventory[id],id);});
  let restocked=state.operations.preRestockedDay===state.day?0:v04RestockShelves(), liveRestockBudget=v04RestockCapacity(), floorTrafficBoost=(state.operations.biggerFloor?1.12:1)*(state.operations.lighting?1.06:1)*(state.operations.demoZone?1.10:1);
  let traffic=Math.round(66*(1+state.upgrades.marketing*.06)*(0.88+state.rating/9.5)*seasonFactor()*v04HoursFactor()*floorTrafficBoost*(.82+state.operations.cleanliness/500)); traffic+=Math.round((Math.random()-.5)*14); traffic=Math.max(18,traffic);
  state.customersToday=traffic; state.todaySales=0; state.todayProfit=0;
  const typeCounts=Object.fromEntries(v04CustomerTypes().map(t=>[t.id,0])), planned=[]; let stockoutMisses=0;
  const sellableProducts=()=>owned.map(getProduct).filter(p=>state.inventory[p.id].shelfQty>0&&p.launchDay<=state.day);
  for(let i=0;i<traffic;i++){
    const type=v04PickCustomerType(); typeCounts[type.id]++;
    const available=sellableProducts(); if(!available.length){stockoutMisses++;continue;}
    const first=v04WeightedPick(available,p=>v04ProductScore(p,type)); if(!first)continue;
    const buyChance=v04PurchaseChance(type,first); if(Math.random()>buyChance)continue;
    const desired=Math.max(1,Math.min(4,Math.round(type.basket+(Math.random()-.5)*1.5))), basket=[];
    let picks=0;
    while(picks<desired){ const current=sellableProducts().filter(p=>!basket.some(x=>x.id===p.id)); if(!current.length)break; const p=v04WeightedPick(current,x=>v04ProductScore(x,type)); if(!p)break; const extraChance=picks===0?1:(.50-(picks*.08)+(type.basket-1)*.12); if(Math.random()>extraChance)break; basket.push(p); picks++; }
    if(basket.length) planned.push({type,basket});
  }
  const checkoutCap=v04CheckoutCapacity(), pressure=planned.length/Math.max(1,checkoutCap), acceptRate=pressure<=1?1:clamp(1-(pressure-1)*.48,.48,.98);
  let abandoned=0,transactions=0,basketUnits=0,revenue=0,grossProfit=0,giftWraps=0;
  planned.forEach(order=>{
    if(Math.random()>acceptRate){abandoned++;return;}
    let units=0,orderRevenue=0,orderProfit=0;
    order.basket.forEach(p=>{ const inv=state.inventory[p.id]; if(inv.shelfQty<=0||inv.qty<=0){stockoutMisses++;return;} inv.shelfQty--; inv.qty--; inv.soldToday=(inv.soldToday||0)+1; inv.totalSold=(inv.totalSold||0)+1; units++; basketUnits++; orderRevenue+=inv.price; orderProfit+=inv.price-(inv.avgCost||p.wholesale); inv.lastProfit=(inv.lastProfit||0)+(inv.price-(inv.avgCost||p.wholesale)); if(inv.shelfQty<=1&&inv.qty>inv.shelfQty&&liveRestockBudget>0){const move=Math.min(v04ShelfTarget(p.id)-inv.shelfQty,inv.qty-inv.shelfQty,liveRestockBudget);if(move>0){inv.shelfQty+=move;liveRestockBudget-=move;restocked+=move;}} });
    if(!units)return; transactions++; if(state.operations.giftWrap && (order.type.id==='gift'||order.type.id==='parent') && Math.random()<.54){giftWraps++;orderRevenue+=4.5;orderProfit+=3.8;}
    revenue+=orderRevenue; grossProfit+=orderProfit;
  });
  const security=v04SecurityScore(), shrinkChance=clamp((traffic/110)*(1-security/135)*.55,.03,.65), shrinkUnits=Math.min(3,weightedChance(shrinkChance*100)?1+(weightedChance(22)?1:0):0);
  let shrinkCost=0; for(let n=0;n<shrinkUnits;n++){ const victims=owned.filter(id=>state.inventory[id].qty>0); if(!victims.length)break; const id=rand(victims),inv=state.inventory[id],p=getProduct(id); inv.qty--; if(inv.shelfQty>0)inv.shelfQty--; shrinkCost+=inv.avgCost||p.wholesale; }
  const wages=v04DailyWages(),maintenance=v04MaintenanceCost(),queuePeak=Math.max(0,Math.ceil(planned.length/Math.max(1,1+v04RoleCount('cashier')+(state.operations.secondCheckout?1:0)))),service=v04ServiceScore();
  const pricePain=owned.length?owned.reduce((a,id)=>a+Math.max(0,(state.inventory[id].price/getProduct(id).rrp)-1.15),0)/owned.length:0;
  let satisfaction=82 + (service-60)*.18 + (state.operations.cleanliness-80)*.18 - (abandoned/Math.max(1,planned.length))*35 - Math.min(14,pricePain*40) - stockoutMisses/Math.max(1,traffic)*18;
  if(state.operations.giftWrap)satisfaction+=2; if(state.operations.demoZone)satisfaction+=2; satisfaction=clamp(satisfaction,35,98);
  state.cash=roundMoney(state.cash+revenue-wages-maintenance); state.todaySales=roundMoney(revenue); state.todayProfit=roundMoney(grossProfit-wages-maintenance-shrinkCost); state.totalRevenue=roundMoney(state.totalRevenue+revenue); state.totalProfit=roundMoney(state.totalProfit+state.todayProfit);
  state.customerStats={buyers:transactions,transactions,basketUnits,avgBasket:transactions?roundMoney(revenue/transactions):0,abandoned,queuePeak,satisfaction,giftWraps,shrinkUnits,shrinkCost:roundMoney(shrinkCost),wages,maintenanceCost:maintenance,grossProfit:roundMoney(grossProfit),restocked,stockoutMisses,types:typeCounts};
  const cleanlinessDrop=traffic*.018+state.operations.hours*.25; state.operations.cleanliness=clamp(state.operations.cleanliness-cleanlinessDrop+v04RoleCount('floor')*3.2+v04RoleCount('manager')*1.8,28,100);
  state.operations.maintenance=clamp(state.operations.maintenance-(state.operations.hours===12?2.2:1.1)+(maintenance>0?.45:0),45,100);
  v04UpdateStaffAfterDay();
  const ratingMove=(satisfaction-76)*.0024 + (state.upgrades.service||0)*.004 + (Math.random()-.5)*.014; state.rating=clamp(state.rating+ratingMove,2.7,5);
  state.reputation=clamp(state.reputation+(satisfaction-74)*.035-abandoned*.015,0,100);
  state.marketShare=clamp(state.marketShare+(state.todayProfit>700?.13:-.05)+(satisfaction>84?.06:0)+(Math.random()-.5)*.10,4,68);
}
function simulateRivals(){
  rivalTemplates.forEach(r=>{
    const s=state.rivals[r.id],inv=s.inventory||(s.inventory={}),candidates=products.filter(p=>p.launchDay<=state.day+4),ranked=[...candidates].sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype),target=r.id==='trend'?ranked[0]:r.id==='collector'?ranked.find(p=>p.scarcity>65)||ranked[0]:rand(ranked.slice(0,12)),m=state.market[target.id],life=lifecycleFor(target);
    let rev=0; Object.entries(inv).forEach(([id,q])=>{if(q<=0)return;const p=getProduct(id),h=state.market[id].hype,pr=s.prices[id]||p.rrp,units=Math.min(q,Math.max(0,Math.round((h/100)*2.5*seasonFactor()*(.7+Math.random()*.7))));inv[id]-=units;rev+=units*pr;}); s.lastSales=roundMoney(rev); s.cash=roundMoney(s.cash+rev);
    if((m.hype>58||r.id==='mega')&&(state.supplierStock[target.id]||0)>0){let want=r.id==='mega'?8+Math.floor(Math.random()*14):r.id==='trend'?10+Math.floor(Math.random()*16):r.id==='collector'?4+Math.floor(target.scarcity/15):4+Math.floor(Math.random()*8);if(life.key==='clearance')want=Math.floor(want*.35);const take=Math.min(state.supplierStock[target.id]||0,want);if(take>0){state.supplierStock[target.id]-=take;inv[target.id]=(inv[target.id]||0)+take;s.cash-=take*target.wholesale;}}
    const playerThreat=state.marketShare>24||state.todayProfit>1500||state.rating>4.55; s.pressure=clamp((s.pressure||0)+(playerThreat?8:-2),0,100);
    if(playerThreat&&r.id==='mega'&&weightedChance(72)){s.prices[target.id]=roundMoney(target.rrp*(.72+Math.random()*.10));s.activity=`RETALIATION: cut ${target.name} to ${money(s.prices[target.id])} after your market share climbed.`;}
    else if(playerThreat&&r.id==='family'&&weightedChance(48)){s.activity=`Launched a family-service campaign after your rating reached ${state.rating.toFixed(1)}★.`;s.share=clamp(s.share+.25,5,38);}
    else if(playerThreat&&r.id==='trend'&&weightedChance(58)){const take=Math.min(state.supplierStock[target.id]||0,8+Math.floor(Math.random()*12));state.supplierStock[target.id]-=take;inv[target.id]=(inv[target.id]||0)+take;s.activity=`Copied your hot range and grabbed ${take} more ${target.name} units.`;}
    else if(r.id==='mega'&&weightedChance(58)){s.prices[target.id]=roundMoney(target.rrp*(.78+Math.random()*.13));s.activity=`Price war: cut ${target.name} to ${money(s.prices[target.id])} while holding ${inv[target.id]||0} units.`;}
    else if(r.id==='collector'&&m.hype>72){s.prices[target.id]=roundMoney(target.rrp*(1.14+Math.random()*.24));s.activity=`Collector premium: ${target.name} at ${money(s.prices[target.id])}; ${inv[target.id]||0} units held.`;}
    else if(r.id==='trend'){s.prices[target.id]=roundMoney(target.rrp*(.96+Math.random()*.14));s.activity=`Chased ${target.name}; now holding ${inv[target.id]||0} units.`;}
    else{s.prices[target.id]=roundMoney(target.rrp*(.92+Math.random()*.11));s.activity=`Featured ${getBrand(target.brand).name} and adjusted ${target.name} to ${money(s.prices[target.id])}.`;}
    if(weightedChance(r.rumor)){const rumorTarget=rand(ranked.slice(0,10)),hit=3+Math.floor(Math.random()*7);state.market[rumorTarget.id].hype=clamp(state.market[rumorTarget.id].hype-hit,15,99);s.activity=`Unverified rumour is circulating about ${rumorTarget.name}. Buzz fell ${hit} points.`;}
    s.share=clamp(s.share+(rev>2500?.16:-.02)+(Math.random()-.5)*.45,5,38);
  });
}
function buildDaySummary(completedDay){
  const sold=Object.entries(state.inventory).map(([id,x])=>({p:getProduct(id),sold:x.soldToday||0,profit:x.lastProfit||0})).sort((a,b)=>b.sold-a.sold),best=sold[0],worst=[...sold].sort((a,b)=>a.sold-b.sold)[0],trend=[...products].sort((a,b)=>state.market[b.id].trend-state.market[a.id].trend)[0],cs=state.customerStats||v04DefaultCustomerStats();
  return {day:completedDay,date:gameDate(completedDay).label,sales:state.todaySales,profit:state.todayProfit,grossProfit:cs.grossProfit||0,customers:state.customersToday,buyers:cs.buyers||0,transactions:cs.transactions||0,avgBasket:cs.avgBasket||0,abandoned:cs.abandoned||0,satisfaction:cs.satisfaction||0,wages:cs.wages||0,maintenance:cs.maintenanceCost||0,shrinkUnits:cs.shrinkUnits||0,shrinkCost:cs.shrinkCost||0,restocked:cs.restocked||0,best:best?.p?.name||'No sales',bestQty:best?.sold||0,worst:worst?.p?.name||'—',worstQty:worst?.sold||0,trend:trend?.name||'—',trendMove:state.market[trend?.id]?.trend||0};
}
function showDaySummary(summary,event,deliveries=[]){
  splash.innerHTML=`<div class="day-summary v04-summary"><div class="day-summary-top"><span class="kicker">${summary.date.toUpperCase()} COMPLETE</span><h2>${summary.profit>=0?'The tills closed in profit.':'Operations ate into the day.'}</h2><p>${seasonName(summary.day)} · ${summary.customers} visitors · ${summary.transactions} paying baskets.</p></div><div class="day-summary-grid"><div><span>SALES</span><b>${money(summary.sales)}</b><small>${money(summary.avgBasket)} avg basket</small></div><div><span>OPERATING PROFIT</span><b class="${summary.profit>=0?'profit':'loss'}">${money(summary.profit)}</b><small>${money(summary.grossProfit)} gross before ops</small></div><div><span>SATISFACTION</span><b>${Math.round(summary.satisfaction)}%</b><small>${summary.abandoned} abandoned queue</small></div><div><span>BEST SELLER</span><b>${summary.best}</b><small>${summary.bestQty} units</small></div></div><div class="ops-cost-breakdown"><div><span>👥 Wages</span><b>−${money(summary.wages)}</b></div><div><span>🧽 Maintenance</span><b>−${money(summary.maintenance)}</b></div><div><span>🕵️ Shrink / damage</span><b>−${money(summary.shrinkCost)}</b></div><div><span>📦 Restocked</span><b>${summary.restocked} units</b></div></div><div class="summary-news"><div><span>📈 MARKET</span><b>${summary.trend}</b><small>Momentum ${summary.trendMove>=0?'+':''}${summary.trendMove}</small></div>${deliveries.length?`<div><span>🚚 LAUNCH DELIVERY</span><b>${deliveries.join(', ')}</b><small>Arrived in stockroom — staff must replenish shelves.</small></div>`:''}${event?`<div class="major"><span>${event.icon} MARKET EVENT</span><b>${event.title}</b><small>${event.body}</small></div>`:''}</div><button class="primary-btn wide" onclick="closeSplash()">SET UP ${gameDate(state.day).label.toUpperCase()} →</button></div>`; splash.classList.remove('hidden');
}
function endDay(){
  const completed=state.day; simulateCustomers(); simulateMarket(); simulateRivals(); const event=maybeMajorEvent(),summary=buildDaySummary(completed); state.lastSummary=summary; state.day++; const deliveries=processPreorders(); replenishSuppliers(); saveState(); showDaySummary(summary,event,deliveries);
}

function renderEmpire(){
  const net=state.cash+inventoryValue(),nextTarget=50000,progress=clamp(net/nextTarget*100,0,100),cs=state.customerStats||v04DefaultCustomerStats();
  screen.innerHTML=`<section class="empire-hero"><div class="kicker">YOUR COMPANY · ${gameDate().label}</div><h2>Run the floor. Build the leverage.</h2><p>Your store now has real operating capacity: staff, queues, restocking, satisfaction and daily overhead all flow into profit.</p><div class="divider"></div><div class="metrics"><div class="metric"><span>Net Worth</span><strong>${money(net)}</strong></div><div class="metric"><span>Lifetime Sales</span><strong>${money(state.totalRevenue)}</strong></div><div class="metric"><span>Market Share</span><strong>${state.marketShare.toFixed(1)}%</strong></div></div><div class="field-label">Next milestone · ${money(nextTarget)}</div><div class="progress"><span style="width:${progress}%"></span></div></section>
  <section class="section"><div class="section-head"><div><h2>Store Operations</h2><p>${v04Team().length} staff · ${Math.round(cs.satisfaction||78)}% satisfaction · ${Math.round(state.operations.cleanliness)}% cleanliness</p></div></div><div class="empire-ops-actions"><button onclick="openStaffSheet()">👥 MANAGE STAFF</button><button onclick="openHoursSheet()">🕒 OPENING HOURS</button><button onclick="openStoreUpgrades()">🏗️ SHOP IMPROVEMENTS</button></div></section>
  <section class="section"><div class="section-head"><div><h2>Supplier Relationships</h2><p>Ordering consistently earns better wholesale pricing.</p></div></div>${Object.values(supplierTemplates).map(s=>supplierCard(s)).join('')}</section>
  <section class="section"><div class="section-head"><div><h2>Franchise Displays</h2><p>Permanent branded displays boost that franchise by 18%.</p></div></div><div class="display-grid">${Object.entries(displayDefs).map(([brand,d])=>displayCard(brand,d)).join('')}</div></section>
  <section class="section"><div class="section-head"><div><h2>Business Upgrades</h2><p>Back-office improvements from the earlier store foundation.</p></div></div>${upgrades.map(u=>upgradeCard(u)).join('')}</section>
  <section class="section"><button class="secondary-btn wide" onclick="showLog()">VIEW EVENT HISTORY</button><button class="danger-btn wide" style="margin-top:9px" onclick="resetGame()">RESET LOCAL SAVE</button><p class="small-note">v${VERSION} · Local-first GitHub Pages save.</p></section>`;
}

window.openHoursSheet=openHoursSheet;window.setOpeningHours=setOpeningHours;window.openStaffSheet=openStaffSheet;window.hireStaff=hireStaff;window.fireStaff=fireStaff;window.deepCleanStore=deepCleanStore;window.openStoreUpgrades=openStoreUpgrades;window.buyStoreUpgrade=buyStoreUpgrade;window.manualRestock=manualRestock;

/* ==========================================================================
   v0.5 — Franchise Universe + Collector Economy
   Persistent franchise health, media, generations, reissues, nostalgia,
   chase variants, condition and a secondary collector market.
   ========================================================================== */

function v05Lore(){
  return {
    gearmorph:{tagline:'Machines choose their form.',world:'A century-spanning machine war where vehicles bond with pilots and rewrite themselves for every battlefield.',media:['Rift Protocol','Sparkstorm','The Alloy Wars'],lines:['Genesis Shift','Rift Era','Titan Age','Neo Circuit']},
    lumalife:{tagline:'Every day can be your story.',world:'Fashion, friendship and aspirational city life built around Luma and a changing cast of designers, musicians and adventurers.',media:['City Lights','Luma Live!','Dreamhouse Diaries'],lines:['City Collection','Starlight Era','New Horizons','Luma Forever']},
    starward:{tagline:'The frontier is never finished.',world:'A cinematic space saga of rangers, rogue captains and enormous fleet battles beyond the mapped systems.',media:['The Eclipse War','Outpost Seven','Nova Rebellion'],lines:['Frontier One','Eclipse Era','Nova Age','Legacy Fleet']},
    pocketbeasts:{tagline:'Small friends. Huge adventures.',world:'Collectible elemental creatures discovered in hidden habitats, each with forms, rivalries and ultra-rare mutations.',media:['Wild Trails','Moonhorn Quest','Crystal League'],lines:['First Nest','Wild Trails','Crystal Age','Neo Beasts']},
    mythicforge:{tagline:'Legends are made, not found.',world:'Knights, monsters and rival kingdoms battle for ancient runes that can reshape the fantasy realm.',media:['Blackspire','Runeblade','Age of Wyverns'],lines:['Foundry Age','Blackspire Saga','Frost Realm','Forged Again']},
    nitrostreet:{tagline:'Build it. Race it. Own the street.',world:'A stylised global racing universe of crews, wild concept cars, stunt cities and impossible tracks.',media:['Night Circuit','Turbo City','World Drift'],lines:['Street One','Night Circuit','Hyper Era','Retro Velocity']},
    littleworld:{tagline:'Big imagination starts small.',world:'A warm preschool world of towns, farms, builders and friendly families designed around open-ended play.',media:['Happy Town','Animal Friends','Busy Builders'],lines:['Happy Town','Friends & Family','Discovery Days','Little World Again']},
    ultraleague:{tagline:'Every city needs a hero.',world:'A bright superhero universe where young heroes, veteran legends and theatrical villains collide across one enormous city.',media:['Rise of the League','Shadow Spark','Crisis City'],lines:['Founders Era','Crisis Wave','New Guard','Legacy League']}
  };
}
function v05VariantDefs(){
  return {
    uncommon:{name:'Colour Variant',icon:'🎨',mult:1.45,rank:1},
    rare:{name:'Metallic Variant',icon:'✨',mult:2.35,rank:2},
    ultra:{name:'Ultra-Rare Chase',icon:'💎',mult:4.8,rank:3},
    prototype:{name:'Prototype Colourway',icon:'🧪',mult:7.5,rank:4}
  };
}
function v05ConditionDefs(){
  return {
    mint:{name:'Mint',icon:'🟢',mult:1.15},
    near:{name:'Near Mint',icon:'🔵',mult:1.00},
    wear:{name:'Shelf Wear',icon:'🟠',mult:.78},
    damaged:{name:'Damaged Box',icon:'🔴',mult:.48}
  };
}
function v05DefaultFranchises(){
  const out={};
  Object.keys(brands).forEach((id,i)=>{
    const lore=v05Lore()[id];
    out[id]={health:clamp(64+((i*11)%24)-8,45,88),sentiment:clamp(68+((i*7)%21)-7,45,90),collectorHeat:clamp(52+((i*13)%31)-8,35,90),nostalgia:28+((i*9)%26),generation:1,wave:1,eraStartDay:1,currentMedia:lore.media[0],mediaBoost:0,mediaBoostUntil:0,lastEvent:'The current range is finding its audience.',history:[`Day 1: ${brands[id].name} entered the local market with ${lore.lines[0]}.`]};
  });
  return out;
}
function v05DefaultCollectorStats(){ return {found:0,sold:0,revenue:0,profit:0,displayedId:null,lastFinds:[],lastFindDay:0}; }
function v05ProductIndex(p){ return productSeeds[p.brand].findIndex(r=>r[0]===p.name); }
function v05ProductMeta(p){
  const idx=Math.max(0,v05ProductIndex(p)), fs=state?.franchises?.[p.brand], lore=v05Lore()[p.brand], override=state?.releaseOverrides?.[p.id];
  const generation=override?.generation||fs?.generation||1, wave=override?.wave||Math.floor(idx/2)+1;
  const limited=p.scarcity>=82 || idx===4;
  const edition=p.scarcity>=88?'Collector Limited':p.scarcity>=78?'Fan Edition':'Mainline';
  const run=limited ? 700+((productNumber(p)*137)%2300) : null;
  const exclusive=p.scarcity>=84?supplierFor(p).name:null;
  return {generation,wave,line:override?.label||lore.lines[(generation-1)%lore.lines.length],edition,limited,run,exclusive,media:lore.media[idx%lore.media.length]};
}
function v05ReleaseInfo(p){
  const o=state?.releaseOverrides?.[p.id];
  return {launchDay:o?.launchDay||p.launchDay,label:o?.label||null,generation:o?.generation||state?.franchises?.[p.brand]?.generation||1,wave:o?.wave||v05ProductMeta(p).wave};
}
function v05LaunchDay(p){ return v05ReleaseInfo(p).launchDay; }
function lifecycleFor(p,day=state.day){
  const rel=day-v05LaunchDay(p);
  if(rel<=-5)return {key:'rumour',name:'Rumour',icon:'👂',factor:.48};
  if(rel<0)return {key:'announced',name:'Announced',icon:'📣',factor:.72};
  if(rel<=2)return {key:'launch',name:'Launch',icon:'🚀',factor:1.28};
  if(rel<=8)return {key:'peak',name:'Peak',icon:'🔥',factor:1.18};
  if(rel<=18)return {key:'stable',name:'Stable',icon:'🟢',factor:1};
  if(rel<=30)return {key:'decline',name:'Decline',icon:'↘️',factor:.82};
  if(rel<=45)return {key:'clearance',name:'Clearance',icon:'🏷️',factor:.62};
  return {key:'discontinued',name:'Discontinued',icon:'📦',factor:.42};
}
function v05FranchiseFactor(brand){
  const f=state.franchises[brand], media=state.day<=f.mediaBoostUntil?(1+f.mediaBoost/100):1;
  return clamp((.72+(f.health/100)*.28+(f.sentiment/100)*.18)*media,.72,1.42);
}
function v05NostalgiaFactor(p,type){
  const life=lifecycleFor(p),f=state.franchises[p.brand]; if(life.key!=='discontinued'&&life.key!=='clearance')return 1;
  const age=Math.max(0,state.day-v05LaunchDay(p)); const n=1+(f.nostalgia/100)*Math.min(.45,age/180);
  return type?.id==='collector'?n*1.22:n;
}
function v05DisplayedCollector(){ return (state.collectorVault||[]).find(x=>x.cid===state.collectorStats?.displayedId&&!x.sold); }
function v05CollectorDisplayBoost(p,type){
  const item=v05DisplayedCollector(); if(!item)return 1; const ip=getProduct(item.productId);
  if(type?.id==='collector')return ip.brand===p.brand?1.22:1.10;
  return ip.brand===p.brand?1.05:1.01;
}
function v05CollectorValue(item){
  const p=getProduct(item.productId), f=state.franchises[p.brand], vr=v05VariantDefs()[item.variant]||v05VariantDefs().uncommon, cd=v05ConditionDefs()[item.condition]||v05ConditionDefs().near, m=state.market[p.id];
  const hype=.78+(m.hype/100)*.52, heat=.68+(f.collectorHeat/100)*.68, nostalgia=1+(f.nostalgia/100)*.34, age=1+Math.min(.32,Math.max(0,state.day-item.foundDay)/180), scarcity=.82+(p.scarcity/100)*.48;
  return roundMoney(p.rrp*vr.mult*cd.mult*hype*heat*nostalgia*age*scarcity);
}
function v05VaultHeld(){ return (state.collectorVault||[]).filter(x=>!x.sold).length; }
function inventoryUsed(){ return Object.values(state.inventory).reduce((a,x)=>a+x.qty,0)+v05VaultHeld(); }
function inventoryValue(){
  const normal=Object.entries(state.inventory).reduce((a,[id,x])=>a+x.qty*(x.avgCost||getProduct(id).wholesale),0);
  const collector=(state.collectorVault||[]).filter(x=>!x.sold).reduce((a,x)=>a+v05CollectorValue(x),0);
  return normal+collector;
}
function v05RollCondition(preorder=false){
  const r=Math.random(); if(preorder){ if(r<.72)return 'mint'; if(r<.94)return 'near'; if(r<.985)return 'wear'; return 'damaged'; }
  if(r<.55)return 'mint'; if(r<.86)return 'near'; if(r<.97)return 'wear'; return 'damaged';
}
function v05ExtractCollectorFinds(p,qty,unitCost,preorder=false){
  const finds=[];
  for(let i=0;i<qty;i++){
    const r=Math.random(), scarcity=p.scarcity/100; let variant=null;
    if(r<.0025+scarcity*.0018)variant='prototype';
    else if(r<.010+scarcity*.0045)variant='ultra';
    else if(r<.030+scarcity*.010)variant='rare';
    else if(r<.075+scarcity*.025)variant='uncommon';
    if(!variant)continue;
    finds.push({cid:`C${state.day.toString(36)}${Date.now().toString(36).slice(-4)}${Math.floor(Math.random()*9999).toString().padStart(4,'0')}`,productId:p.id,variant,condition:v05RollCondition(preorder),acquiredCost:unitCost,foundDay:state.day,sold:false});
    if(finds.length>=Math.max(1,Math.ceil(qty/5)))break;
  }
  if(finds.length){
    state.collectorVault.push(...finds); state.collectorStats.found+=finds.length; state.collectorStats.lastFinds=finds.map(x=>x.cid); state.collectorStats.lastFindDay=state.day;
    const best=[...finds].sort((a,b)=>v05VariantDefs()[b.variant].rank-v05VariantDefs()[a.variant].rank)[0];
    state.eventLog.unshift(`Day ${state.day}: Shipment pull — ${v05VariantDefs()[best.variant].name} ${p.name} (${v05ConditionDefs()[best.condition].name}).`);
  }
  return finds;
}
function v05FranchisePulseCard(id){
  const b=brands[id],f=state.franchises[id],l=v05Lore()[id];
  return `<button class="franchise-pulse" style="--pulse-grad:${b.grad}" onclick="openFranchiseHub('${id}')"><span class="franchise-pulse-art real-brand-tile" style="background:${b.grad}"><img src="assets/brands/${id}.svg" alt=""></span><span><small>GEN ${f.generation} · ${f.currentMedia}</small><b>${b.name}</b><em>${Math.round(f.health)} health · ${Math.round(f.collectorHeat)} collector heat</em></span><strong>›</strong></button>`;
}
function v05FranchiseRail(){ return `<div class="franchise-rail">${Object.keys(brands).map(v05FranchisePulseCard).join('')}</div>`; }
function v05CollectorHero(){
  const held=v05VaultHeld(),display=v05DisplayedCollector(),value=(state.collectorVault||[]).filter(x=>!x.sold).reduce((a,x)=>a+v05CollectorValue(x),0);
  return `<div class="collector-hero" onclick="openCollectorVault()"><div><span class="kicker">COLLECTOR VAULT</span><h3>${held} special ${held===1?'piece':'pieces'} held</h3><p>${display?`${getProduct(display.productId).name} is attracting collectors in-store.`:'Pull chase variants from supplier cartons, hold them, display them or sell into the secondary market.'}</p></div><div class="collector-value"><span>MARKET VALUE</span><b>${money(value)}</b><small>${state.collectorStats.sold} sold</small></div></div>`;
}

function migrateState(s){
  s.version=VERSION; s.tab=s.tab||'store'; s.sound=s.sound!==false;
  s.preorders=s.preorders||{}; s.placements=s.placements||{}; s.displays=s.displays||{};
  s.suppliers=s.suppliers||Object.fromEntries(Object.values(supplierTemplates).map(x=>[x.id,{relationship:x.baseRel,totalSpend:0,orders:0}]));
  Object.values(supplierTemplates).forEach(x=>{if(!s.suppliers[x.id])s.suppliers[x.id]={relationship:x.baseRel,totalSpend:0,orders:0};});
  s.operations={...v04DefaultOperations(),...(s.operations||{})};
  s.staff=s.staff||{nextId:3,team:[{id:'S1',name:'Mia',role:'cashier',skill:68,service:72,fatigue:10,days:0,wage:v04StaffRoles().cashier.wage},{id:'S2',name:'Noah',role:'floor',skill:64,service:76,fatigue:9,days:0,wage:v04StaffRoles().floor.wage}]};
  s.staff.team=Array.isArray(s.staff.team)?s.staff.team:[]; s.staff.nextId=Number.isFinite(s.staff.nextId)?s.staff.nextId:s.staff.team.length+1;
  s.customerStats={...v04DefaultCustomerStats(),...(s.customerStats||{})};
  const defaults=v05DefaultFranchises(); s.franchises=s.franchises||{};
  Object.keys(brands).forEach(id=>{ s.franchises[id]={...defaults[id],...(s.franchises[id]||{})}; s.franchises[id].history=Array.isArray(s.franchises[id].history)?s.franchises[id].history:defaults[id].history; });
  s.collectorVault=Array.isArray(s.collectorVault)?s.collectorVault:[]; s.collectorStats={...v05DefaultCollectorStats(),...(s.collectorStats||{})}; s.releaseOverrides=s.releaseOverrides||{}; s.franchiseYearProcessed=s.franchiseYearProcessed||gameDate(s.day||1).year; s.v05WelcomeShown=!!s.v05WelcomeShown; s.v051VisualShown=!!s.v051VisualShown; s.v052ArtShown=!!s.v052ArtShown;
  products.forEach((p,idx)=>{
    if(!s.market[p.id])s.market[p.id]={hype:p.baseDemand,trend:0,buzz:'steady'};
    if(!Number.isFinite(s.market[p.id].potential))s.market[p.id].potential=latentPotential(p);
    if(s.inventory[p.id]){ if(!Number.isFinite(s.inventory[p.id].avgCost))s.inventory[p.id].avgCost=p.wholesale; if(!s.placements[p.id])s.placements[p.id]=(idx%7===0?'window':idx%5===0?'feature':'main'); if(!Number.isFinite(s.inventory[p.id].shelfQty))s.inventory[p.id].shelfQty=Math.min(s.inventory[p.id].qty||0,(s.placements[p.id]==='window'?6:s.placements[p.id]==='feature'?7:8)); s.inventory[p.id].shelfQty=clamp(s.inventory[p.id].shelfQty,0,s.inventory[p.id].qty||0); }
  });
  rivalTemplates.forEach((r,ri)=>{const rs=s.rivals[r.id];if(!rs)return;rs.inventory=rs.inventory||{};rs.cash=Number.isFinite(rs.cash)?rs.cash:70000+ri*18000;rs.lastSales=rs.lastSales||0;rs.pressure=rs.pressure||0;});
  s.lastSummary=s.lastSummary||null; s.reputation=Number.isFinite(s.reputation)?s.reputation:55;
  return s;
}
function freshState(){
  const inventory={},placements={}; const starting=['P001','P007','P013','P019','P025','P031','P037','P043'];
  starting.forEach((id,idx)=>{const p=getProduct(id),qty=8+(idx%4)*2;inventory[id]={qty,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:p.wholesale,shelfQty:Math.min(qty,idx<2?6:idx<4?7:8)};placements[id]=idx<2?'window':idx<4?'feature':'main';});
  const market={};products.forEach((p,idx)=>market[p.id]={hype:clamp(p.baseDemand+((idx*13)%19)-9,20,96),trend:((idx%5)-2),buzz:'steady',potential:latentPotential(p)});
  const rivals={};rivalTemplates.forEach((r,ri)=>{const prices={},rinv={};products.forEach((p,idx)=>{prices[p.id]=roundMoney(p.rrp*(r.pricing+((((idx+ri*2)%9)-4)/100)));if(idx%11===ri)rinv[p.id]=4+((idx+ri*3)%10);});rivals[r.id]={cash:70000+ri*18000,rep:r.rep,share:17+ri*2,prices,inventory:rinv,lastSales:0,pressure:0,activity:'Watching the market.'};});
  return {version:VERSION,day:1,cash:25000,todaySales:0,todayProfit:0,rating:4.2,reputation:55,customersToday:0,totalRevenue:0,totalProfit:0,inventory,market,rivals,supplierStock:Object.fromEntries(products.map(p=>[p.id,p.supplierStock])),upgrades:{stockroom:0,marketing:0,service:0,analytics:0},marketShare:18,lastEvent:'Grand Opening',eventLog:['Day 1: Your independent toy shop opened.'],chatter:[],sound:true,tab:'store',tutorialShown:false,orderCount:0,preorders:{},placements,displays:{},suppliers:Object.fromEntries(Object.values(supplierTemplates).map(x=>[x.id,{relationship:x.baseRel,totalSpend:0,orders:0}])),lastSummary:null,operations:v04DefaultOperations(),staff:{nextId:3,team:[{id:'S1',name:'Mia',role:'cashier',skill:68,service:72,fatigue:10,days:0,wage:v04StaffRoles().cashier.wage},{id:'S2',name:'Noah',role:'floor',skill:64,service:76,fatigue:9,days:0,wage:v04StaffRoles().floor.wage}]},customerStats:v04DefaultCustomerStats(),franchises:v05DefaultFranchises(),collectorVault:[],collectorStats:v05DefaultCollectorStats(),releaseOverrides:{},franchiseYearProcessed:1,v05WelcomeShown:false,v051VisualShown:false,v052ArtShown:false};
}
function loadState(){
  try{for(const key of [SAVE_KEY,...LEGACY_SAVE_KEYS]){const raw=localStorage.getItem(key);if(!raw)continue;const s=JSON.parse(raw);if(s&&s.inventory&&s.market&&s.rivals){const m=migrateState(s);localStorage.setItem(SAVE_KEY,JSON.stringify(m));return m;}}}catch(e){}
  return freshState();
}

function v04ProductScore(p,type){
  const inv=state.inventory[p.id],m=state.market[p.id],life=lifecycleFor(p);if(!inv||inv.shelfQty<=0)return 0;
  const priceRatio=inv.price/p.rrp,discount=Math.max(0,1-priceRatio),premium=Math.max(0,priceRatio-1);
  let priceScore=(1.10-Math.max(0,priceRatio-.85)*type.price*.62+discount*type.price*.45-premium*type.price*.18); if(type.id==='collector'&&p.scarcity>70)priceScore+=premium*.22;if(type.id==='bargain')priceScore+=discount*1.2;
  let score=(m.hype/100)*type.hype*1.8+(p.quality/100)*type.quality*.9+(p.scarcity/100)*type.scarcity*.55;
  score*=Math.max(.12,priceScore)*placementFactor(p.id)*displayFactor(p)*life.factor*v05FranchiseFactor(p.brand)*v05NostalgiaFactor(p,type)*v05CollectorDisplayBoost(p,type);
  if(type.id==='collector'&&state.operations.collectorCabinet)score*=1.28;if(type.id==='kid'&&state.operations.demoZone)score*=1.22;if(type.id==='impulse'&&state.operations.demoZone)score*=1.15;
  return Math.max(.02,score);
}

function v05MarketProductCard(p){
  const m=state.market[p.id],stock=state.supplierStock[p.id]||0,life=lifecycleFor(p),sup=supplierFor(p),ss=supplierStateFor(p),launch=v05LaunchDay(p),pre=launch>state.day,meta=v05ProductMeta(p),rivalCount=rivalTemplates.filter(r=>(state.rivals[r.id].inventory?.[p.id]||0)>0).length;
  const release=state.releaseOverrides[p.id];
  return `<article class="market-card v05-market-card">${productArt(p)}<div class="market-body"><div class="market-tag-row"><span class="lifecycle-chip ${life.key}">${life.icon} ${life.name}</span><span class="collector-chip">${meta.limited?'💎':'📚'} ${meta.edition}</span></div><div class="brand-name">${getBrand(p.brand).name} · ${release?release.label:`Gen ${meta.generation} · Wave ${meta.wave}`}</div><div class="market-title-row"><h3>${p.name}</h3><strong>${money(p.rrp)}</strong></div><div class="edition-line">${meta.exclusive?`⭐ ${meta.exclusive} exclusive · `:''}${meta.run?`${meta.run.toLocaleString()} unit run · `:''}${meta.media}</div><div class="metrics"><div class="metric"><span>Your Cost</span><strong>${money(effectiveWholesale(p))}</strong></div><div class="metric"><span>${pre?'Launch':'Supplier'}</span><strong>${pre?gameDate(launch).short:`${stock} left`}</strong></div><div class="metric"><span>Rivals Holding</span><strong>${rivalCount}/4</strong></div></div><div class="supplier-rel"><span>Relationship ${ss.relationship.toFixed(0)}/100</span><div><i style="width:${ss.relationship}%"></i></div></div><div class="button-row"><button class="secondary-btn" onclick="openProductInfo('${p.id}')">DETAILS</button><button class="primary-btn" ${stock<=0||life.key==='discontinued'?'disabled':''} onclick="openBuySheet('${p.id}')">${life.key==='discontinued'?'DISCONTINUED':stock?(pre?'PRE-ORDER':'ORDER STOCK'):'SOLD OUT'}</button></div></div></article>`;
}
function renderMarket(){
  const available=products.filter(p=>v05LaunchDay(p)<=state.day+7||lifecycleFor(p).key!=='rumour'||state.releaseOverrides[p.id]);
  const filtered=available.filter(p=>currentFilter==='all'||p.brand===currentFilter).sort((a,b)=>{const la=lifecycleFor(a),lb=lifecycleFor(b);if(la.key==='discontinued'&&lb.key!=='discontinued')return 1;if(lb.key==='discontinued'&&la.key!=='discontinued')return -1;return state.market[b.id].hype-state.market[a.id].hype;});
  const preorders=Object.entries(state.preorders||{}).filter(([,x])=>x.qty>0);
  screen.innerHTML=`<section class="section">${calendarBanner()}${v05CollectorHero()}<div class="section-head"><div><h2>Franchise Universe</h2><p>Brands now have generations, media, fandom and collector heat.</p></div></div>${v05FranchiseRail()}${preorders.length?`<div class="preorder-panel"><span class="kicker">INCOMING LAUNCH STOCK</span>${preorders.map(([id,x])=>`<div><b>${getProduct(id).name}</b><span>${x.qty} units · arrives ${gameDate(v05LaunchDay(getProduct(id))).label}</span></div>`).join('')}</div>`:''}<div class="section-head"><div><h2>Supplier Market</h2><p>New waves, reissues and limited runs can become collector history.</p></div></div><div class="toolbar"><button class="chip ${currentFilter==='all'?'active':''}" onclick="setFilter('all')">All</button>${Object.entries(brands).map(([id,b])=>`<button class="chip ${currentFilter===id?'active':''}" onclick="setFilter('${id}')">${b.glyph} ${b.name}</button>`).join('')}</div><div class="market-grid">${filtered.map(v05MarketProductCard).join('')}</div></section>`;
}
function marketCard(p){ return v05MarketProductCard(p); }
function openBuySheet(id){
  const p=getProduct(id),m=state.market[id],stock=state.supplierStock[id]||0,life=lifecycleFor(p),sup=supplierFor(p),launch=v05LaunchDay(p),pre=launch>state.day,unit=effectiveWholesale(p),meta=v05ProductMeta(p);
  if(life.key==='discontinued')return toast('This release is discontinued — watch for a reissue or collector-market stock.');
  sheetQty=Math.min(5,stock||1);const inv=state.inventory[id],incoming=state.preorders[id]?.qty||0;
  sheetContent.innerHTML=`<div class="sheet-art package-sheet" style="${brandStyle(p)}">${packageArt(p,false)}</div><div class="market-tag-row"><span class="lifecycle-chip ${life.key}">${life.icon} ${life.name}</span><span class="collector-chip">${meta.limited?'💎':'📚'} ${meta.edition}</span></div><h2>${p.name}</h2><div class="edition-line">${meta.line} · Wave ${meta.wave}${meta.run?` · ${meta.run.toLocaleString()} unit run`:''}</div><div class="metrics"><div class="metric"><span>Your Cost</span><strong>${money(unit)}</strong></div><div class="metric"><span>RRP</span><strong>${money(p.rrp)}</strong></div><div class="metric"><span>Collector Heat</span><strong>${Math.round(state.franchises[p.brand].collectorHeat)}/100</strong></div></div><p class="subtle">${marketInsight(p)}</p>${pre?`<div class="commit-warning">🔒 PRE-ORDER: cash is paid now. Factory-sealed launch cartons have a better chance of Mint chase variants when they arrive on ${gameDate(launch).label}.</div>`:`<div class="commit-warning">📦 Every supplier carton can contain colour, metallic, ultra-rare or prototype chase variants. Valuable pulls move into your Collector Vault automatically.</div>`}<div class="divider"></div><div class="field-label">${pre?'Commit quantity':'Order quantity'} · Supplier has ${stock} · Your allocation ${maxOrderAllocation(p)}</div><div class="stepper"><button onclick="changeQty(-1,'${id}')">−</button><strong id="qtyValue">${sheetQty}</strong><button onclick="changeQty(1,'${id}')">+</button></div><div class="quick-qty"><button onclick="setOrderQty('${id}',10)">10</button><button onclick="setOrderQty('${id}',25)">25</button><button onclick="setOrderQty('${id}',50)">50</button><button onclick="setOrderQty('${id}',999)">MAX</button></div><button class="primary-btn wide" id="orderBtn" onclick="buyStock('${id}')">${pre?'COMMIT':'ORDER'} ${sheetQty} · ${money(sheetQty*unit)}</button><p class="small-note">Capacity committed: ${inventoryUsed()+preorderUnits()} / ${inventoryCapacity()} units. ${inv?`You own ${inv.qty} standard units.`:''} ${incoming?`${incoming} already incoming.`:''}</p>`;openSheet();
}
function changeQty(delta,id){
  const p=getProduct(id),max=Math.min(state.supplierStock[id]||0,maxOrderAllocation(p),Math.max(0,inventoryCapacity()-inventoryUsed()-preorderUnits())),unit=effectiveWholesale(p),pre=v05LaunchDay(p)>state.day;
  sheetQty=clamp(sheetQty+delta,1,Math.max(1,max));document.getElementById('qtyValue').textContent=sheetQty;document.getElementById('orderBtn').textContent=`${pre?'COMMIT':'ORDER'} ${sheetQty} · ${money(sheetQty*unit)}`;
}
function setOrderQty(id,q){const p=getProduct(id),max=Math.min(state.supplierStock[id]||0,maxOrderAllocation(p),Math.max(0,inventoryCapacity()-inventoryUsed()-preorderUnits()));sheetQty=clamp(q,1,Math.max(1,max));const unit=effectiveWholesale(p),pre=v05LaunchDay(p)>state.day;document.getElementById('qtyValue').textContent=sheetQty;document.getElementById('orderBtn').textContent=`${pre?'COMMIT':'ORDER'} ${sheetQty} · ${money(sheetQty*unit)}`;}
function buyStock(id){
  const p=getProduct(id),stock=state.supplierStock[id]||0,capacityLeft=inventoryCapacity()-inventoryUsed()-preorderUnits(),qty=Math.min(sheetQty,stock,maxOrderAllocation(p),capacityLeft),unit=effectiveWholesale(p),cost=roundMoney(qty*unit),sup=supplierStateFor(p),pre=v05LaunchDay(p)>state.day;
  if(lifecycleFor(p).key==='discontinued')return toast('That release is discontinued.');if(qty<=0)return toast('No stockroom capacity or supplier stock');if(state.cash<cost)return toast('Not enough cash for that commitment');
  state.cash=roundMoney(state.cash-cost);state.supplierStock[id]-=qty;state.orderCount++;sup.totalSpend=roundMoney((sup.totalSpend||0)+cost);sup.orders=(sup.orders||0)+1;sup.relationship=clamp(sup.relationship+.45+Math.min(1.2,qty/30),0,100);
  if(pre){const old=state.preorders[id]||{qty:0,cost:0};state.preorders[id]={qty:old.qty+qty,cost:roundMoney(old.cost+cost),unitCost:unit,committedDay:state.day,launchDay:v05LaunchDay(p)};state.eventLog.unshift(`Day ${state.day}: Pre-ordered ${qty} × ${p.name} for ${money(cost)}.`);saveState();closeSheet();render();return toast(`${qty} × ${p.name} committed`);}
  const finds=v05ExtractCollectorFinds(p,qty,unit,false),regular=Math.max(0,qty-finds.length);if(regular>0){if(!state.inventory[id])state.inventory[id]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:unit,shelfQty:0};const inv=state.inventory[id],oldQty=inv.qty,oldCost=(inv.avgCost||p.wholesale)*oldQty;inv.qty+=regular;inv.avgCost=roundMoney((oldCost+regular*unit)/Math.max(1,inv.qty));if(!state.placements[id])state.placements[id]='main';v04EnsureShelf(inv,id);}state.eventLog.unshift(`Day ${state.day}: Ordered ${qty} × ${p.name} for ${money(cost)}${finds.length?` and pulled ${finds.length} collector variant${finds.length===1?'':'s'}.`:'.'}`);saveState();closeSheet();render();toast(finds.length?`${regular} shelf units + ${finds.length} collector pull${finds.length===1?'':'s'}!`:`${qty} units delivered to stockroom`);
}
function processPreorders(){
  const delivered=[];state.collectorStats.lastFinds=[];
  Object.entries({...state.preorders}).forEach(([id,x])=>{const p=getProduct(id);if(v05LaunchDay(p)>state.day)return;const unit=roundMoney((x.cost||0)/Math.max(1,x.qty))||x.unitCost||p.wholesale,finds=v05ExtractCollectorFinds(p,x.qty,unit,true),regular=Math.max(0,x.qty-finds.length);if(regular>0){if(!state.inventory[id])state.inventory[id]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:unit,shelfQty:0};const inv=state.inventory[id],oldQty=inv.qty,oldCost=(inv.avgCost||p.wholesale)*oldQty;inv.qty+=regular;inv.avgCost=roundMoney((oldCost+regular*unit)/Math.max(1,inv.qty));if(!state.placements[id])state.placements[id]='main';v04EnsureShelf(inv,id);}delivered.push(`${x.qty} × ${p.name}${finds.length?` · ${finds.length} chase pull${finds.length===1?'':'s'}`:''}`);delete state.preorders[id];state.eventLog.unshift(`Day ${state.day}: Launch delivery arrived — ${x.qty} × ${p.name}.`);});return delivered;
}
function openProductInfo(id){
  const p=getProduct(id),m=state.market[id],life=lifecycleFor(p),sup=supplierFor(p),rs=rivalTemplates.filter(r=>(state.rivals[r.id].inventory?.[id]||0)>0),meta=v05ProductMeta(p),f=state.franchises[p.brand],launch=v05LaunchDay(p);
  sheetContent.innerHTML=`<div class="sheet-art package-sheet" style="${brandStyle(p)}">${packageArt(p,false)}</div><div class="market-tag-row"><span class="lifecycle-chip ${life.key}">${life.icon} ${life.name}</span><span class="collector-chip">${meta.limited?'💎':'📚'} ${meta.edition}</span></div><h2>${p.name}</h2><p>${meta.line} · Generation ${meta.generation} · Wave ${meta.wave} · tied to <b>${meta.media}</b>.</p>${meta.run?`<div class="limited-banner">LIMITED RUN · ${meta.run.toLocaleString()} pieces${meta.exclusive?` · ${meta.exclusive}`:''}</div>`:''}<div class="metrics"><div class="metric"><span>Quality</span><strong>${p.quality}/100</strong></div><div class="metric"><span>Scarcity</span><strong>${p.scarcity}/100</strong></div><div class="metric"><span>Collector Heat</span><strong>${Math.round(f.collectorHeat)}/100</strong></div></div><p class="subtle">${marketInsight(p)}</p><div class="franchise-mini-link" onclick="closeSheet();openFranchiseHub('${p.brand}')"><span>${getBrand(p.brand).glyph}</span><div><b>${getBrand(p.brand).name}</b><small>${Math.round(f.health)} health · ${Math.round(f.sentiment)} fan sentiment · ${Math.round(f.nostalgia)} nostalgia</small></div><strong>VIEW UNIVERSE →</strong></div>${life.key==='discontinued'?`<div class="commit-warning">📦 Original retail release ended ${Math.max(0,state.day-launch)} days ago. Remaining sealed stock now benefits from nostalgia and collector demand.</div>`:`<button class="primary-btn wide" onclick="closeSheet();openBuySheet('${id}')">${launch>state.day?'PRE-ORDER':'ORDER STOCK'}</button>`}`;openSheet();
}

function openFranchiseHub(brand){
  const b=brands[brand],f=state.franchises[brand],l=v05Lore()[brand],brandProducts=products.filter(p=>p.brand===brand),held=(state.collectorVault||[]).filter(x=>!x.sold&&getProduct(x.productId).brand===brand),history=[...f.history].slice(-8).reverse();
  const hottest=[...brandProducts].sort((a,c)=>state.market[c.id].hype-state.market[a.id].hype)[0];
  sheetContent.innerHTML=`<div class="franchise-hero real-franchise-hero" style="background-image:linear-gradient(90deg,rgba(8,7,14,.12),rgba(8,7,14,.28)),url('assets/heroes/${brand}.webp');background-color:#17111f"><div><img class="franchise-hero-logo" src="assets/brands/${brand}.svg" alt="${b.name}"><small>GENERATION ${f.generation} · WAVE ${f.wave}</small><h2>${b.name}</h2><p>${l.tagline}</p></div></div><p class="franchise-world">${l.world}</p><div class="franchise-metrics"><div><span>BRAND HEALTH</span><b>${Math.round(f.health)}</b><i><em style="width:${f.health}%"></em></i></div><div><span>FAN SENTIMENT</span><b>${Math.round(f.sentiment)}</b><i><em style="width:${f.sentiment}%"></em></i></div><div><span>COLLECTOR HEAT</span><b>${Math.round(f.collectorHeat)}</b><i><em style="width:${f.collectorHeat}%"></em></i></div><div><span>NOSTALGIA</span><b>${Math.round(f.nostalgia)}</b><i><em style="width:${f.nostalgia}%"></em></i></div></div><div class="media-card"><span>📺 CURRENT MEDIA</span><b>${f.currentMedia}</b><small>${state.day<=f.mediaBoostUntil?`Active media boost +${f.mediaBoost}% through ${gameDate(f.mediaBoostUntil).label}`:'Audience response is currently feeding into product demand organically.'}</small></div><div class="field-label">CURRENT & LEGACY PRODUCTS</div><div class="franchise-product-rail">${brandProducts.map(p=>{const meta=v05ProductMeta(p),life=lifecycleFor(p);return `<button onclick="openProductInfo('${p.id}')" style="--brand-grad:${b.grad}">${packageArt(p,true)}<span>${life.icon} ${life.name}</span><b>${p.name}</b><small>${meta.edition} · Wave ${meta.wave}</small></button>`;}).join('')}</div><div class="franchise-highlight"><span>🔥 HOTTEST NOW</span><b>${hottest.name}</b><small>${hypeLabel(state.market[hottest.id].hype)} · ${held.length} collector pieces from this franchise in your vault</small></div><div class="field-label">FRANCHISE HISTORY</div><div class="history-timeline">${history.map(x=>`<div><i></i><span>${x}</span></div>`).join('')}</div><button class="secondary-btn wide" onclick="openCollectorVault('${brand}')">VIEW ${b.name.toUpperCase()} COLLECTIBLES</button>`;openSheet();
}
function openCollectorVault(filterBrand='all'){
  const held=(state.collectorVault||[]).filter(x=>!x.sold&&(filterBrand==='all'||getProduct(x.productId).brand===filterBrand)).sort((a,b)=>v05CollectorValue(b)-v05CollectorValue(a));
  const value=held.reduce((a,x)=>a+v05CollectorValue(x),0),display=v05DisplayedCollector();
  sheetContent.innerHTML=`<div class="vault-head"><span class="kicker">SECONDARY MARKET</span><h2>💎 Collector Vault</h2><p>Special shipment pulls are tracked individually. Condition, rarity, fandom and nostalgia continuously change their value.</p></div><div class="vault-summary"><div><span>HELD</span><b>${held.length}</b></div><div><span>MARKET VALUE</span><b>${money(value)}</b></div><div><span>SOLD</span><b>${state.collectorStats.sold}</b></div></div>${display?`<div class="displayed-piece"><span>🪟 IN-STORE ATTRACTION</span><b>${v05VariantDefs()[display.variant].name} ${getProduct(display.productId).name}</b><small>Boosting collector traffic and same-franchise interest.</small></div>`:''}${held.length?`<div class="vault-list">${held.map(v05CollectorItemCard).join('')}</div>`:`<div class="empty"><div class="emoji">💎</div><h3>No special pulls yet</h3><p>Order larger cartons and scarce products. Pre-order cartons have better condition odds.</p></div>`}<p class="small-note">Collector market sales add cash immediately. Holding can pay off if nostalgia, scarcity or franchise heat rises — but values can fall too.</p>`;openSheet();
}
function v05CollectorItemCard(item){
  const p=getProduct(item.productId),vr=v05VariantDefs()[item.variant],cd=v05ConditionDefs()[item.condition],value=v05CollectorValue(item),gain=value-item.acquiredCost,display=state.collectorStats.displayedId===item.cid;
  return `<article class="vault-item" style="--brand-grad:${getBrand(p.brand).grad}"><div class="vault-art">${packageArt(p,true)}<span class="rarity-star r${vr.rank}">${vr.icon}</span></div><div class="vault-copy"><span class="kicker">${vr.name.toUpperCase()}</span><h3>${p.name}</h3><p>${cd.icon} ${cd.name} · ${getBrand(p.brand).name}</p><div class="vault-price"><b>${money(value)}</b><small class="${gain>=0?'profit':'loss'}">${gain>=0?'+':''}${money(gain)} vs cost</small></div><div class="button-row"><button class="secondary-btn" onclick="toggleCollectorDisplay('${item.cid}')">${display?'REMOVE DISPLAY':'DISPLAY'}</button><button class="primary-btn" onclick="sellCollectorItem('${item.cid}')">SELL ${money(value)}</button></div></div></article>`;
}
function toggleCollectorDisplay(cid){
  const item=(state.collectorVault||[]).find(x=>x.cid===cid&&!x.sold);if(!item)return;state.collectorStats.displayedId=state.collectorStats.displayedId===cid?null:cid;saveState();openCollectorVault();toast(state.collectorStats.displayedId===cid?'Collector piece placed in-store':'Collector piece returned to vault');
}
function sellCollectorItem(cid){
  const item=(state.collectorVault||[]).find(x=>x.cid===cid&&!x.sold);if(!item)return;const value=v05CollectorValue(item),profit=roundMoney(value-item.acquiredCost);item.sold=true;item.soldDay=state.day;item.soldValue=value;if(state.collectorStats.displayedId===cid)state.collectorStats.displayedId=null;state.cash=roundMoney(state.cash+value);state.todaySales=roundMoney(state.todaySales+value);state.todayProfit=roundMoney(state.todayProfit+profit);state.totalRevenue=roundMoney(state.totalRevenue+value);state.totalProfit=roundMoney(state.totalProfit+profit);state.collectorStats.sold++;state.collectorStats.revenue=roundMoney(state.collectorStats.revenue+value);state.collectorStats.profit=roundMoney(state.collectorStats.profit+profit);const p=getProduct(item.productId);state.franchises[p.brand].collectorHeat=clamp(state.franchises[p.brand].collectorHeat+.35,0,100);state.eventLog.unshift(`Day ${state.day}: Sold ${v05VariantDefs()[item.variant].name} ${p.name} for ${money(value)}.`);saveState();openCollectorVault();updateStats();toast(`Collector sale ${money(value)}`);
}

function v05ApplyFranchiseEffect(brand,{health=0,sentiment=0,collector=0,nostalgia=0,hype=0,mediaBoost=0,duration=0}={}){
  const f=state.franchises[brand];f.health=clamp(f.health+health,5,100);f.sentiment=clamp(f.sentiment+sentiment,5,100);f.collectorHeat=clamp(f.collectorHeat+collector,5,100);f.nostalgia=clamp(f.nostalgia+nostalgia,0,100);if(mediaBoost){f.mediaBoost=mediaBoost;f.mediaBoostUntil=state.day+duration;}products.filter(p=>p.brand===brand).forEach(p=>{state.market[p.id].hype=clamp(state.market[p.id].hype+hype,15,99);state.market[p.id].trend=clamp(state.market[p.id].trend+Math.sign(hype)*2,-5,5);});
}
function v05ScheduleReissue(brand,label='Anniversary Reissue',delay=5){
  const candidates=products.filter(p=>p.brand===brand&&lifecycleFor(p).key==='discontinued').sort((a,b)=>pScoreForReissue(b)-pScoreForReissue(a));
  const p=candidates[0]||rand(products.filter(x=>x.brand===brand));const f=state.franchises[brand],launch=state.day+delay;state.releaseOverrides[p.id]={launchDay:launch,label,generation:f.generation,wave:f.wave};state.supplierStock[p.id]=Math.max(state.supplierStock[p.id]||0,20+Math.floor(Math.random()*35));state.market[p.id].hype=clamp(Math.max(state.market[p.id].hype,58)+6,15,99);state.market[p.id].trend=3;f.history.push(`Day ${state.day}: ${p.name} announced as ${label}, launching ${gameDate(launch).label}.`);state.eventLog.unshift(`Day ${state.day}: ${brands[brand].name} announced ${label} — ${p.name}.`);return p;
}
function pScoreForReissue(p){return p.scarcity*.5+p.quality*.25+state.franchises[p.brand].nostalgia*.25;}
function v05MaybeFranchiseEvent(){
  if(state.day%5!==0&&!weightedChance(18))return null;const brand=rand(Object.keys(brands)),b=brands[brand],f=state.franchises[brand],l=v05Lore()[brand],roll=Math.random();let title,body,icon='📺';
  if(roll<.22){const media=rand(l.media);f.currentMedia=media;v05ApplyFranchiseEffect(brand,{health:6,sentiment:8,collector:4,hype:8,mediaBoost:12,duration:8});title=`${media} BREAKS OUT`;body=`${b.name}'s new media release is a surprise hit. Brand health and toy demand are rising together.`;}
  else if(roll<.40){const media=rand(l.media);f.currentMedia=media;v05ApplyFranchiseEffect(brand,{health:-7,sentiment:-10,collector:-2,hype:-8,mediaBoost:-8,duration:6});title=`FANS TURN ON ${media.toUpperCase()}`;body=`Reviews are poor and longtime fans dislike the direction. Current ${b.name} toys are taking a demand hit.`;icon='📉';}
  else if(roll<.58){v05ApplyFranchiseEffect(brand,{collector:8,nostalgia:12,hype:3});const p=v05ScheduleReissue(brand,'Anniversary Reissue',5);title=`${b.name.toUpperCase()} ANNIVERSARY`;body=`Nostalgia is surging. ${p.name} is returning in a short anniversary reissue and collectors are watching allocations.`;icon='🎂';}
  else if(roll<.74){f.generation++;f.wave=1;f.eraStartDay=state.day;v05ApplyFranchiseEffect(brand,{health:4,sentiment:-3,collector:5,nostalgia:7,hype:5});const p=v05ScheduleReissue(brand,`${l.lines[(f.generation-1)%l.lines.length]} Reboot`,7);title=`${b.name.toUpperCase()} REBOOTED`;body=`A new generation has been revealed. Fans are debating the redesign while ${p.name} becomes the first major reboot release.`;icon='⚡';}
  else if(roll<.88){v05ApplyFranchiseEffect(brand,{sentiment:7,collector:5,hype:5,mediaBoost:7,duration:5});title=`FAN-FAVOURITE REVEAL`;body=`A beloved ${b.name} character is returning. Collector chatter is pulling the wider range upward.`;icon='❤️';}
  else{v05ApplyFranchiseEffect(brand,{health:-4,sentiment:-6,hype:-3});title=`${b.name.toUpperCase()} PRICE BACKLASH`;body=`Fans are complaining about value for money. Sentiment is falling even though committed collectors remain interested.`;icon='💢';}
  f.lastEvent=body;f.history.push(`Day ${state.day}: ${title} — ${body}`);if(f.history.length>24)f.history=f.history.slice(-24);state.eventLog.unshift(`Day ${state.day}: ${title}.`);return {icon,title,body};
}
function v05UpdateFranchisesAfterDay(){
  Object.keys(brands).forEach(brand=>{const f=state.franchises[brand],ids=products.filter(p=>p.brand===brand).map(p=>p.id),sold=ids.reduce((a,id)=>a+(state.inventory[id]?.soldToday||0),0),avgHype=ids.reduce((a,id)=>a+state.market[id].hype,0)/ids.length;f.health=clamp(f.health+(sold>8?.55:sold===0?-.18:.08)+(avgHype-60)*.006,5,100);f.collectorHeat=clamp(f.collectorHeat+(ids.some(id=>lifecycleFor(getProduct(id)).key==='discontinued')?.06:0)+(avgHype>78?.12:-.02),5,100);f.nostalgia=clamp(f.nostalgia+(state.day-f.eraStartDay>50?.05:0),0,100);if(state.day>f.mediaBoostUntil)f.mediaBoost*=.7;});
}
function v05HandleYearRollover(){
  const year=gameDate(state.day).year;if(year<=state.franchiseYearProcessed)return;state.franchiseYearProcessed=year;
  Object.keys(brands).forEach((brand,i)=>{const f=state.franchises[brand];f.wave++;f.nostalgia=clamp(f.nostalgia+5,0,100);if((f.health<44&&weightedChance(55))||weightedChance(16)){f.generation++;f.wave=1;f.eraStartDay=state.day;f.history.push(`Year ${year}: ${brands[brand].name} entered Generation ${f.generation}.`);}const label=f.wave===1?`${v05Lore()[brand].lines[(f.generation-1)%v05Lore()[brand].lines.length]} Reboot`:`Year ${year} Wave ${f.wave}`;v05ScheduleReissue(brand,label,4+i*4);});
  state.eventLog.unshift(`Year ${year}: The toy industry rolled into a new retail year with fresh waves and reissues.`);
}
function v05ProcessReleaseLaunches(){
  Object.entries(state.releaseOverrides||{}).forEach(([id,o])=>{if(o.launched||o.launchDay!==state.day)return;const p=getProduct(id),f=state.franchises[p.brand];o.launched=true;state.supplierStock[id]=Math.max(state.supplierStock[id]||0,28+Math.floor(Math.random()*45));state.market[id].hype=clamp(state.market[id].hype+8,15,99);state.market[id].trend=4;f.health=clamp(f.health+2,0,100);f.history.push(`Day ${state.day}: ${o.label} ${p.name} launched.`);state.eventLog.unshift(`Day ${state.day}: ${o.label} ${p.name} launched.`);});
}
function simulateMarket(){
  products.forEach(p=>{const m=state.market[p.id],life=lifecycleFor(p),launch=v05LaunchDay(p),f=state.franchises[p.brand];let change=(m.potential-m.hype)*.10+(Math.random()-.5)*7+m.trend*.30+(f.health-60)*.008+(f.sentiment-60)*.006;if(life.key==='launch'&&launch===state.day){const reviewShock=Math.round((Math.random()-.46)*34);m.potential=clamp(m.potential+reviewShock,15,99);change+=reviewShock*.45;f.sentiment=clamp(f.sentiment+reviewShock*.18,5,100);f.health=clamp(f.health+reviewShock*.10,5,100);}if(life.key==='peak')change+=1.3;if(life.key==='decline')change-=1.1;if(life.key==='clearance')change-=1.4;if(life.key==='discontinued')change+=f.nostalgia>62?.25:-.8;if(gameDate().month==='December'&&m.potential>62)change+=2.2;m.hype=clamp(Math.round(m.hype+change),15,99);m.trend=clamp(Math.round(change/2),-5,5);m.buzz=hypeLabel(m.hype).toLowerCase();});
}
function replenishSuppliers(){
  products.forEach(p=>{const life=lifecycleFor(p);if(life.key==='discontinued')return;let add=Math.floor(Math.random()*7);if(state.market[p.id].hype>85)add=Math.floor(add*.3);if(life.key==='clearance')add+=2;state.supplierStock[p.id]=clamp((state.supplierStock[p.id]||0)+add,0,150);});
}

function renderStore(){
  const hottest=products.filter(p=>v05LaunchDay(p)<=state.day+5&&lifecycleFor(p).key!=='discontinued').sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype)[0]||products[0];
  const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0).map(getProduct),front=[...owned].sort((a,b)=>(placementFactor(b.id)*state.market[b.id].hype)-(placementFactor(a.id)*state.market[a.id].hype)).slice(0,6),low=owned.filter(p=>(state.inventory[p.id].shelfQty||0)<=1),chatter=getChatter(),preorderCount=preorderUnits(),cs=state.customerStats||v04DefaultCustomerStats();
  const topFranchise=Object.keys(brands).sort((a,b)=>state.franchises[b].health-state.franchises[a].health)[0];
  screen.innerHTML=`<section class="store-world-wrap">${renderStoreWorld(front,chatter,hottest)}<div class="store-command-card"><div><span class="kicker">${gameDate().label.toUpperCase()} · ${seasonName()}</span><h2>${state.lastSummary?'Set the floor for today.':'Your doors are ready to open.'}</h2><p>${state.lastSummary?`${state.lastSummary.customers} visitors · ${state.lastSummary.transactions||0} baskets · ${money(state.lastSummary.sales)} sales last day.`:'The shop, toy market and collector world now evolve together.'}</p></div><button class="primary-btn next-day-btn" onclick="endDay()">OPEN FOR ${state.operations.hours}H <b>→</b></button></div></section><section class="section">${v04OperationsPanel()}</section><section class="section">${calendarBanner()}</section>${preorderCount?`<section class="section"><div class="preorder-strip" onclick="switchTab('market')"><span>🚚</span><div><b>${preorderCount} pre-order units committed</b><small>Factory-sealed launch cartons can contain collector chase variants.</small></div><strong>VIEW →</strong></div></section>`:''}<section class="section">${v05CollectorHero()}</section><section class="section"><div class="section-head"><div><h2>🌐 Franchise Pulse</h2><p>${brands[topFranchise].name} currently leads brand health at ${Math.round(state.franchises[topFranchise].health)}/100.</p></div><button onclick="openFranchiseHub('${topFranchise}')">Explore</button></div>${v05FranchiseRail()}</section><section class="section"><div class="section-head"><div><h2>🔥 Trend Alert</h2><p>${lifecycleFor(hottest).icon} ${lifecycleFor(hottest).name} · ${v05ProductMeta(hottest).edition}</p></div><button onclick="switchTab('market')">Market</button></div><div class="trend-feature" style="${brandStyle(hottest)}" onclick="openBuySheet('${hottest.id}')"><div class="trend-copy"><span class="kicker">${hypeLabel(state.market[hottest.id].hype)} · ${getBrand(hottest.brand).name}</span><strong>${hottest.name}</strong><p>${state.franchises[hottest.brand].currentMedia} · collector heat ${Math.round(state.franchises[hottest.brand].collectorHeat)}/100 · ${state.supplierStock[hottest.id]} supplier units.</p><div class="trend-price"><span>${v05LaunchDay(hottest)>state.day?'Pre-order cost':'Wholesale'}</span><b>${money(effectiveWholesale(hottest))}</b></div></div><div class="trend-pack">${packageArt(hottest,true)}</div></div></section><section class="section"><div class="section-head"><div><h2>Customer Mix</h2><p>Collectors now react to scarcity, nostalgia, condition and your displayed vault piece.</p></div></div><div class="customer-mix">${v04CustomerTypes().map(t=>`<div><span>${t.icon}</span><b>${t.name}</b><small>${cs.types?.[t.id]||0} last day</small></div>`).join('')}</div></section><section class="section"><div class="section-head"><div><h2>Customer Buzz</h2><p>Fans talk about products, media and rival stock.</p></div></div>${chatter.map(c=>`<div class="chatter premium-chatter"><div class="avatar">${c.avatar}</div><div><p>“${c.text}”</p><small>${c.note}</small></div><span class="buzz-wave">〰</span></div>`).join('')}</section><section class="section"><div class="grid2"><div class="action-card accent visual-action" onclick="switchTab('market')"><div class="action-orb">📦</div><h3>Buy & Pre-order</h3><p>${inventoryUsed()} owned · ${preorderCount} incoming.</p></div><div class="action-card visual-action" onclick="openCollectorVault()"><div class="action-orb">💎</div><h3>Collector Vault</h3><p>${v05VaultHeld()} special pieces · ${state.collectorStats.sold} sold.</p></div><div class="action-card visual-action" onclick="openStaffSheet()"><div class="action-orb">👥</div><h3>Team</h3><p>${v04Team().length} staff · ${money(v04DailyWages())} wages.</p></div><div class="action-card visual-action" onclick="switchTab('rivals')"><div class="action-orb">⚔️</div><h3>Rival Watch</h3><p>${state.rivals.mega.activity}</p></div></div></section>`;
}
function renderProducts(){
  const owned=Object.keys(state.inventory).map(getProduct).filter(p=>p&&(state.inventory[p.id]?.qty||0)>0).sort((a,b)=>placementFactor(b.id)-placementFactor(a.id)||state.market[b.id].hype-state.market[a.id].hype);
  screen.innerHTML=`<section class="section">${v05CollectorHero()}<div class="merch-overview"><div><span>✨ FRONT WINDOW</span><b>${placementCount('window')}/3</b></div><div><span>🎯 ENTRANCE FEATURE</span><b>${placementCount('feature')}/4</b></div><div><span>📦 STOCKROOM</span><b>${v04StockroomUnits()}</b></div></div><div class="restock-banner"><div><span>📦</span><div><b>Shelf replenishment capacity ${v04RestockCapacity()} units/day</b><small>Vault collectibles are separate from normal shelf stock.</small></div></div><button onclick="manualRestock()">RESTOCK NOW</button></div><div class="section-head"><div><h2>Your Products</h2><p>Legacy stock can regain value when nostalgia or a reboot hits.</p></div></div>${owned.length?owned.map(p=>inventoryRow(p)).join(''):`<div class="empty"><div class="emoji">📦</div><h3>Your shelves are empty</h3><p>Order products from the Market.</p><button class="primary-btn" onclick="switchTab('market')">OPEN MARKET</button></div>`}</section>`;
}
function inventoryRow(p){
  const inv=state.inventory[p.id],m=state.market[p.id],margin=inv.price-(inv.avgCost||p.wholesale),pl=shelfPlacements[state.placements[p.id]||'main'],life=lifecycleFor(p),meta=v05ProductMeta(p);v04EnsureShelf(inv,p.id);const stockroom=Math.max(0,inv.qty-inv.shelfQty),shelfPct=Math.round(Math.min(1,inv.shelfQty/Math.max(1,v04ShelfTarget(p.id)))*100),nostalgia=state.franchises[p.brand].nostalgia;
  return `<div class="inventory-row v04-inventory" style="${brandStyle(p)}" onclick="openPriceSheet('${p.id}')"><div class="inventory-thumb">${packageArt(p,true)}</div><div><div class="inventory-tags"><span>${pl.icon} ${pl.name}</span><span>${life.icon} ${life.name}</span>${life.key==='discontinued'?`<span>🕰️ Nostalgia ${Math.round(nostalgia)}</span>`:''}</div><h3>${p.name}</h3><p>${getBrand(p.brand).name} · ${meta.edition} · ${heat(m.hype)} ${hypeLabel(m.hype)}</p><div class="shelf-mini"><i><em style="width:${shelfPct}%"></em></i><small>${inv.shelfQty} shelf · ${stockroom} stockroom</small></div><p><strong>${money(inv.price)}</strong> · <span class="${margin>=0?'profit':'loss'}">${margin>=0?'+':''}${money(margin)}/unit</span> · ${inv.soldToday||0} sold</p></div><div class="stock-pill ${inv.shelfQty===0&&inv.qty>0?'hot':''}">${inv.qty} total</div></div>`;
}
function renderEmpire(){
  const net=state.cash+inventoryValue(),nextTarget=50000,progress=clamp(net/nextTarget*100,0,100),cs=state.customerStats||v04DefaultCustomerStats();
  screen.innerHTML=`<section class="empire-hero"><div class="kicker">YOUR COMPANY · ${gameDate().label}</div><h2>Own the shelf. Understand the fandom.</h2><p>Your competitive advantage now includes franchise history and a live collector economy — not just retail margin.</p><div class="divider"></div><div class="metrics"><div class="metric"><span>Net Worth</span><strong>${money(net)}</strong></div><div class="metric"><span>Collector Sales</span><strong>${money(state.collectorStats.revenue)}</strong></div><div class="metric"><span>Market Share</span><strong>${state.marketShare.toFixed(1)}%</strong></div></div><div class="field-label">Next milestone · ${money(nextTarget)}</div><div class="progress"><span style="width:${progress}%"></span></div></section><section class="section">${v05CollectorHero()}</section><section class="section"><div class="section-head"><div><h2>Franchise Portfolio</h2><p>Track brand health, fandom, collector heat, generations and media.</p></div></div>${v05FranchiseRail()}</section><section class="section"><div class="section-head"><div><h2>Store Operations</h2><p>${v04Team().length} staff · ${Math.round(cs.satisfaction||78)}% satisfaction · ${Math.round(state.operations.cleanliness)}% cleanliness</p></div></div><div class="empire-ops-actions"><button onclick="openStaffSheet()">👥 MANAGE STAFF</button><button onclick="openHoursSheet()">🕒 OPENING HOURS</button><button onclick="openStoreUpgrades()">🏗️ SHOP IMPROVEMENTS</button></div></section><section class="section"><div class="section-head"><div><h2>Supplier Relationships</h2><p>Ordering consistently earns better wholesale pricing and access to limited product.</p></div></div>${Object.values(supplierTemplates).map(s=>supplierCard(s)).join('')}</section><section class="section"><div class="section-head"><div><h2>Franchise Displays</h2><p>Permanent branded displays boost normal sales and pair well with a rare vault attraction.</p></div></div><div class="display-grid">${Object.entries(displayDefs).map(([brand,d])=>displayCard(brand,d)).join('')}</div></section><section class="section"><div class="section-head"><div><h2>Business Upgrades</h2><p>Back-office improvements for your first location.</p></div></div>${upgrades.map(u=>upgradeCard(u)).join('')}</section><section class="section"><button class="secondary-btn wide" onclick="showLog()">VIEW EVENT HISTORY</button><button class="danger-btn wide" style="margin-top:9px" onclick="resetGame()">RESET LOCAL SAVE</button><p class="small-note">v${VERSION} · Local-first GitHub Pages save.</p></section>`;
}

function buildDaySummary(completedDay){
  const sold=Object.entries(state.inventory).map(([id,x])=>({p:getProduct(id),sold:x.soldToday||0,profit:x.lastProfit||0})).sort((a,b)=>b.sold-a.sold),best=sold[0],worst=[...sold].sort((a,b)=>a.sold-b.sold)[0],trend=[...products].sort((a,b)=>state.market[b.id].trend-state.market[a.id].trend)[0],cs=state.customerStats||v04DefaultCustomerStats(),hotBrand=Object.keys(brands).sort((a,b)=>state.franchises[b].health-state.franchises[a].health)[0];
  return {day:completedDay,date:gameDate(completedDay).label,sales:state.todaySales,profit:state.todayProfit,grossProfit:cs.grossProfit||0,customers:state.customersToday,buyers:cs.buyers||0,transactions:cs.transactions||0,avgBasket:cs.avgBasket||0,abandoned:cs.abandoned||0,satisfaction:cs.satisfaction||0,wages:cs.wages||0,maintenance:cs.maintenanceCost||0,shrinkUnits:cs.shrinkUnits||0,shrinkCost:cs.shrinkCost||0,restocked:cs.restocked||0,best:best?.p?.name||'No sales',bestQty:best?.sold||0,worst:worst?.p?.name||'—',worstQty:worst?.sold||0,trend:trend?.name||'—',trendMove:state.market[trend?.id]?.trend||0,hotBrand,hotBrandHealth:state.franchises[hotBrand].health};
}
function showDaySummary(summary,event,deliveries=[],franchiseEvent=null){
  const finds=state.collectorStats.lastFindDay===state.day?state.collectorStats.lastFinds:[];
  splash.innerHTML=`<div class="day-summary v04-summary"><div class="day-summary-top"><span class="kicker">${summary.date.toUpperCase()} COMPLETE</span><h2>${summary.profit>=0?'The tills closed in profit.':'Operations ate into the day.'}</h2><p>${seasonName(summary.day)} · ${summary.customers} visitors · ${summary.transactions} paying baskets.</p></div><div class="day-summary-grid"><div><span>SALES</span><b>${money(summary.sales)}</b><small>${money(summary.avgBasket)} avg basket</small></div><div><span>OPERATING PROFIT</span><b class="${summary.profit>=0?'profit':'loss'}">${money(summary.profit)}</b><small>${money(summary.grossProfit)} gross before ops</small></div><div><span>SATISFACTION</span><b>${Math.round(summary.satisfaction)}%</b><small>${summary.abandoned} abandoned queue</small></div><div><span>HOTTEST FRANCHISE</span><b>${brands[summary.hotBrand].name}</b><small>${Math.round(summary.hotBrandHealth)}/100 brand health</small></div></div><div class="ops-cost-breakdown"><div><span>👥 Wages</span><b>−${money(summary.wages)}</b></div><div><span>🧽 Maintenance</span><b>−${money(summary.maintenance)}</b></div><div><span>🕵️ Shrink / damage</span><b>−${money(summary.shrinkCost)}</b></div><div><span>📦 Restocked</span><b>${summary.restocked} units</b></div></div><div class="summary-news"><div><span>📈 MARKET</span><b>${summary.trend}</b><small>Momentum ${summary.trendMove>=0?'+':''}${summary.trendMove}</small></div>${deliveries.length?`<div><span>🚚 LAUNCH DELIVERY</span><b>${deliveries.join(', ')}</b><small>Standard pieces reached the stockroom; chase pulls moved to your vault.</small></div>`:''}${franchiseEvent?`<div class="major"><span>${franchiseEvent.icon} FRANCHISE EVENT</span><b>${franchiseEvent.title}</b><small>${franchiseEvent.body}</small></div>`:''}${event?`<div class="major"><span>${event.icon} MARKET EVENT</span><b>${event.title}</b><small>${event.body}</small></div>`:''}</div><button class="primary-btn wide" onclick="closeSplash()">SET UP ${gameDate(state.day).label.toUpperCase()} →</button></div>`;splash.classList.remove('hidden');
}
function endDay(){
  const completed=state.day;simulateCustomers();simulateMarket();simulateRivals();v05UpdateFranchisesAfterDay();const event=maybeMajorEvent(),franchiseEvent=v05MaybeFranchiseEvent(),summary=buildDaySummary(completed);state.lastSummary=summary;state.day++;v05HandleYearRollover();v05ProcessReleaseLaunches();const deliveries=processPreorders();replenishSuppliers();saveState();showDaySummary(summary,event,deliveries,franchiseEvent);
}

window.openFranchiseHub=openFranchiseHub;window.openCollectorVault=openCollectorVault;window.toggleCollectorDisplay=toggleCollectorDisplay;window.sellCollectorItem=sellCollectorItem;

setTimeout(()=>{
  if(state && !state.v05WelcomeShown){state.v05WelcomeShown=true;saveState();showSplash('THE TOY UNIVERSE IS ALIVE','Franchises now grow, stumble, reboot and become nostalgic. Supplier cartons can contain individually tracked chase variants — display them to attract collectors, hold them for future value or sell into the secondary market.','💎');}
},700);


/* v0.5.2 — Real Product Art Foundation welcome */
setTimeout(()=>{
  if(state && !state.v052ArtShown){
    state.v052ArtShown=true;
    state.v051VisualShown=true;
    state.v05WelcomeShown=true;
    saveState();
    showSplash('THE BIG BRANDS HAVE ARRIVED','The toy aisle now uses dedicated product art files and franchise key art. Luma Life is the fashion-doll powerhouse, GearMorph owns transforming mechs, Starward Frontier dominates space adventure, Nitro Street rules die-cast racing — each with original characters and packaging built for this universe.','✨');
  }
},450);


/* ==========================================================================\n   v0.5.3 — Premium Store World + Readable Mobile UI\n   ========================================================================== */
function v053StoreTier(){
  const ops=state.operations||{};
  const built=['secondCheckout','lighting','collectorCabinet','demoZone','security','giftWrap','biggerFloor'].filter(k=>ops[k]).length;
  const net=state.cash+inventoryValue();
  if(built>=6||net>=120000)return 'flagship';
  if(built>=4||net>=65000)return 'premium';
  if(built>=2||net>=38000)return 'neighbourhood';
  return 'starter';
}
function v053CustomerAsset(kind,index=0){
  const map={parent:'parent',kid:'kid',collector:'collector',bargain:'bargain',gift:'gift',impulse:'impulse'};
  return `assets/characters/${map[kind]||'parent'}-${(index%4)+1}.svg`;
}
function v053StaffAsset(role){return `assets/characters/staff-${['cashier','floor','stock','manager'].includes(role)?role:'floor'}.svg`;}
function v053ShelfSlot(p){
  if(!p)return `<div class="v053-empty-facing"><span>SOLD<br>OUT</span></div>`;
  const inv=state.inventory[p.id];
  return `<button class="v053-facing" onclick="openPriceSheet('${p.id}')">${packageArt(p,true)}<b>${p.name}</b><small>${inv?.shelfQty||0} on shelf</small></button>`;
}
function renderStoreWorld(owned,chatter,hottest){
  const tier=v053StoreTier(),front=[...owned].slice(0,6),cs=state.customerStats||v04DefaultCustomerStats();
  const team=v04Team().slice(0,4);
  const people=v04CustomerTypes().slice(0,5);
  const displayBrands=Object.keys(state.displays||{}).filter(b=>state.displays[b]);
  return `<div class="store-world v053-store-world tier-${tier}" style="background-image:url('assets/stores/${tier}.svg')">
    <div class="v053-store-title"><span>${tier==='starter'?'INDEPENDENT TOY SHOP':tier==='neighbourhood'?'NEIGHBOURHOOD TOY STORE':tier==='premium'?'PREMIUM TOY DESTINATION':'FLAGSHIP TOY STORE'}</span><b>${Math.round(cs.satisfaction||78)}% HAPPY SHOPPERS</b></div>
    <div class="v053-shelf v053-shelf-left">${[0,1,2].map(i=>v053ShelfSlot(front[i])).join('')}</div>
    <div class="v053-shelf v053-shelf-right">${[3,4,5].map(i=>v053ShelfSlot(front[i])).join('')}</div>
    <button class="v053-endcap" onclick="openBuySheet('${hottest.id}')" style="background-image:linear-gradient(0deg,rgba(8,6,15,.88),rgba(8,6,15,.1)),url('assets/heroes/${hottest.brand}.webp')"><span>🔥 HOT DROP</span><b>${getBrand(hottest.brand).name}</b><strong>${hottest.name}</strong></button>
    ${displayBrands.slice(0,2).map((b,i)=>`<button class="v053-brand-display display-${i}" onclick="openFranchiseHub('${b}')" style="background-image:linear-gradient(0deg,rgba(5,5,10,.8),rgba(5,5,10,.08)),url('assets/heroes/${b}.webp')"><img src="assets/brands/${b}.svg" alt="${brands[b].name}"><span>BRANDED DISPLAY</span></button>`).join('')}
    <div class="v053-people">${people.map((t,i)=>`<div class="v053-person customer c${i}"><img src="${v053CustomerAsset(t.id,i)}" alt="${t.name}">${i===1&&chatter[0]?`<div class="v053-bubble">${chatter[0].text}</div>`:''}</div>`).join('')}${team.map((s,i)=>`<div class="v053-person staff s${i}"><img src="${v053StaffAsset(s.role)}" alt="${s.name}"><span>${s.name}</span></div>`).join('')}</div>
    <div class="v053-upgrade-badges">${state.operations.secondCheckout?'<span>🧾 2 CHECKOUTS</span>':''}${state.operations.collectorCabinet?'<span>💎 COLLECTOR CABINET</span>':''}${state.operations.demoZone?'<span>🎮 DEMO ZONE</span>':''}${state.operations.giftWrap?'<span>🎁 GIFT WRAP</span>':''}</div>
  </div>`;
}
function v053CustomerMix(){
  const cs=state.customerStats||v04DefaultCustomerStats();
  return `<div class="v053-customer-rail">${v04CustomerTypes().map((t,i)=>`<div class="v053-customer-card"><img src="${v053CustomerAsset(t.id,i)}" alt="${t.name}"><div><b>${t.name}</b><span>${cs.types?.[t.id]||0} visited last day</span></div></div>`).join('')}</div>`;
}
function renderStore(){
  const hottest=products.filter(p=>v05LaunchDay(p)<=state.day+5&&lifecycleFor(p).key!=='discontinued').sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype)[0]||products[0];
  const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0).map(getProduct),front=[...owned].sort((a,b)=>(placementFactor(b.id)*state.market[b.id].hype)-(placementFactor(a.id)*state.market[a.id].hype)).slice(0,6),chatter=getChatter(),preorderCount=preorderUnits();
  screen.innerHTML=`<section class="store-world-wrap v053-wrap">${renderStoreWorld(front,chatter,hottest)}<div class="store-command-card v053-command"><div><span class="kicker">${gameDate().label.toUpperCase()} · ${seasonName()}</span><h2>${state.lastSummary?'Set up today’s shop floor.':'Your toy shop is ready.'}</h2><p>${state.lastSummary?`${state.lastSummary.customers} visitors · ${state.lastSummary.transactions||0} baskets · ${money(state.lastSummary.sales)} sales last day.`:'Watch real products leave the shelves, listen to shoppers and react to the market.'}</p></div><button class="primary-btn next-day-btn" onclick="endDay()">OPEN FOR ${state.operations.hours} HOURS →</button></div></section>
  <section class="section">${v04OperationsPanel()}</section>
  <section class="section"><div class="section-head"><div><h2>🔥 Today’s Big Product</h2><p>${getBrand(hottest.brand).name} · ${hypeLabel(state.market[hottest.id].hype)} demand</p></div><button onclick="openBuySheet('${hottest.id}')">View</button></div><div class="v053-product-hero" style="background-image:linear-gradient(90deg,rgba(9,7,15,.92),rgba(9,7,15,.22)),url('assets/heroes/${hottest.brand}.webp')" onclick="openBuySheet('${hottest.id}')"><div><img src="assets/brands/${hottest.brand}.svg" alt=""><h3>${hottest.name}</h3><p>${v05ProductMeta(hottest).edition} · ${state.supplierStock[hottest.id]} supplier units left</p><b>${money(effectiveWholesale(hottest))} wholesale</b></div><div class="v053-hero-pack">${packageArt(hottest,false)}</div></div></section>
  ${preorderCount?`<section class="section"><div class="preorder-strip" onclick="switchTab('market')"><span>🚚</span><div><b>${preorderCount} pre-order units incoming</b><small>Tap to review your committed launch stock.</small></div><strong>VIEW →</strong></div></section>`:''}
  <section class="section"><div class="section-head"><div><h2>Who’s Shopping?</h2><p>Different shoppers value price, hype, scarcity and service differently.</p></div></div>${v053CustomerMix()}</section>
  <section class="section"><div class="section-head"><div><h2>Customer Buzz</h2><p>Read the floor for clues before buying your next shipment.</p></div></div>${chatter.slice(0,3).map((c,i)=>`<div class="chatter v053-chatter"><img class="v053-chat-avatar" src="${v053CustomerAsset(v04CustomerTypes()[i%6].id,i)}" alt=""><div><p>“${c.text}”</p><small>${c.note}</small></div></div>`).join('')}</section>
  <section class="section"><div class="grid2"><div class="action-card accent visual-action" onclick="switchTab('market')"><div class="action-orb">📦</div><h3>Buy & Pre-order</h3><p>${inventoryUsed()} owned · ${preorderCount} incoming.</p></div><div class="action-card visual-action" onclick="openCollectorVault()"><div class="action-orb">💎</div><h3>Collector Vault</h3><p>${v05VaultHeld()} special pieces held.</p></div><div class="action-card visual-action" onclick="openStaffSheet()"><div class="action-orb">👥</div><h3>Manage Team</h3><p>${v04Team().length} staff working this store.</p></div><div class="action-card visual-action" onclick="switchTab('rivals')"><div class="action-orb">⚔️</div><h3>Rival Watch</h3><p>See prices, stock and competitor moves.</p></div></div></section>`;
}
function renderMarket(){
  const available=products.filter(p=>v05LaunchDay(p)<=state.day+7||lifecycleFor(p).key!=='rumour'||state.releaseOverrides[p.id]);
  const filtered=available.filter(p=>currentFilter==='all'||p.brand===currentFilter).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype);
  const hero=filtered[0]||products[0],preorders=Object.entries(state.preorders||{}).filter(([,x])=>x.qty>0);
  screen.innerHTML=`<section class="section"><div class="v053-market-hero" style="background-image:linear-gradient(90deg,rgba(7,6,12,.94),rgba(7,6,12,.22)),url('assets/heroes/${hero.brand}.webp')"><div><span class="kicker">BUYER’S MARKET · ${gameDate().label.toUpperCase()}</span><img src="assets/brands/${hero.brand}.svg" alt=""><h2>${hero.name}</h2><p>${hypeLabel(state.market[hero.id].hype)} demand · ${lifecycleFor(hero).name} · ${state.supplierStock[hero.id]} supplier units</p><button class="primary-btn" onclick="openBuySheet('${hero.id}')">${v05LaunchDay(hero)>state.day?'PRE-ORDER':'ORDER STOCK'} · ${money(effectiveWholesale(hero))}</button></div><div>${packageArt(hero,false)}</div></div>${preorders.length?`<div class="preorder-panel"><span class="kicker">INCOMING LAUNCH STOCK</span>${preorders.map(([id,x])=>`<div><b>${getProduct(id).name}</b><span>${x.qty} units · ${gameDate(v05LaunchDay(getProduct(id))).short}</span></div>`).join('')}</div>`:''}<div class="section-head"><div><h2>Shop the Supplier Floor</h2><p>Big product art, clear prices and less tiny text.</p></div></div><div class="toolbar"><button class="chip ${currentFilter==='all'?'active':''}" onclick="setFilter('all')">ALL BRANDS</button>${Object.entries(brands).map(([id,b])=>`<button class="chip ${currentFilter===id?'active':''}" onclick="setFilter('${id}')">${b.name}</button>`).join('')}</div><div class="market-grid">${filtered.map(v05MarketProductCard).join('')}</div></section>`;
}
function inventoryRow(p){
  const inv=state.inventory[p.id],m=state.market[p.id],margin=inv.price-(inv.avgCost||p.wholesale),pl=shelfPlacements[state.placements[p.id]||'main'],life=lifecycleFor(p);v04EnsureShelf(inv,p.id);const stockroom=Math.max(0,inv.qty-inv.shelfQty);
  return `<div class="inventory-row v053-inventory" style="${brandStyle(p)}" onclick="openPriceSheet('${p.id}')"><div class="inventory-thumb">${packageArt(p,true)}</div><div class="v053-inventory-copy"><span class="v053-brandline">${getBrand(p.brand).name} · ${life.icon} ${life.name}</span><h3>${p.name}</h3><p><b>${money(inv.price)}</b> · <span class="${margin>=0?'profit':'loss'}">${margin>=0?'+':''}${money(margin)} margin</span></p><small>${inv.shelfQty} on shelf · ${stockroom} in stockroom · ${heat(m.hype)} ${hypeLabel(m.hype)}</small></div><div class="stock-pill">${inv.qty}</div></div>`;
}
function renderProducts(){
  const owned=Object.keys(state.inventory).map(getProduct).filter(p=>p&&(state.inventory[p.id]?.qty||0)>0).sort((a,b)=>placementFactor(b.id)-placementFactor(a.id)||state.market[b.id].hype-state.market[a.id].hype);
  screen.innerHTML=`<section class="section"><div class="section-head"><div><h2>Your Toy Aisle</h2><p>Tap a product to change price or shelf position.</p></div></div><div class="merch-overview"><div><span>FRONT WINDOW</span><b>${placementCount('window')}/3</b></div><div><span>ENTRANCE</span><b>${placementCount('feature')}/4</b></div><div><span>STOCKROOM</span><b>${v04StockroomUnits()}</b></div></div><div class="restock-banner"><div><span>📦</span><div><b>${v04RestockCapacity()} units/day restock capacity</b><small>Stock in the back cannot sell until it reaches the shelf.</small></div></div><button onclick="manualRestock()">RESTOCK NOW</button></div>${owned.length?owned.map(p=>inventoryRow(p)).join(''):`<div class="empty"><div class="emoji">📦</div><h3>Your shelves are empty</h3><p>Order products from the Market.</p><button class="primary-btn" onclick="switchTab('market')">OPEN MARKET</button></div>`}</section>`;
}
setTimeout(()=>{if(state&&!state.v053VisualShown){state.v053VisualShown=true;state.v052ArtShown=true;state.v051VisualShown=true;state.v05WelcomeShown=true;saveState();showSplash('THE STORE JUST GOT BIGGER','v0.5.3 adds a redesigned store world with real customer and staff art, visible product facings, branded endcaps and a readability pass that makes the smallest game text significantly larger on iPhone.','🏬');}},350);
