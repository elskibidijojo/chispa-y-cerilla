'use strict';
/* ================= MÁS CONTENIDO: 3 jefes, 3 niveles de correr, 1 mausoleo, armas, súpers, amuletos,
   armas de avión y un súper clásico distinto para cada héroe. Todo original. Se carga después de cartoon.js. ================= */

/* ---------- 1. Súper clásico con estilo propio por héroe ---------- */
const HERO_SUPER={chispa:{name:'¡GRAN CHISPAZO!',core:'#fff3b0',glow:'rgba(255,226,122,.35)',edge:C.ink},
  cerilla:{name:'¡GRAN LLAMARADA!',core:'#ffb35a',glow:'rgba(255,120,60,.32)',edge:'#5a1a14'},
  velita:{name:'¡HAZ ESPECTRAL!',core:'#e7c8ff',glow:'rgba(190,140,255,.32)',edge:'#3b2f55'}};
const _ssHero=startSuper;
startSuper=function(L,p){const nb=L.beams.length;_ssHero(L,p);if(L.beams.length>nb){const bm=L.beams[L.beams.length-1],hs=HERO_SUPER[p.char]||HERO_SUPER.chispa;bm.char=p.char;
  if(p.char!=='chispa'){L.banner=hs.name;}if(p.char==='velita'){bm.wave=true;bm.y0=bm.y;sfx('dizzy');}if(p.char==='cerilla')sfx('fire');}};
const _updBeamsHero=updBeams;
updBeams=function(L,dt){for(const bm of L.beams){if(bm.char!=='cerilla')continue;bm.emb=(bm.emb||0)-dt;if(bm.emb<=0){bm.emb=.07;const x=bm.x+bm.dir*(60+rand()*700);
    B_(L,bm.own,{x,y:bm.y+(rand()-.5)*40,vx:bm.dir*40,vy:bm.own.type==='plane'?(rand()-.5)*300:220+rand()*200,r:9,dmg:1.2,life:.7,max:.7,k:'llama',pierce:true,draw:drawFlameB});}}
  _updBeamsHero(L,dt);};
function drawBeamStyled(bm,L){const hs=HERO_SUPER[bm.char]||HERO_SUPER.chispa,x0=bm.x,x1=bm.dir>0?L.camX+W+40:L.camX-40,len=Math.abs(x1-x0),t=L.t;ctx.save();ctx.globalAlpha=Math.min(1,bm.t*4);
  const hh=(bm.char==='cerilla'?40:bm.char==='velita'?30:34)+Math.sin(t*50)*4;
  ctx.fillStyle=hs.glow;ctx.fillRect(Math.min(x0,x1),bm.y-hh-14,len,2*hh+28);
  ctx.beginPath();ctx.moveTo(x0,bm.y-hh);
  for(let x=0;x<=len;x+=20){const w=bm.char==='cerilla'?Math.abs(Math.sin(x*.07+t*30))*-16:Math.sin(x*.1+t*40)*5;ctx.lineTo(x0+bm.dir*x,bm.y-hh+w);}
  for(let x=len;x>=0;x-=20){const w=bm.char==='cerilla'?Math.abs(Math.sin(x*.07+t*30+1))*16:Math.sin(x*.1+t*40+2)*5;ctx.lineTo(x0+bm.dir*x,bm.y+hh+w);}
  ctx.closePath();ctx.fillStyle=hs.core;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=hs.edge;ctx.stroke();
  if(bm.char==='chispa'){ctx.lineWidth=3;ctx.strokeStyle='#ffffff';for(let k=0;k<2;k++){ctx.beginPath();for(let x=0;x<=len;x+=26){ctx.lineTo(x0+bm.dir*x,bm.y+(rand()-.5)*hh*1.2);}ctx.stroke();}}
  else if(bm.char==='cerilla'){ctx.fillStyle='rgba(255,240,160,.8)';ctx.beginPath();ctx.ellipse(x0+bm.dir*len/2,bm.y,len/2,hh*.35,0,0,TAU);ctx.fill();}
  else{for(let i=0;i<8;i++){const x=x0+bm.dir*(((t*260+i*110)%len));ctx.globalAlpha=.8;star(x,bm.y+Math.sin(t*8+i)*hh*.6,7,3,5,t*4+i);ctx.fillStyle='#ffffff';ctx.fill();}
    ctx.globalAlpha=.5;for(let i=0;i<5;i++){const x=x0+bm.dir*((t*180+i*170)%len);circ(x,bm.y-hh-6+Math.sin(t*5+i)*6,10,'rgba(240,230,255,.7)',0);}}
  ctx.restore();}

/* ---------- 2. Armas del avión: Ráfaga, Bombitas y Abanico aéreo (cambiar arma = siguiente) ---------- */
function drawBombita(b,L){ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx)*.5);const s=b.big?1.8:1;ctx.scale(s,s);circ(0,0,9,'#2b2420',2.5);circ(-3,-3,2.5,'rgba(255,255,255,.4)',0);
  rr(-3,-13,6,5,1,C.steel,1.5);line(0,-13,4,-19,2);circ(4+Math.sin(L.t*40),-20,2.5+Math.sin(L.t*60),'#ffb35a',0);}
