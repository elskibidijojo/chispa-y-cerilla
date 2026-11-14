'use strict';
/* ================= EN LÍNEA: up to three players on different computers, no account needed =================
   The host runs the game. Each friend sees the host's screen live (a WebRTC video stream, the way Remote Play
   works) and their controls drive player 2 or player 3 (Chispa, Cerilla and Velita share the screen).
   The friends find the host with a 4-letter code through the free public PeerJS matchmaking server;
   after that the computers talk to each other directly (or through PeerJS's relay when a network is strict).
   If the video can't get through, the picture is sent as small frames over the same link ("modo lento"). */
const NET_ALPH='ACDEFHJKMNPRTWXY3479',NET_V=3,NET_BITS=[...ACTS,'start'],NET_PREFIX='chispaycerilla-p2p-';
const NET_CHAR_NAME={chispa:'Chispa',cerilla:'Cerilla',velita:'Velita'};
const NET={role:null,st:'off',code:'',peer:null,conn:null,call:null,guests:[null,null,null],slot:0,char:null,msg:'',
  ui:'menu',sel:0,entry:'',esel:21,t:0,ping:0,pingT:0,playersWas:null,timers:[],stream:null,adest:null,
  frameT:0,busy:false,small:null,mus:{name:null,ph:null,v:0},musT:0,gMus:{name:undefined,ph:''},img:null,sendT:0,mask:-1,audioBlocked:false,joinedLevel:null,codeTries:0,server:-1,srvInfo:[null,null,null],scan:null};
function netCode(){let s='';const r=new Uint32Array(4);try{crypto.getRandomValues(r);}catch(_){for(let i=0;i<4;i++)r[i]=Math.floor(Math.random()*1e9);}for(let i=0;i<4;i++)s+=NET_ALPH[r[i]%NET_ALPH.length];return s;}
function netLater(fn,ms){const id=setTimeout(fn,ms);NET.timers.push(id);return id;}
const netPeerId=c=>NET_PREFIX+c.toLowerCase();
const netCharOf=slot=>typeof heroChar==='function'?heroChar(slot):['chispa','cerilla','velita'][slot];
const netWho=slot=>`${NET_CHAR_NAME[netCharOf(slot)]||'Tu amigo'} (Jugador ${slot+1})`;
function netSend(conn,m){try{if(conn&&conn.open)conn.send(m);}catch(_){}}
function netGuestsOn(){return NET.guests.filter(Boolean);}
/* inside Claude the browser can't open direct links, so the game falls back to the artifact's shared room */
NET.apiP=(typeof window!=='undefined'&&window.claude&&typeof window.claude.use==='function')?Promise.resolve().then(()=>window.claude.use('room')).catch(()=>null):Promise.resolve(null);
NET.api=undefined;NET.apiP.then(a=>{NET.api=a||null;});
const netCanP2P=()=>typeof Peer==='function'&&typeof RTCPeerConnection==='function'&&!!cv.captureStream;
const netInClaude=()=>!!(typeof window!=='undefined'&&window.claude);
const netRoomName=c=>'cyc3-'+c.toLowerCase();
function netPres(patch){if(!NET.room)return;try{const p=NET.room.presence(patch);if(p&&p.catch)p.catch(()=>{});}catch(_){}}
const NET_SX_SKIP=new Set(['move','select','back','deny','card','pause','trans','footstepMap','pageTurn']);NET.sx=[];NET.sxn=0;
const _netSfx=sfx;sfx=function(n,...a){if(NET.role==='host'&&NET.guests.some(G=>G&&!G.ls&&(G.room||G.mq))&&!NET_SX_SKIP.has(n)){const v=a[0],av=v==null||typeof v==='object'?null:v;NET.sx.push([++NET.sxn,n,av]);if(NET.sx.length>8)NET.sx.shift();if(NET.mq&&NET.guests.some(G=>G&&G.mq&&!G.ls))NET.mq.pubJ(netTopic(NET.code,'down'),{t:'s',n,a:av});}return _netSfx(n,...a);};

/* ---------- controls packed into one number ---------- */
function netMask(IN){let m=0;const P=IN.P,MH=IN.MH||{};NET_BITS.forEach((a,i)=>{if(P[0].h[a]||P[1].h[a]||P[2].h[a])m|=1<<i;});
  if(MH.ok)m|=1<<11;if(MH.no)m|=1<<12;if(MH.pause)m|=1<<13;return m;}
function netAggregate(){let ok=false,no=false,pause=false;for(const s of[1,2]){const q=NETIN.s[s];if(q&&q.on){ok=ok||!!q.ok;no=no||!!q.no;pause=pause||!!q.pause;}}NETIN.ok=ok;NETIN.no=no;NETIN.pause=pause;}
function netApplyMask(slot,m){const q=NETIN.s[slot];if(!q)return;m=m|0;q.t=performance.now();NET_BITS.forEach((a,i)=>{q.h[a]=!!(m&(1<<i));});q.ok=!!(m&(1<<11));q.no=!!(m&(1<<12));q.pause=!!(m&(1<<13));netAggregate();}
function netClearSlot(slot){const q=NETIN.s[slot];if(!q)return;for(const a of NET_BITS)q.h[a]=false;q.ok=q.no=q.pause=false;netAggregate();}
function netGrainBack(){if(NET.grainWas!=null){cfg.grain=NET.grainWas;NET.grainWas=null;}}
function netSlotsChanged(){const act=[1,2].filter(s=>NET.guests[s]);for(const s of[1,2]){NETIN.s[s].on=!!NET.guests[s];if(!NET.guests[s])netClearSlot(s);}
  if(act.length){if(NET.playersWas==null)NET.playersWas=cfg.players||1;NETIN.on=true;cfg.players=Math.max(2,1+Math.max(...act));}
  else{NETIN.on=false;if(NET.playersWas!=null)cfg.players=NET.playersWas;NET.playersWas=null;netGrainBack();}
  netAggregate();try{updateLegend();}catch(_){}try{netPubHost();}catch(_){}}

/* ---------- music follows the host; the friends hear the sound effects through the stream ---------- */
const _netMusicPlay=Music.play,_netMusicStop=Music.stop;
Music.play=function(name){NET.mus.name=name;NET.mus.ph=null;NET.mus.v++;return _netMusicPlay.apply(this,arguments);};
Music.stop=function(){NET.mus.name=null;NET.mus.ph=null;NET.mus.v++;return _netMusicStop.apply(this,arguments);};
if(typeof musicPhase==='function'){const _mph=musicPhase;musicPhase=function(id,i,n){NET.mus.ph=[id,i,n];NET.mus.v++;return _mph(id,i,n);};}
function netGuestMusic(name,ph){if(name===undefined||(typeof NP!=='undefined'&&NP.on))return;
  if(name!==NET.gMus.name){NET.gMus.name=name;NET.gMus.ph='';try{name?_netMusicPlay.call(Music,name):_netMusicStop.call(Music);}catch(_){}}
  const k=ph?ph.join('|'):'';if(k!==NET.gMus.ph){NET.gMus.ph=k;if(ph&&typeof musicPhase==='function')try{musicPhase(ph[0],ph[1],ph[2]);}catch(_){}}}

/* ---------- page furniture: the live picture, a status chip and a big join/leave notice ---------- */
let NETV=null,NETBAR=null,NETBAR_T=null,NETBAR_B=null,NETBAR_S=null,NETTOAST=null,NETTOAST_T=0;
(function(){try{const st=document.querySelector&&document.querySelector('.stage');if(!st)return;
  const css=document.createElement('style');css.textContent=`#netv{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:var(--ink);display:none;z-index:1}
#netbar{position:absolute;top:8px;right:8px;z-index:3;display:none;align-items:center;gap:6px;max-width:calc(100% - 16px);font:800 12px/1.2 var(--body);color:var(--ink);background:var(--paper);border:2px solid var(--ink);border-radius:999px;padding:3px 3px 3px 10px;box-shadow:0 2px 0 var(--ink)}
#netbar .dot{width:9px;height:9px;border-radius:50%;background:#3fae5a;border:1.5px solid var(--ink);flex:none}
#netbar .t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#netbar button{font:800 12px var(--body);color:var(--paper);background:var(--rust);border:2px solid var(--ink);border-radius:999px;padding:4px 10px;min-height:28px;cursor:pointer;flex:none}
#netbar button.s{background:var(--brass);color:var(--ink)}
#netbar button:focus-visible{outline:2px solid var(--brass);outline-offset:2px}
#nettoast{position:absolute;left:50%;top:18%;transform:translate(-50%,-10px) scale(.9);z-index:4;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;
  font:400 clamp(16px,2.6vw,26px)/1.2 var(--display);color:var(--ink);background:var(--paper);border:4px solid var(--ink);border-radius:14px;padding:10px 22px;box-shadow:0 5px 0 var(--ink);text-align:center;max-width:90%}
#nettoast.on{opacity:1;transform:translate(-50%,0) scale(1)}
#nettoast small{display:block;font:800 13px var(--body);color:var(--rust);margin-top:2px}`;document.head.appendChild(css);
  NETV=document.createElement('video');NETV.id='netv';NETV.playsInline=true;NETV.autoplay=true;NETV.setAttribute('playsinline','');st.appendChild(NETV);
  NETBAR=document.createElement('div');NETBAR.id='netbar';NETBAR.setAttribute('role','status');
  const dot=document.createElement('span');dot.className='dot';NETBAR_T=document.createElement('span');NETBAR_T.className='t';
  NETBAR_S=document.createElement('button');NETBAR_S.className='s';NETBAR_S.textContent='Activar sonido';NETBAR_S.style.display='none';
  NETBAR_B=document.createElement('button');NETBAR_B.textContent='Salir';
  NETBAR.append(dot,NETBAR_T,NETBAR_S,NETBAR_B);st.appendChild(NETBAR);
  NETTOAST=document.createElement('div');NETTOAST.id='nettoast';NETTOAST.setAttribute('role','status');NETTOAST.setAttribute('aria-live','polite');st.appendChild(NETTOAST);
  NETBAR_B.addEventListener('click',e=>{e.preventDefault();netClose(NET.role==='host'?'Cerraste la partida en línea.':'Saliste de la partida.');try{cv.focus({preventScroll:true});}catch(_){}});
  NETBAR_S.addEventListener('click',e=>{e.preventDefault();netUnmuteVideo();try{cv.focus({preventScroll:true});}catch(_){}});
  NETV.addEventListener('pointerdown',()=>{unlock();netUnmuteVideo();try{cv.focus({preventScroll:true});}catch(_){}});}catch(_){}})();
