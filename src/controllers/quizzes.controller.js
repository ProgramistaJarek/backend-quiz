const Quizzes = require('../models/quizzes.model');

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quizzes.findAll();
    res.json({ quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  getQuizzes,
};
