import app from "./app";

const port = process.env.PORT || 5965;

app.listen(port);
console.log(`Server listen on port ${port}`);

// HOST=localhost
// USER=postgres
// PASSWORD=user
// DATABASE=instarecibo_db