function netToast(s,sub='',t=3.8){NET.lastToast=s;if(!NETTOAST)return;NETTOAST.textContent=s;if(sub){const sm=document.createElement('small');sm.textContent=sub;NETTOAST.appendChild(sm);}NETTOAST.classList.add('on');NETTOAST_T=t;}
function netUnmuteVideo(){if(!NETV)return;NETV.muted=false;try{const p=NETV.play();if(p&&p.then)p.then(()=>{NET.audioBlocked=false;},()=>{});}catch(_){}NET.audioBlocked=false;}
function netChanText(){const u=NET.ups||{},ch=[];if(u.p2p)ch.push('directo');if(u.mqtt)ch.push('servidor público');if(u.room)ch.push('sala de Claude');
  return ch.length?'Canales abiertos: '+ch.join(' + ')+'. Pueden entrar en cualquier momento.':'Abriendo canales…';}
function netBarText(){const c=NET.server>=0?'Servidor '+(NET.server+1):NET.code;if(NET.role==='host'){const g=netGuestsOn();
    if(NET.st==='joining')return`En línea · abriendo la partida…`;
    if(!g.length)return`En línea · ${NET.server>=0?c:'código '+c} · esperando jugadores (1/3)`;
    return`En línea · ${c} · ${g.length+1}/3 jugadores · `+g.map(x=>NET_CHAR_NAME[netCharOf(x.slot)]+(x.ls?' (sincronizado)':x.slow&&x.conn?' (lento)':'')+(x.ping?' '+x.ping+' ms':'')).join(' · ');}
  const who=NET.slot?NET_CHAR_NAME[NET.char]||'':'';
  if(NET.st==='lock')return`En línea · ${c} · eres ${who} (J${NET.slot+1}) · juego sincronizado${NET.ping?' · '+NET.ping+' ms':''}`;
  if(NET.st==='live')return`En línea · ${c} · eres ${who} (J${NET.slot+1})${NET.ping?' · '+NET.ping+' ms':''}`;
  if(NET.st==='relay')return`En línea · ${c} · ${NET.tr==='room'?'vía Claude':NET.tr==='mqtt'?'vía servidor':'modo lento'} · eres ${who} (J${NET.slot+1})`;
  if(NET.st==='signal')return`En línea · ${c} · conectado, esperando la imagen…`;
  return`En línea · ${c} · conectando…`;}
function netSyncDom(dt){if(NETTOAST_T>0){NETTOAST_T-=dt;if(NETTOAST_T<=0&&NETTOAST)NETTOAST.classList.remove('on');}
  if(!NETBAR)return;const show=!!NET.role&&NET.st!=='off';NETBAR.style.display=show?'flex':'none';
  if(show){const s=netBarText();if(NETBAR_T.textContent!==s)NETBAR_T.textContent=s;NETBAR_B.textContent=NET.role==='host'&&NET.server<0?'Cerrar':'Salir';
    const ok=NET.role==='host'?netGuestsOn().length>0:(NET.st==='live'||NET.st==='lock');NETBAR.querySelector('.dot').style.background=ok?'#3fae5a':NET.st==='relay'?'#d9a441':'#9a9282';}
  NETBAR_S.style.display=NET.role==='guest'&&NET.st==='live'&&NET.audioBlocked?'':'none';
  const vid=NET.role==='guest'&&NET.st==='live';if(NETV){NETV.style.display=vid?'block':'none';NETV.volume=muted?0:1;}}

/* ---------- PeerJS link ---------- */
function netPeerErr(e){const t=e&&e.type;
  if(t==='browser-incompatible')return'Este navegador no puede jugar en línea. Prueba con Chrome, Edge o Firefox actualizados.';
  if(t==='network'||t==='server-error'||t==='socket-error'||t==='socket-closed'||t==='ssl-unavailable')
    return'No se pudo llegar al servidor de partidas. Revisa tu internet; si estás dentro de Claude, abre el juego desde su página pública.';
  return'Algo falló al conectar. Inténtalo de nuevo en un momento.';}
function netNewPeer(id){if(typeof Peer!=='function')return null;try{return id?new Peer(id,{debug:0}):new Peer({debug:0});}catch(_){return null;}}
function netHostStream(){if(NET.stream&&NET.stream.getVideoTracks()[0]&&NET.stream.getVideoTracks()[0].readyState==='live')return NET.stream;
  const vs=cv.captureStream(30),vt=vs.getVideoTracks()[0];try{vt.contentHint='motion';}catch(_){}const ms=new MediaStream([vt]);
  if(AC&&AC.createMediaStreamDestination){if(!NET.adest){NET.adest=AC.createMediaStreamDestination();SFXG.connect(NET.adest);}const at=NET.adest.stream.getAudioTracks()[0];if(at)ms.addTrack(at);}
  NET.stream=ms;return ms;}
function netTune(pc){try{const s=pc.getSenders().find(x=>x.track&&x.track.kind==='video');if(!s)return;const p=s.getParameters();if(!p.encodings||!p.encodings.length)p.encodings=[{}];
  p.encodings[0].maxBitrate=1500000;p.encodings[0].maxFramerate=30;p.encodings[0].scaleResolutionDownBy=Math.max(1,cv.width/960);p.degradationPreference='maintain-framerate';
  const r=s.setParameters(p);if(r&&r.catch)r.catch(()=>{});}catch(_){}}

/* ---------- a tiny MQTT client (WebSocket): free public brokers relay the game when direct links are blocked ---------- */
const NET_BROKERS=window.__cycBrokers||['wss://broker.emqx.io:8084/mqtt','wss://broker.hivemq.com:8884/mqtt','wss://test.mosquitto.org:8081/mqtt'];
const netTopic=(c,s)=>'chispaycerilla/v3/'+c.toLowerCase()+'/'+s;
const NET_TE=new TextEncoder(),NET_TD=new TextDecoder();
function mqCat(parts){let n=0;for(const p of parts)n+=p.length;const o=new Uint8Array(n);let i=0;for(const p of parts){o.set(p,i);i+=p.length;}return o;}
function mqStr(s){const b=NET_TE.encode(s);return mqCat([new Uint8Array([b.length>>8,b.length&255]),b]);}
function mqPkt(h,body){const rl=[];let n=body.length;do{let d=n%128;n=Math.floor(n/128);if(n>0)d|=128;rl.push(d);}while(n>0);return mqCat([new Uint8Array([h,...rl]),body]);}
function mqOpen(url,id,will,tmo=5000){return new Promise((res,rej)=>{let ws;try{ws=new WebSocket(url,['mqtt']);}catch(e){rej(e);return;}ws.binaryType='arraybuffer';
  const c={ws,open:false,onmsg:null,onclose:null,closed:false};let buf=new Uint8Array(0),ping=null,done=false;const t=setTimeout(()=>{if(!done){done=true;try{ws.close();}catch(_){}rej(new Error('timeout'));}},tmo);
  const send=b=>{try{if(ws.readyState===1)ws.send(b);}catch(_){}};
  c.pub=(topic,payload,retain)=>send(mqPkt(0x30|(retain?1:0),mqCat([mqStr(topic),payload])));
  c.pubJ=(topic,o,retain)=>c.pub(topic,NET_TE.encode(JSON.stringify(o)),retain);
  c.sub=topic=>send(mqPkt(0x82,mqCat([new Uint8Array([0,1]),mqStr(topic),new Uint8Array([0])])));
  c.end=()=>{c.closed=true;clearInterval(ping);send(new Uint8Array([0xE0,0]));setTimeout(()=>{try{ws.close();}catch(_){}},120);};
  ws.onopen=()=>{const flags=0x02|(will?0x24:0),vh=new Uint8Array([0,4,77,81,84,84,4,flags,0,30]);
    send(mqPkt(0x10,mqCat([vh,mqStr(id),...(will?[mqStr(will.t),mqStr(will.p)]:[])])));};
  ws.onmessage=e=>{const d=new Uint8Array(e.data);buf=buf.length?mqCat([buf,d]):d;
    while(buf.length>=2){let m=1,len=0,i=1,b;do{if(i>=buf.length)return;b=buf[i++];len+=(b&127)*m;m*=128;}while(b&128);if(buf.length<i+len)return;
      const h=buf[0],body=buf.subarray(i,i+len);buf=buf.slice(i+len);const ty=h>>4;
      if(ty===2){if(!done){done=true;clearTimeout(t);if(body[1]===0){c.open=true;ping=setInterval(()=>send(new Uint8Array([0xC0,0])),20000);res(c);}else{rej(new Error('refused'));try{ws.close();}catch(_){}}}}
      else if(ty===3){const tl=(body[0]<<8)|body[1],topic=NET_TD.decode(body.subarray(2,2+tl)),q=(h>>1)&3,pl=body.subarray(2+tl+(q?2:0));if(c.onmsg)try{c.onmsg(topic,pl);}catch(_){}}}};
  ws.onerror=()=>{if(!done){done=true;clearTimeout(t);rej(new Error('ws'));}};
  ws.onclose=()=>{clearInterval(ping);c.open=false;if(!done){done=true;clearTimeout(t);rej(new Error('closed'));}else if(!c.closed&&c.onclose)c.onclose();};});}
