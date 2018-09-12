import Head from './head.js'
import { drawImage } from './util.js'
import Hand from './hand.js'

class Giant {
    constructor(x,y,c) {
        this.x = x
        this.y = y
        this.c = c
        //428, 385
        //469, 22
        this.head = new Head(x + 51, y - 363, c)
        this.fw = this.c[2].width
        this.fh = this.c[2].height

        this.lefthand = new Hand(this.x - 300, this.y + 180, c, false)
        this.righthand = new Hand(this.x + 600, this.y + 180, c, true)

        this.bob = 0
        this.inc = -1
        this.count = 2
    }

    render(c) {
        // body
        c.drawImage(this.c[5], this.x, this.y + this.bob)
        this.head.render(c)
        // hands
        
        // left
        //drawImage(c,this.c.imgs[2], this.x - 300, this.y + 150, this.fw, this.fh, 90)
        
        // right
        //drawImage(c,this.c.imgs[2], this.x + 600, this.y + 90, this.fw, this.fh, -90, true)
        this.lefthand.render(c)
        this.righthand.render(c)
    }

    update(global) {
        this.head.update(global)
        this.lefthand.update(global)
        this.righthand.update(global)

        if(this.count > 8) {
            this.count = 0
            this.bob += this.inc
            if(this.bob > 5 || this.bob < -5) {
                this.inc *= -1
            }
        }
        this.count++
    }

    moveLeft(dx, dy) {
        this.lefthand.move(dx, dy)
    }

    moveRight(dx, dy) {
        this.righthand.move(dx, dy)
    }

    /* (handleMove(x,y) {
        this.righthand.x = x
        this.righthand.y = y
    } */
}

export default Giant