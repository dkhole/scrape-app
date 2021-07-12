import { Browser } from "puppeteer";
import { Input, User } from ".";

export const errorLogin = async(browser: Browser) => {
    await browser.close();
    throw new Error('Error logging in');
}

export const loadInput = ({ email, password, listings, message, sleep }: Input): [User, object[], string, number] => {
    const user = { email, password };

    const splitListings = listings.split('\n');
    const listingUrls = splitListings.map((listing: string) => {
        return { url: listing };
    });

    return [user, listingUrls, message, sleep];
}

export const initSleep = async(ms: number) => {
    console.log(`🚀     sleeping for ${ms} mins     🚀`);
    return new Promise((resolve) => {
        setTimeout(resolve, ms * 60000);
    });
}