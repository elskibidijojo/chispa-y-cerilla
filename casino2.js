'use strict';
/* ================= CASINO 2: the board you cross by hitting the bingo ball, the casino on the map, and three new Supers ================= */

/* ---------- the board ---------- */
const CZ_SQ=[{t:'start'},{t:'boss',id:'topo'},{t:'safe'},{t:'boss',id:'canica'},{t:'vida'},{t:'boss',id:'bolos'},{t:'safe'},{t:'boss',id:'diana'},{t:'vida'},{t:'boss',id:'caja'},{t:'safe'},{t:'boss',id:'globo'},{t:'vida'},{t:'safe'},{t:'final',id:'tombola'}];
const CZ_XY=(()=>{const a=[];for(let r=0;r<3;r++)for(let j=0;j<5;j++)a.push({x:r%2?850-j*185:110+j*185,y:470-r*104});return a;})();
let CZ={on:false,pos:0,bonus:0,ph:'off',t:0,num:1,hop:null,msg:'',msgT:0,quit:null,beat:{},goId:null,went:false,ballY:0,ballV:0};
LEVELS.casino={kind:'casino',name:'Casino de la Tómbola',sub:'Seis concursantes y el dueño',isl:4,create:null};
function czSay(s,t=2.4){CZ.msg=s;CZ.msgT=t;sfx('talk');}
function openBoard(){CZ={on:true,pos:0,bonus:0,ph:'intro',t:0,num:1,hop:null,msg:'',msgT:0,quit:null,beat:{},goId:null,went:false,ballY:0,ballV:0};scene='tablero';LV=null;
  Music.play('casino');czSay('¡Bienvenidos a mi casino! Golpea la bola para avanzar. Si llegas a mi mesa… jugamos tú y yo.',3.4);sfx('cymbal');}
function czLand(){const sq=CZ_SQ[CZ.pos];CZ.t=0;
  if(sq.t==='boss'&&!CZ.beat[sq.id]){czSay(`¡Siguiente concursante: ${LEVELS[sq.id].name}!`,2);CZ.ph='go';CZ.goId=sq.id;CZ.went=false;sfx('cymbal');return;}
  if(sq.t==='final'){czSay('¡Llegaste a mi mesa! Ahora juegas contra la casa.',2.2);CZ.ph='go';CZ.goId='tombola';CZ.went=false;sfx('laugh');return;}
  if(sq.t==='vida'){if(CZ.bonus<3){CZ.bonus++;czSay(`¡Casilla de la suerte! +1 vida para la final (llevas ${CZ.bonus}).`,2);sfx('revive');}else{czSay('¡Suerte! Pero ya llevas el máximo de vidas extra.',2);sfx('ding');}}
  else czSay(sq.t==='boss'?'Este ya cayó. ¡Tira otra vez!':'Casilla libre. ¡Tira otra vez!',1.6);
  CZ.ph='wait';}
function updBoard(dt,IN){const M=IN.M;CZ.t+=dt;if(CZ.msgT>0)CZ.msgT-=dt;
  CZ.ballV+=1800*dt;CZ.ballY+=CZ.ballV*dt;if(CZ.ballY>0){CZ.ballY=0;CZ.ballV=CZ.ph==='roll'?-520:0;if(CZ.ph==='roll')sfx('knock');}
  if(CZ.quit){const Q=CZ.quit;if(M.up||M.down||M.left||M.right){Q.sel=1-Q.sel;sfx('move');}if(M.no){CZ.quit=null;sfx('back');}
    else if(M.ok){sfx('select');if(Q.sel===0){CZ.on=false;CZ.ph='off';transition(toMap);}CZ.quit=null;}return;}
  if((M.no||M.pause)&&CZ.ph!=='go'&&CZ.ph!=='hop'){CZ.quit={sel:1};sfx('pause');return;}
  if(CZ.ph==='intro'){if(CZ.t>1.4||M.ok){CZ.ph='roll';CZ.t=0;}}
  else if(CZ.ph==='roll'){CZ.num=1+Math.floor(CZ.t*9)%3;if(M.ok||IN.P.some(q=>q.p&&(q.p.jump||q.p.shoot))){CZ.ph='hit';CZ.t=0;sfx('parry');sfx('hitBig');CZ.ballV=-900;}}
  else if(CZ.ph==='hit'){if(CZ.t>.75){CZ.ph='hop';CZ.hop={n:CZ.num,k:0};CZ.t=0;sfx('jump');}}
  else if(CZ.ph==='hop'){const h=CZ.hop;h.k+=dt/.34;if(h.k>=1){CZ.pos=Math.min(CZ_SQ.length-1,CZ.pos+1);h.n--;h.k=0;sfx('land');
      if(h.n<=0||CZ.pos>=CZ_SQ.length-1){CZ.hop=null;czLand();}else sfx('jump');}}
  else if(CZ.ph==='wait'){if(CZ.t>1.1){CZ.ph='roll';CZ.t=0;}}
  else if(CZ.ph==='go'){if(CZ.t>1.7&&!CZ.went){CZ.went=true;const id=CZ.goId;transition(()=>startLevel(id));}}
  else if(CZ.ph==='back'){if(CZ.t>1.2||M.ok){CZ.ph='roll';CZ.t=0;}}}

