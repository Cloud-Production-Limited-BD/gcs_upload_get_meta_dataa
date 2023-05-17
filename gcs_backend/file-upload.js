const axios = require("axios");
const { Storage } = require("@google-cloud/storage");
const express = require("express");
const cors = require("cors");
const Multer = require("multer");

const bucketName = "shinonome-retail";
const app = express();
const port = 5000;
app.use(cors());

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

const cloudStorage = new Storage({
  keyFilename: `${__dirname}/service_account_key.json`,
  projectId: "retail-shinonome"
});

const bucket = cloudStorage.bucket(bucketName);

app.post(
  "/upload-file-to-cloud-storage",
  multer.single("file"),
  async function (req, res) {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const expirationDuration = 60 * 60 * 1000; // 1 hour in milliseconds

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createReadStream();
    const file = cloudStorage.bucket(bucketName).file(blob.name);

    // Generate a signed URL with the specified expiration time
    const options = {
      version: "v4",
      action: "write",
      expires: Date.now() + expirationDuration // Expiration time in milliseconds
    };

    file.getSignedUrl(options).then(async (signedUrl) => {
      console.log(signedUrl);
      const extension = blob.name.split(".");
      const response = await axios.put(signedUrl, blobStream, {
        headers: {
          "Content-Type": `image/${extension[extension.length - 1]}`
        }
      });
      if (response.status === 200) {
        res.status(200).send({
          status: 200,
          message: "File Uploaded Successfully",
          url: `https://storage.cloud.google.com/${bucketName}/${blob.name}`
        });
      } else {
        res.status(400).send({
          status: 400,
          message: "Error in file upload"
        });
      }
      //console.log(response);
    });

    blobStream.end(req.file.buffer);
    //console.log(req.file);
  }
);
app.get("/get-files-list", async (req, res) => {
  const options = {};
  const [files] = await bucket.getFiles(options);
  res.status(200).json({ files });
});
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
