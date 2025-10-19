import { put } from "@vercel/blob";
import { readFile } from 'fs/promises';
import 'dotenv/config';

// needs BLOB_READ_WRITE_TOKEN env variable
// change the following path and name to save files to blob
const fileData = await readFile('./public/valvod.png');
const { url } = await put('valvod.png', fileData, {
  access: 'public',
  contentType: 'image/png'
});
console.log(url);
