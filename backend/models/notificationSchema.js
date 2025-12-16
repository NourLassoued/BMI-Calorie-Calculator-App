const notificationSchema = new mongoose.Schema({
  utilisateur: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  titre: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['rappel', 'objectif', 'felicitation', 'alerte', 'info'], 
    default: 'info' 
  },
  lu: { type: Boolean, default: false },
  dateEnvoi: { type: Date, default: Date.now },
  dateExpiration: Date,
  lien: String // Lien optionnel vers une ressource
});
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;