const {Sequelize} = require('sequelize')
const {config} = require('./config')

const sequelize = new Sequelize(
    'hearthstone',
    config.user,
    config.password, {
        dialect: 'mysql',
        host: 'localhost',
        define: {
            timestamps: false
        }
    }
)

module.exports = {sequelize}

const express = require('express')
const exphbs = require('express-handlebars')
const playersAdminRouter = require('./routers/playersAdmin')
const tournamentsAdminRouter = require('./routers/tournamentsAdmin')
const playerRouter = require('./routers/player')
const tournamentsRouter = require('./routers/tournaments')
const registerOnTournamentRouter = require('./routers/registerOnTournament')
const statsRouter = require('./routers/stats')
const activeTournamentsRouter = require('./routers/activeTournaments')
const {checkTournamentStart} = require('./models/checkTournamentStart')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.use('/admin/players', playersAdminRouter)
app.use('/admin/tournaments', tournamentsAdminRouter)
app.use('/', playerRouter)
app.use('/tournaments', tournamentsRouter)
app.use('/registerOnTournament', registerOnTournamentRouter)
app.use('/stats', statsRouter)
app.use('/active', activeTournamentsRouter)

app.listen(3000, async () => {
    checkTournamentStart()
})