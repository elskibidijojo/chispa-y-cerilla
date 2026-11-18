/* aviones2.js — the plane, done properly, in the spirit of the 1930s-cartoon shooters:
   - each hero's normal shot has its own colour and a glowing trail (on foot and in the plane)
   - when the plane shrinks, it fires a completely different shot: tiny fast pink sparkles
   - plane EX: a character-styled bomb that arcs forward and bursts
   - plane SÚPER: you turn INTO a giant bomb, steer it for a few seconds and boom
     (Chispa: a glass bulb-bomb, Cerilla: a red match-head bomb, Velita: a blue wax bomb) */
(function(){
const COL={chispa:{core:'#fffbe6',glow:'#ffd25a',dark:'#c8901a',body:'#ffe9a0'},cerilla:{core:'#fff1e0',glow:'#ff7a3a',dark:'#b8401a',body:'#e8562e'},velita:{core:'#f0f8ff',glow:'#7ab8ff',dark:'#3a6ab8',body:'#bfe0ff'}};
const col=p=>COL[p&&p.char]||COL.chispa;

/* ---------- shots ---------- */
function drawPea(b,L){const c=b.c||COL.chispa,a=Math.atan2(b.vy,b.vx),r=b.r;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);
  ctx.globalAlpha=.35;ell(-r*2.2,0,r*2.2,r*.55,c.glow,0);ctx.globalAlpha=.6;ell(-r*1.1,0,r*1.4,r*.75,c.glow,0);ctx.globalAlpha=1;
  const s=1+.12*Math.sin(L.t*50+b.x);ctx.scale(s,1/s);ell(0,0,r*1.25,r*.85,c.glow,2.5);ell(r*.2,0,r*.75,r*.5,c.core,0);ctx.restore();}
function drawMini(b,L){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(L.t*30+b.y);ctx.globalAlpha=.5;circ(0,0,b.r*2,'#ff9ad5',0);ctx.globalAlpha=1;star(0,0,b.r*1.4,b.r*.6,4,0);ctx.fillStyle='#ffe6f4';ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle='#b8407a';ctx.stroke();ctx.restore();}
const _BA=B_;B_=function(L,p,b){const r=_BA(L,p,b);if(p&&r&&!r.draw){
    if(p.type==='plane'&&p.small&&r.k!=='ex'){r.draw=drawMini;}
    else if(r.k==='chispa'){r.c=col(p);r.draw=drawPea;}}return r;};
/* the plain plane shot: small plane fires faster, tinier sparkles */
if(typeof PLANE_W!=='undefined'&&PLANE_W[0]){PLANE_W[0].fire=function(L,p){if(p.small){p.cool=.055;B_(L,p,{x:p.x+18,y:p.y+2,vx:1350,vy:(rand()-.5)*80,r:4,dmg:.42,life:.5,k:'mini',draw:drawMini});sfx('shot','varita');}
  else{p.cool=.09;B_(L,p,{x:p.x+32,y:p.y+3,vx:1100,vy:(rand()-.5)*40,r:7,dmg:1,life:1,k:'chispa'});sfx('shot','chispa');}};}

/* ---------- plane EX: a styled little bomb ---------- */
function drawHeroBomb(b,L){const c=b.c||COL.chispa,ch=b.ch||'chispa',s=b.s||1;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.sin(L.t*8)*.15+(b.spin?L.t*6:0));ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';
  if(ch==='cerilla'){rr(-5,-30,10,18,3,'#c8a46a',2.5);}else if(ch==='velita'){rr(-2,-26,4,12,1,'#4a3a2a',0);}else{rr(-9,-28,18,14,3,C.steel,2.5);line(-9,-23,9,-23,1.5);}
  circ(0,0,20,c.body,3.5);ell(-7,-8,6,4,'rgba(255,255,255,.75)',0);
  if(ch==='chispa'){ctx.beginPath();ctx.moveTo(-6,6);ctx.quadraticCurveTo(0,-10,6,6);ctx.lineWidth=2;ctx.strokeStyle=c.dark;ctx.stroke();}
  if(ch==='velita'){for(let i=0;i<3;i++)ell(-10+i*10,16+(i%2)*2,3,5,'#e8f4ff',1.5);}
  circ(-6,2,2.6,C.ink,0);circ(6,2,2.6,C.ink,0);ctx.beginPath();ctx.arc(0,8,4,.2,Math.PI-.2);ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();
  const fy=ch==='cerilla'?-34:ch==='velita'?-30:-30;const f=Math.sin(L.t*40)*1.5;circ(0,fy+f,ch==='cerilla'?7:5,ch==='velita'?'#7ab8ff':'#ffb43a',ch==='cerilla'?2:0);circ(0,fy+f,2.5,'#fff6c8',0);
  if(ch==='cerilla')circ(0,-34,8,'#c8392b',2.5);ctx.restore();}
