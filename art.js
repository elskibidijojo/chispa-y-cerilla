'use strict';
/* ================= ART: helpers, heroes, projectiles, enemies, NPCs ================= */
function mk(w,h,s=DPR){const c=document.createElement('canvas');c.width=Math.ceil(w*s);c.height=Math.ceil(h*s);const g=c.getContext('2d');g.scale(s,s);return[c,g];}
function txt(s,x,y,size,fill=C.paper,stroke=C.ink,align='center',font=FONT,g=ctx){g.font=`${size}px ${font}`;g.textAlign=align;g.textBaseline='middle';g.lineJoin='round';
  if(stroke){g.lineWidth=Math.max(3,size*.16);g.strokeStyle=stroke;g.strokeText(s,x,y);}g.fillStyle=fill;g.fillText(s,x,y);}
function btxt(s,x,y,size,fill=C.ink,align='left',weight=700){ctx.font=`${weight} ${size}px ${BFONT}`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=fill;ctx.fillText(s,x,y);}
function wrap(s,x,y,maxW,lh,size,fill=C.ink,weight=600){ctx.font=`${weight} ${size}px ${BFONT}`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=fill;
  const words=String(s).split(' ');let line='',yy=y;for(const w of words){const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){ctx.fillText(line,x,yy);line=w;yy+=lh;}else line=t;}if(line)ctx.fillText(line,x,yy);return yy;}
function hose(x1,y1,cx,cy,x2,y2,w=5,g=ctx){g.lineWidth=w;g.strokeStyle=C.ink;g.lineCap='round';g.beginPath();g.moveTo(x1,y1);g.quadraticCurveTo(cx,cy,x2,y2);g.stroke();}
function glove(x,y,r=6,g=ctx){g.beginPath();g.arc(x,y,r,0,TAU);g.fillStyle=C.white;g.fill();g.lineWidth=Math.max(2,r*.3);g.strokeStyle=C.ink;g.stroke();}
function card(x,y,w,h,fill=C.paper,lw=3.5,r=6){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=lw;ctx.strokeStyle=C.ink;ctx.stroke();}
function star(x,y,r1,r2,n,rot=0,g=ctx){g.beginPath();for(let i=0;i<n*2;i++){const r=i%2?r2:r1,a=rot+i*Math.PI/n;g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}g.closePath();}
function blob(g,pts,fill,lw=6){g.lineWidth=lw;g.strokeStyle=C.ink;for(const [a,b,r] of pts){g.beginPath();g.arc(a,b,r,0,TAU);g.stroke();}g.fillStyle=fill;for(const [a,b,r] of pts){g.beginPath();g.arc(a,b,r,0,TAU);g.fill();}}
function cloudShape(g,x,y,s,fill=C.paper,lw=6){blob(g,[[x,y,30*s],[x+34*s,y-12*s,36*s],[x+70*s,y,28*s],[x+24*s,y+14*s,26*s],[x+52*s,y+14*s,24*s]],fill,lw);}
function coinIcon(x,y,r=9,spin=1){ctx.save();ctx.translate(x,y);ctx.scale(Math.max(.15,Math.abs(spin)),1);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fillStyle=C.gold;ctx.fill();
  ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.6,0,TAU);ctx.lineWidth=1.5;ctx.stroke();ctx.restore();}
function shadowE(x,y,rx,a=.25){ctx.beginPath();ctx.ellipse(x,y,rx,rx*.22,0,0,TAU);ctx.fillStyle=`rgba(20,13,8,${a})`;ctx.fill();}
function rr(x,y,w,h,r,fill,lw=3){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(lw){ctx.lineWidth=lw;ctx.strokeStyle=C.ink;ctx.stroke();}}
function circ(x,y,r,fill,lw=3){ctx.beginPath();ctx.arc(x,y,r,0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill();}if(lw){ctx.lineWidth=lw;ctx.strokeStyle=C.ink;ctx.stroke();}}
function ell(x,y,rx,ry,fill,lw=3,rot=0){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot,0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill();}if(lw){ctx.lineWidth=lw;ctx.strokeStyle=C.ink;ctx.stroke();}}
function poly(pts,fill,lw=3){ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(lw){ctx.lineWidth=lw;ctx.strokeStyle=C.ink;ctx.stroke();}}
function line(x1,y1,x2,y2,lw=3,col=C.ink){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineWidth=lw;ctx.strokeStyle=col;ctx.lineCap='round';ctx.stroke();}

/* boss face: eyes with pupils looking at the player, brows by anger, several mouths */
function face(x,y,s,o={}){const ew=(o.ew||16)*s,eh=(o.eh||20)*s,gap=(o.gap||30)*s,lk=o.look||{x:0,y:0};ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  for(const sd of[-1,1]){const ex=x+sd*gap,ey=y;ell(ex,ey,ew,eh,o.col||C.white,3.5*s);
    if(o.dead){ctx.lineWidth=3.5*s;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(ex-ew*.5,ey-ew*.5);ctx.lineTo(ex+ew*.5,ey+ew*.5);ctx.moveTo(ex+ew*.5,ey-ew*.5);ctx.lineTo(ex-ew*.5,ey+ew*.5);ctx.stroke();}
    else{ell(ex+lk.x*ew*.45,ey+eh*.15+lk.y*eh*.3,ew*.42,eh*.5,o.pupil||C.ink,0);circ(ex+lk.x*ew*.45+ew*.15,ey+lk.y*eh*.3-eh*.05,ew*.15,'#fff',0);}
    if(o.brow!==false){ctx.save();ctx.translate(ex,ey-eh*1.25);ctx.rotate((o.dead?-1:1)*sd*(o.ang??.3));rr(-ew*1.1,-4*s,ew*2.2,8*s,4*s,C.ink,0);ctx.restore();}}
  const my=y+(o.my||36)*s,mw=(o.mw||36)*s,op=(o.open??.3);
  if(o.mouth==='smile'){ctx.beginPath();ctx.arc(x,my-mw*.5,mw*.8,.2*Math.PI,.8*Math.PI);ctx.lineWidth=3.5*s;ctx.strokeStyle=C.ink;ctx.stroke();}
  else if(o.mouth==='o'){ell(x,my,mw*.3,mw*.35*(1+op),C.ink,0);}
  else if(o.mouth==='none'){}
  else if(o.mouth==='frown'){ctx.beginPath();ctx.arc(x,my+mw*.6,mw*.7,1.2*Math.PI,1.8*Math.PI);ctx.lineWidth=3.5*s;ctx.strokeStyle=C.ink;ctx.stroke();}
  else{const oh=mw*(.25+op*.8);ctx.beginPath();ctx.moveTo(x-mw,my);ctx.quadraticCurveTo(x,my+oh*.3,x+mw,my);ctx.quadraticCurveTo(x,my+oh*2,x-mw,my);ctx.closePath();ctx.fillStyle=C.ink;ctx.fill();
    ctx.save();ctx.clip();ctx.fillStyle=C.white;for(let i=-3;i<=3;i++)ctx.fillRect(x+i*mw*.28-mw*.12,my-4*s,mw*.24,8*s+oh*.15);ctx.fillStyle=C.rust;ell(x,my+oh*1.4,mw*.45,oh*.4,C.rust,0);ctx.restore();
    ctx.beginPath();ctx.moveTo(x-mw,my);ctx.quadraticCurveTo(x,my+oh*2,x+mw,my);ctx.lineWidth=3*s;ctx.strokeStyle=C.ink;ctx.stroke();}
  ctx.restore();}

