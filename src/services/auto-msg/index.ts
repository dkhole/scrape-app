import { AnyARecord } from 'dns';
import { Browser, Page } from 'puppeteer';
import { initPuppet, login } from './puppet';

type Input = {
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

const loadInput = ({ email, password, listings, message, sleep }: Input): [User, object[], string, number] => {
    const user = { email, password };

    const splitListings = listings.split('\n');
    const listingUrls = splitListings.map((listing: string) => {
        return { url: listing };
    });

    return [user, listingUrls, message, sleep];
}

const startLoop = () => {
    console.log('hello');
}

const errorLogin = async(browser: Browser) => {
    await browser.close();
    throw new Error('Error logging in');
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
        (success) ? startLoop() : await errorLogin(browser);
        
        await browser.close();
    } catch(e) {
        return e.message;
    }

    //type message
    return {user, listingUrls, message, sleep};
}

