//import State from './state.js'
import Giant from './giant.js'
import Beer from './beer.js'
import Sausage from './sausage.js'
import { drawImage, randomint, timestamp, text } from './util.js'
import { playsound } from './sound.js'
import Van from './van.js'
import House from './house.js'
import Thing from './thing.js'
import Bridge from './bridge.js'
import Tree from './tree.js'
import * as vg from './mv.js'
import { data, palette } from './data.js'
import Level from './level.js'

const GAMESTATE = {
    'LOADING': 0,
    'TITLE': 1,
    'STORY': 2,
    'CONTROLS': 3,
    'HOWTO': 4,
    'GAME': 5,
    'GAMEOVER': 6
}

const LEFT_HAND_MULTIPLIER = 1 // 8 // keyboard
const RIGHT_HAND_MULTIPLIER = 1 // 3 mouse

class PlayState {
    constructor(c, i) {
        //super(c, i)

        this.config = {}
        this.imgs = []

        this.state = GAMESTATE.LOADING

        this.text = [ ['*HANS FIXES','*THE INTERNET', '', 'made for js13k 2018', '', 'code & art by', 'madmarcel', '', 'best played with the dual analog', 'sticks on a gamepad'],
            ['*Oh no!','Hans the Giants internet connection has broken.','He can\'t visit his favourite site:', 'www.giantsausages.com', 'Hans is very upset','','The ISP has sent a very impatient man in an', 'orange van to fix Hans\' internet', '', 'Don\'t make him wait', ''],
            ['*Hand Controls', 'Use either', '', 'dual analog stick on gamepad', '', 'or', '', 'mouse + arrow keys', '', 'to control Hans the Giants fists', ''],
            ['*How to Giant', 'Don\'t keep the man in the van waiting too long!','', 'Smash buildings, flatten bridges.', '', 'Eat or chuck cars & tractors','(Raise things to top of screen to chuck)', '', 'Chuck trees - no veggies for Hans ;)', '', 'Eat and drink all the beer and sausages (Huzzah!)'],
            ['*GAME OVER', 'You have', '-----------', '', '', '', '', '', '', '']
        ]

        window.addEventListener('s', e => {
            let key = e.detail.n
            let t = e.detail.t
            if(t) {
                this.stats[key][t] += 1
            } else {
                this.stats[key] += 1
            }
        })

        /* DATA for loading state */
        this.colourSwapSprites = [
            // number, colours to swap [ index, hex ]
            // van
            // 27 - stripe
            // 28 - van itself
            // 14 - panel
            [ 19, 27, '2c84a6', 28, '8ce724', 14, 'ee360d'], // 24 mystery van
            [ 19, 27, 'fff', 28, 'fff', 14, 'fff'],          // 25 white van
            [ 19, 27, '000', 28, 'ccc', 14, 'fff'],          // 26 grey van
            [ 19, 27, 'fff', 28, 'f00', 14, 'fff'],          // 27 red van
            // tractor
            // 12 - tyre hubs
            // 14 - tractor itself
            // 2 - roof
            [ 23, 27, 'f00' ], // 28 red
            [ 23, 27, '648e06', 12, '648e06' ], // 29 - farm green
            // house
            // 19 - door
            // 2 - house
            // roof - 17
            // roof highlight - 3
            // porch - 1
            [ 22, 19, '0055d4', 2, 'ffd5d5', 17, '0055d4', 3, 'acf', 1, 'fff' ], // 30 pink house
            [ 22, 19, '080', 2, 'deaa87', 17, '080', 3, 'afa', 1, 'fff' ] // 31 brown house
        ]
    }