/* ---------- heroes ---------- */
function heroBody(char,cy,by,f,o){
  if(char==='velita'){const tt=o.anim||0;ctx.beginPath();ctx.moveTo(-15,by);ctx.lineTo(-15,by-58);for(let i=0;i<=6;i++){const x=-15+i*5;ctx.lineTo(x,by-58+(i%2?6:0)+(i===2?10:0));}ctx.lineTo(15,by);ctx.closePath();
    ctx.fillStyle='#f4ead6';ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();ell(-8,by-40,3,8,'rgba(190,170,220,.45)',0);rr(-6,by-50,4,16,2,'#e7dccb',0);
    ctx.fillStyle='#b48ad0';ctx.fillRect(-15,by-12,30,8);ctx.lineWidth=2;ctx.strokeRect(-15,by-12,30,8);line(0,by-58,0,by-66,2.5);
    const fl=o.flameK||(o.shoot?1.4:1);ctx.beginPath();ctx.moveTo(-6,by-64);ctx.quadraticCurveTo(-9+Math.sin(tt*18)*2,by-78*fl+12,Math.sin(tt*14)*3,by-64-26*fl);ctx.quadraticCurveTo(9+Math.sin(tt*16)*2,by-78*fl+12,6,by-64);ctx.closePath();
    const g=ctx.createLinearGradient(0,by-92,0,by-64);g.addColorStop(0,'#fff3b0');g.addColorStop(1,'#b48aff');ctx.fillStyle=g;ctx.fill();ctx.lineWidth=2.4;ctx.strokeStyle=C.ink;ctx.stroke();ell(0,by-70,2.5,5,'#6fb7ff',0);return cy-2;}
  if(char==='cerilla'){rr(-6,by-36,12,38,4,C.match);ctx.lineWidth=1.5;ctx.strokeStyle='rgba(20,13,8,.4)';line(-1,by-30,-1,by-6,1.5,'rgba(20,13,8,.35)');
    const hy=by-48,fl=o.flameK||(o.shoot?1.4:1),tt=o.anim||0;
    ctx.beginPath();ctx.moveTo(-8,hy-10);ctx.quadraticCurveTo(-12+Math.sin(tt*20)*2,hy-28*fl,0+Math.sin(tt*15)*3,hy-40*fl);ctx.quadraticCurveTo(12+Math.sin(tt*18)*2,hy-26*fl,8,hy-10);ctx.closePath();
    const g=ctx.createLinearGradient(0,hy-40,0,hy-8);g.addColorStop(0,'#ffe27a');g.addColorStop(1,'#f08a2e');ctx.fillStyle=g;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
    ell(0,hy,16,15,C.matchHead,3.5);ell(-6,hy-6,4,3,'rgba(255,200,170,.6)',0);return hy;}
  ctx.fillStyle=C.steel;ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-11,by-16,22,16,3);ctx.fill();ctx.stroke();
  ctx.lineWidth=2;for(const d of[-6,-11]){ctx.beginPath();ctx.moveTo(-11,by+d);ctx.lineTo(11,by+d);ctx.stroke();}
  const gr=ctx.createRadialGradient(f*-4,cy-6,3,0,cy,26);gr.addColorStop(0,'#fffbe6');gr.addColorStop(1,o.shoot?'#ffe27a':C.glass);
  if(o.flameK)circ(0,cy,34*o.flameK,'rgba(255,240,170,.35)',0);else if(o.shoot)circ(0,cy,34,'rgba(255,226,122,.25)',0);
  ctx.beginPath();ctx.moveTo(-10,by-14);ctx.bezierCurveTo(-28,cy+14,-26,cy-26,0,cy-25);ctx.bezierCurveTo(26,cy-26,28,cy+14,10,by-14);ctx.closePath();ctx.fillStyle=gr;ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.lineWidth=2;ctx.strokeStyle=`rgba(200,120,20,${o.shoot?1:.55})`;ctx.beginPath();ctx.moveTo(-5,by-14);ctx.lineTo(-5,cy+10);for(let i=0;i<4;i++)ctx.lineTo(-5+i*3.3+1.6,cy+(i%2?10:6));ctx.lineTo(5,by-14);ctx.stroke();return cy;}
