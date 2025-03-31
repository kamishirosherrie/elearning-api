import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const tokenDecode = jwt.verify(token, env.ACCESS_TOKEN_SECRET)
        req.user = tokenDecode

        next()
    } catch (error) {
        return res.status(403).json({ message: error.message, error: error })
    }
}
