const { Parampos } = require(".")

const initOptions = {
    MODE: 'TEST',// TEST or PROD (Default is PROD)
    CLIENT_CODE: '10738',
    CLIENT_USERNAME: 'Test',
    CLIENT_PASSWORD: 'Test',
    GUID: '0c13d406-873b-403b-9c09-a5766840d98c',

}
// init Module
const client = new Parampos(initOptions)

const payOptions = {
    cardName: 'Example User',
    cardNumber: '5401341234567891',
    cardExpmonth: '12',
    cardExpyear: '2026',
    cardCvv: '000',
    cardHolderPhone: '5445555555',
    failUrl: 'https://example.com/',
    successUrl: 'https://example.com/',
    orderId: Date.now(),
    description: 'Example product description',
    total: '10,00',  // Total Price
    securityType: 'NS',// NS or 3D (default = NS (Non security))
    ipAddress: '127.1.1.1',// (default = 127.1.1.1)
    installment: '1'//number of installments (Default = 1)
}

//Get paid function (Promise)
client.setPaid(payOptions).then(result => {
    console.log("result", result)
}).catch(error => {
    console.log("error", error)
})