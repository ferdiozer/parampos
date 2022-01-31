
var request = require('request');
var xml2js = require('xml2js');

function createHashSecurityKey(url, securityString) {
    let xml = `<x:Envelope xmlns:x="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tur="https://turkpos.com.tr/">
        <x:Header/>
        <x:Body>
   <tur:SHA2B64>
   <tur:Data>${securityString}</tur:Data>
</tur:SHA2B64>
</x:Body>
</x:Envelope>`
    var options = {
        url,
        method: 'POST',
        body: xml,
        headers: {
            'Content-Type': 'text/xml;charset=utf-8',
            'Accept-Encoding': 'gzip,deflate',
            'Content-Length': xml.length
        }
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            // console.log('response:::', response)
            if (!error && response.statusCode == 200) {
                var parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    try {
                        const myHash = result['soap:Envelope']['soap:Body']['SHA2B64Response']['SHA2B64Result']
                        console.log(myHash)
                        return resolve(myHash)
                    } catch (error) {
                        return reject(error)
                    }
                });
            }
            else {
                return reject(error)
            }
        })
    })
}

function setPaid(url, {
    CLIENT_CODE,
    CLIENT_USERNAME,
    CLIENT_PASSWORD,
    GUID,
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
    createdHash,
    securityType,
    ipAddress,
}) {
    console.log(createdHash + "last hash")


    let xml = `<?xml version="1.0" encoding="utf-8"?> <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
    <Pos_Odeme xmlns="https://turkpos.com.tr/">
    <G>
    <CLIENT_CODE>${CLIENT_CODE}</CLIENT_CODE>
    <CLIENT_USERNAME>${CLIENT_USERNAME}</CLIENT_USERNAME>
    <CLIENT_PASSWORD>${CLIENT_PASSWORD}</CLIENT_PASSWORD>
    </G>
    <GUID>${GUID}</GUID>
    <KK_Sahibi>${cardName}</KK_Sahibi>
    <KK_No>${cardNumber}</KK_No>
    <KK_SK_Ay>${cardExpmonth}</KK_SK_Ay>
    <KK_SK_Yil>${cardExpyear}</KK_SK_Yil>
    <KK_CVC>${cardCvv}</KK_CVC>
    <KK_Sahibi_GSM>${cardHolderPhone}</KK_Sahibi_GSM>
    <Hata_URL>${failUrl}</Hata_URL>
    <Basarili_URL>${successUrl}</Basarili_URL>
    <Siparis_ID>${orderId}</Siparis_ID>
    <Siparis_Aciklama>${description}</Siparis_Aciklama>
    <Taksit>${installment}</Taksit>
    <Islem_Tutar>${total}</Islem_Tutar>
    <Toplam_Tutar>${total}</Toplam_Tutar>
    <Islem_Hash>${createdHash}</Islem_Hash>
    <Islem_Guvenlik_Tip>${securityType}</Islem_Guvenlik_Tip>
    <Islem_ID>sipariş1</Islem_ID>
    <IPAdr>${ipAddress}</IPAdr>
    <Ref_URL>www.ornekornek.com</Ref_URL>
    <Data1>123</Data1>
    <Data2>456</Data2>
    <Data3>789</Data3>
    <Data4>string</Data4>
    <Data5>string</Data5>
    <Data6>string</Data6>
    <Data7>string</Data7>
    <Data8>string</Data8>
    <Data9>string</Data9>
    <Data10>string</Data10>
    </Pos_Odeme>
    </soap:Body>
    </soap:Envelope>`

    let options = {
        url,
        method: 'POST',
        body: xml,
        headers: {
            'Content-Type': "text/xml",
        }
    };
    
    return new Promise((resolve, reject) => {

        request(options, (error, response, body) => {
            console.log('JSON response', response);

            if (!error && response.statusCode == 200) {
                var parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    console.log('JSON result', result);
                    try {
                        const resultFin = {
                            success: result['soap:Envelope']['soap:Body']['Pos_OdemeResponse']['Pos_OdemeResult']['Islem_ID'] == '0' ? false : true,
                            code: result['soap:Envelope']['soap:Body']['Pos_OdemeResponse']['Pos_OdemeResult']['Islem_ID'],
                            bank_code: result['soap:Envelope']['soap:Body']['Pos_OdemeResponse']['Pos_OdemeResult']['Banka_Sonuc_Kod'],
                            message: result['soap:Envelope']['soap:Body']['Pos_OdemeResponse']['Pos_OdemeResult']['Sonuc_Str'],
                            redirect: result['soap:Envelope']['soap:Body']['Pos_OdemeResponse']['Pos_OdemeResult']['UCD_URL'],
                        }
                        return resolve(resultFin)
                    } catch (err) {
                        console.log(err)
                        return reject(err)
                    }
                });
            }
            else {
                return reject(error)
            }
        })
    })
}

module.exports = {
    requestHash: createHashSecurityKey,
    requestPay: setPaid
}