import { Redhat } from '../objects/redhat';

let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
export class MainScene extends Phaser.Scene {
	private myRedhat: Redhat;

	constructor() {
		super({ key: 'MainScene' });
	}

	preload(): void {
		this.load.spritesheet('char3', 'sprites/Char_3.png', {
			frameWidth: 64,
			frameHeight: 64,
			endFrame: 78,
		});
	}

	create(): void {
		cursors = this.input.keyboard.createCursorKeys();
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('char3', { start: 3, end: 3 }),
		});
		this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('char3', {
				frames: [11, 9, 10, 9],
			}),
			frameRate: 5,
			repeat: -1,
		});
		this.anims.create({
			key: 'jump',
			frames: this.anims.generateFrameNumbers('char3', {
				frames: [15, 51, 52, 51],
			}),
			frameRate: 8,
			repeat: 0,
		});

		player = this.physics.add
			.sprite(100, 600, 'char3')
			.setScale(4)
			.setGravityY(500)
			.setCollideWorldBounds(true)
			.play('jump');

		this.physics.world.enable(player);
	}

	update(): void {
		const isMidair = player.body.y !== 344;
		if (cursors.left.isDown) {
			if (player.anims.currentAnim.key !== 'walk' && !isMidair)
				player.play('walk');
			player.setVelocityX(-300);
		} else if (cursors.right.isDown) {
			if (player.anims.currentAnim.key !== 'walk' && !isMidair)
				player.play('walk');
			player.setVelocityX(300);
		} else {
			player.setVelocityX(0);
			if (!isMidair) player.play('idle');
		}

		if (cursors.up.isDown && !isMidair) {
			player.play('jump');
			player.setVelocityY(-500);
		}
	}
}
