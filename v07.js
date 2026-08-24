/* ========================================================================== 
   Toy Store Tycoon v0.7.0 — Multi-Store Expansion + Regional Management
   Branch-level inventory/staff/operations, managers, expansion and transfers.
   ========================================================================== */

const V07_LOCATIONS = {
  town:{key:'town',name:'Town Centre',type:'Independent High Street',icon:'🏙️',territory:'town',image:'starter.svg',traffic:1.00,rent:320,fitout:0,bond:0,note:'Balanced foot traffic with intense price competition.',likes:{gearmorph:1.05,lumalife:1.00,starward:1.04,pocketbeasts:1.04,mythicforge:.96,nitrostreet:1.06,littleworld:.92,ultraleague:1.02}},
  family:{key:'family',name:'Family Suburbs',type:'Suburban Family Store',icon:'🏡',territory:'family',image:'neighbourhood.svg',traffic:.96,rent:390,fitout:18000,bond:4000,note:'Parents reward service, range and dependable stock.',likes:{gearmorph:1.00,lumalife:1.12,starward:.92,pocketbeasts:1.18,mythicforge:.86,nitrostreet:1.04,littleworld:1.22,ultraleague:1.02}},
  collector:{key:'collector',name:'Collector District',type:'Collector Boutique',icon:'💎',territory:'collector',image:'premium.svg',traffic:.82,rent:440,fitout:24000,bond:6000,note:'Lower traffic, higher margins and strong premium demand.',likes:{gearmorph:1.10,lumalife:.88,starward:1.22,pocketbeasts:1.16,mythicforge:1.20,nitrostreet:1.02,littleworld:.70,ultraleague:1.18}},
  mall:{key:'mall',name:'Shopping Centre',type:'High-Traffic Mall Store',icon:'🛍️',territory:'mall',image:'premium.svg',traffic:1.34,rent:790,fitout:42000,bond:10000,note:'Huge traffic and huge rent. Big launches thrive here.',likes:{gearmorph:1.10,lumalife:1.14,starward:1.02,pocketbeasts:1.14,mythicforge:.90,nitrostreet:1.16,littleworld:1.04,ultraleague:1.08}},
  retailpark:{key:'retailpark',name:'Retail Park',type:'Large Format Toy Store',icon:'🏬',territory:'town',image:'flagship.svg',traffic:1.48,rent:980,fitout:60000,bond:12000,note:'Destination shopping with room for huge ranges and playsets.',likes:{gearmorph:1.12,lumalife:1.06,starward:1.08,pocketbeasts:1.04,mythicforge:1.06,nitrostreet:1.18,littleworld:1.12,ultraleague:1.08}}
};
const V07_MANAGER_TRAITS = {
  sales:{name:'Sales Driver',icon:'📈',desc:'+9% branch traffic',traffic:1.09},
  merch:{name:'Merchandising Ace',icon:'🪟',desc:'+12% product conversion',score:1.12},
  costs:{name:'Cost Cutter',icon:'✂️',desc:'−12% branch operating costs',cost:.88},
  collector:{name:'Collector Specialist',icon:'💎',desc:'+22% demand for scarce toys',collector:1.22},
  stock:{name:'Inventory Hawk',icon:'📦',desc:'Improves automatic shelf replenishment',restock:1.25},
  community:{name:'Community Hero',icon:'🤝',desc:'Better satisfaction and rating growth',service:8}
};
const V07_AUTONOMY={low:{name:'Low',factor:.84,note:'You make most decisions. Passive branch efficiency is reduced.'},medium:{name:'Medium',factor:1,note:'Manager handles staffing, replenishment and routine pricing.'},high:{name:'High',factor:1.08,note:'Manager actively prices and merchandises around local demand.'}};
const V07_STORE_FIELDS=['inventory','placements','operations','staff','customerStats','rating','reputation','todaySales','todayProfit','totalRevenue','totalProfit','upgrades','displays','preorders','lastSummary'];

