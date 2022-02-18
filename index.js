const fs = require("fs");
const http = require("http");
const url = require("url");
// =================================================================================Files
// blocking synhronous way
// const txtIn = fs.readFileSync("./final/txt/input.txt", "utf-8");
// console.log(txtIn);
// const txtOut = `this is what we know about avocado : ${txtIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./final/txt/output.txt", txtOut);
// console.log("file writen");

// // non blocking or aysnhronous way
// fs.readFile("./final/txt/start.txt", "utf-8", (error, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, (error, data2) => {
//     console.log(data2);
//     fs.readFile("./final/txt/append.txt", "utf-8", (error, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./final/txt/final.txt",
//         `${data2} \n${data3} "utf"`,
//         (error) => {
//           console.log("your file has been written");
//         }
//       );
//     });
//   });
//   console.log(data1);
// });
// console.log("i go first baba");
// **************************************************************************************************SERVER
// SERVER
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};
const tempOverview = fs.readFileSync(
  `${__dirname}/final/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/final/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/final/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/final/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  const pathName = req.url;
  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
    // console.log(cardsHtml);
    // res.end(tempOverview);
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // product Page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  }
  // Not found
  else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "hello zoe",
    });
    res.end("<h1> Page wasnt found </h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});
