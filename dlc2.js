'use strict';
/* ================= DLC «LA ÚLTIMA FUNCIÓN» (Rollo n.º 10) · parte 2:
   El Cine Fantasma (Cumbre Apagón), la Baraja de solo-parry (Sota, Reina, Rey y As), El Proyeccionista y un jefe secreto ================= */

/* ---------- bullets ---------- */
const SPRD={
  basto(e,t,P,r){ctx.rotate(t*8+e.x*.01);rr(-r*.35,-r*1.5,r*.7,r*3,r*.3,P('#8a5a32'),2.5);for(const y of[-.8,0,.8])circ(r*.35,y*r,r*.22,P('#6b4228'),2);ell(-r*.2,-r*1.5,r*.5,r*.3,P('#5f8a3a'),2);},
  copa(e,t,P,r){ctx.rotate(Math.sin(t*8)*.4);ctx.beginPath();ctx.moveTo(-r,-r);ctx.quadraticCurveTo(-r,r*.3,0,r*.3);ctx.quadraticCurveTo(r,r*.3,r,-r);ctx.closePath();ctx.fillStyle=P('#d9a441');ctx.fill();ctx.lineWidth=2.5;ctx.stroke();rr(-r*.15,r*.3,r*.3,r*.6,1,P('#a8772a'),2);rr(-r*.6,r*.85,r*1.2,r*.3,2,P('#a8772a'),2);ell(0,-r,r,r*.25,P('#8e2a3a'),2);},
  gota(e,t,P,r){ctx.beginPath();ctx.moveTo(0,-r*1.4);ctx.quadraticCurveTo(r,0,0,r);ctx.quadraticCurveTo(-r,0,0,-r*1.4);ctx.fillStyle=P('#8e2a3a');ctx.fill();ctx.lineWidth=2.5;ctx.stroke();ell(-r*.3,-r*.1,r*.18,r*.3,'rgba(255,255,255,.6)',0);},
  oro(e,t,P,r){const s=Math.abs(Math.cos(t*6+e.x*.02));ctx.scale(Math.max(.2,s),1);circ(0,0,r,P('#f2c14e'),3);circ(0,0,r*.7,null,2);for(let i=0;i<8;i++){const a=i*TAU/8;line(Math.cos(a)*r*.3,Math.sin(a)*r*.3,Math.cos(a)*r*.6,Math.sin(a)*r*.6,2,P('#a8772a'));}circ(0,0,r*.25,P('#ffe27a'),2);},
  espada(e,t,P,r){ctx.rotate(Math.atan2(e.vy||1,e.vx||0)-Math.PI/2);poly([[-r*.25,-r*1.6],[r*.25,-r*1.6],[r*.25,r*.6],[0,r*1.6],[-r*.25,r*.6]],P('#b9d4e8'),2.5);rr(-r*.8,-r*1.75,r*1.6,r*.3,2,P('#d9a441'),2);rr(-r*.18,-r*2.4,r*.36,r*.65,2,P('#7a2e3a'),2);circ(0,-r*2.5,r*.22,P('#d9a441'),2);},
  carrete(e,t,P,r){ctx.rotate((e.x||0)/r);circ(0,0,r,P('#3a3440'),3);circ(0,0,r*.32,P('#c9c2d6'),2.5);for(let i=0;i<5;i++){const a=i*TAU/5;circ(Math.cos(a)*r*.62,Math.sin(a)*r*.62,r*.18,P('#1a1620'),1.5);}},
  pelicula(e,t,P,r){ctx.rotate(Math.atan2(e.vy||0,e.vx||1)+Math.sin(t*14)*.2);rr(-r*1.4,-r*.7,r*2.8,r*1.4,2,P('#2b2a33'),2.5);for(let i=0;i<4;i++){rr(-r*1.25+i*r*.7,-r*.62,r*.3,r*.22,1,'#efe0bf',0);rr(-r*1.25+i*r*.7,r*.4,r*.3,r*.22,1,'#efe0bf',0);}rr(-r*.9,-r*.32,r*1.8,r*.64,1,P('#c9b48a'),1.5);},
  rollo(e,t,P,r){ctx.rotate(t*3);circ(0,0,r,P('#e8562e'),3.5);circ(0,0,r*.3,'#fff6df',2.5);for(let i=0;i<6;i++){const a=i*TAU/6;circ(Math.cos(a)*r*.64,Math.sin(a)*r*.64,r*.17,'#1a1620',1.5);}ctx.rotate(-t*3);btxt('?',r*.9,-r*.9,r*.7,C.gold,'center',900);},
  sbala(e,t,P,r){ctx.rotate(t*10);star(0,0,r,r*.45,5,0);ctx.fillStyle=P('#120e18');ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=e.parry&&!(e.cool>0)?C.parryL:'#efe0bf';ctx.stroke();},
  burbuja(e,t,P,r){circ(0,0,r,P('rgba(230,200,220,.55)'),2.5);ell(-r*.35,-r*.35,r*.25,r*.15,'rgba(255,255,255,.85)',0,-.5);}};
const _drawSprD=drawSpr;
drawSpr=function(e,t){if(e.gray){ctx.save();ctx.filter='grayscale(1) contrast(1.25)';}const f=SPRD[e.spr];
  if(!f)_drawSprD(e,t);else{const pc=e.parry&&!(e.cool>0),r=e.r||12,P=c=>pc?C.parry:c;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;f(e,t,P,r);ctx.restore();
    if(pc&&!e.harmless){ctx.beginPath();ctx.arc(e.x,e.y,r+7+Math.sin(t*12)*2,0,TAU);ctx.lineWidth=2.5;ctx.strokeStyle='rgba(159,240,230,.85)';ctx.stroke();}
    if(pc&&e.harmless){ctx.save();ctx.globalAlpha=.6+Math.sin(t*10)*.3;ctx.beginPath();ctx.arc(e.x,e.y,r+10,0,TAU);ctx.lineWidth=3;ctx.strokeStyle=C.gold;ctx.stroke();ctx.restore();}}
  if(e.gray)ctx.restore();};

