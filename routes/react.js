var express = require('express');
var router = express.Router();
const multer = require("multer");
const mammoth = require("mammoth");
const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");
const pdfParse = require('pdf-parse');

const mySecret = process.env['OAI_KEY']

const configuration = new Configuration({
  apiKey: mySecret,
});
const openai = new OpenAIApi(configuration);




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './files');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });


const convertWordFileToString = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("Error converting Word file to string:", error);
  }
};

const convertWordFileToTxt = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;
    const fileName = filePath.split('/').pop().slice(0, -5)
    const txtFilePath = `./txtfiles/${fileName}.txt`
    fs.writeFileSync(txtFilePath, text);
    return txtFilePath;
  } catch (error) {
    console.error("Error converting Word file to txt:", error);
  }
};

const convertPdfFileToTxt = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await pdfParse(buffer);
    const text = result.text;
    const fileName = filePath.split('/').pop().slice(0, -4)
    const txtFilePath = `./txtfiles/${fileName}.txt`
    fs.writeFileSync(txtFilePath, text);
    return txtFilePath;
  } catch (error) {
    console.error("Error converting PDF file to txt:", error);
  }
};

function cleanUpString(str) {
  const cleanedNewlines = str.replace(/\n{2,}/g, '\n');
  const cleanedTabs = cleanedNewlines.replace(/\t/g, '');
  return cleanedTabs.startsWith('\n') ? cleanedTabs.slice(1) : cleanedTabs;
}


router.get('/', async function(req, res, next) {
  res.render('react');
});

router.get('/test', async (req, res) => {
  console.log("request sprejet");
  res.json("poslano iz backenda");
});

router.post('/test', async (req, res) => {
  let data = req.body.tester;
  console.log(data);
  let prompt = "";
  data.forEach((item) => {
    prompt += item.message + "; ";
  })
  let obj = {
    message: prompt
  }
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
    temperature: 0.4
  });
  let responseObject = {
    role: "assistant",
    message: completion.data.choices[0].message.content
  }
  let response = completion.data.choices[0].message.content;
  console.log(responseObject);
  data.push(responseObject);
  res.json(data);
})

router.post('/inputcomponent', async (req, res) => {
  let data = req.body.x
  console.log(data);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: data,
    max_tokens: 2048,
    temperature: 0.4
  })

  let responseObject = {
    role: "assistant,",
    content: completion.data.choices[0].message.content
  }
  data.push(responseObject);
  res.json(data);
})

router.post('/uploadfile', upload.single('file'), async (req, res) => {
  console.log(req.file);
  let string = "";
  // Naloži datoteko
  try {
    if (!req.file) {
      res.json("no file uploaded");
    } else {
      let file = req.file.formData
      file.mv("./files" + file.name);
    }
  } catch (err) {
    console.log(err);
  }

  //Pretvori word file v string
  let filePath = `${req.file.destination}/${req.file.originalname}`;
  if (req.file.originalname.split(".")[1] === "docx") {
    convertWordFileToString(filePath)
      .then((text) => {
        console.log("Word file content as string:", text);
        string = text;
        const cleanedString = cleanUpString(string);
        res.json("upload successful");
      })
      .catch((error) => {
        console.error("Error:", error);
        res.json("upload failed")
      });
    convertWordFileToTxt(filePath)
      .then((txtFilePath) => console.log(`Plain text saved to ${txtFilePath}`))
      .catch((error) => console.error(error));
  }
  if (req.file.originalname.split(".")[1] === "pdf") {
    convertPdfFileToTxt(filePath)
      .then((txtFilePath) => {
        console.log(`Plain text saved to ${txtFilePath}`)
        res.json("upload successful")
      })
      .catch((error) => {
        console.error(error)
        res.json("error: " + error);
      });
  }
})





router.post('/uploadfile2', upload.single('file'), async (req, res) => {
  try {
    const result = await mammoth.extractRawText({ path: inputFilePath });
    const text = result.value;

    fs.writeFile(outputFilePath, text, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('File successfully converted and saved:', outputFilePath);
      }
    });
  } catch (err) {
    console.error('Error converting .docx file:', err);
  }
})



router.post("/docanalysis", async (req, res) => {
  let data = req.body.tempState;
  console.log(data);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: data,
    max_tokens: 2048,
    temperature: 0.4
  });
  let responseObject = {
    role: "assistant",
    content: completion.data.choices[0].message.content
  }
  let response = completion.data.choices[0].message.content;
  console.log(responseObject);
  data.push(responseObject);
  console.log(data);
  res.json(data);
})

router.post("/abstract", async (req, res) => {
  let data = req.body.data;
})


router.post('/testchat', async (req, res) => {
  let data = req.body.newObject;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: data,
    max_tokens: 2048,
    temperature: 0.4
  });
  let responseObject = {
    role: "assistant",
    message: completion.data.choices[0].message.content
  }
  let response = completion.data.choices[0].message.content;
  console.log(responseObject);
  data.push(responseObject);
  res.json(data);
})

router.get("/image", async (req, res) => {
  const response = await openai.createImage({
    prompt: "Two business guys doing a handshake",
    n: 2,
    size: "1024x1024",
    response_format: "url"
  });
  console.log(response.data.data);
})

router.get("/listfiles", async (req, res) => {
  const response = await openai.listFiles();
  console.log(response);
})

router.get("/uploadfile", async (req, res) => {
  const response = await openai.createFile(
    fs.createReadStream("./jsonl-files/testfile.jsonl"),
    "fine-tune"
  );
})

module.exports = router;