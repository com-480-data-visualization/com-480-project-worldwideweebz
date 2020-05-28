# Anime Data Visualization App

This folder contains the code behind the data visualization at [https://com-480-data-visualization.github.io/com-480-project-worldwideweebz/](https://com-480-data-visualization.github.io/com-480-project-worldwideweebz/). The website is a client-side React web application hosted on Github pages.

### Prerequisites

The website can be visited with any modern web browser. For the possible best experience, we recommend the following:

- Use Mozilla Firefox (76.0.1 at the time of writing) for best performance. For more information about brower (in-)compatibility, see our [Github issues](https://github.com/com-480-data-visualization/com-480-project-worldwideweebz/issues?q=).
- Clear your browser cache, for instance by force-reloading all files and assets on the website by pressing Ctrl + F5 or following [these instructions](https://clear-my-cache.com/).
- Use a desktop device (avoid mobile devices with small screen resolutions).
- Use a 1920x1080 maximized window. Entering fullscreen mode provides an even better display and immersion.
- You can refresh the homepage to see more animated backgrounds (they are selected at random).

To run the development build locally, you will need:

- [NodeJS](https://nodejs.org/) (tested on v12.17.0) installed on your operating system. Please make sure that `node` and `npm` are visible in your PATH environment variable. NodeJS is a Javascript runtime environment to execute server-side and desktop applications with web technologies.
- Optionally [Yarn](https://yarnpkg.com/), a package manager that improves the standard NPM

The project makes use of [Babel](https://babeljs.io/), a Javascript compiler for enhanced Javascript features and [Webpack](https://webpack.js.org/), a module bundler that performs packing and tree shaking on all Javascript, assets and dependencies to create optimized bundles.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

The scripts are defined in `package.json`. In the current project directory, you can run (select the appropriate command depending on whether you installed Yarn):

## `yarn install` / `npm install`

MUST be ran first at least once or when dependencies specified in `package.json` are updated. This step is required to fetch and setup the library dependencies.

### `yarn start` / `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build` / `npm run-script build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject` / `npm run-script eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `yarn deploy` / `npm run-script deploy`

The project is configured with the `gh-pages` module to deploy the production `build` to Github Pages at [https://com-480-data-visualization.github.io/com-480-project-worldwideweebz/](https://com-480-data-visualization.github.io/com-480-project-worldwideweebz/). It is pushed to the respective `gh-pages` branch of the repository. See [package.json](package.json) for deployment configuration.

## Project structure

- `build`: the build / deploy command will produce a production bundle into this directory (gitignored)
- `node_modules`: the install command will fetch dependencies into this folder (gitignored)
- `public`: contains exposed assets that can be requested through the public URL such as the root document, images, datasets and manifests.
- `src`: contains all the code written in this project
    - `animation`: React components and styles related to global animations
    - `components`: Reusable assets and React components in the project
    - `pages`: Page React components and modules
    - `utils`: Reusable functions in the project
    - `App.js`: App entry point for React components
    - `Config.js`: Global configuration with lifecycle-aware hooks
    - `index.js`: Bundle main script, recursively renders the App component into the DOM
- `.gitignore`: ignored files in the repository
- `package.json`: project configuration and dependencies file
- `README.md`: this file. Recursively see [README.md](README.md).
- `yarn.lock`: fixed dependency tree state for versioning and synchronization

## Additional resources

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Advanced configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [Deployment documentation](https://facebook.github.io/create-react-app/docs/deployment)
- [Yarn build troubleshooting](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
