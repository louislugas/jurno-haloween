export class Ground {
    /**
     * 
     * @param {number} vWidth 
     * @param {number} vHeight 
     * @param {CanvasRenderingContext2D} context
     * @param {number} y 
     * @param {number} h 
     */
    constructor(context, y, h, vWidth, vHeight) {
        this.c = context
        this.vw = vWidth
        this.vh = vHeight
        this.y = y
        this.h = h
    }
    
    draw() {
        this.c.fillStyle = "#00192b"
        this.c.beginPath()
        this.c.rect(0, this.vh/9*7.4, this.vw, this.vh/9*1.6)
        this.c.fill()

        this.c.fillStyle = "#113e49"
        this.c.beginPath()
        this.c.rect(0, this.vh/9*6, this.vw, this.vh/9*1.4)
        this.c.fill()
    }
    /**
     * 
     * @param {number} uvWidth
     * @param {number} uvHeight 
     */
    update(uvWidth, uvHeight) {
        this.vw = uvWidth
        this.vh = uvHeight
    }
}

export class Trotoir {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} vWidth 
     * @param {number} vHeight 
     * @param {CanvasRenderingContext2D} context
     * @param {number} index
     */
    constructor(context, x, y, vWidth, vHeight, index) {
        this.c = context
        this.vw = vWidth
        this.vh = vHeight
        this.x = x
        this.y = y
        this.i = index
    }

    draw() {
        this.c.fillStyle = "#506970"
        this.c.beginPath()
        this.c.roundRect(this.x, this.vh/9*7.3, this.vh/9*1.4 ,this.vh/9*0.3, [this.vh/9*0.1,this.vh/9*0.1,0,0])
        this.c.fill()
        
    }

    /**
     * 
     * @param {number} speed 
     */
    update(speed) {
        this.x-=speed
    }
}

export class NearBackground {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {CanvasRenderingContext2D} context
     * @param {number} w 
     * @param {number} h 
     * @param {number} index
     */
    constructor(context, x, y, w, h, index) {
        this.c = context
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.i = index
        this.random = Math.floor((Math.random()*24))
        this.imgArray = new Array(24)
        this.imgArray[0] = new Image()
        this.imgArray[0].src = "/images/background-building-01.svg"
        this.imgArray[1] = new Image()
        this.imgArray[1].src = "/images/background-building-02.svg"
        this.imgArray[2] = new Image()
        this.imgArray[2].src = "/images/background-building-03.svg"
        this.imgArray[3] = new Image()
        this.imgArray[3].src = "/images/background-building-04.svg"
        this.imgArray[4] = new Image()
        this.imgArray[4].src = "/images/background-building-05.svg"
        this.imgArray[5] = new Image()
        this.imgArray[5].src = "/images/background-building-06.svg"
        this.imgArray[6] = new Image()
        this.imgArray[6].src = "/images/background-building-07.svg"
        this.imgArray[7] = new Image()
        this.imgArray[7].src = "/images/background-building-08.svg"
        this.imgArray[8] = new Image()
        this.imgArray[8].src = "/images/background-building-09.svg"
        this.imgArray[9] = new Image()
        this.imgArray[9].src = "/images/background-building-10.svg"
        this.imgArray[10] = new Image()
        this.imgArray[10].src = "/images/background-building-11.svg"
        this.imgArray[11] = new Image()
        this.imgArray[11].src = "/images/background-building-12.svg"
        this.imgArray[12] = new Image()
        this.imgArray[12].src = "/images/background-building-13.svg"
        this.imgArray[13] = new Image()
        this.imgArray[13].src = "/images/background-building-14.svg"
        this.imgArray[14] = new Image()
        this.imgArray[14].src = "/images/background-building-15.svg"
        this.imgArray[15] = new Image()
        this.imgArray[15].src = "/images/background-building-16.svg"
        this.imgArray[16] = new Image()
        this.imgArray[16].src = "/images/background-building-17.svg"
        this.imgArray[17] = new Image()
        this.imgArray[17].src = "/images/background-building-18.svg"
        this.imgArray[18] = new Image()
        this.imgArray[18].src = "/images/background-building-19.svg"
        this.imgArray[19] = new Image()
        this.imgArray[19].src = "/images/background-building-20.svg"
        this.imgArray[20] = new Image()
        this.imgArray[20].src = "/images/background-building-21.svg"
        this.imgArray[21] = new Image()
        this.imgArray[21].src = "/images/background-building-22.svg"
        this.imgArray[22] = new Image()
        this.imgArray[22].src = "/images/background-building-23.svg"
        this.imgArray[23] = new Image()
        this.imgArray[23].src = "/images/background-building-24.svg"
    }

    draw() {
        // this.c.strokeStyle = "red"
        // this.c.beginPath()
        // this.c.rect(this.x, this.y, this.w, this.h)
        // this.c.stroke()

        this.c.drawImage(this.imgArray[this.random], this.x, this.y, this.w, this.h)        
    }
    /**
     * 
     * @param {number} speed 
     */
    update(speed) {
        // console.log(this.imgArray[0].src)
        this.x-=speed
    }
}