/* little portraits for the squares and the progress strip */
function czIcon(id,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  switch(id){
    case 'topo':rr(-16,-10,32,30,14,'#8a5a3a',3);ell(0,6,6,4,'#e88a8a',2);ell(-6,-2,3,4,C.white,1.5);ell(6,-2,3,4,C.white,1.5);circ(-6,-1,1.5,C.ink,0);circ(6,-1,1.5,C.ink,0);ell(0,-12,20,4,'#e9d39a',2.5);rr(-12,-22,24,10,3,'#e9d39a',2.5);break;
    case 'canica':circ(0,0,18,'#7bc4d9',3);ctx.beginPath();ctx.moveTo(-17,0);ctx.bezierCurveTo(-5,-15,5,15,17,0);ctx.lineWidth=5;ctx.strokeStyle='#e8562e';ctx.stroke();ell(-7,-8,5,3,'rgba(255,255,255,.8)',0);break;
    case 'bolos':SPRC.bolo({x:0,vx:0,vy:0},0,c=>c,15);break;
    case 'diana':for(const [r,c] of[[18,'#2b2a33'],[13,'#c8392b'],[8,'#fbf0d4'],[4,'#c8392b']])circ(0,0,r,c,r===18?3:0);break;
    case 'caja':rr(-15,-8,30,26,4,'#c8392b',3);circ(0,-16,10,'#fbe6cf',2.5);poly([[-7,-22],[0,-36],[7,-22]],'#8a63c7',2);break;
    case 'globo':for(const [px,py,rx,ry] of[[-8,0,9,7],[6,4,11,6],[-12,-10,6,8]])ell(px,py,rx,ry,'#ff8fb3',2.5);circ(-18,-6,3,'#e8562e',1.5);break;
    case 'tombola':ctx.beginPath();for(let i=0;i<6;i++){const a=t*2+i*TAU/6;ctx.lineTo(Math.cos(a)*18,Math.sin(a)*16);}ctx.closePath();ctx.fillStyle='rgba(255,240,200,.3)';ctx.fill();ctx.lineWidth=4;ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle=C.gold;ctx.stroke();circ(4,4,5,'#e8562e',1.5);circ(-5,2,5,'#3a72b0',1.5);break;
    case 'vida':ctx.beginPath();ctx.moveTo(0,14);ctx.bezierCurveTo(-26,-4,-12,-22,0,-9);ctx.bezierCurveTo(12,-22,26,-4,0,14);ctx.fillStyle='#e8562e';ctx.fill();ctx.lineWidth=3;ctx.stroke();ell(-8,-8,4,3,'rgba(255,255,255,.7)',0);break;
    case 'safe':star(0,0,16,7,5,t*.8);ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=3;ctx.stroke();break;
    case 'start':poly([[-14,-8],[4,-8],[4,-16],[18,0],[4,16],[4,8],[-14,8]],'#2e8f86',3);break;}
  ctx.restore();}
function czHost(x,y,s,t,talking,hot){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';
  const fake={t,phase:0,mouth:talking?Math.abs(Math.sin(t*14)):0,dead:false};tombCage(fake,null,0,0,112,t*1.4,hot);
  rr(20,-6,98,12,4,C.steel,3);ctx.save();ctx.translate(118,0);ctx.rotate(t*2);rr(-5,-50,10,50,3,C.steel,3);circ(0,-50,11,'#c8392b',3);ctx.restore();
  circ(-10,0,58,'#fbe6cf',4.5);ell(-46,16,10,6,'rgba(232,86,46,.5)',0);ell(26,16,10,6,'rgba(232,86,46,.5)',0);
  face(-10,-12,.6,{gap:30,ew:13,eh:16,my:44,mw:30,open:fake.mouth*.9,look:{x:Math.sin(t*.7)*.5,y:.3},ang:.25});
  for(const d of[-1,1]){ctx.beginPath();ctx.moveTo(-10,16);ctx.quadraticCurveTo(-10+d*30,8,-10+d*44,20+Math.sin(t*6)*3);ctx.quadraticCurveTo(-10+d*34,28,-10,22);ctx.fillStyle='#2b2420';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}
  circ(20,-12,15,null,3);ctx.save();ctx.translate(-10,-56);ctx.rotate(-.08+Math.sin(t*2)*.04);ell(0,0,62,12,'#2b2420',4);rr(-38,-70,76,70,8,'#2b2420',4);rr(-38,-22,76,12,0,'#c8392b',0);circ(22,-16,8,C.gold,2.5);ctx.restore();ctx.restore();}
