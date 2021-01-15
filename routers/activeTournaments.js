const {Router} = require('express')
const router = Router()
const {TournamentAdapter} = require('../models/tablesAdapters/tournamentAdapter')
const {TournamentRelationsAdapter} = require('../models/tablesAdapters/tournamentRelationsAdapter')
const {PlayerRelationsAdapter} = require('../models/tablesAdapters/playerRelationsAdapter')

router.get('/:nick', async (req, res) => {
    const {nick} = req.params
    const tournaments = await PlayerRelationsAdapter.getPlayersActiveTournaments(nick)

    res.render('activeTournaments', {
        layout: 'mainPlayer',
        isActive: true,
        title: 'Активні турніри',
        nick: nick,
        tournaments: tournaments
    })
})

router.get('/:nick/show/:tournamentId/:round', async (req, res) => {
    const {nick, tournamentId, round} = req.params
    const tournament = await TournamentAdapter.getOne(tournamentId)
    const canPlay = await PlayerRelationsAdapter.checkPlayerCanPlay(nick, tournamentId)
    const resultExists = await PlayerRelationsAdapter.checkResultExists(nick, tournamentId)
    const opponent = await TournamentRelationsAdapter.getPlayersOpponent(nick, tournamentId, round)

    res.render('roundResult', {
        layout: 'mainPlayer',
        title: `Результати раунду ${round}`,
        nick: nick,
        canPlay: canPlay,
        resultExists: resultExists,
        tournament: tournament,
        round: round,
        opponent: opponent
    })
})

router.get('/:nick/winner/:tournamentId/:round/:winner', async (req, res) => {
    const {nick, tournamentId, round, winner} = req.params

    await TournamentRelationsAdapter.roundResults(tournamentId, round, winner)

    res.redirect(`/active/${nick}`)
})

module.exports = router