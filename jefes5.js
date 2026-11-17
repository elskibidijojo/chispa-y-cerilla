/* jefes5.js — four new extra bosses, one per island, each with three phases, its own arena,
   its own look and a signature move:
   1 La Cafetera Chacha (Hojalata) · 2 El Buzo Burbujas (Bahía Bruma)
   3 La Linterna Mágica (Cumbre Apagón) · 4 El Rey Helado (Valle Escarcha) */
(function(){
/* ---------------- arenas ---------------- */
function floorTiles(g,c1,c2,sz=48){g.fillStyle=c1;g.fillRect(0,GROUND,W,H-GROUND);for(let y=GROUND,r=0;y<H;y+=sz/2,r++)for(let x=(r%2)*sz;x<W;x+=sz*2){g.fillStyle=c2;g.fillRect(x,y,sz,sz/2);}g.fillStyle='rgba(20,13,8,.85)';g.fillRect(0,GROUND,W,5);}
function vgrad(g,a,b,y0=0,y1=GROUND){const gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,a);gr.addColorStop(1,b);g.fillStyle=gr;g.fillRect(0,y0,W,y1-y0);}
Object.assign(ACZ,{
  j5_cocina(g){vgrad(g,'#f6e2b8','#e8c48a');for(let x=0;x<W;x+=60)for(let y=0;y<GROUND-90;y+=60){gR(g,x+3,y+3,54,54,(x/60+y/60)%2?'#fbf0d6':'#f1dcae',1.5,4);}
    gR(g,0,GROUND-90,W,90,'#b8784a',4,0);for(let i=0;i<6;i++){gR(g,20+i*160,GROUND-76,130,62,'#c98a5a',3,6);gE(g,85+i*160,GROUND-45,7,7,C.brass,2);}
    gR(g,60,40,180,120,'#7bb7c9',4,8);g.strokeStyle=C.ink;g.lineWidth=3;g.beginPath();g.moveTo(150,40);g.lineTo(150,160);g.moveTo(60,100);g.lineTo(240,100);g.stroke();
    for(let i=0;i<4;i++){gR(g,620+i*70,60,40,60,['#e86a5a','#f2c14e','#b8d08a','#7bb7c9'][i],3,6);gR(g,626+i*70,52,28,12,'#fff8ee',2.5,4);}gR(g,600,120,300,10,C.woodL,3,2);
    floorTiles(g,'#e8d8b8','#c94a3a');},
  j5_mar(g){vgrad(g,'#2f6f86','#123a52');for(let i=0;i<7;i++){g.fillStyle='rgba(180,230,240,.08)';g.beginPath();g.moveTo(100+i*130,0);g.lineTo(60+i*130+60,GROUND);g.lineTo(130+i*130+80,GROUND);g.lineTo(140+i*130,0);g.fill();}
    for(let i=0;i<9;i++){const x=40+i*110,h=80+(i*37)%90;g.strokeStyle='#3f8a5a';g.lineWidth=12;g.lineCap='round';g.beginPath();g.moveTo(x,GROUND);g.quadraticCurveTo(x+20,GROUND-h/2,x-6,GROUND-h);g.stroke();g.strokeStyle=C.ink;g.lineWidth=3;g.stroke();}
    gE(g,820,GROUND-30,90,40,'#6a5a4a',4);gR(g,780,GROUND-80,80,50,'#8a6a3a',4,6);gR(g,780,GROUND-80,80,14,C.brass,3,4);
    g.fillStyle='#d9c08a';g.fillRect(0,GROUND,W,H-GROUND);for(let i=0;i<40;i++){gE(g,(i*97)%W,GROUND+10+(i*31)%(H-GROUND-10),3,2,'#b89a6a',0);}g.fillStyle='rgba(20,13,8,.85)';g.fillRect(0,GROUND,W,5);},
  j5_desvan(g){vgrad(g,'#2a2236','#151020');g.fillStyle='#3a2a20';g.beginPath();g.moveTo(0,0);g.lineTo(W/2,-60);g.lineTo(W,0);g.lineTo(W,30);g.lineTo(W/2,-20);g.lineTo(0,30);g.fill();
    for(let i=0;i<6;i++){g.strokeStyle='#4a3628';g.lineWidth=14;g.beginPath();g.moveTo(80+i*160,0);g.lineTo(80+i*160,GROUND);g.stroke();g.strokeStyle=C.ink;g.lineWidth=3;g.stroke();}
    gR(g,200,70,560,250,'#efe6d0',4,4);g.strokeStyle='rgba(20,13,8,.25)';g.lineWidth=2;for(let i=1;i<6;i++){g.beginPath();g.moveTo(200+i*93,70);g.lineTo(200+i*93+8,320);g.stroke();}
    g.fillStyle='rgba(255,240,190,.12)';g.beginPath();g.moveTo(780,300);g.lineTo(200,70);g.lineTo(200,320);g.closePath();g.fill();
    for(const [x,y,w,h] of [[40,GROUND-70,90,70],[870,GROUND-100,70,100],[120,GROUND-40,60,40]])gR(g,x,y,w,h,'#6b4a32',3,4);
    floorTiles(g,'#5a3e2c','#4a3222',64);},
  j5_helado(g){vgrad(g,'#cfeaf2','#f8e6f0');for(let i=0;i<W;i+=48){gR(g,i,60,48,40,(i/48)%2?'#f6a8c0':'#fff8ee',2,0);}g.fillStyle='rgba(20,13,8,.7)';g.fillRect(0,96,W,5);
    for(let i=0;i<10;i++){const x=(i*101)%W,y=130+(i*47)%160;gE(g,x,y,26,10,'rgba(255,255,255,.7)',0);}
    for(let i=0;i<5;i++){const x=90+i*200;gR(g,x-10,GROUND-140,20,140,'#f2c14e',3,4);gE(g,x,GROUND-160,36,30,['#f6a8c0','#fff4e0','#a0663a','#b8e0c8','#f6a8c0'][i],3.5);}
    floorTiles(g,'#fff8ee','#7bc6e8',48);}});

/* ---------------- 1. LA CAFETERA CHACHA ---------------- */
defBoss({id:'cafetera',name:'La Cafetera Chacha',sub:'Jefa extra · Cocina de la Abuela',isl:1,hp:360,par:95,arena:'j5_cocina',song:'tostada',x:760,y:GROUND,intro:'¡UN CAFECITO BIEN CARGADO!',
  center(B){return{x:B.x,y:B.y-150};},
  anchor(B,n){if(n==='spout')return{x:B.x-92,y:B.y-232};if(n==='hand')return{x:B.x-100,y:B.y-130};if(n==='lid')return{x:B.x,y:B.y-292};return null;},
  shapes(B){return[{x:B.x,y:B.y-200,r:66},{x:B.x,y:B.y-80,r:70}];},
  setup(B){B.bx=B.x;},
  move(B,dt,L){if(!B.act)B.x+=(B.bx+Math.sin(B.t*.8)*60-B.x)*Math.min(1,dt*2);B.squash=(B.squash||0)*.9+Math.sin(B.t*(6+B.phase*3))*.012;},
  phases:[
    {atk:[{f:'aimed',every:1.7,from:'spout',n:3,spread:.22,spd:320,spr:'drop',r:12,parry:3,sfx:'pop'},{f:'lob',every:2.6,from:'hand',spr:'bloque',r:14,T:1.1,parry:4}]},
    {banner:'¡HIRVIENDO!',atk:[{f:'column',every:3.2,n:2,gap:.6,style:'steam',warn:.8,w:70},{f:'rain',every:2.4,n:5,spd:260,spr:'drop',r:11,parry:5},{f:'aimed',every:2.2,from:'spout',n:2,spread:.3,spd:340,spr:'drop',r:12,parry:3}]},
    {banner:'¡EXPRESO DOBLE!',atk:[{f:'charge',every:4.4,warn:.9,spd:720},{f:'ring',every:2.8,from:'lid',n:10,spd:230,spr:'drop',r:11,parry:4,sfx:'pop'},{f:'column',every:3.6,n:3,gap:.5,style:'steam',warn:.8,w:64}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    ell(x,y-2,100,12,'rgba(20,13,8,.25)',0);
    for(const s of[-1,1]){hose(x+s*60,y-120,x+s*110,y-90,x+s*(s<0?100:96),y-130+Math.sin(t*5+s)*10,9);glove(x+s*(s<0?100:96),y-130+Math.sin(t*5+s)*10,14);}
    poly([[x-70,y],[x+70,y],[x+56,y-110],[x-56,y-110]],'#b9bec6',4.5);poly([[x-56,y-110],[x+56,y-110],[x+68,y-260],[x-68,y-260]],'#cfd4da',4.5);rr(x-62,y-122,124,18,4,'#8a9098',3.5);
    for(let i=-2;i<=2;i++)line(x+i*22,y-104,x+i*25,y-250,2,'rgba(20,13,8,.2)');
    poly([[x-66,y-230],[x-112,y-252],[x-104,y-236],[x-66,y-210]],'#b9bec6',4);rr(x+62,y-240,46,14,6,C.ink,0);rr(x+96,y-250,20,110,10,'#1b130d',3);
    ell(x,y-268,74,14,'#b9bec6',4);ell(x,y-286,10,10,'#1b130d',3);
    const fx=x,fy=y-190;bossFace(B,L,fx,fy,.9,{gap:24,ew:13,eh:15,my:38,mw:30,open:B.mouth>0?.8:.3});ell(fx-34,fy+20,10,6,'rgba(232,120,110,.5)',0);ell(fx+34,fy+20,10,6,'rgba(232,120,110,.5)',0);
    const st=ph>=1?3:2;for(let i=0;i<st;i++){const k=((t*.9+i/st)%1);ctx.globalAlpha=.75*(1-k);cloudShape(ctx,x-104-k*30+Math.sin(t*3+i)*6,y-262-k*80,.22+k*.25,'#fff',0);}ctx.globalAlpha=1;
    if(ph>=2){ctx.globalAlpha=.6;for(let i=0;i<5;i++)circ(x-60+i*30,y-6,4+Math.abs(Math.sin(t*12+i))*5,'#ffb43a',0);ctx.globalAlpha=1;}
    const c=B.center();flashOver(B,c.x,c.y,90);koStars(B,L,c.x,c.y-150);ctx.restore();}});

/* ---------------- 2. EL BUZO BURBUJAS ---------------- */
defBoss({id:'buzo',name:'El Buzo Burbujas',sub:'Jefe extra · Fondo de la Bahía',isl:2,hp:420,par:105,arena:'j5_mar',song:'arrecife',x:720,y:GROUND,intro:'¡GLU GLU, A LA CARGA!',
  center(B){return{x:B.x,y:B.y-170};},
  anchor(B,n){if(n==='helm')return{x:B.x-40,y:B.y-250};if(n==='foot')return{x:B.x-50,y:B.y-20};if(n==='hand')return{x:B.x-110,y:B.y-150};return null;},
  shapes(B){return[{x:B.x,y:B.y-250,r:64},{x:B.x,y:B.y-120,r:72}];},
  setup(B){B.bx=B.x;},
  move(B,dt,L){if(!B.act){const tx=B.bx+Math.sin(B.t*.5)*120;B.x+=(tx-B.x)*Math.min(1,dt*1.2);}B.bob=Math.sin(B.t*1.6)*8;},
  phases:[
    {atk:[{f:'aimed',every:1.8,from:'helm',n:2,spread:.3,spd:260,spr:'bubble',r:14,parry:3,sfx:'pop'},{f:'bubbleRise',every:6,spd:160,gap:200,parry:5}]},
    {banner:'¡SE AGITA EL MAR!',atk:[{f:'ring',every:2.8,from:'helm',n:8,spd:220,spr:'pez',r:12,parry:4},{f:'roller',every:2.6,from:'foot',spr:'ball',r:24,spd:360,parry:3,sfx:'knock'},{f:'aimed',every:2.2,from:'hand',n:3,spread:.25,spd:280,spr:'bubble',r:13}]},
    {banner:'¡SIN AIRE!',atk:[{f:'suck',every:7,delay:.8,from:'helm',dur:1.6},{f:'spiral',every:4,dur:2,rate:.13,arms:2,from:'helm',spr:'bubble',r:12,spd:200,parry:6},{f:'bubbleRise',every:5,spd:180,gap:180,parry:5},{f:'roller',every:3,from:'foot',spr:'ball',r:24,spd:400}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y+(B.bob||0),ph=B.phase;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    ell(B.x,B.y-2,90,12,'rgba(20,13,8,.25)',0);ctx.strokeStyle=C.ink;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x+40,y-290);ctx.bezierCurveTo(x+120,y-360,x+60,y-420,x+90,y-560);ctx.stroke();ctx.strokeStyle='#4a4a4a';ctx.lineWidth=4;ctx.stroke();
    for(const s of[-1,1]){rr(x+s*44-28,y-40,56,40,10,'#5a5a62',4);}
    rr(x-70,y-200,140,170,40,'#c8b48a',4.5);for(let i=0;i<3;i++)line(x-60,y-170+i*40,x+60,y-170+i*40,2,'rgba(20,13,8,.25)');rr(x-74,y-200,148,24,8,C.brass,4);
    for(const s of[-1,1]){const hx=x+s*110,hy=y-150+Math.sin(t*3+s)*12;hose(x+s*64,y-170,x+s*100,y-180,hx,hy,22);hose(x+s*64,y-170,x+s*100,y-180,hx,hy,16);ctx.strokeStyle='#c8b48a';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(x+s*64,y-170);ctx.quadraticCurveTo(x+s*100,y-180,hx,hy);ctx.stroke();glove(hx,hy,17);}
    circ(x,y-252,70,C.brass,5);circ(x,y-252,48,'#9fd8e8',4);for(const a of[0,1.57,3.14,4.71])circ(x+Math.cos(a)*60,y-252+Math.sin(a)*60,7,'#d9a83a',2.5);
    ctx.save();ctx.beginPath();ctx.arc(x,y-252,46,0,TAU);ctx.clip();bossFace(B,L,x,y-258,.72,{gap:18,ew:11,eh:13,my:30,mw:22,open:B.mouth>0?.8:.25});ell(x-18,y-280,10,16,'rgba(255,255,255,.6)',0);ctx.restore();
    for(let i=0;i<(ph>=2?5:3);i++){const k=((t*.7+i*.27)%1);circ(x+60+Math.sin(t*4+i)*10,y-300-k*200,4+k*8,'rgba(220,245,255,.7)',2);}
    const c=B.center();flashOver(B,c.x,c.y,100);koStars(B,L,c.x,c.y-160);ctx.restore();}});

/* ---------------- 3. LA LINTERNA MÁGICA ---------------- */
defBoss({id:'linterna',name:'La Linterna Mágica',sub:'Jefa extra · Desván de las Sombras',isl:3,hp:460,par:115,arena:'j5_desvan',song:'buho',x:780,y:GROUND,intro:'¡QUE EMPIECE LA FUNCIÓN DE SOMBRAS!',
  center(B){return{x:B.x,y:B.y-210};},
  anchor(B,n){if(n==='lens')return{x:B.x-120,y:B.y-210};if(n==='top')return{x:B.x,y:B.y-320};return null;},
  shapes(B){return[{x:B.x,y:B.y-210,r:80},{x:B.x-90,y:B.y-210,r:34}];},
  setup(B){B.bx=B.x;},
  move(B,dt,L){if(!B.act)B.x+=(B.bx+Math.sin(B.t*.6)*40-B.x)*Math.min(1,dt*2);},
  phases:[
    {atk:[{f:'aimed',every:1.7,from:'lens',n:3,spread:.3,spd:300,spr:'pluma',r:12,parry:3,sfx:'whoosh'},{f:'minion',every:5,from:'lens',ai:'flyer',skin:'sombrita',hp:3,r:18,max:2,spd:150}]},
    {banner:'¡FUNCIÓN DE SOMBRAS!',atk:[{f:'spiral',every:4,dur:2.2,rate:.14,arms:3,from:'lens',spr:'farolillo',r:12,spd:200,parry:6},{f:'column',every:3.5,n:3,gap:.5,style:'light',warn:.8,w:60},{f:'aimed',every:2.4,from:'lens',n:2,spread:.3,spd:300,spr:'pluma',r:12}]},
    {banner:'¡SE FUNDE LA BOMBILLA!',atk:[{f:'dark',every:9,dur:2.4},{f:'rain',every:2,n:6,spd:300,spr:'spark',r:11,parry:5},{f:'aimed',every:1.8,from:'lens',n:3,spread:.25,spd:330,spr:'pluma',r:12,parry:3},{f:'minion',every:6,from:'top',ai:'homer',skin:'sombrita',hp:3,r:18,max:2,spd:130}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    for(const s of[-1,0,1])line(x+s*14,y-140,x+s*80,y,7);ell(x,y-2,90,10,'rgba(0,0,0,.35)',0);
    ctx.globalAlpha=.18+.06*Math.sin(t*9);ctx.fillStyle='#fff3b0';ctx.beginPath();ctx.moveTo(x-140,y-232);ctx.lineTo(0,y-420);ctx.lineTo(0,y-40);ctx.lineTo(x-140,y-188);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
    rr(x-80,y-290,160,150,14,'#7a4a2a',5);for(let i=0;i<4;i++)line(x-70,y-270+i*34,x+70,y-270+i*34,2,'rgba(20,13,8,.3)');rr(x-86,y-300,172,20,6,C.brass,4);
    rr(x-24,y-370,48,74,6,'#5a3a22',4);poly([[x-36,y-370],[x,y-396],[x+36,y-370]],C.brass,3.5);for(let i=0;i<3;i++){const k=((t*.6+i/3)%1);ctx.globalAlpha=.6*(1-k);cloudShape(ctx,x+Math.sin(t*2+i)*8,y-400-k*60,.2+k*.2,'#3a3040',0);}ctx.globalAlpha=1;
    rr(x-150,y-236,70,52,10,C.brass,4);circ(x-150,y-210,30,'#fff3b0',4);circ(x-150,y-210,18,'#fffbe6',0);ell(x-158,y-218,6,8,'#fff',0);
    bossFace(B,L,x+10,y-222,.86,{gap:26,ew:14,eh:17,my:40,mw:32,open:B.mouth>0?.8:.3});
    if(ph>=2){for(let i=0;i<3;i++){const a=t*2+i*2.1;circ(x+Math.cos(a)*120,y-220+Math.sin(a)*60,6,'#120c1c',0);}}
    const c=B.center();flashOver(B,c.x,c.y,100);koStars(B,L,c.x,c.y-150);ctx.restore();
    ctx.save();ctx.globalAlpha=.55;ctx.translate(300+Math.sin(t*.9)*40,170+Math.cos(t*1.2)*14);ctx.fillStyle='#120c1c';ctx.beginPath();ctx.moveTo(-50,0);ctx.quadraticCurveTo(-20,-30-Math.sin(t*8)*14,0,0);ctx.quadraticCurveTo(20,-30-Math.sin(t*8)*14,50,0);ctx.quadraticCurveTo(0,14,-50,0);ctx.fill();ctx.restore();}});

/* ---------------- 4. EL REY HELADO ---------------- */
defBoss({id:'heladero',name:'El Rey Helado',sub:'Jefe extra · Heladería del Valle',isl:4,hp:520,par:125,arena:'j5_helado',song:'pinguino',x:740,y:GROUND,intro:'¡TRES BOLAS DE PURO FRÍO!',
  center(B){return{x:B.x,y:B.y-220};},
  anchor(B,n){if(n==='hand')return{x:B.x-110,y:B.y-210};if(n==='crown')return{x:B.x,y:B.y-400};if(n==='foot')return{x:B.x-80,y:B.y-30};return null;},
  shapes(B){return[{x:B.x,y:B.y-330,r:62},{x:B.x,y:B.y-210,r:60},{x:B.x,y:B.y-80,r:70}];},
  setup(B){B.bx=B.x;},
  move(B,dt,L){if(!B.act)B.x+=(B.bx+Math.sin(B.t*.7)*70-B.x)*Math.min(1,dt*2);},
  phases:[
    {atk:[{f:'lob',every:1.9,from:'hand',spr:'nieve',r:16,T:1.1,parry:3},{f:'aimed',every:2.3,from:'crown',n:3,spread:.25,spd:320,spr:'hielo',r:12}]},
    {banner:'¡TRIPLE BOLA!',atk:[{f:'rain',every:2.2,n:6,spd:300,spr:'hielo',r:12,parry:5},{f:'ring',every:2.8,from:'crown',n:10,spd:240,spr:'confeti',r:10,parry:4},{f:'roller',every:2.6,from:'foot',spr:'nieve',r:24,spd:380,parry:3,sfx:'knock'}]},
    {banner:'¡CONGELACIÓN CEREBRAL!',atk:[{f:'leap',every:3.4,landWave:true,T:1.1},{f:'column',every:3.2,n:3,gap:.5,style:'needle',warn:.75,w:56},{f:'aimed',every:1.9,from:'crown',n:4,spread:.3,spd:340,spr:'hielo',r:12,parry:4},{f:'lob',every:2.4,from:'hand',spr:'nieve',r:16,T:1,parry:3}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    ell(x,y-2,100,12,'rgba(20,13,8,.25)',0);
    rr(x-90,y-120,180,110,12,'#f6a8c0',4.5);for(let i=0;i<5;i++)rr(x-86+i*36,y-120,18,110,0,'#fff8ee',0);rr(x-90,y-120,180,110,12,null,4.5);
    for(const s of[-1,1]){circ(x+s*64,y-10,22,'#8a9098',4);circ(x+s*64,y-10,8,C.brass,2.5);}
    poly([[x-58,y-252],[x+58,y-252],[x,y-112]],'#e6b46a',4.5);
    for(let i=-2;i<=2;i++){line(x+i*22-12,y-250,x+i*6,y-130,2,'rgba(150,100,40,.6)');line(x+i*22+12,y-250,x+i*6,y-130,2,'rgba(150,100,40,.6)');}
    for(const s of[-1,1]){const hx=x+s*110,hy=y-210+Math.sin(t*4+s)*10;hose(x+s*40,y-240,x+s*80,y-260,hx,hy,8);glove(hx,hy,14);}
    const sc=[['#a0663a',y-262,60],['#fff4e0',y-318,56],['#f6a8c0',y-370,50]];
    sc.forEach(([c,yy,r],i)=>{const w=Math.sin(t*3+i)*3;ctx.beginPath();ctx.arc(x+w,yy,r,Math.PI*.95,Math.PI*2.05);for(let k=0;k<=6;k++)ctx.lineTo(x+w+r-k*(2*r/6),yy+10+(k%2)*10);ctx.closePath();ctx.fillStyle=c;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
      for(let k=0;k<5;k++)rr(x+w-r*.6+k*r*.3,yy-r*.5+(k%2)*14,8,3,1,['#e86a5a','#7bc6e8','#f2c14e','#b8e0c8'][k%4],0);});
    bossFace(B,L,x,y-322,.8,{gap:22,ew:12,eh:14,my:30,mw:26,open:B.mouth>0?.8:.25});
    poly([[x-36,y-410],[x-40,y-446],[x-18,y-428],[x,y-456],[x+18,y-428],[x+40,y-446],[x+36,y-410]],'#e6b46a',3.5);for(let i=0;i<3;i++)circ(x-24+i*24,y-420,5,['#e86a5a','#7bc6e8','#b8e0c8'][i],2);
    circ(x+4,y-462,9,'#c8392b',3);line(x+4,y-470,x+12,y-484,2.5);
    if(ph>=1){for(let i=0;i<(ph>=2?4:2);i++){const k=((t*.8+i*.3)%1);ell(x-60+i*40,y-230+k*60,4,6+k*4,'#fff4e0',2);}}
    if(ph>=2){ctx.globalAlpha=.5+.3*Math.sin(t*10);btxt('¡BRRR!',x+90,y-430,18,'#5aa8e8','center',900);ctx.globalAlpha=1;}
    const c=B.center();flashOver(B,c.x,c.y,110);koStars(B,L,c.x,c.y-200);ctx.restore();}});

/* ---------------- on the maps ---------------- */
addNode(1,{id:'cafetera',x:1250,y:500,kind:'level',ob:40,bld:'casita'});WORLDS[1].roads.push(['sign2','cafetera']);
addNode(2,{id:'buzo',x:1600,y:750,kind:'level',ob:40,bld:'coral'});WORLDS[2].roads.push(['sign2','buzo']);
addNode(3,{id:'linterna',x:780,y:430,kind:'level',ob:40,bld:'carpaMagia'});WORLDS[3].roads.push(['vela','linterna'],['linterna','buho']);
addNode(4,{id:'heladero',x:760,y:440,kind:'level',ob:40,bld:'pista'});WORLDS[4].roads.push(['tempano','heladero'],['heladero','cometa']);
if(typeof MAPBG!=='undefined')MAPBG={k:null};
})();