function v07Clone(x){return JSON.parse(JSON.stringify(x));}
function v07EmptyOperations(){return {...v04DefaultOperations(),hours:10,cleanliness:100,maintenance:100};}
function v07DefaultTeam(storeId){
  const base=[['cashier','Mia'],['floor','Noah'],['stock','Sophie']];
  return {nextId:4,team:base.map((x,i)=>{const d=v04StaffRoles()[x[0]];return {id:`${storeId}-S${i+1}`,name:x[1],role:x[0],skill:62+i*4,service:68+i*3,fatigue:8,days:0,wage:d.wage};})};
}
function v07StoreFromGlobals(id='S001'){
  return {id,name:'Town Centre',locationKey:'town',openedDay:1,rent:V07_LOCATIONS.town.rent,manager:null,autonomy:'low',managerCandidates:[],
    inventory:state.inventory,placements:state.placements||{},operations:state.operations||v07EmptyOperations(),staff:state.staff||v07DefaultTeam(id),customerStats:state.customerStats||v04DefaultCustomerStats(),
    rating:state.rating||4.2,reputation:state.reputation||55,todaySales:state.todaySales||0,todayProfit:state.todayProfit||0,totalRevenue:state.totalRevenue||0,totalProfit:state.totalProfit||0,
    upgrades:state.upgrades||{stockroom:0,marketing:0,service:0,analytics:0},displays:state.displays||{},preorders:state.preorders||{},lastSummary:state.lastSummary||null,lastChainDay:0};
}
function v07NewStore(id,locationKey){
  const l=V07_LOCATIONS[locationKey];
  return {id,name:l.name,locationKey,openedDay:state.day,rent:l.rent,manager:null,autonomy:'low',managerCandidates:v07ManagerCandidates(id),inventory:{},placements:{},operations:v07EmptyOperations(),staff:v07DefaultTeam(id),customerStats:v04DefaultCustomerStats(),rating:4.15,reputation:52,todaySales:0,todayProfit:0,totalRevenue:0,totalProfit:0,upgrades:{stockroom:0,marketing:0,service:0,analytics:0},displays:{},preorders:{},lastSummary:null,lastChainDay:0};
}
function v07ManagerCandidates(storeId){
  const names=['Amelia Hart','Jordan Lee','Priya Shah','Marcus Reed','Sienna Cole','Theo Martin','Harper Quinn','Alex Chen'];
  const traits=Object.keys(V07_MANAGER_TRAITS),seed=[...storeId].reduce((a,c)=>a+c.charCodeAt(0),0);
  return [0,1,2].map(i=>{const trait=traits[(seed+i*2)%traits.length],skill=68+((seed+i*11)%23);return {id:`M-${storeId}-${i}`,name:names[(seed+i*3)%names.length],trait,skill,wage:210+Math.round(skill*1.25),signing:950+skill*11};});
}
function v07EnsureState(){
  if(!state.chain){
    const primary=v07StoreFromGlobals('S001');
    state.chain={activeStoreId:'S001',nextStore:2,stores:{S001:primary},transfers:[],chainSummary:null,totalExpansionSpend:0,v07WelcomeShown:false};
  }
  const c=state.chain;c.stores=c.stores||{};c.transfers=Array.isArray(c.transfers)?c.transfers:[];c.activeStoreId=c.activeStoreId&&c.stores[c.activeStoreId]?c.activeStoreId:Object.keys(c.stores)[0]||'S001';c.nextStore=Number.isFinite(c.nextStore)?c.nextStore:Object.keys(c.stores).length+1;
  Object.values(c.stores).forEach(s=>{const l=V07_LOCATIONS[s.locationKey]||V07_LOCATIONS.town;s.rent=Number.isFinite(s.rent)?s.rent:l.rent;s.operations={...v07EmptyOperations(),...(s.operations||{})};s.staff=s.staff||v07DefaultTeam(s.id);s.customerStats={...v04DefaultCustomerStats(),...(s.customerStats||{})};s.inventory=s.inventory||{};s.placements=s.placements||{};s.upgrades=s.upgrades||{stockroom:0,marketing:0,service:0,analytics:0};s.displays=s.displays||{};s.preorders=s.preorders||{};s.autonomy=s.autonomy||'low';s.managerCandidates=s.managerCandidates||v07ManagerCandidates(s.id);});
  v07ApplyStore(c.stores[c.activeStoreId]);
  state.version='0.7.0';
}
function v07SyncActiveStore(){
  if(!state.chain)return;const s=state.chain.stores[state.chain.activeStoreId];if(!s)return;
  V07_STORE_FIELDS.forEach(k=>{s[k]=state[k];});s.lastSyncedDay=state.day;
}
function v07ApplyStore(s){
  if(!s)return;V07_STORE_FIELDS.forEach(k=>{if(s[k]!==undefined)state[k]=s[k];});
}
function v07ActiveStore(){return state.chain?.stores?.[state.chain.activeStoreId];}
function v07Location(s=v07ActiveStore()){return V07_LOCATIONS[s?.locationKey]||V07_LOCATIONS.town;}
function v07AllStores(){v07SyncActiveStore();return Object.values(state.chain.stores);}
function v07ChainInventoryValue(){
  v07SyncActiveStore();let normal=0;Object.values(state.chain.stores).forEach(s=>Object.entries(s.inventory||{}).forEach(([id,x])=>{const p=getProduct(id);if(p)normal+=(x.qty||0)*(x.avgCost||p.wholesale);}));
  const vault=(state.collectorVault||[]).filter(x=>!x.sold).reduce((a,x)=>a+v05CollectorValue(x),0);return normal+vault;
}
function v07ChainRevenue(){return v07AllStores().reduce((a,s)=>a+(s.totalRevenue||0),0);}
function v07ChainProfit(){return v07AllStores().reduce((a,s)=>a+(s.totalProfit||0),0);}
function v07ChainUnits(){return v07AllStores().reduce((a,s)=>a+Object.values(s.inventory||{}).reduce((x,y)=>x+(y.qty||0),0),0);}

/* Persist the active branch before every save. */
const v07BaseSaveState=saveState;
saveState=function(){v07SyncActiveStore();v07BaseSaveState();};

