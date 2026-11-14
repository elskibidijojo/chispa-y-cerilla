'use strict';
/* ================= EL RASCACIELOS EN OBRA: a special climbing level =================
   The steel girders keep sliding down. Keep jumping up or you fall off the bottom (you lose a heart and get
   tossed back onto a girder). Three different bosses guard the top floors:
   1) Capataz Tuerca on his hanging beam, 2) Doña Grúa the crane, 3) the skyscraper itself wakes up. */

const CL_LANES=[175,480,785],CL_GAP=118,CL_V=[40,50,62];

/* ---------- sprites ---------- */
const SPRR={
  remache(e,t,P,r){const hot=e.stuck?(Math.floor(e.t*(e.t>e.stick+.9?14:6))%2?'#ffd27a':'#e8562e'):'#e8562e';ctx.rotate(e.stuck?0:t*9);rr(-r*.45,-r*.2,r*.9,r*1.3,r*.2,P('#8a8a94'),2.5);ell(0,-r*.25,r,r*.55,P(hot),3);ell(-r*.3,-r*.4,r*.3,r*.15,'rgba(255,255,255,.6)',0);
    if(!e.stuck&&!e.parry){ctx.globalAlpha=.5;circ(r*.2,r*1.2,r*.35,'#ffb84a',0);ctx.globalAlpha=1;}},
  chispaR(e,t,P,r){star(0,0,r,r*.45,4,t*8);ctx.fillStyle=P('#ffd27a');ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();},
  paloma(e,t,P,r){const f=(e.fx||1)<0?-1:1,fl=Math.sin(e.t*22);ctx.scale(f,1);ell(0,0,r*1.1,r*.75,P('#9aa0b4'),3);ell(r*.85,-r*.45,r*.5,r*.45,P('#9aa0b4'),3);
    poly([[r*1.25,-r*.45],[r*1.7,-r*.3],[r*1.25,-r*.2]],'#e8b84a',2);circ(r*.95,-r*.55,r*.12,C.ink,0);ell(-r*.1,-r*.1,r*.7,r*.25*(1+fl),'#7d8398',2.5,fl*.4);
    ctx.beginPath();ctx.arc(r*.85,-r*.75,r*.42,Math.PI,0);ctx.closePath();ctx.fillStyle='#f2c14e';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();rr(r*.3,-r*.78,r*1.1,r*.12,2,'#f2c14e',2);
    if(e.dive){ctx.scale(1/f,1);txt('!',0,-r*1.6,r*1.1,C.rust,C.ink);}},
  llave(e,t,P,r){ctx.rotate(e.rot||t*12);rr(-r*1.2,-r*.22,r*2.1,r*.44,r*.2,P('#b9bec9'),2.5);ctx.beginPath();ctx.arc(r*1.05,0,r*.55,0,TAU);ctx.fillStyle=P('#b9bec9');ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
    rr(r*1.05,-r*.18,r*.7,r*.36,1,'#2b2420',0);circ(-r*1.15,0,r*.32,P('#b9bec9'),2.5);circ(-r*1.15,0,r*.12,'#2b2420',0);},
  ladrillo(e,t,P,r){ctx.rotate(Math.sin(e.t*4+e.x)*.3);rr(-r*1.2,-r*.6,r*2.4,r*1.2,3,P('#b5523a'),3);ctx.strokeStyle='rgba(20,13,8,.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-r*1.2,0);ctx.lineTo(r*1.2,0);ctx.moveTo(0,-r*.6);ctx.lineTo(0,0);ctx.moveTo(-r*.6,0);ctx.lineTo(-r*.6,r*.6);ctx.moveTo(r*.6,0);ctx.lineTo(r*.6,r*.6);ctx.stroke();},
  tuerca(e,t,P,r){ctx.rotate(t*5+e.x*.01);const pts=[];for(let i=0;i<6;i++){const a=i*TAU/6;pts.push([Math.cos(a)*r,Math.sin(a)*r]);}poly(pts,P('#a8adb8'),3);circ(0,0,r*.45,'#3a3440',2.5);},
  viga(e,t,P){const w=e.w,h=e.h;rr(-w/2,-h/2,w,h*.28,2,P('#c0563a'),3);rr(-w/2,h/2-h*.28,w,h*.28,2,P('#c0563a'),3);rr(-w*.06,-h/2,w*.12,h,1,P('#a8452e'),2.5);
    for(let x=-w/2+14;x<w/2;x+=26){circ(x,-h/2+h*.14,2.5,'#3a2018',0);circ(x,h/2-h*.14,2.5,'#3a2018',0);}},
  bola(e,t,P,r){const B=e.boss;if(B){ctx.save();ctx.translate(-e.x,-e.y);ctx.lineWidth=4;ctx.strokeStyle='#3a3440';ctx.setLineDash([9,5]);ctx.beginPath();ctx.moveTo(e.px,e.py);ctx.lineTo(e.x,e.y-r*.9);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    circ(0,0,r,P('#3a3440'),4.5);ell(-r*.35,-r*.35,r*.3,r*.2,'rgba(255,255,255,.35)',0,-.6);rr(-r*.25,-r*1.08,r*.5,r*.3,3,'#5a5a66',3);
    if(e.t<e.warn){ctx.globalAlpha=.5+.4*Math.sin(e.t*30);txt('¡CUIDADO!',0,-r*1.6,18,C.rust,C.ink);ctx.globalAlpha=1;}},
  foco(e,t,P){const on=e.t>e.warn,k=on?Math.min(1,(e.t-e.warn)/.08):0,h=e.h;ctx.translate(-e.x,0);
    if(!on){const bl=Math.floor(e.t*12)%2;ctx.setLineDash([10,10]);ctx.lineWidth=3;ctx.strokeStyle=bl?'rgba(255,226,122,.9)':'rgba(239,224,191,.45)';ctx.beginPath();ctx.moveTo(0,-h/2);ctx.lineTo(W,-h/2);ctx.moveTo(0,h/2);ctx.lineTo(W,h/2);ctx.stroke();ctx.setLineDash([]);}
    else{const g=ctx.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,'rgba(255,240,170,0)');g.addColorStop(.5,'rgba(255,248,210,.95)');g.addColorStop(1,'rgba(255,240,170,0)');ctx.globalAlpha=k*(e.t>e.warn+e.act?Math.max(0,1-(e.t-e.warn-e.act)*4):1);
      ctx.fillStyle=g;ctx.fillRect(0,-h/2*1.5,W,h*1.5);ctx.globalAlpha=1;}},
  rosca(e,t,P,r){ctx.rotate(t*7);for(let i=0;i<3;i++){const a=i*TAU/3;circ(Math.cos(a)*r*.55,Math.sin(a)*r*.55,r*.45,P('#e8b84a'),2);}circ(0,0,r*.35,'#7a5a1a',2);}};
const _drawSprR=drawSpr;
drawSpr=function(e,t){const f=SPRR[e.spr];if(!f){_drawSprR(e,t);return;}const pc=e.parry&&!(e.cool>0),r=e.r||12,P=c=>pc?C.parry:c;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;f(e,t,P,r);ctx.restore();};
/* the falling beam and the searchlight hit as rectangles */
const _ebHitR=ebHit;
ebHit=function(L,e,pb){if(e.k==='viga')return rectHit(pb,{x:e.x-e.w/2+4,y:e.y-e.h/2+4,w:e.w-8,h:e.h-8});
  if(e.k==='foco')return e.t>e.warn+.05&&e.t<e.warn+e.act&&rectHit(pb,{x:-50,y:e.y-e.h/2+6,w:W+100,h:e.h-12});return _ebHitR(L,e,pb);};

/* ---------- the girders that keep sliding down ---------- */
function clRow(L,y){const C=L.climb,prev=C.last??1;let a=prev;const r=rand();if(r<.35)a=prev-1;else if(r<.7)a=prev+1;a=clamp(a,0,2);const lanes=[a];
  if(rand()<.5){const o=[0,1,2].filter(k=>k!==a&&Math.abs(k-a)<=2);lanes.push(o[Math.floor(rand()*o.length)]);}C.last=a;
  for(const k of lanes){const w=150+Math.floor(rand()*70),x=clamp(CL_LANES[k]-w/2+(rand()-.5)*70,36,W-36-w);L.solids.push({x,y,w,h:14,oneWay:true,mv:true,dx:0,gird:true,rv:rand()<.2});}C.top=y;}
function clSetup(L){L.climb={v:CL_V[0],h:0,top:GROUND,last:1,shk:0};L.floorAt=()=>Infinity;
  for(const s of L.solids){s.mv=true;s.dx=0;}for(let y=GROUND-CL_GAP;y>-CL_GAP*1.5;y-=CL_GAP)clRow(L,y);
  chainUpd(L,dt=>{const C=L.climb;if(L.state==='intro')return;const B=L.boss,want=CL_V[Math.min(2,B?B.phase:0)]*(B&&B.dead?0:1)*(B&&B.desp?1.18:1);C.v=lerp(C.v,want,Math.min(1,dt*.8));
    const d=C.v*dt;for(const s of L.solids)if(s.mv){s.py=s.y;s.y+=d;}C.top+=d;C.h+=d;
    for(const e of L.eb)if(e.stuckTo){e.y=e.stuckTo.y-e.r*.5;}
    L.solids=L.solids.filter(s=>!s.mv||s.y<H+150);while(C.top>-CL_GAP*.5)clRow(L,C.top-CL_GAP);});}
const _pitCL=pitFall;
pitFall=function(L,p){if(!L.climb)return _pitCL(L,p);p.hp--;L.hits++;shake(L,10);sfx('hurt');
  let best=null,bd=1e9;for(const s of L.solids)if(s.gird&&s.y>200&&s.y<390){const d=Math.abs(s.x+s.w/2-480)*.6+Math.abs(s.y-300);if(d<bd){bd=d;best=s;}}
  const x=best?best.x+best.w/2:480,y=best?best.y:300;
  if(p.hp<=0){p.x=x;p.y=y;kill(L,p);if(p.ghost){p.ghost.x=x;p.ghost.y=y-80;}return;}
  p.x=x;p.y=y;p.vy=-300;p.inv=2;p.ground=false;p.groundRef=null;stars(L,x,y-40);puff(L,x,y,8);pop(L,x,y-110,'¡AGÁRRATE FUERTE!',C.rust);};

/* ---------- the scrolling background: sky by phase, the city far below, the steel frame of the tower ---------- */
let CLBG=null;
function clPaint(){const S=[['#f6c66d','#e88a4a','#b5523a'],['#c88aa8','#6d4a7a','#2e2348'],['#1b1838','#252049','#0d0b1c']].map(([a,b,c])=>{const [cv2,g]=mk(W,H);const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,a);gr.addColorStop(.6,b);gr.addColorStop(1,c);g.fillStyle=gr;g.fillRect(0,0,W,H);return cv2;});
  const [city,cg]=mk(W,260);const r=srand(31);cg.fillStyle='#3a2a2e';for(let x=0;x<W;){const w=30+r()*60,h=60+r()*170;cg.fillRect(x,260-h,w,h);for(let yy=260-h+10;yy<250;yy+=16)for(let xx=x+6;xx<x+w-8;xx+=12)if(r()<.45){cg.fillStyle='#ffd987';cg.fillRect(xx,yy,5,7);cg.fillStyle='#3a2a2e';}x+=w+4;}
  /* the tower's frame: two tall columns with cross braces, two floors per tile */
  const [fr,fg]=mk(W,CL_GAP*2);for(const x of[0,W-56]){gR(fg,x,-4,56,CL_GAP*2+8,'#7a3a2e',4,0);for(let y=6;y<CL_GAP*2;y+=18){fg.fillStyle='#4a2018';fg.beginPath();fg.arc(x+12,y,3,0,TAU);fg.arc(x+44,y,3,0,TAU);fg.fill();}}
  for(let i=0;i<2;i++){const y=i*CL_GAP+CL_GAP*.5;fg.globalAlpha=.55;gR(fg,56,y,W-112,12,'#5a2a22',3,0);fg.globalAlpha=.35;fg.strokeStyle='#5a2a22';fg.lineWidth=6;fg.beginPath();for(let x=56;x<W-56;x+=212){fg.moveTo(x,y+12);fg.lineTo(x+106,y+CL_GAP);fg.lineTo(x+212,y+12);}fg.stroke();fg.globalAlpha=1;}
  CLBG={S,city,fr};}
