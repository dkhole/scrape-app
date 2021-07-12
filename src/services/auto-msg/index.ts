import { Browser, Page } from 'puppeteer';
import { errorLogin, initSleep, loadInput } from './helpers';
import { initPuppet, login, sendMessage } from './puppet';

export type Input = {
    email: string;
    password: string;
    listings: string;
    message: string;
    sleep: number;
};

export type User = {
    email: string;
    password: string;
}

const startLoop = async(page: Page, user: User, listingUrls: object[], message: string, sleep: number) => {
    //loop through listings
    for(let i = 0; i < listingUrls.length; i++) {
        //send message from user
        await sendMessage(page, user, listingUrls[i], message);
        //sleep
        await initSleep(sleep);
    }
}

export const launch = async(data: Input) => {
    //load input files
    const [user, listingUrls, message, sleep]: [ User,  object[],  string,  number] = loadInput(data);//login to gumtree

    try {
        //start puppeteer and load plugin
        const [browser, page]: [Browser, Page] = await initPuppet();
        //login
        const success = await login(page, user);
        //check login success
        (success) ? await startLoop(page, user, listingUrls, message, sleep) : await errorLogin(browser);
        
        await browser.close();
    } catch(e) {
        return e.message;
    }

    //type message
    return {user, listingUrls, message, sleep};
}

