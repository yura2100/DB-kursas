const {sequelize} = require('../../index')
const {QueryTypes, Op} = require('sequelize')
const {Round} = require('../tables/round')
const {Registration} = require('../tables/registration')

class TournamentRelationsAdapter {
    // static async addRound(roundId, tournamentId, number, playerOne, playerTwo) {
    //     await Round.create({
    //         roundId: roundId,
    //         tournamentId: tournamentId,
    //         number: number,
    //         playerOne: playerOne,
    //         playerTwo: playerTwo
    //     })
    // }

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
}

module.exports = {TournamentRelationsAdapter}