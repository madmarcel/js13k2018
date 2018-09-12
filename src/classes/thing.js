import { timestamp, randomint, drawImage } from './util.js'
import Grabbable from './grab.js'
import { playsound } from './sound.js'

const STATE = {
    STANDING: 0,
    HELD: 1,
    EATED: 2,
    EMPTY: 3,
    FALLING: 4
}

// a generic thing you can grab, eat and smash
class Thing extends Grabbable {
    constructor(x, y, c, index, w, h, flip, name) {
        super(x,y,c, index, w - 20, h - 20, 2.0, 10, 10, 10, 10, w - 20, h - 20, name)

        this.oldy = y
        this.i = index

        this.state = STATE.STANDING
        this.energy = 100
        this.ts = timestamp()
        this.closeEyes = true
        this.chomp = true

        this.flip = flip
        this.w = w
        this.h = h

        this.hbx = this.x
        this.hby = this.y
        this.hbw = this.c[index].width
        this.hbh = this.c[index].height

        // aternative colour versions
        this.alts = []
    }

    changeCostume() {
        if(this.alts.length > 0) {
            this.i = this.alts[randomint(0, this.alts.length - 1)]
        }
    }

    drawWheels(c) {
        if(this.i >= 30 && this.i <= 33) {
            let o = 0
            if(this.flip) {
                o = 22
            }
            // and the wheels
            // front
            drawImage(c, this.c[20], this.x + 131 + o, this.y + 78, 44, 44, 0)
            // back
            drawImage(c, this.c[20], this.x + 23 + o, this.y + 78, 44, 44, 0)
        }
    }

    render(c, override) {
        if(this.dead) {
            return
        }

        if(this.isFalling()) {
            //c.drawImage(this.c[this.i], this.x, this.y)
            drawImage(c, this.c[this.i], this.x, this.y, this.w, this.h, 0, this.flip)
            this.drawWheels(c)
            return
        }

        if(!this.grabbed || override) {
            drawImage(c, this.c[this.i], this.x, this.y, this.w, this.h, 0, this.flip)
            this.drawWheels(c)
        }

        /*
        c.strokeStyle = 'red'
        c.beginPath()
        c.rect(this.hbx, this.hby, this.hbw, this.hbh);
        c.stroke()

        c.strokeStyle = 'black'
        c.beginPath()
        c.rect(this.gx, this.gy, this.gw, this.gh)
        c.stroke()
        */
    }

    reset() {
        this.x = 1500 + randomint(0, 800)
        this.y = this.oldy
        this.dead = false
        this.state = STATE.STANDING
        this.grabbed = false
        this.energy = 100
        this.ts = timestamp()
        this.flip = !this.flip
        this.changeCostume()
        this.busy = false
    }

    update() {

        if(this.x < -200 || this.dead) {
            this.sendDead()
            this.reset()
        }

        super.update()
        this.hbx = this.x
        this.hby = this.y

        if(this.state === STATE.EATED) {
            let t = timestamp()
            if(t >= this.ts) {
                this.ts = timestamp() + 300
                if(this.energy > 0) {
                    this.energy = 0
                    playsound(5)
                }
            }
        }
        if(this.isFalling() && this.y < 1400) {
            this.y += 20;
        }
        if((this.isFalling() && this.y >= 800) || 
            (this.state === STATE.STANDING && this.x < -400)) {
            this.dead = true
        }

        if(this.state === STATE.EMPTY) {
            this.dead = true
        }
    }

    isFalling() {
        return this.state === STATE.FALLING
    }

    isInAction() {
        return this.state === STATE.EATED
    }

    startAction() {
        if(this.grabbed && this.energy > 0) {
            this.ts = timestamp() + 300
            this.state = STATE.EATED
        }
    }

    endAction() {
        if(this.grabbed) {
            if(this.energy > 0) {
                this.state = STATE.HELD
            } else {
                this.state = STATE.EMPTY
                this.sendEaten()
            }
        }
    }

    isExhausted() {
        //console.log(this.energy)
        return this.energy <= 0
    }

    canBeChucked() {
        return true
    }

    releaseAction() {
        this.energy = 0
        this.grabbed = true
        this.state = STATE.FALLING
        playsound(7)
        this.busy = false
    }

    chompIt() {
        this.busy = true
    }
}

export default Thing