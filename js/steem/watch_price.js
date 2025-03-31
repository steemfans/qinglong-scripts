const steem = require('steem');
const {InfluxDB, Point} = require('@influxdata/influxdb-client');

const token = process.env.INFLUXDB_TOKEN;
const url = process.env.INFLUXDB_URL;
const steem_api_url = process.env.STEEM_API_URL ?
    process.env.STEEM_API_URL : 'https://api.steem.fans';
const client = new InfluxDB({url, token});
const org = 'default';
const bucket = 'steem';
const writeClient = client.getWriteApi(org, bucket, 'ns');

steem.api.setOptions({ url: steem_api_url });

steem.api.getCurrentMedianHistoryPrice(function(err, result) {
    if (err) return console.log(err);
    const median_price = (result.base.split(' ')[0] / result.quote.split(' ')[0]).toFixed(3);
    const point = new Point('price')
        .tag('price_type', 'median_price')
        .floatField('base', parseFloat(result.base.split(' ')[0]))
        .floatField('quote', parseFloat(result.quote.split(' ')[0]))
        .floatField('price', parseFloat(median_price));
    writeClient.writePoint(point);
    writeClient.flush();
});

steem.api.getTicker(function(err, data) {
    if (err) return console.log(err);
    const point = new Point('price')
        .tag('price_type', 'ticker')
        .floatField('latest', parseFloat(data.latest))
        .floatField('lowest_ask', parseFloat(data.lowest_ask))
        .floatField('highest_bid', parseFloat(data.highest_bid))
        .floatField('percent_change', parseFloat(data.percent_change))
        .stringField('steem_volume', data.steem_volume)
        .stringField('sbd_volume', data.sbd_volume);
    writeClient.writePoint(point);
    writeClient.flush();
});
