import { randomint, timestamp, drawImage } from "./util"
import Bridge from "./bridge"
import House from "./house"
import Tree from "./tree"
import Beer from "./beer"
import Thing from './thing'
import Sausage from './sausage'

const WIDTHS = {
    BRIDGE: 461,
    GROUND: 100
}

const YOFFSETS = {
    GROUND: 768 - 95,
    BRIDGE: 692,
    HOUSE: 404,
    TREE: 230,
    BEER: 317 - 86,
    VAN: 553,
    TRACTOR: 530,
    SAUSAGE: 317 - 86,
    GRASS: 768 - 122
}

class Level {
    constructor(imgs) {

        this.imgs = imgs

        this.endX = 0
        this.offset = 0

        this.grammar = [
            // bit of empty space
            {
                'g': 2
            },
            // bit of empty space
            {
                'g': 1
            },
            // house
            {
                'h': 25,
                'g2': 3
            },
            // house
            {
                'h': 50,
                'g2': 4
            },
            // bridge
            {
                'g': 1,
                'b': true,
            },
            // tree
            {
                't': 1,
                'g': 1
            },
            // tree
            {
                't': 1,
                'g': 2
            },
            // sausage
            {
                's': 1,
                'g': 2
            },
            // beer
            {
                'd': 1,
                'g': 2
            },
            // van
            {
                'v': 1,
                'g': 2
            },
            // tractor
            {
                'e': 1,
                'g': 3
            },
            // van
            {
                'v': 1,
                'g': 3
            },
            // tractor
            {
                'e': 1,
                'g': 2
            }
        ]

        this.lastPiece = -1

        this.speed = 2

        this.collide = []
        this.bash = []
        this.grab = []
        this.push = []

        this.things = []
        this.grass = []
        this.ground = []
        this.fgthings = []

        this.stopped = false

        this.ts = timestamp()
        this.grassRot = -10
        this.grassInc = 0.25
    }

    init() {
        for(let i = 0; i < 6; i++) {
            this.addPiece(true, 0)
        }
        this.addPiece(true, 9)
        this.addPiece(true, 2)
        this.addPiece(true, 0)
        this.addPiece(true, 10)
        this.addPiece(true, 5)
        this.addPiece(true, 0)
        this.addPiece(true, 8)
    }

    update() {
        if(!this.stopped) {
            this.offset -= this.speed
            //this.offset2 = Math.abs(this.offset * this.speed) + 300; // * this.speed)

            this.ground.forEach(g => {
                g.x -= this.speed
            })
            this.fgthings.forEach(fg => {
                fg.x -= this.speed
            })
            this.things.forEach(t => {
                t.x -= this.speed
            })
            this.grass.forEach(t => {
                t.x -= this.speed
            })
        }

        this.fgthings.forEach(fg => {
            fg.update()
        })
        this.things.forEach(t => {
            t.update()
        })

        this.collide = this.collide.filter(c => { return !c.dead })
        this.bash = this.bash.filter(c => { return !c.dead })
        this.grab = this.grab.filter(c => { return !c.dead })
        this.ground = this.ground.filter(c => { return c.x > -100 })
        this.grass = this.grass.filter(c => { return c.x > -100 })

        // grass
        this.grassRot += this.grassInc
        if(this.grassRot > 15 || this.grassRot < -15) {
            this.grassInc *= -1
        }

        if(this.ts < timestamp()) {
            //console.log('adding piece');
            this.addPiece()
            this.ts = timestamp() + 500
        }
    }

