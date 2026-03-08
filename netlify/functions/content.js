const https = require('https');

// Helper to make a GitHub API request
function githubRequest(method, path, token, body = null) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'api.github.com',
            method: method,
            path: path,
            headers: {
                'User-Agent': 'Netlify-Function',
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {})
            }
        };
        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', chunk => responseBody += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(responseBody) }); }
                catch (e) { resolve({ status: res.statusCode, body: responseBody }); }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

exports.handler = async (event, context) => {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || "242789-crypto/my-portfolio";
    const FILE_PATH = "data.json";
    const API_PATH = `/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;

    // ─── GET: Read data.json from GitHub ───────────────────────────────────────
    if (event.httpMethod === "GET") {
        if (!GITHUB_TOKEN) {
            return { statusCode: 500, body: JSON.stringify({ error: "GITHUB_TOKEN not configured" }) };
        }
        try {
            const result = await githubRequest('GET', API_PATH, GITHUB_TOKEN);
            if (result.status !== 200) {
                return { statusCode: result.status, body: JSON.stringify({ error: "Failed to fetch from GitHub" }) };
            }
            // GitHub encodes file content in base64
            const content = Buffer.from(result.body.content, 'base64').toString('utf8');
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: content
            };
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
        }
    }

    // ─── POST: Update data.json via GitHub API ──────────────────────────────────
    if (event.httpMethod === "POST") {
        if (!GITHUB_TOKEN) {
            return { statusCode: 500, body: JSON.stringify({ error: "GITHUB_TOKEN not configured" }) };
        }
        try {
            const newContent = event.body;

            // 1. Get current file SHA
            const fileResult = await githubRequest('GET', API_PATH, GITHUB_TOKEN);
            if (fileResult.status !== 200) {
                return { statusCode: 500, body: JSON.stringify({ error: "Could not get current file SHA" }) };
            }
            const currentSha = fileResult.body.sha;

            // 2. Update the file
            const updateResult = await githubRequest('PUT', API_PATH, GITHUB_TOKEN, {
                message: "Update data.json via CMS",
                content: Buffer.from(newContent).toString('base64'),
                sha: currentSha
            });

            if (updateResult.status !== 200 && updateResult.status !== 201) {
                return { statusCode: 500, body: JSON.stringify({ error: "Failed to update GitHub file", details: updateResult.body }) };
            }

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Content updated successfully via GitHub" })
            };
        } catch (error) {
            return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }
    }

    return { statusCode: 405, body: "Method Not Allowed" };
};
