'use strict';
/* ================= MECÁNICAS (Rollo n.º 9): a signature mechanic for every boss of islands 1-3,
   bombs you can parry back, phase transformations for every boss ================= */
const MECH_INFO={};
function mWorld(L,fn){const f=L.drawWorld;L.drawWorld=()=>{f&&f();fn();};}
function mFG(L,fn){const f=L.drawFG;L.drawFG=()=>{f&&f();fn();};}
function mBG(L,fn){const f=L.drawBG;L.drawBG=()=>{f();fn();};}
function mHitP(L,x,y,r){if(L.state!=='play')return;for(const p of L.Ps){if(p.dead||p.inv>0)continue;const b=pBox(p),cx=clamp(x,b.x,b.x+b.w),cy=clamp(y,b.y,b.y+b.h);if((cx-x)**2+(cy-y)**2<r*r)hurt(L,p);}}
function mechOn(id,label,fn){const d=LEVELS[id];if(!d)return;MECH_INFO[id]=label;const c=d.create;d.create=(...args)=>{const L=c(...args);if(L&&L.boss)fn(L,L.boss,d);return L;};}
function addAtk(id,ph,a){const d=LEVELS[id];if(d&&d.phases[ph])d.phases[ph].atk.push(a);}
const mPlay=L=>L.state==='play';
function mArrow(x,y,dir,s,col,a=1){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.scale(dir*s,s);poly([[-14,-8],[2,-8],[2,-16],[16,0],[2,16],[2,8],[-14,8]],col,2.5);ctx.restore();}

/* ---------- player-side effects (floor belts, water, suction, gusts, springs) ---------- */
const _platUpdM=platUpdate;
platUpdate=function(L,p,dt,I){const x0=p.x,air=!p.ground;_platUpdM(L,p,dt,I);if(p.dead||L.kind==='run')return;
  if(L.belt&&L.belt.v&&p.ground&&p.y>=GROUND-2&&mPlay(L))p.x=clamp(p.x+L.belt.v*dt,24,W-24);
  if(L.tide&&p.y-14>L.tide.y){p.x=x0+(p.x-x0)*.55;if(p.vy>240)p.vy=240;if(!p.wet){p.wet=true;for(let i=0;i<6;i++)L.fx.push({k:'puff',x:p.x+(rand()-.5)*30,y:L.tide.y,vx:(rand()-.5)*160,vy:-120-rand()*120,life:.4,max:.4,r:6,col:'#cfeaff'});sfx('splash');}
    if(rand()<dt*6)L.fx.push({k:'puff',x:p.x+(rand()-.5)*20,y:p.y-30,vx:0,vy:-90,life:.6,max:.6,r:4,col:'#cfeaff'});}else p.wet=false;
  if(L.suck&&L.suck.t>0&&L.suck.t<L.suck.dur&&mPlay(L)){const dx=L.suck.x-p.x;if(Math.abs(dx)>70)p.x=clamp(p.x+Math.sign(dx)*175*dt,24,W-24);}
  if(L.springs&&p.ground&&air&&p.y>=GROUND-2)for(const s of L.springs)if(Math.abs(p.x-s.x)<38){p.vy=-1380;p.ground=false;p.airDash=true;s.sq=1;sfx('boing');puff(L,s.x,GROUND-6,5);pop(L,s.x,GROUND-60,'¡BOING!',C.gold);break;}};
const _planeUpdM=planeUpdate;
planeUpdate=function(L,p,dt,I){_planeUpdM(L,p,dt,I);if(p.dead)return;if(L.gust&&L.gust.t>0&&L.gust.t<L.gust.dur&&mPlay(L))p.y=clamp(p.y+L.gust.vy*dt,30,H-30);};