    init() {
        /*this.global = {
            grabthese: [],
            bashthese: [],
            collide: [],
            pushthese: []
        }*/

        this.stats = {
            'vans': { 'e': 0, 'd': 0 },
            'tractors': { 'e': 0, 'd': 0 },
            'trees': 0,
            'houses': 0,
            'bridges': 0,
            'beers': 0,
            'sausages': 0
        }

        this.speed = 2;
        this.grassRot = -10
        this.grassInc = 0.25

        this.level = new Level(this.imgs)
        this.level.init()
        this.giant = new Giant(428, 345, this.imgs)
        //this.beer = new Beer(2000, 317 - 86, this.imgs)
        this.van = new Van(20, 553, this.imgs)
        //this.house = new House(3400, 404, this.imgs)
        this.tree = new Tree(1700, 230, this.imgs)

        //this.sausage = new Sausage(3000, 317 - 86, this.imgs)

        //this.things = []
        
        /*this.thing1 = new Thing(2200, 553, this.imgs, 30, this.imgs[30].width, this.imgs[30].height, true, 'vans')
        this.thing2 = new Thing(1500, 530, this.imgs, 23, this.imgs[23].width, this.imgs[23].height, false, 'tractors')

        this.thing1.alts = [ 30, 31, 32, 33 ] // van
        this.thing2.alts = [ 23, 34, 35 ] // tractor
        this.thing1.changeCostume();
        this.thing2.changeCostume();*/

        /*this.bridge = new Bridge(1400, 692, this.imgs)
        this.global.pushthese.push(this.bridge)
        this.global.collide.push(this.bridge)*/

        //this.things.push(this.thing1)
        //this.things.push(this.thing2)
        //this.things.push(this.beer)
        //this.things.push(this.house)
        //this.things.push(this.sausage)
        //this.things.push(this.tree)

        /*this.global.grabthese.push(this.beer)
        this.global.grabthese.push(this.thing1)
        this.global.grabthese.push(this.thing2)
        this.global.grabthese.push(this.sausage)*/
        //this.global.grabthese.push(this.tree)
        
        //this.global.bashthese.push(this.house)
        //this.global.collide.push(this.house)
        /*this.global.collide.push(this.beer)
        this.global.collide.push(this.thing1)
        this.global.collide.push(this.thing2)
        this.global.collide.push(this.sausage)*/
        //this.global.collide.push(this.tree)


        // generate the two bg layers
        this.offset1 = -10
        this.offset2 = -40

        this.goffset = -10

        this.stopped = false;

        CanvasRenderingContext2D.prototype.shakeScreen = (g, x, y) => {
            let imgData = g.getImageData(0,0, 1366, 768)
            g.fillStyle = 'black'
            g.fillRect(0, 0, 1366, 768)
            g.putImageData(imgData, x, y)
        }

        this.trees = []
        for(let t = 0; t < 4; t++) {
            this.trees.push({ 'x': t * randomint(300,400) + randomint(-50,100), 'y': 300 + randomint(0, 40) })
        }

        this.clouds = []
        for(let t = 0; t < 4; t++) {
            this.clouds.push({ 'x': t * randomint(200,1600), 'y': 20 + randomint(0, 40) })
        }

        // setup gamepad
        this.gamepads = {}
        this.initGamepad()

        this.initKeyboard()

        this.shaking = false
        this.shake_timestamp = 0
        this.gcount = 0
    }

    drawDialog(c, dtext, left, right) {
        c.globalAlpha = 0.8
        c.fillStyle='#000'
        c.fillRect(450, 100, 466, 568)
        c.globalAlpha = 1.0
        let x = 1366/2
        let y = 200
        let yinc = 36
        let f = 18
        let col = '#f80'
        dtext.forEach(t => {
            yinc = 36
            let l = t
            if(t[0] === '*') {
                f = 48
                l = t.substr(1)
                yinc = 60
                col = '#f80'
            }
            text(c, l, x, y, col, f, true)
            f = 18
            y += yinc
            col = '#fff'
        })
        text(c, left, x - 100, y + 18, '#ff0', f, true)
        text(c, right, x + 100, y + 18, '#ff0', f, true)
    }

    renderOverlay(c, i, l, r) {
        this.renderBackground(c)
        this.drawDialog(c, this.text[i], l, r)
        if(this.tree) {
            this.tree.render(c)
        }
        this.renderFG(c)
        if(this.house) {
            this.house.render(c)
        }
    }

    renderTitle(ctx) {
        this.renderOverlay(ctx, 0, 'play', 'story')
    }

    renderStory(ctx) {
        this.renderOverlay(ctx, 1, 'play', 'controls')
    }

    renderControls(ctx) {
        this.renderOverlay(ctx, 2, 'play', 'how to play')
    }

    renderHowTo(ctx) {
        this.renderOverlay(ctx, 3, 'controls', 'play')
    }

