/* avionanim.js — the little plane gets a lot more life, rubber-hose style:
   - transforming to tiny and back: a pop with a ring of cloud puffs
   - fake 3D roll when climbing or diving, wing waggle hello when you sit still
   - recoil when shooting, a knock-back wobble plus dizzy stars and a black puff when you get hit
   - on the last heart: a black smoke trail and sparks from the engine
   - afterburner flame when you push forward, wingtip contrails when you move fast, speed lines when tiny
   - after-images while doing the parry spin, sparkles when the Super card is full
   - engine-start puffs in the intro, a loop-de-loop when the boss is knocked out
   - when you lose your last heart the plane spins and falls with smoke before the ghost appears
   - flocks of birds and far-away balloons fly past in the background of plane levels
   Drawing only (render-only fields p._pa / L._sky), so online play stays in sync. */
(function(){
const _dph=drawPlaneHero;
const hs=i=>{const s=Math.sin(i*12.9898+78.233)*43758.5453;return s-Math.floor(s);};
const st=(L,p)=>p._pa||(p._pa={small:p.small,sw:-9,hp:p.hp,hit:-9,lt:L.t,idle:0,con:[],smoke:[],lastC:0,lastS:0,spinOn:false,lastX:p.x,lastY:p.y});
function sparkle(x,y,r,col){ctx.beginPath();ctx.moveTo(x,y-r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.quadraticCurveTo(x,y,x,y+r);ctx.quadraticCurveTo(x,y,x-r,y);ctx.quadraticCurveTo(x,y,x,y-r);ctx.fillStyle=col;ctx.fill();}
function drawSmoke(A,t){for(const s of A.smoke){const u=(t-s.t0)/s.life;if(u<0||u>1)continue;ctx.globalAlpha=(1-u)*s.a;circ(s.x-u*s.dx,s.y-u*s.dy,s.r*(1+u*1.6),s.col,0);}ctx.globalAlpha=1;A.smoke=A.smoke.filter(s=>t-s.t0<s.life);}

drawPlaneHero=function(o){const L=typeof LV!=='undefined'?LV:null;
  const p=L&&L.Ps&&!o.meteor?L.Ps.find(q=>q.type==='plane'&&!q.dead&&q.x===o.x&&q.y===o.y):null;
  if(!p)return _dph(o);
  const A=st(L,p),t=L.t,s=p.small?.55:1,dt=Math.max(0,Math.min(.1,t-A.lt));A.lt=t;A.lastX=o.x;A.lastY=o.y;A.char=o.char;A.skin=o.skin;
  /* events */
  if(A.small!==p.small){A.small=p.small;A.sw=t;}
  if(p.hp<A.hp)A.hit=t;A.hp=p.hp;
  if(p.spin>0&&!A.spinOn){A.spinOn=true;A.par=t;}if(!(p.spin>0))A.spinOn=false;
  const mv=Math.hypot(p.vx||0,p.vy||0);A.idle=mv<40&&L.state==='play'?A.idle+dt:0;
  /* emitters */
  if(mv>200&&t-A.lastC>.025){A.lastC=t;A.con.push({x:o.x-4*s,y:o.y+15*s,t0:t},{x:o.x-6*s,y:o.y-4*s,t0:t,top:true});}
  A.con=A.con.filter(c=>t-c.t0<.32);
  if(p.hp===1&&L.state==='play'&&t-A.lastS>.055){A.lastS=t;const k=Math.floor(t*40);A.smoke.push({x:o.x-30*s,y:o.y+2*s,t0:t,life:.9,r:(5+hs(k)*4)*s,dx:220,dy:30+hs(k+1)*30,a:.7,col:hs(k+2)<.5?'#3a3230':'#5a504a'});}
  if(L.state==='intro'&&L.stateT<1.1&&t-A.lastS>.07){A.lastS=t;const k=Math.floor(t*30);A.smoke.push({x:o.x-36*s,y:o.y+4*s,t0:t,life:.6,r:6*s,dx:160,dy:10+hs(k)*20,a:.8,col:'#ffffff'});}
  const hitU=(t-A.hit)/.45;if(hitU>=0&&hitU<1&&!A.hitPuff){A.hitPuff=true;for(let i=0;i<8;i++){const a=i*TAU/8;A.smoke.push({x:o.x+Math.cos(a)*8,y:o.y+Math.sin(a)*8,t0:t,life:.5,r:7,dx:-Math.cos(a)*50,dy:-Math.sin(a)*50,a:.85,col:'#2a2220'});}}
  if(hitU>=1)A.hitPuff=false;
  /* ---- behind the plane ---- */
  ctx.save();
  // contrails
  for(const top of[false,true]){const pts=A.con.filter(c=>!!c.top===top);if(pts.length<2)continue;ctx.lineCap='round';
    for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],u=(t-b.t0)/.32;ctx.globalAlpha=(1-u)*.55;ctx.strokeStyle='#ffffff';ctx.lineWidth=3*s*(1-u*.5);ctx.beginPath();ctx.moveTo(a.x-(t-a.t0)*260,a.y);ctx.lineTo(b.x-(t-b.t0)*260,b.y);ctx.stroke();}}
  ctx.globalAlpha=1;
  drawSmoke(A,t);
  // afterburner when pushing forward
  if((p.vx||0)>120&&L.state==='play'){const k=clamp((p.vx-120)/200,0,1),len=(12+Math.sin(t*60)*4+k*14)*s,x=o.x-40*s,y=o.y+6*s;
    ctx.globalAlpha=.9;ctx.beginPath();ctx.moveTo(x,y-5*s);ctx.quadraticCurveTo(x-len,y,x,y+5*s);ctx.closePath();ctx.fillStyle='#ff8a2e';ctx.fill();
    ctx.beginPath();ctx.moveTo(x,y-2.5*s);ctx.quadraticCurveTo(x-len*.55,y,x,y+2.5*s);ctx.closePath();ctx.fillStyle='#fff2a0';ctx.fill();ctx.globalAlpha=1;}
  // tiny-mode speed lines
  if(p.small){ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=2;ctx.lineCap='round';for(let i=0;i<4;i++){const ph=(t*5+i*.27)%1,y=o.y+(i-1.5)*7;ctx.globalAlpha=1-ph;ctx.beginPath();ctx.moveTo(o.x-22-ph*40,y);ctx.lineTo(o.x-36-ph*60,y);ctx.stroke();}ctx.globalAlpha=1;}
  // parry after-images
  if(p.spin>0){for(let i=2;i>=1;i--){ctx.save();ctx.globalAlpha=.22*i;ctx.translate(-i*11,i*2);_dph(Object.assign({},o,{spin:Math.min(.35,p.spin+i*.05),flash:false}));ctx.restore();}}
  ctx.restore();
  /* ---- the plane itself, with extra motion ---- */
  let ox=0,oy=0,rot=0,sx=1,sy=1;
  if(L.state==='ko'||L.state==='win'){const k=L.stateT;if(k>.25&&k<1.65){const a=(k-.25)/1.4*TAU;ox=Math.sin(a)*70;oy=-(1-Math.cos(a))*70;rot=-a;}else if(k>=1.65){oy=Math.sin((k-1.65)*5)*4;rot=Math.sin((k-1.65)*9)*.16;}}
  sy*=1-Math.min(.2,Math.abs(p.vy||0)/330*.2);
  const swU=(t-A.sw)/.32;if(swU>=0&&swU<1){const k=Math.sin(swU*Math.PI)*(1-swU)*.55;sx*=1+k;sy*=1-k*.6;}
  if(A.idle>1.6){const w=(A.idle-1.6)%3.5;if(w<.9){rot+=Math.sin(w/.9*TAU*2)*.2*(1-w/.9);oy-=Math.sin(w/.9*Math.PI)*5;}}
  if(o.flash)ox-=3*s;
  if(hitU>=0&&hitU<1){ox-=Math.sin(hitU*Math.PI)*16;rot+=Math.sin(hitU*Math.PI*3)*.32*(1-hitU);}
  ctx.save();ctx.translate(o.x+ox,o.y+oy);ctx.rotate(rot);ctx.scale(sx,sy);ctx.translate(-o.x,-o.y);_dph(o);ctx.restore();
  /* ---- in front ---- */
  ctx.save();const cx=o.x+ox,cy=o.y+oy;
  if(swU>=0&&swU<1){for(let i=0;i<9;i++){const a=i*TAU/9+.3,r=(14+swU*46)*(p.small?.8:1.1);ctx.globalAlpha=(1-swU)*.9;circ(cx+Math.cos(a)*r,cy+Math.sin(a)*r,(7-swU*3)*(p.small?.8:1.1),'#fffaf0',2);}
    ctx.globalAlpha=1-swU;for(let i=0;i<4;i++){const a=i*TAU/4+swU*3;sparkle(cx+Math.cos(a)*(26+swU*30),cy+Math.sin(a)*(26+swU*30),6,'#ffe27a');}}
  if(t-A.hit<1.1&&t-A.hit>=0){const u=(t-A.hit)/1.1;ctx.globalAlpha=1-u*u;for(let i=0;i<3;i++){const a=t*8+i*TAU/3;ctx.save();ctx.translate(cx+Math.cos(a)*20*s,cy-30*s+Math.sin(a)*6*s);star(0,0,6*s+1,2.6*s+.5,5,t*6);ctx.fillStyle='#ffe27a';ctx.fill();ctx.lineWidth=1.6;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}}
  if(p.hp===1&&L.state==='play'&&Math.floor(t*7)%5===0&&(t*7)%1<.35){ctx.globalAlpha=1;const k=Math.floor(t*7);for(let i=0;i<3;i++)circ(cx-30*s-hs(k+i)*10,cy+(hs(k+i+5)-.5)*12*s,1.6,'#ffcf5a',0);}
  if(p.cards>=5&&L.state==='play'){for(let i=0;i<3;i++){const k=Math.floor(t*2.2+i*.33),u=(t*2.2+i*.33)%1;ctx.globalAlpha=Math.sin(u*Math.PI);sparkle(cx+(hs(k*3+i)-.5)*70*s,cy+(hs(k*3+i+1)-.5)*44*s,4+4*Math.sin(u*Math.PI),'#fff6c8');}}
  ctx.restore();};

/* falling wreck when the last heart is lost, before the ghost shows up */
const _dpl=drawPlayers;drawPlayers=function(L){try{for(const p of L.Ps){if(p.type!=='plane'||!p._pa)continue;const A=p._pa;
    if(p.dead){if(A.deadT==null){A.deadT=L.t;A.wx=A.lastX;A.wy=A.lastY;}const u=L.t-A.deadT;
      if(u<1.5){const x=A.wx+u*70,y=A.wy-u*90+u*u*420;if(L.t-A.lastS>.04){A.lastS=L.t;const k=Math.floor(L.t*50);A.smoke.push({x:x-10,y,t0:L.t,life:.8,r:8+hs(k)*5,dx:80,dy:40,a:.8,col:hs(k+1)<.5?'#2a2220':'#4a403a'});}
        drawSmoke(A,L.t);ctx.save();ctx.translate(x,y);ctx.rotate(u*8);ctx.translate(-x,-y);_dph({x,y,char:A.char,skin:A.skin,anim:L.t,tilt:0,hurt:true,vx:0,vy:0});ctx.restore();
        if(u<.35){ctx.save();ctx.globalAlpha=1-u/.35;star(A.wx,A.wy,40+u*120,18+u*50,8,u);ctx.fillStyle='#ffb02e';ctx.fill();ctx.restore();}}}
    else A.deadT=null;}}catch(e){}
  _dpl(L);};

/* birds and far-away balloons in the sky of plane levels */
function skyLife(L){const t=L.t;
  const cyc=9,n=Math.floor(t/cyc),u=(t-n*cyc)/cyc,y0=60+hs(n)*150,dir=1;
  if(hs(n+7)<.75){const x0=W+60-u*(W+220);for(let i=0;i<5;i++){const bx=x0+[0,18,18,36,36][i],by=y0+[0,-10,10,-20,20][i],f=Math.sin(t*12+i)*5;
    ctx.save();ctx.globalAlpha=.55;ctx.strokeStyle='#3a2e3a';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bx-8,by-f);ctx.quadraticCurveTo(bx-3,by-2,bx,by);ctx.quadraticCurveTo(bx+3,by-2,bx+8,by-f);ctx.stroke();ctx.restore();}}
  const c2=23,m=Math.floor(t/c2),v=(t-m*c2)/c2,bx=W+80-v*(W+200),by=110+hs(m+3)*120,cols=['#e8562e','#2e8f86','#7d5aa6','#e2b24a'];
  if(hs(m+11)<.7){ctx.save();ctx.globalAlpha=.5;const col=cols[m%4];ctx.translate(bx,by+Math.sin(t*1.3)*6);ctx.scale(.6,.6);
    ell(0,0,26,30,col,2.5);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(-4,-30,8,58);line(-14,22,-7,40,1.6);line(14,22,7,40,1.6);rr(-9,38,18,11,2,'#8a5a32',2);ctx.restore();}}
const _mbl=makeBossLevel;makeBossLevel=function(def){const L=_mbl(def);const d=LEVELS[L.id];
  if(d&&d.kind==='plane'&&L.drawBG){const bg=L.drawBG;L.drawBG=function(){bg.apply(this,arguments);try{skyLife(L);}catch(e){}};}
  return L;};
})();
