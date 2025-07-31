const config = {
    type: Phaser.AUTO,
    width: 960, // 30 tiles * 32px
    height: 640, // 20 tiles * 32px
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [HQScene, StairsScene]
};

const game = new Phaser.Game(config);

class HQScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HQScene' });
    }

    preload() {
        this.load.image('tiles', 'assets/tilemap.png');
        this.load.tilemapTiledJSON('hq_map', 'assets/hq_floor1.json');
        // Simple player sprite (replace with your own if needed)
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    }

    create() {
        // Load the tilemap
        const map = this.make.tilemap({ key: 'hq_map' });
        const tileset = map.addTilesetImage('tinytown', 'tiles');
        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0); // Adjust layer name as per your Tiled map

        // Player setup
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);

        // Camera follows player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Collision with map (assuming you have a collision layer in Tiled)
        const collisionLayer = map.getLayer('Collision Layer')?.tilemapLayer; // Adjust layer name
        if (collisionLayer) {
            collisionLayer.setCollisionByExclusion([-1]);
            this.physics.add.collider(this.player, collisionLayer);
        }

        // Transition trigger (e.g., a door at tile position x:28, y:10)
        this.transitionZone = new Phaser.Geom.Rectangle(28 * 32, 10 * 32, 32, 32);
        this.physics.world.enableBody(this.transitionZone);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Player movement
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }

        // Check for transition to StairsScene
        if (Phaser.Geom.Rectangle.ContainsPoint(this.transitionZone, this.player)) {
            this.scene.start('StairsScene', { playerX: 100, playerY: 100 });
        }
    }
}

class StairsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StairsScene' });
    }

    preload() {
        this.load.image('tiles', 'assets/tilemap.png');
        this.load.tilemapTiledJSON('stairs_map', 'assets/stairs.json');
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    }

    create(data) {
        // Load the tilemap
        const map = this.make.tilemap({ key: 'stairs_map' });
        const tileset = map.addTilesetImage('tinytown', 'tiles');
        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0); // Adjust layer name

        // Player setup
        this.player = this.physics.add.sprite(data.playerX || 100, data.playerY || 100, 'player');
        this.player.setCollideWorldBounds(true);

        // Camera follows player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Collision layer
        const collisionLayer = map.getLayer('Collision Layer')?.tilemapLayer; // Adjust layer name
        if (collisionLayer) {
            collisionLayer.setCollisionByExclusion([-1]);
            this.physics.add.collider(this.player, collisionLayer);
        }

        // Transition back to HQScene
        this.transitionZone = new Phaser.Geom.Rectangle(2 * 32, 10 * 32, 32, 32);
        this.physics.world.enableBody(this.transitionZone);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Player movement
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }

        // Check for transition back to HQScene
        if (Phaser.Geom.Rectangle.ContainsPoint(this.transitionZone, this.player)) {
            this.scene.start('HQScene', { playerX: 28 * 32, playerY: 10 * 32 });
        }
    }
}
