import State from './state.js'
import * as util from './util.js'
import * as vg from './mv.js'
import { data, palette } from './data.js'

class LoadingState extends State {
    constructor(c) {
        super(c, [])
        this.progress = 0
        this.imgs = []

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
        vg.setPalette(palette)

        let d = data
        let inc = 100.0 / (d.length / 3)
        for(let i = 0; i < d.length; i += 3) {
            let w = d[i]
            let h = d[i + 1]
            let r = d[i + 2]

            let [img, cv] = this.createCanvas(w,h)
            vg.vgrender(img, r)
            this.imgs.push(cv)
            this.progress += inc
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

        this.next('play')
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
            util.drawImage(img, bpiece, a * 48, 0, bpiece.width, bpiece.height)
        }
        return cv
    }

    genBGTile(tree) {
        let [img, cv] = this.createCanvas(76*5, 300)
        for(let b = 0; b < 4; b++) {
            for(let a = 0; a < 6; a++) {
                let r = util.randomint(0,50)
                util.drawImage(img, tree, a * 60, (b * 50) + r, 76, 236)
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

    render(ctx) {
        util.fsrect(ctx, '#892ca0')
        util.text(ctx, `Loading -- ${Math.round(this.progress)}%`, 1366/2 - 120, 768/2, '#fff', 32)

        //let c = 0
        //this.config.imgs.forEach(i => {
            //ctx.drawImage(i, c, 0)
            //c += 100
        //})
    }
}

export default LoadingState
