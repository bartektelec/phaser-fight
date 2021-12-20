import { Player } from '../objects/player';
export class MainScene extends Phaser.Scene {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	keys: Record<'Z' | 'X', { isDown: boolean }>;

	constructor() {
		super({ key: 'MainScene' });
	}

	preload(): void {
		['char2', 'char3', 'char4', 'char5'].forEach((charName) => {
			this.load.spritesheet(charName, `sprites/${charName}.png`, {
				frameWidth: 64,
				frameHeight: 64,
				endFrame: 78,
			});
		});
	}

	create(): void {
		this.cursors = this.input.keyboard.createCursorKeys();

		['char2', 'char3', 'char4', 'char5'].forEach((charName) => {
			this.anims.create({
				key: `${charName}-idle`,
				frames: this.anims.generateFrameNumbers(charName, { start: 3, end: 3 }),
			});
			this.anims.create({
				key: `${charName}-walk`,
				frames: this.anims.generateFrameNumbers(charName, {
					frames: [11, 9, 10, 9],
				}),
				frameRate: 5,
				repeat: -1,
			});
			this.anims.create({
				key: `${charName}-jump`,
				frames: this.anims.generateFrameNumbers(charName, {
					frames: [15, 51, 52, 51],
				}),
				frameRate: 8,
				repeat: 0,
			});
			this.anims.create({
				key: `${charName}-hit`,
				frames: this.anims.generateFrameNumbers(charName, {
					frames: [36, 37, 38, 39],
				}),
				frameRate: 8,
				repeat: -1,
			});
		});

		this.keys = this.input.keyboard.addKeys('Z,X') as Record<
			'Z' | 'X',
			{ isDown: boolean }
		>;
		this.player = new Player(this, this.cursors, this.keys, 'char3');
	}

	update(): void {
		this.player.update();
	}
}
