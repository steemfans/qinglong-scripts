const steem = require('steem');

const steem_api_url = process.env.STEEM_API_URL ?
    process.env.STEEM_API_URL : 'https://api.steem.fans';
const steem_ety001_key = process.env.STEEM_ETY_KEY ?
    process.env.STEEM_ETY_KEY : '';
const steem_ldsn_key = process.env.STEEM_LDSN_KEY ?
    process.env.STEEM_LDSN_KEY : '';
const steem_tinyfish_key = process.env.STEEM_TINYFISH_KEY ?
    process.env.STEEM_TINYFISH_KEY : '';

steem.api.setOptions({ url: steem_api_url });

function claim(user, ac_key) {
  const keys = {active: ac_key};

  const op = [
    "claim_account",
    {
      "fee": "0.000 STEEM",
      "creator": user,
      "extensions": []
    }
  ];

  const tx = {
      extensions: [],
      operations: [
          op
      ]
  };
  try {
    steem.broadcast.send(tx, keys, (r) => {
        console.log(r);
    });
  } catch(e) {
    console.error(e);
  }
}

if (steem_ldsn_key) {
}

if (steem_ety001_key) {
  claim('ety001', steem_ety001_key);
}

if (steem_tinyfish_key) {
}
