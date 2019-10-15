let actions = require("./tab3.spec-actions");

let browser = null;

let puppeteer = require("puppeteer")

let applicationPage = null;

beforeAll(async () => {
    browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9224' })
    page = await browser.newPage();
    await page.goto("http://www.google.com",
        { waitUntil: "networkidle2" }
    );
});
afterAll(async () => {
    browser.close();
});
test("Page Title Match", async () => {
    const title = await page.title();
    console.log('title', title);
    expect(title).toBeDefined()
});
test("gets existing page", async () => {
    await actions.getApplicationPage();
})
test("creates new habit", async () => {
    await actions.createNewHabit();
})
