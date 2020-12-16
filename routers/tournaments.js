const {Router} = require('express')
const router = Router()
const {TournamentAdapter} = require('../models/tablesAdapters/tournamentAdapter')
const {TournamentRelationsAdapter} = require('../models/tablesAdapters/tournamentRelationsAdapter')
const {DeckAdapter} = require('../models/tablesAdapters/deckAdapter')
const {PlayerRelationsAdapter} = require('../models/tablesAdapters/playerRelationsAdapter')
const {countDaysBeforeTournament} = require('../models/countDaysBeforeTournament')

router.get('/:nick', async (req, res) => {
    const {nick} = req.params

    res.render('tournaments', {
        layout: 'mainPlayer',
        title: 'Турніри',
        nick: nick,
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        tournaments: await TournamentAdapter.find(),
    })
})

router.post('/:nick', async (req, res) => {
    const {nick} = req.params
    const {search} = req.body

    res.render('tournaments', {
        layout: 'mainPlayer',
        title: 'Турніри',
        nick: nick,
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        tournaments: await TournamentAdapter.find(search),
        searchValue: search
    })
})

router.get('/:nick/sort/:orderBy/', async (req, res) => {
    const {nick, orderBy} = req.params

    res.render('tournaments', {
        layout: 'mainPlayer',
        title: 'Турніри',
        nick: nick,
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        tournaments: await TournamentAdapter.sort(orderBy),
        orderedBy: orderBy
    })
})

router.get('/:nick/sort/:orderBy/:searchParam', async (req, res) => {
    const {nick, orderBy, searchParam} = req.params

    res.render('tournaments', {
        layout: 'mainPlayer',
        title: 'Турніри',
        nick: nick,
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        tournaments: await TournamentAdapter.sort(orderBy, searchParam),
        searchValue: searchParam,
        orderedBy: orderBy
    })
})

router.get('/:nick/show/:tournamentId', async (req, res) => {
    const {nick, tournamentId} = req.params

    const players = await TournamentRelationsAdapter.getTournamentsPlayers(tournamentId)
    const tournament = await TournamentAdapter.getOne(tournamentId)
    const status = await TournamentAdapter.getStatus(tournamentId)

    const didntStart = status === 'не почався'

    const canRegister = didntStart && await TournamentRelationsAdapter.checkRegistration(nick, tournamentId)
    const canDeleteRegister = didntStart && await TournamentRelationsAdapter.checkRegistration(nick, tournamentId) === false

    const timeToStart = didntStart ? countDaysBeforeTournament(tournament.date) : null

    res.render('oneTournament', {
        layout: 'mainPlayer',
        title: `${tournament.name}`,
        nick: nick,
        tournament: tournament,
        players: players,
        status: status,
        timeToStart: timeToStart,
        canRegister: canRegister,
        canDeleteRegister: canDeleteRegister
    })
})

router.get('/:nick/registration/:tournamentId/:nickRegistered', async (req, res) => {
    const {nick, tournamentId, nickRegistered} = req.params

    const decks = await DeckAdapter.getDecksOfPlayerInTournament(nickRegistered, tournamentId)
    const tournament = await TournamentAdapter.getOne(tournamentId)

    res.render('registration', {
        layout: 'mainPlayer',
        title: `Реєстрація ${nickRegistered}`,
        nick: nick,
        decks: decks,
        tournament: tournament,
        nickRegistered: nickRegistered
    })
})

router.get('/deleteRegister/:nick/:tournamentId', async (req, res) => {
    const {nick, tournamentId} = req.params

    await PlayerRelationsAdapter.deleteRegistration(nick, tournamentId)

    res.redirect(`/player/show/${nick}`)
})

router.get(`/:nick/availabelTournaments`, async (req, res) => {
    const {nick} = req.params

    const tournaments = await TournamentAdapter.findAvailableTournaments(nick)

    res.render('tournaments', {
        layout: 'mainPlayer',
        title: 'Турніри',
        nick: nick,
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        availabelTournaments: true,
        tournaments: tournaments
    })
})

router.post(`/:nick/availabelTournaments`, async (req, res) => {
    const {nick} = req.params
    const {search} = req.body

    const tournaments = await TournamentAdapter.findAvailableTournaments(nick, search)

    res.render('tournaments', {
        layout: 'mainPlayer',
        title: 'Турніри',
        nick: nick,
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        availabelTournaments: true,
        tournaments: tournaments,
        searchValue: search
    })
})

router.get('/:nick/availabelTournaments/sort/:orderBy/', async (req, res) => {
    const {nick, orderBy} = req.params

    const tournaments = await TournamentAdapter.sortAvailableTournaments(nick, orderBy)

    res.render('tournaments', {
        layout: 'mainPlayer',
        title: 'Турніри',
        nick: nick,
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        availabelTournaments: true,
        tournaments: tournaments,
        orderedBy: orderBy
    })
})

router.get('/:nick/availabelTournaments/sort/:orderBy/:searchParam', async (req, res) => {
    const {nick, orderBy, searchParam} = req.params

    const tournaments = await TournamentAdapter.sortAvailableTournaments(nick, orderBy, searchParam)

    res.render('tournaments', {
        layout: 'mainPlayer',
        title: 'Турніри',
        nick: nick,
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        availabelTournaments: true,
        tournaments: await TournamentAdapter.sort(orderBy, searchParam),
        searchValue: searchParam,
        orderedBy: orderBy
    })
})

module.exports = router