/* historia.js — the storybook. Every chapter is an open book on a table: an illustrated page on the
   left, the narration on the right, and the page turns when you go on. A chapter plays when you
   arrive at each island, when you beat the five bosses of an island, and when you first enter the
   Cine Fantasma and the Casino. All text and pictures are original. */
(function(){
/* ---------------- the story ---------------- */
Object.assign(STORIES,{
  intro:[
    {cap:'Érase una vez…',t:'En el archipiélago de Hojalata todo funcionaba a cuerda y a chispazos. Las farolas cantaban, los relojes bailaban y en lo alto del Gran Faro brillaba la Bombilla Madre, que daba luz a todas las islas.',d:'bombilla'},
    {t:'Allí vivían Chispa, la bombilla, Cerilla, el fósforo, y Velita, la vela. Su trabajo era fácil: encender las farolas cada noche… aunque casi siempre llegaban tarde por quedarse jugando.',d:'heroes'},
    {t:'Una noche, jugando al escondite dentro del faro, dejaron la ventana abierta. Por ella se coló una sombra con corona: el Rey Apagón, que odiaba la luz más que a nada en el mundo.',d:'rey'},
    {t:'¡CRAC! El Rey rompió la Bombilla Madre en mil pedazos y repartió los trocitos entre los cacharros más gruñones de cada isla. «Guardádmelos bien», les dijo, «y os daré un poco de mi sombra».',d:'robo'},
    {t:'Con la culpa todavía en la cara, Chispa y Cerilla se miraron y prometieron recuperar cada trocito de luz. Velita, que no quería quedarse a oscuras, se apuntó la primera.',d:'heroes',pose:'promesa'},
    {cap:'Capítulo 1 · Isla de Hojalata',t:'La aventura empezaba en casa: una isla de engranajes, ferias y juguetes donde cinco cacharros malhumorados escondían los primeros trocitos de luz.',d:'hojalata'}],
  fin1:[
    {cap:'¡Isla de Hojalata, encendida!',t:'Con cinco trocitos de luz brillando en el frasco, la Isla de Hojalata volvió a sonar: tic-tac, tilín, ¡cucú! Hasta Don Tornillo cerró la tienda para hacer una fiesta.',d:'trozos',n:5},
    {t:'Pero el frasco seguía casi vacío. En el muelle, el Capitán Remo señaló la niebla del horizonte: «El resto se lo llevaron a Bahía Bruma. Cuando no quede ni un rincón de esta isla por recorrer, subid, grumetes».',d:'barco',to:'bruma'}],
  isla2:[
    {cap:'Capítulo 2 · Bahía Bruma',t:'Una niebla tan espesa que se podía untar en pan cubría la bahía. Allí hasta el faro había olvidado cómo alumbrar, y los barcos chocaban entre sí pidiéndose perdón.',d:'bruma'},
    {t:'Los vecinos del mar, cangrejos, ballenas y pulpos, bailaban al ritmo del Rey Apagón sin darse cuenta: su sombra se les había metido en los zapatos (y en las aletas).',d:'jefes',isl:2},
    {t:'Chispa infló el pecho: «Si el faro no alumbra, alumbramos nosotros». Cerilla, que no sabía nadar, solo pidió una cosa: no mojarse la cabeza.',d:'heroes',pose:'agua'}],
  fin2:[
    {cap:'¡Adiós a la niebla!',t:'La niebla se levantó como el telón de un teatro. El faro, ya tranquilo, giró su luz hacia el norte… y entre rayos y truenos apareció una montaña negra.',d:'trozos',n:10},
    {t:'«La Cumbre Apagón», tembló el Capitán Remo. «El castillo del Rey. Terminad todo lo de la bahía y os dejo en la orilla, pero de ahí arriba no paso ni con diez anclas».',d:'barco',to:'cumbre'}],
  isla3:[
    {cap:'Capítulo 3 · Cumbre Apagón',t:'Aquí nunca salía el sol. Los búhos leían a oscuras, los murciélagos daban clases de silencio y las velas se derretían de puro miedo.',d:'cumbre'},
    {t:'Desde su torre, el Rey Apagón lo vigilaba todo. «Que suban», se rió, «cuantos más trocitos de luz me traigan, más grande será mi colección».',d:'rey'},
    {t:'Velita cogió de la mano a sus amigos. Ella sabía mejor que nadie que la llama más pequeña puede ganarle a la noche más grande.',d:'heroes',pose:'mano'}],
  fin3:[
    {cap:'Las puertas del castillo',t:'El frasco brillaba tanto que ya no cabía ni un trocito más. La puerta del castillo, muerta de miedo, se abrió sola con un chirrido larguísimo.',d:'trozos',n:15},
    {t:'En lo alto de la escalera esperaba el Rey Apagón, con su corona de humo y su capa de noche. Era la hora de la última función.',d:'rey'}],
  ending:[
    {cap:'El último chispazo',t:'Con un último chispazo, el Rey Apagón se fundió como una bombilla vieja. Las sombras volvieron a ser simples sombras, de esas que solo sirven para jugar.',d:'rey',dead:true},
    {t:'Trocito a trocito, Chispa, Cerilla y Velita pegaron la Bombilla Madre con cinta, paciencia y un poco de saliva. ¡Clic! Todo el archipiélago se encendió a la vez.',d:'bombilla'},
    {t:'Las farolas cantaron, los relojes bailaron y hasta los jefes, ya sin sombra, salieron a aplaudir. Alguno incluso pidió perdón.',d:'hojalata',fiesta:true},
    {t:'¿Fin? Casi. Si te quedan jefes por vencer o notas A+ por conseguir, las islas te esperan. Y dicen que, más allá de la niebla, algo empieza a toser humo negro…',d:'valle'}],
  isla4:[
    {cap:'Capítulo 4 · Valle Escarcha',t:'Más allá de la niebla había un valle donde la nieve no era blanca, sino gris como el carbón, y los muñecos de nieve tosían sin parar.',d:'valle'},
    {t:'Era cosa de Don Hollín, el último deshollinador del Rey. Con las sobras de la sombra de su jefe quería tapar todas las chimeneas del mundo.',d:'hollin'},
    {t:'Cerilla se frotó las manos: «¿Frío? ¿Humo? ¡Por fin un trabajo para un fósforo!». Y allá fueron los tres, tiritando pero sonriendo.',d:'heroes',pose:'frio'}],
  fin4:[
    {cap:'El deshielo',t:'Los témpanos se derritieron, la cometa volvió a volar y la nieve, poquito a poco, volvió a ser blanca como el azúcar.',d:'trozos',n:20},
    {t:'Solo quedaba la Fundición, donde Don Hollín soplaba su última nube negra. Los tres héroes se remangaron: era el momento de apagarle el humo.',d:'hollin'}],
  cine:[
    {cap:'Capítulo extra · El Cine Fantasma',t:'En una esquina de la Cumbre había un cine abandonado. Cada noche, a medianoche, el proyector se encendía solo para un público de telarañas.',d:'cine'},
    {t:'Esta noche ponían «La Última Función». De la pantalla salieron una Sota, una Reina y un Rey de la baraja, con ganas de que alguien les ganara la partida.',d:'cine',cartas:true}],
  casino:[
    {cap:'Capítulo extra · El Casino Tómbola',t:'En mitad del valle brillaba un edificio que no necesitaba ninguna Bombilla Madre: el Casino Tómbola, lleno de neones, fichas y musiquita de feria.',d:'casino'},
    {t:'Dentro, siete juegos de feria tenían ganas de pelea. «Aquí se juega limpio», dijo el portero guiñando un ojo… lo que quería decir justo lo contrario.',d:'casino',dentro:true}]});
if(STORIES.ending2){STORIES.ending2[0].cap='¡Adiós, humo!';STORIES.ending2[0].d='hollin';STORIES.ending2[0].dead=true;STORIES.ending2[1].d='bombilla';STORIES.ending2[2].d='heroes';STORIES.ending2[2].pose='fiesta';}

/* ---------------- when chapters play ---------------- */
const F=()=>save.flags||(save.flags={});
const play=(k,after)=>{startStory(k);ST.after=after||null;};const NPON=()=>typeof NP!=='undefined'&&NP.on;
const _toMapH=toMap;
toMap=function(){_toMapH();if(NPON())return;const i=save.island,k='cap'+i;if(i>=2&&i<=4&&STORIES['isla'+i]&&!F()[k]){F()[k]=true;persist();
  if(cleared(BOSS_LIST[i])<2)play('isla'+i,()=>{_toMapH();MAPS.banner={t:3,text:curWorld().name};});}};
const _alH=afterLevel;
afterLevel=function(L){const fail=L.result&&L.result.fail;const lv=LEVELS[L.id],isl=lv&&lv.isl;const k='fin'+isl;
  if(!fail&&!NPON()&&isl&&STORIES[k]&&!F()[k]&&BOSS_LIST[isl]&&cleared(BOSS_LIST[isl])>=5&&L.id!=='apagon'&&L.id!=='hollin'&&!(isl===3&&save.cleared.apagon)&&!(isl===4&&save.cleared.hollin)){
    F()[k]=true;persist();play(k,()=>_alH(L));return;}
  _alH(L);};
if(typeof openCine==='function'){const _oc=openCine;openCine=function(sel){if(!F().capCine&&!NPON()){F().capCine=true;persist();play('cine',()=>_oc(sel));return;}_oc(sel);};}
const _slH=startLevel;
startLevel=function(id){if(id==='casino'&&!F().capCasino&&!(typeof NP!=='undefined'&&NP.on)){F().capCasino=true;persist();play('casino',()=>_slH(id));return;}return _slH(id);};

/* ---------------- page turning ---------------- */
const _ssH=startStory;
startStory=function(k){_ssH(k);ST.after=null;ST.flip=0;ST.prevI=-1;ST.open=0;if(!/^ending/.test(k))Music.play('title');};
updStory=function(dt,IN){ST.t+=dt;ST.open=Math.min(1,(ST.open||0)+dt*2.2);if(ST.flip>0){ST.flip=Math.max(0,ST.flip-dt);return;}
  const M=IN.M,pg=ST.pages[ST.i];
  if(M.back){ST.i=ST.pages.length;}
  else if(M.ok){if(ST.t*40<pg.t.length){ST.t=99;return;}ST.prevI=ST.i;ST.i++;ST.t=0;ST.flip=.55;sfx('card');sfx('whoosh');}
  else return;
  if(ST.i>=ST.pages.length){ST.i=ST.pages.length-1;ST.flip=0;const after=ST.after;ST.after=null;
    if(after)transition(after);
    else if(ST.kind==='intro'){save.intro=true;persist();transition(()=>{MAPS.banner={t:3,text:curWorld().name};toMap();});}
    else transition(()=>{scene='credits';CR.t=0;Music.play('ending');});}};

/* ---------------- the book ---------------- */
const BX=W/2-445,BY=26,BW=890,BH=488,PW=425,PH=462,LX=W/2-PW-4,RX=W/2+4,PY=BY+13;
let BOOK=null,GRAIN=null;
function book(){if(BOOK)return BOOK;const [c,g]=mk(W,H);
  g.fillStyle='#3b2418';g.fillRect(0,0,W,H);for(let y=0;y<H;y+=46){g.fillStyle=(y/46)%2?'#40271a':'#372116';g.fillRect(0,y,W,46);g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=2;g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
  const lg=g.createRadialGradient(W/2,H*.35,40,W/2,H/2,620);lg.addColorStop(0,'rgba(255,214,140,.22)');lg.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=lg;g.fillRect(0,0,W,H);
  g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.roundRect(BX+10,BY+14,BW,BH,16);g.fill();
  g.fillStyle='#6b1f1f';g.beginPath();g.roundRect(BX,BY,BW,BH,16);g.fill();g.lineWidth=4;g.strokeStyle='#1b130d';g.stroke();
  g.strokeStyle='rgba(242,193,78,.55)';g.lineWidth=2;g.beginPath();g.roundRect(BX+5,BY+5,BW-10,BH-10,12);g.stroke();
  for(const [x,flip] of [[LX,1],[RX,-1]]){for(let i=3;i>=1;i--){g.fillStyle=i%2?'#e2d1a8':'#ecdcb6';g.fillRect(x+(flip>0?-i*2:i*2),PY+i*1.5,PW,PH);}
    const pg=g.createLinearGradient(x,0,x+PW,0);if(flip>0){pg.addColorStop(0,'#efe0bb');pg.addColorStop(.85,'#f6ead0');pg.addColorStop(1,'#cbb488');}else{pg.addColorStop(0,'#cbb488');pg.addColorStop(.15,'#f6ead0');pg.addColorStop(1,'#efe0bb');}
    g.fillStyle=pg;g.fillRect(x,PY,PW,PH);g.lineWidth=2;g.strokeStyle='rgba(27,19,13,.6)';g.strokeRect(x,PY,PW,PH);
    g.strokeStyle='rgba(122,80,40,.35)';g.lineWidth=1.5;g.strokeRect(x+10,PY+10,PW-20,PH-20);
    const r=srand(x|0);for(let i=0;i<140;i++){g.fillStyle=`rgba(120,80,30,${r()*.06})`;g.beginPath();g.arc(x+r()*PW,PY+r()*PH,r()*3+.5,0,TAU);g.fill();}}
  g.fillStyle='#4a1414';g.fillRect(W/2-4,PY-4,8,PH+8);BOOK=c;return c;}
function grain(){if(GRAIN)return GRAIN;const [c,g]=mk(400,300,1);const r=srand(91);for(let i=0;i<1600;i++){g.fillStyle=`rgba(${r()<.5?'40,25,10':'255,245,220'},${r()*.14})`;g.fillRect(r()*400,r()*300,1+r()*1.5,1+r()*1.5);}
  const v=g.createRadialGradient(200,150,90,200,150,260);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(60,30,10,.55)');g.fillStyle=v;g.fillRect(0,0,400,300);GRAIN=c;return c;}
const CHAP={intro:'Prólogo',fin1:'Capítulo 1 · Isla de Hojalata',isla2:'Capítulo 2 · Bahía Bruma',fin2:'Capítulo 2 · Bahía Bruma',isla3:'Capítulo 3 · Cumbre Apagón',fin3:'Capítulo 3 · Cumbre Apagón',ending:'El gran final',isla4:'Capítulo 4 · Valle Escarcha',fin4:'Capítulo 4 · Valle Escarcha',ending2:'El final de verdad',cine:'Extra · Cine Fantasma',casino:'Extra · Casino Tómbola',isla5:'Extra · Isla Cascabel',fin5:'Extra · Isla Cascabel'};
const IX=LX+22,IY=PY+24,IWD=PW-44,IHT=IWD*.75;
function pagePic(p,t){ctx.save();ctx.translate(IX,IY);ctx.beginPath();ctx.roundRect(0,0,IWD,IHT,8);ctx.clip();const s=IWD/400;ctx.scale(s,s);ctx.lineJoin='round';ctx.lineCap='round';
  try{(SCN[p.d]||(window.EXTRA_SCN||{})[p.d]||SCN.heroes)(p,t);}catch(e){ctx.fillStyle='#d9c39a';ctx.fillRect(0,0,400,300);}
  ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(240,205,150,.28)';ctx.fillRect(0,0,400,300);ctx.globalCompositeOperation='source-over';
  ctx.drawImage(grain(),0,0,400,300);if(Math.floor(t*12)%7===0){ctx.fillStyle='rgba(30,20,10,.25)';ctx.fillRect((t*997)%400,0,1.5,300);}ctx.restore();
  ctx.lineWidth=4;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.roundRect(IX,IY,IWD,IHT,8);ctx.stroke();
  for(const [x,y] of [[IX,IY],[IX+IWD,IY],[IX,IY+IHT],[IX+IWD,IY+IHT]]){ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);rr(-7,-7,14,14,2,C.brass,2.5);ctx.restore();}
  const cy=IY+IHT+58,nm=CHAP[ST.kind]||'';ctx.save();ctx.translate(LX+PW/2,cy);ctx.rotate(Math.sin(t*1.3)*.01);
  poly([[-170,-16],[-196,-16],[-184,0],[-196,16],[-170,16]],'#8a2a22',3);poly([[170,-16],[196,-16],[184,0],[196,16],[170,16]],'#8a2a22',3);
  rr(-172,-20,344,40,4,'#b8382c',3);ctx.strokeStyle='rgba(255,226,122,.6)';ctx.lineWidth=1.5;ctx.strokeRect(-166,-15,332,30);
  txt(nm,0,1,nm.length>26?17:20,C.goldL,C.ink);ctx.restore();
  const oy=cy+50;ctx.strokeStyle='rgba(107,58,38,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(LX+80,oy);ctx.quadraticCurveTo(LX+PW/2-30,oy-12,LX+PW/2,oy);ctx.quadraticCurveTo(LX+PW/2+30,oy+12,LX+PW-80,oy);ctx.stroke();
  star(LX+PW/2,oy,8,3.5,4,t);ctx.fillStyle=C.brass;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=C.ink;ctx.stroke();
  btxt(String(ST.i*2+1),LX+PW/2,PY+PH-22,13,'rgba(107,58,38,.9)','center',800);}
function pageText(p,t,typed){let y=PY+50;if(p.cap){txt(p.cap,RX+PW/2,y+4,p.cap.length>24?24:30,C.brass,C.ink);y+=28;ctx.strokeStyle='rgba(107,58,38,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(RX+70,y);ctx.lineTo(RX+PW-70,y);ctx.stroke();y+=30;}
  else y+=10;
  const shown=p.t.slice(0,Math.max(0,typed));
  if(p.cap)wrap(shown,RX+34,y+6,PW-68,33,22,C.ink,700);
  else if('¡¿«"'.includes(p.t[0]))wrap(shown,RX+34,y+6,PW-68,33,22,C.ink,700);
  else{if(typed>0)txt(p.t[0],RX+54,y+22,62,C.rust,C.ink);wrapIndent(shown.slice(1),RX+34,y+6,PW-68,33,22,58);}
  const oy=PY+PH-84;ctx.strokeStyle='rgba(107,58,38,.55)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(RX+120,oy);ctx.lineTo(RX+PW/2-16,oy);ctx.moveTo(RX+PW/2+16,oy);ctx.lineTo(RX+PW-120,oy);ctx.stroke();circ(RX+PW/2,oy,5,C.brass,2);
  btxt(String(ST.i*2+2),RX+PW/2,PY+PH-22,13,'rgba(107,58,38,.9)','center',800);
  if(typed>=p.t.length&&Math.floor(t*2.4)%2===0){const last=ST.i>=ST.pages.length-1;btxt(last?'Aceptar: cerrar el libro ▶':'Aceptar: pasar la página ▶',RX+PW-30,PY+PH-46,14,C.rustD,'right',900);}
  btxt('Atrás: saltar historia',RX+34,PY+PH-46,12,'rgba(107,58,38,.75)','left',700);}
function wrapIndent(s,x,y,maxW,lh,size,ind){ctx.font=`700 ${size}px ${BFONT}`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle=C.ink;let line='',li=0;
  const put=()=>{ctx.fillText(line,li<2?x+ind:x,y+li*lh);li++;};
  for(const w of s.split(' ')){const test=line?line+' '+w:w;if(ctx.measureText(test).width>(li<2?maxW-ind:maxW)&&line){put();line=w;}else line=test;}if(line)put();}
drawStory=function(){const t=ST.t,p=ST.pages[ST.i];if(!p)return;ctx.drawImage(book(),0,0,W,H);
  const lamp=.06+.03*Math.sin(t*2.1);ctx.fillStyle=`rgba(255,220,150,${lamp})`;ctx.fillRect(0,0,W,H);
  if(ST.flip>0){const k=1-ST.flip/.55,old=ST.pages[ST.prevI]||p;
    pagePic(k<.5?old:p,k<.5?0:t);pageText(p,t,Math.floor(t*40));
    ctx.save();const e=k<.5?Math.cos(k*Math.PI):-Math.cos(k*Math.PI);const sx=Math.max(.02,e);
    if(k<.5){ctx.translate(W/2,0);ctx.scale(sx,1);ctx.translate(-W/2,0);ctx.beginPath();ctx.rect(RX,PY,PW,PH);ctx.clip();ctx.drawImage(book(),RX,PY,PW,PH,RX,PY,PW,PH);pageText(old,99,old.t.length);}
    else{ctx.translate(W/2,0);ctx.scale(sx,1);ctx.translate(-W/2,0);ctx.beginPath();ctx.rect(LX,PY,PW,PH);ctx.clip();ctx.drawImage(book(),LX,PY,PW,PH,LX,PY,PW,PH);pagePic(p,t);}
    ctx.fillStyle=`rgba(40,20,10,${.35*(1-sx)})`;ctx.fillRect(0,0,W,H);ctx.restore();
    const sh=k<.5?RX:LX;ctx.fillStyle=`rgba(0,0,0,${.18*Math.sin(k*Math.PI)})`;ctx.fillRect(k<.5?RX:LX,PY,PW,PH);}
  else{pagePic(p,t);pageText(p,t,Math.floor(t*40));}
  const o=ST.open||1;if(o<1){ctx.fillStyle=`rgba(20,12,8,${1-o})`;ctx.fillRect(0,0,W,H);}
  const n=ST.pages.length;for(let i=0;i<n;i++){const on=i===ST.i;circ(W/2-(n-1)*9+i*18,H-12,on?5:3.5,on?C.gold:'rgba(239,224,191,.5)',on?2:0);}};

/* ---------------- illustrations (drawn in a 400×300 box) ---------------- */
function sky(a,b){const g=ctx.createLinearGradient(0,0,0,300);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,400,300);}
function sea(y,c1,c2,t,amp=5){ctx.fillStyle=c1;ctx.beginPath();ctx.moveTo(0,300);for(let x=0;x<=400;x+=10)ctx.lineTo(x,y+Math.sin(x*.05+t*2)*amp);ctx.lineTo(400,300);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.strokeStyle=c2;ctx.lineWidth=2.5;for(let i=0;i<9;i++){const x=(i*53+t*20)%430-20,yy=y+18+(i%3)*22;ctx.beginPath();ctx.arc(x,yy,8,Math.PI*1.1,Math.PI*1.9);ctx.stroke();}}
function hero(ch,x,y,s,o={}){drawHero(Object.assign({x,y,char:ch,face:1,anim:0,run:false,scale:s,aimX:1,aimY:0,flash:false},o));}
function tinyBoss(id,x,y,s,t){const d=LEVELS[id];if(!d||!d.draw)return;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.translate(-480,-GROUND);
  const B={x:480,y:GROUND,fy:190,t,phase:0,mouth:.3+.3*Math.sin(t*4),dead:false,flash:0,anim:t*6,squash:0,act:null,throwT:0,def:d,hp:1,max:1,trail:[],vis:1,alpha:1};
  try{d.draw(B,{t,Ps:[{x:200,y:300,dead:false,type:'plat',duck:false}],ents:[],eb:[],fx:[],camX:0});}catch(e){}ctx.restore();}
function lighthouse(x,y,lit,t){rr(x-16,y-120,32,120,3,'#f1e6d2',3);for(let i=0;i<3;i++)rr(x-16,y-100+i*34,32,12,0,'#e86a5a',0);rr(x-16,y-120,32,120,3,null,3);rr(x-22,y-134,44,14,3,'#4a3a2a',3);
  if(lit){ctx.save();ctx.globalAlpha=.5;ctx.translate(x,y-150);ctx.rotate(Math.sin(t)*.6);ctx.fillStyle='#fff3b0';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(260,-50);ctx.lineTo(260,50);ctx.closePath();ctx.fill();ctx.rotate(Math.PI);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(260,-50);ctx.lineTo(260,50);ctx.closePath();ctx.fill();ctx.restore();}
  circ(x,y-150,15,lit?'#ffe27a':'#8a8070',3);poly([[x-24,y-162],[x,y-186],[x+24,y-162]],'#4a3a2a',3);}
function shard(x,y,r,t,i){ctx.save();ctx.translate(x,y);ctx.rotate(t*2+i);circ(0,0,r*1.9,'rgba(255,226,122,.3)',0);poly([[0,-r],[r*.7,0],[0,r*1.2],[-r*.6,.1]],'#ffe27a',2);ctx.restore();}
function remo(x,y,t){ctx.save();ctx.translate(x,y+Math.sin(t*3)*2);rr(-16,-40,32,40,10,'#2f4a6b',3);rr(-16,-26,32,6,0,'#f1e6d2',0);circ(0,-52,15,'#f0c9a0',3);ell(0,-42,13,8,'#f1e6d2',2.5);rr(-15,-72,30,10,4,'#f1e6d2',2.5);rr(-17,-64,34,5,2,'#1b130d',0);circ(-5,-55,2,C.ink,0);circ(5,-55,2,C.ink,0);
  line(10,-44,22,-48,3);rr(20,-54,8,7,2,'#6b3a26',2);ctx.globalAlpha=.6;circ(26+Math.sin(t*2)*3,-62-(t*20%20),4,'#ddd',0);ctx.restore();}
const SCN={
  heroes(p,t){const pose=p.pose;
    if(pose==='agua'){sky('#cfe3e6','#9fc4c8');sea(210,'#6f9fb0','#c8e4ea',t);hero('chispa',120,232,.95,{anim:t*6,run:true});hero('cerilla',220,236,.95,{anim:t*6+1});rr(196,150,48,10,5,'#e86a5a',2);hero('velita',310,232,.95,{anim:t*6+2,run:true});return;}
    if(pose==='frio'){sky('#c6ccd2','#9aa3ab');ctx.fillStyle='#e6edf1';ctx.fillRect(0,230,400,70);for(let i=0;i<40;i++){const x=(i*37+t*30)%400,y=(i*53+t*60)%300;circ(x,y,2.5,'#8a8f96',0);}
      [['chispa',110],['cerilla',200],['velita',290]].forEach(([c,x],i)=>hero(c,x+Math.sin(t*30+i)*1.5,240,.95));return;}
    if(pose==='mano'){sky('#2a2140','#4a3a6a');for(let i=0;i<20;i++){circ((i*71)%400,(i*37)%160,1.5,'#fff6c8',0);}const g=ctx.createRadialGradient(200,200,10,200,200,170);g.addColorStop(0,'rgba(255,214,140,.55)');g.addColorStop(1,'rgba(255,214,140,0)');ctx.fillStyle=g;ctx.fillRect(0,0,400,300);
      hero('chispa',130,250,.95);hero('velita',200,250,.95,{flash:true});hero('cerilla',270,250,.95);line(150,200,180,205,4);line(220,205,250,200,4);return;}
    sky(pose==='fiesta'?'#f7d9a0':'#f2dcae','#d9b77c');for(let i=0;i<10;i++){const a=i/10*TAU+t*.2;ctx.fillStyle='rgba(255,240,200,.35)';ctx.beginPath();ctx.moveTo(200,320);ctx.arc(200,320,520,a,a+.18);ctx.closePath();ctx.fill();}
    ctx.fillStyle='#b8925a';ctx.fillRect(0,250,400,50);line(0,250,400,250,3);
    if(pose==='promesa'||pose==='fiesta'){for(let i=0;i<14;i++){const x=(i*61+t*40)%400,y=(i*29+t*80)%240;rr(x,y,6,9,1,['#e86a5a','#f2c14e','#7bb7c9'][i%3],0);}}
    hero('chispa',110,254,1,{anim:t*6,run:pose!=='promesa',aimY:-.4,flash:pose==='promesa'});hero('cerilla',205,254,1,{anim:t*6+1,run:pose!=='promesa',aimY:-.4});hero('velita',300,254,1,{anim:t*6+2,run:pose!=='promesa',aimY:-.4});},
  rey(p,t){sky('#1f1830','#3a2a50');for(let i=0;i<5;i++){ctx.fillStyle='rgba(20,10,30,.6)';cloudShape(ctx,(i*110+t*8)%500-60,40+i*14,.45,'rgba(60,40,80,.7)',0);}
    if(p.dead){const g=ctx.createRadialGradient(200,150,10,200,150,220);g.addColorStop(0,'rgba(255,226,122,.7)');g.addColorStop(1,'rgba(255,226,122,0)');ctx.fillStyle=g;ctx.fillRect(0,0,400,300);}
    tinyBoss('apagon',200,290,.5,t);if(!p.dead){for(let i=0;i<3;i++){const x=60+i*10,y=270;}}},
  robo(p,t){sky('#1f1a33','#3b3157');for(let i=0;i<24;i++)circ((i*67)%400,(i*41)%150,1.4,'#fff6c8',0);sea(240,'#2c3b55','#5b6f95',t,3);lighthouse(200,240,false,t);
    const k=(t%3)/3;for(let i=0;i<14;i++){const a=i/14*TAU+.3,d=k*230;shard(200+Math.cos(a)*d,90+Math.sin(a)*d*.7,6,t,i);}
    ctx.globalAlpha=Math.max(0,1-k*3);circ(200,90,40,'#fff3b0',0);ctx.globalAlpha=1;btxt('¡CRAC!',200+Math.sin(t*30)*2,40,30,'#ffe27a','center',900);
    ctx.save();ctx.translate(320,170);ctx.scale(.75,.75);ctx.fillStyle='#120c1c';ctx.beginPath();ctx.ellipse(0,0,40,70,0,0,TAU);ctx.fill();poly([[-26,-62],[-30,-96],[-12,-74],[0,-104],[12,-74],[30,-96],[26,-62]],'#2a1d3a',3);circ(-12,-26,6,'#ffe27a',0);circ(12,-26,6,'#ffe27a',0);ctx.restore();},
  bombilla(p,t){sky('#2a3a5a','#e8b46a');const g=ctx.createRadialGradient(200,80,10,200,80,260);g.addColorStop(0,'rgba(255,240,180,.95)');g.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=g;ctx.fillRect(0,0,400,300);
    ctx.save();ctx.translate(200,80);ctx.rotate(t*.3);for(let i=0;i<14;i++){ctx.rotate(TAU/14);ctx.fillStyle='rgba(255,246,200,.35)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(300,-16);ctx.lineTo(300,16);ctx.closePath();ctx.fill();}ctx.restore();
    sea(250,'#3f6f80','#8fc3cc',t,3);ctx.fillStyle='#7e8a45';ctx.beginPath();ctx.ellipse(70,250,70,18,0,Math.PI,0);ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(330,252,60,14,0,Math.PI,0);ctx.fill();ctx.stroke();
    rr(184,120,32,130,3,'#f1e6d2',3);for(let i=0;i<3;i++)rr(184,140+i*36,32,12,0,'#e86a5a',0);rr(184,120,32,130,3,null,3);
    const s=1+.05*Math.sin(t*3);ctx.save();ctx.translate(200,80);ctx.scale(s,s);circ(0,0,34,'#fff6c8',3.5);rr(-14,30,28,14,3,C.brass,3);ctx.beginPath();ctx.moveTo(-10,8);ctx.quadraticCurveTo(0,-14,10,8);ctx.lineWidth=3;ctx.strokeStyle='#e8a83a';ctx.stroke();ctx.restore();
    for(let i=0;i<6;i++){circ(30+i*68,236+Math.sin(i)*6,4,Math.sin(t*4+i)>0?'#ffe27a':'#a08c5a',1.5);}},
  hojalata(p,t){sky('#bcd8d0','#f2dcae');cloudShape(ctx,(t*10)%480-60,50,.5,'#fff8ee',2.5);cloudShape(ctx,(t*6+220)%480-60,80,.4,'#fff8ee',2.5);
    ctx.fillStyle='#a6ae64';ctx.beginPath();ctx.moveTo(0,300);ctx.lineTo(0,200);ctx.quadraticCurveTo(120,150,220,190);ctx.quadraticCurveTo(320,160,400,190);ctx.lineTo(400,300);ctx.fill();ctx.stroke();
    ctx.save();ctx.translate(90,170);ctx.rotate(t*.8);for(let i=0;i<8;i++){ctx.rotate(TAU/8);rr(-6,-46,12,16,2,C.steel,2.5);}circ(0,0,34,C.steel,3);circ(0,0,12,C.brass,3);ctx.restore();
    rr(250,110,46,80,4,'#e86a5a',3);poly([[244,112],[273,80],[302,112]],'#7bb7c9',3);circ(273,140,14,'#fff8ee',3);line(273,140,273,131,2);line(273,140,280,140,2);
    ctx.save();ctx.translate(340,200);ctx.rotate(Math.sin(t*2)*.1);for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*TAU/6+t);rr(-3,-40,6,40,2,'#f2c14e',2);rr(-9,-48,18,12,3,['#e86a5a','#7bb7c9','#b8d08a'][i%3],2);ctx.restore();}circ(0,0,8,C.brass,2.5);ctx.restore();
    if(p.fiesta)for(let i=0;i<18;i++){const x=(i*41+t*50)%400,y=(i*23+t*90)%300;rr(x,y,6,9,1,['#e86a5a','#f2c14e','#7bb7c9'][i%3],0);}
    hero('chispa',150,262,.7,{anim:t*6,run:true});hero('cerilla',200,264,.7,{anim:t*6+1,run:true});hero('velita',245,262,.7,{anim:t*6+2,run:true});},
  trozos(p,t){sky('#f2dcae','#d9b77c');const g=ctx.createRadialGradient(200,160,10,200,160,190);g.addColorStop(0,'rgba(255,230,150,.8)');g.addColorStop(1,'rgba(255,230,150,0)');ctx.fillStyle=g;ctx.fillRect(0,0,400,300);
    ctx.fillStyle='#b8925a';ctx.fillRect(0,250,400,50);line(0,250,400,250,3);
    ctx.save();ctx.translate(200,160);ctx.beginPath();ctx.moveTo(-50,-60);ctx.lineTo(-56,70);ctx.quadraticCurveTo(0,96,56,70);ctx.lineTo(50,-60);ctx.closePath();ctx.fillStyle='rgba(220,240,240,.45)';ctx.fill();
    const n=p.n||5;for(let i=0;i<n;i++){const x=-36+(i*29%72),y=60-(i*13%90)-Math.floor(i/5)*12+Math.sin(t*3+i)*4;shard(x,y,7,t,i);}
    ctx.lineWidth=3.5;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(-50,-60);ctx.lineTo(-56,70);ctx.quadraticCurveTo(0,96,56,70);ctx.lineTo(50,-60);ctx.stroke();rr(-56,-76,112,18,5,C.woodL,3);ell(-30,0,6,30,'rgba(255,255,255,.5)',0);ctx.restore();
    btxt(`${p.n||5} / 20`,200,40,22,C.rust,'center',900);hero('chispa',70,262,.75,{flash:true,aimY:-.6});hero('velita',330,262,.75,{face:-1});},
  barco(p,t){const to=p.to;sky(to==='cumbre'?'#4a4a6a':'#cfe3e6',to==='cumbre'?'#8a7aa0':'#a8c8cc');
    if(to==='cumbre'){ctx.fillStyle='#1f1a2a';ctx.beginPath();ctx.moveTo(250,200);ctx.lineTo(330,70);ctx.lineTo(400,200);ctx.fill();if(Math.floor(t*3)%5===0){ctx.strokeStyle='#fff6c8';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(300,0);ctx.lineTo(290,40);ctx.lineTo(305,45);ctx.lineTo(292,90);ctx.stroke();}}
    else for(let i=0;i<4;i++){ctx.globalAlpha=.7;cloudShape(ctx,250+i*50,150+Math.sin(t+i)*4,.55,'#eef4f4',0);ctx.globalAlpha=1;}
    ctx.save();const bob=Math.sin(t*2)*4;ctx.translate(150,215+bob);ctx.rotate(Math.sin(t*1.6)*.04);
    rr(-4,-140,8,140,2,C.woodL,3);ctx.beginPath();ctx.moveTo(4,-132);ctx.quadraticCurveTo(70+Math.sin(t*3)*6,-90,4,-40);ctx.closePath();ctx.fillStyle='#f6ead0';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();poly([[4,-140],[30,-134],[4,-128]],'#e86a5a',2);
    hero('chispa',-40,-10,.62);hero('cerilla',-8,-10,.62);hero('velita',22,-10,.62);remo(56,-10,t);
    ctx.beginPath();ctx.moveTo(-90,-12);ctx.lineTo(100,-12);ctx.lineTo(80,22);ctx.lineTo(-74,22);ctx.closePath();ctx.fillStyle='#a0663a';ctx.fill();ctx.lineWidth=3.5;ctx.stroke();for(let i=-60;i<80;i+=26)circ(i,4,5,'#f1e6d2',2);ctx.restore();sea(232,'#5b8590','#cfe8ee',t,4);},
  bruma(p,t){sky('#b9c6c8','#d9e0de');lighthouse(310,220,false,t);sea(220,'#7a9aa0','#cfe0e2',t,3);
    for(let l=0;l<3;l++){ctx.globalAlpha=.55;for(let i=0;i<6;i++){const x=((i*110+t*(10+l*8))%560)-80;cloudShape(ctx,x,120+l*50,.7+l*.15,'#eef2f0',0);}}ctx.globalAlpha=1;
    ctx.save();ctx.translate(90+Math.sin(t*.7)*10,236);ctx.beginPath();ctx.moveTo(-40,-6);ctx.lineTo(40,-6);ctx.lineTo(30,10);ctx.lineTo(-30,10);ctx.closePath();ctx.fillStyle='#a0663a';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();rr(-2,-50,4,44,1,C.woodL,2);ctx.restore();
    ctx.globalAlpha=.35;ctx.fillStyle='#fff';ctx.fillRect(0,0,400,300);ctx.globalAlpha=1;btxt('¿…?',300,40,22,C.ink,'center',900);},
  jefes(p,t){const isl=p.isl||2,list=(BOSS_LIST[isl]||[]).filter(id=>LEVELS[id]&&LEVELS[id].kind!=='plane').slice(0,4);sky(isl===2?'#9fc4c8':isl===3?'#3a2a50':'#c6ccd2',isl===2?'#5b8590':isl===3?'#1f1830':'#9aa3ab');
    for(let i=0;i<5;i++){ctx.fillStyle='rgba(20,10,30,.25)';ctx.beginPath();ctx.ellipse(200,80,260,260,0,0,TAU);}
    list.forEach((id,i)=>{const x=60+i*95,y=262+(i%2)*6;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,y,36,8,0,0,TAU);ctx.fill();tinyBoss(id,x,y,.2,t+i);});
    ctx.globalAlpha=.25;ctx.fillStyle='#120c1c';ctx.beginPath();ctx.ellipse(200,40,120,40,0,0,TAU);ctx.fill();ctx.globalAlpha=1;circ(180,40,5,'#ffe27a',0);circ(220,40,5,'#ffe27a',0);},
  cumbre(p,t){sky('#1a1428','#4a3a6a');for(let i=0;i<20;i++)circ((i*71)%400,(i*29)%120,1.3,'#fff6c8',0);
    ctx.fillStyle='#120c1c';ctx.beginPath();ctx.moveTo(40,300);ctx.lineTo(200,60);ctx.lineTo(360,300);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
    rr(176,40,48,40,2,'#2a1d3a',3);for(const x of [170,230])rr(x-8,20,16,60,2,'#2a1d3a',3);poly([[162,22],[170,0],[178,22]],'#3a2a50',2.5);poly([[222,22],[230,0],[238,22]],'#3a2a50',2.5);rr(192,52,16,24,8,Math.sin(t*5)>0?'#ffe27a':'#a08c5a',2);
    if(Math.floor(t*2.5)%4===0){ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(0,0,400,300);ctx.strokeStyle='#fff6c8';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(80,0);ctx.lineTo(70,50);ctx.lineTo(90,55);ctx.lineTo(74,120);ctx.stroke();}
    for(let i=0;i<4;i++){const x=(i*90+t*50)%460-30,y=110+Math.sin(t*4+i)*20,f=Math.sin(t*16+i)*8;ctx.fillStyle='#120c1c';ctx.beginPath();ctx.moveTo(x-14,y-f);ctx.quadraticCurveTo(x-6,y-4,x,y);ctx.quadraticCurveTo(x+6,y-4,x+14,y-f);ctx.quadraticCurveTo(x,y+6,x-14,y-f);ctx.fill();}
    hero('chispa',110,292,.6,{flash:true});hero('cerilla',150,292,.6);hero('velita',190,292,.6);},
  valle(p,t){sky('#8a9098','#c6ccd2');ctx.fillStyle='#e6edf1';ctx.beginPath();ctx.moveTo(0,300);ctx.lineTo(0,180);ctx.lineTo(90,120);ctx.lineTo(170,190);ctx.lineTo(260,110);ctx.lineTo(400,200);ctx.lineTo(400,300);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();
    for(let i=0;i<3;i++){const x=80+i*110;rr(x,200,40,40,3,'#a0663a',3);poly([[x-6,202],[x+20,180],[x+46,202]],'#6b3a26',3);rr(x+26,176,8,18,1,'#4a3a2a',2);ctx.globalAlpha=.7;for(let k=0;k<4;k++)cloudShape(ctx,x+30+k*10+Math.sin(t+k)*4,160-k*22-(t*12%22),.18+k*.05,'#3a3a40',0);ctx.globalAlpha=1;}
    ctx.fillStyle='#d5dade';ctx.fillRect(0,240,400,60);line(0,240,400,240,3);for(let i=0;i<50;i++){const x=(i*37+t*20)%400,y=(i*53+t*40)%300;circ(x,y,2,'#7a7f86',0);}
    ctx.save();ctx.translate(330,250);circ(0,-14,16,'#f4f6f8',2.5);circ(0,-40,11,'#f4f6f8',2.5);circ(-4,-42,1.6,C.ink,0);circ(4,-42,1.6,C.ink,0);poly([[0,-38],[8,-36],[0,-34]],'#e86a5a',1);if(Math.floor(t*1.5)%3===0)btxt('¡COF!',22,-56,12,C.ink,'center',900);ctx.restore();},
  hollin(p,t){sky(p.dead?'#c6ccd2':'#3a1a14',p.dead?'#e6edf1':'#6a3a24');if(!p.dead)for(let i=0;i<8;i++){ctx.globalAlpha=.5;cloudShape(ctx,(i*70+t*14)%480-40,40+(i%3)*30,.5,'#2a2224',0);}ctx.globalAlpha=1;tinyBoss('hollin',200,292,.48,t);},
  cine(p,t){sky('#1a1428','#3a2a50');rr(60,60,280,190,4,'#7a1f22',3);rr(80,40,240,30,6,'#f2c14e',3);btxt('LA ÚLTIMA FUNCIÓN',200,55,14,'#7a1f22','center',900);
    for(let i=0;i<14;i++)circ(86+i*17.5,40,3,Math.sin(t*8+i)>0?'#fff6c8':'#a08c5a',1);rr(90,90,220,130,2,p.cartas?'#f4ecd8':'#d8d0c0',3);
    if(p.cartas){[['S',-1],['R',0],['K',1]].forEach(([c,i],k)=>{ctx.save();ctx.translate(200+i*62,160+Math.sin(t*3+k)*6);ctx.rotate(i*.15);rr(-24,-34,48,68,5,C.paper,3);btxt(c==='S'?'J':c==='R'?'Q':'K',-14,-22,14,'#7a1f22','center',900);
      circ(0,4,11,['#e86a5a','#7bb7c9','#f2c14e'][k],2.5);circ(-4,2,1.6,C.ink,0);circ(4,2,1.6,C.ink,0);ctx.restore();});}
    else{ctx.save();ctx.beginPath();ctx.rect(90,90,220,130);ctx.clip();ctx.globalAlpha=.35;for(let i=0;i<6;i++)line(90+((i*47+t*120)%220),90,90+((i*47+t*120)%220),220,1.5);ctx.restore();}
    ctx.globalAlpha=.25;ctx.fillStyle='#fff6c8';ctx.beginPath();ctx.moveTo(200,300);ctx.lineTo(90,90);ctx.lineTo(310,90);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
    for(let i=0;i<5;i++)ell(70+i*65,290,22,16,'#120c1c',0);},
  casino(p,t){sky('#1a1030','#4a1a4a');if(!p.dentro){rr(70,90,260,170,4,'#2a1d3a',3);poly([[60,92],[200,30],[340,92]],'#7a1f22',3);rr(110,64,180,34,8,'#f2c14e',3);btxt('TÓMBOLA',200,82,22,'#7a1f22','center',900);
      for(let i=0;i<18;i++){const a=i/18;circ(70+a*260,90,3.5,Math.sin(t*10+i)>0?'#ff5ad8':'#7a3a6a',1);circ(70+a*260,260,3.5,Math.cos(t*10+i)>0?'#ffe27a':'#6a5a2a',1);}
      rr(170,190,60,70,30,'#120c1c',3);ctx.globalAlpha=.6;ctx.fillStyle='#ffe27a';ctx.beginPath();ctx.moveTo(170,260);ctx.lineTo(230,260);ctx.lineTo(270,300);ctx.lineTo(130,300);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
      hero('chispa',140,296,.55);hero('cerilla',260,296,.55,{face:-1});}
    else{ctx.fillStyle='#7a1f22';ctx.fillRect(0,230,400,70);line(0,230,400,230,3);ctx.save();ctx.translate(200,130);ctx.rotate(t*1.5);for(let i=0;i<10;i++){ctx.save();ctx.rotate(i*TAU/10);poly([[0,0],[-14,-80],[14,-80]],i%2?'#e86a5a':'#f2c14e',2);ctx.restore();}circ(0,0,14,C.brass,3);ctx.restore();poly([[192,40],[208,40],[200,56]],C.ink,0);
      for(let i=0;i<8;i++){const x=(i*53+t*60)%400,y=(i*31+t*90)%230;circ(x,y,6,['#e86a5a','#7bb7c9','#f2c14e'][i%3],2);}
      ctx.save();ctx.translate(330,280);rr(-18,-60,36,60,8,'#2a1d3a',3);circ(0,-74,15,'#f0c9a0',3);rr(-16,-94,32,10,3,'#1b130d',2);circ(-5,-76,2,C.ink,0);line(2,-76,9,-76,2);ctx.restore();}}};
SCN.islas=SCN.hojalata;

/* ---------------- Libro de cuentos (map menu): replay the chapters you have reached ---------------- */
const LIB=[['intro','Prólogo',()=>true],['fin1','Cap. 1 · Hojalata, encendida',()=>F().fin1||cleared(BOSS_LIST[1])>=5],['isla2','Cap. 2 · Bahía Bruma',()=>!!save.visited[2]],['fin2','Cap. 2 · Adiós a la niebla',()=>F().fin2||cleared(BOSS_LIST[2])>=5],
  ['isla3','Cap. 3 · Cumbre Apagón',()=>!!save.visited[3]],['fin3','Cap. 3 · Las puertas del castillo',()=>F().fin3||!!save.cleared.apagon],['ending','El gran final',()=>!!save.ended||!!save.cleared.apagon],
  ['isla4','Cap. 4 · Valle Escarcha',()=>!!save.visited[4]],['fin4','Cap. 4 · El deshielo',()=>F().fin4||!!save.cleared.hollin],['ending2','El final de verdad',()=>!!F().ending2],['cine','Extra · Cine Fantasma',()=>!!F().capCine],['casino','Extra · Casino Tómbola',()=>!!F().capCasino],['isla5','Extra · Isla Cascabel',()=>!!save.visited[5]]];
window.openLibro=function(){MAPS.libro={sel:0,t:0};sfx('card');};
window.updLibro=function(I){const L=MAPS.libro,n=LIB.length;L.t+=1/60;if(I.up){L.sel=(L.sel+n-1)%n;sfx('move');}if(I.down){L.sel=(L.sel+1)%n;sfx('move');}
  if(I.no||I.pause){MAPS.libro=null;sfx('back');return;}
  if(I.ok){const [k,,ok]=LIB[L.sel];if(!ok()){sfx('deny');return;}sfx('select');MAPS.libro=null;transition(()=>play(k,()=>{_toMapH();}));}};
window.drawLibro=function(){const L=MAPS.libro;ctx.fillStyle='rgba(20,13,8,.7)';ctx.fillRect(0,0,W,H);card(W/2-260,30,520,480,'#f3e6c4',4,10);rr(W/2-260,30,520,58,10,'#6b1f1f',4);
  txt('Libro de cuentos',W/2,60,32,C.goldL,C.ink);
  LIB.forEach(([k,name,ok],i)=>{const y=112+i*31,on=i===L.sel,open=ok();if(on)rr(W/2-236,y-14,472,28,7,C.brass,2.5);
    btxt(open?name:'· · · ¿?',W/2-210,y,17,open?C.ink:'rgba(107,58,38,.55)','left',800);if(open)btxt('▶',W/2+210,y,15,on?C.ink:'rgba(107,58,38,.6)','right',900);else{ctx.save();ctx.translate(W/2+204,y);rr(-7,-3,14,11,2,C.steel,2);ctx.beginPath();ctx.arc(0,-3,5,Math.PI,0);ctx.lineWidth=2.5;ctx.strokeStyle=C.ink;ctx.stroke();ctx.restore();}});
  btxt('Aceptar: leer · Atrás: cerrar',W/2,492,14,C.rustD,'center',800);};
})();
