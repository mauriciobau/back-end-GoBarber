module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  passowrd: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
