const {sequelize} = require('../../index')
const {QueryTypes} = require('sequelize')
const {Registration} = require('../tables/registration')
const {DeckAdapter} = require('../tablesAdapters/deckAdapter')

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
}

module.exports = {PlayerRelationsAdapter}