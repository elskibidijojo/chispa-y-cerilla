'use strict';
/* ================= EXTRAS: new weapons, charms, supers, skins, achievements, secrets ================= */

/* ---------- new weapons ---------- */
function drawBume(b,L){ctx.translate(b.x,b.y);ctx.rotate(L.t*22);const s=b.big?2:1;ctx.scale(s,s);ctx.beginPath();ctx.moveTo(-12,-3);ctx.quadraticCurveTo(0,-14,12,-3);ctx.lineTo(9,3);ctx.quadraticCurveTo(0,-6,-9,3);ctx.closePath();
  ctx.fillStyle='#c98a4a';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();line(-8,-2,-4,-5,1.5,'#7a4a20');}
function drawRocket(b,L){ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));for(let i=1;i<4;i++){ctx.globalAlpha=.5/i;circ(-12-i*8,(rand()-.5)*4,6+i*2,i===1?'#ffb35a':'#cfc6b4',0);}ctx.globalAlpha=1;
  rr(-12,-6,22,12,6,C.paper,2.5);poly([[10,-6],[18,0],[10,6]],C.rust,2.5);poly([[-12,-6],[-18,-11],[-8,-6]],C.rust,2);poly([[-12,6],[-18,11],[-8,6]],C.rust,2);circ(2,-1,3,'#7bb7c9',1.5);}
function drawFlameB(b,L){const k=1-b.life/b.max;ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ctx.globalAlpha=Math.max(.12,1-k*.95);const r=b.r*(.7+k*.8),w=Math.sin(L.t*40+b.x)*.12;
  ctx.beginPath();ctx.moveTo(r*1.5,0);ctx.quadraticCurveTo(r*.2,-r*(1.1+w),-r,0);ctx.quadraticCurveTo(r*.2,r*(1.1-w),r*1.5,0);ctx.fillStyle=k<.35?'#ff9a3c':k<.7?'#e8642c':'#8a3a2a';ctx.fill();
  if(k<.6){ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}ell(r*.2,0,r*.6,r*.4,k<.5?'#ffe27a':'rgba(255,200,120,.6)',0);}
Object.assign(WEAPONS,{
  bumeran:{name:'Bumerán',price:4,isl:1,desc:'Lo lanzas, atraviesa a los enemigos y vuelve a tu mano. Pega a la ida y a la vuelta.',exd:'EX: un bumerán gigante que tritura todo a su paso.',
    fire(L,p,h,ax,ay){p.cool=.26;B_(L,p,{x:h.x,y:h.y,vx:ax*780,vy:ay*780,r:12,dmg:1.4,life:2.2,k:'bume',tickHit:true,boomer:{t:0},draw:drawBume});},
    ex(L,p,h,ax,ay){B_(L,p,{x:h.x,y:h.y,vx:ax*720,vy:ay*720,r:26,dmg:.9,life:2.6,k:'bume',big:true,tickHit:true,boomer:{t:0},draw:drawBume});}},
  cohete:{name:'Cohetín',price:5,isl:2,desc:'Cohetes lentos que aceleran, persiguen al enemigo y explotan. Lentos pero muy fuertes.',exd:'EX: tres cohetes a la vez.',
    fire(L,p,h,ax,ay){p.cool=.5;const b=B_(L,p,{x:h.x,y:h.y,vx:ax*240,vy:ay*240,r:9,dmg:4.4,life:3,k:'bomba',homing:3,draw:drawRocket});b.upd=rocketUpd;sfx('rocket');},
    ex(L,p,h,ax,ay){for(const d of[-.35,0,.35]){const a=Math.atan2(ay,ax)+d,b=B_(L,p,{x:h.x,y:h.y,vx:Math.cos(a)*300,vy:Math.sin(a)*300,r:11,dmg:4.5,life:3,k:'bomba',homing:4,draw:drawRocket});b.upd=rocketUpd;}}},
  lanzallamas:{name:'Lanzallamas',price:5,isl:3,hold:true,desc:'Mantén el disparo: una llamarada corta que atraviesa todo y quema mucho de cerca.',exd:'EX: un anillo de fuego a tu alrededor.',
    ex(L,p,h){for(let i=0;i<14;i++){const a=i*TAU/14;B_(L,p,{x:h.x,y:h.y,vx:Math.cos(a)*520,vy:Math.sin(a)*520,r:16,dmg:1.3,life:.5,max:.5,k:'llama',pierce:true,draw:drawFlameB});}sfx('fire');}},
});
function rocketUpd(b,L,dt){const sp=Math.hypot(b.vx,b.vy),ns=Math.min(900,sp+dt*900),k=ns/Math.max(1,sp);b.vx*=k;b.vy*=k;if(rand()<.5)L.fx.push({k:'puff',x:b.x,y:b.y,vx:0,vy:-10,life:.3,max:.3,r:4,col:'#cfc6b4'});}
const _holdWeapon=holdWeapon;
holdWeapon=function(L,p,dt,h,w){_holdWeapon(L,p,dt,h,w);
  if(w==='lanzallamas'&&p.shoot){p.flameT=(p.flameT||0)-dt;p.flashT=.06;if(p.flameT<=0){p.flameT=.05;B_(L,p,{x:h.x,y:h.y,vx:p.aimX*640+(rand()-.5)*90,vy:p.aimY*640+(rand()-.5)*90-30,r:14,dmg:.8,life:.34,max:.34,k:'llama',pierce:true,draw:drawFlameB});p.flameS=(p.flameS||0)-.05;if(p.flameS<=0){p.flameS=.14;sfx('shot','lanzallamas');}}}};
