/* secretos.js — the Brasa Rastreadora and the Patito skin are secrets now:
   - Brasa: type BRASA (capital letters) on the title/map/shop/equipment screen, OR clear 2 whole islands in Experto.
   - Patito: type DUCK, OR clear 2 whole islands in Experto.
   An island counts when every boss of it was beaten in Experto (an S grade from before counts too). */
(function(){
const hide=['brasa'];
if(typeof refreshShopTabs==='function'){const _r=refreshShopTabs;refreshShopTabs=function(){_r();try{for(const t of SHOP_TABS)for(const id of hide){const i=t.ids.indexOf(id);if(i>=0)t.ids.splice(i,1);}}catch(e){}};refreshShopTabs();}
if(WEAPONS.brasa){WEAPONS.brasa.price=0;WEAPONS.brasa.secret=true;WEAPONS.brasa.desc+=' (Secreta: código BRASA o completa 2 islas en Experto.)';}
if(SKINS.skin_pato)SKINS.skin_pato.desc=SKINS.skin_pato.desc.replace('Secreta (código DUCK).','Secreta (código DUCK o completa 2 islas en Experto).');
function own(id,msg){if(typeof save==='undefined'||!save||!save.owned||save.owned.includes(id))return false;save.owned.push(id);try{persist();}catch(e){}
  if(scene==='title'&&typeof TI!=='undefined'){TI.msg=msg;TI.msgT=3.5;}else if(typeof ACHQ!=='undefined')ACHQ.push({a:{name:msg,coins:0},t:0});sfx('magic');sfx('coin');return true;}
function expIslands(){if(typeof save==='undefined'||!save)return 0;const ex=save.expDone||{};let n=0;
  for(const k in WORLDS){const ids=WORLDS[k].nodes.filter(nd=>nd.kind==='level'&&LEVELS[nd.id]&&LEVELS[nd.id].phases&&!LEVELS[nd.id].parryOnly).map(nd=>nd.id);
    if(ids.length&&ids.every(id=>ex[id]||save.done&&save.done[id]==='S'))n++;}return n;}
function check(){if(cfg.brasaCode)own('brasa','¡SECRETO! Arma Brasa Rastreadora desbloqueada 🔥');
  if(expIslands()>=2){own('brasa','¡Completaste 2 islas en Experto! Brasa Rastreadora desbloqueada 🔥');if(!cfg.duck){cfg.duck=true;try{saveCfg();}catch(e){}}if(typeof syncSecrets==='function')try{syncSecrets();}catch(e){}}}
const _al=afterLevel;afterLevel=function(L){try{if(L&&cfg.diff==='experto'&&L.boss&&L.state==='results'&&!(L.result&&L.result.fail)){save.expDone=save.expDone||{};save.expDone[L.id]=1;}}catch(e){}_al(L);try{check();}catch(e){}};
const _ss=syncSecrets;syncSecrets=function(){_ss.apply(this,arguments);try{check();}catch(e){}};
let buf='';addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.key.length!==1)return;if(!['title','map','shop','equip','slots'].includes(scene)){buf='';return;}
  buf=(buf+e.key).slice(-5);if(buf==='BRASA'){buf='';cfg.brasaCode=true;try{saveCfg();}catch(e){}check();}});
})();
