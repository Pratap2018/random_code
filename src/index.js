
import {HypersignSSISdk} from 'hs-ssi-sdk'
import { createWallet, hidNodeEp, mnemonic, writeFileSync } from "./utils.js";
import { Bip39 } from "@cosmjs/crypto";
import Utils from "./converter.js";
const offlineSigner = await createWallet(mnemonic);

const issuerKey = {
  privateKeyMultibase:
    "zrv3MeAyjUGfyNDmHsDtSqDoRX3AzfxYd4E7TKKtqwjUx5DLGWka1yF3atjNeTQRTy2PBDRgrdPfzYc9kJR7hoDTT9q",
  publicKeyMultibase: "z6MkoNeBKoHzXv1MJzgWBghaiCP49G2KkaJ5boJGct6ntNPZ",
};

const newKey = Utils.convertedStableLibKeysIntoEd25519verificationkey2020({
  publicKey: issuerKey.publicKeyMultibase,
  privKey: issuerKey.privateKeyMultibase,
});
console.log(newKey);
const issuerDIDDoc = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1",
  ],
  id: "did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB",
  controller: ["did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB"],
  alsoKnownAs: [
    "did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB",
  ],
  verificationMethod: [
    {
      id: "did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB#key-1",
      type: "Ed25519VerificationKey2020",
      controller:
        "did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB",
      publicKeyMultibase: "z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB",
    },
  ],
  authentication: [
    "did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB#key-1",
  ],
  assertionMethod: [
    "did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB#key-1",
  ],
  keyAgreement: [
    "did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB#key-1",
  ],
  capabilityInvocation: [
    "did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB#key-1",
  ],
  capabilityDelegation: [
    "did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB#key-1",
  ],
  service: [
    {
      id: "did:hid:testnet:z9vP8jZ3ZCNWtCVqoW7jjs6q4KgkULh3iunPLnc8my9cB#vcs",
      type: "LinkedDomains",
      serviceEndpoint: "https://example.com/vc",
    },
  ],
};

const params = {
  offlineSigner,
  nodeRestEndpoint: hidNodeEp.rest,
  nodeRpcEndpoint: hidNodeEp.rpc,
  namespace: hidNodeEp.namespace,
};
const hsSdk = new HypersignSSISdk(params);
await hsSdk.init();
const kp = await hsSdk.did.generateKeys({
  seed: Bip39.decode(mnemonic),
});
console.log(kp);
const did = await hsSdk.did.generate({
  publicKeyMultibase: kp.publicKeyMultibase,
});
const signedDidDoc = await hsSdk.did.sign({
  privateKeyMultibase: kp.privateKeyMultibase,
  challenge: "abc",
  domain: "www.test.org",
  didDocument: did,
  did: "",
  verificationMethodId: did.verificationMethod[0].id,
});
console.log(signedDidDoc);

writeFileSync("did.json", JSON.stringify(did, null, 2));
const resolvedSchema = await hsSdk.schema.resolve({
  schemaId: "sch:hid:testnet:zHJTSuEmcGn5oCe7K58BrGbxULe7DnRzkBF7yVHZEveEJ:1.0",
});
const jsonSchema = hsSdk.schema.vcJsonSchema(resolvedSchema);
writeFileSync("schema.json",JSON.stringify(jsonSchema,null,2))
console.log(JSON.stringify(jsonSchema, null, 2));
const unsignedCredentials = await hsSdk.vc.generate({
  schemaId: "sch:hid:testnet:zHJTSuEmcGn5oCe7K58BrGbxULe7DnRzkBF7yVHZEveEJ:1.0",
  subjectDidDocSigned: signedDidDoc,
  issuerDid: issuerDIDDoc.id,
  expirationDate: new Date("12/11/2027"),
  fields: {
    fullName: "Pratap",
    center: "Pratap",
    invoiceNumber: '123',
    companyName: "Hypermine",
  },
});

console.log(JSON.stringify(unsignedCredentials, null, 2));
const signedCredential = await hsSdk.vc.issue({
  credential: unsignedCredentials,
  issuerDid: issuerDIDDoc.id,
  verificationMethodId: issuerDIDDoc.verificationMethod[0].id,
  privateKeyMultibase: issuerKey.privateKeyMultibase,
  registerCredential: false,
});

console.log(signedCredential);

const veify = await hsSdk.vc.verify({
  credential: signedCredential.signedCredential,
  issuerDid: issuerDIDDoc.id,
  verificationMethodId: issuerDIDDoc.verificationMethod[0].id,
});
console.log(veify);
