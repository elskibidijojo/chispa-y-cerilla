'use strict';
/* ================= ANIMACIONES 2: lots of little moves everywhere (drawing only) =================
   Heroes: turnaround squash, dust while running, pink sparkles while parrying, a low-health "tic" of their own
   (Chispa's bulb flickers, Cerilla's flame shrinks and smokes, Velita sweats wax), and a tiny hop of joy when picking up a coin.
   Bosses breathe and wobble when hit. Enemies jiggle when shot. Coins twinkle. Map buildings bounce when you stand at the door.
   The HP card shakes when you are hurt, and the results grade lands with a stamp. */

/* ---------- heroes ---------- */
const _heroExtra2=heroExtra;
heroExtra=function(L,p,io){const o=_heroExtra2(L,p,io);
  if(p._face!==p.face){p._turnT=L.t;p._face=p.face;}if(L.t-(p._turnT??-9)<.12)o.turn=1-(L.t-p._turnT)/.12;
  if(p.hp===1&&!p.dead&&L.state==='play')o.lowHp=1;if(p.spin>0)o.spinFx=p.spin;
  if(p.type==='plat'&&p.ground&&Math.abs(p.vx)>150&&L.state==='play'){p._dustT=(p._dustT||0)-1/60;if(p._dustT<=0){p._dustT=.16;L.fx.push({k:'puff',x:p.x-p.face*10,y:p.y-4,vx:-p.face*40,vy:-30,life:.35,max:.35,r:5,col:'#e8dcc0'});}}
  const cg=L.coinsGot?L.coinsGot.length:0;if(p._cg!==cg){if(p._cg!=null&&cg>p._cg)p._joyT=L.t;p._cg=cg;}if(L.t-(p._joyT??-9)<.4)o.joy=1-(L.t-p._joyT)/.4;
  return o;};
const _drawHeroB=drawHero;
drawHero=function(o){if(!o.turn&&!o.lowHp&&!o.spinFx&&!o.joy){_drawHeroB(o);return;}const x=o.x,y=o.y,sc=o.scale||1,ch=o.char||'chispa',t=o.anim||0,q=Object.assign({},o);ctx.save();
  if(o.turn){ctx.translate(x,y);ctx.scale(1-o.turn*.25,1+o.turn*.08);ctx.translate(-x,-y);}
  if(o.joy){const h=Math.sin(o.joy*Math.PI)*14*sc;ctx.translate(0,-h);q.armsUp=true;}
  if(o.lowHp){if(ch==='chispa')q.flameK=Math.sin(t*37)>.6?.2:.9;else if(ch==='cerilla')q.flameK=.55+Math.sin(t*23)*.1;}
  _drawHeroB(q);ctx.restore();
  if(o.spinFx){ctx.save();for(let i=0;i<5;i++){const a=o.spinFx*30+i*TAU/5,r=34*sc;star(x+Math.cos(a)*r,y-44*sc+Math.sin(a)*r,5*sc,2*sc,4,a);ctx.fillStyle=C.parryL;ctx.fill();}ctx.restore();}
  if(o.lowHp){ctx.save();const k=(t*.9)%1;ctx.globalAlpha=1-k;if(ch==='cerilla'){circ(x+6*sc,y-120*sc-k*30*sc,(4+k*6)*sc,'#8a8a96',0);}
    else if(ch==='velita'){ell(x+(o.face||1)*14*sc,y-60*sc+k*24*sc,2.5*sc,4*sc,'#f4ead6',1.5);}else{ell(x+(o.face||1)*18*sc,y-80*sc+k*14*sc,3*sc,4.5*sc,'#8ecbe6',1.5);}ctx.restore();}};

/* ---------- bosses breathe, and wobble when hit ---------- */
for(const id in LEVELS){const d=LEVELS[id];if(!d.phases||d.kind==='run'||d.kind==='maus')continue;const c=d.create;
  d.create=(...a)=>{const L=c(...a);if(!L||!L.boss||!L.drawWorld)return L;const B=L.boss,dw=L.drawWorld;
    L.drawWorld=()=>{const br=Math.sin(B.t*2.2)*.012,hit=B.flash>0?Math.sin(L.t*90)*2.5:0,ax=B.x,ay=B.y;ctx.save();ctx.translate(ax+hit,ay);ctx.scale(1-br*.6,1+br);ctx.translate(-ax,-ay);dw();ctx.restore();};return L;};}

