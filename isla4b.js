'use strict';
/* ================= ISLA 4 · VALLE ESCARCHA (parte 2): niveles, mausoleo, mapa, NPCs, música y final ================= */

/* ---------- three run-and-gun levels, each with its own trick ---------- */
Object.assign(RUN_THEMES,{
  teleferico:{sky:['#e6eff4','#a9c3d3'],far:'picos',mid:'#e9f0f4',ground:'#f2f5f7',trim:['#9cc3d2',C.ink],walker:'pinguinito',flyer:'buhonieve',turret:'canon',popper:'topo',hopper:'bolanieve',ammo:'nieve',egg:'nieve',plank:'#c79a5e'},
  fundicion:{sky:['#2a1a14','#7a3a1e'],far:'fundicion',mid:'#3a2a22',ground:'#4a3a32',trim:[C.brass,C.ink],walker:'hollinito',flyer:'murcielago',turret:'canon',popper:'caja',hopper:'hollinito',ammo:'brasa',egg:'carbon',plank:C.steel,cave:true},
  bosque:{sky:['#141a2a','#2a3550'],far:'pinos',mid:'#1f2a3a',ground:'#dfe6ee',trim:['#9fb3c8',C.ink],walker:'pinguinito',flyer:'polilla',turret:'farol',popper:'topo',hopper:'bolanieve',ammo:'nieve',egg:'nieve',plank:'#8a6a40'}});
Object.assign(CHUNKS,{
  gondola:{w:1000,f(B,c){B.ground(0,140);B.mover(180,340,150,250,0,.65);B.ground(860,1000);B.flyers(300,2);if(c)B.coin(500,250);}},
  gondola2:{w:1100,f(B,c){B.ground(0,140);B.mover(170,330,140,130,0,.8);B.mover(560,280,140,130,0,.95);B.ground(960,1100);B.hopper(1040);if(c)B.coin(560,200);}},
  nevada:{w:820,f(B,c){B.ground(0,820);B.walker(300);B.hopper(480);B.walker(660);B.plat(360,320,130);if(c)B.coin(425,280);}},
  cintas:{w:960,f(B,c){B.ground(0,140);B.ground(140,560.1);B.walker(420);B.ground(660,960.2);B.hopper(820);B.plat(560,330,100);if(c)B.coin(610,290);}},
  prensas:{w:900,f(B,c){B.ground(0,900);B.jet(240.5);B.jet(470.5);B.jet(700.5);B.walker(840);if(c)B.coin(355,330);}},
  hornos:{w:840,f(B,c){B.ground(0,200);B.ground(360,840);B.jet(480);B.jet(680);B.walker(780);B.plat(230,330,110);if(c)B.coin(285,280);}},
  farolas:{w:900,f(B,c){B.ground(0,900);B.walker(320);B.popper(560);B.flyers(250,2);B.plat(420,320,120);if(c)B.coin(480,280);}},
  hielito:{w:860,f(B,c){B.ground(0,300);B.ground(380,860);B.hopper(500);B.walker(760);B.plat(300,350,100);if(c)B.coin(340,300);}}});
defRun({id:'teleferico',name:'Teleférico Helado',sub:'Nivel · Corre y dispara',isl:4,par:180,song:'teleferico',theme:'teleferico',
  chunks:[['start'],['gondola',1],['nevada'],['pit'],['gondola2',1],['hopperField'],['stairs',1],['gondola'],['nevada',1],['crumbleBridge'],['gondola2'],['ambush',1],['end']]});
defRun({id:'fundicion',name:'Fundición del Hollín',sub:'Nivel · Corre y dispara',isl:4,par:180,song:'fundicion',theme:'fundicion',
  chunks:[['start'],['cintas',1],['prensas'],['hornos',1],['turret'],['cintas'],['prensas',1],['pitParry'],['hornos'],['cintas',1],['fortress'],['prensas'],['ambush',1],['end']]});
defRun({id:'bosque',name:'Bosque de los Faroles',sub:'Nivel · Corre y dispara',isl:4,par:185,song:'bosque',theme:'bosque',
  chunks:[['start'],['farolas',1],['hielito'],['pit'],['farolas'],['hielito',1],['spring'],['farolas',1],['skyway'],['hielito'],['crumbleBridge',1],['ambush'],['end']]});

function drawGondolas(L){for(const s of L.solids){if(!s.gondola||s.x+s.w<L.camX-60||s.x>L.camX+W+60)continue;const m=s.mv,cy=m.cy-120;
  ctx.save();line(m.cx-m.ax-140,cy,m.cx+m.ax+s.w+140,cy,3,'rgba(20,13,8,.8)');const cx=s.x+s.w/2;line(cx-30,cy,s.x+16,s.y,2.5);line(cx+30,cy,s.x+s.w-16,s.y,2.5);circ(cx-30,cy,6,C.steel,2.5);circ(cx+30,cy,6,C.steel,2.5);
  rr(s.x+8,s.y+6,s.w-16,46,8,'#c8392b',3.5);for(let i=0;i<3;i++)rr(s.x+20+i*(s.w-40)/3,s.y+14,(s.w-40)/3-6,18,4,'#bfe3f0',2);rr(s.x+8,s.y+40,s.w-16,6,2,'#9a2a20',0);ctx.restore();}}
