<script>
    import { onMount } from "svelte";
    // export let score = 0
    // export let level = 0
    // export let hitObstacle = false
    // export let hitBonus = false
    export let 
        /** @type {boolean} popquiz boolean value */ popquiz
        , afterpopquiz, lose
    // @ts-ignore
    export let animate

    let
    /** @type {HTMLElement} pop quiz element */ vignette, 
    /** @type {number} correct answer */ correct, 
    /** @type {number} step */ step, 
    /** @type {Array.<number>} list of answers */ answerList = [], 
    /** @type {number} question? */ question, 
    /** @type {string} mathematic operator */ operator, 
    /** @type {number} first number */ a, 
    /** @type {number} second number */ b, 
    /** @type {number} operator boolean randomizer */ o, 
    /** @type {number} wrong answer */ a1, 
    /** @type {number} wrong answer */ a2,
    /** @type {number} countdown time */ countdown = 5,
    /** @type {any} set Interval for countdown */ countdownInterval

    onMount(() => {
        setTimeout(() => {
            vignette.style.opacity = 1
            countdownInterval = setInterval(() => {
                countdown--
            }, 1000)
        }, 200)
    })

    $: if (countdown == 0) {
        lose = true
        clearInterval(countdownInterval)
    }

	function randomizer() {
		answerList = []
		a = Math.round(Math.random() * 50)
		b = Math.round(Math.random() * a)
		o = Math.round(Math.random())
		if (o == 1) {
			operator = "+"
			correct = a + b
			a1 = Math.round(Math.random() * correct / 2)
			a2 = Math.round(Math.random() * correct + 10)
			answerList.push(correct)
			answerList.push(a1)
			answerList.push(a2)
			answerList.sort((a, b) => 0.5 - Math.random());
			answerList = answerList
		} else {
			operator =  "-"
			correct = a - b
			a1 = Math.round(Math.random() * correct / 2)
			a2 = Math.round(Math.random() * correct + 10)
			answerList.push(correct)
			answerList.push(a1)
			answerList.push(a2)
			answerList.sort((a, b) => 0.5 - Math.random());
			answerList = answerList
		}
	}

    // @ts-ignore
	function check(e) {
		if (parseInt(e.target.innerHTML) == correct) {
            vignette.style.opacity = 0
            setTimeout(() => {
                popquiz = false
                afterpopquiz = true
                randomizer()
            }, 200)
		} else {
            vignette.style.opacity = 0
            setTimeout(() => {
                popquiz = false
                afterpopquiz = true
                lose = true
            }, 200)
		}
	}

    randomizer()
</script>

<section class="debug" bind:this={vignette}>
<div class="vignette"></div>
<div class="quiz-container">
    <!-- {#if a} -->
        <h1 class="timer">
        <span class="material-symbols-outlined">
    timer
    </span> 00:0{countdown}</h1>
        <h1 style:margin-top="0" class="question">{a}{operator}{b}=?</h1>
        <div class="button-container">
        {#each answerList as ans}
            <button on:click={check}>{ans}</button>
        {/each}
        </div>
       
    <!-- {/if} -->
</div>
    
</section>

<style>
    .vignette {
        background: radial-gradient(transparent, rgba(0,0,0,0.5));
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height:100%;
    }
    .question {
        color:#f8e4c5;
    }
    .timer {
        color:#efb754;
        font-size: 1rem;
    }
    .timer > span {
        font-size:1rem;
    }
    .material-symbols-outlined {
        font-variation-settings:
        'FILL' 0,
        'wght' 700,
        'GRAD' 0,
        'opsz' 24
    }
    section {
        width:100%;
        height:100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        pointer-events: none;
        position: absolute;
        transition:opacity 200ms ease-in-out;
        opacity:0;
    }
    .quiz-container {
        width:88%;
        max-width:200px;
        background-color:#0d2123;
        aspect-ratio: 0.9;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 3rem;
    }
    .button-container {
        width:80%;
        margin:auto;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    button {
        pointer-events: auto !important;
        font-size: 1.5rem;
        width: 100%;
        margin-bottom:0.5rem;
        border-radius: 0.5rem;
        background-color: #efb754;
        color:#051519;
        font-weight: 700;
        font-family: monospace;
        cursor: pointer;
        transition:background 200ms ease-in-out;
    }
    button:hover {
        background-color: #f8e4c5;
    }
    .debug {
        /* display:none; */
        display:flex;
        align-items:center;
        justify-content: center;
        background-color:#193235bf;
    }
    h1 {
        font-size: 2rem;
        margin:0;
        margin-top:1rem;
    }
    p {
        margin:0;
        background-color: antiquewhite;
        font-size: 1rem;
        padding:0.2rem;
    }
</style>
