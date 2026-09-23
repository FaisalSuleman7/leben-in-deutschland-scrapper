// Leben in Deutschland - Main Client Application Logic

const OFFICIAL_SESSIONS = [
  { id: 1, name: "Aufgaben des Staates", name_en: "Duties of the State", count: 4, questions: [46, 47, 68, 148], icon: "🏛️", desc: "Monopole, Gewaltenteilung und Grundfunktionen des Staates", desc_en: "State monopolies, separation of powers, and core state functions" },
  { id: 2, name: "Bildung", name_en: "Education", count: 7, questions: [2, 244, 257, 260, 261, 268, 270], icon: "🎓", desc: "Schulpflicht, Bildungswesen und Erziehungsrecht", desc_en: "Compulsory schooling, educational system, and parental rights" },
  { id: 3, name: "Der Nationalsozialismus und seine Folgen", name_en: "National Socialism and Its Consequences", count: 20, questions: [96, 111, 149, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 170, 181, 206, 288], icon: "📜", desc: "1933–1945, Holocaust, Widerstand und historische Verantwortung", desc_en: "1933–1945, the Holocaust, resistance, and historical responsibility" },
  { id: 4, name: "Deutschland in Europa", name_en: "Germany in Europe", count: 21, questions: [173, 221, 222, 223, 224, 225, 226, 227, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 295], icon: "🇪🇺", desc: "Europäische Union, Institutionen, Grundfreiheiten und Nachbarn", desc_en: "European Union, institutions, fundamental freedoms, and neighbors" },
  { id: 5, name: "Föderalismus", name_en: "Federalism", count: 9, questions: [24, 25, 37, 39, 49, 64, 67, 91, 219], icon: "🇩🇪", desc: "Bundesländer, Kompetenzverteilung und Bundesrat", desc_en: "Federal states, distribution of legislative powers, and Bundesrat" },
  { id: 6, name: "Grundrechte", name_en: "Basic Rights", count: 22, questions: [1, 4, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 19, 245, 251, 262, 267, 272, 274, 281, 291, 292], icon: "⚖️", desc: "Artikel 1–19 Grundgesetz, Meinungs-, Religions- & Gleichheitsrechte", desc_en: "Articles 1–19 Basic Law, freedom of expression, religion & equality" },
  { id: 7, name: "Interkulturelles Zusammenleben", name_en: "Intercultural Coexistence", count: 3, questions: [277, 278, 289], icon: "🤝", desc: "Toleranz, Antidiskriminierung und gesellschaftlicher Zusammenhalt", desc_en: "Tolerance, anti-discrimination, and social cohesion" },
  { id: 8, name: "Kommune", name_en: "Local Government", count: 10, questions: [56, 69, 126, 131, 134, 243, 253, 256, 265, 279], icon: "🏙️", desc: "Kommunale Selbstverwaltung, Bürgermeister und Bürgerämter", desc_en: "Municipal self-government, mayors, and citizen registration services" },
  { id: 9, name: "Migrationsgeschichte", name_en: "Migration History", count: 4, questions: [297, 298, 299, 300], icon: "🌍", desc: "Gastarbeiterabkommen, Zuwanderung und moderne Migration", desc_en: "Guest worker agreements, immigration, and contemporary migration" },
  { id: 10, name: "Parteien", name_en: "Political Parties", count: 7, questions: [20, 41, 43, 73, 76, 78, 79], icon: "🗳️", desc: "Parteiensystem, Verfassungsmäßigkeit und politische Willensbildung", desc_en: "Party system, constitutionality, and forming political will" },
  { id: 11, name: "Pflichten", name_en: "Civic Duties", count: 8, questions: [3, 53, 95, 263, 266, 280, 282, 283], icon: "📋", desc: "Steuerpflicht, Schulpflicht, Rechtsgehorsam und Zeugenpflicht", desc_en: "Tax duties, school attendance, rule of law, and witness duty" },
  { id: 12, name: "Recht und Alltag", name_en: "Law and Daily Life", count: 36, questions: [104, 132, 136, 137, 138, 139, 140, 141, 142, 146, 147, 150, 241, 242, 246, 247, 248, 249, 250, 252, 254, 255, 258, 259, 264, 269, 271, 273, 275, 276, 284, 286, 287, 290, 293, 296], icon: "💼", desc: "Rechtsstaatlichkeit, Gerichte, Arbeitsrecht und Privatrecht", desc_en: "Rule of law, courts, employment law, and civil law" },
  { id: 13, name: "Religiöse Vielfalt", name_en: "Religious Diversity", count: 5, questions: [59, 66, 118, 182, 294], icon: "🕊️", desc: "Religionsfreiheit, Trennung von Staat und Kirche", desc_en: "Freedom of religion, separation of church and state" },
  { id: 14, name: "Sozialsystem", name_en: "Social Welfare System", count: 8, questions: [35, 36, 45, 97, 99, 100, 101, 285], icon: "🩺", desc: "Gesetzliche Sozialversicherungen und Solidarprinzip", desc_en: "Statutory social insurances and the principle of solidarity" },
  { id: 15, name: "Staatssymbole", name_en: "State Symbols", count: 6, questions: [21, 29, 40, 212, 214, 216], icon: "🦅", desc: "Bundesflagge, Nationalhymne, Wappen und Feiertage", desc_en: "Federal flag, national anthem, coat of arms, and public holidays" },
  { id: 16, name: "Verfassungsorgane", name_en: "Constitutional Organs", count: 30, questions: [13, 42, 44, 48, 55, 57, 58, 60, 65, 70, 71, 72, 74, 75, 77, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 98, 102, 143, 144], icon: "🏛️", desc: "Bundestag, Bundesrat, Bundespräsident, Kanzler & BVerfG", desc_en: "Bundestag, Bundesrat, Federal President, Chancellor & Supreme Court" },
  { id: 17, name: "Verfassungsprinzipien", name_en: "Constitutional Principles", count: 22, questions: [5, 6, 11, 22, 23, 26, 27, 28, 30, 31, 32, 33, 34, 38, 50, 51, 52, 54, 61, 63, 145, 171], icon: "⚖️", desc: "Demokratie, Republik, Sozialstaat, Rechtsstaat, Föderalismus", desc_en: "Democracy, republic, social state, rule of law, and federalism" },
  { id: 18, name: "Wahlen und Beteiligung", name_en: "Elections and Participation", count: 30, questions: [62, 92, 93, 94, 103, 105, 106, 107, 108, 109, 110, 112, 113, 114, 115, 116, 117, 119, 120, 121, 122, 123, 124, 125, 127, 128, 129, 130, 133, 135], icon: "🗳️", desc: "Wahlgrundsätze, 5%-Hürde, Erst- und Zweitstimme", desc_en: "Electoral principles, 5% hurdle, direct and party-list votes" },
  { id: 19, name: "Wichtige Stationen nach 1945", name_en: "Key Milestones Post-1945", count: 33, questions: [151, 165, 166, 167, 168, 169, 172, 174, 175, 176, 177, 178, 179, 180, 183, 184, 185, 186, 187, 188, 189, 190, 199, 202, 203, 207, 208, 209, 210, 211, 213, 217, 220], icon: "🕰️", desc: "Besatzungszonen, BRD & DDR Gründung, Mauerbau, Wirtschaftswunder", desc_en: "Occupation zones, FRG & GDR founding, Berlin Wall, economic miracle" },
  { id: 20, name: "Wiedervereinigung", name_en: "German Reunification", count: 15, questions: [191, 192, 193, 194, 195, 196, 197, 198, 200, 201, 204, 205, 215, 218, 228], icon: "🧱", desc: "Friedliche Revolution 1989, Fall der Mauer und 3. Oktober 1990", desc_en: "Peaceful Revolution 1989, fall of the Berlin Wall, and Oct 3, 1990" }
];

const GERMAN_STATES = [
  { code: 'BW', name: 'Baden-Württemberg', icon: '🦌' },
  { code: 'BY', name: 'Bayern', icon: '🦁' },
  { code: 'BE', name: 'Berlin', icon: '🐻' },
  { code: 'BB', name: 'Brandenburg', icon: '🦅' },
  { code: 'HB', name: 'Bremen', icon: '🗝️' },
  { code: 'HH', name: 'Hamburg', icon: '🏰' },
  { code: 'HE', name: 'Hessen', icon: '🦁' },
  { code: 'MV', name: 'Mecklenburg-Vorpommern', icon: '🐂' },
  { code: 'NI', name: 'Niedersachsen', icon: '🐎' },
  { code: 'NW', name: 'Nordrhein-Westfalen', icon: '🏛️' },
  { code: 'RP', name: 'Rheinland-Pfalz', icon: '🍇' },
  { code: 'SL', name: 'Saarland', icon: '⚒️' },
  { code: 'SN', name: 'Sachsen', icon: '⚔️' },
  { code: 'ST', name: 'Sachsen-Anhalt', icon: '🐻' },
  { code: 'SH', name: 'Schleswig-Holstein', icon: '⛵' },
  { code: 'TH', name: 'Thüringen', icon: '🌲' }
];

// Global State Object
let stateStore = {
  theme: 'light',
  userState: 'BY',
  appLanguage: 'de',
  stats: {
    skipped: 0,
    flagged: 0,
    correct: 0,
    incorrect: 0,
    attempted: 0,
    testAttempted: 0,
    testPassed: 0,
    testFailed: 0,
    streak: 1
  },
  answeredQuestionIds: [],
  userAnswers: {},
  userProgress: {},
  flaggedQuestionIds: [],
  flaggedQuestions: [],
  skippedQuestions: [],
  mockExamHistory: [],
  sessionProgress: {},
  dailyHistory: {},
  allQuestionsCache: []
};

// Quiz Module State
let activeQuizMode = 'session'; // 'session' | 'mock' | 'state'
let activeSessionId = null;
let sessionQueue = []; // FIFO queue
let activeQuestion = null;
let activeQuestionAnswered = false;
let activeQuestionSelectedOpt = null;
let currentLanguage = 'de';
let mockTimerInterval = null;
let mockTimeRemaining = 3600; // 60 mins

// Active In-Memory Variables for State Management
let userProgress = {};
let answersMap = {};
let completedSessions = new Set();
let flaggedSet = new Set();
let skippedQueue = [];

// Chart references
let todayChartInstance = null;
let dailyChartInstance = null;
let historyChartInstance = null;

