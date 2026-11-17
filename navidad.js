/* navidad.js — the secret Christmas island, Isla Cascabel.
   How to get there: on Valle Escarcha, walk into the secret spot at the bottom of the island and open
   the mysterious present. From then on Capitán Remo can sail there.
   It has its own map, three bosses (El Abeto Gruñón, El Galletón de Jengibre and the flying
   El Trineo Desbocado), an elf, Christmas items in the shop and a storybook chapter.
   This file also makes the boat rule stricter: to sail on to the next island you must finish
   every level of the current one, including the run-and-gun levels. */
(function(){
const HC=(p,c)=>typeof hasCharm==='function'&&hasCharm(p,c);
const near=(L,x,y)=>typeof nearestEnt==='function'?nearestEnt(L,x,y):null;

/* ======================= ARENAS ======================= */
function vgrad(g,a,b,y0=0,y1=GROUND){const gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,a);gr.addColorStop(1,b);g.fillStyle=gr;g.fillRect(0,y0,W,y1-y0);}
Object.assign(ACZ,{
  nav_salon(g){vgrad(g,'#7a1f22','#5a1418');for(let x=0;x<W;x+=48){g.fillStyle=(x/48)%2?'rgba(40,90,50,.35)':'rgba(255,240,200,.06)';g.fillRect(x,0,24,GROUND);}
    gR(g,40,60,200,170,'#1a2a4a',5,6);for(let i=0;i<30;i++)gE(g,50+(i*37)%180,70+(i*53)%150,2.5,2.5,'#fff',0);g.strokeStyle='#f6e2b8';g.lineWidth=6;g.strokeRect(40,60,200,170);g.beginPath();g.moveTo(140,60);g.lineTo(140,230);g.moveTo(40,145);g.lineTo(240,145);g.stroke();
    gR(g,330,GROUND-220,300,220,'#b8784a',5,6);gR(g,380,GROUND-160,200,160,'#2a1a14',4,40);gR(g,310,GROUND-240,340,30,'#8a5a3a',5,6);
    for(let i=0;i<4;i++){const x=350+i*80;gR(g,x,GROUND-232,24,46,i%2?'#c8392b':'#2f7a4a',3,6);gR(g,x-4,GROUND-232,32,10,'#fff8ee',2.5,4);}
    g.strokeStyle='#2f7a4a';g.lineWidth=10;g.beginPath();g.moveTo(0,40);for(let x=0;x<=W;x+=60)g.quadraticCurveTo(x+30,70,x+60,40);g.stroke();for(let x=30;x<W;x+=60)gE(g,x,62,7,7,['#e8562e','#f2c14e','#7bc6e8'][(x/60|0)%3],2);
    g.fillStyle='#8a5a3a';g.fillRect(0,GROUND,W,H-GROUND);for(let y=GROUND;y<H;y+=18){g.fillStyle='rgba(0,0,0,.12)';g.fillRect(0,y,W,2);}for(let i=0;i<14;i++)gR(g,(i*71)%W,GROUND+((i*29)%60),3,18,'rgba(0,0,0,.12)',0,0);g.fillStyle='rgba(20,13,8,.85)';g.fillRect(0,GROUND,W,5);},
  nav_horno(g){vgrad(g,'#f6d9b0','#e8b88a');for(let x=0;x<W;x+=80){gR(g,x+6,30,68,40,'#f6a8c0',3,10);gE(g,x+40,44,6,6,'#fff',0);}
    gR(g,600,90,300,GROUND-90,'#8a8f98',5,10);gR(g,640,150,220,160,'#2a1a14',5,14);g.fillStyle='rgba(255,160,60,.6)';g.fillRect(650,250,200,50);for(let i=0;i<6;i++)gE(g,660+i*36,300,14,10,'#ff8a3a',0);
    gR(g,60,170,240,14,C.woodL,3,3);for(let i=0;i<5;i++)gE(g,90+i*45,158,16,14,['#a0663a','#c8392b','#2f7a4a'][i%3],2.5);
    g.fillStyle='#f4ecd8';g.fillRect(0,GROUND,W,H-GROUND);for(let y=GROUND,r=0;y<H;y+=24,r++)for(let x=(r%2)*48;x<W;x+=96){g.fillStyle='#e86a5a';g.fillRect(x,y,48,24);}g.fillStyle='rgba(20,13,8,.85)';g.fillRect(0,GROUND,W,5);}});

/* ======================= JEFES ======================= */
defBoss({id:'abeto',name:'El Abeto Gruñón',sub:'Jefe navideño · Salón del Árbol',isl:5,hp:500,par:120,arena:'nav_salon',song:'boss1b',x:750,y:GROUND,intro:'¡NADIE TOCA MIS REGALOS!',
  center(B){return{x:B.x,y:B.y-200};},
  anchor(B,n){if(n==='top')return{x:B.x,y:B.y-400};if(n==='branch')return{x:B.x-110,y:B.y-170};if(n==='foot')return{x:B.x-60,y:B.y-20};return null;},
  shapes(B){return[{x:B.x,y:B.y-110,r:96},{x:B.x,y:B.y-230,r:72},{x:B.x,y:B.y-330,r:46}];},
  setup(B){B.bx=B.x;},
  move(B,dt){if(!B.act)B.x+=(B.bx+Math.sin(B.t*.7)*50-B.x)*Math.min(1,dt*2);},
  phases:[
    {atk:[{f:'lob',every:1.8,from:'branch',spr:'ball',r:14,T:1.1,parry:3},{f:'aimed',every:2.2,from:'top',n:3,spread:.25,spd:300,spr:'star',r:11}]},
    {banner:'¡LUCES DE COLORES!',atk:[{f:'ring',every:2.8,from:'top',n:10,spd:220,spr:'spark',r:10,parry:4},{f:'column',every:3.4,n:2,gap:.5,style:'light',warn:.8,w:60},{f:'roller',every:2.8,from:'foot',spr:'bola',r:22,spd:360,parry:3}]},
    {banner:'¡ADORNOS FUERA!',atk:[{f:'rain',every:2,n:6,spr:'ball',r:12,spd:300,parry:5},{f:'spiral',every:3.8,from:'top',dur:2,rate:.12,arms:3,spr:'star',r:11,spd:210,parry:6},{f:'leap',every:4,landWave:true,T:1.1}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    ell(x,y-2,110,12,'rgba(20,13,8,.3)',0);rr(x-46,y-60,92,60,8,'#c8392b',4);rr(x-52,y-66,104,14,5,'#f2c14e',3);rr(x-14,y-90,28,34,4,'#6b3a26',3.5);
    const tiers=[[y-70,130,120],[y-180,104,110],[y-280,74,100]];
    tiers.forEach(([by,w,h],i)=>{const sw=Math.sin(t*2+i)*4;poly([[x-w+sw,by],[x+sw*.5,by-h],[x+w+sw,by]],i%2?'#3a8a52':'#2f7a4a',4.5);
      ctx.beginPath();ctx.moveTo(x-w*.8+sw,by-h*.25);ctx.quadraticCurveTo(x,by-h*.05,x+w*.8+sw,by-h*.4);ctx.lineWidth=4;ctx.strokeStyle='#f2c14e';ctx.stroke();
      for(let k=0;k<4;k++){const bx=x-w*.6+k*w*.4+sw,byy=by-10-(k%2)*16;circ(bx,byy,8,['#e8562e','#7bc6e8','#f2c14e','#c08aff'][(k+i)%4],2.5);ell(bx-2,byy-3,2,3,'rgba(255,255,255,.7)',0);}
      for(let k=0;k<6;k++){const on=Math.floor(t*4+k+i)%3===0;circ(x-w*.7+k*w*.28+sw,by-h*.3-(k%2)*10,4,on?'#fff6a8':'#8a7a40',1.5);}});
    ctx.save();ctx.translate(x,y-392);ctx.rotate(Math.sin(t*3)*.15);star(0,0,26,11,5,0);ctx.fillStyle=ph>=2?'#ff8a3a':'#ffe27a';ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();
    bossFace(B,L,x,y-210,.95,{gap:30,ew:15,eh:17,my:40,mw:36,open:B.mouth>0?.8:.3});for(const s of[-1,1])line(x+s*14,y-246,x+s*40,y-238+(ph?6:0),5);
    for(const s of[-1,1]){const hx=x+s*130,hy=y-160+Math.sin(t*4+s)*12;hose(x+s*80,y-150,x+s*110,y-170,hx,hy,9);glove(hx,hy,15);}
    const c=B.center();flashOver(B,c.x,c.y,110);koStars(B,L,c.x,c.y-200);ctx.restore();}});

defBoss({id:'jengibre',name:'El Galletón de Jengibre',sub:'Jefe navideño · Horno de la Abuela',isl:5,hp:520,par:125,arena:'nav_horno',song:'tostada',x:740,y:GROUND,intro:'¡CÓGEME SI PUEDES!',
  center(B){return{x:B.x,y:B.y-170};},
  anchor(B,n){if(n==='hand')return{x:B.x-120,y:B.y-170};if(n==='head')return{x:B.x,y:B.y-290};if(n==='foot')return{x:B.x-70,y:B.y-20};return null;},
  shapes(B){return[{x:B.x,y:B.y-280,r:62},{x:B.x,y:B.y-130,r:80}];},
  setup(B){B.bx=B.x;},
  move(B,dt){if(!B.act)B.x+=(B.bx+Math.sin(B.t*.9)*70-B.x)*Math.min(1,dt*2.2);},
  phases:[
    {atk:[{f:'aimed',every:1.6,from:'hand',n:3,spread:.25,spd:320,spr:'crumb',r:11,parry:3},{f:'roller',every:2.6,from:'foot',spr:'bola',r:22,spd:360,parry:3}]},
    {banner:'¡GLASEADO!',atk:[{f:'rain',every:2.2,n:6,spr:'drop',r:11,spd:280,parry:5},{f:'leap',every:3.6,landWave:true,T:1.1},{f:'lob',every:2.4,from:'hand',spr:'bloque',r:14,T:1.1,parry:3}]},
    {banner:'¡A MORDISCOS!',atk:[{f:'charge',every:4.2,warn:.9,spd:760},{f:'ring',every:2.8,from:'head',n:10,spd:230,spr:'crumb',r:10,parry:4},{f:'column',every:3.4,n:2,gap:.5,style:'stamp',warn:.8,w:60}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);const col='#c47a3a';
    ell(x,y-2,100,12,'rgba(20,13,8,.3)',0);
    for(const s of[-1,1]){ctx.save();ctx.translate(x+s*44,y-70);ctx.rotate(s*.15+Math.sin(t*6+s)*.1);rr(-26,0,52,72,24,col,4.5);ctx.beginPath();ctx.moveTo(-18,50);for(let i=0;i<5;i++)ctx.lineTo(-18+i*9,46+(i%2)*8);ctx.lineWidth=3;ctx.strokeStyle='#fff8ee';ctx.stroke();ctx.restore();}
    for(const s of[-1,1]){ctx.save();ctx.translate(x+s*80,y-180);ctx.rotate(s*(-.5+Math.sin(t*5+s)*.3));rr(-22,-22,90*s>0?90:90,44,22,col,4.5);ctx.restore();}
    rr(x-80,y-230,160,170,60,col,5);for(let i=0;i<3;i++)circ(x,y-200+i*44,9,['#e8562e','#2f7a4a','#f2c14e'][i],3);
    ctx.beginPath();ctx.moveTo(x-70,y-100);for(let i=0;i<9;i++)ctx.lineTo(x-70+i*17.5,y-100+(i%2)*10);ctx.lineWidth=4;ctx.strokeStyle='#fff8ee';ctx.stroke();
    circ(x,y-288,66,col,5);ctx.beginPath();ctx.arc(x,y-288,54,.2*Math.PI,.8*Math.PI);ctx.lineWidth=4;ctx.strokeStyle='#fff8ee';ctx.stroke();
    bossFace(B,L,x,y-296,.85,{gap:24,ew:13,eh:15,my:32,mw:28,open:B.mouth>0?.85:.3});
    if(ph>=1){circ(x+44,y-330,16,'#f4ecd8',0);circ(x+52,y-336,10,'#f4ecd8',0);}
    if(ph>=2){ctx.beginPath();ctx.arc(x+40,y-330,20,-.4,1);ctx.lineTo(x+40,y-330);ctx.closePath();ctx.fillStyle='#f6d9b0';ctx.fill();}
    const c=B.center();flashOver(B,c.x,c.y,110);koStars(B,L,c.x,c.y-170);ctx.restore();}});

defBoss({id:'trineo',kind:'plane',name:'El Trineo Desbocado',sub:'Jefe aéreo · Cielo de Nochebuena',isl:5,hp:480,par:125,arena:'plane_navidad',song:'pinguino',x:770,y:250,intro:'¡SIN FRENOS EN NOCHEBUENA!',
  center(B){return{x:B.x,y:B.y};},anchor(B,n){if(n==='sack')return{x:B.x+30,y:B.y-60};if(n==='front')return{x:B.x-120,y:B.y+10};return{x:B.x,y:B.y};},
  shapes(B){return[{x:B.x,y:B.y,r:80},{x:B.x+30,y:B.y-60,r:50}];},
  move(B,dt){const t=B.t,sp=1+B.phase*.3;B.x=lerp(B.x,760+Math.sin(t*.7*sp)*80,Math.min(1,dt*2.4));B.y=lerp(B.y,250+Math.sin(t*1.3*sp)*130,Math.min(1,dt*2.4));},
  phases:[
    {atk:[{f:'aimed',every:1.2,from:'front',n:3,spread:.22,spd:320,spr:'confeti',r:10,parry:4},{f:'rain',every:2,n:4,spr:'nieve',r:11,spd:[240,320]}]},
    {banner:'¡CASCABELES!',atk:[{f:'ring',every:2.6,from:'sack',n:12,spd:220,spr:'bell',r:10,parry:4},{f:'boomer',every:2.8,from:'front',spr:'bloque',r:14,parry:2},{f:'minion',every:3.2,ai:'homer',skin:'nube',hp:3,r:20,max:3,spd:120,from:'sack'}]},
    {banner:'¡SIN FRENOS!',atk:[{f:'tele',every:4.2},{f:'spiral',every:3,from:'sack',dur:1.8,rate:.1,spd:230,spr:'star',r:11,arms:3,parry:6},{f:'wall',every:5.5,spr:'nieve',gap:170,spd:250}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y,ph=B.phase;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*3)*.06);ctx.lineJoin='round';ctx.lineCap='round';
    for(let i=0;i<6;i++){const k=((t*2+i/6)%1);star(110+k*120,10+Math.sin(t*6+i)*12,5*(1-k)+2,2,5,t*5);ctx.fillStyle='#ffe27a';ctx.fill();}
    ctx.beginPath();ctx.moveTo(-130,40);ctx.quadraticCurveTo(-150,60,-120,66);ctx.lineTo(110,66);ctx.quadraticCurveTo(130,66,126,50);ctx.lineWidth=6;ctx.strokeStyle=C.brass;ctx.stroke();
    ctx.beginPath();ctx.moveTo(-110,-10);ctx.quadraticCurveTo(-140,-50,-110,-60);ctx.lineTo(-80,40);ctx.lineTo(100,40);ctx.lineTo(110,-20);ctx.closePath();ctx.fillStyle='#c8392b';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.beginPath();ctx.moveTo(-80,10);ctx.lineTo(100,10);ctx.lineWidth=4;ctx.strokeStyle='#f2c14e';ctx.stroke();
    ctx.save();ctx.translate(30,-60);ctx.rotate(Math.sin(t*4)*.08);ctx.beginPath();ctx.ellipse(0,0,64,56,0,0,TAU);ctx.fillStyle='#a0663a';ctx.fill();ctx.lineWidth=4.5;ctx.stroke();for(const [a,b,c] of[[-30,-50,'#2f7a4a'],[10,-62,'#7bc6e8'],[40,-44,'#f2c14e']]){rr(a-12,b-12,24,24,3,c,3);line(a,b-12,a,b+12,2.5,'#c8392b');}
    face(-6,4,.75,{look:lookAt(L,x,y),dead:B.dead,ang:.2+ph*.15,mouth:'grin',my:28,mw:22,open:ph?.7:.3});ctx.restore();
    for(let i=0;i<3;i++){const bx=-60+i*50,by=46+Math.sin(t*10+i)*3;circ(bx,by,8,C.goldL,2.5);line(bx-6,by+2,bx+6,by+2,1.5);}
    flashOver(B,0,-20,100);ctx.restore();}});

/* ======================= EL MAPA DE LA ISLA CASCABEL ======================= */
WORLDS[5]={name:'Isla Cascabel',song:'map4',W:2000,H:1250,seed:31,sea:'#3a5a7a',seaD:'#2a4560',grass:'#eef4f8',grassD:'#c8d6e0',sand:'#e2dccc',tree:'pine',night:true,start:[430,960],dockArr:[430,960],
  isles:[{x:1000,y:650,rx:820,ry:470},{x:420,y:330,rx:260,ry:150},{x:1560,y:330,rx:280,ry:160}],ponds:[],bridges:[],
  nodes:[{id:'dock',x:380,y:1010,kind:'dock',name:'Capitán Remo',ob:20},{id:'shop',x:640,y:900,kind:'shop',name:'Bazar de Don Tornillo',ob:36,bld:'tienda'},
    {id:'abeto',x:700,y:420,kind:'level',ob:40,bld:'arbolnav'},{id:'jengibre',x:1350,y:820,kind:'level',ob:40,bld:'casajengibre'},{id:'trineo',x:1500,y:380,kind:'level',ob:40,bld:'trineobld'},
    {id:'duende',x:880,y:820,kind:'npc',npc:'duende',name:'Duende Ramón',ob:14},{id:'arbolnav',x:1030,y:560,kind:'npc',npc:'arbolnav',name:'El Gran Abeto de la Plaza',ob:30},
    {id:'sign1',x:520,y:800,kind:'sign',name:'Letrero',text:'Isla Cascabel. Aquí siempre es Nochebuena. Tres jefes se han vuelto locos con tanto turrón: ¡ponlos en su sitio!'},
    {id:'tree1',x:1200,y:1020,kind:'tree',name:'Pino con regalos',ob:22,coin:'w5-tree'}],
  coins:[{id:'w5-c1',x:300,y:640},{id:'w5-c2',x:1760,y:620}],items:[],
  roads:[['dock','shop'],['shop','sign1'],['shop','duende'],['duende','arbolnav'],['arbolnav','abeto'],['arbolnav','jengibre'],['arbolnav','trineo'],['duende','jengibre']],windmills:[]};
BOSS_LIST[5]=['abeto','jengibre','trineo'];RUN_LIST[5]=[];for(const k of BOSS_LIST[5])if(!ALL_LEVELS.includes(k))ALL_LEVELS.push(k);

/* the secret present in the hidden spot at the bottom of Valle Escarcha */
WORLDS[4].nodes.push({id:'regalo',x:1000,y:1150,kind:'npc',npc:'regalo',name:'¿Un regalo?',ob:12});

const NB=['arbolnav','casajengibre','trineobld'];
const _dbN=drawBld;
drawBld=function(n,t,night){if(!NB.includes(n.bld)){_dbN(n,t,night);return;}const x=n.x,y=n.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;shadowE(x,y+2,(n.ob||20)+14,.22);
  if(n.bld==='arbolnav'){rr(x-8,y-20,16,20,2,'#6b3a26');for(let i=0;i<3;i++)poly([[x-44+i*10,y-18-i*30],[x,y-60-i*30],[x+44-i*10,y-18-i*30]],'#2f7a4a');for(let i=0;i<8;i++)circ(x-30+(i*17)%60,y-30-(i*23)%80,4,Math.floor(t*3+i)%2?'#ffe27a':['#e8562e','#7bc6e8'][i%2],1.5);star(x,y-112,12,5,5,t);ctx.fillStyle='#ffe27a';ctx.fill();ctx.stroke();}
  else if(n.bld==='casajengibre'){rr(x-40,y-50,80,50,4,'#c47a3a');poly([[x-50,y-48],[x,y-90],[x+50,y-48]],'#fff8ee');for(let i=0;i<5;i++)circ(x-36+i*18,y-48,4,['#e8562e','#2f7a4a','#f2c14e'][i%3],1.5);rr(x-12,y-30,24,30,10,'#e8562e');rr(x-34,y-40,16,14,3,'#ffe9a0',2.5);rr(x+18,y-40,16,14,3,'#ffe9a0',2.5);
    ctx.save();ctx.translate(x+30,y-96);for(let i=0;i<3;i++){const k=((t*.6+i/3)%1);ctx.globalAlpha=.7*(1-k);cloudShape(ctx,Math.sin(t+i)*4,-k*40,.1+k*.15,'#ddd',0);}ctx.restore();rr(x+24,y-84,12,20,2,'#a0663a',2.5);}
  else{rr(x-50,y-36,100,36,6,'#4a5a6a');rr(x-40,y-30,80,26,4,'#2a3440',2.5);ctx.save();ctx.translate(x,y-52+Math.sin(t*2)*4);rr(-34,-14,64,22,8,'#c8392b',3);ctx.beginPath();ctx.moveTo(-40,10);ctx.quadraticCurveTo(-48,16,-38,18);ctx.lineTo(34,18);ctx.lineWidth=3;ctx.strokeStyle=C.brass;ctx.stroke();ell(10,-22,18,14,'#a0663a',3);ctx.restore();}
  ctx.restore();};
const _dnN=drawNPC;
drawNPC=function(id,x,y,t){if(!['regalo','duende','arbolnav'].includes(id)){_dnN(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;shadowE(0,0,18);
  if(id==='regalo'){const b=Math.abs(Math.sin(t*3))*4;rr(-18,-34-b,36,32,4,'#c8392b');rr(-4,-34-b,8,32,0,'#f2c14e',0);rr(-20,-40-b,40,10,3,'#c8392b');rr(-4,-40-b,8,10,0,'#f2c14e',0);ell(-8,-46-b,8,5,'#f2c14e',2);ell(8,-46-b,8,5,'#f2c14e',2);
    if(!(save.flags&&save.flags.navidad)){for(let i=0;i<4;i++){const a=t*2+i*1.6;star(Math.cos(a)*26,-30+Math.sin(a)*16,4,1.6,4,0);ctx.fillStyle='#fff6c8';ctx.fill();}}}
  else if(id==='duende'){const b=Math.sin(t*4)*2;rr(-12,-30+b,24,26,8,'#2f7a4a');circ(0,-40+b,12,'#f0c9a0');poly([[-12,-46+b],[16,-74+b],[12,-44+b]],'#c8392b');circ(16,-74+b,4,'#fff',1.5);poly([[-12,-40+b],[-22,-46+b],[-12,-36+b]],'#f0c9a0',2);circ(-4,-42+b,1.8,C.ink,0);circ(4,-42+b,1.8,C.ink,0);rr(-12,-12+b,24,4,1,'#1b130d',0);}
  else{rr(-10,-24,20,24,2,'#6b3a26');for(let i=0;i<4;i++)poly([[-60+i*12,-20-i*36],[0,-70-i*36],[60-i*12,-20-i*36]],'#2f7a4a');for(let i=0;i<14;i++)circ(-44+(i*29)%90,-34-(i*41)%130,4.5,Math.floor(t*3+i)%2?'#ffe27a':['#e8562e','#7bc6e8','#c08aff'][i%3],1.5);ctx.save();ctx.translate(0,-200);ctx.rotate(Math.sin(t*2)*.1);star(0,0,18,7,5,0);ctx.fillStyle='#ffe27a';ctx.fill();ctx.stroke();ctx.restore();}
  ctx.restore();};
const _ntN=npcTalk;
npcTalk=function(n){const f=save.flags;
  if(n.npc==='regalo'){sfx('pageTurn');if(!f.navidad){f.navidad=true;persist();sfx('achieve');say('¿Un regalo?','Una caja con un lazo dorado y una etiqueta: «Para Chispa y Cerilla. Del Duende Ramón». Dentro hay un mapa de una isla que no sale en ningún libro… ¡Isla Cascabel! Habla con el Capitán Remo para navegar hasta allí.');if(typeof unlockAch==='function')unlockAch('navidad');}
    else say('El regalo','La caja está vacía, pero huele a turrón. El Capitán Remo ya conoce el camino a Isla Cascabel.');return;}
  if(n.npc==='duende'){sfx('pageTurn');const c=cleared(BOSS_LIST[5]);say('Duende Ramón',c>=3?'¡Lo conseguisteis! El Abeto, el Galletón y el Trineo vuelven a portarse bien. Feliz Navidad, de verdad de la buena.':c>0?`¡Vais bien! Os quedan ${3-c} jefes navideños. Truco de duende: el Trineo vuela sin frenos, así que haced parry a los cascabeles rosas.`:'¡Hola, hola! Soy Ramón. Os mandé el regalo porque aquí se ha liado gorda: el Abeto, el Galletón de Jengibre y el Trineo se han vuelto locos con tanto turrón. ¡Ayudadnos!');return;}
  if(n.npc==='arbolnav'){sfx('ding');say('El Gran Abeto de la Plaza','Las luces parpadean al ritmo de un villancico que nadie recuerda. En la punta, una estrella que se parece muchísimo a un trocito de la Bombilla Madre…');return;}
  _ntN(n);};
const _maN=mapAmbience;
mapAmbience=function(w,M){_maN(w,M);if(save.island!==5)return;const t=M.t,cx=clamp(M.x-W/2,0,w.W-W),cy=clamp(M.y-H/2,0,w.H-H);ctx.save();
  for(let i=0;i<70;i++){const x=cx+(((i*97+t*(14+i%4*6))%W)+W)%W,y=cy+((i*53+t*(36+i%3*14))%H);circ(x+Math.sin(t*2+i)*6,y,1.4+(i%3),'rgba(255,255,255,.9)',0);}ctx.restore();};

/* ======================= EL BARCO: todos los niveles para avanzar ======================= */
const SKIPK=['cine','casino'];
window.islandLeft=function(i){const w=WORLDS[i];if(!w)return[];return w.nodes.filter(n=>n.kind==='level'&&LEVELS[n.id]&&!SKIPK.includes(LEVELS[n.id].kind)&&!SKIPK.includes(n.id)&&!save.cleared[n.id]).map(n=>n.id);};
dockTalk=function(){const isl=save.island,opts=[];
  const go=i=>()=>{transition(()=>{save.pos[save.island]=[MAPS.x,MAPS.y];save.island=i;save.visited[i]=true;const w=WORLDS[i];save.pos[i]=w.dockArr;persist();MAPBG={k:null};placeOnMap();MAPS.jukebox=null;MAPS.banner={t:3,text:w.name};toMap();});};
  const done=i=>islandLeft(i).length===0;
  const names={1:'Isla de Hojalata',2:'Bahía Bruma',3:'Cumbre Apagón',4:'Valle Escarcha',5:'Isla Cascabel (secreta)'};
  for(let i=1;i<=4;i++){if(i===isl)continue;if(i===1||save.visited[i]||done(i-1))opts.push({label:'Viajar a '+names[i],fn:go(i)});}
  if(isl!==5&&save.flags&&save.flags.navidad)opts.push({label:'Viajar a '+names[5],fn:go(5)});
  opts.push({label:'Quedarme aquí',fn:()=>{}});
  const left=isl<=4?islandLeft(isl):[];let txt0='¡Ahoy! ¿A qué isla navegamos?';
  if(isl<4&&!save.visited[isl+1]&&left.length)txt0=`¡Ahoy! Mi barco no zarpa a la siguiente isla hasta que completes TODOS los niveles de aquí, también los de correr y disparar. Te faltan ${left.length}: ${left.map(id=>LEVELS[id].name).slice(0,4).join(', ')}${left.length>4?'…':''}.`;
  else if(isl<4&&!save.visited[isl+1])txt0=`¡Ahoy! ¡Has completado toda la isla! Ya podemos zarpar hacia ${names[isl+1]}.`;
  else if(isl===5)txt0='¡Ahoy! Qué frío hace aquí… ¿Volvemos?';
  say('Capitán Remo',txt0,opts);};

/* ======================= TIENDA NAVIDEÑA ======================= */
function drawBaston(b,L){ctx.translate(b.x,b.y);ctx.rotate(L.t*14+b.x*.02);ctx.lineCap='round';ctx.lineWidth=8;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(0,16);ctx.lineTo(0,-6);ctx.arc(6,-6,6,Math.PI,0);ctx.stroke();ctx.lineWidth=5;ctx.strokeStyle='#fff8ee';ctx.stroke();
  ctx.setLineDash([4,4]);ctx.strokeStyle='#e23b3b';ctx.stroke();ctx.setLineDash([]);}
function drawBolaNieve(b,L){ctx.translate(b.x,b.y);ctx.rotate(L.t*4);circ(0,0,b.r,'#f4f8fb',3);ell(-b.r*.3,-b.r*.35,b.r*.3,b.r*.2,'#fff',0);ell(b.r*.25,b.r*.2,b.r*.25,b.r*.15,'rgba(150,180,210,.5)',0);}
WEAPONS.bastones={name:'Bastones de Caramelo',price:6,isl:5,desc:'Bastones de caramelo que giran como hélices y atraviesan al primer enemigo. Muy buenos a cualquier distancia.',exd:'EX: una ventisca de diez bastones.',
  fire(L,p,h,ax,ay){p.cool=.24;p._bt=(p._bt||0)+1;const s=p._bt%2?1:-1;B_(L,p,{x:h.x,y:h.y+s*6,vx:ax*900-ay*s*60,vy:ay*900+ax*s*60,r:11,dmg:2.5,life:1.2,k:'baston',pierce:true,draw:drawBaston});},
  ex(L,p,h,ax,ay){const a0=Math.atan2(ay,ax);for(let i=0;i<10;i++){const a=a0+(i-4.5)*.1;B_(L,p,{x:h.x,y:h.y,vx:Math.cos(a)*800,vy:Math.sin(a)*800,r:14,dmg:2.6,life:1.4,k:'baston',pierce:true,draw:drawBaston});}}};
SHOTS.bastones=()=>{tn(1568,.05,{type:'sine',v:.025});tn(2093,.05,{type:'sine',v:.018,at:.03});};
CHARMS.calcetin={name:'Calcetín Navideño',price:5,isl:5,desc:'Un corazón más y empiezas cada pelea con 2 cartas de súper. ¡Los regalos más útiles!'};
SUPERS.nevada={name:'Gran Nevada',price:6,isl:5,desc:'Durante tres segundos caen bolas de nieve gigantes justo encima del enemigo.'};
Object.assign(SKINS,{skin_navidad:{name:'Gorro Navideño',price:3,isl:5,desc:'Gorro rojo con pompón blanco. ¡Jo, jo, jo!',acc:'gorronav',trail:'star',tcol:'#ffffff'},
  skin_reno:{name:'Renito',price:4,isl:5,desc:'Cuernos de reno y una nariz roja que brilla en la oscuridad.',acc:'reno'}});
const _npN=newPlayer;newPlayer=function(L,i,type,x,y){const p=_npN(L,i,type,x,y);if(p.eq&&p.eq.charm==='calcetin'){p.hp++;p.maxHp++;p.cards=Math.max(p.cards,2);}return p;};
const _ssN=startSuper;startSuper=function(L,p){if((p.eq.sup||'chispazo')!=='nevada'){_ssN(L,p);return;}if(typeof unlockAch==='function')unlockAch('super');
  p.cards=0;L.supers++;p.superK='nevada';p.superT=.5;p.inv=Math.max(p.inv,1.2);L.superFlash=.35;sfx('super');shake(L,10);banner(L,'¡GRAN NEVADA!',1.1);
  const b=B_(L,p,{x:L.camX+W/2,y:-50,vx:.001,vy:0,r:1,dmg:0,life:3.2,k:'nevadaCtl',pierce:true,draw:()=>{},t:0,tk:0,noGain:true});
  b.upd=(b,L,dt)=>{b.t+=dt;b.y=-50;b.tk-=dt;if(b.tk<=0&&b.t<3){b.tk=.16;const tg=near(L,L.camX+W/2,200),tx=tg?tg.center().x:L.camX+W*.6;B_(L,p,{x:tx+(rand()-.5)*160,y:-20,vx:(rand()-.5)*60,vy:600,r:26,dmg:3.2,life:2,k:'bolanieve',draw:drawBolaNieve,noGain:true});}};};
const _dsaN=drawSkinAcc;drawSkinAcc=function(o,ch,fy,f,ex){const sk=SKINS[o.skin];if(!sk||(sk.acc!=='gorronav'&&sk.acc!=='reno')){_dsaN(o,ch,fy,f,ex);return;}
  ctx.save();ctx.filter='none';ctx.lineJoin='round';const top=fy-(ch==='cerilla'?20:ch==='velita'?22:26);
  if(sk.acc==='gorronav'){ctx.beginPath();ctx.moveTo(-18,top+2);ctx.quadraticCurveTo(-6,top-30,22*f,top-18);ctx.quadraticCurveTo(10,top-8,18,top+2);ctx.closePath();ctx.fillStyle='#c8392b';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();rr(-20,top-2,40,9,4,'#fff8ee',2.5);circ(22*f,top-18,6,'#fff8ee',2.5);}
  else{for(const s of[-1,1]){ctx.lineWidth=4;ctx.strokeStyle='#8a5a3a';ctx.beginPath();ctx.moveTo(s*10,top+2);ctx.lineTo(s*18,top-22);ctx.moveTo(s*15,top-12);ctx.lineTo(s*26,top-16);ctx.moveTo(s*17,top-18);ctx.lineTo(s*12,top-28);ctx.stroke();}
    circ(ex+8*f,fy+8,6,'#e23b3b',2);circ(ex+6*f,fy+6,2,'rgba(255,255,255,.8)',0);}
  ctx.restore();};
const _iiN=itemIcon;itemIcon=function(id,x,y,t){if(!['bastones','calcetin','nevada'].includes(id)){_iiN(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  if(id==='bastones'){for(const s of[-1,1]){ctx.save();ctx.translate(s*8,0);ctx.rotate(s*.3+Math.sin(t*3)*.1);ctx.scale(1.4,1.4);drawBaston({x:0,y:0},{t:0});ctx.restore();}}
  else if(id==='calcetin'){ctx.rotate(Math.sin(t*2)*.1);ctx.beginPath();ctx.moveTo(-10,-20);ctx.lineTo(8,-20);ctx.lineTo(8,6);ctx.quadraticCurveTo(22,8,20,20);ctx.lineTo(-6,20);ctx.quadraticCurveTo(-12,12,-10,6);ctx.closePath();ctx.fillStyle='#c8392b';ctx.fill();ctx.stroke();rr(-13,-26,24,10,4,'#fff8ee',2.5);star(0,-2,5,2,5,t);ctx.fillStyle='#ffe27a';ctx.fill();}
  else{for(let i=0;i<3;i++){const k=((t*.8+i/3)%1);ctx.save();drawBolaNieve({x:-14+i*14,y:-20+k*36,r:8},{t});ctx.restore();}}
  ctx.restore();};

/* achievements + chapter of the storybook */
for(const a of [['navidad','¡Feliz Navidad!','Encuentra el regalo secreto del Valle Escarcha.',2],['isla5','Espíritu Navideño','Vence a los tres jefes de Isla Cascabel.',3]]){if(!ACHD[a[0]]){ACH.push(a);ACHD[a[0]]={id:a[0],name:a[1],desc:a[2],coins:a[3]};}}
STORIES.isla5=[{cap:'Capítulo extra · Isla Cascabel',t:'Detrás de la última niebla del Valle Escarcha apareció una isla donde siempre era Nochebuena: luces en cada pino, olor a galleta y cascabeles colgando de las farolas.',d:'navidad'},
  {t:'Pero el turrón se había subido a la cabeza de sus vecinos. El Abeto no dejaba tocar los regalos, el Galletón huía de todo el mundo y el Trineo volaba sin frenos.',d:'navidad',jefes:true},
  {t:'«¡Feliz Navidad!», gritó Velita, y los tres héroes salieron corriendo por la nieve a repartir un poco de orden… y algún que otro chispazo.',d:'heroes',pose:'fiesta'}];
STORIES.fin5=[{cap:'¡Feliz Navidad!',t:'Con el último cascabel en su sitio, la isla entera brindó con chocolate caliente. En la punta del Gran Abeto brillaba un trocito de luz que nadie sabía de dónde había salido.',d:'navidad',fin:true}];
window.EXTRA_SCN=Object.assign(window.EXTRA_SCN||{},{navidad(p,t){const g=ctx.createLinearGradient(0,0,0,300);g.addColorStop(0,'#1a2a4a');g.addColorStop(1,'#3a5a8a');ctx.fillStyle=g;ctx.fillRect(0,0,400,300);
  for(let i=0;i<30;i++)circ((i*71)%400,(i*37)%180,1.3,'#fff6c8',0);ctx.fillStyle='#eef4f8';ctx.beginPath();ctx.moveTo(0,300);ctx.lineTo(0,220);ctx.quadraticCurveTo(200,190,400,225);ctx.lineTo(400,300);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
  for(let i=0;i<3;i++)poly([[160-i*0,230-i*40],[200,170-i*40-30],[240,230-i*40]],'#2f7a4a',3);for(let i=0;i<10;i++)circ(170+(i*13)%60,200-(i*29)%100,4,Math.floor(t*3+i)%2?'#ffe27a':'#e8562e',1.5);star(200,62,14,6,5,t);ctx.fillStyle='#ffe27a';ctx.fill();ctx.stroke();
  rr(60,200,60,36,4,'#c47a3a',3);poly([[54,202],[90,176],[126,202]],'#fff8ee',3);rr(290,206,50,30,4,'#c8392b',3);rr(310,206,10,30,0,'#f2c14e',0);
  if(p.jefes){ctx.save();ctx.translate(330,120+Math.sin(t*2)*10);ctx.scale(.25,.25);rr(-110,-10,220,50,10,'#c8392b',4);ctx.restore();}
  if(p.fin){for(let i=0;i<18;i++){const x=(i*41+t*50)%400,y=(i*23+t*90)%300;rr(x,y,6,9,1,['#e86a5a','#f2c14e','#7bb7c9'][i%3],0);}}
  for(let i=0;i<40;i++){const x=(i*37+t*20)%400,y=(i*53+t*40)%300;circ(x,y,1.8,'#fff',0);}
  hero('chispa',100,290,.55,{anim:t*6,run:true});hero('cerilla',150,290,.55,{anim:t*6+1,run:true});hero('velita',250,290,.55,{anim:t*6+2,run:true});}});
function hero(ch,x,y,s,o={}){drawHero(Object.assign({x,y,char:ch,face:1,anim:0,run:false,scale:s,aimX:1,aimY:0,flash:false},o));}
const _toN=toMap;toMap=function(){_toN();if(save.island===5&&!save.flags.cap5&&!(typeof NP!=='undefined'&&NP.on)){save.flags.cap5=true;persist();startStory('isla5');ST.after=()=>{_toN();};}};
const _alN=afterLevel;afterLevel=function(L){const win=!(L.result&&L.result.fail);if(win&&BOSS_LIST[5].includes(L.id)&&BOSS_LIST[5].every(k=>save.cleared[k]||k===L.id)){if(typeof unlockAch==='function')unlockAch('isla5');
    if(!save.flags.fin5&&!(typeof NP!=='undefined'&&NP.on)){save.flags.fin5=true;persist();startStory('fin5');ST.after=()=>_alN(L);return;}}_alN(L);};
if(typeof refreshShopTabs==='function')refreshShopTabs();
if(typeof MAPBG!=='undefined')MAPBG={k:null};
})();
