import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const Package = sequelize.define('Package',
{
    pack_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    package_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    day: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    month: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    year: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    gross_profit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    premium: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    display: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'package',
    timestamp: false,
})