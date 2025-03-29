import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        jwt.verify(token, env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({ message: 'Forbidden' })
            }
            req.user = user
        })
        next()
    } catch (error) {
        res.status(500).json({ message: 'Authenticate failed', error: error.message })
    }
}
