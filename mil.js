/* mil.js — the "MIL COSAS" update:
   - 3 new bosses, each transforming between its 3 phases:
       La Reina Colmena (Bahía Bruma) · El Dragón Farolillo (Cumbre Apagón) · El Doctor Tornillo (Valle Escarcha)
   - 3 new run-and-gun levels with their own backgrounds and 5 coins each:
       La Gran Cocina (Hojalata) · Cuevas de Cristal (Valle Escarcha) · Taller del Duende (Isla Cascabel)
   - 2 new mini-bosses: Doña Olla and Gema la Golem
   - 3 new charms: Piedra de Afilar (your parry hurts), Imán de Monedas, Corazón Roto (1 heart, much more damage)
   - 10 hidden coins on the overworld maps (2 per island), like the secret coins of old cartoons games
   - "Da Goat": reach 100 % (every level in the game) and you get the achievement + the golden goat skin
   - the % now counts EVERY level (bosses, plane, run-and-gun and mausoleums)
   Everything new is deterministic in the simulation, so online play stays in sync. */
(function(){
const hs=i=>{const s=Math.sin(i*12.9898+78.233)*43758.5453;return s-Math.floor(s);};
function vgrad(g,a,b,y0=0,y1=GROUND){const gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,a);gr.addColorStop(1,b);g.fillStyle=gr;g.fillRect(0,y0,W,y1-y0);}
function floorTiles(g,c1,c2,sz=48){g.fillStyle=c1;g.fillRect(0,GROUND,W,H-GROUND);for(let y=GROUND,r=0;y<H;y+=sz/2,r++)for(let x=(r%2)*sz;x<W;x+=sz*2){g.fillStyle=c2;g.fillRect(x,y,sz,sz/2);}g.fillStyle='rgba(20,13,8,.85)';g.fillRect(0,GROUND,W,5);}
function hexG(g,x,y,r,fill){g.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3+Math.PI/6;g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}g.closePath();g.fillStyle=fill;g.fill();g.lineWidth=2.5;g.strokeStyle='rgba(20,13,8,.55)';g.stroke();}
function flame(x,y,h,w,t,i=0){const f=Math.sin(t*14+i*2.3)*.18;ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w*1.1,y-h*.55,x+w*f*3,y-h);ctx.quadraticCurveTo(x+w*1.1,y-h*.55,x+w,y);ctx.closePath();ctx.fillStyle='#ff7a2e';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-w*.5,y);ctx.quadraticCurveTo(x-w*.5,y-h*.4,x+w*f*2,y-h*.62);ctx.quadraticCurveTo(x+w*.5,y-h*.4,x+w*.5,y);ctx.closePath();ctx.fillStyle='#ffe27a';ctx.fill();}
function gear(x,y,r,n,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();for(let i=0;i<n*4;i++){const a=i*TAU/(n*4),rr2=(i%4<2)?r*1.22:r;ctx.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2);}ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();circ(0,0,r*.36,C.ink,0);ctx.restore();}

/* ===================================== ARENAS ===================================== */
Object.assign(ACZ,{
  m_panal(g){vgrad(g,'#f8d98a','#e8a94a');for(let y=-10,r=0;y<GROUND;y+=46,r++)for(let x=(r%2)*40-40;x<W+40;x+=80)hexG(g,x,y,26,(r+x/80)%3<1?'#f2c14e':'#e9b23c');
    g.fillStyle='#d98a1e';g.fillRect(0,0,W,26);for(let i=0;i<16;i++){const x=i*62+20,h=20+(i*37)%46;g.beginPath();g.moveTo(x-10,24);g.quadraticCurveTo(x-10,24+h,x,24+h+10);g.quadraticCurveTo(x+10,24+h,x+10,24);g.fill();}
    for(let i=0;i<9;i++){const x=30+i*110;g.strokeStyle='#4f7a3a';g.lineWidth=6;g.beginPath();g.moveTo(x,GROUND);g.lineTo(x+6,GROUND-40);g.stroke();gE(g,x+6,GROUND-46,14,12,['#e86a8a','#fff4e0','#c58ad8'][i%3],2.5);gE(g,x+6,GROUND-46,5,5,'#f2c14e',2);}
    floorTiles(g,'#c98a3a','#b5762a',56);},
  m_faroles(g){vgrad(g,'#141a3a','#3a2a5a');g.fillStyle='rgba(255,250,220,.9)';g.beginPath();g.arc(820,90,40,0,TAU);g.fill();
    for(let i=0;i<60;i++){g.fillStyle='rgba(255,255,255,.7)';g.fillRect((i*97)%W,(i*41)%220,2,2);}
    for(let k=0;k<3;k++){const y0=60+k*70;g.strokeStyle='rgba(20,13,8,.8)';g.lineWidth=2;g.beginPath();g.moveTo(0,y0);g.quadraticCurveTo(W/2,y0+80,W,y0);g.stroke();
      for(let i=1;i<10;i++){const x=i*W/10,y=y0+80*(1-Math.pow(2*i/10-1,2))*.5;gE(g,x,y+14,11,13,['#e8562e','#f2c14e','#d9407a'][(i+k)%3],2);}}
    g.fillStyle='#1d1630';for(const [x,w,h] of [[0,160,120],[150,120,170],[280,180,110],[620,150,150],[760,200,120]]){g.fillRect(x,GROUND-h,w,h);g.beginPath();g.moveTo(x-16,GROUND-h);g.lineTo(x+w/2,GROUND-h-40);g.lineTo(x+w+16,GROUND-h);g.closePath();g.fill();}
    floorTiles(g,'#4a4560','#3a3550',60);},
  m_taller(g){vgrad(g,'#8fa6b2','#5f7380');for(let x=0;x<W;x+=80){g.strokeStyle='rgba(20,13,8,.2)';g.lineWidth=2;g.beginPath();g.moveTo(x,0);g.lineTo(x,GROUND);g.stroke();}
    gR(g,60,50,220,150,'#3f6fa0',4,6);g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=2;for(let i=0;i<5;i++){g.beginPath();g.moveTo(80,80+i*24);g.lineTo(260,80+i*24);g.stroke();}g.beginPath();g.arc(170,130,40,0,TAU);g.stroke();
    gR(g,620,150,300,12,C.woodL,3,2);gR(g,620,230,300,12,C.woodL,3,2);for(let i=0;i<5;i++){gR(g,640+i*56,118,36,32,['#c8392b','#6a6a78','#2e8f86','#e2b24a','#8a5a32'][i],2.5,4);gR(g,640+i*56,198,30,32,['#6a6a78','#e2b24a','#c8392b','#8a5a32','#2e8f86'][i],2.5,4);}
    for(const [x,y,r] of [[420,90,40],[500,150,26],[360,170,22]]){g.save();g.translate(x,y);g.beginPath();for(let i=0;i<32;i++){const a=i*TAU/32,rr2=(i%4<2)?r*1.2:r;g.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2);}g.closePath();g.fillStyle='#b9a07a';g.fill();g.lineWidth=3;g.strokeStyle=C.ink;g.stroke();g.restore();}
    floorTiles(g,'#6a6f78','#5a5f68',64);}});

