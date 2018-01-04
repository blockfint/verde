Preparation
  npm install
  npm install -g truffle
  truffle compile

Start ganache-cli with option unlock
  ganache-cli --unlock 0,1,2,3,4
  truffle migrate

Notice the "second" contract address on ganache console
You need it for ra option
Also note the account address (pick any 0,1,2,3,4) on the console.
You need it for idp and rp option

To create request
  npm run request -- create --ra 0x9782e0c36684e905df9f5785b4059dc187ef5648 \
  --rp 0x6e0627dd3cc03e2b38dd67014efd9faedcd00cf9

To create response
  npm run request -- response --ra 0x9782e0c36684e905df9f5785b4059dc187ef5648 \
  --idp 0x6e0627dd3cc03e2b38dd67014efd9faedcd00cf9 --rid 0
