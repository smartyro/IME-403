var globalSiteList = []
var includedSites = '';
var excludedSites = '';

async function getList() {
    console.log('Updating site list...')
    var dataList = []
    var req = await fetch('https://cdn.jsdelivr.net/gh/corbindavenport/shop-list/list.txt').catch(cacheError)
    // Parse data
    var text = await req.text()
    try {
        dataList = text.split('\n')
    } catch (e) {
        console.error('Error parsing shop list:', e)
        return false
    }
    console.log('Loaded site list:', dataList)
    // Save data to storage
    globalSiteList = dataList
    chrome.storage.local.set({
        siteList: dataList
    })
}
