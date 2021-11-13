const { initTables, delCharacter, addCharacter, getAllCharacters, getCharacter } = require('../index')

test("addCharacter -> Trying to add a character", () => {
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
    addCharacter(Character)

});