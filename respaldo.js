/* ---------- respaldo: copia de seguridad automática de cada partida + recuperar progreso ---------- */
(()=>{
const BK=i=>'chispa-respaldo-v1-'+i;
const score=s=>{if(!s)return -1;let n=0;for(const k in s.cleared||{})if(s.cleared[k])n+=3;n+=Object.keys(s.visited||{}).length*40;n+=Math.min(200,(s.owned||[]).length*4);n+=Math.min(60,(s.coins||0)/5);if(s.intro)n+=2;if(s.ended)n+=100;return n;};
const readBK=i=>{try{const s=JSON.parse(localStorage.getItem(BK(i))||'null');return s&&Array.isArray(s.owned)?s:null;}catch(_){return null;}};
const rawSlot=i=>{try{const s=JSON.parse(localStorage.getItem(slotKey(i))||'null');return s&&Array.isArray(s.owned)?s:null;}catch(_){return null;}};
function keepBest(i,s){if(!s)return;const b=readBK(i);if(score(s)>=score(b)&&score(s)>0){try{localStorage.setItem(BK(i),JSON.stringify(s));}catch(_){}}}
// al abrir el juego: copia lo que haya guardado ahora mismo
for(let i=0;i<SLOTS;i++)keepBest(i,rawSlot(i));
// cada vez que se guarda: primero respalda lo que había, luego guarda, luego respalda lo nuevo si es mejor
const _p=persist;persist=function(){keepBest(slot,rawSlot(slot));const r=_p.apply(this,arguments);keepBest(slot,rawSlot(slot));return r;};
window.chispaRespaldo={score,readBK,BK};

/* --- menú de recuperar en la pantalla de partidas (tecla de cambiar arma / botón ARMA / Y) --- */
const RC={on:false,sel:0,opts:[],msg:null,msgT:0};
const NAMES={2:'Bahía Bruma',3:'Cumbre Apagón',4:'Valle Escarcha'};
function levelNodes(i){const w=WORLDS[i];return w?w.nodes.filter(n=>n.kind==='level'&&LEVELS[n.id]).map(n=>n.id):[];}
function rebuild(i,N){const s=readSlot(i)||defSave();s.intro=true;s.clearedN=s.clearedN||{};
  for(let k=1;k<=N;k++){s.visited[k]=true;}
  for(let k=1;k<N;k++)for(const id of levelNodes(k)){if(!s.cleared[id]){s.cleared[id]=true;s.done[id]=s.done[id]||'B';}s.clearedN[id]=true;}
  s.coins=(s.coins||0)+60*(N-1);s.island=N;s.pos=s.pos||{};s.pos[N]=WORLDS[N].dockArr;s.flags=s.flags||{};
  for(let k=1;k<N;k++)s.flags['fin'+k]=true;
  try{localStorage.setItem(slotKey(i),JSON.stringify(s));}catch(_){}keepBest(i,s);}
function open(){const i=SL.sel,cur=readSlot(i),b=readBK(i),opts=[];
  if(b&&score(b)>score(cur)){const isl=Math.max(...Object.keys(b.visited||{1:1}).map(Number));const done=ALL_LEVELS.filter(k=>b.cleared&&b.cleared[k]).length;
    opts.push({label:`Restaurar copia guardada (isla ${isl}, ${Math.round(done/ALL_LEVELS.length*100)} %)`,fn:()=>{try{localStorage.setItem(slotKey(i),JSON.stringify(b));}catch(_){}return '¡Copia restaurada!';}});}
  const far=cur?Math.max(...Object.keys(cur.visited||{1:1}).map(Number)):1;
  for(let N=Math.max(2,far+1);N<=4;N++)opts.push({label:`Perdí mi avance: yo ya iba en ${NAMES[N]} (isla ${N})`,fn:()=>{rebuild(i,N);return `¡Listo! Vuelves a ${NAMES[N]} con las islas anteriores completas y ${60*(N-1)} monedas extra para recomprar tus cosas.`;}});
  opts.push({label:'Cancelar',fn:()=>null});RC.opts=opts;RC.sel=0;RC.on=true;sfx('select');}
const _u=updSlots;updSlots=function(dt,IN){const I=IN.M;if(RC.msgT>0)RC.msgT-=dt;
  if(RC.on){if(I.up){RC.sel=(RC.sel+RC.opts.length-1)%RC.opts.length;sfx('move');}if(I.down){RC.sel=(RC.sel+1)%RC.opts.length;sfx('move');}
    if(I.no||I.pause){RC.on=false;return;}if(I.ok){const m=RC.opts[RC.sel].fn();RC.on=false;if(m){RC.msg=m;RC.msgT=4;sfx('victory');}}return;}
  if(I.tab){SL.del=false;open();return;}_u(dt,IN);};
const _d=drawSlots;drawSlots=function(){_d();btxt('ARMA (Y / cambiar arma): recuperar progreso perdido',W/2,482,15,C.brass||'#e2b24a','center',800);
  if(RC.msgT>0&&RC.msg){rr(W/2-380,500,760,34,8,C.paper,3);btxt(RC.msg,W/2,522,14,C.ink,'center',800);}
  if(!RC.on)return;ctx.fillStyle='rgba(20,13,8,.72)';ctx.fillRect(0,0,W,H);const h=96+RC.opts.length*38,y0=H/2-h/2;
  rr(W/2-360,y0,720,h,12,C.paper,4);txt('RECUPERAR PROGRESO · Partida '+'ABC'[SL.sel],W/2,y0+44,24,C.ink,null);
  RC.opts.forEach((o,k)=>{const y=y0+86+k*38,on=k===RC.sel;if(on)rr(W/2-340,y-20,680,32,6,C.brass||'#e2b24a',2);btxt(o.label,W/2,y+2,16,C.ink,'center',on?900:600);});};
try{cv.addEventListener('pointerdown',e=>{if(scene!=='slots'||RC.on)return;const r=cv.getBoundingClientRect(),y=(e.clientY-r.top)/r.height*H;if(y>466&&y<498){SL.del=false;open();}});}catch(_){}
})();
