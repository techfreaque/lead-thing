cd /leadthing
git stash
git pull

chmod a+x start-update-production.sh

cp -n .env-example .env
docker build --tag leadthing .
mkdir /leadthing-data

docker stop leadthing
docker rm leadthing
docker run -d  --log-driver none --name leadthing --network caddy_internal -v /leadthing-data:/app/prisma/db leadthing

# dev
# docker build --tag leadthing .
# docker stop leadthing
# docker rm leadthing
# docker run -d  --name leadthing --network caddy_internal -v /leadthing-data:/app/prisma/db leadthing