function drawHero(o){
  ctx.save();ctx.translate(o.x,o.y);if(o.scale)ctx.scale(o.scale,o.scale);ctx.lineCap='round';ctx.lineJoin='round';
  if(o.skin&&typeof SKINS!=='undefined'&&SKINS[o.skin]){const sk=SKINS[o.skin];if(sk.filter)ctx.filter=sk.filter;if(sk.alpha)ctx.globalAlpha*=sk.alpha;}
  if(o.ghost){ctx.filter=((ctx.filter&&ctx.filter!=='none')?ctx.filter+' ':'')+'saturate(.25) brightness(1.55) contrast(.8)';ctx.globalAlpha*=.8;}
  if(o.ghostDash)ctx.globalAlpha=.4;
  if((o.superPose>0||o.exPose>0)&&typeof heroPoseT==='function')heroPoseT(o);
  else if(o.dash){ctx.rotate(o.face*.12);ctx.scale(1.32,.8);}
  else if(o.land>0){const k=o.land/.14;ctx.scale(1+k*.28,1-k*.24);}
  else if(o.ball!=null){ctx.translate(0,-38);ctx.rotate(o.ball);const pu=1+Math.sin(o.ball*2)*.06;ctx.scale(.86*pu,.86/pu);ctx.translate(0,38);}
  else if(o.run){const st=Math.abs(Math.sin(o.anim)),sq=Math.cos(o.anim*2);ctx.translate(0,-st*6);ctx.rotate(o.face*.09);ctx.scale(1+sq*.06,1-sq*.07);}
  else if(o.air&&o.vy!=null){if(o.vy<0){const r=clamp(-o.vy/900,0,1);ctx.scale(1-r*.12,1+r*.16);}else{const r=clamp(o.vy/1200,0,1);ctx.scale(1+r*.07,1-r*.05);}}
  else if(!o.air&&!o.duck){const b=Math.sin((o.anim||0)*2.5);ctx.scale(1-b*.035,1+b*.055);}
  if(o.hurt){const w=Math.sin((typeof clock!=='undefined'?clock:0)*60)*.09;ctx.scale(1+w,1-w);}
  if(o.flash&&o.shoot){ctx.translate(-(o.aimX??o.face)*2.5,0);ctx.scale(.97,1.03);}
  if(o.spin>0){ctx.translate(0,-40);ctx.rotate(o.face*(1-o.spin/.35)*TAU);ctx.translate(0,40);}
  const f=o.face,s=o.run?Math.sin(o.anim):0,hip=o.duck?-16:-30,air=o.air,ch=o.char||'chispa';
  if(!o.noLegs)for(const i of[-1,1]){const fx=air?i*9+f*4:i*7+s*i*14,fy=air?-10:-Math.max(0,s*i)*7;hose(i*5,hip,i*5+s*i*8,hip*.5,fx,fy,5);ell(fx+f*5,fy-2,9,5,ch==='cerilla'?'#3a2a20':C.ink,0);}
  hose(-f*8,hip-(ch==='cerilla'?10:6),-f*16,hip,-f*14,hip+6+s*4,4.5);glove(-f*14,hip+6+s*4,5.5);
  const by=hip,cy=by-37,hy=heroBody(ch,cy,by,f,o),ex=f*5;
  const fy=ch==='cerilla'?hy-2:cy-5;
  if(o.hurt){ctx.lineWidth=3;ctx.strokeStyle=ch==='cerilla'?C.white:C.ink;for(const d of[-6,6]){ctx.beginPath();ctx.moveTo(ex+d-4,fy-4);ctx.lineTo(ex+d+4,fy+4);ctx.moveTo(ex+d+4,fy-4);ctx.lineTo(ex+d-4,fy+4);ctx.stroke();}}
  else if(o.ghostFace||!o.noBlink&&((typeof clock!=='undefined'?clock:0)*1.3+(o.x||0)*.013)%4.1<.13){ctx.lineWidth=2.6;ctx.strokeStyle=ch==='cerilla'?C.white:C.ink;for(const d of[-6,6]){ctx.beginPath();ctx.moveTo(ex+d-4,fy+1);ctx.quadraticCurveTo(ex+d,fy+4,ex+d+4,fy+1);ctx.stroke();}}
  else for(const d of[-6,6]){if(ch==='cerilla')ell(ex+d,fy,3.6,5.5,C.white,0);ell(ex+d+(ch==='cerilla'?f:0),fy+(ch==='cerilla'?1:0),ch==='cerilla'?2.2:3.6,ch==='cerilla'?3.6:7,C.ink,0);circ(ex+d+f,fy-3,1.3,'#fff',0);}
  ctx.beginPath();if(o.hurt)ctx.ellipse(ex,fy+12,3.5,4.5,0,0,TAU);else ctx.arc(ex,fy+(ch==='cerilla'?4:10),6,.15*Math.PI,.85*Math.PI);ctx.lineWidth=2.6;ctx.strokeStyle=ch==='cerilla'?C.white:C.ink;ctx.stroke();
  if(ch!=='cerilla'){ctx.fillStyle='rgba(230,120,90,.45)';for(const d of[-13,13]){ctx.beginPath();ctx.arc(ex+d,fy+9,3.2,0,TAU);ctx.fill();}}
  const ax=o.aimX??f,ay=o.aimY??0,hx=ax*27,hyy=(o.duck?-24:-44)+ay*27,sh=ch==='cerilla'?by-24:by-8;
  hose(f*(ch==='cerilla'?5:8),sh,f*8+ax*8,by,hx,hyy,4.5);glove(hx,hyy,6.5);
  if(o.flash){ctx.save();ctx.translate(hx+ax*10,hyy+ay*10);ctx.rotate((o.anim||0)*30);star(0,0,10,4,5);ctx.fillStyle=ch==='cerilla'?'#ffb35a':'#ffe27a';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
  if(o.exPose>0&&typeof heroExFx==='function')heroExFx(o,hx,hyy,ax,ay,ch);
  if(o.skin&&typeof drawSkinAcc==='function')drawSkinAcc(o,ch,fy,f,ex);
  ctx.restore();}
function drawGhost(char,x,y,t){const body=char==='cerilla'?'#f9e0da':char==='velita'?'#f1e4fc':'#eef8f6',glow=char==='cerilla'?'255,170,120':char==='velita'?'200,150,255':'159,240,230';
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*2.2)*.12);
  /* soft aura + parry ring (the soul is pink-parryable by friends) */
  const g=ctx.createRadialGradient(0,-6,4,0,-6,70);g.addColorStop(0,`rgba(${glow},.55)`);g.addColorStop(1,`rgba(${glow},0)`);ctx.fillStyle=g;ctx.fillRect(-70,-76,140,140);
  ctx.globalAlpha=.6+.25*Math.sin(t*10);circ(0,-6,44+Math.sin(t*10)*3,null,0);ctx.setLineDash([8,7]);ctx.lineDashOffset=-t*40;ctx.lineWidth=3;ctx.strokeStyle=C.parry;ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
  /* sparkle trail */
  for(let i=1;i<6;i++){ctx.globalAlpha=.5-i*.08;star(Math.sin(t*3-i)*10,18+i*14,5-i*.6,2,4,t*3+i);ctx.fillStyle='#fff7d0';ctx.fill();}ctx.globalAlpha=.9;
  /* little angel wings flapping */
  for(const sd of[-1,1]){ctx.save();ctx.translate(sd*16,-14);ctx.rotate(sd*(.5+Math.sin(t*14)*.45));ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(sd*30,-26,sd*34,-4);ctx.quadraticCurveTo(sd*26,2,sd*20,-2);ctx.quadraticCurveTo(sd*16,6,sd*8,4);ctx.closePath();
    ctx.fillStyle='#ffffff';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
  /* body: sheet ghost with the hero's head shape on top */
  ctx.beginPath();ctx.moveTo(-17,2);ctx.bezierCurveTo(-24,-34,24,-34,17,2);for(let i=0;i<4;i++)ctx.quadraticCurveTo(13-i*10,20+Math.sin(t*8+i)*5,8-i*10,12+Math.sin(t*8+i+1)*3);ctx.closePath();
  ctx.fillStyle=body;ctx.fill();ctx.lineWidth=2.6;ctx.strokeStyle=C.ink;ctx.stroke();
  if(char==='cerilla'){ellG(0,-30,9,8,'rgba(200,57,43,.55)');}else if(char==='velita'){ctx.beginPath();ctx.moveTo(-4,-28);ctx.quadraticCurveTo(0,-46+Math.sin(t*16)*3,4,-28);ctx.fillStyle='rgba(200,160,255,.8)';ctx.fill();}
  else{ctx.fillStyle='rgba(255,243,196,.8)';ctx.beginPath();ctx.arc(0,-28,7,0,TAU);ctx.fill();}
  /* sad face with a tear */
  ctx.fillStyle=C.ink;for(const d of[-6,6]){ctx.beginPath();ctx.ellipse(d,-12,2.6,4.2,0,0,TAU);ctx.fill();}ctx.beginPath();ctx.arc(0,-1,4,Math.PI*1.1,Math.PI*1.9);ctx.lineWidth=2.2;ctx.stroke();
  const tr=(t*1.2)%1;ctx.globalAlpha=1-tr;ell(7,-6+tr*14,1.8,2.8,'#8ecbe6',0);ctx.globalAlpha=1;
  /* halo */
  ctx.beginPath();ctx.ellipse(0,-42-Math.sin(t*4)*2,15,4,0,0,TAU);ctx.lineWidth=5;ctx.strokeStyle='rgba(255,226,122,.5)';ctx.stroke();ctx.lineWidth=2.5;ctx.strokeStyle=C.gold;ctx.stroke();
  ctx.restore();}
