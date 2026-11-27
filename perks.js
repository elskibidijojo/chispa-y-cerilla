/* perks.js — 1) every dash now has a short moment of invincibility, so nothing in the game needs the Smoke Bomb
   to be dodged (the Smoke Bomb still makes the WHOLE dash invincible and lets you pass through enemies).
   2) Skins now give little bonuses (shown in their description).
   3) Surfista: +1 heart, and every time you get hit you release two mini-tsunamis that push out from you,
      hurt enemies and wash away nearby enemy shots (a little bodyguard).
   Everything runs in the simulation, so online play stays in sync. */
(function(){
const PERK={
  skin_dorada:{dmg:.05,t:'+5 % de daño'}, skin_noche:{sup:.12,t:'la súper se llena 12 % más rápido'}, skin_pirata:{dmg:.06,t:'+6 % de daño'},
  skin_gala:{cards:1,t:'empiezas cada pelea con 1 carta de súper'}, skin_fantasma:{dash:.12,t:'tu dash es invencible más tiempo'},
  skin_cine:{sup:.1,dmg:.03,t:'+3 % de daño y súper 10 % más rápida'}, skin_payaso:{sup:.1,t:'la súper se llena 10 % más rápido'},
  skin_sombra:{dmg:.08,t:'+8 % de daño'}, skin_neon:{sup:.15,t:'la súper se llena 15 % más rápido'}, skin_vaquero:{dmg:.06,t:'+6 % de daño'},
  skin_rey:{hp:1,t:'+1 corazón'}, skin_chef:{cards:1,sup:.05,t:'empiezas con 1 carta y la súper se llena 5 % más rápido'},
  skin_arcoiris:{dmg:.05,sup:.08,t:'+5 % de daño y súper 8 % más rápida'}, skin_mago:{sup:.2,t:'la súper se llena 20 % más rápido'},
  skin_zombi:{hp:1,dmg:-.03,t:'+1 corazón (pero -3 % de daño)'}, skin_lunar:{dash:.1,sup:.08,t:'dash invencible más largo y súper 8 % más rápida'},
  skin_navidad:{cards:1,t:'empiezas cada pelea con 1 carta de súper'}, skin_reno:{dmg:.05,t:'+5 % de daño'},
  skin_goat:{hp:1,dmg:.1,t:'+1 corazón y +10 % de daño'}, skin_surf:{hp:1,t:'+1 corazón, balas marinas, +10 % en las súper y mini tsunamis protectores cuando te golpean'}};
window.SKIN_PERK=PERK;
for(const [id,pk] of Object.entries(PERK))if(SKINS[id]&&!/Bonus:/.test(SKINS[id].desc||''))SKINS[id].desc=(SKINS[id].desc||'')+' Bonus: '+pk.t+'.';
const perk=p=>p&&p.eq&&PERK[p.eq.skin];
const _np=newPlayer;newPlayer=function(L,i,type,x,y){const p=_np(L,i,type,x,y);const k=perk(p);if(k){if(k.hp){p.hp+=k.hp;p.maxHp=(p.maxHp||p.hp)+k.hp;}if(k.cards)p.cards=Math.max(p.cards||0,k.cards);}return p;};
const _dm=dmgM;dmgM=function(p){const m=_dm(p),k=perk(p);return k&&k.dmg?m*(1+k.dmg):m;};
const _g=gain;gain=function(p,d){const k=perk(p);return _g(p,k&&k.sup?d*(1+k.sup):d);};

/* dash invincibility for everyone */
const _pt=ptimers;ptimers=function(p,dt){_pt(p,dt);if(!p)return;if(p.dash>0&&!p._wasDash){const k=perk(p);p._dI=.13+(k&&k.dash||0);}p._wasDash=p.dash>0;if(p._dI>0)p._dI-=dt;};

/* hurt: dash i-frames + surfer tsunamis */
function miniWave(b){const d=b.vx>0?1:-1,k=Math.min(1,b.t*5,b.life*3);ctx.save();ctx.translate(b.x,b.y);ctx.scale(d*k,k);ctx.beginPath();ctx.moveTo(-40,28);ctx.quadraticCurveTo(-30,-30,14,-26);ctx.quadraticCurveTo(-6,-10,26,28);ctx.closePath();
  ctx.fillStyle='rgba(30,127,224,.8)';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=C.ink;ctx.stroke();for(let i=0;i<4;i++)circ(12-i*12,-24+i*4,4,'#fbf6ea',1.5);ctx.restore();}
const _h=hurt;hurt=function(L,p){if(p&&L&&L.state==='play'){const k=perk(p);if(p._dI>0||(p.dash>0&&p.dash>.21-(.13+(k&&k.dash||0))))return;}const before=p?p.hp:0;_h(L,p);
  if(!p||!L||p.hp>=before||p.dead||p.hp<=0||!(p.eq&&p.eq.skin==='skin_surf'))return;
  const plane=p.type==='plane',y=plane?p.y:GROUND-30;
  for(const d of[-1,1])B_(L,p,{x:p.x,y,vx:d*560,vy:0,r:32,dmg:6,life:1.1,k:'tsunami',pierce:true,noGain:true,draw:miniWave,t:0,upd:(b,L,dt)=>{b.t=(b.t||0)+dt;b.vy=0;
    for(const e of L.eb)if(!e.parry&&!e.dead&&Math.abs(e.x-b.x)<46&&Math.abs(e.y-b.y)<70){e.dead=true;}}});
  sfx('splash');shake(L,6);};
})();
