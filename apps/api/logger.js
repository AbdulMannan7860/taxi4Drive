function serializeMeta(meta = {}) {
  return Object.fromEntries(
    Object.entries(meta).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

function log(level, message, meta) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...serializeMeta(meta)
  };

  const output = JSON.stringify(entry);
  if (level === "error") {
    console.error(output);
    return;
  }

  if (level === "warn") {
    console.warn(output);
    return;
  }

  console.info(output);
}

function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on("finish", () => {
    log(res.statusCode >= 500 ? "error" : "info", "request", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      ip: req.ip
    });
  });

  next();
}

module.exports = {
  log,
  requestLogger
};
