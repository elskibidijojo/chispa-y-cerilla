'use strict';
/* ================= MAUSOLEOS RENOVADOS (Rollo n.º 10): five crypts with their own look, a living urn, new ghosts ================= */
const MZT={
  mausoleo:{wall:['#2b2236','#4a3d5e'],brick:[96,82,118],floor:'#3a3048',tile:'#2e263b',stone:'#7d7290',stoneD:'#5b5170',win:'rose',fog:[190,170,225],glow:'#ffd36a',light:[255,214,150]},
  mausoleo2:{wall:['#16302f','#2c5552'],brick:[64,108,104],floor:'#1f3a38',tile:'#183230',stone:'#6f8f88',stoneD:'#4b6b66',win:'arches',fog:[170,225,215],glow:'#bff5e6',light:[190,250,235],roots:true},
  mausoleo3:{wall:['#160d22','#38204a'],brick:[80,52,104],floor:'#26173a',tile:'#1d112d',stone:'#6e5a86',stoneD:'#4d3d63',win:'moon',fog:[160,120,200],glow:'#ffe6a0',light:[255,235,190],bats:true},
  mausoleo4:{wall:['#141c2c','#2c3a56'],brick:[66,82,112],floor:'#1e2638',tile:'#171e2d',stone:'#6c7a96',stoneD:'#4a5672',win:'storm',fog:[150,170,210],glow:'#ffdd88',light:[220,230,255],rain:true,chandelier:true},
  mausoleo5:{wall:['#1a2a3e','#3d6080'],brick:[96,140,176],floor:'#2c4660',tile:'#24394f',stone:'#a9cbe0',stoneD:'#6f97b3',win:'aurora',fog:[210,235,255],glow:'#c8f0ff',light:[200,240,255],ice:true}};
