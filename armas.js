/* armas.js (the top weapons were squeezed closer to the rest so no weapon melts a boss in 20 s)
   — weapon damage ladder, from best to worst (measured on a boss at each weapon's best range).
   Short range weapons pay for the risk with the highest damage; the Cañón de Carga, fully charged, is the strongest.
   Only the normal shot is scaled; EX moves and Súpers keep their own damage. */
(function(){
const TIERS={
  cometon:[0.68,'¡El más fuerte de todos! (dispara lento)'],
  solar:[0.7,'Altísimo, el 2.º mejor (se recalienta)'],
  taladro:[0.773,'Altísimo (pegado al jefe)'],
  lanzallamas:[0.868,'Altísimo (de cerca)'],
  carga:[0.73,'Altísimo (hay que cargarlo)'],
  abanico:[0.633,'Muy alto (de cerca)'],
  yoyo:[1.1,'Muy alto (de cerca)'],
  bastones:[0.92,'Muy bueno (atraviesan)'],
  tachuelas:[0.832,'Muy bueno'],
  arco:[0.824,'Muy bueno (alcance medio)'],
  trompetazo:[1.116,'Muy bueno (de cerca)'],
  bumeran:[0.62,'Bueno'],
  shuriken:[1,'Bueno (atraviesa)'],
  murcielago:[1,'Bueno (persiguen solos)'],
  agua:[0.89,'Bueno (moja: +15% de daño)'],
  petardo:[1.12,'Bueno (explota en área)'],
  rebote:[1.158,'Bueno'],
  convergente:[.861,'Bueno'],
  espiral:[.854,'Bueno'],
  cohete:[1,'Normal'],
  trueno:[1.15,'Normal (nunca falla)'],
  palomitas:[1,'Bueno (explotan en tres)'],
  canicas:[1,'Normal (fácil de usar)'],
  chispa:[1,'Normal'],
  partida:[1.08,'Normal'],
  sierra:[.8,'Decente (te protege)'],
  burbujas:[0.88,'Decente (se come balas)'],
  rebotapared:[1.146,'Decente'],
  varita:[1.12,'Bajo (pero llena el súper rapidísimo)'],
  luciernaga:[1.265,'Bajo (nunca falla)']};
window.WEAPON_TIERS=TIERS;
let CUR=1;const BOOST=1.25;/* all weapons hit 25 % harder */const wm=w=>(TIERS[w]?TIERS[w][0]:1)*BOOST;
const _B=B_;B_=function(L,p,b){if(CUR!==1&&typeof b.dmg==='number')b.dmg*=CUR;return _B(L,p,b);};
let HOLD=0;const _dm=dmgM;dmgM=function(p){return _dm(p)*(HOLD&&p===HOLD.p?HOLD.m:1);};
const _hw=holdWeapon;holdWeapon=function(L,p,dt,h,w){const m=wm(w),pc=CUR,ph=HOLD;CUR=m;HOLD={p,m};try{return _hw(L,p,dt,h,w);}finally{CUR=pc;HOLD=ph;}};
for(const [id,W] of Object.entries(WEAPONS)){if(!W.fire)continue;const f=W.fire;const m=wm(id);
  W.fire=function(...a){const pc=CUR;CUR=m;try{return f.apply(this,a);}finally{CUR=pc;}};
  if(TIERS[id]&&W.desc&&!/ Daño:/.test(W.desc))W.desc=W.desc.replace(/\s*\((Ajustado|Mejorada)[^)]*\)/,'')+' Daño: '+TIERS[id][1]+'.';}
})();
