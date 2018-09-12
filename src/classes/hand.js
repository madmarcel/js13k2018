import { overlaps, drawImage } from './util.js'
import Grabber from './grabber.js'

class Hand extends Grabber {
    constructor(x, y, c, flip) {
        // center grabber, image 11, size is 30x30
        super(x,y,c, 2, 30, 30, 0, 20)

        this.imageIndex = 2
        this.w = this.c[2].width
        this.h = this.c[2].height
        this.angle = 90
        this.flip = flip
        if(flip) {
            this.angle = -90
        }

        this.hbx = this.x
        this.hby = this.y
        this.hbw = this.c[2].height
        this.hbh = this.c[2].width

        this.downCount = 0
    }

    render(c) {
        if(this.target) {
            this.target.render(c, true)
        }
        drawImage(c,this.c[2], this.x, this.y, this.w, this.h, this.angle, this.flip)
        // render the grabber hitpoint
        //c.fillStyle = 'blue'
        //c.fillRect(this.gx, this.gy, this.gw, this.gh)

        /*
        c.strokeStyle = 'red'
        c.beginPath()
        c.rect(this.hbx, this.hby, this.hbw, this.hbh)
        c.stroke()
        */
    }

    update(global) {
        super.update()
        this.hbx = this.x + 50
        this.hby = this.y - 50

        if(!this.target) {
            global.grabthese.forEach(g => {
                this.grabThing(g, this.flip)
            })
        }
        if(this.target && this.target.dead) {
            this.target.grabbed = false
            this.target.reset()
            this.target = null
        }
    }

    set(mx,my, multi) {
        if(my > this.y) {
            this.downCount += Math.abs((this.y - my))
        } else {
            this.downCount = 0
        }
        this.downCount *= multi
        this.y = my
        this.x = mx

        this.hbx = this.x + 50
        this.hby = this.y - 50
    }

    move(incX, incY, multi) {
        if(incX !== null) {
            this.x += incX
        }
        if(incY !== null) {
            this.oldy = this.y
            this.y += incY

            if(this.y > this.oldy) {
                this.downCount += Math.abs((this.y - this.oldy))
            } else {
                this.downCount = 0
            }
            // for keyboard controls
            if(multi) {
                this.downCount *= multi
            }
        }
    }

    collideWith(list) {
        for(let i = 0; i < list.length; i++) {
            if(!list[i].grabbed) {
                if(overlaps(this.hbx, this.hby, this.hbw, this.hbh,
                            list[i].hbx, list[i].hby, list[i].hbw, list[i].hbh
                ) > 1.0) {
                    return { 'r': true, 'c': this.downCount, 'o': list[i] }
                }
            }
        }
        return { 'r': false }
    }

    push(list) {
        let result = false
        list.forEach(l => {
            if(l.collide(this.hbx, this.hby, this.hbw, this.hbh)) {
                result = true
            }
        })
        return result
    }
}

export default Hand
