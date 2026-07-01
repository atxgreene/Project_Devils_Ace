/* Devil's Ace — Practice Coach overlay (content script, injected on demand)
   Practice/training companion only. No page scraping, no automation, no
   real-money assistance. You log cards yourself; the overlay does the math. */
(() => {
  // Re-injection toggles visibility instead of duplicating the HUD.
  if (window.__devilsAce) { window.__devilsAce.toggle(); return; }

  /* ---------- engine (ported from the web app) ---------- */
  const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const rankVal = r => r === 'A' ? 11 : (['10','J','Q','K'].includes(r) ? 10 : +r);
  const REDS = ['♥','♦'];
  function handTotal(cards){ let t=0,a=0; for(const c of cards){ t+=rankVal(c.r); if(c.r==='A')a++; } while(t>21&&a>0){t-=10;a--;} return {total:t, soft:a>0&&t<=21}; }
  const SYSTEMS = {
    hilo:{name:'Hi-Lo',tag:c=>{const v=rankVal(c.r);if(v>=2&&v<=6)return 1;if(v>=10||c.r==='A')return -1;return 0;}},
    ko:{name:'KO',tag:c=>{const v=rankVal(c.r);if((v>=2&&v<=6)||c.r==='7')return 1;if(v>=10||c.r==='A')return -1;return 0;}},
    hiopt1:{name:'Hi-Opt I',tag:c=>{const v=rankVal(c.r);if(v>=3&&v<=6)return 1;if(v===10)return -1;return 0;}},
    omega2:{name:'Omega II',tag:c=>{const v=rankVal(c.r);if(c.r==='A')return 0;if([2,3,7].includes(v))return 1;if([4,5,6].includes(v))return 2;if(v===9)return -1;if(v===10)return -2;return 0;}},
    zen:{name:'Zen',tag:c=>{const v=rankVal(c.r);if(c.r==='A')return -1;if([2,3,7].includes(v))return 1;if([4,5,6].includes(v))return 2;if(v===10)return -2;return 0;}},
    red7:{name:'Red 7',tag:c=>{const v=rankVal(c.r);if(v>=2&&v<=6)return 1;if(c.r==='7')return REDS.includes(c.s)?1:0;if(v>=10||c.r==='A')return -1;return 0;}}
  };
  const ACT = {H:'Hit',S:'Stand',D:'Double',P:'Split',R:'Surrender'};
  // Illustrious 18 + Fab 4 (Hi-Lo indices). up is numeric (A=11). play = tc>=idx ? at : below.
  const DEV = [
    {desc:'16 v 10',t:16,up:10,idx:0,at:'S',below:'H'},
    {desc:'15 v 10',t:15,up:10,idx:4,at:'S',below:'H'},
    {desc:'T,T v 5',pair:10,up:5,idx:5,at:'P',below:'S'},
    {desc:'T,T v 6',pair:10,up:6,idx:4,at:'P',below:'S'},
    {desc:'10 v 10',t:10,up:10,idx:4,at:'D',below:'H'},
    {desc:'12 v 3',t:12,up:3,idx:2,at:'S',below:'H'},
    {desc:'12 v 2',t:12,up:2,idx:3,at:'S',below:'H'},
    {desc:'11 v A',t:11,up:11,idx:1,at:'D',below:'H'},
    {desc:'9 v 2',t:9,up:2,idx:1,at:'D',below:'H'},
    {desc:'10 v A',t:10,up:11,idx:4,at:'D',below:'H'},
    {desc:'9 v 7',t:9,up:7,idx:3,at:'D',below:'H'},
    {desc:'16 v 9',t:16,up:9,idx:5,at:'S',below:'H'},
    {desc:'13 v 2',t:13,up:2,idx:-1,at:'S',below:'H'},
    {desc:'12 v 4',t:12,up:4,idx:0,at:'S',below:'H'},
    {desc:'12 v 5',t:12,up:5,idx:-2,at:'S',below:'H'},
    {desc:'12 v 6',t:12,up:6,idx:-1,at:'S',below:'H'},
    {desc:'13 v 3',t:13,up:3,idx:-2,at:'S',below:'H'},
    {desc:'14 v 10',t:14,up:10,idx:3,at:'R',below:'H'},
    {desc:'15 v 10',t:15,up:10,idx:0,at:'R',below:'H'},
    {desc:'15 v 9',t:15,up:9,idx:2,at:'R',below:'H'},
    {desc:'15 v A',t:15,up:11,idx:1,at:'R',below:'H'}
  ];
  function basicStrategy(player, up, opt, R){
    const {total,soft}=handTotal(player);
    const pair=player.length===2 && rankVal(player[0].r)===rankVal(player[1].r);
    const canP=opt.canSplit!==false && pair;
    const canR=opt.canSurrender!==false && player.length===2 && R.surr;
    if(canP){ const pv=rankVal(player[0].r), das=R.das;
      if(pv===11)return'P'; if(pv===10)return'S'; if(pv===9)return(up===7||up>=10)?'S':'P';
      if(pv===8)return'P'; if(pv===7)return up<=7?'P':'H'; if(pv===6)return(up>=(das?2:3)&&up<=6)?'P':'H';
      if(pv===5)return null; if(pv===4)return(das&&(up===5||up===6))?'P':'H'; if(pv===3||pv===2)return(up>=(das?2:4)&&up<=7)?'P':'H'; }
    if(soft){ if(total>=20)return'S'; if(total===19){if(R.h17&&up===6&&opt.canDouble!==false)return'D';return'S';}
      if(total===18){ if(opt.canDouble!==false&&up>=3&&up<=6)return'D'; if(R.h17&&opt.canDouble!==false&&up===2)return'D'; if(up===2||up===7||up===8)return'S'; return'H'; }
      if(total===17)return(opt.canDouble!==false&&up>=3&&up<=6)?'D':'H';
      if(total===16||total===15)return(opt.canDouble!==false&&up>=4&&up<=6)?'D':'H';
      if(total===14||total===13)return(opt.canDouble!==false&&up>=5&&up<=6)?'D':'H'; return'H'; }
    if(total>=17){ if(total===17&&R.h17&&canR&&up===11)return'R'; return'S'; }
    if(total===16){ if(canR&&(up===9||up>=10))return'R'; return(up>=2&&up<=6)?'S':'H'; }
    if(total===15){ if(canR&&(up===10||(R.h17&&up===11)))return'R'; return(up>=2&&up<=6)?'S':'H'; }
    if(total>=13&&total<=14)return(up>=2&&up<=6)?'S':'H';
    if(total===12)return(up>=4&&up<=6)?'S':'H';
    if(total===11){ if(opt.canDouble===false)return'H'; if(up===11&&!R.h17)return'H'; return'D'; }
    if(total===10)return(opt.canDouble!==false&&up>=2&&up<=9)?'D':'H';
    if(total===9)return(opt.canDouble!==false&&up>=3&&up<=6)?'D':'H';
    return'H';
  }
  function bsResolve(player, upCard, opt, R){
    let a=basicStrategy(player,rankVal(upCard.r),opt,R);
    if(a==='D'&&(opt.canDouble===false||player.length!==2))a=(handTotal(player).soft&&handTotal(player).total>=18)?'S':'H';
    if(a==='R'&&(opt.canSurrender===false||!R.surr))a='H';
    if(a===null){ a=basicStrategy(player,rankVal(upCard.r),Object.assign({},opt,{canSplit:false}),R)||'H'; if(a==='P')a='H'; }
    return a;
  }
  function betUnits(tc){ if(tc<1)return 1; return Math.min(8,Math.round(1+(tc-1)*7/4)); }
  const fmt = n => (n>0?'+':'')+n;

  // count-aware coach: basic strategy + live Illustrious 18 / Fab 4 index plays
  function liveTC(){ const rem=Math.max(0.25, R.decks - seen/52); return run/rem; }
  function coachResolve(player, upCard){
    const up=rankVal(upCard.r);
    const {total,soft}=handTotal(player);
    const two=player.length===2;
    const pair = two && rankVal(player[0].r)===rankVal(player[1].r) ? rankVal(player[0].r) : null;
    const base=bsResolve(player, upCard, {canDouble:two, canSplit:two, canSurrender:two}, R);
    const tc=Math.round(liveTC());
    const matches=DEV.filter(d => d.up===up && (d.pair!=null ? pair===d.pair : (!soft && pair==null && total===d.t)));
    const active=[];
    for(const d of matches){
      const trig = d.idx>=0 ? tc>=d.idx : tc<d.idx;
      if(!trig) continue;
      const act = d.idx>=0 ? d.at : d.below;
      if(act==='R' && (!R.surr || !two)) continue;
      if(act==='D' && !two) continue;
      if(act==='P' && pair==null) continue;
      active.push({act,d});
    }
    let headline=base, deviated=false;
    if(active.length){
      const pick = active.find(x=>x.act!=='R') || active[0];
      if(pick.act!==base){ headline=pick.act; deviated=true; }
    }
    return {headline, base, deviated, matches, active, tc, insurance: up===11 && tc>=3};
  }
  function devRuleText(d, rr){
    const on = rr.active.some(x=>x.d===d);
    const rule = d.idx>=0 ? `${ACT[d.at]} at TC ≥ ${fmt(d.idx)}` : `${ACT[d.below]} when TC < ${fmt(d.idx)}`;
    return `${on?'✓':'·'} ${d.desc}: ${rule}${on?' — active now':''}`;
  }

  /* ---------- settings ---------- */
  const DEF={system:'hilo',decks:6,h17:false,das:true,surr:true};
  let R={...DEF};
  function loadSettings(){ try{ chrome.storage.sync.get('da_ext',o=>{ if(o&&o.da_ext) R={...DEF,...o.da_ext}; sys=SYSTEMS[R.system]||SYSTEMS.hilo; render(); }); }catch(e){} }
  try{ chrome.storage.onChanged.addListener((ch,area)=>{ if(ch.da_ext){ R={...DEF,...ch.da_ext.newValue}; sys=SYSTEMS[R.system]||SYSTEMS.hilo; render(); } }); }catch(e){}
  let sys=SYSTEMS.hilo;

  /* ---------- state ---------- */
  let run=0, seen=0, color='black';
  let tab='count';
  let coachPlayer=[], coachUp=null;

  /* ---------- UI ---------- */
  const host=document.createElement('div');
  host.id='__devils_ace_host';
  const root=host.attachShadow({mode:'open'});
  const style=document.createElement('style');
  style.textContent=`
    :host{all:initial}
    .wrap{position:fixed;top:16px;right:16px;z-index:2147483647;width:288px;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;color:#e9efe9;
      background:linear-gradient(180deg,#0d1a15,#0a1410);border:1px solid rgba(255,255,255,.12);border-radius:16px;box-shadow:0 18px 44px -14px rgba(0,0,0,.7);overflow:hidden}
    .hd{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:move;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.08)}
    .sp{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;color:#0a1410;font-size:15px;background:linear-gradient(135deg,#f4c96b,#e8b04b);flex:none}
    .hd b{font-size:13px;letter-spacing:.3px} .hd .sub{font-size:9px;letter-spacing:1.5px;color:#8ea79a;text-transform:uppercase}
    .x{margin-left:auto;display:flex;gap:4px}
    .x button{background:rgba(255,255,255,.06);border:0;color:#e9efe9;border-radius:7px;width:24px;height:24px;cursor:pointer;font-size:13px}
    .x button:hover{background:rgba(255,255,255,.14)}
    .warn{background:rgba(224,82,63,.14);color:#ffb0a4;font-size:10.5px;line-height:1.4;padding:7px 12px;border-bottom:1px solid rgba(224,82,63,.3)}
    .tabs{display:flex;border-bottom:1px solid rgba(255,255,255,.08)}
    .tabs button{flex:1;background:none;border:0;color:#8ea79a;padding:9px 0;font-size:12px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent}
    .tabs button.on{color:#e8b04b;border-bottom-color:#e8b04b}
    .body{padding:12px}
    .stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px}
    .pill{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:7px 8px;text-align:center}
    .pill .v{font-size:19px;font-weight:700;font-variant-numeric:tabular-nums} .pill .k{font-size:8.5px;color:#8ea79a;letter-spacing:.5px;text-transform:uppercase;margin-top:1px}
    .gold{color:#e8b04b}.grn{color:#37c98b}
    .bet{background:rgba(232,176,75,.1);border:1px solid rgba(232,176,75,.3);border-radius:10px;padding:8px;text-align:center;margin-bottom:10px}
    .bet .v{font-size:17px;font-weight:700;color:#e8b04b}.bet .k{font-size:9px;color:#8ea79a;text-transform:uppercase;letter-spacing:.5px}
    .kp{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}
    .kp button{padding:9px 0;font-size:13px;font-weight:700;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#e9efe9;cursor:pointer}
    .kp button:hover{background:rgba(255,255,255,.13)}
    .kp button.sel{outline:2px solid #e8b04b}
    .rowb{display:flex;gap:6px;align-items:center;margin-top:9px;flex-wrap:wrap}
    .mini{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#e9efe9;border-radius:7px;padding:6px 9px;font-size:11px;cursor:pointer}
    .mini:hover{background:rgba(255,255,255,.12)}
    .clr{display:flex;gap:5px;align-items:center;font-size:11px;color:#8ea79a}
    .swch{display:flex;border:1px solid rgba(255,255,255,.12);border-radius:8px;overflow:hidden}
    .swch button{background:none;border:0;color:#8ea79a;padding:5px 9px;font-size:11px;cursor:pointer}
    .swch button.on{background:#e8b04b;color:#0a1410;font-weight:700}
    .num{width:46px;background:#0d1a15;border:1px solid rgba(255,255,255,.12);color:#e9efe9;border-radius:7px;padding:5px;font-size:12px;text-align:center}
    .coach-res{margin-top:10px;padding:11px;border-radius:10px;text-align:center;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1)}
    .coach-res .big{font-size:22px;font-weight:800;color:#37c98b} .coach-res .sm{font-size:11px;color:#8ea79a;margin-top:2px}
    .coach-res.dev{border-color:#e8b04b;background:rgba(232,176,75,.08)} .coach-res.dev .big{color:#e8b04b}
    .dev-badge{display:inline-block;margin-top:7px;font-size:9.5px;font-weight:800;letter-spacing:1px;color:#0a1410;background:#e8b04b;border-radius:6px;padding:3px 8px}
    .dev-note{font-size:10.5px;color:#9fb3a8;margin-top:9px;line-height:1.55;text-align:left}
    .lbl{font-size:9.5px;letter-spacing:1px;text-transform:uppercase;color:#8ea79a;margin:2px 0 6px}
    .seenrow{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;max-height:44px;overflow:hidden}
    .seenrow span{font-size:10px;font-family:ui-monospace,monospace;padding:2px 5px;border-radius:5px;background:rgba(255,255,255,.06)} .seenrow span.r{color:#ff8b7a}
    .hide{display:none!important}
  `;
  root.appendChild(style);
  const wrap=document.createElement('div'); wrap.className='wrap'; root.appendChild(wrap);
  document.documentElement.appendChild(host);

  function render(){
    wrap.innerHTML=`
      <div class="hd" id="da-hd">
        <div class="sp">♠</div>
        <div><b>Devil's Ace</b><div class="sub">Practice Coach · ${sys.name}</div></div>
        <div class="x"><button id="da-min" title="Collapse">–</button><button id="da-close" title="Close">✕</button></div>
      </div>
      <div class="warn">⚠︎ Practice/training only. Using this on real-money online blackjack breaks casinos' terms and may be illegal. Don't.</div>
      <div id="da-main">
        <div class="tabs"><button data-t="count" class="${tab==='count'?'on':''}">COUNT</button><button data-t="coach" class="${tab==='coach'?'on':''}">COACH</button></div>
        <div class="body">${tab==='count'?countHTML():coachHTML()}</div>
      </div>`;
    wire();
  }
  function countHTML(){
    const decksRem=Math.max(0.25, R.decks - seen/52);
    const tc=run/decksRem;
    return `
      <div class="stats">
        <div class="pill"><div class="v gold">${fmt(run)}</div><div class="k">Running</div></div>
        <div class="pill"><div class="v">${fmt(Math.round(tc))}</div><div class="k">True</div></div>
        <div class="pill"><div class="v">${decksRem.toFixed(1)}</div><div class="k">Decks</div></div>
      </div>
      <div class="bet"><div class="v">$${(betUnits(tc)*25).toLocaleString()}</div><div class="k">Suggested bet (1–8 spread · $25 unit)</div></div>
      <div class="lbl">Tap each card as it's dealt</div>
      <div class="kp" id="da-kp">${RANKS.map(r=>`<button data-r="${r}">${r}</button>`).join('')}</div>
      <div class="rowb">
        <span class="clr">Colour</span>
        <div class="swch" id="da-clr"><button data-c="black" class="${color==='black'?'on':''}">Black ♠</button><button data-c="red" class="${color==='red'?'on':''}">Red ♥</button></div>
        <span style="flex:1"></span>
        <button class="mini" id="da-undo">↶ Undo</button>
        <button class="mini" id="da-reset">Reset</button>
      </div>
      <div class="rowb"><span class="clr">Decks in shoe</span><input class="num" id="da-decks" type="number" min="1" max="8" value="${R.decks}"><span class="clr">Seen: ${seen}</span></div>`;
  }
  function coachHTML(){
    let res='';
    if(coachUp && coachPlayer.length>=2){
      const rr=coachResolve(coachPlayer,{r:coachUp,s:'♠'});
      const t=handTotal(coachPlayer);
      const badge = rr.deviated ? `<div class="dev-badge">⚡ INDEX DEVIATION</div>` : '';
      const baseline = rr.deviated ? `<div class="sm">Basic strategy is ${ACT[rr.base]} — deviate on this count.</div>` : '';
      const idx = rr.matches.length ? `<div class="dev-note">${rr.matches.map(d=>devRuleText(d,rr)).join('<br>')}</div>` : '';
      const ins = rr.insurance ? `<div class="dev-note">＋ Take insurance (dealer Ace, TC ≥ +3)</div>` : '';
      res=`<div class="coach-res ${rr.deviated?'dev':''}"><div class="big">${ACT[rr.headline]}</div>${badge}<div class="sm">${(t.soft?'soft ':'')+t.total} vs dealer ${coachUp} · true count ${fmt(rr.tc)}</div>${baseline}${idx}${ins}</div>`;
    } else res=`<div class="coach-res"><div class="sm">Pick the dealer up-card and add your cards. The play reflects your <b>live true count</b> from the Count tab, flagging Illustrious 18 / Fab 4 index deviations.</div></div>`;
    return `
      <div class="lbl">Dealer up-card</div>
      <div class="kp" id="da-up">${RANKS.map(r=>`<button data-u="${r}" class="${coachUp===r?'sel':''}">${r}</button>`).join('')}</div>
      <div class="lbl" style="margin-top:10px">Your hand ${coachPlayer.length?'— '+coachPlayer.map(c=>c.r).join(' '):''}</div>
      <div class="kp" id="da-ph">${RANKS.map(r=>`<button data-p="${r}">${r}</button>`).join('')}</div>
      <div class="rowb"><button class="mini" id="da-cundo">↶ Undo card</button><button class="mini" id="da-cclear">Clear hand</button></div>
      ${res}`;
  }
  function wire(){
    root.getElementById('da-close').onclick=()=>{ host.remove(); window.__devilsAce=null; };
    root.getElementById('da-min').onclick=()=>{ const m=root.getElementById('da-main'); m.classList.toggle('hide'); };
    root.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;render();});
    if(tab==='count'){
      root.getElementById('da-kp').querySelectorAll('button').forEach(b=>b.onclick=()=>logCard(b.dataset.r));
      root.getElementById('da-clr').querySelectorAll('button').forEach(b=>b.onclick=()=>{color=b.dataset.c;render();});
      root.getElementById('da-undo').onclick=()=>{ if(cards.length){cards.pop();recount();render();} };
      root.getElementById('da-reset').onclick=()=>{ cards=[];run=0;seen=0;render(); };
      root.getElementById('da-decks').onchange=e=>{ R.decks=Math.max(1,Math.min(8,+e.target.value||6)); render(); };
    } else {
      root.getElementById('da-up').querySelectorAll('button').forEach(b=>b.onclick=()=>{coachUp=b.dataset.u;render();});
      root.getElementById('da-ph').querySelectorAll('button').forEach(b=>b.onclick=()=>{coachPlayer.push({r:b.dataset.p,s:'♠'});render();});
      root.getElementById('da-cundo').onclick=()=>{coachPlayer.pop();render();};
      root.getElementById('da-cclear').onclick=()=>{coachPlayer=[];render();};
    }
    dragHandle();
  }
  let cards=[];
  function logCard(r){ const c={r,s:color==='red'?'♥':'♠'}; cards.push(c); run+=sys.tag(c); seen++; render(); }
  function recount(){ run=cards.reduce((a,c)=>a+sys.tag(c),0); seen=cards.length; }

  /* draggable */
  let drag=null;
  function dragHandle(){
    const hd=root.getElementById('da-hd'); if(!hd)return;
    hd.addEventListener('mousedown',e=>{ if(e.target.closest('.x'))return; const rct=wrap.getBoundingClientRect(); drag={dx:e.clientX-rct.left,dy:e.clientY-rct.top}; e.preventDefault(); });
  }
  window.addEventListener('mousemove',e=>{ if(!drag)return; wrap.style.left=(e.clientX-drag.dx)+'px'; wrap.style.top=(e.clientY-drag.dy)+'px'; wrap.style.right='auto'; });
  window.addEventListener('mouseup',()=>drag=null);

  window.__devilsAce={ toggle:()=>{ host.style.display = host.style.display==='none'?'':'none'; },
    _t:{ coachResolve, set:(r,s)=>{ run=r; seen=s; } } };
  loadSettings();
  render();
})();
