'use strict';
/* ================= ESCENARIOS PROPIOS + EL GRAN JEFE DE VARIEDADES (Cumbre Apagón) =================
   «Radio Medianoche»: el locutor Don Estática gira el dial y en cada fase sale al escenario un número
   distinto (Saxofón, Bombo y Micrófono, en orden al azar). Cuando caen los tres, sale él mismo. Original. */

/* ---------- 1. new arenas so the new bosses don't share a backdrop ---------- */
const _paintArenaNew=paintArena;
paintArena=function(g,k){const r=srand(k.length*13+5);
  if(k==='cuarto'){skyG(g,'#3a3150','#6b5a7a');g.fillStyle='#f6e7b9';g.beginPath();g.arc(820,90,40,0,TAU);g.fill();g.lineWidth=4;g.strokeStyle=C.ink;g.stroke();
    g.fillStyle='#4b4060';g.fillRect(0,GROUND-170,W,170);for(let i=0;i<7;i++){const x=40+i*135,h=40+r()*90,cols=['#c26a3a','#7bb7c9','#d9a441','#8fb06a'];g.fillStyle=cols[i%4];g.fillRect(x,GROUND-h,70,h);g.lineWidth=4;g.strokeStyle=C.ink;g.strokeRect(x,GROUND-h,70,h);
      g.fillStyle='rgba(255,255,255,.75)';g.font=`bold 30px ${FONT}`;g.textAlign='center';g.fillText('ABCD'[i%4],x+35,GROUND-h/2+10);}
    for(let i=0;i<20;i++){g.fillStyle='rgba(255,245,210,.7)';g.beginPath();g.arc(r()*W,r()*200,1.5+r()*1.5,0,TAU);g.fill();}floorG(g,'planks','#7a5a3a');return;}
  if(k==='opera'){skyG(g,'#2a1830','#5a2a40');for(let i=0;i<3;i++){g.fillStyle='#3a1f2a';g.fillRect(40+i*300,80,200,GROUND-80);g.lineWidth=4;g.strokeStyle=C.ink;g.strokeRect(40+i*300,80,200,GROUND-80);
      for(let j=0;j<3;j++){g.fillStyle='#d9a441';g.fillRect(50+i*300,110+j*90,180,10);g.fillStyle='#7a2a3a';g.fillRect(60+i*300,120+j*90,160,60);g.strokeRect(60+i*300,120+j*90,160,60);}}
    g.fillStyle='rgba(255,220,140,.18)';g.beginPath();g.moveTo(480,0);g.lineTo(260,GROUND);g.lineTo(700,GROUND);g.closePath();g.fill();floorG(g,'planks','#6b3a26');return;}
  if(k==='laboratorio'){skyG(g,'#1e2a22','#3a4a3a');for(let i=0;i<4;i++){const x=60+i*240;g.fillStyle='#5a4a3a';g.fillRect(x,150,180,14);g.strokeStyle=C.ink;g.lineWidth=3;g.strokeRect(x,150,180,14);
      for(let j=0;j<4;j++){const cols=['rgba(170,255,190,.8)','rgba(255,170,120,.8)','rgba(180,170,255,.8)','rgba(255,240,140,.8)'];g.fillStyle=cols[(i+j)%4];g.beginPath();g.moveTo(x+20+j*42,150);g.lineTo(x+8+j*42,110);g.lineTo(x+32+j*42,110);g.closePath();g.fill();g.stroke();}}
    g.strokeStyle='rgba(170,255,190,.35)';g.lineWidth=8;g.beginPath();for(let x=0;x<W;x+=20)g.lineTo(x,250+Math.sin(x*.03)*16);g.stroke();floorG(g,'tiles','#4a5a4a','#3a4a3a');return;}
  if(k==='radio'){skyG(g,'#2b1d14','#4a2f22');g.fillStyle='#5a3a26';g.fillRect(0,0,W,GROUND);for(let x=0;x<W;x+=48){g.fillStyle=(x/48)%2?'#5f3d28':'#553624';g.fillRect(x,0,48,GROUND);}
    g.fillStyle='#1a120c';g.fillRect(330,24,300,50);g.lineWidth=4;g.strokeStyle=C.ink;g.strokeRect(330,24,300,50);g.fillStyle='#e23b3b';g.font=`bold 30px ${FONT}`;g.textAlign='center';g.fillText('AL AIRE',480,60);
    for(const x of[90,870]){g.fillStyle='#3a2a20';g.fillRect(x-40,120,80,GROUND-120);g.strokeRect(x-40,120,80,GROUND-120);for(let y=140;y<GROUND-20;y+=26){g.beginPath();g.arc(x,y+10,9,0,TAU);g.fillStyle='#1a120c';g.fill();}}
    floorG(g,'planks','#6b4a2a');return;}
  _paintArenaNew(g,k);};
