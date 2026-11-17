/* tienda2.js — a big shop update: 5 weapons (the Rayo Solar is the strongest of all),
   4 charms (the Corazón de Oro is the best), 3 supers and 5 skins, each with its own icon,
   sounds and drawings. The shop shelves grow to three rows so everything fits. */
(function(){
const HC=(a,b)=>typeof hasCharm==='function'&&hasCharm(a,b);
const near=(L,x,y)=>typeof nearestEnt==='function'?nearestEnt(L,x,y):null;

/* ======================= ARMAS ======================= */
function drawShuri(b,L){ctx.translate(b.x,b.y);ctx.rotate(L.t*22+b.x*.01);const r=b.big?16:10;star(0,0,r,r*.38,4,0);ctx.fillStyle=C.steel;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();circ(0,0,r*.28,C.paper,2);}
function drawDrop(b,L){ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));const r=b.r;ctx.beginPath();ctx.moveTo(r*1.6,0);ctx.quadraticCurveTo(0,-r*1.1,-r,0);ctx.quadraticCurveTo(0,r*1.1,r*1.6,0);ctx.fillStyle='#7bc6e8';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ell(-r*.1,-r*.35,r*.35,r*.2,'rgba(255,255,255,.85)',0);}
function drawGlobo(b,L){ctx.translate(b.x,b.y);ctx.rotate(L.t*5);ell(0,0,b.r,b.r*.86,'#7bc6e8',3);ell(-b.r*.35,-b.r*.35,b.r*.25,b.r*.16,'rgba(255,255,255,.8)',0);poly([[b.r-2,0],[b.r+8,-5],[b.r+8,5]],'#5aa8cc',2);}
function drawPetardo(b,L){ctx.translate(b.x,b.y);ctx.rotate(L.t*9+b.x*.02);rr(-9,-5,18,10,3,'#e23b3b',2.5);rr(-4,-5,8,10,0,C.goldL,0);line(9,0,15,-5,2);if(Math.floor(L.t*20)%2)circ(15,-5,3.5,'#ffe27a',0);}
function drawVarita(b,L){ctx.translate(b.x,b.y);ctx.rotate(L.t*7);const r=b.big?18:9;circ(0,0,r+6,'rgba(255,214,250,.35)',0);star(0,0,r,r*.5,5,0);ctx.fillStyle=b.big?'#ffd6fa':'#fff1a8';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}
function wetUpd(b,L){for(const e of L.ents)if(!e.dead&&e.hitBy(b.x,b.y,b.r+8))e._wet=2.2;}
function varitaUpd(b,L,dt){b.wt=(b.wt||0)+dt;const s=Math.cos(b.wt*16)*260*dt;b.x+=-b.vy/Math.hypot(b.vx,b.vy)*s;b.y+=b.vx/Math.hypot(b.vx,b.vy)*s;
  for(const e of L.ents)if(!e.dead&&!(b.hits&&b.hits.has(e))&&e.hitBy(b.x,b.y,b.r)){if(typeof gain==='function')gain(b.own,b.dmg*.7);break;}}
function petBoom(L,b,R,dm){b.life=0;boom(L,b.x,b.y,R*.7);sfx('pop');shake(L,R>70?8:3);for(const e of L.ents)if(!e.dead&&e.hitBy(b.x,b.y,R)){e.damage(dm*dmgM(b.own),b.own);if(typeof gain==='function'&&!b.noGain)gain(b.own,dm);}
  for(let i=0;i<6;i++)L.fx.push({k:'spark',x:b.x,y:b.y,vx:(rand()-.5)*360,vy:(rand()-.8)*360,life:.3,max:.3,r:3,col:['#e23b3b','#f2c14e','#7bb7c9'][i%3]});}
