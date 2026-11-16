'use strict';
/* ================= DLC «LA ÚLTIMA FUNCIÓN» (Rollo n.º 10) · parte 1: balance, armas nuevas, animaciones, ambiente, sonidos ================= */

/* ---------- new sound effects (all synthesized) ---------- */
Object.assign(SFX,{
  ovacion(){nz(1.6,{f:1400,fs:900,q:.5,v:.09});for(let i=0;i<14;i++)nz(.05,{f:2500+rand()*1500,q:3,v:.05,at:.1+rand()*1.2});[523,659,784].forEach((f,i)=>tn(f,.3,{type:'triangle',v:.02,at:.1+i*.08}));},
  naipe(){if(lim('naipe',.06))return;nz(.06,{f:5000,type:'highpass',v:.07});tn(1800,.03,{type:'triangle',v:.02});},
  proyector(){if(lim('proyector',.09))return;tn(90,.02,{type:'square',v:.02});nz(.02,{f:3000,v:.03,q:4});},
  campanita(){[2637,3136].forEach((f,i)=>tn(f,.4,{type:'sine',v:.035,at:i*.07}));},
  latido(){tn(60,.15,{type:'sine',v:.18,slide:-20});tn(55,.15,{type:'sine',v:.14,slide:-20,at:.22});},
  reverso(){nz(.5,{f:300,fs:4000,q:1,v:.1});tn(200,.5,{type:'sawtooth',v:.03,slide:900,lp:2000});},
  rasgado(){nz(.6,{f:4000,fs:300,q:.8,v:.16});tn(400,.5,{type:'sawtooth',v:.04,slide:-350,lp:1500});},
  estreno(){[392,523,659,784,1047].forEach((f,i)=>tn(f,.35,{type:'sawtooth',v:.04,at:i*.09,lp:2600}));nz(.8,{f:5000,type:'highpass',v:.06,at:.45});},
  susurro(){nz(.8,{f:600,fs:1800,q:2,v:.05});}});

/* ---------- balance: the strongest weapons calm down, the weakest get a hand ---------- */
WEAPONS.bumeran.fire=function(L,p,h,ax,ay){p.cool=.26;B_(L,p,{x:h.x,y:h.y,vx:ax*780,vy:ay*780,r:12,dmg:.85,life:2.2,k:'bume',tickHit:true,boomer:{t:0},draw:drawBume});};
WEAPONS.bumeran.desc='Lo lanzas, atraviesa a los enemigos y vuelve a tu mano. Pega a la ida y a la vuelta. (Ajustado: pegaba demasiado.)';
WEAPONS.tachuelas.fire=function(L,p,h,ax,ay){p.cool=.17;B_(L,p,{x:h.x,y:h.y,vx:ax*950,vy:ay*950,r:6,dmg:2.1,life:1.1,k:'tack'});};
WEAPONS.luciernaga.fire=function(L,p,h,ax,ay){p.cool=.15;B_(L,p,{x:h.x,y:h.y,vx:ax*620,vy:ay*620,r:7,dmg:1,life:1.8,k:'luci',homing:5.5});};
WEAPONS.luciernaga.desc='Disparos que persiguen solos al enemigo más cercano. (Mejorada: ahora pegan más.)';
WEAPONS.burbujas.fire=function(L,p,h,ax,ay){p.cool=.16;B_(L,p,{x:h.x,y:h.y,vx:ax*320,vy:ay*320,r:12,dmg:1.7,life:2,k:'bubble',absorb:1,wob:rand()*6});};

