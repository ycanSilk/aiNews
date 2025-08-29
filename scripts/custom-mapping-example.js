// 示例：如何处理中文编码和自定义关键词

// 模拟数据 - 包含中文标题和未定义关键词的新闻
const newsItems = [
  { 
    title: "深度求索发布新一代AI搜索引擎", 
    date: "2025-08-28",
    // 这个公司不在预定义列表中
  },
  { 
    title: "字节跳动推出多模态大模型", 
    date: "2025-08-28",
    // 字节跳动不在预定义公司列表中
  },
  { 
    title: "某初创公司发布革命性AI芯片", 
    date: "2025-08-28",
    // 完全未知的公司和产品
  },
  { 
    title: "华为发布昇腾910B AI处理器", 
    date: "2025-08-28",
    // 这个在预定义列表中
  }
];

// 自定义映射表 - 处理未定义的关键词
const customMappings = {
  "深度求索发布新一代AI搜索引擎": {
    company: "deepseek",
    product: "ai-search"
  },
  "字节跳动推出多模态大模型": {
    company: "bytedance", 
    product: "multimodal-ai"
  },
  "某初创公司发布革命性AI芯片": {
    company: "startup-ai",
    product: "ai-chip"
  }
};

console.log('=== 中文编码长度问题解决方案 ===');
console.log('1. 中文内容URL编码后会变长，但这是Web标准要求');
console.log('2. 我们可以通过以下方式优化：');
console.log('   - 使用英文缩写或拼音替代长中文');
console.log('   - 限制产品名称长度');
console.log('   - 使用自定义映射表');
console.log('');

console.log('=== 自定义映射表示例 ===');
for (const item of newsItems) {
  const customMapping = customMappings[item.title];
  
  if (customMapping) {
    console.log(`标题: ${item.title}`);
    console.log(`  自定义映射: company=${customMapping.company}, product=${customMapping.product}`);
    console.log(`  生成的ID格式: ${customMapping.company}-${customMapping.product}-20250828001`);
    console.log(`  URL编码后: ${encodeURIComponent(customMapping.company + '-' + customMapping.product + '-20250828001')}`);
  } else {
    console.log(`标题: ${item.title}`);
    console.log(`  使用默认规则生成`);
    // 这里会使用函数中的默认逻辑
  }
  console.log('---');
}

console.log('');
console.log('=== 插入数据时的自定义方案 ===');
console.log('1. 在数据导入前创建映射表');
console.log('2. 对于每个新闻标题，检查是否需要自定义映射');
console.log('3. 可以在数据库中添加 company 和 product 字段直接存储');
console.log('4. 或者在导入时通过脚本批量处理');

console.log('');
console.log('=== 推荐的数据结构 ===');
const recommendedStructure = {
  id: "generated-semantic-id",
  title: "新闻标题",
  date: "2025-08-28",
  company: "自定义公司名",      // 新增字段
  product: "自定义产品名",     // 新增字段
  semanticId: "company-product-20250828001" // 最终生成的语义化ID
};

console.log(JSON.stringify(recommendedStructure, null, 2));