function petUpd(b,L,dt){b.fuse-=dt;let hit=b.fuse<=0;if(!hit)for(const e of L.ents)if(!e.dead&&e.hitBy(b.x,b.y,b.r+4)){hit=true;break;}if(hit)petBoom(L,b,b.big?95:62,b.boomD);}
Object.assign(WEAPONS,{
  solar:{name:'Rayo Solar',price:9,isl:4,hold:true,desc:'Mantén el disparo: un rayo de sol que quema sin parar a cualquier distancia. Es la segunda arma más fuerte del juego, pero te mueves más lento mientras disparas y se recalienta si no lo sueltas.',exd:'EX: un sol en miniatura que lo atraviesa todo.',
    fire(){},ex(L,p,h,ax,ay){B_(L,p,{x:h.x,y:h.y,vx:ax*620,vy:ay*620,r:30,dmg:15,life:1.4,k:'ex',pierce:true});sfx('ex');}},
  agua:{name:'Pistola de Agua',price:5,isl:2,desc:'Chorros de agua que caen un poco. El enemigo mojado recibe un 15% más de daño de todo, también de tu compañero.',exd:'EX: un globo de agua que revienta y empapa.',
    fire(L,p,h,ax,ay){p.cool=.11;const b=B_(L,p,{x:h.x,y:h.y,vx:ax*780,vy:ay*780-40,r:7,dmg:1.08,life:1.4,k:'agua',g:520,draw:drawDrop});b.upd=wetUpd;},
    ex(L,p,h,ax,ay){const b=B_(L,p,{x:h.x,y:h.y,vx:ax*560,vy:ay*560-380,r:20,dmg:13,life:2.4,k:'bomba',g:1300,draw:drawGlobo});b.upd=(b,L)=>{for(const e of L.ents)if(!e.dead&&e.hitBy(b.x,b.y,90))e._wet=4;};}},
  shuriken:{name:'Estrellas Ninja',price:5,isl:3,desc:'Estrellas de hojalata muy rápidas que atraviesan a un enemigo y siguen volando.',exd:'EX: un abanico de seis estrellas gigantes.',
    fire(L,p,h,ax,ay){p.cool=.2;B_(L,p,{x:h.x,y:h.y,vx:ax*1150,vy:ay*1150,r:9,dmg:2,life:1,k:'shuri',pierce:true,draw:drawShuri});},
    ex(L,p,h,ax,ay){const a0=Math.atan2(ay,ax);for(let i=0;i<6;i++){const a=a0+(i-2.5)*.16;B_(L,p,{x:h.x,y:h.y,vx:Math.cos(a)*900,vy:Math.sin(a)*900,r:16,dmg:3.2,life:1.3,k:'shuri',pierce:true,big:true,draw:drawShuri});}}},
  petardo:{name:'Petardos',price:4,isl:1,desc:'Petardos que vuelan en arco, botan y explotan: dañan a todo lo que esté cerca.',exd:'EX: una traca de cinco petardos gordos.',
    fire(L,p,h,ax,ay){p.cool=.36;const b=B_(L,p,{x:h.x,y:h.y,vx:ax*540,vy:ay*540-(ay<0?0:300),r:9,dmg:0,life:3,k:'petardo',g:1300,bounce:3,pierce:true,fuse:.9,boomD:3.22,draw:drawPetardo});b.upd=petUpd;},
    ex(L,p,h,ax,ay){for(let i=0;i<5;i++){const b=B_(L,p,{x:h.x,y:h.y,vx:ax*(380+i*90),vy:ay*400-420-i*30,r:13,dmg:0,life:3,k:'petardo',g:1300,bounce:3,pierce:true,big:true,fuse:.7+i*.12,boomD:4.2,draw:drawPetardo});b.upd=petUpd;}}},
  varita:{name:'Varita Estelar',price:4,isl:2,desc:'Estrellitas que vuelan haciendo ondas. Pegan poquito, pero llenan tus cartas de súper muchísimo más rápido.',exd:'EX: una estrella fugaz que persigue al enemigo.',
    fire(L,p,h,ax,ay){p.cool=.14;const b=B_(L,p,{x:h.x,y:h.y,vx:ax*720,vy:ay*720,r:9,dmg:1.12,life:1.6,k:'varita',draw:drawVarita});b.upd=varitaUpd;},
    ex(L,p,h,ax,ay){B_(L,p,{x:h.x,y:h.y,vx:ax*600,vy:ay*600,r:18,dmg:3.4,life:2.4,k:'varita',big:true,pierce:true,tickHit:true,homing:5,draw:drawVarita});}}});
Object.assign(SHOTS,{
  agua:()=>nz(.05,{f:2200,v:.025,q:2}),
  shuriken:()=>{tn(1600,.05,{type:'triangle',v:.025,slide:-900});nz(.03,{f:4000,v:.02,q:4});},
  petardo:()=>tn(300,.06,{type:'square',v:.025,slide:200}),
  varita:()=>{tn(1320,.06,{type:'sine',v:.03});tn(1760,.06,{type:'sine',v:.02,at:.04});},
  solar:()=>tn(220+Math.random()*30,.05,{type:'sawtooth',v:.012})});

/* the Rayo Solar: a held beam that stops at the first enemy; heats up after 3.5 s */
const _hwS=holdWeapon;
holdWeapon=function(L,p,dt,h,w){_hwS(L,p,dt,h,w);
  if(w!=='solar'){p.solarB=null;if(p.solarHeat>0)p.solarHeat=Math.max(0,p.solarHeat-dt*2);return;}
  if(p.solarOver>0){p.solarOver-=dt;p.solarB=null;if(p.solarOver<=0)p.solarHeat=0;return;}
  if(!p.shoot){p.solarB=null;p.solarHeat=Math.max(0,(p.solarHeat||0)-dt*1.5);p.solarTick=0;return;}
  p.solarHeat=(p.solarHeat||0)+dt;p.flashT=.05;
  if(p.solarHeat>=3.5){p.solarOver=1;p.solarB=null;sfx('hiss');puff(L,h.x,h.y,5,'#bbb');return;}
  let ex=h.x,ey=h.y,hitE=null;for(let k=1;k<=60;k++){const px=h.x+p.aimX*k*16,py=h.y+p.aimY*k*16;ex=px;ey=py;if(px<L.camX-20||px>L.camX+W+20||py<-20||py>H+20)break;
    for(const e of L.ents){if(e.dead||e.hidden)continue;if(e.hitBy(px,py,8)){hitE=e;break;}}if(hitE)break;}
  p.solarB={x1:h.x,y1:h.y,x2:ex,y2:ey,hit:!!hitE};
  p.solarTick=(p.solarTick||0)-dt;if(p.solarTick<=0){p.solarTick=.05;sfx('shot','solar');if(hitE){hitE.damage(1.55*dmgM(p),p);gain(p,1.55);if(rand()<.5)sparks(L,ex,ey,2,'#ffe27a');}}};
const _puS=platUpdate;
platUpdate=function(L,p,dt,I){const x0=p.x;_puS(L,p,dt,I);if(p.dead)return;
  if(p.solarB&&p.dash<=0&&p.ground)p.x=x0+(p.x-x0)*.55;
  if(HC(p,'turbo')){if(p.dash<=0)p.x+=(p.x-x0)*.18;if(p.dashCd>0)p.dashCd=Math.max(0,p.dashCd-dt);}};
