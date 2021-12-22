module.exports = {
    initTables, delCharacter, addCharacter, getCharacter, getAllCharacters, raceToID
}
const knex = require("knex")({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ["knex", "public"],
});
const bodyParser = require('body-parser');
const express = require('express');
const server = express();
const PORT = process.env.PORT;
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }))
/**
 * API endpoint that a user can connect to which will reply with 'Hello World'.
 * @returns {string} the API will respond with 'Hello World' in the BODY.
 */
server.get('/characters', (req, res) => {
    knex.select().table('tblCharacters').then(function (data) {
        res.send(data);
    });
});

/**
 * When a user posts the required data to this endpoint, the api will handle the data and put
 * it in a new object which will be sent of to a new function to handle database integration.
 * @returns a 200 in case adding it is successful.
 */
server.post('/characters/add', (req, res) => {
    console.log(req.body.ownerID)
    let ownerID = req.body.ownerID;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let description = req.body.description;
    let characterRace = req.body.characterRace;
    let characterClass = req.body.characterClass;
    let characterRaceID = raceToID(characterRace)
    let newCharacter = { ownerID, firstName, lastName, description, characterRaceID, characterClass };
    addCharacter(newCharacter)
    res.status(200).send();
})

/**
 * Depending on the given parameters, a specific row of data will be updated.
 * @returns a 200 status code in case updating was successful.
 */
server.put('/characters/update', (req, res) => {
    console.log(req.body.ownerID)
    let ownerID = req.body.ownerID;
    let originalName = req.body.originalName
    let originalLastName = req.body.originalLastName
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let description = req.body.description;
    let characterRace = req.body.characterRace;
    let characterClass = req.body.characterClass;
    let newCharacter = { ownerID, originalName, originalLastName, firstName, lastName, description, characterRace, characterClass };
    updateCharacter(newCharacter)
    res.status(200).send();
})

/** 
 * This endpoint will delete a specific row, depending on the OwnerID, firstName and lastName.
 * @param {id} OwnerID
 * @param {string} firstName
 * @param {string} lastName
 * @returns a 200 status code in case it's successful.
 */
server.delete('/characters/del', (req, res) => {
    let ownerID = req.body.ownerID;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let Character = {
        ownerID: ownerID,
        firstName: firstName,
        lastName: lastName
    }
    console.log(`Deleting character ${firstName} ${lastName}`)
    delCharacter(Character)
    res.status(200).send()
})

/**
 * Depending on the given parameters, a specific row of data will be returned.
 * @returns an object in case updating was successful, containing data of the requested Character.
 */
server.get('/characters/search/:firstName/:lastName', (req, res) => {
    let firstName = req.params.firstName;
    let lastName = req.params.lastName;
    getCharacter(firstName, lastName).then(function (data) {
        res.send(data)
    });
    //TO DO: Create a function (test-made) to return a specific row.

})

server.get('/races', async (req, res) => {
    let result = showRaces();
    res.send(result)
})
server.get('/races/:race', async (req, res) => {
    let race = req.params.race;
    let result = await findRace(race);
    res.send(result)
})
server.post('/races/add', async (req, res) => {
    let race = req.body.race
    await addRace(race)
    res.status(200).send()
})
server.put('/races/update', async (req, res) => {
    let originalRace = req.body.originalRace;
    let newRace = req.body.newRace;
    await updateRace(originalRace, newRace)
    res.status(200).send()
})
server.delete('/races/delete', async (req, res) => {
    let race = req.body.race
    delRace(race)
    res.status(200).send()
})
server.listen(PORT, () => {
    console.log(`Server is listenin at port ${PORT}. I'm working!!!!`)
})
initTables()


/**
 * The function will update the entire database data. Which specific character will depend on the originalName field.
 * @param {Object} Character 
 */
async function updateCharacter(Character) {
    await knex.table('tblCharacters')
        .where('ownerID', Character.ownerID)
        .where('firstName', Character.originalName)
        .where('lastName', Character.originalLastName)
        .update({
            ownerID: Character.ownerID,
            firstName: Character.firstName,
            lastName: Character.lastName,
            description: Character.description,
            characterRace: Character.characterRace,
            characterClass: Character.characterClass
        })
    console.log(`Updated character ${Character.originalName} ${Character.originalLastName} to ${Character.firstName} ${Character.lastName}`)
}

/**
 * 
 * @returns the full datasheet of the table 'tblcharacters'
 */
async function getAllCharacters() {
    let result = knex.select().table('tblCharacters').then(function (data) {
        return data
    });
    return result
}


/**
 * The function will look for a specific character, depending on the first and last name of the character
 * @param {string} firstName 
 * @param {string} lastName 
 * @returns an object of all the available data of the result.
 * ERRORS: When 
 */
async function getCharacter(firstName, lastName) {
    console.log(`Looking for character ${firstName} ${lastName}`)
    let result
    await knex.select()
        .table('tblCharacters')
        .where('firstName', firstName)
        .where('lastName', lastName)
        .then(function (data) {
            console.log(data)
            result = data[0]
        });
    return result
}

/**
 * The function will delete a character from the Characters table depending on the owner information.
 * @param {delCharacter} delCharacter includes ownerID, firstName and lastName.
 */
async function delCharacter(Character) {
    await knex.table('tblCharacters')
        .where('ownerID', Character.ownerID)
        .where('firstName', Character.firstName)
        .where('lastName', Character.lastName)
        .del()
    console.log(`Deleted character ${Character.firstName} ${Character.lastName}`)
}
/**
 * Function will add a new character to the table. 
 * @param {Character} Character includes ownerID, firstName, lastName, Descirption, characterRace, characterClass.
 */