    renderGame(ctx) {
        this.renderBackground(ctx)
        this.giant.render(ctx)
        //this.beer.render(ctx)

        // render the van/vehicles
        this.van.render(ctx)

        this.level.render(ctx)

        /*
        this.things.forEach(t => {
            t.render(ctx)
        })*/

        //this.renderFG(ctx)
        //this.house.render(ctx)
        //this.bridge.render(ctx)

        if(this.shaking) {
            ctx.shakeScreen(ctx, 0, randomint(-25, 25))

            if(timestamp() >= this.shake_timestamp) {
                this.shaking = false
            }
        }
    }

    renderGameOver(ctx) {
        this.renderOverlay(ctx, 4, 'title', 'replay')
    }

    render(ctx) {
        switch(this.state) {
            case GAMESTATE.TITLE:
                this.renderTitle(ctx)
            break
            case GAMESTATE.STORY:
                this.renderStory(ctx)
            break
            case GAMESTATE.CONTROLS:
                this.renderControls(ctx)
            break
            case GAMESTATE.HOWTO:
                this.renderHowTo(ctx)
            break
            case GAMESTATE.GAME:
                this.renderGame(ctx)
            break
            case GAMESTATE.GAMEOVER:
                this.renderGameOver(ctx)
            break
        }
    }

    renderBackground(ctx) {
        // clouds
        this.renderClouds(ctx)

        // trees in the bg
        this.renderBG(ctx, this.config.tree1, 6, 360, this.offset1)
        this.renderBG(ctx, this.config.tree2, 6, 460, this.offset2)

        // more bg trees
        this.renderTrees(ctx)
    }

    renderFG(ctx) {
        // render the grass/plants
        this.renderGrass(ctx, 15, 768 - 122, this.goffset)

        // render the ground blocks
        this.renderGround(ctx, 15, 768 - 95, this.goffset)
    }

    renderBG(ctx, tree, qty, Yoffset, Xoffset) {
        for(let x = 0; x < qty; x++) {
            drawImage(ctx, tree, x * 300 + Xoffset, Yoffset)
        }
    }

    renderGrass(ctx, qty, Yoffset, Xoffset) {
        for(let x = 0; x < qty; x++) {
            drawImage(ctx, this.imgs[21], x * 100 + Xoffset, Yoffset, this.imgs[21].width, this.imgs[21].height, this.grassRot)
        }
    }

    renderGround(ctx, qty, Yoffset, Xoffset) {
        ctx.fillStyle='#aef'
        ctx.fillRect(0, 740, 1366, 30)
        for(let x = 0; x < qty; x++) {
            ctx.drawImage(this.imgs[18], x * 100 + Xoffset, Yoffset)
        }
    }

    renderTrees(ctx) {
        ctx.fillStyle='#077'
        ctx.fillRect(0, 665, 1366, 108)
        for(let i = 0; i < this.trees.length; i++) {
            drawImage(ctx, this.config.tree3, this.trees[i].x, this.trees[i].y, undefined, undefined, 0, false, 0.6)
        }
    }

    renderClouds(ctx) {
        for(let i = 0; i < this.clouds.length; i++) {
            drawImage(ctx, this.imgs[16], this.clouds[i].x, this.clouds[i].y, 320, 225, -10)
        }
    }

    update() {
        switch(this.state) {
            case GAMESTATE.GAME:
                this.updateGame()
            break
            default:
                this.updateIdle()
            break
        }

    }

    updateIdle() {
        // bg offset
        this.offset1 -= this.speed / 8 // 0.25
        this.offset2 -= this.speed / 4 //0.5
        this.goffset -= this.speed

        for(let i = 0; i < this.trees.length; i++) {
            this.trees[i].x -= this.speed
            if(this.trees[i].x < -500) {
                this.trees[i].x += randomint(2000, 4000) + randomint(-40, 40)
            }
        }

        if(this.offset1 < -310) {
            this.offset1 = -10
        }
        if(this.offset2 < -340) {
            this.offset2 = -40
        }
        if(this.goffset < -110) {
            this.goffset = -10
        }

        // the grass is animated
        this.grassRot += this.grassInc
        if(this.grassRot > 15 || this.grassRot < -15) {
            this.grassInc *= -1
        }

        // ground offset
        for(let i = 0; i < this.clouds.length; i++) {
            this.clouds[i].x -= 0.1
            if(this.clouds[i].x < -500) {
                this.clouds[i].x += randomint(2000, 4000) + randomint(-40, 40)
            }
        }

        if(this.tree) {
            this.tree.x -= this.speed
            if(this.tree.x < -300) {
                this.tree.x = 1700
            }
        }
        if(this.house) {
            this.house.x -= this.speed
            if(this.house.x < -300) {
                this.house.x = 3400
                this.house.changeCostume()
            }
        }
    }

