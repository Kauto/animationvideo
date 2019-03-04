import Circle from './Circle.mjs';

export default class Callback extends Circle{
    constructor(params) {
        super(params);
        // Callback
		this.callback = params.callback;
    }

    draw(context, additionalParameter) {
		if (this.enabled) {
			this.callback(context, additionalParameter, this);
		}
    }
}