const express=require("express");
const{connectToMongoDB}=require("./connect");
const URL= require('./models/url');
const path=require("path");
const cookieParser=require("cookie-parser");
const {restrictToLoggedinUserOnly}=require("./middlewares/auth");

const staticRoute=require("./routes/staticRouter");
const urlRoute=require("./routes/url");
const userRoute=require("./routes/user");


const app=express();
const PORT=8005;

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log("Mongodb Connected"));

app.set("view engine","ejs");                                //Setting view engine as ejs
app.set('views',path.resolve("./views"));                    //to tell where are my views present for that we require path module

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/",staticRoute);
app.use("/user",userRoute);

app.get("/test",async (req,res)=>{
    const allUrls=await URL.find({});
    return res.render('home',{                      //render home from view
        urls:allUrls,                               //varname:value
    });                              
});

/*app.get("/test",async(req,res)=>{
        const allUrls=await URL.find({});
        return res.send(`
            <html>
                <head></head>                                     simple example of ssr
                <body>
                    <ol>
                     ${allUrls.map(url=>`<li>${url.shortId}-->${url.redirectURL}`).join("")}
                    </ol>
                </body>
            
            </html>
            `);
});
*/
app.get('/url/:shortID', async (req, res) => {
    try {
        const shortID = req.params.shortId;

        // Find and update visit history
        const entry = await URL.findOneAndUpdate(
            { shortId: shortID },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true } // Ensure the updated document is returned
        );

        if (!entry) {
            // Handle the case where the shortID does not exist
            return res.status(404).send('Short URL not found');
        }

        // Redirect to the original URL
        return res.redirect(entry.redirectURL);
    } catch (error) {
        console.error('Error in Redirect Endpoint:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT,()=>{
    console.log(`Server Started at PORT ${PORT} `);
});