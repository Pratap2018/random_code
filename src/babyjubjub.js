import { HypersignSSISdk } from 'hs-ssi-sdk'
import { BabyJubJubKeys2021 } from '@hypersign-protocol/babyjubjub2021';
import { createWallet, hidNodeEp, mnemonic, writeFileSync, mnemonic1 } from "./utils.js";
import { Bip39 } from "@cosmjs/crypto";
import Utils from "./converter.js";
import jsonld from 'jsonld'
const offlineSigner = await createWallet(mnemonic);

const params = {
  offlineSigner,
  nodeRestEndpoint: hidNodeEp.rest,
  nodeRpcEndpoint: hidNodeEp.rpc,
  namespace: hidNodeEp.namespace,
};
const hsSdk = new HypersignSSISdk(params);
await hsSdk.init();
const kp = await hsSdk.did.bjjDID.generateKeys({
  mnemonic: 'mango emotion cause child pepper energy busy move cool man mosquito shoot stick antenna simple town field juice urge abstract purchase leave memory fluid'
});
console.log(kp);

const holder_kp = await hsSdk.did.bjjDID.generateKeys({
  mnemonic: "hard train drill gorilla length wasp supply chest divert coyote judge erase catalog donkey address boil gadget alter custom orchard popular slush pill police"
})

const did = await hsSdk.did.bjjDID.generate({
  publicKeyMultibase: kp.publicKeyMultibase
})

const holderDid = await hsSdk.did.bjjDID.generate({
  publicKeyMultibase: holder_kp.publicKeyMultibase
})

// console.log(JSON.stringify(did, null, 2));


// const didRegister = await hsSdk.did.bjjDID.register({
//   didDocument: did,
//   privateKeyMultibase: kp.privateKeyMultibase,
//   verificationMethodId: did.id+"#key-1"
// })

// console.log(didRegister);
// const HolderdidRegister = await hsSdk.did.bjjDID.register({
//   didDocument: holderDid,
//   privateKeyMultibase: holder_kp.privateKeyMultibase,
//   verificationMethodId: holderDid.id+"#key-1"
// })

// console.log(HolderdidRegister);


// console.log(did);
// // const updated=await hsSdk.did.bjjDID.update({
// //   didDocument: did,
// //   privateKeyMultibase: kp.privateKeyMultibase,
// //   verificationMethodId: did.id+"#key-1",
// //   versionId:'36496B179985B8A50E8F496021CAB12D1B576A2C6845EE6DA71349AE1385C09E'
// // })

// const deactivateed=await hsSdk.did.bjjDID.deactivate({
//   didDocument: did,
//   privateKeyMultibase: kp.privateKeyMultibase,
//   verificationMethodId: did.id+"#key-1",
//   versionId:'86F3691AB580C4926D31591B03815050B9E4B44713629FD20C76949251310A77'
// })
// console.log(deactivateed);





const vc = await hsSdk.vc.bjjVC.generate({
  schemaId: "sch:hid:testnet:z6MkipbPd8k6N8BSraPwdBafpM8W5HzNS6jy3F7SwWjDk5Cs:1.0",
  subjectDid: holderDid.id,
  issuerDid: did.id,
  expirationDate: '2027-11-24T07:58:12Z',
  fields: {
    '@explicit':true,
    name: 'Pratap Mridha'
  }
})

console.log(vc);
const signCredentials = await hsSdk.vc.bjjVC.issue({
  registerCredential: false,
  credential: vc,
  verificationMethodId: did.assertionMethod[0],
  privateKeyMultibase: kp.privateKeyMultibase, issuerDid: did.id
})

vc.id = 'vc:hid:testnet:z6Mkg2hfsCooPbB28KoKa59DGQh5ggeXghMZ9PXzMLoVdgVX'

console.log(JSON.stringify(signCredentials.signedCredential,null,2));

const revelDocument={
  "type": [ "VerifiableCredential", "TestSchema" ],
  "expirationDate":{},
  "issuanceDate": {},
  "issuer": {},
  "credentialSubject": {
    "@explicit":true,
    "id": {},
  },



}
// "type":["VerifiableCredential","TestSchema"],"expirationDate":{},"issuanceDate":{},"issuer":{},"credentialSubject":{"@explicit":true,"id":{}}
// console.log(await jsonld.frame(signCredentials.signedCredential,revelDocument));

// console.log(JSON.stringify(revelDocument));
const vp = await hsSdk.vp.bjjVp.generateSD({
  verifiableCredential: signCredentials.signedCredential,
  suite:await BabyJubJubKeys2021.fromKeys({
    publicKeyMultibase:kp.publicKeyMultibase
  }),
  frame:revelDocument
})
console.log(vp);

// console.log(JSON.stringify(vp, null, 2));
const signedVp = await hsSdk.vp.bjjVp.sign({
  presentation: vp, holderDid: holderDid.id, verificationMethodId: holderDid.authentication[0],
  privateKeyMultibase: holder_kp.privateKeyMultibase,
  challenge: 'abc',
  domain:'www.xyz.com',

})

console.log(signedVp);
// 

const verified=await hsSdk.vp.bjjVp.verify({
  signedPresentation:signedVp,challenge:'abc',
  domain:'www.xyz.com',
  issuerDid:did.id,
  holderDid:holderDid.id,
  issuerVerificationMethodId:did.assertionMethod[0],
  holderVerificationMethodId:holderDid.authentication[0]
})
console.log(verified);
// const resolvedStatus= await hsSdk.vc.bjjVC.resolveCredentialStatus({
//   credentialId:'vc:hid:testnet:z6MkemchiJCEkvkprhuki4ikYG41ZJF9vnsMSgKBkLDHKa1z'
// })
// console.log(resolvedStatus);

// vc.id='vc:hid:testnet:z6MkemchiJCEkvkprhuki4ikYG41ZJF9vnsMSgKBkLDHKa1z'
// const verifiyCredentialstatus= await hsSdk.vc.bjjVC.checkCredentialStatus({
//   credentialId:vc.id


// })
// console.log(verifiyCredentialstatus);
// const verifiyCredentials = await hsSdk.vc.bjjVC.verify({
//   credential:vc,
//   issuerDid:did.id,
//   verificationMethodId: did.assertionMethod[0],
// })
// console.log(verifiyCredentials);



// const revoke=await hsSdk.vc.bjjVC.updateCredentialStatus({
//   credentialStatus:resolvedStatus,
//   issuerDid:did.id,
//   verificationMethodId: did.assertionMethod[0],
//   privateKeyMultibase: kp.privateKeyMultibase,
//   status:'Revoked',
//   statusReason:'Asise hi, bas revoke kana tha :-)'
// })

// console.log(revoke);





// const schema = await hsSdk.schema.hypersignBjjschema.generate({
//   name: 'EmailCredentials',
//   description: "Email credentials for the application",
//   author: did.id,
//   additionalProperties: false,
//   fields: [{
//     name: 'email',
//     type: 'string',
//     isRequired: true,
//   },
//   {
//     name: 'name',
//     type: 'string',
//     isRequired: true,
//   }]
// })



// console.log(schema);


// const signdSchema = await hsSdk.schema.hypersignBjjschema.sign({
//   schema,
//   privateKeyMultibase: kp.privateKeyMultibase,
//   verificationMethodId: did.assertionMethod[0]
// })

// console.log(signdSchema);
// const register = await hsSdk.schema.hypersignBjjschema.register({
//   schema: signdSchema
// })

// console.log(register);


// console.log(hsSdk.schema.vcJsonSchema(await hsSdk.schema.resolve({ schemaId: schema.id })));


