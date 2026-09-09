(function () {
  "use strict";

  var STORAGE_KEY = "website-box-data-v1";
  var state = null;
  var storageAvailable = true;
  var storageWarned = false;
  var activeSection = "websites";
  var currentFilter = "all";
  var currentQuery = "";
  var modalSection = "websites";
  var editingId = null;

  var WEBSITE_CATEGORIES = ["收藏", "工具", "VPN", "开发", "设计", "学习", "知识", "资讯", "阅读", "艺术", "素材", "生活"];
  var FILM_CATEGORIES = ["电影", "剧集", "纪录片", "动漫"];
  var FILM_STATES = ["想看", "正在看", "已看"];

  var FACE_CLASSES = ["face-coral", "face-teal", "face-gold", "face-green", "face-plum", "face-slate", "face-crimson"];

  var SECTIONS = {
    websites: {
      key: "websites",
      title: "网站收藏",
      noun: "网站",
      addText: "添加网站",
      searchPlaceholder: "搜索网站名称、备注或标签"
    },
    images: {
      key: "images",
      title: "优美图片",
      noun: "图片",
      addText: "添加图片",
      searchPlaceholder: "搜索图片标题、来源或标签"
    },
    films: {
      key: "films",
      title: "影视收藏",
      noun: "影视",
      addText: "添加影视",
      searchPlaceholder: "搜索影视片名、备注或标签"
    }
  };

  var FIELD_SCHEMAS = {
    websites: [
      { key: "name", label: "网站名称", type: "text", required: true, wide: true, placeholder: "例如：少数派" },
      { key: "url", label: "网址", type: "text", required: true, wide: false, placeholder: "https://example.com" },
      { key: "category", label: "分类", type: "select", options: WEBSITE_CATEGORIES, wide: false },
      { key: "starred", label: "置顶显示", type: "checkbox", wide: false },
      { key: "description", label: "一句话备注", type: "textarea", wide: true },
      { key: "tags", label: "标签", type: "text", wide: true, placeholder: "用逗号分隔，例如：效率, 工具" }
    ],
    images: [
      { key: "title", label: "图片标题", type: "text", required: true, wide: true, placeholder: "给这张图起个名字" },
      { key: "image", label: "图片地址", type: "text", required: false, wide: true, placeholder: "https://... 或本盒内的图片路径" },
      { key: "source", label: "来源页面", type: "text", required: false, wide: false, placeholder: "https://..." },
      { key: "starred", label: "置顶显示", type: "checkbox", wide: false },
      { key: "tags", label: "标签", type: "text", wide: true, placeholder: "用逗号分隔，例如：自然, 壁纸" }
    ],
    films: [
      { key: "title", label: "片名", type: "text", required: true, wide: true, placeholder: "例如：地球脉动" },
      { key: "poster", label: "封面地址", type: "text", required: false, wide: true, placeholder: "https://... 留空则使用自动封面" },
      { key: "category", label: "类型", type: "select", options: FILM_CATEGORIES, wide: false },
      { key: "state", label: "观看状态", type: "select", options: FILM_STATES, wide: false },
      { key: "url", label: "观看或标记地址", type: "text", required: false, wide: false, placeholder: "https://..." },
      { key: "rating", label: "评分", type: "text", required: false, wide: false, placeholder: "可选，例如 9.2" },
      { key: "starred", label: "置顶显示", type: "checkbox", wide: false },
      { key: "tags", label: "标签", type: "text", wide: false, placeholder: "用逗号分隔" },
      { key: "notes", label: "观后想法", type: "textarea", wide: true }
    ]
  };

  var dom = {
    search: document.getElementById("searchInput"),
    searchClear: document.getElementById("searchClear"),
    importButton: document.getElementById("importButton"),
    exportButton: document.getElementById("exportButton"),
    sectionTitle: document.getElementById("sectionTitle"),
    sectionMeta: document.getElementById("sectionMeta"),
    addButton: document.getElementById("addButton"),
    addButtonText: document.getElementById("addButtonText"),
    filterBar: document.getElementById("filterBar"),
    grid: document.getElementById("itemGrid"),
    empty: document.getElementById("emptyState"),
    emptyTitle: document.getElementById("emptyTitle"),
    emptyAddButton: document.getElementById("emptyAddButton"),
    emptyResetButton: document.getElementById("emptyResetButton"),
    totalCount: document.getElementById("totalCount"),
    websitesCount: document.getElementById("websitesCount"),
    imagesCount: document.getElementById("imagesCount"),
    filmsCount: document.getElementById("filmsCount"),
    updatedAt: document.getElementById("updatedAt"),
    importFile: document.getElementById("importFile"),
    modal: document.getElementById("modalOverlay"),
    modalTitle: document.getElementById("modalTitle"),
    modalSub: document.getElementById("modalSub"),
    form: document.getElementById("editForm"),
    formFields: document.getElementById("formFields"),
    saveButton: document.getElementById("saveButton"),
    lightbox: document.getElementById("lightbox"),
    lightboxImage: document.getElementById("lightboxImage"),
    lightboxTitle: document.getElementById("lightboxTitle"),
    lightboxMeta: document.getElementById("lightboxMeta")
  };

  var SVG = {
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    starOutline: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
    pin: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
  };

  function svgMarkup(path, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
  }

  function starMarkup(active) {
    var fill = active ? ' fill="currentColor" stroke="none"' : "";
    return '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + fill + ">" + SVG.starOutline + "</svg>";
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function makeId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return prefix + "-" + window.crypto.randomUUID();
    }
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function strip(value) {
    return String(value == null ? "" : value).trim();
  }

  function parseTags(value) {
    return strip(value)
      .split(/[,，、]/)
      .map(function (tag) {
        return tag.trim();
      })
      .filter(Boolean);
  }

  function hashText(value) {
    var text = String(value || "x");
    var total = 0;
    for (var i = 0; i < text.length; i += 1) {
      total = (total + text.charCodeAt(i) * (i + 7)) % 999983;
    }
    return total;
  }

  function normalizedUrl(value) {
    var raw = strip(value);
    if (!raw) {
      return "";
    }
    if (/^(https?:|ftp:|file:|mailto:|tel:|#|\/\/)/i.test(raw)) {
      return raw;
    }
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) {
      return "";
    }
    if (/^([\w-]+\.)+[\w-]{2,}(\/|$)/.test(raw) || /^localhost(:\d+)?(\/|$)/.test(raw)) {
      return "https://" + raw;
    }
    return raw;
  }

  function fallbackFor(item, kind) {
    if (kind === "images") {
      var pool = window.DEFAULT_ASSETS.images;
      return pool[hashText(item.id + item.title) % pool.length];
    }
    var posters = window.DEFAULT_ASSETS.posters;
    return posters[item.category] || posters["电影"];
  }

  function seedState() {
    var seed = clone(window.SEED_DATA);
    var now = new Date().toISOString();
    Object.keys(seed).forEach(function (section) {
      seed[section] = seed[section].map(function (item) {
        if (!item.id) {
          item.id = makeId(section.slice(0, -1));
        }
        if (!item.createdAt) {
          item.createdAt = now;
        }
        return item;
      });
    });
    seed.version = 1;
    seed.seedVersion = 2;
    seed.savedAt = now;
    return seed;
  }

  function loadState() {
    var raw;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      raw = null;
    }
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.websites) && Array.isArray(parsed.images) && Array.isArray(parsed.films)) {
          var now = new Date().toISOString();
          Object.keys(SECTIONS).forEach(function (section) {
            parsed[section] = parsed[section].map(function (item) {
              if (!item || typeof item !== "object") {
                return null;
              }
              if (!item.id) {
                item.id = makeId(section.slice(0, -1));
              }
              if (!item.createdAt) {
                item.createdAt = now;
              }
              if (!Array.isArray(item.tags)) {
                item.tags = [];
              }
              return item;
            }).filter(Boolean);
          });
          parsed.version = 1;
          parsed.savedAt = parsed.savedAt || now;
          var seedVersion = Number(parsed.seedVersion || 1);
          if (seedVersion < 2) {
            var homeId = "seed-site-website-box-home";
            var hasHome = parsed.websites.some(function (item) {
              return item.id === homeId || item.url === "https://disinterestedly.github.io/website-box/";
            });
            if (!hasHome) {
              parsed.websites.unshift({
                id: homeId,
                name: "网站盒子主页",
                url: "https://disinterestedly.github.io/website-box/",
                category: "收藏",
                description: "这个网站盒子的公网主页，适合在手机和电脑上快速打开。",
                tags: ["自建", "主页"],
                starred: true,
                createdAt: now
              });
            }
            parsed.seedVersion = 2;
            parsed._needsPersist = true;
          }
          return parsed;
        }
      } catch (error) {
        raw = null;
      }
    }
    return seedState();
  }

  function saveState() {
    state.savedAt = new Date().toISOString();
    if (!storageAvailable) {
      if (!storageWarned) {
        storageWarned = true;
        window.alert("当前浏览器不允许本地保存，本次数据只能保留在内存中，请尽快导出备份。");
      }
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      storageAvailable = false;
      if (!storageWarned) {
        storageWarned = true;
        window.alert("保存失败：浏览器本地空间可能已满或禁止保存，请先导出备份。");
      }
    }
  }

  function probeStorage() {
    try {
      window.localStorage.setItem("website-box-storage-probe", "1");
      window.localStorage.removeItem("website-box-storage-probe");
      return true;
    } catch (error) {
      return false;
    }
  }

  function itemList(section) {
    return state[section] || [];
  }

  function findItem(section, id) {
    return itemList(section).find(function (item) {
      return item.id === id;
    });
  }

  function setSearch(value) {
    currentQuery = strip(value);
    dom.searchClear.hidden = !currentQuery;
    render();
  }

  function getFilterOptions(section) {
    if (section === "websites") {
      return ["全部"].concat(WEBSITE_CATEGORIES);
    }
    if (section === "films") {
      return ["全部"].concat(FILM_CATEGORIES);
    }
    var tags = [];
    itemList("images").forEach(function (item) {
      (item.tags || []).forEach(function (tag) {
        if (tags.indexOf(tag) === -1) {
          tags.push(tag);
        }
      });
    });
    return ["全部"].concat(tags);
  }

  function visibleItems() {
    var list = itemList(activeSection).filter(function (item) {
      if (currentFilter !== "all") {
        var compare = activeSection === "images" ? (item.tags || []).indexOf(currentFilter) !== -1 : item.category === currentFilter;
        if (!compare) {
          return false;
        }
      }
      if (!currentQuery) {
        return true;
      }
      var haystack = [item.name, item.title, item.description, item.notes, item.url, item.source, item.category, item.state].join(" ").toLowerCase();
      var tags = (item.tags || []).join(" ").toLowerCase();
      return (haystack + " " + tags).indexOf(currentQuery.toLowerCase()) !== -1;
    });
    return list.sort(function (a, b) {
      if (!!a.starred !== !!b.starred) {
        return a.starred ? -1 : 1;
      }
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
  }

  function domainOf(url) {
    var normalized = normalizedUrl(url);
    if (!normalized) {
      return "";
    }
    try {
      return new URL(normalized, "https://local.invalid").hostname.replace(/^www\./, "");
    } catch (error) {
      return normalized;
    }
  }

  function siteFaceClass(category) {
    return FACE_CLASSES[hashText(category) % FACE_CLASSES.length];
  }

  function websiteCard(item) {
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span class="tag">' + esc(tag) + "</span>";
    }).join("");
    return (
      '<article class="collection-card website-card" data-id="' + esc(item.id) + '">' +
        '<div class="site-top">' +
          '<div class="site-face ' + siteFaceClass(item.category) + '">' + esc(String(item.name || "?").charAt(0)) + "</div>" +
          '<button class="mini-btn card-pin" type="button" data-action="star" title="' + (item.starred ? "取消置顶" : "置顶") + '">' + starMarkup(!!item.starred) + "</button>" +
        "</div>" +
        '<h3 class="card-title" title="' + esc(item.name) + '">' + esc(item.name) + "</h3>" +
        '<p class="card-domain">' + esc(domainOf(item.url)) + "</p>" +
        (item.description ? '<p class="card-desc">' + esc(item.description) + "</p>" : "") +
        (tags ? '<div class="card-tags">' + tags + "</div>" : "") +
        '<div class="card-actions">' +
          '<span class="tag">' + esc(item.category) + "</span>" +
          '<span class="spacer"></span>' +
          '<button class="mini-btn" type="button" data-action="open" title="打开网站">' + svgMarkup(SVG.external) + "</button>" +
          '<button class="mini-btn" type="button" data-action="edit" title="编辑">' + svgMarkup(SVG.pencil) + "</button>" +
          '<button class="mini-btn danger" type="button" data-action="delete" title="删除">' + svgMarkup(SVG.trash) + "</button>" +
        "</div>" +
      "</article>"
    );
  }

  function imageCard(item) {
    var imageUrl = strip(item.image) || fallbackFor(item, "images");
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span class="tag">' + esc(tag) + "</span>";
    }).join("");
    return (
      '<article class="collection-card media-card" data-id="' + esc(item.id) + '">' +
        '<figure class="media-figure" data-action="zoom" role="button" tabindex="0" title="放大查看">' +
          '<img src="' + esc(imageUrl) + '" alt="' + esc(item.title) + '" loading="lazy" data-fallback="' + esc(fallbackFor(item, "images")) + '">' +
        "</figure>" +
        '<div class="media-body">' +
          '<div class="media-title-row">' +
            '<h3 class="media-title" title="' + esc(item.title) + '">' + esc(item.title) + "</h3>" +
            '<button class="mini-btn card-pin" type="button" data-action="star" title="' + (item.starred ? "取消置顶" : "置顶") + '">' + starMarkup(!!item.starred) + "</button>" +
          "</div>" +
          (tags ? '<div class="card-tags">' + tags + "</div>" : "") +
          '<div class="media-actions">' +
            (item.source ? '<button class="mini-btn" type="button" data-action="open" title="打开来源">' + svgMarkup(SVG.external) + "</button>" : "") +
            '<button class="mini-btn" type="button" data-action="zoom" title="放大查看">' + svgMarkup(SVG.eye) + "</button>" +
            '<span class="spacer"></span>' +
            '<button class="mini-btn" type="button" data-action="edit" title="编辑">' + svgMarkup(SVG.pencil) + "</button>" +
            '<button class="mini-btn danger" type="button" data-action="delete" title="删除">' + svgMarkup(SVG.trash) + "</button>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function filmCard(item) {
    var imageUrl = strip(item.poster) || fallbackFor(item, "films");
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span class="tag">' + esc(tag) + "</span>";
    }).join("");
    var stateClass = item.state === "已看" ? "badge-done" : item.state === "正在看" ? "badge-watch" : "badge-later";
    var rating = item.rating ? '<span class="badge score">' + esc(item.rating) + "</span>" : "";
    return (
      '<article class="collection-card media-card" data-id="' + esc(item.id) + '">' +
        '<figure class="media-figure" data-action="zoom" role="button" tabindex="0" title="查看详情">' +
          '<img src="' + esc(imageUrl) + '" alt="' + esc(item.title) + '" loading="lazy" data-fallback="' + esc(fallbackFor(item, "films")) + '">' +
        "</figure>" +
        '<div class="media-body">' +
          '<div class="media-title-row">' +
            '<h3 class="media-title" title="' + esc(item.title) + '">' + esc(item.title) + "</h3>" +
            '<button class="mini-btn card-pin" type="button" data-action="star" title="' + (item.starred ? "取消置顶" : "置顶") + '">' + starMarkup(!!item.starred) + "</button>" +
          "</div>" +
          '<div class="film-badges">' +
            '<span class="badge">' + esc(item.category) + "</span>" +
            '<span class="badge ' + stateClass + '">' + esc(item.state || "想看") + "</span>" +
            rating +
          "</div>" +
          (tags ? '<div class="card-tags">' + tags + "</div>" : "") +
          (item.notes ? '<p class="card-desc">' + esc(item.notes) + "</p>" : "") +
          '<div class="media-actions">' +
            (item.url ? '<button class="mini-btn" type="button" data-action="open" title="打开观看地址">' + svgMarkup(SVG.external) + "</button>" : "") +
            '<button class="mini-btn" type="button" data-action="zoom" title="查看详情">' + svgMarkup(SVG.info) + "</button>" +
            '<span class="spacer"></span>' +
            '<button class="mini-btn" type="button" data-action="edit" title="编辑">' + svgMarkup(SVG.pencil) + "</button>" +
            '<button class="mini-btn danger" type="button" data-action="delete" title="删除">' + svgMarkup(SVG.trash) + "</button>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderFilterChips() {
    var options = getFilterOptions(activeSection);
    var html = options.map(function (option) {
      var active = option === currentFilter ? " is-active" : "";
      return '<button class="filter-chip' + active + '" type="button" data-filter="' + esc(option) + '">' + esc(option) + "</button>";
    }).join("");
    dom.filterBar.innerHTML = html;
    dom.filterBar.hidden = options.length <= 1;
  }

  function renderGrid(items) {
    var renderer = activeSection === "websites" ? websiteCard : activeSection === "images" ? imageCard : filmCard;
    dom.grid.innerHTML = items.map(renderer).join("");
    dom.grid.dataset.section = activeSection;
  }

  function renderEmpty(items) {
    if (items.length > 0) {
      dom.empty.hidden = true;
      return;
    }
    dom.empty.hidden = false;
    var hasNoData = itemList(activeSection).length === 0;
    if (hasNoData) {
      dom.emptyTitle.textContent = "还没有收藏";
      dom.emptyAddButton.textContent = "添加" + SECTIONS[activeSection].noun;
      dom.emptyResetButton.hidden = false;
      dom.emptyAddButton.onclick = function () {
        openEditor(activeSection, null);
      };
      dom.emptyResetButton.onclick = loadSamples;
    } else {
      dom.emptyTitle.textContent = "没有找到匹配内容";
      dom.emptyAddButton.textContent = "清空搜索与筛选";
      dom.emptyResetButton.hidden = true;
      dom.emptyAddButton.onclick = function () {
        currentFilter = "all";
        setSearch("");
      };
    }
  }

  function render() {
    var config = SECTIONS[activeSection];
    var items = visibleItems();
    dom.sectionTitle.textContent = config.title;
    dom.addButtonText.textContent = config.addText;
    dom.search.placeholder = config.searchPlaceholder;

    if (currentQuery) {
      dom.sectionMeta.textContent = "找到 " + items.length + " 项";
    } else if (currentFilter !== "all") {
      dom.sectionMeta.textContent = "共 " + items.length + " 项 · " + currentFilter;
    } else {
      dom.sectionMeta.textContent = "共 " + itemList(activeSection).length + " 项";
    }

    ["websites", "images", "films"].forEach(function (section) {
      document.querySelectorAll('[data-section="' + section + '"].tab').forEach(function (button) {
        button.classList.toggle("is-active", activeSection === section);
      });
    });

    dom.totalCount.textContent = String(itemList("websites").length + itemList("images").length + itemList("films").length);
    dom.websitesCount.textContent = String(itemList("websites").length);
    dom.imagesCount.textContent = String(itemList("images").length);
    dom.filmsCount.textContent = String(itemList("films").length);
    dom.updatedAt.textContent = state.savedAt ? "最近更新 " + formatTime(state.savedAt) : "";
    renderFilterChips();
    renderGrid(items);
    renderEmpty(items);
  }

  function formatTime(iso) {
    var date = new Date(iso);
    if (isNaN(date.getTime())) {
      return "";
    }
    function pad(value) {
      return String(value).padStart(2, "0");
    }
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
  }

  function openUrl(url, fallbackUrl) {
    var target = normalizedUrl(url || "") || normalizedUrl(fallbackUrl || "");
    if (!target) {
      return;
    }
    if (/^(https?:|file:)/i.test(target) || /^(\.{0,2}\/|assets\/)/.test(target)) {
      window.open(target, "_blank", "noopener");
    }
  }

  function toggleStar(section, id) {
    var item = findItem(section, id);
    if (!item) {
      return;
    }
    item.starred = !item.starred;
    saveState();
    render();
  }

  function deleteItem(section, id) {
    var item = findItem(section, id);
    if (!item) {
      return;
    }
    var label = item.name || item.title || "这条收藏";
    if (!window.confirm("确定删除「" + label + "」吗？")) {
      return;
    }
    state[section] = state[section].filter(function (entry) {
      return entry.id !== id;
    });
    saveState();
    render();
  }

  function openLightbox(item) {
    var imageUrl = strip(item.image || item.poster) || fallbackFor(item, activeSection);
    dom.lightboxImage.src = imageUrl;
    dom.lightboxImage.alt = item.title || item.name || "";
    dom.lightboxTitle.textContent = item.title || item.name || "";
    var meta = [];
    if (item.category) {
      meta.push(item.category);
    }
    if (item.state) {
      meta.push(item.state);
    }
    if (item.rating) {
      meta.push(item.rating + " 分");
    }
    if (item.notes) {
      meta.push(item.notes);
    }
    dom.lightboxMeta.textContent = meta.join(" · ");
    dom.lightbox.hidden = false;
  }

  function closeLightbox() {
    dom.lightbox.hidden = true;
    dom.lightboxImage.src = "";
  }

  function fieldInputHtml(field, value) {
    if (field.type === "checkbox") {
      return (
        '<div class="form-field ' + (field.wide ? "is-wide" : "") + '">' +
          '<label class="check-row">' +
            '<input class="form-check" type="checkbox" name="' + esc(field.key) + '"' + (value ? " checked" : "") + ">" +
            "<span>" + esc(field.label) + "</span>" +
          "</label>" +
        "</div>"
      );
    }
    var control;
    if (field.type === "select") {
      var options = field.options.map(function (option) {
        return '<option value="' + esc(option) + '"' + (value === option ? " selected" : "") + ">" + esc(option) + "</option>";
      }).join("");
      control = '<select class="form-control" id="field-' + esc(field.key) + '" name="' + esc(field.key) + '"' + (field.required ? " required" : "") + ">" + options + "</select>";
    } else if (field.type === "textarea") {
      control = '<textarea class="form-control" id="field-' + esc(field.key) + '" name="' + esc(field.key) + '"' + (field.required ? " required" : "") + ' placeholder="' + esc(field.placeholder || "") + '"></textarea>';
    } else {
      control = '<input class="form-control" id="field-' + esc(field.key) + '" type="text" name="' + esc(field.key) + '"' + (field.required ? " required" : "") + ' placeholder="' + esc(field.placeholder || "") + '" value="' + esc(value) + '">';
    }
    return (
      '<div class="form-field ' + (field.wide ? "is-wide" : "") + '">' +
        '<label for="field-' + esc(field.key) + '">' + esc(field.label) + "</label>" +
        control +
      "</div>"
    );
  }

  function itemToFormValue(item) {
    var value = clone(item || {});
    if (Array.isArray(value.tags)) {
      value.tags = value.tags.join(", ");
    }
    return value;
  }

  function openEditor(section, item) {
    modalSection = section;
    editingId = item ? item.id : null;
    var value = itemToFormValue(item);
    var html = FIELD_SCHEMAS[section].map(function (field) {
      return fieldInputHtml(field, value[field.key]);
    }).join("");
    dom.formFields.innerHTML = html;
    var isEdit = Boolean(item);
    dom.modalTitle.textContent = (isEdit ? "编辑" : "添加") + SECTIONS[section].noun;
    dom.modalSub.textContent = SECTIONS[section].title;
    dom.saveButton.textContent = isEdit ? "保存修改" : "保存";
    dom.modal.hidden = false;
    var firstControl = dom.form.querySelector(".form-control, .form-check");
    if (firstControl) {
      window.setTimeout(function () {
        firstControl.focus();
      }, 30);
    }
  }

  function closeModal() {
    dom.modal.hidden = true;
    dom.form.reset();
  }

  function collectForm() {
    var result = {};
    FIELD_SCHEMAS[modalSection].forEach(function (field) {
      var control = dom.form.elements.namedItem(field.key);
      if (!control) {
        return;
      }
      if (field.type === "checkbox") {
        result[field.key] = control.checked;
      } else {
        result[field.key] = strip(control.value);
      }
    });
    result.tags = parseTags(result.tags);
    return result;
  }

  function saveEditor() {
    var values = collectForm();
    var existing = findItem(modalSection, editingId);
    var now = new Date().toISOString();
    if (modalSection === "websites") {
      if (!existing) {
        values.id = makeId("site");
        values.createdAt = now;
        state.websites.unshift(values);
      } else {
        Object.keys(values).forEach(function (key) {
          existing[key] = values[key];
        });
      }
    } else if (modalSection === "images") {
      if (!existing) {
        values.id = makeId("image");
        values.createdAt = now;
        state.images.unshift(values);
      } else {
        Object.keys(values).forEach(function (key) {
          existing[key] = values[key];
        });
      }
    } else {
      if (!existing) {
        values.id = makeId("film");
        values.createdAt = now;
        state.films.unshift(values);
      } else {
        Object.keys(values).forEach(function (key) {
          existing[key] = values[key];
        });
      }
    }
    saveState();
    render();
    closeModal();
  }

  function exportData() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "website-box-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result));
        if (!parsed || !Array.isArray(parsed.websites) || !Array.isArray(parsed.images) || !Array.isArray(parsed.films)) {
          throw new Error("格式不正确");
        }
        if (!window.confirm("导入会覆盖当前收藏，确定继续吗？")) {
          return;
        }
        var now = new Date().toISOString();
        state = {
          version: 1,
          savedAt: now,
          websites: [],
          images: [],
          films: []
        };
        Object.keys(SECTIONS).forEach(function (section) {
          state[section] = (parsed[section] || []).map(function (item) {
            if (!item || typeof item !== "object") {
              return null;
            }
            item.id = item.id || makeId(section.slice(0, -1));
            item.createdAt = item.createdAt || now;
            item.tags = Array.isArray(item.tags) ? item.tags : [];
            item.starred = Boolean(item.starred);
            return item;
          }).filter(Boolean);
        });
        saveState();
        render();
      } catch (error) {
        window.alert("导入失败：文件不是有效的网站盒子备份。");
      }
    };
    reader.readAsText(file);
  }

  function loadSamples() {
    state = seedState();
    saveState();
    render();
  }

  function handleGridClick(event) {
    var target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }
    var card = target.closest("[data-id]");
    var section = activeSection;
    var id = card && card.dataset.id;
    var item = id ? findItem(section, id) : null;
    var action = target.dataset.action;
    if (!item) {
      return;
    }
    if (action === "star") {
      toggleStar(section, id);
    } else if (action === "edit") {
      openEditor(section, item);
    } else if (action === "delete") {
      deleteItem(section, id);
    } else if (action === "open") {
      if (section === "websites") {
        openUrl(item.url);
      } else if (section === "films") {
        openUrl(item.url);
      } else {
        openUrl(item.source, item.image);
      }
    } else if (action === "zoom") {
      openLightbox(item);
    }
  }

  function bindEvents() {
    dom.search.addEventListener("input", function () {
      setSearch(dom.search.value);
    });
    dom.searchClear.addEventListener("click", function () {
      dom.search.value = "";
      setSearch("");
    });

    document.querySelectorAll(".tab").forEach(function (button) {
      button.addEventListener("click", function () {
        activeSection = button.dataset.section;
        currentFilter = "all";
        currentQuery = "";
        dom.search.value = "";
        dom.searchClear.hidden = true;
        render();
      });
    });

    dom.addButton.addEventListener("click", function () {
      openEditor(activeSection, null);
    });
    dom.filterBar.addEventListener("click", function (event) {
      var chip = event.target.closest("[data-filter]");
      if (!chip) {
        return;
      }
      currentFilter = chip.dataset.filter;
      render();
    });
    dom.grid.addEventListener("click", handleGridClick);
    dom.grid.addEventListener("keydown", function (event) {
      if ((event.key === "Enter" || event.key === " ") && event.target.matches('[data-action="zoom"]')) {
        event.preventDefault();
        event.target.click();
      }
    });
    dom.grid.addEventListener("error", function (event) {
      var image = event.target;
      if (!image || image.tagName !== "IMG") {
        return;
      }
      var fallback = image.dataset.fallback;
      if (fallback && image.getAttribute("src") !== fallback) {
        image.src = fallback;
      } else {
        image.style.visibility = "hidden";
      }
    }, true);

    dom.importButton.addEventListener("click", function () {
      dom.importFile.value = "";
      dom.importFile.click();
    });
    dom.exportButton.addEventListener("click", exportData);
    dom.importFile.addEventListener("change", function () {
      if (dom.importFile.files && dom.importFile.files[0]) {
        importData(dom.importFile.files[0]);
      }
    });

    document.querySelectorAll("[data-close-modal]").forEach(function (button) {
      button.addEventListener("click", closeModal);
    });
    dom.modal.addEventListener("click", function (event) {
      if (event.target === dom.modal) {
        closeModal();
      }
    });
    dom.form.addEventListener("submit", function (event) {
      event.preventDefault();
      saveEditor();
    });

    document.querySelector("[data-close-lightbox]").addEventListener("click", closeLightbox);
    dom.lightbox.addEventListener("click", function (event) {
      if (event.target === dom.lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (!dom.lightbox.hidden) {
          closeLightbox();
        } else if (!dom.modal.hidden) {
          closeModal();
        }
      }
    });
  }

  function init() {
    storageAvailable = probeStorage();
    if (storageAvailable) {
      var stored;
      try {
        stored = window.localStorage.getItem(STORAGE_KEY);
      } catch (error) {
        stored = null;
      }
      if (!stored) {
        state = seedState();
        saveState();
      } else {
        state = loadState();
        if (state._needsPersist) {
          state._needsPersist = false;
          saveState();
        }
      }
    } else {
      state = seedState();
    }
    bindEvents();
    render();
  }

  init();
})();
