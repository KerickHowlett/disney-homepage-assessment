# Disney Homepage Assessment

![Logo](https://media.comicbook.com/2018/11/disney-plus-logo-1143358.jpeg)

A recreation of the Disney+ Homepage's media library selection (with some added flair) as, not just
a Single-Page Application (SPA)... **_but as a Progressive Web App (PWA) as well!_**

## Table of Contents

- [Disney Homepage Assessment](#disney-homepage-assessment)
  - [Authors](#authors)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
    - [1. Devcontainer](#1-devcontainer)
    - [2. Node](#2-node)
    - [Other Package Managers](#other-package-managers)
  - [Usage](#usage)
    - [Navigation](#navigation)
    - [IMPORTANT NOTES](#important-notes)
  - [Running Tests](#running-tests)
  - [Environment Variables](#environment-variables)
  - [References](#references)

## Authors

- [@KerickHowlett](https://www.github.com/kerickhowlett)

## Features

- Service Worker Caching for Offline Use (not including videos).
- "Mouseless" navigation in favor of keyboard.
- Beautiful animations and styles.
- High-performant!

## Tech Stack

- [Docker](https://www.docker.com/)
- [pnpm](https://pnpm.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Vite](https://vitejs.dev/)
- [Webcomponents](https://www.webcomponents.org/)

## Installation

After cloning the project repo, there are two major options with installing this project:

### 1. Devcontainer

For this method, you'll need the following technologies installed:

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Remote Developers Extension Package](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)

If you wish to go this route, please follow each of their respective instructions on how to install
everything that's required.

Once that's done, open up the command pallet and search for the following command:

```text
Remote Containers: Rebuild and Reopen in Container
```

Press Enter.

After the devcontainer builds successfully, open Visual Studio's integrated terminal and then proceed
to enter the following:

```bash
pnpm install
```

### 2. Node

For this method, you'll need a Node v18 or higher. If you don't alreayd have Node installed on your
machine, you'll need to install it now.

I recommend **[nvm](https://github.com/nvm-sh/nvm#install--update-script)**, so please follow their
instructions on how to install & Node to your machine.

Once that's installed, enter the following command to start using the correct version of Node needed
for this project.

After finally having Node setup for your system, the only thing left is installing the project's devDependencies.

```bash
cd ./disney-homepage-assessment
nvm install
nvm use
npm i -g npm@latest pnpm@latest
pnpm install
```

### Other Package Managers

If you prefer to use `npm` or `yarn`, then please enter one of the following commands first:

```bash
# npm
npm import

# yarn
yarn import
```

_**All the following run commands will use `pnpm` for running script commands, but you can still run
these scripts with either `npm` or `yarn`.

## Usage

Assuming all the devDependencies are installed, you can start developing on the app by entering the
following command:

```bash
pnpm start
```

If you'd like to take see how a build of this app will appear in a production-like environment, then
enter the following command:

```bash
pnpm preview
```

### Navigation

Each of the **Arrow Keys** will navigate you around the tiles, including those on the numpad,
and the `W`, `A`, `S`, and `D` keys if you're a PC gamer.

### IMPORTANT NOTES

- For an ideal experience, run this app in Mozilla Firefox and _**NOT**_ in Google Chrome. The
reason is yet to be clear, some of the collection rows are not affected by an implemented
IntersectionObserver. Everything still runs greatly, though -- it mainly affects how the content
tiles outside the viewport render into the UI.
- While I did perform the "interaction extra credit", there is not _actual_ selection that you may
- find by pressing down on the Enter or Spacebar keys. Instead, you'll see the view's background
- beautifully change.

## Running Tests

Unfortunately, I failed to find the time to implement the bevy of automated unit/integration/E2E
tests that I wanted.

If I had, here is the list of technologies and libraries I had planned on using to accomplish this:

- [Cypress](https://www.cypress.io/)
- [Vitest](https://vitest.dev/)
- [msw](https://mswjs.io/)
- [@testing-library/dom](https://testing-library.com/docs/dom-testing-library/intro/)
- [@testing-library/user-event](https://testing-library.com/docs/user-event/intro)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.

_(Though, there is a `.env.development` and `.env.production` already in the repo.)_

```bash
DISNEY_ASSET_API_DOMAIN
DISNEY_HOME_API_DOMAIN
DISNEY_SERVICE_WORKER
```

## References

[The One True "Disney+"](https://www.disneyplus.com/home)
