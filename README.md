# SQL Transactions

Lecture starter code - server code only.

## Setup

Create database `bank` and run database.sql file.

```
npm install
npm start
```

## notes
transactions help us ensure multiple sql statements happen as a group. If 1 query in a transaction fail, so do all the others. This helps keep our data clean and dependable, free of errors and in sync.

ACID acronym

A - atomicity - the all or nothing. if the transaction goes awry, nothing withinn that ransaction happens.
C - consistency - constraints, the not nulls, the foreign keys, the transaction must remain consistent with the rules
I - isolation - transaction data is not available outside the initial transaction UNTIL it is committed. Some require commit right after an update, PostgreSQL does automatically. But, use commit; for good measure. Without this the other sessions wont know what to do without that data.
D - durability - data will persist even with power shut off. When it is successful and committed, it is very reliable.

These describe the behaviors of transactions. SQL does this all the time these are just behaviors, but learning this helps understanding of transactions.


must start with BEGIN;
must end with COMMIT;

if theres a weird 1 line error, click COMMIT; it will go away...

*new stuff*

ASYNC and AWAIT are like promises, they use try and catch syntax!