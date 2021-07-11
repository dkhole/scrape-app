import $ from 'cheerio';
import fetch from 'node-fetch';
import {mapCategories} from './categories';

const processListing = async (searchResp: any, data: Object[]) => {
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

	data.push({
		name: name.text(),
		location: location.text(),
		category: category.text(),
		category_mapped: '',
		price: price.text(),
		url: searchResp.url,
		profile_url: profileUrl,
		has_number: hasNumber,
	});
};

const addToListings = (result: any[], listings: string[]) => {
    for (let i = 0; i < result.length; i++) {
        listings.push(`https://www.gumtree.com.au${result[i].attribs.href}`);
    }
}

const scrapeUrl = async(url: string, query: string) => {
    //small scrape
    const searchResp = await fetch(url);
    const body = await searchResp.text();
    const result: any = $(query, body);

    return result;
}

const injectPageToUrl = (url: string, page: string) => {
    const pageTwo = url.split('/');
    const temp = pageTwo[pageTwo.length-1];
    pageTwo[pageTwo.length-1] = page;
    pageTwo.push(temp);
    return pageTwo.join('/');
}

const scrapeForNumPagesListings = async(url: string) => {
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

const scrapeForTodayListings = async(listings: string[], url: string) => {
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

const scrapeListings = async (listings: string[]) => {
    const data: Object[] = []
    let promises = [];
    //fetch all listings
    console.log(`getting data from ${listings.length} listings`);
	for (let i = 0; i < listings.length; i++) {
		promises.push(fetch(listings[i]));
	}
    const results = await Promise.all(promises);
    //reuse array
	promises = [];
    console.log("cleaning scraped data");
    //process scraped listings into usable data
	for (let i = 0; i < results.length; i++) {
		promises.push(processListing(results[i], data));
	}
	await Promise.all(promises);
    return data;
}

export const startSmall = async(url: string) => {
    let listings: string[] = [];
	const result: any[] = await scrapeUrl(url, '.user-ad-row-new-design');
    addToListings(result, listings);
    //scrape all listings
    const data = await scrapeListings(listings);
    mapCategories(data);
    //send data
    return data;
}

export const startFull = async() => {
    //get first page listings, second page listings and num pages. (num pages only shows from page 2)
	const [listings, numPages]: any = await scrapeForNumPagesListings('https://www.gumtree.com.au/s-furniture/waterloo-sydney/c20073l3003798r10?ad=offering');

    //loop through from third page until end of pages
    for(let i = 3; i < numPages; i++) {
        const newUrl = injectPageToUrl('https://www.gumtree.com.au/s-furniture/waterloo-sydney/c20073l3003798r10?ad=offering', `page-${i}`);
        const result: any[] = await scrapeUrl(newUrl, '.user-ad-row-new-design');
        addToListings(result, listings);
    }

    //after all listings are gathered, scrape and process them
    const data = await scrapeListings(listings);
    mapCategories(data);
    return data;
}

export const startToday = async(url: string) => {
    //get first page as every other page needs 'page-x' in url
    let listings: string[] = [];
    const result: any[] = await scrapeUrl(url, '.user-ad-row-new-design');
    addToListings(result, listings);

    let isToday = true;
    let i = 2;
    //scrape every page for listings until yesterdays listings begin
    console.log("scraping for todays listings");
    while (isToday) {
        const pageUrl = injectPageToUrl(url, `page-${i}`);
        isToday = await scrapeForTodayListings(listings, pageUrl);
        i++;
    }

    const data = await scrapeListings(listings);
    mapCategories(data);
    //send data
    return data;
}