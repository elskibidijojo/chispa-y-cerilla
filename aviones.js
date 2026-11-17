/* aviones.js — six new flying fights (two on Hojalata, one on Bahía Bruma, two on Cumbre Apagón,
   one on Valle Escarcha), each with its own sky, plus nicer flying for every plane level:
   exhaust puffs behind the little plane and speed streaks. */
(function(){
/* ---------------- skies ---------------- */
const SKY={plane_atardecer:{a:'#f6c88a',b:'#e98a6a',sun:'#fff0c0',hill:'#b8644a',gr:'#7a3a2a',cl:'#ffe6d0'},
  plane_campo:{a:'#bfe3e8',b:'#e8f2d0',sun:'#fffbe0',hill:'#8fb86a',gr:'#5a8a42',cl:'#ffffff'},
  plane_marabierto:{a:'#9fd0e0',b:'#e0f2f0',sun:'#fffbe0',hill:null,gr:'#3f7f9a',cl:'#ffffff',sea:true},
  plane_luna:{a:'#1a1430',b:'#4a2a5a',sun:'#fff6c8',hill:'#2a1a38',gr:'#150f20',cl:'#4a3a6a',night:true,moon:true},
  plane_tormenta:{a:'#3a3a52',b:'#6a6a82',sun:null,hill:'#2a2a3a',gr:'#1a1a26',cl:'#5a5a72',night:true,storm:true},
  plane_aurora:{a:'#0f1a3a',b:'#2a4a6a',sun:null,hill:'#c8d8e8',gr:'#e8f0f6',cl:'#3a5a7a',night:true,aurora:true},
  plane_navidad:{a:'#1a2a4a',b:'#3a5a8a',sun:'#fff6c8',hill:'#e8f0f6',gr:'#f4f8fb',cl:'#5a7a9a',night:true,moon:true,snow:true}};
Object.assign(ARENA_FX,{plane_atardecer:{tint:[null,'rgba(255,120,60,.14)','rgba(90,20,40,.28)'],part:['leaves','sparkle','star']},
  plane_campo:{tint:[null,'rgba(255,200,80,.12)','rgba(60,80,20,.22)'],part:['leaves','leaves','sparkle']},
  plane_marabierto:{tint:[null,'rgba(40,90,130,.16)','rgba(10,30,60,.3)'],part:['bubble','rain','rain']},
  plane_luna:{tint:[null,'rgba(120,60,160,.16)','rgba(20,0,40,.32)'],part:['star','sparkle','star']},
  plane_tormenta:{tint:[null,'rgba(60,60,90,.18)','rgba(10,10,20,.35)'],part:['rain','rain','rain']},
  plane_aurora:{tint:[null,'rgba(80,200,160,.14)','rgba(120,60,200,.22)'],part:['sparkle','sparkle','star']},
  plane_navidad:{tint:[null,'rgba(200,60,60,.12)','rgba(30,60,120,.25)'],part:['sparkle','star','sparkle']}});
const _dpb=drawPlaneBG;
drawPlaneBG=function(L,k){const s=SKY[k];if(!s){_dpb(L,k);return;}const t=L.t;const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,s.a);g.addColorStop(1,s.b);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(s.night)for(let i=0;i<60;i++){const x=((i*97-t*6)%W+W)%W,y=(i*61)%330;ctx.globalAlpha=.4+.4*Math.sin(t*3+i);circ(x,y,1.2+(i%3)*.5,'#fff6c8',0);}ctx.globalAlpha=1;
  if(s.aurora){for(let b=0;b<3;b++){ctx.globalAlpha=.28;ctx.fillStyle=['#6af0b0','#7ab8ff','#c08aff'][b];ctx.beginPath();ctx.moveTo(0,80+b*40);for(let x=0;x<=W;x+=24)ctx.lineTo(x,80+b*40+Math.sin(x*.01+t*(.6+b*.2)+b)*40);for(let x=W;x>=0;x-=24)ctx.lineTo(x,180+b*40+Math.sin(x*.013+t*.7+b)*50);ctx.fill();}ctx.globalAlpha=1;}
  if(s.sun){const x=s.moon?760:700,y=s.moon?100:150;circ(x,y,s.moon?44:60,s.sun,0);if(s.moon){circ(x+18,y-10,36,s.a,0);}else{ctx.save();ctx.translate(x,y);ctx.rotate(t*.1);ctx.fillStyle='rgba(255,240,200,.25)';for(let i=0;i<12;i++){ctx.rotate(TAU/12);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(400,-20);ctx.lineTo(400,20);ctx.closePath();ctx.fill();}ctx.restore();}}
  if(s.storm&&Math.floor(t*2.3)%7===0){ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#fff6c8';ctx.lineWidth=3;const x=(Math.floor(t*2.3)*173)%W;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-20,90);ctx.lineTo(x+10,100);ctx.lineTo(x-14,220);ctx.stroke();}
  for(const c of L.clouds)if(c.l<2){ctx.globalAlpha=c.l?.75:.45;cloudShape(ctx,c.x,c.y,c.s*.85,s.cl,s.night?0:3);ctx.globalAlpha=1;}
  if(s.hill){const o=-(t*30)%500;ctx.fillStyle=s.hill;ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W+500;x+=25)ctx.lineTo(x+o,H-110-Math.sin((x)*TAU/500)*40-Math.sin(x*TAU/170)*10);ctx.lineTo(W,H);ctx.closePath();ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='rgba(20,13,8,.6)';ctx.stroke();}
  const o2=-(t*90)%400;ctx.beginPath();ctx.moveTo(0,H);
  if(s.sea){for(let x=0;x<=W+400;x+=20)ctx.lineTo(x+o2,H-46-Math.sin(x*TAU/200+t*3)*8);}else for(let x=0;x<=W+400;x+=20)ctx.lineTo(x+o2,H-40-Math.sin(x*TAU/400)*14);
  ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle=s.gr;ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();
  if(s.snow||k==='plane_aurora')for(let i=0;i<45;i++){const x=((i*97-t*(60+i%5*20))%W+W)%W,y=(i*53+t*(40+i%3*20))%H;circ(x,y,1.5+(i%3),'rgba(255,255,255,.9)',0);}
  if(s.storm){ctx.strokeStyle='rgba(200,210,240,.5)';ctx.lineWidth=2;for(let i=0;i<40;i++){const x=((i*71-t*500)%W+W)%W,y=((i*37+t*900)%H);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8,y+22);ctx.stroke();}}};

