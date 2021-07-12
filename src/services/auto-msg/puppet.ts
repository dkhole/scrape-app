import { Browser, ElementHandle, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { User } from '.';

export const initPuppet = async(): Promise<[Browser, Page]> => {
    
    puppeteer.use(StealthPlugin());
    //@ts-ignore
    const browser: Browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    //destructure to avoid creating new tab
    const [page]: Page[] = await browser.pages();

    return [browser, page];
}

export const login = async(page: Page, user: User): Promise<boolean> => {
    await page.goto('https://www.gumtree.com.au/t-login-form.html', { waitUntil: 'domcontentloaded' });
    console.log('🚀   Entering email   🚀');
    await page.waitForSelector('#login-email');
    await page.type('#login-email', user.email);
    console.log('🚀   Entering password   🚀');
    await page.type('#login-password', user.password);
    console.log('🚀   Logging in   🚀');

    //page somtimes freezes after logging in so catch statement and try again if it does
    //can potentially create infinite loop
    try {
        await page.click('#btn-submit-login');
        await page.waitForNavigation();
        console.log(page.url());
        if(page.url() === 'https://www.gumtree.com.au/t-login.html') {
            return false;
        } else {
            return true;
        }
    } catch {
        await login(page, user);
    }

    return false;
}