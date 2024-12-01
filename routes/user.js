const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

module.exports = convertToBase64;
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");

router.post("/user/signup", fileUpload(), async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(409).json({ message: "This email already has an account" });
    } else {
      if (req.body.email && req.body.password && req.body.username) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.body.password + salt).toString(encBase64);

        // Étape 2 : créer le nouvel utilisateur
        const newUser = new User({
          email: req.body.email,
          token: token,
          hash: hash,
          salt: salt,
          account: {
            username: req.body.username,
          },
          newsletter: req.body.newsletter,
        });

        // Si je reçois une image, je l'upload sur cloudinary et j'enregistre le résultat dans la clef avatar de la clef account de mon nouvel utilisateur
        if (req.files?.avatar) {
          const result = await cloudinary.uploader.upload(
            convertToBase64(req.files.avatar),
            {
              folder: `https://upload-request.cloudinary.com/ddxajpnlx/c8f9084990ecba6bc06974fce42a7891/${newUser._id}`,
              public_id: "avatar",
            }
          );
          newUser.account.avatar = result;
        }

        // Étape 3 : sauvegarder ce nouvel utilisateur dans la BDD
        await newUser.save();
        res.status(201).json({
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
          account: newUser.account,
        });
      } else {
        // l'utilisateur n'a pas envoyé les informations requises ?
        res.status(400).json({ message: "Missing parameters" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
