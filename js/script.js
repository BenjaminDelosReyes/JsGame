class Ball 
{
  constructor(x, y) 
  {
    this.x = x;
    this.y = y;
    this.r = 10;
    this.speed = 5;
    this.color = "#000";
    this.mx = 0;
    this.my = 0;
    this.dir = 0;
    this.hp = 0;
    this.scorePoint = 0;
    this.toDelete = false;
}
setRandDir()
{
    const dir = TAU * random();
    this.my = sin(dir);
    this.mx = cos(dir);
}
show() 
{
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = this.color;
    ctx.fill();
}
move ()
{
    if (this.x < 0 || this.x > width) 
    {
      this.mx = -this.mx;
      this.x = max(0, min(width, this.x));
  }
  if (this.y < 0 || this.y > height) 
  {
      this.my = -this.my;
      this.y = max(0, min(height, this.y));

  }
  this.x += this.mx * this.speed;
  this.y += this.my * this.speed;
}
hits(other) 
{
    return (this.r + other.r > dist(this.x, this.y, other.x, other.y));
}
getHurt() 
{
    this.hp -= 1;
    if (this.hp <= 0) 
    {
      this.toDelete = true;
      gameData.score += this.scorePoint;
  }
}
getPlayerDir() 
{
    return atan2(player.y - this.y, player.x - this.x);
}
}

class Bullet extends Ball 
{
  constructor(x, y, color, speed, mx, my) 
  {
    super(x, y);
    this.color = color;
    this.mx = mx;
    this.my = my;
    this.r = 5;
    this.speed = speed;
}
update() 
{
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) 
    {
      this.toDelete = true;
  }
  this.x += this.mx * this.speed;
  this.y += this.my * this.speed;
}

}

class Player extends Ball 
{
  constructor() 
  {
    super(width / 2, height / 2.);
    this.normalColor = "#f2f2f2";
    this.damageColor = "#FFF";
    this.color = this.normalColor;
    this.hp = 4;
    this.reloadCount = 1;
    this.reloadTime = 15;
    this.damageTime = 60;
    this.damageCount = 0;
    this.mxP = 0;
    this.myP = 0;
}
getHurt() 
{
    if (this.toDelete) return false;
    if (this.damageCount > 0) return false;
    this.hp -= 1;
    this.damageCount = this.damageTime;
    if (this.hp <= 0) this.toDelete = true;
    return true;
}
shoot() 
{
    if (this.toDelete) return;
    if (this.reloadCount > 0) return;
    this.reloadCount = this.reloadTime;
    const dir = atan2(mouseY - this.y, mouseX - this.x);
    const dirX = cos(dir);
    const dirY = sin(dir);
    this.mxP -= dirX * 0.1;
    this.myP -= dirY * 0.1;
    playerBullets.push(new Bullet(this.x, this.y, this.normalColor, 10, dirX, dirY));
}
update() 
{
    if (this.toDelete) return;

    this.damageCount--;
    if (this.damageCount > 0 && (this.damageCount % 3 == 0)) 
    {
      this.color = this.damageColor;
  }
  else this.color = this.normalColor;

  this.reloadCount--;
  if (mouseIsPressed) this.shoot();

  let mx = 0;
  let my = 0;
  if (pressedKeys["a"]) 
  {
      if (pressedKeys["w"]) 
      {
        mx -= SQRT1_2;
        my -= SQRT1_2;
    }
    else if (pressedKeys["s"]) 
    {
        mx -= SQRT1_2;
        my += SQRT1_2;
    }
    else mx -= 1;
}
else if (pressedKeys["d"]) 
{
  if (pressedKeys["w"]) 
  {
    mx += SQRT1_2;
    my -= SQRT1_2;
}
else if (pressedKeys["s"]) 
{
    mx += SQRT1_2;
    my += SQRT1_2;
}
else mx += 1;
}
else if (pressedKeys["w"]) my -= 1;
else if (pressedKeys["s"]) my += 1;


mx = lerp(this.mxP, mx, 0.1);
my = lerp(this.myP, my, 0.1);
this.mxP = mx;
this.myP = my;

this.x += mx * this.speed;
this.y += my * this.speed;

this.x = max(0, min(width, this.x));
this.y = max(0, min(height, this.y));
}

}

