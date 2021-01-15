const {Router} = require('express')
const router = Router()
const {TournamentAdapter} = require('../models/tablesAdapters/tournamentAdapter')
const {TournamentRelationsAdapter} = require('../models/tablesAdapters/tournamentRelationsAdapter')
const {DeckAdapter} = require('../models/tablesAdapters/deckAdapter')
const {PDFCreate} = require('../models/pdfCreators/PDFCreate')
const {countDaysBeforeTournament} = require('../models/countDaysBeforeTournament')

router.get('/', async (req, res) => {
    res.render('tournamentsAdmin', {
        title: 'Турніри',
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        table: 'tournaments',
        tournaments: await TournamentAdapter.find(),
    })
})

router.post('/', async (req, res) => {
    res.render('tournamentsAdmin', {
        title: 'Турніри',
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        table: 'tournaments',
        tournaments: await TournamentAdapter.find(req.body.search),
        searchValue: req.body.search
    })
})

router.get('/add', async (req, res) => {
    res.render('addTournaments', {
        title: 'Додати турнір'
    })
})

router.post('/add', async (req, res) => {
    const {name, date} = req.body

    await TournamentAdapter.add(name, date)

    res.redirect('/admin/tournaments')
})

router.get('/show/:tournamentId', async (req, res) => {
    const {tournamentId} = req.params

    const players = await TournamentRelationsAdapter.getTournamentsPlayers(tournamentId)
    const tournament = await TournamentAdapter.getOne(tournamentId)
    const status = await TournamentAdapter.getStatus(tournamentId)

    const didntStart = status === 'не почався'
    const timeToStart = didntStart ? countDaysBeforeTournament(tournament.date) : null
    const canStart = timeToStart === '0 днів'

    res.render('oneTournamentAdmin', {
        title: `${tournament.name}`,
        tournament: tournament,
        players: players,
        status: status,
        timeToStart: timeToStart,
        canStart: canStart
    })
})

router.get('/delete/:tournamentId', async (req, res) => {
    await TournamentAdapter.delete(req.params.tournamentId)

    res.redirect('/admin/tournaments')
})

router.get('/edit/:tournamentId', async (req, res) => {
    res.render('editTournament', {
        title: 'Змінити турнір',
        tournament: await TournamentAdapter.getOne(req.params.tournamentId)
    })
})

router.post('/edit/:tournamentId', async (req, res) => {
    await TournamentAdapter.edit(req.params.tournamentId, req.body)

    res.redirect('/admin/tournaments')
})

router.get('/sort/:orderBy/', async (req, res) => {
    const {orderBy} = req.params

    res.render('tournamentsAdmin', {
        title: 'Турніри',
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        table: 'tournaments',
        tournaments: await TournamentAdapter.sort(orderBy),
        orderedBy: orderBy
    })
})

router.get('/sort/:orderBy/:searchParam', async (req, res) => {
    const {orderBy, searchParam} = req.params

    res.render('tournamentsAdmin', {
        title: 'Турніри',
        isTournament: true,
        searchPlaceholder: 'Пошук турнірів за назвою або датою',
        table: 'tournaments',
        tournaments: await TournamentAdapter.sort(orderBy, searchParam),
        searchValue: searchParam,
        orderedBy: orderBy
    })
})

router.get('/registration/:tournamentId/:nick', async (req, res) => {
    const {nick, tournamentId} = req.params

    const decks = await DeckAdapter.getDecksOfPlayerInTournament(nick, tournamentId)
    const tournament = await TournamentAdapter.getOne(tournamentId)

    res.render('registrationAdmin', {
        title: `Реєстрація ${nick}`,
        decks: decks,
        tournament: tournament,
        nick: nick
    })
})

router.get('/report/:tournamentId', async (req, res) => {
    const {tournamentId} = req.params

    const path = await PDFCreate.createRegistrationReport(tournamentId)

    res.download(path)
})

module.exports = router