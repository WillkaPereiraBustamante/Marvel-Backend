const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/comics", async (req, res) => {
  try {
    // recevoir la requete du front (avec possiblement les query pour le skip -pagination- et title -filtres-)
    // envoyer la requete a l'API
    let limit = 100;

    // le serveur peut recevoir les query page, limit et title du front
    console.log("query =>", req.query); // { title: 'spider' }

    // gérer l'envoi ou non des filtres (skip et title)
    let filters = "";
    if (req.query.title) {
      // si j'ai une query title envoyée, je rajoute une query à la requete envoyée à l'API, sinon, filters reste vide

      filters += `&title=${req.query.title}`;
    }
    if (req.query.limit) {
      limit = req.query.limit;
    }
    if (req.query.page) {
      // si j'ai une query page envoyée, je rajoute une query à la requete envoyée à l'API, sinon, filters reste vide
      filters += `&skip=${(req.query.page - 1) * limit}`;
    }
    // appel à l'api avec le paramètre query apiKey : grâce au client axios
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}${filters}&limit=${limit}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/comics/:characterId", async (req, res) => {
  try {
    // récupérer l'id d'un personnage :
    console.log(req.params);

    // mettre cet id dans la requete envoyée à l'API Marvel :
    const response = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/comics/" +
        req.params.characterId +
        "?apiKey=" +
        process.env.MARVEL_API_KEY
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