export class Sky {
     /**
     * 
     * @param {CanvasRenderingContext2D} context
     * @param {number} vWidth
     * @param {number} vHeight
     */
    constructor(context, vWidth, vHeight) {
        this.c = context
        this.vw = vWidth
        this.vh = vHeight
    }
    draw() {
        let gradient = this.c.createLinearGradient(0, 0 , 0, this.vh);

        // Add three color stops
        gradient.addColorStop(0, "#577f7a");
        gradient.addColorStop(1, "#c7d593");

        this.c.fillStyle=gradient
        this.c.rect(0,0,this.vw, this.vh)
        this.c.fill()
    }
}

export class City {
    /**
     * 
     * @param {CanvasRenderingContext2D} context
     * @param {number} x
     * @param {number} vWidth
     * @param {number} vHeight
     * @param {number} index
     */
    constructor(context, x, vWidth, vHeight, index) {
        this.c = context
        this.vw = vWidth
        this.vh = vHeight
        this.x = x
        this.w = this.vh/9*25.462
        this.i = index
        this.img = new Image()
        this.img2 = new Image()
        this.img3 = new Image()
        this.img.src = "/images/background-city-01.svg"
        this.img2.src = "/images/background-moon-01.svg"
        this.img3.src = "/images/background-cloud-01.svg"
    }
    draw() {
        // let s1 = this.vh/9*0.8
        // let s2 = this.vh/9*0.6
        // let r = this.vh/9*0.2
        // this.c.fillStyle = "#486b66"
        // let city = new Path2D(
        //     `M${this.x},${this.vh/3} 
        //     l${s1},0 
        //     q${r},0 ${r},${-r}
        //     l0,${-s2}
        //     q0,${-r} ${r},${-r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2}
        //     q0,${r} ${r},${r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2}
        //     q0,${r} ${r},${r}
        //     l${s2},0
        //     q${r},0 ${r},${-r}
        //     l0,${-s1*2}
        //     q0,${-r} ${r},${-r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2/2}
        //     q0,${r} ${r},${r}
        //     l${s1*2},0
        //     q${r},0 ${r},${-r}
        //     l0,${-s2/2}
        //     q0,${-r} ${r},${-r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2*1.5}
        //     q0,${r} ${r},${r}
        //     l${s2},0
        //     q${r},0 ${r},${-r}
        //     l0,${-s2}
        //     q0,${-r} ${r},${-r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2}
        //     q0,${r} ${r},${r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2/2}
        //     q0,${r} ${r},${r}
        //     l${s2},0
        //     q${r},0 ${r},${-r}
        //     l0,${-s1*2}
        //     q0,${-r} ${r},${-r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2}
        //     q0,${r} ${r},${r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2}
        //     q0,${r} ${r},${r}
        //     l${s2},0
        //     q${r},0 ${r},${-r}
        //     l0,${-s1*2}
        //     q0,${-r} ${r},${-r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2/2}
        //     q0,${r} ${r},${r}
        //     l${s1*2},0
        //     q${r},0 ${r},${-r}
        //     l0,${-s2/2}
        //     q0,${-r} ${r},${-r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2*1.5}
        //     q0,${r} ${r},${r}
        //     l${s2},0
        //     q${r},0 ${r},${-r}
        //     l0,${-s2}
        //     q0,${-r} ${r},${-r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2}
        //     q0,${r} ${r},${r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2/2}
        //     q0,${r} ${r},${r}
        //     l${s2},0
        //     q${r},0 ${r},${-r}
        //     l0,${-s1*2}
        //     q0,${-r} ${r},${-r}
        //     l${s2},0
        //     q${r},0 ${r},${r}
        //     l0,${s2}
        //     q0,${r} ${r},${r}
        //     l${s1},0
        //     l0,${this.vh/3}
        //     l${-this.vh/9*25},0
        //     z`
        // );
        // this.c.fill(city)

        // s = source
        // d = destination
        //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        this.c.drawImage(this.img, 0, 0, 3055.51, 349.87 , this.x, this.vh/9*3.113, this.w, this.vh/9*2.916)
    }
    /**
     * 
     * @param {number} speed 
     */
    update(speed) {
        this.x-=speed
    }
}

export class MoonCloud {
    /**
     * 
     * @param {CanvasRenderingContext2D} context
     * @param {number} x
     * @param {number} vWidth
     * @param {number} vHeight
     * @param {number} index
     */
    constructor(context, x, vWidth, vHeight, index) {
        this.c = context
        this.vw = vWidth
        this.vh = vHeight
        this.x = x
        this.w = this.vh/9*25.462
        this.i = index
        this.img2 = new Image()
        this.img3 = new Image()
        this.img2.src = "/images/background-moon-01.svg"
        this.img3.src = "/images/background-cloud-01.svg"
    }
    draw() {
        //drawCloud
        this.c.drawImage(this.img3, 0, 0, 1940.26, 548.31 , 0, this.vh/9*1.805, this.vh/9*16.168, this.vh/9*4.57)

        // s = source
        // d = destination
        //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        
        //drawMoon
        this.c.drawImage(this.img2, 0, 0, 150, 150 , (this.vw/2)-(this.vh/9*0.625), this.vh/9*0.375, this.vh/9*1.25, this.vh/9*1.25)
    }

}