let CZBG=null;
function czBoardBG(){if(CZBG)return CZBG;const [c,g]=mk(W,H);czWall(g,'#3a1216','#44161a');g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,GROUND,W,H-GROUND);
  gR(g,20,210,W-40,H-222,'#2f6b45',6,28);gR(g,34,224,W-68,H-250,null,3,20);g.globalAlpha=.08;for(let i=0;i<1400;i++){g.fillStyle=i%2?'#fff':'#000';g.fillRect((i*137)%W,210+(i*71)%(H-222),2,2);}g.globalAlpha=1;
  for(let i=0;i<=40;i++){gE(g,20+i*(W-40)/40,210,4,4,i%2?'#fff3c4':'#f2c14e',1.5);}CZBG=c;return c;}
function drawBoard(){const t=CZ.t+clock*0,T=clock;ctx.drawImage(czBoardBG(),0,0,W,H);
  /* path */
  ctx.save();ctx.setLineDash([3,12]);ctx.lineCap='round';ctx.lineWidth=6;ctx.strokeStyle='rgba(242,193,78,.75)';ctx.beginPath();CZ_XY.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore();
  CZ_SQ.forEach((sq,i)=>{const p=CZ_XY[i],boss=sq.t==='boss',fin=sq.t==='final',here=i===CZ.pos,bob=here?0:Math.sin(T*2+i)*1.5;
    ell(p.x,p.y+8,44,12,'rgba(0,0,0,.35)',0);circ(p.x,p.y+bob,40,boss?'#c8392b':fin?'#f2c14e':sq.t==='vida'?'#fbe6cf':sq.t==='start'?'#bfe3d9':'#efe0bf',4);
    circ(p.x,p.y+bob,32,null,2);for(let k=0;k<12;k++){const a=k*TAU/12+T*.3;circ(p.x+Math.cos(a)*36,p.y+bob+Math.sin(a)*36,2.5,boss?'#f2c14e':'#c8392b',0);}
    czIcon(boss||fin?sq.id:sq.t,p.x,p.y+bob,boss||fin?1.05:1,T);
    if(boss&&CZ.beat[sq.id]){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-.3);rr(-36,-14,72,28,6,'rgba(239,224,191,.95)',3);btxt('¡K.O.!',0,1,18,C.rust,'center',900);ctx.restore();}
    if(sq.t==='start'||fin){rr(p.x-40,p.y-66,80,20,6,'rgba(20,13,8,.6)',0);btxt(sq.t==='start'?'SALIDA':'LA MESA',p.x,p.y-56,13,C.gold,'center',900);}});
  /* the player token: hops from square to square */
  let tp=CZ_XY[CZ.pos],tx=tp.x,ty=tp.y;if(CZ.hop){const n=CZ_XY[Math.min(CZ_XY.length-1,CZ.pos+1)],k=CZ.hop.k;tx=lerp(tp.x,n.x,k);ty=lerp(tp.y,n.y,k)-Math.sin(k*Math.PI)*60;}
  shadowE(tx,tp.y+10,22,.3);const face=CZ.hop?(CZ_XY[Math.min(CZ_XY.length-1,CZ.pos+1)].x>=tp.x?1:-1):1;
  drawHero({x:tx,y:ty-6,char:heroChar(0),face,anim:T*(CZ.hop?10:3),scale:.62,skin:save.eq[0]&&save.eq[0].skin,shoot:CZ.ph==='hit'&&CZ.t<.3,aimX:1,aimY:-1});
  if(CZ.ph==='roll'){ctx.globalAlpha=.6+Math.sin(T*8)*.3;poly([[tx-8,ty-104],[tx+8,ty-104],[tx,ty-92]],C.gold,2);ctx.globalAlpha=1;}
  /* the host and the ball */
  const talking=CZ.msgT>0&&CZ.msg;czHost(480,112,.62,T,talking,false);
  const bx=660,by=128+CZ.ballY*.12,spin=CZ.ph==='roll';line(560,118,bx-20,by,6,'#a06a3b');
  ctx.save();ctx.translate(bx,by);if(CZ.ph==='hit'){const k=Math.min(1,CZ.t*4);ctx.scale(1+k*.5,1+k*.5);}ctx.rotate(spin?Math.sin(T*10)*.3:0);circ(0,0,30,'#fff6df',4);ctx.save();ctx.beginPath();ctx.arc(0,0,28,0,TAU);ctx.clip();ctx.fillStyle=['#e8562e','#3a72b0','#2e8f86'][CZ.num-1];ctx.fillRect(-30,-30,60,14);ctx.fillRect(-30,16,60,14);ctx.restore();
  circ(0,0,15,'#fff',2);txt(String(CZ.num),0,2,22,C.ink,null);ctx.restore();
  if(CZ.ph==='roll')txt('¡GOLPÉALA!',bx,by+52,20,C.gold,C.ink);
  if(CZ.ph==='hit'){const k=Math.min(1,CZ.t*5);ctx.save();ctx.translate(bx-96,by+44);ctx.scale(k,k);ctx.rotate(-.15);txt('¡'+CZ.num+'!',0,0,54,C.gold,C.ink);ctx.restore();}
  /* speech bubble */
  if(talking){const a=Math.min(1,CZ.msgT*4);ctx.globalAlpha=a;card(24,22,330,128,C.paper,3.5,14);poly([[354,70],[392,92],[354,96]],C.paper,3.5);ctx.fillStyle=C.paper;ctx.fillRect(348,72,10,22);
    btxt('DON TÓMBOLA',40,40,13,C.rust,'left',900);const shown=CZ.msg.slice(0,Math.floor((2.6-Math.min(2.6,CZ.msgT))*60+12));wrap(shown,40,64,300,19,16,C.ink,700);ctx.globalAlpha=1;}
  /* who is left and the extra lives */
  card(W-200,20,184,82,'rgba(239,224,191,.92)',3,10);btxt('CONCURSANTES',W-108,34,12,C.rust,'center',900);
  CZ_MINI.forEach((id,i)=>{const x=W-176+(i%3)*58,y=58+Math.floor(i/3)*30;czIcon(id,x,y,.55,T);if(save.cleared[id]){btxt('✔',x+14,y+8,13,'#2f7d45','left',900);}});
  card(24,160,250,34,'rgba(239,224,191,.92)',3,8);btxt('Vidas extra para la final:',38,177,13,C.ink,'left',800);for(let i=0;i<3;i++){ctx.globalAlpha=i<CZ.bonus?1:.25;czIcon('vida',216+i*20,177,.5,T);ctx.globalAlpha=1;}
  btxt(CZ.ph==='roll'?'Enter, saltar o disparar: golpea la bola · Esc: salir':'',W-24,186,14,C.paper,'right',800);
  if(CZ.quit){ctx.fillStyle='rgba(20,13,8,.6)';ctx.fillRect(0,0,W,H);card(W/2-220,H/2-90,440,180,C.paper,4,12);txt('¿Salir del casino?',W/2,H/2-50,30,C.rust,C.ink);btxt('Si sales, el tablero vuelve a empezar.',W/2,H/2-14,15,C.ink,'center',700);
    [['SALIR',-90],['SEGUIR',90]].forEach(([l,dx],i)=>{const on=CZ.quit.sel===i;rr(W/2+dx-70,H/2+20,140,42,8,on?C.brass:'rgba(20,13,8,.06)',3);btxt(l,W/2+dx,H/2+41,18,C.ink,'center',900);});}}

