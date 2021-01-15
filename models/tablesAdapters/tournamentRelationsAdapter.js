const {sequelize} = require('../../index')
const {QueryTypes, Op} = require('sequelize')
const {Round} = require('../tables/round')
const {Registration} = require('../tables/registration')
const {TournamentAdapter} = require('../tablesAdapters/tournamentAdapter')

class TournamentRelationsAdapter {
    static async addRound(tournamentId, number, playerOne, playerTwo, winner = null) {
        await Round.create({
            tournamentId: tournamentId,
            number: number,
            playerOne: playerOne,
            playerTwo: playerTwo,
            winner: winner
        })
    }

    static async getTournamentsPlayers(tournamentId) {
        return await sequelize.query(
            `SELECT p.nick, p.name, p.surname, p.country, p.city, p.email
             FROM players p
             INNER JOIN registrations r on p.nick = r.nick
             INNER JOIN tournaments t on r.tournamentId = t.tournamentId
             WHERE t.tournamentId = ${tournamentId}
             ORDER BY p.nick`, {
                type: QueryTypes.SELECT,
                raw: true
            }
        )
    }

    static async checkRegistration(nick, tournamentId) {
        const registration = await Registration.findOne({
            raw: true,
            where: {
                [Op.and]: [
                    {nick: nick},
                    {tournamentId: tournamentId}
                ]
            }
        })

        return !registration
    }

    static async getPlayersOpponent(nick, tournamentId, round) {
        const players = await sequelize.query(
            `SELECT playerOne, playerTwo
            FROM rounds
            WHERE tournamentId = '${tournamentId}' AND number = ${round} AND (playerOne = '${nick}' OR playerTwo = '${nick}')`, {
                type: QueryTypes.SELECT,
                raw: true
            }
        )

        const {playerOne, playerTwo} = players[0]

        return playerOne === nick ? playerTwo : playerOne
    }

    static async roundResults(tournamentId, round, winner) {
        const findResult = await sequelize.query(
            `SELECT winner
            FROM rounds
            WHERE tournamentId = '${tournamentId}' AND number = ${round} AND (playerOne = '${winner}' OR playerTwo = '${winner}')`, {
                type: QueryTypes.SELECT,
                raw: true
            }
        )

        if (findResult[0].winner === null) {
            await sequelize.query(
                `UPDATE rounds
                SET winner = '${winner}'
                WHERE tournamentId = '${tournamentId}' AND number = ${round} AND (playerOne = '${winner}' OR playerTwo = '${winner}')`, {
                    type: QueryTypes.UPDATE
                }
            )

            if (await TournamentRelationsAdapter.checkRoundEnd(tournamentId, round)) {
                await TournamentRelationsAdapter.startNewRound(tournamentId, round)
            }
        }
    }

    static async checkRoundEnd(tournamentId, round) {
        const notEndedRounds = await Round.count({
            where: {
                [Op.and]: [
                    {tournamentId: tournamentId},
                    {number: round},
                    {winner: null}
                ]
            }
        })

        return notEndedRounds === 0 && await TournamentAdapter.getStatus(tournamentId) === 'активний'
    }

    static async startNewRound(tournamentId, round) {
        const players = await sequelize.query(
            `SELECT winner
            FROM rounds
            WHERE tournamentId = ${tournamentId} AND number = ${round}`
        )

        for (let i = 0; i < players.length; i += 2) {
            await TournamentRelationsAdapter.addRound(tournamentId, round + 1, players[i], players[i + 1])
        }
    }
}

module.exports = {TournamentRelationsAdapter}