<script>
    import { onMount } from "svelte";  
    import supabase from '$lib/db'

    // export let lose = false
    let gameover,inputName, submitdisable = false, scoreArray
    export let score, leaderBoard
    export let viewportHeight, viewportWidth

    $: if(leaderBoard) {
        leaderBoard.sort((a,b) => b.score - a.score)
        if (viewportWidth < 900) {
            leaderBoard = leaderBoard.slice(0,5)
        } else {
            leaderBoard = leaderBoard.slice(0,10)
        }
        
        scoreArray = leaderBoard.map(d => d.score)
    }

    async function insertData() {
		if (inputName != null || inputName != undefined) {
            if (Math.round(score) > Math.min(...scoreArray)) {
                    let {data, error} = await supabase
                        .from("haloween_score")
                        .insert({name: inputName, score: Math.round(score)})
                        .select()
                    
                    if (data) {
                        leaderBoard.push({
                            name: data[0].name,
                            score: data[0].score
                            })
                        leaderBoard = leaderBoard
                        // console.log(data[0])
                        submitdisable = true
                        window.alert("Score successfully submitted")
                    }
                        
                    if (error) {
                        window.alert(error.message)
                    }
            } 
            // else {
            //     console.log(scoreArray)
            //     console.log(Math.max(...scoreArray))
            //     console.log(Math.min(...scoreArray))
            //     console.log(Math.round(score))
            // }
		} else {
			window.alert("Please insert name")
		}
		
	}

    onMount(() => {
        setTimeout(() => {
            gameover.style.opacity = 1
        }, 200)
    })
</script>

<section bind:this={gameover}>
    <h1
        style:font-size={viewportWidth > 900 ? "3rem" : "2rem"}
        style:line-height={viewportWidth > 900 ? "3rem" : "2rem"}
    >GAME OVER</h1>
    <h1 
        style:color="#efb754"
        style:font-size={viewportWidth > 900 ? "3rem" : "2rem"}
        style:line-height={viewportWidth > 900 ? "3rem" : "2rem"}
    >{Math.round(score)}</h1>
    {#if Math.round(score) > Math.min(...scoreArray)}
    <div class="input">
        <input type="text" placeholder="your name" bind:value={inputName} disabled={submitdisable}>
        <button class="submit"on:click={insertData} disabled={submitdisable}>Submit</button>
    </div>    
    {/if}
    {#if leaderBoard}
        {#each leaderBoard as board, i}
        <p style:margin="0">
            <span>{i+1}.</span>
            <span>{board.name}</span>
            <span>{board.score}</span>
        </p>
        {/each}
    {/if}
    <button class="restart" on:click={() => {location.reload()}}>Restart</button>
    
    <!-- <a href="../mobile">Restart</a> -->
</section>

<style>
    section {
        width:100%;
        height:100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        position: absolute;
        background-color:rgba(25, 50, 53, 0.807);
        opacity:0;
        transition:opacity 500ms ease-in-out;
    }
    h1 {
        font-size: 3rem;
        margin:0;
        margin-top:0.5rem;
        margin-bottom:1rem; 
        font-family: 'Bungee', sans-serif;
        color:#eeeeee;
        text-shadow: 4px 4px #051519;
        line-height:3rem;
    }
    input {
        pointer-events: auto;
        font-size: 1.5rem;
        border-radius: 0.5rem;
        padding-block: 0.2rem;
        padding-left: 0.5rem;
        font-family: monospace;
    }
    button {
        pointer-events: auto;
        cursor: pointer;
        background-color: #efb754;
        color:#051519;
        border-radius: 0.5rem;
        font-size: 1.5rem;
        font-family: monospace;
    }
    .input {
        display:flex;
        margin:1rem;
        /* margin-top:1rem; */
    }
    p {
        color:white;
        font-family: monospace;
        /* background-color: red; */
        width:88%;
        max-width:300px;
        display: flex;
        justify-content: space-between;
        font-size: 1.2rem;
    }
    p > span:first-child {
        width:2rem;
        margin-right:0.5rem;
        text-align: right;
    }
    p > span:nth-child(2) {
        flex-grow: 1;
    }
    .restart {
        margin-top:2rem;
    }
    .submit:disabled {
        background-color: #e6cb9d;
        color:#fffbf3;
        cursor: not-allowed;
    }
</style>
