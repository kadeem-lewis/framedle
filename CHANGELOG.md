# Changelog

## v1.5.0 - March 18th, 2026

### Changes

- Added Follie to the game
- Changed format of images used in the game footer to avif for better performance

## v1.4.0 - March 17th, 2026

### Features

- Added a toggle to let users share all of their game results at once instead of just the current game

### Changes

- Removed nuxtjs/i18n module and all related code because it was not being used as the app currently only supports english
- Added labels to progenitor elements in classic mode feedback rows
- Reduced playstyle text when there are 3 playstyles being shown to prevent layout issues

### Fixes

- Fixed outdated bluesky link in the footer

## v1.3.2 - March 16th, 2026

### Changes

- Replaced android instructions page with link to play store listing because the app is now publicly available!

## v1.3.1 - March 15th, 2026

### Changes

- Changed the color of links on light mode to be more visible

### Bug Fixes

- Fixed mode card border clipping on certain screen sizes

## v1.3.0 - March 15th, 2026

### Features

- Add a contact form to the website for users to submit feedback and report bugs
- Add a changelog page and an faq page to the game to answer user questions and keep them informed

### Changes

- Changed the colors used in app to be more consistent
- Updated the look of different buttons and components in the app to be closer to Warframe's design style
- Changed warframe search autofocus to only apply when the search is within an overlay
- Added signature weapon and unique rolling animation as new grid game categories
- Added icons to links to indicate if they go to an external site

### Bug Fixes

- Fixed images not having defined width and height attributes
- Fixed some cards disappearing from legacy game stats when the game mode is unlimited
- Fixed some colors changing when using colorblind mode that should be consistent across all modes

## v1.2.3 - February 21th, 2026

### Bug Fixes

- Fixed ability and classic total stats share not working because of incorrect import

## v1.2.2 - February 20th, 2026

### Bug Fixes

- Fixed share stats button not working in grid game mode
- Properly fixed average score in grid game not being rounded to 2 decimal places

## v1.2.1 - February 18th, 2026

### Bug Fixes

- Fixed game ending prematurely if incorrect guess was made on the last cell in the grid even if attempts were remaining
- Fixed average score in grid game not being rounded to 2 decimal places

## v1.2.0 - February 17th, 2026

### Changes

- Added Invisibility as new category to grid game mode

### Bug Fixes

- Fixed multiple warframes being missing from newly generated categories

## v1.1.1 - February 15th, 2026

### Changes

- Increased length of time images are cached by the browser to improve performance
- Added various SEO improvements such as better titles and descriptions and more detailed sitemaps

### Bug Fixes

- Fixed queue only being able to generate new warframes when reset

## v1.1.0 - February 13th, 2026

### Changes

- Add new categories to grid game mode such as "Warframes that restore energy" and "Warframes with Deluxe skins"

### Bug Fixes

- Fixed daily schedule function skipping certain entries in the warframe queue if the function runs multiple times in a day
- Fixed queues not resetting after all entries have been used
- Fixed stats resetting to previous values after completing a game

## v1.0.1 - January 17th, 2026

### Bug Fixes

- Fixed game over navigation not working for legacy daily modes

## v1.0.0 - January 17th, 2026

### Features

- Added Grid Game Mode
- Add ability to see how many people won legacy games and their average score
- Added community stats to grid game mode of how many people have played each day, the average score and a breakdown of the most and least guessed warframes
- Add web share support for supported browsers when sharing game results
- Add links to quick share game results to popular social media platforms such as Twitter, Bluesky and Whatsapp

### Bug Fixes

- Fixed Excalibur Umbra being missing from game
- Fixed shared classic game results not including playstyle category
- Fixed games registering as won multiple times when reloading or switching modes after completion

## v0.3.5 - December 19th, 2025

### Bug Fixes

- Fixed bug where new daily game would not load

## v0.3.4 - December 18th, 2025

### Bug Fixes

- Fixed an issue where the daily game would skip items from the queue if add daily task ran multiple times in a day

## v0.3.3 - December 17th, 2025

### Changes

- Added Gyre Prime and Uriel to the game
- Updated app to be ran as a docker container using docker stack for better scalability and deployment

## v0.3.2 - November 10th, 2025

### Changes

- Changed daily update logic to run whenever it's midnight or whenever the user comes back to the app after being away for a while

### Bug Fixes

- Fixed a bug where sharing date would show NaN for the day in unlimited games
- Fixed a bug where sharing classic unlimited games would not work properly

## v0.3.1 - November 9th, 2025

### Bug Fixes

- Fixed an issue where the migration banner would still show after a successful migration

## v0.3.0 - November 9th, 2025

### Features

- Game mode cards now show the user's current streak for that mode
- Add Icons on feedback tiles to indicate correct and partially correct guesses
- Archive games are now saved and tracked using IndexedDB for better user experience and offline support
- Added a navigation component on the game over screen to cycle through previous archive games
- Added component to archive page to show stats for completed, in-progress, and not started games
- Added "Random" button to archive page to navigate to a random past archive game
- Added new "Playstyle" column to classic mode to show warframe playstyle (e.g., Damage, Support, Stealth etc.)
- Changed daily warframe selection logic to remove duplicates until all warframes have been used
- Began fetching data from warframe wiki to better automate warframe data updates

### Changes

- Changed database to store daily game data separately for each game mode
- Changed game to only store the name of the correct warframe in daily games to reduce storage usage
- Updated Site Logo!
- Added Nokko to the game
- Changed website url structure to use route params instead of query params for game mode and day selection

### Bug Fixes

- Fixed an issue where the warframe search component was not showing the correct results on first input

## v0.2.4 - September 3rd, 2025

### Changes

- Added Caliban Prime to the game

## v0.2.3 - June 27th, 2025

### Changes

- Added Oraxia to the game

## v0.2.2 - June 3rd, 2025

### Changes

- Added Yareli Prime to the game

## v0.2.1 - May 5th, 2025

### Bug fixes

- Disabled prerendering of home page to properly fix issue of refreshing the page causing the game to return to the home page

## v0.2.0 - May 4th, 2025

### Features

- Added an additional column to the classic game mode that shows the warframe variant
- Added tooltips to classic mode headings to show possible values
- Updated ability mode to start with image rotate to increase difficulty
- Add a mini game to guess the ability name after the image is revealed
- Updated game instructions to include new changes and be better formatted
- Changed daily mode refresh to trigger when navigating between game modes

### Bug Fixes

- Fixed game returning to the home page when reloading the page
- Fixed error where clicking on the next mode button would cause the daily mode button to link to previous game mode

## v0.1.4 - April 18, 2025

### Changes

- Updated pwa manifest to include additional app info

### Bug Fixes

- Fixed an issue where confetti would briefly show when directly navigating between game modes

## v0.1.3 - April 15, 2025

### Features

- Updated Warframe search to automatically select the warframe whose name matches the input

### Changes

- Updated method used to reverse array to better support older browsers

## v0.1.2 - April 15,2025

### Features

- Added sentry to the app for error tracking and reporting

### Bug Fixes

- Fixed an issue where koumei had the incorrect progenitor element

## v0.1.1 - April 10, 2025

### Bug Fixes

- Fixed an issue where the emoji in shared game results incorrectly displayed the release date status
