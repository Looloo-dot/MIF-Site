const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        sectionObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 200)}ms`;
  sectionObserver.observe(element);
});

const pageName = document.body.dataset.page;
document.querySelectorAll("[data-page-link]").forEach((link) => {
  link.classList.toggle("is-active", link.dataset.pageLink === pageName);
});

function renderTradingViewWidget(container, src, config) {
  if (!container || !config) {
    return;
  }

  let widgetRoot = container.querySelector(".tradingview-widget-container__widget");
  if (!widgetRoot) {
    widgetRoot = document.createElement("div");
    widgetRoot.className = "tradingview-widget-container__widget";
    container.prepend(widgetRoot);
  }

  widgetRoot.replaceChildren();
  container.querySelectorAll("script[data-tv-widget]").forEach((script) => script.remove());
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = src;
  script.dataset.tvWidget = "true";
  script.textContent = typeof config === "string" ? config : JSON.stringify(config);
  container.appendChild(script);
}

document.querySelectorAll(".ticker-tape-widget").forEach((container) => {
  const config = container.dataset.tickerTape;
  if (!config) {
    return;
  }

  renderTradingViewWidget(
    container,
    "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js",
    config
  );
});

function setupSectionNav() {
  const nav = document.querySelector("[data-section-nav]");
  if (!nav) {
    return;
  }

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        updateActive(visible.target.id);
      }
    },
    {
      rootMargin: "-22% 0px -62% 0px",
      threshold: [0.2, 0.4, 0.6],
    }
  );

  sections.forEach((section) => observer.observe(section));
  if (sections[0]) {
    updateActive(sections[0].id);
  }
}

setupSectionNav();

const sectorData = {
  healthcare: {
    name: "Healthcare",
    weight: "40%",
    label: "Largest sleeve",
    heading: "Healthcare is the largest proposed sleeve at 35-40%.",
    body:
      "The structure paper cites defensive earnings, lower relative valuations, and recent earnings resilience.",
    pills: ["35-40%", "Defensive earnings", "Lower relative valuations"],
  },
  tmt: {
    name: "TMT",
    weight: "35%",
    label: "Growth sleeve",
    heading: "TMT sits at roughly 35%.",
    body:
      "The sleeve remains conviction-led and is sourced from the existing TMT research team.",
    pills: ["~35%", "Growth exposure", "Research-driven"],
  },
  fig: {
    name: "FIG",
    weight: "25%",
    label: "Value sleeve",
    heading: "FIG sits at roughly 25%.",
    body:
      "FIG provides balance-sheet and valuation exposure through the fund's financial institutions coverage.",
    pills: ["~25%", "Balance-sheet focus", "Valuation exposure"],
  },
};

const frameworkData = {
  portfolio: {
    image: "assets/framework-portfolio.svg",
    alt: "Portfolio structure visual",
    label: "Portfolio",
    title: "Concentrated long-only structure across three sectors.",
    body:
      "Current scope is limited to TMT, FIG, and Healthcare, with review by portfolio managers and execution in IBKR Paper Trading.",
  },
  governance: {
    image: "assets/framework-governance.svg",
    alt: "Governance structure visual",
    label: "Governance",
    title: "Research, portfolio review, and President sign-off.",
    body:
      "Sector teams pitch. Portfolio managers assess fit and concentration. The President approves major changes.",
  },
  execution: {
    image: "assets/framework-execution.svg",
    alt: "Execution setup visual",
    label: "Execution",
    title: "IBKR Paper Trading as the execution environment.",
    body:
      "Account value, positions, order entry, and trade history are monitored in simulation.",
  },
};

const frameworkTabs = document.querySelectorAll("[data-framework-tab]");
const frameworkImage = document.querySelector("#framework-image");
const frameworkLabel = document.querySelector("#framework-label");
const frameworkTitle = document.querySelector("#framework-title");
const frameworkBody = document.querySelector("#framework-body");

function renderFramework(tabName) {
  const data = frameworkData[tabName];
  if (!frameworkImage) {
    return;
  }

  frameworkImage.src = data.image;
  frameworkImage.alt = data.alt;
  if (frameworkLabel) {
    frameworkLabel.textContent = data.label;
  }
  if (frameworkTitle) {
    frameworkTitle.textContent = data.title;
  }
  if (frameworkBody) {
    frameworkBody.textContent = data.body;
  }

  frameworkTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.frameworkTab === tabName);
  });
}

frameworkTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    renderFramework(tab.dataset.frameworkTab);
  });
});

if (frameworkTabs.length > 0) {
  renderFramework("portfolio");
}

function updateExplorer(prefix, sector) {
  const data = sectorData[sector];
  const weight = document.querySelector(`#${prefix}-sector-weight`);
  const name = document.querySelector(`#${prefix}-sector-name`);
  const label = document.querySelector(`#${prefix}-sector-label`);
  const heading = document.querySelector(`#${prefix}-sector-heading`);
  const body = document.querySelector(`#${prefix}-sector-body`);
  const pills = document.querySelector(`#${prefix}-sector-pills`);

  if (weight) {
    weight.textContent = data.weight;
  }
  if (name) {
    name.textContent = data.name;
  }
  if (label) {
    label.textContent = data.label;
  }
  if (heading) {
    heading.textContent = data.heading;
  }
  if (body) {
    body.textContent = data.body;
  }
  if (pills) {
    pills.innerHTML = data.pills.map((pill) => `<span>${pill}</span>`).join("");
  }
}

