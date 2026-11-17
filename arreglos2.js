/* arreglos2.js — fixes:
   - tiny plane: short-range, weaker shots
   - EX moves and Súpers no longer refill the super cards with their own damage, so an EX can't be
     chained forever (the Cañón Cometa EX refilled a whole card by itself)
   - the strongest weapons fill the cards a bit slower, so every weapon gets a super at a similar pace */
(function(){
let NOG=0;
const _B=B_;B_=function(L,p,b){if(NOG||b.k==='ex')b.noGain=true;
  /* tiny plane (hold dash in the air): like the shrink in the original cartoon games, the shot is short-range and weaker */
  if(p&&p.type==='plane'&&p.small&&!NOG&&b.k!=='ex'){const v=Math.hypot(b.vx||0,b.vy||0);b.life=Math.min(b.life||1,v>600?.24:.5);b.dmg=(b.dmg||0)*.82;b.r=Math.max(3,(b.r||6)*.8);}
  return _B(L,p,b);};
const _g=gain;gain=function(p,d){if(NOG)return;if(p&&p.eq&&typeof curW==='function'&&p.type==='plat'){const w=curW(p),f=CARD_F[w];if(f)d*=f;}_g(p,d);};
const CARD_F={cometon:.48,solar:.54,carga:.6,taladro:.77,lanzallamas:.8,yoyo:.87,abanico:.88};
for(const [id,W] of Object.entries(WEAPONS)){if(!W.ex)continue;const f=W.ex;W.ex=function(...a){NOG++;try{return f.apply(this,a);}finally{NOG--;}};}
const _ss=startSuper;startSuper=function(L,p){NOG++;try{_ss(L,p);}finally{NOG--;}};
})();
