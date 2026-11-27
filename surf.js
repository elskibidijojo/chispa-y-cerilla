/* surf.js — secret skin "Surfista" (code: type DEREK in capital letters on the title screen, the map,
   the shop or the equipment screen).
   - Tanned look for Chispa, Cerilla and Velita: sunglasses, sun-bleached hair, flower necklace and a surfboard on the back.
   - Every shot is ocean blue.
   - Every Súper does +10 % damage.
   - Extra surfer animations: riding a wave when dashing, splashes when landing, droplets when running,
     a big wave behind you when you throw a Súper, and the board bobbing when you stand still. */
(function(){
SKINS.skin_surf={name:'Surfista',price:0,isl:1,secret:true,acc:'surf',trail:'spark',tcol:'#5ad1ff',
  desc:'Secreta (código DEREK). Bronceado, gafas de sol, collar de flores y tabla de surf. Balas azules y +10 % de daño en las Súper.'};
if(typeof SKIN_PAL!=='undefined')SKIN_PAL.skin_surf={glass:'#f2c48e',steel:'#b0703e',match:'#c98a52',matchHead:'#e8562e'};
if(typeof refreshShopTabs==='function'){const _r=refreshShopTabs;refreshShopTabs=function(){_r();try{for(const t of SHOP_TABS){const i=t.ids.indexOf('skin_surf');if(i>=0)t.ids.splice(i,1);}}catch(e){}};refreshShopTabs();}
const isSurf=p=>p&&p.eq&&p.eq.skin==='skin_surf';

/* ---------------- the code ---------------- */
const WORD='DEREK';let buf='';
function grant(){cfg.derek=true;try{saveCfg();}catch(e){}syncSurf(true);sfx('magic');sfx('coin');
  const msg='¡SECRETO! Skin Surfista desbloqueada 🏄';if(scene==='title'&&typeof TI!=='undefined'){TI.msg=msg;TI.msgT=3.5;}
  else if(typeof ACHQ!=='undefined')ACHQ.push({a:{name:'¡Skin Surfista desbloqueada!',coins:0},t:0});}
function syncSurf(equip){if(!cfg.derek||typeof save==='undefined'||!save||!save.owned)return;let ch=false;if(!save.owned.includes('skin_surf')){save.owned.push('skin_surf');ch=true;equip=true;}
  if(equip&&save.eq)for(const e of save.eq)if(e){e.skin='skin_surf';ch=true;}if(ch)try{persist();}catch(e){}}
const _ss=syncSecrets;syncSecrets=function(){_ss.apply(this,arguments);syncSurf(false);};
addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.key.length!==1)return;if(!['title','map','shop','equip','slots'].includes(scene)){buf='';return;}
  buf=(buf+e.key).slice(-WORD.length);if(buf===WORD){buf='';grant();}});

/* ---------------- +10 % on every Súper (simulation, deterministic) ---------------- */
const DUR={chispazo:1.5,lluvia:4,iman:3,tormenta:3.5,escudo:4.5,remolino:5,fuegos:4,martillo:2.2,clon:6.6,helada:3.8,meteoro:4.5,tren:3.2,campana:4,lupa:3.8,dragon:4.5,piano:2.2,arcoiris:3.4,globos:5.5,fantasmas:5.5,burbujon:5.6,nevada:3.8};
const _st=startSuper;startSuper=function(L,p){const r=_st(L,p);if(isSurf(p)&&L){p._supEnd=(L.t||0)+(DUR[p.superK]||4);p._waveT=1.4;}return r;};
const _dm=dmgM;dmgM=function(p){const m=_dm(p);if(isSurf(p)&&typeof LV!=='undefined'&&LV&&p._supEnd>(LV.t||0))return m*1.1;return m;};