Object.assign(ARENA_FX,{
  cuarto:{plats:[{x:90,y:340,w:96,skin:'bloque'},{x:280,y:270,w:96,skin:'bloque',mv:{ax:0,ay:40,sp:1.2}},{x:470,y:330,w:110,skin:'tren',mv:{ax:110,ay:0,sp:.9},from:1}],
    tint:[null,'rgba(255,170,80,.12)','rgba(120,40,140,.28)'],part:['confetti','star','star']},
  opera:{plats:[{x:70,y:330,w:110,skin:'palco'},{x:300,y:260,w:100,skin:'palco',mv:{ax:80,ay:0,sp:.8},from:1},{x:520,y:330,w:100,skin:'palco',from:2}],
    tint:[null,'rgba(255,90,120,.14)','rgba(60,20,80,.3)'],part:['note','note','confetti']},
  laboratorio:{plats:[{x:80,y:330,w:110,skin:'piedra',crumble:true},{x:310,y:270,w:110,skin:'piedra'},{x:540,y:330,w:100,skin:'piedra',crumble:true,from:1}],
    tint:[null,'rgba(120,255,160,.12)','rgba(180,60,40,.25)'],part:['bubble','steam','ember']},
  radio:{plats:[{x:80,y:330,w:110,skin:'palco'},{x:330,y:270,w:110,skin:'palco',mv:{ax:0,ay:36,sp:1.3},from:1},{x:560,y:330,w:110,skin:'palco',from:2}],
    tint:[null,'rgba(255,200,120,.1)','rgba(120,180,255,.12)','rgba(160,40,40,.25)'],part:['note','sparkle','note']}});
LEVELS.trompo.arena='cuarto';LEVELS.pulpo.arena='opera';LEVELS.cuervo.arena='laboratorio';

/* ---------- 2. the variety-show boss ---------- */
const SHOW_ACTS={
  sax:{name:'Saxofón Saltarín',banner:'¡CON USTEDES… EL SAXOFÓN SALTARÍN!',
    atk:[{f:'leap',every:2.6,minx:420,maxx:820},{f:'aimed',every:1.5,from:'mouth',n:3,spread:.25,spd:320,spr:'note',r:13,wob:80,parry:4,sfx:'honk'},{f:'ring',every:3.2,from:'mouth',n:8,spd:220,spr:'note',parry:5}]},
  bombo:{name:'Bombo Bombástico',banner:'¡RETUMBA EL BOMBO BOMBÁSTICO!',
    atk:[{f:'charge',every:3.4,warn:.8,spd:760},{f:'wave',every:2.4,from:'__feet',both:true,spd:420},{f:'bouncer',every:3.6,spr:'ball',r:22,spd:420,max:2}]},
  micro:{name:'Micrófono Mareado',banner:'¡PROBANDO, PROBANDO… EL MICRÓFONO MAREADO!',
    atk:[{f:'sweep',every:2.8,alt:true,warn:.8,act:.45,style:'light'},{f:'rain',every:1.8,n:5,spd:[240,340],spr:'spark',r:10,parry:5},{f:'aimed',every:2.2,from:'mouth',n:5,spread:.18,spd:300,spr:'sonic',r:12,parry:5}]},
  host:{name:'Don Estática',banner:'¡Y AHORA… DON ESTÁTICA EN PERSONA!',
    atk:[{f:'spiral',every:3,from:'mouth',dur:1.6,rate:.08,spd:230,spr:'spark',r:11,arms:3,parry:7},{f:'column',every:2.8,n:3,gap:.45,style:'needle',warn:.6,act:.4,w:30,spread:140},
      {f:'minion',every:5,from:'mouth',ai:'flyer',skin:'nube',hp:3,r:20,max:2,spd:170,ammo:'spark'},{f:'dark',every:9,dur:2}]}};
