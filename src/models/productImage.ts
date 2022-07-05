import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const ProductImage = sequelize.define('ProductImage',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    path_img: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    hover: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    premium: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    display: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    member_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'product_image',
    timestamp: false,
})