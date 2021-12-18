
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

## How to use

```bash
# add new book
$ curl -X POST http://localhost:3000/books --header 'content-type: application/json' -d '{"title": "TheAwesomeBook", "content": "this may be a super story"}'
```

```bash
# get "TheAwesomeBook" book content
$ curl http://localhost:3000/books/TheAwesomeBook
```

```bash
# get "TheAwesomeBook" book content from page (default page size is 1000 words)
$ curl http://localhost:3000/books/TheAwesomeBook\?fromPage\=2
```

```bash
# get all books title
$ curl http://localhost:3000/books
```

```bash
# search a book from words
$ curl http://localhost:3000/search\?words=super,story
```
