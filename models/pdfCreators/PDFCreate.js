const PDFDocument = require('pdfkit')
const fs = require('fs')
const {TournamentAdapter} = require('../tablesAdapters/tournamentAdapter')
const {TournamentRelationsAdapter} = require('../tablesAdapters/tournamentRelationsAdapter')
const {DeckAdapter} = require('../tablesAdapters/deckAdapter')
const {countDaysBeforeTournament} = require('../countDaysBeforeTournament')

class PDFCreate {
    static async createRegistrationReport(tournamentId) {
        const doc = new PDFDocument({compress: false})
        doc.registerFont('Times New Roman', `${__dirname}/times-new-roman.ttf`)
        doc.font('Times New Roman')

        const tournament = await TournamentAdapter.getOne(tournamentId)
        const status = await TournamentAdapter.getStatus(tournamentId)
        const players = await TournamentRelationsAdapter.getTournamentsPlayers(tournamentId)

        const path = `pdfs/report${tournamentId}.pdf`

        const pdfStream = fs.createWriteStream(path)

        doc.fontSize(18)
        doc.text(`Турнір: ${tournament.name}`, {
            align: "center"
        })

        doc.fontSize(14)
        doc.text(`Дата: ${tournament.date}\nОпис: ${tournament.description || '—'}\nСтатус: ${status}`)

        if (status === 'не почався')
            doc.text(`До початку: ${countDaysBeforeTournament(tournament.date)}`)

        doc.fontSize(18)
        doc.text('Гравці:', {
            align: "center"
        })

        doc.fontSize(14)

        for (let i = 0; i < players.length; i++) {
            const {nick, name, surname, country, city, email} = players[i]

            doc.text(`${i + 1}.`)
            doc.text(`Нік: ${nick}`)
            doc.text(`Ім'я: ${name}`)
            doc.text(`Прізвище: ${surname}`)
            doc.text(`Країна: ${country  || '—'}`)
            doc.text(`Місто: ${city  || '—'}`)
            doc.text(`Електрона пошта: ${email  || '—'}`)

            doc.fontSize(16)
            doc.text('Колоди:', {
                align: "center"
            })
            doc.fontSize(14)

            const decks = await DeckAdapter.getDecksOfPlayerInTournament(nick, tournamentId)

            doc.fontSize(12)
            for (let j = 0; j < decks.length; j++) {
                doc.text(`${j + 1}.`)
                doc.text(`Назва: ${decks[j].name}`)
                doc.text(`Класс: ${decks[j].class}`)
                doc.text(`Карти:\n `, {
                    align: "center"
                })

                doc.fontSize(10)
                for (let k = 0; k < decks[j].cards.length; k++) {
                    doc.text(`${k + 1}. ${decks[j].cards[k]}`, {
                        align: "center"
                    })
                }

                doc.fontSize(12)
            }

            doc.fontSize(14)
        }

        doc.pipe(pdfStream)
        doc.end()

        return new Promise((resolve, reject) => {
            pdfStream.addListener('finish', () => {
                resolve(path)
            })
        })
    }
}

module.exports = {PDFCreate}