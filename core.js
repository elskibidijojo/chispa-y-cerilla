'use strict';
/* ================= CORE: canvas, palette, utils, settings, saves, input, sfx ================= */
const cv=document.getElementById('game'),ctx=cv.getContext('2d',{alpha:false});
const W=960,H=540,GROUND=448,TAU=Math.PI*2;
let DPR=Math.min(2,window.devicePixelRatio||1);cv.width=W*DPR;cv.height=H*DPR;
const REDUCE=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
if(!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r||0,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();};}
const C={ink:'#140d08',paper:'#efe0bf',paper2:'#e3cd9d',rust:'#b5402f',rustD:'#8a2d23',brass:'#d9a441',brassD:'#a8772a',steel:'#9a9282',steelD:'#6f685b',
  glass:'#fff3c4',wood:'#7c4f2c',woodL:'#a06a3b',woodD:'#5a3a20',curtain:'#8e2a22',parry:'#2ec4b6',parryL:'#9ff0e6',grass:'#a6ae64',grassD:'#7e8a45',
  sand:'#e2c98f',sea:'#5b8580',seaD:'#466d69',bronze:'#9a7446',bronzeL:'#c49a5f',bronzeD:'#6c4f2c',gold:'#f2c14e',match:'#e2b77a',matchHead:'#c8392b',
  night:'#2b2540',nightL:'#4b4170',plum:'#6b4a7a',moss:'#6f7a45',white:'#fffaf0',shadow:'#231c33'};
