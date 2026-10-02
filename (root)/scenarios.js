/* Reference-behavior sketches only. No policy inference or orbital simulation. */
(() => {
  'use strict';
  const yellow='#e9c85b',muted='#8c9586',blue='#809ca5';
  const xy=(x,y)=>`${x.toFixed(2)},${y.toFixed(2)}`;
  const smooth=x=>x*x*(3-2*x);
  const line=(a,b,color=yellow,dash='')=>`<path d="M${xy(...a)}L${xy(...b)}" stroke="${color}" stroke-width="1.3" ${dash?`stroke-dasharray="${dash}"`:''} fill="none"/>`;
  const label=(x,y,s,color=muted)=>`<text x="${x}" y="${y}" fill="${color}" font-size="10" font-family="monospace">${s}</text>`;
  function craft(x,y,angle){return `<g transform="translate(${x.toFixed(3)} ${y.toFixed(3)}) rotate(${(angle*180/Math.PI).toFixed(3)})"><path d="M-9 -10H9V10H-9Z" fill="#171a14" stroke="${yellow}"/><path d="M-7 -15V-35H7V-15ZM-7 15V35H7V15Z" fill="#15201b" stroke="#687f75"/><path d="M-7 -25H7M-7 25H7M0 -10V-15M0 10V15" stroke="#687f75"/><path d="M9 0H38m-6 -4l6 4l-6 4" fill="none" stroke="${yellow}" stroke-width="1.4"/><circle r="3" fill="none" stroke="${yellow}"/></g>`;}
  const earth=()=>`<circle cx="250" cy="214" r="77" fill="#14201c" stroke="#667c72"/><ellipse cx="250" cy="214" rx="29" ry="77" fill="none" stroke="#354a40"/><path d="M175 197Q250 172 325 197M175 231Q250 256 325 231" fill="none" stroke="#354a40"/>${label(228,219,'EARTH')}`;
  function draw(kind,t){
    let art='',state='';
    if(kind==='sun_pointing'){
      const angle=.72*(1-smooth(Math.min((t%12)/5,1))),x=182,y=211;
      art=`<circle cx="450" cy="211" r="32" fill="#201e11" stroke="${yellow}"/>`;
      for(let i=0;i<12;i++){const a=i*Math.PI/6;art+=line([450+39*Math.cos(a),211+39*Math.sin(a)],[450+47*Math.cos(a),211+47*Math.sin(a)],'#8c7a43');}
      art+=line([215,211],[410,211],blue,'4 6')+craft(x,y,angle)+label(405,286,'SUN DIRECTION',yellow)+label(46,88,'INERTIAL REFERENCE');
      state=angle>.01?'Acquire the Sun direction':'Hold the Sun direction';
    }else if(kind==='ground_target'){
      // One visible pass segment. Fade at loop boundaries instead of tracing
      // a target line through Earth; no horizon or orbit propagator is implied.
      const u=(t%16)/16,theta=-.85+1.7*u,x=250+151*Math.cos(theta),y=214+151*Math.sin(theta);
      const target=[327,214],opacity=Math.min(1,u*14,(1-u)*14);
      art=earth()+`<path d="M349.66 100.56A151 151 0 0 1 349.66 327.44" fill="none" stroke="#4c5f53" stroke-dasharray="3 7"/>`;
      art+=`<circle cx="327" cy="214" r="4" fill="${yellow}"/><g opacity="${opacity.toFixed(3)}">${line([x,y],target,blue,'5 5')}${craft(x,y,Math.atan2(target[1]-y,target[0]-x))}</g>`;
      art+=label(336,367,'GROUND TARGET',yellow)+label(39,62,'VISIBLE PASS SEGMENT');state='Track a fixed surface point';
    }else if(kind==='scheduled_slew'){
      const targets=[-.9,.1,1.15],u=t%21,index=Math.floor(u/7),local=u%7,from=targets[index],to=targets[(index+1)%3];
      const angle=local<3?from:from+(to-from)*smooth((local-3)/4),center=[285,211];
      targets.forEach((a,i)=>{const x=center[0]+132*Math.cos(a),y=center[1]+132*Math.sin(a);art+=line(center,[x,y],'#455341','4 7')+`<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="${i===index?yellow:muted}"/>`+label(x+12,y+4,['A','B','C'][i]);});
      art+=craft(...center,angle)+label(37,63,'ILLUSTRATIVE A → B → C SCHEDULE');state=local<3?`Dwell at ${['A','B','C'][index]}`:`Slew to ${['A','B','C'][(index+1)%3]}`;
    }else{
      const theta=-.8+t*.13,x=250+151*Math.cos(theta),y=214+151*Math.sin(theta);
      const inward=theta+Math.PI,tangent=theta+Math.PI/2;
      art=`<circle cx="250" cy="214" r="151" fill="none" stroke="#485b4e" stroke-dasharray="3 7"/>`+earth()+line([x,y],[250,214],blue,'5 6')+craft(x,y,inward);
      const end=[x+51*Math.cos(tangent),y+51*Math.sin(tangent)];
      art+=line([x,y],end,'#a1b5a1')+label(28,40,'NADIR + ALONG-TRACK REFERENCE')+label(407,364,'LOCAL FRAME',blue);state='Rotate with the local orbital frame';
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 410" role="img" aria-label="${kind.replaceAll('_',' ')} reference illustration"><rect width="560" height="410" fill="#101110"/><path d="M20 20H40M20 20V40M540 20H520M540 20V40M20 390H40M20 390V370M540 390H520M540 390V370" stroke="#3e493b" fill="none"/>${art}${label(28,391,state,yellow)}</svg>`;
  }
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-scenario]').forEach(block=>{
    const host=block.querySelector('[data-scene]'),button=block.querySelector('[data-scene-motion]'),kind=block.dataset.scenario;
    let paused=reduced.matches,visible=false,t=kind==='ground_target'?5:0,frame=0,last=null;
    const paint=()=>{host.innerHTML=draw(kind,t)};
    const update=()=>{button.hidden=false;button.textContent=paused?'Play sketch ▷':'Pause sketch Ⅱ';button.setAttribute('aria-pressed',String(paused));};
    const tick=now=>{if(last===null)last=now;if(now-last>=50){t+=Math.min((now-last)/1000,.1);last=now;paint();}frame=requestAnimationFrame(tick);};
    const sync=()=>{cancelAnimationFrame(frame);last=null;update();if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);};
    button.addEventListener('click',()=>{paused=!paused;sync();});
    reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});
    document.addEventListener('visibilitychange',sync);
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(block);else visible=true;
    paint();sync();
  });
})();
