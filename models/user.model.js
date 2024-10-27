import { DataTypes } from 'sequelize';
import sequelize from '../configs/sequelize.config.js';

const User = sequelize.define(
    'User',
    {
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                validateIranianCellphone(value) {
                    const regex = /^(09|\+989)\d{9}$/;
                    if (!regex.test(value)) {
                        throw new Error('cellPhone Is Invalid.');
                    }
                },
            },
        },
    },
    {
        timestamps: false,
    }
);

export default User;
