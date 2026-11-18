/* pantallas.js — the defeat card and the results page, done like the 1930s-cartoon games:
   - defeat: an old printed card drops in, with the boss's portrait in a circle, a mocking quote,
     a progress line with the phase marks and a tiny runner showing how far you got, and the menu
   - results: spinning sepia rays, your hero cheering on the left and a printed "RESULTADOS" sheet
     with dotted lines that fill in one by one and a big stamped grade
   Same menus and keys as before; only the drawing changed. */
(function(){
const GENERIC=['¡Vuelve cuando sepas brillar!','¿Eso era todo? ¡Qué chispita más floja!','¡Apagado y fuera!','¡Otra vez será, cerillita!'];
function quote(L){const q=(typeof TAUNTS!=='undefined'&&TAUNTS[L.id])||GENERIC;return q[Math.floor((L.time||0)*7)%q.length];}
function paper(x,y,w,h,rot){ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||0);ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(-w/2+10,-h/2+12,w,h);
  ctx.fillStyle='#efe3c4';ctx.fillRect(-w/2,-h/2,w,h);const r=srand(7);for(let i=0;i<160;i++){ctx.fillStyle=`rgba(120,80,30,${r()*.07})`;ctx.fillRect(-w/2+r()*w,-h/2+r()*h,r()*4+1,r()*4+1);}
  ctx.lineWidth=3;ctx.strokeStyle='#2a4a4a';ctx.strokeRect(-w/2+10,-h/2+10,w-20,h-20);ctx.lineWidth=1.2;ctx.strokeRect(-w/2+16,-h/2+16,w-32,h-32);ctx.restore();}
function portrait(L,cx,cy,R){ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fillStyle='#e2cfa6';ctx.fill();ctx.clip();
  const B=L.boss;if(B&&B.def&&B.def.draw){try{const c=B.center?B.center():{x:B.x,y:B.y-150};ctx.translate(cx,cy+R*.25);const s=R/150;ctx.scale(s,s);ctx.translate(-c.x,-c.y);const sv=B.flash;B.flash=0;B.def.draw(B,L);B.flash=sv;}catch(e){}}
  else{drawGhost&&drawGhost(L.Ps[0]?L.Ps[0].char:'chispa',cx,cy+10,L.t,null,'plat');}
  ctx.restore();ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.lineWidth=5;ctx.strokeStyle='#2a4a4a';ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,R+7,0,TAU);ctx.lineWidth=2;ctx.stroke();}
