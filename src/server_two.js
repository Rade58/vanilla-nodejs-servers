// YOU CAN TEST THIS WITH Httpie
// http POST :3001/hello foo=shiba

const http = require("http");

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/hello") {
    const readingBodyPromise = new Promise((resolve, reject) => {
      let body = "";
      // APPENDING DATA OF EVERY CHUNK TO THE BODY
      req.on("data", (chunk) => {
        body += chunk;
      });

      // WE CAN RESOLVE PROMISE AT THE END OF READING THE STREAM
      req.on("end", () => {
        resolve(body);
      });
    });

    const body = JSON.parse(await readingBodyPromise);

    console.log({ body });

    if (body.foo === "shiba") {
      res.writeHead(200, { "Content-Type": "application/json" });

      res.write(JSON.stringify({ message: `${body.foo} is alright` }));

      res.end();

      return;
    }
  }

  res.writeHead(400, { "Content-Type": "application/json" });

  res.end(JSON.stringify({ message: "Nope" }));
});

server.listen(3001, () => {
  console.log("Server on http://localhost:3001");
});
