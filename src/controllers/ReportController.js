const Survivor = require("../schemas/Survivor");

class ReportController {
  async countInfected(req, res) {
    const total = await Survivor.count();

    Survivor.count({ isInfected: true }, function(err, infected) {
      if (err) {
        return res.status(400).json({ error: "Error to get report" });
      }
      return res.json({
        infected: ((infected / total) * 100).toFixed(2) + "%"
      });
    });
  }

  async countNonInfected(req, res) {
    const total = await Survivor.count();

    Survivor.count({ isInfected: false }, function(err, nonInfected) {
      if (err) {
        return res.status(400).json({ error: "Error to get report" });
      }
      return res.json({
        nonInfected: ((nonInfected / total) * 100).toFixed(2) + "%"
      });
    });
  }

  async lostPoints(req, res) {
    Survivor.find({ isInfected: true }, function(err, survivors) {
      if (err) {
        return res.status(400).json({ error: "Error to get report" });
      }
      let totalPoints = 0;
      survivors.forEach(function(survivor) {
        totalPoints += survivor.getTotalPoints();
      });
      return res.json({ lost_points: totalPoints });
    });
  }

  async averageResources(req, res) {
    Survivor.find({}, function(err, survivors) {
      if (err) {
        return res.status(400).json({ error: "Error to get report" });
      }
      return res.json(Survivor.getAverageResources(survivors));
    });
  }
}

module.exports = new ReportController();
