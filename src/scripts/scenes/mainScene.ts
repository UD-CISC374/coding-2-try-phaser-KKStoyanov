import ExampleObject from '../objects/exampleObject';
import Beam from './Beam';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private background: Phaser.GameObjects.TileSprite;
  private ship1: Phaser.Physics.Arcade.Sprite;
  private ship2: Phaser.Physics.Arcade.Sprite;
  private ship3: Phaser.Physics.Arcade.Sprite;
  private powerUps: Phaser.Physics.Arcade.Group;
  private player: Phaser.Physics.Arcade.Sprite;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private spacebar: Phaser.Input.Keyboard.Key;
  projectiles: Phaser.Physics.Arcade.Group;
  enemies: Phaser.Physics.Arcade.Group;
  scoreLabel: Phaser.GameObjects.BitmapText;
  hpLabel: Phaser.GameObjects.BitmapText;
  gameOverLabel: Phaser.GameObjects.BitmapText;
  score: number;
  hp: number;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);

    this.ship1 = this.physics.add.sprite(this.scale.width / 2 - 50, this.scale.height / 2, "ship");
    this.ship2 = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, "ship2");
    this.ship3 = this.physics.add.sprite(this.scale.width / 2 + 50, this.scale.height / 2, "ship3");

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    /*this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on('gameobjectdown', this.destroyShip, this);*/

    this.physics.world.setBoundsCollision();

    this.powerUps = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    
    for(let i = 0; i < this.enemies.getChildren().length; i++){
      this.physics.add.existing(this.enemies.getChildren()[i]);
    }

    let maxObjects: number = 4;
    for (let i = 0; i <= maxObjects; i++) {
      let powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
       powerUp.setRandomPosition(0, 0, this.scale.width, this.scale.height);

      
      if (Math.random() > 0.5) {
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }

      
      powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);

    }

    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(this.scale.width, 0);
    graphics.lineTo(this.scale.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    this.hp = 100;

    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE", 16);
    this.hpLabel = this.add.bitmapText(200, 5, "pixelFont", "HP", 16);

    this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp){
      projectile.destroy();
    });

    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, undefined, this);
  }

  update() {
    for(let i = 0; i < this.enemies.getChildren().length; i++){
      let ship = this.enemies.getChildren()[i];
      this.moveShip(ship, 2);
    }

    this.background.tilePositionY -= 0.5;

    this.movePlayerManager();

    if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
      this.shootBeam();
    }

    for(let i = 0; i < this.projectiles.getChildren().length; i++){
      let beam = this.projectiles.getChildren()[i];
      beam.update();
    }

    let scoreFormated = this.zeroPad(this.score, 5);
    this.scoreLabel.text = "SCORE " + scoreFormated;

    let hpFormated = this.zeroPad(this.hp, 3);
    this.hpLabel.setText("HP " + hpFormated);

    if(this.hp == 0){
      this.player.play("explode");
      this.player.disableBody(true, true);
      this.spacebar.enabled = false;
      this.gameOverLabel = this.add.bitmapText(this.scale.width / 2 - 30, this.scale.height / 2, "pixelFont", "Game Over!", 16);
    }
  }
  hitEnemy(projectile, enemy){
    projectile.destroy();
    this.resetShipPos(enemy);
    this.score += 20;
    //this.scoreLabel.text = "SCORE " + this.score;
    //this.player.scale = this.player.scale + 2;

  }

  hurtPlayer(player: Phaser.GameObjects.GameObject, enemy){
    this.resetShipPos(enemy);
    this.hp -= 20;
  }

  pickPowerUp(player, powerUp){
    powerUp.disableBody(true, true);
    this.score += 10;
    this.scoreLabel.setText("SCORE " + this.score);
  }

  moveShip(ship, speed){
    ship.y += speed;
    if(ship.y > 272){
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship){
    ship.y = 0;
    let randomX: number = Phaser.Math.Between(0, 256);
    ship.x = randomX;
  }

  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  movePlayerManager(){
    if(this.cursorKeys.left?.isDown){
      this.player.setVelocityX(-200);
    }else if(this.cursorKeys.right?.isDown){
      this.player.setVelocityX(200)
    }

    if(this.cursorKeys.up?.isDown){
      this.player.setVelocityY(-200);
    }else if(this.cursorKeys.down?.isDown){
      this.player.setVelocityY(200);
    }
  }

  shootBeam(){
    let beam = new Beam(this);
  }

  zeroPad(number, size){
    let stringNumber = String(number);
    while(stringNumber.length < (size || 2)){
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }
  
}
