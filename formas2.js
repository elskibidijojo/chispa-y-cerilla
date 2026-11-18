/* formas2.js — every boss that didn't have its own hand-drawn forms now TRANSFORMS between phases too.
   Each boss gets its own mix of a costume and a new silhouette, chosen to fit it:
   costumes:    demonio (horns + tail, red), hielo (ice spikes, icy blue), oro (crown, golden), robot (antenna + bolts, metal),
                negativo (photo-negative nightmare), fuego (crown of fire, embers), tormenta (its own storm cloud with lightning),
                zombi (stitches, flies, green), disco (colour-cycling with a disco ball)
   silhouettes: cabeza (the body is gone, only the top half flies on rocket flames), partido (split in two halves with
                electricity between them), gigante (grows bigger), fantasma (a floating ghost with a sheet tail),
                globos (lifted off the ground by balloons)
   Hitboxes follow the silhouette. Drawing-wise it reuses the boss's own art; hitbox math only uses B.t/B.phase, so online stays in sync.
   Low quality mode skips the colour filters (they're the heavy part) and keeps the rest. */
(function(){
const F=window.BOSS_FORMS;if(!F)return;
const hs=i=>{const s=Math.sin(i*12.9898+78.233)*43758.5453;return s-Math.floor(s);};
const low=()=>typeof PERF!=='undefined'&&PERF.level>=2;
function bbox(sh){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const s of sh){if(s.w!==undefined){x0=Math.min(x0,s.x);y0=Math.min(y0,s.y);x1=Math.max(x1,s.x+s.w);y1=Math.max(y1,s.y+s.h);}else{x0=Math.min(x0,s.x-s.r);y0=Math.min(y0,s.y-s.r);x1=Math.max(x1,s.x+s.r);y1=Math.max(y1,s.y+s.r);}}
  if(x0>x1)return null;return{x:x0,y:y0,w:x1-x0,h:y1-y0,cx:(x0+x1)/2,cy:(y0+y1)/2};}
const FILT={demonio:'hue-rotate(-25deg) saturate(1.6) brightness(.85)',hielo:'hue-rotate(170deg) saturate(.75) brightness(1.18)',oro:'sepia(1) saturate(2.4) hue-rotate(-8deg) brightness(1.08)',
  robot:'grayscale(.85) sepia(.3) contrast(1.1)',negativo:'invert(1) hue-rotate(180deg)',fuego:'saturate(1.5) hue-rotate(-14deg) brightness(.95)',tormenta:'brightness(.78) saturate(.8) hue-rotate(15deg)',
  zombi:'hue-rotate(75deg) saturate(.7) brightness(.95)',fantasma:'saturate(.4) brightness(1.2) hue-rotate(200deg)'};
const sil0=(st,B)=>st.sil;
/* silhouette parameters (deterministic, used by draw AND hitbox) */
function P(st,B,bb,plane){const t=B.t;switch(st.sil){
  case'cabeza':return{cut:bb.y+bb.h*(st.f||.5),lift:40+Math.sin(t*3)*10};
  case'partido':return{g:24+Math.sin(t*4)*8};
  case'gigante':return{s:st.s||1.2,px:bb.cx,py:plane?bb.cy:bb.y+bb.h};
  case'fantasma':return{cut:bb.y+bb.h*(plane?.78:.7),lift:(plane?0:24)+Math.sin(t*2.4)*8};
  case'globos':return{lift:56+Math.sin(t*2)*8};}return{};}
function xShapes(st,B,sh,plane){const bb=bbox(sh);if(!bb||!st.sil)return sh;const p=P(st,B,bb,plane);
  const cutTop=(cut,lift)=>{const out=[];for(const s of sh){if(s.w!==undefined){const y1=Math.min(s.y+s.h,cut);if(y1>s.y)out.push({x:s.x,y:s.y-lift,w:s.w,h:y1-s.y});}else if(s.y-s.r*.3<cut)out.push({x:s.x,y:s.y-lift,r:s.r});}return out.length?out:[{x:bb.x,y:bb.y-lift,w:bb.w,h:cut-bb.y}];};
  switch(st.sil){
    case'cabeza':return cutTop(p.cut,p.lift);
    case'fantasma':return cutTop(p.cut,p.lift);
    case'partido':{const o=[];for(const s of sh)for(const d of[-1,1])o.push(s.w!==undefined?{x:s.x+d*p.g,y:s.y,w:s.w,h:s.h}:{x:s.x+d*p.g,y:s.y,r:s.r});return o;}
    case'gigante':return sh.map(s=>s.w!==undefined?{x:p.px+(s.x-p.px)*p.s,y:p.py+(s.y-p.py)*p.s,w:s.w*p.s,h:s.h*p.s}:{x:p.px+(s.x-p.px)*p.s,y:p.py+(s.y-p.py)*p.s,r:s.r*p.s});
    case'globos':return sh.map(s=>Object.assign({},s,{y:s.y-p.lift}));}
  return sh;}

/* ---- costume extras, drawn around the (transformed) box ---- */
function flame(x,y,h,w,t,i=0){const f=Math.sin(t*14+i*2.3)*.18;ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w*1.1,y-h*.55,x+w*f*3,y-h);ctx.quadraticCurveTo(x+w*1.1,y-h*.55,x+w,y);ctx.closePath();ctx.fillStyle='#ff7a2e';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-w*.5,y);ctx.quadraticCurveTo(x-w*.5,y-h*.4,x+w*f*2,y-h*.62);ctx.quadraticCurveTo(x+w*.5,y-h*.4,x+w*.5,y);ctx.closePath();ctx.fillStyle='#ffe27a';ctx.fill();}
function sparkle(x,y,r,col){ctx.beginPath();ctx.moveTo(x,y-r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.quadraticCurveTo(x,y,x,y+r);ctx.quadraticCurveTo(x,y,x-r,y);ctx.quadraticCurveTo(x,y,x,y-r);ctx.fillStyle=col;ctx.fill();}
function costumeBehind(c,bb,t){if(c==='negativo'){ctx.save();const g=ctx.createRadialGradient(bb.cx,bb.cy,10,bb.cx,bb.cy,Math.max(bb.w,bb.h)*.8);g.addColorStop(0,'rgba(150,60,220,.45)');g.addColorStop(1,'rgba(150,60,220,0)');ctx.fillStyle=g;ctx.fillRect(bb.cx-400,bb.cy-400,800,800);ctx.restore();}
  if(c==='disco'){ctx.save();for(let i=0;i<10;i++){const a=t*1.5+i*TAU/10,d=120+((i*37)%80);ctx.globalAlpha=.35;circ(bb.cx+Math.cos(a)*d*1.6,bb.cy+Math.sin(a)*d*.6,10,`hsl(${(i*36+t*90)%360},90%,65%)`,0);}ctx.restore();}}
function costumeFront(c,bb,t,B){const cx=bb.cx,top=bb.y,w=Math.min(bb.w,240);ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  if(c==='demonio'){for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(cx+s*w*.22,top+10);ctx.quadraticCurveTo(cx+s*w*.42,top-10,cx+s*w*.46,top-46);ctx.quadraticCurveTo(cx+s*w*.3,top-12,cx+s*w*.1,top+14);ctx.closePath();ctx.fillStyle='#c8392b';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();}
    const tx=bb.x+bb.w-10,ty=bb.y+bb.h*.75,wv=Math.sin(t*4)*14;ctx.beginPath();ctx.moveTo(tx,ty);ctx.bezierCurveTo(tx+50,ty+10+wv,tx+30,ty-60,tx+70,ty-70-wv);ctx.lineWidth=7;ctx.strokeStyle=C.ink;ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle='#c8392b';ctx.stroke();poly([[tx+70,ty-90-wv],[tx+86,ty-62-wv],[tx+56,ty-64-wv]],'#c8392b',2.5);}
  else if(c==='hielo'){for(let i=0;i<5;i++){const x=cx-w*.36+i*w*.18,h=26+((i*13)%3)*12+Math.sin(t*2+i)*3;poly([[x-11,top+8],[x,top-h],[x+11,top+8]],'#cfefff',2.5);}
    for(let i=0;i<5;i++){const a=t*.8+i*TAU/5,x=cx+Math.cos(a)*(bb.w*.6+20),y=bb.cy+Math.sin(a)*bb.h*.45;ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<3;k++){const b=k*Math.PI/3;ctx.moveTo(x-Math.cos(b)*7,y-Math.sin(b)*7);ctx.lineTo(x+Math.cos(b)*7,y+Math.sin(b)*7);}ctx.stroke();}}
  else if(c==='oro'){const y=top-6,cw=Math.min(90,w*.5);ctx.beginPath();ctx.moveTo(cx-cw/2,y);for(let i=0;i<=4;i++){ctx.lineTo(cx-cw/2+i*cw/4,y-(i%2?18:38));}ctx.lineTo(cx+cw/2,y);ctx.closePath();ctx.fillStyle=C.gold;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();for(let i=0;i<3;i++)circ(cx-cw/2+i*cw/2,y-(i===1?18:38)+(i===1?0:0),4,'#e8562e',1.5);
    for(let i=0;i<4;i++){const k=Math.floor(t*2+i*.25),u=(t*2+i*.25)%1;ctx.globalAlpha=Math.sin(u*Math.PI);sparkle(bb.x+hs(k*4+i)*bb.w,bb.y+hs(k*4+i+1)*bb.h,5+6*Math.sin(u*Math.PI),'#fff6c8');}}
  else if(c==='robot'){line(cx,top+6,cx,top-40,4);const on=Math.floor(t*3)%2;circ(cx,top-46,8,on?'#ff5a5a':'#7a2a2a',3);if(on){ctx.globalAlpha=.4;circ(cx,top-46,16,'#ff5a5a',0);ctx.globalAlpha=1;}
    for(const s of[-1,1]){const x=s<0?bb.x-6:bb.x+bb.w+6,y=bb.y+bb.h*.4;rr(x-9,y-7,18,14,3,C.steelD,2.5);circ(x+s*10,y,6,C.steel,2.5);}
    for(let i=0;i<5;i++)circ(bb.x+bb.w*(.15+i*.175),bb.y+bb.h*.9,3,C.steel,1.5);}
  else if(c==='fuego'){for(let i=0;i<5;i++)flame(cx-w*.3+i*w*.15,top+6+Math.abs(i-2)*5,28+Math.sin(t*9+i)*7,10,t,i);for(let i=0;i<10;i++){const u=(t*.6+hs(i))%1;ctx.globalAlpha=1-u;circ(bb.x+hs(i+3)*bb.w,bb.y+bb.h-u*bb.h*1.4,2+hs(i)*2,'#ffcf5a',0);}}
  else if(c==='tormenta'){const y=top-58+Math.sin(t*1.5)*4;ctx.globalAlpha=.95;cloudShape(ctx,cx-62,y,1.05,'#4a4f66',4);ctx.globalAlpha=.5;ctx.strokeStyle='#bcd0ff';ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<10;i++){const x=cx-50+i*11,yy=y+20+((t*240+i*31)%60);ctx.moveTo(x,yy);ctx.lineTo(x-3,yy+10);}ctx.stroke();ctx.globalAlpha=1;
    const cyc=1.7,n=Math.floor(t/cyc);if(t-n*cyc<.16){ctx.strokeStyle='#fffbe0';ctx.lineWidth=4;ctx.beginPath();let x=cx-20+hs(n)*40;ctx.moveTo(x,y+20);for(let k=1;k<=4;k++){x+=(hs(n*5+k)-.5)*30;ctx.lineTo(x,y+20+k*18);}ctx.stroke();}}
  else if(c==='zombi'){ctx.strokeStyle=C.ink;ctx.lineWidth=3;const y=bb.y+bb.h*.45;ctx.beginPath();ctx.moveTo(bb.x+bb.w*.2,y);ctx.lineTo(bb.x+bb.w*.8,y+10);ctx.stroke();for(let i=0;i<5;i++){const x=bb.x+bb.w*(.25+i*.12),yy=y+i*2;ctx.beginPath();ctx.moveTo(x-4,yy-7);ctx.lineTo(x+4,yy+7);ctx.stroke();}
    for(let i=0;i<3;i++){const a=t*5+i*2.1;const fx=cx+Math.cos(a)*(w*.45),fy=top-10+Math.sin(a*1.7)*14;circ(fx,fy,3,C.ink,0);ctx.globalAlpha=.6;ell(fx-2,fy-3,3,2,'#fff',0);ell(fx+2,fy-3,3,2,'#fff',0);ctx.globalAlpha=1;}}
  else if(c==='disco'){const y=top-60;line(cx,y-80,cx,y-18,2);ctx.save();ctx.translate(cx,y);ctx.rotate(t);circ(0,0,18,'#c9cdd2',3);ctx.strokeStyle='rgba(20,13,8,.4)';ctx.lineWidth=1;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-18,i*7);ctx.lineTo(18,i*7);ctx.stroke();ctx.beginPath();ctx.moveTo(i*7,-18);ctx.lineTo(i*7,18);ctx.stroke();}ctx.restore();}
  ctx.restore();}

