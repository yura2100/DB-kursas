const {Op} = require('sequelize')
const {Player} = require('../tables/player')

class PlayerAdapter {
    static async add(nick, name, surname, password) {
        try {
            await Player.create({
                nick: nick,
                name: name,
                surname: surname,
                password: password
            })
        } catch (e) {
            throw new Error(`Гравець з ніком ${nick} вже існує`)
        }
    }

    static async delete(nick) {
        await Player.destroy({
            where: {
                nick: nick
            }
        })
    }

    static async edit(nick, newAttributes) {
        await Player.update(newAttributes, {
            where: {
                nick: nick
            }
        })
    }

    static async find(param = '') {
        return await Player.findAll({
            raw: true,
            where: {
                [Op.or]: [
                    {nick: {[Op.like]: `${param}%`}},
                    {name: {[Op.like]: `${param}%`}},
                    {surname: {[Op.like]: `${param}%`}}
                ]
            }
        })
    }

    static async getOne(nick) {
        return await Player.findByPk(nick, {
            raw: true
        })
    }

    static async sort(orderBy, searchParam = '') {
        return await Player.findAll({
            raw: true,
            order: [
                [orderBy, 'ASC']
            ],
            where: {
                [Op.or]: [
                    {nick: {[Op.like]: `${searchParam}%`}},
                    {name: {[Op.like]: `${searchParam}%`}},
                    {surname: {[Op.like]: `${searchParam}%`}}
                ]
            }
        })
    }
}

module.exports = {PlayerAdapter}