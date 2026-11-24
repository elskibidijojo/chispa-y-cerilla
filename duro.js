/* duro.js — the game gets harder, and harder the further you sail:
   - bosses have more life (island 1 a bit more, island 5 a lot more)
   - bosses attack more often and their straight shots fly faster
   - run-and-gun enemies and mini-bosses are tougher, and their shots are faster too
   - Fácil only gets half of the extra, so it stays a good way to learn a boss; Experto keeps all of it
   Everything is plain multipliers on the simulation, the same on every machine, so online play stays in sync. */
(function(){
const ISL={1:{hp:1.35,mhp:1,pace:.88,spd:1.05,ent:1.25},2:{hp:1.4,mhp:1.04,pace:.84,spd:1.08,ent:1.35},3:{hp:1.45,mhp:1.08,pace:.8,spd:1.1,ent:1.45},4:{hp:1.5,mhp:1.12,pace:.77,spd:1.12,ent:1.55},5:{hp:1.55,mhp:1.15,pace:.75,spd:1.14,ent:1.6}};
window.DURO=ISL;
/* longer fights shouldn't ruin your grade: the par time grows with the extra life */
for(const id in LEVELS){const d=LEVELS[id];if(!d.create||/^tutorial/.test(id)||d._duroPar)continue;const b=ISL[d.isl]||ISL[3];d._duroPar=true;
  if(d.phases&&!d.parryOnly)d.par=Math.round((d.par||110)*(1+(b.hp-1)*.85));else if(d.kind==='run')d.par=Math.round((d.par||110)*1.12);}
function k(L){const d=LEVELS[L&&L.id];if(!d||/^tutorial/.test(L.id))return null;const b=ISL[d.isl]||ISL[3];
  if(cfg.diff!=='facil')return b;const h=v=>1+(v-1)*.5;return{hp:h(b.hp),mhp:h(b.mhp),pace:1-(1-b.pace)*.5,spd:h(b.spd),ent:h(b.ent)};}
/* bosses */
const _mbl=makeBossLevel;makeBossLevel=function(def){const L=_mbl(def),B=L.boss,f=k(L);
  if(f&&B){if(!def.parryOnly){B.hp*=f.hp;B.max*=f.hp;}B.pace*=f.pace;L._spd=f.spd;}return L;};
/* faster straight enemy shots (lobbed shots that aim with gravity keep their arc so they still land where they aim) */
const _seb=spawnEB;spawnEB=function(L,o){const e=_seb(L,o);if(L&&L._spd&&e&&!e.g&&!e._duro&&e.k!=='pstar'){e._duro=true;if(e.vx)e.vx*=L._spd;if(e.vy)e.vy*=L._spd;if(e.spd)e.spd*=L._spd;}return e;};
/* run-and-gun: tougher enemies and mini-bosses */
const _mk=mkEnt;mkEnt=function(L,o){const e=_mk(L,o);if(L&&L.kind==='run'&&e&&!e.boss&&e.ai!=='mini'&&!e._duro){const f=k(L);if(f){e._duro=true;e.hp=Math.max(e.hp,Math.round(e.hp*f.ent));if(e.max)e.max=Math.max(e.max,Math.round(e.max*f.ent));if(!L._spd)L._spd=f.spd;}}return e;};
if(typeof miniStart==='function'){const _ms=miniStart;miniStart=function(L,g){const e=_ms(L,g),f=k(L);if(e&&f){e.hp*=f.mhp;e.max*=f.mhp;}return e;};}
/* bosses hand out fewer parry cards: only 1 of every 3 pink shots stays pink
   (card bosses that you can only beat by parrying, mausoleums and tutorials keep all of theirs) */
const _sebP=spawnEB;spawnEB=function(L,o){if(L&&L.boss&&o&&o.parry&&o.k!=='pstar'&&!o.retBomb&&!o.harmless&&!o.secret&&!o.maus&&o.spr!=='bombav'&&!(L.boss.def&&L.boss.def.parryOnly)&&!/^(tutorial|mausoleo)/.test(L.id)){L._pc=(L._pc||0)+1;if(L._pc%3!==0)o=Object.assign({},o,{parry:false});}return _sebP(L,o);};
})();
/* parry-only bosses (cards): never leave the player without something pink for long */
{const _sebG=spawnEB;spawnEB=function(L,o){if(L&&L.boss&&o&&L.boss.def&&L.boss.def.parryOnly&&!L.boss.dead&&o.spr&&o.k!=='pstar'&&!o.harmless){const t=L.t||0;if(o.parry)L._lastPar=t;else if(t-(L._lastPar??t-1)>2.5&&L.state==='play'){o=Object.assign({},o,{parry:true});L._lastPar=t;}}return _sebG(L,o);};}
/* inside every island the levels climb in difficulty, like a real campaign:
   the first boss you meet on an island is the gentlest, the last one is the meanest.
   rank goes 0 (first on the map) -> 1 (last); life 0.88x -> 1.12x, attack gaps 1.1x -> 0.92x */
(function(){const RANK={};
  for(const k in WORLDS){const ids=WORLDS[k].nodes.map(n=>n.id).filter(id=>{const d=LEVELS[id];return d&&d.create&&(d.phases||d.kind==='run')&&!d.parryOnly&&id!=='rascacielos'&&!/^(tutorial|mausoleo)/.test(id);});
    const bs=ids.filter(id=>LEVELS[id].kind!=='run'),rs=ids.filter(id=>LEVELS[id].kind==='run');
    for(const g of[bs,rs])g.forEach((id,i)=>RANK[id]=g.length>1?i/(g.length-1):.5);}
  window.DURO_RANK=RANK;
  const ease=id=>cfg.diff==='facil'?.5:1;
  const _mbl=makeBossLevel;makeBossLevel=function(def){const L=_mbl(def),B=L.boss;if(!B||!L.id)return L;const r=RANK[L.id];
    if(r!==undefined){const e=ease();const hp=1+((.88+.24*r)-1)*e,pc=1+((1.1-.18*r)-1)*e;B.hp*=hp;B.max*=hp;B.pace*=pc;}
    /* El Rascacielos: a climbing level is hard enough on its own — less life and calmer attacks */
    if(L.id==='rascacielos'){B.hp*=.58;B.max*=.58;B.pace*=cfg.diff==='facil'?1.3:1.18;}
    return L;};
  const _mk=mkEnt;mkEnt=function(L,o){const e=_mk(L,o);if(L&&L.kind==='run'&&e&&!e.boss&&e.ai!=='mini'&&!e._rank){const r=RANK[L.id];if(r!==undefined){e._rank=true;const m=.85+.3*r;e.hp=Math.max(1,Math.round(e.hp*m));if(e.max)e.max=Math.max(1,Math.round(e.max*m));}}return e;};
})();
