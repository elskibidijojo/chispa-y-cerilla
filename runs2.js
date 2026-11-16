'use strict';
/* ================= CORRE Y DISPARA 2: mini-bosses halfway through the levels =================
   Like in old cartoons' run-and-gun levels: the screen stops, a big troublemaker rolls in, and you have to beat it to go on.
   No boss bar, no title card — it is part of the level. Six of them:
   Don Trabuco (a boiler with a blunderbuss), Don Chorizo (a string of sausages), the wind-up Zeppelin,
   Doña Tetera (a hermit crab in a teapot), the Great Bouncing Mushroom and the Lamplighter ghost.
   Also two new stretches: a chain of pink things to parry-hop over a pit, and a stretch of falling cannon shells. */

/* ---------- new stretches ---------- */
CHUNKS.miniArena={w:1100,f(B){B.ground(0,1100);}};
CHUNKS.parryChain={w:900,f(B,c){B.ground(0,170);B.pstar(280,330);B.pstar(420,280);B.pstar(560,300);B.pstar(690,250);B.ground(780,900);if(c)B.coin(560,200);}};
CHUNKS.bombRain={w:900,f(B,c){B.ground(0,900);B.walker(600);if(c){B.plat(380,320,130);B.coin(445,280);}}};
const MINI_AT={feria:[[7,'trabuco']],fabrica:[[6,'zepelin']],trenes:[[5,'chorizo']],muelle:[[5,'tetera'],[12,'chorizo']],setas:[[6,'seta']],nubes:[[6,'zepelin']],
  arrecife:[[5,'tetera']],feria_noche:[[5,'trabuco'],[12,'chorizo']],torre:[[7,'farolero']],mina:[[6,'trabuco']],cementerio:[[6,'farolero']],
  teleferico:[[6,'chorizo']],fundicion:[[6,'trabuco']],bosque:[[6,'farolero'],[11,'seta']]};
const RUN_EXTRA={feria:[[4,'parryChain',1]],muelle:[[9,'bombRain',0]],setas:[[9,'parryChain',0]],nubes:[[4,'parryChain',0]],feria_noche:[[8,'bombRain',1]],torre:[[10,'parryChain',1]],
  mina:[[9,'bombRain',0]],fabrica:[[10,'bombRain',1]],trenes:[[8,'bombRain',0]],arrecife:[[8,'parryChain',1]],cementerio:[[9,'parryChain',0]],fundicion:[[9,'bombRain',1]],bosque:[[8,'parryChain',1]],teleferico:[[9,'parryChain',0]]};
for(const id in LEVELS){const d=LEVELS[id];if(d.kind!=='run'||!d.chunks||d.minis)continue;
  const add=[...(RUN_EXTRA[id]||[]).map(([i,n,c])=>[i,[n,c]]),...(MINI_AT[id]||[]).map(([i,k])=>[i,['miniArena',0,k]])].sort((a,b)=>b[0]-a[0]);
  for(const [i,ch] of add)d.chunks.splice(Math.min(i,d.chunks.length-1),0,ch);d.minis=true;}