/* ===================================== BOSS 1 · LA REINA COLMENA ===================================== */
const hovC=B=>(B.phase>=2?150:205);const oyC=B=>Math.sin(B.t*2.2)*14;
defBoss({id:'colmena',name:'La Reina Colmena',sub:'Jefa · El Panal de la Bahía',isl:2,hp:430,par:110,arena:'m_panal',song:'boss2b',x:700,y:GROUND,intro:'¡ZZZ… ARRODÍLLATE ANTE TU REINA!',
  center(B){return{x:B.x,y:B.y-hovC(B)+oyC(B)};},
  anchor(B,n){const y=B.y-hovC(B)+oyC(B);if(n==='mouth')return{x:B.x-44,y:y-66};if(n==='stinger')return{x:B.x+78,y:y+132};if(n==='hand')return{x:B.x-96,y:y+8};if(n==='top')return{x:B.x,y:y-130};return null;},
  shapes(B){const y=B.y-hovC(B)+oyC(B);return[{x:B.x-10,y:y-70,r:46},{x:B.x,y:y,r:48},{x:B.x+40,y:y+80,r:58}];},
  setup(B){B.bx=B.x;},
  move(B,dt,L){if(!B.act)B.x+=(B.bx+Math.sin(B.t*.7)*(110+B.phase*40)-B.x)*Math.min(1,dt*1.5);},
  phases:[
    {atk:[{f:'aimed',every:1.6,from:'mouth',n:3,spread:.2,spd:300,spr:'jam',r:12,parry:3,sfx:'pop'},{f:'rain',every:2.8,n:5,spd:240,spr:'drop',r:11,parry:4}]},
    {banner:'¡AL ENJAMBRE!',atk:[{f:'spiral',every:4.2,from:'stinger',dur:1.8,rate:.1,step:.5,spd:220,spr:'jam',r:11,arms:2,parry:6},{f:'aimed',every:2.1,from:'mouth',n:2,spread:.3,spd:340,spr:'jam',r:12,parry:3},{f:'wave',every:3.6,from:'stinger',both:true,spd:400,h:36}]},
    {banner:'¡AGUIJÓN FINAL!',atk:[{f:'charge',every:4.4,warn:.85,spd:740},{f:'ring',every:2.7,from:'stinger',n:12,spd:240,spr:'drop',r:11,parry:4,sfx:'pop'},{f:'column',every:3.5,n:3,gap:.45,style:'needle',warn:.75,w:56}]}],
  draw(B,L){const t=B.t,ph=B.phase,x=B.x,y=B.y-hovC(B)+oyC(B);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    shadowE(x,GROUND+3,90,.25);
    const wf=Math.sin(t*(ph>=1?62:42))*.5+.5;for(const s of[-1,1]){ctx.save();ctx.globalAlpha=.6;ctx.translate(x+6,y-30);ctx.rotate(s*.25-.6-wf*.35);ell(0,-62,30,66,'#eef8ff',3);ctx.restore();ctx.save();ctx.globalAlpha=.5;ctx.translate(x+10,y-24);ctx.rotate(s*.2+.2+wf*.3);ell(0,-48,22,50,'#eef8ff',3);ctx.restore();}
    const band=ph>=2?'#3a0e0e':'#2a1d14',body=ph>=2?'#d9442e':'#f2c14e';
    ctx.save();ctx.beginPath();ctx.ellipse(x+40,y+80,58,72,-.35,0,TAU);ctx.fillStyle=body;ctx.fill();ctx.clip();ctx.fillStyle=band;for(let i=-2;i<4;i++){ctx.save();ctx.translate(x+40,y+80);ctx.rotate(-.35);ctx.fillRect(-70,-60+i*34,140,14);ctx.restore();}ctx.restore();
    ctx.beginPath();ctx.ellipse(x+40,y+80,58,72,-.35,0,TAU);ctx.lineWidth=4.5;ctx.strokeStyle=C.ink;ctx.stroke();
    const sl=ph>=2?60:26;poly([[x+66,y+130],[x+90,y+130+sl],[x+86,y+126]],ph>=2?'#c9d1d4':'#2a1d14',3);
    for(const s of[-1,1])for(let k=0;k<2;k++){const lx=x-10+k*26+s*6,ly=y+34;line(lx,ly,lx-8+Math.sin(t*6+k+s)*6,ly+40,5,C.ink);}
    ell(x,y,48,44,ph>=2?'#8a9098':'#3a2a20',4);for(let i=0;i<8;i++)circ(x-30+hs(i)*60,y-24+hs(i+3)*48,3,ph>=2?'#c9d1d4':'#5a4030',0);
    if(ph>=2){for(let i=0;i<4;i++)circ(x-30+i*20,y+34,3,C.steelD,1.5);}
    const hx=x-96,hy=y+8+Math.sin(t*3)*6;hose(x-36,y-10,x-70,y+10,hx,hy,8);
    if(ph<2){line(hx,hy+30,hx,hy-80,6,C.ink);line(hx,hy+30,hx,hy-80,3,C.gold);circ(hx,hy-86,12,'#ffe27a',3);star(hx,hy-86,8,3.5,5,t);ctx.fillStyle='#fff6c8';ctx.fill();}
    else{ctx.save();ctx.translate(hx,hy);ctx.rotate(-.35);rr(-4,-110,8,140,3,'#c9d1d4',3);poly([[-12,-110],[0,-150],[12,-110]],'#e8eef0',3);ctx.restore();}
    glove(hx,hy,13);hose(x+30,y-10,x+70,y+10,x+82,y+30+Math.sin(t*4)*6,7);glove(x+82,y+30+Math.sin(t*4)*6,12);
    const fx=x-10,fy=y-70;circ(fx,fy,46,'#f2c14e',4);
    for(const s of[-1,1]){ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(fx+s*16,fy-40);ctx.quadraticCurveTo(fx+s*30,fy-80,fx+s*40+Math.sin(t*5+s)*4,fy-84);ctx.stroke();circ(fx+s*40+Math.sin(t*5+s)*4,fy-86,6,'#2a1d14',2);}
    if(ph===0){ctx.beginPath();ctx.moveTo(fx-30,fy-40);for(let i=0;i<=4;i++)ctx.lineTo(fx-30+i*15,fy-(i%2?52:72));ctx.lineTo(fx+30,fy-40);ctx.closePath();ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}
    else if(ph===1){ctx.save();ctx.translate(fx+14,fy-44);ctx.rotate(.45);ctx.beginPath();ctx.moveTo(-26,0);for(let i=0;i<=4;i++)ctx.lineTo(-26+i*13,-(i%2?12:30));ctx.lineTo(26,0);ctx.closePath();ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
    else{ctx.beginPath();ctx.arc(fx,fy-6,48,Math.PI*1.05,Math.PI*1.95);ctx.lineTo(fx+40,fy-14);ctx.lineTo(fx-40,fy-14);ctx.closePath();ctx.fillStyle='#b8c0c4';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();for(let i=0;i<5;i++){ctx.save();ctx.translate(fx,fy-52);ctx.rotate(-.6+i*.3+Math.sin(t*6+i)*.05);ell(0,-20,7,22,'#d9302a',2.5);ctx.restore();}}
    bossFace(B,L,fx,fy+4,.8,{gap:26,ew:13,eh:16,my:30,mw:24,open:B.mouth>0?.8:.3});
    if(ph>=1){for(let i=0;i<4;i++){const a=t*(2.5+ph)+i*TAU/4,bx=x+Math.cos(a)*120,by=y+Math.sin(a)*60;ctx.save();ctx.globalAlpha=.55;ell(bx-2,by-9,7,5,'#eef8ff',1.5);ctx.restore();ell(bx,by,10,7,'#f2c14e',2);line(bx-2,by-6,bx-2,by+6,2.5,C.ink);}
      for(let i=0;i<3;i++){const k=(t*.8+i/3)%1;ell(x+30+i*18,y+150+k*(GROUND-y-150),4,7,'#e8a020',1.5);}}
    flashOver(B,x,y,95);koStars(B,L,x,y-150);ctx.restore();}});

/* ===================================== BOSS 2 · EL DRAGÓN FAROLILLO ===================================== */
function drH(B){return{x:B.x+Math.sin(B.t*1.1)*80,y:GROUND-240+Math.sin(B.t*1.7)*40};}
function drS(B,i){const h=drH(B);return{x:h.x+50+i*66,y:GROUND-240+Math.sin(B.t*1.7-i*.6)*46+Math.sin(B.t*3-i)*6};}
defBoss({id:'dragonfar',name:'El Dragón Farolillo',sub:'Jefe · Festival de Faroles',isl:3,hp:520,par:120,arena:'m_faroles',song:'boss3b',x:620,y:GROUND,intro:'¡QUE EMPIECE EL FESTIVAL… DE FUEGO!',
  center(B){return drH(B);},
  anchor(B,n){const h=drH(B);if(n==='mouth')return{x:h.x-112,y:h.y+18};if(n==='top')return{x:h.x,y:h.y-80};if(n==='tail'){const s=drS(B,5);return s;}return null;},
  shapes(B){const h=drH(B),o=[{x:h.x,y:h.y,r:64},{x:h.x-74,y:h.y+12,r:34}];if(B.phase<2)for(let i=0;i<3;i++){const s=drS(B,i);o.push({x:s.x,y:s.y,r:30});}return o;},
  setup(B){B.bx=B.x;},
  move(B,dt,L){},
  phases:[
    {atk:[{f:'aimed',every:1.7,from:'mouth',n:3,spread:.18,spd:300,spr:'farolillo',r:13,parry:3,sfx:'fire'},{f:'rain',every:2.7,n:4,spd:250,spr:'llamita',r:11,parry:4}]},
    {banner:'¡FUEGOS ARTIFICIALES!',atk:[{f:'spiral',every:4.4,from:'top',dur:1.6,rate:.09,step:.42,spd:230,spr:'ember',r:10,arms:3,parry:7},{f:'aimed',every:2.2,from:'mouth',n:2,spread:.25,spd:340,spr:'farolillo',r:13,parry:3},{f:'column',every:3.6,n:2,gap:.6,style:'fire',warn:.8,w:64}]},
    {banner:'¡SOLO LA CABEZA!',atk:[{f:'aimed',every:1.5,from:'mouth',n:5,spread:.14,spd:370,spr:'flame',r:11,parry:4,sfx:'fire'},{f:'tele',every:5,minx:420,maxx:760},{f:'sweep',every:3.6,alt:true,spd:420}]}],
  draw(B,L){const t=B.t,ph=B.phase,h=drH(B);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    shadowE(h.x,GROUND+3,80,.22);
    if(ph<2){for(let i=6;i>=0;i--){const s=drS(B,i);if(i<6){const n=drS(B,i+1);line(s.x,s.y,n.x,n.y,4,'rgba(20,13,8,.7)');}
      const glow=ph===1?(.5+.5*Math.sin(t*8+i)):0;if(glow>0){ctx.save();ctx.globalAlpha=.35*glow;circ(s.x,s.y,48,'#ffd36a',0);ctx.restore();}
      ell(s.x,s.y,34,30,ph===1&&Math.floor(t*6+i)%2?'#f2862e':'#d9302a',4);for(let k=-1;k<=1;k++)line(s.x+k*13,s.y-28,s.x+k*13,s.y+28,2,'rgba(20,13,8,.35)');
      rr(s.x-16,s.y-36,32,9,3,C.gold,2.5);rr(s.x-16,s.y+27,32,9,3,C.gold,2.5);line(s.x,s.y+36,s.x+Math.sin(t*4+i)*5,s.y+54,3,'#f2c14e');}}
    else{for(let i=0;i<10;i++){const u=(t*1.4+hs(i))%1;ctx.globalAlpha=1-u;circ(h.x+40+u*160+hs(i+2)*30,h.y-20+u*(GROUND-h.y)*.6+hs(i+4)*20,6+u*10,'#3a3430',2);}ctx.globalAlpha=1;}
    const x=h.x,y=h.y,jaw=(B.mouth||0)*18+(ph>=2?Math.abs(Math.sin(t*8))*8:0);
    for(let i=0;i<9;i++){const a=-1.1+i*.28;ctx.save();ctx.translate(x+24,y-6);ctx.rotate(a);ell(52,0,24,12,i%2?C.gold:'#f2c14e',2.5);ctx.restore();}
    ell(x,y,72,58,ph>=2?'#a8281e':'#d9302a',5);
    ell(x-70,y+8+jaw,48,22,ph>=2?'#b8382a':'#e84a3a',4);for(let i=0;i<5;i++)poly([[x-104+i*14,y+jaw-4],[x-97+i*14,y+jaw+8],[x-90+i*14,y+jaw-4]],C.white,2);
    ell(x-70,y-6,50,26,ph>=2?'#b8382a':'#e84a3a',4);for(let i=0;i<5;i++)poly([[x-104+i*14,y+12],[x-97+i*14,y+2],[x-90+i*14,y+12]],C.white,2);
    circ(x-108,y-16,5,C.ink,0);circ(x-94,y-20,5,C.ink,0);
    for(const s of[-1,1]){ctx.lineWidth=7;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(x+10+s*18,y-48);ctx.quadraticCurveTo(x+30+s*30,y-100,x+70+s*10,y-104);ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle=C.gold;ctx.stroke();}
    ctx.lineWidth=3;ctx.strokeStyle='#f2c14e';for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(x-110,y+4);ctx.bezierCurveTo(x-150,y+4+s*20,x-170,y+40*s+Math.sin(t*3)*12,x-200,y+20*s+Math.sin(t*3+1)*16);ctx.stroke();}
    bossFace(B,L,x-6,y-22,.85,{gap:30,ew:15,eh:18,my:36,mw:0,open:0,mouth:'none'});
    if(ph>=2){for(let i=0;i<5;i++)flame(x-50+i*25,y-46+Math.abs(i-2)*6,30+Math.sin(t*9+i)*8,10,t,i);ctx.save();ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+20,y-20);ctx.lineTo(x+34,y+4);ctx.lineTo(x+26,y+22);ctx.lineTo(x+44,y+40);ctx.stroke();ctx.restore();}
    flashOver(B,x,y,80);koStars(B,L,x,y-120);ctx.restore();}});

