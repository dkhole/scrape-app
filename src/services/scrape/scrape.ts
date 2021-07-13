import $ from 'cheerio';
import fetch from 'node-fetch';
import { addToListings, injectPageToUrl } from './helpers';

export const scrapeUrl = async(url: string, query: string) => {
    const searchResp = await fetch(url);
    const body = await searchResp.text();
    const result: any = $(query, body);
    return result;
}

export const processListing = async (searchResp: any) => {
	const bodys = await searchResp.text();
	const name = $('.seller-profile__name', bodys);
	const breadcrumbs = $('.breadcrumbs__separator', bodys);
	const price = $('.user-ad-price__price', bodys);
	const profile: any = $('.seller-profile', bodys);
    let profileUrl = '';
    
    profile[0] === undefined ? profileUrl = 'Cant find' : profileUrl = `https://www.gumtree.com.au${profile[0].attribs.href}`

	const number = $('.reveal-phone-number', bodys);
	let hasNumber: boolean;

	number.length > 0 ? (hasNumber = true) : (hasNumber = false);

	const location = breadcrumbs.next();
	const category = breadcrumbs.last().prev();

	return {
		name: name.text(),
		location: location.text(),
		category: category.text(),
		category_mapped: '',
		price: price.text(),
		url: searchResp.url,
		profile_url: profileUrl,
		has_number: hasNumber,
	};
};

export const scrapeForNumPagesListings = async(url: string) => {
    //get page 1
    let listings: string[] = []
    const result: any = await scrapeUrl(url, '.user-ad-row-new-design');
    addToListings(result, listings);

    //inject page 2 into url to get page 2 url
    const twoUrl = injectPageToUrl(url, 'page-2');
    
    //add result to listings
    const resultTwo: any = await scrapeUrl(twoUrl, '.user-ad-row-new-design');
    addToListings(resultTwo, listings);

    const pagesData = await scrapeUrl(twoUrl, '.breadcrumbs__summary--enhanced');
    const numPages = pagesData.text();
    const intPages: number = parseInt(numPages.substring(numPages.length - 3, numPages.length - 1));
    return [listings, intPages];
}

export const scrapeForTodayListings = async(listings: string[], url: string) => {
    const searchResp = await fetch(url);
	const body = await searchResp.text();

	const result: any = $('.user-ad-row-new-design', body);
	const times: any = $('.user-ad-row-new-design__age', body);

	for (let i = 0; i < result.length; i++) {
		listings.push(`https://www.gumtree.com.au${result[i].attribs.href}`);
		if (!result[i].attribs['aria-describedby'].includes('TOP')) {
			if (!times[i].children[0].data.includes('ago')) {
				return false;
			}
		}
	}
	return true;
}

export const scrapeListings = async (listings: string[]) => {
    const fetchPromises = [];
	const processPromises = [];
    //fetch all listings
    console.log(`getting data from ${listings.length} listings`);
	for (let i = 0; i < listings.length; i++) {
		fetchPromises.push(fetch(listings[i]));
	}
    const results = await Promise.all(fetchPromises);
    //process scraped listings into usable data
	for (let i = 0; i < results.length; i++) {
		processPromises.push(await processListing(results[i]));
	}
	const data = await Promise.all(processPromises);
    return data;
}