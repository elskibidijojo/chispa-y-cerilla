'use strict';
/* ================= ONLINE SIN LAG: every computer runs the game itself and only the controls travel =================
   The host is the clock. Each 1/60 s tick it packs the three players' controls into one small record and sends it.
   Friends replay those records on their own copy of the game, with the same random numbers, so all screens match
   without streaming any video. If something ever drifts apart, that friend falls back to the old video picture
   until the host is back on the map, and then everyone is re-synchronised. */
const NP_TICK=1/60;
const NP={on:false,role:null,tick:0,acc:0,last:0,rng:null,rc:0,prevP:[{},{},{}],prevM:{},np:1,inTick:false,
  out:[],hist:[],buf:new Map(),jit:2,stall:0,gapT:0,lm:-1,lmT:0,bak:null,mqT:0,mqOut:[],hashBad:0,syncT:0,lastRtt:0};
/* --- seeded random numbers (mulberry32) --- */
function npRng(seed){let a=seed>>>0;return()=>{NP.rc++;a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
/* sound and music never touch the shared random numbers: they differ per computer */
{const _s=sfx;sfx=function(){const r=RNG_SIM;RNG_SIM=null;try{return _s.apply(this,arguments);}finally{RNG_SIM=r;}};
  for(const k of Object.keys(Music)){const f=Music[k];if(typeof f==='function')Music[k]=function(){const r=RNG_SIM;RNG_SIM=null;try{return f.apply(this,arguments);}finally{RNG_SIM=r;}};}
  if(typeof musicPhase==='function'){const _m=musicPhase;musicPhase=function(){const r=RNG_SIM;RNG_SIM=null;try{return _m.apply(this,arguments);}finally{RNG_SIM=r;}};}}

/* --- controls packed into one number: 10 actions, start, back, then the menu keys --- */
const NPM={up:12,down:13,left:14,right:15,ok:16,no:17,pause:18,n1:19,n2:20,n3:21,n4:22,equip:23};
function npMaskOf(IN){if(!IN||!IN.P)return 0;let m=0;for(const q of IN.P){if(!q)continue;ACTS.forEach((a,k)=>{if(q.h[a])m|=1<<k;});if(q.h.start)m|=1<<10;if(q.h.back)m|=1<<11;}
  const MH=IN.MH||{};for(const k in NPM)if(MH[k])m|=1<<NPM[k];if(IN.M&&IN.M.ok)m|=1<<NPM.ok;return m;}
function npOldMask(s){const q=NETIN.s[s];if(!q||!q.on)return 0;let m=0;ACTS.forEach((a,k)=>{if(q.h[a])m|=1<<k;});if(q.h.start)m|=1<<10;if(q.ok)m|=1<<NPM.ok;if(q.no)m|=1<<NPM.no;if(q.pause)m|=1<<NPM.pause;return m;}
function npBuildIN(ms,np){const out=[0,1,2].map(i=>{const h={},m=i<np?(ms[i]|0):0;ACTS.forEach((a,k)=>{h[a]=!!(m&(1<<k));});h.start=!!(m&1024);h.back=!!(m&2048);
    const p={};for(const a in h)p[a]=h[a]&&!NP.prevP[i][a];NP.prevP[i]=h;return{h,p};});
  let mm=0;for(let i=0;i<np&&i<3;i++)mm|=ms[i]|0;const b=k=>!!(mm&(1<<NPM[k])),any=a=>out[0].h[a]||out[1].h[a]||out[2].h[a];
  const mh={up:any('up')||b('up'),down:any('down')||b('down'),left:any('left')||b('left'),right:any('right')||b('right'),ok:b('ok')||any('jump')||any('shoot'),no:b('no')||any('dash')||any('back'),
    pause:b('pause')||any('start'),n1:b('n1'),n2:b('n2'),n3:b('n3'),n4:b('n4'),alt:any('ex'),tab:any('swap'),equip:b('equip')||any('dash')||any('back')};
  const mp={};for(const a in mh)mp[a]=mh[a]&&!NP.prevM[a];NP.prevM=mh;return{P:out,M:mp,MH:mh};}
/* this computer's own controls, read as a single player */
function npLocalMask(){const on=NETIN.on,pl=cfg.players;NETIN.on=false;cfg.players=1;let IN;try{IN=readInputs();}finally{NETIN.on=on;cfg.players=pl;}return npMaskOf(IN);}

/* --- one shared tick --- */
function npStep(ms,e){if(e&&e.np!=null)cfg.players=e.np;
  RI_OVERRIDE=npBuildIN(ms,cfg.players||1);RNG_SIM=NP.rng;NP.inTick=true;
  try{step(NP_TICK);if(scene==='level'&&LV&&LV.Ps&&LV.state!=='results'&&LV.Ps.length<Math.min(3,cfg.players||1))netJoinLevel();}
  finally{RI_OVERRIDE=null;RNG_SIM=null;NP.inTick=false;}NP.tick++;}
function npHash(){let s=scene+'|'+(TR?1:0)+'|'+NP.rc+'|'+Math.round(MAPS.x*8)+','+Math.round(MAPS.y*8)+'|'+(save.coins|0);
  if(scene==='level'&&LV){s+='|'+LV.state+'|'+Math.round((LV.t||0)*60);for(const p of LV.Ps||[])s+='|'+Math.round(p.x*8)+','+Math.round(p.y*8)+','+(p.hp|0);
    const B=LV.boss;if(B)s+='|'+Math.round((B.hp||0)*100)+','+Math.round((B.x||0)*4)+','+(B.phase|0);s+='|'+(LV.eb?LV.eb.length:0);if(LV.ents){let n=0,hp=0;for(const e of LV.ents)if(!e.dead){n++;hp+=e.hp||0;}s+='|'+n+','+Math.round(hp*10);}}
  NP.hs=s;let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193);}return h>>>0;}
