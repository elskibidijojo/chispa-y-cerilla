'use strict';
/* ================= PULIDO: more cartoon feel for the heroes =================
   - when a hero dies, the hero itself turns into a little ghost and floats up
   - EX and Super have their own wind-up poses (different per hero, coloured by skin)
   - falling into a pit: you take a hit and pop back up, blinking, instead of being moved back
   - a more detailed little plane, and four new Supers
   - fixes: weapons, charms and supers added after the shop was built now show up in the shop */

const HERO_COL={chispa:'#ffe27a',cerilla:'#ff9a3c',velita:'#c9a2ff'};
function heroCol(ch,skin){const sk=skin&&typeof SKINS!=='undefined'&&SKINS[skin];return(sk&&sk.tcol)||HERO_COL[ch]||'#ffe27a';}
const nowT=()=>typeof clock!=='undefined'?clock:0;

/* ---------- poses: called by drawHero before the body is drawn ---------- */
function heroPoseT(o){const ch=o.char||'chispa',col=heroCol(ch,o.skin),f=o.face||1,t=nowT();
  if(o.superPose>0){const u=1-o.superPose/.55;
    /* sunburst behind the hero */
    ctx.save();ctx.filter='none';ctx.translate(0,-50);ctx.rotate(t*1.4);const R=50+Math.min(1,u*2.2)*150;ctx.globalAlpha=.6*Math.min(1,u*4);
    for(let i=0;i<18;i++){ctx.rotate(TAU/18);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(R,-R*.11);ctx.lineTo(R,R*.11);ctx.closePath();ctx.fillStyle=i%2?col:'#fff6d8';ctx.fill();}
    ctx.globalAlpha=Math.min(1,u*3);
    if(ch==='chispa'){ctx.strokeStyle=col;ctx.lineWidth=3;for(let i=0;i<5;i++){const a=i*TAU/5+t*3;ctx.beginPath();let r=34;ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);for(let k=1;k<5;k++){r+=14;const j=(k%2?.25:-.25);ctx.lineTo(Math.cos(a+j)*r,Math.sin(a+j)*r);}ctx.stroke();}}
    else if(ch==='cerilla'){for(let i=0;i<9;i++){const a=i*TAU/9-t*2,r=58+Math.sin(t*9+i)*8;ctx.beginPath();ctx.ellipse(Math.cos(a)*r,Math.sin(a)*r,6,11,a+Math.PI/2,0,TAU);ctx.fillStyle=i%2?'#ffd35a':'#f08a2e';ctx.fill();}}
    else{for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,40+i*22+Math.sin(t*6+i)*4,0,TAU);ctx.lineWidth=3;ctx.strokeStyle=`rgba(201,162,255,${.7-i*.2})`;ctx.stroke();}}
    ctx.restore();
    if(u<.35){const k=u/.35;ctx.scale(1+k*.3,1-k*.28);o.aimX=0;o.aimY=1;}
    else{const k=Math.min(1,(u-.35)/.15),w=Math.sin(t*44)*.03;ctx.translate(0,-k*16);ctx.scale(1-k*.12+w,1+k*.24-w);o.aimX=0;o.aimY=-1;o.flameK=1+k*1.9;o.flash=true;o.shoot=true;}
    o.run=false;o.air=false;}
  else{const k=o.exPose/.3,ax=o.aimX??f,ay=o.aimY||0;ctx.translate(ax*12*k,ay*10*k);ctx.rotate((ax>=0?1:-1)*.2*k*(ay?0:1));ctx.scale(1+.24*k,1-.18*k);o.flameK=1+.7*k;o.flash=true;}}
/* the EX blast at the hand: lightning for Chispa, flame petals for Cerilla, wisps for Velita */
function heroExFx(o,hx,hy,ax,ay,ch){const k=o.exPose/.3,col=heroCol(ch,o.skin),t=nowT();ctx.save();ctx.filter='none';ctx.translate(hx+ax*16,hy+ay*16);
  const r=12+(1-k)*30;ctx.globalAlpha=Math.min(1,k*1.6);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.lineWidth=5*k+1;ctx.strokeStyle=col;ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();
  if(ch==='chispa'){ctx.strokeStyle='#fffbe6';ctx.lineWidth=3;for(let i=0;i<6;i++){const a=i*TAU/6+t*9;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.6,Math.sin(a)*r*.6);ctx.lineTo(Math.cos(a+.3)*r*1.1,Math.sin(a+.3)*r*1.1);ctx.lineTo(Math.cos(a-.1)*r*1.5,Math.sin(a-.1)*r*1.5);ctx.stroke();}}
  else if(ch==='cerilla'){for(let i=0;i<7;i++){const a=i*TAU/7+t*5;ctx.beginPath();ctx.ellipse(Math.cos(a)*r,Math.sin(a)*r,4+3*k,9+6*k,a+Math.PI/2,0,TAU);ctx.fillStyle=i%2?'#ffd35a':col;ctx.fill();}}
  else{for(let i=0;i<4;i++){const a=i*TAU/4+t*6;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(Math.cos(a)*r*1.4,Math.sin(a)*r*1.4,Math.cos(a+1)*r*1.2,Math.sin(a+1)*r*1.2);ctx.lineWidth=4;ctx.strokeStyle='rgba(225,205,255,.9)';ctx.stroke();}}
  star(0,0,10+8*k,5,6,t*20);ctx.fillStyle='#fffbe6';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}

