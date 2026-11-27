'use strict';
/* ================= ENGINE: players, weapons, parry, co-op, bosses, levels ================= */
const LEVELS={};
const CHARMS={
  corazon:{name:'Corazón de Cobre',price:3,isl:1,desc:'+1 de vida. A cambio, tus disparos pegan un 6 % menos.'},
  cafe:{name:'Grano Cargado',price:3,isl:1,desc:'Tu barra de súper se llena sola, poco a poco.'},
  imanparry:{name:'Imán de Parry',price:2,isl:1,desc:'Tu parry alcanza más lejos y la ventana dura más. Ideal para aprender a hacer parry.'},
  fantasma:{name:'Bomba de Humo',price:4,isl:1,desc:'Tu dash es una bomba de humo: desapareces en una nube y atraviesas balas y enemigos sin recibir daño.'},
  azucar:{name:'Terrón Rosa',price:3,isl:2,desc:'En el aire, lo primero que toques que se pueda hacer parry lo rompes solo, sin pulsar nada. Una vez por salto.'},
  anillo:{name:'Anillo Corazón',price:3,isl:2,desc:'Cada 3 parrys ganas 1 vida extra (hasta 6). Da 3 vidas y se recarga al tirar una Súper, revivir a un compañero o hacer 10 parrys.'},
  doble:{name:'Doble Corazón',price:4,isl:3,desc:'+2 de vida. A cambio, tus disparos pegan un 10 % menos.'},
  muelle:{name:'Muelle',price:3,isl:2,desc:'Doble salto. El segundo salto también abre la ventana de parry.'},
  repuesto:{name:'Bombilla de Repuesto',price:4,isl:3,desc:'Una vez por nivel, cuando caes, vuelves con 1 de vida.'}};
const SUPERS={
  chispazo:{name:'Gran Chispazo',price:0,isl:1,desc:'Un rayo enorme hacia delante que arrasa con todo lo que toca.'},
  lluvia:{name:'Lluvia de Chispas',price:4,isl:1,desc:'Veinticuatro chispas caen del cielo y buscan solas a los enemigos.'},
  invencible:{name:'Estrella Invencible',price:4,isl:2,desc:'Te vuelves invencible durante 5 segundos y brillas de colores. También se gana superando el Mausoleo del Eco.'},
  iman:{name:'Imán Gigante',price:5,isl:2,desc:'Atrae todas las balas enemigas, las aplasta en una bola y se la devuelve al jefe. Cuantas más balas, más daño.'}};

/* ---------- fx ---------- */
function puff(L,x,y,n=6,col=C.paper){for(let i=0;i<n;i++)L.fx.push({k:'puff',x,y,vx:(rand()-.5)*160,vy:-rand()*80,life:.45,max:.45,r:6+rand()*8,col});}
function sparks(L,x,y,n=5,col='#ffe08a'){for(let i=0;i<n;i++){const a=rand()*TAU,s=120+rand()*260;L.fx.push({k:'spark',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.3,max:.3,r:3+rand()*3,col});}}
function boom(L,x,y,r=40){L.fx.push({k:'boom',x,y,life:.45,max:.45,r});sparks(L,x,y,8);}
function stars(L,x,y,n=5,col='#ffe27a'){for(let i=0;i<n;i++){const a=rand()*TAU,s=140+rand()*200;L.fx.push({k:'star',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-80,life:.55,max:.55,r:6+rand()*4,rot:rand()*TAU,col});}}
function smoke(L,x,y,n=8){for(let i=0;i<n;i++){const a=rand()*TAU,s=30+rand()*110;L.fx.push({k:'smoke',x:x+(rand()-.5)*20,y:y+(rand()-.5)*30,vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6-20,life:.55+rand()*.3,max:.85,r:12+rand()*12,col:rand()<.5?'#cfc6b4':'#a99f8e'});}}
function pop(L,x,y,t,col=C.brass){L.fx.push({k:'text',x,y,vy:-60,life:1,max:1,t,col});}
function ring(L,x,y,col=C.parry){L.fx.push({k:'ring',x,y,life:.4,max:.4,col});}
function updFX(L,dt){for(const p of L.fx){p.life-=dt;if(p.k==='suck'){const k=1-p.life/p.max;p.cx=lerp(p.x,p.tx,k*k);p.cy=lerp(p.y,p.ty,k*k);}else if(p.k!=='boom'&&p.k!=='ring'){p.x+=(p.vx||0)*dt;p.y+=(p.vy||0)*dt;}if(p.k==='spark'||p.k==='star')p.vy+=600*dt;if(p.k==='smoke'){p.vx*=Math.pow(.08,dt);p.vy*=Math.pow(.08,dt);}}L.fx=L.fx.filter(p=>p.life>0);}
function drawFX(L){for(const p of L.fx){const k=p.life/p.max;
  if(p.k==='puff'){ctx.globalAlpha=k*.85;circ(p.x,p.y,p.r*(1.4-k*.4),p.col,2);ctx.globalAlpha=1;}
  else if(p.k==='spark')circ(p.x,p.y,p.r*k,p.col,0);
  else if(p.k==='star'){ctx.globalAlpha=Math.min(1,k*2);star(p.x,p.y,p.r,p.r*.45,5,p.rot+(1-k)*6);ctx.fillStyle=p.col;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ctx.globalAlpha=1;}
  else if(p.k==='smoke'){ctx.globalAlpha=Math.min(1,k*1.5)*.9;const r=p.r*(1.6-k*.6);circ(p.x,p.y,r,p.col,2.5);circ(p.x-r*.3,p.y-r*.3,r*.4,'rgba(255,255,255,.3)',0);ctx.globalAlpha=1;}
  else if(p.k==='boom'){const r=p.r*(1.3-k*.6);ctx.globalAlpha=Math.min(1,k*1.6);star(p.x,p.y,r,r*.7,7);ctx.fillStyle=C.paper;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();ctx.globalAlpha=1;}
  else if(p.k==='ring'){ctx.globalAlpha=k;ctx.beginPath();ctx.arc(p.x,p.y,10+(1-k)*50,0,TAU);ctx.lineWidth=5*k+1;ctx.strokeStyle=p.col;ctx.stroke();ctx.globalAlpha=1;}
  else if(p.k==='suck'){circ(p.cx??p.x,p.cy??p.y,6,C.parryL,2);}
  else if(p.k==='text'){ctx.globalAlpha=Math.min(1,k*2);txt(p.t,p.x,p.y,22,p.col);ctx.globalAlpha=1;}}}

/* ---------- level & players ---------- */
function baseLevel(id){const d=LEVELS[id];return{id,def:d,kind:d.kind,name:d.name,t:0,time:0,state:'intro',stateT:0,hits:0,parries:0,supers:0,exs:0,bul:[],eb:[],fx:[],ents:[],arcs:[],tacks:[],beams:[],
  shake:0,flash:0,banner:'',bannerT:0,bannerMax:1,freeze:0,camX:0,coinsGot:[],menu:0,minX:64,maxX:W-64,floorAt:()=>GROUND,solids:[],Ps:[],wind:null,dark:null,superFlash:0,update(){},idle(){},progress:()=>0};}
function banner(L,t,d=1.6){L.banner=t;L.bannerT=d;L.bannerMax=d;}
function shake(L,n){if(!cfg.shake)return;L.shake=Math.max(L.shake,REDUCE?n*.2:n);}
const PCOL=['#efe0bf','#9ff0e6','#e7a8ff'];const HEROES=['chispa','cerilla','velita'];function heroChar(i){return i===0?cfg.char:HEROES.filter(c=>c!==cfg.char)[i-1];}
function hasCharm(p,c){return p.eq.charm===c;}
function dmgM(p){return p?(hasCharm(p,'corazon')?.94:hasCharm(p,'doble')?.9:1):1;}
function gain(p,d){if(p)p.cards=Math.min(5,p.cards+d*.028);}
function pWeapons(p){const e=p.eq;return[e.w1,e.w2].filter((w,i,a)=>w&&WEAPONS[w]&&a.indexOf(w)===i);}
function curW(p){const ws=pWeapons(p);return ws.length?ws[p.wi%ws.length]:'chispa';}
function newPlayer(L,i,type,x,y){const eq=save.eq[i]||save.eq[0];return{i,type,char:heroChar(i),eq,x,y,vx:0,vy:0,face:1,ground:type!=='plane',dash:0,dashCd:0,airDash:true,airJumps:0,inv:0,
  hp:3+(eq.charm==='corazon'?1:0)+(eq.charm==='doble'?2:0),maxHp:3+(eq.charm==='corazon'?1:0)+(eq.charm==='doble'?2:0),ringN:0,sugarUsed:false,starT:0,chargeT:0,runFx:0,cool:0,anim:0,duck:false,shoot:false,aimX:1,aimY:0,cards:0,hurtT:0,parryWin:0,spin:0,wi:0,safeX:x,safeY:y,dropT:0,lock:false,swapT:0,groundRef:null,flashT:0,
  dead:false,ghost:null,spare:false,saws:[],sawT:0,drillT:0,drillTick:0,arcT:0,shield:0,superT:0,superK:null,tilt:0,small:false,exT:0,drillDash:0,drillHit:null,rain:null,magnet:null};}
function addPlayers(L,type,x,y){const n=clamp(cfg.players||1,1,3);for(let i=0;i<n;i++)L.Ps.push(newPlayer(L,i,type,x-i*55,y+(type==='plane'?[0,80,-80][i]:0)));}
function alive(L){return L.Ps.filter(p=>!p.dead);}
function nearestP(L,x,y){let b=null,bd=1e9;for(const p of L.Ps){if(p.dead)continue;const d=dist(p.x,p.y,x,y);if(d<bd){bd=d;b=p;}}return b;}
function aimPt(p){return p.type==='plane'?{x:p.x,y:p.y}:{x:p.x,y:p.y-(p.duck?20:36)};}
function pCenter(p){return p.type==='plane'?{x:p.x,y:p.y}:{x:p.x,y:p.y-(p.duck?18:32)};}
function pBox(p){if(p.type==='plane'){const r=p.small?6:13;return{x:p.x-r,y:p.y-r,w:2*r,h:2*r};}const h=p.duck?34:58;return{x:p.x-14,y:p.y-h,w:28,h};}
function handPos(p){if(p.type==='plane')return{x:p.x+32,y:p.y+3};return{x:p.x+p.aimX*30,y:p.y-(p.duck?24:44)+p.aimY*30};}

/* ---------- weapons ---------- */
function B_(L,p,b){b.own=p;L.bul.push(b);return b;}
const WEAPONS={
  chispa:{name:'Chispero',price:0,isl:1,desc:'Tu disparo de siempre: recto, rápido y fiable.',exd:'EX: una chispa gigante que lo atraviesa todo.',
    fire(L,p,h,ax,ay){p.cool=.1;B_(L,p,{x:h.x,y:h.y,vx:ax*1000,vy:ay*1000,r:7,dmg:1,life:1.1,k:'chispa'});},
    ex(L,p,h,ax,ay){B_(L,p,{x:h.x,y:h.y,vx:ax*850,vy:ay*850,r:18,dmg:9,life:1.4,k:'ex',pierce:true});}},
  abanico:{name:'Abanico',price:3,isl:1,desc:'Tres chispas en abanico. Alcance corto, mucho daño de cerca.',exd:'EX: un estallido de chispas en 8 direcciones.',
    fire(L,p,h,ax,ay){p.cool=.15;const a0=Math.atan2(ay,ax);for(const d of[-.22,0,.22])B_(L,p,{x:h.x,y:h.y,vx:Math.cos(a0+d)*900,vy:Math.sin(a0+d)*900,r:7,dmg:.85,life:.3,k:'abanico'});},
    ex(L,p,h,ax,ay){const a0=Math.atan2(ay,ax);for(let i=0;i<8;i++){const a=a0+i*TAU/8;B_(L,p,{x:h.x,y:h.y,vx:Math.cos(a)*700,vy:Math.sin(a)*700,r:12,dmg:2.4,life:.6,k:'ex'});}}},
  luciernaga:{name:'Luciérnaga',price:4,isl:1,desc:'Disparos que persiguen solos al enemigo más cercano. Pegan menos.',exd:'EX: cuatro luciérnagas gordas.',
    fire(L,p,h,ax,ay){p.cool=.16;B_(L,p,{x:h.x,y:h.y,vx:ax*620,vy:ay*620,r:7,dmg:.85,life:1.8,k:'luci',homing:5.5});},
    ex(L,p,h,ax,ay){const a0=Math.atan2(ay,ax);for(let i=0;i<4;i++){const a=a0+(i-1.5)*.35;B_(L,p,{x:h.x,y:h.y,vx:Math.cos(a)*500,vy:Math.sin(a)*500,r:12,dmg:2.6,life:2.2,k:'luci',homing:6,big:true});}}},
  rebote:{name:'Rebotín',price:4,isl:1,desc:'Bolas pesadas que vuelan en arco y rebotan. Lentas pero fuertes.',exd:'EX: una bomba que explota al tocar.',
    fire(L,p,h,ax,ay){p.cool=.34;B_(L,p,{x:h.x,y:h.y,vx:ax*560,vy:ay*560-(ay<0?0:320),r:10,dmg:2.8,life:2.4,k:'rebote',g:1500,bounce:1});},
    ex(L,p,h,ax,ay){B_(L,p,{x:h.x,y:h.y,vx:ax*520,vy:ay*520-350,r:16,dmg:12,life:2.5,k:'bomba',g:1400});}},
  tachuelas:{name:'Tachuelas',price:4,isl:2,desc:'Clavas tachuelas en el enemigo. Al juntar seis, o al rato, revientan todas a la vez.',exd:'EX: una tachuela gigante que estalla.',
    fire(L,p,h,ax,ay){p.cool=.17;B_(L,p,{x:h.x,y:h.y,vx:ax*950,vy:ay*950,r:6,dmg:2.3,life:1.1,k:'tack'});},
    ex(L,p,h,ax,ay){B_(L,p,{x:h.x,y:h.y,vx:ax*800,vy:ay*800,r:14,dmg:16,life:1.4,k:'tack',big:true});}},
  burbujas:{name:'Burbujero',price:4,isl:2,desc:'Burbujas lentas que se tragan las balas enemigas que tocan.',exd:'EX: un escudo de burbuja que te protege y luego revienta.',
    fire(L,p,h,ax,ay){p.cool=.17;B_(L,p,{x:h.x,y:h.y,vx:ax*300,vy:ay*300,r:12,dmg:1.4,life:2,k:'bubble',absorb:1,wob:rand()*6});},
    ex(L,p){p.shield=2.6;}},
  sierra:{name:'Sierra Orbital',price:5,isl:2,hold:true,desc:'Mantén el disparo: hasta tres sierras giran a tu alrededor, cortan y bloquean balas. Suelta para lanzarlas.',exd:'EX: una sierra gigante que va y vuelve.',
    ex(L,p,h,ax,ay){B_(L,p,{x:h.x,y:h.y,vx:ax*700,vy:ay*700,r:22,dmg:1.3,life:2.2,k:'bigsaw',pierce:true,tickHit:true,boomer:{t:0}});}},
  carga:{name:'Cañón de Carga',price:4,isl:1,hold:true,desc:'Mantén para cargar y suelta. Cargado del todo dispara un cañonazo enorme que lo atraviesa todo: uno de los golpes más fuertes del juego. Si sueltas antes, solo sale un pulso débil.',exd:'EX: tres cañonazos cargados en abanico.',
    ex(L,p,h,ax,ay){const a0=Math.atan2(ay,ax);for(const d of[-.2,0,.2])B_(L,p,{x:h.x,y:h.y,vx:Math.cos(a0+d)*820,vy:Math.sin(a0+d)*820,r:20,dmg:8,life:1.2,k:'ex',pierce:true});}},
  arco:{name:'Arco Voltaico',price:5,isl:3,hold:true,desc:'Un rayo corto que salta solo al enemigo más cercano y rebota a un segundo.',exd:'EX: una descarga que golpea a todo lo que haya en pantalla.',
    ex(L,p){for(const e of L.ents){if(e.dead||e.hidden)continue;const c=e.center();if(c.x<L.camX-20||c.x>L.camX+W+20)continue;e.damage(8*dmgM(p),p);gain(p,4);L.arcs.push({pts:zig(p.x,p.y-40,c.x,c.y),t:.3,big:true});}sfx('zap');shake(L,8);}},
  taladro:{name:'Taladro',price:5,isl:3,hold:true,desc:'Mantén el disparo: un taladro de corto alcance que pega más fuerte cuanto más tiempo lo sostienes.',exd:'EX: te lanzas taladrando hacia delante sin recibir daño.',
    ex(L,p){p.drillDash=.32;p.inv=Math.max(p.inv,.45);p.drillHit=new Set();}},
};
function zig(x1,y1,x2,y2){const pts=[[x1,y1]],n=Math.max(3,Math.floor(dist(x1,y1,x2,y2)/22));for(let i=1;i<n;i++){const k=i/n;pts.push([lerp(x1,x2,k)+(rand()-.5)*18,lerp(y1,y2,k)+(rand()-.5)*18]);}pts.push([x2,y2]);return pts;}
function nearPt(e,x,y){if(!e.shapes)return e.center();let best=e.center(),bd=1e9;for(const s of e.shapes()){let px,py;if(s.w!==undefined){px=clamp(x,s.x,s.x+s.w);py=clamp(y,s.y,s.y+s.h);}
  else{const a=Math.atan2(y-s.y,x-s.x),d=Math.min(s.r,dist(x,y,s.x,s.y));px=s.x+Math.cos(a)*d;py=s.y+Math.sin(a)*d;}const d=dist(x,y,px,py);if(d<bd){bd=d;best={x:px,y:py};}}return best;}