/* ---------- plug the board into the game loop ---------- */
let CZ_IN=null;
const _riCZ=readInputs;readInputs=function(){const r=_riCZ();CZ_IN=r;return r;};
const _stepCZ=step;step=function(dt){_stepCZ(dt);if(scene==='tablero')updBoard(dt,TR?NOIN:(CZ_IN||NOIN));};
const _achCZ=drawAchToast;drawAchToast=function(){if(scene==='tablero')drawBoard();_achCZ();};
const _startLevelCZ=startLevel;
startLevel=function(id){if(id==='casino'){openBoard();return;}_startLevelCZ(id);
  if(id==='tombola'&&CZ.on&&CZ.bonus&&LV){for(const p of LV.Ps){p.hp+=CZ.bonus;p.maxHp=Math.max(p.maxHp||0,p.hp);}LV.czBonus=CZ.bonus;}};
const _afterLevelCZ=afterLevel;
afterLevel=function(L){const d=L&&L.def;if(CZ.on&&d&&d.casino===1){CZ.beat[L.id]=true;scene='tablero';LV=null;CZ.ph='back';CZ.t=0;Music.play('casino');
    const left=CZ_MINI.filter(k=>!save.cleared[k]).length;czSay(left?`¡Bien jugado! Vuelve al tablero y tira otra vez.`:'¡Venciste a todos mis concursantes! Tira otra vez.',2.2);if(!left)unlockAch('casino6');return;}
  if(d&&d.casino===2){const was=CZ.on;CZ.on=false;CZ.ph='off';save.flags.casino=true;save.done.casino=save.done.tombola;save.cleared.casino=true;persist();unlockAch('casino');if(CZ_MINI.every(k=>save.cleared[k]))unlockAch('casino6');
    toMap();say('Don Tómbola','¡Está bien, está bien! Esta vez la casa perdió. Vuelve cuando quieras… las puertas siempre están abiertas.');return;}
  _afterLevelCZ(L);};
