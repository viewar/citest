# ViewAR React Base

This is supposed to be the base template for every new app we create. The purpose of this app is to deliver a blueprint of best practices for creating ViewAR apps.

# Run app

Use either:

- `npm run start` to start web version or
- `npm run start:mock` to start the mocked ui only version.

To build for production start `npm run build`.
To start the automated tests use `npm run test`.
To get type coverage report run `npm run coverage:type`, for a unit test coverage report run `npm run coverage:unit`.

For deployments use [ViewAR CLI](https://www.npmjs.com/package/viewar-cli).

## Tech Stack

- Typescript
- React
- SCSS
- CircleCI
- Jest

## Features

- Automated tests
- Hot reloading
- Translations
- State handling
- Loading state
- Dialogs
- Routing
- Enforced code quality

### Basic setup

The basic framework for the UI is React. React is used together with Typescript to have basic type checking. The preferred way of implementing components is with hooks.
For styling SASS and CSS Modules is used to load the classes inside the react's JSX code.

### Routing

A HashRouter is used to be compatible with webversion.viewar.com. Without the HashRouter the router will trigger a page refresh on route change. Webversion.viewar.com acts as a proxy and injects a base url into the DOM tree. The page refresh will replace the orignal url with a hash code internally used - that's what we want to avoid.

### State handling

Every state should only be locally available if possible. Only make exceptions if really necessary (e.g. viewarApi).
For local states we use react's useState. There's also the possibility to hold the state in a page's url hash with our own useQueryState hook. This allows us to link directly to a page with a certain state.
For global states use the useContext hook. For more complex states useContext together with useReducer is recommended.

### Code quality

The code quality is enforced on every commit. This will both keep the developer's freedom of not having to take care of styling while developing and also always keeps every commit clean. Before every commit a linter automatically tries to fix the invalid stylings and linting errors. If this is not possible an error is thrown and the developer has to fix it manually.

### Automated testing

#### Automated builds

There are no tests executed before building the app or before commiting changes. The usual github workflow (feature branch -> pull request -> code review -> merge changes) will run the tests on the server. So only pull requests that have passed these tests should be merged and closed. The unit tests and an automated build (to check for build errors) are started from CircleCI. To enable a github repo for automated builds log in to circleci.com and add the project.

#### Unit tests

For unit tests use jest.

#### End-to-end-tests

Cypress will be used for end-to-end-tests and for automated screenshot generation.

## Clone and get updates

To be able to get updates from this repository, we first have to clone from this repo. Then we set the origin remote to our new repository's url and store the original repository as "updates" remote.

```sh
# Create new repo
git clone git@github.com:viewar/react-base.git <new-repo-name>
cd <new-repo-name>
# Set up remotes
git remote set-url origin git@github.com:viewar/<new-repo-name>.git   # Change remote "origin" to new repo url.
git remote add updates git@github.com:viewar/react-base.git           # Create remote "updates" to the original repo.
```

This way we can pull and merge updates from the original app.

```sh
git remote update         # Fetch from all remotes
git pull updates master   # Merge changes from updates/master (from git@github.com:viewar/react-base.git) into your current branch
```

## TODO

- Add automated screen tests (?).
