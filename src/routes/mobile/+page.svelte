<script>
// @ts-nocheck

	import { Player, Kunti, Tali } from '$lib/player'
	import { Ground, NearBackground, Trotoir, Sky, City, MoonCloud} from '$lib/background'
	import { Bonus } from '$lib/bonus'
	import { Obstacle } from '$lib/obstacle'
	import { onMount } from 'svelte'
	import BezierEasing from 'bezier-easing'
	import Gui from '$lib/Gui.svelte'
	import PopQuiz from '$lib/PopQuiz.svelte';
	import GameOver from '$lib/GameOver.svelte';

	import supabase from '$lib/db'

	const easeOut = BezierEasing(0.33, 1, 0.68, 1);
	const easeIn  = BezierEasing(0.32, 0, 0.67, 0);

	let bgAudio, bonusAudio, jumpAudio, loseAudio
	let /** @type {boolean} canvas */ audioPlay = true

	function toggleSound() {
		audioPlay = !audioPlay
		if (!audioPlay) {
			bgAudio.pause()
			bgAudio.currentTime = 0
		} else {
			if (play) {
				bgAudio.play()
			}
		}
	}
	
	let 
		/** @type {HTMLCanvasElement} canvas */ canvas,
		/** @type {CanvasRenderingContext2D|null} ctx */ ctx,
		/** @type {HTMLElement} element */ element,
		/** @type {HTMLElement} article */ article,
		/** @type {number} viewportHeight */ viewportHeight,
		/** @type {number} viewportWidth */ viewportWidth, 
		/** @type {number} animId */ animId,
		/** @type {Player} player */ player,
		/** @type {Ground} ground */ ground,
		/** @type {Sky} background langit */ sky,
		/** @type {MoonCloud} background langit */ moonCloud,
		/** @type {City} background gedung kota */ city,
		/** @type {Kunti} karakter kuntilanak */ kunti,
		/** @type {Tali} tali */ tali,
		// /** @type {Tree} background pohon */ tree,
		/** @type {boolean} play state*/ play = false,
		/** @type {boolean} jump state*/ jump,
		/** @type {number|undefined} startJump */ startJump = undefined,
		/** @type {number|undefined} startFall */ startFall = undefined,
		/** @type {number|undefined} startHit */ startHit = undefined,
		/** @type {number} duration */ duration = 30,
		/** @type {number} elapsed time*/ elapsedTime,
		/** @type {boolean} status idle or not jumping */ idle = true,
		/** @type {number} idle position in pixels = canvas.height - player object height */ idlePos = 300,
		/** @type {number} distance to jump = (canvas.height - player object height) /2 */ distance,
		/** @type {number} player x position */ playerx,
		/** @type {number} player x position */ playery,
		/** @type {number} player x position */ playerw,
		/** @type {number} player x position */ playerh,
		/** @type {number} enemy w position */ enemyw,
		/** @type {number} enemy h position */ enemyh,
		/** @type {number} kunti x position */ kuntix,
		/** @type {number} kunti y position */ kuntiy,
		/** @type {number} kunti w position */ kuntiw,
		/** @type {number} kunti h position */ kuntih,
		/** @type {number} level number */ level = 0,
		/** @type {number} score */ score = 0,
		/** @type {NearBackground} background object near - non */ nearBackground,
		/** @type {Trotoir} Trotoir canstein object */ trotoir,
		/** @type {Obstacle} obstacle object */ obs,
		/** @type {Bonus} obstacle object */ bonus,
		/** @type {number} background speed */ bgSpeed,
		/** @type {number} obstacle speed */ obsSpeed,
		/** @type {number} far background speed */ farSpeed,
		/** @type {Array.<NearBackground>} near background array */ nearBgArray = [],
		/** @type {Array.<Trotoir>} near background array */ trotoirArray = [],
		/** @type {Array.<Obstacle>} obstacle array */ obstacleArray = [],
		/** @type {Array.<Bonus>} obstacle array */ bonusArray = [],
		/** @type {Array.<City>} obstacle array */ cityArray = [],
		/** @type {boolean} first time play or not*/ firstTime = false,
		/** @type {boolean} landscape or portrait */ isPortrait = false,
        /** @type {boolean} fullscreen on portrait */ isPortraitFullscreen = false,
		/** @type {number} game frame count */ gameFrame = 0,
		/** @type {number} speed multiplier for different platform calibration */ speedMultiplier = 0.035,
		/** @type {number} obstacle distance multiplier 1*/ obsMultiplier = 15,
		/** @type {number} obstacle distance multiplier to random number*/ obsRndMultiplier = 6,
		/** @type {number} adding speed counter*/ speedCount = 0,
		/** @type {boolean} hit obstacle condition */ hitObstacle = false,
		/** @type {boolean} hit bonus condition */ hitBonus = false,
		/** @type {number} hit bonus type */ hit = 0,
		/** @type {boolean} popquiz condition */ popquiz = false,
		/** @type {boolean} popquiz condition */ afterpopquiz = false,
		/** @type {number} animation frame count*/ animFrame = 0,
		/** @type {boolean} lose condition*/ lose = false,
		/** @type {boolean} game ready mounted condition*/ gameReady = false

	let leaderBoard

	
	async function getData() {
			let { data, error } = await supabase
				.from('haloween_score')
				.select('name, score')
			leaderBoard = data
			if(error) {
				window.alert(error.message+"\nPlease check your connection and refresh your page")
			}
    }


	/**
	 * 
	 * @param {any} e
	 */
	function keydown(e) {
		if(play) {
			if(e.code == "Space") {
				if(!hitObstacle) {
					if(!jump && idle) {
						if (audioPlay) {
							jumpAudio.play()
							setTimeout(() => {
								jumpAudio.pause()
								jumpAudio.currentTime = 0
							},200)
						}
						jump = true	
						idle = false
					}
				}
			}
		}
	}

	function handleClick() {
		if(play) {
			if(!hitObstacle) {
				if(!jump && idle) {
					if (audioPlay) {
						jumpAudio.play()
						setTimeout(() => {
							jumpAudio.pause()
							jumpAudio.currentTime = 0
						},200)
					}
					jump = true	
					idle = false
				}
			}
		}
	}

	// function resizeButton() {
	// 	buttonContainer.style.width = canvas.width*.9 + "px"
	// 	buttonContainer.style.height = canvas.height*.9 + "px"
	// }

	function resizeScreen() {
		if (document.fullscreenElement) { // enter fullscreen
			if (screen.orientation.type == "portrait-primary") { // on mobile
				article.style.transform = "rotate(90deg)"
				// screen.orientation.lock("landscape-primary");
				canvas.width = viewportWidth*16/9
				canvas.height = viewportWidth

				//rerun any animation
				// player.draw()
				// ground.draw()
			} 
			else { // on desktop
				canvas.width = viewportWidth
				canvas.height = viewportWidth/16*9

				//rerun any animation
				// player.draw()
				// ground.draw()
			}
		} 
		else { // exit fullscreen
			setTimeout(() => {
				if(screen.orientation.type == "landscape-primary") { // landscape
					if(viewportWidth/viewportHeight > 16/9) {
						canvas.width = viewportHeight/9*16
						canvas.height = viewportHeight
						// window.alert("C")
					} else if (viewportWidth < viewportHeight){
						canvas.width = viewportWidth
						canvas.height = viewportWidth/16*9
						// window.alert("D")
					}
				}
				else if (screen.orientation.type == "portrait-primary") { // portrait
					canvas.width = viewportWidth
					canvas.height = viewportWidth/16*9
					
				}

				//rerun any animation
				// player.draw()
				// ground.draw()
			},200)
		}
	}

	function initAnimation() {

		// console.log("init")
		if(viewportWidth/viewportHeight > 16/9) {
			canvas.width = viewportHeight/9*16
			canvas.height = viewportHeight
		} 
		else {
			canvas.width = viewportWidth
			canvas.height = viewportWidth/16*9
		}

		ctx = canvas.getContext("2d")

		if (ctx) {
			if (audioPlay) {
				bgAudio.play()
			}
			
			bgSpeed = canvas.width/9*speedMultiplier
			obsSpeed = bgSpeed + (bgSpeed/2)
			farSpeed = bgSpeed/4

			sky = new Sky(ctx, canvas.width, canvas.height)
			sky.draw()

			moonCloud = new MoonCloud(ctx, 0, canvas.width, canvas.height, 0)
			moonCloud.draw()

			for(let i = 0; i<3; i++) {
				city = new City(ctx, i*canvas.height/9*25, canvas.width, canvas.height, i)
				cityArray.push(city)
			}

			cityArray.forEach((d) => {
				d.draw()
			})

			playerw = canvas.height/9*2.436
			playerh = canvas.height/9*2.532

			enemyw = canvas.height/9*1.65
			enemyh = canvas.height/9*2.07

			idlePos = canvas.height/3*2

			playerx = canvas.height/9*4.6
			playery = canvas.height/9*4.74

			kuntix = canvas.height/9*9.78
			kuntiy = canvas.height/9*2.34

			kuntiw = canvas.height/9*1.71
			kuntih = canvas.height/9*1.91

			distance = canvas.height/3

			tali = new Tali(ctx, playerx, playery, playerw, playerh, canvas.width, canvas.height)
			tali.draw()
			
			player = new Player(ctx, playerx, playery, playerw, playerh, canvas.width, canvas.height)
			player.draw()

			kunti = new Kunti(ctx, kuntix, kuntiy, kuntiw, kuntih, canvas.width, canvas.height)
			kunti.draw()

			ground = new Ground(ctx, idlePos, playerh, canvas.width, canvas.height)
			ground.draw()

			for(let i = 0; i< 10; i++) {
				nearBackground = new NearBackground(ctx, i*canvas.height/9*5, canvas.height/9*0.908, canvas.height/9*4.32, canvas.height/9*5.092, i)
				nearBgArray.push(nearBackground)
			}

			nearBgArray.forEach((d) => {
				d.draw()
			})

			// for(let i = 0; i< 10; i++) {
			// 	tree = new Tree(ctx, i * 600 + Math.random() * 200, canvas.height/3*2, canvas.width, canvas.height, i)
			// 	treeArray.push(tree)
			// }

			// treeArray.forEach((d) => {
			// 	d.draw()
			// })

			for(let i = 0; i<100; i++) {
				trotoir = new Trotoir(ctx, i*canvas.height/9*1.45, 0, canvas.width, canvas.height, i)
				trotoirArray.push(trotoir)
			}

			

			trotoirArray.forEach((d) => {
				d.draw()
			})

			for(let i = 0; i< 10; i++) {
				obs = new Obstacle(ctx, ( 2.5 * canvas.width) + i * canvas.height/9*obsMultiplier + Math.random() * canvas.height/9*obsRndMultiplier, playery, canvas.width, canvas.height, i)
				obstacleArray.push(obs)
			}

			obstacleArray.forEach((d) => {
				d.draw()
			})

			for(let i = 0; i< 5; i++) {
				bonus = new Bonus(ctx, ( 3 * canvas.width) + i * canvas.height/9*obsMultiplier*2 + Math.random() * canvas.height/9*obsRndMultiplier, distance, canvas.width, canvas.height, i)
				bonusArray.push(bonus)
			}

			bonusArray.forEach((d) => {
				d.draw()
			})

			
		}
		firstTime = true
	}

	onMount(async () => {

		bgAudio = new Audio()
		bgAudio.src = "audio/audio_game_haloween.mp3"
		bgAudio.loop = true
		bgAudio.volume = 0.3
		bgAudio.pause()
		bgAudio.currentTime = 0

		loseAudio = new Audio()
		loseAudio.src = "audio/audio_lose.mp3"
		loseAudio.volume = 0.5

		jumpAudio = new Audio()
		jumpAudio.src = "audio/audio_jump.mp3"

		bonusAudio = new Audio()
		bonusAudio.src = "audio/audio_hit_bonus.mp3"

		await getData()
		// console.log(leaderBoard)

		if(screen.orientation.type == "landscape-primary") {
			isPortrait = false
		} else if (screen.orientation.type == "portrait-primary") {
			isPortrait = true
		}
		// resizeButton()
		gameReady = true
		// console.log("ready")
	})

	 // @ts-ignore
	 function animate(timestep) {
		// console.log(ctx)
		if (!hitObstacle) {
			score += 0.05
		}
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			sky.draw()
			moonCloud.draw()

			let c = cityArray.length
			// console.log(c)
			if ( c == 3 ) {
				// console.log(cityArray[c-1].x, cityArray[c-1].w)
				if(cityArray[c-1].x < canvas.width) {
					// console.log("city pass")
					for(let i = 0; i<3; i++) {
						city = new City(ctx, i*canvas.height/9*25 + cityArray[c-1].w - 2 + canvas.width, canvas.width, canvas.height, i)
						cityArray.push(city)
					}
				}
			} else if ( c == 6 ) {
				if(cityArray[c/2 -1].x + cityArray[c/2 -1].w < 0) {
					cityArray.splice(0,3)
				}
			}

			cityArray.forEach((d) => {
				d.update(farSpeed)
				d.draw()
			})

			ground.draw()
			

			trotoirArray.forEach((d) => {
				d.update(obsSpeed * 1.2)
				d.draw()
			})
		
			if(idle) { // idle
				// console.log("idle")
				if (hitObstacle) {
					if (audioPlay) {
						bgAudio.pause()
						loseAudio.play()
					}
					
					if (startHit == undefined) {
							startHit = gameFrame
						}
					bgSpeed-=0.02
					obsSpeed = bgSpeed + (bgSpeed/2)
					farSpeed = bgSpeed/4
					if(startHit) {
						tali.fall(gameFrame-startHit)
						tali.draw()
						player.fall(gameFrame-startHit)
						player.draw()
					}
					setTimeout(() => {
						lose = true
					}, 500)
					setTimeout(() => {
						// play = false
						cancelAnimationFrame(animId)
					}, 1500)
				} else {
					// tali.update(1, playery, distance, jump, idle, gameFrame)
					tali.draw()
					player.update(1, playery, distance, jump, idle, gameFrame)
					player.draw()
				}
			} 
			else {
				if (jump) { // jump
					if (hitObstacle) {
						if(audioPlay) {
							bgAudio.pause()
							loseAudio.play()
						}
						jump = false
						startJump = undefined
						startFall = undefined
						idle = true
					}
					if (startJump == undefined) {
						startJump = animFrame
					} else {
						elapsedTime = animFrame - startJump
						if (elapsedTime < duration) {
							let ease = easeOut(elapsedTime/duration)
							tali.update(ease, playery, distance, jump, idle, gameFrame)
							tali.draw()
							player.update(ease, playery, distance, jump, idle, gameFrame)
							player.draw()
						} else {
							jump = false
							startJump = undefined
							startFall = undefined
						}
					}
					
				} else { // fall
					if (startFall == undefined) {
						startFall = animFrame
					} else {
						if (animFrame) {
							elapsedTime = animFrame - startFall
							// console.log(elapsedTime)
							if (elapsedTime < duration) {
								let ease = easeIn(elapsedTime/duration)
								tali.update(ease, playery, distance, jump, idle, gameFrame)
								tali.draw()
								player.update(ease, playery, distance, jump, idle, gameFrame)
								player.draw()
							} else {
								jump = false
								idle = true
								afterpopquiz = false
							}
						}
						
					}
					
				}
			}

			let l = nearBgArray.length
			if ( l == 10 ) {
				if(nearBgArray[l-1].x < canvas.width) {
					for(let i = 0; i< 10; i++) {
						nearBackground = new NearBackground(ctx, i*canvas.height/9*5+canvas.width+canvas.height/9*5, canvas.height/9*0.908, canvas.height/9*4.32, canvas.height/9*5.092, i)
						nearBgArray.push(nearBackground)
					}
				}
			} else if ( l == 20 ) {
				if(nearBgArray[l/2 -1].x + nearBgArray[l/2 -1].w < 0) {
					nearBgArray.splice(0,10)
				}
			}
			
			nearBgArray.forEach((d) => {
				d.update(bgSpeed)
				d.draw()
			})

			let t = trotoirArray.length
			if ( t == 100 ) {
				if(trotoirArray[t-1].x < canvas.width) {
					// console.log("pass")
					for(let i = 0; i< 100; i++) {
						trotoir = new Trotoir(ctx, i*canvas.height/9*1.45 + canvas.height/9*1.45, 0, canvas.width, canvas.height, i)
						trotoirArray.push(trotoir)
					}
				}
			} else if ( t == 200 ) {
				if(trotoirArray[t/2 -1].x + canvas.height/9*1.4 < 0) {
					trotoirArray.splice(0,100)
				}
			}
			
			tali.draw()
			player.draw()
			kunti.update(gameFrame)
			kunti.draw()
			

			let o = obstacleArray.length
			if ( o == 10 ) {
				if(obstacleArray[o-1].x < canvas.width) {
					if (level % 1 == 0) {
						if (obsMultiplier > 11) {
							obsMultiplier--
						} else {
							obsMultiplier = 15
						}
						if (obsRndMultiplier > 2) {
							obsRndMultiplier--
						} else {
							obsRndMultiplier = 6
						}
						// console.log("level ", level)
						// console.log("obstacle ",obsMultiplier, obsRndMultiplier)
						// console.log("speed ", bgSpeed, obsSpeed, farSpeed)
					}
					for(let i = 0; i< 10; i++) {
						obs = new Obstacle(ctx, canvas.width + i * canvas.height/9*obsMultiplier + Math.random() * canvas.height/9*obsRndMultiplier + canvas.width, playery, canvas.width, canvas.height, i)
						obstacleArray.push(obs)
					}
				}
			} else if ( o == 20 ) {
				if(obstacleArray[o/2 -1].x + obstacleArray[o/2 -1].w < 0) {
					obstacleArray.splice(0,10)
				}
			}

			obstacleArray.forEach((d) => {
				if (player.cx1 + player.cx2 > d.x && player.cx1 + player.cx2 < d.x + d.w && d.topY < player.cy) {
					hitObstacle = true
				}
				d.update(obsSpeed, gameFrame)
				d.draw()
			})

			
			let b = bonusArray.length
			// console.log(b)
			if ( b == 5 ) {
				if(bonusArray[b-1].x < canvas.width) {
					for(let i = 0; i< 5; i++) {
						bonus = new Bonus(ctx, canvas.width + i * canvas.height/9*obsMultiplier*2 + Math.random() * canvas.height/9*obsRndMultiplier + canvas.width, distance, canvas.width, canvas.height, i)
						bonusArray.push(bonus)
					}
				}
			} else if ( b == 10 ) {
				if(bonusArray[b/2 -1].x + bonusArray[b/2 -1].w < 0) {
					bonusArray.splice(0,5)
				}
			}

			bonusArray.forEach((d) => {
				if (player.cx1 + player.cx2 > d.cx && player.cx1 + player.cx2 < d.cx + d.cw && d.cy + d.ch > player.y) {
					if(!hitBonus) {
						if (d.type == "bon-1") {
							if (audioPlay) {
								bonusAudio.play()
							}
							d.opacity1 = 0
							score += 10
							hitBonus = true
							hit = 1
							setTimeout(() => {
								hit = 0
								hitBonus = false
							},1000)
						} else if (d.type == "bon-2") {
							hitBonus = true
							hit = 2
							setTimeout(() => {
								hitBonus = false
								hit = 0
							},1000)
						}
						
					}
					
				}
				d.update(obsSpeed, gameFrame, hitBonus)
				d.draw()
			})
			
			animFrame++
			gameFrame++
			animId = requestAnimationFrame(animate)
		}
	}

	function restart() {
		// console.log("restart")
		ctx.clearRect(0,0,canvas.width, canvas.height)
		animFrame = 0
		score = 0
		bgSpeed = canvas.width/9*speedMultiplier
		obsSpeed = bgSpeed + (bgSpeed/2)
		farSpeed = bgSpeed/4
		lose = false
		hitObstacle = false
		trotoirArray = []
		obstacleArray = []
		bonusArray = []
		cityArray = []
		initAnimation()
		animate()
	}

	function openFullscreen() {
		if (!play) { // before start
			if (screen.orientation.type == "landscape-primary") { // desktop
				if (firstTime) {
					setTimeout(() => {
						play = true
						animate()
					}, 100)
				} 
				else {
					setTimeout(() => {
                        initAnimation()
						play = true
						animate()
					}, 100)
				}			
			} 
			else if (screen.orientation.type == "portrait-primary" && play == false) { // mobile

				if (document != document.fullscreenElement) {
					if (document.requestFullscreen) {
						document.requestFullscreen();
					} 
					else if (document.webkitRequestFullscreen) { /* Safari */
						document.webkitRequestFullscreen();
					} else if (document.msRequestFullscreen) { /* IE11 */
						document.msRequestFullscreen();
					}
					article.style.transform = "rotate(90deg)"
					// @ts-ignore
					screen.orientation.lock("landscape-primary");
                    if (!isPortraitFullscreen) {
                        isPortraitFullscreen = true
                    } else {
                        if (firstTime) {
                            setTimeout(() => {
                                play = true
                                animate()
                            }, 100)
                        } 
                        else {
                            initAnimation()
                            play = true
                            animate()
                        }
                    }
					
				} 
			}
		}
		else if (play)  {
			play = false
			if (article == document.fullscreenElement) {
				screen.orientation.unlock()
				document.exitFullscreen()
				article.style.transform = "rotate(0deg)"
				// resizeButton()
			}	
			cancelAnimationFrame(animId)
		}
	}


	$: if (score > 1) {
		level = Math.floor(Math.round(score)/100)
		// console.log(level, "level")				
	}

	$: if (level > 0 && level % 2 == 0) {
		if(speedCount < 7) {
			speedCount++
			bgSpeed+=0.5
			obsSpeed = bgSpeed + (bgSpeed/2)
			farSpeed = bgSpeed/4

			// console.log(speedCount, "speed count")
			// console.log(bgSpeed, "background speed")
			// console.log(obsSpeed, "obstacle speed")
			// console.log(farSpeed, "far background speed")
		}
		
	}
	
	$: if (hitBonus && hit == 2) {
		setTimeout(() => {
			cancelAnimationFrame(animId)
			popquiz = true
		}, 200)
	}
	$: if(afterpopquiz && !popquiz) {
		if (audioPlay) {
			bonusAudio.play()
		}
		score +=50
		animate()
		afterpopquiz = false
	}

	$: if (lose) {
		setTimeout(() => {
			cancelAnimationFrame(animId)
			hitObstacle = false
		},1000)
		
	}
	// $: console.log(startFall)