/* ---------------- ocean-themed shots: every weapon and Súper gets its own sea shape (only with this skin) ---------------- */
const BL='#1e7fe0',BL2='#5ad1ff',FOAM='#fbf6ea';
function blueShot(b,L){const r=Math.max(5,Math.min(b.r||7,26)),sp=Math.hypot(b.vx||0,b.vy||0);
  if(sp>60){ctx.globalAlpha=.45;ell(-r*1.6,0,r*1.6,r*.55,BL2,0);ctx.globalAlpha=1;}
  circ(0,0,r+4,'rgba(90,209,255,.35)',0);ell(0,0,r*1.15,r,BL,2.5);ell(r*.25,-r*.3,r*.45,r*.3,'rgba(255,255,255,.85)',0);}
function starfish(r,col,t){ctx.save();ctx.rotate(t);ctx.beginPath();for(let i=0;i<10;i++){const a=i/10*TAU-Math.PI/2,rr2=i%2?r*.45:r;ctx.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2);}ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
  for(let i=0;i<5;i++){const a=i/5*TAU-Math.PI/2;circ(Math.cos(a)*r*.55,Math.sin(a)*r*.55,1.6,'#fff3c8',0);}circ(0,0,2.2,'#fff3c8',0);ctx.restore();}
function drop(r){ctx.beginPath();ctx.moveTo(r*1.5,0);ctx.quadraticCurveTo(r*.2,-r*1.05,-r*.7,-r*.6);ctx.arc(-r*.4,0,r*.75,-Math.PI/2-.3,Math.PI/2+.3,true);ctx.quadraticCurveTo(r*.2,r*1.05,r*1.5,0);ctx.fillStyle=BL;ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle=C.ink;ctx.stroke();ell(-r*.2,-r*.35,r*.35,r*.2,'rgba(255,255,255,.85)',0);}
function fish(r,col,t){const w=Math.sin(t*20)*.35;poly([[-r*.9,0],[-r*1.7,-r*.7+w*r],[-r*1.5,0],[-r*1.7,r*.7+w*r]],col,2);ell(0,0,r*1.05,r*.65,col,2.5);circ(r*.45,-r*.15,r*.2,'#fff',1.2);circ(r*.5,-r*.15,r*.09,C.ink,0);line(-r*.2,-r*.5,-r*.2,r*.5,1.5,'rgba(20,13,8,.4)');}
function shell(r,col){ctx.beginPath();ctx.moveTo(-r,r*.6);ctx.quadraticCurveTo(-r*1.1,-r*.9,0,-r);ctx.quadraticCurveTo(r*1.1,-r*.9,r,r*.6);ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle=C.ink;ctx.stroke();
  for(let i=-2;i<=2;i++)line(0,r*.55,i*r*.4,-r*.75,1.4,'rgba(20,13,8,.45)');rr(-r*.35,r*.45,r*.7,r*.35,2,col,2);}
function urchin(r,t){ctx.save();ctx.rotate(t);for(let i=0;i<12;i++){const a=i/12*TAU;line(Math.cos(a)*r*.5,Math.sin(a)*r*.5,Math.cos(a)*r*1.35,Math.sin(a)*r*1.35,2.2,'#3a2450');}ctx.restore();circ(0,0,r*.7,'#6a3a8a',2.2);}
function jelly(r,t){ctx.save();ctx.rotate(Math.PI/2);for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*r*.35,r*.2);ctx.quadraticCurveTo(i*r*.35+Math.sin(t*10+i)*4,r*.9,i*r*.35,r*1.5);ctx.lineWidth=2;ctx.strokeStyle='#c08aff';ctx.stroke();}
  ctx.beginPath();ctx.arc(0,r*.2,r,Math.PI,0);ctx.closePath();ctx.fillStyle='rgba(200,150,255,.85)';ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle=C.ink;ctx.stroke();circ(-r*.35,-r*.1,1.6,C.ink,0);circ(r*.35,-r*.1,1.6,C.ink,0);ctx.restore();}