function ellG(x,y,rx,ry,col){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=col;ctx.fill();}
function drawPlaneHero(o){ctx.save();ctx.translate(o.x,o.y);const s=o.small?.55:1;ctx.scale(s,s);ctx.rotate(clamp(o.tilt||0,-.35,.35));if(o.spin>0)ctx.rotate((1-o.spin/.35)*TAU);
  ctx.lineJoin='round';ctx.lineCap='round';const cer=o.char==='cerilla',vel=o.char==='velita',wing=cer?'#2e8f86':vel?'#7d5aa6':C.rust,body=cer?'#dfe9d8':vel?'#efe6f5':C.paper;
  ell(-2,12,28,6,wing);poly([[-30,-2],[-44,-18],[-38,4]],wing);
  ctx.beginPath();ctx.moveTo(-8,-18);for(let i=0;i<5;i++)ctx.lineTo(-12-i*9,-16+Math.sin(o.anim*14+i)*4);ctx.lineWidth=5;ctx.strokeStyle=cer?C.brass:C.rust;ctx.stroke();
  ell(0,0,34,13,body);ell(31,0,7,10,wing);ell(40,0,3,16*Math.abs(Math.sin(o.anim*50)),'rgba(20,13,8,.7)',0);
  if(cer){rr(-6,-26,9,14,3,C.match,2.5);ell(-2,-30,9,8,C.matchHead,2.5);ctx.beginPath();ctx.moveTo(-6,-36);ctx.quadraticCurveTo(-4,-50,0,-54+Math.sin(o.anim*20)*2);ctx.quadraticCurveTo(6,-46,3,-36);ctx.fillStyle='#ffb35a';ctx.fill();ctx.lineWidth=2;ctx.stroke();
    ell(1,-31,1.6,2.6,C.white,0);ell(5,-31,1.6,2.6,C.white,0);}
  else if(vel){rr(-8,-34,14,22,3,'#f4ead6',2.5);ctx.beginPath();ctx.moveTo(-4,-36);ctx.quadraticCurveTo(-2,-50,1,-52+Math.sin(o.anim*20)*2);ctx.quadraticCurveTo(5,-46,3,-36);ctx.fillStyle='#d6b8ff';ctx.fill();ctx.lineWidth=2;ctx.stroke();ell(-3,-26,1.6,2.6,C.ink,0);ell(2,-26,1.6,2.6,C.ink,0);}
  else{circ(-2,-20,12,C.glass);ctx.fillStyle=C.steel;ctx.fillRect(-7,-11,10,6);ell(2,-22,2,4,C.ink,0);ell(7,-22,2,4,C.ink,0);}
  rr(-24,-9,46,7,3,wing,3);
  if(o.flash){star(46,3,9,4,5,o.anim*30);ctx.fillStyle='#ffe27a';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();}
  ctx.restore();}

