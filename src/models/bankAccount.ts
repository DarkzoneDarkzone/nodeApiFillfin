import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const BankAccount = sequelize.define('BankAccount',
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
    bank_number: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    branch: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    bank_provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(10),
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'bank_account',
    timestamp: false
})