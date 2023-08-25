# Project Oxygen ⚛️
Oxygen is an AI assistant that helps you analyze and evaluate investment opportunities.  

This project is an [Electron](https://www.electronjs.org/) desktop application.  You can download the latest stable version [here](https://github.com/virattt/oxygen-desktop/releases).

Finally, you can find the backend server to run with this desktop app [here](https://github.com/virattt/oxygen-backend).

<img width="1504" alt="Screenshot 2023-08-16 at 5 19 19 PM" src="https://github.com/virattt/project-oxygen/assets/901795/be499d98-7c70-4fc7-9af5-c996f479537e">

## Overview 👋
You can give Oxygen access to your local `.txt` files by drag-n-dropping them into the Files component in the left sidebar.  We are still working on adding support for PDFs.

We use [React](https://react.dev/) [TypeScript](https://www.typescriptlang.org/docs/handbook/react.html) for rendering all UI components and we use [Chakra UI](https://chakra-ui.com/) for styling our components.  For state management, we are using [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/).

**Note**: We currently only support Mac.  Please help us set up the Windows install by submitting a PR.
## Getting Started 🏁
To run Oxygen, you need to:

1. Clone this GitHub repo
2. Install dependencies
3. Start the app

### 1. Clone this GitHub repo 🔍
To clone this GitHub repo, open up your Terminal (MacOS) or Bash terminal (Windows) and navigate to wherever you want to save this repo on your local machine.  Then, run: 

```
git clone https://github.com/virattt/oxygen-desktop.git
```

Make sure that you have git installed ([instructions](https://github.com/git-guides/install-git)).

### 2. Install dependencies ⬇️
Once you have cloned the project locally, navigate to the `oxygen-desktop` directory and run:

```
npm install
```

Make sure that you have Node and npm installed (MacOS [instructions](https://nodejs.org/en/download/package-manager#macos) and Windows [instructions](https://nodejs.org/en/download/package-manager#windows-1))

### 3. Start the app 🚀
Once the dependencies are installed, run:
```
npm start
```

If successful, Oxygen should load automatically in a new window.  Register or login to begin using the assistant.

**Important**: In order to run the LLM, set your [OpenAI API key](https://platform.openai.com/account/api-keys) in the Model Configuration tab (right sidebar).

## Troubleshooting ⚠️
If you encounter any issues, send me a message on [Twitter](https://twitter.com/virattt)!
