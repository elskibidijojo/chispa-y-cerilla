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

/* ---------- plane SÚPER: become a big classic cartoon bomb ---------- */
const BOMBC={chispa:{body:'#2e2a22',rim:'#ffd25a',cap:'#c9cdd2',fuse:'#c8a46a',flame:'#ffb43a'},cerilla:{body:'#33231e',rim:'#ff7a3a',cap:'#c8392b',fuse:'#d8b47a',flame:'#ff8a3a'},velita:{body:'#232a36',rim:'#7ab8ff',cap:'#e8f2ff',fuse:'#4a3a2a',flame:'#7ab8ff'}};
let SHINE=null;function shine(){if(SHINE)return SHINE;const [c,g]=mk(120,120);const gr=g.createRadialGradient(42,40,6,60,60,60);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.35,'rgba(255,255,255,.12)');gr.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=gr;g.beginPath();g.arc(60,60,60,0,TAU);g.fill();SHINE=c;return c;}
function drawBigBomb(x,y,ch,t,life,vx,vy,LT){const c=BOMBC[ch]||BOMBC.chispa,R=46,sp=Math.min(1,Math.hypot(vx,vy)/500);ctx.save();ctx.translate(x,y);
  ctx.rotate(Math.max(-.35,Math.min(.35,vy*.0009))+Math.sin(LT*7)*.04);ctx.scale(1+sp*.12,1-sp*.08);ctx.lineJoin='round';ctx.lineCap='round';
  /* body */
  if(ch==='chispa'){ctx.globalAlpha=.3+.15*Math.sin(LT*8);circ(0,0,R+14,c.rim,0);ctx.globalAlpha=1;}
  circ(0,0,R,c.body,0);ctx.drawImage(shine(),-R,-R,R*2,R*2);ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.beginPath();ctx.arc(0,0,R-5,Math.PI*.15,Math.PI*.75);ctx.lineWidth=4;ctx.strokeStyle=c.rim;ctx.globalAlpha=.75;ctx.stroke();ctx.globalAlpha=1;
  ctx.beginPath();ctx.ellipse(-16,-20,13,8,-.6,0,TAU);ctx.fillStyle='rgba(255,255,255,.85)';ctx.fill();circ(-28,-6,3.5,'rgba(255,255,255,.7)',0);
  /* cap and fuse (the fuse gets shorter as time runs out) */
  ctx.save();ctx.rotate(.65);
  if(ch==='velita'){ctx.beginPath();ctx.moveTo(-22,-R+4);for(let i=0;i<=6;i++)ctx.lineTo(-22+i*7.3,-R-6+(i%2?16:0));ctx.lineTo(22,-R+4);ctx.closePath();ctx.fillStyle=c.cap;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}
  else{rr(-15,-R-14,30,18,4,c.cap,4);if(ch==='chispa'){for(let i=0;i<3;i++)line(-15,-R-10+i*5,15,-R-8+i*5,2,'rgba(20,13,8,.5)');}else{circ(-8,-R-5,2.2,'rgba(255,255,255,.6)',0);}}
  const L2=8+42*Math.max(0,life/3);ctx.beginPath();ctx.moveTo(0,-R-14);ctx.bezierCurveTo(8,-R-14-L2*.4,-10,-R-14-L2*.7,6,-R-14-L2);ctx.lineWidth=7;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle=c.fuse;ctx.stroke();
  const fx=6,fy=-R-14-L2;ctx.save();ctx.translate(fx,fy);ctx.rotate(LT*14);for(let i=0;i<8;i++){ctx.rotate(TAU/8);line(0,4,0,10+Math.abs(Math.sin(LT*30+i))*8,2.5,i%2?'#fff6c8':c.flame);}ctx.restore();
  circ(fx,fy,7+Math.sin(LT*40)*1.5,c.flame,2);circ(fx,fy,3.5,'#fffbe6',0);ctx.restore();
  /* face */
  for(const s of[-1,1]){const ex=10+s*15,ey=-2;ell(ex,ey,9,11,'#fff8ee',3);circ(ex+3,ey+1,4.5,C.ink,0);circ(ex+4.5,ey-1,1.5,'#fff',0);ctx.beginPath();ctx.moveTo(ex-10,ey-14+(s<0?-3:3));ctx.lineTo(ex+10,ey-14+(s<0?3:-3));ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-4,20);ctx.quadraticCurveTo(12,32,30,18);ctx.quadraticCurveTo(14,24,-4,20);ctx.fillStyle='#fff8ee';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.restore();}
