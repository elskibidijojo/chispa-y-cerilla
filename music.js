'use strict';
/* ================= MUSIC: original hot-jazz / ragtime big band, one song per level =================
   Each song is generated from its own seed with motif-based melodies (call & response, syncopation,
   chromatic approach notes), stride piano, walking or two-beat bass, brass stabs and drum fills. */
const SONGS={
  title:{name:'Obertura de Hojalata',bpm:168,key:60,style:'hot',lead:'trumpet',seed:11,prog:'rag1',fx:['banjo']},
  map1:{name:'Paseo de Hojalata',bpm:132,key:65,style:'rag',lead:'clar',seed:21,prog:'rag2',fx:['banjo','wood']},
  map2:{name:'Bahía Bruma',bpm:126,key:58,style:'swing',lead:'accordion',seed:31,prog:'swing1',fx:['bells']},
  map3:{name:'Cumbre Apagón',bpm:120,key:62,minor:true,style:'spooky',lead:'xylo',seed:41,prog:'minor1',fx:['organ']},
  shop:{name:'Bazar de Don Tornillo',bpm:112,key:67,style:'swing',lead:'piano',seed:51,prog:'swing1',fx:['brush']},
  feria:{name:'Feria de Hojalata',bpm:196,key:67,style:'circus',lead:'xylo',seed:61,prog:'rag1',fx:['banjo','wood']},
  fabrica:{name:'Fábrica a Toda Máquina',bpm:204,key:62,style:'hot',lead:'clar',seed:71,prog:'rag2',fx:['wood','stabs']},
  muelle:{name:'Muelle de la Bruma',bpm:188,key:64,style:'swing',lead:'accordion',seed:73,prog:'swing1',fx:['bells']},
  setas:{name:'Bosque de Setas',bpm:192,key:69,style:'rag',lead:'xylo',seed:79,prog:'rag2',fx:['wood','banjo']},
  feria_noche:{name:'Feria a Medianoche',bpm:200,key:64,minor:true,style:'circus',lead:'organ',seed:81,prog:'minor2',fx:['bells']},
  torre:{name:'Torre de las Sombras',bpm:208,key:59,minor:true,style:'spooky',lead:'violin',seed:83,prog:'minor1',fx:['organ','stabs']},
  reloj:{name:'¡Tic-Tac, a Pelear!',bpm:212,key:57,minor:true,style:'hot',lead:'trumpet',seed:91,prog:'minor2',fx:['wood','stabs']},
  gramo:{name:'Disco Rayado',bpm:200,key:60,style:'swing',lead:'sax',seed:93,prog:'swing1',fx:['stabs']},
  baron:{name:'Aeroplano de Papel',bpm:184,key:62,style:'march',lead:'trumpet',seed:161,prog:'rag1',fx:['stabs']},
  tostada:{name:'Desayuno Picante',bpm:216,key:65,style:'hot',lead:'xylo',seed:101,prog:'rag1',fx:['wood','stabs','banjo']},
  cascanueces:{name:'Marcha de los Soldaditos',bpm:192,key:58,style:'march',lead:'clar',seed:103,prog:'rag2',fx:['stabs','bells']},
  faro:{name:'Marea Brava',bpm:208,key:62,minor:true,style:'hot',lead:'trumpet',seed:111,prog:'minor1',fx:['stabs']},
  cangrejo:{name:'Castañuelas al Sol',bpm:196,key:64,minor:true,style:'tango',lead:'violin',seed:113,prog:'minor2',fx:['cast']},
  ballena:{name:'Acordeón del Mar',bpm:180,key:64,style:'march',lead:'accordion',seed:171,prog:'rag2',fx:['bells']},
  paraguas:{name:'Bailando Bajo la Lluvia',bpm:204,key:63,style:'swing',lead:'clar',seed:119,prog:'swing1',fx:['brush','stabs']},
  caldera:{name:'Vapor y Remaches',bpm:212,key:65,style:'hot',lead:'sax',seed:121,prog:'rag2',fx:['stabs','wood']},
  vela:{name:'Velas Negras',bpm:206,key:55,minor:true,style:'spooky',lead:'organ',seed:131,prog:'minor2',fx:['bells','stabs']},
  buho:{name:'Silencio en la Biblioteca',bpm:198,key:62,minor:true,style:'swing',lead:'clar',seed:133,prog:'minor1',fx:['brush']},
  murcielago:{name:'Vals del Murciélago',bpm:186,key:59,minor:true,style:'march',lead:'violin',seed:181,prog:'minor1',fx:['organ']},
  espantapajaros:{name:'Cosecha Maldita',bpm:200,key:57,minor:true,style:'rag',lead:'violin',seed:141,prog:'minor2',fx:['banjo','wood']},
  maquina:{name:'Tecleo Frenético',bpm:220,key:59,minor:true,style:'hot',lead:'xylo',seed:143,prog:'minor1',fx:['wood','stabs']},
  chistera:{name:'Abracadabra Swing',bpm:206,key:62,minor:true,style:'swing',lead:'sax',seed:147,prog:'minor2',fx:['bells','stabs']},
  apagon:{name:'El Rey Apagón',bpm:222,key:52,minor:true,style:'hot',lead:'trumpet',seed:151,prog:'minor2',fx:['stabs','organ']},
  mausoleo:{name:'Eco del Mausoleo',bpm:176,key:60,minor:true,style:'spooky',lead:'organ',seed:157,prog:'minor1',fx:['bells']},
  nubes:{name:'Paseo en las Nubes',bpm:184,key:65,style:'swing',lead:'clar',seed:211,prog:'swing1',fx:['bells','brush']},
  mina:{name:'Mina de Carbón',bpm:200,key:57,minor:true,style:'rag',lead:'xylo',seed:223,prog:'minor2',fx:['wood','banjo']},
  mausoleo2:{name:'Niebla en las Urnas',bpm:184,key:62,minor:true,style:'spooky',lead:'violin',seed:227,prog:'minor2',fx:['bells','organ']},
  mausoleo3:{name:'Medianoche en el Panteón',bpm:192,key:55,minor:true,style:'tango',lead:'organ',seed:229,prog:'minor1',fx:['bells','stabs']},
  results:{name:'Fanfarria del Nocaut',bpm:176,key:62,style:'hot',lead:'trumpet',seed:197,prog:'rag1',fx:['stabs']},
  ending:{name:'¡Volvió la Luz!',bpm:172,key:60,style:'hot',lead:'trumpet',seed:191,prog:'rag1',fx:['banjo','stabs']},
};
/* old names still used in a few places */
Object.assign(SONGS,{boss1:SONGS.reloj,boss1b:SONGS.tostada,boss2:SONGS.faro,boss2b:SONGS.caldera,boss3:SONGS.vela,boss3b:SONGS.mausoleo,final:SONGS.apagon,
  plane:SONGS.baron,plane2:SONGS.ballena,plane3:SONGS.murcielago,run1:SONGS.feria,run2:SONGS.fabrica,run3:SONGS.feria_noche});
