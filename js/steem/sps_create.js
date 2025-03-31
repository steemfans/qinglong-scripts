const steem = require('steem');

const creator = 'ety001';
const receiver = 'ety001';
const start_date = '2025-03-31T00:00:00';
const end_date = '2025-04-30T00:00:00';
const daily_pay = '100.000 SBD';
const subject = 'subject';
// https://steemit.com/steem/@ety001/699n5h
const permlink = '699n5h';

const roles = ['active', 'posting', 'owner', 'memo'];
const master_password = 'Pjdfsdfsdfsd';
const priv_keys = steem.auth.getPrivateKeys(creator, master_password, roles);

steem.broadcast.send(
  {
    extensions: [],
    operations: [
      [
        'create_proposal',
        {
          "creator": creator,
          "receiver": receiver,
          "start_date": start_date,
          "end_date": end_date,
          "daily_pay": daily_pay,
          "subject": subject,
          "permlink": permlink
        }
      ],
    ]
  },
  [
    priv_keys['posting'],
  ],
  (err, result) => {
    console.log(err, result)
  }
);
