/* ========================================================================== 
   Toy Store Tycoon v0.6.0 — Retail War
   Competitive retail layer: campaigns, exclusives, allocation battles,
   territories, loyalty, staff poaching, rival expansion/closures and price war.
   ========================================================================== */

const V06_CAMPAIGNS = {
  social:{name:'Social Buzz Blitz',icon:'📱',cost:1200,days:5,traffic:12,conversion:.04,share:.12,desc:'Fast local reach. Strong traffic lift for five trading days.'},
  catalogue:{name:'Toy Catalogue Drop',icon:'📚',cost:1800,days:7,traffic:9,conversion:.07,share:.16,desc:'A broad family campaign that improves conversion and local share.'},
  franchise:{name:'Franchise Takeover',icon:'🌟',cost:2400,days:6,traffic:7,conversion:.18,share:.18,brand:true,desc:'Back your hottest franchise with a dedicated branded promotion.'},
  christmas:{name:'Christmas Domination',icon:'🎄',cost:6500,days:7,traffic:28,conversion:.12,share:.42,holiday:true,desc:'A huge seasonal push built for November and December trading.'}
};
const V06_TERRITORY_NAMES = {
  town:{name:'Town Centre',icon:'🏙️',note:'High foot traffic and price competition.'},
  family:{name:'Family Suburbs',icon:'🏡',note:'Parents reward service, range and loyalty.'},
  collector:{name:'Collector District',icon:'💎',note:'Scarcity, exclusives and premium stock matter.'},
  mall:{name:'Shopping Centre',icon:'🛍️',note:'Advertising and big-brand ranges win attention.'}
};
const V06_RIVAL_COLOURS = {mega:'#39a4ff',collector:'#b56cff',family:'#ffb43b',trend:'#ff5d77',player:'#63e6a6'};

function v06DefaultTerritories(){
  return {
    town:{player:18,mega:29,collector:14,family:21,trend:18},
    family:{player:19,mega:22,collector:10,family:34,trend:15},
    collector:{player:15,mega:17,collector:39,family:12,trend:17},
    mall:{player:17,mega:34,collector:12,family:18,trend:19}
  };
}
function v06DefaultCompetition(){
  return {
    campaigns:[], exclusives:{}, rivalExclusives:{}, territories:v06DefaultTerritories(),
    loyalty:{level:0,members:0,lifetimeMembers:0}, rumours:[], priceWars:[],
    allocationBattle:null, exclusiveOffer:null, poachOffer:null, dailyNews:[], history:[],
    lastOfferDay:0,lastBattleDay:0,lastRumourDay:0,lastPoachDay:0,lastRivalExclusiveDay:0,
    v06WelcomeShown:false
  };
}
function v06EnsureState(){
  state.version=VERSION;
  state.competition={...v06DefaultCompetition(),...(state.competition||{})};
  state.competition.loyalty={level:0,members:0,lifetimeMembers:0,...(state.competition.loyalty||{})};
  state.competition.territories=state.competition.territories||v06DefaultTerritories();
  Object.keys(V06_TERRITORY_NAMES).forEach(k=>{state.competition.territories[k]={...v06DefaultTerritories()[k],...(state.competition.territories[k]||{})};});
  ['campaigns','rumours','priceWars','dailyNews','history'].forEach(k=>{if(!Array.isArray(state.competition[k]))state.competition[k]=[];});
  state.competition.exclusives=state.competition.exclusives||{}; state.competition.rivalExclusives=state.competition.rivalExclusives||{};
  rivalTemplates.forEach((r,i)=>{
    const s=state.rivals[r.id]; if(!s)return;
    if(!Number.isFinite(s.stores))s.stores=[3,1,2,1][i];
    if(!Number.isFinite(s.stability))s.stability=[82,73,86,68][i];
    if(!Number.isFinite(s.loyalty))s.loyalty=[48,64,78,45][i];
    if(!s.status)s.status='Trading';
    if(!Number.isFinite(s.closedUntil))s.closedUntil=0;
    if(!Number.isFinite(s.adSpend))s.adSpend=0;
  });
}
function v06News(icon,title,body,type='war'){
  const n={id:`N${Date.now().toString(36)}${Math.floor(Math.random()*999)}`,day:state.day,icon,title,body,type};
  state.competition.dailyNews.unshift(n); state.competition.dailyNews=state.competition.dailyNews.slice(0,6);
  state.competition.history.unshift(n); state.competition.history=state.competition.history.slice(0,80);
  state.eventLog.unshift(`Day ${state.day}: ${title} — ${body}`);
  return n;
}
function v06ActiveCampaigns(){return state.competition.campaigns.filter(c=>state.day<=c.endDay);}
function v06CampaignBoost(){return v06ActiveCampaigns().reduce((a,c)=>a+(V06_CAMPAIGNS[c.type]?.traffic||0),0);}
function v06CampaignForProduct(p){
  let mult=1; v06ActiveCampaigns().forEach(c=>{const d=V06_CAMPAIGNS[c.type]; if(!d)return; if(!c.brand||c.brand===p.brand)mult*=1+(d.conversion||0); if(c.productId===p.id)mult*=1.12;}); return mult;
}
function v06Holiday(){const m=gameDate().month;return m==='November'||m==='December';}
function v06PlayerExclusive(id){const x=state.competition.exclusives[id];return x&&state.day<=x.untilDay?x:null;}
function v06RivalExclusive(id){const x=state.competition.rivalExclusives[id];return x&&state.day<=x.untilDay?x:null;}
function v06LoyaltyName(level=state.competition.loyalty.level){return ['No Program','Toy Club','Toy Club Plus','Toy Club VIP'][level]||'Toy Club VIP';}
function v06LoyaltyCost(){return [1500,3200,6000][state.competition.loyalty.level]||0;}
function v06RivalName(id){return rivalTemplates.find(r=>r.id===id)?.name||id;}
function v06TopRivalForZone(z){return ['mega','collector','family','trend'].sort((a,b)=>z[b]-z[a])[0];}
function v06WarPressure(){return clamp((state.marketShare-18)*1.8 + v06ActiveCampaigns().length*8 + state.competition.loyalty.level*6,0,100);}

