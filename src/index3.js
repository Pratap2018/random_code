const schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "description": "",
    "properties": {
      "credentialSubject": {
        "description": "Stores the data of the credential",
        "title": "Credential subject",
        "properties": {
          "id": {
            "description": "Stores the DID of the subject that owns the credential",
            "title": "Credential subject ID",
            "format": "uri",
            "type": "string"
          },
          "fullName": {
            "description": "Enter value for fullName",
            "title": "fullName",
            "type": "string"
          },
          "companyName": {
            "description": "Enter value for companyName",
            "title": "companyName",
            "type": "string"
          },
          "center": {
            "description": "Enter value for center",
            "title": "center",
            "type": "string"
          },
          "invoiceNumber": {
            "description": "Enter value for invoiceNumber",
            "title": "invoiceNumber",
            "type": "string"
          }
        },
        "required": ["fullName", "center", "invoiceNumber"],
        "type": "object"
      }
    },
    "type": "object",
    "required": ["credentialSubject"],
    "$metadata": {
      "type": "DayPassCredential",
      "version": 1,
      "jsonLdContext": {
        "@context": {
          "@protected": true,
          "@version": 1.1,
          "id": "@id",
          "type": "@type",
          "DayPassCredential": {
            "@context": {
              "@propagate": true,
              "@protected": true,
              "xsd": "http://www.w3.org/2001/XMLSchema#",
              "fullName": {
                "@id": "https://hypersign-schema.org/fullName",
                "@type": "xsd:string"
              },
              "companyName": {
                "@id": "https://hypersign-schema.org/companyName",
                "@type": "xsd:string"
              },
              "center": {
                "@id": "https://hypersign-schema.org/center",
                "@type": "xsd:string"
              },
              "invoiceNumber": {
                "@id": "https://hypersign-schema.org/invoiceNumber",
                "@type": "xsd:string"
              }
            },
            "@id": "https://hypersign-schema.org"
          }
        }
      }
    }
}
  

import * as v from "@cfworker/json-schema"

const validator = new v.Validator(schema, '2020-12')

console.log(validator.validate({
  credentialSubject:{
    fullName:"pratap",
    companyName:"hypersign",
    center:"hyderabad",
    invoiceNumber:"123456789",
  }
}));