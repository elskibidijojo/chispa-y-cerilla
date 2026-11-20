'use strict';
/* ================= WORLD: maps, NPCs, shop, menus, story, main loop ================= */
const BOSS_LIST={1:['reloj','gramo','baron','tostada','cascanueces'],2:['faro','cangrejo','ballena','paraguas','caldera'],3:['vela','buho','murcielago','espantapajaros','maquina','chistera','apagon']};
const RUN_LIST={1:['feria','fabrica'],2:['muelle','setas','nubes'],3:['feria_noche','torre','mina']};
const ALL_LEVELS=[1,2,3].flatMap(i=>[...RUN_LIST[i],...BOSS_LIST[i]]);
const cleared=ids=>ids.filter(k=>save.cleared[k]).length;
const WORLDS={
  1:{name:'Isla de Hojalata',song:'map1',W:2000,H:1250,seed:5,sea:'#5b8580',seaD:'#466d69',grass:'#a6ae64',grassD:'#7e8a45',sand:'#e2c98f',tree:'oak',night:false,start:[330,640],dockArr:[1030,1010],
    isles:[{x:850,y:650,rx:760,ry:470},{x:400,y:330,rx:300,ry:180},{x:1250,y:1000,rx:330,ry:200},{x:290,y:960,rx:95,ry:72,hidden:true},{x:1820,y:420,rx:150,ry:160}],ponds:[{x:650,y:730,rx:95,ry:55}],
    bridges:[{x:1480,y:398,w:230,h:46,open:()=>cleared([...RUN_LIST[1],...BOSS_LIST[1]])>=2,need:'Vence dos niveles de esta isla y te arreglamos el puente.'}],
    nodes:[{id:'casa',x:330,y:560,kind:'home',name:'Casa de Chispa y Cerilla',ob:30,bld:'casa'},
      {id:'sign1',x:450,y:620,kind:'sign',name:'Letrero',text:'Isla de Hojalata. Acércate a un lugar y pulsa saltar o Enter. Las monedas se gastan en el Bazar. ¡Ojo con lo turquesa: eso se golpea con parry!'},
      {id:'feria',x:560,y:380,kind:'level',ob:40,bld:'carpa',em:'ball'},{id:'cabo',x:720,y:520,kind:'npc',npc:'cabo',name:'Cabo Lata',ob:16},
      {id:'statue',x:830,y:650,kind:'statue',name:'Estatua',ob:30},{id:'reloj',x:1010,y:330,kind:'level',ob:30,bld:'torre',em:'bell'},
      {id:'gramo',x:1180,y:640,kind:'level',ob:44,bld:'teatro',em:'note'},{id:'shop',x:560,y:900,kind:'shop',name:'Bazar de Don Tornillo',ob:36,bld:'tienda'},
      {id:'tostada',x:880,y:940,kind:'level',ob:34,bld:'casita',em:'toast'},{id:'fabrica',x:1310,y:960,kind:'level',ob:40,bld:'fabrica',em:'gear'},
      {id:'cascanueces',x:1420,y:720,kind:'level',ob:34,bld:'fuerte',em:'nut'},{id:'sign2',x:1440,y:470,kind:'sign',name:'Letrero',bridge:0},
      {id:'baron',x:1830,y:420,kind:'level',ob:36,bld:'molino',em:'drop'},{id:'dock',x:1030,y:1060,kind:'dock',name:'Capitán Remo',ob:20},
      {id:'tree1',x:760,y:265,kind:'tree',name:'Árbol que tiembla',ob:22,coin:'w1-tree'},
      {id:'mausoleo',x:250,y:800,kind:'level',ob:30,bld:'mausoleo',em:'ghostE'}],
    coins:[{id:'w1-c1',x:140,y:650},{id:'w1-c2',x:240,y:965},{id:'w1-c4',x:1090,y:250}],
    items:[{id:'btn1',x:250,y:330},{id:'btn2',x:1500,y:1040},{id:'btn3',x:1300,y:330}],
    roads:[['casa','feria'],['feria','reloj'],['feria','statue'],['casa','shop'],['shop','statue'],['statue','reloj'],['statue','gramo'],['shop','tostada'],['tostada','dock'],['gramo','fabrica'],['gramo','cascanueces'],['cascanueces','sign2'],['shop','mausoleo']],
    windmills:[[1560,880]]},
  2:{name:'Bahía Bruma',song:'map2',W:2000,H:1250,seed:9,sea:'#4f7f86',seaD:'#3d6670',grass:'#b7b56e',grassD:'#8a8a4f',sand:'#ead39c',tree:'palm',night:false,start:[420,1040],dockArr:[420,1040],
    isles:[{x:900,y:650,rx:780,ry:450},{x:1500,y:350,rx:300,ry:170},{x:350,y:1000,rx:280,ry:160},{x:1220,y:235,rx:80,ry:60,hidden:true},{x:1850,y:900,rx:140,ry:170}],ponds:[{x:900,y:600,rx:150,ry:90}],
    bridges:[{x:1510,y:878,w:230,h:46,open:()=>cleared([...RUN_LIST[2],...BOSS_LIST[2]])>=3,need:'Barrera cerrada. Vence tres niveles de Bahía Bruma para pasar.'}],
    nodes:[{id:'dock',x:400,y:1110,kind:'dock',name:'Capitán Remo',ob:20},{id:'shop',x:640,y:880,kind:'shop',name:'Bazar de Don Tornillo',ob:36,bld:'tienda'},
      {id:'muelle',x:290,y:680,kind:'level',ob:40,bld:'barco',em:'drop'},{id:'setas',x:700,y:320,kind:'level',ob:40,bld:'seta',em:'jam'},
      {id:'faro',x:1520,y:330,kind:'level',ob:30,bld:'faro',em:'fog'},{id:'cangrejo',x:1150,y:880,kind:'level',ob:36,bld:'choza',em:'castanet'},
      {id:'ballena',x:1250,y:450,kind:'level',ob:36,bld:'molino',em:'fish'},{id:'paraguas',x:480,y:480,kind:'level',ob:34,bld:'casita',em:'drop'},
      {id:'caldera',x:1860,y:900,kind:'level',ob:36,bld:'chimenea',em:'coal'},{id:'sign2',x:1470,y:830,kind:'sign',name:'Letrero',bridge:0},
      {id:'rocola',x:860,y:800,kind:'npc',npc:'rocola',name:'Rocola',ob:22},{id:'patita',x:1080,y:720,kind:'npc',npc:'patita',name:'Patita',ob:16},
      {id:'tree1',x:330,y:450,kind:'tree',name:'Palmera que tiembla',ob:22,coin:'w2-tree'},
      {id:'nubes',x:980,y:330,kind:'level',ob:30,bld:'globo',em:'drop'},{id:'mausoleo2',x:800,y:1010,kind:'level',ob:30,bld:'mausoleo',em:'ghostE'}],
    coins:[{id:'w2-c1',x:170,y:620},{id:'w2-c2',x:1220,y:205},{id:'w2-c4',x:1700,y:300}],items:[],
    roads:[['dock','shop'],['shop','muelle'],['muelle','paraguas'],['paraguas','setas'],['setas','ballena'],['ballena','faro'],['shop','cangrejo'],['cangrejo','sign2'],['shop','rocola'],['cangrejo','patita'],['setas','nubes'],['nubes','ballena'],['shop','mausoleo2']],windmills:[]},
  3:{name:'Cumbre Apagón',song:'map3',W:2000,H:1250,seed:13,sea:'#2f3550',seaD:'#252a40',grass:'#6b5a7a',grassD:'#4b4060',sand:'#8f8090',tree:'dead',night:true,start:[400,900],dockArr:[400,900],
    isles:[{x:850,y:700,rx:760,ry:440},{x:500,y:330,rx:320,ry:170},{x:1300,y:330,rx:300,ry:170},{x:1000,y:1150,rx:90,ry:60,hidden:true},{x:1810,y:600,rx:170,ry:200}],ponds:[],
    bridges:[{x:1560,y:578,w:110,h:46,open:()=>cleared(BOSS_LIST[3].slice(0,6))>=6,need:'El puente del castillo solo baja cuando caen los otros seis jefes de la Cumbre.'}],
    nodes:[{id:'dock',x:360,y:960,kind:'dock',name:'Capitán Remo',ob:20},{id:'shop',x:580,y:860,kind:'shop',name:'Bazar de Don Tornillo',ob:36,bld:'tienda'},
      {id:'feria_noche',x:280,y:680,kind:'level',ob:40,bld:'carpa',em:'orb'},{id:'torre',x:1340,y:960,kind:'level',ob:34,bld:'torre',em:'flame'},
      {id:'vela',x:520,y:320,kind:'level',ob:32,bld:'capilla',em:'flame'},{id:'buho',x:1000,y:440,kind:'level',ob:36,bld:'biblioteca',em:'book'},
      {id:'murcielago',x:1320,y:310,kind:'level',ob:36,bld:'molino',em:'sonic'},{id:'espantapajaros',x:900,y:1010,kind:'level',ob:36,bld:'granero',em:'hay'},
      {id:'maquina',x:1250,y:680,kind:'level',ob:34,bld:'oficina',em:'letter'},{id:'chistera',x:720,y:620,kind:'level',ob:36,bld:'carpaMagia',em:'card'},
      {id:'apagon',x:1830,y:600,kind:'level',ob:44,bld:'castillo',em:'orb'},{id:'sign2',x:1500,y:620,kind:'sign',name:'Letrero',bridge:0},
      {id:'farol',x:470,y:1000,kind:'npc',npc:'farol',name:'Don Farol',ob:14},{id:'gato',x:1100,y:850,kind:'npc',npc:'gato',name:'Gato Tinta',ob:12},
      {id:'tree1',x:1150,y:1050,kind:'tree',name:'Árbol seco que cruje',ob:22,coin:'w3-tree'},
      {id:'mina',x:1010,y:760,kind:'level',ob:34,bld:'mina',em:'coal'},{id:'mausoleo3',x:760,y:850,kind:'level',ob:30,bld:'mausoleo',em:'ghostE'}],
    coins:[{id:'w3-c1',x:150,y:700},{id:'w3-c2',x:1000,y:1165},{id:'w3-c4',x:1480,y:260}],items:[],gatoSpots:[[1100,850],[640,440],[1480,760]],
    roads:[['dock','shop'],['shop','feria_noche'],['feria_noche','vela'],['vela','chistera'],['chistera','buho'],['buho','murcielago'],['shop','espantapajaros'],['espantapajaros','torre'],['torre','maquina'],['maquina','sign2'],['chistera','maquina'],['shop','farol'],['chistera','mina'],['mina','maquina'],['shop','mausoleo3']],windmills:[]}};
const curWorld=()=>WORLDS[save.island||1];
function inIsle(w,x,y,m=18){for(const i of w.isles){const a=(x-i.x)/(i.rx-m),b=(y-i.y)/(i.ry-m);if(a*a+b*b<=1)return true;}return false;}
function inPond(w,x,y,m=-10){for(const i of w.ponds){const a=(x-i.x)/(i.rx-m),b=(y-i.y)/(i.ry-m);if(a*a+b*b<=1)return true;}return false;}
function onBridge(w,x,y){for(const b of w.bridges)if(b.open()&&x>b.x-40&&x<b.x+b.w+40&&y>b.y+6&&y<b.y+b.h-4)return true;return false;}
function nodePos(w,n){if(n.npc==='gato'){const k=Math.min(2,save.flags.gato||0);return{x:w.gatoSpots[k][0],y:w.gatoSpots[k][1]};}return{x:n.x,y:n.y};}
function walkable(w,x,y){if(!(inIsle(w,x,y)||onBridge(w,x,y)))return false;if(inPond(w,x,y))return false;for(const n of w.nodes){if(!n.ob)continue;const p=nodePos(w,n);if(dist(x,y,p.x,p.y-6)<n.ob)return false;}return true;}

/* ---------- map background ---------- */
let MAPBG={k:null};
function mapBG(wi){if(MAPBG.k===wi)return MAPBG.c;const w=WORLDS[wi],[c,g]=mk(w.W,w.H,1),r=srand(w.seed);
  g.fillStyle=w.sea;g.fillRect(0,0,w.W,w.H);g.strokeStyle=w.seaD;g.lineWidth=3;
  for(let y=20;y<w.H;y+=46)for(let x=(y/46%2)*60;x<w.W;x+=120){if(inIsle(w,x,y,-40))continue;g.beginPath();g.arc(x,y,10,Math.PI*1.1,Math.PI*1.9);g.stroke();g.beginPath();g.arc(x+20,y,10,Math.PI*1.1,Math.PI*1.9);g.stroke();}
  for(const i of w.isles){g.beginPath();g.ellipse(i.x,i.y,i.rx+20,i.ry+20,0,0,TAU);g.lineWidth=8;g.strokeStyle=C.ink;g.stroke();}
  for(const i of w.isles){g.beginPath();g.ellipse(i.x,i.y,i.rx+20,i.ry+20,0,0,TAU);g.fillStyle=w.sand;g.fill();}
  for(const i of w.isles){g.beginPath();g.ellipse(i.x,i.y,i.rx,i.ry,0,0,TAU);g.lineWidth=5;g.strokeStyle=w.grassD;g.stroke();}
  for(const i of w.isles){g.beginPath();g.ellipse(i.x,i.y,i.rx,i.ry,0,0,TAU);g.fillStyle=w.grass;g.fill();}
  for(const p of w.ponds){g.beginPath();g.ellipse(p.x,p.y,p.rx,p.ry,0,0,TAU);g.fillStyle=w.sea;g.fill();g.lineWidth=5;g.strokeStyle=C.ink;g.stroke();g.strokeStyle=w.seaD;g.lineWidth=2;for(let k=0;k<4;k++){g.beginPath();g.arc(p.x-40+k*26,p.y-10+(k%2)*20,8,Math.PI*1.1,Math.PI*1.9);g.stroke();}}
  g.fillStyle='rgba(20,13,8,.12)';for(let k=0;k<700;k++){const x=r()*w.W,y=r()*w.H;if(inIsle(w,x,y,10)&&!inPond(w,x,y,-20)){g.beginPath();g.moveTo(x,y);g.lineTo(x+3,y-7);g.lineTo(x+6,y);g.fill();}}
  const pos=id=>{const n=w.nodes.find(q=>q.id===id);return[n.x,n.y+20];};const segs=[];
  g.setLineDash([2,16]);g.lineCap='round';g.lineWidth=14;g.strokeStyle=w.night?'#8a7a8e':'#cfb27a';
  for(const [a,b] of w.roads){const [x1,y1]=pos(a),[x2,y2]=pos(b),mx=(x1+x2)/2+30,my=(y1+y2)/2+30;g.beginPath();g.moveTo(x1,y1);g.quadraticCurveTo(mx,my,x2,y2);g.stroke();for(let k=0;k<=10;k++){const t=k/10;segs.push([(1-t)**2*x1+2*(1-t)*t*mx+t*t*x2,(1-t)**2*y1+2*(1-t)*t*my+t*t*y2]);}}
  g.setLineDash([]);
  const okSpot=(x,y,d=80)=>inIsle(w,x,y,30)&&!inPond(w,x,y,-30)&&!w.isles.some(i=>i.hidden&&((x-i.x)/i.rx)**2+((y-i.y)/i.ry)**2<1.4)&&w.nodes.every(n=>dist(x,y,n.x,n.y)>d)&&segs.every(([sx,sy])=>dist(x,y,sx,sy)>34)&&[...w.coins,...w.items].every(c=>dist(x,y,c.x,c.y)>50);
  for(let k=0;k<160;k++){const x=r()*w.W,y=r()*w.H;if(!okSpot(x,y))continue;const kind=r();ctx===g;
    if(kind<.55)mapTree(g,w.tree,x,y,r);else if(kind<.7){g.beginPath();g.ellipse(x,y,16,10,0,0,TAU);g.fillStyle=w.night?'#5a5060':'#b4a68a';g.fill();g.lineWidth=3;g.strokeStyle=C.ink;g.stroke();}
    else if(kind<.85){for(let q=0;q<3;q++){g.beginPath();g.arc(x+q*8-8,y-(q%2)*5,8,0,TAU);g.fillStyle=w.grassD;g.fill();g.lineWidth=2.5;g.strokeStyle=C.ink;g.stroke();}}
    else{for(let q=0;q<4;q++){g.beginPath();g.arc(x+(q-1.5)*7,y+(q%2)*4,3.5,0,TAU);g.fillStyle=[C.rust,C.gold,C.white,C.parry][q];g.fill();}}}
  if(wi===3)for(let k=0;k<26;k++){const x=r()*w.W,y=r()*w.H;if(!okSpot(x,y,90))continue;g.fillStyle='#8f8a90';g.beginPath();g.roundRect(x-9,y-22,18,24,[9,9,2,2]);g.fill();g.lineWidth=2.5;g.strokeStyle=C.ink;g.stroke();g.beginPath();g.moveTo(x-4,y-12);g.lineTo(x+4,y-12);g.moveTo(x,y-16);g.lineTo(x,y-6);g.stroke();}
  MAPBG={k:wi,c};return c;}
