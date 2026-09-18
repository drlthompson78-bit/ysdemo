(() => {
 const route=document.querySelector('.complaint-route'); if(!route) return;
 const canvas=route.querySelector('.route-canvas'), svg=route.querySelector('.route-connector'), path=svg.querySelector('path'), circles=[...route.querySelectorAll('.route-portrait')];
 let frame;
 function draw(){
  const box=canvas.getBoundingClientRect(), mobile=matchMedia('(max-width:700px)').matches;
  svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
  const points=circles.map(el=>{const r=el.getBoundingClientRect();return{x:r.left-box.left+r.width/2,y:r.top-box.top+r.height/2,r:r.width/2};});
  let d='';for(let i=0;i<points.length-1;i++){
   const a=points[i],b=points[i+1];
   if(mobile){const y1=a.y+a.r,y2=b.y-b.r,m=(y1+y2)/2;d+=`M ${a.x} ${y1} C ${a.x-40} ${m}, ${b.x+35} ${m}, ${b.x} ${y2} `;}
   else{const x1=a.x+a.r,x2=b.x-b.r,m=(x1+x2)/2;d+=`M ${x1} ${a.y} C ${m} ${a.y}, ${m} ${b.y}, ${x2} ${b.y} `;}
  }path.setAttribute('d',d);
 }
 const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);};
 new ResizeObserver(schedule).observe(canvas);circles.forEach(el=>new ResizeObserver(schedule).observe(el));
 new IntersectionObserver(([entry])=>route.classList.toggle('is-visible',entry.isIntersecting)).observe(route);
 document.addEventListener('visibilitychange',()=>{path.style.animationPlayState=document.hidden?'paused':'';});
 document.fonts?.ready.then(schedule);schedule();
})();