// Initialize Store
function loadStateFromStorage() {
  try {
    const raw = localStorage.getItem('lid_state_v3');
    if (raw) {
      const parsed = JSON.parse(raw);
      stateStore = { ...stateStore, ...parsed };
    }

    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang === 'en' || savedLang === 'de') {
      stateStore.appLanguage = savedLang;
    } else if (!stateStore.appLanguage) {
      stateStore.appLanguage = 'de';
    }

    // Also check other individual keys if present
    const upRaw = localStorage.getItem('userProgress');
    if (upRaw) {
      try {
        stateStore.userProgress = JSON.parse(upRaw);
        stateStore.sessionProgress = { ...stateStore.sessionProgress, ...stateStore.userProgress };
      } catch (e) {}
    }

    const uaRaw = localStorage.getItem('userAnswers');
    if (uaRaw) {
      try {
        stateStore.userAnswers = JSON.parse(uaRaw);
        if (!stateStore.answeredQuestionIds || stateStore.answeredQuestionIds.length === 0) {
          stateStore.answeredQuestionIds = Object.keys(stateStore.userAnswers);
        }
      } catch (e) {}
    }

    const fqRaw = localStorage.getItem('flaggedQuestions');
    if (fqRaw) {
      try {
        const parsedFq = JSON.parse(fqRaw);
        if (Array.isArray(parsedFq)) stateStore.flaggedQuestionIds = parsedFq;
      } catch (e) {}
    }

    if (!stateStore.stats) stateStore.stats = {};
    if (!stateStore.sessionProgress) stateStore.sessionProgress = {};
    if (!stateStore.answeredQuestionIds) stateStore.answeredQuestionIds = [];
    if (!stateStore.flaggedQuestionIds) stateStore.flaggedQuestionIds = [];
    if (!stateStore.userAnswers) stateStore.userAnswers = {};
    if (!stateStore.skippedQuestions) stateStore.skippedQuestions = [];
    if (!stateStore.mockExamHistory) stateStore.mockExamHistory = [];
    if (!stateStore.dailyHistory) stateStore.dailyHistory = {};

    // Synchronize stats.attempted with unique answered question count
    stateStore.stats.attempted = stateStore.answeredQuestionIds.length;

    // Synchronize active in-memory variables
    userProgress = { ...(stateStore.sessionProgress || {}) };
    answersMap = { ...(stateStore.userAnswers || {}) };
    completedSessions = new Set(
      Object.keys(userProgress).filter(id => userProgress[id]?.completed)
    );
    flaggedSet = new Set(stateStore.flaggedQuestionIds || []);
    skippedQueue = [...(stateStore.skippedQuestions || [])];
  } catch (e) {
    console.warn("Storage load error:", e);
  }
}