/* ---------- projectile sprites ---------- */
const LETTERS='ZAS!¡PUM?RIN';
function drawSpr(e,t){const pc=e.parry&&!(e.cool>0),r=e.r||12,P=c=>pc?C.parry:c;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;
  const rot=e.rot||0;
  switch(e.spr){
    case 'ghostE':{const w=Math.sin(t*8+e.x*.05)*3;ctx.scale(e.vx<0?-1:1,1);ctx.globalAlpha=e.cool>0?.4:.92;ctx.beginPath();ctx.moveTo(-15,8);ctx.quadraticCurveTo(-17,-18,0,-19);ctx.quadraticCurveTo(17,-18,15,8);
      for(let i=0;i<4;i++)ctx.quadraticCurveTo(11-i*8,16+(i%2?w:-w),7-i*8,9);ctx.closePath();ctx.fillStyle=P('#e8f2ee');ctx.fill();ctx.lineWidth=3;ctx.stroke();ctx.globalAlpha=1;
      ell(-5,-5,3,5,C.ink,0);ell(5,-5,3,5,C.ink,0);ell(0,5,3,2.5+Math.abs(w)*.4,C.ink,0);line(-15,-2,-24,4+w,3);break;}
    case 'bell':ctx.rotate(Math.sin(rot)*.5);ctx.beginPath();ctx.moveTo(-16,10);ctx.quadraticCurveTo(-16,-16,0,-17);ctx.quadraticCurveTo(16,-16,16,10);ctx.closePath();ctx.fillStyle=P(C.brass);ctx.fill();ctx.lineWidth=3;ctx.stroke();circ(0,13,5,C.ink,0);ell(-5,-3,2,3.5,C.ink,0);ell(5,-3,2,3.5,C.ink,0);break;
    case 'gear':ctx.rotate(rot);ctx.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,rr2=i%2?r-4:r+2;ctx.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2);ctx.lineTo(Math.cos(a+Math.PI/8)*rr2,Math.sin(a+Math.PI/8)*rr2);}ctx.closePath();ctx.fillStyle=P(C.steel);ctx.fill();ctx.stroke();circ(0,0,4.5,C.ink,0);break;
    case 'note':{ctx.rotate(Math.sin(t*6)*.2);const col=P(C.ink);ell(0,4,10,7.5,col,0);ctx.beginPath();ctx.ellipse(0,4,10,7.5,-.4,0,TAU);ctx.lineWidth=2;ctx.strokeStyle=C.paper;ctx.stroke();
      ctx.lineWidth=5;ctx.strokeStyle=C.paper;ctx.beginPath();ctx.moveTo(8,2);ctx.lineTo(8,-21);ctx.quadraticCurveTo(17,-15,19,-6);ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=col;ctx.stroke();break;}
    case 'drop':case 'bigdrop':case 'wax':ctx.rotate(Math.atan2(e.vy||1,e.vx||0)-Math.PI/2);ctx.beginPath();ctx.moveTo(0,r+3);ctx.quadraticCurveTo(r,0,0,-r-2);ctx.quadraticCurveTo(-r,0,0,r+3);ctx.fillStyle=P(e.spr==='wax'?'#f3ead2':'#a9c3c7');ctx.fill();ctx.stroke();
      if(e.spr==='bigdrop'){ell(-3,-2,2,3,C.ink,0);ell(3,-2,2,3,C.ink,0);}break;
    case 'egg':ell(0,0,r*.8,r,P(C.paper),2.5);break;
    case 'hail':ctx.rotate(rot);star(0,0,r,r*.55,6);ctx.fillStyle=P('#e8f1f0');ctx.fill();ctx.stroke();break;
    case 'ball':circ(0,0,r,P('#2b2420'),3);circ(-4,-4,3,'rgba(255,255,255,.4)',0);break;
    case 'disc':ctx.rotate(rot);circ(0,0,r,P('#231812'),3);ctx.strokeStyle='rgba(239,224,191,.25)';ctx.lineWidth=1.5;for(const q of[r*.75,r*.55]){ctx.beginPath();ctx.arc(0,0,q,0,4);ctx.stroke();}circ(0,0,r*.3,C.rust,0);break;
    case 'toast':ctx.rotate(rot*.5);rr(-r,-r*.9,r*2,r*1.8,r*.5,P('#d9a05b'),3);rr(-r+4,-r*.9+4,r*2-8,r*1.8-8,r*.4,P('#f0d39a'),0);ell(-5,-2,2,3,C.ink,0);ell(5,-2,2,3,C.ink,0);break;
    case 'butter':rr(-r,-r*.55,r*2,r*1.1,3,P('#f7e27a'),3);ell(-4,-1,1.6,2.6,C.ink,0);ell(4,-1,1.6,2.6,C.ink,0);break;
    case 'jam':case 'orb':case 'ember':circ(0,0,r,P(e.spr==='orb'?'#3b2f55':e.spr==='ember'?'#f08a2e':'#a3263a'),3);circ(-r*.3,-r*.3,r*.3,'rgba(255,255,255,.35)',0);
      if(e.spr==='orb'){ell(-r*.3,0,r*.15,r*.25,'#fffbe6',0);ell(r*.3,0,r*.15,r*.25,'#fffbe6',0);}break;
    case 'crumb':rr(-r*.6,-r*.6,r*1.2,r*1.2,2,P('#b77b3e'),2);break;
    case 'cork':ctx.rotate(Math.atan2(e.vy||0,e.vx||1));rr(-r,-r*.6,r*2,r*1.2,3,P('#c79a5e'),2.5);break;
    case 'nut':case 'shard':circ(0,0,r,P('#8a5a32'),3);ctx.beginPath();ctx.moveTo(-r*.6,-r*.2);ctx.quadraticCurveTo(0,r*.4,r*.6,-r*.2);ctx.stroke();break;
    case 'fog':ctx.globalAlpha=.9;blob(ctx,[[0,0,r],[r*.8,-r*.3,r*.7],[-r*.8,-r*.2,r*.7]],P('#dfe3dc'),3);break;
    case 'light':ctx.rotate(Math.atan2(e.vy||0,e.vx||1));ell(0,0,r*1.6,r*.6,P('#fff3b0'),2.5);break;
    case 'bubble':circ(0,0,r,P('rgba(200,235,240,.55)'),2.5);ctx.beginPath();ctx.arc(-r*.3,-r*.3,r*.35,3.4,4.8);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();break;
    case 'castanet':ctx.rotate(rot);ell(0,0,r,r*.8,P('#5a2a1a'),3);ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(r,0);ctx.stroke();circ(r*.8,0,3,C.rust,0);break;
    case 'dollar':ctx.rotate(rot);circ(0,0,r,P('#efe3c8'),3);star(0,0,r*.6,r*.25,5,0);ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();break;
    case 'fish':ctx.scale(e.vx>0?-1:1,1);ell(0,0,r*1.3,r*.8,P('#d98b4b'),3);poly([[r*1.1,0],[r*1.9,-r*.7],[r*1.9,r*.7]],P('#d98b4b'),3);circ(-r*.6,-r*.2,2.5,C.ink,0);break;
    case 'flame':ctx.rotate(Math.atan2(e.vy||0,e.vx||-1)+Math.PI/2);ctx.beginPath();ctx.moveTo(-r,0);ctx.quadraticCurveTo(-r,-r*1.6,0,-r*2.2);ctx.quadraticCurveTo(r,-r*1.6,r,0);ctx.arc(0,0,r,0,Math.PI);ctx.closePath();
      ctx.fillStyle=P('#f08a2e');ctx.fill();ctx.stroke();circ(0,0,r*.5,pc?C.parryL:'#ffe27a',0);break;
    case 'coal':ctx.rotate(rot);poly([[-r,-r*.4],[-r*.3,-r],[r*.8,-r*.6],[r,r*.4],[0,r],[-r*.8,r*.6]],P('#2b2420'),3);circ(r*.2,0,r*.25,'#f08a2e',0);break;
    case 'rivet':ctx.rotate(rot);circ(0,0,r,P(C.steelD),3);circ(0,0,r*.4,P(C.steel),0);break;
    case 'letter':case 'key':{if(e.spr==='key')circ(0,0,r,P('#2b2420'),3);else rr(-r,-r,r*2,r*2,3,P(C.paper),2.5);txt(e.ch||'A',0,1,r*1.3,e.spr==='key'?C.paper:(pc?C.white:C.ink),null,'center',FONT);break;}
    case 'paper':ctx.rotate(Math.sin(t*3+e.x*.01)*.4);rr(-r,-r*1.2,r*2,r*2.4,2,P(C.white),2.5);for(let i=0;i<4;i++)line(-r*.7,-r*.7+i*r*.45,r*.7,-r*.7+i*r*.45,1.5,'rgba(20,13,8,.4)');break;
    case 'card':ctx.rotate(rot);rr(-r*.7,-r,r*1.4,r*2,3,P(C.white),2.5);txt(e.ch||'♥',0,1,r*1.1,pc?C.white:C.rust,null);break;
    case 'dove':ctx.scale(e.vx>0?-1:1,1);ell(0,0,r,r*.7,P(C.white),3);poly([[-r,-2],[-r-8,0],[-r,3]],C.brass,2);poly([[0,-3],[8,-r-6+Math.sin(t*20)*5],[10,0]],P(C.white),2.5);circ(-r*.5,-3,2,C.ink,0);break;
    case 'star':ctx.rotate(rot);star(0,0,r,r*.45,5);ctx.fillStyle=P(C.gold);ctx.fill();ctx.stroke();break;
    case 'book':ctx.rotate(rot);rr(-r,-r*.7,r*2,r*1.4,2,P('#7a3b2e'),3);ctx.fillStyle=C.paper;ctx.fillRect(-r+3,-r*.7+3,4,r*1.4-6);break;
    case 'feather':ctx.rotate(Math.atan2(e.vy||0,e.vx||1));ell(0,0,r*1.4,r*.45,P('#c9a36a'),2.5);line(-r*1.4,0,r*1.4,0,1.5);break;
    case 'corn':ell(0,0,r*.7,r,P(C.gold),2.5);break;
    case 'hay':ctx.rotate(rot);circ(0,0,r,P('#d9b45a'),3.5);ctx.strokeStyle='rgba(20,13,8,.5)';ctx.lineWidth=2;for(const q of[r*.7,r*.4]){ctx.beginPath();ctx.arc(0,0,q,0,4.5);ctx.stroke();}break;
    case 'straw':ctx.rotate(rot);ctx.lineWidth=3;ctx.strokeStyle=P('#d9b45a');for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(-r,i*3);ctx.lineTo(r,i*3+i*2);ctx.stroke();}break;
    case 'sonic':ctx.rotate(Math.atan2(e.vy||0,e.vx||1));ctx.lineWidth=4;ctx.strokeStyle=P('#d8c8f0');for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-i*7,0,r-i*3,-1,1);ctx.stroke();}break;
    case 'spark':star(0,0,r,r*.4,4,rot);ctx.fillStyle=P('#fff3b0');ctx.fill();ctx.stroke();break;
    default:circ(0,0,r,P('#2b2420'),3);
  }
  ctx.restore();
  if(pc){ctx.beginPath();ctx.arc(e.x,e.y,r+7+Math.sin(t*12)*2,0,TAU);ctx.lineWidth=2.5;ctx.strokeStyle='rgba(159,240,230,.85)';ctx.stroke();}}