/* the builder gets "bombs" (shells that keep falling across a stretch) */
{const _br=buildRun;buildRun=function(def){const L=_br(def);let x=0;L.gates=[];L.bombZ=[];
  for(const c of def.chunks){const C0=CHUNKS[c[0]];if(c[0]==='miniArena')L.gates.push({x0:x+20,k:c[2],st:'wait'});if(c[0]==='bombRain')L.bombZ.push({a:x+120,b:x+780,t:1});x+=C0.w;}
  const up=L.update;L.update=dt=>{const g=L.gates.find(g=>g.st==='fight');up(dt);
    for(const z of L.bombZ){if(L.camX+W<z.a||L.camX>z.b)continue;z.t-=dt;if(z.t<=0){z.t=.75+rand()*.5;const bx=clamp(L.camX+120+rand()*(W-240),z.a,z.b);spawnEB(L,{k:'shot',x:bx,y:-30,vx:0,vy:0,r:14,spr:'bombaR',fall:0,parry:rand()<.2,
        upd(e,L,dt){e.vx=0;e.fall+=1200*dt;e.vy=0;e.y+=e.fall*dt;const fl=L.floorAt(e.x);if(e.y>fl-12){e.dead=true;boom(L,e.x,fl-10,40);shake(L,4);sfx('boom');spawnEB(L,{k:'wave',x:e.x-20,y:fl,vx:-260,w:30,h:26});spawnEB(L,{k:'wave',x:e.x+20,y:fl,vx:260,w:30,h:26});}}});}}
    /* mini-boss gates */
    const al=alive(L);for(const gg of L.gates){if(gg.st==='wait'&&al.some(p=>p.x>gg.x0+W*.42)){gg.st='fight';miniStart(L,gg);}}
    if(g){L.camX=Math.min(L.camX,g.x0);L.maxX=g.x0+W-40;if(g.e&&g.e.dead&&!g.end){g.end=L.t;}if(g.end&&L.t-g.end>1.4){g.st='done';L.maxX=L.len-30;pop(L,g.x0+W/2,140,'¡ADELANTE!',C.gold);sfx('bell');}}};
  return L;};}
function miniStart(L,g){const M=MINI[g.k],np=Math.max(1,L.Ps.length),hp=M.hp*(1+.45*(np-1));sfx('warn');shake(L,8);
  const e=mkEnt(L,{ai:'mini',mini:g.k,hp,max:hp,r:M.r||60,x:g.x0+W+160,y:GROUND-(M.h||80),face:-1,st:'enter',st_t:0,ax:g.x0,gate:g,n:0});g.e=e;
  e.hitBy=(x,y,r)=>!e.dead&&M.shapes(e).some(s=>s.w?circRect(x,y,r,s.x,s.y,s.w,s.h):Math.hypot(x-s.x,y-s.y)<s.r+r);
  e.contact=pb=>!e.dead&&M.shapes(e).some(s=>s.w?rectHit(pb,s):circRect(s.x,s.y,s.r*.85,pb.x,pb.y,pb.w,pb.h));
  const d0=e.damage;e.damage=(d,p)=>{if(e.dead)return;if(e.shell){if(rand()<.3){sparks(L,e.x,e.y-20,2,C.steel);sfx('knock');}return;}e.hp-=d;e.flash=.06;if(rand()<.25)sfx('hit');
    if(e.hp<=0){e.dead=true;miniBoom(L,e);}};
  if(M.init)M.init(e,L);return e;}
function miniBoom(L,e){shake(L,18);sfx('boom');sfx('victory');for(let i=0;i<7;i++){const a=i*TAU/7;boom(L,e.x+Math.cos(a)*50,e.y-30+Math.sin(a)*40,40+i*4);}stars(L,e.x,e.y-40);for(let i=0;i<3;i++)puff(L,e.x+(i-1)*40,GROUND,6);
  pop(L,e.x,e.y-140,pick(['¡KAPUT!','¡FUERA DE AQUÍ!','¡A LA CHATARRA!','¡NOCAUT!']),C.gold);}
/* update hook for mini-bosses */
const _updEnemiesMB=updEnemies;
updEnemies=function(L,dt){_updEnemiesMB(L,dt);for(const e of L.ents){if(e.dead||e.ai!=='mini')continue;const M=MINI[e.mini],p=nearestP(L,e.x,e.y);e.st_t+=dt;
    if(e.st==='enter'){const tx=e.ax+W-(M.home||220);e.x=lerp(e.x,tx,Math.min(1,dt*2.2));if(Math.abs(e.x-tx)<6||e.st_t>2.2){e.st='fight';e.st_t=0;e.cool=.8;}if(M.enterUpd)M.enterUpd(e,L,dt);continue;}
    if(p)M.upd(e,L,dt,p);e.x=clamp(e.x,e.ax+60,e.ax+W-60);}};
