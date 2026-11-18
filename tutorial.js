/* tutorial.js — the Escuela de Héroes: two hands-on tutorials, one on foot and one in the plane.
   Each step shows what to press (with your keys, or the phone buttons on a touch screen) and only
   moves on when you've done it. You can't lose in the tutorial. Found at Profe Tuerca on the first
   island, in the map menu (Esc) and offered the first time you reach the map. */
(function(){
const mob=()=>document.body&&document.body.classList.contains('movil');
function K(a){if(mob())return{jump:'SALTO',shoot:'FUEGO',dash:'DASH',ex:'EX',swap:'ARMA',lock:'FIJAR',move:'el joystick',up:'el joystick hacia arriba',down:'el joystick hacia abajo'}[a];
  try{const k=cfg.keys.solo;if(a==='move')return'las flechas';if(a==='up')return keyLabel(k.up[0]);if(a==='down')return keyLabel(k.down[0]);return keyLabel(k[a][0]);}catch(e){return a;}}
const TUT={};
function pst(L,x,y){spawnEB(L,{k:'pstar',x,y,r:18,parry:true,harmless:true,cool:0});}
TUT.tutorial=[
  {t:()=>`Muévete a los dos lados con ${K('move')}.`,init(L,p,S){S.x0=p.x;S.mn=p.x;S.mx=p.x;},ok(L,p,S){S.mn=Math.min(S.mn,p.x);S.mx=Math.max(S.mx,p.x);return S.mx-S.x0>110&&S.x0-S.mn>110||S.mx-S.mn>260;}},
  {t:()=>`Salta con ${K('jump')}. Si lo mantienes, saltas más alto. ¡Salta 2 veces!`,init(L,p,S){S.j=0;S.g=true;},ok(L,p,S){if(S.g&&!p.ground&&p.vy<0)S.j++;S.g=p.ground;return S.j>=2;}},
  {t:()=>`Agáchate manteniendo ${K('down')}. Así esquivas lo que vuela bajito.`,init(L,p,S){S.d=0;},ok(L,p,S,dt){if(p.duck)S.d+=dt;return S.d>.6;}},
  {t:()=>`Haz un dash con ${K('dash')}: un empujón rápido, también en el aire. Haz 2.`,init(L,p,S){S.n=0;S.was=false;},ok(L,p,S){const d=p.dash>0;if(d&&!S.was)S.n++;S.was=d;return S.n>=2;}},
  {t:()=>`Dispara al muñeco con ${K('shoot')}. ¡Dale fuerte!`,init(L,p,S){S.dmg=0;},ok(L,p,S){return S.dmg>=12;},dmg:true},
  {t:()=>`El muñeco subió. Mantén ${K('up')} mientras disparas para apuntar hacia arriba.`,init(L,p,S,B){S.dmg=0;B.ty=GROUND-300;},ok(L,p,S){return S.dmg>=8;},dmg:true,
    after(L,p,S,B){B.ty=GROUND;}},
  {t:()=>`Todo lo ROSA acepta PARRY: salta hacia la estrella y vuelve a pulsar ${K('jump')} justo al tocarla. Cada parry te da una carta. Haz 2.`,init(L,p,S){S.par=L.parries;L.eb=L.eb.filter(e=>e.k!=='pstar');pst(L,p.x+170,GROUND-150);pst(L,p.x-170<60?p.x+340:p.x-170,GROUND-150);},ok(L,p,S){return L.parries-S.par>=2;}},
  {t:()=>`¡Tienes cartas! Gasta una con ${K('ex')} para lanzar un disparo EX, mucho más fuerte.`,init(L,p,S){S.e=L.exs;p.cards=Math.max(p.cards,1);L.eb=L.eb.filter(e=>e.k!=='pstar');},ok(L,p,S){if(p.cards<1&&L.exs===S.e)p.cards=1;return L.exs>S.e;}},
  {t:()=>`Con las 5 cartas llenas, ${K('ex')} lanza tu SÚPER. ¡Pruébalo!`,init(L,p,S){S.s=L.supers;p.cards=5;},ok(L,p,S){if(L.supers===S.s&&p.cards<5)p.cards=5;return L.supers>S.s;}},
  {t:()=>`¡Muy bien! Dos trucos más: mantén ${K('lock')} para quedarte quieto y apuntar a 8 lados, y pulsa ${K('swap')} para cambiar de arma si llevas dos. ¡Ya estás listo!`,init(L,p,S){S.w=0;},ok(L,p,S,dt){S.w+=dt;return S.w>5;}}];
TUT.tutorial_avion=[
  {t:()=>`En avión vuelas libre: muévete hacia todos lados con ${K('move')}.`,init(L,p,S){S.a=[p.x,p.x,p.y,p.y];},ok(L,p,S){const a=S.a;a[0]=Math.min(a[0],p.x);a[1]=Math.max(a[1],p.x);a[2]=Math.min(a[2],p.y);a[3]=Math.max(a[3],p.y);return a[1]-a[0]>180&&a[3]-a[2]>160;}},
  {t:()=>`Dispara al globo con ${K('shoot')}. El avión siempre dispara hacia delante.`,init(L,p,S){S.dmg=0;},ok(L,p,S){return S.dmg>=12;},dmg:true},
  {t:()=>`Mantén ${K('dash')} para hacerte chiquito: esquivas mejor, pero tu disparo llega corto y pega menos.`,init(L,p,S){S.s=0;},ok(L,p,S,dt){if(p.small)S.s+=dt;return S.s>1.2;}},
  {t:()=>`También hay parry en el aire: vuela hacia la estrella rosa y pulsa ${K('jump')} al tocarla.`,init(L,p,S){S.par=L.parries;L.eb=L.eb.filter(e=>e.k!=='pstar');pst(L,Math.min(W-260,p.x+220),p.y);},ok(L,p,S){if(!L.eb.some(e=>e.k==='pstar'))pst(L,Math.min(W-260,p.x+220),p.y);return L.parries>S.par;}},
  {t:()=>`Pulsa ${K('ex')} para soltar una bomba EX: gasta una carta.`,init(L,p,S){S.e=L.exs;p.cards=Math.max(p.cards,1);L.eb=L.eb.filter(e=>e.k!=='pstar');},ok(L,p,S){if(p.cards<1&&L.exs===S.e)p.cards=1;return L.exs>S.e;}},
  {t:()=>`Con 5 cartas, ${K('ex')} lanza el SÚPER del avión. ¡Dale!`,init(L,p,S){S.s=L.supers;p.cards=5;},ok(L,p,S){if(L.supers===S.s&&p.cards<5)p.cards=5;return L.supers>S.s;}},
  {t:()=>'¡Piloto de primera! En los jefes de avión: muévete sin parar, hazte chiquito para colarte entre las balas y busca siempre lo rosa.',init(L,p,S){S.w=0;},ok(L,p,S,dt){S.w+=dt;return S.w>4.5;}}];

function ctl(B,dt,L){const steps=TUT[B.def.id],p=L.Ps[0];if(!p||L.state!=='play')return;const S=B.S||(B.S={i:-1,done:0,hp:B.max,d:{}});
  for(const q of L.Ps){if(!q.dead)q.hp=q.maxHp;}
  const dmg=Math.max(0,B.max-B.hp);B.hp=B.max;
  if(S.i<0){S.i=0;steps[0].init(L,p,S.d,B);}
  if(S.i>=steps.length){S.end=(S.end||0)+dt;if(S.end>1.6&&!S.left){S.left=1;tutoFinish(B.def.id);}return;}
  const st=steps[S.i];if(st.dmg)S.d.dmg=(S.d.dmg||0)+dmg;
  if(S.ok>0){S.ok-=dt;if(S.ok<=0){if(st.after)st.after(L,p,S.d,B);S.i++;S.d={};if(S.i<steps.length)steps[S.i].init(L,p,S.d,B);else{banner(L,'¡TUTORIAL COMPLETADO!',1.6);sfx('achieve');}}return;}
  if(st.ok(L,p,S.d,dt,B)){S.ok=.9;sfx('ding');pop(L,p.x,p.y-120,'¡BIEN!',C.gold);}}
function panel(B,L){const S=B.S;if(!S||S.i<0)return;const steps=TUT[B.def.id],i=Math.min(S.i,steps.length-1),done=S.i>=steps.length,txt=done?'¡Tutorial completado! Volviendo al mapa…':steps[i].t();
  ctx.save();const x=W/2-330,y=74,w=660,h=92;ctx.globalAlpha=.94;card(x,y,w,h,'#f3e6c4',4,10);ctx.globalAlpha=1;
  rr(x+12,y+12,58,h-24,8,S.ok>0||done?'#6fbf5a':C.brass,3);txt2(done?'✓':S.ok>0?'✓':String(i+1),x+41,y+h/2+2,30);
  wrap(txt,x+86,y+24,w-104,23,17,C.ink,700);
  for(let k=0;k<steps.length;k++){const on=k<S.i||k===S.i&&S.ok>0;circ(x+86+k*20,y+h-14,6,on?'#6fbf5a':k===S.i?C.gold:'rgba(107,58,38,.3)',2);}
  btxt('Aquí no puedes perder · Pausa para salir',x+w-14,y+h-14,12,'rgba(107,58,38,.8)','right',700);ctx.restore();}
function txt2(s,x,y,sz){txt(s,x,y,sz,C.paper,C.ink);}
window.tutoFinish=function(id){const first=!save.flags.tuto;save.flags.tuto=true;if(id==='tutorial_avion')save.flags.tutoAvion=true;if(first){save.coins=(save.coins||0)+3;}persist();if(typeof unlockAch==='function')unlockAch('tuto');
  transition(()=>{toMap();MAPS.banner={t:3,text:first?'¡Tutorial completado! +3 monedas':'¡Tutorial completado!'};});};

defBoss({id:'tutorial',name:'Muñeco de Práctica',sub:'Escuela de Héroes · Tutorial a pie',isl:1,hp:400,par:999,arena:'tuto_sala',song:'title',x:760,y:GROUND,intro:'¡A ENTRENAR!',
  center(B){return{x:B.x,y:B.y-150};},shapes(B){return[{x:B.x,y:B.y-170,r:62},{x:B.x,y:B.y-60,r:40}];},
  setup(B){B.ty=GROUND;},move(B,dt,L){B.y+=(B.ty-B.y)*Math.min(1,dt*4);ctl(B,dt,L);},phases:[{atk:[]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    if(B.y<GROUND-20){line(x,0,x,y-230,4,'#6b3a26');}else{rr(x-8,y-60,16,60,3,'#8a5a3a',3.5);ell(x,y-2,60,10,'rgba(20,13,8,.25)',0);rr(x-50,y-12,100,12,4,'#6b3a26',3);}
    ctx.save();ctx.translate(x,y-150);ctx.rotate(Math.sin(t*2)*.04+(B.flash>0?Math.sin(t*60)*.08:0));
    rr(-62,-100,124,150,40,'#d9c08a',4.5);for(let i=0;i<3;i++)line(-58,-60+i*36,58,-56+i*36,2,'rgba(107,58,38,.4)');
    circ(0,-20,46,'#fff8ee',3.5);circ(0,-20,32,'#e23b3b',3);circ(0,-20,18,'#fff8ee',3);circ(0,-20,7,'#e23b3b',2);
    circ(0,-100,34,'#d9c08a',4);line(-14,-108,-6,-100,3);line(-14,-100,-6,-108,3);line(6,-108,14,-100,3);line(6,-100,14,-108,3);ctx.beginPath();ctx.arc(0,-88,9,.2,Math.PI-.2);ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.restore();flashOver(B,x,y-150,80);ctx.restore();panel(B,L);}});

defBoss({id:'tutorial_avion',kind:'plane',name:'Globo de Práctica',sub:'Escuela de Héroes · Tutorial de avión',isl:1,hp:400,par:999,arena:'plane_campo',song:'title',x:760,y:260,intro:'¡A VOLAR!',
  center(B){return{x:B.x,y:B.y};},shapes(B){return[{x:B.x,y:B.y,r:70}];},
  move(B,dt,L){B.y=260+Math.sin(B.t*.8)*60;ctl(B,dt,L);},phases:[{atk:[]}],
  draw(B,L){const t=B.t,x=B.x,y=B.y;ctx.save();ctx.lineJoin='round';line(x,y+70,x+Math.sin(t*2)*10,y+150,2);
    ctx.beginPath();ctx.ellipse(x,y,64,72,0,0,TAU);ctx.fillStyle='#e8562e';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();
    circ(x,y,40,'#fff8ee',3);circ(x,y,26,'#e23b3b',3);circ(x,y,12,'#fff8ee',2.5);ell(x-28,y-36,10,16,'rgba(255,255,255,.5)',0);poly([[x-8,y+70],[x+8,y+70],[x,y+80]],'#e8562e',2.5);
    flashOver(B,x,y,70);ctx.restore();panel(B,L);}});

Object.assign(ACZ,{tuto_sala(g){const gr=g.createLinearGradient(0,0,0,GROUND);gr.addColorStop(0,'#e8d4a8');gr.addColorStop(1,'#d4b884');g.fillStyle=gr;g.fillRect(0,0,W,GROUND);
  for(let x=0;x<W;x+=80){g.fillStyle='rgba(107,58,38,.08)';g.fillRect(x,0,40,GROUND);}
  gR(g,60,190,300,150,'#2f4a3a',6,6);g.fillStyle='rgba(255,255,255,.75)';g.font='700 22px Georgia';g.fillText('1. Saltar',90,230);g.fillText('2. Disparar',90,262);g.fillText('3. ¡Parry rosa!',90,294);g.fillText('4. EX y SÚPER',90,326);gR(g,60,334,300,10,'#8a5a3a',3,2);
  gR(g,420,200,90,120,'#7bb7c9',4,8);g.strokeStyle=C.ink;g.lineWidth=3;g.beginPath();g.moveTo(465,200);g.lineTo(465,320);g.moveTo(420,260);g.lineTo(510,260);g.stroke();
  for(let i=0;i<5;i++)gR(g,880,GROUND-60-i*26,50,26,['#e86a5a','#f2c14e','#7bc6e8','#b8d08a','#d6a2e8'][i],3,4);
  g.fillStyle='#a0663a';g.fillRect(0,GROUND,W,H-GROUND);for(let x=0;x<W;x+=120){g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x,GROUND,3,H-GROUND);}g.fillStyle='rgba(20,13,8,.85)';g.fillRect(0,GROUND,W,5);}});

/* ---------- where to find it ---------- */
const startTuto=id=>{if(typeof NP!=='undefined'&&NP.on){say('Profe Tuerca','La escuela solo abre cuando juegas sin conexión.');return;}transition(()=>startLevel(id));};
window.openTuto=function(intro){save.flags.tutoOffer=true;persist();
  say('Profe Tuerca',intro?'¡Bienvenidos, novatos! Soy el Profe Tuerca. Antes de pelear contra cacharros gruñones, ¿queréis una clase rápida? Aquí no se pierde nunca.':'¿Qué clase quieres repasar? En las dos no puedes perder.',
    [{label:'Tutorial a pie (saltar, disparar, parry, EX)',fn:()=>startTuto('tutorial')},{label:'Tutorial de avión',fn:()=>startTuto('tutorial_avion')},{label:intro?'Ahora no, ¡a la aventura!':'Ahora no',fn:()=>{}}]);};
(function place(){const w=WORLDS[1];if(w.nodes.some(n=>n.id==='profe'))return;const [sx,sy]=w.start;let best=null;
  for(let r=110;r<380&&!best;r+=30)for(let a=0;a<TAU&&!best;a+=.4){const x=Math.round(sx+Math.cos(a)*r),y=Math.round(sy+Math.sin(a)*r*.7);
    if(typeof walkable==='function'&&!walkable(w,x,y))continue;if(w.nodes.some(n=>Math.hypot(n.x-x,n.y-y)<95))continue;best=[x,y];}
  if(best)w.nodes.push({id:'profe',x:best[0],y:best[1],kind:'npc',npc:'profe',name:'Profe Tuerca · Escuela de Héroes',ob:14});})();
const _dnT=drawNPC;drawNPC=function(id,x,y,t){if(id!=='profe'){_dnT(id,x,y,t);return;}ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=3;ctx.strokeStyle=C.ink;shadowE(0,0,18);
  const b=Math.sin(t*3)*2;rr(-14,-34+b,28,30,8,'#7a8a9a');rr(-4,-30+b,8,22,2,'#e23b3b',0);circ(0,-46+b,14,'#c8d2dc');circ(-5,-48+b,4,'#fff',2);circ(5,-48+b,4,'#fff',2);circ(-5,-48+b,1.6,C.ink,0);circ(5,-48+b,1.6,C.ink,0);line(-6,-40+b,6,-40+b,2);
  poly([[-18,-58+b],[0,-66+b],[18,-58+b],[0,-50+b]],'#1b130d');line(14,-58+b,18,-46+b,2,C.goldL);ctx.save();ctx.translate(18,-30+b);ctx.rotate(-.6+Math.sin(t*2)*.2);rr(-2,-24,4,24,1,C.woodL,1.5);ctx.restore();
  if(!save.flags.tuto){const k=Math.abs(Math.sin(t*4));btxt('!',0,-82-k*4,22,C.gold,'center',900);}ctx.restore();};
const _ntT=npcTalk;npcTalk=function(n){if(n.npc==='profe'){sfx('pageTurn');openTuto(false);return;}_ntT(n);};
const _toT=toMap;toMap=function(){_toT();if(save.intro&&!save.flags.tutoOffer&&save.island===1&&scene==='map'&&!MAPS.dialog&&!(typeof NP!=='undefined'&&NP.on))openTuto(true);};
if(!ACHD.tuto){ACH.push(['tuto','Alumno Aplicado','Completa un tutorial de la Escuela de Héroes.',1]);ACHD.tuto={id:'tuto',name:'Alumno Aplicado',desc:'Completa un tutorial de la Escuela de Héroes.',coins:1};}
/* tutorials never count for anything else and never show the grade screen */
const _alT=afterLevel;afterLevel=function(L){if(L.id==='tutorial'||L.id==='tutorial_avion'){toMap();return;}_alT(L);};
})();
