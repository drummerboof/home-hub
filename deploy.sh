#!/usr/bin/env bash

dirName="home-hub-`git rev-parse --short HEAD`"

echo "Building ${dirName}..."
npm run build

echo "Copying in config..."
cp -R server/config dist/
cp pm2.yaml dist/

echo "Copying in server node_modules..."
cp -R server/node_modules dist/

echo "Compressing..."
mv dist ${dirName}
tar czf ${dirName}.tgz ${dirName}

echo "Copying to server..."
scp ${dirName}.tgz home-hub@192.168.0.59:

echo "Starting..."
ssh home-hub@192.168.0.59 <<ENDSSH
if [[ -d "${dirName}" ]]; then
  echo "Deployment ${dirName} exists. Commit and redeploy to generate new hash."
  exit 1;
fi

tar xzf ${dirName}.tgz
rm home-hub-current
ln -s ${dirName} home-hub-current
pm2 gracefulReload home-hub-current/pm2.yaml
rm ${dirName}.tgz
ENDSSH

echo "Cleaning up..."
rm -rf ${dirName}
rm ${dirName}.tgz

echo "Done"
