'use strict';
/* ================= ESTILO: old-cinema dressing for the menus =================
   · The title screen sits between red theatre curtains with a fringed valance and two spotlights.
   · The pause menu is a little vintage card: ornate double border, the level's name, coins found, and the hero idling in a corner.
   · A pointing glove marks the chosen option. */
function curtainSide(x0,w,dir,t){ctx.save();const g=ctx.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,'#5a1418');g.addColorStop(.5,'#9a2a2a');g.addColorStop(1,'#5a1418');
  ctx.beginPath();ctx.moveTo(x0,0);const edge=x0+(dir>0?w:0);for(let y=0;y<=H;y+=18)ctx.lineTo(edge+dir*Math.sin(y*.03+t*1.2)*5-dir*(y>H*.6?(y-H*.6)*.12:0),y);ctx.lineTo(x0+(dir>0?0:w),H);ctx.lineTo(x0+(dir>0?0:w),0);ctx.closePath();
  ctx.fillStyle=g;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();ctx.clip();for(let i=1;i<5;i++){const x=x0+i*w/5;ctx.beginPath();ctx.moveTo(x,0);for(let y=0;y<=H;y+=24)ctx.lineTo(x+Math.sin(y*.03+t+i)*3,y);ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.25)';ctx.stroke();}
  ctx.restore();const tx=x0+(dir>0?w*.75:w*.25),ty=H*.62;rr(tx-14,ty-6,28,12,5,'#d9a441',2.5);circ(tx,ty+14,7,'#d9a441',2.5);}
function drawValance(t){ctx.save();ctx.fillStyle='#7a1f22';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.lineTo(W,30);for(let x=W;x>=0;x-=48)ctx.quadraticCurveTo(x-24,52,x-48,30);ctx.closePath();ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
  for(let x=0;x<=W;x+=48){circ(x+24,44,5,'#d9a441',2);line(x+24,49,x+24,58,2,'#d9a441');}ctx.restore();}
const _drawTitleE=drawTitle;
drawTitle=function(){_drawTitleE();const t=TI.t;ctx.save();ctx.globalCompositeOperation='lighter';for(const [x,d] of[[150,1],[W-150,-1]]){const a=.08+.03*Math.sin(t*2+d);ctx.fillStyle=`rgba(255,240,200,${a})`;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(W/2+d*-40-160,H);ctx.lineTo(W/2+d*-40+160,H);ctx.closePath();ctx.fill();}ctx.restore();
  curtainSide(0,132,1,t);curtainSide(W-132,132,-1,t);drawValance(t);};

/* the pointing glove */
function glovePointer(x,y,t){const b=Math.sin(t*8)*4;ctx.save();ctx.translate(x+b,y);glove(0,0,11);rr(10,-5,22,10,5,'#fff',2.5);ctx.restore();}
/* ornate double-ruled card with corner curls */
function fancyCard(x,y,w,h){card(x,y,w,h,'#f3e6c8',4,10);rr(x+9,y+9,w-18,h-18,6,null,2);ctx.strokeStyle=C.ink;
  for(const [cx,cy,sx,sy] of[[x+9,y+9,1,1],[x+w-9,y+9,-1,1],[x+9,y+h-9,1,-1],[x+w-9,y+h-9,-1,-1]]){ctx.beginPath();ctx.moveTo(cx+sx*28,cy);ctx.quadraticCurveTo(cx+sx*6,cy+sy*6,cx,cy+sy*28);ctx.lineWidth=2;ctx.stroke();circ(cx+sx*14,cy+sy*14,4,C.rust,1.5);}}
const _levelOverlayE=levelOverlay;
levelOverlay=function(L){if(L.state!=='pause'){_levelOverlayE(L);return;}const t=L.t;ctx.fillStyle='rgba(20,13,8,.6)';ctx.fillRect(0,0,W,H);
  const cw=420,ch=330,cx=W/2-cw/2,cy=H/2-ch/2-10;ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-.015);ctx.translate(-W/2,-H/2);fancyCard(cx,cy,cw,ch);
  txt('PAUSA',W/2,cy+52,46,C.rust,C.ink);const d=LEVELS[L.id];btxt(d?d.name:'',W/2,cy+84,15,C.ink,'center',800);line(cx+60,cy+98,cx+cw-60,cy+98,2,'rgba(20,13,8,.35)');
  const opts=['Continuar','Reintentar','Opciones','Volver al mapa'];opts.forEach((o,i)=>{const on=i===L.menu,y=cy+130+i*40;if(on){rr(W/2-110,y-17,220,34,8,C.brass,3);glovePointer(W/2-150,y,t);}txt(o,W/2,y,22,on?C.ink:C.rustD,null);});
  if(L.kind==='run'&&L.coins){const got=L.coins.filter(c=>c.got||c.was).length;coinIcon(cx+36,cy+ch-28,9);btxt(`${got}/${L.coins.length}`,cx+52,cy+ch-28,15,C.ink,'left',900);}
  else if(L.boss){btxt('Fase '+(L.boss.phase+1)+' de '+L.boss.def.phases.length,cx+28,cy+ch-28,14,C.ink,'left',800);}
  const p=L.Ps[0];if(p)drawHero({x:cx+cw-48,y:cy+ch-20,char:p.char,face:-1,anim:t*2,scale:.55,skin:p.eq&&p.eq.skin,bored:t%6>3?t%6-3:null});
  ctx.restore();btxt('↑ ↓ elegir · Enter o saltar para aceptar',W/2,cy+ch+28,15,C.paper,'center');};
