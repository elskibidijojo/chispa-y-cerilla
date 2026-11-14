'use strict';
/* ================= FIRMAS: every island-4 boss gets attacks that only it does =================
   Témpano: icicles that grow and shatter, a snowball that grows as it rolls.
   Cometa: meteors that leave burning craters, moons that orbit her and fly off.
   Pingüino (plane): fish leaping from the sea, an ice sled crossing at your height.
   Volcana: a wave of lava geysers with one safe gap, a rock that splits in four.
   Polilla: a bait lamp that bursts into moths, a curtain of drifting dust.
   Hollín: chimneys that puff in turn, a soot cloud that follows you. */
const SPRF={
  icicle(e,t,P,r){const k=e.grow!=null?Math.min(1,e.grow):1,h=r*3*k;poly([[-r*.7,-h*.2],[r*.7,-h*.2],[0,h]],P('#cfeeff'),2.5);poly([[-r*.25,-h*.15],[r*.05,-h*.15],[-r*.1,h*.6]],'rgba(255,255,255,.7)',0);},
  shard(e,t,P,r){ctx.rotate(e.t*14);poly([[-r,0],[0,-r*.6],[r,0],[0,r*.6]],P('#cfeeff'),2);},
  nieve(e,t,P,r){ctx.rotate(e.x/r);circ(0,0,r,P('#f4fbff'),3);for(let i=0;i<5;i++){const a=i*1.3;circ(Math.cos(a)*r*.55,Math.sin(a)*r*.55,r*.12,'#cfe3ee',0);}},
  meteoro(e,t,P,r){const a=Math.atan2(e.vy,e.vx);ctx.rotate(a);for(let i=1;i<5;i++){ctx.globalAlpha=.5-i*.1;circ(-i*r*.7,0,r*(1-i*.15),i<2?'#ffb84a':'#e8562e',0);}ctx.globalAlpha=1;circ(0,0,r,P('#7a4a3a'),3);circ(-r*.3,-r*.2,r*.25,'#5a3428',0);circ(r*.25,r*.25,r*.18,'#5a3428',0);},
  luna(e,t,P,r){circ(0,0,r,P('#f3ead2'),2.5);circ(-r*.3,-r*.2,r*.22,'rgba(0,0,0,.12)',0);circ(r*.3,r*.3,r*.15,'rgba(0,0,0,.12)',0);},
  pez(e,t,P,r){const a=Math.atan2(e.vy,e.vx);ctx.rotate(a);ell(0,0,r*1.2,r*.65,P('#6fb7d6'),2.5);poly([[-r*1.1,0],[-r*1.8,-r*.6],[-r*1.8,r*.6]],P('#4a90b0'),2.5);circ(r*.6,-r*.15,r*.16,C.ink,0);ell(0,-r*.55,r*.4,r*.18,P('#4a90b0'),2);},
  trineo(e,t,P,r){const d=e.vx<0?-1:1;ctx.scale(d,1);rr(-r*1.6,-r*.5,r*3.2,r*.9,6,P('#b5402f'),3);line(-r*1.7,r*.6,r*1.4,r*.6,4,'#3a3440');ctx.beginPath();ctx.arc(r*1.4,r*.2,r*.4,-Math.PI/2,Math.PI/2);ctx.lineWidth=4;ctx.strokeStyle='#3a3440';ctx.stroke();
    rr(-r*1.4,-r*1.1,r*1.4,r*.65,4,'#cfeeff',2.5);for(let i=0;i<3;i++){ctx.globalAlpha=.4;circ(-r*2-i*14,r*.5,5+i*2,'#f4fbff',0);}ctx.globalAlpha=1;},
  roca(e,t,P,r){ctx.rotate(e.t*5);poly([[-r,-r*.3],[-r*.4,-r],[r*.5,-r*.8],[r,0],[r*.4,r],[-r*.6,r*.8]],P('#5a3a34'),3);line(-r*.4,-r*.2,r*.2,r*.4,2,'#ff8a3a');line(r*.1,-r*.5,r*.5,0,2,'#ff8a3a');},
  lampara(e,t,P,r){const on=Math.floor(e.t*(e.t>.9?16:5))%2;line(0,-r*3,0,-r*1.2,2,'#3a3440');rr(-r*.5,-r*1.3,r,r*.4,2,'#a8772a',2);ell(0,0,r*.8,r,on?'#fff3b0':'#ffd36a',3);ctx.globalAlpha=.25;circ(0,0,r*2.4,'#fff3b0',0);ctx.globalAlpha=1;},
  polillita(e,t,P,r){const f=Math.sin(e.t*30);ell(0,0,r*.5,r*.9,P('#8a7a6a'),2);for(const s of[-1,1])ell(s*r*.8,-r*.1,r*.8,r*(.5+.25*f),P('#c9b48a'),2,s*.4);},
  hollinNube(e,t,P,r){for(let i=0;i<7;i++){const a=i*TAU/7+t*.6;circ(Math.cos(a)*r*.55,Math.sin(a)*r*.4,r*.55,'#1a1418',0);}circ(0,0,r*.7,'#241c22',0);ell(-r*.25,-r*.1,r*.12,r*.16,'#ff8a3a',0);ell(r*.25,-r*.1,r*.12,r*.16,'#ff8a3a',0);}};
