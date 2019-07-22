const express = require("express");

const routes = express.Router();

const SurvivorController = require("./controllers/SurvivorController");
const TradeController = require("./controllers/TradeController");
const ReportController = require("./controllers/ReportController");

routes.get("/survivors", SurvivorController.index);
routes.get("/survivors/:id", SurvivorController.show);
routes.patch("/survivors/:id", SurvivorController.update);
routes.post("/survivors", SurvivorController.store);
routes.post("/contamination", SurvivorController.contamination);

routes.post("/trades", TradeController.store);

routes.get("/reports/infected", ReportController.countInfected);
routes.get("/reports/noninfected", ReportController.countNonInfected);
routes.get("/reports/lostpoints", ReportController.lostPoints);
routes.get("/reports/averageresources", ReportController.averageResources);

module.exports = routes;