Object.assign(SHOTS,{bumeran:()=>{tn(500,.08,{type:'triangle',v:.03,slide:300});nz(.06,{f:1500,v:.03,q:3});},lanzallamas:()=>nz(.07,{f:900,fs:1600,v:.05,q:.7})});
Object.assign(SFX,{rocket(){nz(.3,{f:600,fs:2000,v:.07,q:.8});tn(200,.25,{type:'sawtooth',v:.03,slide:300,lp:1200});},
  achieve(){[784,988,1175,1568,1319,1568].forEach((f,i)=>tn(f,i===5?.5:.12,{type:'square',v:.04,at:i*.08,lp:4000}));nz(.4,{f:6000,type:'highpass',v:.05,at:.4});},
  storm(){nz(.35,{f:5000,fs:600,type:'highpass',v:.16});tn(90,.4,{type:'sawtooth',v:.07,slide:-50,lp:700});},
  reflect(){tn(1400,.08,{type:'sine',v:.05,slide:600});},luck(){[1319,1760,2093].forEach((f,i)=>tn(f,.15,{type:'triangle',v:.04,at:i*.05}));},
  secret(){[523,659,784,1047,784,1047,1319].forEach((f,i)=>tn(f,.14,{type:'triangle',v:.05,at:i*.09}));}});

/* ---------- new charms ---------- */
Object.assign(CHARMS,{
  trebol:{name:'Trébol de la Suerte',price:3,isl:1,desc:'Cada golpe que te dan tiene un 20 % de probabilidad de no hacerte nada.'},
  botas:{name:'Botas Chispeantes',price:3,isl:2,desc:'Tu dash quema: los enemigos que atraviesas reciben un buen golpe.'},
  relojlento:{name:'Reloj Lento',price:4,isl:3,desc:'Cuando te queda 1 de vida, todo el nivel va más lento para que puedas reaccionar.'}});
const _hurt=hurt;
hurt=function(L,p){if(L.state==='play'&&!p.dead&&hasCharm(p,'trebol')&&rand()<.2){p.inv=1;pop(L,p.x,p.y-100,'¡SUERTE!',C.gold);sfx('luck');stars(L,p.x,p.y-40,6,'#7bd389');return;}_hurt(L,p);};
const _levelUpdate=levelUpdate;
levelUpdate=function(L,dt,IN){if(L.state==='play'&&L.Ps.some(p=>!p.dead&&p.hp===1&&hasCharm(p,'relojlento'))){dt*=.72;L.slowFx=1;}else L.slowFx=0;_levelUpdate(L,dt,IN);};

/* ---------- new supers ---------- */
Object.assign(SUPERS,{
  tormenta:{name:'Tormenta Eléctrica',price:5,isl:2,desc:'Diez rayos caen del cielo sobre los enemigos. También se gana superando el Mausoleo de la Niebla.'},
  escudo:{name:'Burbuja Reflectora',price:4,isl:3,desc:'Una burbuja te rodea 4 segundos y devuelve las balas enemigas contra ellos. También se gana en el Mausoleo de Medianoche.'}});
const _startSuper=startSuper;
startSuper=function(L,p){const s=p.eq.sup||'chispazo';unlockAch('super');
  if(s!=='tormenta'&&s!=='escudo'){_startSuper(L,p);return;}
  p.cards=0;L.supers++;p.superK=s;p.superT=s==='tormenta'?1.5:.3;p.inv=Math.max(p.inv,p.superT+.5);L.superFlash=.35;sfx('super');shake(L,14);banner(L,'¡'+SUPERS[s].name.toUpperCase()+'!',1.1);
  if(s==='tormenta')p.storm={n:10,acc:0};else{p.reflectT=4;sfx('reflect');}};
