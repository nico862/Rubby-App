# Ruuby PA

## API

You need the following to be running

- Ruuby DB
- Bookings API
- DynamoDB local instance

Run the DynamoDB local instance and install the tables and data:

    node api/script/dev/create-dynamodb-tables.js
    node api/script/dev/create-client.js

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
