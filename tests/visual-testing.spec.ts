import { test, expect } from '@playwright/test';

test('Visual testing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'OWNERS' }).click();
    await page.getByRole('link', { name: 'Add New' }).click();
    await expect(page.getByRole('heading')).toHaveText('New Owner');
    await expect(page).toHaveScreenshot('new-owner-empty.png');
    await page.locator('#firstName').fill ('Sully');
    await page.locator('#lastName').fill ('Snow');
    await page.locator('#address').fill ('766 Burlington Street East');
    await page.locator('#city').fill ('Toronto');
    await page.locator('#telephone').fill ('1093847367');
    await expect(page).toHaveScreenshot('new-owner-filled.png');
});