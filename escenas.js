/* escenas.js — every boss fight's background now changes with the phases, like the big
   transformations in the old rubber-hose cartoons:
   - phase 2: the stage turns to a warm (or eerie) light, with spinning rays behind the boss,
     drifting background shapes and floating dust
   - final phase: the world falls away into a swirling hypnotic spiral behind the boss, with
     lightning, a spotlight and a dark vignette
   - the change itself plays an ink-splash transition from the boss
   - the camera always breathes and sways a little, and a bit more when things get serious
   Everything here is drawing only, so online play stays in sync. */
(function(){
const PAL={1:['#ffcf7a','#e8562e','#7a3a1a'],2:['#7ad8d0','#2f7aa0','#123a52'],3:['#c08aff','#5a2a8a','#1a0f2a'],4:['#bfe9ff','#5aa8e8','#1a2a4a'],5:['#ff8a8a','#2f7a4a','#3a0f1a']};
function pal(L){const d=LEVELS[L.id];return PAL[d&&d.isl]||PAL[1];}
function phaseInfo(L){const B=L.boss;if(!B)return null;if(L._bgP===undefined){L._bgP=B.phase;L._bgT=-9;}if(B.phase!==L._bgP){L._bgP=B.phase;L._bgT=L.t;}
  const n=(B.def&&B.def.phases?B.def.phases.length:3);return{ph:B.phase,n,last:B.phase>0&&B.phase>=n-1,age:L.t-L._bgT};}
function rays(cx,cy,t,c1,a,n=14){ctx.save();ctx.translate(cx,cy);ctx.rotate(t);ctx.globalAlpha=a;ctx.fillStyle=c1;for(let i=0;i<n;i++){ctx.rotate(TAU/n);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(1100,-70);ctx.lineTo(1100,70);ctx.closePath();ctx.fill();}ctx.restore();}
function spiral(cx,cy,t,c1,c2,a){ctx.save();ctx.translate(cx,cy);ctx.globalAlpha=a;ctx.fillStyle=c2;ctx.fillRect(-1200,-1200,2400,2400);ctx.rotate(t*.9);ctx.fillStyle=c1;
  for(let arm=0;arm<5;arm++){ctx.beginPath();for(let k=0;k<=64;k++){const th=k*.11+arm*TAU/5,r=k*17;ctx.lineTo(Math.cos(th)*r,Math.sin(th)*r);}for(let k=64;k>=0;k--){const th=k*.11+arm*TAU/5+.55,r=k*17;ctx.lineTo(Math.cos(th)*r,Math.sin(th)*r);}ctx.closePath();ctx.fill();ctx.lineWidth=4;ctx.strokeStyle='rgba(20,13,8,.45)';ctx.stroke();}
  const g2=ctx.createRadialGradient(0,0,10,0,0,160);g2.addColorStop(0,'rgba(255,240,200,.55)');g2.addColorStop(1,'rgba(255,240,200,0)');ctx.fillStyle=g2;ctx.beginPath();ctx.arc(0,0,160,0,TAU);ctx.fill();
  ctx.restore();}

/* ---- final-phase moods: every boss gets its own last-phase world instead of the same spiral ---- */
const MOOD={reloj:'espiral',gramo:'espiral',trompo:'espiral',radio:'espiral',tombola:'fiesta',
  faro:'tormenta',ballena:'tormenta',paraguas:'tormenta',pulpo:'tormenta',buzo:'tormenta',pezvolador:'tormenta',globoaero:'tormenta',baron:'tormenta',
  caldera:'infierno',volcana:'infierno',maquina:'infierno',hollin:'infierno',cafetera:'infierno',tostada:'infierno',jengibre:'infierno',cometa:'infierno',
  buho:'cosmos',murcielago:'cosmos',aurora:'cosmos',linterna:'cosmos',gargola:'cosmos',escoba:'cosmos',libelula:'cosmos',
  chistera:'teatro',cascanueces:'teatro',sota:'teatro',reina:'teatro',rey:'teatro',as:'teatro',proyec:'teatro',maquina2:'teatro',
  tempano:'hielo',pinguino:'hielo',heladero:'hielo',termometro:'hielo',trineo:'hielo',abeto:'hielo',
  espantapajaros:'pesadilla',cuervo:'pesadilla',polilla:'pesadilla',sombra:'pesadilla',topo:'pesadilla',
  canica:'fiesta',bolos:'fiesta',diana:'fiesta',caja:'fiesta',globo:'fiesta',
  apagon:'eclipse',rascacielos:'eclipse',vela:'eclipse',cangrejo:'tinta'};
const MOODS=['espiral','tormenta','infierno','cosmos','teatro','hielo','pesadilla','fiesta','eclipse','tinta'];
function moodOf(id){if(MOOD[id])return MOOD[id];let h=0;for(const ch of id)h=(h*31+ch.charCodeAt(0))|0;return MOODS[Math.abs(h)%MOODS.length];}
window.bossMood=moodOf;
const hs=i=>{const s=Math.sin(i*12.9898+78.233)*43758.5453;return s-Math.floor(s);};
const gy=plane=>plane?H:GROUND;
function darkHole(a,cx,cy,rx,ry,col='0,0,0'){ctx.save();ctx.globalAlpha=1;ctx.fillStyle=`rgba(${col},${a})`;ctx.beginPath();ctx.rect(-50,-50,W+100,H+100);ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.fill('evenodd');ctx.restore();}
function bolt(x,y0,y1,seed,w=3,col='#fff6c8'){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x,y0);let xx=x;const n=7;for(let i=1;i<=n;i++){xx+=(hs(seed*7+i)-.5)*70;ctx.lineTo(xx,y0+(y1-y0)*i/n);}ctx.stroke();}
function mTormenta(L,cx,cy,t,k,plane){const g=gy(plane);
  ctx.globalAlpha=.6*k;ctx.fillStyle='#121829';ctx.fillRect(0,0,W,g);
  for(let i=0;i<9;i++){const x=((i*157+t*(18+i%3*8))%(W+260))-160,y=10+(i%4)*34;ctx.globalAlpha=.85*k;cloudShape(ctx,x,y,1.1+(i%3)*.35,i%2?'#2b3352':'#363f63',0);}
  ctx.globalAlpha=.4*k;ctx.strokeStyle='#c8dcff';ctx.lineWidth=1.6;ctx.beginPath();for(let i=0;i<110;i++){const x=(hs(i)*(W+300)+t*260)%(W+300)-150,y=(hs(i+50)*g+t*(700+hs(i+9)*300))%g;ctx.moveTo(x,y);ctx.lineTo(x-9,y+26);}ctx.stroke();
  const cyc=2.3,n=Math.floor(t/cyc),f=t-n*cyc;if(f<.22){const x=80+hs(n)*(W-160);ctx.globalAlpha=(.22-f)/.22*.35;ctx.fillStyle='#e8f0ff';ctx.fillRect(0,0,W,g);ctx.globalAlpha=1;bolt(x,0,g*.75,n,5,'#fffbe0');bolt(x,0,g*.75,n,2,'#ffffff');}
  for(let i=0;i<4;i++){const x=((i*251+t*40)%(W+200))-100;ctx.globalAlpha=.25*k;ctx.fillStyle='#0b0f1c';ctx.beginPath();ctx.ellipse(x,g-8,160,26,0,0,TAU);ctx.fill();}}
function mInfierno(L,cx,cy,t,k,plane){const g=gy(plane);
  ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.55*k;ctx.fillStyle='#ff7a3a';ctx.fillRect(0,0,W,g);ctx.globalCompositeOperation='source-over';
  const gr=ctx.createLinearGradient(0,0,0,g);gr.addColorStop(0,'rgba(60,0,0,.55)');gr.addColorStop(.6,'rgba(160,30,0,.15)');gr.addColorStop(1,'rgba(255,140,30,.55)');ctx.globalAlpha=k;ctx.fillStyle=gr;ctx.fillRect(0,0,W,g);
  for(let layer2=0;layer2<2;layer2++){ctx.globalAlpha=(layer2?.9:.6)*k;ctx.fillStyle=layer2?'#ffb02e':'#d8401c';ctx.beginPath();ctx.moveTo(0,g);for(let i=0;i<=24;i++){const x=i*W/24,h=(layer2?60:110)+Math.sin(t*(5+layer2*2)+i*1.7)*26+hs(i+layer2*30)*40;ctx.quadraticCurveTo(x-W/48,g-h*1.15,x,g-h*(i%2?.45:1));}ctx.lineTo(W,g);ctx.closePath();ctx.fill();}
  for(let i=0;i<60;i++){const life=(t*.35+hs(i))%1,x=hs(i+3)*W+Math.sin(t*2+i)*18,y=g-life*g*1.05;ctx.globalAlpha=k*(1-life);circ(x,y,1.5+hs(i+7)*3,i%3?'#ffcf5a':'#ff6a2a',0);}
  ctx.globalAlpha=.08*k;ctx.fillStyle='#fff2c0';for(let i=0;i<5;i++){const y=(g-((t*60+i*110)%g));ctx.fillRect(0,y,W,6);}}
function mCosmos(L,cx,cy,t,k,plane){const g=gy(plane);
  ctx.globalAlpha=.82*k;ctx.fillStyle='#0a0a22';ctx.fillRect(0,0,W,g);
  const neb=(x,y,r,c)=>{const gg=ctx.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,c);gg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gg;ctx.fillRect(x-r,y-r,2*r,2*r);};
  ctx.globalAlpha=.55*k;neb(W*.3,g*.35,260,'rgba(140,60,200,.6)');neb(W*.75,g*.6,220,'rgba(40,160,180,.45)');
  for(let i=0;i<140;i++){const x=hs(i)*W,y=hs(i+200)*g,tw=.5+.5*Math.sin(t*(1.5+hs(i+9)*3)+i);ctx.globalAlpha=k*(.35+.65*tw);const s=hs(i+5)<.12?2.6:1.2;if(s>2){ctx.fillStyle='#fff6d0';star(x,y,s*2.2,s*.7,4,t*.3);ctx.fill();}else circ(x,y,s,'#e8ecff',0);}
  const mx=W*.18,my=g*.3;ctx.globalAlpha=k;circ(mx,my,74,'#efe6c8',4);ctx.globalAlpha=.35*k;circ(mx-22,my-14,16,'#c9bd98',0);circ(mx+20,my+18,11,'#c9bd98',0);circ(mx+26,my-22,8,'#c9bd98',0);
  const cyc=3.1,n=Math.floor(t/cyc),f=(t-n*cyc)/.7;if(f<1){const x0=hs(n+1)*W,y0=hs(n+2)*g*.4,x=x0+f*360,y=y0+f*160;ctx.globalAlpha=k*(1-f);ctx.strokeStyle='#fff6d0';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-90,y-40);ctx.lineTo(x,y);ctx.stroke();circ(x,y,3,'#fff',0);}}
