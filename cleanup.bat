@echo off
mkdir harness\legacy\tests
mkdir harness\legacy\verifications
mkdir harness\legacy\debug
mkdir harness\legacy\scripts
move test_*.js harness\legacy\tests\
move test_*.mjs harness\legacy\tests\
move verify_*.js harness\legacy\verifications\
move debug_*.js harness\legacy\debug\
move repro_*.js harness\legacy\debug\
move tmp_verify_*.js harness\legacy\debug\
move *.py harness\legacy\scripts\
echo Cleanup complete > cleanup_done.txt
