import Thing from './thing.js'
import { randomint, drawImage, rad, timestamp } from './util.js';

class Tree extends Thing {
    constructor(x, y, c) {
        super(x, y, c, 17, 153, 564, false, 'trees')

        this.percentage = 0.1
        this.closeEyes = false
        this.chomp = false
        // need to release tree a bit higher
        this.releaseOffset = -140
        this.particles = []
        this.pts = timestamp()
        this.pcount = 25
    }
    sendDead() {
        super.sendEvent(null)
    }
    sendEaten() {
        // do nothing
    }
    sendEaten2() {
        // do nothing
    }
    // can't eat this
    checkHover(px, py, w, h) {
        return false
    }
    reset() {
        super.reset()
        this.x = 1400
        this.y = this.oldy + randomint(0, 40)
        this.particles = []
        this.pcount = 25
    }

    update() {
        super.update()
        if(this.grabbed) {
            this.updateParticles()
        }
    }

    render(c, override) {
        if(this.dead) {
            return
        }

        if(this.isFalling()) {
            //c.drawImage(this.c[this.i], this.x, this.y)
            drawImage(c, this.c[this.i], this.x, this.y, this.w, this.h, 0, this.flip)
            return
        }

        if(!this.grabbed || override) {
            drawImage(c, this.c[this.i], this.x, this.y, this.w, this.h, 0, this.flip)
            if(this.grabbed) {
                this.renderParticles(c)
            }
        }
    }

    renderParticles(c) {
        c.fillStyle = '#520'
        this.particles.forEach(p => {
            if(!p.dead) {
                /*c.fillStyle = '#000'
                c.beginPath();
                c.moveTo(p.x,p.y);
                c.arc(p.x, p.y, p.r + 2, 0, rad(360));
                c.fill();*/
                c.beginPath();
                c.moveTo(p.x,p.y);
                c.arc(p.x, p.y, p.r, 0, rad(360));
                c.fill();
            }
        })
    }

    updateParticles() {
        this.particles.forEach(p => {
            p.y += 6
            if(p.y > 760) {
                p.dead = true
            }
        })
        this.particles = this.particles.filter(p => { return !p.dead })
        if(this.particles.length < 10 && timestamp() > this.pts && this.pcount > 0) {
            this.particles.push({
                x: this.x + this.w / 2 + randomint(-10, 10),
                y: this.y + this.h - 25,
                dead: false,
                r: randomint(5, 25)
            })
            this.pts = timestamp() + 100
            this.pcount -= 1
        }
    }
}

export default Tree