ACH.push(['casino','La Casa Pierde','Vence a Don Tómbola, el dueño del casino.',4],['casino6','Cartón Lleno','Vence a los seis concursantes del casino.',3]);

/* ---------- the casino on the map of Valle Escarcha ---------- */
WORLDS[4].nodes.push({id:'casino',x:1160,y:530,kind:'level',ob:42,bld:'casino',em:'bola'});
WORLDS[4].roads.push(['cometa','casino'],['casino','termometro']);
const _drawBldCZ=drawBld;
drawBld=function(n,t,night){if(n.bld!=='casino'){_drawBldCZ(n,t,night);return;}const x=n.x,y=n.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';shadowE(x,y+2,58,.25);
  rr(x-52,y-66,104,66,6,'#7a1f1a',3.5);for(let i=0;i<5;i++)rr(x-52+i*21,y-66,21,10,0,i%2?'#f2c14e':'#fff3c4',2);
  poly([[x-60,y-66],[x,y-106],[x+60,y-66]],'#c8392b',3.5);for(let i=0;i<9;i++){const a=i/8,on=Math.floor(t*4+i)%2;circ(lerp(x-56,x,a),lerp(y-68,y-104,a),2.6,on?'#fff3c4':'#a8772a',1);circ(lerp(x+56,x,a),lerp(y-68,y-104,a),2.6,on?'#a8772a':'#fff3c4',1);}
  rr(x-16,y-34,32,34,4,'#2b1d14',3);rr(x-40,y-56,30,18,3,'#fff3c4',2.5);rr(x+10,y-56,30,18,3,'#fff3c4',2.5);
  ctx.save();ctx.translate(x,y-122);ctx.beginPath();for(let i=0;i<6;i++){const a=t*1.6+i*TAU/6;ctx.lineTo(Math.cos(a)*16,Math.sin(a)*14);}ctx.closePath();ctx.fillStyle='rgba(255,240,200,.35)';ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle=C.gold;ctx.stroke();
  circ(Math.sin(t*3)*5,4,4,'#e8562e',1.5);circ(-4,-2,4,'#3a72b0',1.5);ctx.restore();line(x,y-106,x,y-108,3);
  rr(x-44,y-90,88,20,5,'#f2c14e',3);btxt('CASINO',x,y-80,13,'#7a1f1a','center',900);
  if(n.em){circ(x-(n.ob||30)-6,y-14,13,C.paper,3);ctx.save();ctx.translate(x-(n.ob||30)-6,y-14);ctx.scale(.55,.55);drawSpr({x:0,y:0,spr:n.em,r:16,rot:0,vx:-1,vy:0,n:15},t);ctx.restore();}
  ctx.restore();};
const _nodeLabelCZ=nodeLabel;nodeLabel=function(n,w){if(n.id==='casino')return'Entrar: Casino de la Tómbola';return _nodeLabelCZ(n,w);};

/* ---------- three new Supers ---------- */
Object.assign(SUPERS,{
  tren:{name:'Expreso Chispero',price:5,isl:2,desc:'Un tren de juguete cruza la pantalla a toda máquina: arrolla al enemigo y se lleva por delante sus balas.'},
  campana:{name:'Campanazo',price:5,isl:3,desc:'Una campana gigante cae sobre el enemigo, lo deja aturdido y suena seis veces: ¡DONG, DONG, DONG!'},
  lupa:{name:'Rayo de Lupa',price:6,isl:4,desc:'Una lupa enorme junta la luz del sol en un punto que persigue al enemigo y lo quema durante tres segundos.'}});
