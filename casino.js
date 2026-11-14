'use strict';
/* ================= CASINO DE LA TÓMBOLA: six fairground challengers and the house owner (Rollo n.º 8) ================= */

/* ---------- bullets of the casino ---------- */
const SPRC={
  mazo(e,t,P,r){ctx.rotate((e.rot||0)+t*11+e.x*.01);rr(-3,-r*.3,6,r*1.7,2,C.woodL,2);rr(-r*.95,-r*1.15,r*1.9,r*.9,r*.3,P('#e8562e'),2.5);rr(-r*.95,-r*1.15,r*.35,r*.9,2,P('#f2c14e'),2);rr(r*.6,-r*1.15,r*.35,r*.9,2,P('#f2c14e'),2);},
  tierra(e,t,P,r){ctx.rotate(t*5+e.x*.02);for(const [x,y,k] of[[-r*.4,r*.1,.65],[r*.35,r*.2,.6],[0,-r*.3,.7]])circ(x,y,r*k,P('#7a5232'),2.5);circ(-r*.2,-r*.4,r*.14,'#a8794c',0);circ(r*.4,r*.1,r*.1,'#a8794c',0);},
  canica(e,t,P,r){circ(0,0,r,P('#7bc4d9'),2.5);ctx.save();ctx.beginPath();ctx.arc(0,0,r-2,0,TAU);ctx.clip();ctx.rotate(t*6+e.x*.03);ctx.beginPath();ctx.moveTo(-r,0);ctx.bezierCurveTo(-r*.3,-r*.9,r*.3,r*.9,r,0);ctx.lineWidth=r*.45;ctx.strokeStyle=e.parry&&!(e.cool>0)?'#c9fff7':'#e8562e';ctx.stroke();ctx.restore();ell(-r*.35,-r*.4,r*.28,r*.16,'rgba(255,255,255,.85)',0,-.5);},
  bolo(e,t,P,r){ctx.rotate(t*12+e.x*.01);ctx.beginPath();ctx.moveTo(0,-r*1.5);ctx.bezierCurveTo(r*.55,-r*1.5,r*.5,-r*.6,r*.3,-r*.35);ctx.bezierCurveTo(r*.9,0,r*.9,r*1.1,0,r*1.2);ctx.bezierCurveTo(-r*.9,r*1.1,-r*.9,0,-r*.3,-r*.35);ctx.bezierCurveTo(-r*.5,-r*.6,-r*.55,-r*1.5,0,-r*1.5);
    ctx.fillStyle=P('#fbf6ea');ctx.fill();ctx.lineWidth=2.5;ctx.stroke();rr(-r*.42,-r*.62,r*.84,r*.16,2,'#c8392b',0);rr(-r*.45,-r*.38,r*.9,r*.12,2,'#c8392b',0);},
  bolaBol(e,t,P,r){circ(0,0,r,P('#3a2a55'),3);ctx.save();ctx.rotate((e.x||0)/r);circ(r*.25,-r*.35,r*.12,C.ink,0);circ(r*.5,-r*.1,r*.12,C.ink,0);circ(r*.2,-r*.05,r*.12,C.ink,0);ctx.restore();ell(-r*.4,-r*.45,r*.3,r*.15,'rgba(255,255,255,.35)',0,-.5);},
  dardo(e,t,P,r){ctx.rotate(Math.atan2(e.vy||0,e.vx||1));rr(-r*1.4,-r*.16,r*2.1,r*.32,2,P('#f2c14e'),2);poly([[r*.7,-r*.28],[r*1.6,0],[r*.7,r*.28]],C.steel,2);for(const d of[-1,1])poly([[-r*1.4,0],[-r*1.9,d*r*.7],[-r*1.05,d*r*.1]],P('#c8392b'),2);},
  confeti(e,t,P,r){ctx.rotate(t*9+e.x*.05);const cs=['#e8562e','#2e8f86','#f2c14e','#8a63c7'];rr(-r*.9,-r*.45,r*1.8,r*.9,2,P(cs[Math.abs(Math.floor(e.x*.1))%4]),2);},
  bloque(e,t,P,r){ctx.rotate(t*4+e.x*.01);const cs=['#e8562e','#2e8f86','#3a72b0'],c=cs[Math.abs(Math.floor(e.x*.07))%3];rr(-r,-r,r*2,r*2,4,P(c),2.5);rr(-r*.7,-r*.7,r*1.4,r*1.4,3,P('#fff6df'),2);btxt('ABC'[Math.abs(Math.floor(e.x*.03))%3],0,1,r*1.1,c,'center',900);},
  globo(e,t,P,r){const w=Math.sin(t*5+e.x*.02)*.15;ctx.rotate(w);ctx.beginPath();ctx.moveTo(0,r*1.1);ctx.quadraticCurveTo(r*.4,r*1.8,-r*.1,r*2.4);ctx.lineWidth=1.5;ctx.stroke();
    ell(0,0,r*.9,r*1.1,P('#e8562e'),2.5);poly([[-r*.2,r*1.15],[r*.2,r*1.15],[0,r*1.0]],P('#e8562e'),2);ell(-r*.35,-r*.4,r*.18,r*.3,'rgba(255,255,255,.6)',0,-.3);},
  bola(e,t,P,r){ctx.rotate(Math.sin(t*6+e.x*.02)*.4);circ(0,0,r,P('#fff6df'),3);ctx.save();ctx.beginPath();ctx.arc(0,0,r-1.5,0,TAU);ctx.clip();ctx.fillStyle=e.parry&&!(e.cool>0)?'#9ff0e6':['#e8562e','#3a72b0','#2e8f86','#f2c14e','#8a63c7'][(e.n||0)%5];ctx.fillRect(-r,-r*.95,r*2,r*.5);ctx.fillRect(-r,r*.45,r*2,r*.5);ctx.restore();circ(0,0,r,null,3);
    circ(0,0,r*.5,'#fff',1.5);btxt(String(e.n||7),0,1,r*.62,C.ink,'center',900);},
  boleto(e,t,P,r){ctx.rotate(Math.atan2(e.vy||0,e.vx||1)+Math.sin(t*14)*.2);rr(-r*1.2,-r*.6,r*2.4,r*1.2,2,P('#f2c14e'),2.5);ctx.setLineDash([2,3]);line(-r*.6,-r*.6,-r*.6,r*.6,1.5);ctx.setLineDash([]);btxt('Nº',r*.2,1,r*.6,C.rustD,'center',900);},
  aire(e,t,P,r){ctx.globalAlpha=.85;for(let i=0;i<3;i++)circ(Math.cos(t*8+i*2)*r*.4,Math.sin(t*8+i*2)*r*.4,r*.55,P('#eaf6ff'),2);ctx.globalAlpha=1;}};
const _drawSprC=drawSpr;
drawSpr=function(e,t){const f=SPRC[e.spr];if(!f){_drawSprC(e,t);return;}const pc=e.parry&&!(e.cool>0),r=e.r||12,P=c=>pc?C.parry:c;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;
  f(e,t,P,r);ctx.restore();if(pc){ctx.beginPath();ctx.arc(e.x,e.y,r+7+Math.sin(t*12)*2,0,TAU);ctx.lineWidth=2.5;ctx.strokeStyle='rgba(159,240,230,.85)';ctx.stroke();}};

