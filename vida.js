/* vida.js — BIG UPDATE: the boss stages are not empty any more.
   Like the imps in the devil's fight, every boss now has its own little helpers and its own stage trouble:
   - HELPERS: little themed creatures (sugar cubes and coffee beans for the coffee pot, crabs for the lighthouse,
     ghosts for the Blackout King…) that run at you (jump over them or shoot them), hop toward you, or
     hover over your head and dive. In the planes they fly in from the right in little waves.
     3-4 shots kill one. They show up more often in later phases; Fácil gets fewer.
   - STAGE TROUBLE (from phase 2): things fall from the ceiling with a shadow first, a big thing rolls
     across the floor (jump it), or the floor erupts (steam, fire, geysers…), depending on the boss.
   Everything runs in the simulation with the game's own rand(), so online play stays in sync. */
(function(){
const SKIP=new Set(['rascacielos','sombra','topo','canica','bolos','diana','caja','globo','tombola']);
/* id: [runner shape, flyer shape, wing, color, color2, trouble, style] */
const T={
  reloj:['engrane','bola','ave','#d8b34a','#7a3a1a','caida','needle'],
  gramo:['nota','nota','ave','#2b2420','#f2c14e','geiser','needle'],
  tostada:['cubo','llama','insecto','#e8b46a','#8a4a1a','geiser','fire'],
  cascanueces:['bola','bola','insecto','#c0302a','#f2c14e','rodante'],
  trompo:['bola','bola','insecto','#3a8ad8','#f2c14e','rodante'],
  cafetera:['cubo','gota','insecto','#fbf6ea','#6a3a1a','geiser','steam'],
  faro:['bicho','bola','ave','#e8562e','#fbf6ea','caida'],
  cangrejo:['bicho','burbuja','insecto','#e8562e','#7ad8d0','rodante'],
  paraguas:['gota','gota','ave','#5aa8e8','#2f5a8a','caida'],
  caldera:['engrane','llama','insecto','#8a8a96','#e8562e','geiser','steam'],
  pulpo:['bicho','burbuja','insecto','#b06ad8','#7ad8d0','geiser','geyser'],
  buzo:['bicho','burbuja','insecto','#f2c14e','#2f7aa0','geiser','geyser'],
  colmena:['bicho','bola','insecto','#f2c14e','#2b2420','caida'],
  vela:['llama','llama','murci','#f2c14e','#e8562e','caida'],
  buho:['cubo','bola','murci','#8a5a2a','#efe0bf','caida'],
  espantapajaros:['grano','bola','ave','#c89a3a','#2b2420','rodante'],
  maquina:['cubo','cubo','insecto','#efe0bf','#2b2420','caida'],
  chistera:['bola','bola','ave','#fbf6ea','#c0302a','caida'],
  apagon:['fantasma','bola','murci','#3a3550','#ffd36a','geiser','darkbolt'],
  cuervo:['gota','bola','ave','#7fd05a','#2b2420','geiser','heat'],
  radio:['nota','nota','insecto','#c08aff','#2b2420','caida'],
  proyec:['cubo','bola','murci','#2b2a33','#fbf6ea','caida'],
  linterna:['fantasma','bola','insecto','#f2f6ff','#c08aff','caida'],
  dragonfar:['llama','llama','murci','#e8562e','#f2c14e','geiser','fire'],
  tempano:['copo','copo','ave','#e8f4ff','#5aa8e8','rodante'],
  cometa:['llama','llama','ave','#ffd36a','#e8562e','caida'],
  volcana:['llama','llama','insecto','#e8562e','#3a2a20','geiser','fire'],
  termometro:['gota','copo','insecto','#e84a3a','#e8f4ff','geiser','heat'],
  polilla:['bicho','bola','insecto','#c8b08a','#5a3f2a','caida'],
  hollin:['fantasma','bola','murci','#2b2420','#e8562e','geiser','steam'],
  heladero:['copo','gota','ave','#ffc8e0','#7ad8d0','caida'],
  tornillo:['engrane','engrane','insecto','#a8a8b4','#e8562e','rodante'],
  abeto:['galleta','bola','ave','#c87a3a','#fbf6ea','caida'],
  jengibre:['galleta','llama','insecto','#c87a3a','#fbf6ea','geiser','fire'],
  /* planes: flyer shape, wing, colors */
  baron:[null,'bola','ave','#fbf6ea','#5aa8e8'],globoaero:[null,'bola','ave','#e8562e','#f2c14e'],libelula:[null,'bicho','insecto','#7fd05a','#2b2420'],
  ballena:[null,'gota','insecto','#5aa8e8','#2b2420'],pezvolador:[null,'gota','insecto','#e8562e','#f2c14e'],murcielago:[null,'bola','murci','#3a3550','#ffd36a'],
  escoba:[null,'fantasma','murci','#f2f6ff','#c08aff'],gargola:[null,'bola','murci','#8a8a96','#2b2420'],pinguino:[null,'copo','ave','#e8f4ff','#2b2420'],
  aurora:[null,'copo','ave','#bfe9ff','#c08aff'],trineo:[null,'galleta','ave','#c87a3a','#fbf6ea']};
window.VIDA_THEME=T;
const fspr=d=>{for(const ph of d.phases||[])for(const a of ph.atk||[])if(a.spr)return a.spr;return'ball';};

/* ---------------- spawning (simulation) ---------------- */
function spawnHelper(L,B,th,last){const plane=B.def.kind==='plane';const p=nearestP(L,W/2,H/2);if(!p)return;
  const isl=B.def.isl||1,sp=1+(isl-1)*.06;
  if(plane){const n=last?3:2,y0=80+rand()*(H-220);for(let i=0;i<n;i++)mkEnt(L,{tag:'vida',vai:'air',vs:th[1],wing:th[2],col:th[3],col2:th[4],hp:3,r:17,x:W+40+i*60,y:y0,by:y0,spd:(150+rand()*40)*sp,ph0:i*.8,face:-1});sfx('pop');return;}
  const roll=rand(),kind=roll<.5?'run':roll<.78?'hop':'fly';
  if(kind==='fly'){const x=rand()<.5?-40:W+40;mkEnt(L,{tag:'vida',vai:'fly',vs:th[1],wing:th[2],col:th[3],col2:th[4],hp:3,r:17,x,y:70,st:0,spd:260*sp,face:x<0?1:-1});}
  else{const side=p.x<W/2?1:-1,x=side>0?W+30:-30;/* come from the side the player is NOT on, so it never spawns on top of you */
    mkEnt(L,{tag:'vida',vai:kind,vs:kind==='hop'&&th[0]==='cubo'?'grano':th[0],col:kind==='hop'&&th[0]==='cubo'?'#6a3a1a':th[3],col2:th[4],hp:kind==='hop'?3:4,r:20,x,y:GROUND-20,vx:0,vy:0,
      spd:(kind==='run'?175:200)*sp,face:-side,turns:0,wait:.25,hops:0});}
  sfx('pop');}
function trouble(L,B,th,d){B.vK=(B.vK||0)+1;const alt=th[5]==='caida'?(th[6]?'geiser':'rodante'):'caida',kind=B.vK%2?th[5]:alt,p=nearestP(L,W/2,H/2)||{x:W/2};
  if(kind==='caida'){const n=3+B.phase,spr=fspr(d);for(let i=0;i<n;i++){const x=clamp(p.x+(i-(n-1)/2)*130+(rand()-.5)*40,40,W-40),delay=.95+i*.18;
      L.vWarn.push({x,t:delay,max:delay});spawnEB(L,{k:'shot',x,y:-60,vx:0,vy:0,r:15,spr,life:delay+3,
        upd:e=>{if(e.t<delay){e.y=-60;e.vy=0;}else if(!e.f){e.f=1;e.vy=560;}}});}sfx('warn');}
  else if(kind==='rodante'){const side=p.x<W/2?1:-1,x=side>0?W+40:-40;L.vWarn.push({x:side>0?W-30:30,t:1,max:1,edge:true});
    B.queue.push({t:1,fn:()=>{spawnEB(L,{k:'roll',x,y:GROUND-30,vx:-side*360,r:30,spr:fspr(d),hop:0,vy:0,life:6});sfx('knock');}});sfx('warn');}
  else if(kind==='geiser'){try{ATK.column(L,B,{n:2+(B.phase>1?1:0),gap:.55,style:th[6]||'geyser',warn:.95,w:60,spread:170});}catch(e){}}}

const _bu=bossUpdate;bossUpdate=function(L,B,dt){_bu(L,B,dt);const d=B.def,th=T[d.id];
  if(!th||SKIP.has(d.id)||d.parryOnly||B.dead||L.state!=='play'||/^tutorial/.test(L.id))return;
  if(!L.vWarn)L.vWarn=[];for(const w of L.vWarn)w.t-=dt;L.vWarn=L.vWarn.filter(w=>w.t>-.2);
  const n=d.phases.length,last=B.phase>=n-1,easy=cfg.diff==='facil'?1.45:1;
  if(B.vSp===undefined){B.vSp=4.5;B.vTr=7;}
  B.vSp-=dt;if(B.vSp<=0){const alive=L.ents.filter(e=>!e.dead&&e.tag==='vida').length,cap=(d.kind==='plane'?3:2)+(last?1:0);
    B.vSp=Math.max(4.6,8.4-B.phase*1.3)*easy*(.85+rand()*.3);if((d.kind==='plane'?alive===0:alive<cap)&&!B.hidden)spawnHelper(L,B,th,last);}
  if(th[5]&&B.phase>=1){B.vTr-=dt;if(B.vTr<=0){B.vTr=Math.max(7.5,11.5-B.phase*1.6)*easy*(.85+rand()*.3);trouble(L,B,th,d);}}};

/* ---------------- helper brains (simulation) ---------------- */
const _ue=updEnemies;updEnemies=function(L,dt){_ue(L,dt);
  for(const e of L.ents){if(e.dead||!e.vai)continue;const p=nearestP(L,e.x,e.y);if(!p)continue;
    switch(e.vai){
      case 'run':{const want=p.x<e.x?-1:1;if(want!==e.face&&e.turns<1&&Math.abs(p.x-e.x)>120){e.face=want;e.turns++;}e.x+=e.face*e.spd*dt;e.y=GROUND-e.r+(Math.abs(Math.sin(e.t*14))*-4);
        if(e.t>1&&(e.x<-60||e.x>W+60))e.dead=true;break;}
      case 'hop':{e.vy+=1700*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;if(e.y>=GROUND-e.r){e.y=GROUND-e.r;e.vy=0;e.vx=0;e.wait-=dt;
          if(e.wait<=0){e.hops++;e.wait=.55+rand()*.3;if(e.hops>5){e.face=e.x<W/2?-1:1;}else e.face=p.x<e.x?-1:1;e.vy=-560-rand()*120;e.vx=e.face*e.spd;}}
        if(e.t>1&&(e.x<-60||e.x>W+60))e.dead=true;break;}
      case 'fly':{if(e.st===0){const tx=clamp(p.x,60,W-60);e.x=lerp(e.x,tx,Math.min(1,dt*2.4));e.y=lerp(e.y,95,Math.min(1,dt*3));e.face=tx<e.x?-1:1;if(e.t>1.6){e.st=1;e.vy=0;e.tx=e.x;sfx('warn');}}
        else if(e.st===1){e.vy+=1500*dt;e.y+=e.vy*dt;if(e.y>=GROUND-e.r){e.y=GROUND-e.r;e.st=2;e.st2=0;shake(L,4);puff(L,e.x,GROUND-4,5);}}
        else{e.st2+=dt;if(e.st2>.45){e.y-=300*dt;e.x+=e.face*180*dt;if(e.y<-60)e.dead=true;}}break;}
      case 'air':{e.x-=e.spd*dt;e.y=e.by+Math.sin(e.t*2.6+e.ph0)*60;e.y+=(p.y-e.by)*Math.min(1,e.t*.25)*dt*1.2;e.by+=(p.y-e.by)*dt*.25;if(e.x<-60)e.dead=true;break;}}}};

/* ---------------- drawing ---------------- */
function eyes(x,y,s,angry,t){for(const k of[-1,1]){ell(x+k*6*s,y,4.2*s,5.2*s,'#fff',1.8);circ(x+k*6*s+1.2*s,y+1,2*s,C.ink,0);}
  if(angry){ctx.lineWidth=2.2;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(x-11*s,y-7*s);ctx.lineTo(x-2*s,y-4*s);ctx.moveTo(x+11*s,y-7*s);ctx.lineTo(x+2*s,y-4*s);ctx.stroke();}}
function mouth(x,y,s){ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.arc(x,y,4*s,.15,Math.PI-.15);ctx.stroke();}
function body(sh,r,c1,c2,t){switch(sh){
  case'cubo':rr(-r,-r,r*2,r*2,5,c1,3);for(let i=0;i<3;i++)circ(-r*.5+i*r*.5,r*.6,1.6,'rgba(20,13,8,.25)',0);break;
  case'grano':ell(0,0,r*.85,r,c1,3);ctx.lineWidth=2.5;ctx.strokeStyle=c2==='#fbf6ea'?'#3a2010':'#3a2010';ctx.beginPath();ctx.moveTo(0,-r*.8);ctx.quadraticCurveTo(-r*.35,0,0,r*.8);ctx.stroke();break;
  case'gota':ctx.beginPath();ctx.moveTo(0,-r*1.3);ctx.quadraticCurveTo(r,-r*.1,r*.85,r*.3);ctx.arc(0,r*.3,r*.85,0,Math.PI);ctx.quadraticCurveTo(-r,-r*.1,0,-r*1.3);ctx.fillStyle=c1;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();break;
  case'bicho':ctx.lineWidth=3;ctx.strokeStyle=C.ink;for(let i=-1;i<=1;i++)for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*r*.6,r*.3+i*5);ctx.lineTo(s*(r+8),r*.6+i*6+Math.sin(t*20+i)*3);ctx.stroke();}ell(0,0,r,r*.8,c1,3);ell(0,-r*.2,r*.6,r*.35,c2,0);break;
  case'fantasma':ctx.beginPath();ctx.arc(0,-r*.2,r,Math.PI,0);for(let i=0;i<=4;i++)ctx.lineTo(r-i*r/2,r*.9+(i%2?-6:0)+Math.sin(t*8+i)*2);ctx.closePath();ctx.fillStyle=c1;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();break;
  case'llama':ctx.beginPath();ctx.moveTo(0,-r*1.5-Math.sin(t*12)*4);ctx.quadraticCurveTo(r*1.1,-r*.2,r*.8,r*.4);ctx.arc(0,r*.4,r*.8,0,Math.PI);ctx.quadraticCurveTo(-r*1.1,-r*.2,0,-r*1.5-Math.sin(t*12)*4);ctx.fillStyle=c1;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ell(0,r*.35,r*.45,r*.4,c2,0);break;
  case'copo':circ(0,0,r,c1,3);circ(-r*.35,-r*.4,r*.25,'rgba(255,255,255,.7)',0);break;
  case'engrane':ctx.save();ctx.rotate(t*3);for(let i=0;i<8;i++){ctx.rotate(TAU/8);rr(-4,-r-5,8,10,2,c1,2.5);}ctx.restore();circ(0,0,r,c1,3);circ(0,r*.55,3,c2,0);break;
  case'galleta':ctx.beginPath();ctx.arc(0,-r*.55,r*.6,0,TAU);ctx.moveTo(-r*.45,-r*.1);ctx.lineTo(-r*1.1,r*.05);ctx.lineTo(-r*.5,r*.35);ctx.lineTo(-r*.6,r*1.05);ctx.lineTo(r*.6,r*1.05);ctx.lineTo(r*.5,r*.35);ctx.lineTo(r*1.1,r*.05);ctx.lineTo(r*.45,-r*.1);ctx.fillStyle=c1;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.lineWidth=2.5;ctx.strokeStyle=c2;ctx.beginPath();ctx.moveTo(-r*.4,r*.6);ctx.lineTo(r*.4,r*.6);ctx.stroke();break;
  case'nota':ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(r*.55,0);ctx.lineTo(r*.55,-r*1.5);ctx.quadraticCurveTo(r*1.2,-r*1.1,r*1.1,-r*.6);ctx.stroke();ell(0,0,r*.8,r*.6,c1,3,-.35);break;
  case'burbuja':circ(0,0,r,'rgba(190,240,255,.55)',2.5);ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.beginPath();ctx.arc(0,0,r*.65,-2.4,-1.4);ctx.stroke();break;
  default:circ(0,0,r,c1,3);ell(0,r*.45,r*.55,r*.3,c2,0);}}
