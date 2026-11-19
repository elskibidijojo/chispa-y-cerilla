/* firmas2.js — every boss gets its OWN signature attack, like in the old cartoons: no two fights play the same.
   The 19 bosses that were using only the shared attack library get a unique move here:
   cafetera: coffee lobs that leave scalding puddles · globoaero: sandbags that burst into shrapnel · libelula: zig-zag wind darts
   pezvolador: a school of fish swimming through the sky in a wave · escoba: magic bubbles that freeze, then dart at you
   gargola: falling stones that shatter upward · aurora: a curtain of stars with one gap to slip through
   trineo: presents that explode into snowballs · canica: a giant marble that splits when it hits the walls
   bolos: a bowling ball that sends pins flying when it reaches the wall · diana: darts that stick in the floor and then shoot back up
   globo: balloons that rise and pop into confetti · linterna: a spotlight that CHASES you, then flashes
   heladero: a falling tower of scoops that rolls apart · abeto: swinging ornaments that drop and shatter
   jengibre: crumbs that orbit the boss and then launch one by one · colmena: a pulsing honeycomb ring that drifts toward you
   dragonfar: firecrackers that burst in the air · tornillo: a spring-loaded punch that shoots out and snaps back
   All randomness comes from the game's own seeded rand(), so online play stays in sync. */
