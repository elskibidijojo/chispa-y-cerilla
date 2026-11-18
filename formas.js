/* formas.js — bosses TRANSFORM between phases, like in the old cartoons, instead of just adding attacks.
   Island 1 gets real new forms:
   - El Despertador: alarm clock -> furious cuckoo clock house -> a cracked flying head with a pendulum and orbiting gears
   - Maestro Gramófono: gramophone -> silver trumpet on an upright piano -> the horn turns into a giant toothy flower (the box is smashed)
   - Doña Tostada: shiny toaster -> scorched toaster spitting flames -> a runaway toaster LOCOMOTIVE with wheels and a smoking chimney
   - General Cascanueces: soldier -> armoured knight with a sabre -> just the head, bouncing on a jack-in-the-box spring
   Every other boss: a "transformation poof" when changing phase, then it shows the fight on its body
   (phase 2: bandage, sweat and steam; final phase: cracks, darker angry shading and a crown of fire).
   Hitboxes follow the new forms (the clock's legs and the gramophone's box are gone in the last phase, and so on). */
(function(){
const hs=i=>{const s=Math.sin(i*12.9898+78.233)*43758.5453;return s-Math.floor(s);};
function gear(x,y,r,n,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();for(let i=0;i<n*4;i++){const a=i*TAU/(n*4),rr2=(i%4<2)?r*1.22:r;ctx.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2);}ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();circ(0,0,r*.38,C.ink,0);circ(0,0,r*.18,col,0);ctx.restore();}
function flame(x,y,h,w,t,i=0){const f=Math.sin(t*14+i*2.3)*.18;ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w*1.1,y-h*.55,x+w*f*3,y-h);ctx.quadraticCurveTo(x+w*1.1,y-h*.55,x+w,y);ctx.closePath();ctx.fillStyle='#ff7a2e';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-w*.5,y);ctx.quadraticCurveTo(x-w*.5,y-h*.4,x+w*f*2,y-h*.62);ctx.quadraticCurveTo(x+w*.5,y-h*.4,x+w*.5,y);ctx.closePath();ctx.fillStyle='#ffe27a';ctx.fill();}
function cracks(x,y,r,seed,lw=3){ctx.save();ctx.strokeStyle=C.ink;ctx.lineWidth=lw;ctx.lineCap='round';for(let k=0;k<3;k++){const a0=hs(seed+k)*TAU;let px=x+Math.cos(a0)*r*.15,py=y+Math.sin(a0)*r*.15;ctx.beginPath();ctx.moveTo(px,py);for(let j=1;j<=4;j++){const a=a0+(hs(seed+k*9+j)-.5)*.9;px+=Math.cos(a)*r*.2;py+=Math.sin(a)*r*.2;ctx.lineTo(px,py);}ctx.stroke();}ctx.restore();}
function springZ(x1,y1,x2,y2,w,n,lw=5,col=C.steel){ctx.beginPath();ctx.moveTo(x1,y1);for(let i=1;i<n;i++){const k=i/n;ctx.lineTo(x1+(x2-x1)*k+(i%2?w:-w),y1+(y2-y1)*k);}ctx.lineTo(x2,y2);ctx.lineWidth=lw+3;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=lw;ctx.strokeStyle=col;ctx.stroke();}
function begin(B,L){ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);}