const vsC=B=>{const a=B.actId||'sax',hop=B.act&&B.act.type==='leap'?0:0;
  if(a==='sax')return{x:B.x,y:B.y-170+Math.sin(B.t*4)*6};if(a==='bombo')return{x:B.x,y:B.y-110};if(a==='micro')return{x:B.x,y:B.y-250+Math.sin(B.t*2)*10};return{x:B.x,y:B.y-190};};
defBoss({id:'radio',name:'Radio Medianoche',sub:'Jefe · Gran show de variedades',isl:3,hp:760,par:150,arena:'radio',song:'radio',x:740,intro:'¡ESTÁN ESCUCHANDO RADIO MEDIANOCHE!',faceTarget:true,
  center:vsC,
  anchor(B,n){const c=vsC(B),a=B.actId;if(n==='__feet'||n==='foot')return{x:B.x,y:GROUND};if(n==='mouth'){if(a==='sax')return{x:c.x-40,y:c.y+70};if(a==='micro')return{x:c.x,y:c.y};return{x:c.x-60,y:c.y-20};}return c;},
  shapes(B){const c=vsC(B),a=B.actId;if(a==='sax')return[{x:c.x,y:c.y,r:70},{x:c.x-50,y:c.y+40,w:100,h:Math.max(0,B.y-(c.y+40))}];if(a==='bombo')return[{x:c.x,y:c.y,r:104}];
    if(a==='micro')return[{x:c.x,y:c.y,r:58},{x:c.x-14,y:c.y+50,w:28,h:GROUND-(c.y+50)}];return[{x:c.x-120,y:c.y-150,w:240,h:GROUND-(c.y-150)}];},
  phases:[{act:'sax'},{act:'bombo'},{act:'micro'},{act:'host'}].map(p=>({act:p.act,banner:SHOW_ACTS[p.act].banner,atk:SHOW_ACTS[p.act].atk})),
  setup(B,L){/* the dial lands on the first three acts in a random order; the host always closes the show */
    const first=B.def.phases.slice(0,3),order=['sax','bombo','micro'].sort(()=>rand()-.5);order.forEach((a,i)=>{first[i].act=a;first[i].atk=SHOW_ACTS[a].atk;first[i].banner=SHOW_ACTS[a].banner;});B.actId=B.def.phases[0].act;},
  onPhase(B,L,i){B.actId=B.def.phases[i].act;B.dial=1.2;B.x=740;sfx('pageTurn');sfx('whistleUp');},
  move(B,dt){B.dial=Math.max(0,(B.dial||0)-dt);B.spin=(B.spin||0)+dt*5;},
  draw(B,L){const a=B.actId,c=vsC(B),x=c.x,y=c.y,t=B.t;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    /* the radio cabinet always stands at the back; its dial needle swings when a new act comes on */
    const rx=880,ry=GROUND;rr(rx-70,ry-210,140,210,30,'#7a4a2a',5);rr(rx-56,ry-190,112,90,40,'#e9d7b0',4);for(let i=0;i<6;i++)line(rx-46,ry-176+i*13,rx+46,ry-176+i*13,2,'#8a6a4a');
    const nd=B.dial>0?Math.sin(B.dial*20)*1.2:-.6+B.phase*.4;line(rx,ry-60,rx+Math.cos(nd-Math.PI/2)*40,ry-60+Math.sin(nd-Math.PI/2)*40,3,C.rust);circ(rx,ry-60,6,C.brass,2);
    for(const s of[-1,1])circ(rx+s*36,ry-30,10,C.woodD,3);if(a!=='host'){bossFace(B,L,rx,ry-150,.55,{gap:30,ew:12,eh:15,my:26,mw:24,open:B.dial>0?.8:.2});}
    if(B.dial>0){ctx.save();ctx.globalAlpha=Math.min(.6,B.dial);for(let i=0;i<60;i++){ctx.fillStyle=rand()<.5?'#ffffff':'#000000';ctx.fillRect(rand()*W,rand()*H,3+rand()*20,2);}ctx.restore();}
    shadowE(B.x,GROUND+3,90,.3);bossSquash(B,L);
    if(a==='sax'){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*3)*.12);
      ctx.beginPath();ctx.moveTo(20,-110);ctx.lineTo(30,30);ctx.quadraticCurveTo(30,90,-20,90);ctx.quadraticCurveTo(-60,90,-60,50);ctx.lineWidth=46;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=38;ctx.strokeStyle=C.brass;ctx.stroke();
      ell(-62,40,30,20,C.goldL||'#ffe9a0',5);for(let i=0;i<5;i++)circ(30,-70+i*24,7,C.steel,2.5);line(20,-110,-10,-130,8);rr(-24,-138,22,12,3,C.ink,0);
      bossFace(B,L,8,-20,.8,{gap:28,ew:14,eh:18,my:32,mw:26,open:B.mouth>0?.8:.3});ctx.restore();
      for(const s of[-1,1]){line(x+s*14,y+96,x+s*20,GROUND-10,8);ell(x+s*26,GROUND-8,16,7,C.ink,0);}}
    else if(a==='bombo'){ctx.save();ctx.translate(x,y);ctx.rotate(B.act&&B.act.type==='charge'&&B.act.t>B.act.warn?B.spin*B.act.dir:0);
      circ(0,0,104,C.rust,6);circ(0,0,86,C.paper,4);for(let i=0;i<10;i++){const an=i*TAU/10;line(Math.cos(an)*104,Math.sin(an)*104,Math.cos(an+.3)*86,Math.sin(an+.3)*86,3,C.brass);}
      bossFace(B,L,0,0,1,{gap:34,ew:18,eh:22,my:40,mw:40,open:B.act?.9:.3});ctx.restore();
      for(const s of[-1,1]){const gx=x+s*130,gy=y-60+Math.sin(t*6+s)*10;hose(x+s*90,y-30,x+s*120,y-60,gx,gy,7);glove(gx,gy,13);line(gx,gy,gx-s*20,gy-40,6,C.woodL);circ(gx-s*20,gy-44,9,C.paper,3);}}
    else if(a==='micro'){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*2.2)*.25);
      rr(-14,50,28,GROUND-y-50,4,C.steel,4);ell(0,GROUND-y-4,50,10,C.steelD,4);ell(0,0,54,62,'#c9c2b4',5);for(let i=-3;i<=3;i++)line(-40,i*14,40,i*14,2,'#8a8478');rr(-56,40,112,16,6,C.steelD,4);
      bossFace(B,L,0,-6,.8,{gap:28,ew:14,eh:18,my:28,mw:26,open:B.mouth>0?.9:.3});ctx.restore();
      ctx.save();ctx.globalAlpha=.6;for(let i=0;i<3;i++){const k=(t*1.5+i/3)%1;ctx.beginPath();ctx.arc(x-60,y,20+k*60,Math.PI*.7,Math.PI*1.3);ctx.lineWidth=4;ctx.strokeStyle=C.parryL;ctx.stroke();}ctx.restore();}
    else{/* Don Estática: a tall radio with an antenna crackling with static */
      rr(x-120,y-150,240,GROUND-(y-150),40,B.phase===3&&B.hp<B.max*.12?'#5a2a20':'#7a4a2a',6);rr(x-100,y-130,200,120,50,'#e9d7b0',5);
      for(let i=0;i<4;i++)circ(x-60+i*40,y+60,12,C.woodD,3);line(x+60,y-150,x+110,y-260,5);circ(x+110,y-264,8,C.rust,3);
      for(let i=0;i<3;i++){const k=(t*2+i/3)%1;ctx.globalAlpha=1-k;ctx.beginPath();ctx.arc(x+110,y-264,14+k*40,0,TAU);ctx.lineWidth=3;ctx.strokeStyle=C.parryL;ctx.stroke();ctx.globalAlpha=1;}
      L.arcs&&rand()<.08&&L.arcs.push({pts:zig(x+110,y-264,x+110+(rand()-.5)*200,y-264+(rand()-.5)*120),t:.08});
      bossFace(B,L,x,y-70,1.1,{gap:40,ew:20,eh:26,my:42,mw:46,open:B.mouth>0?.9:.35});
      for(const s of[-1,1]){const raise=(s<0&&B.throwT>0)?-60:0,gx=x+s*170,gy=y+raise+Math.sin(t*3+s)*8;hose(x+s*120,y,x+s*150,y-20+raise*.4,gx,gy,8);glove(gx,gy,15);}}
    flashOver(B,x,y,a==='host'?130:100);koStars(B,L,x,y-150);ctx.restore();}});