/* Net worth becomes chain-wide while active-store capacity remains local. */
inventoryValue=function(){return v07ChainInventoryValue();};

function v07SwitchStore(id,tab=null){
  if(!state.chain.stores[id])return;v07SyncActiveStore();state.chain.activeStoreId=id;v07ApplyStore(state.chain.stores[id]);if(tab)state.tab=tab;saveState();render();toast(`${state.chain.stores[id].name} selected`);
}
function v07LocationStrip(mode='store'){
  const active=v07ActiveStore();return `<section class="v07-location-strip"><div><span class="kicker">${mode==='market'?'ORDER DESTINATION':'ACTIVE LOCATION'}</span><b>${v07Location(active).icon} ${active.name}</b><small>${v07Location(active).type}${mode==='market'?' · supplier orders and pre-orders go here':''}</small></div><div class="v07-store-tabs">${v07AllStores().map(s=>`<button class="${s.id===active.id?'active':''}" onclick="v07SwitchStore('${s.id}')">${V07_LOCATIONS[s.locationKey].icon}<span>${s.name}</span></button>`).join('')}</div></section>`;
}

/* Active-store demand also changes with its neighbourhood and manager. */
const v07BaseHoursFactor=v04HoursFactor;
v04HoursFactor=function(){const s=v07ActiveStore(),l=v07Location(s),zone=state.competition?.territories?.[l.territory],territory=zone?clamp(.86+(zone.player-18)/85,.76,1.35):1,trait=s?.manager?V07_MANAGER_TRAITS[s.manager.trait]:null;return v07BaseHoursFactor()*l.traffic*territory*(trait?.traffic||1);};
const v07BaseProductScore=v04ProductScore;
v04ProductScore=function(p,type){const s=v07ActiveStore(),l=v07Location(s),trait=s?.manager?V07_MANAGER_TRAITS[s.manager.trait]:null;let score=v07BaseProductScore(p,type)*(l.likes[p.brand]||1)*(trait?.score||1);if(trait?.collector&&p.scarcity>70)score*=trait.collector;return score;};
const v07BaseServiceScore=v04ServiceScore;
v04ServiceScore=function(){const s=v07ActiveStore(),trait=s?.manager?V07_MANAGER_TRAITS[s.manager.trait]:null;return clamp(v07BaseServiceScore()+(trait?.service||0),0,100);};
const v07BaseRestockCapacity=v04RestockCapacity;
v04RestockCapacity=function(){const s=v07ActiveStore(),trait=s?.manager?V07_MANAGER_TRAITS[s.manager.trait]:null;return Math.round(v07BaseRestockCapacity()*(trait?.restock||1));};

/* Active store pays its own occupancy and branch-manager costs inside the full simulation. */
const v07BaseSimulateCustomers=simulateCustomers;
simulateCustomers=function(){
  v07BaseSimulateCustomers();const s=v07ActiveStore(),l=v07Location(s),manager=s?.manager,trait=manager?V07_MANAGER_TRAITS[manager.trait]:null,costMult=trait?.cost||1,rent=roundMoney(l.rent*costMult),managerWage=manager?.wage||0,total=rent+managerWage;
  state.cash=roundMoney(state.cash-total);state.todayProfit=roundMoney(state.todayProfit-total);state.totalProfit=roundMoney(state.totalProfit-total);state.customerStats.rent=rent;state.customerStats.managerWage=managerWage;
};

