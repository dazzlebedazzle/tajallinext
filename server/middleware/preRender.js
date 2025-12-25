const prerender = require("prerender-node");

// Set up Prerender with API token
prerender.set("prerenderToken", "Tl7IsB95RRFrcqwwaeEG");

const prerenderMiddleware = (req, res, next) => {
  prerender(req, res, next);
};

module.exports = prerenderMiddleware;