/* ---------- three new weapons ---------- */
function dlcShot(b,col,col2,s=1){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.dy||b.vy||0,b.dx||b.vx||1));circ(0,0,(b.r+6)*s,col2,0);ell(0,0,(b.r+3)*s,b.r*.8*s,col,2.5);ell(-2*s,-2*s,b.r*.5*s,b.r*.3*s,'rgba(255,255,255,.75)',0);ctx.restore();}
Object.assign(WEAPONS,{
  convergente:{name:'Rayo Convergente',price:5,isl:2,desc:'Tres rayos salen en abanico y se juntan a media pantalla: de cerca pega como un cañón.',exd:'EX: tres rayos gordos que se cruzan y lo atraviesan todo.',
    fire(L,p,h,ax,ay){p.cool=.15;const a0=Math.atan2(ay,ax);for(const d of[-1,0,1])B_(L,p,{x:h.x,y:h.y,vx:0,vy:0,r:6,dmg:.6,life:1,k:'conv',a0,d,t:0,sp:900,
        upd(b,L,dt){b.t+=dt;const spread=.32*b.d*Math.max(-.6,1-b.t/.18),a=b.a0+spread;b.dx=Math.cos(a);b.dy=Math.sin(a);b.vx=b.dx*b.sp;b.vy=b.dy*b.sp;},draw:b=>dlcShot(b,'#9fe7ff','rgba(120,210,255,.3)')});},
    ex(L,p,h,ax,ay){const a0=Math.atan2(ay,ax);for(const d of[-1,0,1])B_(L,p,{x:h.x,y:h.y,vx:0,vy:0,r:16,dmg:4.2,life:1.4,k:'conv',pierce:true,a0,d,t:0,sp:760,big:true,
        upd(b,L,dt){b.t+=dt;const a=b.a0+.4*b.d*(1-b.t/.3);b.dx=Math.cos(a);b.dy=Math.sin(a);b.vx=b.dx*b.sp;b.vy=b.dy*b.sp;},draw:b=>dlcShot(b,'#9fe7ff','rgba(120,210,255,.35)',1.6)});}},
  espiral:{name:'Chispa Torcida',price:4,isl:1,desc:'Dos chispas giran una alrededor de la otra mientras avanzan: cubren más altura que un disparo recto.',exd:'EX: un remolino de chispas que avanza girando.',
    fire(L,p,h,ax,ay){p.cool=.11;for(const s of[-1,1])B_(L,p,{x:h.x,y:h.y,vx:0,vy:0,r:6,dmg:.62,life:1.15,k:'twist',ox:h.x,oy:h.y,ax,ay,s,t:0,sp:820,
        upd(b,L,dt){b.t+=dt;const d=b.t*b.sp,w=Math.sin(b.t*18)*24*b.s*Math.min(1,b.t*6),nx=-b.ay,ny=b.ax;const x=b.ox+b.ax*d+nx*w,y=b.oy+b.ay*d+ny*w;b.vx=(x-b.x)/Math.max(dt,1e-3);b.vy=(y-b.y)/Math.max(dt,1e-3);b.x=x;b.y=y;b.vx*=1e-6;b.vy*=1e-6;b.dx=b.ax;b.dy=b.ay;},
        draw:b=>dlcShot(b,b.s>0?'#ffb35a':'#ffe27a','rgba(255,190,90,.3)')});},
    ex(L,p,h,ax,ay){for(let i=0;i<6;i++)B_(L,p,{x:h.x,y:h.y,vx:0,vy:0,r:10,dmg:1.6,life:1.5,k:'twist',pierce:true,ox:h.x,oy:h.y,ax,ay,ph:i*TAU/6,t:0,sp:520,
        upd(b,L,dt){b.t+=dt;const d=b.t*b.sp,a=b.ph+b.t*9,nx=-b.ay,ny=b.ax;b.x=b.ox+b.ax*d+nx*Math.sin(a)*46;b.y=b.oy+b.ay*d+ny*Math.sin(a)*46+Math.cos(a)*14;b.vx=b.ax*1e-6;b.vy=b.ay*1e-6;b.dx=b.ax;b.dy=b.ay;},
        draw:b=>dlcShot(b,'#ffb35a','rgba(255,190,90,.35)',1.3)});}},
  partida:{name:'Bala Partida',price:5,isl:3,desc:'Una bala que, al rato de salir, suelta una astilla que persigue sola al enemigo.',exd:'EX: una bala gorda que estalla en seis astillas perseguidoras.',
    fire(L,p,h,ax,ay){p.cool=.21;B_(L,p,{x:h.x,y:h.y,vx:ax*880,vy:ay*880,r:8,dmg:1.15,life:1.1,k:'part',t:0,
        upd(b,L,dt){b.t+=dt;if(b.t>.24&&!b.split){b.split=1;sfx('naipe');B_(L,b.own,{x:b.x,y:b.y,vx:b.vy*.4,vy:-b.vx*.4,r:5,dmg:.75,life:1.4,k:'luci',homing:7});}},draw:b=>dlcShot(b,'#e8b4ff','rgba(200,140,255,.3)')});},
    ex(L,p,h,ax,ay){B_(L,p,{x:h.x,y:h.y,vx:ax*700,vy:ay*700,r:16,dmg:5,life:1.2,k:'part',big:true,t:0,
        upd(b,L,dt){b.t+=dt;if(b.t>.3&&!b.split){b.split=1;b.life=0;boom(L,b.x,b.y,40);for(let i=0;i<6;i++){const a=i*TAU/6;B_(L,b.own,{x:b.x,y:b.y,vx:Math.cos(a)*420,vy:Math.sin(a)*420,r:9,dmg:2.2,life:1.8,k:'luci',big:true,homing:7});}}},draw:b=>dlcShot(b,'#e8b4ff','rgba(200,140,255,.35)',1.6)});}}});