/* ---------- little helpers that come out to play ---------- */
const ENC={
  topito(e,t,F){const b=Math.abs(Math.sin(t*10))*4;ctx.translate(0,-b);ell(0,4,17,15,F('#8a5a3a'),3);ell(-6,8,8,6,F('#d9b48a'),0);ell(-10,-3,3,4,C.white,1.5);circ(-11,-3,1.6,C.ink,0);ell(-16,3,4,3,'#e88a8a',2);rr(-14,8,6,5,1,C.white,1.5);
    rr(-8,-16,18,6,2,'#f2c14e',2);rr(-4,-22,10,7,2,'#f2c14e',2);ell(-8,18,6,3,F('#6b4228'),2);ell(8,18,6,3,F('#6b4228'),2);},
  perrito(e,t,F){const b=Math.sin(t*12)*.1;ctx.rotate(b);for(const [x,y,rx,ry,a] of[[-10,8,5,10,.2],[8,8,5,10,-.2],[0,-2,14,8,0],[-14,-10,7,9,0],[12,-10,4,8,.6]])ell(x,y,rx,ry,F('#ff8fb3'),2.5,a);
    ell(-17,-12,2,2.5,C.ink,0);circ(-21,-8,2.5,'#e8562e',1.5);ell(-11,-18,3,6,F('#ff8fb3'),2,-.4);},
  pinito(e,t,F){const w=Math.sin(t*9)*.15;ctx.rotate(w);ctx.beginPath();ctx.moveTo(0,-26);ctx.bezierCurveTo(9,-26,8,-12,5,-8);ctx.bezierCurveTo(14,-2,14,18,0,20);ctx.bezierCurveTo(-14,18,-14,-2,-5,-8);ctx.bezierCurveTo(-8,-12,-9,-26,0,-26);
    ctx.fillStyle=F('#fbf6ea');ctx.fill();ctx.lineWidth=2.5;ctx.stroke();rr(-6,-12,12,3,1,'#c8392b',0);ell(-3,-19,1.8,2.6,C.ink,0);ell(3,-19,1.8,2.6,C.ink,0);ctx.beginPath();ctx.arc(0,-15,2.5,.2,Math.PI-.2);ctx.lineWidth=1.5;ctx.stroke();}};
