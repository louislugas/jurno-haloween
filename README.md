# YangLayang: The Game

### Main code : 
[+page.svelte](https://github.com/louislugas/jurno-layangan/blob/main/src/routes/%2Bpage.svelte)

### Data :
- [db.js](https://github.com/louislugas/jurno-layangan/blob/main/src/lib/db.js) --> database library for leaderboard data (supabase)
- [kiteData.js](https://github.com/louislugas/jurno-layangan/blob/main/src/lib/kiteData.js) --> kite database for intro
- [obstacle.js](https://github.com/louislugas/jurno-layangan/blob/main/src/lib/obstacle.js) --> hardcoded obstacle coordinate (y)
- [skyColor.js](https://github.com/louislugas/jurno-layangan/blob/main/src/lib/skyColor.js) --> hardcoded hex color for sky, cloud, text, and star

## Functions

### Database Function
- getData() --> to get score leaderboard data
- insertData() --> to post/insert score and player name into database
- updateLeaderBoard --> postgres realtime listening to every new score

All graphics use native HTML5 `<canvas>` method, and all menu are using `<dialog>` element



