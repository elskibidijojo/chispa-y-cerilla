'use strict';
/* ================= RECORDED SFX: CC0 sounds by Kenney (kenney.nl), aged with a 1930s filter =================
   Samples layer on top of (or replace) the synth effects. If a sample has not loaded yet, the synth plays. */
const SMP_NAMES=['hit1','hit2','hit3','punch1','punch2','punchm','bell','bell2','ting1','ting2','metal','metalh','glass','wood','woodl','plank','mine','plate','tin','step1','step2',
  'coins','coins2','cloth1','cloth2','click','latch','page','page2','door','creak','knife','cardp','cardp2','cards','cards2','shuffle','chips','chipsc',
  'sel','sel2','tick','err','back','maxi','mini','pluck','bong','toggle','v_ready','v_go','v_final','v_win','v_gameover','v_round','v_ko'];
const SMP={},SMPstate={started:false};
function smpLoad(){if(SMPstate.started||!AC||typeof fetch==='undefined')return;SMPstate.started=true;
  const local=n=>{const d=window.SFX_DATA&&window.SFX_DATA[n];if(!d)return null;const bin=atob(d),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return Promise.resolve(u.buffer);};
  for(const n of SMP_NAMES){(local(n)||fetch('sfx/'+n+'.mp3').then(r=>r.ok?r.arrayBuffer():null)).then(ab=>ab&&new Promise((res,rej)=>AC.decodeAudioData(ab,res,rej))).then(b=>{if(b)SMP[n]=b;}).catch(()=>{});}}
/* play a sample: o.v volume, o.rate pitch, o.at delay; returns false if not loaded */
function smp(n,o={}){if(!AC||!SMP[n])return false;try{const s=AC.createBufferSource(),g=AC.createGain(),t=AC.currentTime+(o.at||0);s.buffer=SMP[n];s.playbackRate.value=(o.rate||1)*(o.jit?1+(rand()-.5)*o.jit:1);
  g.gain.value=o.v??.6;s.connect(g);g.connect(o.dry&&typeof SFXDRY!=='undefined'?SFXDRY:SFXG);s.start(t);}catch(_){return false;}return true;}
const pickS=(...a)=>a[Math.floor(rand()*a.length)];
/* wrap: run the recorded version; fall back to the old synth version when samples are missing */
function sfxOver(name,fn,keepSynth){const old=SFX[name];SFX[name]=function(...a){const ok=fn(...a);if(ok===false||keepSynth)old&&old(...a);};}
sfxOver('hit',()=>{if(lim('hitS',.07))return true;return smp(pickS('hit1','hit2','hit3'),{v:.32,jit:.25,rate:1.25});});
sfxOver('hitBig',()=>smp('punch1',{v:.55,jit:.1}));
sfxOver('ex',()=>{smp('punch2',{v:.6,rate:.9});return smp('knife',{v:.35,rate:1.3});},true);
sfxOver('hurt',()=>{const ok=smp('punchm',{v:.75});smp('glass',{v:.25,rate:1.4,at:.02});
  if(ok){tn(1400,.45,{type:'sine',v:.05,slide:-1100,at:.05});}return ok;});
sfxOver('death',()=>{const ok=smp('punch1',{v:.8,rate:.8});if(!ok)return false;smp('bell',{v:.5,rate:.75,at:.25});tn(1600,.9,{type:'sine',v:.06,slide:-1450,at:.1});
  [392,370,349,330,311,262].forEach((f,i)=>tn(f,i<5?.13:.7,{type:'sawtooth',v:.045,at:.55+i*.14,lp:1200}));return true;});
