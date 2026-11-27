/* brasa.js — new weapon "Brasa Rastreadora" (island 3, 4 coins).
   Red embers that chase the enemy on their own, like the Luciérnaga, but much stronger (~16 damage/second).
   EX: a little red sun that hovers in front of you and fires seeking rays at the enemy (~20 damage in total).
   Parry your own sun (jump into it and press JUMP again, like any pink thing): every 3 sun parries give +1 heart, and the sun
   turns into a bomb that flies into the enemy for 35 damage. Deterministic (online play stays in sync). */
(function(){
const RED='#e8402e',RED2='#ff8a5a';
function drawEmber(b){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ctx.globalAlpha=.4;ell(-10,0,12,4,RED2,0);ctx.globalAlpha=1;circ(0,0,b.r+3,'rgba(255,90,60,.35)',0);ell(0,0,b.r*1.2,b.r,RED,2);ell(1,-1,b.r*.45,b.r*.3,'#ffd0a0',0);ctx.restore();}
function drawSun(b,L){const t=L?L.t:0,r=b.bomb?20:26;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(t*3);for(let i=0;i<10;i++){ctx.rotate(TAU/10);poly([[r-2,-6],[r+12+Math.sin(t*12+i)*3,0],[r-2,6]],RED2,2);}ctx.restore();
  circ(b.x,b.y,r+8,'rgba(255,80,60,.25)',0);circ(b.x,b.y,r,RED,3);circ(b.x-r*.3,b.y-r*.3,r*.3,'#ffb08a',0);
  if(!b.bomb){ctx.lineWidth=3;ctx.strokeStyle='#ff7ac8';ctx.setLineDash([6,5]);ctx.beginPath();ctx.arc(b.x,b.y,r+14,0,TAU);ctx.stroke();ctx.setLineDash([]);}
  else{ctx.globalAlpha=.5;for(let i=1;i<4;i++)circ(b.x-b.vx*.02*i,b.y-b.vy*.02*i,r-i*3,RED2,0);ctx.globalAlpha=1;}}
WEAPONS.brasa={name:'Brasa Rastreadora',price:4,isl:3,desc:'Brasas rojas que persiguen solas al enemigo. Daño: Normal.',exd:'EX: un pequeño sol rojo que dispara rayos al enemigo. ¿Y si le haces parry…?',
  fire(L,p,h,ax,ay){p.cool=.16;B_(L,p,{x:h.x,y:h.y,vx:ax*680,vy:ay*680,r:7,dmg:2.56,life:1.9,k:'brasa',homing:6,draw:drawEmber});},
  ex(L,p,h,ax,ay){for(const o of L.bul)if(o.k==='solrojo'&&o.own===p&&!o.bomb&&o.life>0){o.life=0;for(let i=0;i<8;i++){const a=i/8*TAU;L.fx.push({k:'puff',x:o.x+Math.cos(a)*10,y:o.y+Math.sin(a)*10,vx:Math.cos(a)*140,vy:Math.sin(a)*140,life:.4,max:.4,r:9,col:RED2});}puff(L,o.x,o.y,4,'#ffb08a');sfx('pop');}
    const s=B_(L,p,{x:h.x+ax*60,y:h.y+ay*40-20,vx:ax*90+.001,vy:-30,r:26,dmg:0,life:2.6,k:'solrojo',pierce:true,noGain:true,draw:drawSun,tk:.25,n:0});
    s.upd=(b,L,dt)=>{if(b.bomb)return;b.vx*=Math.max(0,1-dt*2);b.vy*=Math.max(0,1-dt*2);b.tk-=dt;if(b.tk<=0&&b.n<8){b.tk=.28;b.n++;const t=nearestEnt(L,b.x,b.y);let a=0;if(t){const c=nearPt(t,b.x,b.y);a=Math.atan2(c.y-b.y,c.x-b.x);}
      B_(L,p,{x:b.x,y:b.y,vx:Math.cos(a)*760,vy:Math.sin(a)*760,r:9,dmg:2.5,life:1.4,k:'brasa',homing:8,noGain:true,draw:drawEmber});sfx('fire');}};}};
if(typeof SHOTS!=='undefined')SHOTS.brasa=SHOTS.luciernaga||SHOTS.chispa;
if(typeof refreshShopTabs==='function')refreshShopTabs();
/* parry your own sun -> +1 heart and it becomes a bomb */
const _pu=platUpdate;platUpdate=function(L,p,dt,I){const r=_pu(L,p,dt,I);if(!p||p.dead||!(p.parryWin>0)||p.ground||!L||!L.bul)return r;const c=pCenter(p),R=(typeof reachOf==='function'?reachOf(p):44)+20;
  const s=L.bul.find(b=>b.k==='solrojo'&&!b.bomb&&b.own===p&&b.life>0&&Math.hypot(b.x-c.x,b.y-c.y)<R);
  if(s){s.bomb=true;s.life=2.5;s.dmg=35;s.pierce=false;s.homing=9;const t=nearestEnt(L,s.x,s.y);let a=0;if(t){const cc=nearPt(t,s.x,s.y);a=Math.atan2(cc.y-s.y,cc.x-s.x);}s.vx=Math.cos(a)*700;s.vy=Math.sin(a)*700;s.upd=null;
    p.parryWin=0;p.parryTried=false;p.vy=-800;p.ground=false;p.airDash=true;p.inv=Math.max(p.inv,.6);L.freeze=.07;L.flash=Math.max(L.flash||0,.08);sfx('parry');
    p._solP=(p._solP||0)+1;if(p._solP>=3){p._solP=0;p.hp=Math.min(p.hp+1,(p.maxHp||3)+2);sfx('coin');pop(L,p.x,p.y-110,'¡+1 ♥!','#ff7ac8');}else pop(L,p.x,p.y-110,'☀ '+p._solP+'/3','#ff7ac8');}return r;};
const _ii=itemIcon;itemIcon=function(id,x,y,t){if(id!=='brasa'){_ii(id,x,y,t);return;}ctx.save();ctx.translate(x,y);for(let i=0;i<3;i++){const a=t*2+i*2.1;drawEmber({x:Math.cos(a)*12,y:Math.sin(a)*8,vx:-Math.sin(a),vy:Math.cos(a),r:6});}ctx.restore();};
})();
