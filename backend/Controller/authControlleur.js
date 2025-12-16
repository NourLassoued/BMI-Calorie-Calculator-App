const User = require("../models/userschema");
const jwt = require("jsonwebtoken");
const maxAge = 2 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};
module.exports = {
  register: async (req, res) => {
    try {
      // Si multer est utilisé, l'image est dans req.file
      let imageName = "default.jpg";
      if (req.file) {
        imageName = req.file.filename;
      }

      const { nom, prenom, email, motDePasse, dateNaissance, sexe, role, taille } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Supprimer l'image uploadée si utilisateur déjà existant
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Email déjà utilisé" });
      }

      // Créer un nouvel utilisateur
      const newUser = new User({
        nom,
        prenom,
        email,
        motDePasse,
        dateNaissance,
        sexe,
        role,
        taille,
        image_user: imageName
      });

      await newUser.save();

      res.status(201).json({ message: "Utilisateur ajouté avec succès", user: newUser });
    } catch (error) {
      console.error("❌ Error in register:", error);
      // Supprimer l'image uploadée en cas d'erreur
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ message: "Erreur lors de l'ajout", error: error.message });
    }
  }
,

 loginUser :async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs" });
    }

    // Vérification de l'utilisateur
    const user = await User.login(email, motDePasse);
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Création du token
    const token = createToken(user._id);

    // Stocker le token dans un cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // converti en millisecondes
      secure: false, // mettre true si HTTPS
      sameSite: "lax",
    });

    // Réponse au front
    res.status(200).json({
      message: "Connexion réussie",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error("❌ Error in loginUser:", error);
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
}
,

  logoutUser: async (req, res) => {
    try {
      res.cookie("jwt", "", { httpOnly: false, maxAge: 1 });
      res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
      console.error("❌ Error in logoutUser:", error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la déconnexion",
          error: error.message,
        });
    }
  },
};