/* ================= El Despertador ================= */
function relLegs(B,x,y,cy,col){const walk=B.act?0:Math.sin(B.t*3)*4;for(const s of[-1,1]){const fx=x+s*58,fy=B.act?y-20:y;for(const [lw,c] of[[13,C.ink],[7,col]]){ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.beginPath();ctx.moveTo(x+s*42,cy+92);ctx.quadraticCurveTo(x+s*(70+walk),(cy+92+fy)/2,fx,fy-12);ctx.stroke();}ell(fx+s*10,fy-10,34,15,C.ink,0);}}
function relojCuco(B,L){const x=B.x,y=B.y,cy=relCY(B),shk=B.ring>0?Math.sin(B.t*90)*3:0,cx=x+shk;shadowE(x,GROUND+3,110,B.act?.45:.28);begin(B,L);
  relLegs(B,x,y,cy,C.woodD);
  for(const s of[-1,1]){const sw=Math.sin(B.t*3+s)*10;line(x+s*26,cy+100,x+s*26+sw,cy+150,3,C.steelD);ell(x+s*26+sw,cy+166,11,20,C.woodD,3);for(let j=0;j<3;j++)line(x+s*26+sw-8,cy+156+j*8,x+s*26+sw+8,cy+156+j*8,1.5,'rgba(20,13,8,.6)');}
  for(const s of[-1,1]){const raise=(s<0&&B.throwT>0)?-90:0,gx=x+s*150,gy=cy+40+raise+Math.sin(B.t*3+s)*6;hose(x+s*100,cy+10,x+s*150,cy-10+raise*.4,gx,gy,8);glove(gx,gy,15);}
  rr(cx-105,cy-70,210,180,12,C.wood,6);ctx.save();ctx.beginPath();ctx.roundRect(cx-105,cy-70,210,180,12);ctx.clip();ctx.strokeStyle='rgba(20,13,8,.22)';ctx.lineWidth=2;for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(cx-105+i*26,cy-70);ctx.lineTo(cx-105+i*26,cy+110);ctx.stroke();}ctx.restore();
  poly([[cx-130,cy-58],[cx,cy-178],[cx+130,cy-58]],C.woodD,6);for(let i=0;i<9;i++){const k=i/8;circ(cx-130+k*130,cy-58-k*120,7,C.grassD,2);circ(cx+130-k*130,cy-58-k*120,7,C.grassD,2);}
  const open=B.throwT>0||B.mouth>.3||B.ring>0;rr(cx-20,cy-138,40,38,4,'#2a1a10',3);
  if(open){rr(cx-46,cy-138,24,38,3,C.woodL,3);const bx=cx,by=cy-120-10;line(cx,cy-120,bx,by,3);circ(bx,by-6,15,'#f2c14e',3);poly([[bx+12,by-8],[bx+26,by-4],[bx+12,by]],'#e8562e',2);circ(bx+4,by-10,2.5,C.ink,0);txt('¡CUCÚ!',cx+60,cy-150,16,C.ink,null);}
  else rr(cx-20,cy-138,40,38,4,C.woodL,3);
  circ(cx,cy+12,80,C.paper,5);for(let i=0;i<12;i++){const a=i*TAU/12;line(cx+Math.cos(a)*68,cy+12+Math.sin(a)*68,cx+Math.cos(a)*76,cy+12+Math.sin(a)*76,3);}
  const hh=B.hands||0;line(cx,cy+12,cx+Math.cos(hh*.5-1.6)*38,cy+12+Math.sin(hh*.5-1.6)*38,6);line(cx,cy+12,cx+Math.cos(hh*5-1.6)*60,cy+12+Math.sin(hh*5-1.6)*60,4);circ(cx,cy+12,7,C.rust,3);
  ctx.save();ctx.globalAlpha=.6;cracks(cx+30,cy-10,70,3,2.5);ctx.restore();
  bossFace(B,L,cx,cy-14,.85,{gap:30,ew:17,eh:21,my:50,mw:36,open:B.ring>0?.8:.45});
  for(let i=0;i<2;i++){const k=(B.t*.9+i*.5)%1;ctx.globalAlpha=1-k;circ(cx+(i?60:-60),cy-90-k*60,8+k*12,C.paper,2);}ctx.globalAlpha=1;
  flashOver(B,cx,cy,115);koStars(B,L,cx,cy-190);ctx.restore();}