const _dpS=drawPlayers;
drawPlayers=function(L){for(const p of L.Ps){const b=p.solarB;if(!b||p.dead)continue;ctx.save();const w=1+Math.sin(L.t*40)*.15;ctx.lineCap='round';
    ctx.strokeStyle='rgba(255,200,60,.32)';ctx.lineWidth=50*w;ctx.beginPath();ctx.moveTo(b.x1,b.y1);ctx.lineTo(b.x2,b.y2);ctx.stroke();
    ctx.strokeStyle=C.ink;ctx.lineWidth=28*w;ctx.stroke();ctx.strokeStyle='#ffb43a';ctx.lineWidth=22*w;ctx.stroke();ctx.strokeStyle='#ffe27a';ctx.lineWidth=14*w;ctx.stroke();ctx.strokeStyle='#fffbe6';ctx.lineWidth=6*w;ctx.stroke();
    circ(b.x1,b.y1,16*w,'#fffbe6',3);if(b.hit){ctx.translate(b.x2,b.y2);ctx.rotate(L.t*9);star(0,0,22*w,10,8,0);ctx.fillStyle='#ffe27a';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}ctx.restore();}
  _dpS(L);
  for(const p of L.Ps){if(p.dead||p.type!=='plat')continue;const ht=p.solarOver>0?1:(p.solarHeat||0)/3.5;if(ht<=.05)continue;const x=p.x-24,y=p.y-118;
    rr(x,y,48,8,4,'rgba(20,13,8,.5)',2);rr(x,y,48*Math.min(1,ht),8,4,p.solarOver>0?(Math.floor(L.t*10)%2?'#e23b3b':'#ffe27a'):ht>.75?'#e86a5a':'#f2c14e',0);
    if(p.solarOver>0)btxt('¡CALIENTE!',p.x,y-10,12,'#e23b3b','center',900);}};

/* enemies hit by water take +15% damage for a while */
const _ubS=updBullets;
updBullets=function(L,dt){for(const e of L.ents){if(e._wet>0){e._wet-=dt;if(!e._wetW){e._wetW=1;const d0=e.damage;e.damage=function(a,p){return d0.call(this,a*(this._wet>0?1.15:1),p);};}}}_ubS(L,dt);};
const _deS=typeof drawEnemy==='function'?drawEnemy:null;

/* ======================= AMULETOS ======================= */
Object.assign(CHARMS,{
  corazonoro:{name:'Corazón de Oro',price:9,isl:4,desc:'¡El mejor amuleto! Dos corazones más, sin perder daño, y cada 4 parries recuperas un corazón perdido.'},
  turbo:{name:'Zapatillas Turbo',price:3,isl:2,desc:'Corres un 18% más rápido y el dash se recarga el doble de rápido.'},
  picas:{name:'As de Picas',price:4,isl:2,desc:'Empiezas cada pelea con 2 cartas de súper y las cartas se llenan un 25% más rápido.'},
  colmillo:{name:'Colmillo Vampiro',price:5,isl:3,desc:'Cada vez que haces mucho daño recuperas un corazón (hasta 2 veces por pelea).'}});
const _npS=newPlayer;
newPlayer=function(L,i,type,x,y){const p=_npS(L,i,type,x,y);const c=p.eq&&p.eq.charm;if(c==='corazonoro'){p.hp+=2;p.maxHp+=2;}if(c==='picas')p.cards=Math.max(p.cards,2);return p;};
const _gS=gain;
gain=function(p,d){if(p&&HC(p,'picas'))d*=1.25;_gS(p,d);
  if(p&&HC(p,'colmillo')&&!p.dead&&d>0){p._vamp=(p._vamp||0)+d;if(p._vamp>=120&&(p._vh||0)<2&&p.hp<p.maxHp&&typeof LV!=='undefined'&&LV&&LV.state==='play'){p._vamp=0;p._vh=(p._vh||0)+1;p.hp++;pop(LV,p.x,p.y-110,'+1 ♥',C.rust);sfx('card');}}};
const _dpGo=doParry;
doParry=function(L,p,o){_dpGo(L,p,o);if(HC(p,'corazonoro')&&!p.dead){p._gp=(p._gp||0)+1;if(p._gp>=4){p._gp=0;if(p.hp<p.maxHp){p.hp++;pop(L,p.x,p.y-110,'+1 ♥',C.gold);sfx('card');}}}};

/* ======================= SÚPERS ======================= */
Object.assign(SUPERS,{
  dragon:{name:'Dragón de Papel',price:5,isl:3,desc:'Un dragón de papel enorme cruza la pantalla dos veces y muerde todo lo que encuentra.'},
  piano:{name:'Piano de Cola',price:5,isl:2,desc:'Un piano cae del cielo justo encima del enemigo. ¡PLANNNG! Un solo golpe enorme.'},
  arcoiris:{name:'Arcoíris',price:6,isl:4,desc:'Un arcoíris gigante sale de tus manos durante casi tres segundos y quema todo lo que toca. Puedes moverte mientras dura.'}});
function drawDragon(b,L){const tr=b.tr||[];for(let i=tr.length-1;i>=1;i--){const [x,y]=tr[i];const r=34-i*2.4;ctx.save();ctx.translate(x,y);
    ell(0,0,r,r*.8,i%2?'#e86a5a':'#f2c14e',3);poly([[-r*.4,-r*.7],[0,-r*1.25],[r*.4,-r*.7]],i%2?'#f2c14e':'#e86a5a',2.5);ctx.restore();}
  ctx.save();ctx.translate(b.x,b.y);ctx.scale(b.d,1);const m=Math.abs(Math.sin(L.t*10))*10;
  poly([[10,-30],[70,-14],[78,0-m*.2],[30,4]],'#e8562e',3.5);poly([[30,4],[76,6+m],[60,24],[10,26]],'#c8482a',3);
  ell(0,0,46,40,'#e8562e',3.5);poly([[-20,-34],[-34,-70],[-4,-40]],C.goldL,3);poly([[10,-38],[6,-76],[26,-40]],C.goldL,3);
  circ(16,-12,10,C.paper,2.5);circ(19,-12,4.5,C.ink,0);for(let i=0;i<4;i++)poly([[36+i*9,4],[40+i*9,12],[44+i*9,4]],C.paper,1.5);
  ctx.strokeStyle=C.ink;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(60,-10);ctx.quadraticCurveTo(90,-30,110,-18+Math.sin(L.t*8)*6);ctx.stroke();ctx.restore();}
