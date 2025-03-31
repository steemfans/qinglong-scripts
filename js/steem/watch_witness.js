const steem = require('steem');
const fs = require('fs');

const steem_api_url = process.env.STEEM_API_URL ?
    process.env.STEEM_API_URL : 'https://api.steem.fans';

steem.api.setOptions({ url: steem_api_url });

const accountName = 'ety001';

// 读取或创建 miss_block_num 文件
function readMissBlockNum() {
    const filePath = './miss_block_num';
    try {
        if (fs.existsSync(filePath)) {
            return parseInt(fs.readFileSync(filePath, 'utf8'));
        } else {
            fs.writeFileSync(filePath, '0');
            return 0;
        }
    } catch (error) {
        console.error('Error reading/creating miss_block_num file:', error);
        return 0;
    }
}

// 更新 miss_block_num 文件
function updateMissBlockNum(newValue) {
    const filePath = './miss_block_num';
    try {
        fs.writeFileSync(filePath, newValue.toString());
    } catch (error) {
        console.error('Error updating miss_block_num file:', error);
    }
}

steem.api.getWitnessByAccount(accountName, function(err, result) {
    if (err !== null) {
        console.log('获取见证人信息失败');
        return;
    }

    const currentMissed = result.total_missed;
    const previousMissed = readMissBlockNum();

    if (currentMissed !== previousMissed) {
        console.log('New missed blocks:', currentMissed - previousMissed);
        QLAPI.notify('New missed blocks:', currentMissed - previousMissed);
        updateMissBlockNum(currentMissed);
    }
});