(function(){
const P=(L,B)=>tgt(L,B);
const fl=L=>L.kind==='plane'?H-20:GROUND;
function burst(L,x,y,n,spd,spr,r=10,parryI=-1,off=0){for(let k=0;k<n;k++){const a=off+k*TAU/n;spawnEB(L,{k:'shot',x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r,spr,parry:k===parryI});}}
Object.assign(ATK,{
  cafeCharcos(L,B,a){const o=anc(B,a.from),t=P(L,B);for(let i=-1;i<=1;i++){const tx=clamp(t.x+i*150,60,W-60),T=.85+(i+1)*.12,vy=-560,g=2*(GROUND-o.y-vy*T)/(T*T);
    spawnEB(L,{k:'grav',x:o.x,y:o.y,vx:(tx-o.x)/T,vy,g:Math.max(400,g),r:13,spr:'drop',puddle:true,parry:i===0&&rand()<.5});}sfx('splash');},
  lastre(L,B,a){const o=anc(B,a.from);for(let i=0;i<2;i++)spawnEB(L,{k:'grav',x:o.x-30*i,y:o.y,vx:-140-rand()*120,vy:-80,g:700,r:16,spr:'bloque',
    upd:(e,L)=>{if(e.y>H*.6){e.dead=true;puff(L,e.x,e.y,5);sfx('knock');burst(L,e.x,e.y,6,250,'crumb',9,Math.floor(rand()*6));}}});sfx('throw');},
  zigzag(L,B,a){const o=anc(B,a.from);for(let i=0;i<3;i++)B.queue.push({t:i*.18,fn:()=>{const t=aimPt(P(L,B)),a0=Math.atan2(t.y-o.y,t.x-o.x),sp=330;
    spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:Math.cos(a0)*sp,vy:Math.sin(a0)*sp,r:11,spr:'aire',parry:i===1,bvx:Math.cos(a0)*sp,bvy:Math.sin(a0)*sp,
      upd:(e)=>{const s=Math.floor(e.t/.28)%2?1:-1;e.vx=e.bvx-Math.sin(Math.atan2(e.bvy,e.bvx))*s*230;e.vy=e.bvy+Math.cos(Math.atan2(e.bvy,e.bvx))*s*230;}});sfx('pop');}});},
  bancoPeces(L,B,a){const t=aimPt(P(L,B)),cy=clamp(t.y,90,H-90),pk=Math.floor(rand()*8);for(let i=0;i<8;i++)spawnEB(L,{k:'shot',x:W+40+i*48,y:cy,vx:-300,vy:0,r:12,spr:'pez',parry:i===pk,cy,ph:i*.7,
    upd:(e)=>{e.y=e.cy+Math.sin(e.t*4+e.ph)*70;}});sfx('splash');},
  burbujaMagica(L,B,a){const o=anc(B,a.from);for(let i=0;i<5;i++){const an=Math.PI+(i-2)*.45;spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:Math.cos(an)*380,vy:Math.sin(an)*380,r:12,spr:'orb',parry:i===2,
    upd:(e,L)=>{if(e.t<.65){e.vx*=.93;e.vy*=.93;}else if(!e.go){e.go=1;const p=nearestP(L,e.x,e.y);if(p){const c=aimPt(p),an=Math.atan2(c.y-e.y,c.x-e.x);e.vx=Math.cos(an)*360;e.vy=Math.sin(an)*360;}sfx('magic');}}});}sfx('magic');},
  piedraCae(L,B,a){const t=P(L,B);const xs=[t.x,60+rand()*(W-120),60+rand()*(W-120)];xs.forEach((x,i)=>B.queue.push({t:i*.3,fn:()=>spawnEB(L,{k:'shot',x,y:-30,vx:0,vy:430,r:18,spr:'roca',parry:i===2,
    upd:(e,L)=>{if(e.y>fl(L)-30){e.dead=true;shake(L,5);puff(L,e.x,e.y,5);sfx('knock');for(let k=0;k<3;k++){const an=-Math.PI/2+(k-1)*.55;spawnEB(L,{k:'shot',x:e.x,y:e.y-10,vx:Math.cos(an)*300,vy:Math.sin(an)*300,r:9,spr:'shard'});}}}})}));sfx('warn');},
  cortinaAurora(L,B,a){const n=10,gap=1+Math.floor(rand()*(n-3)),pk=Math.floor(rand()*n);for(let i=0;i<n;i++){if(i===gap||i===gap+1)continue;const y0=30+i*(H-60)/(n-1);
    spawnEB(L,{k:'shot',x:W+30,y:y0,vx:-210,vy:0,r:12,spr:'star',parry:i===pk&&i!==gap&&i!==gap+1,y0,upd:(e)=>{e.y=e.y0+Math.sin(e.t*2.4)*34;}});}sfx('magic');},
  regalosBomba(L,B,a){const o=anc(B,a.from),t=P(L,B);for(let i=0;i<2;i++){const T=.95+i*.2;spawnEB(L,{k:'grav',x:o.x,y:o.y,vx:clamp((t.x+(i?120:-60)-o.x)/T,-520,520),vy:-420,g:900,r:15,spr:'bloque',parry:i===0,
    upd:(e,L)=>{if(e.t>T){e.dead=true;puff(L,e.x,e.y,4);sfx('pop');burst(L,e.x,e.y,6,220,'nieve',10,-1,e.t);}}});}sfx('throw');},
  canicaSplit(L,B,a){const o=anc(B,a.from),d=P(L,B).x<o.x?-1:1;const mk=(x,y,vx,vy,r,gen)=>spawnEB(L,{k:'bounce',x,y,vx,vy,r,spr:'canica',life:8,gen,lvx:vx,
    upd:(e,L)=>{if(Math.sign(e.vx)!==Math.sign(e.lvx)){e.hits=(e.hits||0)+1;e.lvx=e.vx;if(e.hits>=2&&e.gen<2){e.dead=true;puff(L,e.x,e.y,4);sfx('knock');mk(e.x,e.y,240,-320,e.r*.7,e.gen+1);mk(e.x,e.y,-240,-320,e.r*.7,e.gen+1);}}}});
    mk(o.x,o.y,d*260,-260,28,0);sfx('knock');},
  chuza(L,B,a){const o=anc(B,a.from),d=P(L,B).x<o.x?-1:1;spawnEB(L,{k:'roll',x:o.x,y:GROUND-30,vx:d*430,r:30,spr:'bolaBol',
    upd:(e,L)=>{if(e.x<50||e.x>W-50){e.dead=true;shake(L,9);sfx('stomp');const side=e.x<W/2?1:-1,pk=Math.floor(rand()*5);for(let k=0;k<5;k++)spawnEB(L,{k:'grav',x:e.x,y:GROUND-40,vx:side*(140+k*70),vy:-820-k*40,g:1500,r:14,spr:'bolo',parry:k===pk});}}});sfx('throw');},
  dardosRebote(L,B,a){const t=P(L,B);for(let i=0;i<4;i++){const x=clamp(t.x+(i-1.5)*110,40,W-40);B.queue.push({t:i*.15,fn:()=>spawnEB(L,{k:'shot',x,y:-30,vx:0,vy:560,r:11,spr:'dardo',parry:i===3,
    upd:(e,L)=>{if(!e.stuck&&e.y>=GROUND-e.r){e.stuck=1;e.vy=0;e.y=GROUND-e.r;e.st=e.t;sfx('knock');}if(e.stuck&&!e.up&&e.t-e.st>.75){e.up=1;e.vy=-760;sfx('throw');}}})});}},
  globoPop(L,B,a){for(let i=0;i<3;i++){const x=120+rand()*(W-240),pt=1.1+rand()*1.3;spawnEB(L,{k:'shot',x,y:GROUND-20,vx:0,vy:-95,sway:40,r:20,spr:'globo',parry:i===0,
    upd:(e,L)=>{if(e.t>pt){e.dead=true;sfx('pop');burst(L,e.x,e.y,8,230,'confeti',9,-1,e.t);}}});}},
  focoPersigue(L,B,a){const t=P(L,B);spawnEB(L,{k:'column',x:t.x,warn:1.5,act:.45,w:80,style:'light',full:L.kind==='plane',
    upd:(e,L)=>{if(e.t<e.warn-.3){const p=nearestP(L,e.x,0);if(p)e.x+=clamp(p.x-e.x,-300*(1/60),300*(1/60));e.x=clamp(e.x,50,W-50);}}});sfx('warn');},
  heladoPila(L,B,a){const t=P(L,B),x=clamp(t.x,60,W-60);for(let i=0;i<3;i++)spawnEB(L,{k:'shot',x,y:-30-i*70,vx:0,vy:400,r:16,spr:'nieve',parry:i===1,
    upd:(e,L)=>{if(e.y>=GROUND-e.r){e.dead=true;puff(L,e.x,GROUND,4);sfx('knock');for(const d of[-1,1])spawnEB(L,{k:'roll',x:e.x,y:GROUND-14,vx:d*(220+rand()*80),r:14,spr:'nieve'});}}});sfx('warn');},
  adornos(L,B,a){const t=P(L,B);for(let i=0;i<3;i++){const ax=clamp(t.x+(i-1)*170,70,W-70),ay=110+i*14,ph=i*1.3;spawnEB(L,{k:'shot',x:ax,y:ay,vx:0,vy:0,r:15,spr:'bola',parry:i===1,
    upd:(e,L)=>{if(e.t<1.3){e.x=ax+Math.sin(e.t*4+ph)*55;e.y=ay;e.vx=0;e.vy=0;}else{if(!e.drop){e.drop=1;sfx('throw');}e.vy+=1400/60;if(e.y>=GROUND-e.r){e.dead=true;sfx('knock');puff(L,e.x,GROUND,4);for(let k=0;k<4;k++){const an=-Math.PI/2+(k-1.5)*.5;spawnEB(L,{k:'shot',x:e.x,y:GROUND-12,vx:Math.cos(an)*280,vy:Math.sin(an)*280,r:8,spr:'shard'});}}}}});}sfx('ring');},
  migasOrbita(L,B,a){const n=6,pk=Math.floor(rand()*n);for(let i=0;i<n;i++){const a0=i*TAU/n,go=.9+i*.22;spawnEB(L,{k:'shot',x:B.center().x,y:B.center().y,vx:0,vy:0,r:11,spr:'crumb',parry:i===pk,
    upd:(e,L)=>{if(e.t<go){const c=B.center(),an=a0+e.t*4;e.x=c.x+Math.cos(an)*95;e.y=c.y+Math.sin(an)*95;e.vx=0;e.vy=0;}else if(!e.l){e.l=1;const p=nearestP(L,e.x,e.y);if(p){const c=aimPt(p),an=Math.atan2(c.y-e.y,c.x-e.x);e.vx=Math.cos(an)*380;e.vy=Math.sin(an)*380;}sfx('pop');}}});}},
  panal(L,B,a){const o=anc(B,a.from),t=aimPt(P(L,B)),cvx=clamp((t.x-o.x)/2.4,-200,200),cvy=clamp((t.y-o.y)/2.4,-120,120),pk=Math.floor(rand()*6);
    for(let i=0;i<6;i++){const a0=i*TAU/6;spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:0,vy:0,r:12,spr:'jam',parry:i===pk,life:5,
      upd:(e)=>{const cx=o.x+cvx*e.t,cy=o.y+cvy*e.t,rad=70+Math.sin(e.t*4)*40,an=a0+e.t*1.5;e.x=cx+Math.cos(an)*rad;e.y=cy+Math.sin(an)*rad;e.vx=0;e.vy=0;}});}sfx('magic');},
  petardos(L,B,a){const o=anc(B,a.from),t=P(L,B);for(let i=0;i<2;i++){const tx=clamp(t.x+(i?150:-150)*(rand()<.5?1:-1),80,W-80),ty=GROUND-260-rand()*60,T=.8+i*.15;
    spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:(tx-o.x)/T,vy:(ty-o.y)/T,r:12,spr:'farolillo',parry:i===0,upd:(e,L)=>{if(e.t>T){e.dead=true;shake(L,4);sfx('boom');puff(L,e.x,e.y,5);burst(L,e.x,e.y,8,240,'ember',9,-1,e.t*3);}}});}sfx('fire');},
  ecoSombra(L,B,a){for(let i=0;i<3;i++)B.queue.push({t:i*.32,fn:()=>{const p=P(L,B);spawnEB(L,{k:'column',x:clamp(p.x,50,W-50),warn:1.05,act:.35,w:64,style:'darkbolt',full:false});}});sfx('warn');},
  barajaCartas(L,B,a){const pk=Math.floor(rand()*6);for(let i=0;i<6;i++){const x=110+i*(W-220)/5;B.queue.push({t:i*.16,fn:()=>spawnEB(L,{k:'shot',x,y:-30,vx:0,vy:240,r:12,spr:'card',parry:i===pk,turn:1.3,spd:300})});}sfx('naipe');},
  punoResorte(L,B,a){const o=anc(B,a.from),t=aimPt(P(L,B)),d=t.x<o.x?-1:1;spawnEB(L,{k:'shot',x:o.x,y:clamp(t.y,GROUND-130,GROUND-30),vx:d*980,vy:0,r:22,spr:'llave',parry:rand()<.35,life:1.5,
    upd:(e)=>{e.vx-=d*1500/60;}});sfx('boing');}});

