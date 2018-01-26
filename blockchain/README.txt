Preparation
  npm install
  npm install -g truffle
  truffle compile

Start ganache-cli with option unlock
  ganache-cli --unlock 0,1,2,3,4
  truffle migrate

rid option is request index of each userid

To create request
  npm run didbus \
  -- request \
  --userid 11111

To get pending request
  npm run didbus \
  -- pendingRequest \
  --userid 11111

To create response
  npm run didbus \
  -- response \
  --userid 11111 \
  --rid 0

To create user
  npm run didbus \
  -- createUser \
  --userid 11111