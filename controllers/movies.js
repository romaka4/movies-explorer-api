const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-err');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner,
    movieId,
  })
    .then((movie) => res.status(201).send(movie))
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильм с указанным _id не найдена'))
    .then((movie) => {
      if (`${movie.owner}` !== req.user._id) {
        throw new ForbiddenError('Ошибка удаления фильма');
      }
      Movie.findByIdAndDelete(req.params.movieId)
        .orFail(new NotFoundError('Фильм с указанным _id не найден'))
        .then(() => {
          res.send({ message: 'успешно' });
        })
        .catch(next);
    })
    .catch(next);
};
