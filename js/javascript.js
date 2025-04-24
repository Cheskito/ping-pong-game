class EscenaMenu extends Phaser.Scene {
  constructor() {
    super('EscenaMenu');
  }

  preload() {
    this.load.image('fondo', 'img/table.jpg');
    this.load.audio('themeMusic', 'audio/theme.wav');
  }

  create() {
    this.add.image(480, 320, 'fondo');
    this.themeMusic = this.sound.add('themeMusic', {
      loop: true,
      volume: 0.5
    });
    this.themeMusic.play();

    const titulo = this.add.text(480, 200, 'PING PONG', {
      fontFamily: 'font1',
      fontSize: 64,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    const botonComenzar = this.add.text(480, 320, 'COMENZAR', {
      fontFamily: 'font1',
      fontSize: 32,
      color: '#ffff00',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    botonComenzar.setInteractive();

    botonComenzar.on('pointerover', () => {
      botonComenzar.setStyle({ color: '#ff0000' });
    });

    botonComenzar.on('pointerout', () => {
      botonComenzar.setStyle({ color: '#ffff00' });
    });

    botonComenzar.on('pointerdown', () => {
      this.scene.start('EscenaJuego');
    });

    this.add.text(480, 550, 'Francesco Riva Reyes', {
      fontFamily: 'font1',
      fontSize: 24,
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
  }
}

class EscenaJuego extends Phaser.Scene {
  constructor() {
    super('EscenaJuego');
    this.nivel = 1;
    this.velocidadNivel1 = 300;
    this.velocidadNivel2 = 500;
  }

  preload() {
    this.load.image('fondo', 'img/table.jpg');
    this.load.spritesheet('bola', 'img/bola.png', {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.image('mano1', 'img/pallet1.png');
    this.load.image('mano2', 'img/pallet2.png');
    this.load.image('leftBtn', 'img/flecha.png');
    this.load.audio('hitSound', 'audio/hitSound.wav');
    this.load.audio('scoreSound', 'audio/scoreSound.wav');
  }

  create() {
    this.input.addPointer();
    this.input.addPointer();
    this.input.addPointer();

    this.add.image(480, 320, 'fondo');
    this.bola = this.physics.add.sprite(480, 320, 'bola');
    this.anims.create({
      key: 'brillar',
      frames: this.anims.generateFrameNumbers('bola', {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.bola.play('brillar');
    this.hitSound = this.sound.add('hitSound');
    this.scoreSound = this.sound.add('scoreSound');

    this.bola.setBounce(1);
    this.mano1 = this.physics.add.sprite(70, 320, 'mano1');
    this.mano1.body.immovable = true;
    this.mano1.setSize(60, 250);
    this.mano1.setCollideWorldBounds(true);
    this.mano1.setScale(0.1);
    this.bola.setBounce(10);
    this.physics.add.collider(this.bola, this.mano1, () => {
      this.hitSound.play();
    });

    this.mano2 = this.physics.add.sprite(882, 320, 'mano2');
    this.mano2.body.immovable = true;
    this.mano2.setSize(60, 250);
    this.mano2.setCollideWorldBounds(true);
    this.mano2.setScale(0.1);
    this.mano2.setBounce(10);
    this.physics.add.collider(this.bola, this.mano2, () => {
      this.hitSound.play();
    });

    const velocidad = this.nivel === 1 ? this.velocidadNivel1 : this.velocidadNivel2;
    
    let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
    const derechaOIzq = Math.floor(Math.random() * 2);
    if (derechaOIzq === 1) anguloInicial += Math.PI;
    const vx = Math.sin(anguloInicial) * velocidad;
    const vy = Math.cos(anguloInicial) * velocidad;

    this.bola.setBounce(1);
    this.bola.setCollideWorldBounds(true);
    this.physics.world.setBoundsCollision(false, false, true, true);

    this.bola.body.velocity.x = vx;
    this.bola.body.velocity.y = vy;
    this.cursors = this.input.keyboard.createCursorKeys();

    this.controlesVisuales({
      x: 50,
      y: 50
    }, {
      x: 50,
      y: 590
    }, this.mano1);

    this.controlesVisuales({
      x: 910,
      y: 50
    }, {
      x: 910,
      y: 590
    }, this.mano2);

    this.alguienGano = false;

    this.pintarMarcador();

    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    this.add.text(480, 620, 'Francesco Riva Reyes', {
      fontFamily: 'font1',
      fontSize: 24,
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5, 0.5);
    this.nivelTexto = this.add.text(480, 75, 'Nivel ' + this.nivel, {
      fontFamily: 'font1',
      fontSize: 40,
      color: '#ffffff',
    }).setOrigin(0.5, 1.5);
  }

  update() {
    this.bola.rotation += 0.1;

    if (this.bola.x < 0 && this.alguienGano === false) {
      this.scoreSound.play();
      this.alguienGano = true;
      this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
      
      if (parseInt(this.marcadorMano2.text) >= 3) {
        if (this.nivel === 1) {
          this.nivel = 2;
          this.reiniciarNivel();
        } else if (this.nivel === 2) {
          alert('Felicidades, Francesco Riva Reyes');
          this.nivel = 1;
          this.scene.start('EscenaMenu');
        }
      } else {
        this.colocarPelota();
      }
    } else if (this.bola.x > 960 && this.alguienGano === false) {
      this.scoreSound.play();
      this.alguienGano = true;
      this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
      
      if (parseInt(this.marcadorMano1.text) >= 3) {
        if (this.nivel === 1) {
          this.nivel = 2;
          this.reiniciarNivel();
        } else if (this.nivel === 2) {
          alert('Felicidades, Francesco Riva Reyes');
          this.nivel = 1;
          this.scene.start('EscenaMenu');
        }
      } else {
        this.colocarPelota();
      }
    }

    if (this.wasd.up.isDown || this.mano1.getData('direccionVertical') === 1) {
      this.mano1.y -= 5;
    } else if (this.wasd.down.isDown || this.mano1.getData('direccionVertical') === -1) {
      this.mano1.y += 5;
    }

    if (this.cursors.up.isDown || this.mano2.getData('direccionVertical') === 1) {
      this.mano2.y -= 5;
    } else if (this.cursors.down.isDown || this.mano2.getData('direccionVertical') === -1) {
      this.mano2.y += 5;
    }
  }

  pintarMarcador() {
    this.marcadorMano1 = this.add.text(440, 150, '0', {
      fontFamily: 'font1',
      fontSize: 80,
      color: '#ffffff',
      align: 'right'
    }).setOrigin(1, 0.5);

    this.marcadorMano2 = this.add.text(520, 150, '0', {
      fontFamily: 'font1',
      fontSize: 80,
      color: '#ffffff',
    }).setOrigin(0, 0.5);
  }

  reiniciarNivel() {
    this.marcadorMano1.text = '0';
    this.marcadorMano2.text = '0';
    
    this.nivelTexto.setText('Nivel ' + this.nivel);
    
    this.colocarPelota();
  }

  colocarPelota() {
    const velocidad = this.nivel === 1 ? this.velocidadNivel1 : this.velocidadNivel2;

    let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
    const derechaOIzq = Math.floor(Math.random() * 2);
    if (derechaOIzq === 1) anguloInicial += Math.PI;

    const vx = Math.sin(anguloInicial) * velocidad;
    const vy = Math.cos(anguloInicial) * velocidad;

    this.bola = this.physics.add.sprite(480, 320, 'bola');
    this.bola.play('brillar');

    this.bola.setBounce(1);
    this.physics.world.enable(this.bola);

    this.bola.setCollideWorldBounds(true);
    this.physics.world.setBoundsCollision(false, false, true, true);

    this.bola.body.velocity.x = vx;
    this.bola.body.velocity.y = vy;
    this.physics.add.collider(this.bola, this.mano1, () => {
      this.hitSound.play();
    });
    this.physics.add.collider(this.bola, this.mano2, () => {
      this.hitSound.play();
    });

    this.alguienGano = false;
  }

  controlesVisuales(btn1, btn2, player) {
    player.setData('direccionVertical', 0);

    const upBtn = this.add.sprite(btn1.x, btn1.y, 'leftBtn').setInteractive();
    const downBtn = this.add.sprite(btn2.x, btn2.y, 'leftBtn').setInteractive();
    downBtn.flipY = true;

    downBtn.on('pointerdown', () => {
      player.setData('direccionVertical', -1);
    });

    upBtn.on('pointerdown', () => {
      player.setData('direccionVertical', 1);
    });

    downBtn.on('pointerup', () => {
      player.setData('direccionVertical', 0);
    });

    upBtn.on('pointerup', () => {
      player.setData('direccionVertical', 0);
    });
  }

}

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  scene: [EscenaMenu, EscenaJuego],
  physics: {
    default: 'arcade',
  }
};

new Phaser.Game(config);