# Changelog

## v0.3.0 - November 10th, 2025

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
