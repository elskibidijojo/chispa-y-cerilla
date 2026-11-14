'use strict';
/* ================= MI MÚSICA: the player's own audio files, kept only in this browser =================
   Files are picked with a file input, stored in IndexedDB on this device and never uploaded.
   Each music "slot" (title, maps, shop, every level) can be assigned one of the files. */
const MyMusic={files:[],urls:[],audio:null,curFile:-1,ready:false};
const MM_DB='chispa-mimusica',MM_STORE='files';
function mmOpen(){return new Promise((res,rej)=>{try{const r=indexedDB.open(MM_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(MM_STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}catch(e){rej(e);}});}
async function mmLoad(){try{const db=await mmOpen();const tx=db.transaction(MM_STORE,'readonly'),st=tx.objectStore(MM_STORE);
    const list=await new Promise((res,rej)=>{const q=st.get('list');q.onsuccess=()=>res(q.result||[]);q.onerror=()=>rej(q.error);});mmSet(list);}catch(_){}MyMusic.ready=true;}
async function mmSave(list){try{const db=await mmOpen();const tx=db.transaction(MM_STORE,'readwrite');tx.objectStore(MM_STORE).put(list,'list');}catch(_){}}
function mmSet(list){for(const u of MyMusic.urls)try{URL.revokeObjectURL(u);}catch(_){}
  MyMusic.files=list.map(f=>({name:f.name.replace(/\.[a-z0-9]+$/i,''),blob:f.blob}));MyMusic.urls=MyMusic.files.map(f=>URL.createObjectURL(f.blob));}
function pickMyMusic(){const inp=document.createElement('input');inp.type='file';inp.multiple=true;inp.accept='audio/*,.mp3,.ogg,.wav,.m4a';
  inp.onchange=async()=>{const fs=[...(inp.files||[])].filter(f=>/^audio\//.test(f.type)||/\.(mp3|ogg|wav|m4a)$/i.test(f.name));if(!fs.length)return;
    fs.sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));const list=fs.map(f=>({name:f.name,blob:f}));mmSet(list);await mmSave(list);
    cfg.myMusic=true;cfg.myMap={};saveCfg();if(typeof toast==='function')toast(`${list.length} canciones cargadas`);mmRefresh();};
  try{inp.click();}catch(_){}}
async function clearMyMusic(){mmSet([]);await mmSave([]);cfg.myMusic=false;cfg.myMap={};saveCfg();mmRefresh();}
/* canonical music slots (aliases collapse onto one slot) */
const MM_LABEL={title:'Título',map1:'Mapa · Isla 1',map2:'Mapa · Isla 2',map3:'Mapa · Isla 3',shop:'Bazar',ending:'Final',mausoleo:'Mausoleo'};
function mmSlots(){const seen=new Set(),out=[];for(const k of Object.keys(SONGS)){const n=SONGS[k].name;if(seen.has(n))continue;seen.add(n);out.push(k);}return out;}
function mmCanon(name){const def=SONGS[name];if(!def)return name;return mmSlots().find(k=>SONGS[k].name===def.name)||name;}
function mmSlotLabel(k){return MM_LABEL[k]||(typeof LEVELS!=='undefined'&&LEVELS[k]?LEVELS[k].name:SONGS[k].name);}
function mmFileFor(slot){const n=MyMusic.files.length;if(!n)return -1;const m=cfg.myMap||{};if(m[slot]!==undefined)return m[slot];const i=mmSlots().indexOf(slot);return i<0?0:i%n;}
function mmVolume(){if(MyMusic.audio)MyMusic.audio.volume=(muted||cfg.muted)?0:clamp(cfg.music,0,1);}
function mmStop(){if(MyMusic.audio){try{MyMusic.audio.pause();}catch(_){}}MyMusic.curFile=-1;}
function mmPlayFile(i){if(i<0||!MyMusic.urls[i]){mmStop();return;}if(MyMusic.curFile===i&&MyMusic.audio&&!MyMusic.audio.paused)return;
  if(!MyMusic.audio){MyMusic.audio=new Audio();MyMusic.audio.loop=true;}const a=MyMusic.audio;a.src=MyMusic.urls[i];MyMusic.curFile=i;mmVolume();try{const p=a.play();if(p&&p.catch)p.catch(()=>{MyMusic.curFile=-1;});}catch(_){}}
let mmLast=null;
const synthPlay=Music.play.bind(Music),synthStop=Music.stop.bind(Music);
Music.play=function(name){mmLast=name;if(cfg.myMusic&&MyMusic.files.length){const fi=mmFileFor(mmCanon(name));if(fi>=0){synthStop();mmPlayFile(fi);return;}}mmStop();synthPlay(name);};
Music.stop=function(){mmStop();synthStop();};
function mmRefresh(){const n=mmLast;mmLast=null;if(n){if(!(cfg.myMusic&&MyMusic.files.length))mmStop();Music.play(n);}}
mmLoad().then(()=>{if(mmLast)mmRefresh();});
setInterval(mmVolume,250);