function wings(type,r,t,c){const f=Math.sin(t*(type==='insecto'?40:16));ctx.save();
  for(const s of[-1,1]){ctx.save();ctx.scale(s,1);ctx.rotate(-.3-f*.45);
    if(type==='murci')poly([[r*.4,-r*.2],[r*1.9,-r*.9],[r*1.5,-r*.1],[r*2,r*.3],[r*.6,r*.3]],'#2b2433',2.5);
    else if(type==='insecto')ell(r*1.1,-r*.4,r*.9,r*.45,'rgba(230,250,255,.75)',2);
    else ell(r*1.1,-r*.3,r*.95,r*.42,c,2.5);ctx.restore();}ctx.restore();}
function drawV(e,t){const r=e.r,tt=e.t+t*0;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';
  if(e.vai==='run'||e.vai==='hop')ell(0,GROUND-e.y,r*.9,5,'rgba(20,13,8,.22)',0);
  if(e.vai==='fly'&&e.st===0){const gy=GROUND-e.y;ell(0,gy,r*1.1,6,'rgba(20,13,8,.3)',0);}
  ctx.scale(e.face<0?-1:1,1);
  if(e.vai==='run'){const k=Math.sin(e.t*16);line(-6,r*.6,-6-k*6,r+2,3.5);line(6,r*.6,6+k*6,r+2,3.5);ctx.rotate(Math.sin(e.t*16)*.06);}
  if(e.vai==='hop'){const s=e.vy<0?1.12:e.y>=GROUND-e.r-.5?.86:1;ctx.scale(1/s,s);}
  if(e.vai==='fly'||e.vai==='air')wings(e.wing||'ave',r,e.t,e.col2);
  if(e.vai==='fly'&&e.st===1)ctx.rotate(.4);
  body(e.vs,r,e.col,e.col2,e.t);
  const fy=e.vs==='galleta'?-r*.6:e.vs==='llama'||e.vs==='gota'?r*.1:e.vs==='nota'?-r*.05:-r*.15,fs=e.vs==='galleta'?.75:.85;
  if(e.vs!=='nota')eyes(0,fy,fs,true,e.t);else eyes(0,0,.6,true,e.t);if(e.vs!=='nota')mouth(0,fy+8,.8);
  if(e.vs==='bola'&&e.vai==='run'){poly([[-r*.6,-r*.75],[-r*.3,-r*1.35],[-r*.1,-r*.85]],'#c0302a',2);poly([[r*.6,-r*.75],[r*.3,-r*1.35],[r*.1,-r*.85]],'#c0302a',2);}
  if(e.flash>0){ctx.globalCompositeOperation='source-atop';ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(-r*3,-r*3,r*6,r*6);}
  ctx.restore();}
