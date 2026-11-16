/* nubes.js — sky levels that look alive, and no unfair falls at the start.
   - every arena: during the intro heroes are snapped onto the platform under them, and
     a pit in the first 2.5 s of play bounces you back up without costing a heart
   - Dragona Cometa: platforms that are not always clouds (balloon rafts, kites, a sleepy moon),
     squashy animated clouds with faces, and a scrolling sky with parallax cloud banks,
     wind streaks, a floating tower, birds and stars at night
   - the cloud platforms of every other arena get the same squashy animated cloud */
(function(){
const _saN=setupArena;
setupArena=function(L,B,def,plane){_saN(L,B,def,plane);if(plane)return;L._pt=0;
  chainUpd(L,dt=>{if(L.state==='play')L._pt+=dt;
    if(L.state!=='intro')return;
    for(const p of L.Ps){if(p.dead)continue;let best=null,bd=1e9;
      for(const s of L.solids){if(s.y>9000||s.gone||s.fall)continue;if(p.x<s.x-6||p.x>s.x+s.w+6)continue;const d=Math.abs(s.y-p.y);if(d<44&&d<bd){bd=d;best=s;}}
      if(best){p.y=best.y;p.vy=0;p.ground=true;p.groundRef=best;}}});
  if(def.id==='cometa'){const bg=L.bg;L.drawBG=()=>{ctx.drawImage(bg,0,0,W,H);drawCometaSky(L);for(const s of L.cs||[]){if(s.y>9000)continue;s.draw?s.draw(s,L):drawPlat(s,L.t);}};}};
const _pitN=pitFall;
pitFall=function(L,p){if(L&&L._pt!=null&&L._pt<2.5&&!L.climb)p.inv=Math.max(p.inv,.05);return _pitN(L,p);};

/* ---------- a squashy cartoon cloud, top surface at y=0 ---------- */
function standing(L,s){let n=0;for(const p of L.Ps)if(!p.dead&&p.ground&&p.groundRef===s)n++;return n;}
function puffs(w,t,seed){const n=Math.max(4,Math.round(w/30)),out=[];const hw=w/2;
  for(let i=0;i<n;i++){const k=n===1?.5:i/(n-1),x=-hw+16+k*(w-32),edge=1-Math.abs(k-.5)*1.2;
    const r=(15+edge*11+((i*7+seed*3)%5))*(1+.07*Math.sin(t*3.1+i*1.9+seed));out.push([x,r*.62,r]);}
  for(let i=0;i<n-1;i++){const k=(i+.5)/(n-1),x=-hw+22+k*(w-44);const r=(13+((i*5+seed)%4))*(1+.06*Math.sin(t*2.6+i+seed));out.push([x,r*.9+10,r]);}
  return out;}
function fancyCloud(w,t,seed,sq,face,col){const P=puffs(w,t,seed);const hw=w/2;
  ctx.save();ctx.scale(1+.07*sq,1-.12*sq);
  ell(0,40,hw*.85,7,'rgba(60,40,90,.18)',0);
  ctx.fillStyle=C.ink;ctx.beginPath();for(const [x,y,r] of P){ctx.moveTo(x+r+4,y);ctx.arc(x,y,r+4,0,TAU);}ctx.fill();
  ctx.fillStyle=col||'#fffaf0';ctx.beginPath();for(const [x,y,r] of P){ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,TAU);}ctx.fill();
  ctx.save();ctx.beginPath();for(const [x,y,r] of P){ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,TAU);}ctx.clip();ctx.fillStyle='rgba(176,160,210,.38)';ctx.beginPath();for(const [x,y,r] of P){if(y<12)continue;ctx.moveTo(x+r*.8,y+r*.35);ctx.arc(x,y+r*.35,r*.8,0,Math.PI);}ctx.fill();ctx.restore();
  ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=3;ctx.lineCap='round';for(let i=0;i<P.length;i+=2){const [x,y,r]=P[i];if(y>12)continue;ctx.beginPath();ctx.arc(x,y,r*.62,-2.5,-1.7);ctx.stroke();}
  if(face){const blink=((t+seed*1.3)%3.4)<.13;const ex=Math.min(14,w*.08);
    if(sq>.3){line(-ex-5,14,-ex+3,18,2.5);line(-ex-5,22,-ex+3,18,2.5);line(ex+5,14,ex-3,18,2.5);line(ex+5,22,ex-3,18,2.5);ell(0,26,4,5,'#7a2a2a',2);}
    else if(blink){line(-ex-4,18,-ex+4,18,2.5);line(ex-4,18,ex+4,18,2.5);}
    else{ell(-ex,17,3,4.5,C.ink,0);ell(ex,17,3,4.5,C.ink,0);circ(-ex+1,15.5,1.2,'#fff',0);circ(ex+1,15.5,1.2,'#fff',0);
      ctx.beginPath();ctx.arc(0,22,5,.2,Math.PI-.2);ctx.lineWidth=2.2;ctx.strokeStyle=C.ink;ctx.stroke();}
    ell(-ex-9,24,5,3,'rgba(232,120,110,.45)',0);ell(ex+9,24,5,3,'rgba(232,120,110,.45)',0);}
  ctx.restore();}
