import { mongo } from 'mongoose'
import { paymentModel } from '~/models/paymentModel'
import { createPaymentUrl, validateSignature } from '~/utils/vnpay'

export const createOrder = async (req, res) => {
    try {
        const { amount, orderInfo } = req.body
        const orderId = new mongo.ObjectId()
        const payment = new paymentModel({ orderId, amount, orderInfo })
        await payment.save()

        const paymentUrl = createPaymentUrl(orderId, amount, orderInfo)

        return res.status(201).json({ url: paymentUrl })
    } catch (error) {
        res.status(500).send('Lỗi khi tạo yêu cầu thanh toán')
    }
}

export const paymentReturn = async (req, res) => {
    const vnp_Params = { ...req.query }
    const secureHash = vnp_Params['vnp_SecureHash']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    const isValid = validateSignature(vnp_Params, secureHash)

    if (!isValid) {
        return res.status(400).json({ message: 'Chữ ký không hợp lệ' })
    }

    const orderId = vnp_Params['vnp_TxnRef']
    const transactionStatus = vnp_Params['vnp_ResponseCode'] === '00' ? 'Success' : 'Failed'

    try {
        const result = await paymentModel.updateOne({ orderId }, { transactionStatus })

        if (result.modifiedCount === 0) {
            console.warn(`[VNPay] Không tìm thấy orderId ${orderId} để cập nhật`)
        }
        return res.redirect(`${process.env.FRONTEND_URL}/payment/result?orderId=${orderId}&status=${transactionStatus}`)
    } catch (error) {
        console.error('[VNPay] Lỗi khi cập nhật trạng thái:', error)
        return res.status(500).json({
            message: 'Lỗi khi cập nhật trạng thái giao dịch',
        })
    }
}
