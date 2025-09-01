@echo off
echo ========================================
echo    AI新闻系统 - 数据导入工具
echo ========================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo ✅ Node.js环境正常
echo.

echo 正在安装依赖...
npm install mongodb
echo.

echo 正在生成MongoDB Compass导入文件...
node import_articles_optimized.js
echo.

echo 可选：直接导入到MongoDB
echo 请确保MongoDB服务正在运行
echo 是否直接导入到数据库？(y/n)
set /p choice=

if /i "%choice%"=="y" (
    echo 正在执行数据库导入...
    node -e "require('./import_articles_optimized.js').importArticles()"
) else (
    echo 已生成导入文件：articles_optimized_import.json
    echo 请使用MongoDB Compass手动导入
)

echo.
echo ========================================
echo    导入完成！
echo ========================================
pause