const _drawSprF=drawSpr;
drawSpr=function(e,t){const f=SPRF[e.spr];if(!f){_drawSprF(e,t);return;}const pc=e.parry&&!(e.cool>0),r=e.r||12,P=c=>pc?C.parry:c;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;f(e,t,P,r);ctx.restore();};

/* Témpano */
ATK.carambanos=function(L,B,a){const n=a.n||4,p=tgt(L,B);for(let i=0;i<n;i++){const x=clamp(p.x+(i-(n-1)/2)*130+(rand()-.5)*40,40,W-40);B.pc++;
    spawnEB(L,{k:'shot',x,y:10,vx:0,vy:0,r:12,spr:'icicle',grow:0,parry:!!a.parry&&B.pc%a.parry===0,harmless:true,
      upd(e,L,dt){e.vx=0;e.vy=0;if(e.grow<1.15){e.grow+=dt/(.8+i*.12);if(e.grow>=1.15){e.harmless=false;e.fv=0;sfx('crack');}return;}e.fv+=1700*dt;e.y+=e.fv*dt;
        if(e.y>GROUND-24){e.dead=true;puff(L,e.x,GROUND,4,'#cfeeff');sfx('glass');for(const d of[-1,0,1])spawnEB(L,{k:'grav',x:e.x,y:GROUND-14,vx:d*220,vy:-260-Math.abs(d)*-80,g:1400,r:7,spr:'shard'});}}});}sfx('crack');};
ATK.bolaNieve=function(L,B,a){const t=tgt(L,B),o=anc(B,a.from),d=t.x<o.x?-1:1;B.pc++;spawnEB(L,{k:'shot',x:o.x,y:GROUND-14,vx:0,vy:0,r:14,spr:'nieve',dir:d,parry:!!a.parry&&B.pc%a.parry===0,
  upd(e,L,dt){e.vx=0;e.vy=0;e.r=Math.min(44,e.r+dt*18);e.x+=e.dir*(260+e.r*2)*dt;e.y=GROUND-e.r;if(e.r>30&&!e.hopT){e.hopT=1;}if(rand()<.3)puff(L,e.x-e.dir*e.r,GROUND-4,1,'#f4fbff');if(e.x<-80||e.x>W+80)e.dead=true;}});sfx('knock');};
/* Cometa */
ATK.meteoros=function(L,B,a){const n=a.n||4;for(let i=0;i<n;i++)B.queue.push({t:i*.35,fn:()=>{const tx=60+rand()*(W-120),sx=tx+260,an=Math.atan2(GROUND+20,tx-sx);
    spawnEB(L,{k:'shot',x:sx,y:-30,vx:Math.cos(an)*430,vy:Math.sin(an)*430,r:15,spr:'meteoro',upd(e,L,dt){if(e.y>GROUND-12){e.dead=true;boom(L,e.x,GROUND,34);shake(L,5);sfx('boom');spawnPuddle(L,e.x);}}});}});sfx('dash');};
