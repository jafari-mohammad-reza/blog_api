# Blog App API
**Blog app Restfull api build on top of Nest.js** 

### Technologies :
* Nest.js 
* TypeOrm 
* Jest 
* Postgresql
* Redis 
* Open Api
* Cloudinary
* Multer
* Google OAuth2
* JWT & RSA256 hashing algorithm
* gmail as emailing service

## Running steps

### Best way to test this application is using docker compose

##### first go to application root folder, then run docker-compose run -d --build
you can access swagger documentation on [http://localhost:3000/api-docs](http://localhost:3000/api-docs)


you can access google authentication on [http://localhost:3000/auth/google/login](http://localhost:3000/auth/google/login)


you can access postgres admin panel on [http://localhost:5050](http://localhost:5050)


pgadmin email is admin@gmail.com and password is admin to add postgres server you can find out the ip address by command
**docker inspect (postgres uuid) : look for ip address from result. if you are using unix based systems you can find it easily by docker inspect (postgres uuid) | grep IPAddress. both username and password of postgres are admin**

user profile image will be uploaded with multer in project root upload path and blog image will be uploaded in cloudinary service so if you are using a network connection with low speed it may take a while
