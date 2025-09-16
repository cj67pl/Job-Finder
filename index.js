import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js";
import dotenv from "dotenv";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3000;


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", indexRouter);
app.use(express.static("public"));

app.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
});