sfxOver('parry',()=>{const ok=smp('ting1',{v:.65,rate:1.15});if(!ok)return false;smp('metal',{v:.35,rate:1.5});tn(2637,.32,{type:'sine',v:.05,at:.02});tn(3951,.4,{type:'sine',v:.03,at:.06});nz(.05,{f:7000,type:'highpass',v:.07});return true;});
sfxOver('revive',()=>{const ok=smp('maxi',{v:.5});if(!ok)return false;[523,659,784,1047,1319,1568].forEach((f,i)=>tn(f,.22,{type:'triangle',v:.045,at:.05+i*.06}));smp('ting2',{v:.35,at:.4});return true;});
sfxOver('soul',()=>{[784,988,1175,1568].forEach((f,i)=>tn(f,.45,{type:'sine',v:.03,at:.3+i*.12}));return smp('ting2',{v:.25,rate:.8,at:.3});});
sfxOver('coin',()=>smp(pickS('coins','coins2'),{v:.55,jit:.1}),true);
sfxOver('jump',()=>{if(lim('jumpS',.05))return true;return smp(pickS('cloth1','cloth2'),{v:.35,rate:1.6,jit:.15});},true);
sfxOver('dash',()=>smp('cloth2',{v:.55,rate:1.9}),true);
sfxOver('land',()=>{if(lim('landS',.08))return true;return smp(pickS('step1','step2'),{v:.4,jit:.2});});
sfxOver('select',()=>smp('cardp',{v:.5,rate:1.2}));
sfxOver('move',()=>{if(lim('moveS',.04))return true;return smp(pickS('cards','cards2'),{v:.35,rate:1.6,jit:.1});});
sfxOver('back',()=>smp('back',{v:.4}));
sfxOver('deny',()=>smp('err',{v:.45,rate:.8}));
sfxOver('buy',()=>{const ok=smp('chips',{v:.6});smp('coins',{v:.45,at:.08});return ok;},true);
sfxOver('card',()=>smp('cardp2',{v:.55}));
sfxOver('swap',()=>smp('click',{v:.55,rate:1.2}));
sfxOver('pause',()=>smp('shuffle',{v:.4,rate:1.4}));
sfxOver('trans',()=>smp('page',{v:.5}));
sfxOver('boom',()=>{if(lim('boomS',.08))return true;return smp('punch2',{v:.6,rate:.7,jit:.1});},true);
sfxOver('stomp',()=>smp('plate',{v:.55,rate:.7}),true);
sfxOver('stamp',()=>smp('wood',{v:.7,rate:.8}));
sfxOver('knock',()=>{if(lim('knockS',.06))return true;return smp('woodl',{v:.55,jit:.15});});
sfxOver('crumble',()=>{if(lim('crumbleS',.09))return true;return smp('mine',{v:.35,jit:.2});});
sfxOver('crack',()=>smp('glass',{v:.7,rate:.8}),true);
sfxOver('ding',()=>smp('bell2',{v:.5,rate:1.5}));
sfxOver('ring',()=>smp('bell2',{v:.4,rate:1.7}),true);
sfxOver('smoke',()=>smp('cloth1',{v:.5,rate:.7}),true);
sfxOver('throw',()=>{if(lim('throwS',.08))return true;return smp('cloth2',{v:.35,rate:1.4,jit:.2});});
sfxOver('urn',()=>smp('tin',{v:.45}),true);
sfxOver('achieve',()=>smp('chipsc',{v:.5}),true);
sfxOver('shot',(w)=>{if(lim('shotS',.09))return true;smp('pluck',{v:.12,rate:1.8,jit:.2});return false;});
/* the boxing-bell knockout and the announcer */
SFX.ko=function(){smp('bell',{v:.8});smp('bell',{v:.75,at:.28});smp('bell',{v:.8,at:.56});nz(1.2,{f:4500,type:'highpass',v:.1});tn(80,.8,{type:'sine',v:.22,slide:-40});
  smp('v_ko',{v:1,at:.12});if(!SMP.bell)[1568,2093,2637].forEach((f,i)=>tn(f,1.4,{type:'sine',v:.06,at:i*.28}));};