async function mqConnect(id,will){for(const u of NET_BROKERS){try{const c=await mqOpen(u,id,will);c.url=u;return c;}catch(_){}}return null;}
const mqJSON=pl=>{if(!pl||!pl.length||pl[0]!==0x7B)return null;try{return JSON.parse(NET_TD.decode(pl));}catch(_){return null;}};
const netRid=()=>Math.random().toString(36).slice(2,10);

/* ---------- public servers: three fixed rooms of up to 3 players, like a server list ---------- */
const NET_SERVERS=[{code:'TEAT',name:'El Teatro'},{code:'FERI',name:'La Feria'},{code:'MUEL',name:'El Muelle'}];
const netSrvName=i=>`Servidor ${i+1} · ${NET_SERVERS[i].name}`;
const netLabel=()=>NET.server>=0?'Servidor '+(NET.server+1):'código '+NET.code;
function netPubHost(){if(NET.role==='host'&&NET.mq)NET.mq.pubJ(netTopic(NET.code,'host'),{v:NET_V,open:1,n:1+netGuestsOn().length,ch:[netCharOf(1),netCharOf(2)]},true);}
const netHostInfo=pl=>{const d=mqJSON(pl);return d&&d.open?{n:Math.max(1,Math.min(3,d.n|0||1)),v:d.v}:{n:0};};
/* the server list listens to the three servers' "who is hosting" notes */
async function netScanStart(){if(NET.scan||NET.scanBusy||performance.now()<(NET.scanRetry||0))return;NET.scanBusy=true;const c=await mqConnect('cyc-s-'+netRid());NET.scanBusy=false;
  if(!c){NET.scanFail=true;NET.scanRetry=performance.now()+15000;return;}if(scene!=='online'||NET.ui!=='menu'||NET.role){c.end();return;}
  NET.scan=c;NET.scanFail=false;c.onmsg=(topic,pl)=>{const i=NET_SERVERS.findIndex(x=>topic===netTopic(x.code,'host'));if(i>=0)NET.srvInfo[i]=netHostInfo(pl);};
  c.onclose=()=>{if(NET.scan===c)NET.scan=null;};for(const x of NET_SERVERS)c.sub(netTopic(x.code,'host'));
  setTimeout(()=>{if(NET.scan===c)for(let i=0;i<3;i++)if(!NET.srvInfo[i])NET.srvInfo[i]={n:0};},1600);}
function netScanStop(){const c=NET.scan;NET.scan=null;if(c)c.end();}
/* one quick look at a server: how many are in it right now (null if the relay can't be reached) */
async function netProbe(code){const c=await mqConnect('cyc-p-'+netRid());if(!c)return null;
  return new Promise(res=>{let done=false;const fin=v=>{if(done)return;done=true;c.end();res(v);};c.onmsg=(t,pl)=>fin(netHostInfo(pl));c.sub(netTopic(code,'host'));setTimeout(()=>fin({n:0}),1300);});}
async function netServerJoin(i){const sv=NET_SERVERS[i];netScanStop();netTeardown();NET.role=null;NET.st='off';NET.server=i;NET.entry='';scene='online';NET.ui='gwait';NET.code=sv.code;NET.probing=true;
  const inf=await netProbe(sv.code);if(NET.server!==i||NET.role||!NET.probing)return;NET.probing=false;
  if(inf)NET.srvInfo[i]=inf;
  if(inf&&inf.n>=3){NET.server=-1;netFail(`El ${netSrvName(i)} está lleno (3/3). Prueba con otro servidor.`);return;}
  if(inf&&inf.n===0){netHost(sv.code);return;}
  netJoin(sv.code);}
/* nobody answered on this server: become its host */
function netNoHost(code){if(NET.server>=0&&NET_SERVERS[NET.server].code===code){netHost(code);return;}netEnd(netNoGame(code));}

/* ---------- host: opens the game on every route it can (direct, public relay, Claude room) at once ---------- */
function netUpCheck(){if(NET.role!=='host')return;const u=NET.ups;if(u.p2p||u.mqtt||u.room){if(NET.st==='joining'){NET.st='wait';sfx('ding');}return;}
  if(NET.st==='joining'&&!NET.pend.p2p&&!NET.pend.mqtt&&!NET.pend.room)netFail(netInClaude()?netNoRoomMsg():'No se pudo llegar a ningún servidor de partidas. Revisa tu internet e inténtalo de nuevo.');}
function netHost(keepCode){const code=keepCode||netCode();netTeardown();NET.role='host';NET.st='joining';NET.ui='host';NET.sel=0;NET.msg='';NET.code=code;NET.guests=[null,null,null];NET.tr='host';
  NET.ups={p2p:false,mqtt:false,room:false};NET.pend={p2p:netCanP2P(),mqtt:typeof WebSocket==='function',room:netInClaude()};NET.frameN=0;NET.q=.6;NET.msN=0;
  if(NET.pend.p2p)netHostP2P();if(NET.pend.mqtt)netHostMqtt();if(NET.pend.room)netHostRoom();netUpCheck();
  netLater(()=>{for(const k in NET.pend)NET.pend[k]=false;netUpCheck();},14000);}
function netHostP2P(){const peer=netNewPeer(netPeerId(NET.code));if(!peer){NET.pend.p2p=false;netUpCheck();return;}NET.peer=peer;
  peer.on('open',()=>{if(NET.peer!==peer)return;NET.ups.p2p=true;NET.pend.p2p=false;NET.codeTries=0;netUpCheck();});
  peer.on('connection',conn=>{if(NET.peer===peer)netHostConn(conn);});
  peer.on('disconnected',()=>{if(NET.peer===peer&&!peer.destroyed)netLater(()=>{try{if(NET.peer===peer&&!peer.destroyed&&peer.disconnected)peer.reconnect();}catch(_){}},1500);});
  peer.on('error',e=>{if(NET.peer!==peer)return;if(e&&e.type==='unavailable-id'&&NET.server>=0&&!NET.ups.mqtt){netJoin(NET.code);return;}
    if(e&&e.type==='unavailable-id'&&NET.server<0&&NET.codeTries<4&&!NET.ups.mqtt&&!NET.ups.room){NET.codeTries++;netHost();return;}
    if(!NET.ups.p2p){NET.pend.p2p=false;netUpCheck();}});
  netLater(()=>{if(NET.peer===peer&&!NET.ups.p2p){NET.pend.p2p=false;netUpCheck();}},netInClaude()?6000:12000);}
async function netHostMqtt(){const code=NET.code,c=await mqConnect('cyc-h-'+netRid(),{t:netTopic(code,'host'),p:''});
  if(NET.role!=='host'||NET.code!==code){if(c)c.end();return;}NET.pend.mqtt=false;if(!c){netUpCheck();return;}
  if(NET.server>=0&&!NET.mqChecked){const other=await new Promise(res=>{let done=false;const fin=v=>{if(!done){done=true;res(v);}};c.onmsg=(t,pl)=>fin(netHostInfo(pl).n>0);c.sub(netTopic(code,'host'));setTimeout(()=>fin(false),1100);});
    if(NET.role!=='host'||NET.code!==code){c.end();return;}if(other&&!netGuestsOn().length){c.end();netJoin(code);return;}}
  NET.mq=c;NET.ups.mqtt=true;c.sub(netTopic(code,'up/+'));netPubHost();
  c.onmsg=(topic,pl)=>{const k=topic.split('/');if(k[k.length-1]==='host')return;const d=mqJSON(pl);if(d)netHostMqMsg(k.pop(),d);};
  c.onclose=()=>{if(NET.mq!==c)return;NET.mq=null;NET.ups.mqtt=false;for(const G of netGuestsOn())if(G.mq)netGuestGone(G,'perdió la conexión');netLater(()=>{if(NET.role==='host'&&!NET.mq)netHostMqtt();},2000);};
  netUpCheck();}
function netHostMqMsg(gid,d){if(NET.role!=='host'||!NET.mq)return;let G=NET.guests.find(x=>x&&x.mq===gid);const to=netTopic(NET.code,'to/'+gid);
  if(d.t==='hey'){if(d.v!==NET_V){NET.mq.pubJ(to,{t:'old'});return;}const lsc=!!d.ls;
    if(!G){const slot=[1,2].find(s=>!NET.guests[s]);if(!slot){NET.mq.pubJ(to,{t:'full'});return;}G={slot,mq:gid,open:true,slow:true,live:true,ping:0,last:performance.now(),lsCap:lsc};NET.guests[slot]=G;netSlotsChanged();
      const w=netWho(slot);netToast(`¡${w} se unió!`,`${netGuestsOn().length+1} de 3 jugadores`);sfx('ding');sfx('achieve');netBroadcastMsg(`¡${w} se unió!`,G);netJoinLevel();}
    NET.mq.pubJ(to,{t:'hi',slot:G.slot,char:netCharOf(G.slot),v:NET_V,code:NET.code});NET.musSent=-1;return;}
  if(!G)return;G.last=performance.now();
  if(d.t==='in'){netApplyMask(G.slot,d.m);if(d.x!=null){G.x=d.x|0;G.xT=performance.now();}}else if(typeof d.t==='string'&&d.t[0]==='L'&&typeof npHostMsg==='function')npHostMsg(G,d);else if(d.t==='q'&&typeof d.p==='number')G.ping=Math.round(performance.now()-d.p);else if(d.t==='bye')netGuestGone(G,'salió de la partida');}
