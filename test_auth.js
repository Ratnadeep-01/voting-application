const axios = require('axios');

async function testAuth() {
    try {
        console.log("Testing Signup...");
        const signupRes = await axios.post('http://localhost:5000/users/signup', {
            name: "Diagnostic User",
            age: 25,
            mobile: "1234567890",
            address: "Diagnostic Address",
            adharCardNumber: "000011112222",
            password: "password123"
        });
        console.log("Signup Success:", signupRes.data.message);
    } catch (err) {
        console.error("Signup Failed:", err.response?.data || err.message);
    }

    try {
        console.log("\nTesting Login...");
        const loginRes = await axios.post('http://localhost:5000/users/login', {
            adharCardNumber: "000011112222",
            password: "password123"
        });
        console.log("Login Success:", loginRes.data.message);
    } catch (err) {
        console.error("Login Failed:", err.response?.data || err.message);
    }
}

testAuth();
