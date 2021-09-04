const router = require("express").Router();
const passport = require("../helpers/passport");
const KnowledgeContent = require("mongoose").model("knowledgecontent");
const sanitize = require("mongo-sanitize");
const multer_uploader = require("../configs/multer.config");
const fileService = require("../helpers/fileService");

//To authenticate each request
router.use(passport.authenticate("jwt", { session: false }));

//All Get Methods-------------------------------------------------------

//Get Available Categories
router.get("/getcategories", (req, res, next) => {
  //find categories based on unique usermail id
  KnowledgeContent.findOne(
    { usermail: req.user.email },
    { "categories.categoryName": 1, _id: 1 }
  )
    .then((data) => {
      if (!data) {
        return res.json({ data: null });
      } else {
        let categories = [];
        data.categories.map((catagory) =>
          categories.push(catagory.categoryName)
        );
        return res.json({ data: categories });
      }
    })
    .catch((err) => {
      next(err);
    });
});

//Get list of available files under particular category
router.get("/getfiles/:category", (req, res, next) => {
  let category = sanitize(req.params.category);
  //Pipeline which will help to fetch proper data
  let aggregatePipeline = [
    {
      $match: { usermail: req.user.email },
    },
    {
      $unwind: "$categories",
    },
    {
      $match: { "categories.categoryName": category },
    },
    {
      $project: { categories: 1, _id: 0 },
    },
  ];
  KnowledgeContent.aggregate(aggregatePipeline)
    .then((data) => {
      if (data.length == 0) {
        return res.json({ data: null });
      } else {
        return res.json({ data: data[0].categories });
      }
    })
    .catch((err) => {
      next(err);
    });
});

//Download particular file for particular category from S3
router.get("/getfile/:category/:filename", fileService.downloadFile);

//All Post Methods--------------------------------------------

//Store Category in Database
router.post("/addcategory", async (req, res, next) => {
  try {
    let newCategory = sanitize(req.body.newCategory);
    let usermail = sanitize(req.user.email);

    //Checking if category already exists
    let content = await KnowledgeContent.findOne({
      usermail: usermail,
      "categories.categoryName": newCategory,
    });
    if (content)
      return res.status(400).json({
        success: false,
        msg: "Category name already exists. Please create Other category",
      });

    //If category does not exists then save category
    let filter = { usermail: req.user.email };
    let update = {
      $push: { categories: { categoryName: newCategory, files: [] } },
    };

    //Find user's data and add category
    content = await KnowledgeContent.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    if (content) return res.json({ success: true, data: content });
  } catch (err) {
    next(err);
  }
});

//upload file under mentioned category
//Upload file in s3
//Update mongodb database accordingly
router.post(
  "/uploadfile/:category",
  multer_uploader.single("file"),
  fileService.uploadFile
);

router.post("/createfile/:category", addContentToFile, fileService.uploadFile);

function addContentToFile(req, res, next) {
  if (!req.body.filename || !req.body.filetext) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide Proper Input" });
  }
  req.file = {};
  req.file.originalname = req.body.filename;
  req.file.buffer = Buffer.from(req.body.filetext);
  next();
}

module.exports = router;
