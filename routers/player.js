const {Router} = require('express')
const router = Router()
const {PlayerAdapter} = require('../models/tablesAdapters/playerAdapter')
const {PlayerRelationsAdapter} = require('../models/tablesAdapters/playerRelationsAdapter')


router.get('/', async (req, res) => {
    res.render('login', {
        layout: 'mainLogin',
        title: 'Авторизація',
        logo: 'Авторизація'
    })
})

router.post('/', async (req, res) => {
    const {nick, password} = req.body

    const player = await PlayerAdapter.getOne(nick)

    if (player.password === password) {
        res.redirect(`/player/show/${nick}`)
    } else {
        res.render('login', {
            layout: 'mainLogin',
            title: 'Авторизація',
            logo: 'Авторизація',
            errorMessage: `Введено невірний нік або пароль`
        })
    }
})

router.get('/player/add', async (req, res) => {
    res.render('addPlayer', {
        layout: 'mainLogin',
        title: 'Реєстрація',
        logo: 'Реєстрація',
    })
})

router.post('/player/add', async (req, res) => {
    const {nick, name, surname} = req.body

    try {
        await PlayerAdapter.add(nick, name, surname)

        res.redirect(`/player/show/${nick}`)
    } catch (e) {
        res.render('addPlayer', {
            layout: 'mainLogin',
            title: 'Реєстрація',
            logo: 'Реєстрація',
            errorMessage: e.message
        })
    }
})

router.get('/player/edit/:nick', async (req, res) => {
    const {nick} = req.params

    res.render('editPlayer', {
        layout: 'mainPlayer',
        title: `Змінити граця ${nick}`,
        nick: nick,
        player: await PlayerAdapter.getOne(nick)
    })
})

router.post('/player/edit', async (req, res) => {
    const {nick} = req.body

    await PlayerAdapter.edit(nick, req.body)

    res.redirect(`/player/show/${nick}`)
})

router.get('/player/show/:nick', async (req, res) => {
    const {nick} = req.params

    const tournaments = await PlayerRelationsAdapter.getPlayersTournaments(nick)

    res.render('onePlayer', {
        layout: 'mainPlayer',
        title: `Гравець ${nick}`,
        nick: nick,
        player: await PlayerAdapter.getOne(nick),
        tournaments: tournaments
    })
})

router.get('/player/:nick/showOther/:nickRegistered', async (req, res) => {
    const {nick, nickRegistered} = req.params
    const otherPlayer = nick !== nickRegistered

    const tournaments = await PlayerRelationsAdapter.getPlayersTournaments(nickRegistered)

    res.render('onePlayer', {
        layout: 'mainPlayer',
        title: `Гравець ${nickRegistered}`,
        nick: nick,
        player: await PlayerAdapter.getOne(nickRegistered),
        tournaments: tournaments,
        otherPlayer: otherPlayer
    })
})



module.exports = router