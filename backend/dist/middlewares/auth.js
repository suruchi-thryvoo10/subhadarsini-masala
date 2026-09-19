import jwt from 'jsonwebtoken';
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access token is missing or malformed',
            errorCode: 'UNAUTHORIZED'
        });
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'subhadarshini_jwt_super_secret_key_2026_production';
    try {
        const decoded = jwt.verify(token, secret);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired access token',
            errorCode: 'INVALID_TOKEN'
        });
    }
};
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
                errorCode: 'UNAUTHORIZED'
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: User role '${req.user.role}' lacks permission for this action`,
                errorCode: 'FORBIDDEN'
            });
        }
        next();
    };
};