function clDrawBG(L){if(!CLBG)clPaint();const C=L.climb,B=L.boss,ph=B?B.phase:0;C.sk=lerp(C.sk??0,ph,.02);const i0=Math.floor(C.sk),k=C.sk-i0;
  ctx.drawImage(CLBG.S[i0],0,0,W,H);if(k>.001&&i0<2){ctx.globalAlpha=k;ctx.drawImage(CLBG.S[i0+1],0,0,W,H);ctx.globalAlpha=1;}
  if(C.sk>.6){const t=L.t;ctx.globalAlpha=Math.min(1,(C.sk-.6))*.9;for(let i=0;i<40;i++){const x=(i*197)%W,y=((i*71)%300+C.h*.05)%320;circ(x,y,1+(i%3)*.6+.5*Math.sin(t*3+i),'#fff6d8',0);}ctx.globalAlpha=1;}
  if(C.sk>1.4){ctx.globalAlpha=Math.min(1,C.sk-1.4);circ(160,90,38,'#f3ead2',3);circ(148,82,8,'rgba(0,0,0,.12)',0);circ(172,104,6,'rgba(0,0,0,.12)',0);ctx.globalAlpha=1;}
  const cy=GROUND-120+C.h*.35;if(cy<H)ctx.drawImage(CLBG.city,0,cy,W,260);
  for(let i=0;i<5;i++){const y=((i*150+C.h*.6)%(H+200))-100,x=((i*233)%W);ctx.globalAlpha=.55;ell(x,y,90,22,'#efe0bf',0);ell(x+50,y-12,60,20,'#efe0bf',0);ctx.globalAlpha=1;}
  const o=C.h%(CL_GAP*2);for(let y=o-CL_GAP*2;y<H;y+=CL_GAP*2)ctx.drawImage(CLBG.fr,0,y,W,CL_GAP*2);}
