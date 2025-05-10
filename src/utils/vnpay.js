import crypto from 'crypto'

const vnpayConfig = {
    vnp_TmnCode: '76IXUY2Q',
    vnp_HashSecret: '9WPZPWIFD9TAN5T5UXL1L7LUYST3L684',
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ReturnUrl: 'https://emaster.vercel.app/payment/return',
}

export const createPaymentUrl = (orderId, amount, orderInfo) => {
    const vnp_Params = {
        vnp_Version: '2.0.0',
        vnp_Command: 'pay',
        vnp_TmnCode: vnpayConfig.vnp_TmnCode,
        vnp_Amount: amount * 100,
        vnp_Currency: 'VND',
        vnp_OrderInfo: orderInfo,
        vnp_OrderId: orderId,
        vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
        vnp_TxnRef: orderId,
        vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
        vnp_Locale: 'vn',
    }

    const sortedParams = Object.keys(vnp_Params).sort()
    let queryString = ''
    sortedParams.forEach((key) => {
        queryString += key + '=' + vnp_Params[key] + '&'
    })
    queryString = queryString.substring(0, queryString.length - 1)

    const signature = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret).update(queryString).digest('hex')
    vnp_Params['vnp_Signature'] = signature

    return vnpayConfig.vnp_Url + '?' + new URLSearchParams(vnp_Params).toString()
}

export const validateSignature = (vnp_Params, secureHash) => {
    const sortedParams = Object.keys(vnp_Params).sort()
    let queryString = ''
    sortedParams.forEach((key) => {
        queryString += key + '=' + vnp_Params[key] + '&'
    })
    queryString = queryString.substring(0, queryString.length - 1)

    const signature = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret).update(queryString).digest('hex')
    return signature === secureHash
}
