/* ========================================================================== 
   Toy Store Tycoon v0.8.2 — Premium Shelf + Store Presentation
   Central buying, purchase orders, warehouse inventory, forecasts,
   replenishment rules and branch delivery logistics.
   ========================================================================== */

const V08_SHIP_MODES={
  express:{name:'Express',icon:'⚡',days:0,base:140,per:1.25,note:'Same-day emergency delivery.'},
  standard:{name:'Standard',icon:'🚚',days:1,base:70,per:.60,note:'Arrives next trading day.'},
  economy:{name:'Economy',icon:'📅',days:2,base:45,per:.35,note:'Cheapest scheduled delivery.'}
};
const V08_CAPACITY_LEVELS=[500,800,1200,1800];
const V08_PICKING_LEVELS=[90,150,240,360];
let v08BuyDestination='store';
let v08CentralQty=10;
let v08InboundMode='standard';
let v08DispatchQty=5;
let v08DispatchMode='standard';

function v08EnsureState(){
  if(!state.logistics){
    state.logistics={
      warehouse:{name:'Regional Distribution Centre',capacityLevel:0,pickingLevel:0,forecastLevel:0,fleetLevel:0,inventory:{}},
      inbound:[],outbound:[],rules:{},alerts:[],history:[],totalWarehouseOverhead:0,totalFreightSpend:0,totalUnitsMoved:0,lastDay:null,v08WelcomeShown:false
    };
  }
  const l=state.logistics;
  l.warehouse=l.warehouse||{};
  l.warehouse.name=l.warehouse.name||'Regional Distribution Centre';
  l.warehouse.capacityLevel=clamp(Number(l.warehouse.capacityLevel)||0,0,3);
  l.warehouse.pickingLevel=clamp(Number(l.warehouse.pickingLevel)||0,0,3);
  l.warehouse.forecastLevel=clamp(Number(l.warehouse.forecastLevel)||0,0,3);
  l.warehouse.fleetLevel=clamp(Number(l.warehouse.fleetLevel)||0,0,3);
  l.warehouse.inventory=l.warehouse.inventory||{};
  l.inbound=Array.isArray(l.inbound)?l.inbound:[];
  l.outbound=Array.isArray(l.outbound)?l.outbound:[];
  l.rules=l.rules||{};
  l.alerts=Array.isArray(l.alerts)?l.alerts:[];
  l.history=Array.isArray(l.history)?l.history:[];
  l.totalWarehouseOverhead=Number(l.totalWarehouseOverhead)||0;
  l.totalFreightSpend=Number(l.totalFreightSpend)||0;
  l.totalUnitsMoved=Number(l.totalUnitsMoved)||0;
  state.version='0.8.2';
}
function v08WarehouseCapacity(){return V08_CAPACITY_LEVELS[state.logistics.warehouse.capacityLevel]||500;}
function v08WarehouseUnits(){return Object.values(state.logistics.warehouse.inventory||{}).reduce((a,x)=>a+(x.qty||0),0);}
function v08InboundCommitted(){return state.logistics.inbound.filter(x=>x.status==='transit').reduce((a,x)=>a+(x.qty||0),0);}
function v08WarehouseFree(){return Math.max(0,v08WarehouseCapacity()-v08WarehouseUnits()-v08InboundCommitted());}
function v08WarehouseValue(){return Object.entries(state.logistics.warehouse.inventory||{}).reduce((a,[id,x])=>{const p=getProduct(id);return a+(p?(x.qty||0)*(x.avgCost||p.wholesale):0);},0);}
function v08WarehouseOverhead(){const w=state.logistics.warehouse;return 220+w.capacityLevel*55+w.pickingLevel*45+w.forecastLevel*35+w.fleetLevel*65;}
function v08PickingCapacity(){return V08_PICKING_LEVELS[state.logistics.warehouse.pickingLevel]||90;}
function v08ForecastDays(){return [7,10,14,21][state.logistics.warehouse.forecastLevel]||7;}
function v08FleetDiscount(){return Math.min(.24,state.logistics.warehouse.fleetLevel*.08);}
function v08BulkDiscount(qty){return qty>=100?.09:qty>=50?.06:qty>=25?.03:0;}
function v08CentralAllocation(p){return Math.min(180,Math.max(60,maxOrderAllocation(p)*2+state.logistics.warehouse.forecastLevel*20));}
function v08CentralUnitCost(p,qty){return roundMoney(effectiveWholesale(p)*(1-v08BulkDiscount(qty)));}
function v08InboundFreight(qty,mode,pre=false){const m=pre?V08_SHIP_MODES.standard:(V08_SHIP_MODES[mode]||V08_SHIP_MODES.standard);return roundMoney(m.base+m.per*qty);}
function v08OutboundFreight(qty,mode){const m=V08_SHIP_MODES[mode]||V08_SHIP_MODES.standard;return roundMoney((m.base+m.per*qty)*(1-v08FleetDiscount()));}
function v08WarehouseInv(id){return state.logistics.warehouse.inventory[id];}
function v08LaunchDay(p){return typeof v05LaunchDay==='function'?v05LaunchDay(p):(p.launchDay||1);}
function v08StoreUnits(store){return Object.values(store?.inventory||{}).reduce((a,x)=>a+(x.qty||0),0);}
function v08StoreCapacity(store){return 180+((store?.upgrades?.stockroom||0)*80);}
function v08PendingStoreUnits(storeId){return state.logistics.outbound.filter(x=>x.status==='transit'&&x.storeId===storeId).reduce((a,x)=>a+(x.qty||0),0);}
function v08StoreFree(store){return Math.max(0,v08StoreCapacity(store)-v08StoreUnits(store)-v08PendingStoreUnits(store.id));}
function v08ReceiveWarehouse(productId,qty,unitCost,preorder=false){
  const p=getProduct(productId);if(!p||qty<=0)return {regular:0,finds:0};
  const finds=typeof v05ExtractCollectorFinds==='function'?v05ExtractCollectorFinds(p,qty,unitCost,preorder):[];
  const regular=Math.max(0,qty-finds.length);if(!regular)return {regular:0,finds:finds.length};
  const wh=state.logistics.warehouse.inventory;
  if(!wh[productId])wh[productId]={qty:0,avgCost:unitCost};
  const inv=wh[productId],old=inv.qty||0,oldCost=(inv.avgCost||p.wholesale)*old;
  inv.qty=old+regular;inv.avgCost=roundMoney((oldCost+regular*unitCost)/Math.max(1,inv.qty));
  return {regular,finds:finds.length};
}
function v08ReceiveStore(store,productId,qty,unitCost){
  const p=getProduct(productId);if(!store||!p||qty<=0)return 0;
  const accept=Math.min(qty,Math.max(0,v08StoreCapacity(store)-v08StoreUnits(store)));if(accept<=0)return 0;
  store.inventory=store.inventory||{};store.placements=store.placements||{};
  if(!store.inventory[productId])store.inventory[productId]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:unitCost,shelfQty:0};
  const inv=store.inventory[productId],old=inv.qty||0,oldCost=(inv.avgCost||p.wholesale)*old;
  inv.qty=old+accept;inv.avgCost=roundMoney((oldCost+accept*unitCost)/Math.max(1,inv.qty));store.placements[productId]=store.placements[productId]||'main';
  return accept;
}
function v08PendingForStore(storeId,productId){return state.logistics.outbound.filter(x=>x.status==='transit'&&x.storeId===storeId&&x.productId===productId).reduce((a,x)=>a+x.qty,0);}
function v08AddAlert(icon,title,text,type='stock'){
  state.logistics.alerts.unshift({id:`L${Date.now().toString(36)}${Math.floor(Math.random()*999)}`,day:state.day,icon,title,text,type});
  state.logistics.alerts=state.logistics.alerts.slice(0,12);
}
function v08Log(text){state.logistics.history.unshift(`Day ${state.day}: ${text}`);state.logistics.history=state.logistics.history.slice(0,40);state.eventLog.unshift(`Day ${state.day}: ${text}`);}