function mTeatro(L,cx,cy,t,k,plane){const g=gy(plane);
  darkHole(.72*k,cx,cy+20,190,230);
  ctx.globalAlpha=.16*k;ctx.fillStyle='#fff2b8';ctx.beginPath();ctx.moveTo(cx-60+Math.sin(t*.8)*20,0);ctx.lineTo(cx+60+Math.sin(t*.8)*20,0);ctx.lineTo(cx+200,g);ctx.lineTo(cx-200,g);ctx.closePath();ctx.fill();
  for(let i=0;i<26;i++){const x=cx+(hs(i)-.5)*300,y=(hs(i+40)*g+t*14)%g;ctx.globalAlpha=.6*k;circ(x,y,1.5,'#fff6c8',0);}
  const cur=(side)=>{const w=96;ctx.save();if(side)ctx.translate(W,0),ctx.scale(-1,1);ctx.globalAlpha=k;ctx.fillStyle='#8a1f22';ctx.fillRect(0,0,w,g);ctx.fillStyle='#6a1418';for(let i=0;i<4;i++){const x=10+i*24+Math.sin(t*1.3+i)*3;ctx.fillRect(x,0,8,g);}ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(w,0);ctx.lineTo(w,g);ctx.stroke();ctx.restore();};
  cur(0);cur(1);ctx.globalAlpha=k;ctx.fillStyle='#a3262a';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.lineTo(W,34);for(let i=12;i>=0;i--)ctx.quadraticCurveTo(i*W/12+W/24,70,i*W/12,34);ctx.closePath();ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
  for(let i=0;i<14;i++){const on=(Math.floor(t*4)+i)%2;ctx.globalAlpha=k;circ(30+i*(W-60)/13,18,5,on?'#ffe27a':'#7a5a2a',2);}}
