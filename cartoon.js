'use strict';
/* ================= CARTOON PASS: boss taunts & KO gags, new map NPCs & quests, map ambience, livelier shop =================
   Everything here is original: our own characters, lines and gags in a 1930s rubber-hose style. Loaded after world.js. */

/* ---------- boss taunts (intro, every phase change) ---------- */
const TAUNTS={
  reloj:['¡Tic-tac! ¡Se te acabó el recreo!','¡Te voy a dar la hora… a golpes!','¡RIIIING! ¡Hora de despertar para siempre!','¡Me quedan los segundos contados… y a ti también!'],
  gramo:['¡Un, dos, tres… y a bailar mi disco!','¡Este disco se rayó… igual que tu suerte!','¡Subo el volumen al máximo!','¡La última canción es la más fuerte!'],
  baron:['¡Despeguen motores, pilotos de papel!','¡Picada en tres, dos, uno!','¡Nadie le gana al Barón en el cielo!','¡Mayday, mayday… para ti!'],
  tostada:['¡Hoy desayuno valientes con mermelada!','¡Me estoy poniendo crujiente!','¡Cuidado, que salto del tostador!','¡Ya me quemé… y tú también!'],
  cascanueces:['¡Firmes, soldaditos! ¡A la carga!','¡Se me rompió una nuez… y la paciencia!','¡Tropa de reserva, al frente!','¡Último batallón, sin retirada!'],
  faro:['¡Ningún barco pasa por mi costa!','¡Ola va, ola viene!','¡Enciendo la luz más brillante!','¡Tormenta total!'],
  cangrejo:['¡Olé! ¡Bailemos con castañuelas!','¡Pinza va, pinza viene!','¡Zapateado de cangrejo!','¡El gran final flamenco!'],
  ballena:['¡Glub glub! ¿Vienen a nadar?','¡Chorro de agua a presión!','¡Me tragué un acordeón!','¡Gran ola final!'],
  paraguas:['¿Bailamos bajo la lluvia?','¡Que llueva, que llueva!','¡Granizo de sorpresa!','¡Tormenta de baile!'],
  caldera:['¡Uff, qué calor! ¡Fuera de mi sala!','¡Me sube la presión!','¡Válvulas al máximo!','¡Voy a estallar!'],
  vela:['Shhh… que se apaga la función.','¡Cera caliente para los curiosos!','¡Mi llama crece!','¡La última chispa es mía!'],
  buho:['¡SILENCIO en la biblioteca!','¡Multa por libro atrasado!','¡Capítulo dos: tu derrota!','¡Fin del cuento!'],
  murcielago:['¡Esta noche se baila el vals!','¡Ecos y más ecos!','¡Las luces se apagan!','¡Vals final a medianoche!'],
  espantapajaros:['¡Fuera de mi maizal!','¡Cuervos, al ataque!','¡Paja voladora!','¡Cosecha final!'],
  maquina:['¡Su cita fue cancelada!','¡Tecleo a doscientas palabras por minuto!','¡Firma aquí… y aquí… y aquí!','¡Archivado para siempre!'],
  chistera:['¡Damas y caballeros… desaparezcan!','¡Nada por aquí, nada por allá!','¡Del sombrero sale… un problema!','¡Y para mi último truco!'],
  apagon:['¡Así que llegaron hasta mi castillo!','¡Las sombras son mías!','¡Apagaré cada chispa del mundo!','¡OSCURIDAD TOTAL!']};
function setTaunt(L,txt){if(!txt)return;L.taunt={text:txt,t0:L.t,dur:2.4};sfx('taunt');}
const _setPhaseC=setPhase;
setPhase=function(L,B,i,first){_setPhaseC(L,B,i,first);if(!first){const T=TAUNTS[L.id];if(T){const n=B.def.phases.length;setTaunt(L,i===n-1?T[T.length-1]:T[Math.min(i,T.length-2)]);}}};
function drawTaunt(L){const tt=L.taunt;if(!tt||!L.boss||L.boss.dead)return;const age=L.t-tt.t0;if(age>tt.dur){L.taunt=null;return;}
  const c=L.boss.center(),k=age<.2?age/.2:age>tt.dur-.25?(tt.dur-age)/.25:1;ctx.save();ctx.font=`900 16px ${BFONT}`;const w=Math.min(300,ctx.measureText(tt.text).width+34),
    x=clamp(c.x-L.camX-w/2,12,W-w-12),y=clamp(c.y-200,60,H-160);ctx.globalAlpha=k;ctx.translate(x+w/2,y+22);ctx.scale(.7+.3*k,.7+.3*k);ctx.translate(-(x+w/2),-(y+22));
  card(x,y,w,44,C.paper,3,14);poly([[x+w/2-10,y+42],[c.x-L.camX,y+70],[x+w/2+10,y+42]],C.paper,0);line(x+w/2-10,y+43,c.x-L.camX,y+70,3);line(x+w/2+10,y+43,c.x-L.camX,y+70,3);
  btxt(tt.text,x+w/2,y+23,15,C.ink,'center',900);ctx.restore();}
