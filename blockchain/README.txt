Preparation
  npm install
  npm install -g truffle
  npm install -g ganache-cli
  truffle compile

Start ganache-cli with option unlock
  ganache-cli --unlock 0,1,2,3,4
  truffle migrate

Notice the "second" contract address on ganache console
You need it for ra option
--uda option is UserDirectory contract address you can got when "truffle migrate"
Also note the account address (pick any 0,1,2,3,4) on the console.
You need it for idp and rp option

To create request
  npm run didbus -- request --ra 0xe5d7725464189ca018ad114577915171e3e4c0dc \
  --rp 0x4646c6dfdf04e4611564129a5a33e67be07fba8c --uda 0xf1242643d5e92aa03ce998d1e41032ae93831118 \
  --id 1111111111111

To create response
  npm run didbus -- response --ra 0xe5d7725464189ca018ad114577915171e3e4c0dc \
  --idp 0x4646c6dfdf04e4611564129a5a33e67be07fba8c --rid 0x81f7cd5025bf82d88a0dd3b79545415f76bb31b3

To create user
    npm run didbus -- createUser --ra 0xe5d7725464189ca018ad114577915171e3e4c0dc \
  --rp 0x4646c6dfdf04e4611564129a5a33e67be07fba8c --uda 0xf1242643d5e92aa03ce998d1e41032ae93831118 \
  --id 1111111111111

To get pending request
    npm run didbus -- pendingRequest --ra 0xe5d7725464189ca018ad114577915171e3e4c0dc \
  --rp 0x4646c6dfdf04e4611564129a5a33e67be07fba8c --uda 0xf1242643d5e92aa03ce998d1e41032ae93831118 \
  --id 1111111111111
