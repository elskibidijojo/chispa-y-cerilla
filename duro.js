/* duro.js — the game gets harder, and harder the further you sail:
   - bosses have more life (island 1 a bit more, island 5 a lot more)
   - bosses attack more often and their straight shots fly faster
   - run-and-gun enemies and mini-bosses are tougher, and their shots are faster too
   - Fácil only gets half of the extra, so it stays a good way to learn a boss; Experto keeps all of it
   Everything is plain multipliers on the simulation, the same on every machine, so online play stays in sync. */
(function(){
const ISL={1:{hp:1.35,pace:.88,spd:1.05,ent:1.25},2:{hp:1.45,pace:.84,spd:1.08,ent:1.35},3:{hp:1.55,pace:.8,spd:1.1,ent:1.45},4:{hp:1.65,pace:.77,spd:1.12,ent:1.55},5:{hp:1.7,pace:.75,spd:1.14,ent:1.6}};
window.DURO=ISL;
/* longer fights shouldn't ruin your grade: the par time grows with the extra life */
for(const id in LEVELS){const d=LEVELS[id];if(!d.create||/^tutorial/.test(id)||d._duroPar)continue;const b=ISL[d.isl]||ISL[3];d._duroPar=true;
  if(d.phases&&!d.parryOnly)d.par=Math.round((d.par||110)*(1+(b.hp-1)*.85));else if(d.kind==='run')d.par=Math.round((d.par||110)*1.12);}
function k(L){const d=LEVELS[L&&L.id];if(!d||/^tutorial/.test(L.id))return null;const b=ISL[d.isl]||ISL[3];
  if(cfg.diff!=='facil')return b;const h=v=>1+(v-1)*.5;return{hp:h(b.hp),pace:1-(1-b.pace)*.5,spd:h(b.spd),ent:h(b.ent)};}
/* bosses */
const _mbl=makeBossLevel;makeBossLevel=function(def){const L=_mbl(def),B=L.boss,f=k(L);
  if(f&&B){if(!def.parryOnly){B.hp*=f.hp;B.max*=f.hp;}B.pace*=f.pace;L._spd=f.spd;}return L;};
/* faster straight enemy shots (lobbed shots that aim with gravity keep their arc so they still land where they aim) */
const _seb=spawnEB;spawnEB=function(L,o){const e=_seb(L,o);if(L&&L._spd&&e&&!e.g&&!e._duro&&e.k!=='pstar'){e._duro=true;if(e.vx)e.vx*=L._spd;if(e.vy)e.vy*=L._spd;if(e.spd)e.spd*=L._spd;}return e;};
/* run-and-gun: tougher enemies and mini-bosses */
const _mk=mkEnt;mkEnt=function(L,o){const e=_mk(L,o);if(L&&L.kind==='run'&&e&&!e.boss&&e.ai!=='mini'&&!e._duro){const f=k(L);if(f){e._duro=true;e.hp=Math.max(e.hp,Math.round(e.hp*f.ent));if(e.max)e.max=Math.max(e.max,Math.round(e.max*f.ent));if(!L._spd)L._spd=f.spd;}}return e;};
if(typeof miniStart==='function'){const _ms=miniStart;miniStart=function(L,g){const e=_ms(L,g),f=k(L);if(e&&f){e.hp*=f.hp;e.max*=f.hp;}return e;};}
})();