/* KO gag: dizzy stars and little birds circling the beaten boss */
function drawKOGag(L){if(L.state!=='ko'||!L.boss)return;const c=L.boss.center(),hx=c.x-L.camX,hy=c.y-130+Math.sin(L.t*3)*6,t=L.t;
  ctx.save();ctx.globalAlpha=Math.min(1,L.stateT*2);for(let i=0;i<5;i++){const a=t*4+i*TAU/5,x=hx+Math.cos(a)*60,y=hy+Math.sin(a)*16;
    if(i%2){ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;const f=Math.sin(t*16+i)*5;ctx.beginPath();ctx.moveTo(x-9,y-f);ctx.quadraticCurveTo(x-3,y-6,x,y);ctx.quadraticCurveTo(x+3,y-6,x+9,y-f);ctx.stroke();}
    else{star(x,y,10,4.5,5,t*5+i);ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();}}
  ctx.restore();}
const _drawLevelC=drawLevel;
drawLevel=function(L){_drawLevelC(L);if(L.boss){if(L.state==='intro'&&L.stateT>1.25&&!L.tauntedIntro){L.tauntedIntro=true;const T=TAUNTS[L.id];if(T)setTaunt(L,T[0]);}
  if(L.state==='play'||L.state==='intro')drawTaunt(L);drawKOGag(L);}};