function mapTree(g,type,x,y,r){g.beginPath();g.ellipse(x,y+4,16,6,0,0,TAU);g.fillStyle='rgba(20,13,8,.25)';g.fill();g.lineWidth=3;g.strokeStyle=C.ink;
  if(type==='palm'){g.beginPath();g.moveTo(x,y+2);g.quadraticCurveTo(x+8,y-20,x+4,y-40);g.lineWidth=5;g.stroke();g.lineWidth=3;for(let i=0;i<5;i++){const a=-Math.PI/2+(i-2)*.6;g.beginPath();g.moveTo(x+4,y-40);g.quadraticCurveTo(x+4+Math.cos(a)*20,y-48+Math.sin(a)*10,x+4+Math.cos(a)*30,y-34+Math.sin(a)*14);g.strokeStyle='#5f7a3a';g.lineWidth=6;g.stroke();g.lineWidth=2;g.strokeStyle=C.ink;g.stroke();}}
  else if(type==='dead'){g.lineWidth=5;g.beginPath();g.moveTo(x,y+2);g.lineTo(x,y-34);g.moveTo(x,y-22);g.lineTo(x-12,y-34);g.moveTo(x,y-28);g.lineTo(x+14,y-42);g.stroke();g.lineWidth=2.5;g.strokeStyle='#5a5060';g.stroke();}
  else{g.beginPath();g.moveTo(x,y+2);g.lineTo(x,y-14);g.stroke();g.beginPath();g.arc(x,y-26,17,0,TAU);g.fillStyle='#6f7a45';g.fill();g.stroke();g.beginPath();g.arc(x-5,y-31,5,0,TAU);g.fillStyle='rgba(255,240,200,.25)';g.fill();}}

/* ---------- map buildings ---------- */
function drawBld(n,t,night){const x=n.x,y=n.y,dk=c=>night?'#4b4170':c;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;shadowE(x,y+2,(n.ob||20)+14,.22);
  switch(n.bld){
    case 'casa':rr(x-34,y-46,68,46,4,C.paper);ctx.beginPath();ctx.moveTo(x-44,y-44);ctx.quadraticCurveTo(x,y-110,x+44,y-44);ctx.closePath();ctx.fillStyle=C.glass;ctx.fill();ctx.stroke();rr(x-14,y-56,28,10,2,C.steel);rr(x-10,y-28,20,28,8,C.wood);
      ctx.beginPath();ctx.moveTo(x+30,y-58);ctx.lineTo(x+30,y-80);ctx.lineWidth=6;ctx.strokeStyle=C.matchHead;ctx.stroke();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;
      for(let i=0;i<3;i++){const k=(t*.6+i/3)%1;ctx.globalAlpha=1-k;circ(x+30+k*10,y-96-k*40,6+k*8,C.paper,2);ctx.globalAlpha=1;}break;
    case 'carpa':{const h=100;ctx.save();ctx.beginPath();ctx.moveTo(x-56,y);ctx.lineTo(x,y-h);ctx.lineTo(x+56,y);ctx.closePath();ctx.clip();for(let i=-6;i<6;i++)poly([[x,y-h],[x+i*12,y],[x+(i+1)*12,y]],i%2?(night?C.plum:C.rust):C.paper,0);ctx.restore();
      poly([[x-56,y],[x,y-h],[x+56,y]],null,3.5);poly([[x-14,y],[x,y-34],[x+14,y]],C.ink,0);line(x,y-h,x,y-h-20);poly([[x,y-h-20],[x+16+Math.sin(t*6)*3,y-h-14],[x,y-h-8]],C.brass);break;}
    case 'torre':rr(x-26,y-120,52,120,0,night?'#5a5060':'#c9b48c');poly([[x-34,y-118],[x,y-160],[x+34,y-118]],dk(C.rust));circ(x,y-92,17,C.paper);line(x,y-92,x+Math.cos(t)*12,y-92+Math.sin(t)*12,2.5);line(x,y-92,x,y-102,2.5);rr(x-10,y-30,20,30,9,C.wood);break;
    case 'teatro':rr(x-60,y-70,120,70,0,C.rust);ctx.beginPath();ctx.moveTo(x-66,y-70);ctx.quadraticCurveTo(x,y-130,x+66,y-70);ctx.closePath();ctx.fillStyle=C.brass;ctx.fill();ctx.stroke();rr(x-44,y-62,88,20,4,C.paper);txt('TEATRO',x,y-52,13,C.rust,null);
      for(let i=0;i<9;i++)circ(x-44+i*11,y-66,2.5,(Math.floor(t*6)+i)%2?'#ffe9a8':'#7a5a2a',0);rr(x-16,y-34,32,34,6,C.ink,0);break;
    case 'tienda':rr(x-46,y-60,92,60,0,C.woodL);poly([[x-54,y-58],[x,y-96],[x+54,y-58]],C.rustD);for(let i=0;i<6;i++)poly([[x-48+i*16,y-56],[x-32+i*16,y-56],[x-40+i*16,y-44]],i%2?C.paper:C.parry,2);
      rr(x-36,y-88,72,20,4,C.paper);txt('BAZAR',x,y-78,13,C.rust,null);rr(x-10,y-30,20,30,4,C.wood);coinIcon(x+28,y-26,8,Math.cos(t*3));break;
    case 'casita':rr(x-38,y-54,76,54,0,night?'#6b5a7a':'#e3cd9d');poly([[x-46,y-52],[x,y-92],[x+46,y-52]],dk(C.rust));rr(x-10,y-30,20,30,6,C.wood);rr(x+14,y-44,16,14,2,'#ffd36a',2.5);break;
    case 'fabrica':rr(x-56,y-60,112,60,0,'#8a8478');for(let i=0;i<3;i++)poly([[x-56+i*38,y-60],[x-56+i*38,y-84],[x-18+i*38,y-60]],'#6f685b');rr(x+26,y-110,18,50,0,C.steelD);
      for(let i=0;i<3;i++){const k=(t*.7+i/3)%1;ctx.globalAlpha=1-k;circ(x+35+k*12,y-120-k*40,7+k*8,C.paper,2);ctx.globalAlpha=1;}ctx.save();ctx.translate(x-20,y-30);ctx.rotate(t);star(0,0,16,11,8);ctx.fillStyle=C.brass;ctx.fill();ctx.stroke();ctx.restore();break;
    case 'fuerte':for(const s of[-1,1]){rr(x+s*40-14,y-84,28,84,0,C.rust);for(let i=0;i<3;i++)rr(x+s*40-14+i*10,y-92,8,8,0,C.rust,2.5);}rr(x-30,y-60,60,60,0,C.paper);rr(x-12,y-30,24,30,10,C.wood);line(x,y-60,x,y-100);poly([[x,y-100],[x+18,y-94],[x,y-88]],C.brass);break;
    case 'molino':{rr(x-22,y-90,44,90,0,night?'#5a5060':'#c9b48c');ctx.save();ctx.translate(x,y-90);ctx.rotate(t*1.5);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);rr(4,-7,52,14,0,night?'#7a6a8a':C.paper,3.5);}ctx.restore();circ(x,y-90,6,C.rust);break;}
    case 'barco':poly([[x-56,y-30],[x+56,y-30],[x+40,y],[x-40,y]],C.woodL);line(x,y-30,x,y-110,4);poly([[x,y-108],[x+44,y-44],[x,y-44]],C.paper);poly([[x,y-108],[x-34,y-50],[x,y-50]],C.white);poly([[x,y-110],[x+16,y-104],[x,y-98]],C.rust);break;
    case 'seta':rr(x-18,y-50,36,50,8,C.paper);ctx.beginPath();ctx.ellipse(x,y-50,56,30,0,Math.PI,0);ctx.closePath();ctx.fillStyle='#c4704a';ctx.fill();ctx.stroke();for(const [a,b] of[[-26,-62],[0,-72],[24,-60]])circ(x+a,y+b,6,C.paper,0);rr(x-8,y-26,16,26,8,C.wood);break;
    case 'faro':ctx.save();ctx.beginPath();ctx.moveTo(x-22,y);ctx.lineTo(x-14,y-110);ctx.lineTo(x+14,y-110);ctx.lineTo(x+22,y);ctx.closePath();ctx.clip();for(let i=0;i<6;i++){ctx.fillStyle=i%2?C.rust:C.paper;ctx.fillRect(x-30,y-i*20-20,60,20);}ctx.restore();
      poly([[x-22,y],[x-14,y-110],[x+14,y-110],[x+22,y]],null,3.5);rr(x-16,y-132,32,22,3,'#fff3b0');poly([[x-20,y-132],[x,y-150],[x+20,y-132]],C.rust);ctx.globalAlpha=.25;poly([[x,y-121],[x+Math.cos(t)*160,y-121+Math.sin(t)*40-20],[x+Math.cos(t)*160,y-121+Math.sin(t)*40+20]],'#fff3b0',0);ctx.globalAlpha=1;break;
    case 'choza':rr(x-40,y-46,80,46,0,'#c79a5e');poly([[x-54,y-44],[x,y-86],[x+54,y-44]],'#d9b45a');for(let i=0;i<6;i++)line(x-48+i*18,y-48,x-44+i*18,y-40,2);rr(x-10,y-28,20,28,4,C.woodD);break;
    case 'chimenea':circ(x,y-44,40,'#5a5450');rr(x+12,y-110,18,50,0,C.steelD);for(let i=0;i<3;i++){const k=(t*.8+i/3)%1;ctx.globalAlpha=1-k;circ(x+21+k*12,y-120-k*40,8+k*10,'#b9b4a5',2);ctx.globalAlpha=1;}rr(x-16,y-40,32,24,10,'#f08a2e',3);break;
    case 'capilla':rr(x-34,y-64,68,64,0,'#5a5060');poly([[x-40,y-62],[x,y-104],[x+40,y-62]],'#3a3050');rr(x-10,y-40,20,40,10,'#ffd36a');line(x,y-104,x,y-124,3);line(x-8,y-116,x+8,y-116,3);break;
    case 'biblioteca':rr(x-50,y-70,100,70,0,'#6b4a3a');poly([[x-58,y-68],[x,y-104],[x+58,y-68]],'#4a2f22');for(const s of[-30,-10,10,30])rr(x+s-4,y-60,8,50,0,C.paper,2);rr(x-12,y-34,24,34,8,'#ffd36a');break;
    case 'granero':rr(x-46,y-60,92,60,0,'#7a3b2e');poly([[x-52,y-58],[x-30,y-92],[x+30,y-92],[x+52,y-58]],'#5a2a20');line(x-22,y-30,x+22,y,3,C.paper);line(x+22,y-30,x-22,y,3,C.paper);rr(x-22,y-30,44,30,0,null,3);break;
    case 'oficina':rr(x-44,y-80,88,80,0,'#5a5060');for(let r2=0;r2<2;r2++)for(let c=0;c<3;c++)rr(x-34+c*24,y-70+r2*24,16,16,0,Math.floor(t*2+c+r2)%3?'#ffd36a':'#3a3050',2);rr(x-10,y-26,20,26,4,C.wood);break;
    case 'carpaMagia':{ctx.save();ctx.beginPath();ctx.moveTo(x-56,y);ctx.lineTo(x,y-100);ctx.lineTo(x+56,y);ctx.closePath();ctx.clip();for(let i=-6;i<6;i++)poly([[x,y-100],[x+i*12,y],[x+(i+1)*12,y]],i%2?'#3b2f55':C.gold,0);ctx.restore();
      poly([[x-56,y],[x,y-100],[x+56,y]],null,3.5);star(x,y-110,12,5,5,t);ctx.fillStyle=C.gold;ctx.fill();ctx.stroke();break;}
    case 'mausoleo':rr(x-42,y-70,84,70,0,'#8f8a90');poly([[x-50,y-68],[x,y-104],[x+50,y-68]],'#6b6178');for(const c of[-28,28])rr(x+c-6,y-64,12,64,0,'#b4aeb6',2.5);rr(x-14,y-46,28,46,12,'#1a1522');
      circ(x,y-86,7,C.parry,2.5);const gf=Math.sin(t*3)*4;ctx.globalAlpha=.7;ell(x+30,y-110+gf,10,13,'#e8f2ee',2.5);ctx.globalAlpha=1;break;
    case 'globo':{const bob=Math.sin(t*1.6)*6;line(x-30,y,x+30,y,4);line(x,y,x,y-40,2.5);circ(x,y-96+bob,40,C.rust);for(const k of[-1,0,1]){ctx.beginPath();ctx.moveTo(x+k*14,y-134+bob);ctx.quadraticCurveTo(x+k*40,y-96+bob,x+k*14,y-60+bob);ctx.lineWidth=2.5;ctx.stroke();ctx.lineWidth=3.5;}
      rr(x-36,y-108+bob,72,12,0,C.paper,2.5);line(x-20,y-62+bob,x-12,y-36,2);line(x+20,y-62+bob,x+12,y-36,2);rr(x-16,y-38,32,24,3,C.woodL);cloudShape(ctx,x-90,y-30,.55,C.paper,3);cloudShape(ctx,x+40,y-20,.45,C.paper,3);break;}
    case 'mina':{ctx.beginPath();ctx.moveTo(x-60,y);ctx.quadraticCurveTo(x-50,y-90,x,y-96);ctx.quadraticCurveTo(x+50,y-90,x+60,y);ctx.closePath();ctx.fillStyle='#5a4a52';ctx.fill();ctx.stroke();
      rr(x-28,y-62,10,62,0,C.woodL,3);rr(x+18,y-62,10,62,0,C.woodL,3);rr(x-34,y-70,68,12,0,C.woodL,3);rr(x-18,y-58,36,58,10,'#120c10',0);line(x-40,y,x+40,y,3,C.steel);
      rr(x-50,y-22,28,18,3,'#6b5a4a',2.5);for(let i=0;i<3;i++)circ(x-44+i*8,y-26,4,'#2b2420',1.5);circ(x+26,y-80,6,Math.floor(t*3)%2?'#ffd36a':'#c99a3a',2.5);break;}
    case 'castillo':for(const s of[-1,1]){rr(x+s*44-16,y-130,32,130,0,'#3a3050');poly([[x+s*44-20,y-128],[x+s*44,y-160],[x+s*44+20,y-128]],'#2a2238');}rr(x-30,y-100,60,100,0,'#4b4170');rr(x-14,y-46,28,46,12,'#100a18');
      for(let i=0;i<3;i++)circ(x-16+i*16,y-80,6,Math.floor(t*3+i)%2?'#5a5a5a':'#3a3a3a',2);break;
  }
  if(n.em){circ(x-(n.ob||30)-6,y-14,13,C.paper,3);ctx.save();ctx.translate(x-(n.ob||30)-6,y-14);ctx.scale(.55,.55);drawSpr({x:0,y:0,spr:n.em,r:16,rot:0,vx:-1,vy:0,ch:'A'},t);ctx.restore();}
  if(save.done[n.id]){window._flagDrawn=n.id;const fx=x+(n.ob||30)+8;line(fx,y,fx,y-40,3);poly([[fx,y-40],[fx+30,y-32],[fx,y-22]],C.parry);txt(save.done[n.id],fx+12,y-31,11,C.ink,null);}
  ctx.restore();}
