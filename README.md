# Teacher Moments

## Development

### Local Setup

1. Install Dependencies
   `yarn install`

2. Start the dev server
   `yarn start`

You should see your local site at http://localhost:3000/ or whatever port number you specify your CLIENT_PORT to be in your environment.

### Build

`yarn build`

### Linting Code

This project uses [Eslint](https://eslint.org/) for linting. To catch syntax and style errors, run

`yarn lint`

### Local Database Setup

- Install PostgreSQL
  - Mac:
  ```
  brew install postgres
  ```
  Make sure that the Postgres version installed is 11.4.
- Start PostgreSQL
  - Mac:
  ```
  brew services start postgresql
  createdb # creates a default database under your user name
  ```
- Initialize local database

```
npm run db-init-local
```

### Creating Database Migrations

```
npm run create-migration -- <migration name>

# Example
npm run create-migration -- create-users-table
```

db-migrate tool will subsequently create a JS migration file that can be edited in the `migrations` folder.

### Applying Database Migrations

```
npm run db-migrate-up
```

This command can be customized with the following options: [https://db-migrate.readthedocs.io/en/latest/Getting%20Started/usage/#running-migrations]()

Example:
Passing a count: `npm run db-migrate-down -- -c 1`

### Reverting Database Migrations

```
npm run db-migrate-down
```

This command can be customized with the following options [https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#down]()