/* ---------- enemy & minion skins ---------- */
function drawEnemy(e,t){if(e.hidden&&e.ai!=='popper')return;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;const fl=e.flash>0,F=c=>fl?'#fff':c,dir=e.face||-1,tt=e.t||0;
  const clipPop=e.ai==='popper'&&e.skin!=='caja';if(clipPop){const k=e.pop||0;ctx.save();ctx.beginPath();ctx.rect(-40,-140,80,140+e.r);ctx.clip();ctx.translate(0,(1-k)*60);}
  switch(e.skin){
    case 'raton':ctx.scale(-dir,1);ctx.translate(0,-Math.abs(Math.sin(tt*14))*2);ell(0,0,24,16,F(C.steel));circ(-14,-12,9,F(C.steelD));circ(-24,2,3.5,C.ink,0);circ(-14,-3,3,C.ink,0);
      ctx.beginPath();ctx.moveTo(22,2);ctx.quadraticCurveTo(36,-6,40,6);ctx.stroke();ctx.save();ctx.translate(6,-16);ctx.rotate(tt*8);ell(-7,0,6,4,C.brass);ell(7,0,6,4,C.brass);ctx.restore();circ(-12,16,5,C.ink,0);circ(12,16,5,C.ink,0);break;
    case 'soldadito':ctx.scale(-dir,1);{const w=Math.sin(tt*12)*5;rr(-6+w,4,6,16,2,C.ink,0);rr(0-w,4,6,16,2,C.ink,0);}rr(-12,-22,24,28,4,F(C.rust));line(-12,-14,12,-4,3,C.white);
      rr(-10,-48,20,24,4,F('#f0c9a0'));rr(-11,-64,22,18,3,F(C.ink),2);circ(0,-56,3,C.gold,0);ell(-5,-38,2,3,C.ink,0);ell(3,-38,2,3,C.ink,0);line(-14,-12,-26,-6,4);rr(-34,-10,14,4,1,C.woodD,1.5);break;
    case 'cangrejito':ctx.translate(0,-Math.abs(Math.sin(tt*16))*2);ell(0,0,22,13,F('#c94c32'));for(const s of[-1,1]){line(s*8,-10,s*10,-24,3);circ(s*10,-26,5,C.white);circ(s*10+dir*-1,-26,2,C.ink,0);ell(s*28,-4,9,7,F('#c94c32'));}
      for(let i=0;i<3;i++)for(const s of[-1,1])line(s*(8+i*6),8,s*(14+i*7),18,2.5);break;
    case 'caracol':ctx.scale(-dir,1);ell(-4,6,26,9,F('#9fae63'));circ(6,-10,17,F('#c79a5e'));ctx.beginPath();ctx.arc(6,-10,10,0,5);ctx.stroke();line(-22,0,-28,-18,2.5);line(-18,0,-20,-20,2.5);circ(-28,-20,3.5,C.white,2);circ(-20,-22,3.5,C.white,2);break;
    case 'calabacita':ctx.translate(0,-Math.abs(Math.sin(tt*12))*3);ell(0,0,22,18,F('#d9822b'));line(-8,-16,-8,16,2);line(8,-16,8,16,2);rr(-3,-26,6,10,2,C.moss,2);
      poly([[-12,-6],[-6,-10],[-4,-2]],'#ffe27a',2);poly([[12,-6],[6,-10],[4,-2]],'#ffe27a',2);ctx.beginPath();ctx.moveTo(-10,6);for(let i=0;i<5;i++)ctx.lineTo(-10+i*5,i%2?10:5);ctx.stroke();break;
    case 'sombra':ctx.globalAlpha=.92;ctx.beginPath();ctx.moveTo(-18,18);ctx.quadraticCurveTo(-24,-30,0,-34);ctx.quadraticCurveTo(24,-30,18,18);for(let i=0;i<4;i++)ctx.lineTo(18-i*12,12+(i%2?6:0));ctx.closePath();
      ctx.fillStyle=F(C.shadow);ctx.fill();ctx.stroke();ell(-7,-14,4,6,'#fffbe6',0);ell(7,-14,4,6,'#fffbe6',0);break;
    case 'pajaro':ell(0,0,22,15,F(C.brass));poly([[-22,0],[-34,4],[-22,6]],C.rust);circ(-10,-4,3.5,C.ink,0);poly([[-2,-6],[12,-18-Math.sin(tt*20)*12],[16,-4]],C.brassD);line(0,-15,0,-24);ell(0,-25,12*Math.abs(Math.sin(tt*30)),3,C.ink,0);break;
    case 'avioncito':ell(0,0,24,10,F(C.paper));rr(-10,-14,20,5,2,C.rust,2);rr(-10,8,20,5,2,C.rust,2);poly([[22,0],[32,-8],[30,6]],C.rust);ell(-26,0,3,12*Math.abs(Math.sin(tt*40)),C.ink,0);circ(-4,-4,4,C.glass,2);break;
    case 'gaviota':case 'cuervo':{const col=e.skin==='cuervo'?'#2b2420':C.white;ell(0,0,18,11,F(col));const wf=Math.sin(tt*16)*14;poly([[-4,-4],[8,-20-wf],[14,-2]],F(col));poly([[-4,-4],[-12,-18-wf],[4,-2]],F(col));
      poly([[-18,0],[-28,3],[-18,5]],C.gold);circ(-9,-3,2.5,e.skin==='cuervo'?'#fffbe6':C.ink,0);break;}
    case 'murcielago':{const wf=Math.sin(tt*18);ctx.fillStyle=F('#3b2f55');for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(0,-2);ctx.quadraticCurveTo(s*16,-18-wf*10,s*30,-4-wf*6);ctx.quadraticCurveTo(s*22,0,s*18,6);ctx.quadraticCurveTo(s*12,2,0,6);ctx.closePath();ctx.fill();ctx.stroke();}
      circ(0,0,11,F('#4b3a6b'));poly([[-8,-8],[-4,-18],[-2,-8]],'#4b3a6b',2);poly([[8,-8],[4,-18],[2,-8]],'#4b3a6b',2);circ(-4,-1,2.5,'#ffe27a',0);circ(4,-1,2.5,'#ffe27a',0);break;}
    case 'polilla':{const wf=Math.abs(Math.sin(tt*20));ell(-10,-2,14,10*wf+3,F('#c9b48c'),2.5,-.4);ell(10,-2,14,10*wf+3,F('#c9b48c'),2.5,.4);ell(0,2,5,12,F('#7a6a50'));line(-2,-10,-8,-20,2);line(2,-10,8,-20,2);break;}
    case 'nube':blob(ctx,[[-12,2,14],[4,-6,16],[16,4,12]],F('#b9b8ac'),4);circ(-4,0,3,C.ink,0);circ(6,0,3,C.ink,0);line(-9,-7,-1,-4,2.5);line(11,-7,3,-4,2.5);break;
    case 'llama':{ctx.beginPath();ctx.moveTo(-12,8);ctx.quadraticCurveTo(-14,-14,0,-28+Math.sin(tt*20)*3);ctx.quadraticCurveTo(14,-14,12,8);ctx.arc(0,8,12,0,Math.PI);ctx.closePath();ctx.fillStyle=F('#f08a2e');ctx.fill();ctx.stroke();
      circ(-4,0,2.5,C.ink,0);circ(4,0,2.5,C.ink,0);break;}
    case 'pez':ctx.scale(-dir,1);ell(0,0,20,12,F('#d98b4b'));poly([[16,0],[28,-10],[28,10]],F('#d98b4b'));circ(-10,-3,3,C.ink,0);break;
    case 'conejo':ctx.translate(0,-Math.abs(Math.sin(tt*8))*2);ell(0,4,16,14,F(C.white));circ(-4,-12,11,F(C.white));ell(-8,-30,4,11,F(C.white),2.5,-.2);ell(0,-31,4,11,F(C.white),2.5,.2);circ(-8,-13,2,C.ink,0);circ(-1,-13,2,C.ink,0);circ(-5,-8,2,'#e88',0);break;
    case 'gusano':ctx.scale(-dir,1);for(let i=3;i>=0;i--)circ(i*10,Math.sin(tt*10+i)*3,9,F(i?'#9fae63':'#b9c56f'));rr(-12,-14,14,6,2,C.ink,0);circ(-3,-2,2,C.ink,0);break;
    case 'canon':circ(0,14,10,C.wood);rr(-20,4,40,18,4,C.woodL);{const a=e.aim||Math.PI;ctx.save();ctx.rotate(a);rr(-6,-11,38,22,6,F('#3a3330'));ell(32,0,4,11,C.ink,0);ctx.restore();}circ(0,0,14,F('#4a423d'));circ(-4,-2,2.5,C.paper,0);circ(4,-2,2.5,C.paper,0);break;
    case 'coral':for(const [a,h] of[[-14,30],[0,42],[14,28]]){rr(a-5,-h,10,h+10,5,F('#d9735b'));}circ(0,-44,8,F('#f2a07a'));circ(-2,-46,2,C.ink,0);circ(3,-46,2,C.ink,0);break;
    case 'setita':rr(-7,-8,14,26,4,F(C.paper));ell(0,-12,24,14,F(C.rust));circ(-8,-16,4,C.paper,0);circ(8,-12,3,C.paper,0);circ(-3,4,2,C.ink,0);circ(3,4,2,C.ink,0);break;
    case 'farol':line(0,20,0,-10,4);rr(-14,-40,28,32,4,F('#3a3330'));rr(-9,-35,18,22,3,F('#ffd36a'),2);poly([[-16,-40],[0,-52],[16,-40]],'#3a3330');circ(-3,-25,2,C.ink,0);circ(3,-25,2,C.ink,0);break;
    case 'velita':rr(-9,-30,18,44,3,F(C.white));ctx.beginPath();ctx.moveTo(-5,-30);ctx.quadraticCurveTo(0,-48+Math.sin(tt*16)*3,5,-30);ctx.fillStyle='#ffb35a';ctx.fill();ctx.stroke();circ(-3,-14,2,C.ink,0);circ(3,-14,2,C.ink,0);break;
    case 'caja':rr(-22,-6,44,30,3,F(C.rust));line(-22,4,22,4,2);{const k=e.pop||0;if(k>.1){ctx.save();ctx.translate(0,-6);line(0,0,0,-40*k,3);for(let i=1;i<5;i++)line(-6,-i*8*k,6,-i*8*k-4,2);ell(0,-48*k,14,13,F(C.white));circ(-5,-50*k,2.5,C.ink,0);circ(5,-50*k,2.5,C.ink,0);
      poly([[-14,-58*k],[0,-74*k],[14,-58*k]],C.rust);ctx.restore();}}break;
    case 'pulpito':ell(0,-10,18,18,F('#b9709b'));for(let i=0;i<4;i++)line(-12+i*8,4,-14+i*8+Math.sin(tt*8+i)*4,22,4);circ(-6,-12,3,C.white,2);circ(6,-12,3,C.white,2);break;
    case 'topo':ell(0,0,20,18,F('#6b4a3a'));ell(-12,-2,7,5,'#e8a4a0',2);circ(-4,-8,2,C.ink,0);circ(4,-8,2,C.ink,0);ctx.fillStyle=C.white;ctx.fillRect(-14,2,4,5);break;
    case 'fantasmita':ctx.globalAlpha=.85;ctx.beginPath();ctx.moveTo(-16,14);ctx.quadraticCurveTo(-20,-24,0,-26);ctx.quadraticCurveTo(20,-24,16,14);for(let i=0;i<4;i++)ctx.lineTo(16-i*11,10+(i%2?6:0));ctx.closePath();ctx.fillStyle=F('#eef4f2');ctx.fill();ctx.stroke();
      ell(-6,-8,3,5,C.ink,0);ell(6,-8,3,5,C.ink,0);ell(0,2,4,5,C.ink,0);break;
    default:circ(0,0,e.r,F(C.steel));
  }
  if(clipPop)ctx.restore();
  ctx.restore();}