function holdWeapon(L,p,dt,h,w){
  if(w==='carga'){if(p.shoot){p.chargeT=(p.chargeT||0)+dt;if(p.chargeT>.62&&!p.chargeOk){p.chargeOk=true;sfx('card');sparks(L,h.x,h.y,8,'#ffe27a');}if(p.chargeOk&&rand()<.3)sparks(L,h.x+(rand()-.5)*20,h.y+(rand()-.5)*20,1,'#ffe27a');}
    else if(p.chargeT>0){const big=p.chargeOk;if(big||p.cool<=0){B_(L,p,{x:h.x,y:h.y,vx:p.aimX*(big?950:1050),vy:p.aimY*(big?950:1050),r:big?26:8,dmg:big?13:1.4,life:1.2,k:big?'ex':'chispa',pierce:big});
      p.cool=.22;p.flashT=.08;sfx(big?'ex':'shot','chispa');if(big){shake(L,9);boom(L,h.x,h.y,36);sparks(L,h.x,h.y,10,'#ffe27a');}}p.chargeT=0;p.chargeOk=false;}}
  else{p.chargeT=0;p.chargeOk=false;}
  if(w==='sierra'){if(p.shoot){p.sawT-=dt;if(p.saws.length<3&&p.sawT<=0){p.saws.push({a:p.saws.length?p.saws[p.saws.length-1].a+TAU/3:0,hp:3,tick:0});p.sawT=.3;sfx('shot','sierra');}}
    else if(p.saws.length){for(const s of p.saws)B_(L,p,{x:s.x,y:s.y,vx:p.aimX*720,vy:p.aimY*720,r:12,dmg:2.6,life:1,k:'saw',pierce:true});p.saws=[];sfx('throw');}
    const c=pCenter(p);for(const s of p.saws){s.a+=dt*7;s.x=c.x+Math.cos(s.a)*58;s.y=c.y+Math.sin(s.a)*58;s.tick-=dt;
      if(s.tick<=0){s.tick=.1;for(const e of L.ents)if(!e.dead&&e.hitBy(s.x,s.y,12)){e.damage(.6*dmgM(p),p);gain(p,.6);}}
      for(const e of L.eb)if(!e.dead&&destroyable(e)&&dist(e.x,e.y,s.x,s.y)<(e.r||12)+12){e.dead=true;s.hp--;sparks(L,e.x,e.y,4,C.steel);}}
    p.saws=p.saws.filter(s=>s.hp>0);}
  else if(p.saws.length)p.saws=[];
  if(w==='taladro'){if(p.shoot){p.drillT+=dt;p.drillTick-=dt;p.flashT=.06;if(p.drillTick<=0){p.drillTick=.05;const dm=lerp(.32,.85,Math.min(1,p.drillT/1.6));
      for(const e of L.ents){if(e.dead)continue;for(let k=1;k<=4;k++){const px=h.x+p.aimX*k*32,py=h.y+p.aimY*k*32;if(e.hitBy(px,py,14)){e.damage(dm*dmgM(p),p);gain(p,dm);if(rand()<.3)sparks(L,px,py,2,C.steel);break;}}}
      for(const e of L.eb)if(!e.dead&&destroyable(e)&&circRect(e.x,e.y,e.r||10,Math.min(h.x,h.x+p.aimX*130)-6,Math.min(h.y,h.y+p.aimY*130)-6,Math.abs(p.aimX*130)+12,Math.abs(p.aimY*130)+12))e.dead=true;
      sfx('shot','taladro');}}else p.drillT=0;}
  if(w==='arco'&&p.shoot){p.arcT-=dt;p.flashT=.06;if(p.arcT<=0){p.arcT=.13;sfx('shot','arco');let best=null,bd=330,bc=null;
    for(const e of L.ents){if(e.dead||e.hidden)continue;const c=nearPt(e,h.x,h.y),dx=c.x-h.x,dy=c.y-h.y,d=Math.hypot(dx,dy);if(d<bd&&(dx*p.aimX+dy*p.aimY)/Math.max(1,d)>.2){bd=d;best=e;bc=c;}}
    if(best){best.damage(1.5*dmgM(p),p);gain(p,1.5);L.arcs.push({pts:zig(h.x,h.y,bc.x,bc.y),t:.09});let b2=null,b2d=220,b2c=null;
      for(const e of L.ents){if(e.dead||e===best||e.hidden)continue;const c=e.center(),d=dist(bc.x,bc.y,c.x,c.y);if(d<b2d){b2d=d;b2=e;b2c=c;}}
      if(b2){b2.damage(.75*dmgM(p),p);L.arcs.push({pts:zig(bc.x,bc.y,b2c.x,b2c.y),t:.09});}}
    else L.arcs.push({pts:zig(h.x,h.y,h.x+p.aimX*110,h.y+p.aimY*110),t:.07,fizz:true});}}}
function tryEX(L,p,h){if(p.cards>=5){startSuper(L,p);return;}if(p.cards<1||p.exT>0)return;p.cards-=1;L.exs++;p.exT=.35;WEAPONS[curW(p)].ex(L,p,h,p.aimX,p.aimY);sfx('ex');shake(L,6);sparks(L,h.x,h.y,8);}
function startSuper(L,p){p.cards=0;L.supers++;const s=p.eq.sup||'chispazo';p.superK=s;p.superT=s==='chispazo'?1.2:s==='lluvia'?1.3:s==='invencible'?.3:1;if(s==='invencible'){p.starT=5;p.inv=5.2;}p.inv=Math.max(p.inv,p.superT+.4);L.superFlash=.35;
  sfx('super');shake(L,14);banner(L,'¡'+SUPERS[s].name.toUpperCase()+'!',1.1);
  if(s==='chispazo')L.beams.push({own:p,t:1.2,tick:0,x:p.x+(p.type==='plane'?30:p.face*20),y:p.type==='plane'?p.y:p.y-44,dir:p.type==='plane'?1:p.face});
  else if(s==='lluvia')p.rain={n:24,acc:0};
  else{let n=0;const c=pCenter(p);for(const e of L.eb)if(!e.dead&&destroyable(e)){e.dead=true;n++;L.fx.push({k:'suck',x:e.x,y:e.y,tx:c.x,ty:c.y,life:.5,max:.5});}p.magnet={t:.55,n};}}
function superTick(L,p,dt){if(p.superT<=0)return;p.superT-=dt;
  if(p.rain){p.rain.acc+=dt;while(p.rain.acc>.05&&p.rain.n>0){p.rain.acc-=.05;p.rain.n--;B_(L,p,{x:L.camX+40+rand()*(W-80),y:-20,vx:(rand()-.5)*100,vy:420,r:11,dmg:2.2,life:2.5,k:'luci',homing:5,big:true});}if(p.rain.n<=0)p.rain=null;}
  if(p.magnet){p.magnet.t-=dt;if(p.magnet.t<=0){const c=pCenter(p);B_(L,p,{x:c.x,y:c.y,vx:(p.type==='plane'?1:p.face)*420,vy:-120,r:26,dmg:Math.min(60,18+2.5*p.magnet.n),life:3,k:'magnet',homing:7});p.magnet=null;sfx('boom');}}}
function shieldTick(L,p,dt){if(p.shield<=0)return;p.shield-=dt;const c=pCenter(p);for(const e of L.eb)if(!e.dead&&destroyable(e)&&dist(e.x,e.y,c.x,c.y)<72){e.dead=true;puff(L,e.x,e.y,2,'#cfe8ee');}
  if(p.shield<=0){for(let i=0;i<8;i++){const a=i*TAU/8;B_(L,p,{x:c.x,y:c.y,vx:Math.cos(a)*500,vy:Math.sin(a)*500,r:14,dmg:2.5,life:.8,k:'bubble'});}sfx('pop');}}

/* ---------- bullets ---------- */
function explode(L,b){boom(L,b.x,b.y,70);shake(L,10);sfx('boom');for(const en of L.ents)if(en.hitBy(b.x,b.y,70)){en.damage(b.dmg*dmgM(b.own),b.own);if(!b.noGain)gain(b.own,b.dmg);}}
function stickTack(L,b,en){const c=en.center();L.tacks.push({en,dx:b.x-c.x,dy:b.y-c.y,t:b.big?.8:1.5,dmg:b.dmg,own:b.own,big:b.big});sfx('hit');
  const mine=L.tacks.filter(t=>t.en===en);if(mine.length>=6)for(const t of mine)t.t=0;}
function updTacks(L,dt){for(const t of L.tacks){t.t-=dt;if(t.en.dead){t.gone=true;continue;}if(t.t<=0){t.gone=true;const c=t.en.center(),x=c.x+t.dx,y=c.y+t.dy;t.en.damage(t.dmg*dmgM(t.own),t.own);gain(t.own,t.dmg);
  if(t.big){boom(L,x,y,50);sfx('boom');}else{sparks(L,x,y,5,C.steel);sfx('hit');}}}L.tacks=L.tacks.filter(t=>!t.gone);}
function nearestEnt(L,x,y){let best=null,bd=1e9;for(const e of L.ents){if(e.dead||e.hidden)continue;const c=e.center(),d=dist(x,y,c.x,c.y);if(d<bd&&c.x>L.camX-40&&c.x<L.camX+W+40){bd=d;best=e;}}return best;}
function updBullets(L,dt){
  for(const b of L.bul){if(b.upd)b.upd(b,L,dt);
    if(b.k==='bubble'&&b.wob!==undefined){b.wob+=dt*6;b.vy+=Math.cos(b.wob)*40*dt;}
    if(b.boomer){b.boomer.t+=dt;if(b.boomer.t>.55){const o=b.own,c=pCenter(o),a=Math.atan2(c.y-b.y,c.x-b.x);b.vx=lerp(b.vx,Math.cos(a)*820,Math.min(1,dt*5));b.vy=lerp(b.vy,Math.sin(a)*820,Math.min(1,dt*5));if(dist(b.x,b.y,c.x,c.y)<34&&b.boomer.t>.85)b.life=0;}}
    if(b.homing){const t=nearestEnt(L,b.x,b.y);if(t){const c=nearPt(t,b.x,b.y),want=Math.atan2(c.y-b.y,c.x-b.x),cur=Math.atan2(b.vy,b.vx),sp=Math.hypot(b.vx,b.vy);
      const d=((want-cur+Math.PI*3)%TAU)-Math.PI,na=cur+clamp(d,-b.homing*dt,b.homing*dt);b.vx=Math.cos(na)*sp;b.vy=Math.sin(na)*sp;}}
    if(b.acc)b.vx+=b.acc*dt;if(b.g)b.vy+=b.g*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
    if(b.g){const fy=L.floorAt(b.x);if(b.y>fy-b.r){if(b.k==='bomba'){explode(L,b);b.life=0;}else if(b.bounce>0){b.bounce--;b.y=fy-b.r;b.vy=-Math.abs(b.vy)*.65;puff(L,b.x,fy,2);}else{b.life=0;sparks(L,b.x,fy,3);}}}
    if(b.absorb)for(const e of L.eb){if(!e.dead&&destroyable(e)&&dist(e.x,e.y,b.x,b.y)<(e.r||10)+b.r){e.dead=true;b.life=0;puff(L,b.x,b.y,3,'#cfe8ee');sfx('pop');break;}}
    if(b.tickHit)b.tk=(b.tk||0)-dt;
    if(b.life>0)for(const en of L.ents){if(en.dead)continue;if(b.hits&&b.hits.has(en))continue;if(b.tickHit&&b.tk>0)break;if(!(typeof bulHit==='function'?bulHit(en,b,dt):en.hitBy(b.x,b.y,b.r)))continue;
      if(b.k==='bomba'){explode(L,b);b.life=0;break;}if(b.k==='tack'){stickTack(L,b,en);b.life=0;break;}
      const d=b.dmg*dmgM(b.own);en.damage(d,b.own);if(!b.noGain)gain(b.own,d);sparks(L,b.x,b.y,3);
      if(b.tickHit){b.tk=.1;break;}if(b.pierce)(b.hits=b.hits||new Set()).add(en);else{b.life=0;break;}}
    if(b.x<L.camX-80||b.x>L.camX+W+80||b.y<-120||b.y>H+60)b.life=0;}
  L.bul=L.bul.filter(b=>b.life>0);L.ents=L.ents.filter(e=>!e.dead||e.keep);}
function updBeams(L,dt){for(const bm of L.beams){bm.t-=dt;bm.tick-=dt;const p=bm.own;if(p.type==='plane'){bm.y0=p.y;bm.x=p.x+30;if(!bm.wave)bm.y=p.y;}if(bm.wave)bm.y=(bm.y0??bm.y)+Math.sin((1.2-bm.t)*7)*70;
  if(bm.tick<=0){bm.tick=.1;for(const en of L.ents){if(en.dead)continue;for(let k=0;k<26;k++){const px=bm.x+bm.dir*(20+k*40);if(px<L.camX-50||px>L.camX+W+50)break;if(en.hitBy(px,bm.y,34)){en.damage(4.2*dmgM(p),p);sparks(L,px,bm.y,3);break;}}}
    for(const e of L.eb)if(!e.dead&&destroyable(e)&&Math.abs(e.y-bm.y)<44&&(e.x-bm.x)*bm.dir>0)e.dead=true;}}
  L.beams=L.beams.filter(b=>b.t>0);}

/* ---------- enemy projectiles ---------- */
function spawnEB(L,o){const e=Object.assign({t:0,r:12,k:'shot',rot:0},o);L.eb.push(e);return e;}
function spawnPuddle(L,x){if(L.kind==='plane')return;spawnEB(L,{k:'puddle',x,w:64,life:2.6,r:0});}
function destroyable(e){return!e.parry&&(e.k==='shot'||e.k==='grav'||e.k==='bounce'||e.k==='boomer'||e.k==='roll');}
function parryable(e){return!!e.parry&&!(e.cool>0)&&!e.dead;}
function homeEB(L,e,dt){const p=nearestP(L,e.x,e.y);if(!p)return;const c=aimPt(p),want=Math.atan2(c.y-e.y,c.x-e.x),cur=Math.atan2(e.vy,e.vx),sp=e.spd||Math.hypot(e.vx,e.vy);
  const d=((want-cur+Math.PI*3)%TAU)-Math.PI,na=cur+clamp(d,-e.turn*dt,e.turn*dt);e.vx=Math.cos(na)*sp;e.vy=Math.sin(na)*sp;}
