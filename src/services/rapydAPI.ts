import { sign } from "react-native-redash";
import crypto from "crypto-js";
const calcSignature = (
    httpMethod: string,
    url: string,
    body: any,
): Array<string> => {

    const accessKey = 'DB2193A572F3AF80F624';
    const secretKey = '5cd81d5cdf6413b592f51a527a8d1e497dac59b2c749b2592f37f445f03966a3367d3a31ab996bd7'
    const salt = crypto.lib.WordArray.random(12).toString();

    var timestamp: string = (
        Math.floor(new Date().getTime() / 1000) - 10
    ).toString();
    var toSign: string =
        httpMethod + url + salt + timestamp + accessKey + secretKey + body;
    var signature = crypto.enc.Hex.stringify(crypto.HmacSHA256(toSign, secretKey))

    return [accessKey, timestamp, salt, crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(signature))]
}

export const createWallet = (salt, signature, timestamp, accessKey, body): Promise<any> => {
    return new Promise((resolve, reject) => {
        // console.log(salt);
        // console.log(signature);
        // console.log(timestamp);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("access_key", accessKey);
        myHeaders.append("salt", salt);
        myHeaders.append("timestamp", timestamp);
        myHeaders.append("signature", signature);



        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: body
        };

        return fetch("https://sandboxapi.rapyd.net/v1/user", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                resolve(result)
            })
            .catch(error => reject(error));
    })
}

export const getBalanceWallet = (idWallet): Promise<any> => {
    return new Promise((resolve, reject) => {


        const [accessKey, timestamp, salt, signature] = calcSignature('get', `/v1/user/${idWallet}/accounts`, '')


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("access_key", accessKey);
        myHeaders.append("salt", salt);
        myHeaders.append("timestamp", timestamp);
        myHeaders.append("signature", signature);



        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        return fetch(`https://sandboxapi.rapyd.net/v1/user/${idWallet}/accounts`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                resolve(result)
            })
            .catch(error => reject(error));
    })
}

export const createIdentityPage = (idWallet, idContact, idReference): Promise<any> => {
    return new Promise((resolve, reject) => {

        let body = JSON.stringify({
            "reference_id": idReference,
            "ewallet": idWallet,
            "contact": idContact
        })

        const [accessKey, timestamp, salt, signature] = calcSignature('post', `/v1/hosted/idv`, body)


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("access_key", accessKey);
        myHeaders.append("salt", salt);
        myHeaders.append("timestamp", timestamp);
        myHeaders.append("signature", signature);



        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: body
        };

        return fetch(`https://sandboxapi.rapyd.net/v1/hosted/idv`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                resolve(result)
            })
            .catch(error => reject(error));
    })
}

export const transferToWallet = (amount,currency, sourceWallet, destWallet,pocketId): Promise<any> => {
    return new Promise((resolve, reject) => {

        let body = JSON.stringify({
            "amount": amount,
            "currency": currency,
            "source_ewallet": sourceWallet,
            "destination_ewallet": destWallet,
            "metadata": {
                "merchant_defined": true,
              "pocketId": pocketId
            }
          });

        const [accessKey, timestamp, salt, signature] = calcSignature('post', `/v1/account/transfer`, body)


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("access_key", accessKey);
        myHeaders.append("salt", salt);
        myHeaders.append("timestamp", timestamp);
        myHeaders.append("signature", signature);



        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: body
        };

        return fetch(`https://sandboxapi.rapyd.net/v1/account/transfer`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                resolve(result)
            })
            .catch(error => reject(error));
    })
}