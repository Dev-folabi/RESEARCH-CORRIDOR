const Season = require('../models/seasonModel')


const createSeason = async(req, res) =>{

    try {
        let season = Season.findOne(req.body)
        if (season) return res.status(400).json({ msg: 'Season already exists' });
    
       season = new Season(req.body);
        await season.save();
        res.status(401).json({ msg: 'Season created' })
      } catch (err) {
        res.status(500).send('Server error');
      }
};

const getSeason = async(req, res) =>{

    try {
        const season = Season.findOne(req.body)
       
        res.status(401).json(season)
      } catch (err) {
        res.status(500).send('Server error');
      }
};

const updateSeason = async(req, res) =>{

    try {
        let season = Season.findOne(req.body)
        if (!season) return res.status(400).json({ msg: 'Season not exists' });
    
       season = new Season.findOneAndUpdate(req.body);
        await season.save();
        res.status(401).json({ msg: 'Season created' })
      } catch (err) {
        res.status(500).send('Server error');
      }
};

module.exports = {
    createSeason, 
    getSeason, 
    updateSeason
}