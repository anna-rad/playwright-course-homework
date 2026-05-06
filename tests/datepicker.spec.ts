import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'OWNERS' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
})

test('Select the desired date in the calendar', async ({ page }) => {
  await page.getByRole('row', { name: 'Harold Davis' }).getByRole('link').click();
  await page.getByRole('button', { name: 'Add New Pet' }).click();
  await expect(page.locator('#name  ~ .glyphicon-remove')).toBeVisible();
  await page.getByLabel('Name').fill('Tom');
  await expect(page.locator('#name  ~ .glyphicon-ok')).toBeVisible();
  await page.getByRole('button', { name: 'Open calendar' }).click();
  await page.getByRole('button', { name: 'Choose month and year' }).click();
  await page.getByRole('button', { name: 'Previous 24 years' }).click();
  await page.getByRole('button', { name: '2014' }).click();
  await page.getByRole('button', { name: '05 2014' }).click();
  await page.getByRole('button', { name: '2014/05/02' }).click();
  await expect(page.locator('input[name="birthDate"]')).toHaveValue('2014/05/02');
  await page.locator('#type').selectOption("dog");
  await page.getByRole('button', { name: 'Save Pet' }).click();
  const petTomData = page.locator('app-pet-list', { hasText: 'Tom' });
  await expect(petTomData.locator('dt:has-text("Name") + dd')).toHaveText('Tom');
  await expect(petTomData.locator('dt:has-text("Birth Date") + dd')).toHaveText('2014-05-02');
  await expect(petTomData.locator('dt:has-text("Type") + dd')).toHaveText('dog');
  await petTomData.getByRole('button', { name: 'Delete Pet' }).click();
  await expect(petTomData).not.toBeVisible();
});

test('Select the dates of visits and validate dates order', async ({ page }) => {
  await page.getByRole('row', { name: 'Jean Coleman' }).getByRole('link').click();
  const petSamanthaData = page.locator('app-pet-list', { hasText: 'Samantha' });
  await petSamanthaData.getByRole('button', { name: 'Add Visit' }).click();
  await expect(page.getByRole('heading')).toHaveText('New Visit');
  await expect(page.getByRole('row').getByRole('cell').nth(0)).toHaveText('Samantha');
  await expect(page.getByRole('row').getByRole('cell').nth(3)).toHaveText('Jean Coleman');

  //getting current date in the format YYYY/MM/DD and booking visit for that date
  await page.getByRole('button', { name: 'Open calendar' }).click();
  function formatDate(date: Date, separator: string = '/'): string {
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: '2-digit' });
    const day = date.toLocaleString('en-US', { day: '2-digit' });
    return `${year}${separator}${month}${separator}${day}`;
  }
  const today = new Date();
  const currentDateForCalendar = formatDate(today);
  const currentDateForVisit = formatDate(today, '-');
  await page.getByRole('button', { name: currentDateForCalendar }).click();
  await expect(page.locator('input[name="date"]')).toHaveValue(currentDateForCalendar);
  await page.locator('#description').fill('dermatologists visit');
  await page.getByRole('button', { name: 'Add Visit' }).click();
  await expect(petSamanthaData.locator('app-visit-list').getByRole('row').nth(1)).toContainText(currentDateForVisit);

  //getting current date - 45 in the format YYYY/MM/DD and booking visit for that date
  await petSamanthaData.getByRole('button', { name: 'Add Visit' }).click();
  await page.getByRole('button', { name: 'Open calendar' }).click();
  const dateMinus45 = new Date(today);
  dateMinus45.setDate(today.getDate() - 45);
  const dateMinus45ForCalendar = formatDate(dateMinus45);
  const dateMinus45Year = dateMinus45.getFullYear();
  const dateMinus45Month = dateMinus45.toLocaleString('en-US', { month: '2-digit' });
  const dateMinus45ForVisit = formatDate(dateMinus45, '-');
  await page.getByRole('button', { name: 'Choose month and year' }).click();
  await page.getByRole('button', { name: `${dateMinus45Year}` }).click();
  await page.getByRole('button', { name: `${dateMinus45Month} ${dateMinus45Year}` }).click();
  await page.getByRole('button', { name: dateMinus45ForCalendar }).click();
  await page.locator('#description').fill('massage therapy');
  await page.getByRole('button', { name: 'Add Visit' }).click();

  // Get all visit date texts from the visit list and verify descending order
  await petSamanthaData.locator('app-visit-list').getByRole('row').nth(1).waitFor();
  const allVisitDates = await petSamanthaData.locator('app-visit-list').locator('tr td:first-child').allTextContents();
  const dates = allVisitDates.map(text => new Date(text.trim()));
  const isSortedDescending = dates.every(
    (date, i) => i === 0 || dates[i - 1] >= date
  );
  expect(isSortedDescending).toBeTruthy();

  //clean up - delete visits
  await petSamanthaData.locator('app-visit-list').getByRole('row', { name: dateMinus45ForVisit }).getByRole('button', { name: 'Delete Visit' }).click();
  await petSamanthaData.locator('app-visit-list').getByRole('row', { name: currentDateForVisit }).getByRole('button', { name: 'Delete Visit' }).click();
});