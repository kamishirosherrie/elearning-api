import { roleModel } from '~/models/roleModel'

export const getRoles = async (req, res) => {
    try {
        const roles = await roleModel.find()
        res.status(200).json({
            message: 'Get roles successfully',
            roles,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get roles failed',
            error: error.message,
        })
    }
}