function clDrawGirders(L){for(const s of L.solids){if(!s.mv||s.y>H+20)continue;if(s.gird){const w=s.w,x=s.x,y=s.y;rr(x,y,w,6,2,'#c0563a',3);rr(x,y+12,w,6,2,'#c0563a',3);rr(x+4,y+5,w-8,8,1,'#8a3a26',2);
      for(let xx=x+10;xx<x+w-6;xx+=20){circ(xx,y+3,2,'#3a2018',0);}if(s.rv){ctx.save();ctx.globalAlpha=.8;line(x+w*.3,0,x+w*.3,y,2,'#3a3440');line(x+w*.7,0,x+w*.7,y,2,'#3a3440');ctx.restore();}}
    else if(s.ground){rr(-10,s.y,W+20,22,0,'#8a6a4a',4);ctx.fillStyle='#6b4a32';ctx.fillRect(-10,s.y+22,W+20,200);for(let x=0;x<W;x+=80)line(x,s.y+4,x+40,s.y+20,3,'#5a3a24');}}}
function clDrawFG(L){const C=L.climb,m=Math.floor(C.h/9);card(W-150,H-44,138,34,'rgba(43,29,20,.85)',2.5,8);btxt('ALTURA '+m+' m',W-81,H-27,15,C.gold?C.gold:'#f2c14e','center',900);}