/* ---------- the hero's own little ghost ---------- */
drawGhost=function(char,x,y,t,skin,type){const glow={cerilla:'255,170,120',velita:'200,150,255'}[char]||'159,240,230';
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*2.2)*.09);
  const g=ctx.createRadialGradient(0,-14,4,0,-14,78);g.addColorStop(0,`rgba(${glow},.5)`);g.addColorStop(1,`rgba(${glow},0)`);ctx.fillStyle=g;ctx.fillRect(-80,-94,160,160);
  /* turquoise dashed ring: a friend parries it to bring you back */
  ctx.globalAlpha=.55+.25*Math.sin(t*10);ctx.beginPath();ctx.arc(0,-16,46+Math.sin(t*10)*3,0,TAU);ctx.setLineDash([8,7]);ctx.lineDashOffset=-t*40;ctx.lineWidth=3;ctx.strokeStyle=C.parry;ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
  /* wispy tail where the legs were */
  ctx.save();ctx.globalAlpha=.75;const sw=Math.sin(t*5)*9;ctx.beginPath();ctx.moveTo(-15,-6);ctx.bezierCurveTo(-20,16,-4+sw,24,4+sw*1.3,50);ctx.bezierCurveTo(6+sw*.4,30,18,14,15,-6);ctx.closePath();
  ctx.fillStyle='#eef9ff';ctx.fill();ctx.lineWidth=2.4;ctx.strokeStyle='rgba(20,13,8,.55)';ctx.stroke();ctx.restore();
  for(let i=1;i<5;i++){ctx.globalAlpha=.45-i*.09;circ(Math.sin(t*3-i)*8+sw*.3,46+i*10,4-i*.6,'#fff7d0',0);}ctx.globalAlpha=1;
  /* the hero, see-through and pale, eyes closed, arms floating up */
  drawHero({x:0,y:18,char,face:1,anim:t,noLegs:true,ghostFace:true,ghost:true,skin,aimX:Math.sin(t*3)*.3,aimY:-.95,scale:.9});
  /* halo */
  ctx.beginPath();ctx.ellipse(0,-84-Math.sin(t*4)*2,16,4.5,0,0,TAU);ctx.lineWidth=5;ctx.strokeStyle='rgba(255,226,122,.5)';ctx.stroke();ctx.lineWidth=2.5;ctx.strokeStyle=C.gold;ctx.stroke();
  ctx.restore();};

/* ---------- the little plane, with more moving parts ---------- */
function planePilot(cer,vel,t){
  if(cer){rr(-6,-28,10,15,3,C.match,2.5);ell(-2,-33,10,9,C.matchHead,2.6);const fl=1+Math.sin(t*20)*.08;ctx.beginPath();ctx.moveTo(-7,-39);ctx.quadraticCurveTo(-6,-54*fl,-1,-58*fl+Math.sin(t*20)*2);ctx.quadraticCurveTo(7,-50*fl,4,-39);ctx.fillStyle='#ffb35a';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();
    rr(-10,-37,18,5,2,'#3a2a20',0);circ(-4,-34.5,3.4,'#bfe3f0',1.8);circ(4,-34.5,3.4,'#bfe3f0',1.8);ctx.beginPath();ctx.arc(1,-28,3,.2,Math.PI-.2);ctx.lineWidth=1.8;ctx.strokeStyle=C.white;ctx.stroke();}
  else if(vel){rr(-8,-36,15,24,3,'#f4ead6',2.5);ctx.beginPath();ctx.moveTo(-4,-38);ctx.quadraticCurveTo(-3,-52,1,-56+Math.sin(t*20)*2);ctx.quadraticCurveTo(6,-48,3,-38);ctx.fillStyle='#d6b8ff';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();
    rr(-10,-32,19,5,2,'#5b3f80',0);circ(-3,-29.5,3.4,'#e9d5ff',1.8);circ(5,-29.5,3.4,'#e9d5ff',1.8);ctx.beginPath();ctx.arc(1,-22,3,.2,Math.PI-.2);ctx.lineWidth=1.8;ctx.strokeStyle=C.ink;ctx.stroke();}
  else{const gr=ctx.createRadialGradient(-5,-26,2,-2,-22,14);gr.addColorStop(0,'#fffbe6');gr.addColorStop(1,C.glass);ctx.beginPath();ctx.arc(-2,-22,13,0,TAU);ctx.fillStyle=gr;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.fillStyle=C.steel;ctx.fillRect(-8,-12,11,6);ctx.strokeRect(-8,-12,11,6);rr(-14,-28,24,6,2,'#3a2a20',0);circ(-4,-25,4,'#bfe3f0',1.8);circ(5,-25,4,'#bfe3f0',1.8);
    ctx.beginPath();ctx.arc(1,-17,3.2,.2,Math.PI-.2);ctx.lineWidth=1.8;ctx.strokeStyle=C.ink;ctx.stroke();}}
