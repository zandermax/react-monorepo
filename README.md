# Basketball project

## NOTICE: This will stop working on 18 Feb 2023

Due to new API limits, this will no longer work once API keys are required. Even then, the higher
throttling limits will impact the functionality of this application.

See here for info: <https://www.balldontlie.io/#introduction>

(After that date, I suggest we switch to another open-access API if we still want this to work.)

## Description

This is a project assigned for BOND Sports.
See the live demo at <https://basketball.zandermaxwell.dev/>

## Notes

- Schema is not provided, used quicktype and modified according to missing types that I encountered.
- Normally I would manually create the types based on the API docs, but this worked well enough to just show an MVP.

## Possible improvements

- Add more stats from additional endpoint(s)
- Highlight matching text for searched players
- Add favorites search (could not get this due to a bug in the Ant Design Search component)
- Make the app more vertically responsive, so that it takes up 100% of viewport height (unless really small)
