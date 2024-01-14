const express = require('express');
const router = express.Router();
const DB = require('../db/dbConn');
const { body, validationResult, param } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/session', (req, res, next) => {
  try {
    if (req.session.logged_in) {
      res.status(200).json(req.session.user)
    } else {
      res.status(401).json({ stranka: null, status: { success: false, msg: "Uporabnik ni prijavljen" } })
    }
  } catch (error) {
    res.status(500).json({ status: { success: false, msg: "Napaka pri pridobivanju seje" } })
    next(error);
  }
});

router.get('/podjetja', async (req, res, next) => {
  try {
    const queryResult = await DB.vsaPodjetja()
    res.statusCode = 200;
    res.json(queryResult)
    res.end();
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
    next()
  }
});

router.get('/podjetja/:podjetje_id',
  param('podjetje_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryResult = await DB.podjetje(req.params.podjetje_id)
      res.statusCode = 200;
      res.json(queryResult)
      res.end();
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
      next()
    }
  });

router.get('/storitve/:podjetje_id',
  param('podjetje_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryResult = await DB.vseStoritve(req.params.podjetje_id)
      res.statusCode = 200;
      res.json(queryResult)
      res.end();
    } catch (err) {
      next(err)
    }
  });

router.get('/delavci/:podjetje_id',
  param('podjetje_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryResult = await DB.vsiDelavci(req.params.podjetje_id)
      res.status(200).json(queryResult);
    } catch (err) {
      next(err)
    }
  });

router.get('/stranka/narocila',
  async (req, res, next) => {
    try {
      if (req.session.logged_in) {
        const queryResult = await DB.strankaNarocila(req.session.user.stranka_id)
        res.status(200).json(queryResult);
      }
      else {
        res.status(500).json({ status: { success: false, msg: "Uporabnik ni prijavljen" } })
      }
    } catch (err) {
      next(err)
    }
  }
);

router.get('/delavec/narocila',
  async (req, res, next) => {
    try {
      if (req.session.logged_in) {
        const queryResult = await DB.delavciNarocila(req.session.user.delavec_id)
        res.status(200).json(queryResult);
      }
      else {
        res.status(500).json({ status: { success: false, msg: "Uporabnik ni prijavljen" } })
      }
    } catch (err) {
      next(err)
    }
  }
);

router.post('/narocilo/novo',
  body('narocilo_cas').notEmpty(),
  body('narocilo_opombe').isString(),
  body('stranka_id').isInt(),
  body('delavec_id').isInt(),
  body('storitev_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    if (req.body.stranka_id != req.session.user.stranka_id) {
      res.status(500).json({ status: { success: false, msg: "Na storitev lahko naročite le sebe" } })
      return
    }
    if (!req.session.logged_in) {
      res.status(200).json({ status: { success: false, msg: "Uporabnik ni prijavljen" } })
      return
    }
    try {
      const queryResult = await DB.ustvariNarocilo(
        req.body.narocilo_cas,
        req.body.narocilo_opombe,
        req.body.stranka_id,
        req.body.delavec_id,
        req.body.storitev_id
      )
      res.status(200).json(queryResult);
    } catch (err) {
      next(err)
    }
  });

// TODO: za delavca in stranko posebej
router.delete('/narocilo/preklici',
  body('narocilo_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { narocilo_id } = req.body;
      const queryResult = await DB.prekliciNarocilo(narocilo_id)
      res.status(200).json(queryResult);
    } catch (err) {
      next(err)
    }
  });

router.delete('/stranka',
  async (req, res, next) => {
    try {
      if (!req.session.logged_in) {
        res.status(401).json({ status: { success: false, msg: "Uporabnik ni prijavljen" } })
        return
      }
      else {
        const queryResult = await DB.izbrisiStranko(req.session.user.stranka_id)
        res.status(200).json(queryResult);
      }
    } catch (err) {
      next(err)
    }
  });

// TODO: admin lahko brise delavce ki so pri istem podjetju
router.delete('/delavec',
  async (req, res, next) => {
    try {
      const queryResult = await DB.izbrisiDelavca(req.body.target_delavec_id)
      res.status(200).json(queryResult);
    } catch (err) {
      next(err)
    }
  });

// TODO: admin lahko brise podjetje samo ce je v istem podjetju
router.delete('/podjetje',
  async (req, res, next) => {
    try {
      const queryResult = await DB.izbrisiPodjetje(req.body.target_podjetje_id)
      res.status(200).json(queryResult);
    } catch (err) {
      next(err)
    }
  });


// TODO: admin lahko brise storitev samo ce je v istem podjetju
router.delete('/storitev/:storitev_id',
  param('storitev_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryResult = await DB.izbrisiStoritev(req.params.storitev_id)
      res.status(200).json(queryResult);
    } catch (err) {
      next(err)
    }
  });

router.post('/storitev/nova',
  body('storitev_ime').isString(),
  body('storitev_opis').isString(),
  body('storitev_slika').isString(),
  body('storitev_cena').isFloat(),
  body('storitev_trajanje').isInt(),
  body('podjetje_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryResult = await DB.ustvariStoritev(
        req.body.storitev_ime,
        req.body.storitev_opis,
        req.body.storitev_slika,
        req.body.storitev_cena,
        req.body.storitev_trajanje,
        req.body.podjetje_id
      )
      res.status(200).json(queryResult);
    } catch (err) {
      next(err)
    }
  });

router.post('/storitev/uredi/:storitev_id',
  param('storitev_id').isInt(),
  body('storitev_ime').isString(),
  body('storitev_opis').isString(),
  body('storitev_slika').isString(),
  body('storitev_cena').isFloat(),
  body('storitev_trajanje').isInt(),
  body('podjetje_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryResult = await DB.urediStoritev(
        req.params.storitev_id,
        req.body.storitev_ime,
        req.body.storitev_opis,
        req.body.storitev_slika,
        req.body.storitev_cena,
        req.body.storitev_trajanje
      )
      res.status(200).json(queryResult);
    } catch (err) {
      next(err)
    }
  });

module.exports = router;
