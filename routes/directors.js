const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Direktor = require("../models/Direktor");

/* GET list all Direktor from DB */
router.get("/", (req, res, next) => {
  Direktor.aggregate([
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          name: "$name",
          surname: "$surname",
          bio: "$bio"
        },
        movies: {
          $push: "$movies"
        }
      }
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        surname: "$_id.surname",
        bio: "$_id.bio",
        movies: "$movies"
      }
    }
  ])
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

/* GET find Direktor by ID from DB */
router.get("/:id", (req, res, next) => {
  const directorId = req.params.id;
  Direktor.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(directorId)
      }
    },
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          name: "$name",
          surname: "$surname",
          bio: "$bio"
        },
        movies: {
          $push: "$movies"
        }
      }
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        surname: "$_id.surname",
        bio: "$_id.bio",
        movies: "$movies"
      }
    }
  ])
    .then(director => {
      if (!director) {
        next({ message: "The director was not found.", code: "-1" });
      }
      res.json(director);
    })
    .catch(err => {
      res.json(err);
    });
});

/* POST create new Direktor on DB */
router.post("/", (req, res, next) => {
  const newDirectorData = req.body;
  const director = new Direktor(newDirectorData);
  director
    .save()
    .then(director => {
      res.json(director);
    })
    .catch(err => {
      res.json(err);
    });
});

/* PUT update Direktor by ID from DB */
router.put("/:id", (req, res, next) => {
  const directorId = req.params.id;
  const upToDateDirector = req.body;
  Direktor.findByIdAndUpdate(directorId, upToDateDirector, { new: true })
    .then(director => {
      if (!director) {
        next({
          message: "The director was not found.",
          code: "-1"
        });
      }
      res.json(director);
      //console.log(upToDateDirector);
    })
    .catch(err => {
      res.json(err);
    });
});

/* DELETE delete Direktor by ID from DB */
router.delete("/:id", (req, res, next) => {
  const directorId = req.params.id;
  Direktor.findByIdAndDelete(directorId)
    .then(director => {
      if (!director) {
        next({ message: "The director was not found.", code: "-1" });
      }
      res.json(director);
      //console.log(upToDateMovie);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
