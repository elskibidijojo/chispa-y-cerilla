/* variedad.js
   1) El Rascacielos en Obra gets easier to climb: little stair-steps between floors, more and wider girders,
      and everything slides down slower (even slower in Fácil).
   2) Eight new attack MECHANICS, so bosses stop feeling alike. Each one asks for a different move from you:
      · brazoGiratorio — a long arm of orbs spins around the boss: slip through its gap or jump it
      · anilloHueco   — an expanding, rotating ring with one gap you have to line up with
      · minas         — mines drop on the floor, blink, then erupt into a geyser
      · muroHueco     — a moving wall of bullets with a gap at jump height: jump through at the right moment
      · rebotonas     — big bubbles that bounce off the walls, ceiling and floor
      · domino        — geysers erupt one after another across the floor, chasing you toward the far side
      · pinza         — shots close in from BOTH sides of the screen at your height
      · satelites     — orbs orbit the boss like a shield, then fling outward
   Every boss swaps one or two of its plain attacks (aimed shots, rings, rain…) for two of these, chosen so
   neighbouring bosses don't repeat. Plane bosses only get the ones that make sense in the air.
   Everything uses the game's seeded rand() and the boss clock, so online play stays in sync. */
(function(){
/* ---------------- 1) Rascacielos: stairs ---------------- */
if(typeof CL_V!=='undefined'&&typeof clRow==='function'){
  CL_V[0]=30;CL_V[1]=38;CL_V[2]=46;
  window.clRow=clRow=function(L,y){const C=L.climb,prev=C.last??1;let a=prev;const r=rand();if(r<.35)a=prev-1;else if(r<.7)a=prev+1;a=clamp(a,0,2);
    const lanes=[a],o=[0,1,2].filter(k=>k!==a);lanes.push(o[Math.floor(rand()*o.length)]);if(rand()<.35)for(const k of[0,1,2])if(!lanes.includes(k))lanes.push(k);C.last=a;
    for(const k of lanes){const w=190+Math.floor(rand()*70),x=clamp(CL_LANES[k]-w/2+(rand()-.5)*60,36,W-36-w);L.solids.push({x,y,w,h:14,oneWay:true,mv:true,dx:0,gird:true,rv:rand()<.2});}
    /* a small stair-step halfway down, between this floor and the one below */
    const sk=Math.floor(rand()*3),sw=96,sx=clamp(CL_LANES[sk]-sw/2+(rand()-.5)*120,40,W-40-sw);L.solids.push({x:sx,y:y+CL_GAP/2,w:sw,h:12,oneWay:true,mv:true,dx:0,gird:true,step:true});
    C.top=y;};
  const _pl=pitFall;pitFall=function(L,p){const r=_pl.apply(this,arguments);if(L&&L.climb&&!p.dead)p.inv=Math.max(p.inv||0,2.6);return r;};
  const _cr=LEVELS.rascacielos&&LEVELS.rascacielos.create;if(_cr)LEVELS.rascacielos.create=(...a)=>{const L=_cr(...a);if(L&&L.climb&&cfg.diff==='facil'){CL_V[0]=24;CL_V[1]=30;CL_V[2]=36;}else{CL_V[0]=30;CL_V[1]=38;CL_V[2]=46;}return L;};
  if(typeof MECH_INFO!=='undefined')MECH_INFO.rascacielos='Las vigas bajan sin parar: sube por los escalones y las vigas, o te caes (pierdes un corazón)';}

/* ---------------- 2) new mechanics ---------------- */
const P=(L,B)=>tgt(L,B);
const floorY=L=>L.kind==='plane'?H-20:GROUND;
Object.assign(ATK,{
  brazoGiratorio(L,B,a){const c=B.center(),n=11,gap=3+Math.floor(rand()*5),dir=rand()<.5?-1:1,dur=a.dur||2.6,a0=Math.atan2(P(L,B).y-c.y,P(L,B).x-c.x)+dir*1.6,pk=Math.floor(rand()*n);sfx('warn');
    for(let i=0;i<n;i++){if(i===gap||i===gap+1)continue;const rad=60+i*40;spawnEB(L,{k:'shot',x:c.x,y:c.y,vx:0,vy:0,r:11,spr:'orb',parry:i===pk,life:dur+.7,
      upd:(e)=>{const g=Math.min(1,e.t/.6),an=a0+dir*Math.max(0,e.t-.6)*2;e.x=c.x+Math.cos(an)*rad*g;e.y=c.y+Math.sin(an)*rad*g;e.vx=0;e.vy=0;if(e.t>dur+.6)e.dead=true;}});}},
  anilloHueco(L,B,a){const c=B.center(),n=22,g0=Math.floor(rand()*n),rot=(rand()<.5?-1:1)*.55,pk=(g0+n/2)|0;sfx('ring');
    for(let i=0;i<n;i++){if(i===g0||i===(g0+1)%n||i===(g0+2)%n)continue;const a0=i*TAU/n;spawnEB(L,{k:'shot',x:c.x,y:c.y,vx:0,vy:0,r:10,spr:'star',parry:i===pk,life:5,
      upd:(e)=>{const rr2=26+e.t*(a.spd||170),an=a0+e.t*rot;e.x=c.x+Math.cos(an)*rr2;e.y=c.y+Math.sin(an)*rr2;e.vx=0;e.vy=0;if(rr2>1100)e.dead=true;}});}},
  minas(L,B,a){const p=P(L,B),n=a.n||3;for(let i=0;i<n;i++){const x=clamp(p.x+(i-(n-1)/2)*170,50,W-50);B.queue.push({t:i*.2,fn:()=>spawnEB(L,{k:'shot',x,y:-30,vx:0,vy:640,r:14,spr:'orb',parry:i===1&&rand()<.5,life:6,
      upd:(e,L)=>{if(!e.st&&e.y>=GROUND-14){e.st=e.t;e.vy=0;e.y=GROUND-14;sfx('knock');}if(e.st!=null){e.vy=0;e.flash=(Math.floor((e.t-e.st)*10)%2)?1:0;if(e.t-e.st>1.4){e.dead=true;spawnEB(L,{k:'column',x:e.x,warn:.01,act:.5,w:56,style:'geyser'});shake(L,4);sfx('boom');}}}})});}sfx('throw');},
  muroHueco(L,B,a){const d=P(L,B).x<B.center().x?-1:1,x0=d<0?W+30:-30,fy=floorY(L),plane=L.kind==='plane',rows=plane?13:11,step=plane?36:34;
    const gap=plane?2+Math.floor(rand()*(rows-4)):2+Math.floor(rand()*3),pk=Math.floor(rand()*rows);sfx('warn');
    for(let i=0;i<rows;i++){if(i===gap||i===gap+1)continue;const y=fy-14-i*step;if(y<20)break;spawnEB(L,{k:'shot',x:x0,y,vx:d*(a.spd||250),vy:0,r:13,spr:'bloque',parry:i===pk,life:6});}},
  rebotonas(L,B,a){const c=anc(B,a.from),fy=floorY(L),n=a.n||3;for(let i=0;i<n;i++){const t=aimPt(P(L,B)),an=Math.atan2(t.y-c.y,t.x-c.x)+(i-(n-1)/2)*.5,sp=a.spd||300;
      spawnEB(L,{k:'shot',x:c.x,y:c.y,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,r:17,spr:'bubble',parry:i===0,life:7,nb:0,
        upd:(e)=>{if(e.nb>=3)return;if(e.x<e.r&&e.vx<0||e.x>W-e.r&&e.vx>0){e.vx=-e.vx;e.nb++;}if(e.y<e.r&&e.vy<0){e.vy=-e.vy;e.nb++;}if(e.y>fy-e.r&&e.vy>0){e.vy=-e.vy;e.nb++;}}});}sfx('pop');},
  domino(L,B,a){const c=B.center(),d=c.x>W/2?-1:1,x0=c.x+d*90,n=a.n||5;sfx('warn');for(let i=0;i<n;i++){const x=clamp(x0+d*i*96,40,W-40);B.queue.push({t:i*.24,fn:()=>spawnEB(L,{k:'column',x,warn:.55,act:.35,w:72,style:'geyser'})});}},
  pinza(L,B,a){const t=aimPt(P(L,B)),pk=rand()<.5?0:1;for(let w=0;w<2;w++)B.queue.push({t:w*.55,fn:()=>{const y=clamp(t.y-w*95,40,floorY(L)-20);for(const s of[-1,1])spawnEB(L,{k:'shot',x:s<0?-20:W+20,y,vx:-s*(a.spd||240),vy:0,r:13,spr:'dardo',parry:w===pk&&s<0,life:6});sfx('throw');}});},
  satelites(L,B,a){const n=6,pk=Math.floor(rand()*n),dir=rand()<.5?-1:1,go=a.go||1.5;for(let i=0;i<n;i++){const a0=i*TAU/n;spawnEB(L,{k:'shot',x:B.center().x,y:B.center().y,vx:0,vy:0,r:12,spr:'orb',parry:i===pk,life:go+4,
      upd:(e)=>{if(e.t<go){const c=B.center(),an=a0+dir*e.t*3,rad=40+Math.min(1,e.t/.5)*80;e.x=c.x+Math.cos(an)*rad;e.y=c.y+Math.sin(an)*rad;e.vx=0;e.vy=0;}
        else if(!e.f){e.f=1;const c=B.center(),an=Math.atan2(e.y-c.y,e.x-c.x);e.vx=Math.cos(an)*300+Math.cos(an+dir*Math.PI/2)*120;e.vy=Math.sin(an)*300+Math.sin(an+dir*Math.PI/2)*120;sfx('pop');}}});}sfx('magic');}});

/* ---------------- 3) hand them out ---------------- */
const POOL=['brazoGiratorio','minas','anilloHueco','muroHueco','domino','rebotonas','pinza','satelites'];
const AIR=['brazoGiratorio','anilloHueco','muroHueco','rebotonas','pinza','satelites'];
const PLAIN=['aimed','ring','rain','lob','spiral','wave','roller'];
const SKIP=new Set(['rascacielos']);
let k=0;
for(const id of Object.keys(LEVELS)){const d=LEVELS[id];if(!d.phases||d.parryOnly||SKIP.has(id)||/^tutorial/.test(id))continue;const pool=d.kind==='plane'?AIR:POOL;
  const mA=pool[k%pool.length],mB=pool[(k*3+2)%pool.length]===mA?pool[(k*3+3)%pool.length]:pool[(k*3+2)%pool.length];k++;
  const swap=(ph,m)=>{if(!ph||!ph.atk||ph.atk.some(x=>x.f===m))return;const i=ph.atk.findIndex(x=>PLAIN.includes(x.f));const base=i>=0?ph.atk[i]:null;
    const spec={f:m,every:Math.max(3.4,(base?base.every:4)*1.25),from:base&&base.from};if(i>=0)ph.atk[i]=spec;else ph.atk.push(spec);};
  const n=d.phases.length;if(n>=3)swap(d.phases[1],mA);swap(d.phases[n-1],n>=3?mB:mA);}
/* never draw a bullet whose position went bad for a frame (it is removed on the next update) */
const _dsV=drawSpr;drawSpr=function(e,t){if(!e||!Number.isFinite(e.x)||!Number.isFinite(e.y))return;return _dsV.apply(this,arguments);};
})();
