'use strict';
/* ================= ISLA 4 · VALLE ESCARCHA (parte 1): mecánicas, sprites, escenarios y jefes =================
   Six guardians + Don Hollín, the lord of soot, who only opens his palace when the six have fallen.
   Every fight has its own rule: ice that slides, clouds that drift away, a lava tide, a thermometer that
   flips between cold and heat, swinging chandeliers over a floor that gives way, and a four-act final. */

/* ---------- new projectile sprites ---------- */
const SPR4={
  nieve(e,t,P,r){circ(0,0,r,P('#f4f8fb'),3);ell(-r*.3,-r*.35,r*.36,r*.22,'rgba(255,255,255,.95)',0);circ(r*.3,r*.25,r*.14,'rgba(140,170,195,.6)',0);},
  hielo(e,t,P,r){ctx.rotate(Math.atan2(e.vy||1,e.vx||0)-Math.PI/2);poly([[0,r*1.7],[-r*.55,-r*.5],[0,-r],[r*.55,-r*.5]],P('#bfe6f7'),2.5);line(0,-r*.5,0,r*1.1,1.6,'rgba(255,255,255,.85)');},
  brasa(e,t,P,r){circ(0,0,r+5+Math.sin(t*20+e.x)*1.5,'rgba(255,140,40,.3)',0);circ(0,0,r,P('#ff8a2e'),3);circ(-r*.3,-r*.3,r*.38,P('#ffe27a'),0);},
  carbon(e,t,P,r){ctx.rotate((e.rot||0)+t*4);poly([[-r,-r*.3],[-r*.4,-r],[r*.6,-r*.8],[r,r*.1],[r*.3,r],[-r*.7,r*.7]],P('#2b2420'),3);circ(r*.2,-r*.2,r*.22,'#ff8a2e',0);circ(-r*.35,r*.3,r*.15,'#ffb35a',0);},
  farolillo(e,t,P,r){ctx.rotate(Math.sin(t*4+e.x*.02)*.3);circ(0,0,r+8,'rgba(255,170,90,.25)',0);rr(-r*.8,-r,r*1.6,r*2,r*.7,P('#e8562e'),2.5);for(const d of[-.35,0,.35])line(d*r,-r*.9,d*r*1.3,r*.9,1.5,'rgba(20,13,8,.45)');
    rr(-r*.55,-r*1.2,r*1.1,r*.35,2,C.gold,2);rr(-r*.55,r*.85,r*1.1,r*.35,2,C.gold,2);line(0,r*1.2,0,r*1.8,2,C.gold);},
  pez(e,t,P,r){ctx.scale(e.vx<0?1:-1,1);ctx.rotate(Math.sin(t*14+e.x)*.15);ell(0,0,r,r*.62,P('#9fb3c8'),2.5);poly([[r*.8,0],[r*1.5,-r*.6],[r*1.5,r*.6]],P('#7f97ad'),2.5);circ(-r*.45,-r*.1,r*.16,C.ink,0);line(-r*.1,-r*.5,-r*.1,r*.5,1.5,'rgba(20,13,8,.4)');},
  pluma(e,t,P,r){ctx.rotate(Math.atan2(e.vy||0,e.vx||1)+Math.sin(t*10)*.2);ell(0,0,r*1.5,r*.48,P('#e9dcc0'),2.5);line(-r*1.7,0,r*1.4,0,1.6);for(let i=-2;i<=2;i++)line(i*r*.45,0,i*r*.45-r*.25,-r*.4,1.2,'rgba(20,13,8,.4)');},
  humo(e,t,P,r){ctx.globalAlpha=.92;for(const [x,y,k] of[[-r*.5,r*.2,.7],[r*.45,r*.15,.75],[0,-r*.25,.95]])circ(x,y,r*k,P('#3a3238'),2.5);ctx.globalAlpha=1;ell(-r*.3,-r*.2,r*.14,r*.22,'#ffb35a',0);ell(r*.3,-r*.2,r*.14,r*.22,'#ffb35a',0);}};
const _drawSpr4=drawSpr;
drawSpr=function(e,t){const f=SPR4[e.spr];if(!f){_drawSpr4(e,t);return;}const pc=e.parry&&!(e.cool>0),r=e.r||12,P=c=>pc?C.parry:c;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;
  f(e,t,P,r);ctx.restore();if(pc){ctx.beginPath();ctx.arc(e.x,e.y,r+7+Math.sin(t*12)*2,0,TAU);ctx.lineWidth=2.5;ctx.strokeStyle='rgba(159,240,230,.85)';ctx.stroke();}};

/* ---------- new enemy skins ---------- */
const EN4={
  pinguinito(e,t,F){const w=Math.sin(t*12)*.12;ctx.rotate(w);ell(0,2,17,20,F('#2b2a33'),3);ell(-3,6,10,14,F('#f4f4ee'),0);ell(-6,-10,3,4,C.white,0);circ(-7,-10,1.6,C.ink,0);poly([[-16,-6],[-26,-3],[-16,0]],'#f2a43a',2);
    rr(-14,-2,26,6,3,'#c8392b',2);poly([[6,-2],[12,10],[2,8]],'#c8392b',2);ell(-6,22,7,3,'#f2a43a',2);ell(6,22,7,3,'#f2a43a',2);},
  bolanieve(e,t,F){const sq=1+Math.sin(t*10)*.06;ctx.scale(1/sq,sq);circ(0,0,19,F('#f4f8fb'),3);ell(-6,-7,6,4,'rgba(255,255,255,.95)',0);ell(-6,-3,2.4,3.4,C.ink,0);ell(4,-3,2.4,3.4,C.ink,0);poly([[-1,1],[-12,4],[-1,5]],'#f2a43a',1.5);
    line(14,-4,26,-12,2.5,C.woodD);line(22,-9,26,-4,2,C.woodD);line(-14,-4,-24,-14,2.5,C.woodD);},
  buhonieve(e,t,F){const fl=Math.sin(t*16);for(const d of[-1,1]){ctx.save();ctx.scale(d,1);ctx.rotate(-.3-fl*.5);ell(18,0,16,7,F('#e9eef0'),2.5);ctx.restore();}ell(0,0,16,18,F('#f4f6f2'),3);
    for(const d of[-6,6]){circ(d,-5,6,'#ffe27a',2);circ(d,-5,2.6,C.ink,0);}poly([[-3,0],[3,0],[0,6]],'#f2a43a',1.5);for(let i=0;i<4;i++)circ(-6+i*4,8+(i%2)*3,1.3,'rgba(20,13,8,.4)',0);},
  hollinito(e,t,F){const b=Math.sin(t*9);ctx.scale(1+b*.05,1-b*.05);for(const [x,y,r] of[[-8,4,12],[8,4,12],[0,-6,15]])circ(x,y,r,F('#2f2a2e'),3);
    const fl=1+Math.sin(t*20)*.15;ctx.beginPath();ctx.moveTo(-5,-18);ctx.quadraticCurveTo(0,-34*fl,5,-18);ctx.fillStyle='#ff8a2e';ctx.fill();ctx.lineWidth=2;ctx.stroke();
    ell(-5,-4,3,4.5,'#ffb35a',0);ell(5,-4,3,4.5,'#ffb35a',0);ctx.beginPath();ctx.arc(0,4,5,.2,Math.PI-.2);ctx.lineWidth=2;ctx.strokeStyle='#ffb35a';ctx.stroke();},
  cometita(e,t,F){ctx.rotate(Math.sin(t*5)*.25);poly([[0,-20],[14,0],[0,22],[-14,0]],F('#e8562e'),3);line(0,-20,0,22,1.6);line(-14,0,14,0,1.6);ell(-4,-4,2.2,3.2,C.ink,0);ell(4,-4,2.2,3.2,C.ink,0);
    ctx.beginPath();ctx.moveTo(0,22);for(let i=1;i<5;i++)ctx.lineTo(Math.sin(t*8+i)*6,22+i*8);ctx.lineWidth=2;ctx.stroke();for(let i=1;i<4;i++)poly([[-4+Math.sin(t*8+i*2)*6,22+i*9],[4+Math.sin(t*8+i*2)*6,22+i*9-3],[4+Math.sin(t*8+i*2)*6,22+i*9+3]],C.gold,1.5);}};
const _drawEnemy4=drawEnemy;
drawEnemy=function(e,t){const f=EN4[e.skin];if(!f){_drawEnemy4(e,t);return;}if(e.hidden)return;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  const fl=e.flash>0,F=c=>fl?'#fff':c;if((e.face||-1)>0)ctx.scale(-1,1);f(e,e.t||0,F);ctx.restore();};

/* ---------- mechanics shared by the island-4 fights and levels ---------- */
/* ice: you keep sliding after you let go */
const _platUpdate4=platUpdate;
platUpdate=function(L,p,dt,I){const iv=p.iceV;_platUpdate4(L,p,dt,I);if(p.dead||p.meteor)return;
  const onIce=p.ground&&(L.iceOn||(p.groundRef&&p.groundRef.ice));
  if(onIce&&p.dash<=0&&!(p.superT>0)){const want=p.vx,cur=iv??want,k=Math.min(1,dt*(want===0?1.5:2.4)),nv=cur+(want-cur)*k;p.x=clamp(p.x+(nv-want)*dt,L.minX??20,L.maxX??W-20);if(L.kind==='run')p.x=clamp(p.x,L.camX+20,L.camX+W-20);
    p.iceV=nv;if(Math.abs(nv-want)>60&&rand()<dt*30)L.fx.push({k:'spark',x:p.x,y:p.y-2,vx:-nv*.3,vy:-40,life:.3,max:.3,r:3,col:'#dff4ff'});}else p.iceV=p.vx;};
