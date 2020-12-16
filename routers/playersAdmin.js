const {Router} = require('express')
const router = Router()
const {PlayerAdapter} = require('../models/tablesAdapters/playerAdapter')
const {PlayerRelationsAdapter} = require('../models/tablesAdapters/playerRelationsAdapter')

router.get('/', async (req, res) => {
    res.render('players', {
        title: 'Гравці',
        isPlayer: true,
        searchPlaceholder: 'Пошук гравців за ніком, ім\'ям або прізвищем',
        table: 'players',
        players: await PlayerAdapter.find()
    })
})

router.post('/', async (req, res) => {
    res.render('players', {
        title: 'Гравці',
        isPlayer: true,
        searchPlaceholder: 'Пошук гравців за ніком, ім\'ям або прізвищем',
        table: 'players',
        players: await PlayerAdapter.find(req.body.search),
        searchValue: req.body.search
    })
})

router.get('/add', async (req, res) => {
    res.render('addPlayerAdmin', {
        title: 'Додати гравця'
    })
})

router.post('/add', async (req, res) => {
    const {nick, name, surname} = req.body

    try {
        await PlayerAdapter.add(nick, name, surname)

        res.redirect('/admin/players')
    } catch (e) {
        res.render('addPlayerAdmin', {
            title: 'Додати гравця',
            errorMessage: e.message
        })
    }
})

router.get('/show/:nick', async (req, res) => {
    const tournaments = await PlayerRelationsAdapter.getPlayersTournaments(req.params.nick)

    res.render('onePlayerAdmin', {
        title: `Гравець ${req.params.nick}`,
        player: await PlayerAdapter.getOne(req.params.nick),
        tournaments: tournaments
    })
})

router.get('/delete/:nick', async (req, res) => {
    await PlayerAdapter.delete(req.params.nick)

    res.redirect('/admin/players')
})

router.get('/edit/:nick', async (req, res) => {
    res.render('editPlayerAdmin', {
        title: `Змінити граця ${req.params.nick}`,
        player: await PlayerAdapter.getOne(req.params.nick)
    })
})

router.post('/edit', async (req, res) => {
    await PlayerAdapter.edit(req.body.nick, req.body)

    res.redirect('/admin/players')
})

router.get('/sort/:orderBy/', async (req, res) => {
    res.render('players', {
        title: 'Гравці',
        isPlayer: true,
        searchPlaceholder: 'Пошук гравців за ніком, ім\'ям або прізвищем',
        table: 'players',
        players: await PlayerAdapter.sort(req.params.orderBy),
        orderedBy: req.params.orderBy
    })
})

router.get('/sort/:orderBy/:searchParam', async (req, res) => {
    res.render('players', {
        title: 'Гравці',
        isPlayer: true,
        searchPlaceholder: 'Пошук гравців за ніком, ім\'ям або прізвищем',
        table: 'players',
        players: await PlayerAdapter.sort(req.params.orderBy, req.params.searchParam),
        searchValue: req.params.searchParam,
        orderedBy: req.params.orderBy
    })
})

module.exports = router