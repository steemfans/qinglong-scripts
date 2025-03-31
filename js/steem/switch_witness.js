const steem = require('steem');

const steem_api_url = process.env.STEEM_API_URL ?
    process.env.STEEM_API_URL : 'https://api.steem.fans';
const steem_ety001_key = process.env.STEEM_ETY_KEY ?
    process.env.STEEM_ETY_KEY : '';

steem.api.setOptions({ url: steem_api_url });

const accountName = 'ety001';

const signKeys = {
    'cloudcone': 'STM5CbU2',
};

const node = 'cloudcone';

steem.api.getWitnessByAccount(accountName, function(err, result) {
    console.log(err, result);
    if (err !== null) {
        console.log('获取见证人信息失败');
        return;
    }

    steem.broadcast.witnessUpdate(steem_ety001_key, result.owner, result.url, signKeys[node], result.props, '0.000 STEEM', function(e, r) {
        console.log(e, r);
    });
});