SFX.announceReady=function(){if(!smp('v_ready',{v:1}))return;smp('v_go',{v:1.05,at:.95});};
SFX.announceFinal=function(){smp('v_final',{v:1});};
SFX.announceWin=function(){smp('v_win',{v:.95});};
SFX.announceLose=function(){smp('v_gameover',{v:.9});};
/* everybody down: a sad trombone, then the announcer */
SFX.gameover=function(){[[311,0,.32],[294,.36,.32],[277,.72,.32],[262,1.08,1.1]].forEach(([f,a,d])=>{tn(f,d,{type:'sawtooth',v:.06,at:a+.5,lp:1300,vib:a>1?7:0});tn(f*1.005,d,{type:'square',v:.025,at:a+.5,lp:900});});
  smp('v_gameover',{v:.95,at:2.1});};

/* ---------- cartoon accents (synth): slide whistles, boings, horns, cymbals, woodblocks ---------- */
function slideW(f0,f1,d,at=0,v=.05){const t=AC.currentTime+at,o=AC.createOscillator(),g=AC.createGain(),lf=AC.createOscillator(),lg=AC.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d);
  lf.frequency.value=7;lg.gain.value=f0*.02;lf.connect(lg);lg.connect(o.frequency);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.03);g.gain.setValueAtTime(v,t+d*.8);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(SFXG);o.start(t);lf.start(t);o.stop(t+d+.05);lf.stop(t+d+.05);}
function boingS(f=180,d=.5,at=0,v=.12){const t=AC.currentTime+at,o=AC.createOscillator(),g=AC.createGain(),m=AC.createOscillator(),mg=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*2.4,t+d*.25);o.frequency.exponentialRampToValueAtTime(f*1.6,t+d);
  m.frequency.setValueAtTime(22,t);m.frequency.linearRampToValueAtTime(8,t+d);mg.gain.setValueAtTime(f*.6,t);mg.gain.exponentialRampToValueAtTime(f*.05,t+d);m.connect(mg);mg.connect(o.frequency);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(SFXG);o.start(t);m.start(t);o.stop(t+d+.05);m.stop(t+d+.05);}
function cymbal(at=0,v=.2,d=1.4){nz(d,{f:7000,type:'highpass',v,at});nz(.25,{f:3500,q:.8,v:v*.6,at});}
function hornS(at=0){[[330,.12],[262,.22]].forEach(([f,d],i)=>{const a=at+i*.15;tn(f,d,{type:'sawtooth',v:.06,at:a,lp:1400});tn(f*1.01,d,{type:'square',v:.04,at:a,lp:900});});}
function woodS(f=900,at=0){tn(f,.06,{type:'sine',v:.12,at,slide:-f*.4});nz(.02,{f:f*2,q:3,v:.06,at});}
Object.assign(SFX,{
  boing(){boingS();},whistleUp(){slideW(500,1900,.45);},whistleDown(){slideW(1900,380,.6);},cymbal(){cymbal();},honk(){hornS();},
  woodblock(){woodS(900);woodS(1200,.12);},ratchet(){for(let i=0;i<10;i++)woodS(1500+rand()*200,i*.03);},
  kaching(){if(!smp('bell2',{v:.55,rate:1.8}))tn(2637,.4,{type:'sine',v:.05});smp('coins',{v:.55,at:.05});woodS(700);},
  phaseHit(){cymbal(0,.22,1.6);slideW(400,1600,.5,.05,.05);if(SMP.punch1)smp('punch1',{v:.5,rate:.7});},
  koToon(){cymbal(.05,.25,2);boingS(140,.7,.35,.14);slideW(2200,300,1.1,.5,.05);},
  dizzy(){[1568,1760,1976,1760].forEach((f,i)=>tn(f,.12,{type:'sine',v:.03,at:i*.1}));},
  taunt(){woodS(700);woodS(950,.09);woodS(700,.18);},
  pageTurn(){if(!smp('page2',{v:.4}))nz(.2,{f:1500,v:.05});},
  footstepMap(){if(lim('mstep',.28))return;smp(pickS('step1','step2'),{v:.12,rate:1.3,jit:.2});},
});
/* start loading as soon as audio is unlocked */
setInterval(()=>{if(AC&&!SMPstate.started)smpLoad();},300);