/* Product desirability and wholesale price now respond to Retail War systems. */
const v06BaseProductScore = v04ProductScore;
v04ProductScore = function(p,type){
  let score=v06BaseProductScore(p,type)*v06CampaignForProduct(p);
  const loyalty=state.competition?.loyalty?.level||0;
  if(loyalty && ['parent','gift','collector'].includes(type.id))score*=1+loyalty*.025;
  if(v06PlayerExclusive(p.id))score*=1.08;
  return score;
};
const v06BaseEffectiveWholesale = effectiveWholesale;
effectiveWholesale = function(p){
  let price=v06BaseEffectiveWholesale(p),x=v06PlayerExclusive(p.id); if(x)price*=1-(x.discount||0); return roundMoney(price);
};
const v06BaseOpenBuySheet = openBuySheet;
openBuySheet = function(id){
  const rx=v06RivalExclusive(id); if(rx)return toast(`${v06RivalName(rx.rivalId)} controls this supplier allocation until ${gameDate(rx.untilDay).short}`);
  v06BaseOpenBuySheet(id);
  const x=v06PlayerExclusive(id); if(x&&!sheet.classList.contains('hidden'))sheetContent.insertAdjacentHTML('afterbegin',`<div class="v06-exclusive-banner">⭐ <b>YOUR EXCLUSIVE</b><span>Rivals locked out · ${(x.discount*100).toFixed(0)}% buying discount · through ${gameDate(x.untilDay).short}</span></div>`);
};

/* Campaigns */
function openCampaignSheet(){
  const active=v06ActiveCampaigns();
  sheetContent.innerHTML=`<h2>📣 Advertising Campaigns</h2><p class="subtle">Campaign cash is spent immediately. Up to two campaigns can run together.</p>${active.length?`<div class="v06-active-campaigns">${active.map(c=>{const d=V06_CAMPAIGNS[c.type];return `<div><span>${d.icon}</span><b>${d.name}${c.brand?` · ${brands[c.brand].name}`:''}</b><small>${Math.max(0,c.endDay-state.day+1)} days left</small></div>`}).join('')}</div>`:''}<div class="v06-campaign-grid">${Object.entries(V06_CAMPAIGNS).map(([id,d])=>`<button class="v06-campaign-card" ${d.holiday&&!v06Holiday()?'disabled':''} onclick="launchCampaign('${id}')"><span>${d.icon}</span><h3>${d.name}</h3><p>${d.desc}</p><div><b>${money(d.cost)}</b><small>${d.days} days · +${d.traffic}% traffic</small></div>${d.holiday&&!v06Holiday()?'<em>Available in November / December</em>':''}</button>`).join('')}</div><button class="secondary-btn wide" onclick="closeSheet()">DONE</button>`;
  openSheet();
}
function launchCampaign(type){
  const d=V06_CAMPAIGNS[type]; if(!d)return; if(d.holiday&&!v06Holiday())return toast('Christmas Domination unlocks in November and December'); if(v06ActiveCampaigns().length>=2)return toast('You already have two campaigns running'); if(state.cash<d.cost)return toast(`You need ${money(d.cost)}`);
  let brand=null; if(d.brand){const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0).map(getProduct);brand=(owned.sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype)[0]||products[0]).brand;}
  state.cash=roundMoney(state.cash-d.cost); state.competition.campaigns.push({type,brand,startDay:state.day,endDay:state.day+d.days-1}); state.reputation=clamp(state.reputation+1.2,0,100);
  v06News(d.icon,`${d.name} launched`,`${brand?brands[brand].name+' takes over the campaign. ':''}${money(d.cost)} committed to advertising.`,'campaign'); saveState(); openCampaignSheet(); toast('Campaign is live');
}

/* Customer loyalty */
function upgradeLoyalty(){
  const l=state.competition.loyalty; if(l.level>=3)return toast('Toy Club VIP is already maxed'); const cost=v06LoyaltyCost(); if(state.cash<cost)return toast(`You need ${money(cost)} to upgrade loyalty`);
  state.cash=roundMoney(state.cash-cost); l.level++; const seed=45*l.level; l.members+=seed; l.lifetimeMembers+=seed; state.reputation=clamp(state.reputation+2,0,100); v06News('🎟️',`${v06LoyaltyName()} launched`,`${seed} shoppers joined immediately. Repeat-customer traffic will now grow.`,'loyalty'); saveState(); render(); toast(`${v06LoyaltyName()} is active`);
}