function netBroadcastMsg(s,except){for(const o of netGuestsOn())if(o!==except&&o.conn)netSend(o.conn,{t:'msg',s});if(NET.mq&&netGuestsOn().some(o=>o.mq&&o!==except))NET.mq.pubJ(netTopic(NET.code,'down'),{t:'msg',s});if(NET.room&&netGuestsOn().some(o=>o.room))netRoomMsg(s);}
function netMqFrame(){try{if(!NET.small3){NET.small3=document.createElement('canvas');NET.small3.width=448;NET.small3.height=252;}const c=NET.small3,g=c.getContext('2d');if(!c.toBlob||!g)return;
  g.imageSmoothingEnabled=true;g.drawImage(cv,0,0,448,252);NET.busy3=true;
  c.toBlob(b=>{if(!b){NET.busy3=false;return;}b.arrayBuffer().then(ab=>{NET.busy3=false;if(!NET.mq)return;const u=new Uint8Array(ab);NET.mq.pub(netTopic(NET.code,'down'),mqCat([new Uint8Array([0x46,b.type==='image/webp'?0x77:0x6A]),u]));},()=>{NET.busy3=false;});},'image/webp',.62);}
  catch(_){NET.busy3=false;}}
/* ---------- host inside Claude: the shared room carries the picture and everyone's controls ---------- */
/* Inside Claude the only way out is Claude's own room: it admits signed-in people who were invited to this game */
function netNoRoomMsg(){if(NET.api===null)return 'Claude no deja jugar en línea en esta pestaña. Para jugar desde Claude: 1) inicia sesión en claude.ai, 2) el dueño del juego te invita con tu correo en Compartir (el enlace público no sirve), 3) abre el juego desde esa invitación.';
  return 'La sala de Claude no respondió'+(NET.roomErr?` (${NET.roomErr})`:'')+'. Revisen que los dos tengan sesión iniciada y que tu amigo esté invitado por correo en Compartir, y vuelvan a intentarlo.';}
/* named rooms first; if the platform refuses them, share the lobby and tell games apart by their code */
function netLobbyRoom(api,code){const c=code.toLowerCase(),mine=p=>p.sameTab||(p.presence&&p.presence.c===c),KEYS=['r','v','g','ch','fn','ft','fa','f0','f1','f2','mu','sx','ms','in','c'];
  return{name:'lobby',lobby:true,emit:(t,d)=>api.emit(t,Object.assign({},d,{c})),on:(t,fn,er)=>api.on(t,m=>{if(m&&m.data&&m.data.c===c)fn(m);},er),presence:p=>api.presence(Object.assign({},p,{c})),
    peers:()=>api.peers().filter(mine),onPeers:(fn,er)=>api.onPeers(ch=>fn({peers:ch.peers.filter(mine),joined:ch.joined.filter(mine),left:ch.left,updated:ch.updated.filter(mine)}),er),
    connected:()=>api.connected(),leave:()=>{const z={};for(const k of KEYS)z[k]=null;return api.presence(z);}};}
async function netRoomJoin(api,code){NET.roomErr=null;try{return await api.join(netRoomName(code));}catch(e){NET.roomErr=e&&e.code||'error';if(e&&(e.code==='revoked'||e.code==='not_granted'))throw e;return netLobbyRoom(api,code);}}
const netRoomFail=e=>e&&e.code==='not_permitted'?'Dentro de Claude, tus amigos tienen que iniciar sesión y tú debes invitarlos con su correo desde el botón Compartir.':'No se pudo abrir la sala en línea.';
async function netHostRoom(){const code=NET.code,api=NET.api===undefined?await NET.apiP:NET.api;if(NET.role!=='host'||NET.code!==code)return;
  if(!api){NET.pend.room=false;netUpCheck();return;}let room;try{room=await netRoomJoin(api,code);}catch(e){NET.pend.room=false;netUpCheck();return;}
  if(NET.role!=='host'||NET.code!==code){try{room.leave();}catch(_){}return;}NET.room=room;NET.ups.room=true;NET.pend.room=false;
  netPres({r:'h',v:NET_V,g:[null,null],ch:[netCharOf(1),netCharOf(2)]});
  NET.offPeers=room.onPeers(ch=>netHostRoomPeers(ch),()=>{if(NET.room===room){NET.ups.room=false;for(const G of netGuestsOn())if(G.room)netGuestGone(G,'perdió la conexión');NET.room=null;}});netUpCheck();}
function netRoomG(){const g=s=>NET.guests[s]&&NET.guests[s].room?NET.guests[s].rp:(NET.guests[s]?'x':null);netPres({g:[g(1),g(2)]});}
function netRoomMsg(text){NET.msN=(NET.msN||0)+1;netPres({ms:[NET.msN,text]});}
function netHostRoomPeers(ch){if(NET.role!=='host'||!NET.room)return;const peers=ch.peers;
  for(const s of[1,2]){const G=NET.guests[s];if(G&&G.room&&!peers.find(p=>p.peer===G.rp))netGuestGone(G,'salió de la partida');}
  for(const p of peers){const pr=p.presence;if(p.sameTab||!pr||pr.r!=='g'||pr.v!==NET_V)continue;let G=NET.guests.find(x=>x&&x.rp===p.peer);
    if(!G){const slot=[1,2].find(s=>!NET.guests[s]);if(!slot)continue;G={slot,rp:p.peer,room:true,slow:true,live:false,open:true,ping:0};NET.guests[slot]=G;netSlotsChanged();netRoomG();
      const w=netWho(slot);netToast(`¡${w} se unió!`,`${netGuestsOn().length+1} de 3 jugadores`);sfx('ding');sfx('achieve');netBroadcastMsg(`¡${w} se unió!`,G);netRoomMsg(`¡${w} se unió!`);netJoinLevel();}
    if(typeof pr.in==='number')netApplyMask(G.slot,pr.in);}}
function netRoomFrame(){try{if(!NET.small2){NET.small2=document.createElement('canvas');NET.small2.width=272;NET.small2.height=153;}const c=NET.small2,g=c.getContext('2d');if(!c.toBlob||!g)return;
  g.imageSmoothingEnabled=true;g.filter='blur(.6px)';g.drawImage(cv,0,0,272,153);g.filter='none';NET.busy2=true;
  c.toBlob(b=>{if(!b){NET.busy2=false;return;}const ft=b.type==='image/webp'?'w':'j',fr=new FileReader();fr.onload=()=>{NET.busy2=false;if(!NET.room)return;const d=String(fr.result).split(',')[1]||'';
      const cap=NET.noEmit?2950:6800;if(d.length>cap){NET.q=Math.max(.03,NET.q*.75);return;}if(d.length<cap*.7)NET.q=Math.min(.8,NET.q*1.06);
      const n=++NET.frameN;let a='',rest=d;if(!NET.noEmit&&d.length>2950){a=d.slice(0,3900);rest=d.slice(3900);if(rest.length>2950){return;}
        const pr=NET.room.emit('f',{n,a});if(pr&&pr.catch)pr.catch(e=>{if(e&&e.code==='not_permitted')NET.noEmit=true;});}
      else if(d.length>2950)return;
      netPres({fn:n,ft,fa:a?1:null,f0:rest.slice(0,1000),f1:rest.slice(1000,2000)||null,f2:rest.slice(2000,3000)||null,mu:[NET.mus.name,NET.mus.ph],sx:NET.sx.slice()});};fr.onerror=()=>{NET.busy2=false;};fr.readAsDataURL(b);},'image/webp',NET.q);}
  catch(_){NET.busy2=false;}}
function netHostConn(conn){const slot=[1,2].find(s=>!NET.guests[s]);
  if(!slot){conn.on('open',()=>{netSend(conn,{t:'full'});setTimeout(()=>{try{conn.close();}catch(_){}},800);});return;}
  const G={slot,conn,call:null,live:false,slow:false,ping:0,open:false};NET.guests[slot]=G;
  conn.on('open',()=>{if(NET.guests[slot]!==G)return;G.open=true;netSend(conn,{t:'hi',slot,char:netCharOf(slot),v:NET_V,code:NET.code});netSlotsChanged();if(NET.room)netRoomG();
    const w=netWho(slot);netToast(`¡${w} se unió!`,`${netGuestsOn().length+1} de 3 jugadores`);sfx('ding');sfx('achieve');netBroadcastMsg(`¡${w} se unió!`,G);netJoinLevel();netCallGuest(G);});
  conn.on('data',d=>netHostData(G,d));
  conn.on('close',()=>netGuestGone(G,'salió de la partida'));conn.on('error',()=>netGuestGone(G,'perdió la conexión'));}
function netCallGuest(G){try{if(!cv.captureStream||typeof RTCPeerConnection==='undefined')throw 0;const call=NET.peer.call(G.conn.peer,netHostStream());if(!call)throw 0;G.call=call;
    const pc=call.peerConnection;if(pc)pc.addEventListener('connectionstatechange',()=>{if(pc.connectionState==='connected')netTune(pc);});
    call.on('error',()=>{if(NET.guests[G.slot]===G&&!G.slow){G.slow=true;netSend(G.conn,{t:'slow'});}});}
  catch(_){G.slow=true;netSend(G.conn,{t:'slow'});}}
function netHostData(G,d){if(!d||typeof d!=='object'||NET.guests[G.slot]!==G)return;
  if(d.t==='in'){netApplyMask(G.slot,d.m);if(d.x!=null){G.x=d.x|0;G.xT=performance.now();}}
  else if(d.t==='hey'){G.lsCap=!!d.ls;}
  else if(typeof d.t==='string'&&d.t[0]==='L'&&typeof npHostMsg==='function')npHostMsg(G,d);
  else if(d.t==='q'&&typeof d.p==='number')G.ping=Math.round(performance.now()-d.p);
  else if(d.t==='live'){G.live=true;G.slow=false;}
  else if(d.t==='slow'){G.slow=true;}
  else if(d.t==='bye')netGuestGone(G,'salió de la partida');}