</script>

<svelte:window
	bind:innerHeight={viewportHeight}
	bind:innerWidth={viewportWidth}
	on:keydown={keydown}
></svelte:window>

<svelte:head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	
	
	<link rel="preload" as="image" href="/images/skater-01.svg">
	<link rel="preload" as="image" href="/images/kunti-01.svg">
	

	<link rel="preload" as="image" href="/images/background-building-01.svg">
	<link rel="preload" as="image" href="/images/background-building-02.svg">
	<link rel="preload" as="image" href="/images/background-building-03.svg">
	<link rel="preload" as="image" href="/images/background-building-04.svg">
	<link rel="preload" as="image" href="/images/background-building-05.svg">
	<link rel="preload" as="image" href="/images/background-building-06.svg">
	<link rel="preload" as="image" href="/images/background-building-07.svg">
	<link rel="preload" as="image" href="/images/background-building-08.svg">
	<link rel="preload" as="image" href="/images/background-building-09.svg">
	<link rel="preload" as="image" href="/images/background-building-10.svg">
	<link rel="preload" as="image" href="/images/background-building-11.svg">
	<link rel="preload" as="image" href="/images/background-building-12.svg">
	<link rel="preload" as="image" href="/images/background-building-13.svg">
	<link rel="preload" as="image" href="/images/background-building-14.svg">
	<link rel="preload" as="image" href="/images/background-building-15.svg">
	<link rel="preload" as="image" href="/images/background-building-16.svg">
	<link rel="preload" as="image" href="/images/background-building-17.svg">
	<link rel="preload" as="image" href="/images/background-building-18.svg">
	<link rel="preload" as="image" href="/images/background-building-19.svg">
	<link rel="preload" as="image" href="/images/background-building-20.svg">
	<link rel="preload" as="image" href="/images/background-building-21.svg">
	<link rel="preload" as="image" href="/images/background-building-22.svg">
	<link rel="preload" as="image" href="/images/background-building-23.svg">
	<link rel="preload" as="image" href="/images/background-building-24.svg">

	<link rel="preload" as="image" href="/images/obstacle_1.svg">
	<link rel="preload" as="image" href="/images/obstacle_2.svg">
	<link rel="preload" as="image" href="/images/obstacle_3.svg">
	<link rel="preload" as="image" href="/images/obstacle_4.svg">

	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Bungee&display=swap" rel="stylesheet">
