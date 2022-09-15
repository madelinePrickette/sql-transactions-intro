const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

router.get('/', (req, res) => {
  // res.send('Hello?');
  
  const queryText =
  `
  SELECT "account".name, SUM("register".amount) FROM "account"
  JOIN "register"
  ON "account".id = "register".acct_id
  GROUP BY "account".name;
  `
  pool.query(queryText)
  .then( (result) => {
    console.log('Account balances:', result.rows);
    res.send(result.rows);
  }).catch ( (err) => {
    console.error('error in account.router.js', err);
    res.sendStatus(500);
  })
})

router.post('/transfer', async (req, res) => {
  // async goes in here between these two.
  const toId = req.body.toId; // who is receiving the money
  const fromId = req.body.fromId; // who is sending the money
  const amount = req.body.amount;
  console.log(`Transferring ${amount} from ${fromId} to ${toId}...`);

  const connection = await pool.connect(); // We are connecting to pool, 
  // which is settign up our pg connection, and move on once thats all connected up.
  // now lets run a try...
  try{
    await connection.query('BEGIN') // once connection is established, begin this query...
    const queryText =
    `
    INSERT INTO "register" ("acct_id", "amount")
    VALUES ($1, $2);
    `;
    // await withdrawl
    await connection.query(queryText, [fromId, -amount]);
    // deposit
    await connection.query(queryText, [toId, amount]);
    // now we are wrapping up our transaction, so we have to commit.
    await connection.query('COMMIT;');
    res.sendStatus(200);
  } catch (err) {
    await connection.query('ROLLBACK;');
    console.error('Error in account.router POST', err);
    res.sendStatus(500);
   // await is soecifically running one thing at a time before moving on to the next.
    // so semicolons arent nexessarily needed since its being run one at a time not all together.
  } finally {
    connection.release(); //the parenthesis just means that 'this is envoked';
  }
})

// test this post in postman by going to the route, clicking post, and clicking body, then clicking xxx-www thing,
// making all they keys

router.post('/new', async (req, res) => {
  const name = req.body.name;
  const amount = req.body.amount;
  console.log(`creating new account ${name} witha  starting balance of ${amount}`)

  const connection = await pool.connect();
  try{
    await connection.query('BEGIN');
    const queryAddAccount =
    `
    INSERT INTO "account" ("name")
    VALUES ($1)
    RETURNING "id";
    `;
    const result = await connection.query(queryAddAccount, [name]);
    const accountId = result.rows[0].id; // the returned id is stored in this new variable accountId

    const queryInitialDeposit =
    `
    INSERT INTO "register" ("acct_id", "amount")
    VALUES ($1, $2);
    `;
    await connection.query(queryInitialDeposit, [accountId, amount]);
    await connection.query('COMMIT');
    res.sendStatus(200);
  }catch(err){
    await connection.query('ROLLBACK;');
    console.error('Error in account.router.js /new', err);
    res.sendStatus(500);
  }finally{
    connection.release();
  }
})

module.exports = router;
