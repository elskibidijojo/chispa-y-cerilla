'use strict';
/* ================= RUN & GUN LEVELS (6) ================= */
const RUN_THEMES={
  feria:{sky:['#eedcae','#d2ad72'],far:'feria',mid:'#8f6b3a',ground:C.wood,trim:[C.rust,C.paper],walker:'raton',flyer:'pajaro',turret:'canon',popper:'caja',hopper:'conejo',ammo:'ball',egg:'egg',plank:C.woodL},
  fabrica:{sky:['#ddd2b6','#b9a37a'],far:'fabrica',mid:'#6f5a40',ground:'#6f685b',trim:[C.brass,C.ink],walker:'soldadito',flyer:'avioncito',turret:'canon',popper:'caja',hopper:'soldadito',ammo:'ball',egg:'nut',plank:C.steel},
  muelle:{sky:['#dfe6d8','#bcd0c4'],far:'mar',mid:'#5b8580',ground:C.woodL,trim:[C.white,C.rust],walker:'cangrejito',flyer:'gaviota',turret:'coral',popper:'pulpito',hopper:'cangrejito',ammo:'bubble',egg:'drop',plank:C.woodL},
  setas:{sky:['#e6dfc2','#a6ae64'],far:'setas',mid:'#6f7a45',ground:'#6b4a3a',trim:[C.rust,C.paper],walker:'caracol',flyer:'polilla',turret:'setita',popper:'topo',hopper:'conejo',ammo:'jam',egg:'jam',plank:'#c79a5e'},
  feria_noche:{sky:['#1f1b38','#4b4170'],far:'feria_noche',mid:'#2a2238',ground:'#3a3050',trim:[C.plum,C.gold],walker:'calabacita',flyer:'murcielago',turret:'farol',popper:'fantasmita',hopper:'calabacita',ammo:'orb',egg:'orb',plank:'#5a4a7a'},
  nubes:{sky:['#bfd8e0','#f2e3c2'],far:'cielo',mid:'#d9e6ea',ground:'#ece6d6',trim:['#9cc3d2',C.paper],walker:'soldadito',flyer:'nube',turret:'canon',popper:'caja',hopper:'conejo',ammo:'ball',egg:'drop',plank:'#f6f1e4',cloud:true},
  mina:{sky:['#2a2026','#5a4030'],far:'mina',mid:'#4a3a2e',ground:'#5a4636',trim:['#3a2a20',C.brass],walker:'raton',flyer:'murcielago',turret:'farol',popper:'topo',hopper:'gusano',ammo:'flame',egg:'nut',plank:'#8a6a40',cave:true},
  torre:{sky:['#1a1426','#3a2f55'],far:'castillo',mid:'#2a2238',ground:'#3a3036',trim:[C.ink,C.plum],walker:'sombra',flyer:'murcielago',turret:'velita',popper:'fantasmita',hopper:'fantasmita',ammo:'flame',egg:'orb',plank:'#5a5450'}};
