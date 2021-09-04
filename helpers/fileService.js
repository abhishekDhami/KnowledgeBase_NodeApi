const sanitize = require('mongo-sanitize');
const KnowledgeContent=require('mongoose').model('knowledgecontent');
require('dotenv').config();
const AWS=require('aws-sdk');


const s3 = new AWS.S3({
    accessKeyId: process.env.USER_KEY,  
    secretAccessKey: process.env.USER_SECRET, 
    Bucket: process.env.BUCKET_NAME 
  });

  //Upload file to AWS S3
  //Update files list in mongodb
  exports.uploadFile = async (req, res,next) => {
    try
    {
      let category=sanitize(req.params.category);
      let filename=sanitize(req.file.originalname);
      
      //Pipeline for Validating if file is already present with same name
      let aggregatePipeline=
      [
        {
            "$match":{"usermail":req.user.email}
        },
        {
            "$unwind":"$categories"
        },
        {
            "$match":{"categories.categoryName":category,"categories.files":filename}
        },
        {
            "$project":{"categories":1,"_id":0}
        }    
      ];
      let file=await KnowledgeContent.aggregate(aggregatePipeline)
          if(file.length>0){return res.status(400).json({success:false,msg:'Filename already exists. Please Rename file and Upload'})}


      //Creating unique name for AWS S3
      let s3fileName=`${req.user.username}_|_${category}_|_${filename}`;
      const fileParams = {
        Key: s3fileName,
        Body: req.file.buffer,
        Bucket: process.env.BUCKET_NAME
        }
      //Uploading file to AWS
      s3.upload(fileParams, (err, data) => {
        if (err) 
        {
          next(err);
        }
        else
        {
          //On Succesful upload to AWS save data in mongodb
          let filter={"usermail":req.user.email,"categories.categoryName":category};
          let update={"$push":{"categories.$.files":filename}}
          KnowledgeContent.updateOne(filter,update)
          .then(
            data=>res.json({success:true,message:'File Uploaded'})
          )
          .catch(
            err=>next(err)
          )
        }
      });
    }
    catch(err){
        next(err);
    }  
  }

  //Download file from AWS S3
  exports.downloadFile = (req, res,next) => {
    let category=req.params.category;
    let filename=req.params.filename;
    //Generating unique name which will help to get file from aws
    let awsFileName=`${req.user.username}_|_${category}_|_${filename}`;
    const params = {
      Key: awsFileName,
      Bucket: process.env.BUCKET_NAME
    }
    //get file from AWS S3
    s3.getObject(params)
      .createReadStream()
        .on('error', function(err){
          next(err);
      }).pipe(res);
  }
  