function mHielo(L,cx,cy,t,k,plane){const g=gy(plane);
  ctx.globalAlpha=.42*k;ctx.fillStyle='#cfefff';ctx.fillRect(0,0,W,g);
  for(let r=0;r<2;r++){ctx.globalAlpha=.22*k;ctx.fillStyle=r?'#7affc8':'#7ad0ff';ctx.beginPath();for(let x=0;x<=W;x+=20)ctx.lineTo(x,40+r*30+Math.sin(x*.01+t*(1+r*.4))*22);for(let x=W;x>=0;x-=20)ctx.lineTo(x,100+r*30+Math.sin(x*.012+t*(1+r*.4)+1)*26);ctx.closePath();ctx.fill();}
  for(let i=0;i<150;i++){const sp=1+hs(i)*1.5,x=(hs(i+11)*(W+400)-t*220*sp)%(W+400),y=(hs(i+31)*g+t*90*sp)%g;ctx.globalAlpha=k*(.5+hs(i+2)*.5);circ((x+W+400)%(W+400)-200,y,1.2+hs(i+4)*2.4,'#ffffff',0);}
  const corner=(x,y)=>{const gg=ctx.createRadialGradient(x,y,0,x,y,190);gg.addColorStop(0,'rgba(255,255,255,.8)');gg.addColorStop(1,'rgba(255,255,255,0)');ctx.globalAlpha=k;ctx.fillStyle=gg;ctx.fillRect(x-190,y-190,380,380);
    ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;for(let j=0;j<3;j++){const ox=x+(x<W/2?1:-1)*(30+j*38),oy=y+(y<H/2?1:-1)*(26+j*30),s=12+j*3;ctx.beginPath();for(let a=0;a<6;a++){ctx.moveTo(ox,oy);ctx.lineTo(ox+Math.cos(a*TAU/6)*s,oy+Math.sin(a*TAU/6)*s);}ctx.stroke();}};
  corner(0,0);corner(W,0);}