/* ---------- new map NPCs (original characters) ---------- */
function addNode(wi,n){const w=WORLDS[wi];if(!w.nodes.some(x=>x.id===n.id))w.nodes.push(n);}
addNode(1,{id:'tetera',x:600,y:560,kind:'npc',npc:'tetera',name:'Doña Tetera',ob:16});
addNode(1,{id:'pregonero1',x:980,y:520,kind:'npc',npc:'pregonero',name:'Periquín',ob:14});
addNode(2,{id:'tito',x:560,y:640,kind:'npc',npc:'tito',name:'Tito Trompeta',ob:16});
addNode(2,{id:'pregonero2',x:760,y:700,kind:'npc',npc:'pregonero',name:'Periquín',ob:14});
addNode(3,{id:'fantasmin',x:880,y:560,kind:'npc',npc:'fantasmin',name:'Fantasmín',ob:14});
addNode(3,{id:'pregonero3',x:480,y:760,kind:'npc',npc:'pregonero',name:'Periquín',ob:14});
WORLDS[2].items.push({id:'nota1',x:180,y:960,note:true},{id:'nota2',x:1300,y:700,note:true},{id:'nota3',x:1600,y:420,note:true});
const _drawNPCC=drawNPC;
drawNPC=function(id,x,y,t){if(!['tetera','tito','fantasmin','pregonero'].includes(id)){_drawNPCC(id,x,y,t);return;}
  ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;const b=Math.sin(t*3)*2;
  if(id!=='fantasmin')shadowE(0,0,18);
  if(id==='tetera'){/* round teapot granny with glasses, apron and a puffing spout */
    for(const s of[-1,1]){rr(s*8-4,-10,8,10,2,C.ink,0);}
    ell(0,-30+b,24,20,'#e9d7c0');rr(-16,-26+b,32,16,4,'#f3a6a0',2);
    ctx.beginPath();ctx.moveTo(22,-34+b);ctx.quadraticCurveTo(38,-40+b,40,-52+b);ctx.lineWidth=7;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle='#e9d7c0';ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=C.ink;
    ctx.beginPath();ctx.arc(-26,-30+b,8,Math.PI*.5,Math.PI*1.5);ctx.lineWidth=4;ctx.stroke();ctx.lineWidth=3;
    ell(0,-50+b,16,5,'#d3bfa5');circ(0,-57+b,4,C.rust,2);
    for(const s of[-1,1]){circ(s*8,-34+b,5,'rgba(255,255,255,.7)',2);circ(s*8,-34+b,1.8,C.ink,0);}line(-3,-34+b,3,-34+b,2);
    ctx.beginPath();ctx.arc(0,-26+b,4,.1*Math.PI,.9*Math.PI);ctx.stroke();
    for(let i=0;i<3;i++){const k=(t*.7+i/3)%1;ctx.globalAlpha=(1-k)*.8;circ(42+k*6,-58+b-k*30,3+k*6,C.paper,2);ctx.globalAlpha=1;}}
  else if(id==='tito'){/* a dented brass trumpet on little legs, blowing notes */
    rr(-9,-14,6,14,2,C.ink,0);rr(3,-14,6,14,2,C.ink,0);
    ctx.save();ctx.translate(0,-34+b);ctx.rotate(-.25+Math.sin(t*2)*.06);
    rr(-22,-7,44,14,6,C.brass,3);ctx.beginPath();ctx.moveTo(20,-7);ctx.lineTo(34,-18);ctx.quadraticCurveTo(40,0,34,18);ctx.lineTo(20,7);ctx.closePath();ctx.fillStyle=C.brass;ctx.fill();ctx.stroke();
    ell(36,0,5,17,C.goldL||'#ffe9a0',3);for(const v of[-8,0,8])rr(v-2,-14,4,8,1,C.steel,2);rr(-28,-4,8,8,2,C.steel,2);
    for(const s of[-1,1]){circ(-8+s*6,-1,3.4,C.white,1.5);circ(-8+s*6+1,-1,1.6,C.ink,0);}ctx.restore();
    for(let i=0;i<3;i++){const k=(t*.6+i/3)%1;ctx.globalAlpha=1-k;txt(i%2?'♫':'♪',42+k*24,-60-k*40+Math.sin(k*9)*6,16,C.brass,C.ink);ctx.globalAlpha=1;}}
  else if(id==='fantasmin'){/* shy little sheet ghost with a bow tie */
    const fy=-34+Math.sin(t*2.4)*6;ctx.globalAlpha=.82;shadowE(0,0,12,.18);
    ctx.beginPath();ctx.moveTo(-16,fy+18);ctx.bezierCurveTo(-22,fy-26,22,fy-26,16,fy+18);for(let i=0;i<4;i++)ctx.quadraticCurveTo(12-i*9,fy+28+Math.sin(t*8+i)*4,8-i*9,fy+20);ctx.closePath();ctx.fillStyle='#f2f4f2';ctx.fill();ctx.stroke();
    ctx.globalAlpha=1;for(const s of[-1,1])ell(s*6,fy-4,2.6,4,C.ink,0);ctx.beginPath();ctx.arc(0,fy+5,3,0,Math.PI);ctx.lineWidth=2;ctx.stroke();
    poly([[0,fy+12],[-8,fy+7],[-8,fy+17]],C.rust,2);poly([[0,fy+12],[8,fy+7],[8,fy+17]],C.rust,2);ctx.fillStyle='rgba(230,120,140,.5)';for(const s of[-1,1]){ctx.beginPath();ctx.arc(s*11,fy+2,2.6,0,TAU);ctx.fill();}}
  else if(id==='pregonero'){/* Periquín: a folded newspaper with a cap, waving the latest edition */
    rr(-8,-14,6,14,2,C.ink,0);rr(2,-14,6,14,2,C.ink,0);
    rr(-16,-58+b,32,44,3,C.paper,3);for(let i=0;i<4;i++)line(-11,-48+b+i*7,11,-48+b+i*7,1.5,'#8a7650');rr(-11,-56+b,22,6,1,C.ink,0);
    ctx.beginPath();ctx.ellipse(0,-60+b,17,6,0,Math.PI,0);ctx.fillStyle='#5a6b8a';ctx.fill();ctx.stroke();rr(4,-62+b,16,4,2,'#5a6b8a',2);
    for(const s of[-1,1]){circ(s*6,-36+b,3,C.white,1.5);circ(s*6+1,-36+b,1.5,C.ink,0);}ctx.beginPath();ctx.ellipse(0,-27+b,4,3+Math.abs(Math.sin(t*6))*2,0,0,TAU);ctx.fillStyle=C.ink;ctx.fill();
    const wv=Math.sin(t*6)*.5;ctx.save();ctx.translate(18,-44+b);ctx.rotate(-.5+wv);rr(0,-14,18,22,1,C.paper,2);line(3,-8,15,-8,1.5);line(3,-3,15,-3,1.5);ctx.restore();
    if(Math.floor(t*1.5)%4===0){btxt('¡EXTRA!',0,-82+b,12,C.rust,'center',900);}}
  ctx.restore();};

/* dialogues */
const NPC_JOKES={
  cabo:['¡Firmes! …¿Ya me ves más alto? Me puse plantillas.','En mis tiempos los botones se cosían con alambre de púas.','¡Un, dos, un, dos! Perdón, es la costumbre.'],
  patita:['¡Cuac! ¿Sabías que los patos no sabemos nadar de espaldas? Yo tampoco.','Mi tía Pata vive en la cumbre. Dice que allí todo es muy… oscuro.','¡Cuac cuac! Eso significa «buena suerte» en patés.'],
  farol:['Dicen que si haces parry mil veces te salen chispas de las orejas.','De joven yo iluminaba toda una avenida. Ahora solo esta esquinita.'],
  remo:['¡Ahoy! Mi barco nunca se hunde. Bueno, solo los martes.','El mar está tranquilo hoy. Demasiado tranquilo…']};