drawPlaneHero=function(o){const t=o.anim||0,cer=o.char==='cerilla',vel=o.char==='velita';
  if(o.meteor){drawMeteorHero(o,true);return;}
  const pal=cer?{body:'#e8efe0',wing:'#2e8f86',wingD:'#1f6b64',trim:C.brass,scarf:C.brass}:vel?{body:'#f1e8f6',wing:'#7d5aa6',wingD:'#5b3f80',trim:'#d6b8ff',scarf:'#e9d5ff'}:{body:C.paper,wing:C.rust,wingD:C.rustD,trim:C.brass,scarf:C.rust};
  ctx.save();ctx.translate(o.x,o.y);const sk=o.skin&&typeof SKINS!=='undefined'&&SKINS[o.skin];if(sk&&sk.filter)ctx.filter=sk.filter;if(sk&&sk.alpha)ctx.globalAlpha*=sk.alpha;
  const s=o.small?.55:1;ctx.scale(s,s);ctx.translate(0,Math.sin(t*6)*2.2);ctx.rotate(clamp(o.tilt||0,-.35,.35));
  const st=clamp(Math.abs(o.vx||0)/330,0,1);ctx.scale(1+st*.07,1-st*.05);
  if(o.hurt){const w=Math.sin(t*70)*.12;ctx.scale(1+w,1-w);}
  if(o.exPose>0){const k=o.exPose/.3;ctx.translate(-16*k,0);ctx.scale(1-.16*k,1+.14*k);}
  if(o.superPose>0){const u=1-o.superPose/.55,col=heroCol(o.char,o.skin);ctx.save();ctx.filter='none';ctx.rotate(t*1.4);ctx.globalAlpha=.55*Math.min(1,u*4);const R=40+u*130;
    for(let i=0;i<16;i++){ctx.rotate(TAU/16);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(R,-R*.12);ctx.lineTo(R,R*.12);ctx.closePath();ctx.fillStyle=i%2?col:'#fff6d8';ctx.fill();}ctx.restore();
    ctx.rotate(u<.6?u/.6*TAU:0);const sc=1+Math.sin(Math.min(1,u)*Math.PI)*.3;ctx.scale(sc,sc);}
  if(o.spin>0)ctx.rotate((1-o.spin/.35)*TAU);
  ctx.lineJoin='round';ctx.lineCap='round';
  /* exhaust puffs and the trailing scarf */
  for(let i=0;i<4;i++){const k=(t*2.6+i/4)%1;ctx.globalAlpha=(1-k)*.55;circ(-40-k*36,7+k*5,3+k*7,'#ffffff',0);}ctx.globalAlpha=1;
  ctx.beginPath();ctx.moveTo(-6,-14);for(let i=1;i<=6;i++)ctx.lineTo(-6-i*8,-12+Math.sin(t*16-i*.9)*(1.5+i*.9)-i*.4);ctx.lineWidth=7.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=4.5;ctx.strokeStyle=pal.scarf;ctx.stroke();
  /* tail: fin and an elevator that flaps against the climb */
  poly([[-30,-4],[-47,-26],[-41,2]],pal.wing,3);line(-41,-18,-36,-6,2,'rgba(255,255,255,.5)');
  ctx.save();ctx.translate(-40,5);ctx.rotate(-(o.tilt||0)*1.6);ell(0,0,11,3.6,pal.wingD,2.5);ctx.restore();
  /* back wing */
  ell(-2,13,30,6.5,pal.wingD,3);
  /* fuselage with a stripe and rivets */
  const fus=()=>{ctx.beginPath();ctx.moveTo(-37,-2);ctx.bezierCurveTo(-30,-17,24,-17,35,-4);ctx.bezierCurveTo(39,5,30,15,10,15);ctx.bezierCurveTo(-10,15,-33,10,-37,-2);ctx.closePath();};
  fus();ctx.fillStyle=pal.body;ctx.fill();ctx.save();fus();ctx.clip();ctx.fillStyle=pal.wing;ctx.fillRect(4,-20,9,40);ctx.fillStyle='rgba(255,255,255,.45)';ctx.beginPath();ctx.ellipse(-6,-8,22,4,-.05,0,TAU);ctx.fill();
  ctx.fillStyle='rgba(20,13,8,.12)';ctx.fillRect(-40,7,80,10);ctx.restore();fus();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();
  for(let i=0;i<5;i++)circ(-24+i*10,7,1.2,'rgba(20,13,8,.55)',0);
  /* cockpit, pilot with goggles */
  ell(-2,-12,15,4.5,C.woodD,2.5);ctx.save();ctx.translate(-2,0);planePilot(cer,vel,t);ctx.restore();ell(-2,-11,15,3.5,null,2.5);
  /* front wing with a roundel */
  ctx.save();ctx.translate(-4,2);ctx.rotate(-.04);rr(-24,-3,48,9,4.5,pal.wing,3);circ(4,1.5,4,pal.trim,2);circ(4,1.5,1.6,pal.body,0);ctx.restore();
  /* nose cowl and spinning propeller */
  ell(33,0,7,11.5,pal.trim,3);ell(43,0,3.5,19,'rgba(255,255,255,.18)',0);
  for(const b of[0,Math.PI]){const k=Math.sin(t*55+b);ell(43,k*9.5,2.6,Math.abs(k)*9+1.6,C.woodD,1.8);}
  poly([[38,-4.5],[49,0],[38,4.5]],C.steel,2);
  /* little wheels */
  line(-6,14,-10,22,2.5);circ(-10,23,4,C.ink,0);circ(-10,23,1.6,C.steel,0);
  if(o.flash){ctx.save();ctx.translate(52,5);ctx.rotate(t*30);star(0,0,10,4,5);ctx.fillStyle='#ffe27a';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
  if(o.exPose>0){const k=o.exPose/.3;ctx.globalAlpha=k;circ(50,0,10+(1-k)*24,null,0);ctx.beginPath();ctx.arc(50,0,10+(1-k)*24,0,TAU);ctx.lineWidth=4;ctx.strokeStyle=heroCol(o.char,o.skin);ctx.stroke();ctx.globalAlpha=1;}
  ctx.restore();};

/* ---------- meteor form (Super "Cometa Ardiente") ---------- */
function drawMeteorHero(o,plane){const m=o.meteor,col=heroCol(o.char,o.skin),t=nowT(),dir=m.dir||1,x=o.x,y=plane?o.y:o.y-40;ctx.save();ctx.translate(x,y);ctx.scale(dir,1);
  for(let i=0;i<7;i++){const k=i/7;ctx.globalAlpha=.75-k*.6;ctx.beginPath();ctx.ellipse(-30-k*90,Math.sin(t*30+i)*6,34-k*20,22-k*12,0,0,TAU);ctx.fillStyle=i%2?col:'#ff7a2e';ctx.fill();}
  ctx.globalAlpha=1;const g=ctx.createRadialGradient(0,0,4,0,0,34);g.addColorStop(0,'#fffbe6');g.addColorStop(.5,col);g.addColorStop(1,'#e8562e');ctx.beginPath();ctx.arc(0,0,30,0,TAU);ctx.fillStyle=g;ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.fillStyle=C.ink;for(const d of[-7,7])ell(8+d*.4,-6+d*0,3,6,C.ink,0);ctx.beginPath();ctx.arc(10,6,7,.1,Math.PI-.1);ctx.lineWidth=2.6;ctx.stroke();ctx.restore();}

/* ---------- pits: a hit, a pop back up, a moment of blinking ---------- */
pitFall=function(L,p){if(p.dead)return;const safe=p.inv>0;
  if(!safe){p.hp--;L.hits++;shake(L,10);L.flash=Math.max(L.flash,.15);sfx('hurt');}
  p.y=H+60;p.vy=-1580;p.ground=false;p.groundRef=null;p.jumped=false;p.dash=0;p.inv=Math.max(p.inv,2.2);p.hurtT=.35;p.airDash=true;p.airJumps=hasCharm(p,'muelle')?1:0;p.parryTried=false;
  for(let i=0;i<8;i++)L.fx.push({k:'puff',x:p.x+(rand()-.5)*60,y:H-6,vx:(rand()-.5)*200,vy:-120-rand()*200,life:.5,max:.5,r:8+rand()*8,col:C.paper});
  if(!safe)pop(L,p.x,H-70,'¡AY!',C.rust);sfx('boing');
  if(p.hp<=0){p.y=H-60;kill(L,p);if(p.ghost){p.ghost.y=H-80;}}};

/* ---------- pose timers, EX/Super triggers ---------- */
const _levelUpdatePol=levelUpdate;
levelUpdate=function(L,dt,IN){for(const p of L.Ps){if(p.exPose>0)p.exPose=Math.max(0,p.exPose-dt);if(p.superPose>0)p.superPose=Math.max(0,p.superPose-dt);}_levelUpdatePol(L,dt,IN);};
const _tryEXPol=tryEX;
tryEX=function(L,p,h){const n=L.exs;_tryEXPol(L,p,h);if(L.exs>n){p.exPose=.3;L.freeze=Math.max(L.freeze,.05);}};

/* ---------- four new Supers ---------- */
Object.assign(SUPERS,{
  martillo:{name:'Mazazo Gigante',price:5,isl:4,desc:'Un mazo enorme cae delante de ti, aplasta lo que haya y suelta dos ondas por el suelo.'},
  clon:{name:'Doble Sombra',price:5,isl:4,desc:'Tu sombra sale a ayudarte y dispara contigo durante seis segundos.'},
  helada:{name:'Gran Helada',price:6,isl:4,desc:'Congela las balas y al enemigo durante tres segundos. Mientras está congelado recibe más daño. Se gana en el Mausoleo de la Escarcha.'},
  meteoro:{name:'Cometa Ardiente',price:6,isl:4,desc:'Te conviertes en un cometa de fuego, te estrellas contra el enemigo y lo quemas un buen rato.'}});
const NEW_SUP=['martillo','clon','helada','meteoro'];
const allHit=L=>new Set(L.ents);
function superMartillo(L,p){const plane=p.type==='plane',d=plane?1:p.face,col=heroCol(p.char,p.eq.skin);let hx=p.x+d*(plane?150:170),fy;
  let best=null,bd=1e9;for(const e of L.ents){if(e.dead||e.hidden)continue;const c=e.center?e.center():{x:e.x,y:e.y},dx=(c.x-p.x)*d;if(dx>40&&dx<720&&dx<bd){bd=dx;best=c;}}
  if(best)hx=clamp(best.x,p.x+d*120,p.x+d*720);hx=L.kind==='run'?clamp(hx,L.camX+60,L.camX+W-60):clamp(hx,60,W-60);
  fy=plane?(best?best.y+70:p.y+40):(L.floorAt?Math.min(L.floorAt(hx),GROUND):GROUND);if(!isFinite(fy))fy=GROUND;
  B_(L,p,{x:hx,y:fy,vx:0,vy:0,r:1,dmg:0,life:1.05,pierce:true,k:'mallet',t:0,d,col,
    upd(b,L,dt){b.hits=allHit(L);b.t+=dt;b.vx=0;b.vy=0;if(b.t>=.26&&!b.done){b.done=true;shake(L,24);L.flash=Math.max(L.flash,.15);sfx('stomp');sfx('boom');pop(L,b.x,b.y-150,'¡PUM!',col);
      for(const e of L.ents){if(e.dead)continue;let hit=false;for(let k=0;k<6&&!hit;k++)for(let j=-2;j<=2&&!hit;j++)if(e.hitBy(b.x+j*55,b.y-20-k*45,30))hit=true;if(hit){e.damage(40*dmgM(p),p);gain(p,8);boom(L,b.x,b.y-40,60);}}
      for(const e of L.eb)if(!e.dead&&destroyable(e)&&Math.abs(e.x-b.x)<170&&e.y>b.y-300)e.dead=true;
      for(let i=0;i<14;i++)L.fx.push({k:'puff',x:b.x+(rand()-.5)*200,y:b.y-4,vx:(rand()-.5)*420,vy:-60-rand()*220,life:.6,max:.6,r:10+rand()*10,col:C.paper});
      if(!plane)for(const s of[-1,1])B_(L,p,{x:b.x+s*70,y:b.y-26,vx:s*760,vy:0,r:28,dmg:6.5,life:1.15,pierce:true,k:'shock',col,
        draw(b2){ctx.save();ctx.translate(b2.x,b2.y+26);ctx.scale(Math.sign(b2.vx),1);for(let i=0;i<3;i++){ctx.globalAlpha=.85-i*.25;ctx.beginPath();ctx.moveTo(-30-i*26,0);ctx.quadraticCurveTo(-10-i*26,-58+i*12,14-i*26,0);ctx.closePath();ctx.fillStyle=i?col:'#fff6d8';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}ctx.restore();}});}},
    draw(b){const k=Math.min(1,b.t/.26),e=k*k,ang=-1.7*(1-e),fade=b.t>.8?Math.max(0,1-(b.t-.8)/.25):1;ctx.save();ctx.globalAlpha=fade;ctx.translate(b.x-b.d*140,b.y-30);ctx.scale(b.d,1);ctx.rotate(ang);
      rr(0,-8,150,16,6,C.woodL,4);line(20,-8,20,8,2);line(40,-8,40,8,2);ctx.translate(150,0);rr(-36,-58,72,116,14,b.col,5);rr(-36,-58,72,20,8,C.steel,4);rr(-36,38,72,20,8,C.steel,4);
      ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(-24,-34,10,66);ctx.restore();
      if(b.done&&b.t<.5){ctx.save();ctx.globalAlpha=1-(b.t-.26)/.24;star(b.x,b.y-30,90,40,10,b.t*4);ctx.fillStyle='#fff6d8';ctx.fill();ctx.restore();}}});}
function superClon(L,p){const plane=p.type==='plane';sfx('magic');smoke(L,p.x,p.y-30,14);
  B_(L,p,{x:p.x-(plane?60:p.face*60),y:p.y-(plane?40:0),vx:0,vy:0,r:1,dmg:0,life:6.2,pierce:true,k:'clone',cd:.3,t:0,
    upd(b,L,dt){b.hits=allHit(L);b.t+=dt;const o=b.own;if(o.dead){b.life=0;return;}const pl=o.type==='plane',tx=o.x-(pl?50:o.face*64),ty=pl?o.y-46:o.y-4;b.x+=(tx-b.x)*Math.min(1,dt*8);b.y+=(ty-b.y)*Math.min(1,dt*8);b.vx=0;b.vy=0;
      b.cd-=dt;if(b.cd<=0){b.cd=.11;const c0=pl?{x:b.x+30,y:b.y}:{x:b.x+o.face*24,y:b.y-46},t=nearestEnt(L,c0.x,c0.y);const tc=t?nearPt(t,c0.x,c0.y):{x:c0.x+(pl?1:o.face)*400,y:c0.y},a=Math.atan2(tc.y-c0.y,tc.x-c0.x);
        B_(L,o,{x:c0.x,y:c0.y,vx:Math.cos(a)*1000,vy:Math.sin(a)*1000,r:8,dmg:.95,life:1.2,k:'chispa'});sfx('shot','chispa');}
      if(b.life<.25&&!b.bye){b.bye=true;smoke(L,b.x,b.y-30,10);}},
    draw(b){const o=b.own,pl=o.type==='plane',fade=Math.min(1,b.t*4,b.life*4);ctx.save();ctx.globalAlpha=.78*fade;ctx.filter='brightness(.25) sepia(1) hue-rotate(210deg) saturate(2.5)';
      if(pl)drawPlaneHero({x:b.x,y:b.y,char:o.char,anim:nowT(),tilt:0,flash:b.cd<.05});else drawHero({x:b.x,y:b.y,char:o.char,face:o.face,anim:nowT(),shoot:true,aimX:o.face,aimY:0,flash:b.cd<.05});
      ctx.restore();ctx.save();ctx.globalAlpha=.4*fade;for(let i=0;i<3;i++){const a=nowT()*4+i*2.1;circ(b.x+Math.cos(a)*26,b.y-(pl?0:50)+Math.sin(a)*30,3,'#c9a2ff',0);}ctx.restore();}});}
function freezeEnt(e,T){if(!e||e.dead)return;e.frozenT=T;if(!e._iceDmg){e._iceDmg=true;const d0=e.damage;e.damage=(d,by)=>d0(e.frozenT>0?d*1.3:d,by);}}
function superHelada(L,p){let n=0;for(const e of L.eb)if(!e.dead&&destroyable(e)){e.dead=true;n++;L.fx.push({k:'spark',x:e.x,y:e.y,vx:(rand()-.5)*200,vy:-100-rand()*100,life:.5,max:.5,r:5,col:'#cfefff'});}
  for(const e of L.ents){if(e.dead||e.hidden)continue;const c=e.center?e.center():{x:e.x,y:e.y};if(Math.abs(c.x-(L.camX+W/2))>W*.7)continue;freezeEnt(e,3.2);e.damage(17*dmgM(p),p);}
  L.iceFlash=1;sfx('ding');sfx('crack');shake(L,10);
  if(!L._iceDraw){L._iceDraw=true;const dw=L.drawWorld;L.drawWorld=()=>{dw&&dw();drawIce(L);};}}
function drawIce(L){if(L.iceFlash>0){ctx.save();ctx.globalAlpha=L.iceFlash*.5;ctx.fillStyle='#dff4ff';ctx.fillRect(L.camX,0,W,H);ctx.restore();}
  for(const e of L.ents){if(!(e.frozenT>0)||e.dead)continue;const a=Math.min(1,e.frozenT*2),sh=e.shapes?e.shapes():[{x:e.x,y:e.y,r:e.r||20}];ctx.save();ctx.globalAlpha=.42*a;
    for(const s of sh){if(s.w!==undefined){rr(s.x,s.y,s.w,s.h,10,'rgba(170,225,255,.8)',3);}else{circ(s.x,s.y,s.r+6,'rgba(170,225,255,.8)',3);}}
    ctx.globalAlpha=.9*a;const c=e.center?e.center():{x:e.x,y:e.y};for(let i=0;i<6;i++){const an=i*TAU/6+.3,r=(sh[0].r||60)*.8;ctx.save();ctx.translate(c.x+Math.cos(an)*r,c.y+Math.sin(an)*r);ctx.rotate(an);poly([[-6,0],[0,-22],[6,0],[0,8]],'#eaf8ff',2);ctx.restore();}
    ctx.restore();}}
function superMeteoro(L,p){p.meteor={t:1.3,dir:p.type==='plane'?1:p.face,state:'fly',burn:0,hit:new Set(),tick:0};p.inv=Math.max(p.inv,1.6);sfx('fire');sfx('whistleUp');}
function meteorTick(L,p,dt){ptimers(p,dt);const m=p.meteor,pl=p.type==='plane';m.t-=dt;p.inv=Math.max(p.inv,.4);p.vx=0;p.vy=0;const cy=pl?p.y:p.y-40;
  if(rand()<.8)L.fx.push({k:'spark',x:p.x-m.dir*20,y:cy+(rand()-.5)*30,vx:-m.dir*200,vy:(rand()-.5)*80,life:.35,max:.35,r:4+rand()*4,col:rand()<.5?'#ffb35a':heroCol(p.char,p.eq.skin)});
  for(const e of L.eb)if(!e.dead&&destroyable(e)&&dist(e.x,e.y,p.x,cy)<60)e.dead=true;
  if(m.state==='fly'){p.x+=m.dir*1250*dt;
    for(const e of L.ents){if(e.dead||m.hit.has(e)||!e.hitBy(p.x+m.dir*20,cy,34))continue;if(e.boss){m.state='burn';m.burn=.75;m.target=e;sfx('boom');shake(L,14);boom(L,p.x,cy,50);break;}m.hit.add(e);e.damage(12*dmgM(p),p);boom(L,e.x,e.y,30);}
    const lo=L.kind==='run'?L.camX+20:30,hi=L.kind==='run'?L.camX+W-20:W-40;if(p.x<lo||p.x>hi||m.t<=0){p.x=clamp(p.x,lo,hi);m.state='end';}}
  else if(m.state==='burn'){m.burn-=dt;m.tick-=dt;p.x+=Math.sin(nowT()*50)*2;if(m.tick<=0){m.tick=.05;if(m.target&&!m.target.dead){m.target.damage(4.2*dmgM(p),p);gain(p,1);}sparks(L,p.x+m.dir*20,cy,3,'#ffb35a');}
    if(m.burn<=0||!m.target||m.target.dead)m.state='end';}
  if(m.state==='end'){p.meteor=null;p.inv=Math.max(p.inv,.8);boom(L,p.x,cy,40);puff(L,p.x,cy,8);if(!pl){p.vy=-560;p.ground=false;p.x-=m.dir*40;}sfx('pop');}}
const _startSuperPol=startSuper;
startSuper=function(L,p){const s=p.eq.sup||'chispazo';
  if(NEW_SUP.includes(s)){p.cards=0;L.supers++;p.superK=s;p.superT=.3;p.inv=Math.max(p.inv,1);L.superFlash=.35;sfx('super');shake(L,12);banner(L,'¡'+SUPERS[s].name.toUpperCase()+'!',1.1);if(typeof unlockAch==='function')unlockAch('super');
    ({martillo:superMartillo,clon:superClon,helada:superHelada,meteoro:superMeteoro})[s](L,p);}
  else _startSuperPol(L,p);
  p.superPose=.55;L.freeze=Math.max(L.freeze||0,.55);sfx('whistleUp');if(typeof ringRestore==='function')ringRestore(L,p);};
const _platUpdatePol=platUpdate;
platUpdate=function(L,p,dt,I){if(p.meteor&&!p.dead){meteorTick(L,p,dt);if(p.meteor)return;}_platUpdatePol(L,p,dt,I);};
const _planeUpdatePol=planeUpdate;
planeUpdate=function(L,p,dt,I){if(p.meteor&&!p.dead){meteorTick(L,p,dt);if(p.meteor)return;}const n=L.exs;_planeUpdatePol(L,p,dt,I);if(L.exs>n){p.exPose=.3;L.freeze=Math.max(L.freeze,.05);}};
/* frozen enemies and bosses stand still */
const _bossUpdatePol=bossUpdate;
bossUpdate=function(L,B,dt){if(L.iceFlash>0)L.iceFlash=Math.max(0,L.iceFlash-dt*2);if(B.frozenT>0){B.frozenT-=dt;B.flash=Math.max(0,B.flash-dt);return;}_bossUpdatePol(L,B,dt);};
const _updEnemiesPol=updEnemies;
updEnemies=function(L,dt){if(!L.ents.some(e=>e.frozenT>0)){_updEnemiesPol(L,dt);return;}const fr=L.ents.filter(e=>e.frozenT>0&&!e.boss);for(const e of fr)e.frozenT-=dt;
  L.ents=L.ents.filter(e=>!fr.includes(e));_updEnemiesPol(L,dt);for(const e of fr)if(!L.ents.includes(e))L.ents.push(e);};
/* draw: dim the world during a Super wind-up, keep the heroes bright */
const _drawPlayersPol=drawPlayers;
drawPlayers=function(L){const sp=L.Ps.some(p=>p.superPose>0);if(sp){const u=Math.max(...L.Ps.map(p=>p.superPose||0))/.55;ctx.save();ctx.globalAlpha=Math.min(.55,(1-u)*2.4)*Math.min(1,u*6);ctx.fillStyle='#120a06';ctx.fillRect(L.camX-40,-40,W+80,H+80);ctx.restore();}
  for(const p of L.Ps)if(p.meteor&&p.type==='plat'&&!p.dead){drawMeteorHero(p,false);}
  const hid=L.Ps.filter(p=>p.meteor&&p.type==='plat');const sv=hid.map(p=>p.dead);for(const p of hid)p.dead=true,p._mHide=true;
  try{_drawPlayersPol(L);}finally{for(const p of hid){if(p._mHide){p.dead=false;p._mHide=false;}}}};

/* ---------- shop shows every weapon, charm, super and skin, also the ones added by later files ---------- */
function refreshShopTabs(){if(typeof SHOP_TABS==='undefined')return;const src=[WEAPONS,CHARMS,SUPERS,SKINS];
  SHOP_TABS.forEach((t,i)=>{for(const k of Object.keys(src[i]))if(!t.ids.includes(k)&&!(i===3&&k==='skin_clasica'))t.ids.push(k);});}
refreshShopTabs();
const _itemIconPol=itemIcon;
itemIcon=function(id,x,y,t){if(!NEW_SUP.includes(id)){_itemIconPol(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  if(id==='martillo'){ctx.rotate(-.5+Math.sin(t*4)*.15);rr(-4,-4,8,30,3,C.woodL,3);rr(-18,-22,36,20,6,C.rust,3);rr(-18,-22,8,20,3,C.steel,0);rr(10,-22,8,20,3,C.steel,0);}
  else if(id==='clon'){ctx.save();ctx.globalAlpha=.6;ctx.filter='brightness(.25) sepia(1) hue-rotate(210deg) saturate(2.5)';drawHero({x:-8,y:24,char:'chispa',face:1,anim:t,scale:.42});ctx.restore();drawHero({x:8,y:24,char:'chispa',face:1,anim:t,scale:.42});}
  else if(id==='helada'){for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*TAU/6+t*.5);line(0,0,0,-22,3,'#7bc4e8');line(0,-14,-6,-19,2.5,'#7bc4e8');line(0,-14,6,-19,2.5,'#7bc4e8');ctx.restore();}circ(0,0,5,'#eaf8ff',2);}
  else{for(let i=0;i<4;i++){ctx.globalAlpha=.8-i*.18;ell(-10-i*8,4+i*2,12-i*2,8-i,i%2?'#ffd35a':'#ff7a2e',0);}ctx.globalAlpha=1;circ(6,0,13,'#ffb35a',3);ell(9,-3,2,4,C.ink,0);ell(14,-3,2,4,C.ink,0);}
  ctx.restore();};
/* every skin tints the EX blast and the Super sunburst its own way */
(function(){const t={skin_pirata:'#e86a5a',skin_gala:'#d9a441',skin_payaso:'#ff5fa2',skin_cine:'#f4f4f4',skin_clasica:null};for(const k in t)if(SKINS[k]&&t[k]&&!SKINS[k].tcol)SKINS[k].tcol=t[k];})();
