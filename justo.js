/* justo.js — fair play pass (like Cuphead: every attack can be dodged with your own moves, no charm needed;
   and every part you can see can be shot).
   1) Charging bosses (the Radio's big drum, etc.) now always stop far enough from the wall to leave you a safe
      strip to stand in. Before, the drum stopped so close to the wall that only the Smoke Bomb dash saved you.
   2) Run & gun mini-bosses can be hit on every part of their drawing (the Lamplighter ghost's hat, lantern and
      tail, the other minis' arms, wheels…). Measured from their drawings, like the bosses.
   3) The Lamplighter ghost floats a bit lower so straight shots (like the boomerang) reach him, and he is only
      untouchable in the middle of his teleport, not during the whole fade. */
(function(){
/* 1) charges */
const _ch=ATK.charge;ATK.charge=function(L,B,a){_ch(L,B,a);const A=B.act;if(!A||A.type!=='charge')return;let ext=90;
  try{const sh=B.def.shapes?B.def.shapes(B):[];for(const s of sh){const e=A.dir>0?(s.w?s.x+s.w:s.x+s.r)-B.x:B.x-(s.w?s.x:s.x-s.r);if(e>ext&&e<400)ext=e;}}catch(e){}
  A.m=Math.max(B.def.margin||170,ext+125);};
/* 2) mini-boss hit cells */
const CS=16,MH={"trabuco":["-1,-8","0,-8","-2,-7","-1,-7","0,-7","1,-7","-2,-6","-1,-6","0,-6","-2,-5","-1,-5","0,-5","1,-5","-3,-5","2,-5","-4,-4","-3,-4","2,-4","3,-4","-7,-3","-4,-3","3,-3","-6,-3","-7,-2","-6,-2","-5,-2","-7,-1","-6,-1","-5,-1","-4,1","3,1","-5,2","-4,2","-3,2","2,2","3,2","4,2","-5,3","-4,3","-3,3","-2,3","1,3","2,3","3,3","4,3","-4,4","-3,4","-2,4","1,4","2,4","3,4"],"chorizo":["-2,-4","-1,-4","0,-4","1,-4","-2,-3","-1,-3","0,-3","1,-3"],"zepelin":["-4,-3","-5,-2","-4,-2","3,-2","4,-2","7,-2","-6,-2","-8,-1","-7,-1","-6,-1","-5,-1","4,-1","5,-1","6,-1","7,-1","-7,0","-6,0","-5,0","4,0","5,0","6,0","7,0","-7,1","-6,1","-5,1","4,1","5,1","7,1","-4,2","3,2","-8,0","6,-2"],"tetera":["-3,-6","-1,-6","-2,-6","-1,-5","-6,-3","-5,-2","4,-2","4,-1","-4,0"],"seta":["-4,-6","3,-6","-5,-6","4,-6","-5,-5","4,-5","-6,-4","-5,-4","4,-4","5,-4","-6,-3","-5,-3","4,-3","5,-3","-6,-2","-5,-2","4,-2","5,-2"],"farolero":["-2,-6","-1,-6","0,-6","1,-6","-2,-5","-1,-5","0,-5","1,-5","-2,-4","-1,-4","0,-4","1,-4","-4,0","-4,1","-4,-1"],"olla":["-1,-5","0,-5","-2,-5","1,-5","2,-5","-4,-5","-3,-5","3,-5","-4,-4","-3,-4","2,-4","3,-4","-4,-3","3,-3","-5,-2","-4,-2","3,-2","4,-2","-2,3","1,3","-1,3","0,3","0,-6"],"gema":["-1,-4","0,-4","-6,0","-5,0","-4,1","3,1","4,0","-5,1","4,1","5,0"]};const SET={};for(const k in MH)SET[k]=new Set(MH[k]);
const _ms=miniStart;miniStart=function(L,g){const e=_ms(L,g);const S=SET[g.k];if(e&&S&&S.size){const h=e.hitBy;
  e.hitBy=(x,y,r)=>{if(h(x,y,r))return true;if(e.dead||(e.fade||0)>.75||e.st==='enter')return false;const x0=Math.floor((x-r-e.x)/CS),x1=Math.floor((x+r-e.x)/CS),y0=Math.floor((y-r-e.y)/CS),y1=Math.floor((y+r-e.y)/CS);
    for(let cy=y0;cy<=y1;cy++)for(let cx=x0;cx<=x1;cx++)if(S.has(cx+','+cy)&&circRect(x,y,r,e.x+cx*CS,e.y+cy*CS,CS,CS))return true;return false;};}return e;};
/* 3) the Lamplighter */
if(typeof MINI!=='undefined'&&MINI.farolero){const F=MINI.farolero;F.init=e=>{e.y=305;e.base=305;};
  F.shapes=e=>(e.fade||0)>.75?[]:[{x:e.x,y:e.y-8,r:56},{x:e.x,y:e.y+40,r:38},{x:e.x,y:e.y-76,r:24},{x:e.x+(e.face||1)*50,y:e.y+20,r:22}];
  const _u=F.upd;F.upd=function(e,L,dt,p){const r=_u.call(this,e,L,dt,p);if(e.base<285)e.base=290+(e.base-150)*.3;return r;};}
})();