const RIDDLES=[
  {q:'Tengo agujas pero no coso, tengo números pero no soy teléfono. ¿Qué soy?',o:['Un erizo','Un reloj','Una máquina de coser'],a:1},
  {q:'Cuanto más le quitas, más grande se hace. ¿Qué es?',o:['Un agujero','Una deuda','Un globo'],a:0},
  {q:'Vuelo sin alas, lloro sin ojos. ¿Quién soy?',o:['Un murciélago','Una nube','Un paraguas'],a:1}];
function bossesBeaten(){return BOSS_LIST[1].concat(BOSS_LIST[2],BOSS_LIST[3]).filter(k=>save.cleared[k]);}
function newsLine(){const bb=bossesBeaten(),last=bb.length?LEVELS[bb[bb.length-1]].name:null,best=Object.values(save.done).filter(g=>g==='S'||g==='A+').length,deaths=save.deaths||0;
  const pool=[`¡EXTRA, EXTRA! ¡Chispa y Cerilla ya vencieron a ${bb.length} de 17 jefes!`,
    last?`¡Última hora! «${last}» fue derrotado. ¡Los vecinos celebran con limonada!`:'¡Última hora! Nadie ha vencido todavía a un jefe. ¡Las apuestas están abiertas!',
    `¡Récord! Nuestros héroes ya sacaron ${best} notas A+ o S. ¡El periódico se queda sin tinta!`,
    deaths>10?`¡Escándalo! Dicen que nuestros héroes se cayeron ${deaths} veces… ¡pero siempre se levantan!`:'¡Clima! Soleado con probabilidad de balas de colores.',
    '¡Avisos! Don Tornillo tiene ofertas nuevas en su bazar. ¡No se lo pierdan!'];return pool[Math.floor(rand()*pool.length)];}
const _npcTalkC=npcTalk;
npcTalk=function(n){const f=save.flags;sfx('pageTurn');
  if(n.npc==='tetera'){const lines=['¡Ay, mis niños! Tomen asiento, que el té está calentito. Recuerden: lo turquesa se golpea con parry.',
      'Cuando yo era una tetera joven, los jefes eran más educados. ¡Saludaban antes de atacar!','Un consejo de abuela: si un jefe te gana, mira la barrita de la derrota. ¡Siempre estuviste más cerca de lo que crees!'];
    if(!f.teteraCoin&&bossesBeaten().length>=3){f.teteraCoin=true;save.coins++;persist();sfx('kaching');say(n.name,'¡Tres jefes vencidos! Toma esta moneda de mi alcancía, cariño. Y no la gastes en dulces.');}
    else{f.teteraI=((f.teteraI||0)+1)%lines.length;say(n.name,lines[f.teteraI]);}persist();return;}
  if(n.npc==='tito'){const got=['nota1','nota2','nota3'].filter(k=>f[k]).length;
    if(f.titoDone)say(n.name,'¡Tu-ru-ruuu! Gracias a ti vuelvo a tocar mi canción favorita. ¿La oyes?');
    else if(got===3){f.titoDone=true;save.coins+=2;persist();sfx('kaching');sfx('whistleUp');say(n.name,'¡Mis tres notas! ¡Tu-ru-ruuuu! Toma dos monedas, ¡eres música para mis oídos!');}
    else say(n.name,`Se me escaparon tres notas musicales por la bahía y ahora mi canción suena horrible. ¿Me las traes? Llevas ${got} de 3.`);persist();return;}
  if(n.npc==='fantasmin'){f.ridI=f.ridI||0;const done=RIDDLES.filter((_,i)=>f['rid'+i]).length;
    if(done>=RIDDLES.length){say(n.name,'¡Bu! …Perdón, se me escapa. Ya resolviste todas mis adivinanzas. ¡Eres más listo que un búho!');return;}
    const i=RIDDLES.findIndex((_,k)=>!f['rid'+k]),r=RIDDLES[i];
    say(n.name,'¡B-bu! Perdona, soy tímido. ¿Una adivinanza? '+r.q,r.o.map((o,k)=>({label:o,fn:()=>{if(k===r.a){f['rid'+i]=true;save.coins++;persist();sfx('kaching');say(n.name,'¡Correcto! ¡Bu-ena esa! Toma una moneda fantasma… digo, de verdad.');}else{sfx('deny');say(n.name,'¡Bu-uu! No es eso. Piénsalo y vuelve a hablarme.');}}})));return;}
  if(n.npc==='pregonero'){sfx('honk');say(n.name,newsLine());return;}
  const J=NPC_JOKES[n.npc];
  if(J&&rand()<.4&&(n.npc!=='cabo'||f.caboDone)&&(n.npc!=='patita'||f.patita)){say(n.name,J[Math.floor(rand()*J.length)]);return;}
  _npcTalkC(n);};

