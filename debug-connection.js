const dns = require('dns');
const { chromium } = require('playwright');

async function checkDNS() {
    console.log('--- DNS Lookup Check ---');
    try {
        const result = await dns.promises.lookup('localhost', { all: true });
        console.log('DNS Lookup for localhost:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('DNS Lookup failed:', e);
    }
}

async function checkConnection() {
    console.log('\n--- Playwright Connection Check ---');
    try {
        // Launch browser server manually to mimic what we think is happening
        // Or just try to launch a browser and connect to it
        const browser = await chromium.launch({
            headless: true,
            args: ['--remote-debugging-port=9222']
        });
        console.log('Browser launched successfully');

        // Try to connect using localhost
        try {
            console.log('Attempting to connect via localhost:9222...');
            const browser2 = await chromium.connectOverCDP('http://localhost:9222');
            console.log('Success: Connected via localhost');
            await browser2.close();
        } catch (e) {
            console.error('Failed to connect via localhost:', e.message);
        }

        // Try to connect using 127.0.0.1
        try {
            console.log('Attempting to connect via 127.0.0.1:9222...');
            const browser3 = await chromium.connectOverCDP('http://127.0.0.1:9222');
            console.log('Success: Connected via 127.0.0.1');
            await browser3.close();
        } catch (e) {
            console.error('Failed to connect via 127.0.0.1:', e.message);
        }

        await browser.close();
    } catch (e) {
        console.error('Browser launch failed:', e);
    }
}

async function run() {
    await checkDNS();
    await checkConnection();
}

run();
