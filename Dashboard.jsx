
import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BarChart2, Table as TableIcon, Brain } from 'lucide-react';

import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import PortfolioInput from '../components/dashboard/PortfolioInput';
import FilterBar from '../components/filters/FilterBar';
import EventTimerBar from '../components/events/EventTimerBar';
import NewsDigestContainer from '../components/news/NewsDigestContainer';
import ScenarioGrid from '../components/grid/ScenarioGrid';
import HeatmapTab from '../components/rhs/HeatmapTab';
import EtfBasketTab from '../components/rhs/EtfBasketTab';
import PerformanceSearch from '../components/performance/PerformanceSearch';
import AIAdvisor from '../components/rhs/AIAdvisor';
import VarPanel from '../components/risk/VarPanel';

// --- MOCK DATA ---
const MOCK_DATA = {
  sectorColors: {
    "Geopolitics": "#FF6B6B",
    "Rates": "#FFD166", 
    "Energy": "#EF476F",
    "TechAI": "#118AB2",
    "Healthcare": "#9D4EDD",
    "Consumer": "#06D6A0",
    "Crypto": "#FFA600",
    "Misc": "#8D99AE",
    "Financials": "#FFD166",
    "Industrials": "#8D99AE",
    "Materials": "#FF6B35"
  },
  scenarios: [
    {"id":"FedCutSept","title":"Fed cuts 25bp September","modelProb":55,"beta":{"Rates":2,"Banks":1,"REITs":2},"rationale":"Cooling inflation may prompt the Fed to act sooner.","tags":{"sector":"Financials", "geo":"US"}},
    {"id":"OilSpike120","title":"Oil breaches $120/barrel","modelProb":20,"beta":{"Energy":2,"Airlines":-2},"rationale":"Middle East escalation could disrupt supply chains.","tags":{"sector":"Energy", "geo":"Global"}},
    {"id":"AIChipBoom","title":"AI chip demand surges 50%","modelProb":50,"beta":{"TechAI":2,"Semis":2},"rationale":"Unrelenting demand for AI training continues.","tags":{"sector":"TechAI", "geo":"Global", "company":"NVDA"}},
    {"id":"IsraelIranConflict","title":"Israel-Iran direct conflict","modelProb":30,"beta":{"Geopolitics":2,"Defense":2,"Energy":1},"rationale":"Direct military conflict would have global repercussions.","tags":{"sector":"Energy", "geo":"Global"}},
    {"id":"BiotechM&A","title":"Major biotech M&A wave","modelProb":40,"beta":{"Healthcare":2,"Biotech":2},"rationale":"Large pharma uses cash reserves for acquisitions.","tags":{"sector":"Healthcare", "geo":"US"}},
    {"id":"USDWeak","title":"Dollar weakens 10% vs basket","modelProb":35,"beta":{"EmergMkts":2,"Gold":1},"rationale":"Dovish Fed pivot and strengthening economies abroad.","tags":{"sector":"Financials", "geo":"Global"}},
    {"id":"HousingPermits+15","title":"Housing permits jump 15%","modelProb":45,"beta":{"Homebuilders":2,"REITs":1},"rationale":"Drop in mortgage rates could unleash pent-up demand.","tags":{"sector":"Industrials", "geo":"US"}},
    {"id":"TariffAuto10","title":"US imposes 10% auto tariffs","modelProb":40,"beta":{"Autos":-2,"Semis":-1},"rationale":"Renewed trade tensions could target the auto sector.","tags":{"sector":"Industrials", "geo":"US"}},
    {"id":"GDP3pc","title":"US GDP exceeds 3% in 2025","modelProb":45,"beta":{"SmallCaps":2,"Consumer":1},"rationale":"AI-driven productivity gains could lead to strong growth.","tags":{"sector":"Consumer", "geo":"US"}},
    {"id":"CryptoRegEase","title":"US crypto regulations soften","modelProb":30,"beta":{"Crypto":2,"Banks":-1},"rationale":"Bipartisan legislation could provide regulatory clarity.","tags":{"sector":"Financials", "geo":"US"}},
    // Binary Scenarios
    {"id":"BigTechAntitrust","modelProb":25,"title":"Big Tech faces antitrust breakup","beta":{"TechAI":-2,"Semis":1},"rationale":"Increased DOJ scrutiny could lead to landmark case.","isBinary":true,"tags":{"sector":"TechAI", "geo":"US", "company":"AAPL"}},
    {"id":"ChinaStimulus","modelProb":35,"title":"China launches massive stimulus","beta":{"EmergMkts":2,"Energy":1},"rationale":"Stimulus to combat economic slowdown, boosting commodity demand.","isBinary":true,"tags":{"sector":"Materials", "geo":"Global"}},
    {"id":"USElectionDem","modelProb":50,"title":"Democrats win US Presidency","beta":{"Healthcare":1,"CleanEnergy":2,"Defense":-1},"rationale":"A Democratic admin could prioritize green energy/healthcare.","isBinary":true,"tags":{"sector":"Energy", "geo":"US"}},
    {"id":"HardLanding","modelProb":30,"title":"US economy faces hard landing","beta":{"SmallCaps":-2,"Consumer":-2,"Staples":1},"rationale":"Aggressive Fed policy could tip economy into recession.","isBinary":true,"tags":{"sector":"Financials", "geo":"US"}}
  ],
  sectorToETF: {
    "Rates":["IEF"],"Banks":["KBE"],"REITs":["VNQ"],"Energy":["XLE"],"Semis":["SOXX"],"Defense":["ITA"],"Biotech":["XBI"],"Homebuilders":["XHB"],"SmallCaps":["IWM"],"Consumer":["XLY"],"Gold":["GDX"],"EmergMkts":["EEM"],"Crypto":["BITX"],"Autos":["CARZ"],"TechAI":["QQQ"],"Airlines":["JETS"],"Healthcare":["XLV"],"CleanEnergy":["ICLN"],"Staples":["XLP"]
  },
  newsMock: {
      "Geopolitics": {
          bucket: "Macro", region: "Global",
          summary: [ "US-China tensions rising over naval patrols.", "Escalating Middle East conflict threatens key oil shipping lanes.", "NATO allies finalize increased defense spending commitments."],
          news: [ {"headline":"US Considers New China Tariffs","summary":"Biden admin weighs additional tariffs on Chinese tech.","source":"WSJ"}, {"headline":"NATO Defense Spending Surges","summary":"European allies commit to exceeding 2% GDP targets.","source":"Reuters"}, {"headline":"Taiwan Strait Tensions Rise","summary":"Increased military activity in Taiwan Strait.","source":"Bloomberg"} ]
      },
      "Rates": {
          bucket: "Macro", region: "US",
          summary: ["Fed officials signal a 'higher for longer' rate stance.", "Inflation data shows a stubborn cooling trend, still above target.", "Bond markets are pricing in fewer rate cuts for the remainder of the year."],
          news: [ {"headline":"Fed Holds Rates Steady","summary":"FOMC keeps rates unchanged, signals data dependency.","source":"Bloomberg"}, {"headline":"Core Inflation Remains Sticky","summary":"Latest CPI data shows core inflation at 3.4%, slowing progress.","source":"Reuters"}, {"headline":"10-Year Yields Climb","summary":"Treasury yields rise as markets recalibrate rate cut expectations.","source":"MarketWatch"} ]
      },
      "Financials": {
          bucket: "Macro", region: "Global",
          summary: [
            "Fed officials signal a 'higher for longer' stance on interest rates, impacting bank profitability.",
            "US Treasury yields invert further, a classic recession indicator that pressures lending margins.",
            "Global regulators propose stricter capital requirements for major banks, potentially reducing leverage."
            ],
          news: [
              {"headline":"Fed Officials Signal Rate Cut Patience","summary":"Multiple Fed suggest waiting for more economic data.","source":"Bloomberg","link":"#"},
              {"headline":"Core Inflation Drops to 2.1%","summary":"Latest CPI data shows core inflation falling.","source":"Reuters","link":"#"},
              {"headline":"Bond Yields Decline on Fed Pivot","summary":"10-year Treasury yields fall to 3.8%.","source":"MarketWatch","link":"#"}
          ]
      },
      "Energy": {
          bucket: "Sector Trends", region: "Global",
          summary: [
            "OPEC+ unexpectedly deepens production cuts by 1M bpd.",
            "US Strategic Petroleum Reserve falls to a 40-year low.",
            "Investment in global renewable energy projects projected to double by 2030."
            ],
          news: [
              {"headline":"OPEC+ Extends Production Cuts","summary":"Oil cartel agrees to maintain current production levels.","source":"Reuters","link":"#"},
              {"headline":"US Strategic Reserve Hits 40-Year Low","summary":"Strategic Petroleum Reserve falls to lowest level since 1983.","source":"WSJ","link":"#"},
              {"headline":"Green Energy Investment Reaches Record","summary":"Global renewable energy investment hits $2.8 trillion in 2024.","source":"Financial Times","link":"#"}
          ]
      },
      "TechAI": {
          bucket: "Sector Trends", region: "Global",
          summary: ["Nvidia unveils next-gen 'Blackwell' AI chips with 30x performance leap.", "Global enterprise AI adoption surpasses 50%, driving massive cloud demand.", "EU finalizes 'AI Act,' establishing comprehensive regulatory framework."],
          news: [ {"headline":"Nvidia Unveils Blackwell GPUs","summary":"Next-gen chips promise massive performance gains.","source":"The Verge"}, {"headline":"OpenAI Hits 2B Users","summary":"ChatGPT and API usage soars as adoption accelerates.","source":"TechCrunch"}, {"headline":"EU Proposes AI Liability Rules","summary":"New regulation requires safety and transparency from developers.","source":"Politico"} ]
      },
      "Healthcare": {
          bucket: "Sector Trends", region: "US",
          summary: ["Major pharma M&A deal announced", "FDA approves breakthrough gene therapy", "Medicare drug price negotiations begin"],
          news: [
              {"headline":"Pfizer Acquires Seagen for $43B","summary":"Major pharmaceutical merger creates oncology powerhouse.","source":"BioPharma Dive","link":"#"},
              {"headline":"FDA Approves Gene Therapy for Blindness","summary":"Revolutionary treatment for inherited blindness receives approval.","source":"STAT News","link":"#"},
              {"headline":"Medicare Begins Drug Price Talks","summary":"First round of Medicare drug price negotiations begins.","source":"Kaiser Health News","link":"#"}
          ]
      },
      "Consumer": {
          bucket: "Sector Trends", region: "US",
          summary: ["Retail sales disappoint expectations", "Consumer confidence hits 6-month low", "E-commerce growth slows significantly"],
          news: [
              {"headline":"Retail Sales Fall 0.8% in November","summary":"Consumer spending shows signs of slowing.","source":"CNBC","link":"#"},
              {"headline":"Consumer Confidence Index Drops","summary":"University of Michigan consumer sentiment falls to 65.2.","source":"Reuters","link":"#"},
              {"headline":"Amazon Revenue Growth Slows","summary":"E-commerce giant reports slowest revenue growth in five years.","source":"Wall Street Journal","link":"#"}
          ]
      },
      "Crypto": {
          bucket: "Sector Trends", region: "Global",
          summary: ["Bitcoin ETF approval imminent", "Ethereum staking yields decline", "Regulatory clarity improves sentiment"],
          news: [
              {"headline":"SEC Likely to Approve Bitcoin ETF","summary":"Multiple sources suggest SEC will approve spot Bitcoin ETF.","source":"Coindesk","link":"#"},
              {"headline":"Ethereum Staking Yields Fall to 3.2%","summary":"ETH staking rewards decline as more validators join.","source":"The Block","link":"#"},
              {"headline":"Crypto Regulatory Framework Advances","summary":"Bipartisan Congressional committee approves digital asset bill.","source":"Politico","link":"#"}
          ]
      },
      "Misc": {
          bucket: "Macro", region: "Global",
          summary: ["Dollar strengthens against major currencies", "Gold reaches new all-time high", "Emerging markets see capital outflows"],
          news: [
              {"headline":"US Dollar Index Hits 3-Month High","summary":"Dollar strengthens against euro and yen.","source":"MarketWatch","link":"#"},
              {"headline":"Gold Surpasses $2,100 per Ounce","summary":"Precious metal reaches new record high.","source":"Kitco News","link":"#"},
              {"headline":"Emerging Market Outflows Accelerate","summary":"Foreign investors pull $15 billion from EM stocks and bonds.","source":"Financial Times","link":"#"}
          ]
      },
      "Apple": {
          bucket: "Company Highlights", region: "Global", company: "AAPL",
          summary: ["Apple unveils new M4 chips with a focus on on-device AI capabilities.", "Reports suggest Apple is in talks with OpenAI for iOS 18 integration.", "Vision Pro sales are reportedly slowing after initial launch enthusiasm."],
          news: [ {"headline":"Apple Debuts M4 Chip","summary":"Focus on neural engine for on-device AI features.","source":"9to5Mac"}, {"headline":"AAPL & OpenAI Partnership?","summary":"Talks could bring ChatGPT features to next iPhone OS.","source":"Bloomberg"}, {"headline":"Vision Pro Demand Cools","summary":"Analysts lower sales forecasts for the high-end headset.","source":"WSJ"}]
      },
      "Tesla": {
          bucket: "Company Highlights", region: "Global", company: "TSLA",
          summary: ["Tesla reports better-than-expected Q2 delivery numbers, beating analyst estimates.", "Cybertruck production ramp-up facing new challenges, delaying volume targets.", "New 'Robotaxi' concept to be unveiled at upcoming investor day."],
          news: [ {"headline":"Tesla Q2 Deliveries Surprise","summary":"Company delivered 495,000 vehicles, above the 482,000 consensus.","source":"Reuters"}, {"headline":"Cybertruck Ramp Hits Snag","summary":"Battery casing supplier issues are reportedly slowing down the production line.","source":"Electrek"}, {"headline":"Musk Teases Robotaxi Unveil","summary":"CEO tweets that the dedicated self-driving vehicle will be 'revolutionary'.","source":"Twitter/X"}]
      },
      "Google": {
          bucket: "Company Highlights", region: "Global", company: "GOOG",
          summary: ["Google's Gemini AI model shows impressive multi-modal capabilities in new demos.", "Antitrust scrutiny intensifies as DOJ trial over search dominance continues.", "Waymo subsidiary expands its driverless ride-hailing service to a new major city."],
          news: [ {"headline":"Gemini 1.5 Pro Impresses","summary":"New model handles massive context windows and complex video analysis.","source":"Ars Technica"}, {"headline":"DOJ Alleges Search Monopoly","summary":"The ongoing antitrust trial could have significant implications for Google's ad business.","source":"NY Times"}, {"headline":"Waymo Expands to Austin","summary":"Google's self-driving car unit is now operating commercially in its fourth US city.","source":"The Verge"}]
      }
  },
  companyList: [{"ticker":"AAPL","name":"Apple Inc."}, {"ticker":"NVDA","name":"Nvidia Corp."}, {"ticker":"TSLA","name":"Tesla, Inc."}, {"ticker":"GOOG","name":"Alphabet Inc."}],
  quoteMock: (ticker) => ({
      price: (Math.random() * 200 + 50).toFixed(2),
      fromHigh: (Math.random() * 30 + 5).toFixed(2),
      chartData: Array.from({length: 24}, (_, i) => ({month: i, price: 100 + Math.sin(i/3) * 20 + Math.random() * 10}))
  }),
  volMock: {"VNQ":0.18,"SOXL":0.65,"TNA":0.55,"NRGU":0.7,"BITX":0.9}
};