/* ---------- attacks ---------- */
ATK.remacheBomba=function(L,B,a){const o=anc(B,'gun'),n=a.n||2;for(let i=0;i<n;i++){const p=tgt(L,B),tx=clamp(p.x+(i-(n-1)/2)*140,60,W-60),T=.9+i*.15,vx=(tx-o.x)/T;B.pc++;
    spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:0,vy:0,r:13,spr:'remache',parry:!!a.parry&&B.pc%a.parry===0,gvx:vx,gvy:-520,stick:0,
      upd(e,L,dt){if(e.stuck){if(e.t>e.stick+1.3){e.dead=true;boom(L,e.x,e.y,30);sfx('pop');for(let k=0;k<6;k++){const an=-Math.PI/2+(k-2.5)*.42;spawnEB(L,{k:'shot',x:e.x,y:e.y-6,vx:Math.cos(an)*240,vy:Math.sin(an)*240,r:8,spr:'chispaR',life:1.4});}}return;}
        e.gvy+=1300*dt;const py=e.y;e.x+=e.gvx*dt;e.y+=e.gvy*dt;if(e.gvy>0)for(const s of L.solids)if(s.gird&&e.x>s.x&&e.x<s.x+s.w&&py<=s.y&&e.y>=s.y-2){e.stuck=true;e.stuckTo=s;e.stick=e.t;e.y=s.y-e.r*.5;sfx('knock');puff(L,e.x,s.y,3);break;}}});}
  B.throwT=.35;B.recoil=.3;sfx('throw');};
ATK.palomas=function(L,B,a){const n=a.n||2,from=rand()<.5?-1:1;for(let i=0;i<n;i++){const y=90+i*90+rand()*40;
    spawnEB(L,{k:'shot',x:from<0?-40-i*60:W+40+i*60,y,vx:0,vy:0,r:15,spr:'paloma',life:7,dir:-from,
      upd(e,L,dt){e.vx=0;e.vy=0;if(!e.dive){e.x+=e.dir*170*dt;e.y+=Math.sin(e.t*3)*30*dt;e.fx=e.dir;const p=nearestP(L,e.x,e.y);if(p&&e.t>.8&&Math.abs(p.x-e.x)<140&&p.y>e.y){e.dive=true;e.dw=.35;sfx('warn');}}
        else if(e.dw>0){e.dw-=dt;if(e.dw<=0){const p=nearestP(L,e.x,e.y)||{x:e.x,y:H},an=Math.atan2(p.y-40-e.y,p.x-e.x);e.dvx=Math.cos(an)*520;e.dvy=Math.sin(an)*520;}}
        else{e.x+=e.dvx*dt;e.y+=e.dvy*dt;e.fx=e.dvx;}}});}sfx('pop');};
