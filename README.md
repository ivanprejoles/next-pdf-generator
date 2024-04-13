# next-template-generator
Under React Framework NextJs, next template generator is built upon [Pdfme](https://github.com/pdfme/pdfme).

## Models
The application has 2 models to be used by user for specific needs.

### Models status
- [x] Visitor Model is completed :tada:
- [ ] User Model is not yet completed

1. Visitor Model
Mostly used for fast pdf making, and no setup needed, just feed-in data like data from sheet and pdf template. But limited in features compared to another model.
![Image of model type visitor from next template generator.](/assets/images/modelTypeVisit.png)

3. User Model
User can use their data for future use and add more template in one account. Can also share the link of the form type pdf. It needs setup of account an storage.
![Image of model type user from next template generator.](/assets/images/modelTypeUser.png)

## Installation
Use this command to run the repository.
```
npm install
npm run dev
```

## Environment Variables
Fill this command to run the repository.
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings
DATABASE_URL=
```
