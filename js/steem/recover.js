const steem = require('steem');

const steem_ety001_key = process.env.STEEM_ETY_KEY ?
    process.env.STEEM_ETY_KEY : '';

    
const recover_account = 'ety001';
const recover_account_active_key = steem_ety001_key;
const loster = 'ety001.test';
const loster_new_pass= '';
const loster_old_pass= '';

const roles = ['active', 'posting', 'owner', 'memo'];
const loster_new_pubkeys = steem.auth.generateKeys(loster, loster_new_pass, roles);
const loster_old_pubkeys = steem.auth.generateKeys(loster, loster_old_pass, roles);

const newOwnerAuthority = {
  "weight_threshold": 1,
  "account_auths": [],
  "key_auths": [
    [
      loster_new_pubkeys['owner'],
      1
    ]
  ]
};

const extensions = [];

// send from recover_account
steem.broadcast.requestAccountRecovery(recover_account_active_key, recover_account, loster, newOwnerAuthority, extensions, function(err, result) {
  console.log('requestAccountRecovery do success', err, result);
  const recentOwnerAuthority = {
    "weight_threshold": 1,
    "account_auths": [],
    "key_auths": [
      [
        loster_old_pubkeys['owner'],
        1
      ]
    ]
  };

  const new_priv_keys = steem.auth.getPrivateKeys(loster, loster_new_pass, roles);
  const old_priv_keys = steem.auth.getPrivateKeys(loster, loster_old_pass, roles);

  // send from loster
  steem.broadcast.send(
    {
      extensions: [],
      operations: [
        [
          'recover_account',
          {
            "account_to_recover": loster,
            "new_owner_authority": newOwnerAuthority,
            "recent_owner_authority": recentOwnerAuthority,
            "extensions": []
          },
        ],
      ]
    },
    [
      old_priv_keys['owner'],
      new_priv_keys['owner'],
    ],
    (err1, result1) => {
      console.log('recoverAccount do success', err1, result1);
      // recover other authorities
      const active = {
        "weight_threshold": 1,
        "account_auths": [],
        "key_auths": [
          [
            loster_new_pubkeys['active'],
            1
          ]
        ]
      };
      const posting = {
        "weight_threshold": 1,
        "account_auths": [],
        "key_auths": [
          [
            loster_new_pubkeys['posting'],
            1
          ]
        ]
      };
      const memoKey = loster_new_pubkeys['memo'];

      steem.broadcast.send(
        {
          extensions: [],
          operations: [
            [
              "account_update",
              {
                "account": loster,
                "posting": posting,
                "active": active,
                "memo_key": memoKey,
                "json_metadata": "{}"
              }
            ],
          ]
        },
        [
          new_priv_keys['owner'],
        ],
        (err2, result2) => {
          console.log('accountUpdate do success', err2, result2);
        }
      );
    }
  );
});