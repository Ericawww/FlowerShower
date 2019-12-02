var Course = require("../models/class/Course");

exports.getUserCoursePage = async (req, res) => {
  res.render("courses/coursePage");
};
