/* pato.js — secret skin "Patito" (type DUCK in capital letters on the title, map, shop or equipment screen).
   - Yellow duck look for Chispa, Cerilla and Velita: orange beak, a feather tuft, little wings and webbed feet.
   - Shots are duck-yellow and duck-shaped (rubber duckies, eggs, feathers, ducklings) — a different shape per weapon.
   - Bonuses: +1 heart · +16 % damage on your shots · +10 % on Súpers · the Súper bar refills by itself ·
     long-reach parry · every parry launches 3 homing ducklings · when you get hit, a burst of feathers
     gives you a little extra invincibility · a "¡CUAC!" and feathers when you dash.
   - Its own level entrance: the duck flies down from the sky flapping, lands with a splash and quacks.
   Simulation parts are deterministic (online play stays in sync); looks are drawing only. */
(function(){
SKINS.skin_pato={name:'Patito',price:0,isl:1,secret:true,acc:'pato',trail:'spark',tcol:'#ffd23a',
  desc:'Secreta (código DUCK). ¡Cuac! Pico naranja, alitas y patas de pato.'};
const PAL={glass:'#ffe066',steel:'#e8a21a',steelD:'#b87a10',match:'#ffd23a',matchHead:'#ff9a1a',paper:'#fff6c8'};
if(window.SKIN_PERK)SKIN_PERK.skin_pato={hp:1,t:'+1 corazón, +5 % de daño, +8 % en las súper, la súper se recarga sola, parry de largo alcance, patitos al hacer parry, un patito acompañante que dispara y entrada propia'};
SKINS.skin_pato.desc+=' Bonus: '+SKIN_PERK.skin_pato.t+'.';
if(typeof refreshShopTabs==='function'){const _r=refreshShopTabs;refreshShopTabs=function(){_r();try{for(const t of SHOP_TABS){const i=t.ids.indexOf('skin_pato');if(i>=0)t.ids.splice(i,1);}}catch(e){}};refreshShopTabs();}
const isPato=p=>p&&p.eq&&p.eq.skin==='skin_pato';

/* ---------- the code ---------- */
let buf='';
function grant(){cfg.duck=true;try{saveCfg();}catch(e){}sync(true);sfx('magic');sfx('coin');const msg='¡SECRETO! Skin Patito desbloqueada 🦆';
  if(scene==='title'&&typeof TI!=='undefined'){TI.msg=msg;TI.msgT=3.5;}else if(typeof ACHQ!=='undefined')ACHQ.push({a:{name:'¡Skin Patito desbloqueada! 🦆',coins:0},t:0});}
function sync(equip){if(!cfg.duck||typeof save==='undefined'||!save||!save.owned)return;let ch=false;if(!save.owned.includes('skin_pato')){save.owned.push('skin_pato');ch=true;equip=true;}
  if(equip&&save.eq)for(const e of save.eq)if(e){e.skin='skin_pato';ch=true;}if(ch)try{persist();}catch(e){}}
const _ss=syncSecrets;syncSecrets=function(){_ss.apply(this,arguments);sync(false);};
addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.key.length!==1)return;if(!['title','map','shop','equip','slots'].includes(scene)){buf='';return;}
  buf=(buf+e.key).slice(-4);if(buf==='DUCK'){buf='';grant();}});

/* ---------- bonuses (simulation) ---------- */
const _st=startSuper;startSuper=function(L,p){const r=_st(L,p);if(isPato(p)&&L)p._dSup=(L.t||0)+5;return r;};
const _dm=dmgM;dmgM=function(p){const m=_dm(p);if(!isPato(p))return m;const inSup=typeof LV!=='undefined'&&LV&&p._dSup>(LV.t||0);return m*(inSup?1.08:1.05);};
const _pt=ptimers;ptimers=function(p,dt){_pt(p,dt);if(!isPato(p)||p.dead)return;if(!(p.superT>0))p.cards=Math.min(5,(p.cards||0)+dt/35);if(p._feath>0)p._feath-=dt;
  if(p.dash>0&&!p._dW){p._quack=.6;}p._dW=p.dash>0;if(p._quack>0)p._quack-=dt;};
