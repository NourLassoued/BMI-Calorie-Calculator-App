

const User = require("./userschema");
const Objectif = require("./ObjectifSchema");

class IMC {
  constructor(user, objectif) {
    if (!user) throw new Error("Utilisateur requis");
    this.user = user;
    this.objectif = objectif || null;
  }

  // Calcul IMC
  getIMC() {
    if (!this.user.taille || !this.objectif?.poidsDepart) return null;
    const tailleM = this.user.taille / 100;
    return (this.objectif.poidsDepart / (tailleM * tailleM)).toFixed(1);
  }

  // Calcul BMR (Mifflin-St Jeor)
  getBMR(poids = null) {
    poids = poids || this.objectif?.poidsDepart;
    if (!poids || !this.user.taille || !this.user.sexe || !this.user.dateNaissance) return null;

    const age = new Date().getFullYear() - this.user.dateNaissance.getFullYear();
    if (this.user.sexe === "homme") {
      return Math.round(10 * poids + 6.25 * this.user.taille - 5 * age + 5);
    } else if (this.user.sexe === "femme") {
      return Math.round(10 * poids + 6.25 * this.user.taille - 5 * age - 161);
    } else {
      const homme = 10 * poids + 6.25 * this.user.taille - 5 * age + 5;
      const femme = 10 * poids + 6.25 * this.user.taille - 5 * age - 161;
      return Math.round((homme + femme) / 2);
    }
  }

  // Calories journalières selon objectif
  getCaloriesJournalieres() {
    if (!this.objectif) return null;

    const bmr = this.getBMR();
    const facteurActivite = 1.2; // sédentaire par défaut

    let calories = bmr * facteurActivite;

    switch (this.objectif.typeObjectif) {
      case "perte":
        calories -= this.objectif.rythemeKgparSemaine * 7700 / 7;
        break;
      case "gain":
        calories += this.objectif.rythemeKgparSemaine * 7700 / 7;
        break;
      case "maintien":
        break;
      default:
        break;
    }

    return Math.round(calories);
  }

  // Résumé complet
  getSummary() {
    return {
      IMC: this.getIMC(),
      BMR: this.getBMR(),
      caloriesJournalieres: this.getCaloriesJournalieres(),
      objectifType: this.objectif?.typeObjectif || null,
    };
  }
}

module.exports = IMC;
