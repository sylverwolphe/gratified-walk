class HQScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HQScene' });
    }

    preload() {
        console.log('Starting preload...');
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
        console.log('Player sprite loaded');
    }

    create() {
        console.log('=== CREATE METHOD STARTING ===');
        
        // Create a simple colored background instead of tilemap for now
        this.add.rectangle(240, 160, 480, 320, 0x228b22); // Green background
        
        // Create player sprite
        this.player = this.physics.add.sprite(240, 160, 'player');
        this.player.setCollideWorldBounds(true);
        
        console.log('Player created:', this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
        
        console.log('Scene setup complete');
    }

    update() {
        if (!this.player) return;
        
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
    }
}

const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [HQScene]
};

const game = new Phaser.Game(config);
