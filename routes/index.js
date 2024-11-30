const express = require("express");
const router = express.Router();

const userRoutes = require("./user");
const charactersRoutes = require("./characters");
const comicsRoutes = require("./comics");

router.use(userRoutes);
router.use(charactersRoutes);
router.use(comicsRoutes);

module.exports = router;
