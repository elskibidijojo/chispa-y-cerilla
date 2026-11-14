'use strict';
/* ================= ARENAS: platforms, obstacles, phase backdrops, ambience, entrances ================= */
const easeOutBack=t=>{t=clamp(t,0,1);const c=1.9;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
/* platform: x,y,w, skin, mv{ax,ay,sp,ph} (oscillates), drift (px/s, wraps), crumble (falls when stood on), from (phase index it appears in) */
const ARENA_FX={
  cielo:{plats:[{x:90,y:330,w:120,skin:'nube',drift:38},{x:420,y:250,w:120,skin:'nube',drift:38},{x:760,y:300,w:120,skin:'nube',drift:38,from:1}],
    tint:[null,'rgba(255,130,60,.16)','rgba(40,30,100,.34)'],part:['leaves','sparkle','star']},
  teatro:{plats:[{x:60,y:310,w:120,skin:'palco'},{x:330,y:250,w:110,skin:'palco',from:1,mv:{ax:90,ay:0,sp:.9}}],
    tint:[null,'rgba(140,20,50,.14)','rgba(30,0,50,.3)'],part:['note','confetti','confetti']},
  cocina:{plats:[{x:50,y:320,w:140,skin:'estante'},{x:300,y:250,w:120,skin:'estante'},{x:500,y:335,w:100,skin:'pan',crumble:true,from:1}],
    haz:{from:2,every:5.5,xs:[150,400],style:'fire'},tint:[null,'rgba(255,130,40,.12)','rgba(255,60,20,.22)'],part:['steam','steam','ember']},
  juguetes:{plats:[{x:80,y:350,w:92,skin:'bloque'},{x:250,y:290,w:92,skin:'bloque'},{x:380,y:345,w:130,skin:'tren',mv:{ax:120,ay:0,sp:.8},from:1}],
    tint:[null,'rgba(255,200,120,.1)','rgba(60,40,90,.26)'],part:['confetti','confetti','star']},
  playa:{plats:[{x:90,y:345,w:110,skin:'arena',crumble:true},{x:360,y:300,w:110,skin:'arena',crumble:true}],
    tint:[null,'rgba(255,150,80,.16)','rgba(30,40,90,.3)'],part:['bubble','bubble','rain']},
  puerto:{plats:[{x:90,y:335,w:96,skin:'barril',mv:{ax:0,ay:24,sp:1.4}},{x:320,y:280,w:96,skin:'barril',mv:{ax:0,ay:30,sp:1.1,ph:1}},{x:540,y:340,w:96,skin:'barril',mv:{ax:0,ay:20,sp:1.7,ph:2},from:1}],
    tint:[null,'rgba(60,80,120,.18)','rgba(20,25,60,.34)'],part:['bubble','rain','rain']},
  tejados:{plats:[{x:80,y:330,w:90,skin:'chimenea'},{x:300,y:270,w:120,skin:'chimenea',from:1,mv:{ax:0,ay:40,sp:1}}],
    tint:[null,'rgba(70,80,120,.18)','rgba(20,20,50,.32)'],part:['leaves','rain','rain']},
  maquinas:{plats:[{x:90,y:330,w:110,skin:'viga',mv:{ax:0,ay:50,sp:.9}},{x:350,y:270,w:110,skin:'viga',mv:{ax:0,ay:50,sp:.9,ph:Math.PI}}],
    haz:{from:1,every:6,xs:[260,520],style:'steam'},tint:[null,'rgba(255,120,40,.12)','rgba(120,20,10,.24)'],part:['steam','ember','ember']},
  velas:{plats:[{x:80,y:330,w:80,skin:'vela',crumble:true},{x:280,y:280,w:80,skin:'vela',crumble:true},{x:470,y:330,w:80,skin:'vela',crumble:true,from:1}],
    tint:[null,'rgba(120,40,140,.14)','rgba(20,0,30,.36)'],part:['ember','ember','sparkle']},
  biblioteca:{plats:[{x:70,y:330,w:110,skin:'libros'},{x:290,y:260,w:110,skin:'libros',drift:30,from:1}],
    tint:[null,'rgba(80,40,20,.14)','rgba(20,10,40,.3)'],part:['page','page','sparkle']},
  granja:{plats:[{x:80,y:340,w:110,skin:'paja'},{x:320,y:290,w:110,skin:'paja',crumble:true}],
    tint:[null,'rgba(255,120,40,.16)','rgba(20,20,50,.36)'],part:['leaves','leaves','sparkle']},
  oficina:{plats:[{x:70,y:320,w:110,skin:'archivo'},{x:300,y:260,w:120,skin:'archivo',from:1,mv:{ax:80,ay:0,sp:1}}],
    tint:[null,'rgba(60,60,40,.12)','rgba(20,10,30,.3)'],part:['page','page','page']},
  magia:{plats:[{x:90,y:320,w:96,skin:'carta',drift:46},{x:400,y:260,w:96,skin:'carta',drift:46},{x:700,y:330,w:96,skin:'carta',drift:46,from:1}],
    tint:[null,'rgba(120,40,160,.14)','rgba(10,0,40,.34)'],part:['sparkle','star','star']},
  castillo:{plats:[{x:70,y:330,w:110,skin:'piedra',crumble:true},{x:300,y:270,w:110,skin:'piedra',mv:{ax:70,ay:0,sp:.9}},{x:500,y:340,w:100,skin:'piedra',crumble:true,from:1}],
    haz:{from:2,every:6.5,xs:[180,430],style:'darkbolt'},tint:[null,'rgba(60,0,80,.16)','rgba(0,0,0,.34)'],part:['ember','sparkle','ember']},
  plane_dia:{tint:[null,'rgba(255,140,60,.14)','rgba(40,30,100,.3)'],part:['leaves','sparkle','star']},
  plane_mar:{tint:[null,'rgba(40,60,110,.16)','rgba(10,20,50,.32)'],part:['bubble','rain','rain']},
  plane_noche:{tint:[null,'rgba(80,0,60,.16)','rgba(0,0,0,.3)'],part:['star','sparkle','ember']}};

function setupArena(L,B,def,plane){const A=ARENA_FX[def.arena]||{};L.arena=A;L.phaseFade=0;L.bgp=[];L.haz=A.haz?{t:A.haz.every*.6}:null;
  if(!plane&&A.plats)for(const p of A.plats){const s={x:p.x,y:p.y,w:p.w,h:14,oneWay:true,skin:p.skin,x0:p.x,y0:p.y,mv:p.mv||null,drift:p.drift||0,crumble:!!p.crumble,from:p.from||0,
      shake:0,fall:0,vy:0,gone:0,app:p.from?0:1,py:p.y,dx:0};L.solids.push(s);}
  L.plats=L.solids.filter(s=>s.skin);
  if(L.plats.length)L.updSolids=dt=>{for(const s of L.plats){const px=s.x;s.py=s.y;
      if(B.phase<s.from){s.y=99999;s.app=0;continue;}
      if(s.app<1){if(s.app===0){puff(L,s.x0+s.w/2,s.y0,8);sfx('pop');}s.app=Math.min(1,s.app+dt*2.2);}
      if(s.gone>0){s.gone-=dt;s.y=99999;if(s.gone<=0){s.fall=0;s.vy=0;s.shake=0;s.app=.01;s.x=s.x0;}continue;}
      let x=s.x0,y=s.y0;
      if(s.mv){const a=L.t*s.mv.sp+(s.mv.ph||0);x+=Math.sin(a)*s.mv.ax;y+=Math.sin(a)*s.mv.ay;}
      if(s.drift){s.dr=((s.dr||0)+s.drift*dt);x=((s.x0+s.dr+s.w+60)%(W+s.w+120))-s.w-60;}
      if(s.crumble){const on=L.Ps.some(p=>!p.dead&&p.ground&&p.groundRef===s);if(on&&!s.fall){s.shake+=dt;if(s.shake>.12&&Math.floor(s.shake*20)!==Math.floor((s.shake-dt)*20))sfx('crumble');}
        if(s.shake>.6&&!s.fall){s.fall=1;puff(L,x+s.w/2,y,6,C.paper);}if(s.fall){s.vy+=1400*dt;s.fy=(s.fy||0)+s.vy*dt;y+=s.fy;if(y>H+40){s.gone=3;s.fy=0;}}}
      s.x=x;s.y=y;s.dx=s.x-px;if(Math.abs(s.dx)>100)s.dx=0;}};
  for(let i=0;i<26;i++)L.bgp.push({x:rand()*W,y:rand()*H,v:.5+rand(),ph:rand()*TAU,s:.6+rand()*.8});
  const baseBG=L.drawBG;L.drawBG=()=>{baseBG();drawArenaFX(L,B);};
  const baseWorld=L.drawWorld;L.drawWorld=()=>{const it=L.state==='intro'?L.stateT:9;ctx.save();
    if(it<1.3){const k=clamp((it-.15)/1,0,1);if(plane)ctx.translate((1-easeOutBack(k))*560,Math.sin(it*8)*10*(1-k));
      else{ctx.beginPath();ctx.rect(-100,-400,W+200,GROUND+400+(k>=1?300:0));ctx.clip();const c=B.center(),sq=k>.85?1+Math.sin((k-.85)*40)*.06*(1-k)*6:1;
        ctx.translate(0,(1-easeOutBack(k))*(GROUND-c.y+260));ctx.translate(c.x,B.y);ctx.scale(2-sq,sq);ctx.translate(-c.x,-B.y);}}
    else if(B.phaseT>0){const c=B.center(),s=1+Math.sin(B.phaseT*30)*.05*B.phaseT;ctx.translate(c.x,c.y);ctx.scale(s,2-s);ctx.translate(-c.x,-c.y);}
    baseWorld();ctx.restore();
    if(B.phaseT>0){const c=B.center();ctx.save();ctx.globalAlpha=B.phaseT;ctx.beginPath();ctx.arc(c.x,c.y,40+(1-B.phaseT)*260,0,TAU);ctx.lineWidth=10*B.phaseT;ctx.strokeStyle='#fff3c0';ctx.stroke();ctx.restore();}};}
function arenaTick(L,B,dt){if(B.phaseT>0)B.phaseT=Math.max(0,B.phaseT-dt*1.2);L.phaseFade=Math.min(1,(L.phaseFade||0)+dt*.8);
  const A=L.arena;if(L.haz&&A.haz&&B.phase>=A.haz.from&&L.state==='play'){L.haz.t-=dt;if(L.haz.t<=0){L.haz.t=A.haz.every*B.pace;const al=alive(L);
      for(const x of A.haz.xs){if(al.some(p=>Math.abs(p.x-x)<10&&p.inv<=0&&false))continue;spawnEB(L,{k:'column',x,warn:1,act:.5,w:44,style:A.haz.style});}sfx('warn');}}}
function drawArenaFX(L,B){const A=L.arena,ph=B.phase,t=L.t;
  /* phase backdrop change: tint fades in after each phase change */
  const tc=A.tint&&A.tint[ph];if(tc){ctx.save();ctx.globalAlpha=Math.min(1,L.phaseFade);ctx.fillStyle=tc;ctx.fillRect(0,0,W,H);ctx.restore();}
  if(ph>=2){ctx.save();const g=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(60,0,10,${.18+Math.sin(t*3)*.06})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();}
  /* ambient particles change by phase */
  const kind=(A.part||['sparkle'])[Math.min(ph,(A.part||[1]).length-1)];ctx.save();
  for(const p of L.bgp){const ty=kind==='steam'||kind==='ember'||kind==='bubble'||kind==='note'?-1:1,sp=kind==='rain'?520:kind==='leaves'||kind==='page'||kind==='confetti'?50:30;
    const y=((p.y+ty*t*sp*p.v)%(H+40)+H+40)%(H+40)-20,x=(p.x+Math.sin(t*p.v+p.ph)*30+(kind==='rain'?-t*120*p.v:0))%W,xx=(x+W)%W;ctx.globalAlpha=.55;
    switch(kind){
      case 'rain':line(xx,y,xx-6,y+16,1.6,'rgba(200,220,240,.7)');break;
      case 'leaves':ctx.save();ctx.translate(xx,y);ctx.rotate(t*2*p.v+p.ph);ell(0,0,7*p.s,3.5*p.s,'#c4703a',1.5);ctx.restore();break;
      case 'page':ctx.save();ctx.translate(xx,y);ctx.rotate(Math.sin(t*2+p.ph));rr(-6,-8,12,16,1,C.paper,1.5);ctx.restore();break;
      case 'confetti':ctx.save();ctx.translate(xx,y);ctx.rotate(t*3+p.ph);ctx.fillStyle=['#e86a5a','#f2c14e','#7bb7c9','#b8d08a'][Math.floor(p.ph*3)%4];ctx.fillRect(-4,-2,8,4);ctx.restore();break;
      case 'steam':circ(xx,y,10*p.s+4,'rgba(255,255,255,.22)',0);break;
      case 'ember':circ(xx,y,2.5*p.s,`rgba(255,${150+Math.floor(p.ph*30)},60,.9)`,0);break;
      case 'bubble':circ(xx,y,5*p.s,null,1.5);break;
      case 'note':ctx.font=`${14+p.s*8}px serif`;ctx.fillStyle='rgba(239,224,191,.8)';ctx.fillText('♪',xx,y);break;
      case 'star':ctx.globalAlpha=.4+.4*Math.sin(t*4+p.ph);star(xx,(p.y*.6)%(H*.6),4*p.s,1.6*p.s,4,0);ctx.fillStyle='#fff3b0';ctx.fill();break;
      default:ctx.globalAlpha=.3+.4*Math.abs(Math.sin(t*3+p.ph));star(xx,y,3*p.s,1.2*p.s,4,t);ctx.fillStyle='#fff3b0';ctx.fill();}}
  ctx.restore();for(const s of L.plats||[])drawPlat(s,t);}
function drawPlat(s,t){if(s.y>9000||s.app<=0)return;ctx.save();const sh=s.shake>0&&!s.fall?(rand()-.5)*s.shake*8:0,a=easeOutBack(s.app);ctx.translate(s.x+s.w/2+sh,s.y);ctx.scale(a,a);if(s.fall)ctx.rotate(s.fy*.002);
  const w=s.w,hw=w/2;ctx.lineJoin='round';
  switch(s.skin){
    case 'nube':ell(0,30,hw*.9,9,'rgba(60,50,90,.25)',0);cloudShape(ctx,0,14,w/150,'#fffaf0',4);ell(0,22,hw*.7,6,'rgba(150,140,180,.35)',0);ell(-12,10,3,4,C.ink,0);ell(8,10,3,4,C.ink,0);ctx.beginPath();ctx.arc(-2,16,4,.2,Math.PI-.2);ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();break;
    case 'palco':rr(-hw,0,w,26,4,C.rust,3);rr(-hw-4,-4,w+8,8,3,C.brass,3);for(let i=0;i<4;i++)circ(-hw+12+i*(w-24)/3,30,4,C.brass,2);break;
    case 'estante':rr(-hw,0,w,12,2,C.woodL,3);line(-hw+10,12,-hw+18,34,4);line(hw-10,12,hw-18,34,4);
      [[-hw+16,'#b5402f'],[-hw+40,'#d9a441'],[hw-30,'#7bb7c9']].forEach(([x,c])=>{rr(x-8,-22,16,22,3,c,2.5);rr(x-6,-26,12,5,2,C.paper,2);});break;
    case 'pan':ell(0,12,hw,16,'#c98a4a',3.5);ell(0,6,hw-6,8,'#e0a865',0);for(let i=-1;i<=1;i++)line(i*18-6,2,i*18+6,12,2,'#8a5530');break;
    case 'bloque':for(let i=0;i<Math.round(w/46);i++){const x=-hw+i*46;rr(x,0,46,40,4,['#e86a5a','#7bb7c9','#f2c14e','#b8d08a'][i%4],3);txt('ABCD'[i%4],x+23,21,22,C.paper,C.ink);}break;
    case 'tren':rr(-hw,0,w,30,6,'#c23d3d',3.5);rr(-hw+10,-14,30,14,3,'#f2c14e',3);for(const x of[-hw+20,hw-20])circ(x,32,10,'#333',3);circ(0,32,10,'#333',3);break;
    case 'arena':rr(-hw,0,w,36,3,'#e8cf8f',3);for(let i=0;i<4;i++)rr(-hw+4+i*(w-8)/4,-10,(w-8)/4-8,12,1,'#e8cf8f',2.5);poly([[0,-26],[14,-20],[0,-14]],C.rust,2);line(0,-26,0,-10,2);break;
    case 'barril':rr(-hw,0,w,40,10,'#9a6a3c',3.5);line(-hw,10,hw,10,3,'#5a3a20');line(-hw,30,hw,30,3,'#5a3a20');ell(0,46,hw+10,6,'rgba(120,180,200,.5)',0);break;
    case 'chimenea':rr(-hw,0,w,60,0,'#a5503a',3.5);for(let y=10;y<60;y+=14)line(-hw,y,hw,y,1.5,'rgba(20,13,8,.5)');rr(-hw-6,-6,w+12,10,2,'#7a3a2a',3);
      for(let i=0;i<2;i++){const k=(t*.6+i/2)%1;ctx.globalAlpha=1-k;circ(10+k*20,-14-k*50,8+k*10,'rgba(220,220,220,.7)',2);ctx.globalAlpha=1;}break;
    case 'viga':rr(-hw,0,w,16,0,'#8a8478',3);for(let i=0;i<5;i++)circ(-hw+10+i*(w-20)/4,8,2.5,C.ink,0);line(-hw+20,-200,-hw+20,0,2,'rgba(20,13,8,.6)');line(hw-20,-200,hw-20,0,2,'rgba(20,13,8,.6)');break;
    case 'vela':{const m=s.shake*20;rr(-hw+8,0,w-16,80,4,'#f3ead2',3);ctx.beginPath();for(let i=0;i<5;i++)ctx.ellipse(-hw+16+i*(w-32)/4,4+(i%2)*6+m*.3,6,8+m*.4,0,0,TAU);ctx.fillStyle='#f3ead2';ctx.fill();
      line(0,0,0,-12,2);const f=Math.sin(t*20)*2;ell(f*.5,-20,6,11,'#ffd36a',2);ell(f*.5,-17,3,5,'#fff3c0',0);break;}
    case 'libros':[['#7a3b2e',0],['#3b5a7a',-14],['#5a7a3b',-28]].forEach(([c,y],i)=>rr(-hw+i*4,y,w-i*8,14,2,c,3));rr(-hw+10,-24,w-26,4,1,C.brass,0);break;
    case 'paja':rr(-hw,0,w,34,6,'#e3c25a',3.5);for(let i=0;i<6;i++)line(-hw+8+i*(w-16)/5,4,-hw+12+i*(w-16)/5,30,1.6,'#a8862a');line(-hw,17,hw,17,3,'#8a5530');break;
    case 'archivo':rr(-hw,0,w,60,2,'#7d8a8f',3.5);rr(-hw+10,10,w-20,18,2,'#9aa6ab',2.5);rr(-hw+10,34,w-20,18,2,'#9aa6ab',2.5);rr(-6,16,12,5,1,C.ink,0);rr(-6,40,12,5,1,C.ink,0);break;
    case 'carta':rr(-hw,0,w,18,4,C.paper,3);txt('♠',-hw+14,9,14,C.ink,null);txt('♥',hw-14,9,14,C.rust,null);break;
    default:rr(-hw,0,w,22,3,'#7a7488',3.5);line(-hw+w*.3,0,-hw+w*.4,22,2);line(hw-w*.3,0,hw-w*.25,22,2);}
  ctx.restore();}

/* ---------- entrances for heroes (Cuphead-style "drop in & pose") ---------- */
function introHero(L,p){const k=L.stateT,o={dy:0,rot:0,sx:1,sy:1,pose:null};if(p.type==='plane'){o.dx=-(1-easeOutBack(clamp(k/1,0,1)))*420;return o;}
  const d=.12*p.i,kk=k-d;if(kk<.7){const q=clamp(kk/.7,0,1);o.dy=-(1-q*q)*520;o.rot=(1-q)*TAU*1.5*(p.i%2?-1:1);}
  else if(kk<.95){const q=(kk-.7)/.25;o.sy=1-Math.sin(q*Math.PI)*.35;o.sx=1+Math.sin(q*Math.PI)*.3;}
  else if(kk<1.9)o.pose='flex';return o;}