function mPesadilla(L,cx,cy,t,k,plane){const g=gy(plane);
  ctx.globalAlpha=.75*k;ctx.fillStyle='#160a22';ctx.fillRect(0,0,W,g);
  ctx.save();ctx.translate(cx,cy);for(let i=14;i>=1;i--){const s=((i-(t*1.2)%1)*70);ctx.rotate(.09*Math.sin(t*.5));ctx.globalAlpha=k*(.22+.1*(i%2));ctx.fillStyle=i%2?'#3a1650':'#5a2470';ctx.fillRect(-s,-s,2*s,2*s);}ctx.restore();
  const P0=L.Ps&&L.Ps[0];for(let i=0;i<12;i++){const x=40+hs(i)*(W-80),y=30+hs(i+70)*(g*.75);if(Math.hypot(x-cx,y-cy)<160)continue;const bl=Math.max(0,Math.sin(t*1.3+i*2.1));const op=bl>.97?.1:1;
    ctx.globalAlpha=k*.95;for(const dx of[-11,11]){ell(x+dx,y,8,8*op+.5,'#fff6d0',0);const tx=P0?P0.x:cx,ty=P0?P0.y-30:cy,a=Math.atan2(ty-y,tx-x);if(op>.5)circ(x+dx+Math.cos(a)*3,y+Math.sin(a)*3,3,'#d02a3a',0);}}}
