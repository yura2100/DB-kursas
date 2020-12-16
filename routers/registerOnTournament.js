const {Router} = require('express')
const router = Router()
const {TournamentAdapter} = require('../models/tablesAdapters/tournamentAdapter')
const {PlayerRelationsAdapter} = require('../models/tablesAdapters/playerRelationsAdapter')
const {SendEmail} = require('../models/email/sendEmail')
const fs = require('fs/promises')

router.get('/:nick/:tournamentId', async (req, res) => {
    const {nick, tournamentId} = req.params

    const tournament = await TournamentAdapter.getOne(tournamentId)

    const existingCards = JSON.parse(await fs.readFile('cards.txt'))

    res.render('registrationOnTournament', {
        layout: 'mainPlayer',
        title: `Реєстрація на турнір`,
        nick: nick,
        tournament: tournament,
        decks: new Array(3).fill(0).map((value, index) => index + 1),
        cards: new Array(15).fill(0).map((value, index) => index + 1),
        existingCards: existingCards
    })
})

router.post('/:nick/:tournamentId', async (req, res) => {
    const {nick, tournamentId} = req.params

    const decks = new Array(3)

    for (let i = 0; i < 3; i++) {
        decks[i] = {
            name: req.body[`name${i + 1}`],
            class: req.body[`class${i + 1}`],
            cards: new Array(15)
        }

        for (let j = 0; j < 15; j++) {
            decks[i].cards[j] = req.body[`card${j + 1}_${i + 1}`]

            console.log(`card${j + 1}_${i + 1}`, req.body[`card${j + 1}_${i + 1}`])
        }
    }

    await PlayerRelationsAdapter.registerOnTournament(nick, tournamentId, decks)
    await SendEmail.registrationReport(nick, tournamentId)

    res.redirect(`/player/show/${nick}`)
})

module.exports = router