const _itemIconDLC=itemIcon;
itemIcon=function(id,x,y,t){const f={
  convergente(){for(const d of[-1,0,1]){ctx.beginPath();ctx.moveTo(-18,d*14);ctx.quadraticCurveTo(0,d*10,18,0);ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=2.5;ctx.strokeStyle='#9fe7ff';ctx.stroke();}circ(18,0,5,'#fff',2);},
  espiral(){ctx.beginPath();for(let i=0;i<=40;i++){const k=i/40,x=-20+k*40,y=Math.sin(k*TAU*2+t*4)*10;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.lineWidth=4;ctx.strokeStyle='#ffb35a';ctx.stroke();circ(20,Math.sin(TAU*2+t*4)*10,5,'#ffe27a',2);},
  partida(){circ(-6,0,9,'#e8b4ff',2.5);ctx.beginPath();ctx.moveTo(4,-2);ctx.quadraticCurveTo(14,-14,20,-6);ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();circ(20,-6,4,'#d7f27a',2);}}[id];
  if(!f){_itemIconDLC(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;f();ctx.restore();};

/* ---------- animations: bosses make an entrance ---------- */
const _setupArenaDLC=setupArena;
setupArena=function(L,B,def,plane){_setupArenaDLC(L,B,def,plane);if(def.noEntrance)return;const dw=L.drawWorld;L.entr={plane:!!plane,done:false};
  L.drawWorld=()=>{let k=clamp((L.t-.15)/.85,0,1);if(k>=1||L.state!=='intro'&&L.t>1.2){if(!L.entr.done){L.entr.done=true;if(!plane){shake(L,14);sfx('stomp');const c=B.center();for(let i=0;i<10;i++)L.fx.push({k:'puff',x:c.x+(rand()-.5)*220,y:GROUND-6,vx:(rand()-.5)*420,vy:-40-rand()*120,life:.6,max:.6,r:10+rand()*10,col:C.paper});}else sfx('dash');}dw&&dw();return;}
    ctx.save();if(plane){const e=1-Math.pow(1-k,3);ctx.translate((1-e)*620,0);}else{const b=k<1/2.75?7.5625*k*k:k<2/2.75?7.5625*(k-=1.5/2.75)*k+.75:k<2.5/2.75?7.5625*(k-=2.25/2.75)*k+.9375:7.5625*(k-=2.625/2.75)*k+.984375;ctx.translate(0,-(1-b)*560);}dw&&dw();ctx.restore();};};

/* ---------- desperation: below 15% life every boss gets frantic ---------- */
const _bossUpdDLC=bossUpdate;
bossUpdate=function(L,B,dt){_bossUpdDLC(L,B,dt);const ph=B.def.phases;
  if(B.dead){if(!B.koFx){B.koFx=true;sfx('ovacion');const c=B.center();for(let i=0;i<46;i++)L.fx.push({k:'spark',x:c.x+(rand()-.5)*80,y:c.y-40,vx:(rand()-.5)*900,vy:-300-rand()*600,life:1.4,max:1.4,r:4+rand()*4,col:['#e8562e','#f2c14e','#2ec4b6','#8a63c7','#fff6df'][i%5]});}return;}
  if(!B.desp&&B.phase===ph.length-1&&B.hp<B.max*.15&&L.state==='play'&&!B.def.noDesp){B.desp=true;banner(L,'¡A LA DESESPERADA!',1.2);sfx('latido');if(typeof Pack!=='undefined'&&Pack.audio)try{Pack.audio.playbackRate=1.07;}catch(_){}}
  if(B.desp&&!(B.transT>0)){{const k=({1:.1,2:.17}[B.def.isl]||.24);for(let i=0;i<B.timers.length;i++)B.timers[i]-=dt*k;}B.despT=(B.despT||0)-dt;if(B.despT<=0){B.despT=.22;const c=B.center();L.fx.push({k:'puff',x:c.x+(rand()-.5)*120,y:c.y-60-rand()*60,vx:(rand()-.5)*120,vy:-120,life:.5,max:.5,r:6+rand()*6,col:rand()<.5?'#bfe7ff':'#efe0bf'});}
    B.hbT=(B.hbT||0)-dt;if(B.hbT<=0){B.hbT=1.1;sfx('latido');}}};
const _startLevelDLC=startLevel;
startLevel=function(id){try{if(typeof Pack!=='undefined'&&Pack.audio)Pack.audio.playbackRate=1;}catch(_){}_startLevelDLC(id);};
/* red pulse at the edges while a boss is desperate */
const _drawFGHookDLC=filmLayer;
filmLayer=function(t){if(scene==='level'&&LV&&LV.boss&&LV.boss.desp&&!LV.boss.dead&&LV.state==='play'){const a=.18+Math.sin(t*7.5)*.08;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);const g=ctx.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.9);g.addColorStop(0,'rgba(180,30,20,0)');g.addColorStop(1,`rgba(180,30,20,${a})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();}_drawFGHookDLC(t);};

/* ---------- hero animations: dust when running and landing ---------- */
const _platUpdDLC=platUpdate;
platUpdate=function(L,p,dt,I){const air=!p.ground,vy=p.vy;_platUpdDLC(L,p,dt,I);if(p.dead)return;
  if(p.ground&&air&&vy>420){for(const s of[-1,1])for(let i=0;i<3;i++)L.fx.push({k:'puff',x:p.x+s*(8+i*6),y:p.y-3,vx:s*(80+i*60),vy:-30-rand()*40,life:.35,max:.35,r:5+i*1.5,col:C.paper});if(vy>900)sfx('land');}
  if(p.ground&&Math.abs(p.vx)>120){p.dustT=(p.dustT||0)-dt;if(p.dustT<=0){p.dustT=.15;L.fx.push({k:'puff',x:p.x-Math.sign(p.vx)*12,y:p.y-4,vx:-Math.sign(p.vx)*50,vy:-30,life:.32,max:.32,r:4+rand()*3,col:'rgba(239,224,191,.9)'});}}};

/* ---------- ambience: motes, bubbles, embers or glitter float in every boss arena ---------- */
const AMBM={1:{n:26,col:'255,226,160',vy:-8,vx:6,r:[1.5,3],tw:true},2:{n:22,col:'200,240,255',vy:-30,vx:0,r:[2,5],ring:true},3:{n:24,col:'255,170,90',vy:-24,vx:10,r:[1.2,2.6],tw:true},4:{n:18,col:'230,245,255',vy:-6,vx:-4,r:[1,2.2],tw:true}};
const _setupArenaAMB=setupArena;
setupArena=function(L,B,def,plane){_setupArenaAMB(L,B,def,plane);const A=def.casino?{n:20,col:'255,215,110',vy:-10,vx:4,r:[1.2,2.4],tw:true}:AMBM[def.isl]||AMBM[1];if(def.noAmb)return;
  const ps=[];for(let i=0;i<A.n;i++)ps.push({x:rand()*W,y:rand()*H,r:A.r[0]+rand()*(A.r[1]-A.r[0]),ph:rand()*TAU,s:.5+rand()});
  const f=L.drawFG;L.drawFG=()=>{f&&f();const lv=typeof PERF!=='undefined'?PERF.level:0;if(lv>=2)return;const n=lv?Math.floor(ps.length/2):ps.length,t=L.t;ctx.save();
    for(let i=0;i<n;i++){const q=ps[i];const x=((q.x+t*A.vx*q.s+Math.sin(t*.7+q.ph)*14)%W+W)%W,y=((q.y+t*A.vy*q.s)%H+H)%H,a=A.tw?.25+.25*Math.sin(t*2.4+q.ph):.35;
      if(A.ring){ctx.globalAlpha=a;ctx.beginPath();ctx.arc(x,y,q.r,0,TAU);ctx.lineWidth=1.2;ctx.strokeStyle=`rgb(${A.col})`;ctx.stroke();}else{ctx.globalAlpha=a;ctx.fillStyle=`rgb(${A.col})`;ctx.beginPath();ctx.arc(x,y,q.r,0,TAU);ctx.fill();}}ctx.restore();};};

/* ---------- reworks: six early bosses learn a new final pattern ---------- */
for(const [id,f,extra] of[['gramo','ring',{n:10,spd:210}],['tostada','spiral',{dur:1.3,rate:.1,spd:220,arms:2}],['cascanueces','ring',{n:9,spd:220}],['cangrejo','spiral',{dur:1.2,rate:.1,spd:210,arms:3}],['paraguas','ring',{n:12,spd:190}],['reloj','spiral',{dur:1.4,rate:.09,spd:230,arms:2}]]){
  const d=LEVELS[id];if(!d||!d.phases)continue;const last=d.phases[d.phases.length-1],src=d.phases.flatMap(ph=>ph.atk||[]).find(a=>a.spr);if(!src)continue;
  last.atk.push(Object.assign({f,every:4.6,delay:2.5,from:'center',spr:src.spr,r:Math.min(14,src.r||12),parry:5},extra));}
if(typeof refreshShopTabs==='function')refreshShopTabs();
if(window.__game)Object.assign(window.__game,{WEAPONS,CHARMS,SUPERS});
