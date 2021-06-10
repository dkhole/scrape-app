import $ from 'cheerio';
import fetch from 'node-fetch';

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
	let hasNumber;

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

const mapCategories = (posts: any) => {
    posts.map((post: any) => {
        switch (post.category) {
            case "Beds":
                post.category_mapped = "beds";
                break;
            case "Sofas":
                post.category_mapped = "sofas";
                break;
            case "Dining Tables":
                post.category_mapped = "dining tables";
                break;
            case "Other Furniture":
                post.category_mapped = "similar items";
                break;
            case "Coffee Tables":
                post.category_mapped = "coffee tables";
                break;
            case "Cabinets":
                post.category_mapped = "cabinets";
                break;
            case "Desks":
                post.category_mapped = "desks";
                break;
            case "Entertainment & TV Units":
                post.category_mapped = "TV Units";
                break;
            case "Dining Chairs":
                post.category_mapped = "dining chairs";
                break;
            case "Bookcases & Shelves":
                post.category_mapped = "bookcases & shelves";
                break;
            case "Armchairs":
                post.category_mapped = "armchairs";
                break;
            case "Dressers & Drawers":
                post.category_mapped = "dressers & drawers";
                break;
            case "Buffets & Side Tables":
                post.category_mapped = "buffets & side tables";
                break;
            case "Stools & Bar stools":
                post.category_mapped = "stools & bar stools";
                break;
            case "Mirrors":
                post.category_mapped = "mirrors";
                break;
            case "Bedside Tables":
                post.category_mapped = "bedside tables";
                break;
            case "Office Chairs":
                post.category_mapped = "office chairs";
                break;
            case "Wardrobes":
                post.category_mapped = "wardrobes";
                break;
        }
    });
}

export const startSmall = async() => {
    const searchResp = await fetch('https://www.gumtree.com.au/s-furniture/waterloo-sydney/c20073l3003798r10?ad=offering');
	const body = await searchResp.text();
    const result: any = $('.user-ad-row-new-design', body);

    //holds url for listings to scrape
    const listings: string[] = [];
    //holds data scraped from listings
    const data: Object[] = [];

    //convert fetched data into url and push into listings
    for (let i = 0; i < result.length; i++) {
		listings.push(`https://www.gumtree.com.au${result[i].attribs.href}`);
	}
	
    //scrape all listings
    let promises = [];
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

    mapCategories(data);
    //send data
    return data;
}

const startToday = async() => {

}