/* ===================================== BOSS 3 · EL DOCTOR TORNILLO ===================================== */
const podP=B=>({x:B.x,y:GROUND-240+Math.sin(B.t*2)*22});
defBoss({id:'tornillo',name:'El Doctor Tornillo',sub:'Jefe · Taller de Inventos',isl:4,hp:600,par:125,arena:'m_taller',song:'boss3',x:700,y:GROUND,intro:'¡MI ROBOT ES IMBATIBLE! …CREO.',
  center(B){if(B.phase>=2)return podP(B);return{x:B.x,y:B.y-180};},
  anchor(B,n){if(B.phase>=2){const p=podP(B);if(n==='arm')return{x:p.x-70,y:p.y+16};if(n==='top')return{x:p.x,y:p.y-70};return{x:p.x,y:p.y};}
    if(n==='arm')return{x:B.x-160,y:B.y-170};if(n==='top')return{x:B.x,y:B.y-350};if(n==='chest')return{x:B.x,y:B.y-60};return null;},
  shapes(B){if(B.phase>=2){const p=podP(B);return[{x:p.x,y:p.y,r:58}];}return[{x:B.x-82,y:B.y-262,w:164,h:202},{x:B.x,y:B.y-300,r:44},{x:B.x-46,y:B.y-62,w:92,h:62}];},
  setup(B){B.bx=B.x;},
  move(B,dt,L){if(!B.act&&B.phase<2)B.x+=(B.bx+Math.sin(B.t*.5)*90-B.x)*Math.min(1,dt*1.2);},
  phases:[
    {atk:[{f:'aimed',every:1.7,from:'arm',n:2,spread:.15,spd:360,spr:'rivet',r:11,parry:3,sfx:'knock'},{f:'roller',every:3,from:'chest',spr:'gear',r:24,spd:300,parry:3}]},
    {banner:'¡MODO TURBO!',atk:[{f:'spiral',every:4.2,from:'chest',dur:1.6,rate:.1,step:.48,spd:220,spr:'tuerca',r:11,arms:2,parry:6},{f:'bouncer',every:4,from:'top',spr:'gear',max:2},{f:'aimed',every:2,from:'arm',n:3,spread:.15,spd:380,spr:'rivet',r:11,parry:3}]},
    {banner:'¡CÁPSULA DE ESCAPE!',atk:[{f:'tele',every:4.6,minx:380,maxx:780},{f:'rain',every:2.6,n:5,spd:260,spr:'tuerca',r:11,parry:4},{f:'aimed',every:1.6,from:'arm',n:4,spread:.16,spd:380,spr:'perdigon',r:10,parry:4,sfx:'knock'}]}],
  draw(B,L){const t=B.t,ph=B.phase,x=B.x,y=B.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    const mouse=(mx,my,s)=>{circ(mx,my,20*s,'#a8a8b4',3);for(const d of[-1,1])circ(mx+d*16*s,my-16*s,9*s,'#a8a8b4',2.5);ell(mx,my+6*s,8*s,5*s,'#e8a0a8',2);rr(mx-18*s,my-10*s,36*s,10*s,4,'#5a4030',2);circ(mx-8*s,my-6*s,6*s,'#bfe6f7',2);circ(mx+8*s,my-6*s,6*s,'#bfe6f7',2);};
    if(ph<2){shadowE(x,GROUND+3,120,.3);const step=Math.sin(t*3)*8;
      for(const s of[-1,1]){rr(x+s*44-16,y-64,32,56+(s>0?step:-step)*.3,6,C.steelD,4);rr(x+s*44-28,y-14,56,16,6,'#3a3440',3.5);}
      rr(x-82,y-262,164,202,16,'#8a9098',5);for(let i=0;i<6;i++){circ(x-70+i*28,y-252,3,C.steelD,1.5);circ(x-70+i*28,y-70,3,C.steelD,1.5);}
      if(ph===0){for(const d of[-1,1]){circ(x+d*36,y-190,20,'#efe6cf',3.5);const a=Math.sin(t*(2+d))*1.2-1.57;line(x+d*36,y-190,x+d*36+Math.cos(a)*14,y-190+Math.sin(a)*14,3,'#b5402f');}rr(x-50,y-140,100,50,6,'#5a5f68',3.5);for(let i=0;i<4;i++)rr(x-40+i*22,y-132,14,34,3,i%2?'#c8392b':'#2e8f86',2);}
      else{rr(x-60,y-220,120,150,10,'#2a1a10',4);const g=ctx.createRadialGradient(x,y-140,8,x,y-140,80);g.addColorStop(0,'#ffe27a');g.addColorStop(1,'#d9442e');ctx.fillStyle=g;ctx.fillRect(x-54,y-214,108,138);for(let i=0;i<4;i++)flame(x-36+i*24,y-80,40+Math.sin(t*10+i)*12,12,t,i);
        rr(x-140,y-220,60,150,8,'#6a6f78',4);ctx.save();ctx.translate(x-110,y-145);ctx.rotate(-.2+Math.sin(t*3)*.1);ctx.restore();for(let i=0;i<3;i++)line(x-60,y-200+i*50,x-136,y-200+i*50+6,3);}
      for(const d of[-1,1]){rr(x+d*60-12,y-300,24,40,4,'#5a5f68',3.5);const k=(t*1.3+(d>0?.5:0))%1;ctx.globalAlpha=1-k;circ(x+d*60,y-310-k*60,10+k*14,ph?'#3a3430':'#d8d0c8',2);ctx.globalAlpha=1;}
      const aa=B.mouth>0?-.15:0;ctx.save();ctx.translate(x-82,y-170);ctx.rotate(aa);rr(-80,-16,84,32,8,'#6a6f78',4);rr(-96,-22,20,44,5,'#3a3440',3.5);ctx.restore();
      hose(x+82,y-200,x+120,y-160,x+130,y-110+Math.sin(t*3)*8,10);ctx.save();ctx.translate(x+130,y-110+Math.sin(t*3)*8);for(const d of[-1,1]){ctx.save();ctx.rotate(d*(.35+Math.sin(t*5)*.15));rr(-5,0,10,34,4,C.steelD,3);ctx.restore();}ctx.restore();
      line(x,y-344,x,y-372,3);circ(x,y-376,7,Math.floor(t*3)%2?'#ff5a5a':'#7a2a2a',2.5);
      ctx.save();ctx.globalAlpha=.55;circ(x,y-300,44,'#bfe6f7',0);ctx.restore();mouse(x,y-296,1);bossFace(B,L,x,y-300,.5,{gap:16,ew:7,eh:9,my:16,mw:12,open:B.mouth>0?.7:.2});circ(x,y-300,44,'rgba(0,0,0,0)',4);ctx.save();ctx.globalAlpha=.5;ell(x-16,y-318,10,6,'#fff',0);ctx.restore();
      flashOver(B,x,y-170,120);koStars(B,L,x,y-380);}
    else{const p=podP(B);shadowE(p.x,GROUND+3,60,.22);
      for(let i=0;i<5;i++){const jx=560+i*70;ctx.save();ctx.translate(jx,GROUND-14);ctx.rotate((hs(i)-.5)*.8);rr(-30,-18,60,36,6,i%2?'#8a9098':'#6a6f78',3.5);ctx.restore();}gear(500,GROUND-26,22,8,0,C.steel);gear(860,GROUND-30,18,8,.4,C.brass);
      ctx.save();ctx.translate(p.x,p.y-64);for(let k=0;k<2;k++){ctx.save();ctx.rotate(t*30+k*Math.PI/2);ctx.scale(1,.25);ell(0,0,56,10,'rgba(80,80,90,.7)',2);ctx.restore();}ctx.restore();line(p.x,p.y-44,p.x,p.y-64,4);
      ctx.beginPath();ctx.arc(p.x,p.y+4,58,0,Math.PI);ctx.closePath();ctx.fillStyle='#c8392b';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();for(let i=0;i<5;i++)circ(p.x-44+i*22,p.y+16,3,C.brass,1.5);
      rr(p.x-80,p.y+6,30,14,4,'#6a6f78',3);flame(p.x,p.y+60,-30,10,t,1);
      ctx.save();ctx.globalAlpha=.5;circ(p.x,p.y-6,46,'#bfe6f7',0);ctx.restore();mouse(p.x,p.y-2,1.1);bossFace(B,L,p.x,p.y-8,.55,{gap:18,ew:8,eh:10,my:18,mw:14,open:.7});circ(p.x,p.y-6,46,'rgba(0,0,0,0)',4);
      flashOver(B,p.x,p.y,70);koStars(B,L,p.x,p.y-110);}
    ctx.restore();}});

