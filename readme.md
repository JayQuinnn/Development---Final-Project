# Readme
## Goal
The goal of this project is to have all data of your personal D&D campaign stored locally.
## Setup.
### Requirements
- Docker (surprising)
## Commands to start
> $docker compose up
## After setup
the API part will run on localhost:3000 (by default).
the following links are available:
```
[GET] /
[GET] /characters/search
[POST] /characters/add
[PUT] /characters/update
[DELETE] /characters/del
[GET] /races
[GET] /races/:race
[POST] /races/add
[PUT] /races/update
[DELETE] /races/delete
```
## Body for characters API
The required body parameters are:
```
ownerID,
originalName,
originalLastName, 
firstName, 
lastName,
description, 
characterRace, 
characterClass
``` 
## Body for the tblRace API
The required body parameters are:
```
race

or when updating:
originalRace
newRace
``` 
## In case stuff breaks
follow this link for debug instructions:
https://www.youtube.com/watch?v=dQw4w9WgXcQ