function superTren(L,p){const plane=p.type==='plane',d=plane?1:p.face,col=heroCol(p.char,p.eq.skin),y=plane?p.y+10:GROUND-4,x0=d>0?L.camX-40:L.camX+W+40;sfx('honk');sfx('rocket');
  B_(L,p,{x:x0,y,fx:x0,vx:0,vy:0,r:1,dmg:0,life:3,pierce:true,k:'tren',d,col,t:0,tk:0,met:new Set(),
    upd(b,L,dt){b.hits=allHit(L);b.t+=dt;b.fx+=b.d*640*dt;b.x=clamp(b.fx,L.camX-60,L.camX+W+60);b.vx=0;b.vy=0;b.life=1;
      const rear=b.fx-b.d*330;if((b.d>0&&rear>L.camX+W+40)||(b.d<0&&rear<L.camX-40))b.life=0;
      for(const e of L.eb)if(!e.dead&&destroyable(e)&&Math.abs(e.y-(b.y-50))<70&&(e.x-rear)*b.d>-10&&(b.fx+b.d*30-e.x)*b.d>0){e.dead=true;sparks(L,e.x,e.y,3,col);}
      b.tk-=dt;if(b.tk<=0){b.tk=.1;for(const e of L.ents){if(e.dead||e.hidden)continue;let hit=false;for(let k=0;k<=3&&!hit;k++){const px=b.fx-b.d*k*100;for(const yy of[b.y-30,b.y-80,b.y-140])if(e.hitBy(px,yy,34)){hit=true;break;}}
        if(hit){const first=!b.met.has(e);b.met.add(e);e.damage((first?11:3.3)*dmgM(p),p);gain(p,first?4:1);if(first){boom(L,b.fx,b.y-60,50);shake(L,10);sfx('boom');pop(L,b.fx,b.y-170,'¡CHU-CHUUU!',col);}}}}
      if(rand()<dt*26)L.fx.push({k:'smoke',x:b.fx-b.d*40,y:b.y-150,vx:-b.d*90,vy:-70,life:.7,max:.7,r:12,col:'#e9e2d2'});},
    draw(b){const x=b.fx,y=b.y,d=b.d,T=b.t;ctx.save();ctx.translate(x,y);ctx.scale(d,1);ctx.lineJoin='round';ctx.lineCap='round';
      for(const cx of[-300,-180]){rr(cx,-92,108,74,8,cx===-300?'#3a72b0':'#e8562e',4);rr(cx+12,-80,36,26,4,'#fff3c4',3);rr(cx+60,-80,36,26,4,'#fff3c4',3);for(const wx of[cx+22,cx+86]){ctx.save();ctx.translate(wx,-14);ctx.rotate(T*14);circ(0,0,16,'#2b2420',3.5);line(-14,0,14,0,2.5,C.steel);line(0,-14,0,14,2.5,C.steel);ctx.restore();}line(cx+108,-34,cx+120,-34,4);}
      rr(-62,-112,74,94,8,b.col,4);rr(-52,-100,40,30,4,'#fff3c4',3);rr(-70,-122,90,14,5,'#2b2420',3.5);rr(8,-80,72,62,20,'#2b2420',4);rr(48,-118,20,40,4,'#2b2420',3.5);ell(58,-120,16,6,'#2b2420',3);
      circ(78,-60,10,'#fff3c4',3);poly([[80,-24],[112,-6],[80,-6]],C.steel,3);for(const wx of[-40,30]){ctx.save();ctx.translate(wx,-14);ctx.rotate(T*14);circ(0,0,20,'#c8392b',4);line(-18,0,18,0,3,C.ink);line(0,-18,0,18,3,C.ink);ctx.restore();}
      rr(-36,-14,90,6,3,C.steel,2.5);face(40,-56,.42,{gap:22,ew:11,eh:14,my:30,mw:24,open:.6,look:{x:1,y:0},ang:.3});ctx.restore();}});}
