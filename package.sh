# abort on errors
set -e

# package
# npm run dist -- -mwl
npm run dist -- -m

# navigate to folder
# cd /Applications/朝思.app/Contents/Resources/
# asar pack . app.asar --unpack "./node_modules/node-notifier/vendor/**"

cd -