/* ultra.js — ULTRA MEGA BIG UPDATE: new gear inspired by the classic cartoon run-and-gunners.
   Charms:  Pajarito Ayudante (a little bird that follows you and shoots homing seeds on its own),
            Paraguas (hold JUMP while falling to float down slowly, great to dodge things on the floor),
            Taza de Té (once per fight, if you're down to 1 heart and avoid getting hit for 8 seconds, you get a heart back).
   Súper:   Ola Gigante (a huge wave crosses the whole screen: hits every enemy it touches and washes away the
            enemy shots that aren't pink).
   All of it runs in the simulation (rand-free or with the game's own rand), so online play stays in sync. */
(function(){
Object.assign(CHARMS,{
  pajarito:{name:'Pajarito Ayudante',price:4,isl:1,desc:'Un pajarito te sigue y dispara semillas que persiguen al enemigo él solito. Poco daño, pero nunca descansa.'},
  paraguas:{name:'Paraguas',price:3,isl:2,desc:'Mantén SALTAR mientras caes para bajar flotando despacito. Perfecto para esquivar lo que pasa por el suelo.'},
  te:{name:'Taza de Té',price:4,isl:3,desc:'Una vez por pelea: si te queda 1 corazón y aguantas 8 segundos sin que te peguen, recuperas un corazón.'}});
SUPERS.ola={name:'Ola Gigante',price:5,isl:2,desc:'Una ola enorme cruza toda la pantalla: golpea a todos los enemigos que toca y se lleva las balas enemigas (menos las rosas).'};
if(typeof refreshShopTabs==='function')refreshShopTabs();

/* ---------- charms (simulation) ---------- */
const birdPos=(p,t)=>({x:p.x-(p.face||1)*30,y:(p.type==='plane'?p.y-40:p.y-86)+Math.sin(t*4+(p.i||0))*6});
const _sT=superTick;superTick=function(L,p,dt){_sT(L,p,dt);if(!L||!p||p.dead||L.state!=='play')return;
  if(hasCharm(p,'pajarito')){p._bird=(p._bird||0)-dt;if(p._bird<=0){p._bird=.5;const b=birdPos(p,L.t);
      B_(L,p,{x:b.x,y:b.y,vx:(p.face||1)*520,vy:-40,r:6,dmg:.9,life:2,k:'semilla',homing:6,noGain:true,draw:drawSeed});}}
  if(hasCharm(p,'te')&&!p._teUsed){if(p._lastHp!==undefined&&p.hp<p._lastHp)p._teT=0;p._lastHp=p.hp;
    if(p.hp===1){p._teT=(p._teT||0)+dt;if(p._teT>=8){p._teUsed=true;p.hp++;p._lastHp=p.hp;sfx('coin');sfx('magic');pop(L,p.x,p.y-110,'¡+1 ♥ TÉ CALENTITO!','#7fd05a');}}else p._teT=0;}};
const _pu=platUpdate;platUpdate=function(L,p,dt,I){const r=_pu(L,p,dt,I);if(p&&hasCharm(p,'paraguas')&&!p.ground&&I&&I.h&&I.h.jump&&p.vy>140&&p.dash<=0){p.vy=140;p._umb=.15;}else if(p&&p._umb>0)p._umb-=dt;return r;};

/* ---------- Súper: Ola Gigante ---------- */
const _ss=startSuper;startSuper=function(L,p){if((p.eq.sup||'chispazo')!=='ola'){_ss(L,p);return;}if(typeof unlockAch==='function')unlockAch('super');
  p.cards=0;L.supers++;p.superK='ola';p.superT=.6;p.inv=Math.max(p.inv,1.4);L.superFlash=.35;sfx('super');sfx('splash');shake(L,12);banner(L,'¡OLA GIGANTE!',1.1);
  const plane=p.type==='plane',dir=plane?1:(p.face||1),x0=dir>0?L.camX-60:L.camX+W+60;
  const b=B_(L,p,{x:x0,y:GROUND-110,vx:dir*620,vy:0,r:120,dmg:30,life:2.4,k:'ola',pierce:true,noGain:true,big:true,draw:drawOla,dir});
  b.upd=(b,L,dt)=>{b.vy=0;b.y=plane?H/2:GROUND-110;for(const e of L.eb){if(e.parry||e.dead)continue;if(Math.abs(e.x-b.x)<130&&Math.abs(e.y-b.y)<(plane?H/2:200)){e.dead=true;e.life=0;}}
    if(Math.floor(b.t*10)!==Math.floor((b.t-dt)*10))puff(L,b.x-b.dir*80,GROUND-6,2);};};

/* ---------- drawing ---------- */
function drawSeed(b){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ell(0,0,7,4.5,'#c8a060',2);ell(-1,-1,2.5,1.5,'#f6e0b0',0);ctx.restore();}
function drawOla(b,L){const d=b.dir||1,t=L?L.t:0,plane=b.y<H/2+1&&b.y>H/2-1;ctx.save();ctx.translate(b.x,0);ctx.scale(d,1);const top=plane?20:GROUND-300,bot=plane?H-10:GROUND+4;
  ctx.beginPath();ctx.moveTo(-260,bot);ctx.lineTo(-260,top+150);ctx.quadraticCurveTo(-120,top-20,40,top+10);ctx.quadraticCurveTo(110,top+30,90,top+90);ctx.quadraticCurveTo(40,top+60,20,top+110);ctx.quadraticCurveTo(70,top+200,130,bot);ctx.closePath();
  ctx.fillStyle='rgba(30,127,224,.88)';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.fillStyle='rgba(120,210,255,.75)';ctx.beginPath();ctx.moveTo(-240,bot);ctx.quadraticCurveTo(-120,top+120,30,top+130);ctx.quadraticCurveTo(-40,top+220,60,bot);ctx.closePath();ctx.fill();
  for(let i=0;i<9;i++){const a=i/8;circ(-120+a*200+Math.sin(t*12+i)*4,top+10+Math.sin(a*3.1)*-18+i*2,8+(i%3)*3,'#fbf6ea',2.5);}
  for(let i=0;i<6;i++){const y=top+60+((i*53+t*240)%(bot-top-80));circ(-180+(i*37)%160,y,4+i%3,'rgba(255,255,255,.8)',1.5);}ctx.restore();}
function drawBird(x,y,f,t){ctx.save();ctx.translate(x,y);ctx.scale(f,1);const w=Math.sin(t*22)*.6;ctx.save();ctx.rotate(-.4-w);ell(-4,-8,12,6,'#f2c14e',2.2);ctx.restore();
  ell(0,0,12,10,'#f2c14e',2.5);circ(8,-6,7,'#f2c14e',2.2);poly([[14,-6],[22,-4],[14,-2]],'#e8562e',1.8);circ(10,-8,2.2,C.ink,0);poly([[-12,0],[-20,-4],[-18,4]],'#e0a830',2);ctx.restore();}
function drawUmbrella(p){ctx.save();ctx.translate(p.x,p.y-100);ctx.rotate(Math.sin((LV?LV.t:0)*3)*.08);ctx.beginPath();ctx.arc(0,0,40,Math.PI,0);for(let i=0;i<4;i++)ctx.quadraticCurveTo(30-i*20,-6,20-i*20,0);ctx.closePath();
  ctx.fillStyle='#e8562e';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ctx.fillStyle='#fbf6ea';ctx.beginPath();ctx.moveTo(0,-40);ctx.lineTo(-14,0);ctx.lineTo(14,0);ctx.closePath();ctx.fill();ctx.stroke();line(0,0,0,40,3);ctx.restore();}
const _dl=drawLevel;drawLevel=function(L){_dl.apply(this,arguments);if(!L||!L.Ps||scene!=='level')return;let any=false;for(const p of L.Ps)if(!p.dead&&(hasCharm(p,'pajarito')||p._umb>0||(hasCharm(p,'te')&&p._teT>0&&!p._teUsed)))any=true;if(!any)return;
  ctx.save();if(typeof DPR!=='undefined')ctx.setTransform(DPR,0,0,DPR,0,0);ctx.translate(-(L.camX||0),0);
  for(const p of L.Ps){if(p.dead)continue;if(p._umb>0)drawUmbrella(p);if(hasCharm(p,'pajarito')){const b=birdPos(p,L.t);drawBird(b.x,b.y,p.face||1,L.t);}
    if(hasCharm(p,'te')&&p._teT>0&&!p._teUsed){const k=Math.min(1,p._teT/8);ctx.lineWidth=5;ctx.strokeStyle='rgba(127,208,90,.9)';ctx.beginPath();ctx.arc(p.x,p.y-120,14,-Math.PI/2,-Math.PI/2+k*TAU);ctx.stroke();btxt('♥',p.x,p.y-120,14,'#7fd05a','center',900);}}
  ctx.restore();};
/* shop icons */
const _ii=itemIcon;itemIcon=function(id,x,y,t){if(!['pajarito','paraguas','te','ola'].includes(id)){_ii(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';
  if(id==='pajarito'){ctx.scale(1.5,1.5);drawBird(0,0,1,t);}
  else if(id==='paraguas'){ctx.scale(.6,.6);drawUmbrella({x:0,y:100});}
  else if(id==='te'){rr(-16,-8,28,24,6,'#fbf6ea',3);ctx.beginPath();ctx.arc(14,4,7,-1.2,1.2);ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ell(-2,-8,14,4,'#7fd05a',2);for(let i=0;i<3;i++){ctx.globalAlpha=.6;ctx.beginPath();ctx.moveTo(-8+i*7,-14);ctx.quadraticCurveTo(-12+i*7,-20-Math.sin(t*3+i)*3,-6+i*7,-26);ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=1;}}
  else{ctx.translate(0,-(GROUND-150)*.16);ctx.scale(.16,.16);drawOla({x:60,y:GROUND-110,dir:1},{t});}
  ctx.restore();};
})();
