import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { scrapCurrentEvaluationData } from './services/scrap-bamf-current-evaluation';
import { scrapPrüfstellen } from './services/scrap-prüfstellen';
import { updateConfigSyncTime } from './services/config';
import { SESSIONS_LIST } from './types/categories';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read JSON safely
function readJsonFile<T>(relativePath: string, defaultValue: T): T {
    try {
        const fullPath = path.join(__dirname, relativePath);
        if (fs.existsSync(fullPath)) {
            const raw = fs.readFileSync(fullPath, 'utf8');
            return JSON.parse(raw) as T;
        }
    } catch (err) {
        console.error(`Failed to read ${relativePath}:`, err);
    }
    return defaultValue;
}

// In-memory cache for large files with dirty flag
let questionsCache: any[] | null = null;
let pruefstellenCache: any[] | null = null;

function getQuestions(): any[] {
    if (!questionsCache) {
        questionsCache = readJsonFile<any[]>('data/question.json', []);
    }
    return questionsCache;
}

function getPruefstellen(): any[] {
    if (!pruefstellenCache) {
        pruefstellenCache = readJsonFile<any[]>('data/prüfstellen.json', []);
    }
    return pruefstellenCache;
}

// Routes
// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        node: process.version,
        timestamp: new Date().toISOString()
    });
});

// 2. Summary stats
app.get('/api/stats', (_req: Request, res: Response) => {
    const evaluation = readJsonFile<any>('data/current-evaluation.json', {});
    const config = readJsonFile<any>('config.json', {});
    const questions = getQuestions();
    const pruefstellen = getPruefstellen();

    let totalPruefstellenCount = 0;
    for (const group of pruefstellen) {
        if (Array.isArray(group.data)) {
            totalPruefstellenCount += group.data.length;
        }
    }

    res.json({
        currentExamDate: evaluation.examDate || null,
        lastEvaluationSync: evaluation.lastSyncAt || null,
        evaluationHistoryPoints: Array.isArray(evaluation.history) ? evaluation.history.length : 0,
        totalQuestions: questions.length,
        totalPruefstellen: totalPruefstellenCount,
        totalStatesCovered: pruefstellen.length,
        totalSessions: SESSIONS_LIST.length,
        pipelines: config
    });
});

// 2b. Official BAMF Practice Sessions
app.get('/api/sessions', (_req: Request, res: Response) => {
    res.json(SESSIONS_LIST);
});

app.get('/api/sessions/:id', (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const session = SESSIONS_LIST.find(s => s.id === id);
    if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
    }

    const allQuestions = getQuestions();
    const sessionQuestions = session.questions
        .map(num => allQuestions.find(q => q.num === String(num)))
        .filter(Boolean);

    res.json({
        ...session,
        questionsList: sessionQuestions
    });
});

// 2c. Official BAMF Mock Exam (30 general questions + 3 state questions = 33 questions)
app.get('/api/mock-exam', (req: Request, res: Response) => {
    const state = typeof req.query.state === 'string' ? req.query.state.trim().toUpperCase() : 'BY';
    const allQuestions = getQuestions();
    
    // 300 general questions
    const generalQuestions = allQuestions.filter(q => !q.num.includes('-'));
    // State questions
    const stateQuestions = allQuestions.filter(q => q.num.startsWith(`${state}-`));

    // Shuffle helper
    const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    const selectedGeneral = shuffle(generalQuestions).slice(0, 30);
    const selectedState = shuffle(stateQuestions.length > 0 ? stateQuestions : allQuestions.filter(q => q.num.startsWith('BY-'))).slice(0, 3);

    const examQuestions = [...selectedGeneral, ...selectedState];
    res.json({
        state,
        total: examQuestions.length,
        passingThreshold: 17,
        timeMinutes: 60,
        questions: examQuestions
    });
});

// 2d. Federal State Practice Session (10 state-specific questions, Aufgaben 301 to 310)
app.get('/api/state-session/:state', (req: Request, res: Response) => {
    const rawState = req.params.state;
    const state = (typeof rawState === 'string' ? rawState : (Array.isArray(rawState) ? String(rawState[0]) : 'BY')).trim().toUpperCase();
    const allQuestions = getQuestions();
    const stateQuestions = allQuestions.filter(q => q.num && q.num.startsWith(`${state}-`));

    res.json({
        state,
        total: stateQuestions.length,
        questionsList: stateQuestions
    });
});

// 3. Current evaluation
app.get('/api/evaluation', (_req: Request, res: Response) => {
    const data = readJsonFile<any>('data/current-evaluation.json', {});
    res.json(data);
});

// 4. Config
app.get('/api/config', (_req: Request, res: Response) => {
    const data = readJsonFile<any>('config.json', {});
    res.json(data);
});