/* custom solids (clouds, chandeliers...) drawn in the background layer */
function addCS(L,s){s.cs=true;s.h=s.h||14;s.oneWay=true;s.py=s.y;s.dx=0;s.mv=s.mv||{};L.solids.push(s);(L.cs=L.cs||[]).push(s);return s;}
function chainUpd(L,fn){const up=L.updSolids;L.updSolids=dt=>{up&&up(dt);fn(dt);};}
function killGround(L){for(const s of L.solids)if(s.ground){s.y=99999;s.gone=1e9;}L.groundGone=true;
  for(const p of L.Ps)if(!p.dead&&p.ground&&p.groundRef&&p.groundRef.ground){p.vy=-1500;p.ground=false;p.groundRef=null;p.inv=Math.max(p.inv,1.2);}
  shake(L,18);sfx('crack');sfx('crumble');for(let i=0;i<24;i++)L.fx.push({k:'puff',x:rand()*W,y:GROUND+rand()*20,vx:(rand()-.5)*120,vy:100+rand()*200,life:.8,max:.8,r:10+rand()*10,col:'#6b5a48'});}
const _setupArena4=setupArena;
setupArena=function(L,B,def,plane){_setupArena4(L,B,def,plane);if(def.mech)def.mech(L,B);
  if(L.cs){const bg=L.drawBG;L.drawBG=()=>{bg();for(const s of L.cs){if(s.y>9000)continue;if(s.draw)s.draw(s,L);else drawPlat(s,L.t);}};}};
/* darkness that stays: only the heroes, lit lanterns and the boss's glowing eyes give light */
let DARK4=null;
const _drawDark4=drawDark;
drawDark=function(L){const on=typeof L.permDark==='function'?L.permDark():L.permDark;if(!on){_drawDark4(L);return;}
  if(!DARK4){DARK4=document.createElement('canvas');DARK4.width=W;DARK4.height=H;}const g=DARK4.getContext('2d');if(!g){return;}
  const lit=(x,y,r,a=1)=>{const gr=g.createRadialGradient(x-L.camX,y,r*.2,x-L.camX,y,r);gr.addColorStop(0,`rgba(0,0,0,${a})`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-L.camX-r,y-r,r*2,r*2);};
  g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);g.fillStyle=`rgba(8,6,16,${L.darkA||.9})`;g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';
  for(const p of L.Ps){if(p.dead){if(p.ghost)lit(p.ghost.x,p.ghost.y,110,.8);continue;}const c=pCenter(p);lit(c.x,c.y,180);}
  for(const ln of L.lanterns||[])lit(ln.x,ln.y,ln.lit?250:46,ln.lit?1:.6);
  for(const e of L.eb)if(e.parry||e.spr==='brasa'||e.spr==='farolillo')lit(e.x,e.y,e.parry?46:30,.8);
  for(const b of L.bul)lit(b.x,b.y,26,.5);
  if(L.boss&&!L.boss.dead){const c=L.boss.center();lit(c.x,c.y,140,.55);}
  g.globalCompositeOperation='source-over';ctx.drawImage(DARK4,0,0,W,H);};
/* lava: a glowing tide that rises over the floor */
function lavaInit(L,per){L.lava={y:H+30,st:'calm',t:per*.7,per};const dw=L.drawWorld;L.drawWorld=()=>{dw();drawLava(L);};}
function lavaTick(L,dt){const v=L.lava;if(!v||L.state!=='play')return;v.t-=dt;const top=GROUND-28;
  if(v.st==='calm'&&v.t<=0){v.st='warn';v.t=1.3;sfx('warn');pop(L,W/2-120,GROUND-60,'¡LAVA!',C.rust);}
  else if(v.st==='warn'){if(rand()<dt*14)L.fx.push({k:'spark',x:rand()*W,y:GROUND-4,vx:0,vy:-160-rand()*160,life:.5,max:.5,r:4,col:'#ffb35a'});if(v.t<=0){v.st='rise';v.t=.6;sfx('fire');shake(L,8);}}
  else if(v.st==='rise'){v.y=lerp(v.y,top,1-Math.pow(.0005,dt));if(v.t<=0){v.st='hold';v.t=2.4;}}
  else if(v.st==='hold'){v.y=top+Math.sin(L.t*5)*3;if(v.t<=0){v.st='fall';v.t=.8;}}
  else if(v.st==='fall'){v.y=lerp(v.y,H+30,1-Math.pow(.01,dt));if(v.t<=0){v.st='calm';v.t=v.per*(L.boss?L.boss.pace:1);v.y=H+30;}}
  if(v.y<GROUND)for(const p of L.Ps)if(!p.dead&&p.y>v.y+4){if(p.inv<=0)hurt(L,p);p.vy=-1050;p.ground=false;p.groundRef=null;puff(L,p.x,v.y,6,'#ffb35a');}}
function drawLava(L){const v=L.lava;if(!v)return;if(v.st==='warn'){ctx.save();ctx.globalAlpha=.35+.25*Math.sin(L.t*20);ctx.fillStyle='#ff6a2e';ctx.fillRect(L.camX,GROUND-6,W,10);ctx.restore();}
  if(v.y>H)return;ctx.save();ctx.beginPath();ctx.moveTo(L.camX-10,H+10);for(let x=-10;x<=W+10;x+=16)ctx.lineTo(L.camX+x,v.y+Math.sin(x*.05+L.t*4)*6);ctx.lineTo(L.camX+W+10,H+10);ctx.closePath();
  const g=ctx.createLinearGradient(0,v.y,0,H);g.addColorStop(0,'#ffd35a');g.addColorStop(.25,'#ff7a2e');g.addColorStop(1,'#a8321e');ctx.fillStyle=g;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
  for(let i=0;i<7;i++){const x=L.camX+((i*151+L.t*30)%W),k=(L.t*1.3+i*.37)%1;circ(x,v.y+14+k*20,4+k*5,'rgba(255,240,170,.7)',0);}ctx.restore();}
/* a little thermometer flips the room between cold and heat */
function tempInit(L,B){L.temp={mode:'frio',t:7};L.iceOn=true;}
function tempTick(L,B,dt){const T=L.temp;if(!T||L.state!=='play')return;T.t-=dt;if(T.t<=0){T.mode=T.mode==='frio'?'calor':'frio';T.t=(B.phase>=2?5.5:8)*B.pace;L.iceOn=T.mode==='frio';
  banner(L,T.mode==='frio'?'¡FRÍO!':'¡CALOR!',1.1);sfx(T.mode==='frio'?'ding':'fire');shake(L,8);L.flash=Math.max(L.flash,.12);}}
const tempOf=L=>L.temp?L.temp.mode:'frio';
Object.assign(ATK,{
  tShot(L,B,a){const c=tempOf(L)==='frio';ATK.aimed(L,B,Object.assign({},a,c?{spr:'nieve',spd:250,n:3,spread:.3,r:14}:{spr:'brasa',spd:400,n:2,spread:.18,r:12}));},
  tRain(L,B,a){if(tempOf(L)==='frio')ATK.rain(L,B,{n:5,spr:'hielo',r:11,spd:[260,360],parry:a.parry});else ATK.column(L,B,{n:2,gap:.45,style:'fire',warn:.8,act:.45,w:46,spread:140});},
  tRing(L,B,a){ATK.ring(L,B,Object.assign({},a,tempOf(L)==='frio'?{spr:'nieve',spd:180}:{spr:'brasa',spd:240}));}});

