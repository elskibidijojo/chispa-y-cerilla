'use strict';
/* ================= ANIMACIONES: more life for Chispa, Cerilla and Velita =================
   · Each one has their own entrance: Chispa switches on with sparks, Cerilla strikes her head on a matchbox,
     Velita pops up and curtsies.  · Standing still for a while: they get bored (whistle, blow on the flame, tap a foot).
   · Winning: a little victory dance.  · Running without shooting: both arms pump.  · Dashing: speed lines and dust.
   · Getting hit: knocked back.  Everything here is drawing only: it never changes the game itself. */

/* entrances: everybody drops in, then does their own thing */
introHero=function(L,p){const k=L.stateT,o={dy:0,rot:0,sx:1,sy:1,pose:null};if(p.type==='plane'){o.dx=-(1-easeOutBack(clamp(k/1,0,1)))*420;return o;}
  const d=.12*p.i,kk=k-d,ch=p.char||'chispa';
  if(ch==='velita'){/* rises up out of the floor like a candle being pushed up */if(kk<.55){const q=clamp(kk/.55,0,1);o.dy=(1-easeOutBack(q))*90;o.sy=.4+q*.6;o.sx=1.2-q*.2;}
    else if(kk<1.9){const q=clamp((kk-.55)/1.35,0,1);o.pose='curtsy';o.k=q;}return o;}
  if(kk<.7){const q=clamp(kk/.7,0,1);o.dy=-(1-q*q)*520;o.rot=(1-q)*TAU*1.5*(p.i%2?-1:1);}
  else if(kk<.95){const q=(kk-.7)/.25;o.sy=1-Math.sin(q*Math.PI)*.35;o.sx=1+Math.sin(q*Math.PI)*.3;}
  else if(kk<1.9){o.pose=ch==='cerilla'?'strike':'flick';o.k=(kk-.95)/.95;}return o;};

/* per-player drawing state (lives only on screen) */
function heroExtra(L,p,io){const lt=p._lt??L.t,dt=Math.max(0,Math.min(.1,L.t-lt));p._lt=L.t;
  const still=p.ground&&Math.abs(p.vx)<1&&!p.shoot&&!p.duck&&!(p.dash>0)&&L.state==='play';p._idle=still?(p._idle||0)+dt:0;
  const o={};if(io&&io.pose&&io.pose!=='flex'){o.pose2=io.pose;o.k2=io.k||0;o.run=false;o.air=false;}
  else if((L.state==='win'||L.state==='ko')&&!p.dead){o.victory=(L.stateT||0)+p.i*.3;}
  else if(p._idle>3.2){o.bored=p._idle-3.2;}
  if(p.hurtT>0)o.knock=p.hurtT;if(p.dash>0)o.dashFx=1;return o;}

