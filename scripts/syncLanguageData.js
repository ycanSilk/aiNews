import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置路径
const config = {
  masterDataPath: path.join(__dirname, '../src/data/newsMasterData.json'),
  languageDataPaths: {
    ch: path.join(__dirname, '../src/data/ch/newsData.json'),
    en: path.join(__dirname, '../src/data/en/newsData.json')
  },
  backupDir: path.join(__dirname, '../src/data/backup')
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

// 写入JSON文件
function writeJSON(filePath, data) {
  try {
    // 确保目录存在
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote to ${filePath}`);
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error.message);
  }
}

// 备份现有文件
function backupFile(filePath, backupType) {
  try {
    if (!fs.existsSync(config.backupDir)) {
      fs.mkdirSync(config.backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `${path.basename(filePath, '.json')}_${backupType}_${timestamp}.json`;
    const backupPath = path.join(config.backupDir, backupFileName);
    
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`Backup created: ${backupPath}`);
    }
  } catch (error) {
    console.error(`Error creating backup for ${filePath}:`, error.message);
  }
}

// 从主数据生成语言特定数据
function generateLanguageData(masterData, languageCode) {
  return masterData.news.map(newsItem => ({
    id: newsItem.id,
    title: newsItem.locales[languageCode]?.title || '',
    summary: newsItem.locales[languageCode]?.summary || '',
    category: newsItem.category,
    source: newsItem.source,
    author: newsItem.author,
    publishTime: newsItem.publishTime,
    isBreaking: newsItem.isBreaking,
    isImportant: newsItem.isImportant,
    views: newsItem.views,
    comments: newsItem.comments,
    tags: newsItem.locales[languageCode]?.tags || []
  }));
}

// 同步所有语言数据
function syncAllLanguages() {
  console.log('Starting language data synchronization...');
  
  // 读取主数据
  const masterData = readJSON(config.masterDataPath);
  if (!masterData) {
    console.error('Master data file not found');
    return;
  }
  
  // 备份现有文件
  console.log('\nCreating backups...');
  backupFile(config.languageDataPaths.ch, 'pre_sync');
  backupFile(config.languageDataPaths.en, 'pre_sync');
  
  // 生成并写入中文数据
  console.log('\nGenerating Chinese data...');
  const chData = generateLanguageData(masterData, 'zh');
  writeJSON(config.languageDataPaths.ch, chData);
  
  // 生成并写入英文数据
  console.log('Generating English data...');
  const enData = generateLanguageData(masterData, 'en');
  writeJSON(config.languageDataPaths.en, enData);
  
  console.log('\n✅ Language data synchronization completed!');
  console.log(`Chinese items: ${chData.length}`);
  console.log(`English items: ${enData.length}`);
}

// 检查数据一致性
function checkConsistency() {
  console.log('Checking data consistency...');
  
  const masterData = readJSON(config.masterDataPath);
  const chData = readJSON(config.languageDataPaths.ch);
  const enData = readJSON(config.languageDataPaths.en);
  
  if (!masterData || !chData || !enData) {
    console.error('Required data files not found');
    return;
  }
  
  const inconsistencies = [];
  
  // 检查数量一致性
  if (masterData.news.length !== chData.length) {
    inconsistencies.push(`Master data has ${masterData.news.length} items, but Chinese data has ${chData.length}`);
  }
  
  if (masterData.news.length !== enData.length) {
    inconsistencies.push(`Master data has ${masterData.news.length} items, but English data has ${enData.length}`);
  }
  
  // 检查ID一致性
  const masterIds = new Set(masterData.news.map(item => item.id));
  const chIds = new Set(chData.map(item => item.id));
  const enIds = new Set(enData.map(item => item.id));
  
  if (masterIds.size !== chIds.size) {
    inconsistencies.push('ID count mismatch between master and Chinese data');
  }
  
  if (masterIds.size !== enIds.size) {
    inconsistencies.push('ID count mismatch between master and English data');
  }
  
  // 输出结果
  if (inconsistencies.length === 0) {
    console.log('✅ All data is consistent!');
  } else {
    console.log('❌ Found inconsistencies:');
    inconsistencies.forEach(issue => console.log(`  - ${issue}`));
  }
  
  return inconsistencies;
}

// 主同步函数
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'sync':
      syncAllLanguages();
      break;
    case 'check':
      checkConsistency();
      break;
    case 'backup':
      backupFile(config.languageDataPaths.ch, 'manual');
      backupFile(config.languageDataPaths.en, 'manual');
      break;
    default:
      console.log('Usage: node syncLanguageData.js [sync|check|backup]');
      console.log('  sync    - Synchronize all language data from master');
      console.log('  check   - Check data consistency');
      console.log('  backup  - Create manual backups');
      break;
  }
}

// 执行
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { syncAllLanguages, checkConsistency, generateLanguageData };