/* bespoke forms are inside the draw functions: tell the generic phase marks to stay out */
if(window.BOSS_FORMS)for(const id of['colmena','dragonfar','tornillo'])BOSS_FORMS[id]={draw:[null,null,null]};

/* ===================================== RUN-AND-GUN ===================================== */
Object.assign(RUN_THEMES,{
  cocina:{sky:['#f6e2b8','#e8c48a'],far:'cocina',mid:'#b8784a',ground:'#c94a3a',trim:[C.paper,C.rust],walker:'raton',flyer:'pajaro',turret:'canon',popper:'caja',hopper:'conejo',ammo:'jam',egg:'egg',plank:C.woodL},
  cristal:{sky:['#1a1430','#3a2a5a'],far:'cristal',mid:'#2a2240',ground:'#4a3a6a',trim:['#c58ad8',C.ink],walker:'caracol',flyer:'murcielago',turret:'farol',popper:'topo',hopper:'gusano',ammo:'orb',egg:'orb',plank:'#7a5aa0'},
  juguetes:{sky:['#f8e6f0','#cfeaf2'],far:'juguetes',mid:'#2e8f86',ground:'#c8392b',trim:[C.gold,C.paper],walker:'soldadito',flyer:'avioncito',turret:'canon',popper:'caja',hopper:'soldadito',ammo:'nieve',egg:'nieve',plank:'#fff8ee'}});
