import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const ChatTemp = sequelize.define('ChatTemp',
{
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    user_code: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    member_code: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    from: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'chat_temp',
    timestamp: false
})