/* Passive branch model: simpler than the active shop, but uses the same live market. */
function v07BranchProductScore(store,p){
  const l=V07_LOCATIONS[store.locationKey],inv=store.inventory[p.id];if(!inv||inv.qty<=0)return 0;
  const manager=store.manager,trait=manager?V07_MANAGER_TRAITS[manager.trait]:null,priceFactor=clamp(1.42-(inv.price/p.rrp)*.42,.55,1.22),hype=.55+state.market[p.id].hype/100,brand=(l.likes[p.brand]||1),scarcity=trait?.collector&&p.scarcity>70?trait.collector:1,placement=shelfPlacements[store.placements[p.id]||'main']?.factor||1;
  return hype*brand*priceFactor*placement*(trait?.score||1)*scarcity;
}
function v07PassiveRestock(store){
  const manager=store.manager,trait=manager?V07_MANAGER_TRAITS[manager.trait]:null,aut=V07_AUTONOMY[store.autonomy]||V07_AUTONOMY.low,budget=Math.round((manager?22:9)*aut.factor*(trait?.restock||1));let moved=0;
  Object.entries(store.inventory).sort((a,b)=>v07BranchProductScore(store,getProduct(b[0]))-v07BranchProductScore(store,getProduct(a[0]))).forEach(([id,inv])=>{if(moved>=budget)return;const target=Math.min(inv.qty,store.placements[id]==='window'?8:store.placements[id]==='feature'?7:5);inv.shelfQty=Number.isFinite(inv.shelfQty)?Math.min(inv.shelfQty,inv.qty):0;const q=Math.min(target-inv.shelfQty,inv.qty-inv.shelfQty,budget-moved);if(q>0){inv.shelfQty+=q;moved+=q;}});return moved;
}
function v07WeightedProduct(store){
  const items=Object.keys(store.inventory).map(getProduct).filter(Boolean).filter(p=>(store.inventory[p.id]?.shelfQty||0)>0);if(!items.length)return null;const scores=items.map(p=>Math.max(.01,v07BranchProductScore(store,p))),total=scores.reduce((a,b)=>a+b,0);let r=Math.random()*total;for(let i=0;i<items.length;i++){r-=scores[i];if(r<=0)return items[i];}return items[items.length-1];
}
function v07SimPassiveStore(store,completedDay){
  const l=V07_LOCATIONS[store.locationKey],manager=store.manager,trait=manager?V07_MANAGER_TRAITS[manager.trait]:null,aut=V07_AUTONOMY[store.autonomy]||V07_AUTONOMY.low,zone=state.competition?.territories?.[l.territory],territory=zone?clamp(.72+zone.player/48,.78,1.42):1,management=(manager?aut.factor:.67),campaign=1+(typeof v06CampaignBoost==='function'?v06CampaignBoost():0)/100;
  if(manager&&store.autonomy==='high')Object.entries(store.inventory).forEach(([id,inv])=>{const p=getProduct(id),life=lifecycleFor(p);if(life.key==='clearance')inv.price=roundMoney(Math.min(inv.price,p.rrp*.84));else if(state.market[id].hype>82)inv.price=roundMoney(Math.max(inv.price,p.rrp*1.06));else if(state.market[id].hype<45)inv.price=roundMoney(Math.min(inv.price,p.rrp*.94));});
  const restocked=v07PassiveRestock(store),baseTraffic=54*l.traffic*seasonFactor(completedDay)*territory*campaign*(.82+store.rating/5*.22)*(trait?.traffic||1)*management,traffic=Math.max(8,Math.round(baseTraffic*(.86+Math.random()*.28))),buyAttempts=Math.round(traffic*(.46+Math.random()*.12));
  let transactions=0,units=0,revenue=0,gross=0,stockouts=0;Object.values(store.inventory).forEach(inv=>{inv.soldToday=0;inv.lastProfit=0;});
  for(let i=0;i<buyAttempts;i++){
    const p=v07WeightedProduct(store);if(!p){stockouts++;continue;}const inv=store.inventory[p.id],chance=clamp(.48+v07BranchProductScore(store,p)*.13,0.45,.86);if(Math.random()>chance)continue;let basket=1+(Math.random()<.22?1:0);let txRevenue=0,txGross=0,txUnits=0;
    while(basket--){const q=v07WeightedProduct(store);if(!q)break;const qi=store.inventory[q.id];if(qi.qty<=0||qi.shelfQty<=0){stockouts++;continue;}qi.qty--;qi.shelfQty--;qi.soldToday=(qi.soldToday||0)+1;qi.totalSold=(qi.totalSold||0)+1;const margin=qi.price-(qi.avgCost||q.wholesale);qi.lastProfit=(qi.lastProfit||0)+margin;txRevenue+=qi.price;txGross+=margin;txUnits++;units++;}
    if(txUnits){transactions++;revenue+=txRevenue;gross+=txGross;}
  }
  const hours=store.operations.hours||10,wageFactor=hours===8?.84:hours===12?1.22:1,wages=roundMoney((store.staff?.team||[]).reduce((a,x)=>a+(x.wage||v04StaffRoles()[x.role]?.wage||120)*wageFactor,0)),managerWage=manager?manager.wage:0,maint=Math.round((55+hours*7)* (trait?.cost||1)),rent=roundMoney(l.rent*(trait?.cost||1)),costs=wages+managerWage+maint+rent,profit=roundMoney(gross-costs),satisfaction=clamp(74+(manager?manager.skill*.12:0)+(trait?.service||0)+(store.rating-4)*4-stockouts*.22,45,97);
  state.cash=roundMoney(state.cash+revenue-wages-managerWage-maint-rent);store.todaySales=roundMoney(revenue);store.todayProfit=profit;store.totalRevenue=roundMoney((store.totalRevenue||0)+revenue);store.totalProfit=roundMoney((store.totalProfit||0)+profit);store.rating=clamp(store.rating+(satisfaction-78)*.0018+(Math.random()-.5)*.012,2.8,5);store.reputation=clamp((store.reputation||50)+(satisfaction-76)*.025,0,100);store.customerStats={...v04DefaultCustomerStats(),buyers:transactions,transactions,basketUnits:units,avgBasket:transactions?roundMoney(revenue/transactions):0,abandoned:0,queuePeak:Math.ceil(traffic/22),satisfaction,wages,maintenanceCost:maint,rent,grossProfit:roundMoney(gross),restocked,stockoutMisses:stockouts,types:{}};store.lastSummary={day:completedDay,date:gameDate(completedDay).label,sales:store.todaySales,profit,grossProfit:roundMoney(gross),customers:traffic,transactions,avgBasket:store.customerStats.avgBasket,satisfaction,wages,maintenance:maint,rent,restocked,best:v07BestSeller(store),bestQty:v07BestQty(store)};store.lastChainDay=completedDay;
  (store.staff?.team||[]).forEach(x=>{x.days=(x.days||0)+1;x.fatigue=clamp((x.fatigue||0)+(hours===12?7:hours===8?2:4)-(manager?2:0),0,100);if(Math.random()<.15)x.skill=clamp((x.skill||60)+1,0,100);});
  return store.lastSummary;
}
function v07BestSeller(store){const e=Object.entries(store.inventory).sort((a,b)=>(b[1].soldToday||0)-(a[1].soldToday||0))[0];return e?getProduct(e[0])?.name||'—':'—';}
function v07BestQty(store){const e=Object.entries(store.inventory).sort((a,b)=>(b[1].soldToday||0)-(a[1].soldToday||0))[0];return e?e[1].soldToday||0:0;}