/* Exclusive contracts */
function v06MaybeGenerateExclusiveOffer(force=false){
  const c=state.competition; if(c.exclusiveOffer&&state.day<=c.exclusiveOffer.expiresDay)return; c.exclusiveOffer=null;
  if(!force && (state.day-c.lastOfferDay<4 || !weightedChance(34)))return;
  const candidates=products.filter(p=>!v06PlayerExclusive(p.id)&&!v06RivalExclusive(p.id)&&lifecycleFor(p).key!=='discontinued'&&state.supplierStock[p.id]>=12).sort((a,b)=>(state.market[b.id].hype+b.scarcity)-(state.market[a.id].hype+a.scarcity));
  const p=rand(candidates.slice(0,12)); if(!p)return; const qty=12+Math.floor(Math.random()*13),fee=500+Math.round((p.scarcity+state.market[p.id].hype)*5),discount=.05+Math.floor(Math.random()*5)/100;
  c.exclusiveOffer={productId:p.id,qty,fee,discount,days:6+Math.floor(Math.random()*4),expiresDay:state.day+2,supplierId:supplierByBrand[p.brand]}; c.lastOfferDay=state.day;
}
function openExclusiveOffer(){
  const o=state.competition.exclusiveOffer; if(!o)return toast('No supplier exclusive is currently on the table'); const p=getProduct(o.productId),unit=roundMoney(v06BaseEffectiveWholesale(p)*(1-o.discount)),stockCost=roundMoney(unit*o.qty),total=roundMoney(stockCost+o.fee);
  sheetContent.innerHTML=`<div class="v06-deal-hero" style="background-image:linear-gradient(90deg,rgba(8,7,14,.96),rgba(8,7,14,.28)),url('assets/heroes/${p.brand}.webp')"><img src="assets/brands/${p.brand}.svg" alt=""><span>SUPPLIER EXCLUSIVE OFFER</span><h2>${p.name}</h2></div><div class="metrics"><div class="metric"><span>Required Order</span><strong>${o.qty} units</strong></div><div class="metric"><span>Exclusive</span><strong>${o.days} days</strong></div><div class="metric"><span>Discount</span><strong>${Math.round(o.discount*100)}%</strong></div></div><p class="subtle">Accepting locks rival stores out of this supplier line for ${o.days} days. You must take the minimum order now.</p><div class="v06-deal-cost"><span>Stock ${money(stockCost)} + contract ${money(o.fee)}</span><b>${money(total)}</b></div><button class="primary-btn wide" onclick="acceptExclusiveOffer()">ACCEPT EXCLUSIVE · ${money(total)}</button><button class="secondary-btn wide" onclick="closeSheet()">NOT NOW</button>`; openSheet();
}
function v06ReceiveUnits(p,qty,unit,preorder=false){
  if(preorder){const old=state.preorders[p.id]||{qty:0,cost:0};state.preorders[p.id]={qty:old.qty+qty,cost:roundMoney(old.cost+unit*qty),unitCost:unit,committedDay:state.day,launchDay:v05LaunchDay(p)};return;}
  const finds=v05ExtractCollectorFinds(p,qty,unit,false),regular=Math.max(0,qty-finds.length); if(regular<=0)return;
  if(!state.inventory[p.id])state.inventory[p.id]={qty:0,price:p.rrp,soldToday:0,totalSold:0,lastProfit:0,avgCost:unit,shelfQty:0}; const inv=state.inventory[p.id],old=inv.qty,oldCost=(inv.avgCost||unit)*old; inv.qty+=regular; inv.avgCost=roundMoney((oldCost+regular*unit)/Math.max(1,inv.qty)); if(!state.placements[p.id])state.placements[p.id]='main'; v04EnsureShelf(inv,p.id);
}
function acceptExclusiveOffer(){
  const o=state.competition.exclusiveOffer;if(!o)return;const p=getProduct(o.productId),available=state.supplierStock[p.id]||0;if(available<o.qty)return toast('Supplier no longer has enough units for this contract');
  const unit=roundMoney(v06BaseEffectiveWholesale(p)*(1-o.discount)),stockCost=roundMoney(unit*o.qty),total=roundMoney(stockCost+o.fee); if(state.cash<total)return toast(`You need ${money(total)}`); if(inventoryUsed()+preorderUnits()+o.qty>inventoryCapacity())return toast('Not enough combined stockroom / committed capacity');
  state.cash=roundMoney(state.cash-total); state.supplierStock[p.id]-=o.qty; v06ReceiveUnits(p,o.qty,unit,v05LaunchDay(p)>state.day); state.competition.exclusives[p.id]={untilDay:state.day+o.days-1,discount:o.discount,supplierId:o.supplierId}; state.suppliers[o.supplierId].relationship=clamp(state.suppliers[o.supplierId].relationship+5,0,100); state.competition.exclusiveOffer=null;
  v06News('⭐',`${p.name} is exclusive to you`,`${o.qty} units committed. Rivals are locked out of supplier stock for ${o.days} days.`,'exclusive');saveState();closeSheet();render();toast('Exclusive secured');
}