/* Include distribution inventory/overhead in chain-level figures. */
const v08BaseChainInventoryValue=v07ChainInventoryValue;
v07ChainInventoryValue=function(){return v08BaseChainInventoryValue()+v08WarehouseValue();};
const v08BaseChainUnits=v07ChainUnits;
v07ChainUnits=function(){return v08BaseChainUnits()+v08WarehouseUnits();};
const v08BaseChainProfit=v07ChainProfit;
v07ChainProfit=function(){return roundMoney(v08BaseChainProfit()-(state.logistics?.totalWarehouseOverhead||0));};

/* ---------- Central buying ---------- */
function v08SetBuyDestination(dest){v08BuyDestination=dest==='warehouse'?'warehouse':'store';renderMarket();}
function v08BuyingRouteStrip(){
  const active=v07ActiveStore();
  return `<section class="v08-route-strip"><div><span class="kicker">PURCHASE ORDER DESTINATION</span><h3>${v08BuyDestination==='warehouse'?'🏭 Regional Distribution Centre':`${v07Location(active).icon} ${active.name}`}</h3><p>${v08BuyDestination==='warehouse'?`${v08WarehouseFree()} units of warehouse capacity free · bulk discounts at 25 / 50 / 100 units.`:'Direct branch delivery uses that store’s stockroom capacity.'}</p></div><div class="v08-route-buttons"><button class="${v08BuyDestination==='store'?'active':''}" onclick="v08SetBuyDestination('store')">🏪 DIRECT TO STORE</button><button class="${v08BuyDestination==='warehouse'?'active':''}" onclick="v08SetBuyDestination('warehouse')">🏭 BUY CENTRALLY</button></div></section>`;
}
const v08BaseOpenBuySheet=openBuySheet;
openBuySheet=function(id){if(v08BuyDestination!=='warehouse')return v08BaseOpenBuySheet(id);return v08OpenCentralBuySheet(id);};
function v08CentralMax(p){return Math.max(0,Math.min(state.supplierStock[p.id]||0,v08CentralAllocation(p),v08WarehouseFree()));}
function v08OpenCentralBuySheet(id){
  const p=getProduct(id);if(!p)return;const stock=state.supplierStock[id]||0,life=lifecycleFor(p),sup=supplierFor(p),pre=v08LaunchDay(p)>state.day,max=v08CentralMax(p);
  if(max<=0)return toast('No supplier stock or warehouse capacity');
  v08CentralQty=clamp(v08CentralQty||10,1,max);
  const unit=v08CentralUnitCost(p,v08CentralQty),freight=v08InboundFreight(v08CentralQty,v08InboundMode,pre),total=roundMoney(unit*v08CentralQty+freight),discount=Math.round(v08BulkDiscount(v08CentralQty)*100);
  sheetContent.innerHTML=`<div class="sheet-art package-sheet" style="${brandStyle(p)}">${packageArt(p,false)}</div><div class="market-tag-row"><span class="lifecycle-chip ${life.key}">${life.icon} ${life.name}</span><span class="supplier-chip">${sup.icon} ${sup.name}</span></div><h2>${p.name}</h2><div class="v08-destination-chip">🏭 REGIONAL DISTRIBUTION CENTRE</div><div class="metrics"><div class="metric"><span>Landed Toy Cost</span><strong id="v08UnitCost">${money(unit)}</strong></div><div class="metric"><span>RRP</span><strong>${money(p.rrp)}</strong></div><div class="metric"><span>Warehouse Free</span><strong>${v08WarehouseFree()}</strong></div></div><p class="subtle">Central orders unlock bulk buying discounts and let you allocate stock after demand becomes clearer.</p>${pre?`<div class="commit-warning">🔒 PRE-ORDER: paid now. The purchase order arrives at the Distribution Centre on launch day, ${gameDate(v08LaunchDay(p)).label}.</div>`:''}<div class="divider"></div><div class="field-label">ORDER QUANTITY · supplier ${stock} · central allocation ${v08CentralAllocation(p)}</div><div class="stepper"><button onclick="v08ChangeCentralQty('${id}',-1)">−</button><strong id="qtyValue">${v08CentralQty}</strong><button onclick="v08ChangeCentralQty('${id}',1)">+</button></div><div class="quick-qty"><button onclick="v08SetCentralQty('${id}',10)">10</button><button onclick="v08SetCentralQty('${id}',25)">25</button><button onclick="v08SetCentralQty('${id}',50)">50</button><button onclick="v08SetCentralQty('${id}',100)">100</button></div>${pre?'':`<div class="field-label">INBOUND DELIVERY</div><div class="v08-mode-grid">${Object.entries(V08_SHIP_MODES).map(([k,x])=>`<button class="${v08InboundMode===k?'active':''}" onclick="v08SetInboundMode('${id}','${k}')"><span>${x.icon}</span><b>${x.name}</b><small>${x.note}</small></button>`).join('')}</div>`}<div class="v08-order-total"><span><b id="v08BulkLabel">${discount?`${discount}% BULK DISCOUNT`:'STANDARD BUYING RATE'}</b><small id="v08FreightLabel">${money(freight)} inbound freight</small></span><strong id="v08OrderTotal">${money(total)}</strong></div><button class="primary-btn wide" onclick="v08BuyToWarehouse('${id}')">PLACE CENTRAL PO · ${money(total)}</button><button class="secondary-btn wide" onclick="closeSheet()">CANCEL</button>`;openSheet();
}
function v08RefreshCentralSheet(id){const p=getProduct(id);if(!p)return;const max=v08CentralMax(p);v08CentralQty=clamp(v08CentralQty,1,Math.max(1,max));v08OpenCentralBuySheet(id);}
function v08ChangeCentralQty(id,d){v08CentralQty+=d;v08RefreshCentralSheet(id);}
function v08SetCentralQty(id,q){v08CentralQty=q;v08RefreshCentralSheet(id);}
function v08SetInboundMode(id,mode){v08InboundMode=mode;v08OpenCentralBuySheet(id);}
function v08BuyToWarehouse(id){
  const p=getProduct(id),pre=v08LaunchDay(p)>state.day,max=v08CentralMax(p),qty=Math.min(v08CentralQty,max);if(!p||qty<=0)return toast('No supplier stock or warehouse capacity');
  const unit=v08CentralUnitCost(p,qty),freight=v08InboundFreight(qty,v08InboundMode,pre),productCost=roundMoney(unit*qty),total=roundMoney(productCost+freight);if(state.cash<total)return toast(`You need ${money(total)} for this purchase order`);
  state.cash=roundMoney(state.cash-total);state.supplierStock[id]-=qty;state.orderCount++;const sup=supplierStateFor(p);sup.totalSpend=roundMoney((sup.totalSpend||0)+productCost);sup.orders=(sup.orders||0)+1;sup.relationship=clamp(sup.relationship+.6+Math.min(2,qty/40),0,100);
  const landed=roundMoney(total/qty),mode=pre?'launch':v08InboundMode,eta=pre?v08LaunchDay(p):state.day+(V08_SHIP_MODES[v08InboundMode]?.days||0),po={id:`PO${Date.now().toString(36)}`,productId:id,qty,unitCost:landed,productUnit:unit,freight,total,placedDay:state.day,etaDay:eta,status:'transit',mode,preorder:pre,supplierId:sup.id||supplierFor(p).id};
  if(!pre&&v08InboundMode==='express'){po.status='delivered';const got=v08ReceiveWarehouse(id,qty,landed,false);v08Log(`Express central PO received — ${got.regular} shelf units of ${p.name}${got.finds?` + ${got.finds} collector pull${got.finds===1?'':'s'}`:''}.`);}else{state.logistics.inbound.push(po);v08Log(`Central PO placed — ${qty} × ${p.name}, arriving ${gameDate(eta).short}.`);}
  state.logistics.totalFreightSpend=roundMoney(state.logistics.totalFreightSpend+freight);saveState();closeSheet();render();toast(pre?`${qty} units committed to Distribution Centre`:`Purchase order placed for ${qty} units`);
}

