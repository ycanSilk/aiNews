@echo off
echo 正在启动 MongoDB 数据库管理工具...
echo.
echo 请确保已安装 Python 和以下依赖：
echo pip install -r requirements.txt
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到 Python，请先安装 Python 3.7+
    pause
    exit /b 1
)

REM 安装依赖（如果尚未安装）
echo 检查依赖包...
python -c "import pymongo" 2>nul
if errorlevel 1 (
    echo 安装依赖包...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo 错误: 依赖包安装失败
        pause
        exit /b 1
    )
)

echo 启动图形界面工具...
python mongo_db_gui_tool.py

pause