import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export default function authenticate(req, res, next) {
    const authHeader = req?.headers?.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { phone, exp } = payload;

        const currentTime = Math.floor(Date.now() / 1000);
        if (exp < currentTime) {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        }

        const user = await User.findOne({ where: { phone } });
        if (!user) {
            return res.status(400).json({ message: 'User Not Found' });
        }

        req.user = user;

        next();
    });
}
