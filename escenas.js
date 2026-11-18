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
function layer(L){const P=phaseInfo(L);if(!P||P.ph<1)return;const B=L.boss,c=B.center?B.center():{x:W*.7,y:H/2},t=L.t,[c1,c2,c3]=pal(L),plane=LEVELS[L.id]&&LEVELS[L.id].kind==='plane';
  const k=Math.min(1,Math.max(0,P.age/.6));const cx=c.x-(L.camX||0),cy=c.y;
  ctx.save();
  if(!P.last){ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.22*k;ctx.fillStyle=c1;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';
    rays(cx,cy,t*.25,c1,.16*k);
    for(let i=0;i<7;i++){const x=((i*173+t*(plane?60:14))%(W+200))-100,y=60+(i*67)%240;ctx.globalAlpha=.18*k;cloudShape(ctx,x,y,.5+(i%3)*.2,c1,0);}
    for(let i=0;i<24;i++){const x=(i*97+Math.sin(t*.7+i)*30)%W,y=(i*53+t*20)%H;ctx.globalAlpha=.5*k;circ(x,y,1.5+(i%3),'#fff6c8',0);}}
  else{ctx.save();if(!plane){ctx.beginPath();ctx.rect(0,0,W,GROUND);ctx.clip();}spiral(cx,cy,t,c2,c3,.62*k);rays(cx,cy,-t*.4,c1,.12*k,10);ctx.restore();
    const g=ctx.createRadialGradient(cx,cy,60,cx,cy,Math.max(W,H));g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+(.55*k)+')');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    if(Math.floor(t*1.7)%6===0&&(t*1.7)%1<.18){ctx.globalAlpha=.22;ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.globalAlpha=.9;ctx.strokeStyle='#fff6c8';ctx.lineWidth=3;const x=(Math.floor(t*1.7)*211)%W;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-22,90);ctx.lineTo(x+12,100);ctx.lineTo(x-16,230);ctx.stroke();}
    for(let i=0;i<30;i++){const a=i*2.4+t*.6,r=(i*37+t*60)%520;ctx.globalAlpha=.6*k*(1-r/520);circ(cx+Math.cos(a)*r,cy+Math.sin(a)*r,2+(i%3),c1,0);}}
  if(P.age<.9&&P.age>=0&&L._bgT>0){const a=P.age/.9;ctx.globalAlpha=1-a;ctx.fillStyle=C.ink;ctx.beginPath();const R=a*1300;for(let i=0;i<=24;i++){const th=i/24*TAU,rr2=R*(.8+.2*Math.sin(i*3.7));ctx.lineTo(cx+Math.cos(th)*rr2,cy+Math.sin(th)*rr2);}ctx.arc(cx,cy,Math.max(0,R*.82-60),0,TAU,true);ctx.fill('evenodd');}
  ctx.restore();}
const _mbl=makeBossLevel;
makeBossLevel=function(def){const L=_mbl(def);const bg=L.drawBG;if(bg)L.drawBG=function(){bg.apply(this,arguments);try{layer(L);}catch(e){}};return L;};
/* the camera breathes */
const _dlS=drawLevel;drawLevel=function(L){const B=L&&L.boss,ph=B?B.phase:0,t=L?L.t:0;if(!L||L.state==='intro'&&!B){_dlS(L);return;}
  const amp=1.6+ph*1.4,rot=(.0015+ph*.0012)*Math.sin(t*.37),z=1+.008+.004*ph+.004*Math.sin(t*.53);
  ctx.save();ctx.translate(W/2+Math.sin(t*.61)*amp,H/2+Math.cos(t*.47)*amp*.7);ctx.rotate(rot);ctx.scale(z,z);ctx.translate(-W/2,-H/2);try{_dlS(L);}finally{ctx.restore();}};
})();
