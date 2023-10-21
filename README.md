# spagugame

Welcome to the future of social gaming, spagugame, a Metropolia course project for the "Web-sovelluskehitys 2 TX00DZ38-3006". Inspired by aapeli.com, the goal is to deliver a seamless, real-time, turn-based gaming platform with ELO ranking system that ensures competitive gameplay.

## Tech Stack

**Backend:** Typescript, Node, Apollo GraphQL, MongoDB, Redis

**Frontend:** Typescript, Vite, React

## Quick Start for Peer-Review

**1. Authenticate**: Log in with a GitHub account.

**2. Create/Join Game**: Either create a new game or join an existing one.

**3. Ready Up**: Press "ready" to start.

**4. Play**: The gameplay should be intuitive.

**5. Review**: Check your profile for match history and achievements.

## Features

<details>
<summary>GitHub OAuth</summary>

- Simplifies secure authentication

</details>
<details>
<summary>Gameplay</summary>

- Tick tack toe, connect four and color flood available with ELO ranking and saved match history.

</details>
<details>
<summary>Game Creation</summary>

- Public and private games with real-time visibility.

</details>
<details>
<summary>Profile & Leaderboard</summary>

- Follow users, change profile pictures, and view stats and achievements.

</details>
<details>
<summary>Audio</summary>

- Game sounds toggleable via footer.

</details>

## Technical Details

<details>
<summary>GraphQL</summary>

- Backend & frontend types auto-generated; frontend queries generated from `.graphql` files.

</details>
<details>
<summary>Real-Time Features</summary>

- Enabled by websockets (GraphQL subscriptions) and Redis.

</details>
<details>
<summary>MongoDB</summary>

- Database abstractions built on native node library; no Mongoose.

</details>
<details>
<summary>Imgur Uploads</summary>

- Profile pictures hosted on Imgur.

</details>
<details>
<summary>Monorepo</summary>

- Organized into `server`, `front`, and `environment` packages.

</details>

## Development

### Requirements

- Docker
- pnpm (or npm)
- node 18
- github (and imgur) api keys

### Env file samples

`packages/frontend/.env`

```sh
VITE_SERVER_BASE_URL=http://localhost:3000  # root url for where the server is at
VITE_WS_BASE_URL=ws://localhost:3000        # most likely same as SERVER_BASE_URL but ws as the protocol
```

`packages/server/.env`

```sh
SERVER_SESSION_SECRET=                       # something_arbitrary_and_secret
MONGO_CONNECTION_STRING=                     # connection string to mongo
MONGO_DB_NAME=devdb                          # main database name
MONGO_TEST_DB_NAME=testdb                    # test database name
GITHUB_CLIENT_ID=                            # github api client id
GITHUB_CLIENT_SECRET=                        # github api client secret
IMGUR_CLIENT_ID=                             # imgur api client id
IMGUR_CLIENT_SECRET=                         # imgur api client secret
```

### Starting site up

```sh
pnpm --filter environment dev                # redis and mongo
pnpm --filter front dev                      # vite react app
pnpm --filter server dev                     # backend
```

## Images of spagugame

![Alt text](<docs/images/Näyttökuva 2023-10-9 kello 14.53.06.png>)
![Alt text](<docs/images/Näyttökuva 2023-10-9 kello 14.52.20.png>)
![Alt text](<docs/images/Näyttökuva 2023-10-9 kello 14.53.20.png>)
![Alt text](<docs/images/Näyttökuva 2023-10-9 kello 14.53.25.png>)
![Alt text](<docs/images/Näyttökuva 2023-10-9 kello 14.53.30.png>)
![Alt text](<docs/images/Näyttökuva 2023-10-9 kello 14.53.38.png>)
![Alt text](<docs/images/Näyttökuva 2023-10-9 kello 14.53.56.png>)
![Alt text](<docs/images/Näyttökuva 2023-10-9 kello 14.54.04.png>)
