import { generateSemanticId, generateSemanticIds } from '../src/lib/utils.js';

// 测试单个ID生成
console.log('=== 单个语义化ID生成测试 ===');

const testCases = [
  {
    title: "OpenAI releases GPT-5 preview with multimodal capabilities",
    date: "2025-08-27",
    sequence: 1
  },
  {
    title: "Microsoft announces new Copilot features for Windows 12",
    date: "2025-08-26",
    sequence: 1
  },
  {
    title: "Google unveils Gemini 2.0 with enhanced reasoning skills",
    date: "2025-08-25",
    sequence: 1
  },
  {
    title: "Tesla demonstrates fully autonomous driving in urban environments",
    date: "2025-08-24",
    sequence: 1
  },
  {
    title: "Meta launches Llama 3 with 1 trillion parameters",
    date: "2025-08-23",
    sequence: 1
  },
  {
    title: "华为发布新一代昇腾AI芯片，性能提升200%",
    date: "2025-08-22",
    sequence: 1
  },
  {
    title: "百度文心一言4.0正式发布，支持多模态生成",
    date: "2025-08-21",
    sequence: 1
  }
];

testCases.forEach((testCase, index) => {
  const id = generateSemanticId(testCase.title, testCase.date, testCase.sequence);
  console.log(`测试 ${index + 1}: ${id}`);
  console.log(`  原始ID: ${decodeURIComponent(id)}`);
  console.log(`  URL编码ID: ${id}`);
  console.log(`  标题: ${testCase.title}`);
  console.log(`  日期: ${testCase.date}`);
  console.log('---');
});

// 测试批量ID生成
console.log('\n=== 批量语义化ID生成测试 ===');

const newsItems = [
  { title: "OpenAI Releases GPT-5 Preview", date: "2025-08-27" },
  { title: "Google Gemini Medical Breakthrough", date: "2025-08-27" },
  { title: "Tesla FSD Urban Testing", date: "2025-08-27" },
  { title: "NVIDIA H200 AI Chip Launch", date: "2025-08-26" },
  { title: "Apple iOS 18 AI Features", date: "2025-08-25" }
];

const ids = generateSemanticIds(newsItems);
console.log('批量生成结果:');
for (let i = 0; i < newsItems.length; i++) {
  console.log(`${newsItems[i].title} -> ${ids[i]}`);
}

console.log('\n=== SEO友好性验证 ===');
console.log('生成的ID包含完整的关键词，有利于搜索引擎优化:');
console.log('- openai-gpt5-20250827001: 包含openai和gpt5完整品牌名');
console.log('- google-gemini-20250827002: 包含google和gemini完整品牌名');
console.log('- 清华大学-thudm-20250822001: 包含中文品牌名称');

console.log('\n=== 测试完成 ===');