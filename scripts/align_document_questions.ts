import * as fs from 'fs';
import * as path from 'path';

interface SpecialQ {
  options: string[];
  correctAnswer: number;
}

const specialQuestions: Record<number, SpecialQ> = {
  96: {
    options: [
      "Kürzung sozialer Leistungen",
      "bis zu 100 Sozialstunden",
      "gar nicht, Holocaustleugnung ist erlaubt",
      "mit Freiheitsstrafe bis zu fünf Jahren oder mit Geldstrafe"
    ],
    correctAnswer: 4
  },
  111: {
    options: [
      "die Politik Israels öffentlich kritisieren",
      "das Aufhängen einer israelischen Flagge auf dem Privatgrundstück",
      "eine Diskussion über die Politik Israels",
      "der öffentliche Aufruf zur Vernichtung Israels"
    ],
    correctAnswer: 4
  },
  118: {
    options: [
      "nur Deutsche",
      "nur Israelis",
      "nur religiöse Menschen",
      "alle Menschen"
    ],
    correctAnswer: 4
  },
  149: {
    options: [
      "ein jüdisches Fest besuchen",
      "die israelische Regierung kritisieren",
      "den Holocaust leugnen",
      "gegen Juden Fußball spielen."
    ],
    correctAnswer: 3
  },
  182: {
    options: [
      "Basilika",
      "Moschee",
      "Synagoge",
      "Kirche"
    ],
    correctAnswer: 3
  },
  184: {
    options: [
      "eine Resolution der Vereinten Nationen",
      "ein Beschluss des Zionistenkongresses",
      "ein Vorschlag der Bundesregierung",
      "ein Vorschlag der UdSSR"
    ],
    correctAnswer: 1
  },
  206: {
    options: [
      "an berühmte deutsche Politikerinnen und Politiker",
      "an die Opfer des Nationalsozialismus",
      "an Verkehrstote",
      "an bekannte jüdische Musiker"
    ],
    correctAnswer: 2
  },
  288: {
    options: [
      "aus der Mitgliedschaft in der Europäischen Union (EU)",
      "aus den nationalsozialistischen Verbrechen gegen Juden",
      "aus dem Grundgesetz der Bundesrepublik Deutschland",
      "aus der christlichen Tradition"
    ],
    correctAnswer: 2
  }
};

function getTokens(s: string): Set<string> {
  return new Set(
    (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9äöüß]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2)
      .map(w => w.replace(/innen|in|er|es|en|em|e|n|s$/, ''))
  );
}