function relojCabeza(B,L){const x=B.x,cy=relCY(B)-10,t=B.t,shk=Math.sin(t*40)*1.5,cx=x+shk;shadowE(x,GROUND+3,70,.22);begin(B,L);
  const pa=Math.sin(t*3.2)*.55;ctx.save();ctx.translate(cx,cy+60);ctx.rotate(pa);line(0,0,0,130,8,C.ink);line(0,0,0,130,4,C.brassD);circ(0,140,26,C.brass,5);circ(-7,133,7,'rgba(255,255,255,.4)',0);ctx.restore();
  for(let i=0;i<4;i++){const a=t*1.4+i*TAU/4,gx=cx+Math.cos(a)*150,gy=cy+Math.sin(a)*70;gear(gx,gy,18+(i%2)*8,8,t*(i%2?3:-3),i%2?C.brass:C.steel);if(i%2===0)flame(gx,gy-24,26,9,t,i);}
  for(const a of[-2.5,-.4,.9,2.3]){const ex=cx+Math.cos(a)*100,ey=cy+Math.sin(a)*100;springZ(ex,ey,ex+Math.cos(a)*44,ey+Math.sin(a)*44,6,7,3);}
  for(let i=0;i<5;i++)flame(cx-60+i*30,cy-92+Math.abs(i-2)*10,34+Math.sin(t*9+i)*8,12,t,i);
  circ(cx,cy,104,'#5a1f18',7);circ(cx,cy,90,'#f2e3c0',4);for(let i=0;i<60;i+=5){const a=i*Math.PI/30;line(cx+Math.cos(a)*76,cy+Math.sin(a)*76,cx+Math.cos(a)*86,cy+Math.sin(a)*86,3.5);}
  ctx.font=`15px ${FONT}`;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.textBaseline='middle';[['XII',0,-64,.4],['III',64,0,-.6],['VI',0,64,.9],['IX',-64,0,-.3]].forEach(([n,a,c,r])=>{ctx.save();ctx.translate(cx+a,cy+c);ctx.rotate(r+Math.sin(t*5)*.2);ctx.fillText(n,0,0);ctx.restore();});
  line(cx,cy,cx+Math.cos(t*7)*44,cy+Math.sin(t*7)*44,6);line(cx,cy,cx+Math.cos(-t*11)*66,cy+Math.sin(-t*11)*66,4);circ(cx,cy,8,C.rust,3);
  cracks(cx,cy,95,11,3.5);cracks(cx-20,cy+20,80,27,2.5);
  bossFace(B,L,cx,cy-24,.95,{gap:34,ew:19,eh:24,my:56,mw:46,open:.9});
  flashOver(B,cx,cy,110);koStars(B,L,cx,cy-130);ctx.restore();}