function beachball(r,t){ctx.save();ctx.rotate(t);const cs=['#e8562e','#fbf6ea','#1e7fe0','#ffd65a','#fbf6ea','#3aa860'];for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,i/6*TAU,(i+1)/6*TAU);ctx.closePath();ctx.fillStyle=cs[i];ctx.fill();}ctx.restore();circ(0,0,r,null,2.5);circ(0,0,r*.2,'#fff',1);}
function coconut(r,t){ctx.save();ctx.rotate(t);circ(0,0,r,'#7a4a24',2.5);for(const [x,y] of[[-r*.3,-r*.2],[r*.25,-r*.25],[0,r*.25]])circ(x,y,r*.15,'#3a2010',0);ctx.restore();}
function pearl(r){circ(0,0,r+3,'rgba(255,240,250,.35)',0);circ(0,0,r,'#f6eef8',2.2);ell(-r*.3,-r*.35,r*.35,r*.22,'#fff',0);}
function puffer(r,t){const k=1+Math.sin(t*12)*.08;ctx.save();ctx.scale(k,k);for(let i=0;i<10;i++){const a=i/10*TAU;line(Math.cos(a)*r*.8,Math.sin(a)*r*.8,Math.cos(a)*r*1.25,Math.sin(a)*r*1.25,2,C.ink);}circ(0,0,r,'#ffd65a',2.5);circ(r*.4,-r*.2,r*.2,'#fff',1);circ(r*.45,-r*.2,r*.1,C.ink,0);ell(r*.75,r*.15,r*.15,r*.1,'#e8562e',0);ctx.restore();}
function shark(r,t){poly([[-r*1.1,0],[-r*1.9,-r*.8],[-r*1.6,0],[-r*1.9,r*.6]],'#7a8fa8',2.5);ctx.beginPath();ctx.moveTo(r*1.4,r*.05);ctx.quadraticCurveTo(r*.4,-r*.8,-r*1.2,0);ctx.quadraticCurveTo(r*.2,r*.7,r*1.4,r*.05);ctx.fillStyle='#8aa0b8';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
  poly([[-r*.1,-r*.45],[-r*.5,-r*1.2],[r*.35,-r*.5]],'#7a8fa8',2.2);ell(r*.2,r*.2,r*.7,r*.22,'#eef4f8',0);circ(r*.85,-r*.12,r*.1,C.ink,0);for(let i=0;i<4;i++)poly([[r*.6+i*r*.15,r*.15],[r*.67+i*r*.15,r*.32],[r*.74+i*r*.15,r*.15]],'#fff',1);}
