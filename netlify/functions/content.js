const fs = require('fs');
const path = require('path');
const https = require('https');

exports.handler = async (event, context) => {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || "242789-crypto/my-portfolio";
    const GITHUB_OWNER = GITHUB_REPO.split('/')[0];
    const REPO_NAME = GITHUB_REPO.split('/')[1];
    const FILE_PATH = "data.json";

    // GET: Fetch content from local file (Netlify includes it in bundle)
    if (event.httpMethod === "GET") {
        try {
            const data = fs.readFileSync(path.join(__dirname, '../../data.json'), 'utf8');
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: data
            };
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: "Failed to read data" }) };
        }
    }

    // POST: Update content via GitHub API
    if (event.httpMethod === "POST") {
        if (!GITHUB_TOKEN) {
            return { statusCode: 500, body: JSON.stringify({ error: "GITHUB_TOKEN not configured in Netlify" }) };
        }

        try {
            const newContent = event.body;

            // 1. Get current file SHA
            const getSha = () => new Promise((resolve, reject) => {
                const options = {
                    hostname: 'api.github.com',
                    path: `/repos/${GITHUB_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
                    headers: {
                        'User-Agent': 'Netlify-Function',
                        'Authorization': `token ${GITHUB_TOKEN}`
                    }
                };
                https.get(options, (res) => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => resolve(JSON.parse(body).sha));
                }).on('error', reject);
            });

            const currentSha = await getSha();

            // 2. Update file
            const updateFile = (sha) => new Promise((resolve, reject) => {
                const data = JSON.stringify({
                    message: "Update data.json via CMS",
                    content: Buffer.from(newContent).toString('base64'),
                    sha: sha
                });

                const options = {
                    hostname: 'api.github.com',
                    method: 'PUT',
                    path: `/repos/${GITHUB_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
                    headers: {
                        'User-Agent': 'Netlify-Function',
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Content-Length': data.length
                    }
                };

                const req = https.request(options, (res) => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => resolve(body));
                });
                req.on('error', reject);
                req.write(data);
                req.end();
            });

            await updateFile(currentSha);

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