/* Supplier allocation bidding */
function v06MaybeGenerateAllocationBattle(force=false){
  const c=state.competition; if(c.allocationBattle&&state.day<=c.allocationBattle.deadline)return; c.allocationBattle=null;
  if(!force&&(state.day-c.lastBattleDay<3||!weightedChance(40)))return;
  const candidates=products.filter(p=>!v06PlayerExclusive(p.id)&&!v06RivalExclusive(p.id)&&state.supplierStock[p.id]>=10&&lifecycleFor(p).key!=='discontinued').sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype); const p=rand(candidates.slice(0,10));if(!p)return;
  const rival=rand(rivalTemplates.filter(r=>state.rivals[r.id].status==='Trading')); const qty=Math.min(state.supplierStock[p.id],12+Math.floor(Math.random()*12)),rivalBid=650+Math.floor(Math.random()*1500);
  c.allocationBattle={productId:p.id,rivalId:rival.id,qty,rivalBid,deadline:state.day+1};c.lastBattleDay=state.day;
}
function openAllocationBattle(){
  const b=state.competition.allocationBattle;if(!b)return toast('No live allocation battle');const p=getProduct(b.productId),rel=supplierStateFor(p).relationship,baseChance=clamp(38+(rel-50)*.45,20,70);
  sheetContent.innerHTML=`<div class="v06-bid-hero"><span>🔥 SUPPLIER ALLOCATION BATTLE</span><h2>${p.name}</h2><p>${v06RivalName(b.rivalId)} is bidding for the final ${b.qty} units.</p></div><div class="metrics"><div class="metric"><span>Units</span><strong>${b.qty}</strong></div><div class="metric"><span>Your Relationship</span><strong>${Math.round(rel)}/100</strong></div><div class="metric"><span>Base Chance</span><strong>${Math.round(baseChance)}%</strong></div></div><p class="subtle">Your bid is a non-refundable supplier priority fee. If you win, the stock is also purchased at your current wholesale cost.</p><div class="v06-bid-buttons"><button onclick="bidAllocation(750)"><b>${money(750)}</b><small>Conservative</small></button><button onclick="bidAllocation(1500)"><b>${money(1500)}</b><small>Strong</small></button><button onclick="bidAllocation(2500)"><b>${money(2500)}</b><small>Aggressive</small></button></div><button class="secondary-btn wide" onclick="closeSheet()">LET THE RIVAL HAVE IT</button>`;openSheet();
}
function bidAllocation(amount){
  const b=state.competition.allocationBattle;if(!b)return;const p=getProduct(b.productId),unit=effectiveWholesale(p),stockCost=roundMoney(unit*b.qty),total=roundMoney(amount+stockCost);if(state.cash<total)return toast(`Keep ${money(total)} available for bid + stock`);if(inventoryUsed()+preorderUnits()+b.qty>inventoryCapacity())return toast('Not enough capacity for this allocation');
  const rel=supplierStateFor(p).relationship,chance=clamp(42+(amount-b.rivalBid)/35+(rel-50)*.55,12,94);state.cash=roundMoney(state.cash-amount);const win=weightedChance(chance);const available=Math.min(b.qty,state.supplierStock[p.id]||0);
  if(win&&available>0){state.cash=roundMoney(state.cash-unit*available);state.supplierStock[p.id]-=available;v06ReceiveUnits(p,available,unit,v05LaunchDay(p)>state.day);supplierStateFor(p).relationship=clamp(rel+2.5,0,100);v06News('🏆','You won the allocation',`${available} × ${p.name} secured ahead of ${v06RivalName(b.rivalId)}. Priority fee: ${money(amount)}.`,'allocation');toast('Allocation won');}
  else{const rs=state.rivals[b.rivalId],take=Math.min(available,state.supplierStock[p.id]||0);state.supplierStock[p.id]-=take;rs.inventory[p.id]=(rs.inventory[p.id]||0)+take;v06News('😤',`${v06RivalName(b.rivalId)} won the allocation`,`${take} × ${p.name} moved to the rival. Your ${money(amount)} priority fee was spent.`,'allocation');toast('Rival won the allocation');}
  state.competition.allocationBattle=null;saveState();closeSheet();render();
}

/* Rumours and price wars */
function v06MaybeRumour(){
  const c=state.competition;if(state.day-c.lastRumourDay<3||!weightedChance(26))return;const owned=Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0).map(getProduct).sort((a,b)=>state.market[b.id].hype-state.market[a.id].hype);const p=owned[0];if(!p)return;const r=rand(rivalTemplates.filter(x=>x.rumor>10)),hit=4+Math.floor(Math.random()*7);state.market[p.id].hype=clamp(state.market[p.id].hype-hit,15,99);const rum={id:`R${state.day}${p.id}`,productId:p.id,rivalId:r.id,hit,expiresDay:state.day+3};c.rumours.unshift(rum);c.rumours=c.rumours.slice(0,5);c.lastRumourDay=state.day;v06News('🗣️','A damaging rumour is spreading',`${v06RivalName(r.id)}-linked chatter hit ${p.name}. Market buzz fell ${hit} points.`,'rumour');
}
function counterRumour(id){const r=state.competition.rumours.find(x=>x.id===id);if(!r)return;const cost=850;if(state.cash<cost)return toast(`You need ${money(cost)} for the response`);const p=getProduct(r.productId);state.cash=roundMoney(state.cash-cost);state.market[p.id].hype=clamp(state.market[p.id].hype+Math.ceil(r.hit*.8),15,99);state.reputation=clamp(state.reputation+2.5,0,100);state.competition.rumours=state.competition.rumours.filter(x=>x.id!==id);v06News('📢','Rumour countered',`A ${money(cost)} response restored confidence in ${p.name}.`,'rumour');saveState();render();toast('Customer confidence restored');}
function v06DetectPriceWars(){
  const wars=[];Object.keys(state.inventory).filter(id=>state.inventory[id].qty>0).forEach(id=>{const p=getProduct(id),my=state.inventory[id].price;['mega','trend'].forEach(rid=>{const rp=state.rivals[rid].prices[id];if(rp&&rp<my*.90&&state.market[id].hype>58)wars.push({id:`W${rid}${id}`,productId:id,rivalId:rid,rivalPrice:rp,startedDay:state.day});});});
  wars.sort((a,b)=>state.market[b.productId].hype-state.market[a.productId].hype);state.competition.priceWars=wars.slice(0,4);
}
function openPriceWar(id){
  const w=state.competition.priceWars.find(x=>x.id===id);if(!w)return;const p=getProduct(w.productId),inv=state.inventory[p.id];sheetContent.innerHTML=`<h2>⚔️ Price War · ${p.name}</h2><p class="subtle">${v06RivalName(w.rivalId)} is trying to drag shoppers away from your store.</p><div class="v06-price-faceoff"><div><span>YOUR PRICE</span><b>${money(inv.price)}</b></div><strong>VS</strong><div><span>${v06RivalName(w.rivalId).toUpperCase()}</span><b>${money(w.rivalPrice)}</b></div></div><button class="primary-btn wide" onclick="respondPriceWar('${id}','match')">MATCH ${money(w.rivalPrice)}</button><button class="secondary-btn wide" onclick="respondPriceWar('${id}','bundle')">RUN VALUE BUNDLE · ${money(350)}</button><button class="secondary-btn wide" onclick="respondPriceWar('${id}','hold')">HOLD PRICE</button>`;openSheet();
}
function respondPriceWar(id,action){const w=state.competition.priceWars.find(x=>x.id===id);if(!w)return;const p=getProduct(w.productId),inv=state.inventory[p.id];if(action==='match'){inv.price=w.rivalPrice;v06News('🏷️','Price matched',`${p.name} now matches ${v06RivalName(w.rivalId)} at ${money(w.rivalPrice)}.`,'pricewar');}else if(action==='bundle'){if(state.cash<350)return toast('You need $350 for bundle signage and promo');state.cash-=350;state.competition.campaigns.push({type:'catalogue',productId:p.id,brand:p.brand,startDay:state.day,endDay:state.day+2});v06News('🎁','Value bundle launched',`${p.name} gets a three-day conversion push without matching the rival price.`,'pricewar');}else{state.reputation=clamp(state.reputation+.5,0,100);v06News('🛡️','Price held',`You refused to follow ${v06RivalName(w.rivalId)} down on ${p.name}.`,'pricewar');}state.competition.priceWars=state.competition.priceWars.filter(x=>x.id!==id);saveState();closeSheet();render();}

