module.exports = {
    createNewHabit: async function(page) {
        await page.waitForSelector('#add')
        await page.click('#add')
    }
}
