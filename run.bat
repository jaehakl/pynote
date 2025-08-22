@echo off
rem REM 백엔드 실행 (새 창)
rem cd ./apps/note/api
rem start cmd /k "call run.bat"
rem cd ../../..

REM 프론트엔드 실행 (새 창)
cd ./apps/note/ui   
start cmd /k "call run.bat"
cd ../../..