if(typeof reachOf==='function'){const _ro=reachOf;reachOf=function(p){const r=_ro(p);return isPato(p)?r+20:r;};}
function duckling(b){const d=b.vx<0?-1:1;ctx.save();ctx.translate(b.x,b.y);ctx.scale(d,1);ell(0,2,9,7,'#ffd23a',2);circ(6,-5,5.5,'#ffd23a',2);poly([[10,-5],[16,-3],[10,-1]],'#ff9a1a',1.5);circ(7,-6,1.3,C.ink,0);ctx.restore();}
const _dp=doParry;doParry=function(L,p,o){_dp(L,p,o);if(!isPato(p)||!L)return;const c=pCenter(p);for(let i=0;i<3;i++){const a=-Math.PI/2+(i-1)*.7;
  B_(L,p,{x:c.x,y:c.y,vx:Math.cos(a)*420+(p.face||1)*200,vy:Math.sin(a)*420,r:9,dmg:1.2,life:2.2,k:'patito',homing:7,noGain:true,draw:duckling});}sfx('pop');};
const _h=hurt;hurt=function(L,p){const b=p?p.hp:0;_h(L,p);if(isPato(p)&&p.hp<b&&!p.dead&&p.hp>0){p.inv=Math.max(p.inv,1.9);p._feath=1;}};

/* ---------- duck-yellow shots ---------- */
const Y='#ffd23a',Y2='#fff0a0',OR='#ff9a1a';
function rubber(r,t){ell(0,r*.25,r*1.05,r*.75,Y,2.2);circ(r*.55,-r*.45,r*.55,Y,2.2);poly([[r*1.05,-r*.45],[r*1.6,-r*.3],[r*1.05,-r*.15]],OR,1.6);circ(r*.65,-r*.55,r*.12,C.ink,0);ell(-r*.2,r*.1,r*.45,r*.25,'#f2b81a',0);}
function egg(r,t){ctx.save();ctx.rotate(t);ell(0,0,r*.8,r,'#fffbe8',2.2);ell(-r*.2,-r*.35,r*.2,r*.28,'rgba(255,255,255,.9)',0);for(let i=0;i<3;i++)circ((i-1)*r*.35,r*.3,r*.1,'#f2c14e',0);ctx.restore();}
function feather(r,t){ctx.save();ctx.rotate(Math.sin(t*12)*.3);ctx.beginPath();ctx.moveTo(-r*1.3,0);ctx.quadraticCurveTo(0,-r*.9,r*1.3,0);ctx.quadraticCurveTo(0,r*.9,-r*1.3,0);ctx.fillStyle=Y2;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();line(-r*1.4,0,r*1.2,0,1.5,'#d8a020');ctx.restore();}
function bread(r,t){ctx.save();ctx.rotate(t*6);rr(-r,-r*.8,r*2,r*1.6,r*.5,'#e8b46a',2.2);rr(-r*.7,-r*.5,r*1.4,r*1,r*.3,'#fbe8c0',0);ctx.restore();}
function yshot(r){circ(0,0,r+4,'rgba(255,210,58,.35)',0);ell(0,0,r*1.15,r,Y,2.2);ell(r*.25,-r*.3,r*.45,r*.3,'rgba(255,255,255,.85)',0);}
const SHAPE={chispa:'rubber',conv:'yshot',agua:'rubber',bume:'feather',shuri:'feather',abanico:'feather',palomitas:'bread',luci:'rubber',rebote:'egg',canica:'egg',varita:'egg',
  tack:'bread',bubble:'rubber',bomba:'egg',petardo:'egg',part:'rubber',bat:'rubber',twist:'feather',cometon:'rubber',yoyo:'egg',baston:'feather',llama:'yshot',onda:'feather',ex:'rubber',
  luciB:'rubber',cohete:'egg',globito:'rubber',fantasma:'rubber',bolanieve:'egg',magnet:'rubber',shock:'feather'};
const SPIN=new Set(['rebote','canica','varita','bomba','petardo','yoyo','tack','palomitas','cohete','bolanieve']);
function drawDuckShot(b,L){const r=Math.max(5,Math.min(b.r||7,30)),sh=SHAPE[b.k]||'yshot',t=L.t;ctx.save();ctx.translate(b.x,b.y);ctx.lineJoin='round';ctx.lineCap='round';
  if(!SPIN.has(b.k))ctx.rotate(Math.atan2(b.vy||0,b.vx||1));if(Math.hypot(b.vx||0,b.vy||0)>80){ctx.save();ctx.globalAlpha=.3;ell(-r*1.8,0,r*1.5,r*.4,Y,0);ctx.restore();}
  (sh==='rubber'?rubber:sh==='egg'?egg:sh==='feather'?feather:sh==='bread'?bread:yshot)(r,sh==='egg'||sh==='bread'?t*5:t);ctx.restore();}
