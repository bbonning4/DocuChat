const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { S3_REGION, S3_BUCKET } = process.env;

module.exports = async function (fileURL) {
  // Create an instance of the S3 client
  const s3Client = new S3Client({ region: S3_REGION });

  const url = new URL(fileURL);
  const pathname = url.pathname;
  const fileKey = decodeURIComponent(pathname.split("/").pop());
  console.log("Key: ", fileKey)

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileKey,
  };
  // delete file from S3
  const deleteObjectCommand = new DeleteObjectCommand(s3Params);

  try {
    // Delete the object from S3
    await s3Client.send(deleteObjectCommand);
    console.log("Object deleted successfully");
  } catch (error) {
    console.error("Error deleting object:", error);
  }
};