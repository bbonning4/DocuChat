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
const memoryStorage = multer.memoryStorage();
const upload = multer({storage})
const save = multer({storage: memoryStorage})

router.get("/", ensureLoggedIn, documentsCtrl.getAll);

router.post("/process", upload.single("file"), documentsCtrl.processDocument);
router.post("/save", save.single("file"), ensureLoggedIn, documentsCtrl.saveDocument);
router.post("/chat", documentsCtrl.chat);
router.post("/delete", ensureLoggedIn, documentsCtrl.deleteDocs);

module.exports = router;