/* Staff poaching */
function v06MaybePoachOffer(){
  const c=state.competition;if(c.poachOffer&&state.day<=c.poachOffer.deadline)return;if(state.day-c.lastPoachDay<4||v04Team().length<2||!weightedChance(24))return;const staff=rand(v04Team().filter(s=>s.role!=='manager'||v04Team().length>3));if(!staff)return;const rival=rand(rivalTemplates.filter(r=>state.rivals[r.id].status==='Trading'));c.poachOffer={staffId:staff.id,rivalId:rival.id,bonus:550+Math.round(staff.skill*7),deadline:state.day+2};c.lastPoachDay=state.day;v06News('👀','A rival approached your staff',`${v06RivalName(rival.id)} made ${staff.name} an offer. Decide whether to retain them.`,'staff');
}
function retainPoachedStaff(){const o=state.competition.poachOffer;if(!o)return;const s=v04Team().find(x=>x.id===o.staffId);if(!s){state.competition.poachOffer=null;return;}if(state.cash<o.bonus)return toast(`You need ${money(o.bonus)} for a retention bonus`);state.cash-=o.bonus;s.wage=roundMoney(s.wage*1.08);s.service=clamp(s.service+3,0,100);state.competition.poachOffer=null;v06News('🤝',`${s.name} stays`,`${money(o.bonus)} retention bonus paid; daily wage increased 8%.`,'staff');saveState();render();toast(`${s.name} retained`);}
function letStaffPoached(){const o=state.competition.poachOffer;if(!o)return;const i=state.staff.team.findIndex(x=>x.id===o.staffId);if(i<0){state.competition.poachOffer=null;return;}const s=state.staff.team[i];state.staff.team.splice(i,1);state.rivals[o.rivalId].stability=clamp(state.rivals[o.rivalId].stability+3,0,100);state.competition.poachOffer=null;v06News('🚪',`${s.name} joined ${v06RivalName(o.rivalId)}`,`Your rival successfully poached a trained ${v04StaffRoles()[s.role].name}.`,'staff');saveState();render();toast(`${s.name} left for a rival`);}
function poachRivalStaff(rivalId){const rs=state.rivals[rivalId];if(!rs||rs.status!=='Trading')return toast('That rival has no local team to recruit from');if(v04Team().length>=v04StaffCapacity())return toast('Your shop is at staff capacity');const cost=1600+rs.stores*350;if(state.cash<cost)return toast(`You need ${money(cost)} for recruitment and signing`);state.cash-=cost;const win=weightedChance(clamp(70-rs.loyalty*.3+state.reputation*.25,32,82));if(win){const role=rand(['floor','cashier','stock','manager']),s=v04MakeStaff(role,state.staff.nextId++);s.skill=76+Math.floor(Math.random()*16);s.service=72+Math.floor(Math.random()*19);s.wage=roundMoney(s.wage*1.12);state.staff.team.push(s);rs.stability=clamp(rs.stability-4,0,100);v06News('🎯','Experienced rival staff recruited',`${s.name} left ${v06RivalName(rivalId)} to join you as ${v04StaffRoles()[role].name}.`,'staff');toast(`${s.name} joined your store`);}else{rs.loyalty=clamp(rs.loyalty+2,0,100);v06News('❌','Recruitment attempt failed',`${v06RivalName(rivalId)} kept its staff after your ${money(cost)} approach.`,'staff');toast('Rival retained their staff');}saveState();render();}

