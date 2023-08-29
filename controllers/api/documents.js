const { PineconeClient } = require('@pinecone-database/pinecone');
const { TextLoader } = require('langchain/document_loaders/fs/text')
const { PDFLoader } = require('langchain/document_loaders/fs/pdf')
const { ChatService } = require('../../src/utilities/chat-handler')

module.exports = {
  processDocument,
};

const chatService = new ChatService();

async function processDocument(req, res) {
  // load file?
  // split
  // vector store
  // 
  const handlerData = {};
  handlerData.files = req.file;
  console.log(req.file);
  handlerData.user = req.user;
  const response = await chatService.ingestFile(handlerData)

  req.body = response;
  console.log(req.file);
  res.json('success');
}