/* ---------- 1. PÉNDULO: a giant clock pendulum sweeps the floor (El Despertador) ---------- */
function mPendulum(L,B,from){const P={a:0,t:0,on:0};L.pend=P;const px=480,py=-40,len=452;
  chainUpd(L,dt=>{if(B.phase<from||B.dead){P.on=Math.max(0,P.on-dt*2);return;}P.on=Math.min(1,P.on+dt*1.2);if(P.on<1&&P.t===0){if(!P.snd){P.snd=1;sfx('tick');banner(L,'¡CUIDADO CON EL PÉNDULO!',1.4);}}
    P.t+=dt;P.a=.95*Math.sin(P.t*TAU/3.6);const bx=px+Math.sin(P.a)*len,by=py+Math.cos(P.a)*len*P.on;P.x=bx;P.y=by;
    if(P.on>=1)mHitP(L,bx,by,30);const s=Math.sign(Math.cos(P.t*TAU/3.6));if(s!==P.ls){P.ls=s;if(P.on>=1)sfx('tick');}});
  mWorld(L,()=>{if(!P.on)return;const bx=P.x,by=P.y;ctx.save();ctx.lineCap='round';line(px,py,bx,by,9);line(px,py,bx,by,4,C.brass);
    circ(bx,by,36,'#c99a3a',5);circ(bx,by,26,'#f2c14e',3);face(bx,by-2,.4,{gap:20,ew:9,eh:12,my:24,mw:20,open:.4,look:{x:Math.sign(Math.cos(P.t*TAU/3.6)),y:.2},ang:.25});
    for(let i=0;i<3;i++){const k=i/3;ctx.globalAlpha=.18-k*.05;circ(bx-Math.cos(P.t*TAU/3.6)*30*(i+1),by-Math.abs(Math.sin(P.a))*10*(i+1),30,'#f2c14e',0);}ctx.globalAlpha=1;ctx.restore();});}

/* ---------- 2. CINTA: the floor moves (the spinning record, the typewriter carriage) ---------- */
function mBelt(L,B,kind){const Bt={v:0,t:0,dir:1,warn:0};L.belt=Bt;
  chainUpd(L,dt=>{if(!mPlay(L)||B.dead){Bt.v=lerp(Bt.v,0,Math.min(1,dt*4));return;}Bt.t+=dt;
    if(kind==='disco'){const per=[7,6,5][B.phase]||5,k=Bt.t%per;if(k<dt&&Bt.t>dt){Bt.dir*=-1;sfx('knock');}Bt.warn=k>per-1.1?1:0;Bt.v=lerp(Bt.v,Bt.dir*[105,125,145][B.phase],Math.min(1,dt*3));}
    else{const per=6.5,k=Bt.t%per;if(k<5.2){Bt.v=lerp(Bt.v,[70,85,100][B.phase]||90,Math.min(1,dt*3));Bt.warn=k>4.4?1:0;Bt.ding=0;}else{if(!Bt.ding){Bt.ding=1;sfx('ding');pop(L,W-120,GROUND-80,'¡DING!',C.gold);}Bt.v=-320;Bt.warn=0;}}
    Bt.off=(Bt.off||0)+Bt.v*dt;});
  mBG(L,()=>{const o=((Bt.off||0)%60+60)%60;ctx.save();ctx.beginPath();ctx.rect(0,GROUND,W,22);ctx.clip();ctx.fillStyle=kind==='disco'?'#1d1a1a':'#5b4a3a';ctx.fillRect(0,GROUND,W,22);
    for(let x=-60+o;x<W+60;x+=60){ctx.fillStyle=kind==='disco'?'rgba(255,255,255,.12)':'rgba(242,193,78,.4)';ctx.fillRect(x,GROUND+2,30,18);}ctx.restore();line(0,GROUND+22,W,GROUND+22,3);
    const d=Math.sign(Bt.v)||1,fl=Bt.warn&&Math.floor(L.t*8)%2;for(let i=0;i<8;i++)mArrow(60+i*120,GROUND+11,fl?-d:d,.55,fl?C.rust:C.gold,.9);});
  MECH_INFO[L.id]=MECH_INFO[L.id]||'';}

/* ---------- 3. BOMBAS DE VUELTA: parry them and they fly back to the boss ---------- */
ATK.retBomb=function(L,B,a){const o=anc(B,a.from),t=aimPt(tgt(L,B)),an=Math.atan2(t.y-o.y,t.x-o.x),sp=a.spd||200;spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,r:a.r||22,spr:'bombav',parry:true,retBomb:B,life:7,spd:sp,turn:a.turn||.6});
  B.throwT=.35;sfx('throw');if(!B.rbTold){B.rbTold=1;pop(L,o.x,o.y-50,'¡DEVUÉLVELA!',C.parryL);}};
