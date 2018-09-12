//import LoadingState from './classes/loadingstate.js'
import PlayState from './classes/playstate.js'

(function() {
    'use strict'

    // start game when page has finished loading
    window.addEventListener('load', function() {
        const canvas = document.getElementById('c')
        const ctx = canvas.getContext('2d')
        const WIDTH = 1366
        const HEIGHT = 768

        let currentState = new PlayState()
        //currentState.init()
        /* let pause = false
        let fadeOut = false
        let fadeIn = false
        let next = null
        let config = null
        let imgs = []
        let inc = 0.0
        let alpha = 0*/
        
        /* let now = () => {
            return new Date().getTime()
        } */

        //let ts = now()

        let cls = () => {
            ctx.clearRect(0, 0, WIDTH, HEIGHT)
        }

        // setup miece listeners 
        let initMouse = (c) => {
            c.addEventListener('click', e => {
                let r = c.getBoundingClientRect()
                let x = e.clientX - r.left
                let y = e.clientY - r.top
                currentState.processClick(x, y)
            }, false)
    
            c.addEventListener('mousemove', e => {
                let r = c.getBoundingClientRect()
                let x = e.clientX - r.left
                let y = e.clientY - r.top
                currentState.processMove(x, y)
            }, false)
        }

        // a bit of code to handle nice state transitions - fade in and out effect
        /*let skip = 7

        let startFadeIn = () => {
            fadeIn = true
            fadeOut = false
            alpha = 1.0
            inc = -0.025
            pause = true
            ts = now() + skip
        }*/

        /*let startFadeOut = () => {
            fadeOut = true
            fadeIn = false
            alpha = 0.0
            inc = 0.025
            ts = now() + skip
        }

        let processFade = () => {
            cls()
            // render whatever the last view was
            currentState.render(ctx)
            // and then draw a great big black box over it
            ctx.fillStyle = '#000'
            // update the alpha for the box to get the transition effect
            ctx.globalAlpha = alpha
            ctx.fillRect(0, 0, WIDTH, HEIGHT)
            // don't update the alpha too often
            if(now() > ts) {
                alpha += inc
                ts = now() + skip
            }
            // check if the fade is completed
            if(fadeOut && alpha > 1.0) {
                nextState()
            }
            if(fadeIn && alpha < 0.0) {
                fadeIn = false
                pause = false
            }
        }*/

        // this invokes the next state class
        //let nextState = () => {
            //console.log('Next is', next)
            //switch(next) {
              //  case 'play':
                //    currentState = new PlayState(config, imgs)
                //break
            //}
            // dynamic invocation just won't work - webpack omits the class, and rollup mangles the name
            /*try {
                currentState = (Function('return new ' + next))()
            } catch(e) {
                currentState = new this[next]()
            }*/
            //currentState.init()
            //startFadeIn()
        //}

        // the main loop
        let tick = () => {
            //ctx.globalAlpha = 1.0
            //if(!pause) {
            currentState.update()
            cls()
            currentState.render(ctx)
            //}
            /*if(fadeOut || fadeIn) {
                processFade()
            }*/
            requestAnimationFrame(tick)
        }

        // nicely transition to next state when we get a ns signal
        /*
        window.addEventListener('ns', e => {
            currentState.finish()
            next = e.detail.n
            config = e.detail.c
            imgs = e.detail.i
            startFadeOut()
        }, false)*/

        // start the main loop
        initMouse(canvas)
        currentState.start()
        tick()
    })
})()