const _superTick=superTick;
superTick=function(L,p,dt){_superTick(L,p,dt);
  if(p.storm){p.storm.acc+=dt;if(p.storm.acc>.14&&p.storm.n>0){p.storm.acc=0;p.storm.n--;const c0=pCenter(p),t=nearestEnt(L,c0.x+p.face*200,c0.y);
      const c=t?nearPt(t,c0.x,c0.y):{x:L.camX+100+rand()*(W-200),y:GROUND-20};L.arcs.push({pts:zig(c.x+(rand()-.5)*60,-30,c.x,c.y),t:.2,big:true});
      if(t){t.damage(6.5*dmgM(p),p);}boom(L,c.x,c.y,30);sfx('storm');shake(L,6);L.flash=Math.max(L.flash,.08);}if(p.storm.n<=0)p.storm=null;}};
function reflectTick(L,p,dt){if(!(p.reflectT>0))return;p.reflectT-=dt;const c=pCenter(p);
  for(const e of L.eb){if(e.dead||!destroyable(e))continue;if(dist(e.x,e.y,c.x,c.y)<70){e.dead=true;const t=nearestEnt(L,c.x,c.y),tc=t?nearPt(t,c.x,c.y):{x:c.x+p.face*400,y:c.y},a=Math.atan2(tc.y-c.y,tc.x-c.x);
    B_(L,p,{x:e.x,y:e.y,vx:Math.cos(a)*900,vy:Math.sin(a)*900,r:10,dmg:3,life:1.2,k:'ex'});sfx('reflect');sparks(L,e.x,e.y,4,C.parryL);}}}

/* ---------- post-update hooks for players (dash damage, reflect bubble, skin trails) ---------- */
function playerExtras(L,p,dt){if(p.dead)return;reflectTick(L,p,dt);
  if(hasCharm(p,'botas')){if(p.dash>0){if(!p.bootOn){p.bootOn=true;p.bootHit=new Set();}for(const e of L.ents)if(!e.dead&&!p.bootHit.has(e)&&e.hitBy(p.x,p.y-30,30)){p.bootHit.add(e);e.damage(5*dmgM(p),p);sparks(L,p.x,p.y-30,10,'#ffb35a');sfx('hitBig');}
      if(rand()<.6)L.fx.push({k:'spark',x:p.x,y:p.y-10,vx:-p.face*100,vy:-60,life:.3,max:.3,r:4,col:'#ffb35a'});}else p.bootOn=false;}
  const sk=SKINS[p.eq.skin];if(sk&&sk.trail&&(Math.abs(p.vx)>40||p.type==='plane')&&rand()<dt*14){const c=pCenter(p);
    L.fx.push({k:sk.trail==='star'?'star':'spark',x:c.x-p.face*14+(rand()-.5)*14,y:c.y+(rand()-.5)*30,vx:0,vy:-30,life:.5,max:.5,r:sk.trail==='star'?5:3.5,rot:0,col:sk.tcol});}}
const _platUpdate=platUpdate;platUpdate=function(L,p,dt,I){_platUpdate(L,p,dt,I);playerExtras(L,p,dt);};
const _planeUpdate=planeUpdate;planeUpdate=function(L,p,dt,I){_planeUpdate(L,p,dt,I);playerExtras(L,p,dt);};
const _drawPlayers=drawPlayers;drawPlayers=function(L){_drawPlayers(L);for(const p of L.Ps){if(p.dead||!(p.reflectT>0))continue;const c=pCenter(p);ctx.save();ctx.globalAlpha=.45+.15*Math.sin(L.t*12);
  circ(c.x,c.y,66,'rgba(180,235,240,.25)',3);ctx.beginPath();ctx.arc(c.x-20,c.y-24,16,3.5,4.6);ctx.lineWidth=4;ctx.strokeStyle='rgba(255,255,255,.8)';ctx.stroke();ctx.restore();}
  if(L.slowFx){ctx.save();ctx.globalAlpha=.25;ctx.strokeStyle=C.parryL;ctx.lineWidth=6;ctx.strokeRect(L.camX+6,6,W-12,H-12);ctx.restore();}};

