Preparation
  npm install
  npm install -g truffle
  truffle compile

Start ganache-cli with option unlock
  ganache-cli --unlock 0,1,2,3,4
  truffle migrate

Option
  user, rp and idp option is the account index (pick any 0,1,2,3,4).
  rid option is the request index of each userid.

To create user
  npm run didbus \
  -- createUser \
  --rp 0 \
  --user 4 \
  --userid 11111

To create request
  npm run didbus \
  -- request \
  --rp 0 \
  --user 4 \
  --userid 22222

To get pending request
  npm run didbus \
  -- pendingRequest \
  --idp 1 \
  --user 4 \
  --userid 11111

To create response
  npm run didbus \
  -- response \
  --idp 1 \
  --user 4 \
  --userid 11111 \
  --rid 0