const _drawEnemyMB=drawEnemy;
drawEnemy=function(e,t){if(e.ai!=='mini'){_drawEnemyMB(e,t);return;}ctx.save();ctx.lineJoin='round';ctx.lineCap='round';MINI[e.mini].draw(e,t);ctx.restore();};
/* sprites for the minis' bullets */
const SPRM={bombaR(e,t,P,r){circ(0,0,r,P('#2b2a33'),3);rr(-r*.3,-r*1.25,r*.6,r*.4,2,'#5a5a66',2);const s=Math.floor(t*14)%2;circ(r*.2,-r*1.45,r*.28,s?'#ffd27a':'#e8562e',0);ell(-r*.35,-r*.35,r*.25,r*.15,'rgba(255,255,255,.35)',0);},
  perdigon(e,t,P,r){circ(0,0,r,P('#3a3440'),2.5);circ(-r*.3,-r*.3,r*.3,'rgba(255,255,255,.35)',0);},
  mostaza(e,t,P,r){ctx.beginPath();ctx.moveTo(0,-r*1.3);ctx.quadraticCurveTo(r,0,0,r);ctx.quadraticCurveTo(-r,0,0,-r*1.3);ctx.fillStyle=P('#f2c14e');ctx.fill();ctx.lineWidth=2.5;ctx.stroke();},
  avion(e,t,P,r){ctx.rotate(Math.atan2(e.vy,e.vx));poly([[r*1.3,0],[-r,-r*.8],[-r*.5,0],[-r,r*.8]],P('#fbf6ea'),2.5);line(-r*.5,0,r*1.3,0,1.5,'rgba(20,13,8,.4)');},
  te(e,t,P,r){circ(0,0,r,P('#a8693a'),2.5);ell(-r*.3,-r*.3,r*.3,r*.2,'rgba(255,255,255,.5)',0);},
  espora(e,t,P,r){ctx.rotate(t*3);for(let i=0;i<5;i++){const a=i*TAU/5;circ(Math.cos(a)*r*.5,Math.sin(a)*r*.5,r*.42,P('#d8c8e8'),1.5);}circ(0,0,r*.4,P('#b89ad8'),1.5);},
  llamita(e,t,P,r){const f=Math.sin(t*20+e.x)*.15;ctx.beginPath();ctx.moveTo(-r*.8,r*.5);ctx.quadraticCurveTo(-r,-r*.6,r*f,-r*1.6);ctx.quadraticCurveTo(r,-r*.6,r*.8,r*.5);ctx.closePath();ctx.fillStyle=P('#7ad8ff');ctx.fill();ctx.lineWidth=2;ctx.stroke();circ(0,0,r*.4,'#e8fbff',0);}};
const _drawSprMB=drawSpr;
drawSpr=function(e,t){const f=SPRM[e.spr];if(!f){_drawSprMB(e,t);return;}const pc=e.parry&&!(e.cool>0),r=e.r||12,P=c=>pc?C.parry:c;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;f(e,t,P,r);ctx.restore();};

