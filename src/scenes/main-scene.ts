import { Character } from '../objects/character';
export class MainScene extends Phaser.Scene {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	player: Character;
	enemy: Character;
	keys: Record<'Z' | 'X', Phaser.Input.Keyboard.Key>;
	enemyHp: Phaser.GameObjects.Text;
	playerHp: Phaser.GameObjects.Text;
	floor: Phaser.GameObjects.Rectangle;

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
				repeat: 0,
			});
			this.anims.create({
				key: `${charName}-dmg`,
				frames: this.anims.generateFrameNumbers(charName, {
					frames: [57, 59],
				}),
				frameRate: 8,
				repeat: 0,
			});
		});

		this.keys = this.input.keyboard.addKeys('Z,X') as Record<
			'Z' | 'X',
			Phaser.Input.Keyboard.Key
		>;
		this.player = new Character(
			this,
			{ ...this.cursors, ...this.keys },
			'char3'
		);

		const defKey: Phaser.Input.Keyboard.Key = { isDown: false };

		this.enemy = new Character(
			this,
			{ ...this.cursors, ...this.keys },
			'char4'
		);

		this.enemy.setPosition(300, 300);
		this.physics.add.collider(this.player, this.enemy, () => {
			// this.player.setVelocityX(0);
			// this.enemy.setVelocityX(0);
		});

		this.floor = this.add.rectangle(400, 591, 800, 20, 0x00ffff);
		this.physics.add.existing(this.floor, true);
		this.physics.add.collider(this.floor, this.player);
		this.physics.add.collider(this.floor, this.enemy);

		this.physics.add.overlap(this.player.dmgHitbox, this.enemy, () => {
			this.player.dmgHitbox.body.enable = true;
			this.enemy.receiveDamage(!this.player.flipX);

			this.player.dmgHitbox.setPosition(0, 0);
		});

		this.enemyHp = this.add.text(600, 0, String(this.enemy.hp));
		this.playerHp = this.add.text(200, 0, String(this.player.hp));
		// this.physics.add.collider(
		// 	this.player.dmgHitbox,
		// 	this.enemy,
		// 	(one, two) => {
		// 		console.log(this.player.isOnCooldown);
		// 		this.player.setVelocityX(0);
		// 		this.enemy.setVelocityX(0);
		// 	},
		// 	null,
		// 	this
		// );
	}

	update(t: number, dt: number): void {
		this.player.update(t, dt);
		this.enemy.update(t, dt);

		this.enemyHp.text = String(this.enemy.hp);
		this.playerHp.text = String(this.player.hp);
	}
}
