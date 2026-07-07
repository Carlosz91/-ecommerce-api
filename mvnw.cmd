@echo off
set WRAPPER_JAR=".mvn\wrapper\maven-wrapper.jar"
if not exist %WRAPPER_JAR% (
    echo Downloading Maven Wrapper...
    powershell -Command "Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar' -OutFile '.mvn\wrapper\maven-wrapper.jar'"
    if errorlevel 1 (
        echo Failed to download Maven Wrapper
        exit /b 1
    )
)
set MAVEN_JAVA_EXE="%JAVA_HOME%\bin\java.exe"
if "%JAVA_HOME%"=="" set MAVEN_JAVA_EXE="java"
%MAVEN_JAVA_EXE% -jar %WRAPPER_JAR% %*