function netGuestGone(G,why){if(NET.role!=='host'||NET.guests[G.slot]!==G)return;NET.guests[G.slot]=null;try{G.call&&G.call.close();}catch(_){}try{G.conn&&G.conn.close();}catch(_){}
  netSlotsChanged();if(NET.room)netRoomG();if(G.open){const s=`${netWho(G.slot)} ${why}.`;netToast(s,'Puede volver a entrar con el mismo código');sfx('deny');netBroadcastMsg(s,G);}}
/* a friend arriving mid-level drops straight in next to player 1 */
function netJoinLevel(){try{if(scene!=='level'||!LV||!LV.Ps||LV.state==='results')return;const p0=LV.Ps[0];
  while(LV.Ps.length<(cfg.players||1)&&LV.Ps.length<3){const i=LV.Ps.length,p=newPlayer(LV,i,p0.type,p0.x-50*i,p0.type==='plane'?p0.y+70*i:p0.y);p.inv=2;LV.Ps.push(p);if(typeof smoke==='function')smoke(LV,p.x,p.y-30);}}catch(_){}}
function netHostTick(dt){const g=netGuestsOn();if(!g.length)return;const now=performance.now();
  if(scene==='level'&&LV&&LV!==NET.joinedLevel){NET.joinedLevel=LV;netJoinLevel();}
  for(const G of g){if(G.room)NETIN.s[G.slot].t=now;else if(now-NETIN.s[G.slot].t>1500)netClearSlot(G.slot);if(G.mq&&now-G.last>6000)netGuestGone(G,'perdió la conexión');}
  if(g.some(G=>G.room||G.mq)&&NET.grainWas==null){NET.grainWas=cfg.grain;cfg.grain=false;}
  if(g.some(G=>G.room)){NET.frameT2=(NET.frameT2||0)-dt;if(NET.frameT2<=0&&!NET.busy2){NET.frameT2=.066;netRoomFrame();}}
  NET.pingT-=dt;if(NET.pingT<=0){NET.pingT=1;for(const G of g)if(G.conn)netSend(G.conn,{t:'p',p:now,rtt:G.ping});if(NET.mq&&g.some(G=>G.mq))NET.mq.pubJ(netTopic(NET.code,'down'),{t:'p',p:now});}
  NET.musT-=dt;if(NET.musSent!==NET.mus.v||NET.musT<=0){NET.musSent=NET.mus.v;NET.musT=2;const mu={t:'mu',mu:[NET.mus.name,NET.mus.ph]};for(const G of g)if(G.conn)netSend(G.conn,mu);if(NET.mq&&g.some(G=>G.mq))NET.mq.pubJ(netTopic(NET.code,'down'),mu);}
  if(NET.mq&&g.some(G=>G.mq&&!G.ls)){NET.frameT3=(NET.frameT3||0)-dt;if(NET.frameT3<=0&&!NET.busy3){NET.frameT3=.075;netMqFrame();}}
  if(g.some(G=>G.slow&&G.conn&&!G.ls)){NET.frameT-=dt;if(NET.frameT<=0&&!NET.busy){NET.frameT=.07;netSendFrame(g.filter(G=>G.slow&&G.conn&&!G.ls));}}}
function netSendFrame(list){try{if(!NET.small){NET.small=document.createElement('canvas');NET.small.width=384;NET.small.height=216;}const c=NET.small,g=c.getContext('2d');if(!c.toBlob||!g)return;
  g.imageSmoothingEnabled=true;g.drawImage(cv,0,0,384,216);NET.busy=true;
  c.toBlob(b=>{if(!b){NET.busy=false;return;}b.arrayBuffer().then(ab=>{NET.busy=false;for(const G of list)if(NET.guests[G.slot]===G)netSend(G.conn,{t:'f',ty:b.type,d:ab});},()=>{NET.busy=false;});},'image/webp',.6);}
  catch(_){NET.busy=false;}}

/* ---------- guest: tries the direct link, then the public relay, then the Claude room ---------- */
const netNoGame=code=>`No encontramos ninguna partida con el código ${code}. Revisa el código y que tu amigo tenga la partida abierta.`;
function netJoin(code){netTeardown();NET.role='guest';NET.st='joining';NET.ui='gwait';NET.sel=0;NET.code=code;NET.msg='';NET.slot=0;NET.char=null;NET.tr='p2p';
  if(!netCanP2P()){netJoinMqtt(code);return;}
  const peer=netNewPeer(null);if(!peer){netJoinMqtt(code);return;}NET.peer=peer;
  const next=()=>{if(NET.peer!==peer||NET.role!=='guest'||NET.st!=='joining')return;const pr=NET.peer;NET.peer=null;NET.conn=null;setTimeout(()=>{try{pr.destroy();}catch(_){}},200);netJoinMqtt(code);};
  peer.on('open',()=>{if(NET.peer!==peer)return;const conn=peer.connect(netPeerId(code),{reliable:true});NET.conn=conn;
    conn.on('open',()=>{if(NET.conn!==conn)return;netSend(conn,{t:'hey',v:NET_V,ls:1});});
    conn.on('data',d=>netGuestData(d));
    conn.on('close',()=>{if(NET.conn===conn&&NET.role==='guest'){if(NET.slot)netEnd('Tu amigo cerró la partida.');else next();}});});
  peer.on('call',call=>{if(NET.peer!==peer)return;if(typeof NP!=='undefined'&&NP.on){try{call.close();}catch(_){}return;}NET.call=call;call.answer();
    call.on('stream',s=>{if(!NETV||(typeof NP!=='undefined'&&NP.on))return;if(NETV.srcObject!==s)NETV.srcObject=s;try{for(const r of call.peerConnection.getReceivers()){try{r.playoutDelayHint=0;}catch(_){}try{r.jitterBufferTarget=0;}catch(_){}}}catch(_){}
      netPlayVideo();if(NET.st!=='live'){NET.st='live';netSend(NET.conn,{t:'live'});}});
    call.on('error',()=>{if(NET.st==='signal'||NET.st==='live')netGoSlow();});});
  peer.on('error',()=>next());
  netLater(next,netInClaude()?5000:9000);}
async function netJoinMqtt(code){if(NET.role!=='guest')return;NET.tr='mqtt';const gid='g'+netRid();NET.gid=gid;NET.hostSeen=false;
  const c=await mqConnect('cyc-g-'+gid,{t:netTopic(code,'up/'+gid),p:'{"t":"bye"}'});if(NET.role!=='guest'||NET.code!==code){if(c)c.end();return;}
  if(!c){if(netInClaude())netJoinRoom(code);else if(NET.server>=0)netHost(code);else netEnd('No se pudo llegar a ningún servidor de partidas. Revisa tu internet e inténtalo de nuevo.');return;}
  NET.mq=c;const up=netTopic(code,'up/'+gid);NET.mqUp=up;c.sub(netTopic(code,'host'));c.sub(netTopic(code,'down'));c.sub(netTopic(code,'to/'+gid));
  const hey=()=>{if(NET.mq===c&&!NET.slot){c.pubJ(up,{t:'hey',v:NET_V,ls:1});netLater(hey,1500);}};
  c.onmsg=(topic,pl)=>{if(NET.mq!==c)return;const k=topic.split('/').pop();
    if(k==='host'){const d=mqJSON(pl);if(d&&d.open){if(!NET.hostSeen){NET.hostSeen=true;hey();
        netLater(()=>{if(NET.mq===c&&!NET.slot){if(NET.server>=0){c.pub(netTopic(code,'host'),new Uint8Array(0),true);netNoHost(code);}else netEnd('La partida no responde. Pídele a tu amigo que la vuelva a crear.');}},7000);}}else if(NET.hostSeen||NET.slot)netEnd('Tu amigo cerró la partida.');return;}
    if(pl[0]===0x46){if(!NET.slot||NP.on)return;try{const bl=new Blob([pl.slice(2)],{type:pl[1]===0x77?'image/webp':'image/jpeg'}),u=URL.createObjectURL(bl),im=new Image();im.onload=()=>{const old=NET.imgU;NET.img=im;NET.imgU=u;if(old)URL.revokeObjectURL(old);};im.src=u;}catch(_){}return;}
    const d=mqJSON(pl);if(!d)return;
    if(d.t==='hi'){if(NET.slot)return;NET.slot=d.slot;NET.char=d.char;NET.st='relay';NET.gMus={name:undefined,ph:''};_netMusicStop.call(Music);sfx('ding');sfx('achieve');NET.mask=-1;netToast((NET.server>=0?`¡Entraste al ${netSrvName(NET.server)}!`:`¡Te uniste a la partida ${NET.code}!`),`Eres ${netWho(d.slot)}`);}
    else if(d.t==='full')netEnd(NET.server>=0?'Ese servidor está lleno (3/3). Prueba con otro.':'Esa partida ya tiene tres jugadores.');else if(d.t==='old')netEnd('Tu amigo tiene otra versión del juego. Usen los dos la misma versión.');
    else if(d.t==='p')c.pubJ(up,{t:'q',p:d.p});else if(d.t==='mu'&&d.mu)netGuestMusic(d.mu[0],d.mu[1]);else if(d.t==='msg'&&typeof d.s==='string'&&NET.slot)netToast(d.s);
    else if(d.t==='s'&&typeof d.n==='string'&&NET.slot&&!NP.on)_netSfx(d.n,d.a??undefined);else if(typeof d.t==='string'&&d.t[0]==='L'&&NET.slot)npGuestMsg(d);else if(d.t==='bye')netEnd('Tu amigo cerró la partida.');};
  c.onclose=()=>{if(NET.mq===c&&NET.role==='guest')netEnd('Se cortó la conexión con la partida.');};
  netLater(()=>{if(NET.mq===c&&!NET.hostSeen){if(netInClaude()){c.end();NET.mq=null;netJoinRoom(code);}else netNoHost(code);}},5000);}
