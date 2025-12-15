const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  //Récupérer le header Authorization
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
  }

  //Extraire le token
  const token = header.split(' ')[1];

  try {
    //Vérifier le token avec le secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Ajouter les infos utilisateur à la requête
    req.user = decoded; // contient { id, role }

    //Passer à la route suivante
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide.' });
  }
}

module.exports = auth;