/* ---------------- 1. DON RÁFAGA (globo aerostático) ---------------- */
defBoss({id:'globoaero',kind:'plane',name:'Don Ráfaga',sub:'Jefe aéreo · Atardecer de Hojalata',isl:1,hp:360,par:110,arena:'plane_atardecer',song:'plane',x:770,y:250,intro:'¡SUELTEN LASTRE!',
  center(B){return{x:B.x,y:B.y-30};},anchor(B,n){if(n==='basket')return{x:B.x-20,y:B.y+110};if(n==='mouth')return{x:B.x-60,y:B.y-10};return{x:B.x,y:B.y-30};},
  shapes(B){return[{x:B.x,y:B.y-40,r:B.phase===2?84:100},{x:B.x,y:B.y+110,r:38}];},
  move(B,dt){const t=B.t;if(B.phase<2){B.x=lerp(B.x,770+Math.sin(t*.4)*30,Math.min(1,dt*2));B.y=lerp(B.y,250+Math.sin(t*.7)*80,Math.min(1,dt*2));}else{B.x=lerp(B.x,720+Math.sin(t*1.3)*120,Math.min(1,dt*3));B.y=lerp(B.y,240+Math.sin(t*2.1)*140,Math.min(1,dt*3));}},
  phases:[
    {atk:[{f:'aimed',every:1.3,from:'basket',n:2,spread:.25,spd:290,spr:'bloque',r:12,parry:4},{f:'rain',every:2.2,n:3,spr:'drop',r:10,spd:[240,320]}]},
    {banner:'¡RÁFAGA DE VIENTO!',atk:[{f:'minion',every:2.6,ai:'homer',skin:'nube',hp:3,r:22,max:3,spd:120,from:'mouth'},{f:'ring',every:3,from:'mouth',n:8,spd:220,spr:'drop',r:10,parry:4},{f:'aimed',every:1.6,from:'basket',spd:320,spr:'bloque',r:12}]},
    {banner:'¡SE PINCHA EL GLOBO!',atk:[{f:'spiral',every:3.4,from:'mouth',dur:1.8,rate:.1,spd:230,spr:'aire',r:11,arms:2,parry:6},{f:'aimed',every:1.2,from:'mouth',n:3,spread:.2,spd:350,spr:'drop',r:10,parry:3},{f:'column',every:3,style:'bolt',warn:.85,act:.3,w:36,xmax:W-230}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    for(const s of[-1,1])line(x+s*60,y+40,x+s*26,y+92,2.5);const R=ph===2?84+Math.sin(t*20)*3:100;
    ctx.save();ctx.translate(x,y-40);ctx.beginPath();ctx.ellipse(0,0,R,R*1.08,0,0,TAU);ctx.save();ctx.clip();for(let i=-5;i<=5;i++){ctx.fillStyle=i%2?'#e86a5a':'#f6e2b8';ctx.beginPath();ctx.ellipse(i*20,0,12,R*1.1,0,0,TAU);ctx.fill();}ctx.restore();
    ctx.beginPath();ctx.ellipse(0,0,R,R*1.08,0,0,TAU);ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();ell(-R*.4,-R*.5,R*.2,R*.12,'rgba(255,255,255,.5)',0);
    face(-14,6,1.05,{look:lookAt(L,x,y),dead:B.dead,ang:.2+ph*.15,mouth:ph===2?'o':'grin',my:40,mw:24,open:ph?.7:.3});
    if(ph===2){rr(R*.3,-R*.6,28,22,4,'#c8a46a',2.5);line(R*.3,-R*.6,R*.3+28,-R*.6+22,1.5);const k=(t*3)%1;ctx.globalAlpha=1-k;cloudShape(ctx,R*.6+k*60,-R*.7-k*40,.2+k*.3,'#fff',0);ctx.globalAlpha=1;}ctx.restore();
    rr(x-34,y+92,68,40,6,'#a0663a',4);for(let i=0;i<4;i++)line(x-28+i*18,y+96,x-24+i*18,y+128,1.5,'rgba(20,13,8,.5)');for(const s of[-1,1]){ell(x+s*42,y+112+Math.sin(t*4+s)*3,9,12,'#c8a46a',3);}
    flashOver(B,x,y-40,100);ctx.restore();}});

/* ---------------- 2. LIBÉLULA ZUMBONA ---------------- */
defBoss({id:'libelula',kind:'plane',name:'Libélula Zumbona',sub:'Jefa aérea · Campos de Hojalata',isl:1,hp:380,par:115,arena:'plane_campo',song:'plane',x:780,y:270,intro:'¡ZZZUMBA, ZZZUMBA!',
  center(B){return{x:B.x,y:B.y};},anchor(B,n){if(n==='mouth')return{x:B.x-110,y:B.y};if(n==='tail')return{x:B.x+150,y:B.y+10};return{x:B.x,y:B.y};},
  shapes(B){return[{x:B.x-60,y:B.y,r:50},{x:B.x+40,y:B.y+4,r:40}];},
  move(B,dt){const t=B.t,sp=1+B.phase*.4;B.x=lerp(B.x,760+Math.sin(t*.9*sp)*90,Math.min(1,dt*3));B.y=lerp(B.y,270+Math.sin(t*1.7*sp)*150,Math.min(1,dt*3));},
  phases:[
    {atk:[{f:'aimed',every:1,from:'mouth',n:2,spread:.15,spd:340,spr:'nut',r:9,parry:5},{f:'boomer',every:3.2,from:'mouth',spr:'feather',r:13,parry:2}]},
    {banner:'¡ENJAMBRE!',atk:[{f:'minion',every:2.2,ai:'flyer',skin:'nube',hp:2,r:18,max:4,spd:170,from:'tail'},{f:'aimed',every:1.4,from:'mouth',n:3,spread:.25,spd:340,spr:'nut',r:9,parry:4}]},
    {banner:'¡A TODA HÉLICE!',atk:[{f:'tele',every:4},{f:'spiral',every:3,from:'mouth',dur:1.5,rate:.08,spd:250,spr:'note',r:10,arms:3,parry:7},{f:'wall',every:6,spr:'nut',gap:170,spd:260}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    for(const [dx,dy,s] of[[-20,-30,1],[30,-30,1],[-20,30,-1],[30,30,-1]]){ctx.save();ctx.translate(x+dx,y+dy*.4);ctx.rotate(Math.sin(t*50+dx)*.25*s-s*.3);ctx.globalAlpha=.6;ell(0,-s*44,22,46,'#dff4fa',3);ctx.restore();}ctx.globalAlpha=1;
    for(let i=0;i<5;i++)ell(x+40+i*26,y+4,16-i*1.5,11-i,i%2?'#5aa8a0':'#7bc6b8',3);ell(x-10,y,40,30,'#5aa8a0',4);circ(x-74,y-4,40,'#7bc6b8',4);
    for(const s of[-1,1]){circ(x-90+s*0,y-22+s*0,18,'#2b3a5a',3);}rr(x-118,y-36,56,22,10,'#2b3a5a',3);circ(x-104,y-26,9,'#bfe3f0',2.5);circ(x-78,y-26,9,'#bfe3f0',2.5);circ(x-104,y-26,3.5,C.ink,0);circ(x-78,y-26,3.5,C.ink,0);
    ctx.beginPath();ctx.arc(x-94,y+8,12,.2,Math.PI-.2);ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ctx.save();ctx.translate(x+168,y+6);ctx.rotate(t*40);rr(-3,-24,6,48,3,C.woodL,2);ctx.restore();
    flashOver(B,x-40,y,80);ctx.restore();}});

/* ---------------- 3. CAPITÁN ALETAS (pez volador) ---------------- */
defBoss({id:'pezvolador',kind:'plane',name:'Capitán Aletas',sub:'Jefe aéreo · Mar Abierto de la Bahía',isl:2,hp:440,par:120,arena:'plane_marabierto',song:'plane2',x:780,y:270,intro:'¡A TODA ALETA!',
  center(B){return{x:B.x,y:B.y};},anchor(B,n){if(n==='mouth')return{x:B.x-120,y:B.y+10};if(n==='top')return{x:B.x,y:B.y-60};return{x:B.x,y:B.y};},
  shapes(B){return[{x:B.x-30,y:B.y,r:78},{x:B.x+70,y:B.y,r:44}];},
  setup(B){B.jump=0;},
  move(B,dt){const t=B.t;B.x=lerp(B.x,780+Math.sin(t*.6)*50,Math.min(1,dt*2));B.y=lerp(B.y,B.phase===2?300+Math.sin(t*2.4)*170:270+Math.sin(t*1.1)*100,Math.min(1,dt*2.5));},
  phases:[
    {atk:[{f:'aimed',every:1.2,from:'mouth',n:3,spread:.2,spd:310,spr:'fish',r:11,parry:4},{f:'wall',every:6,spr:'bubble',gap:180,spd:230}]},
    {banner:'¡BANCO DE PECES!',atk:[{f:'rain',every:1.6,n:4,spr:'fish',r:11,spd:[240,320],parry:5},{f:'boomer',every:2.8,from:'mouth',spr:'pez',r:14,parry:2},{f:'ring',every:3.4,from:'top',n:9,spd:220,spr:'bubble',r:11,parry:4}]},
    {banner:'¡SALTO MORTAL!',atk:[{f:'spiral',every:3.2,from:'mouth',dur:1.6,rate:.1,spd:240,spr:'bubble',r:11,arms:2,parry:6},{f:'aimed',every:1.1,from:'mouth',n:2,spread:.2,spd:380,spr:'fish',r:11,parry:3},{f:'column',every:3.2,style:'geyser',warn:.85,act:.4,w:44,xmax:W-230}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*2)*.08);ctx.lineJoin='round';ctx.lineCap='round';
    for(const s of[-1,1]){ctx.save();ctx.translate(-10,s*20);ctx.rotate(s*(.5+Math.sin(t*14)*.25));poly([[0,0],[90,s*-6],[70,s*60],[10,s*40]],'#9fd0e8',3.5);for(let i=1;i<4;i++)line(10,s*i*6,80-i*8,s*(i*14),1.5,'rgba(20,13,8,.4)');ctx.restore();}
    poly([[90,0],[150,-50],[136,0],[150,50]],'#4a8ab8',4);ctx.beginPath();ctx.ellipse(-20,0,110,58,0,0,TAU);ctx.fillStyle='#5aa0c8';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.beginPath();ctx.ellipse(-20,22,96,30,0,0,Math.PI);ctx.fillStyle='#e8f2f0';ctx.fill();for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(-60+i*30,-10,10,Math.PI*1.1,Math.PI*1.9);ctx.lineWidth=2;ctx.stroke();}
    rr(-120,-34,64,22,10,'#6b3a26',3);circ(-108,-22,12,'#bfe3f0',3);circ(-80,-22,12,'#bfe3f0',3);circ(-108,-22,4,C.ink,0);circ(-80,-22,4,C.ink,0);rr(-96,-62,44,24,4,'#2b3a5a',3);rr(-104,-42,60,6,3,'#2b3a5a',0);
    ctx.beginPath();ctx.moveTo(-128,10);ctx.quadraticCurveTo(-110,ph?30:22,-90,14);ctx.lineWidth=3.5;ctx.stroke();
    flashOver(B,-20,0,100);ctx.restore();}});

/* ---------------- 4. BRUJA ESCOBILLA ---------------- */
defBoss({id:'escoba',kind:'plane',name:'Bruja Escobilla',sub:'Jefa aérea · Luna de la Cumbre',isl:3,hp:480,par:125,arena:'plane_luna',song:'plane3',x:770,y:250,intro:'¡ABRACADABRA, PATA DE CABRA!',
  center(B){return{x:B.x,y:B.y-20};},anchor(B,n){if(n==='wand')return{x:B.x-110,y:B.y-30};if(n==='broom')return{x:B.x+120,y:B.y+40};return{x:B.x,y:B.y-20};},
  shapes(B){return[{x:B.x,y:B.y-30,r:72},{x:B.x+40,y:B.y+40,r:30}];},
  move(B,dt){const t=B.t;B.x=lerp(B.x,760+Math.sin(t*.8)*70,Math.min(1,dt*2));B.y=lerp(B.y,250+Math.sin(t*1.4)*(110+B.phase*20),Math.min(1,dt*2.4));},
  phases:[
    {atk:[{f:'aimed',every:1.2,from:'wand',n:3,spread:.25,spd:300,spr:'star',r:10,parry:4},{f:'minion',every:3,ai:'homer',skin:'sombrita',hp:2,r:16,max:3,spd:130,from:'broom'}]},
    {banner:'¡CALDERO MÁGICO!',atk:[{f:'spiral',every:3.4,from:'wand',dur:2,rate:.12,spd:210,spr:'orb',r:11,arms:3,parry:7},{f:'column',every:3,style:'darkbolt',warn:.85,act:.3,w:36,xmax:W-230},{f:'aimed',every:1.8,from:'wand',spd:330,spr:'star',r:10}]},
    {banner:'¡ESCOBAZO!',atk:[{f:'tele',every:4.2},{f:'ring',every:2.6,from:'wand',n:10,spd:230,spr:'spark',r:10,parry:4},{f:'boomer',every:2.6,from:'broom',spr:'feather',r:14,parry:2}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    ctx.save();ctx.translate(x,y+40);ctx.rotate(-.08+Math.sin(t*2)*.05);rr(-120,-6,230,12,6,'#8a5a3a',3.5);ctx.translate(110,0);for(let i=0;i<9;i++){line(0,0,60,(i-4)*7+Math.sin(t*12+i)*3,3,'#c8a46a');}line(0,0,60,0,1);ctx.restore();
    for(let i=0;i<4;i++){const k=((t*1.5+i/4)%1);star(x+150+k*80,y+40+Math.sin(t*5+i)*10,5*(1-k)+2,2,5,t*4);ctx.fillStyle='#ffe27a';ctx.fill();}
    circ(x,y-20,46,'#9ad86a',4);poly([[x-70,y-50],[x+70,y-50],[x+20,y-60],[x+10*Math.sin(t*2),y-170],[x-30,y-60]],'#3a2a5a',4);rr(x-34,y-74,68,14,4,'#c8392b',3);
    face(x-6,y-16,.85,{look:lookAt(L,x,y),dead:B.dead,ang:-.2+ph*.2,mouth:'grin',my:30,mw:22,open:ph?.6:.2});poly([[x-46,y-14],[x-62,y-8],[x-46,y-2]],'#9ad86a',3);
    ctx.save();ctx.translate(x-80,y-20);ctx.rotate(-.4+Math.sin(t*4)*.2);rr(-3,-40,6,44,3,'#3a2a20',2);star(0,-44,10,4,5,t*3);ctx.fillStyle='#ffe27a';ctx.fill();ctx.lineWidth=2.5;ctx.stroke();ctx.restore();
    flashOver(B,x,y-20,80);ctx.restore();}});

/* ---------------- 5. GÁRGOLA GRUÑONA ---------------- */
defBoss({id:'gargola',kind:'plane',name:'Gárgola Gruñona',sub:'Jefa aérea · Tormenta sobre la Cumbre',isl:3,hp:500,par:125,arena:'plane_tormenta',song:'plane3',x:770,y:260,intro:'¡PIEDRA, TRUENO Y A VOLAR!',
  center(B){return{x:B.x,y:B.y};},anchor(B,n){if(n==='mouth')return{x:B.x-70,y:B.y+10};if(n==='hand')return{x:B.x-90,y:B.y+60};return{x:B.x,y:B.y};},
  shapes(B){return[{x:B.x,y:B.y,r:82}];},
  move(B,dt){const t=B.t;const dive=B.phase>=1&&Math.sin(t*.9)>.85;B.x=lerp(B.x,dive?560:780+Math.sin(t*.5)*40,Math.min(1,dt*(dive?4:2)));B.y=lerp(B.y,260+Math.sin(t*1.3)*120,Math.min(1,dt*2.4));},
  phases:[
    {atk:[{f:'aimed',every:1.3,from:'mouth',n:2,spread:.2,spd:320,spr:'shard',r:11,parry:4},{f:'rain',every:1.8,n:3,spr:'hail',r:10,spd:[260,340]}]},
    {banner:'¡RAYOS Y CENTELLAS!',atk:[{f:'column',every:2.4,n:2,gap:0,spread:220,style:'bolt',warn:.85,act:.3,w:36,xmax:W-230},{f:'aimed',every:1.4,from:'hand',n:3,spread:.3,spd:330,spr:'shard',r:11,parry:3},{f:'minion',every:3.5,ai:'homer',skin:'nube',hp:3,r:20,max:2,spd:120,from:'mouth'}]},
    {banner:'¡A PEDRADAS!',atk:[{f:'spiral',every:3,from:'mouth',dur:1.8,rate:.1,spd:240,spr:'hail',r:11,arms:2,parry:6},{f:'wall',every:5.5,spr:'shard',gap:170,spd:250},{f:'boomer',every:2.8,from:'hand',spr:'mazo',r:16,parry:2}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';
    for(const s of[-1,1]){ctx.save();ctx.translate(20,-20);ctx.scale(1,s);ctx.rotate(-.3+Math.sin(t*6)*.35);poly([[0,0],[120,-60],[110,-20],[140,-10],[100,10],[110,30],[0,20]],'#6a6a7a',4);ctx.restore();}
    ctx.beginPath();ctx.ellipse(0,10,70,62,0,0,TAU);ctx.fillStyle='#8a8a9a';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();for(const [a,b] of[[-30,30],[20,40],[0,-10]])line(a,b,a+14,b+8,2,'rgba(20,13,8,.4)');
    poly([[-40,-46],[-56,-90],[-20,-56]],'#6a6a7a',3.5);poly([[20,-50],[30,-94],[44,-52]],'#6a6a7a',3.5);
    face(-20,0,1,{look:lookAt(L,x,y),dead:B.dead,ang:.4,mouth:'grin',my:36,mw:30,open:ph?.8:.4});for(const s of[-1,1])poly([[-34+s*14,30],[-28+s*14,44],[-22+s*14,30]],'#f4f4ee',2);
    ctx.beginPath();ctx.moveTo(60,30);ctx.quadraticCurveTo(110,70,150,40+Math.sin(t*4)*10);ctx.lineWidth=8;ctx.strokeStyle='#6a6a7a';ctx.stroke();poly([[150,30+Math.sin(t*4)*10],[170,44],[150,56+Math.sin(t*4)*10]],'#6a6a7a',3);
    flashOver(B,0,0,90);ctx.restore();}});

/* ---------------- 6. DAMA AURORA ---------------- */
defBoss({id:'aurora',kind:'plane',name:'Dama Aurora',sub:'Jefa aérea · Cielo del Norte',isl:4,hp:540,par:130,arena:'plane_aurora',song:'pinguino',x:770,y:260,intro:'¡QUE BRILLE EL NORTE!',
  center(B){return{x:B.x,y:B.y};},anchor(B,n){if(n==='hand')return{x:B.x-90,y:B.y+10};if(n==='crown')return{x:B.x,y:B.y-90};return{x:B.x,y:B.y};},
  shapes(B){return[{x:B.x,y:B.y,r:70}];},
  move(B,dt){const t=B.t;B.x=lerp(B.x,770+Math.sin(t*.7)*60,Math.min(1,dt*2));B.y=lerp(B.y,260+Math.sin(t*1.2)*120,Math.min(1,dt*2));},
  phases:[
    {atk:[{f:'aimed',every:1.2,from:'hand',n:3,spread:.22,spd:320,spr:'hielo',r:11,parry:4},{f:'rain',every:2,n:4,spr:'nieve',r:11,spd:[220,300]}]},
    {banner:'¡LUCES DEL NORTE!',atk:[{f:'column',every:2.6,n:2,gap:0,spread:240,style:'light',warn:.85,act:.4,w:44,xmax:W-230},{f:'wall',every:5.5,spr:'hielo',gap:160,spd:240},{f:'aimed',every:1.6,from:'hand',spd:340,spr:'hielo',r:11,parry:3}]},
    {banner:'¡TORMENTA POLAR!',atk:[{f:'spiral',every:3,from:'crown',dur:2,rate:.1,spd:230,spr:'nieve',r:11,arms:3,parry:7},{f:'ring',every:2.6,from:'crown',n:10,spd:220,spr:'hielo',r:10,parry:4},{f:'tele',every:4.6}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    for(let i=0;i<5;i++){ctx.globalAlpha=.45;ctx.fillStyle=['#6af0b0','#7ab8ff','#c08aff','#6af0b0','#7ab8ff'][i];ctx.beginPath();ctx.moveTo(x+20,y-50+i*20);for(let k=0;k<=8;k++)ctx.lineTo(x+20+k*30,y-50+i*20+Math.sin(t*3+k*.8+i)*18);ctx.lineTo(x+260,y-30+i*20);for(let k=8;k>=0;k--)ctx.lineTo(x+20+k*30,y-38+i*20+Math.sin(t*3+k*.8+i)*18);ctx.fill();}ctx.globalAlpha=1;
    ctx.beginPath();ctx.moveTo(x-50,y+20);ctx.quadraticCurveTo(x,y+130+Math.sin(t*3)*10,x+60,y+30);ctx.closePath();ctx.fillStyle='#bfe3f0';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
    circ(x,y,56,'#e8f6fa',4.5);face(x-6,y+4,.9,{look:lookAt(L,x,y),dead:B.dead,ang:-.1+ph*.2,mouth:'grin',my:30,mw:22,open:ph?.6:.2});
    for(let i=0;i<5;i++){const a=-Math.PI/2+(i-2)*.35;poly([[x+Math.cos(a)*50,y+Math.sin(a)*50],[x+Math.cos(a)*86,y+Math.sin(a)*86],[x+Math.cos(a+.12)*54,y+Math.sin(a+.12)*54]],'#bfe3f0',3);}
    ctx.save();ctx.translate(x-80,y+10);ctx.rotate(Math.sin(t*3)*.3);star(0,0,14,6,6,t*2);ctx.fillStyle='#e8f6fa';ctx.fill();ctx.lineWidth=2.5;ctx.stroke();ctx.restore();
    flashOver(B,x,y,80);ctx.restore();}});

/* ---------------- on the maps ---------------- */
addNode(1,{id:'globoaero',x:620,y:230,kind:'level',ob:36,bld:'globo'});WORLDS[1].roads.push(['feria','globoaero']);
addNode(1,{id:'libelula',x:1300,y:270,kind:'level',ob:36,bld:'molino'});WORLDS[1].roads.push(['cafetera','libelula']);
addNode(2,{id:'pezvolador',x:1250,y:270,kind:'level',ob:36,bld:'barco'});WORLDS[2].roads.push(['nubes','pezvolador']);
addNode(3,{id:'escoba',x:1160,y:330,kind:'level',ob:36,bld:'capilla'});WORLDS[3].roads.push(['buho','escoba']);
addNode(3,{id:'gargola',x:800,y:260,kind:'level',ob:36,bld:'torre'});WORLDS[3].roads.push(['linterna','gargola']);
addNode(4,{id:'aurora',x:1480,y:420,kind:'level',ob:36,bld:'observatorio'});WORLDS[4].roads.push(['pinguino','aurora']);
if(typeof MAPBG!=='undefined')MAPBG={k:null};

/* ---------------- nicer flying everywhere: exhaust puffs and speed streaks ---------------- */
const _dpA=drawPlayers;
drawPlayers=function(L){if(L.def&&L.def.kind==='plane'||L.Ps.some(p=>p.type==='plane')){const t=L.t;L._puffs=L._puffs||[];
    for(const p of L.Ps){if(p.dead||p.type!=='plane')continue;if(!L._lastPuff||t-L._lastPuff>.05){L._puffs.push({x:p.x-26,y:p.y+4,t0:t,s:p.small?.5:1});}}if(!L._lastPuff||t-L._lastPuff>.05)L._lastPuff=t;
    L._puffs=L._puffs.filter(f=>t-f.t0<.6);for(const f of L._puffs){const a=t-f.t0;ctx.globalAlpha=.55*(1-a/.6);circ(f.x-a*220,f.y-a*10,(5+a*14)*f.s,'#f4f0e6',0);}ctx.globalAlpha=1;
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.lineCap='round';for(let i=0;i<7;i++){const x=W-(((t*900)+i*211)%(W+300)),y=40+(i*83)%(H-120);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+60,y);ctx.stroke();}}
  _dpA(L);};
})();
