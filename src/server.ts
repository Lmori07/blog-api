/**
 *@copyright 2025 JOMV
 *@license Apache-2.0
 */

/**
* Node Module, to correctly use express instead of importing, create a const and make it require
* */
import express, {Request, Response} from 'express';

/**
*Express app initialization and port initialization
 * */
const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World from TypeScript Express!'});
});

app.listen(port, () => {
  console.log(`Server running: ${port}`);
});

