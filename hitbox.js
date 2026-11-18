/* hitbox.js — fairer hitboxes, Cuphead-style:
   - a player shot counts as soon as its drawing touches the boss (a few px of grace, more for bullets
     whose drawing is bigger than their old hit circle)
   - fast shots are tested along the path they travelled this frame, so they can't skip through thin parts
   - big decorative parts that you'd expect to hit (bat/moth/dragonfly wings, the ends of the blimp,
     the giant shadow's legs…) now take shots too. These extra parts only take hits: touching them doesn't hurt you.
   Pure math on positions, so online play stays in sync. */
(function(){
const GRACE={chispa:3,conv:5,twist:5,varita:5,part:5,luci:4,bomba:5,cometon:9,petardo:3,bume:2,baston:3,bat:3,yoyo:2,shuri:3,agua:3,canica:2,palomitas:3,rebote:2,bubble:2,saw:3,tack:3};
window.bulHit=function(en,b,dt){const r=b.r+(GRACE[b.k]??3);if(en.hitBy(b.x,b.y,r))return true;
  const vx=b.vx||0,vy=b.vy||0,step=Math.hypot(vx,vy)*(dt||1/60);if(step<=r)return false;
  const n=Math.min(6,Math.ceil(step/r));for(let i=1;i<n;i++){const f=i/n;if(en.hitBy(b.x-vx*dt*f,b.y-vy*dt*f,r))return true;}return false;};
window.SHOTX={
  murcielago:B=>[{x:B.x-130,y:B.y-15,r:58},{x:B.x+130,y:B.y-15,r:58},{x:B.x-182,y:B.y-28,r:30},{x:B.x+182,y:B.y-28,r:30}],
  polilla:B=>[{x:B.x-82,y:B.y-42,r:52},{x:B.x+82,y:B.y-42,r:52},{x:B.x-58,y:B.y+40,r:36},{x:B.x+58,y:B.y+40,r:36},{x:B.x,y:B.y+70,r:24}],
  libelula:B=>[{x:B.x-8,y:B.y-62,r:40},{x:B.x-8,y:B.y+62,r:40},{x:B.x+90,y:B.y+2,r:14},{x:B.x+125,y:B.y+2,r:14}],
  pinguino:B=>B.phase<2?[{x:B.x-100,y:B.y-35,r:55},{x:B.x+100,y:B.y-35,r:55}]:[],
  sombra:B=>B.giant?[{x:B.gx,y:380,r:70}]:[{x:B.x,y:B.y-25,r:26}],
  buho:B=>{const y=typeof owlY==='function'?owlY(B):B.y-210;return[{x:B.x-100,y:y+5,r:42},{x:B.x+100,y:y+5,r:42}];},
};
const _mbl=makeBossLevel;makeBossLevel=function(def){const L=_mbl(def);const B=L.boss,X=B&&SHOTX[def.id];
  if(X){const h=B.hitBy;B.hitBy=(x,y,r)=>h(x,y,r)||(!B.dead&&!B.hidden&&X(B).some(s=>s.w!==undefined?circRect(x,y,r,s.x,s.y,s.w,s.h):Math.hypot(x-s.x,y-s.y)<s.r+r));}
  return L;};
})();