function superCampana(L,p){const c0=pCenter(p),tg=nearestEnt(L,c0.x,c0.y),plane=p.type==='plane';let tx,ty;
  if(tg){const c=tg.center();tx=c.x;ty=c.y;}else{tx=p.x+(plane?260:p.face*200);ty=plane?p.y:GROUND-90;}sfx('whistleDown');
  B_(L,p,{x:clamp(tx,L.camX+40,L.camX+W-40),y:-100,tx,ty,tg,vx:0,vy:0,r:1,dmg:0,life:3.4,pierce:true,k:'campana',t:0,n:0,cd:0,
    upd(b,L,dt){b.hits=allHit(L);b.t+=dt;b.vx=0;b.vy=0;const fall=Math.min(1,b.t/.32);if(b.tg&&!b.tg.dead){const c=b.tg.center();b.tx=c.x;b.ty=c.y;}
      b.x=clamp(b.tx,L.camX+40,L.camX+W-40);b.y=lerp(-100,b.ty,fall*fall);
      if(fall>=1&&!b.landed){b.landed=true;shake(L,20);L.flash=Math.max(L.flash,.12);sfx('stomp');sfx('cymbal');pop(L,b.x,b.ty-160,'¡DONG!',C.gold);
        for(const e of L.ents){if(e.dead)continue;const c=e.center();if(e===b.tg||dist(c.x,c.y,b.x,b.ty)<150){e.damage(15*dmgM(p),p);gain(p,6);if(typeof freezeEnt==='function')freezeEnt(e,1.9);}}
        for(const e of L.eb)if(!e.dead&&destroyable(e)&&dist(e.x,e.y,b.x,b.ty)<200)e.dead=true;}
      if(b.landed&&b.n<6){b.cd-=dt;if(b.cd<=0){b.cd=.3;b.n++;b.ring=.25;sfx('ring');L.fx.push({k:'ring',x:b.x,y:b.ty,life:.4,max:.4,col:C.gold});pop(L,b.x+(b.n%2?-70:70),b.ty-120,'¡DONG!',C.gold);
        for(const e of L.ents){if(e.dead)continue;const c=e.center();if(e===b.tg||dist(c.x,c.y,b.x,b.ty)<150){e.damage(3.2*dmgM(p),p);gain(p,1.5);}}}}
      if(b.ring>0)b.ring-=dt;if(b.n>=6&&b.t>2.6)b.lift=(b.lift||0)+dt;},
    draw(b){const up=(b.lift||0)*900,y=b.y-up,sw=b.ring>0?Math.sin(b.t*50)*.08:0,a=Math.max(0,1-(b.lift||0)*2.5);ctx.save();ctx.globalAlpha=a;ctx.translate(b.x,y);ctx.rotate(sw);ctx.lineJoin='round';
      line(0,-150,0,-900,4);ctx.beginPath();ctx.moveTo(-34,-150);ctx.quadraticCurveTo(-40,-60,-96,10);ctx.lineTo(96,10);ctx.quadraticCurveTo(40,-60,34,-150);ctx.closePath();ctx.fillStyle='#c49a5f';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=C.ink;ctx.stroke();
      ell(0,-150,36,10,'#9a7446',4);rr(-100,0,200,18,9,'#9a7446',4);ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.moveTo(-22,-140);ctx.quadraticCurveTo(-30,-70,-62,-6);ctx.lineTo(-44,-6);ctx.quadraticCurveTo(-16,-70,-10,-140);ctx.closePath();ctx.fill();
      circ(Math.sin(b.t*20)*(b.ring>0?30:4),24,16,'#6c4f2c',3.5);face(0,-80,.5,{gap:26,ew:12,eh:15,my:30,mw:26,open:b.ring>0?1:.3,look:{x:0,y:.5},ang:-.2});
      if(b.ring>0){for(const d of[-1,1])for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(d*(110+i*18),-40,20+i*10,d<0?Math.PI*.7:-Math.PI*.3,d<0?Math.PI*1.3:Math.PI*.3);ctx.lineWidth=3;ctx.strokeStyle=C.gold;ctx.stroke();}}ctx.restore();}});}
function superLupa(L,p){const c0=pCenter(p);sfx('magic');sfx('fire');
  B_(L,p,{x:c0.x,y:c0.y,hx:c0.x+(p.type==='plane'?200:p.face*200),hy:p.type==='plane'?c0.y:GROUND-40,vx:0,vy:0,r:1,dmg:0,life:3.4,pierce:true,k:'lupa',t:0,tk:0,
    upd(b,L,dt){b.hits=allHit(L);b.t+=dt;b.vx=0;b.vy=0;const o=b.own,c=pCenter(o);b.lx=c.x-(o.type==='plane'?-20:o.face*10);b.ly=c.y-(o.type==='plane'?110:150);b.x=b.lx;b.y=b.ly;
      const tg=nearestEnt(L,b.hx,b.hy);if(tg){const q=tg.center(),dd=Math.hypot(q.x-b.hx,q.y-b.hy),st=Math.min(dd,900*dt);if(dd>1){b.hx+=(q.x-b.hx)/dd*st;b.hy+=(q.y-b.hy)/dd*st;}}
      if(b.t>.35){b.tk-=dt;if(b.tk<=0){b.tk=.12;let any=false;for(const e of L.ents)if(!e.dead&&e.hitBy(b.hx,b.hy,36)){e.damage(1.55*dmgM(p),p);gain(p,1.2);any=true;}
        if(any){sfx('fire');for(let i=0;i<3;i++)L.fx.push({k:'spark',x:b.hx+(rand()-.5)*30,y:b.hy+(rand()-.5)*30,vx:(rand()-.5)*160,vy:-60-rand()*140,life:.4,max:.4,r:4+rand()*3,col:rand()<.5?'#ffb35a':'#ffe27a'});}
        if(rand()<.6)L.fx.push({k:'smoke',x:b.hx,y:b.hy,vx:(rand()-.5)*40,vy:-60,life:.6,max:.6,r:8,col:'#cfc6b4'});}
        for(const e of L.eb)if(!e.dead&&destroyable(e)&&dist(e.x,e.y,b.hx,b.hy)<56)e.dead=true;}
      if(b.life<.3&&!b.bye){b.bye=true;puff(L,b.lx,b.ly,8);}},
    draw(b){const on=Math.min(1,b.t/.35),a=Math.min(1,b.life*4),T=b.t;ctx.save();ctx.globalAlpha=a;ctx.lineJoin='round';ctx.lineCap='round';
      if(on>=1){const ang=Math.atan2(b.hy-b.ly,b.hx-b.lx),pr=ang+Math.PI/2;ctx.beginPath();ctx.moveTo(b.lx+Math.cos(pr)*40,b.ly+Math.sin(pr)*40);ctx.lineTo(b.hx,b.hy);ctx.lineTo(b.lx-Math.cos(pr)*40,b.ly-Math.sin(pr)*40);ctx.closePath();
        ctx.fillStyle='rgba(255,236,150,.32)';ctx.fill();ctx.fillStyle='rgba(255,250,210,.4)';ctx.beginPath();ctx.moveTo(b.lx+Math.cos(pr)*14,b.ly+Math.sin(pr)*14);ctx.lineTo(b.hx,b.hy);ctx.lineTo(b.lx-Math.cos(pr)*14,b.ly-Math.sin(pr)*14);ctx.closePath();ctx.fill();
        circ(b.hx,b.hy,24+Math.sin(T*30)*4,'rgba(255,200,90,.55)',0);circ(b.hx,b.hy,12,'#fff6d8',2.5);star(b.hx,b.hy,22,9,8,T*6);ctx.fillStyle='rgba(255,226,122,.8)';ctx.fill();}
      ctx.translate(b.lx,b.ly);ctx.scale(on,on);ctx.rotate(Math.sin(T*3)*.1);rr(36,-6,60,12,6,C.woodL,3.5);circ(0,0,44,'rgba(200,235,255,.55)',6);circ(0,0,44,null,0);ctx.beginPath();ctx.arc(0,0,44,0,TAU);ctx.lineWidth=8;ctx.strokeStyle=C.brass;ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
      ell(-14,-16,12,7,'rgba(255,255,255,.75)',0,-.6);ctx.restore();}});}
