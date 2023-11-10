<script>
	import { Player } from '$lib/player'
	import { Ground, NearBackground } from '$lib/background'
	import { Obstacle } from '$lib/obstacle'
	import { onMount } from 'svelte'
	import BezierEasing from 'bezier-easing'
	import Gui from '$lib/Gui.svelte'

	const easeOut = BezierEasing(0.33, 1, 0.68, 1);
	const easeIn  = BezierEasing(0.32, 0, 0.67, 0);
	
	let 
		/** @type {HTMLCanvasElement} canvas */ canvas,
		/** @type {CanvasRenderingContext2D|null} ctx */ ctx,
		/** @type {HTMLElement} element */ element,
		/** @type {HTMLElement} article */ article,
		/** @type {number} viewportHeight */ viewportHeight,
		/** @type {number} viewportWidth */ viewportWidth, 
		/** @type {number} animId */ animId,
		/** @type {HTMLElement} buttonContainer */ buttonContainer,
		/** @type {Player} player */ player,
		/** @type {Ground} ground */ ground,
		/** @type {boolean} play state*/ play = false,
		/** @type {boolean} jump state*/ jump,
		/** @type {number|undefined} startJump */ startJump = undefined,
		/** @type {number|undefined} startFall */ startFall = undefined,
		/** @type {number} duration */ duration = 500,
		/** @type {number} elapsed time*/ elapsedTime,
		/** @type {boolean} status idle or not jumping */ idle = true,
		/** @type {number} idle position in pixels = canvas.height - player object height */ idlePos = 300,
		/** @type {number} distance to jump = (canvas.height - player object height) /2 */ distance = 150,
		/** @type {number} player x position */ playerx,
		/** @type {number} player x position */ playery,
		/** @type {number} player x position */ playerw,
		/** @type {number} player x position */ playerh,
		/** @type {number} score */ score = 0,
		/** @type {NearBackground} background object near - non */ nearBackground,
		/** @type {Obstacle} obstacle object */ obs,
		/** @type {number} background speed */ bgSpeed = 4,
		/** @type {number} obstacle speed */ obsSpeed = bgSpeed + (bgSpeed/2),
		/** @type {number} far background speed */ farSpeed = bgSpeed/4,
		/** @type {Array.<NearBackground>} near background array */ nearBgArray = [],
		/** @type {Array.<Obstacle>} obstacle array */ obstacleArray = [],
		/** @type {boolean} first time play or not*/ firstTime = false,
		/** @type {boolean} landscape or portrait */ isPortrait = false

	/**
	 * 
	 * @param {any} e
	 */
	function keydown(e) {
		if(play) {
			if(e.code == "Space") {
				if(!jump && idle) {
					jump = true	
					idle = false
				}
			}
		}
	}

	function handleClick() {
		if(play) {
			if(!jump && idle) {
				jump = true	
				idle = false
			}
		}
	}

	function resizeButton() {
		buttonContainer.style.width = canvas.width*.9 + "px"
		buttonContainer.style.height = canvas.height*.9 + "px"
	}

	function resizeScreen() {
		if (document.fullscreenElement) { // enter fullscreen
			if (screen.orientation.type == "portrait-primary") { // on mobile
				article.style.transform = "rotate(90deg)"
				// screen.orientation.lock("landscape-primary");
				canvas.width = viewportWidth*16/9
				canvas.height = viewportWidth

				//rerun any animation
				player.draw()
				ground.draw()
			} 
			else { // on desktop
				canvas.width = viewportWidth
				canvas.height = viewportWidth/16*9

				//rerun any animation
				player.draw()
				ground.draw()
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
				player.draw()
				ground.draw()
			},200)
		}
	}

	function initAnimation () {
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
			playerw = canvas.height/10
			playerh = canvas.height/10

			idlePos = canvas.height/3*2

			playerx = canvas.width/2-(playerw/2)
			playery = idlePos - playerh

			distance = playerh*2
			
			player = new Player(ctx, playerx, playery, playerw, playerh)
			player.draw()

			ground = new Ground(ctx, idlePos, playerh, canvas.width, canvas.height)
			ground.draw()

			for(let i = 0; i< 10; i++) {
				nearBackground = new NearBackground(ctx, canvas.width + i*300, idlePos-(idlePos/2), idlePos/2, idlePos/2, i)
				nearBgArray.push(nearBackground)
			}

			nearBgArray.forEach((d) => {
				d.draw()
			})

			for(let i = 0; i< 10; i++) {
				obs = new Obstacle(ctx, canvas.width + i * 600 + Math.random() * 200, playery, playerw, playerh, i)
				obstacleArray.push(obs)
			}

			obstacleArray.forEach((d) => {
				d.draw()
			})

			
		}
		firstTime = true
	}
	onMount(() => {
		if(screen.orientation.type == "landscape-primary") {
			isPortrait = false
		} else if (screen.orientation.type == "portrait-primary") {
			isPortrait = true
		}
		resizeButton()

	})


	// console.log(isPortrait)

	
	 // @ts-ignore
	 function animate(timestep) {
		score += 0.05
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ground.draw()
		
			if(idle) { // idle
				player.update(1, playery, distance, jump, idle)
				player.draw()
				
			} 
			else {
				if (jump) { // jump
					if (startJump == undefined) {
						startJump = timestep
					} else {
						elapsedTime = timestep - startJump
						if (elapsedTime < duration) {
							let ease = easeOut(elapsedTime/duration)
							player.update(ease, playery, distance, jump, idle)
							player.draw()
						} else {
							jump = false
							startJump = undefined
							startFall = undefined
						}
					}
					
				} else { // fall
					if (startFall == undefined) {
						startFall = timestep
					} else {
						elapsedTime = timestep - startFall
						if (elapsedTime < duration) {
							let ease = easeIn(elapsedTime/duration)
							player.update(ease, playery, distance, jump, idle)
							player.draw()
						} else {
							jump = false
							idle = true
						}
					}
					
				}
			}

			let l = nearBgArray.length
			if ( l == 10 ) {
				if(nearBgArray[l-1].x < canvas.width) {
					for(let i = 0; i< 10; i++) {
						nearBackground = new NearBackground(ctx, canvas.width + (i+1)*300, idlePos-(idlePos/2), idlePos/2, idlePos/2, i)
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

			let o = obstacleArray.length
			if ( o == 10 ) {
				if(obstacleArray[o-1].x < canvas.width) {
					for(let i = 0; i< 10; i++) {
						obs = new Obstacle(ctx, canvas.width + i * 600 + Math.random() * 200 + canvas.width, playery, playerw, playerh, i)
						obstacleArray.push(obs)
					}
				}
			} else if ( o == 20 ) {
				if(obstacleArray[o/2 -1].x + obstacleArray[o/2 -1].w < 0) {
					obstacleArray.splice(0,10)
				}
			}

			obstacleArray.forEach((d) => {
				d.update(obsSpeed)
				d.draw()
			})

			player.draw()
			
			animId = requestAnimationFrame(animate)
		}
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
					initAnimation()
					setTimeout(() => {
						play = true
						animate()
					}, 100)
				}			
			} 
			else if (screen.orientation.type == "portrait-primary" && play == false) { // mobile
				if (article != document.fullscreenElement) {
					if (article.requestFullscreen) {
						article.requestFullscreen();
					} 
					// else if (article.webkitRequestFullscreen) { /* Safari */
					// 	article.webkitRequestFullscreen();
					// } else if (article.msRequestFullscreen) { /* IE11 */
					// 	article.msRequestFullscreen();
					// }
					article.style.transform = "rotate(90deg)"
					// screen.orientation.lock("landscape-primary");
					if (firstTime) {
						setTimeout(() => {
							play = true
							animate()
						}, 100)
					} 
					else {
						initAnimation()
						setTimeout(() => {
							play = true
							animate()
						}, 100)
					}
				} 
			}
		}
		else if (play)  {
			play = false
			if (article == document.fullscreenElement) {
				// screen.orientation.unlock()
				document.exitFullscreen()
				article.style.transform = "rotate(0deg)"
				resizeButton()
			}	
			cancelAnimationFrame(animId)
		}
	}



