@echo off
REM 백엔드 실행 (새 창)
cd ./apps/note/api
start cmd /k "call run.bat"
cd ../../..

REM 프론트엔드 실행 (새 창)
cd ./apps/note/ui   
start cmd /k "call run.bat"
cd ../../..