function boomRing(L,x,y,R,c,n=10){boom(L,x,y,R*.8);for(let i=0;i<n;i++){const a=i*TAU/n;L.fx.push({k:'spark',x,y,vx:Math.cos(a)*R*5,vy:Math.sin(a)*R*5,life:.45,max:.45,r:5,col:i%2?c.glow:c.core});}}
function planeEX(L,p){const c=col(p);const b=B_(L,p,{x:p.x+24,y:p.y+6,vx:520,vy:-160,g:520,r:18,dmg:0,life:1.6,k:'exbomb',pierce:true,noGain:true,draw:drawHeroBomb,c,ch:p.char,s:.9,spin:true});
  b.upd=(b,L,dt)=>{const tg=typeof nearestEnt==='function'?nearestEnt(L,b.x,b.y):null;if(tg){const cc=tg.center();b.vy+=(cc.y-b.y)*dt*2.2;}
    let hit=b.life<.08||b.y>H-30;if(!hit)for(const e of L.ents)if(!e.dead&&e.hitBy(b.x,b.y,b.r+6)){hit=true;break;}
    if(hit){b.life=0;boomRing(L,b.x,b.y,70,c);shake(L,8);sfx('boom');for(const e of L.ents)if(!e.dead&&e.hitBy(b.x,b.y,95))e.damage(13*dmgM(p),p);}};}
if(typeof PLANE_W!=='undefined'){PLANE_W[0].ex=planeEX;if(PLANE_W[2])PLANE_W[2].ex=planeEX;}

/* ---------- plane SÚPER: become the bomb ---------- */
const _ssA=startSuper;startSuper=function(L,p){if(p.type!=='plane'){_ssA(L,p);return;}if(typeof unlockAch==='function')unlockAch('super');
  p.cards=0;L.supers++;p.superK='bombazo';p.superT=0;p.inv=Math.max(p.inv,3.6);p.bomb={t:0};L.superFlash=.35;sfx('super');shake(L,10);banner(L,'¡SÚPER BOMBA!',1);};
const _ubA=updBullets;updBullets=function(L,dt){for(const p of L.Ps){const bm=p.bomb;if(!bm||p.dead)continue;bm.t+=dt;p.cool=1;p.shoot=false;p.inv=Math.max(p.inv,.3);
    let hit=bm.t>3;if(!hit&&bm.t>.35)for(const e of L.ents)if(!e.dead&&e.hitBy(p.x,p.y,46)){hit=true;break;}
    if(hit){p.bomb=null;p.cool=.3;p.inv=Math.max(p.inv,1.2);const c=col(p);boomRing(L,p.x,p.y,150,c,18);boom(L,p.x+40,p.y-30,90);boom(L,p.x-30,p.y+30,80);shake(L,24);L.flash=.35;sfx('boom');sfx('phaseHit');
      for(const e of L.ents)if(!e.dead&&e.hitBy(p.x,p.y,170))e.damage(56*dmgM(p),p);}}
  _ubA(L,dt);};
const _dpPA=drawPlayers;drawPlayers=function(L){const bombs=L.Ps.filter(p=>p.bomb&&!p.dead);if(!bombs.length){_dpPA(L);return;}
  const keep=L.Ps;L.Ps=keep.filter(p=>!(p.bomb&&!p.dead));try{_dpPA(L);}finally{L.Ps=keep;}
  for(const p of bombs){const c=col(p),t=p.bomb.t,warn=t>2.2;ctx.save();
    for(let i=0;i<6;i++){const k=((L.t*3+i/6)%1);ctx.globalAlpha=.5*(1-k);circ(p.x-30-k*70,p.y+Math.sin(L.t*9+i)*8,10+k*12,c.glow,0);}ctx.globalAlpha=1;
    const s=2.3+(warn?Math.sin(L.t*40)*.12:Math.sin(L.t*6)*.05);drawHeroBomb({x:p.x,y:p.y,c,ch:p.char,s},L);
    if(warn&&Math.floor(L.t*12)%2){ctx.globalAlpha=.35;circ(p.x,p.y,50,'#fff',0);ctx.globalAlpha=1;}
    btxt(String(Math.max(0,3-t).toFixed(1)),p.x,p.y-72,16,warn?'#e23b3b':C.paper,'center',900);ctx.restore();}};
})();
