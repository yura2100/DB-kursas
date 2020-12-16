const {sequelize} = require('../../index')
const {QueryTypes} = require('sequelize')
const {Registration} = require('../tables/registration')
const {Round} = require('../tables/round')
const {Tournament} = require('../tables/tournament')

class TournamentAdapter {
    static async add(name, date) {
        await Tournament.create({
            name: name,
            date: date
        })
    }

    static async delete(tournamentId) {
        await Tournament.destroy({
            where: {
                tournamentId: tournamentId
            }
        })
    }

    static async edit(tournamentId, newAttributes) {
        await Tournament.update(newAttributes, {
            where: {
                tournamentId: tournamentId
            }
        })
    }

    static async find(param = '') {
        return await sequelize.query(
            `SELECT * FROM tournaments WHERE (name LIKE '${param}%') OR (date LIKE '${param}%')`, {
                type: QueryTypes.SELECT,
                raw: true
            })
    }

    static async sort(orderBy, searchParam = '') {
        return await sequelize.query(
            `SELECT * FROM tournaments WHERE (name LIKE '${searchParam}%') OR (date LIKE '${searchParam}%') ORDER BY ${orderBy} ASC`, {
                type: QueryTypes.SELECT,
                raw: true
            })
    }

    static async getOne(tournamentId) {
        return await Tournament.findByPk(tournamentId, {
            raw: true
        })
    }

    static async getStatus(tournamentId) {
        const tournament = await Tournament.findByPk(tournamentId)
        const totalPlayers = await Registration.count({
            where: {
                tournamentId: tournamentId
            }
        })
        const maxRound = await Round.max('number', {
            where: {
                tournamentId: tournamentId
            }
        })

        if (Date.now() < Date.parse(tournament.date))
            return 'не почався'
        else if (maxRound < Math.log2(totalPlayers))
            return 'активний'
        else
            return 'закінчився'
    }

    static async findAvailableTournaments(nick, searchParam = '') {
        const tournaments = await sequelize.query(
            `SELECT t.tournamentId, t.name, t.description, t.date
             FROM tournaments t
             WHERE t.tournamentId NOT IN
             (SELECT r.tournamentId
              FROM registrations r
              WHERE r.nick = '${nick}')
             AND (t.name LIKE '${searchParam}%' OR t.date LIKE '${searchParam}%')`, {
                raw: true,
                type: QueryTypes.SELECT
            })

        const result = []

        for (const tournament of tournaments) {
            if (await TournamentAdapter.getStatus(tournament.tournamentId) === 'не почався')
                result.push(tournament)
        }

        return result
    }

    static async sortAvailableTournaments(nick, orderBy, searchParam = '') {
        const tournaments = await sequelize.query(
            `SELECT t.tournamentId, t.name, t.description, t.date
             FROM tournaments t
             WHERE t.tournamentId NOT IN
             (SELECT r.tournamentId
              FROM registrations r
              WHERE r.nick = '${nick}')
             AND (t.name LIKE '${searchParam}%' OR t.date LIKE '${searchParam}%')
             ORDER BY ${orderBy}`, {
                raw: true,
                type: QueryTypes.SELECT
            })

        const result = []

        for (const tournament of tournaments) {
            if (await TournamentAdapter.getStatus(tournament.tournamentId) === 'не почався')
                result.push(tournament)
        }

        return result
    }
}

module.exports = {TournamentAdapter}