const _drawEnemyC=drawEnemy;
drawEnemy=function(e,t){const f=ENC[e.skin];if(!f){_drawEnemyC(e,t);return;}if(e.hidden)return;ctx.save();ctx.translate(e.x,e.y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  const fl=e.flash>0,F=c=>fl?'#fff':c;if((e.face||-1)>0)ctx.scale(-1,1);f(e,e.t||0,F);ctx.restore();};

/* ---------- the casino stages ---------- */
function czWall(g,c1,c2){g.fillStyle=c1;g.fillRect(0,0,W,GROUND);g.fillStyle=c2;for(let y=0;y<GROUND;y+=48)for(let x=(y/48%2)*32;x<W;x+=64){g.beginPath();g.moveTo(x,y+24);g.lineTo(x+16,y+8);g.lineTo(x+32,y+24);g.lineTo(x+16,y+40);g.closePath();g.fill();}
  const gr=g.createRadialGradient(W/2,GROUND*.55,40,W/2,GROUND*.55,620);gr.addColorStop(0,'rgba(255,220,150,.18)');gr.addColorStop(1,'rgba(10,5,2,.55)');g.fillStyle=gr;g.fillRect(0,0,W,GROUND);}
function czMarquee(g,y,w,label){const x0=W/2-w/2;gR(g,x0,y,w,54,'#7a1f1a',4,10);gR(g,x0+8,y+8,w-16,38,'#f2c14e',3,6);g.font=`26px ${FONT}`;g.textAlign='center';g.textBaseline='middle';g.lineWidth=5;g.strokeStyle=C.ink;g.strokeText(label,W/2,y+28);g.fillStyle='#b5402f';g.fillText(label,W/2,y+28);
  for(let i=0;i<=w/22;i++){gE(g,x0+i*22,y,4,4,'#fff3c4',1.5);gE(g,x0+i*22,y+54,4,4,'#fff3c4',1.5);}}
function czFloor(g,c1,c2){g.fillStyle=c1;g.fillRect(0,GROUND,W,H-GROUND);for(let y=GROUND,r=0;y<H;y+=23,r++)for(let x=(r%2)*48;x<W;x+=96){g.fillStyle=c2;g.fillRect(x,y,48,23);}g.fillStyle='rgba(20,13,8,.85)';g.fillRect(0,GROUND,W,5);
  const gr=g.createLinearGradient(0,GROUND,0,H);gr.addColorStop(0,'rgba(255,230,170,.18)');gr.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=gr;g.fillRect(0,GROUND,W,H-GROUND);}
function czCurtainSides(g){for(const s of[-1,1]){const x0=s<0?0:W;g.beginPath();g.moveTo(x0,0);for(let y=0;y<=GROUND;y+=12)g.lineTo(x0-s*(56+Math.sin(y*.05)*6),y);g.lineTo(x0,GROUND);g.closePath();g.fillStyle='#8e2a22';g.fill();g.lineWidth=4;g.strokeStyle=C.ink;g.stroke();
  for(let i=1;i<4;i++){g.beginPath();g.moveTo(x0-s*i*14,0);g.lineTo(x0-s*i*14,GROUND);g.lineWidth=2;g.strokeStyle='rgba(20,13,8,.35)';g.stroke();}}}
const ACZ={
  cz_topo(g){czWall(g,'#5b2a2e','#6a3236');czMarquee(g,50,380,'¡GOLPEA AL TOPO!');
    for(const x of[110,850]){gR(g,x-60,120,120,GROUND-120,'#2e5f8a',4,10);gR(g,x-46,140,92,70,'#1d2a33',3,6);for(let i=0;i<3;i++)gE(g,x-24+i*24,175,9,9,['#e8562e','#f2c14e','#2ec4b6'][i],2);gR(g,x-50,230,100,16,'#f2c14e',3,4);}
    czFloor(g,'#3a6b3f','#2f5a34');czCurtainSides(g);},
  cz_canica(g){czWall(g,'#26324f','#2d3b5c');czMarquee(g,50,300,'MÁQUINA DE BOLAS');
    for(const [x,y,c] of[[180,170,'#e8562e'],[300,110,'#f2c14e'],[660,110,'#2ec4b6'],[780,170,'#8a63c7'],[480,200,'#e8562e']]){gE(g,x,y,34,34,'#14101c',4);gE(g,x,y,26,26,c,3);gE(g,x,y,10,10,'#fff3c4',2);}
    g.strokeStyle='rgba(242,193,78,.5)';g.lineWidth=6;g.beginPath();g.moveTo(70,GROUND);g.quadraticCurveTo(70,60,300,60);g.moveTo(W-70,GROUND);g.quadraticCurveTo(W-70,60,W-300,60);g.stroke();
    czFloor(g,'#3b3159','#322a4c');czCurtainSides(g);},
  cz_bolos(g){czWall(g,'#4a2e1e','#553524');czMarquee(g,50,300,'BOLERA LA CHUZA');
    for(let i=0;i<10;i++){const x=210+i*60,y=GROUND-118;g.beginPath();g.moveTo(x,y-44);g.bezierCurveTo(x+9,y-44,x+8,y-28,x+5,y-24);g.bezierCurveTo(x+14,y-18,x+14,y,x+9,y);g.lineTo(x-9,y);g.bezierCurveTo(x-14,y,x-14,y-18,x-5,y-24);g.bezierCurveTo(x-8,y-28,x-9,y-44,x,y-44);g.fillStyle='#fbf6ea';g.fill();g.lineWidth=2.5;g.strokeStyle=C.ink;g.stroke();g.fillStyle='#c8392b';g.fillRect(x-6,y-28,12,3);}
    gR(g,170,GROUND-118,620,10,'#7c4f2c',3,3);
    g.fillStyle='#c79a5e';g.fillRect(0,GROUND,W,H-GROUND);g.strokeStyle='rgba(20,13,8,.35)';g.lineWidth=2;for(let x=0;x<W;x+=24){g.beginPath();g.moveTo(x,GROUND);g.lineTo(x,H);g.stroke();}
    for(let i=0;i<5;i++)gP(g,[[300+i*90,GROUND+50],[310+i*90,GROUND+30],[320+i*90,GROUND+50]],'#b5402f',2);g.fillStyle='rgba(20,13,8,.85)';g.fillRect(0,GROUND,W,5);czCurtainSides(g);},
  cz_diana(g){czWall(g,'#3d4a2a','#465530');czMarquee(g,50,320,'TIRO AL BLANCO');
    for(let i=0;i<9;i++){const x=80+i*100,y=150;gE(g,x,y+14,24,10,'#e9d7a8',2.5);gE(g,x+12,y-4,12,12,'#e9d7a8',2.5);gP(g,[[x+22,y-4],[x+34,y],[x+22,y+2]],'#f2a43a',2);}
    gR(g,40,172,W-80,14,'#a06a3b',3,4);for(let i=0;i<16;i++){g.beginPath();g.moveTo(40+i*56,186);g.quadraticCurveTo(68+i*56,204,96+i*56,186);g.lineWidth=3;g.strokeStyle='#b5402f';g.stroke();}
    czFloor(g,'#6b4a2a','#5a3e24');czCurtainSides(g);},
  cz_caja(g){czWall(g,'#2c4a4a','#335656');czMarquee(g,50,300,'JUGUETERÍA');
    for(const y of[120,230,340]){gR(g,60,y,W-120,12,'#a06a3b',3,3);}
    for(let i=0;i<8;i++){const x=110+i*105,y=120;gR(g,x-18,y-36,36,36,['#e8562e','#3a72b0','#f2c14e','#2e8f86'][i%4],3,4);}
    for(let i=0;i<7;i++){const x=140+i*110,y=230;gE(g,x,y-16,16,16,'#e86a5a',3);gE(g,x,y-34,9,9,'#f2c14e',2.5);}
    for(let i=0;i<8;i++){const x=120+i*100,y=340;gR(g,x-14,y-44,28,44,'#fbf6ea',3,10);gE(g,x,y-50,11,11,'#e8c39e',2.5);}
    czFloor(g,'#7a5a8a','#6a4c7a');czCurtainSides(g);},
  cz_globo(g){skyG(g,'#f2d6b4','#e8b38a');for(let i=0;i<12;i++){g.fillStyle=i%2?'#c8392b':'#fff3e0';g.beginPath();g.moveTo(W/2,-40);g.lineTo(i*90-60,GROUND);g.lineTo(i*90+30,GROUND);g.closePath();g.fill();}
    g.fillStyle='rgba(20,13,8,.25)';g.fillRect(0,0,W,GROUND);for(let i=0;i<14;i++){const x=40+i*68,y=60+(i%3)*30;g.beginPath();g.moveTo(x,y+26);g.lineTo(x+(i%2?8:-8),y+80);g.lineWidth=1.5;g.strokeStyle=C.ink;g.stroke();gE(g,x,y,16,20,['#e8562e','#f2c14e','#2ec4b6','#8a63c7'][i%4],2.5);}
    czFloor(g,'#a6ae64','#97a058');czCurtainSides(g);},
  cz_tombola(g){czWall(g,'#4a1418','#56181c');
    const sr=g.createRadialGradient(W/2,GROUND,30,W/2,GROUND,560);sr.addColorStop(0,'rgba(255,214,120,.28)');sr.addColorStop(1,'rgba(255,214,120,0)');g.fillStyle=sr;g.fillRect(0,0,W,GROUND);
    for(let i=0;i<5;i++){const x=96+i*192;g.font=`64px ${FONT}`;g.textAlign='center';g.textBaseline='middle';g.lineWidth=7;g.strokeStyle=C.ink;g.strokeText('BINGO'[i],x,92);g.fillStyle='#f2c14e';g.fillText('BINGO'[i],x,92);
      for(let k=0;k<14;k++){const a=k/14*TAU;gE(g,x+Math.cos(a)*50,92+Math.sin(a)*50,4,4,k%2?'#fff3c4':'#e8562e',1.5);}}
    czFloor(g,'#1d1720','#2a2230');for(let i=1;i<5;i++){g.fillStyle='#f2c14e';g.fillRect(i*192-3,GROUND,6,H-GROUND);}
    for(let i=0;i<5;i++){g.font=`30px ${FONT}`;g.lineWidth=5;g.strokeStyle=C.ink;g.strokeText('BINGO'[i],96+i*192,GROUND+46);g.fillStyle='#fff3c4';g.fillText('BINGO'[i],96+i*192,GROUND+46);}
    czCurtainSides(g);}};
const _paintArenaC=paintArena;paintArena=function(g,k){if(ACZ[k]){ACZ[k](g);return;}_paintArenaC(g,k);};

/* ---------- attacks shared by the casino fights ---------- */
const CZ_LANES=[96,288,480,672,864];
Object.assign(ATK,{
  /* only while the boss is out in the open (the mole above ground, the jack outside its box...) */
  czUp(L,B,a){if(B.st==='up'&&!B.hidden&&!B.pun)ATK[a.do](L,B,a);},
  czLeap(L,B,a){if(!B.pun)ATK.leap(L,B,a);},
  czPunch(L,B,a){if(B.pun||B.act)return;const t=tgt(L,B);B.punHi=!B.punHi;B.pun={t:0,hi:B.punHi,dir:t.x<B.x?-1:1};sfx('warn');},
  /* numbered bingo balls that bounce across the floor */
  czBalls(L,B,a){const o=anc(B,a.from),t=aimPt(tgt(L,B));for(let i=0;i<(a.n||1);i++){B.pc++;const T=1.1+i*.3,vx=clamp((t.x-o.x)/T,-560,560)*(1+i*.2);
      spawnEB(L,{k:'grav',x:o.x,y:o.y,vx,vy:-560-i*80,g:1300,r:a.r||17,spr:'bola',n:1+Math.floor(rand()*75),bounce:a.bounce??2,parry:!!a.parry&&B.pc%a.parry===0});}B.pop=.4;sfx('pop');sfx('ring');},
  /* the owner sings the lanes: B, I, N, G, O. A giant ball crushes the called lanes */
  czBingo(L,B,a){const n=a.n||1,pool=[0,1,2,3,4];let picks=[];while(picks.length<n){const k=pool.splice(Math.floor(rand()*pool.length),1)[0];picks.push(k);}
    if(picks.filter(k=>k<3).length>=3)picks.pop();if(!picks.length)picks=[4];
    const nums=picks.map(k=>1+k*15+Math.floor(rand()*15));B.calls=(B.calls||[]).concat(picks.map((k,i)=>({k,t:0,num:nums[i],d:i*.12})));
    for(const [i,k] of picks.entries())B.queue.push({t:i*.12,fn:()=>spawnEB(L,{k:'column',x:CZ_LANES[k],warn:a.warn||1.05,act:.4,w:186,style:'bingo',num:nums[i],lane:k})});
    sfx('warn');sfx('cymbal');B.mouth=1.2;}});
/* the giant falling bingo ball that crushes a lane */
const _drawColumnC=drawColumn;
drawColumn=function(e,L){if(e.style!=='bingo'){_drawColumnC(e,L);return;}const x=e.x,w=e.w,k=e.t-e.warn;ctx.save();
  if(k<0){const bl=Math.floor(e.t*10)%2;ctx.globalAlpha=.22+bl*.18;ctx.fillStyle=bl?'#f2c14e':'#e8562e';ctx.fillRect(x-w/2,0,w,GROUND);ctx.globalAlpha=1;ctx.setLineDash([10,8]);ctx.lineWidth=3;ctx.strokeStyle='rgba(242,193,78,.9)';ctx.strokeRect(x-w/2+4,4,w-8,GROUND-8);ctx.setLineDash([]);
    txt('BINGO'[e.lane]+'-'+e.num,x,GROUND-40,34,'#fff3c4',C.ink);ctx.restore();return;}
  const fall=Math.min(1,k/.05),ret=k>e.act?Math.min(1,(k-e.act)/.35):0,r=w/2-6,cy=lerp(-r,GROUND-r*.82,fall)-ret*60,sq=fall>=1&&!ret?.86:1;ctx.globalAlpha=1-ret;
  ctx.fillStyle='rgba(255,240,190,.25)';ctx.fillRect(x-w/2,0,w,cy);ctx.translate(x,cy);ctx.scale(1/sq,sq);circ(0,0,r,'#fff6df',5);ctx.save();ctx.beginPath();ctx.arc(0,0,r-3,0,TAU);ctx.clip();ctx.fillStyle=['#e8562e','#3a72b0','#2e8f86','#f2c14e','#8a63c7'][e.lane];ctx.fillRect(-r,-r,2*r,r*.5);ctx.fillRect(-r,r*.5,2*r,r*.5);ctx.restore();
  circ(0,0,r*.48,'#fff',3);txt(String(e.num),0,2,r*.5,C.ink,null);ell(-r*.45,-r*.5,r*.22,r*.12,'rgba(255,255,255,.7)',0,-.5);ctx.restore();
  if(fall>=1&&!e.boomed){e.boomed=true;shake(L,12);sfx('stomp');for(let i=0;i<6;i++)L.fx.push({k:'puff',x:x+(rand()-.5)*w,y:GROUND-4,vx:(rand()-.5)*300,vy:-80-rand()*120,life:.5,max:.5,r:9+rand()*8,col:C.paper});}};

/* ---------- 1. TOPO TITO: whack-a-mole. He pops out of one of three holes ---------- */
const TOPO_HOLES=[220,480,740];
function topoHole(x,front){if(!front){ell(x,GROUND+2,74,18,'#1a120c',3);return;}ctx.save();ctx.beginPath();ctx.ellipse(x,GROUND+2,82,22,0,0,Math.PI);ctx.lineWidth=12;ctx.strokeStyle='#6b4228';ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.ellipse(x,GROUND+2,88,26,0,0,Math.PI);ctx.stroke();
  for(let i=0;i<5;i++)circ(x-70+i*35,GROUND+16+Math.sin(i*2)*4,6,'#8a5a3a',2);ctx.restore();}
defBoss({id:'topo',name:'Topo Tito',sub:'Concursante · Golpea al Topo',isl:4,hp:300,par:75,arena:'cz_topo',song:'topo',x:480,intro:'¡DALE AL TOPO SI PUEDES!',casino:1,
  center(B){return{x:B.x,y:GROUND-110*B.k};},
  anchor(B,n){if(n==='hand')return{x:B.x-70,y:GROUND-150*B.k};if(n==='mouth')return{x:B.x-20,y:GROUND-110*B.k};if(n==='hole'){const h=TOPO_HOLES.filter(x=>x!==B.x);return{x:h[Math.floor(rand()*h.length)],y:GROUND-20};}return null;},
  shapes(B){return B.st==='down'||B.k<.35?[]:[{x:B.x,y:GROUND-115*B.k,r:58},{x:B.x,y:GROUND-30,r:44}];},
  setup(B){B.st='up';B.stT=2.4;B.k=1;},
  move(B,dt,L){const ph=B.phase;B.stT-=dt;
    if(B.st==='up'&&B.stT<=0){B.st='sink';sfx('whistleDown');}
    else if(B.st==='sink'){B.k=Math.max(0,B.k-dt*4.5);if(B.k<=0){B.st='down';B.hidden=true;B.stT=ph?.45:.6;const t=L.Ps.find(p=>!p.dead)||L.Ps[0],opts=TOPO_HOLES.filter(x=>x!==B.x);B.x=rand()<.55?opts.reduce((a,b)=>Math.abs(b-t.x)<Math.abs(a-t.x)?b:a):pick(opts);}}
    else if(B.st==='down'&&B.stT<=0){B.st='rise';B.hidden=false;sfx('boing');puff(L,B.x,GROUND-6,8,'#8a5a3a');}
    else if(B.st==='rise'){B.k=Math.min(1,B.k+dt*5);if(B.k>=1){B.st='up';B.stT=ph?1.9:2.5;B.squash=.25;}}},
  phases:[
    {atk:[{f:'czUp',do:'lob',every:1.5,from:'hand',n:2,spr:'mazo',r:14,parry:3,T:1.1},{f:'czUp',do:'aimed',every:2.1,from:'mouth',n:3,spread:.25,spd:300,spr:'tierra',r:12},{f:'minion',every:5,from:'hole',ai:'walker',skin:'topito',hp:3,r:18,max:2,spd:120}]},
    {banner:'¡TOPOS POR TODAS PARTES!',atk:[{f:'czUp',do:'lob',every:1.3,from:'hand',n:3,spr:'mazo',r:14,parry:3,T:1},{f:'column',every:3.4,n:2,gap:.55,style:'stamp',w:70,warn:.75},{f:'minion',every:3.8,from:'hole',ai:'hopper',skin:'topito',hp:3,r:18,max:3,spd:140},{f:'czUp',do:'ring',every:3,from:'mouth',n:8,spd:220,spr:'tierra',r:11,parry:4}]}],
  draw(B,L){const t=B.t;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';for(const x of TOPO_HOLES)topoHole(x,false);
    if(B.k>0){const y=GROUND+12-150*B.k,x=B.x;ctx.save();ctx.beginPath();ctx.rect(x-150,-50,300,GROUND+6+50);ctx.clip();bossSquash(B,L);
      hose(x-46,y+70,x-80,y+50+Math.sin(t*6)*8,x-74,y+12,8);glove(x-74,y+12,13);
      ctx.save();ctx.translate(x-74,y+12);ctx.rotate(-.6+Math.sin(t*6)*.5+(B.throwT>0?1.2:0));rr(-4,-60,8,62,3,C.woodL,3);rr(-26,-84,52,30,8,'#e8562e',3.5);rr(-26,-84,12,30,3,'#f2c14e',3);rr(14,-84,12,30,3,'#f2c14e',3);ctx.restore();
      hose(x+46,y+70,x+84,y+60,x+80,y+30+Math.sin(t*4)*6,8);glove(x+80,y+30+Math.sin(t*4)*6,13);
      rr(x-62,y,124,180,58,'#8a5a3a',5);ell(x,y+110,40,60,'#d9b48a',0);for(let i=0;i<4;i++)line(x-48+i*32,y+50,x-48+i*32,y+150,3,'rgba(232,86,46,.8)');
      rr(x-30,y+42,60,18,5,'#c8392b',3);poly([[x,y+51],[x-16,y+42],[x-16,y+60]],'#c8392b',3);poly([[x,y+51],[x+16,y+42],[x+16,y+60]],'#c8392b',3);
      bossFace(B,L,x,y+4,.8,{gap:24,ew:13,eh:16,my:46,mw:30,open:B.mouth>0?.8:.25,mouth:B.st==='up'&&B.mouth<=0?'smile':undefined});ell(x,y+28,14,10,'#e88a8a',3);rr(x-9,y+44,8,12,2,C.white,2);rr(x+1,y+44,8,12,2,C.white,2);
      ell(x,y-28,74,12,'#e9d39a',4);rr(x-44,y-62,88,36,8,'#e9d39a',4);rr(x-44,y-44,88,12,0,'#c8392b',2.5);ctx.restore();}
    for(const x of TOPO_HOLES)topoHole(x,true);
    if(B.st==='down'){const k=(B.t*6)%1;for(let i=0;i<3;i++)circ(B.x-30+i*30,GROUND-6-Math.abs(Math.sin(B.t*14+i))*10,5,'#8a5a3a',2);}
    const c=B.center();flashOver(B,c.x,c.y,70);koStars(B,L,c.x,c.y-110);ctx.restore();}});

/* ---------- 2. CANICA LOCA: a giant marble that bounces around like a pinball ---------- */
const CANR=70;
defBoss({id:'canica',name:'Canica Loca',sub:'Concursante · Máquina de Bolas',isl:4,hp:320,par:75,arena:'cz_canica',song:'canica',x:560,y:GROUND-CANR-160,intro:'¡A REBOTAR!',casino:1,plats:[[150,300,150],[660,300,150]],
  center(B){return{x:B.x,y:B.y};},anchor(B,n){if(n==='mouth')return{x:B.x,y:B.y+20};return{x:B.x,y:B.y};},
  shapes(B){return[{x:B.x,y:B.y,r:CANR-6}];},
  setup(B){B.vx=200;B.vy=0;B.spin=0;},
  move(B,dt,L){const ph=B.phase,sp=[210,270][ph]||270,jv=[980,1060][ph]||1060;if(Math.abs(B.vx)<sp-5)B.vx=Math.sign(B.vx||-1)*sp;B.vy+=1500*dt;B.x+=B.vx*dt;B.y+=B.vy*dt;B.spin+=B.vx*dt/CANR;
    if(B.y>GROUND-CANR){B.y=GROUND-CANR;B.vy=-jv*(.92+rand()*.16);B.squash=.32;shake(L,6);sfx('boing');puff(L,B.x-30,GROUND,3);puff(L,B.x+30,GROUND,3);}
    if(B.x<CANR+12){B.x=CANR+12;B.vx=Math.abs(B.vx);sfx('knock');}if(B.x>W-CANR-12){B.x=W-CANR-12;B.vx=-Math.abs(B.vx);sfx('knock');}},
  phases:[
    {atk:[{f:'ring',every:3,from:'mouth',n:8,spd:200,spr:'canica',r:12,parry:4},{f:'aimed',every:2.2,from:'mouth',n:1,spd:330,spr:'canica',r:13,parry:3}]},
    {banner:'¡MULTIBOLA!',atk:[{f:'bouncer',every:2.6,from:'mouth',spr:'canica',r:20,max:3,spd:360,life:6},{f:'ring',every:2.8,from:'mouth',n:10,spd:220,spr:'canica',r:11,parry:5},{f:'rain',every:3.6,n:4,spr:'canica',r:12,spd:[260,360]}]}],
  draw(B,L){const x=B.x,y=B.y;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';shadowE(x,GROUND+3,60*clamp(1-(GROUND-y-CANR)/500,.3,1),.3);
    ctx.save();ctx.translate(x,y+CANR);const sq=B.squash||0;ctx.scale(1+sq*.4,1-sq*.4);ctx.translate(-x,-y-CANR);
    circ(x,y,CANR,B.phase?'#5aa9c4':'#7bc4d9',5);ctx.save();ctx.beginPath();ctx.arc(x,y,CANR-3,0,TAU);ctx.clip();ctx.translate(x,y);ctx.rotate(B.spin);
    for(let i=0;i<3;i++){ctx.rotate(TAU/3);ctx.beginPath();ctx.moveTo(-CANR,0);ctx.bezierCurveTo(-CANR*.3,-CANR*.9,CANR*.3,CANR*.9,CANR,0);ctx.lineWidth=16;ctx.strokeStyle=['#e8562e','#f2c14e','#2e8f86'][i];ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle='rgba(20,13,8,.5)';ctx.stroke();}ctx.restore();
    circ(x,y-4,36,'rgba(255,250,235,.8)',0);bossFace(B,L,x,y-12,.7,{gap:20,ew:12,eh:15,my:36,mw:26,open:B.mouth>0?.9:.4});
    ell(x-34,y-38,22,12,'rgba(255,255,255,.75)',0,-.6);circ(x+30,y+34,6,'rgba(255,255,255,.45)',0);ctx.restore();
    const c=B.center();flashOver(B,c.x,c.y,CANR);koStars(B,L,c.x,c.y-90);ctx.restore();}});

/* ---------- 3. LOS BOLOS: the big pin and his two little brothers ---------- */
function drawPin(x,y,s,B,L,big,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.beginPath();ctx.moveTo(0,-200);ctx.bezierCurveTo(44,-200,40,-120,26,-104);ctx.bezierCurveTo(72,-80,70,-6,40,0);ctx.lineTo(-40,0);ctx.bezierCurveTo(-70,-6,-72,-80,-26,-104);ctx.bezierCurveTo(-40,-120,-44,-200,0,-200);
  ctx.fillStyle=B.phase&&big?'#f4ece0':'#fbf6ea';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();rr(-30,-122,60,10,3,'#c8392b',2.5);rr(-33,-104,66,8,3,'#c8392b',2.5);ell(-22,-60,8,26,'rgba(255,255,255,.7)',0,-.2);
  if(big){hose(-44,-70,-80,-60+Math.sin(t*5)*6,-86,-36+(B.throwT>0?-40:0),7);glove(-86,-36+(B.throwT>0?-40:0),12);hose(44,-70,78,-80,84,-50+Math.sin(t*4)*6,7);glove(84,-50+Math.sin(t*4)*6,12);
    ell(0,-200,40,8,'#2b2a33',3.5);rr(-26,-232,52,32,10,'#2b2a33',3.5);rr(-26,-212,52,7,0,'#c8392b',0);ctx.restore();bossFace(B,L,x,y-160*s,.62*s,{gap:22,ew:12,eh:15,my:32,mw:26,open:B.mouth>0?.8:.3});return;}
  ctx.restore();face(x,y-160*s,.45*s,{gap:22,ew:12,eh:15,my:30,mw:24,open:.3,look:lookAt(L,x,y-160*s),ang:.3});}
defBoss({id:'bolos',name:'Los Hermanos Bolo',sub:'Concursantes · Bolera La Chuza',isl:4,hp:320,par:75,arena:'cz_bolos',song:'bolos',x:720,intro:'¡A TIRAR LOS BOLOS!',casino:1,faceTarget:true,
  center(B){return{x:B.x,y:GROUND-110};},anchor(B,n){if(n==='hand')return{x:B.x-90,y:GROUND-110};if(n==='foot')return{x:B.x-60,y:GROUND};if(n==='top')return{x:B.x,y:GROUND-230};return null;},
  shapes(B){return[{x:B.x,y:B.y-55,r:56},{x:B.x,y:B.y-150,r:36}];},
  setup(B){B.bros=[{x:B.x+120,hop:0},{x:B.x+200,hop:.5}];},
  move(B,dt,L){B.x=lerp(B.x,720+Math.sin(B.t*.6)*40,Math.min(1,dt*2));for(const b of B.bros||[])b.hop+=dt;},
  onPhase(B,L,i){if(i===1){B.bros=[];for(const d of[-1,1]){const e=mkEnt(L,{tag:B,ai:'hopper',skin:'pinito',hp:4,r:22,x:B.x+d*90,y:GROUND-22,spd:150,face:-1,active:true,gy:GROUND,cool:1,wait:.3,state:'in',by:GROUND-22,drop:1});puff(L,e.x,e.y,6);}}},
  phases:[
    {atk:[{f:'roller',every:2.6,from:'foot',spr:'bolaBol',r:30,spd:400,sfx:'knock'},{f:'lob',every:1.9,from:'hand',n:2,spr:'bolo',r:15,parry:3,T:1.2},{f:'aimed',every:3,from:'top',n:3,spread:.3,spd:280,spr:'bolo',r:13,parry:4}]},
    {banner:'¡CHUZA!',atk:[{f:'leap',every:3.2,vy:-1150,T:1.05,landWave:true},{f:'roller',every:2.3,from:'foot',spr:'bolaBol',r:30,spd:460,hop:520,sfx:'knock'},{f:'lob',every:2,from:'hand',n:3,spr:'bolo',r:15,parry:3,T:1.1},{f:'minion',every:5,from:'hand',ai:'hopper',skin:'pinito',hp:3,r:20,max:3,spd:150}]}],
  draw(B,L){const t=B.t;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    for(const b of B.bros||[]){const hy=Math.abs(Math.sin(b.hop*4))*18;shadowE(b.x,GROUND+3,26,.25);drawPin(b.x,GROUND-hy,.48,B,L,false,t);}
    shadowE(B.x,GROUND+3,56,.3);ctx.save();bossSquash(B,L);ctx.translate(B.x,B.y);ctx.rotate(Math.sin(t*3)*.04+(B.act&&B.act.type==='leap'?Math.sin(t*20)*.2:0));ctx.translate(-B.x,-B.y);drawPin(B.x,B.y,1,B,L,true,t);ctx.restore();
    const c=B.center();flashOver(B,c.x,c.y,80);koStars(B,L,c.x,c.y-150);ctx.restore();}});

/* ---------- 4. SEÑORA DIANA: a spinning dartboard ---------- */
defBoss({id:'diana',name:'Señora Diana',sub:'Concursante · Tiro al Blanco',isl:4,hp:300,par:75,arena:'cz_diana',song:'diana',x:700,y:240,intro:'¡APUNTA BIEN!',casino:1,
  center(B){return{x:B.x,y:B.y};},anchor(B,n){if(n==='hand')return{x:B.x-120,y:B.y+20};return{x:B.x,y:B.y};},
  shapes(B){return[{x:B.x,y:B.y,r:104}];},
  setup(B){B.rot=0;},
  move(B,dt){B.rot+=dt*(B.phase?2.4:1.2);B.x=lerp(B.x,700+Math.sin(B.t*.7)*80,Math.min(1,dt*2));B.y=lerp(B.y,230+Math.sin(B.t*1.3)*40,Math.min(1,dt*2));},
  phases:[
    {atk:[{f:'aimed',every:1.8,from:'hand',n:3,spread:.18,spd:380,spr:'dardo',r:12,parry:4},{f:'ring',every:3.4,from:'center',n:10,spd:210,spr:'dardo',r:11},{f:'rain',every:4,n:4,spr:'dardo',r:12,spd:[300,380]}]},
    {banner:'¡DARDOS GIGANTES!',atk:[{f:'column',every:2.8,n:3,gap:.32,style:'needle',warn:.7,spread:150},{f:'aimed',every:1.7,from:'hand',n:3,spread:.22,spd:420,spr:'dardo',r:12,parry:3},{f:'tele',every:5,minx:420,maxx:800},{f:'spiral',every:4.4,from:'center',dur:1.2,rate:.09,spd:220,spr:'dardo',r:10,arms:3,parry:7}]}],
  draw(B,L){const x=B.x,y=B.y,t=B.t;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';line(x,y-104,x,-10,3);line(x-30,y-90,x,-10,2,'rgba(20,13,8,.5)');line(x+30,y-90,x,-10,2,'rgba(20,13,8,.5)');
    hose(x-96,y+30,x-130,y+50,x-128,y+14+(B.mouth>0?-20:0),7);glove(x-128,y+14+(B.mouth>0?-20:0),12);hose(x+96,y+30,x+130,y+60,x+120,y+90,7);glove(x+120,y+90,12);
    ctx.save();ctx.translate(x,y);bossSquash({x:0,y:0,squash:B.squash},L);ctx.rotate(B.rot);circ(0,0,110,'#1d1a1a',5);
    for(let i=0;i<20;i++){const a=i*TAU/20;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,96,a,a+TAU/20);ctx.closePath();ctx.fillStyle=i%2?'#fbf0d4':'#2b2a33';ctx.fill();}
    for(const [r1,r2] of[[96,86],[56,48]])for(let i=0;i<20;i++){const a=i*TAU/20;ctx.beginPath();ctx.arc(0,0,r1,a,a+TAU/20);ctx.arc(0,0,r2,a+TAU/20,a,true);ctx.closePath();ctx.fillStyle=i%2?'#2e8f86':'#c8392b';ctx.fill();}
    for(let i=0;i<20;i++){const a=i*TAU/20+TAU/40;ctx.save();ctx.rotate(a+Math.PI/2);btxt(String([20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5][i]),0,-102,11,'#fbf0d4','center',900);ctx.restore();}
    ctx.restore();circ(x,y,44,'#c8392b',4);circ(x,y,34,'#fbf0d4',0);bossFace(B,L,x,y-6,.62,{gap:18,ew:10,eh:13,my:30,mw:22,open:B.mouth>0?.8:.3});
    for(const [a,d] of[[.7,70],[2.6,80],[4.2,64]]){const aa=a+B.rot,px=x+Math.cos(aa)*d,py=y+Math.sin(aa)*d;ctx.save();ctx.translate(px,py);ctx.rotate(aa+.6);rr(0,-3,30,6,2,'#f2c14e',2);poly([[30,0],[42,-9],[42,9]],'#c8392b',2);ctx.restore();}
    flashOver(B,x,y,104);koStars(B,L,x,y-130);ctx.restore();}});

