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

export const paymentReturn = (req, res) => {
    const vnp_Params = req.query
    const secureHash = vnp_Params['vnp_Signature']
    delete vnp_Params['vnp_Signature']

    const signature = validateSignature(vnp_Params, secureHash)

    if (signature) {
        const orderId = vnp_Params['vnp_OrderId']
        const transactionStatus = vnp_Params['vnp_TransactionStatus']

        if (transactionStatus === '00') {
            paymentModel.updateOne({ orderId }, { transactionStatus: 'Success' }, () => {
                res.send('Thanh toán thành công!')
            })
        } else {
            paymentModel.updateOne({ orderId }, { transactionStatus: 'Failed' }, () => {
                res.send('Thanh toán thất bại!')
            })
        }
    } else {
        res.send('Dữ liệu bị thay đổi')
    }
}