/* ---------- the six mini-bosses ---------- */
const MINI={};
const flashC=(e,c)=>e.flash>0?'#fff':c;
function eyes2(x,y,s,look,angry){for(const d of[-1,1]){ell(x+d*12*s,y,8*s,10*s,'#fff',2.5);circ(x+d*12*s+look*3*s,y+2*s,4*s,C.ink,0);if(angry)line(x+d*4*s,y-13*s,x+d*19*s,y-8*s,3,C.ink);}}
MINI.trabuco={name:'Don Trabuco',hp:120,r:70,h:80,home:230,
  shapes:e=>[{x:e.x,y:e.y-10,r:62}],
  upd(e,L,dt,p){e.face=p.x<e.x?-1:1;e.aim=Math.atan2(aimPt(p).y-(e.y-20),aimPt(p).x-e.x);e.recoil=Math.max(0,(e.recoil||0)-dt*3);e.cool-=dt;
    if(e.hopT>0){e.hopT-=dt;e.vy+=2200*dt;e.y+=e.vy*dt;e.x+=e.vx*dt;if(e.y>=GROUND-80){e.y=GROUND-80;e.hopT=0;shake(L,10);sfx('stomp');puff(L,e.x,GROUND,8);for(const d of[-1,1])spawnEB(L,{k:'wave',x:e.x+d*40,y:GROUND,vx:d*380,w:40,h:38});}return;}
    if(e.warnT>0){e.warnT-=dt;if(e.warnT<=0){e.n++;const pk=Math.floor(rand()*5);for(let i=0;i<5;i++){const a=e.aim+(i-2)*.13,sp=420+rand()*60;spawnEB(L,{k:'shot',x:e.x+Math.cos(e.aim)*90,y:e.y-20+Math.sin(e.aim)*90,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:9,spr:'perdigon',parry:i===pk});}
      boom(L,e.x+Math.cos(e.aim)*95,e.y-20+Math.sin(e.aim)*95,34);sfx('boom');shake(L,7);e.recoil=1;e.x-=e.face*50;}return;}
    if(e.cool<=0){if(e.n%3===2){e.n++;e.hopT=2;e.vy=-980;e.vx=(clamp(p.x,e.ax+150,e.ax+W-150)-e.x)/.9;sfx('throw');e.cool=1.6;}else{e.warnT=.65;e.cool=1.9;sfx('warn');}}},
  draw(e,t){const x=e.x,y=e.y,f=e.face,rc=(e.recoil||0)*10;shadowE(x,GROUND+3,80,.3);
    for(const d of[-1,1]){ctx.save();ctx.translate(x+d*44,GROUND-30);ctx.rotate(t*2*(e.hopT>0?0:1));circ(0,0,30,flashC(e,'#7a3a2e'),4);for(let i=0;i<6;i++){const a=i*TAU/6;line(0,0,Math.cos(a)*26,Math.sin(a)*26,3,'#3a2018');}circ(0,0,8,'#d9a441',2.5);ctx.restore();}
    rr(x-62,y-70,124,104,30,flashC(e,'#6a6a78'),4.5);for(let i=0;i<4;i++)circ(x-50+i*33,y+22,3,'#3a3440',0);rr(x-20,y-110,40,44,6,'#3a3440',4);ell(x,y-110,24,8,'#2b2420',3);
    if(Math.floor(t*4)%2===0){ctx.globalAlpha=.6;circ(x+Math.sin(t*3)*8,y-128-(t*40%30),12,'#d8d0c8',0);ctx.globalAlpha=1;}
    circ(x,y-26,24,'#efe6cf',3.5);const nd=Math.sin(t*9)*.6+(e.warnT>0?1.5:0);line(x,y-26,x+Math.cos(-Math.PI/2+nd)*18,y-26+Math.sin(-Math.PI/2+nd)*18,3,'#b5402f');
    eyes2(x,y-56,1,f,e.warnT>0);rr(x-30,y-6,60,10,5,'#3a3440',2);
    /* the blunderbuss */ctx.save();ctx.translate(x,y-20);ctx.rotate(e.aim??Math.PI);ctx.translate(-rc,0);rr(10,-13,70,26,6,'#5a3428',3.5);ctx.beginPath();ctx.moveTo(78,-14);ctx.lineTo(106,-26);ctx.lineTo(106,26);ctx.lineTo(78,14);ctx.closePath();ctx.fillStyle='#b9a07a';ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();
    if(e.warnT>0&&Math.floor(t*20)%2===0){star(112,0,12,5,6,t*10);ctx.fillStyle='#fff3b0';ctx.fill();}ctx.restore();}};