function updEB(L,dt){const plane=L.kind==='plane';
  for(const e of L.eb){e.t+=dt;if(e.cool>0)e.cool-=dt;if(e.upd)e.upd(e,L,dt);if(e.dead)continue;
    switch(e.k){
      case 'shot':e.x+=e.vx*dt+(e.sway?Math.cos(e.t*5)*e.sway*dt:0);e.y+=e.vy*dt+(e.wob?Math.cos(e.t*9)*e.wob*dt:0);e.rot+=dt*6;if(e.turn)homeEB(L,e,dt);
        if(e.fall&&!plane&&e.y>GROUND-e.r){if(e.puddle)spawnPuddle(L,e.x);e.dead=true;puff(L,e.x,GROUND,2);}break;
      case 'grav':{e.vy+=e.g*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.rot+=dt*6;const fy=L.floorAt(e.x);if(e.y+e.r>=fy&&e.vy>0){if(e.bounce>0){e.bounce--;e.y=fy-e.r;e.vy=-Math.abs(e.vy)*.74;puff(L,e.x,fy,2);sfx('knock');}else{e.dead=true;puff(L,e.x,fy,3);if(e.puddle)spawnPuddle(L,e.x);}}break;}
      case 'roll':e.x+=e.vx*dt;e.rot=e.t*e.vx/Math.max(8,e.r);if(e.hop){e.vy+=1600*dt;e.y+=e.vy*dt;if(e.y>GROUND-e.r){e.y=GROUND-e.r;e.vy=-e.hop;}}break;
      case 'wave':e.x+=e.vx*dt;break;
      case 'bounce':{e.x+=e.vx*dt;e.y+=e.vy*dt;e.rot+=dt*4;if(e.x<30||e.x>W-30){e.vx*=-1;e.x=clamp(e.x,30,W-30);}const fl=plane?H-20:GROUND;if(e.y>fl-e.r){e.vy=-Math.abs(e.vy);e.y=fl-e.r;}if(e.y<30)e.vy=Math.abs(e.vy);break;}
      case 'boomer':{const k=e.t/e.T;e.rot+=dt*12;if(k<1){const q=1-Math.pow(1-k,2);e.x=lerp(e.ox,e.tx,q);e.y=lerp(e.oy,e.ty,q);}
        else{const o=e.boss&&!e.boss.dead?anc(e.boss,e.from):{x:e.ox,y:e.oy},a=Math.atan2(o.y-e.y,o.x-e.x);e.x+=Math.cos(a)*520*dt;e.y+=Math.sin(a)*520*dt;if(dist(e.x,e.y,o.x,o.y)<30||e.t>e.T*3.5)e.dead=true;}break;}
      case 'column':if(e.t>e.warn+e.act+.35)e.dead=true;if(!e.snd&&e.t>e.warn){e.snd=1;sfx({bolt:'zap',darkbolt:'zap',steam:'steam',geyser:'splash',fire:'fire',stamp:'stamp',books:'stamp'}[e.style]||'stomp');shake(L,6);}break;
      case 'sweep':if(e.t>e.warn+e.act+.2)e.dead=true;if(!e.snd&&e.t>e.warn){e.snd=1;sfx(e.style==='saw'?'throw':e.style==='heat'||e.style==='steam'?'steam':'zap');shake(L,5);}break;
      case 'puddle':e.life-=dt;if(e.life<=0)e.dead=true;break;
    }
    if(e.life!==undefined&&e.k!=='puddle'){if(e.k!=='bounce'||true){e.life-=e.k==='puddle'?0:dt;}if(e.life<=0)e.dead=true;}
    if(!['pstar','column','sweep','puddle','boomer'].includes(e.k)&&(e.x<L.camX-160||e.x>L.camX+W+220||e.y>H+80||e.y<-320))e.dead=true;}
  L.eb=L.eb.filter(e=>!e.dead&&Number.isFinite(e.x)&&Number.isFinite(e.y));}
function ebHit(L,e,pb){if(e.harmless)return false;
  switch(e.k){
    case 'wave':return rectHit(pb,{x:e.x-e.w/2+6,y:e.y-e.h+8,w:e.w-12,h:e.h-8});
    case 'column':return e.t>e.warn+.04&&e.t<e.warn+e.act&&rectHit(pb,{x:e.x-e.w/2+3,y:0,w:e.w-6,h:e.full?H:GROUND});
    case 'sweep':return e.t>e.warn&&e.t<e.warn+e.act&&rectHit(pb,{x:L.camX-50,y:e.y-e.h/2,w:W+100,h:e.h});
    case 'puddle':return rectHit(pb,{x:e.x-e.w/2+6,y:GROUND-12,w:e.w-12,h:12});
    case 'pstar':return false;
    default:return circRect(e.x,e.y,e.r*.85,pb.x,pb.y,pb.w,pb.h);}}
function drawColumn(e,L){const warn=e.t<e.warn,x=e.x,bot=e.full?H:GROUND;
  if(warn){const bl=Math.floor(e.t*12)%2;ctx.setLineDash([6,10]);ctx.lineWidth=3;ctx.strokeStyle=bl?'rgba(181,64,47,.85)':'rgba(239,224,191,.55)';ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x,bot-20);ctx.stroke();ctx.setLineDash([]);
    if(!e.full){poly([[x,GROUND-4],[x-14,GROUND-24],[x+14,GROUND-24]],bl?C.rust:C.paper,2.5);}return;}
  const k=e.t-e.warn,act=k<e.act,prog=Math.min(1,k/.08),ret=act?0:Math.min(1,(k-e.act)/.3),w=e.w;ctx.save();
  switch(e.style){
    case 'needle':case 'fork':case 'stamp':{const tip=lerp(-60,bot-2,prog)-ret*(bot+60);
      if(e.style==='needle'){poly([[x-11,tip-600],[x+11,tip-600],[x+11,tip-40],[x,tip],[x-11,tip-40]],C.steel,3);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x-6,tip-580,3,530);}
      else if(e.style==='fork'){rr(x-5,tip-600,10,560,3,C.woodL,3);for(const d of[-18,0,18])poly([[x+d-4,tip-60],[x+d+4,tip-60],[x+d,tip]],C.steel,2.5);rr(x-24,tip-66,48,10,3,C.steel,2.5);}
      else{rr(x-6,tip-600,12,540,3,C.wood,3);rr(x-w/2-6,tip-60,w+12,24,4,C.woodD,3);rr(x-w/2,tip-36,w,36,3,C.rust,3);}break;}
    case 'bolt':case 'darkbolt':{ctx.beginPath();let xx=x;ctx.moveTo(xx,0);for(let y=0;y<=bot;y+=36){xx=x+(rand()-.5)*34;ctx.lineTo(xx,y);}const c1=e.style==='darkbolt'?'rgba(150,110,220,.4)':'rgba(255,240,180,.35)',c2=e.style==='darkbolt'?'#cbb6ff':'#fff6c8';
      ctx.lineWidth=22;ctx.strokeStyle=c1;ctx.stroke();ctx.lineWidth=11;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=6;ctx.strokeStyle=c2;ctx.stroke();break;}
    case 'steam':case 'geyser':case 'fire':{const top=lerp(bot,0,prog)+ret*bot,col=e.style==='steam'?'rgba(239,240,232,.9)':e.style==='geyser'?'rgba(150,200,215,.9)':'rgba(240,138,46,.92)';
      ctx.beginPath();ctx.moveTo(x-w/2,bot);for(let y=bot;y>top;y-=20)ctx.lineTo(x-w/2+Math.sin(y*.05+L.t*20)*6,y);ctx.lineTo(x,top-20);for(let y=top;y<bot;y+=20)ctx.lineTo(x+w/2+Math.sin(y*.05+L.t*20+2)*6,y);ctx.closePath();
      ctx.fillStyle=col;ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();if(e.style==='fire'){ctx.globalAlpha=.8;rr(x-w/4,top,w/2,bot-top,6,'#ffe27a',0);ctx.globalAlpha=1;}break;}
    case 'books':{const fall=lerp(-200,0,prog)-ret*600;for(let i=0;i<10;i++){const y=fall+bot-30-i*28;rr(x-w/2+(i%2)*4,y,w-6,24,3,['#7a3b2e','#3b5a7a','#6f7a45','#b5402f'][i%4],2.5);}break;}
  }ctx.restore();}
function drawSweep(e,L){const warn=e.t<e.warn,y=e.y,x0=L.camX,x1=L.camX+W;
  if(warn){const bl=Math.floor(e.t*12)%2;ctx.setLineDash([10,10]);ctx.lineWidth=3;ctx.strokeStyle=bl?'rgba(181,64,47,.85)':'rgba(239,224,191,.6)';ctx.strokeRect(x0+10,y-e.h/2,W-20,e.h);ctx.setLineDash([]);
    txt(e.low?'¡SALTA!':L.kind==='plane'?'¡MUÉVETE!':'¡AGÁCHATE!',x0+W/2,y-e.h/2-16,16,C.paper);return;}
  const k=e.t-e.warn;if(k>e.act){ctx.globalAlpha=Math.max(0,1-(k-e.act)/.2);}
  switch(e.style){
    case 'saw':for(let x=x0-40+((L.t*600*e.dir)%60+60)%60;x<x1+40;x+=60){ctx.save();ctx.translate(x,y);ctx.rotate(L.t*20);star(0,0,e.h*.6,e.h*.42,10);ctx.fillStyle=C.steel;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}break;
    default:{const col={light:'rgba(255,243,176,.95)',heat:'rgba(240,138,46,.85)',steam:'rgba(240,240,232,.9)',saber:'rgba(230,240,255,.95)',line:'rgba(30,24,40,.95)',scythe:'rgba(200,220,200,.9)'}[e.style]||'rgba(255,243,176,.95)';
      ctx.beginPath();ctx.moveTo(x0-20,y-e.h/2);for(let x=0;x<=W+40;x+=30)ctx.lineTo(x0-20+x,y-e.h/2+Math.sin(x*.05+L.t*30)*3);for(let x=W+40;x>=0;x-=30)ctx.lineTo(x0-20+x,y+e.h/2+Math.sin(x*.05+L.t*30+2)*3);ctx.closePath();
      ctx.fillStyle=col;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}}
  ctx.globalAlpha=1;}
function drawEB(L){for(const e of L.eb){
  if(e.k==='column')drawColumn(e,L);else if(e.k==='sweep')drawSweep(e,L);
  else if(e.k==='wave'){const dir=Math.sign(e.vx),w=e.w,h=e.h,water=e.spr==='water';ctx.save();ctx.translate(e.x,e.y);
    for(let i=0;i<3;i++){const ox=-dir*i*13,hh=h-i*9,wob=Math.sin(e.t*30+i)*2;ctx.beginPath();ctx.moveTo(ox-dir*4,0);ctx.quadraticCurveTo(ox+dir*(w*.45+wob),-hh*.55,ox-dir*4,-hh);ctx.lineWidth=i?4:7;ctx.strokeStyle=C.ink;ctx.stroke();
      if(!i){ctx.lineWidth=3;ctx.strokeStyle=water?'#a9d3dc':C.paper;ctx.stroke();}}if(!water)txt('¡RIN!',dir*6,-h-14,14,C.paper);ctx.restore();}
  else if(e.k==='puddle'){ctx.globalAlpha=Math.min(1,e.life*2);ell(e.x,GROUND-4,e.w/2,8,'#f3ead2',2.5);ctx.globalAlpha=1;}
  else if(e.k==='pstar'){ctx.globalAlpha=e.cool>0?.3:1;star(e.x,e.y+Math.sin(e.t*3)*4,e.r,e.r*.45,5,e.t);ctx.fillStyle=C.parry;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();ctx.globalAlpha=1;}
  else{if(e.parry&&!(e.cool>0)&&!e.harmless){ctx.save();ctx.globalAlpha=.35+.25*Math.sin(L.t*12);ctx.beginPath();ctx.arc(e.x,e.y,(e.r||12)+7+Math.sin(L.t*12)*2,0,TAU);ctx.lineWidth=3;ctx.strokeStyle=C.parryL;ctx.stroke();ctx.restore();}drawSpr(e,L.t);}}}

/* ---------- parry, damage, co-op souls ---------- */
function reachOf(p){return hasCharm(p,'imanparry')?60:44;}
function findParry(L,p){const c=pCenter(p),R=reachOf(p);let best=null,bd=1e9;
  for(const e of L.eb){if(!parryable(e))continue;const d=dist(e.x,e.y,c.x,c.y)-(e.r||12);if(d<R&&d<bd){bd=d;best=e;}}
  for(const q of L.Ps)if(q!==p&&q.dead&&q.ghost&&!q.ghost.gone){const d=dist(q.ghost.x,q.ghost.y,c.x,c.y)-30;if(d<R&&d<bd){bd=d;best={ghostOf:q,x:q.ghost.x,y:q.ghost.y};}}
  return best;}
function doParry(L,p,o){
  if(o.ghostOf)revive(L,o.ghostOf);else if(o.k==='pstar')o.cool=1.4;else o.dead=true;
  if(p.type==='plat'){p.vy=-800;p.ground=false;p.airDash=true;p.airJumps=hasCharm(p,'muelle')?1:0;}
  p.parryWin=0;p.spin=.35;p.cards=Math.min(5,p.cards+1);p.inv=Math.max(p.inv,.6);L.parries++;L.freeze=.07;p.parryTried=false;L.flash=Math.max(L.flash,.06);
  if(hasCharm(p,'anillo')){if(o.ghostOf)ringRestore(L,p);p.ringP=Math.min(3,(p.ringP||0)+1);p.ringTot=(p.ringTot||0)+1;if(p.ringTot%10===0)ringRestore(L,p);ringGive(L,p);}
  ring(L,o.x,o.y);ring(L,o.x,o.y,'#ffffff');sparks(L,o.x,o.y,16,C.parryL);for(let i=0;i<6;i++){const a=i*TAU/6;L.fx.push({k:'spark',x:o.x,y:o.y,vx:Math.cos(a)*420,vy:Math.sin(a)*420,life:.25,max:.25,r:5,col:'#ffffff'});}pop(L,o.x,o.y-30,'¡PARRY!',C.parryL);sfx('parry');shake(L,4);}
/* Anillo Corazón: every 3 parries = +1 life (up to 6). It gives 3 lives, then waits to be restored by a Super, a revive or 10 parries */
/* a finished set of 3 parries is never lost: if the ring is spent or you are at 6, it waits and pays out as soon as it can */
function ringRestore(L,p){if(!hasCharm(p,'anillo')||!p.ringN)return;p.ringN=0;pop(L,p.x,p.y-140,'¡ANILLO LISTO!',C.parryL);sfx('ding');ringGive(L,p);}
function ringGive(L,p){if(!hasCharm(p,'anillo')||p.dead||(p.ringP||0)<3||(p.ringN||0)>=3||p.hp>=6)return;p.ringP=0;p.ringN=(p.ringN||0)+1;p.hp++;p.maxHp=Math.max(p.maxHp,p.hp);pop(L,p.x,p.y-110,'+1 VIDA',C.gold);sfx('revive');}
function revive(L,q){const g=q.ghost;q.dead=false;q.ghost=null;q.hp=1;q.inv=2.2;q.x=g.x;
  if(q.type==='plat'){const fl=L.floorAt(g.x);if(fl>9999){const al=alive(L).find(a=>a!==q);if(al){q.x=al.x;}}q.y=Math.min(g.y+40,GROUND);q.vy=-200;q.ground=false;}else q.y=g.y;
  sfx('revive');pop(L,q.x,q.y-60,'¡DE VUELTA!',C.gold);}
function kill(L,p){if(hasCharm(p,'repuesto')&&!p.spare){p.spare=true;p.hp=1;p.inv=2.5;pop(L,p.x,p.y-90,'¡REPUESTO!',C.gold);sfx('revive');return;}
  p.dead=true;p.hp=0;p.superT=0;p.saws=[];p.ghost={x:p.x,y:p.type==='plane'?p.y:Math.min(p.y-40,H-60),t:0,gone:false};sfx('death');sfx('soul');L.flash=.3;shake(L,14);L.freeze=.25;
  const c0=pCenter(p);boom(L,c0.x,c0.y,50);smoke(L,c0.x,c0.y,14);stars(L,c0.x,c0.y,10,'#ffffff');ring(L,c0.x,c0.y,'#ffffff');pop(L,c0.x,c0.y-70,'¡AY NO!',C.paper);save.deaths=(save.deaths||0)+1;
  if(!alive(L).length){L.state='dead';L.stateT=0;L.menu=0;sfx('gameover');}}
function hurt(L,p){if(L.state!=='play'||p.dead)return;p.hp--;L.hits++;p.inv=1.6;p.hurtT=.35;if(p.type==='plat'){p.vy=-420;p.ground=false;}
  shake(L,12);L.flash=.2;sfx('hurt');sparks(L,p.x,p.y-(p.type==='plat'?40:0),10,C.paper);if(p.hp<=0)kill(L,p);}
function ghostUpd(L,p,dt){const g=p.ghost;if(!g||g.gone)return;g.t+=dt;g.y-=48*dt;g.x+=Math.sin(g.t*2)*24*dt;if(L.kind==='run')g.x=clamp(g.x,L.camX+30,L.camX+W-30);if(g.y<-70)g.gone=true;}
function collide(L,p,dt){
  if(p.parryWin>0){const o=findParry(L,p);if(o)doParry(L,p,o);}
  const pb=pBox(p),inv=p.inv>0||(p.dash>0&&hasCharm(p,'fantasma'))||p.superT>0||p.drillDash>0;
  for(const e of L.eb){if(e.dead)continue;if(!ebHit(L,e,pb)){if(e.touch)e.touch=0;continue;}if(inv)continue;
    if(parryable(e)&&hasCharm(p,'azucar')&&p.type==='plat'&&!p.ground&&!p.sugarUsed){p.sugarUsed=true;doParry(L,p,e);break;}
    if(parryable(e)){e.touch=(e.touch||0)+dt;if(e.touch>=.15){e.touch=0;e.dead=e.k!=='pstar';hurt(L,p);break;}continue;}
    hurt(L,p);break;}
  if(!inv&&L.state==='play'&&!p.dead)for(const en of L.ents)if(!en.dead&&en.contact&&en.contact(pb)){hurt(L,p);break;}}