const homeExplorerTabs = document.querySelectorAll("[data-explorer-tab]");
const homeExplorerDisplay = document.querySelector("#home-explorer-display");
homeExplorerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    homeExplorerTabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    if (homeExplorerDisplay) {
      homeExplorerDisplay.dataset.activeSector = tab.dataset.explorerTab;
    }
    updateExplorer("home", tab.dataset.explorerTab);
  });
});

if (homeExplorerTabs.length > 0) {
  if (homeExplorerDisplay) {
    homeExplorerDisplay.dataset.activeSector = "healthcare";
  }
  updateExplorer("home", "healthcare");
}

const portfolioSectorButtons = document.querySelectorAll("[data-portfolio-sector]");
const portfolioAllocationCard = document.querySelector("#portfolio-allocation-card");

portfolioSectorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sector = button.dataset.portfolioSector;
    portfolioSectorButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    portfolioSectorButtons.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    if (portfolioAllocationCard) {
      portfolioAllocationCard.dataset.activeSector = sector;
    }
    updateExplorer("portfolio", sector);
    if (scenarioButtons.length > 0) {
      renderScenario(constructionState.totalPositions, sector);
    }
  });
});

if (portfolioSectorButtons.length > 0) {
  if (portfolioAllocationCard) {
    portfolioAllocationCard.dataset.activeSector = "healthcare";
  }
  portfolioSectorButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.portfolioSector === "healthcare"));
  });
  updateExplorer("portfolio", "healthcare");
}

const sectorWeights = {
  healthcare: 40,
  tmt: 35,
  fig: 25,
};

const sectorShortLabels = {
  healthcare: "HC",
  tmt: "TMT",
  fig: "FIG",
};

const scenarioButtons = document.querySelectorAll("[data-scenario-count]");
const constructionFocusButtons = document.querySelectorAll("[data-construction-focus]");
const positionGrid = document.querySelector("#position-grid");
const constructionTitle = document.querySelector("#construction-title");
const constructionFocusLabel = document.querySelector("#construction-focus-label");
const constructionBody = document.querySelector("#construction-body");
const constructionStatGrid = document.querySelector("#construction-stat-grid");
const constructionPills = document.querySelector("#construction-pills");
const constructionState = {
  totalPositions: 10,
  focus: "all",
};

function formatPct(value) {
  return Number.isInteger(value) ? `${value.toFixed(0)}%` : `${value.toFixed(1)}%`;
}