function v07ProcessStorePreorders(store){
  const delivered=[];Object.entries({...store.preorders}).forEach(([id,x])=>{const p=getProduct(id);if(v05LaunchDay(p)>state.day)return;const unit=roundMoney((x.cost||0)/Math.max(1,x.qty))||x.unitCost||p.wholesale;if(!store.inventory[id])store.inventory[id]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:unit,shelfQty:0};const inv=store.inventory[id],old=inv.qty,oldCost=(inv.avgCost||p.wholesale)*old;inv.qty+=x.qty;inv.avgCost=roundMoney((oldCost+x.qty*unit)/Math.max(1,inv.qty));store.placements[id]=store.placements[id]||'main';delete store.preorders[id];delivered.push(`${store.name}: ${x.qty} × ${p.name}`);});return delivered;
}
function v07ProcessTransfers(){
  const arrivals=[];state.chain.transfers.forEach(t=>{if(t.status!=='transit'||t.etaDay>state.day)return;const dst=state.chain.stores[t.to],p=getProduct(t.productId);if(!dst||!p)return;t.status='delivered';if(!dst.inventory[p.id])dst.inventory[p.id]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:t.unitCost,shelfQty:0};const inv=dst.inventory[p.id],old=inv.qty,oldCost=(inv.avgCost||p.wholesale)*old;inv.qty+=t.qty;inv.avgCost=roundMoney((oldCost+t.qty*t.unitCost)/Math.max(1,inv.qty));dst.placements[p.id]=dst.placements[p.id]||'main';arrivals.push(`${t.qty} × ${p.name} → ${dst.name}`);});state.chain.transfers=state.chain.transfers.filter(t=>t.status==='transit'||state.day-t.etaDay<3);return arrivals;
}

const v07BaseEndDay=endDay;
endDay=function(){
  const completed=state.day,activeId=state.chain.activeStoreId;v07BaseEndDay();v07SyncActiveStore();const summaries=[];
  Object.values(state.chain.stores).forEach(s=>{if(s.id===activeId)return;summaries.push(v07SimPassiveStore(s,completed));});
  const passiveDeliveries=[];Object.values(state.chain.stores).forEach(s=>{if(s.id!==activeId)passiveDeliveries.push(...v07ProcessStorePreorders(s));});const transferArrivals=v07ProcessTransfers();
  const active=state.chain.stores[activeId],all=[active.lastSummary,...summaries].filter(Boolean),chainSales=roundMoney(all.reduce((a,x)=>a+(x.sales||0),0)),chainProfit=roundMoney(all.reduce((a,x)=>a+(x.profit||0),0)),chainCustomers=all.reduce((a,x)=>a+(x.customers||0),0);
  state.chain.chainSummary={day:completed,sales:chainSales,profit:chainProfit,customers:chainCustomers,stores:all.length,passiveDeliveries,transferArrivals};saveState();v07ExtendDaySplash();
};
function v07ExtendDaySplash(){
  const s=state.chain.chainSummary;if(!s)return;const box=splash.querySelector('.day-summary-grid');if(box)box.insertAdjacentHTML('afterend',`<div class="v07-chain-summary"><div><span>CHAIN SALES</span><b>${money(s.sales)}</b></div><div><span>CHAIN PROFIT</span><b class="${s.profit>=0?'profit':'loss'}">${money(s.profit)}</b></div><div><span>ALL STORES</span><b>${s.stores}</b></div><div><span>CHAIN VISITORS</span><b>${s.customers}</b></div></div>${(s.transferArrivals.length||s.passiveDeliveries.length)?`<div class="v07-arrivals"><b>🚚 Regional logistics</b><span>${[...s.transferArrivals,...s.passiveDeliveries].join(' · ')}</span></div>`:''}`);
  const costs=splash.querySelector('.ops-cost-breakdown');const active=v07ActiveStore();if(costs&&active?.customerStats?.rent)costs.insertAdjacentHTML('beforeend',`<div><span>🏬 Store rent</span><b>−${money(active.customerStats.rent)}</b></div>${active.customerStats.managerWage?`<div><span>👔 Branch manager</span><b>−${money(active.customerStats.managerWage)}</b></div>`:''}`);
}