const NEWR=['cocina','cristal','juguetes'];
const _rl=runLayers;runLayers=function(k){if(!NEWR.includes(k))return _rl(k);if(RUNBG.k===k)return RUNBG;const th=RUN_THEMES[k];
  const [sk,s]=mk(W,H);skyG(s,th.sky[0],th.sky[1],H);
  if(k==='cristal'){starsG(s,40,7);for(let i=0;i<20;i++){s.fillStyle='rgba(197,138,216,.25)';s.beginPath();s.arc((i*97)%W,(i*53)%260,8+(i%4)*6,0,TAU);s.fill();}}
  else if(k==='cocina'){for(let x=0;x<W;x+=60)for(let y=0;y<260;y+=60){s.fillStyle=(x/60+y/60)%2?'rgba(255,255,255,.35)':'rgba(255,255,255,.12)';s.fillRect(x,y,60,60);}}
  else{for(let i=0;i<50;i++){s.fillStyle='rgba(255,255,255,.9)';s.beginPath();s.arc((i*89)%W,(i*47)%300,2+(i%3),0,TAU);s.fill();}}
  const [fc,g]=mk(1200,H);g.lineWidth=3;g.strokeStyle='rgba(20,13,8,.75)';
  if(k==='cocina'){for(const [x,r] of [[120,90],[420,120],[760,100],[1060,110]]){gR(g,x-r,GROUND-60-r*1.2,r*2,r*1.2,'#9aa0a8',3,14);gR(g,x-r-14,GROUND-70-r*1.2,r*2+28,14,'#7a8088',3,6);gE(g,x,GROUND-84-r*1.2,16,8,'#3a3440',2.5);for(let i=0;i<3;i++){g.beginPath();g.arc(x-20+i*20,GROUND-100-r*1.2-i*18,12+i*4,0,TAU);g.fillStyle='rgba(255,255,255,.5)';g.fill();}}
    for(let i=0;i<6;i++){const x=80+i*200;g.beginPath();g.moveTo(x,0);g.lineTo(x,70);g.stroke();gE(g,x,96,26,26,'#3a3440',3);gR(g,x-4,120,8,40,'#8a5a32',2.5,3);}}
  else if(k==='cristal'){for(let i=0;i<14;i++){const x=40+i*86,h=120+(i*53)%180,w=34+(i%3)*14;g.beginPath();g.moveTo(x-w,GROUND-50);g.lineTo(x-w*.3,GROUND-50-h);g.lineTo(x+w*.4,GROUND-50-h*.85);g.lineTo(x+w,GROUND-50);g.closePath();g.fillStyle=['#7a5aa0','#5aa0b8','#a05a9a'][i%3];g.fill();g.stroke();
      g.beginPath();g.moveTo(x-w*.3,GROUND-50-h);g.lineTo(x,GROUND-50);g.strokeStyle='rgba(255,255,255,.35)';g.stroke();g.strokeStyle='rgba(20,13,8,.75)';}
    g.fillStyle='#22183a';for(let x=0;x<1200;x+=70){g.beginPath();g.moveTo(x,0);g.lineTo(x+35,50+((x*7)%70));g.lineTo(x+70,0);g.closePath();g.fill();g.stroke();}}
  else{for(let i=0;i<9;i++){const x=60+i*135,sz=60+(i%3)*24,y=GROUND-50-sz;gR(g,x-sz/2,y,sz,sz,['#c8392b','#2e8f86','#e2b24a','#7d5aa6'][i%4],3,6);g.font=`bold ${sz*.55}px ${FONT}`;g.fillStyle='#fff8ee';g.textAlign='center';g.textBaseline='middle';g.fillText('ABCDEFGHI'[i],x,y+sz/2);
      if(i%2===0){gR(g,x-sz/2+10,y-sz*.6,sz-20,sz*.6,['#e2b24a','#c8392b'][i%2],3,6);}}
    for(const x of[300,700,1100]){g.lineWidth=12;g.strokeStyle='#fff8ee';g.beginPath();g.moveTo(x,GROUND-50);g.lineTo(x,GROUND-230);g.arc(x+26,GROUND-230,26,Math.PI,0);g.stroke();g.lineWidth=12;g.strokeStyle='#c8392b';g.setLineDash([14,14]);g.stroke();g.setLineDash([]);g.lineWidth=3;g.strokeStyle='rgba(20,13,8,.75)';}}
  g.fillStyle=k==='cristal'?'#22183a':k==='cocina'?'#b8784a':'#e8f2f6';g.fillRect(0,GROUND-52,1200,60);g.beginPath();g.moveTo(0,GROUND-52);g.lineTo(1200,GROUND-52);g.stroke();
  const [mc,m]=mk(1000,H);m.beginPath();m.moveTo(0,H);for(let x=0;x<=1000;x+=10)m.lineTo(x,GROUND-34-Math.sin(x*TAU/1000)*18-Math.sin(x*TAU/500)*8);m.lineTo(1000,H);m.closePath();m.fillStyle=th.mid;m.fill();m.lineWidth=3.5;m.strokeStyle=C.ink;m.stroke();
  RUNBG={k,sky:sk,far:fc,mid:mc};return RUNBG;};
defRun({id:'cocina',name:'La Gran Cocina',sub:'Nivel · Corre y dispara',isl:1,par:160,song:'run1',theme:'cocina',
  chunks:[['start'],['flat',1],['turret'],['pitParry',1],['stairs'],['gauntlet',1],['miniArena',0,'olla'],['spring',1],['crumbleBridge'],['hopperField',1],['parryChain',0],['fortress'],['jets'],['ambush'],['end']]});
defRun({id:'cristal',name:'Cuevas de Cristal',sub:'Nivel · Corre y dispara',isl:4,par:185,song:'mina',theme:'cristal',
  chunks:[['start'],['pit',1],['mover'],['cloudHop',1],['turret'],['bombRain',0],['crumbleBridge',1],['miniArena',0,'gema'],['skyway'],['lift',1],['ambush'],['parryChain',1],['fortress'],['end']]});
defRun({id:'juguetes',name:'Taller del Duende',sub:'Nivel · Corre y dispara',isl:5,par:190,song:'run2',theme:'juguetes',
  chunks:[['start'],['flat',1],['hopperField'],['jets',1],['stairs'],['miniArena',0,'trabuco'],['gauntlet',1],['cartRide'],['parryChain',1],['mover'],['bombRain',0],['fortress',1],['ambush'],['miniArena',0,'olla'],['end']]});