/* ---------- NPCs on the map ---------- */
function drawNPC(id,x,y,t){ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;shadowE(0,0,18);const b=Math.sin(t*3)*2;
  if(id==='cabo'){rr(-9,-14,7,14,2,C.ink,0);rr(2,-14,7,14,2,C.ink,0);rr(-12,-40+b,24,28,4,C.rust);line(-12,-32+b,12,-22+b,3,C.white);circ(-6,-28+b,2,C.gold,0);rr(-10,-62+b,20,22,4,'#f0c9a0');rr(-11,-80+b,22,20,3,C.ink,2);circ(0,-72+b,3,C.gold,0);
    ell(-4,-52+b,2,3,C.ink,0);ell(4,-52+b,2,3,C.ink,0);ctx.fillStyle=C.white;ctx.fillRect(-7,-46+b,14,4);line(12,-34+b,22,-48+b,4);glove(22,-50+b,5);}
  else if(id==='rocola'){rr(-26,-78,52,78,22,C.woodL);rr(-18,-66,36,30,14,'#ffd36a');for(let i=0;i<4;i++)circ(-12+i*8,-20,3,['#e05','#2ec4b6','#ffe27a','#9fe'][i],1.5);
    face(0,-52,.45,{mouth:'smile',my:30,mw:24,ang:.05});for(let i=0;i<3;i++){const k=(t*.8+i/3)%1;ctx.globalAlpha=1-k;txt('♪',22+k*20,-80-k*40,16,C.brass,C.ink);ctx.globalAlpha=1;}}
  else if(id==='patita'){ell(0,-14+b,22,16,'#ffd84a');circ(-14,-34+b,12,'#ffd84a');poly([[-26,-34+b],[-36,-30+b],[-26,-27+b]],'#f08a2e',2.5);circ(-17,-37+b,2.2,C.ink,0);ell(8,-18+b,8,5,'#f2c13a',2,-.4);}
  else if(id==='farol'){line(0,0,0,-70,6);rr(-14,-104,28,34,4,'#3a3330');rr(-9,-99,18,24,3,'#ffd36a',2);poly([[-17,-104],[0,-118],[17,-104]],'#3a3330');
    circ(0,-87,30,`rgba(255,220,120,${.12+Math.sin(t*4)*.04})`,0);ell(-4,-88,2,3,C.ink,0);ell(4,-88,2,3,C.ink,0);ctx.beginPath();ctx.arc(0,-82,4,0,Math.PI);ctx.stroke();ell(-10,-60,10,3,null,0);}
  else if(id==='gato'){ctx.translate(0,b*.5);ell(0,-10,16,12,'#2b2420');circ(-12,-24,11,'#2b2420');poly([[-20,-32],[-18,-44],[-12,-34]],'#2b2420');poly([[-8,-34],[-4,-44],[-2,-30]],'#2b2420');
    ell(-16,-25,2.5,3.5,'#ffe27a',0);ell(-9,-25,2.5,3.5,'#ffe27a',0);ctx.beginPath();ctx.moveTo(14,-12);ctx.quadraticCurveTo(30,-20+Math.sin(t*4)*6,24,-36);ctx.lineWidth=5;ctx.stroke();}
  else if(id==='remo'){ctx.translate(0,8+Math.sin(t*2)*2);poly([[-46,-10],[46,-10],[34,10],[-34,10]],C.woodL);rr(-10,-46,20,36,4,C.white);rr(-14,-56,28,10,3,C.ink,0);rr(-8,-64,16,10,3,C.ink,0);
    face(0,-34,.32,{mouth:'smile',my:26,mw:24,ang:.05});line(-6,-56,-6,-80,3);ctx.beginPath();for(let i=0;i<3;i++){const k=(t*.7+i/3)%1;ctx.globalAlpha=1-k;circ(-6+k*10,-86-k*30,5+k*6,C.paper,2);ctx.globalAlpha=1;}}
  ctx.restore();}
