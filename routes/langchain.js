var express = require('express');
var router = express.Router();
const mammoth = require("mammoth");
const fs = require("fs");
const { OpenAI } = require("langchain/llms/openai");

const mySecret = process.env['OAI_KEY']
const testVariable = "testVariable"




const convertWordFileToString = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("Error converting Word file to string:", error);
  }
};

function cleanUpString(str) {
  const cleanedNewlines = str.replace(/\n{2,}/g, '\n');
  const cleanedTabs = cleanedNewlines.replace(/\t/g, '');
  return cleanedTabs.startsWith('\n') ? cleanedTabs.slice(1) : cleanedTabs;
}

async function convertDocxToText(inputFilePath, outputFilePath) {
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
}





const { loadSummarizationChain } = require("langchain/chains");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { loadQARefineChain } = require("langchain/chains");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { loadQAStuffChain, loadQAMapReduceChain, RetrievalQAChain, AnalyzeDocumentChain } = require("langchain/chains");
const { Document } = require("langchain/document");
const { HNSWLib } = require("langchain/vectorstores/hnswlib");



router.get("/", async (req, res) => {
  const text = fs.readFileSync("./txtfiles/langtestfile.txt", "utf8");
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);

  // This convenience function creates a document chain prompted to summarize a set of documents.
  const chain = loadSummarizationChain(model);
  const rest = await chain.call({
    input_documents: docs,
  });
  console.log({ rest });
})






router.get("/mem", async (req, res) => {
  const text = fs.readFileSync("./txtfiles/langtestfile.txt", "utf8");
  const model = new OpenAI({ openAIApiKey: mySecret, temperature: 0.5 });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);

  // This convenience function creates a document chain prompted to summarize a set of documents.
  const chain = loadSummarizationChain(model);
  const x = await chain.call({
    input_documents: docs,
  });
  console.log({ x });
})





router.get("/smem", async (req, res) => {
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: mySecret });
  const model = new OpenAI({ openAIApiKey: mySecret, temperature: 0.9 });
  const chain = loadQARefineChain(model);

  // Load the documents and create the vector store
  const loader = new TextLoader("./txtfiles/zakontest.txt");
  const docs = await loader.loadAndSplit();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  console.log(docs.length);
  console.log(store.length);
  // Select the relevant documents
  const question = "Kako je naslov zakona in koliko členov ima?";
  const relevantDocs = await store.similaritySearch(question);

  // Call the chain
  const y = await chain.call({
    input_documents: store,
    question,
  });

  console.log(y);
})








router.get("/xmem", async (req, res) => {
  const fileContent = fs.readFileSync('./txtfiles/zakontest.txt', 'utf8');
  const llmA = new OpenAI({ openAIApiKey: mySecret, temperature: 0.9 });
  const chainA = loadQAStuffChain(llmA);
  const docs = [
    new Document({ pageContent: fileContent }),
  ];
  const resA = await chainA.call({
    input_documents: docs,
    question: "O čem govori dokument?",
  });
  console.log({ resA });
})





router.get("/ask", async (req, res) => {
  const model = new OpenAI({ openAIApiKey: mySecret, temperature: 0.9 });
  const text = fs.readFileSync(`./txtfiles/2022-01-1186-2013-01-0784-npb11.txt`, "utf8");
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000 });
  const docs = await textSplitter.createDocuments([text]);

  // Create a vector store from the documents.
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: mySecret }));

  // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  const x = await chain.call({
    query: "Kdaj je bil Zakon o delovnih razmerjih objavljen v Uradnem listu?",
  });
  console.log({ x });
})

router.post("/askk", async (req, res) => {
  let data = req.body.data;
  let shortFileName = () => {
    let x = data.name.split(".");
    let y = x[0].split(" ").join("");
    return y;
  }
  const model = new OpenAI({ openAIApiKey: mySecret, temperature: 0.9 });
  const text = fs.readFileSync(`./txtfiles/${shortFileName()}.txt`, "utf8");
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: mySecret }));
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  const x = await chain.call({
    query: data.content,
  });
  console.log({ x });
  let responseobject = {
    name: data.name,
    role: "assistant",
    content: x.text
  }
  res.json(responseobject);
})

router.post("/askkk", async (req, res) => {
  let data = req.body.newObject;
  let shortFileName = () => {
    let x = data.name.split(".");
    let y = x[0].split(" ").join("");
    return x[0];
  }
  const model = new OpenAI({ openAIApiKey: mySecret, temperature: 0.9, model: "gpt-3.5-turbo" });
  const text = fs.readFileSync(`./txtfiles/${shortFileName()}.txt`, "utf8");
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: mySecret }));
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  const x = await chain.call({
    query: data.content,
  });
  console.log({ x });
  let responseobject = {
    name: data.name,
    role: "assistant",
    content: x.text
  }
  res.json(responseobject);
})






router.post("/summarize", async (req, res) => {
  let data = req.body.data;
  let fileName = data.name;
  let shortFileName = () => {
    let x = fileName.split(".");
    let y = x[0].split(" ").join("");
    return y;
  }
  let inputFilePath = `./files/${fileName}`
  let outputFilePath = `./txtfiles/${shortFileName()}.txt`

  const text = fs.readFileSync(outputFilePath, "utf8");
  console.log(text);
  const model = new OpenAI({ openAIApiKey: mySecret, temperature: 0.9, model: "gpt-3.5-turbo" });
  const combineDocsChain = loadSummarizationChain(model);
  const chain = new AnalyzeDocumentChain({
    combineDocumentsChain: combineDocsChain,
  });
  const final = await chain.call({
    input_document: text,
  });
  console.log({ final });
  res.json(final.text);
})




module.exports = router;