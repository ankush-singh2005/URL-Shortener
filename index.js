const express=require("express")
const path = require('path') //we are importing this for using the ejs files.
const app=express();
const PORT = 8001;
const mongoose = require('mongoose');
const URL = require('./models/url');

//calling all routes
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

mongoose.connect("mongodb://127.0.0.1:27017/url-shortener")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Could not connect to MongoDB",err));

//setting the view engine
app.set('view engine','ejs');
app.set('views', path.resolve('./views'));

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false})); // to pass the form data

//routes
app.use('/url', urlRoute);
app.use('/user', userRoute);
app.use('/', staticRoute);


app.get('/url/:shortId', async (req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push:{
                visitHistory: {timestamp: Date.now()},
            }
        }
    );
    res.redirect(entry.redirectURL);
})


app.listen(PORT, (err) => {
    if(err) console.log("Error", err)
    console.log("Running on PORT:", PORT)
});