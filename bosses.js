'use strict';
/* ================= 17 BOSSES ================= */
const MS=B=>-B.face;const WX=(B,lx)=>B.x+lx*MS(B);
function mirror(B){ctx.translate(B.x,0);ctx.scale(MS(B),1);ctx.translate(-B.x,0);}
function bossSquash(B,L){const x=B.x,y=B.y,sq=B.squash||0;ctx.translate(x,y);ctx.scale(1+sq*.35,1-sq*.35);ctx.translate(-x,-y);if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);if(B.shk)ctx.translate(B.shk,0);}

/* ---------- ISLA 1 ---------- */
const relCY=B=>B.y-175+(B.act||B.dead?0:Math.sin(B.t*3)*4);
defBoss({id:'reloj',name:'El Despertador',sub:'Jefe · Torre del Reloj',isl:1,hp:330,par:95,arena:'cielo',song:'boss1',x:735,intro:'¡A LA CARGA!',
  center:B=>({x:B.x,y:relCY(B)}),
  anchor(B,n){const cy=relCY(B);if(n==='hand')return{x:B.x-90,y:cy-70};if(n==='foot')return{x:B.x-100,y:GROUND};return{x:B.x,y:cy};},
  shapes(B){const cy=relCY(B);return[{x:B.x,y:cy,r:108},{x:B.x-62,y:cy+90,w:124,h:Math.max(0,B.y-(cy+90))}];},
  move(B,dt){B.hands=(B.hands||0)+dt*(.6+B.phase*1.2);},
  phases:[
    {atk:[{f:'lob',every:1.7,from:'hand',spr:'bell',r:18,bounce:4,T:1.35,parry:3},{f:'wave',every:3.4,from:'foot',spd:430,ring:true,mouth:false}]},
    {banner:'¡SE LE CRUZARON LAS AGUJAS!',atk:[{f:'aimed',every:1.8,n:5,spread:.2,spd:330,spr:'gear',r:15,parry:5,rad:100,sfx:'knock'},{f:'wave',every:2.9,from:'foot',spd:430,ring:true},{f:'lob',every:2.6,from:'hand',spr:'bell',r:18,bounce:4,T:1.35,parry:3}]},
    {banner:'¡ÚLTIMA CAMPANADA!',atk:[{f:'leap',every:2.1,landWave:true},{f:'aimed',every:.95,n:3,spread:.28,spd:360,spr:'gear',r:15,rad:100,noAct:true,sfx:'knock'}]}],
  draw(B,L){const x=B.x,y=B.y,cy=relCY(B);
    const hgt=GROUND-y;shadowE(x,GROUND+3,Math.max(40,120-hgt*.15),B.act?.45:.28);
    if(cy+120<0)poly([[x,46],[x-14,24],[x+14,24]],C.rust);
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';bossSquash(B,L);
    const shk=B.ring>0?Math.sin(B.t*90)*3:0,walk=B.act?0:Math.sin(B.t*3)*4;
    for(const s of[-1,1]){const fx=x+s*58,fy=B.act?y-20:y;for(const [lw,col] of[[13,C.ink],[7,C.rustD]]){ctx.lineWidth=lw;ctx.strokeStyle=col;ctx.beginPath();ctx.moveTo(x+s*42,cy+92);ctx.quadraticCurveTo(x+s*(70+walk),(cy+92+fy)/2,fx,fy-12);ctx.stroke();}
      ell(fx+s*10,fy-10,34,15,C.ink,0);ell(fx+s*4,fy-16,12,4,'rgba(255,240,210,.25)',0);}
    for(const s of[-1,1]){const raise=(s<0&&B.throwT>0)?-90:0,gx=x+s*150,gy=cy+40+raise+Math.sin(B.t*3+s)*6;hose(x+s*100,cy+10,x+s*150,cy-10+raise*.4,gx,gy,8);glove(gx,gy,15);}
    for(const s of[-1,1]){ctx.save();ctx.translate(x+s*62+shk,cy-104);ctx.rotate(s*.5+(B.ring>0?Math.sin(B.t*70)*.12:0));ctx.beginPath();ctx.arc(0,0,40,Math.PI,0);ctx.lineTo(40,6);ctx.lineTo(-40,6);ctx.closePath();
      ctx.fillStyle=C.brass;ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();circ(0,-42,7,C.brass,3);ctx.restore();}
    const hx=x+(B.ring>0?Math.sin(B.t*90)*34:0);line(x,cy-112,hx,cy-150,5);circ(hx,cy-154,9,C.steel,3);
    circ(x+shk,cy,115,B.phase===2?'#97352a':C.rust,6);ctx.beginPath();ctx.arc(x+shk,cy,104,-2.6,-1.5);ctx.lineWidth=6;ctx.strokeStyle='rgba(255,220,190,.35)';ctx.stroke();
    circ(x+shk,cy,90,C.paper,4);for(let i=0;i<60;i++){const a=i*Math.PI/30,big=i%5===0,r1=big?76:82;line(x+shk+Math.cos(a)*r1,cy+Math.sin(a)*r1,x+shk+Math.cos(a)*86,cy+Math.sin(a)*86,big?3.5:1.5);}
    ctx.font=`15px ${FONT}`;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.textBaseline='middle';[['XII',0,-64],['III',64,0],['VI',0,64],['IX',-64,0]].forEach(([n,a,c])=>ctx.fillText(n,x+shk+a,cy+c));
    const cx=x+shk,hh=B.hands||0;line(cx,cy,cx+Math.cos(hh*.3-1.6)*42,cy+Math.sin(hh*.3-1.6)*42,6);line(cx,cy,cx+Math.cos(hh*3.6-1.6)*66,cy+Math.sin(hh*3.6-1.6)*66,4);circ(cx,cy,7,C.rust,3);
    bossFace(B,L,cx,cy-30,1,{gap:32,ew:18,eh:23,my:56,mw:38,open:B.ring>0||B.phase===2?.8:.25});
    flashOver(B,cx,cy,115);koStars(B,L,cx,cy-150);ctx.restore();}});

const gBell=B=>({x:600+Math.sin(B.t*1.1)*8,y:200+Math.cos(B.t*1.6)*6-(B.tilt||0)*30});
defBoss({id:'gramo',name:'Maestro Gramófono',sub:'Jefe · Teatro Melodía',isl:1,hp:400,par:115,arena:'teatro',fg:'curtains',song:'boss1b',intro:'¡QUE EMPIECE EL SHOW!',x:790,
  center:gBell,anchor(B,n){const b=gBell(B);return n==='floor'?{x:690,y:GROUND-26}:{x:b.x-40,y:b.y+20};},
  shapes(B){const b=gBell(B);return[{x:b.x,y:b.y,r:90},{x:704,y:318,w:186,h:130}];},
  move(B,dt){B.tilt=lerp(B.tilt||0,B.phase===1?1:0,Math.min(1,dt*3));B.crank=(B.crank||0)+dt*(2+B.phase*1.5);},
  phases:[
    {atk:[{f:'aimed',every:1.5,from:'mouth',speeds:[230,300,370],spr:'note',r:14,wob:90,parry:4,sfx:'honk'},{f:'roller',every:3.2,from:'floor',spd:380,r:26,spr:'disc'}]},
    {banner:'¡SUBE EL VOLUMEN!',atk:[{f:'rain',every:.62,spd:[210,270],spr:'note',r:14,sway:50,parry:3,xmin:60,xmax:660},{f:'roller',every:2.6,from:'floor',spd:430,r:26,spr:'disc',hop:620}]},
    {banner:'¡GRAN FINAL!',atk:[{f:'column',every:2.8,n:3,gap:.55,style:'needle',warn:.6,act:.38,w:28,xmax:680},{f:'aimed',every:1.35,from:'mouth',n:5,spread:.22,spd:300,spr:'note',r:14,wob:70,parry:4,sfx:'honk'}]}],
  draw(B,L){const b=gBell(B);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);shadowE(795,GROUND+3,110,.3);
    const bx=650+Math.sin(B.t*6)*18,by=340+Math.cos(B.t*6)*12;hose(708,370,670,390,bx,by,7);glove(bx,by,12);line(bx,by,bx-30,by-28,3);
    rr(704,318,186,124,6,C.wood,5);rr(718,334,158,92,4,'rgba(20,13,8,.2)',2.5);ell(797,380,30,18,C.brass,3);txt('MELODÍA',797,381,11,C.ink,null);
    for(const fx of[716,878])ell(fx,446,12,6,C.ink,0);const ca=B.crank||0;ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(890,370);ctx.lineTo(906,370);ctx.lineTo(906+Math.cos(ca)*16,370+Math.sin(ca)*16);ctx.stroke();circ(906+Math.cos(ca)*16,370+Math.sin(ca)*16,6,C.rust,2.5);
    ell(800,316,80,13,'#231812',3);ell(800,316,18,4,C.rust,0);
    for(const [lw,col] of[[34,C.ink],[24,C.brassD]]){ctx.lineWidth=lw;ctx.strokeStyle=col;ctx.beginPath();ctx.moveTo(770,312);ctx.quadraticCurveTo(770,230,b.x+62,b.y+16);ctx.stroke();}
    circ(b.x,b.y,92,B.phase===2?'#c48a33':C.brass,5);ctx.lineWidth=2.5;ctx.strokeStyle='rgba(20,13,8,.45)';for(let i=0;i<10;i++){const a=i*TAU/10+.3;ctx.beginPath();ctx.moveTo(b.x+Math.cos(a)*40,b.y+Math.sin(a)*40);ctx.quadraticCurveTo(b.x+Math.cos(a+.2)*70,b.y+Math.sin(a+.2)*70,b.x+Math.cos(a)*90,b.y+Math.sin(a)*90);ctx.stroke();}
    circ(b.x,b.y,58,'rgba(168,119,42,.6)',3);bossFace(B,L,b.x,b.y-22,.85,{gap:32,mouth:'o',my:52,mw:40,open:B.mouth});
    flashOver(B,b.x,b.y,92);if(B.dead)for(let i=0;i<3;i++){const a=L.t*4+i*2.1;txt('♪',b.x+Math.cos(a)*70,b.y-120+Math.sin(a)*14,26,C.brass);}ctx.restore();}});

