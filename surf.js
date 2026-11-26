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
function grant(){cfg.derek=true;try{saveCfg();}catch(e){}syncSurf(true);sfx('secret');
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

/* ---------------- blue shots ---------------- */
function blueShot(b,L){const r=Math.max(5,Math.min(b.r||7,26)),sp=Math.hypot(b.vx||0,b.vy||0);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy||0,b.vx||1));
  if(sp>60){ctx.globalAlpha=.45;ell(-r*1.6,0,r*1.6,r*.55,'#5ad1ff',0);ctx.globalAlpha=1;}
  circ(0,0,r+4,'rgba(90,209,255,.35)',0);ell(0,0,r*1.15,r,'#1e7fe0',2.5);ell(r*.25,-r*.3,r*.45,r*.3,'rgba(255,255,255,.85)',0);ctx.restore();}
const _db=drawBullets;drawBullets=function(L){if(!L||!L.bul||!L.bul.some(b=>isSurf(b.own))){_db(L);return;}
  const all=L.bul,mine=[],rest=[];for(const b of all)(isSurf(b.own)&&b.k!=='beam'&&!b.big&&(b.r||8)<=26?mine:rest).push(b);
  for(const b of rest)if(isSurf(b.own)){ctx.save();circ(b.x,b.y,(b.r||8)+8,'rgba(60,170,255,.35)',0);ctx.restore();}
  L.bul=rest;try{_db(L);}finally{L.bul=all;}for(const b of mine)blueShot(b,L);};

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
