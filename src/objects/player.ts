export class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(
		scene: Phaser.Scene,
		private cursors: Phaser.Types.Input.Keyboard.CursorKeys,
		private keys: Record<'Z' | 'X', { isDown: boolean }>,
		private charName: string
	) {
		super(scene, 0, 200, charName);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setScale(4)
			.setGravityY(500)
			.setCollideWorldBounds(true)
			.setSize(32, 48)
			.play(`${this.charName}-idle`);
	}

	public update() {
		const isMidair = !this.body.blocked.down;

		if (this.cursors.left.isDown) {
			if (!isMidair) this.play(`${this.charName}-walk`, true);
			this.flipX = true;

			this.setVelocityX(-300);
		} else if (this.cursors.right.isDown) {
			if (!isMidair) this.play(`${this.charName}-walk`, true);
			this.flipX = false;
			this.setVelocityX(300);
		} else if (this.keys.X.isDown && !isMidair) {
			this.setVelocity(0);
			this.play(`${this.charName}-hit`, true);
		} else {
			this.setVelocityX(0);
			if (!isMidair) this.play(`${this.charName}-idle`, true);
		}

		if (this.cursors.up.isDown && !isMidair) {
			this.play(`${this.charName}-jump`);
			this.setVelocityY(-500);
		}
	}
}