defBoss({id:'baron',kind:'plane',name:'Barón Nubarrón',sub:'Jefe aéreo · Hangar del Viento',isl:1,hp:380,par:115,arena:'plane_dia',song:'plane',x:790,y:270,intro:'¡A VOLAR!',
  center:B=>({x:B.x,y:B.y}),anchor(B,n){return n==='mouth'?{x:B.x-90,y:B.y+20}:{x:B.x,y:B.y};},shapes:B=>[{x:B.x,y:B.y,r:105}],
  move(B){B.y=270+Math.sin(B.t*.8)*(B.phase===2?120:85);B.x=790+Math.sin(B.t*.5)*20;},
  phases:[
    {atk:[{f:'aimed',every:.95,from:'mouth',n:3,spread:.22,spd:300,spr:'drop',r:9,parry:5},{f:'column',every:3.3,style:'bolt',warn:.85,act:.3,w:36,xmax:W-230}]},
    {banner:'¡SE NUBLÓ!',atk:[{f:'minion',every:2.3,ai:'homer',skin:'nube',hp:4,r:22,max:4,spd:110,shoots:{rate:1.8,spd:260,spr:'drop',r:9},from:'mouth'},{f:'column',every:2.7,style:'bolt',warn:.85,act:.3,w:36,xmax:W-230},{f:'aimed',every:1.4,from:'mouth',spd:340,spr:'drop',r:9,parry:4}]},
    {banner:'¡TORMENTA ELÉCTRICA!',atk:[{f:'spiral',every:99,delay:.3,dur:99,rate:.12,step:.43,spd:230,spr:'hail',r:11,parry:9},{f:'column',every:2.3,n:2,gap:0,spread:220,style:'bolt',warn:.85,act:.3,w:36,xmax:W-230}]}],
  draw(B,L){ctx.save();ctx.translate(B.x,B.y);if(B.dead)ctx.rotate(Math.sin(L.t*30)*.05);
    const col=B.phase===2?'#9a9a94':B.phase===1?'#c2c1b4':'#e6e0cc';blob(ctx,[[-80,10,50],[-40,-40,58],[20,-50,62],[70,-10,55],[60,40,48],[0,50,55],[-60,45,44]],col,7);
    circ(-30,-60,18,'rgba(255,255,255,.35)',0);ctx.save();ctx.rotate(-.15);rr(-10,-150,70,64,4,'#2b2420',4);rr(-30,-92,110,14,7,'#2b2420',4);ctx.fillStyle=C.rust;ctx.fillRect(-8,-104,66,10);ctx.restore();
    face(-10,-12,1,{look:lookAt(L,B.x,B.y),dead:B.dead,ang:.25+B.phase*.1,mouth:'grin',my:56,mw:26,open:B.phase===2?.8:.3});
    ctx.beginPath();ctx.arc(20,-12,21,0,TAU);ctx.lineWidth=3;ctx.strokeStyle=C.brass;ctx.stroke();ctx.fillStyle=C.ink;ctx.beginPath();ctx.moveTo(-10,20);ctx.quadraticCurveTo(-34,8,-52,22);ctx.quadraticCurveTo(-32,20,-10,30);ctx.quadraticCurveTo(12,20,32,24);ctx.quadraticCurveTo(14,8,-10,20);ctx.fill();
    flashOver(B,0,0,100);ctx.restore();}});

defBoss({id:'tostada',name:'Doña Tostada',sub:'Jefe · Cocina de la Colina',isl:1,hp:360,par:105,arena:'cocina',song:'boss1b',x:740,intro:'¡A DESAYUNAR!',
  center:B=>({x:B.x,y:B.y-115}),anchor(B,n){if(n==='slot')return{x:B.x-30,y:B.y-210};if(n==='front')return{x:B.x-100,y:B.y-110};if(n==='floor')return{x:B.x-120,y:GROUND-14};return{x:B.x,y:B.y-115};},
  shapes:B=>[{x:B.x-115,y:B.y-200,w:230,h:172}],move(){},
  phases:[
    {atk:[{f:'lob',every:1.8,from:'slot',n:2,spr:'toast',r:18,T:1.2,parry:3},{f:'roller',every:3,from:'floor',spr:'butter',r:14,spd:360}]},
    {banner:'¡SE QUEMA EL PAN!',atk:[{f:'spiral',every:4.2,delay:1,dur:1.8,rate:.09,step:.5,arms:2,spd:240,spr:'jam',r:10,parry:7,from:'front'},{f:'rain',every:.5,spr:'crumb',r:8,spd:[240,300]},{f:'lob',every:2.6,from:'slot',spr:'toast',r:18,T:1.2,parry:3}]},
    {banner:'¡A TODO VAPOR!',atk:[{f:'sweep',every:3.2,low:true,style:'heat'},{f:'leap',every:3.4},{f:'aimed',every:1.6,from:'slot',n:2,spread:.3,spd:360,spr:'toast',r:16,parry:3,noAct:true}]}],
  draw(B,L){const x=B.x,y=B.y,hot=B.phase===2;shadowE(x,GROUND+3,120,.28);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    for(const s of[-1,1]){hose(x+s*60,y-32,x+s*70,y-16,x+s*70,y-6,10);ell(x+s*78,y-6,26,11,C.ink,0);}
    const pp=(B.pop||0)/.4;for(const sx of[-40,30]){const ty=y-206-pp*46-(hot?6:0);rr(x+sx-24,ty-30,48,44,12,'#d9a05b',3);rr(x+sx-18,ty-24,36,32,9,'#f0d39a',0);}
    const g=ctx.createLinearGradient(x-115,0,x+115,0);g.addColorStop(0,'#8f8b80');g.addColorStop(.3,'#e5e2d8');g.addColorStop(.6,'#c9c6bd');g.addColorStop(1,'#7d7a70');rr(x-115,y-200,230,172,34,g,6);
    if(hot){ctx.beginPath();ctx.roundRect(x-115,y-200,230,172,34);ctx.fillStyle=`rgba(240,90,40,${.22+Math.sin(L.t*10)*.08})`;ctx.fill();}
    for(const sx of[-40,30]){rr(x+sx-30,y-206,60,14,6,C.ink,0);if(hot)rr(x+sx-26,y-203,52,8,4,'#f08a2e',0);}
    ctx.save();ctx.beginPath();ctx.roundRect(x-90,y-90,180,56,10);ctx.clip();for(let i=0;i<10;i++)for(let j=0;j<4;j++){ctx.fillStyle=(i+j)%2?C.rust:C.paper;ctx.fillRect(x-90+i*18,y-90+j*14,18,14);}ctx.restore();
    rr(x-90,y-90,180,56,10,null,3);rr(x+112,y-150+(B.mouth>0?30:0),26,12,5,C.rust,3);
    bossFace(B,L,x-20,y-150,1,{gap:32,ew:16,eh:19,my:42,mw:32});circ(x-72,y-118,10,'rgba(230,120,90,.4)',0);circ(x+32,y-118,10,'rgba(230,120,90,.4)',0);
    if(hot)for(let i=0;i<3;i++){const k=(L.t*.8+i/3)%1;ctx.globalAlpha=1-k;circ(x-60+i*60,y-220-k*80,10+k*12,C.paper,2);ctx.globalAlpha=1;}
    if(B.flash>0){ctx.beginPath();ctx.roundRect(x-115,y-200,230,172,34);ctx.fillStyle='rgba(255,250,235,.45)';ctx.fill();}koStars(B,L,x,y-250);ctx.restore();}});