/* ================= Maestro Gramófono ================= */
function gramoPiano(B,L){const b=gBell(B),t=B.t;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);shadowE(795,GROUND+3,110,.3);
  rr(700,300,194,146,8,'#231812',5);rr(712,312,170,64,5,'#3a2a20',3);for(let i=0;i<4;i++)circ(735+i*42,344,9,C.brass,2.5);
  rr(706,388,182,34,3,C.white,4);const down=Math.floor(t*9)%13;for(let i=0;i<13;i++){const kx=708+i*14;if(i===down)rr(kx,390,13,32,2,'#d8cbb0',0);line(kx,390,kx,420,1.5);}for(let i=0;i<13;i++)if(i%7!==2&&i%7!==6)rr(714+i*14,388,8,19,2,C.ink,0);
  for(const fx of[716,878])rr(fx-8,440,16,8,3,C.ink,0);
  const ma=Math.sin(t*6)*.5;ctx.save();ctx.translate(868,300);poly([[-14,0],[14,0],[6,-46],[-6,-46]],C.woodL,3);ctx.rotate(ma);line(0,-6,0,-50,3);rr(-5,-36,10,8,2,C.brass,2);ctx.restore();
  for(const [lw,col] of[[34,C.ink],[24,'#c9d1d4']]){ctx.lineWidth=lw;ctx.strokeStyle=col;ctx.beginPath();ctx.moveTo(770,300);ctx.quadraticCurveTo(770,230,b.x+62,b.y+16);ctx.stroke();}
  for(let i=0;i<3;i++){const vx=760+i*0+(i*8),vy=262-i*20,p=Math.sin(t*12+i)*5;rr(vx-6+i*6,vy-18+p,12,16,3,'#e8eef0',2.5);circ(vx+i*6,vy-20+p,6,C.brass,2.5);}
  circ(b.x,b.y,94,'#d8dfe2',5);ctx.lineWidth=2;ctx.strokeStyle='rgba(20,13,8,.35)';for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(b.x,b.y,30+i*20,0,TAU);ctx.stroke();}
  ctx.save();ctx.globalAlpha=.5;ctx.beginPath();ctx.ellipse(b.x-32,b.y-40,26,12,-.6,0,TAU);ctx.fillStyle='#fff';ctx.fill();ctx.restore();
  const vib=(t*3)%1;ctx.globalAlpha=1-vib;ctx.lineWidth=4;ctx.strokeStyle='#fff6c8';ctx.beginPath();ctx.arc(b.x,b.y,96+vib*40,0,TAU);ctx.stroke();ctx.globalAlpha=1;
  bossFace(B,L,b.x,b.y-22,.85,{gap:32,mouth:'o',my:52,mw:40,open:B.mouth});
  flashOver(B,b.x,b.y,94);ctx.restore();}
function gramoFlor(B,L){const b=gBell(B),t=B.t;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';if(B.dead)ctx.translate(Math.sin(L.t*40)*2,0);shadowE(795,GROUND+3,90,.3);
  for(let i=0;i<6;i++){const px=710+i*34+hs(i)*10,py=GROUND-8-hs(i+3)*10;ctx.save();ctx.translate(px,py);ctx.rotate((hs(i+7)-.5)*1.2);rr(-20,-7,40,14,3,i%2?C.wood:C.woodD,3);ctx.restore();}
  ell(797,GROUND-14,26,9,C.brass,3);
  for(let i=0;i<3;i++){const a=t*1.6+i*TAU/3,rx=b.x+Math.cos(a)*150,ry=b.y+40+Math.sin(a)*60;circ(rx,ry,18,'#231812',3);circ(rx,ry,5,C.rust,0);}
  for(const [lw,col] of[[30,C.ink],[20,'#6f9a45']]){ctx.lineWidth=lw;ctx.strokeStyle=col;ctx.beginPath();ctx.moveTo(797,GROUND-14);ctx.bezierCurveTo(780+Math.sin(t*2)*20,330,820,200,b.x+30,b.y+60);ctx.stroke();}
  for(const [lx,ly,s] of[[780,370,-1],[805,290,1]]){ctx.save();ctx.translate(lx,ly);ctx.rotate(s*(.6+Math.sin(t*3)*.15));ell(s*28,0,30,12,'#7eae52',3);ctx.restore();}
  ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.sin(t*1.5)*.08);for(let i=0;i<10;i++){const a=i*TAU/10+Math.sin(t*2+i)*.06;ctx.save();ctx.rotate(a);ctx.beginPath();ctx.moveTo(60,-22);ctx.quadraticCurveTo(140,-36,150+Math.sin(t*4+i)*8,0);ctx.quadraticCurveTo(140,36,60,22);ctx.closePath();ctx.fillStyle=i%2?'#d9407a':'#f07a3a';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}ctx.restore();
  circ(b.x,b.y,82,C.brass,5);circ(b.x,b.y,60,'#3a1418',4);for(let i=0;i<12;i++){const a=i*TAU/12,r1=60,r2=44+B.mouth*6;poly([[b.x+Math.cos(a-.12)*r1,b.y+Math.sin(a-.12)*r1],[b.x+Math.cos(a)*r2,b.y+Math.sin(a)*r2],[b.x+Math.cos(a+.12)*r1,b.y+Math.sin(a+.12)*r1]],C.white,2);}
  face(b.x,b.y-82,.7,{look:lookAt(L,b.x,b.y-82),dead:B.dead,ang:.5,mouth:'none',gap:40});
  flashOver(B,b.x,b.y,92);if(B.dead)for(let i=0;i<3;i++){const a=L.t*4+i*2.1;txt('♪',b.x+Math.cos(a)*70,b.y-140+Math.sin(a)*14,26,C.brass);}ctx.restore();}

