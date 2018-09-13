import Grabbable from "./grab"
import { timestamp, drawImage, randomint } from "./util"

const STATE = {
    STANDING: 0,
    FULL: 1,
    HALF: 2,
    BITLEFT: 3,
    DONE: 4
}

class Sausage extends Grabbable{
    constructor(x, y, c) {
        super(x,y,c, 28, 60, 200, 2.0, 50, 20,  30, 30, 140, 110, 'sausages')

        this.state = STATE.STANDING
        this.closeEyes = false
        this.chomp = true
        
        this.hbx = this.x
        this.hby = this.y
        this.hbw = this.c[28].width
        this.hbh = this.c[28].height

        this.busy = false
        this.ts = timestamp()
        this.flip = false
        this.doReset = false
    }

    render(c, override) {
        /*if(this.x > 1366 || this.state === STATE.DONE) {
            return
        }*/
        // render the hitbox
        
        /*c.strokeStyle = 'red'
        c.beginPath()
        c.rect(this.hbx, this.hby, this.hbw, this.hbh)
        c.stroke()*/
        
        let i = 28
        let rot = 0
        let fx = 0
        
        switch(this.state) {
            case STATE.HALF:
                i = 27
                break
            case STATE.BITLEFT:
                i = 26
                rot = 20
                break
        }
        if(this.flip) {
            // shift the sprite, last piece rotation and the hover hitbox
            fx = 150
            this.hx = this.x + this.hox + 150
            rot *= -1
        }

        // don't render it if grabbed, let the grabber render it using override
        if(!this.grabbed || override) {
            drawImage(c, this.c[i], this.x + fx, this.y, this.c[i].width, this.c[i].height, rot, this.flip)
        }

        // render the grabber hitpoint
        
        /*c.fillStyle = 'red'
        c.fillRect(this.gx, this.gy, this.gw, this.gh)
        
        // hover point
        c.fillStyle = 'orange'
        c.fillRect(this.hx, this.hy, this.hw, this.hh)
        */
    }

    update() {
        super.update()
        this.hbx = this.x
        this.hby = this.y

        if(timestamp() > this.ts) {
            this.busy = false
        }
        if(this.isExhausted()) {
            this.reset()
        }
    }

    reset() {
        if(this.doReset) {
            this.x = 2300 + randomint(200, 300)
            this.y = 317 - 86
            this.hbx = this.x
            this.hby = this.y
            this.state = STATE.STANDING
            this.dead = false
            this.busy = false
            this.flip = false
        } else {
            this.sendEaten2()
            this.x = -400
            this.dead = true
        }
    }

    isInAction() {
        return this.state !== STATE.STANDING
    }

    startAction() {
        if(this.grabbed) {
            if(this.state === STATE.STANDING) {
                this.state = STATE.FULL
            }
        }
    }

    isExhausted() {
        return this.state === STATE.DONE
    }

    releaseAction() {
        this.state = STATE.DONE
    }

    chompIt() {
        this.busy = true
        switch(this.state) {
            case STATE.FULL:
                this.state = STATE.HALF
            break
            case STATE.HALF:
                this.state = STATE.BITLEFT
            break
            case STATE.BITLEFT:
                this.state = STATE.DONE
                this.dead = true
            break
        }
        this.ts = timestamp() + 500
    }

    flipIt() {
        this.flip = true
    }
}

export default Sausage