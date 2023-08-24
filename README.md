# NextGen Social Gaming Platform (Name TBA)

Welcome to the future of social gaming, a visionary course project for the "Web-sovelluskehitys 2 TX00DZ38-3006" at Metropolia UAS.

Inspired by the legendary [aapeli.com](http://www.aapeli.com/), our goal is to craft an exhilarating social gaming experience enriched with real-time gameplay and robust social features. By leveraging the power of Redis, we seamlessly manage ongoing games, while GraphQL subscriptions combined with websockets allow for dynamic game updates in real-time. A sophisticated ELO ranking system is also on the horizon, ensuring competitive thrills for every game on our platform.

One might argue the integration of GraphQL directly into the game logic might affect performance. While that's a valid concern, we see it as an exciting challenge and a unique exploration of what’s possible.

To ensure smooth gameplay even with this architecture, we're focusing on timeless turn-based classics. Think: Connect Four, Battleship (laivanupotus), Hangman, Guess the Drawing, etc.

Underpinning our code is the purity of functional programming conventions, greatly assisted by the [ramda.js](https://ramdajs.com/) library.

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

## Monorepo Package Breakdown

The project is organized as a monorepo for clarity and scalability. Here are the three main packages:

1. **server**: Contains all the backend code including API endpoints, database models, and business logic.
2. **front**: Houses the frontend React application, components, and client-side logic.
3. **environment**: Includes Docker configurations for MongoDB and Redis, ensuring a consistent environment setup.