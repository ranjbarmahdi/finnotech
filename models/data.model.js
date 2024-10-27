import { DataTypes } from 'sequelize';
import sequelize from '../configs/sequelize.config.js';
import User from './user.model.js';

const Data = sequelize.define('Data', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default Data;
