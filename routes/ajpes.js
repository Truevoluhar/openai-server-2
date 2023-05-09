var express = require('express');
var router = express.Router();
const soap = require('soap');


const wsdlUrl = 'https://wwwt.ajpes.si/wsPrsInfo/PrsInfo.asmx?wsdl';

router.get("/", (req, res) => {
  res.send("ajpesroute");
})

router.get("/ajpesreq", async (req, res) => {
  const soapRequestData = {
    sNaziv: '',
    sMaticna: '1732803000',
    sDavcna: '',
    sNaslov: '',
    sHisnaStevilka: '',
    sNaselje: '',
    sObcina: '',
    sPosta: '',
    sDejavnost: '',
    sSektor: '',
    sOblika: '',
    iTip: 1,
    iMaxRec: 20,
    Ident: {
      string: ['wsPrsInfoTest', 'geslo', 'PRS_MN_E']
    }
  };

  soap.createClientAsync(wsdlUrl)
    .then((client) => {
      return client.PrsDataFindAsync(soapRequestData);
    })
    .then((result) => {
      console.log('SOAP odgovor:', result);
    })
    .catch((err) => {
      console.error('Napaka pri SOAP zahtevku:', err);
    });
})

module.exports = router;