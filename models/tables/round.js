const {sequelize} = require('../../index')
const {DataTypes} = require('sequelize')

const Round = sequelize.define('round', {
    roundId: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    tournamentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    playerOne: {
        type: DataTypes.STRING,
        allowNull: false
    },
    playerTwo: {
        type: DataTypes.STRING
    },
    winner: {
        type: DataTypes.STRING
    }
})

module.exports = {Round}