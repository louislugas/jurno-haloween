export class Player {
    /**
     * 
     * @param {CanvasRenderingContext2D} c
     * @param {number} x 
     * @param {number} y 
     * @param {number} w
     * @param {number} h 
	 * @param {number} vw
     * @param {number} vh 
     */
	constructor(c, x, y, w, h, vw, vh) {
		this.c = c
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.anchorY = y
		this.shadowx = x  + this.w*0.215
		this.shadoww = this.w*0.435
		this.vw = vw
		this.vh = vh
		this.sx = 0
		this.sy = 0
		this.hsx = 0
		this.sw = 1754.28/6
		this.sh = 911.37/3
		this.cx1 = this.x + this.w*0.193
		this.cx2 = this.w * 0.435
		this.cy = this.y + this.h*0.805
		this.img = new Image()
		this.img.src = "/images/skater-01.svg"
		this.hitimg = new Image()
		this.hitimg.src = "/images/hit-obstacle-01.svg"
		this.hit = false
	}
	draw() {
		// this.c.beginPath()
		// this.c.strokeStyle = "black"
		// this.c.rect(this.x, this.y, this.w, this.h)
		// this.c.stroke()

		// shadow
		this.c.beginPath()
		this.c.fillStyle = "#13313c"
		this.c.roundRect(this.shadowx, (this.vh/9*4.85) + this.h*0.76, this.shadoww, this.h*0.06, this.h*0.03 )
		this.c.fill()

		// collision box
		// this.c.beginPath()
		// this.c.strokeStyle = "red"
		// this.c.rect(this.cx1, this.y, this.cx2, this.h)
		// this.c.stroke()

		// sprite
		this.c.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h)
		//hit sprite
		if (this.hit) {
			this.c.drawImage(this.hitimg, this.hsx, 0, 210, 210, this.x+(this.vh/9*0.5), this.y+(this.vh/9*0.2), this.vh/9*1.75, this.vh/9*1.75)
		}
		
	}
    /**
     * 
     * @param {number} ease 
     * @param {number} playery
     * @param {number} distance
	 * @param {number} frame
     * @param {idle} jump
     * @param {boolean} idle
	 
     */
	update(ease, playery, distance, jump, idle, frame) {
		if(frame % 12 == 0) {
			if(this.sx < this.sw*5) {
				this.sx+=this.sw
			} else {
				this.sx = 0
			}
		}
		if (!idle) {
			if(jump) { // jump
				this.y = playery-((distance*ease))
				this.shadowx = (this.x+this.w*0.215)+((20*ease))
				this.shadoww = (this.w*0.435)-((40*ease))
				this.sy = 1 * this.sh
				this.cy = this.y + this.h*0.805
				if (ease < 0.1) {
					this.sx = 1 * this.sw
				} else if (ease >= 0.1 && ease < 0.5) {
					this.sx = 2 * this.sw
				} else if (ease >= 0.5 && ease < 1) {
					this.sx = 3 * this.sw
				}
				
			} else { // false
				this.y = (playery-distance)+((distance*ease))
				this.shadowx = (((this.x+this.w*0.215))+20)-((20*ease))
				this.shadoww = (((this.w*0.435))-40)+((40*ease))
				this.sy = 1 * this.sh
				this.sx = 4 * this.sw
				this.cy = this.y + this.h*0.805
			}
		} else {
			this.sy = 0 * this.sh
			this.y = playery
			this.cy = this.y + this.h*0.805
		}
		
	}
	/**
     * 
	 * @param {number} frame
     */
	fall(frame) {
		this.hit = true
		this.sy = 2 * this.sh

		if (this.y < this.anchorY) {
			this.y+=2
		}

		if (frame < 2) {
			this.hsx = 0
		} else if (frame >= 2 && frame < 4) {
			this.hsx = 210
		} else if (frame >= 4 && frame < 12) {
			this.hsx = 420
		} else if (frame >= 12 && frame < 20) {
			this.hsx = 630
		}

		if (frame >= 20) {
			this.hit = false
		}

		if (frame < 20) {
			this.sx = 1 * this.sw
		} else if (frame >= 20 && frame < 40) {
			this.sx = 2 * this.sw
		} else if (frame >= 40 && frame < 60) {
			this.sx = 3 * this.sw
		} else if (frame >= 60 && frame < 80) {
			this.sx = 4 * this.sw
		} else if (frame >= 80) {
			this.sx = 5 * this.sw
		}
	}
}

