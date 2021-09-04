# KnowledgeBase_NodeApi
To support backend Functionality of KnowledgeBase application 

# Local Setup
  1.Clone the code in local. 
  2. Provide Environement details:
    *Either you can create .env file at root directory or you can mention in System Environments*
    
    ANGULAR_APP =<Proide Angular app URL/Client URL>
    DB_STRING=<MongoDB Connection String>
    PORT=<Custome Port Number, if not provided then app run on 3000 by default>
    CLIENT_ID=<Google Api client ID>
    USER_KEY=<AWS S3 Access key>
    USER_SECRET=<AWS S3 Access Secret Key>
    BUCKET_NAME=<Aws S3 Bucket name>
  2. Provide your Secret key details in key.txt file.
  3. Run command : npm install
  4. Run command: npm start
  5. It will start serve on mentioned port. (default 3000)
