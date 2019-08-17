describe('Google', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8100/');
    });

    it('should be titled "Habit Camp"', async () => {
        await expect(page.title()).resolves.toMatch('Habit Camp');
    });

    it('should show toast when there are no habits', async () => {
        await expect(page.title()).resolves.toMatch('Habit Camp');
        await page.waitForSelector('#toolbar', { timeout: 100000 })
        await page.waitForSelector('#tabs', { timeout: 100000 })
        await page.waitForSelector('#toast', { timeout: 100000 })
        // await expect(page).toMatchElement('.toast-message', { timeout: 100000 })

        // await page.waitForSelector('.inner-scroll', { timeout: 100000 })
        // await jestPuppeteer.debug()

    });

    it('navigates to the creation page', async () => {
        await expect(page).toClick('#create')
        await page.waitForSelector('#form-list', { timeout: 100000 })
    });

    it('done button is disabled', async () => {
        await expect(page).toClick('#create')
        let d = await page.waitForSelector('#done', { timeout: 100000 })
        let r = await GetProperty(d, 'disabled')
        expect(r).toBe(true)
    });

    it('done button is enabled when form is valid', async () => {
        await expect(page).toClick('#create')
        await page.click('#name')
        await page.type("#name", 'a')
        let d = await page.waitForSelector('#done', { timeout: 100000 })
        let r = await GetProperty(d, 'disabled')
        expect(r).toBe(false)
    });

    it('creates a daily habit', async () => {
        await expect(page).toClick('#create')
        await page.click('#name')
        await page.type("#name", 'a')
        await page.click('#done')
        await page.waitForSelector('#task-list', { timeout: 100000 })
        await page.waitForSelector('#task', { timeout: 100000 })
    });

});

async function GetProperty(element, property) {
    return await (await element.getProperty(property)).jsonValue();
}
