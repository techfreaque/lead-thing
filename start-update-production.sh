cd /leadthing
cp -n .env-example .env
docker build --tag leadthing .
mkdir /leadthing-data

docker stop leadthing
docker rm leadthing
docker run -d --name leadthing --network caddy_internal -v /leadthing-data:/prisma/db docker logs -f leadthing