/* ---------- skins ---------- */
const SKINS={
  skin_clasica:{name:'Clásica',price:0,isl:1,desc:'El aspecto de siempre.'},
  skin_dorada:{name:'Dorada',price:4,isl:1,desc:'Brillas como una moneda y dejas chispitas doradas al moverte.',filter:'sepia(1) saturate(6) hue-rotate(-6deg) brightness(1.08) contrast(1.1)',trail:'spark',tcol:'#ffe27a'},
  skin_noche:{name:'Medianoche',price:4,isl:2,desc:'Colores de noche estrellada y una estela de estrellas.',filter:'hue-rotate(200deg) saturate(1.3) brightness(.9)',trail:'star',tcol:'#d6c8ff'},
  skin_pirata:{name:'Pirata',price:3,isl:2,desc:'Pañuelo rojo y parche en el ojo. ¡Arr!',acc:'pirata'},
  skin_gala:{name:'De Gala',price:3,isl:1,desc:'Chistera negra y moño elegante, para ir a la ópera.',acc:'gala'},
  skin_fantasma:{name:'Fantasmal',price:5,isl:3,desc:'Medio transparente, con brillo turquesa y estela de alma.',alpha:.62,filter:'hue-rotate(140deg) saturate(.7) brightness(1.15)',trail:'spark',tcol:'#9ff0e6'},
  skin_cine:{name:'Cine Mudo',price:6,isl:1,desc:'En blanco y negro, como una película de 1930. Hay un código secreto que la regala…',filter:'grayscale(1) contrast(1.25)'},
  skin_payaso:{name:'Payaso',price:3,isl:3,desc:'Nariz roja y gorrito de fiesta. ¡Bocina incluida!',acc:'payaso',filter:'saturate(1.6)'}};
function drawSkinAcc(o,ch,fy,f,ex){const sk=SKINS[o.skin];if(!sk||!sk.acc)return;ctx.save();ctx.filter='none';const top=fy-(ch==='cerilla'?20:ch==='velita'?22:26);
  if(sk.acc==='pirata'){ctx.beginPath();ctx.ellipse(0,top+8,20,9,0,Math.PI,0);ctx.closePath();ctx.fillStyle=C.rust;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
    for(let i=-2;i<=2;i++)circ(i*7,top+3,1.8,C.paper,0);poly([[-f*18,top+6],[-f*30,top+2],[-f*28,top+14]],C.rust,2);ell(ex+6*f,fy,6,6,C.ink,0);line(ex-14*f,fy-8,ex+18*f,fy-6,1.6);}
  else if(sk.acc==='gala'){rr(-12,top-22,24,22,2,'#1b130d',2.5);ell(0,top,20,5,'#1b130d',2.5);rr(-12,top-8,24,4,0,C.rust,0);
    const by2=fy+(ch==='chispa'?26:ch==='velita'?24:18);poly([[0,by2],[-10,by2-6],[-10,by2+6]],C.rust,2);poly([[0,by2],[10,by2-6],[10,by2+6]],C.rust,2);circ(0,by2,2.5,C.ink,0);}
  else if(sk.acc==='payaso'){poly([[-11,top+4],[0,top-26],[11,top+4]],'#e86a5a',2.5);circ(0,top-27,4,C.goldL,2);circ(-5,top-6,2,C.paper,0);circ(4,top-14,2,C.paper,0);circ(ex+f*2,fy+7,4.5,'#e23b3b',2);}
  ctx.restore();}