const CHUNKS={
  start:{w:600,f(B){B.ground(0,600);}},
  flat:{w:700,f(B,c){B.ground(0,700);B.walker(320);B.walker(560);if(c){B.plat(300,330,140);B.coin(370,290);}}},
  pit:{w:520,f(B,c){B.ground(0,200);B.ground(330,520);B.walker(440);if(c)B.coin(265,250);}},
  pitParry:{w:720,f(B,c){B.ground(0,200);B.ground(480,720);B.pstar(290,340);B.pstar(390,290);if(c)B.coin(340,190);}},
  stairs:{w:820,f(B,c){B.ground(0,820);B.plat(150,350,160);B.plat(380,270,160);B.plat(600,190,150);B.turret(470,270);B.walker(720);if(c)B.coin(675,150);}},
  turret:{w:640,f(B,c){B.ground(0,640);B.turret(440);B.walker(250);B.popper(560);if(c){B.plat(330,300,110);B.coin(385,262);}}},
  spring:{w:760,f(B,c){B.ground(0,260);B.spring(200);B.ground(520,760);B.walker(660);if(c)B.coin(390,130);}},
  mover:{w:820,f(B,c){B.ground(0,150);B.mover(200,360,140,170,0,1.2);B.ground(670,820);B.flyers(0,1);if(c)B.coin(400,270);}},
  lift:{w:720,f(B,c){B.ground(0,720);B.plat(420,210,240);B.mover(250,300,110,0,110,1.4);B.popper(130);B.walker(640);if(c)B.coin(560,170);}},
  gauntlet:{w:900,f(B,c){B.ground(0,900);B.walker(250);B.walker(450);B.walker(650);B.popper(350);B.popper(780);B.flyers(100,2);if(c){B.plat(500,320,140);B.coin(570,280);}}},
  hopperField:{w:760,f(B,c){B.ground(0,760);B.hopper(300);B.hopper(540);B.plat(380,320,160);B.turret(700);if(c)B.coin(460,280);}},
  skyway:{w:920,f(B,c){B.ground(0,150);B.plat(220,360,120);B.plat(420,300,120);B.pstar(600,290);B.plat(660,340,120);B.ground(810,920);B.flyers(150,2);if(c)B.coin(480,250);}},
  fortress:{w:820,f(B,c){B.ground(0,820);B.turret(300);B.plat(450,320,170);B.turret(535,320);B.walker(720);B.popper(160);if(c){B.plat(120,340,110);B.coin(175,300);}}},
  ambush:{w:900,f(B,c){B.ground(0,900);B.flyers(0,3);B.hopper(380);B.hopper(600);B.popper(760);B.walker(850);if(c){B.plat(430,330,120);B.coin(490,290);}}},
  crumbleBridge:{w:660,f(B,c){B.ground(0,130);B.cplat(165,385,90);B.cplat(290,345,90);B.cplat(415,385,90);B.ground(540,660);B.flyers(100,1);if(c)B.coin(335,300);}},
  jets:{w:760,f(B,c){B.ground(0,760);B.jet(230);B.jet(470);B.walker(640);B.plat(330,320,120);if(c)B.coin(390,280);}},
  cloudHop:{w:860,f(B,c){B.ground(0,140);B.plat(200,370,100);B.mover(360,320,100,0,60,1.6);B.plat(540,280,100);B.pstar(640,240);B.plat(680,340,100);B.ground(780,860);B.flyers(200,2);if(c)B.coin(590,230);}},
  cartRide:{w:900,f(B,c){B.ground(0,170);B.mover(170,380,130,180,0,.9);B.cplat(560,330,80);B.ground(700,900);B.walker(820);B.flyers(300,1);if(c)B.coin(420,290);}},
  end:{w:640,f(B){B.ground(0,640);}}};
function defRun(o){LEVELS[o.id]=Object.assign({kind:'run',create:()=>buildRun(o)},o);}
defRun({id:'feria',name:'Feria de Hojalata',sub:'Nivel · Corre y dispara',isl:1,par:150,song:'run1',theme:'feria',
  chunks:[['start'],['flat',1],['pit'],['stairs',1],['turret'],['pitParry',1],['gauntlet'],['spring',1],['flat'],['lift',1],['ambush'],['skyway'],['fortress'],['crumbleBridge'],['jets'],['end']]});
defRun({id:'fabrica',name:'Fábrica de Juguetes',sub:'Nivel · Corre y dispara',isl:1,par:160,song:'run2',theme:'fabrica',
  chunks:[['start'],['turret'],['mover',1],['stairs'],['gauntlet',1],['spring'],['pitParry',1],['lift'],['hopperField',1],['mover'],['flat',1],['fortress'],['skyway'],['ambush'],['crumbleBridge'],['jets'],['end']]});
defRun({id:'muelle',name:'Muelle de la Bruma',sub:'Nivel · Corre y dispara',isl:2,par:165,song:'run2',theme:'muelle',
  chunks:[['start'],['pit'],['mover',1],['flat'],['pitParry',1],['turret'],['spring',1],['mover'],['gauntlet',1],['pit'],['stairs',1],['skyway'],['ambush'],['fortress'],['crumbleBridge'],['jets'],['end']]});
defRun({id:'setas',name:'Bosque de Setas',sub:'Nivel · Corre y dispara',isl:2,par:165,song:'run1',theme:'setas',
  chunks:[['start'],['spring',1],['hopperField'],['stairs',1],['pitParry'],['lift',1],['turret'],['spring'],['gauntlet',1],['mover',1],['ambush'],['fortress'],['skyway'],['crumbleBridge'],['jets'],['end']]});
