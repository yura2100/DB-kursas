const {TournamentAdapter} = require('./tablesAdapters/tournamentAdapter')

async function checkTournamentStart() {
    await TournamentAdapter.findAndStartTodaysTournaments()

    const interval = 1000 * 60 * 60 * 24

    const startOfDay = Math.floor(Date.now() / interval) * interval
    const endOfDay = startOfDay + interval - 1

    setTimeout(() => {
        checkTournamentStart()
    }, endOfDay - Date.now())
}

module.exports = {checkTournamentStart}