# KnowledgeBase_NodeApi

To support backend Functionality of KnowledgeBase application

# Local Setup

1. Clone the code in Local

2. Provide Environement details:
   _Either you can create .env file at root directory or you can mention in System Environments_

   ANGULAR_APP=Proide Angular app URL/Client URL ;
   DB_STRING=MongoDB Connection String ;
   PORT=Custome Port Number, if not provided then app run on 3000 by default ;
   CLIENT_ID=Google Api client ID ;
   USER_KEY=AWS S3 Access key ;
   USER_SECRET=AWS S3 Access Secret Key ;
   BUCKET_NAME=Aws S3 Bucket name ;

3. Provide your Secret key details in key.txt file.
4. Run command : npm install
5. Run command: npm start
6. It will start serve on mentioned port. (default 3000)

# DB Dump

1. MongoDb have two collections:

   i. 'users' , please see below structure of data for reference (each username and email has unique index)

   {
   "\_id" : ObjectId("89332d351a2ef31b41595b44"),
   "username" : "someusername",
   "email" : "somemail@gmail.com",
   "hash" : "53e8ecc04897d8cf1a88aba8a3d42b8faad0f09f81bdeb6c995e09115161caasg45hs7d1910009c8c5a5b324d2a03b9c5783aa4ef62d0d8ae7d34eb86cb64fa27",
   "salt" : "4b4e6b3b8e237040792bda31fa17132bd6aea93cbfbd5a35643665jsjf65oo0f"
   }

   ii. 'knowledgecontents' , please see below structure of data for reference (useremail has unique index)

   {
   "\_id" : ObjectId("89332d411a2ef31b47395b4c"),
   "usermail" : "somemail@gmail.com",
   "categories" : [
   {
   "categoryName" : "Category1",
   "files" : [
   "file1.jpg",
   "file2.pdf"
   ]
   },
   {
   "categoryName" : "Category2",
   "files" : []
   }
   ]
   }
