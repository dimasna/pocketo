import crypto from "crypto-js";
import { sign } from "react-native-redash";
export const calcSignature = (
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
 
 return [accessKey,timestamp,salt,crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(signature))]
  }