defRun({id:'feria_noche',name:'Feria Nocturna',sub:'Nivel · Corre y dispara',isl:3,par:170,song:'run3',theme:'feria_noche',
  chunks:[['start'],['flat'],['pitParry',1],['mover'],['turret',1],['gauntlet'],['lift',1],['spring'],['stairs',1],['pitParry'],['hopperField',1],['skyway'],['fortress'],['ambush'],['skyway'],['crumbleBridge'],['jets'],['end']]});
defRun({id:'torre',name:'Torre de las Sombras',sub:'Nivel · Corre y dispara',isl:3,par:175,song:'run3',theme:'torre',
  chunks:[['start'],['pit'],['mover',1],['pitParry'],['spring',1],['gauntlet'],['lift',1],['mover'],['pitParry',1],['stairs'],['turret',1],['fortress'],['skyway'],['ambush'],['skyway'],['crumbleBridge'],['jets'],['end']]});
defRun({id:'nubes',name:'Paseo en las Nubes',sub:'Nivel · Corre y dispara',isl:2,par:170,song:'nubes',theme:'nubes',
  chunks:[['start'],['cloudHop',1],['flat'],['skyway',1],['spring'],['mover',1],['cloudHop'],['gauntlet',1],['pitParry'],['crumbleBridge',1],['ambush'],['skyway'],['jets'],['end']]});
defRun({id:'mina',name:'Mina de Carbón',sub:'Nivel · Corre y dispara',isl:3,par:175,song:'mina',theme:'mina',
  chunks:[['start'],['cartRide',1],['turret'],['pit'],['stairs',1],['cartRide'],['hopperField',1],['jets'],['fortress',1],['pitParry'],['cartRide',1],['ambush'],['crumbleBridge'],['gauntlet'],['end']]});

