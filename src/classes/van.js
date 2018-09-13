import { playsound } from './sound.js'
import { drawImage, overlaps, rad, timestamp } from './util.js'

class Van {
    constructor(x, y, config) {
        this.x = x
        this.y = y
        this.c = config

        this.ismoving = true
        this.hasbeeped = false
        this.gameover = false

        this.rot = 0
        this.bob = 0
        this.inc = 1
        this.count = 0
        this.rotinc = 2

        this.hbx = this.x + this.c[19].width - 30
        this.hby = this.y
        this.hbw = 30
        this.hbh = this.c[13].height

        this.showclock = false
        this.cend = 0
        this.ccols = [ '#0f0', '#fff62c','#ffa500', '#f00', '#000']
        this.cindex = 0
        this.cinc = 1
        this.tinc = Math.floor(5000 / 360)
        this.cts = timestamp()
    }

    drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX,centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    }

    render(c) {
        // draw the van
        c.drawImage(this.c[19], this.x, this.y - this.bob)
        // and the wheels
        // front
        drawImage(c, this.c[20], this.x + 131, this.y + 78, 44, 44, this.rot)
        // back
        drawImage(c, this.c[20], this.x + 23, this.y + 78, 44, 44, this.rot)

        // render the hitbox
        /*c.strokeStyle = this.ccol
        c.beginPath()
        c.rect(this.hbx, this.hby, this.hbw, this.hbh)
        c.stroke()*/

        if(this.showclock) {
            c.drawImage(this.c[0], this.x + 50, this.y - 100)
            this.drawPieSlice(c, this.x + 91, this.y - 100 + 41, 37, rad(- 90), rad(this.cend - 90), this.ccols[this.cindex])
        }
        
    }

    startClock() {
        if(!this.showclock) {
            this.cend = 0
            this.showclock = true
            this.cindex = 0
            this.cts = timestamp() + this.tinc
        }
    }

    stopClock() {
        this.showclock = false
    }

    update() {
        // bob up and down
        
        if(this.count > 3) {
            this.count = 0
            this.bob += this.inc
            if(this.bob > 1 || this.bob < 0) {
                this.inc *= -1
            }
            /*if(this.bob < 0) {
                this.inc = 1
            }*/
        }
        this.count++

        // wheels rotate if we're moving
        if(this.ismoving) {
            this.rot -= this.rotinc
            if(this.rot < -360) {
                this.rot = 0
            }
        }

        if(!this.ismoving) {
            // increment the clock
            if(timestamp() > this.cts) {
                this.cend += this.cinc
                this.cts = timestamp() + this.tinc
                
                if(this.cend > 180 && this.cend <= 270) {
                    if(this.cindex < 1) {
                        this.hasbeeped = false
                        this.beep()
                    }
                    this.cindex = 1
                }

                if(this.cend > 270 && this.cend <= 315) {
                    if(this.cindex < 2) {
                        this.hasbeeped = false
                        this.beep()
                    }
                    this.cindex = 2
                }
                if(this.cend > 315) {
                    if(this.cindex < 3) {
                        this.hasbeeped = false
                        this.beep()
                    }
                    this.cindex = 3
                }

                if(this.cend >= 360) {
                    if(this.cindex < 4) {
                        playsound(2)
                        this.gameover = true
                    }
                    this.cindex = 4
                }
                
                if(this.cend <= 180) {
                    this.cindex = 0
                }

            }
        }
    }

    collideWith(list) {
        for(let i = 0; i < list.length; i++) {
            if(!list[i].grabbed) {
                //if(list[i].name) {
                    //console.log('Checking ' + list[i].name)
                    
                    //console.log(this.hbx, this.hby, this.hbw, this.hbh)
                    //console.log(list[i].hbx, list[i].hby, list[i].hbw, list[i].hbh)

                    //let r = overlaps(this.hbx, this.hby, this.hbw, this.hbh,
                    //    list[i].hbx, list[i].hby, list[i].hbw, list[i].hbh)
                    //console.log('r is ', r)
                //}

                if(overlaps(this.hbx, this.hby, this.hbw, this.hbh,
                            list[i].hbx, list[i].hby, list[i].hbw, list[i].hbh
                ) > 0.0) {
                    this.beep()
                    this.ismoving = false
                    this.startClock()
                    return true
                }
            }
        }
        this.hasbeeped = false
        this.ismoving = true
        this.stopClock()
        return false
    }

    beep() {
        if(!this.hasbeeped) {
            playsound(1)
            window.setTimeout(playsound, 400, 1)
            this.hasbeeped = true
        }
    }
}

export default Van