function allocateScenarioCounts(total) {
  const sectors = Object.entries(sectorWeights).map(([sector, weight]) => ({
    sector,
    raw: (weight / 100) * total,
  }));
  const counts = Object.fromEntries(
    sectors.map(({ sector, raw }) => [sector, Math.floor(raw)])
  );

  let assigned = Object.values(counts).reduce((sum, value) => sum + value, 0);
  sectors
    .map(({ sector, raw }) => ({
      sector,
      remainder: raw - Math.floor(raw),
    }))
    .sort((a, b) => b.remainder - a.remainder)
    .forEach(({ sector }) => {
      if (assigned < total) {
        counts[sector] += 1;
        assigned += 1;
      }
    });

  return counts;
}

function buildScenario(totalPositions) {
  const counts = allocateScenarioCounts(totalPositions);
  const average = 100 / totalPositions;
  const slots = [];

  Object.entries(counts).forEach(([sector, count]) => {
    const perSlotWeight = sectorWeights[sector] / count;

    for (let index = 0; index < count; index += 1) {
      slots.push({
        sector,
        label: `${sectorShortLabels[sector]} ${index + 1}`,
        weight: perSlotWeight,
      });
    }
  });

  while (slots.length < 12) {
    slots.push({
      sector: "empty",
      label: "Open",
      weight: 0,
    });
  }

  let reading = "Inside target band";
  if (average > 12) {
    reading = "Above target band";
  } else if (average < 5) {
    reading = "Below target band";
  }

  const body =
    totalPositions === 8
      ? "At eight positions, the working 40/35/25 split implies roughly three Healthcare, three TMT, and two FIG names. A fully invested book averages 12.5% per line, which pushes concentration above the formal target band and close to the 15% ceiling."
      : totalPositions === 10
        ? "At 10 positions, the working 40/35/25 split maps to roughly four Healthcare, three TMT, and three FIG names. Average fully invested line weight sits at 10.0%, inside the stated 5-12% target band."
        : "At 12 positions, the same sector mix maps to roughly five Healthcare, four TMT, and three FIG names. Average fully invested line weight falls to 8.3%, leaving the widest room inside the target band.";

  return {
    totalPositions,
    counts,
    average,
    reading,
    body,
    slots,
  };
}

function getConstructionView(scenario, focus) {
  if (focus === "all") {
    return {
      label: "Portfolio view",
      body: scenario.body,
      stats: [
        { label: "Average line", value: formatPct(scenario.average) },
        {
          label: "Sector slots",
          value: `${scenario.counts.healthcare} / ${scenario.counts.tmt} / ${scenario.counts.fig}`,
        },
        { label: "Constraint read", value: scenario.reading },
      ],
      pills: [
        `${scenario.counts.healthcare} Healthcare`,
        `${scenario.counts.tmt} TMT`,
        `${scenario.counts.fig} FIG`,
      ],
    };
  }

  const sleeveWeight = sectorWeights[focus];
  const slotCount = scenario.counts[focus];
  const evenLine = sleeveWeight / slotCount;
  const sectorName = sectorData[focus].name;
  const focusBody = {
    healthcare:
      "The report frames Healthcare as the largest sleeve because of its defensive profile, lower relative valuations, and recent earnings resilience.",
    tmt:
      "TMT remains the main growth sleeve and is intended to stay conviction-led rather than benchmark-like.",
    fig:
      "FIG broadens the book through balance-sheet and value exposure tied to financial businesses.",
  };

  return {
    label: `${sectorName} sleeve`,
    body:
      `${sectorName} occupies ${slotCount} of ${scenario.totalPositions} positions in this illustrative case. ` +
      `At the current ${sleeveWeight}% sleeve weight, an even distribution implies roughly ${formatPct(evenLine)} per line. ` +
      focusBody[focus],
    stats: [
      { label: "Sleeve weight", value: `${sleeveWeight}%` },
      { label: "Illustrative slots", value: String(slotCount) },
      { label: "Even line", value: formatPct(evenLine) },
    ],
    pills: [
      `${slotCount} of ${scenario.totalPositions} slots`,
      `${sleeveWeight}% sleeve`,
      `${formatPct(evenLine)} even line`,
    ],
  };
}