/* ---------- achievements ---------- */
const ACH=[
  ['primer_jefe','¡Primera victoria!','Vence a tu primer jefe.',1],['isla1','Dueño de Hojalata','Vence a los 5 jefes de la Isla de Hojalata.',2],['isla2','Rey de la Bahía','Vence a los 5 jefes de Bahía Bruma.',2],
  ['isla3','Luz en la Cumbre','Vence a los 7 jefes de Cumbre Apagón.',3],['final','¡Se hizo la luz!','Vence al Rey Apagón.',3],['runs','Piernas de Acero','Termina todos los niveles de correr y disparar.',2],
  ['monedas_run','Bolsillo Lleno','Junta las 5 monedas de un nivel de correr.',1],['parry10','Manos Rápidas','Haz 10 parrys en un solo nivel.',1],['parry100','Maestro del Parry','Haz 100 parrys en total.',2],
  ['grado_a','¡Sobresaliente!','Saca A+ contra un jefe.',1],['grado_s','Leyenda','Saca S en dificultad Experto.',3],['pacifista','Pacifista','Saca grado P: termina un nivel de correr sin derrotar a nadie ni recibir golpes.',2],
  ['sin_dano','Intocable','Vence a un jefe sin recibir ni un golpe.',2],['super','¡Súper!','Usa tu primer súper.',1],['mausoleos','Guardián de Urnas','Supera los 3 mausoleos.',2],
  ['armas','Arsenal Completo','Compra todas las armas.',2],['amuletos','Coleccionista','Compra todos los amuletos.',2],['skin','¡Qué Estilo!','Consigue tu primera skin.',1],
  ['estatua','Homenaje','Lee la placa de la estatua.',1],['gato','Ojo de Gato','Encuentra 3 veces al Gato Tinta.',1],['explorador','Explorador','Encuentra todas las monedas escondidas de los mapas.',2],
  ['codigo','Código Secreto','Descubre el código secreto de la pantalla de título.',2],['persistente','Persistente','Que te apaguen 25 veces. ¡No te rindas!',1],['coop3','Trío Dinámico','Vence a un jefe jugando de a 3.',2],
  ['dj','DJ de la Rocola','Escucha 5 canciones distintas en la Rocola.',1],['experto','Sin Miedo','Vence a un jefe en dificultad Experto.',1]];
const ACHD={};ACH.forEach(([id,name,desc,coins])=>ACHD[id]={id,name,desc,coins});
const ACHQ=[];
function unlockAch(id){if(typeof save==='undefined'||!ACHD[id])return;save.ach=save.ach||{};if(save.ach[id])return;save.ach[id]=Date.now();save.coins+=ACHD[id].coins;persist();ACHQ.push({a:ACHD[id],t:0});sfx('achieve');}
function drawAchToast(){if(!ACHQ.length)return;const q=ACHQ[0];const k=q.t<.3?q.t/.3:q.t>3.2?Math.max(0,(3.5-q.t)/.3):1,y=-60+k*78;
  ctx.save();card(W/2-210,y,420,56,C.paper);starPathA(W/2-180,y+28,16,7,5,q.t*2);txt('¡LOGRO!',W/2-140,y+18,14,C.rust,null,'left');btxt(q.a.name,W/2-140,y+40,17,C.ink,'left',800);
  if(q.a.coins){coinIcon(W/2+160,y+28,10);btxt('+'+q.a.coins,W/2+176,y+29,17,C.ink,'left',800);}ctx.restore();if(q.t>3.5)ACHQ.shift();}
function starPathA(x,y,r1,r2,n,rot){star(x,y,r1,r2,n,rot);ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}
/* hooks */
const _finish=finish;
finish=function(L){_finish(L);try{const r=L.result,d=L.def,boss=L.kind!=='run'&&L.kind!=='maus';
  if(boss){unlockAch('primer_jefe');if(L.hits===0)unlockAch('sin_dano');if(r.grade==='A+'||r.grade==='S')unlockAch('grado_a');if(r.grade==='S')unlockAch('grado_s');if(cfg.diff==='experto')unlockAch('experto');if(L.Ps.length===3)unlockAch('coop3');}
  if(r.grade==='P')unlockAch('pacifista');if(L.parries>=10)unlockAch('parry10');
  if(L.kind==='run'&&L.coins&&L.coins.every(c=>c.got||c.was))unlockAch('monedas_run');
  const all=ids=>ids.every(k=>save.cleared[k]);if(typeof BOSS_LIST!=='undefined'){if(all(BOSS_LIST[1]))unlockAch('isla1');if(all(BOSS_LIST[2]))unlockAch('isla2');if(all(BOSS_LIST[3]))unlockAch('isla3');
    if(all([...RUN_LIST[1],...RUN_LIST[2],...RUN_LIST[3]]))unlockAch('runs');}
  if(save.cleared.apagon)unlockAch('final');if(all(['mausoleo','mausoleo2','mausoleo3']))unlockAch('mausoleos');}catch(_){}};
const _doParry=doParry;doParry=function(L,p,o){_doParry(L,p,o);save.parryTotal=(save.parryTotal||0)+1;if(save.parryTotal>=100)unlockAch('parry100');};
const _kill=kill;kill=function(L,p){_kill(L,p);if((save.deaths||0)>=25)unlockAch('persistente');};
function checkCollectionAch(){const ow=k=>save.owned.includes(k);if(Object.keys(WEAPONS).every(ow))unlockAch('armas');if(Object.keys(CHARMS).every(ow))unlockAch('amuletos');if(Object.keys(SKINS).some(k=>k!=='skin_clasica'&&ow(k)))unlockAch('skin');}
