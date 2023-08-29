const express = require("express");
const router = express.Router();
const documentsCtrl = require("../../controllers/api/documents");
const ensureLoggedIn = require("../../config/ensureLoggedIn");
const upload = require("multer")();

router.post("/process", upload.single("file"), documentsCtrl.process);

module.exports = router;
