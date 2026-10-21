import http from "node:http";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// health
app.get("/health", (_req, res) => res.json({ ok: true, wisp: "/wisp/" }));

const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
  const p = new URL(req.url || "/", "http://localhost").pathname;
  if (p === "/wisp/" || p.startsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
    return;
  }
  socket.destroy();
});

server.listen(PORT, () => {
  console.log("brave-proxy on :" + PORT + "  wisp at /wisp/");
});