defBoss({id:'cascanueces',name:'General Cascanueces',sub:'Jefe · Cuarto de Juguetes',isl:1,hp:380,par:110,arena:'juguetes',song:'boss1',x:760,intro:'¡FIRMES Y A LA CARGA!',
  center:B=>({x:B.x,y:B.y-200}),anchor(B,n){if(n==='rifle')return{x:B.x-165,y:B.y-186};if(n==='mouth')return{x:B.x-30,y:B.y-236};if(n==='boot')return{x:B.x-90,y:GROUND};return{x:B.x,y:B.y-200};},
  shapes:B=>[{x:B.x-55,y:B.y-300,w:110,h:300},{x:B.x-42,y:B.y-372,w:84,h:72}],move(){},
  phases:[
    {atk:[{f:'aimed',every:1.4,from:'rifle',speeds:[420,500,580],spr:'cork',r:9,parry:4,sfx:'knock',mouth:false},{f:'rain',every:1.1,spr:'nut',r:14,track:220,spd:300}]},
    {banner:'¡FIRMES, SOLDADITOS!',atk:[{f:'minion',every:2.3,ai:'walker',skin:'soldadito',hp:3,r:22,spd:140,max:3,from:'boot',shoots:{rate:2.4,spd:240,spr:'cork',r:8}},{f:'sweep',every:3.2,low:true,style:'saber'},{f:'aimed',every:2,from:'rifle',speeds:[460],spr:'cork',r:9,parry:3,sfx:'knock'}]},
    {banner:'¡CRAC, CRAC, CRAC!',atk:[{f:'ring',every:2,from:'mouth',n:10,spd:250,spr:'shard',r:10,parry:10,sfx:'stamp'},{f:'leap',every:3.2,T:1.1},{f:'aimed',every:1.6,from:'rifle',speeds:[460,540],spr:'cork',r:9,parry:4,noAct:true}]}],
  draw(B,L){const x=B.x,y=B.y;shadowE(x,GROUND+3,90,B.act?.45:.28);if(y<-300)poly([[x,46],[x-14,24],[x+14,24]],C.rust);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    rr(x-46,y-36,40,36,8,C.ink,0);rr(x+6,y-36,40,36,8,C.ink,0);rr(x-44,y-122,36,90,6,C.white,4);rr(x+8,y-122,36,90,6,C.white,4);
    rr(x-58,y-220,116,104,10,C.rust,5);ctx.lineWidth=10;ctx.strokeStyle=C.white;ctx.beginPath();ctx.moveTo(x-54,y-214);ctx.lineTo(x+54,y-130);ctx.stroke();for(let i=0;i<4;i++)circ(x+28,y-200+i*22,5,C.gold,2);
    rr(x-58,y-130,116,14,3,C.ink,0);rr(x-10,y-132,20,18,3,C.gold,2.5);ell(x-60,y-214,20,10,C.gold,3);ell(x+60,y-214,20,10,C.gold,3);
    const rk=B.throwT>0?-.08:0;ctx.save();ctx.translate(x-60,y-186);ctx.rotate(rk);rr(-110,-8,90,14,4,C.steelD,3);rr(-30,-10,46,20,6,C.woodL,3);ctx.restore();hose(x-56,y-200,x-80,y-170,x-80,y-180,9);glove(x-80,y-182,13);
    const ra=Math.sin(B.t*3)*8;hose(x+56,y-200,x+86,y-180,x+80,y-140+ra,9);glove(x+80,y-140+ra,13);
    const jaw=B.mouth*16;rr(x-42,y-300,84,70,14,'#f0c9a0',4);rr(x-30,y-232,60,10,3,C.ink,0);rr(x-40,y-236+jaw,80,30,10,'#e8bd92',4);
    blob(ctx,[[x-22,y-246,14],[x,y-250,14],[x+22,y-246,14]],C.white,3);circ(x-30,y-262,8,'rgba(230,120,90,.5)',0);circ(x+30,y-262,8,'rgba(230,120,90,.5)',0);
    face(x,y-276,.62,{look:lookAt(L,x,y-276),dead:B.dead,ang:.25+B.phase*.12,mouth:'none',gap:34});
    rr(x-44,y-376,88,82,6,C.ink,0);rr(x-48,y-302,96,10,3,'#2b2420',3);star(x,y-340,16,7,5);ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
    ell(x,y-384,12,22,C.rust,3,Math.sin(B.t*4)*.2);flashOver(B,x,y-200,110);koStars(B,L,x,y-410);ctx.restore();}});

/* ---------- ISLA 2 ---------- */
defBoss({id:'faro',name:'Faro Furioso',sub:'Jefe · Punta del Faro',isl:2,hp:430,par:115,arena:'puerto',song:'boss2',x:770,intro:'¡LUCES FUERA!',
  center:B=>({x:B.x,y:B.y-220}),anchor(B,n){if(n==='lens')return{x:B.x-40,y:B.y-345};if(n==='base')return{x:B.x-90,y:GROUND};return{x:B.x,y:B.y-220};},
  shapes:B=>[{x:B.x-75,y:B.y-300,w:150,h:300},{x:B.x,y:B.y-345,r:46}],move(){},
  phases:[
    {atk:[{f:'sweep',every:2.6,alt:true,style:'light'},{f:'minion',every:2.8,ai:'diver',skin:'gaviota',hp:2,r:18,max:3,from:'lens'}]},
    {banner:'¡NIEBLA ESPESA!',atk:[{f:'ring',every:2.2,from:'lens',n:9,spd:200,spr:'fog',r:16,parry:9,sfx:'honk'},{f:'wave',every:3.4,from:'base',both:true,spr:'water',spd:400},{f:'sweep',every:4,alt:true,style:'light'}]},
    {banner:'¡LUZ CEGADORA!',atk:[{f:'aimed',every:1.1,from:'lens',n:3,spread:.15,spd:460,spr:'light',r:12,parry:6,sfx:'zap'},{f:'spiral',every:4,dur:1.5,rate:.1,arms:2,from:'lens',spr:'fog',r:13,spd:220},{f:'sweep',every:3,alt:true,style:'light'}]}],
  draw(B,L){const x=B.x,y=B.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);
    const a=L.t*1.2;ctx.globalAlpha=.18;poly([[x,y-345],[x+Math.cos(a)*900-60,y-345+Math.sin(a)*300-60],[x+Math.cos(a)*900+60,y-345+Math.sin(a)*300+60]],'#fff3b0',0);ctx.globalAlpha=1;
    blob(ctx,[[x-90,y,40],[x+80,y,46],[x,y+10,50]],'#4a423d',4);
    ctx.save();ctx.beginPath();ctx.moveTo(x-80,y-6);ctx.lineTo(x-55,y-300);ctx.lineTo(x+55,y-300);ctx.lineTo(x+80,y-6);ctx.closePath();ctx.clip();for(let i=0;i<7;i++){ctx.fillStyle=i%2?C.rust:C.paper;ctx.fillRect(x-90,y-6-i*50-50,180,50);}ctx.restore();
    poly([[x-80,y-6],[x-55,y-300],[x+55,y-300],[x+80,y-6]],null,5);rr(x-20,y-70,40,64,18,C.woodD,4);
    bossFace(B,L,x,y-220,.9,{gap:30,my:58,mw:36});
    rr(x-72,y-312,144,14,4,C.ink,0);for(let i=0;i<9;i++)line(x-64+i*16,y-312,x-64+i*16,y-330,3);line(x-70,y-330,x+70,y-330,4);
    rr(x-46,y-390,92,78,8,'rgba(255,243,176,.5)',4);const gl=ctx.createRadialGradient(x,y-350,4,x,y-350,44);gl.addColorStop(0,'#fffbe6');gl.addColorStop(1,'rgba(255,220,120,.2)');circ(x,y-350,34,gl,3);
    poly([[x-58,y-390],[x,y-440],[x+58,y-390]],C.rust,5);circ(x,y-444,8,C.brass,3);flashOver(B,x,y-200,100);koStars(B,L,x,y-470);ctx.restore();}});

