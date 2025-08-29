import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置路径
const config = {
  masterDataPath: path.join(__dirname, '../src/data/newsMasterData.json'),
  semanticConfigPath: path.join(__dirname, '../src/data/config/semanticIdConfig.json'),
  localeConfigPath: path.join(__dirname, '../src/data/config/localeConfig.json')
};

// 读取JSON文件
function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

// 验证语义化ID格式
function validateSemanticId(semanticId, semanticConfig) {
  const errors = [];
  
  if (!semanticId) {
    errors.push('Semantic ID is required');
    return errors;
  }
  
  // 检查基本格式
  const parts = semanticId.split('-');
  if (parts.length < 4) {
    errors.push(`Semantic ID '${semanticId}' should have at least 4 parts separated by hyphens`);
  }
  
  // 检查日期部分格式
  if (parts.length >= 3) {
    const datePart = parts[parts.length - 2];
    if (datePart.length !== 8 || !/^\d{8}$/.test(datePart)) {
      errors.push(`Date part '${datePart}' should be 8 digits (YYYYMMDD)`);
    }
  }
  
  // 检查序列号部分格式
  if (parts.length >= 4) {
    const sequencePart = parts[parts.length - 1];
    if (!/^\d{3}$/.test(sequencePart)) {
      errors.push(`Sequence part '${sequencePart}' should be 3 digits`);
    }
  }
  
  return errors;
}

// 验证日期格式
function validateDate(dateString, fieldName) {
  const errors = [];
  
  if (!dateString) {
    errors.push(`${fieldName} is required`);
    return errors;
  }
  
  // 检查ISO日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z?)?$/;
  if (!dateRegex.test(dateString)) {
    errors.push(`${fieldName} '${dateString}' should be in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ)`);
  }
  
  return errors;
}

// 验证多语言字段
function validateLocaleFields(locales, supportedLanguages) {
  const errors = [];
  
  for (const lang of supportedLanguages) {
    if (!locales[lang]) {
      errors.push(`Missing locale data for language '${lang}'`);
      continue;
    }
    
    const localeData = locales[lang];
    
    if (!localeData.title || typeof localeData.title !== 'string') {
      errors.push(`Title is required and must be a string for language '${lang}'`);
    }
    
    if (!localeData.summary || typeof localeData.summary !== 'string') {
      errors.push(`Summary is required and must be a string for language '${lang}'`);
    }
    
    if (!localeData.tags || !Array.isArray(localeData.tags)) {
      errors.push(`Tags must be an array for language '${lang}'`);
    } else if (localeData.tags.length === 0) {
      errors.push(`At least one tag is required for language '${lang}'`);
    }
  }
  
  return errors;
}

// 验证单条新闻数据
function validateNewsItem(newsItem, index, semanticConfig, supportedLanguages) {
  const errors = [];
  
  // 验证必填字段
  if (!newsItem.id) errors.push('ID is required');
  if (!newsItem.semanticId) errors.push('Semantic ID is required');
  if (!newsItem.category) errors.push('Category is required');
  
  // 验证语义化ID
  const semanticErrors = validateSemanticId(newsItem.semanticId, semanticConfig);
  errors.push(...semanticErrors);
  
  // 验证日期字段
  const dateErrors = validateDate(newsItem.publishTime, 'Publish time');
  errors.push(...dateErrors);
  
  // 验证多语言字段
  if (!newsItem.locales) {
    errors.push('Locales field is required');
  } else {
    const localeErrors = validateLocaleFields(newsItem.locales, supportedLanguages);
    errors.push(...localeErrors);
  }
  
  // 验证数值字段
  if (typeof newsItem.views !== 'number' || newsItem.views < 0) {
    errors.push('Views must be a non-negative number');
  }
  
  if (typeof newsItem.comments !== 'number' || newsItem.comments < 0) {
    errors.push('Comments must be a non-negative number');
  }
  
  // 验证布尔字段
  if (typeof newsItem.isBreaking !== 'boolean') {
    errors.push('isBreaking must be a boolean');
  }
  
  if (typeof newsItem.isImportant !== 'boolean') {
    errors.push('isImportant must be a boolean');
  }
  
  return errors.length > 0 ? {
    itemIndex: index,
    itemId: newsItem.id,
    semanticId: newsItem.semanticId,
    errors: errors
  } : null;
}

// 主验证函数
function validateAllData() {
  console.log('Starting data validation...');
  
  // 读取配置文件
  const semanticConfig = readJSON(config.semanticConfigPath);
  const localeConfig = readJSON(config.localeConfigPath);
  const masterData = readJSON(config.masterDataPath);
  
  if (!masterData) {
    console.error('Master data file not found');
    return;
  }
  
  const supportedLanguages = localeConfig ? localeConfig.supportedLanguages : ['en', 'zh'];
  
  const validationResults = {
    totalItems: masterData.news.length,
    validItems: 0,
    invalidItems: 0,
    errors: []
  };
  
  // 验证每条新闻
  masterData.news.forEach((newsItem, index) => {
    const result = validateNewsItem(newsItem, index, semanticConfig, supportedLanguages);
    if (result) {
      validationResults.invalidItems++;
      validationResults.errors.push(result);
    } else {
      validationResults.validItems++;
    }
  });
  
  // 输出验证结果
  console.log('\n=== Validation Results ===');
  console.log(`Total items: ${validationResults.totalItems}`);
  console.log(`Valid items: ${validationResults.validItems}`);
  console.log(`Invalid items: ${validationResults.invalidItems}`);
  
  if (validationResults.errors.length > 0) {
    console.log('\n=== Detailed Errors ===');
    validationResults.errors.forEach(error => {
      console.log(`\nItem ${error.itemIndex} (ID: ${error.itemId}, SemanticID: ${error.semanticId}):`);
      error.errors.forEach(err => console.log(`  - ${err}`));
    });
  } else {
    console.log('\n✅ All data is valid!');
  }
  
  return validationResults;
}

// 执行验证
if (import.meta.url === `file://${process.argv[1]}`) {
  validateAllData();
}

export { validateAllData, validateNewsItem };