/* ---------- Warehouse dispatch ---------- */
function v08OpenDispatchSheet(productId){
  const p=getProduct(productId),inv=v08WarehouseInv(productId);if(!p||!inv||inv.qty<=0)return toast('No warehouse stock available');
  const stores=v07AllStores();sheetContent.innerHTML=`<div class="v08-dispatch-head"><div class="inventory-thumb">${packageArt(p,true)}</div><div><span class="kicker">WAREHOUSE STOCK · ${inv.qty} UNITS</span><h2>${p.name}</h2><p>${money(inv.avgCost||p.wholesale)} landed warehouse cost per unit.</p></div></div><div class="field-label">SEND TO LOCATION</div><div class="v08-destination-list">${stores.map(s=>{const have=s.inventory?.[productId]?.qty||0,target=v08RuleTarget(s.id,productId)||0;return `<button ${v08StoreFree(s)<=0?'disabled':''} onclick="v08OpenDispatchDetail('${productId}','${s.id}')"><span>${V07_LOCATIONS[s.locationKey].icon}</span><div><b>${s.name}</b><small>${have} on hand · ${v08StoreFree(s)} free${target?` · target ${target}`:''}</small></div><strong>${v08StoreFree(s)>0?'SELECT →':'FULL'}</strong></button>`}).join('')}</div><button class="secondary-btn wide" onclick="closeSheet()">CANCEL</button>`;openSheet();
}
function v08OpenDispatchDetail(productId,storeId){
  const p=getProduct(productId),inv=v08WarehouseInv(productId),s=state.chain.stores[storeId];if(!p||!inv||!s)return;const max=Math.min(inv.qty,v08StoreFree(s),v08PickingCapacity());if(max<=0)return toast(`${s.name} has no stockroom capacity`);v08DispatchQty=Math.min(5,max);v08DispatchMode='standard';
  const target=v08RuleTarget(storeId,productId)||0;
  sheetContent.innerHTML=`<h2>🚚 ${p.name}</h2><p class="subtle">Regional Distribution Centre → ${s.name}</p><div class="v08-dispatch-summary"><div><span>WAREHOUSE</span><b>${inv.qty}</b></div><div><span>${s.name.toUpperCase()}</span><b>${s.inventory?.[productId]?.qty||0}</b></div><div><span>AUTO TARGET</span><b>${target||'OFF'}</b></div></div><div class="field-label">QUANTITY</div><div class="stepper"><button onclick="v08ChangeDispatchQty('${productId}','${storeId}',-1)">−</button><strong id="v08DispatchQty">${v08DispatchQty}</strong><button onclick="v08ChangeDispatchQty('${productId}','${storeId}',1)">+</button></div><div class="quick-qty"><button onclick="v08SetDispatchQty('${productId}','${storeId}',5)">5</button><button onclick="v08SetDispatchQty('${productId}','${storeId}',10)">10</button><button onclick="v08SetDispatchQty('${productId}','${storeId}',20)">20</button><button onclick="v08SetDispatchQty('${productId}','${storeId}',999)">MAX</button></div><div class="field-label">DELIVERY SPEED</div><div class="v08-mode-grid">${Object.entries(V08_SHIP_MODES).map(([k,x])=>`<button class="${v08DispatchMode===k?'active':''}" onclick="v08SetDispatchMode('${productId}','${storeId}','${k}')"><span>${x.icon}</span><b>${x.name}</b><small>${x.note}</small></button>`).join('')}</div><div class="v08-order-total"><span><b>DELIVERY COST</b><small id="v08DispatchEta">${V08_SHIP_MODES.standard.note}</small></span><strong id="v08DispatchCost">${money(v08OutboundFreight(v08DispatchQty,'standard'))}</strong></div><button class="primary-btn wide" onclick="v08ScheduleOutbound('${storeId}','${productId}',v08DispatchQty,v08DispatchMode)">DISPATCH STOCK</button><button class="secondary-btn wide" onclick="v08OpenDispatchSheet('${productId}')">BACK</button>`;openSheet();
}
function v08RefreshDispatch(productId,storeId){const inv=v08WarehouseInv(productId),store=state.chain.stores[storeId],max=Math.max(1,Math.min(inv?.qty||1,v08StoreFree(store),v08PickingCapacity()));v08DispatchQty=clamp(v08DispatchQty,1,max);const q=document.getElementById('v08DispatchQty'),c=document.getElementById('v08DispatchCost'),e=document.getElementById('v08DispatchEta');if(q)q.textContent=v08DispatchQty;if(c)c.textContent=money(v08OutboundFreight(v08DispatchQty,v08DispatchMode));if(e)e.textContent=V08_SHIP_MODES[v08DispatchMode].note;}
function v08ChangeDispatchQty(productId,storeId,d){v08DispatchQty+=d;v08RefreshDispatch(productId,storeId);}
function v08SetDispatchQty(productId,storeId,q){const inv=v08WarehouseInv(productId),store=state.chain.stores[storeId];v08DispatchQty=Math.min(q,inv?.qty||1,v08StoreFree(store),v08PickingCapacity());v08RefreshDispatch(productId,storeId);}
function v08SetDispatchMode(productId,storeId,mode){v08DispatchMode=mode;v08OpenDispatchDetail(productId,storeId);v08DispatchMode=mode;const buttons=[...document.querySelectorAll('.v08-mode-grid button')];buttons.forEach((b,i)=>b.classList.toggle('active',Object.keys(V08_SHIP_MODES)[i]===mode));v08RefreshDispatch(productId,storeId);}
function v08ScheduleOutbound(storeId,productId,qty,mode='standard',automatic=false){
  const p=getProduct(productId),inv=v08WarehouseInv(productId),store=state.chain.stores[storeId],m=V08_SHIP_MODES[mode]||V08_SHIP_MODES.standard;if(!p||!inv||!store)return false;qty=Math.max(0,Math.min(qty,inv.qty,v08PickingCapacity(),v08StoreFree(store)));if(qty<=0)return false;
  const freight=v08OutboundFreight(qty,mode);if(state.cash<freight){if(!automatic)toast(`You need ${money(freight)} for delivery`);return false;}
  state.cash=roundMoney(state.cash-freight);inv.qty-=qty;const base=inv.avgCost||p.wholesale,landed=roundMoney(base+freight/qty);if(inv.qty<=0)delete state.logistics.warehouse.inventory[productId];
  state.logistics.totalFreightSpend=roundMoney(state.logistics.totalFreightSpend+freight);state.logistics.totalUnitsMoved+=qty;
  if(m.days===0){v08ReceiveStore(store,productId,qty,landed);v08Log(`${automatic?'Automatic ':''}express dispatch delivered ${qty} × ${p.name} to ${store.name}.`);}
  else{state.logistics.outbound.push({id:`DO${Date.now().toString(36)}${Math.floor(Math.random()*99)}`,storeId,productId,qty,unitCost:landed,freight,mode,createdDay:state.day,etaDay:state.day+m.days,status:'transit',automatic});v08Log(`${automatic?'Automatic ':''}dispatch sent ${qty} × ${p.name} to ${store.name}; ETA ${gameDate(state.day+m.days).short}.`);}
  saveState();if(!automatic){closeSheet();v08RenderDistributionCentre();toast(`${qty} units dispatched to ${store.name}`);}return true;
}

