export class Player extends Phaser.Physics.Arcade.Sprite {
	isOnCooldown: boolean;
	cooldownUntil: number;

	constructor(
		scene: Phaser.Scene,
		private cursors: Phaser.Types.Input.Keyboard.CursorKeys,
		private keys: Record<'Z' | 'X', { isDown: boolean }>,
		private charName: string
	) {
		super(scene, 0, 200, charName);
		this.isOnCooldown = false;
		this.cooldownUntil = Date.now();

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setScale(4)
			.setGravityY(500)
			.setCollideWorldBounds(true)
			.setSize(24, 48)
			.play(`${this.charName}-idle`);
	}

	private setCooldown(seconds: number) {
		this.cooldownUntil = Date.now() + seconds * 1000;
		this.isOnCooldown = true;
	}

	private doPunch() {
		this.setVelocity(0);
		this.play(`${this.charName}-hit`, true);
		this.setCooldown(0.7);
	}

	public update() {
		const isMidair = !this.body.blocked.down;
		this.isOnCooldown = Date.now() < this.cooldownUntil;

		if (!this.isOnCooldown) {
			if (this.cursors.left.isDown) {
				if (!isMidair) this.play(`${this.charName}-walk`, true);
				this.flipX = true;

				this.setVelocityX(-300);
			} else if (this.cursors.right.isDown) {
				if (!isMidair) this.play(`${this.charName}-walk`, true);
				this.flipX = false;
				this.setVelocityX(300);
			} else if (!this.isOnCooldown) {
				this.setVelocityX(0);
				if (!isMidair) this.play(`${this.charName}-idle`, true);
			}

			if (this.keys.X.isDown && !isMidair) this.doPunch();
		}

		if (this.cursors.up.isDown && !isMidair) {
			this.play(`${this.charName}-jump`);
			this.setVelocityY(-600);
		}
	}
}