</svelte:head>

<svelte:body
	on:fullscreenchange={(e) => {
		resizeScreen()
		// resizeButton()
	}}
/>

<main>

	<article bind:this={article}>
	<div class="backdrop"></div>
		
		<div 
			style:height={viewportWidth/viewportHeight > 16/9 ? "100vh" : viewportWidth/16*9 + "px"}	
			class="frame" 
			bind:this={element}>
				<canvas bind:this={canvas}>
				</canvas>			
		</div>
		<div 
			style:height={viewportWidth/viewportHeight > 16/9 ? "100vh" : viewportWidth/16*9 + "px"}	
			class="gui" on:click={handleClick}
			>
            	<!-- <h1 style:margin="0">Mobile</h1>
            {#if canvas}
                <h2>w:{canvas.width} x h:{canvas.height}</h2>
            {/if} -->
			{#if play}
				<Gui {score} {level} {hitObstacle} {hitBonus} {viewportHeight} {viewportWidth}/>
			{/if}
		</div>
		{#if popquiz}
		<div 
			style:height={viewportWidth/viewportHeight > 16/9 ? "100vh" : viewportWidth/16*9 + "px"}	
			class="gui">
            	<!-- <h1 style:margin="0">Mobile</h1>
            {#if canvas}
                <h2>w:{canvas.width} x h:{canvas.height}</h2>
            {/if} -->
			
				<PopQuiz bind:popquiz bind:afterpopquiz bind:lose {animate}/>
			
		</div>
		{/if}
		{#if play && lose}
			<div 
				style:height={viewportWidth/viewportHeight > 16/9 ? "100vh" : viewportWidth/16*9 + "px"}	
				class="gui">
					<!-- <h1 style:margin="0">Mobile</h1>
				{#if canvas}
					<h2>w:{canvas.width} x h:{canvas.height}</h2>
				{/if} -->
				
					<GameOver 
						bind:score 
						{leaderBoard} 
						{restart}
						{viewportHeight} 
						{viewportWidth} 
					/>
				
			</div>
		{/if}
		<div 
			style:height={viewportWidth/viewportHeight > 16/9 ? "100vh" : viewportWidth/16*9 + "px"}	
			class="gui gui-cover" style:pointer-events={play ? "none" : "auto"}>
			{#if !play}
			<div class="cover">
				<!-- <h1>GAME COVER</h1> -->
				<img class="hero" src="./images/tikunti_splash_screen.png" alt="hero splash screen tikunti">
				<div class="buttonContainer">
				
				{#if gameReady}
					{#if !play}
						{#if !isPortrait}
							<button class="start-button sound-button" on:click={toggleSound}>
							{#if audioPlay}
								<span class="material-symbols-outlined">
								volume_up
								</span>
							{:else}
								<span class="material-symbols-outlined">
								volume_off
								</span>
							{/if}
							</button>
							<button class="start-button" on:click={openFullscreen}>Play</button>
						{:else if isPortrait}
							{#if !isPortraitFullscreen}
								<button class="start-button full-button" on:click={openFullscreen}>Go FullScreen</button>
							{:else if isPortraitFullscreen}
								<button class="start-button sound-button" on:click={toggleSound}>
									{#if audioPlay}
										<span class="material-symbols-outlined">
										volume_up
										</span>
									{:else}
										<span class="material-symbols-outlined">
										volume_off
										</span>
									{/if}
								</button>
								<button class="start-button" on:click={openFullscreen}>Play</button>
							{/if}
						{/if}
					{:else}
					<button class="start-button" on:click={openFullscreen}>X</button>
					{/if}
				{:else}
				<h1 class="loading-text">Loading...</h1>
				{/if}
					
				</div>
			</div>
			{:else}
			<div class="fullscreen" style:pointer-events="none">
				<div 
					style:justify-content="flex-end"
					style:align-items="flex-start"
					class="buttonContainer"
				>
					{#if !lose}
						<button on:click={toggleSound} 
							class="start-button sound-button"
							style:border-radius="50%"
							style:margin-right="0.5rem"
							style:margin-top="1.5rem"
							style:pointer-events="auto"
						>
							{#if audioPlay}
								<span class="material-symbols-outlined">
								volume_up
								</span>
							{:else}
								<span class="material-symbols-outlined">
								volume_off
								</span>
							{/if}
						</button>
						<button on:click={openFullscreen} 
							class="start-button"
							style:border-radius="50%"
							style:aspect-ratio="1"
							style:pointer-events="auto"
							style:margin-right="1rem"
							style:margin-top="1.5rem"
						>
							<span class="material-symbols-outlined">
								close
							</span>
						</button>
					{/if}
				</div>
			</div>
			{/if}
		</div>
	</article>
	
</main>

<style>
	* {
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;	
	}
	:global(body, html) {
		margin:0;
		padding:0;
	}
	.material-symbols-outlined {
		font-size: 2.5rem;
		font-variation-settings:
		'FILL' 0,
		'wght' 400,
		'GRAD' 0,
		'opsz' 24,
	}
	canvas {
		/* border:solid 1px black; */
	}
	main {
		overflow: hidden;
	}
	.backdrop {
		width:100%;
		height:100%;
		background-color:#193235a1;
		backdrop-filter: blur(25px);
	}
	.frame {
		/* background-color:cornflowerblue; */
		color:white;
		aspect-ratio:16/9;
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:center;
		font-family:monospace;
		position:absolute;
		z-index:0;
	}
	.gui {
		/* background-color:cornflowerblue; */
		color:black;
		aspect-ratio:16/9;
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:center;
		font-family:monospace;
		position:absolute;
		/* pointer-events: none; */
	}
	.cover {
		width:100%;
		height:100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color:white;
	}
	.buttonContainer {
		width:100%;
		height:100%;
		display:flex;
		position:absolute;
		justify-content: center;
		align-items: center;
	}
	.fullscreen {
		width:100%;
		height:100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color:white;
	}
	.frame:fullscreen {
		transform: rotate(90deg);
	}
	button {
		padding:0.5rem;
		font-size:1rem;
		background-color:rgba(0,0,0,0.5);
		border-radius:0.2rem;
		color:lightgrey;
	}
	.start-button {
		font-family: 'Bungee', sans-serif;
		font-size:3rem;
		cursor:pointer;
		background-color: #f19d3d;
		color:#04152a;
		height:4rem;
		line-height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.sound-button {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.loading-text {
		font-size: 2rem;
	}
	.full-button {
		font-size:1rem;
	}
	* {
		white-space: normal;
	}
	article {
		background-color:#193235;
		/* background-image: url("./images/tikunti_splash_screen.png"); */
		background-position: center;
		backdrop-filter: blur(10px);
		display:flex;
		justify-content: center;
		align-items: center;
		height:100vh;
		position:relative;
	}
	.hero {
		width:100%;
		position:absolute;
	}
	:root {
		--divider-color:#1a676f;
	}
</style>