function deadCard(L){const T=L.stateT;ctx.fillStyle=`rgba(12,8,6,${Math.min(.78,T*.6)})`;ctx.fillRect(0,0,W,H);
  if(T<1.3){ctx.save();ctx.globalAlpha=Math.min(1,T*2)*.85;const g=ctx.createRadialGradient(W/2,H/2,60,W/2,H/2,H*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,5,20,.9)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();return;}
  const k=Math.min(1,(T-1.3)/.35),e=1-Math.pow(1-k,3),cw=400,ch=470,cx=W/2-cw/2,cy=(H-ch)/2-(1-e)*600;
  paper(cx,cy,cw,ch,-.02+(1-e)*.2);const x0=-cw/2,y0=-ch/2;
  ctx.save();ctx.translate(W/2,cy+ch/2);ctx.rotate(-.02+(1-e)*.2);
  ctx.save();ctx.translate(-W/2,-(cy+ch/2));portrait(L,W/2,cy+92,62);ctx.restore();
  ctx.font=`italic 700 17px ${BFONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#2a1d14';
  const q='«'+quote(L)+'»';const words=q.split(' ');let ln='',ly=y0+188;const lines=[];for(const w of words){const t=ln?ln+' '+w:w;if(ctx.measureText(t).width>cw-70&&ln){lines.push(ln);ln=w;}else ln=t;}lines.push(ln);lines.slice(0,3).forEach((s,i)=>ctx.fillText(s,0,ly+i*22));
  const pr=Math.max(0,Math.min(1,L.progress?L.progress():0)),lx=-150,lw=300,yy=y0+272;ctx.lineWidth=3;ctx.strokeStyle='#2a1d14';ctx.beginPath();ctx.moveTo(lx,yy);ctx.lineTo(lx+lw,yy);ctx.stroke();
  if(L.boss){const n=L.boss.def.phases.length;for(let i=1;i<n;i++){line(lx+lw*i/n,yy-8,lx+lw*i/n,yy+8,3,'#2a1d14');}}
  ctx.save();ctx.translate(lx+lw,yy-10);poly([[0,10],[0,-18],[16,-12],[0,-6]],C.rust,2);ctx.restore();
  const rx=lx+lw*pr,bob=Math.abs(Math.sin(L.t*10))*3;circ(rx,yy-10-bob,9,L.Ps[0]&&L.Ps[0].char==='cerilla'?'#e8562e':L.Ps[0]&&L.Ps[0].char==='velita'?'#bfe0ff':'#ffe9a0',2.5);line(rx-4,yy-2-bob,rx-7,yy+6,2.5);line(rx+4,yy-2-bob,rx+8,yy+5,2.5);
  btxt('Llegaste al '+Math.round(pr*100)+' %',0,yy+30,15,'#2a1d14','center',800);
  const items=['REINTENTAR','VOLVER AL MAPA'];items.forEach((s,i)=>{const on=L.menu===i,y=y0+336+i*40;if(on){ctx.save();ctx.translate(-s.length*9.5-22,y);ctx.rotate(L.t*3);star(0,0,9,4,5,0);ctx.fillStyle=C.brass;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
    txt(s,0,y,on?27:23,i===0?(on?'#c8392b':'#a0503a'):(on?'#2a1d14':'#5a4a3a'),null);});
  ctx.font=`700 10px ${BFONT}`;ctx.fillStyle='rgba(42,29,20,.7)';ctx.textAlign='left';ctx.fillText('© 1936 · Estudios Chispa y Cerilla',x0+24,y0+ch-28);ctx.textAlign='right';ctx.fillText(L.boss?'FASE '+(L.boss.phase+1)+' DE '+L.boss.def.phases.length:'NIVEL',x0+cw-24,y0+ch-28);
  ctx.restore();btxt('↑ ↓ elegir · Enter o saltar: aceptar',W/2,H-14,13,'rgba(239,224,191,.75)','center',700);}
function results(L){const r=L.result,T=L.stateT,t=L.t;ctx.fillStyle='#2a1a10';ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W*.28,H*.55);ctx.rotate(t*.15);for(let i=0;i<18;i++){ctx.rotate(TAU/18);ctx.fillStyle=i%2?'rgba(214,170,100,.22)':'rgba(120,70,30,.18)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(900,-90);ctx.lineTo(900,90);ctx.closePath();ctx.fill();}ctx.restore();
  const g=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.6)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const k=Math.min(1,T/.5);{const gl=ctx.createRadialGradient(W*.24,H*.62,10,W*.24,H*.62,200);gl.addColorStop(0,'rgba(255,230,160,.55)');gl.addColorStop(1,'rgba(255,230,160,0)');ctx.fillStyle=gl;ctx.fillRect(0,0,W*.5,H);ell(W*.24,H*.8+4,90,14,'rgba(0,0,0,.35)',0);}
  L.Ps.forEach((p,i)=>{const n=L.Ps.length,x=W*.24+(i-(n-1)/2)*100,y=H*.8+(1-k)*200;ctx.save();ctx.globalAlpha=k;
    try{drawHero({x,y,char:p.char,face:1,anim:t*8,run:false,scale:n>1?1.35:1.9,aimX:1,aimY:-1,flash:false,armsUp:true,skin:p.eq&&p.eq.skin});}catch(e){}ctx.restore();});
  const won=L.kind==='run'?'¡NIVEL SUPERADO!':'¡GANASTE!';ctx.save();ctx.translate(W*.24,70+Math.sin(t*3)*3);ctx.rotate(-.05);txt(won,0,0,40,'#ffe27a',C.ink);ctx.restore();
  const px=W*.47,py=40,pw=W*.48,ph=H-80,e=Math.min(1,T/.45);paper(px,py+(1-e)*(1-e)*500,pw,ph,.015);
  ctx.save();ctx.translate(px+pw/2,py+ph/2+(1-e)*(1-e)*500);ctx.rotate(.015);const x0=-pw/2+40,x1=pw/2-40;
  txt('RESULTADOS',0,-ph/2+52,38,'#2a4a4a',null);line(-pw/2+40,-ph/2+80,pw/2-40,-ph/2+80,2,'#2a4a4a');
  const maxHp=Math.max(...L.Ps.map(p=>p.maxHp||3)),hpLeft=Math.max(...L.Ps.map(p=>p.dead?0:p.hp));
  const rows=[['Tiempo',typeof fmt==='function'?fmt(L.time):Math.round(L.time)+'s'],['Golpes recibidos',String(L.hits)],['Parrys',String(L.parries)],['EX y súper',String(L.exs+L.supers)],L.kind==='run'?['Monedas nuevas',String(L.coinsGot.length)]:['Vida restante',hpLeft+' / '+maxHp]];
  ctx.font=`800 19px ${BFONT}`;ctx.textBaseline='middle';rows.forEach(([a,b],i)=>{if(i>=r.shown)return;const y=-ph/2+118+i*40;ctx.fillStyle='#2a1d14';ctx.textAlign='left';ctx.fillText(a,x0,y);ctx.textAlign='right';ctx.fillText(b,x1,y);
    const w1=ctx.measureText(b).width;ctx.textAlign='left';const a1=ctx.measureText(a).width;ctx.fillStyle='rgba(42,29,20,.45)';for(let x=x0+a1+10;x<x1-w1-10;x+=9)ctx.fillRect(x,y+5,3,3);});
  if(r.shown>=6){const gy=ph/2-92,gs=Math.min(1,(T-(r.gradeT||0))*4);txt('NOTA',x0+60,gy,22,'#2a4a4a',null);ctx.save();ctx.translate(x1-90,gy-6);const st=Math.max(1,2.4-T*0+0);ctx.rotate(-.14);
    circ(0,0,54,'rgba(200,57,43,.12)',4);ctx.lineWidth=4;ctx.strokeStyle='#c8392b';ctx.beginPath();ctx.arc(0,0,48,0,TAU);ctx.stroke();txt(r.grade,0,4,r.grade.length>1?58:72,'#c8392b',null);
    for(let i=0;i<8;i++){const a=i*TAU/8+t;star(Math.cos(a)*70,Math.sin(a)*70,6,2.5,4,t*2);ctx.fillStyle='#ffd25a';ctx.fill();}ctx.restore();
    let yy=gy+60;if(r.unlock){btxt('¡Súper nuevo: '+r.unlock+'!',0,yy-150,17,C.rust,'center',800);}if(r.reward){coinIcon(-90,yy-120,10);btxt(`+${r.reward} moneda${r.reward>1?'s':''}`,-72,yy-120,17,'#2a1d14','left',800);}}
  ctx.restore();
  if(cfg.diff==='facil'&&L.kind!=='run'&&r.shown>=6){ctx.save();ctx.translate(W*.72,H-26);ctx.rotate(-.02);rr(-230,-15,460,30,6,'#c8392b',3);btxt('En Fácil no cuenta para el barco: gánalo en Normal',0,1,14,C.paper,'center',800);ctx.restore();}
  if(T>2.4&&Math.floor(t*2)%2===0)txt('Enter o saltar: continuar',W*.24,H-22,18,C.paper,C.ink);}
const _lo=levelOverlay;
levelOverlay=function(L){if(L.state==='dead'){ctx.save();try{deadCard(L);}finally{ctx.restore();}return;}if(L.state==='results'){ctx.save();try{results(L);}finally{ctx.restore();}return;}_lo(L);};
})();
