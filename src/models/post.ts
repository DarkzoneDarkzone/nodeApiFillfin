import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const Post = sequelize.define('Post',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    post_code: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    store_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    caption: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    display: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'post',
    timestamp: false,
})