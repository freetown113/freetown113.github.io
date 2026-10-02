(() => {
  'use strict';
  const config=window.ADCS_SITE||{};
  function safeLink(value,protocols=['https:','http:']){
    try{const u=new URL(value);return protocols.includes(u.protocol)?u.href:'';}catch{return '';}
  }
  function mediaPath(value){
    if(typeof value!=='string'||!value.trim())return '';
    try{const u=new URL(value,document.baseURI);return ['https:','http:','file:'].includes(u.protocol)?value:'';}catch{return '';}
  }
  function bindLink(selector,value,protocols){const href=safeLink(value,protocols);if(href)document.querySelectorAll(selector).forEach(el=>{el.href=href;el.hidden=false;});}
  bindLink('[data-repo]',config.repositoryUrl);
  bindLink('[data-release]',config.snapshotUrl);
  bindLink('[data-contact]',config.contactUrl,['https:','http:','mailto:']);
  if(config.author)document.querySelectorAll('[data-author]').forEach(el=>{el.textContent=config.author;});
  document.querySelectorAll('[data-code]').forEach(el=>{
    const href=safeLink((config.codeLinks||{})[el.dataset.code]);
    if(href){const a=document.createElement('a');a.href=href;a.textContent=el.textContent.replace(/link pending\s*$/,'').trim()+' ↗';el.replaceChildren(a);}
    else if(config.showPendingCodeLinks===false)el.hidden=true;
  });
  const demo1=document.querySelector('[data-video1]');
  if(demo1&&mediaPath(config.demoVideo1)){
    demo1.src=mediaPath(config.demoVideo1);
    if(mediaPath(config.demoPoster1))demo1.poster=mediaPath(config.demoPoster1);
    document.querySelector('[data-demo-caption1]').textContent=config.demoCaption1||'';
    document.querySelector('[data-demo1]').hidden=false;
    const empty=document.querySelector('[data-demo-empty1]');if(empty)empty.hidden=true;
  }
  const demo2=document.querySelector('[data-video2]');
  if(demo2&&mediaPath(config.demoVideo2)){
    demo2.src=mediaPath(config.demoVideo2);
    if(mediaPath(config.demoPoster2))demo2.poster=mediaPath(config.demoPoster2);
    document.querySelector('[data-demo-caption2]').textContent=config.demoCaption2||'';
    document.querySelector('[data-demo2]').hidden=false;
    const empty=document.querySelector('[data-demo-empty2]');if(empty)empty.hidden=true;
  }
  const gallery=document.querySelector('[data-training-gallery]');
  if(gallery){
    const clips=(Array.isArray(config.trainingClips)?config.trainingClips:[]).filter(c=>c&&mediaPath(c.src)).slice(0,3);
    if(clips.length){
      gallery.hidden=false;document.querySelector('[data-clips-empty]').hidden=true;
      const player=gallery.querySelector('[data-training-video]'),choices=gallery.querySelector('[data-clip-choices]');
      const caption=gallery.querySelector('[data-clip-caption]'),conditions=gallery.querySelector('[data-clip-conditions]');
      const buttons=[];
      function select(i){
        const clip=clips[i];player.pause();player.src=mediaPath(clip.src);
        if(mediaPath(clip.poster))player.poster=mediaPath(clip.poster);else player.removeAttribute('poster');
        player.load();buttons.forEach((b,k)=>b.setAttribute('aria-pressed',String(i===k)));
        caption.textContent=[clip.label||`Checkpoint ${i+1}`,clip.checkpoint].filter(Boolean).join(' · ');
        conditions.textContent=clip.conditions||'Evaluation conditions have not been specified.';
      }
      clips.forEach((clip,i)=>{
        const button=document.createElement('button');button.type='button';button.className='clip-choice';button.setAttribute('aria-pressed','false');
        if(mediaPath(clip.poster)){const image=document.createElement('img');image.src=mediaPath(clip.poster);image.alt='';image.loading='lazy';button.append(image);}
        const text=document.createElement('span');text.textContent=clip.label||`Checkpoint ${i+1}`;button.append(text);
        if(clip.checkpoint){const small=document.createElement('small');small.textContent=clip.checkpoint;button.append(small);}
        button.addEventListener('click',()=>select(i));buttons.push(button);choices.append(button);
      });
      select(0);
    }
  }
  const figure=document.querySelector('[data-result-figure]'),data=config.resultFigure||{};
  if(figure&&mediaPath(data.src)){
    const image=figure.querySelector('[data-result-image]');image.src=mediaPath(data.src);image.alt=data.alt||'Experiment comparison figure';
    figure.querySelector('[data-result-caption]').textContent=data.caption||'';figure.hidden=false;document.querySelector('[data-plot-empty]').hidden=true;
  }
  // Only one experiment video plays at a time, even across the two sections.
  document.addEventListener('play',event=>{
    if(event.target.tagName==='VIDEO')document.querySelectorAll('video').forEach(video=>{if(video!==event.target)video.pause();});
  },true);
})();