/* a friend arriving mid-level is added at a tick boundary, so every computer does it at the same moment */
{const _jl=netJoinLevel;netJoinLevel=function(){if(NP.on&&!NP.inTick)return;return _jl.apply(this,arguments);};}
{const _ap=autoPause;autoPause=function(){if(NP.on)return;return _ap.apply(this,arguments);};}
{const _p=persist;persist=function(){if(NP.bak)return;return _p.apply(this,arguments);};}
{const _c=saveCfg;saveCfg=function(){if(NP.bak){try{applyVol();updateLegend();}catch(_){}return;}return _c.apply(this,arguments);};}
{const _o=openOnline;openOnline=function(){if(NP.on){netToast('Ya estás jugando en línea','Para salir usa el botón de arriba a la derecha');return;}return _o.apply(this,arguments);};}

/* --- the starting point everyone copies (only taken on the map, where the whole state is the save + the map) --- */
const NP_MAPKEYS=['x','y','face','anim','moving','t','hintT','trail','banner','shake','jukebox','coinFx','birds'];
function npSnapshot(seed){const mp={};for(const k of NP_MAPKEYS)mp[k]=MAPS[k];
  return{t:'Ls',n:NP.on?NP.tick:0,seed,save:JSON.stringify(save),cfg:{players:cfg.players,char:cfg.char,diff:cfg.diff,cine:cfg.cine},maps:JSON.stringify(mp),clock};}
function npApply(S){const sv=JSON.parse(S.save),isl=save.island;save=sv;Object.assign(cfg,S.cfg);
  scene='map';LV=null;TR=null;Object.assign(MAPS,JSON.parse(S.maps),{near:null,card:null,dialog:null,menu:null});if(isl!==save.island)MAPBG={k:null};
  clock=S.clock;NP.rc=0;NP.rng=npRng(S.seed);NP.prevP=[{},{},{}];NP.prevM={};NP.tick=S.n;NP.on=true;NP.np=cfg.players;NP.acc=0;NP.stall=0;}

/* ================= HOST ================= */
const npLockable=G=>G&&G.open!==false&&G.lsCap&&(G.conn||G.mq)&&!G.room;
function npSlotMask(s){const G=NET.guests[s];if(!G)return 0;if(G.x!=null){if(performance.now()-(G.xT||0)>1500)return 0;return G.x|0;}return npOldMask(s);}
function npSendG(G,m){if(G.conn)netSend(G.conn,m);else if(G.mq&&NET.mq)NET.mq.pubJ(netTopic(NET.code,'to/'+G.mq),m);}
function npSyncAll(){const seed=(Math.random()*4294967296)>>>0;MAPS.card=MAPS.dialog=MAPS.menu=null;const S=npSnapshot(seed);npApply(S);NP.role='host';NP.hist=[];NP.out=[];NP.mqOut=[];
  for(const G of netGuestsOn())if(npLockable(G)&&(G.lsFail||0)<3){npSendG(G,S);G.ls=true;G.slow=false;if(G.call){try{G.call.close();}catch(_){}G.call=null;}G.live=false;}
  netToast('¡Todos sincronizados!','Cada compu mueve su propio juego · sin lag de video',2.6);}
