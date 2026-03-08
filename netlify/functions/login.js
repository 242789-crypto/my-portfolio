exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { username, password } = JSON.parse(event.body);

        // Simple auth using environment variables or hardcoded for now
        // Recommendation: In Netlify UI, set ADMIN_USER and ADMIN_PASS
        const validUser = process.env.ADMIN_USER || "admin";
        const validPass = process.env.ADMIN_PASS || "waleed123";

        if (username === validUser && password === validPass) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ success: true, token: "fake-jwt-token" })
            };
        } else {
            return {
                statusCode: 401,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ success: false, message: "Invalid credentials" })
            };
        }
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
    }
};
