export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("ship1", "assets/ship.png");
    this.load.image("ship2", "assets/ship2.png");
    this.load.image("ship3", "assets/ship3.png");
  }

  create() {
    this.scene.start('MainScene');
  }
}
