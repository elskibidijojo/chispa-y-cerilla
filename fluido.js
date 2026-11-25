/* fluido.js — no more stutter when a boss changes phase.
   1) The boss costumes of the later phases used canvas color filters (hue-rotate, sepia…). A canvas filter
      is applied to EVERY little shape the boss draws, which on school laptops / Chromebooks makes each frame
      crawl as soon as the costume appears. The costumes stay; only the color filter is gone.
   2) The wilder last-phase song used to start downloading at the moment the phase changed. Now it is
      loaded quietly as soon as the fight begins and swapped in instantly. */
window.NOFILT=true;
(function(){
  if(typeof musicPhase!=='function'||typeof Pack==='undefined')return;
  const preload=id=>{try{const fin=PACK_FINAL[id];if(!fin||!packOn())return;if(Pack.pre&&Pack.preF===fin[0])return;const a=new Audio();a.preload='auto';a.loop=true;a.src='musica/'+fin[0]+'.mp3';try{a.load();}catch(_){}Pack.pre=a;Pack.preF=fin[0];}catch(_){}};
  const _mbl=makeBossLevel;makeBossLevel=function(def){const L=_mbl(def);if(def&&def.id)setTimeout(()=>preload(def.id),1500);return L;};
  const _mp=musicPhase;
  musicPhase=function(id,i,n){
    try{const fin=PACK_FINAL[id];
      if(fin&&i===n-1&&n>=2&&Pack.pre&&Pack.preF===fin[0]&&Pack.audio&&packOn()&&!(cfg.myMusic&&MyMusic.files.length)){
        const old=Pack.audio;try{old.pause();}catch(_){}Pack.audio=Pack.pre;Pack.pre=null;Pack.cur=fin[0];Pack.want=fin[0];Pack.audio.playbackRate=1;packVolume();
        try{Pack.audio.currentTime=0;const pr=Pack.audio.play();if(pr&&pr.catch)pr.catch(()=>{});}catch(_){}return;}
    }catch(_){}
    return _mp(id,i,n);};
})();