function mFiesta(L,cx,cy,t,k,plane){const g=gy(plane);
  ctx.globalAlpha=.55*k;ctx.fillStyle='#1a0f24';ctx.fillRect(0,0,W,g);
  const cols=['#ff5a8a','#5ad8ff','#ffe25a','#7aff8a'];for(let i=0;i<4;i++){const bx=W*(.15+i*.23),a=-Math.PI/2+Math.sin(t*(.9+i*.2)+i)*.6;ctx.globalAlpha=.2*k;ctx.fillStyle=cols[i];ctx.beginPath();ctx.moveTo(bx,g);ctx.lineTo(bx+Math.cos(a-.12)*900,g+Math.sin(a-.12)*900);ctx.lineTo(bx+Math.cos(a+.12)*900,g+Math.sin(a+.12)*900);ctx.closePath();ctx.fill();}
  for(let i=0;i<70;i++){const x=(hs(i)*W+Math.sin(t*1.5+i)*30),y=(hs(i+9)*g+t*(70+hs(i+3)*60))%g;ctx.save();ctx.translate(x,y);ctx.rotate(t*3+i);ctx.globalAlpha=k;ctx.fillStyle=cols[i%4];ctx.fillRect(-4,-2,8,4);ctx.restore();}
  const nb=32;for(let i=0;i<nb;i++){const on=(Math.floor(t*6)+i)%3===0;const x=i<16?20+i*(W-40)/15:20+(i-16)*(W-40)/15,y=i<16?14:g-14;ctx.globalAlpha=k;circ(x,y,5,on?'#fff6a0':'#8a6a2a',2);}}
function mEclipse(L,cx,cy,t,k,plane){const g=gy(plane);
  const gr=ctx.createLinearGradient(0,0,0,g);gr.addColorStop(0,'rgba(40,10,20,.85)');gr.addColorStop(1,'rgba(200,90,30,.55)');ctx.globalAlpha=k;ctx.fillStyle=gr;ctx.fillRect(0,0,W,g);
  const ex=cx,ey=Math.min(cy-60,g*.42);ctx.save();ctx.translate(ex,ey);ctx.rotate(t*.15);for(let i=0;i<24;i++){ctx.rotate(TAU/24);ctx.globalAlpha=.35*k;ctx.fillStyle=i%2?'#ffd27a':'#ff9a3a';ctx.beginPath();ctx.moveTo(130,-10);ctx.lineTo(230+Math.sin(t*3+i)*30,0);ctx.lineTo(130,10);ctx.closePath();ctx.fill();}ctx.restore();
  const cg=ctx.createRadialGradient(ex,ey,110,ex,ey,190);cg.addColorStop(0,'rgba(255,240,200,.9)');cg.addColorStop(1,'rgba(255,200,120,0)');ctx.globalAlpha=k;ctx.fillStyle=cg;ctx.beginPath();ctx.arc(ex,ey,190,0,TAU);ctx.fill();
  circ(ex,ey,120,'#0c0608',4);ctx.globalAlpha=.5*k;circ(ex-30,ey-30,24,'rgba(255,255,255,.05)',0);}
