export class Obstacle {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {CanvasRenderingContext2D} context
     * @param {number} vw 
     * @param {number} vh 
     * @param {number} index
     */
    constructor(context, x, y, vw, vh, index) {
        this.c = context
        this.x = x
        this.y = y
        this.vw = vw
        this.vh = vh
        this.i = index
        this.w = 0
        this.h = 0
        this.type = ""
        this.img = new Image()
        this.sx = 0
        this.sw = 0
        this.sh = 0
        this.topY = 0
    }

    draw() {
        let s = this.vh/9
        if (this.i % 3 == 0) {
            this.img.src = "/images/obstacle_1.svg"
            this.sw = 898.5/4
            this.sh = 262.057
            this.type="obs-1"
            this.topY = this.y
            this.w = s*this.sw/120
            this.h = s*this.sh/120
            // this.c.strokeStyle = "black"
            // this.c.beginPath()
            // this.c.rect(this.x, this.y, s*1.78, s*2.15)
            // this.c.stroke()
            // this.c.fillStyle = "black"
            // this.c.font = "bold 20px Courier New black"
            // this.c.fillText(this.i.toString() + " obs-1", this.x, this.y)
            this.c.drawImage(this.img, this.sx, 0, this.sw, this.sh, this.x, this.y, this.w, this.h)
        } else if (this.i % 2 == 0) {
            this.img.src = "/images/obstacle_2.svg"
            this.sw = 497.484/4
            this.sh = 234.2
            this.type="obs-2"
            this.topY = this.y + s*0.232
            this.w = s*this.sw/120
            this.h = s*this.sh/120
            // this.c.strokeStyle = "black"
            // this.c.beginPath()
            // this.c.rect(this.x, this.y + s*0.265, s*0.87, s*1.885)
            // this.c.stroke()
            // this.c.fillStyle = "black"
            // this.c.font = "bold 20px Courier New black"
            // this.c.fillText(this.i.toString() + " obs-2", this.x, this.y + s*0.265)
            this.c.drawImage(this.img, this.sx, 0, this.sw, this.sh, this.x, this.topY, this.w, this.h)
        } else if (this.i % 5 == 0) {
            this.img.src = "/images/obstacle_3.svg"
            this.sw = 120.59
            this.sh = 237.062
            this.type="obs-3"
            this.topY = this.y + s*0.208
            this.w = s*this.sw/120
            this.h = s*this.sh/120
            // this.c.strokeStyle = "black"
            // this.c.beginPath()
            // this.c.rect(this.x, this.y + s*0.24, s*0.93, s*1.91)
            // this.c.stroke()
            // this.c.fillStyle = "black"
            // this.c.font = "bold 20px Courier New black"
            // this.c.fillText(this.i.toString() + " obs-3", this.x, this.y+ s*0.24)
            this.c.drawImage(this.img, this.sx, 0, this.sw, this.sh, this.x, this.topY, this.w, this.h)
        } else {
            this.img.src = "/images/obstacle_4.svg"
            this.type="obs-4"
            this.sw = 68.16
            this.sh = 107.256
            this.topY = this.y + s*1.289
            this.w = s*this.sw/120
            this.h = s*this.sh/120

            // this.c.strokeStyle = "black"
            // this.c.beginPath()
            // this.c.rect(this.x, this.topY, this.w, this.h)
            // this.c.stroke()
            // this.c.fillStyle = "black"
            // this.c.font = "bold 20px Courier New black"
            // this.c.fillText(this.i.toString() + " obs-4", this.x, this.y + s*1.455)

            // let a = new Cone(this.c, this.x, this.y + s*1.455, this.vw, this.vh, this.i)
            // a.draw()
            this.c.drawImage(this.img, this.sx, 0, this.sw, this.sh, this.x, this.topY, this.w, this.h)
        }
    }
    /**
     * 
     * @param {number} speed 
     * @param {number} frame
     */
    update(speed, frame) {
        if (this.i % 3 == 0) {
            if(frame % 12 == 0) {
                if(this.sx < this.sw*3) {
                    this.sx+=this.sw
                } else {
                    this.sx = 0
                }
            }
        } else if (this.i % 2 == 0) {
            if(frame % 12 == 0) {
                if(this.sx < this.sw*3) {
                    this.sx+=this.sw
                } else {
                    this.sx = 0
                }
            }
        }
        this.x-=speed
    }
}