    updateGame() {
        this.checkGamePads()
        this.updateKeys()
        this.giant.update(this.level.grab)
        this.van.update()
        this.level.update()
        
        //this.bridge.update()

        /*this.things.forEach(t => {
            t.update()
        })*/

        if(this.van.collideWith(this.level.collide)) {
            this.stopped = true
            this.level.stopped = true
        } else {
            this.stopped = false
            this.level.stopped = false
        }

        // bg offset
        if(!this.stopped) {
            this.offset1 -= this.speed / 8 // 0.25
            this.offset2 -= this.speed / 4 //0.5
            this.goffset -= this.speed

            for(let i = 0; i < this.trees.length; i++) {
                this.trees[i].x -= this.speed
                if(this.trees[i].x < -500) {
                    this.trees[i].x += randomint(2000, 4000) + randomint(-40, 40)
                }
            }

            this.level.speed = this.speed


            /*this.things.forEach(t => {
                if(!t.grabbed) {
                    t.x -= this.speed
                }
            })*/
            //this.bridge.x -= this.speed
        }
        
        if(this.offset1 < -310) {
            this.offset1 = -10
        }
        if(this.offset2 < -340) {
            this.offset2 = -40
        }
        if(this.goffset < -110) {
            this.goffset = -10
            if(this.gcount > 40) {
                this.speed++
                this.van.rotinc += 0.5
                this.gcount = 0
            }
            this.gcount++
        }
        /*
        // the grass is animated
        this.grassRot += this.grassInc
        if(this.grassRot > 15 || this.grassRot < -15) {
            this.grassInc *= -1
        }
        */
        // ground offset
        for(let i = 0; i < this.clouds.length; i++) {
            this.clouds[i].x -= 0.1
            if(this.clouds[i].x < -500) {
                this.clouds[i].x += randomint(2000, 4000) + randomint(-40, 40)
            }
        }

        let bl = this.giant.lefthand.collideWith(this.level.bash)
        let br = this.giant.righthand.collideWith(this.level.bash)

        if(bl.r) {
            //console.log('hit left', bl)
            this.bashThing(bl.o, bl.c)
        }
        if(br.r) {
            //console.log('hit right', br)
            this.bashThing(br.o, br.c)
        }

        if(this.giant.lefthand.push(this.level.push) || this.giant.righthand.push(this.level.push)) {
            playsound(randomint(2,4))
            this.setShakeScreen(150)
        }

        if(this.van.gameover) {
            this.prepStats()
            this.state = GAMESTATE.GAMEOVER
        }
    }

    bashThing(object, count) {
        if(count > 10) {
            object.bash(count)
            // play sound
            playsound(randomint(2,4))
            this.setShakeScreen(200)
            object.bashed = false
        }
    }

    setShakeScreen(duration) {
        this.shaking = true
        this.shake_timestamp = timestamp() + duration
    }

    processClick(mx, my) {
        mx = Math.floor(mx)
        my = Math.floor(my)
        this.handleClick(mx, my)
    }

    processMove(mx, my) {
        mx = Math.floor(mx)
        my = Math.floor(my)
        this.handleMove(mx, my)
    }

    handleMove(mx, my) {
        if(this.state === GAMESTATE.GAME) {
            this.giant.righthand.set(mx,my, RIGHT_HAND_MULTIPLIER)

            let br = this.giant.righthand.collideWith(this.level.bash)
            if(br.r) {
                this.bashThing(br.o, br.c)
            }
        }
    }