defBoss({id:'cangrejo',name:'Cangrejo Castañuelas',sub:'Jefe · Playa del Olé',isl:2,hp:420,par:110,arena:'playa',song:'boss2b',x:740,margin:180,intro:'¡A BAILAR, CHAVALES!',
  center:B=>({x:B.x,y:B.y-90}),anchor(B,n){if(n==='claw')return{x:WX(B,-150),y:B.y-100};if(n==='mouth')return{x:WX(B,-60),y:B.y-80};if(n==='base')return{x:WX(B,-100),y:GROUND};return{x:B.x,y:B.y-90};},
  shapes:B=>[{x:B.x-112,y:B.y-128,w:224,h:96},{x:WX(B,-150),y:B.y-100,r:32}],move(){},
  phases:[
    {atk:[{f:'boomer',every:2.2,from:'claw',spr:'castanet',r:16,T:.9,parry:3},{f:'aimed',every:1.6,from:'mouth',n:2,spread:.4,spd:180,spr:'bubble',r:13,parry:3,sfx:'pop'}]},
    {banner:'¡OLÉ!',atk:[{f:'charge',every:3.4,warn:.9,spd:720},{f:'lob',every:1.8,from:'claw',spr:'dollar',r:14,bounce:2,parry:4}]},
    {banner:'¡ZAPATEADO!',atk:[{f:'ring',every:1.8,from:'claw',n:8,spr:'note',r:12,parry:8,spd:240,sfx:'card'},{f:'column',every:2.6,n:2,gap:.5,style:'geyser',w:40},{f:'charge',every:4.4,warn:.9,spd:760}]}],
  draw(B,L){const x=B.x,y=B.y;shadowE(x,GROUND+3,130,.28);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);if(B.shk)ctx.translate(B.shk,0);mirror(B);
    const run=B.act&&B.act.type==='charge'&&B.act.t>B.act.warn;for(let i=0;i<3;i++)for(const s of[-1,1]){const k=Math.sin(B.t*(run?30:6)+i)*6;hose(x+s*(40+i*22),y-50,x+s*(70+i*22),y-60+k,x+s*(80+i*24),y-4,6);}
    const red=B.phase===2?'#d0412a':'#c94c32';ell(x,y-80,112,50,red,6);ell(x-20,y-100,60,16,'rgba(255,220,190,.25)',0);
    for(const s of[-1,1]){line(x+s*30,y-118,x+s*36,y-172,6);circ(x+s*36,y-178,14,C.white,3.5);const lk=lookAt(L,x,y-178);circ(x+s*36+lk.x*5*MS(B),y-176+lk.y*5,6,C.ink,0);
      if(!B.dead){ctx.save();ctx.translate(x+s*36,y-196);ctx.rotate(s*(.3+B.phase*.1));rr(-14,-3,28,6,3,C.ink,0);ctx.restore();}}
    ell(x,y-128,48,8,C.ink,0);rr(x-24,y-150,48,22,4,C.ink,0);
    ctx.beginPath();ctx.arc(x-40,y-70,26,.1,Math.PI-.1);ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();if(B.mouth>0)ell(x-40,y-58,18,10*B.mouth,C.ink,0);
    const cl=Math.sin(B.t*(B.phase===2?16:6))*.3;ctx.save();ctx.translate(x-150,y-100);ell(30,10,26,12,red,4);ctx.rotate(-cl);ell(0,-8,34,18,red,5,-.2);ctx.rotate(cl*2);ell(0,14,30,14,red,5,.2);ctx.restore();
    ell(x-150,y-100,14,10,'#5a2a1a',3);ctx.save();ctx.translate(x+120,y-100);ell(0,0,22,14,red,4);ctx.restore();
    if(B.flash>0){ell(x,y-80,112,50,'rgba(255,250,235,.45)',0);}ctx.restore();koStars(B,L,x,y-200);}});

defBoss({id:'ballena',kind:'plane',name:'La Ballena Acordeón',sub:'Jefe aéreo · Mar Abierto',isl:2,hp:440,par:120,arena:'plane_mar',song:'plane2',x:820,y:300,intro:'¡A TODA VELA!',
  center:B=>({x:B.x-40,y:B.y}),anchor(B,n){if(n==='mouth')return{x:B.x-160,y:B.y+30};if(n==='spout')return{x:B.x-40,y:B.y-100};return{x:B.x-40,y:B.y};},
  shapes:B=>[{x:B.x-70,y:B.y,r:95},{x:B.x+70,y:B.y,r:95}],move(B){B.y=290+Math.sin(B.t*.7)*80;},
  phases:[
    {atk:[{f:'aimed',every:.9,from:'mouth',spd:330,spr:'fish',r:14,parry:4,sfx:'splash'},{f:'fountain',every:2.4,from:'spout',n:5,parry:5}]},
    {banner:'¡MAREJADA!',atk:[{f:'wall',every:2.6,spr:'bubble',r:15,spd:220,gap:150},{f:'minion',every:3,ai:'homer',skin:'pez',hp:3,r:18,max:3,spd:120,from:'mouth'},{f:'aimed',every:1.6,from:'mouth',spd:330,spr:'fish',r:14,parry:3}]},
    {banner:'¡SINFONÍA SUBMARINA!',atk:[{f:'ring',every:1.6,n:12,spr:'note',r:12,parry:12,spd:220,sfx:'honk'},{f:'aimed',every:1.2,from:'mouth',n:3,spread:.3,spd:280,spr:'bubble',r:13}]}],
  draw(B,L){const x=B.x,y=B.y,sq=Math.sin(B.t*4)*(B.phase===2?14:8);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.rotate(Math.sin(L.t*30)*.02);
    poly([[x+180,y-10],[x+260,y-90],[x+240,y-10],[x+270,y+50]],'#5a7a8a',5);
    ell(x-60,y,120,95,'#6f8f9a',6);ell(x+120,y+5,110,85,'#6f8f9a',6);
    ctx.save();ctx.beginPath();ctx.rect(x+10-sq,y-90,60+sq*2,180);ctx.clip();ctx.fillStyle=C.rust;ctx.fillRect(x-100,y-100,300,200);for(let i=0;i<7;i++)line(x+10-sq+i*(60+sq*2)/6,y-90,x+10-sq+i*(60+sq*2)/6,y+90,3);ctx.restore();
    rr(x+10-sq,y-92,60+sq*2,184,6,null,5);ell(x-80,y+40,80,40,'#d8e2e2',0);
    ctx.beginPath();ctx.moveTo(x-180,y+20);ctx.quadraticCurveTo(x-120,y+60,x-40,y+30);ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
    face(x-110,y-30,.8,{look:lookAt(L,x-110,y-30),dead:B.dead,ang:.2+B.phase*.1,mouth:'none',gap:26});
    rr(x-90,y-130,60,26,4,C.white,4);rr(x-98,y-108,76,10,4,C.ink,0);
    for(let i=0;i<3;i++){const k=(L.t*1.5+i/3)%1;ctx.globalAlpha=1-k;circ(x-40+(rand()-.5)*6,y-110-k*60,6+k*6,'#a9d3dc',2);ctx.globalAlpha=1;}
    if(B.flash>0){ell(x,y,180,95,'rgba(255,250,235,.4)',0);}ctx.restore();}});

const umbY=B=>B.y-250+(B.act?0:Math.sin(B.t*2.5)*6);
defBoss({id:'paraguas',name:'Paraguas Bailarín',sub:'Jefe · Tejados de Lluvia',isl:2,hp:420,par:115,arena:'tejados',song:'boss2',x:740,faceTarget:true,intro:'¡CHIQUI, CHIQUI, PLAF!',
  center:B=>({x:B.x,y:umbY(B)}),anchor(B,n){const cy=umbY(B);if(n==='cloud')return{x:B.x,y:cy-130};if(n==='tip')return{x:WX(B,-130),y:cy+10};return{x:B.x,y:cy};},
  shapes:B=>{const cy=umbY(B);return[{x:B.x,y:cy-20,r:100},{x:B.x-10,y:cy+50,w:20,h:B.y-cy-50}];},move(){},
  phases:[
    {atk:[{f:'rain',every:1.2,n:2,track:220,spd:280,spr:'drop',r:9,parry:4},{f:'wind',every:4.5,dur:2.3,force:150,mouth:false}]},
    {banner:'¡A BAILAR!',atk:[{f:'leap',every:3.6,side:true},{f:'ring',every:2,n:10,spr:'drop',r:10,spd:230,parry:10},{f:'rain',every:1.4,n:2,track:240,spd:280,spr:'drop',r:9,parry:5}]},
    {banner:'¡TORMENTA!',atk:[{f:'column',every:2.4,n:2,gap:.4,spread:200,style:'bolt',w:36},{f:'bouncer',every:3.5,spr:'bigdrop',r:20,life:6,max:2,from:'tip'},{f:'wind',every:5,dur:2.3,force:170,mouth:false}]}],
  draw(B,L){const x=B.x,y=B.y,cy=umbY(B);shadowE(x,GROUND+3,80,.25);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    const ccy=cy-130+Math.sin(L.t*2)*4;cloudShape(ctx,x-60,ccy,.85,B.phase===2?'#8f8f8a':'#c9c6bd',4);for(let i=0;i<4;i++){const k=(L.t*2+i/4)%1;line(x-50+i*30,ccy+30+k*40,x-54+i*30,ccy+42+k*40,2,'rgba(80,110,130,.6)');}
    ctx.lineWidth=8;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(x,cy);ctx.lineTo(x,y-40);ctx.arc(x+18,y-40,18,Math.PI,0,true);ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle=C.woodL;ctx.stroke();
    const spin=B.act?B.t*12:Math.sin(B.t*3)*.08;ctx.save();ctx.translate(x,cy);ctx.rotate(Math.sin(spin)*.15);
    ctx.beginPath();ctx.moveTo(-120,0);ctx.quadraticCurveTo(-110,-110,0,-118);ctx.quadraticCurveTo(110,-110,120,0);for(let i=0;i<6;i++)ctx.quadraticCurveTo(120-i*40-20,-24,120-(i+1)*40,0);ctx.closePath();ctx.fillStyle='#2b2420';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.save();ctx.clip();for(let i=0;i<6;i+=2){ctx.fillStyle=C.rust;ctx.beginPath();ctx.moveTo(0,-118);ctx.lineTo(-120+i*40,0);ctx.lineTo(-80+i*40,0);ctx.closePath();ctx.fill();}ctx.restore();
    circ(0,-122,7,C.brass,3);ctx.restore();
    face(x,cy-60,.8,{look:lookAt(L,x,cy-60),dead:B.dead,ang:.2+B.phase*.1,my:44,mw:30,open:B.mouth});
    for(const s of[-1,1]){hose(x+s*50,cy+4,x+s*40,cy+60,x+s*12,cy+80+Math.sin(B.t*4+s)*6,7);glove(x+s*12,cy+80+Math.sin(B.t*4+s)*6,11);}
    if(B.flash>0)circ(x,cy-40,100,'rgba(255,250,235,.4)',0);koStars(B,L,x,cy-170);ctx.restore();}});