/* ---------- map ambience: swaying flowers, butterflies / bats, jumping fish ---------- */
const AMB={};
function ambFor(wi){if(AMB[wi])return AMB[wi];const w=WORLDS[wi],r=srand(w.seed*7+3),fl=[],fish=[];
  for(let k=0;k<260&&fl.length<70;k++){const x=r()*w.W,y=r()*w.H;if(inIsle(w,x,y,40)&&!inPond(w,x,y,-20)&&walkable(w,x,y))fl.push({x,y,c:Math.floor(r()*4),s:.7+r()*.6,p:r()*6});}
  for(let k=0;k<200&&fish.length<10;k++){const x=r()*w.W,y=r()*w.H;if(!inIsle(w,x,y,-60))fish.push({x,y,p:r()*20});}
  return AMB[wi]={fl,fish};}
function mapAmbience(w,M){const A=ambFor(save.island),t=M.t,cx=clamp(M.x-W/2,0,w.W-W),cy=clamp(M.y-H/2,0,w.H-H),vis=(x,y)=>x>cx-30&&x<cx+W+30&&y>cy-30&&y<cy+H+30;
  const cols=w.night?['#8f7fb0','#c9a0d0','#7fa0c0','#e0d090']:['#e86a5a','#f2c14e','#f3f0e0','#c58ad8'];
  for(const f of A.fl){if(!vis(f.x,f.y))continue;const sw=Math.sin(t*2+f.p)*.25;ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.s,f.s);ctx.rotate(sw);line(0,0,0,-12,2,'#4f6a2a');
    for(let i=0;i<5;i++){const a=i*TAU/5+t*.2;circ(Math.cos(a)*4,-14+Math.sin(a)*4,3.2,cols[f.c],1.5);}circ(0,-14,2.2,w.night?'#fff3b0':'#7a4a20',0);ctx.restore();}
  for(const fi of A.fish){if(!vis(fi.x,fi.y))continue;const ph=(t+fi.p)%7;if(ph<1){const k=ph,x=fi.x+k*40,y=fi.y-Math.sin(k*Math.PI)*34;ctx.save();ctx.translate(x,y);ctx.rotate(-Math.cos(k*Math.PI)*.9);
      ell(0,0,11,6,w.night?'#9fb3d0':'#f08a2e',2.5);poly([[-10,0],[-18,-6],[-18,6]],w.night?'#9fb3d0':'#f08a2e',2.5);circ(5,-1,1.5,C.ink,0);ctx.restore();
      if(k<.12||k>.88){ctx.strokeStyle='rgba(239,224,191,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(fi.x+(k<.5?0:40),fi.y,10+k*8,4,0,0,TAU);ctx.stroke();}}}
  /* butterflies by day, bats by night, drifting around the player */
  for(let i=0;i<4;i++){const bx=M.x+Math.sin(t*.4+i*1.7)*220+Math.sin(t*1.3+i)*30,by=M.y-60+Math.cos(t*.5+i*2.1)*140,fl=Math.sin(t*(w.night?14:10)+i);
    ctx.save();ctx.translate(bx,by);if(w.night){ctx.fillStyle='#2b2238';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-8,-6-fl*5,-14,-2);ctx.quadraticCurveTo(-8,0,0,2);ctx.quadraticCurveTo(8,0,14,-2);ctx.quadraticCurveTo(8,-6-fl*5,0,0);ctx.fill();}
    else{for(const s of[-1,1]){ctx.save();ctx.scale(s*Math.abs(fl)*.8+s*.2,1);ell(5,-3,6,5,['#f2c14e','#e86a5a','#7bb7c9','#c58ad8'][i],1.5);ctx.restore();}line(0,-6,0,3,1.5);}ctx.restore();}}


/* ---------- shop: Don Tornillo reacts ---------- */
const SHOP_QUIPS=['¡Todo con garantía! Bueno, casi todo.','¿Sabías que este tornillo de mi cabeza es de 1903? ¡Pieza de colección!','Si no te alcanza, gana unas monedas y vuelve. ¡Aquí te espero!',
  'Ese amuleto lo encontré dentro de una ballena. No preguntes.','¡Psst! Los mausoleos regalan súpers. No le digas a nadie que te lo dije.','¡Prueba antes de comprar! …No, espera, aquí no se puede probar.',
  '¡Clientes como tú hacen que mis engranajes giren de alegría!'];
const _updShopC=updShop;
updShop=function(dt,IN){const c0=save.coins,m0=SH.msg;_updShopC(dt,IN);SH.cel=Math.max(0,(SH.cel||0)-dt);SH.talkT=Math.max(0,(SH.talkT||0)-dt);SH.idleT=(SH.idleT||0)+dt;
  if(save.coins<c0){SH.cel=1.6;SH.fly={id:SHOP_TABS[SH.tab].ids[SH.sel],t:0};sfx('kaching');sfx('whistleUp');}
  if(SH.fly){SH.fly.t+=dt;if(SH.fly.t>.9)SH.fly=null;}
  if(SH.msg!==m0){SH.talkT=Math.min(2.2,SH.msg.length*.035);SH.idleT=0;}
  if(SH.idleT>9){SH.idleT=0;SH.msg=SHOP_QUIPS[Math.floor(rand()*SHOP_QUIPS.length)];SH.talkT=1.8;sfx('woodblock');}};
const _drawTornilloC=drawTornillo;
drawTornillo=function(x,y,t){const cel=SH.cel||0,jump=cel>0?-Math.abs(Math.sin(cel*9))*26:0;ctx.save();ctx.translate(0,jump);
  if(cel>0){ctx.translate(x,y);ctx.rotate(Math.sin(cel*12)*.06);ctx.translate(-x,-y);}
  _drawTornilloC(x,y,t);
  const bob=Math.sin(t*2)*4;
  /* talking mouth */
  if((SH.talkT||0)>0){const o=Math.abs(Math.sin(t*18))*7;ctx.save();ctx.beginPath();ctx.ellipse(x,y-160+bob,9,2+o,0,0,TAU);ctx.fillStyle='#5a1a14';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
  /* bowler hat he tips when you buy something */
  const tip=cel>0?Math.min(1,Math.sin(Math.min(1,(1.6-cel)/.5)*Math.PI)):0;ctx.save();ctx.translate(x+tip*30,y-258+bob-tip*30);ctx.rotate(-tip*.6);
  ctx.beginPath();ctx.ellipse(0,0,46,9,0,0,TAU);ctx.fillStyle='#2b2420';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.beginPath();ctx.moveTo(-30,0);ctx.bezierCurveTo(-30,-42,30,-42,30,0);ctx.closePath();ctx.fill();ctx.stroke();rr(-30,-8,60,7,2,C.rust,2);ctx.restore();
  if(cel>0){for(let i=0;i<6;i++){const a=t*5+i*TAU/6,r=110;star(x+Math.cos(a)*r,y-150+Math.sin(a)*r*.5,9,4,5,t*6);ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();}
    txt('¡GRACIAS!',x,y-300,26,C.gold,C.ink);}
  ctx.restore();};
const _drawShopC=drawShop;
drawShop=function(){_drawShopC();if(SH.fly){const k=Math.min(1,SH.fly.t/.9),tab=SHOP_TABS[SH.tab],n=tab.ids.length,{rows,per,gap,rowH,y0}=shopLay(n),i=Math.max(0,tab.ids.indexOf(SH.fly.id)),
    sx=306+(i%per)*gap+30,sy=y0+Math.floor(i/per)*rowH+30,ex=160,ey=300,x=sx+(ex-sx)*k,y=sy+(ey-sy)*k-Math.sin(k*Math.PI)*140;
  ctx.save();ctx.translate(x,y);ctx.rotate(k*TAU*1.5);ctx.scale(1-k*.6,1-k*.6);itemIcon(SH.fly.id,0,0,SH.t);ctx.restore();}};

/* ---------- one new signature attack per boss (original) ---------- */
const P_=(B,a)=>!!a.parry&&B.pc%a.parry===0;
Object.assign(ATK,{
  /* Reloj: an alarm bell falls, rings for a second, then bursts into notes */
  alarmBomb(L,B,a){const o=anc(B,a.from),t=tgt(L,B);B.pc++;sfx('throw');
    spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:clamp((t.x-o.x)/1.1,-520,520),vy:-620,r:18,spr:'bell',life:4,parry:P_(B,a),upd(e,L,dt){
      if(!e.landed){e.vy+=1300*dt;if(e.y>=GROUND-e.r&&e.vy>0){e.landed=true;e.y=GROUND-e.r;e.vx=0;e.vy=0;e.tick=1.1;sfx('knock');puff(L,e.x,GROUND,3);}}
      else{e.tick-=dt;e.x+=Math.sin(e.t*70)*1.5;if(Math.floor(e.tick*8)!==Math.floor((e.tick+dt)*8))sfx('tick');
        if(e.tick<=0){e.dead=true;sfx('ring');for(let i=0;i<8;i++){const an=-Math.PI*(i/7);spawnEB(L,{k:'shot',x:e.x,y:e.y,vx:Math.cos(an)*260,vy:Math.sin(an)*260,r:11,spr:'note'});}}}}});},
  /* Gramófono: a record rolls out and comes back from the far wall */
  scratchDisc(L,B,a){const o=anc(B,a.from),t=tgt(L,B),d=t.x<o.x?-1:1;B.pc++;sfx('knock');
    spawnEB(L,{k:'roll',x:o.x,y:GROUND-26,vx:d*420,r:26,spr:'disc',life:6,parry:P_(B,a),upd(e){if(!e.back&&(e.x<40||e.x>W-40)){e.back=true;e.vx=-e.vx*1.15;sfx('ratchet');}}});},
  /* Barón: a V formation of paper planes */
  paperV(L,B,a){const t=aimPt(tgt(L,B)),cy=clamp(t.y,90,H-90);for(let i=0;i<5;i++){const off=Math.abs(i-2);B.pc++;
      spawnEB(L,{k:'shot',x:W+40+off*60,y:cy+(i-2)*46,vx:-(a.spd||300),vy:0,r:13,spr:'paper',parry:i===2&&P_(B,a)});}sfx('whistleDown');},
  /* Doña Tostada: pats of butter fall and leave slippery puddles */
  butterRain(L,B,a){const t=tgt(L,B);for(let i=0;i<(a.n||4);i++){B.pc++;spawnEB(L,{k:'shot',x:clamp(t.x+(i-1.5)*120,40,W-40),y:-30-i*60,vx:0,vy:300,r:13,spr:'butter',fall:true,puddle:true,parry:P_(B,a)});}sfx('pop');},
  /* General Cascanueces: a barrage of bouncing walnuts */
  nutBarrage(L,B,a){const o=anc(B,a.from),t=tgt(L,B);for(let i=0;i<3;i++)B.queue.push({t:i*.28,fn:()=>{B.pc++;
      spawnEB(L,{k:'grav',x:o.x,y:o.y,vx:clamp((t.x-o.x)/1.2,-560,560)*(1+i*.12),vy:-700+i*60,g:1500,r:14,spr:'nut',bounce:2,parry:i===2&&P_(B,a)});sfx('throw');}});},
  /* Faro Furioso: the beam sweeps low, then high */
  doubleBeam(L,B,a){ATK.sweep(L,B,{low:true,warn:.75,act:.4,style:'light'});B.queue.push({t:1.05,fn:()=>ATK.sweep(L,B,{low:false,warn:.6,act:.4,style:'light'})});},
  /* Ballena: a curtain of bubbles rises from below, with a gap */
  bubbleRise(L,B,a){const gap=120+rand()*(W-420),gw=a.gap||170;for(let x=30;x<W-20;x+=44){if(x>gap&&x<gap+gw)continue;B.pc++;spawnEB(L,{k:'shot',x,y:H+30,vx:0,vy:-(a.spd||170),r:14,spr:'bubble',wob:40,parry:P_(B,a)});}sfx('splash');},
  /* Paraguas: a fat raindrop bursts into three bouncing droplets */
  splitDrop(L,B,a){const o=anc(B,a.from),t=tgt(L,B);B.pc++;sfx('throw');
    spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:clamp((t.x-o.x)/1.1,-500,500),vy:-560,r:18,spr:'bigdrop',parry:P_(B,a),upd(e,L,dt){e.vy+=1200*dt;if(e.y>=GROUND-e.r&&e.vy>0){e.dead=true;sfx('splash');puff(L,e.x,GROUND,4,'#cfe8ee');
      for(const vx of[-220,0,220])spawnEB(L,{k:'grav',x:e.x,y:GROUND-14,vx,vy:-520,g:1400,r:9,spr:'drop',bounce:1});}}});},
  /* Caldera: three steam geysers in a row */
  geysers(L,B,a){const t=tgt(L,B),base=clamp(t.x,140,W-140);[-1,0,1].forEach((d,i)=>B.queue.push({t:i*.22,fn:()=>{spawnEB(L,{k:'column',x:clamp(base+d*150,50,W-50),warn:.7,act:.45,w:40,style:'fire'});sfx('warn');}}));},
  /* Vela: hot wax drips right where you stand */
  waxDrip(L,B,a){for(let i=0;i<(a.n||3);i++)B.queue.push({t:i*.35,fn:()=>{const t=tgt(L,B);B.pc++;spawnEB(L,{k:'shot',x:clamp(t.x+(rand()-.5)*60,30,W-30),y:-20,vx:0,vy:380,r:11,spr:'wax',fall:true,puddle:true,parry:P_(B,a)});}});sfx('pop');},
  /* Búho: two books fly out and come back like boomerangs */
  bookPair(L,B,a){const o=anc(B,a.from),t=aimPt(tgt(L,B));for(const dy of[-90,90]){B.pc++;spawnEB(L,{k:'boomer',x:o.x,y:o.y,ox:o.x,oy:o.y,tx:t.x,ty:t.y+dy,T:1.1,r:15,spr:'book',parry:dy>0&&P_(B,a),boss:B,from:a.from});}sfx('pageTurn');},
  /* Murciélago: a ring of sonic waves stops, then dives at you */
  sonicTrap(L,B,a){const t=aimPt(tgt(L,B)),n=8;for(let i=0;i<n;i++){const an=i*TAU/n;B.pc++;
      spawnEB(L,{k:'shot',x:t.x+Math.cos(an)*280,y:t.y+Math.sin(an)*280,vx:0,vy:0,r:12,spr:'sonic',life:3,parry:i===0&&P_(B,a),hold:.8,tx:t.x,ty:t.y,upd(e,L,dt){e.hold-=dt;if(e.hold<=0&&!e.go){e.go=true;const d=Math.hypot(e.tx-e.x,e.ty-e.y)||1;e.vx=(e.tx-e.x)/d*360;e.vy=(e.ty-e.y)/d*360;}}});}sfx('dizzy');},
  /* Espantapájaros: popcorn bursts out of the field */
  cornPop(L,B,a){const t=tgt(L,B);for(let i=0;i<(a.n||6);i++){B.pc++;spawnEB(L,{k:'grav',x:clamp(t.x+(rand()-.5)*260,40,W-40),y:GROUND-6,vx:(rand()-.5)*160,vy:-(620+rand()*260),g:1300,r:10,spr:'corn',parry:P_(B,a)});}sfx('ratchet');},
  /* Doña Tecla: a line of letters is typed across the screen */
  typeLine(L,B,a){const t=aimPt(tgt(L,B)),y=clamp(t.y,60,GROUND-20),fromL=rand()<.5;for(let i=0;i<7;i++)B.queue.push({t:i*.12,fn:()=>{B.pc++;
      spawnEB(L,{k:'shot',x:fromL?-20:W+20,y,vx:(fromL?1:-1)*(a.spd||420),vy:0,r:11,spr:'letter',parry:i===6&&P_(B,a)});sfx('tick');}});},
  /* Gran Chistera: cards appear around you, wait, then dart in */
  cardTrick(L,B,a){const t=aimPt(tgt(L,B));for(let i=0;i<6;i++){const an=i*TAU/6+rand()*.3;B.pc++;const x=clamp(t.x+Math.cos(an)*250,20,W-20),y=clamp(t.y+Math.sin(an)*200,30,H-30);puff(L,x,y,2,C.white);
      spawnEB(L,{k:'shot',x,y,vx:0,vy:0,r:12,spr:'card',life:3.2,parry:i===0&&P_(B,a),hold:.9,tx:t.x,ty:t.y,upd(e,L,dt){e.hold-=dt;if(e.hold<=0&&!e.go){e.go=true;const d=Math.hypot(e.tx-e.x,e.ty-e.y)||1;e.vx=(e.tx-e.x)/d*420;e.vy=(e.ty-e.y)/d*420;}}});}sfx('magic');},
  /* Rey Apagón: lights out, and orbs spin out of the dark */
  eclipse(L,B,a){ATK.dark(L,B,{dur:2.2});B.queue.push({t:.5,fn:()=>ATK.ring(L,B,{from:a.from,n:12,spd:200,spr:'orb',parry:4})});B.queue.push({t:1.2,fn:()=>ATK.ring(L,B,{from:a.from,n:12,spd:240,spr:'orb',parry:4})});}});