let RUNBG={k:null};
function runLayers(k){if(RUNBG.k===k)return RUNBG;const th=RUN_THEMES[k];
  const [sk,s]=mk(W,H);const gr=s.createLinearGradient(0,0,0,H);gr.addColorStop(0,th.sky[0]);gr.addColorStop(1,th.sky[1]);s.fillStyle=gr;s.fillRect(0,0,W,H);
  const night=k==='feria_noche'||k==='torre'||k==='mina';if(k==='mina'){s.fillStyle='rgba(20,13,8,.35)';for(let i=0;i<40;i++){s.beginPath();s.arc((i*97)%W,(i*53)%220,3+(i%4)*3,0,TAU);s.fill();}}else if(night)starsG(s,70,k.length);else{s.beginPath();s.arc(780,120,52,0,TAU);s.fillStyle='#f6e7b9';s.fill();s.lineWidth=4;s.strokeStyle=C.ink;s.stroke();cloudShape(s,90,90,.8);cloudShape(s,420,60,.6);}
  const [fc,g]=mk(1200,H);g.lineWidth=3;g.strokeStyle='rgba(20,13,8,.75)';const sil=night?'#3a3050':'#c4a06a';
  const tent=(tx,tw)=>{g.beginPath();g.moveTo(tx-tw/2,GROUND-50);g.lineTo(tx,GROUND-50-tw*.9);g.lineTo(tx+tw/2,GROUND-50);g.closePath();g.fillStyle=sil;g.fill();g.stroke();};
  if(th.far==='feria'||th.far==='feria_noche'){const fx=330,fy=210;g.beginPath();g.moveTo(fx-70,GROUND-60);g.lineTo(fx,fy);g.lineTo(fx+70,GROUND-60);g.stroke();g.beginPath();g.arc(fx,fy,120,0,TAU);g.stroke();
    for(let i=0;i<12;i++){const a=i*TAU/12;g.beginPath();g.moveTo(fx,fy);g.lineTo(fx+Math.cos(a)*120,fy+Math.sin(a)*120);g.stroke();g.beginPath();g.arc(fx+Math.cos(a)*120,fy+Math.sin(a)*120+10,9,0,TAU);g.fillStyle=night?(i%2?'#ffd36a':'#5a4a7a'):'#b8935a';g.fill();g.stroke();}
    tent(640,120);tent(860,90);tent(1060,140);tent(80,100);}
  else if(th.far==='fabrica'){for(const [x,h] of[[80,240],[200,300],[520,260],[900,320],[1080,220]]){g.fillStyle=sil;g.fillRect(x-24,GROUND-50-h,48,h);g.strokeRect(x-24,GROUND-50-h,48,h);for(let i=0;i<3;i++){g.beginPath();g.arc(x+i*18,GROUND-70-h-i*26,14+i*4,0,TAU);g.fillStyle='rgba(239,224,191,.6)';g.fill();}}
    for(const [x,y,r] of[[350,230,70],[700,280,90]]){g.beginPath();for(let i=0;i<24;i++){const a=i*Math.PI/12,rr2=i%2?r-12:r;g.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2);}g.closePath();g.fillStyle=sil;g.fill();g.stroke();}}
  else if(th.far==='mar'){g.fillStyle='#7aa39e';g.fillRect(0,GROUND-120,1200,80);for(const x of[150,600,950]){g.beginPath();g.moveTo(x-60,GROUND-110);g.lineTo(x+60,GROUND-110);g.lineTo(x+40,GROUND-90);g.lineTo(x-40,GROUND-90);g.closePath();g.fillStyle=sil;g.fill();g.stroke();
    g.beginPath();g.moveTo(x,GROUND-110);g.lineTo(x,GROUND-200);g.stroke();g.beginPath();g.moveTo(x,GROUND-200);g.lineTo(x+40,GROUND-120);g.lineTo(x,GROUND-120);g.closePath();g.fillStyle=C.paper;g.fill();g.stroke();}
    g.fillStyle=sil;g.fillRect(780,GROUND-260,40,150);g.strokeRect(780,GROUND-260,40,150);}
  else if(th.far==='setas'){for(const [x,h,r] of[[100,200,90],[380,260,120],[700,180,80],[980,240,110]]){g.fillStyle='#e6dcc0';g.fillRect(x-14,GROUND-50-h,28,h);g.strokeRect(x-14,GROUND-50-h,28,h);
    g.beginPath();g.ellipse(x,GROUND-50-h,r,r*.5,0,Math.PI,0);g.closePath();g.fillStyle='#c4704a';g.fill();g.stroke();for(let i=0;i<3;i++){g.beginPath();g.arc(x-r*.4+i*r*.4,GROUND-50-h-r*.25,8,0,TAU);g.fillStyle=C.paper;g.fill();}}}
  else if(th.far==='cielo'){for(const [x,y,sc] of[[120,260,1.3],[420,180,1],[700,300,1.5],[1000,210,1.1]])cloudShape(g,x,y,sc);
    for(const [x,y] of[[300,120],[880,90]]){g.beginPath();g.arc(x,y,34,0,TAU);g.fillStyle=C.rust;g.fill();g.stroke();g.beginPath();g.moveTo(x-26,y+18);g.lineTo(x-12,y+60);g.lineTo(x+12,y+60);g.lineTo(x+26,y+18);g.stroke();
      g.fillStyle=C.woodL;g.fillRect(x-14,y+60,28,18);g.strokeRect(x-14,y+60,28,18);for(let i=-1;i<=1;i++){g.beginPath();g.moveTo(x+i*12,y-34);g.quadraticCurveTo(x+i*30,y,x+i*12,y+30);g.strokeStyle='rgba(20,13,8,.4)';g.stroke();g.strokeStyle='rgba(20,13,8,.75)';}}}
  else if(th.far==='mina'){g.fillStyle='#3a2c24';for(let x=0;x<1200;x+=60){g.beginPath();g.moveTo(x,0);g.lineTo(x+30,40+((x*7)%60));g.lineTo(x+60,0);g.closePath();g.fill();g.stroke();}
    for(const x of[100,400,700,1000]){g.fillStyle='#5a4030';g.fillRect(x-60,GROUND-230,14,180);g.fillRect(x+46,GROUND-230,14,180);g.fillRect(x-66,GROUND-240,132,16);g.strokeRect(x-60,GROUND-230,14,180);g.strokeRect(x+46,GROUND-230,14,180);g.strokeRect(x-66,GROUND-240,132,16);
      g.beginPath();g.arc(x,GROUND-200,10,0,TAU);g.fillStyle='#ffd36a';g.fill();g.stroke();const gl=g.createRadialGradient(x,GROUND-200,4,x,GROUND-200,80);gl.addColorStop(0,'rgba(255,210,110,.35)');gl.addColorStop(1,'rgba(255,210,110,0)');g.fillStyle=gl;g.fillRect(x-80,GROUND-280,160,160);}
    for(const [x,y] of[[260,330],[560,300],[860,340]]){for(let i=0;i<4;i++){g.beginPath();g.arc(x+i*14-20,y-(i%2)*10,10,0,TAU);g.fillStyle='#2b2420';g.fill();g.stroke();}}
    g.strokeStyle='rgba(20,13,8,.75)';}
  else{for(const [x,h] of[[120,260],[300,340],[620,300],[900,360],[1100,240]]){g.fillStyle=sil;g.fillRect(x-40,GROUND-50-h,80,h);g.strokeRect(x-40,GROUND-50-h,80,h);for(let i=0;i<4;i++)g.fillRect(x-40+i*24,GROUND-62-h,14,12);
    g.fillStyle='#ffd36a';g.fillRect(x-8,GROUND-h,16,22);}}
  g.fillStyle=k==='mina'?'#3a2c24':th.far==='cielo'?'#cfe0e6':night?'#2a2238':'#b48a52';g.fillRect(0,GROUND-52,1200,60);g.beginPath();g.moveTo(0,GROUND-52);g.lineTo(1200,GROUND-52);g.stroke();
  const [mc,m]=mk(1000,H);m.beginPath();m.moveTo(0,H);for(let x=0;x<=1000;x+=10)m.lineTo(x,GROUND-34-Math.sin(x*TAU/1000)*18-Math.sin(x*TAU/500)*8);m.lineTo(1000,H);m.closePath();m.fillStyle=th.mid;m.fill();m.lineWidth=3.5;m.strokeStyle=C.ink;m.stroke();
  m.lineWidth=2.5;for(let x=10;x<1000;x+=26){const y=GROUND-34-Math.sin(x*TAU/1000)*18-Math.sin(x*TAU/500)*8;m.beginPath();m.moveTo(x,y+4);m.lineTo(x,y-14);m.stroke();}
  RUNBG={k,sky:sk,far:fc,mid:mc};return RUNBG;}
