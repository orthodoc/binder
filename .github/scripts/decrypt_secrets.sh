#!/bin/sh

# Decrypt the file
# --batch to prevent interactive command
# --yes to assume "yes" for questions
# dev config json file for firebase functions
gpg --quiet --batch --yes --decrypt --passphrase="$TEST_SECRET_PASSPHRASE" \
--output ./firebase/functions/.dev.config.json ./firebase/functions/.dev.config.json.gpg
# test environment file
gpg --quiet --batch --yes --decrypt --passphrase="$TEST_SECRET_PASSPHRASE" \
--output ./src/environments/environment.test.ts ./src/environments/environment.test.ts.gpg
# dev environment file
gpg --quiet --batch --yes --decrypt --passphrase="$TEST_SECRET_PASSPHRASE" \
--output ./src/environments/environment.ts ./src/environments/environment.ts.gpg