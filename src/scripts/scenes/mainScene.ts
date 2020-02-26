import ExampleObject from '../objects/exampleObject';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private background: Phaser.GameObjects.TileSprite;
  private ship1: Phaser.GameObjects.Image;
  private ship2: Phaser.GameObjects.Image;
  private ship3: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, 256, 272, "background");
    this.background.setOrigin(0, 0);

    this.ship1 = this.add.image(20, 50, "ship1");
    this.ship1.setScale(2);
    this.ship1.flipY = true;
    this.ship2 = this.add.image(50, 100, "ship1")
    this.ship3 = this.add.image(100, 150, "ship1")
    this.exampleObject = new ExampleObject(this, 0, 0);
    this.add.text(50, 50, "Start game", {font: "25px Arial", fill: "blue"});
  }

  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 3);
    this.moveShip(this.ship3, 2);

    this.background.tilePositionY -= 0.5;
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
}
