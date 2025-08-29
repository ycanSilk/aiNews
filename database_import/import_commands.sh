#!/bin/bash

echo "========================================"
echo "AI News Database Import Script"
echo "========================================"
echo

# 设置MongoDB连接信息
MONGODB_URI="mongodb://localhost:27017/ai-news"
IMPORT_FILE="news_data.json"

# 检查mongoimport是否可用
if ! command -v mongoimport &> /dev/null; then
    echo "Error: mongoimport not found. Please install MongoDB tools."
    echo "Download from: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

# 导入数据到MongoDB
echo "Importing data to MongoDB..."
mongoimport --uri="$MONGODB_URI" --collection=news --file="$IMPORT_FILE" --jsonArray --drop

if [ $? -eq 0 ]; then
    echo
    echo "Success: Data imported successfully!"
    echo "Total documents imported: 30 news articles"
else
    echo
    echo "Error: Import failed!"
    echo "Please check your MongoDB connection and try again."
    exit 1
fi

echo
echo "========================================"
echo "Import completed"
echo "========================================"