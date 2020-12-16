const {sequelize} = require('../../index')
const {DataTypes} = require('sequelize')
const {Registration} = require('./registration')
const {Round} = require('./round')

const Tournament = sequelize.define('tournament', {
    tournamentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
})

Tournament.hasMany(Registration, {
    foreignKey: 'tournamentId',
    onDelete: 'cascade'
})

Tournament.hasMany(Round, {
    foreignKey: 'tournamentId',
    onDelete: 'cascade'
})

module.exports = {Tournament}