const _doParryM=doParry;
doParry=function(L,p,o){_doParryM(L,p,o);if(!o.retBomb||!L.boss||L.boss.dead)return;const B=L.boss;
  B_(L,p,{x:o.x,y:o.y,vx:0,vy:0,r:1,dmg:0,life:3,pierce:true,k:'retb',sp:900,t:0,
    upd(b,L,dt){b.hits=allHit(L);b.t+=dt;b.life=1;if(B.dead){b.life=0;return;}const c=B.center(),dx=c.x-b.x,dy=c.y-b.y,d=Math.hypot(dx,dy)||1;b.x+=dx/d*b.sp*dt;b.y+=dy/d*b.sp*dt;b.sp+=1400*dt;
      if(rand()<.7)L.fx.push({k:'spark',x:b.x,y:b.y,vx:(rand()-.5)*80,vy:(rand()-.5)*80,life:.3,max:.3,r:5,col:C.parryL});
      if(B.hitBy(b.x,b.y,24)||d<40||b.t>2.5){b.life=0;B.damage(18*dmgM(p),p);B.squash=.3;gain(p,8);boom(L,b.x,b.y,70);shake(L,14);sfx('boom');sfx('hitBig');pop(L,b.x,b.y-60,'¡DE VUELTA!',C.parryL);}},
    draw(b){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.t*14);circ(0,0,22,C.parry,3.5);line(0,-22,8,-34,3);star(10,-36,8,3,6,b.t*20);ctx.fillStyle='#ffe27a';ctx.fill();ctx.restore();}});};

/* ---------- 4. ESCUDO DE ORBES: while the orbs spin, the boss barely takes damage ---------- */
ATK.orbShield=function(L,B,a){if(L.ents.some(e=>e.orbOf===B&&!e.dead))return;const n=a.n||3,c=B.center();
  for(let i=0;i<n;i++){const e=mkEnt(L,{tag:B,ai:'orbe',skin:'orbe',kind:a.skin||'nuez',hp:a.hp||7,r:24,x:c.x,y:c.y,orbOf:B,orbA:i*TAU/n,orbR:0,orbMax:a.rad||165,active:true,noCoin:true});e.t=0;}
  B.shieldOn=1;sfx('magic');banner(L,'¡ESCUDO! Rompe los orbes',1.3);};
function mShield(L,B){const has=()=>L.ents.some(e=>e.orbOf===B&&!e.dead);const d0=B.damage;
  B.damage=(d,p)=>{if(has()){d*=.2;if(!B.shT||L.t-B.shT>.7){B.shT=L.t;const c=B.center();pop(L,c.x,c.y-120,'¡ESCUDO!',C.steel);sfx('deny');}}d0(d,p);};
  chainUpd(L,dt=>{const c=B.center();for(const e of L.ents){if(e.orbOf!==B||e.dead)continue;e.orbR=lerp(e.orbR,e.orbMax,Math.min(1,dt*3));e.orbA+=dt*(1.4+.3*B.phase);e.x=c.x+Math.cos(e.orbA)*e.orbR;e.y=c.y+Math.sin(e.orbA)*e.orbR*.8;e.face=-1;}});
  mWorld(L,()=>{if(!has()||B.dead)return;const c=B.center();ctx.save();ctx.globalAlpha=.22+Math.sin(L.t*6)*.06;circ(c.x,c.y,150,'#bfe7ff',0);ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(c.x,c.y,150,0,TAU);ctx.lineWidth=3;ctx.setLineDash([12,10]);ctx.lineDashOffset=-L.t*40;ctx.strokeStyle='#e6f6ff';ctx.stroke();ctx.setLineDash([]);
    for(const e of L.ents)if(e.orbOf===B&&!e.dead){ctx.globalAlpha=.5;line(c.x,c.y,e.x,e.y,2,'#e6f6ff');}ctx.restore();});}
const ENM={orbe(e,t,F){const k=e.kind,s=1+Math.sin(t*8)*.05;ctx.scale(s,s);
  if(k==='nuez'){ell(0,0,20,24,F('#a8703a'),3);for(const y of[-10,0,10])line(-14,y,14,y+2,2,'rgba(20,13,8,.5)');line(0,-24,0,24,2.5);}
  else if(k==='libro'){ctx.rotate(Math.sin(t*4)*.3);rr(-20,-14,40,28,3,F('#7a2e3a'),3);rr(-16,-11,32,22,2,F('#fbf0d4'),2);line(0,-11,0,11,2);for(const y of[-5,0,5]){line(-12,y,-3,y,1.5);line(3,y,12,y,1.5);}}
  else if(k==='foco'){circ(0,-4,18,F('#2a2440'),3);circ(0,-4,10,F('#8a63c7'),0);rr(-8,12,16,10,2,C.steel,2.5);}
  else{rr(-11,-20,22,34,10,F('#ffd9a0'),3);ctx.globalAlpha=.6+Math.sin(t*12)*.3;circ(0,-6,7,'#ff9a3a',0);ctx.globalAlpha=1;rr(-13,12,26,10,2,C.steel,2.5);}
  circ(-6,-2,2.4,C.ink,0);circ(6,-2,2.4,C.ink,0);}};
