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

function claimBalance(username, wif) {
  steem.api.getAccounts([username], function(err, result) {
    // console.log(err, result);
    if (result && result.length > 0) {
      const reward_steem = result[0]['reward_steem_balance'];
      const reward_sbd = result[0]['reward_sbd_balance'];
      const reward_vests = result[0]['reward_vesting_balance'];
      try {
        steem.broadcast.claimRewardBalance(wif, username, reward_steem, reward_sbd, reward_vests, function(err, data) {
          console.log('claimed balance', data);
        });
      } catch(e) {
        console.log('claimed balance error', e);
      }
    }
  });
}


if (steem_ldsn_key) {
	claimBalance('ldsn001', steem_ldsn_key);
}

if (steem_ety001_key) {
  claimBalance('ety001', steem_ety001_key);
}

if (steem_tinyfish_key) {
  claimBalance('tinyfish', steem_tinyfish_key);
}

