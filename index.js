const crypto = require('crypto');
const localData = require('./local'); 
const cloudData = require('./cloud'); 
const count = 1;
const batchSize = localData.length/10; // Adjust batch size as needed
const hashAlgorithm = 'sha256'; 

async function generateHash(data) {
  const hash = crypto.createHash(hashAlgorithm);
  hash.update(data);
  return hash.digest('hex');
}

async function main() {
  

  let flag = false;
  let count = 0;

  for (let offset = 0; offset < localData.length; offset += batchSize) {
    const localBatchIds = Array.from(localDataMap.keys()).slice(offset, offset + batchSize);

    localBatchIds.sort((a, b) => a - b);
  

    for (const id of localBatchIds) {
   
      const localItem = sortObject(localDataMap.get(id));
      const cloudItem = sortObject(cloudDataMap.get(id));
      if (!cloudItem) {
        console.log(`Item with ID ${id} missing in cloud data`);
  
      } else {

        const localHash = await generateHash(JSON.stringify(localItem));
        const cloudHash = await generateHash(JSON.stringify(cloudItem));

        if (localHash !== cloudHash) {
          flag = true;
          count++;
          console.log(`Data mismatch for item with ID ${id}`);
        
        }
      }
    }

console.log(count++);

  }

  if (flag) {
    console.log(count);
    console.log(`Data verification failed with ${count} errors`);
  } else {
    console.log('Data verification successful without mismatches');
  }

  console.log('Exiting the function...');
}
function sortObject(obj) {
  return Object.fromEntries(Object.entries(obj).sort());
}
main().catch(err => console.error('Error:', err));
