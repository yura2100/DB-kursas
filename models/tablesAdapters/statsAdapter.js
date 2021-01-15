const {sequelize} = require('../../index')
const {QueryTypes} = require('sequelize')

class StatsAdapter {
    static async getTournamentsWithMaxPlayers(tournamentsCount) {
        return await new StatsAdapter().getTournamentsWithMaxOrMinPlayers(tournamentsCount, 'DESC')
    }

    static async getTournamentsWithMinPlayers(tournamentsCount) {
        return await new StatsAdapter().getTournamentsWithMaxOrMinPlayers(tournamentsCount, 'ASC')
    }

    static async getClosestTournaments(tournamentsCount) {
        return await sequelize.query(
            `SELECT tournamentId, name, date
                 FROM tournaments
                 WHERE date > NOW()
                 ORDER BY date ASC
                 LIMIT ${tournamentsCount}`, {
                raw: true,
                type: QueryTypes.SELECT
            })
    }

    static async getHottestTournaments(tournamentsCount) {
        return await sequelize.query(
            `WITH count_tournaments (tournamentId, count)
                 AS
                 (
                     SELECT tournamentId, COUNT(*) AS count
                     FROM registrations
                     GROUP BY tournamentId
                 )

                 SELECT t.tournamentId, t.name, t.date, c.count
                 FROM tournaments t
                 INNER JOIN count_tournaments c
                 ON t.tournamentId = c.tournamentId
                 WHERE t.date > NOW()
                 ORDER BY c.count DESC, t.date ASC
                 LIMIT ${tournamentsCount}`, {
                raw: true,
                type: QueryTypes.SELECT
            })
    }

    async getTournamentsWithMaxOrMinPlayers(tournamentsCount, maxOrMin) {
        return await sequelize.query(
            `WITH count_tournaments (tournamentId, count)
                 AS
                 (
                     SELECT tournamentId, COUNT(*) AS count
                     FROM registrations
                     GROUP BY tournamentId
                 )

                 SELECT t.tournamentId, t.name, c.count
                 FROM tournaments t
                 INNER JOIN count_tournaments c
                 ON t.tournamentId = c.tournamentId
                 WHERE t.date > NOW()
                 ORDER BY c.count ${maxOrMin}
                 LIMIT ${tournamentsCount}`, {
                raw: true,
                type: QueryTypes.SELECT
            })
    }

}

module.exports = {StatsAdapter}