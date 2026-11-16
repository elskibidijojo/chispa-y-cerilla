/* armas.js — weapon damage ladder, from best to worst (measured on a boss at each weapon's best range).
   Short range weapons pay for the risk with the highest damage; the Cañón de Carga, fully charged, is the strongest.
   Only the normal shot is scaled; EX moves and Súpers keep their own damage. */
(function(){
const TIERS={
  taladro:[1.074,'Altísimo (pegado al jefe)'],
  lanzallamas:[1.04,'Altísimo (de cerca)'],
  carga:[1,'Altísimo (hay que cargarlo)'],
  abanico:[.745,'Muy alto (de cerca)'],
  tachuelas:[.935,'Muy bueno'],
  arco:[.916,'Muy bueno (alcance medio)'],
  trompetazo:[1.2,'Muy bueno (de cerca)'],
  bumeran:[.795,'Bueno'],
  rebote:[1.158,'Bueno'],
  convergente:[.861,'Bueno'],
  espiral:[.854,'Bueno'],
  cohete:[1,'Normal'],
  chispa:[1,'Normal'],
  partida:[1,'Normal'],
  sierra:[.8,'Decente (te protege)'],
  burbujas:[.765,'Decente (se come balas)'],
  rebotapared:[1.023,'Decente'],
  luciernaga:[1.1,'Bajo (nunca falla)']};
window.WEAPON_TIERS=TIERS;
let CUR=1;const wm=w=>(TIERS[w]?TIERS[w][0]:1);
const _B=B_;B_=function(L,p,b){if(CUR!==1&&typeof b.dmg==='number')b.dmg*=CUR;return _B(L,p,b);};
let HOLD=0;const _dm=dmgM;dmgM=function(p){return _dm(p)*(HOLD&&p===HOLD.p?HOLD.m:1);};
const _hw=holdWeapon;holdWeapon=function(L,p,dt,h,w){const m=wm(w),pc=CUR,ph=HOLD;CUR=m;HOLD={p,m};try{return _hw(L,p,dt,h,w);}finally{CUR=pc;HOLD=ph;}};
for(const [id,W] of Object.entries(WEAPONS)){if(!W.fire)continue;const f=W.fire;const m=wm(id);
  W.fire=function(...a){const pc=CUR;CUR=m;try{return f.apply(this,a);}finally{CUR=pc;}};
  if(TIERS[id]&&W.desc&&!/ Daño:/.test(W.desc))W.desc=W.desc.replace(/\s*\((Ajustado|Mejorada)[^)]*\)/,'')+' Daño: '+TIERS[id][1]+'.';}
})();
