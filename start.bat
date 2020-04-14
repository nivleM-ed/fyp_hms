:Begin
@ECHO OFF
set p=%cd%

CLS
ECHO Directory:%p%
ECHO 1.First-Time Build
ECHO 2.Start Development Server
ECHO 3.Build stack
ECHO 4.Exit

CHOICE /C 1234 /M "Enter:"

IF ERRORLEVEL 4 GOTO End
IF ERRORLEVEL 3 GOTO Build
IF ERRORLEVEL 2 GOTO DevServer
IF ERRORLEVEL 1 GOTO FTBuild


:FTBuild
ECHO First-time installation may take a long time depending on internet speed.
ECHO Installing global dependencies:
call npm install -g nodemon express-generator @vue/cli pm2
CD %p%\screen
ECHO Accessing %p%\screen
ECHO Installing dependencies for screen:
call npm install
CD %p%\server
ECHO Accessing %p%\server
ECHO Installing dependencies for server:
call npm install
PAUSE
CD %p%
GOTO Begin

:DevServer
ECHO Development Server
START cmd /k "CD %p%\screen & npm run serve"
START cmd /k "CD %p%\server & npx nodemon"
GOTO End

:Build
ECHO Production Server
ECHO -Accessing %p%\screen
CD %p%\screen
ECHO -Deleting folders
if exist "%p%\screen\dist" rmdir "%p%\screen\dist" /Q /S
if exist "%p%\server\public" rmdir "%p%\server\public" /Q /S
ECHO -Building VueJs
call npm run build
ECHO -Moving files into server folder
mkdir "%p%\server\public"
robocopy "%p%\screen\dist" "%p%\server\public" /E
PAUSE
GOTO End

:End