import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = path.join("user-info.json");

// Helper: Read users
function getUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}

// Helper: Write users
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// --------------------- SIGNUP API ---------------------
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const users = getUsers();

    const exists = users.find(u => u.email === email);
    if (exists) {
        return res.status(400).json({ message: "Email already registered" });
    }

    users.push({ name, email, password });
    saveUsers(users);

    res.json({ message: "Signup successful!" });
});


// --------------------- LOGIN API ---------------------
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);

    if (!found) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login success", user: found });
});


// --------------------- SERVER ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