function renderScenario(totalPositions = constructionState.totalPositions, focus = constructionState.focus) {
  constructionState.totalPositions = totalPositions;
  constructionState.focus = focus;

  const scenario = buildScenario(totalPositions);
  const view = getConstructionView(scenario, focus);
  if (!positionGrid) {
    return;
  }

  constructionTitle.textContent = `${totalPositions}-position working view`;
  if (constructionFocusLabel) {
    constructionFocusLabel.textContent = view.label;
  }
  constructionBody.textContent = view.body;
  constructionStatGrid.innerHTML = view.stats
    .map(
      (stat) => `
        <article class="construction-stat">
          <span>${stat.label}</span>
          <strong>${stat.value}</strong>
        </article>
      `
    )
    .join("");

  constructionPills.innerHTML = view.pills.map((pill) => `<span>${pill}</span>`).join("");

  positionGrid.innerHTML = scenario.slots
    .map((slot) => {
      const isEmpty = slot.sector === "empty";
      const height = isEmpty ? "16%" : `${Math.min((slot.weight / 15) * 100, 100).toFixed(1)}%`;
      const value = isEmpty ? "Open" : formatPct(slot.weight);
      const isDimmed = focus !== "all" && slot.sector !== focus;
      const isEmphasis = focus !== "all" && slot.sector === focus;
      const baseClassName = isEmpty ? "position-slot position-slot-empty" : `position-slot position-slot-${slot.sector}`;
      const className = `${baseClassName}${isDimmed ? " is-dimmed" : ""}${isEmphasis ? " is-emphasis" : ""}`;
      return `
        <article class="${className}" aria-label="${slot.label} ${value}">
          <span class="position-slot-value">${value}</span>
          <div class="position-slot-fill" style="--slot-height:${height}"></div>
          <span class="position-slot-label">${slot.label}</span>
        </article>
      `;
    })
    .join("");

  scenarioButtons.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.scenarioCount) === totalPositions);
    button.setAttribute("aria-selected", String(Number(button.dataset.scenarioCount) === totalPositions));
  });

  constructionFocusButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.constructionFocus === focus);
    button.setAttribute("aria-selected", String(button.dataset.constructionFocus === focus));
  });
}

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderScenario(Number(button.dataset.scenarioCount), constructionState.focus);
  });
});

constructionFocusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderScenario(constructionState.totalPositions, button.dataset.constructionFocus);
  });
});

if (scenarioButtons.length > 0) {
  renderScenario(10, "all");
}

document.querySelectorAll("[data-accordion-group]").forEach((group) => {
  const items = [...group.querySelectorAll(".accordion-item")];

  items.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      items.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
        other.querySelector(".accordion-panel").hidden = true;
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });
  });
});

const executionViews = [
  {
    image: "assets/image7.png",
    alt: "IBKR account value screen",
    label: "IBKR Paper Trading",
    title: "Account value and performance view",
    body:
      "The value screen is where the fund can monitor market value, weekly movement, and overall account status while remaining in simulation mode.",
    meta: [
      { label: "Primary use", value: "Account value" },
      { label: "Focus", value: "Portfolio status" },
      { label: "Control", value: "Weekly monitoring" },
    ],
  },
  {
    image: "assets/image4.png",
    alt: "IBKR portfolio screen",
    label: "Portfolio",
    title: "Positions, balances, and available cash",
    body:
      "The portfolio view is where the live shape of the book can be checked before any change is made.",
    meta: [
      { label: "Primary use", value: "Positions and cash" },
      { label: "Focus", value: "Exposure review" },
      { label: "Control", value: "Pre-trade check" },
    ],
  },
  {
    image: "assets/image5.png",
    alt: "IBKR trade screen",
    label: "Trade entry",
    title: "Trade tools and order preparation",
    body:
      "The trade screen translates approved ideas into executable activity and gives the team a defined place to prepare orders.",
    meta: [
      { label: "Primary use", value: "Trade ticket" },
      { label: "Focus", value: "Order entry" },
      { label: "Control", value: "Execution prep" },
    ],
  },
  {
    image: "assets/image6.png",
    alt: "IBKR orders screen",
    label: "Orders & trades",
    title: "Audit trail and execution review",
    body:
      "The orders and trades view supports process accountability by showing what has been done and when.",
    meta: [
      { label: "Primary use", value: "Trade history" },
      { label: "Focus", value: "Audit trail" },
      { label: "Control", value: "Post-trade review" },
    ],
  },
];