ATK.orbitas=function(L,B,a){const n=a.n||3;B.orbN=(B.orbN||0)+1;for(let i=0;i<n;i++){B.pc++;spawnEB(L,{k:'shot',x:B.center().x,y:B.center().y,vx:0,vy:0,r:13,spr:'luna',ang:i*TAU/n,rad:20,parry:!!a.parry&&B.pc%a.parry===0,
    upd(e,L,dt){if(e.free)return;e.vx=0;e.vy=0;const c=B.center();e.rad=Math.min(130,e.rad+dt*160);e.ang+=dt*3.2;e.x=c.x+Math.cos(e.ang)*e.rad;e.y=c.y+Math.sin(e.ang)*e.rad;
      if(e.t>1.7){e.free=true;const p=aimPt(nearestP(L,e.x,e.y)||{x:W/2,y:GROUND}),an=Math.atan2(p.y-e.y,p.x-e.x);e.vx=Math.cos(an)*360;e.vy=Math.sin(an)*360;sfx('throw');}}});}sfx('magic');};
/* Pingüino (plane) */
ATK.peces=function(L,B,a){const n=a.n||3;for(let i=0;i<n;i++)B.queue.push({t:i*.4,fn:()=>{const x=120+rand()*(W-300),d=rand()<.5?-1:1;B.pc++;
    spawnEB(L,{k:'grav',x,y:H+20,vx:d*(80+rand()*80),vy:-(640+rand()*140),g:700,r:13,spr:'pez',parry:!!a.parry&&B.pc%a.parry===0});sfx('splash');}});};
ATK.trineo=function(L,B,a){const p=tgt(L,B),y=clamp(p.y,60,H-60),d=rand()<.5?-1:1;
  spawnEB(L,{k:'shot',x:d<0?W+80:-80,y,vx:0,vy:0,r:22,spr:'trineo',wt:.75,dir:d,upd(e,L,dt){e.vy=0;if(e.wt>0){e.wt-=dt;e.vx=0;return;}e.vx=-e.dir*560;}});
  pop(L,d<0?W-70:70,y,'¡TRINEO!',C.rust);sfx('warn');};
/* Volcana */
ATK.erupcion=function(L,B,a){const n=7,gap=Math.floor(rand()*n),d=rand()<.5?1:-1;for(let i=0;i<n;i++){if(i===gap)continue;const k=d>0?i:n-1-i;
    B.queue.push({t:i*.16,fn:()=>{spawnEB(L,{k:'column',x:70+k*137,warn:.75,act:.4,w:70,style:'fire'});}});}sfx('warn');};
ATK.rocaPartida=function(L,B,a){const o=anc(B,a.from),t=aimPt(tgt(L,B)),T=1.1;B.pc++;spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:0,vy:0,r:18,spr:'roca',gx:(t.x-o.x)/T,gy:-700,parry:!!a.parry&&B.pc%a.parry===0,
  upd(e,L,dt){e.vx=0;e.vy=0;e.gy+=1500*dt;e.x+=e.gx*dt;e.y+=e.gy*dt;if(e.y>GROUND-e.r&&e.gy>0){e.dead=true;boom(L,e.x,GROUND-10,30);sfx('stomp');for(const d of[-1.4,-.6,.6,1.4])spawnEB(L,{k:'grav',x:e.x,y:GROUND-20,vx:d*190,vy:-520,g:1500,r:9,spr:'roca'});}}});B.throwT=.35;sfx('throw');};