ATK.bolaDemolicion=function(L,B,a){if(L.eb.some(e=>e.spr==='bola'))return;const px=B.hx??480,py=58,len=300;
  spawnEB(L,{k:'shot',x:px,y:py,vx:0,vy:0,r:46,spr:'bola',boss:B,px,py,warn:.9,life:a.dur||5,dir:rand()<.5?-1:1,
    upd(e,L,dt){e.px=B.hx??e.px;if(e.t<e.warn){const k=e.t/e.warn;e.x=e.px;e.y=e.py+len*k;return;}const k=e.t-e.warn,amp=Math.min(1.05,k*.9);const an=Math.sin(k*1.9)*amp*e.dir;e.x=e.px+Math.sin(an)*len;e.y=e.py+Math.cos(an)*len;
}});sfx('warn');B.hookDown=1;};
ATK.vigaCae=function(L,B,a){const n=a.n||2;for(let i=0;i<n;i++)B.queue.push({t:i*(a.gap??.55),fn:()=>{const p=tgt(L,B),x=clamp(p.x+(i%2?110:-30),90,W-90);
    spawnEB(L,{k:'column',x,warn:.7,act:.01,w:150,style:'none',full:true,ghost:true});
    B.queue.push({t:.7,fn:()=>{spawnEB(L,{k:'viga',x,y:-30,w:160,h:34,vx:0,vy:0,spr:'viga',upd(e,L,dt){e.vy=Math.min(900,(e.vy||200)+1800*dt);e.y+=e.vy*dt;if(e.y>H+60)e.dead=true;}});sfx('dash');}});}});};
ATK.foco=function(L,B,a){const p=tgt(L,B),y=clamp(p.y-34,70,H-40);spawnEB(L,{k:'foco',x:0,y,h:a.h||64,warn:a.warn||.9,act:a.act||.55,spr:'foco',upd(e,L,dt){if(e.t>e.warn+e.act+.3)e.dead=true;if(!e.snd&&e.t>e.warn){e.snd=1;sfx('zap');shake(L,6);}}});sfx('warn');B.eyeT=a.warn||.9;};
ATK.ventanas=function(L,B,a){const n=a.n||3;for(let i=0;i<n;i++)B.queue.push({t:i*.28,fn:()=>{const x=120+rand()*(W-240),y=40+rand()*90,p=aimPt(tgt(L,B)),an=Math.atan2(p.y-y,p.x-x);B.pc++;
    spawnEB(L,{k:'shot',x,y,vx:Math.cos(an)*320,vy:Math.sin(an)*320,r:11,spr:'rosca',parry:!!a.parry&&B.pc%a.parry===0});puff(L,x,y,3,'#ffe27a');sfx('pop');}});};
/* the column painter skips the decorative warning of the falling beam: only the dashed line */
const _drawColR=drawColumn;drawColumn=function(e,L){if(e.style!=='none')return _drawColR(e,L);if(e.t<e.warn){const bl=Math.floor(e.t*12)%2;ctx.save();ctx.setLineDash([8,8]);ctx.lineWidth=3;ctx.strokeStyle=bl?'rgba(181,64,47,.9)':'rgba(239,224,191,.6)';
  ctx.strokeRect(e.x-e.w/2,4,e.w,H-8);ctx.setLineDash([]);ctx.globalAlpha=.25;ctx.fillStyle=C.rust;ctx.fillRect(e.x-e.w/2,4,e.w,H-8);ctx.restore();}};
const _ebHitR2=ebHit;ebHit=function(L,e,pb){if(e.k==='column'&&e.style==='none')return false;return _ebHitR2(L,e,pb);};

/* ---------- the three bosses ---------- */
function drawCapataz(B,L,x,y,a){ctx.save();ctx.globalAlpha=a;ctx.lineJoin='round';ctx.lineCap='round';const t=B.t,sw=Math.sin(t*1.3)*.05;
  line(x-100,0,x-100+Math.sin(t*1.3)*6,y,3,'#3a3440');line(x+100,0,x+100+Math.sin(t*1.3)*6,y,3,'#3a3440');
  ctx.save();ctx.translate(x,y);ctx.rotate(sw);rr(-125,0,250,14,2,'#c0563a',3.5);rr(-125,22,250,10,2,'#c0563a',3);rr(-120,10,240,14,1,'#8a3a26',2.5);for(let xx=-112;xx<120;xx+=24)circ(xx,6,2.2,'#3a2018',0);
  const bob=Math.abs(Math.sin(t*4))*3,rc=(B.recoil||0)*12;for(const s of[-1,1]){hose(s*22,-30,s*26,-14,s*30,-2,9);ell(s*34,-2,16,7,'#2b2420',2.5);}
  const hy=-82-bob,pts=[];for(let i=0;i<6;i++){const an=i*TAU/6+Math.PI/6;pts.push([Math.cos(an)*58,hy+Math.sin(an)*54]);}
  poly(pts,'#a8adb8',4.5);poly(pts.map(([px,py])=>[px*.82,hy+(py-hy)*.82]),null,2);ctx.strokeStyle='rgba(20,13,8,.25)';
  /* face */bossFace(B,L,0,hy+4,.62,{gap:30,ew:12,eh:15,my:28,mw:30,open:B.mouth>0?1:.3});
  ctx.beginPath();ctx.moveTo(-38,hy+20);ctx.quadraticCurveTo(-18,hy+10,0,hy+22);ctx.quadraticCurveTo(18,hy+10,38,hy+20);ctx.quadraticCurveTo(20,hy+34,0,hy+26);ctx.quadraticCurveTo(-20,hy+34,-38,hy+20);ctx.fillStyle='#4a3428';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
  /* hard hat */ctx.beginPath();ctx.arc(0,hy-34,48,Math.PI,0);ctx.closePath();ctx.fillStyle='#f2c14e';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();rr(-62,hy-38,124,12,5,'#f2c14e',3.5);rr(-6,hy-80,12,42,5,'#e0a83a',2.5);
  /* rivet gun */const gx=-74+rc,gy=hy+44;hose(-40,hy+30,-58,hy+50,gx+14,gy,9);rr(gx-44,gy-14,58,26,7,'#5a5a66',3.5);rr(gx-62,gy-7,22,12,3,'#3a3440',3);rr(gx-6,gy+6,14,26,4,'#7a3a2e',3);glove(gx+10,gy+4,12);
  if(B.throwT>0){ctx.globalAlpha=a*Math.min(1,B.throwT*4);star(gx-70,gy,16,7,6,t*20);ctx.fillStyle='#ffd27a';ctx.fill();ctx.globalAlpha=a;}
  hose(40,hy+30,62,hy+40,70,hy+10+Math.sin(t*3)*6,9);glove(70,hy+8+Math.sin(t*3)*6,12);ctx.restore();ctx.restore();}