let executionIndex = 0;
const executionImage = document.querySelector("#execution-image");
const executionLabel = document.querySelector("#execution-label");
const executionTitle = document.querySelector("#execution-title");
const executionBody = document.querySelector("#execution-body");
const executionMeta = document.querySelector("#execution-meta");
const executionThumbs = document.querySelectorAll("[data-execution-index]");

function renderExecutionView(index) {
  const view = executionViews[index];
  if (!executionImage) {
    return;
  }

  executionImage.src = view.image;
  executionImage.alt = view.alt;
  executionLabel.textContent = view.label;
  executionTitle.textContent = view.title;
  executionBody.textContent = view.body;
  if (executionMeta) {
    executionMeta.innerHTML = view.meta
      .map(
        (item) => `
          <article class="execution-meta-card">
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </article>
        `
      )
      .join("");
  }

  executionThumbs.forEach((thumb) => {
    thumb.classList.toggle("is-active", Number(thumb.dataset.executionIndex) === index);
    thumb.setAttribute("aria-pressed", String(Number(thumb.dataset.executionIndex) === index));
  });
}

executionThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    executionIndex = Number(thumb.dataset.executionIndex);
    renderExecutionView(executionIndex);
  });
});

document.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
  executionIndex = (executionIndex - 1 + executionViews.length) % executionViews.length;
  renderExecutionView(executionIndex);
});

document.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
  executionIndex = (executionIndex + 1) % executionViews.length;
  renderExecutionView(executionIndex);
});

if (executionImage) {
  renderExecutionView(executionIndex);
}

function renderSymbolOverview(container, config) {
  renderTradingViewWidget(
    container,
    "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js",
    config
  );
}

const marketRangeData = {
  "5d": {
    title: "Five-day sector tape",
    body:
      "Tracks SPY together with XLV, XLK, and XLF across the last five trading sessions, giving a short-term read on the market backdrop around the current sector mix.",
    dateRanges: ["1d|5"],
  },
  "1m": {
    title: "One-month sector tape",
    body:
      "Extends the lens to one month, making it easier to compare short-term rotation between Healthcare, Technology, and Financials against the broader market.",
    dateRanges: ["1m|30"],
  },
  "3m": {
    title: "Three-month sector tape",
    body:
      "A three-month view helps frame the current sector mix against a broader swing in market leadership and relative performance.",
    dateRanges: ["3m|60"],
  },
};

