class HQScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HQScene' });
    }

    preload() {
        console.log('Starting preload...');
        
        this.load.image('tiles', '/assets/tilemap.png');
        console.log('Tilemap image loaded');
        
        this.load.tilemapTiledJSON('hq_map', '/assets/hq_floor1.json');
        console.log('HQ map JSON loaded');
        
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
        console.log('Player sprite loaded');
        
        // Add error handling
        this.load.on('loaderror', function (file) {
            console.error('Error loading file:', file.src);
        });
    }

    create() {
        console.log('=== CREATE METHOD STARTING ===');
        
        // Check if the map data loaded properly
        const mapData = this.cache.tilemap.get('hq_map');
        console.log('Raw map data from cache:', mapData);
        console.log('Map data keys:', Object.keys(mapData.data));
        console.log('Map data structure:', JSON.stringify(mapData.data, null, 2));
        
        if (!mapData) {
            console.error('No map data found for hq_map!');
            return;
        }
        
        try {
            console.log('About to create tilemap...');
            const map = this.make.tilemap({ key: 'hq_map' });
            console.log('Map object created successfully:', map);
        } catch (error) {
            console.error('Error creating tilemap:', error);
            console.error('Error stack:', error.stack);
            return;
        }

        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const collisionLayer = map.getLayer('Walls')?.tilemapLayer;
        if (collisionLayer) {
            collisionLayer.setCollisionByExclusion([-1]); // Collide with all non-empty tiles in Walls
            this.physics.add.collider(this.player, collisionLayer);
        }

        this.transitionZone = new Phaser.Geom.Rectangle(22 * 16, 2 * 16, 16, 16); // Adjusted for door at (22,2)
        this.physics.world.enableBody(this.transitionZone);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
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
        this.load.image('tiles', '/assets/tilemap.png');
        this.load.tilemapTiledJSON('stairs_map', '/assets/stairs.json');
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    }

    create(data) {
        const map = this.make.tilemap({ key: 'stairs_map' });
        const tileset = map.addTilesetImage('tinytown', 'tiles');
        const groundLayer = map.createLayer('Ground', tileset, 0, 0);
        const wallsLayer = map.createLayer('Walls', tileset, 0, 0);
        const objectsLayer = map.createLayer('Objects', tileset, 0, 0);

        this.player = this.physics.add.sprite(data.playerX || 100, data.playerY || 100, 'player');
        this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const collisionLayer = map.getLayer('Walls')?.tilemapLayer;
        if (collisionLayer) {
            collisionLayer.setCollisionByExclusion([-1]);
            this.physics.add.collider(this.player, collisionLayer);
        }

        this.transitionZone = new Phaser.Geom.Rectangle(2 * 16, 10 * 16, 16, 16);
        this.physics.world.enableBody(this.transitionZone);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
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

        if (Phaser.Geom.Rectangle.ContainsPoint(this.transitionZone, this.player)) {
            this.scene.start('HQScene', { playerX: 22 * 16, playerY: 2 * 16 });
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 480, // 30 tiles * 16px
    height: 320, // 20 tiles * 16px
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