function drawPresses(L){for(const q of L.presses||[]){if(q.x<L.camX-120||q.x>L.camX+W+120)continue;const bot=lerp(130,GROUND,q.y||0);ctx.save();
  if(q.st==='warn'){ctx.globalAlpha=.35+.25*Math.sin(L.t*30);ell(q.x,GROUND-2,56,8,'#140d08',0);ctx.globalAlpha=1;txt('!',q.x,GROUND-40,26,C.rust,C.ink);}
  rr(q.x-12,-10,24,bot-60,4,C.steelD,3);rr(q.x-54,bot-72,108,72,8,'#5a5450',4.5);ctx.save();ctx.beginPath();ctx.rect(q.x-54,bot-18,108,18);ctx.clip();for(let x=q.x-70;x<q.x+60;x+=20)poly([[x,bot],[x+10,bot-18],[x+20,bot-18],[x+10,bot]],'#f2c14e',0);ctx.restore();
  rr(q.x-54,bot-72,108,72,8,null,4.5);for(const d of[-36,36])circ(q.x+d,bot-50,4,C.brass,2);ctx.restore();}}
function drawLanterns(L){for(const ln of L.lanterns||[]){if(ln.x<L.camX-80||ln.x>L.camX+W+80)continue;ctx.save();rr(ln.x-4,ln.y+20,8,GROUND-ln.y-20,2,'#2b2420',3);
  if(ln.lit){const g=ctx.createRadialGradient(ln.x,ln.y,4,ln.x,ln.y,90);g.addColorStop(0,'rgba(255,220,140,.6)');g.addColorStop(1,'rgba(255,220,140,0)');ctx.fillStyle=g;ctx.fillRect(ln.x-90,ln.y-90,180,180);}
  poly([[ln.x-16,ln.y-18],[ln.x+16,ln.y-18],[ln.x+12,ln.y+20],[ln.x-12,ln.y+20]],ln.lit?'#ffe27a':'#4a4a5a',3);poly([[ln.x-20,ln.y-18],[ln.x,ln.y-34],[ln.x+20,ln.y-18]],'#2b2420',3);
  if(!ln.lit&&Math.floor(L.t*2)%2===0)txt('?',ln.x,ln.y,14,'#9fb3c8',null);ctx.restore();}}
const _buildRun4=buildRun;
buildRun=function(def){const L=_buildRun4(def),id=def.id;if(!['teleferico','fundicion','bosque'].includes(id))return L;
  if(id==='teleferico'){for(const s of L.solids)if(s.mv&&s.mv.cx!==undefined&&s.mv.ax>0)s.gondola=true;L.icT=3;}
  if(id==='fundicion'){L.presses=[];L.jets=L.jets.filter(j=>{if(Math.abs((j.x%1)-.5)<.01){L.presses.push({x:Math.floor(j.x),t:.8+rand()*1.6,st:'up',y:0});return false;}return true;});}
  if(id==='bosque'){L.permDark=true;L.darkA=.84;L.lanterns=[];for(let x=420;x<L.len-300;x+=430){const fl=L.floorAt(x);L.lanterns.push({x,y:(isFinite(fl)?fl:GROUND)-180,lit:false});}
    let gi=0;for(const s of L.solids)if(s.ground){if(gi%2===1&&s.w>200)s.ice=true;gi++;}}
  const up=L.update;L.update=dt=>{up(dt);if(L.state!=='play')return;
    if(id==='teleferico'){L.icT-=dt;if(L.icT<=0){L.icT=2.4+rand()*1.2;const al=alive(L);if(al.length){const p=pick(al);for(let i=0;i<2;i++)spawnEB(L,{k:'shot',x:clamp(p.x+(i?1:-1)*(60+rand()*140),L.camX+30,L.camX+W-30),y:-20-i*60,vx:0,vy:300,r:11,spr:'hielo',fall:true});sfx('crack');}}}
    if(id==='fundicion')for(const q of L.presses){if(q.x<L.camX-200||q.x>L.camX+W+200)continue;q.t-=dt;
      if(q.st==='up'&&q.t<=0){q.st='warn';q.t=.75;sfx('warn');}else if(q.st==='warn'&&q.t<=0){q.st='down';q.t=.12;}
      else if(q.st==='down'){q.y=clamp(1-q.t/.12,0,1);if(q.t<=0){q.st='hold';q.t=.45;q.y=1;shake(L,10);sfx('stomp');puff(L,q.x,GROUND-4,8);}}
      else if(q.st==='hold'&&q.t<=0){q.st='rise';q.t=.6;}else if(q.st==='rise'){q.y=clamp(q.t/.6,0,1);if(q.t<=0){q.st='up';q.t=1.5;q.y=0;}}
      if(q.st==='down'||q.st==='hold'){const bot=lerp(130,GROUND,q.y);for(const p of alive(L))if(Math.abs(p.x-q.x)<56&&bot>p.y-70&&p.inv<=0)hurt(L,p);}}
    if(id==='bosque')for(const ln of L.lanterns){if(ln.lit)continue;for(const b of L.bul)if(dist(b.x,b.y,ln.x,ln.y)<28){ln.lit=true;b.life=0;sfx('ding');sparks(L,ln.x,ln.y,12,'#ffe27a');pop(L,ln.x,ln.y-40,'¡LUZ!',C.gold);break;}}};
  const dw=L.drawWorld;L.drawWorld=()=>{if(id==='fundicion'){ctx.save();const g=ctx.createLinearGradient(0,GROUND+20,0,H);g.addColorStop(0,'#ffb35a');g.addColorStop(.3,'#e8562e');g.addColorStop(1,'#7a1e10');ctx.fillStyle=g;ctx.fillRect(L.camX-10,GROUND+24,W+20,H-GROUND);
      for(let i=0;i<8;i++){const x=L.camX+((i*131+L.t*40)%W),k=(L.t+i*.3)%1;circ(x,GROUND+30+k*20,3+k*4,'rgba(255,240,170,.7)',0);}ctx.restore();}
    if(id==='bosque')drawLanterns(L);dw();if(id==='teleferico')drawGondolas(L);if(id==='fundicion')drawPresses(L);
    if(id==='bosque')for(const s of L.solids)if(s.ice&&s.x+s.w>L.camX&&s.x<L.camX+W){ctx.save();ctx.globalAlpha=.55;rr(s.x,s.y-2,s.w,10,4,'#bfe6f7',0);ctx.globalAlpha=.9;for(let x=s.x+20;x<s.x+s.w-20;x+=60)line(x,s.y+2,x+22,s.y+2,2,'#ffffff');ctx.restore();}};
  return L;};