const PLANE_W=[
  {name:'Ráfaga',fire(L,p){p.cool=p.small?.07:.09;B_(L,p,{x:p.x+32,y:p.y+3,vx:1100,vy:(rand()-.5)*50,r:p.small?5:7,dmg:p.small?.55:1,life:1,k:'chispa'});sfx('shot','chispa');},
    ex(L,p){B_(L,p,{x:p.x+30,y:p.y,vx:300,vy:0,acc:1400,r:20,dmg:10,life:1.6,k:'ex',pierce:true});}},
  {name:'Bombitas',fire(L,p){p.cool=.3;B_(L,p,{x:p.x+18,y:p.y+10,vx:560,vy:-190,g:430,r:11,dmg:p.small?2.6:4.4,life:2,k:'bomba',draw:drawBombita});sfx('throw');},
    ex(L,p){B_(L,p,{x:p.x+18,y:p.y+10,vx:500,vy:-200,g:420,r:18,dmg:15,life:2.4,k:'bomba',big:true,draw:drawBombita});}},
  {name:'Abanico aéreo',fire(L,p){p.cool=.14;for(const a of[-.22,0,.22])B_(L,p,{x:p.x+30,y:p.y+3,vx:Math.cos(a)*900,vy:Math.sin(a)*900,r:6,dmg:p.small?.4:.75,life:.7,k:'abanico'});sfx('shot','abanico');},
    ex(L,p){for(let i=0;i<8;i++){const a=i*TAU/8;B_(L,p,{x:p.x,y:p.y,vx:Math.cos(a)*650,vy:Math.sin(a)*650,r:12,dmg:2.6,life:.7,k:'ex'});}}}];
function planeWeapons(L,p,I){p.pw=p.pw||0;if(I.p.swap){p.pw=(p.pw+1)%PLANE_W.length;sfx('swap');pop(L,p.x,p.y-50,PLANE_W[p.pw].name.toUpperCase(),C.paper);}
  const w=PLANE_W[p.pw];if(p.shoot&&p.cool<=0){p.flashT=.05;w.fire(L,p);}
  if(I.p.ex){if(p.cards>=5)startSuper(L,p);else if(p.cards>=1&&p.exT<=0){p.cards--;L.exs++;p.exT=.4;w.ex(L,p);sfx('ex');}}return true;}
/* bombs in the sky have no floor: they burst on their own after a while */
const _updBulletsPW=updBullets;
updBullets=function(L,dt){if(L.kind==='plane')for(const b of L.bul){if(b.k==='bomba'&&b.draw===drawBombita&&(b.y>H-20||b.life<.1)){explode(L,b);b.life=0;}}_updBulletsPW(L,dt);};

/* ---------- 3. Armas, amuletos y súpers nuevos ---------- */
Object.assign(WEAPONS,{
  rebotapared:{name:'Rebota-paredes',price:4,isl:2,desc:'Balas de goma que rebotan dos veces en los bordes de la pantalla. ¡Perfectas para pegarle al jefe desde un rincón!',exd:'EX: una pelota gigante que rebota cinco veces.',
    fire(L,p,h,ax,ay){p.cool=.17;const b=B_(L,p,{x:h.x,y:h.y,vx:ax*820,vy:ay*820,r:8,dmg:1.35,life:2.2,k:'rebote',bounces:2});b.upd=wallBounce;},
    ex(L,p,h,ax,ay){const b=B_(L,p,{x:h.x,y:h.y,vx:ax*700,vy:ay*700-200,r:20,dmg:3,life:4,k:'ex',pierce:true,tickHit:true,bounces:5});b.upd=wallBounce;}},
  trompetazo:{name:'Trompetazo',price:5,isl:3,desc:'Una onda de sonido corta y ancha que lo atraviesa todo y borra las balas enemigas que toca.',exd:'EX: un trompetazo enorme que empuja todo hacia atrás.',
    fire(L,p,h,ax,ay){p.cool=.3;const b=B_(L,p,{x:h.x,y:h.y,vx:ax*560,vy:ay*560,r:14,dmg:2.6,life:.4,max:.4,k:'onda',pierce:true,draw:drawOnda});b.upd=ondaUpd;sfx('honk');},
    ex(L,p,h,ax,ay){const b=B_(L,p,{x:h.x,y:h.y,vx:ax*520,vy:ay*520,r:30,dmg:7,life:.7,max:.7,k:'onda',big:true,pierce:true,draw:drawOnda});b.upd=ondaUpd;sfx('honk');shake(L,8);}}});
function wallBounce(b,L){if(b.bounces>0){if(b.x<L.camX+12&&b.vx<0||b.x>L.camX+W-12&&b.vx>0){b.vx=-b.vx;b.bounces--;sfx('boing');}if(b.y<12&&b.vy<0||b.y>GROUND-6&&b.vy>0){b.vy=-b.vy;b.bounces--;sfx('boing');}}}
function ondaUpd(b,L,dt){b.r+=dt*(b.big?90:60);for(const e of L.eb)if(!e.dead&&destroyable(e)&&dist(e.x,e.y,b.x,b.y)<b.r+(e.r||10)){e.dead=true;sparks(L,e.x,e.y,3,C.brass);}}
function drawOnda(b,L){const k=1-b.life/b.max;ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ctx.globalAlpha=Math.max(0,1-k);for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-i*10,0,b.r-i*6,-1,1);ctx.lineWidth=5-i;ctx.strokeStyle=i?C.brass:C.ink;ctx.stroke();}}
Object.assign(SHOTS,{rebotapared:()=>tn(700,.05,{type:'triangle',v:.03,slide:-200}),trompetazo:()=>{}});
Object.assign(CHARMS,{
  pluma:{name:'Pluma Ligera',price:3,isl:1,desc:'Mantén saltar en el aire para planear despacito, como una pluma.'},
  espejo:{name:'Espejo de Bolsillo',price:4,isl:3,desc:'Cada parry dispara un rayo de luz contra el enemigo más cercano.'}});