/* ---------- Automatic replenishment ---------- */
function v08RuleTarget(storeId,productId){return state.logistics.rules?.[storeId]?.[productId]||0;}
function v08SetRule(storeId,productId,target){state.logistics.rules[storeId]=state.logistics.rules[storeId]||{};if(target<=0)delete state.logistics.rules[storeId][productId];else state.logistics.rules[storeId][productId]=target;saveState();v08OpenRulesSheet(storeId);}
function v08OpenRulesSheet(storeId){
  const store=state.chain.stores[storeId];if(!store)return;const candidates=products.filter(p=>(store.inventory?.[p.id]?.qty||0)>0||(v08WarehouseInv(p.id)?.qty||0)>0).sort((a,b)=>(state.market[b.id].hype)-(state.market[a.id].hype)).slice(0,16);
  sheetContent.innerHTML=`<h2>🔄 ${store.name} Replenishment</h2><p class="subtle">Set a target. The Distribution Centre sends stock automatically when branch inventory plus in-transit units falls below it.</p><div class="v08-rule-list">${candidates.map(p=>{const target=v08RuleTarget(storeId,p.id),have=store.inventory?.[p.id]?.qty||0,wh=v08WarehouseInv(p.id)?.qty||0;return `<div><div class="inventory-thumb">${packageArt(p,true)}</div><span><b>${p.name}</b><small>${have} branch · ${wh} warehouse</small></span><div class="v08-rule-buttons">${[0,5,10,20].map(n=>`<button class="${target===n?'active':''}" onclick="v08SetRule('${storeId}','${p.id}',${n})">${n||'OFF'}</button>`).join('')}</div></div>`}).join('')||'<div class="empty">Buy stock into the Distribution Centre or this branch first.</div>'}</div><button class="secondary-btn wide" onclick="closeSheet()">DONE</button>`;openSheet();
}
function v08AutoReplenish(){
  let pickingLeft=v08PickingCapacity(),moved=0,shipments=0,cost=0;const warnings=[];
  for(const store of Object.values(state.chain.stores)){
    const rules=state.logistics.rules?.[store.id]||{};
    for(const [pid,target] of Object.entries(rules)){
      if(pickingLeft<=0)break;const wh=v08WarehouseInv(pid),p=getProduct(pid);if(!wh||!p)continue;const have=(store.inventory?.[pid]?.qty||0)+v08PendingForStore(store.id,pid),need=Math.max(0,target-have);if(need<=0)continue;const qty=Math.min(need,wh.qty,pickingLeft,v08StoreFree(store));if(qty<=0)continue;const mode=state.logistics.warehouse.fleetLevel>=2?'standard':'economy',freight=v08OutboundFreight(qty,mode);if(state.cash<freight){warnings.push(`Could not auto-send ${p.name} to ${store.name}: freight cash needed.`);continue;}if(v08ScheduleOutbound(store.id,pid,qty,mode,true)){pickingLeft-=qty;moved+=qty;shipments++;cost+=freight;}
    }
  }
  if(moved)v08AddAlert('🔄','Automatic replenishment dispatched',`${moved} units across ${shipments} branch deliveries.`,'replenishment');
  warnings.forEach(x=>v08AddAlert('⚠️','Replenishment paused',x,'cash'));
  return {moved,shipments,cost};
}

