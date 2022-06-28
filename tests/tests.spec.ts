import {expect, Locator, request, Request, test} from "@playwright/test";
import {TEST_LOCATORS} from "./test.locators";
import {TEST_CONST} from "../test-data/constants";

const BASE_URL = 'https://tryzero.com/';
const REQUEST_URL = 'https://api.hsforms.com/submissions/v3/integration/submit/';

test.describe('Tests', async () => {

    test.beforeEach(async ({page}) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('load');
    });

    test.describe('negative tests', async () => {

        test.describe('Name input tests', async () => {

            test('Numbers', async ({page}) => {
                await page.waitForSelector(TEST_LOCATORS.subsriptionForm);
                await page.locator(TEST_LOCATORS.inputName).fill('123456');
                await page.locator(TEST_LOCATORS.inputEmail).click();
                await expect(page.locator(`${TEST_LOCATORS.warningLabel}:has-text('${TEST_CONST.nameInputWarningText}')`)).toBeVisible();
            });

            test('Special symbols', async ({page}) => {
                await page.waitForSelector(TEST_LOCATORS.subsriptionForm);
                await page.locator(TEST_LOCATORS.inputName).fill('qwerty!"№%:,');
                await page.locator(TEST_LOCATORS.inputEmail).click();
                await expect(page.locator(`${TEST_LOCATORS.warningLabel}:has-text('${TEST_CONST.nameInputWarningText}')`)).toBeVisible();
            });

            test('Cyrillic letters', async ({page}) => {
                await page.waitForSelector(TEST_LOCATORS.subsriptionForm);
                await page.locator(TEST_LOCATORS.inputName).fill('йцуке');
                await page.locator(TEST_LOCATORS.inputEmail).click();
                await expect(page.locator(`${TEST_LOCATORS.warningLabel}:has-text('${TEST_CONST.nameInputWarningText}')`)).toBeVisible();
            });

            //Тест для проверки работы скриншотов и трейсов в отчете
            test('Test for trace and screenshot', async ({page}) => {
                await page.waitForSelector(TEST_LOCATORS.subsriptionForm);
                await page.locator(TEST_LOCATORS.inputName).fill('йцуке');
                await page.locator(TEST_LOCATORS.inputEmail).click();
                await expect(page.locator(`${TEST_LOCATORS.warningLabel}:has-text('${TEST_CONST.emailInputWarningText}')`)).toBeVisible();
                await expect(page.locator(`${TEST_LOCATORS.warningLabel}:has-text('${TEST_CONST.nameInputWarningText}')`)).toBeVisible();
            });
        });

        test.describe('Email input tests', async () => {

            test('Dot at the start of email', async ({page}) => {
                await page.waitForSelector(TEST_LOCATORS.subsriptionForm);
                await page.locator(TEST_LOCATORS.inputEmail).fill('.qwe@test.test');
                await page.locator(TEST_LOCATORS.inputName).click();
                await expect(page.locator(`${TEST_LOCATORS.warningLabel}:has-text('${TEST_CONST.emailInputWarningText}')`)).toBeVisible();
            });

            test('Dot at the end of local name', async ({page}) => {
                await page.waitForSelector(TEST_LOCATORS.subsriptionForm);
                await page.locator(TEST_LOCATORS.inputEmail).fill('qwerty.@test.test');
                await page.locator(TEST_LOCATORS.inputName).click();
                await expect(page.locator(`${TEST_LOCATORS.warningLabel}:has-text('${TEST_CONST.emailInputWarningText}')`)).toBeVisible();
            });

            test('without domen', async ({page}) => {
                await page.waitForSelector(TEST_LOCATORS.subsriptionForm);
                await page.locator(TEST_LOCATORS.inputEmail).fill('qwe@test');
                await page.locator(TEST_LOCATORS.inputName).click();
                await expect(page.locator(`${TEST_LOCATORS.warningLabel}:has-text('${TEST_CONST.emailInputWarningText}')`)).toBeVisible();
            });

            test('without @', async ({page}) => {
                await page.waitForSelector(TEST_LOCATORS.subsriptionForm);
                await page.locator(TEST_LOCATORS.inputEmail).fill('123test.test');
                await page.locator(TEST_LOCATORS.inputName).click();
                await expect(page.locator(`${TEST_LOCATORS.warningLabel}:has-text('${TEST_CONST.emailInputWarningText}')`)).toBeVisible();
            });
        });
    });

    test.describe('positive tests', async () => {

        test.only('check request data', async ({page}) => {
            await page.waitForSelector(TEST_LOCATORS.subsriptionForm);
            await page.locator(TEST_LOCATORS.inputName).fill('qwerty');
            await page.locator(TEST_LOCATORS.inputEmail).fill('test@test.test');
            const [request] = await Promise.all([
                page.waitForRequest(request => request.url().includes(REQUEST_URL)),
                page.locator(TEST_LOCATORS.submitBtn).click()
            ]);
            const credentials = request.postData();
            await expect(credentials).toContain('"name":"email","value":"test@test.test"');
            await expect(credentials).toContain('"name":"name","value":"qwerty"');
        });

        test.describe('check animation', async () => {
            let animationElement: Locator;

            test.beforeEach(async ({ page }) => {
                animationElement = await page.locator(TEST_LOCATORS.animationElement);
            });

            test('element has css animation property', async ({ page }) => {
                const cssAnimation = await animationElement.evaluate((element) => {
                    return window.getComputedStyle(element).getPropertyValue('animation-name');
                });
                await expect(cssAnimation).toBeDefined();
            });

            test('element changes styles', async ({ page }) => {
                const transformValues = [];

                for (let i = 0; i < 5; i++) {
                    if (i !== 0) await page.waitForTimeout(500);
                    const value = await animationElement.evaluate((element) => {
                        return window.getComputedStyle(element).getPropertyValue('transform')
                    });
                    transformValues.push(value);
                }
                const uniqueValues = new Set(transformValues);
                await expect(uniqueValues.size).toEqual(transformValues.length)
            });
        });
    });
});