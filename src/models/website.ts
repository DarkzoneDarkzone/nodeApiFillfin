import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const Website = sequelize.define('Website',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
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
    video_link: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    image_link: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    display: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    isFile: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'website',
    timestamp: false,
})