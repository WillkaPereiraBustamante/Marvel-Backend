const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/characters", async (req, res) => {
  try {
    let limit = 100;

    // le serveur peut recevoir les query skip, limit et name du front
    // recevoir la requete du front (avec possiblement les query pour le skip -pagination- et name -filtres-)
    console.log("query =>", req.query); // { name: 'spider' }

    // mise en place des query "skip", "limit" et "name"
    // gérer l'envoi ou non des filtres (skip et name)
    let filters = "";
    if (req.query.name) {
      // si j'ai une query name envoyée, je rajoute une query à la requete envoyée à l'API, sinon, filters reste vide

      filters += `&name=${req.query.name}`;
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
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}${filters}&limit=${limit}`
    );
    // console.log(Object.keys(response.data)); // [ 'count', 'limit', 'results' ]
    // récupérer la réponse et la renvoyer au front
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
