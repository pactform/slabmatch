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
  updateContactLinks(h);
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
  $('#invGrid').innerHTML=l.length?l.map(s=>`<div class="card"><div class="img ${s.t}"><span class="tag">Available</span><button class="heart ${fav.has(s.c)?'on':''}" data-fav="${s.c}" aria-label="Save">${fav.has(s.c)?'♥':'♡'}</button></div><p class="sm mu mt2">${s.c}</p><h3>${s.n}</h3><p class="sm mu">${s.f} · ${s.w} × ${s.h} cm</p><a class="lnk sm mt2" href="#" data-slab="${s.c}">View material details →</a><button class="lnk sm sample-action" data-sample="${s.c}">Request sample →</button></div>`).join(''):'<p class="mu">No slabs found. Try another name or code.</p>';
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


document.addEventListener('click',e=>{
  if(e.target.closest('[data-upload]'))$('#file').click();
  if(e.target.closest('[data-compare-link]'))go('detail');
});

/* One reversible scroll controller for every routed page and dynamic grid.
   No layout changes; out-of-view content stays in the accessibility tree.
   Special infographics replay their own sequence on each re-entry. */
(()=>{
  if(!('IntersectionObserver' in window))return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const targets=new Set();
  const selector=[
    '.view > :not(.hero):not(.split):not(.g2):not(.g3):not(.g4):not(.ig-stages):not(#faqList)',
    '.view > .split > *',
    '.view > .g2 > *','.view > .g3 > *','.view > .g4 > *',
    '.view > .ig-stages > *','.view > #faqList > *'
  ].join(',');
  function state(el,visible){
    el.classList.toggle('sm-scroll-visible',visible);
    if(el.matches('.sm-atlas'))el.classList.toggle('sm-atlas-play',visible);
    if(el.matches('.sm-road'))el.classList.toggle('sm-road-play',visible);
  }
  const observer=new IntersectionObserver(entries=>{
    for(const {target,isIntersecting} of entries){
      state(target,motion.matches||isIntersecting||target.contains(document.activeElement));
    }
  },{rootMargin:'-56px 0px -20px 0px',threshold:0});
  function scan(){
    for(const el of targets)if(!el.isConnected){observer.unobserve(el);targets.delete(el)}
    document.querySelectorAll(selector).forEach(el=>{
      if(targets.has(el))return;
      targets.add(el);
      el.classList.add('sm-scroll-item');
      if(el.matches('.sm-atlas'))el.classList.add('sm-atlas-ready');
      if(el.matches('.sm-road'))el.classList.add('sm-road-ready');
      const r=el.getBoundingClientRect();
      state(el,motion.matches||(r.height>0&&r.bottom>56&&r.top<innerHeight-20));
      observer.observe(el);
    });
  }
  let pending=false;
  new MutationObserver(()=>{
    if(pending)return;
    pending=true;requestAnimationFrame(()=>{pending=false;scan()});
  }).observe($('main'),{childList:true,subtree:true});
  document.addEventListener('focusin',event=>{
    const el=event.target.closest('.sm-scroll-item');
    if(el){el.classList.add('sm-focus-reveal');state(el,true)}
  });
  document.addEventListener('focusout',event=>{
    const el=event.target.closest('.sm-scroll-item');
    if(el&&!el.contains(event.relatedTarget))el.classList.remove('sm-focus-reveal');
  });
  motion.addEventListener('change',()=>{
    for(const el of targets){
      const r=el.getBoundingClientRect();
      state(el,motion.matches||(r.height>0&&r.bottom>56&&r.top<innerHeight-20));
    }
  });
  scan();
})();

