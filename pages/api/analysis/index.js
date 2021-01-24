import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const { oldData, email } = req.body;
  const data = timeout(
    120000,
    fetch("http://localhost:5000/", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(oldData),
    })
  );
  data
    .then(async (res) => {
      const newData = await res.json();
      sendMail(oldData, newData, email);
    })
    .catch(console.error);

  res.status(200).end();
}

function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

async function sendMail(oldData, newData, email) {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
  const html = await generateHtml(oldData, newData);

  let info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Essay Editor Pro Analysis Results",
    html,
  });
}

async function generateHtml(oldData, newData) {
  const json = oldData;
  const paragraphs = await json.map((old, index) =>
    generateParagraph(old, newData[index], index)
  );
  return `<html><head><style>
  h1 {
    margin-left: 1rem;
  }

  h2 {
    margin-left: 2rem;
  }

  h3 {
    margin-left: 3rem;
  }

  p {
    margin-left: 5rem;
  }

  section {
    margin: 2rem;
  }
</style></head>
    <body><div>
    <h1>Your results are in!</h1>
    ${paragraphs}
  </div></body></html>`;
}

function generateParagraph(oldData, newData, index) {
  const { paragraph, count, wikiData } = getParagraphData(newData);
  return `<section>
      <h2>Section ${index + 1}</h2>
      <h3>Your Writing</h3>
      <p>${oldData}</p>
      <h3>Our Revisions</h3>
      <p>${paragraph}</p>
      <h3>More on this paragraph</h3>
      <p>${displayOverusedWords(newData)}</p>
      ${
        count > 0
          ? `<p>You used passive sentences ${count} times in this section.</p>`
          : ""
      }
      ${wikiData}
  </section>`;
}

function getParagraphData({ sentencesArray, occurrence, sentenceCount }) {
  let paragraph = "<p>";
  let count = 0;
  let wikiData = "<h3>Here are some helpful links <br/><ul>";
  const w = {};
  sentencesArray.forEach(({ voice, wikis, sentence }, index) => {
    if (voice ?? "" === "PASSIVE") count++;
    if (wikis?.length) {
      wikis.forEach((i) => (w[i.name] = i));
    }
    paragraph += sentence;
  });
  wikiData += Object.values(w)
    .map(({ name, url }) => `<li><a href="${url}">${name}</a></li>`)
    .join("");
  paragraph += "</p>";
  wikiData += "</ul></h3>";
  return {
    paragraph,
    count,
    wikiData: Object.keys(w).length > 0 ? wikiData : "",
  };
}

function displayOverusedWords(occurence, sentenceCount) {
  let overUsedWords = "";
  Object.keys(occurence).forEach((key) => {
    if (occurence[key] >= sentenceCount / 3) {
      overUsedWords += `<b>${key}</b> is used a total of <b>${occurence[key]}</b> times.`;
    }
  });

  if (!overUsedWords?.length) {
    overUsedWords = "There are no overused words in this section.";
  }

  return overUsedWords + "<br/>";
}
