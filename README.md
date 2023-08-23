# Social gaming website - name pending

A course project for Web-sovelluskehitys 2 TX00DZ38-3006 at Metropolia UAS.

The intention of the project is to create a gaming website with real-time games and social features. A some kind of homage to [aapeli.com](http://www.aapeli.com/) The idea is to encapsulate ongoing games in redis and publish updates using GraphQL subscriptions with websockets. Also elo system for each game is planned.

It most likely is not overly performant to have the GraphQl layer in the game logic, but that is also just a thing I want to try.

The idea is to add somewhat basic turn based games, so that the GraphQL subscription can actually hold up. These games might be something like connect four, Battleship (laivanupotus), hangman, guess the drawing etc.

The code tries to follow pure functional conventionals and uses [ramda.js](https://ramdajs.com/) as the library to facilitate that.

### Stack

**Backend:**

Typescript, apollo gql, mongo, redis

**Frontend:**

Typescript, Vite, React

**Package structure**

The project is organized as a monorepo with three main packages:

1. **server**: Contains all the backend code including API endpoints, database models, and business logic.
2. **front**: Houses the frontend React application, components, and client-side logic.
3. **environment**: Includes Docker configurations for MongoDB and Redis, ensuring a consistent environment setup.
