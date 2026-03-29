@echo off
move src\logic\debug\*.js harness\legacy\debug\
move src\logic\simulate_staged_hands.js harness\legacy\scripts\
move src\logic\simulate_staged_hands.STG.js harness\legacy\scripts\
move src\logic\simulate_ai_match.js harness\legacy\scripts\
move src\logic\test_flush_scoring.js harness\legacy\scripts\
move src\logic\test_node.js harness\legacy\scripts\
echo Cleanup v2 complete > cleanup_done_v2.txt
