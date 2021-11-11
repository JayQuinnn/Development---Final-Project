const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'pg',
        port: 5432,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE
    }
});
const bodyParser = require('body-parser');
const express = require('express');
const server = express();
const PORT = process.env.PORT;
const OWNER = {
    name: 'Jai Quinn',
    age: 20
}
let arrayOfOwners = [OWNER];
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }))
/**
 * API endpoint that a user can connect to which will reply with 'Hello World'.
 * @returns {string} the API will respond with 'Hello World' in the BODY.
 */
server.get('/', (req, res) => {
    res.send('Hello World!');
});
/**
 * API endpoint that a user can connect to in order to get information about the owners.
 * @returns {array} the API will respond with the information of the owner(s) in a JSON version of an ARRAY.
 */
server.get('/owner', (req, res) => {
    res.json(arrayOfOwners);
})
/**
 * When a user posts to this endpoint, the API will push the data to the arrayOfOwners variable.
 * @returns a 200 status in case it's successful.
 */
server.post('/owner', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let newOwner = { name: name, email: email };
    arrayOfOwners.push(newOwner);
    res.status(200).send();
})

server.listen(PORT, () => {
    console.log(`Server is listenin at port ${PORT}.`)
})
initTables()
/**
 * Automatically creates a default table in case it doesn't exist yet.
 * The table consists of the following fields: id, first_name, last_name, description, class and race.
 */
function initTables() {
    console.log('Initialising Tables...')
    knex.schema.hasTable('users').then(function (exists) {
        if (!exists) {
            console.log(`Table 'users' doesn't exist, now creating.`)
            return knex.schema.createTable('users', function (t) {
                t.increments('id').primary();
                t.string('first_name', 100);
                t.string('last_name', 100);
                t.text('description');
            });
            console.log('Table Users has been created.')
        }
        else {
            console.log(`Table 'users' already exists. Skipping creation.`)
        }
    });
}