const FONT='"Rye", Georgia, serif',BFONT='"Alegreya Sans", system-ui, sans-serif';
let RNG_SIM=null,RI_OVERRIDE=null;const rand=()=>RNG_SIM?RNG_SIM():Math.random(),clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,dist=(a,b,c,d)=>Math.hypot(a-c,b-d),pick=a=>a[Math.floor(rand()*a.length)];
function srand(seed){let a=(seed>>>0)||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function circRect(cx,cy,r,rx,ry,rw,rh){const nx=clamp(cx,rx,rx+rw),ny=clamp(cy,ry,ry+rh);return(cx-nx)**2+(cy-ny)**2<r*r;}
function rectHit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
let scene='title',LV=null;

/* ---------- settings ---------- */
const ACTS=['left','right','up','down','jump','shoot','dash','ex','swap','lock'];
const ACT_NAME={left:'Izquierda',right:'Derecha',up:'Arriba · apuntar',down:'Abajo · agacharse',jump:'Saltar · parry',shoot:'Disparar',dash:'Dash',ex:'EX · súper',swap:'Cambiar arma',lock:'Fijar y apuntar'};
const DEF_KEYS={
  /* 1 jugador: estilo Cuphead (flechas + Z X Shift V C Q) o zurdo/WASD (+ K J L I O U) */
  solo:{left:['ArrowLeft','KeyA'],right:['ArrowRight','KeyD'],up:['ArrowUp','KeyW'],down:['ArrowDown','KeyS'],jump:['KeyZ','Space','KeyK'],shoot:['KeyX','KeyJ'],dash:['ShiftLeft','ShiftRight','KeyL'],ex:['KeyV','KeyI'],swap:['KeyQ','KeyU'],lock:['KeyC','KeyO']},
  /* 2 jugadores: J1 a la izquierda (WASD + F G H), J2 a la derecha (flechas + K L Ñ) */
  p1:{left:['KeyA'],right:['KeyD'],up:['KeyW'],down:['KeyS'],jump:['KeyG','Space'],shoot:['KeyF'],dash:['KeyH','ShiftLeft'],ex:['KeyR'],swap:['KeyT'],lock:['KeyV']},
  p2:{left:['ArrowLeft'],right:['ArrowRight'],up:['ArrowUp'],down:['ArrowDown'],jump:['KeyL'],shoot:['KeyK'],dash:['Semicolon','ShiftRight'],ex:['KeyO'],swap:['KeyI'],lock:['Comma']},
  /* 3 jugadores sin teclado numérico (Chromebook): tres zonas del teclado */
  t1:{left:['KeyA'],right:['KeyD'],up:['KeyW'],down:['KeyS'],jump:['KeyC'],shoot:['KeyX'],dash:['KeyV','ShiftLeft'],ex:['KeyE'],swap:['KeyQ'],lock:['KeyZ']},
  t2:{left:['KeyF'],right:['KeyH'],up:['KeyT'],down:['KeyG'],jump:['KeyK'],shoot:['KeyJ'],dash:['KeyL'],ex:['KeyI'],swap:['KeyU'],lock:['KeyO']},
  t3:{left:['ArrowLeft'],right:['ArrowRight'],up:['ArrowUp'],down:['ArrowDown'],jump:['Slash'],shoot:['Period'],dash:['ShiftRight','Quote'],ex:['Semicolon'],swap:['BracketLeft'],lock:['Comma']}};
const PROFS=['solo','p1','p2','t1','t2','t3'];
const CFG_KEY='chispa-cfg-v3';
const cloneKeys=()=>JSON.parse(JSON.stringify(DEF_KEYS));
function defCfg(){return{players:1,char:'chispa',diff:'normal',music:.7,sfx:.9,shake:true,grain:true,keys:cloneKeys()};}
let cfg=defCfg();
try{const s=JSON.parse(localStorage.getItem(CFG_KEY)||'null');if(s){cfg=Object.assign(defCfg(),s);const k=cloneKeys();for(const pr of PROFS)if(s.keys&&s.keys[pr])for(const a of ACTS)if(Array.isArray(s.keys[pr][a])&&s.keys[pr][a].length)k[pr][a]=s.keys[pr][a];cfg.keys=k;}}catch(_){}
function saveCfg(){try{localStorage.setItem(CFG_KEY,JSON.stringify(cfg));}catch(_){}applyVol();updateLegend();}
const KEYLAB={ArrowLeft:'←',ArrowRight:'→',ArrowUp:'↑',ArrowDown:'↓',Space:'Espacio',ShiftLeft:'Shift',ShiftRight:'Shift der.',ControlLeft:'Ctrl',ControlRight:'Ctrl der.',AltLeft:'Alt',
  Semicolon:'Ñ',Comma:',',Period:'.',Slash:'-',Quote:'´',BracketLeft:'`',BracketRight:'+',Backslash:'ç',Minus:"'",Equal:'¡',Enter:'Enter',Tab:'Tab',Backspace:'Borrar',CapsLock:'Bloq Mayús',Backquote:'º',IntlBackslash:'<'};
function keyLabel(c){if(!c)return'—';if(KEYLAB[c])return KEYLAB[c];if(c.startsWith('Key'))return c.slice(3);if(c.startsWith('Digit'))return c.slice(5);if(c.startsWith('Numpad'))return'Num '+c.slice(6);return c;}
function updateLegend(){const el=document.getElementById('legend');if(!el)return;
  const row=(who,k)=>`<div class="row"><span class="who">${who}</span>`+[['left','right','up','down'],['jump'],['shoot'],['dash'],['ex'],['swap'],['lock']].map(g=>`<span>${g.map(a=>`<kbd>${keyLabel(k[a][0])}</kbd>`).join('')} ${g.length>1?'moverse':ACT_NAME[g[0]].split(' · ')[0].toLowerCase()}</span>`).join('')+'</div>';
  el.innerHTML=(cfg.players===3?row('Jugador 1',cfg.keys.t1)+row('Jugador 2',cfg.keys.t2)+row('Jugador 3',cfg.keys.t3):cfg.players===2?row('Jugador 1',cfg.keys.p1)+row('Jugador 2',cfg.keys.p2):row('Controles',cfg.keys.solo)+row('o también',Object.fromEntries(ACTS.map(a=>[a,[cfg.keys.solo[a][1]||cfg.keys.solo[a][0]]]))))+
    `<div class="row"><span class="who">Menús</span><span><kbd>Enter</kbd> aceptar</span><span><kbd>Esc</kbd> volver · pausa</span><span><kbd>M</kbd> silenciar</span><span>Mando: A saltar · X disparar · B EX · RB dash · Y cambiar · LB fijar</span></div>`;}

/* ---------- save slots ---------- */
const SLOTS=3,slotKey=i=>'chispa-partida-v2-'+i;
function defEq(){return{w1:'chispa',w2:null,charm:null,sup:'chispazo'};}
function defSave(){return{coins:0,owned:['chispa','chispazo'],eq:[defEq(),defEq(),defEq()],done:{},cleared:{},taken:{},flags:{},island:1,visited:{1:true},pos:{},intro:false,ended:false,deaths:0,time:0};}
let slot=0,save=defSave();
function readSlot(i){try{const s=JSON.parse(localStorage.getItem(slotKey(i))||'null');if(s&&Array.isArray(s.owned)){const d=defSave(),r=Object.assign(d,s);
  r.eq=[0,1,2].map(i=>Object.assign(defEq(),(s.eq||[])[i]||{}));return r;}}catch(_){}return null;}
(()=>{try{if(readSlot(0))return;const o=JSON.parse(localStorage.getItem('chispa-isla-hojalata-v1')||'null');if(!o)return;const s=defSave();
  s.coins=o.coins||0;s.owned=[...new Set(['chispa','chispazo',...(o.owned||[])])];s.cleared=o.cleared||{};s.done=o.done||{};s.intro=true;
  if(o.eq){s.eq[0].w1=o.eq.w1||'chispa';s.eq[0].w2=o.eq.w2||null;s.eq[0].charm=o.eq.charm||null;}localStorage.setItem(slotKey(0),JSON.stringify(s));}catch(_){}})();
function persist(){try{localStorage.setItem(slotKey(slot),JSON.stringify(save));}catch(_){}}

/* ---------- input ---------- */
const keysDown=new Set(),tapQ=new Set(),touch={},pulse={};let capture=null;
const NOSCROLL=new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Tab','Backspace']);
addEventListener('keydown',e=>{unlock();if(capture){e.preventDefault();const f=capture;capture=null;f(e.code);return;}
  keysDown.add(e.code);tapQ.add(e.code);if(NOSCROLL.has(e.code))e.preventDefault();if(e.code==='KeyM'&&!e.repeat){muted=!muted;applyVol();}});
addEventListener('keyup',e=>keysDown.delete(e.code));
addEventListener('blur',()=>{keysDown.clear();for(const k in touch)touch[k]=false;if(typeof autoPause==='function')autoPause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&typeof autoPause==='function')autoPause();});
cv.addEventListener('pointerdown',()=>{unlock();try{cv.focus({preventScroll:true});}catch(_){}if(!(scene==='level'&&LV&&LV.state==='play'))pulse.ok=true;});
document.querySelectorAll('#touch button').forEach(b=>{const a=b.dataset.a;
  const on=e=>{e.preventDefault();unlock();touch[a]=true;b.classList.add('on');try{b.setPointerCapture(e.pointerId);}catch(_){}};
  const off=()=>{touch[a]=false;b.classList.remove('on');};
  b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('lostpointercapture',off);
  b.addEventListener('contextmenu',e=>e.preventDefault());});
