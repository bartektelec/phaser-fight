type TEnabledKey =
	| 'Z'
	| 'X'
	| 'left'
	| 'right'
	| 'down'
	| 'up'
	| 'space'
	| 'shift';

export class Character extends Phaser.Physics.Arcade.Sprite {
	public isOnCooldown: boolean;
	public cooldownUntil: number;
	public dmgHitbox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	public hp: number = 100;

	constructor(
		scene: Phaser.Scene,
		private keys: Record<TEnabledKey, { isDown: boolean }>,
		private charName: string
	) {
		super(scene, 100, 200, charName);
		this.isOnCooldown = false;
		this.cooldownUntil = Date.now();

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setScale(4)
			.setGravityY(500)
			.setCollideWorldBounds(true)
			.setSize(24, 48)
			.play(`${this.charName}-idle`);

		this.dmgHitbox = scene.add.rectangle(
			0,
			0,
			40,
			40,
			0xffffff,
			0.5
		) as unknown as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		scene.physics.add.existing(this.dmgHitbox);
		this.dmgHitbox.body.allowGravity = false;
	}

	private setCooldown(seconds: number) {
		this.cooldownUntil = Date.now() + seconds * 1000;
		this.isOnCooldown = true;
	}

	private doPunch() {
		this.dmgHitbox.setPosition(
			this.x + this.width * 0.8 * (this.flipX ? -1 : 1),
			this.y
		);
		// this.dmgHitbox.x = this.x;
		// this.dmgHitbox.y = this.y;
		this.play(`${this.charName}-hit`, true);
		this.setCooldown(0.7);
	}

	public receiveDamage(xPositive: boolean) {
		// if (this.body.blocked.down) {
		this.play(`${this.charName}-dmg`, true);
		this.tint = 0xff0000;
		this.hp -= 10;
		this.setVelocityY(-400);
		this.setVelocityX(400 * (xPositive ? 1 : -1));

		// }
	}

	public update() {
		if (this.hp <= 0) {
			this.tint = 0x000000;
			this.body.enable = false;
		}

		const isMidair = !this.body.blocked.down;
		this.isOnCooldown = Date.now() < this.cooldownUntil;

		if (!this.isOnCooldown) {
			if (this.keys.left.isDown && !this.body.touching.left) {
				if (!isMidair) this.play(`${this.charName}-walk`, true);
				this.flipX = true;

				this.setVelocityX(-300);
			} else if (this.keys.right.isDown && !this.body.touching.right) {
				if (!isMidair) this.play(`${this.charName}-walk`, true);
				this.flipX = false;
				this.setVelocityX(300);
			} else if (!this.isOnCooldown) {
				if (!isMidair) {
					// this.setVelocityX(0);
					this.play(`${this.charName}-idle`, true);
				}
			}

			if (this.keys.X.isDown && !isMidair) this.doPunch();
		}

		if (this.keys.up.isDown && !isMidair) {
			this.play(`${this.charName}-jump`);
			this.setVelocityY(-600);
		}
	}
}
