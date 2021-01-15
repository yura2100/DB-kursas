const {Router} = require('express')
const router = Router()
const {StatsAdapter} = require('../models/tablesAdapters/statsAdapter')

router.get('/:nick', async (req, res) => {
    const {nick} = req.params
    const tops = {
        maxPlayers: await StatsAdapter.getTournamentsWithMaxPlayers(5),
        minPlayers: await StatsAdapter.getTournamentsWithMinPlayers(5),
        closestTournaments: await StatsAdapter.getClosestTournaments(5),
        hottestTournaments: await StatsAdapter.getHottestTournaments(5)
    }

    res.render('stats', {
        layout: 'mainPlayer',
        isStats: true,
        title: 'Цікаві турніри',
        nick: nick,
        tops: tops
    })
})

module.exports = router