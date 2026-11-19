/* chorron.js — DON CHORRÓN, el Hidrante Furioso (Isla 1, secret super-boss).
   A giant fire hydrant with hose arms and a fireman's helmet. Very tough: 4 phases, lots of life and his own attacks:
     · chorroArco   — a spraying arc of water that sweeps across the stage
     · mangueraLatigo — his loose hose slithers along the floor like a snake: jump it
     · geysers from the floor, bubbles, rain
   Phase 2 he swells with pressure and blows his top cap off; phase 3 his big hose tears loose and flies around the
   arena; phase 4 he cracks and leaks everywhere.
   He CAN'T be finished with bullets: at 0 life he staggers and the brass valve of his hose glows pink.
   PARRY THE VALVE to shut him off and knot his hose. Miss it for 8 seconds and he refills 18 % of his life.
   He is optional for sailing on (a secret challenge) but counts for 100 %. All logic uses the seeded rand(). */
(function(){
const hs=i=>{const s=Math.sin(i*12.9898+78.233)*43758.5453;return s-Math.floor(s);};
const snakeH=B=>({x:W*.48+Math.sin(B.t*1.3)*300,y:120+Math.sin(B.t*2.1)*50});
const valveP=B=>({x:B.x-250,y:GROUND-140+Math.sin(B.t*3)*10});
Object.assign(ATK,{
  chorroArco(L,B,a){const o=anc(B,a.from),d=tgt(L,B).x<o.x?-1:1,n=a.n||14,pk=Math.floor(rand()*n);for(let i=0;i<n;i++)B.queue.push({t:i*(a.rate||.08),fn:()=>{const k=.15+i/n*.9,an=d<0?Math.PI+k:-k,sp=a.spd||560;
    spawnEB(L,{k:'grav',x:o.x,y:o.y,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,g:900,r:11,spr:'drop',parry:i===pk,puddle:i%5===0});if(i%3===0)sfx('splash');}});},
  mangueraLatigo(L,B,a){const d=tgt(L,B).x<B.x?-1:1,x0=d<0?W+40:-40,n=9,pk=Math.floor(rand()*n);sfx('warn');for(let i=0;i<n;i++)spawnEB(L,{k:'shot',x:x0-d*i*44,y:GROUND-26,vx:d*330,vy:0,r:17,spr:'bubble',parry:i===pk,ph:i*.55,life:6,
    upd:(e)=>{e.y=GROUND-26-Math.max(0,Math.sin(e.t*7-e.ph))*70;}});}});
defBoss({id:'chorron',name:'Don Chorrón',sub:'Superjefe secreto · El Hidrante Furioso',isl:1,hp:640,par:150,arena:'m_hidrante',song:'boss2b',x:720,y:GROUND,intro:'¡NADIE APAGA A DON CHORRÓN!',
  center(B){return{x:B.x,y:B.y-160};},
  anchor(B,n){const x=B.x,y=B.y;if(n==='nozzle')return{x:x-176,y:y-168};if(n==='right')return{x:x+150,y:y-118};if(n==='top')return{x:x,y:y-300};if(n==='snake'){const h=snakeH(B);return h;}return null;},
  shapes(B){if(B.remate)return[];return[{x:B.x-74,y:B.y-232,w:148,h:212},{x:B.x,y:B.y-252,r:54}];},
  setup(B,L){B.bx=B.x;const dmg=B.damage;B.damage=d=>{if(B.dead||B.hidden||B.remate)return;B.hp=Math.max(0,B.hp-d);B.flash=.06;if(B.hp<=0)startRemate(L,B);};},
  move(B,dt,L){if(B.remate){B.remate.t+=dt;B.timers=B.timers.map(()=>99);B.act=null;
      if(!L.eb.some(e=>e.remateOf===B)){const v=valveP(B);spawnEB(L,{k:'pstar',x:v.x,y:v.y,r:26,parry:true,remateOf:B});}
      for(const e of L.eb)if(e.remateOf===B){const v=valveP(B);e.x=v.x;e.y=v.y;}
      if(B.remate.t>8){B.remate=null;B.hp=B.max*.18;L.eb=L.eb.filter(e=>e.remateOf!==B);B.timers=B.timers.map((_,i)=>1+i*.6);banner(L,'¡SE VOLVIÓ A LLENAR!',1.6);sfx('laugh');shake(L,12);}
      return;}
    if(!B.act)B.x+=(B.bx+Math.sin(B.t*.6)*(60+B.phase*25)-B.x)*Math.min(1,dt*1.2);},
  phases:[
    {atk:[{f:'aimed',every:1.5,from:'nozzle',n:3,spread:.18,spd:330,spr:'drop',r:12,parry:3,sfx:'splash'},{f:'chorroArco',every:3.6,from:'nozzle',n:12,rate:.08,spd:540},{f:'rain',every:3.2,n:5,spd:260,spr:'drop',r:11,parry:4}]},
    {banner:'¡PRESIÓN MÁXIMA!',atk:[{f:'column',every:3,n:3,gap:.4,style:'geyser',warn:.7,w:60},{f:'chorroArco',every:3.2,from:'top',n:14,rate:.07,spd:600},{f:'ring',every:2.8,from:'top',n:12,spd:240,spr:'bubble',r:12,parry:4,sfx:'pop'},{f:'aimed',every:1.8,from:'right',n:2,spread:.2,spd:360,spr:'drop',r:12,parry:3}]},
    {banner:'¡MANGUERA LOCA!',atk:[{f:'mangueraLatigo',every:4.2},{f:'aimed',every:1.3,from:'snake',n:3,spread:.16,spd:380,spr:'drop',r:12,parry:3,sfx:'splash'},{f:'rain',every:2.6,n:6,spd:280,spr:'drop',r:11,parry:4},{f:'column',every:3.8,n:2,gap:.5,style:'geyser',warn:.65,w:60}]},
    {banner:'¡A TODA PRESIÓN!',atk:[{f:'chorroArco',every:2.8,from:'nozzle',n:16,rate:.06,spd:620},{f:'mangueraLatigo',every:3.6},{f:'aimed',every:1.2,from:'snake',n:4,spread:.14,spd:400,spr:'drop',r:12,parry:3},{f:'column',every:3,n:3,gap:.35,style:'geyser',warn:.6,w:60},{f:'spiral',every:5,from:'top',dur:1.6,rate:.09,step:.45,spd:230,spr:'bubble',r:11,arms:2,parry:6}]}],
  draw(B,L){const t=B.t,ph=B.phase,x=B.x,y=B.y,rm=B.remate;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';bossSquash(B,L);
    shadowE(x,GROUND+3,120,.3);
    const tilt=rm?Math.sin(t*3)*.12:0;
    /* the loose big hose (phase 3+): from his back to a flying nozzle head */
    if(ph>=2&&!B.dead){const h=rm?valveP(B):snakeH(B),sx=x+40,sy=y-250;for(const [lw,c] of[[30,C.ink],[22,'#e8d8b0']]){ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.beginPath();ctx.moveTo(sx,sy);ctx.bezierCurveTo(sx+80,sy-120,h.x+Math.sin(t*2)*120,h.y+160,h.x,h.y);ctx.stroke();}
      ctx.setLineDash([6,10]);ctx.lineWidth=2;ctx.strokeStyle='rgba(20,13,8,.35)';ctx.beginPath();ctx.moveTo(sx,sy);ctx.bezierCurveTo(sx+80,sy-120,h.x+Math.sin(t*2)*120,h.y+160,h.x,h.y);ctx.stroke();ctx.setLineDash([]);
      if(!rm){rr(h.x-20,h.y-14,40,28,6,C.brass,4);rr(h.x-36,h.y-9,18,18,4,C.brassD,3);bossFace(B,L,h.x+4,h.y-4,.35,{gap:12,ew:6,eh:7,my:10,mw:10,open:.6});}}
    ctx.save();ctx.translate(x,y);ctx.rotate(tilt);ctx.translate(-x,-y);
    const bul=ph===1?1+Math.sin(t*9)*.04:1;ctx.save();ctx.translate(x,y);ctx.scale(bul*(ph===1?1.08:1),1);ctx.translate(-x,-y);
    /* body */
    const red=ph>=3?'#b5281e':'#d9342a';rr(x-84,y-36,168,36,8,'#8a1f18',5);rr(x-74,y-232,148,200,26,red,6);
    ctx.save();ctx.beginPath();ctx.roundRect(x-74,y-232,148,200,26);ctx.clip();ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(x-58,y-232,18,200);ctx.fillStyle='rgba(20,13,8,.18)';ctx.fillRect(x+40,y-232,34,200);ctx.restore();
    rr(x-90,y-120,180,22,8,'#b8281e',5);for(let i=0;i<5;i++)circ(x-72+i*36,y-109,5,C.brass,2);
    for(const s of[-1,1]){rr(x+s*74-(s<0?30:0),y-178,30,40,8,'#c92e24',5);poly([[x+s*104-(s<0?0:0)+(s<0?-4:4),y-168],[x+s*110,y-158],[x+s*104+(s<0?-4:4),y-148],[x+s*96,y-148],[x+s*92,y-158],[x+s*96,y-168]],C.brass,2.5);}
    if(ph!==1&&ph<3){ell(x,y-238,70,22,'#b8281e',5);ell(x,y-262,46,32,red,5);poly([[x-14,y-300],[x+14,y-300],[x+18,y-290],[x,y-282],[x-18,y-290]],C.brass,3);}
    else if(ph===1){ell(x,y-238,70,22,'#b8281e',5);for(let i=0;i<7;i++){const k=(t*2+i/7)%1;ctx.globalAlpha=1-k;circ(x+(i-3)*12+Math.sin(t*9+i)*6,y-250-k*120,10+k*10,'#bfe6f7',2.5);}ctx.globalAlpha=1;
      const ck=(t*.7)%1;ctx.save();ctx.translate(x+60+ck*80,y-320-Math.sin(ck*Math.PI)*90);ctx.rotate(ck*8);ell(0,0,40,24,red,4);ctx.restore();}
    else{ell(x,y-238,70,22,'#8a1f18',5);}
    /* helmet */
    if(ph<3){ctx.save();ctx.translate(x,y-210);ell(0,4,98,14,'#1d1612',4);ctx.beginPath();ctx.arc(0,0,58,Math.PI,0);ctx.closePath();ctx.fillStyle=ph===1?'#2a2420':'#1d1612';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();
      rr(x-16,y-254,32,34,6,C.gold,3);star(x,y-237,9,4,5,0);ctx.fillStyle='#c8392b';ctx.fill();}
    /* face + moustache */
    const fy=y-170;bossFace(B,L,x,fy,.95,{gap:36,ew:17,eh:21,my:46,mw:34,open:rm?.2:(B.mouth>0?.8:.35),dead:B.dead});
    for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(x,fy+26);ctx.bezierCurveTo(x+s*20,fy+14,x+s*50,fy+20,x+s*56,fy+36+Math.sin(t*4)*3);ctx.bezierCurveTo(x+s*40,fy+32,x+s*20,fy+34,x,fy+30);ctx.closePath();ctx.fillStyle='#f4efe4';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}
    if(ph>=3){ctx.save();ctx.strokeStyle=C.ink;ctx.lineWidth=3.5;for(const [cx,cy,sd] of [[x-40,y-90,1],[x+30,y-200,2],[x+50,y-70,3]]){ctx.beginPath();ctx.moveTo(cx,cy);let px=cx,py=cy;for(let j=1;j<=4;j++){px+=(hs(sd*9+j)-.5)*30;py+=(hs(sd*5+j)-.3)*20;ctx.lineTo(px,py);}ctx.stroke();
      for(let k=0;k<5;k++){const u=(t*2+k/5)%1;ctx.globalAlpha=1-u;circ(px+(sd%2?1:-1)*u*60,py-u*30+u*u*70,3,'#8fd0f0',0);}ctx.globalAlpha=1;}ctx.restore();}
    ctx.restore();
    /* hose arms */
    if(!rm){const ly=y-168+Math.sin(t*3)*8;for(const [lw,c] of[[22,C.ink],[15,'#e8d8b0']]){ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.beginPath();ctx.moveTo(x-90,y-158);ctx.quadraticCurveTo(x-130,y-120,x-160,ly);ctx.stroke();}
      rr(x-188,ly-12,30,24,5,C.brass,3.5);rr(x-200,ly-7,14,14,3,C.brassD,2.5);
      const ry=y-118+Math.sin(t*3+1)*8;for(const [lw,c] of[[22,C.ink],[15,'#e8d8b0']]){ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.beginPath();ctx.moveTo(x+90,y-158);ctx.quadraticCurveTo(x+130,y-170,x+140,ry);ctx.stroke();}rr(x+128,ry-12,30,24,5,C.brass,3.5);}
    else{for(const s of[-1,1]){for(const [lw,c] of[[22,C.ink],[15,'#e8d8b0']]){ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.beginPath();ctx.moveTo(x+s*90,y-158);ctx.quadraticCurveTo(x+s*120,y-100,x+s*110,y-40);ctx.stroke();}}}
    ctx.restore();
    /* finisher: the glowing valve */
    if(rm&&!B.dead){const v=valveP(B),pul=.5+.5*Math.sin(t*10);for(const [lw,c] of[[22,C.ink],[15,'#e8d8b0']]){ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.beginPath();ctx.moveTo(x-90,y-158);ctx.bezierCurveTo(x-150,y-60,v.x+60,v.y+80,v.x,v.y);ctx.stroke();}
      for(let k=0;k<4;k++){const u=(t*3+k/4)%1;ctx.globalAlpha=1-u;circ(v.x-30-u*40,v.y+10+u*u*60,4,'#8fd0f0',0);}ctx.globalAlpha=1;for(let i=0;i<3;i++){const a=t*4+i*TAU/3;star(x+Math.cos(a)*50,y-330+Math.sin(a)*12,8,3.5,5,t*3);ctx.fillStyle='#ffe27a';ctx.fill();}
      ctx.save();ctx.globalAlpha=.35+pul*.35;circ(v.x,v.y,52,C.parry,0);ctx.restore();ctx.save();ctx.translate(v.x,v.y);ctx.rotate(t*1.5);circ(0,0,30,'rgba(0,0,0,0)',6);for(let i=0;i<4;i++){ctx.rotate(Math.PI/4);line(-30,0,30,0,5,C.ink);}circ(0,0,30,'rgba(0,0,0,0)',4);ctx.strokeStyle=C.parry;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,30,0,TAU);ctx.stroke();circ(0,0,9,C.brass,3);ctx.restore();
      rr(v.x-150,v.y-118,300,40,10,C.paper,4);btxt(`¡PARRY A LA LLAVE!  ${Math.max(0,Math.ceil(8-rm.t))}`,v.x,v.y-97,20,C.ink,'center',900);}
    if(B.dead){const v=valveP(B);for(const [lw,c] of[[24,C.ink],[16,'#e8d8b0']]){ctx.lineWidth=lw;ctx.strokeStyle=c;ctx.beginPath();ctx.arc(v.x,v.y,26,0,TAU*.85);ctx.stroke();}circ(v.x,v.y,10,C.brass,3);}
    flashOver(B,x,y-150,130);koStars(B,L,x,y-320);ctx.restore();}});