defBoss({id:'caldera',name:'Caldera Gruñona',sub:'Jefe · Sala de Máquinas',isl:2,hp:460,par:120,arena:'maquinas',song:'boss2b',x:760,intro:'¡A TODO VAPOR!',
  center:B=>({x:B.x,y:B.y-175}),anchor(B,n){if(n==='mouth')return{x:B.x-70,y:B.y-120};if(n==='chimney')return{x:B.x+50,y:B.y-380};if(n==='floor')return{x:B.x-140,y:GROUND};return{x:B.x,y:B.y-175};},
  shapes:B=>[{x:B.x,y:B.y-175,r:126}],move(){},
  phases:[
    {atk:[{f:'column',every:2.4,n:2,gap:.6,style:'steam',w:40},{f:'lob',every:1.6,from:'mouth',spr:'coal',r:14,bounce:1,parry:3}]},
    {banner:'¡PRESIÓN AL MÁXIMO!',atk:[{f:'aimed',every:1.3,from:'mouth',n:3,spread:.25,spd:320,spr:'flame',r:13,parry:3,sfx:'fire'},{f:'sweep',every:3.4,low:true,style:'steam'},{f:'column',every:3.6,style:'steam',w:40}]},
    {banner:'¡A REVENTAR!',atk:[{f:'spiral',every:3.6,dur:2,rate:.1,step:.4,arms:3,spd:230,spr:'rivet',r:10},{f:'rain',every:.45,spr:'ember',r:9,spd:[260,330],parry:6},{f:'column',every:2.4,n:2,gap:.5,style:'steam',w:40}]}],
  draw(B,L){const x=B.x,y=B.y,cy=y-175;shadowE(x,GROUND+3,120,.3);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);
    for(const s of[-1,1])for(const k of[.4,1]){rr(x+s*80*k-10,y-60,20,60,4,C.steelD,4);}
    rr(x+30,cy-210,40,110,4,C.steelD,5);rr(x+22,cy-220,56,16,4,C.ink,0);for(let i=0;i<3;i++){const k=(L.t*.9+i/3)%1;ctx.globalAlpha=1-k;circ(x+50+k*30,cy-230-k*90,12+k*16,B.phase===2?'#5a5450':'#b9b4a5',2.5);ctx.globalAlpha=1;}
    const g=ctx.createRadialGradient(x-40,cy-40,20,x,cy,140);g.addColorStop(0,'#8a8478');g.addColorStop(1,'#4a4440');circ(x,cy,130,g,6);
    if(B.phase===2){circ(x,cy,130,`rgba(240,90,40,${.18+Math.sin(L.t*12)*.08})`,0);}
    for(let i=0;i<20;i++){const a=i*TAU/20;circ(x+Math.cos(a)*116,cy+Math.sin(a)*116,4,C.steel,1.5);}line(x-128,cy+20,x+128,cy+20,4);
    const pr=clamp(1-B.hp/B.max,0,1);circ(x-40,cy-40,30,C.white,4);for(let i=0;i<7;i++){const a=Math.PI*.8+i*Math.PI*1.4/6;line(x-40+Math.cos(a)*22,cy-40+Math.sin(a)*22,x-40+Math.cos(a)*28,cy-40+Math.sin(a)*28,2);}
    const na=Math.PI*.8+pr*Math.PI*1.4+Math.sin(L.t*20)*.05;line(x-40,cy-40,x-40+Math.cos(na)*24,cy-40+Math.sin(na)*24,3.5,C.rust);circ(x-40,cy-40,4,C.ink,0);
    ell(x+38,cy-40,15,19,C.white,3.5);const lk=lookAt(L,x+38,cy-40);ell(x+38+lk.x*7,cy-36+lk.y*6,6,8,C.ink,0);ctx.save();ctx.translate(x+38,cy-66);ctx.rotate(-.3-B.phase*.1);rr(-16,-4,32,8,4,C.ink,0);ctx.restore();
    const op=Math.max(B.mouth,B.phase===2?.4:0);ctx.beginPath();ctx.moveTo(x-80,cy+50);ctx.lineTo(x-80,cy+10);ctx.arc(x-30,cy+10,50,Math.PI,0);ctx.lineTo(x+20,cy+50);ctx.closePath();ctx.fillStyle=C.ink;ctx.fill();
    const fg=ctx.createRadialGradient(x-30,cy+30,4,x-30,cy+30,50);fg.addColorStop(0,'#ffe27a');fg.addColorStop(1,'#d9542b');ctx.save();ctx.clip();ctx.fillStyle=fg;ctx.fillRect(x-80,cy-40+(1-op)*40,100,100);ctx.restore();
    ctx.save();ctx.translate(x-80,cy+30);ctx.scale(1-op*.8,1);rr(0,-40,100,60,8,C.steelD,4);for(let i=0;i<3;i++)line(10,-28+i*14,90,-28+i*14,2);ctx.restore();
    if(B.flash>0)circ(x,cy,130,'rgba(255,250,235,.4)',0);if(B.dead){for(let i=0;i<3;i++){const a=L.t*4+i*2.1;txt('★',x+Math.cos(a)*70,cy-170+Math.sin(a)*14,22,C.brass);}}ctx.restore();}});

/* ---------- ISLA 3 ---------- */
const candTop=B=>B.y-30-(B.h||300);
defBoss({id:'vela',name:'Vela Derretida',sub:'Jefe · Salón de las Velas',isl:3,hp:500,par:120,arena:'velas',song:'boss3',x:760,intro:'¡QUE ARDA LA FIESTA!',
  setup(B){B.h=300;},center:B=>({x:B.x,y:candTop(B)+60}),
  anchor(B,n){const t=candTop(B);if(n==='flame')return{x:B.x,y:t-46};if(n==='floor')return{x:B.x-130,y:GROUND};return{x:B.x-60,y:t+50};},
  shapes:B=>{const t=candTop(B);return[{x:B.x-60,y:t,w:120,h:B.y-t},{x:B.x,y:t-44,r:30}];},
  move(B,dt){B.h=lerp(B.h,[300,232,170][B.phase],Math.min(1,dt*1.5));},
  phases:[
    {atk:[{f:'aimed',every:1.2,from:'flame',speeds:[260,330],spr:'flame',r:13,parry:3,sfx:'fire'},{f:'rain',every:1.1,n:2,spr:'wax',r:10,spd:260,puddle:true}]},
    {banner:'¡ME DERRITO DE RABIA!',atk:[{f:'minion',every:2.6,ai:'homer',skin:'llama',hp:2,r:18,max:3,spd:110,from:'flame'},{f:'wave',every:3,from:'floor',both:true,spd:400},{f:'aimed',every:1.6,from:'flame',spd:320,spr:'flame',r:13,parry:3,sfx:'fire'}]},
    {banner:'¡ÚLTIMA LLAMA!',atk:[{f:'spiral',every:3.6,dur:2,rate:.11,arms:2,from:'flame',spr:'flame',r:11,spd:220},{f:'column',every:2.6,n:3,gap:.5,style:'fire',w:44},{f:'rain',every:1.4,n:2,spr:'wax',r:10,spd:260,puddle:true}]}],
  draw(B,L){const x=B.x,y=B.y,t=candTop(B);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);
    const gl=ctx.createRadialGradient(x,t-50,10,x,t-50,220);gl.addColorStop(0,'rgba(255,210,120,.3)');gl.addColorStop(1,'rgba(255,210,120,0)');ctx.fillStyle=gl;ctx.fillRect(x-240,t-270,480,480);
    ell(x,y-14,120,18,C.brass,5);ctx.beginPath();ctx.arc(x+130,y-30,22,0,TAU);ctx.lineWidth=7;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle=C.brass;ctx.stroke();
    rr(x-60,t,120,y-t-20,20,'#f3ead2',5);for(const [dx,len] of[[-50,60],[-20,30],[30,80],[52,40]]){ctx.beginPath();ctx.moveTo(x+dx-8,t+4);ctx.lineTo(x+dx-8,t+len);ctx.arc(x+dx,t+len,8,Math.PI,0,true);ctx.lineTo(x+dx+8,t+4);ctx.fillStyle='#f3ead2';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}
    ell(x,t+6,58,10,'#e8dcc0',3);line(x,t+4,x,t-14,4);const fs=B.phase===2?1.5:1,fl=Math.sin(L.t*20)*4;
    ctx.beginPath();ctx.moveTo(x-22*fs,t-16);ctx.quadraticCurveTo(x-26*fs,t-60*fs,x+fl,t-96*fs);ctx.quadraticCurveTo(x+26*fs,t-60*fs,x+22*fs,t-16);ctx.closePath();
    const fgr=ctx.createLinearGradient(0,t-96*fs,0,t-16);fgr.addColorStop(0,'#ffe27a');fgr.addColorStop(1,'#f08a2e');ctx.fillStyle=fgr;ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();
    bossFace(B,L,x,t+50,.85,{gap:28,my:44,mw:30});if(B.flash>0){ctx.beginPath();ctx.roundRect(x-60,t,120,y-t-20,20);ctx.fillStyle='rgba(255,250,235,.45)';ctx.fill();}koStars(B,L,x,t-120);ctx.restore();}});

