import { Character } from '../objects/character';

const MAX_HP_WIDTH = 300;

export class MainScene extends Phaser.Scene {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	player: Character;
	enemy: Character;
	keys: Record<'Z' | 'X', Phaser.Input.Keyboard.Key>;
	enemyHp: Phaser.GameObjects.Rectangle;
	playerHp: Phaser.GameObjects.Rectangle;
	floor: Phaser.GameObjects.Rectangle;
	text: Phaser.GameObjects.Text;

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

		this.load.spritesheet('punch-effect', 'sprites/effect1.png', {
			frameWidth: 64,
			frameHeight: 32,
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

			this.anims.create({
				key: 'punch-anim',
				frames: this.anims.generateFrameNumbers('punch-effect', {
					frames: [1, 2, 3, 4, 5],
				}),
				frameRate: 6,
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

		this.physics.add.overlap(this.enemy.dmgHitbox, this.player, () => {
			this.enemy.dmgHitbox.body.enable = true;
			this.player.receiveDamage(!this.enemy.flipX);

			this.enemy.dmgHitbox.setPosition(0, 0);
		});

		this.enemyHp = this.add.rectangle(
			600,
			0,
			(this.enemy.hp / 100) * MAX_HP_WIDTH,
			20,
			0xff0000
		);
		this.playerHp = this.add.rectangle(
			200,
			0,
			(this.player.hp / 100) * MAX_HP_WIDTH,
			20,
			0xff0000
		);

		this.text = this.add.text(400, 200, '', {
			fontFamily: 'sans-serif',
			fontSize: '72px',
		});
	}

	update(t: number, dt: number): void {
		this.player.update(t, dt);
		this.enemy.update(t, dt);

		if (this.player.hp <= 0) {
			this.text.text = 'Player lose';
		} else if (this.enemy.hp <= 0) {
			this.text.text = 'Enemy lose';
		}
		this.text.x = 400 - this.text.width / 2;

		this.playerHp.width = (this.player.hp / 100) * MAX_HP_WIDTH;
		this.enemyHp.width = (this.enemy.hp / 100) * MAX_HP_WIDTH;
		this.enemyHp.x = 600 + MAX_HP_WIDTH - this.enemyHp.width;
	}
}
