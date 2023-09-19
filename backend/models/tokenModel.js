
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const tokenSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    expires: 3600, //expires after 1 hour
      default: Date.now
}
},{
    timestamps: true
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token