/* far and middle layers of the three new levels */
const _runLayers4=runLayers;
runLayers=function(k){if(!['teleferico','fundicion','bosque'].includes(k))return _runLayers4(k);if(RUNBG.k===k)return RUNBG;const th=RUN_THEMES[k];
  const [sk,s]=mk(W,H);skyG(s,th.sky[0],th.sky[1],H);
  if(k==='bosque'){starsG(s,80,41);for(let i=0;i<3;i++){s.globalAlpha=.25;s.strokeStyle=['#7bd389','#6fb7ff','#c58ad8'][i];s.lineWidth=26;s.beginPath();for(let x=0;x<=W;x+=20)s.lineTo(x,80+i*30+Math.sin(x*.01+i)*30);s.stroke();}s.globalAlpha=1;}
  else if(k==='fundicion'){for(let i=0;i<30;i++){s.fillStyle='rgba(20,13,8,.4)';s.beginPath();s.arc((i*97)%W,(i*53)%240,10+(i%4)*8,0,TAU);s.fill();}}
  else{s.fillStyle='rgba(255,252,235,.9)';s.beginPath();s.arc(780,110,48,0,TAU);s.fill();cloudShape(s,120,90,.8,'#ffffff');cloudShape(s,460,60,.6,'#ffffff');}
  const [fc,g]=mk(1200,H);g.lineWidth=3;g.strokeStyle='rgba(20,13,8,.75)';
  if(k==='teleferico'){gMount(g,[[-20,GROUND-50],[140,GROUND-300],[300,GROUND-160],[480,GROUND-340],[680,GROUND-180],[860,GROUND-320],[1040,GROUND-150],[1220,GROUND-60]],'#a9bdd0');
    g.strokeStyle='rgba(20,13,8,.7)';g.lineWidth=2;g.beginPath();g.moveTo(0,150);g.quadraticCurveTo(600,230,1200,140);g.stroke();for(const x of[150,600,1050]){gR(g,x-6,160,12,GROUND-210,'#6f685b',2.5);gR(g,x-30,150,60,10,'#6f685b',2.5);}
    gR(g,400,176,46,30,'#c8392b',2.5,6);gR(g,860,170,46,30,'#2e8f86',2.5,6);}
  else if(k==='fundicion'){for(const [x,h] of[[80,260],[260,330],[560,280],[860,350],[1080,240]]){gR(g,x-40,GROUND-50-h,80,h,'#2b1f1a',3);gR(g,x-16,GROUND-90-h,32,46,'#2b1f1a',3);for(let i=0;i<3;i++){g.fillStyle='#ffb35a';g.fillRect(x-26+i*20,GROUND-h,12,18);}
      for(let i=0;i<3;i++){g.beginPath();g.arc(x+i*16,GROUND-110-h-i*30,14+i*6,0,TAU);g.fillStyle='rgba(80,70,70,.6)';g.fill();}}
    g.strokeStyle='#ff8a2e';g.lineWidth=10;g.beginPath();g.moveTo(400,140);g.quadraticCurveTo(430,260,420,GROUND-60);g.stroke();g.lineWidth=3;g.strokeStyle='rgba(20,13,8,.75)';}
  else{for(let i=0;i<16;i++)gPine(g,40+i*76,GROUND-46+(i%3)*6,1.2+(i%4)*.2,'#17202e',false);}
  g.fillStyle=k==='fundicion'?'#2b1f1a':k==='bosque'?'#1a2332':'#dfe8ee';g.fillRect(0,GROUND-52,1200,60);g.beginPath();g.moveTo(0,GROUND-52);g.lineTo(1200,GROUND-52);g.stroke();
  const [mc,m]=mk(1000,H);m.beginPath();m.moveTo(0,H);for(let x=0;x<=1000;x+=10)m.lineTo(x,GROUND-34-Math.sin(x*TAU/1000)*18-Math.sin(x*TAU/500)*8);m.lineTo(1000,H);m.closePath();m.fillStyle=th.mid;m.fill();m.lineWidth=3.5;m.strokeStyle=C.ink;m.stroke();
  if(k!=='fundicion')for(let i=0;i<8;i++)gPine(m,60+i*130,GROUND-30-Math.sin((60+i*130)*TAU/1000)*18,.8,k==='bosque'?'#24324a':'#4f7a66',k!=='bosque');
  RUNBG={k,sky:sk,far:fc,mid:mc};return RUNBG;};
