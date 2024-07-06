const Season = require("../models/seasonModel");

const setSeason = async (req, res, next) => {
  const { season } = req.header('season'); 
    if (!season) {
      return res.status(400).json({ msg: "Season is required" });
    }
  
  try {

    const seasonDoc = await Season.findOne({ season });
    if (!seasonDoc) {
      return res.status(400).json({ msg: "Season does not exist" });
    }
    req.season = seasonDoc;
    next();
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
  
};

module.exports = setSeason;
