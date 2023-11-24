import * as constants from "./constants.js";
import { encode, decode } from "base58-universal";
import pkg from "@digitalbazaar/ed25519-verification-key-2020";
const { Ed25519VerificationKey2020 } = pkg;
export default class Utils {
  static async getUUID() {
    const edKeyPair = await Ed25519VerificationKey2020.generate();
    const exportedKp = await edKeyPair.export({ publicKey: true });
    const { publicKeyMultibase: publicKeyMultibase1 } =
      this.convertEd25519verificationkey2020toStableLibKeysInto({
        publicKey: exportedKp.publicKeyMultibase,
      });
    return publicKeyMultibase1;
  }

  static checkUrl(url) {
    // TODO: check if the url is a valid url
    if (url.charAt(url.length - 1) === "/") {
      return url;
    } else {
      return (url = url + "/");
    }
  }

  static _encodeMbKey(header, key) {
    const mbKey = new Uint8Array(header.length + key.length);
    mbKey.set(header);
    mbKey.set(key, header.length);
    return "z" + encode(mbKey);
  }

  static _decodeMbKey(header, key) {
    let mbKey = new Uint8Array(key); //header + orginaley
    mbKey = mbKey.slice(header.length);
    return mbKey; //Buffer.from(mbKey).toString('base64');
  }

  static _decodeMbPubKey(header, key) {
    let mbKey = new Uint8Array(key); //header + orginaley
    mbKey = mbKey.slice(header.length);
    return "z" + encode(mbKey); //Buffer.from(mbKey).toString('base64');
  }

  static _bufToMultibase(pubKeyBuf) {
    return "z" + encode(pubKeyBuf);
  }

  // Converting 45byte public key to 48 by padding header
  // Converting 88byte private key to 91 by padding header
  static convertedStableLibKeysIntoEd25519verificationkey2020(stableLibKp) {
    const result = {};
    if (stableLibKp.publicKey) {
      const stableLibPubKeyWithoutZ = stableLibKp.publicKey.substr(1);
      const stableLibPubKeyWithoutZDecode = decode(stableLibPubKeyWithoutZ);
      result["publicKeyMultibase"] = Utils._encodeMbKey(
        constants.KEY_HEADERS.MULTICODEC_ED25519_PUB_HEADER,
        stableLibPubKeyWithoutZDecode
      );
    }

    if (stableLibKp.privKey) {
      result["privateKeyMultibase"] = Utils._encodeMbKey(
        constants.KEY_HEADERS.MULTICODEC_ED25519_PRIV_HEADER,
        stableLibKp.privKey
      );
    }

    return result;
  }
}
