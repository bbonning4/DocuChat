const express = require("express");
const router = express.Router();
const documentsCtrl = require("../../controllers/api/documents");
const ensureLoggedIn = require("../../config/ensureLoggedIn");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    }
});
const upload = multer({storage})

router.post("/process", upload.single("file"), documentsCtrl.processDocument);

module.exports = router;