/* ---- mini-bosses ---- */
const flashC=(e,c)=>e.flash>0?'#fff':c;
function eyesM(x,y,s,look,angry){for(const d of[-1,1]){ell(x+d*12*s,y,8*s,10*s,'#fff',2.5);circ(x+d*12*s+look*3*s,y+2*s,4*s,C.ink,0);if(angry)line(x+d*4*s,y-13*s,x+d*19*s,y-8*s,3,C.ink);}}
MINI.olla={name:'Doña Olla',hp:110,r:64,h:70,home:240,
  shapes:e=>[{x:e.x,y:e.y-6,r:62}],
  upd(e,L,dt,p){e.face=p.x<e.x?-1:1;e.cool-=dt;e.lid=Math.max(0,(e.lid||0)-dt*2.2);
    if(e.hopT>0){e.hopT-=dt;e.vy+=2200*dt;e.y+=e.vy*dt;e.x+=e.vx*dt;if(e.y>=GROUND-70){e.y=GROUND-70;e.hopT=0;shake(L,10);sfx('stomp');puff(L,e.x,GROUND,8);for(const d of[-1,1])spawnEB(L,{k:'wave',x:e.x+d*40,y:GROUND,vx:d*360,w:40,h:34});}return;}
    if(e.cool<=0){e.n++;if(e.n%3===0){e.hopT=2;e.vy=-940;e.vx=(clamp(p.x,e.ax+150,e.ax+W-150)-e.x)/.9;sfx('throw');e.cool=1.7;}
      else{e.lid=1;const pk=Math.floor(rand()*6);for(let i=0;i<6;i++){const a=-Math.PI/2+(i-2.5)*.26+e.face*.4,sp=560+rand()*80;spawnEB(L,{k:'grav',x:e.x,y:e.y-70,vx:Math.cos(a)*sp*.75,vy:Math.sin(a)*sp,g:1100,r:11,spr:'jam',parry:i===pk});}sfx('pop');e.cool=1.5;}}},
  draw(e,t){const x=e.x,y=e.y,lid=(e.lid||0)*40;shadowE(x,GROUND+3,80,.3);
    for(const d of[-1,1])rr(x+d*62-(d>0?0:20),y-34,20,16,6,'#3a3440',3.5);
    ctx.beginPath();ctx.moveTo(x-62,y-52);ctx.lineTo(x+62,y-52);ctx.quadraticCurveTo(x+66,y+60,x,y+64);ctx.quadraticCurveTo(x-66,y+60,x-62,y-52);ctx.closePath();ctx.fillStyle=flashC(e,'#9aa0a8');ctx.fill();ctx.lineWidth=4.5;ctx.strokeStyle=C.ink;ctx.stroke();
    ell(x,y-52,62,12,'#c94a3a',4);for(let i=0;i<4;i++)circ(x-40+i*26,y-54+Math.sin(t*8+i)*3,5+Math.abs(Math.sin(t*5+i))*3,'#e86a5a',2);
    ctx.save();ctx.translate(x,y-64-lid);ctx.rotate(Math.sin(t*14)*.08*(e.lid>0?1:.3));ell(0,0,66,12,flashC(e,'#7a8088'),4);rr(-12,-20,24,14,5,'#3a3440',3);ctx.restore();
    eyesM(x,y-10,1.1,e.face,e.hopT>0);ctx.beginPath();ctx.arc(x,y+16,16,0,Math.PI);ctx.fillStyle=C.ink;ctx.fill();
    for(let i=0;i<2;i++){const k=(t*.8+i*.5)%1;ctx.globalAlpha=1-k;circ(x-20+i*40,y-90-lid-k*60,10+k*14,'#fffaf0',2);}ctx.globalAlpha=1;}};
MINI.gema={name:'Gema la Golem',hp:125,r:62,h:150,home:230,
  init(e){e.by=e.y;},
  shapes:e=>[{x:e.x,y:e.y,r:58}],
  enterUpd(e,L,dt){e.y=e.by+Math.sin(e.st_t*3)*10;},
  upd(e,L,dt,p){e.face=p.x<e.x?-1:1;e.cool-=dt;e.y=e.by+Math.sin(e.st_t*2.4)*24;
    if(e.cool<=0){e.n++;if(e.n%3===0){const n=10,o=e.st_t;for(let i=0;i<n;i++){const a=o+i*TAU/n;spawnEB(L,{k:'shot',x:e.x,y:e.y,vx:Math.cos(a)*230,vy:Math.sin(a)*230,r:10,spr:'shard',parry:i===3});}sfx('magic');e.cool=1.8;}
      else{const ap=aimPt(p),a0=Math.atan2(ap.y-e.y,ap.x-e.x);for(let i=-1;i<=1;i++)spawnEB(L,{k:'shot',x:e.x,y:e.y,vx:Math.cos(a0+i*.18)*400,vy:Math.sin(a0+i*.18)*400,r:10,spr:'shard',parry:i===0&&e.n%2===0});sfx('pop');e.cool=1.3;}}},
  draw(e,t){const x=e.x,y=e.y;shadowE(x,GROUND+3,60,.25);
    for(let i=0;i<3;i++){const a=t*2+i*TAU/3;const sx=x+Math.cos(a)*84,sy=y+Math.sin(a)*30;ctx.save();ctx.translate(sx,sy);ctx.rotate(a);poly([[0,-14],[10,0],[0,14],[-10,0]],'#5aa0b8',2.5);ctx.restore();}
    poly([[x,y-70],[x+54,y-30],[x+60,y+30],[x,y+66],[x-60,y+30],[x-54,y-30]],flashC(e,'#8a6ab8'),4.5);
    poly([[x,y-70],[x+54,y-30],[x,y-10],[x-54,y-30]],flashC(e,'#a88ad8'),3);line(x,y-10,x,y+66,2.5,'rgba(20,13,8,.4)');line(x-60,y+30,x,y-10,2.5,'rgba(20,13,8,.4)');line(x+60,y+30,x,y-10,2.5,'rgba(20,13,8,.4)');
    for(const d of[-1,1]){ell(x+d*16,y+4,9,11,'#fff6c8',2.5);circ(x+d*16+e.face*3,y+6,4,'#d02a3a',0);}rr(x-14,y+28,28,6,3,C.ink,0);
    ctx.save();ctx.globalAlpha=.5+.3*Math.sin(t*5);circ(x-20,y-40,6,'#fff',0);ctx.restore();}};

/* ===================================== CHARMS ===================================== */
Object.assign(CHARMS,{
  afilar:{name:'Piedra de Afilar',price:4,isl:2,desc:'Tu parry se vuelve un golpe: además de la carta, le hace daño al jefe y a los enemigos que tengas cerca.'},
  imanmon:{name:'Imán de Monedas',price:2,isl:1,desc:'En los niveles de correr y disparar, las monedas cercanas vuelan hacia ti.'},
  corazonroto:{name:'Corazón Roto',price:5,isl:3,desc:'¡Solo para valientes! Tienes 1 sola vida, pero tus disparos pegan un 60 % más.'}});
const _dp=doParry;doParry=function(L,p,o){const r=_dp.apply(this,arguments);try{if(hasCharm(p,'afilar')){let hit=false;const B=L.boss;
    if(B&&!B.dead&&!B.hidden&&!(B.def&&B.def.parryOnly)){const c=B.center();if(Math.hypot(c.x-p.x,c.y-p.y)<300){B.damage(11,p);hit=true;}}
    for(const e of L.ents)if(!e.dead&&!e.boss&&e.damage&&Math.hypot(e.x-p.x,e.y-p.y)<170){e.damage(8,p);hit=true;}
    if(hit){sparks(L,p.x,p.y-40,14,'#e8eef0');pop(L,p.x,p.y-120,'¡ZAS!',C.gold);if(typeof unlockAch==='function'&&!(typeof NP!=='undefined'&&NP.on))unlockAch('afilado');}}}catch(e){}return r;};