const _drawHeroA=drawHero;
drawHero=function(o){const ch=o.char||'chispa',f=o.face||1,t=o.anim||0;
  if(!o.pose2&&!o.victory&&!o.bored&&!o.knock&&!o.dashFx){_drawHeroA(o);return;}
  const q=Object.assign({},o),x=o.x,y=o.y,sc=o.scale||1;ctx.save();
  /* dash: speed lines and a puff behind */
  if(o.dashFx){ctx.save();ctx.lineCap='round';for(let i=0;i<4;i++){const yy=y-(18+i*16)*sc,len=(40+((i*37+Math.floor(t*40))%30))*sc;ctx.globalAlpha=.55-i*.08;line(x-f*(26*sc),yy,x-f*(26*sc+len),yy,3,C.ink);}ctx.restore();}
  /* knocked back when hurt */
  if(o.knock){ctx.translate(x,y);ctx.rotate(-f*.22*Math.min(1,o.knock*4));ctx.translate(-x+(-f*4),-y);}
  /* victory: hop with both arms up, stars around */
  if(o.victory!=null){const v=o.victory,h=Math.abs(Math.sin(v*6))*26*sc;ctx.translate(0,-h);q.air=h>4;q.vy=Math.cos(v*6)>0?-400:300;q.armsUp=true;q.flash=Math.floor(v*8)%2===0;q.run=false;
    if(ch!=='chispa')q.flameK=1.6+Math.sin(v*14)*.3;}
  /* bored: sway, and a little personal habit */
  if(o.bored!=null){const b=o.bored;ctx.translate(x,y);ctx.rotate(Math.sin(b*2.2)*.06);ctx.translate(-x,-y);if(ch==='cerilla'&&Math.floor(b/2.5)%2===1)q.flameK=.55+Math.sin(b*20)*.12;}
  /* entrances */
  if(o.pose2==='flick'){const k=o.k2,on=k<.45?(Math.sin(k*60)>0?1:.2):1;q.flameK=k<.45?on*.9:1.25;q.armsUp=k>.45;q.flash=k>.45&&Math.floor(k*14)%2===0;}
  if(o.pose2==='strike'){const k=o.k2;if(k<.55){ctx.translate(x,y);ctx.rotate(f*(.35+Math.sin(k*40)*.12));ctx.translate(-x,-y);q.flameK=.25;}else{q.flameK=1.2+(1-Math.min(1,(k-.55)*3))*1.2;q.armsUp=k>.7;}}
  if(o.pose2==='curtsy'){const k=o.k2,bow=Math.sin(Math.min(1,k*1.6)*Math.PI);ctx.translate(x,y);ctx.rotate(f*bow*.32);ctx.scale(1,1-bow*.08);ctx.translate(-x,-y);q.flameK=1+bow*.6;if(k>.65)q.armsUp=true;}
  _drawHeroA(q);ctx.restore();
  /* extras drawn over the hero */
  if(o.pose2==='strike'){const k=o.k2,bx=x+f*30*sc,by=y-6*sc;ctx.save();ctx.globalAlpha=k<.85?1:Math.max(0,1-(k-.85)*7);rr(bx-16*sc,by-12*sc,32*sc,14*sc,3,'#c0563a',2.5);rr(bx-16*sc,by-12*sc,32*sc,5*sc,2,'#5a3428',2);btxt('FÓSFOROS',bx,by-2*sc,6*sc,'#fbf6ea','center',900);ctx.restore();
    if(k>.5&&k<.7){for(let i=0;i<6;i++){const a=i*TAU/6+k*30;star(x+Math.cos(a)*26*sc,y-70*sc+Math.sin(a)*20*sc,6*sc,2.5*sc,4,k*20);ctx.fillStyle='#ffd27a';ctx.fill();}}}
  if(o.pose2==='flick'&&o.k2<.5){for(let i=0;i<3;i++){const a=o.k2*80+i*2.1;line(x+Math.cos(a)*30*sc,y-60*sc+Math.sin(a)*24*sc,x+Math.cos(a)*42*sc,y-60*sc+Math.sin(a)*34*sc,2.5,'#ffe27a');}}
  if(o.pose2==='curtsy'&&o.k2>.55){ctx.save();ctx.globalAlpha=Math.min(1,(o.k2-.55)*4);for(let i=0;i<3;i++){const yy=y-110*sc-((o.k2*60+i*20)%40);star(x+(i-1)*16*sc,yy,5*sc,2*sc,4,o.k2*10);ctx.fillStyle='#e8c8ff';ctx.fill();}ctx.restore();}
  if(o.victory!=null&&Math.floor(o.victory*3)%2===0){ctx.save();for(let i=0;i<4;i++){const a=o.victory*2+i*TAU/4;star(x+Math.cos(a)*44*sc,y-60*sc+Math.sin(a)*30*sc,6*sc,2.5*sc,5,a);ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle=C.ink;ctx.stroke();}ctx.restore();}
  if(o.bored!=null){const b=o.bored,hx=x+f*6*sc,hy=y-110*sc;ctx.save();
    if(ch==='chispa'){for(let i=0;i<2;i++){const k=((b*.8+i*.5)%1);ctx.globalAlpha=1-k;btxt(i?'♫':'♪',hx+f*(10+k*20)*sc,hy-k*40*sc,16*sc,C.ink,'center',900);}}
    else if(ch==='cerilla'){if(Math.floor(b/2.5)%2===1){const k=(b*1.5)%1;ctx.globalAlpha=.6*(1-k);circ(hx+f*14*sc,hy-k*30*sc,(5+k*8)*sc,'#9a9aa6',0);}}
    else{const k=(b*.6)%1;ctx.globalAlpha=1-k;ell(x+f*12*sc,y-50*sc+k*30*sc,2.5*sc,4*sc,'#f4ead6',1.5);}
    ctx.restore();}};
