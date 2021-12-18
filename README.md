
## Description

Simple REST api to upload books and search for it by words.

The app is provided with a non-persistent storage.
For an optimized and production ready app, I will suggest to use an external Postgres DB and index all words from each books. Then use SQL to implement a proper pagination.

## Setup

```bash
$ yarn && yarn build
```

## Running the app

```bash
$ yarn start
```

## Test

```bash
$ yarn test
```