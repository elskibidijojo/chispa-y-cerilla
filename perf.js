'use strict';
/* ================= RENDIMIENTO: picture quality adapts so slower computers don't lag =================
   Alta  = full resolution (up to 2x on sharp screens), film grain and colour filters.
   Media = 1x resolution, no film grain, no colour filters on skins, fewer particles.
   Baja  = 0.75x resolution, no vignette either, even fewer particles.
   Auto  = starts at Alta and steps down by itself if the game runs under ~45 frames a second. */
const PERF={base:DPR,level:0,ema:16.7,slow:0,last:0,toastT:0,toast:'',auto:true};
const PERF_NAMES=['Alta','Media','Baja'];
function perfLabel(){const q=cfg.quality||'auto';return q==='auto'?`Auto (ahora: ${PERF_NAMES[PERF.level]})`:PERF_NAMES[['alta','media','baja'].indexOf(q)]||'Auto';}
function perfApply(lv){PERF.level=clamp(lv,0,2);const d=[PERF.base,1,.75][PERF.level];DPR=Math.min(PERF.base,d);const w=Math.round(W*DPR),h=Math.round(H*DPR);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}}
function perfFromCfg(){const q=cfg.quality||'auto';PERF.auto=q==='auto';PERF.slow=0;perfApply(q==='media'?1:q==='baja'?2:PERF.auto?PERF.level:0);}
/* colour filters (skins, ghosts) are the most expensive canvas effect: skipped below Alta */
(()=>{try{const P=CanvasRenderingContext2D.prototype,fd=Object.getOwnPropertyDescriptor(P,'filter');if(!fd||!fd.set)return;
  Object.defineProperty(ctx,'filter',{configurable:true,get(){return fd.get.call(ctx);},set(v){if(PERF.level>0&&v&&v!=='none')return;fd.set.call(ctx,v);}});}catch(_){}})();
/* film grain and scratches only at Alta; the vignette goes away at Baja */
const _filmLayerP=filmLayer;
filmLayer=function(t){if(PERF.level===0){_filmLayerP(t);return;}if(PERF.level===1)ctx.drawImage(VIG,0,0,W,H);};
/* keep particles in check */
const _stepP=step;
step=function(dt){_stepP(dt);if(PERF.level>0&&LV&&LV.fx){const cap=PERF.level===1?160:100;if(LV.fx.length>cap)LV.fx.splice(0,LV.fx.length-cap);}};
/* watch the real frame rate and step quality down when it stays low */
const _renderP=render;
render=function(){const now=performance.now(),dt=PERF.last?now-PERF.last:16.7;PERF.last=now;_renderP();
  if(dt<250&&!document.hidden){PERF.ema+=(dt-PERF.ema)*.05;
    if(PERF.auto&&PERF.level<2&&scene==='level'&&LV&&LV.state==='play'){if(PERF.ema>22)PERF.slow+=dt;else PERF.slow=Math.max(0,PERF.slow-dt*.5);
      if(PERF.slow>2500){perfApply(PERF.level+1);PERF.slow=0;PERF.ema=16.7;PERF.toast=`Calidad automática: ${PERF_NAMES[PERF.level]} · para que el juego no se trabe`;PERF.toastT=3.5;}}}
  if(PERF.toastT>0){PERF.toastT-=dt/1000;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=Math.min(1,PERF.toastT*2);card(W/2-230,10,460,30,'rgba(43,29,20,.9)',2.5,8);btxt(PERF.toast,W/2,25,13,C.gold,'center',800);ctx.restore();}};
perfFromCfg();
if(window.__game)Object.assign(window.__game,{PERF,perfApply});