/* Rival company evolution and territory competition */
function v06UpdateRivalCompanies(){
  rivalTemplates.forEach(r=>{const s=state.rivals[r.id];if(!s)return;if(s.status==='Administration'&&state.day<s.closedUntil)return;if(s.status==='Administration'&&state.day>=s.closedUntil){s.status='Trading';s.stores=1;s.cash=Math.max(25000,s.cash);s.stability=48;s.share=Math.max(8,s.share);v06News('🔓',`${r.name} restructured`,`${r.name} has returned with one lean local store after administration.`,'rival');}
    const momentum=(s.lastSales>2200?2:-1)+(s.share>22?1.5:-.5)+(s.cash>80000?1:-.8)-v06WarPressure()*.025;s.stability=clamp(s.stability+momentum+(Math.random()-.5)*3,0,100);s.loyalty=clamp(s.loyalty+(s.rep-4.2)*.35+(Math.random()-.5),20,95);
    if(s.stores<5&&s.stability>76&&s.share>19&&weightedChance(8)){s.stores++;s.cash=roundMoney(s.cash-18000);s.share=clamp(s.share+1.6,4,42);v06News('🏗️',`${r.name} expanded`,`${r.name} opened another local store and now operates ${s.stores} locations.`,'rival');}
    if(s.stores>1&&s.stability<28&&weightedChance(14)){s.stores--;s.share=clamp(s.share-2.4,3,42);v06News('🔒',`${r.name} closed a store`,`${r.name} cut its local footprint to ${s.stores} locations after weak trading.`,'rival');}
    if(s.stores<=1&&s.stability<10&&s.cash<18000&&weightedChance(18)){s.status='Administration';s.closedUntil=state.day+10;s.stores=0;s.share=clamp(s.share*.35,2,12);v06News('💥',`${r.name} entered administration`,`${r.name} has temporarily shut its local operation. Expect clearance stock and customers up for grabs.`,'rival');}
  });
}
function v06UpdateTerritories(){
  const c=state.competition,active=v06ActiveCampaigns().length,loyalty=c.loyalty.level;Object.entries(c.territories).forEach(([key,z])=>{
    const affinity=key==='family'?loyalty*.28:key==='collector'?(v05VaultHeld()>0 ? .45 : 0):key==='mall'?active*.25:(state.rating>4.5 ? .25 : 0);
    z.player=clamp(z.player+(state.todayProfit>800?.22:-.08)+(state.customerStats.satisfaction>83?.16:0)+active*.10+affinity+(Math.random()-.5)*.24,4,62);
    rivalTemplates.forEach(r=>{const s=state.rivals[r.id],fav=(key==='family'&&r.id==='family')||(key==='collector'&&r.id==='collector')||(key==='mall'&&r.id==='mega')||(key==='town'&&r.id==='trend'),bias=fav ? .12 : 0;z[r.id]=clamp(z[r.id]+(s.stores-1)*.04+(s.stability-55)*.002+bias+(Math.random()-.5)*.16,3,55);});
    const total=z.player+z.mega+z.collector+z.family+z.trend;['player','mega','collector','family','trend'].forEach(k=>z[k]=z[k]/total*100);
  });
  const avg=Object.values(c.territories).reduce((a,z)=>a+z.player,0)/Object.keys(c.territories).length;state.marketShare=clamp((state.marketShare*.55)+(avg*.45),4,68);
}
function v06MaybeRivalExclusive(){
  const c=state.competition;if(state.day-c.lastRivalExclusiveDay<5||!weightedChance(20))return;const p=rand(products.filter(p=>!v06PlayerExclusive(p.id)&&!v06RivalExclusive(p.id)&&state.supplierStock[p.id]>=8&&state.market[p.id].hype>58));if(!p)return;const rival=rand(rivalTemplates.filter(r=>state.rivals[r.id].status==='Trading')),qty=Math.min(state.supplierStock[p.id],8+Math.floor(Math.random()*10));state.supplierStock[p.id]-=qty;state.rivals[rival.id].inventory[p.id]=(state.rivals[rival.id].inventory[p.id]||0)+qty;c.rivalExclusives[p.id]={rivalId:rival.id,untilDay:state.day+3};c.lastRivalExclusiveDay=state.day;v06News('🔐',`${rival.name} landed an exclusive`,`${p.name} is supplier-locked to ${rival.name} for three days. They took ${qty} units.`,'exclusive');
}

/* Sim wrappers */
const v06BaseSimulateCustomers = simulateCustomers;
simulateCustomers = function(){
  const originalMarketing=state.upgrades.marketing;state.upgrades.marketing=originalMarketing+v06CampaignBoost()/6+(state.competition.loyalty.level*.5);v06BaseSimulateCustomers();state.upgrades.marketing=originalMarketing;
  const l=state.competition.loyalty,joins=Math.round((state.customerStats.transactions||0)*(.04+l.level*.045));if(l.level){l.members+=joins;l.lifetimeMembers+=joins;state.customerStats.satisfaction=clamp(state.customerStats.satisfaction+l.level*1.2,35,99);state.reputation=clamp(state.reputation+l.level*.18,0,100);}
  v06ActiveCampaigns().forEach(c=>{const d=V06_CAMPAIGNS[c.type];state.marketShare=clamp(state.marketShare+d.share,4,68);});
};
const v06BaseSimulateRivals = simulateRivals;
simulateRivals = function(){
  const locked={};Object.entries(state.competition.exclusives).forEach(([id,x])=>{if(state.day<=x.untilDay){locked[id]=state.supplierStock[id];state.supplierStock[id]=0;}});const inactive={};rivalTemplates.forEach(r=>{const s=state.rivals[r.id];if(s.status!=='Trading')inactive[r.id]={cash:s.cash,lastSales:s.lastSales,inventory:JSON.parse(JSON.stringify(s.inventory||{})),activity:s.activity};});
  v06BaseSimulateRivals();Object.entries(locked).forEach(([id,q])=>state.supplierStock[id]=q);Object.entries(inactive).forEach(([id,snap])=>Object.assign(state.rivals[id],snap));
  v06DetectPriceWars();v06MaybeRumour();v06UpdateRivalCompanies();v06MaybeRivalExclusive();
};

function v06ExpireAndResolve(){
  const c=state.competition;c.campaigns=c.campaigns.filter(x=>state.day<=x.endDay);Object.keys(c.exclusives).forEach(id=>{if(state.day>c.exclusives[id].untilDay)delete c.exclusives[id];});Object.keys(c.rivalExclusives).forEach(id=>{if(state.day>c.rivalExclusives[id].untilDay)delete c.rivalExclusives[id];});c.rumours=c.rumours.filter(x=>state.day<=x.expiresDay);
  if(c.allocationBattle&&state.day>c.allocationBattle.deadline){const b=c.allocationBattle,p=getProduct(b.productId),take=Math.min(b.qty,state.supplierStock[p.id]||0),rs=state.rivals[b.rivalId];state.supplierStock[p.id]-=take;rs.inventory[p.id]=(rs.inventory[p.id]||0)+take;v06News('📦',`${v06RivalName(b.rivalId)} took the allocation`,`${take} × ${p.name} went to the rival after you passed on the supplier battle.`,'allocation');c.allocationBattle=null;}
  if(c.exclusiveOffer&&state.day>c.exclusiveOffer.expiresDay)c.exclusiveOffer=null;
  if(c.poachOffer&&state.day>c.poachOffer.deadline){const o=c.poachOffer,s=v04Team().find(x=>x.id===o.staffId);if(s&&weightedChance(55)){letStaffPoached();}else c.poachOffer=null;}
}
const v06BaseShowDaySummary = showDaySummary;
showDaySummary = function(summary,event,deliveries=[],franchiseEvent=null){
  v06BaseShowDaySummary(summary,event,deliveries,franchiseEvent);const box=splash.querySelector('.summary-news');if(box&&state.competition.dailyNews.length){box.insertAdjacentHTML('beforeend',`<div class="major v06-summary-war"><span>⚔️ RETAIL WAR</span><b>${state.competition.dailyNews[0].title}</b><small>${state.competition.dailyNews[0].body}</small></div>`);}
};
const v06BaseEndDay = endDay;
endDay = function(){
  state.competition.dailyNews=[];v06ExpireAndResolve();v06BaseEndDay();v06UpdateTerritories();v06MaybeGenerateExclusiveOffer();v06MaybeGenerateAllocationBattle();v06MaybePoachOffer();v06ExpireAndResolve();saveState();
};

