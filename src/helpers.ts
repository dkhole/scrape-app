import $ from 'cheerio';
import fetch from 'node-fetch';
import {mapCategories} from './categories';

const processListing = async (searchResp: any, data: Object[]) => {
	const bodys = await searchResp.text();
	const name = $('.seller-profile__name', bodys);
	const breadcrumbs = $('.breadcrumbs__separator', bodys);
	const price = $('.user-ad-price__price', bodys);
	const profile: any = $('.seller-profile', bodys);
	const profileUrl = `https://www.gumtree.com.au${profile[0].attribs.href}`;

	if (profileUrl === undefined) {
		console.log(profile);
		console.log(searchResp.url);
	}

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

const scrapeForListings = async(url: string) => {
    const listings: string[] = [];
    //small scrape
    const searchResp = await fetch(url);
    const body = await searchResp.text();
    const result: any = $('.user-ad-row-new-design', body);

    //convert fetched data into url and push into listings
    for (let i = 0; i < result.length; i++) {
        listings.push(`https://www.gumtree.com.au${result[i].attribs.href}`);
    }
    
    return listings;
}

const scrapeForNumPagesListings = async(url: string) => {
    const listings: string[] = [];

    //get page 1
    const searchResp = await fetch(url);
    const body = await searchResp.text();
    const result: any = $('.user-ad-row-new-design', body);

    //convert fetched data into url and push into listings
    for (let i = 0; i < result.length; i++) {
        listings.push(`https://www.gumtree.com.au${result[i].attribs.href}`);
    }

    //get page 2 and numpages pref using url
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
	for (let i = 0; i < listings.length; i++) {
		promises.push(fetch(listings[i]));
	}
    const results = await Promise.all(promises);
    //reuse array
	promises = [];

    //process scraped listings into usable data
	for (let i = 0; i < results.length; i++) {
		promises.push(processListing(results[i], data));
	}
	await Promise.all(promises);
    return data;
}

export const startSmall = async() => {
	const listings: string[] = await scrapeForListings('https://www.gumtree.com.au/s-furniture/waterloo-sydney/c20073l3003798r10?ad=offering');
    //scrape all listings
    const data = await scrapeListings(listings);
    mapCategories(data);
    //send data
    return data;
}

export const startFull = async() => {
    //get 
	const listings: string[] = await scrapeForListings('https://www.gumtree.com.au/s-furniture/waterloo-sydney/c20073l3003798r10?ad=offering');
    //get first page, second page and number of pages
    
    //scrape all listings
    const data = await scrapeListings(listings);
    mapCategories(data);
    //send data
    return data;
}

export const startToday = async() => {
    //get first page as every other page needs 'page-x' in url
	const listings = await scrapeForListings('https://www.gumtree.com.au/s-furniture/waterloo-sydney/c20073l3003798r10?ad=offering');

    let isToday = true;
    let i = 1;
    //scrape every page for listings until yesterdays listings begin
    while (isToday) {
        isToday = await scrapeForTodayListings(listings, `https://www.gumtree.com.au/s-furniture/waterloo-sydney/page-${i}/c20073l3003798r10?ad=offering`);
        i++;
    }

    const data = await scrapeListings(listings);
    mapCategories(data);
    //send data
    return data;
}