function duckBeam(bm,L){const x0=bm.x,x1=bm.dir>0?L.camX+W+40:L.camX-40,len=Math.abs(x1-x0),hh=30;ctx.save();ctx.globalAlpha=Math.min(1,bm.t*4);
  ctx.fillStyle='rgba(255,210,58,.85)';ctx.fillRect(Math.min(x0,x1),bm.y-hh,len,hh*2);ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.strokeRect(Math.min(x0,x1),bm.y-hh,len,hh*2);ctx.fillStyle='rgba(255,250,210,.9)';ctx.fillRect(Math.min(x0,x1),bm.y-8,len,16);
  for(let i=0;i<6;i++){const x=x0+bm.dir*((i*170+L.t*700)%len);ctx.save();ctx.translate(x,bm.y+Math.sin(i+L.t*6)*14);ctx.scale(bm.dir*1.3,1.3);rubber(9,L.t);ctx.restore();}ctx.restore();}
const _db=drawBullets;drawBullets=function(L){const any=L&&((L.bul&&L.bul.some(b=>isPato(b.own)))||(L.beams&&L.beams.some(bm=>isPato(bm.own))));if(!any){_db(L);return;}
  const all=L.bul,beams=L.beams,mine=[],rest=[];for(const b of all)(isPato(b.own)&&b.k!=='beam'&&!(b.draw&&!SHAPE[b.k])&&(b.r||8)<=30?mine:rest).push(b);
  const my=beams.filter(bm=>isPato(bm.own));L.bul=rest;L.beams=beams.filter(bm=>!isPato(bm.own));try{_db(L);}finally{L.bul=all;L.beams=beams;}for(const bm of my)duckBeam(bm,L);for(const b of mine)drawDuckShot(b,L);};

