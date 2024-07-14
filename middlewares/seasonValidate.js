const Season = require("../models/seasonModel");

const setSeason = async (req, res, next) => {
  
  try {
    const season  = req.params.season; 
    if (!season) {
      return res.status(400).json({ msg: "Pls, set Season" });
    }

    const seasonDoc = await Season.findOne({ season });
    if (!seasonDoc) {
      return res.status(400).json({ msg: "Invalid Season" });
    }
    req.season = seasonDoc;
    next();
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }

};

module.exports = setSeason;