/* ---------- player updates ---------- */
function ptimers(p,dt){p.landT=Math.max(0,(p.landT||0)-dt);if(p.trail){for(const g of p.trail)g.t+=dt;p.trail=p.trail.filter(g=>g.t<.22);}if(p.jumped&&!p.ground&&!(p.dash>0))p.ballA=(p.ballA||0)+dt*16*p.face;p.starT=Math.max(0,(p.starT||0)-dt);p.inv=Math.max(0,p.inv-dt);p.dashCd=Math.max(0,p.dashCd-dt);p.hurtT=Math.max(0,p.hurtT-dt);p.parryWin=Math.max(0,p.parryWin-dt);p.spin=Math.max(0,p.spin-dt);
  p.dropT=Math.max(0,p.dropT-dt);p.swapT=Math.max(0,p.swapT-dt);p.flashT=Math.max(0,p.flashT-dt);p.exT=Math.max(0,p.exT-dt);p.cool-=dt;}
function findGround(L,x){let best=null,bd=1e9;for(const s of L.solids)if(s.ground){const cx=clamp(x,s.x+40,s.x+s.w-40),d=Math.abs(cx-x);if(d<bd){bd=d;best={x:cx,y:s.y};}}return best||{x,y:GROUND};}
function pitFall(L,p){p.hp--;L.hits++;shake(L,10);sfx('hurt');
  if(p.hp<=0){const g=findGround(L,clamp(p.safeX,L.camX+60,L.camX+W-60));p.x=g.x;p.y=g.y;kill(L,p);if(p.ghost){p.ghost.x=g.x;p.ghost.y=g.y-80;}return;}
  const g=findGround(L,clamp(p.safeX,L.camX+60,L.camX+W-60));p.x=g.x;p.y=g.y;p.vy=0;p.inv=1.8;p.ground=true;pop(L,p.x,p.y-90,'¡CUIDADO!',C.rust);}
function movePlat(L,p,dt){
  if(p.ground&&p.groundRef&&p.groundRef.mv){p.x+=p.groundRef.dx||0;p.y=p.groundRef.y;}
  p.x=clamp(p.x+p.vx*dt,L.minX,L.maxX);if(L.kind==='run')p.x=clamp(p.x,L.camX+20,L.camX+W-20);
  const py=p.y;p.y+=p.vy*dt;let land=null;
  if(p.vy>=0)for(const s of L.solids){const top=s.y,ptop=s.py??s.y;if(p.x+9>s.x&&p.x-9<s.x+s.w&&py<=Math.max(top,ptop)+.5&&p.y>=top){if(s.oneWay&&p.dropT>0)continue;if(!land||top<land.y)land=s;}}
  if(p.vy>=0&&!(land&&land.spring))for(const s of L.solids)if(s.spring&&p.x+9>s.x&&p.x-9<s.x+s.w&&p.y>=s.y&&p.y<=s.y+s.h+2&&p.dropT<=0){land=s;break;}
  if(land){if(land.spring){p.y=land.y;p.vy=-1380;p.ground=false;land.boing=.3;sfx('boing');puff(L,p.x,land.y,4);p.airDash=true;p.airJumps=hasCharm(p,'muelle')?1:0;}
    else{if(!p.ground){p.sugarUsed=false;p.parryTried=false;p.parryWin=0;p.jumped=false;p.landT=.14;if(p.vy>300){puff(L,p.x,land.y,6);for(const d of[-1,1])L.fx.push({k:'puff',x:p.x+d*10,y:land.y-4,vx:d*160,vy:-20,life:.3,max:.3,r:6,col:C.paper});sfx('land');}}p.y=land.y;p.vy=0;p.ground=true;p.airDash=true;p.groundRef=land;
      if(land.ground&&p.x-land.x>50&&land.x+land.w-p.x>50){p.safeX=p.x;p.safeY=land.y;}}}
  else{p.ground=false;p.groundRef=null;}
  if(p.y>H+80)pitFall(L,p);}
function platUpdate(L,p,dt,I){ptimers(p,dt);
  if(p.dead){ghostUpd(L,p,dt);return;}
  if(hasCharm(p,'cafe'))p.cards=Math.min(5,p.cards+dt/14);
  superTick(L,p,dt);shieldTick(L,p,dt);
  if(p.superT>0&&p.superK==='chispazo'){p.vx=0;p.vy=0;p.shoot=true;p.anim+=dt*3;collide(L,p,dt);return;}
  if(I.p.swap&&pWeapons(p).length>1){p.wi=(p.wi+1)%pWeapons(p).length;p.swapT=1.2;sfx('swap');}
  const mv=(I.h.right?1:0)-(I.h.left?1:0);
  p.lock=!!I.h.lock&&p.ground;p.duck=!!I.h.down&&p.ground&&p.dash<=0&&!p.lock;
  if(I.p.dash&&p.dashCd<=0&&p.dash<=0&&p.drillDash<=0&&(p.ground||p.airDash)){if(mv)p.face=mv;p.dash=.21;p.dashCd=.42;if(!p.ground)p.airDash=false;p.vy=0;p.jumped=false;sfx('dash');for(let i=0;i<4;i++)L.fx.push({k:'puff',x:p.x-p.face*(10+i*8),y:p.y-6-rand()*30,vx:-p.face*(60+rand()*120),vy:-rand()*40,life:.4,max:.4,r:9+rand()*7,col:C.paper});if(hasCharm(p,'fantasma')){smoke(L,p.x,p.y-34,12);sfx('smoke');}else{puff(L,p.x,p.y-20,5);for(let i=0;i<3;i++)L.fx.push({k:'spark',x:p.x-p.face*10,y:p.y-20-i*14,vx:-p.face*300,vy:0,life:.18,max:.18,r:3,col:C.paper});}}
  if(p.drillDash>0){p.drillDash-=dt;p.vx=p.face*900;p.vy=0;for(const e of L.ents)if(!e.dead&&!p.drillHit.has(e)&&e.hitBy(p.x+p.face*24,p.y-30,30)){p.drillHit.add(e);e.damage(12*dmgM(p),p);gain(p,12);boom(L,p.x+p.face*30,p.y-30,30);sfx('boom');}}
  else if(p.dash>0){p.dash-=dt;p.vx=p.face*760;p.vy=0;if(!hasCharm(p,'fantasma')){p.trail=p.trail||[];p.trT=(p.trT||0)-dt;if(p.trT<=0){p.trT=.03;p.trail.push({x:p.x,y:p.y,t:0});}if(p.dash<=0){puff(L,p.x+p.face*10,p.y-4,4);L.fx.push({k:'puff',x:p.x+p.face*14,y:p.y-4,vx:p.face*80,vy:-30,life:.3,max:.3,r:7,col:C.paper});}}if(hasCharm(p,'fantasma')){if(rand()<.5)smoke(L,p.x-p.face*10,p.y-30,1);if(p.dash<=0)smoke(L,p.x,p.y-34,10);}if(rand()<.6)L.fx.push({k:'puff',x:p.x-p.face*14,y:p.y-30+rand()*20,vx:-p.face*40,vy:0,life:.25,max:.25,r:5,col:hasCharm(p,'fantasma')?C.parryL:C.glass});}
  else{
    if(mv&&!p.duck&&!p.lock)p.face=mv;p.vx=(p.duck||p.lock)?0:mv*310;if(L.wind)p.vx+=L.wind.f;
    if(I.p.jump){const o=findParry(L,p);
      if(o)doParry(L,p,o);
      else if(p.ground){if(I.h.down&&p.groundRef&&p.groundRef.oneWay){p.dropT=.25;p.ground=false;p.y+=2;}else{p.vy=-880;p.ground=false;p.jumped=true;p.ballA=0;sfx('jump');p.airJumps=hasCharm(p,'muelle')?1:0;p.parryWin=.14;puff(L,p.x,p.y-2,4);}}
      else{if(!p.parryTried||p.airJumps>0){p.parryTried=true;p.parryWin=hasCharm(p,'imanparry')?.6:.42;}if(p.airJumps>0){p.airJumps--;p.vy=-760;sfx('djump');puff(L,p.x,p.y,4,C.parryL);}}}
    p.vy=Math.min(1400,p.vy+((p.vy<0&&!I.h.jump)?3800:2300)*dt);}
  movePlat(L,p,dt);if(p.dead)return;
  let ax,ay;if(p.lock){ax=mv;ay=(I.h.down?1:0)-(I.h.up?1:0);if(!ax&&!ay)ax=p.face;if(ax)p.face=ax;}
  else{ax=p.face;ay=0;if(I.h.up){ay=-1;ax=mv;}else if(I.h.down&&!p.ground){ay=1;ax=mv;}if(!ax&&!ay)ax=p.face;}
  const n=Math.hypot(ax,ay);p.aimX=ax/n;p.aimY=ay/n;
  p.shoot=!!I.h.shoot&&p.dash<=0&&p.drillDash<=0&&!L.noShoot;const h=handPos(p),wid=curW(p),w=WEAPONS[wid];
  if(p.shoot&&!w.hold&&p.cool<=0){w.fire(L,p,h,p.aimX,p.aimY);p.flashT=.06;sfx('shot',wid);if(rand()<.35)L.fx.push({k:'spark',x:h.x,y:h.y,vx:p.aimX*200+(rand()-.5)*120,vy:p.aimY*200+(rand()-.5)*120,life:.12,max:.12,r:3,col:'#fff3b0'});}
  holdWeapon(L,p,dt,h,wid);if(I.p.ex&&p.dash<=0&&!L.noShoot)tryEX(L,p,h);
  p.anim+=dt*(p.ground&&Math.abs(p.vx)>1?13:2);if(p.ground&&Math.abs(p.vx)>1&&p.dash<=0){p.runFx-=dt;if(p.runFx<=0){p.runFx=.2;L.fx.push({k:'puff',x:p.x-p.face*12,y:p.y-4,vx:-p.face*50,vy:-30,life:.3,max:.3,r:4+rand()*3,col:C.paper});}}
  if(p.starT>0&&rand()<.5)L.fx.push({k:'spark',x:p.x+(rand()-.5)*40,y:p.y-20-rand()*60,vx:0,vy:-60,life:.4,max:.4,r:3,col:['#ff6b6b','#ffe27a','#7bd389','#6fb7ff','#d38bff'][Math.floor(rand()*5)]});collide(L,p,dt);}
function planeUpdate(L,p,dt,I){ptimers(p,dt);if(p.dead){ghostUpd(L,p,dt);return;}
  if(hasCharm(p,'cafe'))p.cards=Math.min(5,p.cards+dt/14);superTick(L,p,dt);
  p.small=!!I.h.dash;const sp=p.small?470:330;const mx=(I.h.right?1:0)-(I.h.left?1:0),my=(I.h.down?1:0)-(I.h.up?1:0),n=Math.hypot(mx,my)||1,k=1-Math.pow(.0005,dt);
  p.vx=lerp(p.vx,mx/n*sp,k);p.vy=lerp(p.vy,my/n*sp,k);p.x=clamp(p.x+p.vx*dt,30,W-40);p.y=clamp(p.y+p.vy*dt,30,H-30);p.tilt=lerp(p.tilt,p.vy/sp*.35,.2);p.anim+=dt;
  if(I.p.jump){const o=findParry(L,p);if(o)doParry(L,p,o);else p.parryWin=hasCharm(p,'imanparry')?.45:.32;}
  p.shoot=!!I.h.shoot&&!(p.superT>0&&p.superK==='chispazo');
  if(typeof planeWeapons==='function'&&planeWeapons(L,p,I)){}
  else{if(p.shoot&&p.cool<=0){p.cool=p.small?.07:.09;p.flashT=.05;B_(L,p,{x:p.x+32,y:p.y+3,vx:1100,vy:(rand()-.5)*50,r:p.small?5:7,dmg:p.small?.55:1,life:1,k:'chispa'});sfx('shot','chispa');}
  if(I.p.ex){if(p.cards>=5)startSuper(L,p);else if(p.cards>=1&&p.exT<=0){p.cards--;L.exs++;p.exT=.4;B_(L,p,{x:p.x+30,y:p.y,vx:300,vy:0,acc:1400,r:20,dmg:10,life:1.6,k:'ex',pierce:true});sfx('ex');}}}
  collide(L,p,dt);}
function drawPlayers(L){for(const p of L.Ps){
  if(p.dead){if(p.ghost&&!p.ghost.gone)drawGhost(p.char,p.ghost.x,p.ghost.y,L.t,p.eq.skin,p.type);continue;}
  if(p.dash>0&&hasCharm(p,'fantasma')&&p.type==='plat')continue;
  if(p.inv>0&&!(p.starT>0)&&Math.floor(p.inv*18)%2===0&&L.state==='play'&&p.superT<=0)continue;
  if(p.starT>0){const c0=pCenter(p),hue=(L.t*400)%360;ctx.save();ctx.globalAlpha=.35+.15*Math.sin(L.t*20);ctx.fillStyle=`hsl(${hue},90%,65%)`;ctx.beginPath();ctx.arc(c0.x,c0.y,52,0,TAU);ctx.fill();ctx.restore();}
  let io=null;if(L.state==='intro'){io=introHero(L,p);ctx.save();if(io.dx)ctx.translate(io.dx,0);if(p.type==='plat'){ctx.translate(p.x,p.y+io.dy);ctx.rotate(io.rot);ctx.scale(io.sx,io.sy);ctx.translate(-p.x,-p.y);}}
  if(p.trail&&p.type==='plat')for(const g of p.trail){ctx.save();ctx.globalAlpha=.35*(1-g.t/.22);drawHero({x:g.x,y:g.y,char:p.char,face:p.face,anim:p.anim,dash:true,aimX:p.aimX,aimY:p.aimY});ctx.restore();}
  if(p.type==='plane')drawPlaneHero({x:p.x,y:p.y,char:p.char,small:p.small,tilt:p.tilt,spin:p.spin,anim:p.anim,flash:p.flashT>0,vx:p.vx,vy:p.vy,hurt:p.hurtT>0,skin:p.eq.skin,exPose:p.exPose||0,superPose:p.superPose||0,shoot:p.shoot,meteor:p.meteor});
  else drawHero({x:p.x,y:p.y,char:p.char,face:p.face,anim:p.anim,run:p.ground&&Math.abs(p.vx)>1&&p.dash<=0,air:!p.ground,vy:p.vy,duck:p.duck,shoot:p.shoot,aimX:p.aimX,aimY:p.aimY,
    hurt:p.hurtT>0,dash:p.dash>0||p.drillDash>0,spin:p.spin,skin:p.eq.skin,ghostDash:p.dash>0&&hasCharm(p,'fantasma'),ball:p.jumped&&!p.ground&&!(p.dash>0)&&!(p.hurtT>0)?p.ballA:null,land:p.landT,flash:p.flashT>0||(io&&io.pose==='flex'&&Math.floor(L.t*8)%2===0),
    exPose:p.exPose||0,superPose:p.superPose||0,superK:p.superK,
    ...(io&&io.pose==='flex'?{aimX:0,aimY:-1,run:false,air:false}:{}),...(io&&io.dy<-5?{air:true}:{}),...(typeof heroExtra==='function'?heroExtra(L,p,io):{})});
  if(io)ctx.restore();
  const c=pCenter(p);
  if(p.shield>0){ctx.globalAlpha=.55+Math.sin(L.t*10)*.1;circ(c.x,c.y,64,'rgba(200,235,240,.35)',3);ctx.globalAlpha=1;}
  for(const s of p.saws){ctx.save();ctx.translate(s.x,s.y);ctx.rotate(L.t*25);star(0,0,13,9,10);ctx.fillStyle=C.steel;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();circ(0,0,3,C.ink,0);ctx.restore();}
  if(p.type==='plat'&&p.shoot&&curW(p)==='taladro'){const h=handPos(p);ctx.save();ctx.translate(h.x,h.y);ctx.rotate(Math.atan2(p.aimY,p.aimX));poly([[0,-12],[128,0],[0,12]],C.steel,3);
    for(let i=0;i<5;i++)line(10+i*24+(L.t*300)%24,-10+i*2,22+i*24+(L.t*300)%24,10-i*2,2);ctx.restore();}
  if(p.chargeT>0&&p.type==='plat'){const h=handPos(p),k=Math.min(1,p.chargeT/.62);ctx.save();ctx.globalAlpha=.5+.3*Math.sin(L.t*30);circ(h.x,h.y,6+k*14,p.chargeOk?'#ffe27a':'#fff3b0',p.chargeOk?3:0);ctx.restore();}
  if(p.swapT>0&&p.type==='plat'){ctx.globalAlpha=Math.min(1,p.swapT*2);txt(WEAPONS[curW(p)].name,p.x,p.y-108,15,C.paper);ctx.globalAlpha=1;}
  if(p.parryWin>0){ctx.beginPath();ctx.arc(c.x,c.y,reachOf(p)+12,0,TAU);ctx.lineWidth=2;ctx.strokeStyle='rgba(46,196,182,.6)';ctx.stroke();}
  if(L.Ps.length>1){txt('J'+(p.i+1),p.x,(p.type==='plane'?p.y-40:p.y-104),12,PCOL[p.i]);}}}
