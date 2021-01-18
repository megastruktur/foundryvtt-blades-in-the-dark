rem @echo off & setlocal

choice /c 1234 /m "1: mp3->ogg; 2: mp4->ogg; 3: jpg->ogg, 4: png->webp; STRG+C: Stops programm"

IF ERRORLEVEL 4 goto png
IF ERRORLEVEL 3 goto jpg
IF ERRORLEVEL 2 goto mp4
IF ERRORLEVEL 1 goto mp3


rem block for the mp3 converting options
:mp3
choice /c yn /m "Delete all mp3 after converting?"
IF ERRORLEVEL 2 goto convert
IF ERRORLEVEL 1 goto delete

:convert
for /r %%i in (*.mp3) do (
	ffmpeg -i "%%~fi" -map 0:a -acodec libopus -vbr on "%%~dpni.ogg"
	)
GOTO end

:delete	
for /r %%i in (*.mp3) do (
	ffmpeg -i "%%~fi" -map 0:a -acodec libopus -vbr on "%%~dpni.ogg"
	if not errorlevel 1 if exist "%%~dpni.mp3" del /q "%%~fi"
	)
GOTO end


rem block for the mp4 converting options
:mp4
choice /c yn /m "Delete all mp4 after converting?"
IF ERRORLEVEL 2 goto convert
IF ERRORLEVEL 1 goto delete

:convert
for /r %%i in (*.mp4) do (
	ffmpeg -i "%%~fi" -map 0:a -acodec libopus -vbr on "%%~dpni.ogg"
	)
GOTO end	

:delete
for /r %%i in (*.mp4) do (
	ffmpeg -i "%%~fi" -map 0:a -acodec libopus -vbr on "%%~dpni.ogg"
	if not errorlevel 1 if exist "%%~dpni.mp4" del /q "%%~fi"
	)
GOTO end	


rem block for the jpg converting options
:jpg
choice /c yn /m "Delete all jpg after converting?"
IF ERRORLEVEL 2 goto convert
IF ERRORLEVEL 1 goto delete

:convert
for /r %%i in (*.jpg) do (
	ffmpeg -i "%%~fi" -c:v libwebp "%%~dpni.webp"
	)
GOTO end

:delete
for /r %%i in (*.jpg) do (
	ffmpeg -i "%%~fi" -c:v libwebp "%%~dpni.webp"
	if not errorlevel 1 if exist "%%~dpni.jpg" del /q "%%~fi"
	)
GOTO end


rem block for the png converting options
:png
choice /c yn /m "Delete all png after converting?"
IF ERRORLEVEL 2 goto convert
IF ERRORLEVEL 1 goto delete

:convert
for /r %%i in (*.png) do (
	ffmpeg -i "%%~fi" -c:v libwebp -q 95 "%%~dpni.webp"
	)
GOTO end

:delete
for /r %%i in (*.png) do (
	ffmpeg -i "%%~fi" -c:v libwebp "%%~dpni.webp"
	if not errorlevel 1 if exist "%%~dpni.png" del /q "%%~fi"
	)
GOTO end


:end
@PAUSE