function padRaw(i){try{if(!navigator.getGamepads)return null;const gs=[...navigator.getGamepads()].filter(Boolean),g=gs[i];if(!g)return null;
  const b=k=>!!(g.buttons[k]&&g.buttons[k].pressed),ax=g.axes[0]||0,ay=g.axes[1]||0;
  return{left:b(14)||ax<-.45,right:b(15)||ax>.45,up:b(12)||ay<-.55,down:b(13)||ay>.55,jump:b(0),shoot:b(2)||b(7),ex:b(1),dash:b(5)||b(6),swap:b(3),lock:b(4),start:b(9),back:b(8)};}catch(_){return null;}}
let prevP=[{},{},{}],prevM={};
/* online play: the friend's controls arrive from the network and drive player 2 (see net.js) */
const NETIN={on:false,s:[null,{on:false,h:{},t:0},{on:false,h:{},t:0}],ok:false,no:false,pause:false};
function readInputs(){if(RI_OVERRIDE)return RI_OVERRIDE;const kd=c=>keysDown.has(c)||tapQ.has(c);const R=NETIN.on?NETIN:null;const np=R?Math.max(2,cfg.players||1):cfg.players||1,two=np>=2,prof=R?[cfg.keys.solo,null,null]:np===3?[cfg.keys.t1,cfg.keys.t2,cfg.keys.t3]:np===2?[cfg.keys.p1,cfg.keys.p2,null]:[cfg.keys.solo,null,null];
  const out=[0,1,2].map(i=>{const h={},k=prof[i],pad=R?(i===0?padRaw(0):null):padRaw(two?i:0),rh=R&&i>0&&R.s[i]&&R.s[i].on?R.s[i].h:null;
    if(i>=np){for(const a of ACTS)h[a]=false;}
    else for(const a of ACTS)h[a]=(k?k[a].some(c=>kd(c)):false)||!!(pad&&pad[a])||(i===0&&!!touch[a])||!!(rh&&rh[a]);
    h.start=!!(pad&&pad.start)||(i===0&&!!touch.pause)||!!(rh&&rh.start);h.back=!!(pad&&pad.back);
    const p={};for(const a in h)p[a]=h[a]&&!prevP[i][a];prevP[i]=h;return{h,p};});
  const any=a=>out[0].h[a]||out[1].h[a]||out[2].h[a];
  const mh={up:any('up')||kd('ArrowUp'),down:any('down')||kd('ArrowDown'),left:any('left')||kd('ArrowLeft'),right:any('right')||kd('ArrowRight'),
    ok:kd('Enter')||kd('NumpadEnter')||any('jump')||any('shoot')||!!(R&&R.ok),no:kd('Escape')||kd('Backspace')||any('dash')||any('back')||!!(R&&R.no),
    pause:kd('Escape')||kd('KeyP')||any('start')||!!(R&&R.pause),n1:kd('Digit1'),n2:kd('Digit2'),n3:kd('Digit3'),n4:kd('Digit4'),alt:any('ex'),tab:any('swap'),equip:kd('ShiftLeft')||kd('ShiftRight')||any('dash')||any('back')};
  const mp={};for(const a in mh)mp[a]=mh[a]&&!prevM[a];prevM=mh;if(pulse.ok){mp.ok=true;delete pulse.ok;}
  tapQ.clear();return{P:out,M:mp,MH:mh};}

