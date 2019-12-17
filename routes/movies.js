const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

/* GET list all Movie from DB */
router.get("/", (req, res, next) => {
  Movie.aggregate([
    {
      $lookup: {
        from: "directors",
        localField: "director_id",
        foreignField: "_id",
        as: "director"
      }
    },
    {
      $unwind: {
        path: "$director",
        preserveNullAndEmptyArrays: true
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

/* GET top10 Movie list from DB */
router.get("/top10", (req, res, next) => {
  Movie.find({})
    .limit(10)
    .sort({ imdb_score: -1 })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

/* GET Movies list between two dates from DB */
router.get("/between/:start_year/:end_year", (req, res, next) => {
  const { start_year, end_year } = req.params;
  Movie.find({
    year: { $gte: parseInt(start_year), $lte: parseInt(end_year) }
  })
    .sort({ year: 1 })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

/* GET find Movie by ID from DB */
router.get("/:id", (req, res, next) => {
  const movieId = req.params.id;
  Movie.findById(movieId)
    .then(movie => {
      if (!movie) {
        next({ message: "The movie was not found.", code: "-1" });
      }
      res.json(movie);
    })
    .catch(err => {
      res.json(err);
    });
});

/* POST create new Movie on DB */
router.post("/", (req, res, next) => {
  const newMovieData = req.body;
  const movie = new Movie(newMovieData);
  movie
    .save()
    .then(movie => {
      res.json(movie);
    })
    .catch(err => {
      res.json(err);
    });
});

/* PUT update Movie by ID from DB */
router.put("/:id", (req, res, next) => {
  const movieId = req.params.id;
  const upToDateMovie = req.body;
  Movie.findByIdAndUpdate(movieId, upToDateMovie, { new: true })
    .then(movie => {
      if (!movie) {
        next({ message: "The movie was not found.", code: "-1" });
      }
      res.json(movie);
      //console.log(upToDateMovie);
    })
    .catch(err => {
      res.json(err);
    });
});

/* DELETE delete Movie by ID from DB */
router.delete("/:id", (req, res, next) => {
  const movieId = req.params.id;
  Movie.findByIdAndDelete(movieId)
    .then(movie => {
      if (!movie) {
        next({ message: "The movie was not found.", code: "-1" });
      }
      res.json(movie);
      //console.log(upToDateMovie);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
