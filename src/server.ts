/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
* Import Express, Cors
* */
import express, {Request, Response} from 'express';
import cors from 'cors';

/**
*Custom Modules */
import config from '@/config';

/**
 * Types*/
import type { CorsOptions} from "cors";

/**
*Express app initialization and port initialization
 * */
const app = express();

//Configure CORS options config.env will let you know which environment is active.
const corsOptions: CorsOptions = {
  origin(origin,callback){
    if(config.NODE_ENV_LOCAL === 'local' || !origin || config.WHITELIST_ORIGINS.includes(origin)){
      callback(null,true);
    }else{
      //Reject request from non-allowlisted origins
      callback(new Error(`CORS error: ${origin} is not allowed by CORS`),false,
      );
      console.log(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};

//Apply CORS middleware
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World from TypeScript Express!'});
});

app.listen(config.PORT, () => {
  console.log(`Server running: http://localhost:${config.PORT}`);
});