function npHostStop(why){if(!NP.on)return;NP.on=false;NP.role=null;for(const G of netGuestsOn())if(G.ls){G.ls=false;npSendG(G,{t:'Le',why:why||''});npStream(G);}}
function npStream(G){if(G.conn&&!G.mq&&!G.call&&NET.peer){G.slow=false;try{netCallGuest(G);}catch(_){G.slow=true;}}}
const NP_UNSAFE=new Set(['title','slots','online','credits']);
function npHostCheck(){if(NET.role!=='host'){if(NP.on&&NP.role==='host')npHostStop();return;}const g=netGuestsOn();
  if(NP.on){if(!g.some(G=>G.ls)){NP.on=false;NP.role=null;return;}if(NP_UNSAFE.has(scene)){npHostStop('menu');return;}}
  const want=g.filter(G=>npLockable(G)&&!G.ls&&(G.lsFail||0)<3&&performance.now()>(G.lsNext||0));
  if(want.length&&scene==='map'&&!TR&&!MAPS.dialog&&!MAPS.menu&&!MAPS.card)npSyncAll();}
function npHostFrame(dt){NP.acc+=Math.min(dt,.2);const lm=npLocalMask();let n=0;
  while(NP.acc>=NP_TICK-1e-6&&n<4){const ms=[lm,npSlotMask(1),npSlotMask(2)],np=cfg.players||1,rec={n:NP.tick,m:ms};if(np!==NP.np){rec.e={np};NP.np=np;}
    npStep(ms,null);if(NP.tick%20===0){rec.h=npHash();if(NP.dbg)NP.dbg[NP.tick]=NP.hs;}NP.out.push(rec);NP.hist.push(rec);NP.acc-=NP_TICK;n++;if(!NP.on)break;}
  if(n>=4)NP.acc=Math.min(NP.acc,NP_TICK);if(NP.hist.length>900)NP.hist.splice(0,NP.hist.length-900);npFlush();}
function npFlush(){if(!NP.out.length)return;const f=NP.out;NP.out=[];const g=netGuestsOn().filter(G=>G.ls);
  for(const G of g)if(G.conn)netSend(G.conn,{t:'Lf',f});
  if(NET.mq&&g.some(G=>G.mq)){NP.mqOut.push(...f);const now=performance.now();if(NP.mqOut.length>=3||now-NP.mqT>60){NP.mqT=now;NET.mq.pubJ(netTopic(NET.code,'down'),{t:'Lf',f:NP.mqOut});NP.mqOut=[];}}}
function npHostMsg(G,d){if(d.t==='Ld'){if(NP.dbg)console.warn('DESYNC tick',d.n,'\nguest '+d.s+'\nhost  '+NP.dbg[d.n]);if(!G.ls)return;G.ls=false;G.lsFail=(G.lsFail||0)+1;G.lsNext=performance.now()+1500;npStream(G);
    if(G.lsFail>=3)netToast(`${netWho(G.slot)} sigue con video`,'Sus juegos no coincidían');}
  else if(d.t==='Lg'&&G.ls){const from=d.n|0,f=NP.hist.filter(r=>r.n>=from).slice(0,300);if(f.length)npSendG(G,{t:'Lf',f});}
  else if(d.t==='Lw'){G.lsNext=0;}}