defMaus('mausoleo5','Mausoleo de la Escarcha',4,[{n:11,gap:1.5,spd:140,pair:true},{n:13,gap:1.4,spd:150,pair:true,fast:true},{n:15,gap:1.35,spd:155,pair:true,fast:true}],'helada',{tint:'rgba(150,200,240,.25)',song:'mausoleo5'});

/* ---------- lists ---------- */
BOSS_LIST[4]=['tempano','cometa','pinguino','volcana','termometro','polilla','hollin'];RUN_LIST[4]=['teleferico','fundicion','bosque'];
for(const k of[...RUN_LIST[4],...BOSS_LIST[4]])if(!ALL_LEVELS.includes(k))ALL_LEVELS.push(k);
const GUARDIANS=BOSS_LIST[4].slice(0,6);

/* ---------- music: hot 78s from 1917–1925 (public domain) ---------- */
Object.assign(PACK,{map4:['pd-map4','Doodle-Doo-Doo — Varsity Eight (1924)','pd'],
  tempano:['pd-tempano','Frivolity One-Step — George Hamilton Green (1918)','pd'],cometa:['pd-cometa','Panama — Friars Society Orchestra (1922)','pd'],
  pinguino:['pd-pinguino','Bow-Wow One-Step — Wiedoeft-Wadsworth Quartet (1920)','pd'],volcana:['pd-volcana','Milenberg Joys — Perry\'s Hot Dogs (1925)','pd'],
  termometro:['pd-termometro','Twelfth Street Rag — Palace Trio (1920)','pd'],polilla:['pd-polilla','Royal Garden Blues — Noble Sissle and his Sizzling Syncopators (1921)','pd'],
  hollin:['pd-hollin','Sensation — Wadsworth\'s Novelty Dance Orchestra (1918)','pd'],teleferico:['pd-teleferico','Take a Little One Step — Sam Lanin\'s Dance Orchestra (1924)','pd'],
  fundicion:['pd-fundicion','Seven or Eleven — Cleveland Society Orchestra (1923)','pd'],bosque:['pd-bosque','Weary Blues — Louisiana Five (1918)','pd'],mausoleo5:['pd-mausoleo5','Pozzo One-Step — Frisco "Jass" Band (1917)','pd']});
Object.assign(PACK_FINAL,{tempano:['pd-tempano-f','Me-Ow One-Step — Jaudas\' Society Orchestra (1919)','pd'],cometa:['pd-cometa-f','Bugle Call Rag — Banner Dance Orchestra (1923)','pd'],
  pinguino:['pd-pinguino-f','One Step — Earl Fuller\'s Famous Jazz Band (1918)','pd'],volcana:['pd-volcana-f','Charleston Mad — Mayfield Dance Orchestra (1925)','pd'],
  termometro:['pd-termometro-f','Toddle — Harry Raderman\'s Jazz Orchestra (1921)','pd'],polilla:['pd-polilla-f','Lazy Daddy — Bix Beiderbecke and the Wolverines (1924)','pd'],
  hollin:['pd-hollin-f','Charleston Rhythm — Original Dixie Rag Pickers (1925)','pd']});
Object.assign(SONGS,{map4:nsong('map3','Valle Escarcha',401),tempano:nsong('reloj','Patinaje Loco',403),cometa:nsong('baron','Hilo al Viento',405),pinguino:nsong('ballena','Marcha Polar',407),
  volcana:nsong('caldera','Lava Danzante',409),termometro:nsong('maquina','Frío y Calor',411),polilla:nsong('vela','Vals de las Lámparas',413),hollin:nsong('apagon','El Señor del Humo',415),
  teleferico:nsong('nubes','Cabinas Colgantes',417),fundicion:nsong('mina','Martillos y Brasas',419),bosque:nsong('torre','Faroles Dormidos',421),mausoleo5:nsong('mausoleo','Corazón de Hielo',423)});

