import express from "express";

const app = express();

app.listen(3000, "localhost", () => {
	console.log(`Server is running at http://localhost:3000`);
})
