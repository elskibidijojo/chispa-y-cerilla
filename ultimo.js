/* ultimo.js — every boss fight gets a bit more of that old-cartoon life:
   1) LAST GASP: when a boss gets desperate (under 15% life) it pulls out one extra trick of its
      own (a different one for each boss), so the end of every fight feels new.
   2) BACKGROUND CAMEOS: little characters cross the back of the stage during the fight
      (birds and a balloon on island 1, gulls and a boat on 2, bats and ghosts on 3, snow geese
      and a penguin sled on 4, elves and a sleigh on 5). They peek more often in later phases.
   The extra trick runs in the simulation with the game's own rand(), so online play stays in sync;
   the cameos are drawing only. */
(function(){
const POOL=['brazoGiratorio','minas','anilloHueco','muroHueco','domino','rebotonas','pinza','satelites'];
const AIR=['brazoGiratorio','anilloHueco','muroHueco','rebotonas','pinza','satelites'];
const SKIP=new Set(['rascacielos']);
function hashId(id){let h=7;for(const ch of id)h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h);}
function pickTrick(def){const pool=(def.kind==='plane'?AIR:POOL).filter(f=>ATK[f]);if(!pool.length)return null;
  const used=new Set(def.phases.flatMap(p=>(p.atk||[]).map(a=>a.f)));const free=pool.filter(f=>!used.has(f));const list=free.length?free:pool;return list[hashId(def.id)%list.length];}
window.ULT_TRICK={};
for(const id of Object.keys(LEVELS)){const d=LEVELS[id];if(!d.phases||d.parryOnly||SKIP.has(id)||/^tutorial/.test(id))continue;const f=pickTrick(d);if(f)ULT_TRICK[id]=f;}

const _bu=bossUpdate;bossUpdate=function(L,B,dt){_bu(L,B,dt);
  if(B.dead||!B.desp||L.state!=='play'||B.hidden||B.transT>0)return;const f=ULT_TRICK[B.def.id];if(!f)return;
  if(B.ultT===undefined){B.ultT=.9;banner(L,'¡TRUCO FINAL!',1.1);}
  B.ultT-=dt;if(B.ultT<=0){B.ultT=4.2;try{ATK[f](L,B,{f,every:4.2,from:'center'});}catch(e){}B.mouth=1;}};

/* ---------------- background cameos ---------------- */
function bird(x,y,t,col){const f=Math.sin(t*14)*8;ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(x-14,y-f);ctx.quadraticCurveTo(x-6,y-6,x,y);ctx.quadraticCurveTo(x+6,y-6,x+14,y-f);ctx.stroke();circ(x,y+1,4,col,2);}
function balloon(x,y,t){ctx.save();ctx.translate(x,y+Math.sin(t*1.3)*6);ell(0,0,26,32,'#e8562e',3);ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(-6,-30);ctx.quadraticCurveTo(-14,0,-6,30);ctx.moveTo(6,-30);ctx.quadraticCurveTo(14,0,6,30);ctx.stroke();line(-10,28,-7,44,2);line(10,28,7,44,2);rr(-9,44,18,12,3,'#8a5a2a',2.5);ctx.restore();}
function boat(x,y,t){ctx.save();ctx.translate(x,y+Math.sin(t*2)*3);ctx.rotate(Math.sin(t*1.7)*.05);poly([[-34,0],[34,0],[24,14],[-24,14]],'#a0522d',3);line(0,0,0,-46,3);poly([[2,-44],[30,-8],[2,-8]],'#fbf6ea',2.5);ctx.restore();}
function bat(x,y,t){const f=Math.sin(t*18)*.6;ctx.save();ctx.translate(x,y);for(const s of[-1,1]){ctx.save();ctx.scale(s,1);ctx.rotate(f);poly([[0,0],[22,-10],[18,0],[26,4],[12,6]],'#2b2433',2);ctx.restore();}circ(0,0,7,'#2b2433',2);circ(-2,-1,1.6,'#ffd36a',0);circ(2,-1,1.6,'#ffd36a',0);ctx.restore();}
function ghost(x,y,t){ctx.save();ctx.translate(x,y+Math.sin(t*2.2)*8);ctx.globalAlpha*=.75;ctx.beginPath();ctx.arc(0,-6,16,Math.PI,0);for(let i=0;i<=4;i++)ctx.lineTo(16-i*8,14+(i%2?-5:0));ctx.closePath();ctx.fillStyle='#f2f6ff';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();circ(-5,-6,2.5,C.ink,0);circ(5,-6,2.5,C.ink,0);ell(0,3,3,4,C.ink,0);ctx.restore();}
function sled(x,y,t,col){ctx.save();ctx.translate(x,y);rr(-24,-10,48,12,4,col,2.5);line(-28,4,26,4,3);line(26,4,30,-2,3);ell(-4,-20,10,12,'#fbf6ea',2.5);circ(-4,-34,7,col===C.rust?'#3a7a4a':'#2b2a33',2);circ(4,-24,2,C.ink,0);ctx.restore();}
function elf(x,y,t){const h=Math.abs(Math.sin(t*8))*8;ctx.save();ctx.translate(x,y-h);rr(-7,-16,14,16,4,'#3a8a4a',2);circ(0,-22,7,'#f6d2b0',2);poly([[-8,-26],[8,-26],[10,-44]],'#c0302a',2);circ(10,-44,3,'#fff',1.5);line(-4,0,-6,8,3);line(4,0,6,8,3);ctx.restore();}
const CAST={
  1:[{w:'bird',n:3,y:[90,160],spd:80},{w:'balloon',n:1,y:[80,130],spd:28}],
  2:[{w:'bird',n:4,y:[70,140],spd:95,col:'#fbf6ea'},{w:'boat',n:1,y:[GROUND-28,GROUND-28],spd:30,low:true}],
  3:[{w:'bat',n:4,y:[60,170],spd:120},{w:'ghost',n:2,y:[110,220],spd:45}],
  4:[{w:'bird',n:5,y:[60,130],spd:85,col:'#e8f4ff'},{w:'sled',n:1,y:[GROUND-6,GROUND-6],spd:110,low:true,col:'#5aa8e8'}],
  5:[{w:'elf',n:3,y:[GROUND-2,GROUND-2],spd:70,low:true},{w:'sled',n:1,y:[70,90],spd:150,col:C.rust}]};
function drawCameo(L){const d=LEVELS[L.id];if(!d||d.kind==='plane'||!L.boss||L.boss.dead)return;const cast=CAST[d.isl]||CAST[1];const B=L.boss;
  const every=Math.max(9,17-B.phase*3),t=L.t,slot=Math.floor(t/every),age=t-slot*every,pick=cast[(slot+hashId(L.id))%cast.length];
  const dur=(W+260)/pick.spd;if(age>dur)return;const dir=(slot+hashId(L.id))%2?1:-1;
  ctx.save();ctx.globalAlpha=.55;if(pick.low)ctx.globalAlpha=.45;
  for(let i=0;i<pick.n;i++){const x0=dir>0?-120-i*46:W+120+i*46,x=x0+dir*age*pick.spd,y=pick.y[0]+((i*37+slot*13)%Math.max(1,pick.y[1]-pick.y[0]+1));
    ctx.save();if(dir<0&&pick.w!=='balloon'){ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);}
    if(pick.w==='bird')bird(x,y,t+i,pick.col||'#f2c14e');else if(pick.w==='balloon')balloon(x,y,t);else if(pick.w==='boat')boat(x,y,t);else if(pick.w==='bat')bat(x,y,t+i);else if(pick.w==='ghost')ghost(x,y,t+i);else if(pick.w==='sled')sled(x,y,t,pick.col);else if(pick.w==='elf')elf(x,y,t+i*.3);
    ctx.restore();}
  ctx.restore();}
const _mbl=makeBossLevel;makeBossLevel=function(def){const L=_mbl(def);if(L&&L.drawBG&&def.kind!=='plane'&&!/^tutorial/.test(def.id)){const db=L.drawBG;L.drawBG=function(){db.apply(this,arguments);try{drawCameo(L);}catch(e){}};}return L;};
})();
