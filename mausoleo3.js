'use strict';
/* ================= MAUSOLEOS: more kinds of ghosts and a big one at the end =================
   Ghosts rise out of the floor mist before they move. Later crypts mix in:
   · Zigzag (stripes): weaves from side to side.   · Gemelo (blue, big): splits into two small ones when parried.
   · Parpadeo (sparkly): vanishes and pops up closer to the urn.
   After the last wave the Fantasma Mayor arrives: it needs three parries, and comes back faster each time. */
const MZ_TYPES={mausoleo:['n','n','n','zig'],mausoleo2:['n','n','zig','zig','gem'],mausoleo3:['n','zig','gem','blink'],mausoleo4:['n','zig','gem','blink','blink'],mausoleo5:['n','zig','gem','gem','blink']};
function mzType(L,e){const ts=MZ_TYPES[L.id]||['n'];e.mt=ts[Math.floor(rand()*ts.length)];e.app=0;e.ax=e.x;e.ay=e.y;
  if(e.mt==='gem'){e.sc=1.35;e.r=22;}if(e.mt==='blink')e.bk=1.6+rand()*.8;}
const _makeMausT=makeMaus;
makeMaus=function(id){const L=_makeMausT(id),up=L.update;L.mayor=0;
  L.update=dt=>{const WV=LEVELS[id].waves;
    /* the big ghost comes in before the last wave can be declared won */
    if(!L.mayor&&L.state==='play'&&L.wave===WV.length-1&&L.left<=0&&!L.eb.some(e=>e.maus&&!e.dead)){L.mayor=1;banner(L,'¡EL FANTASMA MAYOR!',1.8);sfx('laugh');shake(L,10);
      spawnEB(L,{k:'shot',x:(rand()<.5?90:W-90),y:170,vx:0,vy:0,r:28,spr:'ghostE',parry:true,harmless:true,maus:true,mayor:3,sc:1.9,spd:95,ph:0,mt:'mayor',app:.3,t2:0});L.total++;L.spawned++;}
    const n0=L.eb.length;up(dt);
    for(let i=n0;i<L.eb.length;i++){const e=L.eb[i];if(e.maus&&!e.mt)mzType(L,e);}
    for(const e of L.eb){if(!e.maus||e.dead||!e.mt)continue;
      if(e.app<1){e.app=Math.min(1,e.app+dt*2.4);e.vx=0;e.vy=0;if(rand()<.3)L.fx.push({k:'smoke',x:e.x+(rand()-.5)*30,y:e.y+18,vx:(rand()-.5)*30,vy:-30,life:.5,max:.5,r:9,col:'#c9d8e0'});continue;}
      const a=Math.atan2(L.urn.y-e.y,L.urn.x-e.x);
      if(e.mt==='zig'){const s=Math.sin(e.t2*4.5+e.ph)*170;e.vx+=-Math.sin(a)*s;e.vy+=Math.cos(a)*s;}
      else if(e.mt==='blink'){e.bk-=dt;if(e.bk<.35)e.fade=e.bk/.35;else e.fade=1;if(e.bk<=0){const d=Math.min(130,dist(e.x,e.y,L.urn.x,L.urn.y)-70);if(d>0){e.x+=Math.cos(a)*d;e.y+=Math.sin(a)*d;}e.bk=1.8+rand()*.6;e.fade=0;smoke(L,e.x,e.y,6);sfx('magic');}}
      else if(e.mt==='mayor'){e.vy+=Math.sin(e.t2*2)*40;}}};
  return L;};
/* parrying: the twin splits, the big ghost needs three */
const _doParryMZ3=doParry;
doParry=function(L,p,o){const keep=o&&o.mayor>1,gem=o&&o.mt==='gem',ox=o?o.x:0,oy=o?o.y:0;_doParryMZ3(L,p,o);
  if(keep){o.dead=false;o.mayor--;o.cool=.6;o.spd*=1.3;o.app=.2;const side=o.x<W/2?-1:1;o.x=side<0?40:W-40;o.y=110;boom(L,ox,oy,50);sfx('hitBig');shake(L,12);pop(L,ox,oy-60,o.mayor===2?'¡UNA MÁS… DOS!':'¡LA ÚLTIMA!',C.gold);}
  if(gem&&L.urn){for(const d of[-1,1]){spawnEB(L,{k:'shot',x:ox+d*26,y:oy-10,vx:0,vy:0,r:15,spr:'ghostE',parry:true,harmless:true,maus:true,spd:(o.spd||140)*1.25,ph:d,mt:'mini',sc:.72,app:.6,t2:0,cool:.25});}L.total+=2;L.spawned+=2;pop(L,ox,oy-40,'¡SE PARTIÓ!',C.parryL);}};
/* drawing: size, the rise from the mist, and a mark for each kind */
const _drawSprMZ3=drawSpr;
drawSpr=function(e,t){if(!e.maus||!e.mt){_drawSprMZ3(e,t);return;}const app=e.app??1,s=(e.sc||1)*(.4+.6*app),fa=e.fade??1;
  if(app<1){ctx.save();ctx.globalAlpha=.6*(1-app);ell(e.x,e.y+22,30,8,'#c9d8e0',0);ctx.restore();}
  ctx.save();ctx.globalAlpha*=Math.max(.15,fa)*(.35+.65*app);ctx.translate(e.x,e.y+(1-app)*24);ctx.scale(s,s);ctx.translate(-e.x,-e.y);_drawSprMZ3(e,t);
  const x=e.x,y=e.y;ctx.lineWidth=2.5;
  if(e.mt==='zig'){ctx.strokeStyle='#7a5aa8';ctx.beginPath();ctx.moveTo(x-12,y-22);ctx.lineTo(x-4,y-30);ctx.lineTo(x+4,y-22);ctx.lineTo(x+12,y-30);ctx.stroke();}
  else if(e.mt==='gem'||e.mt==='mini'){ctx.fillStyle='rgba(110,160,230,.28)';ctx.beginPath();ctx.arc(x,y-4,22,0,TAU);ctx.fill();ctx.strokeStyle='#3a5a8a';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x,y-27);ctx.lineTo(x,y+18);ctx.stroke();ctx.setLineDash([]);}
  else if(e.mt==='blink'){for(let i=0;i<3;i++){const an=t*4+i*2.1;star(x+Math.cos(an)*28,y-6+Math.sin(an)*20,5,2.2,4,t*6);ctx.fillStyle='#fff3b0';ctx.fill();}}
  else if(e.mt==='mayor'){poly([[x-18,y-26],[x-18,y-40],[x-9,y-32],[x,y-46],[x+9,y-32],[x+18,y-40],[x+18,y-26]],'#f2c14e',2.5);for(let i=0;i<(e.mayor||1);i++)circ(x-10+i*10,y+30,4,C.parry,1.5);}
  ctx.restore();};