function startRemate(L,B){B.remate={t:0};B.act=null;B.queue=[];B.hidden=false;L.eb=L.eb.filter(e=>e.k==='pstar');for(const e of L.ents)if(!e.boss)e.dead=true;banner(L,'¡AHORA! ¡PARRY A LA LLAVE!',1.8);shake(L,14);sfx('phaseHit');const c=B.center();stars(L,c.x,c.y,14);puff(L,c.x,c.y,12);}
const _dpC=doParry;doParry=function(L,p,o){const r=_dpC.apply(this,arguments);try{if(o&&o.remateOf){const B=o.remateOf;o.dead=true;L.eb=L.eb.filter(e=>e.remateOf!==B);B.remate=null;B.hp=0;
    shake(L,24);sfx('boom');sfx('victory');pop(L,o.x,o.y-60,'¡CERRADO!',C.gold);puff(L,o.x,o.y,16);sparks(L,o.x,o.y,24,'#8fd0f0');bossDown(L,B);}}catch(e){}return r;};
/* arena: a city street at night with water everywhere */
ACZ.m_hidrante=function(g){const gr=g.createLinearGradient(0,0,0,GROUND);gr.addColorStop(0,'#2a3a5a');gr.addColorStop(1,'#5a6f8a');g.fillStyle=gr;g.fillRect(0,0,W,GROUND);
  for(const [x,w,h] of [[0,150,260],[140,120,320],[250,170,230],[600,140,300],[730,230,250]]){g.fillStyle='#1f2a40';g.fillRect(x,GROUND-h,w,h);for(let yy=GROUND-h+20;yy<GROUND-30;yy+=36)for(let xx=x+14;xx<x+w-20;xx+=30){g.fillStyle=(xx*7+yy)%5<2?'#ffe27a':'#34425e';g.fillRect(xx,yy,16,20);}}
  g.strokeStyle='rgba(200,220,255,.25)';g.lineWidth=1.5;for(let i=0;i<70;i++){const x=(i*61)%W,y=(i*37)%GROUND;g.beginPath();g.moveTo(x,y);g.lineTo(x-4,y+16);g.stroke();}
  g.fillStyle='#3a4050';g.fillRect(0,GROUND,W,H-GROUND);g.fillStyle='#5a6070';g.fillRect(0,GROUND,W,10);for(let x=0;x<W;x+=90){g.fillStyle='rgba(143,208,240,.35)';g.beginPath();g.ellipse(x+40,GROUND+30,34,6,0,0,TAU);g.fill();}
  g.fillStyle='rgba(20,13,8,.85)';g.fillRect(0,GROUND,W,5);};
