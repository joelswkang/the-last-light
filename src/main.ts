import Phaser from 'phaser';
import './style.css';

type GameState = { wood:number; food:number; light:number; hope:number; day:number; shelter:boolean; beacon:boolean; actions:number };
const KEY='the-last-light-save-v1';
const initial:GameState={wood:12,food:8,light:3,hope:1,day:1,shelter:false,beacon:false,actions:0};
function load():GameState{try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...initial}}}
const state=load();

class ValeScene extends Phaser.Scene {
  private points:Phaser.GameObjects.Container[]=[];
  private width=360; private height=300;
  constructor(){super('vale')}
  preload(){this.load.svg('vale-art',new URL('./clearing.svg',import.meta.url).href,{width:800,height:600});}
  create(){this.paint();this.scale.on('resize',()=>this.paint());}
  paint(){
    this.children.removeAll();this.points=[];this.width=this.scale.width;this.height=this.scale.height;
    const w=this.width,h=this.height;
    this.add.image(w/2,h/2,'vale-art').setDisplaySize(w,h);
    this.drawLantern(w*.68,h*.69,.82);
    this.drawPerson(w*.29,h*.78,.85);
    this.node(w*.18,h*.71,'✦','WOOD',()=>this.game.events.emit('gather-wood'));
    this.node(w*.84,h*.78,'✿','BERRIES',()=>this.game.events.emit('gather-food'));
    this.node(w*.72,h*.43,'⌑','OLD TRAIL',()=>this.game.events.emit('trail'));
    if(state.shelter)this.drawHut(w*.24,h*.58,.55);
    if(state.beacon)this.drawBeacon(w*.68,h*.69,1.05);
    const flecks=this.add.graphics();
    for(let i=0;i<35;i++){const x=(i*47+13)%w,y=(i*29+7)%h;flecks.fillStyle(i%4===0?0xf1d28b:0xc2c995,.15+(i%3)*.08);flecks.fillCircle(x,y,1+(i%2));}
    this.cameras.main.setBackgroundColor('#344f43');
  }
  drawHut(x:number,y:number,s:number){const g=this.add.graphics(),u=Math.min(this.width,this.height)*.07*s;g.fillStyle(0x1c3028,.3);g.fillEllipse(x,y+u*.7,u*1.7,u*.36);g.fillStyle(0xc6a77b,1);g.fillRoundedRect(x-u*.58,y-u*.25,u*1.16,u*.9,u*.08);g.fillStyle(0x674b38,1);g.beginPath();g.moveTo(x-u*.78,y-u*.22);g.lineTo(x,y-u*.95);g.lineTo(x+u*.78,y-u*.22);g.closePath();g.fillPath();g.fillStyle(0x263b31,1);g.fillRoundedRect(x-u*.14,y+u*.13,u*.28,u*.52,u*.08);g.fillStyle(0xf0c879,.9);g.fillCircle(x+u*.35,y+u*.15,u*.11);}
  drawPerson(x:number,y:number,s:number){const g=this.add.graphics(),u=Math.min(this.width,this.height)*.035*s;g.fillStyle(0x1a2e28,.3);g.fillEllipse(x,y+u*1.5,u*1.3,u*.35);g.fillStyle(0x9e7557,1);g.fillCircle(x,y-u*.55,u*.34);g.fillStyle(0xd2b88c,1);g.fillRoundedRect(x-u*.34,y-u*.25,u*.68,u*1.25,u*.2);g.fillStyle(0x526b58,1);g.fillRoundedRect(x-u*.42,y+u*.7,u*.32,u*.7,u*.12);g.fillRoundedRect(x+u*.1,y+u*.7,u*.32,u*.7,u*.12);g.fillStyle(0xe4c77e,1);g.fillCircle(x+u*.5,y-u*.1,u*.13);}
  drawLantern(x:number,y:number,s:number){const g=this.add.graphics(),u=Math.min(this.width,this.height)*.03*s;g.fillStyle(0xf1c56f,.12);g.fillCircle(x,y,u*3.2);g.fillStyle(0xe8c16e,.2);g.fillCircle(x,y,u*2);g.lineStyle(2,0x463c2d,1);g.strokeRoundedRect(x-u*.35,y-u*.55,u*.7,u*1.05,u*.12);g.fillStyle(0xffdc8c,1);g.fillRoundedRect(x-u*.22,y-u*.4,u*.44,u*.75,u*.08);g.lineStyle(2,0x4d4433,1);g.strokeCircle(x,y-u*.58,u*.24);}
  drawBeacon(x:number,y:number,s:number){const g=this.add.graphics(),u=Math.min(this.width,this.height)*.03*s;g.fillStyle(0xffd77a,.13);g.fillCircle(x,y,u*4);g.fillStyle(0xf5cb76,.16);g.fillCircle(x,y,u*2.6);g.fillStyle(0xf8d68e,.9);g.fillTriangle(x,y-u*2,x-u*.7,y+u*.5,x+u*.7,y+u*.5);g.fillStyle(0x8b5e3d,1);g.fillRoundedRect(x-u*.2,y+u*.3,u*.4,u*.7,u*.05);}
  node(x:number,y:number,symbol:string,label:string,fn:()=>void){const c=this.add.container(x,y);const halo=this.add.circle(0,0,17,0xeacb85,.18);const dot=this.add.circle(0,0,11,0x213d32,.94).setStrokeStyle(1,0xe8ca86,.9);const txt=this.add.text(0,-1,symbol,{fontFamily:'serif',fontSize:'15px',color:'#f1d28e'}).setOrigin(.5);const tag=this.add.text(0,20,label,{fontFamily:'sans-serif',fontSize:'7px',fontStyle:'bold',letterSpacing:1,color:'#f3e7ca',stroke:'#1d342b',strokeThickness:3}).setOrigin(.5);c.add([halo,dot,txt,tag]);c.setInteractive(new Phaser.Geom.Circle(0,0,18),Phaser.Geom.Circle.Contains);c.on('pointerdown',fn);this.tweens.add({targets:halo,alpha:.08,scale:1.4,duration:1300,yoyo:true,repeat:-1});this.points.push(c);}
}