function ring(r,t){ctx.save();ctx.rotate(t);ctx.lineWidth=r*.55;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(0,0,r*.72,i*Math.PI/2,(i+1)*Math.PI/2);ctx.strokeStyle=i%2?'#fbf6ea':'#e8562e';ctx.stroke();}ctx.restore();circ(0,0,r,null,2.2);circ(0,0,r*.45,null,2.2);}
function minisurf(r,t){ctx.save();ctx.rotate(t);ell(0,0,r*1.4,r*.42,FOAM,2.5);ctx.fillStyle=BL;ctx.fillRect(-r*1.2,-r*.08,r*2.4,r*.16);ctx.restore();}
function wave(r){ctx.beginPath();ctx.moveTo(-r*.8,r);ctx.quadraticCurveTo(-r*.6,-r*.9,r*.5,-r*.8);ctx.quadraticCurveTo(-r*.1,-r*.4,r*.3,r);ctx.closePath();ctx.fillStyle='rgba(30,127,224,.75)';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();for(let i=0;i<4;i++)circ(r*.4-i*r*.3,-r*.8+i*r*.12,r*.12,'#fff',1);}
function spiralShell(r,t){ctx.save();ctx.rotate(t*2);ctx.beginPath();for(let a=0;a<TAU*2.2;a+=.3){const rr2=r*a/(TAU*2.2);ctx.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2);}ctx.lineWidth=r*.55;ctx.strokeStyle='#f2a8c8';ctx.stroke();ctx.lineWidth=1.6;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
/* weapon / Súper bullet kind -> sea creature */
const SEA={
  chispa:(b,r,t)=>drop(r), conv:(b,r,t)=>drop(r*.9), agua:(b,r,t)=>{drop(r*1.15);circ(-r*1.4,0,r*.35,'#fff',1);},
  bume:(b,r,t)=>starfish(r*1.25,'#ff8a5a',t*12), shuri:(b,r,t)=>starfish(r*1.1,'#ffb35a',t*16),
  abanico:(b,r,t)=>shell(r*1.1,'#ffc8d8'), palomitas:(b,r,t)=>shell(r*1.1,'#ffe2b0'),
  luci:(b,r,t)=>jelly(r*.95,t), luciB:(b,r,t)=>fish(r*1.05,BL2,t),
  rebote:(b,r,t)=>beachball(r,t*6), canica:(b,r,t)=>pearl(r), varita:(b,r,t)=>pearl(r*.9),
  tack:(b,r,t)=>urchin(r,t*4), bubble:(b,r,t)=>{circ(0,0,r,'rgba(200,240,255,.5)',2.2);fish(r*.45,'#ffb35a',t);},
  bomba:(b,r,t)=>coconut(r,t*5), cohete:(b,r,t)=>coconut(r,t*5), petardo:(b,r,t)=>puffer(r,t),
  part:(b,r,t)=>fish(r,'#ffd65a',t), bat:(b,r,t)=>fish(r*1.1,'#ff8a5a',t), twist:(b,r,t)=>spiralShell(r*1.2,t),
  cometon:(b,r,t)=>shark(r*.95,t), yoyo:(b,r,t)=>ring(r,t*8), baston:(b,r,t)=>minisurf(r,t*6),
  llama:(b,r,t)=>{circ(0,0,r,'rgba(90,209,255,.55)',0);for(let i=0;i<3;i++)circ((i-1)*r*.4,Math.sin(t*20+i)*r*.3,r*.35,'#fff',0);},
  onda:(b,r,t)=>wave(r*.8), ex:(b,r,t)=>wave(r*1.4), magnet:(b,r,t)=>{circ(0,0,r,'rgba(30,127,224,.6)',3);for(let i=0;i<5;i++)circ(Math.cos(t*4+i)*r*.5,Math.sin(t*4+i)*r*.5,r*.15,'#fff',0);},
  globito:(b,r,t)=>puffer(r*.9,t), fantasma:(b,r,t)=>jelly(r,t), bolanieve:(b,r,t)=>pearl(r), shock:(b,r,t)=>wave(r)};
/* big Súper props (piano, train, dragon…) keep their shape but turn ocean-colored */
const OCEANTINT=new Set(['tornado','mallet','tren','campana','lupa','dragon','piano','arcoiris','nevadaCtl','clone','rayo']);
const SPIN=new Set(['bume','shuri','rebote','tack','bomba','cohete','yoyo','baston','twist','petardo','canica','varita','magnet']);
function drawSea(b,L){const f=SEA[b.k];const r=Math.max(4,Math.min(b.r||7,40));ctx.save();ctx.translate(b.x,b.y);ctx.lineJoin='round';ctx.lineCap='round';
  if(!SPIN.has(b.k))ctx.rotate(Math.atan2(b.vy||0,b.vx||1));const sp=Math.hypot(b.vx||0,b.vy||0);
  if(sp>80&&!SPIN.has(b.k)){ctx.save();ctx.globalAlpha=.35;ell(-r*1.8,0,r*1.6,r*.45,BL2,0);ctx.restore();}
  if(f)f(b,r,L.t);else blueShot(b,L);ctx.restore();}
