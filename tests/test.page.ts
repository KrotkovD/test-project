import {Page} from "@playwright/test";

const BASE_URL = 'https://tryzero.com/';


export class BaseActions {

    constructor(protected readonly page: Page) {}

    public async openBaseUrl(): Promise<void> {
        await this.page.goto(BASE_URL);
        await this.page.waitForLoadState('domcontentloaded');
    }
}