type TEnabledKey =
	| 'Z'
	| 'X'
	| 'left'
	| 'right'
	| 'down'
	| 'up'
	| 'space'
	| 'shift';

import { StateMachine } from '../utils/StateMachine';

export class Character extends Phaser.Physics.Arcade.Sprite {
	public isOnCooldown: boolean;
	public cooldownUntil: number;
	public dmgHitbox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	public hp: number = 100;
	private stateMachine: StateMachine;
	private debugText: Phaser.GameObjects.Text;
	private isOnGround: boolean;

	constructor(
		scene: Phaser.Scene,
		private keys: Record<TEnabledKey, Phaser.Input.Keyboard.Key>,
		private charName: string
	) {
		super(scene, 100, 200, charName);
		this.isOnCooldown = false;
		this.cooldownUntil = Date.now();
		this.isOnGround = false;

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setScale(4)
			.setGravityY(500)
			.setBounce(0)
			.setCollideWorldBounds(true)
			.setSize(24, 48)
			.play(`${this.charName}-idle`);

		this.debugText = scene.add.text(this.x, this.y, '');
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

		this.stateMachine = new StateMachine(this)
			.add('idle', {
				enter: this.idleEnter,
				update: this.idleUpdate,
			})
			.add('walk', {
				enter: this.walkEnter,
				update: this.walkUpdate,
			})
			.add('jump', {
				enter: this.jumpEnter,
				update: this.jumpUpdate,
			})
			.add('punch', {
				enter: this.punchEnter,
				update: this.punchUpdate,
				exit: this.punchExit,
			})
			.add('damaged', {
				enter: this.damageEnter,
				update: this.damageUpdate,
			})
			.set('idle');
	}

	private idleEnter() {
		this.play(`${this.charName}-idle`);
	}

	private idleUpdate() {
		if (this.keys.left.isDown || this.keys.right.isDown) {
			this.stateMachine.set('walk');
		}

		if (this.keys.Z.isDown) {
			this.stateMachine.set('punch');
			return;
		}

		if (this.keys.up.isDown) this.stateMachine.set('jump');
	}

	private walkEnter() {
		this.play(`${this.charName}-walk`);
	}

	private walkUpdate() {
		switch (true) {
			case this.keys.left.isDown:
				this.flipX = true;
				this.setVelocityX(-300);
				break;
			case this.keys.right.isDown:
				this.flipX = false;
				this.setVelocityX(300);
				break;
			default:
				this.setVelocityX(0);
				this.stateMachine.set('idle');
		}

		if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
			this.stateMachine.set('jump');
		}
	}

	private jumpEnter() {
		this.play(`${this.charName}-jump`);
		this.setVelocityY(-600);
	}

	private jumpUpdate() {
		switch (true) {
			case this.keys.left.isDown:
				this.flipX = true;
				this.setVelocityX(-300);
				break;
			case this.keys.right.isDown:
				this.flipX = false;
				this.setVelocityX(300);
				break;
			default:
				this.setVelocityX(0);
		}

		if (this.body.blocked.down || this.body.touching.down) {
			this.stateMachine.set('idle');
		}
	}

	private setCooldown(seconds: number) {
		this.cooldownUntil = Date.now() + seconds * 1000;
		this.isOnCooldown = true;
	}

	private punchEnter() {
		this.dmgHitbox.setPosition(
			this.x + this.width * 0.8 * (this.flipX ? -1 : 1),
			this.y
		);
		this.play(`${this.charName}-hit`, true);
		this.setCooldown(0.7);
	}

	private punchUpdate() {
		if (this.cooldownUntil < Date.now()) {
			this.stateMachine.set('idle');
		}
	}

	private punchExit() {
		this.dmgHitbox.setPosition(0, 0);
	}

	private damageEnter() {
		this.y += 1;
		this.setVelocityY(-500);
		this.play(`${this.charName}-dmg`);
		this.tint = 0xff0000;
	}

	private damageUpdate(t: number) {
		if (this.isOnGround) {
			this.clearTint();
			this.stateMachine.set('idle');
		}
	}

	public receiveDamage(xPositive: boolean) {
		// if (this.body.blocked.down) {
		this.hp -= 10;
		this.setVelocityX(50 * (xPositive ? 1 : -1));
		this.stateMachine.set('damaged');

		// }
	}

	public update(t: number, dt: number) {
		// if (this.hp <= 0) {
		// 	this.tint = 0x000000;
		// 	this.body.enable = false;
		// }

		this.isOnGround = Math.floor(this.y) === 485;
		this.debugText.setX(this.x);
		this.debugText.text = String(this.isOnGround);
		this.stateMachine.update(dt);
	}
}
