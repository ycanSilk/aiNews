@echo off
echo ========================================
echo AI News Database Import Script
echo ========================================
echo.

REM 设置MongoDB连接信息
set MONGODB_URI=mongodb://localhost:27017/ai-news
set IMPORT_FILE=news_data.json

REM 检查mongoimport是否可用
where mongoimport >nul 2>&1
if errorlevel 1 (
    echo Error: mongoimport not found. Please install MongoDB tools.
    echo Download from: https://www.mongodb.com/try/download/database-tools
    pause
    exit /b 1
)

REM 导入数据到MongoDB
echo Importing data to MongoDB...
mongoimport --uri="%MONGODB_URI%" --collection=news --file="%IMPORT_FILE%" --jsonArray --drop

if errorlevel 1 (
    echo.
    echo Error: Import failed!
    echo Please check your MongoDB connection and try again.
) else (
    echo.
    echo Success: Data imported successfully!
    echo Total documents imported: 5 news articles
)

echo.
echo ========================================
echo Import completed
echo ========================================
pause