function drawBullets(L){for(const b of L.bul){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));
  if(b.draw){ctx.restore();ctx.save();b.draw(b,L);}else if(b.k==='ex'||b.k==='bomba'||b.k==='magnet'||b.big&&b.k!=='luci'&&b.k!=='tack'){const r=b.r;ctx.rotate(L.t*8);circ(0,0,r+10,'rgba(255,226,122,.35)',0);star(0,0,r,r*.55,8);
    ctx.fillStyle=b.k==='bomba'?C.rust:b.k==='magnet'?C.parry:'#ffe27a';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();circ(0,0,r*.35,'#fffbe6',0);}
  else if(b.k==='luci'){const s=b.big?1.5:1;circ(0,0,11*s,'rgba(200,240,120,.35)',0);ell(0,0,7*s,5*s,'#d7f27a',2);ell(-3,-5*s,4*s,2.5*s,'rgba(255,255,255,.7)',0,-.5+Math.sin(L.t*40)*.4);}
  else if(b.k==='rebote')circ(0,0,b.r,C.rust,2.5);
  else if(b.k==='tack'){const s=b.big?2:1;poly([[-8*s,-5*s],[-8*s,5*s],[-2*s,0]],C.rust,2);line(-2*s,0,10*s,0,2.5);}
  else if(b.k==='bubble')circ(0,0,b.r,'rgba(200,235,240,.5)',2.5);
  else if(b.k==='saw'||b.k==='bigsaw'){ctx.rotate(L.t*25);star(0,0,b.r,b.r*.7,10);ctx.fillStyle=C.steel;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}
  else{ell(-6,0,16,5,'rgba(255,226,122,.45)',0);ell(0,0,10,6,b.k==='abanico'?'#ffc46a':b.own&&b.own.char==='cerilla'?'#ffb35a':'#ffe27a',2.2);ell(2,-1,4,2,'#fffbe6',0);}
  ctx.restore();}
  for(const t of L.tacks){const c=t.en.center();ctx.save();ctx.translate(c.x+t.dx,c.y+t.dy);circ(0,0,t.big?10:5,Math.floor(L.t*10)%2?C.rust:C.gold,2);ctx.restore();}
  for(const a of L.arcs){ctx.beginPath();a.pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineWidth=a.big?9:6;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=a.big?5:3;ctx.strokeStyle=a.fizz?'#d8c8f0':'#fff6a8';ctx.stroke();}
  for(const bm of L.beams){if(bm.char&&typeof drawBeamStyled==='function'){drawBeamStyled(bm,L);continue;}const x0=bm.x,x1=bm.dir>0?L.camX+W+40:L.camX-40,hh=34+Math.sin(L.t*50)*4;ctx.save();ctx.globalAlpha=Math.min(1,bm.t*4);
    ctx.fillStyle='rgba(255,226,122,.35)';ctx.fillRect(Math.min(x0,x1),bm.y-hh-10,Math.abs(x1-x0),2*hh+20);ctx.beginPath();ctx.moveTo(x0,bm.y-hh);
    for(let x=0;x<=Math.abs(x1-x0);x+=24)ctx.lineTo(x0+bm.dir*x,bm.y-hh+Math.sin(x*.1+L.t*40)*5);for(let x=Math.abs(x1-x0);x>=0;x-=24)ctx.lineTo(x0+bm.dir*x,bm.y+hh+Math.sin(x*.1+L.t*40+2)*5);
    ctx.closePath();ctx.fillStyle='#fff3b0';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}}

/* ---------- enemies & minions (shared by bosses and run levels) ---------- */
function mkEnt(L,o){const e=Object.assign({hp:3,r:20,flash:0,dead:false,t:0,face:-1,vx:0,vy:0},o);
  e.center=()=>({x:e.x,y:e.y});e.hitBy=(x,y,r)=>!e.dead&&!e.hidden&&Math.hypot(x-e.x,y-e.y)<e.r+r;
  e.damage=d=>{if(e.dead||e.hidden)return;e.hp-=d;e.flash=.06;sfx('hit');if(e.hp<=0){e.dead=true;if(e.ai!=='mini')L.kills=(L.kills||0)+1;boom(L,e.x,e.y,26);puff(L,e.x,e.y,6);stars(L,e.x,e.y);sfx('pop');}};
  e.contact=pb=>!e.dead&&!e.hidden&&circRect(e.x,e.y,e.r*.8,pb.x,pb.y,pb.w,pb.h);L.ents.push(e);return e;}
function fireAt(L,e,p,s){const c=aimPt(p),a=Math.atan2(c.y-e.y,c.x-e.x);L.shotN=(L.shotN||0)+1;spawnEB(L,{k:'shot',x:e.x+Math.cos(a)*20,y:e.y+Math.sin(a)*20,vx:Math.cos(a)*(s.spd||260),vy:Math.sin(a)*(s.spd||260),r:s.r||10,spr:s.spr||'ball',parry:L.shotN%3===0});}
function updEnemies(L,dt){
  for(const e of L.ents){if(e.dead||e.boss)continue;e.t+=dt;e.flash=Math.max(0,e.flash-dt);const p=nearestP(L,e.x,e.y);if(!p)continue;const pc=aimPt(p);
    switch(e.ai){
      case 'walker':{if(!e.active){if(Math.abs(e.x-p.x)<W*.8){e.active=true;e.face=p.x<e.x?-1:1;}break;}const nx=e.x+e.face*e.spd*dt,fl=L.floorAt(nx+e.face*16);
        if(fl!==e.gy||nx<L.minX-20||nx>L.maxX+20)e.face*=-1;else e.x=nx;e.y=e.gy-e.r;if(e.shoots){e.cool-=dt;if(e.cool<=0&&Math.abs(e.x-p.x)<600){e.cool=e.shoots.rate||2;fireAt(L,e,p,e.shoots);}}break;}
      case 'flyer':{e.x+=e.vx*dt;e.y=e.by+Math.sin(e.t*3)*28;e.drop-=dt;if(e.drop<=0&&Math.abs(e.x-p.x)<150){e.drop=1.8;L.eggN=(L.eggN||0)+1;spawnEB(L,{k:'grav',x:e.x,y:e.y+14,vx:e.vx*.3,vy:40,g:900,r:11,spr:e.ammo||'ball',parry:L.eggN%3===0});}
        if(e.x<L.camX-140)e.dead=true;break;}
      case 'turret':{e.aim=Math.atan2(pc.y-e.y,pc.x-e.x);if(Math.abs(e.x-p.x)<W*.7){e.cool-=dt;if(e.cool<=0){e.cool=e.rate||2.2;e.n=(e.n||0)+1;const a=e.aim;
        spawnEB(L,{k:'shot',x:e.x+Math.cos(a)*30,y:e.y+Math.sin(a)*30,vx:Math.cos(a)*300,vy:Math.sin(a)*300,r:12,spr:e.ammo||'ball',parry:e.n%3===0});sfx('knock');puff(L,e.x+Math.cos(a)*30,e.y+Math.sin(a)*30,3);}}break;}
      case 'popper':{const near=Math.abs(e.x-p.x)<240;if(e.state!=='up'){e.pop=Math.max(0,(e.pop||0)-dt*3);e.cool=(e.cool||0)-dt;if(near&&e.cool<=0){e.state='up';e.st=0;sfx('pop');}}
        else{e.pop=Math.min(1,(e.pop||0)+dt*4);e.st+=dt;if(e.st>.45&&!e.thrown){e.thrown=true;const T=1;L.popN=(L.popN||0)+1;
          spawnEB(L,{k:'grav',x:e.x,y:e.y-40,vx:clamp((p.x-e.x)/T,-420,420),vy:-640,g:1300,r:11,spr:e.ammo||'ball',parry:L.popN%2===0});sfx('throw');}if(e.st>1.7){e.state='hide';e.cool=1.4;e.thrown=false;}}
        e.hidden=(e.pop||0)<.35&&e.skin!=='caja';break;}
      case 'hopper':{e.vy+=1800*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;const fl=L.floorAt(e.x);if(e.y>fl-e.r){e.y=fl-e.r;e.vy=0;e.vx=0;e.wait-=dt;if(e.wait<=0){e.wait=.7+rand()*.4;e.vy=-620;e.face=p.x<e.x?-1:1;e.vx=e.face*200;}}if(e.y>H+100)e.dead=true;break;}
      case 'homer':{const a=Math.atan2(pc.y-e.y,pc.x-e.x);e.x+=Math.cos(a)*e.spd*dt;e.y+=Math.sin(a)*e.spd*dt+Math.sin(e.t*4)*20*dt;e.face=Math.cos(a)<0?-1:1;
        if(e.shoots){e.cool-=dt;if(e.cool<=0){e.cool=e.shoots.rate||1.8;fireAt(L,e,p,e.shoots);}}break;}
      case 'diver':{if(e.state==='in'){const tx=pc.x,ty=Math.max(90,pc.y-220);e.x=lerp(e.x,tx,dt*2);e.y=lerp(e.y,ty,dt*2);e.st=(e.st||0)+dt;if(e.st>1.3){e.state='dive';e.tx=pc.x;e.ty=pc.y;sfx('caw');}}
        else if(e.state==='dive'){const a=Math.atan2(e.ty-e.y,e.tx-e.x);e.x+=Math.cos(a)*560*dt;e.y+=Math.sin(a)*560*dt;e.face=Math.cos(a)<0?-1:1;if(dist(e.x,e.y,e.tx,e.ty)<20){e.state='out';}}
        else{e.y-=360*dt;e.x+=e.face*200*dt;if(e.y<-60)e.dead=true;}break;}
    }}}

/* ---------- boss framework ---------- */
function anc(B,n){if(n==='__feet')return{x:B.x,y:GROUND};const a=B.def.anchor&&B.def.anchor(B,n);return a||B.center();}
function tgt(L,B){const al=alive(L);if(!al.length)return L.Ps[0];B.ti=(B.ti||0)+1;return al[B.ti%al.length];}
const ATK={
  aimed(L,B,a){const o=anc(B,a.from),t=aimPt(tgt(L,B)),a0=Math.atan2(t.y-o.y,t.x-o.x)+(a.offset||0),n=a.n||1,sps=a.speeds||[a.spd||300];
    for(let i=0;i<n;i++)for(const sp of sps){const an=a0+(i-(n-1)/2)*(a.spread||0);B.pc++;spawnEB(L,{k:'shot',x:o.x+Math.cos(an)*(a.rad||0),y:o.y+Math.sin(an)*(a.rad||0),vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,
      r:a.r||13,spr:a.spr,wob:a.wob||0,parry:!!a.parry&&B.pc%a.parry===0,ch:a.chars?pick(a.chars):undefined,turn:a.turn,life:a.life,spd:sp});}
    if(a.from==='hand')B.throwT=.35;sfx(a.sfx||'throw');},
  lob(L,B,a){const o=anc(B,a.from),t=aimPt(tgt(L,B)),n=a.n||1;for(let i=0;i<n;i++){const T=(a.T||1.3)*(1+i*.25),vy=(a.vy||-640)*(1-i*.08);
      const vx=clamp((t.x-o.x)/T,-620,620)*(1+i*.15)+(a.jit?(rand()-.5)*a.jit:0);B.pc++;
      spawnEB(L,{k:'grav',x:o.x,y:o.y,vx,vy,g:a.g||1500,r:a.r||14,spr:a.spr,bounce:a.bounce||0,parry:!!a.parry&&B.pc%a.parry===0,puddle:a.puddle,ch:a.chars?pick(a.chars):undefined});}
    if(a.from==='hand')B.throwT=.35;B.pop=.4;sfx('throw');},
  roller(L,B,a){const o=anc(B,a.from),t=tgt(L,B),dir=a.fwd?B.face:(t.x<o.x?-1:1);B.pc++;spawnEB(L,{k:'roll',x:o.x,y:GROUND-(a.r||24),vx:dir*(a.spd||380),r:a.r||24,spr:a.spr,hop:a.hop||0,vy:a.hop?-a.hop:0,parry:!!a.parry&&B.pc%a.parry===0});sfx(a.sfx||'knock');},
  wave(L,B,a){const o=anc(B,a.from),t=tgt(L,B),dirs=a.both?[-1,1]:[a.fwd?B.face:(t.x<o.x?-1:1)];for(const d of dirs)spawnEB(L,{k:'wave',x:o.x+d*20,y:GROUND,vx:d*(a.spd||430),w:42,h:a.h||40,spr:a.spr});},
  rain(L,B,a){const t=tgt(L,B),n=a.n||1;for(let i=0;i<n;i++){const x=a.track?t.x+(rand()-.5)*a.track*2:(a.xmin??60)+rand()*((a.xmax??W-60)-(a.xmin??60)),sp=Array.isArray(a.spd)?lerp(a.spd[0],a.spd[1],rand()):(a.spd||260);B.pc++;
    spawnEB(L,{k:'shot',x:clamp(x,30,W-30),y:-20-i*40,vx:0,vy:sp,r:a.r||12,spr:a.spr,sway:a.sway||0,parry:!!a.parry&&B.pc%a.parry===0,puddle:a.puddle,ch:a.chars?pick(a.chars):undefined,fall:true});}},
  column(L,B,a){const n=a.n||1;for(let i=0;i<n;i++)B.queue.push({t:i*(a.gap??.5),fn:()=>{const t=tgt(L,B);let x=t.x;if(a.spread&&i>0)x+=(i%2?-1:1)*a.spread;x=clamp(x,a.xmin??50,a.xmax??W-50);
    spawnEB(L,{k:'column',x,warn:a.warn||.7,act:a.act||.35,w:a.w||30,style:a.style||'needle',full:L.kind==='plane'||!!a.full});sfx('warn');}});},
  sweep(L,B,a){B.alt=(B.alt||0)+1;const low=a.alt?B.alt%2===0:!!a.low,plane=L.kind==='plane',y=plane?clamp(aimPt(tgt(L,B)).y,60,H-60):(low?GROUND-18:GROUND-58);
    spawnEB(L,{k:'sweep',y,h:plane?64:(low?28:30),warn:a.warn||.85,act:a.act||.45,style:a.style||'light',low,dir:B.face});sfx('warn');},
  ring(L,B,a){const o=anc(B,a.from),n=a.n||10;B.ringOff=(B.ringOff||0)+.35;for(let i=0;i<n;i++){const an=B.ringOff+i*TAU/n;B.pc++;
    spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:Math.cos(an)*(a.spd||230),vy:Math.sin(an)*(a.spd||230),r:a.r||12,spr:a.spr,parry:!!a.parry&&B.pc%a.parry===0,ch:a.chars?pick(a.chars):undefined});}sfx(a.sfx||'pop');},
  spiral(L,B,a){B.emitters.push({t:a.dur||2,rate:a.rate||.1,acc:0,ang:rand()*TAU,step:a.step||.45,spd:a.spd||230,spr:a.spr,r:a.r||11,from:a.from,arms:a.arms||1,parry:a.parry});},
  minion(L,B,a){if(L.ents.filter(e=>!e.dead&&e.tag===B).length>=(a.max||3))return;const o=anc(B,a.from),p=tgt(L,B);
    const e=mkEnt(L,{tag:B,ai:a.ai,skin:a.skin,hp:a.hp||2,r:a.r||20,x:o.x,y:o.y,spd:a.spd||140,face:p.x<o.x?-1:1,active:true,gy:GROUND,cool:1+rand(),shoots:a.shoots,wait:.3,state:'in',by:o.y,drop:1,ammo:a.ammo});
    if(a.ai==='walker'||a.ai==='hopper'){e.y=GROUND-e.r;e.x=clamp(o.x,40,W-40);}if(a.ai==='flyer')e.vx=-(a.spd||170);sfx('pop');puff(L,e.x,e.y,4);},
  bouncer(L,B,a){if(L.eb.filter(e=>e.k==='bounce').length>=(a.max||2))return;const o=anc(B,a.from),an=-Math.PI*.5-.5-rand()*.8;
    spawnEB(L,{k:'bounce',x:o.x,y:o.y,vx:Math.cos(an)*(a.spd||300)*(B.face<0?1:-1),vy:Math.sin(an)*(a.spd||300),r:a.r||20,spr:a.spr,life:a.life||6});},
  boomer(L,B,a){const o=anc(B,a.from),t=aimPt(tgt(L,B));B.pc++;spawnEB(L,{k:'boomer',x:o.x,y:o.y,ox:o.x,oy:o.y,tx:t.x,ty:t.y,T:a.T||1,r:a.r||16,spr:a.spr,parry:!!a.parry&&B.pc%a.parry===0,boss:B,from:a.from});sfx('throw');},
  charge(L,B,a){B.act={type:'charge',t:0,warn:a.warn||.85,spd:a.spd||720,dir:B.x>W/2?-1:1};sfx('warn');},
  leap(L,B,a){const t=tgt(L,B),tx=a.side?(B.x>W/2?(a.minx||200):(a.maxx||W-200)):clamp(t.x,a.minx||190,a.maxx||W-190);B.act={type:'leap',vy:a.vy||-1100,vx:(tx-B.x)/(a.T||1),gy:B.y,landWave:a.landWave};B.squash=-.25;sfx('throw');},
  tele(L,B,a){B.act={type:'tele',t:0,nx:(a.minx||200)+rand()*((a.maxx||W-200)-(a.minx||200))};const c=B.center();puff(L,c.x,c.y,12,C.white);sfx('magic');},
  wall(L,B,a){const gap=80+rand()*(H-260),gh=a.gap||150;for(let y=24;y<H;y+=a.step||40){if(y>gap&&y<gap+gh)continue;spawnEB(L,{k:'shot',x:W+30,y,vx:-(a.spd||220),vy:0,r:a.r||15,spr:a.spr});}},
  wind(L,B,a){const d=a.dir||(rand()<.5?-1:1);L.wind={t:a.dur||2.5,f:d*(a.force||150)};sfx('dash');pop(L,W/2,130,d<0?'¡VIENTO! ←':'→ ¡VIENTO!',C.paper);},
  dark(L,B,a){L.dark={t:a.dur||4,tot:a.dur||4};sfx('laugh');},
  fountain(L,B,a){const o=anc(B,a.from);for(let i=0;i<(a.n||5);i++){B.pc++;spawnEB(L,{k:'grav',x:o.x,y:o.y,vx:-(80+rand()*260),vy:-(420+rand()*320),g:a.g||900,r:a.r||10,spr:a.spr||'drop',parry:!!a.parry&&B.pc%a.parry===0});}sfx('splash');},
};
function updAct(L,B,dt){const a=B.act;a.t=(a.t||0)+dt;
  if(a.type==='charge'){if(a.t<a.warn){B.shk=Math.sin(a.t*60)*3;return;}B.shk=0;B.x+=a.dir*a.spd*dt;const m=a.m||B.def.margin||170,lim=a.dir>0?W-m:m;if(rand()<.5)puff(L,B.x-a.dir*60,GROUND,1);
    if((a.dir>0&&B.x>=lim)||(a.dir<0&&B.x<=lim)){B.x=lim;B.face=a.dir>0?-1:1;B.act=null;shake(L,8);sfx('stomp');}}
  else if(a.type==='leap'){a.vy+=2200*dt;B.x+=a.vx*dt;B.y+=a.vy*dt;if(B.y>=a.gy&&a.vy>0){B.y=a.gy;B.act=null;B.squash=.3;shake(L,20);sfx('stomp');puff(L,B.x-60,GROUND,6);puff(L,B.x+60,GROUND,6);
    if(a.landWave)ATK.wave(L,B,{from:'__feet',both:true,spd:430});if(B.def.faceTarget){const tp=nearestP(L,B.x,B.y);if(tp)B.face=tp.x<B.x?-1:1;}}}
  else if(a.type==='tele'){if(a.t>.35&&!a.moved){a.moved=true;B.x=a.nx;B.hidden=false;const c=B.center();puff(L,c.x,c.y,12,C.white);}else if(!a.moved)B.hidden=true;if(a.t>.6)B.act=null;}}