function buildRun(def){const L=baseLevel(def.id),th=RUN_THEMES[def.theme],G=GROUND;L.theme=th;let x=0;
  const cplats=[],jets=[],ground=[],plats=[],ens=[],coins=[],pstars=[],springs=[],spawns=[],movers=[];
  const B={ground:(a,b)=>ground.push([x+a,x+b]),plat:(a,y,w)=>plats.push([x+a,y,w]),mover:(a,y,w,ax,ay,sp)=>movers.push([x+a,y,w,ax,ay,sp]),spring:a=>springs.push(x+a),
    walker:(a,y=G)=>ens.push(['walker',x+a,y]),turret:(a,y=G)=>ens.push(['turret',x+a,y]),popper:a=>ens.push(['popper',x+a,G]),hopper:a=>ens.push(['hopper',x+a,G]),
    flyers:(a,n=1)=>spawns.push({x:x+a,n,done:false}),cplat:(a,y,w)=>cplats.push([x+a,y,w]),jet:a=>jets.push(x+a),pstar:(a,y)=>pstars.push([x+a,y]),coin:(a,y)=>coins.push([x+a,y])};
  for(const [name,c] of def.chunks){CHUNKS[name].f(B,!!c);x+=CHUNKS[name].w;}
  L.len=x;L.endX=x-320;L.minX=30;L.maxX=x-30;L.spawns=spawns;
  L.solids=ground.map(([a,b])=>({x:a,y:G,w:b-a,h:200,ground:true}));plats.forEach(([a,y,w])=>L.solids.push({x:a,y,w,h:14,oneWay:true}));
  springs.forEach(sx=>L.solids.push({x:sx-22,y:G-16,w:44,h:16,oneWay:true,spring:true,boing:0}));
  movers.forEach(([a,y,w,ax,ay,sp])=>L.solids.push({x:a,y,w,h:14,oneWay:true,mv:{cx:a,cy:y,ax,ay,sp},py:y,dx:0}));
  cplats.forEach(([a,y,w])=>L.solids.push({x:a,y,w,h:14,oneWay:true,crumble:true,y0:y,shake:0,fall:0,fy:0,vy:0,gone:0}));
  L.jets=jets.map(x=>({x,t:rand()*2}));const r=srand(def.id.length*31+7);L.deco=[];for(let dx=200;dx<x-200;dx+=180+r()*160)L.deco.push({x:dx,k:Math.floor(r()*4),s:.8+r()*.4});
  L.updSolids=dt=>{for(const s of L.solids){if(s.boing)s.boing=Math.max(0,s.boing-dt);
    if(s.crumble){if(s.gone>0){s.gone-=dt;s.y=99999;if(s.gone<=0){s.y=s.y0;s.fall=0;s.fy=0;s.vy=0;s.shake=0;puff(L,s.x+s.w/2,s.y0,5);}continue;}
      const on=L.Ps.some(p=>!p.dead&&p.ground&&p.groundRef===s);if(on&&!s.fall){s.shake+=dt;if(Math.floor(s.shake*20)!==Math.floor((s.shake-dt)*20))sfx('crumble');}
      if(s.shake>.5&&!s.fall){s.fall=1;puff(L,s.x+s.w/2,s.y,6);}if(s.fall){s.vy+=1400*dt;s.fy+=s.vy*dt;s.py=s.y;s.y=s.y0+s.fy;if(s.y>H+40)s.gone=3;}continue;}
    if(!s.mv)continue;const px=s.x;s.py=s.y;s.x=s.mv.cx+Math.sin(L.t*s.mv.sp)*s.mv.ax;s.y=s.mv.cy+Math.sin(L.t*s.mv.sp)*s.mv.ay;s.dx=s.x-px;}};
  L.floorAt=xx=>{for(const s of L.solids)if(s.ground&&xx>=s.x&&xx<=s.x+s.w)return s.y;return Infinity;};
  addPlayers(L,'plat',160,G);
  L.coins=coins.map(([cx,cy],i)=>{const id=def.id+'-'+i;return{id,x:cx,y:cy,got:false,was:!!save.taken[id]};});
  for(const [px,py] of pstars)spawnEB(L,{k:'pstar',x:px,y:py,r:16,parry:true,harmless:true,cool:0});
  for(const [k,ex,ey] of ens){
    if(k==='walker')mkEnt(L,{ai:'walker',skin:th.walker,hp:3,r:20,x:ex,y:ey-20,gy:ey,spd:130,active:false,face:-1,shoots:th.walker==='soldadito'?{rate:2.6,spd:240,spr:'cork',r:8}:null,cool:1.5});
    else if(k==='turret')mkEnt(L,{ai:'turret',skin:th.turret,hp:7,r:24,x:ex,y:ey-22,cool:1.4,rate:2.2,ammo:th.ammo});
    else if(k==='popper')mkEnt(L,{ai:'popper',skin:th.popper,hp:3,r:20,x:ex,y:ey-18,pop:0,state:'hide',cool:0,ammo:th.ammo,hidden:th.popper!=='caja'});
    else mkEnt(L,{ai:'hopper',skin:th.hopper,hp:2,r:18,x:ex,y:ey-18,wait:.6+rand()*.5,vy:0});}
  L.update=dt=>{const al=alive(L);if(al.length){const avg=al.reduce((s,p)=>s+p.x,0)/al.length,target=clamp(avg-W*.4,0,L.len-W);L.camX=lerp(L.camX,target,1-Math.pow(.002,dt));}
    for(const j of L.jets){if(j.x<L.camX-60||j.x>L.camX+W+60)continue;j.t-=dt;if(j.t<=0){j.t=2.6;spawnEB(L,{k:'column',x:j.x,warn:.9,act:.55,w:40,style:'fire'});sfx('warn');}}
    for(const s of L.spawns)if(!s.done&&L.camX+W>=s.x){s.done=true;for(let i=0;i<s.n;i++){const e=mkEnt(L,{ai:'flyer',skin:th.flyer,hp:2,r:20,x:L.camX+W+40+i*90,y:150,vx:-170-rand()*40,drop:1+rand(),ammo:th.egg});e.by=110+rand()*140;}}
    for(const p of al){const pb=pBox(p);for(const c of L.coins){if(c.got||c.was)continue;if(circRect(c.x,c.y,16,pb.x,pb.y,pb.w,pb.h)){c.got=true;L.coinsGot.push(c.id);sparks(L,c.x,c.y,10,C.gold);pop(L,c.x,c.y-30,'+1',C.gold);sfx('coin');}}
      if(p.x>=L.endX&&L.state==='play'){L.state='win';L.stateT=0;banner(L,'¡LLEGASTE!',2.2);sfx('victory');L.eb=L.eb.filter(e=>e.k==='pstar');}}};
  L.idle=()=>{};L.progress=()=>{const al=L.Ps.reduce((m,p)=>Math.max(m,p.x),0);return clamp(al/L.endX,0,1);};
  L.drawBG=()=>{const R=runLayers(def.theme);ctx.drawImage(R.sky,0,0,W,H);const f=-((L.camX*.2)%1200);ctx.drawImage(R.far,f,0,1200,H);ctx.drawImage(R.far,f+1200,0,1200,H);
    const m=-((L.camX*.45)%1000);ctx.drawImage(R.mid,m,0,1000,H);ctx.drawImage(R.mid,m+1000,0,1000,H);
    const pr=L.progress(),night=def.theme==='feria_noche'||def.theme==='torre'||def.theme==='mina';ctx.save();ctx.globalAlpha=pr*.9;ctx.fillStyle=night?'rgba(120,20,60,.22)':'rgba(255,120,50,.22)';ctx.fillRect(0,0,W,H);ctx.restore();
    if(pr>.5){ctx.save();ctx.globalAlpha=(pr-.5)*1.4;for(let i=0;i<12;i++){const sx=(i*137+L.t*20)%W,sy=40+(i*53)%160;star(sx,sy,3,1.2,4,0);ctx.fillStyle='#fff3b0';ctx.fill();}ctx.restore();}};
  L.drawWorld=()=>drawRunWorld(L,th);L.intro=pick(['¡CORRE, CORRE!','¡A LA CARRERA!','¡SIN MIRAR ATRÁS!']);return L;}