const MZBG={};
function mzPaint(id){if(MZBG[id])return MZBG[id];const T=MZT[id]||MZT.mausoleo,[c,g]=mk(W,H),r=srand(id.length*97+11);g.lineJoin='round';g.lineCap='round';
  const gr=g.createLinearGradient(0,0,0,GROUND);gr.addColorStop(0,T.wall[0]);gr.addColorStop(1,T.wall[1]);g.fillStyle=gr;g.fillRect(0,0,W,GROUND);
  /* bricks with a little variety, cracks and moss */
  for(let y=0,row=0;y<GROUND;y+=28,row++)for(let x=(row%2)*36-36;x<W;x+=72){const k=.75+r()*.5,[R,G,Bc]=T.brick;g.fillStyle=`rgba(${R*k|0},${G*k|0},${Bc*k|0},.55)`;g.fillRect(x+2,y+2,68,24);
    if(r()<.07){g.strokeStyle='rgba(10,6,4,.45)';g.lineWidth=2;g.beginPath();g.moveTo(x+10+r()*40,y+2);g.lineTo(x+20+r()*30,y+14);g.lineTo(x+14+r()*40,y+26);g.stroke();}
    if(T.roots&&r()<.05){g.fillStyle='rgba(80,140,90,.45)';g.beginPath();g.ellipse(x+36,y+24,26,6,0,0,TAU);g.fill();}}
  /* the big window at the back */
  const wx=W/2,wy=150;g.save();
  if(T.win==='rose'){gE(g,wx,wy,98,98,'#1a1222',6);const cs=['#b5402f','#d9a441','#3a72b0','#6b4a7a','#2e8f86'];for(let i=0;i<12;i++){const a0=i*TAU/12,a1=a0+TAU/12;g.beginPath();g.moveTo(wx,wy);g.arc(wx,wy,86,a0,a1);g.closePath();g.fillStyle=cs[i%5];g.globalAlpha=.75;g.fill();g.globalAlpha=1;g.lineWidth=4;g.strokeStyle=C.ink;g.stroke();}
    gE(g,wx,wy,30,30,'#f2c14e',4);for(let i=0;i<8;i++){const a=i*TAU/8;gE(g,wx+Math.cos(a)*58,wy+Math.sin(a)*58,10,10,'#fff3c4',3);}}
  else if(T.win==='arches'){for(const dx of[-130,0,130]){g.beginPath();g.moveTo(wx+dx-44,wy+90);g.lineTo(wx+dx-44,wy-20);g.arc(wx+dx,wy-20,44,Math.PI,0);g.lineTo(wx+dx+44,wy+90);g.closePath();g.fillStyle='#0c1c1c';g.fill();g.lineWidth=5;g.strokeStyle=C.ink;g.stroke();
      const fg=g.createLinearGradient(0,wy-60,0,wy+90);fg.addColorStop(0,'rgba(190,250,235,.35)');fg.addColorStop(1,'rgba(190,250,235,0)');g.fillStyle=fg;g.fill();}}
  else if(T.win==='moon'){g.translate(0,70);g.beginPath();g.moveTo(wx-150,0);g.lineTo(wx-110,70);g.lineTo(wx-60,40);g.lineTo(wx-20,95);g.lineTo(wx+30,50);g.lineTo(wx+90,88);g.lineTo(wx+150,0);g.closePath();g.fillStyle='#0b0718';g.fill();
    const mg=g.createRadialGradient(wx+30,40,10,wx+30,40,120);mg.addColorStop(0,'rgba(255,240,200,.55)');mg.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=mg;g.fill();gE(g,wx+30,36,42,42,'#fff3d0',0);gE(g,wx+18,26,8,6,'rgba(200,180,140,.5)',0);gE(g,wx+44,50,10,7,'rgba(200,180,140,.5)',0);
    for(let i=0;i<14;i++)gE(g,wx-130+r()*260,8+r()*60,1.6,1.6,'#fff',0);g.lineWidth=5;g.strokeStyle=C.ink;g.stroke();}
  else if(T.win==='storm'){for(const dx of[-150,150]){gR(g,wx+dx-50,wy-80,100,170,'#0a0f1c',6,40);for(let i=1;i<3;i++){g.fillStyle=C.ink;g.fillRect(wx+dx-50+i*33-2,wy-80,4,170);}g.fillRect(wx+dx-50,wy,100,4);}
    gR(g,wx-60,wy-110,120,200,'#0a0f1c',6,60);for(let i=0;i<5;i++)g.fillRect(wx-60,wy-60+i*36,120,3);}
  else if(T.win==='aurora'){g.translate(0,50);g.beginPath();g.ellipse(wx,wy-40,170,90,0,Math.PI,0);g.closePath();g.fillStyle='#0b1830';g.fill();g.lineWidth=6;g.strokeStyle=C.ink;g.stroke();
    for(let i=0;i<20;i++)gE(g,wx-150+r()*300,wy-110+r()*60,1.5,1.5,'#fff',0);for(let i=0;i<7;i++){g.fillStyle=C.ink;g.fillRect(wx-150+i*50,wy-125,4,90);}}
  g.restore();
  /* pillars with capitals and statues in alcoves */
  for(const x of[150,810]){g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.moveTo(x-70,GROUND);g.lineTo(x-70,200);g.arc(x,200,70,Math.PI,0);g.lineTo(x+70,GROUND);g.closePath();g.fill();g.lineWidth=5;g.strokeStyle=C.ink;g.stroke();
    /* statue: a hooded keeper holding a lantern */
    g.fillStyle=T.stoneD;g.beginPath();g.moveTo(x-34,GROUND-6);g.quadraticCurveTo(x-40,GROUND-120,x-18,GROUND-170);g.quadraticCurveTo(x,GROUND-200,x+18,GROUND-170);g.quadraticCurveTo(x+40,GROUND-120,x+34,GROUND-6);g.closePath();g.fill();g.lineWidth=4;g.stroke();
    gE(g,x,GROUND-160,16,20,'#120c16',0);gE(g,x-6,GROUND-162,3,3,'rgba(255,220,150,.6)',0);gE(g,x+6,GROUND-162,3,3,'rgba(255,220,150,.6)',0);gR(g,x-50,GROUND-10,100,14,T.stone,3.5,3);}
  for(const x of[300,660]){const pg=g.createLinearGradient(x-26,0,x+26,0);pg.addColorStop(0,T.stoneD);pg.addColorStop(.45,T.stone);pg.addColorStop(1,T.stoneD);g.fillStyle=pg;g.fillRect(x-24,64,48,GROUND-64);g.lineWidth=4;g.strokeStyle=C.ink;g.strokeRect(x-24,64,48,GROUND-64);
    for(let i=1;i<4;i++){g.strokeStyle='rgba(20,13,8,.3)';g.lineWidth=2;g.beginPath();g.moveTo(x-24+i*12,70);g.lineTo(x-24+i*12,GROUND-4);g.stroke();}
    gR(g,x-36,46,72,22,T.stone,4,4);gR(g,x-30,30,60,18,T.stoneD,3.5,4);gR(g,x-34,GROUND-20,68,20,T.stone,4,4);
    if(T.ice){for(let i=0;i<5;i++){const ix=x-28+i*14;gP(g,[[ix-5,68],[ix+5,68],[ix,96+r()*30]],'#dff6ff',2);}}
    if(T.roots){g.strokeStyle='#3e5e3a';g.lineWidth=5;g.beginPath();g.moveTo(x-24,90);g.bezierCurveTo(x-10,140,x+20,170,x+8,240);g.stroke();g.lineWidth=3;g.beginPath();g.moveTo(x+24,200);g.bezierCurveTo(x+8,250,x-14,280,x-6,330);g.stroke();}}
  /* cobwebs in the corners */
  for(const s of[1,-1]){const cx=s>0?0:W;g.strokeStyle='rgba(230,225,240,.35)';g.lineWidth=1.5;for(let i=0;i<=6;i++){const a=i*Math.PI/12;g.beginPath();g.moveTo(cx,0);g.lineTo(cx+s*Math.cos(a)*120,Math.sin(a)*120);g.stroke();}
    for(const R of[40,70,100]){g.beginPath();for(let i=0;i<=6;i++){const a=i*Math.PI/12,px=cx+s*Math.cos(a)*R*(i%2?.92:1),py=Math.sin(a)*R*(i%2?.92:1);i?g.lineTo(px,py):g.moveTo(px,py);}g.stroke();}}
  /* floor: big slabs with a soft shine and the urn's dais */
  g.fillStyle=T.floor;g.fillRect(0,GROUND,W,H-GROUND);for(let i=0;i<10;i++){g.fillStyle=i%2?T.tile:T.floor;g.fillRect(i*96,GROUND+4,96,H-GROUND);}
  const sh=g.createLinearGradient(0,GROUND,0,H);sh.addColorStop(0,'rgba(255,255,255,.08)');sh.addColorStop(1,'rgba(0,0,0,.3)');g.fillStyle=sh;g.fillRect(0,GROUND,W,H-GROUND);g.fillStyle=C.ink;g.fillRect(0,GROUND,W,5);
  /* chains hanging from the ceiling */
  for(const x of[230,730]){g.strokeStyle='#1a1418';g.lineWidth=3;for(let y=0;y<120;y+=12){g.beginPath();g.ellipse(x,y+6,4,7,0,0,TAU);g.stroke();}}
  MZBG[id]=c;return c;}
