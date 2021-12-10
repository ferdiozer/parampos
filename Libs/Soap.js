

var request = require('request');
var xml2js = require('xml2js');


/*
let xml =
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:qtre="http://Main.Service">
   <soapenv:Header/>
   <soapenv:Body>
      <qtre:GetUsers>
         <qtre:sSearchText></qtre:sSearchText>
      </qtre:GetUsers>
   </soapenv:Body>
</soapenv:Envelope>`

var options = {
    url: 'http://test-dmz.ew.com.tr:8080/turkpos.ws/service_turkpos_test.asmx',
    method: 'POST',
    body: xml,
    headers: {
        'Content-Type': 'text/xml;charset=utf-8',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': "http://test-dmz.ew.com.tr:8080/turkpos.ws/service_turkpos_test.asmx"
    }
};

let callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
        console.log('Raw result', body);
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({ explicitArray: false, trim: true });
        parser.parseString(body, (err, result) => {
            console.log('JSON result', result);
        });
    };
    console.log('E', response.statusCode, response.statusMessage);
};
request(options, callback);
*/

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


    // let {
    //     CLIENT_CODE,
    //     CLIENT_USERNAME,
    //     CLIENT_PASSWORD,
    //     GUID,
    //     cardName,
    //     cardNumber,
    //     cardExpmonth,
    //     cardExpyear,
    //     cardCvv,
    //     cardHolderPhone,
    //     failUrl,
    //     successUrl,
    //     orderId,
    //     installment,
    //     description,
    //     total,
    //     createdHash,
    //     securityType,
    //     ipAddress,
    // } = args
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
    <KK_SK_Ay>${cardExpmonth}'</KK_SK_Ay>
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
    <Islem_ID></Islem_ID>
    <IPAdr>${ipAddress}</IPAdr>
    <Ref_URL></Ref_URL>
    <Data1></Data1>
    <Data2></Data2>
    <Data3></Data3>
    <Data4></Data4>
    <Data5></Data5>
    <Data6></Data6>
    <Data7></Data7>
    <Data8></Data8>
    <Data9></Data9>
    <Data10></Data10>
    </Pos_Odeme>
    </soap:Body>
    </soap:Envelope>`
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
            // console.log('JSON response', response);
            if (!error && response.statusCode == 200) {
                var parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    //console.log('JSON result', result);
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