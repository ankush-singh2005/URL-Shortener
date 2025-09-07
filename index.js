const express=require("express")
const app=express();
const PORT = 8001;
const urlRoute = require('./routes/url');
const mongoose = require('mongoose');
const URL = require('./models/url');

mongoose.connect("mongodb://127.0.0.1:27017/url-shortener")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Could not connect to MongoDB",err));


//middleware
app.use(express.json())

//routes
app.use('/url', urlRoute);

app.get('/:shortId', async (req,res) => {
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