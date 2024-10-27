import User from '../../models/user.model.js';
import OTP from '../../models/otp.model.js';
import UserUtils from '../util/user.util.js';
import jwt from 'jsonwebtoken';

export default class AuthController {
    static OTP_DIGITS = 5;
    static OTP_EXPIRE_MINUTE = 5;

    static async sendOtp(req, res) {
        const { phone } = req.body;

        try {
            let user = await User.findOne({ where: { phone } });
            if (!user) {
                user = await User.create({ phone });
            }

            let otp = await OTP.findOne({ where: { userId: user.id } });
            if (otp) {
                if (otp.otpExpireDate > new Date()) {
                    const remainingTime = Math.floor((otp.otpExpireDate - new Date()) / 1000);
                    return res.status(400).json({
                        message: `OTP exists and you can send it again after ${remainingTime} seconds`,
                    });
                } else {
                    const code = UserUtils.generateCode(AuthController.OTP_DIGITS);
                    const otpExpireDate = new Date(
                        Date.now() + AuthController.OTP_EXPIRE_MINUTE * 60000
                    );
                    await otp.update({ code, otpExpireDate });
                    return res.status(200).json({
                        message: `OTP expired, a new OTP has been sent successfully. code : ${code}`,
                    });
                }
            } else {
                const code = UserUtils.generateCode(AuthController.OTP_DIGITS);
                const otpExpireDate = new Date(
                    Date.now() + AuthController.OTP_EXPIRE_MINUTE * 60000
                );
                await OTP.create({ userId: user.id, code, otpExpireDate });
                return res
                    .status(200)
                    .json({ message: `New OTP created and send. code : ${code}` });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async checkOtp(req, res) {
        const { phone, code } = req.body;

        try {
            const user = await User.findOne({ where: { phone } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const otp = await OTP.findOne({ where: { userId: user.id } });
            if (!otp || otp.code != code || otp.otpExpireDate < new Date()) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }

            const token = jwt.sign({ phone: user.phone }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });

            return res.json({ message: 'Login Successfully.', token });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async test(req, res) {
        res.json({ message: 'ASDASDAD' });
    }
}