/* ---------- guest inside Claude ---------- */
async function netJoinRoom(code){NET.tr='room';NET.imgN=0;NET.hp=null;NET.hostSeen=false;NET.frameSeen=-1;NET.gSx=-1;NET.msSeen=null;const api=NET.api===undefined?await NET.apiP:NET.api;
  if(NET.role!=='guest')return;if(!api){netEnd(netNoRoomMsg());return;}
  let room;try{room=await netRoomJoin(api,code);}catch(e){netEnd(netNoRoomMsg());return;}
  if(NET.role!=='guest'){try{room.leave();}catch(_){}return;}NET.room=room;netPres({r:'g',v:NET_V,in:0});
  NET.fa={};const offF=room.on('f',m=>{const d=m&&m.data;if(!d||typeof d.n!=='number'||typeof d.a!=='string')return;NET.fa[d.n]=d.a;const ks=Object.keys(NET.fa);if(ks.length>6)delete NET.fa[ks[0]];netRoomAssemble();});
  const offP=room.onPeers(ch=>netGuestRoomPeers(ch),()=>{if(NET.role==='guest')netEnd('Se cortó la conexión con la sala.');});NET.offPeers=()=>{try{offF();}catch(_){}offP();};
  netLater(()=>{if(NET.role==='guest'&&!NET.hostSeen)netNoHost(code);},7000);}
function netGuestRoomPeers(ch){if(NET.role!=='guest'||NET.tr!=='room')return;const peers=ch.peers,me=peers.find(p=>p.sameTab),host=peers.find(p=>!p.sameTab&&p.presence&&p.presence.r==='h');
  if(!host){if(NET.hostSeen)netEnd('Tu amigo cerró la partida.');return;}NET.hostSeen=true;const hp=host.presence;if(!me)return;
  if(hp.v!==NET_V){netEnd('Tu amigo tiene otra versión del juego. Recarguen los dos la página.');return;}
  const g=Array.isArray(hp.g)?hp.g:[],idx=g.indexOf(me.peer);
  if(idx<0){if(NET.slot){netEnd('Se cortó la conexión con tu amigo.');return;}if(g[0]&&g[1])netEnd(NET.server>=0?'Ese servidor está lleno (3/3). Prueba con otro.':'Esa partida ya tiene tres jugadores.');return;}
  if(!NET.slot){NET.slot=idx+1;NET.char=(hp.ch&&hp.ch[idx])||netCharOf(NET.slot);NET.st='relay';NET.gMus={name:undefined,ph:''};_netMusicStop.call(Music);sfx('ding');sfx('achieve');
    netToast((NET.server>=0?`¡Entraste al ${netSrvName(NET.server)}!`:`¡Te uniste a la partida ${NET.code}!`),`Eres ${NET_CHAR_NAME[NET.char]||'tu personaje'} (Jugador ${NET.slot+1})`);NET.msSeen=hp.ms?hp.ms[0]:0;NET.mask=-1;}
  if(hp.ms&&hp.ms[0]!==NET.msSeen){NET.msSeen=hp.ms[0];if(typeof hp.ms[1]==='string')netToast(hp.ms[1]);}
  if(hp.mu)netGuestMusic(hp.mu[0],hp.mu[1]);
  if(Array.isArray(hp.sx)){if(NET.gSx<0)NET.gSx=hp.sx.length?hp.sx[hp.sx.length-1][0]:0;for(const x of hp.sx)if(Array.isArray(x)&&x[0]>NET.gSx){NET.gSx=x[0];if(typeof x[1]==='string')_netSfx(x[1],x[2]??undefined);}}
  NET.hp=hp;netRoomAssemble();}
function netRoomAssemble(){const hp=NET.hp;if(!hp||!hp.fn||hp.fn===NET.frameSeen||typeof hp.f0!=='string')return;let a='';if(hp.fa){a=NET.fa&&NET.fa[hp.fn];if(!a)return;}
  NET.frameSeen=hp.fn;try{const im=new Image();im.onload=()=>{if(!NET.imgN||hp.fn>=NET.imgN){NET.img=im;NET.imgN=hp.fn;}};im.src='data:image/'+(hp.ft==='w'?'webp':'jpeg')+';base64,'+a+hp.f0+(hp.f1||'')+(hp.f2||'');}catch(_){}}
function netGoSlow(){if(NET.st==='relay')return;NET.st='relay';NET.img=null;netSend(NET.conn,{t:'slow'});try{NET.call&&NET.call.close();}catch(_){}}
function netGuestData(d){if(!d||typeof d!=='object')return;
  if(d.t==='hi'){NET.slot=d.slot;NET.char=d.char;NET.st='signal';NET.gMus={name:undefined,ph:''};_netMusicStop.call(Music);sfx('ding');sfx('achieve');
    netToast((NET.server>=0?`¡Entraste al ${netSrvName(NET.server)}!`:`¡Te uniste a la partida ${NET.code}!`),`Eres ${netWho(d.slot)}`);
    netLater(()=>{if(NET.role==='guest'&&NET.st==='signal')netGoSlow();},12000);}
  else if(d.t==='full')netEnd(NET.server>=0?'Ese servidor está lleno (3/3). Prueba con otro.':'Esa partida ya tiene tres jugadores.');
  else if(d.t==='p'){netSend(NET.conn,{t:'q',p:d.p});if(d.rtt)NET.ping=d.rtt;}
  else if(d.t==='mu'&&d.mu)netGuestMusic(d.mu[0],d.mu[1]);
  else if(d.t==='msg'&&typeof d.s==='string')netToast(d.s);
  else if(typeof d.t==='string'&&d.t[0]==='L'&&typeof npGuestMsg==='function')npGuestMsg(d);
  else if(d.t==='slow'){if(!(typeof NP!=='undefined'&&NP.on))netGoSlow();}
  else if(d.t==='f'&&d.d){if(NET.st!=='relay')NET.st='relay';try{const bl=new Blob([d.d],{type:d.ty||'image/webp'}),u=URL.createObjectURL(bl),im=new Image();im.onload=()=>{const old=NET.imgU;NET.img=im;NET.imgU=u;if(old)URL.revokeObjectURL(old);};im.src=u;}catch(_){}}}
function netPlayVideo(){if(!NETV)return;NETV.muted=false;try{const p=NETV.play();if(p&&p.catch)p.catch(()=>{NETV.muted=true;NET.audioBlocked=true;try{NETV.play().catch(()=>{});}catch(_){}});}catch(_){}}
function netGuestTick(dt){const IN=NET.lastIN;if(!IN||!NET.slot)return;const m=netMask(IN);NET.sendT-=dt;
  if(NET.tr==='room'){if(m!==NET.mask){NET.mask=m;netPres({in:m});}return;}
  if(NET.tr==='mqtt'){if(NET.mq&&(m!==NET.mask||NET.sendT<=0)){NET.mask=m;NET.sendT=.25;NET.mq.pubJ(NET.mqUp,{t:'in',m,x:npMaskOf(IN)});}return;}
  if(m!==NET.mask||NET.sendT<=0){NET.mask=m;NET.sendT=.1;netSend(NET.conn,{t:'in',m,x:npMaskOf(IN)});}}

/* ---------- leaving ---------- */
function netTeardown(){for(const t of NET.timers)clearTimeout(t);NET.timers=[];if(typeof NP!=='undefined'){if(NET.role==='guest')npGuestEnd();else if(NP.on){NP.on=false;NP.role=null;}}
  if(NET.role==='guest')netSend(NET.conn,{t:'bye'});
  if(NET.mq){const c=NET.mq;NET.mq=null;try{if(NET.role==='host'){c.pubJ(netTopic(NET.code,'down'),{t:'bye'});c.pub(netTopic(NET.code,'host'),new Uint8Array(0),true);}else if(NET.mqUp)c.pubJ(NET.mqUp,{t:'bye'});}catch(_){}c.end();}
  for(const G of netGuestsOn()){if(G.conn)netSend(G.conn,{t:'msg',s:'El anfitrión cerró la partida.'});try{G.call&&G.call.close();}catch(_){}}
  if(NET.offPeers){try{NET.offPeers();}catch(_){}}NET.offPeers=null;
  if(NET.room){const r=NET.room;NET.room=null;try{const p=r.leave();if(p&&p.catch)p.catch(()=>{});}catch(_){}}
  const pr=NET.peer;NET.peer=null;NET.conn=null;if(pr)setTimeout(()=>{try{pr.destroy();}catch(_){}},250);
  try{NET.call&&NET.call.close();}catch(_){}NET.call=null;
  if(NET.stream){for(const tr of NET.stream.getVideoTracks())try{tr.stop();}catch(_){}NET.stream=null;}
  if(NETV){try{NETV.pause();}catch(_){}NETV.srcObject=null;}
  const wasGuest=NET.role==='guest'&&!!NET.slot;NET.guests=[null,null,null];netSlotsChanged();
  NET.slot=0;NET.img=null;NET.ping=0;NET.audioBlocked=false;NET.joinedLevel=null;NET.mask=-1;
  if(wasGuest){NET.gMus={name:undefined,ph:''};try{Music.play('title');}catch(_){}}}
function netClose(msg){NET.server=-1;NET.probing=false;const host=NET.role==='host';netTeardown();NET.role=null;NET.st='off';
  if(host){netToast(msg||'Cerraste la partida en línea.');}else{scene='online';NET.ui='msg';NET.msg=msg||'Saliste de la partida.';NET.sel=0;}}
function netEnd(msg){const host=NET.role==='host',was=NET.slot,sv=NET.server;netTeardown();NET.role=null;NET.st='off';
  if(!host&&sv>=0&&was&&/cerró la partida|Se cortó/.test(msg)){scene='online';NET.ui='gwait';NET.code=NET_SERVERS[sv].code;NET.probing=true;netToast('El anfitrión salió del servidor.','Volviendo a entrar…');
    setTimeout(()=>{if(NET.server===sv&&!NET.role&&NET.probing)netServerJoin(sv);},was===1?400:2600);return;}
  if(host){netToast(msg);}else{scene='online';NET.ui='msg';NET.msg=msg;NET.sel=0;sfx('deny');}}
