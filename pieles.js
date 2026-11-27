/* pieles.js — no lag in the skins shop / equipment screen.
   Color skins (Dorada, Medianoche, Zombi, Polvo de Luna, Cine Mudo…) used a canvas color filter on every
   little shape of the character, which crawls on school laptops when the shop shows many characters at once.
   Now each skin's colors are worked out ONCE at load (by running the same filter on the base colors) and the
   character is simply painted with those colors: same look, almost no cost. */
(function(){
const KEYS=['glass','steel','steelD','match','matchHead','white','paper','rust','gold','brass','brassD','wood','woodL','woodD','moss'];
const cv=document.createElement('canvas');cv.width=cv.height=1;const c2=cv.getContext('2d',{willReadFrequently:true});
function tint(col,f){try{c2.clearRect(0,0,1,1);c2.filter='none';const t=document.createElement('canvas');t.width=t.height=1;const tc=t.getContext('2d');tc.fillStyle=col;tc.fillRect(0,0,1,1);
  c2.filter=f;c2.drawImage(t,0,0);const d=c2.getImageData(0,0,1,1).data;c2.filter='none';if(d[3]===0)return col;return '#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('');}catch(e){return col;}}
const PAL={};
for(const [id,sk] of Object.entries(SKINS)){if(!sk.filter)continue;const pal={};for(const k of KEYS)if(typeof C[k]==='string')pal[k]=tint(C[k],sk.filter);PAL[id]=pal;sk._filter=sk.filter;delete sk.filter;}
window.SKIN_PAL2=PAL;
const _dh=drawHero;drawHero=function(o){const pal=o&&o.skin&&PAL[o.skin];if(!pal){_dh(o);return;}const old={};for(const k in pal){old[k]=C[k];C[k]=pal[k];}try{_dh(o);}finally{for(const k in old)C[k]=old[k];}};
if(typeof drawPlaneHero==='function'){const _dp=drawPlaneHero;drawPlaneHero=function(o){const pal=o&&o.skin&&PAL[o.skin];if(!pal){_dp(o);return;}const old={};for(const k in pal){old[k]=C[k];C[k]=pal[k];}try{_dp(o);}finally{for(const k in old)C[k]=old[k];}};}
})();
/* No colour filters at all on the main game canvas: a canvas filter is applied to every single shape drawn
   while it's on, which is what made the game crawl on school laptops (the ghost after you die, the clone Súper,
   costume tints…). Small off-screen layers that are drawn once can still use them. */
try{Object.defineProperty(ctx,'filter',{configurable:true,get(){return 'none';},set(v){}});}catch(e){}
/* Auto quality now starts at "Media" (normal resolution, no film grain) instead of "Alta" (up to double
   resolution on sharp screens = 4x the pixels to paint). "Alta" is still there in Options for strong computers. */
try{if(typeof PERF!=='undefined'&&PERF.auto&&PERF.level===0)perfApply(1);const _pf=perfFromCfg;perfFromCfg=function(){_pf();if(PERF.auto&&PERF.level===0)perfApply(1);};}catch(e){}
