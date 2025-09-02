import express from 'express';
const router = express.Router();

// 获取时间轴配置数据（替代静态timeLine.json）
router.get('/timeline-config', async (req, res) => {
  try {
    // 返回模拟的时间轴配置数据
    const timelineConfig = {
      title: {
        ch: "AI发展时间轴",
        en: "AI Development Timeline"
      },
      description: {
        ch: "人工智能领域的重要里程碑和事件时间轴",
        en: "Timeline of important milestones and events in the field of artificial intelligence"
      },
      filters: [
        { id: 'all', label: { ch: '全部', en: 'All' } },
        { id: 'important', label: { ch: '重要', en: 'Important' } },
        { id: 'research', label: { ch: '研究', en: 'Research' } },
        { id: 'product', label: { ch: '产品', en: 'Product' } },
        { id: 'policy', label: { ch: '政策', en: 'Policy' } }
      ],
      dateFormat: {
        ch: "YYYY年MM月DD日",
        en: "MMMM DD, YYYY"
      },
      timeFormat: {
        ch: "HH:mm",
        en: "h:mm A"
      },
      months: {
        ch: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      },
      weekdays: {
        ch: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      }
    };

    res.json(timelineConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;