const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const slabs=[
{c:'IV-028',n:'Ivory Travertine',t:'trav',f:'Honed',w:280,h:140,k:'Travertine',col:'Ivory / Beige',m:96},
{c:'CG-014',n:'Calacatta Gold',t:'cal',f:'Polished',w:320,h:160,k:'Marble',col:'White / Gold',m:84},
{c:'PG-012',n:'Pietra Grey',t:'grey',f:'Honed',w:300,h:170,k:'Marble',col:'Grey',m:68},
{c:'VA-006',n:'Verde Alpi',t:'verde',f:'Polished',w:290,h:180,k:'Marble',col:'Green',m:61},
{c:'CG-015',n:'Calacatta Gold',t:'cal',f:'Polished',w:310,h:160,k:'Marble',col:'White / Gold'},
{c:'IV-029',n:'Ivory Travertine',t:'trav',f:'Honed',w:285,h:145,k:'Travertine',col:'Ivory / Beige'}];
const src=[['Calacatta White','white','Italy','3000 × 1800','180'],['Carrara White','carr','Italy','2800 × 1600','108','10%'],['Calacatta Gold','cal','Italy','3000 × 1900','260'],['Emperador Dark','emp','Spain','2700 × 1600','83.60','12%'],['Nero Marquina','nero','Spain','2800 × 1700','110'],['Travertine','trav','Turkey','3000 × 1800','72.25','15%']];
const tops=[['Calacatta White','white','Rectangle','1400 × 800','260'],['Carrara White','carr','Rectangle','1200 × 600','150'],['Calacatta Gold','cal','Round','Ø900','320'],['Nero Marquina','nero','Rectangle','1600 × 900','180'],['Travertine','trav','Square','1200 × 1200','140']];
const bases=[['Black Double Pedestal','Powder-coated steel · Up to 1600 × 900 mm','140','b1'],['Black X-Frame','Powder-coated steel · Up to 1800 × 950 mm','160','b2'],['Brass Twin Pedestal','Brushed brass steel · Rectangle or Ø900 tops','220','b3'],['Oak Trestle','Solid oak, matte finish · Up to 1600 × 900 mm','190','b4']];
const faq=[
['How do you source and match slabs?','We source across China’s quarries and markets. Send a name or photo; we inspect candidates and source alternatives if needed.'],
['Is matching done automatically by AI?','Matching is visual and preliminary. Our team reviews every shortlist.'],
['What are the payment terms?','Paid in full before shipping. Terms are on the proforma invoice.'],
['Can I get samples before ordering?','Yes. Free for genuine buyers; you pay courier.'],
['What QC do you do before shipment?','Digital and physical dry-lay, with video before packing.'],
['Can I visit the factory?','Yes. Factory visits are welcome.'],
['Do you offer standalone QC for China sourcing?','Yes. Standalone QC is available for China sourcing.'],
['Do you handle export and shipping?','Yes. Production, inspection, packing, documents, and shipping.'],
['Can I order one slab or a small quantity?','Yes. Tell us your quantity in the inquiry form.'],
['What shipping methods and lead times are available?','Confirmed per project.'],
['How is export packing handled?','Packing and inspection are done before shipping.'],
['What export documents are provided?','Prepared with your shipment and listed on the proforma invoice.'],
['How do I maintain the marble?','pH-neutral cleaner, soft cloth. Avoid acid and abrasives.']];
const S={cur:slabs[0],sel:[slabs[0]],photo:null,photoName:'kitchen-inspiration.jpg'};
const store={get:()=>{try{return JSON.parse(localStorage.getItem('sm_inq')||'[]')}catch(e){return[]}},set:v=>{try{localStorage.setItem('sm_inq',JSON.stringify(v))}catch(e){}}};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2200)};
const go=v=>{location.hash=v};
const area=(s,q)=>(s.w*s.h*q/1e4).toFixed(2);
const desc=s=>s.k==='Travertine'?'Warm tones, layered pattern. Honed finish.':`Natural veining. ${s.f} finish.`;