function defBoss(o){LEVELS[o.id]=Object.assign({kind:'boss',create:()=>makeBossLevel(o)},o);}
function makeBossLevel(def){const L=baseLevel(def.id),plane=def.kind==='plane';
  L.floorAt=plane?()=>Infinity:()=>GROUND;if(!plane){L.solids=[{x:-200,y:GROUND,w:W+400,h:200,ground:true}];(def.plats||[]).forEach(([x,y,w])=>L.solids.push({x,y,w,h:14,oneWay:true}));}
  addPlayers(L,plane?'plane':'plat',plane?170:190,plane?240:GROUND);
  const mult=(cfg.diff==='facil'?.75:cfg.diff==='experto'?1.3:1)*(1+.45*(L.Ps.length-1));
  const B={boss:true,keep:true,def,pace:({1:1.18,2:1.07,3:1}[def.isl]||1)*(cfg.diff==='facil'?1.25:cfg.diff==='experto'?.85:1),hp:def.hp*mult,max:def.hp*mult,phase:0,t:0,x:def.x??740,y:def.y??GROUND,flash:0,dead:false,timers:[],act:null,anim:0,mouth:0,emitters:[],queue:[],pc:0,face:-1,squash:0,v:{},ti:0,shk:0};
  B.center=()=>def.center?def.center(B):{x:B.x,y:B.y-150};B.shapes=()=>B.hidden?[]:def.shapes(B);
  B.hitBy=(x,y,r)=>!B.dead&&B.shapes().some(s=>s.w!==undefined?circRect(x,y,r,s.x,s.y,s.w,s.h):Math.hypot(x-s.x,y-s.y)<s.r+r);
  B.damage=d=>{if(B.dead||B.hidden)return;B.hp=Math.max(0,B.hp-d);B.flash=.06;if(B.hp<=0)bossDown(L,B);};
  B.contact=pb=>!B.dead&&B.shapes().some(s=>s.w!==undefined?rectHit(pb,{x:s.x+4,y:s.y+4,w:Math.max(0,s.w-8),h:Math.max(0,s.h-8)}):circRect(s.x,s.y,s.r*.88,pb.x,pb.y,pb.w,pb.h));
  if(def.setup)def.setup(B,L);setPhase(L,B,0,true);L.boss=B;L.ents.push(B);
  L.update=dt=>bossUpdate(L,B,dt);L.idle=dt=>{if(B.phaseT>0)B.phaseT=Math.max(0,B.phaseT-dt);B.t+=dt;B.anim+=dt;if(def.move)def.move(B,dt,L);if(L.clouds)scrollClouds(L,dt);};L.drawWorld=()=>def.draw(B,L);L.progress=()=>1-B.hp/B.max;
  if(plane){L.clouds=[];for(let i=0;i<14;i++)L.clouds.push({x:rand()*W*1.3,y:rand()*H,s:.4+rand()*.8,l:i%3});L.drawBG=()=>drawPlaneBG(L,def.arena);L.drawFG=()=>planeFG(L,def.arena);}
  else{L.bg=arenaBG(def.arena);L.drawBG=()=>ctx.drawImage(L.bg,0,0,W,H);if(def.fg==='curtains')L.drawFG=()=>ctx.drawImage(curtainsLayer(),0,0,W,H);}
  setupArena(L,B,def,plane);L.intro=def.intro||'¡A LA CARGA!';return L;}
function setPhase(L,B,i,first){B.phase=i;const ph=B.def.phases[i];B.timers=ph.atk.map(a=>a.delay??a.every*.6);B.emitters=[];B.queue=[];
  if(!first){L.eb=L.eb.filter(e=>e.k==='pstar');for(const e of L.ents)if(!e.boss)e.dead=true;if(ph.banner)banner(L,ph.banner,1.8);shake(L,16);sfx('phaseHit');sfx('laugh');B.phaseT=1;L.phaseFade=0;L.flash=.25;const cc=B.center();stars(L,cc.x,cc.y,12);puff(L,cc.x,cc.y,12);B.act=null;B.hidden=false;
    if(B.y!==(B.def.y??GROUND)&&B.def.kind!=='plane')B.y=B.def.y??GROUND;if(B.def.onPhase)B.def.onPhase(B,L,i);const np=B.def.phases.length;if(i===np-1&&np>=3)sfx('announceFinal');if(typeof musicPhase==='function')musicPhase(L.id,i,np);}}
function bossUpdate(L,B,dt){const def=B.def;arenaTick(L,B,dt);B.t+=dt;B.anim+=dt;B.flash=Math.max(0,B.flash-dt);B.mouth=Math.max(0,B.mouth-dt*3);B.ring=Math.max(0,(B.ring||0)-dt);
  B.throwT=Math.max(0,(B.throwT||0)-dt);B.pop=Math.max(0,(B.pop||0)-dt);B.squash*=Math.pow(.0005,dt);if(L.clouds)scrollClouds(L,dt);
  const n=def.phases.length,idx=Math.min(n-1,Math.floor((1-B.hp/B.max)*n));if(idx>B.phase)setPhase(L,B,idx);
  if(B.act)updAct(L,B,dt);else if(def.move)def.move(B,dt,L);
  for(const q of B.queue){q.t-=dt;if(q.t<=0){q.done=true;q.fn();}}B.queue=B.queue.filter(q=>!q.done);
  for(const em of B.emitters){em.t-=dt;em.acc+=dt;while(em.acc>=em.rate){em.acc-=em.rate;em.ang+=em.step;const o=anc(B,em.from);for(let k=0;k<em.arms;k++){const a=em.ang+k*TAU/em.arms;B.pc++;
    spawnEB(L,{k:'shot',x:o.x,y:o.y,vx:Math.cos(a)*em.spd,vy:Math.sin(a)*em.spd,r:em.r,spr:em.spr,parry:!!em.parry&&B.pc%em.parry===0});}}}
  B.emitters=B.emitters.filter(e=>e.t>0);
  const atks=def.phases[B.phase].atk;for(let i=0;i<atks.length;i++){const a=atks[i];if(B.act&&!a.noAct)continue;B.timers[i]-=dt;
    if(B.timers[i]<=0){B.timers[i]=a.every*B.pace*(.9+rand()*.2);try{ATK[a.f](L,B,a);}catch(err){}if(a.mouth!==false)B.mouth=1;if(a.snd)sfx(a.snd);if(a.ring){B.ring=.55;sfx('ring');}}}}
function bossDown(L,B){if(B.dead)return;B.dead=true;B.act=null;B.hidden=false;B.emitters=[];L.state='ko';L.stateT=0;L.eb=L.eb.filter(e=>e.k==='pstar');for(const e of L.ents)if(!e.boss)e.dead=true;L.beams=[];
  if(B.def.kind!=='plane')B.y=B.def.y??GROUND;banner(L,'¡NOCAUT!',2.6);shake(L,24);Music.stop();sfx('ko');sfx('koToon');B.koT=0;}
function lookAt(L,x,y){const p=nearestP(L,x,y)||L.Ps[0];const c=aimPt(p);return{x:clamp((c.x-x)/300,-1,1),y:clamp((c.y-y)/300,-1,1)};}
function bossFace(B,L,x,y,s,o={}){face(x,y,s,Object.assign({look:lookAt(L,x,y),dead:B.dead,ang:.18+B.phase*.12,open:B.dead?.8:Math.max(B.mouth*.8,o.open??.2)},o));}
function koStars(B,L,x,y){if(B.dead)for(let i=0;i<3;i++){const a=L.t*4+i*2.1;txt('★',x+Math.cos(a)*60,y+Math.sin(a)*12,22,C.brass);}}
function flashOver(B,x,y,r){if(B.flash>0)circ(x,y,r,'rgba(255,250,235,.45)',0);}

/* ---------- arenas ---------- */
let ARENA={k:null,c:null},CURT=null;
function skyG(g,c1,c2,h=GROUND){const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.fillRect(0,0,W,h);}
function raysG(g,x,y,col,n=32){g.save();g.translate(x,y);g.fillStyle=col;for(let i=0;i<n;i+=2){const a=i*TAU/n;g.beginPath();g.moveTo(0,0);g.arc(0,0,1400,a,a+TAU/n);g.closePath();g.fill();}g.restore();}
function hillG(g,base,amp,col,f1,f2,ph){g.beginPath();g.moveTo(0,GROUND);for(let x=0;x<=W;x+=8)g.lineTo(x,base-Math.sin(x*f1+ph)*amp-Math.sin(x*f2)*amp*.4);g.lineTo(W,GROUND);g.closePath();g.fillStyle=col;g.fill();g.lineWidth=3.5;g.strokeStyle=C.ink;g.stroke();}
function floorG(g,kind,c1,c2){g.fillStyle=c1;g.fillRect(0,GROUND,W,H-GROUND);g.strokeStyle='rgba(20,13,8,.5)';g.lineWidth=2;
  if(kind==='planks'){for(let y=GROUND+20,r=0;y<H;y+=22,r++){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();for(let x=(r%2)*70;x<W;x+=140){g.beginPath();g.moveTo(x,y-22);g.lineTo(x,y);g.stroke();}}}
  else if(kind==='tiles'){for(let y=GROUND,r=0;y<H;y+=24,r++)for(let x=(r%2)*40;x<W;x+=80){g.fillStyle=c2;g.fillRect(x,y,40,24);}}
  else if(kind==='stone'){for(let y=GROUND,r=0;y<H;y+=22,r++)for(let x=(r%2)*30;x<W;x+=60){g.strokeRect(x,y,60,22);}}
  else if(kind==='sand'){g.fillStyle=c2;for(let i=0;i<200;i++)g.fillRect((i*137)%W,GROUND+((i*71)%(H-GROUND)),3,2);}
  else if(kind==='grate'){for(let x=0;x<W;x+=18){g.beginPath();g.moveTo(x,GROUND);g.lineTo(x,H);g.stroke();}g.beginPath();g.moveTo(0,GROUND+40);g.lineTo(W,GROUND+40);g.stroke();}
  else if(kind==='dirt'){g.fillStyle=c2;for(let i=0;i<120;i++){g.beginPath();g.ellipse((i*173)%W,GROUND+10+((i*53)%(H-GROUND-10)),6,3,0,0,TAU);g.fill();}}
  g.fillStyle='rgba(255,230,180,.12)';g.fillRect(0,GROUND+3,W,6);g.lineWidth=5;g.strokeStyle=C.ink;g.beginPath();g.moveTo(0,GROUND);g.lineTo(W,GROUND);g.stroke();}
function starsG(g,n=60,seed=7){const r=srand(seed);g.fillStyle='rgba(255,245,210,.8)';for(let i=0;i<n;i++){const x=r()*W,y=r()*GROUND*.7,s=r()*2+1;g.beginPath();g.arc(x,y,s,0,TAU);g.fill();}}
function shelfBooks(g,x,y,w,h,seed){const r=srand(seed);g.fillStyle=C.woodD;g.fillRect(x,y,w,h);g.strokeStyle=C.ink;g.lineWidth=3;g.strokeRect(x,y,w,h);
  for(let sy=y+10;sy<y+h-10;sy+=56){let bx=x+8;while(bx<x+w-14){const bw=8+r()*12,bh=30+r()*18;g.fillStyle=['#7a3b2e','#3b5a7a','#6f7a45','#b5402f','#c79a5e','#5a4a7a'][Math.floor(r()*6)];g.fillRect(bx,sy+50-bh,bw,bh);g.lineWidth=1.5;g.strokeRect(bx,sy+50-bh,bw,bh);bx+=bw+1;}
    g.fillStyle=C.wood;g.fillRect(x,sy+50,w,6);}}