function drawPiano(b,L){ctx.translate(b.x,b.y);ctx.rotate(Math.sin(b.t*9)*.06);rr(-62,-40,124,46,8,'#1b130d',3.5);rr(-56,6,112,16,3,C.paper,3);for(let i=-48;i<56;i+=12){line(i,6,i,22,1.5);if((i/12|0)%3!==2)rr(i+6,6,6,9,1,C.ink,0);}
  line(-50,22,-50,52,6);line(50,22,50,52,6);ctx.beginPath();ctx.moveTo(-62,-40);ctx.quadraticCurveTo(10,-96,62,-40);ctx.fillStyle='#2a1d14';ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();ell(-20,-28,18,4,'rgba(255,255,255,.25)',0);}
function drawRainbow(b,L){const p=b.own;if(!b.x2)return;const cols=['#e23b3b','#f28c28','#f2c14e','#6fbf5a','#5aa8e8','#8a6ad8'];const a=Math.atan2(b.y2-b.y,b.x2-b.x),len=Math.hypot(b.x2-b.x,b.y2-b.y);
  ctx.translate(b.x,b.y);ctx.rotate(a);const k=Math.min(1,b.t*4)*Math.min(1,b.life*3);ctx.lineCap='butt';
  ctx.fillStyle=C.ink;ctx.fillRect(0,-46*k-3,len,92*k+6);for(let i=0;i<6;i++){ctx.fillStyle=cols[i];ctx.beginPath();ctx.moveTo(0,(-45+i*15)*k);for(let x=0;x<=len;x+=40)ctx.lineTo(x,(-45+i*15)*k+Math.sin(x*.03-L.t*14)*4*k);ctx.lineTo(len,(-30+i*15)*k);for(let x=len;x>=0;x-=40)ctx.lineTo(x,(-30+i*15)*k+Math.sin(x*.03-L.t*14)*4*k);ctx.fill();}
  circ(0,0,30*k,'#fffbe6',3);for(let i=0;i<5;i++){const x=((L.t*600+i*190)%Math.max(1,len));star(x,Math.sin(L.t*9+i)*30*k,7,3,5,L.t*6);ctx.fillStyle='#fff';ctx.fill();}}
const _ssT=startSuper;
startSuper=function(L,p){const s=p.eq.sup||'chispazo';if(!['dragon','piano','arcoiris'].includes(s)){_ssT(L,p);return;}if(typeof unlockAch==='function')unlockAch('super');
  p.cards=0;L.supers++;p.superK=s;p.superT=.5;p.inv=Math.max(p.inv,1.2);L.superFlash=.35;sfx('super');shake(L,12);banner(L,'¡'+SUPERS[s].name.toUpperCase()+'!',1.1);
  const plane=p.type==='plane',d=plane?1:p.face,c=pCenter(p);
  if(s==='dragon'){const b=B_(L,p,{x:L.camX+(d>0?-70:W+70),y:250,vx:0,vy:0,r:66,dmg:6,life:3.2,k:'dragon',pierce:true,tickHit:true,draw:drawDragon,d,t:0,tr:[]});sfx('honk');
    b.upd=(b,L,dt)=>{b.t+=dt;const T=1.5,ph=b.t<T?b.t/T:(b.t-T)/T,dir=b.t<T?b.d:-b.d;b.d=b.t<T?d:-d;const x0=dir>0?L.camX-70:L.camX+W+70;b.x=x0+dir*ph*(W+140);b.y=250+Math.sin(b.t*5)*120;b.vx=dir*.001;
      b.tr.unshift([b.x,b.y]);if(b.tr.length>9)b.tr.length=9;if(b.t>=T*2)b.life=0;};}
  else if(s==='piano'){const t=near(L,c.x,c.y),tx=t?t.center().x:c.x+d*260;const b=B_(L,p,{x:tx,y:-100,vx:0,vy:200,r:4,dmg:0,life:4,k:'piano',pierce:true,draw:drawPiano,t:0});sfx('whoosh');
    b.upd=(b,L,dt)=>{b.t+=dt;b.vy+=2400*dt;const tg=near(L,b.x,b.y);let hit=false;if(tg){const cc=tg.center();b.x+= (cc.x-b.x)*Math.min(1,dt*3);if(tg.hitBy(b.x,b.y+40,50))hit=true;}if(b.y>GROUND-50)hit=true;
      if(hit){b.life=0;boom(L,b.x,b.y,90);shake(L,18);sfx('boom');sfx('ding');for(const e of L.ents)if(!e.dead&&e.hitBy(b.x,b.y,120)){e.damage(58*dmgM(p),p);}
        for(let i=0;i<8;i++)L.fx.push({k:'spark',x:b.x+(rand()-.5)*120,y:b.y,vx:(rand()-.5)*400,vy:-200-rand()*300,life:.6,max:.6,r:4,col:i%2?C.ink:C.paper});pop(L,b.x,b.y-80,'¡PLANNNG!',C.gold);}};}
  else{const b=B_(L,p,{x:c.x,y:c.y,vx:.001,vy:0,r:1,dmg:0,life:2.8,k:'arcoiris',pierce:true,draw:drawRainbow,t:0,tk:0});sfx('zap');
    b.upd=(b,L,dt)=>{b.t+=dt;const h=p.type==='plane'?pCenter(p):handPos(p);b.x=h.x;b.y=h.y;const ax=p.type==='plane'?1:(p.aimX||p.face),ay=p.type==='plane'?0:(p.aimY||0);let ex=b.x,ey=b.y;for(let k=1;k<=70;k++){ex=b.x+ax*k*16;ey=b.y+ay*k*16;if(ex<L.camX-30||ex>L.camX+W+30||ey<-30||ey>H+30)break;}
      b.x2=ex;b.y2=ey;b.vx=ax*.001;b.vy=ay*.001;b.tk-=dt;if(b.tk<=0){b.tk=.1;for(const e of L.ents){if(e.dead||e.hidden)continue;for(let k=1;k<=70;k+=2){const px=b.x+ax*k*16,py=b.y+ay*k*16;if(e.hitBy(px,py,40)){e.damage(3.1*dmgM(p),p);sparks(L,px,py,2,'#fff');break;}}}}};}};

