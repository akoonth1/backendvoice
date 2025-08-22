
import express from 'express'
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const app = express()
const port = 3000


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})