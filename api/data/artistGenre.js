const genre = require('./genre')

const genreObj = genre.reduce((acc, cur) => {
  acc[cur.name] = cur.id
  return acc
}, {})

module.exports = [
  {
    artistId: 'h9nht',
    genreId: genreObj['Fork & Singer-Songwriter'],
  },
  {
    artistId: 'yeup_d',
    genreId: genreObj.Pop,
  },
  {
    artistId: 'sangdol2',
    genreId: genreObj['Hip-hop & Rap'],
  },
  {
    artistId: 'xxio',
    genreId: genreObj['Hip-hop & Rap'],
  },
  {
    artistId: 'grave_b',
    genreId: genreObj['Hip-hop & Rap'],
  },
  {
    artistId: 'mymi',
    genreId: genreObj.Piano,
  },
  {
    artistId: 'hanwori',
    genreId: genreObj.Pop,
  },
  {
    artistId: 'manof_ss',
    genreId: genreObj['Fork & Singer-Songwriter'],
  },
]
