const nodemailer = require('nodemailer')
const {config} = require('../../config')
const {PlayerAdapter} = require('../tablesAdapters/playerAdapter')
const {DeckAdapter} = require('../tablesAdapters/deckAdapter')
const {TournamentAdapter} = require('../tablesAdapters/tournamentAdapter')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailUser,
        pass: config.emailPassword
    }
})

class SendEmail {
    static async registrationReport(nick, tournamentId) {
        const player = await PlayerAdapter.getOne(nick)

        if (player.email) {
            const tournament = await TournamentAdapter.getOne(tournamentId)
            const decks = await DeckAdapter.getDecksOfPlayerInTournament(nick, tournamentId)

            let html =
                `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
                    <div class="container">
                        <div class="row">`

            for (let i = 0; i < 3; i++) {

                let cards = ``
                for (let j = 0; j < 15; j++) {
                    cards += `<tr>
                                <td>${j + 1}. ${decks[i].cards[j]}</td>
                              </tr>`
                }

                html +=
                    `<h4>Колода ${i + 1}</h4>
                     <div>
                        <h6><strong>Назва: </strong>${decks[i].name}</h6>
                        <h6><strong>Клас: </strong>${decks[i].class}</h6>
                        <table>
                            <tbody>
                                ${cards}
                            </tbody>
                        </table>
                     </div>`
            }

            html += `</div></div>`

            const mailOptions = {
                to: player.email,
                subject: `Вас було зареєстровано на турнір ${tournament.name}`,
                html: html
            }

            await transporter.sendMail(mailOptions)
        }
    }
}

module.exports = {SendEmail}