MINI.chorizo={name:'Don Chorizo',hp:100,r:34,h:40,home:260,
  init(e){e.trail=[];for(let i=0;i<40;i++)e.trail.push([e.x,e.y]);e.segs=5;e.vy=0;e.vx=0;e.gr=true;},
  shapes:e=>{const s=[{x:e.x,y:e.y,r:34}];for(let i=1;i<=e.segs;i++){const q=e.trail[Math.min(e.trail.length-1,i*6)];if(q)s.push({x:q[0],y:q[1],r:26,seg:true});}return s;},
  enterUpd(e){e.trail.unshift([e.x,e.y]);e.trail.length=40;},
  upd(e,L,dt,p){e.trail.unshift([e.x,e.y]);e.trail.length=40;e.cool-=dt;
    if(!e.gr){e.vy+=1900*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;if(e.y>=GROUND-34){e.y=GROUND-34;e.gr=true;e.vy=0;sfx('stomp');puff(L,e.x,GROUND,5);
        const n=3,pk=Math.floor(rand()*n);for(let i=0;i<n;i++)spawnEB(L,{k:'grav',x:e.x,y:e.y-30,vx:(i-1)*170+(p.x-e.x)*.3,vy:-640-rand()*120,g:1400,r:10,spr:'mostaza',parry:i===pk});}return;}
    if(e.cool<=0){e.cool=1.15+rand()*.4;const tx=clamp(p.x+(rand()-.5)*200,e.ax+80,e.ax+W-80);e.gr=false;e.vy=-820-rand()*120;e.vx=(tx-e.x)/.9;e.face=tx<e.x?-1:1;sfx('throw');}
    const lose=e.hp<e.max*(e.segs-2)/5;if(lose&&e.segs>2){e.segs--;const q=e.trail[e.segs*6+6]||[e.x,e.y];mkEnt(L,{ai:'hopper',skin:'salchichita',hp:3,r:16,x:q[0],y:Math.min(q[1],GROUND-16),wait:.4,vy:0});puff(L,q[0],q[1],6);sfx('pop');}},
  draw(e,t){shadowE(e.x,GROUND+3,50,.25);for(let i=e.segs;i>=1;i--){const q=e.trail[Math.min(e.trail.length-1,i*6)];if(!q)continue;ctx.save();ctx.translate(q[0],q[1]);ell(0,0,30,22,flashC(e,'#b5523a'),3.5);ell(-8,-8,10,5,'rgba(255,255,255,.3)',0);line(-24,0,-30,0,3,C.ink);ctx.restore();}
    const x=e.x,y=e.y,f=e.face;ell(x,y,36,28,flashC(e,'#c0563a'),4);ell(x-10,y-12,12,6,'rgba(255,255,255,.3)',0);eyes2(x+f*6,y-6,.85,f,!e.gr);
    ctx.beginPath();ctx.arc(x+f*6,y+8,9,.1*Math.PI,.9*Math.PI);ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
    rr(x-22,y-48,44,18,6,'#fbf6ea',3);ell(x,y-50,26,14,'#fbf6ea',3);ell(x-10,y-58,12,10,'#fbf6ea',2.5);ell(x+10,y-58,12,10,'#fbf6ea',2.5);}};