/* who gets what: [id, phase index, attack spec] */
const ADD=[
  ['cafetera',1,{f:'cafeCharcos',every:4.2,from:'spout'}],['cafetera',2,{f:'cafeCharcos',every:3.8,from:'spout'}],
  ['globoaero',1,{f:'lastre',every:4,from:'__c'}],['globoaero',2,{f:'lastre',every:3.4,from:'__c'}],
  ['libelula',0,{f:'zigzag',every:3.6,from:'__c'}],['libelula',2,{f:'zigzag',every:3,from:'__c'}],
  ['pezvolador',1,{f:'bancoPeces',every:5}],['pezvolador',2,{f:'bancoPeces',every:4.2}],
  ['escoba',1,{f:'burbujaMagica',every:4.4,from:'__c'}],['escoba',2,{f:'burbujaMagica',every:3.8,from:'__c'}],
  ['gargola',1,{f:'piedraCae',every:4.6}],['gargola',2,{f:'piedraCae',every:3.9}],
  ['aurora',1,{f:'cortinaAurora',every:5.2}],['aurora',2,{f:'cortinaAurora',every:4.4}],
  ['trineo',0,{f:'regalosBomba',every:4.2,from:'__c'}],['trineo',2,{f:'regalosBomba',every:3.6,from:'__c'}],
  ['canica',0,{f:'canicaSplit',every:5.5,from:'__c'}],['canica',1,{f:'canicaSplit',every:4.6,from:'__c'}],
  ['bolos',0,{f:'chuza',every:4.8,from:'__c'}],['bolos',1,{f:'chuza',every:4,from:'__c'}],
  ['diana',0,{f:'dardosRebote',every:4.4}],['diana',1,{f:'dardosRebote',every:3.8}],
  ['globo',0,{f:'globoPop',every:4.6}],['globo',1,{f:'globoPop',every:3.9}],
  ['linterna',1,{f:'focoPersigue',every:4.8}],['linterna',2,{f:'focoPersigue',every:4}],
  ['heladero',1,{f:'heladoPila',every:4.2}],['heladero',2,{f:'heladoPila',every:3.6}],
  ['abeto',1,{f:'adornos',every:4.6}],['abeto',2,{f:'adornos',every:4}],
  ['jengibre',1,{f:'migasOrbita',every:5}],['jengibre',2,{f:'migasOrbita',every:4.3}],
  ['colmena',0,{f:'panal',every:5,from:'mouth'}],['colmena',2,{f:'panal',every:4.2,from:'stinger'}],
  ['dragonfar',1,{f:'petardos',every:3.8,from:'mouth'}],['dragonfar',2,{f:'petardos',every:3.4,from:'mouth'}],
  ['sombra',1,{f:'ecoSombra',every:4.6}],['sombra',2,{f:'ecoSombra',every:4}],['sota',1,{f:'barajaCartas',every:4.4}],['rey',1,{f:'barajaCartas',every:4}],['as',1,{f:'barajaCartas',every:3.8}],
  ['tornillo',0,{f:'punoResorte',every:4.2,from:'arm'}],['tornillo',2,{f:'punoResorte',every:3.4,from:'arm'}]];
for(const [id,ph,spec] of ADD){const d=LEVELS[id];if(!d||!d.phases)continue;const P2=d.phases[Math.min(ph,d.phases.length-1)];P2.atk=P2.atk||[];
  const s=Object.assign({},spec);if(s.from==='__c')delete s.from;if(!P2.atk.some(x=>x.f===s.f))P2.atk.push(s);}
/* map flags: every beaten level shows its little flag, whatever building it uses */
const _dbF=drawBld;drawBld=function(n,t,night){window._flagDrawn=null;_dbF(n,t,night);try{if(n.kind==='level'&&n.id!=='_'&&save.done&&save.done[n.id]&&window._flagDrawn!==n.id&&!['cine','casino'].includes(n.id)){
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=C.ink;const fx=n.x+(n.ob||30)+8,fy=n.y;line(fx,fy,fx,fy-40,3);poly([[fx,fy-40],[fx+30,fy-32],[fx,fy-22]],C.parry);txt(save.done[n.id],fx+12,fy-31,11,C.ink,null);ctx.restore();}}catch(e){}};
})();
