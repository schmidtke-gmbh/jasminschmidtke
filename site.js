// ═══ Dr. André Alesi · Shared JS ═══
(function(){
  const nav=document.getElementById('nav');
  const progress=document.getElementById('progress');
  function onScroll(){
    const y=window.scrollY;
    if(nav)nav.classList.toggle('scrolled', y>40);
    if(progress){
      const max=document.documentElement.scrollHeight-window.innerHeight;
      progress.style.width=(max>0?Math.min(100,y/max*100):0)+'%';
    }
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // Mobile-Menü
  const burger=document.getElementById('burger');
  if(burger&&nav){
    burger.addEventListener('click',()=>nav.classList.toggle('open'));
    document.querySelectorAll('.nav-panel a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  }

  // Scroll-Reveal
  const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));

  // Riesenwort: Verlauf folgt dem Cursor
  const mega=document.getElementById('mega');
  if(mega){
    const grad=document.getElementById('megaMaskGrad');
    const svg=mega.querySelector('svg');
    let tx=600,ty=105,cx=600,cy=105,raf=null;
    function step(){
      cx+=(tx-cx)*.14; cy+=(ty-cy)*.14;
      grad.setAttribute('cx',cx.toFixed(1)); grad.setAttribute('cy',cy.toFixed(1));
      if(Math.abs(tx-cx)>.5||Math.abs(ty-cy)>.5){raf=requestAnimationFrame(step)}else{raf=null}
    }
    mega.addEventListener('mousemove',e=>{
      const r=svg.getBoundingClientRect();
      tx=(e.clientX-r.left)/r.width*1200;
      ty=(e.clientY-r.top)/r.height*210;
      if(!raf)raf=requestAnimationFrame(step);
    });
  }
})();