const _drawEnemyM=drawEnemy;drawEnemy=function(e,t){const f=ENM[e.skin];if(!f){_drawEnemyM(e,t);return;}ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;const fl=e.flash>0,F=c=>fl?'#fff':c;f(e,e.t||0,F);ctx.restore();};

/* ---------- 5. PUNTO DÉBIL: a target opens on the boss; hits there do double damage ---------- */
ATK.weak=function(L,B,a){B.weak={t:a.dur||4,at:a.at,dx:a.dx||0,dy:a.dy||0,r:a.r||46};sfx('ding');if(!B.wkTold){B.wkTold=1;banner(L,'¡PUNTO DÉBIL! Apunta al blanco',1.3);}};
function weakPos(B){const w=B.weak,o=w.at?anc(B,w.at):B.center();return{x:o.x+w.dx,y:o.y+w.dy};}
function mWeak(L,B){const hb=B.hitBy,d0=B.damage;B.hitBy=(x,y,r)=>{const h=hb(x,y,r);if(h){B._hx=x;B._hy=y;}return h;};
  B.damage=(d,p)=>{if(B.weak&&B.weak.t>0&&B._hx!=null){const s=weakPos(B);if(Math.hypot(B._hx-s.x,B._hy-s.y)<B.weak.r+14){d*=2.2;if(!B.crT||L.t-B.crT>.35){B.crT=L.t;pop(L,s.x,s.y-50,'¡CRÍTICO!',C.gold);sparks(L,s.x,s.y,6,C.gold);sfx('ding');}}}B._hx=null;d0(d,p);};
  chainUpd(L,dt=>{if(B.weak){B.weak.t-=dt;if(B.weak.t<=0)B.weak=null;}});
  mWorld(L,()=>{if(!B.weak||B.dead)return;const s=weakPos(B),k=Math.min(1,(4-B.weak.t)*4),bl=B.weak.t<1&&Math.floor(L.t*10)%2;if(bl)return;ctx.save();ctx.translate(s.x,s.y);ctx.scale(k,k);ctx.rotate(L.t*2);
    for(const [r,c] of[[B.weak.r,'rgba(232,86,46,.55)'],[B.weak.r*.66,'rgba(255,246,223,.6)'],[B.weak.r*.33,'rgba(232,86,46,.85)']])circ(0,0,r,c,2.5);for(let i=0;i<4;i++){ctx.rotate(TAU/4);line(B.weak.r+4,0,B.weak.r+16,0,3,C.gold);}ctx.restore();});}

/* ---------- 6. MAREA: the water rises and slows you down ---------- */
function mTide(L,B,from){const T={y:GROUND+40,t:0};L.tide=T;
  chainUpd(L,dt=>{const on=B.phase>=from&&!B.dead&&L.state!=='intro';if(on)T.t+=dt;const per=13,k=T.t%per;let tg=GROUND+40;
    if(on){if(k>6&&k<8)tg=lerp(GROUND+40,GROUND-110,(k-6)/2);else if(k>=8&&k<11)tg=GROUND-110;else if(k>=11)tg=lerp(GROUND-110,GROUND+40,(k-11)/2);
      if(k>5&&k<5+dt*1.5){banner(L,'¡SUBE LA MAREA!',1.1);sfx('splash');}}
    T.y=lerp(T.y,tg,Math.min(1,dt*6));});
  mFG(L,()=>{if(T.y>GROUND+30)return;ctx.save();ctx.globalAlpha=.42;ctx.fillStyle='#3a8fc4';ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=20)ctx.lineTo(x,T.y+Math.sin(x*.03+L.t*3)*6);ctx.lineTo(W,H);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
    ctx.beginPath();for(let x=0;x<=W;x+=20)x?ctx.lineTo(x,T.y+Math.sin(x*.03+L.t*3)*6):ctx.moveTo(x,T.y+Math.sin(L.t*3)*6);ctx.lineWidth=3;ctx.strokeStyle='#e6f6ff';ctx.stroke();
    for(let i=0;i<8;i++){const x=(i*131+L.t*40)%W;ell(x,T.y+Math.sin(x*.03+L.t*3)*6-2,10,3,'rgba(255,255,255,.7)',0);}ctx.restore();});}

