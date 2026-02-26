# Launchpad Backend

Backend service for token metadata and pool registry. Provides REST APIs to store token details and manage pool pairs in MongoDB.

## Features

- Create and fetch token metadata
- Create and query pools by token pair
- Update pool amounts
- CORS-enabled JSON API

## Tech Stack

- Bun runtime
- Express
- Mongoose + MongoDB
- dotenv for environment config

## Requirements

- Bun v1.3+
- MongoDB connection URI

## Environment Variables

Create a `.env` file at the project root with:

```env
PORT=10000
DATABASE_URI=mongodb+srv://<user>:<password>@<cluster-host>
DATABASE_NAME=launchpad
```

Notes:

- `PORT` is optional; defaults to `10000`.
- `DATABASE_URI` should not include the database name; it is appended with `DATABASE_NAME`.

## Install

```bash
bun install
```

## Run

```bash
bun run index.ts
```

## API Reference

Base URL: `http://localhost:<PORT>/api/v1`

### Get Pool Address

`GET /getPoolAddress/:baseMint/:quoteMint`

Returns the pool record for a token pair. The order of `baseMint` and `quoteMint` does not matter.

### List Pools

`GET /pools`

Returns all pools.

### Get Token By ID

`GET /:_id`

Returns token metadata by MongoDB document id.

### Create Token

`POST /upload`

Body:

```json
{
	"name": "My Token",
	"symbol": "MTK",
	"description": "Token description",
	"imageUrl": "https://example.com/token.png"
}
```

### Create Pool

`POST /createPool`

Body:

```json
{
	"baseMint": "baseMintAddress",
	"quoteMint": "quoteMintAddress",
	"baseTicker": "BASE",
	"quoteTicker": "QUOTE",
	"baseImg": "https://example.com/base.png",
	"quoteImg": "https://example.com/quote.png",
	"baseDecimals": 9,
	"quoteDecimals": 6,
	"baseAmount": 1000,
	"quoteAmount": 5000,
	"poolAddress": "poolAddress"
}
```

### Update Pool Amounts

`PUT /updatePool/:id`

The `id` path param is the `poolAddress`.

Body:

```json
{
	"baseAmount": 1200,
	"quoteAmount": 4800
}
```

## Response Format

Most endpoints return:

```json
{
	"success": true,
	"message": {}
}
```

Errors return `success: false` with a message string.

## Development Tips

- Ensure MongoDB is reachable before starting the server.
- Use a REST client (curl, Postman, Insomnia) to test endpoints.
