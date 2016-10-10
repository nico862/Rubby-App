# Ruuby PA

## API

Change into the `api` directory and run

    npm i

Run the DynamoDB local instance (port 8010) and install the tables and data.   
From within the `api` directory run:

    node script/dev/create-dynamodb-tables.js
    node script/dev/create-client.js

You need the following to be running

- Ruuby DB
- Bookings API
- DynamoDB local instance (port 8010)


Run:

    npm i
    npm run start-watch

# App

Install deps

    npm i

Build code:

    npm run gulp-watch

Run in simulator:

    npm run -- react-native run-ios --simulator="iPhone 5"
