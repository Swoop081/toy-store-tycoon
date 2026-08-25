window.TST_DATA = (() => {
  const manufacturers = {
    titan: { id:'titan', name:'Titan Toys', colorA:'#f05c46', colorB:'#54205f' },
    vector: { id:'vector', name:'Vector Toys', colorA:'#3aa6ff', colorB:'#26326c' },
    playburst: { id:'playburst', name:'PlayBurst Toys', colorA:'#ff74a5', colorB:'#6b3ab8' },
    brickworks: { id:'brickworks', name:'BrickWorks Toys', colorA:'#ffc52e', colorB:'#d3482f' },
    brighttable: { id:'brighttable', name:'Bright Table Games', colorA:'#57d39f', colorB:'#255e79' },
    nova: { id:'nova', name:'Nova Collectibles', colorA:'#b181ff', colorB:'#3f275f' }
  };

  const franchises = {
    raiders:{name:'Raiders of the Galaxy',manufacturer:'titan'},
    cyber:{name:'Cyber Warriors',manufacturer:'vector'},
    global:{name:'Global Command',manufacturer:'vector'},
    metro:{name:'Metro Mutants',manufacturer:'playburst'},
    velocity:{name:'Velocity Racers',manufacturer:'titan'},
    starlight:{name:'Starlight Girls',manufacturer:'titan'},
    brick:{name:'BrickWorks',manufacturer:'brickworks'},
    blast:{name:'BlastForce',manufacturer:'vector'},
    squish:{name:'SquishLab',manufacturer:'playburst'},
    cuddle:{name:'Cuddle Crew',manufacturer:'playburst'},
    bright:{name:'Bright Table Games',manufacturer:'brighttable'},
    critters:{name:'Mystery Critters',manufacturer:'nova'}
  };

  const p = (id, franchise, name, category, wholesale, rrp, demand, shelfSpace, extra={}) => ({
    id, franchise, manufacturer:franchises[franchise].manufacturer, name, category, wholesale, rrp,
    baseDemand:demand, shelfSpace, evergreen:true, orderPack:1, recommendedQty:0, ...extra
  });

  const products = [
    // Titan Toys — Raiders of the Galaxy
    p('rotg-draxon','raiders','Draxon — Galactic Champion','Action Figures',15,29.99,1.15,1,{image:'assets/products/raiders-of-the-galaxy/draxon-package.png',recommendedQty:8,releaseStructure:'Wave 1'}),
    p('rotg-skullfang','raiders','Skullfang — Tyrant of the Dead Moon','Action Figures',15,29.99,1.02,1,{image:'assets/products/raiders-of-the-galaxy/skullfang-package.png',recommendedQty:6,releaseStructure:'Wave 1'}),
    p('rotg-ironclaw','raiders','Ironclaw — Beast of Vargos','Action Figures',15,29.99,.82,1,{image:'assets/products/raiders-of-the-galaxy/ironclaw-package.png',recommendedQty:4,releaseStructure:'Wave 1'}),
    p('rotg-nyra','raiders','Nyra — Guardian of the Star Crystal','Action Figures',15,29.99,1.0,1,{image:'assets/products/raiders-of-the-galaxy/nyra-package.png',recommendedQty:6,releaseStructure:'Wave 1'}),
    p('rotg-astralon','raiders','Castle Astralon','Playsets',62,119.99,.46,7,{image:'assets/products/raiders-of-the-galaxy/castle-astralon-package.png',evergreen:false,releaseStructure:'Flagship Playset'}),
    p('rotg-ravager','raiders','Ravager Battle Beast','Vehicles',28,54.99,.62,3,{image:'assets/products/raiders-of-the-galaxy/ravager-battle-beast-package.png',releaseStructure:'Vehicle'}),

    // Vector Toys — Cyber Warriors
    p('cw-vanguard','cyber','Vanguard Prime — Commander of the Guardians','Action Figures',39,79.99,.92,2,{recommendedQty:4,releaseStructure:'Wave 1'}),
    p('cw-overlord','cyber','Overlord X — Emperor of the Dominion','Action Figures',39,79.99,.74,2,{recommendedQty:3,releaseStructure:'Wave 1'}),
    p('cw-zipstrike','cyber','Zipstrike — Street Scout','Action Figures',17,34.99,1.18,1,{recommendedQty:6,releaseStructure:'Wave 1'}),
    p('cw-skyrazor','cyber','Skyrazor — Dominion Air Commander','Action Figures',25,49.99,.88,1.5,{recommendedQty:4,releaseStructure:'Wave 1'}),

    // Vector Toys — Global Command
    p('gc-valor','global','Major Valor — Field Commander','Action Figures',14,29.99,.78,1,{recommendedQty:4,releaseStructure:'Wave 1'}),
    p('gc-nightblade','global','Nightblade — Covert Operative','Action Figures',14,29.99,1.02,1,{recommendedQty:5,releaseStructure:'Wave 1'}),
    p('gc-serpent','global','Serpent King — Supreme Enemy Commander','Action Figures',14,29.99,.74,1,{recommendedQty:3,releaseStructure:'Wave 1'}),
    p('gc-whiteviper','global','White Viper — Shadow Assassin','Action Figures',14,29.99,.83,1,{recommendedQty:3,releaseStructure:'Wave 1'}),
    p('gc-jackal','global','Jackal Strike Buggy','Vehicles',24,49.99,.55,3,{releaseStructure:'Vehicle'}),

    // PlayBurst — Metro Mutants
    p('mm-blitz','metro','Blitz — Fearless Leader','Action Figures',14,29.99,.96,1,{recommendedQty:2,orderPack:2,releaseStructure:'Wave 1'}),
    p('mm-riot','metro','Riot — Street Brawler','Action Figures',14,29.99,.93,1,{recommendedQty:2,orderPack:2,releaseStructure:'Wave 1'}),
    p('mm-gearbox','metro','Gearbox — Tech Genius','Action Figures',14,29.99,.92,1,{recommendedQty:2,orderPack:2,releaseStructure:'Wave 1'}),
    p('mm-jinx','metro','Jinx — Party Dude','Action Figures',14,29.99,1.08,1,{recommendedQty:2,orderPack:2,releaseStructure:'Wave 1'}),
    p('mm-hideout','metro','Underground Hideout','Playsets',58,119.99,.5,7,{evergreen:false,releaseStructure:'Flagship Playset'}),
    p('mm-slammer','metro','Street Slammer','Vehicles',31,64.99,.64,4,{releaseStructure:'Vehicle'}),

    // Titan — Velocity Racers
    p('vr-blaze','velocity','Blaze GT','Die-Cast',2.2,4.99,1.22,.25,{recommendedQty:6,orderPack:3,releaseStructure:'2026 Assortment'}),
    p('vr-nightfang','velocity','Night Fang','Die-Cast',2.2,4.99,1.05,.25,{recommendedQty:6,orderPack:3,releaseStructure:'2026 Assortment'}),
    p('vr-wasp','velocity','Turbo Wasp','Die-Cast',2.2,4.99,.92,.25,{recommendedQty:6,orderPack:3,releaseStructure:'2026 Assortment'}),
    p('vr-roadtitan','velocity','Road Titan','Die-Cast',2.2,4.99,.9,.25,{recommendedQty:6,orderPack:3,releaseStructure:'2026 Assortment'}),
    p('vr-phantom','velocity','Neon Phantom','Die-Cast',2.2,4.99,1.04,.25,{recommendedQty:6,orderPack:2,releaseStructure:'2026 Assortment'}),
    p('vr-inferno','velocity','Inferno Van','Die-Cast',2.2,4.99,.84,.25,{recommendedQty:6,orderPack:3,releaseStructure:'2026 Assortment'}),
    p('vr-aero','velocity','Aero Bullet','Die-Cast',2.2,4.99,.88,.25,{recommendedQty:6,orderPack:3,releaseStructure:'2026 Assortment'}),
    p('vr-grave','velocity','Grave Digger X','Die-Cast',2.2,4.99,1.1,.25,{recommendedQty:6,orderPack:3,releaseStructure:'2026 Assortment'}),
    p('vr-goldblaze','velocity','Blaze GT — Velocity Gold Edition','Die-Cast',2.2,4.99,2.2,.25,{evergreen:false,orderable:false,releaseStructure:'Chase Variant'}),
    p('vr-loop','velocity','Loop Strike','Track Sets',14,29.99,.76,2,{recommendedQty:3,releaseStructure:'Track Set'}),
    p('vr-crash','velocity','Crash Canyon','Track Sets',24,49.99,.62,3,{releaseStructure:'Track Set'}),
    p('vr-city','velocity','Velocity City Garage','Playsets',48,99.99,.49,6,{evergreen:false,releaseStructure:'Flagship Playset'}),

    // Titan — Starlight Girls
    p('sg-ava','starlight','Ava — City Style','Dolls',14,29.99,1.05,1.5,{recommendedQty:4,releaseStructure:'Core Collection'}),
    p('sg-mia','starlight','Mia — Beach Weekend','Dolls',14,29.99,.86,1.5,{recommendedQty:3,releaseStructure:'Core Collection'}),
    p('sg-sophie','starlight','Sophie — Creative Studio','Dolls',14,29.99,.84,1.5,{recommendedQty:3,releaseStructure:'Core Collection'}),
    p('sg-zara','starlight','Zara — Adventure Ready','Dolls',14,29.99,.88,1.5,{recommendedQty:3,releaseStructure:'Core Collection'}),
    p('sg-ava-glam','starlight','Ava — Glam Night Edition','Dolls',22,44.99,.73,1.8,{releaseStructure:'Special Edition'}),
    p('sg-cruiser','starlight','Starlight Cruiser','Vehicles',27,54.99,.6,3,{releaseStructure:'Vehicle'}),
    p('sg-studio','starlight','Style Studio','Playsets',24,49.99,.56,3,{releaseStructure:'Playset'}),
    p('sg-house','starlight','Starlight Dream House','Playsets',95,199.99,.41,8,{evergreen:false,releaseStructure:'Flagship Playset'}),

    // BrickWorks
    p('bw-racer','brick','Street Racer Garage','Construction',12,24.99,1.0,2,{recommendedQty:4,releaseStructure:'Individual Set'}),
    p('bw-fire','brick','Fire Rescue Station','Construction',24,49.99,.82,3,{releaseStructure:'Individual Set'}),
    p('bw-dragon','brick','Dragon Keep','Construction',31,64.99,.92,4,{releaseStructure:'Individual Set'}),
    p('bw-rover','brick','Space Explorer Rover','Construction',18,39.99,.93,2.5,{recommendedQty:3,releaseStructure:'Individual Set'}),
    p('bw-city','brick','BrickWorks City Central','Construction',72,149.99,.48,7,{evergreen:false,releaseStructure:'Flagship Set'}),

    // Vector — BlastForce
    p('bf-snapshot','blast','SnapShot','Blasters',7,14.99,.88,1.5,{recommendedQty:5,releaseStructure:'Core Range'}),
    p('bf-rapid','blast','RapidStrike 12','Blasters',15,29.99,1.02,2.5,{recommendedQty:4,releaseStructure:'Core Range'}),
    p('bf-cyclone','blast','Cyclone Drum','Blasters',24,49.99,.73,3.5,{releaseStructure:'Core Range'}),
    p('bf-thunder','blast','ThunderCore','Blasters',39,79.99,.6,5,{releaseStructure:'Flagship Blaster'}),
    p('bf-darts20','blast','BlastForce Darts — 20 Pack','Blaster Accessories',4,8.99,1.2,.5,{recommendedQty:6,releaseStructure:'Evergreen Refill'}),
    p('bf-darts50','blast','BlastForce Darts — 50 Pack','Blaster Accessories',8,16.99,.92,.8,{releaseStructure:'Evergreen Refill'}),
    p('bf-mag','blast','12-Dart Reload Magazine','Blaster Accessories',6,12.99,.66,.8,{releaseStructure:'Accessory'}),
    p('bf-target','blast','Target Battle Set','Blaster Accessories',12,24.99,.58,1.6,{releaseStructure:'Accessory'}),

    // PlayBurst — SquishLab
    p('sl-4','squish','SquishLab 4-Pack — Classic Colours','Creative',5,10.99,1.03,.8,{recommendedQty:5,releaseStructure:'Evergreen Core'}),
    p('sl-8','squish','SquishLab 8-Pack — Rainbow Mix','Creative',9,18.99,.91,1.2,{recommendedQty:3,releaseStructure:'Evergreen Core'}),
    p('sl-12','squish','SquishLab 12-Pack — Mega Colour Box','Creative',13,27.99,.68,1.7,{releaseStructure:'Evergreen Core'}),
    p('sl-kitchen','squish','Crazy Kitchen','Creative',16,34.99,.79,2.4,{recommendedQty:2,releaseStructure:'Playset'}),
    p('sl-icecream','squish','Ice Cream Factory','Creative',18,39.99,.82,2.6,{releaseStructure:'Playset'}),
    p('sl-dino','squish','Dino Dig Lab','Creative',16,34.99,.77,2.4,{releaseStructure:'Playset'}),
    p('sl-pet','squish','Pet Salon','Creative',16,34.99,.69,2.4,{releaseStructure:'Playset'}),
    p('sl-studio','squish','SquishLab Super Studio','Creative',38,79.99,.5,5,{releaseStructure:'Flagship Playset'}),

    // PlayBurst — Cuddle Crew
    p('cc-biscuit','cuddle','Biscuit Bear — Standard','Plush',11,24.99,.85,2,{recommendedQty:3,releaseStructure:'Evergreen Core'}),
    p('cc-mochi','cuddle','Mochi Bunny — Standard','Plush',11,24.99,.92,2,{recommendedQty:3,releaseStructure:'Evergreen Core'}),
    p('cc-pip','cuddle','Pip Penguin — Standard','Plush',11,24.99,.73,2,{releaseStructure:'Evergreen Core'}),
    p('cc-rolo','cuddle','Rolo Red Panda — Standard','Plush',11,24.99,.77,2,{releaseStructure:'Evergreen Core'}),
    p('cc-sunny','cuddle','Sunny Lion — Standard','Plush',11,24.99,.69,2,{releaseStructure:'Evergreen Core'}),
    p('cc-pickles','cuddle','Pickles Frog — Standard','Plush',11,24.99,1.02,2,{recommendedQty:3,viralPotential:2.2,releaseStructure:'Evergreen Core'}),

    // Bright Table Games
    p('bt-treasure','bright','Treasure Trail','Board Games',15,34.99,.87,2.5,{recommendedQty:3,releaseStructure:'Evergreen Title'}),
    p('bt-quick','bright','Quick Draw!','Board Games',11,24.99,1.03,1.7,{recommendedQty:4,viralPotential:1.8,releaseStructure:'Evergreen Title'}),
    p('bt-kingdom','bright','Kingdom Keepers','Board Games',24,54.99,.65,2.8,{releaseStructure:'Evergreen Title'}),
    p('bt-critter','bright','Critter Dash','Board Games',13,29.99,.79,2,{recommendedQty:2,releaseStructure:'Evergreen Title'}),
    p('bt-mystery','bright','Mystery Manor','Board Games',18,39.99,.78,2.3,{releaseStructure:'Evergreen Title'}),
    p('bt-northern','bright','Kingdom Keepers: Northern Realms','Board Games',14,29.99,.35,1.7,{releaseStructure:'Expansion'}),

    // Nova — Mystery Critters
    p('mc-box','critters','Mystery Critters — Series 1 Blind Box','Collectibles',6,12.99,1.08,.6,{recommendedQty:12,orderPack:12,releaseStructure:'Series 1'}),
    p('mc-display','critters','Mystery Critters — Series 1 Display (12)','Collectibles',72,155.88,.48,6,{orderPack:1,releaseStructure:'Sealed Display',specialOrder:true})
  ];

  const bays = [
    {id:'bay1',name:'Action Figures',subtitle:'Raiders of the Galaxy • Cyber Warriors',categories:['Action Figures'],franchises:['raiders','cyber'],capacity:24},
    {id:'bay2',name:'Action Figures II',subtitle:'Global Command • Metro Mutants',categories:['Action Figures'],franchises:['global','metro'],capacity:24},
    {id:'bay3',name:'Dolls & Play',subtitle:'Starlight Girls',categories:['Dolls','Playsets'],franchises:['starlight'],capacity:24},
    {id:'bay4',name:'Vehicles & Racers',subtitle:'Velocity Racers',categories:['Die-Cast','Track Sets','Vehicles'],franchises:['velocity'],capacity:24},
    {id:'bay5',name:'Construction',subtitle:'BrickWorks',categories:['Construction'],franchises:['brick'],capacity:24},
    {id:'bay6',name:'Creative & Active',subtitle:'BlastForce • SquishLab',categories:['Blasters','Blaster Accessories','Creative'],franchises:['blast','squish'],capacity:24},
    {id:'bay7',name:'Plush',subtitle:'Cuddle Crew',categories:['Plush'],franchises:['cuddle'],capacity:24},
    {id:'bay8',name:'Games & Collectibles',subtitle:'Bright Table Games • Mystery Critters',categories:['Board Games','Collectibles'],franchises:['bright','critters'],capacity:24}
  ];

  const competitors = [
    {id:'toybarn',name:'Toy Barn',type:'Mainstream Giant',priceBias:1.0,stockBias:1.25,color:'#5ab5ff',description:'Huge range, reliable stock, usually around RRP.'},
    {id:'playsaver',name:'PlaySaver',type:'Discount Rival',priceBias:.91,stockBias:.82,color:'#ffb84d',description:'Aggressive prices, patchy availability, quick to clear stock.'},
    {id:'collectors',name:"Collector's Corner",type:'Specialist Store',priceBias:1.09,stockBias:.62,color:'#b88cff',description:'Strong on figures and collectibles, willing to charge for scarcity.'}
  ];

  const customerTypes = [
    {id:'parent',label:'Parent',weight:28,priceSensitivity:1.18,basket:.22},
    {id:'childParent',label:'Child + Parent',weight:23,priceSensitivity:1.0,basket:.28},
    {id:'collector',label:'Collector',weight:13,priceSensitivity:.66,basket:.34},
    {id:'gift',label:'Gift Buyer',weight:16,priceSensitivity:.93,basket:.18},
    {id:'bargain',label:'Bargain Hunter',weight:11,priceSensitivity:1.55,basket:.16},
    {id:'enthusiast',label:'Enthusiast',weight:9,priceSensitivity:.79,basket:.45}
  ];

  return { manufacturers, franchises, products, bays, competitors, customerTypes };
})();