/* routing */
function route(){
  let h=location.hash.slice(1)||'home';const el=document.getElementById(h);if(!el||!el.classList.contains('view'))h='home';
  $$('.view').forEach(v=>v.classList.toggle('on',v.id===h));
  $('#reqBtn').classList.toggle('act',h==='samples');
  $('#drawer').classList.remove('on');window.scrollTo(0,0);
  ({inventory:renderInv,results:renderRes,detail:renderDetail,inquiry:renderInq,inquiries:renderInqs,idetail:renderIdetail})[h]?.();
}
addEventListener('hashchange',route);
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.dataset.go)}
  if(e.target.closest('[data-demo]')){e.preventDefault();setPhoto(null,'kitchen-inspiration.jpg')}
  const d=e.target.closest('[data-slab]');if(d){e.preventDefault();S.cur=slabs.find(s=>s.c===d.dataset.slab);go('detail')}
  if(e.target.id==='menuBtn')$('#drawer').classList.add('on');
  if(e.target.id==='drawer'||e.target.closest('#drawer a'))$('#drawer').classList.remove('on');
});
addEventListener('keydown',e=>{if(e.key==='Escape')$('#drawer').classList.remove('on')});

/* upload */
function setPhoto(url,name){
  S.photo=url;S.photoName=name;
  $$('#revBox,#resBox,#xImg').forEach(b=>{b.style.background=url?`center/cover url("${url}")`:'';b.classList.toggle('kit',!url)});
  $('#revName').textContent=name;go('review');
}
function pick(f){
  if(!f)return;
  if(!/^image\/(jpeg|png|webp)$/.test(f.type))return toast('Use a JPG, PNG or WEBP file');
  if(f.size>20*1048576)return toast('File is over 20 MB');
  const r=new FileReader();r.onload=()=>setPhoto(r.result,f.name);r.readAsDataURL(f);
}
$('#pick').onclick=$('#replace').onclick=()=>$('#file').click();
$('#snap').onclick=()=>$('#cam').click();
$('#file').onchange=e=>pick(e.target.files[0]);$('#cam').onchange=e=>pick(e.target.files[0]);
const dz=$('#drop');
['dragover','dragenter'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('hot')}));
['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('hot')}));
dz.addEventListener('drop',e=>pick(e.dataTransfer.files[0]));dz.onclick=()=>$('#file').click();

/* results */
function renderRes(){
  $('#resGrid').innerHTML=slabs.slice(0,4).map(s=>{const on=S.sel.includes(s);return`<div class="card res"><div class="img ${s.t}"><span class="tag r">${s.m}% match</span></div><h3 class="mt2">${s.n}</h3><p class="m">${s.k} · ${s.f} · Available</p><div class="row"><button class="btn o s" data-slab="${s.c}">View details →</button><button class="btn s ${on?'sel':''}" data-pick="${s.c}">${on?'✓ Selected':'+ Add to inquiry'}</button></div></div>`}).join('');
  const n=S.sel.length;$('#resSel').innerHTML=`${n} material${n==1?'':'s'} selected <span class="mu">· ${S.sel.map(s=>s.n).join(', ')}</span>`;
}
$('#resGrid').addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(!b)return;const s=slabs.find(x=>x.c===b.dataset.pick);S.sel=S.sel.includes(s)?S.sel.filter(x=>x!==s):[...S.sel,s];renderRes()});
$('#resNext').onclick=()=>{if(!S.sel.length)return toast('Select a material first');S.cur=S.sel[0];go('inquiry')};

