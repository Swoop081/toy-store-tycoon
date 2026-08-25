(() => {
  const DATA = window.TST_DATA;
  const SAVE_KEY = 'toyStoreTycoon_v01_save';
  const app = {
    state: null,
    activeView: 'store',
    supplierFilter: 'recommended',
    inventoryFilter: 'all',
    cart: {},
    tradeTimer: null,
    tradeResult: null
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const money = (n, digits=0) => new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',minimumFractionDigits:digits,maximumFractionDigits:digits}).format(n || 0);
  const money2 = n => money(n,2);
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const rand = (min,max) => Math.random()*(max-min)+min;
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function weightedPick(items, weightFn){
    const weights = items.map(x => Math.max(.0001, weightFn(x)));
    const total = weights.reduce((a,b)=>a+b,0);
    let r = Math.random()*total;
    for(let i=0;i<items.length;i++){ r-=weights[i]; if(r<=0) return items[i]; }
    return items[items.length-1];
  }

  function productById(id){ return DATA.products.find(p=>p.id===id); }
  function franchiseById(id){ return DATA.franchises[id]; }
  function manufacturerById(id){ return DATA.manufacturers[id]; }
  function displayName(p){ return p.name; }

  function newGame(storeName){
    const trends = {};
    DATA.products.forEach(p => trends[p.id] = clamp(rand(.92,1.08),.7,1.4));
    trends['vr-blaze'] = 1.12;
    trends['vr-grave'] = 1.08;
    trends['cw-zipstrike'] = 1.09;
    trends['cc-pickles'] = 1.03;

    const state = {
      version:'0.1.5',
      storeName: storeName || 'Toy Box',
      cash:25000,
      startingCash:25000,
      day:1,
      date:'2026-02-02T09:00:00',
      phase:'openingOrder',
      onboardingStep:'openingOrder',
      inventory:{},
      prices:{},
      trends,
      deliveries:[],
      history:[],
      marketFeed:[
        {type:'trend',icon:'🔥',title:'Velocity Racers gaining attention',text:'Local chatter around the new 2026 assortment is picking up.',time:'This morning'},
        {type:'chatter',icon:'💬',title:'Customer chatter',text:'“My son keeps talking about Cyber Warriors.”',time:'This morning'},
        {type:'rival',icon:'🏷️',title:'PlaySaver price watch',text:'The discount rival is advertising selected action figures below RRP.',time:'This morning'}
      ],
      rivalMoves:[],
      competitors:{},
      stats:{lifetimeSales:0,lifetimeProfit:0,lifetimeUnits:0,lostSales:0},
      stockroomCapacity:120,
      dailyBaseExpenses:300,
      lastSummary:null,
      openingOrderDone:false
    };
    DATA.products.forEach(p => state.prices[p.id] = p.rrp);
    state.competitors = makeInitialCompetitors(state);
    return state;
  }

  function makeInitialCompetitors(state){
    const result = {};
    DATA.competitors.forEach(c => {
      const products = {};
      DATA.products.filter(p=>p.orderable!==false).forEach(p => {
        let specialty = 1;
        if(c.id==='collectors') specialty = ['Action Figures','Collectibles','Die-Cast'].includes(p.category) ? 1.55 : .45;
        if(c.id==='playsaver' && ['Playsets','Construction'].includes(p.category)) specialty=.7;
        const stock = Math.max(0,Math.round(p.baseDemand*7*c.stockBias*specialty*rand(.45,1.5)));
        const price = Math.max(p.wholesale*1.08, p.rrp*c.priceBias*rand(.97,1.04));
        products[p.id] = {stock,price:Number(price.toFixed(2))};
      });
      result[c.id] = {products};
    });
    result.playsaver.products['mm-blitz'].price = 26.99;
    result.playsaver.products['mm-riot'].price = 26.99;
    result.collectors.products['vr-blaze'].stock = 2;
    return result;
  }

  function save(){
    if(!app.state) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(app.state)); } catch(e) { console.warn('Save failed',e); }
    updateContinueButton();
  }

  function load(){
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if(!raw) return null;
      const s = JSON.parse(raw);
      if(!s || !s.storeName) return null;
      // v0.1.5+: product names and packaging art are canonical game content.
      if('customNames' in s) delete s.customNames;
      s.version = '0.1.5';
      return s;
    } catch(e){ return null; }
  }

  function updateContinueButton(){
    const b = $('#continueBtn');
    if(!b) return;
    const exists = !!load();
    b.disabled = !exists;
    b.style.opacity = exists ? '1' : '.42';
  }

  function showScreen(id){
    $$('.screen').forEach(s=>s.classList.remove('is-active'));
    $(id).classList.add('is-active');
  }

  function enterGame(){
    showScreen('#gameScreen');
    app.activeView = app.state.phase==='openingOrder' ? 'order' : 'store';
    app.supplierFilter = app.state.phase==='openingOrder' ? 'recommended' : 'titan';
    updateChrome();
    updateNav();
    renderView();
  }

  function updateChrome(){
    if(!app.state) return;
    $('#storeNameLabel').textContent = app.state.storeName;
    $('#cashLabel').textContent = money(app.state.cash,0);
    const d = new Date(app.state.date);
    $('#dateLabel').textContent = d.toLocaleDateString('en-AU',{weekday:'short',day:'numeric',month:'short'}).toUpperCase() + ` • DAY ${app.state.day}`;
  }

  function updateNav(){
    $$('.nav-item').forEach(b=>b.classList.toggle('is-active', b.dataset.view===app.activeView));
  }

  function renderView(){
    updateChrome();
    const root = $('#viewRoot');
    if(!root) return;
    if(app.activeView==='store') root.innerHTML = renderStore();
    if(app.activeView==='order') root.innerHTML = renderOrder();
    if(app.activeView==='inventory') root.innerHTML = renderInventory();
    if(app.activeView==='market') root.innerHTML = renderMarket();
    if(app.activeView==='business') root.innerHTML = renderBusiness();
    bindViewHandlers();
  }

  const BUILD_VERSION = '0.1.7';

  function assetURL(src){
    if(!src || src.startsWith('data:') || src.startsWith('blob:')) return src;
    const joiner = src.includes('?') ? '&' : '?';
    return `${src}${joiner}v=${encodeURIComponent(BUILD_VERSION)}`;
  }

  function artHTML(p, cls=''){
    if(p.image){
      return `<img class="${cls}" data-art-id="${p.id}" src="${esc(assetURL(p.image))}" alt="${esc(displayName(p))} packaging">`;
    }
    const m = manufacturerById(p.manufacturer);
    const f = franchiseById(p.franchise);
    return `<div class="package-placeholder ${cls}" data-art-id="${p.id}" style="--brandA:${m.colorA};--brandB:${m.colorB}"><span><b>${esc(f.name)}</b>${esc(displayName(p))}</span></div>`;
  }

  function renderStore(){
    const invEntries = Object.entries(app.state.inventory).filter(([,v])=>v.total>0);
    const totalUnits = invEntries.reduce((s,[,v])=>s+v.total,0);
    const low = invEntries.filter(([,v])=>v.total<=2).length;
    const incoming = app.state.deliveries.reduce((s,d)=>s+d.items.reduce((a,i)=>a+i.qty,0),0);
    const ready = totalUnits>0 && app.state.phase==='ready';
    const closed = app.state.phase==='closed';
    const openLabel = closed ? 'START NEXT DAY' : (ready ? 'OPEN STORE' : (app.state.phase==='openingOrder' ? 'ORDER OPENING STOCK' : 'STORE NOT READY'));
    const openAction = closed ? 'advance-day' : (ready ? 'open-store' : 'go-order');

    return `
      <div class="page-head">
        <div><div class="eyebrow">YOUR SHOP</div><h2>${esc(app.state.storeName)}</h2><p>${closed?'Today is complete. Restock, order, then move on.':'Build the range. Read the market. Make every shelf earn its space.'}</p></div>
        <div class="page-head-actions"><button class="icon-btn" data-action="save-now" title="Save">✓</button></div>
      </div>

      <section class="store-hero">
        <div class="store-hero-inner">
          <div class="eyebrow">${closed?'STORE CLOSED':ready?'READY TO TRADE':'SETUP IN PROGRESS'}</div>
          <h2>${closed ? `Day ${app.state.day} is in the books.` : ready ? 'Your shelves are stocked. Open the doors.' : 'Your store needs stock before opening.'}</h2>
          <p>${closed ? 'Review the result, refill shelves and place any orders before tomorrow.' : ready ? 'Customers will shop based on price, trends, availability and what your rivals are doing.' : 'Start with the recommended opening order or build your own range.'}</p>
          <div class="store-status">
            <span class="pill pill--good">${totalUnits} units owned</span>
            <span class="pill ${low?'pill--warn':'pill--info'}">${low} low-stock lines</span>
            <span class="pill pill--purple">${incoming} incoming</span>
          </div>
          <div class="hero-action-row">
            <button class="btn btn--hero" data-action="${openAction}" ${(!ready && !closed && app.state.phase!=='openingOrder')?'disabled':''}>${openLabel}</button>
            ${totalUnits?'<button class="btn btn--secondary" data-action="restock-all">RESTOCK ALL</button>':''}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-title-row"><div class="section-title">Store departments</div><div class="section-sub">8 DISPLAY BAYS</div></div>
        <div class="bay-grid">${DATA.bays.map(renderBay).join('')}</div>
      </section>`;
  }

  function bayProductIds(bay){
    return Object.entries(app.state.inventory)
      .filter(([id,v])=>v.shelf>0 && bay.franchises.includes(productById(id)?.franchise))
      .sort((a,b)=>b[1].shelf-a[1].shelf)
      .map(([id])=>id);
  }

  function bayUsed(bay){
    return bayProductIds(bay).reduce((sum,id)=>{
      const p=productById(id), inv=app.state.inventory[id]; return sum + p.shelfSpace*inv.shelf;
    },0);
  }

  function renderBay(bay){
    const ids = bayProductIds(bay);
    const used = bayUsed(bay);
    return `<article class="card bay-card">
      <div class="bay-top"><div><h3>${esc(bay.name)}</h3><p>${esc(bay.subtitle)}</p></div><div class="bay-capacity">${Math.round(used*10)/10} / ${bay.capacity}</div></div>
      ${ids.length ? `<div class="product-rail">${ids.slice(0,8).map(id=>renderMiniProduct(id)).join('')}</div>` : `<div class="empty-bay">No products on this bay yet.</div>`}
    </article>`;
  }

  function productStatus(p, inv){
    const trend = app.state.trends[p.id] || 1;
    const age = Math.max(0, app.state.day - (inv?.firstReceivedDay || app.state.day));
    if(inv?.total===0) return {label:'SOLD OUT',cls:'pill--bad'};
    if(inv?.total<=2) return {label:'LOW STOCK',cls:'pill--warn'};
    if(trend>=1.28) return {label:'HOT',cls:'pill--hot'};
    if(age>=61) return {label:'SLOW',cls:'pill--warn'};
    return {label:'IN STOCK',cls:'pill--good'};
  }

  function renderMiniProduct(id){
    const p=productById(id), inv=app.state.inventory[id], st=productStatus(p,inv);
    return `<button class="product-mini" data-product="${id}" style="text-align:left;color:inherit;border-color:rgba(255,255,255,.08)">
      <span class="pill ${st.cls} mini-badge">${st.label}</span>
      ${artHTML(p)}
      <h4>${esc(displayName(p))}</h4>
      <div class="price">${money2(app.state.prices[id] ?? p.rrp)}</div>
      <div class="stock">${inv.shelf} shelf • ${inv.stockroom} back</div>
    </button>`;
  }

  function renderOrder(){
    if(app.state.phase==='openingOrder' && !Object.keys(app.cart).length){
      DATA.products.filter(p=>p.recommendedQty>0).forEach(p=>app.cart[p.id]=p.recommendedQty);
    }
    const tabs = [
      ...(app.state.phase==='openingOrder'?[{id:'recommended',name:'Recommended'}]:[]),
      ...Object.values(DATA.manufacturers).map(m=>({id:m.id,name:m.name}))
    ];
    if(!tabs.some(t=>t.id===app.supplierFilter)) app.supplierFilter=tabs[0].id;
    let list = DATA.products.filter(p=>p.orderable!==false);
    if(app.supplierFilter==='recommended') list=list.filter(p=>p.recommendedQty>0);
    else list=list.filter(p=>p.manufacturer===app.supplierFilter);
    const cartTotal = cartCost();
    const cartUnits = Object.values(app.cart).reduce((a,b)=>a+b,0);
    const title = app.state.phase==='openingOrder' ? 'Opening order' : 'Supplier catalogue';
    const sub = app.state.phase==='openingOrder' ? 'A balanced starting range is already selected. Change anything you like.' : 'Browse one supplier at a time. Normal orders arrive in two trading days.';

    return `<div class="page-head"><div><div class="eyebrow">BUY STOCK</div><h2>${title}</h2><p>${sub}</p></div></div>
      <div class="supplier-tabs">${tabs.map(t=>`<button class="supplier-tab ${t.id===app.supplierFilter?'is-active':''}" data-supplier="${t.id}">${esc(t.name)}</button>`).join('')}</div>
      <div class="order-summary">
        <div><span>ORDER TOTAL • ${cartUnits} UNITS</span><strong>${money2(cartTotal)}</strong></div>
        <button class="btn btn--hero btn--compact" data-action="checkout" ${cartTotal<=0 || cartTotal>app.state.cash?'disabled':''}>${app.state.phase==='openingOrder'?'BUY OPENING STOCK':'PLACE ORDER'}</button>
      </div>
      <div class="catalog-grid">${list.map(renderCatalogProduct).join('')}</div>`;
  }

  function renderCatalogProduct(p){
    const q=app.cart[p.id]||0;
    const trend=app.state.trends[p.id]||1;
    const availability = trend>1.3 ? 'HIGH DEMAND' : p.evergreen ? 'AVAILABLE' : 'LIMITED';
    return `<article class="card catalog-card">
      <div class="catalog-art">${artHTML(p)}</div>
      <div class="catalog-body">
        <div class="catalog-brand">${esc(franchiseById(p.franchise).name)} • ${esc(p.releaseStructure||'Product')}</div>
        <h3>${esc(displayName(p))}</h3>
        <div class="catalog-price"><div><small>WHOLESALE</small><strong>${money2(p.wholesale)}</strong></div><div style="text-align:right"><small>RRP ${money2(p.rrp)}</small><br><span class="pill ${trend>1.2?'pill--hot':'pill--info'}">${availability}</span></div></div>
        <div class="qty-row"><button data-qty="-" data-id="${p.id}">−</button><div class="qty-display">${q} units</div><button data-qty="+" data-id="${p.id}">+</button></div>
      </div>
    </article>`;
  }

  function cartCost(){
    return Object.entries(app.cart).reduce((s,[id,q])=>s+(productById(id)?.wholesale||0)*q,0);
  }

  function renderInventory(){
    const entries = Object.entries(app.state.inventory).filter(([,v])=>v.total>0 || v.unitsSold>0);
    const deadValue = entries.reduce((s,[id,v])=>{
      const age=app.state.day-(v.firstReceivedDay||app.state.day); return s+(age>=90?v.total*productById(id).wholesale:0);
    },0);
    const low=entries.filter(([,v])=>v.total>0&&v.total<=2).length;
    const hot=entries.filter(([id,v])=>v.total>0&&(app.state.trends[id]||1)>=1.25).length;
    const filters=[['all','All Stock'],['hot','Hot Sellers'],['low','Low Stock'],['slow','Slow Movers'],['clearance','Clearance']];
    let filtered=entries;
    if(app.inventoryFilter==='hot') filtered=entries.filter(([id])=>(app.state.trends[id]||1)>=1.25);
    if(app.inventoryFilter==='low') filtered=entries.filter(([,v])=>v.total>0&&v.total<=2);
    if(app.inventoryFilter==='slow') filtered=entries.filter(([id,v])=>app.state.day-(v.firstReceivedDay||app.state.day)>=31);
    if(app.inventoryFilter==='clearance') filtered=entries.filter(([id])=>(app.state.prices[id]||productById(id).rrp)<=productById(id).rrp*.8);
    filtered.sort((a,b)=>(app.state.trends[b[0]]||1)-(app.state.trends[a[0]]||1));
    return `<div class="page-head"><div><div class="eyebrow">YOUR INVENTORY</div><h2>Stock intelligence</h2><p>See what is moving, what needs attention and where your cash is tied up.</p></div></div>
      <div class="grid-3">
        <div class="card metric-card"><span>LOW STOCK</span><strong>${low}</strong><small>lines need attention</small></div>
        <div class="card metric-card"><span>HOT RIGHT NOW</span><strong>${hot}</strong><small>local demand rising</small></div>
        <div class="card metric-card"><span>DEAD STOCK VALUE</span><strong>${money(deadValue)}</strong><small>90+ days on hand</small></div>
      </div>
      <section class="section"><div class="filter-chips">${filters.map(f=>`<button class="filter-chip ${app.inventoryFilter===f[0]?'is-active':''}" data-invfilter="${f[0]}">${f[1]}</button>`).join('')}</div>
      <div class="inventory-list">${filtered.length?filtered.map(([id,v])=>renderInventoryItem(id,v)).join(''):'<div class="card" style="padding:22px;text-align:center;color:#8e98b8">No products match this filter yet.</div>'}</div></section>`;
  }

  function recommendationFor(p,inv){
    const price=app.state.prices[p.id]||p.rrp, trend=app.state.trends[p.id]||1, age=app.state.day-(inv.firstReceivedDay||app.state.day);
    if(inv.total<=2) return `Low stock. Consider ordering more before you lose sales.`;
    if(trend>=1.3 && price<=p.rrp*1.02) return `Demand is running hot. You may be able to raise the price slightly.`;
    if(price>p.rrp*1.15 && trend<1.05) return `Your price is well above RRP while demand is normal. Consider reducing it.`;
    if(age>=61) return `This stock has been sitting for ${age} days. A markdown could free up cash.`;
    if(age>=31) return `Sell-through is slowing. Watch this line before it becomes stale.`;
    return `Healthy inventory. Current price and demand look balanced.`;
  }

  function renderInventoryItem(id,inv){
    const p=productById(id), st=productStatus(p,inv), age=Math.max(0,app.state.day-(inv.firstReceivedDay||app.state.day));
    return `<button class="card inventory-item" data-product="${id}" style="width:100%;color:inherit;text-align:left;border-color:var(--line)">
      <div class="inventory-thumb">${artHTML(p)}</div>
      <div class="inventory-main"><h3>${esc(displayName(p))}</h3><p>${esc(franchiseById(p.franchise).name)} • ${age} days in store</p><div class="recommendation">${esc(recommendationFor(p,inv))}</div></div>
      <div class="inventory-meta"><span class="pill ${st.cls}">${st.label}</span><strong>${inv.total} units</strong><small>${money2(app.state.prices[id]||p.rrp)}</small></div>
    </button>`;
  }

  function renderMarket(){
    const trenders=DATA.products
      .map(p=>({p,t:app.state.trends[p.id]||1}))
      .sort((a,b)=>b.t-a.t).slice(0,4);
    return `<div class="page-head"><div><div class="eyebrow">LOCAL MARKET</div><h2>What people are saying</h2><p>Customer chatter, product momentum and rival behaviour are real clues to demand.</p></div></div>
      <section class="section" style="margin-top:0"><div class="section-title-row"><div class="section-title">Trending now</div><div class="section-sub">LOCAL DEMAND</div></div>
        <div class="grid-2">${trenders.map(({p,t})=>`<button class="card metric-card" data-product="${p.id}" style="text-align:left;color:inherit;border-color:var(--line)"><span>${esc(franchiseById(p.franchise).name)}</span><strong style="font-size:18px">${esc(displayName(p))}</strong><small>${t>=1.25?'🔥 Demand surging':t>=1.1?'↗ Interest rising':'Steady demand'} • ${(t*100).toFixed(0)} index</small></button>`).join('')}</div>
      </section>
      <section class="section"><div class="section-title-row"><div class="section-title">Customer chatter</div><div class="section-sub">RECENT SIGNALS</div></div><div class="feed-list">${app.state.marketFeed.slice(0,7).map(f=>`<div class="card feed-card"><div class="feed-icon">${f.icon}</div><div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p><div class="feed-time">${esc(f.time)}</div></div></div>`).join('')}</div></section>
      <section class="section"><div class="section-title-row"><div class="section-title">Your rivals</div><div class="section-sub">3 LOCAL STORES</div></div><div class="grid-3">${DATA.competitors.map(renderRivalCard).join('')}</div></section>`;
  }

  function renderRivalCard(c){
    const cp=app.state.competitors[c.id]?.products||{};
    const items=Object.values(cp);
    const inStock=items.filter(x=>x.stock>0).length;
    const avgPriceFactor=DATA.products.filter(p=>cp[p.id]).reduce((s,p)=>s+(cp[p.id].price/p.rrp),0)/Math.max(1,DATA.products.filter(p=>cp[p.id]).length);
    const soldOut=items.filter(x=>x.stock===0).length;
    return `<div class="card rival-card"><div class="rival-head"><div><div class="rival-name">${esc(c.name)}</div><div class="rival-type">${esc(c.type)}</div></div><span style="font-size:26px">${c.id==='toybarn'?'🏬':c.id==='playsaver'?'🏷️':'⭐'}</span></div><div class="rival-stats"><div class="rival-stat"><span>RANGE</span><strong>${inStock}</strong></div><div class="rival-stat"><span>PRICE</span><strong>${Math.round(avgPriceFactor*100)}%</strong></div><div class="rival-stat"><span>SOLD OUT</span><strong>${soldOut}</strong></div></div><p style="color:#98a2c0;font-size:11px;line-height:1.4;margin:10px 0 0">${esc(c.description)}</p></div>`;
  }

  function renderBusiness(){
    const last=app.state.history[app.state.history.length-1];
    const invValue=Object.entries(app.state.inventory).reduce((s,[id,v])=>s+v.total*(v.avgCost||productById(id).wholesale),0);
    const shelfFill=calcShelfFill();
    const net=last?.netProfit||0;
    return `<div class="page-head"><div><div class="eyebrow">BUSINESS</div><h2>Store health</h2><p>Simple numbers first. Deeper systems can come later as your store grows.</p></div></div>
      <div class="pnl-hero"><span>${last?'LAST TRADING DAY':'READY TO BEGIN'}</span><strong class="${net<0?'loss':''}">${last?(net>=0?'+':'')+money(net):money(app.state.cash)}</strong><p>${last?'Net profit after cost of goods and daily overhead.':'Cash available to build your opening range.'}</p></div>
      <section class="section"><div class="grid-2">
        <div class="card metric-card"><span>CASH</span><strong>${money(app.state.cash)}</strong><small>available now</small></div>
        <div class="card metric-card"><span>INVENTORY VALUE</span><strong>${money(invValue)}</strong><small>at landed cost</small></div>
        <div class="card metric-card"><span>SHELF FILL</span><strong>${Math.round(shelfFill)}%</strong><small>across 8 bays</small></div>
        <div class="card metric-card"><span>LIFETIME SALES</span><strong>${money(app.state.stats.lifetimeSales)}</strong><small>${app.state.stats.lifetimeUnits} units sold</small></div>
      </div></section>
      <section class="section"><div class="section-title-row"><div class="section-title">Recent days</div><div class="section-sub">P&L HISTORY</div></div><div class="history-list">${app.state.history.length?app.state.history.slice(-7).reverse().map(h=>`<div class="history-row"><span>Day ${h.day} • ${esc(h.dateLabel)}</span><strong style="color:${h.netProfit>=0?'#79eda3':'#ff8893'}">${h.netProfit>=0?'+':''}${money(h.netProfit)}</strong></div>`).join(''):'<div class="card" style="padding:20px;color:#8f99b9">Your first daily result will appear here after trading.</div>'}</div></section>`;
  }

  function calcShelfFill(){
    const used=DATA.bays.reduce((s,b)=>s+bayUsed(b),0), total=DATA.bays.reduce((s,b)=>s+b.capacity,0);
    return total?used/total*100:0;
  }

  function bindViewHandlers(){
    $$('[data-product]', $('#viewRoot')).forEach(el=>el.addEventListener('click',()=>openProduct(el.dataset.product)));
    $$('[data-supplier]', $('#viewRoot')).forEach(el=>el.addEventListener('click',()=>{app.supplierFilter=el.dataset.supplier;renderView();}));
    $$('[data-invfilter]', $('#viewRoot')).forEach(el=>el.addEventListener('click',()=>{app.inventoryFilter=el.dataset.invfilter;renderView();}));
    $$('[data-qty]', $('#viewRoot')).forEach(el=>el.addEventListener('click',()=>adjustCart(el.dataset.id,el.dataset.qty==='+'?1:-1)));
    $$('[data-action]', $('#viewRoot')).forEach(el=>el.addEventListener('click',()=>handleAction(el.dataset.action)));
  }

  function handleAction(action){
    if(action==='save-now'){ save(); toast('Game saved.','good'); }
    if(action==='go-order'){ app.activeView='order'; app.supplierFilter=app.state.phase==='openingOrder'?'recommended':'titan'; updateNav(); renderView(); }
    if(action==='restock-all'){ restockAll(); save(); renderView(); toast('Shelves restocked from the stockroom.','good'); }
    if(action==='checkout'){ checkout(); }
    if(action==='open-store'){ startTradingDay(); }
    if(action==='advance-day'){ advanceDay(); }
  }

  function adjustCart(id,dir){
    const p=productById(id); if(!p) return;
    const step=p.orderPack||1;
    const current=app.cart[id]||0;
    const next=Math.max(0,current+dir*step);
    app.cart[id]=next;
    if(next===0) delete app.cart[id];
    renderView();
  }

  function checkout(){
    const total=cartCost();
    if(total<=0) return;
    if(total>app.state.cash){toast('Not enough cash for this order.','bad');return;}
    const items=Object.entries(app.cart).filter(([,q])=>q>0).map(([id,qty])=>({id,qty}));
    if(!items.length) return;
    app.state.cash-=total;
    if(app.state.phase==='openingOrder'){
      items.forEach(({id,qty})=>receiveStock(id,qty,productById(id).wholesale));
      app.state.openingOrderDone=true;
      app.state.onboardingStep='delivery';
      app.cart={};
      save(); updateChrome();
      showOpeningDelivery(items,total);
    } else {
      app.state.deliveries.push({id:'del-'+Date.now(),placedDay:app.state.day,arrivalDay:app.state.day+2,items,cost:total});
      app.cart={};
      save(); renderView(); toast(`Order placed. Delivery due in 2 trading days.`, 'good');
    }
  }

  function receiveStock(id,qty,cost){
    const p=productById(id); if(!p) return;
    const inv=app.state.inventory[id] || {total:0,shelf:0,stockroom:0,avgCost:cost,firstReceivedDay:app.state.day,unitsSold:0,revenue:0,cogs:0};
    const oldValue=inv.total*(inv.avgCost||cost);
    inv.total += qty;
    inv.stockroom += qty;
    inv.avgCost = (oldValue+qty*cost)/Math.max(1,inv.total);
    if(!inv.firstReceivedDay) inv.firstReceivedDay=app.state.day;
    app.state.inventory[id]=inv;
  }

  function showOpeningDelivery(items,total){
    const names=items.slice(0,5).map(i=>displayName(productById(i.id))).join(' • ');
    openModal(`<div class="modal-handle"></div><div class="modal-head"><div><div class="eyebrow">DELIVERY ARRIVED</div><h2>Your first stock is here.</h2><p>${items.reduce((s,i)=>s+i.qty,0)} units • ${money2(total)} wholesale</p></div></div>
      <div class="card" style="padding:16px;margin-top:16px"><div style="font-size:40px">📦 📦 📦</div><p style="color:#aab3cf;line-height:1.5;margin-bottom:0">${esc(names)}${items.length>5?' and more':''}</p></div>
      <div class="modal-actions"><button class="btn btn--hero" data-modal-action="unpack-opening">UNPACK DELIVERY</button></div>`);
  }

  function unpackOpening(){
    restockAll();
    app.state.phase='ready';
    app.state.onboardingStep='pricing';
    save();
    showPricingLesson();
  }

  function showPricingLesson(){
    const p=productById('rotg-draxon');
    const choices=[27.99,29.99,32.99];
    openModal(`<div class="modal-handle"></div><div class="modal-head"><div><div class="eyebrow">FIRST PRICING DECISION</div><h2>${esc(displayName(p))}</h2><p>Wholesale ${money2(p.wholesale)} • RRP ${money2(p.rrp)}</p></div></div>
      <div class="modal-product"><div class="modal-product-art">${artHTML(p)}</div><div><p style="color:#b7c0dc;font-size:13px;line-height:1.45;margin-top:0">Customers react to price, demand and rival availability. You can change prices at any time.</p><div class="modal-actions">${choices.map(v=>`<button class="btn ${v===29.99?'btn--hero':'btn--secondary'}" data-price-choice="${v}">${money2(v)}${v===29.99?' • RRP':''}</button>`).join('')}</div></div></div>`);
  }

  function restockAll(){
    DATA.bays.forEach(bay=>{
      let used=bayUsed(bay);
      const candidates=Object.entries(app.state.inventory)
        .filter(([id,v])=>v.stockroom>0 && bay.franchises.includes(productById(id)?.franchise))
        .sort((a,b)=>(app.state.trends[b[0]]||1)-(app.state.trends[a[0]]||1));
      for(const [id,inv] of candidates){
        const p=productById(id);
        while(inv.stockroom>0 && used+p.shelfSpace<=bay.capacity+.0001){
          inv.stockroom--; inv.shelf++; used+=p.shelfSpace;
        }
      }
    });
  }

  function openProduct(id){
    const p=productById(id); if(!p) return;
    const inv=app.state.inventory[id] || {total:0,shelf:0,stockroom:0,avgCost:p.wholesale,firstReceivedDay:app.state.day,unitsSold:0};
    const competitors=DATA.competitors.map(c=>app.state.competitors[c.id]?.products[id]).filter(Boolean);
    const compAvg=competitors.length?competitors.reduce((s,x)=>s+x.price,0)/competitors.length:p.rrp;
    const age=Math.max(0,app.state.day-(inv.firstReceivedDay||app.state.day));
    const trend=app.state.trends[id]||1;
    const currentPrice=app.state.prices[id]||p.rrp;
    openModal(`<div class="modal-handle"></div><div class="modal-head"><div><div class="eyebrow">${esc(franchiseById(p.franchise).name)}</div><h2>${esc(displayName(p))}</h2><p>${esc(manufacturerById(p.manufacturer).name)} • ${esc(p.releaseStructure||p.category)}</p></div><button class="icon-btn" data-modal-action="close">×</button></div>
      <div class="modal-product">
        <div class="modal-product-art">${artHTML(p)}</div>
        <div><div class="detail-grid">
          <div class="detail-stat"><span>ON HAND</span><strong>${inv.total}</strong></div>
          <div class="detail-stat"><span>ON SHELF</span><strong>${inv.shelf}</strong></div>
          <div class="detail-stat"><span>WHOLESALE</span><strong>${money2(inv.avgCost||p.wholesale)}</strong></div>
          <div class="detail-stat"><span>RRP</span><strong>${money2(p.rrp)}</strong></div>
          <div class="detail-stat"><span>DAYS IN STORE</span><strong>${age}</strong></div>
          <div class="detail-stat"><span>MARKET DEMAND</span><strong>${Math.round(trend*100)}</strong></div>
          <div class="detail-stat"><span>RIVAL AVG</span><strong>${money2(compAvg)}</strong></div>
          <div class="detail-stat"><span>UNITS SOLD</span><strong>${inv.unitsSold||0}</strong></div>
        </div></div>
      </div>
      <div class="recommend-box"><b>RECOMMENDATION</b><p>${esc(recommendationFor(p,inv))}</p></div>
      <div class="price-control"><button data-price-step="-1" data-id="${id}">−</button><div class="price-display"><span>YOUR PRICE</span><strong id="modalPrice">${money2(currentPrice)}</strong></div><button data-price-step="1" data-id="${id}">+</button></div>
      ${inv.stockroom>0?'<div class="modal-actions"><button class="btn btn--secondary" data-modal-action="restock-product" data-id="'+id+'">RESTOCK THIS PRODUCT</button></div>':''}`);
    bindModalProductControls();
  }

  function bindModalProductControls(){
    $$('[data-price-step]', $('#modalLayer')).forEach(el=>el.addEventListener('click',()=>{
      const id=el.dataset.id, p=productById(id), step=Number(el.dataset.priceStep);
      const curr=app.state.prices[id]||p.rrp;
      const next=Math.max(.99,Math.round((curr+step)*100)/100);
      app.state.prices[id]=next; save(); $('#modalPrice').textContent=money2(next); updateChrome();
    }));
  }

  function restockProduct(id){
    const inv=app.state.inventory[id], p=productById(id); if(!inv||!p||inv.stockroom<=0) return;
    const bay=DATA.bays.find(b=>b.franchises.includes(p.franchise)); if(!bay) return;
    let used=bayUsed(bay), moved=0;
    while(inv.stockroom>0 && used+p.shelfSpace<=bay.capacity+.0001){inv.stockroom--;inv.shelf++;used+=p.shelfSpace;moved++;}
    save(); toast(`${moved} units moved to the shelf.`, moved?'good':'bad'); openProduct(id);
  }



  function startTradingDay(){
    if(app.state.phase!=='ready') return;
    const totalStock=Object.values(app.state.inventory).reduce((s,v)=>s+v.total,0);
    if(totalStock<=0){toast('You need stock before opening.','bad');return;}
    app.state.phase='trading'; save();
    app.tradeResult=simulateDay();
    showTradingModal(app.tradeResult);
  }

  function simulateDay(){
    const stock={};
    const startingShelf={};
    Object.entries(app.state.inventory).forEach(([id,v])=>{stock[id]=v.total; startingShelf[id]=v.shelf;});
    const assortment=Object.keys(stock).filter(id=>stock[id]>0);
    const events=[];
    const sales={}; const lost={};
    let revenue=0,cogs=0,units=0;
    const customerCount=Math.round(rand(72,92));
    const times=[];
    for(let i=0;i<customerCount;i++) times.push(9*60+Math.floor(Math.pow(Math.random(),.88)*(8.5*60)));
    times.sort((a,b)=>a-b);

    for(let i=0;i<customerCount;i++){
      const type=weightedPick(DATA.customerTypes,t=>t.weight);
      const p=weightedPick(assortment.map(productById), product=>{
        let w=product.baseDemand*(app.state.trends[product.id]||1);
        if(app.state.day===1 && product.id==='bw-racer') w*=2.7;
        if(type.id==='collector' && ['Action Figures','Collectibles','Die-Cast'].includes(product.category)) w*=1.8;
        if(type.id==='parent' && ['Dolls','Plush','Creative','Board Games','Construction'].includes(product.category)) w*=1.25;
        if(type.id==='childParent' && ['Action Figures','Die-Cast','Dolls','Blasters'].includes(product.category)) w*=1.35;
        if(type.id==='enthusiast' && ['Construction','Board Games','Action Figures'].includes(product.category)) w*=1.45;
        return w;
      });
      if(!p) continue;
      const userPrice=app.state.prices[p.id]||p.rrp;
      const comps=DATA.competitors.map(c=>app.state.competitors[c.id]?.products[p.id]).filter(x=>x&&x.stock>0);
      const bestComp=comps.length?Math.min(...comps.map(x=>x.price)):Infinity;
      const priceRatio=p.rrp/userPrice;
      let priceFactor=Math.pow(priceRatio,type.priceSensitivity);
      if(userPrice>p.rrp*1.2) priceFactor*=.72;
      if(userPrice<p.rrp*.9) priceFactor*=1.1;
      let competitorFactor=1;
      if(bestComp<userPrice*.92) competitorFactor=.72;
      if(!isFinite(bestComp)) competitorFactor=1.13;
      const interest=clamp(.52*p.baseDemand*(app.state.trends[p.id]||1)*priceFactor*competitorFactor,.12,.94);
      if(Math.random()>interest) {
        if(Math.random()<.08 && userPrice>p.rrp*1.08) events.push({minute:times[i],type:'chatter',title:`Customer passed on ${displayName(p)}`,text:`“That feels a little expensive.”`});
        continue;
      }
      if((stock[p.id]||0)<=0){
        lost[p.id]=(lost[p.id]||0)+1;
        events.push({minute:times[i],type:'lost',title:`Lost sale — ${displayName(p)}`,text:`Customer wanted it, but you were sold out.`});
        continue;
      }
      let qty=1;
      if(['Die-Cast','Collectibles'].includes(p.category) && Math.random()<.33) qty=Math.min(stock[p.id],Math.random()<.25?3:2);
      if(type.id==='enthusiast' && ['Board Games','Action Figures'].includes(p.category) && Math.random()<.12) qty=Math.min(stock[p.id],2);
      stock[p.id]-=qty;
      sales[p.id]=(sales[p.id]||0)+qty;
      revenue+=userPrice*qty; cogs+=(app.state.inventory[p.id]?.avgCost||p.wholesale)*qty; units+=qty;
      events.push({minute:times[i],type:'sale',title:`${displayName(p)} ×${qty} sold`,text:`${money2(userPrice*qty)} sale`});
      if(Math.random()<type.basket){
        const attach=attachmentFor(p,stock);
        if(attach){
          const ap=productById(attach), apPrice=app.state.prices[attach]||ap.rrp;
          if(Math.random()<.55 && stock[attach]>0){stock[attach]--;sales[attach]=(sales[attach]||0)+1;revenue+=apPrice;cogs+=(app.state.inventory[attach]?.avgCost||ap.wholesale);units++;events.push({minute:times[i]+2,type:'sale',title:`Added ${displayName(ap)}`,text:`Basket add-on • ${money2(apPrice)}`});}
        }
      }
    }

    if(app.state.day===1){
      events.push({minute:15*60+10,type:'chatter',title:'Customer chatter',text:'“Everyone at school is collecting Velocity Racers.”'});
      events.push({minute:16*60+5,type:'chatter',title:'Customer chatter',text:'“My son keeps talking about Cyber Warriors.”'});
    }
    events.sort((a,b)=>a.minute-b.minute);
    const expenses=app.state.dailyBaseExpenses;
    const gross=revenue-cogs, net=gross-expenses;
    return {events,sales,lost,revenue,cogs,gross,expenses,net,units,finalStock:stock,customerCount};
  }

  function attachmentFor(p,stock){
    const candidates=[];
    if(p.franchise==='blast'){ candidates.push('bf-darts20','bf-darts50','bf-mag'); }
    if(p.franchise==='starlight'){ candidates.push('sg-cruiser','sg-studio'); }
    if(p.franchise==='velocity'){ candidates.push('vr-loop','vr-crash'); }
    if(p.id==='bt-kingdom') candidates.push('bt-northern');
    if(p.franchise==='metro') candidates.push('mm-slammer');
    return candidates.find(id=>stock[id]>0) || null;
  }

  function showTradingModal(result){
    openModal(`<div class="modal-handle"></div><div class="trade-modal"><div class="eyebrow" style="text-align:center">STORE OPEN</div><div class="trade-clock" id="tradeClock">9:00 AM</div><div class="trade-sub">Customers are shopping • Day ${app.state.day}</div><div class="trade-stats"><div class="trade-stat"><span>SALES</span><strong id="tradeSales">$0</strong></div><div class="trade-stat"><span>UNITS</span><strong id="tradeUnits">0</strong></div><div class="trade-stat"><span>LOST SALES</span><strong id="tradeLost">0</strong></div></div><div class="trade-feed" id="tradeFeed"></div><div class="modal-actions"><button class="btn btn--secondary" id="skipTradeBtn">SKIP TO CLOSE</button></div></div>`,'trade');
    let idx=0, runningSales=0, runningUnits=0, runningLost=0;
    const duration=24000;
    const start=performance.now();
    const tick=now=>{
      const t=clamp((now-start)/duration,0,1);
      const minute=9*60+Math.floor(t*(8.5*60));
      $('#tradeClock').textContent=formatTime(minute);
      while(idx<result.events.length && result.events[idx].minute<=minute){
        const e=result.events[idx++];
        const el=document.createElement('div'); el.className=`trade-event ${e.type}`; el.innerHTML=`<b>${esc(e.title)}</b><p>${esc(e.text)}</p>`;
        const feed=$('#tradeFeed'); feed.prepend(el); while(feed.children.length>9) feed.lastElementChild.remove();
        if(e.type==='sale'){
          const m=e.text.match(/\$[\d,.]+/); if(m) runningSales+=Number(m[0].replace(/[$,]/g,''));
          const qm=e.title.match(/×(\d+)/); runningUnits+=qm?Number(qm[1]):1;
        }
        if(e.type==='lost') runningLost++;
        $('#tradeSales').textContent=money(runningSales); $('#tradeUnits').textContent=runningUnits; $('#tradeLost').textContent=runningLost;
      }
      if(t<1) app.tradeTimer=requestAnimationFrame(tick); else finishTradingDay();
    };
    app.tradeTimer=requestAnimationFrame(tick);
    $('#skipTradeBtn').addEventListener('click',()=>{ if(app.tradeTimer) cancelAnimationFrame(app.tradeTimer); finishTradingDay(); });
  }

  function formatTime(minute){
    const h24=Math.floor(minute/60), m=minute%60, am=h24<12, h=((h24+11)%12)+1;
    return `${h}:${String(m).padStart(2,'0')} ${am?'AM':'PM'}`;
  }

  function finishTradingDay(){
    if(!app.tradeResult || app.state.phase!=='trading') return;
    if(app.tradeTimer) cancelAnimationFrame(app.tradeTimer); app.tradeTimer=null;
    const r=app.tradeResult; app.tradeResult=null;
    Object.entries(r.sales).forEach(([id,qty])=>{
      const inv=app.state.inventory[id]; if(!inv) return;
      inv.total=Math.max(0,inv.total-qty);
      let remaining=qty;
      const fromShelf=Math.min(inv.shelf,remaining); inv.shelf-=fromShelf; remaining-=fromShelf;
      if(remaining>0) inv.stockroom=Math.max(0,inv.stockroom-remaining);
      inv.unitsSold=(inv.unitsSold||0)+qty; inv.revenue=(inv.revenue||0)+(app.state.prices[id]||productById(id).rrp)*qty; inv.cogs=(inv.cogs||0)+(inv.avgCost||productById(id).wholesale)*qty;
    });
    const dateLabel=new Date(app.state.date).toLocaleDateString('en-AU',{weekday:'short',day:'numeric',month:'short'});
    const best=Object.entries(r.sales).sort((a,b)=>b[1]-a[1])[0];
    const missed=Object.entries(r.lost).sort((a,b)=>b[1]-a[1])[0];
    const watch=DATA.products.map(p=>({p,t:app.state.trends[p.id]||1})).sort((a,b)=>b.t-a.t)[0];
    const summary={day:app.state.day,dateLabel,revenue:r.revenue,cogs:r.cogs,gross:r.gross,expenses:r.expenses,netProfit:r.net,units:r.units,bestProduct:best?.[0],bestQty:best?.[1]||0,missedProduct:missed?.[0],missedQty:missed?.[1]||0,watchProduct:watch?.p.id};
    app.state.history.push(summary); app.state.lastSummary=summary;
    app.state.cash+=r.revenue;
    app.state.stats.lifetimeSales+=r.revenue; app.state.stats.lifetimeProfit+=r.net; app.state.stats.lifetimeUnits+=r.units; app.state.stats.lostSales+=Object.values(r.lost).reduce((a,b)=>a+b,0);
    app.state.phase='closed';
    updateAfterDay(r);
    save(); updateChrome();
    showDaySummary(summary);
  }

  function updateAfterDay(r){
    // Demand evolves with a little persistence and occasional buzz.
    DATA.products.forEach(p=>{
      let t=app.state.trends[p.id]||1;
      t += (1-t)*.10 + rand(-.05,.05);
      if((r.sales[p.id]||0)>=4) t+=.035;
      if(Math.random()<.012*(p.viralPotential||1)) t+=rand(.18,.52);
      app.state.trends[p.id]=clamp(t,.55,2.2);
    });
    if(app.state.day===1){ app.state.trends['vr-blaze']=Math.max(app.state.trends['vr-blaze'],1.32); app.state.trends['cw-zipstrike']=Math.max(app.state.trends['cw-zipstrike'],1.18); }
    simulateCompetitors();
    const chatter=generateChatter();
    app.state.marketFeed=[...chatter,...app.state.marketFeed].slice(0,20);
  }

  function simulateCompetitors(){
    const moves=[];
    DATA.competitors.forEach(c=>{
      const cp=app.state.competitors[c.id].products;
      DATA.products.filter(p=>cp[p.id]).forEach(p=>{
        const item=cp[p.id], demand=p.baseDemand*(app.state.trends[p.id]||1);
        const sold=Math.min(item.stock,Math.max(0,Math.round(demand*rand(.25,1.25))));
        item.stock-=sold;
        if(item.stock<=1 && Math.random()<.25) moves.push(`${c.name} is nearly sold out of ${displayName(p)}.`);
        if(Math.random()<.055){
          const old=item.price;
          const target=Math.max(p.wholesale*1.08,p.rrp*c.priceBias*rand(.94,1.04)); item.price=Number(target.toFixed(2));
          if(Math.abs(item.price-old)>2) moves.push(`${c.name} moved ${displayName(p)} to ${money2(item.price)}.`);
        }
        if(item.stock===0 && Math.random()<.38){item.stock=Math.max(1,Math.round(p.baseDemand*c.stockBias*rand(3,8)));}
      });
    });
    app.state.rivalMoves=moves.slice(0,6);
    moves.slice(0,3).forEach(text=>app.state.marketFeed.unshift({type:'rival',icon:'🏷️',title:'Rival move',text,time:`After Day ${app.state.day}`}));
  }

  function generateChatter(){
    const top=DATA.products.map(p=>({p,t:app.state.trends[p.id]||1})).sort((a,b)=>b.t-a.t).slice(0,7);
    const templates=[
      p=>`“My kid won't stop talking about ${displayName(p)}.”`,
      p=>`“Do you have ${displayName(p)}? I couldn't find it anywhere yesterday.”`,
      p=>`“Everyone at school seems to want ${displayName(p)}.”`,
      p=>`“I keep seeing ${displayName(p)} everywhere lately.”`
    ];
    return top.slice(0,2).map(({p})=>({type:'chatter',icon:'💬',title:'Customer chatter',text:pick(templates)(p),time:`After Day ${app.state.day}`}));
  }

  function showDaySummary(s){
    const best=s.bestProduct?productById(s.bestProduct):null, missed=s.missedProduct?productById(s.missedProduct):null, watch=s.watchProduct?productById(s.watchProduct):null;
    openModal(`<div class="modal-handle"></div><div class="summary-hero"><div class="eyebrow">STORE CLOSED</div><h2>${esc(s.dateLabel)} • Day ${s.day}</h2><div class="summary-label">NET PROFIT</div><div class="summary-net ${s.netProfit<0?'loss':''}">${s.netProfit>=0?'+':''}${money(s.netProfit)}</div></div>
      <div class="grid-2"><div class="card metric-card"><span>SALES</span><strong>${money(s.revenue)}</strong></div><div class="card metric-card"><span>COST OF GOODS</span><strong>${money(s.cogs)}</strong></div><div class="card metric-card"><span>GROSS PROFIT</span><strong>${money(s.gross)}</strong></div><div class="card metric-card"><span>EXPENSES</span><strong>${money(s.expenses)}</strong></div></div>
      <section class="section"><div class="grid-3"><div class="card highlight-card"><span>🔥 BEST SELLER</span><strong>${best?esc(displayName(best)):'—'}</strong><p>${s.bestQty} units sold today.</p></div><div class="card highlight-card"><span>⚠️ LOST OPPORTUNITY</span><strong>${missed?esc(displayName(missed)):'No major misses'}</strong><p>${missed?`${s.missedQty} customers wanted it after you sold out.`:'You kept key lines available.'}</p></div><div class="card highlight-card"><span>📈 WATCH TOMORROW</span><strong>${watch?esc(displayName(watch)):'Market'}</strong><p>Local interest is among the strongest in your market.</p></div></div></section>
      <div class="modal-actions"><button class="btn btn--secondary" data-modal-action="summary-restock">RESTOCK STORE</button><button class="btn btn--secondary" data-modal-action="summary-order">PLACE ORDERS</button><button class="btn btn--hero" data-modal-action="summary-next">START NEXT DAY</button></div>`);
  }

  function advanceDay(){
    if(app.state.phase!=='closed') return;
    const d=new Date(app.state.date); d.setDate(d.getDate()+1); app.state.date=d.toISOString(); app.state.day++;
    processDeliveries();
    app.state.phase='ready';
    restockAll();
    save(); closeModal(); app.activeView='store'; updateNav(); renderView();
    const due=app.state.deliveries.filter(x=>x.arrivalDay===app.state.day).length;
    toast(`Day ${app.state.day} ready to trade.`, 'good');
  }

  function processDeliveries(){
    const arriving=app.state.deliveries.filter(d=>d.arrivalDay<=app.state.day);
    if(!arriving.length) return;
    arriving.forEach(d=>d.items.forEach(i=>receiveStock(i.id,i.qty,productById(i.id).wholesale)));
    app.state.deliveries=app.state.deliveries.filter(d=>d.arrivalDay>app.state.day);
    const units=arriving.reduce((s,d)=>s+d.items.reduce((a,i)=>a+i.qty,0),0);
    app.state.marketFeed.unshift({type:'delivery',icon:'📦',title:'Supplier delivery arrived',text:`${units} units were received into your stockroom.`,time:`Day ${app.state.day}`});
  }

  function openModal(html,kind=''){ const layer=$('#modalLayer'); layer.className='modal-layer is-open'; layer.innerHTML=`<div class="modal ${kind==='trade'?'trade-modal':''}">${html}</div>`; bindModalActions(); }
  function closeModal(){ if(app.tradeTimer){cancelAnimationFrame(app.tradeTimer);app.tradeTimer=null;} const layer=$('#modalLayer'); layer.className='modal-layer'; layer.innerHTML=''; }

  function bindModalActions(){
    $$('[data-modal-action]', $('#modalLayer')).forEach(el=>el.addEventListener('click',()=>{
      const a=el.dataset.modalAction,id=el.dataset.id;
      if(a==='close') closeModal();
      if(a==='unpack-opening') unpackOpening();
      if(a==='restock-product') restockProduct(id);
      if(a==='summary-restock'){restockAll();save();toast('Shelves restocked.','good');}
      if(a==='summary-order'){closeModal();app.activeView='order';app.supplierFilter='titan';updateNav();renderView();}
      if(a==='summary-next') advanceDay();
    }));
    $$('[data-price-choice]', $('#modalLayer')).forEach(el=>el.addEventListener('click',()=>{
      app.state.prices['rotg-draxon']=Number(el.dataset.priceChoice); app.state.onboardingStep='complete'; save(); closeModal(); app.activeView='store'; updateNav(); renderView(); toast('Price set. Your store is ready to open.','good');
    }));
  }



  function toast(msg,type=''){
    const layer=$('#toastLayer'), el=document.createElement('div'); el.className=`toast ${type}`; el.textContent=msg; layer.appendChild(el); setTimeout(()=>el.remove(),2500);
  }



  // Main navigation + app boot
  $('#newStoreBtn').addEventListener('click',()=>{showScreen('#newStoreScreen');$('#storeNameInput').focus();});
  $('#continueBtn').addEventListener('click',()=>{const s=load();if(!s)return;app.state=s;enterGame();});
  $('#setupBackBtn').addEventListener('click',()=>showScreen('#mainMenu'));
  $('#createStoreBtn').addEventListener('click',()=>{const name=$('#storeNameInput').value.trim()||'Toy Box';app.state=newGame(name);save();enterGame();});
  $$('.nav-item').forEach(b=>b.addEventListener('click',()=>{if(app.state?.phase==='trading')return;app.activeView=b.dataset.view; if(app.activeView==='order'&&app.state.phase!=='openingOrder'&&app.supplierFilter==='recommended')app.supplierFilter='titan';updateNav();renderView();}));
  $('#modalLayer').addEventListener('click',e=>{if(e.target===$('#modalLayer') && app.state?.phase!=='trading')closeModal();});

  updateContinueButton();
})();
