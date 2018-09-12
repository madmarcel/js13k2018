class State {
    constructor(c, imgs) {
        this.config = c
        this.imgs = imgs
    }

    init() {}

    render() {}

    update() {}

    finish() {}

    next(name){
        const e = new CustomEvent('ns', { detail: { 'n': name, 'c': this.config, 'i': this.imgs }})
        window.dispatchEvent(e)
    }

    processClick(mx, my) {
        mx = Math.floor(mx)
        my = Math.floor(my)
        this.handleClick(mx, my)
    }

    processMove(mx, my, c) {
        mx = Math.floor(mx)
        my = Math.floor(my)
        this.handleMove(mx, my, c)
    }

    handleMove(mx, my, c) {}

    handleClick(mx, my) {}
}

export default State
