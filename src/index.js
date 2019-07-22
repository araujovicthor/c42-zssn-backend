const mongoose = require("mongoose");
const server = require("./server");

mongoose.connect("mongodb://localhost:27017/zssn", {
  useMongoClient: true
});

server.listen(process.env.PORT || 5000);
