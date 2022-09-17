import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const UsersPermission = sequelize.define('UsersPermission',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    user_type: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_type_th: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    permission: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    sequelize,
    tableName: 'users_permission',
    timestamp: false,
})