/* ---------- sound effects ---------- */
let AC=null,MUSG=null,SFXG=null,NOISE=null,muted=false;
function unlock(){try{if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();MUSG=AC.createGain();SFXG=AC.createGain();const comp=AC.createDynamicsCompressor();
  MUSG.connect(comp);SFXG.connect(comp);const dl=AC.createDelay(.5),fb=AC.createGain(),wet=AC.createGain();dl.delayTime.value=.11;fb.gain.value=.28;wet.gain.value=.22;SFXG.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(comp);comp.connect(AC.destination);const n=AC.sampleRate;NOISE=AC.createBuffer(1,n,n);const d=NOISE.getChannelData(0);for(let i=0;i<n;i++)d[i]=rand()*2-1;applyVol();
  if(typeof Music!=='undefined')Music.restart();}else if(AC.state==='suspended')AC.resume();}catch(_){}}
function applyVol(){if(!AC)return;MUSG.gain.value=muted?0:cfg.music*.75;SFXG.gain.value=muted?0:cfg.sfx*.9;}
function tn(f,d,o={}){const t=AC.currentTime+(o.at||0),os=AC.createOscillator(),g=AC.createGain();os.type=o.type||'square';os.frequency.setValueAtTime(f,t);
  if(o.slide)os.frequency.exponentialRampToValueAtTime(Math.max(20,f+o.slide),t+d);const v=o.v??.05;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  let node=os;if(o.lp){const fl=AC.createBiquadFilter();fl.type='lowpass';fl.frequency.value=o.lp;os.connect(fl);node=fl;}node.connect(g);g.connect(SFXG);os.start(t);os.stop(t+d+.03);}
function nz(d,o={}){const t=AC.currentTime+(o.at||0),s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NOISE;s.loop=true;f.type=o.type||'bandpass';
  f.frequency.setValueAtTime(o.f||1500,t);if(o.fs)f.frequency.exponentialRampToValueAtTime(o.fs,t+d);f.Q.value=o.q??1;const v=o.v??.1;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(f);f.connect(g);g.connect(SFXG);s.start(t,rand()*.5);s.stop(t+d+.03);}
const lastS={};function lim(k,t){const n=AC.currentTime;if(lastS[k]&&n-lastS[k]<t)return true;lastS[k]=n;return false;}
const SHOTS={chispa:()=>tn(980+rand()*80,.04,{v:.018}),abanico:()=>tn(620,.05,{v:.022,type:'sawtooth',lp:2000}),luciernaga:()=>tn(700,.07,{type:'sine',v:.03,slide:600}),
  rebote:()=>tn(260,.09,{type:'triangle',v:.05,slide:180}),tachuelas:()=>{tn(1500,.02,{v:.02});nz(.03,{f:4000,v:.04});},burbujas:()=>tn(400,.1,{type:'sine',v:.04,slide:500}),
  sierra:()=>nz(.06,{f:3000,q:4,v:.05}),arco:()=>{nz(.05,{f:5000,type:'highpass',v:.05});tn(1800,.03,{v:.015,type:'sawtooth'});},taladro:()=>tn(110+rand()*20,.07,{type:'sawtooth',v:.03,lp:900})};
