interface StateConfig {
	enter?: () => void;
	update?: (dt: number) => void;
	exit?: () => void;
}

export class StateMachine {
	private states = new Map<string, StateConfig>();
	private current: StateConfig = {};
	private isBusy: boolean = false;
	private stateQueue: string[] = [];

	constructor(
		private context?: any,
		private name: string = Date.now().toString(16)
	) {
		return this;
	}

	add(name: string, config: StateConfig) {
		this.states.set(name, {
			enter: config.enter?.bind(this.context),
			update: config.update?.bind(this.context),
			exit: config.exit?.bind(this.context),
		});

		return this;
	}

	set(name: string) {
		if (!this.states.has(name)) return this;

		if (this.isBusy) {
			this.stateQueue.push(name);
			console.log(this.stateQueue);
		}

		this.isBusy = true;
		this.current?.exit?.();

		this.current = this.states.get(name);

		this.current?.enter?.();
		this.isBusy = false;

		return this;
	}

	update(dt: number) {
		if (this.stateQueue.length) {
			const nextState = this.stateQueue.shift();

			this.set(nextState);

			return this;
		}

		this.current?.update?.(dt);

		return this;
	}
}
