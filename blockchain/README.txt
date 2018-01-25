Preparation
  npm install
  npm install -g truffle
  truffle compile

Start ganache-cli with option unlock
  ganache-cli --unlock 0,1,2,3,4
  truffle migrate

Also note the account address (pick any 0,1,2,3,4) on the console.
You need it for idp and rp option

To create request
  npm run didbus \
  -- request \
  --rp 0x607aba2442d9ca38c2a63d7655dc69963a49d66d \
  --id 11111

To get pending request
  npm run didbus \
  -- pendingRequest \
  --rp 0x607aba2442d9ca38c2a63d7655dc69963a49d66d \
  --id 11111

To create response
  npm run didbus \
  -- response \
  --idp 0x607aba2442d9ca38c2a63d7655dc69963a49d66d \
  --rid 0x88c1db2190aadeed9cf4126552e488331d82d4f0

To create user
  npm run didbus \
  -- createUser \
  --rp 0x607aba2442d9ca38c2a63d7655dc69963a49d66d \
  --id 11111