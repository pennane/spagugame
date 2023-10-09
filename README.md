# spagugame

Welcome to the future of social gaming, spagugame, a course project for the "Web-sovelluskehitys 2 TX00DZ38-3006" at Metropolia UAS.

Inspired by the legendary [aapeli.com](http://www.aapeli.com/), the goal is to craft an exhilarating social gaming experience enriched with real-time gameplay and robust social features. The platform is targeted to everyone interested in competitive turn based gaming action. By leveraging the power of Redis, we seamlessly manage ongoing games, while GraphQL subscriptions combined with websockets allow for dynamic game updates in real-time. A sophisticated ELO ranking system is also on the horizon, ensuring competitive thrills for every game on our platform.

One might argue the integration of GraphQL directly into the game logic might affect performance. While that's a valid concern, we see it as an exciting challenge and a unique exploration of what’s possible.

To ensure smooth gameplay even with this architecture, we're focusing on timeless turn-based classics. Think: Connect Four, Battleship (laivanupotus), Hangman, Guess the Drawing, etc.

~~Underpinning our code is the purity of functional programming conventions, greatly assisted by the [ramda.js](https://ramdajs.com/) library.~~
No, functional way has flown out the window, mega imperitave spagu has taken place. As a way to respect the name of the site.

## Accessing the site

The website is hosted at [spagugame.pennanen.dev](https://spagugame.pennanen.dev/)

The website can be authenticated into with a github account

## Tech Stack

**Backend:**

- Typescript
- Apollo GQL
- MongoDB
- Redis

**Frontend:**

- Typescript
- Vite
- React

## Features

Down follows an almost comprehensive list of both user facing features and interesting implementation details

### User facing features

<details>
<summary>
Authentication through Github
</summary>

- Configuring a secure authentication is hard
- By using Github OAuth most of the headache can be ignored
</details>
<details>
<summary>Play games
</summary>

- Users can play Tick tack toe, connect four and colof flood online against a real opponent
- Each played game tracks players' skill-level. Players can check their skill levels (elo) from their profile page.
- All off the played games are saved and can be viewed from the user profile, or from recent matches page
- When a game is finished, user can automatically seek a next game from the game window
</details>
<details>
<summary>Creating a game
</summary>

- User can create a new game in each game type
- The game can be specified as "private"
  - if the game is private, the game can only be joined through the link in the browsers' url bar
- when a public game is created, the game is shown in realtime for other users
</details>
<details>
<summary>The main page
</summary>

- The main page displays the currently ongoing games in real time
</details>
<details>
<summary>Leaderboard
</summary>

- Each game has its own leaderboard showing the best players of each game
- Achieving high places in any leaderboard grants the user achievements
- The leaderboard standings are directly tied to the user's skill level in that particular game
</details>
<details>
<summary>Achievements
</summary>

- Playing, winning, getting winstreaks or getting high on a leaderboard grants players achievements
- Achievements can be viewed from the users' profile page
</details>
<details>
<summary>Profile page
</summary>

- In the profile page users can

  - follow other users
  - change their profile picture
  - view their stats
  - view their recent matches
  - view their achievements
  </details>
  <details>
  <summary>Sounds
  </summary>

- The games have sounds
- The sound can be disabled from the footer
- The sounds are triggered by specific game events (starting game, playing turn, joining, leaving etc)
</details>

### Implementation details

<details>
<summary>Graphql codegen
</summary>

- types are automatically generated from the schema in the backend using [gql codegen](https://the-guild.dev/graphql/codegen)
- in the frontend graphql queries, mutations and subscriptions can be generated directly from custom .graphql files
- (this is lit :fire:)
</details>
<details>
<summary>Realtimeness
</summary>

- The realtimeness of the games are enabled by the power of websockets (graphql subscriptions) and Redis
- Changes in ongoing games are published from redis into the public, the client subscribes to relevant ones
</details>
<details>
<summary>Authentication
</summary>

- Github OAuth with passport.js, and mongo session. The sessions are persisted so that restarting the server keeps them valid
</details>
<details>
<summary>Mongo
</summary>

- I wanted to refrain from using mongoose because its DX lefts a lot to be desired
- The database abstractions are built directly on top of the official mongo library for node
- Indeces are kept upto date automatically
  - On start the application seeks the defined indices, and removes any redundant ones
- The database can be seeded with a script

  - the achievements and games can be inserted automatically into mongo with a script
  </details>
  <details>
  <summary>Uploading profile pictures
  </summary>

- The profile pictures are uploaded into imgur
- The packages used for allowing file uploads in Graphql are `graphql-upload-minimal` in the back and `apollo-upload-client` in the front
</details>
<details>
<summary>The games
</summary>

- The games follow a shared interface so that implementing more games is arbitrary, albeit laborius.
- No limit on player count
- Only one player can play at a time (sad)
- Game must end with each player having a score that can be used to determine who won etc
</details>
<details>
<summary>Apollo gql client
</summary>

- Some advanced configuration in the apollo client
- The requests are forwarded into multiple different links

  - ws link handles the websockets
  - upload link handles the file uploads
  - http batch link handles everything else and batches the requests to reduce traffic
  </details>
  <details>
  <summary>Leaderboard
  </summary>

- the leaderboard is cached and can be re-computed every 15 minutes
- when the leaderboard is re-created, the leaderboard achievements are distributed
  </details>
  <details>
  <summary>Hosting
  </summary>
- the backend is hosted in a DigitalOcean VPS
- the mongo is hosted in atlas
- the backend and its redis are built with docker
- the frontend is hosted in Vercel
  </details>

## Monorepo Package Breakdown

The project is organized as a monorepo for clarity and scalability. Here are the three main packages:

1. **server**: Contains all the backend code including API endpoints, database models, and business logic.
2. **front**: Houses the frontend React application, components, and client-side logic.
3. **environment**: Includes Docker configurations for MongoDB and Redis, ensuring a consistent environment setup.

## Development

Docker and pnpm (or npm) is required.
All three packages can be started in dev mode with following command in monorepo root

e.g.

```sh
pnpm --filter environment dev
pnpm --filter front dev
pnpm --filter server dev
```

## Keeping track of some of the implemented techical features

- automatic index creation and dropping
  - indexes are automatically kept upto date
- apollo caching for leaderboards (once every 15 minutes)
- apollo http req batching

## Images of the prototype (differs from current state of the website

![Alt text](<docs/images/Näyttökuva 2023-9-4 kello 15.07.43.png>)
![Alt text](<docs/images/Näyttökuva 2023-9-4 kello 15.07.46.png>)
![Alt text](<docs/images/Näyttökuva 2023-9-4 kello 15.08.28.png>)
![Alt text](<docs/images/Näyttökuva 2023-9-4 kello 15.08.42.png>)
![Alt text](<docs/images/Näyttökuva 2023-9-4 kello 15.09.10.png>)
