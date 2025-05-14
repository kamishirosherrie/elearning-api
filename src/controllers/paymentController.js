import { mongo } from 'mongoose'
import crypto from 'crypto'
import { paymentModel } from '~/models/paymentModel'
import { vnpayResponse } from '~/utils/vnpay'
import { env } from '~/config/environment'

export const createOrder = async (req, res) => {
    try {
        const { amount, orderInfo } = req.body
        const orderId = new mongo.ObjectId().toString()
        const payment = new paymentModel({ orderId, amount, orderInfo })
        await payment.save()

        const paymentUrl = vnpayResponse(orderId, amount, orderInfo)
        console.log(
            `[VNPay] Tạo yêu cầu thanh toán với orderId: ${orderId}, amount: ${amount}, orderInfo: ${orderInfo}`,
        )
        console.log(`[VNPay] URL thanh toán: ${paymentUrl}`)

        return res.status(201).json({ url: paymentUrl })
    } catch (error) {
        res.status(500).send('Lỗi khi tạo yêu cầu thanh toán')
        console.error('[VNPay] Lỗi khi tạo yêu cầu thanh toán:', error)
    }
}

export const paymentReturn = async (req, res) => {
    try {
        const params = { ...req.query }

        const secureHash = params.vnp_SecureHash
        delete params.vnp_SecureHash
        delete params.vnp_SecureHashType
        if (params.vnp_OrderInfo) {
            params.vnp_OrderInfo = decodeURIComponent(params.vnp_OrderInfo).replace(/ /g, '+')
        }
        const sortedParams = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join('&')

        const hash = crypto.createHmac('sha512', env.VNPAY_SECURE_SECRET).update(sortedParams, 'utf-8').digest('hex')
        console.log('[DEBUG] Secret:', env.VNPAY_SECURE_SECRET)
        console.log('[DEBUG] Sorted:', sortedParams)
        console.log('[DEBUG] VNPAY hash:', secureHash)
        console.log('[DEBUG] Local hash:', hash)

        if (hash !== secureHash) {
            console.log('[VNPay] Chữ ký không hợp lệ')

            return res.status(400).send('Chữ ký không hợp lệ')
        }

        const { vnp_TxnRef, vnp_ResponseCode } = params

        if (vnp_ResponseCode === '00') {
            console.log('[VNPay] Giao dịch thành công')

            await paymentModel.findOneAndUpdate({ orderId: vnp_TxnRef }, { transactionStatus: 'Success' })
            return res.status(200).send('Thanh toán thành công')
        } else {
            console.log('[VNPay] Giao dịch thất bại')

            await paymentModel.findOneAndUpdate({ orderId: vnp_TxnRef }, { transactionStatus: 'Failed' })
            return res.status(400).send('Giao dịch thất bại')
        }
    } catch (error) {
        console.error('[VNPay] Lỗi xử lý callback:', error)
        res.status(500).send('Lỗi xử lý phản hồi thanh toán')
    }
}
