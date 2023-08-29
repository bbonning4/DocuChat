const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3_REGION, S3_BUCKET, S3_BASE_URL } = process.env;

module.exports = async function (file) {
  // Create an instance of the S3 client
  const s3Client = new S3Client({ region: S3_REGION });
  // s3's PutObjectCommand will expect an object with the following properties
  if (file.buffer) {
    const s3Params = {
      Bucket: S3_BUCKET,
      // Create a unique filename to use as the S3 Key
      Key: `${Date.now()}-${file.originalname}`,
      // The uploaded file's binary content is held in the buffer property
      Body: file.buffer,
    };
    // Send the file to s3
    await s3Client.send(new PutObjectCommand(s3Params));
    // Return the endpoint to download the file
    return `https://${S3_BUCKET}.${S3_BASE_URL}/${s3Params.Key}`;
  } else {
    // Handling base64 image data
    console.log(file);
    const base64Buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), "base64");
    console.log(base64Buffer);
    const regex = /data:image\/([a-zA-Z]+);base64,/;
    const matches = file.match(regex);
    let fileExtension = 'png'; // Default extension if no match is found

    if (matches && matches.length > 1) {
      const fileType = matches[1].toLowerCase();
      fileExtension = fileType === 'jpeg' ? 'jpg' : fileType;
    }

    const imageKey = `${Date.now()}-solve.${fileExtension}`;

    const s3Params = {
      Bucket: S3_BUCKET,
      Key: imageKey,
      Body: base64Buffer,
      ContentEncoding: 'base64',
      ContentType: `image/${fileExtension}`
    };

    await s3Client.send(new PutObjectCommand(s3Params));
    return `https://${S3_BUCKET}.${S3_BASE_URL}/${imageKey}`;
  }
};