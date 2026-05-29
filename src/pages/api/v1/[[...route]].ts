import type { NextApiRequest, NextApiResponse } from 'next';
import app from '../../../backend/server';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false, // let Express parse body
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return app(req, res);
}