TAUNTS.radio=['¡Buenas noches, queridos oyentes!','¡Cambiamos de estación!','¡Y ahora, otro número estelar!','¡Se acabó la música… para ustedes!'];
SONGS.radio=Object.assign({},SONGS.apagon,{name:'Radio Medianoche',seed:331});
BOSS_LIST[3].splice(BOSS_LIST[3].indexOf('apagon'),0,'radio');if(!ALL_LEVELS.includes('radio'))ALL_LEVELS.push('radio');
addNode(3,{id:'radio',x:450,y:500,kind:'level',ob:34,bld:'antena',em:'note'});WORLDS[3].roads.push(['vela','radio'],['radio','chistera']);MAPBG={k:null};
NEW_BLD.push('antena');
const _drawBldRadio=drawBld;
drawBld=function(n,t,night){if(n.bld!=='antena'){_drawBldRadio(n,t,night);return;}const x=n.x,y=n.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;
  rr(x-40,y-50,80,50,10,'#7a4a2a');rr(x-30,y-44,60,24,10,'#e9d7b0',3);line(x-50,y,x,y-150,4);line(x+50,y,x,y-150,4);for(let i=1;i<5;i++)line(x-50+i*10,y-i*30,x+50-i*10,y-i*30,2.5);
  circ(x,y-154,6,Math.floor(t*3)%2?'#e23b3b':'#7a1a1a',2.5);for(let i=0;i<2;i++){const k=(t*.8+i/2)%1;ctx.globalAlpha=1-k;ctx.beginPath();ctx.arc(x,y-154,10+k*30,-.9,.9);ctx.stroke();ctx.beginPath();ctx.arc(x,y-154,10+k*30,Math.PI-.9,Math.PI+.9);ctx.stroke();ctx.globalAlpha=1;}
  ctx.restore();_drawBldRadio(Object.assign({},n,{bld:'_'}),t,night);};

