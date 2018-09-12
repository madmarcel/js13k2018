import { playsound } from './sound.js'

// this allows a thing to grab other things
class Grabber {
    constructor(x, y, c, imageindex, grabwidth, grabheight, offsetX, offsetY) {
        this.x = x
        this.y = y
        this.c = c

        this.target = null

        let i = this.c[imageindex]

        this.iw = Math.floor(i.width / 2) + offsetX
        this.ih = Math.floor(i.height / 2) + offsetY
        this.oX = Math.floor(this.iw - grabwidth / 2)
        this.oY = Math.floor(this.ih - grabheight / 2)
        
        this.gx = this.x + this.oX
        this.gy = this.y + this.oY
        this.gw = grabwidth
        this.gh = grabheight
    }

    update() {
        if(this.x < -100) {
            this.x = -100;
        }
        if(this.x > 1200) {
            this.x = 1200;
        }
        if(this.y < -100) {
            this.y = -100;
        }
        if(this.y > 650) {
            this.y = 650;
        }

        // update the grab offset
        this.gx = this.x + this.oX
        this.gy = this.y + this.oY
        this.moveGrab()
    }

    grabThing(target, flip) {
        if(!this.target) {
            if(target.checkGrab(this.gx, this.gy, this.gw, this.gh)) {
                playsound(0)
                this.target = target
                if(!flip) {
                    this.target.flipIt()
                }
            }
        }
    }

    moveGrab() {
        if(this.target) {
            this.target.moveGrab(this.gx, this.gy)

            let offset = 80
            if(this.target.releaseOffset) {
                offset = this.target.releaseOffset
            }

            if((this.target.isExhausted() || this.target.canBeChucked()) && this.target.gy < offset) {
                this.target.releaseAction()
                this.target = null
            }
        }
    }
}

export default Grabber