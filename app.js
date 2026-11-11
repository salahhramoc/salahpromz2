(function(){
var R=window.R||[];
function $(s,e){return (e||document).querySelector(s)}
function $$(s,e){return [].slice.call((e||document).querySelectorAll(s))}
function num(n){n=Math.round(n*10)/10;return String(n).replace('.',',')}
function link(r){return '<a class="card" href="'+ROOT+r.s+'.html"><span class="tag">'+r.c+'</span><b>'+r.n+'</b><span class="meta">'+r.t+' min · ca '+r.k+' kr/port.</span></a>'}
var ROOT=document.body.getAttribute('data-root')||'';
var page=document.body.getAttribute('data-page');
function chips(box,onchange){var st={};$$('.chip',box).forEach(function(b){b.onclick=function(){var k=b.dataset.f;st[k]=!st[k];b.setAttribute('aria-pressed',st[k]);onchange(st)}});return st}
function merge(list,mult){
 var m={};list.forEach(function(r){var f=mult/r.p;r.i.forEach(function(x){var k=x[1]+'|'+x[2];m[k]=m[k]||{a:0,u:x[1],n:x[2]};m[k].a+=x[0]*f})});
 return Object.keys(m).sort(function(a,b){return m[a].n.localeCompare(m[b].n,'sv')}).map(function(k){return m[k]})}
function fmtI(x){return num(x.a)+' '+x.u+' '+x.n}

if(page==='recipe'){
 var inp=$('#serv'),base=+inp.dataset.base;
 inp.oninput=function(){var v=+inp.value;if(!(v>0))return;$$('.q').forEach(function(s){s.textContent=num(s.dataset.a*v/base)+' '+s.dataset.u})}
}

if(page==='home'||page==='cat'){
 var sq=$('#sq');if(sq)sq.oninput=function(){var t=sq.value.toLowerCase();$$('#all .card').forEach(function(c){c.hidden=c.textContent.toLowerCase().indexOf(t)<0})}
}

if(page==='pantry'){
 var names={};R.forEach(function(r){r.i.forEach(function(x){names[x[2]]=1})});
 var all=Object.keys(names).sort(function(a,b){return a.localeCompare(b,'sv')}),sel={};
 $('#pantry').innerHTML=all.map(function(n){return '<button class="chip" data-n="'+n+'" aria-pressed="false">'+n+'</button>'}).join('');
 var F={};
 function draw(){
  var keys=Object.keys(sel).filter(function(k){return sel[k]});
  var out=R.filter(function(r){return !(F.snabb&&r.t>30)&&!(F.veg&&!r.v)&&!(F.mat&&!r.m)}).map(function(r){
   var have=r.i.filter(function(x){return sel[x[2]]}).length;
   return {r:r,have:have,miss:r.i.filter(function(x){return !sel[x[2]]}).map(function(x){return x[2]})}
  }).filter(function(o){return o.have>0}).sort(function(a,b){return a.miss.length-b.miss.length||b.have-a.have});
  $('#pres').innerHTML=!keys.length?'<p class="meta">Välj det du har hemma ovan.</p>':!out.length?'<p>Inga recept matchar. Ta bort ett filter.</p>':
   out.map(function(o){return '<a class="card" href="'+o.r.s+'.html"><b>'+o.r.n+'</b><span class="'+(o.miss.length?'':'ok')+'">'+(o.miss.length?'Du har '+o.have+' av '+o.r.i.length+'. Saknas: '+o.miss.join(', '):'Du har allt som behövs')+'</span><br><span class="meta">'+o.r.t+' min · ca '+o.r.k+' kr/port.</span></a>'}).join('')}
 $$('#pantry .chip').forEach(function(b){b.onclick=function(){sel[b.dataset.n]=!sel[b.dataset.n];b.setAttribute('aria-pressed',!!sel[b.dataset.n]);draw()}});
 F=chips($('#pf'),function(s){F=s;draw()});draw();
}

if(page==='week'){
 var wk=[],F2={},DAYS=['Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag','Söndag'];
 F2=chips($('#wf'),function(s){F2=s});
 function pool(){return R.filter(function(r){return r.c!=='Fika'&&r.c!=='Frukost'&&r.c!=='Säsong'||(r.c==='Säsong'&&r.d)}).filter(function(r){return r.d&&!(F2.snabb&&r.t>30)&&!(F2.billig&&r.k>20)&&!(F2.veg&&!r.v)&&!(F2.mat&&!r.m)})}
 function pick(ex){var p=pool().filter(function(r){return ex.indexOf(r)<0});return p.length?p[Math.floor(Math.random()*p.length)]:null}
 function draw(){
  var P=+$('#ppl').value;
  $('#wk').innerHTML=wk.map(function(r,i){return '<li><b>'+DAYS[i]+':</b> <a href="'+r.s+'.html">'+r.n+'</a> <span class="meta">'+r.t+' min</span> <button class="chip noprint" data-i="'+i+'">Byt</button></li>'}).join('');
  var tot=wk.reduce(function(s,r){return s+r.k*P},0);
  $('#cost').textContent=wk.length?'Ungefärlig kostnad: '+Math.round(tot)+' kr för '+P+' pers.':'';
  $('#shop').innerHTML=merge(wk,P).map(function(x){return '<li><label><input type="checkbox"> '+fmtI(x)+'</label></li>'}).join('');
  $('#tools').hidden=!wk.length}
 $('#gen').onclick=function(){wk=[];for(var i=0;i<7;i++){var r=pick(wk)||pick([]);if(r)wk.push(r)}if(!wk.length)$('#wk').innerHTML='<li>Inga recept matchar. Ta bort ett filter.</li>';draw()};
 $('#wk').onclick=function(e){var i=e.target.dataset&&e.target.dataset.i;if(i==null)return;var r=pick(wk);if(r){wk[+i]=r;draw()}};
 $('#ppl').onchange=draw;
 $('#copy').onclick=function(){var t=merge(wk,+$('#ppl').value).map(fmtI).join('\n');if(navigator.clipboard)navigator.clipboard.writeText(t);this.textContent='Kopierad'};
 $('#print').onclick=function(){window.print()};
}

if(page==='lunch'){
 var L=R.filter(function(r){return r.m});
 $('#rec').innerHTML=L.map(function(r){return '<option value="'+r.s+'">'+r.n+'</option>'}).join('');
 function d(){
  var r=L.filter(function(x){return x.s===$('#rec').value})[0],n=+$('#n').value;if(!r||!(n>0))return;
  var fr=Math.max(0,n-r.y),ki=n-fr;
  $('#out').innerHTML='<p class="big">Laga '+n+' portioner</p><p class="meta">Ungefärlig kostnad: '+Math.round(r.k*n)+' kr ('+r.k+' kr per låda)</p>'+
  '<h2>Inköp och ingredienser</h2><ul class="ck">'+merge([r],n).map(function(x){return '<li><label><input type="checkbox"> '+fmtI(x)+'</label></li>'}).join('')+'</ul>'+
  '<h2>Förvaring</h2><p>Kyl: '+ki+' portioner som du äter inom '+r.y+' dagar.'+(fr?'<br>Frys: '+fr+' portioner i separata burkar. Håller i '+r.f+' månader. Tina i kylen över natten.':'')+'</p><p><a href="'+r.s+'.html">Se hela receptet</a></p>'}
 $('#rec').onchange=$('#n').oninput=d;d();
}

if(page==='season'){
 var M=['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
 var T=['Rotfrukter, kål och lök är billigast nu.','Kål, palsternacka och blodapelsin.','Rotfrukter och de första vårlökarna.','Rabarber, sparris och nässlor kommer.','Rabarber, sparris, nypotatis och gräslök.','Rabarber, jordgubbar, nypotatis och dill.','Blåbär, jordgubbar, nypotatis och sommarkål.','Blåbär, kantareller, majs och tomater.','Kantareller, svamp, äpplen och pumpa.','Kantareller, äpplen, kål och rotfrukter.','Kål, rotfrukter och lingon.','Kål, rotfrukter, äpplen och pepparrot.'];
 var sel=$('#mo');sel.innerHTML=M.map(function(m,i){return '<option value="'+(i+1)+'">'+m+'</option>'}).join('');sel.value=new Date().getMonth()+1;
 function d(){var m=+sel.value,s=R.filter(function(r){return r.mo.length<12&&r.mo.indexOf(m)>-1}),y=R.filter(function(r){return r.mo.length===12&&r.c!=='Fika'});
  $('#st').textContent='I '+M[m-1]+': '+T[m-1];
  $('#sr').innerHTML=s.length?s.map(link).join(''):'<p class="meta">Inga säsongsspecifika recept den här månaden. Prova årets alla recept nedan.</p>';
  $('#yr').innerHTML=y.map(link).join('')}
 sel.onchange=d;d();
}
})();
(function(){
var d=document,h=(location.hostname||'').replace(/^www\./,'');
if(h&&h.indexOf('.')>-1){[].slice.call(d.querySelectorAll('.mail')).forEach(function(a){var m='kontakt@'+h;a.href='mailto:'+m;a.textContent=m})}
var f=d.getElementById('cf');
if(f)f.onsubmit=function(e){e.preventDefault();var to=d.querySelector('.mail').textContent;
 var b='Namn: '+d.getElementById('cn').value+'\nE-post: '+d.getElementById('ce').value+'\n\n'+d.getElementById('cm').value;
 location.href='mailto:'+to+'?subject='+encodeURIComponent('Svenska Recept: '+d.getElementById('cs').value)+'&body='+encodeURIComponent(b);
 d.getElementById('cok').textContent='Din e-postapp ska nu ha öppnats. Skicka meddelandet därifrån.'};
})();