/* ================= Doña Tostada ================= */
function tostadaQuemada(B,L){const x=B.x,y=B.y,t=B.t;shadowE(x,GROUND+3,120,.3);begin(B,L);
  for(const s of[-1,1]){hose(x+s*60,y-32,x+s*70,y-16,x+s*70,y-6,10);ell(x+s*78,y-6,26,11,C.ink,0);}
  const pp=(B.pop||0)/.4;for(const sx of[-40,30]){const ty=y-206-pp*46;rr(x+sx-24,ty-30,48,44,12,'#3a2a20',3);rr(x+sx-18,ty-24,36,32,9,'#5a3f2a',0);for(let i=0;i<3;i++)flame(x+sx-14+i*14,ty-28,24+Math.sin(t*10+i+sx)*8,8,t,i+sx);}
  const g=ctx.createLinearGradient(x-115,0,x+115,0);g.addColorStop(0,'#3a3632');g.addColorStop(.35,'#6a655c');g.addColorStop(.65,'#4e4a44');g.addColorStop(1,'#2a2724');rr(x-115,y-200,230,172,34,g,6);
  ctx.save();ctx.beginPath();ctx.roundRect(x-115,y-200,230,172,34);ctx.clip();for(let i=0;i<6;i++){ctx.globalAlpha=.5;ell(x-90+hs(i)*180,y-180+hs(i+4)*140,20+hs(i+8)*20,10+hs(i+2)*8,'#1a1410',0);}ctx.globalAlpha=1;ctx.fillStyle=`rgba(240,90,40,${.18+Math.sin(L.t*10)*.06})`;ctx.fillRect(x-120,y-210,240,190);ctx.restore();
  for(const sx of[-40,30]){rr(x+sx-30,y-206,60,14,6,C.ink,0);rr(x+sx-26,y-203,52,8,4,'#f08a2e',0);}
  rr(x-90,y-90,180,56,10,'#5a1a14',3);for(let i=0;i<5;i++){const dx=x-80+i*40,len=8+((t*30+i*13)%24);ell(dx,y-34+len*.5,5,len*.5,'#f2c14e',0);}
  rr(x+112,y-150+(B.mouth>0?30:0),26,12,5,C.rust,3);
  bossFace(B,L,x-20,y-150,1,{gap:32,ew:16,eh:19,my:42,mw:32,open:.5});
  for(let i=0;i<4;i++){const k=(L.t*.9+i/4)%1;ctx.globalAlpha=1-k;circ(x-70+i*46,y-230-k*90,10+k*16,'#4a4440',2);}ctx.globalAlpha=1;
  if(B.flash>0){ctx.beginPath();ctx.roundRect(x-115,y-200,230,172,34);ctx.fillStyle='rgba(255,250,235,.45)';ctx.fill();}koStars(B,L,x,y-250);ctx.restore();}
