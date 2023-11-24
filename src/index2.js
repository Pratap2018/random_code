import { HypersignSSISdk } from "hs-ssi-sdk";
import { createWallet, hidNodeEp, mnemonic, writeFileSync } from "./utils.js";
import { Bip39 } from "@cosmjs/crypto";
import Utils from "./converter.js";
const offlineSigner = await createWallet(mnemonic);
import { EthereumEip712Signature2021 } from "ethereumeip712signature2021suite";

const mnemonicMM =
  "under couch ghost gravity kiss silver wise gasp option dice benefit search";
const ethereumeip712signature2021suite = new EthereumEip712Signature2021({});
const kp = await ethereumeip712signature2021suite.generateKeyPair(mnemonicMM);
console.log(kp);
const params = {
  offlineSigner,
  nodeRestEndpoint: hidNodeEp.rest,
  nodeRpcEndpoint: hidNodeEp.rpc,
  namespace: hidNodeEp.namespace,
};

const hsSdk = new HypersignSSISdk(params);
await hsSdk.init();

const address = "0xD09fd66292d409e6B3060186AD014d3795df9Bd3";

const did = await hsSdk.did.createByClientSpec({
  methodSpecificId: address,
  clientSpec: "eth-personalSign",
  chainId: "0x1",
  address,
});

const unsignedCredentials = await hsSdk.vc.generate({
  schemaId: "sch:hid:testnet:zHJTSuEmcGn5oCe7K58BrGbxULe7DnRzkBF7yVHZEveEJ:1.0",
  subjectDid: "did:hid:testnet:0xD09fd66292d409e6B3060186AD014d3795df9Bd3",
  issuerDid: "did:hid:testnet:0xD09fd66292d409e6B3060186AD014d3795df9Bd3",
  fields: {
    fullName: "Pratap",
    center: "Pratap",
    invoiceNumber: 123,
    companyName: "Pratap",
  },
});
unsignedCredentials["@context"] = ["https://www.w3.org/2018/credentials/v1","https://schema.org"];
console.log(unsignedCredentials);

const signedCredential = await hsSdk.vc.issueByClientSpec({
  credential: unsignedCredentials,
  issuerDid: "did:hid:testnet:0xD09fd66292d409e6B3060186AD014d3795df9Bd3",
  verificationMethodId:
    "did:hid:testnet:0xD09fd66292d409e6B3060186AD014d3795df9Bd3#key-1",
  registerCredential: false,
  privateKey: kp.privateKey,
});

console.log(signedCredential.signedCredential);


const verify = await hsSdk.vc.verifyByClientSpec({
  credential: signedCredential.signedCredential,
  verificationMethodId:
    "did:hid:testnet:0xD09fd66292d409e6B3060186AD014d3795df9Bd3#key-1",
  issuerDid: "did:hid:testnet:0xD09fd66292d409e6B3060186AD014d3795df9Bd3",
});

console.log(verify);