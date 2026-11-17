/* movil.js — phone controls, redone.
   On a touch screen the game now fills the screen (landscape) and the controls sit on top of it:
   - left thumb: a floating joystick that appears wherever you touch the left side
   - right thumb: big round buttons laid out like a gamepad (SALTO, FUEGO, DASH, EX, ARMA, FIJAR)
   - AUTO keeps shooting for you, ⛶ goes full screen, ⚙ changes the button size and see-through
   - a short buzz on every press (if the phone supports it)
   It feeds the same "touch" input the old buttons used, so nothing else in the game changes. */
(function(){
if(typeof document==='undefined'||!document.body)return;
const css=`
.mv{position:fixed;inset:0;pointer-events:none;z-index:50;display:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;touch-action:none}
body.movil .mv{display:block}
body.movil #touch{display:none!important}
.mv .zone{position:absolute;left:0;bottom:0;width:42vw;height:78vh;pointer-events:auto;touch-action:none}
.mv .zone.small{width:16vw;height:50vh}
.mv .base{position:absolute;width:var(--js);height:var(--js);margin:calc(var(--js)/-2) 0 0 calc(var(--js)/-2);border-radius:50%;border:3px solid rgba(239,224,191,.75);background:rgba(20,13,8,.28);display:none}
.mv .knob{position:absolute;width:calc(var(--js)*.46);height:calc(var(--js)*.46);margin:calc(var(--js)*-.23) 0 0 calc(var(--js)*-.23);border-radius:50%;background:rgba(239,224,191,.9);border:3px solid #140d08;box-shadow:0 3px 0 #140d08;display:none}
.mv .hint{position:absolute;left:3vw;bottom:5vh;width:var(--js);height:var(--js);border-radius:50%;border:3px dashed rgba(239,224,191,.35);display:flex;align-items:center;justify-content:center;color:rgba(239,224,191,.55);font:700 12px var(--body,sans-serif);text-align:center;pointer-events:none}
.mv .btn{position:absolute;pointer-events:auto;touch-action:none;border-radius:50%;border:3px solid #140d08;box-shadow:0 4px 0 #140d08;display:flex;flex-direction:column;align-items:center;justify-content:center;
  font-family:var(--display,Georgia,serif);color:#140d08;opacity:var(--op);transition:transform .05s;line-height:1}
.mv .btn small{font:800 9px var(--body,sans-serif);letter-spacing:.06em;opacity:.7;margin-top:3px}
.mv .btn.on{transform:translateY(3px) scale(.94);box-shadow:0 1px 0 #140d08;filter:brightness(1.15)}
.mv .btn.hot{animation:mvhot .6s infinite alternate}
@keyframes mvhot{from{box-shadow:0 4px 0 #140d08,0 0 0 0 rgba(217,164,65,.0)}to{box-shadow:0 4px 0 #140d08,0 0 0 8px rgba(217,164,65,.55)}}
.mv .b-jump{width:calc(var(--b)*1.25);height:calc(var(--b)*1.25);right:calc(2.5vw + env(safe-area-inset-right,0px));bottom:calc(var(--b)*.55);background:#bfe3d9;font-size:15px}
.mv .b-shoot{width:calc(var(--b)*1.25);height:calc(var(--b)*1.25);right:calc(2.5vw + var(--b)*1.38 + env(safe-area-inset-right,0px));bottom:calc(var(--b)*.12);background:#f0c95c;font-size:15px}
.mv .b-dash{width:var(--b);height:var(--b);right:calc(2.5vw + var(--b)*.15 + env(safe-area-inset-right,0px));bottom:calc(var(--b)*2.02);background:#efe0bf;font-size:13px}
.mv .b-ex{width:var(--b);height:var(--b);right:calc(2.5vw + var(--b)*1.32 + env(safe-area-inset-right,0px));bottom:calc(var(--b)*1.55);background:#e8a0a0;font-size:13px}
.mv .b-swap{width:calc(var(--b)*.78);height:calc(var(--b)*.78);right:calc(2.5vw + var(--b)*2.75 + env(safe-area-inset-right,0px));bottom:calc(var(--b)*1.45);background:#d8cfe8;font-size:11px}
.mv .b-lock{width:calc(var(--b)*.78);height:calc(var(--b)*.78);right:calc(2.5vw + var(--b)*2.85 + env(safe-area-inset-right,0px));bottom:calc(var(--b)*.35);background:#cfe0ef;font-size:11px}
.mv .top{position:absolute;top:calc(1.5vh + env(safe-area-inset-top,0px));width:44px;height:44px;border-radius:12px;font-size:18px;background:rgba(239,224,191,.92)}
.mv .b-pause{right:calc(2vw + env(safe-area-inset-right,0px))}
.mv .b-full{right:calc(2vw + 52px + env(safe-area-inset-right,0px))}
.mv .b-cfg{right:calc(2vw + 104px + env(safe-area-inset-right,0px))}
.mv .b-auto{right:calc(2vw + 156px + env(safe-area-inset-right,0px));width:62px;font:800 11px var(--body,sans-serif)}
.mv .b-auto.lit{background:#f0c95c}
.mv .rot{position:absolute;left:50%;top:8px;transform:translateX(-50%);background:rgba(20,13,8,.85);color:#efe0bf;border:2px solid #d9a441;border-radius:10px;padding:6px 12px;font:700 13px var(--body,sans-serif);display:none;pointer-events:none;white-space:nowrap}
@media (orientation:portrait){body.movil .mv .rot{display:block}}
@media (orientation:landscape){
  body.movil{padding:0!important;overflow:hidden;background:#000}
  body.movil .wrap{max-width:none;gap:0}
  body.movil header,body.movil .legend,body.movil .note{display:none}
  body.movil .stage{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(100vw,177.78dvh);height:auto;aspect-ratio:16/9;border:0;outline:0;border-radius:0}
}
@media (orientation:portrait){
  body.movil .stage{margin-top:64px}
  body.movil header,body.movil .note,body.movil .legend{display:none}
  body.movil .mv .rot{top:auto;bottom:calc(var(--b)*3.6)}
  body.movil .mv .zone{height:45vh}
}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const mv=document.createElement('div');mv.className='mv';
mv.innerHTML=`<div class="zone"></div><div class="hint">mueve<br>aquí</div><div class="base"></div><div class="knob"></div>
<div class="btn b-jump" data-a="jump">SALTO<small>OK</small></div><div class="btn b-shoot" data-a="shoot">FUEGO</div>
<div class="btn b-dash" data-a="dash">DASH<small>ATRÁS</small></div><div class="btn b-ex" data-a="ex">EX</div>
<div class="btn b-swap" data-a="swap">ARMA</div><div class="btn b-lock" data-a="lock">FIJAR</div>
<div class="btn top b-pause" data-a="pause">II</div><div class="btn top b-full" data-x="full">⛶</div><div class="btn top b-cfg" data-x="cfg">⚙</div><div class="btn top b-auto" data-x="auto">AUTO</div>
<div class="rot">Gira el teléfono para jugar mejor ↻</div>`;
document.body.appendChild(mv);
const old=document.getElementById('exBtn');if(old)old.removeAttribute('id');mv.querySelector('.b-ex').id='exBtn';

/* settings: button size and see-through, saved on the phone */
const SIZES=[[58,.7],[66,.8],[76,.85],[66,.55]];let cfg=1;try{cfg=+localStorage.getItem('cyc_mv')||1;}catch(e){}
function applyCfg(){const [b,op]=SIZES[cfg%SIZES.length];mv.style.setProperty('--b',b+'px');mv.style.setProperty('--op',op);mv.style.setProperty('--js',Math.round(b*2)+'px');try{localStorage.setItem('cyc_mv',cfg);}catch(e){}}
applyCfg();
const buzz=()=>{try{navigator.vibrate&&navigator.vibrate(8);}catch(e){}};
function enable(){if(!document.body.classList.contains('movil'))document.body.classList.add('movil');}
if(matchMedia&&matchMedia('(pointer:coarse)').matches)enable();
addEventListener('touchstart',enable,{passive:true,once:true});

/* buttons */
let auto=false;const held={};
mv.querySelectorAll('.btn').forEach(b=>{const a=b.dataset.a,x=b.dataset.x;
  const on=e=>{e.preventDefault();e.stopPropagation();if(typeof unlock==='function')unlock();buzz();b.classList.add('on');try{b.setPointerCapture(e.pointerId);}catch(_){}
    if(a){touch[a]=true;held[a]=true;}
    else if(x==='auto'){auto=!auto;b.classList.toggle('lit',auto);if(!auto&&!held.shoot)touch.shoot=false;}
    else if(x==='cfg'){cfg=(cfg+1)%SIZES.length;applyCfg();}
    else if(x==='full'){const d=document.documentElement;try{if(document.fullscreenElement)document.exitFullscreen();else{const f=d.requestFullscreen||d.webkitRequestFullscreen;const pr=f&&f.call(d);if(pr&&pr.then)pr.then(()=>{try{screen.orientation.lock('landscape').catch(()=>{});}catch(_){}}).catch(()=>{});}}catch(_){}}};
  const off=()=>{b.classList.remove('on');if(a){held[a]=false;touch[a]=a==='shoot'&&auto;}};
  b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('lostpointercapture',off);b.addEventListener('contextmenu',e=>e.preventDefault());});

/* floating joystick */
const zone=mv.querySelector('.zone'),base=mv.querySelector('.base'),knob=mv.querySelector('.knob'),hint=mv.querySelector('.hint');let jid=null,ox=0,oy=0;
function setDir(dx,dy){const R=parseFloat(getComputedStyle(mv).getPropertyValue('--js'))/2||66,m=Math.hypot(dx,dy),k=m>R?R/m:1;knob.style.left=(ox+dx*k)+'px';knob.style.top=(oy+dy*k)+'px';
  const nx=dx/R,ny=dy/R,was=[touch.left,touch.right,touch.up,touch.down];
  touch.left=nx<-.35;touch.right=nx>.35;touch.up=ny<-.5;touch.down=ny>.5;
  if(was[0]!==touch.left||was[1]!==touch.right||was[2]!==touch.up||was[3]!==touch.down)if(touch.left||touch.right||touch.up||touch.down)buzz();}
zone.addEventListener('pointerdown',e=>{e.preventDefault();if(typeof unlock==='function')unlock();jid=e.pointerId;try{zone.setPointerCapture(jid);}catch(_){}ox=e.clientX;oy=e.clientY;
  base.style.left=ox+'px';base.style.top=oy+'px';base.style.display=knob.style.display='block';hint.style.display='none';setDir(0,0);});
zone.addEventListener('pointermove',e=>{if(e.pointerId!==jid)return;e.preventDefault();setDir(e.clientX-ox,e.clientY-oy);});
const jEnd=e=>{if(e.pointerId!==jid)return;jid=null;base.style.display=knob.style.display='none';touch.left=touch.right=touch.up=touch.down=false;};
zone.addEventListener('pointerup',jEnd);zone.addEventListener('pointercancel',jEnd);zone.addEventListener('lostpointercapture',jEnd);

/* keep things tidy every frame: auto-fire only while playing, small joystick area in shop/menus so taps reach the game */
function tick(){try{const sc=typeof scene!=='undefined'?scene:'';const play=sc==='level'||sc==='map';zone.classList.toggle('small',!play);hint.style.display=jid===null&&sc==='level'?'flex':'none';
  if(auto&&!held.shoot)touch.shoot=sc==='level'&&typeof LV!=='undefined'&&LV&&LV.state==='play';}catch(_){}requestAnimationFrame(tick);}
requestAnimationFrame(tick);
})();
