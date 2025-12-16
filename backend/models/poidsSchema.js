const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const PoidsSchema = new mongoose.Schema({
 

  poidsActuel: { 
    type: Number, 
    required: true // poids mesuré
  },
  dateMesure: { type: Date, default: Date.now },
  heureMesure: { type: String, default: () => new Date().toTimeString().slice(0, 5) },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  utilisateur: {
    type:mongoose.Schema.Types.ObjectId,ref:'User',
    required:true
  }
});


const Poids = mongoose.model("Poids", PoidsSchema);
module.exports = Poids;