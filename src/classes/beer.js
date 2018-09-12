import { timestamp, randomint, drawImage } from './util.js'
import Grabbable from './grab.js'
import { playsound } from './sound.js'

const STATE = {
    STANDING: 0,
    HELD: 1,
    DRINKING: 2,
    EMPTY: 3,
    FALLING: 4
}

class Beer extends Grabbable {
    constructor(x,y,c) {
        // center grabber, image 14, size is 30x30, 25% overlap
        // hover target
        super(x,y,c, 13, 60, 200, 2.0, 120, 20,  0, 60, 200, 80, 'beers')

        this.state = STATE.STANDING
        this.energy = 100
        this.ts = timestamp()
        this.closeEyes = true
        this.chomp = false

        this.hbx = this.x
        this.hby = this.y
        this.hbw = this.c[13].width
        this.hbh = this.c[13].height
        this.flip = false
    }

    render(c, override) {
        if(this.x > 1366) {
            return
        }
        // render the hitbox
        /*
        c.strokeStyle = 'red';
        c.beginPath();
        c.rect(this.hbx, this.hby, this.hbw, this.hbh);
        c.stroke();*/
        

        let i = 13
        switch(this.state) {
            case STATE.DRINKING:
                i = 14
                break
            case STATE.FALLING:
            case STATE.EMPTY:
                i = 15
                break
        }
        let fx = 0
        if(this.flip) {
            fx = 300
            this.hx = this.x + this.hox + 400
        }

        if(this.isFalling()) {
            //c.drawImage(this.c[i], this.x, this.y)
            drawImage(c, this.c[i], this.x + fx, this.y, this.c[i].width, this.c[i].height, 0, this.flip)
            return
        }

        // don't render it if grabbed, let the grabber render it using override
        if(!this.grabbed || override) {
            drawImage(c, this.c[i], this.x + fx, this.y, this.c[i].width, this.c[i].height, 0, this.flip)
        }
        // render the grabber hitpoint
        /*
        c.fillStyle = 'red'
        c.fillRect(this.gx, this.gy, this.gw, this.gh)

        if(this.isInAction()) {
            c.fillStyle = 'black'
        } else {
            c.fillStyle = 'orange'
        }
        c.fillRect(this.hx, this.hy, this.hw, this.hh)
        */
    }

    update() {
        super.update()

        this.hbx = this.x;
        this.hby = this.y;

        if(this.state === STATE.DRINKING) {
            let t = timestamp()
            if(t >= this.ts) {
                this.ts = timestamp() + 300
                if(this.energy > 0) {
                    this.energy -= 10
                    playsound(randomint(5,6))
                }
            }
        }
        if(this.isFalling() && this.y < 1400) {
            this.y += 20;
        }
        if((this.isFalling() && this.y >= 1400) || 
            (this.state === STATE.STANDING && this.x < -400)) {
            this.reset()
        }
    }

    reset() {
        this.x = 3000 + randomint(200, 300)
        this.y = 317 - 86
        this.state = STATE.STANDING
        this.energy = 100;
        this.ts = timestamp()
        this.grabbed = false
        this.flip = false
        this.sendEaten2()
    }

    isFalling() {
        return this.state === STATE.FALLING
    }

    isInAction() {
        return this.state === STATE.DRINKING
    }

    startAction() {
        if(this.grabbed && this.energy > 0) {
            this.ts = timestamp() + 300
            this.state = STATE.DRINKING
        }
    }

    endAction() {
        if(this.grabbed) {
            if(this.energy > 0) {
                this.state = STATE.HELD
            } else {
                this.state = STATE.EMPTY
            }
        }
    }

    isExhausted() {
        //console.log(this.energy)
        return this.energy <= 0
    }

    releaseAction() {
        this.state = STATE.FALLING
        playsound(7)
    }

    flipIt() {
        this.flip = true
    }
}

export default Beer