/* Managers */
function v07OpenManagerSheet(storeId){
  v07SyncActiveStore();const s=state.chain.stores[storeId];if(!s)return;const loc=V07_LOCATIONS[s.locationKey];
  if(s.manager){const t=V07_MANAGER_TRAITS[s.manager.trait];sheetContent.innerHTML=`<h2>👔 ${s.name} Manager</h2><div class="v07-manager-hero"><span>${t.icon}</span><div><h3>${s.manager.name}</h3><p>${t.name} · skill ${s.manager.skill}/100</p><b>${t.desc}</b><small>${money(s.manager.wage)} daily management salary</small></div></div><div class="field-label">AUTONOMY</div><div class="v07-autonomy">${Object.entries(V07_AUTONOMY).map(([k,a])=>`<button class="${s.autonomy===k?'active':''}" onclick="v07SetAutonomy('${storeId}','${k}')"><b>${a.name}</b><span>${a.note}</span></button>`).join('')}</div><button class="danger-btn wide" onclick="v07DismissManager('${storeId}')">DISMISS MANAGER</button><button class="secondary-btn wide" onclick="closeSheet()">DONE</button>`;}
  else{if(!s.managerCandidates?.length)s.managerCandidates=v07ManagerCandidates(storeId);sheetContent.innerHTML=`<h2>👔 Hire a Store Manager</h2><p class="subtle">Without a manager, branches you are not actively running operate at reduced efficiency.</p><div class="v07-manager-list">${s.managerCandidates.map(m=>{const t=V07_MANAGER_TRAITS[m.trait];return `<button onclick="v07HireManager('${storeId}','${m.id}')"><span>${t.icon}</span><div><b>${m.name}</b><small>${t.name} · skill ${m.skill}/100</small><p>${t.desc}</p></div><strong>${money(m.signing)}<small>sign-on</small></strong></button>`}).join('')}</div><button class="secondary-btn wide" onclick="closeSheet()">NOT NOW</button>`;}
  openSheet();
}
function v07HireManager(storeId,mid){const s=state.chain.stores[storeId],m=s?.managerCandidates?.find(x=>x.id===mid);if(!s||!m)return;if(state.cash<m.signing)return toast(`You need ${money(m.signing)}`);state.cash=roundMoney(state.cash-m.signing);s.manager={...m};s.autonomy='medium';s.managerCandidates=[];state.eventLog.unshift(`Day ${state.day}: ${m.name} appointed manager of ${s.name}.`);saveState();v07OpenManagerSheet(storeId);toast(`${m.name} appointed`);}
function v07SetAutonomy(storeId,level){const s=state.chain.stores[storeId];if(!s?.manager)return toast('Hire a manager first');s.autonomy=level;saveState();v07OpenManagerSheet(storeId);}
function v07DismissManager(storeId){const s=state.chain.stores[storeId];if(!s?.manager)return;if(!confirm(`Dismiss ${s.manager.name} from ${s.name}?`))return;s.manager=null;s.autonomy='low';s.managerCandidates=v07ManagerCandidates(storeId);saveState();v07OpenManagerSheet(storeId);toast('Manager dismissed');}

/* Expansion */
function v07OpenLocation(locationKey){
  const l=V07_LOCATIONS[locationKey];if(!l||locationKey==='town')return;if(v07AllStores().some(s=>s.locationKey===locationKey))return toast('You already operate this location');const cost=l.fitout+l.bond;if(state.cash<cost)return toast(`You need ${money(cost)} to open ${l.name}`);if(!confirm(`Open ${l.name} for ${money(cost)}? Daily rent will be ${money(l.rent)}.`))return;
  const id=`S${String(state.chain.nextStore++).padStart(3,'0')}`;state.cash=roundMoney(state.cash-cost);state.chain.stores[id]=v07NewStore(id,locationKey);state.chain.totalExpansionSpend=roundMoney((state.chain.totalExpansionSpend||0)+cost);state.marketShare=clamp(state.marketShare+1.2,1,80);const z=state.competition?.territories?.[l.territory];if(z)z.player=clamp(z.player+2,3,60);state.eventLog.unshift(`Day ${state.day}: Opened ${l.name} — ${money(cost)} fit-out and bond.`);saveState();renderEmpire();toast(`${l.name} opened`);
}