function drawStatue(x,y,t){ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  /* soft spotlight + flowers */
  const g=ctx.createRadialGradient(x,y-120,10,x,y-80,170);g.addColorStop(0,'rgba(255,240,190,.32)');g.addColorStop(1,'rgba(255,240,190,0)');ctx.fillStyle=g;ctx.fillRect(x-170,y-260,340,280);
  for(const [fx,fc] of[[-46,C.rust],[-36,C.gold],[-26,'#d97aa6'],[30,C.parry],[40,C.rust],[50,C.gold]])circ(x+fx,y-4+Math.sin(t*2+fx)*1.5,5,fc,2);
  /* marble pedestal */
  rr(x-38,y-50,76,50,4,'#e9e4da');for(const k of[-1,1])line(x+k*28,y-46,x+k*26,y-4,1.5,'rgba(120,110,100,.5)');rr(x-46,y-60,92,12,3,'#f4f1ea');rr(x-44,y-6,88,8,2,'#d6cfc2');
  rr(x-24,y-40,48,18,3,C.brass);txt('R.R.',x,y-31,11,C.ink,null);
  /* the figure: light skin, dark wavy hair, grey school shirt with navy/red V-neck, navy trousers, laptop under the arm */
  const by=y-60,SK='#f2d3b8',SKD='#d9b394',SH='#d6d6d2',NV='#1f2a4a',RD='#c0392b';
  rr(x-14,by-46,12,46,4,NV);rr(x+2,by-46,12,46,4,NV);ell(x-10,by-1,11,5,'#f4f4f4',2.5);ell(x+10,by-1,11,5,'#f4f4f4',2.5);
  /* waving arm (behind) */const wv=Math.sin(t*3)*.25;ctx.save();ctx.translate(x+24,by-92);ctx.rotate(-.6+wv);rr(-6,-34,12,26,5,SH,2.5);rr(-6,-12,12,5,1,NV,0);rr(-6,-9,12,3,0,RD,0);rr(-5,-40,10,10,4,SK,2.5);circ(0,-46,8,SK,2.5);ctx.restore();
  /* torso: grey tee */poly([[x-24,by-46],[x-28,by-96],[x+28,by-96],[x+24,by-46]],SH);
  ctx.beginPath();ctx.moveTo(x-11,by-98);ctx.lineTo(x,by-80);ctx.lineTo(x+11,by-98);ctx.lineWidth=5;ctx.strokeStyle=NV;ctx.stroke();ctx.beginPath();ctx.moveTo(x-8,by-98);ctx.lineTo(x,by-84);ctx.lineTo(x+8,by-98);ctx.lineWidth=2;ctx.strokeStyle=RD;ctx.stroke();
  ctx.strokeStyle=C.ink;ctx.lineWidth=3;circ(x+12,by-82,3,'#d9a441',1.2);
  /* sleeve trims */for(const k of[-1,1]){rr(x+k*30-7,by-98,14,20,4,SH,2.5);rr(x+k*30-7,by-82,14,4,0,NV,0);rr(x+k*30-7,by-79,14,2.5,0,RD,0);}
  /* arm holding the laptop */rr(x-37,by-80,10,26,4,SK,2.5);ctx.save();ctx.translate(x-30,by-58);ctx.rotate(-.25);rr(-22,-6,40,28,3,'#3a3d44',2.5);rr(-18,-2,32,20,2,'#5a6070',0);circ(-2,8,3,'#cfd4da',0);ctx.restore();
  /* neck + head */rr(x-6,by-108,12,12,3,SK,2.5);const hy=by-128;ell(x,hy,19,22,SK);ell(x-17,hy+2,4,6,SK,2.5);
  /* wavy dark hair: swept, messy waves */const HR='#2a1c14';ctx.fillStyle=HR;
  ctx.beginPath();ctx.moveTo(x-21,hy+4);ctx.bezierCurveTo(x-28,hy-14,x-22,hy-34,x-6,hy-34);ctx.bezierCurveTo(x+6,hy-42,x+26,hy-34,x+24,hy-16);ctx.bezierCurveTo(x+30,hy-8,x+22,hy+2,x+18,hy-6);
  ctx.bezierCurveTo(x+14,hy-14,x+8,hy-10,x+4,hy-16);ctx.bezierCurveTo(x-2,hy-8,x-8,hy-14,x-10,hy-10);ctx.bezierCurveTo(x-14,hy-4,x-16,hy-2,x-21,hy+4);ctx.closePath();ctx.fill();ctx.lineWidth=2.6;ctx.stroke();
  ctx.strokeStyle='rgba(150,110,80,.55)';ctx.lineWidth=1.6;for(const [a,b,c] of[[-14,-24,6],[-2,-28,7],[10,-26,6],[18,-18,5]]){ctx.beginPath();ctx.arc(x+a,hy+b,c,3.4,5.6);ctx.stroke();}
  ctx.strokeStyle=C.ink;
  /* face: looking down at the laptop, focused */ell(x-6,hy+2,2.4,3,C.ink,0);ell(x+7,hy+2,2.4,3,C.ink,0);line(x-10,hy-4,x-3,hy-5,2);line(x+4,hy-5,x+11,hy-4,2);
  ctx.beginPath();ctx.arc(x+1,hy+10,4,.2,Math.PI-.2);ctx.lineWidth=2;ctx.stroke();circ(x-12,hy+8,3,'rgba(230,140,120,.5)',0);circ(x+13,hy+8,3,'rgba(230,140,120,.5)',0);
  /* sparkle */const tw=(t*1.5)%3;if(tw<1){ctx.globalAlpha=1-tw;star(x+30,hy-30,8,3,4,0);ctx.fillStyle='#fff7d0';ctx.fill();ctx.globalAlpha=1;}
  ctx.restore();}

/* ---------- map state & logic ---------- */
const MAPS={x:0,y:0,face:1,anim:0,moving:false,near:null,card:null,dialog:null,menu:null,t:0,hintT:6,trail:[],banner:null,shake:{},jukebox:null,coinFx:null,birds:[]};
function placeOnMap(){const w=curWorld(),p=save.pos[save.island];if(p&&walkable(w,p[0],p[1])){MAPS.x=p[0];MAPS.y=p[1];}else{MAPS.x=w.start[0];MAPS.y=w.start[1];}MAPS.trail=[];}
function toMap(){scene='map';LV=null;MAPS.card=null;MAPS.dialog=null;MAPS.menu=null;Music.play(MAPS.jukebox||curWorld().song);const eb=document.getElementById('exBtn');if(eb){eb.classList.remove('hot');eb.textContent='EX';}}
function afterLevel(L){if(L.def.final&&!save.ended){save.ended=true;persist();startStory('ending');}else toMap();}
function nodeLabel(n,w){if(n.kind==='level'){const b=n.id==='baron'||n.id==='caldera'||n.id==='apagon';return'Entrar: '+LEVELS[n.id].name;}
  return{shop:'Entrar: Bazar',statue:'Leer la placa',sign:'Leer',home:'Mirar la casa',npc:'Hablar con '+n.name,dock:'Hablar con Capitán Remo',tree:'Sacudir'}[n.kind]||'Mirar';}
function say(who,text,opts){MAPS.dialog={who,text,t:0,opts:opts||null,sel:0};}
function npcTalk(n){const f=save.flags,w=curWorld();
  if(n.npc==='cabo'){const got=['btn1','btn2','btn3'].filter(k=>f[k]).length;
    if(f.caboDone)say(n.name,'¡Impecable! Con mis tres botones parezco un general de verdad.');
    else if(got===3){f.caboDone=true;save.coins+=2;persist();sfx('buy');say(n.name,'¡Mis tres botones dorados! Toma estas dos monedas, soldado. Te las ganaste.');}
    else say(n.name,`Perdí tres botones dorados de mi casaca por la isla. ¿Me los traes? Llevas ${got} de 3.`);}
  else if(n.npc==='rocola'){const seen=new Set(),keys=Object.keys(SONGS).filter(k=>{const n=SONGS[k].name;if(seen.has(n))return false;seen.add(n);return true;});say(n.name,'¡Clinc! Elige la canción que quieras escuchar en la isla.',[{label:'Música normal del mapa',fn:()=>{MAPS.jukebox=null;Music.play(w.song);}},...keys.map(k=>({label:songLabel(k),fn:()=>{MAPS.jukebox=k;Music.play(k);const dj=f.dj=f.dj||[];if(!dj.includes(k))dj.push(k);if(dj.length>=5)unlockAch('dj');persist();}}))]);}
  else if(n.npc==='patita'){const c=cleared(BOSS_LIST[2]);if(f.patita)say(n.name,'¡Cuac, cuac! Brillas más que mi pico.');
    else if(c>=3){f.patita=true;save.coins++;persist();sfx('buy');say(n.name,'¡Cuac! Venciste a tres jefes de la bahía. Toma, esto brilla.');}
    else say(n.name,`¡Cuac! Si vences a tres jefes de Bahía Bruma te doy algo brillante. Llevas ${c}.`);}
  else if(n.npc==='farol'){const lines=['El Rey Apagón vive al otro lado del puente del castillo. El puente baja cuando caen los otros seis jefes.','Lo que brilla en turquesa se rompe con parry, y cada parry te da una carta de súper.','Si juegas con un amigo y cae, haz parry a su alma antes de que se vaya volando.','Dicen que el gato de tinta se esconde en tres lugares distintos de la cumbre.'];
    f.farolI=((f.farolI||0)+1)%lines.length;say(n.name,lines[f.farolI]);}
  else if(n.npc==='gato'){const k=f.gato||0;if(f.gatoDone)say(n.name,'Miau. Ya me encontraste. Sigo aquí, vigilando la tinta.');
    else if(k>=2){f.gatoDone=true;f.gato=2;save.coins++;persist();sfx('buy');unlockAch('gato');say(n.name,'¡Miau! Me encontraste tres veces. Toma, es tuya.');}
    else{f.gato=k+1;persist();sfx('magic');say(n.name,'¡Miau! A ver si me atrapas otra vez…');}}
  persist();}
function dockTalk(){const isl=save.island,opts=[];const b1=cleared(BOSS_LIST[1])>=5,b2=cleared(BOSS_LIST[2])>=5;const go=i=>()=>{transition(()=>{save.pos[save.island]=[MAPS.x,MAPS.y];save.island=i;save.visited[i]=true;
  const w=WORLDS[i];save.pos[i]=w.dockArr;persist();MAPBG={k:null};placeOnMap();MAPS.jukebox=null;MAPS.banner={t:3,text:w.name};toMap();});};
  if(isl!==1)opts.push({label:'Viajar a Isla de Hojalata',fn:go(1)});
  if(isl!==2&&(b1||save.visited[2]))opts.push({label:'Viajar a Bahía Bruma',fn:go(2)});
  if(isl!==3&&(b2||save.visited[3]))opts.push({label:'Viajar a Cumbre Apagón',fn:go(3)});
  opts.push({label:'Quedarme aquí',fn:()=>{}});
  const left=isl===1?5-cleared(BOSS_LIST[1]):isl===2?5-cleared(BOSS_LIST[2]):0;
  say('Capitán Remo',(isl<3&&left>0&&!save.visited[isl+1])?`¡Ahoy! Mi barco no zarpa a la siguiente isla hasta que venzas a los ${isl===1?'cinco':'cinco'} jefes de aquí. Te faltan ${left}.`:'¡Ahoy! ¿A qué isla navegamos?',opts);}
function updMap(dt,IN){const M=MAPS,w=curWorld(),I=IN.M;M.t+=dt;M.hintT=Math.max(0,M.hintT-dt);if(M.banner&&(M.banner.t-=dt)<=0)M.banner=null;
  for(const k in M.shake)M.shake[k]=Math.max(0,M.shake[k]-dt);if(M.coinFx&&(M.coinFx.t-=dt)<=0)M.coinFx=null;
  if(M.birds.length<3&&rand()<.004)M.birds.push({x:-40,y:80+rand()*300,v:60+rand()*40,t:0});for(const b of M.birds){b.x+=b.v*dt;b.t+=dt;}M.birds=M.birds.filter(b=>b.x<w.W+60);
  if(M.libro&&typeof updLibro==='function'){updLibro(I);return;}
  if(M.menu){const o=6;if(I.up){M.menu.sel=(M.menu.sel+o-1)%o;sfx('move');}if(I.down){M.menu.sel=(M.menu.sel+1)%o;sfx('move');}if(I.pause||I.no){M.menu=null;return;}
    if(I.ok){sfx('select');const s=M.menu.sel;M.menu=null;if(s===1)openLogros('map');else if(s===2)openOptions('map');else if(s===3){if(typeof openLibro==='function')openLibro();}else if(s===4){M.menu=null;if(typeof openTuto==='function')openTuto(false);}else if(s===5){save.pos[save.island]=[M.x,M.y];persist();transition(()=>{scene='title';Music.play('title');});}}return;}
  if(M.dialog){const D=M.dialog;D.t+=dt;if(Math.floor(D.t*40)%3===0&&D.t*40<D.text.length)sfx('talk');const done=D.t*40>=D.text.length;
    if(done&&D.opts){if(I.up){D.sel=(D.sel+D.opts.length-1)%D.opts.length;sfx('move');}if(I.down){D.sel=(D.sel+1)%D.opts.length;sfx('move');}if(I.ok){const f=D.opts[D.sel].fn;M.dialog=null;sfx('select');f();}else if(I.no)M.dialog=null;return;}
    if(I.ok||I.no){if(!done)D.t=99;else M.dialog=null;}return;}
  if(M.card){M.card.t=(M.card.t||0)+dt;const bossy=LEVELS[M.card.id].kind!=='run'&&LEVELS[M.card.id].kind!=='maus';if(bossy&&(I.left||I.right)){const L3=['facil','normal','experto'];cfg.diff=L3[(L3.indexOf(cfg.diff)+(I.left?2:1))%3];saveCfg();sfx('move');}if(I.ok){const id=M.card.id;M.card=null;save.pos[save.island]=[M.x,M.y];persist();sfx('select');transition(()=>startLevel(id));}else if(I.no)M.card=null;return;}
  if(I.pause){M.menu={sel:0};sfx('pause');return;}
  if(I.equip){openEquip('map');return;}
  const hh=a=>IN.P.some(q=>q.h[a]);let mx=(hh('right')?1:0)-(hh('left')?1:0),my=(hh('down')?1:0)-(hh('up')?1:0);const n=Math.hypot(mx,my);M.moving=n>0;
  if(n){mx/=n;my/=n;const sp=175*dt;if(mx)M.face=Math.sign(mx);if(walkable(w,M.x+mx*sp,M.y))M.x+=mx*sp;if(walkable(w,M.x,M.y+my*sp))M.y+=my*sp;M.anim+=dt*12;M.trail.push([M.x,M.y,M.face]);if(M.trail.length>36)M.trail.shift();}
  let best=null,bd=1e9;for(const nd of w.nodes){const p=nodePos(w,nd),d=dist(M.x,M.y,p.x,p.y),rng=nd.kind==='sign'?46:(nd.ob||16)+46;if(d<rng&&d<bd){bd=d;best=nd;}}M.near=best;
  if(I.ok&&best){const nd=best;sfx('select');
    if(nd.kind==='level')M.card={id:nd.id};
    else if(nd.kind==='shop'){save.pos[save.island]=[M.x,M.y];persist();transition(openShop);}
    else if(nd.kind==='statue'){say('Placa de bronce','En honor a Rodrigo Reátegui');sfx('ding');unlockAch('estatua');}
    else if(nd.kind==='home')say(nd.name,'Hogar, dulce hogar. Aquí viven Chispa, la bombilla, y Cerilla, el fósforo. Tu progreso se guarda solo al terminar cada nivel o comprar algo.');
    else if(nd.kind==='sign')say(nd.name,nd.bridge!==undefined?(w.bridges[nd.bridge].open()?'¡Paso abierto! Adelante, valientes.':w.bridges[nd.bridge].need):nd.text);
    else if(nd.kind==='npc')npcTalk(nd);
    else if(nd.kind==='dock')dockTalk();
    else if(nd.kind==='tree'){M.shake[nd.id]=.6;sfx('knock');if(!save.taken[nd.coin]){save.taken[nd.coin]=true;save.coins++;persist();M.coinFx={x:nd.x,y:nd.y-60,t:1};sfx('coin');checkExplorer();}}}
  for(const c of w.coins){if(save.taken[c.id])continue;if(dist(M.x,M.y,c.x,c.y)<28){save.taken[c.id]=true;save.coins++;persist();M.coinFx={x:c.x,y:c.y,t:1};sfx('coin');checkExplorer();}}
  for(const it of w.items){if(save.flags[it.id])continue;if(dist(M.x,M.y,it.x,it.y)<28){save.flags[it.id]=true;persist();sfx('coin');M.coinFx={x:it.x,y:it.y,t:1,txt:it.note?'¡NOTA!':'¡BOTÓN!'};}}
  if(Math.floor(M.t)%3===0)save.pos[save.island]=[M.x,M.y];}
