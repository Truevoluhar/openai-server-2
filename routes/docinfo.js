const express = require('express');
const router = express.Router();
const fs = require('fs');
const docxConverter = require('docx-pdf');
const path = require('path');
const https = require('https');
const axios = require("axios");
const CloudConvert = require('cloudconvert');


router.get('/docxtopdf', async (req, res) => {
  docxConverter('./files/TS_unicevalec_papirja.docx', './files/ceglpdfc.pdf', function(err, result) {
    if (err) {
      console.log(err);
      res.send(err)
    }
    console.log('result' + result);
    res.send("success")
  });
});

const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYWRkZjcxZTgxMDc5MjliOGUyMzA0ZjcwOWJhYzU2NmYyODA3ZGIwMjdhZmIyYWViM2QxNDgyZmQwMjFiYmE3OTFmYTc0ODNmZTFjOWNiMDciLCJpYXQiOjE2ODMyNjg0MDEuOTAyNzQ2LCJuYmYiOjE2ODMyNjg0MDEuOTAyNzQ4LCJleHAiOjQ4Mzg5NDIwMDEuODk3OTQ1LCJzdWIiOiI2MzM2NzQzNSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.H0FwdSqMnvNjnkPyjTHdXyldAVXPVcEuD2WQ0h0ZfcLZW8ThdbWCN3DKXYwUYKEWGkbgw7FC2tydxtoeUEDc1JT42oNRKFubZmJuNSZACwE0sWfuNcIfwyVDCwDCzaSQWLvv76Si1MwsRSxwLM_auXOgOddWwF0N1IkubUqxXeKfDaTvFE-ZbvQjBlA_-uGGeuuoLeCk-zW7CdXKmZicgWr7Qu3A6d7UVPTXe_t2OWrGKYajcQS_Z_hiy96Qlxrlxlqt2h4uJXBuRnE0dFw4RqbMzxWU6J3uLHo0JPf-lDL6Nmc3DD8Yxylkc_j87pjOkgXhOs5AFWF8pVRz8aS9m5JDxZT4rAqB-zQoAeL1iN069K0y_3NWGIPbCQax1ngETy3UUSyszDifeREhMQTUJY7v0NbXqGUkG-Hdkf1HSEOXKHein_MhPHieBTfzJ_USCLf0_ZqQovcMlGntu2i7Euxak3LsmY-oYjQXTipcF0OOdty9pv-XTFqnASxDN2wGN6xRBsyBoKEKfsaHZs6p4WcHcsq-hYcAJ6Ln5noX_Fkmn3bZf4K9Jroo_dvbIuq-qDWBGzJPwiuj8IK2X7gPNjp-HqUFwu8ti4XqOUves2QwKhBEsmc4ucb6Q3lEn6gK72x8qIl5B-xlsFkoIRxSS365ZmJs8qKfShmAcKyDjoc');

