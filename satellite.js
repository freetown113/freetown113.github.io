/* Original schematic, not the ADCS simulator. Unitless, schematic one-axis momentum
   exchange embedded in a 3D cutaway. m x B is assumed along that axis.
   Inspection adds finite stop thresholds for a readable, completely still view.
   No trained policy, orbit propagation, physical calibration, or telemetry. */
(() => {
  'use strict';
  const host=document.querySelector('[data-wheel-diagram]');
  if(!host)return;
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 640 500');
  svg.setAttribute('role','img');
  svg.setAttribute('aria-labelledby','satellite-title satellite-desc');
  svg.innerHTML='<title id="satellite-title">Satellite cutaway and momentum exchange</title><desc id="satellite-desc">Four spinning reaction wheels are visible inside a wireframe satellite with solar panels. Hover or use Inspect sensors to stop the schematic and reveal all six sensor types. Motion and geometry are schematic, not project telemetry.</desc><defs><pattern id="sat-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#6b755e" stroke-opacity=".11" stroke-width=".6"/></pattern></defs><rect x="8" y="10" width="624" height="476" fill="url(#sat-grid)"/><g id="field" fill="none"/><g id="mechanism" fill="none" stroke-linejoin="round"/><g id="labels" font-family="monospace" font-size="9"/><text x="22" y="479" font-family="monospace" font-size="9" fill="#8c9586">CUTAWAY / NOT TO SCALE</text>';
  host.replaceChildren(svg);
  const layer=svg.querySelector('#mechanism'),field=svg.querySelector('#field'),labels=svg.querySelector('#labels');
  const motion=document.querySelector('[data-motion]'),unloadButton=document.querySelector('[data-unload]');
  const status=document.querySelector('[data-drawing-status]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches,inView=true,hovered=false,latched=false,frame=0,last=null;
  let angle=-.16,speed=2.8,spin=0,omega=-.025,clock=0,fieldOpacity=0;
  let phase='moving',reveal=0;
  // I_body = 1 and effective projected wheel inertia = .016, in arbitrary
  // illustration units. H_body_dot = -H_wheels_dot + tau_external.
  const wheelInertia=.016;
  const nrm=v=>{const length=Math.hypot(...v);return v.map(x=>x/length)};
  const normals=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(nrm);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const add=(a,b)=>a.map((x,i)=>x+b[i]),mul=(a,s)=>a.map(x=>x*s);
  const active=()=>hovered||latched;
  function step(dt){
    clock+=dt;
    if(active()){
      if(phase==='braking'){
        speed*=Math.exp(-dt*3.3);omega*=Math.exp(-dt*4.2);
        if(speed<.012&&Math.abs(omega)<.0004){speed=0;omega=0;phase='inspecting';describe();}
      }
      // Callouts only begin AFTER both rotor and body motion have stopped.
      if(phase==='inspecting')reveal=Math.min(1,reveal+dt*1.25);
    } else {
      const target=3.3+.55*Math.sin(clock*.4);
      const dv=(target-speed)*(1-Math.exp(-dt/2.4));
      speed+=dv;omega-=wheelInertia*dv;
    }
    angle+=omega*dt;spin+=speed*dt;
    fieldOpacity+=(Number(active())-fieldOpacity)*(1-Math.exp(-dt*4));
  }
  function requestInspection(){
    if(active()){
      if(paused){speed=0;omega=0;phase='inspecting';reveal=1;}
      else if(phase!=='inspecting')phase='braking';
    }else{phase='moving';reveal=0;}
    sync();
  }
  function draw(){
    const project=p=>{
      const x=p[0]*Math.cos(angle)-p[1]*Math.sin(angle),y=p[0]*Math.sin(angle)+p[1]*Math.cos(angle);
      const u=x*Math.cos(.48)+p[2]*Math.sin(.48),z=-x*Math.sin(.48)+p[2]*Math.cos(.48);
      return [320+.86*u,244-.86*(y*Math.cos(-.36)-z*Math.sin(-.36)),y*Math.sin(-.36)+z*Math.cos(-.36)];
    };
    const pt=p=>project(p).slice(0,2).map(v=>v.toFixed(2)).join(',');
    const path=(p,close=false)=>'M'+p.map(pt).join('L')+(close?'Z':'');
    const line=(a,b,c='#777c65',w=.8,d='')=>`<path d="${path([a,b])}" stroke="${c}" stroke-width="${w}" ${d?`stroke-dasharray="${d}"`:''}/>`;
    let shapes=[];
    // Solar wings and cells share the same body transform as the wheels.
    for(const sign of [-1,1]){
      const x1=sign*126,x2=sign*256;
      shapes.push(line([sign*98,0,0],[x1,0,0],'#969b81',2));
      shapes.push(`<path d="${path([[x1,-60,0],[x2,-60,0],[x2,60,0],[x1,60,0]],true)}" fill="#141917" stroke="#73877f" stroke-width="1"/>`);
      for(let i=1;i<5;i++)shapes.push(line([x1+(x2-x1)*i/5,-60,0],[x1+(x2-x1)*i/5,60,0],'#3d4b43',.7));
      for(let y=-40;y<60;y+=20)shapes.push(line([x1,y,0],[x2,y,0],'#3d4b43',.7));
    }
    // Transparent body enclosure: rear and front edges, with no opaque skin.
    const corners=[];for(const x of [-96,96])for(const y of [-83,83])for(const z of [-66,66])corners.push([x,y,z]);
    for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if(corners[i].filter((v,k)=>v!==corners[j][k]).length===1)shapes.push(line(corners[i],corners[j],'#626c56',.9));
    // Three schematic torque rods along body axes, highlighted on unloading.
    const rodColor=active()?'#a9c8d1':'#627c83';
    const rods=[[[ -77,-66,-51],[77,-66,-51]],[[77,-66,-51],[77,66,-51]],[[77,-66,-51],[77,-66,51]]];
    rods.forEach(([a,b])=>shapes.push(line(a,b,rodColor,3)));
    const wheels=normals.map((n,i)=>({n,i,center:mul(n,57)})).sort((a,b)=>project(a.center)[2]-project(b.center)[2]);
    for(const {n,i,center} of wheels){
      const u=nrm(cross(n,[0,1,0])),v=cross(n,u);
      const disk=(offset,r)=>Array.from({length:41},(_,k)=>add(add(center,mul(n,offset)),add(mul(u,r*Math.cos(k/40*2*Math.PI)),mul(v,r*Math.sin(k/40*2*Math.PI)))));
      const back=disk(-5,25),front=disk(5,25);
      shapes.push(line([0,0,0],center,'#918559',1.4));
      shapes.push(`<path d="${path(back,true)}" fill="#101110" stroke="#807245"/>`);
      for(let k=0;k<40;k+=10)shapes.push(line(back[k],front[k],'#807245',.8));
      shapes.push(`<path d="${path(front,true)}" fill="#121310" stroke="#e9c85b" stroke-width="1.3"/><path d="${path(disk(5,20),true)}" stroke="#84784b" stroke-width=".7"/><path d="${path(disk(5,5),true)}" stroke="#d3b95b" stroke-width=".8"/>`);
      for(let k=0;k<3;k++){
        const a=spin*Math.sign(n[2])+k*2*Math.PI/3,ray=add(mul(u,Math.cos(a)),mul(v,Math.sin(a)));
        shapes.push(line(add(add(center,mul(n,5)),mul(ray,7)),add(add(center,mul(n,5)),mul(ray,18)),'#e9c85b',.85));
      }
    }
    // Star-tracker aperture on the top face, schematic sensor placement.
    const aperture=Array.from({length:33},(_,k)=>[16*Math.cos(k*Math.PI/16),94,20+16*Math.sin(k*Math.PI/16)]);
    shapes.push(`<path d="${path(aperture,true)}" fill="#111714" stroke="#a6b5a2" stroke-width="1.1"/>`);
    shapes.push(line([0,94,20],[0,112,20],'#a6b5a2',.8));
    // Schematic sensor packages; placement is illustrative rather than CAD.
    const sensorBox=(center,size,color)=>{
      const [x,y,z]=center;
      return `<path d="${path([[x-size,y-size,z],[x+size,y-size,z],[x+size,y+size,z],[x-size,y+size,z]],true)}" fill="#141c18" stroke="${color}" stroke-width="1.2"/>`;
    };
    shapes.push(sensorBox([-48,-30,45],11,'#9cbaad')); // gyro
    shapes.push(sensorBox([-52,80,38],10,'#9cbaad'));  // Sun sensor
    shapes.push(sensorBox([61,83,-23],12,'#9cbaad'));  // GNSS antenna
    shapes.push(sensorBox([89,19,-29],7,'#9cbaad'));   // magnetometer
    shapes.push(line([-34,-34,34],[-25,-29,37],'#9cbaad',2)); // tachometer cue
    layer.innerHTML=shapes.join('');
    function label(text,target,x,y){
      const p=project(target),left=x<320,end=left?x+text.length*5.4+8:x-8,knee=left?end+10:end-10;
      return `<path d="M${p[0].toFixed(1)},${p[1].toFixed(1)}L${knee},${y-4}H${end}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1-reveal}" fill="none" stroke="#d5c477" stroke-opacity=".36" stroke-width="3" stroke-linecap="round"/><g opacity="${reveal}"><circle cx="${p[0]}" cy="${p[1]}" r="2.8" fill="#e9c85b"/><rect x="${x-4}" y="${y-12}" width="${text.length*5.4+8}" height="17" fill="#101110" fill-opacity=".92"/><text x="${x}" y="${y}" fill="#ddd9bb">${text}</text></g>`;
    }
    labels.innerHTML=phase==='inspecting'?label('SUN SENSOR',[-52,80,38],20,62)+label('STAR TRACKER',[0,94,20],447,62)+label('GYROSCOPE',[-48,-30,45],20,405)+label('MAGNETOMETER',[89,19,-29],446,405)+label('WHEEL TACHOMETERS ×4',[-34,-34,34],20,456)+label('GNSS ANTENNA',[61,83,-23],446,456):'';
    const opacity=paused?Number(active()):fieldOpacity;
    const fieldLines=[155,320,485].map(x=>`<path d="M${x},55V442m-5,-8l5,8l5,-8" stroke="#809ca5" stroke-width="1" stroke-dasharray="5 9"/>`).join('');
    field.innerHTML=`<g opacity="${opacity.toFixed(3)}">${fieldLines}<text x="28" y="43" fill="#a7c4cd" font-family="monospace" font-size="10">B / EXTERNAL FIELD</text><text x="416" y="479" fill="#a7c4cd" font-family="monospace" font-size="10">τ = m × B</text></g>`;
  }
  function describe(){
    motion.hidden=false;motion.textContent=paused?'Play motion ▷':'Pause motion Ⅱ';motion.setAttribute('aria-pressed',String(paused));
    unloadButton.setAttribute('aria-pressed',String(latched));
    document.querySelector('[data-drawing-controls]').hidden=false;status.hidden=false;
    const message=phase==='inspecting'?'Inspection · six sensor types; component placement is schematic.':active()?'Settling · callouts appear after the wheels and body stop.':'Hover to stop and inspect the onboard sensors.';
    if(status.textContent!==message)status.textContent=message;
  }
  function tick(now){
    if(last===null)last=now;
    const elapsed=now-last;
    if(elapsed>=40){const dt=Math.min(elapsed/1000,.08);step(dt);draw();last=now;}
    frame=requestAnimationFrame(tick);
  }
  function sync(){cancelAnimationFrame(frame);frame=0;last=null;describe();draw();if(!paused&&inView&&!document.hidden)frame=requestAnimationFrame(tick);}
  host.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;requestInspection();}});
  host.addEventListener('pointerleave',()=>{hovered=false;requestInspection();});
  unloadButton.addEventListener('click',()=>{latched=!latched;requestInspection();});
  motion.addEventListener('click',()=>{paused=!paused;requestInspection();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;requestInspection();});
  document.addEventListener('visibilitychange',sync);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();}).observe(host);
  sync();
})();