function drawRunWorld(L,th){const x0=L.camX-40,x1=L.camX+W+40;
  for(const d of L.deco||[]){if(d.x<x0-80||d.x>x1+80)continue;drawRunDeco(d,th,L.t);}
  for(const s of L.solids){if(s.x+s.w<x0||s.x>x1)continue;
    if(s.ground&&th.cloud){ctx.fillStyle=th.ground;ctx.fillRect(s.x,s.y+10,s.w,H-s.y);for(let x=s.x+14;x<s.x+s.w-6;x+=34)circ(x,s.y+12+Math.sin(x*.7)*3,20,th.ground,0);
      ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.beginPath();for(let x=s.x+14;x<s.x+s.w-6;x+=34){ctx.moveTo(x+20,s.y+12+Math.sin(x*.7)*3);ctx.arc(x,s.y+12+Math.sin(x*.7)*3,20,0,Math.PI,true);}ctx.stroke();
      ctx.fillStyle='rgba(156,195,210,.35)';for(let x=s.x+30;x<s.x+s.w-20;x+=70)ctx.fillRect(x,s.y+40,30,6);}
    else if(s.ground){ctx.fillStyle=th.ground;ctx.fillRect(s.x,s.y,s.w,H-s.y+10);ctx.strokeStyle='rgba(20,13,8,.45)';ctx.lineWidth=2;
      for(let y=s.y+22,r=0;y<H;y+=22,r++){ctx.beginPath();ctx.moveTo(s.x,y);ctx.lineTo(s.x+s.w,y);ctx.stroke();for(let x=s.x+(r%2)*60;x<s.x+s.w;x+=120){ctx.beginPath();ctx.moveTo(x,y-22);ctx.lineTo(x,y);ctx.stroke();}}
      for(let x=s.x+10;x<s.x+s.w-10;x+=36){ctx.fillStyle=(Math.floor(x/36)%2)?th.trim[0]:th.trim[1];ctx.beginPath();ctx.moveTo(x,s.y);ctx.lineTo(Math.min(x+36,s.x+s.w-10),s.y);ctx.lineTo(x+18,s.y+14);ctx.closePath();ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle=C.ink;ctx.stroke();}
      ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(s.x,H+10);ctx.lineTo(s.x,s.y);ctx.lineTo(s.x+s.w,s.y);ctx.lineTo(s.x+s.w,H+10);ctx.stroke();}
    else if(s.crumble){if(s.y>9000)continue;const sh=s.shake>0&&!s.fall?(rand()-.5)*s.shake*10:0;ctx.save();ctx.translate(sh,0);if(s.fall){ctx.translate(s.x+s.w/2,s.y);ctx.rotate(s.fy*.003);ctx.translate(-s.x-s.w/2,-s.y);}
      rr(s.x,s.y,s.w,18,3,'#b9a27a',3.5);line(s.x+s.w*.3,s.y,s.x+s.w*.38,s.y+18,2);line(s.x+s.w*.65,s.y,s.x+s.w*.58,s.y+10,2);for(let i=0;i<3;i++)circ(s.x+12+i*(s.w-24)/2,s.y+24+Math.sin(L.t*3+i)*2,3,'#8a7650',1.5);ctx.restore();}
    else if(s.spring){if(s.balloon)continue;const b=s.boing>0?Math.sin(s.boing*40)*6:0;ctx.lineWidth=3;ctx.strokeStyle=C.ink;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(s.x+22,s.y+12-i*5-b*.3,16,4,0,0,TAU);ctx.stroke();}rr(s.x,s.y-6-b,44,10,4,C.rust,3);}
    else{if(!s.mv&&!th.cloud&&!s.conv){ctx.lineWidth=2;ctx.strokeStyle='rgba(20,13,8,.55)';for(const rx of[s.x+12,s.x+s.w-12]){ctx.beginPath();ctx.moveTo(rx,0);ctx.lineTo(rx,s.y);ctx.stroke();}}
      if(th.cloud){for(let i=0;i<3;i++)circ(s.x+s.w*(.2+i*.3),s.y+6,14,th.plank,3);rr(s.x,s.y,s.w,14,7,th.plank,0);}else rr(s.x,s.y,s.w,14,3,th.plank,3.5);line(s.x+4,s.y+7,s.x+s.w-4,s.y+7,1.5);if(s.mv&&th.cave&&s.mv.ax){rr(s.x+8,s.y+14,s.w-16,28,4,'#6b5a4a',3.5);line(s.x+14,s.y+26,s.x+s.w-14,s.y+26,2);for(const wx of[s.x+26,s.x+s.w-26]){ctx.save();ctx.translate(wx,s.y+46);ctx.rotate(L.t*6);circ(0,0,9,C.steelD,3);line(-7,0,7,0,2);ctx.restore();}}else if(s.mv){for(const ex of[s.x+8,s.x+s.w-8]){ctx.save();ctx.translate(ex,s.y+7);ctx.rotate(L.t*4);star(0,0,10,7,8);ctx.fillStyle=C.brass;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}}}}
  const ex=L.endX;if(ex>x0-200&&ex<x1+200){for(const px of[ex-70,ex+70])rr(px-8,GROUND-190,16,190,2,C.rust,4);rr(ex-100,GROUND-230,200,50,8,C.paper,4);txt('META',ex,GROUND-205,30,C.rust,null);
    for(let i=0;i<8;i++){ctx.fillStyle=i%2?C.ink:C.paper;ctx.fillRect(ex-64+i*16,GROUND-180,16,16);}}
  for(const c of L.coins){if(c.got||c.x<x0||c.x>x1)continue;if(c.was){ctx.setLineDash([4,4]);circ(c.x,c.y,12,null,0);ctx.lineWidth=2;ctx.strokeStyle='rgba(239,224,191,.5)';ctx.stroke();ctx.setLineDash([]);}
    else coinIcon(c.x,c.y+Math.sin(L.t*3+c.x)*4,13,Math.cos(L.t*4+c.x));}}

