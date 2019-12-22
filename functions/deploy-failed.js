const fetch = require("node-fetch");

const { DATO_STATUS_URL } = process.env;

const data = JSON.stringify({ status: "error" });

exports.handler = async function(_event, _context) {
  let response;

  try {
    response = await fetch(DATO_STATUS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: response,
    }),
  };
};