function saveStateToStorage() {
  try {
    localStorage.setItem('lid_state_v3', JSON.stringify(stateStore));
    localStorage.setItem('appLanguage', stateStore.appLanguage || 'de');
    localStorage.setItem('userProgress', JSON.stringify(userProgress || {}));
    localStorage.setItem('userAnswers', JSON.stringify(answersMap || {}));
    localStorage.setItem('flaggedQuestions', JSON.stringify([...flaggedSet]));
    localStorage.setItem('skippedQuestions', JSON.stringify(skippedQueue || []));
    localStorage.setItem('mockExamHistory', JSON.stringify(stateStore.mockExamHistory || []));
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

// Calculate solved count for a session strictly from answersMap / stateStore
function getSolvedCountForSession(sessionId) {
  const session = OFFICIAL_SESSIONS.find(s => s.id === Number(sessionId));
  if (!session) return 0;
  const questionIds = (session.questions || session.questionIds || []).map(n => String(n));

  let solved = 0;
  questionIds.forEach(id => {
    if (answersMap && answersMap[id]) {
      solved++;
    } else if (stateStore.answeredQuestionIds && stateStore.answeredQuestionIds.includes(id)) {
      solved++;
    }
  });

  return Math.min(solved, session.count || questionIds.length);
}

// Helper: Calculate progress for a specific official BAMF session without overflow
function getCategoryProgress(sessionId) {
  const session = OFFICIAL_SESSIONS.find(s => s.id === Number(sessionId));
  if (!session) return { uniqueCount: 0, total: 0, percent: 0, completed: false, isStarted: false };

  const totalSessionQuestions = session.count || (session.questions ? session.questions.length : 0);
  const solvedCount = getSolvedCountForSession(sessionId);
  const percent = totalSessionQuestions > 0 ? Math.min(100, Math.round((solvedCount / totalSessionQuestions) * 100)) : 0;
  
  // A category can ONLY be completed if solvedCount equals totalSessionQuestions (and > 0)
  const completed = (solvedCount >= totalSessionQuestions) && (totalSessionQuestions > 0);
  const isStarted = (solvedCount > 0) && (solvedCount < totalSessionQuestions);

  return {
    uniqueCount: solvedCount,
    total: totalSessionQuestions,
    percent,
    completed,
    isStarted
  };
}

// Set Theme
function applyTheme(themeName) {
  stateStore.theme = themeName;
  document.documentElement.setAttribute('data-theme', themeName);
  document.body.setAttribute('data-theme', themeName);
  saveStateToStorage();
  
  // Highlight active theme button
  ['light', 'dark', 'blue'].forEach(t => {
    const btn = document.getElementById(`theme-btn-${t}`);
    if (btn) {
      if (t === themeName) {
        btn.classList.add('ring-2', 'ring-indigo-500', 'font-bold');
      } else {
        btn.classList.remove('ring-2', 'ring-indigo-500', 'font-bold');
      }
    }
  });

  renderCharts();
}

// -------------------------------------------------------------
// INTERNATIONALIZATION (I18N) SYSTEM
// -------------------------------------------------------------
const I18N_DICTIONARY = {
  de: {
    navDashboard: "Dashboard",
    headerSubtitle: "Einbürgerungstest & Test „Leben in Deutschland“",
    bamfStatusPrefix: "BAMF Auswertung: ",
    greetingMorgen: "Guten Morgen!",
    greetingTag: "Guten Tag!",
    greetingAbend: "Guten Abend!",
    subGreeting: "Willkommen zurück in Ihrer Vorbereitungsumgebung für den deutschen Einbürgerungstest.",
    bannerBamfLabel: "📅 Prüfungsauswertung BAMF:",
    overallProgress: "Gesamtfortschritt",
    questionsAttemptedPill: (n, total) => `Beantwortete Fragen (${n}/${total})`,
    streakPill: (n) => `Tages-Serie (${n} 🔥)`,
    readinessPill: (n) => `Prüfungsreife (${n}%)`,
    startPrepTitle: "Vorbereitung starten",
    startPrepDesc: "Üben Sie die 20 offiziellen BAMF Kategorien strukturiert.",
    startPrepBtn: "Kategorien &rarr;",
    mockExamTitle: "Zur Probeprüfung",
    mockExamDesc: "Offizielle BAMF Simulation: 33 Fragen in 60 Minuten.",
    mockExamBtn: "Prüfung starten &rarr;",
    readinessScoreLabel: "Prüfungsreife",
    readinessTargetLabel: "Ziel",
    readinessReadyTitle: "Bereit für die Prüfung!",
    readinessReadyDesc: "Hervorragende Vorbereitung. Sie haben realistische Chancen, die 17 erforderlichen Punkte sicher zu erreichen.",
    readinessReadyBadge: "PRÜFUNGSREIF",
    readinessNotReadyTitle: "Noch nicht prüfungsbereit",
    readinessNotReadyDesc: "Sie benötigen mindestens 17 von 33 Punkten im Einbürgerungstest. Üben Sie die 20 Kategorien, um Ihre Erfolgsquote zu steigern.",
    readinessNotReadyBadge: "IN VORBEREITUNG",
    statsGridHeading: "Statistiken & Trainings-Kennzahlen",
    statTitleSkipped: "Übersprungen",
    statSkippedSub: "Zurückgestellt",
    statTitleFlagged: "Markiert",
    statFlaggedSub: "Zur Wiederholung",
    statTitleCorrect: "Richtig",
    statCorrectSub: "Richtig beantwortet",
    statTitleIncorrect: "Falsch",
    statIncorrectSub: "Falsch beantwortet",
    statTitleAttempted: "Geübt",
    statAttemptedSub: "Fragen geübt",
    statTitleTestAttempted: "Probeprüfungen",
    statTestAttemptedSub: "Probeprüfungen",
    statTitleTestPassed: "Bestanden",
    statTestPassedSub: "Bestanden (≥ 17)",
    statTitleTestFailed: "Nicht bestanden",
    statTestFailedSub: "Nicht bestanden",
    translationPopoverTitle: "Mehrsprachige Übersetzung",
    aiModalHeaderTitle: "Didaktische Erläuterung & Kontext",
    taskInfoLabel: (num, remaining) => `Aufgabe ${num} • Verbleibend in Queue: ${remaining}`,
    taskBadgeLabel: (num) => `Aufgabe ${num}`,
    skipToastLabel: (num, remaining) => `Aufgabe ${num} ans Ende der Queue verschoben (Verbleibend: ${remaining})`,
    skipLastAlert: "Dies ist die letzte verbleibende Frage in dieser Queue.",
    feedbackCorrect: "✓ Richtig! Hervorragend geantwortet.",
    feedbackIncorrect: (sol) => `✕ Leider falsch. Die richtige Antwort ist <b>${sol.toUpperCase()}</b>.`,
    sessionsBadge: "📖 BAMF Gesamtfragenkatalog (Teil I, Aufgaben 1–300)",
    sessionsTitle: "Official BAMF Practice Sessions (20 Categories)",
    sessionsDesc: "20 eigenständige Lerneinheiten nach den offiziellen BAMF Themenschwerpunkten mit Skip-Queue & sofortiger Erfolgskontrolle.",
    filterAll: "Alle (20)",
    filterNotStarted: "Offen",
    filterInProgress: "In Arbeit",
    filterCompleted: "Abgeschlossen",
    searchPlaceholder: "Kategorie suchen...",
    sessionQuestionsUnit: "Fragen",
    sessionSolved: (unique, total) => `${unique} / ${total} gelöst`,
    sessionTasks: "Aufgaben",
    sessionMore: "weitere",
    sessionBtnReview: "Wiederholen",
    sessionBtnContinue: "Fortsetzen",
    sessionBtnStart: "Session starten",
    chartsHeading: "Aktivitäts- & Lernanalysen",
    todayChartTitle: "Today",
    todayChartSubtitle: "Heute aktiv",
    todayChartUnit: "Fragen",
    todayLegendCorrect: "Richtig",
    todayLegendIncorrect: "Falsch",
    todayLegendSkipped: "Übersprungen",
    dailyChartTitle: "Daily Progress",
    dailyChartSubtitle: "7-Tage-Verlauf",
    dailyChartFooterLeft: "Kontinuierliches Lernen",
    dailyChartFooterRight: (s) => `Streak: ${s} Tag 🔥`,
    mockChartTitle: "Mock Exam",
    mockChartSubtitle: "Simulation",
    mockRowQuestionsLabel: "Fragenanzahl",
    mockRowQuestionsVal: "33 Aufgaben",
    mockRowTimeLabel: "Zeitvorgabe",
    mockRowTimeVal: "60 Minuten",
    mockRowPassLabel: "Bestehensgrenze",
    mockRowPassVal: "mind. 17 Punkte",
    mockCardBtn: "Probeprüfung starten",
    stateChartTitle: "Bundesland",
    stateCardDesc: "10 bundeslandspezifische Fragen. In jeder BAMF-Prüfung erscheinen genau 3 Fragen zu Ihrem Bundesland.",
    stateCardBtn: "Bundesland wechseln &rarr;",
    stateStartBtn: "Bundesland üben (10 Fragen)",
    stateChangeBtn: "Bundesland wechseln",
    curriculumTitle: "Themenbereiche & Langzeittrend",
    curriculumDesc: "Übersicht der Fachgebiete nach BAMF-Rahmencurriculum und Trendanalyse.",
    area1Tag: "Bereich 1",
    area1Title: "Politik in der Demokratie",
    area1Catalog: "Aufgaben 1–150",
    area2Tag: "Bereich 2",
    area2Title: "Geschichte & Verantwortung",
    area2Catalog: "Aufgaben 151–240",
    area3Tag: "Bereich 3",
    area3Title: "Mensch & Gesellschaft",
    area3Catalog: "Aufgaben 241–300",
    area4Tag: "Bereich 4",
    area4Title: "Bundeslandfragen",
    area4Catalog: "160 Aufgaben",
    trendChartTitle: "Correct vs Incorrect (Lernverlauf über Zeit)",
    quizBtnSkip: "Überspringen",
    quizBtnNext: "Weiter",
    quizBtnFlag: "Markieren",
    quizBtnAi: "Erklärung",
    settingsTitle: "Einstellungen",
    settingsLangLabel: "App-Sprache / Language:",
    settingsLangDesc: "Stellt die Benutzeroberfläche um. Die amtlichen Prüfungsfragen verbleiben im deutschen Original.",
    settingsStateLabel: "Ihr Bundesland (für bundeslandspezifische Fragen):",
    settingsResetLabel: "Daten & Fortschritt zurücksetzen:",
    settingsResetDesc: "Löscht alle gespeicherten Trainingsstände, markierten Aufgaben und Prüfungsstatistiken auf diesem Gerät.",
    settingsResetBtn: "Alle Statistiken zurücksetzen",
    settingsCancelBtn: "Abbrechen",
    settingsSaveBtn: "Speichern",
    footerBrandDesc: "Interaktives Trainingsportal für den Einbürgerungstest und den Test „Leben in Deutschland“ des Bundesamtes für Migration und Flüchtlinge (BAMF).",
    footerQuickLinks: "QUICK LINKS",
    footerLinkDashboard: "Dashboard & Übersicht",
    footerLinkSessions: "20 BAMF Kategorien",
    footerLinkMockExam: "BAMF Probeprüfung (33 Fragen)",
    footerLinkBamfStatus: "BAMF Auswertungsstatus",
    footerResources: "RESOURCES",
    footerLinkBamfPortal: "Offizielles BAMF Portal",
    footerLinkQuestionsApi: "Fragenkatalog API (JSON)",
    footerLinkSessionsApi: "20 Sessions API",
    footerLinkTestCenters: "Zugelassene Prüfstellen",
    footerConnect: "CONNECT",
    footerConnectSub: "Lamplit Labs Open Source Initiative",
    footerCopyright: "© 2026 Leben in Deutschland • Lamplit Labs. Inoffizielles Bildungsportal für die deutsche Staatsbürgerschaftsprüfung."
  },
  en: {
    navDashboard: "Dashboard",
    headerSubtitle: "Naturalization Test & Test 'Life in Germany'",
    bamfStatusPrefix: "BAMF Evaluation: ",
    greetingMorgen: "Good Morning!",
    greetingTag: "Good Afternoon!",
    greetingAbend: "Good Evening!",
    subGreeting: "Welcome back to your preparation environment for the German naturalization test.",
    bannerBamfLabel: "📅 BAMF Exam Evaluation:",
    overallProgress: "Overall Progress",
    questionsAttemptedPill: (n, total) => `Questions Attempted (${n}/${total})`,
    streakPill: (n) => `Day Streak (${n} 🔥)`,
    readinessPill: (n) => `Exam Readiness (${n}%)`,
    startPrepTitle: "Start preparing",
    startPrepDesc: "Practice the 20 official BAMF categories in a structured way.",
    startPrepBtn: "Categories &rarr;",
    mockExamTitle: "To the mock exam",
    mockExamDesc: "Official BAMF simulation: 33 questions in 60 minutes.",
    mockExamBtn: "Start Exam &rarr;",
    readinessScoreLabel: "Exam Readiness",
    readinessTargetLabel: "Target",
    readinessReadyTitle: "Ready for the exam!",
    readinessReadyDesc: "Outstanding preparation. You have realistic chances of safely reaching the required 17 points.",
    readinessReadyBadge: "EXAM READY",
    readinessNotReadyTitle: "Not yet exam ready",
    readinessNotReadyDesc: "You need at least 17 out of 33 points in the naturalization test. Practice the 20 categories to increase your pass rate.",
    readinessNotReadyBadge: "IN PREPARATION",
    statsGridHeading: "Statistics & Training Metrics",
    statTitleSkipped: "Skipped",
    statSkippedSub: "Deferred / Skipped",
    statTitleFlagged: "Flagged",
    statFlaggedSub: "Bookmarked for review",
    statTitleCorrect: "Correct",
    statCorrectSub: "Answered correctly",
    statTitleIncorrect: "Incorrect",
    statIncorrectSub: "Answered incorrectly",
    statTitleAttempted: "Attempted",
    statAttemptedSub: "Questions practiced",
    statTitleTestAttempted: "Tests Taken",
    statTestAttemptedSub: "Mock exams taken",
    statTitleTestPassed: "Passed",
    statTestPassedSub: "Passed (≥ 17)",
    statTitleTestFailed: "Failed",
    statTestFailedSub: "Failed (< 17)",
    translationPopoverTitle: "Multilingual Translation",
    aiModalHeaderTitle: "Didactic Explanation & Context",
    taskInfoLabel: (num, remaining) => `Task ${num} • Remaining in queue: ${remaining}`,
    taskBadgeLabel: (num) => `Task ${num}`,
    skipToastLabel: (num, remaining) => `Task ${num} moved to end of queue (Remaining: ${remaining})`,
    skipLastAlert: "This is the last remaining question in this queue.",
    feedbackCorrect: "✓ Correct! Well done.",
    feedbackIncorrect: (sol) => `✕ Incorrect. The correct answer is <b>${sol.toUpperCase()}</b>.`,
    sessionsBadge: "📖 BAMF Complete Question Catalog (Part I, Tasks 1–300)",
    sessionsTitle: "Official BAMF Practice Sessions (20 Categories)",
    sessionsDesc: "20 standalone learning sessions covering the official BAMF topic areas with skip queue & immediate feedback.",
    filterAll: "All (20)",
    filterNotStarted: "Not Started",
    filterInProgress: "In Progress",
    filterCompleted: "Completed",
    searchPlaceholder: "Search category...",
    sessionQuestionsUnit: "Questions",
    sessionSolved: (unique, total) => `${unique} / ${total} solved`,
    sessionTasks: "Tasks",
    sessionMore: "more",
    sessionBtnReview: "Review",
    sessionBtnContinue: "Continue Session",
    sessionBtnStart: "Start Session",
    chartsHeading: "Activity & Learning Analytics",
    todayChartTitle: "Today",
    todayChartSubtitle: "Active today",
    todayChartUnit: "Questions",
    todayLegendCorrect: "Correct",
    todayLegendIncorrect: "Incorrect",
    todayLegendSkipped: "Skipped",
    dailyChartTitle: "Daily Progress",
    dailyChartSubtitle: "7-Day Trend",
    dailyChartFooterLeft: "Continuous learning",
    dailyChartFooterRight: (s) => `Streak: ${s} Day(s) 🔥`,
    mockChartTitle: "Mock Exam",
    mockChartSubtitle: "Simulation",
    mockRowQuestionsLabel: "Questions count",
    mockRowQuestionsVal: "33 tasks",
    mockRowTimeLabel: "Time limit",
    mockRowTimeVal: "60 minutes",
    mockRowPassLabel: "Passing mark",
    mockRowPassVal: "min. 17 points",
    mockCardBtn: "Start Mock Exam",
    stateChartTitle: "Federal State",
    stateCardDesc: "10 state-specific questions. Every BAMF exam contains exactly 3 questions about your federal state.",
    stateCardBtn: "Change State &rarr;",
    stateStartBtn: "Start State Session (10 Questions)",
    stateChangeBtn: "Change State",
    curriculumTitle: "Curriculum Areas & Long-Term Trend",
    curriculumDesc: "Overview of subject areas according to BAMF curriculum framework and trend analysis.",
    area1Tag: "Area 1",
    area1Title: "Politics in Democracy",
    area1Catalog: "Tasks 1–150",
    area2Tag: "Area 2",
    area2Title: "History & Responsibility",
    area2Catalog: "Tasks 151–240",
    area3Tag: "Area 3",
    area3Title: "People & Society",
    area3Catalog: "Tasks 241–300",
    area4Tag: "Area 4",
    area4Title: "Federal State Questions",
    area4Catalog: "160 Tasks",
    trendChartTitle: "Correct vs Incorrect (Learning Progress Over Time)",
    quizBtnSkip: "Skip",
    quizBtnNext: "Next",
    quizBtnFlag: "Flag",
    quizBtnAi: "AI Explanation",
    settingsTitle: "Settings",
    settingsLangLabel: "App Language / Sprache:",
    settingsLangDesc: "Changes the application interface language. Official exam questions remain in original German.",
    settingsStateLabel: "Your Federal State (for state-specific questions):",
    settingsResetLabel: "Reset Data & Progress:",
    settingsResetDesc: "Deletes all saved training progress, bookmarked tasks, and exam statistics on this device.",
    settingsResetBtn: "Reset All Statistics",
    settingsCancelBtn: "Cancel",
    settingsSaveBtn: "Save",
    footerBrandDesc: "Interactive training portal for the Naturalization Test and 'Life in Germany' test of the Federal Office for Migration and Refugees (BAMF).",
    footerQuickLinks: "QUICK LINKS",
    footerLinkDashboard: "Dashboard & Overview",
    footerLinkSessions: "20 BAMF Categories",
    footerLinkMockExam: "BAMF Mock Exam (33 Questions)",
    footerLinkBamfStatus: "BAMF Evaluation Status",
    footerResources: "RESOURCES",
    footerLinkBamfPortal: "Official BAMF Portal",
    footerLinkQuestionsApi: "Question Catalog API (JSON)",
    footerLinkSessionsApi: "20 Sessions API",
    footerLinkTestCenters: "Approved Test Centers",
    footerConnect: "CONNECT",
    footerConnectSub: "Lamplit Labs Open Source Initiative",
    footerCopyright: "© 2026 Life in Germany • Lamplit Labs. Unofficial educational portal for the German citizenship test."
  }
};

function applyAppLanguage(lang) {
  const chosenLang = (lang === 'en') ? 'en' : 'de';
  stateStore.appLanguage = chosenLang;
  try {
    localStorage.setItem('appLanguage', chosenLang);
  } catch (e) {}

  document.documentElement.lang = chosenLang;

  const sel = document.getElementById('settings-language-select');
  if (sel && sel.value !== chosenLang) {
    sel.value = chosenLang;
  }

  const dict = I18N_DICTIONARY[chosenLang] || I18N_DICTIONARY.de;

  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el && txt !== undefined) el.textContent = txt;
  };
  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el && html !== undefined) el.innerHTML = html;
  };

  // Nav & Header
  setTxt('nav-dashboard-link', dict.navDashboard);
  setTxt('header-subtitle', dict.headerSubtitle);
  
  // Greeting banner
  setTxt('user-subgreeting', dict.subGreeting);
  setTxt('banner-bamf-label', dict.bannerBamfLabel);
  setTxt('overall-progress-title', dict.overallProgress);

  // Action bars
  setTxt('start-prep-title', dict.startPrepTitle);
  setTxt('start-prep-desc', dict.startPrepDesc);
  setHtml('start-prep-btn', dict.startPrepBtn);

  setTxt('mock-exam-title', dict.mockExamTitle);
  setTxt('mock-exam-desc', dict.mockExamDesc);
  setHtml('mock-exam-btn', dict.mockExamBtn);

  // Readiness labels
  setTxt('readiness-score-label', dict.readinessScoreLabel);
  setTxt('readiness-target-label', dict.readinessTargetLabel);

  // 2x4 Stats Titles and Subtitles
  setTxt('stats-grid-heading', dict.statsGridHeading);
  setTxt('stat-title-skipped', dict.statTitleSkipped);
  setTxt('stat-skipped-sub', dict.statSkippedSub);
  setTxt('stat-title-flagged', dict.statTitleFlagged);
  setTxt('stat-flagged-sub', dict.statFlaggedSub);
  setTxt('stat-title-correct', dict.statTitleCorrect);
  setTxt('stat-correct-sub', dict.statCorrectSub);
  setTxt('stat-title-incorrect', dict.statTitleIncorrect);
  setTxt('stat-incorrect-sub', dict.statIncorrectSub);
  setTxt('stat-title-attempted', dict.statTitleAttempted);
  setTxt('stat-attempted-sub', dict.statAttemptedSub);
  setTxt('stat-title-test-attempted', dict.statTitleTestAttempted);
  setTxt('stat-test-attempted-sub', dict.statTestAttemptedSub);
  setTxt('stat-title-test-passed', dict.statTitleTestPassed);
  setTxt('stat-test-passed-sub', dict.statTestPassedSub);
  setTxt('stat-title-test-failed', dict.statTitleTestFailed);
  setTxt('stat-test-failed-sub', dict.statTestFailedSub);

  // Modal and Popover titles
  setTxt('translation-popover-title', dict.translationPopoverTitle);
  setTxt('ai-modal-header-title', dict.aiModalHeaderTitle);

  // 20 Sessions Section
  setTxt('sessions-section-badge', dict.sessionsBadge);
  setTxt('sessions-section-title', dict.sessionsTitle);
  setTxt('sessions-section-desc', dict.sessionsDesc);
  setTxt('filter-btn-all', dict.filterAll);
  setTxt('filter-btn-not-started', dict.filterNotStarted);
  setTxt('filter-btn-in-progress', dict.filterInProgress);
  setTxt('filter-btn-completed', dict.filterCompleted);
  const searchEl = document.getElementById('sessions-search-input');
  if (searchEl) searchEl.placeholder = dict.searchPlaceholder;

  // Charts Row
  setTxt('charts-heading', dict.chartsHeading);
  setTxt('today-chart-title', dict.todayChartTitle);
  setTxt('today-chart-subtitle', dict.todayChartSubtitle);
  setTxt('today-chart-unit', dict.todayChartUnit);
  setTxt('today-legend-correct', dict.todayLegendCorrect);
  setTxt('today-legend-incorrect', dict.todayLegendIncorrect);
  setTxt('today-legend-skipped', dict.todayLegendSkipped);
  setTxt('daily-chart-title', dict.dailyChartTitle);
  setTxt('daily-chart-subtitle', dict.dailyChartSubtitle);
  setTxt('daily-chart-footer-left', dict.dailyChartFooterLeft);
  setTxt('daily-chart-streak-text', dict.dailyChartFooterRight(stateStore.stats.streak || 1));
  setTxt('mock-chart-title', dict.mockChartTitle);
  setTxt('mock-chart-subtitle', dict.mockChartSubtitle);
  setTxt('mock-label-questions', dict.mockRowQuestionsLabel);
  setTxt('mock-val-questions', dict.mockRowQuestionsVal);
  setTxt('mock-label-time', dict.mockRowTimeLabel);
  setTxt('mock-val-time', dict.mockRowTimeVal);
  setTxt('mock-label-pass', dict.mockRowPassLabel);
  setTxt('mock-val-pass', dict.mockRowPassVal);
  setTxt('mock-start-btn', dict.mockCardBtn);
  setTxt('state-chart-title', dict.stateChartTitle);
  setTxt('state-card-desc', dict.stateCardDesc);
  setHtml('state-card-btn', dict.stateCardBtn);
  setTxt('state-start-btn-text', dict.stateStartBtn);
  setTxt('state-change-btn-text', dict.stateChangeBtn);

  // Curriculum Area
  setTxt('curriculum-title', dict.curriculumTitle);
  setTxt('curriculum-desc', dict.curriculumDesc);
  setTxt('area-1-tag', dict.area1Tag);
  setTxt('area-1-title', dict.area1Title);
  setTxt('area-1-catalog', dict.area1Catalog);
  setTxt('area-2-tag', dict.area2Tag);
  setTxt('area-2-title', dict.area2Title);
  setTxt('area-2-catalog', dict.area2Catalog);
  setTxt('area-3-tag', dict.area3Tag);
  setTxt('area-3-title', dict.area3Title);
  setTxt('area-3-catalog', dict.area3Catalog);
  setTxt('area-4-tag', dict.area4Tag);
  setTxt('area-4-title', dict.area4Title);
  setTxt('area-4-catalog', dict.area4Catalog);
  setTxt('trend-chart-title', dict.trendChartTitle);

  // In-Quiz buttons
  setTxt('btn-quiz-skip-text', dict.quizBtnSkip);
  setTxt('btn-quiz-next-text', dict.quizBtnNext);
  setTxt('btn-quiz-flag-text', dict.quizBtnFlag);
  setTxt('btn-quiz-ai-text', dict.quizBtnAi);

  // Settings modal
  setTxt('settings-modal-title', dict.settingsTitle);
  setTxt('settings-lang-label', dict.settingsLangLabel);
  setTxt('settings-lang-desc', dict.settingsLangDesc);
  setTxt('settings-state-label', dict.settingsStateLabel);
  setTxt('settings-reset-label', dict.settingsResetLabel);
  setTxt('settings-reset-desc', dict.settingsResetDesc);
  setTxt('settings-reset-btn-text', dict.settingsResetBtn);
  setTxt('settings-cancel-btn', dict.settingsCancelBtn);
  setTxt('settings-save-btn', dict.settingsSaveBtn);

  // Footer
  setTxt('footer-brand-desc', dict.footerBrandDesc);
  setTxt('footer-heading-quicklinks', dict.footerQuickLinks);
  setTxt('footer-link-dashboard', dict.footerLinkDashboard);
  setTxt('footer-link-sessions', dict.footerLinkSessions);
  setTxt('footer-link-mockexam', dict.footerLinkMockExam);
  setTxt('footer-link-bamfstatus', dict.footerLinkBamfStatus);
  setTxt('footer-heading-resources', dict.footerResources);
  setTxt('footer-link-bamfportal', dict.footerLinkBamfPortal);
  setTxt('footer-link-questionsapi', dict.footerLinkQuestionsApi);
  setTxt('footer-link-sessionsapi', dict.footerLinkSessionsApi);
  setTxt('footer-link-testcenters', dict.footerLinkTestCenters);
  setTxt('footer-heading-connect', dict.footerConnect);
  setTxt('footer-connect-sub', dict.footerConnectSub);
  setTxt('footer-copyright', dict.footerCopyright);

  updateGreeting();
  updateDashboardTopStats();
  renderOfficialSessionsGrid();
}