function drawGrua(B,L,a){ctx.save();ctx.globalAlpha=a;ctx.lineJoin='round';const t=B.t,cx=B.x,cy=B.y,hx=B.hx??480;
  /* tower and jib */rr(cx-22,cy+60,44,H,0,'#e0a83a',3.5);for(let y=cy+70;y<H;y+=36){line(cx-22,y,cx+22,y+36,3,'#a8772a');line(cx+22,y,cx-22,y+36,3,'#a8772a');}
  rr(60,40,cx-60,22,3,'#e0a83a',3.5);for(let x=64;x<cx-20;x+=34){line(x,62,x+17,40,3,'#a8772a');line(x+17,40,x+34,62,3,'#a8772a');}rr(cx,34,110,26,3,'#e0a83a',3.5);rr(cx+70,26,50,40,4,'#5a5a66',3);
  /* trolley and hook */rr(hx-20,60,40,14,3,'#5a5a66',3);const hk=B.hookDown?0:90+Math.sin(t*2)*8;if(!B.hookDown){line(hx,74,hx,74+hk,2.5,'#3a3440');ctx.beginPath();ctx.arc(hx,74+hk+12,12,-Math.PI*.1,Math.PI*1.1);ctx.lineWidth=5;ctx.strokeStyle='#3a3440';ctx.stroke();}
  /* the cab: a face */const b=Math.sin(t*2.4)*2;rr(cx-70,cy-20+b,130,110,14,'#e0a83a',4.5);rr(cx-58,cy-8+b,106,56,10,'#2b2a33',3);
  const look=lookAt(L,cx,cy+10);for(const s of[-1,1]){const ex=cx-5+s*26,ey=cy+20+b;ell(ex,ey,18,20,'#bfe6ef',2.5);circ(ex+look.x*6,ey+look.y*6,7,C.ink,0);
    ctx.beginPath();ctx.moveTo(ex-18,ey-20);ctx.lineTo(ex-22,ey-28);ctx.moveTo(ex,ey-21);ctx.lineTo(ex,ey-30);ctx.moveTo(ex+18,ey-20);ctx.lineTo(ex+22,ey-28);ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}
  const op=B.mouth>0?1:.25;ell(cx-5,cy+70+b,26,8+op*10,'#b5402f',3);rr(cx-26,cy+62+b,42,5,2,'#f3ead2',0);
  for(const s of[-1,1])circ(cx-5+s*48,cy+60+b,8,'rgba(232,120,120,.5)',0);rr(cx-72,cy-30+b,134,14,6,'#7a3a8a',3);for(let i=0;i<4;i++)circ(cx-50+i*30,cy-30+b,7,'#d86aa6',2);
  ctx.restore();}
