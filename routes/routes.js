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


function razlikaMedCasoma(zacetni, koncni) {
  const zacetneUre = parseInt(zacetni.split(':')[0]);
  const zacetniMinute = parseInt(zacetni.split(':')[1]);
  const koncneUre = parseInt(koncni.split(':')[0]);
  const koncneMinute = parseInt(koncni.split(':')[1]);

  return (koncneUre * 60 + koncneMinute) - (zacetneUre * 60 + zacetniMinute);
}

function pristejMinute(cas, dodatne_minute) {
  const ure = parseInt(cas.split(':')[0]);
  const minute = parseInt(cas.split(':')[1]);

  const skupnoMinute = ure * 60 + minute + dodatne_minute;
  const noveUre = Math.floor(skupnoMinute / 60);
  const noveMinute = skupnoMinute % 60;

  return `${noveUre.toString().padStart(2, '0')}:${noveMinute.toString().padStart(2, '0')}`;
}

router.post('/urnik', async (req, res, next) => {
  try {
    const delavec_id = req.session.user.delavec_id;
    if (!delavec_id) {
      return res.status(401).send('User is not a worker');
    }
    const deleteQueryResult = await DB.izbrisiUrnik(req.session.user.delavec_id);
    if (deleteQueryResult.serverStatus !== 2) {
      return res.status(500).send('Error deleting schedule');
    }

    const urnik = req.body.workHours;

    const premor_storitve = [
      { id: 1, duration: 1440 },
      { id: 2, duration: 720 },
      { id: 3, duration: 360 },
      { id: 4, duration: 180 },
      { id: 5, duration: 60 },
      { id: 6, duration: 30 },
      { id: 7, duration: 15 }
    ]

    for (let dan in urnik) {
      // sortiraj da je prej zacetek
      urnik[dan].sort((a, b) => a.start.localeCompare(b.start));

      let prosto_zacetek = '00:00';

      for (let i = 0; i < urnik[dan].length; i++) {
        // zracunaj konec prostega casa
        let prosto_konec = urnik[dan][i].start;

        // napolni kjer je prosto z narocili
        let preostane_minut = razlikaMedCasoma(prosto_zacetek, prosto_konec);
        for (const storitev of premor_storitve) {
          while (storitev.duration <= preostane_minut) {
            await createNarocilo(dan, prosto_zacetek, prosto_konec, delavec_id, storitev.id);
            prosto_zacetek = pristejMinute(prosto_zacetek, storitev.duration);
            preostane_minut -= storitev.duration;
          }
        }

        // zacetek naslednjega prostega časa je konec tega
        prosto_zacetek = urnik[dan][i].end;
      }

      // Zafilaj po delovniku
      let prosto_konec = '24:00';
      let preostane_minut = razlikaMedCasoma(prosto_zacetek, prosto_konec);
      for (const premor of premor_storitve) {
        while (premor.duration <= preostane_minut) {
          await createNarocilo(dan, prosto_zacetek, prosto_konec, delavec_id, premor.id);
          prosto_zacetek = pristejMinute(prosto_zacetek, premor.duration);
          preostane_minut -= premor.duration;
        }
      }
    }

    res.status(200).send('Schedule created successfully');

  } catch (err) {
    next(err);
  }
});

async function createNarocilo(dan, prosto_zacetek, prosto_konec, delavec_id) {
  // zracunaj kolko casa je fraj
  const dolzina_prostega_casa = (new Date(`1970-01-01T${prosto_konec}:00Z`) - new Date(`1970-01-01T${prosto_zacetek}:00Z`)) / 60000;

  // odloci se kera premor storitev ni prevelika
  let storitev_id;
  if (dolzina_prostega_casa >= (1440 - 1)) storitev_id = 1;
  else if (dolzina_prostega_casa >= (720 - 1)) storitev_id = 2;
  else if (dolzina_prostega_casa >= (360 - 1)) storitev_id = 3;
  else if (dolzina_prostega_casa >= (180 - 1)) storitev_id = 4;
  else if (dolzina_prostega_casa >= (60 - 1)) storitev_id = 5;
  else if (dolzina_prostega_casa >= (30 - 1)) storitev_id = 6;
  else if (dolzina_prostega_casa >= (15 - 1)) storitev_id = 7;

  let stranka_id;
  switch (dan) {
    case 'pon':
      stranka_id = 0
      break;
    case 'tor':
      stranka_id = 1
      break;
    case 'sre':
      stranka_id = 2
      break;
    case 'cet':
      stranka_id = 3
      break;
    case 'pet':
      stranka_id = 4
      break;
    case 'sob':
      stranka_id = 5
      break;
    case 'ned':
      stranka_id = 6
      break;
  }

  let mysql_datetime = `1970-01-01 ${prosto_zacetek}:00`;


  const narocilo = {
    narocilo_cas: mysql_datetime,
    stranka_id: stranka_id,
    delavec_id: delavec_id,
    storitev_id: storitev_id
  };

  console.log(narocilo);

  const queryResult = await DB.urnikNarocilo(narocilo);
  return queryResult;
}

module.exports = router;