const _platPluma=platUpdate;
platUpdate=function(L,p,dt,I){_platPluma(L,p,dt,I);if(!p.dead&&hasCharm(p,'pluma')&&!p.ground&&I.h.jump&&p.vy>150){p.vy=150;if(rand()<.2)L.fx.push({k:'puff',x:p.x,y:p.y-6,vx:0,vy:30,life:.4,max:.4,r:5,col:'#ffffff'});}};
const _doParryEsp=doParry;
doParry=function(L,p,o){_doParryEsp(L,p,o);if(hasCharm(p,'espejo')){const c=pCenter(p),t=nearestEnt(L,c.x,c.y);if(t){const tc=nearPt(t,c.x,c.y);L.arcs.push({pts:zig(c.x,c.y,tc.x,tc.y),t:.25,big:true});t.damage(7*dmgM(p),p);sfx('zap');}}};
Object.assign(SUPERS,{
  remolino:{name:'Remolino Huracán',price:5,isl:3,desc:'Un remolino gigante avanza despacio y golpea muchas veces todo lo que atrapa. Se gana en el Mausoleo de la Tormenta.'},
  fuegos:{name:'Fuegos Artificiales',price:5,isl:2,desc:'Seis cohetes suben al cielo y estallan en chispas que buscan solas al enemigo.'}});