/* ---------- Forecasting ---------- */
function v08ForecastUnits(store,p,days=v08ForecastDays()){
  const l=V07_LOCATIONS[store.locationKey]||V07_LOCATIONS.town,life=lifecycleFor(p),h=state.market[p.id]?.hype||50,brand=l.likes[p.brand]||1,season=seasonFactor(),fr=typeof v05FranchiseFactor==='function'?v05FranchiseFactor(p.brand):1,base=(h/13)*l.traffic*brand*life.factor*fr*season;
  return Math.max(0,Math.round(base*(days/7)));
}
function v08ForecastRows(limit=8){
  const rows=[];for(const store of Object.values(state.chain.stores)){for(const p of products){if(lifecycleFor(p).key==='discontinued'||v08LaunchDay(p)>state.day+v08ForecastDays())continue;const projected=v08ForecastUnits(store,p),have=(store.inventory?.[p.id]?.qty||0)+v08PendingForStore(store.id,p.id),gap=projected-have;if(gap>2)rows.push({store,p,projected,have,gap});}}
  return rows.sort((a,b)=>b.gap-a.gap||state.market[b.p.id].hype-state.market[a.p.id].hype).slice(0,limit);
}
function v08ForecastCards(){const rows=v08ForecastRows();return rows.length?rows.map(x=>`<div class="v08-forecast-card"><div class="inventory-thumb">${packageArt(x.p,true)}</div><div><span>${V07_LOCATIONS[x.store.locationKey].icon} ${x.store.name}</span><b>${x.p.name}</b><small>${x.have} covered · ${x.projected} projected over ${v08ForecastDays()} days</small></div><strong>−${x.gap}<small>RISK</small></strong></div>`).join(''):`<div class="v08-empty-flow">Forecasting sees no major branch shortages right now.</div>`;}

