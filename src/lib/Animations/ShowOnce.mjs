export default class ShowOnce {

    constructor() {
        this.showOnce = true;
    }

    run(sprite, time) {
        sprite.enabled = sprite.enabled && this.showOnce;
        this.showOnce = false;
        return 0;
    }
}