/* ---------- 7. ASPIRADORA: the boss sucks the air and drags you in ---------- */
ATK.suck=function(L,B,a){const o=anc(B,a.from||'mouth');L.suck={t:-.8,dur:a.dur||2.2,x:o.x,y:o.y};banner(L,'¡ASPIRA!',1);sfx('whistleUp');};
function mSuck(L,B){chainUpd(L,dt=>{const S=L.suck;if(!S)return;S.t+=dt;if(S.t>S.dur){L.suck=null;return;}const o=anc(B,'mouth');S.x=o.x;S.y=o.y;
    if(S.t>0&&rand()<dt*30)L.fx.push({k:'puff',x:S.x-200-rand()*500,y:GROUND-20-rand()*300,vx:500+rand()*200,vy:0,life:.6,max:.6,r:6+rand()*5,col:'#eae4d6'});});
  mFG(L,()=>{const S=L.suck;if(!S)return;ctx.save();if(S.t<0){ctx.globalAlpha=.5+Math.sin(L.t*30)*.3;for(let i=0;i<3;i++)mArrow(S.x-120-i*60,S.y,1,1,C.gold);}
    else{ctx.globalAlpha=.55;ctx.strokeStyle='#fff6df';ctx.lineWidth=3;for(let i=0;i<10;i++){const k=((L.t*1.6+i/10)%1),r=40+k*420,a0=i*.63;ctx.beginPath();ctx.arc(S.x,S.y,r,Math.PI*.7+a0*.1,Math.PI*1.3+a0*.1);ctx.stroke();}}ctx.restore();});}

/* ---------- 8. OSCURIDAD: only the boss's own flame and your glow light the room ---------- */
function mDark(L,B,from,flash){L.permDark=()=>B.phase>=from&&!B.dead&&L.state!=='intro';L.darkA=.88;L.lanterns=L.lanterns||[];const me={x:0,y:0,lit:true};L.lanterns.push(me);
  if(L.plats)for(const s of L.plats)L.lanterns.push(Object.defineProperties({lit:true},{x:{get:()=>s.x+s.w/2},y:{get:()=>s.y-10}}));
  chainUpd(L,dt=>{const o=anc(B,'flame');me.x=o.x;me.y=o.y;if(flash){L.flT=(L.flT||4)-dt;if(L.flT<=0){L.flT=3.5+rand()*2;L.darkA=.12;sfx('boom');L.flash=Math.max(L.flash,.08);}L.darkA=lerp(L.darkA,.9,Math.min(1,dt*1.6));}
    if(L.permDark()&&!L.dkTold){L.dkTold=1;banner(L,flash?'¡NOCHE DE TORMENTA!':'¡SE APAGAN LAS LUCES!',1.3);}});}

/* ---------- 9. RÁFAGAS: wind gusts push your plane up or down ---------- */
ATK.gust=function(L,B,a){const up=rand()<.5;L.gust={t:-.9,dur:a.dur||2.2,vy:(up?-1:1)*(a.force||230)};sfx('whistleDown');};
function mGust(L,B){chainUpd(L,dt=>{const G=L.gust;if(!G)return;G.t+=dt;if(G.t>G.dur)L.gust=null;});
  mFG(L,()=>{const G=L.gust;if(!G)return;const d=Math.sign(G.vy);ctx.save();if(G.t<0){ctx.globalAlpha=.5+Math.sin(L.t*30)*.35;for(const x of[40,W-40]){ctx.save();ctx.translate(x,H/2);ctx.rotate(d*Math.PI/2);mArrow(0,0,1,1.4,C.gold);ctx.restore();}}
    else{ctx.strokeStyle='rgba(239,224,191,.55)';ctx.lineWidth=2;for(let i=0;i<22;i++){const x=(i*47)%W,y=(((L.t*900*d+i*97)%(H+200))+H+200)%(H+200)-100;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-d*60);ctx.stroke();}}ctx.restore();});}

