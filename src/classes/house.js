import { randomint, drawImage } from './util.js'

class House {
    constructor(x, y, config) {
        this.x = x
        this.y = y
        this.oldy = y
        this.c = config

        this.hbx = this.x
        this.hby = this.y
        this.hbw = this.c[22].width
        this.hbh = this.c[22].height
        
        this.miny = this.y + 270
        this.grabbed = false
        this.bashed = false

        this.alts = [ 22, 36, 37 ]
        this.i = 22
        this.flip = false
        this.changeCostume()
    }

    changeCostume() {
        if(this.alts.length > 0) {
            this.i = this.alts[randomint(0, this.alts.length - 1)]
        }
    }

    render(c) {
        // draw the house
        drawImage(c, this.c[this.i], this.x, this.y, this.hbw, this.hbh, 0, this.flip)

        // render the hitbox
        
        /* c.strokeStyle = 'red'
        c.beginPath()
        c.rect(this.hbx, this.hby, this.hbw, this.hbh)
        c.stroke() */
    }

    reset() {
        this.x = 1500 + randomint(0, 1000)
        this.y = this.oldy
        this.bashed = false
        this.changeCostume()
        this.flip = !this.flip
        const e = new CustomEvent('s', { detail: { 'n': 'houses' }})
        window.dispatchEvent(e)
    }

    update() {
        this.hbx = this.x
        this.hby = this.y

        if(this.x < -400) {
            this.reset()
        }

        if(this.y >= this.miny - 45 && this.y < this.miny - 4) {
            this.y++
        }
    }

    bash(power) {
        this.y += Math.ceil(power * 0.1)
        if(this.y > this.miny) {
            this.y = this.miny
        }
    }
}

export default House