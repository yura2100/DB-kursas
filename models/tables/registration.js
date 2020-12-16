const {sequelize} = require('../../index')
const {DataTypes} = require('sequelize')
const {Deck} = require('./deck')

const Registration = sequelize.define('registration', {
    registrationId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nick: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tournamentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
})

Registration.hasMany(Deck, {
    foreignKey: 'registrationId',
    onDelete: 'cascade'
})

module.exports = {Registration}