export class Tali {
    /**
     * 
     * @param {CanvasRenderingContext2D} c
     * @param {number} x 
     * @param {number} y 
     * @param {number} w
     * @param {number} h
	 * @param {number} vw
     * @param {number} vh
     */
	constructor(c, x, y, w, h, vw, vh) {
		this.c = c
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.vw = vw
		this.vh = vh
		this.lx = this.x + this.w*0.4
		this.ly = this.y+ this.vh/9*0.918
		this.lqx = this.lx + this.vh/9*1
	}
	draw() {
		this.c.strokeStyle = "#eeeeee"
		this.c.lineWidth = 2;
		this.c.beginPath()
		this.c.moveTo(this.lx, this.ly);
		this.c.bezierCurveTo(this.lqx, this.ly, this.vh/9*8.5, this.vh/9*4, this.vh/9*11, this.vh/9*3);
		this.c.stroke()
		this.c.lineWidth = 1;
	}
	/**
     * 
     * @param {number} ease 
     * @param {number} playery
     * @param {number} distance
	 * @param {number} frame
     * @param {idle} jump
     * @param {boolean} idle
	 
     */
	update(ease, playery, distance, jump, idle, frame) {
		if (!idle) {
			if(jump) { // jump
				this.ly = (this.y+ this.vh/9*0.918)-((distance*ease))				
			} else { // false
				this.ly = ((this.y+ this.vh/9*0.918)-distance)+((distance*ease))
			}
		} else {
			this.ly = this.y+this.vh/9*0.918
		}
	}
	/**
     * 
	 * @param {number} frame
     */
	fall(frame) {
		if (frame < 20) {
			this.ly = this.y+this.vh/9*0.918
		} else if (frame >= 20 && frame < 40) {
			this.ly = this.y+this.vh/9*1.2
		} else if (frame >= 40 && frame < 60) {
			this.ly = this.y+this.vh/9*1.3
		} else if (frame >= 60 && frame < 80) {
			this.ly = this.y+this.vh/9*1.4
		} else if (frame >= 80) {
			this.ly = this.y+this.vh/9*1.5
		}
	}
}

export class Kunti {
    /**
     * 
     * @param {CanvasRenderingContext2D} c
     * @param {number} x 
     * @param {number} y 
     * @param {number} w
     * @param {number} h
	 * @param {number} vw
     * @param {number} vh
     */
	constructor(c, x, y, w, h, vw, vh) {
		this.c = c
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.vw = vw
		this.vh = vh
		this.sx = 0
		this.sw = 1179.106/4
		this.sh = 318.419
		this.img = new Image()
		this.img.src = "/images/kunti-01.svg"
	}
	draw() {
		// this.c.beginPath()
		// this.c.strokeStyle = "black"
		// this.c.rect(this.x, this.y, this.w, this.h)
		// this.c.stroke()

		// shadow
		this.c.beginPath()
		this.c.fillStyle = "#13313c"
		this.c.roundRect(this.x, this.vh/9*6.6, this.w, this.h*0.08, this.h*0.04 )
		this.c.fill()
		
		// sprite
		this.c.drawImage(this.img, this.sx, 0, this.sw, this.sh, this.x, this.y, this.w, this.h)
	}
	/**
     * 
     * @param {number} frame
     */
	update(frame) {
		// console.log(Math.round(timestep))
		if(frame % 12 == 0) {
			if(this.sx < this.sw*3) {
				this.sx+=this.sw
			} else {
				this.sx = 0
			}
		}
	}
}