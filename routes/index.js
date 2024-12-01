const express = require("express");
const router = express.Router();

const usersRoutes = require("./users");
const charactersRoutes = require("./characters");
const comicsRoutes = require("./comics");

router.use(usersRoutes);
router.use(charactersRoutes);
router.use(comicsRoutes);

module.exports = router;
