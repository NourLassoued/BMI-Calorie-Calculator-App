
class IMC {
  constructor(poids, taille, age, sexe, activite = 'Sedentary') {
    // Validation des paramètres
    if (typeof poids !== 'number' || poids <= 0 || poids > 500) {
      throw new Error('Poids invalide (doit être entre 1 et 500 kg)');
    }
    if (typeof taille !== 'number' || taille <= 0 || taille > 300) {
      throw new Error('Taille invalide (doit être entre 1 et 300 cm)');
    }
    if (typeof age !== 'number' || age <= 0 || age > 120) {
      throw new Error('Âge invalide (doit être entre 1 et 120 ans)');
    }
    if (!['homme', 'femme'].includes(sexe.toLowerCase())) {
      throw new Error('Sexe invalide (doit être "homme" ou "femme")');
    }
    
    const activitesValides = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active', 'Extra Active'];
    if (!activitesValides.includes(activite)) {
      throw new Error(`Activité invalide (doit être parmi: ${activitesValides.join(', ')})`);
    }

    this.poids = poids;
    this.taille = taille;
    this.age = age;
    this.sexe = sexe.toLowerCase();
    this.activite = activite;
  }

  // Calcul du BMR selon Harris-Benedict
  calculBMR() {
    if (this.sexe === 'homme') {
      return 88.362 + (13.397 * this.poids) + (4.799 * this.taille) - (5.677 * this.age);
    } else if (this.sexe === 'femme') {
      return 447.593 + (9.247 * this.poids) + (3.098 * this.taille) - (4.330 * this.age);
    } else {
      throw new Error('Sexe non reconnu pour le calcul BMR');
    }
  }

  // Calories selon niveau d'activité
  caloriesMaintenance() {
    const bmr = this.calculBMR();
    const facteurs = {
      'Sedentary': 1.2,
      'Light': 1.375,
      'Moderate': 1.55,
      'Active': 1.725,
      'Very Active': 1.9,
      'Extra Active': 2.0
    };
    const facteur = facteurs[this.activite] || 1.2;
    return Math.round(bmr * facteur);
  }

  //  Calcul du déficit/surplus calorique selon le rythme
  calculerDeficitParRythme(rythmeKgParSemaine) {
    // Validation du rythme
    const rythmesValides = [0.5, 0.8, 1];
    if (!rythmesValides.includes(rythmeKgParSemaine)) {
      throw new Error(`Rythme invalide (doit être 0.5, 0.8 ou 1 kg/semaine)`);
    }

    // 1 kg de graisse corporelle ≈ 7700 kcal
    const CALORIES_PAR_KG = 7700;
    
    // Calcul du déficit/surplus calorique par semaine
    const caloriesParSemaine = rythmeKgParSemaine * CALORIES_PAR_KG;
    
    // Déficit/surplus journalier
    const caloriesParJour = caloriesParSemaine / 7;
    
    return Math.round(caloriesParJour);
  }

  //  Calories selon objectif ET rythme
  caloriesObjectifAvecRythme(typeObjectif, rythemeKgparSemaine = null) {
    const maintenance = this.caloriesMaintenance();
    let calories;

    const objectifNormalise = typeObjectif.toLowerCase();

    // Si pas de rythme spécifié, utiliser les valeurs par défaut (±500 kcal)
    if (rythemeKgparSemaine === null) {
      switch(objectifNormalise) {
        case 'perte':
          calories = maintenance - 500;
          break;
        case 'gain':
          calories = maintenance + 500;
          break;
        case 'maintien':
        case 'maintenance':
          calories = maintenance;
          break;
        default:
          throw new Error('Objectif invalide (doit être "perte", "gain" ou "maintien")');
      }
    } else {
      // Calculer selon le rythme spécifique
      const deficitJournalier = this.calculerDeficitParRythme(rythemeKgparSemaine);
      
      switch(objectifNormalise) {
        case 'perte':
          calories = maintenance - deficitJournalier;
          break;
        case 'gain':
          calories = maintenance + deficitJournalier;
          break;
        case 'maintien':
        case 'maintenance':
          calories = maintenance;
          break;
        default:
          throw new Error('Objectif invalide (doit être "perte", "gain" ou "maintien")');
      }
    }

    // S'assurer que les calories ne descendent pas en dessous du minimum recommandé
    const minCalories = this.sexe === 'homme' ? 1500 : 1200;
    return Math.max(Math.round(calories), minCalories);
  }

  //  Maintenir la compatibilité avec l'ancienne méthode
  caloriesObjectif(objectif) {
    return this.caloriesObjectifAvecRythme(objectif, null);
  }

