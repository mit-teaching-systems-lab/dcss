# Teacher Moments

## Development

### Local Setup

1. Install [Node.js](https://nodejs.org/en/download/) (version >=10.0.0).
1. Install `yarn` (version >=1.19.x): 
  `npm install yarn@latest -g`
1. Install Dependencies: 
  `yarn install`
1. Set up local database: [Local Database Setup](#local-database-setup)
1. Start the development server
    - This is the list of all environment variables that are are pre-populated in `config/dev`, need to be exported prior to running the Teacher Moments server:
      ```
      PGUSER=
      PGPASSWORD=
      PGDATABASE=
      PGHOST=
      PGPORT=

      export AWS_PROFILE=
      export S3_BUCKET=
      ```
    - If you are using Mac or Linux, export the required environment variables first: 
      ```
      export $(cat config/dev)
      ```
    - And then run the dev server with: 
      ```
      yarn dev
      ```
    - All at once:
      ```
      export $(cat config/dev); yarn dev
      ```
      ...You should see your local site at http://localhost:3000.



### Build

`yarn build`

### Linting Code

This project uses [Eslint](https://eslint.org/) for linting. To catch syntax and style errors, run

`yarn lint`

### Local Database Setup

1. Export `config/dev`
    ```
    export $(cat config/dev);
    ```
    You may need to run: 
    ```
    export PGUSER=`whoami`;
    ```

2. Install PostgreSQL (unless already installed)
    - Make sure that the Postgres version installed is 11.4
    - Mac:
      ```
      brew install postgres
      ```
    - Ubuntu (based on https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04)
      ```
      sudo apt-get update && sudo apt-get install postgresql postgresql-contrib
      ```

3. Start PostgreSQL and make yourself a default database
    - Mac:
      ```
      brew services start postgresql
      createdb # creates a default database under your user name
      ```
    - Linux
      ```
      sudo su postgres
      createuser --interactive # enter your username and make yourself a super user
      su yourusername
      createdb # creates a default database under the current user
      ```
4. Initialize local database
    - The following  should be run with a `$PGUSER` & `$PGPASSWORD` for a super user who can create databases and roles (see step 1):
      ```
      yarn db-init-local
      ```
      This command creates a database called `teachermoments` and then sets up a role called tm and then creates all of the tables in `teachermoments`. 

      To do this manually, create a database called `teachermoments`: 
      ```
      createdb teachermoments
      ```
      Then create the role `tm` with a password `teachermoments`, then run: 
      ```
      db-migrate up
      ```

### Creating Database Migrations

```
yarn create-migration <migration name>

# Example
yarn create-migration create-users-table
```

db-migrate tool will subsequently create a JS migration file that can be edited in the `migrations` folder.

### Applying Database Migrations

```
yarn db-migrate-up
```

This command can be customized with the following options: [https://db-migrate.readthedocs.io/en/latest/Getting%20Started/usage/#running-migrations]()

Example:
Passing a count: `npm run db-migrate-down -- -c 1`

### Reverting Database Migrations

```
yarn db-migrate-down
```

This command can be customized with the following options [https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#down]()

## Deployment
This app is deployed via Heroku. To run the deploy commands, please [install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).


### Staging environment setup

#### Initializing staging database
Create a .env file in the root of the project directory and add the following info:
```
PGSSLMODE=require
DATABASE_URL=< your Heroku database URL here>
```
DATABASE_URL is a value set in your Heroku environment, which you can find when you reveal config vars in Heroku's UI.

If there isn't a staging database yet, you can initalize it with the following command:
```
yarn db-init-staging
```
#### Set Heroku as remote repo on local machine
```
heroku git:remote -a teacher-moments
git remote rename heroku heroku-staging
```

#### Deploying App to staging

We currently have Github intergrated with Heroku, so merges into the `teacher-moments` branch will deploy automatically to our staging site, [https://teacher-moments.herokuapp.com/](https://teacher-moments.herokuapp.com/). However, if you want or need to deploy manually, you can use the command below.

```
yarn deploy:staging
```
NB: This command will deploy your local `teacher-moments` branch, so make sure you have pulled down the latest changes from Github.

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