function drawTorre(B,L,a){ctx.save();ctx.globalAlpha=a;ctx.lineJoin='round';const t=B.t,x=B.x,y=B.y,bob=Math.sin(t*1.5)*4;
  /* the antenna */line(x,y-150+bob,x,y-210+bob,5,'#3a3440');circ(x,y-214+bob,8,Math.floor(t*3)%2?'#ff5a4a':'#7a2018',3);
  /* the top floors, as a face */rr(x-300,y-150+bob,600,200,10,'#b9a48a',5);for(let r2=0;r2<4;r2++)for(let c=0;c<12;c++){const wx=x-282+c*48,wy=y-136+bob+r2*44;if(r2>=1&&r2<=2&&(c>=2&&c<=4||c>=7&&c<=9))continue;if(r2===3&&c>=5&&c<=6)continue;
    rr(wx,wy,32,28,3,(c*7+r2*3)%5===0?'#ffd987':'#4a5a6a',2.5);}
  const look=lookAt(L,x,y-70);for(const s of[-1,1]){const ex=x+s*120,ey=y-70+bob,lid=B.eyeT>0?.35:.1+.08*Math.sin(t*2);rr(ex-78,ey-46,156,96,8,'#efe6cf',4);circ(ex+look.x*26,ey+6+look.y*16,26,'#2b2a33',0);circ(ex+look.x*26-8,ey-2+look.y*16,7,'#fff',0);
    rr(ex-78,ey-46,156,96*lid+8,6,'#c0563a',3.5);for(let k=0;k<6;k++)line(ex-74,ey-40+k*(96*lid)/6,ex+74,ey-40+k*(96*lid)/6,1.5,'rgba(20,13,8,.4)');}
  const op=B.mouth>0?1:.2;rr(x-40,y+bob,80,26+op*24,6,'#2b1d14',4);for(let k=0;k<4;k++)rr(x-36+k*19,y+bob,16,9,2,'#efe6cf',2);
  /* crane arms */for(const s of[-1,1]){const ax=x+s*300,sw=Math.sin(t*1.2+s)*14;rr(ax+(s<0?-30:0),y-120+bob,30,24,3,'#e0a83a',3);line(ax,y-110+bob,ax+s*150,y-40+sw+bob,10,'#e0a83a');line(ax,y-110+bob,ax+s*150,y-40+sw+bob,3,'#a8772a');glove(ax+s*156,y-36+sw+bob,15);}
  ctx.restore();}
defBoss({id:'rascacielos',name:'El Rascacielos en Obra',sub:'Jefe especial · ¡Sube o te caes!',isl:2,hp:980,par:180,arena:'cielo',song:'rascacielos',x:740,y:205,intro:'¡ESTA OBRA NO LA TERMINA NADIE!',noEntrance:true,noAmb:true,
  center(B){const f=B.phase|0;if(f===0)return{x:B.x,y:B.y-80};if(f===1)return{x:B.x-5,y:B.y+40};return{x:B.x,y:B.y-60};},
  anchor(B,n){const f=B.phase|0;if(f===0){if(n==='gun')return{x:B.x-140,y:B.y-38};return{x:B.x,y:B.y-80};}if(f===1){if(n==='hook')return{x:B.hx??480,y:170};return{x:B.x-5,y:B.y+70};}
    if(n==='mouth')return{x:B.x,y:B.y+20};return{x:B.x+(B.t%2<1?-120:120),y:B.y-64};},
  shapes(B){const f=B.phase|0;if(f===0)return[{x:B.x,y:B.y-82,r:62}];if(f===1)return[{x:B.x-75,y:B.y-25,w:140,h:120}];return[{x:B.x-300,y:B.y-150,w:600,h:205}];},
  setup(B){B.hx=480;},
  move(B,dt,L){const f=B.phase|0;if(B.tr)B.tr.t+=dt;B.recoil=Math.max(0,(B.recoil||0)-dt);B.eyeT=Math.max(0,(B.eyeT||0)-dt);
    if(f===0){B.x=700+Math.sin(B.t*.55)*110;B.y=205+Math.sin(B.t*1.1)*10;}
    else if(f===1){B.x=lerp(B.x,820,Math.min(1,dt*3));B.y=lerp(B.y,110,Math.min(1,dt*3));const p=nearestP(L,B.hx,300);if(p&&!L.eb.some(e=>e.spr==='bola'))B.hx=lerp(B.hx,clamp(p.x,120,760),Math.min(1,dt*1.4));if(!L.eb.some(e=>e.spr==='bola'))B.hookDown=0;}
    else{B.x=lerp(B.x,480,Math.min(1,dt*2));B.y=lerp(B.y,140,Math.min(1,dt*1.2));}},
  onPhase(B,L,i){B.tr={t:0,from:i-1};B.hookDown=0;for(const e of L.eb)if(e.spr==='bola'||e.spr==='paloma')e.dead=true;shake(L,16);sfx('crumble');
    if(i===1){B.x=1100;B.y=110;B.hx=480;}if(i===2){B.x=480;B.y=-160;}},
  phases:[{atk:[{f:'remacheBomba',every:2.6,n:2,parry:3},{f:'aimed',every:2.1,from:'gun',n:3,spread:.16,spd:380,spr:'remache',r:11,parry:4},{f:'palomas',every:5.5,delay:3,n:2,noAct:true}]},
    {banner:'¡LLEGA DOÑA GRÚA!',atk:[{f:'bolaDemolicion',every:7,delay:1.5,dur:5},{f:'vigaCae',every:3.6,n:2,gap:.6},{f:'boomer',every:2.8,from:'hook',spr:'llave',r:16,T:1,parry:3}]},
    {banner:'¡EL EDIFICIO DESPERTÓ!',atk:[{f:'foco',every:3.4,delay:1.4,warn:.9,act:.55},{f:'rain',every:2.6,n:5,spr:'ladrillo',r:13,spd:[230,320],parry:5},{f:'ventanas',every:3.1,n:3,parry:4},{f:'spiral',every:5.5,from:'mouth',dur:1.6,rate:.12,spd:210,spr:'tuerca',r:12,arms:2}]}],
  draw(B,L){const f=B.phase|0,tr=B.tr;const k=tr?Math.min(1,tr.t/1.2):1;
    if(tr&&k<1){const fy=tr.t*tr.t*600;if(tr.from===0)drawCapataz(B,L,640,205+fy,1-k*.3);else if(tr.from===1){ctx.save();ctx.translate(0,fy);drawGrua(B,L,1-k*.3);ctx.restore();}}
    if(f===0)drawCapataz(B,L,B.x,B.y,1);else if(f===1)drawGrua(B,L,1);else drawTorre(B,L,1);
    const c=B.center();flashOver(B,c.x,c.y,f===2?200:80);koStars(B,L,c.x,c.y-120);}});