/* ---------- stages ---------- */
function dlcSeats(g,y,col,n=16){for(let i=0;i<n;i++){const x=i*(W/n)+W/n/2;gR(g,x-24,y,48,50,col,3,12);gR(g,x-26,y+30,52,14,'#2a1a14',3,4);}}
Object.assign(ACZ,{
  cine_sala(g){g.fillStyle='#1c0f12';g.fillRect(0,0,W,H);/* the screen */gR(g,170,40,620,300,'#e9e2d2',6,6);const sg=g.createRadialGradient(480,190,40,480,190,380);sg.addColorStop(0,'rgba(255,250,230,.6)');sg.addColorStop(1,'rgba(120,110,90,.25)');g.fillStyle=sg;g.fillRect(173,43,614,294);
    for(const s of[-1,1]){const x0=s<0?0:W;g.beginPath();g.moveTo(x0,0);for(let y=0;y<=H;y+=14)g.lineTo(x0-s*(150+Math.sin(y*.04)*10),y);g.lineTo(x0,H);g.closePath();g.fillStyle='#7a1f22';g.fill();g.lineWidth=5;g.strokeStyle=C.ink;g.stroke();for(let i=1;i<6;i++){g.beginPath();g.moveTo(x0-s*i*24,0);g.lineTo(x0-s*i*24,H);g.lineWidth=2;g.strokeStyle='rgba(0,0,0,.3)';g.stroke();}}
    gR(g,140,10,680,30,'#7a1f22',5,4);for(let i=0;i<12;i++)gE(g,170+i*56,40,14,10,'#7a1f22',3);
    g.fillStyle='#2a1612';g.fillRect(0,GROUND,W,H-GROUND);dlcSeats(g,GROUND+20,'#8a2a2a');g.fillStyle=C.ink;g.fillRect(0,GROUND,W,5);
    gR(g,W-150,12,110,60,'#2a1a14',4,6);gE(g,W-120,42,14,14,'#fff3c4',3);},
  naipes(g){g.fillStyle='#1d4a35';g.fillRect(0,0,W,H);const r=srand(77);for(let i=0;i<1800;i++){g.fillStyle=r()<.5?'rgba(255,255,255,.04)':'rgba(0,0,0,.06)';g.fillRect(r()*W,r()*H,2,2);}
    for(let i=0;i<9;i++){const x=40+i*110,y=60+(i%3)*30,a=(r()-.5)*.6;g.save();g.translate(x,y);g.rotate(a);gR(g,-34,-48,68,96,'#fbf6ea',3.5,8);g.font=`24px ${FONT}`;g.textAlign='center';g.fillStyle=i%2?'#b5402f':'#1d1a1a';g.fillText('♠♥♦♣'[i%4],0,10);g.restore();}
    gR(g,-10,GROUND-20,W+20,30,'#7c4f2c',5,8);g.fillStyle='#14301f';g.fillRect(0,GROUND+10,W,H);g.fillStyle=C.ink;g.fillRect(0,GROUND,W,5);
    const v=g.createRadialGradient(W/2,H/2,140,W/2,H/2,620);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=v;g.fillRect(0,0,W,H);},
  cine_vacio(g){g.fillStyle='#e8e2d4';g.fillRect(0,0,W,H);const r=srand(5);g.strokeStyle='rgba(30,25,20,.35)';for(let i=0;i<22;i++){g.lineWidth=1+r()*2;const x=r()*W;g.beginPath();g.moveTo(x,0);g.lineTo(x+(r()-.5)*30,H);g.stroke();}
    for(let i=0;i<60;i++){g.fillStyle=`rgba(30,25,20,${.1+r()*.3})`;g.beginPath();g.arc(r()*W,r()*H,r()*3,0,TAU);g.fill();}g.fillStyle='#cfc6b4';g.fillRect(0,GROUND,W,H-GROUND);g.fillStyle=C.ink;g.fillRect(0,GROUND,W,5);
    const v=g.createRadialGradient(W/2,H/2,120,W/2,H/2,560);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(20,15,10,.7)');g.fillStyle=v;g.fillRect(0,0,W,H);}});

/* ---------- PARRY-ONLY: the cards can only be hurt by parrying their pink things ---------- */
const _setupArenaPO=setupArena;
setupArena=function(L,B,def,plane){_setupArenaPO(L,B,def,plane);if(!def.parryOnly)return;L.noShoot=true;const d0=B.damage;
  B.damage=(d,p)=>{if(!B._ph){if(L.t-(B.poT||0)>1.4&&L.state==='play'){B.poT=L.t;const c=B.center();pop(L,c.x,c.y-130,'¡SOLO PARRY!',C.parryL);}return;}d0(d,p);};};
const _doParryPO=doParry;
doParry=function(L,p,o){_doParryPO(L,p,o);const B=L.boss;if(!B||B.dead||!B.def)return;
  if(B.def.parryOnly&&o&&!o.maus){B._ph=true;const was=B.hp;B.damage(B.max/B.def.hits+.01,p);B._ph=false;if(B.hp<was){const c=B.center();shake(L,12);boom(L,c.x,c.y,50);sfx('hitBig');pop(L,c.x,c.y-150,pick(['¡ZAS!','¡TOMA!','¡CORTE!','¡BARAJA!']),C.gold);B.squash=.4;}}
  if(o&&o.secret&&B.def.id==='proyec'){L.secretN=(L.secretN||0)+1;sfx('campanita');pop(L,o.x,o.y-40,`ROLLO PERDIDO ${L.secretN}/3`,C.gold);if(L.secretN===3){banner(L,'¡ENCONTRASTE EL ROLLO PERDIDO!',2);sfx('reverso');}}};

/* the playing-card body shared by the four cards */
const SUIT={bastos:{col:'#5f8a3a',ink:'#2f4a1c'},copas:{col:'#b5402f',ink:'#6b1f1a'},oros:{col:'#d9a441',ink:'#7a5a1a'},espadas:{col:'#3a72b0',ink:'#1f3a5e'}};
function drawSuit(s,x,y,k,t){ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.lineJoin='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  if(s==='bastos'){ctx.rotate(-.5);rr(-6,-26,12,52,6,'#8a5a32',3);for(const y2 of[-14,0,14])circ(6,y2,4,'#6b4228',2);ell(-2,-26,10,6,'#5f8a3a',2.5);}
  else if(s==='copas'){ctx.beginPath();ctx.moveTo(-16,-16);ctx.quadraticCurveTo(-16,6,0,6);ctx.quadraticCurveTo(16,6,16,-16);ctx.closePath();ctx.fillStyle='#d9a441';ctx.fill();ctx.stroke();rr(-3,6,6,10,1,'#a8772a',2);rr(-10,16,20,5,2,'#a8772a',2);}
  else if(s==='oros'){circ(0,0,17,'#f2c14e',3);circ(0,0,10,null,2);for(let i=0;i<8;i++){const a=i*TAU/8+t;line(Math.cos(a)*4,Math.sin(a)*4,Math.cos(a)*9,Math.sin(a)*9,2);}}
  else{poly([[-4,-26],[4,-26],[4,10],[0,20],[-4,10]],'#b9d4e8',2.5);rr(-12,-28,24,5,2,'#d9a441',2);rr(-3,-38,6,10,2,'#7a2e3a',2);}ctx.restore();}
function drawCardBoss(B,L,o){const x=B.x,y=B.y-(o.float||0),t=B.t,S=SUIT[o.suit],w=150,h=220,hop=Math.abs(Math.sin(t*(B.act?10:4)))*(o.float?0:8);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  if(!o.float)shadowE(x,GROUND+3,80,.3);bossSquash(B,L);ctx.translate(0,-hop);
  if(!o.float)for(const s of[-1,1]){hose(x+s*34,y-8,x+s*44,y-36+Math.sin(t*8+s)*4,x+s*40,y-6,8);ell(x+s*42,y-4,16,7,'#1a1418',2.5);}
  const top=y-h-30;ctx.save();ctx.translate(x,top+h/2);ctx.rotate(Math.sin(t*2)*.04);ctx.translate(-x,-(top+h/2));
  rr(x-w/2+6,top+6,w,h,16,'rgba(0,0,0,.35)',0);rr(x-w/2,top,w,h,16,'#fbf6ea',5);rr(x-w/2+10,top+10,w-20,h-20,10,null,2.5);ctx.strokeStyle=S.col;ctx.lineWidth=2;ctx.strokeRect(x-w/2+16,top+16,w-32,h-32);
  btxt(o.num,x-w/2+22,top+30,26,S.ink,'center',900);drawSuit(o.suit,x-w/2+22,top+58,.6,t);ctx.save();ctx.translate(x+w/2-22,top+h-30);ctx.rotate(Math.PI);btxt(o.num,0,0,26,S.ink,'center',900);ctx.restore();drawSuit(o.suit,x+w/2-22,top+h-58,.6,t);
  /* the portrait in the middle */
  rr(x-48,top+46,96,120,10,S.col,3.5);rr(x-42,top+52,84,108,8,'#fbe6cf',2.5);if(o.crown)poly([[x-30,top+62],[x-30,top+46],[x-18,top+56],[x,top+40],[x+18,top+56],[x+30,top+46],[x+30,top+62]],'#f2c14e',3);
  if(o.hair)ell(x,top+70,40,16,o.hair,3);bossFace(B,L,x,top+104,.55,{gap:24,ew:11,eh:14,my:30,mw:24,open:B.mouth>0?.9:.3});if(o.beard){ctx.beginPath();ctx.moveTo(x-26,top+118);ctx.quadraticCurveTo(x,top+168,x+26,top+118);ctx.fillStyle=o.beard;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}
  rr(x-40,top+168,80,24,6,S.col,3);btxt(o.title,x,top+180,13,'#fbf6ea','center',900);ctx.restore();
  /* arms and the prop */
  const ty=top+h*.55,thr=B.throwT>0?1:0;hose(x-w/2+4,ty,x-w/2-30,ty+10,x-w/2-40,ty-24-thr*30,8);glove(x-w/2-40,ty-24-thr*30,13);
  hose(x+w/2-4,ty,x+w/2+30,ty+16,x+w/2+34,ty-10+Math.sin(t*3)*6,8);glove(x+w/2+34,ty-10+Math.sin(t*3)*6,13);drawSuit(o.suit,x+w/2+40,ty-34+Math.sin(t*3)*6,1.3,t);
  const c=B.center();flashOver(B,c.x,c.y,90);koStars(B,L,c.x,top-20);
  /* hit pips: how many parries are left */
  const left=Math.ceil(B.hp/(B.max/B.def.hits)-.001);for(let i=0;i<B.def.hits;i++)circ(x-(B.def.hits-1)*9+i*18,top-14,6,i<left?C.parry:'rgba(20,13,8,.2)',2);ctx.restore();}
const cardAnchor=(B,n,float)=>{const top=B.y-(float||0)-250;if(n==='hand')return{x:B.x-115,y:top+110};if(n==='prop')return{x:B.x+115,y:top+90};if(n==='top')return{x:B.x,y:top};if(n==='foot')return{x:B.x-70,y:GROUND};return null;};

/* bubbles that rise from the floor; one in three is pink */
ATK.burbujas=function(L,B,a){const n=a.n||3,pk=Math.floor(rand()*n);for(let i=0;i<n;i++){const x=80+rand()*(W-260);spawnEB(L,{k:'shot',x,y:GROUND+10,vx:(rand()-.5)*30,vy:-(a.spd||110),r:16,spr:'burbuja',parry:i===pk,life:7});}sfx('pop');};

defBoss({id:'sota',name:'Sota de Bastos',sub:'Baraja · Solo parry',isl:3,hp:100,par:80,arena:'naipes',song:'sota',x:720,intro:'¡A PALOS, COMPADRE!',parryOnly:true,hits:6,noEntrance:false,
  center(B){return{x:B.x,y:B.y-140};},anchor(B,n){return cardAnchor(B,n,0);},shapes(B){return[{x:B.x-75,y:B.y-250,w:150,h:220}];},faceTarget:true,
  phases:[{atk:[{f:'lob',every:1.6,from:'prop',n:1,spr:'basto',r:14,parry:2,T:1.1},{f:'roller',every:2.7,from:'foot',spr:'basto',r:22,spd:380},{f:'leap',every:4.6,vy:-1100,T:1.05,landWave:true}]},
    {banner:'¡A GARROTAZOS!',atk:[{f:'lob',every:1.4,from:'prop',n:2,spr:'basto',r:14,parry:2,T:1.05},{f:'rain',every:3,n:4,spr:'basto',r:13,spd:[260,340]},{f:'leap',every:3.6,vy:-1150,T:1,landWave:true},{f:'roller',every:3.2,from:'foot',spr:'basto',r:22,spd:420,hop:480}]}],
  draw(B,L){drawCardBoss(B,L,{suit:'bastos',num:'10',title:'SOTA',hair:'#7a4a2a'});}});
defBoss({id:'reina',name:'Reina de Copas',sub:'Baraja · Solo parry',isl:3,hp:100,par:80,arena:'naipes',song:'reina',x:700,y:GROUND,intro:'¡UN BRINDIS POR TU DERROTA!',parryOnly:true,hits:6,
  center(B){return{x:B.x,y:B.y-140-B.fl};},anchor(B,n){if(n==='center')return{x:B.x,y:B.y-140-B.fl};return cardAnchor(B,n,B.fl);},shapes(B){return[{x:B.x-75,y:B.y-250-B.fl,w:150,h:220}];},
  setup(B){B.fl=90;},move(B,dt){B.fl=90+Math.sin(B.t*1.4)*24;B.x=lerp(B.x,680+Math.sin(B.t*.5)*90,Math.min(1,dt*1.5));},
  phases:[{atk:[{f:'rain',every:2.4,n:6,spr:'gota',r:11,spd:[220,300]},{f:'burbujas',every:2.3,n:3,spd:105},{f:'aimed',every:2.8,from:'prop',n:1,spd:300,spr:'copa',r:15,parry:3}]},
    {banner:'¡SALUD!',atk:[{f:'spiral',every:3.6,from:'center',dur:1.3,rate:.1,spd:200,spr:'gota',r:10,arms:2},{f:'burbujas',every:2,n:4,spd:120},{f:'sweep',every:4.2,low:true,style:'light',warn:.9},{f:'aimed',every:2.6,from:'prop',n:2,spread:.3,spd:300,spr:'copa',r:14,parry:2}]}],
  draw(B,L){drawCardBoss(B,L,{suit:'copas',num:'11',title:'REINA',crown:true,hair:'#e8b46a',float:B.fl});}});
defBoss({id:'rey',name:'Rey de Oros',sub:'Baraja · Solo parry',isl:3,hp:100,par:80,arena:'naipes',song:'rey',x:740,intro:'¡TODO EL ORO ES MÍO!',parryOnly:true,hits:6,
  center(B){return{x:B.x,y:B.y-140};},anchor(B,n){return cardAnchor(B,n,0);},shapes(B){return[{x:B.x-75,y:B.y-250,w:150,h:220}];},
  phases:[{atk:[{f:'bouncer',every:2.4,from:'prop',spr:'oro',r:18,max:3,spd:340,life:6},{f:'roller',every:3,from:'foot',spr:'oro',r:30,spd:330,parry:2},{f:'rain',every:3.4,n:5,spr:'oro',r:12,spd:[240,320]}]},
    {banner:'¡LLUVIA DE MONEDAS!',atk:[{f:'ring',every:3.2,from:'top',n:10,spd:200,spr:'oro',r:12,parry:4},{f:'roller',every:2.5,from:'foot',spr:'oro',r:30,spd:380,parry:2,hop:420},{f:'column',every:3.6,n:2,gap:.5,style:'stamp',w:70,warn:.8},{f:'bouncer',every:3,from:'prop',spr:'oro',r:18,max:3,spd:360,life:6}]}],
  draw(B,L){drawCardBoss(B,L,{suit:'oros',num:'12',title:'REY',crown:true,hair:'#d8d0c0',beard:'#e8e0d0'});}});
defBoss({id:'as',name:'As de Espadas',sub:'Baraja · Solo parry · La carta final',isl:3,hp:100,par:95,arena:'naipes',song:'as',x:720,intro:'¡EN GUARDIA!',parryOnly:true,hits:8,
  center(B){return{x:B.x,y:B.y-140};},anchor(B,n){return cardAnchor(B,n,0);},shapes(B){return[{x:B.x-75,y:B.y-250,w:150,h:220}];},faceTarget:true,
  phases:[{atk:[{f:'column',every:2.8,n:3,gap:.3,style:'needle',warn:.75,spread:160},{f:'aimed',every:2,from:'prop',n:3,spread:.22,spd:360,spr:'espada',r:13,parry:3},{f:'tele',every:5,minx:300,maxx:800}]},
    {banner:'¡A MUERTE!',atk:[{f:'sweep',every:3,alt:true,style:'light',warn:.8},{f:'charge',every:5.2,spd:820},{f:'aimed',every:1.9,from:'prop',n:3,spread:.25,spd:380,spr:'espada',r:13,parry:2},{f:'column',every:3.4,n:4,gap:.25,style:'needle',warn:.7,spread:140}]}],
  draw(B,L){drawCardBoss(B,L,{suit:'espadas',num:'1',title:'AS',hair:'#2b2420'});}});

/* ---------- EL PROYECCIONISTA ---------- */
const MONTAJE=[['reloj','El Despertador'],['gramo','El Gramófono'],['faro','El Faro'],['chistera','El Gran Chistera'],['ballena','La Ballena'],['radio','Radio Medianoche'],['hollin','Hollín'],['tombola','Don Tómbola']];
const MONT_F=['ring','aimed','rain','spiral','lob','ring','aimed','spiral'];
ATK.montaje=function(L,B,a){B.mi=((B.mi??-1)+1)%MONTAJE.length;const [id,name]=MONTAJE[B.mi],d=LEVELS[id];B.reel={name,t:0};sfx('proyector');sfx('estreno');
  const src=d&&d.phases?d.phases.flatMap(ph=>ph.atk||[]).find(x=>x.spr):null,spr=src?src.spr:'pelicula',r=Math.min(14,(src&&src.r)||12),f=MONT_F[B.mi%MONT_F.length],n0=L.eb.length;
  const spec={f,from:'lens',spr,r,parry:4,n:f==='ring'?11:f==='rain'?6:3,spread:.25,spd:f==='rain'?[240,320]:260,dur:1.4,rate:.1,arms:2,T:1.1,bounce:1};ATK[f](L,B,spec);
  B.queue.push({t:.9,fn:()=>{const n1=L.eb.length;ATK[f](L,B,spec);for(let i=n1;i<L.eb.length;i++)L.eb[i].gray=true;}});for(let i=n0;i<L.eb.length;i++)L.eb[i].gray=true;};
ATK.rolloPerdido=function(L,B,a){if((L.secretN||0)>=3)return;const d=rand()<.5?1:-1;spawnEB(L,{k:'shot',x:d>0?-30:W+30,y:70+rand()*50,vx:d*120,vy:0,r:16,spr:'rollo',parry:true,harmless:true,secret:true,life:10});};
defBoss({id:'proyec',name:'El Proyeccionista',sub:'Jefe · Cine Fantasma',isl:3,hp:760,par:150,arena:'cine_sala',song:'proyec',x:760,intro:'¡SE APAGAN LAS LUCES… COMIENZA LA FUNCIÓN!',
  center(B){return{x:B.x,y:B.y-200};},anchor(B,n){if(n==='lens')return{x:B.x-62,y:B.y-262};if(n==='hand')return{x:B.x-90,y:B.y-160};if(n==='foot')return{x:B.x-40,y:GROUND};return null;},
  shapes(B){return[{x:B.x,y:B.y-250,r:66},{x:B.x-40,y:B.y-180,w:80,h:180}];},
  phases:[{atk:[{f:'sweep',every:3.4,alt:true,style:'light',warn:.85},{f:'roller',every:2.8,from:'foot',spr:'carrete',r:24,spd:380},{f:'aimed',every:2,from:'lens',n:3,spread:.2,spd:330,spr:'pelicula',r:12,parry:3}]},
    {banner:'¡ROLLO DE RECUERDOS!',atk:[{f:'montaje',every:4.6,delay:1},{f:'aimed',every:2.6,from:'lens',n:2,spread:.3,spd:330,spr:'pelicula',r:12,parry:3},{f:'roller',every:4,from:'foot',spr:'carrete',r:24,spd:420,hop:420}]},
    {banner:'¡SE QUEMA LA CINTA!',atk:[{f:'column',every:3,n:2,gap:.4,style:'fire',w:80,warn:.8},{f:'spiral',every:3.8,from:'lens',dur:1.5,rate:.09,spd:220,spr:'pelicula',r:11,arms:3,parry:6},{f:'rolloPerdido',every:6.5,delay:2,noAct:true},{f:'sweep',every:4.4,alt:true,style:'light',warn:.8}]}],
  draw(B,L){const x=B.x,y=B.y,t=B.t,hot=B.phase===2;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';shadowE(x,GROUND+3,70,.35);bossSquash(B,L);
    for(const s of[-1,1]){line(x+s*18,y-110,x+s*24+Math.sin(t*3+s)*4,y-6,9);ell(x+s*30,y-4,20,8,'#1a1418',2.5);}
    rr(x-48,y-200,96,100,14,'#2b2a33',4.5);poly([[x-14,y-200],[x,y-160],[x+14,y-200]],'#fbf6ea',3);poly([[x-10,y-196],[x,y-186],[x+10,y-196]],C.rust,2);for(const yy of[y-150,y-130])circ(x,yy,4,C.gold,2);
    hose(x+44,y-180,x+80,y-150,x+70,y-230,8);glove(x+70,y-230,12);hose(x-44,y-180,x-80,y-150,x-90,y-170+(B.throwT>0?-30:0),8);glove(x-90,y-170+(B.throwT>0?-30:0),12);
    /* projector head with two spinning reels */
    rr(x-62,y-300,124,94,14,hot?'#4a3a3a':'#3a3a44',5);rr(x-56,y-294,112,82,10,null,2);for(const [dx,s] of[[-30,1],[30,-1]]){ctx.save();ctx.translate(x+dx,y-330);ctx.rotate(t*(B.phase+1)*3*s);circ(0,0,32,'#2b2a33',4);circ(0,0,10,'#c9c2d6',3);for(let i=0;i<5;i++){const a=i*TAU/5;circ(Math.cos(a)*20,Math.sin(a)*20,6,'#14101a',2);}ctx.restore();}
    line(x-30,y-330,x+30,y-330,3,'rgba(201,194,214,.8)');rr(x-92,y-282,34,40,6,'#5a5a66',4);const lg=.6+Math.sin(t*10)*.2;circ(x-92,y-262,22,'#1a1418',4);circ(x-92,y-262,15,`rgba(255,240,180,${lg})`,0);circ(x-96,y-266,5,'#fff',0);
    ell(x-24,y-262,10,13,'#fff',3);ell(x+16,y-262,10,13,'#fff',3);const lk=lookAt(L,x,y-262);circ(x-24+lk.x*4,y-260+lk.y*4,4,C.ink,0);circ(x+16+lk.x*4,y-260+lk.y*4,4,C.ink,0);
    ctx.beginPath();ctx.moveTo(x-30,y-236);ctx.quadraticCurveTo(x-6,y-224+(B.mouth>0?10:0),x+22,y-236);ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();
    if(hot&&rand()<.4)L.fx.push({k:'smoke',x:x+(rand()-.5)*80,y:y-340,vx:(rand()-.5)*40,vy:-80,life:.8,max:.8,r:10,col:'#6a6070'});
    const c=B.center();flashOver(B,c.x,c.y-60,80);koStars(B,L,c.x,y-380);ctx.restore();}});
/* the screen behind him plays the current reel; a flickering projector beam crosses the hall */
function proyecFx(L,B){const dw=L.drawBG;L.drawBG=()=>{dw();const t=L.t;ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=`rgba(255,240,200,${.05+Math.sin(t*23)*.015})`;ctx.beginPath();ctx.moveTo(W-95,42);ctx.lineTo(173,43);ctx.lineTo(173,337);ctx.closePath();ctx.fill();ctx.restore();
    if(Math.sin(t*31)>.92){ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(173,43,614,294);}
    if(B.reel){B.reel.t+=1/60;const k=Math.min(1,B.reel.t*3),a=Math.max(0,1-Math.max(0,B.reel.t-3.5));ctx.save();ctx.globalAlpha=a*.85;ctx.fillStyle='#1d1a1a';ctx.fillRect(173,43,614,294);ctx.globalAlpha=a;rr(300,120,360,140,10,null,4);ctx.strokeStyle='#efe0bf';ctx.lineWidth=3;ctx.strokeRect(312,132,336,116);
      btxt('ROLLO '+(B.mi+1),480,160,18,'#efe0bf','center',900);txt(B.reel.name,480,200,30*k,'#efe0bf',null);ctx.restore();}
    if(B.phase===2){for(let i=0;i<5;i++){const x=180+((i*137+t*30)%600),y=330-((t*60+i*70)%280);ctx.globalAlpha=.6;circ(x,y,14+Math.sin(t*9+i)*4,'#2a1612',0);ctx.globalAlpha=1;}const f=.5+Math.sin(t*15)*.2;ctx.fillStyle=`rgba(255,120,40,${.12*f})`;ctx.fillRect(173,300,614,37);}};}

/* ---------- LA SOMBRA (secret): your own shadow stepped out of the film ---------- */
const FILTER_SET=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'filter');
function drawSilhouette(B,L,x,y,s,alpha){const P=L.Ps.find(p=>!p.dead)||L.Ps[0],ch=P?P.char:'chispa';ctx.save();ctx.globalAlpha=alpha;try{FILTER_SET.set.call(ctx,'brightness(0)');}catch(_){}
  drawHero({x,y,char:ch,face:B.face||-1,anim:B.t*(B.run?10:3),scale:s,run:B.run,air:B.air,vy:B.vy||0,shoot:B.throwT>0,aimX:B.face||-1,aimY:0,noBlink:true});try{FILTER_SET.set.call(ctx,'none');}catch(_){}ctx.restore();
  const ey=y-80*s,fx=x+(B.face||-1)*5*s;for(const d of[-1,1])ell(fx+d*6*s,ey,2.6*s,4*s,'#fff',0);ctx.beginPath();ctx.moveTo(fx-6*s,ey+8*s);ctx.quadraticCurveTo(fx,ey+13*s,fx+6*s,ey+8*s);ctx.lineWidth=1.4*s;ctx.strokeStyle='#fff';ctx.stroke();ctx.save();ctx.globalAlpha=.25*alpha;circ(x,y-50*s,60*s,'#4a3a6a',0);ctx.restore();}
defBoss({id:'sombra',name:'Tu Sombra',sub:'Jefe secreto · Detrás de la pantalla',isl:3,hp:680,par:140,arena:'cine_vacio',song:'sombra',x:720,intro:'…',
  center(B){return B.giant?{x:B.gx,y:200}:{x:B.x,y:B.y-90};},anchor(B,n){if(B.giant){if(n==='hand')return{x:B.gx+(B.face||-1)*180,y:260};return{x:B.gx,y:180};}if(n==='hand')return{x:B.x+(B.face||-1)*60,y:B.y-80};return{x:B.x,y:B.y-90};},
  shapes(B){return B.giant?[{x:B.gx,y:220,r:120}]:[{x:B.x,y:B.y-80,r:60}];},faceTarget:true,
  setup(B){B.gx=480;B.vy=0;},
  move(B,dt,L){const P=L.Ps.find(p=>!p.dead);B.run=false;if(!P||B.giant)return;const dx=P.x-B.x;if(Math.abs(dx)>260){B.x+=Math.sign(dx)*170*dt;B.run=true;}else if(Math.abs(dx)<140){B.x-=Math.sign(dx)*150*dt;B.run=true;}B.x=clamp(B.x,90,W-90);B.face=dx<0?-1:1;},
  onPhase(B,L,i){if(i===2){B.giant=true;B.gx=480;L.permDark=()=>!B.dead;L.darkA=.82;sfx('rasgado');}},
  phases:[{atk:[{f:'aimed',every:.85,from:'hand',n:1,spd:520,spr:'sbala',r:10,parry:5},{f:'leap',every:3.2,vy:-1050,T:.95},{f:'charge',every:4.6,spd:780,warn:.6}]},
    {banner:'¡SOMOS DOS!',atk:[{f:'aimed',every:1,from:'hand',n:2,spread:.18,spd:500,spr:'sbala',r:10,parry:4},{f:'minion',every:5,from:'hand',ai:'hopper',skin:'sombrita',hp:6,r:24,max:2,spd:170},{f:'ring',every:3.6,from:'center',n:10,spd:210,spr:'sbala',r:10,parry:5},{f:'leap',every:3.8,vy:-1100,T:1}]},
    {banner:'¡LA SOMBRA GIGANTE!',atk:[{f:'sweep',every:3,alt:true,style:'darkbolt',warn:.85},{f:'column',every:3.2,n:3,gap:.3,style:'darkbolt',warn:.75,spread:170},{f:'spiral',every:4,from:'center',dur:1.5,rate:.09,spd:220,spr:'sbala',r:10,arms:3,parry:6},{f:'aimed',every:1.6,from:'hand',n:3,spread:.25,spd:420,spr:'sbala',r:10,parry:3}]}],
  draw(B,L){if(B.giant){B.gx=lerp(B.gx,480+Math.sin(B.t*.4)*160,.02);drawSilhouette(B,L,B.gx,GROUND+40,3.6,.9);const c=B.center();flashOver(B,c.x,c.y,120);koStars(B,L,c.x,60);return;}
    shadowE(B.x,GROUND+3,50,.4);ctx.save();bossSquash(B,L);B.air=!!(B.act&&B.act.type==='leap');drawSilhouette(B,L,B.x,B.y,1.7,1);ctx.restore();const c=B.center();flashOver(B,c.x,c.y,60);koStars(B,L,c.x,B.y-190);}});
ENC.sombrita=function(e,t,F){const b=Math.abs(Math.sin(t*9))*6;ctx.translate(0,-b);ell(0,0,20,24,F('#120e18'),3);ell(-7,-6,4,5,'#fff',0);ell(7,-6,4,5,'#fff',0);ctx.beginPath();ctx.moveTo(-8,8);ctx.quadraticCurveTo(0,4,8,8);ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();};

/* ---------- songs, taunts, levels list ---------- */
Object.assign(SONGS,{sota:nsong('reloj','Sota de Bastos',901),reina:nsong('paraguas','Reina de Copas',903),rey:nsong('baron','Rey de Oros',905),as:nsong('chistera','As de Espadas',907),proyec:nsong('radio','El Proyeccionista',909),sombra:nsong('apagon','Tu Sombra',911),cine:nsong('shop','Cartelera',913)});
Object.assign(PACK,{sota:['pd-sota',"Four O'Clock Blues — Original Memphis Five (1922)",'pd'],reina:['pd-reina','Limehouse Blues — Roseland Dance Orchestra (1924)','pd'],rey:['pd-rey',"Strutter's Drag — Fletcher Henderson Orchestra (1924)",'pd'],as:['pd-as','London Café Blues — King Oliver\'s Creole Jazz Band (1923)','pd'],
  proyec:['pd-proyec','Tiger Rag — Friars Society Orchestra (1922)','pd'],sombra:['pd-sombra','Tin Roof Blues — New Orleans Rhythm Kings (1923)','pd'],cine:['pd-cine','Wild Cherry Rag — Frank Banta (1921)','pd'],
  casino:['pd-casino','Red Jacket Blues — Harold Leonard and His Red Jackets (1922)','pd'],tombola:['pd-tombola','Wang Wang Blues — Tim Brymn\'s Black Devil Orchestra (1921)','pd'],topo:['pd-topo','House of David Blues — The Broadway Syncopaters (1923)','pd']});
Object.assign(PACK_FINAL,{proyec:['pd-proyec-f',"Sobbin' Blues — The Broadway Broadcasters (1922)",'pd'],sombra:['pd-sombra-f',"Farewell Blues — Lada's Orchestra (1923)",'pd']});
Object.assign(TAUNTS,{sota:['¡Con este palo te mando al mazo!','¡A garrotazos, compadre!','¡Me barajaron mal!'],reina:['¡Un brindis… por tu derrota!','¡Salud! ¡Y cuidado con las gotas!','¡Se me derramó la copa!'],
  rey:['¡Todo el oro del reino es mío!','¡Que lluevan las monedas!','¡Me dejaron sin un centavo!'],as:['¡La carta más alta de la baraja!','¡En guardia, a muerte!','¡Me ganaron la mano!'],
  proyec:['¡Silencio en la sala! Comienza la función.','¡Un rollo de recuerdos para ti!','¡La cinta se quema!','¡Fin de la película!'],sombra:['…','Yo hago todo lo que tú haces.','Sin luz no hay sombra…']});
const DLC_IDS=['sota','reina','rey','as','proyec','sombra'];for(const k of DLC_IDS)if(!ALL_LEVELS.includes(k))ALL_LEVELS.push(k);
/* hook the projector's screen fx when his level is built */
{const c=LEVELS.proyec.create;LEVELS.proyec.create=(...a)=>{const L=c(...a);if(L&&L.boss)proyecFx(L,L.boss);return L;};}
MECH_INFO.sota=MECH_INFO.reina=MECH_INFO.rey='Solo parry: no puedes disparar, haz parry a lo rosado para golpear';MECH_INFO.as='Solo parry · la carta final de la baraja';
MECH_INFO.proyec='Montaje de recuerdos y una cinta que se quema… ¿hay algo escondido en la fase 3?';MECH_INFO.sombra='Imita todo lo que haces. En la fase final, solo tu luz alumbra';

/* ---------- EL CINE FANTASMA: the billboard where you pick the show ---------- */
const CINE=[{id:'sota',suit:'bastos'},{id:'reina',suit:'copas'},{id:'rey',suit:'oros'},{id:'as',suit:'espadas',lock:()=>['sota','reina','rey'].every(k=>save.cleared[k]),hint:'Vence a las otras tres cartas'},
  {id:'proyec',lock:()=>true},{id:'sombra',lock:()=>!!(save.flags&&save.flags.sombra),hint:'¿Hay algo escondido en la película?'}];
let CN={sel:0,t:0,back:false};
LEVELS.cine={kind:'cine',name:'Cine Fantasma',sub:'DLC · La Última Función',isl:3,create:null};
function openCine(sel){CN={sel:sel??CN.sel??0,t:0};scene='cine';LV=null;Music.play('cine');sfx('estreno');}
function updCine(dt,IN){const M=IN.M;CN.t+=dt;if(M.left){CN.sel=(CN.sel+CINE.length-1)%CINE.length;sfx('naipe');}if(M.right){CN.sel=(CN.sel+1)%CINE.length;sfx('naipe');}
  if(M.no||M.pause){sfx('back');transition(toMap);return;}
  if(M.ok){const c=CINE[CN.sel],open=!c.lock||c.lock();if(!open){sfx('deny');CN.shake=.3;return;}sfx('select');const id=c.id;transition(()=>startLevel(id));}
  if(CN.shake>0)CN.shake-=dt;}
let CINEBG=null;
function drawCine(){const t=clock;if(!CINEBG){const [c,g]=mk(W,H);g.fillStyle='#1c0f12';g.fillRect(0,0,W,H);for(let i=0;i<22;i++){g.fillStyle=i%2?'#2a1418':'#24111a';g.fillRect(i*W/22,0,W/22,H);}
    gR(g,40,24,W-80,86,'#7a1f22',6,14);gR(g,56,38,W-112,58,'#f2c14e',4,8);g.fillStyle='#1c0f12';g.fillRect(0,H-90,W,90);dlcSeats(g,H-80,'#7a1f22',14);CINEBG=c;}
  ctx.drawImage(CINEBG,0,0,W,H);for(let i=0;i<=46;i++){const on=Math.floor(t*6+i)%3===0;circ(40+i*(W-80)/46,24,4,on?'#fff3c4':'#a8772a',1.5);circ(40+i*(W-80)/46,110,4,on?'#a8772a':'#fff3c4',1.5);}
  txt('CINE FANTASMA',W/2,58,34,'#7a1f22',C.ink);btxt('LA ÚLTIMA FUNCIÓN · elige la película',W/2,86,15,'#7a1f22','center',900);
  const n=CINE.length,pw=136,gap=14,x0=W/2-(n*pw+(n-1)*gap)/2;
  CINE.forEach((c,i)=>{const x=x0+i*(pw+gap),y=150,sel=i===CN.sel,open=!c.lock||c.lock(),done=save.cleared[c.id],L2=LEVELS[c.id],sh=sel&&CN.shake>0?Math.sin(CN.shake*60)*5:0;
    ctx.save();ctx.translate(x+pw/2+sh,y+120);if(sel)ctx.scale(1.08,1.08);ctx.translate(-pw/2,-120);rr(0,0,pw,240,8,'#2b1d14',4);rr(8,8,pw-16,190,4,open?'#efe0bf':'#5a4a40',3);
    if(open){if(c.suit){drawSuit(c.suit,pw/2,80,2,t);btxt(L2.name.split(' ')[0].toUpperCase(),pw/2,150,15,SUIT[c.suit].ink,'center',900);btxt('SOLO PARRY',pw/2,174,11,C.rust,'center',900);}
      else if(c.id==='proyec'){ctx.save();ctx.translate(pw/2,90);ctx.rotate(t);circ(0,0,34,'#2b2a33',3.5);circ(0,0,10,'#c9c2d6',2.5);for(let k=0;k<5;k++){const a=k*TAU/5;circ(Math.cos(a)*22,Math.sin(a)*22,6,'#14101a',2);}ctx.restore();btxt('PROYECCIONISTA',pw/2,150,13,'#2b2a33','center',900);btxt('ESTRENO',pw/2,174,11,C.rust,'center',900);}
      else{ctx.save();ctx.translate(pw/2,120);ctx.scale(.9,.9);ctx.globalAlpha=.9;try{FILTER_SET.set.call(ctx,'brightness(0)');}catch(_){}drawHero({x:0,y:0,char:heroChar(0),face:1,anim:t*3});try{FILTER_SET.set.call(ctx,'none');}catch(_){}ctx.restore();ell(pw/2+8,62,3,4,'#fff',0);ell(pw/2-2,62,3,4,'#fff',0);btxt('TU SOMBRA',pw/2,174,13,'#2b2a33','center',900);}}
    else{txt('?',pw/2,90,60,'#8a7a6a',C.ink);btxt('BLOQUEADA',pw/2,150,13,'#efe0bf','center',900);}
    btxt(done?'✔ '+(save.done[c.id]||''):'',pw/2,220,14,'#2f7d45','center',900);if(sel){ctx.globalAlpha=.6+Math.sin(t*6)*.3;rr(-4,-4,pw+8,248,10,null,4);ctx.strokeStyle=C.gold;ctx.lineWidth=4;ctx.stroke();ctx.globalAlpha=1;}ctx.restore();});
  const c=CINE[CN.sel],open=!c.lock||c.lock(),L2=LEVELS[c.id];card(W/2-300,404,600,70,'rgba(239,224,191,.95)',3.5,10);
  txt(open?L2.name:'¿¿¿???',W/2,428,22,C.rust,null);btxt(open?(MECH_INFO[c.id]||L2.sub):(c.hint||''),W/2,456,14,C.ink,'center',800);
  btxt('← → elegir · Enter ver la película · Esc salir',W/2,H-28,14,C.paper,'center',800);}
const _stepCine=step;step=function(dt){_stepCine(dt);if(scene==='cine')updCine(dt,TR?NOIN:(CZ_IN||NOIN));};
const _achCine=drawAchToast;drawAchToast=function(){if(scene==='cine')drawCine();_achCine();};
const _startLevelCine=startLevel;startLevel=function(id){if(id==='cine'){openCine();return;}_startLevelCine(id);};
const _afterLevelCine=afterLevel;
afterLevel=function(L){const id=L&&L.id;if(!id||!DLC_IDS.includes(id)){_afterLevelCine(L);return;}
  if(['sota','reina','rey','as'].every(k=>save.cleared[k]))unlockAch('baraja');
  if(id==='proyec'){unlockAch('proyec');if((L.secretN||0)>=3){save.flags.sombra=true;persist();startLevel('sombra');return;}}
  if(id==='sombra'){unlockAch('sombra');if(!save.owned.includes('skin_sombra')){save.owned.push('skin_sombra');persist();}}
  openCine(CINE.findIndex(c=>c.id===id));};
ACH.push(['baraja','Mano Ganadora','Vence a las cuatro cartas de la Baraja solo con parry.',4],['proyec','Fin de la Función','Vence al Proyeccionista.',3],['sombra','Tu Propia Sombra','Encuentra el rollo perdido y vence a tu sombra.',6]);
SKINS.skin_sombra={name:'Sombra',price:0,isl:3,desc:'Recompensa secreta: te conviertes en tu propia sombra.',filter:'brightness(.35) contrast(1.4)',tcol:'#3a2a4a'};
if(typeof refreshShopTabs==='function'){const _rst=refreshShopTabs;refreshShopTabs=function(){_rst();for(const tb of SHOP_TABS)tb.ids=tb.ids.filter(k=>k!=='skin_sombra');};refreshShopTabs();}
/* the cinema on the map of Cumbre Apagón */
addNode(3,{id:'cine',x:1540,y:880,kind:'level',ob:42,bld:'cine',em:'carrete'});WORLDS[3].roads.push(['torre','cine'],['cine','maquina']);if(typeof MAPBG!=='undefined')MAPBG={k:null};
const _drawBldCine=drawBld;
drawBld=function(n,t,night){if(n.bld!=='cine'){_drawBldCine(n,t,night);return;}const x=n.x,y=n.y;ctx.save();ctx.lineJoin='round';shadowE(x,y+2,62,.25);rr(x-56,y-80,112,80,6,'#5a2a2e',3.5);rr(x-46,y-70,92,24,4,'#2b1d14',3);
  for(let i=0;i<10;i++){const on=Math.floor(t*5+i)%2;circ(x-42+i*9.3,y-58,2.5,on?'#fff3c4':'#a8772a',1);}btxt('CINE',x,y-58,12,C.gold,'center',900);rr(x-16,y-36,32,36,3,'#1a1418',3);rr(x-50,y-40,26,30,3,'#efe0bf',2.5);rr(x+24,y-40,26,30,3,'#efe0bf',2.5);
  poly([[x-62,y-80],[x,y-118],[x+62,y-80]],'#7a1f22',3.5);ctx.save();ctx.translate(x,y-134);ctx.rotate(t*1.5);circ(0,0,16,'#2b2a33',3);circ(0,0,5,'#c9c2d6',2);for(let k=0;k<5;k++){const a=k*TAU/5;circ(Math.cos(a)*10,Math.sin(a)*10,3,'#14101a',1);}ctx.restore();
  ctx.restore();};
const _nodeLabelCine=nodeLabel;nodeLabel=function(n,w){if(n.id==='cine')return'Entrar: Cine Fantasma (DLC)';return _nodeLabelCine(n,w);};
if(window.__game)Object.assign(window.__game,{openCine,CINE:()=>CN});