/* War Room UI */
function v06AlertCards(){
  const c=state.competition,cards=[];
  if(c.allocationBattle){const b=c.allocationBattle,p=getProduct(b.productId);cards.push(`<button class="v06-alert urgent" onclick="openAllocationBattle()"><span>🔥</span><div><b>Allocation Battle</b><small>${p.name} · ${b.qty} units vs ${v06RivalName(b.rivalId)}</small></div><strong>BID →</strong></button>`);}
  if(c.exclusiveOffer){const o=c.exclusiveOffer,p=getProduct(o.productId);cards.push(`<button class="v06-alert deal" onclick="openExclusiveOffer()"><span>⭐</span><div><b>Exclusive Offer</b><small>${p.name} · ${o.qty} unit commitment</small></div><strong>REVIEW →</strong></button>`);}
  if(c.poachOffer){const o=c.poachOffer,s=v04Team().find(x=>x.id===o.staffId);if(s)cards.push(`<div class="v06-alert staff"><span>👀</span><div><b>${v06RivalName(o.rivalId)} wants ${s.name}</b><small>Retention bonus ${money(o.bonus)} · decision by ${gameDate(o.deadline).short}</small></div><div class="v06-mini-actions"><button onclick="retainPoachedStaff()">RETAIN</button><button onclick="letStaffPoached()">LET GO</button></div></div>`);}
  c.rumours.slice(0,1).forEach(r=>{const p=getProduct(r.productId);cards.push(`<div class="v06-alert rumour"><span>🗣️</span><div><b>Rumour hitting ${p.name}</b><small>${v06RivalName(r.rivalId)}-linked chatter · buzz −${r.hit}</small></div><button onclick="counterRumour('${r.id}')">COUNTER · ${money(850)}</button></div>`);});
  c.priceWars.slice(0,2).forEach(w=>{const p=getProduct(w.productId);cards.push(`<button class="v06-alert price" onclick="openPriceWar('${w.id}')"><span>🏷️</span><div><b>Price War · ${p.name}</b><small>${v06RivalName(w.rivalId)} at ${money(w.rivalPrice)}</small></div><strong>RESPOND →</strong></button>`);});
  return cards.length?cards.join(''):`<div class="v06-calm"><span>✓</span><div><b>No urgent competitive threats</b><small>Use the quiet period to advertise, build loyalty or recruit.</small></div></div>`;
}
function v06TerritoryCard(key,z){const lead=v06TopRivalForZone(z),d=V06_TERRITORY_NAMES[key];return `<div class="v06-territory"><div class="v06-territory-head"><span>${d.icon}</span><div><b>${d.name}</b><small>${d.note}</small></div><strong>${z.player.toFixed(0)}%</strong></div><div class="v06-sharebar"><i style="width:${z.player}%;background:${V06_RIVAL_COLOURS.player}"></i><i style="width:${z.mega}%;background:${V06_RIVAL_COLOURS.mega}"></i><i style="width:${z.collector}%;background:${V06_RIVAL_COLOURS.collector}"></i><i style="width:${z.family}%;background:${V06_RIVAL_COLOURS.family}"></i><i style="width:${z.trend}%;background:${V06_RIVAL_COLOURS.trend}"></i></div><small>You lead ${z.player>z[lead]?'this territory':`behind ${v06RivalName(lead)} (${z[lead].toFixed(0)}%)`}</small></div>`;}
function v06RivalCard(r){const s=state.rivals[r.id],stock=Object.values(s.inventory||{}).reduce((a,b)=>a+b,0);return `<article class="v06-rival-card ${s.status!=='Trading'?'inactive':''}" style="--rival-grad:${r.grad}"><div class="v06-rival-top"><span class="v06-rival-logo">${r.logo}</span><div><small>${s.status.toUpperCase()} · ${s.stores} LOCAL ${s.stores===1?'STORE':'STORES'}</small><h3>${r.name}</h3><p>${r.strategy}</p></div><strong>${s.share.toFixed(1)}%</strong></div><div class="v06-rival-meters"><div><span>STABILITY</span><b>${Math.round(s.stability)}/100</b><i><em style="width:${s.stability}%"></em></i></div><div><span>LOYALTY</span><b>${Math.round(s.loyalty)}/100</b><i><em style="width:${s.loyalty}%"></em></i></div></div><div class="v06-rival-activity"><b>Latest move</b><span>${s.activity}</span><small>${stock} units held · ${money(s.lastSales||0)} last sales</small></div><div class="button-row"><button class="secondary-btn" onclick="compareRival('${r.id}')">PRICE CHECK</button><button class="primary-btn" ${s.status!=='Trading'?'disabled':''} onclick="poachRivalStaff('${r.id}')">RECRUIT STAFF</button></div></article>`;}
renderRivals = function(){
  const c=state.competition,holiday=v06Holiday();screen.innerHTML=`<section class="v06-war-hero ${holiday?'holiday':''}"><div><span class="kicker">⚔️ WAR ROOM · ${gameDate().label.toUpperCase()}</span><h2>${holiday?'Christmas retail war is live.':'Own the local toy market.'}</h2><p>Advertising, exclusives, supplier allocations, loyalty and rival expansion now change who controls each shopping territory.</p></div><div class="v06-war-score"><span>YOUR SHARE</span><b>${state.marketShare.toFixed(1)}%</b><small>Pressure ${Math.round(v06WarPressure())}/100</small></div></section><section class="section"><div class="section-head"><div><h2>Needs Your Decision</h2><p>These threats and opportunities are time-sensitive.</p></div></div><div class="v06-alert-stack">${v06AlertCards()}</div></section><section class="section"><div class="section-head"><div><h2>Attack the Market</h2><p>Spend deliberately — rivals react when you become a threat.</p></div></div><div class="v06-war-actions"><button onclick="openCampaignSheet()"><span>📣</span><b>Advertising</b><small>${v06ActiveCampaigns().length}/2 campaigns active</small></button><button onclick="upgradeLoyalty()"><span>🎟️</span><b>${v06LoyaltyName()}</b><small>${c.loyalty.members.toLocaleString()} members</small></button><button onclick="v06ForceDeal()"><span>⭐</span><b>Supplier Deals</b><small>Check exclusives & allocations</small></button></div></section><section class="section"><div class="section-head"><div><h2>Territory Control</h2><p>Your local share is now different across four customer markets.</p></div></div><div class="v06-territory-grid">${Object.entries(c.territories).map(([k,z])=>v06TerritoryCard(k,z)).join('')}</div><div class="v06-share-legend"><span><i style="background:${V06_RIVAL_COLOURS.player}"></i>You</span>${rivalTemplates.map(r=>`<span><i style="background:${V06_RIVAL_COLOURS[r.id]}"></i>${r.name}</span>`).join('')}</div></section><section class="section"><div class="section-head"><div><h2>Rival Companies</h2><p>They can expand, close stores, enter administration and poach talent.</p></div></div><div class="v06-rival-grid">${rivalTemplates.map(v06RivalCard).join('')}</div></section>`;
};
function v06ForceDeal(){if(!state.competition.exclusiveOffer&&!state.competition.allocationBattle){v06MaybeGenerateExclusiveOffer(true);v06MaybeGenerateAllocationBattle(true);saveState();render();toast('Supplier desk refreshed');return;}if(state.competition.allocationBattle)openAllocationBattle();else openExclusiveOffer();}