router.post('/cloudconvertpdf', async (req, res) => {
  let filename = req.body.data;
  let splitter = filename.split(".");
  let justName = splitter[0];
  try {
    // Create a job with import/upload, convert and export/url tasks
    const job = await axios.post(
      'https://api.cloudconvert.com/v2/jobs',
      {
        tasks: {
          'import-my-file': {
            operation: 'import/upload',
          },
          'convert-my-file': {
            operation: 'convert',
            input: 'import-my-file',
            output_format: 'pdf',
          },
          'export-my-file': {
            operation: 'export/url',
            input: 'convert-my-file',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYWRkZjcxZTgxMDc5MjliOGUyMzA0ZjcwOWJhYzU2NmYyODA3ZGIwMjdhZmIyYWViM2QxNDgyZmQwMjFiYmE3OTFmYTc0ODNmZTFjOWNiMDciLCJpYXQiOjE2ODMyNjg0MDEuOTAyNzQ2LCJuYmYiOjE2ODMyNjg0MDEuOTAyNzQ4LCJleHAiOjQ4Mzg5NDIwMDEuODk3OTQ1LCJzdWIiOiI2MzM2NzQzNSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.H0FwdSqMnvNjnkPyjTHdXyldAVXPVcEuD2WQ0h0ZfcLZW8ThdbWCN3DKXYwUYKEWGkbgw7FC2tydxtoeUEDc1JT42oNRKFubZmJuNSZACwE0sWfuNcIfwyVDCwDCzaSQWLvv76Si1MwsRSxwLM_auXOgOddWwF0N1IkubUqxXeKfDaTvFE-ZbvQjBlA_-uGGeuuoLeCk-zW7CdXKmZicgWr7Qu3A6d7UVPTXe_t2OWrGKYajcQS_Z_hiy96Qlxrlxlqt2h4uJXBuRnE0dFw4RqbMzxWU6J3uLHo0JPf-lDL6Nmc3DD8Yxylkc_j87pjOkgXhOs5AFWF8pVRz8aS9m5JDxZT4rAqB-zQoAeL1iN069K0y_3NWGIPbCQax1ngETy3UUSyszDifeREhMQTUJY7v0NbXqGUkG-Hdkf1HSEOXKHein_MhPHieBTfzJ_USCLf0_ZqQovcMlGntu2i7Euxak3LsmY-oYjQXTipcF0OOdty9pv-XTFqnASxDN2wGN6xRBsyBoKEKfsaHZs6p4WcHcsq-hYcAJ6Ln5noX_Fkmn3bZf4K9Jroo_dvbIuq-qDWBGzJPwiuj8IK2X7gPNjp-HqUFwu8ti4XqOUves2QwKhBEsmc4ucb6Q3lEn6gK72x8qIl5B-xlsFkoIRxSS365ZmJs8qKfShmAcKyDjoc`,
        },
      }
    );
    let jobdata = job.data.data.tasks
    console.log(job.data.data.id);
    // Upload the input DOCX file
    const uploadTask = jobdata.filter(task => task.name === 'import-my-file')[0];
    const inputFile = fs.createReadStream(`./files/${filename}`);
    await cloudConvert.tasks.upload(uploadTask, inputFile, 'input.docx');

    // Wait for the job to complete
    const completedJob = await cloudConvert.jobs.wait(job.data.data.id);

    // Download the output PDF file
    const file = cloudConvert.jobs.getExportUrls(completedJob)[0];
    const writeStream = fs.createWriteStream(`./files/${justName}.pdf`);
    https.get(file.url, (response) => {
      response.pipe(writeStream);
    });

    // Handle writeStream events
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    res.status(200).json(`File converted and saved as ${justName}.pdf`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json('An error occurred while converting the file');
  }
})


router.post('/cloudconvertdocx', async (req, res) => {
  let filename = req.body.data;
  let splitter = filename.split(".");
  let justName = splitter[0];
  try {
    // Create a job with import/upload, convert and export/url tasks
    const job = await axios.post(
      'https://api.cloudconvert.com/v2/jobs',
      {
        tasks: {
          'import-my-file': {
            operation: 'import/upload',
          },
          'convert-my-file': {
            operation: 'convert',
            input: 'import-my-file',
            output_format: 'docx',
          },
          'export-my-file': {
            operation: 'export/url',
            input: 'convert-my-file',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYWRkZjcxZTgxMDc5MjliOGUyMzA0ZjcwOWJhYzU2NmYyODA3ZGIwMjdhZmIyYWViM2QxNDgyZmQwMjFiYmE3OTFmYTc0ODNmZTFjOWNiMDciLCJpYXQiOjE2ODMyNjg0MDEuOTAyNzQ2LCJuYmYiOjE2ODMyNjg0MDEuOTAyNzQ4LCJleHAiOjQ4Mzg5NDIwMDEuODk3OTQ1LCJzdWIiOiI2MzM2NzQzNSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.H0FwdSqMnvNjnkPyjTHdXyldAVXPVcEuD2WQ0h0ZfcLZW8ThdbWCN3DKXYwUYKEWGkbgw7FC2tydxtoeUEDc1JT42oNRKFubZmJuNSZACwE0sWfuNcIfwyVDCwDCzaSQWLvv76Si1MwsRSxwLM_auXOgOddWwF0N1IkubUqxXeKfDaTvFE-ZbvQjBlA_-uGGeuuoLeCk-zW7CdXKmZicgWr7Qu3A6d7UVPTXe_t2OWrGKYajcQS_Z_hiy96Qlxrlxlqt2h4uJXBuRnE0dFw4RqbMzxWU6J3uLHo0JPf-lDL6Nmc3DD8Yxylkc_j87pjOkgXhOs5AFWF8pVRz8aS9m5JDxZT4rAqB-zQoAeL1iN069K0y_3NWGIPbCQax1ngETy3UUSyszDifeREhMQTUJY7v0NbXqGUkG-Hdkf1HSEOXKHein_MhPHieBTfzJ_USCLf0_ZqQovcMlGntu2i7Euxak3LsmY-oYjQXTipcF0OOdty9pv-XTFqnASxDN2wGN6xRBsyBoKEKfsaHZs6p4WcHcsq-hYcAJ6Ln5noX_Fkmn3bZf4K9Jroo_dvbIuq-qDWBGzJPwiuj8IK2X7gPNjp-HqUFwu8ti4XqOUves2QwKhBEsmc4ucb6Q3lEn6gK72x8qIl5B-xlsFkoIRxSS365ZmJs8qKfShmAcKyDjoc`,
        },
      }
    );
    let jobdata = job.data.data.tasks
    console.log(job.data.data.id);
    // Upload the input PDF file
    const uploadTask = jobdata.filter(task => task.name === 'import-my-file')[0];
    const inputFile = fs.createReadStream(`./files/${filename}`);
    await cloudConvert.tasks.upload(uploadTask, inputFile, 'input.pdf');

    // Wait for the job to complete
    const completedJob = await cloudConvert.jobs.wait(job.data.data.id);

    // Download the output DOCX file
    const file = cloudConvert.jobs.getExportUrls(completedJob)[0];
    const writeStream = fs.createWriteStream(`./files/${justName}.docx`);
    https.get(file.url, (response) => {
      response.pipe(writeStream);
    });

    // Handle writeStream events
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    res.status(200).json(`File converted and saved as ${justName}.docx`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json('An error occurred while converting the file');
  }
})

router.post('/downloadfile', async (req, res) => {
  let filename = req.body.data;
  if (filename.split(".")[1] === "pdf") {
    const filePath = `./files/${filename.split(".")[0]}.docx` // Replace with the actual path to your file

    // Set the headers for the response
    res.setHeader('Content-Disposition', `attachment; filename=${filename.split(".")[0]}.docx`); // Replace with your desired file name and extension
    res.setHeader('Content-Type', 'application/octet-stream'); // Replace with the appropriate content type for your file

    // Send the file
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).send('An error occurred while downloading the file');
        console.error(err);
      }
    });
  }
  if (filename.split(".")[1] === "docx") {
    const filePath = `./files/${filename.split(".")[0]}.pdf` // Replace with the actual path to your file

    // Set the headers for the response
    res.setHeader('Content-Disposition', `attachment; filename=${filename.split(".")[0]}.pdf`); // Replace with your desired file name and extension
    res.setHeader('Content-Type', 'application/octet-stream'); // Replace with the appropriate content type for your file

    // Send the file
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).send('An error occurred while downloading the file');
        console.error(err);
      }
    });
  }
});

router.post("/downloadsame", async (req, res) => {
  let filename = req.body.data;
  const filePath = `./files/${filename}`;
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send('An error occurred while downloading the file');
      console.error(err);
    }
  });
})

router.post('/di', async (req, res) => {
  try {
    const inputFile = 'input.docx';
    const outputFile = 'output.pdf';
    await docxToPdf(inputFile, outputFile);
    res.sendFile(outputFile, { root: __dirname });
  } catch (err) {
    console.error('Error serving PDF file:', err);
    res.status(500).send('Error generating PDF file.');
  }
});




module.exports = router;
