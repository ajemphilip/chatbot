const express = require("express")
require("dotenv").config()
const { OpenAI } = require("openai")
const fs = require("fs")
const path = require("path")
const app = express();
var cors = require('cors')
app.use(cors())
app.use(express.json())
const speechFile = path.resolve(`./speech.mp3`);

const openai = new OpenAI({
  apiKey: ""
}); 

app.post("/audio", async (req,res) => {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",  
    voice: "alloy", 
    input: req.body.message, 
  });
  try {
    const buffer = Buffer.from(await mp3.arrayBuffer()); 
    await fs.promises.writeFile(speechFile, buffer);
    res.send("loaded") 
  }
  catch(error) {  
    res.status(500).send(error.message) 
  }
})

app.post("/find-complexity", async (req,res)=>{
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: req.body.message ? `Maximum 25 words continuation chapter paragraph random child story based on previous story :  ${req.body.message}.` :  "Maximum 25 words paragraph random child story with room for continuation"}],
        model: "gpt-3.5-turbo", 
      });
    try{ 
          res.send(completion.choices[0].message.content)
    }
    catch(error) {     
console.log(error);
res.status(500).send(error.message) 
    }
})
const port = process.env.PORT || 5000 

app.listen(port,()=>{console.log("working");})  