/* map: Isla Hojalata, a hydrant on a wet street corner */
addNode(1,{id:'chorron',x:1230,y:1140,kind:'level',ob:40,bld:'hidranteBld'});if(!WORLDS[1].roads.some(r=>r.includes('chorron')))WORLDS[1].roads.push(['fabrica','chorron']);
const _dbC=drawBld;drawBld=function(n,t,night){if(n.bld!=='hidranteBld'){_dbC(n,t,night);return;}const x=n.x,y=n.y;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';shadowE(x,y+2,50,.22);
  ell(x,y,44,10,'rgba(143,208,240,.6)',0);rr(x-16,y-44,32,44,8,'#d9342a',3.5);ell(x,y-46,18,8,'#b8281e',3);rr(x-26,y-32,52,10,4,'#b8281e',3);circ(x,y-54,6,C.brass,2.5);
  for(let i=0;i<3;i++){const k=(t*1.5+i/3)%1;ctx.globalAlpha=1-k;circ(x+22+k*26,y-28-Math.sin(k*Math.PI)*22,3,'#8fd0f0',0);}ctx.globalAlpha=1;
  if(!(save.done&&save.done.chorron)){const k=Math.sin(t*4)*.5+.5;btxt('¡!',x,y-74-k*4,16,'#c8392b','center',900);}
  else{ctx.strokeStyle=C.ink;const fx=x+(n.ob||30)+8;line(fx,y,fx,y-40,3);poly([[fx,y-40],[fx+30,y-32],[fx,y-22]],C.parry);txt(save.done.chorron,fx+12,y-31,11,C.ink,null);}ctx.restore();};
/* optional for sailing on — it's a secret super-boss */
const _il=islandLeft;window.islandLeft=function(i){return _il(i).filter(id=>id!=='chorron');};
/* achievement */
if(!ACHD.chorronW){const a=['chorronW','¡Grifo Cerrado!','Remata a Don Chorrón con un parry a la llave de su manguera.',5];ACH.push(a);ACHD[a[0]]={id:a[0],name:a[1],desc:a[2],coins:a[3]};}
const _alC=afterLevel;afterLevel=function(L){try{if(L&&L.id==='chorron'&&L.state==='results'&&!(L.result&&L.result.fail)&&!(typeof NP!=='undefined'&&NP.on))unlockAch('chorronW');}catch(e){}_alC(L);};
if(window.BOSS_FORMS)BOSS_FORMS.chorron={draw:[null,null,null,null]};
if(!ALL_LEVELS.includes('chorron'))ALL_LEVELS.push('chorron');
})();