const owlY=B=>B.fly?170+Math.sin(B.t*1.3)*40:B.y-230;
defBoss({id:'buho',name:'Búho Bibliotecario',sub:'Jefe · Biblioteca del Silencio',isl:3,hp:520,par:125,arena:'biblioteca',song:'boss3b',x:770,intro:'¡SILENCIO… QUE EMPIEZA!',
  center:B=>({x:B.x,y:owlY(B)}),anchor(B,n){const oy=owlY(B);if(n==='wing')return{x:B.x-85,y:oy+10};if(n==='floor')return{x:B.x,y:GROUND-20};return{x:B.x-10,y:oy+10};},
  shapes:B=>{const s=[{x:B.x,y:owlY(B),r:90}];if(!B.fly)s.push({x:B.x-80,y:B.y-122,w:160,h:122});return s;},
  move(B){if(B.fly)B.x=520+Math.sin(B.t*.6)*250;},onPhase(B,L,i){if(i===2){B.fly=true;}},
  phases:[
    {atk:[{f:'boomer',every:1.8,from:'wing',spr:'book',r:18,T:1,parry:3},{f:'rain',every:.9,n:2,spr:'letter',chars:['A','B','C','Ñ','Z','?'],r:12,spd:240,sway:40,parry:5}]},
    {banner:'¡SILENCIO EN LA SALA!',atk:[{f:'column',every:2.6,n:2,gap:.6,style:'books',w:56},{f:'aimed',every:1.8,n:5,spread:.18,spd:340,spr:'feather',r:10,parry:5}]},
    {banner:'¡A VOLAR, LECTORES!',atk:[{f:'ring',every:1.9,n:10,spr:'letter',chars:['O','U','H','!'],r:12,spd:220,parry:10,sfx:'card'},{f:'minion',every:2.6,ai:'hopper',skin:'gusano',hp:2,r:18,max:3,from:'floor'},{f:'boomer',every:2.4,from:'wing',spr:'book',r:18,T:1.1,parry:3}]}],
  draw(B,L){const x=B.x,oy=owlY(B);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);
    const hx=770;for(let i=0;i<5;i++)rr(hx-80+(i%2)*8,GROUND-24-i*24,152,24,3,['#7a3b2e','#3b5a7a','#6f7a45','#b5402f','#c79a5e'][i],3);
    if(B.fly)shadowE(x,GROUND+3,60,.2);const flap=B.fly?Math.sin(L.t*14)*30:0;
    for(const s of[-1,1]){ctx.save();ctx.translate(x+s*70,oy+10);ctx.rotate(s*(.3+flap*.02));ell(s*20,0,40,70,'#6b4a33',4,s*.3);ctx.restore();}
    ell(x,oy,88,100,'#8a6a4a',6);ell(x,oy+30,56,62,'#d9c39a',0);for(let i=0;i<4;i++)ctx.beginPath(),ctx.arc(x-24+i*16,oy+20+(i%2)*14,8,0,Math.PI),ctx.stroke();
    poly([[x-70,oy-80],[x-48,oy-120],[x-34,oy-82]],'#6b4a33',4);poly([[x+70,oy-80],[x+48,oy-120],[x+34,oy-82]],'#6b4a33',4);
    bossFace(B,L,x,oy-26,.9,{gap:34,ew:18,eh:20,mouth:'none',ang:.15+B.phase*.1});for(const s of[-1,1]){ctx.beginPath();ctx.arc(x+s*31,oy-26,26,0,TAU);ctx.lineWidth=5;ctx.strokeStyle=C.gold;ctx.stroke();}line(x-6,oy-26,x+6,oy-26,4,C.gold);
    poly([[x-12,oy+2],[x+12,oy+2],[x,oy+24+B.mouth*6]],'#e08a2e',3.5);poly([[x-22,oy+40],[x,oy+48],[x-22,oy+56]],C.rust,3);poly([[x+22,oy+40],[x,oy+48],[x+22,oy+56]],C.rust,3);
    ctx.save();ctx.translate(x-80,oy+30);ctx.rotate(-.2);rr(-34,-22,34,44,3,C.paper,3);rr(0,-22,34,44,3,C.paper,3);ctx.restore();
    if(!B.fly)for(const s of[-1,1])for(let i=0;i<3;i++)line(x+s*20+i*6-6,oy+96,x+s*20+i*6-8,oy+108,4,'#e08a2e');
    if(B.flash>0)ell(x,oy,88,100,'rgba(255,250,235,.4)',0);koStars(B,L,x,oy-130);ctx.restore();}});

defBoss({id:'murcielago',kind:'plane',name:'Conde Murciélago',sub:'Jefe aéreo · Cielo de Medianoche',isl:3,hp:500,par:125,arena:'plane_noche',song:'plane3',x:780,y:270,intro:'¡A VOLAR DE NOCHE!',
  center:B=>({x:B.x,y:B.y}),anchor(B,n){if(n==='violin')return{x:B.x-60,y:B.y-10};if(n==='mouth')return{x:B.x-20,y:B.y+10};return{x:B.x,y:B.y};},shapes:B=>[{x:B.x,y:B.y,r:72}],
  move(B){B.y=270+Math.sin(B.t*.9)*110;B.x=780+Math.sin(B.t*.6)*40;},
  phases:[
    {atk:[{f:'aimed',every:1.1,from:'violin',n:3,spread:.25,spd:300,spr:'note',r:13,wob:80,parry:4,sfx:'card'},{f:'minion',every:2.6,ai:'diver',skin:'murcielago',hp:2,r:16,max:3}]},
    {banner:'¡SERENATA MORTAL!',atk:[{f:'wall',every:2.6,spr:'note',r:14,gap:160,spd:230},{f:'ring',every:2.2,from:'mouth',n:12,spr:'sonic',r:12,spd:230,parry:12}]},
    {banner:'¡FORTÍSSIMO!',atk:[{f:'spiral',every:99,delay:.3,dur:99,rate:.1,arms:3,step:.3,spr:'note',r:11,spd:200,parry:13},{f:'aimed',every:.8,from:'mouth',spd:460,spr:'sonic',r:12}]}],
  draw(B,L){const x=B.x,y=B.y,fl=Math.sin(L.t*10);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.rotate(Math.sin(L.t*30)*.03);
    for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(x+s*30,y-30);ctx.quadraticCurveTo(x+s*120,y-120-fl*30,x+s*200,y-40-fl*20);ctx.quadraticCurveTo(x+s*150,y-10,x+s*160,y+30);ctx.quadraticCurveTo(x+s*110,y+10,x+s*90,y+40);ctx.quadraticCurveTo(x+s*60,y+10,x+s*30,y+30);ctx.closePath();
      ctx.fillStyle='#3b2f55';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();}
    poly([[x-50,y+30],[x,y+90],[x+50,y+30]],C.rust,4);ell(x,y,62,72,'#4b3a6b',6);poly([[x-48,y-46],[x-36,y-110],[x-16,y-60]],'#4b3a6b',5);poly([[x+48,y-46],[x+36,y-110],[x+16,y-60]],'#4b3a6b',5);
    face(x,y-12,.85,{look:lookAt(L,x,y-12),dead:B.dead,ang:.25+B.phase*.1,mouth:'smile',my:36,mw:22,col:'#fffbe6'});for(const s of[-1,1])poly([[x+s*10,y+24],[x+s*4,y+24],[x+s*7,y+36]],C.white,2);
    ctx.save();ctx.translate(x-56,y+10);ctx.rotate(-.5);ell(0,0,22,32,'#8a4a2a',4);rr(-4,-60,8,40,3,C.woodD,3);line(-10,-8,10,-8,2);ctx.restore();
    const bw=Math.sin(L.t*8)*30;line(x-110+bw,y-20,x-10+bw,y+30,3,C.woodL);
    if(B.flash>0)ell(x,y,62,72,'rgba(255,250,235,.4)',0);ctx.restore();}});