function mTinta(L,cx,cy,t,k,plane,age){const g=gy(plane);
  ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.6*k;ctx.fillStyle='#c9a86a';ctx.fillRect(0,0,W,g);ctx.globalCompositeOperation='source-over';
  ctx.globalAlpha=k;ctx.fillStyle=C.ink;for(let i=0;i<16;i++){const x=i*W/15+hs(i)*20,len=Math.min(1,age/2.5)*(40+hs(i+3)*160)+Math.sin(t*1.2+i)*12,w=10+hs(i+8)*14;ctx.beginPath();ctx.moveTo(x-w,0);ctx.lineTo(x-w*.45,len);ctx.arc(x,len,w*.55,Math.PI,0,true);ctx.lineTo(x+w,0);ctx.closePath();ctx.fill();const dy=(t*120+hs(i+20)*300)%g;if(dy>len+20){ctx.beginPath();ctx.ellipse(x,dy,4,6,0,0,TAU);ctx.fill();}}
  ctx.fillRect(0,0,W,8);for(let i=0;i<6;i++){ctx.globalAlpha=.28*k;const x=hs(i+60)*W,y=g*.3+hs(i+61)*g*.6;ctx.beginPath();for(let a=0;a<=12;a++){const r=24+hs(i*13+a)*22;ctx.lineTo(x+Math.cos(a/12*TAU)*r,y+Math.sin(a/12*TAU)*r);}ctx.fill();}}
function mEspiral(L,cx,cy,t,k,plane){const [c1,c2,c3]=pal(L);spiral(cx,cy,t,c2,c3,.62*k);rays(cx,cy,-t*.4,c1,.12*k,10);
  const g=ctx.createRadialGradient(cx,cy,60,cx,cy,Math.max(W,H));g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+(.55*k)+')');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(let i=0;i<30;i++){const a=i*2.4+t*.6,r=(i*37+t*60)%520;ctx.globalAlpha=.6*k*(1-r/520);circ(cx+Math.cos(a)*r,cy+Math.sin(a)*r,2+(i%3),c1,0);}}
