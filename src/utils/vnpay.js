import { ProductCode, VNPay, VnpLocale, dateFormat, ignoreLogger } from 'vnpay'
import { env } from '~/config/environment'

const vnpay = new VNPay({
    tmnCode: '76IXUY2Q',
    secureSecret: env.VNPAY_SECURE_SECRET,
    vnpayHost: 'https://sandbox.vnpayment.vn',

    testMode: true,
    hashAlgorithm: 'SHA512',
    enableLog: true,
    loggerFn: ignoreLogger,

    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
})

export const vnpayResponse = (orderId, amount, orderInfo) => {
    const now = new Date()
    const expireDate = new Date(now.getTime() + 15 * 60 * 1000)
    const vnpayResponse = vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: '127.0.0.1',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `${env.FRONTEND_URL}/payment/result`,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(now),
        vnp_ExpireDate: dateFormat(expireDate),
    })

    return vnpayResponse
}