/* Polilla */
ATK.lamparaCebo=function(L,B,a){const x=140+rand()*(W-280),y=90+rand()*120;spawnEB(L,{k:'shot',x,y,vx:0,vy:0,r:16,spr:'lampara',harmless:true,
  upd(e,L,dt){e.vx=0;e.vy=0;if(e.t>1.3){e.dead=true;boom(L,e.x,e.y,30);sfx('glass');for(let i=0;i<8;i++){const an=i*TAU/8;B.pc++;spawnEB(L,{k:'shot',x:e.x,y:e.y,vx:Math.cos(an)*200,vy:Math.sin(an)*200,r:10,spr:'polillita',turn:.9,life:3.2,parry:!!a.parry&&B.pc%a.parry===0});}}}});sfx('ding');};
ATK.polvo=function(L,B,a){const n=a.n||9,off=rand()*80;for(let i=0;i<n;i++){spawnEB(L,{k:'shot',x:off+i*(W/n),y:-20-(i%2)*50,vx:0,vy:a.spd||120,r:8,spr:'polillita',sway:160,fall:true});}sfx('dash');};
/* Hollín */
ATK.chimeneas=function(L,B,a){const xs=[150,390,630,870].sort(()=>rand()-.5);xs.slice(0,a.n||3).forEach((x,i)=>B.queue.push({t:i*.55,fn:()=>{spawnEB(L,{k:'column',x,warn:.7,act:.45,w:66,style:'steam'});}}));};
ATK.nubeHollin=function(L,B,a){if(L.eb.some(e=>e.spr==='hollinNube'))return;const o=anc(B,a.from);spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:0,vy:0,r:46,spr:'hollinNube',life:a.dur||6,
  upd(e,L,dt){const p=nearestP(L,e.x,e.y);if(!p){e.vx=e.vy=0;return;}const c=aimPt(p),an=Math.atan2(c.y-e.y,c.x-e.x),sp=95;e.vx=lerp(e.vx,Math.cos(an)*sp,Math.min(1,dt*2));e.vy=lerp(e.vy,Math.sin(an)*sp,Math.min(1,dt*2));
    if(e.life<.5)e.r*=.97;}});sfx('steam');};

/* hand them to the bosses */
const FIRMAS={tempano:[[1,{f:'carambanos',every:5.2,delay:2,n:4,parry:4}],[0,{f:'bolaNieve',every:6.5,delay:3,from:'center',parry:2}]],
  cometa:[[0,{f:'meteoros',every:6,delay:2.5,n:4}],[1,{f:'orbitas',every:6.2,delay:2,n:3,parry:3}]],
  pinguino:[[0,{f:'peces',every:5.5,delay:2,n:3,parry:3}],[1,{f:'trineo',every:6,delay:3}]],
  volcana:[[1,{f:'erupcion',every:7,delay:2.5}],[0,{f:'rocaPartida',every:5.4,delay:2.2,from:'center',parry:2}]],
  polilla:[[0,{f:'lamparaCebo',every:6.5,delay:2.5,parry:4}],[1,{f:'polvo',every:5.8,delay:1.5,n:9}]],
  hollin:[[0,{f:'chimeneas',every:6.2,delay:2.5,n:3}],[1,{f:'nubeHollin',every:9,delay:3,from:'center',dur:6}]]};
for(const id in FIRMAS){const d=LEVELS[id];if(!d||!d.phases)continue;for(const [ph,atk] of FIRMAS[id]){const P=d.phases[Math.min(ph,d.phases.length-1)];if(P&&P.atk&&!P.atk.some(x=>x.f===atk.f))P.atk.push(atk);}}
for(const [id,s] of[['tempano','Carámbanos que crecen y una bola de nieve que engorda'],['cometa','Meteoritos que dejan cráteres y lunas en órbita'],['pinguino','Peces que saltan del mar y trineos a tu altura'],
  ['volcana','Una ola de géiseres con un hueco seguro'],['polilla','Lámparas cebo que estallan en polillas'],['hollin','Chimeneas en fila y una nube de hollín que te persigue']])if(typeof MECH_INFO!=='undefined'&&!MECH_INFO[id])MECH_INFO[id]=s;
