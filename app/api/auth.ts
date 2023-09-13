import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
 
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  // retrieve data from your database
  res.status(200).json({});
}