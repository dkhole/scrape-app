export const addToListings = (result: any[], listings: string[]) => {
    for (let i = 0; i < result.length; i++) {
        listings.push(`https://www.gumtree.com.au${result[i].attribs.href}`);
    }
}

export const injectPageToUrl = (url: string, page: string) => {
    const pageTwo = url.split('/');
    const temp = pageTwo[pageTwo.length-1];
    pageTwo[pageTwo.length-1] = page;
    pageTwo.push(temp);
    return pageTwo.join('/');
}