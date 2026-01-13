
//test change

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: "#FFF6C8",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  scene: { preload, create, update }
};

new Phaser.Game(config);


let pump;
let balloons = [];
let lastSpawnTime = 0;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const BALLOON_TYPES = ["b1", "b2", "b3", "b4"];

function preload() {
  // Background
  this.load.image("bg", "assets/backgrounds/bg1.png");

  // Pump
  this.load.image("pump", "assets/pump/pump_1.png");

  // Balloons
  this.load.image("b1", "assets/ballons/blue.png");
  this.load.image("b2", "assets/ballons/green.png");
  this.load.image("b3", "assets/ballons/red.png");
  this.load.image("b4", "assets/ballons/yellow.png");

  // Burst
  this.load.image("burst", "assets/burst/burst_1.png");
}

function create() {
  // Background full screen
  const bg = this.add.image(640, 360, "bg");
bg.setScale(
  Math.max(
    this.scale.width / bg.width,
    this.scale.height / bg.height
  )
);


  // Pump position (bottom-right)
 pump = this.add.image(
  this.scale.width - 40,
  this.scale.height - 40,
  "pump"
)
.setOrigin(1, 1)
.setScale(0.8);


  // Touch / Click anywhere to pump
  this.input.on("pointerdown", () => {
    spawnBalloon.call(this);
  });
}

function spawnBalloon() {
  const currentTime = this.time.now;
  if (currentTime - lastSpawnTime < 700) return; 
  lastSpawnTime = currentTime;

  const balloonKey = Phaser.Utils.Array.GetRandom(BALLOON_TYPES);
  const letter = Phaser.Utils.Array.GetRandom(LETTERS);

  // Create balloon
  const balloon = this.physics.add.image(
    pump.x - 70,
    pump.y - 90,
    balloonKey
  );

  balloon.setScale(0.2);
  balloon.inflate = true;
  balloon.setCollideWorldBounds(false);

  // Letter on balloon
  const letterText = this.add.text(balloon.x, balloon.y, letter, {
    fontFamily: "Arial",
    fontSize: "46px",
    fontStyle: "bold",
    color: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4
  }).setOrigin(0.5);

  balloon.letterText = letterText;

  // Tap to burst
  balloon.setInteractive();
  balloon.on("pointerdown", () => {
    popBalloon.call(this, balloon);
  });

  balloons.push(balloon);
}

function popBalloon(balloon) {
  const burst = this.add.image(balloon.x, balloon.y, "burst")
    .setScale(0.4);

  balloon.letterText.destroy();
  balloon.destroy();

  this.time.delayedCall(300, () => {
    burst.destroy();
  });
}

function update() {
  balloons.forEach(balloon => {
    if (!balloon.active) return;

    
    if (balloon.inflate) {
      balloon.scale += 0.01;

      if (balloon.scale >= 0.55) {
        balloon.inflate = false;

        
        balloon.setVelocity(
          Phaser.Math.Between(-15, 15),
          -45
        );
      }
    }

    
    balloon.letterText.x = balloon.x;
    balloon.letterText.y = balloon.y;
  });
}