/* a soft fog band, painted once and scrolled */
let MZFOG=null;
function mzFog(){if(MZFOG)return MZFOG;const [c,g]=mk(W*2,140);for(let i=0;i<40;i++){const x=(i/40)*W*2,y=60+Math.sin(i*1.7)*25,rr2=70+((i*37)%50),gg=g.createRadialGradient(x,y,4,x,y,rr2);gg.addColorStop(0,'rgba(255,255,255,.22)');gg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gg;g.fillRect(x-rr2,y-rr2,rr2*2,rr2*2);}MZFOG=c;return c;}

function mzUrn(L){const u=L.urn,t=L.t;let near=9999;for(const e of L.eb)if(e.maus&&!e.dead)near=Math.min(near,dist(e.x,e.y,u.x,u.y));
  const fear=near<130?2:near<260?1:0,sx=(rand()-.5)*(u.shake*8+(fear===2?2.5:0)),glow=u.glow||0;ctx.save();ctx.translate(u.x+sx,0);ctx.lineJoin='round';ctx.lineCap='round';
  /* dais: three steps */
  rr(-110,GROUND-14,220,14,3,'#5c5268',3.5);rr(-84,GROUND-28,168,14,3,'#6d6378',3.5);rr(-60,GROUND-42,120,14,3,'#7f7690',3.5);
  /* aura that grows with every rescued soul */
  if(glow>0){ctx.globalAlpha=Math.min(.55,glow*.12);circ(0,GROUND-104,70+Math.sin(t*4)*6,'#bff5e6',0);ctx.globalAlpha=1;}
  if(fear){ctx.globalAlpha=.25+Math.sin(t*(fear===2?20:8))*.15;ctx.beginPath();ctx.arc(0,GROUND-100,84,0,TAU);ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.strokeStyle=fear===2?C.rust:C.gold;ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
  const y0=GROUND-42,body=u.cracked?'#8a7650':'#d9a441',dark=u.cracked?'#6a5a3a':'#a8772a';
  /* handles */
  for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*30,y0-96);ctx.bezierCurveTo(s*64,y0-104,s*66,y0-60,s*40,y0-48);ctx.lineWidth=10;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=5;ctx.strokeStyle=dark;ctx.stroke();}
  /* body */
  ctx.beginPath();ctx.moveTo(-22,y0);ctx.quadraticCurveTo(-30,y0-10,-24,y0-18);ctx.bezierCurveTo(-58,y0-40,-58,y0-90,-28,y0-104);ctx.lineTo(28,y0-104);ctx.bezierCurveTo(58,y0-90,58,y0-40,24,y0-18);ctx.quadraticCurveTo(30,y0-10,22,y0);ctx.closePath();
  const ug=ctx.createLinearGradient(-50,0,50,0);ug.addColorStop(0,dark);ug.addColorStop(.4,body);ug.addColorStop(.7,'#f6d27a');ug.addColorStop(1,dark);ctx.fillStyle=ug;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
  rr(-44,y0-62,88,10,3,dark,2.5);for(let i=0;i<6;i++)circ(-35+i*14,y0-57,2.5,'#fff3c4',0);
  /* lid and knob */
  rr(-32,y0-116,64,14,5,dark,3.5);ell(0,y0-120,22,8,body,3.5);circ(0,y0-134,9,'#f6d27a',3);
  /* the gem: pulses brighter with each soul */
  const gemC=fear===2?'#ff6a5a':'#5fd3c8';circ(0,y0-30,9+Math.sin(t*5)*1,gemC,3);ell(-3,y0-33,3,2,'rgba(255,255,255,.8)',0);
  /* face: calm, worried, terrified */
  const fy=y0-82;if(fear===0){ell(-12,fy,4,6,C.ink,0);ell(12,fy,4,6,C.ink,0);ctx.beginPath();ctx.moveTo(-9,fy+14);ctx.quadraticCurveTo(0,fy+21,9,fy+14);ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
      if(Math.floor(t*.6)%5===0&&(t*.6)%1<.12){line(-16,fy,-8,fy,2.5);line(8,fy,16,fy,2.5);}}
  else if(fear===1){ell(-12,fy,6,8,'#fff',2.5);ell(12,fy,6,8,'#fff',2.5);circ(-12+Math.sin(t*3)*2,fy+1,3,C.ink,0);circ(12+Math.sin(t*3)*2,fy+1,3,C.ink,0);ctx.beginPath();for(let i=0;i<=6;i++)ctx.lineTo(-10+i*3.3,fy+16+(i%2?-3:3));ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}
  else{ell(-12,fy-2,7,9,'#fff',2.5);ell(12,fy-2,7,9,'#fff',2.5);circ(-12,fy-1,2,C.ink,0);circ(12,fy-1,2,C.ink,0);ell(0,fy+17,7,9,C.ink,0);
    for(const s of[-1,1]){const k=(t*1.6+(s>0?.5:0))%1;ctx.globalAlpha=1-k;ell(s*30,fy-8+k*30,3,5,'#9fd8ff',1.5);ctx.globalAlpha=1;}}
  if(u.cracked){line(-14,y0-100,4,y0-76,3);line(4,y0-76,-8,y0-52,3);line(-8,y0-52,6,y0-30,3);}
  ctx.restore();}

