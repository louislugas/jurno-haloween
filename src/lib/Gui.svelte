<script>
	import { onMount } from "svelte";

    export let score = 0
    export let level = 0
    export let hitObstacle = false
    export let hitBonus = false
    export let viewportHeight, viewportWidth
    let help = true

    onMount(() => {
        setTimeout(() => {
            help = false
        }, 5000)
    })
</script>

<!-- <section class="debug">
    <h1>Level:{level}</h1>
    <h1>Score:{Math.round(score)}</h1>
    <p
        style:background-color={hitObstacle ? "red" : "antiquewhite"}
        style:color={hitObstacle ? "white" : "black"}
    >obstacle hit:{hitObstacle}</p>
    <p
        style:background-color={hitBonus ? "forestgreen" : "antiquewhite"}
        style:color={hitBonus ? "white" : "black"}
    >bonus hit:{hitBonus}</p>
</section> -->
<section class="score">
    <h1
        style:font-size={viewportWidth > 800 ? "3rem" : "1rem"}
    >
        {#each Array(7-Math.round(score).toLocaleString().length) as _ }
            <span
                style:text-shadow={viewportWidth > 800 ? "4px 4px #051519" : "2px 2px #051519"}
            >0</span>
        {/each}
        <span 
            style:margin-left={viewportWidth > 800 ? "-0.6rem" : "-0.4rem"}
            style:text-shadow={viewportWidth > 800 ? "4px 4px #051519" : "2px 2px #051519"}
            >{Math.round(score)}</span>
    </h1>
</section>
<section class="help"
    style:display={help ? "flex" : "none"}
>
    <h1 class="help-text">press <strong>space</strong> or <strong>tap</strong> to jump</h1>
</section>

<style>
    section {
        width:100%;
        height:100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        pointer-events: none;
        position: absolute;
    }
    .help {
        justify-content:center;
    }
    .debug {
        /* display:none; */
    }
    .score {
        align-items: flex-start;
        font-family: 'Bungee', sans-serif;
        color:#eeeeee;
    }
    h1 {
        font-size: 2rem;
        margin:0;
    }
    .score > h1 {
        margin-left:2rem;
        font-size: 3rem;
    }
    p {
        margin:0;
        background-color: antiquewhite;
        font-size: 1rem;
        padding:0.2rem;
    }
    .help-text {
        color:white;
        font-size: 1.5rem;
        text-shadow:2px 2px black;

    }
    strong {
        color:#f19d3d;
    }
</style>
