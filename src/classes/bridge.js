import { drawImage, drawImage2, rad, overlaps, randomint } from './util.js'
import Rect from './rect.js'

class Bridge {
    constructor(x, y, config) {
        this.x = x
        this.y = y
        this.c = config

        this.isBridge = true

        this.img = this.c[38]
        this.anchorimg = this.c[25]

        //generate a bunch of hitboxes spread along the bridge length
        this.hitboxes = []
        for(let i = 1; i < 10; i++) {
            let r = new Rect(this.x - 19 + 48 * i, y - 23, 39, 46)
            r.offset = 48 * i
            this.hitboxes.push(r)
        }
        this.reset(x)

        // special hitbox for the van
        this.hbx = this.x - 50
        this.hby = this.y - 100
        this.hbw = 30
        this.hbh = 100
    }

    reset(x) {
        this.x = x
        this.rot = 0
        this.targetRot = 83 - randomint(0, 20)
        this.locked = false
        this.sproing = false
        this.sproingDist = (1366 / 2) + randomint(60, 200)
    }

    render(c) {
        drawImage2(c, this.img, this.x, this.y, this.rot, 21, 23)
        drawImage(c, this.anchorimg, this.x - 30, this.y - 40, this.anchorimg.width, this.anchorimg.height)

        /*
        c.strokeStyle = 'red'
        this.hitboxes.forEach(r => {
            c.beginPath()
            c.rect(r.x, r.y, r.w, r.h)
            c.stroke()
        })*/
        /*
        c.strokeStyle = 'white'
        c.beginPath()
        c.rect(this.hbx, this.hby, this.hbw, this.hbh)
        c.stroke()*/
    }

    update() {
        
        this.hbx = this.x - 50
        if(this.locked) {
            this.hby = -100
            if(this.rot > 0) {
                this.rot -= 0.5
            }
            return
        }
        this.hby = this.y - 100

        this.hitboxes.forEach(h => {
            h.x = this.x - 19 + h.offset * Math.cos(rad(this.rot))
            h.y = this.y - 23 + h.offset * Math.sin(rad(this.rot)) * -1
        })
        if(!this.sproing) {
            if(this.x < this.sproingDist && this.rot < this.targetRot) {
                this.rot += 5
            }
            if(this.rot >= this.targetRot) {
                this.sproing = true
            }
        }
    }

    push(inc) {
        this.rot += inc
        if(this.rot < 0) {
            this.rot = 0
            
        }
        if(this.rot > 90) {
            this.rot = 90
        }
        if(this.rot < 3) {
            this.locked = true
            this.sendEvent()

            return true
        }
        return false
    }

    pushLeft() {
        return this.push(3)
    }

    pushRight() {
        return this.push(-3)
    }

    collideSide(r1, r2){
        let dx = (r1.x + r1.w / 2)-(r2.x + r2.w / 2);
        let dy = (r1.y + r1.h / 2)-(r2.y + r2.h / 2);
        let width = (r1.w + r2.w) / 2;
        let height = (r1.h + r2.h) / 2;
        let crossWidth = width * dy;
        let crossHeight = height * dx;
        let collision = 'n';
        if(Math.abs(dx) <= width && Math.abs(dy) <= height){
            if(crossWidth > crossHeight){
                collision = (crossWidth > (-crossHeight)) ? 'b' : 'l';
            } else {
                collision = (crossWidth > -(crossHeight)) ? 'r' : 't';
            }
        }
        return (collision);
    }

    collide(x, y, w, h) {
        if(this.locked) {
            return false
        }
        if(!this.sproing) {
            return false
        }
        for(let i = 0; i < this.hitboxes.length; i++) {
            let l = this.hitboxes[i]
            if(overlaps(x, y, w, h,
                l.x, l.y, l.w, l.h
            ) > 0.1) {
                let r = this.collideSide(new Rect(x, y, w, h), l)
                if(r === 'l' || l === 't') {
                    return this.pushRight()
                }
                if(r === 'b' || l === 'r') {
                    return this.pushLeft()
                }
            }
        }
        return false
    }

    sendEvent() {
        const e = new CustomEvent('s', { detail: { 'n': 'bridges' }})
        window.dispatchEvent(e)
    }
}

export default Bridge