/* ---------- arena backdrops ---------- */
function gE(g,x,y,rx,ry,fill,lw=3){g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);if(fill){g.fillStyle=fill;g.fill();}if(lw){g.lineWidth=lw;g.strokeStyle=C.ink;g.stroke();}}
function gP(g,pts,fill,lw=3){g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(lw){g.lineWidth=lw;g.strokeStyle=C.ink;g.stroke();}}
function gR(g,x,y,w,h,fill,lw=3,r=0){g.beginPath();g.roundRect(x,y,w,h,r);if(fill){g.fillStyle=fill;g.fill();}if(lw){g.lineWidth=lw;g.strokeStyle=C.ink;g.stroke();}}
function gPine(g,x,y,s,col,snow=true){gR(g,x-4*s,y-14*s,8*s,16*s,'#5a3a20',2);for(let i=0;i<3;i++){const yy=y-14*s-i*20*s,w=(34-i*8)*s;gP(g,[[x-w,yy],[x,yy-30*s],[x+w,yy]],col,2.5);if(snow)gP(g,[[x-w*.45,yy-16*s],[x,yy-30*s],[x+w*.45,yy-16*s],[x+w*.15,yy-12*s],[x-w*.15,yy-14*s]],'#f4f8fb',0);}}
function gMount(g,pts,col,snowCol='#f4f8fb'){gP(g,pts,col,3);for(let i=1;i<pts.length-1;i++){const [x,y]=pts[i];if(y<pts[0][1]-60)gP(g,[[x-30,y+34],[x,y],[x+30,y+34],[x+12,y+28],[x-8,y+36]],snowCol,0);}}
const A4={
  pista(g){skyG(g,'#f2c9b4','#9fb8cf');g.fillStyle='rgba(255,250,230,.7)';g.beginPath();g.arc(760,120,46,0,TAU);g.fill();
    gMount(g,[[-20,GROUND-40],[120,GROUND-230],[260,GROUND-120],[420,GROUND-280],[600,GROUND-140],[780,GROUND-250],[980,GROUND-60]],'#8fa6bd');
    for(let i=0;i<14;i++)gPine(g,30+i*70,GROUND-50+(i%2)*8,.9+(i%3)*.15,'#4f6f63');
    g.strokeStyle='rgba(20,13,8,.5)';g.lineWidth=2;g.beginPath();g.moveTo(0,90);for(let x=0;x<=W;x+=40)g.lineTo(x,90+Math.sin(x/W*Math.PI)*60);g.stroke();
    for(let x=20;x<W;x+=40){const y=90+Math.sin(x/W*Math.PI)*60;gE(g,x,y+8,5,7,['#e86a5a','#f2c14e','#7bb7c9','#b8d08a'][(x/40|0)%4],1.5);}
    g.fillStyle='#cfe6f2';g.fillRect(0,GROUND,W,H-GROUND);g.lineWidth=4;g.strokeStyle=C.ink;g.beginPath();g.moveTo(0,GROUND);g.lineTo(W,GROUND);g.stroke();
    g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=2;for(let i=0;i<9;i++){g.beginPath();g.ellipse(120+i*100,GROUND+40+(i%3)*14,60,6,.05*i,0,Math.PI*1.4);g.stroke();}
    for(let x=0;x<W;x+=60)gE(g,x+30,GROUND+3,34,8,'#f4f8fb',2);},
  cometa_cielo(g){skyG(g,'#f6d3a0','#e98c6e',H);raysG(g,480,600,'rgba(255,240,200,.12)');g.fillStyle='rgba(255,250,230,.85)';g.beginPath();g.arc(480,470,90,0,TAU);g.fill();
    for(const [x,y,s] of[[90,120,.9],[300,70,.6],[620,110,.8],[860,60,.7]])cloudShape(g,x,y,s,'#fbe8d0',4);
    for(let i=0;i<12;i++)cloudShape(g,-40+i*90,H-40+(i%2)*14,1.3,'#f4e3d8',4);for(let i=0;i<12;i++)cloudShape(g,-80+i*95,H+10,1.1,'#fff4ea',3);
    g.strokeStyle='rgba(20,13,8,.35)';g.lineWidth=1.5;for(const [x,y] of[[200,40],[780,30]]){g.beginPath();g.moveTo(x,0);g.quadraticCurveTo(x+40,y+40,x+20,y+80);g.stroke();gP(g,[[x+20,y+80],[x+32,y+96],[x+20,y+116],[x+8,y+96]],'#7bb7c9',2);}},
  volcan(g){skyG(g,'#3a1f22','#8a3a22');for(let i=0;i<30;i++){g.fillStyle=`rgba(255,${140+i%5*20},60,.5)`;g.beginPath();g.arc((i*137)%W,(i*71)%300,1.5+(i%3),0,TAU);g.fill();}
    gMount(g,[[-20,GROUND-30],[150,GROUND-200],[300,GROUND-90],[460,GROUND-230],[640,GROUND-80],[800,GROUND-180],[980,GROUND-40]],'#4a2a22','#ff8a2e');
    g.fillStyle='rgba(255,120,40,.18)';g.fillRect(0,GROUND-120,W,120);g.fillStyle='#3a2620';g.fillRect(0,GROUND,W,H-GROUND);g.lineWidth=4;g.strokeStyle=C.ink;g.beginPath();g.moveTo(0,GROUND);g.lineTo(W,GROUND);g.stroke();
    g.strokeStyle='#ff8a2e';g.lineWidth=3;for(let i=0;i<8;i++){g.beginPath();const x=60+i*120;g.moveTo(x,GROUND+10);g.lineTo(x+20,GROUND+40);g.lineTo(x+10,GROUND+70);g.stroke();}},
  observatorio(g){skyG(g,'#d8d6c8','#a9b7b9');gR(g,40,40,880,GROUND-60,'#c9c2ae',4,6);gR(g,90,80,250,190,'#bfe0f0',4,90);g.fillStyle='#f4f8fb';for(let i=0;i<40;i++){g.beginPath();g.arc(100+(i*37)%230,90+(i*53)%170,2,0,TAU);g.fill();}
    g.lineWidth=4;g.strokeStyle=C.ink;g.beginPath();g.moveTo(215,80);g.lineTo(215,270);g.moveTo(90,175);g.lineTo(340,175);g.stroke();
    for(let s=0;s<3;s++){gR(g,400+s*150,120+s*0,120,12,C.woodD,3);for(let i=0;i<4;i++){const c=['#7bc4e8','#e86a5a','#b8d08a','#f2c14e'][(i+s)%4];gR(g,408+s*150+i*28,92,16,28,c,2.5,6);}}
    gR(g,410,190,420,150,'#efe6cc',3,8);for(let i=0;i<10;i++){g.beginPath();g.moveTo(430+i*40,320);g.lineTo(430+i*40,320-(i%3+1)*30);g.lineWidth=2;g.stroke();}
    g.fillStyle='#8a8070';g.fillRect(0,GROUND,W,H-GROUND);for(let x=0;x<W;x+=48){gR(g,x,GROUND,48,24,(x/48)%2?'#9a9080':'#7a7060',2);}},
  lamparas(g){skyG(g,'#2a1f38','#4a2f4a');for(let i=0;i<9;i++){const x=50+i*110,y=60+(i%3)*40;g.strokeStyle='rgba(20,13,8,.8)';g.lineWidth=2;g.beginPath();g.moveTo(x,0);g.lineTo(x,y);g.stroke();
      const gl=g.createRadialGradient(x,y+20,4,x,y+20,90);gl.addColorStop(0,'rgba(255,210,120,.45)');gl.addColorStop(1,'rgba(255,210,120,0)');g.fillStyle=gl;g.fillRect(x-90,y-70,180,180);
      gP(g,[[x-26,y+30],[x-14,y],[x+14,y],[x+26,y+30]],['#c26aa8','#e8a24a','#7bb7c9'][i%3],3);gE(g,x,y+34,6,6,'#fff3b0',2);}
    for(let i=0;i<5;i++){gR(g,30+i*190,GROUND-150,150,150,'rgba(20,13,8,.25)',0,6);}
    g.fillStyle='#3a2a3a';g.fillRect(0,GROUND,W,H-GROUND);for(let x=0;x<W;x+=60){gR(g,x,GROUND,60,20,(x/60)%2?'#4a344a':'#3a2a3a',2);}},
  palacio(g){skyG(g,'#1f1012','#5a1e14');const gl=g.createRadialGradient(W/2,GROUND,40,W/2,GROUND,520);gl.addColorStop(0,'rgba(255,120,40,.35)');gl.addColorStop(1,'rgba(255,120,40,0)');g.fillStyle=gl;g.fillRect(0,0,W,H);
    for(let i=0;i<6;i++){const x=40+i*180;gR(g,x,0,46,GROUND-40,'#2b1a18',3);for(let k=0;k<5;k++)gR(g,x-6,60+k*80,58,10,'#3a2420',2);}
    for(const x of[160,800]){g.strokeStyle='rgba(20,13,8,.9)';g.lineWidth=3;for(let k=0;k<8;k++){g.beginPath();g.ellipse(x,20+k*20,6,10,0,0,TAU);g.stroke();}}
    for(const [x,s] of[[80,1],[300,.8],[700,.9],[900,1.1]])for(let k=0;k<4;k++)gE(g,x+(k%2)*20-10,GROUND-10-k*10*s,16*s,10*s,'#2b2420',2.5);
    g.fillStyle='#2a1a16';g.fillRect(0,GROUND,W,H-GROUND);for(let x=0;x<W;x+=24){g.fillStyle='rgba(255,120,40,.25)';g.fillRect(x+4,GROUND+8,12,H-GROUND);}g.lineWidth=4;g.strokeStyle=C.ink;g.beginPath();g.moveTo(0,GROUND);g.lineTo(W,GROUND);g.stroke();}};
const _paintArena4=paintArena;paintArena=function(g,k){if(A4[k]){A4[k](g);return;}_paintArena4(g,k);};
Object.assign(ARENA_FX,{
  pista:{tint:[null,'rgba(120,170,220,.14)','rgba(60,90,150,.25)'],part:['sparkle','sparkle','sparkle']},
  cometa_cielo:{tint:[null,'rgba(120,60,140,.16)','rgba(40,20,70,.3)'],part:['leaves','rain','sparkle']},
  volcan:{plats:[{x:70,y:330,w:120,skin:'piedra'},{x:300,y:290,w:120,skin:'piedra'},{x:500,y:335,w:110,skin:'piedra',from:1}],tint:[null,'rgba(255,80,20,.12)','rgba(120,0,0,.22)'],part:['ember','ember','ember']},
  observatorio:{plats:[{x:90,y:330,w:120,skin:'estante'},{x:330,y:280,w:120,skin:'estante',from:1}],tint:[null,'rgba(255,140,60,.1)','rgba(80,0,40,.2)'],part:['steam','sparkle','steam']},
  lamparas:{tint:[null,'rgba(150,60,140,.14)','rgba(20,0,30,.32)'],part:['sparkle','ember','sparkle']},
  palacio:{plats:[{x:60,y:330,w:110,skin:'chimenea',from:2},{x:290,y:280,w:110,skin:'chimenea',from:2},{x:500,y:330,w:100,skin:'chimenea',from:3},{x:180,y:200,w:90,skin:'chimenea',from:3}],
    tint:[null,'rgba(255,80,20,.12)','rgba(0,0,0,.3)','rgba(150,20,0,.25)'],part:['ember','ember','sparkle','ember']},
  plane_nieve:{tint:[null,'rgba(120,170,220,.16)','rgba(40,60,110,.3)'],part:['sparkle','sparkle','star']}});
/* snowy sky for the flying fight */
const _drawPlaneBG4=drawPlaneBG;
drawPlaneBG=function(L,k){if(k!=='plane_nieve'){_drawPlaneBG4(L,k);return;}const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#b9d3e6');g.addColorStop(1,'#f2f4ef');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(255,255,240,.8)';ctx.beginPath();ctx.arc(780,110,50,0,TAU);ctx.fill();
  const o=-(L.t*30)%600;for(let i=0;i<4;i++){const x=o+i*600-200;ctx.beginPath();ctx.moveTo(x,H);ctx.lineTo(x+120,H-180);ctx.lineTo(x+200,H-120);ctx.lineTo(x+320,H-240);ctx.lineTo(x+460,H);ctx.closePath();ctx.fillStyle='#d6e6ef';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='rgba(20,13,8,.6)';ctx.stroke();}
  ctx.fillStyle='#8fb0c4';ctx.fillRect(0,H-40,W,40);const o2=-(L.t*80)%400;for(let i=0;i<4;i++){const x=o2+i*400;ctx.beginPath();ctx.moveTo(x,H-40);ctx.lineTo(x+60,H-110);ctx.lineTo(x+110,H-40);ctx.closePath();ctx.fillStyle='#eef6fa';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}
  for(const c of L.clouds)if(c.l<2){ctx.globalAlpha=c.l?.7:.45;cloudShape(ctx,c.x,c.y,c.s,'#ffffff',3);ctx.globalAlpha=1;}
  for(let i=0;i<40;i++){const x=(i*97-L.t*(60+i%5*20))%W,y=(i*53+L.t*(40+i%3*20))%H;circ((x+W)%W,y,1.5+(i%3),'rgba(255,255,255,.9)',0);}};