/* build the climb when the level is made */
{const c=LEVELS.rascacielos.create;LEVELS.rascacielos.create=(...a)=>{const L=c(...a);if(!L)return L;clSetup(L);const bg=L.drawBG;L.drawBG=()=>{clDrawBG(L);clDrawGirders(L);};const fg=L.drawFG;L.drawFG=()=>{fg&&fg();clDrawFG(L);};return L;};}
Object.assign(SONGS,{rascacielos:nsong('reloj','El Rascacielos',931)});
Object.assign(PACK,{rascacielos:['pd-rascacielos','That Eccentric Rag — Original Memphis Five (1923)','pd']});
Object.assign(TAUNTS,{rascacielos:['¡A trabajar, que el edificio no se sube solo!','¡Cuidado con mi bola, que no frena!','¡Ni un piso más!','¡Me demolieron!']});
if(!ALL_LEVELS.includes('rascacielos'))ALL_LEVELS.push('rascacielos');
MECH_INFO.rascacielos='Las vigas bajan sin parar: salta hacia arriba o te caes (pierdes un corazón)';
ACH.push(['rascacielos','Hasta el Último Piso','Vence al Rascacielos en Obra.',4]);
{const _al=afterLevel;afterLevel=function(L){if(L&&L.id==='rascacielos'&&L.boss&&L.boss.dead)unlockAch('rascacielos');return _al(L);};}
/* on the map of Bahía Brumosa: a half-built tower with a crane */
addNode(2,{id:'rascacielos',x:1640,y:600,kind:'level',ob:40,bld:'obra',em:'llave'});WORLDS[2].roads.push(['faro','rascacielos'],['rascacielos','sign2']);if(typeof MAPBG!=='undefined')MAPBG={k:null};
const _drawBldR=drawBld;
drawBld=function(n,t,night){if(n.bld!=='obra'){_drawBldR(n,t,night);return;}const x=n.x,y=n.y;ctx.save();ctx.lineJoin='round';shadowE(x,y+2,58,.25);
  rr(x-34,y-120,68,120,3,'#c9b48a',3.5);for(let r2=0;r2<4;r2++)for(let c=0;c<3;c++)rr(x-26+c*20,y-110+r2*26,14,16,2,(r2+c)%3?'#4a5a6a':'#ffd987',2);
  for(let k=0;k<3;k++){const yy=y-150-k*24;line(x-34,yy+24,x-34,yy,4,'#c0563a');line(x+34,yy+24,x+34,yy,4,'#c0563a');line(x-34,yy,x+34,yy,4,'#c0563a');line(x-34,yy+24,x+34,yy,2,'#8a3a26');}
  line(x+40,y,x+40,y-200,5,'#e0a83a');line(x-70,y-196,x+70,y-196,6,'#e0a83a');const sw=Math.sin(t*1.5)*10;line(x-50+sw*.2,y-196,x-50+sw,y-150,2,'#3a3440');circ(x-50+sw,y-146,6,'#3a3440',2);
  ctx.restore();};
const _nodeLabelR=nodeLabel;nodeLabel=function(n,w){if(n.id==='rascacielos')return'Entrar: El Rascacielos en Obra';return _nodeLabelR(n,w);};