/* Stock transfers */
function v07TransferPickSource(fromId){v07SyncActiveStore();const from=state.chain.stores[fromId];if(!from)return;const others=v07AllStores().filter(s=>s.id!==fromId);sheetContent.innerHTML=`<h2>🚚 Move Stock from ${from.name}</h2><p class="subtle">Choose the receiving store. Transfers arrive next trading day and preserve the original cost basis.</p><div class="v07-destination-list">${others.map(s=>`<button onclick="v07OpenTransferSheet('${fromId}','${s.id}')"><span>${V07_LOCATIONS[s.locationKey].icon}</span><div><b>${s.name}</b><small>${V07_LOCATIONS[s.locationKey].type}</small></div><strong>SELECT →</strong></button>`).join('')||'<div class="empty">Open a second location before transferring stock.</div>'}</div><button class="secondary-btn wide" onclick="closeSheet()">CANCEL</button>`;openSheet();}
function v07OpenTransferSheet(fromId,toId){const from=state.chain.stores[fromId],to=state.chain.stores[toId];if(!from||!to)return;const items=Object.entries(from.inventory||{}).filter(([,x])=>x.qty>0).map(([id,x])=>({p:getProduct(id),inv:x})).filter(x=>x.p);sheetContent.innerHTML=`<h2>📦 ${from.name} → ${to.name}</h2><p class="subtle">Transfer cost is ${money(35)} plus ${money(1.5)} per unit. Arrival: ${gameDate(state.day+1).short}.</p><div class="v07-transfer-products">${items.map(({p,inv})=>`<div><div class="inventory-thumb">${packageArt(p,true)}</div><span><b>${p.name}</b><small>${inv.qty} available · ${money(inv.avgCost||p.wholesale)} cost basis</small></span><button onclick="v07MoveStock('${fromId}','${toId}','${p.id}',${Math.min(5,inv.qty)})">MOVE ${Math.min(5,inv.qty)}</button></div>`).join('')||'<div class="empty">No stock is available to transfer.</div>'}</div><button class="secondary-btn wide" onclick="v07TransferPickSource('${fromId}')">BACK</button>`;openSheet();}
function v07MoveStock(fromId,toId,productId,qty){const from=state.chain.stores[fromId],to=state.chain.stores[toId],inv=from?.inventory?.[productId],p=getProduct(productId);if(!from||!to||!inv||!p)return;qty=Math.min(qty,inv.qty);const cost=roundMoney(35+qty*1.5);if(state.cash<cost)return toast(`You need ${money(cost)} for transfer freight`);state.cash-=cost;inv.qty-=qty;inv.shelfQty=Math.min(inv.shelfQty||0,inv.qty);const unitCost=inv.avgCost||p.wholesale;state.chain.transfers.push({id:`T${Date.now().toString(36)}`,from:fromId,to:toId,productId,qty,unitCost,cost,createdDay:state.day,etaDay:state.day+1,status:'transit'});state.eventLog.unshift(`Day ${state.day}: Sent ${qty} × ${p.name} from ${from.name} to ${to.name}.`);saveState();v07OpenTransferSheet(fromId,toId);toast(`${qty} units are in transit`);}

function v07StoreCard(s){const l=V07_LOCATIONS[s.locationKey],sum=s.lastSummary,units=Object.values(s.inventory||{}).reduce((a,x)=>a+(x.qty||0),0),mgr=s.manager;return `<article class="v07-store-card ${s.id===state.chain.activeStoreId?'active':''}"><div class="v07-store-art" style="background-image:linear-gradient(0deg,rgba(7,6,12,.72),rgba(7,6,12,.05)),url('assets/stores/${l.image}')"><span>${l.icon}</span><b>${l.type}</b>${s.id===state.chain.activeStoreId?'<em>ACTIVE</em>':''}</div><div class="v07-store-body"><small>${l.name.toUpperCase()} · OPENED DAY ${s.openedDay}</small><h3>${s.name}</h3><p>${l.note}</p><div class="v07-store-kpis"><div><span>LAST SALES</span><b>${money(sum?.sales||0)}</b></div><div><span>LAST PROFIT</span><b class="${(sum?.profit||0)>=0?'profit':'loss'}">${money(sum?.profit||0)}</b></div><div><span>RATING</span><b>${(s.rating||4.1).toFixed(1)}★</b></div><div><span>STOCK</span><b>${units}</b></div></div><div class="v07-manager-line"><span>${mgr?V07_MANAGER_TRAITS[mgr.trait].icon:'👤'}</span><div><b>${mgr?mgr.name:'No branch manager'}</b><small>${mgr?`${V07_MANAGER_TRAITS[mgr.trait].name} · ${V07_AUTONOMY[s.autonomy].name} autonomy`:'Passive efficiency reduced until you appoint one.'}</small></div></div><div class="button-row"><button class="primary-btn" onclick="v07SwitchStore('${s.id}','store')">MANAGE STORE</button><button class="secondary-btn" onclick="v07OpenManagerSheet('${s.id}')">MANAGER</button><button class="secondary-btn" onclick="v07TransferPickSource('${s.id}')">MOVE STOCK</button></div></div></article>`;}
function v07ExpansionCard(key,l){const owned=v07AllStores().some(s=>s.locationKey===key),cost=l.fitout+l.bond;return `<article class="v07-expansion ${owned?'owned':''}"><div class="v07-expansion-art" style="background-image:linear-gradient(0deg,rgba(7,6,12,.82),rgba(7,6,12,.08)),url('assets/stores/${l.image}')"><span>${l.icon}</span><b>${l.name}</b></div><div><h3>${l.type}</h3><p>${l.note}</p><div class="v07-cost-row"><span>Fit-out <b>${money(l.fitout)}</b></span><span>Bond <b>${money(l.bond)}</b></span><span>Daily rent <b>${money(l.rent)}</b></span></div><button class="primary-btn wide" ${owned?'disabled':''} onclick="v07OpenLocation('${key}')">${owned?'LOCATION OPEN':'OPEN STORE · '+money(cost)}</button></div></article>`;}
function v07TransferQueue(){const q=state.chain.transfers.filter(t=>t.status==='transit');return q.length?`<div class="v07-transfer-queue">${q.map(t=>{const from=state.chain.stores[t.from],to=state.chain.stores[t.to],p=getProduct(t.productId);return `<div><span>🚚</span><b>${t.qty} × ${p.name}</b><small>${from.name} → ${to.name} · arrives ${gameDate(t.etaDay).short}</small></div>`}).join('')}</div>`:`<div class="v07-no-transfer">No stock transfers are currently in transit.</div>`;}