function drawMap(){const M=MAPS,w=curWorld(),cx=clamp(M.x-W/2,0,w.W-W),cy=clamp(M.y-H/2,0,w.H-H);
  ctx.drawImage(mapBG(save.island),cx,cy,W,H,0,0,W,H);ctx.save();ctx.translate(-cx,-cy);
  ctx.strokeStyle='rgba(239,224,191,.5)';ctx.lineWidth=2.5;for(let k=0;k<60;k++){const x=(k*397)%w.W,y=(k*211)%w.H;if(inIsle(w,x,y,-50)||x<cx-20||x>cx+W+20||y<cy-20||y>cy+H+20)continue;const q=(M.t*.6+k*.37)%2;if(q<1){ctx.globalAlpha=1-Math.abs(q-.5)*2;ctx.beginPath();ctx.arc(x,y,8,Math.PI*1.15,Math.PI*1.85);ctx.stroke();ctx.globalAlpha=1;}}
  for(const b of w.bridges){const op=b.open(),n=Math.round(b.w/18);for(let i=0;i<n;i++){if(!op&&i>n*.3&&i<n*.7)continue;rr(b.x+i*18,b.y,16,b.h,0,C.woodL,3);}if(op){line(b.x,b.y,b.x+b.w,b.y,4);line(b.x,b.y+b.h,b.x+b.w,b.y+b.h,4);}
    else{rr(b.x-6,b.y-30,10,76,2,C.wood,3);rr(b.x+b.w-4,b.y-30,10,76,2,C.wood,3);line(b.x,b.y-20,b.x+b.w,b.y+30,4,C.rust);line(b.x,b.y+30,b.x+b.w,b.y-20,4,C.rust);}}
  for(const [x,y] of w.windmills){rr(x-16,y-70,32,70,0,'#c9b48c',3);ctx.save();ctx.translate(x,y-70);ctx.rotate(M.t);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);rr(3,-6,44,12,0,C.paper,3);}ctx.restore();}
  if(typeof mapAmbience==='function')mapAmbience(w,M);
  const dockN=w.nodes.find(n=>n.kind==='dock');if(dockN){rr(dockN.x-14,dockN.y,28,60,0,C.woodL,3);drawNPC('remo',dockN.x,dockN.y+76,M.t);}
  const list=[];for(const n of w.nodes){const p=nodePos(w,n);list.push({y:p.y,d:()=>{
      if(n.kind==='level'||n.kind==='shop'||n.kind==='home')drawBld(n,M.t,w.night);
      else if(n.kind==='statue')drawStatue(n.x,n.y,M.t);
      else if(n.kind==='npc')drawNPC(n.npc,p.x,p.y,M.t);
      else if(n.kind==='sign'){rr(n.x-3,n.y-36,6,36,0,C.wood,3);rr(n.x-24,n.y-52,48,22,3,C.paper,3);line(n.x-16,n.y-45,n.x+16,n.y-45,2);line(n.x-16,n.y-37,n.x+16,n.y-37,2);}
      else if(n.kind==='tree'){const sh=(M.shake[n.id]||0)*Math.sin(M.t*60)*4;ctx.save();ctx.translate(sh,0);mapTree(ctx,w.tree,n.x,n.y,rand);if(!save.taken[n.coin]&&Math.floor(M.t*2)%4===0){ctx.globalAlpha=.6;txt('?',n.x+18,n.y-50,14,C.paper);ctx.globalAlpha=1;}ctx.restore();}}});}
  for(const c of w.coins)if(!save.taken[c.id])list.push({y:c.y,d:()=>{shadowE(c.x,c.y+12,10);coinIcon(c.x,c.y+Math.sin(M.t*3+c.x)*3,11,Math.cos(M.t*4+c.x));}});
  for(const it of w.items)if(!save.flags[it.id])list.push({y:it.y,d:()=>{shadowE(it.x,it.y+10,9);if(it.note){txt('♪',it.x,it.y-4+Math.sin(M.t*3+it.x)*4,30,C.brass,C.ink);return;}circ(it.x,it.y+Math.sin(M.t*3+it.x)*3,9,C.gold,3);for(const [a,b] of[[-3,-3],[3,-3],[-3,3],[3,3]])circ(it.x+a,it.y+b+Math.sin(M.t*3+it.x)*3,1.5,C.ink,0);}});
  const two=cfg.players>=2,tr=M.trail.length>12?M.trail[M.trail.length-12]:null,tr3=M.trail.length>24?M.trail[M.trail.length-24]:null;
  if(cfg.players===3){const px=tr3?tr3[0]:M.x-56,py=tr3?tr3[1]:M.y+10;list.push({y:py,d:()=>{shadowE(px,py+2,14,.3);drawHero({skin:save.eq[2]&&save.eq[2].skin,x:px,y:py,char:heroChar(2),face:tr3?tr3[2]:M.face,anim:M.anim+2,run:M.moving,scale:.62,aimX:M.face,aimY:.6});}});}
  if(two){const px=tr?tr[0]:M.x-30,py=tr?tr[1]:M.y+6;list.push({y:py,d:()=>{shadowE(px,py+2,14,.3);drawHero({skin:save.eq[1]&&save.eq[1].skin,x:px,y:py,char:heroChar(1),face:tr?tr[2]:M.face,anim:M.anim+1,run:M.moving,scale:.62,aimX:M.face,aimY:.6});}});}
  list.push({y:M.y,d:()=>{shadowE(M.x,M.y+2,14,.3);drawHero({skin:save.eq[0].skin,x:M.x,y:M.y,char:heroChar(0),face:M.face,anim:M.anim,run:M.moving,scale:.62,aimX:M.face,aimY:.6});}});
  list.sort((a,b)=>a.y-b.y).forEach(o=>o.d());
  for(const i of w.isles){if(!i.hidden)continue;const inside=((M.x-i.x)/i.rx)**2+((M.y-i.y)/i.ry)**2<1.1;ctx.globalAlpha=inside?.35:1;
    for(let k=0;k<12;k++){const a=k*TAU/12,rx=i.rx*.75,ry=i.ry*.7;circ(i.x+Math.cos(a)*rx*.8,i.y+Math.sin(a)*ry*.8-6,26,w.night?'#4b4060':'#5f6f3a',3);}circ(i.x,i.y-6,40,w.night?'#4b4060':'#5f6f3a',3);ctx.globalAlpha=1;}
  ctx.save();ctx.globalAlpha=w.night?.12:.09;ctx.fillStyle=C.ink;for(let k=0;k<5;k++){const cx2=((k*530+M.t*14)%(w.W+400))-200,cy2=(k*347)%w.H;ctx.beginPath();ctx.ellipse(cx2,cy2,140,60,0,0,TAU);ctx.ellipse(cx2+90,cy2+20,100,45,0,0,TAU);ctx.fill();}ctx.restore();
  if(w.night){for(let k=0;k<14;k++){const x=(k*277+Math.sin(M.t+k)*30)%w.W,y=(k*173+Math.cos(M.t*.7+k)*20)%w.H;circ(x,y,2.5,`rgba(255,240,150,${.4+Math.sin(M.t*3+k)*.3})`,0);}}
  for(const b of M.birds){ctx.lineWidth=3;ctx.strokeStyle=C.ink;const f=Math.sin(b.t*10)*6;ctx.beginPath();ctx.moveTo(b.x-10,b.y-f);ctx.quadraticCurveTo(b.x-4,b.y-6,b.x,b.y);ctx.quadraticCurveTo(b.x+4,b.y-6,b.x+10,b.y-f);ctx.stroke();}
  if(M.coinFx)txt(M.coinFx.txt||'+1',M.coinFx.x,M.coinFx.y-30-(1-M.coinFx.t)*30,22,C.gold);
  if(M.near&&!M.card&&!M.dialog&&!M.menu){const n=M.near,p=nodePos(w,n),label=nodeLabel(n,w);ctx.font=`800 15px ${BFONT}`;const tw=ctx.measureText(label).width+46,bx=p.x-tw/2,by=p.y-(n.kind==='sign'?92:n.kind==='npc'?110:n.kind==='statue'?228:n.kind==='tree'?92:n.bld==='castillo'||n.bld==='torre'||n.bld==='faro'?190:150);
    card(bx,by,tw,30,C.paper,3,8);poly([[p.x-8,by+30],[p.x,by+40],[p.x+8,by+30]],C.paper,0);rr(bx+8,by+6,26,18,4,C.ink,0);btxt('OK',bx+21,by+15,11,C.paper,'center',800);btxt(label,bx+40,by+15,15,C.ink,'left',800);}
  ctx.restore();
  card(W-150,16,130,40,C.paper);coinIcon(W-128,36,11,Math.cos(M.t*3));txt(String(save.coins),W-110,37,22,C.ink,null,'left');
  const isl=save.island,bl=BOSS_LIST[isl],rl=RUN_LIST[isl];card(20,16,250,58,C.paper);btxt(w.name,34,34,15,C.rust,'left',800);btxt(`Jefes ${cleared(bl)}/${bl.length} · Niveles ${cleared(rl)}/${rl.length}`,34,56,15,C.ink,'left',700);
  if(M.hintT>0&&!M.dialog&&!M.card){ctx.globalAlpha=Math.min(1,M.hintT);card(W/2-250,H-56,500,38,'rgba(239,224,191,.95)');btxt('Muévete · Enter: entrar o hablar · Shift: equipo · Esc: menú',W/2,H-37,15,C.ink,'center',800);ctx.globalAlpha=1;}
  if(M.banner){const a=Math.min(1,M.banner.t,(3-M.banner.t)*3);ctx.globalAlpha=a;txt(M.banner.text,W/2,H/2-120,54,C.paper);ctx.globalAlpha=1;}
  if(M.card)drawLevelCard(M.card,M.t);
  if(M.dialog)drawDialog(M.dialog,M.t);
  if(M.menu){ctx.fillStyle='rgba(20,13,8,.6)';ctx.fillRect(0,0,W,H);txt('MENÚ',W/2,150,54,C.paper);menuList(['Seguir explorando','Logros','Opciones','Libro de cuentos','Escuela y desafíos','Guardar y salir al título'],M.menu.sel,W/2,196,360);btxt('Shift: abrir el menú de equipo',W/2,478,15,C.paper,'center',800);}
  if(M.libro&&typeof drawLibro==='function')drawLibro();}