defBoss({id:'espantapajaros',name:'Espantapájaros Jacinto',sub:'Jefe · Campo Maldito',isl:3,hp:520,par:125,arena:'granja',song:'boss3',x:760,intro:'¡FUERA DE MI CAMPO!',
  center:B=>({x:B.x,y:B.y-260}),anchor(B,n){if(n==='hat')return{x:B.x,y:B.y-430};if(n==='hand')return{x:B.x-130,y:B.y-270};if(n==='floor')return{x:B.x-90,y:GROUND};if(n==='mouth')return{x:B.x-10,y:B.y-350};return{x:B.x,y:B.y-260};},
  shapes:B=>[{x:B.x-58,y:B.y-330,w:116,h:190},{x:B.x,y:B.y-372,r:46},{x:B.x-9,y:B.y-140,w:18,h:140}],move(){},
  phases:[
    {atk:[{f:'minion',every:2.2,ai:'diver',skin:'cuervo',hp:2,r:16,max:3,from:'hat'},{f:'roller',every:3,from:'floor',spr:'hay',r:30,spd:330}]},
    {banner:'¡FUERA DE MI CAMPO!',atk:[{f:'column',every:2.6,n:3,gap:.5,style:'fork',w:48},{f:'aimed',every:1.6,from:'mouth',n:5,spread:.3,spd:320,spr:'corn',r:9,parry:5}]},
    {banner:'¡COSECHA MALDITA!',atk:[{f:'sweep',every:3,low:true,style:'scythe'},{f:'spiral',every:4,dur:1.8,arms:2,from:'mouth',spr:'straw',r:12,spd:230},{f:'minion',every:2.6,ai:'diver',skin:'cuervo',hp:2,r:16,max:3,from:'hat'},{f:'roller',every:3.6,from:'floor',spr:'hay',r:30,spd:360}]}],
  draw(B,L){const x=B.x,y=B.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);
    rr(x-9,y-300,18,300,4,C.woodL,4);rr(x-160,y-300,320,16,4,C.woodL,4);const sw=Math.sin(B.t*2)*.05;ctx.save();ctx.translate(x,y-300);ctx.rotate(sw);ctx.translate(-x,-(y-300));
    rr(x-60,y-330,120,170,10,'#8a5a4a',5);rr(x-40,y-300,34,30,3,'#6f7a45',3);rr(x+14,y-240,34,30,3,'#c79a5e',3);for(let i=0;i<3;i++)line(x-6,y-320+i*20,x+6,y-320+i*20,2);
    for(const s of[-1,1]){rr(s<0?x-150:x+60,y-312,90,30,8,'#8a5a4a',4);for(let i=0;i<5;i++)line(x+s*150,y-298,x+s*(170+i*3),y-318+i*10,3,'#d9b45a');}
    circ(x,y-372,48,'#d9c39a',5);for(let i=0;i<6;i++)line(x-40+i*16,y-336,x-38+i*16,y-330,2);
    const lk=lookAt(L,x,y-380);for(const s of[-1,1]){circ(x+s*18+lk.x*4,y-385+lk.y*4,11,C.ink,0);for(let k=0;k<4;k++)circ(x+s*18+lk.x*4+(k%2?3:-3),y-385+lk.y*4+(k<2?-3:3),1.6,'#8a7650',0);
      ctx.save();ctx.translate(x+s*18,y-404);ctx.rotate(s*(.35+B.phase*.1));for(let k=-1;k<=1;k++)line(k*7,-4,k*7,4,2);line(-12,0,12,0,2);ctx.restore();}
    ctx.beginPath();ctx.moveTo(x-24,y-352);for(let i=0;i<7;i++)ctx.lineTo(x-24+i*8,y-352+(i%2?6+B.mouth*8:0));ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
    ell(x,y-414,70,12,'#d9b45a',4);rr(x-34,y-460,68,46,10,'#d9b45a',4);rr(x-34,y-428,68,8,2,C.rust,0);
    ctx.restore();ctx.save();ctx.translate(x+30,y-470+Math.sin(L.t*3)*2);ell(0,0,16,10,'#2b2420',3);circ(-12,-8,8,'#2b2420',3);poly([[-20,-8],[-28,-6],[-20,-4]],C.gold,2);circ(-14,-10,2,'#fffbe6',0);ctx.restore();
    if(B.flash>0){circ(x,y-372,48,'rgba(255,250,235,.45)',0);ctx.fillStyle='rgba(255,250,235,.45)';ctx.fillRect(x-60,y-330,120,170);}koStars(B,L,x,y-500);ctx.restore();}});

defBoss({id:'maquina',name:'Doña Tecla',sub:'Jefe · Oficina de Tinta',isl:3,hp:520,par:125,arena:'oficina',song:'boss3b',x:740,intro:'¡PUNTO DE PARTIDA!',
  center:B=>({x:B.x,y:B.y-200}),anchor(B,n){if(n==='keys')return{x:B.x-110,y:B.y-90};if(n==='paper')return{x:B.x,y:B.y-300};if(n==='mouth')return{x:B.x,y:B.y-232};return{x:B.x,y:B.y-200};},
  shapes:B=>[{x:B.x-140,y:B.y-160,w:280,h:150},{x:B.x-70,y:B.y-330,w:140,h:170}],move(B){B.car=Math.sin(B.t*1.2)*20;},
  phases:[
    {atk:[{f:'aimed',every:1.4,from:'keys',n:5,spread:.12,spd:360,spr:'letter',chars:['Z','A','S','!','¡','P','U','M'],r:12,parry:5,sfx:'card'},{f:'lob',every:2.2,from:'paper',spr:'paper',r:16,g:500,vy:-320,T:1.6}]},
    {banner:'¡PUNTO Y APARTE!',atk:[{f:'sweep',every:2.4,alt:true,style:'line'},{f:'rain',every:.8,spr:'key',chars:['Q','W','E','R','T','Y'],r:13,spd:300,track:160,parry:4}]},
    {banner:'¡DING!',atk:[{f:'ring',every:1.8,from:'mouth',n:12,spr:'letter',chars:['D','I','N','G'],r:11,spd:230,parry:12,sfx:'ding'},{f:'column',every:2.5,n:2,gap:.6,style:'stamp',w:70},{f:'aimed',every:1.6,from:'keys',n:3,spread:.15,spd:380,spr:'letter',chars:['T','A','C'],r:12,parry:4,sfx:'card'}]}],
  draw(B,L){const x=B.x,y=B.y,car=B.car||0;shadowE(x,GROUND+3,150,.3);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);
    rr(x-70+car,y-330,140,180,4,C.white,4);for(let i=0;i<7;i++)line(x-58+car,y-310+i*22,x+58+car,y-310+i*22,1.5,'rgba(59,90,122,.35)');
    bossFace(B,L,x+car,y-262,.75,{gap:30,my:44,mw:28,col:'#fffaf0'});
    rr(x-125+car,y-170,250,24,12,'#2b2420',4);for(const s of[-1,1])circ(x+car+s*132,y-158,14,C.steelD,4);
    poly([[x-150,y-10],[x-120,y-150],[x+120,y-150],[x+150,y-10]],'#2b2420',5);line(x-140,y-40,x+140,y-40,3,C.gold);line(x-128,y-140,x+128,y-140,3,C.gold);
    for(let r=0;r<3;r++)for(let i=0;i<9-r;i++){const kx=x-104+r*12+i*26,ky=y-118+r*28-(B.mouth>0&&(i+r)%3===0?4:0);circ(kx,ky,10,C.paper,3);}
    ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(x-150+car,y-170);ctx.lineTo(x-190+car,y-200+Math.sin(B.t*3)*10);ctx.stroke();circ(x-190+car,y-200+Math.sin(B.t*3)*10,8,C.steel,3);
    circ(x+150,y-170,10,C.brass,3);if(B.flash>0){ctx.fillStyle='rgba(255,250,235,.45)';ctx.fillRect(x-150,y-330,300,320);}koStars(B,L,x,y-360);ctx.restore();}});