/* the ghosts of the crypt: sheets with wavy tails that look at the urn */
const _drawSprMZ=drawSpr;
drawSpr=function(e,t){if(!e.maus){_drawSprMZ(e,t);return;}const r=22,on=!(e.cool>0),fast=e.spd>(e.spdBase||e.spd)*1.2||e.fastG;
  if(e.trail)e.trail.forEach((q,i)=>{ctx.globalAlpha=(i+1)/e.trail.length*.28;circ(q.x,q.y,r*(.4+i/e.trail.length*.4),on?'#bff5e6':'#c9c2d6',0);});ctx.globalAlpha=1;
  const u=LV&&LV.urn,ang=u?Math.atan2(u.y-e.y,u.x-e.x):0,face=Math.cos(ang)<0?-1:1;ctx.save();ctx.translate(e.x,e.y+Math.sin(t*6+(e.ph||0))*3);ctx.lineJoin='round';ctx.lineCap='round';
  const body=on?'#e9fffb':'#d8d2e6',col=on?C.parry:'#9a90b0';ctx.globalAlpha=.92;
  ctx.beginPath();ctx.moveTo(-r,4);ctx.quadraticCurveTo(-r,-r*1.25,0,-r*1.25);ctx.quadraticCurveTo(r,-r*1.25,r,4);for(let i=0;i<=4;i++){const x=r-i*(r*2/4),w=Math.sin(t*10+i+(e.ph||0))*4;ctx.lineTo(x,r*.9+(i%2?-6:4)+w);}ctx.closePath();
  ctx.fillStyle=body;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ctx.globalAlpha=1;
  for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*r*.8,-2);ctx.quadraticCurveTo(s*(r+10),-6+Math.sin(t*8+s)*4,s*(r+4),8);ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}
  const ex=Math.cos(ang)*3,ey=Math.sin(ang)*2;ell(-8,-8,5,7,'#1a1222',0);ell(8,-8,5,7,'#1a1222',0);circ(-8+ex,-9+ey,2,fast?'#ff6a5a':'#9ff0e6',0);circ(8+ex,-9+ey,2,fast?'#ff6a5a':'#9ff0e6',0);
  ell(0,6,4,5+Math.sin(t*9)*1.5,'#1a1222',0);ctx.restore();
  if(on){ctx.beginPath();ctx.arc(e.x,e.y,r+9+Math.sin(t*12)*2,0,TAU);ctx.lineWidth=2.5;ctx.strokeStyle='rgba(159,240,230,.8)';ctx.stroke();}};