// Greeting Banner
function updateGreeting() {
  const hour = new Date().getHours();
  const isEn = stateStore.appLanguage === 'en';
  const dict = I18N_DICTIONARY[isEn ? 'en' : 'de'];
  let greeting = dict.greetingTag;
  if (hour < 12) {
    greeting = dict.greetingMorgen;
  } else if (hour >= 18) {
    greeting = dict.greetingAbend;
  }
  
  const el = document.getElementById('user-greeting');
  if (el) el.textContent = greeting;
}

// Overall Readiness Calculation
function calculateReadiness() {
  const uniqueAttempted = (stateStore.answeredQuestionIds || []).length;
  const correct = stateStore.stats.correct || 0;
  const targetQuestions = 310; // 300 general + 10 state
  
  const accuracy = uniqueAttempted > 0 ? (correct / uniqueAttempted) : 0;
  const coverage = Math.min(1, uniqueAttempted / targetQuestions);
  // Weighted readiness score
  const readinessPercent = Math.min(100, Math.round((accuracy * 0.7 + coverage * 0.3) * 100));

  return {
    readinessPercent,
    attempted: uniqueAttempted,
    correct,
    targetQuestions,
    isReady: readinessPercent >= 50 && (stateStore.stats.testPassed > 0 || correct >= 60)
  };
}

// Update Top Dashboard UI Stats
function updateDashboardTopStats() {
  const readiness = calculateReadiness();
  const isEn = stateStore.appLanguage === 'en';
  const dict = I18N_DICTIONARY[isEn ? 'en' : 'de'];
  
  // Overall Progress Bar
  const progPercent = Math.min(100, Math.round((readiness.attempted / readiness.targetQuestions) * 100));
  const progBar = document.getElementById('overall-progress-bar');
  if (progBar) progBar.style.width = `${progPercent}%`;
  
  const progText = document.getElementById('overall-progress-text');
  if (progText) progText.textContent = `${progPercent}%`;

  // Stat Pills
  const pillAttempted = document.getElementById('pill-questions-attempted');
  if (pillAttempted) pillAttempted.textContent = dict.questionsAttemptedPill(readiness.attempted, readiness.targetQuestions);

  const pillStreak = document.getElementById('pill-streak');
  if (pillStreak) pillStreak.textContent = dict.streakPill(stateStore.stats.streak || 1);

  const pillReadiness = document.getElementById('pill-readiness');
  if (pillReadiness) pillReadiness.textContent = dict.readinessPill(readiness.readinessPercent);

  // Action Bar Circular Ring
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progPercent / 100) * circ;
  const circle = document.getElementById('start-prep-circle');
  if (circle) {
    circle.style.strokeDasharray = `${circ}`;
    circle.style.strokeDashoffset = `${offset}`;
  }
  const ringText = document.getElementById('start-prep-percent');
  if (ringText) ringText.textContent = `${progPercent}%`;

  // Readiness Card UI
  const readinessBadge = document.getElementById('readiness-badge');
  const readinessIcon = document.getElementById('readiness-status-icon');
  const readinessTitle = document.getElementById('readiness-title');
  const readinessDesc = document.getElementById('readiness-desc');
  const readinessScore = document.getElementById('readiness-score');

  if (readinessScore) readinessScore.textContent = `${readiness.readinessPercent}%`;

  if (readiness.isReady) {
    if (readinessIcon) readinessIcon.innerHTML = `<span class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">✓</span>`;
    if (readinessTitle) readinessTitle.textContent = dict.readinessReadyTitle;
    if (readinessDesc) readinessDesc.textContent = dict.readinessReadyDesc;
    if (readinessBadge) {
      readinessBadge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800";
      readinessBadge.textContent = dict.readinessReadyBadge;
    }
  } else {
    if (readinessIcon) readinessIcon.innerHTML = `<span class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">✕</span>`;
    if (readinessTitle) readinessTitle.textContent = dict.readinessNotReadyTitle;
    if (readinessDesc) readinessDesc.textContent = dict.readinessNotReadyDesc;
    if (readinessBadge) {
      readinessBadge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800";
      readinessBadge.textContent = dict.readinessNotReadyBadge;
    }
  }

  // 2x4 Statistics Grid
  const stats = stateStore.stats;
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('stat-skipped', stats.skipped || 0);
  setEl('stat-flagged', (stateStore.flaggedQuestionIds || []).length);
  setEl('stat-correct', stats.correct || 0);
  setEl('stat-incorrect', stats.incorrect || 0);
  setEl('stat-attempted', readiness.attempted || 0);
  setEl('stat-test-attempted', stats.testAttempted || 0);
  setEl('stat-test-passed', stats.testPassed || 0);
  setEl('stat-test-failed', stats.testFailed || 0);

  // State Card
  const stateObj = GERMAN_STATES.find(s => s.code === stateStore.userState) || GERMAN_STATES[1];
  const stateNameEl = document.getElementById('card-state-name');
  if (stateNameEl) stateNameEl.textContent = stateObj.name;
  const stateCodeEl = document.getElementById('card-state-code');
  if (stateCodeEl) stateCodeEl.textContent = stateObj.code;
  const stateIconEl = document.getElementById('card-state-icon');
  if (stateIconEl) stateIconEl.textContent = stateObj.icon || '🏛️';
}

