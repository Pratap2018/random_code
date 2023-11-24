import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import fs from 'fs'
import  pkg from "@cosmjs/crypto";
const { HdPath, Slip10RawIndex }=pkg
const hidNodeEp = {
  rpc: "http://127.0.0.1:26657",
  rest: "http://127.0.0.1:1317",
  namespace: "testnet",
};
function makeCosmoshubPath(a) {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(118),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(a),
  ];
}
const phrase =
  "flat vessel crawl guess female tray breeze bachelor rare fragile pottery observe";

const mnemonic1 = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
const mnemonic="verify sustain lumber boat demise parade special soft bargain scout spoil there addict move badge rebuild horn achieve hollow acquire glide bundle curious present"
const createWallet = async (mnemonic) => {
  let options;
  if (!mnemonic) {
    return await DirectSecp256k1HdWallet.generate(
      24,
      (options = {
        prefix: "hid",
        hdPaths: [makeCosmoshubPath(0)],
      })
    );
  } else {
    return await DirectSecp256k1HdWallet.fromMnemonic(
      mnemonic,
      (options = {
        prefix: "hid",
        hdPaths: [makeCosmoshubPath(0)],
      })
    );
  }
};



function writeFileSync(name,data){
    fs.writeFileSync(name,data)
}

export { createWallet, mnemonic, hidNodeEp ,writeFileSync,mnemonic1};
