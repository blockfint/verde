Preparation
  npm install
  npm install -g truffle
  npm install -g ganache-cli
  truffle compile

Start ganache-cli with option unlock
  ganache-cli --unlock 0,1,2,3,4
  truffle migrate

Option
  user, rp and idp option is the account index (pick any 0,1,2,3,4).
  rid option is the request index of each userid.
  idpCount is a number of minimum response OK.

To create user
  npm run didbus \
  -- createUser \
  --rp 0 \
  --user 4 \
  --userid 11111 \
  --idpCount 3

To create request
  npm run didbus \
  -- request \
  --rp 0 \
  --user 4 \
  --userid 11111

To get pending request
  npm run didbus \
  -- getRequest \
  --rp 0 \
  --user 4 \
  --userid 11111

To create response
  npm run didbus \
  -- response \
  --idp 1 \
  --user 4 \
  --userid 11111 \
  --rid 0