/* ---------- 10. JUEGO DE SOMBREROS: the magician hides under one of three hats ---------- */
ATK.shellGame=function(L,B,a){if(B.shell||B.dead)return;const xs=[200,480,760],real=Math.floor(rand()*3);B.shell={ph:'show',t:0,real,swaps:0,sw:null};B.act={type:'shell'};B.hidden=true;sfx('magic');puff(L,B.x,GROUND-100,14);
  B.shell.hats=xs.map((x,i)=>{const e=mkEnt(L,{tag:B,ai:'hat',skin:'sombrero',hp:999,r:56,x,y:GROUND-60,hatOf:B,idx:i,active:true,noCoin:true});e.contact=()=>false;const d0=e.damage;e.damage=(d,p)=>{e.flash=.06;if(B.shell&&B.shell.ph==='pick')shellPick(L,B,e,p);};return e;});
  banner(L,'¿DÓNDE ESTÁ EL MAGO?',1.4);};
function shellPick(L,B,e,p){const S=B.shell;if(!S||S.ph!=='pick')return;if(e.idx===S.real){S.ph='done';sfx('ding');sfx('hitBig');pop(L,e.x,e.y-110,'¡TE ENCONTRÉ!',C.gold);for(const h of S.hats)h.dead=true;B.x=e.x;B.hidden=false;B.act=null;B.shell=null;B.flash=.2;B.squash=.4;
    const d=(B._shellDmg||20)*dmgM(p);B.damage(d,p);stars(L,e.x,GROUND-150,14);gain(p,6);}
  else if(!e.flop){e.flop=1;sfx('pop');pop(L,e.x,e.y-110,'¡NADA!',C.paper);puff(L,e.x,e.y,10);for(let i=0;i<8;i++){const an=i*TAU/8;spawnEB(L,{k:'shot',x:e.x,y:e.y-30,vx:Math.cos(an)*230,vy:Math.sin(an)*230,r:12,spr:'card',parry:i===0});}e.dead=true;}}
function mShell(L,B){chainUpd(L,dt=>{const S=B.shell;if(!S)return;S.t+=dt;
    if(S.ph==='show'){if(S.t>1.4){S.ph='shuffle';S.t=0;}}
    else if(S.ph==='shuffle'){if(!S.sw||S.sw.k>=1){if(S.swaps>=[6,7,9][B.phase]||0){S.ph='pick';S.t=0;banner(L,'¡DISPARA AL SOMBRERO CORRECTO!',1.2);S.sw=null;}
        else{const live=S.hats.filter(h=>!h.dead);const a=pick(live);let b=pick(live);if(b===a)b=live[(live.indexOf(a)+1)%live.length];S.sw={a,b,ax:a.x,bx:b.x,k:0};S.swaps++;sfx('dash');}}
      if(S.sw){S.sw.k=Math.min(1,S.sw.k+dt*(2.6+B.phase*.6));const k=S.sw.k,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;S.sw.a.x=lerp(S.sw.ax,S.sw.bx,e);S.sw.b.x=lerp(S.sw.bx,S.sw.ax,e);S.sw.a.y=GROUND-60-Math.sin(k*Math.PI)*60;S.sw.b.y=GROUND-60+Math.sin(k*Math.PI)*0;}}
    else if(S.ph==='pick'){if(S.t>6){const e=S.hats[S.real];sfx('laugh');pop(L,e.x,e.y-110,'¡JA, JA!',C.rust);for(const h of S.hats)h.dead=true;B.x=e.x;B.hidden=false;B.act=null;B.shell=null;puff(L,e.x,GROUND-100,12);}}
    if(B.shell)for(const h of B.shell.hats)if(!h.dead){h.vx=0;h.vy=0;}});}
ENM.sombrero=function(e,t,F){const S=e.hatOf&&e.hatOf.shell,show=S&&S.ph==='show'&&e.idx===S.real,lift=show?Math.sin(Math.min(1,S.t/.5)*Math.PI*.5)*40*(S.t<1.1?1:Math.max(0,(1.4-S.t)/.3)):0;
  if(show){face(0,-lift+30,.5,{gap:22,ew:11,eh:14,my:26,mw:22,open:.6,look:{x:0,y:0},ang:.2});}
  ctx.save();ctx.translate(0,-lift);ell(0,50,70,14,F('#2b2420'),4);rr(-48,-50,96,100,10,F('#2b2420'),4);rr(-48,22,96,14,0,F('#c8392b'),0);ell(0,-50,48,10,F('#3a3230'),3);
  if(S&&S.ph==='pick'){ctx.globalAlpha=.5+Math.sin(t*8+e.idx)*.3;btxt('?',0,-8,36,C.gold,'center',900);ctx.globalAlpha=1;}ctx.restore();};