const marketRangeButtons = document.querySelectorAll("[data-market-range]");
const marketSymbolButtons = document.querySelectorAll("[data-market-symbol]");
const marketLensTitle = document.querySelector("#market-lens-title");
const marketLensBody = document.querySelector("#market-lens-body");
const marketFocusTitle = document.querySelector("#market-focus-title");
const marketFocusBody = document.querySelector("#market-focus-body");
const portfolioMarketWidget = document.querySelector("#portfolio-market-widget");
const marketSymbolData = {
  spy: {
    label: "S&P 500",
    ticker: "SPY",
    symbol: "AMEX:SPY|1D",
    body:
      "SPY stays in the comparison set as the broad-market anchor for judging relative sector movement.",
    colors: {
      lineColor: "rgba(111, 146, 214, 1)",
      topColor: "rgba(111, 146, 214, 0.22)",
      bottomColor: "rgba(111, 146, 214, 0.04)",
    },
  },
  xlv: {
    label: "Healthcare",
    ticker: "XLV",
    symbol: "AMEX:XLV|1D",
    body:
      "XLV is the closest liquid proxy for the largest sleeve in the current December 2025 portfolio model.",
    colors: {
      lineColor: "rgba(203, 176, 128, 1)",
      topColor: "rgba(203, 176, 128, 0.22)",
      bottomColor: "rgba(203, 176, 128, 0.04)",
    },
  },
  xlk: {
    label: "Technology",
    ticker: "XLK",
    symbol: "AMEX:XLK|1D",
    body:
      "XLK provides the clearest listed benchmark for the fund's TMT sleeve and its growth-driven exposure.",
    colors: {
      lineColor: "rgba(106, 145, 217, 1)",
      topColor: "rgba(106, 145, 217, 0.22)",
      bottomColor: "rgba(106, 145, 217, 0.04)",
    },
  },
  xlf: {
    label: "Financials",
    ticker: "XLF",
    symbol: "AMEX:XLF|1D",
    body:
      "XLF acts as the closest market proxy for the FIG sleeve and its balance-sheet-driven exposure.",
    colors: {
      lineColor: "rgba(141, 118, 80, 1)",
      topColor: "rgba(141, 118, 80, 0.22)",
      bottomColor: "rgba(141, 118, 80, 0.04)",
    },
  },
};
const marketState = {
  range: "5d",
  symbol: "spy",
};

function getOrderedMarketSymbols(selectedKey) {
  return [selectedKey, ...Object.keys(marketSymbolData).filter((key) => key !== selectedKey)].map((key) => [
    marketSymbolData[key].label,
    marketSymbolData[key].symbol,
  ]);
}

function renderPortfolioMarket(rangeKey = marketState.range, symbolKey = marketState.symbol) {
  const data = marketRangeData[rangeKey];
  const symbol = marketSymbolData[symbolKey];
  if (!portfolioMarketWidget || !data || !symbol) {
    return;
  }

  marketState.range = rangeKey;
  marketState.symbol = symbolKey;

  const baseConfig = JSON.parse(portfolioMarketWidget.dataset.symbolOverview);
  baseConfig.dateRanges = data.dateRanges;
  baseConfig.symbols = getOrderedMarketSymbols(symbolKey);
  baseConfig.lineColor = symbol.colors.lineColor;
  baseConfig.topColor = symbol.colors.topColor;
  baseConfig.bottomColor = symbol.colors.bottomColor;
  marketLensTitle.textContent = data.title;
  marketLensBody.textContent = data.body;
  if (marketFocusTitle) {
    marketFocusTitle.textContent = symbol.ticker;
  }
  if (marketFocusBody) {
    marketFocusBody.textContent = symbol.body;
  }
  renderSymbolOverview(portfolioMarketWidget, baseConfig);

  marketRangeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.marketRange === rangeKey);
    button.setAttribute("aria-selected", String(button.dataset.marketRange === rangeKey));
  });

  marketSymbolButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.marketSymbol === symbolKey);
    button.setAttribute("aria-pressed", String(button.dataset.marketSymbol === symbolKey));
  });
}

marketRangeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderPortfolioMarket(button.dataset.marketRange, marketState.symbol);
  });
});

marketSymbolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderPortfolioMarket(marketState.range, button.dataset.marketSymbol);
  });
});

document.querySelectorAll(".symbol-overview-widget").forEach((container) => {
  const config = container.dataset.symbolOverview;
  if (!config) {
    return;
  }

  if (container.id === "portfolio-market-widget" && marketRangeButtons.length > 0) {
    return;
  }

  renderSymbolOverview(container, config);
});

if (portfolioMarketWidget && marketRangeButtons.length > 0) {
  renderPortfolioMarket("5d", "spy");
}
