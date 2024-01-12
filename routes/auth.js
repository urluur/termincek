const express = require('express');
const router = express.Router();
const DB = require('../db/dbConn');
const bcrypt = require('bcrypt');
const { body, validationResult, param } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


router.post('/prijava',
  body('eposta').isEmail(),
  body('geslo').isString(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { eposta, geslo } = req.body;
      if (eposta && geslo) {
        const queryResult = await DB.authStranka(eposta)
        if (queryResult.length > 0 && queryResult[0].stranka_geslo) {
          const match = await bcrypt.compare(geslo, queryResult[0].stranka_geslo);
          if (match) {
            req.session.user = queryResult[0];
            req.session.logged_in = true;

            req.session.save((err) => {
              if (err) {
                console.log("SEJE NE SHRANI: " + err)
              }
              return res.status(200).json({ stranka: queryResult[0], status: { success: true, msg: "Prijava uspešna" } })
            })

          } else {
            res.status(200).json({ stranka: null, status: { success: false, msg: "Napačni podatki" } }) // geslo ali uporabniško ime napačno
          }
        } else {
          res.status(200).send({ stranka: null, status: { success: false, msg: "Napačni podatki" } }) // uporabnik ni registriran
        }
      } else {
        res.status(200).send({ stranka: null, status: { success: false, msg: "Vnesite vse podatke" } })
      }
    } catch (error) {
      next(error);
    }
  });

router.post('/admin/prijava',
  body('eposta').isEmail(),
  body('geslo').isString(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { eposta, geslo } = req.body;
      if (eposta && geslo) {
        const queryResult = await DB.authDelavec(eposta)
        if (queryResult.length > 0 && queryResult[0].delavec_geslo) {
          // const match = await bcrypt.compare(geslo, queryResult[0].delavec_geslo); // TODO: ko bo registracija delavca
          const match = (geslo === queryResult[0].delavec_geslo);
          if (match) {
            req.session.user = queryResult[0];
            req.session.logged_in = true;

            req.session.save((err) => {
              if (err) {
                console.log("SEJE NE SHRANI: " + err)
              }
              return res.status(200).json({ delavec: queryResult[0], status: { success: true, msg: "Prijava uspešna" } })
            })

          } else {
            res.status(200).json({ delavec: null, status: { success: false, msg: "Napačni podatki" } }) // geslo ali uporabniško ime napačno
          }
        } else {
          res.status(200).send({ delavec: null, status: { success: false, msg: "Napačni podatki" } }) // uporabnik ni registriran
        }
      } else {
        res.status(200).send({ delavec: null, status: { success: false, msg: "Vnesite vse podatke" } })
      }
    } catch (error) {
      next(error);
    }
  });

router.get('/odjava', (req, res, next) => {
  try {
    req.session.destroy();
    res.status(200).json({ status: { success: true, msg: "Uspešna odjava" } })
  } catch (error) {
    res.status(500).json({ status: { success: false, msg: "Napaka pri odjavi" } })
    next(error);
  }
});

router.post('/registracija',
  body('ime').notEmpty(),
  body('priimek').notEmpty(),
  body('eposta').isEmail(),
  body('geslo').isLength({ min: 8 }),
  body('telefon').isMobilePhone(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryResult = await DB.registracijaStranka(
        req.body.ime,
        req.body.priimek,
        req.body.eposta,
        req.body.geslo,
        req.body.telefon
      )
      res.statusCode = 200;
      res.json({ stranka: queryResult, status: { success: true, msg: "Uporabnik ustvarjen" } })
      res.end();
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
      next()
    }
  });


module.exports = router;