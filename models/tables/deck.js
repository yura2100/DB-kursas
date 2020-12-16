const {sequelize} = require('../../index')
const {DataTypes} = require('sequelize')
const {Card} = require('./card')
const {Registration} = require('./registration')

const Deck = sequelize.define('deck', {
    deckId: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Deck.hasMany(Card, {
    foreignKey: 'deckId',
    onDelete: 'cascade'
})

module.exports = {Deck}