const PROGS={
  rag1:[[0,'six'],[0,'six'],[9,'dom'],[9,'dom'],[2,'dom'],[2,'dom'],[7,'dom'],[7,'dom'],[0,'six'],[0,'six'],[9,'dom'],[9,'dom'],[2,'dom'],[7,'dom'],[0,'six'],[7,'dom']],
  rag2:[[0,'maj'],[4,'dom'],[9,'min'],[0,'dom'],[5,'maj'],[5,'min'],[0,'maj'],[7,'dom'],[0,'maj'],[4,'dom'],[9,'min'],[2,'dom'],[7,'dom'],[7,'dom'],[0,'maj'],[7,'dom']],
  swing1:[[0,'six'],[9,'dom'],[2,'m7'],[7,'dom'],[0,'six'],[9,'dom'],[2,'m7'],[7,'dom'],[5,'maj'],[5,'min'],[0,'six'],[9,'dom'],[2,'m7'],[7,'dom'],[0,'six'],[7,'dom']],
  minor1:[[0,'min'],[0,'min'],[5,'min'],[5,'min'],[7,'dom'],[7,'dom'],[0,'min'],[0,'min'],[8,'maj'],[8,'maj'],[2,'dim'],[7,'dom'],[0,'min'],[5,'min'],[7,'dom'],[0,'min']],
  minor2:[[0,'min'],[7,'dom'],[0,'min'],[7,'dom'],[5,'min'],[0,'min'],[2,'dim'],[7,'dom'],[0,'min'],[10,'dom'],[8,'maj'],[7,'dom'],[5,'min'],[2,'dim'],[7,'dom'],[0,'min']],
};
const Music=(()=>{
  const CH={maj:[0,4,7],min:[0,3,7],dom:[0,4,7,10],dim:[0,3,6,9],m7:[0,3,7,10],six:[0,4,7,9]};
  const MAJ=[0,2,4,5,7,9,11],MIN=[0,2,3,5,7,8,11];
  /* syncopated rhythm cells over 2 bars (16 eighths); 1 = note start */
  const CELLS=[[1,0,1,1,0,1,0,1,1,0,1,0,0,1,1,0],[1,1,1,0,1,0,0,1,0,1,1,1,0,1,0,0],[0,1,1,0,1,1,0,1,1,0,0,1,1,0,1,0],[1,0,0,1,0,0,1,0,1,1,1,1,1,0,0,0],
    [1,1,0,1,1,0,1,0,1,1,0,1,1,0,0,0],[0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0],[1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0],[1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,0]];
  const cache={};const mf=m=>440*Math.pow(2,(m-69)/12);
  function nearestTone(m,tones){let best=m,bd=99;for(let d=-6;d<=6;d++){const pc=((m+d)%12+12)%12;if(tones.includes(pc)&&Math.abs(d)<bd){bd=Math.abs(d);best=m+d;}}return best;}
  /* Big-band arrangement: INTRO (4) · HEAD (16, lead + section soli) · SOLO (16, hot runs over band backgrounds)
     · SHOUT (16, whole band, melody up high) · BREAK (2, stop-time + drum fill) → loops back to HEAD */
  function gen(def){const rng=srand(def.seed),sc=def.minor?MIN:MAJ,key=def.key,prog=PROGS[def.prog],NB=prog.length,fx=new Set(def.fx||[]),st=def.style;
    const hot=st==='hot'||st==='circus'||st==='tango',INTRO=4,HEAD=INTRO,SOLO=HEAD+NB,SHOUT=SOLO+NB,BRK=SHOUT+NB,bars=BRK+2,steps=bars*8,ev=Array.from({length:steps},()=>[]);
    const put=(s,e)=>{if(s>=0&&s<steps)ev[s].push(e);};
    const chordAt=b=>prog[(((b-HEAD)%NB)+NB)%NB];
    const tonesOf=b=>{const [deg,q]=chordAt(b);return CH[q].map(x=>((key+deg+x)%12+12)%12);};
    const scaleNote=i=>key+12*Math.floor(i/7)+sc[((i%7)+7)%7];
    const below=(m,b,n)=>{const tn=tonesOf(b),out=[];let x=m-1;while(out.length<n&&x>m-14){if(tn.includes(((x%12)+12)%12)&&m-x>=2&&(!out.length||out[out.length-1]-x>=2))out.push(x);x--;}return out;};
    const mkMotif=(lo,hi,dense)=>{const r=CELLS[Math.floor(rng()*CELLS.length)];let c=lo+Math.floor(rng()*(hi-lo));const ns=[];for(let i=0;i<16;i++)if(r[i]||(dense&&i%2===0&&rng()<.3)){c+=rng()<.6?(rng()<.5?1:-1):Math.floor(rng()*5)-2;c=clamp(c,lo-2,hi+2);ns.push([i,c]);}return ns;};
    const A=mkMotif(7,11),A2=A.map(([i,c])=>[i,c+(rng()<.5?2:-1)]),Bm=mkMotif(9,13),Cm=mkMotif(6,10),Sh=mkMotif(10,14,true);
    const lead2=def.solo||(def.lead==='clar'?'sax':def.lead==='sax'?'clar':def.lead==='trumpet'?'clar':'trumpet');
    /* melody writer: lead line + harmonized section underneath (soli) */
    const writeMelody=(b0,plan,octave,sect)=>{plan.forEach((m,ph)=>{const base=(b0+ph*2)*8;
        for(let j=0;j<m.length;j++){const [stp,c]=m[j],s=base+stp,b=Math.floor(s/8);let midi=scaleNote(c)+12+octave;
          if(stp%4===0||j===m.length-1)midi=nearestTone(midi,tonesOf(b));const nxt=j+1<m.length?m[j+1][0]:16,d=Math.min(ph%2&&j===m.length-1?6:4,nxt-stp);
          if(stp%4===0&&stp>0&&!ev[s-1].some(e=>e.i==='lead')&&rng()<.3)put(s-1,{i:'lead',m:midi-1,d:1,v:.75});
          put(s,{i:'lead',m:midi,d});if(sect)put(s,{i:'sect',ch:below(midi,b,3),d,v:sect});}
        /* answer from the other section in the second bar of every other phrase */
        if(ph%2===1){const b=b0+ph*2+1,tn=tonesOf(b);const top=scaleNote(9)+12;for(const k of[3,5,7]){const m=nearestTone(top+(k===5?2:0),tn);put(b*8+k,{i:'stab',ch:[m,...below(m,b,2)]});}}});};
    /* rhythm section for one bar */
    const rhythm=(b,mode)=>{const [deg,q]=chordAt(b),ch=CH[q],s0=b*8,root=36+((key+deg)%12),nroot=36+((key+chordAt(b+1)[0])%12),fill=(b-HEAD)%4===3;
      const tri=ch.slice(0,4).map(x=>{let m=60+((key+deg+x)%12);if(m>67)m-=12;return m;});const walk=mode!=='head'||st==='swing';
      if(walk){[root,root+ch[1],root+ch[2],nroot+(rng()<.5?1:-1)].forEach((m,k)=>put(s0+k*2,{i:st==='march'?'tuba':'upright',m,d:2}));}
      else{put(s0,{i:'tuba',m:root,d:2});put(s0+4,{i:'tuba',m:root+7>47?root-5:root+7,d:2});if(hot&&rng()<.4)put(s0+7,{i:'tuba',m:nroot-1,d:1});}
      if(st==='tango'){for(const k of[0,3,4,6])put(s0+k,{i:'comp',ch:tri,d:1});for(const k of[2,3,6,7])put(s0+k,{i:'cast'});}
      else{put(s0+2,{i:'comp',ch:tri,d:1});put(s0+6,{i:'comp',ch:tri,d:1});if(st==='swing'||mode==='solo')put(s0+5,{i:'comp',ch:tri,d:1,v:.7});}
      if(st==='rag'||fx.has('banjo'))for(const k of[1,3,5,7])put(s0+k,{i:'banjo',ch:tri});
      /* drums */
      const shout=mode==='shout',spooky=st==='spooky';
      put(s0,{i:'kick'});put(s0+4,{i:'kick'});if(shout){put(s0+2,{i:'kick',v:.7});put(s0+6,{i:'kick',v:.7});}else if(hot&&rng()<.4)put(s0+3,{i:'kick',v:.6});
      if(st==='march'){for(let k=0;k<8;k++)put(s0+k,{i:'snare',v:k%2?.25:k%4?.6:.8});}
      else{put(s0+2,{i:spooky?'wood':'snare',v:shout?1:.85});put(s0+6,{i:spooky?'wood':'snare',v:shout?1:.85});if(shout){put(s0,{i:'snare',v:.5});put(s0+4,{i:'snare',v:.5});}
        for(const k of[1,3,5,7])if(rng()<.3)put(s0+k,{i:'snare',v:.18});}
      const cym=st==='swing'||mode==='solo'?(fx.has('brush')?'brush':'ride'):'hat';for(const k of(cym==='hat'?[0,1,2,3,4,5,6,7]:[0,2,3,4,6,7]))put(s0+k,{i:cym,v:k%2?.55:.95});
      if(cym!=='hat'){put(s0+2,{i:'chick'});put(s0+6,{i:'chick'});}
      if(st==='circus'||shout)for(const k of[2,6])put(s0+k,{i:'cym',v:shout?.7:.45});
      if(fx.has('wood')&&!fill)for(const k of[1,5])put(s0+k,{i:'wood',v:.7});
      if(fx.has('bells')&&b%2===0)put(s0,{i:'bell',m:72+((key+deg)%12)});
      if(fx.has('organ')&&b%2===0)put(s0,{i:'organ',ch:tri.map(n=>n-12),d:8});
      if(fill){const tf=rng()<.5;for(let k=4;k<8;k++)put(s0+k,tf?{i:'tom',m:k,v:.85}:{i:'snare',v:.55+k*.06});}
      if((b-HEAD)%8===0)put(s0,{i:'crash'});};
    /* INTRO: band hits, drum break, pickup run */
    {const [d0,q0]=prog[0],top=nearestTone(scaleNote(11)+12,CH[q0].map(x=>(key+d0+x)%12)),hit=[top,...below(top,HEAD,3)];
      for(const s of[0,3,6])put(s,{i:'stab',ch:hit});put(0,{i:'crash'});put(0,{i:'tuba',m:36+((key+d0)%12),d:2});put(0,{i:'kick'});
      for(let k=8;k<16;k++)put(k,{i:'snare',v:.35+k*.04});put(16,{i:'stab',ch:hit});put(16,{i:'crash'});put(19,{i:'stab',ch:hit});put(22,{i:'stab',ch:hit});
      for(let k=24;k<32;k++){put(k,{i:'tom',m:k,v:.7});put(k,{i:'run',m:scaleNote(7+(k-24))+12,d:1});}}
    /* HEAD */
    writeMelody(HEAD,[A,A2,A,Cm,Bm,Bm,A,Cm],0,fx.has('stabs')||hot?.8:.55);for(let b=HEAD;b<SOLO;b++)rhythm(b,'head');
    /* SOLO: lead2 plays hot eighth-note lines; band answers with backgrounds */
    for(let b=SOLO;b<SHOUT;b++){const tn=tonesOf(b),s0=b*8;let c=8+Math.floor(rng()*4);const pat=Math.floor(rng()*4);
      for(let k=0;k<8;k++){if(pat===3&&k>5)break;if(pat===2&&k%3===2)continue;c+=pat===0?1:pat===1?-1:(rng()<.5?2:-1);c=clamp(c,5,15);let m=scaleNote(c)+12;if(k%2===0)m=nearestTone(m,tn);
        if(k===7&&rng()<.5)m=nearestTone(scaleNote(c+1)+12,tonesOf(b+1))-1;put(s0+k,{i:'solo',m,d:1});}
      if(b%2===1){const m=nearestTone(scaleNote(8)+12,tn);put(s0+1,{i:'sect',ch:[m,...below(m,b,2)],d:2,v:.45});put(s0+5,{i:'sect',ch:[m,...below(m,b,2)],d:2,v:.45});}
      rhythm(b,'solo');}
    /* SHOUT chorus: everybody, melody an octave up-ish, stabs on the off-beats */
    writeMelody(SHOUT,[Sh,A2,Sh,Cm,Bm,Sh,A,Cm],5,1);for(let b=SHOUT;b<BRK;b++){rhythm(b,'shout');if(b%2===0){const [deg,q]=chordAt(b),m=nearestTone(scaleNote(12)+12,tonesOf(b));put(b*8+7,{i:'stab',ch:[m,...below(m,b,3)]});}}
    /* BREAK: stop-time hits then a drum fill back into the head */
    {const s0=BRK*8,m=nearestTone(scaleNote(11)+12,tonesOf(BRK));put(s0,{i:'stab',ch:[m,...below(m,BRK,3)]});put(s0,{i:'crash'});put(s0,{i:'kick'});put(s0,{i:'tuba',m:36+((key+chordAt(BRK)[0])%12),d:2});
      put(s0+3,{i:'stab',ch:[m,...below(m,BRK,3)]});for(let k=8;k<16;k++)put(s0+k,k<12?{i:'snare',v:.4+k*.04}:{i:'tom',m:k,v:.9});}
    return{ev,steps,loopFrom:HEAD*8,bpm:def.bpm,swing:st==='swing'?.33:st==='march'||st==='tango'?.02:st==='spooky'?.12:.22,lead:def.lead,lead2};}
  /* --- instruments --- */
  function g8(t,v,a,d){const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+d);g.connect(MUSG);return g;}
  function osc(type,f,t,d){const o=AC.createOscillator();o.type=type;o.frequency.value=f;o.start(t);o.stop(t+d+.05);return o;}
  function lp(f,q=.7){const b=AC.createBiquadFilter();b.type='lowpass';b.frequency.value=f;b.Q.value=q;return b;}
  function vib(o,t,f,amt,delay){const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=f;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(amt,t+delay);l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(t+delay+3);}
  function leadNote(kind,m,t,d,v){const f=mf(m);
    switch(kind){
      case 'trumpet':{const g=g8(t,.055*v,.02,d+.05),fl=lp(700,1.5);fl.frequency.setValueAtTime(700,t);fl.frequency.linearRampToValueAtTime(3200,t+.03);fl.frequency.exponentialRampToValueAtTime(1300,t+d);
        for(const [ty,mul] of[['sawtooth',1],['square',1.004]]){const o=osc(ty,f*mul,t,d);o.frequency.setValueAtTime(f*mul*.96,t);o.frequency.exponentialRampToValueAtTime(f*mul,t+.04);if(d>.25)vib(o,t,5.8,f*.014,.18);o.connect(fl);}fl.connect(g);break;}
      case 'sax':{const g=g8(t,.06*v,.03,d+.06),bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1300;bp.Q.value=.9;const o=osc('sawtooth',f,t,d);o.frequency.setValueAtTime(f*.95,t);o.frequency.exponentialRampToValueAtTime(f,t+.06);
        if(d>.2)vib(o,t,5.2,f*.018,.12);const l=lp(3000);o.connect(bp);bp.connect(l);l.connect(g);break;}
      case 'clar':case 'clar2':{const g=g8(t,(kind==='clar'?.05:.022)*v,.025,d+.05),l=lp(kind==='clar'?2100:1400);const o=osc('square',f,t,d);vib(o,t,5.3,f*.007,.1);o.connect(l);l.connect(g);break;}
      case 'xylo':{const g=g8(t,.1*v,.002,.35);osc('sine',f*2,t,.4).connect(g);const g2=g8(t,.03*v,.002,.08);osc('sine',f*8,t,.1).connect(g2);break;}
      case 'piano':{const g=g8(t,.075*v,.004,Math.max(.5,d*1.3)),l=lp(2600);osc('triangle',f,t,1.2).connect(l);osc('sine',f*2.002,t,1.2).connect(l);l.connect(g);break;}
      case 'accordion':{const g=g8(t,.035*v,.03,d+.04),l=lp(2400);for(const k of[1,1.006,2])osc('sawtooth',f*k,t,d).connect(l);const trem=AC.createGain();trem.gain.value=.7;const lf=osc('sine',6.5,t,d),lg=AC.createGain();lg.gain.value=.3;lf.connect(lg);lg.connect(trem.gain);l.connect(trem);trem.connect(g);break;}
      case 'violin':{const g=g8(t,.045*v,.06,d+.08),l=lp(3200);const o=osc('sawtooth',f,t,d+.1);vib(o,t,6.2,f*.02,.08);o.connect(l);l.connect(g);break;}
      case 'organ':{const g=g8(t,.04*v,.02,d+.05),l=lp(2400);for(const k of[1,2,3])osc(k===2?'square':'sine',f*k,t,d).connect(l);l.connect(g);break;}
      case 'muted':{const g=g8(t,.1*v,.02,d+.05),bp=AC.createBiquadFilter();bp.type='bandpass';bp.Q.value=2.5;bp.frequency.setValueAtTime(900,t);bp.frequency.linearRampToValueAtTime(1700,t+Math.min(.2,d));const o=osc('sawtooth',f,t,d);o.connect(bp);bp.connect(g);break;}
      default:{const g=g8(t,.05*v,.02,d);osc('triangle',f,t,d).connect(g);}}}
  function noise(t,d,type,f,v,q=1){const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NOISE;s.loop=true;fl.type=type;fl.frequency.value=f;fl.Q.value=q;s.connect(fl);fl.connect(g);g.connect(MUSG);
    g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.start(t,Math.random()*.5);s.stop(t+d+.03);}
  function play1(n,t,sd,lead){const v=n.v??1;
    switch(n.i){
      case 'lead':leadNote(lead,n.m,t,n.d*sd*.88,v);return;
      case 'run':leadNote(lead==='clar'?'xylo':'clar',n.m,t,sd*.8,.7);return;
      case 'solo':leadNote(cur.lead2||'clar',n.m,t,n.d*sd*.85,.8);return;
      case 'sect':for(const m of n.ch){const g=g8(t,.022*v,.02,n.d*sd*.85+.04),l=lp(1800,1.2);l.frequency.setValueAtTime(900,t);l.frequency.linearRampToValueAtTime(2000,t+.04);
        osc('sawtooth',mf(m),t,n.d*sd).connect(l);osc('square',mf(m)*1.004,t,n.d*sd).connect(l);l.connect(g);}return;
      case 'tuba':{const g=g8(t,.14,.012,n.d*sd*.8),l=lp(420);osc('square',mf(n.m),t,n.d*sd).connect(l);l.connect(g);return;}
      case 'upright':{const g=g8(t,.22,.006,n.d*sd*.9),l=lp(650);osc('triangle',mf(n.m),t,n.d*sd).connect(l);l.connect(g);noise(t,.02,'bandpass',900,.05,2);return;}
      case 'comp':for(const m of n.ch){const g=g8(t,.03,.004,n.d*sd*1.05);osc('triangle',mf(m),t,n.d*sd*1.1).connect(g);}return;
      case 'banjo':for(const m of n.ch){const g=g8(t,.02,.002,.09),l=lp(3500);osc('square',mf(m+12),t,.1).connect(l);l.connect(g);}return;
      case 'stab':for(const m of n.ch){const g=g8(t,.026,.008,.18),l=lp(2800);l.frequency.setValueAtTime(3000,t);l.frequency.exponentialRampToValueAtTime(800,t+.18);osc('sawtooth',mf(m),t,.2).connect(l);l.connect(g);}return;
      case 'organ':for(const m of n.ch){const g=g8(t,.016,.05,n.d*sd);osc('sine',mf(m),t,n.d*sd).connect(g);osc('square',mf(m)*2,t,n.d*sd).connect(g8(t,.004,.05,n.d*sd));}return;
      case 'bell':{const g=g8(t,.05,.002,1.2);osc('sine',mf(n.m),t,1.2).connect(g);osc('sine',mf(n.m)*2.76,t,.5).connect(g8(t,.015,.002,.5));return;}
      case 'kick':{const o=AC.createOscillator(),g=g8(t,.4*v,.002,.2);o.type='sine';o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);o.connect(g);o.start(t);o.stop(t+.22);return;}
      case 'snare':{noise(t,.13,'bandpass',1900,.14*v,.9);const g=g8(t,.08*v,.002,.08);osc('triangle',190,t,.1).connect(g);return;}
      case 'tom':{const o=AC.createOscillator(),g=g8(t,.25*v,.003,.22),f=[260,230,200,170,150,130,120,110][(n.m||0)%8];o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.6,t+.2);o.connect(g);o.start(t);o.stop(t+.24);return;}
      case 'hat':noise(t,.035,'highpass',8000,.03*v);return;
      case 'chick':noise(t,.04,'highpass',6500,.035);return;
      case 'ride':noise(t,.16,'highpass',7000,.026*v);{const g=g8(t,.005*v,.002,.14);osc('square',3400,t,.15).connect(g);}return;
      case 'brush':noise(t,.15,'bandpass',3200,.045*v);return;
      case 'cym':noise(t,.35,'highpass',6000,.05*v);return;
      case 'crash':noise(t,1.2,'highpass',5000,.09);return;
      case 'wood':{const g=g8(t,.07*v,.001,.05);osc('sine',v>.8?1100:900,t,.06).connect(g);return;}
      case 'cast':noise(t,.03,'highpass',5000,.08);noise(t+.04,.03,'highpass',5200,.06);return;}}
  let cur=null,step=0,next=0;
  setInterval(()=>{if(!AC||!cur||AC.state!=='running'||muted)return;try{const sd=60/cur.bpm/2;if(next<AC.currentTime-.3)next=AC.currentTime+.05;
    while(next<AC.currentTime+.18){if(step>=cur.steps)step=cur.loopFrom;const s=step,t=next+(s%2?sd*cur.swing:0);for(const n of cur.ev[s])play1(n,t,sd,cur.lead);step++;next+=sd;}}catch(_){}},25);
  return{play(name){const def=SONGS[name];if(!def){cur=null;return;}if(cur&&cur.name===name)return;cur=Object.assign({name},cache[name]||(cache[name]=gen(def)));step=0;if(AC)next=AC.currentTime+.12;},
    stop(){cur=null;},restart(){if(cur&&AC)next=AC.currentTime+.1;},get name(){return cur?cur.name:null;}};
})();
