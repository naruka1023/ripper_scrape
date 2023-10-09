import puppeteer from 'puppeteer';
import {  generateCombinations,
          waitForSelectorAsync,
          waitForUserInput,
          scrollDown,
          removeDuplicates
        } from './utils.js';

let jsonData = {};
(async () => {
    let allCombinations = []
    allCombinations = ['personal trainer bangkok', 'gym trainer bangkok', 'bangkok gym']
    // allCombinations = generateCombinations(searchtermMatrix)
    
    const browser = await puppeteer.launch({ headless: false,
      defaultViewport: {
        width:1080,
        height:720
      } });
    
    try {
 
      const context = browser.defaultBrowserContext();
                                  //        URL                  An array of permissions
      context.overridePermissions("https://www.tiktok.com", ["notifications"]);
      const page = await browser.newPage();
      await page.goto(encodeURI(`https://www.tiktok.com`));
      await waitForUserInput('Press Enter to continue...');


      // this is where the scraping begins 
    
    for(let i = 0; i < allCombinations.length; i++){
        let payload = await phase1(page, allCombinations[i], i)
        let value = await phase2(page, payload, allCombinations[i])


        console.log('search term done: ' + i + '/' + allCombinations.length)
    }
  } catch(error){
    console.error('Error Found:', error);
  }
   finally {
    await browser.close();
  }
})();
async function phase1(page, searchTerm){

  await page.goto(encodeURI(`https://www.tiktok.com/search?q=${searchTerm}`));

    await waitForSelectorAsync(page);
    let g = await page.$(".eegew6e0")

    const maxScrolls = 1000; // Adjust this to your desired scroll limit
    let currentScrolls = 0;

    while (currentScrolls < maxScrolls) {
      const result = await scrollDown(page);
      if (!result) {
        break; // Break if there is no more content to scroll
      }
      currentScrolls++;
    }

    let arr= await g.$$eval(
        '.etrd4pu6',
        nodes => nodes.map(n => n.innerText)
      );
      arr = removeDuplicates(arr)
      return arr
      // Add the key-value pair to the JSON object
}
async function phase2(page, payload, searchTerm){
  let innerPayload = payload
  let payloadResult = {}
  let totalPayload = []
  let alreadyexist = 0
  let notexist = 0
  jsonData[searchTerm] = []
  jsonDataDebug[searchTerm] = []
  for(let i = 0; i < innerPayload.length; i++){
    await page.goto(`https://www.tiktok.com/@${innerPayload[i]}`);
    // await waitForUserInput('Press Enter to continue...');
    let parsedStatus = {}
    await page.waitForSelector('.e1vl87hj2 > .e1e9er4e1')
    const imgSrc = await page.$eval('.e1vl87hj2 > .e1e9er4e1', element => element.src);
    const status = await page.$$eval('.e1457k4r1', nodes => nodes.map(n => n.innerText));
    const description = await page.$eval('.e1457k4r3', element => element.innerText);
    const secondaryID = await page.$eval('.ekmpd5l7', element => element.innerText);
    
    status.forEach((s)=>{
      let split = s.split("\n")
      result = 0
      if(split[0].includes('K')){
        result = parseInt(split[0].slice(0, -1)) * 1000
      }else{
        if(split[0].includes('M')){
          result = parseInt(split[0].slice(0, -1)) * 1000000
        }else{
          result = parseInt(split[0])
        }
      }
      parsedStatus[split[1]] = result
    })

    let imageBuffer = await page.goto(imgSrc);
    imageBuffer = await imageBuffer.buffer();
    imageBuffer= imageBuffer.toString('base64')
    const base64String = imageBuffer
    const byteArray = Array.from(base64String).map(char => char.charCodeAt(0));
    payloadResult = 
    {
      search_term: {
        String: searchTerm,
        Valid: true
      },
      type: "PROFILE",
      channel: "TIKTOK",
      ch_id: innerPayload[i],
      ch_url: {
        String: `https://www.tiktok.com/@${innerPayload[i]}`,
        Valid: true
      },
      desc:{
        String: description,
        Valid: true
      },
      name: {
        String: secondaryID,
        Valid: true
      },
      following_count: { Int64: parsedStatus.Following, Valid: true },
      follower_count: { Int64: parsedStatus.Followers, Valid: true },
      like_count: { Int64: parsedStatus.Likes, Valid: true },
      img_format:  { String: "JPEG", Valid: true },
      img: byteArray
    }
    postData = JSON.stringify(payloadResult)
    const options = {
      hostname: 'api.ripper.fit',
      path: '/ingest-entity',
      method: 'POST',
      headers: {
           'Content-Type': 'application/json',
         }
    };
    var req = https.request(options, function(res) {
      console.log(res.statusCode);
      if(res.statusCode == 200){
        notexist++;
        console.log('new: ' + notexist)
      }
      if(res.statusCode == 204){
        alreadyexist++;
        console.log('already exist: ' + alreadyexist)
      }
      jsonData[searchTerm].push(payloadResult)
      console.log('profile ingestion done: ' + i + '/' + innerPayload.length)
    });
    req.write(postData);
    req.end();
    
    req.on('error', function(e) {
        console.error(e);
      });
      //  new = 9 exist =62
    totalPayload.push(payloadResult)
  }
  return totalPayload
}

