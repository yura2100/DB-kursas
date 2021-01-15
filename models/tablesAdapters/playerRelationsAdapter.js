const {sequelize} = require('../../index')
const {QueryTypes} = require('sequelize')
const {Registration} = require('../tables/registration')
const {DeckAdapter} = require('../tablesAdapters/deckAdapter')
const {TournamentAdapter} = require('../tablesAdapters/tournamentAdapter')

//decks - массив объектов, таких что name: string, class: string, cards: string[]
class PlayerRelationsAdapter {
    static async registerOnTournament(nick, tournamentId, decks) {
        const registration = await Registration.create({
            nick: nick,
            tournamentId: tournamentId
        })

        for (const deck of decks) {
            try {
                await DeckAdapter.add(
                    registration.registrationId,
                    deck.name,
                    deck.class,
                    deck.cards
                )
            } catch (e) {
                throw e
            }
        }
    }

    static async deleteRegistration(nick, tournamentId) {
        await Registration.destroy({
            where: {
                nick: nick,
                tournamentId: tournamentId
            }
        })
    }

    static async getPlayersTournaments(nick) {
        return await sequelize.query(
            `SELECT t.tournamentId, t.name, t.date
             FROM tournaments t
             INNER JOIN registrations r on t.tournamentId = r.tournamentId
             INNER JOIN players p on r.nick = p.nick
             WHERE p.nick = '${nick}'
             ORDER BY t.name`, {
                type: QueryTypes.SELECT,
                raw: true
            }
        )
    }

    static async getPlayersActiveTournaments(nick) {
        let allPlayersTournaments = await PlayerRelationsAdapter.getPlayersTournaments(nick)
        const activeTournaments = []

        for (const tournament of allPlayersTournaments) {
            if (await TournamentAdapter.getStatus(tournament.tournamentId) === 'активний')
                activeTournaments.push(tournament)
        }

        for (const tournament of activeTournaments) {
            tournament.round = await TournamentAdapter.getMaxRound(tournament.tournamentId)
        }

        return activeTournaments
    }

    static async checkPlayerCanPlay(nick, tournamentId) {
        const countLostRounds = await sequelize.query(
            `SELECT COUNT(*) AS count
            FROM rounds
            WHERE tournamentId = ${tournamentId} 
                AND (playerOne = '${nick}' OR playerTwo = '${nick}')
                AND winner IS NOT NULL
                AND winner != '${nick}'`, {
                type: QueryTypes.SELECT,
                raw: true
            }
        )

        return countLostRounds[0].count === 0
    }

    static async checkResultExists(nick, tournamentId) {
        const maxRound = await TournamentAdapter.getMaxRound(tournamentId)
        const result = await sequelize.query(
            `SELECT COUNT(*) AS count
            FROM rounds
            WHERE tournamentId = ${tournamentId}
            AND number = ${maxRound}
            AND winner = '${nick}'`, {
                type: QueryTypes.SELECT,
                raw: true
            }
        )

        return result[0].count === 1
    }

}

module.exports = {PlayerRelationsAdapter}