/* Add competitive status to Store and Empire without sacrificing the v0.5.3 visual work. */
const v06BaseRenderStore = renderStore;
renderStore = function(){v06BaseRenderStore();const c=state.competition,alert=c.allocationBattle||c.exclusiveOffer||c.poachOffer||c.rumours.length||c.priceWars.length;screen.insertAdjacentHTML('afterbegin',`<section class="v06-store-war-strip ${alert?'hot':''}" onclick="switchTab('rivals')"><span>${alert?'⚔️':'🛡️'}</span><div><b>${alert?'War Room needs you':'Competitive position stable'}</b><small>${v06ActiveCampaigns().length} campaigns · ${c.loyalty.members.toLocaleString()} Toy Club members · ${state.marketShare.toFixed(1)}% local share</small></div><strong>WAR ROOM →</strong></section>`);};
const v06BaseRenderEmpire = renderEmpire;
renderEmpire = function(){v06BaseRenderEmpire();const l=state.competition.loyalty,el=screen.querySelector('.empire-hero');if(el)el.insertAdjacentHTML('afterend',`<section class="section"><div class="v06-loyalty-panel"><div><span class="kicker">CUSTOMER LOYALTY</span><h2>${v06LoyaltyName()}</h2><p>${l.members.toLocaleString()} active members. Loyalty increases repeat traffic and helps defend the Family Suburbs.</p></div><div class="v06-loyalty-level"><span>LEVEL</span><b>${l.level}/3</b>${l.level<3?`<button onclick="upgradeLoyalty()">UPGRADE · ${money(v06LoyaltyCost())}</button>`:'<small>MAXIMUM</small>'}</div></div></section>`);};

/* Day summary extension */
const v06BaseBuildDaySummary = buildDaySummary;
buildDaySummary = function(day){const s=v06BaseBuildDaySummary(day);s.marketShare=state.marketShare;s.campaigns=v06ActiveCampaigns().length;s.loyalty=state.competition.loyalty.members;return s;};

/* Global action exposure */
window.openCampaignSheet=openCampaignSheet;window.launchCampaign=launchCampaign;window.upgradeLoyalty=upgradeLoyalty;window.openExclusiveOffer=openExclusiveOffer;window.acceptExclusiveOffer=acceptExclusiveOffer;window.openAllocationBattle=openAllocationBattle;window.bidAllocation=bidAllocation;window.counterRumour=counterRumour;window.openPriceWar=openPriceWar;window.respondPriceWar=respondPriceWar;window.retainPoachedStaff=retainPoachedStaff;window.letStaffPoached=letStaffPoached;window.poachRivalStaff=poachRivalStaff;window.v06ForceDeal=v06ForceDeal;

v06EnsureState();v06ExpireAndResolve();v06MaybeGenerateExclusiveOffer();v06MaybeGenerateAllocationBattle();saveState();render();
setTimeout(()=>{if(state&&!state.competition.v06WelcomeShown){state.competition.v06WelcomeShown=true;saveState();showSplash('THE RETAIL WAR HAS STARTED','Rivals now expand, close stores, fight for supplier allocations, land exclusives, undercut your prices and target your staff. Open the War Room to advertise, build loyalty and take territory before Christmas.','⚔️');}},420);
