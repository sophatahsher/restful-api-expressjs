# restful-api-expressjs

A simple RESTful API application using Node, Express Server, ES6 using babel.
This project show an implementation of user CRUD.

## Prerequisites

Before we can begin, you'll need to make sure you have some things installed:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [mongodb compass](https://www.mongodb.com/products/compass)

## Features
 * babel v7
 * Express
 * bcrypt
 * jsonwebtoken
 * mongoose

## Install dependencies
```sh
npm i
```

## Create Configuration Environment

* cp .env.example .env
* nano .env

## Start Application
```sh
npm run dev
```

## Run application with Docker
```sh
docker-compose build
```

```sh
docker-compose up
```