const MF={espiral:mEspiral,tormenta:mTormenta,infierno:mInfierno,cosmos:mCosmos,teatro:mTeatro,hielo:mHielo,pesadilla:mPesadilla,fiesta:mFiesta,eclipse:mEclipse,tinta:mTinta};
function moodTrans(m,cx,cy,a){ctx.save();
  if(m==='tormenta'){ctx.globalAlpha=(1-a)*.9;ctx.fillStyle='#f4f8ff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1-a;bolt(cx,0,H,3,8,'#fffbe0');}
  else if(m==='teatro'){const c=Math.sin(Math.PI*a)*(W/2+10);ctx.fillStyle='#8a1f22';ctx.fillRect(0,0,c,H);ctx.fillRect(W-c,0,c,H);ctx.strokeStyle=C.ink;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(c,0);ctx.lineTo(c,H);ctx.moveTo(W-c,0);ctx.lineTo(W-c,H);ctx.stroke();}
  else if(m==='cosmos'){ctx.globalAlpha=1-a;ctx.fillStyle='#fff6d0';star(cx,cy,a*1400,a*560,5,a*2);ctx.fill();}
  else if(m==='hielo'){ctx.globalAlpha=(1-a)*.85;ctx.fillStyle='#ffffff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1-a;ctx.strokeStyle='#7ab8e8';ctx.lineWidth=3;for(let i=0;i<12;i++){const an=i*TAU/12+hs(i)*.3;ctx.beginPath();ctx.moveTo(cx,cy);let x=cx,y=cy;for(let j=1;j<=5;j++){x+=Math.cos(an+(hs(i*5+j)-.5)*.8)*a*120;y+=Math.sin(an+(hs(i*5+j)-.5)*.8)*a*120;ctx.lineTo(x,y);}ctx.stroke();}}
  else if(m==='eclipse'){const r=Math.sin(Math.PI*a)*900;ctx.fillStyle='#0c0608';ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();}
  else if(m==='fiesta'){ctx.globalAlpha=1-a;const cols=['#ff5a8a','#5ad8ff','#ffe25a','#7aff8a'];for(let i=0;i<4;i++){ctx.strokeStyle=cols[i];ctx.lineWidth=22;ctx.beginPath();ctx.arc(cx,cy,a*(900-i*120),0,TAU);ctx.stroke();}}
  else{const col=m==='infierno'?'#e8562e':m==='pesadilla'?'#3a1650':C.ink;ctx.globalAlpha=1-a;ctx.fillStyle=col;ctx.beginPath();const R=a*1300;for(let i=0;i<=24;i++){const th=i/24*TAU,rr2=R*(.8+.2*Math.sin(i*3.7));ctx.lineTo(cx+Math.cos(th)*rr2,cy+Math.sin(th)*rr2);}ctx.arc(cx,cy,Math.max(0,R*.82-60),0,TAU,true);ctx.fill('evenodd');}
  ctx.restore();}
function layer(L){const P=phaseInfo(L);if(!P||P.ph<1)return;const B=L.boss,c=B.center?B.center():{x:W*.7,y:H/2},t=L.t,[c1,c2,c3]=pal(L),plane=LEVELS[L.id]&&LEVELS[L.id].kind==='plane';
  const k=Math.min(1,Math.max(0,P.age/.6));const cx=c.x-(L.camX||0),cy=c.y;
  ctx.save();
  if(!P.last){ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.22*k;ctx.fillStyle=c1;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';
    rays(cx,cy,t*.25,c1,.16*k);
    for(let i=0;i<7;i++){const x=((i*173+t*(plane?60:14))%(W+200))-100,y=60+(i*67)%240;ctx.globalAlpha=.18*k;cloudShape(ctx,x,y,.5+(i%3)*.2,c1,0);}
    for(let i=0;i<24;i++){const x=(i*97+Math.sin(t*.7+i)*30)%W,y=(i*53+t*20)%H;ctx.globalAlpha=.5*k;circ(x,y,1.5+(i%3),'#fff6c8',0);}}
  else{const m=moodOf(L.id);ctx.save();if(!plane){ctx.beginPath();ctx.rect(0,0,W,GROUND);ctx.clip();}try{(MF[m]||mEspiral)(L,cx,cy,t,k,plane,P.age);}catch(e){}ctx.restore();}
  if(P.age<.9&&P.age>=0&&L._bgT>0){const a=P.age/.9;if(P.last){ctx.globalAlpha=1;moodTrans(moodOf(L.id),cx,cy,a);}else{ctx.globalAlpha=1-a;ctx.fillStyle=C.ink;ctx.beginPath();const R=a*1300;for(let i=0;i<=24;i++){const th=i/24*TAU,rr2=R*(.8+.2*Math.sin(i*3.7));ctx.lineTo(cx+Math.cos(th)*rr2,cy+Math.sin(th)*rr2);}ctx.arc(cx,cy,Math.max(0,R*.82-60),0,TAU,true);ctx.fill('evenodd');}}
  ctx.restore();}
const _mbl=makeBossLevel;
makeBossLevel=function(def){const L=_mbl(def);const bg=L.drawBG;if(bg)L.drawBG=function(){bg.apply(this,arguments);try{layer(L);}catch(e){}};return L;};
/* the camera breathes */
const _dlS=drawLevel;drawLevel=function(L){const B=L&&L.boss,ph=B?B.phase:0,t=L?L.t:0;if(!L||L.state==='intro'&&!B){_dlS(L);return;}
  const amp=1.6+ph*1.4,rot=(.0015+ph*.0012)*Math.sin(t*.37),z=1+.008+.004*ph+.004*Math.sin(t*.53);
  /* only a gentle whole-pixel sway: rotating/zooming the whole picture every frame made every layer get re-sampled (big lag on small laptops) */
  ctx.save();ctx.translate(Math.round(Math.sin(t*.61)*amp),Math.round(Math.cos(t*.47)*amp*.7));try{_dlS(L);}finally{ctx.restore();}};
})();