function waterBeam(bm,L){const x0=bm.x,x1=bm.dir>0?L.camX+W+40:L.camX-40,len=Math.abs(x1-x0),hh=30+Math.sin(L.t*30)*4;ctx.save();ctx.globalAlpha=Math.min(1,bm.t*4);
  ctx.beginPath();ctx.moveTo(x0,bm.y-hh);for(let x=0;x<=len;x+=20)ctx.lineTo(x0+bm.dir*x,bm.y-hh+Math.sin(x*.06-L.t*30)*7);for(let x=len;x>=0;x-=20)ctx.lineTo(x0+bm.dir*x,bm.y+hh+Math.sin(x*.06-L.t*30+2)*7);ctx.closePath();
  ctx.fillStyle='rgba(30,127,224,.8)';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();ctx.fillStyle='rgba(160,230,255,.85)';ctx.fillRect(Math.min(x0,x1),bm.y-hh*.35,len,hh*.7);
  for(let i=0;i<14;i++){const x=x0+bm.dir*((i*73+L.t*900)%len);circ(x,bm.y+Math.sin(i*2.3+L.t*9)*hh*.7,3+i%3*2,'#fff',1.5);}
  for(let i=0;i<5;i++){const x=x0+bm.dir*((i*190+L.t*500)%len);ctx.save();ctx.translate(x,bm.y+Math.sin(i+L.t*5)*12);ctx.scale(bm.dir,1);fish(9,i%2?'#ffd65a':'#ff8a5a',L.t+i);ctx.restore();}ctx.restore();}
const _db=drawBullets;drawBullets=function(L){const anyB=L&&L.bul&&L.bul.some(b=>isSurf(b.own)),anyM=L&&L.beams&&L.beams.some(bm=>isSurf(bm.own));if(!anyB&&!anyM){_db(L);return;}
  const all=L.bul,beams=L.beams,mine=[],tint=[],rest=[];for(const b of all){if(!isSurf(b.own)){rest.push(b);continue;}if(OCEANTINT.has(b.k))tint.push(b);else if(SEA[b.k]||(!b.draw&&(b.r||8)<=26))mine.push(b);else tint.push(b);}
  const myBeams=beams.filter(bm=>isSurf(bm.own));L.bul=rest;L.beams=beams.filter(bm=>!isSurf(bm.own));try{_db(L);}finally{L.bul=all;L.beams=beams;}
  for(const bm of myBeams)waterBeam(bm,L);
  if(tint.length){const saveB=L.bul,saveM=L.beams,sT=L.tacks,sA=L.arcs;L.bul=tint;L.beams=[];L.tacks=[];L.arcs=[];ctx.save();ctx.filter='hue-rotate(175deg) saturate(1.3)';try{_db(L);}finally{ctx.restore();L.bul=saveB;L.beams=saveM;L.tacks=sT;L.arcs=sA;}}
  for(const b of mine)drawSea(b,L);};

/* ---------------- looks ---------------- */
const _dsa=drawSkinAcc;drawSkinAcc=function(o,ch,fy,f,ex){const sk=SKINS[o.skin];if(!sk||sk.acc!=='surf'){_dsa(o,ch,fy,f,ex);return;}
  ctx.save();ctx.filter='none';ctx.lineJoin='round';ctx.lineCap='round';const top=fy-(ch==='cerilla'?20:ch==='velita'?22:26),t=(typeof LV!=='undefined'&&LV?LV.t:performance.now()/1000);
  const by=fy+(ch==='chispa'?26:ch==='velita'?24:18),bob=o.run||o.air||o.dash?0:Math.sin(t*3)*2;
  /* surfboard on the back */
  ctx.save();ctx.translate(-f*22,by+4+bob);ctx.rotate(-f*.25);ell(0,0,9,34,'#fbf6ea',2.5);ctx.fillStyle='#1e7fe0';ctx.fillRect(-2.5,-30,5,60);ell(0,-22,4,3,'#e8562e',0);ctx.restore();
  /* sun-bleached hair */
  if(ch!=='velita')for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*6-4,top+4);ctx.quadraticCurveTo(i*7+f*4,top-12-Math.abs(i)*-2,i*6+f*7,top-2);ctx.lineTo(i*6+3,top+4);ctx.closePath();ctx.fillStyle='#ffd65a';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();}
  /* sunglasses */
  const gx=ex-2*f;line(gx-14*f,fy-2,gx+16*f,fy-2,2.5);rr(gx-13*f-(f<0?-0:0)-(f>0?0:12),fy-6,12,10,4,'#14161e',2);rr(gx+3*f-(f>0?0:12),fy-6,12,10,4,'#14161e',2);
  ctx.globalAlpha=.85;line(gx-10*f,fy-3,gx-6*f,fy-5,2,'#9fe8ff');line(gx+6*f,fy-3,gx+10*f,fy-5,2,'#9fe8ff');ctx.globalAlpha=1;
  /* flower necklace */
  const cols=['#ff5a8a','#ffd65a','#ff8a3a','#ffffff','#ff5a8a','#c08aff','#ffd65a'];for(let i=0;i<7;i++){const a=Math.PI*(.15+.7*i/6),x=Math.cos(a)*16,y=by-4+Math.sin(a)*7;for(let k=0;k<5;k++){const aa=k/5*TAU+t;circ(x+Math.cos(aa)*3,y+Math.sin(aa)*3,2.6,cols[i],1);}circ(x,y,1.6,'#ffd65a',0);}
  ctx.restore();};

