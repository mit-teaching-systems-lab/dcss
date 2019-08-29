# Teacher Moments

## Development

This is the list of all environment variables that should be exported prior to running the Teacher Moments app in the command line:
```
export PGUSER=
export PGPASSWORD=
export PGDATABASE=
export PGHOST=
export PGPORT=

# If AWS credentials are stored in profiles
export AWS_PROFILE=
export S3_BUCKET=
```

### Local Setup

1. Install Dependencies
   `yarn install`

2. Start the dev server
   `yarn start`

3) Start the backend server

*Windows instructions TBD*
If you are using Mac or Linux, export the environment variables first and then run dev server: `cat $(export config/dev); yarn dev`

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

### S3 Integration
The AWS bucket used for development is called **v2-moments-dev**. For access, please contact the AWS administrator for TSL.

The app uses for credentials either
* **default** credential in your home directory at ~/.aws/credentials with this file format:
```
[default] #TSL
aws_access_key_id = <your access key id>
aws_secret_access_key = <your secret access key id>
```
* *or* set the environment variable **AWS_PROFILE**
```
export AWS_PROFILE=tsl
```
