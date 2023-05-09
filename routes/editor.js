const express = require('express');
const router = express.Router();
const fs = require('fs');
const htmlDocx = require('html-docx-js');
const { Document, Packer } = require('docx');
const mammoth = require('mammoth');
const docx = require("docx");



const htmlToDocx = async (inputHtml, outputFile) => {
  try {
    const result = await mammoth.convertToMarkdown({ buffer: Buffer.from(inputHtml) });

    const markdownText = result.value; // The markdown text
    const messages = result.messages; // Any messages, such as warnings during conversion

    // Handle messages or warnings, if necessary
    console.log('Messages:', messages);

    const doc = new Document();
    const paragraphs = markdownText
      .split('\n')
      .map((line) => doc.createParagraph(line));

    paragraphs.forEach((paragraph) => doc.addParagraph(paragraph));

    const packer = new Packer();
    const docxBinary = await packer.toBuffer(doc);

    fs.writeFileSync(outputFile, docxBinary);
    console.log('DOCX file created:', outputFile);
  } catch (error) {
    console.error('Error:', error);
  }
};








router.get("/", (req, res) => {
  res.json("ok");
})

router.post("/savecontent", async (req, res) => {
  let html = req.body.content;
  var docx = htmlDocx.asBlob(html);
  fs.writeFile('helloworld3.docx', html, function(err) {
    if (err) return console.log(err);
    console.log('done');
  });
})

router.post("/savecontent2", async (req, res) => {
  let input = req.body.content;
  let output = 'output.docx';
  htmlToDocx(input, output);
})

module.exports = router;