    handleClick(mx, my) {
        const m = 1366 / 2
        switch(this.state) {
            case GAMESTATE.TITLE:
                if(mx > m) {
                    this.state = GAMESTATE.STORY
                } else {
                    this.init()
                    this.state = GAMESTATE.GAME
                }
            break
            case GAMESTATE.STORY:
                if(mx > m) {
                    this.state = GAMESTATE.CONTROLS
                } else {
                    this.init()
                    this.state = GAMESTATE.GAME
                }
            break
            case GAMESTATE.CONTROLS:
                if(mx > m) {
                    this.state = GAMESTATE.HOWTO
                } else {
                    this.init()
                    this.state = GAMESTATE.GAME
                }
            break
            case GAMESTATE.HOWTO:
                if(mx > m) {
                    this.init()
                    this.state = GAMESTATE.GAME
                } else {
                    this.state = GAMESTATE.CONTROLS
                }
            break
            case GAMESTATE.GAMEOVER:
                if(mx > m) {
                    this.init()
                    this.state = GAMESTATE.GAME
                } else {
                    this.state = GAMESTATE.TITLE
                }
            break
        }
    }

    prepStats() {
        /*
        this.stats = {
            'vans': { 'e': 0, 'd': 0 },
            'tractors': { 'e': 0, 'd': 0 },
            'trees': 0,
            'houses': 0,
            'bridges': 0,
            'beers': 0,
            'sausages': 0
        }
        */
        let keys = Object.keys(this.stats)
        let word = 'chucked'
        for(let i = 3; i < 10; i++) {
            let k = keys[i - 3]
            if(i < 5) {
                this.text[4][i] = `chucked ${this.stats[k]['d']} ${k} and eaten ${this.stats[k]['e']} ${k}`
            } else {
                if(i == 5) {
                    word = 'chucked'
                }
                if(i > 5 && i < 8) {
                    word = 'smashed'
                }
                if(i == 8) {
                    word = 'drank'
                }
                if(i == 9) {
                    word = 'eaten'
                }
                this.text[4][i] = `${word} ${this.stats[k]} ${k}`
            }
        }
    }

    /* ------------- Keyboard Code ------------- */
    initKeyboard() {
        this.kstate = {}

        window.onkeyup = (e) => {
            this.kstate[e.keyCode] = false
        }

        window.onkeydown = (e) => {
            this.kstate[e.keyCode] = true
        }
    }

    checkKey(e) {
        return this.kstate[e]
    }

    updateKeys() {
        
        let a = null
        let b = null

        if(this.checkKey(37) || this.checkKey(65)) {
            a = -15
        }
        if(this.checkKey(39) || this.checkKey(68)) {
            a = 15
        }
        if(this.checkKey(38) || this.checkKey(87)) {
            b = -15
        }
        if(this.checkKey(40) || this.checkKey(83)) {
            b = 15
        }

        this.giant.lefthand.move(a, b, LEFT_HAND_MULTIPLIER)
    }

    /* ------------- Gamepad code -------------- */

    moveHands(a, b, c, d) {
        this.giant.lefthand.move(a,b)
        this.giant.righthand.move(c,d)
    }

    convertValue(value) {
        //console.log(value)
        let r = 0
        if(value > 0.2) {
            r = 6
        }
        if(value > 0.5) {
            r = 12
        }
        if(value > 0.9) {
            r = 24
        }

        if(value < -0.2) {
            r = -6
        }
        if(value < -0.5) {
            r = -12
        }
        if(value < -0.9) {
            r = -24
        }
        return r
    }

    processGamePadInput(axis, value) {
        let lx_inc = null
        let ly_inc = null
        let rx_inc = null
        let ry_inc = null

        switch(axis) {
            case 0:
                lx_inc = this.convertValue(value)
            break;
            case 1:
                ly_inc = this.convertValue(value)
            break;
            case 2:
                rx_inc = this.convertValue(value)
            break;
            case 3:
                ry_inc = this.convertValue(value)
            break;
        }
        this.moveHands(lx_inc, ly_inc, rx_inc, ry_inc)
    }

    checkGamePads() {
        let gamepads = navigator.getGamepads()
        // firefox returns an autoupdating array, chrome returns an object
        // firefox also does something funky with axes mapping :o
        if(!Array.isArray(gamepads)) {
            this.gamepads = gamepads
        }
        let keys = Object.keys(this.gamepads)
        keys.forEach(k => {
            let controller = this.gamepads[k]
            if(controller !== null) {
                if(controller.axes) {
                    for(let i = 0; i < controller.axes.length; i++) {
                        let v = controller.axes[i]
                        if(controller.axes[i].value) {
                            v = controller.axes[i].value
                        }
                        this.processGamePadInput(i, v)
                    }
                }
            }
        })
    }

