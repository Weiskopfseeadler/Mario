	
#!/bin/bash
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin";
cinst nodejs.install;
 npm install http-server -g;
 http-server;
 echo ;
 echo "Ip in adress zeile des Browsers Eingeben eingeben";
 
 
