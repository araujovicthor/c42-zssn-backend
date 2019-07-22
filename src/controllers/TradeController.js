const Survivor = require("../schemas/Survivor");
const Trade = require("../schemas/Trade");

class TradeController {
  async store(req, res) {
    const {
      trader_1_id,
      trader_2_id,
      trader_1_resources,
      trader_2_resources
    } = req.body;

    var trade = new Trade({
      trader_1_id,
      trader_2_id,
      trader_1_resources,
      trader_2_resources
    });

    if (trader_1_id === trader_2_id) {
      return res
        .status(400)
        .json({ message: "Trade requires two different survivors" });
    }

    const trader_1 = await Survivor.findById(trader_1_id);
    const trader_2 = await Survivor.findById(trader_2_id);

    if (!trader_1 || !trader_2) {
      return res.status(404).json({ error: "Trader not found" });
    }

    if (trader_1.isInfected || trader_2.isInfected) {
      return res.status(400).json({ error: "Trader is infected" });
    }

    if (
      !trader_1.checkTradingResources(trader_1_resources) ||
      !trader_2.checkTradingResources(trader_2_resources)
    ) {
      return res.status(400).json({
        message: "Trader does not have enough resource for this transation"
      });
    }

    if (trade.checkTradePoints() !== true) {
      return res.status(400).json({
        message: "Both survivors must offer the same amount of points"
      });
    }

    trader_1.performTrade(trader_1_resources, trader_2_resources);
    trader_1.assignPoints();
    const trade_1 = await trader_1.save(function(err) {
      if (err) {
        return res
          .status(400)
          .json({ error: "The server couldn't save your request. " + err });
      }
    });

    trader_2.performTrade(trader_2_resources, trader_1_resources);
    trader_2.assignPoints();
    const trade_2 = await trader_2.save(function(err) {
      if (err) {
        return res
          .status(400)
          .json({ error: "The server couldn't save your request. " + err });
      }
    });

    if (trade_1 && trade_2) {
      return res.json({ message: "Trade complete successfully" });
    }
  }
}

module.exports = new TradeController();
