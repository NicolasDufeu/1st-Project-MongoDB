// on importe le module mongoose
const mongoose = require('mongoose');

// on definie la constante uri qui est l'adresse de notre serveur MongoDB
const URI = "mongodb+srv://Nicolas:salut@cluster0.zlkra.mongodb.net/sample_airbnb?retryWrites=true&w=majority";

// on se connecte à notre serveur MongoDB
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) console.log("Error :",err);
    console.log('Connected to MongoDB');
})

// on definie un shema (obligatoire avec mongoose)
const mySchema = new mongoose.Schema({});

// on definie un model sur la base du schema (obligatoire avec mongoose)
const myModel = mongoose.model('airbnb', mySchema, 'listingsAndReviews');

// on effectue notre recherche avec methode find() sur le model correspondant
const count = myModel.find().countDocuments();
count.exec((err, result) => {
    console.log('Result count : ', result);
});
const listing = myModel.find({},{name: 1}).limit(5);
listing.exec((err, result) => {
    console.log('Result listing : ', result);
})
