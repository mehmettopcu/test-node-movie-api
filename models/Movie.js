const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  director_id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: [true, "`{PATH}` alanı zorunludur."],
    maxlength: [
      100,
      "`{PATH}` alanı (`{VALUE}`), ({MAXLENGTH}) karakterden küçük olmalıdır "
    ],
    minlength: [
      1,
      "`{PATH}` alanı (`{VALUE}`), ({MINLENGTH}) karakterden büyük olmalıdır."
    ]
  },
  category: {
    type: String,
    maxlength: 100,
    minlength: 1
  },
  country: {
    type: String,
    maxlength: 100,
    minlength: 1
  },
  year: {
    type: Number,
    max: 2090,
    min: 1500
  },
  imdb_score: {
    type: Number,
    max: 10,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("movie", MovieSchema);
