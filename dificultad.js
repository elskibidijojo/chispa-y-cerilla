'use strict';
/* ================= DIFICULTAD POR ISLA: a fair climb, like a 1930s cartoon gauntlet =================
   Every update added attacks, so some first-island bosses ended up as busy as the last ones. Here each phase's
   "pressure" (how many attacks start per second) is measured and gently slowed down to a ceiling that rises
   island by island and phase by phase. Nothing is sped up, so the hard bosses stay hard.
   Island 1 also gets a bit less life and a milder last-gasp frenzy. */
const DIF_TARGET={1:[.95,1.15,1.3,1.4],2:[1.1,1.3,1.45,1.55],3:[1.25,1.45,1.65,1.75],4:[1.3,1.5,1.7,1.8]};
const DIF_HP={1:.88,2:.95,3:1,4:1};
const DIF_PACE={1:1.18,2:1.07,3:1};
for(const id in LEVELS){const d=LEVELS[id];if(!d.phases||d.kind==='run'||d.kind==='maus'||d.difDone)continue;const isl=d.isl||3,T=DIF_TARGET[isl]||DIF_TARGET[3],pace=DIF_PACE[isl]||1;
  d.phases.forEach((ph,i)=>{const at=ph.atk||[];const press=at.reduce((s,a)=>s+1/((a.every||3)*pace),0),tg=T[Math.min(i,T.length-1)];
    if(press>tg){const f=press/tg;for(const a of at)if(a.every)a.every=+(a.every*f).toFixed(2);}});
  d.difDone=true;
  if(DIF_HP[isl]!==1&&!d.parryOnly){const c=d.create;d.create=(...a)=>{const L=c(...a);if(L&&L.boss){L.boss.hp*=DIF_HP[isl];L.boss.max*=DIF_HP[isl];}return L;};}}
/* mini-bosses in the first islands' run-and-gun levels are a little softer too */
if(typeof MINI!=='undefined'){const _ms=miniStart;miniStart=function(L,g){const e=_ms(L,g),isl=(LEVELS[L.id]&&LEVELS[L.id].isl)||3,k={1:.8,2:.9}[isl]||1;e.hp*=k;e.max*=k;return e;};}
