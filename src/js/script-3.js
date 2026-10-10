(function(){
'use strict';
const {state,reduced,notify}=Archive.session,fine=matchMedia('(pointer:fine)'),layers=[...document.querySelectorAll('.organic-layer')],hero=document.querySelector('.organic-hero');
let target={x:0,y:0},pointer={x:innerWidth/2,y:innerHeight/2},smooth={x:0,y:0},drag=false,enabled=state.effects&&!reduced.matches;
const cursor=document.createElement('div');cursor.className='occult-cursor';cursor.setAttribute('aria-hidden','true');cursor.innerHTML='<span>⟡</span><i></i>';document.body.append(cursor);
const glyphs=Array.from({length:42},(_,i)=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:0,vy:0,homeX:Math.random(),homeY:Math.random(),symbol:['ᚦ','ᛟ','◈','ᚱ','⟁','✧'][i%6]}));
const canvas=document.getElementById('dust'),ctx=canvas.getContext('2d');
document.addEventListener('pointermove',e=>{if(!fine.matches)return;pointer.x=e.clientX;pointer.y=e.clientY;target.x=e.clientX/innerWidth-.5;target.y=e.clientY/innerHeight-.5;cursor.classList.toggle('is-link',!!e.target.closest('a,button'));cursor.classList.toggle('is-text',!!e.target.closest('input,textarea'));cursor.classList.add('seen');});
document.addEventListener('pointerdown',()=>{drag=true;cursor.classList.add('pressed');});addEventListener('pointerup',()=>{drag=false;cursor.classList.remove('pressed');});document.addEventListener('pointerout',e=>{if(!e.relatedTarget)cursor.classList.remove('seen');});
const priorFrame=Archive.onFrame;
Archive.onFrame=(time,dt)=>{priorFrame?.(time,dt);if(!enabled)return;smooth.x+=(target.x-smooth.x)*.045*dt;smooth.y+=(target.y-smooth.y)*.045*dt;
if(fine.matches){cursor.style.transform=`translate(${pointer.x}px,${pointer.y}px)`;const scroll=Math.min(scrollY/innerHeight,1.5);layers.forEach((layer,i)=>{let d=+layer.dataset.depth;layer.style.transform=`translate3d(${smooth.x*d*64+Math.sin(time/7300+i)*d*4}px,${smooth.y*d*40+scroll*d*18}px,0) rotate(${Math.sin(time/9800+i)*d*.16}deg)`;});}
if(!ctx||!fine.matches)return;ctx.save();ctx.font='24px Georgia';ctx.textAlign='center';for(const g of glyphs){let hx=g.homeX*innerWidth,hy=g.homeY*innerHeight,dx=g.x-pointer.x,dy=g.y-pointer.y,dist=Math.hypot(dx,dy);g.vx+=(hx-g.x)*.0009*dt;g.vy+=(hy-g.y)*.0009*dt;if(dist<230){let attraction=drag?-.012:.004;g.vx+=dx*attraction*dt;g.vy+=dy*attraction*dt;ctx.strokeStyle='rgba(133,163,149,.1)';ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(pointer.x,pointer.y);ctx.stroke();}g.vx*=.92;g.vy*=.92;g.x+=g.vx*dt;g.y+=g.vy*dt;ctx.fillStyle=`rgba(142,165,150,${dist<230?.52:.13})`;ctx.fillText(g.symbol,g.x,g.y);}ctx.restore();};
const priorEffects=Archive.onEffects;Archive.onEffects=on=>{priorEffects?.(on);enabled=on;cursor.classList.toggle('disabled',!on);if(!on)layers.forEach(l=>l.style.transform='');};
// Preserve the existing drone and add a separately controllable breath/voice layer.
const button=document.createElement('button');button.className='whisper-control';button.textContent='Murmures : on';button.setAttribute('aria-pressed','true');button.title='Souffles et chuchotements non verbaux, actifs avec le son';document.getElementById('sound').after(button);
let whispers=true,sound=false,audio=null,output=null,timer=null;
const whisperSources=new Set();
function stop(){clearTimeout(timer);timer=null;for(const src of whisperSources){try{src.stop();}catch{}}whisperSources.clear();}
function murmur(){
if(!sound||!whispers||document.hidden)return;
if(audio&&audio.state==='running'){
const duration=3.8+Math.random()*2.4,now=audio.currentTime;
const buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate),data=buffer.getChannelData(0);
// Irregular unvoiced syllables: breath and sibilance, without an oscillator or spoken words.
const pulses=[];let pos=.12;while(pos<duration-.4){const len=.08+Math.random()*.65;pulses.push([pos,len,.35+Math.random()*.65]);pos+=len+.03+Math.random()*.36;}
let soft=0;for(let i=0;i<data.length;i++){const t=i/audio.sampleRate;let env=0;for(const [at,len,amp] of pulses){const x=(t-at)/len;if(x>0&&x<1)env+=amp*Math.pow(Math.sin(Math.PI*x),1.7);}const white=Math.random()*2-1;soft=soft*.87+white*.13;data[i]=(white*.7+soft*.5)*env*Math.pow(Math.sin(Math.PI*t/duration),.6);}
const src=audio.createBufferSource(),high=audio.createBiquadFilter(),band=audio.createBiquadFilter(),low=audio.createBiquadFilter(),gain=audio.createGain(),pan=audio.createStereoPanner?.();
src.buffer=buffer;high.type='highpass';high.frequency.value=420;band.type='peaking';band.frequency.setValueAtTime(1600+Math.random()*900,now);band.frequency.linearRampToValueAtTime(2800+Math.random()*1600,now+duration*.5);band.frequency.linearRampToValueAtTime(1100+Math.random()*1300,now+duration);band.Q.value=2.1;band.gain.value=10;low.type='lowpass';low.frequency.value=4700;gain.gain.value=.14;
src.connect(high);high.connect(band);band.connect(low);low.connect(gain);
if(pan){const side=Math.random()>.5?1:-1;pan.pan.setValueAtTime(side*.8,now);pan.pan.linearRampToValueAtTime(-side*.35,now+duration);gain.connect(pan);pan.connect(output);}else gain.connect(output);
whisperSources.add(src);src.onended=()=>{whisperSources.delete(src);for(const node of [src,high,band,low,gain,pan])node?.disconnect();};src.start();
}
timer=setTimeout(murmur,14000+Math.random()*14000);
}
function schedule(){stop();if(sound&&whispers&&!document.hidden)timer=setTimeout(murmur,6500);}
const priorAudio=Archive.onAudio;Archive.onAudio=(context,master,on)=>{priorAudio?.(context,master,on);audio=context;output=master;sound=on;schedule();};
button.addEventListener('click',()=>{whispers=!whispers;button.setAttribute('aria-pressed',whispers);button.textContent='Murmures : '+(whispers?'on':'off');schedule();if(whispers&&!sound)notify('Les murmures accompagnent l’ambiance lorsque le son est activé.');});document.addEventListener('visibilitychange',schedule);addEventListener('pagehide',stop);
Archive.organic={glyphs,layers};
})();
