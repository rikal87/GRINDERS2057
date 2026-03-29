import { HarnessRunner } from './core/HarnessRunner.js';
import { preflopScenarios } from './scenarios/preflop.js';
import { postflopScenarios } from './scenarios/postflop.js';
import { evalScenarios } from './scenarios/eval.js';
import { runStagedSimulation } from './mass_sim/staged_hands.js';
import { getUnifiedAction } from '../src/logic/aiEngine/aiBrainHub.js';

async function main() {
    const runner = new HarnessRunner({ verbose: true });
    
    // 1. Hand Evaluation Tests (AI가 아니므로 규격 검사 제외)
    runner.addLog("\n>> PHASE 1: HAND EVALUATION <<");
    for (const scenario of evalScenarios) {
        await runner.runAIScenario(scenario.name, scenario.setup, scenario.action, 1, true);
    }

    // 2. Preflop AI Scenarios
    runner.addLog("\n>> PHASE 2: PREFLOP AI SCENARIOS <<");
    for (const scenario of preflopScenarios) {
        await runner.runAIScenario(scenario.name, scenario.setup, scenario.action || getUnifiedAction, 1);
    }

    // 3. Postflop AI Scenarios
    runner.addLog("\n>> PHASE 3: POSTFLOP AI SCENARIOS <<");
    for (const scenario of postflopScenarios) {
        await runner.runAIScenario(scenario.name, scenario.setup, scenario.action || getUnifiedAction, 1);
    }

    // 4. Regression / Golden Scenarios
    const { regressionScenarios } = await import('./scenarios/regression.js');
    runner.addLog("\n>> PHASE 4: REGRESSION (GOLDEN SCENARIOS) <<");
    for (const scenario of regressionScenarios) {
        await runner.runAIScenario(scenario.name, scenario.setup, scenario.action || getUnifiedAction, 1);
    }

    // 5. Mass Simulation (Staged Hands)
    runner.addLog("\n>> PHASE 5: MASS SIMULATION <<");
    await runner.runSimulation("Staged 3-Player Simulation", runStagedSimulation);

    // 5. Report Summaries
    runner.reportSummary();
}

main().catch(console.error);