function wisps(w,t,sp){if(sp<5)return;ctx.save();ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=3;ctx.lineCap='round';
  for(let i=0;i<3;i++){const y=6+i*11,ph=(t*2+i*.37)%1,x0=w/2+8+ph*30,len=18+i*6;ctx.globalAlpha=1-ph;ctx.beginPath();ctx.moveTo(x0,y);ctx.quadraticCurveTo(x0+len*.5,y-4,x0+len,y);ctx.stroke();}ctx.restore();}

/* ---------- the platforms of the comet fight ---------- */
const sqT=new WeakMap();
window.drawSkyPlat=function(s,L){const t=L.t,w=s.w,hw=w/2,seed=s.seed||1;const on=standing(L,s);
  let sq=sqT.get(s)||0;sq+=((on?1:0)-sq)*.25;sqT.set(s,sq);
  ctx.save();ctx.translate(s.x+hw,s.y);ctx.lineJoin='round';ctx.lineCap='round';
  switch(s.kind){
    case 'globo':{const sw=Math.sin(t*2+seed)*.06;
      const cols=[['#e86a5a','#f2c14e'],['#7bb7c9','#fff4ea'],['#b8d08a','#e86a5a']];
      for(let i=0;i<3;i++){const bx=-hw*.6+i*hw*.6,by=-78-(i%2)*16+Math.sin(t*2.4+i+seed)*4,c=cols[(i+Math.floor(seed))%3];
        ctx.save();ctx.translate(bx,0);ctx.rotate(sw*(i-1));line(0,-6,0,by+22,1.6,'rgba(20,13,8,.8)');
        ctx.translate(0,by);ell(0,0,17,21,c[0],3);ctx.save();ctx.beginPath();ctx.ellipse(0,0,17,21,0,0,TAU);ctx.clip();ctx.fillStyle=c[1];ctx.fillRect(-4,-22,8,44);ctx.restore();
        ctx.beginPath();ctx.ellipse(0,0,17,21,0,0,TAU);ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ell(-6,-8,3,6,'rgba(255,255,255,.7)',0);poly([[-4,20],[4,20],[0,25]],c[0],2);ctx.restore();}
      ctx.save();ctx.scale(1+.04*sq,1-.08*sq);rr(-hw,-2,w,16,6,'#c58a4a',3);for(let x=-hw+10;x<hw-4;x+=14)line(x,0,x+6,12,1.6,'rgba(20,13,8,.55)');
      rr(-hw-4,-6,w+8,7,3,C.brass,3);ell(0,26,hw*.7,5,'rgba(60,40,90,.16)',0);ctx.restore();break;}
    case 'cometa':{const fl=Math.sin(t*6+seed);
      ctx.save();ctx.scale(1+.04*sq,1-.08*sq);
      poly([[-hw,4],[0,-4+fl*1.5],[hw,4],[0,30]],'#e8562e',3);poly([[0,-4+fl*1.5],[hw,4],[0,30]],'#f2c14e',0);poly([[-hw,4],[0,30],[0,-4+fl*1.5]],'#f6e6c8',0);
      ctx.beginPath();ctx.moveTo(-hw,4);ctx.lineTo(0,-4+fl*1.5);ctx.lineTo(hw,4);ctx.lineTo(0,30);ctx.closePath();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
      line(-hw,4,hw,4,2,C.ink);line(0,-4,0,30,2,C.ink);rr(-hw-2,-3,w+4,7,3,C.woodL,2.5);
      ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,30);for(let i=1;i<=8;i++)ctx.lineTo(i*12,30+i*5+Math.sin(t*7-i*.9+seed)*7);ctx.stroke();
      for(let i=2;i<=8;i+=2){const x=i*12,y=30+i*5+Math.sin(t*7-i*.9+seed)*7;poly([[x-6,y-5],[x+6,y+5],[x+6,y-5],[x-6,y+5]],i%4?'#e86a5a':'#7bb7c9',1.5);}
      ctx.restore();break;}
    case 'luna':{const rock=Math.sin(t*1.3+seed)*.05;ctx.rotate(rock);ctx.save();ctx.scale(1+.05*sq,1-.1*sq);
      ctx.beginPath();ctx.moveTo(-hw,0);ctx.quadraticCurveTo(0,hw*.95,hw,0);ctx.quadraticCurveTo(0,hw*.45,-hw,0);ctx.closePath();ctx.fillStyle='#f6e7a8';ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();
      ctx.beginPath();ctx.moveTo(-hw*.7,4);ctx.quadraticCurveTo(0,hw*.62,hw*.7,4);ctx.lineWidth=5;ctx.strokeStyle='rgba(210,170,80,.5)';ctx.stroke();
      for(const [x,y,r] of[[-hw*.4,hw*.2,5],[hw*.35,hw*.22,4],[0,hw*.38,3]])circ(x,y,r,'rgba(200,160,80,.45)',0);
      ctx.beginPath();ctx.arc(-hw*.15,hw*.3,5,.3,Math.PI-.3);ctx.lineWidth=2.2;ctx.strokeStyle=C.ink;ctx.stroke();ell(-hw*.15-9,hw*.33,4,2.5,'rgba(232,120,110,.5)',0);
      const zp=(t*.7+seed)%1;ctx.globalAlpha=1-zp;ctx.font='bold 14px serif';ctx.fillStyle=C.ink;ctx.fillText('z',hw*.55+zp*14,-8-zp*30);ctx.globalAlpha=1;ctx.restore();break;}
    default:fancyCloud(w,t,seed,sq,true);wisps(w,t,L.cmSp||0);}
  ctx.restore();};