/* UI wrappers */
const v07BaseRenderStore=renderStore;
renderStore=function(){v07BaseRenderStore();screen.insertAdjacentHTML('afterbegin',v07LocationStrip('store'));};
const v07BaseRenderMarket=renderMarket;
renderMarket=function(){v07BaseRenderMarket();screen.insertAdjacentHTML('afterbegin',v07LocationStrip('market'));};
const v07BaseRenderProducts=renderProducts;
renderProducts=function(){v07BaseRenderProducts();screen.insertAdjacentHTML('afterbegin',v07LocationStrip('products'));};
const v07BaseRenderEmpire=renderEmpire;
renderEmpire=function(){
  v07SyncActiveStore();v07BaseRenderEmpire();const hero=screen.querySelector('.empire-hero');if(!hero)return;const stores=v07AllStores(),chainProfit=v07ChainProfit(),chainRevenue=v07ChainRevenue();hero.insertAdjacentHTML('afterend',`<section class="section v07-chain-section"><div class="v07-chain-hero"><div><span class="kicker">REGIONAL CHAIN · ${stores.length} ${stores.length===1?'LOCATION':'LOCATIONS'}</span><h2>${stores.length===1?'Your first expansion is waiting.':'You are running a toy-store chain.'}</h2><p>Each location now owns its own stock, staff, rent, reputation and local demand. Move inventory to where it will sell fastest.</p></div><div class="v07-chain-total"><span>CHAIN SALES</span><b>${money(chainRevenue)}</b><small>${money(chainProfit)} lifetime operating profit</small></div></div><div class="v07-chain-kpis"><div><span>LOCATIONS</span><b>${stores.length}</b></div><div><span>STOCK ACROSS CHAIN</span><b>${v07ChainUnits()}</b></div><div><span>CHAIN STOCK VALUE</span><b>${money(v07ChainInventoryValue())}</b></div><div><span>EXPANSION SPEND</span><b>${money(state.chain.totalExpansionSpend||0)}</b></div></div></section><section class="section"><div class="section-head"><div><h2>Your Locations</h2><p>Tap into any branch and run it directly, or appoint a manager to handle daily operations.</p></div></div><div class="v07-store-grid">${stores.map(v07StoreCard).join('')}</div></section><section class="section"><div class="section-head"><div><h2>Regional Stock Transfers</h2><p>Move hot products between stores instead of letting one branch sell out while another sits on stock.</p></div></div>${v07TransferQueue()}</section><section class="section"><div class="section-head"><div><h2>Expansion Opportunities</h2><p>Every location has different traffic, rent and product preferences. Expanding too fast can destroy your cash position.</p></div></div><div class="v07-expansion-grid">${Object.entries(V07_LOCATIONS).filter(([k])=>k!=='town').map(([k,l])=>v07ExpansionCard(k,l)).join('')}</div></section>`);
};

/* Make the active-location context visible in the app header. */
const v07BaseUpdateStats=updateStats;
updateStats=function(){v07BaseUpdateStats();const s=v07ActiveStore(),date=document.getElementById('dayStat');if(s&&date)date.textContent=`${gameDate().short} · ${V07_LOCATIONS[s.locationKey].icon}`;};

/* Global exposure */
window.v07SwitchStore=v07SwitchStore;window.v07OpenManagerSheet=v07OpenManagerSheet;window.v07HireManager=v07HireManager;window.v07SetAutonomy=v07SetAutonomy;window.v07DismissManager=v07DismissManager;window.v07OpenLocation=v07OpenLocation;window.v07TransferPickSource=v07TransferPickSource;window.v07OpenTransferSheet=v07OpenTransferSheet;window.v07MoveStock=v07MoveStock;

v07EnsureState();saveState();render();
setTimeout(()=>{if(state&&!state.chain.v07WelcomeShown){state.chain.v07WelcomeShown=true;saveState();showSplash('YOUR FIRST STORE CAN BECOME A CHAIN','Open new locations with different customer mixes, move stock between branches and appoint managers with their own strengths. The Empire screen is now your regional command centre.','🏬');}},450);