/* ---------- enemies jiggle when shot ---------- */
const _drawEnemyJ=drawEnemy;
drawEnemy=function(e,t){if(!(e.flash>0)||e.ai==='mini'){_drawEnemyJ(e,t);return;}ctx.save();const k=e.flash/.06;ctx.translate(e.x,e.y+e.r);ctx.scale(1+k*.14,1-k*.12);ctx.translate(-e.x,-e.y-e.r);_drawEnemyJ(e,t);ctx.restore();};

/* ---------- coins twinkle ---------- */
if(typeof drawRunWorld==='function'){const _drw=drawRunWorld;drawRunWorld=function(L,th){_drw(L,th);if(!L.coins)return;const t=L.t;
  for(const c of L.coins){if(c.got||c.was||c.x<L.camX-40||c.x>L.camX+W+40)continue;const k=(t*1.3+c.x*.01)%1.6;if(k<.5){const a=k/.5;ctx.save();ctx.globalAlpha=Math.sin(a*Math.PI);star(c.x+10,c.y-12,7*Math.sin(a*Math.PI)+1,2,4,t*3);ctx.fillStyle='#fff7d0';ctx.fill();ctx.restore();}}};}

/* ---------- map: the building you stand at bounces ---------- */
const _drawBldJ=drawBld;
drawBld=function(n,t,night){if(MAPS.near!==n){_drawBldJ(n,t,night);return;}const b=Math.abs(Math.sin(t*5))*.04;ctx.save();ctx.translate(n.x,n.y);ctx.scale(1-b*.5,1+b);ctx.translate(-n.x,-n.y);_drawBldJ(n,t,night);ctx.restore();
  ctx.save();ctx.globalAlpha=.7+.3*Math.sin(t*6);for(const d of[-1,1])star(n.x+d*((n.ob||20)+22),n.y-30-Math.abs(Math.sin(t*3+d))*10,6,2.5,4,t*2);ctx.fillStyle=C.gold;ctx.fill();ctx.restore();};

/* ---------- HUD: the HP card shakes and flashes when you are hurt ---------- */
const _drawHUDJ=drawHUD;
drawHUD=function(L){_drawHUDJ(L);if(L.state==='results')return;L.Ps.forEach((p,i)=>{if(p._hpSeen!=null&&p.hp<p._hpSeen)p._hpHit=L.t;p._hpSeen=p.hp;const k=L.t-(p._hpHit??-9);if(k>.45)return;
  const R=i===1,hx=R?W-150:i===2?W/2-110:58,y=H-58,a=1-k/.45;ctx.save();ctx.globalAlpha=a;ctx.lineWidth=3;ctx.strokeStyle=C.rust;for(let j=0;j<8;j++){const an=j*TAU/8,r1=40+k*60,r2=52+k*80;line(hx+46+Math.cos(an)*r1,y+18+Math.sin(an)*r1*.5,hx+46+Math.cos(an)*r2,y+18+Math.sin(an)*r2*.5,3,C.rust);}
  txt('¡AY!',hx+46,y-30-k*30,22,C.rust,C.ink);ctx.restore();});};

/* ---------- results: the grade lands like a rubber stamp ---------- */
const _levelOverlayJ=levelOverlay;
levelOverlay=function(L){_levelOverlayJ(L);if(L.state!=='results'||!L.result)return;const r=L.result;if(r.shown>=6&&r._st==null){r._st=L.t;sfx('stamp');}if(r._st==null)return;const k=L.t-r._st;if(k>.6)return;
  ctx.save();ctx.translate(W/2+170,H/2-30);ctx.globalAlpha=1-k/.6;for(let i=0;i<10;i++){const a=i*TAU/10;line(Math.cos(a)*(50+k*120),Math.sin(a)*(50+k*120),Math.cos(a)*(64+k*160),Math.sin(a)*(64+k*160),4,C.gold);}
  if(k<.15){ctx.globalAlpha=1;ctx.rotate(-.12);ctx.scale(1+(1-k/.15)*1.4,1+(1-k/.15)*1.4);ctx.globalAlpha=.5;txt(r.grade,0,0,86,C.rust);}ctx.restore();};