/* Direct contact keeps the selected material in the prepared message. */
function updateContactLinks(view){
  if(view!=='inquiry'&&view!=='samples')return;
  const sample=view==='samples';
  const selected=sample?[S.cur]:(S.sel.includes(S.cur)?S.sel:[S.cur]);
  const section=document.getElementById(view);
  const quantity=Number(section.querySelector('[data-contact-qty]').value)||1;
  const summary=section.querySelector('[data-contact-summary]');
  const selectionKey=selected.map(s=>s.c).join(',');
  if(summary.dataset.selection!==selectionKey){
    summary.dataset.selection=selectionKey;
    summary.innerHTML=selected.map(s=>`<div class="contact-request-material"><div class="thumb ${s.t}" role="img" aria-label="${s.n}"></div><div><h3>${s.n}</h3><p>${s.c} · ${s.f}</p><p>${s.w} × ${s.h} cm · 20 mm</p></div></div>`).join('');
  }
  const totalArea=selected.reduce((sum,s)=>sum+s.w*s.h*quantity/1e4,0).toFixed(2);
  section.querySelector('[data-contact-area]').textContent=totalArea+' m²';
  const descriptions=selected.map(s=>`${s.n} (${s.c}), ${s.w} × ${s.h} cm × 20 mm, ${s.f}, ${quantity} slab${quantity>1?'s':''}`);
  const message=`Hello SlabMatch, I would like to ${sample?'request a sample of':'inquire about'}:\n${descriptions.join('\n')}\nEstimated slab area: ${totalArea} m².\nPlease share ${sample?'sample and courier options':'pricing and availability'}.`;
  section.querySelector('[data-contact-wa]').href='https://wa.me/?text='+encodeURIComponent(message);
  section.querySelector('[data-contact-email]').href='mailto:hello@slabmatch.com?subject='+encodeURIComponent(sample?'Sample request':'Project inquiry')+'&body='+encodeURIComponent(message);
}
document.addEventListener('change',event=>{
  if(event.target.matches('[data-contact-qty]'))updateContactLinks(event.target.closest('.view').id);
});
document.addEventListener('click',event=>{
  const action=event.target.closest('[data-contact-wa],[data-contact-email]');
  if(!action)return;
  const consent=action.closest('.contact-request').querySelector('[data-contact-consent]');
  if(!consent.checked){event.preventDefault();consent.reportValidity();consent.focus()}
});
document.addEventListener('click',event=>{
  const sample=event.target.closest('[data-sample],[data-sample-current]');
  if(sample){
    const material=slabs.find(s=>s.c===sample.dataset.sample);
    if(material)S.cur=material;
    go('samples');
    updateContactLinks('samples');
  }

});

/* Hero autoplay: one timer, one visible image, one synchronized caption.
   Controls do not suspend autoplay; Pause is the explicit user override. */
(()=>{
  const carousel=document.querySelector('.hero-carousel');
  if(!carousel)return;
  const slides=[...carousel.querySelectorAll('.hero-slide')];
  if(!slides.length)return;
  const pause=carousel.querySelector('[data-hero-pause]');
  const count=carousel.querySelector('[data-hero-count]');
  const link=carousel.querySelector('[data-hero-link]');
  let current=0;
  let timer;
  let paused=false;
  let visible=true;
  function schedule(){
    clearTimeout(timer);
    const home=!location.hash||location.hash==='#home';
    if(!paused&&visible&&home&&!document.hidden&&slides.length>1){
      timer=setTimeout(()=>show(current+1),4000);
    }
  }
  function show(index){
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{
      slide.hidden=i!==current;
      slide.classList.toggle('is-active',i===current);
    });
    const active=slides[current];
    link.textContent=active.dataset.title+' →';
    link.href=active.dataset.href;
    count.textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
    count.setAttribute('aria-label',`Slide ${current+1} of ${slides.length}`);
    schedule();
  }
  carousel.querySelector('[data-hero-prev]').addEventListener('click',()=>show(current-1));
  carousel.querySelector('[data-hero-next]').addEventListener('click',()=>show(current+1));
  pause.addEventListener('click',()=>{
    paused=!paused;
    pause.textContent=paused?'Play':'Pause';
    pause.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');
    pause.setAttribute('aria-pressed',String(paused));
    schedule();
  });
  document.addEventListener('visibilitychange',schedule);
  addEventListener('hashchange',schedule);
  addEventListener('pageshow',schedule);
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{
      const nextVisible=entries[0].isIntersecting;
      if(visible!==nextVisible){visible=nextVisible;schedule()}
    }).observe(carousel);
  }
  show(0);
})();

