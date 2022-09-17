import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const PostImage = sequelize.define('PostImage',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    path_image: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'post_image',
    timestamp: false,
})