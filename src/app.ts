import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
// @ts-ignore
import xss from "xss-clean";

import { config } from "src/config";
import { errorHandler, successHandler } from "src/config/morgan";

const app = express();

if (config.env !== "test") {
  app.use(successHandler);
  app.use(errorHandler);
}

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(xss());

app.use(compression());

app.use(cors());

app.use(errorHandler);

app.set('etag', false);

const router = express.Router();

router.get("/login", async(req, res, next) => {
  res.set("Cache-Control", "no-store");
  if(!config.getAuth()) {
    const url = config.createAuthAurl();
    console.log(url);
    return res.status(200).redirect(url);
  }
  return res.sendStatus(200);
});

router.get("/", async (req, res, next) => {
  if(req.url.includes('favicon.ico')) return res.sendStatus(404);
  await config.setAuth(req.query.code as string ?? "code");
  config.grabFormResponses();
  return res.send(req.query.code);
});

app.use(router);

export default app;