/* Reference motion: scrubbed entrance, center hold, then native sticky exit. */
(()=>{
 const hero=document.querySelector('#home .hero'),stage=hero.querySelector('.hero-stage'),panel=hero.querySelector('.hero-copy');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let queued=false;
 function draw(){
  queued=false;
  const home=document.getElementById('home').classList.contains('on');
  if(!home)return;
  const h=stage.clientHeight,travel=Math.max(1,hero.offsetHeight-h),distance=Math.max(0,56-hero.getBoundingClientRect().top);
  const p=motion.matches?1:Math.min(1,distance/(travel*.68));
  const ease=1-Math.pow(1-p,1.5);
  stage.style.setProperty('--panel-y',((h+panel.offsetHeight)/2+24)*(1-ease)+'px');
  stage.style.setProperty('--hero-inset',(15-12*ease)+'%');
  stage.style.setProperty('--title-scale',1-.32*ease);
  stage.style.setProperty('--photo-scale',1.12-.12*ease);
  stage.style.setProperty('--mobile-title-opacity',1-Math.min(1,p*2));
 }
 function queue(){if(!queued){queued=true;requestAnimationFrame(draw)}}
 function reveal(){
  const y=scrollY+hero.getBoundingClientRect().top-56+(hero.offsetHeight-stage.clientHeight)*.68;
  scrollTo({top:y,behavior:motion.matches?'instant':'smooth'});
 }
 panel.addEventListener('focusin',()=>{if(panel.getBoundingClientRect().top>innerHeight-100)reveal()});
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);addEventListener('hashchange',queue);addEventListener('pageshow',queue);
 motion.addEventListener('change',queue);
 new ResizeObserver(queue).observe(panel);
 draw();
})();

/* Additive motion layer. Existing routes, graphics and scroll controllers stay intact.
   Text is animated as readable blocks; no splitting or rewriting of copy or controls. */
(()=>{
 if(!('IntersectionObserver' in window))return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const registered=new Set();
 const selectors='h1,h2,h3,h4,p,.img,label,button,a,ul,ol,table,.tag,.steps,.sm-area';
 const protectedGraphics='.sm-atlas,.sm-road,.sm-process,.hero-opening,.hero-navigation';
 let pending=false;
 function visible(el,r=el.getBoundingClientRect()){
  return r.width>0&&r.height>0&&r.bottom>58&&r.top<innerHeight-12;
 }
 function update(el,on,rect){
  const focused=el===document.activeElement||el.contains(document.activeElement);
  el.classList.toggle('sm-motion-in',motion.matches||on||focused);
  el.style.setProperty('--sm-motion-offset',rect.bottom<58?'-12px':'12px');
 }
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)update(entry.target,entry.isIntersecting,entry.boundingClientRect);
 },{rootMargin:'-58px 0px -12px 0px',threshold:0});
 function scan(){
  pending=false;
  for(const el of registered){
   if(!el.isConnected){observer.unobserve(el);registered.delete(el)}
  }
  const view=document.querySelector('.view.on');
  if(!view)return;
  let order=0;
  const elements=[...view.querySelectorAll(selectors),...document.querySelectorAll('footer > span,footer a')];
  for(const el of elements){
   if(el.closest(protectedGraphics)||el.closest('[hidden],.legacy-form'))continue;
   // A paragraph, list, or label reveals as a unit, including its inline children.
   if(el.parentElement.closest(selectors)&&el.parentElement.closest(selectors)!==view)continue;
   const rect=el.getBoundingClientRect();
   if(!rect.width||!rect.height)continue;
   if(!registered.has(el)){
    registered.add(el);
    el.classList.add('sm-motion-target');
    el.style.setProperty('--sm-motion-delay',Math.min(order%4,3)*35+'ms');
    observer.observe(el);
   }
   update(el,visible(el,rect),rect);
   order++;
  }
 }
 function queue(){if(!pending){pending=true;requestAnimationFrame(scan)}}
 new MutationObserver(queue).observe(document.querySelector('main'),{childList:true,subtree:true});
 addEventListener('hashchange',queue);
 addEventListener('pageshow',queue);
 document.addEventListener('click',queue);
 document.addEventListener('toggle',queue,true);
 motion.addEventListener('change',()=>{
  for(const el of registered){const r=el.getBoundingClientRect();update(el,visible(el,r),r)}
 });
 document.addEventListener('focusin',event=>{
  const el=event.target.closest('.sm-motion-target');
  if(el)el.classList.add('sm-motion-in');
 });
 document.addEventListener('focusout',event=>{
  const el=event.target.closest('.sm-motion-target');
  if(el)requestAnimationFrame(()=>{const r=el.getBoundingClientRect();update(el,visible(el,r),r)});
 });
 scan();
})();