function drawRunDeco(d,th,t){const x=d.x,y=GROUND,night=th.far==='feria_noche'||th.far==='castillo';ctx.save();ctx.translate(x,y);ctx.scale(d.s,d.s);ctx.globalAlpha=.92;
  switch(d.k){
    case 0:/* lamp post */line(0,0,0,-120,5);rr(-12,-150,24,30,4,night?'#ffd36a':'#f3e4b6',3);if(night){const g=ctx.createRadialGradient(0,-135,4,0,-135,70);g.addColorStop(0,'rgba(255,220,130,.35)');g.addColorStop(1,'rgba(255,220,130,0)');ctx.fillStyle=g;ctx.fillRect(-70,-205,140,140);}break;
    case 1:/* barrel / crate */rr(-22,-44,44,44,6,th.plank||C.woodL,3);line(-22,-30,22,-30,2);line(-22,-14,22,-14,2);break;
    case 2:/* signpost */line(0,0,0,-70,4);rr(-34,-86,68,24,4,C.paper,3);txt(['¡CORRE!','→','¡OJO!','¡PELIGRO!'][Math.floor(x)%4],0,-74,12,C.rust,null);break;
    default:/* bush with flowers / mushrooms */for(const [a,b,r] of[[-16,-14,16],[4,-22,20],[22,-12,14]])circ(a,b,r,th.mid,3);for(let i=0;i<3;i++)circ(-14+i*14,-26+Math.sin(t*2+i)*2,3.5,[C.rust,C.gold,C.paper][i],1.5);}
  ctx.restore();}
