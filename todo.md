- [x] update guesses to be attempts or something more descriptive
- [x] guess warframeToGuess to items to guess or something more descriptive
- [x] begin working on sqlite server and drizzle and setup daily data in db
- [x] try to setup a schedule to add a new daily everyday
- [x] try to find icon for revives
- [x] style combobox better
- updated component names to be multi word
- figure out better component structure for abilities

- sometimes when I reload, classicUnlimited is null but everything is populated until I go to the home page and reload

- [x] add styled buttons for settings and color toggle to top navbar
- [x] create options bar
- [x] properly space stuff out

- [x] reloading with a hydration error breaks other game mode
- [ ] Timer starts as NaN for all values before quickly updating
- [x] add scroll to grid on mobile
- [ ] move image name over image description and try to match it more to warframe aesthetic
- [x] image filters reset on reload

- [x] archive filtering isnt working and there is no search
- [ ] warframe values especially the answers are saved as unencoded strings in localstorage
- [x] switching days in live version causing quick flash of other image before reverting back to current
  - I should just have a different img element for the other game mode
- [x] daily doesn't work properly in prod, new days still show old guesses
- [x] search needs icon trailing

- [ ] put a background on image guesser since it is very hard to see on dark mode and impossible to see on light mode
- [ ] pagination is needed on archive
- [x] add properly working share button
  - [ ] I need to create composable that handles calculating if a guess is correct or not and it needs to be flexible enough to work on
- [x] add functionality to share unlimited games
- [ ] on pokedle, confetti comes from the side
- [ ] archive should show active mode
- [ ] if I do the same archive twice then it uses todays answer the second time instead of the archive answer
- [ ] longest stre
- [ ] the images I am serving for the backgrounds I probably have to minimize somehow since they are kinda big
  - [ ] Im not completely sold on the background images for the cards, maybe I just have a glow effect and the scale on hover like some warframe cards do