// VaR Calculation Function
const calcVaR = (etfBasket, volData) => {
  if (!etfBasket || !etfBasket.length) return 2.1;
  
  let portfolioVar = 0;
  etfBasket.forEach(({ etf, weight }) => {
    const vol = volData[etf] || 0.25; // Default vol if not found
    portfolioVar += (weight / 100) * vol * 1.65; // 95% confidence (1.65 is the z-score for 95% one-tailed)
  });
  
  return parseFloat(Math.min(portfolioVar * 100, 10).toFixed(2)); // Cap at 10% and format
};

// --- MAIN DASHBOARD ---
export default function Dashboard() {
    const [filters, setFilters] = useState({
        geo: 'US',
        sectors: ['all'],
        companies: [],
    });
    const [scenarios, setScenarios] = useState((MOCK_DATA.scenarios || []).map(s => ({...s, horizon: 'unassigned', riskRow: 'unassigned'})));
    const [binaryChoices, setBinaryChoices] = useState({});
    const [newsData, setNewsData] = useState(MOCK_DATA.newsMock || {});
    const [sectorScores, setSectorScores] = useState([]);
    const [etfBasket, setEtfBasket] = useState([]);
    const [glowingSectors, setGlowingSectors] = useState([]);
    const [portfolioVaR, setPortfolioVaR] = useState(2.1);
    
    // RHS State
    const [searchResult, setSearchResult] = useState(null);
    const [isSearchLoading, setSearchLoading] = useState(false);
    const [isChatOpen, setChatOpen] = useState(false);

    // --- Filtering Logic ---
    const getVisibleScenarios = () => {
        const { geo, sectors, companies } = filters;
        return (scenarios || []).filter(s => {
            if (s.isBinary) return true; // Always show binary scenarios

            const geoMatch = geo === 'Global' || (s.tags && s.tags.geo === geo);
            const sectorMatch = sectors.includes('all') || (s.tags && sectors.includes(s.tags.sector));
            const companyMatch = companies.length === 0 || (s.tags && s.tags.company && companies.includes(s.tags.company));
            
            return geoMatch && sectorMatch && companyMatch;
        });
    };

    // --- Core Logic ---
    const calculateImpact = useCallback(() => {
        const riskMap = { 'risk-on': 1, 'neutral': 0.5, 'risk-off': 0.2 };
        
        // Filter `scenarios` state, not MOCK_DATA.scenarios
        const activeGridScenarios = (scenarios || []).filter(s => s.horizon !== 'unassigned' && !s.isBinary);
        const activeBinaryScenarios = (scenarios || []).filter(s => s.isBinary && binaryChoices[s.id] === 'yes');
        const activeScenarios = [...activeGridScenarios, ...activeBinaryScenarios];
        
        let newScores = {};
        (MOCK_DATA.scenarios || []).forEach(s => Object.keys(s.beta || {}).forEach(b => newScores[b] = 0));

        activeScenarios.forEach(s => {
            const userProbAdj = s.isBinary ? 1 : riskMap[s.riskRow];
            if (userProbAdj === undefined) return;
            for (const [sector, beta] of Object.entries(s.beta || {})) {
                newScores[sector] = (newScores[sector] || 0) + userProbAdj * beta;
            }
        });

        // Normalize
        const maxAbsScore = Math.max(1, ...Object.values(newScores).map(Math.abs));
        Object.keys(newScores).forEach(s => newScores[s] = (newScores[s] / maxAbsScore) * 2);
        
        setSectorScores(Object.entries(newScores).map(([name, score]) => ({name, score})).sort((a,b)=>b.score - a.score));

        // ETF Basket
        const positiveScores = Object.entries(newScores).filter(([,s]) => s > 0);
        const totalPositiveScore = positiveScores.reduce((sum, [,s]) => sum + s, 0);
        const basket = totalPositiveScore > 0 ? positiveScores.map(([sector, score]) => {
            const etf = (MOCK_DATA.sectorToETF || {})[sector]?.[0] || null;
            return etf ? { etf, weight: (score / totalPositiveScore) * 100 } : null;
        }).filter(Boolean).sort((a, b) => b.weight - a.weight) : [];
        setEtfBasket(basket);

        // Calculate VaR
        const varValue = calcVaR(basket, MOCK_DATA.volMock || {});
        setPortfolioVaR(varValue);

        // Glowing sectors
        const userLikelySectors = activeScenarios.filter(s => s.riskRow === 'risk-on').flatMap(s => Object.keys(s.beta || {}));
        setGlowingSectors([...new Set(userLikelySectors)]);

    }, [scenarios, binaryChoices]);

    useEffect(() => {
        calculateImpact();
        handleSearch('NDX'); // Initial search
    }, [calculateImpact]);

    // --- Handlers ---
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({...prev, [filterType]: value}));
    };
    
    const handleDragEnd = (result) => {
        const { destination, draggableId } = result;
        if (!destination) return;
        const [destHorizon, destRisk] = destination.droppableId.split('|');
        setScenarios(prev => (prev || []).map(s => s.id === draggableId ? { ...s, horizon: destHorizon, riskRow: destRisk } : s));
    };

    const handleBinaryChoiceChange = (scenarioId, choice) => {
        setBinaryChoices(prev => ({...prev, [scenarioId]: choice}));
    };
    
    const handleVoiceCommand = () => toast.info("Voice command mock: 'Toggle AI Chip Boom to Neutral'.");

    const handleSearch = (ticker) => {
        setSearchLoading(true);
        setTimeout(() => {
            setSearchResult(MOCK_DATA.quoteMock(ticker));
            setSearchLoading(false);
        }, 500);
    };

    const handleCopyBasket = () => {
        const csv = "ETF,Weight\n" + (etfBasket || []).map(b => `${b.etf},${b.weight.toFixed(2)}`).join('\n');
        navigator.clipboard.writeText(csv);
        toast.success("Basket copied to clipboard!");
    };

    return (
        <div>
            <Toaster richColors position="bottom-right" theme="dark" />
            <div className="space-y-6">
                <WelcomeBanner />
                <PortfolioInput />
                <FilterBar filters={filters} onFilterChange={handleFilterChange} companyList={MOCK_DATA.companyList || []} />
                <div className="border-b border-slate-700/40"></div>
                <EventTimerBar />
                
                <div className="min-h-[22vh]">
                    <NewsDigestContainer newsData={newsData} sectorColors={MOCK_DATA.sectorColors || {}} glowingSectors={glowingSectors} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="lg:col-span-2 h-full">
                           <ScenarioGrid 
                               scenarios={getVisibleScenarios()} 
                               handleVoiceCommand={handleVoiceCommand} 
                               binaryChoices={binaryChoices} 
                               onBinaryChoiceChange={handleBinaryChoiceChange} 
                           />
                        </div>
                        <div className="h-full relative">
                             <div className="w-full h-full glassy-card rounded-xl p-4 flex flex-col relative">
                                <Tabs defaultValue="heat" className="flex flex-col flex-grow">
                                    <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-700">
                                        <TabsTrigger value="heat" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"><BarChart2 className="w-4 h-4 mr-1 sm:mr-2"/>Heat-Map</TabsTrigger>
                                        <TabsTrigger value="basket" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"><TableIcon className="w-4 h-4 mr-1 sm:mr-2"/>ETF Basket</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="heat" className="flex-grow mt-4"><HeatmapTab scores={sectorScores || []}/></TabsContent>
                                    <TabsContent value="basket" className="flex-grow mt-4"><EtfBasketTab basket={etfBasket || []} onCopy={handleCopyBasket} /></TabsContent>
                                </Tabs>
                                
                                {/* VaR Panel */}
                                <div className="mt-4">
                                    <VarPanel etfBasket={etfBasket || []} varPercent={portfolioVaR} />
                                </div>

                                {!isChatOpen && (
                                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                        <Button onClick={() => setChatOpen(true)} className="absolute bottom-4 right-4 bg-gradient-to-tr from-[#2979FF] to-[#4C8DFF] text-white rounded-full shadow-lg hover:shadow-[#2979FF]/50"><Brain className="w-5 h-5 mr-2" /> AI Advisor</Button>
                                    </motion.div>
                                )}
                                <AIAdvisor isVisible={isChatOpen} onToggle={() => setChatOpen(false)} />
                            </div>
                        </div>
                    </DragDropContext>
                </div>

                <div className="pt-6">
                    <PerformanceSearch onSearch={handleSearch} result={searchResult} isLoading={isSearchLoading} />
                </div>
            </div>
        </div>
    );
}