/* ---------- looks ---------- */
const _dsa=drawSkinAcc;drawSkinAcc=function(o,ch,fy,f,ex){const sk=SKINS[o.skin];if(!sk||sk.acc!=='pato'){_dsa(o,ch,fy,f,ex);return;}const t=typeof LV!=='undefined'&&LV?LV.t:performance.now()/1000;
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';const top=fy-(ch==='cerilla'?20:ch==='velita'?22:26),by=fy+(ch==='chispa'?26:ch==='velita'?24:18);
  /* a little rubber duck sitting on your head (Velita: beside the flame) */ {const hx=ch==='velita'?-f*14:0,hy=top-(ch==='velita'?2:ch==='chispa'?-6:4),bob=Math.sin(t*4)*1.5;ctx.save();ctx.translate(hx,hy+bob);ctx.scale(f,1);
    ell(0,-6,11,8,'#ffd23a',2.2);circ(7,-15,6.5,'#ffd23a',2.2);poly([[12,-16],[19,-14],[12,-12]],OR,1.6);circ(8.5,-17,1.4,C.ink,0);ell(-4,-7,5,3,'#f2b81a',0);ctx.restore();}
  /* duck bill over the mouth: upper and lower bill, with nostrils */ {const bx=ex-f*2,byk=fy+10;ctx.save();ctx.translate(bx,byk);ctx.scale(f,1);
    ctx.beginPath();ctx.moveTo(-6,-4);ctx.quadraticCurveTo(10,-9,17,-2);ctx.quadraticCurveTo(12,1,-6,1);ctx.closePath();ctx.fillStyle=OR;ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.beginPath();ctx.moveTo(-5,1);ctx.quadraticCurveTo(10,2,15,1);ctx.quadraticCurveTo(8,7,-5,5);ctx.closePath();ctx.fillStyle='#e8801a';ctx.fill();ctx.stroke();circ(6,-4,1,C.ink,0);circ(10,-4,1,C.ink,0);ctx.restore();}
  /* little wings at the sides of the body, flapping when you jump or dash */ const fl=o.air||o.dash?Math.sin(t*30)*.7:Math.sin(t*3)*.1,wy=by+(ch==='cerilla'?6:2);
  for(const s of[-1,1]){ctx.save();ctx.translate(s*17,wy);ctx.rotate(s*(.9+fl));ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(s*12,-6,s*14,4);ctx.quadraticCurveTo(s*8,4,s*10,10);ctx.quadraticCurveTo(s*3,8,0,0);ctx.closePath();ctx.fillStyle='#ffe066';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
  /* blush */ ctx.globalAlpha=.55;ell(ex+f*12,fy+4,4,2.5,'#ff9a7a',0);ctx.globalAlpha=1;
  ctx.restore();};
/* entrance: the duck flies down from the sky, lands with a splash and quacks (drawing only) */
const _dh=drawHero;drawHero=function(o){if(!o||o.skin!=='skin_pato'||o.scale||typeof LV==='undefined'||!LV||scene!=='level'){_dh(o);return;}const L=LV,t=L.t;
  if(L.state==='intro'&&t<1.4){const k=Math.min(1,t/1.1),off=(1-k)*(1-k)*-420;const o2=Object.assign({},o,{y:o.y+off,air:k<1});
    if(k<1){ctx.save();ctx.translate(o.x,o.y+off-50);for(const s of[-1,1]){ctx.save();ctx.scale(s,1);ctx.rotate(-.5+Math.sin(t*28)*.7);ell(28,0,26,11,'#ffd23a',3);ctx.restore();}ctx.restore();}
    _dh(o2);if(k>=1&&t<1.4){const a=(t-1.1)/.3;ctx.save();ctx.globalAlpha=1-a;ell(o.x,o.y,30+a*50,6+a*6,'rgba(90,180,255,.7)',2);for(let i=0;i<6;i++){const an=Math.PI+(i+.5)/6*Math.PI;circ(o.x+Math.cos(an)*(20+a*40),o.y+Math.sin(an)*(10+a*30),4,'#9fe8ff',1.5);}ctx.restore();btxt('¡CUAC!',o.x,o.y-130-a*20,30,'#ffd23a','center',900);}
    return;}
  _dh(o);const p=L.Ps&&L.Ps.find(q=>q.x===o.x&&q.y===o.y);
  if(p&&p._quack>0){ctx.save();ctx.globalAlpha=Math.min(1,p._quack*2);btxt('¡CUAC!',o.x,o.y-120,20,'#ffd23a','center',900);for(let i=0;i<3;i++)ell(o.x-(p.face||1)*(20+i*14),o.y-40+Math.sin(t*10+i)*8,7,3,Y2,1.5,t+i);ctx.restore();}
  if(p&&p._feath>0){ctx.save();ctx.globalAlpha=p._feath;for(let i=0;i<8;i++){const a=i/8*TAU+t*2,d=30+(1-p._feath)*60;ell(o.x+Math.cos(a)*d,o.y-50+Math.sin(a)*d,8,3.5,Y2,1.5,a);}ctx.restore();}};
const _dh2=drawHero;drawHero=function(o){if(!o||o.skin!=='skin_pato'){_dh2(o);return;}const old={};for(const k in PAL){old[k]=C[k];C[k]=PAL[k];}try{_dh2(o);}finally{for(const k in old)C[k]=old[k];}};
/* companion duckling: follows you and shoots like the Pajarito Ayudante (same damage) */
const dPos=(p,t)=>({x:p.x-(p.face||1)*34,y:(p.type==='plane'?p.y+30:p.y-14)-Math.abs(Math.sin(t*8))*8});
const _sT=superTick;superTick=function(L,p,dt){_sT(L,p,dt);if(!isPato(p)||!L||p.dead||L.state!=='play')return;p._dk=(p._dk||0)-dt;if(p._dk<=0){p._dk=.8;const d=dPos(p,L.t);
  B_(L,p,{x:d.x,y:d.y-8,vx:(p.face||1)*520,vy:-40,r:6,dmg:1,life:2,k:'patito',homing:6,noGain:true,draw:duckling});}};
const _dl=drawLevel;drawLevel=function(L){_dl.apply(this,arguments);if(!L||!L.Ps||scene!=='level'||!L.Ps.some(p=>isPato(p)&&!p.dead))return;ctx.save();if(typeof DPR!=='undefined')ctx.setTransform(DPR,0,0,DPR,0,0);ctx.translate(-(L.camX||0),0);
  for(const p of L.Ps)if(isPato(p)&&!p.dead){const d=dPos(p,L.t);ctx.save();ctx.translate(d.x,d.y);ctx.scale((p.face||1)*1.6,1.6);duckling({x:0,y:0,vx:1});ctx.restore();}ctx.restore();};
})();