class Enemy1 extends Ball 
{
  constructor(x, y) 
  {
    super(x, y);
    this.setRandDir();

    this.color = "black";
    this.speed = 4;
    this.hp = 1;
    this.scorePoint = 2;
}
update() 
{
    this.move();
}
}


class Enemy2 extends Ball 
{
  constructor(x, y) 
  {
    super(x, y);
    this.setRandDir();
    this.frameCount = 0;

    this.color = "#F00";
    this.r = 12;
    this.speed = 4;
    this.hp = 3;
    this.scorePoint = 4;

    this.turnTime = floor(random() * 50 + 50);
}
turnToPlayer()
{
    const dir = this.getPlayerDir();
    this.my = sin(dir);
    this.mx = cos(dir);
}
update() 
{
    this.move();
    if (++this.frameCount % this.turnTime == 0) this.turnToPlayer();
}
}

class Enemy3 extends Ball 
{
  constructor(x, y) 
  {
    super(x, y);
    this.setRandDir();
    this.frameCount = 0;

    this.color = "#F08";
    this.r = 15;
    this.speed = 2;
    this.hp = 4;
    this.scorePoint = 8;

    this.reloadTime = 90 + floor( random()* 20);
}
shoot() 
{
    const dir = this.getPlayerDir();
    enemyBullets.push(new Bullet(this.x, this.y, this.color, 6, cos(dir), sin(dir)));
}
update() 
{
    this.move();
    if (++this.frameCount % this.reloadTime == 0) this.shoot();
}
}

class Enemy4 extends Ball 
{
  constructor(x, y) 
  {
    super(x, y);
    this.setRandDir();
    this.frameCount = 0;

    this.color = "#Ff0";
    this.r = 40;
    this.speed = 1;
    this.hp = 15;
    this.scorePoint = 16;

    this.baseR = this.r;
    this.produceTime = 190 + floor( random()*20 );
}
produce() 
{
    if (enemies.length >= enemiesLengthMax) return;
    enemies.push(new Enemy1(this.x, this.y));
}
update() 
{
    this.move();

    const phase = ++this.frameCount % this.produceTime;
    this.r = this.baseR - pow(phase / 200, 10) * 10;
    if (phase == 0) this.produce();
}
}

for (const p of Object.getOwnPropertyNames(Math)) window[p] = Math[p];
    const TAU = 2 * PI;

function lerp(a, b, amt) 
{
  return a + amt * (b - a);
}

function dist(x1, y1, x2, y2) 
{
  return sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
}

function shuffle(arr) 
{
  for (let i = 0, l = arr.length; i < l; i++) 
  {
    const tmp = arr[i];
    const rnd = floor(random() * l);
    arr[i] = arr[rnd];
    arr[rnd] = tmp;
}
return arr;
}

const fps = 
{
  d: 0,
  n: 0,
  result: 0,
  list: [],
  process() 
  {
    this.n = Date.now();
    const elapsed = this.n - this.d;
    this.d = this.n;
    this.list.push(elapsed);
    if (this.list.length < 10) return this.result;

    let sum = 0;
    for (const n of this.list) sum += n;
        this.list = [];
    return this.result = 1000 / (sum / 10);
}
}

const width = 600;
const height = floor(width * 9 / 16);
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;


let gameData = 
{
  time: null,
  score: 0,
};

let player = new Player();
let enemies = [];
let playerBullets = [];
let enemyBullets = [];
let frameCount = 0;

const enemiesLengthMax = 25;
let enemyAddCount = 0;
let reservedEnemies = [];

const enemyStartPoints = [
[0, 0],
[width, 0],
[0, height],
[width, height],
];

const enemy1Ratio = sec => min(10, lerp(5, 10, sec / 60)); 
const enemy2Ratio = sec => min(7, 7 * ((sec - 30) / 60 / 1)); //  0.5  - 1.5 m
const enemy3Ratio = sec => min(3, 3 * ((sec - 60) / 60 / 3)); //  1 - 4 m 
const enemy4Ratio = sec => floor(sec / 180); // 3 m


