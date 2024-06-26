# PDF Gen (NextJS)(Built with [Pdfme](https://github.com/pdfme/pdfme))
**PDF Automation with PDF Gen:**

* Bulk PDFs from Data Sheets (CSV, Excel, etc.)
* Design Custom Fillable Forms
* Multi-Page Templates (Instructions Included)

<br>
The link is provided here [PDF Gen](https://next-template-generator.vercel.app/).
<br>
<br>
<br>

## Models

The library offers 2 models designed to address different user needs.
<br>

1. Guest Model

<br>

Suitable for generating PDFs rapidly. No setup is necessary; simply feed in data and a template.  It offers basic functionality, but may lack the advanced features found in other models.

<br>

![Image of model type visitor from PDF Gen.](/assets/images/modelTypeVisit.png)

<br>

2. User Model

<br>

This User model lets you save and reuse your data for future use, expand your template library by adding custom templates to your account, and can share form for automation with ease using shared links.

<br>

![Image of model type user from PDF Gen.](/assets/images/modelTypeUser.png)

<br>
<br>
<br>

## Installation
Use this command to run the repository.

<br>
<br>

```
npm install
npm run dev
```

<br>
<br>
<br>

## Environment Variables
Fill this command to run the repository.

<br>

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
