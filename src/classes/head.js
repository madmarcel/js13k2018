import { drawImage, timestamp } from './util.js'
import { playsound } from './sound.js';

class Head {
    constructor(x,y,c) {
        this.x = x
        this.y = y
        this.c = c

        this.busy = false
        this.eyesclosed = false

        this.eyes = {
            x: this.x + 128,
            y: this.y + 187,
            moving: true,
            tx: this.x + 118,
            ty: this.y + 197,
            timer: timestamp()
        }

        this.bob = 0
        this.inc = 1
        this.count = 0
        
        this.chomping = false
        this.chompInc = 2
        this.chompOffset = 0
    }

    render(c) {
        // open mouth
        c.drawImage(this.c[12], this.x + 71, this.y + 245 + this.bob + this.chompOffset)
        // top teeth
        c.drawImage(this.c[29], this.x + 181, this.y + 335 + this.bob)
        // head
        c.drawImage(this.c[4], this.x, this.y + this.bob)

        // hide mouth
        if(!this.chomping) {
            c.fillStyle = '#ffd5d5'
            c.fillRect(this.x + 120, this.y + 345 + this.bob, 220, 60)
        }

        // eyes
        if(!this.eyesclosed) {
            // left
            c.drawImage(this.c[0], this.x + 108, this.y + 167 + this.bob)
            // pupil
            c.drawImage(this.c[8], this.eyes.x, this.eyes.y + this.bob)
        } else {
            drawImage(c, this.c[1], this.x + 108, this.y + 167 + this.bob, this.c[1].height, this.c[1].width, 0, true)
        }
        if(!this.eyesclosed) {
            // right
            c.drawImage(this.c[0], this.x + 258, this.y + 167 + this.bob)
            // pupil
            c.drawImage(this.c[8], this.eyes.x + 150, this.eyes.y + this.bob)
        } else {
            c.drawImage(this.c[1], this.x + 258, this.y + 167 + this.bob)
        }
        // nose
        c.drawImage(this.c[3], this.x + 150, this.y + 217 + this.bob)
        // mouth
        if(!this.chomping) {
            c.drawImage(this.c[9], this.x + 125, this.y + 360 + this.bob)
        }
        // hair
        // left
        c.drawImage(this.c[7], this.x + 53, this.y + 81 + this.bob)
        // right
        c.drawImage(this.c[7], this.x + 363, this.y + 81 + this.bob)
        // eyebrows
        // left
        c.drawImage(this.c[6], this.x + 100, this.y + 100 + this.bob)
        // right
        c.drawImage(this.c[6], this.x + 255, this.y + 100 + this.bob)

        /*
        c.strokeStyle = 'blue'
        c.beginPath()
        c.rect(this.x + 125, this.y + 355 + this.bob, 220, 65)
        c.stroke()*/
    }

    update(grabthese) {
        grabthese.forEach(g => {
            if(this.checkHover(g)) {
                if(!g.isExhausted()) {
                    if(!g.isInAction()) {
                        g.startAction()
                    }
                    if(g.chomp && !g.busy) {
                        g.chompIt()
                        playsound(8)
                        this.chomping = true
                    }
                    this.busy = true
                    if(g.closeEyes) {
                        this.closeEyes()
                    }
                } else {
                    if(g.isInAction()) {
                        g.endAction()
                    }
                    this.chomping = false
                    this.chompOffset = 0
                    this.busy = false
                    if(g.closeEyes) {
                        this.openEyes()
                    }
                }
            } else {
                if(g.isInAction()) {
                    g.endAction()
                }
                this.busy = false
                this.openEyes()
            }
        })
        if(!this.eyesclosed) {
            this.updateEyes()
        }

        if(this.count > 8) {
            this.count = 0
            this.bob += this.inc
            if(this.bob > 5 || this.bob < -5) {
                this.inc *= -1
            }
        }
        this.count++

        if(this.chomping) {
            this.chompOffset += this.chompInc
        }
        if(this.chompOffset > 50 || this.chompOffset < -20) {
            this.chompInc *= -1
        }
    }

    checkHover(g) {
        return g.checkHover(this.x + 125, this.y + 355 + this.bob, 220, 65)
    }

    closeEyes() {
        this.eyesclosed = true
    }

    openEyes() {
        this.eyesclosed = false
    }

    updateEyes() {
        let now = timestamp()
        if ( this.eyes.moving ) {

            if ( this.eyes.x < this.eyes.tx ) {
                this.eyes.x++;
            }
            if ( this.eyes.x > this.eyes.tx ) {
                this.eyes.x--;
            }
            if ( this.eyes.y < this.eyes.ty ) {
                this.eyes.y++;
            }
            if ( this.eyes.y > this.eyes.ty ) {
                this.eyes.y--;
            }
            if ( this.eyes.x === this.eyes.tx && this.eyes.y === this.eyes.ty ) {
                this.eyes.moving = false;
            }
        } else {
            if ( now - this.eyes.timer > 2000) {
                const radius = 14;
                const angle = Math.random() * Math.PI * 2;
                const nx = Math.floor(Math.cos(angle) * radius);
                const ny = Math.floor(Math.sin(angle) * radius);

                this.eyes.tx = this.x + nx + 128;
                this.eyes.ty = this.y + ny + 187;

                this.eyes.moving = true;
                this.eyes.timer = timestamp()
            }
        }
    }
}

export default Head