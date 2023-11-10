export class Bonus {
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
        this.type = ""
        this.img = new Image()
        this.hitimg = new Image()
        this.pointimg = new Image()
        this.sx = 0
        this.sw = 0
        this.sh = 0
        this.topY = 0
        this.hit = false
        this.pointY = 0
        this.cx = 0
        this.cy = 0
        this.cw = 0
        this.ch = 0
        this.opacity1 = 1
        this.opacity2 = 1
        this.hitsx = 0
        this.hitsy = 0
    }

    draw() {
        let s = this.vh/9
        this.w = s*1.78
        if (this.i % 3 == 0) {
            this.img.src = "/images/bonus-01.svg"
            this.hitimg.src = "/images/bonus-03.svg"
            this.pointimg.src = "/images/bonus-05.svg"
            this.sw = 60
            this.sh = 60
            this.type="bon-1"
            this.topY = this.y
            this.w = s*1.2
            this.h = s*1.2

            this.cx = this.x+s*0.1
            this.cy = this.y+s*0.1
            this.cw = s
            this.ch = s

            // collision box
            // this.c.strokeStyle = "black"
            // this.c.beginPath()
            // this.c.rect(this.cx, this.cy, this.cw, this.ch)
            // this.c.stroke()
            // this.c.fillStyle = "black"
            // this.c.font = "bold 20px Courier New black"
            // this.c.fillText(this.i.toString() + " Bonus-1", this.x, this.y)

            //sprite
            this.c.globalAlpha = this.opacity1
            this.c.drawImage(this.img, this.sx, 0, this.sw, this.sh, this.x, this.y, this.w, this.h)

            if (this.hit) {
                this.c.globalAlpha = 1
                //hit
                this.c.drawImage(this.hitimg, this.hitsx, this.hitsy, this.sw, this.sh, this.x, this.y, this.w, this.h)
                //point
                this.c.drawImage(this.pointimg, 0, 0, this.sw, this.sh, this.x, this.y-this.pointY, this.w, this.h)
            }
           

        } else if (this.i % 2 == 0) {
            this.img.src = "/images/bonus-02.svg"
            this.sw = 60
            this.sh = 60
            this.type="bon-2"
            // this.topY = this.y + s*0.265
            this.w = s
            this.h = s

            this.cx = this.x
            this.cy = this.y
            this.cw = this.w
            this.ch = this.h

            // collision box
            // this.c.strokeStyle = "blue"
            // this.c.beginPath()
            // this.c.rect(this.cx, this.cy, this.cw, this.ch)
            // this.c.stroke()
            // this.c.fillStyle = "black"
            // this.c.font = "bold 20px Courier New black"
            // this.c.fillText(this.i.toString() + " Bonus-2", this.x, this.y)

            // sprite
            this.c.globalAlpha = this.opacity2
            this.c.drawImage(this.img, this.sx, 0, this.sw, this.sh, this.x, this.y, s, s)
        } 

    }
    /**
     * 
     * @param {number} speed 
     * @param {number} frame
     * @param {number} hit
     */
    update(speed, frame, hit) {
        if (hit) {
            this.hit = true
            this.pointY+=2
            if(frame % 12 == 0) {
                this.hitsx += 60
            }
            setTimeout(() => {
                this.hit = false
                this.pointY = 0
                this.hitsx = 0
            }, 1000)
        } else {
            this.hit = false
        }

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