// Fetch BAMF Evaluation & Stats
async function fetchBamfStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return;
    const data = await res.json();
    
    const evalDate = data.currentExamDate || '03.07.2026';
    const headerPill = document.getElementById('header-bamf-status');
    if (headerPill) {
      headerPill.textContent = `BAMF Auswertung: ${evalDate}`;
    }
    const dashEval = document.getElementById('dash-bamf-date');
    if (dashEval) dashEval.textContent = evalDate;
  } catch (err) {
    console.warn("Error fetching BAMF stats:", err);
  }
}

// -------------------------------------------------------------
// 20 OFFICIAL BAMF CATEGORY SESSIONS RENDER
// -------------------------------------------------------------
let activeSessionFilter = 'all';

function renderOfficialSessionsGrid() {
  const container = document.getElementById('official-sessions-container');
  if (!container) return;

  const isEn = stateStore.appLanguage === 'en';
  const dict = I18N_DICTIONARY[isEn ? 'en' : 'de'];
  const searchInput = (document.getElementById('sessions-search-input')?.value || '').toLowerCase().trim();

  const filtered = OFFICIAL_SESSIONS.filter(session => {
    const sName = session.name.toLowerCase();
    const sNameEn = (session.name_en || '').toLowerCase();
    if (searchInput && !sName.includes(searchInput) && !sNameEn.includes(searchInput) && !String(session.id).includes(searchInput)) {
      return false;
    }
    const progress = getCategoryProgress(session.id);
    const isCompleted = progress.completed;
    const isInProgress = progress.isStarted;
    const isNotStarted = progress.uniqueCount === 0 && !isCompleted;

    if (activeSessionFilter === 'completed') return isCompleted;
    if (activeSessionFilter === 'in-progress') return isInProgress;
    if (activeSessionFilter === 'not-started') return isNotStarted;

    return true;
  });

  if (filtered.length === 0) {
    const emptyMsg = isEn ? 'No categories found for this filter.' : 'Keine Kategorien für diesen Filter gefunden.';
    container.innerHTML = `
      <div class="col-span-full py-10 text-center theme-card rounded-xl border border-slate-200">
        <span class="text-3xl block mb-2">🔍</span>
        <p class="text-sm theme-text-muted">${emptyMsg}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(session => {
    const solvedCount = getSolvedCountForSession(session.id);
    const totalQuestions = (session.questions || session.questionIds || []).length || session.count || 0;
    const currentLang = stateStore.appLanguage || 'de';

    let buttonText = "";
    let buttonClass = "";

    if (solvedCount === 0) {
      buttonText = (currentLang === 'en') ? "Start Session →" : "Session starten →";
      buttonClass = "btn-primary w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition bg-slate-900 text-white hover:bg-slate-800";
    } else if (solvedCount < totalQuestions) {
      buttonText = (currentLang === 'en') ? "Continue Session →" : "Fortsetzen →";
      buttonClass = "btn-secondary w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm";
    } else {
      buttonText = (currentLang === 'en') ? "Review →" : "Wiederholen →";
      buttonClass = "btn-outline-success w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200";
    }

    const isCompleted = (solvedCount === totalQuestions) && totalQuestions > 0;
    const isInProgress = (solvedCount > 0) && (solvedCount < totalQuestions);
    const percent = totalQuestions > 0 ? Math.min(100, Math.round((solvedCount / totalQuestions) * 100)) : 0;

    // Range preview
    const qList = session.questions || session.questionIds || [];
    let rangePreview = '';
    const taskPrefix = isEn ? 'Tasks' : 'Aufgaben';
    const moreSuffix = isEn ? 'more' : 'weitere';
    if (qList.length <= 5) {
      rangePreview = `${taskPrefix} ${qList.join(', ')}`;
    } else {
      rangePreview = `${taskPrefix} ${qList.slice(0, 4).join(', ')} ... (+${qList.length - 4} ${moreSuffix})`;
    }

    const radius = 17;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (percent / 100) * circ;

    const countLabel = `${session.count} ${dict.sessionQuestionsUnit}`;
    const solvedLabel = dict.sessionSolved(solvedCount, totalQuestions);
    const displayName = isEn && session.name_en ? session.name_en : session.name;
    const displayDesc = isEn && session.desc_en ? session.desc_en : session.desc;

    return `
      <div class="theme-card rounded-xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${isCompleted ? 'bg-emerald-100 text-emerald-800' : (isInProgress ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700')}">
              <span>${session.icon}</span>
              <span>Session ${session.id}</span>
            </span>

            <!-- Circular Progress Ring -->
            <div class="relative w-10 h-10 flex items-center justify-center">
              <svg class="w-10 h-10" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="${radius}" fill="transparent" stroke="currentColor" stroke-opacity="0.1" stroke-width="3.5"></circle>
                <circle class="progress-ring-circle" cx="22" cy="22" r="${radius}" fill="transparent" stroke="${isCompleted ? '#10b981' : (isInProgress ? '#4f46e5' : 'currentColor')}" stroke-width="3.5" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round"></circle>
              </svg>
              <span class="absolute text-[10px] font-bold ${isCompleted ? 'text-emerald-700' : 'theme-text-muted'}">${percent}%</span>
            </div>
          </div>

          <h4 class="font-bold text-base leading-snug group-hover:text-indigo-600 transition">
            ${displayName}
          </h4>

          <p class="text-xs theme-text-muted mt-1 line-clamp-2">
            ${displayDesc}
          </p>

          <div class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs theme-text-muted">
            <div class="flex items-center justify-between mb-1">
              <span>${countLabel}</span>
              <span class="font-semibold ${isCompleted ? 'text-emerald-600' : ''}">${solvedLabel}</span>
            </div>
            <p class="text-[11px] opacity-75 font-mono truncate" title="${rangePreview}">${rangePreview}</p>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button onclick="startSession(${session.id})" class="${buttonClass}">
            <span>${buttonText}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function setSessionFilter(filter) {
  activeSessionFilter = filter;
  ['all', 'not-started', 'in-progress', 'completed'].forEach(f => {
    const btn = document.getElementById(`filter-btn-${f}`);
    if (btn) {
      if (f === filter) {
        btn.classList.add('bg-slate-900', 'text-white');
        btn.classList.remove('bg-white', 'text-slate-600');
      } else {
        btn.classList.remove('bg-slate-900', 'text-white');
        btn.classList.add('bg-white', 'text-slate-600');
      }
    }
  });
  renderOfficialSessionsGrid();
}

// -------------------------------------------------------------
// INTERACTIVE CHARTS (CHART.JS)
// -------------------------------------------------------------
function renderCharts() {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  const isEn = stateStore.appLanguage === 'en';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';

  // 1. TODAY DONUT CHART
  const todayCanvas = document.getElementById('todayDonutChart');
  if (todayCanvas && window.Chart) {
    if (todayChartInstance) todayChartInstance.destroy();

    const correct = stateStore.stats.correct || 0;
    const incorrect = stateStore.stats.incorrect || 0;
    const skipped = stateStore.stats.skipped || 0;
    const totalToday = correct + incorrect + skipped;

    const donutLabels = isEn ? ['Correct', 'Incorrect', 'Skipped'] : ['Richtig', 'Falsch', 'Übersprungen'];

    todayChartInstance = new Chart(todayCanvas, {
      type: 'doughnut',
      data: {
        labels: donutLabels,
        datasets: [{
          data: totalToday > 0 ? [correct, incorrect, skipped] : [1, 0, 0],
          backgroundColor: totalToday > 0 ? ['#10b981', '#ef4444', '#f59e0b'] : ['#e2e8f0', '#e2e8f0', '#e2e8f0'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        cutout: '72%'
      }
    });

    const todayCenterText = document.getElementById('today-chart-total');
    if (todayCenterText) todayCenterText.textContent = totalToday;
  }

  // 2. DAILY PROGRESS LINE CHART
  const dailyCanvas = document.getElementById('dailyProgressChart');
  if (dailyCanvas && window.Chart) {
    if (dailyChartInstance) dailyChartInstance.destroy();

    const days = isEn ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const currentAttempted = (stateStore.answeredQuestionIds || []).length;
    // When 0 attempted (e.g. after reset), show all 0s
    const sampleData = currentAttempted > 0 ? [4, 8, 12, 7, 15, 20, currentAttempted] : [0, 0, 0, 0, 0, 0, 0];

    dailyChartInstance = new Chart(dailyCanvas, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: isEn ? 'Answered Questions' : 'Beantwortete Fragen',
          data: sampleData,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#4f46e5'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } }, beginAtZero: true }
        }
      }
    });
  }

  // 3. CORRECT VS INCORRECT TIME SERIES CHART
  const historyCanvas = document.getElementById('correctVsIncorrectChart');
  if (historyCanvas && window.Chart) {
    if (historyChartInstance) historyChartInstance.destroy();

    const labels = isEn ? ['W 35', 'W 36', 'W 37', 'W 38', 'Current'] : ['KW 35', 'KW 36', 'KW 37', 'KW 38', 'Aktuell'];
    const currentAttempted = (stateStore.answeredQuestionIds || []).length;
    const correctData = currentAttempted > 0 ? [5, 12, 18, 25, stateStore.stats.correct || 0] : [0, 0, 0, 0, 0];
    const incorrectData = currentAttempted > 0 ? [2, 4, 3, 6, stateStore.stats.incorrect || 0] : [0, 0, 0, 0, 0];

    historyChartInstance = new Chart(historyCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: isEn ? 'Correct' : 'Richtig',
            data: correctData,
            backgroundColor: '#10b981',
            borderRadius: 4
          },
          {
            label: isEn ? 'Incorrect' : 'Falsch',
            data: incorrectData,
            backgroundColor: '#ef4444',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: textColor, boxWidth: 12 } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor }, beginAtZero: true }
        }
      }
    });
  }
}

// -------------------------------------------------------------
// QUIZ & PRACTICE CONTROLLER
// -------------------------------------------------------------
async function startOfficialSession(sessionId) {
  activeQuizMode = 'session';
  activeSessionId = sessionId;
  currentLanguage = 'de';

  try {
    const res = await fetch(`/api/sessions/${sessionId}`);
    if (!res.ok) throw new Error("Could not load session questions");
    const data = await res.json();

    const questions = data.questionsList || [];
    if (questions.length === 0) {
      alert("Keine Fragen für diese Session gefunden.");
      return;
    }

    // Initialize FIFO queue
    sessionQueue = [...questions];
    activeQuestion = null;
    activeQuestionAnswered = false;
    activeQuestionSelectedOpt = null;

    document.getElementById('modal-session-title').textContent = `${data.icon || '🎯'} Session ${data.id}: ${data.name}`;
    openQuizModal();
    loadNextFromQueue();
  } catch (err) {
    alert("Fehler beim Starten der Session: " + err.message);
  }
}

