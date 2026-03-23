import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) return res.status(500).json({ message: 'Server configuration error.' });
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // { id, role }
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }
    next();
};
