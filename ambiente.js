/* ambiente.js — cinematic polish for every boss fight (drawing only, online stays in sync):
   - the fight opens with an iris and a title card with the boss's name
   - when the boss changes phase the camera punches in on it for a moment
   - each island adds its own atmosphere: sun shafts, low fog, floating motes and a soft vignette
   - when the boss is knocked out the picture closes with an iris on the boss */
(function(){
const AMB={1:{light:'rgba(255,230,160,',fog:'rgba(255,240,215,',mote:'#fff1c8'},2:{light:'rgba(200,240,255,',fog:'rgba(220,240,240,',mote:'#e0fbff'},3:{light:'rgba(210,180,255,',fog:'rgba(70,50,90,',mote:'#d6b8ff'},4:{light:'rgba(220,240,255,',fog:'rgba(240,248,255,',mote:'#ffffff'},5:{light:'rgba(255,220,200,',fog:'rgba(240,245,255,',mote:'#fff6c8'}};
let VIG=null;function vig(){if(VIG)return VIG;const [c,g]=mk(W,H);const gr=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(20,10,0,.42)');g.fillStyle=gr;g.fillRect(0,0,W,H);VIG=c;return c;}
function ambience(L){const d=LEVELS[L.id];if(!d||(d.kind!=='boss'&&d.kind!=='plane'))return;const a=AMB[d.isl]||AMB[1],t=L.t,plane=d.kind==='plane';ctx.save();
  ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const x=120+i*230+Math.sin(t*.2+i)*40,w=70+(i%2)*40;ctx.globalAlpha=.06+.035*Math.sin(t*.7+i*1.7);ctx.fillStyle=a.light+'1)';ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+w,0);ctx.lineTo(x+w-220,H);ctx.lineTo(x-260,H);ctx.closePath();ctx.fill();}
  ctx.globalCompositeOperation='source-over';
  if(!plane){for(let l=0;l<2;l++){ctx.globalAlpha=.09+l*.06;for(let i=0;i<6;i++){const x=((i*210+t*(12+l*10)*(l?1:-1))%(W+300)+W+300)%(W+300)-150;cloudShape(ctx,x,GROUND+10-l*12+Math.sin(t*.6+i)*4,.7+l*.2,a.fog+'1)',0);}}}
  for(let i=0;i<22;i++){const x=(i*97+Math.sin(t*.4+i)*40+t*(6+i%4*3))%W,y=(i*61+t*(10+i%3*6))%H;ctx.globalAlpha=.35+.3*Math.sin(t*2+i);circ(x,y,1.2+(i%3)*.7,a.mote,0);}
  ctx.globalAlpha=plane?.75:.92;ctx.drawImage(fgLayer(d.isl||1),Math.sin(t*.3)*8,Math.cos(t*.25)*4+6);ctx.globalAlpha=1;ctx.drawImage(vig(),0,0);ctx.restore();}

/* blurry foreground shapes at the bottom edges, for depth (prepared once per island) */
const FGC={};function fgLayer(isl){if(FGC[isl])return FGC[isl];const [c,g]=mk(W,H);try{g.filter='blur(3px)';}catch(e){}g.lineJoin='round';
  const dark={1:'#2f4a22',2:'#1f3440',3:'#1a1224',4:'#4a5a6a',5:'#1f3a28'}[isl]||'#2f4a22',acc={1:'#a83a2a',2:'#6b4a2a',3:'#2a1a30',4:'#e8f0f6',5:'#c8392b'}[isl];
  const bush=(x,y,s)=>{g.fillStyle=dark;for(const [dx,dy,r] of [[0,0,40],[34,8,34],[-34,10,32],[12,-26,30],[-16,-20,26]]){g.beginPath();g.arc(x+dx*s,y+dy*s,r*s,0,TAU);g.fill();}};
  if(isl===2){g.fillStyle=dark;g.beginPath();g.ellipse(W-40,H+10,110,70,0,0,TAU);g.fill();g.beginPath();g.ellipse(W-170,H+30,70,50,0,0,TAU);g.fill();g.fillStyle=acc;g.fillRect(W-120,H-130,14,90);g.beginPath();g.arc(W-113,H-136,16,0,TAU);g.fill();}
  else if(isl===3){g.strokeStyle=dark;g.lineCap='round';g.lineWidth=22;g.beginPath();g.moveTo(W-20,H+20);g.quadraticCurveTo(W-50,H-90,W-120,H-150);g.stroke();g.lineWidth=9;g.beginPath();g.moveTo(W-60,H-90);g.lineTo(W-150,H-100);g.moveTo(W-95,H-130);g.lineTo(W-110,H-190);g.stroke();g.fillStyle=dark;g.beginPath();g.ellipse(W-60,H+10,120,50,0,0,TAU);g.fill();}
  else if(isl===4||isl===5){for(const [x,s2] of [[W-20,1],[W-120,.75]]){g.fillStyle=dark;for(let i=0;i<3;i++){g.beginPath();g.moveTo(x-50*s2+i*10*s2,H+10-i*45*s2);g.lineTo(x,H-80*s2-i*45*s2);g.lineTo(x+50*s2-i*10*s2,H+10-i*45*s2);g.fill();}g.fillStyle=acc;for(let i=0;i<5;i++){g.beginPath();g.arc(x-24*s2+(i*23)%48*s2,H-30-(i*37)%100*s2,(isl===5?5:7)*s2,0,TAU);g.fill();}}}
  else{bush(W-60,H+30,1.1);bush(W-190,H+50,.8);g.fillStyle=acc;for(let i=0;i<7;i++){g.beginPath();g.arc(W-230+i*30,H-24-(i%3)*16,6,0,TAU);g.fill();}}
  FGC[isl]=c;return c;}
function iris(cx,cy,r){ctx.save();ctx.fillStyle='#0b0805';ctx.beginPath();ctx.rect(0,0,W,H);ctx.arc(cx,cy,Math.max(0,r),0,TAU,true);ctx.fill('evenodd');ctx.beginPath();ctx.arc(cx,cy,Math.max(0,r),0,TAU);ctx.lineWidth=6;ctx.strokeStyle='#2a1d14';ctx.stroke();ctx.restore();}
function titleCard(L,a){const B=L.boss;if(!B||!B.def)return;const k=a<.35?a/.35:a>2.1?Math.max(0,1-(a-2.1)/.4):1;if(k<=0)return;const y=-80+k*150;ctx.save();ctx.translate(W/2,y);ctx.rotate(Math.sin(a*3)*.012);
  rr(-250,-34,500,74,10,'#f3e6c4',4);rr(-242,-26,484,58,6,null,1.5);ctx.strokeStyle='rgba(107,58,38,.6)';for(const s of[-1,1]){star(s*222,4,10,4,5,a*2);ctx.fillStyle=C.brass;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();}
  txt(B.def.name,0,-4,B.def.name.length>20?26:32,C.rust,C.ink);if(B.def.sub)btxt(B.def.sub,0,24,13,'rgba(107,58,38,.9)','center',800);ctx.restore();}
const _dlA=drawLevel;drawLevel=function(L){const B=L&&L.boss;if(!B){_dlA(L);return;}
  const age=L.t;
  /* phase punch-in */
  let z=0;if(L._bgT!=null&&L._bgT>0){const a=L.t-L._bgT;if(a>=0&&a<.5)z=Math.sin(a/.5*Math.PI)*.07;}
  const c=B.center?B.center():{x:W*.7,y:H/2};
  if(z>0){ctx.save();ctx.translate(c.x,c.y);ctx.scale(1+z,1+z);ctx.translate(-c.x,-c.y);try{_dlA(L);}finally{ctx.restore();}}else _dlA(L);
  if(L.state!=='results'&&L.state!=='dead')try{ambience(L);}catch(e){}
  if(age<.9){const k=age/.9;const p=L.Ps&&L.Ps[0]?L.Ps[0]:{x:W/2,y:H/2};iris(p.x,(p.type==='plane'?p.y:p.y-40),k*k*900);}
  titleCard(L,age);
  if(B.dead&&L.state==='ko'){if(L._ko0==null)L._ko0=L.t;const a=L.t-L._ko0;if(a>1.4&&a<2.6){const k=Math.min(1,(a-1.4)/.6),r=k<1?(1-k)*(1-k)*900+60:60;iris(c.x,c.y,a<2.2?r:60+(a-2.2)/.4*900);}}};
})();
