const Season = require('../models/seasonModel');

const createSeason = async (req, res) => {
    try {
        let season = await Season.findOne({ season: req.body.season });
        if (season) return res.status(400).json({ msg: 'Season already exists' });

        season = new Season(req.body);
        await season.save();
        res.status(201).json({ msg: 'Season created' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

const getSeason = async (req, res) => {
    try {
        const season = await Season.findOne({ season: req.body.season });
        if (!season) return res.status(404).json({ msg: 'Season not found' });

        res.status(200).json(season);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

const updateSeason = async (req, res) => {
    const { season, newSeason } = req.body;
    try {
        let existSeason = await Season.findOne({ season });
        if (!existSeason) return res.status(400).json({ msg: 'Season does not exist' });

        const updatedSeason = await Season.findOneAndUpdate(
            { season },
            { season: newSeason },
            { new: true }
        );

        res.status(200).json({ msg: 'Season updated', updatedSeason });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

module.exports = {
    createSeason,
    getSeason,
    updateSeason
};
