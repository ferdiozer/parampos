
var Soap = require('./Soap')


const urls = {
    prodURL: 'https://dmzws.ew.com.tr/turkpos.ws/service_turkpos_prod.asmx',
    testURL: 'https://test-dmz.param.com.tr:4443/turkpos.ws/service_turkpos_test.asmx'
}

class Parampos {
    constructor({
        GUID,
        CLIENT_CODE,
        CLIENT_USERNAME,
        CLIENT_PASSWORD,
        MODE
    }) {
        this.GUID = GUID;
        this.CLIENT_CODE = CLIENT_CODE;
        this.CLIENT_USERNAME = CLIENT_USERNAME;
        this.CLIENT_PASSWORD = CLIENT_PASSWORD;
        this.MODE = MODE;
    }




    setPaid(args) {

        let {
            cardName,
            cardNumber,
            cardExpmonth,
            cardExpyear,
            cardCvv,
            cardHolderPhone,
            failUrl,
            successUrl,
            orderId,
            installment,
            description,
            total,
            securityType,
            ipAddress,
        } = args

        const url = this.MODE == 'TEST' ? urls.testURL : urls.prodURL

        args.ipAddress = args.ipAddress || '127.1.1.1'
        args.securityType = args.securityType || 'NS'
        args.installment = args.installment || '1'
        args.CLIENT_CODE = this.CLIENT_CODE;
        args.CLIENT_PASSWORD = this.CLIENT_PASSWORD
        args.CLIENT_USERNAME = this.CLIENT_USERNAME
        args.GUID = this.GUID

        return new Promise(async (resolve, reject) => {
            const securityString = this.CLIENT_CODE + this.GUID + args.installment + total + total + orderId + failUrl + successUrl;
            console.log(securityString);
            try {
                const createdHash = await Soap.requestHash(url, securityString)
                // console.log({ createdHash })
                console.log(createdHash)
                args.createdHash = createdHash;
                Soap.requestPay(url, args).then(result => {
                    // // console.log({ result })
                    return resolve(result)
                }).catch(err => {
                    return reject(err)
                })
            } catch (err) {
                return reject(err)
            }
        })

    }
}

/*
Parampos.arguments.MODE = {
    TEST: 'TEST',
    PROD: 'PROD'
};
*/

module.exports = Parampos