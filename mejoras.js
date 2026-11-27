/* mejoras.js — buffs: the weaker Súpers hit harder, and the health charms no longer cost you damage. */
(function(){
const SUPK={luciB:1.3,cohete:1.3,globito:1.3,fantasma:1.3,bolanieve:1.25,tornado:1.25,shock:1.2,magnet:1.15,semilla:1.3};
const _B=B_;B_=function(L,p,b){if(b&&typeof b.dmg==='number'&&SUPK[b.k])b.dmg*=SUPK[b.k];return _B(L,p,b);};
/* Corazón de Cobre and Doble Corazón used to cut your damage (-6 % / -10 %): now -0 % / -4 % */
const _dm=dmgM;dmgM=function(p){const m=_dm(p);if(!p)return m;if(hasCharm(p,'corazon'))return m/.94;if(hasCharm(p,'doble'))return m/.9*.96;return m;};
if(CHARMS.corazon)CHARMS.corazon.desc=CHARMS.corazon.desc.replace(/[^.]*(daño|pegas)[^.]*\./i,'')+' ¡Y ya no baja tu daño!';
})();