// Start Mock Exam
async function startMockExam() {
  activeQuizMode = 'mock';
  activeSessionId = null;
  currentLanguage = 'de';

  try {
    const res = await fetch(`/api/mock-exam?state=${stateStore.userState}`);
    if (!res.ok) throw new Error("Could not generate mock exam");
    const data = await res.json();

    sessionQueue = [...data.questions];
    activeQuestion = null;
    activeQuestionAnswered = false;
    activeQuestionSelectedOpt = null;

    document.getElementById('modal-session-title').textContent = `📝 BAMF Probeprüfung (33 Fragen)`;
    openQuizModal();
    startMockTimer();
    loadNextFromQueue();
  } catch (err) {
    alert("Fehler beim Starten der Probeprüfung: " + err.message);
  }
}

// Start Federal State Practice Session (Aufgaben 301 to 310)
async function loadStateQuestions(selectedStateCode) {
  const code = (selectedStateCode || stateStore.userState || 'BY').toUpperCase();
  const stateObj = GERMAN_STATES.find(s => s.code === code) || GERMAN_STATES[1];
  activeQuizMode = 'state';
  activeSessionId = `state-${code}`;
  currentLanguage = 'de';

  try {
    const res = await fetch(`/api/state-session/${code}`);
    if (!res.ok) throw new Error("Could not load state questions");
    const data = await res.json();

    const questions = data.questionsList || [];
    if (questions.length === 0) {
      alert("Keine landesspezifischen Fragen für dieses Bundesland gefunden.");
      return;
    }

    sessionQueue = [...questions];
    activeQuestion = null;
    activeQuestionAnswered = false;
    activeQuestionSelectedOpt = null;

    const isEn = stateStore.appLanguage === 'en';
    const title = isEn 
      ? `${stateObj.icon || '🏛️'} State Session: ${stateObj.name} (Tasks 301–310)` 
      : `${stateObj.icon || '🏛️'} Bundesland-Session: ${stateObj.name} (Aufgaben 301–310)`;

    const modalTitle = document.getElementById('modal-session-title');
    if (modalTitle) modalTitle.textContent = title;

    openQuizModal();
    loadNextFromQueue();
  } catch (err) {
    alert("Fehler beim Starten der Bundesland-Session: " + err.message);
  }
}

function startSession(sessionTarget) {
  if (typeof sessionTarget === 'string' && sessionTarget.startsWith('state-')) {
    const code = sessionTarget.replace('state-', '');
    loadStateQuestions(code);
  } else {
    startOfficialSession(Number(sessionTarget));
  }
}

function startMockTimer() {
  clearInterval(mockTimerInterval);
  mockTimeRemaining = 3600; // 60 mins
  const timerBadge = document.getElementById('quiz-timer-badge');
  if (timerBadge) timerBadge.classList.remove('hidden');

  mockTimerInterval = setInterval(() => {
    mockTimeRemaining--;
    const mins = Math.floor(mockTimeRemaining / 60);
    const secs = mockTimeRemaining % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const timerText = document.getElementById('quiz-timer-text');
    if (timerText) timerText.textContent = timeStr;

    if (mockTimeRemaining <= 0) {
      clearInterval(mockTimerInterval);
      alert("Die Prüfungszeit von 60 Minuten ist abgelaufen!");
      finishActiveQuiz();
    }
  }, 1000);
}

function openQuizModal() {
  const modal = document.getElementById('quiz-modal');
  if (modal) modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  // Hide popovers
  hideTranslationPopover();
  hideAiExplanationPanel();
}