const _dm=dmgM;dmgM=function(p){return _dm(p)*(p&&hasCharm(p,'corazonroto')?1.6:1);};
const _np=newPlayer;newPlayer=function(L,i,type,x,y){const p=_np.apply(this,arguments);if(p&&p.eq&&p.eq.charm==='corazonroto'){p.hp=1;p.maxHp=1;}return p;};
const _pu=platUpdate;platUpdate=function(L,p,dt){const r=_pu.apply(this,arguments);if(L&&L.kind==='run'&&L.coins&&hasCharm(p,'imanmon')&&!p.dead){for(const c of L.coins){if(c.got||c.was)continue;const dx=p.x-c.x,dy=(p.y-30)-c.y,d=Math.hypot(dx,dy);if(d<260&&d>1){const s=Math.min(d,520*dt);c.x+=dx/d*s;c.y+=dy/d*s;}}}return r;};
const NEWC=['afilar','imanmon','corazonroto','skin_goat'];
const _ii=itemIcon;itemIcon=function(id,x,y,t){if(!NEWC.includes(id)){_ii(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  if(id==='afilar'){ctx.rotate(-.5);rr(-22,-9,44,18,6,'#8a9098',3);line(-16,-2,16,-2,2,'rgba(255,255,255,.7)');ctx.rotate(.5);star(16,-14,8,3,4,t*2);ctx.fillStyle='#fff6c8';ctx.fill();}
  else if(id==='imanmon'){ctx.lineWidth=11;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.arc(0,0,15,Math.PI,0);ctx.stroke();ctx.lineWidth=7;ctx.strokeStyle='#c8392b';ctx.stroke();rr(-21,-2,12,12,2,'#e8eef0',2.5);rr(9,-2,12,12,2,'#e8eef0',2.5);circ(0,-26+Math.sin(t*4)*3,7,C.gold,2.5);}
  else if(id==='corazonroto'){ctx.beginPath();ctx.moveTo(0,16);ctx.bezierCurveTo(-26,-2,-14,-24,0,-10);ctx.bezierCurveTo(14,-24,26,-2,0,16);ctx.closePath();ctx.fillStyle='#8a1f22';ctx.fill();ctx.stroke();line(0,-10,-4,0,2.5);line(-4,0,4,6,2.5);line(4,6,0,16,2.5);}
  else{ctx.lineWidth=5;ctx.strokeStyle=C.gold;for(const s of[-1,1]){ctx.beginPath();ctx.arc(s*10,-10,10,s>0?Math.PI:0,s>0?Math.PI*2.4:-Math.PI*1.4,s<0);ctx.stroke();}circ(0,6,13,C.gold,3);ell(0,22,5,8,C.gold,2.5);}
  ctx.restore();};

/* ===================================== SKIN: DA GOAT ===================================== */
SKINS.skin_goat={name:'Da Goat',price:0,isl:1,desc:'Para quien llega al 100 %. Dorado de pies a cabeza, con cuernos y barbita de cabra legendaria.',acc:'goat',filter:'sepia(.7) saturate(2.2) hue-rotate(-12deg) brightness(1.12)',secret:true};
const _rst=refreshShopTabs;refreshShopTabs=function(){_rst();try{const t=SHOP_TABS[3];const i=t.ids.indexOf('skin_goat');if(i>=0)t.ids.splice(i,1);}catch(e){}};refreshShopTabs();
const _dsa=drawSkinAcc;drawSkinAcc=function(o,ch,fy,f,ex){const sk=SKINS[o.skin];if(!sk||sk.acc!=='goat'){_dsa(o,ch,fy,f,ex);return;}
  ctx.save();ctx.filter='none';ctx.lineJoin='round';ctx.lineCap='round';const top=fy-(ch==='cerilla'?20:ch==='velita'?22:26);
  for(const s of[-1,1]){ctx.lineWidth=7;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(s*8,top+2);ctx.quadraticCurveTo(s*28,top-18,s*22,top-2);ctx.quadraticCurveTo(s*16,top+8,s*26,top+10);ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle='#e2b24a';ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-6,fy+20);ctx.lineTo(6,fy+20);ctx.lineTo(0,fy+38);ctx.closePath();ctx.fillStyle='#f2e3c0';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
  if(Math.floor(performance.now()/300)%3===0){star(16*f,top-12,5,2,4,0);ctx.fillStyle='#fff6c8';ctx.fill();}ctx.restore();};

/* ===================================== MAP: nodes, buildings, hidden coins ===================================== */
const NODES=[[1,{id:'cocina',x:1500,y:1020,kind:'level',ob:40,bld:'cocinaBld'},'fabrica'],[2,{id:'colmena',x:1320,y:660,kind:'level',ob:40,bld:'colmenaBld'},'cangrejo'],
  [3,{id:'dragonfar',x:1500,y:360,kind:'level',ob:40,bld:'faroBld'},'murcielago'],[4,{id:'tornillo',x:1470,y:810,kind:'level',ob:40,bld:'tallerBld'},'termometro'],
  [4,{id:'cristal',x:480,y:540,kind:'level',ob:40,bld:'cristalBld'},'teleferico'],[5,{id:'juguetes',x:1000,y:250,kind:'level',ob:40,bld:'jugueteBld'},'abeto']];
for(const [wi,n,from] of NODES){if(!WORLDS[wi])continue;addNode(wi,n);if(!WORLDS[wi].roads.some(r=>r.includes(n.id)))WORLDS[wi].roads.push([from,n.id]);}
BOSS_LIST[2].push('colmena');BOSS_LIST[3].push('dragonfar');BOSS_LIST[4].push('tornillo');RUN_LIST[1].push('cocina');RUN_LIST[4].push('cristal');(RUN_LIST[5]=RUN_LIST[5]||[]).push('juguetes');
const NB=['cocinaBld','colmenaBld','faroBld','tallerBld','cristalBld','jugueteBld'];
const _db=drawBld;drawBld=function(n,t,night){if(!NB.includes(n.bld)){_db(n,t,night);return;}const x=n.x,y=n.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;shadowE(x,y+2,(n.ob||20)+14,.22);
  switch(n.bld){
    case'cocinaBld':rr(x-36,y-50,72,50,4,'#f2e3c0',3.5);poly([[x-46,y-48],[x,y-86],[x+46,y-48]],'#c94a3a',3.5);rr(x+14,y-92,14,28,2,'#7a8088',3);for(let i=0;i<2;i++){const k=(t*.7+i*.5)%1;ctx.globalAlpha=1-k;circ(x+21,y-100-k*30,6+k*8,'#fff',2);}ctx.globalAlpha=1;rr(x-10,y-30,20,30,6,C.wood,3);ell(x-22,y-36,10,6,'#9aa0a8',2.5);break;
    case'colmenaBld':for(let i=0;i<4;i++)ell(x,y-14-i*20,40-i*7,13,i%2?'#e9b23c':'#f2c14e',3.5);ell(x,y-14,10,9,'#3a2010',2.5);for(let i=0;i<3;i++){const a=t*3+i*2.1;circ(x+Math.cos(a)*38,y-50+Math.sin(a)*14,4,'#f2c14e',2);}break;
    case'faroBld':line(x-40,y,x-40,y-80,5);line(x+40,y,x+40,y-80,5);ctx.beginPath();ctx.moveTo(x-50,y-80);ctx.quadraticCurveTo(x,y-104,x+50,y-80);ctx.lineWidth=8;ctx.stroke();ctx.lineWidth=3.5;for(let i=0;i<3;i++){const lx=x-24+i*24,ly=y-76+Math.sin(t*2+i)*3;line(lx,y-88,lx,ly-12,2);ell(lx,ly,9,11,['#e8562e','#f2c14e','#d9407a'][i],2.5);}break;
    case'tallerBld':rr(x-40,y-54,80,54,4,'#8a9098',3.5);poly([[x-46,y-52],[x-46,y-74],[x+46,y-60],[x+46,y-52]],'#5a5f68',3.5);gear(x+28,y-74,12,8,t,C.brass);rr(x-12,y-34,24,34,3,'#3a3440',3);break;
    case'cristalBld':ell(x,y-10,44,30,'#3a2a5a',3.5);ell(x,y-6,22,18,'#140e22',3);for(let i=0;i<4;i++){const cx=x-36+i*24,h=24+((i*13)%3)*12;poly([[cx-8,y-24],[cx,y-24-h],[cx+8,y-24]],['#a88ad8','#5aa0b8'][i%2],2.5);}break;
    case'jugueteBld':rr(x-36,y-56,72,56,6,'#c8392b',3.5);rr(x-40,y-64,80,14,4,'#e2b24a',3.5);line(x,y-64,x,y,4,'#e2b24a');const k=Math.max(0,Math.sin(t*2));ctx.save();ctx.translate(x,y-64-k*18);springZ(0,0,0,-10,6,4);circ(0,-22,12,'#f2e3c0',3);circ(-4,-24,2,C.ink,0);circ(4,-24,2,C.ink,0);ctx.restore();break;}
  ctx.restore();};
function springZ(x1,y1,x2,y2,w,n){ctx.beginPath();ctx.moveTo(x1,y1);for(let i=1;i<n;i++){const k=i/n;ctx.lineTo(x1+(x2-x1)*k+(i%2?w:-w),y1+(y2-y1)*k);}ctx.lineTo(x2,y2);ctx.lineWidth=3;ctx.strokeStyle=C.steel;ctx.stroke();}

const HIDDEN={1:[[240,270],[690,1050]],2:[[150,1020],[1710,360]],3:[[270,330],[1320,510]],4:[[270,360],[690,1080]],5:[[240,330],[1740,690]]};
window.HIDDEN_COINS=HIDDEN;
const hcKey=(i,k)=>'hc'+i+'_'+k;
function hcCount(){let n=0;save.flags=save.flags||{};for(const i in HIDDEN)HIDDEN[i].forEach((_,k)=>{if(save.flags[hcKey(i,k)])n++;});return n;}
const _um=updMap;updMap=function(dt,IN){const r=_um.apply(this,arguments);try{const M=MAPS,i=save.island,list=HIDDEN[i];if(list&&scene==='map'){save.flags=save.flags||{};list.forEach(([x,y],k)=>{const key=hcKey(i,k);if(save.flags[key])return;if(Math.hypot(M.x-x,M.y-y)<34){save.flags[key]=true;save.coins++;M.coinFx={x,y:y-30,t:1};sfx('coin');sfx('ding');M.banner={t:3,text:`¡Moneda escondida! (${hcCount()} de 10)`};if(hcCount()>=10)unlockAch('ocultas');persist();}});}}catch(e){}return r;};
const _ma=mapAmbience;mapAmbience=function(w,M){_ma(w,M);try{const list=HIDDEN[save.island];if(!list)return;save.flags=save.flags||{};list.forEach(([x,y],k)=>{if(save.flags[hcKey(save.island,k)])return;const u=(M.t*.7+k*.37)%1;if(u<.25){ctx.save();ctx.globalAlpha=Math.sin(u/.25*Math.PI);ctx.translate(x,y-10);ctx.beginPath();ctx.moveTo(0,-10);ctx.quadraticCurveTo(0,0,10,0);ctx.quadraticCurveTo(0,0,0,10);ctx.quadraticCurveTo(0,0,-10,0);ctx.quadraticCurveTo(0,0,0,-10);ctx.fillStyle='#fff6c8';ctx.fill();ctx.restore();}});}catch(e){}};

/* ===================================== ACHIEVEMENTS & DA GOAT ===================================== */
for(const a of [['dagoat','Da Goat','Llega al 100 %: gana TODOS los niveles del juego (jefes, avión, correr y disparar y mausoleos).',15],
  ['colmenaW','¡Dulce Victoria!','Vence a la Reina Colmena.',2],['dragonW','Apagafaroles','Vence al Dragón Farolillo.',2],['tornilloW','Desatornillado','Vence al Doctor Tornillo.',2],
  ['runs3','Explorador Total','Completa La Gran Cocina, las Cuevas de Cristal y el Taller del Duende.',3],['ocultas','Buscatesoros','Encuentra las 10 monedas escondidas en los mapas.',3],
  ['afilado','Filo de Parry','Hazle daño a alguien con un parry usando la Piedra de Afilar.',1],['valiente','Corazón de León','Gana a un jefe con el Corazón Roto equipado (1 sola vida).',3]])
  if(!ACHD[a[0]]){ACH.push(a);ACHD[a[0]]={id:a[0],name:a[1],desc:a[2],coins:a[3]};}
/* the % now counts every level of the game */
for(const id in LEVELS){const d=LEVELS[id];if(!d.create||/^tutorial/.test(id))continue;if(!ALL_LEVELS.includes(id))ALL_LEVELS.push(id);}
window.totalPct=function(s){s=s||save;const n=ALL_LEVELS.filter(k=>s.cleared&&s.cleared[k]).length;return{n,tot:ALL_LEVELS.length,pct:Math.floor(n/ALL_LEVELS.length*100)};};
function goatCheck(){try{if(typeof NP!=='undefined'&&NP.on)return;const P=totalPct();if(P.n>=P.tot&&!(save.ach&&save.ach.dagoat)){unlockAch('dagoat');if(!save.owned.includes('skin_goat'))save.owned.push('skin_goat');persist();
    if(typeof MAPS!=='undefined')MAPS.banner={t:5,text:'¡ERES DA GOAT! 100 % · Skin dorada desbloqueada'};}}catch(e){}}
const _al=afterLevel;afterLevel=function(L){try{if(L&&L.state==='results'&&!(L.result&&L.result.fail)&&!(typeof NP!=='undefined'&&NP.on)){const id=L.id;
    if(id==='colmena')unlockAch('colmenaW');if(id==='dragonfar')unlockAch('dragonW');if(id==='tornillo')unlockAch('tornilloW');
    if(L.boss&&L.Ps.some(p=>p.eq&&p.eq.charm==='corazonroto'))unlockAch('valiente');
    save.cleared[id]=true;if(['cocina','cristal','juguetes'].every(k=>save.cleared[k]))unlockAch('runs3');}}catch(e){}_al(L);goatCheck();};
const _tm=toMap;toMap=function(){const r=_tm.apply(this,arguments);goatCheck();return r;};
const _dl=drawLogros;drawLogros=function(){_dl();try{const P=totalPct(),x0=18,y0=12,w=250;rr(x0,y0,w,20,7,P.pct>=100?C.gold:'#5a4636',2.5);
  rr(x0+3,y0+3,(w-6)*P.pct/100,14,5,P.pct>=100?'#fff6c8':C.brass,0);btxt(`${P.pct} % · ${P.n}/${P.tot} niveles`,x0+w/2,y0+11,11,P.pct>=100?C.ink:C.paper,'center',800);
  btxt(P.pct>=100?'¡DA GOAT!':'100 % = logro Da Goat',x0+w/2,y0+31,10,C.brass,'center',700);
  btxt(`Monedas escondidas: ${hcCount()}/10`,W-18-110,y0+11,11,C.paper,'center',800);}catch(e){}};
})();