const _makeMausMZ=makeMaus;
makeMaus=function(id){const L=_makeMausMZ(id),T=MZT[id]||MZT.mausoleo,up0=L.update;L.urn.glow=0;L.souls=[];L.flashT=0;L.bats=[];
  L.update=dt=>{up0(dt);for(const e of L.eb){if(!e.maus||e.dead)continue;if(e.spdBase==null){e.spdBase=e.spd;e.fastG=false;}if(e.spd>e.spdBase*1.2)e.fastG=true;e.trT=(e.trT||0)-dt;if(e.trT<=0){e.trT=.05;(e.trail=e.trail||[]).push({x:e.x,y:e.y});if(e.trail.length>7)e.trail.shift();}}
    for(const s of L.souls){s.t+=dt;const k=Math.min(1,s.t/.7),e2=k*k*(3-2*k);s.x=lerp(s.x0,L.urn.x,e2)+Math.sin(k*Math.PI)*s.curve;s.y=lerp(s.y0,L.urn.y-40,e2)-Math.sin(k*Math.PI)*80;if(k>=1&&!s.done){s.done=true;L.urn.glow=Math.min(4,L.urn.glow+.6);sfx('ding');}}
    L.souls=L.souls.filter(s=>s.t<.9);L.urn.glow=Math.max(0,L.urn.glow-dt*.25);
    if(T.win==='storm'){L.flashT-=dt;if(L.flashT<=-4-rand()*3){L.flashT=.18;sfx('boom');}}
    if(T.bats&&rand()<dt*.25)L.bats.push({x:-30,y:60+rand()*120,t:0,v:160+rand()*80});for(const b of L.bats){b.t+=dt;b.x+=b.v*dt;}L.bats=L.bats.filter(b=>b.x<W+40);};
  /* background: the painted crypt plus light shafts, flickering candles, fog, rain, aurora, bats */
  L.drawBG=()=>{const t=L.t,[lr,lg,lb]=T.light;ctx.drawImage(mzPaint(id),0,0,W,H);
    if(T.win==='aurora'){for(let i=0;i<3;i++){ctx.beginPath();for(let x=-170;x<=170;x+=10){const y=160+Math.sin(x*.02+t*.8+i)*14+i*12;x===-170?ctx.moveTo(W/2+x,y):ctx.lineTo(W/2+x,y);}ctx.lineWidth=10-i*2;ctx.strokeStyle=['rgba(120,255,190,.35)','rgba(140,200,255,.3)','rgba(220,140,255,.25)'][i];ctx.stroke();}}
    if(T.win==='storm'&&L.flashT>0){ctx.fillStyle='rgba(230,240,255,.85)';for(const dx of[-150,150])ctx.fillRect(W/2+dx-48,72,96,166);ctx.fillRect(W/2-58,42,116,196);}
    /* god rays from the window */
    ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const a=.05+.035*Math.sin(t*.7+i*1.7),x0=W/2-60+i*40;ctx.fillStyle=`rgba(${lr},${lg},${lb},${a})`;ctx.beginPath();ctx.moveTo(x0,120);ctx.lineTo(x0+30,120);ctx.lineTo(x0+150+i*30,GROUND);ctx.lineTo(x0-40+i*30,GROUND);ctx.closePath();ctx.fill();}ctx.restore();
    if(L.flashT>0){ctx.fillStyle='rgba(220,230,255,.18)';ctx.fillRect(0,0,W,H);}
    /* candles on the statues' lanterns and at the foot of the pillars */
    for(const [x,y] of[[150,GROUND-176],[810,GROUND-176],[276,GROUND-26],[684,GROUND-26],[324,GROUND-26],[636,GROUND-26]]){const f=.75+Math.sin(t*13+x)*.15+Math.sin(t*29+x*2)*.1;circ(x,y-10,34*f,`rgba(${lr},${lg},${lb},.10)`,0);rr(x-4,y-8,8,18,2,'#efe0bf',2);ell(x,y-14,3.5*f,8*f,T.glow,0);ell(x,y-12,1.5,4*f,'#fff',0);}
    /* bats crossing the moon */
    for(const b of L.bats){const w=Math.sin(b.t*20)*8;ctx.save();ctx.translate(b.x,b.y+Math.sin(b.t*4)*10);poly([[0,0],[-14,-6-w],[-24,2],[-12,0],[-6,6]],'#0b0610',0);poly([[0,0],[14,-6-w],[24,2],[12,0],[6,6]],'#0b0610',0);circ(0,1,5,'#0b0610',0);ctx.restore();}
    /* stone ledges for the platforms (they used to be invisible) */
    for(const s of L.solids){if(!s.oneWay)continue;rr(s.x-6,s.y,s.w+12,16,4,T.stone,3.5);rr(s.x,s.y+16,s.w,8,2,T.stoneD,3);for(const bx of[s.x+18,s.x+s.w-18])poly([[bx-10,s.y+24],[bx+10,s.y+24],[bx,s.y+48]],T.stoneD,3);
      const cx=s.x+s.w/2,f=.75+Math.sin(t*11+cx)*.2;circ(cx,s.y-16,24*f,`rgba(${lr},${lg},${lb},.10)`,0);rr(cx-4,s.y-14,8,14,2,'#efe0bf',2);ell(cx,s.y-19,3*f,7*f,T.glow,0);
      if(T.ice)for(let i=0;i<4;i++)poly([[s.x+10+i*30,s.y+24],[s.x+20+i*30,s.y+24],[s.x+15+i*30,s.y+40+(i%2)*10]],'#dff6ff',2);}
    /* rolling fog over the floor */
    const fog=mzFog(),[fr,fg2,fb]=T.fog,off=(t*22)%W;ctx.save();ctx.globalAlpha=.55;ctx.drawImage(fog,-off,GROUND-110,W*2,140);ctx.globalAlpha=.3;ctx.drawImage(fog,-(t*12+300)%W,GROUND-150,W*2,140);ctx.restore();
    ctx.fillStyle=`rgba(${fr},${fg2},${fb},.06)`;ctx.fillRect(0,GROUND-60,W,60);};
  L.drawWorld=()=>{mzUrn(L);for(const s of L.souls){if(s.t>.7)continue;ctx.globalAlpha=.9;circ(s.x,s.y,7,'#bff5e6',2);circ(s.x,s.y,3,'#fff',0);ctx.globalAlpha=.35;circ(s.x,s.y,14,'#bff5e6',0);ctx.globalAlpha=1;}};
  L.drawFG=()=>{const t=L.t;if(T.rain){ctx.save();ctx.strokeStyle='rgba(190,210,255,.25)';ctx.lineWidth=1.5;for(let i=0;i<50;i++){const x=(i*97+t*240)%(W+60)-30,y=(i*53+t*700)%(H+40)-40;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-6,y+18);ctx.stroke();}ctx.restore();}
    if(T.ice){ctx.save();ctx.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<30;i++){const x=(i*131+Math.sin(t+i)*30+t*20)%W,y=(i*71+t*50)%H;ctx.beginPath();ctx.arc(x,y,1.6+(i%3)*.6,0,TAU);ctx.fill();}ctx.restore();}
    if(T.chandelier){const a=Math.sin(t*1.3)*.12;ctx.save();ctx.translate(W/2,0);ctx.rotate(a);line(0,0,0,70,3);rr(-60,70,120,10,4,C.brassD,3);for(const dx of[-50,-25,0,25,50]){rr(dx-3,58,6,12,1,'#efe0bf',1.5);ell(dx,54,2.5,5,T.glow,0);}ctx.restore();}
    /* the plaque: ghosts left and the wave pips */
    const left=L.total-(L.spawned-L.eb.filter(e=>e.maus&&!e.dead).length),nw=LEVELS[id].waves.length;card(W/2-130,18,260,48,C.paper,3.5,10);
    ctx.save();ctx.translate(W/2-94,42);ctx.scale(.7,.7);ctx.beginPath();ctx.moveTo(-18,4);ctx.quadraticCurveTo(-18,-24,0,-24);ctx.quadraticCurveTo(18,-24,18,4);for(let i=0;i<=4;i++)ctx.lineTo(18-i*9,16+(i%2?-5:3));ctx.closePath();ctx.fillStyle='#e9fffb';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ell(-6,-8,3,4,C.ink,0);ell(6,-8,3,4,C.ink,0);ctx.restore();
    txt(`× ${left}`,W/2-30,42,20,C.ink,null);for(let i=0;i<nw;i++){const on=i<L.wave,cur=i===L.wave;circ(W/2+50+i*24,42,8,on?'#2e8f86':cur?C.gold:'rgba(20,13,8,.12)',2.5);}
    if(L.t<8){ctx.globalAlpha=Math.min(1,(8-L.t));btxt('No puedes disparar: salta sobre los fantasmas y haz parry antes de que toquen la urna',W/2,84,14,C.paper,'center',800);ctx.globalAlpha=1;}};
  return L;};
/* every parried ghost becomes a little soul that flies into the urn */
const _doParryMZ=doParry;
doParry=function(L,p,o){_doParryMZ(L,p,o);if(o&&o.maus&&L.urn&&L.souls){L.souls.push({x0:o.x,y0:o.y,x:o.x,y:o.y,t:0,curve:(rand()-.5)*160});pop(L,o.x,o.y-36,pick(['¡FUERA!','¡BÚ!','¡PAF!','¡A DORMIR!']),C.parryL);}};