const game=new Phaser.Game({type:Phaser.AUTO,parent:'game-canvas',width:600,height:420,backgroundColor:'#344f43',render:{antialias:true,pixelArt:false,roundPixels:false},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[ValeScene],input:{activePointers:3}});
function $(id:string){return document.getElementById(id)!}
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function render(){for(const k of ['wood','food','light','hope'] as const)$(k).textContent=String(state[k]);$('day').textContent=String(state.day).padStart(2,'0');$('phase').textContent=state.beacon?'DUSK · BEACON LIT':'DUSK · SAFE';$('step-count').textContent=state.beacon?'04 / 04':state.shelter?'03 / 04':'01 / 04';$('task-title').textContent=state.beacon?'The beacon remembers your name':state.shelter?'A roof against the coming dark':'Gather what the forest gives';$('task-copy').textContent=state.beacon?'A warm light reaches beyond the clearing. The old trail is beginning to wake.':state.shelter?'You have made a place for someone to rest. Now kindle a beacon so the lost can find you.':'The old paths are quiet. Search the clearing for fallen branches and wild provisions.';document.querySelector('[data-action="build"]')?.classList.toggle('done',state.shelter);document.querySelector('[data-action="light"]')?.classList.toggle('done',state.beacon)}
let toastTimer=0;
function toast(message:string){const el=$('toast');el.textContent=message;el.classList.add('show');window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>el.classList.remove('show'),1900)}
function act(action:string){
  if(action==='wood'){state.wood+=3;state.actions++;toast('Collected 3 pieces of wood');}
  else if(action==='food'){state.food+=2;state.actions++;toast('Found 2 handfuls of wild berries');}
  else if(action==='build'){if(state.shelter){toast('Your shelter is already repaired');return}if(state.wood<6){toast('You need 6 wood to repair the shelter');return}state.wood-=6;state.shelter=true;state.hope++;toast('Shelter repaired · Hope +1');}
  else if(action==='light'){if(!state.shelter){toast('Repair the shelter before lighting the beacon');return}if(state.beacon){toast('The beacon is already burning');return}if(state.wood<2){toast('You need 2 wood to kindle the beacon');return}state.wood-=2;state.light+=2;state.beacon=true;state.hope++;state.day++;toast('The beacon is alive · A new day begins');}
  save();const scene=game.scene.getScene('vale') as ValeScene|undefined;if(scene?.scene.isActive())scene.paint();
}
document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(b=>b.addEventListener('click',()=>act(b.dataset.action||'')));
game.events.on('gather-wood',()=>act('wood'));game.events.on('gather-food',()=>act('food'));game.events.on('trail',()=>toast(state.beacon?'The trail leads into the Whispering Wood. Coming in Chapter II.':'The path is hidden in the mist. Light the beacon first.'));
$('soundBtn').addEventListener('click',()=>toast('Ambient sound will arrive in a future update'));
$('mapNav').addEventListener('click',()=>toast('World map unlocks in a future chapter'));
$('journalNav').addEventListener('click',()=>toast('Journal: The clearing is your first safe place.'));
$('peopleNav').addEventListener('click',()=>toast('No travellers have arrived yet. Keep the beacon burning.'));
render();