function tostadaTren(B,L){const x=B.x,y=B.y,t=B.t,roll=B.act?t*14:t*4;shadowE(x,GROUND+3,135,.32);begin(B,L);
  for(const wx of[-80,0,80]){circ(x+wx,y-26,26,'#2a2420',5);circ(x+wx,y-26,18,C.rust,3);for(let i=0;i<4;i++){const a=roll+i*Math.PI/4;line(x+wx-Math.cos(a)*16,y-26-Math.sin(a)*16,x+wx+Math.cos(a)*16,y-26+Math.sin(a)*16,3);}circ(x+wx,y-26,5,C.brass,2);}
  const ra=roll;line(x-80+Math.cos(ra)*12,y-26+Math.sin(ra)*12,x+80+Math.cos(ra)*12,y-26+Math.sin(ra)*12,6,C.steelD);
  poly([[x-118,y-60],[x-150,y-14],[x-112,y-14]],C.steelD,4);for(let i=0;i<3;i++)line(x-118-i*8,y-56+i*4,x-140+i*6,y-16,2);
  rr(x-115,y-200,230,150,24,'#b8322a',6);ctx.save();ctx.beginPath();ctx.roundRect(x-115,y-200,230,150,24);ctx.clip();ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x-115,y-190,230,14);ctx.fillStyle='rgba(20,13,8,.2)';ctx.fillRect(x-115,y-80,230,30);ctx.restore();
  for(let i=0;i<9;i++)circ(x-100+i*25,y-60,3,C.brass,1.5);rr(x-116,y-100,232,12,3,C.brass,3);
  rr(x-48,y-262,36,64,4,'#2a2420',4);rr(x-56,y-270,52,14,4,'#2a2420',4);for(let i=0;i<4;i++){const k=(L.t*1.2+i/4)%1;ctx.globalAlpha=(1-k)*.9;circ(x-30-k*60,y-286-k*120,14+k*26,'#3a3430',3);}ctx.globalAlpha=1;
  rr(x+40,y-238,46,40,8,'#8a2d23',4);rr(x+48,y-230,30,22,4,'#ffe27a',2);
  const g=ctx.createRadialGradient(x-112,y-130,4,x-112,y-130,70);g.addColorStop(0,'rgba(255,240,170,.85)');g.addColorStop(1,'rgba(255,240,170,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x-112,y-130,70,0,TAU);ctx.fill();circ(x-110,y-130,14,'#fff6c8',4);
  bossFace(B,L,x-10,y-150,1,{gap:34,ew:17,eh:20,my:44,mw:38,open:.6});
  if(Math.floor(L.t*6)%2===0)txt('¡CHU-CHU!',x+40,y-300,15,C.ink,null);
  if(B.flash>0){ctx.beginPath();ctx.roundRect(x-115,y-200,230,150,24);ctx.fillStyle='rgba(255,250,235,.45)';ctx.fill();}koStars(B,L,x,y-300);ctx.restore();}

/* ================= General Cascanueces ================= */
function cascaArmadura(B,L,orig){orig(B,L);const x=B.x,y=B.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
  rr(x-60,y-222,120,108,12,'#b8c0c4',5);ctx.save();ctx.beginPath();ctx.roundRect(x-60,y-222,120,108,12);ctx.clip();ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x-48,y-222,14,108);ctx.restore();
  for(let j=0;j<3;j++)line(x-58,y-190+j*28,x+58,y-190+j*28,2.5,'rgba(20,13,8,.5)');for(let i=0;i<6;i++)circ(x-48+i*19,y-212,3,C.brassD,1.5);
  star(x,y-170,14,6,5);ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
  for(const s of[-1,1])ell(x+s*64,y-212,26,16,'#9aa4a8',4);
  rr(x-48,y-386,96,96,30,'#b8c0c4',5);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x-30,y-380,10,80);for(let i=0;i<3;i++)rr(x-34,y-350+i*10,68,4,2,C.ink,0);
  for(let i=0;i<6;i++){const a=-1.9+i*.15+Math.sin(B.t*5+i)*.05;ctx.save();ctx.translate(x,y-384);ctx.rotate(a);ell(0,-26,8,30,i%2?'#d9302a':'#b5402f',2.5);ctx.restore();}
  const ra=Math.sin(B.t*3)*8,hx=x+80,hy=y-140+ra;ctx.save();ctx.translate(hx,hy);ctx.rotate(-1.1+Math.sin(B.t*2)*.15);rr(-6,-8,12,16,3,C.gold,2.5);ctx.beginPath();ctx.moveTo(-4,-8);ctx.quadraticCurveTo(30,-60,8,-150);ctx.lineTo(4,-150);ctx.quadraticCurveTo(14,-60,-12,-8);ctx.closePath();ctx.fillStyle='#e8eef0';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();glove(hx,hy,13);
  flashOver(B,x,y-200,110);ctx.restore();}
