import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
export const searchtermMatrix = 
[
    ['personal', 'gym', 'Track and Field', 'Boxing', 'Wrestling', 'Judo', 'Taekwondo', 'Karate', 'Muay Thai', 'Kickboxing', 'Brazillian Jiu Jutsu', 'Fencing', 'MMA', 'Krav Maga', 'Tennis', 'Table Tennis', 'Badminton', 'Squash', 'Racquetball', 'Padel', 'Swimming', 'Diving', 'Surfing', 'Windsurfing', 'Kite Surfing', 'Wakeboarding', 'Paddleboarding', 'Canoe', 'Sailing', 'Water Polo', 'Mountain Biking', 'BMX', 'Cyclocross', 'Gravel', 'Dressage', 'Polo', 'Trail Riding', 'Gymkhana', 'Darts', 'Billiards', 'Pool', 'Snooker', 'Bowling', 'Weightlifting', 'Bodybuilding', 'Calisthenics', 'HIIT', 'Pilates', 'Aerobics', 'Skydiving', 'Rock Climbing', 'Mountaineering', 'White-water Rafting', 'Caving', 'Paragliding', 'Hang Gliding', 'Skateboarding', 'Free Diving', 'Highlining', 'Parkour', 'Sandboarding', 'Ballroom Dancing', 'Latin Dancing', 'Tango', 'Salsa', 'Ballet', 'Contemporary', 'Hip-Hop', 'Shuffling', 'Football', 'Basketball', 'Baseball', 'Cricket', 'Hockey', 'Rugby', 'Volleyball', 'Lacrosse', 'Chess', 'Golf'],
    ['trainer', 'coach'],
    ['bangkok', 'kuala lumpur']
]
    
export function generateCombinations(arrays) {
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

  export function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
  }
  
  
  export async function waitForSelectorAsync(page) {
    // Simulate an asynchronous operation that may result in a timeout error
    return new Promise((resolve, reject) => {
      page.waitForSelector('.e19c29qe10').then(()=>{
        resolve()
      }).catch(()=>{
        reject()
      });
    });
  };
  
  export async function waitForUserInput(prompt) {
      return new Promise((resolve) => {
        rl.question(prompt, () => {
          resolve();
        });
      });
    }
  export async function scrollDown(page) {
    
    await page.evaluate(() => {
      window.scrollBy(0, 720);
    });
    await page.waitForTimeout(1000); // Wait for a moment for content to load (adjust as needed)
    return await page.$(".tiktok-usx5e-DivNoMoreResultsContainer") == null ; // Return true if more content was loaded, false otherwise
  }