/* ---------- 3. new mechanics for run-and-gun levels: conveyor belts and floating balloons ---------- */
/* chunks mark special platforms with a tiny fraction in their width (.1 belt right, .2 belt left) or height (.5 balloon) */
Object.assign(CHUNKS,{
  cinta:{w:820,f(B,c){B.ground(0,820);B.plat(120,330,240.1);B.plat(470,300,240.2);B.walker(400);B.walker(700);B.turret(760);if(c)B.coin(590,250);}},
  globos:{w:900,f(B,c){B.ground(0,150);B.plat(230,380.5,60);B.plat(420,320.5,60);B.plat(610,360.5,60);B.ground(760,900);B.flyers(250,2);if(c)B.coin(450,170);}}});
const _buildRunMech=buildRun;
buildRun=function(def){const L=_buildRunMech(def);for(const s of L.solids){const fw=Math.round((s.w%1)*10),fy=Math.round((s.y%1)*10);if(fw){s.w=Math.floor(s.w);s.conv=fw===1?140:-140;}
    if(fy===5&&s.oneWay&&!s.ground){s.y=Math.floor(s.y);s.y0b=s.y;s.spring=true;s.balloon=true;s.boing=0;s.mv=null;}}
  const up=L.updSolids;L.updSolids=dt=>{up&&up(dt);for(const s of L.solids)if(s.balloon){s.py=s.y;s.y=s.y0b+Math.sin(L.t*2+s.x*.01)*10;}};return L;};
const _platConv=platUpdate;
platUpdate=function(L,p,dt,I){_platConv(L,p,dt,I);if(!p.dead&&p.ground&&p.groundRef&&p.groundRef.conv){p.x+=p.groundRef.conv*dt;if(rand()<.05)puff(L,p.x,p.y,1);}};
const _drawRunWorldMech=drawRunWorld;
drawRunWorld=function(L,th){_drawRunWorldMech(L,th);const x0=L.camX-40,x1=L.camX+W+40;for(const s of L.solids){if(s.x+s.w<x0||s.x>x1)continue;
  if(s.conv){rr(s.x,s.y,s.w,16,8,'#4a4440',3.5);ctx.save();ctx.beginPath();ctx.rect(s.x+4,s.y+2,s.w-8,12);ctx.clip();const o=(L.t*s.conv*.5)%24;for(let x=s.x-24+o;x<s.x+s.w+24;x+=24){const d=Math.sign(s.conv);poly([[x,s.y+3],[x+d*8,s.y+8],[x,s.y+13]],C.gold,0);}ctx.restore();
    for(const ex of[s.x+8,s.x+s.w-8]){ctx.save();ctx.translate(ex,s.y+8);ctx.rotate(L.t*s.conv*.05);star(0,0,9,6,8);ctx.fillStyle=C.brass;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}}
  if(s.balloon){const cx=s.x+s.w/2,b=s.boing>0?Math.sin(s.boing*40)*5:0;line(cx,s.y+14,cx+Math.sin(L.t*2)*6,s.y+60,2);ell(cx,s.y-14-b,36,26-b,['#e86a5a','#7bb7c9','#f2c14e'][Math.floor(s.x/97)%3],4);ell(cx-12,s.y-24-b,8,5,'rgba(255,255,255,.6)',0);poly([[cx-5,s.y+10],[cx+5,s.y+10],[cx,s.y+4]],C.ink,0);}}};
