const {Deck} = require('../tables/deck')
const {Card} = require('../tables/card')
const {Registration} = require('../tables/registration')
const {Op} = require('sequelize')

class DeckAdapter {
    static async add(registrationId, name, cardClass, cards) {
        const deck = await Deck.create({
            name: name,
            class: cardClass,
            registrationId: registrationId
        })

        for (const card of cards) {
            Card.create({
                deckId: deck.deckId,
                name: card
            })
        }
    }

    static async delete(deckId) {
        await Deck.destroy({
            where: {
                deckId: deckId
            }
        })
    }

    static async edit(deckId, newAttributes, newCards) {
        await Deck.update(newAttributes, {
            where: {
                deckId: deckId
            }
        })

        const cards = await Card.findAll({
            where: {
                deckId: deckId
            }
        })

        for (let i = 0; i < cards.length; i++) {
            await cards[i].destroy()
            await Card.create({
                deckId: deckId,
                name: newCards[i]
            })
        }
    }

    static async find(deckId, param) {
        return await Card.findAll({
            raw: true,
            where: {
                [Op.and]: [
                    {deckId: deckId},
                    {[Op.like]: {name: `${param}%`}}
                ]
            }
        })
    }

    static async getDecksOfPlayerInTournament(nick, tournamentId) {
        const registration = await Registration.findOne({
            raw: true,
            where: {
                [Op.and]: [
                    {nick: nick},
                    {tournamentId: tournamentId}
                ]
            }
        })

        const decks = await Deck.findAll({
            raw: true,
            where: {
                registrationId: registration.registrationId
            }
        })

        const result = []
        for (const deck of decks) {
            let cards = await Card.findAll({
                raw: true,
                where: {
                    deckId: deck.deckId
                }
            })

            cards = cards.map(card => card.name)

            result.push({
                name: deck.name,
                class: deck.class,
                cards: cards
            })
        }

        return result
    }

    static async sort(deckId, orderIn = 'ASC') {
        return await Card.findAll({
            raw: true,
            where: {
                deckId: deckId
            },
            order: [
                ['name', orderIn]
            ]
        })
    }
}

module.exports = {DeckAdapter}