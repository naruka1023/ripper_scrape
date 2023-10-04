const puppeteer = require('puppeteer');
const readline = require('readline');
const https = require('https')
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



const filePath = 'scrapedData.json';
const filePathDebug = 'scrapedData-debug.json';

// Read the JSON file (or create an empty object if the file doesn't exist)
let jsonData = {};
(async () => {
    const searchtermMatrix = [
      ['gym', 'Track and Field', 'Boxing', 'Wrestling', 'Judo', 'Taekwondo', 'Karate', 'Muay Thai', 'Kickboxing', 'Brazillian Jiu Jutsu', 'Fencing', 'MMA', 'Krav Maga', 'Tennis', 'Table Tennis', 'Badminton', 'Squash', 'Racquetball', 'Padel', 'Swimming', 'Diving', 'Surfing', 'Windsurfing', 'Kite Surfing', 'Wakeboarding', 'Paddleboarding', 'Canoe', 'Sailing', 'Water Polo', 'Mountain Biking', 'BMX', 'Cyclocross', 'Gravel', 'Dressage', 'Polo', 'Trail Riding', 'Gymkhana', 'Darts', 'Billiards', 'Pool', 'Snooker', 'Bowling', 'Weightlifting', 'Bodybuilding', 'Calisthenics', 'HIIT', 'Pilates', 'Aerobics', 'Skydiving', 'Rock Climbing', 'Mountaineering', 'White-water Rafting', 'Caving', 'Paragliding', 'Hang Gliding', 'Skateboarding', 'Free Diving', 'Highlining', 'Parkour', 'Sandboarding', 'Ballroom Dancing', 'Latin Dancing', 'Tango', 'Salsa', 'Ballet', 'Contemporary', 'Hip-Hop', 'Shuffling', 'Football', 'Basketball', 'Baseball', 'Cricket', 'Hockey', 'Rugby', 'Volleyball', 'Lacrosse', 'Chess', 'Golf'],
      ['trainer', 'coach'],
      ['bangkok', 'kuala lumpur']]
      
    let allCombinations = []
    allCombinations = ['personal trainer bangkok', 'gym trainer bangkok']
    // allCombinations = generateCombinations(searchtermMatrix)
    // allCombinations.splice(0,2)
    
    const browser = await puppeteer.launch({ headless: false,
      defaultViewport: {
        width:1080,
        height:720
      } });
    
    try {
 
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      jsonData = JSON.parse(fileContent);

      const fileContentDebug = fs.readFileSync(filePathDebug, 'utf-8');
      jsonDataDebug = JSON.parse(fileContentDebug);
      const context = browser.defaultBrowserContext();
                                  //        URL                  An array of permissions
      context.overridePermissions("https://www.tiktok.com", ["notifications"]);
      const page = await browser.newPage();
      await page.goto(encodeURI(`https://www.tiktok.com`));
      // page.waitForSelector('.efna91q2')
      // const loginButton = await page.$('.efna91q2')
      
      // loginButton.click(),
      // await page.waitForSelector('[data-list-item-value="email/username"]')
      // emailButton = await page.$('[data-list-item-value="email/username"]')
      // emailButton.click()
      
      // await page.waitForSelector('[name="username"]')

      // username = await page.$('[name="username"]')
      // await username.type('p.muangsaen@gmail.com', {delay: 100})
      // password = await page.$('.tiktok-15cv7mx-InputContainer')
      // await password.type('W0rld0fw@rcr@ft1!', {delay: 100})
      // signInButton = await page.$('[data-e2e="login-button"]')
      // signInButton.click()
      await waitForUserInput('Press Enter to continue...');


      // this is where the scraping begins 
    
    for(let i = 0; i < allCombinations.length; i++){
        let payload = await phase1(page, allCombinations[i], i)
        let value = await phase2(page, payload, allCombinations[i])
        jsonData[allCombinations[i]] = value;
        value = value.map((v)=>{
          let newValue = v;
          delete newValue.img
          return newValue
        })
        jsonDataDebug[allCombinations[i]] = value

        // Convert the JSON object back to a JSON string
        const jsonStringDebug = JSON.stringify(jsonDataDebug, null, 2); // The '2' adds indentation for better readability

        // Write the JSON string back to the file
        fs.writeFileSync(filePathDebug, jsonStringDebug);

        const jsonString = JSON.stringify(jsonData, null, 2);

        fs.writeFileSync(filePath, jsonString);

        console.log('search term done: ' + i + '/' + allCombinations.length)
    }
  } catch(error){
    console.error('Error Found:', error);
  }
   finally {
    await browser.close();
  }
})();

function generateCombinations(arrays) {
  let combinations = [];

  function backtrack(currentCombination, arrayIndex) {
    if (arrayIndex === arrays.length) {
      combinations.push(currentCombination.slice()); // Add a copy of the current combination to the result
      return;
    }

    for (const item of arrays[arrayIndex]) {
      currentCombination.push(item);
      backtrack(currentCombination, arrayIndex + 1);
      currentCombination.pop(); // Backtrack
    }
  }

  backtrack([], 0);
  combinations = combinations.map((value)=>{
    return value.join(' ')
  })
  return combinations;
}

async function phase1(page, searchTerm, index){

  await page.goto(encodeURI(`https://www.tiktok.com/search?q=${searchTerm}`));

    // Wait for search results to load (you may need to adjust the selector)
    // if(index == 0){
    //   await waitForUserInput('Press Enter to continue...');
    // }
    // await page.waitForSelector('.e19c29qe10');
    await waitForSelectorAsync(page);
    let g = await page.$(".eegew6e0")

    const maxScrolls = 100; // Adjust this to your desired scroll limit
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
  for(let i = 0; i < innerPayload.length; i++){
    await page.goto(`https://www.tiktok.com/@${innerPayload[i]}`);
    // await waitForUserInput('Press Enter to continue...');
    let parsedStatus = {}
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
      console.log('profile ingestion done: ' + i + '/' + innerPayload.length)
    });
    req.write(postData);
    req.end();
    
    req.on('error', function(e) {
        console.error(e);
      });
    totalPayload.push(payloadResult)
  }
  return totalPayload
}

function removeDuplicates(arr) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}


async function waitForSelectorAsync(page) {
  // Simulate an asynchronous operation that may result in a timeout error
  return new Promise((resolve, reject) => {
    page.waitForSelector('.e19c29qe10').then(()=>{
      resolve()
    }).catch(()=>{
      reject()
    });
  });
};

async function waitForUserInput(prompt) {
    return new Promise((resolve) => {
      rl.question(prompt, () => {
        resolve();
      });
    });
  }
async function scrollDown(page) {
  
  await page.evaluate(() => {
    window.scrollBy(0, 720);
  });
  await page.waitForTimeout(1000); // Wait for a moment for content to load (adjust as needed)
  return await page.$(".tiktok-usx5e-DivNoMoreResultsContainer") == null ; // Return true if more content was loaded, false otherwise
}