function closeQuizModal() {
  clearInterval(mockTimerInterval);
  const timerBadge = document.getElementById('quiz-timer-badge');
  if (timerBadge) timerBadge.classList.add('hidden');

  const modal = document.getElementById('quiz-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
  
  updateDashboardTopStats();
  renderOfficialSessionsGrid();
  renderCharts();
}

function loadNextFromQueue() {
  if (sessionQueue.length === 0) {
    finishActiveQuiz();
    return;
  }

  activeQuestion = sessionQueue[0];
  activeQuestionAnswered = false;
  activeQuestionSelectedOpt = null;

  renderActiveQuestionUI();
}

function renderActiveQuestionUI() {
  if (!activeQuestion) return;

  const isEn = stateStore.appLanguage === 'en';
  const dict = I18N_DICTIONARY[isEn ? 'en' : 'de'];
  const taskLabel = activeQuestion.taskNum || activeQuestion.num;

  // Queue info
  const countEl = document.getElementById('quiz-queue-info');
  if (countEl) countEl.textContent = dict.taskInfoLabel(taskLabel, sessionQueue.length);

  // Check Flag state
  const isFlagged = (stateStore.flaggedQuestionIds || []).includes(String(activeQuestion.num));
  const flagBtn = document.getElementById('btn-quiz-flag');
  if (flagBtn) {
    if (isFlagged) {
      flagBtn.classList.add('text-rose-600', 'bg-rose-50', 'border-rose-300');
      flagBtn.classList.remove('text-slate-600');
    } else {
      flagBtn.classList.remove('text-rose-600', 'bg-rose-50', 'border-rose-300');
      flagBtn.classList.add('text-slate-600');
    }
  }

  // CRITICAL FIX: The primary question card MUST ALWAYS remain 100% in official German by default!
  const qText = activeQuestion.question;
  const optA = activeQuestion.a;
  const optB = activeQuestion.b;
  const optC = activeQuestion.c;
  const optD = activeQuestion.d;

  const container = document.getElementById('quiz-question-box');
  if (!container) return;

  const sol = (activeQuestion.solution || '').toLowerCase().trim();

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="inline-block px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-bold mb-2">
            ${dict.taskBadgeLabel(taskLabel)}
          </span>
          <span class="text-xs theme-text-muted ml-2">${activeQuestion.category || ''}</span>
          <h3 class="text-base sm:text-lg font-bold leading-relaxed whitespace-pre-line">
            ${qText}
          </h3>
        </div>
      </div>

      <!-- Question Image Container (Coat of Arms, Maps, Diagrams) -->
      ${(() => {
        const rawImg = activeQuestion.image || activeQuestion.imageUrl || activeQuestion.img;
        if (!rawImg || rawImg === '-' || rawImg === 'null' || rawImg.trim() === '') {
          return '';
        }
        const trimmed = rawImg.trim();
        const imgSrc = trimmed.startsWith('http') || trimmed.startsWith('/') ? trimmed : '/images/' + trimmed;
        const taskNum = activeQuestion.num || activeQuestion.taskNum || '';
        return `
          <div class="question-image-container my-3 text-center">
            <img src="${imgSrc}" 
                 alt="Aufgabe ${taskNum} Abbildung" 
                 class="img-fluid rounded border shadow-sm max-h-60 mx-auto"
                 onerror="if (!this.dataset.fallback && this.src.startsWith('http')) { this.dataset.fallback = '1'; this.src = '/images/' + this.src.split('/').pop(); } else if (!this.dataset.fallback && this.src.includes('/images/')) { this.dataset.fallback = '1'; this.src = '${trimmed}'; } else { this.parentElement.style.display = 'none'; }" />
          </div>
        `;
      })()}

      <!-- Options A, B, C, D (Always original official German) -->
      <div class="space-y-2.5 pt-2">
        ${renderOptionBtn('a', optA, sol)}
        ${renderOptionBtn('b', optB, sol)}
        ${renderOptionBtn('c', optC, sol)}
        ${renderOptionBtn('d', optD, sol)}
      </div>

      <!-- Feedback Banner after answering -->
      <div id="quiz-answer-feedback" class="hidden mt-4 p-4 rounded-xl text-sm font-medium"></div>
    </div>
  `;

  // Update Next Button state
  const nextBtn = document.getElementById('btn-quiz-next');
  if (nextBtn) {
    nextBtn.disabled = !activeQuestionAnswered;
  }

  // Update live translation popover if open
  updateTranslationPopoverContent();
}

function renderOptionBtn(optKey, optText, solutionKey) {
  let styleClass = "border border-slate-200 hover:border-indigo-400 bg-white dark:bg-slate-800";
  let letterBadge = "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200";

  if (activeQuestionAnswered) {
    if (optKey === solutionKey) {
      styleClass = "border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold";
      letterBadge = "bg-emerald-500 text-white";
    } else if (activeQuestionSelectedOpt === optKey) {
      styleClass = "border-2 border-rose-500 bg-rose-50 text-rose-950 font-semibold";
      letterBadge = "bg-rose-500 text-white";
    } else {
      styleClass = "border border-slate-200 opacity-60 bg-white";
    }
  }

  return `
    <button onclick="selectOption('${optKey}')" ${activeQuestionAnswered ? 'disabled' : ''} class="w-full text-left p-3.5 rounded-xl transition flex items-center space-x-3 ${styleClass}">
      <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${letterBadge}">
        ${optKey.toUpperCase()}
      </span>
      <span class="text-sm leading-normal flex-1">${optText}</span>
    </button>
  `;
}

// User selects an option
function selectOption(optKey) {
  if (activeQuestionAnswered || !activeQuestion) return;

  activeQuestionAnswered = true;
  activeQuestionSelectedOpt = optKey;
  const sol = (activeQuestion.solution || '').toLowerCase().trim();
  const isCorrect = (optKey === sol);
  const qNum = String(activeQuestion.num);

  // Track unique answered questions
  const isFirstTime = !stateStore.answeredQuestionIds.includes(qNum);
  if (isFirstTime) {
    stateStore.answeredQuestionIds.push(qNum);
    stateStore.stats.attempted = (stateStore.stats.attempted || 0) + 1;
    if (isCorrect) {
      stateStore.stats.correct = (stateStore.stats.correct || 0) + 1;
    } else {
      stateStore.stats.incorrect = (stateStore.stats.incorrect || 0) + 1;
    }
  }

  // Record user answers map
  if (!stateStore.userAnswers) stateStore.userAnswers = {};
  stateStore.userAnswers[qNum] = {
    selected: optKey,
    isCorrect,
    solution: sol,
    timestamp: Date.now()
  };
  answersMap[qNum] = stateStore.userAnswers[qNum];

  // Update session progress
  if (activeQuizMode === 'session' && activeSessionId) {
    if (!stateStore.sessionProgress) stateStore.sessionProgress = {};
    const sp = stateStore.sessionProgress[activeSessionId] || { answeredQuestionIds: [], completed: false };
    if (!sp.answeredQuestionIds) sp.answeredQuestionIds = [];
    if (!sp.answeredQuestionIds.includes(qNum)) {
      sp.answeredQuestionIds.push(qNum);
    }
    
    // Check if session completed
    const sessionDef = OFFICIAL_SESSIONS.find(s => s.id === activeSessionId);
    if (sessionDef && sp.answeredQuestionIds.length >= sessionDef.count) {
      sp.completed = true;
      completedSessions.add(activeSessionId);
    }
    stateStore.sessionProgress[activeSessionId] = sp;
    
    if (!stateStore.userProgress) stateStore.userProgress = {};
    stateStore.userProgress[activeSessionId] = sp;
    userProgress[activeSessionId] = sp;
  } else if (activeQuizMode === 'state' && activeSessionId) {
    if (!stateStore.sessionProgress) stateStore.sessionProgress = {};
    const sp = stateStore.sessionProgress[activeSessionId] || { answeredQuestionIds: [], completed: false };
    if (!sp.answeredQuestionIds) sp.answeredQuestionIds = [];
    if (!sp.answeredQuestionIds.includes(qNum)) {
      sp.answeredQuestionIds.push(qNum);
    }
    if (sp.answeredQuestionIds.length >= 10) {
      sp.completed = true;
      completedSessions.add(activeSessionId);
    }
    stateStore.sessionProgress[activeSessionId] = sp;
    if (!stateStore.userProgress) stateStore.userProgress = {};
    stateStore.userProgress[activeSessionId] = sp;
    userProgress[activeSessionId] = sp;
  }

  saveStateToStorage();
  renderActiveQuestionUI();

  // Show Feedback banner
  const feedbackBox = document.getElementById('quiz-answer-feedback');
  if (feedbackBox) {
    const isEn = stateStore.appLanguage === 'en';
    const dict = I18N_DICTIONARY[isEn ? 'en' : 'de'];
    feedbackBox.classList.remove('hidden');
    if (isCorrect) {
      feedbackBox.className = "mt-4 p-4 rounded-xl text-sm font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2";
      feedbackBox.innerHTML = `<span>${dict.feedbackCorrect}</span>`;
    } else {
      feedbackBox.className = "mt-4 p-4 rounded-xl text-sm font-semibold bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-2";
      feedbackBox.innerHTML = `<span>${dict.feedbackIncorrect(sol)}</span>`;
    }
  }

  // Dequeue answered question
  sessionQueue.shift();

  // Enable Next button
  const nextBtn = document.getElementById('btn-quiz-next');
  if (nextBtn) nextBtn.disabled = false;
}

// -------------------------------------------------------------
// FIFO QUEUE SKIP BUTTON
// -------------------------------------------------------------
function skipActiveQuestion() {
  const isEn = stateStore.appLanguage === 'en';
  const dict = I18N_DICTIONARY[isEn ? 'en' : 'de'];

  if (!activeQuestion || sessionQueue.length <= 1) {
    // If only 1 left, cannot re-queue behind anything else
    alert(dict.skipLastAlert);
    return;
  }

  // FIFO Skip logic: Move active question from front to end of queue
  const skipped = sessionQueue.shift();
  sessionQueue.push(skipped);

  // Increment Skipped statistic
  stateStore.stats.skipped = (stateStore.stats.skipped || 0) + 1;
  const qNum = String(skipped.num);
  if (!stateStore.skippedQuestions) stateStore.skippedQuestions = [];
  if (!stateStore.skippedQuestions.includes(qNum)) {
    stateStore.skippedQuestions.push(qNum);
  }

  // NOTE: Question is NOT added to answeredQuestionIds! It does not count towards solved questions!
  saveStateToStorage();

  // Show skip notification toast
  const toast = document.getElementById('skip-toast-banner');
  if (toast) {
    toast.classList.remove('hidden');
    const toastInfo = document.getElementById('skip-toast-info');
    const taskLabel = skipped.taskNum || skipped.num;
    if (toastInfo) toastInfo.textContent = dict.skipToastLabel(taskLabel, sessionQueue.length);
    setTimeout(() => { toast.classList.add('hidden'); }, 3000);
  }

  // Load next question immediately
  loadNextFromQueue();
}

function nextQuestionInQuiz() {
  if (!activeQuestionAnswered) return;
  loadNextFromQueue();
}

function finishActiveQuiz() {
  clearInterval(mockTimerInterval);
  const isEn = stateStore.appLanguage === 'en';
  if (activeQuizMode === 'session' && activeSessionId) {
    if (!stateStore.sessionProgress) stateStore.sessionProgress = {};
    const sp = stateStore.sessionProgress[activeSessionId] || { answeredQuestionIds: [], completed: false };
    sp.completed = true;
    stateStore.sessionProgress[activeSessionId] = sp;
    saveStateToStorage();
    alert(isEn ? `🎉 Congratulations! You have completed Session ${activeSessionId}!` : `🎉 Glückwunsch! Sie haben Session ${activeSessionId} abgeschlossen!`);
  } else if (activeQuizMode === 'state') {
    const userState = stateStore.userState || 'BY';
    const stateObj = GERMAN_STATES.find(s => s.code === userState) || GERMAN_STATES[1];
    saveStateToStorage();
    alert(isEn 
      ? `🎉 Congratulations! You completed all 10 federal state questions for ${stateObj.name}!` 
      : `🎉 Glückwunsch! Sie haben alle 10 Bundeslandfragen für ${stateObj.name} abgeschlossen!`);
  } else if (activeQuizMode === 'mock') {
    stateStore.stats.testAttempted = (stateStore.stats.testAttempted || 0) + 1;
    // Mock exam threshold: 17 out of 33
    const passed = (stateStore.stats.correct || 0) >= 17;
    if (!stateStore.mockExamHistory) stateStore.mockExamHistory = [];
    stateStore.mockExamHistory.push({
      date: new Date().toISOString(),
      score: stateStore.stats.correct || 0,
      passed
    });

    if (passed) {
      stateStore.stats.testPassed = (stateStore.stats.testPassed || 0) + 1;
      alert(`🏆 Herzlichen Glückwunsch! Sie haben die Probeprüfung BESTANDEN! (Mindestens 17/33 erreicht)`);
    } else {
      stateStore.stats.testFailed = (stateStore.stats.testFailed || 0) + 1;
      alert(`Probeprüfung beendet. Sie benötigen mindestens 17 richtige Antworten zum Bestehen.`);
    }
    saveStateToStorage();
  }

  closeQuizModal();
}

// -------------------------------------------------------------
// IN-QUIZ INTERACTIVE BUTTON 1: TRANSLATION POPOVER [A/文]
// -------------------------------------------------------------
let translationPopoverLanguage = 'en';

function toggleTranslationPopover() {
  const popover = document.getElementById('translation-popover');
  if (!popover) return;
  if (popover.classList.contains('hidden')) {
    popover.classList.remove('hidden');
    updateTranslationPopoverContent();
  } else {
    popover.classList.add('hidden');
  }
}

function hideTranslationPopover() {
  const popover = document.getElementById('translation-popover');
  if (popover) popover.classList.add('hidden');
}

function changeQuizLanguage(lang) {
  translationPopoverLanguage = lang;
  // CRITICAL REQUIREMENT: Selecting a language in the popover MUST ONLY update the preview
  // text inside the floating popover container itself. NEVER overwrite the primary question card!
  updateTranslationPopoverContent();
}

function updateTranslationPopoverContent() {
  const container = document.getElementById('translation-popover-body');
  if (!container || !activeQuestion) return;

  const isEn = stateStore.appLanguage === 'en';
  const chooseLangLabel = isEn ? 'Select language:' : 'Sprache wählen:';
  const qTransLabel = isEn ? 'Translated Question:' : 'Übersetzung Frage:';
  const optsLabel = isEn ? 'Options:' : 'Optionen:';

  const langs = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'tr', label: '🇹🇷 Türkçe' },
    { code: 'ru', label: '🇷🇺 Русский' },
    { code: 'fr', label: '🇫🇷 Français' },
    { code: 'ar', label: '🇸🇦 العربية' },
    { code: 'uk', label: '🇺🇦 Українська' },
    { code: 'hi', label: '🇮🇳 हिन्दी' },
    { code: 'de', label: '🇩🇪 Deutsch (Original)' }
  ];

  const transObj = (activeQuestion.translation && activeQuestion.translation[translationPopoverLanguage]) 
    ? activeQuestion.translation[translationPopoverLanguage] 
    : null;

  const displayQ = (translationPopoverLanguage === 'de') ? activeQuestion.question : (transObj?.question || activeQuestion.question);
  const displayA = (translationPopoverLanguage === 'de') ? activeQuestion.a : (transObj?.a || activeQuestion.a);
  const displayB = (translationPopoverLanguage === 'de') ? activeQuestion.b : (transObj?.b || activeQuestion.b);
  const displayC = (translationPopoverLanguage === 'de') ? activeQuestion.c : (transObj?.c || activeQuestion.c);
  const displayD = (translationPopoverLanguage === 'de') ? activeQuestion.d : (transObj?.d || activeQuestion.d);

  container.innerHTML = `
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">${chooseLangLabel}</label>
        <select onchange="changeQuizLanguage(this.value)" class="text-xs border rounded px-2 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
          ${langs.map(l => `<option value="${l.code}" ${translationPopoverLanguage === l.code ? 'selected' : ''}>${l.label}</option>`).join('')}
        </select>
      </div>

      <div class="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs space-y-2 border border-slate-200 dark:border-slate-800">
        <div>
          <span class="font-bold text-slate-500 uppercase text-[10px]">${qTransLabel}</span>
          <p class="mt-0.5 text-slate-800 dark:text-slate-200 font-medium whitespace-pre-line">${displayQ}</p>
        </div>
        <div>
          <span class="font-bold text-slate-500 uppercase text-[10px]">${optsLabel}</span>
          <ul class="mt-1 space-y-1 text-slate-700 dark:text-slate-300">
            <li><b>A:</b> ${displayA}</li>
            <li><b>B:</b> ${displayB}</li>
            <li><b>C:</b> ${displayC}</li>
            <li><b>D:</b> ${displayD}</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// IN-QUIZ INTERACTIVE BUTTON 2: AI EXPLANATION PANEL [✨]
// -------------------------------------------------------------
let aiExplanationLanguage = 'de';

function toggleAiExplanationPanel() {
  const panel = document.getElementById('ai-explanation-panel');
  if (!panel) return;
  if (panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
    renderAiExplanationContent();
  } else {
    panel.classList.add('hidden');
  }
}

function hideAiExplanationPanel() {
  const panel = document.getElementById('ai-explanation-panel');
  if (panel) panel.classList.add('hidden');
}

function changeAiExplanationLanguage(lang) {
  aiExplanationLanguage = lang;
  renderAiExplanationContent();
}

const AI_EXPLANATION_I18N = {
  de: {
    header: "Didaktische Erläuterung & Kontext",
    solHeader: "LÖSUNGSANALYSE:",
    solMsg: (solKey, solText) => `Richtige Antwort ist <b>${solKey.toUpperCase()}</b>: "${solText}"`,
    contextHeader: "Hintergrund & Verfassungskontext:",
    defaultContext: "Grundlegendes staatsbürgerliches Wissen für das Leben in Deutschland.",
    disclaimerHeader: "⚠️ AI-Generated Content Disclaimer:",
    disclaimerText: "Diese didaktischen Erläuterungen dienen dem individuellen Verständnis und der Prüfungsvorbereitung. Verbindlich sind ausschließlich die offiziellen Gesetze der Bundesrepublik Deutschland sowie die Veröffentlichungen des Bundesamtes für Migration und Flüchtlinge (BAMF)."
  },
  en: {
    header: "Didactic Explanation & Context",
    solHeader: "SOLUTION ANALYSIS:",
    solMsg: (solKey, solText) => `The correct answer is <b>${solKey.toUpperCase()}</b>: "${solText}"`,
    contextHeader: "Background & Constitutional Context:",
    defaultContext: "Essential civic knowledge for life in Germany.",
    disclaimerHeader: "⚠️ AI-Generated Content Disclaimer:",
    disclaimerText: "These didactic explanations serve individual understanding and exam preparation. Only the official laws of the Federal Republic of Germany and publications of the Federal Office for Migration and Refugees (BAMF) are legally binding."
  },
  tr: {
    header: "Eğitici Açıklama & Bağlam",
    solHeader: "ÇÖZÜM ANALİZİ:",
    solMsg: (solKey, solText) => `Doğru cevap <b>${solKey.toUpperCase()}</b>: "${solText}"`,
    contextHeader: "Arka Plan & Anayasal Bağlam:",
    defaultContext: "Almanya Federal Cumhuriyeti'nde yaşam için temel vatandaşlık bilgisi.",
    disclaimerHeader: "⚠️ Yapay Zeka İçerik Uyarısı:",
    disclaimerText: "Bu eğitici açıklamalar bireysel anlayış ve sınav hazırlığı içindir. Yalnızca Almanya Federal Cumhuriyeti'nin resmi yasaları ve BAMF yayınları bağlayıcıdır."
  },
  ru: {
    header: "Дидактическое объяснение и контекст",
    solHeader: "АНАЛИЗ РЕШЕНИЯ:",
    solMsg: (solKey, solText) => `Правильный ответ <b>${solKey.toUpperCase()}</b>: "${solText}"`,
    contextHeader: "Предыстория и конституционный контекст:",
    defaultContext: "Базовые гражданские знания для жизни в Германии.",
    disclaimerHeader: "⚠️ Отказ от ответственности за контент ИИ:",
    disclaimerText: "Эти дидактические пояснения служат для индивидуального понимания и подготовки к экзамену. Обязательную силу имеют только официальные законы ФРГ и публикации BAMF."
  },
  fr: {
    header: "Explication didactique & Contexte",
    solHeader: "ANALYSE DE LA SOLUTION :",
    solMsg: (solKey, solText) => `La bonne réponse est <b>${solKey.toUpperCase()}</b> : "${solText}"`,
    contextHeader: "Contexte constitutionnel & historique :",
    defaultContext: "Connaissances civiques fondamentales pour la vie en Allemagne.",
    disclaimerHeader: "⚠️ Avertissement sur le contenu généré par l'IA :",
    disclaimerText: "Ces explications didactiques facilitent la compréhension et la préparation à l'examen. Seules les lois officielles de la République fédérale d'Allemagne et les publications du BAMF font foi."
  },
  ar: {
    header: "الشرح التعليمي والسياق",
    solHeader: "تحليل الإجابة:",
    solMsg: (solKey, solText) => `الإجابة الصحيحة هي <b>${solKey.toUpperCase()}</b>: "${solText}"`,
    contextHeader: "الخلفية والسياق الدستوري:",
    defaultContext: "المعرفة المدنية الأساسية للحياة في جمهورية ألمانيا الاتحادية.",
    disclaimerHeader: "⚠️ إخلاء مسؤولية المحتوى المُنشأ بالذكاء الاصطناعي:",
    disclaimerText: "تهدف هذه التفسيرات التعليمية إلى الفهم الفردي والتحضير للامتحان. فقط القوانين الرسمية لجمهورية ألمانيا الاتحادية ومنشورات BAMF هي الملزمة قانونياً."
  },
  uk: {
    header: "Дидактичне пояснення та контекст",
    solHeader: "АНАЛІЗ РІШЕННЯ:",
    solMsg: (solKey, solText) => `Правильна відповідь <b>${solKey.toUpperCase()}</b>: "${solText}"`,
    contextHeader: "Історичний та конституційний контекст:",
    defaultContext: "Базові громадянські знання для життя у Федеративній Республіці Німеччина.",
    disclaimerHeader: "⚠️ Застереження щодо вмісту, створеного ШІ:",
    disclaimerText: "Ці дидактичні пояснення слугують для розуміння та підготовки до іспиту. Обов'язкову юридичну силу мають лише офіційні закони ФРН та публікації BAMF."
  },
  hi: {
    header: "शैक्षणिक व्याख्या और संदर्भ",
    solHeader: "समाधान विश्लेषण:",
    solMsg: (solKey, solText) => `सही उत्तर <b>${solKey.toUpperCase()}</b> है: "${solText}"`,
    contextHeader: "पृष्ठभूमि और संवैधानिक संदर्भ:",
    defaultContext: "जर्मनी में जीवन के लिए आवश्यक नागरिक ज्ञान।",
    disclaimerHeader: "⚠️ एआई-जनरेटेड सामग्री अस्वीकरण:",
    disclaimerText: "ये व्याख्याएं व्यक्तिगत समझ और परीक्षा की तैयारी के लिए हैं। केवल जर्मनी के आधिकारिक कानून और BAMF के प्रकाशन ही कानूनी रूप से मान्य हैं।"
  }
};

function renderAiExplanationContent() {
  const container = document.getElementById('ai-explanation-content');
  if (!container || !activeQuestion) return;

  const dict = AI_EXPLANATION_I18N[aiExplanationLanguage] || AI_EXPLANATION_I18N.de;

  const headerTitle = document.getElementById('ai-modal-header-title');
  if (headerTitle) headerTitle.textContent = dict.header;

  const selectEl = document.getElementById('ai-explanation-lang-select');
  if (selectEl && selectEl.value !== aiExplanationLanguage) {
    selectEl.value = aiExplanationLanguage;
  }

  const solKey = (activeQuestion.solution || '').toLowerCase().trim();
  
  let solText = activeQuestion[solKey] || '';
  if (aiExplanationLanguage !== 'de' && activeQuestion.translation && activeQuestion.translation[aiExplanationLanguage]) {
    const tr = activeQuestion.translation[aiExplanationLanguage];
    if (tr[solKey]) solText = tr[solKey];
  }

  let contextNote = activeQuestion.context || dict.defaultContext;
  if (aiExplanationLanguage !== 'de' && activeQuestion.translation && activeQuestion.translation[aiExplanationLanguage]) {
    const tr = activeQuestion.translation[aiExplanationLanguage];
    if (tr.context) contextNote = tr.context;
  }

  container.innerHTML = `
    <div class="space-y-4 text-xs sm:text-sm">
      <div class="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900">
        <span class="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1">
          ${dict.solHeader}
        </span>
        <p class="font-semibold text-indigo-950 dark:text-indigo-200">
          ${dict.solMsg(solKey, solText)}
        </p>
      </div>

      <div>
        <h5 class="font-bold text-slate-900 dark:text-slate-100 mb-1">${dict.contextHeader}</h5>
        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
          ${contextNote}
        </p>
      </div>

      <div class="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-amber-900 dark:text-amber-200 text-xs">
        <span class="font-bold block mb-0.5">${dict.disclaimerHeader}</span>
        ${dict.disclaimerText}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// IN-QUIZ INTERACTIVE BUTTON 3: FLAG QUESTION [🚩]
// -------------------------------------------------------------
function toggleFlagActiveQuestion() {
  if (!activeQuestion) return;
  const numStr = String(activeQuestion.num);
  const idx = stateStore.flaggedQuestionIds.indexOf(numStr);

  if (idx >= 0) {
    stateStore.flaggedQuestionIds.splice(idx, 1);
    flaggedSet.delete(numStr);
  } else {
    stateStore.flaggedQuestionIds.push(numStr);
    flaggedSet.add(numStr);
  }

  saveStateToStorage();
  renderActiveQuestionUI();
  updateDashboardTopStats();
}

// -------------------------------------------------------------
// SETTINGS MODAL & RESET ALL USER DATA
// -------------------------------------------------------------
function openSettingsModal(focusTarget) {
  const modal = document.getElementById('settings-modal');
  if (modal) modal.classList.remove('hidden');
  const langSel = document.getElementById('settings-language-select');
  if (langSel) langSel.value = stateStore.appLanguage || 'de';
  const stateSel = document.getElementById('settings-state-select');
  if (stateSel) {
    stateSel.value = stateStore.userState || 'BY';
    if (focusTarget === 'state') {
      setTimeout(() => {
        stateSel.focus();
        stateSel.classList.add('ring-2', 'ring-indigo-500', 'border-indigo-500');
        setTimeout(() => stateSel.classList.remove('ring-2', 'ring-indigo-500', 'border-indigo-500'), 2500);
      }, 100);
    }
  }
}

function closeSettingsModal() {
  const modal = document.getElementById('settings-modal');
  if (modal) modal.classList.add('hidden');
}

function saveSettings() {
  const langSel = document.getElementById('settings-language-select');
  if (langSel) {
    applyAppLanguage(langSel.value);
  }
  const stateSel = document.getElementById('settings-state-select');
  if (stateSel) {
    stateStore.userState = stateSel.value;
  }
  saveStateToStorage();
  updateDashboardTopStats();
  renderOfficialSessionsGrid();
  renderCharts();
  closeSettingsModal();
}

function resetAllData() {
  const isEn = stateStore.appLanguage === 'en';
  const confirmMsg = isEn 
    ? "Are you sure you want to reset all training data and statistics?" 
    : "Möchten Sie wirklich alle Trainingsdaten und Statistiken zurücksetzen?";

  if (!confirm(confirmMsg)) {
    return;
  }

  // 1. Clear Local Storage
  try {
    localStorage.clear();
  } catch (e) {
    console.error("Storage clear error:", e);
  }

  // 2. Clear In-Memory Variables
  userProgress = {};
  answersMap = {};
  completedSessions = new Set();
  flaggedSet = new Set();
  skippedQueue = [];

  // Also clear stateStore object completely
  stateStore.stats = {
    skipped: 0,
    flagged: 0,
    correct: 0,
    incorrect: 0,
    attempted: 0,
    testAttempted: 0,
    testPassed: 0,
    testFailed: 0,
    streak: 1
  };
  stateStore.answeredQuestionIds = [];
  stateStore.userAnswers = {};
  stateStore.userProgress = {};
  stateStore.flaggedQuestionIds = [];
  stateStore.flaggedQuestions = [];
  stateStore.skippedQuestions = [];
  stateStore.mockExamHistory = [];
  stateStore.sessionProgress = {};
  stateStore.dailyHistory = {};

  sessionQueue = [];
  activeQuestion = null;
  activeSessionId = null;
  activeQuestionAnswered = false;
  activeQuestionSelectedOpt = null;

  // Persist fresh empty state
  saveStateToStorage();

  // Close Settings modal if open
  closeSettingsModal();

  // 3. Re-calculate metrics and force a clean UI re-render
  updateDashboardStats();
  renderCategoryCards();
  renderCharts();

  const successMsg = isEn 
    ? "All statistics and training progress have been successfully reset to 0." 
    : "Alle Statistiken und Trainingsfortschritte wurden erfolgreich auf 0 zurückgesetzt.";
  alert(successMsg);
}

// Function aliases
const updateDashboardStats = updateDashboardTopStats;
const renderCategoryCards = renderOfficialSessionsGrid;
const clearAllProgress = resetAllData;
const resetAllUserData = resetAllData;
const startStatePracticeSession = loadStateQuestions;

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadStateFromStorage();
  applyTheme(stateStore.theme || 'light');
  applyAppLanguage(stateStore.appLanguage || 'de');
  updateGreeting();
  updateDashboardTopStats();
  renderOfficialSessionsGrid();
  renderCharts();
  fetchBamfStats();

  // Wire language select and reset button in settings modal
  const langSelect = document.getElementById('settings-language-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      applyAppLanguage(e.target.value);
    });
  }

  const resetBtn = document.getElementById('reset-stats-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetAllUserData();
    });
  }
});

// Window global function exports
window.userProgress = userProgress;
window.answersMap = answersMap;
window.completedSessions = completedSessions;
window.flaggedSet = flaggedSet;
window.skippedQueue = skippedQueue;
window.getSolvedCountForSession = getSolvedCountForSession;
window.updateDashboardStats = updateDashboardStats;
window.renderCategoryCards = renderCategoryCards;
window.clearAllProgress = clearAllProgress;
window.resetAllData = resetAllData;
window.resetAllUserData = resetAllData;
window.startSession = startSession;
window.loadStateQuestions = loadStateQuestions;
window.startStatePracticeSession = startStatePracticeSession;
window.startOfficialSession = startOfficialSession;
window.startMockExam = startMockExam;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.saveSettings = saveSettings;
