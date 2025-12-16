const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  dateNaissance: Date,
  sexe: { type: String, enum: ['homme', 'femme', 'autre'] },
  taille: { type: Number }, // en cm
  telephone: String,
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  estActif: { type: Boolean, default: false },
  usercreatedAt: { type: Date, default: Date.now },
  
  image_user: { type: String, default: "default.jpg" }
});

userSchema.pre("save", async function() {
  if (this.isModified("motDePasse")) {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  }
});


userSchema.statics.login=async function(email,motDePasse){
  const user=await this.findOne({email});
  if(user){
    const auth=await bcrypt.compare(motDePasse,user.motDePasse);
    if(auth)
      
      {
     
          return user;
      }
      throw Error('incorrect password');
  }
  throw Error('incorrect email');
};


const User = mongoose.model("User", userSchema);
module.exports = User;
