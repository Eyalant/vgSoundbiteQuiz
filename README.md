[This is an SPA quiz](https://game-sounds.quest) in which the user tries to recognize famous video games based on short soundbites taken from them.

I wrote this because I thought it was a nice entrypoint to writing my first Rust and Reactjs code.

## How it works
Questions and answers are read once from a .yaml file, which contains each question's list of possible answers, a short description and some additional info. They are then stored to and read from Redis. State is stored for a week using encrypted cookies.

For the backend, I used [*Rocket*](https://rocket.rs/), a popular Rust web framework. On the frontend, I based my components on [*react-bootstrap*](https://react-bootstrap.github.io/), used *Upstash* for my Redis instance and deployed using *Render.com*.