/* inventory */
const fav=new Set();
function renderInv(){
  const q=$('#q').value.trim().toLowerCase();
  const l=slabs.filter(s=>(s.n+s.c).toLowerCase().includes(q));
  const m=l.filter(s=>s.k==='Marble').length;
  $('#invCount').textContent=`${l.length} slab${l.length==1?'':'s'} available · Marble (${m}) · Travertine (${l.length-m}) · Honed / Polished`;
  $('#invGrid').innerHTML=l.length?l.map(s=>`<div class="card"><div class="img ${s.t}"><span class="tag">Available</span><button class="heart ${fav.has(s.c)?'on':''}" data-fav="${s.c}" aria-label="Save">${fav.has(s.c)?'♥':'♡'}</button></div><p class="sm mu mt2">${s.c}</p><h3>${s.n}</h3><p class="sm mu">${s.f} · ${s.w} × ${s.h} cm</p><a class="lnk sm mt2" href="#" data-slab="${s.c}">View material details →</a></div>`).join(''):'<p class="mu">No slabs found. Try another name or code.</p>';
  $('#srcGrid').innerHTML=src.map(s=>`<div class="card"><div class="img ${s[1]}"></div><h3 class="mt2">${s[0]}</h3><p class="sm mu">${s[2]} · ${s[3]} × 20 mm</p><div class="bar mt2" style="flex-wrap:nowrap;align-items:flex-start"><span class="sm">USD ${s[4]} / m²${s[5]?` · ${s[5]} off`:''}</span><a class="lnk sm" href="#inquiry" style="white-space:nowrap">Inquire →</a></div></div>`).join('');
}
$('#q').oninput=renderInv;
$('#invGrid').addEventListener('click',e=>{const b=e.target.closest('[data-fav]');if(!b)return;const c=b.dataset.fav;fav.has(c)?fav.delete(c):fav.add(c);renderInv()});

