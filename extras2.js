/* extras2.js — the big update, part 2: 3 weapons, 3 charms, 2 supers, 4 skins, achievements for the
   new extra bosses, and juicier effects (parry punch, phase-change confetti, knockout rays). */
(function(){
const HC=(p,c)=>typeof hasCharm==='function'&&hasCharm(p,c);
const near=(L,x,y)=>typeof nearestEnt==='function'?nearestEnt(L,x,y):null;

/* ======================= ARMAS ======================= */
function drawYoyo(b,L){ctx.save();const p=b.own,h=p&&!p.dead?handPos(p):null;if(h){ctx.strokeStyle='rgba(20,13,8,.8)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(h.x,h.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  ctx.translate(b.x,b.y);ctx.rotate(L.t*24);circ(0,0,b.r,'#e23b3b',3);circ(0,0,b.r*.55,'#f2c14e',2.5);for(let i=0;i<4;i++){ctx.rotate(TAU/4);line(b.r*.6,0,b.r*.95,0,2);}circ(0,0,3,C.ink,0);ctx.restore();}
function yoyoUpd(b,L,dt){const p=b.own;b.t=(b.t||0)+dt;if(!p||p.dead){b.life=0;return;}const h=handPos(p);
  {const a=Math.atan2(h.y-b.y,h.x-b.x),sp=900;b.vx=Math.cos(a)*sp;b.vy=Math.sin(a)*sp;if(Math.hypot(h.x-b.x,h.y-b.y)<24){b.life=0;p._yoyo=0;}}}
function drawPop(b,L){ctx.translate(b.x,b.y);ctx.rotate(L.t*8+b.x*.03);const r=b.r;for(const [x,y,rr2] of[[-r*.4,-r*.2,r*.6],[r*.4,-r*.3,r*.55],[0,r*.35,r*.6],[0,-r*.55,r*.45]])circ(x,y,rr2,'#fff4d6',2);circ(0,0,r*.3,'#f2c14e',0);}
function popUpd(b,L){if(b.small)return;for(const e of L.ents){if(e.dead||e.hidden)continue;if(e.hitBy(b.x,b.y,b.r)){for(let i=0;i<3;i++){const a=Math.atan2(-b.vy,-b.vx)+(i-1)*.7;B_(L,b.own,{x:b.x-Math.cos(a)*-6,y:b.y,vx:Math.cos(a)*-420,vy:Math.sin(a)*420-120,r:6,dmg:.85,life:.5,k:'palomitas',small:true,g:900,draw:drawPop});}sfx('pop');break;}}}
Object.assign(WEAPONS,{
  yoyo:{name:'Yoyó Loco',price:5,isl:2,desc:'Lanzas un yoyó gigante que va, golpea varias veces y vuelve a tu mano. Pega muchísimo de cerca.',exd:'EX: el yoyó da la vuelta al mundo alrededor tuyo.',
    fire(L,p,h,ax,ay){if(p._yoyo&&L.bul.some(b=>b.k==='yoyo'&&b.own===p&&b.life>0))return;p.cool=.12;const b=B_(L,p,{x:h.x,y:h.y,vx:ax*900,vy:ay*900,r:16,dmg:1.24,life:1.4,k:'yoyo',pierce:true,tickHit:true,draw:drawYoyo});
      b.upd=(b,L,dt)=>{b.t=(b.t||0)+dt;if(b.t<.22)return;yoyoUpd(b,L,dt);};p._yoyo=1;},
    ex(L,p,h,ax,ay){const b=B_(L,p,{x:h.x,y:h.y,vx:0,vy:0,r:30,dmg:2.6,life:1.6,k:'yoyo',pierce:true,tickHit:true,draw:drawYoyo,t:0});b.upd=(b,L,dt)=>{b.t+=dt;const c=pCenter(p),a=b.t*9,R=40+b.t*90;b.x=c.x+Math.cos(a)*R;b.y=c.y+Math.sin(a)*R*.6;b.vx=.001;b.vy=0;};}},
  trueno:{name:'Nube de Tormenta',price:5,isl:3,desc:'Una nubecita te sigue y lanza rayos al enemigo más cercano, esté donde esté. Nunca falla.',exd:'EX: una tormenta de cinco rayos gordos.',
    fire(L,p,h,ax,ay){p.cool=.36;const c=pCenter(p),tg=near(L,c.x,c.y);if(!tg)return;const tc=nearPt(tg,c.x,c.y);tg.damage(2.9*dmgM(p),p);gain(p,2.9);
      B_(L,p,{x:tc.x,y:tc.y,vx:.001,vy:0,r:1,dmg:0,life:.16,k:'rayo',pierce:true,x0:c.x+p.face*-10,y0:c.y-120,draw:drawBolt});sparks(L,tc.x,tc.y,3,'#fff6a8');},
    ex(L,p,h,ax,ay){const c=pCenter(p);for(let i=0;i<5;i++){const tg=near(L,c.x,c.y);if(!tg)break;const tc=nearPt(tg,c.x,c.y);tg.damage(4*dmgM(p),p);B_(L,p,{x:tc.x+(i-2)*14,y:tc.y,vx:.001,vy:0,r:1,dmg:0,life:.35,k:'rayo',pierce:true,x0:tc.x+(i-2)*60,y0:-20,big:true,draw:drawBolt});}shake(L,10);sfx('zap');}},
  palomitas:{name:'Palomitas',price:4,isl:1,desc:'Granos de maíz que explotan en tres palomitas al chocar. ¡Pop, pop, pop!',exd:'EX: un cubo entero de palomitas.',
    fire(L,p,h,ax,ay){p.cool=.19;const b=B_(L,p,{x:h.x,y:h.y,vx:ax*820,vy:ay*820,r:10,dmg:1.85,life:1.3,k:'palomitas',draw:drawPop});b.upd=popUpd;},
    ex(L,p,h,ax,ay){for(let i=0;i<12;i++){const b=B_(L,p,{x:h.x,y:h.y,vx:ax*(500+i*30)+(i%3-1)*60,vy:ay*500-300-i*30,r:12,dmg:1.6,life:2,k:'palomitas',g:900,draw:drawPop});b.upd=popUpd;}}}});
function drawBolt(b,L){ctx.save();const segs=7,x0=b.x0,y0=b.y0,x1=b.x,y1=b.y;ctx.lineCap='round';ctx.lineJoin='round';
  const pts=[[x0,y0]];for(let i=1;i<segs;i++){const k=i/segs;pts.push([x0+(x1-x0)*k+Math.sin(L.t*80+i*7)*16,y0+(y1-y0)*k]);}pts.push([x1,y1]);
  for(const [w,c] of [[b.big?16:11,C.ink],[b.big?10:6,'#ffe27a'],[b.big?4:2.5,'#fffbe6']]){ctx.lineWidth=w;ctx.strokeStyle=c;ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}ctx.restore();}
Object.assign(SHOTS,{yoyo:()=>tn(600,.06,{type:'triangle',v:.03,slide:500}),trueno:()=>{nz(.08,{f:3000,v:.04,q:1});tn(90,.1,{type:'sawtooth',v:.03});},palomitas:()=>tn(1200+Math.random()*400,.03,{type:'square',v:.02})});

/* ======================= AMULETOS ======================= */
Object.assign(CHARMS,{
  gatosuerte:{name:'Gato de la Suerte',price:8,isl:4,desc:'Una vez por pelea, el golpe que te iba a apagar no cuenta: el gatito te salva con un maullido.'},
  brujula:{name:'Brújula Dorada',price:4,isl:2,desc:'Tus disparos se curvan un poquito hacia el enemigo. Pegan un 10% menos, pero casi nunca fallas.'},
  espinas:{name:'Cactus Espinoso',price:3,isl:1,desc:'Cuando te golpean, sueltas ocho espinas en todas direcciones. ¡Que se lo piensen dos veces!'}});
const _hurtE=hurt;hurt=function(L,p){if(L.state==='play'&&!p.dead&&p.hp===1&&HC(p,'gatosuerte')&&!p._gato){p._gato=1;p.inv=2;p.hurtT=.25;pop(L,p.x,p.y-110,'¡MIAU!',C.rust);sfx('pop');shake(L,8);return;}return _hurtE(L,p);};
const _BE=B_;B_=function(L,p,b){const r=_BE(L,p,b);if(p&&p.eq&&HC(p,'brujula')&&!b.homing&&(b.dmg||0)>0&&b.k!=='ex'&&!b.tickHit){r.homing=1.6;r.dmg*=.9;}return r;};
function drawEspina(b,L){ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));poly([[12,0],[-8,-5],[-8,5]],'#6fbf5a',2);}
const _hurtE2=hurt;hurt=function(L,p){const h0=p.hp;const r=_hurtE2(L,p);if(p.hp<h0&&HC(p,'espinas')){const c=pCenter(p);for(let i=0;i<8;i++){const a=i*TAU/8;B_(L,p,{x:c.x,y:c.y,vx:Math.cos(a)*700,vy:Math.sin(a)*700,r:8,dmg:3,life:.9,k:'espina',pierce:true,draw:drawEspina});}sfx('pop');}return r;};

/* ======================= SÚPERS ======================= */
Object.assign(SUPERS,{
  fantasmas:{name:'Fantasmas Amigos',price:5,isl:3,desc:'Seis fantasmitas giran a tu alrededor y luego se lanzan contra el enemigo. ¡Buuu!'},
  burbujon:{name:'Burbujón',price:5,isl:2,desc:'Una burbuja gigante te protege 5 segundos. Mientras dura, tus disparos pegan un 30% más.'}});
function drawFant(b,L){ctx.save();ctx.translate(b.x,b.y+Math.sin(L.t*8+b.k2)*3);ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(0,-4,16,Math.PI,0);for(let k=0;k<=4;k++)ctx.lineTo(16-k*8,14+(k%2)*6*Math.sin(L.t*10+k));ctx.closePath();ctx.fillStyle='#f4f8ff';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
  circ(-6,-6,3,C.ink,0);circ(6,-6,3,C.ink,0);ell(0,3,4,b.dive?5:2,C.ink,0);ell(-11,0,3,2,'rgba(255,140,170,.6)',0);ell(11,0,3,2,'rgba(255,140,170,.6)',0);ctx.restore();}
const _ssE=startSuper;startSuper=function(L,p){const s=p.eq.sup||'chispazo';if(s!=='fantasmas'&&s!=='burbujon'){_ssE(L,p);return;}if(typeof unlockAch==='function')unlockAch('super');
  p.cards=0;L.supers++;p.superK=s;p.superT=.5;p.inv=Math.max(p.inv,1.2);L.superFlash=.35;sfx('super');shake(L,12);banner(L,'¡'+SUPERS[s].name.toUpperCase()+'!',1.1);
  if(s==='fantasmas'){const c0=pCenter(p);for(let i=0;i<6;i++){const b=B_(L,p,{x:c0.x,y:c0.y,vx:.001,vy:0,r:16,dmg:0,life:5,k:'fantasma',pierce:true,draw:drawFant,k2:i,t:0});sfx('whoosh');
    b.upd=(b,L,dt)=>{b.t+=dt;if(b.t<1.1+b.k2*.12){const c=pCenter(p),a=b.t*5+b.k2*TAU/6;b.x=c.x+Math.cos(a)*70;b.y=c.y+Math.sin(a)*50;b.vx=.001;return;}
      const tg=near(L,b.x,b.y);if(!tg){b.life=Math.min(b.life,.3);return;}b.dive=1;const cc=nearPt(tg,b.x,b.y),a=Math.atan2(cc.y-b.y,cc.x-b.x);b.x+=Math.cos(a)*700*dt;b.y+=Math.sin(a)*700*dt;b.vx=Math.cos(a)*.001;
      if(tg.hitBy(b.x,b.y,b.r+6)){b.life=0;tg.damage(7.5*dmgM(p),p);puff(L,b.x,b.y,6,'#f4f8ff');sfx('pop');}};}}
  else{p._buffT=5;p.inv=Math.max(p.inv,5);sfx('pop');}};
const _dmE=dmgM;dmgM=function(p){return _dmE(p)*(p&&p._buffT>0?1.3:1);};
const _ubE=updBullets;updBullets=function(L,dt){for(const p of L.Ps)if(p._buffT>0){p._buffT-=dt;p.inv=Math.max(p.inv,.05);}_ubE(L,dt);};

/* ======================= SKINS ======================= */
Object.assign(SKINS,{
  skin_pirata:{name:'Pirata',price:3,isl:2,desc:'Pañuelo rojo, parche en el ojo y un pendiente de oro. ¡Al abordaje!',acc:'pirata'},
  skin_mago:{name:'Mago',price:4,isl:3,desc:'Sombrero puntiagudo con estrellas y estela mágica.',acc:'mago',trail:'star',tcol:'#b48aff'},
  skin_zombi:{name:'Zombi',price:3,isl:3,desc:'Verdoso y un poco despeinado. ¡Cerebrooos… digo, chispaaas!',filter:'hue-rotate(70deg) saturate(.7) brightness(.95)',trail:'spark',tcol:'#9ad86a'},
  skin_lunar:{name:'Polvo de Luna',price:6,isl:4,desc:'Pálido, azulado y medio transparente, como recién salido del mausoleo. Deja estela de polvo de luna.',filter:'grayscale(.7) brightness(1.35) hue-rotate(170deg)',trail:'spark',tcol:'#cfe8ff'}});
if(typeof SKIN_PAL!=='undefined'){SKIN_PAL.skin_zombi={glass:'#c8e8a8',steel:'#6a8a5a',match:'#8ab86a',matchHead:'#5a8a3a'};SKIN_PAL.skin_lunar={glass:'#e4f2ff',steel:'#9ab0c8',match:'#c8d8e8',matchHead:'#a8c0e0'};}
const _dsaE=drawSkinAcc;drawSkinAcc=function(o,ch,fy,f,ex){const sk=SKINS[o.skin];if(!sk||(sk.acc!=='pirata'&&sk.acc!=='mago')){_dsaE(o,ch,fy,f,ex);return;}
  ctx.save();ctx.filter='none';ctx.lineJoin='round';const top=fy-(ch==='cerilla'?20:ch==='velita'?22:26);
  if(sk.acc==='pirata'){ctx.beginPath();ctx.moveTo(-17,top+6);ctx.quadraticCurveTo(0,top-18,17,top+6);ctx.closePath();ctx.fillStyle='#d8382c';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();for(const [x,y] of [[-8,top-2],[4,top-6],[10,top+1]])circ(x,y,1.8,'#fff',0);
    poly([[15*f,top+4],[26*f,top+10],[22*f,top+14]],'#d8382c',2);ell(ex+6*f,fy+2,6,5,C.ink,0);line(ex-8*f,top+8,ex+14*f,fy-2,1.6);circ(-16*f,fy+14,3,C.goldL,1.5);}
  else{poly([[-20,top+4],[20,top+4],[6*f,top-40],[14*f,top-46]],'#5a3aa0',2.5);rr(-21,top,42,7,3,'#5a3aa0',2.5);for(const [x,y] of [[-6,top-8],[6*f,top-22],[0,top-4]]){star(x,y,4,1.8,5,0);ctx.fillStyle='#ffe27a';ctx.fill();}}
  ctx.restore();};

/* ======================= ICONOS ======================= */
const NEWE=['yoyo','trueno','palomitas','gatosuerte','brujula','espinas','fantasmas','burbujon'];
const _iiE=itemIcon;itemIcon=function(id,x,y,t){if(!NEWE.includes(id)){_iiE(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;
  switch(id){
    case 'yoyo':{const d=Math.abs(Math.sin(t*3))*16;line(0,-24,0,-12+d,2);drawYoyo({x:0,y:-4+d,r:14,own:null},{t});break;}
    case 'trueno':cloudShape(ctx,0,-10,.32,'#d8dee6',2.5);if(Math.floor(t*4)%2===0)drawBolt({x:6,y:22,x0:-2,y0:-2},{t});break;
    case 'palomitas':rr(-14,-4,28,26,3,'#fff8ee',3);for(let i=0;i<3;i++)rr(-12+i*9,-4,4,26,0,'#e23b3b',0);rr(-14,-4,28,26,3,null,3);for(let i=0;i<4;i++)drawPopIcon(-10+i*7,-10-Math.abs(Math.sin(t*4+i))*6);break;
    case 'gatosuerte':circ(0,2,16,'#fff8ee',3);poly([[-14,-6],[-12,-22],[-2,-12]],'#fff8ee',3);poly([[14,-6],[12,-22],[2,-12]],'#fff8ee',3);circ(-6,0,2.5,C.ink,0);circ(6,0,2.5,C.ink,0);line(-1,6,1,6,2);
      ctx.save();ctx.translate(16,10);ctx.rotate(-.5+Math.sin(t*6)*.5);rr(-3,-18,6,18,3,'#fff8ee',2.5);ctx.restore();circ(0,14,4,'#e23b3b',1.5);break;
    case 'brujula':circ(0,0,18,C.goldL,3);circ(0,0,13,'#fff8ee',2);ctx.rotate(Math.sin(t*2)*.4);poly([[0,-12],[4,0],[0,12],[-4,0]],'#e23b3b',1.5);poly([[0,12],[4,0],[-4,0]],C.steel,0);break;
    case 'espinas':rr(-10,-18,20,40,10,'#6fbf5a',3);rr(-22,-6,10,14,5,'#6fbf5a',3);rr(12,-12,10,14,5,'#6fbf5a',3);for(let i=0;i<6;i++)line(-10+(i%2)*20,-12+i*6,-15+(i%2)*30,-14+i*6,1.5);rr(-14,18,28,10,3,'#c8603a',3);circ(0,-20,4+Math.abs(Math.sin(t*3))*2,'#ff7ac8',1.5);break;
    case 'fantasmas':for(let i=0;i<3;i++){const a=t*2+i*2.1;ctx.save();ctx.scale(.7,.7);drawFant({x:Math.cos(a)*20,y:Math.sin(a)*12,k2:i},{t});ctx.restore();}break;
    case 'burbujon':{const s=1+.06*Math.sin(t*4);circ(0,0,20*s,'rgba(160,220,240,.45)',3);ell(-7,-8,5,7,'rgba(255,255,255,.8)',0);ctx.save();ctx.translate(0,10);drawHero({x:0,y:0,char:'chispa',face:1,anim:t*6,run:false,scale:.22,aimX:1,aimY:0,flash:false});ctx.restore();break;}}
  ctx.restore();};
function drawPopIcon(x,y){circ(x,y,4,'#fff4d6',1.5);circ(x+3,y-2,3.5,'#fff4d6',1.5);}

/* ======================= LOGROS de los jefes extra ======================= */
const NEWACH=[['extra_cafetera','¡Qué Cafetazo!','Vence a La Cafetera Chacha.',2],['extra_buzo','Pulmones de Acero','Vence al Buzo Burbujas.',2],['extra_linterna','Fin de la Función','Vence a La Linterna Mágica.',2],['extra_heladero','Cerebro Congelado','Vence al Rey Helado.',3],['extras4','Jefes Extra','Vence a los cuatro jefes extra.',4]];
for(const a of NEWACH){if(!ACHD[a[0]]){ACH.push(a);ACHD[a[0]]={id:a[0],name:a[1],desc:a[2],coins:a[3]};}}
const _alE=afterLevel;afterLevel=function(L){const win=!(L.result&&L.result.fail);if(win&&['cafetera','buzo','linterna','heladero'].includes(L.id)){unlockAch('extra_'+L.id);if(['cafetera','buzo','linterna','heladero'].every(k=>save.cleared[k]||k===L.id))unlockAch('extras4');}_alE(L);};

/* ======================= EFECTOS ======================= */
const _dpE=doParry;doParry=function(L,p,o){_dpE(L,p,o);L._pzT=L.t;(L.fx2||(L.fx2=[])).push({k:'ring',x:p.x,y:p.y-60,t0:L.t,col:'#ff7ac8'});};
const _dlE=drawLevel;drawLevel=function(L){const k=L._pzT!=null?Math.max(0,1-(L.t-L._pzT)/.22):0;
  if(L.boss){const B=L.boss;if(B._rph==null)B._rph=B.phase;if(B.phase!==B._rph){B._rph=B.phase;(L.fx2||(L.fx2=[])).push({k:'fase',t0:L.t,x:B.center?B.center().x:W/2,y:B.center?B.center().y:200});}
    if(B.dead&&!B._rko){B._rko=1;(L.fx2||(L.fx2=[])).push({k:'ko',t0:L.t,x:B.center?B.center().x:W/2,y:B.center?B.center().y:200});}}
  if(k>0){ctx.save();const s=1+.035*k;ctx.translate(W/2,H/2);ctx.scale(s,s);ctx.translate(-W/2,-H/2);_dlE(L);ctx.restore();}else _dlE(L);
  if(L.fx2&&L.fx2.length){L.fx2=L.fx2.filter(f=>L.t-f.t0<1.4);ctx.save();ctx.lineCap='round';
    for(const f of L.fx2){const a=L.t-f.t0,x=f.x-(L.camX||0),y=f.y;
      if(f.k==='ring'&&a<.4){const r=20+a*260;ctx.globalAlpha=1-a/.4;ctx.lineWidth=8*(1-a/.4)+2;ctx.strokeStyle=f.col;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();for(let i=0;i<8;i++){const an=i*TAU/8;star(x+Math.cos(an)*r*.8,y+Math.sin(an)*r*.8,8,3.5,5,a*6);ctx.fillStyle='#ffd6ec';ctx.fill();}}
      else if(f.k==='fase'&&a<1.2){if(a<.12){ctx.globalAlpha=.5*(1-a/.12);ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);}ctx.globalAlpha=Math.max(0,1-a/1.2);
        for(let i=0;i<36;i++){const an=i*2.39,sp=200+(i*37)%260,px=x+Math.cos(an)*sp*a,py=y+Math.sin(an)*sp*a+420*a*a;ctx.save();ctx.translate(px,py);ctx.rotate(a*10+i);rr(-5,-3,10,6,1,['#e86a5a','#f2c14e','#7bb7c9','#b8d08a','#ff7ac8'][i%5],0);ctx.restore();}}
      else if(f.k==='ko'&&a<1.4){ctx.globalAlpha=Math.max(0,.55*(1-a/1.4));ctx.save();ctx.translate(x,y);ctx.rotate(a*.8);for(let i=0;i<16;i++){ctx.rotate(TAU/16);ctx.fillStyle=i%2?'#fff3b0':'#ffd25a';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(900,-60);ctx.lineTo(900,60);ctx.closePath();ctx.fill();}ctx.restore();}}
    ctx.restore();}};
const _dpPE=drawPlayers;drawPlayers=function(L){_dpPE(L);for(const p of L.Ps){if(p.dead)continue;
  if(p._buffT>0){const c=pCenter(p),s=1+.04*Math.sin(L.t*8),a=Math.min(1,p._buffT);ctx.save();ctx.globalAlpha=.85*a;circ(c.x,c.y,62*s,'rgba(160,220,240,.28)',3);ell(c.x-22,c.y-26,9,13,'rgba(255,255,255,.75)',0);ctx.restore();}
  if(p.type==='plat'&&typeof curW==='function'&&curW(p)==='trueno'){{const c=pCenter(p);ctx.save();ctx.translate(c.x-p.face*16,c.y-118+Math.sin(L.t*3)*5);cloudShape(ctx,0,0,.3,'#d8dee6',2.5);circ(-6,-2,2,C.ink,0);circ(6,-2,2,C.ink,0);ctx.restore();}}}};

if(typeof refreshShopTabs==='function')refreshShopTabs();
})();