const hatY=B=>B.y-230+(B.act?0:Math.sin(B.t*2)*12);
defBoss({id:'chistera',name:'El Gran Chistera',sub:'Jefe · Teatro de Magia',isl:3,hp:520,par:125,arena:'magia',fg:'curtains',song:'boss3b',x:720,intro:'¡DAMAS Y CABALLEROS!',
  center:B=>({x:B.x,y:hatY(B)}),anchor(B,n){const cy=hatY(B);if(n==='wand')return{x:B.x-130,y:cy+10};if(n==='top')return{x:B.x,y:cy-100};if(n==='brim')return{x:B.x-60,y:cy+70};return{x:B.x,y:cy};},
  shapes:B=>{const cy=hatY(B);return[{x:B.x-72,y:cy-100,w:144,h:156},{x:B.x-105,y:cy+56,w:210,h:20}];},move(){},
  phases:[
    {atk:[{f:'aimed',every:1.4,from:'wand',n:5,spread:.16,spd:340,spr:'card',chars:['♥','♦','♣','♠'],r:14,parry:5,sfx:'card'},{f:'minion',every:2.6,ai:'hopper',skin:'conejo',hp:2,r:18,max:3,from:'brim'}]},
    {banner:'¡Y AHORA… DESAPAREZCO!',atk:[{f:'tele',every:3.2},{f:'aimed',every:1.8,from:'wand',spd:210,spr:'dove',r:14,parry:3,turn:2,life:3.4},{f:'aimed',every:1.6,from:'wand',n:3,spread:.2,spd:340,spr:'card',chars:['♥','♠'],r:14,parry:6,sfx:'card'}]},
    {banner:'¡EL GRAN FINAL!',atk:[{f:'sweep',every:3.2,low:true,style:'saw'},{f:'spiral',every:3.8,dur:2,arms:4,rate:.12,from:'top',spr:'card',r:12,spd:220},{f:'rain',every:.6,spr:'star',r:12,parry:6,spd:260}]}],
  draw(B,L){if(B.hidden){for(let i=0;i<6;i++){const a=L.t*6+i;star(B.x+Math.cos(a)*40,hatY(B)+Math.sin(a)*40,6,2.5,4);ctx.fillStyle=C.gold;ctx.fill();}return;}
    const x=B.x,cy=hatY(B);shadowE(x,GROUND+3,90,.22);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);
    const ear=Math.sin(L.t*3)*.2;for(const s of[-1,1]){ctx.save();ctx.translate(x+s*16,cy-100);ctx.rotate(s*.2+ear*s);ell(0,-28,10,30,C.white,3.5);ell(0,-26,5,20,'#f2b8b0',0);ctx.restore();}
    rr(x-72,cy-100,144,160,10,'#231c26',6);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(x-56,cy-90,14,130);rr(x-74,cy+6,148,34,4,C.rust,5);
    bossFace(B,L,x,cy+22,.62,{gap:36,mouth:'none',col:'#fffbe6'});ctx.beginPath();ctx.arc(x,cy+44,14,.15*Math.PI,.85*Math.PI);ctx.lineWidth=3;ctx.strokeStyle=C.paper;ctx.stroke();
    ell(x,cy+64,110,14,'#231c26',5);
    const wx=x-130,wy=cy+10+Math.sin(B.t*4)*8;glove(wx+16,wy,14);ctx.save();ctx.translate(wx+16,wy);ctx.rotate(-.6+Math.sin(B.t*4)*.2);rr(-50,-3,50,6,3,C.ink,0);rr(-56,-3,10,6,2,C.white,0);ctx.restore();
    if(Math.floor(L.t*6)%2)star(wx-30,wy-30,8,3,4),ctx.fillStyle=C.gold,ctx.fill();glove(x+120,cy+20+Math.cos(B.t*4)*8,14);
    if(B.flash>0){ctx.fillStyle='rgba(255,250,235,.4)';ctx.fillRect(x-72,cy-100,144,160);}koStars(B,L,x,cy-150);ctx.restore();}});

defBoss({id:'apagon',name:'Rey Apagón',sub:'Jefe final · Castillo Apagón',isl:3,hp:700,par:170,arena:'castillo',song:'final',x:740,final:true,intro:'¡SE ACABÓ LA LUZ!',
  center:B=>({x:B.x,y:B.y-300}),anchor(B,n){if(n==='hand')return{x:B.x-170,y:B.y-210+Math.sin(B.t*3)*10};if(n==='eyes')return{x:B.x-20,y:B.y-340};if(n==='floor')return{x:B.x-130,y:GROUND};if(n==='crown')return{x:B.x,y:B.y-420};return{x:B.x,y:B.y-300};},
  shapes:B=>[{x:B.x,y:B.y-336,r:74},{x:B.x-90,y:B.y-262,w:180,h:262}],move(){},
  phases:[
    {atk:[{f:'aimed',every:1.3,from:'hand',n:3,spread:.3,spd:300,spr:'orb',r:13,parry:3,sfx:'laugh'},{f:'column',every:2.6,n:2,gap:.5,style:'darkbolt',w:36}]},
    {banner:'¡SE VA LA LUZ!',atk:[{f:'dark',every:8,delay:.8,dur:4.5},{f:'minion',every:2.4,ai:'walker',skin:'sombra',hp:3,r:20,spd:150,max:3,from:'floor'},{f:'ring',every:2.2,from:'eyes',n:10,spr:'orb',r:11,spd:220,parry:10}]},
    {banner:'¡TEMBLAD!',atk:[{f:'leap',every:2.8,landWave:true,T:1.1},{f:'spiral',every:4,dur:1.8,arms:3,from:'eyes',spr:'orb',r:11,spd:230},{f:'aimed',every:1.5,from:'eyes',n:2,spread:.3,spd:340,spr:'orb',r:12,parry:3,noAct:true}]},
    {banner:'¡NO ME APAGARÉIS!',atk:[{f:'spiral',every:99,delay:.4,dur:99,rate:.14,arms:2,step:.5,from:'eyes',spr:'orb',r:10,spd:210,parry:11},{f:'sweep',every:2.6,alt:true,style:'saber'},{f:'rain',every:.55,spr:'orb',r:10,spd:[260,320],parry:7},{f:'column',every:3,style:'darkbolt',w:36}]}],
  draw(B,L){const x=B.x,y=B.y;shadowE(x,GROUND+3,140,B.act?.5:.35);if(y<-300)poly([[x,46],[x-14,24],[x+14,24]],C.plum);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    const wv=t=>Math.sin(L.t*4+t)*6;ctx.beginPath();ctx.moveTo(x-80,y-270);ctx.quadraticCurveTo(x-120,y-140,x-140,y);for(let i=0;i<7;i++)ctx.lineTo(x-140+i*40+20,y-14+wv(i)+(i%2?0:-10));ctx.lineTo(x+140,y);ctx.quadraticCurveTo(x+120,y-140,x+80,y-270);ctx.closePath();
    ctx.fillStyle=C.plum;ctx.fill();ctx.lineWidth=6;ctx.strokeStyle=C.ink;ctx.stroke();ctx.beginPath();ctx.moveTo(x-60,y-270);ctx.quadraticCurveTo(x-80,y-120,x-70,y-10);ctx.lineTo(x+70,y-10);ctx.quadraticCurveTo(x+80,y-120,x+60,y-270);ctx.closePath();ctx.fillStyle=C.shadow;ctx.fill();ctx.stroke();
    for(let i=0;i<5;i++)poly([[x-90+i*40,y-270],[x-70+i*40,y-300],[x-50+i*40,y-270]],C.plum,3);
    const hx=x-170,hy=y-210+Math.sin(B.t*3)*10;glove(hx,hy,24);ctx.beginPath();ctx.arc(hx,hy,24,0,TAU);ctx.fillStyle='#3b2f55';ctx.fill();ctx.stroke();
    const gx=x+170,gy=y-190+Math.cos(B.t*3)*10;circ(gx,gy,24,'#3b2f55',4);rr(gx-8,gy-96,16,80,4,'#2b2420',4);rr(gx-24,gy-130,48,40,8,'#5a5450',4);rr(gx-16,gy-152,8,24,2,C.steel,2.5);rr(gx+8,gy-152,8,24,2,C.steel,2.5);
    circ(x,y-336,76,'#2a2140',6);const lk=lookAt(L,x,y-336);for(const s of[-1,1]){ell(x+s*30,y-350,22,16,'#fffbe6',3.5,s*-.2);if(B.dead){line(x+s*30-8,y-358,x+s*30+8,y-342,3.5);line(x+s*30+8,y-358,x+s*30-8,y-342,3.5);}else ell(x+s*30+lk.x*8,y-350+lk.y*5,4,12,C.ink,0);
      ctx.save();ctx.translate(x+s*30,y-376);ctx.rotate(s*(.3+B.phase*.08));rr(-22,-4,44,8,4,'#100a18',0);ctx.restore();}
    const op=Math.max(B.mouth,.3);ctx.beginPath();ctx.moveTo(x-46,y-312);ctx.quadraticCurveTo(x,y-300+op*10,x+46,y-312);ctx.quadraticCurveTo(x,y-280+op*30,x-46,y-312);ctx.closePath();ctx.fillStyle='#100a18';ctx.fill();
    ctx.save();ctx.clip();ctx.fillStyle='#fffbe6';for(let i=-4;i<=4;i++)poly([[x+i*11-5,y-312],[x+i*11+5,y-312],[x+i*11,y-302]],'#fffbe6',0);ctx.restore();
    rr(x-62,y-418,124,22,4,C.gold,4);for(let i=0;i<5;i++){const bx=x-48+i*24,lit=B.phase===3&&Math.floor(L.t*8+i)%3===0;circ(bx,y-430,11,lit?'#fff3b0':'#5a5a5a',3);rr(bx-5,y-420,10,6,1,C.steel,1.5);}
    if(B.flash>0){circ(x,y-336,76,'rgba(255,250,235,.4)',0);}koStars(B,L,x,y-460);ctx.restore();}});
