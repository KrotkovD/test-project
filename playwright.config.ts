import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {

  testMatch: '*.spec.ts',
  reporter: [["list"], ["html", { open: "never" }]],
  retries: 1,
  //workers: 3,

  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    browserName: 'chromium', headless: true,
  },

};

export default config;
