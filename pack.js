'use strict';
/* ================= JAZZ REAL: recorded tracks by Kevin MacLeod (incompetech.com), CC BY 4.0 =================
   One track per music slot. Played with a streaming <audio> element; the synth stays as the fallback
   ("Música: sintetizada" in Opciones) and the player's own files ("Mi música") still take priority. */
const PACK={
  title:['rollin-at-5','Rollin at 5'],map1:['look-busy','Look Busy'],map2:['long-stroll','Long Stroll'],map3:['shades-of-spring','Shades of Spring'],
  shop:['mister-exposition','Mister Exposition'],ending:['wagon-wheel','Wagon Wheel'],results:['sweeter-vermouth','Sweeter Vermouth'],
  /* run & gun: each tune fits its place */
  feria:['merry-go','Merry Go'],fabrica:['gaslamp-funworks','Gaslamp Funworks'],muelle:['netherworld-shanty','Netherworld Shanty'],setas:['mischief-maker','Mischief Maker'],
  nubes:['nothing-broken','Nothing Broken'],feria_noche:['waltz-of-the-carnies','Waltz of the Carnies'],torre:['graveyard-shift','Graveyard Shift'],mina:['iron-horse','Iron Horse'],
  /* bosses: real hot-jazz records from 1918-1925 (public domain) */
  reloj:['pd-reloj','Tiger Rag — Friars Society Orchestra (1922)','pd'],gramo:['pd-gramo','Copenhagen — Wolverine Orchestra (1924)','pd'],baron:['pd-baron','Clarinet Marmalade — Lieut. Jim Europe\'s 369th U.S. Inf. "Hell Fighters" Band (1919)','pd'],tostada:['pd-tostada','Hot Lips — Synco Jazz Band (1922)','pd'],cascanueces:['pd-cascanueces','Yankee Doodle Blues — Ladd\'s Black Aces (1922)','pd'],faro:['pd-faro','Panama — Friars Society Orchestra (1922)','pd'],cangrejo:['pd-cangrejo','Maldito Tango — Orquesta Roberto Firpo (1922)','pd'],ballena:['pd-ballena','Motor Boat One Step — Italian Dance Orchestra (1918)','pd'],paraguas:['pd-paraguas','Charleston — Six Black Diamonds (1925)','pd'],caldera:['pd-caldera','Snag It — Fletcher Henderson & His Dixie Stompers (1923)','pd'],vela:['pd-vela','Spooky-Ooky Blues — Green Brothers Novelty Band (1921)','pd'],buho:['pd-buho','Mysterious Blues — Joe Samuels\' Jazz Band (1921)','pd'],murcielago:['pd-murcielago','Little Blue Devil Medley — George Hamilton Green\'s Novelty Orchestra (1919)','pd'],espantapajaros:['pd-espantapajaros','Cock-A-Doodle-Doo — Harry Raderman\'s Orchestra (1922)','pd'],maquina:['pd-maquina','Frivolity One-Step — George Hamilton Green (1918)','pd'],chistera:['pd-chistera','Arabia One-Step — Green Bros. Novelty Band (1921)','pd'],apagon:['pd-apagon','Clarinet Marmalade — Merritt Brunies and his Friars Inn Orchestra (1925)','pd'],
  mausoleo:['dark-hallway-distressed','Dark Hallway (distressed)'],mausoleo2:['mysterioso-march','Mysterioso March'],mausoleo3:['halls-of-the-undead','Halls of the Undead']};