function netFail(msg){netTeardown();NET.role=null;NET.st='off';scene='online';NET.ui='msg';NET.msg=msg;NET.sel=0;sfx('deny');}
addEventListener('pagehide',()=>{if(NET.role)netTeardown();});

/* ---------- the EN LÍNEA screen ---------- */
function openOnline(){scene='online';NET.sel=0;NET.t=0;if(NET.role==='host')NET.ui='host';else if(NET.role==='guest')NET.ui='gwait';else NET.ui='menu';sfx('card');}
const NET_ENTRY_ROWS=[[0,10],[10,20],[20,23]];
function netEntryRow(i){return i<10?0:i<20?1:2;}
function netEntryMove(dx,dy){let i=NET.esel;const r=netEntryRow(i);
  if(dx){const [a,b]=NET_ENTRY_ROWS[r];i=a+((i-a+dx+(b-a))%(b-a));}
  if(dy){const nr=clamp(r+dy,0,2);if(nr!==r){const col=r===2?[1,5,8][i-20]:(i-NET_ENTRY_ROWS[r][0]);i=nr===2?20+(col<4?0:col<7?1:2):NET_ENTRY_ROWS[nr][0]+Math.min(9,col);}}
  if(i!==NET.esel){NET.esel=i;sfx('move');}}
function netType(ch){if(NET.entry.length<4){NET.entry+=ch;sfx('knock');if(NET.entry.length===4)NET.esel=21;}else sfx('deny');}
function netSubmit(){if(NET.entry.length<4){sfx('deny');NET.flash=.6;return;}sfx('select');netJoin(NET.entry);}
/* typing the code on a keyboard: letters and digits of the code go straight in, before the game sees them */
addEventListener('keydown',e=>{if(scene!=='online'||NET.ui!=='entry'||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=(e.key||'').toUpperCase();
  if(k.length===1&&NET_ALPH.includes(k)){e.preventDefault();e.stopImmediatePropagation();unlock();netType(k);}
  else if(e.key==='Backspace'){e.preventDefault();e.stopImmediatePropagation();if(NET.entry){NET.entry=NET.entry.slice(0,-1);sfx('back');}else{NET.ui='priv';NET.sel=1;sfx('back');}}
  else if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();unlock();netSubmit();}
},true);
function netUpdUI(dt,IN){const I=IN.M;NET.t+=dt;if(NET.flash>0)NET.flash-=dt;
  if(NET.ui==='menu'){const n=5;netScanStart();if(I.up){NET.sel=(NET.sel+n-1)%n;sfx('move');}if(I.down){NET.sel=(NET.sel+1)%n;sfx('move');}
    if(I.no){sfx('back');netScanStop();scene='title';return;}
    if(I.ok){if(NET.sel<3){const inf=NET.srvInfo[NET.sel];if(inf&&inf.n>=3){sfx('deny');NET.flash=.3;return;}sfx('select');netServerJoin(NET.sel);}
      else if(NET.sel===3){sfx('select');netScanStop();NET.ui='priv';NET.sel=0;}else{sfx('back');netScanStop();scene='title';}}}
  else if(NET.ui==='priv'){const n=3;if(I.up){NET.sel=(NET.sel+n-1)%n;sfx('move');}if(I.down){NET.sel=(NET.sel+1)%n;sfx('move');}
    if(I.no){sfx('back');NET.ui='menu';NET.sel=3;return;}
    if(I.ok){NET.server=-1;if(NET.sel===0){sfx('select');netHost();}else if(NET.sel===1){sfx('select');NET.ui='entry';NET.entry='';NET.esel=0;}else{sfx('back');NET.ui='menu';NET.sel=3;}}}
  else if(NET.ui==='entry'){if(I.left)netEntryMove(-1,0);if(I.right)netEntryMove(1,0);if(I.up)netEntryMove(0,-1);if(I.down)netEntryMove(0,1);
    if(I.no&&!I.ok){if(NET.entry){NET.entry=NET.entry.slice(0,-1);sfx('back');}else{NET.ui='priv';NET.sel=1;sfx('back');}return;}
    if(I.ok){const i=NET.esel;if(i<20)netType(NET_ALPH[i]);else if(i===20){if(NET.entry){NET.entry=NET.entry.slice(0,-1);sfx('back');}}else if(i===21)netSubmit();else{NET.ui='priv';NET.sel=1;sfx('back');}}}
  else if(NET.ui==='host'){if(NET.role!=='host'){NET.ui='menu';NET.sel=NET.server>=0?NET.server:0;return;}
    if(I.up||I.down){NET.sel=1-NET.sel;sfx('move');}
    if(I.no){sfx('back');scene='title';return;}
    if(I.ok){if(NET.sel===0){sfx('select');scene='slots';SL.sel=slot;SL.del=false;}else{sfx('back');netClose(NET.server>=0?'Saliste del servidor.':'Cerraste la partida en línea.');NET.ui='menu';NET.sel=0;}}}
  else if(NET.ui==='gwait'){if(NET.role!=='guest'&&!NET.probing&&!(NET.role==='host')){NET.ui='menu';return;}if(NET.role==='host'){NET.ui='host';NET.sel=0;return;}
    if(NET.st==='live'||NET.st==='relay'||NET.st==='signal'){netGuestTick(dt);return;}
    if(I.ok||I.no){sfx('back');const sv=NET.server;netClose('Cancelaste la conexión.');if(sv>=0){NET.ui='menu';NET.sel=sv;}else{NET.ui='entry';NET.esel=21;}}}
  else if(NET.ui==='msg'){if(I.ok||I.no){sfx('back');const sv=NET.server;NET.server=-1;if(sv<0&&NET.entry.length===4){NET.ui='entry';NET.esel=21;}else{NET.ui='menu';NET.sel=Math.max(0,sv);}}}}

function netBG(){ctx.fillStyle='#2b1d14';ctx.fillRect(0,0,W,H);ctx.save();ctx.translate(W/2,H*.55);ctx.rotate(NET.t*.12);
  for(let i=0;i<18;i++){ctx.rotate(TAU/18);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(720,-64);ctx.lineTo(720,64);ctx.closePath();ctx.fillStyle=i%2?'rgba(242,193,78,.08)':'rgba(239,224,191,.04)';ctx.fill();}ctx.restore();
  /* two little telephones joined by a wire: one on each side */
  const wob=Math.sin(NET.t*3)*3;ctx.save();ctx.strokeStyle=C.paper;ctx.lineWidth=3;ctx.setLineDash([2,7]);ctx.beginPath();ctx.moveTo(96,300);
  ctx.bezierCurveTo(200,470+wob*4,W-200,470-wob*4,W-96,300);ctx.stroke();ctx.restore();}
function netPhone(x,y,flip,ring){ctx.save();ctx.translate(x,y);ctx.scale(flip?-1:1,1);ctx.rotate(ring?Math.sin(NET.t*28)*.12:0);
  rr(-34,-8,68,52,10,C.rust,3.5);rr(-22,4,44,30,15,C.paper,3);ctx.beginPath();ctx.arc(0,19,8,0,TAU);ctx.fillStyle=C.ink;ctx.fill();
  rr(-46,-28,92,20,10,C.ink,0);rr(-44,-27,88,17,8,'#3a2717',2);ctx.restore();}
