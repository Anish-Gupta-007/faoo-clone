require('dotenv').config();
const { getStorefrontClient } = require('./src/backend/services/shopify/client.js'); 
async function test() { 
  const query = `query { metaobjects(type: "blog", first: 10) { edges { node { handle type fields { key value reference { ... on MediaImage { image { url } } } } } } } }`; 
  const res = await getStorefrontClient().request(query); 
  console.log(JSON.stringify(res, null, 2)); 
} 
test().catch(console.error);
