/* ── Cursor ── */
const dot  = document.querySelector('.cur-dot');
const ring = document.querySelector('.cur-ring');
if (dot && ring && matchMedia('(pointer:fine)').matches) {
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  (function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
  document.querySelectorAll('a,button,[data-hover]').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cur-grow'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cur-grow'));
  });
}

/* ── Sticky Nav ── */
const nav = document.querySelector('.nav');
if (nav) window.addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>30),{passive:true});

/* ── Hamburger ── */
const burger  = document.querySelector('.burger');
const mobMenu = document.querySelector('.mob-menu');
if (burger && mobMenu) {
  burger.addEventListener('click',()=>{
    const open = burger.classList.toggle('open');
    mobMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    burger.classList.remove('open'); mobMenu.classList.remove('open');
    document.body.style.overflow='';
  }));
}

/* ── Active Nav Link ── */
const page = location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-links a').forEach(a=>{
  if (a.getAttribute('href')===page) a.classList.add('on');
});

/* ── Scroll Reveal ── */
const rvObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); rvObs.unobserve(e.target); } });
},{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>rvObs.observe(el));

/* ── Counter ── */
function runCounter(el) {
  const target=+el.dataset.target, suf=el.dataset.suf||'', dur=1800, step=16;
  const inc=target/(dur/step); let cur=0;
  const t=setInterval(()=>{ cur+=inc; if(cur>=target){cur=target;clearInterval(t);} el.textContent=Math.floor(cur)+suf; },step);
}
const ctrObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){runCounter(e.target);ctrObs.unobserve(e.target);} });
},{threshold:.5});
document.querySelectorAll('[data-counter]').forEach(el=>ctrObs.observe(el));

/* ── Testimonial Slider ── */
const slider = document.querySelector('.t-slider');
if (slider) {
  let cur=0;
  const slides=slider.querySelectorAll('.t-slide');
  const dots  =document.querySelectorAll('.t-dot');
  const go=idx=>{
    slides[cur].classList.remove('active'); dots[cur]?.classList.remove('active');
    cur=(idx+slides.length)%slides.length;
    slides[cur].classList.add('active'); dots[cur]?.classList.add('active');
  };
  slides[0]?.classList.add('active'); dots[0]?.classList.add('active');
  document.querySelector('.t-prev')?.addEventListener('click',()=>go(cur-1));
  document.querySelector('.t-next')?.addEventListener('click',()=>go(cur+1));
  dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
  setInterval(()=>go(cur+1),5500);
}

/* ── Portfolio Filter ── */
document.querySelectorAll('.f-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.f-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat=btn.dataset.f;
    document.querySelectorAll('.p-card').forEach(c=>{
      const show=cat==='all'||c.dataset.cat===cat;
      c.style.transition='opacity .35s, transform .35s';
      c.style.opacity='0'; c.style.transform='translateY(12px)';
      setTimeout(()=>{
        c.style.display=show?'':'none';
        if(show) setTimeout(()=>{c.style.opacity='1';c.style.transform='';},30);
      },300);
    });
  });
});

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement, open=item.classList.contains('faq-open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('faq-open'));
    if(!open) item.classList.add('faq-open');
  });
});

/* ── Parallax Hero ── */
const heroBg = document.querySelector('.hero-par');
if (heroBg && innerWidth>768) {
  window.addEventListener('scroll',()=>{ heroBg.style.transform=`scale(1.1) translateY(${scrollY*.22}px)`; },{passive:true});
}

/* ── Form → WhatsApp ── */
const form = document.getElementById('cform');
if (form) {
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name = form.querySelector('[name=name]').value.trim();
    const phone= form.querySelector('[name=phone]').value.trim();
    const type = form.querySelector('[name=type]').value;
    const msg  = form.querySelector('[name=msg]')?.value.trim();
    if (!name||!phone||!type){ showMsg('Please fill all required fields.','err'); return; }
    if (!/^[6-9]\d{9}$/.test(phone)){ showMsg('Enter a valid 10-digit Indian number.','err'); return; }
    const txt=encodeURIComponent(`Hi Unique Space! 🏡\n\nName: ${name}\nPhone: ${phone}\nProject: ${type}${msg?'\nMessage: '+msg:''}\n\nI'd like to book a Discovery Call.`);
    window.open(`https://wa.me/919876543210?text=${txt}`,'_blank');
    showMsg('Opening WhatsApp…','ok'); form.reset();
  });
  function showMsg(t,cls){
    let m=form.querySelector('.fmsg');
    if(!m){m=document.createElement('p');m.className='fmsg';form.appendChild(m);}
    m.textContent=t; m.className='fmsg '+cls;
    setTimeout(()=>m.textContent='',4000);
  }
}
