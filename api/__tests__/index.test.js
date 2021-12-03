const { initTables, delCharacter, addCharacter, getAllCharacters, getCharacter } = require('../index')
const knex = require("knex")({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ["knex", "public"],
});
//Yea, I have no idea why this passes.
test("addCharacter, getCharacter -> Trying to add (and get) a character", () => {
    const Character = {
        ownerID: 24,
        firstName: 'Cirilla',
        lastName: 'Dash',
        description: `Cirilla Dash, once beloved in the kingdom
        of her parents, now left alone. She became a mercary for
        hire at the age of 17 because of her vast magical powers.`,
        characterRace: 'Eladrin',
        characterClass: 'Sorcerer'
    }
    addCharacter(Character, 'color: #FF0000').then(function () {
        result = getCharacter('Cirilla', 'Dash').then(function () {
            console.log(result, 'color: #bada55')
            expect(result).toBe(Character);
        })
    })
});
// Doesnt work.
test("delCharacter -> Trying to DELETE a character", () => {
    const Character = {
        ownerID: 24,
        firstName: 'Cirilla',
        lastName: 'Dash',
    }
    delCharacter(Character).then(function () {
        expect(getCharacter('Cirilla', 'Dash')).toBe(null)
    })

});

test('updateCharacter -> Updating a character.',() => {
    
})