const CZ_SUP={tren:superTren,campana:superCampana,lupa:superLupa};
const _ssCZ=startSuper;
startSuper=function(L,p){const s=p.eq.sup||'chispazo';if(!CZ_SUP[s]){_ssCZ(L,p);return;}
  p.cards=0;L.supers++;p.superK=s;p.superT=.3;p.inv=Math.max(p.inv,1);L.superFlash=.35;sfx('super');shake(L,12);banner(L,'¡'+SUPERS[s].name.toUpperCase()+'!',1.1);unlockAch('super');CZ_SUP[s](L,p);
  p.superPose=.55;L.freeze=Math.max(L.freeze||0,.55);sfx('whistleUp');if(typeof ringRestore==='function')ringRestore(L,p);};
const _itemIconCZ=itemIcon;
itemIcon=function(id,x,y,t){if(!CZ_SUP[id]){_itemIconCZ(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  if(id==='tren'){ctx.translate(Math.sin(t*3)*3,0);rr(-24,-14,26,22,4,'#c8392b',3);rr(-2,-6,24,14,7,'#2b2420',3);rr(10,-20,8,14,2,'#2b2420',2.5);for(const wx of[-14,10]){circ(wx,12,7,'#2b2420',2.5);}circ(-26+((t*30)%10),-24,4,'#e9e2d2',2);}
  else if(id==='campana'){ctx.rotate(Math.sin(t*6)*.18);ctx.beginPath();ctx.moveTo(-6,-20);ctx.quadraticCurveTo(-8,-6,-20,10);ctx.lineTo(20,10);ctx.quadraticCurveTo(8,-6,6,-20);ctx.closePath();ctx.fillStyle='#c49a5f';ctx.fill();ctx.lineWidth=3;ctx.stroke();rr(-22,8,44,6,3,'#9a7446',2.5);circ(Math.sin(t*8)*5,18,5,'#6c4f2c',2.5);}
  else{ctx.rotate(-.5);rr(14,-4,22,8,4,C.woodL,3);circ(0,0,15,'rgba(200,235,255,.7)',0);ctx.beginPath();ctx.arc(0,0,15,0,TAU);ctx.lineWidth=5;ctx.strokeStyle=C.brass;ctx.stroke();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.rotate(.5);star(-18,18,8,3,6,t*3);ctx.fillStyle='#ffe27a';ctx.fill();ctx.lineWidth=2;ctx.stroke();}
  ctx.restore();};
if(typeof refreshShopTabs==='function')refreshShopTabs();
if(window.__game){window.__game.CZ=()=>CZ;window.__game.openBoard=openBoard;window.__game.startLevelCZ=startLevel;window.__game.afterLevel=afterLevel;}
