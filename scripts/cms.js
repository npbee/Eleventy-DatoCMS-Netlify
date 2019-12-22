require("dotenv").config();

const { promisify } = require("util");
const path = require("path");
const fetch = require("node-fetch");
const fs = require("fs");

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

run();

async function run() {
  const token = process.env.DATO_API_TOKEN;
  const cachePath = path.join(__dirname, "../_data/cms.js");

  try {
    const data = await fetchData(token);
    await writeFile(
      cachePath,
      `module.exports = ${JSON.stringify(data, null, 2)}`
    );
    console.log(`Cache written to ${cachePath}`);
  } catch (err) {
    console.error(err);
  }
}

async function fetchData(token) {
  const query = await readFile(path.join(__dirname, "query.graphql"));
  const response = await fetch("https://graphql.datocms.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: query.toString(),
    }),
  }).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Aborting: DatoCMS request failed with " + res.status);
    }
  });

  if (response.errors) {
    for (let error of response.errors) {
      console.error(error.message);
    }
    throw new Error("Aborting: DatoCMS errors");
  } else {
    return response.data;
  }
}
