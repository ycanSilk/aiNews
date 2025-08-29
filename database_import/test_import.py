#!/usr/bin/env python3
"""
测试脚本：验证JSON数据导入功能
"""

import json
import os

def validate_json_file(file_path):
    """验证JSON文件格式"""
    if not os.path.exists(file_path):
        print(f"❌ 文件不存在: {file_path}")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # 基本验证
        if not isinstance(data, list):
            print("❌ JSON文件应该包含一个数组")
            return False
        
        print(f"✅ 找到 {len(data)} 个文档")
        
        # 详细验证
        required_fields = ['semanticId', 'title', 'summary', 'category']
        validation_errors = []
        
        for i, item in enumerate(data, 1):
            if not isinstance(item, dict):
                validation_errors.append(f"第{i}个元素不是字典格式")
                continue
            
            # 检查必需字段
            for field in required_fields:
                if field not in item:
                    validation_errors.append(f"文档{i}缺少必需字段: {field}")
            
            # 检查title字段结构
            if 'title' in item:
                if not isinstance(item['title'], dict):
                    validation_errors.append(f"文档{i}的title字段应该是对象格式")
                else:
                    if 'zh' not in item['title'] or 'en' not in item['title']:
                        validation_errors.append(f"文档{i}的title字段缺少zh或en语言")
            
            # 检查summary字段结构
            if 'summary' in item:
                if not isinstance(item['summary'], dict):
                    validation_errors.append(f"文档{i}的summary字段应该是对象格式")
                else:
                    if 'zh' not in item['summary'] or 'en' not in item['summary']:
                        validation_errors.append(f"文档{i}的summary字段缺少zh或en语言")
        
        if validation_errors:
            print("❌ 数据验证失败:")
            for error in validation_errors[:10]:  # 显示前10个错误
                print(f"  - {error}")
            if len(validation_errors) > 10:
                print(f"  ... 还有{len(validation_errors)-10}个错误")
            return False
        
        print("✅ 数据格式验证通过")
        
        # 显示前3个文档的概要
        print("\n📋 文档概要:")
        for i, doc in enumerate(data[:3], 1):
            print(f"文档{i}: {doc.get('semanticId', '无ID')}")
            print(f"  标题: {doc.get('title', {}).get('zh', '无标题')}")
            print(f"  分类: {doc.get('category', '无分类')}")
            print()
        
        return True
        
    except json.JSONDecodeError:
        print("❌ JSON文件格式错误，无法解析")
        return False
    except Exception as e:
        print(f"❌ 读取文件时发生错误: {e}")
        return False

if __name__ == "__main__":
    print("🔍 开始验证 news_data.json 文件...")
    file_path = "F:\\github\\aiNews\\database_import\\news_data.json"
    
    if validate_json_file(file_path):
        print("🎉 文件验证成功！可以用于导入")
    else:
        print("💥 文件验证失败，请检查数据格式")
        
    print("\n📝 提示: 运行 python mongo_db_gui_tool.py 启动图形界面工具")