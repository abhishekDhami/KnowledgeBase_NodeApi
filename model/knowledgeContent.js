const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    categoryName: String,
    files: [String],
  },
  { _id: false }
);

const KnowledgeContentSchema = new mongoose.Schema({
  usermail: String,
  categories: [CategorySchema],
});

mongoose.model("knowledgecontent", KnowledgeContentSchema);