/* extra surfer animations (drawing only) */
const _dh=drawHero;drawHero=function(o){if(!o||o.skin!=='skin_surf'||o.scale){_dh(o);return;}const t=(typeof LV!=='undefined'&&LV?LV.t:0);
  if(o.dash){ctx.save();ctx.translate(o.x,o.y);const f=o.face||1;ctx.beginPath();ctx.moveTo(-f*70,4);ctx.quadraticCurveTo(-f*40,-34,-f*6,-30);ctx.quadraticCurveTo(-f*24,-14,f*20,4);ctx.closePath();ctx.fillStyle='rgba(30,127,224,.75)';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
    for(let i=0;i<5;i++)circ(-f*(14+i*12),-28+i*5+Math.sin(t*20+i)*3,4,'#fff',1.5);ell(0,4,30,6,'#fbf6ea',2.5);ctx.restore();}
  _dh(o);
  if(o.land>0||(o.run&&Math.floor(t*10)%3===0)){ctx.save();ctx.translate(o.x,o.y);const n=o.land>0?6:2,k=o.land>0?o.land:.15;for(let i=0;i<n;i++){const a=Math.PI+(i+.5)/n*Math.PI,s=26*(1-k*2);circ(Math.cos(a)*s,-4+Math.sin(a)*s*.6,3,'#5ad1ff',1.5);}ctx.restore();}};

/* the big wave behind you when you throw a Súper, plus an "¡ALOHA!" */
const _dl=drawLevel;drawLevel=function(L){_dl.apply(this,arguments);if(!L||!L.Ps)return;for(const p of L.Ps){if(!isSurf(p)||!(p._waveT>0)||p.dead)continue;
  const k=1-p._waveT/1.4;ctx.save();if(typeof DPR!=='undefined')ctx.setTransform(DPR,0,0,DPR,0,0);ctx.translate(-(L.camX||0),0);ctx.globalAlpha=Math.min(1,p._waveT*1.5);
  const x0=p.x-p.face*120+p.face*k*260,yb=GROUND;ctx.beginPath();ctx.moveTo(x0-p.face*200,yb);ctx.quadraticCurveTo(x0-p.face*60,yb-200,x0+p.face*40,yb-170);ctx.quadraticCurveTo(x0,yb-120,x0+p.face*80,yb);ctx.closePath();
  ctx.fillStyle='rgba(30,127,224,.55)';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();for(let i=0;i<8;i++)circ(x0+p.face*(40-i*16),yb-170+i*10,6,'#fff',2);
  btxt('¡ALOHA!',p.x,p.y-120-k*20,26,'#5ad1ff','center',900);ctx.restore();}};
const _pt=ptimers;ptimers=function(p,dt){_pt(p,dt);if(p&&p._waveT>0)p._waveT-=dt;};
})();
