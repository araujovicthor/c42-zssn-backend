const Survivor = require("../schemas/Survivor");
const Contamination = require("../schemas/Contamination");

class SurvivorController {
  async index(req, res) {
    Survivor.find({}, function(err, survivors) {
      if (err) {
        res.status(400).json({ error: "Error to get survivors" });
      } else {
        res.json(survivors);
      }
    });
  }

  async store(req, res) {
    const { name, age, gender, latitude, longitude } = req.body;

    var survivor = new Survivor({
      name,
      age,
      gender,
      latitude,
      longitude,
      water: { amount: isNaN(req.body.water) ? 0 : req.body.water },
      food: { amount: isNaN(req.body.food) ? 0 : req.body.food },
      medication: {
        amount: isNaN(req.body.medication) ? 0 : req.body.medication
      },
      ammunition: {
        amount: isNaN(req.body.ammunition) ? 0 : req.body.ammunition
      }
    });
    survivor.assignPoints();
    await survivor
      .save()
      .then(survivor => res.json(survivor))
      .catch(err =>
        res
          .status(400)
          .json({ message: "The server couldn't save your request. " + err })
      );
  }

  async show(req, res) {
    Survivor.findById(req.params.id, function(err, survivor) {
      if (err) {
        res.status(400).json({ error: "Survivor not found" });
      } else {
        res.json(survivor);
      }
    });
  }

  async update(req, res) {
    const { latitude, longitude } = req.body;

    Survivor.findByIdAndUpdate(req.params.id, { latitude, longitude }, function(
      err,
      survivor
    ) {
      if (err) {
        res.status(400).json({ error: "Survivor not found" });
      } else {
        res.json(survivor);
      }
    });
  }

  async contamination(req, res) {
    const { reportee_id, reporter_id } = req.body;

    if (reportee_id === reporter_id) {
      res
        .status(400)
        .json({ message: "You can't report yourself as infected" });
    } else {
      const reportee = await Survivor.findById(reportee_id);
      const reporter = await Survivor.findById(reporter_id);
      if (reportee && reporter) {
        const findContamination = await Contamination.findOne({
          reporter_id,
          reportee_id
        });
        if (!findContamination) {
          Contamination.create(
            {
              reporter_id,
              reportee_id
            },
            function(err, contamination) {
              if (err) {
                res.status(400).json({
                  error: "The server couldn't save your request. " + err
                });
              } else {
                Survivor.findById(contamination.reportee_id, function(
                  err,
                  reportee
                ) {
                  reportee.contamination_counter++;
                  if (reportee.contamination_counter >= 3) {
                    reportee.isInfected = true;
                  }

                  reportee.save(function(err) {
                    if (err) {
                      res.status(400).json({
                        error: "The server could'n save your request. " + err
                      });
                    } else {
                      res.json({
                        message: "Contamination reported successfully"
                      });
                    }
                  });
                });
              }
            }
          );
        } else {
          res
            .status(400)
            .json({ error: "You can't report the same survivor twice" });
        }
      } else {
        res.status(400).json({ error: "Survivor not found" });
      }
    }
  }
}

module.exports = new SurvivorController();
