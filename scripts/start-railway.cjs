/**
 * Railway sets HOSTNAME to the container id; Next standalone binds to it and crashes (ENOTFOUND).
 * Set 0.0.0.0 before loading server.js (see .next/standalone/server.js).
 */
process.env.HOSTNAME = "0.0.0.0";

const port = process.env.PORT ?? "3000";
console.log(`[fe-respace] starting Next standalone on 0.0.0.0:${port}`);

require("./server.js");