function paintArena(g,k){
  switch(k){
    case 'cielo':skyG(g,'#ecd8a8','#c9a466');raysG(g,700,330,'rgba(120,78,28,.09)');cloudShape(g,150,120,1);cloudShape(g,430,68,.7);cloudShape(g,640,150,.6);cloudShape(g,800,90,.85);
      hillG(g,GROUND-120,26,'#b8935a',.011,.029,0);hillG(g,GROUND-55,16,'#94713f',.017,.041,2);floorG(g,'planks',C.wood);break;
    case 'teatro':case 'magia':{skyG(g,k==='magia'?'#2f2547':'#4a221b',k==='magia'?'#55406b':'#6b3326');g.save();g.translate(W/2,GROUND+40);g.fillStyle='rgba(230,170,90,.07)';for(let i=0;i<24;i+=2){const a=Math.PI+i*Math.PI/24;g.beginPath();g.moveTo(0,0);g.arc(0,0,900,a,a+Math.PI/24);g.closePath();g.fill();}g.restore();
      if(k==='magia'){starsG(g,40,3);g.fillStyle='rgba(242,193,78,.5)';for(let i=0;i<14;i++){const x=60+i*64,y=80+(i%3)*40;star(x,y,9,4,5,0,g);g.fill();}}
      else{g.strokeStyle='rgba(217,164,65,.35)';g.lineWidth=2;for(let i=0;i<5;i++){g.beginPath();for(let x=0;x<=W;x+=10)g.lineTo(x,110+i*14+Math.sin(x*.008)*30);g.stroke();}}
      for(const sx of[60,W-60]){const g2=g.createLinearGradient(sx,0,W/2,GROUND);g2.addColorStop(0,'rgba(255,235,180,.22)');g2.addColorStop(1,'rgba(255,235,180,0)');g.fillStyle=g2;g.beginPath();g.moveTo(sx-20,0);g.lineTo(sx+20,0);g.lineTo(W/2+(sx<W/2?-60:160),GROUND);g.lineTo(W/2+(sx<W/2?-260:-40),GROUND);g.closePath();g.fill();}
      g.lineWidth=10;g.strokeStyle=C.ink;g.beginPath();g.moveTo(30,GROUND);g.lineTo(30,120);g.quadraticCurveTo(W/2,-40,W-30,120);g.lineTo(W-30,GROUND);g.stroke();g.lineWidth=5;g.strokeStyle=C.brass;g.stroke();
      floorG(g,'planks','#6a3f22');for(let x=40;x<W;x+=60){g.beginPath();g.arc(x,H-6,10,Math.PI,0);g.fillStyle='#ffe9a8';g.fill();g.lineWidth=2.5;g.strokeStyle=C.ink;g.stroke();}break;}
    case 'cocina':{g.fillStyle='#e7dcc2';g.fillRect(0,0,W,GROUND);for(let y=0;y<GROUND;y+=40)for(let x=(y/40%2)*40;x<W;x+=80){g.fillStyle='#d4e0d6';g.fillRect(x,y,40,40);}
      g.strokeStyle='rgba(20,13,8,.15)';g.lineWidth=1;for(let y=0;y<GROUND;y+=40){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
      g.fillStyle='#bfe0e8';g.fillRect(90,70,200,150);g.lineWidth=6;g.strokeStyle=C.ink;g.strokeRect(90,70,200,150);g.beginPath();g.moveTo(190,70);g.lineTo(190,220);g.moveTo(90,145);g.lineTo(290,145);g.stroke();
      for(const s of[-1,1]){g.fillStyle=C.rust;g.beginPath();g.moveTo(190+s*110,60);g.quadraticCurveTo(190+s*80,140,190+s*110,230);g.lineTo(190+s*120,230);g.lineTo(190+s*120,60);g.closePath();g.fill();g.lineWidth=3;g.stroke();}
      g.fillStyle=C.wood;g.fillRect(420,180,420,14);g.strokeRect(420,180,420,14);for(let i=0;i<5;i++){const x=450+i*80;g.fillStyle=['#b5402f','#d9a441','#6f7a45','#3b5a7a','#c79a5e'][i];g.beginPath();g.roundRect(x,120,46,60,8);g.fill();g.lineWidth=3;g.stroke();g.fillStyle=C.paper;g.fillRect(x+8,140,30,16);}
      floorG(g,'tiles','#efe0bf','#b5402f');break;}
    case 'juguetes':{g.fillStyle='#dcc6a0';g.fillRect(0,0,W,GROUND);for(let x=0;x<W;x+=60){g.fillStyle='rgba(181,64,47,.18)';g.fillRect(x,0,30,GROUND);}g.fillStyle='rgba(242,193,78,.45)';for(let i=0;i<20;i++)star((i*97)%W,40+(i*53)%300,8,3.5,5,0,g),g.fill();
      const blocks=[[80,GROUND-60,'A'],[140,GROUND-60,'B'],[110,GROUND-120,'C'],[820,GROUND-60,'Z'],[880,GROUND-60,'!']];for(const [x,y,l] of blocks){g.fillStyle=['#b5402f','#3b5a7a','#6f7a45','#d9a441'][l.charCodeAt(0)%4];g.fillRect(x,y,60,60);g.lineWidth=4;g.strokeStyle=C.ink;g.strokeRect(x,y,60,60);txt(l,x+30,y+32,32,C.paper,C.ink,'center',FONT,g);}
      g.lineWidth=5;g.strokeStyle=C.ink;g.fillStyle=C.woodL;g.beginPath();g.ellipse(460,GROUND-30,120,26,0,Math.PI,0);g.fill();g.stroke();floorG(g,'planks',C.woodL);break;}
    case 'puerto':{skyG(g,'#1f1b38','#4b4170');starsG(g,70,11);g.fillStyle='#2a3a4a';g.fillRect(0,GROUND-120,W,120);g.strokeStyle='rgba(159,200,210,.35)';g.lineWidth=2;for(let y=GROUND-110;y<GROUND;y+=14){g.beginPath();for(let x=0;x<W;x+=20)g.lineTo(x,y+Math.sin(x*.05+y)*3);g.stroke();}
      g.fillStyle='#3a3330';for(const [x,r] of[[60,50],[160,36],[900,44]]){g.beginPath();g.arc(x,GROUND,r,Math.PI,0);g.fill();g.lineWidth=3;g.strokeStyle=C.ink;g.stroke();}floorG(g,'stone','#5a5450');break;}
    case 'playa':{skyG(g,'#e9e4c4','#c9d6c4');raysG(g,480,GROUND,'rgba(255,240,190,.12)');g.beginPath();g.arc(480,GROUND-60,60,0,TAU);g.fillStyle='#f6e7b9';g.fill();g.lineWidth=4;g.strokeStyle=C.ink;g.stroke();
      g.fillStyle='#6f9a96';g.fillRect(0,GROUND-90,W,90);g.strokeStyle='rgba(255,255,255,.5)';for(let y=GROUND-80;y<GROUND;y+=16){g.beginPath();for(let x=0;x<W;x+=24)g.lineTo(x,y+Math.sin(x*.06+y)*3);g.stroke();}
      cloudShape(g,120,90,.7);cloudShape(g,700,70,.8);floorG(g,'sand',C.sand,'#c9ae72');for(const x of[140,760]){g.lineWidth=3;g.strokeStyle=C.ink;g.beginPath();g.moveTo(x,GROUND+60);g.lineTo(x,GROUND+10);g.stroke();}break;}
    case 'tejados':{skyG(g,'#8f8f8a','#b9b4a5');g.strokeStyle='rgba(60,70,80,.25)';g.lineWidth=2;for(let i=0;i<120;i++){const x=(i*83)%W,y=(i*47)%GROUND;g.beginPath();g.moveTo(x,y);g.lineTo(x-6,y+18);g.stroke();}
      g.fillStyle='#5a5450';for(const [x,w,h] of[[0,160,180],[170,120,240],[300,200,160],[640,150,220],[800,160,170]]){g.fillRect(x,GROUND-h,w,h);g.lineWidth=3;g.strokeStyle=C.ink;g.strokeRect(x,GROUND-h,w,h);g.fillStyle='#ffd36a';for(let k=0;k<2;k++)g.fillRect(x+20+k*50,GROUND-h+30,18,24);g.fillStyle='#5a5450';
        g.fillRect(x+w-40,GROUND-h-40,24,40);g.strokeRect(x+w-40,GROUND-h-40,24,40);}floorG(g,'tiles','#8a3a2a','#a24a36');break;}
    case 'maquinas':{g.fillStyle='#4a3a2c';g.fillRect(0,0,W,GROUND);g.lineWidth=18;g.strokeStyle=C.ink;for(const y of[90,200]){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
      g.lineWidth=12;g.strokeStyle=C.brassD;for(const y of[90,200]){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}for(const x of[120,380,860]){g.lineWidth=18;g.strokeStyle=C.ink;g.beginPath();g.moveTo(x,0);g.lineTo(x,GROUND);g.stroke();g.lineWidth=12;g.strokeStyle=C.steelD;g.stroke();}
      for(const [x,y] of[[250,300],[560,140],[700,320]]){g.beginPath();g.arc(x,y,26,0,TAU);g.fillStyle=C.paper;g.fill();g.lineWidth=4;g.strokeStyle=C.ink;g.stroke();g.beginPath();g.moveTo(x,y);g.lineTo(x+16,y-10);g.stroke();}floorG(g,'grate','#3a3330');break;}
    case 'velas':{skyG(g,'#1e1626','#3a2a33');for(const [x,h] of[[90,140],[180,90],[300,160],[820,120],[900,80]]){const gr=g.createRadialGradient(x,GROUND-h-20,4,x,GROUND-h-20,80);gr.addColorStop(0,'rgba(255,210,120,.35)');gr.addColorStop(1,'rgba(255,210,120,0)');g.fillStyle=gr;g.fillRect(x-80,GROUND-h-100,160,160);
      g.fillStyle='#e8dcc0';g.fillRect(x-12,GROUND-h,24,h);g.lineWidth=3;g.strokeStyle=C.ink;g.strokeRect(x-12,GROUND-h,24,h);g.fillStyle='#ffb35a';g.beginPath();g.ellipse(x,GROUND-h-14,6,12,0,0,TAU);g.fill();g.stroke();}floorG(g,'stone','#3a3036');break;}
    case 'biblioteca':{g.fillStyle='#4a2f22';g.fillRect(0,0,W,GROUND);shelfBooks(g,20,40,280,GROUND-40,5);shelfBooks(g,320,40,300,GROUND-40,9);shelfBooks(g,640,40,300,GROUND-40,13);
      g.lineWidth=6;g.strokeStyle=C.woodL;g.beginPath();g.moveTo(560,GROUND);g.lineTo(620,60);g.moveTo(600,GROUND);g.lineTo(660,60);g.stroke();floorG(g,'planks',C.wood);break;}
    case 'granja':{skyG(g,'#2d2442','#5a4570');starsG(g,60,21);g.fillStyle='#3a3050';g.beginPath();g.moveTo(80,GROUND-60);g.lineTo(80,GROUND-170);g.lineTo(160,GROUND-230);g.lineTo(240,GROUND-170);g.lineTo(240,GROUND-60);g.closePath();g.fill();g.lineWidth=3;g.strokeStyle=C.ink;g.stroke();
      g.fillStyle='#2a2238';for(let x=0;x<W;x+=14){g.fillRect(x,GROUND-60-((x*7)%30),4,70);}floorG(g,'dirt','#4a3a2a','#5a4a36');break;}
    case 'oficina':{g.fillStyle='#d8c39a';g.fillRect(0,0,W,GROUND);for(let y=40;y<GROUND;y+=28){g.strokeStyle='rgba(59,90,122,.25)';g.lineWidth=1.5;g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
      g.strokeStyle='rgba(181,64,47,.35)';g.beginPath();g.moveTo(80,0);g.lineTo(80,GROUND);g.stroke();g.save();g.translate(150,GROUND-30);g.rotate(-.3);g.fillStyle=C.gold;g.fillRect(-20,-260,40,240);g.lineWidth=4;g.strokeStyle=C.ink;g.strokeRect(-20,-260,40,240);
      g.fillStyle=C.paper;g.beginPath();g.moveTo(-20,-20);g.lineTo(20,-20);g.lineTo(0,20);g.closePath();g.fill();g.stroke();g.restore();g.fillStyle='#2b2440';g.beginPath();g.roundRect(820,GROUND-110,80,110,10);g.fill();g.lineWidth=4;g.strokeStyle=C.ink;g.stroke();floorG(g,'planks','#8a5a32');break;}
    case 'castillo':{skyG(g,'#1a1426','#2e2342');for(const x of[150,480,810]){g.fillStyle='#3a2f55';g.beginPath();g.moveTo(x-60,300);g.lineTo(x-60,120);g.quadraticCurveTo(x,40,x+60,120);g.lineTo(x+60,300);g.closePath();g.fill();g.lineWidth=5;g.strokeStyle=C.ink;g.stroke();
      for(let i=0;i<3;i++){g.beginPath();g.arc(x-30+i*30,170,12,0,TAU);g.fillStyle='#5a5a5a';g.fill();g.lineWidth=2.5;g.stroke();}}
      for(const x of[60,320,640,900]){g.fillStyle='#2a2238';g.fillRect(x-22,0,44,GROUND);g.lineWidth=4;g.strokeStyle=C.ink;g.strokeRect(x-22,0,44,GROUND);}floorG(g,'tiles','#2a2238','#3a3050');break;}
    default:skyG(g,'#ecd8a8','#c9a466');floorG(g,'planks',C.wood);
  }}
function arenaBG(k){if(ARENA.k===k)return ARENA.c;const [c,g]=mk(W,H);paintArena(g,k);ARENA={k,c};return c;}
function curtainsLayer(){if(CURT)return CURT;const [c,f]=mk(W,H);
  for(const s of[-1,1]){const x0=s<0?0:W;f.beginPath();f.moveTo(x0,0);for(let y=0;y<=H;y+=12)f.lineTo(x0-s*(44+Math.sin(y*.05)*5),y);f.lineTo(x0,H);f.closePath();f.fillStyle=C.curtain;f.fill();f.lineWidth=4;f.strokeStyle=C.ink;f.stroke();}
  f.fillStyle=C.curtain;f.fillRect(0,0,W,22);for(let x=0;x<W+48;x+=48){f.beginPath();f.arc(x+24,22,24,0,Math.PI);f.fill();}f.lineWidth=4;f.strokeStyle=C.ink;f.beginPath();f.moveTo(0,22);for(let x=0;x<W+48;x+=48)f.arc(x+24,22,24,Math.PI,0,true);f.stroke();
  f.strokeStyle=C.brass;f.lineWidth=3;f.beginPath();f.moveTo(0,14);f.lineTo(W,14);f.stroke();CURT=c;return c;}
function scrollClouds(L,dt){for(const c of L.clouds){c.x-=(40+c.l*90)*dt;if(c.x<-150){c.x=W+60+rand()*200;c.y=rand()*H;}}}
function drawPlaneBG(L,k){const night=k==='plane_noche',sea=k==='plane_mar',gr=ctx.createLinearGradient(0,0,0,H);
  if(night){gr.addColorStop(0,'#1a1530');gr.addColorStop(1,'#4b3a6b');}else if(sea){gr.addColorStop(0,'#d8e2d2');gr.addColorStop(1,'#bcd0c4');}else{gr.addColorStop(0,'#dfe0c4');gr.addColorStop(.6,'#e9d6a6');gr.addColorStop(1,'#d3a96a');}
  ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);if(night){ctx.fillStyle='rgba(255,245,210,.7)';for(let i=0;i<50;i++){ctx.fillRect((i*97+L.t*-10)%W+W*((i*97+L.t*-10)%W<0),(i*61)%320,2,2);}}
  for(const c of L.clouds)if(c.l<2){ctx.globalAlpha=c.l?.75:.5;cloudShape(ctx,c.x,c.y,c.s*.8,night?'#5a4a7a':c.l?C.paper:'#eadfbf',4);ctx.globalAlpha=1;}
  const off=-(L.t*80)%400;ctx.beginPath();ctx.moveTo(0,H);
  if(sea){for(let x=0;x<=W+400;x+=20)ctx.lineTo(x+off,H-46-Math.sin(x*TAU/200+L.t*3)*8);ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle='#5b8580';ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();}
  else{for(let x=0;x<=W+400;x+=20)ctx.lineTo(x+off,H-40-Math.sin(x*TAU/400)*18-(night&&Math.floor((x)/80)%3===0?40:0));ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle=night?'#2a2238':'#8f6b3a';ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();}}
function planeFG(L,k){for(const c of L.clouds)if(c.l===2){ctx.globalAlpha=.85;cloudShape(ctx,c.x,c.y,c.s,k==='plane_noche'?'#4b3a6b':C.paper,5);ctx.globalAlpha=1;}}

/* ---------- level flow ---------- */
function startLevel(id){LV=LEVELS[id].create();LV.wasOpen=null;scene='level';LV.state='intro';LV.stateT=0;banner(LV,LV.intro,2);Music.play(SONGS[id]?id:(LEVELS[id].song||'boss1'));sfx('ready');}
function finish(L){const d=LEVELS[L.id];let s=100-L.hits*16+Math.min(3,L.parries)*4+(L.supers?3:0)-Math.max(0,(L.time-(d.par||110))/4);if(L.kind==='run')s+=L.coinsGot.length*2;
  let g=s>=106?'A+':s>=94?'A':s>=84?'A-':s>=72?'B':s>=60?'C':'D';const GR=['D','C','B','A-','A','A+','P','S'];if(g==='A+'&&cfg.diff==='experto'&&L.kind!=='run')g='S';if(L.kind==='run'&&!L.kills&&L.hits===0)g='P';const prevG=save.done[L.id],best=!prevG||GR.indexOf(g)>GR.indexOf(prevG)?g:prevG;
  let reward=0,unlock=null;const first=!save.cleared[L.id];if(first&&L.kind==='maus'){const rw=L.def.reward||'invencible';if(!save.owned.includes(rw)&&SUPERS[rw]){save.owned.push(rw);unlock=SUPERS[rw].name;}}else if(first&&L.kind!=='run')reward+=2;save.cleared[L.id]=true;save.done[L.id]=best;
  for(const id of L.coinsGot)if(!save.taken[id]){save.taken[id]=true;reward++;}save.coins+=reward;persist();
  L.result={grade:g,reward,first,shown:0,unlock};L.state='results';L.stateT=0;L.menu=0;Music.play('results');sfx('victory');setTimeout(()=>sfx('announceWin'),900);}
function levelUpdate(L,dt,IN){L.t+=dt;L.bannerT=Math.max(0,L.bannerT-dt);L.shake=Math.max(0,L.shake-dt*40);L.flash=Math.max(0,L.flash-dt);L.superFlash=Math.max(0,L.superFlash-dt);
  if(L.freeze>0){L.freeze-=dt;return;}const M=IN.M;
  switch(L.state){
    case 'intro':{const t0=L.stateT;L.stateT+=dt;L.idle(dt);if(L.updSolids)L.updSolids(dt);updFX(L,dt);
      for(const p of L.Ps){const tl=.7+.12*p.i;if(p.type==='plat'&&t0<tl&&L.stateT>=tl){puff(L,p.x,p.y-4,8);stars(L,p.x,p.y-60,4);sfx('land');shake(L,5);}}
      if(L.boss&&t0<1.15&&L.stateT>=1.15){const c=L.boss.center();if(L.kind!=='plane'){puff(L,c.x,GROUND-10,14);shake(L,14);sfx('stomp');}stars(L,c.x,c.y,10);sfx('laugh');}
      if(t0<.75&&L.stateT>=.75)sfx('announceReady');if(L.stateT>2.5)L.state='play';break;}
    case 'play':if(M.pause){L.state='pause';L.menu=0;sfx('pause');break;}L.time+=dt;if(L.updSolids)L.updSolids(dt);
      for(const p of L.Ps)(p.type==='plane'?planeUpdate:platUpdate)(L,p,dt,IN.P[p.i]);if(L.state==='dead')break;simTick(L,dt,false);break;
    case 'pause':{const o=4;if(M.up){L.menu=(L.menu+o-1)%o;sfx('move');}if(M.down){L.menu=(L.menu+1)%o;sfx('move');}if(M.pause){L.state='play';break;}
      if(M.ok){sfx('select');if(L.menu===0)L.state='play';else if(L.menu===1)transition(()=>startLevel(L.id));else if(L.menu===2)openOptions('level');else transition(toMap);}break;}
    case 'ko':case 'win':L.stateT+=dt;if(L.updSolids)L.updSolids(dt);for(const p of L.Ps)(p.type==='plane'?planeUpdate:platUpdate)(L,p,dt,{h:Object.assign({},IN.P[p.i].h,{shoot:false,ex:false}),p:{}});simTick(L,dt,true);
      if(L.state==='ko'&&L.stateT<2.4&&Math.floor(L.stateT*8)!==Math.floor((L.stateT-dt)*8)){const c=L.boss.center();boom(L,c.x+(rand()-.5)*200,c.y+(rand()-.5)*200,30+rand()*30);sfx('boom');shake(L,6);}
      if(L.stateT>(L.state==='ko'?3.2:2.4))finish(L);break;
    case 'dead':{const t0=L.stateT;L.stateT+=dt;updFX(L,dt);for(const p of L.Ps)if(p.dead)ghostUpd(L,p,dt);if(t0<1.4&&L.stateT>=1.4){sfx('stamp');shake(L,10);}}if(L.stateT>1.8){if(M.up||M.down){L.menu=1-L.menu;sfx('move');}if(M.ok){sfx('select');if(L.menu===0)transition(()=>startLevel(L.id));else transition(toMap);}}break;
    case 'results':{L.stateT+=dt;updFX(L,dt);const r=L.result,sh=Math.min(6,Math.floor(L.stateT/.35));if(sh>r.shown){r.shown=sh;sfx(sh===6?'stamp':'tick');if(sh===6)shake(L,10);}
      if(L.stateT%1<dt)sparks(L,L.camX+100+rand()*(W-200),80+rand()*120,6,C.brass);if(L.stateT>2.4&&M.ok){sfx('select');transition(()=>afterLevel(L));}break;}}}
function simTick(L,dt,post){if(!post)L.update(dt);else if(L.kind==='run')L.update(dt);else L.idle(dt);updEnemies(L,dt);updBullets(L,dt);updBeams(L,dt);updTacks(L,dt);updEB(L,dt);updFX(L,dt);
  L.arcs=L.arcs.filter(a=>(a.t-=dt)>0);if(L.wind&&(L.wind.t-=dt)<=0)L.wind=null;if(L.dark&&(L.dark.t-=dt)<=0)L.dark=null;}
let DARKC=null;
function drawDark(L){if(!L.dark)return;if(!DARKC){DARKC=document.createElement('canvas');DARKC.width=W;DARKC.height=H;}const g=DARKC.getContext('2d'),d=L.dark,a=Math.min(1,(d.tot-d.t)*3,d.t*2);
  g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);g.fillStyle=`rgba(10,6,20,${.94*a})`;g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';
  for(const p of L.Ps){if(p.dead)continue;const c=pCenter(p),gr=g.createRadialGradient(c.x-L.camX,c.y,20,c.x-L.camX,c.y,150);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);}
  for(const e of L.eb){if(e.parry){const gr=g.createRadialGradient(e.x-L.camX,e.y,2,e.x-L.camX,e.y,40);gr.addColorStop(0,'rgba(0,0,0,.8)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(e.x-L.camX-40,e.y-40,80,80);}}
  g.globalCompositeOperation='source-over';ctx.drawImage(DARKC,0,0,W,H);}
function drawLevel(L){ctx.save();if(L.shake>0)ctx.translate((rand()-.5)*L.shake,(rand()-.5)*L.shake);
  L.drawBG();ctx.save();ctx.translate(-Math.round(L.camX),0);if(L.drawWorld)L.drawWorld();for(const e of L.ents)if(!e.boss&&!e.dead&&e.x>L.camX-80&&e.x<L.camX+W+80){const k=easeOutBack(Math.min(1,e.t/.3)),b=Math.sin(e.t*9)*.05;ctx.save();ctx.translate(e.x,e.y+e.r);ctx.scale(Math.max(.01,k*(1+b)),Math.max(.01,k*(1-b)));ctx.translate(-e.x,-e.y-e.r);drawEnemy(e,L.t);ctx.restore();}
  drawEB(L);drawPlayers(L);drawBullets(L);drawFX(L);ctx.restore();if(L.drawFG)L.drawFG();
  if(L.wind){ctx.strokeStyle='rgba(239,224,191,.6)';ctx.lineWidth=2;for(let i=0;i<14;i++){const y=(i*41)%GROUND+20,x=((L.t*700*Math.sign(L.wind.f)+i*137)%(W+200)+W+200)%(W+200)-100;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.sign(L.wind.f)*60,y);ctx.stroke();}}
  drawDark(L);ctx.restore();if(L.superFlash>0){ctx.fillStyle=`rgba(255,243,176,${L.superFlash})`;ctx.fillRect(0,0,W,H);}
  drawHUD(L);drawBanner(L);levelOverlay(L);if(L.flash>0){ctx.fillStyle=`rgba(255,245,225,${L.flash*1.6})`;ctx.fillRect(0,0,W,H);}}
function drawHUD(L){if(L.state==='results')return;
  L.Ps.forEach((p,i)=>{const R=i===1,hx=R?W-150:i===2?W/2-110:58,y=H-58,low=p.hp<=1&&!p.dead&&Math.floor(L.t*5)%2;
    card(hx,y,92,36,p.dead?'#8a7650':low?C.rust:C.paper);txt(p.dead?'ALMA':'HP.',hx+10,y+19,p.dead?15:19,C.ink,null,'left');if(!p.dead)txt(String(Math.max(0,p.hp)),hx+54,y+18,26,C.ink,null,'left');
    for(let k=0;k<5;k++){const x=R?hx-22-k*22:hx+102+k*22,f=clamp(p.cards-k,0,1);ctx.beginPath();ctx.roundRect(x,y,18,30,3);ctx.fillStyle='#5a3d22';ctx.fill();
      if(f>0){ctx.fillStyle=f>=1?(p.cards>=5&&Math.floor(L.t*8)%2?'#ffe27a':C.brass):'rgba(217,164,65,.55)';ctx.fillRect(x+2,y+28-26*f,14,26*f);}ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();}
    if(p.cards>=5)txt('¡SÚPER!',R?hx-66:hx+157,y-14,13,'#ffe27a');else if(p.cards>=1)txt('EX',R?hx-66:hx+157,y-14,12,C.brass);
    if(p.type==='plat'){ctx.font=`800 13px ${BFONT}`;ctx.textAlign=R?'right':'left';ctx.textBaseline='middle';ctx.lineWidth=3;ctx.strokeStyle=C.ink;const s=(L.Ps.length>1?'J'+(p.i+1)+' ':'')+WEAPONS[curW(p)].name+(pWeapons(p).length>1?' · cambiar':'');
      const tx=R?hx+92:hx;ctx.strokeText(s,tx,y-14);ctx.fillStyle=C.paper;ctx.fillText(s,tx,y-14);}});
  const eb=document.getElementById('exBtn');if(eb&&L.Ps[0]){eb.classList.toggle('hot',L.Ps[0].cards>=1);eb.textContent=L.Ps[0].cards>=5?'SÚPER':'EX';}
  if(L.boss){const B=L.boss,bw=300,bx=W/2-bw/2,by=36;ctx.fillStyle='rgba(20,13,8,.75)';ctx.beginPath();ctx.roundRect(bx-4,by-4,bw+8,16,8);ctx.fill();ctx.fillStyle=C.rust;ctx.beginPath();ctx.roundRect(bx,by,Math.max(0,bw*B.hp/B.max),8,4);ctx.fill();
    ctx.fillStyle=C.paper;const n=B.def.phases.length;for(let k=1;k<n;k++)ctx.fillRect(bx+bw*k/n-1,by-2,2,12);txt(L.name.toUpperCase(),W/2,by+24,13,C.paper);}
  if(L.kind==='run'){card(56,30,96,34,C.paper);coinIcon(76,47,10);txt(`${L.coinsGot.length+L.coins.filter(c=>c.was).length}/5`,96,47,18,C.ink,null,'left');const bw=260,bx=W/2-bw/2;
    ctx.fillStyle='rgba(20,13,8,.7)';ctx.beginPath();ctx.roundRect(bx-4,32,bw+8,12,6);ctx.fill();for(const p of L.Ps){if(p.dead)continue;circ(bx+bw*clamp(p.x/L.endX,0,1),38,7,PCOL[p.i],0);}
    ctx.fillStyle=C.rust;ctx.fillRect(bx+bw-3,30,6,16);txt(L.name.toUpperCase(),W/2,60,13,C.paper);}}
function drawBanner(L){if(L.bannerT<=0)return;const k=1-L.bannerT/L.bannerMax,sc=k<.15?.6+k/.15*.5:k<.25?1.1-(k-.15):1,a=L.bannerT<.3?L.bannerT/.3:1,sz=L.banner.length>18?36:L.banner.length>12?48:62;
  ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,H*.4);ctx.scale(sc,sc);ctx.rotate(-.04);txt(L.banner,4,6,sz,C.ink,null);txt(L.banner,0,0,sz,C.paper);ctx.restore();}
function menuList(opts,sel,x,y,w=260){opts.forEach((o,i)=>{const on=i===sel;if(on){ctx.fillStyle=C.brass;ctx.beginPath();ctx.roundRect(x-w/2,y+i*44-18,w,36,8);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}
  txt(o,x,y+i*44,22,on?C.ink:C.paper,on?null:C.ink);});}
function fmt(t){const m=Math.floor(t/60),s=Math.floor(t%60);return m+':'+String(s).padStart(2,'0');}
function levelOverlay(L){
  if(L.state==='pause'){ctx.fillStyle='rgba(20,13,8,.65)';ctx.fillRect(0,0,W,H);txt('PAUSA',W/2,120,60,C.paper);menuList(['Continuar','Reintentar','Opciones','Volver al mapa'],L.menu,W/2,210);btxt('↑ ↓ elegir · Enter o saltar para aceptar',W/2,410,15,C.paper,'center');}
  else if(L.state==='dead'){ctx.fillStyle=`rgba(20,13,8,${Math.min(.65,L.stateT*.5)})`;ctx.fillRect(0,0,W,H);
    if(L.stateT<1.4){ctx.save();ctx.globalAlpha=Math.min(1,L.stateT*2)*.8;const g=ctx.createRadialGradient(W/2,H/2,60,W/2,H/2,H*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,5,20,.85)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();}
    if(L.stateT>1.4){const sk=Math.min(1,(L.stateT-1.4)/.22),sc=sk<1?2.6-1.6*sk:1;card(W/2-270,H/2-170,540,320);ctx.save();ctx.translate(W/2,H/2-122);ctx.scale(sc,sc);ctx.rotate(-.06);ctx.globalAlpha=sk;txt(L.Ps.length>1?'¡OS APAGARON!':'¡TE APAGARON!',0,0,44,C.rust);ctx.restore();const pr=L.progress(),lx=W/2-200,lw=400,ly=H/2-50;
      ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+lw,ly);ctx.stroke();if(L.boss){const n=L.boss.def.phases.length;for(let k=1;k<n;k++)circ(lx+lw*k/n,ly,5,C.ink,0);}
      circ(lx+lw,ly,14,C.rust,3);circ(lx+lw*pr,ly,11,'#ffe27a',3);btxt(`Llegaste al ${Math.round(pr*100)} % del nivel`+(L.boss?` · Fase ${L.boss.phase+1} de ${L.boss.def.phases.length}`:''),W/2,ly+34,17,C.ink,'center');
      menuList(['Reintentar','Volver al mapa'],L.menu,W/2,H/2+50);}}
  else if(L.state==='results'){const r=L.result;ctx.fillStyle='rgba(20,13,8,.62)';ctx.fillRect(0,0,W,H);card(W/2-300,H/2-200,600,390);txt(L.kind==='run'?'¡NIVEL SUPERADO!':'¡GANASTE!',W/2,H/2-152,44,C.brass);
    const rows=[['Tiempo',fmt(L.time)],['Golpes recibidos',L.hits],['Parrys',L.parries],['EX y súper',L.exs+L.supers],L.kind==='run'?['Monedas nuevas',L.coinsGot.length]:['Jugadores',L.Ps.length]];
    rows.forEach(([a,b],i)=>{if(i>=r.shown)return;const y=H/2-96+i*34;btxt(a,W/2-240,y,19);btxt(String(b),W/2+40,y,19,C.ink,'right');line(W/2-240,y+15,W/2+40,y+15,1,'rgba(20,13,8,.25)');});
    txt('GRADO',W/2+170,H/2-96,16,C.ink,null);if(r.shown>=6){ctx.save();ctx.translate(W/2+170,H/2-30);ctx.rotate(-.12);txt(r.grade,0,0,86,C.rust);ctx.restore();}
    let yy=H/2+90;if(r.unlock&&r.shown>=6){btxt('¡Súper nuevo: '+r.unlock+'!',W/2,yy,19,C.rust,'center',800);yy+=30;}if(r.reward&&r.shown>=6){coinIcon(W/2-120,yy,11);btxt(`+${r.reward} moneda${r.reward>1?'s':''}`+(r.first&&L.kind!=='run'?' por la primera victoria':''),W/2-100,yy,18);yy+=30;}
    if(L.stateT>2.4&&Math.floor(L.t*2)%2===0)txt('Enter o saltar: continuar',W/2,H/2+170,19,C.paper);}}
