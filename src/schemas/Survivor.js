const mongoose = require("mongoose");

const resourceAttributes = {
  amount: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  points: { type: Number, default: 0 }
};

const survivorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    required: true,
    enum: ["M", "F"]
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  contamination_counter: {
    type: Number,
    default: 0
  },
  isInfected: {
    type: Boolean,
    default: false
  },
  water: resourceAttributes,
  food: resourceAttributes,
  medication: resourceAttributes,
  ammunition: resourceAttributes
});

survivorSchema.methods.assignPoints = function assignPoints() {
  this.water.points = 4 * this.water.amount;
  this.food.points = 3 * this.food.amount;
  this.medication.points = 2 * this.medication.amount;
  this.ammunition.points = 1 * this.ammunition.amount;
};

survivorSchema.statics.getAverageResources = function getAverageResources(
  survivors
) {
  let average = { water: 0, food: 0, medication: 0, ammunition: 0 };

  survivors.forEach(function(survivor) {
    average.water += survivor.water.amount / survivors.length;
    average.food += survivor.food.amount / survivors.length;
    average.medication += survivor.medication.amount / survivors.length;
    average.ammunition += survivor.ammunition.amount / survivors.length;
  });

  average.water = parseFloat(average.water.toFixed(2));
  average.food = parseFloat(average.food.toFixed(2));
  average.medication = parseFloat(average.medication.toFixed(2));
  average.ammunition = parseFloat(average.ammunition.toFixed(2));

  return average;
};

survivorSchema.methods.getTotalPoints = function getTotalPoints() {
  return (
    this.water.points +
    this.food.points +
    this.medication.points +
    this.ammunition.points
  );
};

survivorSchema.methods.checkTradingResources = function checkTradingResources(
  resources
) {
  if (resources.length == 0) {
    return false;
  }

  let result = true;

  resources.forEach(function(resource) {
    if (resource["item"] == "water") {
      if (this.water.amount < resource["amount"]) {
        result = false;
      }
    } else if (resource["item"] == "food") {
      if (this.food.amount < resource["amount"]) {
        result = false;
      }
    } else if (resource["item"] == "medication") {
      if (this.medication.amount < resource["amount"]) {
        result = false;
      }
    } else if (resource["item"] == "ammunition") {
      if (this.ammunition.amount < resource["amount"]) {
        result = false;
      }
    }
  }, this);

  return result;
};

survivorSchema.methods.performTrade = function performTrade(
  givenResources,
  receivedResouces
) {
  givenResources.forEach(function(resource) {
    if (resource["item"] == "water") {
      this.water.amount -= resource["amount"];
    } else if (resource["item"] == "food") {
      this.food.amount -= resource["amount"];
    } else if (resource["item"] == "medication") {
      this.medication.amount -= resource["amount"];
    } else if (resource["item"] == "ammunition") {
      this.ammunition.amount -= resource["amount"];
    }
  }, this);

  receivedResouces.forEach(function(resource) {
    if (resource["item"] == "water") {
      this.water.amount += resource["amount"];
    } else if (resource["item"] == "food") {
      this.food.amount += resource["amount"];
    } else if (resource["item"] == "medication") {
      this.medication.amount += resource["amount"];
    } else if (resource["item"] == "ammunition") {
      this.ammunition.amount += resource["amount"];
    }
  }, this);
};

module.exports = mongoose.model("Survivor", survivorSchema);
