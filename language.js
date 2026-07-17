(function () {
  const translations = {
    zh: {
      meta: {
        homeDescription: "Apollo 的个人航拍影像网站，展示城市、海岸与山野视角。",
        gateDescription: "Apollo 航拍影像网站访问入口。",
        goldenDescription: "Apollo 航拍作品 Golden Coast。",
        cityDescription: "Apollo 航拍作品 City Lines。",
        mountainDescription: "Apollo 航拍作品 Mountain Wind。",
        switzerlandDescription: "Apollo 航拍作品 瑞士·稻田。"
      },
      nav: {
        label: "主导航",
        homeLabel: "Apollo 主页",
        works: "作品",
        about: "关于",
        contact: "联系",
        admin: "我是管理者"
      },
      language: {
        switchLabel: "语言切换"
      },
      gate: {
        eyebrow: "Private Portfolio",
        title: "Apollo 航拍大厅",
        text: "请输入访问密码，进入作品大厅和视频页面。",
        passwordLabel: "访问密码",
        error: "密码不正确，请再试一次。",
        enter: "进入大厅"
      },
      home: {
        heroEyebrow: "Aerial Video Portfolio",
        heroTitle: "用航拍记录城市、海岸和山野的呼吸。",
        heroText: "我是 Apollo，喜欢从高空寻找日常场景里安静、开阔的一面。这里会收集我的航拍视频、照片和每一次飞行背后的观察。",
        viewWorks: "查看作品",
        aboutApollo: "了解 Apollo",
        heroVisualLabel: "航拍影像预览",
        latestFlight: "Latest Flight",
        aboutEyebrow: "About",
        aboutTitle: "Apollo 的影像笔记",
        aboutText: "我关注光线、地形、建筑与人的活动痕迹。航拍对我来说不是炫技，而是一种换个高度理解世界的方式。这个网站先作为作品集框架，后续可以继续加入真实视频、拍摄参数、地点故事和项目合作信息。",
        worksEyebrow: "Selected Works",
        worksTitle: "航拍作品",
        worksText: "每个作品都有独立页面，适合放视频、照片组、拍摄地点和简短说明。",
        mapEyebrow: "Explore by Region",
        mapTitle: "按地区查看航拍作品",
        mapText: "点击地图上的洲或地区标记，先查看该地区的作品列表，再进入具体视频。",
        mapLabel: "世界地图作品入口",
        regionListsLabel: "地区作品列表",
        mapEastAsia: "亚洲",
        mapNorthAmerica: "北美",
        mapEurope: "欧洲",
        regionAsiaEyebrow: "Asia",
        regionAsiaTitle: "亚洲作品",
        regionNorthAmericaEyebrow: "North America",
        regionNorthAmericaTitle: "北美作品",
        regionEuropeEyebrow: "Europe",
        regionEuropeTitle: "欧洲作品",
        switzerlandMeta: "瑞士 / 稻田",
        switzerlandTitle: "瑞士·稻田",
        goldenLabel: "查看 Golden Coast 作品页",
        goldenMeta: "海岸 / 日落",
        goldenText: "低速掠过海岸线，记录城市边缘与潮水的距离。",
        cityLabel: "查看 City Lines 作品页",
        cityMeta: "城市 / 几何",
        cityText: "从高空看道路、楼群与光影交错形成的秩序。",
        mountainLabel: "查看 Mountain Wind 作品页",
        mountainMeta: "山野 / 清晨",
        mountainText: "沿山脊飞行，捕捉晨雾和风穿过地形的层次。",
        contactEyebrow: "Contact",
        contactTitle: "一起看更高一点的世界"
      },
      work: {
        eyebrow: "Aerial Work",
        coast: "海岸",
        sunset: "日落",
        city: "城市",
        geometry: "几何",
        mountain: "山野",
        morning: "清晨",
        back: "返回作品",
        contact: "联系 Apollo",
        location: "地点",
        gear: "设备",
        status: "状态",
        statusValue: "示例作品页",
        goldenPlaceholder: "把真实视频放到 assets/videos/golden-coast.mp4 后，可在这里替换为 video 标签。",
        goldenStory1: "这一页用于展示单个航拍作品。你可以放入一段主视频、几张静帧、拍摄参数、飞行路线，以及这次拍摄想表达的情绪。",
        goldenStory2: "当前内容是占位文案，后续替换成你的真实素材和故事即可。",
        cityPlaceholder: "把真实视频放到 assets/videos/city-lines.mp4 后，可在这里替换为 video 标签。",
        cityStory1: "这一页适合放城市航拍：俯视道路、桥梁、楼群和光影。简约布局会把注意力留给视频本身。",
        cityStory2: "后续可以扩展为照片组、视频嵌入、地图位置或拍摄日志。",
        mountainPlaceholder: "把真实视频放到 assets/videos/mountain-wind.mp4 后，可在这里替换为 video 标签。",
        mountainStory1: "这一页用于山野航拍作品。可以记录晨雾、山脊、风向、飞行高度，以及画面从低处到开阔视野的变化。",
        mountainStory2: "真实内容就位后，页面会更像一篇简短的影像手记。",
        switzerlandTitle: "瑞士·稻田",
        switzerlandCountry: "瑞士",
        field: "稻田",
        europe: "欧洲",
        backRegion: "返回欧洲列表",
        realVideo: "真实视频",
        switzerlandStory1: "这段视频拍摄于瑞士，记录稻田与地形在高空视角下形成的纹理。",
        switzerlandStory2: "后续可以继续补充具体地点、拍摄时间、飞行路线和设备参数。"
      },
      footer: {
        tagline: "Aerial video portfolio"
      }
    },
    en: {
      meta: {
        homeDescription: "Apollo's personal aerial video portfolio, featuring city, coast, and mountain perspectives.",
        gateDescription: "Private access entrance for Apollo's aerial video portfolio.",
        goldenDescription: "Apollo aerial work: Golden Coast.",
        cityDescription: "Apollo aerial work: City Lines.",
        mountainDescription: "Apollo aerial work: Mountain Wind.",
        switzerlandDescription: "Apollo aerial work: Switzerland's Field."
      },
      nav: {
        label: "Main navigation",
        homeLabel: "Apollo home",
        works: "Works",
        about: "About",
        contact: "Contact",
        admin: "Manager"
      },
      language: {
        switchLabel: "Language switch"
      },
      gate: {
        eyebrow: "Private Portfolio",
        title: "Apollo Aerial Hall",
        text: "Enter the access password to open the hall and video pages.",
        passwordLabel: "Access Password",
        error: "Incorrect password. Please try again.",
        enter: "Enter Hall"
      },
      home: {
        heroEyebrow: "Aerial Video Portfolio",
        heroTitle: "Aerial stories of cities, coastlines, and quiet mountain air.",
        heroText: "I am Apollo. I use drone footage to look for the calm, open side of everyday places. This site collects my aerial videos, photos, and notes from each flight.",
        viewWorks: "View Works",
        aboutApollo: "About Apollo",
        heroVisualLabel: "Aerial video preview",
        latestFlight: "Latest Flight",
        aboutEyebrow: "About",
        aboutTitle: "Apollo's Visual Notes",
        aboutText: "I pay attention to light, terrain, architecture, and the traces of human activity. For me, aerial filming is not about showing off altitude. It is a way to understand the world from another height. This site starts as a portfolio framework and can later grow with real videos, shooting details, location stories, and collaboration information.",
        worksEyebrow: "Selected Works",
        worksTitle: "Aerial Works",
        worksText: "Each work has its own page for video, photo sets, shooting locations, and short notes.",
        mapEyebrow: "Explore by Region",
        mapTitle: "Browse Aerial Works by Region",
        mapText: "Click a continent or region marker on the map, browse that region's list, then open a specific video.",
        mapLabel: "World map entry points for aerial works",
        regionListsLabel: "Regional work lists",
        mapEastAsia: "Asia",
        mapNorthAmerica: "North America",
        mapEurope: "Europe",
        regionAsiaEyebrow: "Asia",
        regionAsiaTitle: "Asia Works",
        regionNorthAmericaEyebrow: "North America",
        regionNorthAmericaTitle: "North America Works",
        regionEuropeEyebrow: "Europe",
        regionEuropeTitle: "Europe Works",
        switzerlandMeta: "Switzerland / Field",
        switzerlandTitle: "Switzerland's Field",
        goldenLabel: "Open Golden Coast work page",
        goldenMeta: "Coast / Sunset",
        goldenText: "A slow pass along the shoreline, tracing the distance between the city edge and the tide.",
        cityLabel: "Open City Lines work page",
        cityMeta: "City / Geometry",
        cityText: "Roads, towers, and shadows form a quiet order from above.",
        mountainLabel: "Open Mountain Wind work page",
        mountainMeta: "Mountain / Morning",
        mountainText: "Flying along the ridge to capture morning mist and the shape of wind across terrain.",
        contactEyebrow: "Contact",
        contactTitle: "Let's look at the world from a little higher up"
      },
      work: {
        eyebrow: "Aerial Work",
        coast: "Coast",
        sunset: "Sunset",
        city: "City",
        geometry: "Geometry",
        mountain: "Mountain",
        morning: "Morning",
        back: "Back to Works",
        contact: "Contact Apollo",
        location: "Location",
        gear: "Gear",
        status: "Status",
        statusValue: "Sample work page",
        goldenPlaceholder: "Place the real video at assets/videos/golden-coast.mp4, then replace this area with a video tag.",
        goldenStory1: "This page is for a single aerial work. You can add a main video, still frames, shooting settings, flight route, and the mood behind the flight.",
        goldenStory2: "The current copy is placeholder text. Replace it later with your real footage and story.",
        cityPlaceholder: "Place the real video at assets/videos/city-lines.mp4, then replace this area with a video tag.",
        cityStory1: "This page is suited for city aerial footage: roads, bridges, buildings, and moving light from above. The minimal layout keeps attention on the video itself.",
        cityStory2: "Later it can expand with photo sets, embedded video, map location, or flight notes.",
        mountainPlaceholder: "Place the real video at assets/videos/mountain-wind.mp4, then replace this area with a video tag.",
        mountainStory1: "This page is for mountain aerial footage. It can record morning mist, ridgelines, wind direction, flight altitude, and the shift from lower details to open views.",
        mountainStory2: "Once real content is added, the page will feel more like a short visual journal.",
        switzerlandTitle: "Switzerland's Field",
        switzerlandCountry: "Switzerland",
        field: "Field",
        europe: "Europe",
        backRegion: "Back to Europe List",
        realVideo: "Real video",
        switzerlandStory1: "This video was filmed in Switzerland, capturing the texture of fields and terrain from above.",
        switzerlandStory2: "Later, this page can include the exact location, shooting time, flight route, and gear details."
      },
      footer: {
        tagline: "Aerial video portfolio"
      }
    }
  };

  const defaultLanguage = "zh";
  const storage = {
    get() {
      try {
        return window.localStorage.getItem("apolloLanguage");
      } catch (error) {
        return null;
      }
    },
    set(language) {
      try {
        window.localStorage.setItem("apolloLanguage", language);
      } catch (error) {
        return null;
      }
      return language;
    }
  };
  const savedLanguage = storage.get();
  const initialLanguage = savedLanguage && translations[savedLanguage] ? savedLanguage : defaultLanguage;

  function valueFor(key, language) {
    return key.split(".").reduce((current, part) => current && current[part], translations[language]);
  }

  function applyLanguage(language) {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = valueFor(element.dataset.i18n, language);
      if (value) element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      const value = valueFor(element.dataset.i18nAriaLabel, language);
      if (value) element.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-content]").forEach((element) => {
      const value = valueFor(element.dataset.i18nContent, language);
      if (value) element.setAttribute("content", value);
    });

    document.querySelectorAll("[data-lang-button]").forEach((button) => {
      const active = button.dataset.langButton === language;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    storage.set(language);
  }

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.langButton));
  });

  document.querySelectorAll("[data-map-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      const target = document.querySelector(toggle.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      target.classList.remove("is-hidden");
      toggle.setAttribute("aria-expanded", "true");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if (location.hash === "#region-map" || location.hash.indexOf("#region-") === 0) {
    const regionMap = document.querySelector("#region-map");
    const mapToggle = document.querySelector("[data-map-toggle]");
    const hashTarget = document.querySelector(location.hash);
    if (regionMap) regionMap.classList.remove("is-hidden");
    if (mapToggle) mapToggle.setAttribute("aria-expanded", "true");
    if (hashTarget) requestAnimationFrame(() => hashTarget.scrollIntoView({ block: "start" }));
  }

  applyLanguage(initialLanguage);
})();
