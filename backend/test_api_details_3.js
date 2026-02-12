const https = require('https');

// Helper to fetch JSON
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

const url = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard';

async function run() {
    try {
        const data = await fetchJson(url);
        const calendar = data.leagues?.[0]?.calendar;

        if (calendar) {
            const now = new Date();
            const upcoming = calendar.filter(e => new Date(e.endDate) >= now).slice(0, 1);

            for (const item of upcoming) {
                if (item.event && item.event.$ref) {
                    // Convert internal PVT url to public API
                    let refUrl = item.event.$ref.replace('http://sports.core.api.espn.pvt', 'https://sports.core.api.espn.com');

                    try {
                        const details = await fetchJson(refUrl);

                        // Check courses
                        if (details.courses && details.courses.length > 0) {
                            console.log('First Course Object:', JSON.stringify(details.courses[0], null, 2));
                        }

                        // Check if venue is elsewhere
                        if (details.competitions?.[0]?.venue) {
                            console.log('Venue:', JSON.stringify(details.competitions[0].venue, null, 2));
                        }

                    } catch (e) {
                        console.error('Error fetching details:', e.message);
                    }
                }
            }
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

run();