/* ======================= SKINS ======================= */
Object.assign(SKINS,{
  skin_neon:{name:'Neón',price:4,isl:2,desc:'Brillas en rosa y morado como un letrero de feria, con estela de chispas.',filter:'hue-rotate(290deg) saturate(2.2) brightness(1.1)',trail:'spark',tcol:'#ff5ad8'},
  skin_vaquero:{name:'Vaquero',price:3,isl:1,desc:'Sombrero de vaquero y pañuelo al cuello. ¡Yiijaa!',acc:'vaquero'},
  skin_rey:{name:'Realeza',price:5,isl:3,desc:'Una corona de oro y una capita roja. Dejas brillitos dorados.',acc:'rey',trail:'spark',tcol:'#ffe27a'},
  skin_chef:{name:'Chef',price:3,isl:2,desc:'Gorro de cocinero y bigote fino. ¡Oh là là!',acc:'chef'},
  skin_arcoiris:{name:'Arcoíris',price:6,isl:4,desc:'Colores vivísimos y una estela de estrellas de todos los colores.',filter:'saturate(2) contrast(1.1)',trail:'star',tcol:'#ff9ad5'}});
if(typeof SKIN_PAL!=='undefined'){SKIN_PAL.skin_neon={glass:'#ffb4f0',steel:'#8a3a9a',match:'#d84ab8',matchHead:'#ff5ad8'};SKIN_PAL.skin_arcoiris={glass:'#bff0ff',steel:'#e86a5a',match:'#f2c14e',matchHead:'#6fbf5a'};}
const _dsaS=drawSkinAcc;
drawSkinAcc=function(o,ch,fy,f,ex){const sk=SKINS[o.skin];if(!sk||!['vaquero','rey','chef'].includes(sk.acc)){_dsaS(o,ch,fy,f,ex);return;}
  ctx.save();ctx.filter='none';ctx.lineJoin='round';const top=fy-(ch==='cerilla'?20:ch==='velita'?22:26);
  if(sk.acc==='vaquero'){ctx.beginPath();ctx.ellipse(0,top-2,30,7,0,0,TAU);ctx.fillStyle='#a0663a';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.beginPath();ctx.moveTo(-15,top-2);ctx.quadraticCurveTo(-16,top-26,-4,top-22);ctx.quadraticCurveTo(0,top-17,4,top-22);ctx.quadraticCurveTo(16,top-26,15,top-2);ctx.closePath();ctx.fillStyle='#b8784a';ctx.fill();ctx.stroke();rr(-15,top-8,30,5,0,C.rustD,0);
    const by=fy+(ch==='chispa'?26:ch==='velita'?24:18);poly([[-11,by-3],[11,by-3],[0,by+9]],'#e23b3b',2);}
  else if(sk.acc==='rey'){poly([[-14,top+2],[-16,top-18],[-7,top-8],[0,top-22],[7,top-8],[16,top-18],[14,top+2]],C.goldL,2.5);circ(0,top-22,3,'#e23b3b',1.5);circ(-16,top-18,2.5,'#7bb7c9',1.5);circ(16,top-18,2.5,'#7bb7c9',1.5);rr(-14,top-4,28,6,2,C.gold,2);}
  else{rr(-12,top-10,24,12,3,'#fffdf5',2.5);for(const [x,y,r] of[[-10,top-18,9],[0,top-24,11],[10,top-18,9]])circ(x,y,r,'#fffdf5',2.5);rr(-12,top-10,24,12,3,'#fffdf5',0);line(-12,top-10,12,top-10,1.5);
    ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(ex,fy+10);ctx.quadraticCurveTo(ex-10*f,fy+6,ex-16*f,fy+12);ctx.moveTo(ex,fy+10);ctx.quadraticCurveTo(ex+10*f,fy+6,ex+16*f,fy+12);ctx.stroke();}
  ctx.restore();};


/* ======================= más cosas para las islas 1 y 3 ======================= */
function drawCanica(b,L){ctx.translate(b.x,b.y);circ(0,0,b.r,b.big?'#7bb7c9':'#9fd8e8',2.5);ctx.save();ctx.rotate(L.t*10+b.x*.05);ctx.beginPath();ctx.moveTo(-b.r*.7,0);ctx.quadraticCurveTo(0,-b.r*.8,b.r*.7,0);ctx.lineWidth=2.5;ctx.strokeStyle='#e86a5a';ctx.stroke();ctx.restore();ell(-b.r*.35,-b.r*.4,b.r*.3,b.r*.2,'rgba(255,255,255,.85)',0);}
function drawBat(b,L){ctx.translate(b.x,b.y);ctx.scale(b.vx<0?-1:1,1);const f=Math.sin(L.t*30+b.y)*8,s=b.big?1.6:1;ctx.scale(s,s);ctx.fillStyle='#2a1d3a';ctx.strokeStyle=C.ink;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-10,-10-f,-20,-2-f);ctx.quadraticCurveTo(-12,0,-8,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(10,-10-f,20,-2-f);ctx.quadraticCurveTo(12,0,8,6);ctx.closePath();ctx.fill();ctx.stroke();
  ell(0,2,7,8,'#3a2a50',2);circ(-3,0,1.6,'#ffe27a',0);circ(3,0,1.6,'#ffe27a',0);}