// 5. Prüfstellen with optional filtering by state or query
app.get('/api/pruefstellen', (req: Request, res: Response) => {
    const all = getPruefstellen();
    const state = typeof req.query.state === 'string' ? req.query.state.toUpperCase() : null;
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : null;

    let filtered = all;
    if (state) {
        filtered = filtered.filter(item => item.stateCode?.toUpperCase() === state);
    }

    if (q) {
        filtered = filtered.map(item => ({
            stateCode: item.stateCode,
            data: item.data.filter((p: any) =>
                (p.ort && p.ort.toLowerCase().includes(q)) ||
                (p.plz && p.plz.includes(q)) ||
                (p.einrichtung && p.einrichtung.toLowerCase().includes(q)) ||
                (p.straße && p.straße.toLowerCase().includes(q)) ||
                (p.regierungsbezirk && p.regierungsbezirk.toLowerCase().includes(q))
            )
        })).filter(item => item.data.length > 0);
    }

    res.json(filtered);
});

// 6. Questions with pagination and search
app.get('/api/questions', (req: Request, res: Response) => {
    const all = getQuestions();
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : null;
    const num = typeof req.query.num === 'string' ? req.query.num.trim() : null;
    const state = typeof req.query.state === 'string' ? req.query.state.trim().toUpperCase() : null;
    const sessionId = req.query.sessionId ? parseInt(req.query.sessionId as string, 10) : null;
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : null;
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string || '20', 10)));

    let filtered = all;

    if (num) {
        filtered = filtered.filter(item => item.num === num);
    } else {
        if (state) {
            filtered = filtered.filter(item => item.num && item.num.startsWith(`${state}-`));
        }
        if (sessionId) {
            filtered = filtered.filter(item => item.sessionId === sessionId);
        }
        if (category) {
            filtered = filtered.filter(item => item.category && item.category.toLowerCase() === category.toLowerCase());
        }
        if (q) {
            filtered = filtered.filter(item => {
                const questionText = item.question?.toLowerCase() || '';
                const a = item.a?.toLowerCase() || '';
                const b = item.b?.toLowerCase() || '';
                const c = item.c?.toLowerCase() || '';
                const d = item.d?.toLowerCase() || '';
                const numStr = item.num || '';
                const catStr = item.category?.toLowerCase() || '';
                return questionText.includes(q) || a.includes(q) || b.includes(q) || c.includes(q) || d.includes(q) || numStr.includes(q) || catStr.includes(q);
            });
        }
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    res.json({
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        items
    });
});

// Pipeline execution endpoints
let isRunningPipeline = false;
let pipelineLogs: { time: string; message: string; type: 'info' | 'error' | 'success' }[] = [];

function addLog(message: string, type: 'info' | 'error' | 'success' = 'info') {
    const time = new Date().toLocaleTimeString('de-DE');
    pipelineLogs.unshift({ time, message, type });
    if (pipelineLogs.length > 50) pipelineLogs.pop();
}

app.get('/api/pipeline/status', (_req: Request, res: Response) => {
    res.json({
        isRunning: isRunningPipeline,
        logs: pipelineLogs
    });
});

app.post('/api/pipeline/check-evaluation', async (_req: Request, res: Response) => {
    if (isRunningPipeline) {
        res.status(409).json({ error: 'A pipeline is already running.' });
        return;
    }

    isRunningPipeline = true;
    addLog('Starting BAMF Current Evaluation check...', 'info');

    try {
        await scrapCurrentEvaluationData();
        updateConfigSyncTime('checkEvaluation');
        addLog('Successfully updated BAMF Evaluation Data.', 'success');
        res.json({ success: true, message: 'Evaluation check completed.' });
    } catch (err: any) {
        addLog(`Error checking evaluation: ${err.message || err}`, 'error');
        res.status(500).json({ error: err.message || 'Pipeline failed' });
    } finally {
        isRunningPipeline = false;
    }
});

app.post('/api/pipeline/sync-pruefstellen', async (_req: Request, res: Response) => {
    if (isRunningPipeline) {
        res.status(409).json({ error: 'A pipeline is already running.' });
        return;
    }

    isRunningPipeline = true;
    addLog('Starting Prüfstellen scrape across all 16 states...', 'info');

    try {
        await scrapPrüfstellen();
        pruefstellenCache = null; // Invalidate cache
        addLog('Successfully scraped and updated Prüfstellen.', 'success');
        res.json({ success: true, message: 'Prüfstellen sync completed.' });
    } catch (err: any) {
        addLog(`Error syncing Prüfstellen: ${err.message || err}`, 'error');
        res.status(500).json({ error: err.message || 'Pipeline failed' });
    } finally {
        isRunningPipeline = false;
    }
});

// Serve frontend fallback for any other route
app.use((_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[AI Studio] Server listening on http://0.0.0.0:${PORT}`);
});
