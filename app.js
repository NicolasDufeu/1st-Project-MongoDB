// on importe le module mongoose et express (expresse : en http)
const mongoose = require('mongoose');
const express = require('express')

// on utilise Express sur le port 3000
const app = express();
app.listen(3000);
app.get('/', (request, response) => {
    response.send('Hello World! The Express Server IS RUNNING !!!');
});


// on definie la constante uri qui est l'adresse de notre serveur MongoDB
const URI = "mongodb+srv://Nicolas:salut@cluster0.zlkra.mongodb.net/sample_airbnb?retryWrites=true&w=majority";

// on se connecte à notre serveur MongoDB
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) console.log("Error :", err);
    console.log('Connected to MongoDB');
})

// on definie un shema (obligatoire avec mongoose) meme vide
const mySchema = new mongoose.Schema({});

// on definie un model sur la base du schema (obligatoire avec mongoose)
const myModel = mongoose.model('airbnb', mySchema, 'listingsAndReviews');

// on effectue notre recherche avec methode find() sur le model correspondant
const count = myModel.find().countDocuments();
count.exec((err, result) => {
    console.log('Result count : ', result);
});

//on effectue une autre recherche avec find et les methodes connues
//const listing = myModel.find({name:/a/},{_id:1,name:1,listing_url:1}).skip(10).limit(20).sort({_id: 1});

// Recup des infos du client: rawHeaders => OS du navigateur, url => tout le parcours depuis la racine du serveur, query => tout les params dans mon url
const requestSchema = new mongoose.Schema({
    rawHeaders: Array,
    url: String,
    query: Object,
    date: {
        type: Date,
        default: Date.now
    }
});

// creation du model
const requestModel = mongoose.model('request', requestSchema, 'requestFromUsers');

// on affiche les resultats de la requetes sur le serveur expresse a l'adresse api
app.get('/api', (request, response) => {

    //on affiche dans la console les cariables provenant de l'url
    console.log(request.query);
    console.log('Request du navigateur client : ', request);


    //instanciation de lon model
    let newRequest = new requestModel(request);
    // on sauvegarde
    newRequest.save((err, data) => {
        if(err) console.log(err);
        console.log('Request Saved : ',data);
    });

    // on definit une limite à partir d'une variable limit provenant de l'url avec une condition pour eviter de declencher une erreur si la variable n'existe pas
    const limit = request.query.limit ? parseInt(request.query.limit) : 10;
    console.log(limit);

    const skip = request.query.skip ? parseInt(request.query.skip) : 0; // same avec skip
    console.log(skip);

    const q = request.query.q ? new RegExp('^' + request.query.q) : new RegExp('a'); // same avec q qui est redefinie en expression reguliere
    console.log(q);

    const q2 = request.query.q ? new RegExp(request.query.q) : new RegExp('^a'); // same avec q qui est redefinie en expression reguliere
    console.log(q2);

    const condition = {
        $or: [{
            name: q
        }, {
            summary: q2
        }]
    }; // on definie une condition pour rechercher les eventuelles termes q dans le name et summary

    const listing = myModel.find(condition, {
        _id: 1,
        name: 1,
        listing_url: 1,
        summary: 1
    }).skip(skip).limit(limit).sort({
        _id: 1
    });

    listing.exec((err, result) => {
        response.send(result);
    });
});
