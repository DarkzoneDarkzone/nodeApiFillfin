import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const Ads = sequelize.define('Ads',
{
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    position: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    isMen: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    h1: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    h2: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    display: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    img_path: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'ads',
    timestamp: false
})