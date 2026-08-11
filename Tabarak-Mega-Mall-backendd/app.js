const express = require('express');
const cors = require('cors'); // <--- 1. Import cors

const app = express();

// <--- 2. Enable CORS for ALL origins (Sabse simple fix)
app.use(cors()); 

// Ya agar specific origins allow karni hain toh:
// app.use(cors({ origin: '*' }));

app.use(express.json());