/* ---------- Daily logistics processing ---------- */
function v08ProcessInbound(){
  const arrivals=[];for(const po of state.logistics.inbound){if(po.status!=='transit'||po.etaDay>state.day)continue;po.status='delivered';const p=getProduct(po.productId),got=v08ReceiveWarehouse(po.productId,po.qty,po.unitCost,po.preorder);arrivals.push(`${got.regular} × ${p?.name||'product'} → Distribution Centre${got.finds?` (+${got.finds} collector pull${got.finds===1?'':'s'})`:''}`);}
  state.logistics.inbound=state.logistics.inbound.filter(x=>x.status==='transit'||state.day-x.etaDay<5);return arrivals;
}
function v08ProcessOutbound(){
  const arrivals=[];for(const sh of state.logistics.outbound){if(sh.status!=='transit'||sh.etaDay>state.day)continue;const store=state.chain.stores[sh.storeId],p=getProduct(sh.productId);if(!store||!p)continue;sh.status='delivered';const accepted=v08ReceiveStore(store,sh.productId,sh.qty,sh.unitCost);arrivals.push(`${accepted} × ${p.name} → ${store.name}`);}
  state.logistics.outbound=state.logistics.outbound.filter(x=>x.status==='transit'||state.day-x.etaDay<5);return arrivals;
}
const v08BaseEndDay=endDay;
endDay=function(){
  const completed=state.day;v08BaseEndDay();const inbound=v08ProcessInbound(),outbound=v08ProcessOutbound(),auto=v08AutoReplenish(),overhead=roundMoney(v08WarehouseOverhead());state.cash=roundMoney(state.cash-overhead);state.logistics.totalWarehouseOverhead=roundMoney(state.logistics.totalWarehouseOverhead+overhead);
  if(inbound.length)v08AddAlert('📥','Purchase orders received',inbound.join(' · '),'inbound');if(outbound.length)v08AddAlert('📤','Branch deliveries arrived',outbound.join(' · '),'outbound');
  state.logistics.lastDay={day:completed,inbound,outbound,auto,overhead,warehouseUnits:v08WarehouseUnits(),warehouseValue:v08WarehouseValue()};if(state.chain?.chainSummary)state.chain.chainSummary.profit=roundMoney((state.chain.chainSummary.profit||0)-overhead);saveState();v08ExtendDaySplash();
};
function v08ExtendDaySplash(){
  const d=state.logistics.lastDay;if(!d)return;const anchor=splash.querySelector('.v07-chain-summary')||splash.querySelector('.day-summary-grid');if(anchor)anchor.insertAdjacentHTML('afterend',`<div class="v08-day-logistics"><div><span>🏭 WAREHOUSE STOCK</span><b>${d.warehouseUnits}</b></div><div><span>📥 INBOUND</span><b>${d.inbound.length}</b></div><div><span>📤 DELIVERIES</span><b>${d.outbound.length+d.auto.shipments}</b></div><div><span>DC OVERHEAD</span><b class="loss">−${money(d.overhead)}</b></div></div>${(d.inbound.length||d.outbound.length||d.auto.moved)?`<div class="v08-day-note"><b>Distribution network</b><span>${[...d.inbound,...d.outbound,d.auto.moved?`${d.auto.moved} units auto-replenished`:null].filter(Boolean).join(' · ')}</span></div>`:''}`);
}

