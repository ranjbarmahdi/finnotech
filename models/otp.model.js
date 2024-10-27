import { DataTypes } from 'sequelize';
import sequelize from '../configs/sequelize.config.js';
import User from './user.model.js';

const OTP = sequelize.define(
    'OTP',
    {
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otpExpireDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

User.hasOne(OTP, { foreignKey: 'userId', onDelete: 'CASCADE' });
OTP.belongsTo(User, { foreignKey: 'userId' });

export default OTP;
