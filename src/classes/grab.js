import { overlaps } from './util.js'

// this allows a thing to be grabbed and also triggers when held over a hoverpoint
class Grabbable {
    constructor(x, y, c, imageindex, grabwidth, grabheight, percentage, offsetX, offsetY, hoverX, hoverY, hoverWidth, hoverHeight, name) {
        this.x = x
        this.y = y
        this.c = c
        this.percentage = percentage

        this.grabbed = false

        let i = this.c[imageindex]

        this.iw = Math.floor(i.width / 2) + offsetX
        this.ih = Math.floor(i.height / 2) + offsetY
        this.oX = Math.floor(this.iw - grabwidth / 2)
        this.oY = Math.floor(this.ih - grabheight / 2)
        
        this.gx = this.x + this.oX
        this.gy = this.y + this.oY
        this.gw = grabwidth
        this.gh = grabheight

        // hover target is just a box
        this.hox = hoverX
        this.hoy = hoverY
        this.hx = this.x + this.hox
        this.hy = this.y + this.hoy
        this.hw = hoverWidth
        this.hh = hoverHeight

        this.dead = false
        this.name = name
    }

    update() {
        // update the grab offset
        this.gx = this.x + this.oX
        this.gy = this.y + this.oY
        this.hx = this.x + this.hox
        this.hy = this.y + this.hoy
    }

    checkGrab(px, py, w, h) {
        if(!this.grabbed && !this.dead) {
            let p = overlaps(px, py, w, h, this.gx, this.gy, this.gw, this.gh)
            if(p >= this.percentage) {
                this.grabbed = true
                return true
            }
        }
        return false
    }

    moveGrab(cx, cy) {
        // center the grabbed item on the provided point
        if(this.grabbed) {
            this.x = cx - this.iw
            this.y = cy - this.ih
            this.gx = this.x + this.oX
            this.gy = this.y + this.oY
            this.hx = this.x + this.hox
            this.hy = this.y + this.hoy
        }
    }

    checkHover(px, py, w, h) {
        if(this.grabbed) {
            let p = overlaps(px, py, w, h, this.hx, this.hy, this.hw, this.hh)
            if(p >= this.percentage) {
                return true
            }
        }
        return false
    }

    isExhausted() {
        return false
    }

    canBeChucked() {
        return false
    }

    isInAction() {
        return false
    }

    startAction() {
    }

    endAction() {
    }

    releaseAction() {
    }

    flipIt() {
        
    }

    sendDead() {
        this.sendEvent('d')
    }

    sendEvent(t) {
        const e = new CustomEvent('s', { detail: { 'n': this.name, 't': t}})
        window.dispatchEvent(e)
    }
    sendEaten() {
        this.sendEvent('e')
    }
    sendEaten2() {
        this.sendEvent(null)
    }
}

export default Grabbable