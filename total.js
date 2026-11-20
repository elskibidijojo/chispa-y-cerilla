/* total.js — more of the old-cartoon-game feel:
   - Filtro de película (Opciones): Color, Dos tiras (two-colour 1930s film), Sepia, Blanco y negro
   - Locutor (Opciones): a voice says "¿Listos?… ¡A pelear!", "¡Nocaut!" and cheers great grades
   - Súper cinema: using a súper on foot or in the plane freezes the frame for an instant with
     letterbox bars, speed lines and a burst in the hero's colour
   - Desafío "Jefe tras jefe": fight every boss of the island one after the other (from Profe Tuerca
     or Esc → Escuela y desafíos)
   Drawing and voice only, except the challenge, which just chains levels. */
(function(){
/* ---------- film filters ---------- */
const FIL={color:'',dostiras:'sepia(.3) hue-rotate(-14deg) saturate(1.55) contrast(1.06)',sepia:'sepia(.85) contrast(1.06) brightness(1.03)',byn:'grayscale(1) contrast(1.18) brightness(1.03)'};
window.applyFiltro=function(){try{const c=document.getElementById('game');if(c)c.style.filter=FIL[cfg.filtro||'color']||'';}catch(e){}};
applyFiltro();

/* ---------- announcer ---------- */
let voice=null;function pickVoice(){try{const vs=speechSynthesis.getVoices();voice=vs.find(v=>/es[-_](ES|MX|US|419)/i.test(v.lang)&&/male|hombre|jorge|diego|pablo|juan|carlos/i.test(v.name))||vs.find(v=>/^es/i.test(v.lang))||null;}catch(e){}}
try{pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}catch(e){}
window.anunciar=function(){};/* the announcer was removed */
function annTick(L){if(!L||!L.boss&&L.kind!=='run')return;const st=L.state;if(L._annS===st)return;const prev=L._annS;L._annS=st;
  if(st==='intro'&&prev===undefined)anunciar(L.kind==='run'?'¿Listos?':'¿Listos?',{rate:.95});
  else if(st==='play'&&(prev==='intro'||prev===undefined))anunciar(L.kind==='run'?'¡A correr!':'¡A pelear!',{rate:1.1,pitch:.8});
  else if(st==='ko')anunciar('¡Nocaut!',{rate:.9,pitch:.65});
  else if(st==='results'&&L.result&&/S|A\+|P/.test(L.result.grade))setTimeout(()=>anunciar(L.result.grade==='S'?'¡Increíble!':'¡Excelente!',{pitch:.8}),2200);}

/* ---------- súper cinema ---------- */
const HC={chispa:'#ffd25a',cerilla:'#ff7a3a',velita:'#7ab8ff'};
function superCine(L){if(L._supSeen==null)L._supSeen=L.supers||0;if((L.supers||0)>L._supSeen){L._supSeen=L.supers;const p=L.Ps.find(q=>q.superK&&!q.dead)||L.Ps[0];L._sc={t0:L.t,x:p.x,y:p.type==='plane'?p.y:p.y-40,c:HC[p.char]||HC.chispa};}
  const S=L._sc;if(!S)return 0;const a=L.t-S.t0;if(a>.75){L._sc=null;return 0;}return a;}
function drawCine(L,a){const S=L._sc;if(!S)return;const k=a<.12?a/.12:a>.55?Math.max(0,1-(a-.55)/.2):1;ctx.save();
  ctx.globalAlpha=.35*k;ctx.fillStyle=S.c;ctx.fillRect(0,0,W,H);ctx.globalAlpha=k;
  ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineCap='round';for(let i=0;i<28;i++){const an=i*TAU/28+i*.37,r1=90+(i%4)*20,r2=r1+180+(i%3)*90;ctx.lineWidth=2+(i%3);ctx.beginPath();ctx.moveTo(S.x+Math.cos(an)*r1,S.y+Math.sin(an)*r1);ctx.lineTo(S.x+Math.cos(an)*r2,S.y+Math.sin(an)*r2);ctx.stroke();}
  const bh=56*k;ctx.fillStyle='#0b0805';ctx.fillRect(0,0,W,bh);ctx.fillRect(0,H-bh,W,bh);ctx.restore();}

/* letterbox bars while the fight is introduced */
function introBars(L){if(L.state!=='intro')return;const k=Math.min(1,L.t/.4);ctx.fillStyle='#0b0805';ctx.fillRect(0,0,W,34*k);ctx.fillRect(0,H-34*k,W,34*k);}

const _dlT=drawLevel;drawLevel=function(L){if(!L){_dlT(L);return;}annTick(L);const a=superCine(L);
  if(a&&a<.75&&L._sc){const z=1+.08*Math.sin(Math.min(1,a/.75)*Math.PI);ctx.save();ctx.translate(L._sc.x,L._sc.y);ctx.scale(z,z);ctx.translate(-L._sc.x,-L._sc.y);try{_dlT(L);}finally{ctx.restore();}drawCine(L,a);}
  else _dlT(L);
  if(L.boss)introBars(L);};

/* ---------- Jefe tras jefe ---------- */
let RUSH=null;window.rushState=()=>RUSH;
window.openRush=function(){const isl=save.island,w=WORLDS[isl];const list=w.nodes.filter(n=>n.kind==='level'&&LEVELS[n.id]&&(LEVELS[n.id].kind==='boss'||LEVELS[n.id].kind==='plane')).map(n=>n.id);
  if(!list.length){say('Profe Tuerca','En esta isla no hay jefes para el desafío.');return;}
  const left=list.filter(id=>!save.cleared[id]);
  if(left.length){say('Profe Tuerca',`Primero vence una vez a todos los jefes de esta isla. Te faltan ${left.length}: ${left.slice(0,3).map(id=>LEVELS[id].name).join(', ')}${left.length>3?'…':''}.`);return;}
  say('Profe Tuerca',`¡Desafío Jefe tras jefe! Pelearás contra los ${list.length} jefes de ${w.name} seguidos, sin volver al mapa. Si caes, se acaba el desafío. ¿Te atreves?`,
    [{label:'¡Vamos!',fn:()=>{RUSH={isl,list,i:0,time:0,hits:0};transition(()=>startLevel(list[0]));}},{label:'Mejor no',fn:()=>{}}]);};
const _alR=afterLevel;afterLevel=function(L){if(!RUSH||L.id!==RUSH.list[RUSH.i]){_alR(L);return;}
  const fail=!!(L.result&&L.result.fail)||L.state!=='results';if(fail){const r=RUSH;RUSH=null;_alR(L);setTimeout(()=>{if(scene==='map')MAPS.banner={t:3,text:`Desafío terminado: llegaste al jefe ${r.i+1} de ${r.list.length}`};},50);return;}
  RUSH.time+=L.time||0;RUSH.hits+=L.hits||0;RUSH.i++;
  if(RUSH.i<RUSH.list.length){const next=RUSH.list[RUSH.i];transition(()=>{startLevel(next);if(LV)banner(LV,`JEFE ${RUSH.i+1} DE ${RUSH.list.length}`,1.6);});return;}
  const r=RUSH;RUSH=null;const key='rush'+r.isl,first=!save.flags[key];save.flags[key]=true;if(first)save.coins=(save.coins||0)+5;persist();if(typeof unlockAch==='function')unlockAch('jefetrasjefe');
  const m=Math.floor(r.time/60),s=Math.floor(r.time%60);transition(()=>{toMap();MAPS.banner={t:4,text:`¡Jefe tras jefe superado! ${m}:${String(s).padStart(2,'0')} · ${r.hits} golpes${first?' · +5 monedas':''}`};});};
/* if you quit a level to the map, the challenge ends */
const _toR=toMap;toMap=function(){if(RUSH&&scene==='level'&&LV&&LV.state!=='results')RUSH=null;_toR();};
if(!ACHD.jefetrasjefe){ACH.push(['jefetrasjefe','Maratón de Jefes','Supera un desafío Jefe tras jefe.',3]);ACHD.jefetrasjefe={id:'jefetrasjefe',name:'Maratón de Jefes',desc:'Supera un desafío Jefe tras jefe.',coins:3};}

/* ---------- levels only count for the boat when won on Normal or Experto ---------- */
window.ensureN=function(){if(!save.clearedN){save.clearedN={};for(const k in save.cleared||{})if(save.cleared[k])save.clearedN[k]=true;}return save.clearedN;};
const _alN2=afterLevel;afterLevel=function(L){const d=LEVELS[L.id];if(d&&L.state==='results'&&!(L.result&&L.result.fail)&&!/^tutorial/.test(L.id)){const k=d.kind;if(true||k==='run'||k==='maus'||k==='mausoleo'){ensureN();save.clearedN[L.id]=true;persist();}}_alN2(L);};
})();