/* Cangrejo: castanets clap in from both sides at the hero's height */
ATK.clap=function(L,B,a){const t=aimPt(tgt(L,B));for(const s of[-1,1]){B.pc++;spawnEB(L,{k:'shot',x:s<0?-30:W+30,y:t.y,vx:(s<0?1:-1)*(a.spd||330),vy:0,r:15,spr:'castanet',parry:s>0&&P_(B,a)});}sfx('woodblock');};
const NEW_ATK={reloj:{f:'alarmBomb',every:6.5,from:'hand',parry:2},gramo:{f:'scratchDisc',every:6,parry:2},baron:{f:'paperV',every:5.5,spd:300,parry:1},tostada:{f:'butterRain',every:6,n:4,parry:3},
  cascanueces:{f:'nutBarrage',every:6,parry:1},faro:{f:'doubleBeam',every:7},cangrejo:{f:'clap',every:4.5,spd:340,parry:2},ballena:{f:'bubbleRise',every:6.5,spd:160,gap:190,parry:5},
  paraguas:{f:'splitDrop',every:5.5,parry:2},caldera:{f:'geysers',every:6.5},vela:{f:'waxDrip',every:5,n:3,parry:3},buho:{f:'bookPair',every:6,parry:2},
  murcielago:{f:'sonicTrap',every:6.5,parry:1},espantapajaros:{f:'cornPop',every:5.5,n:6,parry:4},maquina:{f:'typeLine',every:6,spd:420,parry:1},chistera:{f:'cardTrick',every:6.5,parry:1},apagon:{f:'eclipse',every:9}};
for(const id in NEW_ATK){const d=LEVELS[id];if(!d||!d.phases)continue;const k=Math.min(1,d.phases.length-1);for(let i=k;i<d.phases.length;i++)d.phases[i].atk.push(Object.assign({delay:2.5+i},NEW_ATK[id]));}
