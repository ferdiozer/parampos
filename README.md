# Parampos-node

Parampos payment system node js version



## Installation

`npm i parampos --save`

Example

```
const { Parampos } = require('parampos')

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
```




Example Bank Cards

```

ZİRAAT BANKASI
Card Number (Visa): 4546711234567894
Kart Numarası (Master Card): 5401341234567891
Expiration Date: 12/26
CVV: 000
3D Secure Password: a

FİNANSBANK
Card Number (Visa): 4022774022774026
Kart Numarası (Master Card): 5456165456165454
Expiration Date: 12/26
CVV: 000
3D Secure Password: a

AKBANK
Card Number (Visa): 4355084355084358
Kart Numarası (Master Card): 5571135571135575
Expiration Date: 12/26
CVV: 000
3D Secure Password: a

İŞ BANKASI
Card Number (Visa): 4508034508034509
Kart Numarası (Master Card): 5406675406675403
Expiration Date: 12/26
CVV: 000
3D Secure Password: a

HALK BANKASI
Card Number (Visa): 4531444531442283
Kart Numarası (Master Card): 5818775818772285
Expiration Date: 12/26
CVV: 001
3D Secure Password: a

DENİZBANK
Card Number (Visa): 4090700101174272
Expiration Date: 12/22
CVV: 104
3D Secure Password:123

Card Number (Visa): 4090700090840057
Expiration Date: 11/22
CVV: 592
3D Secure Password:123

Card Number (Visa): 5200190006338608
Expiration Date: 05/21
CVV: 306
3D Secure Password:123

Card Number (Visa): 5200190009721495
Expiration Date: 05/21
CVV: 200
3D Secure Password:123

YAPIKREDİ
Card Number (Visa): 4506347027911094
Card Number (Master Card):5400619360964581
Expiration Date: 03/22
CVV: 000
3D Secure Password:34020
HALK BANKASI
Card Number (Visa): 4531444531442283
Card Number (Master Card): 5818775818772285
Expiration Date: 12/26
CVV: 001
3D Secure Password: a

```

Note: Test cards only work in the test environment.


## Support
Documentation :
[Param Dev](https://dev.param.com.tr/en/)

NpmJs https://www.npmjs.com/package/parampos



## Author

[Ferdi Özer](https://github.com/ferdiozer) (info@ferdiozer.com).