@echo off
title Dev Server
echo Starting dev server...
echo %cd%

start cmd /k "cd screen & npm run serve"
start cmd /k "cd server & npx nodemon"