/* ---------- 5. SALTARÍN: the jack-in-the-box that punches high and low ---------- */
function cajaHead(B){const p=B.pun;if(!p)return null;const t=p.t,warn=.55,out=.3,hold=.28,back=.42;let e;if(t<warn)e=-.06*Math.sin(t*40);else if(t<warn+out){const k=(t-warn)/out;e=1-(1-k)*(1-k);}else if(t<warn+out+hold)e=1;else e=Math.max(0,1-(t-warn-out-hold)/back);
  const hy=p.hi?GROUND-78:GROUND-30,bx=B.x+p.dir*70;return{x:bx+p.dir*Math.max(0,e)*560,y:hy,e,bx,by:GROUND-150};}
defBoss({id:'caja',name:'Saltarín',sub:'Concursante · Juguetería',isl:4,hp:320,par:75,arena:'cz_caja',song:'caja',x:770,intro:'¡SORPRESA!',casino:1,
  center(B){return{x:B.x,y:GROUND-160};},anchor(B,n){if(n==='top')return{x:B.x,y:GROUND-250};if(n==='hand')return{x:B.x-90,y:GROUND-130};return null;},
  shapes(B){const s=[{x:B.x-80,y:B.y-150,w:160,h:150}];if(!B.pun)s.push({x:B.x,y:B.y-230,r:46});else{const h=cajaHead(B);if(h)s.push({x:h.x,y:h.y,r:32});}return s;},
  move(B,dt,L){if(B.pun){B.pun.t+=dt;const h=cajaHead(B);if(B.pun.t>.55&&!B.pun.snd){B.pun.snd=1;sfx('boing');shake(L,6);}if(h&&h.e>=1&&!B.pun.hit){B.pun.hit=1;puff(L,h.x,h.y,6);sfx('hitBig');}if(B.pun.t>1.6)B.pun=null;}
    else if(!B.act){const t=L.Ps.find(p=>!p.dead);if(t)B.face=t.x<B.x?-1:1;}},
  phases:[
    {atk:[{f:'czPunch',every:2.6,noAct:true},{f:'lob',every:2.2,from:'top',n:2,spr:'bloque',r:15,bounce:1,parry:3,T:1.2},{f:'rain',every:3.2,n:5,spr:'confeti',r:10,spd:[200,300]}]},
    {banner:'¡DALE A LA MANIVELA!',atk:[{f:'czPunch',every:2.2,noAct:true},{f:'czLeap',every:4.6,side:true,minx:220,maxx:760,vy:-1050,T:1.1},{f:'ring',every:3.2,from:'top',n:9,spd:220,spr:'confeti',r:10,parry:4},{f:'lob',every:2.6,from:'top',n:2,spr:'bloque',r:15,bounce:1,parry:3}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';shadowE(x,GROUND+3,90,.3);bossSquash(B,L);
    const h=cajaHead(B);
    rr(x-80,y-150,160,150,10,'#c8392b',5);for(let i=0;i<4;i++)poly([[x-80+i*40,y-150],[x-60+i*40,y-130],[x-40+i*40,y-150]],'#f2c14e',2.5);rr(x-60,y-110,120,90,8,'#fbf0d4',3.5);btxt('JACK',x,y-80,22,'#3a72b0','center',900);btxt('¡BOING!',x,y-50,16,'#c8392b','center',900);
    const cr=t*(B.pun?14:4),cx=x+82,cy=y-80;rr(cx,cy-5,26,10,4,C.steel,2.5);ctx.save();ctx.translate(cx+26,cy);ctx.rotate(cr);rr(-4,-30,8,30,3,C.steel,2.5);circ(0,-30,8,'#e8562e',2.5);ctx.restore();
    ctx.save();ctx.translate(x,y-150);ctx.rotate(B.pun?-1.9:-.25);rr(-82,-8,164,10,3,'#c8392b',4);ctx.restore();
    let hx,hy,hs;if(h){hx=h.x;hy=h.y;hs=.75;const n=14;ctx.beginPath();for(let i=0;i<=n;i++){const k=i/n,px=lerp(x,hx,k),py=lerp(y-150,hy,k)+(i%2?-12:12)*(1-Math.abs(k-.5));i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.lineWidth=7;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=3.5;ctx.strokeStyle=C.steel;ctx.stroke();}
    else{hx=x+Math.sin(t*3)*10;hy=y-230+Math.sin(t*5)*8;hs=1;const n=6;ctx.beginPath();for(let i=0;i<=n;i++){const k=i/n;ctx.lineTo(x+(i%2?-14:14),lerp(y-150,hy+30,k));}ctx.lineWidth=7;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=3.5;ctx.strokeStyle=C.steel;ctx.stroke();}
    ctx.save();ctx.translate(hx,hy);if(h)ctx.rotate(h.e>.5?Math.sin(t*30)*.1:0);ctx.scale(hs,hs);
    for(let i=0;i<6;i++){const a=Math.PI+i*Math.PI/5;poly([[Math.cos(a)*40,Math.sin(a)*40+20],[Math.cos(a+.25)*64,Math.sin(a+.25)*64+20],[Math.cos(a+.5)*40,Math.sin(a+.5)*40+20]],i%2?'#f2c14e':'#2e8f86',2.5);}
    circ(0,0,44,'#fbe6cf',4);circ(0,10,10,'#e8562e',3);ell(-26,16,8,5,'rgba(232,86,46,.5)',0);ell(26,16,8,5,'rgba(232,86,46,.5)',0);
    poly([[-30,-34],[0,-90],[30,-34]],'#8a63c7',3.5);circ(0,-90,8,'#f2c14e',2.5);circ(-14,-50,4,'#f2c14e',0);circ(10,-62,4,'#f2c14e',0);ctx.restore();
    bossFace(B,L,hx,hy-10*hs,.5*hs,{gap:30,ew:14,eh:17,my:52,mw:40,open:h?(h.e>.5?1:.5):(B.mouth>0?.8:.2),mouth:h?undefined:'smile'});
    if(h&&h.e<0&&B.pun.t<.55){ctx.globalAlpha=.6+Math.sin(t*30)*.3;txt('!',hx,hy-70,40,C.gold,C.ink);ctx.globalAlpha=1;}
    const c=B.center();flashOver(B,c.x,c.y,90);koStars(B,L,x,y-280);ctx.restore();}});

/* ---------- 6. GLOBO PERRITO: a balloon dog that slowly loses its air ---------- */
defBoss({id:'globo',name:'Globo Perrito',sub:'Concursante · Feria de Globos',isl:4,hp:300,par:75,arena:'cz_globo',song:'globo',x:700,y:220,intro:'¡GUAU GUAU, POP!',casino:1,
  center(B){return{x:B.x,y:B.y};},anchor(B,n){if(n==='mouth')return{x:B.x-110*B.sz,y:B.y-30*B.sz};if(n==='tail')return{x:B.x+100*B.sz,y:B.y-40*B.sz};return{x:B.x,y:B.y};},
  shapes(B){const s=B.sz;return[{x:B.x,y:B.y,r:70*s},{x:B.x-100*s,y:B.y-40*s,r:42*s}];},
  setup(B){B.sz=1;B.tx=700;B.ty=220;B.mt=0;},
  move(B,dt,L){if(B.phase===0){B.x=lerp(B.x,680+Math.sin(B.t*.6)*120,Math.min(1,dt*1.6));B.y=lerp(B.y,210+Math.sin(B.t*1.2)*50,Math.min(1,dt*1.6));}
    else{B.sz=lerp(B.sz,.78,Math.min(1,dt));B.mt-=dt;if(B.mt<=0){B.mt=.9+rand()*.6;B.tx=260+rand()*560;B.ty=110+rand()*220;sfx('whistleUp');}
      B.x=lerp(B.x,B.tx,Math.min(1,dt*2.4));B.y=lerp(B.y,B.ty,Math.min(1,dt*2.4));if(rand()<dt*14)L.fx.push({k:'puff',x:B.x+100*B.sz,y:B.y-30,vx:120+rand()*80,vy:(rand()-.5)*60,life:.4,max:.4,r:6+rand()*6,col:'#eaf6ff'});}},
  phases:[
    {atk:[{f:'aimed',every:2,from:'mouth',n:2,spread:.3,spd:200,spr:'globo',r:16,parry:2},{f:'minion',every:4,from:'tail',ai:'walker',skin:'perrito',hp:3,r:20,max:2,spd:130},{f:'rain',every:3,n:4,spr:'confeti',r:10,spd:[220,300]}]},
    {banner:'¡SE ESCAPA EL AIRE!',atk:[{f:'spiral',every:3.6,from:'tail',dur:1.4,rate:.08,spd:230,spr:'aire',r:12,arms:2,parry:6},{f:'column',every:3.2,n:2,gap:.4,style:'steam',w:70,warn:.75},{f:'aimed',every:1.9,from:'mouth',n:3,spread:.25,spd:240,spr:'globo',r:15,parry:3}]}],
  draw(B,L){const x=B.x,y=B.y,t=B.t,s=B.sz;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x+10,y+60*s);ctx.quadraticCurveTo(x+40,y+160,x+Math.sin(t*2)*20,GROUND-20);ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(Math.sin(t*2)*.06+(B.phase?Math.sin(t*9)*.08:0));bossSquash({x:0,y:0,squash:B.squash},L);const c1=B.phase?'#ff7aa6':'#ff8fb3',st=4.5;
    for(const [px,py,rx,ry,a] of[[-50,58,15,40,.25],[-20,62,15,40,-.1],[40,60,15,40,.15],[66,56,15,40,-.25]])ell(px,py,rx,ry,c1,st,a);
    ell(0,0,80,40,c1,st);ell(92,-40,16,42,c1,st,.6);circ(108,-74,12,c1,st);
    ell(-90,-16,30,40,c1,st,.2);ell(-110,-40,48,34,c1,st);ell(-78,-92,16,36,c1,st,-.3);ell(-130,-90,16,36,c1,st,.3);circ(-156,-34,10,'#e8562e',3);
    for(const [px,py,rx,ry,a] of[[-30,-14,22,8,0],[-120,-56,16,6,0],[20,-16,26,8,0]])ell(px,py,rx,ry,'rgba(255,255,255,.55)',0,a);
    for(const kx of[-50,20,-110])poly([[kx-6,-30],[kx+6,-30],[kx,-20]],'#e85a8a',2);ctx.restore();
    bossFace(B,L,x-118*s,y-48*s,.48*s,{gap:22,ew:12,eh:15,my:30,mw:22,open:B.mouth>0?.8:.3});
    flashOver(B,x,y,80*s);koStars(B,L,x,y-110);ctx.restore();}});

/* ---------- 7. DON TÓMBOLA: the owner. A bingo drum that sings the lanes ---------- */
function tombCage(B,L,x,y,R,ang,hot){ctx.save();ctx.translate(x,y);const n=6;
  ctx.beginPath();for(let i=0;i<n;i++){const a=ang+i*TAU/n;i?ctx.lineTo(Math.cos(a)*R,Math.sin(a)*R*.86):ctx.moveTo(Math.cos(a)*R,Math.sin(a)*R*.86);}ctx.closePath();ctx.fillStyle=hot?'rgba(255,150,90,.18)':'rgba(255,240,200,.14)';ctx.fill();ctx.lineWidth=7;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=3.5;ctx.strokeStyle=C.gold;ctx.stroke();
  for(let i=0;i<9;i++){const k=(i*.37+B.t*(hot?1.8:.7))%1,a=i*2.3+B.t*(hot?6:2.5);circ(Math.cos(a)*R*.55*k,Math.sin(a)*R*.4*k+R*.3,13,['#e8562e','#3a72b0','#2e8f86','#f2c14e','#8a63c7'][i%5],2.5);}
  for(let i=0;i<n;i++){const a=ang+i*TAU/n;ctx.beginPath();ctx.moveTo(Math.cos(a)*R,Math.sin(a)*R*.86);ctx.lineTo(Math.cos(a)*R*.18,Math.sin(a)*R*.16);ctx.lineWidth=3;ctx.strokeStyle='rgba(242,193,78,.75)';ctx.stroke();}ctx.restore();}
defBoss({id:'tombola',name:'Don Tómbola',sub:'Dueño del Casino',isl:4,hp:640,par:120,arena:'cz_tombola',song:'tombola',x:760,intro:'¡HAGAN SUS APUESTAS!',casino:2,
  center(B){return{x:B.x,y:B.lift-170};},anchor(B,n){if(n==='chute')return{x:B.x-130,y:B.lift-120};if(n==='mouth')return{x:B.x-30,y:B.lift-130};if(n==='hat')return{x:B.x,y:B.lift-330};return{x:B.x,y:B.lift-170};},
  shapes(B){return[{x:B.x,y:B.lift-170,r:112},{x:B.x-60,y:B.lift-60,w:120,h:60}];},
  setup(B){B.lift=GROUND;B.ang=0;B.calls=[];},
  move(B,dt,L){B.ang+=dt*(B.phase===2?5:B.phase===1?2.4:1.4);B.lift=lerp(B.lift,B.phase===2?GROUND-90+Math.sin(B.t*1.6)*30:GROUND,Math.min(1,dt*1.5));B.x=lerp(B.x,B.phase===2?640+Math.sin(B.t*.5)*170:760,Math.min(1,dt*1.2));
    for(const c of B.calls)c.t+=dt;B.calls=B.calls.filter(c=>c.t<1.6);},
  phases:[
    {atk:[{f:'czBalls',every:1.9,from:'chute',n:2,parry:3,bounce:2},{f:'aimed',every:2.5,from:'mouth',n:3,spread:.2,spd:330,spr:'boleto',r:13,parry:4},{f:'rain',every:4,n:3,spr:'bola',r:15,spd:[240,320]}]},
    {banner:'¡CANTO LOS NÚMEROS!',atk:[{f:'czBingo',every:3.2,n:1,warn:1.1},{f:'czBalls',every:2.6,from:'chute',n:2,parry:3,bounce:1},{f:'aimed',every:2.9,from:'mouth',n:3,spread:.22,spd:320,spr:'boleto',r:13,parry:4}]},
    {banner:'¡BINGO! ¡BINGO!',atk:[{f:'czBingo',every:3,n:2,warn:1},{f:'spiral',every:3.8,from:'center',dur:1.5,rate:.09,spd:230,spr:'bola',r:13,arms:2,parry:6},{f:'czBalls',every:3,from:'chute',n:1,parry:2,bounce:2},{f:'aimed',every:2.6,from:'mouth',n:2,spread:.3,spd:360,spr:'boleto',r:12}]}],
  draw(B,L){const t=B.t,x=B.x,y=B.lift,hot=B.phase===2;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    if(hot){for(let i=0;i<3;i++){const yy=y+i*30;line(x-60,yy,x+60,yy+30,6);line(x+60,yy,x-60,yy+30,6);line(x-60,yy,x+60,yy+30,3,C.steel);line(x+60,yy,x-60,yy+30,3,C.steel);}}
    shadowE(x,GROUND+3,120,.32);rr(x-70,y-70,140,70,10,'#7a1f1a',5);rr(x-58,y-60,116,22,6,C.gold,3);btxt('LA CASA',x,y-49,14,'#7a1f1a','center',900);for(const d of[-1,1])line(x+d*40,y-70,x+d*20,y-170,8);for(const d of[-1,1])line(x+d*40,y-70,x+d*20,y-170,4,C.gold);
    poly([[x-130,y-110],[x-180,y-90],[x-176,y-70],[x-120,y-90]],'#a06a3b',3.5);
    ctx.save();ctx.translate(x,y-170);bossSquash({x:0,y:0,squash:B.squash},L);if(hot)ctx.translate(Math.sin(t*40)*2,0);tombCage(B,L,0,0,112,B.ang,hot);ctx.restore();
    const cr=B.ang*1.5,hx=x+118,hy=y-170;rr(x+20,hy-6,98,12,4,C.steel,3);ctx.save();ctx.translate(hx,hy);ctx.rotate(cr);rr(-5,-50,10,50,3,C.steel,3);circ(0,-50,11,'#c8392b',3);ctx.restore();glove(hx+Math.cos(cr-Math.PI/2)*50,hy+Math.sin(cr-Math.PI/2)*50,13);
    const fx=x-10,fy=y-170;circ(fx,fy,58,hot?'#ffb08a':'#fbe6cf',4.5);ell(fx-36,fy+16,10,6,'rgba(232,86,46,.5)',0);ell(fx+36,fy+16,10,6,'rgba(232,86,46,.5)',0);
    bossFace(B,L,fx,fy-12,.6,{gap:30,ew:13,eh:16,my:44,mw:30,open:B.mouth>0?.9:.3});
    for(const d of[-1,1]){ctx.beginPath();ctx.moveTo(fx,fy+16);ctx.quadraticCurveTo(fx+d*30,fy+8,fx+d*44,fy+20+Math.sin(t*6)*3);ctx.quadraticCurveTo(fx+d*34,fy+28,fx,fy+22);ctx.fillStyle='#2b2420';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}
    circ(fx+30,fy-12,15,null,3);line(fx+44,fy-6,fx+52,fy+30,1.5,C.gold);
    const hb=hot?Math.abs(Math.sin(t*8))*24:0;ctx.save();ctx.translate(fx,fy-56-hb);ctx.rotate(hot?Math.sin(t*10)*.2:-.08);ell(0,0,62,12,'#2b2420',4);rr(-38,-70,76,70,8,'#2b2420',4);rr(-38,-22,76,12,0,'#c8392b',0);circ(22,-16,8,C.gold,2.5);ctx.restore();
    for(const c of B.calls){if(c.t<c.d)continue;const k=Math.min(1,(c.t-c.d)*5),a=Math.min(1,(1.6-c.t)*3),lx=CZ_LANES[c.k];ctx.save();ctx.globalAlpha=a;ctx.translate(lx,150);ctx.scale(k,k);circ(0,0,46,'#fff6df',5);ctx.fillStyle=['#e8562e','#3a72b0','#2e8f86','#f2c14e','#8a63c7'][c.k];
      ctx.beginPath();ctx.arc(0,0,43,Math.PI*1.15,Math.PI*1.85);ctx.closePath();ctx.fill();txt('BINGO'[c.k],0,-20,26,'#fff6df',C.ink);txt(String(c.num),0,14,30,C.ink,null);ctx.restore();}
    const c=B.center();flashOver(B,c.x,c.y,112);koStars(B,L,c.x,c.y-150);ctx.restore();}});

/* ---------- songs, taunts and music ---------- */
Object.assign(SONGS,{topo:nsong('gramo','Topo en la Feria',801),canica:nsong('tostada','Rebote Loco',803),bolos:nsong('baron','Chuza Swing',805),diana:nsong('cascanueces','Tiro al Blanco',807),
  caja:nsong('reloj','Sorpresa en la Caja',809),globo:nsong('paraguas','Vals del Globo',811),tombola:nsong('chistera','Gran Bingo',813),casino:nsong('shop','El Tablero',815)});
for(const [k,b] of[['topo','gramo'],['canica','tostada'],['bolos','baron'],['diana','cascanueces'],['caja','reloj'],['globo','paraguas'],['tombola','chistera'],['casino','shop']]){if(PACK[b]&&!PACK[k])PACK[k]=PACK[b];if(PACK_FINAL[b]&&!PACK_FINAL[k])PACK_FINAL[k]=PACK_FINAL[b];}
Object.assign(TAUNTS,{
  topo:['¡Asómate, asómate… que te doy con el mazo!','¡Mis primos también quieren jugar!','¡Aquí abajo nadie me alcanza!'],
  canica:['¡Boing! ¡Boing! ¡No me paran ni con imanes!','¡Multibola! ¡Esto se pone bueno!','¡Estoy rayada, pero sigo rodando!'],
  bolos:['¡Tres bolos, cero miedo!','¡Hermanitos, a la carga!','¡Nadie me tumba… bueno, casi nadie!'],
  diana:['¡Ojo, que tengo muy buena puntería!','¡Ahora vienen los dardos de verdad!','¡Me diste en el centro… qué grosería!'],
  caja:['¡Dale a la manivela! ¡Sorpresa!','¡Arriba, abajo, arriba, abajo!','¡Se me rompió el resorte!'],
  globo:['¡Guau! ¡Hecho de puro aire y simpatía!','¡Fsssss! ¡Se me escapa el aire!','¡Pop! ¡Me desinflé!'],
  tombola:['¡Bienvenidos a mi casa! La casa siempre gana.','¡Atentos al cartón! ¡B… I… N…!','¡Esto no estaba en las reglas! ¡BINGO!','¡Me cantaron línea!']});
const CZ_MINI=['topo','canica','bolos','diana','caja','globo'];
for(const k of[...CZ_MINI,'tombola'])if(!ALL_LEVELS.includes(k))ALL_LEVELS.push(k);