/* ---------- the map of the fourth island ---------- */
WORLDS[4]={name:'Valle Escarcha',song:'map4',W:2000,H:1250,seed:17,sea:'#6f93ad',seaD:'#577a94',grass:'#e6edf1',grassD:'#bfccd6',sand:'#d9d2c2',tree:'pine',night:false,start:[400,900],dockArr:[400,900],
  isles:[{x:850,y:700,rx:760,ry:440},{x:500,y:330,rx:320,ry:170},{x:1300,y:330,rx:300,ry:170},{x:1000,y:1150,rx:90,ry:60,hidden:true},{x:1810,y:600,rx:170,ry:200}],ponds:[],
  bridges:[{x:1560,y:578,w:110,h:46,open:()=>cleared(GUARDIANS)>=6,need:'El puente al Palacio del Hollín solo baja cuando caen los seis guardianes del valle.'}],
  nodes:[{id:'dock',x:360,y:960,kind:'dock',name:'Capitán Remo',ob:20},{id:'shop',x:580,y:860,kind:'shop',name:'Bazar de Don Tornillo',ob:36,bld:'tienda'},
    {id:'teleferico',x:280,y:680,kind:'level',ob:36,bld:'teleferico',em:'nieve'},{id:'fundicion',x:1340,y:960,kind:'level',ob:38,bld:'fundicion',em:'brasa'},
    {id:'tempano',x:520,y:320,kind:'level',ob:36,bld:'pista',em:'hielo'},{id:'cometa',x:1000,y:440,kind:'level',ob:32,bld:'cometa',em:'farolillo'},
    {id:'pinguino',x:1320,y:310,kind:'level',ob:36,bld:'molino',em:'pez'},{id:'volcana',x:900,y:1010,kind:'level',ob:40,bld:'volcan',em:'brasa'},
    {id:'termometro',x:1250,y:680,kind:'level',ob:34,bld:'observatorio',em:'nieve'},{id:'polilla',x:720,y:620,kind:'level',ob:36,bld:'lamparas',em:'pluma'},
    {id:'hollin',x:1830,y:600,kind:'level',ob:46,bld:'palacio',em:'humo'},{id:'sign2',x:1500,y:620,kind:'sign',name:'Letrero',bridge:0},
    {id:'abuelo',x:470,y:1000,kind:'npc',npc:'abuelo',name:'Abuelo Carámbano',ob:14},{id:'pia',x:1100,y:850,kind:'npc',npc:'pia',name:'Pingüina Pía',ob:14},
    {id:'tree1',x:1150,y:1050,kind:'tree',name:'Pino nevado que tiembla',ob:22,coin:'w4-tree'},{id:'sign1',x:460,y:760,kind:'sign',name:'Letrero',text:'Valle Escarcha. Aquí el suelo resbala, las nubes se van y el humo esconde a su dueño. Vence a los seis guardianes y el puente del palacio bajará.'},
    {id:'bosque',x:1010,y:760,kind:'level',ob:34,bld:'bosque',em:'nieve'},{id:'mausoleo5',x:760,y:850,kind:'level',ob:30,bld:'mausoleo',em:'ghostE'},
    {id:'pregonero4',x:880,y:560,kind:'npc',npc:'pregonero',name:'Periquín',ob:14}],
  coins:[{id:'w4-c1',x:150,y:700},{id:'w4-c2',x:1000,y:1165},{id:'w4-c4',x:1480,y:260}],items:[],
  roads:[['dock','shop'],['shop','teleferico'],['teleferico','tempano'],['tempano','polilla'],['polilla','cometa'],['cometa','pinguino'],['shop','volcana'],['volcana','fundicion'],['fundicion','termometro'],['termometro','sign2'],['polilla','termometro'],['shop','abuelo'],['polilla','bosque'],['bosque','termometro'],['shop','mausoleo5'],['shop','sign1']],windmills:[]};
const _mapTree4=mapTree;
mapTree=function(g,type,x,y,r){if(type!=='pine'){_mapTree4(g,type,x,y,r);return;}g.beginPath();g.ellipse(x,y+4,16,6,0,0,TAU);g.fillStyle='rgba(20,13,8,.25)';g.fill();gPine(g,x,y,.72,'#4f7a66');};
const _mapAmb4=mapAmbience;
mapAmbience=function(w,M){_mapAmb4(w,M);if(save.island!==4)return;const t=M.t,cx=clamp(M.x-W/2,0,w.W-W),cy=clamp(M.y-H/2,0,w.H-H);ctx.save();
  for(let i=0;i<70;i++){const x=cx+(((i*97+t*(14+i%4*6))%W)+W)%W,y=cy+((i*53+t*(36+i%3*14))%H);circ(x+Math.sin(t*2+i)*6,y,1.4+(i%3),'rgba(255,255,255,.9)',0);}ctx.restore();};