  //  Obtenir les détails du plan avec rythme
  detailsPlanRythme(typeObjectif, rythemeKgparSemaine) {
    const maintenance = this.caloriesMaintenance();
    const deficitJournalier = this.calculerDeficitParRythme(rythemeKgparSemaine);
    const caloriesObjectif = this.caloriesObjectifAvecRythme(typeObjectif, rythemeKgparSemaine);
    
    return {
      rythme: {
        kgParSemaine: rythemeKgparSemaine,
        kgParMois: Math.round(rythemeKgparSemaine * 4.33 * 10) / 10,
        description: this.getDescriptionRythme(rythemeKgparSemaine)
      },
      calories: {
        maintenance: maintenance,
        objectif: caloriesObjectif,
        ajustementJournalier: typeObjectif === 'perte' ? -deficitJournalier : 
                               typeObjectif === 'gain' ? deficitJournalier : 0,
        ajustementHebdomadaire: typeObjectif === 'perte' ? -deficitJournalier * 7 : 
                                 typeObjectif === 'gain' ? deficitJournalier * 7 : 0
      }
    };
  }

  //  Description du rythme
  getDescriptionRythme(rythme) {
    switch(rythme) {
      case 0.5:
        return 'Lent et durable (recommandé pour la santé)';
      case 0.8:
        return 'Modéré et équilibré';
      case 1:
        return 'Rapide (nécessite discipline)';
      default:
        return 'Non défini';
    }
  }

  // Calcul IMC
  calculIMC() {
    const imc = this.poids / ((this.taille / 100) ** 2);
    return Math.round(imc * 10) / 10; // Arrondi à 1 décimale
  }

  // Classification IMC
  classificationIMC() {
    const imc = this.calculIMC();
    
    const classifications = [
      { min: 0, max: 16, label: 'Severe Thinness', risque: 'Élevé' },
      { min: 16, max: 17, label: 'Moderate Thinness', risque: 'Modéré' },
      { min: 17, max: 18.5, label: 'Mild Thinness', risque: 'Faible' },
      { min: 18.5, max: 25, label: 'Normal', risque: 'Normal' },
      { min: 25, max: 30, label: 'Overweight', risque: 'Augmenté' },
      { min: 30, max: 35, label: 'Obese Class I', risque: 'Modéré' },
      { min: 35, max: 40, label: 'Obese Class II', risque: 'Sévère' },
      { min: 40, max: Infinity, label: 'Obese Class III', risque: 'Très sévère' }
    ];

    const classification = classifications.find(c => imc >= c.min && imc < c.max);
    return classification || { label: 'Non défini', risque: 'Inconnu' };
  }

  // Poids idéal (formule de Lorentz)
  poidsIdeal() {
    if (this.sexe === 'homme') {
      return this.taille - 100 - ((this.taille - 150) / 4);
    } else {
      return this.taille - 100 - ((this.taille - 150) / 2.5);
    }
  }

  // Poids à perdre/gagner pour atteindre IMC normal
  poidsAAtteindre() {
    const imcActuel = this.calculIMC();
    const tailleMetre = this.taille / 100;
    
    // IMC cible (milieu de la fourchette normale : 21.75)
    const imcCible = 21.75;
    const poidsCible = imcCible * (tailleMetre ** 2);
    const difference = this.poids - poidsCible;

    return {
      poidsCible: Math.round(poidsCible * 10) / 10,
      difference: Math.round(difference * 10) / 10,
      type: difference > 0 ? 'perdre' : difference < 0 ? 'gagner' : 'maintenir'
    };
  }

  //  Résumé complet amélioré avec support du rythme
  resumeComplet(objectif = 'maintien', rythemeKgparSemaine = null) {
    const classification = this.classificationIMC();
    const poidsObjectif = this.poidsAAtteindre();
    
    const resume = {
      donnees: {
        poids: this.poids,
        taille: this.taille,
        age: this.age,
        sexe: this.sexe,
        activite: this.activite
      },
      imc: {
        valeur: this.calculIMC(),
        classification: classification.label,
        risque: classification.risque
      },
      calories: {
        bmr: Math.round(this.calculBMR()),
        maintenance: this.caloriesMaintenance(),
        objectif: rythemeKgparSemaine 
          ? this.caloriesObjectifAvecRythme(objectif, rythemeKgparSemaine)
          : this.caloriesObjectif(objectif)
      },
      poids: {
        actuel: this.poids,
        ideal: Math.round(this.poidsIdeal() * 10) / 10,
        cible: poidsObjectif.poidsCible,
        aModifier: Math.abs(poidsObjectif.difference),
        action: poidsObjectif.type
      }
    };

    // Ajouter les détails du rythme si spécifié
    if (rythemeKgparSemaine) {
      const detailsRythme = this.detailsPlanRythme(objectif, rythemeKgparSemaine);
      resume.planRythme = detailsRythme;
    }

    return resume;
  }
}

module.exports = IMC;