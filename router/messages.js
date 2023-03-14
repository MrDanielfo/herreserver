const { Router } = require("express");
const { getAllMessages } = require("../controllers/messages");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

router.get("/:from", validateJWT, getAllMessages);

module.exports = router;