/* buildings of the valley */
const B4=['pista','cometa','volcan','observatorio','lamparas','palacio','teleferico','fundicion','bosque'];
const _drawBld4=drawBld;
drawBld=function(n,t,night){if(!B4.includes(n.bld)){_drawBld4(n,t,night);return;}const x=n.x,y=n.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;shadowE(x,y+2,(n.ob||20)+14,.22);
  const snow=(x0,y0,w)=>{ctx.beginPath();ctx.moveTo(x0,y0);for(let i=0;i<=6;i++)ctx.lineTo(x0+w*i/6,y0+(i%2?6:-2));ctx.lineTo(x0+w,y0-6);ctx.lineTo(x0,y0-6);ctx.closePath();ctx.fillStyle='#f4f8fb';ctx.fill();ctx.lineWidth=2.5;ctx.stroke();};
  switch(n.bld){
    case 'pista':ell(x,y-6,46,16,'#cfe6f2',3.5);for(let i=0;i<10;i++){const a=i*TAU/10;rr(x+Math.cos(a)*48-3,y-6+Math.sin(a)*17-14,6,14,2,C.woodL,2);}line(x-30,y-30,x+30,y-30,2);for(let i=0;i<5;i++)circ(x-30+i*15,y-27,3,['#e86a5a','#f2c14e','#7bb7c9'][i%3],1);
      ctx.save();ctx.translate(x+Math.sin(t*2)*20,y-12);rr(-8,-16,16,16,4,'#c9ecfa',2.5);ctx.restore();break;
    case 'cometa':line(x,y,x,y-90,4);rr(x-20,y-24,40,24,4,C.woodL);ctx.save();ctx.translate(x+30+Math.sin(t*2)*10,y-110+Math.sin(t*3)*8);ctx.rotate(Math.sin(t*2)*.2);poly([[0,-26],[20,0],[0,28],[-20,0]],'#e8562e',3);ell(-5,-4,2,3,C.ink,0);ell(5,-4,2,3,C.ink,0);ctx.restore();
      ctx.beginPath();ctx.moveTo(x,y-90);ctx.quadraticCurveTo(x+20,y-110,x+30+Math.sin(t*2)*10,y-110+Math.sin(t*3)*8);ctx.lineWidth=1.5;ctx.stroke();break;
    case 'volcan':ctx.beginPath();ctx.moveTo(x-50,y);ctx.lineTo(x-14,y-70);ctx.lineTo(x+14,y-70);ctx.lineTo(x+50,y);ctx.closePath();ctx.fillStyle='#6b3a2a';ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(x-14,y-70);ctx.quadraticCurveTo(x-6,y-50,x-10,y-36);ctx.lineWidth=6;ctx.strokeStyle='#ff7a2e';ctx.stroke();ctx.strokeStyle=C.ink;ctx.lineWidth=3.5;
      for(let i=0;i<3;i++){const k=(t*.6+i/3)%1;circ(x+Math.sin(t+i)*8,y-80-k*50,7+k*10,`rgba(80,70,70,${.8-k*.7})`,0);}ell(x-14,y-24,3,4,C.ink,0);ell(x+14,y-24,3,4,C.ink,0);break;
    case 'observatorio':rr(x-26,y-56,52,56,4,C.paper);ctx.beginPath();ctx.arc(x,y-56,30,Math.PI,0);ctx.closePath();ctx.fillStyle='#9fb3c8';ctx.fill();ctx.stroke();snow(x-30,y-60,60);
      rr(x+20,y-100,14,70,7,'rgba(240,248,250,.95)',3);rr(x+24,y-60+Math.sin(t*2)*10,6,32-Math.sin(t*2)*10,3,'#e8402e',0);circ(x+27,y-28,9,'#e8402e',3);rr(x-8,y-26,16,26,6,C.wood);break;
    case 'lamparas':rr(x-34,y-50,68,50,4,'#4a2f4a');for(let i=0;i<3;i++){const lx=x-22+i*22,gl=Math.sin(t*4+i)>0;poly([[lx-9,y-34],[lx-5,y-44],[lx+5,y-44],[lx+9,y-34]],gl?'#ffd35a':'#c26aa8',2);}
      poly([[x-42,y-48],[x,y-82],[x+42,y-48]],'#8a2a40');snow(x-40,y-52,80);for(let i=0;i<2;i++){const a=t*3+i*3;ctx.save();ctx.translate(x+Math.cos(a)*30,y-60+Math.sin(a*1.3)*16);ell(-5,0,5,3,'#e9dcc0',1.5);ell(5,0,5,3,'#e9dcc0',1.5);ctx.restore();}rr(x-8,y-24,16,24,6,C.wood);break;
    case 'palacio':{const op=cleared(GUARDIANS)>=6;rr(x-56,y-80,112,80,4,'#2b1f1a');for(const d of[-1,1]){rr(x+d*44-12,y-130,24,60,3,'#3a2a22');for(let i=0;i<2;i++){const k=(t*.5+i/2)%1;circ(x+d*44,y-140-k*60,10+k*14,`rgba(40,34,38,${.8-k*.6})`,0);}}
      poly([[x-60,y-78],[x,y-118],[x+60,y-78]],'#3a1a14');rr(x-18,y-40,36,40,18,op?'#ff8a2e':'#140d08');for(const d of[-1,1])circ(x+d*30,y-56,6,op?'#ffd35a':'#5a3a2a',2);
      if(!op){for(let i=0;i<4;i++)line(x-14+i*9,y-40,x-14+i*9,y,2.5,C.steel);}break;}
    case 'teleferico':rr(x-30,y-40,60,40,4,C.woodL);poly([[x-36,y-38],[x,y-62],[x+36,y-38]],C.rust);snow(x-34,y-42,68);line(x,y-62,x+80,y-120,2.5);
      {const k=(t*.15)%1;ctx.save();ctx.translate(x+k*80,y-62-k*58);line(0,0,0,12,2);rr(-12,12,24,16,4,'#c8392b',2.5);ctx.restore();}break;
    case 'fundicion':rr(x-40,y-54,80,54,3,'#4a3a32');rr(x+14,y-100,18,50,2,'#3a2a22');for(let i=0;i<3;i++){const k=(t*.7+i/3)%1;circ(x+23+Math.sin(t+i)*6,y-108-k*50,8+k*10,`rgba(60,52,58,${.8-k*.7})`,0);}
      for(let i=0;i<3;i++)rr(x-32+i*20,y-40,12,14,2,Math.sin(t*5+i)>0?'#ffb35a':'#e8562e',2);ctx.save();ctx.translate(x-20,y-60);ctx.rotate(t*2);star(0,0,12,8,8);ctx.fillStyle=C.brass;ctx.fill();ctx.stroke();ctx.restore();break;
    case 'bosque':for(const [dx,s] of[[-26,.9],[0,1.2],[26,.95]]){ctx.save();line(x+dx,y,x+dx,y-10,4,'#5a3a20');for(let i=0;i<3;i++){const yy=y-10-i*14*s,w=(22-i*5)*s;poly([[x+dx-w,yy],[x+dx,yy-22*s],[x+dx+w,yy]],'#24324a',2.5);}ctx.restore();}
      {const gl=.5+.5*Math.sin(t*3);circ(x,y-12,6,`rgba(255,220,140,${.4+gl*.6})`,2);}break;}
  if(n.em){circ(x-(n.ob||30)-6,y-14,13,C.paper,3);ctx.save();ctx.translate(x-(n.ob||30)-6,y-14);ctx.scale(.55,.55);drawSpr({x:0,y:0,spr:n.em,r:16,rot:0,vx:-1,vy:0,ch:'A'},t);ctx.restore();}
  ctx.restore();};