ENC.salchichita=function(e,t,F){const b=Math.abs(Math.sin(t*10))*3;ctx.translate(0,-b);ell(0,0,20,14,F('#c0563a'),3);circ(-6,-3,3,C.ink,0);circ(6,-3,3,C.ink,0);ell(-6,-6,6,3,'rgba(255,255,255,.3)',0);};
MINI.zepelin={name:'Zepelín de Cuerda',hp:110,r:60,h:330,home:300,
  init(e){e.y=150;e.base=150;},shapes:e=>[{x:e.x,y:e.y,r:64}],
  upd(e,L,dt,p){e.y=e.base+Math.sin(e.st_t*1.6)*30;e.x+=Math.sin(e.st_t*.7)*120*dt;e.face=p.x<e.x?-1:1;e.cool-=dt;e.pc=e.pc||0;
    if(e.cool<=0){e.n++;if(e.n%3===0){for(let i=0;i<3;i++){e.pc++;spawnEB(L,{k:'shot',x:e.x-40,y:e.y+20,vx:-150+i*150,vy:-120,r:12,spr:'avion',turn:1.2,life:4,parry:e.pc%3===0});}sfx('throw');e.cool=2.2;}
      else{const bx=e.x;spawnEB(L,{k:'grav',x:bx,y:e.y+50,vx:(p.x-bx)*.35,vy:0,g:900,r:14,spr:'bombaR',parry:rand()<.25,upd(b,L,dt){if(b.y>GROUND-14){b.dead=true;boom(L,b.x,GROUND-10,40);sfx('boom');for(const d of[-1,1])spawnEB(L,{k:'wave',x:b.x+d*20,y:GROUND,vx:d*300,w:32,h:28});}}});sfx('knock');e.cool=1.3;}}},
  draw(e,t){const x=e.x,y=e.y,f=e.face;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*1.6)*.05);ell(0,0,95,48,flashC(e,'#d8b06a'),4.5);for(let i=-2;i<=2;i++){ctx.beginPath();ctx.ellipse(0,0,Math.abs(i)*22+6,46,0,0,TAU);ctx.lineWidth=2;ctx.strokeStyle='rgba(20,13,8,.25)';ctx.stroke();}
    poly([[90,-6],[122,-34],[122,26]],'#c0563a',3.5);rr(-34,40,68,24,6,'#7a3a2e',3.5);for(let i=0;i<3;i++)circ(-20+i*20,52,5,'#ffd987',2);
    ctx.save();ctx.translate(-104,0);ctx.rotate(t*24);for(let i=0;i<3;i++){ctx.rotate(TAU/3);ell(0,-14,6,14,'#a8adb8',2.5);}ctx.restore();
    ctx.save();ctx.translate(20,-50);ctx.rotate(t*5);rr(-4,-22,8,22,3,'#d9a441',2.5);rr(-16,-26,32,8,4,'#d9a441',2.5);ctx.restore();
    eyes2(-40*-f*0-30,-6,1.1,-1,false);ctx.beginPath();ctx.arc(-30,14,12,.1*Math.PI,.9*Math.PI);ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}};
MINI.tetera={name:'Doña Tetera',hp:110,r:56,h:60,home:240,
  shapes:e=>[{x:e.x,y:e.y-10,r:58}],
  upd(e,L,dt,p){e.cool-=dt;if(e.chg){e.x+=e.chg*620*dt;if((e.chg<0&&e.x<=e.ax+90)||(e.chg>0&&e.x>=e.ax+W-90)){e.chg=0;shake(L,9);sfx('stomp');e.shellT=1.2;}return;}
    if(e.shellT>0){e.shellT-=dt;e.shell=true;if(e.shellT<=0)e.shell=false;return;}e.face=p.x<e.x?-1:1;
    if(e.cool<=0){e.n++;const m=e.n%3;if(m===0){e.shell=true;e.chg=e.face;e.cool=2;sfx('dash');}
      else if(m===1){for(let i=0;i<3;i++){const a=Math.atan2(aimPt(p).y-(e.y-50),aimPt(p).x-(e.x+e.face*60))+(i-1)*.18;spawnEB(L,{k:'shot',x:e.x+e.face*60,y:e.y-50,vx:Math.cos(a)*330,vy:Math.sin(a)*330,r:10,spr:'te',parry:i===1});}sfx('splash');e.cool=1.6;}
      else{spawnEB(L,{k:'column',x:e.x+e.face*120,warn:.6,act:.45,w:70,style:'steam'});spawnEB(L,{k:'column',x:e.x+e.face*230,warn:.85,act:.45,w:70,style:'steam'});e.cool=1.8;}}},
  draw(e,t){const x=e.x,y=e.y,f=e.face,sh=e.shell;shadowE(x,GROUND+3,70,.3);
    if(!sh)for(let i=0;i<3;i++){const lx=x+(i-1)*26,k=Math.sin(t*14+i)*6;line(lx,y+20,lx+k,GROUND,5,'#c0563a');}
    ctx.save();ctx.translate(x,y-10);if(e.chg)ctx.rotate(t*14*e.chg);ell(0,0,60,48,flashC(e,'#f3ead2'),4.5);for(let i=0;i<3;i++)ell(0,-10+i*14,50-i*6,5,'rgba(90,120,180,.35)',0);
    if(!e.chg){ctx.beginPath();ctx.moveTo(f*50,-6);ctx.quadraticCurveTo(f*84,-14,f*92,-40);ctx.lineWidth=12;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=8;ctx.strokeStyle='#f3ead2';ctx.stroke();ctx.beginPath();ctx.arc(-f*60,0,16,-1.2,1.2);ctx.lineWidth=7;ctx.strokeStyle=C.ink;ctx.stroke();}
    ell(0,-48,22,8,'#d9a441',3);circ(0,-58,7,'#d9a441',2.5);ctx.restore();
    if(!sh&&!e.chg){ctx.save();ctx.translate(x+f*20,y-62);for(const d of[-1,1]){line(d*8,0,d*12,-22,3,C.ink);circ(d*12,-24,7,'#fff',2.5);circ(d*12+f*2,-24,3,C.ink,0);}ctx.restore();for(const d of[-1,1]){ctx.save();ctx.translate(x+f*40+d*14,y+4);ctx.rotate(Math.sin(t*6+d)*.4);ell(0,0,14,9,'#c0563a',3);ctx.restore();}}
    if(sh&&!e.chg){btxt('¡CLINC!',x,y-90,14,C.ink,'center',900);}}};
