'use strict';
/* ================= MAUSOLEO DEL ECO: parry-only challenge (protect the urn) ================= */
function defMaus(id,name,isl,waves,reward,extra={}){LEVELS[id]=Object.assign({id,kind:'maus',name,sub:'Desafío · Solo parry',isl,par:95,song:'boss3b',intro:'¡PROTEGE LA URNA!',waves,reward,create:()=>makeMaus(id)},extra);}
defMaus('mausoleo','Mausoleo del Eco',1,[{n:6,gap:1.6,spd:105},{n:8,gap:1.25,spd:125},{n:10,gap:1,spd:145,pair:true}],'invencible');
defMaus('mausoleo2','Mausoleo de la Niebla',2,[{n:8,gap:1.35,spd:120},{n:10,gap:1.5,spd:135,pair:true},{n:12,gap:1.35,spd:150,pair:true}],'tormenta',{tint:'rgba(80,140,160,.18)'});
defMaus('mausoleo3','Mausoleo de Medianoche',3,[{n:10,gap:1.5,spd:135,pair:true},{n:12,gap:1.35,spd:150,pair:true},{n:14,gap:1.25,spd:160,pair:true,fast:true}],'escudo',{tint:'rgba(90,20,90,.22)'});
let MAUSBG=null;
function mausBG(){if(MAUSBG)return MAUSBG;const [c,g]=mk(W,H);const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#2a2433');gr.addColorStop(1,'#4b4060');g.fillStyle=gr;g.fillRect(0,0,W,H);
  g.lineJoin='round';const r=srand(5);for(let y=0;y<GROUND;y+=30)for(let x=(y/30%2)*40;x<W;x+=80){g.fillStyle=`rgba(${r()<.5?'90,80,105':'70,62,85'},.55)`;g.fillRect(x+2,y+2,76,26);}
  for(const x of[120,480,840]){g.fillStyle='#1a1522';g.beginPath();g.moveTo(x-90,GROUND);g.lineTo(x-90,170);g.arc(x,170,90,Math.PI,0);g.lineTo(x+90,GROUND);g.closePath();g.fill();g.lineWidth=5;g.strokeStyle=C.ink;g.stroke();}
  for(const x of[300,660]){g.fillStyle='#6b6178';g.fillRect(x-22,60,44,GROUND-60);g.lineWidth=4;g.strokeStyle=C.ink;g.strokeRect(x-22,60,44,GROUND-60);g.fillRect(x-30,50,60,18);g.strokeRect(x-30,50,60,18);}
  g.fillStyle='#3a3248';g.fillRect(0,GROUND,W,H-GROUND);g.fillStyle=C.ink;g.fillRect(0,GROUND,W,4);for(let x=0;x<W;x+=64){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,GROUND+4,2,H);}
  MAUSBG=c;return c;}