/* ---------- Distribution Centre UI ---------- */
function v08WarehouseStockRows(){
  const rows=Object.entries(state.logistics.warehouse.inventory||{}).filter(([,x])=>x.qty>0).map(([id,inv])=>({p:getProduct(id),inv})).filter(x=>x.p).sort((a,b)=>state.market[b.p.id].hype-state.market[a.p.id].hype);
  return rows.length?rows.map(({p,inv})=>`<button class="v08-stock-row" onclick="v08OpenDispatchSheet('${p.id}')"><div class="inventory-thumb">${packageArt(p,true)}</div><div><span>${getBrand(p.brand).name}</span><b>${p.name}</b><small>${money(inv.avgCost||p.wholesale)} landed cost · ${heat(state.market[p.id].hype)} ${hypeLabel(state.market[p.id].hype)}</small></div><strong>${inv.qty}<small>UNITS</small></strong></button>`).join(''):`<div class="empty"><div class="emoji">🏭</div><h3>The Distribution Centre is empty</h3><p>Use Central Buying in Market to place your first purchase order.</p><button class="primary-btn" onclick="v08BuyDestination='warehouse';switchTab('market')">BUY CENTRALLY</button></div>`;
}
function v08InboundRows(){const q=state.logistics.inbound.filter(x=>x.status==='transit');return q.length?q.map(x=>{const p=getProduct(x.productId);return `<div class="v08-flow-row"><span>📥</span><div><b>${x.qty} × ${p?.name||'Product'}</b><small>PO ${x.id} · ${x.preorder?'launch commitment':V08_SHIP_MODES[x.mode]?.name||'scheduled'} · arrives ${gameDate(x.etaDay).short}</small></div><strong>${money(x.total)}</strong></div>`}).join(''):`<div class="v08-empty-flow">No supplier purchase orders are currently inbound.</div>`;}
function v08OutboundRows(){const q=state.logistics.outbound.filter(x=>x.status==='transit');return q.length?q.map(x=>{const p=getProduct(x.productId),s=state.chain.stores[x.storeId];return `<div class="v08-flow-row"><span>📤</span><div><b>${x.qty} × ${p?.name||'Product'} → ${s?.name||'Store'}</b><small>${V08_SHIP_MODES[x.mode]?.name||'Scheduled'} · arrives ${gameDate(x.etaDay).short}${x.automatic?' · auto replenishment':''}</small></div><strong>${money(x.freight)}</strong></div>`}).join(''):`<div class="v08-empty-flow">No branch deliveries are currently in transit.</div>`;}
function v08OpenUpgradeSheet(){
  const w=state.logistics.warehouse,defs=[['capacityLevel','Warehouse Capacity','📦',V08_CAPACITY_LEVELS,6000,'More pallet space for central purchases.'],['pickingLevel','Picking Automation','🤖',V08_PICKING_LEVELS,7500,'More units can be automatically allocated each day.'],['forecastLevel','Demand Forecasting','📊',[7,10,14,21],8500,'Longer regional demand horizon and larger central allocations.'],['fleetLevel','Delivery Fleet','🚚',[0,8,16,24],9000,'Reduces branch delivery freight up to 24%.']];
  sheetContent.innerHTML=`<h2>🏭 Distribution Centre Upgrades</h2><p class="subtle">Upgrade the network rather than micromanaging every branch.</p><div class="v08-upgrade-list">${defs.map(([key,name,icon,vals,base,note])=>{const lv=w[key],max=lv>=3,cost=base*(lv+1),display=key==='capacityLevel'?`${vals[lv]} units`:key==='pickingLevel'?`${vals[lv]} units/day`:key==='forecastLevel'?`${vals[lv]} days`:`${vals[lv]}% freight saving`;return `<div><span>${icon}</span><div><b>${name} · Level ${lv+1}</b><small>${display}</small><p>${note}</p></div><button ${max?'disabled':''} onclick="v08UpgradeWarehouse('${key}',${cost})">${max?'MAX':money(cost)}</button></div>`}).join('')}</div><button class="secondary-btn wide" onclick="closeSheet()">DONE</button>`;openSheet();
}
function v08UpgradeWarehouse(key,cost){const w=state.logistics.warehouse;if((w[key]||0)>=3)return;if(state.cash<cost)return toast(`You need ${money(cost)}`);state.cash=roundMoney(state.cash-cost);w[key]++;v08Log(`Distribution Centre upgraded: ${key.replace('Level','')} level ${w[key]+1}.`);saveState();v08OpenUpgradeSheet();toast('Distribution Centre upgraded');}
function v08OpenStoreRulesPicker(){sheetContent.innerHTML=`<h2>🔄 Automatic Replenishment</h2><p class="subtle">Choose a branch, then set minimum inventory targets for the products that matter most.</p><div class="v08-destination-list">${v07AllStores().map(s=>`<button onclick="v08OpenRulesSheet('${s.id}')"><span>${V07_LOCATIONS[s.locationKey].icon}</span><div><b>${s.name}</b><small>${Object.keys(state.logistics.rules?.[s.id]||{}).length} active stock targets</small></div><strong>SET RULES →</strong></button>`).join('')}</div><button class="secondary-btn wide" onclick="closeSheet()">CANCEL</button>`;openSheet();}
function v08RenderDistributionCentre(){
  state.tab='empire';v07SyncActiveStore();saveState();const wh=state.logistics.warehouse,alerts=state.logistics.alerts.slice(0,4);
  screen.innerHTML=`<section class="section"><button class="v08-back" onclick="renderEmpire()">← BACK TO EMPIRE</button><div class="v08-dc-hero"><div><span class="kicker">REGIONAL LOGISTICS · YEAR ${gameDate().year}</span><h2>🏭 ${wh.name}</h2><p>Buy centrally, hold inventory until demand is clearer, then replenish every branch from one distribution network.</p><div class="button-row"><button class="primary-btn" onclick="v08BuyDestination='warehouse';switchTab('market')">BUY FOR WAREHOUSE</button><button class="secondary-btn" onclick="v08OpenUpgradeSheet()">UPGRADE DC</button></div></div><div class="v08-capacity-ring"><span>CAPACITY</span><b>${v08WarehouseUnits()+v08InboundCommitted()}</b><small>of ${v08WarehouseCapacity()}</small></div></div><div class="v08-dc-kpis"><div><span>WAREHOUSE STOCK</span><b>${v08WarehouseUnits()}</b><small>${money(v08WarehouseValue())} value</small></div><div><span>INBOUND POs</span><b>${state.logistics.inbound.filter(x=>x.status==='transit').length}</b><small>${v08InboundCommitted()} units committed</small></div><div><span>OUTBOUND</span><b>${state.logistics.outbound.filter(x=>x.status==='transit').length}</b><small>${state.logistics.totalUnitsMoved} units moved lifetime</small></div><div><span>DAILY OVERHEAD</span><b>${money(v08WarehouseOverhead())}</b><small>${v08PickingCapacity()} pick capacity</small></div></div></section>${alerts.length?`<section class="section"><div class="section-head"><div><h2>Logistics Alerts</h2><p>What needs attention across the network.</p></div></div><div class="v08-alerts">${alerts.map(a=>`<div><span>${a.icon}</span><div><b>${a.title}</b><small>${a.text}</small></div></div>`).join('')}</div></section>`:''}<section class="section"><div class="section-head"><div><h2>Warehouse Stock</h2><p>Tap a toy to dispatch it to any store.</p></div><button onclick="v08OpenStoreRulesPicker()">AUTO REPLENISH</button></div><div class="v08-stock-list">${v08WarehouseStockRows()}</div></section><section class="section"><div class="section-head"><div><h2>Demand Forecast</h2><p>${v08ForecastDays()}-day regional shortage forecast.</p></div></div><div class="v08-forecast-grid">${v08ForecastCards()}</div></section><section class="section"><div class="section-head"><div><h2>Inbound Purchase Orders</h2><p>Supplier → Distribution Centre</p></div></div><div class="v08-flow-list">${v08InboundRows()}</div></section><section class="section"><div class="section-head"><div><h2>Outbound Deliveries</h2><p>Distribution Centre → branches</p></div></div><div class="v08-flow-list">${v08OutboundRows()}</div></section>`;
  window.scrollTo?.(0,0);updateStats();
}
function v08EmpireCard(){return `<section class="section v08-empire-dc"><div class="v08-empire-dc-hero" onclick="v08RenderDistributionCentre()"><div><span class="kicker">DISTRIBUTION NETWORK</span><h2>🏭 Regional Distribution Centre</h2><p>${v08WarehouseUnits()} units on hand · ${v08InboundCommitted()} inbound · ${state.logistics.outbound.filter(x=>x.status==='transit').length} branch deliveries moving.</p><div class="v08-dc-mini"><span><b>${v08WarehouseUnits()+v08InboundCommitted()}/${v08WarehouseCapacity()}</b> capacity</span><span><b>${v08PickingCapacity()}</b> picks/day</span><span><b>${v08ForecastDays()} days</b> forecast</span></div></div><strong>OPEN<br>DC →</strong></div></section>`;}

