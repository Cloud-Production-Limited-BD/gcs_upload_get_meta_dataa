import { Storage } from "@google-cloud/storage";
import type { NextApiRequest, NextApiResponse } from "next";
const storage = new Storage({
  credentials: {
    client_email: process.env.NEXT_APP_PROJECT_ID as string,
    private_key: process.env.NEXT_APP_PRIVATE_KEY as string
  },
  projectId: process.env.NEXT_APP_PROJECT_ID as string
});
const bucketName = process.env.NEXT_APP_BUCKET_NAME as string;

export default async function handler(
  req: NextApiRequest & { files?: any },
  res: NextApiResponse<any>
) {
  type getOptionsType = {
    action: "read" | "write" | "delete" | "resumable";
    version?: "v2" | "v4";
    expires: string | number | Date;
  };
  const options = {
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000 // 15 minutes
  } as getOptionsType;
  const newFileName = req.query.name as string;
  const file = storage.bucket(bucketName).file(newFileName);

  try {
    const [url]: any = await file.getSignedUrl(options);
    res.status(200).json({ url: url });
  } catch (e) {
    res.status(400).json({ error: JSON.stringify(e) });
  }
}