function kaboom(L,x,y,ch){(L._kb||(L._kb=[])).push({x,y,t0:L.t,ch});}
function drawKaboom(L){if(!L._kb||!L._kb.length)return;L._kb=L._kb.filter(k=>L.t-k.t0<1.2);for(const k of L._kb){const a=L.t-k.t0,c=BOMBC[k.ch]||BOMBC.chispa,x=k.x,y=k.y;ctx.save();ctx.lineJoin='round';
    if(a<.1){ctx.globalAlpha=1-a/.1;ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);}
    const g=Math.min(1,a/.25),f=Math.max(0,1-(a-.5)/.7);ctx.globalAlpha=f;
    ctx.beginPath();ctx.arc(x,y,40+a*520,0,TAU);ctx.lineWidth=14*(1-a/1.2)+2;ctx.strokeStyle='#fff6c8';ctx.stroke();
    for(let i=0;i<9;i++){const an=i*TAU/9+.3,d=(30+i%3*18)*g+a*40;cloudShape(ctx,x+Math.cos(an)*d,y+Math.sin(an)*d*.8-a*30,(.5+(i%3)*.15)*g,i%3===0?'#ff8a3a':i%3===1?'#ffd25a':'#fff1a8',4);}
    circ(x,y,46*g,'#fffbe6',0);
    for(let i=0;i<12;i++){const an=i*2.4,d=60+a*380;ctx.save();ctx.translate(x+Math.cos(an)*d,y+Math.sin(an)*d+a*a*200);ctx.rotate(a*10+i);star(0,0,10,4,4,0);ctx.fillStyle=i%2?c.rim:'#ffe27a';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
    if(a>.08){ctx.save();ctx.translate(x,y-70-a*30);ctx.rotate(-.1);const s=Math.min(1.2,.4+a*4)*(1+.05*Math.sin(L.t*30));ctx.scale(s,s);txt('¡BUM!',0,0,58,'#ffe27a',C.ink);ctx.restore();}
    ctx.restore();}}
const _ssA=startSuper;startSuper=function(L,p){if(p.type!=='plane'){_ssA(L,p);return;}if(typeof unlockAch==='function')unlockAch('super');
  p.cards=0;L.supers++;p.superK='bombazo';p.superT=0;p.inv=Math.max(p.inv,3.6);p.bomb={t:0};L.superFlash=.25;sfx('super');sfx('pop');shake(L,8);puff(L,p.x,p.y,14,'#f4f0e6');};
const _ubA=updBullets;updBullets=function(L,dt){for(const p of L.Ps){const bm=p.bomb;if(!bm||p.dead)continue;bm.t+=dt;p.cool=1;p.shoot=false;p.inv=Math.max(p.inv,.3);
    let hit=bm.t>3;if(!hit&&bm.t>.35)for(const e of L.ents)if(!e.dead&&e.hitBy(p.x,p.y,50)){hit=true;break;}
    if(hit){p.bomb=null;p.cool=.3;p.inv=Math.max(p.inv,1.2);kaboom(L,p.x,p.y,p.char);shake(L,26);L.flash=.2;sfx('boom');sfx('phaseHit');
      for(const e of L.ents)if(!e.dead&&e.hitBy(p.x,p.y,170))e.damage(56*dmgM(p),p);}}
  _ubA(L,dt);};
const _dpPA=drawPlayers;drawPlayers=function(L){const bombs=L.Ps.filter(p=>p.bomb&&!p.dead);
  if(bombs.length){const keep=L.Ps;L.Ps=keep.filter(p=>!(p.bomb&&!p.dead));try{_dpPA(L);}finally{L.Ps=keep;}}else _dpPA(L);
  for(const p of bombs){const c=BOMBC[p.char]||BOMBC.chispa,t=p.bomb.t,lx=p._bx??p.x,ly=p._by??p.y,vx=(p.x-lx)*60,vy=(p.y-ly)*60;p._bx=p.x;p._by=p.y;
    (p._bt||(p._bt=[])).push({x:p.x-40,y:p.y,t0:L.t});p._bt=p._bt.filter(f=>L.t-f.t0<.5);for(const f of p._bt){const a=L.t-f.t0;ctx.globalAlpha=.6*(1-a/.5);cloudShape(ctx,f.x-a*160,f.y+Math.sin(f.t0*20)*6,.16+a*.5,'#d8d0c4',0);}ctx.globalAlpha=1;
    ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=3;ctx.lineCap='round';for(let i=0;i<4;i++){const yy=p.y-30+i*20,x0=p.x-70-((L.t*600+i*40)%80);ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(x0-40,yy);ctx.stroke();}
    if(t<.25){const k=t/.25;ctx.save();ctx.translate(p.x,p.y);ctx.scale(.3+k*.7,.3+k*.7);drawBigBomb(0,0,p.char,t,3-t,vx,vy,L.t);ctx.restore();cloudShape(ctx,p.x,p.y,(1-k)*.9,'#f4f0e6',3);}
    else drawBigBomb(p.x,p.y,p.char,t,3-t,vx,vy,L.t);
    if(t>2.3&&Math.floor(L.t*14)%2){ctx.globalAlpha=.3;circ(p.x,p.y,50,'#fff',0);ctx.globalAlpha=1;}}
  drawKaboom(L);};
})();
