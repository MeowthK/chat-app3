# Chat App 3

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in my-app
npm create svelte@latest chat-app3

# create options
Svelte App Template: Skeleton Project
Type Checking: Typescript Syntax
Optional: Eslint
```

## Install Dependencies

```bash
#npm install these packages in the root folder
bcryptjs
jsonwebtoken
mongodb
pusher
pusher-js
```

## Set up environment variables for testing

Create a .env file into the root directory of the project that will contain the following. Note that some of the values here contain sensitive information so use it responsibly. (Don't crash my db plz)

```bash
MONGO_URI=mongodb+srv://jankarlosancarlos11:4ALkiJR79y4BHamX@cluster0.xnscan2.mongodb.net/?retryWrites=true&w=majority
MONGO_DB=chat-storage
MONGO_DB_USER_COL=users
MONGO_DB_CHAT_COL=chats

PUSHER_APPID=1622864
PUBLIC_PUSHER_KEY=3549143eed17ea1061f5
PUSHER_SECRET=140f9477cd87a5a24374
PUSHER_CLUSTER=ap1
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start two or more separate terminal and run the following:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