function cascaCabeza(B,L){const x0=B.x,y=B.y,t=B.t,hy=y-230+Math.sin(t*7)*6,x=x0+Math.sin(t*5)*3;shadowE(x0,GROUND+3,60,B.act?.45:.25);begin(B,L);
  rr(x0-40,y-18,80,18,6,'#5a3a20',4);springZ(x0,y-18,x,hy+40,22,9,6);
  const rk=B.throwT>0?-.08:0;hose(x0-10,y-150,x0-60,y-170,x0-100,y-186,8);ctx.save();ctx.translate(x0-60,y-186);ctx.rotate(rk);rr(-110,-8,90,14,4,C.steelD,3);rr(-30,-10,46,20,6,C.woodL,3);ctx.restore();glove(x0-100,y-186,12);
  const jaw=B.mouth*26+Math.abs(Math.sin(t*9))*10;
  rr(x-44,hy+jaw,88,34,12,'#e8bd92',5);for(let i=0;i<5;i++)poly([[x-36+i*16,hy+jaw+2],[x-28+i*16,hy+jaw+14],[x-20+i*16,hy+jaw+2]],C.white,2);
  rr(x-46,hy-76,92,80,16,'#f0c9a0',5);rr(x-34,hy-4,68,10,3,C.ink,0);for(let i=0;i<5;i++)poly([[x-36+i*16,hy+4],[x-28+i*16,hy-8],[x-20+i*16,hy+4]],C.white,2);
  blob(ctx,[[x-24,hy-16,13],[x,hy-20,13],[x+24,hy-16,13]],C.white,3);circ(x-34,hy-32,9,'rgba(230,120,90,.6)',0);circ(x+34,hy-32,9,'rgba(230,120,90,.6)',0);
  face(x,hy-50,.62,{look:lookAt(L,x,hy-50),dead:B.dead,ang:.6,mouth:'none',gap:34});
  rr(x-44,hy-160,88,84,6,C.ink,0);rr(x-50,hy-82,100,10,3,'#2b2420',3);star(x,hy-122,16,7,5);ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
  ell(x,hy-168,12,22,C.rust,3,Math.sin(t*6)*.3);
  ctx.save();ctx.globalAlpha=.8;cracks(x+14,hy-40,55,41,3);ctx.restore();
  flashOver(B,x,hy-40,90);koStars(B,L,x,hy-200);ctx.restore();}

/* ================= registry ================= */
const FORMS={
  reloj:{draw:[null,relojCuco,relojCabeza],shapes:[null,null,B=>[{x:B.x,y:relCY(B)-10,r:108}]]},
  gramo:{draw:[null,gramoPiano,gramoFlor],shapes:[null,null,B=>{const b=gBell(B);return[{x:b.x,y:b.y,r:96}];}]},
  tostada:{draw:[null,tostadaQuemada,tostadaTren]},
  cascanueces:{draw:[null,(B,L,o)=>cascaArmadura(B,L,o),cascaCabeza],shapes:[null,null,B=>{const top=B.y-230;return[{x:B.x-48,y:top-160,w:96,h:200},{x:B.x-16,y:top+40,w:32,h:B.y-top-40}];}]},
};
window.BOSS_FORMS=FORMS;