/* ---------- 11. MUELLES: springs on the floor launch you high (land on them) ---------- */
function mSprings(L,B,xs){L.springs=xs.map(x=>({x,sq:0}));chainUpd(L,dt=>{for(const s of L.springs)s.sq=Math.max(0,s.sq-dt*3);});
  mWorld(L,()=>{for(const s of L.springs){const c=1-s.sq*.5,top=GROUND-8-22*c;ctx.save();rr(s.x-34,GROUND-8,68,10,4,C.steel,3);for(let i=0;i<4;i++){const y=lerp(GROUND-8,top,i/4);ctx.beginPath();ctx.ellipse(s.x,y,24,4,0,0,TAU);ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}
    rr(s.x-36,top-10,72,12,5,'#e8562e',3);mArrow(s.x,top-30,1,.5,C.gold,.5+Math.sin(L.t*6)*.3);ctx.restore();}});}

/* ---------- give every old boss its mechanic ---------- */
function mBomb(id,ph,from,every,label){addAtk(id,ph,{f:'retBomb',every,delay:every*.5,from});MECH_INFO[id]=label||'Bombas de vuelta: devuélvelas con parry';}
mechOn('reloj','Péndulo gigante (desde la fase 2)',(L,B)=>mPendulum(L,B,1));
mechOn('gramo','Disco giratorio: el suelo se mueve',(L,B)=>mBelt(L,B,'disco'));
mechOn('maquina','Carro de la máquina: el suelo avanza y vuelve con ¡DING!',(L,B)=>mBelt(L,B,'carro'));
mechOn('baron','Ráfagas de viento empujan tu avión',(L,B)=>mGust(L,B));for(const ph of[0,1,2])addAtk('baron',ph,{f:'gust',every:[7,6,5][ph],delay:3,force:[210,240,270][ph]});
for(const [id,ph,from,ev] of[['tostada',0,'hand',6],['tostada',2,'hand',5],['ballena',1,'mouth',6],['ballena',2,'mouth',5],['espantapajaros',0,'hand',6],['espantapajaros',2,'hand',5],['cuervo',1,'hand',6],['cuervo',2,'hand',5]])mBomb(id,ph,from,ev);
mechOn('cascanueces','Escudo de nueces (fase 2)',(L,B)=>mShield(L,B));addAtk('cascanueces',1,{f:'orbShield',every:14,delay:2,skin:'nuez',n:3,noAct:true});
mechOn('buho','Escudo de libros',(L,B)=>mShield(L,B));addAtk('buho',0,{f:'orbShield',every:16,delay:3,skin:'libro',n:3,noAct:true});addAtk('buho',2,{f:'orbShield',every:14,delay:2,skin:'libro',n:4,noAct:true});
mechOn('apagon','Escudo de focos fundidos (fase 3)',(L,B)=>mShield(L,B));addAtk('apagon',2,{f:'orbShield',every:15,delay:2,skin:'foco',n:4,noAct:true});
mechOn('radio','Escudo de válvulas (fase 3)',(L,B)=>mShield(L,B));addAtk('radio',2,{f:'orbShield',every:14,delay:2,skin:'valvula',n:3,noAct:true});
mechOn('faro','Punto débil en la lámpara',(L,B)=>mWeak(L,B));for(const ph of[0,1,2])addAtk('faro',ph,{f:'weak',every:7,delay:2,at:'lens',dx:60,dur:3.5,noAct:true});
mechOn('paraguas','Punto débil en la tela',(L,B)=>mWeak(L,B));for(const ph of[0,1,2])addAtk('paraguas',ph,{f:'weak',every:7.5,delay:2.5,at:'cloud',dy:70,dur:3.5,noAct:true});
mechOn('cangrejo','Marea: el agua sube y te frena (fase 2)',(L,B)=>mTide(L,B,1));
mechOn('pulpo','Marea alta: el agua sube y te frena',(L,B)=>mTide(L,B,0));
mechOn('caldera','Aspiradora: te arrastra hacia la caldera',(L,B)=>mSuck(L,B));for(const ph of[0,1,2])addAtk('caldera',ph,{f:'suck',every:[9,8,7][ph],delay:4,from:'mouth',dur:2.2});
mechOn('vela','Oscuridad: solo alumbran las velas (fase 2)',(L,B)=>mDark(L,B,1,false));
mechOn('murcielago','Noche de tormenta: relámpagos y oscuridad',(L,B)=>mDark(L,B,0,true));
mechOn('chistera','Juego de sombreros (fase 2)',(L,B)=>mShell(L,B));addAtk('chistera',1,{f:'shellGame',every:15,delay:5,noAct:true});addAtk('chistera',2,{f:'shellGame',every:16,delay:7,noAct:true});
mechOn('trompo','Muelles en el suelo: cae sobre ellos para saltar alto',(L,B)=>mSprings(L,B,[240,560]));
/* bosses that throw bombs need no arena hook, the parry does the work */
for(const id of['tostada','ballena','espantapajaros','cuervo'])if(!MECH_INFO[id])MECH_INFO[id]='Bombas de vuelta: devuélvelas con parry';

