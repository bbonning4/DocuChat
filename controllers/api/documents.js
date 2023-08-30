const User = require("../../models/user");
const Document = require("../../models/document");

const { ChatService } = require("../../src/utilities/chat-handler");

const saveFile = require("../../config/save-file");
const deleteFile = require("../../config/delete-file");

module.exports = {
  processDocument,
  saveDocument,
  chat,
  chatWithDocs,
  getAll,
  deleteDocs,
};

const chatService = new ChatService();

async function processDocument(req, res) {
  const handlerData = {};
  handlerData.files = req.file;
  handlerData.user = req.user;
  const response = await chatService.ingestFile(handlerData);

  req.body = response;
  res.json("success");
}

async function saveDocument(req, res) {
  const user = await User.findById(req.user._id);
  const url = await saveFile(req.file);
  const document = await Document.create({
    user: user._id,
    name: req.file.originalname,
    url: url,
  });
  res.json(document);
}

async function chat(req, res) {
  const handlerData = {};
  console.log(req.body.query);
  handlerData.body = req.body.query;
  handlerData.user = req.user;

  const response = await chatService.startChat(handlerData);
  req.body = response;
  res.json(response);
}

async function chatWithDocs(req, res) {
  const docs = req.body;

  const docUrls = [];
  const keys = [];

  await Document.find({ _id: { $in: docs } })
    .then((foundDocs) => {
      foundDocs.forEach((doc) => {
        docUrls.push(doc.url);
      });
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
    });

  docUrls.forEach((url) => {
    const fileUrl = new URL(url);
    const pathname = fileUrl.pathname;
    const fileKey = decodeURIComponent(pathname.split("/").pop());
    keys.push(fileKey);
  });

  const handlerData = {};
  handlerData.files = keys;
  handlerData.user = req.user;
  const response = await chatService.ingestS3Files(handlerData);

  req.body = response;
  res.json(response.success);
}

async function getAll(req, res) {
  const docs = await Document.find({ user: req.user._id });
  res.json(docs);
}

async function deleteDocs(req, res) {
  const docs = req.body;

  try {
    for (const docId of docs) {
      const document = await Document.findById(docId);
      if (document) {
        await deleteFile(document.url);
        await Document.deleteOne({ _id: docId });
      }
    }

    res.status(200).json({ message: "Documents deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting documents." });
  }
}
