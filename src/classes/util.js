const WIDTH = 1366
const HEIGHT = 768

let rect = (c, col, x, y, w, h) => {
    c.fillStyle = col
    c.fillRect(x, y, w, h)
}

let fsrect = (c, col) => {
    rect(c, col, 0, 0, WIDTH, HEIGHT)
}

let contains = (xa, ya, xb, yb, w, h) => {
    return xa >= xb && xa <= xb + w &&
           ya >= yb && ya <= yb + h
}

let getIntersectingRectangle = (r1, r2) => {  
    [r1, r2] = [r1, r2].map(r => {
        return {x: [r.x1, r.x2].sort(), y: [r.y1, r.y2].sort()}
    })
  
    const noIntersect = r2.x[0] > r1.x[1] || r2.x[1] < r1.x[0] ||
                        r2.y[0] > r1.y[1] || r2.y[1] < r1.y[0]
  
    return noIntersect ? false : {
        x1: Math.max(r1.x[0], r2.x[0]), // _[0] is the lesser,
        y1: Math.max(r1.y[0], r2.y[0]), // _[1] is the greater
        x2: Math.min(r1.x[1], r2.x[1]),
        y2: Math.min(r1.y[1], r2.y[1])
    }
}

// returns a percentage overlap
let overlaps = (ax, ay, aw, ah, bx, by, bw, bh) => {
    let a = {x1: ax, y1: ay, x2: ax + aw, y2: ay + ah}
    let b = {x1: bx, y1: by, x2: bx + bw, y2: by + bh}
    let r = getIntersectingRectangle(a, b)
    
    if(!r) {
        return 0.0
    } else {
        let bsize = Math.abs((bw * bh) / 100.0)
        let rsize = Math.abs((r.x2 - r.x1) * (r.y2 - r.y1))
        if(rsize > 0.0 && bsize > 0.0) {
            return rsize / bsize
        }
        return 0.0
    }
}

let text = (c, t, x, y, col, size, center) => {
    if(size) {
        c.font = 'bold ' + size + 'px Arial'
    }
    if(center) {
        c.textAlign = "center";
    }
    c.fillStyle = col
    c.fillText(t, x, y)
}

let drawImage2 = (ctx, img, x, y, deg, ox, oy) => {
    const rad = 2 * Math.PI - deg * Math.PI / 180
    ctx.save()
    ctx.translate( x, y )
    ctx.rotate( rad )
    ctx.translate( -ox, -oy )
    ctx.drawImage( img, 0, 0 )
    ctx.restore()
}

let drawImage = (ctx, img, x, y, width, height, deg, flip, flop, center) => {
    ctx.save()

    if(typeof width === "undefined") width = img.width
    if(typeof height === "undefined") height = img.height
    if(typeof center === "undefined") center = false

    // Set rotation point to center of image, instead of top/left
    if(center) {
        x -= width/2
        y -= height/2
    }
    // Set the origin to the center of the image
    ctx.translate(x + width/2, y + height/2)

    // Rotate the canvas around the origin
    const rad = 2 * Math.PI - deg * Math.PI / 180
    ctx.rotate(rad)

    let flipScale = 0
    let flopScale = 0

    // Flip/flop the canvas
    if(flip) {
        flipScale = -1 
    } else {
        flipScale = 1
    }
    if(flop) {
        flopScale = flop
        flipScale = flop
    } else {
         flopScale = 1
    }
    ctx.scale(flipScale, flopScale)

    // Draw the image
    ctx.drawImage(img, -width/2, -height/2, width, height)
    ctx.restore()
}

let timestamp = () => {
    return new Date().getTime()
}

let randomint = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rad = (d) => {
    return (Math.PI/180)*d
}

export { rec, fsrect, contains, text, drawImage, overlaps, timestamp, randomint, rad, drawImage2 }