function drawTornado(b,L){ctx.translate(b.x,b.y);const t=L.t;for(let i=0;i<7;i++){const y=40-i*16,w=18+i*9;ctx.save();ctx.translate(Math.sin(t*9+i)*8,y);ctx.beginPath();ctx.ellipse(0,0,w,7,0,0,TAU);
  ctx.fillStyle=i%2?'rgba(220,230,235,.85)':'rgba(190,205,215,.85)';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
  for(let i=0;i<4;i++){const a=t*12+i*1.6;circ(Math.cos(a)*40,Math.sin(a)*30-20,4,C.paper,1.5);}}
const _ssNew=startSuper;
startSuper=function(L,p){const s=p.eq.sup||'chispazo';if(s!=='remolino'&&s!=='fuegos'){_ssNew(L,p);return;}unlockAch('super');
  p.cards=0;L.supers++;p.superK=s;p.superT=.4;p.inv=Math.max(p.inv,1);L.superFlash=.35;sfx('super');shake(L,12);banner(L,'¡'+SUPERS[s].name.toUpperCase()+'!',1.1);const c=pCenter(p),d=p.type==='plane'?1:p.face;
  if(s==='remolino'){B_(L,p,{x:c.x+d*60,y:c.y-10,vx:d*150,vy:0,r:60,dmg:2.4,life:4.6,k:'tornado',pierce:true,tickHit:true,draw:drawTornado});sfx('storm');}
  else for(let i=0;i<6;i++){const b=B_(L,p,{x:c.x+(i-2.5)*24,y:c.y,vx:(i-2.5)*60,vy:-760-rand()*120,r:8,dmg:2,life:2,k:'cohete',tt:0,draw:drawRocket});
    b.upd=(b,L,dt)=>{b.tt+=dt;if(b.tt>.45+i*.04){b.life=0;boom(L,b.x,b.y,30);sfx('pop');for(let k=0;k<8;k++){const a=k*TAU/8;B_(L,p,{x:b.x,y:b.y,vx:Math.cos(a)*360,vy:Math.sin(a)*360,r:9,dmg:1.6,life:1.6,k:'luci',homing:6,big:true});}}};}};

/* ---------- 4. Tres jefes nuevos ---------- */
/* Don Trompo — a spinning toy top (Isla de Hojalata) */
const tpC=B=>({x:B.x,y:B.y-120-(B.act&&B.act.type==='leap'?0:Math.abs(Math.sin(B.t*2))*8)});
defBoss({id:'trompo',name:'Don Trompo',sub:'Jefe · Cuarto de los Juguetes',isl:1,hp:360,par:100,arena:'juguetes',song:'trompo',x:720,intro:'¡A DAR VUELTAS!',faceTarget:true,
  center:tpC,anchor(B,n){const c=tpC(B);if(n==='hand')return{x:B.x-80,y:c.y-20};if(n==='foot')return{x:B.x,y:GROUND};return c;},
  shapes(B){const c=tpC(B);return[{x:c.x,y:c.y,r:96}];},
  move(B,dt){B.spin=(B.spin||0)+dt*(6+B.phase*4);if(!B.act)B.x=lerp(B.x,560+Math.sin(B.t*.6)*200,Math.min(1,dt*.8));},
  phases:[
    {atk:[{f:'roller',every:2.2,from:'foot',spr:'ball',r:22,spd:360,parry:3,sfx:'knock'},{f:'aimed',every:2.6,from:'hand',n:3,spread:.3,spd:300,spr:'star',r:13,parry:4}]},
    {banner:'¡A TODA VELOCIDAD!',atk:[{f:'charge',every:3.4,warn:.8,spd:820},{f:'bouncer',every:3,spr:'ball',r:22,spd:420,max:2},{f:'roller',every:2.6,from:'foot',spr:'ball',r:22,spd:420,parry:2}]},
    {banner:'¡TORBELLINO FINAL!',atk:[{f:'leap',every:2.4,landWave:true},{f:'spiral',every:3.6,dur:1.4,rate:.09,spd:240,spr:'star',r:11,arms:2,parry:6}]}],
  draw(B,L){const c=tpC(B),x=c.x,y=c.y,sp=B.spin||0;shadowE(B.x,GROUND+3,90,.3);ctx.save();ctx.lineCap='round';ctx.lineJoin='round';bossSquash(B,L);
    const tilt=Math.sin(B.t*3)*.08+(B.act&&B.act.type==='charge'?B.act.dir*.25:0);ctx.translate(x,y);ctx.rotate(tilt);
    /* tip */poly([[-18,92],[0,128],[18,92]],C.steelD,4);
    /* striped body that turns */ctx.save();ctx.beginPath();ctx.moveTo(-100,-10);ctx.quadraticCurveTo(-110,60,-20,96);ctx.lineTo(20,96);ctx.quadraticCurveTo(110,60,100,-10);ctx.quadraticCurveTo(0,-40,-100,-10);ctx.closePath();ctx.clip();
    ctx.fillStyle=B.phase===2?'#c8392b':C.rust;ctx.fillRect(-120,-60,240,170);for(let i=-6;i<6;i++){const xx=((i*40+sp*40)%480+480)%480-240;ctx.fillStyle=i%2?C.paper:C.gold;ctx.beginPath();ctx.moveTo(xx,-60);ctx.lineTo(xx+22,-60);ctx.lineTo(xx+4,110);ctx.lineTo(xx-18,110);ctx.closePath();ctx.fill();}ctx.restore();
    ctx.beginPath();ctx.moveTo(-100,-10);ctx.quadraticCurveTo(-110,60,-20,96);ctx.lineTo(20,96);ctx.quadraticCurveTo(110,60,100,-10);ctx.quadraticCurveTo(0,-40,-100,-10);ctx.closePath();ctx.lineWidth=6;ctx.strokeStyle=C.ink;ctx.stroke();
    ell(0,-14,100,24,C.woodL,5);rr(-12,-78,24,60,8,C.woodD,4);circ(0,-82,14,C.brass,4);
    for(const s of[-1,1]){const raise=(s<0&&B.throwT>0)?-60:0,gx=s*140,gy=10+raise+Math.sin(B.t*4+s)*8;hose(s*90,10,s*120,0,gx,gy,7);glove(gx,gy,14);}
    bossFace(B,L,0,30,.95,{gap:30,ew:16,eh:22,my:30,mw:34,open:B.act?.9:.3});ctx.restore();
    flashOver(B,x,y,98);koStars(B,L,x,y-120);}});

/* Madame Pulpa — an octopus opera diva at the harbour (Bahía Bruma) */
const ppC=B=>({x:B.x,y:B.y-200+Math.sin(B.t*1.8)*8});
defBoss({id:'pulpo',name:'Madame Pulpa',sub:'Jefa · Muelle de la Ópera',isl:2,hp:430,par:110,arena:'puerto',song:'pulpo',x:740,intro:'¡SILENCIO, QUE CANTO!',
  center:ppC,anchor(B,n){const c=ppC(B);if(n==='mouth')return{x:c.x-50,y:c.y+30};if(n==='hand')return{x:c.x-140,y:c.y+60};if(n==='foot')return{x:c.x-120,y:GROUND};return c;},
  shapes(B){const c=ppC(B);return[{x:c.x,y:c.y,r:104},{x:c.x-90,y:c.y+80,w:180,h:GROUND-(c.y+80)}];},
  move(B,dt){B.sing=(B.sing||0)+dt;},
  phases:[
    {atk:[{f:'aimed',every:1.7,from:'mouth',n:3,spread:.25,spd:280,spr:'note',r:13,wob:70,parry:4,sfx:'honk'},{f:'lob',every:2.8,from:'hand',spr:'drop',r:14,puddle:true,T:1.2}]},
    {banner:'¡SEGUNDO ACTO!',atk:[{f:'column',every:3,n:3,gap:.45,style:'needle',warn:.7,act:.4,w:34,spread:130},{f:'ring',every:2.6,from:'mouth',n:10,spd:210,spr:'bubble',parry:5},{f:'aimed',every:2.2,from:'mouth',n:2,spread:.3,spd:300,spr:'note',r:13,wob:70,parry:3}]},
    {banner:'¡EL GRAN AGUDO!',atk:[{f:'spiral',every:3.2,from:'mouth',dur:1.6,rate:.08,spd:230,spr:'note',r:11,arms:3,parry:7},{f:'fountain',every:2.6,from:'hand',n:6,spr:'drop',parry:4},{f:'lob',every:3,from:'hand',spr:'drop',r:14,puddle:true,T:1.1}]}],
  draw(B,L){const c=ppC(B),x=c.x,y=c.y,t=B.t;shadowE(x,GROUND+3,130,.3);ctx.save();ctx.lineCap='round';ctx.lineJoin='round';bossSquash(B,L);
    const col=B.phase===2?'#9a4a8a':'#c26aa8';
    for(let i=0;i<6;i++){const bx=x-110+i*44,ph=t*3+i;ctx.beginPath();ctx.moveTo(bx,y+60);ctx.quadraticCurveTo(bx+Math.sin(ph)*40,(y+60+GROUND)/2,bx+Math.sin(ph+1)*30,GROUND-6);ctx.lineWidth=26;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=19;ctx.strokeStyle=col;ctx.stroke();
      for(let k=1;k<4;k++){const yy=y+60+(GROUND-y-60)*k/4;circ(bx+Math.sin(ph+k*.4)*28,yy,3.5,'#f2c9e0',0);}}
    for(const s of[-1,1]){const raise=(s<0&&B.throwT>0)?-70:0;ctx.beginPath();ctx.moveTo(x+s*80,y+40);ctx.quadraticCurveTo(x+s*170,y+raise,x+s*150,y-40+raise+Math.sin(t*3+s)*14);ctx.lineWidth=24;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=17;ctx.strokeStyle=col;ctx.stroke();}
    ell(x,y,110,100,col,6);ell(x-30,y-40,40,22,'rgba(255,255,255,.18)',0);
    for(let i=0;i<9;i++){const a=Math.PI*.15+i*Math.PI*.7/8;circ(x+Math.cos(a)*80,y+60+Math.sin(a)*14,7,'#fff8e8',2);}
    ctx.save();ctx.translate(x+40,y-96);ctx.rotate(.25);ell(0,0,40,10,'#2b2420',4);rr(-22,-30,44,30,6,'#2b2420',4);rr(-22,-12,44,6,0,C.gold,2);poly([[10,-30],[30,-62],[20,-28]],C.rust,3);ctx.restore();
    bossFace(B,L,x-20,y-10,1.05,{gap:34,ew:18,eh:24,my:44,mw:30,open:B.mouth>0||B.phase>0?.7+Math.sin(t*14)*.2:.25});
    if(B.mouth>0)for(let i=0;i<2;i++){const k=(t*.8+i/2)%1;ctx.globalAlpha=1-k;txt('♪',x-80-k*60,y-20-k*50,22,C.brass,C.ink);ctx.globalAlpha=1;}
    flashOver(B,x,y,110);koStars(B,L,x,y-140);ctx.restore();}});

/* Doctor Graznido — a crow alchemist with bubbling flasks (Cumbre Apagón) */
const cvC=B=>({x:B.x,y:B.y-170+Math.sin(B.t*2.4)*5});
defBoss({id:'cuervo',name:'Doctor Graznido',sub:'Jefe · Laboratorio de la Torre',isl:3,hp:520,par:120,arena:'castillo',song:'cuervo',x:760,intro:'¡QUE EMPIECE EL EXPERIMENTO!',
  center:cvC,anchor(B,n){const c=cvC(B);if(n==='hand')return{x:c.x-110,y:c.y+10};if(n==='mouth')return{x:c.x-70,y:c.y-50};if(n==='foot')return{x:c.x-60,y:GROUND};return c;},
  shapes(B){const c=cvC(B);return[{x:c.x,y:c.y-30,r:70},{x:c.x-70,y:c.y+20,w:140,h:GROUND-(c.y+20)}];},
  phases:[
    {atk:[{f:'lob',every:2,from:'hand',spr:'orb',r:14,puddle:true,T:1.2,parry:3},{f:'aimed',every:2.4,from:'mouth',n:3,spread:.22,spd:340,spr:'feather',r:11,parry:4,sfx:'caw'}]},
    {banner:'¡FÓRMULA SECRETA!',atk:[{f:'minion',every:4.5,from:'mouth',ai:'flyer',skin:'cuervo',hp:3,r:20,max:3,spd:180,ammo:'feather'},{f:'tele',every:4.2,minx:320,maxx:820},{f:'lob',every:2.4,from:'hand',spr:'orb',r:14,puddle:true,T:1.1,parry:3}]},
    {banner:'¡¡EUREKA!!',atk:[{f:'rain',every:1.6,n:5,spd:[240,360],spr:'feather',r:11,parry:6},{f:'column',every:3.2,n:2,gap:.5,style:'needle',warn:.6,act:.4,w:30,spread:160},{f:'ring',every:2.8,from:'hand',n:12,spd:220,spr:'orb',parry:6}]}],
  draw(B,L){const c=cvC(B),x=c.x,y=c.y,t=B.t;shadowE(x,GROUND+3,90,.3);ctx.save();ctx.lineCap='round';ctx.lineJoin='round';bossSquash(B,L);
    for(const s of[-1,1]){line(x+s*24,y+80,x+s*30,GROUND-8,8);poly([[x+s*30-14,GROUND],[x+s*30+14,GROUND],[x+s*30,GROUND-12]],C.gold,3);}
    ctx.beginPath();ctx.moveTo(x-70,y-30);ctx.quadraticCurveTo(x-90,y+60,x-60,y+96);ctx.lineTo(x+60,y+96);ctx.quadraticCurveTo(x+90,y+60,x+70,y-30);ctx.closePath();ctx.fillStyle='#efe9dc';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();
    line(x,y-20,x,y+96,3);for(let i=0;i<3;i++)circ(x+10,y+i*26,4,C.steel,2);rr(x+22,y+10,26,18,3,null,3);
    ell(x,y-60,64,58,'#2b2238',5);ctx.beginPath();ctx.moveTo(x-50,y-56);ctx.lineTo(x-118,y-40+Math.sin(t*8)*4);ctx.lineTo(x-50,y-30);ctx.closePath();ctx.fillStyle=C.gold;ctx.fill();ctx.stroke();
    for(const s of[-1,1]){circ(x-14+s*22,y-74,17,'rgba(200,230,240,.7)',4);}line(x-14,y-74,x+8,y-74,4);bossFace(B,L,x-14,y-74,.7,{gap:44,ew:10,eh:13,my:0,mw:0,open:0});
    for(let i=0;i<3;i++)poly([[x-10+i*16,y-112],[x-2+i*16,y-140-i*6],[x+6+i*16,y-112]],'#2b2238',3);
    const raise=B.throwT>0?-50:0,hx=x-110,hy=y+10+raise+Math.sin(t*3)*6;hose(x-60,y,x-90,y+raise,hx,hy,7);glove(hx,hy,13);
    ctx.save();ctx.translate(hx,hy-26);poly([[-8,-18],[8,-18],[20,14],[-20,14]],'rgba(170,255,190,.85)',3);rr(-6,-28,12,10,2,C.woodL,2);
    for(let i=0;i<3;i++){const k=(t*.9+i/3)%1;ctx.globalAlpha=1-k;circ(Math.sin(i*2+t)*6,-30-k*40,4+k*5,'rgba(170,255,190,.8)',2);ctx.globalAlpha=1;}ctx.restore();
    flashOver(B,x,y-40,90);koStars(B,L,x,y-140);ctx.restore();}});

/* taunts, new signature attacks and music for the new bosses */
Object.assign(TAUNTS,{trompo:['¡Mírame girar, mírame ganar!','¡Más rápido, más rápido!','¡Me estoy mareando… de alegría!','¡Torbellino final!'],
  pulpo:['¡Silencio! La diva va a cantar.','¡Ocho brazos para aplaudirme!','¡Bravo, bravísimo… para mí!','¡El agudo más alto del mundo!'],
  cuervo:['¡Cra-cra! Ustedes serán mi experimento.','¡Fórmula número dos!','¡Esto va a explotar!','¡¡EUREKA!!']});
Object.assign(ATK,{spinTops(L,B,a){const o=anc(B,'foot');for(const d of[-1,1]){B.pc++;spawnEB(L,{k:'roll',x:o.x+d*40,y:GROUND-18,vx:d*300,r:18,spr:'gear',hop:520,vy:-520,parry:d>0&&P_(B,a)});}sfx('ratchet');},
  inkSplash(L,B,a){const o=anc(B,'mouth');for(let i=0;i<5;i++){B.pc++;spawnEB(L,{k:'grav',x:o.x,y:o.y,vx:-120-i*90,vy:-500+i*30,g:1300,r:12,spr:'jam',puddle:true,parry:i===4&&P_(B,a)});}sfx('splash');},
  potionStorm(L,B,a){for(let i=0;i<4;i++)B.queue.push({t:i*.3,fn:()=>{const t=tgt(L,B);B.pc++;spawnEB(L,{k:'shot',x:clamp(t.x+(rand()-.5)*80,30,W-30),y:-20,vx:0,vy:360,r:13,spr:'orb',fall:true,puddle:true,parry:i===3&&P_(B,a)});}});sfx('magic');}});
[['trompo',{f:'spinTops',every:5.5,parry:1}],['pulpo',{f:'inkSplash',every:6,parry:1}],['cuervo',{f:'potionStorm',every:6,parry:1}]].forEach(([id,a])=>{const d=LEVELS[id];for(let i=1;i<d.phases.length;i++)d.phases[i].atk.push(Object.assign({delay:2.5+i},a));});

/* ---------- 5. Tres niveles de correr y disparar + el cuarto mausoleo ---------- */
Object.assign(RUN_THEMES,{
  trenes:{sky:['#e3d2a8','#a58f6a'],far:'fabrica',mid:'#6b5a48',ground:'#5a4a3c',trim:[C.steel,C.ink],walker:'soldadito',flyer:'avioncito',turret:'canon',popper:'caja',hopper:'soldadito',ammo:'ball',egg:'nut',plank:C.steel,cave:true},
  arrecife:{sky:['#bfe0dc','#3f7f86'],far:'mar',mid:'#3f7f86',ground:'#e2c98f',trim:['#e86a5a',C.paper],walker:'cangrejito',flyer:'pez',turret:'coral',popper:'pulpito',hopper:'cangrejito',ammo:'bubble',egg:'drop',plank:'#c79a5e'},
  cementerio:{sky:['#1b1628','#3a2f55'],far:'castillo',mid:'#2a2238',ground:'#3a3448',trim:['#5a5470',C.ink],walker:'calabacita',flyer:'murcielago',turret:'farol',popper:'fantasmita',hopper:'fantasmita',ammo:'orb',egg:'orb',plank:'#5a5450'}});
Object.assign(CHUNKS,{
  vagones:{w:900,f(B,c){B.ground(0,160);B.mover(160,380,140,160,0,1.1);B.ground(520,560);B.mover(560,360,120,0,70,1.5);B.ground(760,900);B.walker(840);B.flyers(200,1);if(c)B.coin(470,300);}},
  arrecifeSaltos:{w:860,f(B,c){B.ground(0,150);B.spring(110);B.cplat(260,330,90);B.plat(420,280,100);B.cplat(570,330,90);B.ground(700,860);B.hopper(780);if(c)B.coin(470,230);}},
  tumbas:{w:880,f(B,c){B.ground(0,880);B.popper(200);B.popper(420);B.popper(640);B.plat(300,320,120);B.plat(520,280,120);B.turret(800);if(c)B.coin(580,240);}}});
defRun({id:'trenes',name:'Expreso de Hojalata',sub:'Nivel · Corre y dispara',isl:1,par:160,song:'trenes',theme:'trenes',
  chunks:[['start'],['vagones',1],['flat'],['turret'],['cartRide',1],['jets'],['vagones'],['gauntlet',1],['mover'],['fortress',1],['vagones'],['ambush',1],['end']]});
defRun({id:'arrecife',name:'Arrecife Burbuja',sub:'Nivel · Corre y dispara',isl:2,par:170,song:'arrecife',theme:'arrecife',
  chunks:[['start'],['arrecifeSaltos',1],['pit'],['hopperField'],['skyway',1],['arrecifeSaltos'],['pitParry',1],['turret'],['crumbleBridge',1],['arrecifeSaltos'],['ambush',1],['end']]});
defRun({id:'cementerio',name:'Cementerio Saltarín',sub:'Nivel · Corre y dispara',isl:3,par:175,song:'cementerio',theme:'cementerio',
  chunks:[['start'],['tumbas',1],['pitParry'],['crumbleBridge'],['tumbas',1],['jets'],['stairs',1],['tumbas'],['skyway',1],['fortress'],['ambush',1],['end']]});
defMaus('mausoleo4','Mausoleo de la Tormenta',3,[{n:10,gap:1.55,spd:135,pair:true},{n:12,gap:1.45,spd:145,pair:true,fast:true},{n:14,gap:1.4,spd:150,pair:true,fast:true}],'remolino',{tint:'rgba(60,90,140,.25)'});

/* songs (synth fallback + recorded tracks) */
const nsong=(base,name,seed)=>Object.assign({},SONGS[base],{name,seed});
Object.assign(SONGS,{trompo:nsong('reloj','Trompo Loco',301),pulpo:nsong('faro','Aria del Muelle',303),cuervo:nsong('vela','Fórmula Secreta',307),
  trenes:nsong('fabrica','Vía Libre',311),arrecife:nsong('muelle','Burbujas y Corales',313),cementerio:nsong('torre','Tumbas Bailarinas',317),mausoleo4:nsong('mausoleo','Ojo de la Tormenta',319)});
Object.assign(PACK,{trompo:['pd-trompo','Kitten on the Keys — Zez Confrey and his Orchestra (1922)','pd'],pulpo:['pd-pulpo','Limehouse Blues — New Orleans Jazz Band (1924)','pd'],
  cuervo:['pd-cuervo','St. Louis Blues — Lieut. Jim Europe\'s 369th U.S. Inf. "Hell Fighters" Band (1919)','pd'],trenes:['pd-trenes','Darktown Strutters\' Ball — Lieut. Jim Europe\'s 369th U.S. Inf. "Hell Fighters" Band (1919)','pd'],
  arrecife:['pd-arrecife','Hindustan — The All Star Trio (1918)','pd'],cementerio:['pd-cementerio','Sweet Georgia Brown — Six Black Diamonds (1925)','pd'],mausoleo4:['dark-hallway-distressed','Dark Hallway (distressed)']});
Object.assign(PACK_FINAL,{trompo:['pd-trompo-f','Stumbling — Golden Gate Dance Orch. (1922)','pd'],pulpo:['pd-pulpo-f','Dardanella — Harry Raderman\'s Jazz Orchestra (1920)','pd'],cuervo:['pd-cuervo-f','Runnin\' Wild — Ladd\'s Black Aces (1923)','pd']});


/* ---------- 6. En el mapa ---------- */
BOSS_LIST[1].push('trompo');BOSS_LIST[2].push('pulpo');BOSS_LIST[3].splice(BOSS_LIST[3].indexOf('apagon'),0,'cuervo');
RUN_LIST[1].push('trenes');RUN_LIST[2].push('arrecife');RUN_LIST[3].push('cementerio');
for(const id of['trompo','pulpo','cuervo','trenes','arrecife','cementerio'])if(!ALL_LEVELS.includes(id))ALL_LEVELS.push(id);
WORLDS[3].bridges[0].open=()=>BOSS_LIST[3].filter(k=>k!=='apagon'&&save.cleared[k]).length>=6;
addNode(1,{id:'trompo',x:1150,y:810,kind:'level',ob:34,bld:'jugueteria',em:'gear'});addNode(1,{id:'trenes',x:840,y:400,kind:'level',ob:36,bld:'estacion',em:'ball'});
addNode(2,{id:'pulpo',x:1000,y:1000,kind:'level',ob:36,bld:'opera',em:'note'});addNode(2,{id:'arrecife',x:560,y:780,kind:'level',ob:32,bld:'coral',em:'bubble'});
addNode(3,{id:'cuervo',x:1150,y:560,kind:'level',ob:34,bld:'laboratorio',em:'feather'});addNode(3,{id:'cementerio',x:250,y:820,kind:'level',ob:34,bld:'cementerio',em:'orb'});
addNode(3,{id:'mausoleo4',x:640,y:1000,kind:'level',ob:30,bld:'mausoleo',em:'ghostE'});
WORLDS[1].roads.push(['gramo','trompo'],['feria','trenes'],['trenes','reloj']);WORLDS[2].roads.push(['cangrejo','pulpo'],['shop','arrecife']);WORLDS[3].roads.push(['maquina','cuervo'],['feria_noche','cementerio'],['shop','mausoleo4']);
MAPBG={k:null};
const NEW_BLD=['jugueteria','estacion','opera','coral','laboratorio','cementerio'];
const _drawBldNew=drawBld;
drawBld=function(n,t,night){if(!NEW_BLD.includes(n.bld)){_drawBldNew(n,t,night);return;}const x=n.x,y=n.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;
  switch(n.bld){
    case 'jugueteria':rr(x-46,y-64,92,64,0,'#e3cd9d');poly([[x-54,y-62],[x,y-100],[x+54,y-62]],C.rust);rr(x-12,y-34,24,34,6,C.wood);ctx.save();ctx.translate(x,y-118);ctx.rotate(Math.sin(t*6)*.25);
      ctx.beginPath();ctx.moveTo(-16,-6);ctx.quadraticCurveTo(0,-20,16,-6);ctx.lineTo(0,18);ctx.closePath();ctx.fillStyle=C.gold;ctx.fill();ctx.stroke();line(0,-14,0,-26,3);ctx.restore();rr(x-38,y-56,22,16,2,'#ffd36a',2.5);rr(x+16,y-56,22,16,2,'#ffd36a',2.5);break;
    case 'estacion':rr(x-60,y-56,120,56,0,'#c79a5e');poly([[x-68,y-54],[x,y-84],[x+68,y-54]],C.rustD);circ(x,y-66,10,C.paper,3);line(x,y-66,x+5,y-70,2);rr(x-14,y-30,28,30,4,C.wood);
      line(x-70,y+6,x+70,y+6,3,C.steel);for(let i=0;i<3;i++){const k=(t*.7+i/3)%1;ctx.globalAlpha=1-k;circ(x+50+k*10,y-90-k*40,6+k*8,C.paper,2);ctx.globalAlpha=1;}break;
    case 'opera':rr(x-56,y-70,112,70,0,'#d8b0c8');for(let i=0;i<4;i++)rr(x-46+i*26,y-64,10,64,0,C.paper,2);ctx.beginPath();ctx.ellipse(x,y-70,62,34,0,Math.PI,0);ctx.closePath();ctx.fillStyle='#9a4a8a';ctx.fill();ctx.stroke();
      circ(x,y-108,8,C.gold,3);for(let i=0;i<2;i++){const k=(t*.6+i/2)%1;ctx.globalAlpha=1-k;txt('♪',x+40+k*20,y-110-k*30,16,C.brass,C.ink);ctx.globalAlpha=1;}break;
    case 'coral':for(const [a,h,cl] of[[-30,70,'#e86a5a'],[0,96,'#f2a65a'],[30,64,'#c26aa8']]){ctx.beginPath();ctx.moveTo(x+a,y);ctx.lineTo(x+a,y-h);ctx.moveTo(x+a,y-h*.6);ctx.lineTo(x+a-16,y-h*.85);ctx.moveTo(x+a,y-h*.45);ctx.lineTo(x+a+16,y-h*.7);ctx.lineWidth=10;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=6;ctx.strokeStyle=cl;ctx.stroke();}
      for(let i=0;i<3;i++){const k=(t*.5+i/3)%1;ctx.globalAlpha=1-k;circ(x-20+i*20,y-100-k*40,4+k*3,'rgba(200,235,240,.8)',2);ctx.globalAlpha=1;}break;
    case 'laboratorio':rr(x-30,y-120,60,120,0,'#4b4170');poly([[x-36,y-118],[x,y-150],[x+36,y-118]],'#2a2238');rr(x-16,y-100,32,24,3,Math.floor(t*4)%2?'#aaffbe':'#5aa070',2.5);rr(x-10,y-34,20,34,8,C.woodD);
      for(let i=0;i<3;i++){const k=(t*.8+i/3)%1;ctx.globalAlpha=1-k;circ(x+Math.sin(t+i)*8,y-160-k*40,5+k*7,'rgba(170,255,190,.7)',2);ctx.globalAlpha=1;}break;
    case 'cementerio':rr(x-56,y-10,112,10,0,'#4b4060',2.5);for(const [a,h] of[[-34,40],[0,54],[34,36]]){ctx.beginPath();ctx.moveTo(x+a-14,y-8);ctx.lineTo(x+a-14,y-h+10);ctx.quadraticCurveTo(x+a,y-h-8,x+a+14,y-h+10);ctx.lineTo(x+a+14,y-8);ctx.closePath();ctx.fillStyle='#8f8a90';ctx.fill();ctx.stroke();line(x+a,y-h+8,x+a,y-h+24,2.5);line(x+a-6,y-h+14,x+a+6,y-h+14,2.5);}
      const gy=Math.sin(t*2)*6;ctx.globalAlpha=.7;ell(x+50,y-70+gy,10,13,'#e8f2ee',2.5);ctx.globalAlpha=1;break;}
  ctx.restore();_drawBldNew(Object.assign({},n,{bld:'_'}),t,night);};
/* shop/equip icons for the new items */
const _itemIconNew=itemIcon;
itemIcon=function(id,x,y,t){const NEW=['rebotapared','trompetazo','pluma','espejo','remolino','fuegos'];if(!NEW.includes(id)){_itemIconNew(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  switch(id){case 'rebotapared':rr(-22,-20,6,40,2,C.woodL,2);ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(18,-14);ctx.lineTo(-16,0);ctx.lineTo(18,14);ctx.stroke();ctx.setLineDash([]);circ(18+Math.sin(t*6)*3,14,7,'#e86a5a');break;
    case 'trompetazo':rr(-22,-6,26,12,5,C.brass);poly([[4,-6],[18,-16],[18,16],[4,6]],C.brass);for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(20,0,8+i*6+Math.sin(t*8)*2,-.8,.8);ctx.stroke();}break;
    case 'pluma':ctx.rotate(-.6+Math.sin(t*2)*.15);ctx.beginPath();ctx.moveTo(0,22);ctx.quadraticCurveTo(-16,0,0,-22);ctx.quadraticCurveTo(16,0,0,22);ctx.fillStyle=C.paper;ctx.fill();ctx.stroke();line(0,22,0,-18,2);break;
    case 'espejo':circ(0,-4,16,'#cfe8ee');ctx.beginPath();ctx.arc(-4,-8,8,3.4,4.6);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle=C.ink;rr(-4,12,8,12,2,C.brass,2.5);break;
    case 'remolino':for(let i=0;i<5;i++)ell(Math.sin(t*8+i)*3,14-i*8,6+i*4,3.5,i%2?'#dce6eb':'#bccdd7',2);break;
    case 'fuegos':for(let i=0;i<3;i++){const a=t*2+i*2.1;star(Math.cos(a)*10,-6+Math.sin(a)*8,9,4,6,t*3);ctx.fillStyle=['#e86a5a','#f2c14e','#7bb7c9'][i];ctx.fill();ctx.stroke();}line(0,22,0,6,3);break;}
  ctx.restore();};
/* achievements for the new content */
ACH.push(['jefes20','Coleccionista de Nocauts','Vence a los 20 jefes.',3],['maus4','Ojo de la Tormenta','Supera el Mausoleo de la Tormenta.',2],['piloto','¡Bombas Fuera!','Vence a un jefe aéreo usando las Bombitas.',1]);
for(const [id,name,desc,coins] of ACH.slice(-3))ACHD[id]={id,name,desc,coins};
const _finishNew=finish;
finish=function(L){_finishNew(L);try{if(BOSS_LIST[1].concat(BOSS_LIST[2],BOSS_LIST[3]).every(k=>save.cleared[k]))unlockAch('jefes20');if(L.id==='mausoleo4')unlockAch('maus4');
  if(L.kind==='plane'&&L.Ps.some(p=>p.pw===1))unlockAch('piloto');if(['mausoleo','mausoleo2','mausoleo3','mausoleo4'].every(k=>save.cleared[k]))unlockAch('mausoleos');}catch(_){}};