const SFX={
  shot(w){if(lim('shot',.05))return;if(w==='chispa'||!SHOTS[w]){tn(1300+rand()*200,.03,{type:'square',v:.016,slide:-700,lp:4000});nz(.025,{f:3500,v:.03,q:2});}else SHOTS[w]();},
  hit(){if(lim('hit',.07))return;tn(240+rand()*60,.03,{v:.018});},
  ex(){tn(160,.35,{type:'sawtooth',v:.07,slide:500,lp:2500});nz(.3,{f:900,fs:200,v:.12});},
  super(){[131,165,196,262].forEach(f=>tn(f,.8,{type:'sawtooth',v:.05,lp:2200}));nz(.25,{f:5000,type:'highpass',v:.12});[523,659,784,1047].forEach((f,i)=>tn(f,.5,{type:'sawtooth',v:.045,at:.15+i*.06,lp:3500}));nz(1,{f:300,fs:3000,v:.12,at:.3});},
  parry(){tn(2093,.18,{type:'square',v:.05,lp:5000});tn(3136,.35,{type:'sine',v:.06,at:.04});tn(4186,.3,{type:'sine',v:.035,at:.08});nz(.06,{f:7000,type:'highpass',v:.08});tn(1047,.4,{type:'triangle',v:.04,at:.02});},
  hurt(){nz(.12,{f:1200,v:.2,q:.8});tn(520,.08,{type:'square',v:.07,slide:-300});tn(180,.35,{type:'sawtooth',v:.06,slide:-110,lp:900,at:.05});[0,.06,.12,.18].forEach(a=>tn(900-a*2000,.05,{type:'triangle',v:.03,at:.1+a}));},
  death(){nz(.3,{f:2500,fs:400,q:2,v:.16});tn(1400,1.1,{type:'sine',v:.07,slide:-1200,at:.15});[392,349,311,262].forEach((f,i)=>tn(f,i<3?.25:.8,{type:'sawtooth',v:.05,at:.6+i*.26,lp:1100}));},
  revive(){[523,659,784,1047,1319].forEach((f,i)=>tn(f,.25,{type:'triangle',v:.05,at:i*.06}));},
  ko(){[1568,2093,2637].forEach((f,i)=>tn(f,1.6,{type:'sine',v:.06,at:i*.01}));nz(1.6,{f:4500,type:'highpass',v:.15});tn(80,.8,{type:'sine',v:.25,slide:-40});[523,659,784,1047,1319].forEach((f,i)=>tn(f,.5,{type:'sawtooth',v:.045,at:.45+i*.1,lp:3000}));},
  coin(){tn(1568,.06,{type:'square',v:.035,lp:5000});tn(2093,.25,{type:'square',v:.035,at:.06,lp:5000});},
  jump(){if(lim('jump',.05))return;nz(.12,{f:900,fs:3200,q:2,v:.06});tn(420,.1,{type:'sine',v:.03,slide:380});},
  djump(){tn(523,.1,{v:.03,slide:500,type:'triangle'});},
  dash(){nz(.22,{f:2600,fs:500,q:1.2,v:.14});tn(700,.14,{type:'sine',v:.03,slide:-500});nz(.08,{f:300,v:.08,at:.02});},
  land(){if(lim('land',.08))return;nz(.07,{f:220,v:.09});tn(110,.07,{type:'sine',v:.06,slide:-40});},
  select(){tn(880,.06,{v:.04});tn(1320,.08,{v:.04,at:.05});},
  move(){tn(600,.03,{v:.025});},
  deny(){tn(160,.18,{v:.05,type:'sawtooth'});},
  buy(){[784,988,1175,1568].forEach((f,i)=>tn(f,.12,{v:.04,at:i*.07}));},
  boom(){if(lim('boom',.08))return;nz(.45,{f:400,fs:80,q:.8,v:.25});tn(90,.35,{type:'sine',v:.15,slide:-50});},
  zap(){if(lim('zap',.1))return;nz(.25,{f:5000,fs:800,type:'highpass',v:.12});tn(1200,.15,{type:'sawtooth',v:.03,slide:-900});},
  ring(){[1568,1760,1568,1760].forEach((f,i)=>tn(f,.07,{v:.025,at:i*.06}));},
  honk(){tn(110,.5,{type:'sawtooth',v:.06,lp:500});tn(112,.5,{type:'square',v:.035,lp:400});},
  pop(){if(lim('pop',.05))return;tn(500,.06,{type:'sine',v:.05,slide:700});},
  throw(){if(lim('throw',.08))return;nz(.12,{f:900,fs:2500,v:.06});},
  splash(){nz(.3,{f:1200,fs:500,v:.12});},
  knock(){if(lim('knock',.06))return;tn(520,.05,{type:'square',v:.05,slide:-200,lp:1800});tn(340,.07,{type:'triangle',v:.06,slide:-120});},
  smoke(){nz(.35,{f:900,fs:250,q:.7,v:.12});tn(180,.2,{type:'sine',v:.05,slide:-90});},
  urn(){[880,1175,880,1175].forEach((f,i)=>tn(f,.09,{type:'triangle',v:.04,at:i*.07}));},
  crack(){nz(.5,{f:2600,fs:400,q:1.5,v:.2});tn(140,.4,{type:'sawtooth',v:.06,slide:-80,lp:900});},
  soul(){[784,988,1175,1568].forEach((f,i)=>tn(f,.5,{type:'sine',v:.035,at:.35+i*.12}));tn(392,1.4,{type:'triangle',v:.03,slide:400,at:.3});},
  crumble(){if(lim('crumble',.09))return;nz(.08,{f:500,v:.06,q:2});},
  stomp(){tn(70,.25,{type:'sine',v:.2,slide:-30});nz(.2,{f:200,v:.15});},
  warn(){tn(880,.07,{v:.03});tn(880,.07,{v:.03,at:.12});},
  ready(){[[392,0,.12],[392,.14,.08],[523,.24,.12],[659,.38,.12],[784,.52,.45]].forEach(([f,a,d])=>{tn(f,d,{type:'sawtooth',v:.05,at:a,lp:2800,vib:5});tn(f/2,d,{type:'square',v:.025,at:a,lp:1200});});nz(.6,{f:5000,type:'highpass',v:.07,at:.52});},
  swap(){tn(660,.05,{v:.03});tn(990,.05,{v:.03,at:.05});},
  card(){tn(988,.1,{type:'triangle',v:.04});},
  pause(){tn(440,.08,{v:.03});},
  talk(){if(lim('talk',.06))return;tn(300+rand()*200,.04,{type:'triangle',v:.03});},
  trans(){nz(.5,{f:400,fs:1600,v:.05});},
  victory(){[[523,0],[523,.12],[523,.24],[659,.36],[784,.5],[659,.66],[784,.8],[1047,.95]].forEach(([f,a],i)=>{tn(f,i===7?.8:.12,{type:'sawtooth',v:.05,at:a,lp:3000,vib:i===7?5:0});tn(f/2,.12,{type:'square',v:.025,at:a,lp:1200});});nz(1,{f:5000,type:'highpass',v:.08,at:.95});},
  tick(){tn(1200,.03,{v:.03});},
  stamp(){tn(80,.2,{type:'sine',v:.2,slide:-30});nz(.1,{f:600,v:.15});},
  fire(){if(lim('fire',.1))return;nz(.25,{f:700,fs:1500,q:.6,v:.08});},
  steam(){nz(.4,{f:3000,fs:1500,type:'highpass',v:.07});},
  caw(){tn(700,.12,{type:'sawtooth',v:.03,slide:-300,lp:1500});},
  ding(){tn(2093,.5,{type:'sine',v:.06});tn(4186,.3,{type:'sine',v:.02});},
  magic(){[1047,1319,1568,2093].forEach((f,i)=>tn(f,.15,{type:'triangle',v:.03,at:i*.04}));},
  laugh(){[220,247,220,196].forEach((f,i)=>tn(f,.1,{type:'sawtooth',v:.04,at:i*.11,lp:900}));},
};
function sfx(n,...a){if(!AC||muted||!SFX[n])return;try{SFX[n](...a);}catch(_){}}
