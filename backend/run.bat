@echo off
cd /d %~dp0
call mvnw.cmd spring-boot:run > server.log 2>&1
