const {sequelize} = require('../../index')
const {DataTypes} = require('sequelize')

const Card = sequelize.define('card', {
    cardId: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
})

module.exports = {Card}