function addEnemy() 
{
  const sec = frameCount / 60;
  if (enemies.length >= enemiesLengthMax) return;
  else if (reservedEnemies.length == 0) 
  {
    for (let i = enemy1Ratio(sec); i-- > 0;)reservedEnemies.push(Enemy1);
        for (let i = enemy2Ratio(sec); i-- > 0;)reservedEnemies.push(Enemy2);
            for (let i = enemy3Ratio(sec); i-- > 0;)reservedEnemies.push(Enemy3);
                for (let i = enemy4Ratio(sec); i-- > 0;)reservedEnemies.push(Enemy4);

    // let obj = { sec: floor(sec) };
    // for (const e of reservedEnemies) {
    //   if (obj[e.name]) obj[e.name]++;
    //   else obj[e.name] = 1;
    // }
    // console.log(obj);

    shuffle(reservedEnemies);
}

for (let i = (reservedEnemies.length == 2 ? 2 : 1); i--;) 
{
    const rndClass = reservedEnemies.shift();
    const pos = enemyStartPoints[floor(random() * 4)];
    enemies.push(new rndClass(pos[0], pos[1]));
}

enemyAddCount = max(100, lerp(200, 100, sec / (60 * 3)));
  // console.log({sec, enemyAddCount})
}

// for (let i = 0; i < 60 * 60 * 6; i++) {
//   if (--enemyAddCount <= 0) addEnemy();
//   enemies = [];
//   frameCount++;
// }
// reservedEnemies = [];
// frameCount = 60 * 60 * 10; // start at 3min
// player.hp = 100;

function filterOut(ball) {
  return !ball.toDelete;
}

function background() {
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = "#eee";
  ctx.fill();
}

function draw() {
  if (--enemyAddCount <= 0) addEnemy();

  player.update();
  for (const enemy of enemies) {
    enemy.update();
    if (player.hits(enemy)) {
      if (player.getHurt()) break;
  }
}

for (const pb of playerBullets) {
    pb.update();
    for (const enemy of enemies) {
      if (pb.hits(enemy)) {
        pb.toDelete = true;
        enemy.getHurt();
        break;
    }
}
}

for (const eb of enemyBullets) {
    eb.update();
    if (player.hits(eb)) {
      if (player.getHurt()) {
        eb.toDelete = true;
        break;
    }
}
}

  // display
  background();
  if (!player.toDelete) player.show();
  for (const enemy of enemies) enemy.show();
      for (const pb of playerBullets) pb.show();
          for (const eb of enemyBullets) eb.show();

              enemies = enemies.filter(filterOut);
          playerBullets = playerBullets.filter(filterOut);
          enemyBullets = enemyBullets.filter(filterOut);

  // text
  if (player.hp <= 0) {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("GAME OVER", 7.5, height / 2);
}
else {
    const time = (frameCount / 60);
    gameData.time = time.toFixed(1);
}

ctx.fillStyle = "black";
ctx.font = "15px Arial";
ctx.fillText(`SCORE: ${gameData.score}`, 7.5, 15);
ctx.fillText(`HP: ${player.hp}`, 7.5, 35);
  // ctx.fillText(fps.process().toFixed(1), 7.5, height - 55);
  // ctx.fillText(`time: ${gameData.time}`, 7.5, height - 35);

  frameCount++;
  requestAnimationFrame(draw);

}



{  // title
  background();
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("TOP-DOWN SHOOTER", 7.5, height / 2);

  ctx.font = "15px Arial";
  ctx.fillText("click to start", 7.5, height - 15);
}


let mouseX = 0;
let mouseY = 0;
let mouseIsPressed = false;
let pressedKeys = [];

document.addEventListener("keydown", e => pressedKeys[e.key] = true);
document.addEventListener("keyup", e => pressedKeys[e.key] = false);

document.addEventListener("mousedown", _ => mouseIsPressed = true);
document.addEventListener("mouseup", _ => mouseIsPressed = false);

canvas.addEventListener("mousemove", e => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
});

function startGame() {
  canvas.removeEventListener("mousedown", startGame);
  draw();
}
window.addEventListener("load", _ => {
  canvas.addEventListener("mousedown", startGame);
})