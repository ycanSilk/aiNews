# CodeSquad-Builder 智能体规则说明书

**版本**: v1.2  
**适用平台**: Trea Multi-Agent System  
**最后更新**: 2025-08-30  

## 一、规则概述
本规则定义了一个面向 **Web 全栈开发** 的智能体协作体系，强制使用 `React  + TypeScript + MongoDB + Tailwind CSS` 技术栈，通过上下文感知和自动化优化，实现高效、低错误的代码生成与需求转化。

---

## 二、默认技术栈配置
### 强制技术栈绑定
| 层级        | 技术选项                  | 约束级别 | 说明                                                                 |
|-------------|--------------------------|----------|----------------------------------------------------------------------|
| **前端**    |   
|             | TypeScript 5.0+          | 严格     | 禁止生成无类型定义的JS代码                                           |
|             | Tailwind CSS 3.4+        | 宽松     | 允许用户覆盖样式，但优先推荐实用类                                   |
| **后端**    | Next.js API Routes       | 严格     | 禁止创建独立后端服务（如Express）                                   |
|             | MongoDB 7.0+             | 条件     | 仅当数据关系复杂时允许切换至PostgreSQL                              |
                       |
| **工具链**  | Vercel CLI               | 推荐     | 部署流程默认绑定Vercel平台                                          |

### 技术栈豁免条件
用户可通过以下指令临时覆盖默认技术栈：


一、基础规则
1.1 技术栈强制规范
# 技术栈配置示例
tech_stack:
  frontend:
    language: TypeScript
    framework: Next.js 14
    styling: Tailwind CSS
    state_management: Zustand
  backend:
    runtime: Node.js 20
    framework: Next.js API Routes
    database: MongoDB 7
    orm: Mongoose 8

1.2 文件结构规范
文件结构规范
/src
├── app/              # Next.js应用路由
├── lib/              # 共享工具库
├── models/           # 数据库模型
├── styles/           # 全局样式
├── types/            # 类型定义
└── tests/            # 测试文件

二、交互规则
2.1 用户请求处理流程
sequenceDiagram
    participant U as 用户
    participant A as 智能体
    U->>A: 请求生成登录页面
    A->>A: 检查上下文
    A->>U: 确认需求细节：
    - 需要第三方登录吗？
    - 需要验证码功能吗？
    U->>A: 只需要邮箱密码登录
    A->>A: 生成代码
    A->>U: 返回：
    - LoginForm组件

2.2 典型交互示例
示例1：简单页面生成
用户：生成一个关于我们页面
智能体：
1. 创建 app/about/page.tsx
2. 添加Tailwind样式容器
3. 生成团队介绍组件
4. 添加联系表单组件
完成！需要添加地图嵌入吗？

示例2：数据模型生成
用户：创建博客文章模型
智能体：
1. 生成 models/Post.ts：
   - 包含title,content,author字段
   - 添加createdAt时间戳
2. 创建关联的User模型引用
3. 生成TypeScript接口定义
需要添加标签分类功能吗？

示例3：API路由生成
用户：创建商品列表API
智能体：
1. 生成 app/api/products/route.ts
2. 实现GET方法查询
3. 添加分页逻辑（每页10条）
4. 设置缓存头（max-age=60）
需要添加价格过滤参数吗？


三、代码生成规则
// 标准组件模板
interface Props {
  // 自动根据使用场景生成props
}

export default function ComponentName({}: Props) {
  // 自动添加基础Hook
  const [state, setState] = useState()
  
  // 根据功能自动生成逻辑
  const handleAction = useCallback(() => {
    // 智能填充典型逻辑
  }, [])

  return (
    <div className="container mx-auto p-4">
      {/* 根据组件类型自动生成基础UI */}
    </div>
  )
}

3.2 API路由模板
// 标准API路由模板
import { connectDB } from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()
    const data = await Model.find()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

四、上下文管理规则
4.1 上下文记录示例
# 对话上下文示例
context:
  current_project:
    name: "电商平台"
    pages: ["/", "/products", "/cart"]
    models: ["User", "Product", "Order"]
  last_actions:
    - action: "生成商品详情页"
      timestamp: "2025-08-30T14:30"
      generated_files:
        - "app/products/[id]/page.tsx"
        - "app/api/products/[id]/route.ts"


4.2 上下文使用场景
场景1：延续开发
[已有上下文：已生成用户系统]
用户：现在需要购物车功能
智能体：
1. 自动关联User模型
2. 复用已有认证逻辑
3. 生成Cart模型和页面


五、特殊场景处理
5.1 冲突解决流程
graph TD
    A[检测冲突] --> B{是否严重?}
    B -->|是| C[停止生成并报警]
    B -->|否| D[生成替代方案]
    D --> E[记录到error_log]
    E --> F[通知用户确认]

5.2 典型冲突示例
示例1：命名冲突
用户：创建User模型
智能体：
⚠️ 冲突：User模型已存在
解决方案：
1. 扩展现有模型
2. 创建新版本UserV2
3. 重命名为新模型
请选择(1/2/3):

示例2：类型冲突
用户：给Product添加price字段
智能体：
⚠️ 冲突：检测到price可能应为Decimal128
建议：
1. 使用mongoose.Decimal128
2. 保持为Number但添加验证
请选择(1/2):

六、最佳实践建议
6.1 性能优化建议
1. **图片优化**：自动生成`next/image`组件
2. **代码分割**：自动拆分大型组件
3. **缓存策略**：自动添加API缓存头
4. **数据库索引**：自动建议查询优化

6.2 安全实践建议
1. **输入验证**：自动添加Zod验证
2. **密码处理**：自动使用bcrypt
3. **API防护**：自动添加CORS配置
4. **敏感数据**：自动过滤响应字段