</script>

<svelte:window
	bind:innerHeight={viewportHeight}
	bind:innerWidth={viewportWidth}
	on:click={handleClick}
	on:keydown={keydown}
></svelte:window>

<svelte:body
	on:fullscreenchange={(e) => {
		resizeScreen()
		resizeButton()
	}}
/>

<main>

	<article bind:this={article}>
		
		<div 
			style:height={viewportWidth/viewportHeight > 16/9 ? "100vh" : viewportWidth/16*9 + "px"}	
			class="frame" 
			bind:this={element}>
				<canvas bind:this={canvas}>
				</canvas>
				<div 
					bind:this={buttonContainer}
					style:justify-content={play ? "flex-start" : "center"}
					style:align-items={play ? "flex-end" : "center"}
				>
					<!-- {#if canvas}
					<h1>{viewportWidth} x {viewportHeight}</h1>
					<br>
					<h1>{canvas.width} x {canvas.height}</h1>
					{/if} -->
					{#if !play}
						{#if !isPortrait}
							<button on:click={openFullscreen}>Play</button>
						{:else if isPortrait}
							<button on:click={openFullscreen}>Go FullScreen</button>
						{/if}
					{/if}
					{#if play}
					<button on:click={openFullscreen}>X</button>
					{/if}
				</div>
			
		</div>
		<div 
			style:height={viewportWidth/viewportHeight > 16/9 ? "100vh" : viewportWidth/16*9 + "px"}	
			class="gui" >
            <h1 style:margin="0">Desktop</h1>
            {#if canvas}
                <h2>w:{canvas.width} x h:{canvas.height}</h2>
            {/if}
			<Gui {score}/>
		</div>
	</article>
	
</main>

<style>
	:global(body, html) {
		margin:0;
		padding:0;
	}
	canvas {
		border:solid 1px black;
	}
	main {
		overflow: hidden;
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
		pointer-events: none;
	}
	.frame:fullscreen {
		transform: rotate(90deg);
	}
	.frame > div {
		position:absolute;
		display: flex;
		flex-direction: column;
		border:solid 1px red;
	}
	/* h1 {
		color:black;
		margin:0;
	} */
	.frame > div > button {
		padding:0.5rem;
		font-size:1rem;
		background-color:rgba(0,0,0,0.5);
		border-radius:0.2rem;
		color:lightgrey;
		font-family:monospace;
	}
	* {
		white-space: normal;
	}
	article {
		background-color:white;
		display:flex;
		justify-content: center;
		align-items: center;
		height:100vh;
		position:relative;
	}
	:global(svelte-scroller-foreground) {
		pointer-events: none;
	}
	:global(svelte-scroller-background) {
		pointer-events: auto !important;
		z-index: 1000;
	}
	:root {
		--divider-color:#1a676f;
	}
</style>