function drawGlobito(b,L){ctx.translate(b.x,b.y+Math.sin(L.t*5+b.k2)*3);line(0,b.r,Math.sin(L.t*4)*4,b.r+20,1.5);ell(0,0,b.r*.86,b.r,['#e86a5a','#f2c14e','#7bb7c9','#b8d08a','#d6a2e8'][b.k2%5],3);ell(-b.r*.3,-b.r*.4,b.r*.2,b.r*.3,'rgba(255,255,255,.7)',0);poly([[-4,b.r],[4,b.r],[0,b.r+6]],C.ink,0);}
Object.assign(WEAPONS,{
  canicas:{name:'Lanzacanicas',price:3,isl:1,desc:'Canicas de cristal que botan dos veces por el suelo antes de romperse. Muy fáciles de usar.',exd:'EX: una canica gigante que rueda por el suelo.',
    fire(L,p,h,ax,ay){p.cool=.2;B_(L,p,{x:h.x,y:h.y,vx:ax*700,vy:ay*700-110,r:8,dmg:1.87,life:2,k:'canica',g:900,bounce:2,draw:drawCanica});},
    ex(L,p,h,ax,ay){B_(L,p,{x:h.x,y:h.y,vx:(ax||p.face)*520,vy:-60,r:24,dmg:2.4,life:2.6,k:'canica',g:1200,bounce:9,big:true,pierce:true,tickHit:true,draw:drawCanica});}},
  murcielago:{name:'Murciélagos',price:5,isl:3,desc:'Murciélagos de papel que vuelan solos hasta el enemigo. Persiguen mejor que las luciérnagas y pegan más.',exd:'EX: una bandada de cinco murciélagos grandes.',
    fire(L,p,h,ax,ay){p.cool=.22;B_(L,p,{x:h.x,y:h.y,vx:ax*560,vy:ay*560-60,r:9,dmg:2.17,life:2.2,k:'bat',homing:4.2,draw:drawBat});},
    ex(L,p,h,ax,ay){for(let i=0;i<5;i++)B_(L,p,{x:h.x,y:h.y,vx:ax*400+(i-2)*60,vy:ay*400-200+i*40,r:16,dmg:3.4,life:3,k:'bat',homing:5,big:true,draw:drawBat});}}});
Object.assign(SHOTS,{canicas:()=>tn(900,.04,{type:'triangle',v:.03,slide:300}),murcielago:()=>tn(2400,.04,{type:'sine',v:.015,slide:-800})});
Object.assign(CHARMS,{
  bellota:{name:'Bellota de la Suerte',price:2,isl:1,desc:'El primer golpe de cada pelea no te quita vida: la bellota se rompe en tu lugar.'},
  arena:{name:'Reloj de Arena',price:4,isl:3,desc:'Cuando te queda un solo corazón, haces un 25% más de daño. ¡Para valientes!'}});
Object.assign(SUPERS,{globos:{name:'Globos Bomba',price:4,isl:1,desc:'Cinco globos de colores flotan solos hasta el enemigo y le explotan en la cara.'}});
const _np3=newPlayer;newPlayer=function(L,i,type,x,y){const p=_np3(L,i,type,x,y);if(p.eq&&p.eq.charm==='bellota')p.acorn=1;return p;};
const _hurt3=hurt;hurt=function(L,p){if(L.state==='play'&&!p.dead&&p.acorn>0&&HC(p,'bellota')){p.acorn=0;p.inv=1.4;p.hurtT=.2;pop(L,p.x,p.y-110,'¡BELLOTA!',C.rust);sfx('pop');puff(L,p.x,p.y-50,6,'#a0663a');return;}return _hurt3(L,p);};
const _dm3=dmgM;dmgM=function(p){return _dm3(p)*(p&&p.hp===1&&HC(p,'arena')?1.25:1);};
const _ss3=startSuper;startSuper=function(L,p){if((p.eq.sup||'chispazo')!=='globos'){_ss3(L,p);return;}if(typeof unlockAch==='function')unlockAch('super');
  p.cards=0;L.supers++;p.superK='globos';p.superT=.5;p.inv=Math.max(p.inv,1.2);L.superFlash=.35;sfx('super');shake(L,10);banner(L,'¡GLOBOS BOMBA!',1.1);const c=pCenter(p);
  for(let i=0;i<5;i++){const b=B_(L,p,{x:c.x+(i-2)*30,y:c.y-20,vx:(i-2)*40,vy:-160-i*20,r:16,dmg:0,life:5,k:'globito',pierce:true,draw:drawGlobito,k2:i,t:0});
    b.upd=(b,L,dt)=>{b.t+=dt;const tg=near(L,b.x,b.y);if(tg&&b.t>.35){const cc=nearPt(tg,b.x,b.y),a=Math.atan2(cc.y-b.y,cc.x-b.x);b.vx+=(Math.cos(a)*380-b.vx)*Math.min(1,dt*2.5);b.vy+=(Math.sin(a)*380-b.vy)*Math.min(1,dt*2.5);
      if(tg.hitBy(b.x,b.y,b.r+6)){b.life=0;boom(L,b.x,b.y,34);sfx('pop');tg.damage(9.4*dmgM(p),p);for(let k=0;k<6;k++)L.fx.push({k:'spark',x:b.x,y:b.y,vx:(rand()-.5)*300,vy:(rand()-.5)*300,life:.3,max:.3,r:3,col:'#fff'});}}
      if(b.y<L.camX*0+10&&b.vy<0)b.vy=Math.abs(b.vy);};}};