/* ================= GUEST ================= */
function npGuestMsg(d){if(NET.role!=='guest')return;
  if(d.t==='Ls'){if(!NP.bak)NP.bak={save,cfg:{players:cfg.players,char:cfg.char,diff:cfg.diff,cine:cfg.cine}};const keep=NP.buf;npApply(d);NP.role='guest';NP.buf=new Map();for(const [k,v] of keep)if(k>=d.n)NP.buf.set(k,v);
    NP.jit=NET.tr==='mqtt'?4:2;NP.hashBad=0;NP.syncT=performance.now();NET.st='lock';if(NETV){try{NETV.pause();}catch(_){}NETV.srcObject=null;}
    try{Music.play(MAPS.jukebox||curWorld().song);}catch(_){}netToast('¡Sincronizado!',`Eres ${netWho(NET.slot)} · el juego corre en tu compu`,2.6);return;}
  if(d.t==='Lf'&&Array.isArray(d.f)){for(const r of d.f)if(r&&typeof r.n==='number'&&Array.isArray(r.m)&&(!NP.on||r.n>=NP.tick))NP.buf.set(r.n,r);
    if(NP.buf.size>2400){const ks=[...NP.buf.keys()].sort((a,b)=>a-b);for(const k of ks.slice(0,NP.buf.size-2400))NP.buf.delete(k);}return;}
  if(d.t==='Le'){npGuestFall(d.why==='menu'?'El anfitrión está en el menú':'');}}
function npGuestFall(msg){if(!NP.on)return;NP.on=false;NP.role=null;NP.buf=new Map();NET.st=NET.tr==='mqtt'?'relay':'signal';NET.img=null;
  if(NET.gMus)NET.gMus.name=undefined;if(msg)netToast(msg,'Mientras tanto ves su pantalla');}
function npGuestUp(m){if(NET.tr==='mqtt'){if(NET.mq&&NET.mqUp)NET.mq.pubJ(NET.mqUp,m);}else netSend(NET.conn,m);}
function npGuestFrame(dt){const now=performance.now(),lm=npLocalMask();
  if(lm!==NP.lm||now-NP.lmT>(NET.tr==='mqtt'?220:100)){NP.lm=lm;NP.lmT=now;npGuestUp({t:'in',m:0,x:lm});}
  NP.acc+=Math.min(dt,.2);let avail=0;while(NP.buf.has(NP.tick+avail))avail++;
  let steps=Math.floor(NP.acc/NP_TICK);NP.acc-=steps*NP_TICK;
  if(avail-steps>NP.jit+2)steps+=Math.min(3,avail-steps-NP.jit);
  if(!avail){NP.acc=Math.min(NP.acc,NP_TICK);NP.stall+=dt;if(NP.stall>.25&&NP.jit<8){NP.jit++;NP.stall=0;}
    if(NP.buf.size&&now-NP.gapT>400){let lo=Infinity;for(const k of NP.buf.keys())if(k>NP.tick&&k<lo)lo=k;if(lo<Infinity){NP.gapT=now;npGuestUp({t:'Lg',n:NP.tick});}}
    else if(!NP.buf.size&&NP.stall>2&&now-NP.gapT>2000){NP.gapT=now;npGuestUp({t:'Lg',n:NP.tick});}}
  else if(NP.jit>2&&avail>NP.jit+6)NP.jit--;
  steps=Math.min(steps,avail,6);
  for(let i=0;i<steps;i++){const r=NP.buf.get(NP.tick);NP.buf.delete(NP.tick);npStep(r.m,r.e);
    if(r.h!=null&&npHash()!==r.h){npGuestUp({t:'Ld',n:NP.tick,s:NP.hs});npGuestFall('Se desincronizó un momento');return;}}
  for(const k of NP.buf.keys())if(k<NP.tick)NP.buf.delete(k);}
function npGuestEnd(){if(!NP.bak)return;const B=NP.bak;NP.bak=null;NP.on=false;NP.role=null;NP.buf=new Map();save=B.save;Object.assign(cfg,B.cfg);MAPBG={k:null};try{placeOnMap();}catch(_){}}

/* ================= the loop: fixed ticks while playing in sync ================= */
const _frameNP=frame;
frame=function(now){if(NP.role==='test'){requestAnimationFrame(frame);return;}try{npHostCheck();}catch(e){console.error(e);}
  if(!NP.on){NP.last=now;return _frameNP(now);}
  const dt=Math.min(.25,Math.max(0,(now-(NP.last||now))/1000));NP.last=now;
  try{if(NP.role==='host')npHostFrame(dt);else npGuestFrame(dt);if(NET.role)netSyncDom(0);render();}catch(err){console.error(err);}
  requestAnimationFrame(frame);};
if(window.__game)Object.assign(window.__game,{NP,npStep,npHash,npApply,npSnapshot,npRng,npBuildIN,setRng:r=>{RNG_SIM=r;}});
