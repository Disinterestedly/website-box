window.SEED_DATA = (function () {
  var now = Date.now();
  var day = 24 * 60 * 60 * 1000;
  var at = function (offset) {
    return new Date(now - offset * day).toISOString();
  };

  return {
    websites: [
      {
        id: "seed-site-website-box-home",
        name: "网站盒子主页",
        url: "https://disinterestedly.github.io/website-box/",
        category: "收藏",
        description: "这个网站盒子的公网主页，适合在手机和电脑上快速打开。",
        tags: ["自建", "主页"],
        starred: true,
        createdAt: at(0)
      },
      {
        id: "seed-site-github",
        name: "GitHub",
        url: "https://github.com",
        category: "开发",
        description: "浏览与收藏开源项目、代码片段和开发者工具。",
        tags: ["代码", "开源"],
        starred: true,
        createdAt: at(2)
      },
      {
        id: "seed-site-wikipedia",
        name: "维基百科",
        url: "https://zh.wikipedia.org",
        category: "知识",
        description: "开放、持续更新的百科知识库，适合检索背景信息。",
        tags: ["百科", "开放内容"],
        starred: false,
        createdAt: at(3)
      },
      {
        id: "seed-site-arxiv",
        name: "arXiv",
        url: "https://arxiv.org",
        category: "学习",
        description: "物理学、计算机等领域的预印本论文平台。",
        tags: ["论文", "科学"],
        starred: false,
        createdAt: at(6)
      },
      {
        id: "seed-site-sspai",
        name: "少数派",
        url: "https://sspai.com",
        category: "资讯",
        description: "关注科技产品、效率方法与数字生活方式。",
        tags: ["科技", "效率"],
        starred: true,
        createdAt: at(9)
      },
      {
        id: "seed-site-painting",
        name: "故宫名画记",
        url: "https://minghuaji.dpm.org.cn",
        category: "艺术",
        description: "高清欣赏故宫博物院收藏的中国历代名画。",
        tags: ["绘画", "博物馆"],
        starred: true,
        createdAt: at(12)
      },
      {
        id: "seed-site-reading",
        name: "微信读书",
        url: "https://weread.qq.com",
        category: "阅读",
        description: "阅读电子书并记录想法、整理书单。",
        tags: ["电子书", "阅读"],
        starred: false,
        createdAt: at(15)
      },
      {
        id: "seed-site-pdf",
        name: "iLovePDF",
        url: "https://www.ilovepdf.com/zh-cn",
        category: "工具",
        description: "在线合并、拆分、压缩和转换 PDF 文件。",
        tags: ["PDF", "格式转换"],
        starred: false,
        createdAt: at(18)
      },
      {
        id: "seed-site-ncpssd",
        name: "国家哲学社会科学文献中心",
        url: "https://www.ncpssd.org",
        category: "学习",
        description: "检索中文学术期刊论文与社科文献资料。",
        tags: ["论文", "学术"],
        starred: false,
        createdAt: at(24)
      },
      {
        id: "seed-site-commons",
        name: "Wikimedia Commons",
        url: "https://commons.wikimedia.org",
        category: "素材",
        description: "海量自由授权的图片、音视频与公共领域素材。",
        tags: ["图片", "CC"],
        starred: true,
        createdAt: at(28)
      },
      {
        id: "seed-site-excalidraw",
        name: "Excalidraw",
        url: "https://excalidraw.com",
        category: "工具",
        description: "快速绘制草图、流程图与协作白板。",
        tags: ["绘图", "白板"],
        starred: false,
        createdAt: at(32)
      }
    ],
    images: [
      {
        id: "seed-image-forest",
        title: "晨雾森林",
        image: "assets/art/forest-mist.svg",
        source: "",
        tags: ["自然", "晨雾"],
        starred: true,
        createdAt: at(1)
      },
      {
        id: "seed-image-coast",
        title: "海边日出",
        image: "assets/art/dawn-coast.svg",
        source: "",
        tags: ["海岸", "日出"],
        starred: true,
        createdAt: at(4)
      },
      {
        id: "seed-image-gallery",
        title: "美术馆光影",
        image: "assets/art/gallery-light.svg",
        source: "",
        tags: ["建筑", "光影"],
        starred: false,
        createdAt: at(8)
      },
      {
        id: "seed-image-garden",
        title: "热带植物",
        image: "assets/art/tropical-garden.svg",
        source: "",
        tags: ["植物", "色彩"],
        starred: false,
        createdAt: at(14)
      }
    ],
    films: [
      {
        id: "seed-film-wander",
        title: "流浪地球2",
        poster: "assets/posters/space-epic.svg",
        url: "https://www.douban.com/search?q=%E6%B5%81%E6%B5%AA%E5%9C%B0%E7%90%832",
        category: "电影",
        state: "已看",
        rating: "8.3",
        notes: "大刘文本里的中国科幻被拍出了难得的史诗感。",
        tags: ["科幻", "灾难"],
        starred: true,
        createdAt: at(2)
      },
      {
        id: "seed-film-oppenheimer",
        title: "奥本海默",
        poster: "assets/posters/human-drama.svg",
        url: "https://www.douban.com/search?q=%E5%A5%A5%E6%9C%AC%E6%B5%B7%E9%BB%98",
        category: "电影",
        state: "想看",
        rating: "",
        notes: "",
        tags: ["人物", "历史"],
        starred: false,
        createdAt: at(5)
      },
      {
        id: "seed-film-changan",
        title: "长安三万里",
        poster: "assets/posters/fantasy-tale.svg",
        url: "https://www.douban.com/search?q=%E9%95%BF%E5%AE%89%E4%B8%89%E4%B8%87%E9%87%8C",
        category: "电影",
        state: "想看",
        rating: "",
        notes: "唐诗与盛唐气象，适合慢慢看。",
        tags: ["历史", "动画"],
        starred: false,
        createdAt: at(7)
      },
      {
        id: "seed-film-planet",
        title: "地球脉动",
        poster: "assets/posters/nature-doc.svg",
        url: "https://search.bilibili.com/all?keyword=%E5%9C%B0%E7%90%83%E8%84%89%E5%8A%A8",
        category: "纪录片",
        state: "正在看",
        rating: "9.7",
        notes: "自然影像的顶级制作，适合大屏观看。",
        tags: ["自然", "BBC"],
        starred: true,
        createdAt: at(11)
      },
      {
        id: "seed-film-liberation",
        title: "我的解放日志",
        poster: "assets/posters/human-drama.svg",
        url: "https://www.douban.com/search?q=%E6%88%91%E7%9A%84%E8%A7%A3%E6%94%BE%E6%97%A5%E5%BF%97",
        category: "剧集",
        state: "想看",
        rating: "",
        notes: "",
        tags: ["韩剧", "生活"],
        starred: false,
        createdAt: at(16)
      },
      {
        id: "seed-film-rick",
        title: "瑞克和莫蒂",
        poster: "assets/posters/space-epic.svg",
        url: "https://www.douban.com/search?q=%E7%91%9E%E5%85%8B%E5%92%8C%E8%8E%AB%E8%92%82",
        category: "动漫",
        state: "已看",
        rating: "9.7",
        notes: "",
        tags: ["科幻", "喜剧"],
        starred: false,
        createdAt: at(20)
      }
    ]
  };
})();

window.DEFAULT_ASSETS = {
  images: [
    "assets/art/forest-mist.svg",
    "assets/art/dawn-coast.svg",
    "assets/art/gallery-light.svg",
    "assets/art/tropical-garden.svg"
  ],
  posters: {
    "电影": "assets/posters/space-epic.svg",
    "剧集": "assets/posters/human-drama.svg",
    "纪录片": "assets/posters/nature-doc.svg",
    "动漫": "assets/posters/fantasy-tale.svg"
  }
};
