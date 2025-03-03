const express = require('express'); 
const mysql = require('mysql'); 
const cors = require('cors'); 
const path = require('path'); 
const { auth, requiresAuth } = require('express-openid-connect'); // ✅ Import Auth0 middleware
const dotenv = require('dotenv');
dotenv.config();

const app = express(); 

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'datawise',  
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// Auth0 Configuration
const config = {
    authRequired: false, // Routes non protégées par défaut
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET, // Ajoutez cette variable dans votre .env
    baseURL: process.env.BASE_URL || 'http://localhost:5000',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: 'https://dev-nqg6dvxmwuu4hmr4.eu.auth0.com/'
};

// Apply Auth0 middleware globally
app.use(auth(config));

// Exemple de route publique
app.get('/', (req, res) => {
    res.send('Bienvenue sur Datawise API 🚀');
});

// ✅ Route protégée nécessitant une authentification
app.get('/authorized', requiresAuth(), (req, res) => {
    res.send(`🎉 Ressource sécurisée. Bienvenue, ${req.oidc.user.name}!`);
});

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).send('Page non trouvée');
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message);
});

// Démarrage du serveur
const port = process.env.PORT || 5000; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
