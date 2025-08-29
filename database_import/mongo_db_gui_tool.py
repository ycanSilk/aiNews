import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext, filedialog
import pymongo
from pymongo import MongoClient
from datetime import datetime
import json
import os

class MongoDBGUITool:
    def __init__(self, root):
        self.root = root
        self.root.title("MongoDB 数据库管理工具")
        self.root.geometry("800x600")
        
        # MongoDB 连接配置
        self.connection_string = tk.StringVar(value="mongodb://localhost:27017/ai-news")
        self.collection_name = tk.StringVar(value="news")
        
        self.setup_ui()
        
    def setup_ui(self):
        # 主框架
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 连接配置区域
        config_frame = ttk.LabelFrame(main_frame, text="数据库配置", padding="5")
        config_frame.grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        ttk.Label(config_frame, text="连接字符串:").grid(row=0, column=0, sticky=tk.W, pady=2)
        ttk.Entry(config_frame, textvariable=self.connection_string, width=50).grid(row=0, column=1, pady=2, padx=5)
        
        ttk.Label(config_frame, text="集合名称:").grid(row=1, column=0, sticky=tk.W, pady=2)
        ttk.Entry(config_frame, textvariable=self.collection_name, width=20).grid(row=1, column=1, pady=2, padx=5)
        
        # 测试连接按钮
        ttk.Button(config_frame, text="测试连接", command=self.test_connection).grid(row=2, column=0, columnspan=2, pady=10)
        
        # 操作按钮区域
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=1, column=0, columnspan=2, pady=10)
        
        ttk.Button(button_frame, text="查看所有文档", command=self.show_all_documents).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="导入JSON数据", command=self.import_json_data).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="选择文件导入", command=self.import_custom_json).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="清空集合", command=self.clear_collection).pack(side=tk.LEFT, padx=5)
        
        # 结果显示区域
        result_frame = ttk.LabelFrame(main_frame, text="操作结果", padding="5")
        result_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=5)
        
        self.result_text = scrolledtext.ScrolledText(result_frame, width=70, height=20)
        self.result_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 配置权重
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(2, weight=1)
        result_frame.columnconfigure(0, weight=1)
        result_frame.rowconfigure(0, weight=1)
        
    def get_client(self):
        """获取MongoDB客户端"""
        try:
            client = MongoClient(self.connection_string.get())
            return client
        except Exception as e:
            messagebox.showerror("连接错误", f"无法连接到MongoDB: {str(e)}")
            return None
    
    def test_connection(self):
        """测试数据库连接"""
        client = self.get_client()
        if client:
            try:
                # 测试连接
                client.admin.command('ping')
                db = client[self.connection_string.get().split('/')[-1]]
                collections = db.list_collection_names()
                
                self.result_text.delete(1.0, tk.END)
                self.result_text.insert(tk.END, "✅ 连接成功！\n")
                self.result_text.insert(tk.END, f"数据库: {db.name}\n")
                self.result_text.insert(tk.END, f"集合列表: {', '.join(collections)}\n")
                
                # 显示指定集合的文档数量
                collection = db[self.collection_name.get()]
                count = collection.count_documents({})
                self.result_text.insert(tk.END, f"集合 '{self.collection_name.get()}' 文档数量: {count}\n")
                
            except Exception as e:
                messagebox.showerror("错误", f"连接测试失败: {str(e)}")
            finally:
                client.close()
    
    def show_all_documents(self):
        """显示集合中的所有文档"""
        client = self.get_client()
        if client:
            try:
                db = client[self.connection_string.get().split('/')[-1]]
                collection = db[self.collection_name.get()]
                
                documents = list(collection.find().limit(50))  # 限制显示50条
                
                self.result_text.delete(1.0, tk.END)
                self.result_text.insert(tk.END, f"集合 '{self.collection_name.get()}' 中的文档:\n")
                self.result_text.insert(tk.END, "-" * 50 + "\n")
                
                for i, doc in enumerate(documents, 1):
                    self.result_text.insert(tk.END, f"文档 {i}:\n")
                    
                    # 创建文档副本用于显示，处理MongoDB特定字段
                    display_doc = doc.copy()
                    
                    # 处理ObjectId字段
                    if '_id' in display_doc:
                        display_doc['_id'] = str(display_doc['_id'])
                    
                    # 处理时间字段
                    if 'publishTime' in display_doc and isinstance(display_doc['publishTime'], datetime):
                        display_doc['publishTime'] = display_doc['publishTime'].isoformat()
                    
                    # 格式化输出文档内容
                    formatted_doc = json.dumps(display_doc, ensure_ascii=False, indent=2, default=str)
                    self.result_text.insert(tk.END, formatted_doc + "\n")
                    self.result_text.insert(tk.END, "-" * 50 + "\n")
                
                if not documents:
                    self.result_text.insert(tk.END, "集合为空\n")
                    
            except Exception as e:
                messagebox.showerror("错误", f"获取文档失败: {str(e)}")
            finally:
                client.close()
    
    def import_json_data(self):
        """导入默认JSON数据到集合"""
        json_file_path = "F:\\github\\aiNews\\database_import\\news_data.json"
        self.import_data_from_file(json_file_path)
    
    def import_custom_json(self):
        """选择自定义JSON文件导入"""
        file_path = filedialog.askopenfilename(
            title="选择JSON文件",
            filetypes=[("JSON文件", "*.json"), ("所有文件", "*.*")]
        )
        
        if file_path:
            self.import_data_from_file(file_path)
    
    def validate_json_data(self, data):
        """验证JSON数据格式"""
        if not isinstance(data, list):
            return False, "JSON文件应该包含一个数组"
        
        required_fields = ['semanticId', 'title', 'summary', 'category', 'views', 'publishTime']
        validation_errors = []
        
        for i, item in enumerate(data):
            if not isinstance(item, dict):
                validation_errors.append(f"第{i+1}个元素不是字典格式")
                continue
            
            # 检查必需字段
            for field in required_fields:
                if field not in item:
                    validation_errors.append(f"文档{i+1}缺少必需字段: {field}")
            
            # 检查title字段结构
            if 'title' in item:
                if not isinstance(item['title'], dict):
                    validation_errors.append(f"文档{i+1}的title字段应该是对象格式")
                else:
                    if 'cn' not in item['title'] or 'en' not in item['title']:
                        validation_errors.append(f"文档{i+1}的title字段缺少cn或en语言")
            
            # 检查summary字段结构
            if 'summary' in item:
                if not isinstance(item['summary'], dict):
                    validation_errors.append(f"文档{i+1}的summary字段应该是对象格式")
                else:
                    if 'cn' not in item['summary'] or 'en' not in item['summary']:
                        validation_errors.append(f"文档{i+1}的summary字段缺少cn或en语言")
            
            # 检查category字段结构
            if 'category' in item:
                if not isinstance(item['category'], dict):
                    validation_errors.append(f"文档{i+1}的category字段应该是对象格式")
                else:
                    if 'cn' not in item['category'] or 'en' not in item['category']:
                        validation_errors.append(f"文档{i+1}的category字段缺少cn或en语言")
            
            # 检查tags字段结构
            if 'tags' in item:
                if not isinstance(item['tags'], dict):
                    validation_errors.append(f"文档{i+1}的tags字段应该是对象格式")
                else:
                    if 'cn' not in item['tags'] or 'en' not in item['tags']:
                        validation_errors.append(f"文档{i+1}的tags字段缺少cn或en语言")
            
            # 检查locales字段结构（如果存在）
            if 'locales' in item:
                if not isinstance(item['locales'], dict):
                    validation_errors.append(f"文档{i+1}的locales字段应该是对象格式")
                else:
                    if 'cn' not in item['locales'] or 'en' not in item['locales']:
                        validation_errors.append(f"文档{i+1}的locales字段缺少cn或en语言配置")
        
        if validation_errors:
            return False, "\n".join(validation_errors[:10])  # 显示前10个错误
        
        return True, "数据格式验证通过"
    
    def import_data_from_file(self, file_path):
        """从文件导入数据到集合"""
        if not os.path.exists(file_path):
            messagebox.showerror("错误", f"JSON文件不存在: {file_path}")
            return
        
        client = self.get_client()
        if client:
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                
                # 数据验证
                is_valid, validation_message = self.validate_json_data(data)
                if not is_valid:
                    messagebox.showerror("数据验证失败", validation_message)
                    return
                
                db = client[self.connection_string.get().split('/')[-1]]
                collection = db[self.collection_name.get()]
                
                # 清空现有集合
                collection.delete_many({})
                
                # 准备插入数据，确保包含MongoDB需要的字段
                documents_to_insert = []
                for doc in data:
                    # 创建文档副本，确保不修改原始数据
                    document = doc.copy()
                    
                    # 如果文档没有_id字段，MongoDB会自动生成
                    if '_id' in document:
                        del document['_id']
                    
                    # 确保时间字段格式正确
                    if 'publishTime' in document and isinstance(document['publishTime'], str):
                        try:
                            document['publishTime'] = datetime.fromisoformat(document['publishTime'].replace('Z', '+00:00'))
                        except (ValueError, TypeError):
                            # 如果时间格式无效，使用当前时间
                            document['publishTime'] = datetime.now()
                    
                    documents_to_insert.append(document)
                
                # 插入新数据
                result = collection.insert_many(documents_to_insert)
                
                self.result_text.delete(1.0, tk.END)
                self.result_text.insert(tk.END, "✅ 数据导入成功！\n")
                self.result_text.insert(tk.END, f"文件路径: {file_path}\n")
                self.result_text.insert(tk.END, f"插入文档数量: {len(result.inserted_ids)}\n")
                self.result_text.insert(tk.END, f"数据验证: {validation_message}\n")
                self.result_text.insert(tk.END, f"导入时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                
                # 显示导入的文档概要
                self.result_text.insert(tk.END, "\n导入的文档概要:\n")
                for i, doc in enumerate(documents_to_insert[:5], 1):  # 显示前5个文档
                    self.result_text.insert(tk.END, f"文档{i}: {doc.get('semanticId', '无ID')} - {doc.get('title', {}).get('cn', '无标题')}\n")
                
                if len(documents_to_insert) > 5:
                    self.result_text.insert(tk.END, f"... 还有{len(documents_to_insert)-5}个文档\n")
                
            except json.JSONDecodeError:
                messagebox.showerror("错误", "JSON文件格式错误，无法解析")
            except Exception as e:
                messagebox.showerror("错误", f"导入数据失败: {str(e)}")
            finally:
                client.close()
    
    def clear_collection(self):
        """清空集合"""
        if messagebox.askyesno("确认", "确定要清空集合吗？此操作不可恢复！"):
            client = self.get_client()
            if client:
                try:
                    db = client[self.connection_string.get().split('/')[-1]]
                    collection = db[self.collection_name.get()]
                    
                    result = collection.delete_many({})
                    
                    self.result_text.delete(1.0, tk.END)
                    self.result_text.insert(tk.END, "✅ 集合已清空！\n")
                    self.result_text.insert(tk.END, f"删除文档数量: {result.deleted_count}\n")
                    
                except Exception as e:
                    messagebox.showerror("错误", f"清空集合失败: {str(e)}")
                finally:
                    client.close()

def main():
    """主函数"""
    root = tk.Tk()
    app = MongoDBGUITool(root)
    root.mainloop()

if __name__ == "__main__":
    main()