/* ---------- people of the valley ---------- */
const _drawNPC4=drawNPC;
drawNPC=function(id,x,y,t){if(id!=='abuelo'&&id!=='pia'){_drawNPC4(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  if(id==='abuelo'){const b=Math.sin(t*2)*2;poly([[-14,-50+b],[14,-50+b],[4,0],[-4,0]],'#c9ecfa',3);ell(-4,-44+b,3,8,'rgba(255,255,255,.7)',0);ell(-5,-38+b,2.4,3.4,C.ink,0);ell(5,-38+b,2.4,3.4,C.ink,0);
    ctx.beginPath();ctx.moveTo(-10,-30+b);ctx.quadraticCurveTo(0,-8+b+Math.sin(t*3)*2,10,-30+b);ctx.fillStyle='#f4f8fb';ctx.fill();ctx.stroke();line(-7,-44+b,-1,-46+b,2);line(7,-44+b,1,-46+b,2);
    line(12,-20,22,0,3,C.woodD);ell(0,-54+b,16,5,'#7a4a20',2.5);rr(-9,-66+b,18,12,3,'#7a4a20',2.5);}
  else{const w=Math.sin(t*6)*.12;ctx.rotate(w);ell(0,-20,15,20,'#2b2a33',3);ell(-2,-16,9,13,'#f4f4ee',0);ell(-5,-28,2,3,C.ink,0);ell(4,-28,2,3,C.ink,0);poly([[-1,-24],[-12,-21],[-1,-18]],'#f2a43a',1.5);
    rr(-18,-48,30,9,3,'#2e5f8a',2.5);rr(-14,-56,22,10,3,'#2e5f8a',2.5);rr(8,-22,18,14,2,'#c79a5e',2.5);line(8,-22,26,-8,1.5);line(26,-22,8,-8,1.5);ell(-6,0,6,3,'#f2a43a',2);ell(6,0,6,3,'#f2a43a',2);}
  ctx.restore();};
const _npcTalk4=npcTalk;
npcTalk=function(n){const f=save.flags;if(n.npc==='abuelo'){sfx('pageTurn');const beat=cleared(GUARDIANS);
    const lines=['¡Brrr! Bienvenidos al Valle Escarcha, muchachos. Aquí el hielo resbala: si sueltas la flecha, sigues patinando un rato.','En la Pista Helada viven los Hermanos Témpano. Uno grande y gruñón, otro chiquito y travieso. ¡Salta por encima del chico!',
      'La Dragona Cometa vuela sobre un mar de nubes. Las nubes se van solas hacia la izquierda: no te quedes quieto o te caes.','Si te caes a un hoyo, no pasa nada grave: rebotas hacia arriba y pierdes una vida. ¡Aprovecha esos segundos de parpadeo!',
      'Don Hollín vive en su palacio, al otro lado del puente. Dicen que fue él quien le prestó la sombra al Rey Apagón…'];
    if(!f.abueloCoin&&beat>=3){f.abueloCoin=true;save.coins++;persist();sfx('kaching');say(n.name,'¡Tres guardianes vencidos! Toma una moneda de mi calcetín de lana. Está un poco fría, perdón.');return;}
    f.abueloI=((f.abueloI||0)+1)%lines.length;persist();say(n.name,lines[f.abueloI]);return;}
  if(n.npc==='pia'){sfx('pageTurn');const beat=cleared(GUARDIANS);
    const lines=['¡Correo del valle! Traigo una carta para Don Hollín, pero nadie se atreve a cruzar el puente. ¡Y está calentita!',
      'Mamá Volcana pide que no le pisen la lava. Cuando el suelo brille, ¡súbanse a las piedras!','En el observatorio, el Doctor Termómetro cambia de humor: con frío todo resbala y con calor salen chorros de fuego del suelo.',
      'La Reina Polilla adora la luz. Cuando el suelo de su galería se hunda, ¡quédense en los candelabros!'];
    if(!f.piaCoin&&beat>=5){f.piaCoin=true;save.coins+=2;persist();sfx('kaching');say(n.name,'¡Cinco guardianes! Aquí tienen dos monedas de propina. ¡Que el cartero también reparte alegría!');return;}
    f.piaI=((f.piaI||0)+1)%lines.length;persist();say(n.name,lines[f.piaI]);return;}
  _npcTalk4(n);};
/* the newspaper counts every boss of the game */
newsLine=(function(prev){return function(){const s=prev();const tot=[1,2,3,4].reduce((a,i)=>a+(BOSS_LIST[i]||[]).length,0);return s.replace('de 17 jefes','de '+tot+' jefes');};})(newsLine);

/* ---------- Captain Remo sails to the fourth island once the Rey Apagón is down ---------- */
dockTalk=function(){const isl=save.island,opts=[];const b1=cleared(BOSS_LIST[1])>=5,b2=cleared(BOSS_LIST[2])>=5,b3=!!save.cleared.apagon;
  const go=i=>()=>{transition(()=>{save.pos[save.island]=[MAPS.x,MAPS.y];save.island=i;save.visited[i]=true;const w=WORLDS[i];save.pos[i]=w.dockArr;persist();MAPBG={k:null};placeOnMap();MAPS.jukebox=null;MAPS.banner={t:3,text:w.name};toMap();});};
  if(isl!==1)opts.push({label:'Viajar a Isla de Hojalata',fn:go(1)});
  if(isl!==2&&(b1||save.visited[2]))opts.push({label:'Viajar a Bahía Bruma',fn:go(2)});
  if(isl!==3&&(b2||save.visited[3]))opts.push({label:'Viajar a Cumbre Apagón',fn:go(3)});
  if(isl!==4&&(b3||save.visited[4]))opts.push({label:'Viajar a Valle Escarcha',fn:go(4)});
  opts.push({label:'Quedarme aquí',fn:()=>{}});
  const left=isl===1?5-cleared(BOSS_LIST[1]):isl===2?5-cleared(BOSS_LIST[2]):0;let txt0='¡Ahoy! ¿A qué isla navegamos?';
  if(isl<3&&left>0&&!save.visited[isl+1])txt0=`¡Ahoy! Mi barco no zarpa a la siguiente isla hasta que venzas a los cinco jefes de aquí. Te faltan ${left}.`;
  else if(isl===3&&!b3&&!save.visited[4])txt0='¡Ahoy! Dicen que más allá de la niebla hay un valle helado… pero no me acerco mientras el Rey Apagón siga en su castillo.';
  else if(b3&&!save.visited[4])txt0='¡Ahoy! Con el Rey Apagón fuera de combate, la niebla se levantó: ¡hay una cuarta isla, el Valle Escarcha! Abríguense bien.';
  say('Capitán Remo',txt0,opts);};

/* ---------- the shop also gets the valley items ---------- */
if(typeof refreshShopTabs==='function')refreshShopTabs();

/* ---------- achievements, the true ending ---------- */
ACH.push(['valle','Deshielo','Vence a los seis guardianes del Valle Escarcha.',3],['hollin','Sin Humo','Vence a Don Hollín, el señor del humo.',5],['maus5','Corazón de Hielo','Supera el Mausoleo de la Escarcha.',2]);
for(const [id,name,desc,coins] of ACH.slice(-3))ACHD[id]={id,name,desc,coins};
const _finish4=finish;
finish=function(L){_finish4(L);if(L.id==='hollin')unlockAch('hollin');if(L.id==='mausoleo5')unlockAch('maus5');if(GUARDIANS.every(k=>save.cleared[k]))unlockAch('valle');};
STORIES.ending2=[{t:'Con su última brasa apagada, Don Hollín se deshizo en una nubecita de humo… que estornudó y se fue volando, muy avergonzada.',d:'hollin'},
  {t:'Resulta que él le había prestado su sombra al Rey Apagón. Sin humo ni sombras, el Valle Escarcha brilló bajo la aurora y las cuatro islas se encendieron.',d:'islas'},
  {t:'Chispa, Cerilla y Velita volvieron a casa con las cuatro islas iluminadas. ¡Ahora sí: FIN DE VERDAD! (Aunque siempre se puede buscar la nota S…)',d:'heroes'}];
const _afterLevel4=afterLevel;
afterLevel=function(L){if(L.id==='hollin'&&!save.flags.ending2&&!(L.result&&L.result.fail)){save.flags.ending2=true;persist();startStory('ending2');return;}_afterLevel4(L);};
const _startStory4=startStory;startStory=function(k){_startStory4(k);if(k==='ending2')Music.play('ending');};
const _drawStory4=drawStory;
drawStory=function(){const p=ST.pages[ST.i];if(!p||p.d!=='hollin'){_drawStory4();return;}ctx.fillStyle='#e9d9b4';ctx.fillRect(0,0,W,H);rr(60,30,840,330,6,'#f4e7c6',5);ctx.save();ctx.beginPath();ctx.rect(62,32,836,326);ctx.clip();
  ctx.fillStyle='#3a1a14';ctx.fillRect(62,32,836,326);const B={x:480,y:GROUND,fy:190,t:ST.t,phase:3,mouth:.5,dead:true,flash:0,anim:0,squash:0,act:null,throwT:0,def:LEVELS.hollin};
  try{LEVELS.hollin.draw(B,{t:ST.t,Ps:[{x:200,y:300,dead:false,type:'plat',duck:false}]});}catch(_){}
  ctx.restore();wrap(p.t.slice(0,Math.floor(ST.t*40)),90,404,780,30,21,C.ink,700);btxt(`${ST.i+1}/${ST.pages.length} · Aceptar para seguir`,W-70,H-24,14,C.rustD,'right',800);};
if(window.__game){window.__game.BOSS_LIST=BOSS_LIST;window.__game.RUN_LIST=RUN_LIST;}