/* the parry-back bomb */
const _drawSprM=drawSpr;
drawSpr=function(e,t){if(e.spr!=='bombav'){_drawSprM(e,t);return;}const r=e.r||22,on=!(e.cool>0);ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=C.ink;
  circ(0,0,r,on?C.parry:'#5a5a6a',3.5);ell(-r*.35,-r*.35,r*.28,r*.18,'rgba(255,255,255,.6)',0,-.6);rr(-6,-r-8,12,9,2,C.steel,2.5);ctx.beginPath();ctx.moveTo(0,-r-8);ctx.quadraticCurveTo(10,-r-18,6,-r-26);ctx.lineWidth=3;ctx.stroke();
  star(6,-r-28,8+Math.sin(t*30)*2,3,6,t*20);ctx.fillStyle='#ffe27a';ctx.fill();ctx.lineWidth=2;ctx.stroke();face(0,4,.36,{gap:18,ew:9,eh:12,my:22,mw:18,open:.5,look:{x:0,y:0},ang:-.3});ctx.restore();
  if(on){ctx.beginPath();ctx.arc(e.x,e.y,r+8+Math.sin(t*12)*2,0,TAU);ctx.lineWidth=2.5;ctx.strokeStyle='rgba(159,240,230,.85)';ctx.stroke();}};

/* ---------- every boss transforms between phases (a short, invulnerable tantrum) ---------- */
const _setPhaseM=setPhase;
setPhase=function(L,B,i,first){_setPhaseM(L,B,i,first);if(first)return;B.transT=.85;B.timers=B.timers.map(t=>t+.85);L.freeze=Math.max(L.freeze||0,.12);sfx('stomp');};
const _bossUpdM=bossUpdate;
bossUpdate=function(L,B,dt){if(B.transT>0){B.transT-=dt;B.t+=dt;B.flash=Math.floor(B.transT*20)%2?.05:0;B.shk=Math.sin(B.t*70)*6*Math.min(1,B.transT*3);B.squash=Math.sin(B.t*30)*.12;
    if(rand()<dt*24){const c=B.center();L.fx.push({k:'puff',x:c.x+(rand()-.5)*160,y:c.y+(rand()-.5)*160,vx:(rand()-.5)*200,vy:-60-rand()*120,life:.5,max:.5,r:10+rand()*10,col:rand()<.5?'#efe0bf':'#d8cdb6'});}
    if(rand()<dt*10){const c=B.center();L.fx.push({k:'spark',x:c.x+(rand()-.5)*120,y:c.y-80-rand()*60,vx:(rand()-.5)*300,vy:-200,life:.4,max:.4,r:5,col:C.gold});}
    if(B.transT<=0){B.shk=0;B.squash=.3;sfx('stomp');}arenaTick(L,B,dt);return;}
  _bossUpdM(L,B,dt);};
const _setupArenaM=setupArena;
setupArena=function(L,B,def,plane){_setupArenaM(L,B,def,plane);const d0=B.damage;B.damage=(d,p)=>{if(B.transT>0)return;d0(d,p);};};

/* the level card names the boss's mechanic */
const _drawLevelCardM=drawLevelCard;
drawLevelCard=function(c,t){_drawLevelCardM(c,t);const n=c;if(!n)return;const m=MECH_INFO[n.id];if(!m)return;const w=Math.min(620,m.length*8.4+120);
  ctx.save();card(W/2-w/2,H-96,w,32,'#2b1d14',3,8);btxt('MECÁNICA: '+m,W/2,H-80,14,C.gold,'center',800);ctx.restore();};
if(window.__game){Object.assign(window.__game,{MECH_INFO,ATK_:ATK,doParry_:(...a)=>doParry(...a),shellPick_:(...a)=>shellPick(...a)});}
