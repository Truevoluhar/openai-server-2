var express = require('express');
var router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env['OAI_KEY'],
});
const openai = new OpenAIApi(configuration);

let conversation = [];
let setup = "Si zdravnik splošne medicine. K tebi je prišel pacient, ki ti bo predstavil svojo zdravstveno težavo. Pozdravi ga in ga povprašaj, kako mu lahko pomagaš. Nikoli med pogovorom ga ne pošiljaj k zdravniku, saj si ti zdravnik. Nikoli ne posreduj izmišljenih podatkov. Postavljaj podvprašanja, da izveš čimveč o njegovem zdravstvenem stanju. ";
let introString = "Zdravnik: Dober dan! Kako lahko vam pomagam? Kaj je vaša zdravstvena težava? Ali lahko poveste več o svojih simptomih in kako dolgo trajajo? Ali ste že prej obiskali zdravnika? Ali ste jemali kakšne zdravila?";
let prompt;
prompt += setup;
prompt += introString;

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index');
});

router.post('/dohtar', (req, res) => {
  res.redirect('/dohtar');
})

router.get('/dohtar', async (req, res) => {
  if (conversation.length === 0) {
    let firstObject = {
      isUser: false,
      message: introString
    }
    conversation.push(firstObject);
    res.render('dohtar', { conversation: conversation });
  } else {
    res.render('dohtar', { conversation: conversation });
  }
});

router.post('/submit', async (req, res) => {
  let message = req.body.input;
  let messageObject = {
    isUser: true,
    message: message
  }
  conversation.push(messageObject);
  prompt = "";
  prompt += setup;
  prompt += introString;
  conversation.forEach((convo) => {
    if (!convo.isUser) {
      prompt += `Zdravnik: ${convo.message};`;
    } else {
      prompt += `Pacient: ${convo.message};`;
    }
  });
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 2048,
    temperature: 0.2
  });
  let responseObject = {
    isUser: false,
    message: completion.data.choices[0].text
  }
  conversation.push(responseObject);
  res.render('dohtar', { conversation: conversation });
});



module.exports = router;