function makeMaus(id){const L=baseLevel(id),MAUS_WAVES=LEVELS[id].waves;L.noShoot=true;addPlayers(L,'plat',260,GROUND);
  L.urn={x:W/2,y:GROUND-58,shake:0,cracked:false};L.wave=0;L.left=MAUS_WAVES[0].n;L.spawnT=1.2;L.got=0;L.total=MAUS_WAVES.reduce((a,w)=>a+w.n,0);L.waveT=0;
  L.solids=[{x:-200,y:GROUND,w:W+400,h:200,ground:true},{x:150,y:330,w:120,h:14,oneWay:true},{x:690,y:330,w:120,h:14,oneWay:true}];
  L.spawned=0;
  L.update=dt=>{const wv=MAUS_WAVES[L.wave];L.urn.shake=Math.max(0,L.urn.shake-dt*3);
    if(wv){L.spawnT-=dt;if(L.spawnT<=0&&L.left>0){const k=wv.pair&&L.left>1?2:1;const side0=L.spawned%2?1:-1,top0=rand()<.3,ry=110+rand()*230,rx=120+rand()*260;for(let i=0;i<k;i++){const side=side0,top=top0,off=i*150;
          const x=top?L.urn.x+side*rx:(side<0?-30-off:W+30+off),y=top?-30-off:ry;spawnEB(L,{k:'shot',x,y,vx:0,vy:0,r:17,spr:'ghostE',parry:true,harmless:true,maus:true,spd:wv.spd*(wv.fast&&rand()<.3?1.4:1),ph:rand()*TAU});
          L.spawned++;L.left--;}sfx('laugh');L.spawnT=wv.gap;}
      if(L.left<=0&&!L.eb.some(e=>e.maus&&!e.dead)){L.wave++;if(MAUS_WAVES[L.wave]){L.left=MAUS_WAVES[L.wave].n;L.spawnT=2;banner(L,'¡OLEADA '+(L.wave+1)+'!',1.4);sfx('ready');}
        else{L.state='win';L.stateT=0;banner(L,'¡URNA A SALVO!',2.2);sfx('victory');for(let i=0;i<4;i++)stars(L,L.urn.x,L.urn.y-20,6);}}}
    for(const e of L.eb){if(!e.maus||e.dead)continue;e.t2=(e.t2||0)+dt;const a=Math.atan2(L.urn.y-e.y,L.urn.x-e.x);e.vx=Math.cos(a)*e.spd;e.vy=Math.sin(a)*e.spd+Math.cos(e.t2*3+e.ph)*60;
      if(dist(e.x,e.y,L.urn.x,L.urn.y)<36&&L.state==='play'){e.dead=true;L.urn.cracked=true;L.urn.shake=1;sfx('crack');shake(L,18);boom(L,L.urn.x,L.urn.y,60);banner(L,'¡ROMPIERON LA URNA!',2.4);
        for(const p of L.Ps){if(p.dead)continue;p.spare=true;p.hp=0;kill(L,p);}}}
    const before=L.parries;};
  const baseParries=()=>L.parries;
  L.idle=()=>{L.urn.shake=Math.max(0,L.urn.shake-.02);};
  L.progress=()=>clamp((L.spawned-L.eb.filter(e=>e.maus&&!e.dead).length)/L.total,0,1);
  L.drawBG=()=>{ctx.drawImage(mausBG(),0,0,W,H);if(LEVELS[id].tint){ctx.fillStyle=LEVELS[id].tint;ctx.fillRect(0,0,W,H);}for(const x of[180,780]){const f=.7+Math.sin(L.t*12+x)*.3;circ(x,300,40*f,'rgba(255,200,120,.08)',0);rr(x-6,300,12,40,2,C.paper,2.5);ell(x,293,4*f,9*f,'#ffd36a',0);}};
  L.drawWorld=()=>{const u=L.urn,sx=(rand()-.5)*u.shake*8;ctx.save();ctx.translate(u.x+sx,0);rr(-48,GROUND-34,96,34,4,'#7a7088',3.5);rr(-56,GROUND-44,112,14,4,'#8f8a90',3);
    ctx.beginPath();ctx.moveTo(-22,GROUND-44);ctx.quadraticCurveTo(-46,GROUND-80,-24,GROUND-110);ctx.lineTo(24,GROUND-110);ctx.quadraticCurveTo(46,GROUND-80,22,GROUND-44);ctx.closePath();ctx.fillStyle=u.cracked?'#8a7650':C.brass;ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();
    rr(-28,GROUND-122,56,14,4,C.brassD||C.brass,3);ell(-9,GROUND-82,4,6,C.ink,0);ell(9,GROUND-82,4,6,C.ink,0);ctx.beginPath();ctx.moveTo(-7,GROUND-68);ctx.quadraticCurveTo(0,GROUND-62,7,GROUND-68);ctx.lineWidth=2.4;ctx.strokeStyle=C.ink;ctx.stroke();
    if(u.cracked){line(-10,GROUND-108,4,GROUND-86,3);line(4,GROUND-86,-6,GROUND-64,3);}ctx.restore();};
  L.drawFG=()=>{card(W/2-110,24,220,38,C.paper);txt(`Fantasmas: ${L.total-(L.spawned-L.eb.filter(e=>e.maus&&!e.dead).length)}`,W/2,44,18,C.ink,null);
    btxt('Aquí no puedes disparar: salta y haz parry a los fantasmas',W/2,78,14,C.paper,'center',800);};
  L.intro=LEVELS[id].intro;return L;}