function netKey(x,y,w,h,label,sel,size=22,col){const p=sel?Math.sin(NET.t*8)*1.5:0;rr(x,y+3,w,h,8,C.ink,0);rr(x,y-p,w,h,8,sel?C.brass:(col||C.paper),3);txt(label,x+w/2,y+h/2-p+1,size,sel?C.ink:C.ink,null);}
function drawOnline(){netBG();const t=NET.t;
  if(NET.role==='guest'&&NET.st==='relay'){if(NET.img){ctx.imageSmoothingEnabled=true;ctx.drawImage(NET.img,0,0,W,H);}
    else{txt('Recibiendo la imagen…',W/2,H/2,30,C.paper,C.ink);}return;}
  if(NET.role==='guest'&&(NET.st==='live'||NET.st==='signal')){txt('¡Conectado!',W/2,H/2-30,44,C.brass,C.ink);btxt(NET.slot?'Eres '+netWho(NET.slot):'',W/2,H/2+14,20,C.paper,'center',900);btxt('Cargando la imagen de tu amigo…',W/2,H/2+44,16,C.paper,'center',800);return;}
  txt('EN LÍNEA',W/2,52,46,C.brass,C.ink);btxt(netInClaude()?'Hasta 3 jugadores · dentro de Claude: todos con sesión iniciada e invitados al juego':'Hasta 3 jugadores en computadoras distintas · sin cuenta: elige un servidor y entra',W/2,88,16,C.paper,'center',800);
  netPhone(84,300,false,NET.ui==='host'&&NET.role==='host'&&NET.st==='wait');netPhone(W-84,300,true,NET.ui==='gwait');
  card(W/2-300,112,600,352,C.paper,4,10);rr(W/2-288,124,576,328,6,null,2);
  if(NET.ui==='menu'){txt('SERVIDORES',W/2,146,24,C.rust,null);
    for(let i=0;i<3;i++){const y=164+i*70,on=NET.sel===i,inf=NET.srvInfo[i],n=inf?inf.n:-1,full=n>=3,sh=on&&full&&NET.flash>0?Math.sin(NET.flash*60)*4:0;
      netKey(W/2-260+sh,y,520,60,'',on,22,full?'#d8c7a6':null);
      btxt(netSrvName(i),W/2-240+sh,y+24,20,C.ink,'left',900);
      btxt(n<0?(NET.scanFail?'no se pudo ver quién está':'mirando quién está…'):n===0?'vacío · entra y serás el anfitrión':full?'lleno':n===1?'1 jugando · ¡únete!':n+' jugando · ¡únete!',W/2-240+sh,y+46,14,on?C.ink:C.rustD,'left',800);
      for(let k=0;k<3;k++){const cx=W/2+104+k*34+sh,cy=y+30,fill=k<n;ctx.beginPath();ctx.arc(cx,cy,11,0,TAU);ctx.fillStyle=fill?['#e2603f','#2ec4b6','#8a63c7'][k]:'rgba(20,13,8,.12)';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}
      btxt(n<0?'?/3':n+'/3',W/2+240+sh,y+36,16,full?C.rust:C.ink,'right',900);}
    netKey(W/2-200,382,250,38,'PRIVADA CON CÓDIGO',NET.sel===3,16);netKey(W/2+70,382,130,38,'VOLVER',NET.sel===4,16);
    if(netInClaude()){const a=NET.api;btxt(a===undefined?'Conectando con la sala de Claude…':a?'✔ Sala de Claude lista · tus amigos: sesión iniciada e invitados por correo (Compartir)':'✖ Sin sala de Claude: inicia sesión en claude.ai y pide que te inviten por correo',W/2,442,13,a?'#2f7d45':a===null?C.rust:C.ink,'center',900);}
    btxt('Máximo 3 por servidor: el primero en entrar es el anfitrión (Chispa), luego Cerilla y Velita.',W/2,488,14,C.paper,'center',800);
    btxt('Cualquiera con el juego puede entrar a estos servidores. Para jugar solo con amigos, usa PRIVADA CON CÓDIGO.',W/2,508,13,'#cdb894','center',700);return;}
  if(NET.ui==='priv'){const items=[['CREAR PARTIDA','Tú pones el juego y recibes un código para tus amigos.'],['UNIRSE CON CÓDIGO','Escribe el código que te dio tu amigo.'],['VOLVER','']];
    items.forEach(([a,b],i)=>{const y=150+i*92,on=i===NET.sel;if(i===2){netKey(W/2-90,y+6,180,40,a,on,20);return;}
      netKey(W/2-250,y,500,72,'',on);txt(a,W/2,y+26,26,C.ink,null);btxt(b,W/2,y+52,14,on?C.ink:C.rustD,'center',800);});
    btxt('Partida privada: solo entra quien tenga tu código.',W/2,488,14,C.paper,'center',800);return;}
  if(NET.ui==='host'&&NET.server>=0){const dots='.'.repeat(1+Math.floor(t*2)%3);btxt('ESTÁS EN EL',W/2,148,16,C.rust,'center',900);txt(netSrvName(NET.server),W/2,186,30,C.ink,null);
    if(NET.st==='joining')btxt('Abriendo el servidor'+dots,W/2,236,17,C.ink,'center',900);
    else{btxt('Jugador 1 · Chispa: tú (anfitrión)',W/2,226,16,'#2f7d45','center',900);for(const s of[1,2]){const G=NET.guests[s],y=226+s*22;btxt(`Jugador ${s+1} · ${NET_CHAR_NAME[netCharOf(s)]}: `+(G?(G.room||G.mq||G.live||G.slow?'¡conectado!':'entrando'+dots):'libre'+dots),W/2,y,16,G?'#2f7d45':C.ink,'center',900);}}
    btxt('El juego corre en tu compu: los demás ven tu pantalla y juegan con sus controles.',W/2,306,14,C.rustD,'center',800);
    netKey(W/2-170,336,340,48,'¡A JUGAR!',NET.sel===0,24);netKey(W/2-130,398,260,40,'SALIR DEL SERVIDOR',NET.sel===1,17);
    btxt('Deja esta pestaña a la vista: si la escondes, el juego se pausa para todos.',W/2,488,13,C.paper,'center',700);
    btxt(netChanText(),W/2,508,13,'#cdb894','center',700);return;}
  if(NET.ui==='host'){btxt('TU CÓDIGO',W/2,148,16,C.rust,'center',900);
    const code=NET.code||'····';for(let i=0;i<4;i++){const x=W/2-150+i*78,y=168,bob=Math.sin(t*3+i)*2;rr(x,y+4,66,80,10,C.ink,0);rr(x,y+bob,66,80,10,'#fff6df',3.5);txt(NET.st==='joining'?'·':code[i],x+33,y+42+bob,46,C.ink,null);}
    const dots='.'.repeat(1+Math.floor(t*2)%3);
    if(NET.st==='joining')btxt('Abriendo la partida'+dots,W/2,268,17,C.ink,'center',900);
    else for(const s of[1,2]){const G=NET.guests[s],y=262+(s-1)*22;btxt(`Jugador ${s+1} · ${NET_CHAR_NAME[netCharOf(s)]}: `+(G?(G.room||G.mq?'¡conectado!':G.slow?'conectado (modo lento)':G.live?'¡conectado!':'entrando'+dots):'esperando'+dots),W/2,y,16,G?'#2f7d45':C.ink,'center',900);}
    btxt('Diles que elijan EN LÍNEA → UNIRSE CON CÓDIGO y escriban este código.',W/2,314,14,C.rustD,'center',800);
    netKey(W/2-170,336,340,48,'¡A JUGAR!',NET.sel===0,24);netKey(W/2-130,398,260,40,'CERRAR PARTIDA',NET.sel===1,18);
    btxt('La partida sigue abierta mientras juegas. Deja esta pestaña a la vista: si la escondes, el juego se pausa.',W/2,488,13,C.paper,'center',700);
    btxt(netChanText(),W/2,508,13,'#cdb894','center',700);return;}
  if(NET.ui==='entry'){txt('ESCRIBE EL CÓDIGO',W/2,150,26,C.rust,null);const sh=NET.flash>0?Math.sin(NET.flash*60)*5:0;
    for(let i=0;i<4;i++){const x=W/2-130+i*66+sh,y=172,c=NET.entry[i];rr(x,y,54,62,8,'#fff6df',3);if(c)txt(c,x+27,y+33,36,C.ink,null);
      else if(i===NET.entry.length&&Math.floor(t*2.4)%2===0){ctx.fillStyle=C.rust;ctx.fillRect(x+15,y+48,24,4);}}
    for(let i=0;i<20;i++){const r=Math.floor(i/10),c=i%10,x=W/2-262+c*53,y=254+r*52;netKey(x,y,46,42,NET_ALPH[i],NET.esel===i,22);}
    [['BORRAR',W/2-262,120],['UNIRSE',W/2-120,240],['VOLVER',W/2+142,120]].forEach(([l,x,w],j)=>netKey(x,370,w,44,l,NET.esel===20+j,20,j===1&&NET.entry.length===4?'#bfe3d9':null));
    btxt('También puedes escribirlo con el teclado y pulsar Enter.',W/2,440,14,C.rustD,'center',800);return;}
  if(NET.ui==='gwait'){const dots='.'.repeat(1+Math.floor(t*2)%3);if(NET.server>=0)txt(netSrvName(NET.server),W/2,180,32,C.ink,null);else txt(NET.code,W/2,180,54,C.ink,null);
    btxt((NET.server>=0?'Entrando al servidor':'Buscando la partida')+dots,W/2,250,20,C.ink,'center',900);
    btxt('Esto puede tardar unos segundos.',W/2,280,15,C.rustD,'center',800);netKey(W/2-100,350,200,44,'CANCELAR',true,20);return;}
  if(NET.ui==='msg'){txt('¡Uy!',W/2,170,44,C.rust,null);netWrap(NET.msg,W/2,236,500,20);netKey(W/2-90,370,180,44,'VOLVER',true,20);}}
function netWrap(s,x,y,maxW,size){ctx.font=`800 ${size}px ${BFONT}`;const words=String(s).split(' ');let line='',yy=y;
  for(const w of words){const tst=line?line+' '+w:w;if(ctx.measureText(tst).width>maxW&&line){btxt(line,x,yy,size,C.ink,'center',800);line=w;yy+=size*1.35;}else line=tst;}if(line)btxt(line,x,yy,size,C.ink,'center',800);}
/* ---------- hooks into the game loop ---------- */
const _netReadInputs=readInputs;readInputs=function(){const r=_netReadInputs();NET.lastIN=r;return r;};
const _netStep=step;
step=function(dt){_netStep(dt);
  if(scene==='online')netUpdUI(dt,TR?NOIN:(NET.lastIN||NOIN));if(NET.scan&&(scene!=='online'||NET.ui!=='menu'))netScanStop();
  if(NET.role==='host')netHostTick(dt);else if(NET.role==='guest'&&(NET.st==='live'||NET.st==='relay'||NET.st==='signal')&&scene!=='online'){scene='online';NET.ui='gwait';}
  netSyncDom(dt);};
const _netDrawAch=drawAchToast;drawAchToast=function(){if(scene==='online')drawOnline();_netDrawAch();};
const _netSaveCfg=saveCfg;saveCfg=function(){const cp=cfg.players,cg=cfg.grain;if(NET.playersWas!=null)cfg.players=NET.playersWas;if(NET.grainWas!=null)cfg.grain=NET.grainWas;try{_netSaveCfg();}finally{cfg.players=cp;cfg.grain=cg;}};
const _netLegend=updateLegend;updateLegend=function(){if(NETIN.on){const cur=cfg.players;cfg.players=1;try{_netLegend();}finally{cfg.players=cur;}}else _netLegend();};
if(window.__game){window.__game.step=step;window.__game.render=render;window.__game.NET=NET;window.__game.NETIN=NETIN;window.__game.openOnline=openOnline;window.__game.netHost=netHost;window.__game.netJoin=netJoin;window.__game.netServerJoin=netServerJoin;window.__game.netClose=netClose;window.__game.saveCfg=saveCfg;}