/* sprinkle the new mechanics into every run-and-gun level so each one gets something new */
const RUN_ADDS={feria:['globos'],fabrica:['cinta'],muelle:['globos'],setas:['globos'],nubes:['globos','globos'],feria_noche:['cinta'],torre:['cinta'],mina:['cinta'],trenes:['cinta'],arrecife:['globos'],cementerio:['cinta','globos']};
for(const id in RUN_ADDS){const d=LEVELS[id];if(!d||!d.chunks)continue;const at=Math.max(2,d.chunks.length-3);d.chunks.splice(at,0,...RUN_ADDS[id].map(n=>[n]));}

/* ---------- 4. distinct far scenery for the three new runs ---------- */
const _runLayersNew=runLayers;
runLayers=function(k){const R=_runLayersNew(k);if(R.extra||!['trenes','arrecife','cementerio'].includes(k))return R;const [fc,g]=mk(1200,H);g.drawImage(R.far,0,0);g.lineWidth=3;g.strokeStyle='rgba(20,13,8,.75)';
  if(k==='trenes'){g.fillStyle='#8a7a66';for(let x=0;x<1200;x+=120){g.beginPath();g.arc(x+60,GROUND-60,50,Math.PI,0);g.lineTo(x+120,GROUND-60);g.lineTo(x+120,GROUND-150);g.lineTo(x,GROUND-150);g.lineTo(x,GROUND-60);g.closePath();g.fill();g.stroke();}
    g.fillStyle='#3a3330';g.fillRect(200,GROUND-200,180,40);g.strokeRect(200,GROUND-200,180,40);g.fillRect(340,GROUND-240,30,40);g.strokeRect(340,GROUND-240,30,40);for(const wx of[230,290,350]){g.beginPath();g.arc(wx,GROUND-158,14,0,TAU);g.fill();g.stroke();}}
  else if(k==='arrecife'){for(let i=0;i<14;i++){const x=i*90+30,h=80+(i*37)%90;g.beginPath();g.moveTo(x,GROUND-50);for(let y=0;y<h;y+=12)g.lineTo(x+Math.sin(y*.1+i)*10,GROUND-50-y);g.lineWidth=8;g.strokeStyle=i%2?'#5f8f5a':'#4a7a4a';g.stroke();}
    g.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<40;i++){g.beginPath();g.arc((i*97)%1200,(i*53)%300,3+(i%4),0,TAU);g.fill();}}
  else{g.fillStyle='#f6e7b9';g.beginPath();g.arc(900,110,46,0,TAU);g.fill();g.strokeStyle=C.ink;g.stroke();for(let i=0;i<16;i++){const x=i*75+20,h=30+(i*23)%30;g.fillStyle='#4b4060';g.beginPath();g.moveTo(x,GROUND-50);g.lineTo(x,GROUND-50-h);g.quadraticCurveTo(x+14,GROUND-64-h,x+28,GROUND-50-h);g.lineTo(x+28,GROUND-50);g.closePath();g.fill();g.stroke();}
    for(const tx of[150,640,1050]){g.lineWidth=6;g.beginPath();g.moveTo(tx,GROUND-50);g.lineTo(tx+10,GROUND-200);g.lineTo(tx-30,GROUND-250);g.moveTo(tx+8,GROUND-160);g.lineTo(tx+50,GROUND-210);g.stroke();}}
  R.far=fc;R.extra=true;return R;};
Object.assign(PACK,{radio:['pd-radio','Nola — Vincent Lopez Orchestra (1922)','pd']});Object.assign(PACK_FINAL,{radio:['pd-radio-f','The Sheik — Club Royal Orchestra (1922)','pd']});