/* generic: every boss shows the fight on its body */
function shapeBox(B){const sh=B.shapes?B.shapes():[];if(!sh.length){const c=B.center();return{x:c.x-60,y:c.y-60,w:120,h:120,cx:c.x,cy:c.y,r:60};}let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const s=sh[0];
  if(s.w!==undefined){x0=s.x;y0=s.y;x1=s.x+s.w;y1=s.y+s.h;}else{x0=s.x-s.r;y0=s.y-s.r;x1=s.x+s.r;y1=s.y+s.r;}return{x:x0,y:y0,w:x1-x0,h:y1-y0,cx:(x0+x1)/2,cy:(y0+y1)/2,r:Math.min(x1-x0,y1-y0)/2};}
function genericMarks(B,L){if(B.dead||B.phase<1||B.hidden)return;const bx=shapeBox(B),t=L.t,last=B.phase>=B.def.phases.length-1;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  const r=Math.min(bx.r,120);
  ctx.save();ctx.translate(bx.cx-r*.55,bx.cy-r*.45);ctx.rotate(-.6);rr(-20,-7,40,14,4,'#f4e2c4',2.5);ctx.rotate(1.2);rr(-20,-7,40,14,4,'#f4e2c4',2.5);ctx.restore();
  for(let i=0;i<2;i++){const k=(t*1.3+i*.5)%1;ctx.globalAlpha=1-k;ell(bx.cx+r*.7,bx.cy-r*.4+k*30,4,7,'#9fd6ff',1.5);}ctx.globalAlpha=1;
  for(const s of[-1,1]){const k=(t*1.6+(s>0?.5:0))%1;ctx.globalAlpha=(1-k)*.8;circ(bx.cx+s*r*.5+s*k*20,bx.y-6-k*50,6+k*12,'#fffaf0',2);}ctx.globalAlpha=1;
  if(last){cracks(bx.cx+r*.2,bx.cy,r,B.def.id.length*7,3);
    ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.18+.06*Math.sin(t*6);ctx.fillStyle='#b5402f';const sh=B.shapes();ctx.beginPath();for(const s of sh){if(s.w!==undefined)ctx.rect(s.x,s.y,s.w,s.h);else{ctx.moveTo(s.x+s.r,s.y);ctx.arc(s.x,s.y,s.r,0,TAU);}}ctx.fill();ctx.restore();
    for(let i=0;i<5;i++)flame(bx.cx-r*.6+i*r*.3,bx.y+4+Math.abs(i-2)*6,26+Math.sin(t*9+i)*7,10,t,i);}
  ctx.restore();}
function poofT(B,L,cx,cy){if(B._fP===undefined){B._fP=B.phase;B._fT=-9;}if(B._fP!==B.phase){B._fP=B.phase;B._fT=L.t;}const u=(L.t-B._fT)/.55;if(u<0||u>=1)return;
  ctx.save();for(let i=0;i<12;i++){const a=i*TAU/12+.2,rr2=40+u*150;ctx.globalAlpha=(1-u)*.95;circ(cx+Math.cos(a)*rr2,cy+Math.sin(a)*rr2*.8,(30-u*12),'#fffaf0',3);}
  ctx.globalAlpha=1-u;ctx.fillStyle='#fffaf0';circ(cx,cy,Math.max(0,110*(1-u*1.6)),'#fffaf0',0);ctx.globalAlpha=Math.min(1,(1-u)*2);txt('¡POOF!',cx,cy-150-u*30,30,C.ink,null);ctx.restore();}

const _mbl=makeBossLevel;makeBossLevel=function(def){
  if(!def._formas){def._formas=true;const F=FORMS[def.id],od=def.draw,os=def.shapes;
    def.draw=function(B,L){const f=F&&F.draw[B.phase];if(f)f(B,L,od);else od.call(this,B,L);if(!F)try{genericMarks(B,L);}catch(e){}try{const c=B.center();poofT(B,L,c.x,c.y);}catch(e){}};
    if(F&&F.shapes)def.shapes=function(B){const f=F.shapes[B.phase];return f?f(B):os.call(this,B);};}
  return _mbl(def);};
})();
