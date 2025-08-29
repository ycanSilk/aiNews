import express from 'express';
const router = express.Router();

// 获取时间轴配置数据（替代静态timeLine.json）
router.get('/timeline-config', async (req, res) => {
  try {
    // 返回模拟的时间轴配置数据
    const timelineConfig = {
      title: {
        zh: "AI发展时间轴",
        en: "AI Development Timeline"
      },
      description: {
        zh: "人工智能领域的重要里程碑和事件时间轴",
        en: "Timeline of important milestones and events in the field of artificial intelligence"
      },
      filters: [
        { id: 'all', label: { zh: '全部', en: 'All' } },
        { id: 'important', label: { zh: '重要', en: 'Important' } },
        { id: 'research', label: { zh: '研究', en: 'Research' } },
        { id: 'product', label: { zh: '产品', en: 'Product' } },
        { id: 'policy', label: { zh: '政策', en: 'Policy' } }
      ],
      dateFormat: {
        zh: "YYYY年MM月DD日",
        en: "MMMM DD, YYYY"
      },
      timeFormat: {
        zh: "HH:mm",
        en: "h:mm A"
      },
      months: {
        zh: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      },
      weekdays: {
        zh: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      }
    };

    res.json(timelineConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;