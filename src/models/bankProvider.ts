import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const BankProvider = sequelize.define('BankProvider',
{
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    short_name: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    display: {
        type: DataTypes.STRING(10),
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'bank_provider',
    timestamp: false
})