async function run() {
  const datasetUrl = "https://raw.githubusercontent.com/junaidk/einburgerungstest/master/dataset.json";
  console.log(`Fetching official dataset from ${datasetUrl}...`);
  const resp = await fetch(datasetUrl);
  if (!resp.ok) {
    throw new Error(`Failed to fetch dataset: ${resp.statusText}`);
  }
  const dataset = await resp.json();

  const questionPath = path.join(__dirname, '../data/question.json');
  const allQuestions: any[] = JSON.parse(fs.readFileSync(questionPath, 'utf8'));

  const lettersUpper = ['A', 'B', 'C', 'D'];
  const lettersLower = ['a', 'b', 'c', 'd'];

  const perms = [
    [0,1,2,3],[0,1,3,2],[0,2,1,3],[0,2,3,1],[0,3,1,2],[0,3,2,1],
    [1,0,2,3],[1,0,3,2],[1,2,0,3],[1,2,3,0],[1,3,0,2],[1,3,2,0],
    [2,0,1,3],[2,0,3,1],[2,1,0,3],[2,1,3,0],[2,3,0,1],[2,3,1,0],
    [3,0,1,2],[3,0,2,1],[3,1,0,2],[3,1,2,0],[3,2,0,1],[3,2,1,0]
  ];

  let reorderedCount = 0;

  for (let i = 1; i <= 300; i++) {
    const qIndex = i - 1;
    const q = allQuestions[qIndex];
    if (!q) {
      console.warn(`Question index ${qIndex} missing!`);
      continue;
    }

    let docOpts: string[];
    let docCorrectIdx: number;

    if (specialQuestions[i]) {
      docOpts = specialQuestions[i].options;
      docCorrectIdx = specialQuestions[i].correctAnswer;
    } else {
      const dItem = dataset.questions.find((x: any) => x.id === i);
      if (!dItem) {
        console.warn(`Dataset missing ID ${i}`);
        continue;
      }
      docOpts = dItem.options;
      docCorrectIdx = dItem.correctAnswer;
    }

    const currentList = [
      { key: 'a', text: q.a },
      { key: 'b', text: q.b },
      { key: 'c', text: q.c },
      { key: 'd', text: q.d },
    ];

    let bestPerm = [0, 1, 2, 3];

    // Special handling for image questions (e.g. 21, 209)
    if (i === 21 || i === 209) {
      bestPerm = [0, 1, 2, 3];
    } else {
      const scores: { d: number; c: number; score: number }[] = [];
      for (let d = 0; d < 4; d++) {
        const dNorm = docOpts[d].toLowerCase().replace(/[^a-z0-9]/g, '');
        const dTokens = getTokens(docOpts[d]);
        for (let c = 0; c < 4; c++) {
          const cNorm = currentList[c].text.toLowerCase().replace(/[^a-z0-9]/g, '');
          const cTokens = getTokens(currentList[c].text);
          let intersection = 0;
          dTokens.forEach(t => { if (cTokens.has(t)) intersection++; });
          const exact = (dNorm === cNorm);
          const score = exact ? 100 : (intersection / Math.max(1, Math.min(dTokens.size, cTokens.size)));
          scores.push({ d, c, score });
        }
      }

      let maxTotal = -1;
      for (const p of perms) {
        let total = 0;
        for (let d = 0; d < 4; d++) {
          const entry = scores.find(s => s.d === d && s.c === p[d]);
          total += entry ? entry.score : 0;
        }
        if (total > maxTotal) {
          maxTotal = total;
          bestPerm = p;
        }
      }
    }

    // Remap translations
    const oldTranslation = q.translation ? JSON.parse(JSON.stringify(q.translation)) : null;
    const newTranslation: Record<string, any> = {};

    if (oldTranslation) {
      for (const lang of Object.keys(oldTranslation)) {
        const langObj = oldTranslation[lang];
        if (langObj) {
          newTranslation[lang] = {
            ...langObj,
            a: langObj[lettersLower[bestPerm[0]]] || langObj.a,
            b: langObj[lettersLower[bestPerm[1]]] || langObj.b,
            c: langObj[lettersLower[bestPerm[2]]] || langObj.c,
            d: langObj[lettersLower[bestPerm[3]]] || langObj.d
          };
        }
      }
    }

    // New options strictly in document order
    const optA = docOpts[0];
    const optB = docOpts[1];
    const optC = docOpts[2];
    const optD = docOpts[3];

    const correctLetterUpper = lettersUpper[docCorrectIdx - 1];
    const correctLetterLower = lettersLower[docCorrectIdx - 1];

    q.a = optA;
    q.b = optB;
    q.c = optC;
    q.d = optD;
    q.options = {
      A: optA,
      B: optB,
      C: optC,
      D: optD
    };
    q.solution = correctLetterLower;
    q.correctAnswer = correctLetterUpper;
    if (oldTranslation) {
      q.translation = newTranslation;
    }

    reorderedCount++;
  }

  // Also ensure all 160 state questions have options and correctAnswer
  for (let idx = 300; idx < allQuestions.length; idx++) {
    const sq = allQuestions[idx];
    if (!sq.options) {
      sq.options = {
        A: sq.a,
        B: sq.b,
        C: sq.c,
        D: sq.d
      };
    }
    if (!sq.correctAnswer) {
      sq.correctAnswer = (sq.solution || 'a').toUpperCase();
    }
  }

  fs.writeFileSync(questionPath, JSON.stringify(allQuestions, null, 2), 'utf8');
  console.log(`Successfully updated ${allQuestions.length} questions in ${questionPath}!`);
  console.log(`- Reordered ${reorderedCount} general questions to match BAMF document order strictly.`);
}

run().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