    render(c) {
        // water
        c.fillStyle='#aef'
        c.fillRect(0, 740, 1366, 30)

        // vehicles/trees
        this.things.forEach(t => {
            t.render(c)
        })

        // grass
        this.grass.forEach(gr => {
            drawImage(c, this.imgs[21], gr.x, gr.y, this.imgs[21].width, this.imgs[21].height, this.grassRot)
        })

        // ground
        this.ground.forEach(g => {
            
            c.drawImage(this.imgs[18], g.x, g.y)
            // white box around ground blocks
            /*
            c.strokeStyle = '#fff'
            c.beginPath()
            c.rect(g.x, g.y - 20, WIDTHS.GROUND, 20)
            c.stroke()*/
        })

        // houses & bridges
        this.fgthings.forEach(t => {
            t.render(c)
        })

        // red box 
        /*c.strokeStyle = '#f00'
        c.beginPath()
        c.rect(this.offset + this.endX, 600, 40, 100)
        c.stroke()

        // green box 
        c.strokeStyle = '#0f0'
        c.beginPath()
        c.rect(this.offset2, 600, 40, 100)
        c.stroke()*/
    }

    addPiece(flag, j) {
        let i = randomint(0, this.grammar.length - 1)
        while(i === this.lastPiece) {
            i = randomint(0, this.grammar.length - 1)
        }
        // override
        if(flag) {
            i = j
        }
        this.lastPiece = i
        let p = this.grammar[i]
        let k = Object.keys(p)
        k.forEach(key => {
            let o = p[key]
            switch (key) {
                case 'g':
                    for(let z = 0; z < o ; z++) {
                        this.ground.push( { x: this.endX + this.offset, y: YOFFSETS.GROUND })

                        // randomly add a lump of grass
                        let choice = randomint(0, 1)
                        if(choice > 0) {
                            this.grass.push( { x: this.endX + this.offset + randomint(0, 60), y: YOFFSETS.GRASS })
                        }
                        this.endX += WIDTHS.GROUND
                    }
                break
                case 'g2':
                    // no grass
                    for(let z = 0; z < o ; z++) {
                        this.ground.push( { x: this.endX + this.offset, y: YOFFSETS.GROUND })
                        this.endX += WIDTHS.GROUND
                    }
                break
                case 'b':
                    let b = new Bridge(this.endX + this.offset, YOFFSETS.BRIDGE, this.imgs)
                    this.fgthings.push(b)
                    this.push.push(b)
                    this.collide.push(b)
                    this.endX += WIDTHS.BRIDGE
                break
                case 'h':
                    let h = new House(this.endX + this.offset, YOFFSETS.HOUSE, this.imgs)
                    h.doReset = false
                    this.fgthings.push(h)
                    this.bash.push(h)
                    this.collide.push(h)
                break;
                case 't':
                    let t = new Tree(this.endX + this.offset, YOFFSETS.TREE, this.imgs)
                    t.doReset = false
                    this.things.push(t)
                    this.grab.push(t)
                    this.collide.push(t)
                break;
                case 'd':
                    let d = new Beer(this.endX + this.offset, YOFFSETS.BEER, this.imgs)
                    d.doReset = false
                    this.things.push(d)
                    this.grab.push(d)
                    this.collide.push(d)
                break;
                case 's':
                    let s = new Sausage(this.endX + this.offset, YOFFSETS.SAUSAGE, this.imgs)
                    s.doReset = false
                    this.things.push(s)
                    this.grab.push(s)
                    this.collide.push(s)
                break;
                case 'v':
                    let fv = Math.random() < 0.5
                    let v = new Thing(this.endX + this.offset, YOFFSETS.VAN, this.imgs, 30, this.imgs[30].width, this.imgs[30].height, fv, 'vans')
                    v.alts = [ 30, 31, 32, 33 ] // van
                    v.changeCostume()
                    v.doReset = false
                    this.things.push(v)
                    this.grab.push(v)
                    this.collide.push(v)
                break;
                case 'e':
                    let fe = Math.random() < 0.5
                    let e = new Thing(this.endX + this.offset, YOFFSETS.TRACTOR, this.imgs, 23, this.imgs[23].width, this.imgs[23].height, fe, 'tractors')
                    e.alts = [ 23, 34, 35 ] // tractor
                    e.changeCostume()
                    e.doReset = false
                    this.things.push(e)
                    this.grab.push(e)
                    this.collide.push(e)
                break;
            }
        })
    }
}

export default Level