/* ---------- the scrolling sky behind the comet ---------- */
const BANDS=[{y:165,s:.62,sp:.12,c:'rgba(255,236,214,.85)',lw:0,gap:150},{y:H-92,s:.95,sp:.42,c:'#f7dccb',lw:3,gap:120},{y:H-28,s:1.25,sp:1,c:'#fff3e6',lw:4,gap:105}];
function band(b,off){const span=W+b.gap*2;for(let i=0;i<Math.ceil(span/b.gap)+1;i++){let x=((i*b.gap-off*b.sp)%span+span)%span-b.gap;const y=b.y+((i*37)%3)*8;cloudShape(ctx,x,y,b.s*(.85+((i*13)%4)*.08),b.c,b.lw);}}
function drawCometaSky(L){const t=L.t,off=(L.cmScroll||0)+t*6,ph=L.boss?L.boss.phase:0;
  ctx.save();ctx.translate(480,470);ctx.rotate(t*.05);ctx.fillStyle='rgba(255,240,200,.07)';for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,620,i*TAU/12,i*TAU/12+.12);ctx.closePath();ctx.fill();}ctx.restore();
  if(ph>=1){for(let i=0;i<26;i++){const x=(i*173)%W,y=(i*59)%230+10,a=(.35+.35*Math.sin(t*3+i))*(ph>=2?1:.5);ctx.globalAlpha=Math.max(0,a);poly([[x,y-5],[x+1.5,y-1.5],[x+5,y],[x+1.5,y+1.5],[x,y+5],[x-1.5,y+1.5],[x-5,y],[x-1.5,y-1.5]],'#fff6c8',0);}ctx.globalAlpha=1;}
  band(BANDS[0],off);
  {const tx=((W+260)-(off*.05)%(W+520))-130,ty=230+Math.sin(t*.8)*8;ctx.save();ctx.translate(tx,ty);ctx.globalAlpha=.55;
    poly([[-60,0],[60,0],[30,46],[0,70],[-26,40]],'#b98a7a',2.5);rr(-22,-90,44,92,4,'#d9b6a0',2.5);poly([[-30,-90],[0,-128],[30,-90]],'#a3586a',2.5);
    for(let k=0;k<3;k++)rr(-8,-78+k*26,16,14,6,'#6a5a7a',1.5);line(0,-128,0,-150,2);poly([[0,-150],[22+Math.sin(t*6)*4,-144],[0,-138]],'#e8562e',1.5);ctx.restore();}
  band(BANDS[1],off);
  {const n=(Math.floor(t/9))%4,k=(t%9)/9;if(k<.6){const bx=W+40-k/.6*(W+120),by=120+n*30;for(let i=0;i<4;i++){const x=bx+i*26,y=by+(i%2)*12,f=Math.sin(t*14+i)*6;ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-8,y-f);ctx.quadraticCurveTo(x-4,y-3,x,y);ctx.quadraticCurveTo(x+4,y-3,x+8,y-f);ctx.stroke();}}}
  if((L.cmSp||0)>5){ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineCap='round';for(let i=0;i<9;i++){const sp=1.4+(i%3)*.5,x=W-(((off*sp)+i*157)%(W+200))+100,y=60+(i*67)%330,len=40+(i%4)*20;ctx.lineWidth=1.5+(i%2);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+len,y);ctx.stroke();}}
  band(BANDS[2],off);}

/* ---------- other arenas: the same lively cloud for every 'nube' platform ---------- */
const _dpN=drawPlat;
drawPlat=function(s,t){if(s.skin!=='nube'||s.y>9000||s.app<=0||s.kind)return _dpN(s,t);const L=typeof LV!=='undefined'?LV:null;
  const on=L&&L.Ps?standing(L,s):0;let sq=sqT.get(s)||0;sq+=((on?1:0)-sq)*.25;sqT.set(s,sq);
  ctx.save();const a=easeOutBack(s.app);ctx.translate(s.x+s.w/2,s.y);ctx.scale(a,a);ctx.lineJoin='round';ctx.lineCap='round';if(s._sd==null)s._sd=((s.x*7+s.y*3)%9+9)%9;fancyCloud(s.w,t,s._sd,sq,true);ctx.restore();};
})();
