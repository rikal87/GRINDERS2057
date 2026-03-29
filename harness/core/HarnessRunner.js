import fs from 'fs';
import { createMockEngine, createMockPlayer } from './EngineMocker.js';

export class HarnessRunner {
    constructor(options = {}) {
        this.results = [];
        this.log = "";
        this.options = {
            verbose: true,
            saveLogs: true,
            logPath: './harness/logs/',
            ...options
        };

        if (this.options.saveLogs && !fs.existsSync(this.options.logPath)) {
            fs.mkdirSync(this.options.logPath, { recursive: true });
        }
    }

    addLog(msg) {
        this.log += msg + "\n";
        if (this.options.verbose) {
            console.log(msg);
        }
        // Force flush for environment visibility
        try {
            fs.appendFileSync('./harness_execution.log', msg + "\n");
        } catch(e) {}
    }

    validateAction(result) {
        const required = ['action', 'amount', 'insight', 'delay'];
        const missing = required.filter(f => result[f] === undefined);
        if (missing.length > 0) {
            throw new Error(`AI Action Contract Violation: Missing fields [${missing.join(', ')}]`);
        }
        return true;
    }

    /**
     * Executes a specific AI decision scenario and verifies it against expectations.
     */
    async runAIScenario(name, setupFn, actionFn, iterations = 1, skipValidation = false) {
        this.addLog(`\n[SCENARIO] ${name}`);
        const counts = {};
        const startTime = Date.now();

        try {
            for (let i = 0; i < iterations; i++) {
                const data = setupFn();
                // If it's an AI scenario, data should be { player, engine }.
                // Otherwise (like eval), data might be the raw object itself.
                const result = await actionFn(data?.player || data, data?.engine);
                
                if (!skipValidation) this.validateAction(result);
                
                // Normalizing for reporting
                const actionType = result?.type || result?.action || (typeof result === 'string' ? result : 'N/A');
                const insight = result?.insight || result?.reason || '';
                
                const key = `${actionType}${insight ? ' (' + insight + ')' : ''}`;
                counts[key] = (counts[key] || 0) + 1;
            }

            // Report results
            Object.entries(counts).forEach(([k, v]) => {
                const pct = ((v / iterations) * 100).toFixed(1);
                this.addLog(`  ${k}: ${v} (${pct}%)`);
            });

            this.results.push({ name, status: 'PASS', time: Date.now() - startTime });
        } catch (e) {
            this.addLog(`  [ERROR] ${e.stack}`);
            this.results.push({ name, status: 'FAIL', error: e.message });
        }
    }

    /**
     * Run a multi-hand simulation.
     */
    async runSimulation(name, simFn) {
        this.addLog(`\n=== Simulation: ${name} ===`);
        const startTime = Date.now();
        try {
            const stats = await simFn(this);
            this.results.push({ name, status: 'PASS', time: Date.now() - startTime, stats });
        } catch (e) {
            this.addLog(`  [SIM ERROR] ${e.stack}`);
            this.results.push({ name, status: 'FAIL', error: e.message });
        }
    }

    reportSummary() {
        this.addLog("\n" + "=".repeat(40));
        this.addLog("HARNESS SUMMARY");
        this.addLog("=".repeat(40));
        
        let passed = 0;
        this.results.forEach(r => {
            const statusStr = r.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
            this.addLog(`${statusStr} | ${r.name.padEnd(40)} | ${r.time ? r.time + 'ms' : '-'}`);
            if (r.status === 'PASS') passed++;
        });

        this.addLog("-".repeat(40));
        this.addLog(`TOTAL: ${this.results.length} | PASSED: ${passed} | FAILED: ${this.results.length - passed}`);
        
        if (this.options.saveLogs) {
            const filename = `harness_report_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
            fs.writeFileSync(`${this.options.logPath}${filename}`, this.log);
        }
    }
}