const CARD_QUOTES=['¡Que empiece la función!','¡Ni un paso atrás!','¡Prepárate para bailar!','¡Esta vez no te escapas!','¡Abran el telón!','¡A ver de qué estás hecho!'];
function drawLevelCard(c,t){const id=c.id,d=LEVELS[id],k=easeOutBack(Math.min(1,(c.t||0)/.35)),bossy=d.kind!=='run'&&d.kind!=='maus';
  ctx.fillStyle=`rgba(20,13,8,${.6*Math.min(1,(c.t||0)*4)})`;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(k,k);ctx.rotate(-.02+Math.sin(t*1.3)*.004);
  /* paper card with torn-ish double frame and corner stars */
  card(-300,-170,600,330,C.paper,5,14);rr(-286,-156,572,302,8,null,2);rr(-280,-150,560,290,6,null,1);
  for(const [sx,sy] of[[-1,-1],[1,-1],[-1,1],[1,1]]){ctx.save();ctx.translate(sx*268,sy*136);star(0,0,10,4,5,t*.6);ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
  /* ribbon banner with the subtitle */
  ctx.beginPath();ctx.moveTo(-210,-132);ctx.lineTo(210,-132);ctx.lineTo(196,-116);ctx.lineTo(210,-100);ctx.lineTo(-210,-100);ctx.lineTo(-196,-116);ctx.closePath();ctx.fillStyle=C.rust;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
  btxt(d.sub.toUpperCase(),0,-115,14,C.paper,'center',900);
  txt(d.name,0,-60,d.name.length>18?38:46,C.brass,C.ink);
  btxt('«'+CARD_QUOTES[(id.length*7+id.charCodeAt(0))%CARD_QUOTES.length]+'»',0,-22,17,C.rustD,'center',800);
  line(-200,-2,200,-2,2);
  btxt(save.done[id]?`Mejor grado: ${save.done[id]}`:'Todavía sin vencer',0,22,17,C.ink,'center',800);
  const e=save.eq[0];btxt(`${cfg.players>=2?'J1: ':''}${[e.w1,e.w2].filter(Boolean).map(x=>WEAPONS[x].name).join(' + ')}${e.charm?' · '+CHARMS[e.charm].name:''} · ${SUPERS[e.sup||'chispazo'].name}`,0,48,14,C.ink,'center',600);
  for(let j=1;j<cfg.players;j++){const e2=save.eq[j];btxt(`J${j+1}: ${[e2.w1,e2.w2].filter(Boolean).map(x=>WEAPONS[x].name).join(' + ')}${e2.charm?' · '+CHARMS[e2.charm].name:''}`,0,48+j*18,13,C.ink,'center',600);}
  if(bossy){const ds=[['facil','FÁCIL'],['normal','NORMAL'],['experto','EXPERTO']];ds.forEach(([kk,lab],i)=>{const x=-170+i*170,on=cfg.diff===kk;
      if(on){rr(x-72,92,144,34,8,C.brass,3);}else rr(x-72,92,144,34,8,'rgba(20,13,8,.06)',2);btxt(lab,x,110,17,on?C.ink:'#8a7650','center',900);});
    btxt('◀ ▶ dificultad',0,140,12,C.rustD,'center',800);}
  else btxt(d.kind==='maus'?'Aquí solo vale el parry':'Junta las 5 monedas escondidas',0,108,16,C.rustD,'center',800);
  ctx.restore();
  txt('Aceptar: ¡A la carga!',W/2-120,H/2+192,20,C.paper,C.ink);txt('Esc: volver',W/2+150,H/2+192,18,C.paper,C.ink);}
function drawDialog(D,t){const shown=D.text.slice(0,Math.floor(D.t*40)),hasO=D.opts&&D.t*40>=D.text.length,h=hasO?Math.min(5,D.opts.length)*30+140:130,y0=H-h-26;
  card(70,y0,W-140,h,C.paper);rr(82,y0+12,W-164,h-24,4,null,2);ctx.font=`16px ${FONT}`;const nw=ctx.measureText(D.who).width+36;card(92,y0-20,nw,34,C.rust);txt(D.who,92+nw/2,y0-3,16,C.paper,C.ink);
  const big=D.who.startsWith('Placa');wrap(shown,108,y0+44+(big?6:0),W-240,26,big?28:19,C.ink,big?800:600);
  if(hasO){const n=D.opts.length,vis=Math.min(5,n),st=clamp(D.sel-2,0,Math.max(0,n-vis));for(let i=0;i<vis;i++){const k=st+i,on=k===D.sel,yy=y0+h-24-(vis-i)*30;if(on)rr(110,yy-13,W-260,26,6,C.brass,2);btxt((on?'▸ ':'  ')+D.opts[k].label,124,yy,17,C.ink,'left',on?800:600);}
    if(n>vis)btxt(`${D.sel+1}/${n}`,W-130,y0+h-30,13,C.rust,'right');}
  else if(D.t*40>=D.text.length&&Math.floor(t*2)%2===0)txt('▼',W-104,y0+h-24,14,C.rust,null);}

/* ---------- shop ---------- */
const SH={tab:0,sel:0,pl:0,msg:'',t:0};
const SHOP_TABS=[{name:'Armas',type:'w',ids:Object.keys(WEAPONS)},{name:'Amuletos',type:'c',ids:Object.keys(CHARMS)},{name:'Súper',type:'s',ids:Object.keys(SUPERS)},{name:'Skins',type:'k',ids:Object.keys(SKINS).filter(k=>k!=='skin_clasica')}];
const itemDef=(type,id)=>type==='w'?WEAPONS[id]:type==='c'?CHARMS[id]:type==='k'?SKINS[id]:SUPERS[id];
const maxIsl=()=>Math.max(...Object.keys(save.visited).map(Number));
let SHOPBG=null;
function shopBG(){if(SHOPBG)return SHOPBG;const [c,b]=mk(W,H);b.fillStyle='#6b3a26';b.fillRect(0,0,W,H);for(let x=0;x<W;x+=40){b.fillStyle=(x/40)%2?'#74412b':'#633423';b.fillRect(x,0,40,330);}
  b.fillStyle='#4a2a1a';b.fillRect(0,330,W,H-330);b.strokeStyle='rgba(20,13,8,.5)';b.lineWidth=2;for(let y=350;y<H;y+=24){b.beginPath();b.moveTo(0,y);b.lineTo(W,y);b.stroke();}
  b.lineWidth=5;b.strokeStyle=C.ink;b.beginPath();b.moveTo(0,330);b.lineTo(W,330);b.stroke();b.fillStyle=C.woodL;b.fillRect(296,302,650,16);b.strokeRect(296,302,650,16);
  b.fillStyle='#d9c999';b.fillRect(60,60,170,120);b.lineWidth=6;b.strokeRect(60,60,170,120);b.lineWidth=4;b.beginPath();b.moveTo(145,60);b.lineTo(145,180);b.moveTo(60,120);b.lineTo(230,120);b.stroke();
  const g2=b.createRadialGradient(620,70,10,620,200,320);g2.addColorStop(0,'rgba(255,230,160,.28)');g2.addColorStop(1,'rgba(255,230,160,0)');b.fillStyle=g2;b.fillRect(0,0,W,H);SHOPBG=c;return c;}
(function(){const cv=document.getElementById('game');if(!cv||!cv.addEventListener)return;cv.addEventListener('pointerdown',e=>{if(scene!=='shop'||!cv.getBoundingClientRect)return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
  for(let i=0;i<SHOP_TABS.length;i++){const tx=306+i*130;if(x>=tx&&x<=tx+120&&y>=150&&y<=182){SH.click={tab:i};return;}}
  const n=SHOP_TABS[SH.tab].ids.length,{rows,per,gap,cw,ch,rowH,y0}=shopLay(n);
  for(let i=0;i<n;i++){const row=Math.floor(i/per),ix=306+(i%per)*gap,iy=y0+row*rowH;if(x>=ix&&x<=ix+cw&&y>=iy-6&&y<=iy+ch){SH.click={item:i};return;}}});})();
function openShop(){syncSecrets();scene='shop';SH.tab=0;SH.sel=0;SH.pl=0;SH.msg='¡Pasa, pasa! Todo lo que brilla aquí se paga con monedas. Arriba y abajo cambian de estante.';Music.play('shop');}
function shopLay(n){const rows=n>18?3:n>8?2:1,per=Math.ceil(n/rows),gap=Math.min(86,620/per),cw=Math.min(78,gap-8),ch=rows>2?46:rows>1?64:94,rowH=rows>2?49:72,iy=rows>2?17:rows>1?26:40,sc=rows>2?.5:rows>1?.78:1,y0=rows>1?192:200,ly=rows>2?38:(rows>1?64:94)-14,fs=rows>2?10:11;return{rows,per,gap,cw,ch,rowH,iy,sc,y0,ly,fs};}
function shopGrid(n){const l=shopLay(n);return{rows:l.rows,per:l.per};}
function shopTab(t,sel){const nt=SHOP_TABS.length;SH.tab=(t+nt)%nt;SH.sel=Math.min(sel||0,SHOP_TABS[SH.tab].ids.length-1);sfx('trans');}
function updShop(dt,IN){const I=IN.M;SH.t+=dt;let tab=SHOP_TABS[SH.tab];const n=tab.ids.length,{rows,per}=shopGrid(n),row=Math.floor(SH.sel/per),col=SH.sel%per;
  if(I.left){SH.sel=(SH.sel+n-1)%n;sfx('move');}if(I.right){SH.sel=(SH.sel+1)%n;sfx('move');}
  if(I.up){if(row>0){SH.sel-=per;sfx('move');}else shopTab(SH.tab-1,col);tab=SHOP_TABS[SH.tab];}
  else if(I.down){if(row<rows-1){SH.sel=Math.min(n-1,SH.sel+per);sfx('move');}else shopTab(SH.tab+1,col);tab=SHOP_TABS[SH.tab];}
  for(let k=1;k<=4;k++)if(I['n'+k]&&SHOP_TABS[k-1]){shopTab(k-1,0);tab=SHOP_TABS[SH.tab];}
  if(SH.click){const c=SH.click;SH.click=null;if(c.tab!==undefined){shopTab(c.tab,0);tab=SHOP_TABS[SH.tab];}else if(c.item!==undefined){if(c.item===SH.sel)I.ok=true;else{SH.sel=c.item;sfx('move');}}}
  if(I.tab&&cfg.players>=2){SH.pl=(SH.pl+1)%cfg.players;sfx('swap');SH.msg=`Ahora equipas al Jugador ${SH.pl+1}.`;}
  if(I.no||I.pause){transition(toMap);return;}
  const id=SHOP_TABS[SH.tab].ids[SH.sel],d=itemDef(tab.type,id),e=save.eq[SH.pl],own=save.owned.includes(id),locked=d.isl>maxIsl();
  if(I.ok){if(locked){SH.msg=`Eso llega con el barco cuando pises la isla ${d.isl}.`;sfx('deny');}
    else if(!own){if(save.coins>=d.price){save.coins-=d.price;save.owned.push(id);if(tab.type==='w'&&!e.w2)e.w2=id;else if(tab.type==='c')e.charm=id;else if(tab.type==='s')e.sup=id;else if(tab.type==='k')e.skin=id;persist();SH.msg=`¡Vendido! ${d.name} ya es tuyo.`;sfx('buy');checkCollectionAch();}
      else{SH.msg=`Te faltan ${d.price-save.coins} moneda${d.price-save.coins>1?'s':''}. Búscalas en los niveles de correr y por las islas.`;sfx('deny');}}
    else if(tab.type==='w'){if(e.w2===id)e.w2=e.w1;e.w1=id;if(e.w2===e.w1)e.w2=null;persist();SH.msg=`${d.name} va en el Arma 1.`;sfx('select');}
    else if(tab.type==='c'){e.charm=e.charm===id?null:id;persist();SH.msg=e.charm?`Te pusiste ${d.name}.`:'Te quitaste el amuleto.';sfx('select');}
    else if(tab.type==='k'){e.skin=e.skin===id?'skin_clasica':id;persist();SH.msg=e.skin===id?`¡Qué estilo! Ahora llevas la skin ${d.name}.`:'Volviste a la skin clásica.';sfx('select');}
    else{e.sup=id;persist();SH.msg=`Súper equipado: ${d.name}.`;sfx('select');}}
  if(I.alt&&tab.type==='w'&&own&&!locked){if(e.w1===id){e.w1=e.w2||'chispa';}e.w2=id;if(e.w1===e.w2)e.w2=null;persist();SH.msg=`${d.name} va en el Arma 2.`;sfx('select');}}
function itemIcon(id,x,y,t){ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  switch(id){
    case 'chispa':star(0,0,18,8,5,t);ctx.fillStyle='#ffe27a';ctx.fill();ctx.stroke();break;
    case 'abanico':for(const a of[-.4,0,.4]){ctx.save();ctx.rotate(a);ell(16,0,12,6,'#ffc46a');ctx.restore();}break;
    case 'luciernaga':circ(0,0,22,'rgba(200,240,120,.4)',0);ell(0,4,11,14,'#d7f27a');circ(0,-12,8,'#4a423d');ell(-10,-4,8,4,'rgba(255,255,255,.7)',2,-.6+Math.sin(t*30)*.3);ell(10,-4,8,4,'rgba(255,255,255,.7)',2,.6-Math.sin(t*30)*.3);break;
    case 'rebote':ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(-24,16);ctx.quadraticCurveTo(-10,-30,6,10);ctx.quadraticCurveTo(14,-8,24,10);ctx.stroke();ctx.setLineDash([]);circ(6,-2,11,C.rust);break;
    case 'tachuelas':for(const [a,b] of[[-10,6],[8,-4]]){circ(a,b,9,C.rust);line(a,b+4,a,b+20,3);}break;
    case 'burbujas':for(const [a,b,r] of[[-8,6,12],[10,-6,9],[4,14,6]]){circ(a,b,r,'rgba(200,235,240,.6)',2.5);}break;
    case 'sierra':ctx.rotate(t*4);star(0,0,20,14,10);ctx.fillStyle=C.steel;ctx.fill();ctx.stroke();circ(0,0,4,C.ink,0);break;
    case 'arco':ctx.beginPath();ctx.moveTo(-20,-16);ctx.lineTo(-4,-2);ctx.lineTo(-10,2);ctx.lineTo(18,18);ctx.lineWidth=7;ctx.stroke();ctx.lineWidth=3.5;ctx.strokeStyle='#fff6a8';ctx.stroke();break;
    case 'taladro':ctx.rotate(-.5);poly([[-14,-10],[22,0],[-14,10]],C.steel);for(let i=0;i<3;i++)line(-8+i*10,-8+i*2,-2+i*10,8-i*2,2);rr(-28,-8,16,16,3,C.rust);break;
    case 'corazon':ctx.beginPath();ctx.moveTo(0,20);ctx.bezierCurveTo(-30,0,-20,-24,0,-10);ctx.bezierCurveTo(20,-24,30,0,0,20);ctx.fillStyle='#c26a3a';ctx.fill();ctx.stroke();break;
    case 'cafe':ell(0,4,14,19,'#6b3f22',3,.5);ctx.beginPath();ctx.moveTo(-6,-10);ctx.quadraticCurveTo(4,4,-2,18);ctx.stroke();break;
    case 'imanparry':ctx.lineWidth=10;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.arc(0,0,16,Math.PI,0,true);ctx.stroke();ctx.lineWidth=6;ctx.strokeStyle=C.parry;ctx.stroke();rr(-21,-4,10,8,1,C.white,2);rr(11,-4,10,8,1,C.white,2);break;
    case 'fantasma':for(let i=0;i<3;i++)circ(-16+i*9,-10-i*4+Math.sin(t*3+i)*2,8+i*2,'#cfc6b4',2);circ(4,8,14,'#2b2420',3);ell(-1,3,4,3,'rgba(255,255,255,.35)',0);line(12,-4,18,-12,3);circ(19,-14,3+Math.sin(t*20),'#ffb347',0);break;
    case 'muelle':for(let i=0;i<4;i++)ell(0,12-i*8,16,4,null,3);rr(-18,-24,36,8,3,C.rust);break;
    case 'azucar':rr(-12,-12,24,24,4,C.parryL,3);rr(-6,-6,12,12,2,'#fff',1.5);break;
    case 'anillo':ctx.lineWidth=8;ctx.beginPath();ctx.arc(0,4,15,0,TAU);ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=5;ctx.strokeStyle=C.gold;ctx.stroke();ctx.beginPath();ctx.moveTo(0,-4);ctx.bezierCurveTo(-14,-16,-10,-28,0,-20);ctx.bezierCurveTo(10,-28,14,-16,0,-4);ctx.fillStyle='#c26a3a';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();break;
    case 'doble':for(const dx of[-8,8]){ctx.beginPath();ctx.moveTo(dx,18);ctx.bezierCurveTo(dx-22,2,dx-14,-18,dx,-8);ctx.bezierCurveTo(dx+14,-18,dx+22,2,dx,18);ctx.fillStyle=dx<0?'#c26a3a':'#e08a5a';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}break;
    case 'invencible':{const hue=(t*300)%360;star(0,0,22,10,5,t);ctx.fillStyle=`hsl(${hue},85%,62%)`;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();break;}
    case 'carga':rr(-24,-9,34,18,6,C.steel,3);circ(14,0,12+Math.sin(t*8)*2,'#ffe27a',3);circ(14,0,5,'#fff',0);break;
    case 'repuesto':circ(0,-4,14,C.glass);rr(-8,8,16,10,2,C.steel);txt('+',0,-4,16,C.rust,null);break;
    case 'chispazo':rr(-26,-8,52,16,8,'#fff3b0');circ(-26,0,10,'#ffe27a');break;
    case 'lluvia':for(let i=0;i<5;i++){star(-20+i*10,-10+(i%2)*16,6,2.5,4,t);ctx.fillStyle='#ffe27a';ctx.fill();ctx.stroke();}break;
    case 'bumeran':ctx.rotate(t*3);ctx.beginPath();ctx.moveTo(-20,-4);ctx.quadraticCurveTo(0,-24,20,-4);ctx.lineTo(15,5);ctx.quadraticCurveTo(0,-10,-15,5);ctx.closePath();ctx.fillStyle='#c98a4a';ctx.fill();ctx.stroke();break;
    case 'cohete':ctx.rotate(-.6);rr(-16,-8,30,16,8,C.paper);poly([[14,-8],[26,0],[14,8]],C.rust);poly([[-16,-8],[-24,-15],[-10,-8]],C.rust,2.5);poly([[-16,8],[-24,15],[-10,8]],C.rust,2.5);circ(-26,0,6+Math.sin(t*20)*2,'#ffb35a',2);break;
    case 'lanzallamas':rr(-24,-6,26,12,3,C.steel);rr(-14,4,8,12,2,C.rust,2.5);for(let i=0;i<3;i++)circ(8+i*8,-2+Math.sin(t*14+i)*2,7-i,i===0?'#ffe27a':i===1?'#ff9a3c':'#c8392b',2);break;
    case 'trebol':for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;ctx.save();ctx.rotate(a);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-12,-10,-4,-22,0,-12);ctx.bezierCurveTo(4,-22,12,-10,0,0);ctx.fillStyle='#5aa65a';ctx.fill();ctx.stroke();ctx.restore();}line(0,0,8,18,3);break;
    case 'botas':ctx.beginPath();ctx.moveTo(-12,-18);ctx.lineTo(4,-18);ctx.lineTo(4,4);ctx.lineTo(18,8);ctx.lineTo(18,16);ctx.lineTo(-12,16);ctx.closePath();ctx.fillStyle=C.rust;ctx.fill();ctx.stroke();for(let i=0;i<3;i++)circ(-22+i*3,-6+i*8,3+Math.sin(t*20+i),'#ffb35a',0);break;
    case 'relojlento':circ(0,2,18,C.paper);line(0,2,0,-10,2.5);line(0,2,8,6,2.5);rr(-5,-22,10,6,2,C.brass,2);ctx.globalAlpha=.6;circ(0,2,24+Math.sin(t*2)*3,null,2);ctx.globalAlpha=1;break;
    case 'tormenta':cloudShape(ctx,-26,-10,.55,'#8a8a9a',3);ctx.beginPath();ctx.moveTo(2,0);ctx.lineTo(-6,14);ctx.lineTo(2,14);ctx.lineTo(-4,28);ctx.lineWidth=5;ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle='#fff6a8';ctx.stroke();break;
    case 'escudo':ctx.globalAlpha=.7;circ(0,0,22,'rgba(180,235,240,.5)',3);ctx.globalAlpha=1;ctx.beginPath();ctx.arc(-6,-8,8,3.5,4.6);ctx.lineWidth=3;ctx.strokeStyle='#fff';ctx.stroke();line(10,6,22,-2,3,C.parryL);break;
    case 'iman':ctx.lineWidth=12;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.arc(0,4,16,Math.PI,0);ctx.stroke();ctx.lineWidth=8;ctx.strokeStyle=C.rust;ctx.stroke();rr(-22,2,12,12,1,C.white,2);rr(10,2,12,12,1,C.white,2);break;
    default:if(id&&id.startsWith('skin_')){ctx.scale(.5,.5);drawHero({x:0,y:50,char:'chispa',face:1,anim:t*2,aimX:1,aimY:0,skin:id});}
  }ctx.restore();}