MINI.seta={name:'Gran Seta',hp:120,r:66,h:90,home:240,
  shapes:e=>[{x:e.x,y:e.y-50,r:70},{x:e.x-34,y:e.y-30,w:68,h:90}],
  upd(e,L,dt,p){e.cool-=dt;e.face=p.x<e.x?-1:1;if(e.jmp){e.vy+=2000*dt;e.y+=e.vy*dt;e.x+=e.vx*dt;e.sq=Math.max(-.2,(e.sq||0)-dt);if(e.y>=GROUND-90){e.y=GROUND-90;e.jmp=0;e.sq=.35;shake(L,12);sfx('stomp');for(const d of[-1,1])spawnEB(L,{k:'wave',x:e.x+d*50,y:GROUND,vx:d*420,w:44,h:44});}return;}
    e.sq=Math.max(0,(e.sq||0)-dt*1.5);
    if(e.cool<=0){e.n++;if(e.n%2===1){e.jmp=1;e.vy=-950;e.vx=(clamp(p.x,e.ax+150,e.ax+W-150)-e.x)/.95;sfx('throw');e.cool=2.1;}
      else{const n=8,pk=Math.floor(rand()*n);for(let i=0;i<n;i++){const a=-Math.PI+i*Math.PI/(n-1);spawnEB(L,{k:'shot',x:e.x,y:e.y-80,vx:Math.cos(a)*170,vy:Math.sin(a)*170-30,r:11,spr:'espora',wob:40,parry:i===pk,life:4.5});}sfx('pop');e.cool=1.7;
        if(rand()<.5)mkEnt(L,{ai:'hopper',skin:'setita',hp:2,r:16,x:e.x-e.face*60,y:GROUND-16,wait:.5,vy:0});}}},
  draw(e,t){const x=e.x,y=e.y,s=e.sq||0;shadowE(x,GROUND+3,80,.3);ctx.save();ctx.translate(x,y+60);ctx.scale(1+s*.4,1-s*.35);ctx.translate(-x,-y-60);
    rr(x-34,y-30,68,90,24,flashC(e,'#f3ead2'),4);eyes2(x+e.face*4,y+4,1,e.face,!!e.jmp);ctx.beginPath();ctx.moveTo(x-22,y+30);ctx.quadraticCurveTo(x,y+20,x+22,y+30);ctx.lineWidth=7;ctx.strokeStyle='#5a3428';ctx.stroke();
    ctx.beginPath();ctx.moveTo(x-96,y-20);ctx.quadraticCurveTo(x-90,y-110,x,y-112);ctx.quadraticCurveTo(x+90,y-110,x+96,y-20);ctx.closePath();ctx.fillStyle=flashC(e,'#c0392b');ctx.fill();ctx.lineWidth=4.5;ctx.strokeStyle=C.ink;ctx.stroke();
    for(const [dx,dy,r] of[[-50,-60,14],[10,-90,12],[50,-50,16],[-10,-45,9]])circ(x+dx,y+dy,r,'#fbf6ea',2.5);ctx.restore();}};
