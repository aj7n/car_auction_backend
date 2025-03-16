const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemname: String,
  itemprice: Number,  // Original price
  bidprice: { type: Number, default: 0 }, // Current highest bid, default 0
  auctionstatus: String, // "open" or "sold"
  auctioneddate: Date,
  userwhouploded: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userwhobuyed: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createddate: { type: Date, default: Date.now },
  imageUrl: String, // Image URL
  description: String,
});

module.exports = mongoose.model("Item", ItemSchema);
