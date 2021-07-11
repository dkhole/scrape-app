import { mapCategories } from './categories';
import { addToListings, injectPageToUrl } from './helpers';
import { scrapeForNumPagesListings, scrapeForTodayListings, scrapeListings, scrapeUrl } from './scrape';

//scrapes first page
export const startSmall = async(url: string) => {
    let listings: string[] = [];
    //scrapes url for listings
	const result: any[] = await scrapeUrl(url, '.user-ad-row-new-design');
    addToListings(result, listings);
    //scrape and process data from each listing
    const data = await scrapeListings(listings);
    mapCategories(data);
    return data;
}
//scrapes today's listings
export const startToday = async(url: string) => {
    //scrape first page for listings seperately as every other page needs 'page-x' in url
    let listings: string[] = [];
    const result: any[] = await scrapeUrl(url, '.user-ad-row-new-design');
    addToListings(result, listings);
    //scrape remainder pages for listings until yesterdays listings begin
    let isToday = true;
    let i = 2;
    console.log("scraping for todays listings");
    while (isToday) {
        const pageUrl = injectPageToUrl(url, `page-${i}`);
        isToday = await scrapeForTodayListings(listings, pageUrl);
        i++;
    }
    //scrape and process data from each listing
    const data = await scrapeListings(listings);
    mapCategories(data);
    return data;
}
//scrapes every listing from url
export const startFull = async() => {
    //get first page listings, second page listings and total num pages. (num pages only shows from page 2)
	const [listings, numPages]: any = await scrapeForNumPagesListings('https://www.gumtree.com.au/s-furniture/waterloo-sydney/c20073l3003798r10?ad=offering');
    //loop through from third page until end of pages
    for(let i = 3; i < numPages; i++) {
        const newUrl = injectPageToUrl('https://www.gumtree.com.au/s-furniture/waterloo-sydney/c20073l3003798r10?ad=offering', `page-${i}`);
        const result: any[] = await scrapeUrl(newUrl, '.user-ad-row-new-design');
        addToListings(result, listings);
    }
    //scrape and process data from each listing
    const data = await scrapeListings(listings);
    mapCategories(data);
    return data;
}