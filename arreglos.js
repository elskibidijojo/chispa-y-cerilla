'use strict';
/* ================= ARREGLOS: charms, supers and skins that did not always behave =================
   · Anillo Corazón: every Súper now recharges it (before, only some of the newer Súpers did), a set of 3 parries
     is kept until it can be paid out, and the HUD shows its state (hearts left and parry progress).
   · Skins that only changed colour vanished on slower computers (the colour filter is switched off there to avoid lag):
     they now repaint the hero with their own palette instead. */
CHARMS.anillo.desc='Cada 3 parrys ganas 1 vida extra (hasta 3 vidas y un máximo de 6). Se recarga al tirar una Súper, revivir a un compañero o cada 10 parrys. Si ya estás lleno, la vida queda guardada.';
{const _ss=startSuper;startSuper=function(L,p){const r=_ss.apply(this,arguments);try{ringRestore(L,p);}catch(_){}return r;};}
{const _h=hurt;hurt=function(L,p){const r=_h.apply(this,arguments);try{if(!p.dead)ringGive(L,p);}catch(_){}return r;};}
/* the ring on the HUD: three little hearts (lit = still to give) and three dots for the parries of the next one */
{const _dh=drawHUD;drawHUD=function(L){_dh(L);if(L.state==='results')return;L.Ps.forEach((p,i)=>{if(!hasCharm(p,'anillo')||p.dead)return;const R=i===1,hx=R?W-150:i===2?W/2-110:58,y=H-58-34;
  ctx.save();card(hx,y,92,26,'rgba(239,224,191,.92)',2.5,6);for(let k=0;k<3;k++){const on=k>=(p.ringN||0),x=hx+14+k*17,yy=y+13;ctx.beginPath();ctx.moveTo(x,yy+6);ctx.bezierCurveTo(x-10,yy-2,x-5,yy-9,x,yy-3);ctx.bezierCurveTo(x+5,yy-9,x+10,yy-2,x,yy+6);ctx.fillStyle=on?C.parry:'rgba(20,13,8,.18)';ctx.fill();ctx.lineWidth=1.8;ctx.strokeStyle=C.ink;ctx.stroke();}
  for(let k=0;k<3;k++)circ(hx+68+k*8,y+13,3,k<(p.ringP||0)?C.gold:'rgba(20,13,8,.2)',1.2);ctx.restore();});};}
/* skin palettes for when colour filters are off */
const SKIN_PAL={skin_dorada:{glass:'#ffe08a',steel:'#c99a2e',match:'#e8b84a',matchHead:'#f2c14e'},skin_noche:{glass:'#c4bcff',steel:'#3e3a78',match:'#6a5aa8',matchHead:'#4a3a8a'},
  skin_fantasma:{glass:'#c8fff4',steel:'#7fd8cc',match:'#a8f0e6',matchHead:'#6fd8c8'},skin_cine:{glass:'#f0f0ee',steel:'#8a8a8a',match:'#c4c4c0',matchHead:'#6a6a6a'},
  skin_sombra:{glass:'#4a4058',steel:'#1e1a28',match:'#2a2238',matchHead:'#120e18'},skin_payaso:{glass:'#fff0b8',steel:'#e85a8a',match:'#ffcf5a',matchHead:'#e8402e'}};
{const _dhS=drawHero;drawHero=function(o){const pal=o&&o.skin&&SKIN_PAL[o.skin];if(!pal||typeof PERF==='undefined'||PERF.level===0){_dhS(o);return;}
  const old={};for(const k in pal){old[k]=C[k];C[k]=pal[k];}try{_dhS(o);}finally{for(const k in old)C[k]=old[k];}};}
{const _dph=typeof drawPlaneHero==='function'?drawPlaneHero:null;if(_dph)drawPlaneHero=function(o){const pal=o&&o.skin&&SKIN_PAL[o.skin];if(!pal||PERF.level===0){_dph(o);return;}const old={};for(const k in pal){old[k]=C[k];C[k]=pal[k];}try{_dph(o);}finally{for(const k in old)C[k]=old[k];}};}