    gamepadHandler(e,c) {
        const gamepad = e.gamepad
        const i = gamepad.index
        try {
            if (c) {
                this.gamepads[i] = gamepad
            } else {
                delete this.gamepads[i]
            } 
        } catch(e) {
            // naughty
        }
    }

    initGamepad() {
        let self = this
        if(!!navigator.getGamepads){
            window.addEventListener("gamepadconnected", (e) => { self.gamepadHandler(e, true) }, false)
            window.addEventListener("gamepaddisconnected", (e) => { self.gamepadHandler(e, false) }, false)
        }
    }

    /** --------------------------
     * 
     * data loading code 
     * 
     * --------------------------- */
    start() {
        vg.setPalette(palette)

        let d = data
        for(let i = 0; i < d.length; i += 3) {
            let w = d[i]
            let h = d[i + 1]
            let r = d[i + 2]

            let [img, cv] = this.createCanvas(w,h)
            vg.vgrender(img, r)
            this.imgs.push(cv)
        }

        // swap some colours so we can generate extra sprites
        this.colourSwapSprites.forEach(cswap => {
            let index = cswap[0] * 3
            for(let w = 1; w < cswap.length; w += 2) {
                vg.replaceColour(cswap[w], cswap[w + 1])
            }
            let width = d[index]
            let height = d[index + 1]
            let r = d[index + 2]
            this.imgs.push(this.createSprite(r, width, height))

            // reset the pallette to original
            vg.setPalette(palette)
        });

        // generate the bridge sprite
        this.imgs.push(this.genBridge(this.imgs[24]))

        // we also need to generate some background tree blobs
        let i = 17 * 3
        let w = data[i]
        let h = data[i + 1]
        let r = data[i + 2]

        // lazy solution, we just wreck our entire pallete.
        // no extra code required in mv.js this way
        // grab a copy of this colour before we overwrite it ;)
        let col = palette[30]
        this.config.tree1 = this.singleColourSprite(palette[31], r, w, h)
        this.config.tree2 = this.singleColourSprite(col, r, w, h)
        this.config.tree3 = this.singleColourSprite('#077', r, w, h)

        // and then draw the tree five times or so
        this.config.tree1 = this.genBGTile(this.config.tree1)
        this.config.tree2 = this.genBGTile(this.config.tree2)

        this.state = GAMESTATE.TITLE
        this.init()
    }

    createSprite(r, w, h) {
        let [img, cv] = this.createCanvas(w,h)
        vg.vgrender(img, r)
        return cv
    }

    singleColourSprite(colour, r, w, h) {
        vg.setPalette(this.overrideColour(palette, colour))
        return this.createSprite(r, w, h)
    }

    genBridge(bpiece) {
        let [img, cv] = this.createCanvas(484, 44)
        for(let a = 0; a < 10; a++) {
            drawImage(img, bpiece, a * 48, 0, bpiece.width, bpiece.height)
        }
        return cv
    }

    genBGTile(tree) {
        let [img, cv] = this.createCanvas(76*5, 300)
        for(let b = 0; b < 4; b++) {
            for(let a = 0; a < 6; a++) {
                let r = randomint(0,50)
                drawImage(img, tree, a * 60, (b * 50) + r, 76, 236)
            }
        }
        return cv
    }

    overrideColour(list, value) {
        for(let i = 0; i < list.length; i++) {
            list[i] = value
        }
        return list
    }

    createCanvas(w,h) {
        let bf = document.createElement('canvas')
        bf.width = w
        bf.height = h
        let bc = bf.getContext('2d')
        // Don't you dare AntiAlias the pixelart!
        // bc.imageSmoothingEnabled = bc.mozImageSmoothingEnabled = bc.webkitImageSmoothingEnabled = false

        // we need both. We draw our stuff on the 2d context for this canvas,
        // and in turn we pass the canvas element when we want to draw our stuff on another canvas
        return [bc, bf]
    }
}

export default PlayState
