import express from "express";

import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { mapJobs } from "../utils/jobmapper.js";

dotenv.config();

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));



const API_URL = "https://serpapi.com/search.json";
const API_KEY = process.env.API_KEY;

let lastJobResults = [];
let savedJobs = [];
let saved = true;

router.get("/", (req, res) => {
	res.render("home.ejs");
});

router.get("/search", async(req,res) => {
	try {
		console.log("Query params:", req.query);
		const { q, id } = req.query;

		let jobList = [];

		if (q) {
			const result = await axios.get(API_URL, {
			params: {
				engine: "google_jobs",
				q,
				api_key: API_KEY,
			},
			});

			const jobs = result.data.jobs_results || [];
			jobList = mapJobs(jobs);
			console.log(jobList);
			lastJobResults = jobList;

		}
		else {
			jobList = lastJobResults;
		}

		let selectedJob = null;
		if (id) {
		selectedJob = jobList.find((j) => j.id === id);
		}

		res.render("home.ejs", {
		jobs: jobList,
		selectedJob,
		savedJobs,
		currentRoute: "search",
    });
  	} 
	catch (error) {
		console.error("Error:", error.message);
		res.status(500).send("Server Error");
	}
});


router.post("/save", (req, res) => {
	const { id, from } = req.body;

	const jobToSave = lastJobResults.find((j) => j.id === id);

	if (jobToSave) {
		const index = savedJobs.findIndex((j) => j.id === id);

		if (index === -1) {
			savedJobs.push(jobToSave);
		} else {
			savedJobs.splice(index, 1); 
		}
	}

	console.log("Saved Jobs:", savedJobs);

	
	if (from === "saved") {
		res.redirect("/saved"); 
	} else {
		res.redirect(`/search?id=${id}`); 
	}
});



router.get("/saved", (req, res) => {
	const { id } = req.query;

	let selectedJob = null;
	if (id) {
		selectedJob = savedJobs.find((j) => j.id === id);
	}

	res.render("home.ejs", {
    jobs: savedJobs,
    selectedJob,
    savedJobs,
    currentRoute: "saved",
  });
});



export default router;