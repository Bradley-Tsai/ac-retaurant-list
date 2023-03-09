# ALPHA Camp - Restanrant List

Restaurant list built with Express.js

## Getting Started

### Prerequisites

- npm
- nvm <font color=#808080>(optional)</font>

### Installing

```
git clone <this-project> // or maybe through gh cli
cd <project-dir>
npm install
```

## Running the project

First, you should create your own `.env` which has db setting like below:

```
MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@cluster0.uvqpnsq.mongodb.net/restaurant-list?retryWrites=true&w=majority
```

Then, run the seeder code for inserting data if needed:

```
npm run seed
```

Run the project using:

```
npm run start
```

or, if you want to run with debug mode (with nodemon):

```
npm run dev
```

And now, you should be able to visit `http://localhost:3000` and see the homepage.