/* ---------- 1. Hermanos Témpano (ice rink, floor is slippery) ---------- */
function iceCube(B,L,x,y,s,hat){const h=s*1.02,w=s,cr=B.phase>=1;ctx.save();
  for(const d of[-1,1]){rr(x+d*w*.28-16,y-8,32,8,3,C.steel,3);line(x+d*w*.28-20,y+1,x+d*w*.28+18,y+1,3);}
  hose(x-w*.5,y-h*.45,x-w*.75,y-h*.4,x-w*.78,y-h*.2+Math.sin(B.t*5)*8,7);glove(x-w*.78,y-h*.2+Math.sin(B.t*5)*8,11);hose(x+w*.5,y-h*.45,x+w*.75,y-h*.5,x+w*.7,y-h*.65+Math.sin(B.t*4)*8,7);glove(x+w*.7,y-h*.65+Math.sin(B.t*4)*8,11);
  rr(x-w/2,y-h-6,w,h,s*.18,B.phase===2?'#a9d8ee':'#c9ecfa',5);rr(x-w/2+8,y-h+4,w*.22,h*.6,8,'rgba(255,255,255,.6)',0);
  if(cr){ctx.strokeStyle='rgba(20,13,8,.55)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w*.2,y-h);ctx.lineTo(x+w*.1,y-h*.75);ctx.lineTo(x+w*.25,y-h*.6);ctx.stroke();}
  if(B.phase===2)for(let i=0;i<4;i++){const k=(B.t*.8+i*.25)%1;ell(x-w*.4+i*w*.27,y-h*.2+k*h*.25,4,6+k*4,'rgba(150,210,240,.9)',1.5);}
  bossFace(B,L,x,y-h*.55,s/150,{gap:s*.22,ew:s*.11,eh:s*.15,my:s*.2,mw:s*.2,open:B.mouth>0?.8:.3});
  if(hat==='orejeras'){line(x-w*.5,y-h*.7,x+w*.5,y-h*.7,0);ctx.beginPath();ctx.arc(x,y-h*.62,w*.52,Math.PI*1.08,Math.PI*1.92);ctx.lineWidth=6;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=3.5;ctx.strokeStyle=C.rust;ctx.stroke();for(const d of[-1,1])circ(x+d*w*.5,y-h*.55,s*.12,'#e86a5a',3);}
  else{ctx.save();ctx.beginPath();ctx.ellipse(x,y-h-4,w*.42,h*.3,0,Math.PI,0);ctx.closePath();ctx.fillStyle='#2e8f86';ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.clip();for(let i=-3;i<4;i++){ctx.fillStyle=C.paper;ctx.fillRect(x-w*.5,y-h-4-h*.3+i*12+(i>0?0:0),w,5);}ctx.restore();circ(x,y-h-4-h*.3,s*.1,C.paper,3);}
  ctx.restore();}
defBoss({id:'tempano',name:'Hermanos Témpano',sub:'Jefes · Pista Helada',isl:4,hp:520,par:120,arena:'pista',song:'tempano',x:690,intro:'¡A PATINAR!',
  center(B){return B.phase===1?{x:B.x,y:GROUND-170}:{x:B.x,y:B.y-90};},
  anchor(B,n){if(n==='mouth')return B.phase===0?{x:B.bx-30,y:GROUND-60}:{x:B.x-50,y:B.phase===1?GROUND-210:B.y-80};if(n==='hand')return{x:B.x-110,y:GROUND-110};if(n==='foot')return{x:B.x-80,y:GROUND};if(n==='top')return{x:B.x,y:B.phase===1?GROUND-280:B.y-170};return null;},
  shapes(B){if(B.phase===0)return[{x:B.x,y:B.y-82,r:78},{x:B.bx,y:GROUND-52,r:48}];if(B.phase===1)return[{x:B.x,y:GROUND-82,r:78},{x:B.x,y:GROUND-210,r:52}];return[{x:B.x,y:B.y-90,r:86}];},
  setup(B){B.bx=420;},mech(L){L.iceOn=true;},
  move(B,dt){if(B.phase===0){B.x=lerp(B.x,650+Math.sin(B.t*.55)*130,Math.min(1,dt*2));B.bx=520+Math.sin(B.t*.42+2)*290;}else if(B.phase===1)B.x=lerp(B.x,700+Math.sin(B.t*.8)*60,Math.min(1,dt*2));else B.x=lerp(B.x,640+Math.sin(B.t*.5)*170,Math.min(1,dt*1.5));},
  phases:[
    {atk:[{f:'roller',every:2.4,from:'foot',spr:'nieve',r:22,spd:380,parry:3,sfx:'knock'},{f:'aimed',every:2.2,from:'mouth',n:3,spread:.22,spd:330,spr:'hielo',r:11,parry:4},{f:'charge',every:5.2,warn:.9,spd:760}]},
    {banner:'¡TORRE DE HIELO!',atk:[{f:'rain',every:2.6,n:5,spr:'hielo',r:11,spd:[260,380],parry:5},{f:'lob',every:2.8,from:'top',n:2,spr:'nieve',r:18,bounce:1,parry:3},{f:'ring',every:3.4,from:'top',n:9,spd:200,spr:'hielo',r:10}]},
    {banner:'¡NOS DERRETIMOS!',atk:[{f:'leap',every:2.7,landWave:true},{f:'fountain',every:2.4,from:'top',n:5,spr:'drop',parry:4},{f:'aimed',every:2.8,from:'mouth',n:4,spread:.2,spd:340,spr:'hielo',r:11,parry:4}]}],
  draw(B,L){const t=B.t;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';bossSquash(B,L);
    if(B.phase===0){shadowE(B.bx,GROUND+3,60,.25);iceCube(B,L,B.bx,GROUND,100,'gorro');shadowE(B.x,GROUND+3,90,.25);iceCube(B,L,B.x,B.y,150,'orejeras');}
    else if(B.phase===1){shadowE(B.x,GROUND+3,90,.25);iceCube(B,L,B.x,GROUND,150,'orejeras');ctx.save();ctx.translate(B.x,GROUND-160);ctx.rotate(Math.sin(t*3)*.06);ctx.translate(-B.x,-(GROUND-160));iceCube(B,L,B.x,GROUND-160,104,'gorro');ctx.restore();}
    else{shadowE(B.x,GROUND+3,100,.3);const sq=1+Math.sin(t*6)*.05;ctx.save();ctx.translate(B.x,B.y);ctx.scale(1/sq,sq);ctx.translate(-B.x,-B.y);
      ctx.beginPath();ctx.moveTo(B.x-100,B.y);ctx.bezierCurveTo(B.x-120,B.y-150,B.x+120,B.y-170,B.x+100,B.y);ctx.closePath();ctx.fillStyle='#a9d8ee';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();
      ell(B.x-50,B.y-100,14,26,'rgba(255,255,255,.55)',0);bossFace(B,L,B.x-28,B.y-90,.9,{gap:34,ew:15,eh:20,my:30,mw:30,open:.6});bossFace(B,L,B.x+40,B.y-70,.6,{gap:26,ew:11,eh:15,my:22,mw:20,open:.5});ctx.restore();
      ell(B.x,GROUND+2,130,10,'rgba(150,210,240,.6)',0);}
    const c=B.center();flashOver(B,c.x,c.y,100);koStars(B,L,c.x,c.y-130);ctx.restore();}});

/* ---------- 2. Dragona Cometa (no floor: clouds drift away under your feet) ---------- */
const cmC=B=>({x:B.x,y:B.y});
defBoss({id:'cometa',name:'Dragona Cometa',sub:'Jefa · Mar de Nubes',isl:4,hp:560,par:125,arena:'cometa_cielo',song:'cometa',x:740,y:210,intro:'¡A VOLAR SIN ALAS!',
  center:cmC,anchor(B,n){if(n==='mouth')return{x:B.x-60,y:B.y+20};if(n==='tail')return{x:B.x+160,y:B.y+40};return cmC(B);},
  shapes(B){const s=[{x:B.x,y:B.y,r:66}];const tr=B.trail||[];for(const k of[10,20]){const q=tr[Math.min(tr.length-1,k)];if(q)s.push({x:q.x+60,y:q.y+10,r:30});}return s;},
  setup(B){B.trail=[];},
  mech(L,B){for(const s of L.solids)if(s.ground){s.y=99999;s.gone=1e9;}L.groundGone=true;const ys=[392,330,380,300,360,410,340];
    const kinds=['nube','globo','nube','cometa','nube','luna','globo','nube'];let ki=0;
    const mkC=(x,y,w,k)=>{const s=addCS(L,{x,y,w,skin:'nube',app:1,shake:0,fall:0});s.kind=k||kinds[ki++%kinds.length];s.seed=1+ki*1.7;s.draw=(s,L)=>{if(typeof drawSkyPlat==='function')drawSkyPlat(s,L);else drawPlat(s,L.t);};return s;};
    mkC(30,400,290,'nube');[[390,330,140],[610,385,150],[820,310,130],[1030,370,150]].forEach(([x,y,w])=>mkC(x,y,w));
    L.Ps.forEach((p,i)=>{p.x=150+i*80;p.y=400;});let yi=0;L.cmScroll=0;L.cmPT=0;
    chainUpd(L,dt=>{const on=L.state==='play'||L.state==='ko';if(L.state==='play')L.cmPT+=dt;const ramp=L.state==='ko'?1:Math.min(1,Math.max(0,L.cmPT-.6)/3.4);
      const sp=on?([58,78,98][B.phase]||58)*ramp:0;L.cmSp=sp;L.cmScroll+=sp*dt;
      for(const s of L.cs){if(s.y0===undefined)s.y0=s.y;const px=s.x;s.py=s.y;s.x-=sp*dt;let wrap=false;if(s.x+s.w<-70){s.x=W+40+rand()*60;s.y0=ys[yi++%ys.length];s.kind=kinds[ki++%kinds.length];s.seed=1+ki*1.7;wrap=true;}
        s.y=s.y0+Math.sin(L.t*1.6+s.x*.01)*(s.kind==='globo'?7:5);if(wrap)s.py=s.y;s.dx=wrap?0:s.x-px;}});},
  move(B,dt,L){B.trail.unshift({x:B.x,y:B.y});if(B.trail.length>40)B.trail.length=40;const t=B.t,e=B.phase===2;
    B.x=lerp(B.x,700+Math.sin(t*.6)*120+(e?Math.sin(t*2.7)*60:0),Math.min(1,dt*2));B.y=lerp(B.y,200+Math.sin(t*1.1)*55+(e?Math.cos(t*3.1)*40:0),Math.min(1,dt*2));},
  phases:[
    {atk:[{f:'aimed',every:1.9,from:'mouth',n:1,spd:230,spr:'farolillo',r:14,wob:60,parry:3},{f:'minion',every:4.5,from:'tail',ai:'diver',skin:'cometita',hp:3,r:20,max:2},{f:'ring',every:3.6,from:'mouth',n:8,spd:190,spr:'star',r:11,parry:4}]},
    {banner:'¡VIENTO DE TORMENTA!',atk:[{f:'wind',every:6,dur:2.2,force:120},{f:'column',every:3.2,n:2,gap:.5,style:'darkbolt',warn:.8,act:.4,w:36,full:true},{f:'spiral',every:4,from:'mouth',dur:1.4,rate:.1,spd:210,spr:'star',r:10,arms:2,parry:6}]},
    {banner:'¡SE CORTÓ EL HILO!',atk:[{f:'boomer',every:2.4,from:'mouth',spr:'farolillo',r:16,parry:2},{f:'rain',every:2.2,n:4,spr:'star',r:11,spd:[300,420]},{f:'aimed',every:2.6,from:'mouth',n:3,spread:.3,spd:280,spr:'farolillo',r:13,parry:4}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,cut=B.phase===2;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    if(!cut){ctx.strokeStyle='rgba(20,13,8,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+10,y-30);ctx.quadraticCurveTo(x+80,y-160,x+40,-20);ctx.stroke();}
    else{ctx.strokeStyle='rgba(20,13,8,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+10,y-30);for(let i=1;i<6;i++)ctx.lineTo(x+10+Math.sin(t*9+i)*12,y-30-i*14);ctx.stroke();}
    const tr=B.trail||[];for(let i=Math.min(tr.length-1,36);i>=4;i-=4){const q=tr[i],k=1-i/40,sx=q.x+60+i*7,sy=q.y+12+Math.sin(t*4+i*.3)*14,s=14+k*22;
      ctx.save();ctx.translate(sx,sy);ctx.rotate(Math.sin(t*3+i)*.3);poly([[0,-s],[s*.75,0],[0,s],[-s*.75,0]],i%8?'#e8562e':'#f2c14e',3);line(0,-s,0,s,1.5);ctx.restore();
      if(i%8===0){ctx.save();ctx.translate(sx,sy+s);poly([[-8,0],[8,-6],[8,6]],'#7bb7c9',2);poly([[8,0],[-8,-6],[-8,6]],'#7bb7c9',2);ctx.restore();}}
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*2)*.08+(cut?Math.sin(t*6)*.15:0));bossSquash(B,L);
    poly([[0,-92],[78,-6],[0,96],[-86,-6]],B.phase===1?'#d84a2a':'#e8562e',6);poly([[0,-92],[78,-6],[0,0]],'rgba(255,255,255,.18)',0);line(0,-92,0,96,2.5);line(-86,-6,78,-6,2.5);
    for(const d of[-1,1]){ctx.beginPath();ctx.moveTo(d*30,-50);ctx.quadraticCurveTo(d*70,-110,d*40,-130+Math.sin(t*5+d)*8);ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=C.gold;ctx.stroke();}
    for(const d of[-1,1]){ctx.beginPath();ctx.moveTo(-50,20+d*8);ctx.quadraticCurveTo(-110,30+d*30,-140,10+d*40+Math.sin(t*4+d)*14);ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle=C.paper;ctx.stroke();}
    ctx.restore();bossFace(B,L,x-14,y-4,.95,{gap:36,ew:17,eh:22,my:36,mw:34,open:B.mouth>0?.8:.35});
    flashOver(B,x,y,80);koStars(B,L,x,y-110);ctx.restore();}});

/* ---------- 3. Almirante Pingüino (flying fight over the icebergs) ---------- */
defBoss({id:'pinguino',kind:'plane',name:'Almirante Pingüino',sub:'Jefe aéreo · Cielo Polar',isl:4,hp:520,par:125,arena:'plane_nieve',song:'pinguino',x:760,y:230,intro:'¡A LOS CAÑONES!',
  center(B){return{x:B.x,y:B.y};},anchor(B,n){if(n==='gondola')return{x:B.x-40,y:B.y+80};if(n==='mouth')return B.phase===2?{x:B.x-50,y:B.y}:{x:B.x-40,y:B.y+80};return{x:B.x,y:B.y};},
  shapes(B){return B.phase<2?[{x:B.x,y:B.y-30,r:108},{x:B.x-10,y:B.y+72,r:42}]:[{x:B.x,y:B.y,r:56}];},
  move(B,dt){const t=B.t;if(B.phase<2){B.x=lerp(B.x,760+Math.sin(t*.5)*40+(B.phase===1?Math.sin(t*2.2)*30:0),Math.min(1,dt*2));B.y=lerp(B.y,230+Math.sin(t*.8)*70,Math.min(1,dt*2));}
    else{B.x=lerp(B.x,720+Math.sin(t*.9)*130,Math.min(1,dt*2.4));B.y=lerp(B.y,270+Math.sin(t*1.7)*170,Math.min(1,dt*2.4));}},
  phases:[
    {atk:[{f:'minion',every:3.4,from:'gondola',ai:'flyer',skin:'pinguinito',hp:2,r:18,max:3,spd:170},{f:'aimed',every:2,from:'gondola',n:2,spread:.2,spd:300,spr:'nieve',r:14,parry:3},{f:'rain',every:3,n:3,spr:'hielo',r:11,spd:[260,340]}]},
    {banner:'¡SE DESINFLA!',atk:[{f:'spiral',every:3.6,from:'gondola',dur:1.6,rate:.1,spd:220,spr:'pez',r:12,arms:2,parry:6},{f:'ring',every:3.2,from:'gondola',n:8,spd:210,spr:'nieve',r:12,parry:4},{f:'wall',every:6.5,spr:'nieve',gap:170,spd:240}]},
    {banner:'¡AL ABORDAJE!',atk:[{f:'aimed',every:1.6,from:'mouth',n:3,spread:.25,spd:380,spr:'pez',r:12,parry:3},{f:'tele',every:4.5},{f:'boomer',every:3,from:'mouth',spr:'nieve',r:15,parry:2}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    if(B.phase<2){const sh=B.phase===1?1+Math.sin(t*8)*.04:1;ctx.save();ctx.translate(x,y-30);ctx.scale(sh,2-sh);
      poly([[100,-10],[150,-60],[140,-6]],'#2b3a5a',4);poly([[100,10],[150,60],[140,6]],'#2b3a5a',4);
      ctx.beginPath();ctx.ellipse(0,0,130,74,0,0,TAU);ctx.fillStyle='#f4f4ee';ctx.fill();ctx.save();ctx.clip();for(let i=-6;i<7;i+=2){ctx.fillStyle='#2b3a5a';ctx.fillRect(i*22,-80,22,160);}ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(-40,-34,60,14,-.1,0,TAU);ctx.fill();ctx.restore();
      ctx.beginPath();ctx.ellipse(0,0,130,74,0,0,TAU);ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();
      if(B.phase===1){for(const [px,py] of[[-60,10],[40,-30],[70,30]])rr(px-12,py-10,24,20,3,'#c79a5e',2.5);const k=(t*2)%1;ctx.globalAlpha=1-k;circ(90+k*40,-40-k*30,6+k*10,'#ffffff',2);ctx.globalAlpha=1;}
      ctx.restore();line(x-50,y+30,x-60,y+60,3);line(x+40,y+30,x+30,y+60,3);rr(x-90,y+56,150,46,12,'#c8392b',4);for(let i=0;i<3;i++)circ(x-60+i*40,y+78,9,'#bfe3f0',3);
      ctx.save();ctx.translate(x+70,y+78);ctx.rotate(t*30);ell(0,0,4,22,C.woodD,2);ctx.restore();
      ctx.save();ctx.translate(x-60,y+58);ell(0,-8,16,18,'#2b2a33',3);ell(-3,-4,9,12,'#f4f4ee',0);circ(-6,-14,2,C.ink,0);poly([[-14,-10],[-24,-7],[-14,-4]],'#f2a43a',2);
      rr(-18,-30,30,8,2,'#1b1a2a',2);poly([[-16,-30],[-2,-44],[12,-30]],'#1b1a2a',2.5);circ(-2,-34,3,C.gold,1.5);rr(-34,-14,20,6,3,C.brass,2);ctx.restore();}
    else{ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*3)*.12);bossSquash(B,L);ell(0,14,46,8,'#9a2a20',3);ell(0,0,56,22,'#c8392b',4.5);ell(-56,0,8,14,C.brass,3);
      ctx.save();ctx.translate(-66,0);ctx.rotate(t*40);ell(0,0,3,24,C.woodD,2);ctx.restore();poly([[46,-6],[70,-30],[66,4]],'#9a2a20',3);
      ell(6,-26,20,22,'#2b2a33',3.5);ell(2,-20,12,14,'#f4f4ee',0);poly([[-12,-26],[-28,-22],[-12,-18]],'#f2a43a',2);rr(-10,-38,30,7,3,'#3a2a20',0);circ(-2,-34.5,4,'#bfe3f0',2);circ(9,-34.5,4,'#bfe3f0',2);
      ctx.beginPath();ctx.moveTo(18,-18);for(let i=1;i<6;i++)ctx.lineTo(18+i*9,-20+Math.sin(t*16-i)*4);ctx.lineWidth=6;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=3.5;ctx.strokeStyle=C.paper;ctx.stroke();ctx.restore();}
    flashOver(B,x,y,B.phase<2?120:60);koStars(B,L,x,y-110);ctx.restore();}});

/* ---------- 4. Mamá Volcana (a lava tide rises over the floor) ---------- */
defBoss({id:'volcana',name:'Mamá Volcana',sub:'Jefa · Cráter Rugiente',isl:4,hp:580,par:125,arena:'volcan',song:'volcana',x:760,intro:'¡QUÉ CALOR, QUÉ CALOR!',
  center(B){return{x:B.x,y:GROUND-180};},anchor(B,n){if(n==='crater')return{x:B.x,y:GROUND-300};if(n==='hand')return{x:B.x-180,y:GROUND-150};if(n==='foot')return{x:B.x-170,y:GROUND};return null;},
  shapes(B){return[{x:B.x-140,y:GROUND-190,w:280,h:190},{x:B.x,y:GROUND-240,r:72}];},
  mech(L,B){lavaInit(L,11);chainUpd(L,dt=>{if(L.lava)L.lava.per=[11,9,7][B.phase]||7;lavaTick(L,dt);});},
  move(B,dt){B.x=lerp(B.x,760+Math.sin(B.t*.7)*14,Math.min(1,dt*2));},
  phases:[
    {atk:[{f:'lob',every:2.6,from:'crater',n:2,spr:'brasa',r:14,puddle:true,T:1.3,parry:3},{f:'aimed',every:2.2,from:'hand',n:3,spread:.25,spd:320,spr:'brasa',r:12},{f:'column',every:4,n:2,gap:.5,style:'fire',warn:.8,act:.45,w:46,spread:120}]},
    {banner:'¡ERUPCIÓN!',atk:[{f:'rain',every:2.2,n:4,spr:'brasa',r:13,spd:[260,400],parry:4},{f:'minion',every:4,from:'foot',ai:'walker',skin:'hollinito',hp:3,r:20,max:2,spd:140},{f:'lob',every:3,from:'crater',spr:'carbon',r:16,bounce:1}]},
    {banner:'¡LAVA POR TODAS PARTES!',atk:[{f:'spiral',every:3.4,from:'crater',dur:1.6,rate:.09,spd:230,spr:'brasa',r:11,arms:2,parry:7},{f:'fountain',every:2.6,from:'crater',n:6,spr:'brasa',parry:4},{f:'aimed',every:2,from:'hand',n:2,spread:.2,spd:360,spr:'brasa',r:12}]}],
  draw(B,L){const t=B.t,x=B.x,g=GROUND;shadowE(x,g+3,170,.3);ctx.save();ctx.lineCap='round';ctx.lineJoin='round';bossSquash(B,L);
    for(const s of[-1,1]){const hx=x+s*175,hy=g-140+Math.sin(t*3+s)*14+(s<0&&B.throwT>0?-50:0);hose(x+s*120,g-120,x+s*170,g-120,hx,hy,10);glove(hx,hy,16);}
    ctx.beginPath();ctx.moveTo(x-170,g);ctx.lineTo(x-70,g-270);ctx.quadraticCurveTo(x,g-290,x+70,g-270);ctx.lineTo(x+170,g);ctx.closePath();ctx.fillStyle='#6b3a2a';ctx.fill();ctx.lineWidth=6;ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.save();ctx.clip();ctx.fillStyle='#8a4a32';ctx.fillRect(x-170,g-80,340,80);for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(x-50+i*25,g-270);ctx.quadraticCurveTo(x-60+i*25+Math.sin(t*2+i)*6,g-200,x-40+i*20,g-150-i*8);ctx.lineWidth=10;ctx.strokeStyle=B.phase===2?'#ffb35a':'#ff7a2e';ctx.stroke();}ctx.restore();
    const fl=1+Math.sin(t*10)*.08+(B.phase*0.15);for(let i=0;i<5;i++){const a=-Math.PI/2+(i-2)*.35;ctx.beginPath();ctx.moveTo(x+(i-2)*22,g-278);ctx.quadraticCurveTo(x+(i-2)*30+Math.cos(a)*20,g-320*fl,x+(i-2)*14+Math.sin(t*8+i)*8,g-(330+i%2*30)*fl);ctx.quadraticCurveTo(x+(i-2)*16+14,g-300,x+(i-2)*22+14,g-278);ctx.fillStyle=i%2?'#ffd35a':'#ff7a2e';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}
    ell(x-58,g-150,16,9,'rgba(255,120,90,.5)',0);ell(x+58,g-150,16,9,'rgba(255,120,90,.5)',0);bossFace(B,L,x,g-180,1.1,{gap:40,ew:18,eh:24,my:40,mw:40,open:B.mouth>0?.9:.35});
    if(B.mouth>0)for(let i=0;i<3;i++){const k=(t*2+i/3)%1;circ(x+(i-1)*20,g-300-k*80,8-k*5,`rgba(80,70,70,${1-k})`,0);}
    flashOver(B,x,g-180,140);koStars(B,L,x,g-340);ctx.restore();}});

/* ---------- 5. Doctor Termómetro (the room flips between cold and heat) ---------- */
defBoss({id:'termometro',name:'Doctor Termómetro',sub:'Jefe · Observatorio del Clima',isl:4,hp:560,par:125,arena:'observatorio',song:'termometro',x:740,intro:'¡A TOMARTE LA TEMPERATURA!',
  center(B){return{x:B.x,y:GROUND-200};},anchor(B,n){if(n==='top')return{x:B.x,y:GROUND-370};if(n==='hand')return{x:B.x-120,y:GROUND-210};if(n==='bulb')return{x:B.x-60,y:GROUND-80};return null;},
  shapes(B){return[{x:B.x-46,y:GROUND-360,w:92,h:270},{x:B.x,y:GROUND-78,r:76}];},
  mech(L,B){tempInit(L,B);chainUpd(L,dt=>tempTick(L,B,dt));const bg=L.drawBG;L.drawBG=()=>{bg();const T=L.temp;if(!T)return;ctx.save();ctx.globalAlpha=.16+.04*Math.sin(L.t*3);ctx.fillStyle=T.mode==='frio'?'#7bc4e8':'#ff8a2e';ctx.fillRect(0,0,W,H);ctx.restore();
    ctx.save();ctx.globalAlpha=.7;for(let i=0;i<28;i++){const x=(i*71+L.t*(T.mode==='frio'?20:-10))%W,y=T.mode==='frio'?(i*43+L.t*60)%H:H-((i*43+L.t*90)%H);if(T.mode==='frio')circ((x+W)%W,y,2+(i%3),'#ffffff',0);else circ((x+W)%W,y,2+(i%3),'rgba(255,200,120,.8)',0);}ctx.restore();};},
  move(B,dt){B.x=lerp(B.x,740+Math.sin(B.t*.6)*60,Math.min(1,dt*2));},
  phases:[
    {atk:[{f:'tShot',every:2,from:'hand',parry:3},{f:'tRain',every:3,parry:5}]},
    {banner:'¡FIEBRE!',atk:[{f:'tShot',every:1.8,from:'hand',parry:3},{f:'tRain',every:2.6,parry:5},{f:'tRing',every:3.4,from:'top',n:10,r:11,parry:5}]},
    {banner:'¡EBULLICIÓN!',atk:[{f:'tShot',every:1.6,from:'hand',parry:3},{f:'tRain',every:2.3,parry:4},{f:'tRing',every:3.2,from:'top',n:10,r:11,parry:6},{f:'spiral',every:4,from:'top',dur:1.4,rate:.1,spd:200,spr:'bubble',r:12,arms:2}]}],
  draw(B,L){const t=B.t,x=B.x,g=GROUND,T=L.temp||{mode:'frio',t:4},hot=T.mode==='calor';shadowE(x,g+3,110,.3);ctx.save();ctx.lineCap='round';ctx.lineJoin='round';bossSquash(B,L);
    hose(x-40,g-220,x-90,g-230,x-118,g-212+Math.sin(t*4)*8,8);glove(x-118,g-212+Math.sin(t*4)*8,13);rr(x-132,g-250+Math.sin(t*4)*8,24,30,8,hot?'#ff8a2e':'#7bc4e8',3);
    hose(x+40,g-220,x+90,g-200,x+100,g-170+Math.sin(t*3)*8,8);glove(x+100,g-170+Math.sin(t*3)*8,13);
    rr(x-46,g-370,92,300,46,'rgba(240,248,250,.92)',6);const lv=hot?.15+Math.sin(t*3)*.05:.62+Math.sin(t*3)*.04,top=g-350+lv*230;rr(x-20,top,40,g-90-top,20,hot?'#e8402e':'#5aa0d0',3);
    for(let i=0;i<9;i++)line(x+22,g-340+i*26,x+36-(i%2)*6,g-340+i*26,2.5);circ(x,g-78,78,'rgba(240,248,250,.92)',6);circ(x,g-78,58,hot?'#e8402e':'#5aa0d0',4);ell(x-20,g-100,14,20,'rgba(255,255,255,.5)',0);
    ctx.save();ctx.beginPath();ctx.moveTo(x-80,g-240);ctx.quadraticCurveTo(x,g-200,x+80,g-240);ctx.lineTo(x+70,g-190);ctx.quadraticCurveTo(x,g-170,x-70,g-190);ctx.closePath();ctx.fillStyle=C.white;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();poly([[x-14,g-210],[x,g-198],[x+14,g-210],[x+14,g-188],[x,g-198],[x-14,g-188]],C.rust,3);ctx.restore();
    bossFace(B,L,x,g-290,.8,{gap:30,ew:14,eh:18,my:30,mw:26,open:B.mouth>0?.8:.3});rr(x-40,g-318,80,14,6,'#3a2a20',0);circ(x-15,g-311,12,hot?'#ffd35a':'#bfe3f0',3);circ(x+15,g-311,12,hot?'#ffd35a':'#bfe3f0',3);
    if(hot)for(let i=0;i<3;i++){const k=(t*1.5+i/3)%1;ctx.globalAlpha=1-k;ctx.beginPath();ctx.moveTo(x-30+i*30,g-380-k*40);ctx.quadraticCurveTo(x-20+i*30,g-395-k*40,x-30+i*30,g-410-k*40);ctx.lineWidth=3;ctx.strokeStyle='rgba(255,255,255,.8)';ctx.stroke();ctx.globalAlpha=1;}
    else for(let i=0;i<3;i++)poly([[x-30+i*30,g-372],[x-26+i*30,g-352],[x-22+i*30,g-372]],'#dff4ff',2);
    flashOver(B,x,g-200,120);koStars(B,L,x,g-420);ctx.restore();}});

/* ---------- 6. Reina Polilla (chandeliers swing; the floor gives way) ---------- */
function lampStand(s,L){const px=s.pv[0],py=s.pv[1],cx=s.x+s.w/2;ctx.save();ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(cx,s.y-30);ctx.stroke();ctx.setLineDash([]);
  const gl=ctx.createRadialGradient(cx,s.y+10,4,cx,s.y+10,110);gl.addColorStop(0,'rgba(255,220,140,.35)');gl.addColorStop(1,'rgba(255,220,140,0)');ctx.fillStyle=gl;ctx.fillRect(cx-110,s.y-100,220,220);
  ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.quadraticCurveTo(cx,s.y+34,s.x+s.w,s.y);ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=C.brass;ctx.stroke();
  rr(s.x-4,s.y-6,s.w+8,12,6,C.brass,3);for(let i=0;i<4;i++){const x=s.x+12+i*(s.w-24)/3;rr(x-4,s.y-22,8,16,2,'#f4ead6',2);const f=1+Math.sin(L.t*16+i)*.15;ctx.beginPath();ctx.moveTo(x-3,s.y-22);ctx.quadraticCurveTo(x,s.y-36*f,x+3,s.y-22);ctx.fillStyle='#ffd35a';ctx.fill();ctx.lineWidth=1.5;ctx.stroke();}
  for(let i=0;i<5;i++)ell(s.x+10+i*(s.w-20)/4,s.y+16+(i%2)*8,3,6,'#bfe3f0',1.5);ctx.restore();}
defBoss({id:'polilla',name:'Reina Polilla',sub:'Jefa · Galería de las Lámparas',isl:4,hp:560,par:125,arena:'lamparas',song:'polilla',x:700,y:230,intro:'¡QUÉ LUZ TAN RICA!',
  center(B){return{x:B.x,y:B.y};},anchor(B,n){if(n==='mouth')return{x:B.x-40,y:B.y+14};if(n==='wing')return{x:B.x+80,y:B.y-40};return{x:B.x,y:B.y};},
  shapes(B){return[{x:B.x,y:B.y+10,r:60}];},
  mech(L,B){const defs=[[200,40,300,1.2,0],[450,40,250,1.5,1.4],[700,40,290,1.05,2.6]];for(const [px,py,len,sp,ph] of defs)addCS(L,{x:px-60,y:py+len,w:120,pv:[px,py],len,sp,ph,draw:lampStand});
    chainUpd(L,dt=>{for(const s of L.cs){const px=s.x;s.py=s.y;const th=.42*Math.sin(L.t*s.sp+s.ph);s.x=s.pv[0]+Math.sin(th)*s.len-s.w/2;s.y=s.pv[1]+Math.cos(th)*s.len;s.dx=s.x-px;}
      if(L.collapseT>0){L.collapseT-=dt;if(L.collapseT<=0)killGround(L);}});
    const dw=L.drawWorld;L.drawWorld=()=>{if(L.groundGone){ctx.save();const g=ctx.createLinearGradient(0,GROUND-10,0,H);g.addColorStop(0,'#1a1020');g.addColorStop(1,'#000');ctx.fillStyle=g;ctx.fillRect(0,GROUND-6,W,H-GROUND+6);
      for(let i=0;i<10;i++){const k=(L.t*.4+i*.1)%1;circ((i*97)%W,H-k*90,2,`rgba(255,220,140,${1-k})`,0);}ctx.restore();}dw();};},
  onPhase(B,L,i){if(i===2){L.collapseT=1.3;sfx('crumble');}},
  move(B,dt){const t=B.t,f=B.phase===2?1.4:1;B.x=lerp(B.x,640+Math.sin(t*.5*f)*190,Math.min(1,dt*2));B.y=lerp(B.y,200+Math.sin(t*1.3*f)*70,Math.min(1,dt*2));},
  phases:[
    {atk:[{f:'aimed',every:2,from:'mouth',n:4,spread:.35,spd:260,spr:'orb',r:10,wob:40,parry:4},{f:'minion',every:3.6,from:'wing',ai:'diver',skin:'polilla',hp:2,r:18,max:3},{f:'wind',every:7,dur:2,force:110}]},
    {banner:'¡ALAS DE FUEGO!',atk:[{f:'ring',every:3,from:'mouth',n:12,spd:220,spr:'brasa',r:11,parry:6},{f:'boomer',every:2.6,from:'wing',spr:'pluma',r:14,parry:3},{f:'minion',every:4.5,from:'wing',ai:'diver',skin:'polilla',hp:2,r:18,max:2}]},
    {banner:'¡EL SUELO SE HUNDE!',atk:[{f:'spiral',every:3.6,from:'mouth',dur:1.6,rate:.1,spd:210,spr:'orb',r:10,arms:2,parry:6},{f:'rain',every:2.4,n:4,spr:'pluma',r:12,spd:[240,340]},{f:'aimed',every:2.2,from:'mouth',n:3,spread:.25,spd:330,spr:'brasa',r:12,parry:4}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,fl=Math.sin(t*(B.phase===1?18:12));ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    for(const s of[-1,1])for(const lo of[0,1]){ctx.save();ctx.translate(x,y);ctx.scale(s,1);ctx.rotate((lo?.5:-.35)+fl*(lo?.15:.4));const w=lo?90:140,h=lo?60:90;
      ctx.beginPath();ctx.ellipse(w*.6,0,w*.6,h*.5,0,0,TAU);ctx.fillStyle=B.phase===1?'#c8562e':'#b8946a';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
      circ(w*.65,-h*.05,h*.2,B.phase===1?'#ffd35a':'#f2e3c2',3);circ(w*.65,-h*.05,h*.09,C.ink,0);ell(w*.3,h*.15,10,6,'rgba(20,13,8,.3)',0);ctx.restore();}
    ctx.save();ctx.translate(x,y);bossSquash(B,L);ell(0,40,30,46,'#8a6a4a',4);for(let i=0;i<4;i++)line(-24,20+i*16,24,20+i*16,2,'rgba(20,13,8,.4)');circ(0,-2,48,'#d8c4a0',5);
    for(let i=0;i<10;i++){const a=i*TAU/10;circ(Math.cos(a)*44,-2+Math.sin(a)*44,10,'#e9dcc0',0);}circ(0,-2,40,'#d8c4a0',0);
    for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*16,-40);ctx.quadraticCurveTo(s*40,-90,s*60,-84+Math.sin(t*6+s)*6);ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();for(let k=0;k<5;k++)line(s*(24+k*7),-60-k*5,s*(28+k*7),-52-k*5,2);}
    poly([[-26,-46],[-20,-70],[-8,-54],[0,-76],[8,-54],[20,-70],[26,-46]],C.gold,3.5);for(const d of[-14,0,14])circ(d,-52,3.5,'#c26aa8',1.5);ctx.restore();
    bossFace(B,L,x,y-4,.85,{gap:30,ew:15,eh:20,my:28,mw:26,open:B.mouth>0?.8:.3});flashOver(B,x,y,64);koStars(B,L,x,y-100);ctx.restore();}});

/* ---------- 7. Don Hollín, Señor del Humo (the final fight of the valley, four acts) ---------- */
defBoss({id:'hollin',name:'Don Hollín',sub:'Jefe final · Palacio del Hollín',isl:4,hp:900,par:150,arena:'palacio',song:'hollin',x:740,intro:'¡NINGUNA LUZ SALE DE AQUÍ!',
  center(B){return B.phase===2?{x:B.x,y:B.fy}:B.phase===3?{x:B.x,y:B.fy}:{x:B.x,y:GROUND-300};},
  anchor(B,n){const c=this.center(B);if(n==='stove'||n==='foot')return{x:B.x-150,y:GROUND};if(n==='door')return{x:B.x-60,y:GROUND-110};if(n==='hand')return B.phase<2?{x:B.x-120,y:GROUND-330}:{x:c.x-80,y:c.y};if(n==='mouth')return{x:c.x-30,y:c.y+20};return c;},
  shapes(B){if(B.phase<2)return[{x:B.x,y:GROUND-310,r:78},{x:B.x-130,y:GROUND-210,w:260,h:210}];if(B.phase===2)return[{x:B.x,y:B.fy,r:96}];return[{x:B.x,y:B.fy,r:52}];},
  setup(B){B.fy=GROUND-300;},
  mech(L,B){const gnd=L.solids.find(s=>s.ground);L.permDark=()=>B.phase===2&&!B.dead;L.darkA=.86;
    chainUpd(L,dt=>{if(gnd)gnd.conv=B.phase===1&&L.state==='play'?130:0;if(L.collapseT>0){L.collapseT-=dt;if(L.collapseT<=0)killGround(L);}});
    const dw=L.drawWorld;L.drawWorld=()=>{if(L.groundGone){ctx.save();const g=ctx.createLinearGradient(0,GROUND,0,H);g.addColorStop(0,'#5a1e14');g.addColorStop(1,'#140806');ctx.fillStyle=g;ctx.fillRect(0,GROUND-6,W,H-GROUND+6);
        for(let i=0;i<14;i++){const k=(L.t*.6+i*.07)%1,x=(i*71)%W;circ(x,H-k*80,3,`rgba(255,${120+i*8},40,${1-k})`,0);}for(let x=0;x<W;x+=50)ell(x+25,H-20,30,14,'#2b2420',2);ctx.restore();}
      else if(B.phase===1){ctx.save();ctx.beginPath();ctx.rect(0,GROUND,W,22);ctx.clip();rr(-10,GROUND,W+20,22,0,'#3a3030',3);const o=(L.t*65)%32;for(let x=-32+o;x<W+32;x+=32)poly([[x,GROUND+5],[x+10,GROUND+11],[x,GROUND+17]],C.gold,0);ctx.restore();}
      dw();};},
  onPhase(B,L,i){if(i===2){B.fy=GROUND-260;smoke(L,B.x,GROUND-300,30);}if(i===3){L.collapseT=1.4;B.fy=GROUND-260;smoke(L,B.x,B.fy,30);sfx('crumble');}},
  move(B,dt,L){const t=B.t;if(B.phase<2)B.x=lerp(B.x,750+Math.sin(t*.6)*12,Math.min(1,dt*2));
    else if(B.phase===2){B.x=lerp(B.x,640+Math.sin(t*.45)*200,Math.min(1,dt*1.6));B.fy=lerp(B.fy,200+Math.sin(t*1.1)*60,Math.min(1,dt*1.6));}
    else{B.x=lerp(B.x,620+Math.sin(t*.8)*230,Math.min(1,dt*2.4));B.fy=lerp(B.fy,190+Math.sin(t*1.9)*80,Math.min(1,dt*2.4));}},
  phases:[
    {atk:[{f:'lob',every:2.4,from:'hand',n:2,spr:'carbon',r:16,bounce:1,parry:3},{f:'aimed',every:2.2,from:'mouth',n:3,spread:.25,spd:330,spr:'brasa',r:12,parry:4},{f:'minion',every:4.5,from:'stove',ai:'walker',skin:'hollinito',hp:3,r:20,max:2,spd:140}]},
    {banner:'¡A LA CALDERA!',atk:[{f:'wave',every:2.6,from:'door',spd:400,h:48},{f:'spiral',every:3.6,from:'door',dur:1.4,rate:.09,spd:230,spr:'brasa',r:11,arms:2,parry:6},{f:'column',every:3.4,n:2,gap:.5,style:'fire',warn:.8,act:.45,w:46,spread:150}]},
    {banner:'¡HUMO NEGRO!',atk:[{f:'aimed',every:2.2,from:'mouth',n:2,spread:.4,spd:210,spr:'humo',r:16,turn:1.6,life:5,parry:3},{f:'ring',every:3.2,from:'center',n:10,spd:200,spr:'carbon',r:12,parry:5},{f:'spiral',every:4.2,from:'center',dur:1.4,rate:.1,spd:200,spr:'orb',r:10,arms:2}]},
    {banner:'¡ÚLTIMA BRASA!',atk:[{f:'rain',every:2.2,n:4,spr:'brasa',r:12,spd:[280,420],parry:5},{f:'spiral',every:3.6,from:'center',dur:1.6,rate:.09,spd:240,spr:'brasa',r:11,arms:2,parry:7},{f:'aimed',every:2.2,from:'mouth',n:4,spread:.2,spd:360,spr:'brasa',r:12,parry:4}]}],
  draw(B,L){const t=B.t,x=B.x,g=GROUND;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    const smokeBody=(cx,cy,s,dark)=>{for(let i=0;i<9;i++){const a=i*TAU/9+t*.8,r=s*(.55+.12*Math.sin(t*3+i));circ(cx+Math.cos(a)*s*.42,cy+Math.sin(a)*s*.5,r*.62,dark?'#1f1a1e':'#2f2a2e',4);}circ(cx,cy,s*.62,dark?'#1f1a1e':'#2f2a2e',0);};
    const coalFace=(cx,cy,s)=>{for(const d of[-1,1]){ell(cx+d*s*.28,cy-s*.12,s*.15,s*.2,'#ff8a2e',3);ell(cx+d*s*.28+2,cy-s*.1,s*.07,s*.1,'#ffe27a',0);line(cx+d*s*.12,cy-s*.36,cx+d*s*.44,cy-s*.3+(B.phase>=2?-6:0),5);}
      ctx.beginPath();ctx.moveTo(cx-s*.4,cy+s*.12);ctx.quadraticCurveTo(cx,cy+s*(B.mouth>0?.6:.42),cx+s*.4,cy+s*.12);ctx.quadraticCurveTo(cx,cy+s*.26,cx-s*.4,cy+s*.12);ctx.fillStyle='#ff7a2e';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
      for(let i=-2;i<=2;i++)rr(cx+i*s*.13-s*.05,cy+s*.14,s*.1,s*.09,2,'#f4ead6',1.5);};
    const hat=(cx,cy,s)=>{rr(cx-s*.32,cy-s*.95,s*.64,s*.55,4,'#1b1416',4);rr(cx-s*.5,cy-s*.44,s,s*.1,4,'#1b1416',4);rr(cx-s*.32,cy-s*.6,s*.64,s*.08,0,'#8a2a20',0);
      for(let i=0;i<3;i++){const k=(t*.7+i/3)%1;circ(cx+Math.sin(t*2+i)*10,cy-s*.95-k*90,10+k*16,`rgba(60,52,58,${.8-k*.7})`,0);}};
    if(B.phase<2){const sq=1+Math.sin(t*2)*.02;shadowE(x,g+3,170,.35);
      for(const d of[-1,1])rr(x+d*110-12,g-30,24,30,4,'#2b2420',3);rr(x-140,g-220,280,196,18,'#3a3036',6);rr(x-150,g-236,300,26,10,'#2b2420',5);
      const open=B.phase===1?1:B.mouth>0?.5:0;rr(x-80,g-160,160,110,12,'#1b1416',4);if(open>0){const gr=ctx.createRadialGradient(x,g-100,10,x,g-100,90);gr.addColorStop(0,'#ffe27a');gr.addColorStop(1,'#e8402e');rr(x-72,g-152,144,94*open,10,gr,0);
        for(let i=0;i<5;i++){const fl=1+Math.sin(t*14+i)*.2;ctx.beginPath();ctx.moveTo(x-60+i*30,g-60);ctx.quadraticCurveTo(x-50+i*30,g-60-50*fl*open,x-40+i*30,g-60);ctx.fillStyle='#ffd35a';ctx.fill();}}
      for(let i=0;i<4;i++)line(x-80+i*53,g-160,x-80+i*53,g-50,3,'rgba(20,13,8,.6)');for(const d of[-1,1])circ(x+d*112,g-200,8,C.brass,2.5);
      ctx.save();ctx.translate(x,g-310);ctx.scale(1/sq,sq);ctx.translate(-x,-(g-310));
      for(const s of[-1,1]){const hx=x+s*130,hy=g-330+Math.sin(t*3+s)*14+(s<0&&B.throwT>0?-50:0);ctx.beginPath();ctx.moveTo(x+s*50,g-300);ctx.quadraticCurveTo(x+s*100,g-290,hx,hy);ctx.lineWidth=18;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=12;ctx.strokeStyle='#2f2a2e';ctx.stroke();glove(hx,hy,15);}
      smokeBody(x,g-300,124,false);coalFace(x,g-300,124);hat(x,g-338,112);ctx.restore();flashOver(B,x,g-300,110);koStars(B,L,x,g-440);}
    else if(B.phase===2){const y=B.fy;smokeBody(x,y,190,true);for(let i=0;i<6;i++){const a=i*TAU/6+t,len=60+Math.sin(t*3+i)*20;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*90,y+Math.sin(a)*90);ctx.quadraticCurveTo(x+Math.cos(a+.4)*(110+len),y+Math.sin(a+.4)*(110+len),x+Math.cos(a+.8)*(90+len*1.5),y+Math.sin(a+.8)*(90+len*1.5));ctx.lineWidth=14;ctx.strokeStyle='rgba(31,26,30,.85)';ctx.stroke();}
      coalFace(x,y,190);hat(x,y-60,170);flashOver(B,x,y,110);koStars(B,L,x,y-140);}
    else{const y=B.fy,pul=1+Math.sin(t*12)*.08;for(let i=0;i<5;i++){const a=i*TAU/5-t*2;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(a)*80,y+Math.sin(a)*80,x+Math.cos(a+.6)*120,y+Math.sin(a+.6)*120);ctx.lineWidth=10;ctx.strokeStyle='rgba(47,42,46,.8)';ctx.stroke();}
      const gr=ctx.createRadialGradient(x,y,6,x,y,70*pul);gr.addColorStop(0,'#fff3b0');gr.addColorStop(.4,'#ff8a2e');gr.addColorStop(1,'#a8321e');ctx.beginPath();ctx.arc(x,y,56*pul,0,TAU);ctx.fillStyle=gr;ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();
      coalFace(x,y+4,90);hat(x,y-28,90);if(Math.floor(t*8)%2)for(let i=0;i<2;i++)ell(x+(i?24:-24),y+6,3,5,'#8ecbe6',0);flashOver(B,x,y,60);koStars(B,L,x,y-90);}
    ctx.restore();}});