function drawTornillo(x,y,t){ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=4;ctx.strokeStyle=C.ink;const bob=Math.sin(t*2)*4;
  rr(-46,-150+bob,92,150-bob,10,C.steel,4);for(let i=0;i<8;i++)line(-46,-130+bob+i*17,46,-140+bob+i*17,2.5);
  poly([[-36,-90+bob],[36,-90+bob],[30,0],[-30,0]],C.paper,4);poly([[-16,-110+bob],[0,-102+bob],[-16,-94+bob]],C.rust,4);poly([[16,-110+bob],[0,-102+bob],[16,-94+bob]],C.rust,4);
  ctx.beginPath();for(let i=0;i<6;i++){const a=i*TAU/6;ctx.lineTo(Math.cos(a)*78,-200+bob+Math.sin(a)*56);}ctx.closePath();ctx.fillStyle='#b8b09f';ctx.fill();ctx.stroke();
  for(const s of[-1,1])ell(s*24,-214+bob,13,16,C.white,4);const blink=(t%4)<.12;for(const s of[-1,1]){if(blink)rr(s*24-9,-214+bob,18,3,0,C.ink,0);else ell(s*24+4,-211+bob,5,7,C.ink,0);}
  ctx.fillStyle=C.ink;ctx.beginPath();ctx.moveTo(-44,-178+bob);ctx.quadraticCurveTo(-20,-200+bob,0,-186+bob);ctx.quadraticCurveTo(20,-200+bob,44,-178+bob);ctx.quadraticCurveTo(20,-184+bob,0,-176+bob);ctx.quadraticCurveTo(-20,-184+bob,-44,-178+bob);ctx.fill();
  ctx.beginPath();ctx.arc(0,-166+bob,12,0,Math.PI);ctx.lineWidth=3;ctx.stroke();for(const s of[-1,1]){hose(s*44,-80+bob,s*80,-70,s*76,-30+Math.sin(t*3+s)*6,7);glove(s*76,-30+Math.sin(t*3+s)*6,14);}ctx.restore();}
function SH_TABS_SAFE(){return SHOP_TABS[SH.tab];}
function drawShopAmbience(t){/* swinging lamp, warm light cone, shelves of curios, steaming teapot */
  const sw=Math.sin(t*1.4)*.12;ctx.save();ctx.translate(620,0);ctx.rotate(sw);line(0,0,0,70,3);ctx.save();ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(0,90,10,0,240,300);g.addColorStop(0,'rgba(255,220,140,.35)');g.addColorStop(1,'rgba(255,220,140,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-20,90);ctx.lineTo(-260,520);ctx.lineTo(260,520);ctx.lineTo(20,90);ctx.closePath();ctx.fill();ctx.restore();
  ctx.beginPath();ctx.moveTo(-30,96);ctx.quadraticCurveTo(0,58,30,96);ctx.closePath();ctx.fillStyle=C.brass;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();circ(0,98,8,'#fff3b0',2);ctx.restore();
  rr(250,92,40,6,2,C.woodD,2);for(let i=0;i<3;i++){const x=258+i*12;rr(x-4,74,9,18,3,['#7bb7c9','#c26a3a','#b8d08a'][i],2);}
  const tx=268,ty=300;ell(tx,ty,20,15,'#d6cfc2',3);rr(tx-5,ty-20,10,5,2,C.rust,2);line(tx+18,ty-4,tx+32,ty-12,4);for(let i=0;i<3;i++){const k=(t*.5+i/3)%1;ctx.globalAlpha=1-k;circ(tx+34+k*8,ty-18-k*40,4+k*6,'rgba(255,255,255,.5)',0);ctx.globalAlpha=1;}}
function drawShop(){const t=SH.t,tab=SH_TABS_SAFE(),e=save.eq[SH.pl];ctx.drawImage(shopBG(),0,0,W,H);drawShopAmbience(t);drawTornillo(160,470,t);
  SHOP_TABS.forEach((tb,i)=>{const on=i===SH.tab,x=306+i*130;rr(x,150,120,32,8,on?C.brass:'rgba(239,224,191,.55)',3);txt(tb.name,x+60,167,16,C.ink,null);btxt(String(i+1),x+12,158,10,C.rustD,'center',900);});
  const ids=tab.ids,n=ids.length,{rows,per,gap,cw,ch,rowH,iy:IY,sc:SC,y0:Y0,ly:LY,fs:FS}=shopLay(n);
  ids.forEach((id,i)=>{const d=itemDef(tab.type,id),sel=i===SH.sel,row=Math.floor(i/per),x=306+(i%per)*gap,y=Y0+row*rowH+(sel?-5:0),own=save.owned.includes(id),locked=d.isl>maxIsl(),
    eq=tab.type==='w'?(e.w1===id||e.w2===id):tab.type==='c'?e.charm===id:tab.type==='k'?e.skin===id:(e.sup||'chispazo')===id;
    const iy=IY,ly=LY;if(sel)rr(x-5,y-5,cw+10,ch+10,10,'rgba(242,193,78,.45)',0);rr(x,y,cw,ch,6,locked?'#8a7650':own?'#e6dcc0':C.paper,sel?4:3);
    if(locked){txt('?',x+cw/2,y+iy,rows>2?18:rows>1?24:30,C.ink,null);btxt(`Isla ${d.isl}`,x+cw/2,y+ly-2,FS+1,C.ink,'center',800);}
    else{if(rows>1){ctx.save();ctx.translate(x+cw/2,y+iy);ctx.scale(SC,SC);itemIcon(id,0,0,t);ctx.restore();}else itemIcon(id,x+cw/2,y+iy,t);
      if(own)btxt(eq?(tab.type==='w'?(e.w1===id?'ARMA 1':'ARMA 2'):'PUESTO'):'TUYO',x+cw/2,y+ly,FS,eq?C.rust:C.ink,'center',800);else{coinIcon(x+cw/2-12,y+ly,rows>2?6:8);btxt(String(d.price),x+cw/2+2,y+ly,rows>2?12:15,C.ink,'left',800);}}});
  const id=ids[SH.sel],d=itemDef(tab.type,id),locked=d.isl>maxIsl();card(306,340,624,170,C.paper);
  txt(locked?'Llegará más adelante':d.name,326,368,22,C.brass,C.ink,'left');btxt(tab.type==='w'?'ARMA':tab.type==='c'?'AMULETO':tab.type==='k'?'SKIN':'SÚPER (5 cartas)',910,368,13,C.rust,'right',800);
  const yy=wrap(locked?`Don Tornillo trae esto en el barco cuando llegues a la isla ${d.isl}.`:d.desc,326,398,580,21,16);if(!locked&&d.exd)wrap(d.exd,326,yy+22,580,21,15,C.rustD,700);
  const own=save.owned.includes(id);let hint=locked?'':!own?`Aceptar: comprar por ${d.price} moneda${d.price>1?'s':''}`:tab.type==='w'?'Aceptar: Arma 1 · EX: Arma 2':tab.type==='c'?(e.charm===id?'Aceptar: quitártelo':'Aceptar: ponértelo (uno a la vez)'):tab.type==='k'?(e.skin===id?'Aceptar: volver a la clásica':'Aceptar: ponerte esta skin'):'Aceptar: equipar este súper';
  btxt(hint,326,490,15,C.rust,'left',800);
  card(318,20,612,58,'rgba(239,224,191,.95)');wrap(SH.msg,336,40,580,19,15,C.ink,700);poly([[318,66],[290,90],[334,78]],'rgba(239,224,191,.95)',0);
  card(W-150,96,130,40,C.paper);coinIcon(W-128,116,11,Math.cos(t*3));txt(String(save.coins),W-110,117,22,C.ink,null,'left');
  card(20,20,262,118,'rgba(239,224,191,.95)');btxt(cfg.players>=2?`Equipando: Jugador ${SH.pl+1} (cambiar arma = siguiente)`:'Tu equipo',34,38,13,C.rust,'left',800);
  btxt(`Arma 1: ${WEAPONS[e.w1].name}`,34,60,15);btxt(`Arma 2: ${e.w2?WEAPONS[e.w2].name:'—'}`,34,80,15);btxt(`Amuleto: ${e.charm?CHARMS[e.charm].name:'—'}`,34,100,15);btxt(`Súper: ${SUPERS[e.sup||'chispazo'].name}`,34,120,15);if(e.skin&&e.skin!=='skin_clasica')btxt(`Skin: ${SKINS[e.skin].name}`,34,136,12,C.rust);
  btxt('← → ↑ ↓ moverte (↑ ↓ en el borde cambia de estante) · 1-4 estantes · clic o toque para elegir · Esc salir',W-24,H-12,12,C.paper,'right',700);}

/* ---------- EQUIP MENU (Shift on the map): weapons, super and charm cards ---------- */
const EQ={slot:0,pick:false,sel:0,pl:0,t:0,back:'map',msg:''};
const EQ_SLOTS=[{key:'w1',name:'ARMA 1',type:'w'},{key:'w2',name:'ARMA 2',type:'w',empty:true},{key:'sup',name:'SÚPER',type:'s'},{key:'charm',name:'AMULETO',type:'c',empty:true},{key:'skin',name:'SKIN',type:'k'}];
function eqList(i){const s=EQ_SLOTS[i],src=s.type==='w'?WEAPONS:s.type==='s'?SUPERS:s.type==='k'?SKINS:CHARMS,ids=Object.keys(src).filter(id=>save.owned.includes(id)||id==='skin_clasica');return s.empty?[null,...ids]:ids;}
function eqTotal(i){const s=EQ_SLOTS[i];return Object.keys(s.type==='w'?WEAPONS:s.type==='s'?SUPERS:s.type==='k'?SKINS:CHARMS).length;}
function openEquip(back){syncSecrets();MAPS.hintT=0;EQ.back=back;EQ.slot=0;EQ.pick=false;EQ.sel=0;EQ.t=0;EQ.pl=0;EQ.msg='';scene='equip';sfx('card');}
function closeEquip(){persist();sfx('card');if(EQ.back==='map')scene='map';else scene=EQ.back;}
function updEquip(dt,IN){const I=IN.M;EQ.t+=dt;const e=save.eq[EQ.pl];
  if(I.tab&&cfg.players>=2){EQ.pl=(EQ.pl+1)%cfg.players;sfx('swap');EQ.pick=false;}
  if(!EQ.pick){{const ns=EQ_SLOTS.length;if(I.left){EQ.slot=(EQ.slot+ns-1)%ns;sfx('move');}if(I.right){EQ.slot=(EQ.slot+1)%ns;sfx('move');}}
    if(I.ok){EQ.pick=true;const cur=e[EQ_SLOTS[EQ.slot].key]??(EQ_SLOTS[EQ.slot].type==='k'?'skin_clasica':null);EQ.sel=Math.max(0,eqList(EQ.slot).indexOf(cur));sfx('select');}
    else if(I.no||I.pause||I.equip)closeEquip();return;}
  const list=eqList(EQ.slot),n=list.length,cols=7;
  if(I.left){EQ.sel=(EQ.sel+n-1)%n;sfx('move');}if(I.right){EQ.sel=(EQ.sel+1)%n;sfx('move');}
  if(I.up&&EQ.sel-cols>=0){EQ.sel-=cols;sfx('move');}if(I.down&&EQ.sel+cols<n){EQ.sel+=cols;sfx('move');}
  if(I.ok){const id=list[EQ.sel],k=EQ_SLOTS[EQ.slot].key;
    if(k==='w1'){if(e.w2===id)e.w2=e.w1;e.w1=id;}else if(k==='w2'){if(id===e.w1){e.w1=e.w2||e.w1;}e.w2=id;if(e.w1===e.w2)e.w2=null;}else e[k]=id;
    if(!e.w1)e.w1='chispa';EQ.pick=false;persist();sfx('buy');EQ.msg='¡Equipado!';EQ.msgT=1.2;}
  else if(I.no||I.pause){EQ.pick=false;sfx('back');}
  else if(I.equip)closeEquip();}
function eqDef(type,id){return id?itemDef(type,id):null;}
function drawEquip(){const t=EQ.t,e=save.eq[EQ.pl],slide=easeOutQ(Math.min(1,t/.35));
  if(EQ.back==='map')drawMap();ctx.fillStyle=`rgba(20,13,8,${.6*slide})`;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(0,(1-slide)*H);
  /* the equip card */
  const cx=60,cy=20,cw=W-120,ch=H-40;ctx.save();ctx.translate(cx+cw/2,cy+ch/2);ctx.rotate(-.012);ctx.translate(-(cx+cw/2),-(cy+ch/2));
  card(cx,cy,cw,ch,C.paper,4,12);rr(cx+10,cy+10,cw-20,ch-20,8,null,1.6);
  txt('EQUIPAR',W/2,cy+38,34,C.rust,C.ink);if(cfg.players>=2)btxt(`Jugador ${EQ.pl+1} · cambiar arma = siguiente jugador`,W/2,cy+66,14,C.ink,'center',800);
  /* hero portrait */
  drawHero({skin:e.skin,x:cx+95,y:cy+300,char:heroChar(EQ.pl),face:1,anim:t*2,aimX:1,aimY:0,shoot:Math.floor(t*2)%2===0,scale:1.25});
  shadowE(cx+95,cy+302,34);
  /* the four slot cards */
  EQ_SLOTS.forEach((s,i)=>{const id=e[s.key]??null,sel=i===EQ.slot,x=cx+186+i*124,y=cy+80+(sel&&!EQ.pick?-6+Math.sin(t*6)*2:0);
    if(sel){ctx.fillStyle='rgba(217,164,65,.45)';ctx.beginPath();ctx.roundRect(x-6,y-6,124,152,12);ctx.fill();}
    const sid=id||(s.type==='k'?'skin_clasica':null);rr(x,y,112,140,8,sid?'#efe4c8':'#cdbb94',sel?4:3);btxt(s.name,x+56,y+16,13,C.rust,'center',900);
    if(sid){itemIcon(sid,x+56,y+70,t);const d=itemDef(s.type,sid);wrap(d.name,x+8,y+108,96,15,13,C.ink,800);}
    else txt('—',x+56,y+72,30,C.ink,null);});
  /* picker grid or description */
  const bx=cx+200,by=cy+240,bw=cw-230;
  if(EQ.pick){const s=EQ_SLOTS[EQ.slot],list=eqList(EQ.slot);rr(bx-6,by-6,bw+12,146,8,'rgba(20,13,8,.08)',2);
    btxt(`Elige ${s.name.toLowerCase()} · tienes ${list.filter(Boolean).length} de ${eqTotal(EQ.slot)}`,bx,by+6,14,C.ink,'left',800);
    list.forEach((id,i)=>{const c=i%7,r=Math.floor(i/7),x=bx+c*86,y=by+20+r*58,sel=i===EQ.sel,eqd=(e[s.key]??null)===id;
      rr(x,y,78,52,6,sel?C.brass:'#efe4c8',sel?4:2.5);if(id){ctx.save();ctx.translate(x+39,y+24);ctx.scale(.8,.8);itemIcon(id,0,0,t);ctx.restore();}else txt('VACÍO',x+39,y+26,11,C.ink,null);
      if(eqd)btxt('PUESTO',x+39,y+45,10,C.rust,'center',900);});
    const id=list[EQ.sel],d=eqDef(s.type,id);
    card(bx,by+148,bw,70,'#f6ecd4',2.5,6);if(d){btxt(d.name,bx+14,by+166,16,C.rust,'left',900);wrap(d.desc,bx+14,by+186,bw-28,16,13,C.ink,700);}
    else btxt('Dejar este espacio vacío.',bx+14,by+178,15,C.ink,'left',700);}
  else{const s=EQ_SLOTS[EQ.slot],id=e[s.key]??(s.type==='k'?'skin_clasica':null),d=eqDef(s.type,id);card(bx,by,bw,120,'#f6ecd4',2.5,6);
    if(d){txt(d.name,bx+16,by+22,20,C.brass,C.ink,'left');wrap(d.desc,bx+16,by+50,bw-32,18,15,C.ink,700);if(d.exd)wrap(d.exd,bx+16,by+92,bw-32,18,14,C.rustD,800);}
    else{txt('Espacio vacío',bx+16,by+22,20,C.brass,C.ink,'left');wrap(s.type==='c'?'Compra amuletos en el Bazar de Don Tornillo.':'Aquí va tu segunda arma: cámbiala en combate.',bx+16,by+54,bw-32,18,15,C.ink,700);}
    const tot=Object.keys(WEAPONS).length+Object.keys(CHARMS).length+Object.keys(SUPERS).length+Object.keys(SKINS).length-1,own=save.owned.length;
    btxt(`Colección: ${own} de ${tot} cartas`,bx,by+142,14,C.ink,'left',800);}
  btxt(EQ.pick?'← → ↑ ↓ elegir · Enter equipar · Esc volver':'← → elegir espacio · Enter cambiar · Shift o Esc cerrar',W/2,cy+ch-22,13,C.ink,'center',800);
  if(EQ.msgT>0){EQ.msgT-=1/60;txt(EQ.msg,W/2,cy+ch/2,40,C.gold,C.ink);}
  ctx.restore();ctx.restore();}
const easeOutQ=t=>1-Math.pow(1-t,3);

/* ---------- title, slots, options, controls, story ---------- */
const TI={sel:0,t:0};
function updTitle(dt,IN){const I=IN.M;TI.t+=dt;const o=5;titleCode(I);if(I.up){TI.sel=(TI.sel+o-1)%o;sfx('move');}if(I.down){TI.sel=(TI.sel+1)%o;sfx('move');}
  if(I.ok){sfx('select');if(TI.sel===0){scene='slots';SL.sel=slot;SL.del=false;}else if(TI.sel===1){if(typeof openOnline==='function')openOnline();}else if(TI.sel===2)openOptions('title');else if(TI.sel===3)openLogros('title');else{scene='credits';CR.t=0;}}}
function drawTitle(){const ox=(Math.sin(TI.t*.08)*.5+.5)*(WORLDS[1].W-W);ctx.drawImage(mapBG(1),ox,250,W,H,0,0,W,H);ctx.fillStyle='rgba(20,13,8,.5)';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H/2);ctx.rotate(TI.t*.15);for(let i=0;i<18;i++){ctx.rotate(TAU/18);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(700,-60);ctx.lineTo(700,60);ctx.closePath();ctx.fillStyle=i%2?'rgba(242,193,78,.10)':'rgba(239,224,191,.05)';ctx.fill();}ctx.restore();
  for(let i=0;i<14;i++){const x=(i*97+TI.t*30*(1+i%3))%(W+40)-20,y=H-((TI.t*40*(1+i%2)+i*53)%(H+40));ctx.globalAlpha=.5;txt(i%3?'♪':'★',x,y,16+i%3*6,i%3?C.paper:C.gold,null);ctx.globalAlpha=1;}
  const bob=Math.sin(TI.t*2)*4;ctx.save();ctx.translate(0,bob);card(W/2-330,50,660,420);rr(W/2-318,62,636,396,4,null,2);
  {const D=(k)=>Math.abs(Math.sin(TI.t*4.2+k))*12,S=(k)=>Math.sin(TI.t*2.1+k)>0?1:-1;drawHero({x:W/2-268,y:330-D(0),char:'chispa',face:S(0),anim:TI.t*2,aimX:.7*S(0),aimY:-.7,scale:1.1,air:D(0)>3,vy:-200,flash:Math.floor(TI.t*3)%2===0});drawHero({x:W/2-140,y:330-D(2),char:'velita',face:-S(2),anim:TI.t*2+2,aimX:-.7*S(2),aimY:-.7,scale:1.1,air:D(2)>3,vy:-200,flash:Math.floor(TI.t*3+2)%2===0});drawHero({x:W/2-204,y:322-D(1),char:'cerilla',face:-S(1),anim:TI.t*2+1,aimX:-.7*S(1),aimY:-.7,scale:1.25,air:D(1)>3,vy:-200,flash:Math.floor(TI.t*3+1)%2===0});}
  txt('CHISPA',W/2+70,118,64,C.brass);txt('y Cerilla',W/2+70,166,32,C.rust,null);btxt('¡y Velita!',W/2+180,186,15,'#7d5aa6','center',900);btxt('contra el Rey Apagón',W/2+70,204,18,C.ink,'center',800);
  ['Jugar','En línea','Opciones','Logros','Créditos'].forEach((o,i)=>{const on=i===TI.sel,y=246+i*32;if(on)rr(W/2-60,y-15,260,30,8,C.brass,3);txt(o,W/2+70,y,21,on?C.ink:C.rustD,null);if(i===1)btxt('¡SIN LAG!',W/2+172,y-9,11,C.rust,'center',900);});if(TI.msgT>0){TI.msgT-=1/60;txt(TI.msg,W/2,500,22,C.gold,C.ink);}
  btxt(`${cfg.players>=2?cfg.players+' jugadores':'1 jugador'} · cambia esto en Opciones`,W/2+70,412,14,C.ink,'center',700);ctx.restore();}