/* UI wrappers */
const v08BaseLocationStrip=v07LocationStrip;
v07LocationStrip=function(mode='store'){if(mode==='market'&&v08BuyDestination==='warehouse')return `<section class="v07-location-strip v08-warehouse-location"><div><span class="kicker">CENTRAL BUYING DESTINATION</span><b>🏭 Regional Distribution Centre</b><small>Purchase orders land centrally before you allocate stock to stores.</small></div><div class="v08-wh-cap"><span>FREE CAPACITY</span><b>${v08WarehouseFree()}</b></div></section>`;return v08BaseLocationStrip(mode);};
const v08BaseRenderMarket=renderMarket;
renderMarket=function(){v08BaseRenderMarket();const loc=screen.querySelector('.v07-location-strip');if(loc)loc.insertAdjacentHTML('afterend',v08BuyingRouteStrip());else screen.insertAdjacentHTML('afterbegin',v08BuyingRouteStrip());};
const v08BaseRenderEmpire=renderEmpire;
renderEmpire=function(){v08BaseRenderEmpire();const chain=screen.querySelector('.v07-chain-section');if(chain)chain.insertAdjacentHTML('afterend',v08EmpireCard());else screen.insertAdjacentHTML('afterbegin',v08EmpireCard());};

/* Global exposure */
Object.assign(window,{v08SetBuyDestination,v08ChangeCentralQty,v08SetCentralQty,v08SetInboundMode,v08BuyToWarehouse,v08OpenDispatchSheet,v08OpenDispatchDetail,v08ChangeDispatchQty,v08SetDispatchQty,v08SetDispatchMode,v08ScheduleOutbound,v08OpenRulesSheet,v08SetRule,v08OpenStoreRulesPicker,v08OpenUpgradeSheet,v08UpgradeWarehouse,v08RenderDistributionCentre});

v08EnsureState();saveState();render();
setTimeout(()=>{if(state&&!state.logistics.v08WelcomeShown){state.logistics.v08WelcomeShown=true;saveState();showSplash('YOUR CHAIN HAS A DISTRIBUTION CENTRE','Buy large purchase orders centrally, hold stock in the warehouse, forecast regional shortages and automatically replenish branches before they sell out.','🏭');}},520);