/* detail */
function renderDetail(){
  const s=S.cur;
  $('#dCrumb').textContent=`INVENTORY / ${s.k.toUpperCase()} / ${s.n.toUpperCase()}`;
  $('#dImg').className='img '+s.t;$('#dName').textContent=s.n;$('#dCode').textContent=s.c+' · Natural stone collection';$('#dDesc').textContent=desc(s);
  $('#dSpec').innerHTML=[['Material type',s.k],['Slab dimensions',`${s.w} × ${s.h} cm`],['Thickness','20 mm'],['Finish',s.f],['Color',s.col||'—']].map(r=>`<div class="kv"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
}
$('#dAdd').onclick=()=>{if(!S.sel.includes(S.cur))S.sel=[...S.sel,S.cur];S.cur=S.cur;toast('Added to inquiry');go('inquiry')};
$('#dDl').onclick=()=>{const s=S.cur,b=new Blob([`${s.n} (${s.c})\nType: ${s.k}\nSize: ${s.w} x ${s.h} cm\nThickness: 20 mm\nFinish: ${s.f}\nColor: ${s.col}\n`],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=s.c+'-specs.txt';a.click();toast('Specifications downloaded')};

/* inquiry */
function renderInq(){
  const s=S.cur,q=+$('#qty').value,m=$('#form').elements.msg;
  $('#iThumb').className='thumb '+s.t;$('#iName').textContent=s.n+(S.sel.length>1&&S.sel.includes(s)?` +${S.sel.length-1} more`:'');
  $('#iSpec').innerHTML=`${s.c} · ${s.f}<br>${s.w} × ${s.h} cm · 20 mm`;
  $('#iQty').textContent=q+(q>1?' slabs':' slab');$('#iArea').textContent=area(s,q)+' m²';
  if(!m.dataset.edit)m.value=`I’m interested in ${s.n} for a kitchen countertop. Please share pricing and delivery.`;
  m.oninput=()=>{m.dataset.edit=1};
}
$('#qty').onchange=renderInq;
$('#send').onclick=()=>{
  const f=$('#form'),bad=[];
  $$('[required]',f).forEach(i=>{const ok=i.type==='email'?/^\S+@\S+\.\S+$/.test(i.value):i.value.trim();i.classList.toggle('err',!ok);i.closest('div').querySelector('.errm').style.display=ok?'none':'block';if(!ok)bad.push(i)});
  const ag=$('#agree').checked;$('#agreeErr').style.display=ag?'none':'block';
  if(bad.length||!ag){(bad[0]||$('#agree')).focus();return}
  const d=Object.fromEntries(new FormData(f)),s=S.cur,q=+d.qty,now=new Date();
  const id=`SM-${String(now.getFullYear()).slice(2)}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${s.c.slice(-3)}`;
  const more=S.sel.filter(x=>x!==s).map(x=>x.n+' ('+x.c+')');if(more.length)d.msg=(d.msg?d.msg+'\n':'')+'Also interested in: '+more.join(', ');
  const rec={id,c:s.c,qty:q,area:area(s,q),date:now.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),...d};
  store.set([rec,...store.get()]);S.last=rec;
  $('#sThanks').textContent=`Thank you, ${d.name.split(' ')[0]}. You’re one step closer to your dream space.`;
  $('#sNo').textContent=id;$('#sDate').textContent=rec.date+' · ✓ Sent';
  $('#sThumb').className='thumb '+s.t;$('#sName').textContent=s.n;$('#sMail').textContent=d.email;
  $('#sInfo').innerHTML=`${s.c} · ${s.f} · ${s.w} × ${s.h} cm<br>${q} slab${q>1?'s':''} · ${rec.area} m² · ${d.type}, ${d.loc}`;
  f.reset();delete f.elements.msg.dataset.edit;$('#agree').checked=false;go('sent');
};

/* my inquiries */
function renderInqs(){
  const l=store.get();
  $('#inqHead').textContent=`All inquiries (${l.length})`;
  $('#inqList').innerHTML=l.length?l.map(r=>{const s=slabs.find(x=>x.c===r.c);return`<div class="card mat" style="margin:0;gap:24px;align-items:flex-start"><div class="thumb ${s.t}" style="width:clamp(80px,18vw,125px);height:clamp(80px,18vw,125px)"></div><div><p class="gold sm">${r.id}</p><h2 style="font-size:24px;margin:4px 0 12px">${s.n}</h2><p class="sm mu">${r.type} · ${r.loc}<br>${r.date} · ${r.qty} slab${r.qty>1?'s':''} · ${r.area} m²</p><p class="sm mt2"><span class="gold">Sent — awaiting team review</span> · <a href="#" data-inq="${r.id}">View details →</a></p></div></div>`}).join(''):'<div class="card"><p>No inquiries yet.</p><a class="btn mt2" href="#inventory">Browse inventory →</a></div>';
}
$('#inqList').addEventListener('click',e=>{const a=e.target.closest('[data-inq]');if(!a)return;e.preventDefault();S.last=store.get().find(r=>r.id===a.dataset.inq);go('idetail')});
function renderIdetail(){
  const r=S.last||store.get()[0];if(!r)return go('inquiries');
  const s=slabs.find(x=>x.c===r.c);
  $('#xCrumb').textContent='MY INQUIRIES / '+r.id;$('#xSub').textContent=`Submitted ${r.date} · Sent — awaiting team review`;
  $('#xName').textContent=s.n;$('#xSpec').textContent=`${s.c} · ${s.f} · ${s.w} × ${s.h} cm · 20 mm`;
  $('#xProj').textContent=`${r.type} · ${r.loc}`;$('#xQty').textContent=`${r.qty} slab${r.qty>1?'s':''} · ${r.area} m² / ${r.time}`;
  $('#xMsg').textContent=r.msg||'—';
  const mt=[s,...slabs.filter(x=>x!==s&&x.n!==s.n)].slice(0,3);
  $('#xMatch').innerHTML=mt.map(m=>`<div class="card"><div class="img ${m.t}" style="aspect-ratio:2/1"></div><h3 class="mt2">${m.n}</h3><p class="sm mu">${m.f} · ${m.w} × ${m.h} cm</p><a class="lnk sm mt2" href="#" data-slab="${m.c}">View slab details →</a></div>`).join('');
}

/* samples */
$('#sform').onsubmit=e=>{e.preventDefault();const ok=$('#swa').value.trim()||$('#sem').value.trim();$('#sHint').style.color=ok?'':'#e07a70';if(!ok)return $('#swa').focus();e.target.reset();toast('Sample request sent');go('home')};

/* tabletops */
let shape='All shapes';
function renderTops(){
  $('#shapes').innerHTML=['All shapes','Rectangle','Round','Square'].map(s=>`<button class="${s===shape?'on':''}">${s}</button>`).join('');
  $('#topGrid').innerHTML=tops.filter(t=>shape==='All shapes'||t[2]===shape).map(t=>`<div class="card"><div class="img ${t[1]}"></div><h3 class="mt2">${t[0]}</h3><p class="sm mu">${t[2]} · ${t[3]} × 20 mm</p><div class="bar mt2" style="flex-wrap:nowrap;align-items:flex-start"><span class="sm mu">USD ${t[4]} / top</span><a class="lw" href="#inquiry" style="text-align:right">Match a base →</a></div></div>`).join('');
  $('#baseGrid').innerHTML=bases.map(b=>`<div class="card"><div class="img ${b[3]}" style="aspect-ratio:1/1"></div><h3 class="mt2">${b[0]}</h3><p class="sm mu">${b[1]}</p><p class="sm mt2">USD ${b[2]} / <a class="lnk sm" href="#inquiry">Inquire →</a></p></div>`).join('');
}
$('#shapes').addEventListener('click',e=>{if(e.target.tagName==='BUTTON'){shape=e.target.textContent;renderTops()}});

/* faq */
$('#faqList').innerHTML=faq.map((f,i)=>`<div class="faq${i?'':' on'}"><button aria-expanded="${i?'false':'true'}">${f[0]}<i>+</i></button><p>${f[1]}</p></div>`).join('');
$('#faqList').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.parentNode,o=d.classList.toggle('on');b.setAttribute('aria-expanded',o)});

renderTops();route();

/* ===== scroll reveal (added) =====
   Elemen muncul saat masuk layar, dan menghilang lagi saat keluar:
   scroll ke bawah -> yang di bawah muncul; scroll ke atas -> yang di atas muncul,
   yang keluar layar disembunyikan lagi sehingga animasi selalu berulang. */
(()=>{
  if(!('IntersectionObserver' in window))return;
  const SEL='.view > *:not(.g2):not(.g3):not(.g4):not(.split):not(.hero):not(#faqList),.view > .g2 > *,.view > .g3 > *,.view > .g4 > *,.view > .split > *,.view > .hero > *,.view > #faqList > *';
  let routeAt=performance.now();
  addEventListener('hashchange',()=>{routeAt=performance.now()});
  const io=new IntersectionObserver(es=>es.forEach(({target:el,isIntersecting,boundingClientRect:r})=>{
    if(isIntersecting)el.classList.add('in');
    else{el.style.setProperty('--ty',r.top>0?'32px':'-32px');el.classList.remove('in','now')}
  }),{rootMargin:'-56px 0px -6% 0px'});
  function scan(){
    $$(SEL).filter(el=>!el._rv).forEach(el=>{
      el._rv=1;
      const p=el.parentNode;
      const i=p.classList.contains('view')?0:[...p.children].filter(c=>c.matches(SEL)).indexOf(el);
      el.style.setProperty('--d',Math.min(i,6)*70+'ms');
      const r=el.getBoundingClientRect();
      el.classList.add('rv');
      /* re-render di halaman yang sama (mis. klik ♡) tidak perlu animasi ulang */
      if(r.height>0&&r.top<innerHeight&&r.bottom>0&&performance.now()-routeAt>600)el.classList.add('in','now');
      io.observe(el);
    });
  }
  new MutationObserver(scan).observe($('main'),{childList:true,subtree:true});
  scan();
})();

/* ===== infographics: count-up angka (added) ===== */
(()=>{
  if(!('IntersectionObserver' in window))return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run=el=>{
    const to=+el.dataset.to,s=el.querySelector('span');if(!s)return;
    cancelAnimationFrame(el._raf);
    if(reduce){s.textContent=to;return}
    const t0=performance.now(),d=1100;
    const f=t=>{const p=Math.min((t-t0)/d,1),e=1-Math.pow(1-p,3);s.textContent=Math.round(to*e);if(p<1)el._raf=requestAnimationFrame(f)};
    el._raf=requestAnimationFrame(f);
  };
  const io=new IntersectionObserver(es=>es.forEach(({target:el,isIntersecting})=>{
    if(isIntersecting)run(el);
    else{cancelAnimationFrame(el._raf);const s=el.querySelector('span');if(s)s.textContent=0}
  }),{rootMargin:'-56px 0px -6% 0px'});
  $$('.ig-num[data-to]').forEach(el=>io.observe(el));
})();