const SL={sel:0,del:false};
function slotInfo(i){const s=readSlot(i);if(!s)return null;const done=ALL_LEVELS.filter(k=>s.cleared[k]).length;return{pct:Math.round(done/ALL_LEVELS.length*100),coins:s.coins,isl:Math.max(...Object.keys(s.visited||{1:1}).map(Number)),ended:s.ended};}
function updSlots(dt,IN){const I=IN.M;if(I.left||I.up){SL.sel=(SL.sel+2)%3;SL.del=false;sfx('move');}if(I.right||I.down){SL.sel=(SL.sel+1)%3;SL.del=false;sfx('move');}
  if(I.no||I.pause){scene='title';return;}
  if(I.alt&&slotInfo(SL.sel)){if(!SL.del){SL.del=true;sfx('warn');}else{try{localStorage.removeItem(slotKey(SL.sel));}catch(_){}SL.del=false;sfx('boom');}}
  if(I.ok){sfx('select');slot=SL.sel;const s=readSlot(slot);save=s||defSave();MAPBG={k:null};if(!s)persist();placeOnMap();MAPS.jukebox=null;
    if(!save.intro)transition(()=>startStory('intro'));else transition(()=>{MAPS.banner={t:3,text:curWorld().name};toMap();});}}
function drawSlots(){ctx.drawImage(mapBG(1),300,300,W,H,0,0,W,H);ctx.fillStyle='rgba(20,13,8,.6)';ctx.fillRect(0,0,W,H);txt('ELIGE PARTIDA',W/2,80,46,C.paper);
  for(let i=0;i<3;i++){const x=W/2-420+i*285,on=i===SL.sel,info=slotInfo(i);rr(x,140,270,260,10,on?C.brass:C.paper,on?5:3);txt('Partida '+'ABC'[i],x+135,180,26,C.ink,null);
    if(info){btxt(`${info.pct} % completado`,x+135,232,20,C.ink,'center',800);btxt(`Isla más lejana: ${info.isl}`,x+135,264,16,C.ink,'center');coinIcon(x+110,298,10);btxt(String(info.coins),x+128,298,18,C.ink,'left',800);
      if(info.ended)txt('★ FIN',x+135,336,18,C.rust,null);if(on&&SL.del)btxt('EX otra vez = BORRAR',x+135,372,14,C.rust,'center',800);}
    else btxt('Vacía · empezar aquí',x+135,250,18,C.ink,'center',700);}
  btxt('← → elegir · Aceptar: jugar · EX: borrar · Esc: volver',W/2,450,16,C.paper,'center',700);}
const OP={sel:0,back:'title'};
const OP_ROWS=['players','char','diff','music','pack','sfx','shake','grain','filtro','quality','mymusic','mmload','mmassign','controls','back'];
function openOptions(back){OP.back=back;OP.sel=0;OP.prevScene=scene;scene='options';}
function closeOptions(){saveCfg();if(OP.back==='level'&&LV){scene='level';}else if(OP.back==='map')scene='map';else scene='title';}
function updOptions(dt,IN){const I=IN.M,n=OP_ROWS.length;if(I.up){OP.sel=(OP.sel+n-1)%n;sfx('move');}if(I.down){OP.sel=(OP.sel+1)%n;sfx('move');}if(I.no||I.pause){closeOptions();return;}
  const r=OP_ROWS[OP.sel],d=(I.right?1:0)-(I.left?1:0);
  if(d||I.ok){if(r==='players'){cfg.players=((cfg.players||1)+(d<0?1:0))%3+1;}else if(r==='char'){const hs=['chispa','cerilla','velita'];cfg.char=hs[(hs.indexOf(cfg.char)+(d<0?2:1))%3];}else if(r==='diff'){const L3=['facil','normal','experto'];cfg.diff=L3[(L3.indexOf(cfg.diff)+(d<0?2:1))%3];}
    else if(r==='music'){if(d)cfg.music=clamp(Math.round(cfg.music*10+d)/10,0,1);}else if(r==='sfx'){if(d)cfg.sfx=clamp(Math.round(cfg.sfx*10+d)/10,0,1);if(d)sfx('coin');}
    else if(r==='pack'){cfg.pack=!(cfg.pack!==false);saveCfg();mmRefresh();sfx('move');return;}
    else if(r==='mymusic'){if(!MyMusic.files.length){if(I.ok)pickMyMusic();return;}cfg.myMusic=!cfg.myMusic;saveCfg();mmRefresh();sfx('move');return;}
    else if(r==='mmload'){if(I.ok){if(d===0)pickMyMusic();}else if(d<0&&MyMusic.files.length)clearMyMusic();return;}
    else if(r==='mmassign'){if(I.ok){if(!MyMusic.files.length){pickMyMusic();return;}MA.sel=0;MA.top=0;MA.prev=mmLast;scene='mmassign';sfx('select');}return;}
    else if(r==='quality'){const Q=['auto','alta','media','baja'];cfg.quality=Q[(Q.indexOf(cfg.quality||'auto')+(d<0?3:1))%4];if(typeof perfFromCfg==='function')perfFromCfg();}else if(r==='shake')cfg.shake=!cfg.shake;else if(r==='grain')cfg.grain=!cfg.grain;else if(r==='filtro'){const F=['color','dostiras','sepia','byn'];cfg.filtro=F[(F.indexOf(cfg.filtro||'color')+(d<0?3:1))%4];if(typeof applyFiltro==='function')applyFiltro();}else if(r==='locutor'){cfg.locutor=cfg.locutor===false;if(cfg.locutor&&typeof anunciar==='function')anunciar('¡A pelear!');}else if(r==='controls'&&I.ok){scene='controls';CT.sel=0;CT.prof=cfg.players===3?'t1':cfg.players===2?'p1':'solo';return;}else if(r==='back'&&I.ok){closeOptions();return;}
    saveCfg();sfx('move');}}
function bar(x,y,v){for(let i=0;i<10;i++)rr(x+i*16,y-9,12,18,2,i<Math.round(v*10)?C.brass:'rgba(20,13,8,.2)',2);}
function drawOptions(){ctx.fillStyle='#2b1d14';ctx.fillRect(0,0,W,H);card(W/2-330,30,660,470);txt('OPCIONES',W/2,70,40,C.brass);
  const lab={players:'Jugadores',char:'Personaje del Jugador 1',diff:'Dificultad',music:'Música (volumen)',pack:'Estilo de música',sfx:'Efectos de sonido',shake:'Temblor de pantalla',grain:'Grano de película',filtro:'Filtro de película',locutor:'Locutor',quality:'Calidad gráfica',controls:'Controles y teclas…',back:'Volver',mymusic:'Usar mi música',mmload:MyMusic.files.length?'Cambiar mis canciones…  (◀ borrar)':'Cargar mis canciones…',mmassign:'Elegir canción de cada nivel…'};
  const val={players:cfg.players===3?'3 · cooperativo':cfg.players===2?'2 · cooperativo':'1',char:{chispa:'Chispa (bombilla)',cerilla:'Cerilla (fósforo)',velita:'Velita (vela)'}[cfg.char],diff:cfg.diff==='facil'?'Fácil (jefes con menos vida)':cfg.diff==='experto'?'Experto (jefes más duros, grado S)':'Normal',pack:cfg.pack!==false?'Jazz real (grabaciones)':'Sintetizada (8 bits jazz)',shake:cfg.shake?'Sí':'No',grain:cfg.grain?'Sí':'No',filtro:{color:'Color',dostiras:'Dos tiras (años 30)',sepia:'Sepia',byn:'Blanco y negro'}[cfg.filtro||'color'],locutor:cfg.locutor===false?'No':'Sí',quality:typeof perfLabel==='function'?perfLabel():'Auto',mymusic:MyMusic.files.length?(cfg.myMusic?`Sí · ${MyMusic.files.length} canciones`:'No (música del juego)'):'Sin canciones cargadas'};
  OP_ROWS.forEach((r,i)=>{const y=100+i*23.4,on=i===OP.sel;if(on)rr(W/2-310,y-12,620,24,8,'rgba(217,164,65,.5)',2);btxt(lab[r],W/2-290,y,17,C.ink,'left',on?800:600);
    if(r==='music')bar(W/2+90,y,cfg.music);else if(r==='sfx')bar(W/2+90,y,cfg.sfx);else if(val[r])btxt('◀ '+val[r]+' ▶',W/2+290,y,17,C.rust,'right',800);});
  if(OP.back==='level')btxt('Los cambios de jugadores y personaje se aplican en el siguiente nivel.',W/2,478,14,C.ink,'center',700);
  else btxt('Tus canciones se quedan solo en este navegador · ↑ ↓ elegir · ← → cambiar · Esc volver',W/2,478,13,C.ink,'center',700);}
const MA={sel:0,top:0,prev:null};
function updMMAssign(dt,IN){const I=IN.M,sl=mmSlots(),n=sl.length,nf=MyMusic.files.length;if(I.up){MA.sel=(MA.sel+n-1)%n;sfx('move');}if(I.down){MA.sel=(MA.sel+1)%n;sfx('move');}
  if(MA.sel<MA.top)MA.top=MA.sel;if(MA.sel>MA.top+10)MA.top=MA.sel-10;const k=sl[MA.sel];
  if(I.left||I.right){const cur=mmFileFor(k);cfg.myMap=cfg.myMap||{};cfg.myMap[k]=((cur+1+(I.right?1:-1))%(nf+1)+nf+1)%(nf+1)-1;saveCfg();sfx('move');if(cfg.myMusic)Music.play(k);}
  if(I.ok){cfg.myMusic=true;saveCfg();Music.play(k);sfx('select');}
  if(I.no||I.pause){scene='options';if(MA.prev)Music.play(MA.prev);}}
function drawMMAssign(){ctx.fillStyle='#2b1d14';ctx.fillRect(0,0,W,H);card(W/2-360,20,720,500);txt('MI MÚSICA',W/2,54,32,C.brass);const sl=mmSlots();
  for(let i=0;i<11&&MA.top+i<sl.length;i++){const j=MA.top+i,k=sl[j],y=96+i*34,on=j===MA.sel,fi=mmFileFor(k);if(on)rr(W/2-340,y-14,680,28,8,'rgba(217,164,65,.5)',2);
    btxt(mmSlotLabel(k),W/2-325,y,16,C.ink,'left',on?800:600);let nm=fi<0?'Música original del juego':MyMusic.files[fi].name;if(nm.length>40)nm=nm.slice(0,39)+'…';btxt((on?'◀ ':'')+nm+(on?' ▶':''),W/2+330,y,15,fi<0?C.ink:C.rust,'right',800);}
  btxt(`${MA.sel+1} / ${sl.length}`,W/2+330,482,13,C.ink,'right',700);btxt('↑ ↓ elegir nivel · ← → cambiar canción · Enter escuchar · Esc volver',W/2-330,482,13,C.ink,'left',700);}
const CT={sel:0,prof:'solo',wait:false};const CT_PROFS=PROFS,CT_NAME={solo:'1 jugador',p1:'2J · J1',p2:'2J · J2',t1:'3J · J1',t2:'3J · J2',t3:'3J · J3'};
function updControls(dt,IN){if(CT.wait)return;const I=IN.M,n=ACTS.length+2;if(I.up){CT.sel=(CT.sel+n-1)%n;sfx('move');}if(I.down){CT.sel=(CT.sel+1)%n;sfx('move');}
  if(I.left||I.right){const k=CT_PROFS.indexOf(CT.prof);CT.prof=CT_PROFS[(k+(I.right?1:5))%6];sfx('move');}
  if(I.pause){scene='options';sfx('select');return;}
  if(I.ok){if(CT.sel<ACTS.length){const a=ACTS[CT.sel],pr=CT.prof;CT.wait=true;sfx('select');capture=code=>{CT.wait=false;if(code==='Escape'||code==='Enter'||code==='KeyP'){sfx('deny');return;}const old=cfg.keys[pr][a][0],grp=pr[0]==='t'?['t1','t2','t3']:pr[0]==='p'?['p1','p2']:['solo'];
      for(const g of grp)for(const b of ACTS){if(g===pr&&b===a)continue;const ks=cfg.keys[g][b],ix=ks.indexOf(code);if(ix>=0){ks.splice(ix,1);if(!ks.length)ks.push(old);}}
      cfg.keys[pr][a]=[code];saveCfg();updateLegend();sfx('buy');};}
    else if(CT.sel===ACTS.length){cfg.keys[CT.prof]=JSON.parse(JSON.stringify(DEF_KEYS[CT.prof]));saveCfg();updateLegend();sfx('buy');}else scene='options';}}