async function addCharacter(Character) {
    await knex.table('tblCharacters')
        .insert({
            ownerID: Character.ownerID,
            firstName: Character.firstName,
            lastName: Character.lastName,
            description: Character.description,
            characterRaceID: Character.characterRaceID,
            characterClass: Character.characterClass
        })
    console.log(`Added Character ${Character.firstName} ${Character.lastName}`)
}
/**
 * @param {String} race will add a new usable race inside the database.
 */
async function addRace(race) {
    await knex.table('tblRaces')
        .insert({ characterRace: race });
    console.log("Added new race: " + race)
}
/**
 * @returns the full datasheet of the table 'tblRaces'
 */
async function showRaces() {
    let result = knex.select().table('tblRaces').then(function (data) {
        return data
    });
    return result
}
/**
 * Function will find a race, to see if it's in the table or not.
 * @param {String} race 
 * @returns {String} result
 */
async function findRace(race) {
    console.log(`Looking for race ${race}`)
    let result
    await knex.select()
        .table('tblRaces')
        .where('characterRace', race)
        .then(function (data) {
            console.log(data)
            result = data[0]
        });
    return result
}
/**
 * Function will delete a race from the tblRaces table
 * @param {String} race 
 */
async function delRace(race) {
    console.log(`Deleting race ${race}`)
    await knex.select()
        .table('tblRaces')
        .where('characterRace', race)
        .del()
    console.log(`Deleted race ${race}`)
}
/**
 * Function will edit a race from the table (y'know, in case of typo's)
 * @param {String} originalRace 
 * @param {String} newRace 
 */
async function updateRace(originalRace, newRace) {
    await knex.table('tblRaces')
        .where('characterRace', originalRace)
        .update({
            characterRace: newRace,
        })
    console.log(`Updated characterRace ${originalRace} to ${newRace}`)
}

/**
 * Automatically creates a default table in case it doesn't exist yet.
 * The table consists of the following fields: id, first_name, last_name, description, class and race.
 * Also creates the second 'Races' table where all possible d&d races get sent to
 */
async function initTables() {
    console.log('Initialising Tables...')
    await knex.schema.hasTable('tblCharacters').then(function (exists) {
        if (!exists) {
            console.log(`Table 'tblCharacters' doesn't exist, now creating.`)
            return knex.schema.createTable('tblCharacters', function (t) {
                t.increments('characterID').primary();
                t.double('ownerID')
                t.string('firstName', 100);
                t.string('lastName', 100);
                t.text('description');
                t.double('characterRaceID');
                t.string('characterClass', 25)
            });
            console.log('Table tblCharacters has been created.')
        }
        else {
            console.log(`Table 'tblCharacters' already exists. Skipping creation.`)
        }
    });
    await knex.schema.hasTable('tblRaces').then(function (exists) {
        if (exists) {
            return knex.schema.dropTable('tblRaces')
        }
    })
    await knex.schema.hasTable('tblRaces').then(function (exists) {
        if (!exists) {
            console.log(`Table 'tblRaces' doesn't exist, now creating.`)
            return knex.schema.createTable('tblRaces', function (t) {
                t.increments('raceID').primary();
                t.string('characterRace')
            });
            console.log('Table tblRaces has been created.')
        }
        else {
            console.log(`Table 'tblRaces' already exists. Skipping creation.`)
        }
    });
    await initRaceTable()
    // await addDummyData()
}
/**
 * This function will create the 'race' table. It will also put in the following d&d compatible races:
 * Elf, Half Elf, High Elf, Drow, Human, and Orc.
 */
async function initRaceTable() {
    console.log('Initialising tblRaces')
    await knex.table('tblRaces')
        .insert([{ characterRace: 'Elf' }, { characterRace: 'Half Elf' }, { characterRace: 'High Elf' }, { characterRace: 'Drow' }, { characterRace: 'Human' }, { characterRace: 'Orc' }]);
}
/**
 * 
 * @param {String} characterRace. This is a name of the race that should be applied to the Character.
 * @returns {Integer} result. will have the ID from the 'Race' table that links to the original Race string
 */
async function raceToID(characterRace) {
    let result
    await knex.select()
        .table('tblRaces')
        .where('characterRace', characterRace)
        .then(function (data) {
            console.log(data)
            result = data[0].raceID
        });
    return result
}
/**
 * 
 * @param {String} table. A name of the table that should be dropped
 * The function will then...drop this table. (This function is mainly used for cleanup)
 */
async function dropCustomTable(table) {
    console.log(`Removing table ${table}`)
    await knex.schema.hasTable(table).then(function (exists) {
        if (exists) {
            return knex.schema.dropTable(table)
        }
    })
}
/**
 * This function will add 3 characters to the tblCharacters table. You can disable this function in case you know how the database works.
 */
async function addDummyData() {
    await knex.table('tblCharacters')
        .insert([{
            ownerID: 1,
            firstName: 'Jai',
            lastName: 'Quinn',
            description: 'Exhiled as a teenager, he had to fight and take on a hard life in order to survive.',
            characterRaceID: 1,
            characterClass: 'Rogue'
        }, {
            ownerID: 1,
            firstName: 'Cirilla',
            lastName: 'Dash',
            description: `What once used to be a great sorcerer, got thrown of her throne. Now she's looking for revenge on the council who kicked her off her throne.`,
            characterRaceID: 4,
            characterClass: 'Sorcerer'
        }, {
            ownerID: 1,
            firstName: 'Cobble',
            lastName: '',
            description: `Made out of stone..I didn't get time to think about this Character`,
            characterRaceID: 6,
            characterClass: 'Paladin'
        }])
}