/* ======================= Cañón Cometa: el arma TOP 1 ======================= */
function drawCometa(b,L){const a=Math.atan2(b.vy,b.vx),r=b.r;ctx.translate(b.x,b.y);ctx.rotate(a);
  for(let i=5;i>=1;i--){const k=i/5,x=-i*r*.85,w=Math.sin(L.t*30+i)*3;ctx.globalAlpha=.85-k*.5;ell(x,w,r*(1.15-k*.6),r*(.9-k*.5),i%2?'#ff8a3a':'#ffd25a',0);}ctx.globalAlpha=1;
  circ(0,0,r*1.45,'rgba(255,200,80,.35)',0);ctx.save();ctx.rotate(L.t*12);star(0,0,r*1.15,r*.75,7,0);ctx.fillStyle='#ff8a3a';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();
  circ(0,0,r*.72,'#fff1a8',2.5);circ(r*.2,-r*.2,r*.22,'#fffdf5',0);}
function cometHit(b,L,dt){b.sp=(b.sp||0)-dt;if(b.sp<=0){b.sp=.03;L.fx.push({k:'spark',x:b.x-b.vx*.02,y:b.y-b.vy*.02,vx:(rand()-.5)*80,vy:(rand()-.5)*80,life:.25,max:.25,r:4,col:rand()<.5?'#ff8a3a':'#ffe27a'});}
  for(const e of L.ents){if(e.dead||(b.hits&&b.hits.has(e)))continue;if(e.hitBy(b.x,b.y,b.r)){boom(L,b.x,b.y,b.big?60:34);shake(L,b.big?8:3);sfx('boom');}}}
WEAPONS.cometon={name:'Cañón Cometa',price:10,isl:3,desc:'¡El arma más fuerte de todas! Dispara cometas de fuego enormes que lo atraviesan todo y revientan al chocar. Dispara lento y el retroceso te empuja un poquito hacia atrás.',exd:'EX: una lluvia de cinco cometas cae sobre el enemigo.',
  fire(L,p,h,ax,ay){p.cool=.42;const b=B_(L,p,{x:h.x,y:h.y,vx:ax*760,vy:ay*760,r:19,dmg:8.75,life:1.6,k:'cometon',pierce:true,draw:drawCometa});b.upd=cometHit;shake(L,3);
    if(p.type==='plat'&&p.ground&&p.dash<=0)p.x-=(p.aimX||p.face)*7;puff(L,h.x,h.y,3,'#ffd25a');},
  ex(L,p,h,ax,ay){const t=near(L,h.x,h.y),tx=t?t.center().x:h.x+(ax||p.face)*300;for(let i=0;i<5;i++){const x=tx+(i-2)*46-160,b=B_(L,p,{x,y:-60-i*70,vx:240,vy:820,r:22,dmg:7,life:2.2,k:'cometon',pierce:true,big:true,draw:drawCometa});b.upd=cometHit;}sfx('ex');}};
SHOTS.cometon=()=>{tn(160,.12,{type:'sawtooth',v:.04,slide:-90});nz(.12,{f:600,v:.05,q:.8});};

