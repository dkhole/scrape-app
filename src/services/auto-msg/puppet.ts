import { Browser, ElementHandle, Page } from 'puppeteer';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { User } from '.';
import { initStealth } from './stealth';
import { mapCategories } from './mapCategories';

export const initPuppet = async(): Promise<[Browser, Page]> => {
    
    puppeteer.use(StealthPlugin());
    //@ts-ignore
    const browser: Browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    //destructure to avoid creating new tab
    const [page]: Page[] = await browser.pages();

    return [browser, page];
}

export const sendMessage = async(page: Page, user: User, listing: any, message: string) => {
    //apply stealth
     await initStealth(page);
     //go to listing
     await page.goto(listing.url, { waitUntil: 'domcontentloaded' });
     page.setDefaultNavigationTimeout(300000);
     console.log(`🚀   Getting and mapping category   🚀`);
     //load html page
     const content = await page.content();
     const $ = cheerio.load(content);
     //get category
     await page.waitForSelector('.breadcrumbs__separator');
     const breadcrumbs = $('.breadcrumbs__separator');
     const category = breadcrumbs.last().prev();
     //map category
     const mappedCat = mapCategories(category.text());
     if(!mappedCat) {
         console.log('Cant find listing');
         return false;
     }
     //get and add username
     const scrapedName = $('.my-gumtree-menu-button__text');
     //@ts-ignore
     let username = scrapedName[0].children[0].data;
     //add mapped category into message
     console.log(`🚀   Typing and sending   🚀`);
     const addCat = message.replace('$', mappedCat);
     //type message but first check still logged in otherwise log in again
     let addUsername;
     let text = await page.waitForSelector('#input-reply-widget-form-message');
     if(!username) {
         console.log('Error with getting username');
         addUsername = addCat.replace('@', 'furniture');
     } else {
         //if username is my gumtree need to log back in and reload content
         if(username === 'My Gumtree') {
             await login(page, user);
             await page.goto(listing.url, { waitUntil: 'domcontentloaded' });
             const $ = cheerio.load(await page.content());
             const scrapedName = $('.my-gumtree-menu-button__text');
             //@ts-ignore
             username = scrapedName[0].children[0].data;
             text = await page.waitForSelector('#input-reply-widget-form-message');
         }
         addUsername = addCat.replace('@', username);
     }
     //type and send message
     try {
         //@ts-ignore
         await text.click({ clickCount: 3 });
         await page.type('#input-reply-widget-form-message', addUsername);
         //await page.click('#contact-seller-button');
         console.log(`🚀       Sent message        🚀`);
         return true;
     } catch {
         console.log('cant find listing');
         return false;
     }
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