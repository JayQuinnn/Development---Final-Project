// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//         host: 'pg',
//         port: 5432,
//         user: process.env.POSTGRES_USER,
//         password: process.env.POSTGRES_PASSWORD,
//         database: process.env.POSTGRES_DATABASE
//     }
// });
const knex = require("knex")({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ["knex", "public"],
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
/**
 * When a user posts the required data to this endpoint, the api will handle the data and put
 * it in a new object which will be sent of to a new function to handle database integration.
 * @returns a 200 in case adding it is successful.
 */
server.post('/characters/add', (req, res) => {
    let ownerID = req.body.ownerID;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let description = req.body.description;
    let character_race = req.body.character_race;
    let character_class = req.body.character_class;
    let newCharacter = { ownerID, first_name, last_name, description, character_race, character_class };
    //TO DO: create a function (test-made to add the new character to the db)
    res.status(200).send();
})

/**
 * Depending on the given parameters, a specific row of data will be updated.
 * @returns a 200 status code in case updating was successful.
 */
server.put('characters/:ownerID/:first_name/:last_name', (req, res) => {
    let ownerID = req.params.ownerID;
    let originalName = req.params.first_name;
    let originalLastName = req.params.last_name;
    //TO DO: Create a function (test-made) to update a specific row.
    res.status(200).send();
})

/**
 * Depending on the given parameters, a specific row of data will be returned.
 * @returns an object in case updating was successful, containing data of the requested Character.
 */
server.get('characters/:ownerID/:first_name/:last_name', (req, res) => {
    let ownerID = req.params.ownerID;
    let originalName = req.params.first_name;
    let originalLastName = req.params.last_name;
    //TO DO: Create a function (test-made) to return a specific row.
    res.status(200).send();
})

server.listen(PORT, () => {
    console.log(`Server is listenin at port ${PORT}. I'm working!!!!`)
})
initTables()
/**
 * Automatically creates a default table in case it doesn't exist yet.
 * The table consists of the following fields: id, first_name, last_name, description, class and race.
 */

async function delCharacter() {

}

async function initTables() {
    console.log('Initialising Tables...')
    await knex.schema.hasTable('users').then(function (exists) {
        if (!exists) {
            console.log(`Table 'tblCharacters' doesn't exist, now creating.`)
            return knex.schema.createTable('tblCharacters', function (t) {
                t.increments('characterID').primary();
                t.integer('ownerID')
                t.string('firstName', 100);
                t.string('lastName', 100);
                t.text('description');
                t.string('characterRace', 25);
                t.string('characterClass', 25)
            });
            console.log('Table tblCharacters has been created.')
        }
        else {
            console.log(`Table 'tblCharacters' already exists. Skipping creation.`)
        }
    });
}