function torn(x0,x1,y,seed){ctx.save();ctx.beginPath();ctx.moveTo(x0,y);let i=0;for(let x=x0;x<=x1;x+=14,i++)ctx.lineTo(x,y+(i%2?8:-4)+hs(seed+i)*4);ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
function drawStyled(st,B,L,od){const plane=B.def.kind==='plane',sh=B.def._os0?B.def._os0(B):B.shapes(),bb=bbox(sh);if(!bb){od(B,L);return;}
  const t=B.t,p=P(st,B,bb,plane),cos=st.cos,fl=!low()&&(FILT[cos]||(st.sil==='fantasma'?FILT.fantasma:''));
  const runOD=()=>{ctx.save();if(fl)ctx.filter=fl;try{od(B,L);}finally{ctx.restore();}};
  ctx.save();
  if(!st.sil){costumeBehind(cos,bb,t);runOD();costumeFront(cos,bb,t,B);}
  else if(st.sil==='cabeza'){const bb2=Object.assign({},bb,{y:bb.y-p.lift,h:p.cut-bb.y,cy:(bb.y+p.cut)/2-p.lift});if(!plane)shadowE(bb.cx,GROUND+3,bb.w*.35,.22);
    for(const s of[-1,1]){const fx=bb.cx+s*bb.w*.22,fy=p.cut-p.lift+4;ctx.save();ctx.translate(fx,fy);ctx.scale(1,-1);flame(0,0,46+Math.sin(t*20+s)*10,12,t,s);ctx.restore();rr(fx-12,fy-8,24,12,4,C.steelD,3);}
    costumeBehind(cos,bb2,t);ctx.save();ctx.translate(0,-p.lift);ctx.beginPath();ctx.rect(-3000,-3000,6000+W,p.cut+3000);ctx.clip();runOD();ctx.restore();torn(bb.x-6,bb.x+bb.w+6,p.cut-p.lift,B.def.id.length*3);costumeFront(cos,bb2,t,B);}
  else if(st.sil==='fantasma'){const bb2=Object.assign({},bb,{y:bb.y-p.lift,cy:bb.cy-p.lift,h:p.cut-bb.y});costumeBehind(cos,bb2,t);
    ctx.save();ctx.globalAlpha=.88;ctx.translate(0,-p.lift);ctx.beginPath();ctx.rect(-3000,-3000,6000+W,p.cut+3000);ctx.clip();runOD();ctx.restore();
    const y=p.cut-p.lift;ctx.beginPath();ctx.moveTo(bb.x-4,y-6);const n=6;for(let i=0;i<=n;i++){const x=bb.x-4+(bb.w+8)*i/n;ctx.lineTo(x,y+46+Math.sin(t*5+i*1.3)*10+(i%2?16:0));}ctx.lineTo(bb.x+bb.w+4,y-6);ctx.closePath();ctx.fillStyle='rgba(228,220,255,.82)';ctx.fill();ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.stroke();
    if(!plane){ctx.globalAlpha=.25;shadowE(bb.cx,GROUND+3,bb.w*.3,.3);ctx.globalAlpha=1;}costumeFront(cos,bb2,t,B);}
  else if(st.sil==='partido'){const cx=bb.cx;costumeBehind(cos,bb,t);
    for(const d of[-1,1]){ctx.save();ctx.translate(d*p.g,0);ctx.beginPath();if(d<0)ctx.rect(-3000,-3000,cx+3000,6000);else ctx.rect(cx,-3000,6000,6000);ctx.clip();runOD();ctx.restore();
      ctx.save();ctx.beginPath();let i=0;for(let y=bb.y;y<=bb.y+bb.h;y+=14,i++)ctx.lineTo(cx+d*p.g+(i%2?5:-5)*d,y);ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}
    ctx.save();ctx.lineCap='round';for(let k=0;k<3;k++){const y=bb.y+bb.h*(.25+k*.25),n=Math.floor(t*14+k);ctx.strokeStyle=k%2?'#9ff0ff':'#fff27a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx-p.g,y);for(let j=1;j<4;j++)ctx.lineTo(cx-p.g+j*p.g/2,y+(hs(n*7+j)-.5)*22);ctx.lineTo(cx+p.g,y);ctx.stroke();}ctx.restore();
    costumeFront(cos,bb,t,B);}
  else if(st.sil==='gigante'){ctx.save();ctx.translate(p.px,p.py);ctx.scale(p.s,p.s);ctx.translate(-p.px,-p.py);costumeBehind(cos,bb,t);runOD();costumeFront(cos,bb,t,B);ctx.restore();}
  else if(st.sil==='globos'){if(!plane)shadowE(bb.cx,GROUND+3,bb.w*.35,.22);ctx.save();ctx.translate(0,-p.lift);const top=bb.y;const cols=['#e8562e','#2e8f86','#d9407a'];
    for(let i=0;i<3;i++){const bx=bb.cx+(i-1)*bb.w*.35,by=top-90-(i===1?20:0)+Math.sin(t*2+i)*5;line(bb.cx+(i-1)*bb.w*.2,top+6,bx,by+30,1.8);ell(bx,by,24,30,cols[i],3);poly([[bx-5,by+30],[bx+5,by+30],[bx,by+24]],cols[i],2);ell(bx-8,by-10,5,9,'rgba(255,255,255,.5)',0);}
    costumeBehind(cos,bb,t);runOD();costumeFront(cos,bb,t,B);ctx.restore();}
  ctx.restore();}

/* ---- who becomes what (phase 1 is always the normal look) ---- */
const S=(cos,sil)=>({cos,sil});
const PLAN={
  baron:[S('tormenta'),S('negativo','gigante')],faro:[S('robot'),S('fuego','cabeza')],cangrejo:[S('oro'),S('demonio','partido')],ballena:[S('hielo'),S(null,'fantasma')],
  paraguas:[S('tormenta'),S('disco','globos')],caldera:[S('fuego'),S('robot','partido')],vela:[S('hielo'),S('negativo','fantasma')],buho:[S('robot'),S('demonio','gigante')],
  murcielago:[S('oro'),S('negativo','partido')],espantapajaros:[S('zombi'),S('fuego','cabeza')],maquina:[S('oro'),S('tormenta','partido')],chistera:[S('disco'),S('negativo','fantasma')],
  apagon:[S('robot'),S('negativo'),S('fuego','fantasma')],trompo:[S('disco'),S('fuego','partido')],pulpo:[S('zombi'),S('tormenta','gigante')],cuervo:[S('robot'),S('demonio','cabeza')],
  radio:[S('disco'),S('tormenta'),S('negativo','partido')],tempano:[S('oro'),S('hielo','gigante')],cometa:[S('hielo'),S('fuego','fantasma')],pinguino:[S('robot'),S('hielo','gigante')],
  volcana:[S('demonio'),S('fuego','gigante')],termometro:[S('hielo'),S('fuego','partido')],polilla:[S('oro'),S('negativo','fantasma')],hollin:[S('zombi'),S('fuego'),S('negativo','partido')],
  topo:[S('oro','gigante')],canica:[S('disco','partido')],bolos:[S('oro','globos')],diana:[S('demonio','gigante')],caja:[S('zombi','gigante')],globo:[S('negativo','gigante')],
  tombola:[S('oro'),S('disco','partido')],sota:[S('zombi','gigante')],reina:[S('demonio','fantasma')],rey:[S('fuego','partido')],as:[S('negativo','fantasma')],
  proyec:[S('tormenta'),S('negativo','fantasma')],sombra:[S('negativo'),S('fuego')],rascacielos:[S('robot'),S('fuego')],cafetera:[S('fuego'),S('robot','cabeza')],
  buzo:[S('oro'),S('zombi','fantasma')],linterna:[S('negativo'),S('fuego','gigante')],heladero:[S('oro'),S('hielo','partido')],globoaero:[S('tormenta'),S('fuego','gigante')],
  libelula:[S('oro'),S('zombi','fantasma')],pezvolador:[S('robot'),S('tormenta','partido')],escoba:[S('zombi'),S('negativo','gigante')],gargola:[S('oro'),S('demonio','partido')],
  aurora:[S('disco'),S('hielo','fantasma')],abeto:[S('oro'),S('fuego','gigante')],jengibre:[S('demonio'),S('fuego','partido')],trineo:[S('hielo'),S('disco','gigante')],
};
for(const id in PLAN){if(F[id])continue;const list=[null,...PLAN[id]];
  F[id]={draw:list.map(st=>st?((B,L,od)=>drawStyled(st,B,L,od)):null),
         shapes:list.map(st=>st&&st.sil?(B=>xShapes(st,B,B.def._os0(B),B.def.kind==='plane')):null),style:list};}
/* remember each boss's original hitbox before formas.js wraps it */
const _mbl=makeBossLevel;makeBossLevel=function(def){if(!def._os0)def._os0=def.shapes;return _mbl(def);};
})();
