const {sequelize} = require('../../index')
const {DataTypes} = require('sequelize')
const {Registration} = require('./registration')

const Player = sequelize.define('player', {
    nick: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Player.hasMany(Registration, {
    foreignKey: 'nick'
})

module.exports = {Player}