ENC.setita=function(e,t,F){ell(0,4,10,10,F('#f3ead2'),2.5);ctx.beginPath();ctx.arc(0,-2,16,Math.PI,0);ctx.closePath();ctx.fillStyle=F('#c0392b');ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();circ(-6,-8,3,'#fbf6ea',0);circ(-3,4,2,C.ink,0);circ(3,4,2,C.ink,0);};
MINI.farolero={name:'El Farolero',hp:100,r:50,h:200,home:260,
  init(e){e.y=220;e.base=220;},shapes:e=>e.fade>.5?[]:[{x:e.x,y:e.y,r:52}],
  upd(e,L,dt,p){e.cool-=dt;e.face=p.x<e.x?-1:1;if(e.tp>0){e.tp-=dt;e.fade=Math.min(1,(e.fade||0)+dt*4);if(e.tp<=0){e.x=e.ax+140+rand()*(W-280);e.base=150+rand()*120;}return;}e.fade=Math.max(0,(e.fade||0)-dt*4);
    e.y=e.base+Math.sin(e.st_t*2)*20;
    if(e.cool<=0){e.n++;const m=e.n%3;if(m===0){e.tp=.6;e.cool=1.2;sfx('magic');}
      else if(m===1){const n=10;for(let i=0;i<n;i++){const a=i*TAU/n+e.st_t;spawnEB(L,{k:'shot',x:e.x+e.face*36,y:e.y+30,vx:Math.cos(a)*190,vy:Math.sin(a)*190,r:10,spr:'llamita',parry:i===3});}sfx('fire');e.cool=1.8;}
      else{for(let i=0;i<5;i++)spawnEB(L,{k:'shot',x:e.ax+80+i*(W-160)/4+(rand()-.5)*60,y:-20-i*30,vx:0,vy:150,r:11,spr:'llamita',sway:120,fall:true});e.cool=1.9;}}},
  draw(e,t){const x=e.x,y=e.y,f=e.face;ctx.save();ctx.globalAlpha=1-(e.fade||0)*.85;
    ctx.beginPath();ctx.moveTo(x-40,y+10);ctx.bezierCurveTo(x-48,y-60,x+48,y-60,x+40,y+10);for(let i=0;i<4;i++)ctx.quadraticCurveTo(x+30-i*20,y+40+Math.sin(t*8+i)*6,x+20-i*20,y+26);ctx.closePath();ctx.fillStyle=flashC(e,'#e8f0f4');ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
    rr(x-34,y-62,68,12,4,'#2b2a33',3);rr(x-22,y-92,44,34,6,'#2b2a33',3.5);eyes2(x+f*4,y-24,.9,f,true);ell(x+f*4,y,8,6,C.ink,0);
    const lx=x+f*50,ly=y+20+Math.sin(t*3)*8;line(x+f*30,y-6,lx,ly-26,3,C.ink);rr(lx-12,ly-26,24,8,2,'#2b2a33',2.5);rr(lx-14,ly-18,28,34,5,'rgba(122,216,255,.6)',3);circ(lx,ly,8+Math.sin(t*12)*2,'#e8fbff',0);
    ctx.globalAlpha=.25*(1-(e.fade||0));circ(lx,ly,50,'#7ad8ff',0);ctx.restore();}};