/* last phase of every boss: the band kicks into a wilder number of the same flavour */
const PACK_FINAL={reloj:['pd-reloj-f','Bugle Call Blues — Friars Society Orchestra (1922)','pd'],gramo:['pd-gramo-f','Riverboat Shuffle — Wolverine Orchestra (1924)','pd'],baron:['pd-baron-f','Fire Call — New York Fire Department Band (1923)','pd'],tostada:['pd-tostada-f','Hot Dog! — Broadway Dance Orchestra (1923)','pd'],cascanueces:['pd-cascanueces-f','Bugle Call Rag — Missouri Jazz Band (1923)','pd'],faro:['pd-faro-f','Wolverine Blues — Albert E. Short And His Tivoli Syncopaters (1923)','pd'],cangrejo:['pd-cangrejo-f','Toreador Humoresque — Synco Jazz Band (1919)','pd'],ballena:['pd-ballena-f','Panama — McKenzie\'s Candy Kids (1924)','pd'],paraguas:['pd-paraguas-f','Charleston Crazy — Fletcher Henderson and His Orchestra (1923)','pd'],caldera:['pd-caldera-f','Dixie Flyer Sam (Sam del Dixie Flyer) — Six Black Diamonds (1924)','pd'],vela:['pd-vela-f','Mysterious Blues — Synco Jazz Band (1921)','pd'],buho:['pd-buho-f','Toddle — Wiedoeft\'s Californians (1921)','pd'],murcielago:['pd-murcielago-f','Skeleton Dance — Leonard Derby (1924)','pd'],espantapajaros:['pd-espantapajaros-f','Wang Wang Blues — Tim Brymn And His Black Devil Orchestra (1921)','pd'],maquina:['pd-maquina-f','At The Jazz Band Ball — Synco Jazz Band (1919)','pd'],chistera:['pd-chistera-f','Oriental One Step — Emerson Military Band (1918)','pd'],apagon:['pd-apagon-f','Sensation — Wadsworth Novelty Dance Orchestra (1918)','pd']};
const Pack={audio:null,want:null,cur:null};
if(cfg.pack===undefined)cfg.pack=true;
function packOn(){return cfg.pack!==false&&typeof Audio!=='undefined';}
function packVolume(){if(Pack.audio)Pack.audio.volume=(muted||cfg.muted||document.hidden)?0:clamp(cfg.music*.7,0,1);}
function packStop(){Pack.want=null;if(Pack.audio){try{Pack.audio.pause();}catch(_){}}}
function packPlay(slot){packPlayFile(PACK[slot][0]);}
function packPlayFile(f){Pack.want=f;
  if(!Pack.audio){Pack.audio=new Audio();Pack.audio.loop=true;Pack.audio.preload='auto';}
  const a=Pack.audio;if(Pack.cur!==f){Pack.cur=f;a.src='musica/'+f+'.mp3';a.playbackRate=1;}else if(!a.paused)return;
  packVolume();try{const p=a.play();if(p&&p.catch)p.catch(()=>{});}catch(_){}}
function songLabel(k){const c=mmCanon(k);return packOn()&&PACK[c]?PACK[c][1]:SONGS[k].name;}
const mmMusicPlay=Music.play;
Music.play=function(name){const c=mmCanon(name);
  if(cfg.myMusic&&MyMusic.files.length&&mmFileFor(c)>=0){packStop();mmMusicPlay(name);return;}
  if(packOn()&&PACK[c]){mmLast=name;mmStop();synthStop();packPlay(c);return;}
  packStop();mmMusicPlay(name);};
const mmMusicStop=Music.stop;Music.stop=function(){packStop();mmMusicStop();};
/* browsers only start audio after a key press or tap: retry then */
function packKick(){if(Pack.want&&Pack.audio&&Pack.audio.paused){packVolume();try{const p=Pack.audio.play();if(p&&p.catch)p.catch(()=>{});}catch(_){}}}
addEventListener('keydown',packKick,true);addEventListener('pointerdown',packKick,true);
document.addEventListener('visibilitychange',packVolume);
setInterval(packVolume,250);
/* boss phases: each new phase the band plays a little faster; the last phase switches to a wilder tune */
function musicPhase(id,i,n){if(!packOn()||(cfg.myMusic&&MyMusic.files.length)||!Pack.audio)return;
  if(i===n-1&&n>=2&&PACK_FINAL[id]){packPlayFile(PACK_FINAL[id][0]);return;}
  try{Pack.audio.preservesPitch=false;Pack.audio.playbackRate=1+.045*i;}catch(_){}}
