# Full Stack demo project

## Description

This was originally a project for a job application process, but now has been upgraded to be full
stack, with a mock API and graphQL / Sqlite backend.

## Instructions

To run:

1. Install dependencies using `npm install` or `yarn`, etc.
2. Run all projects at the same time with:

   ```sh
	 npx nx run-many --target=serve --projects=mock-api,server,ui
	 ```

	 Or run each individually:

	 ```sh
	 npx nx serve mock-api
	 npx nx serve server
	 npx nx serve ui
	 ```

### Resetting

To reset the data that has been stored, clear browser data and delete the `.sqlite` file.

## Details

This is set up as a monorepo via NX, with these separate projects:

1. React frontend

  - Ant Design used for components
  - Reactive design
  - Browser storage is used for offline access (local storage and indexedDb)
  - Custom hooks where appropriate
  - CSS modules

2. Mock API (that replaced the original that is no longer free)

  - Generated data for 1000 players

3. Backend using graphQL to connect to a local Sqlite database
4. Types package, for commonly shared types among the other projects

## Notes

- Schema is not provided, used quicktype and modified according to missing types that I encountered.
- Normally I would manually create the types based on the API docs, but this worked well enough to just show an MVP.

## Possible improvements

- Generate types from the graphQL so that they do not need duplicated (not trivial to set up)
- Enable multiple users
  - Need a way to track users, probably by a login system
- Poll the backend regularly
  - Currently setting Apollo client to do this will re-render the UI each time, so some reorganization would be needed
- Data improvements
  - Match the database store with the data structures returned from the (mock) API
    - Specifically, teams should be in a separate table and associated with each player (currently team data is added to player data)
  - More robust resolving of any discrepancies between the browser indexedDb and the backend database
  - Paginate returning results from backend (not really needed until much more data is stored)
- Add UI/UX features
  - Highlight matching text for searched players
  - Add favorites search (originally could not get this due to a bug in the Ant Design Search component)
  - Make the app more vertically responsive, so that it takes up 100% of viewport height (unless really small)

## Contact

Feel free to email me at <zandermaxwell@hey.com> or contact me at [my LinkedIn](https://linkedin.com/in/zandermax).