const _de=drawEnemy;drawEnemy=function(e,t){if(e&&e.vai){if(!Number.isFinite(e.x)||!Number.isFinite(e.y))return;drawV(e,t);return;}_de(e,t);};

/* warnings: shadows on the floor for falling things, a big "!" on the edge for rolling things (drawing only) */
const _dl=drawLevel;drawLevel=function(L){_dl.apply(this,arguments);if(!L||!L.vWarn||!L.vWarn.length||L.state!=='play')return;
  ctx.save();if(typeof DPR!=='undefined')ctx.setTransform(DPR,0,0,DPR,0,0);
  for(const w of L.vWarn){if(w.t<0)continue;const k=1-w.t/w.max;
    if(w.edge){const a=.5+.5*Math.sin(L.t*20);ctx.globalAlpha=a;circ(w.x,GROUND-60,22,'#f2c14e',3);btxt('!',w.x,GROUND-60,30,C.ink,'center',900);ctx.globalAlpha=1;}
    else{ell(w.x,GROUND-2,14+k*20,4+k*5,`rgba(20,13,8,${.2+k*.35})`,0);ctx.globalAlpha=.6+.4*Math.sin(L.t*24);line(w.x,GROUND-24-k*10,w.x,GROUND-14,3,'#e8562e');ctx.globalAlpha=1;}}
  ctx.restore();};
})();