/* ======================= ICONOS ======================= */
const NEWI=['cometon','canicas','murcielago','bellota','arena','globos','solar','agua','shuriken','petardo','varita','corazonoro','turbo','picas','colmillo','dragon','piano','arcoiris'];
const _iiS=itemIcon;
itemIcon=function(id,x,y,t){if(!NEWI.includes(id)){_iiS(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  switch(id){
    case 'cometon':ctx.save();ctx.translate(6,4);ctx.scale(.95,.95);drawCometa({x:0,y:0,vx:Math.cos(-.6+Math.sin(t*2)*.1),vy:Math.sin(-.6),r:14},{t});ctx.restore();ctx.globalAlpha=.6+.4*Math.sin(t*6);btxt('TOP 1',0,32,10,'#e23b3b','center',900);break;
    case 'canicas':for(let i=0;i<3;i++){ctx.save();ctx.translate(-14+i*14,6-Math.abs(Math.sin(t*4+i))*14);drawCanica({x:0,y:0,r:8},{t});ctx.restore();}break;
    case 'murcielago':ctx.translate(Math.sin(t*2)*6,Math.cos(t*3)*3);ctx.scale(1.4,1.4);drawBat({x:0,y:0,vx:1},{t});break;
    case 'bellota':ctx.rotate(Math.sin(t*2)*.15);ell(0,6,13,15,'#c58a4a');ctx.beginPath();ctx.ellipse(0,-6,16,9,0,Math.PI,0);ctx.closePath();ctx.fillStyle='#7a4a2a';ctx.fill();ctx.stroke();line(0,-14,4,-22,3);ell(-4,4,3,5,'rgba(255,255,255,.5)',0);break;
    case 'arena':ctx.rotate(Math.sin(t)*.2);rr(-15,-22,30,5,2,C.woodL,2.5);rr(-15,17,30,5,2,C.woodL,2.5);ctx.beginPath();ctx.moveTo(-11,-17);ctx.lineTo(11,-17);ctx.lineTo(2,0);ctx.lineTo(11,17);ctx.lineTo(-11,17);ctx.lineTo(-2,0);ctx.closePath();ctx.fillStyle='rgba(220,240,240,.6)';ctx.fill();ctx.stroke();
      const k=(t*.3)%1;poly([[-8+k*6,-14+k*12],[8-k*6,-14+k*12],[0,-1]],'#f2c14e',0);poly([[-9,16],[9,16],[0,16-k*12]],'#f2c14e',0);line(0,-1,0,15,1.5);break;
    case 'globos':for(let i=0;i<3;i++){ctx.save();ctx.translate(-14+i*14,-4+Math.sin(t*3+i)*4);drawGlobito({x:0,y:0,r:10,k2:i},{t});ctx.restore();}break;
    case 'solar':ctx.save();ctx.rotate(t*.8);for(let i=0;i<10;i++){ctx.rotate(TAU/10);poly([[0,-15],[5,-26],[-5,-26]].map(([a,b])=>[a,b]),'#ffd25a',2);}ctx.restore();circ(0,0,15,'#ffe27a',3);circ(-5,-3,2,C.ink,0);circ(5,-3,2,C.ink,0);ctx.beginPath();ctx.arc(0,3,6,.2,Math.PI-.2);ctx.stroke();
      ctx.globalAlpha=.6+.4*Math.sin(t*6);btxt('TOP 2',0,32,10,'#e23b3b','center',900);break;
    case 'agua':rr(-20,-8,26,14,5,'#5aa8e8');rr(-10,6,10,14,3,'#5aa8e8');rr(6,-5,10,8,2,C.goldL,2);for(let i=0;i<3;i++){const k=((t*2+i/3)%1);ctx.globalAlpha=1-k;ell(18+k*16,-1+k*k*14,4,3,'#7bc6e8',1.5);}break;
    case 'shuriken':ctx.rotate(t*6);star(0,0,22,8,4,0);ctx.fillStyle=C.steel;ctx.fill();ctx.stroke();circ(0,0,5,C.paper,2);break;
    case 'petardo':ctx.rotate(-.4);rr(-18,-8,36,16,4,'#e23b3b');rr(-6,-8,12,16,0,C.goldL,0);rr(-18,-8,36,16,4,null,3);line(18,0,26,-8,2.5);if(Math.floor(t*10)%2)star(27,-9,7,3,6,t*4),ctx.fillStyle='#ffe27a',ctx.fill();break;
    case 'varita':ctx.rotate(-.7);rr(-3,-4,6,32,2,'#1b130d',2.5);rr(-3,22,6,6,1,C.paper,0);ctx.translate(0,-10);ctx.rotate(t*2);star(0,0,14,6,5,0);ctx.fillStyle='#fff1a8';ctx.fill();ctx.stroke();break;
    case 'corazonoro':{const s=1+.08*Math.sin(t*5);ctx.scale(s,s);ctx.beginPath();ctx.moveTo(0,16);ctx.bezierCurveTo(-26,-2,-14,-24,0,-10);ctx.bezierCurveTo(14,-24,26,-2,0,16);ctx.fillStyle=C.goldL;ctx.fill();ctx.stroke();ell(-8,-8,4,6,'rgba(255,255,255,.8)',0);
      for(let i=0;i<3;i++){const a=t*2+i*2.1;star(Math.cos(a)*24,Math.sin(a)*20,4,1.6,4,0);ctx.fillStyle='#fff6c8';ctx.fill();}btxt('GOAT',0,30,10,'#e23b3b','center',900);break;}
    case 'turbo':ctx.translate(Math.sin(t*12)*2,0);poly([[-18,6],[-16,-10],[0,-10],[6,-2],[20,2],[20,10],[-18,10]],'#e23b3b');line(-14,-4,-4,-4,2);line(-26,-6,-34,-6,2);line(-24,2,-34,2,2);rr(-20,8,42,5,2,C.paper,2);break;
    case 'picas':ctx.rotate(Math.sin(t*2)*.1);rr(-15,-21,30,42,4,C.paper);ctx.beginPath();ctx.moveTo(0,-10);ctx.bezierCurveTo(-14,2,-8,12,0,6);ctx.bezierCurveTo(8,12,14,2,0,-10);ctx.fillStyle=C.ink;ctx.fill();line(0,6,0,14,2.5);btxt('A',-9,-14,9,C.ink,'center',900);break;
    case 'colmillo':ctx.beginPath();ctx.moveTo(-10,-16);ctx.quadraticCurveTo(-12,8,0,20);ctx.quadraticCurveTo(12,8,10,-16);ctx.closePath();ctx.fillStyle='#fffdf5';ctx.fill();ctx.stroke();ell(0,20+Math.abs(Math.sin(t*3))*6,3,4,'#e23b3b',1.5);break;
    case 'dragon':ctx.scale(.42,.42);drawDragon({x:0,y:0,d:1,tr:[]},{t});break;
    case 'piano':ctx.scale(.3,.3);ctx.translate(0,Math.sin(t*3)*10);drawPiano({x:0,y:0,t},{t});break;
    case 'arcoiris':{const cols=['#e23b3b','#f28c28','#f2c14e','#6fbf5a','#5aa8e8','#8a6ad8'];for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(0,14,24-i*3.6,Math.PI,0);ctx.lineWidth=4;ctx.strokeStyle=cols[i];ctx.stroke();}ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.arc(0,14,26,Math.PI,0);ctx.stroke();cloudShape(ctx,-20,15,.17,C.paper,2);cloudShape(ctx,20,15,.17,C.paper,2);break;}
    default:{const sk=SKINS[id];circ(0,0,18,sk.tcol||'#f2c14e',3);ctx.save();ctx.translate(0,30);try{drawSkinAcc({skin:id},'chispa',-6,1,0);}catch(e){}ctx.restore();
      if(id==='skin_neon'||id==='skin_arcoiris'){for(let i=0;i<4;i++){const a=t*3+i*1.6;circ(Math.cos(a)*24,Math.sin(a)*24,3,id==='skin_neon'?'#ff5ad8':['#e23b3b','#f2c14e','#6fbf5a','#5aa8e8'][i],1);}}}}
  ctx.restore();};

/* refresh the shop shelves with everything that exists now */
try{if(save.owned&&save.owned.includes('canica')&&!save.owned.includes('canicas'))save.owned.push('canicas');for(const e of save.eq||[])for(const k of ['w1','w2'])if(e&&e[k]==='canica')e[k]='canicas';}catch(e){}
if(typeof refreshShopTabs==='function')refreshShopTabs();
})();