function drawControls(){ctx.fillStyle='#2b1d14';ctx.fillRect(0,0,W,H);card(W/2-340,20,680,500);txt('CONTROLES',W/2,56,34,C.brass);
  CT_PROFS.forEach((p,i)=>{const on=p===CT.prof;rr(W/2-318+i*106,80,100,30,8,on?C.brass:'rgba(20,13,8,.12)',2);btxt(CT_NAME[p],W/2-268+i*106,95,14,C.ink,'center',800);});
  ACTS.forEach((a,i)=>{const y=134+i*30,on=i===CT.sel;if(on)rr(W/2-310,y-13,620,26,6,'rgba(217,164,65,.5)',0);btxt(ACT_NAME[a],W/2-290,y,16,C.ink,'left',on?800:600);
    btxt(on&&CT.wait?'Pulsa una tecla… (Esc cancela)':cfg.keys[CT.prof][a].map(keyLabel).join(' · '),W/2+290,y,16,on&&CT.wait?C.rust:C.ink,'right',800);});
  const y1=134+ACTS.length*30;[['Restablecer teclas',ACTS.length],['Volver',ACTS.length+1]].forEach(([s,i],k)=>{const on=CT.sel===i,y=y1+k*30;if(on)rr(W/2-310,y-13,620,26,6,'rgba(217,164,65,.5)',0);btxt(s,W/2-290,y,16,C.ink,'left',on?800:600);});
  btxt('← → perfil · ↑ ↓ acción · Enter cambiar tecla · Mando: A saltar, X disparar, B EX, RB dash, Y cambiar, LB fijar',W/2,500,13,C.ink,'center',700);}
const CR={t:0};
function updCredits(dt,IN){CR.t+=dt;if(IN.M.ok||IN.M.no)scene='title';}
function drawCredits(){ctx.fillStyle='#1a120c';ctx.fillRect(0,0,W,H);
  const L=[['CHISPA Y CERILLA',32,C.paper,1],['contra el Rey Apagón',28,C.paper,1],['',20],['Un homenaje a los dibujos animados de los años 30',20],['Personajes, jefes y efectos de sonido originales',20],['',20],['Estatua de la Isla de Hojalata:',20],['en honor a Rodrigo Reátegui',20,C.gold],['',20],
    ['MÚSICA',28,C.brass,1],['Kevin MacLeod (incompetech.com)',20,C.gold],['Licencia Creative Commons: Atribución 4.0',16],['creativecommons.org/licenses/by/4.0',16],['Convertidas a mono para que carguen rápido',14],['',16]];
  const all=[...Object.keys(PACK).map(k=>PACK[k]),...Object.values(PACK_FINAL)],seen=new Set();for(const k of all.filter(k=>k[2]!=='pd')){const t=k[1];if(seen.has(t))continue;seen.add(t);L.push(['"'+t+'" · Kevin MacLeod',16]);}
  L.push(['',16],['JEFES: DISCOS DE JAZZ DE 1918 A 1925',22,C.brass,1],['Grabaciones de dominio público (Internet Archive, Great 78 Project)',14],['',12]);for(const k of all.filter(k=>k[2]==='pd')){if(seen.has(k[1]))continue;seen.add(k[1]);L.push([k[1],15]);}
  L.push(['',20],['Efectos de sonido grabados: Kenney (kenney.nl), CC0',16],['La música sintetizada alternativa es original del juego',16],['',20],['Gracias por jugar',24,C.gold,1]);
  let y=0;const pos=L.map(l=>{const yy=y;y+=l[1]*1.9;return yy;}),tot=y+H+60,off=CR.t*45%tot;
  L.forEach((l,i)=>{const yy=H+40+pos[i]-off;if(yy<-40||yy>H+40||!l[0])return;txt(l[0],W/2,yy,l[1],l[2]||C.paper,l[3]?C.ink:null);});btxt('Aceptar: volver',W/2,H-20,14,C.muted||C.paper,'center');}
const ST={pages:[],i:0,t:0,kind:'intro'};
const STORIES={
  intro:[{t:'En el archipiélago de Hojalata todo funcionaba a cuerda y a chispazos. Las farolas cantaban y los relojes bailaban.',d:'islas'},
    {t:'Hasta que el Rey Apagón juró dejar el mundo a oscuras y repartió su sombra entre los cacharros más gruñones de cada isla.',d:'rey'},
    {t:'Chispa, la bombilla, Cerilla, el fósforo, y Velita, la vela, son los encargados de la luz. Isla por isla y jefe por jefe, van a recuperarla.',d:'heroes'}],
  ending:[{t:'Con un último chispazo, el Rey Apagón se fundió como una bombilla vieja. Las sombras volvieron a ser simples sombras.',d:'rey'},
    {t:'Las farolas cantaron otra vez, los relojes bailaron y todas las islas se encendieron a la vez.',d:'islas'},
    {t:'Chispa y Cerilla volvieron a casa. Pero si te quedan jefes por vencer o grados A+ por conseguir… la isla te espera. ¡FIN!',d:'heroes'}]};
function startStory(k){scene='story';ST.kind=k;ST.pages=STORIES[k];ST.i=0;ST.t=0;Music.play(k==='ending'?'ending':'title');}
function updStory(dt,IN){ST.t+=dt;if(IN.M.ok){if(ST.t*40<ST.pages[ST.i].t.length){ST.t=99;return;}ST.i++;ST.t=0;sfx('card');
  if(ST.i>=ST.pages.length){if(ST.kind==='intro'){save.intro=true;persist();transition(()=>{MAPS.banner={t:3,text:curWorld().name};toMap();});}else transition(()=>{scene='credits';CR.t=0;Music.play('ending');});ST.i=ST.pages.length-1;}}}
function drawStory(){const p=ST.pages[ST.i];ctx.fillStyle='#e9d9b4';ctx.fillRect(0,0,W,H);rr(60,30,840,330,6,'#f4e7c6',5);ctx.save();ctx.beginPath();ctx.rect(62,32,836,326);ctx.clip();
  if(p.d==='islas'){const k=836/1400;ctx.drawImage(mapBG(1),400,300,1400,700,62,32,836,420);ctx.save();ctx.translate(62-400*k,32-300*k);ctx.scale(k,k);
    for(const n of [...WORLDS[1].nodes].sort((a,b)=>a.y-b.y)){if(n.bld)drawBld(Object.assign({},n,{em:null,id:'_'}),ST.t,ST.kind==='intro'&&ST.i===0?false:false);else if(n.kind==='statue')drawStatue(n.x,n.y,ST.t);}ctx.restore();}
  else if(p.d==='rey'){ctx.fillStyle='#2a2140';ctx.fillRect(62,32,836,326);const B={x:480,y:520,t:ST.t,phase:3,mouth:.5,dead:ST.kind==='ending',flash:0,anim:0,squash:0,act:null};LEVELS.apagon.draw(B,{t:ST.t,Ps:[{x:200,y:300,dead:false,type:'plat',duck:false}]});}
  else{ctx.fillStyle='#d9c39a';ctx.fillRect(62,32,836,326);drawHero({x:400,y:320,char:'chispa',face:1,anim:ST.t*6,run:true,scale:1.6,aimX:1,aimY:-.3,flash:true});drawHero({x:560,y:320,char:'cerilla',face:1,anim:ST.t*6+1,run:true,scale:1.6,aimX:1,aimY:-.3,flash:true});drawHero({x:700,y:320,char:'velita',face:1,anim:ST.t*6+2,run:true,scale:1.6,aimX:1,aimY:-.3,flash:true});}
  ctx.restore();wrap(p.t.slice(0,Math.floor(ST.t*40)),90,404,780,30,21,C.ink,700);btxt(`${ST.i+1}/${ST.pages.length} · Aceptar para seguir`,W-70,H-24,14,C.rustD,'right',800);}

/* ---------- transitions & loop ---------- */
let TR=null;
/* ---------- achievements screen, secrets ---------- */
const LG={sel:0,back:'title',t:0};
function openLogros(back){LG.back=back;LG.sel=0;LG.t=0;scene='logros';sfx('card');}
function updLogros(dt,IN){const I=IN.M,n=ACH.length,cols=3;LG.t+=dt;if(I.left){LG.sel=(LG.sel+n-1)%n;sfx('move');}if(I.right){LG.sel=(LG.sel+1)%n;sfx('move');}
  if(I.up&&LG.sel>=cols){LG.sel-=cols;sfx('move');}if(I.down&&LG.sel+cols<n){LG.sel+=cols;sfx('move');}if(I.no||I.pause||I.ok){sfx('back');scene=LG.back==='map'?'map':'title';}}
function drawLogros(){ctx.fillStyle='#2b1d14';ctx.fillRect(0,0,W,H);const got=ACH.filter(([id])=>save.ach&&save.ach[id]).length;
  txt('LOGROS',W/2,30,32,C.brass,C.ink);btxt(`${got} de ${ACH.length} conseguidos · cada logro te regala monedas`,W/2,56,14,C.paper,'center',800);
  const rows=Math.ceil(ACH.length/3),vis=9,sr=Math.floor(LG.sel/3);LG.sc=clamp(LG.sc||0,sr-vis+1,sr);LG.sc=clamp(LG.sc,0,Math.max(0,rows-vis));
  if(LG.sc>0)txt('▲',W-30,56,16,C.brass,C.ink);if(LG.sc<rows-vis)txt('▼',W-30,H-56,16,C.brass,C.ink);
  ACH.forEach(([id,name,desc,coins],i)=>{const c=i%3,r=Math.floor(i/3)-LG.sc;if(r<0||r>=vis)return;const x=24+c*308,y=70+r*46,on=save.ach&&save.ach[id],sel=i===LG.sel;
    rr(x,y,296,40,6,on?C.paper:'#5a4636',sel?4:2.5);if(sel){ctx.save();ctx.globalAlpha=.35;rr(x,y,296,40,6,C.brass,0);ctx.restore();}
    ctx.save();star(x+22,y+20,13,6,5,on?LG.t:0);ctx.fillStyle=on?C.gold:'#7a6650';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();
    btxt(on||sel?name:'???',x+42,y+15,14,on?C.ink:C.paper,'left',900);if(!on&&!sel)btxt('Aún bloqueado',x+42,y+31,11,'#bfa98a','left',700);else btxt('+'+coins+' moneda'+(coins>1?'s':''),x+42,y+31,11,on?C.rust:'#e9c27a','left',800);});
  const a=ACH[LG.sel];card(24,H-44,W-48,36,'#f6ecd4',2.5,6);btxt(a[1]+': '+a[2],W/2,H-25,14,C.ink,'center',800);}
const CODE=['up','up','down','down','left','right','left','right'];
function titleCode(I){TI.code=TI.code||[];for(const k of['up','down','left','right'])if(I[k])TI.code.push(k);if(TI.code.length>8)TI.code=TI.code.slice(-8);
  if(TI.code.length===8&&TI.code.every((k,i)=>k===CODE[i])){TI.code=[];cfg.cine=true;saveCfg();syncSecrets();unlockAch('codigo');sfx('secret');TI.msg='¡SECRETO! Skin Cine Mudo desbloqueada';TI.msgT=3;}}
function syncSecrets(){if(cfg.cine&&!save.owned.includes('skin_cine')){save.owned.push('skin_cine');persist();}}
function checkExplorer(){let all=true;for(const k of[1,2,3]){const w=WORLDS[k];for(const c of w.coins)if(!save.taken[c.id])all=false;for(const n of w.nodes)if(n.coin&&!save.taken[n.coin])all=false;}if(all)unlockAch('explorador');}

function transition(fn){if(TR)return;TR={t:0,dur:.9,fn,done:false};sfx('trans');}
function autoPause(){if(scene==='level'&&LV&&LV.state==='play'){LV.state='pause';LV.menu=0;}}
const GRAIN=[0,1,2].map(()=>{const c=document.createElement('canvas');c.width=c.height=180;const x=c.getContext('2d'),d=x.createImageData(180,180);
  for(let i=0;i<d.data.length;i+=4){const v=rand()<.5?20:250;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=rand()*70;}x.putImageData(d,0,0);return ctx.createPattern(c,'repeat');});
const VIG=(()=>{const [c,v]=mk(W,H);const g=v.createRadialGradient(W/2,H/2,H*.32,W/2,H/2,H*.98);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(35,18,6,.7)');v.fillStyle=g;v.fillRect(0,0,W,H);return c;})();
function filmLayer(t){ctx.drawImage(VIG,0,0,W,H);if(!cfg.grain)return;ctx.save();ctx.globalAlpha=REDUCE?.08:.14;ctx.fillStyle=GRAIN[Math.floor(t*24)%3];
  const ox=REDUCE?0:Math.floor(rand()*180),oy=REDUCE?0:Math.floor(rand()*180);ctx.translate(-ox,-oy);ctx.fillRect(0,0,W+180,H+180);ctx.restore();
  if(!REDUCE&&rand()<.25){ctx.strokeStyle='rgba(30,18,8,.35)';ctx.lineWidth=1;const sx=rand()*W;ctx.beginPath();ctx.moveTo(sx,0);ctx.lineTo(sx+(rand()-.5)*10,H);ctx.stroke();}
  ctx.fillStyle=`rgba(80,45,10,${REDUCE?.04:.03+rand()*.035})`;ctx.fillRect(0,0,W,H);}
let last=performance.now(),clock=0;const NOIN={P:[{h:{},p:{}},{h:{},p:{}}],M:{},MH:{}};
function step(dt){clock+=dt;const raw=readInputs(),IN=TR?NOIN:raw;save.time=(save.time||0)+dt;
  if(TR){TR.t+=dt;if(!TR.done&&TR.t>=TR.dur/2){TR.done=true;TR.fn();}if(TR.t>=TR.dur)TR=null;}
  if(scene==='title')updTitle(dt,IN);else if(scene==='slots')updSlots(dt,IN);else if(scene==='map')updMap(dt,IN);else if(scene==='shop')updShop(dt,IN);
  else if(scene==='level'&&LV)levelUpdate(LV,dt,IN);else if(scene==='equip')updEquip(dt,IN);else if(scene==='mmassign')updMMAssign(dt,IN);else if(scene==='options')updOptions(dt,IN);else if(scene==='controls')updControls(dt,IN);
  else if(scene==='story')updStory(dt,IN);else if(scene==='credits')updCredits(dt,IN);else if(scene==='logros')updLogros(dt,IN);
  if(ACHQ.length)ACHQ[0].t+=dt;}
function render(){ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);
  if(scene==='title')drawTitle();else if(scene==='slots')drawSlots();else if(scene==='map')drawMap();else if(scene==='shop')drawShop();else if(scene==='level'&&LV)drawLevel(LV);
  else if(scene==='equip')drawEquip();else if(scene==='mmassign')drawMMAssign();else if(scene==='options')drawOptions();else if(scene==='controls')drawControls();else if(scene==='story')drawStory();else if(scene==='credits')drawCredits();else if(scene==='logros')drawLogros();
  drawAchToast();filmLayer(clock);if(TR){const h=TR.dur/2,k=TR.t<h?1-TR.t/h:(TR.t-h)/h,r=Math.max(0,k)*620;ctx.fillStyle=C.ink;ctx.beginPath();ctx.rect(0,0,W,H);ctx.arc(W/2,H/2,r,0,TAU,true);ctx.fill('evenodd');}
  if(muted)txt('SIN SONIDO (M)',W-20,H-16,12,C.paper,C.ink,'right');}
function frame(now){const dt=Math.min(.033,(now-last)/1000);last=now;try{step(dt);render();}catch(err){console.error(err);}requestAnimationFrame(frame);}
updateLegend();Music.play('title');requestAnimationFrame(frame);
window.__game={get SH(){return SH;},SKINS,unlockAch,get ACHQ(){return ACHQ;},TI,SH,EQ,LG,step,render,get scene(){return scene;},set scene(v){scene=v;},get LV(){return LV;},startLevel,MAPS,get save(){return save;},keysDown,pulse,openShop,toMap,WORLDS,walkable,LEVELS,ALL_LEVELS,cfg,placeOnMap,startStory,setSave:s=>{save=s;}};
