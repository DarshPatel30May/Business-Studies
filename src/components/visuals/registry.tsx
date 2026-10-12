import type { ComponentType } from "react";
import type { TopicId } from "../../content/types";
import type { VisualId } from "../../content/visualIds";
import { InterdependenceMap } from "./Interdependence";
import { FourVs, InventoryLab, ItoExplorer, PerformanceObjectives, QualityVisual, SupplyChainFlow } from "./OperationsVisuals";
import { GanttLab } from "./GanttLab";
import { HrSimulator, MktSimulator, OpsSimulator } from "./Simulators";
import { DistributionChannels, GlobalSlider, MarketingMix, ObjectivesDashboard, PlcChart, PositioningMap, PricingStrategies, PromotionMix, Segmentation, SwotBuilder } from "./MarketingVisuals";
import {
  BalanceSheetVisual,
  CashFlowVisual,
  DebtEquityTree,
  ExchangeVisual,
  FinanceSimulator,
  FinObjectives,
  FinRelationship,
  IncomeStatementVisual,
  InternalExternal,
  ProfitabilityGraph,
  RatioDashboard,
  RevExpChart,
  WorkingCapitalFlow,
} from "./FinanceVisuals";
import { DisputesFlow, HrDashboard, HrLifecycle, LeadershipCompare, PerformanceFlow, RecruitmentWeigher, RegulationOverview, RewardsCompare, StakeholderMap, TrainingFlow, TurnoverSimulator } from "./HrVisuals";

type VisualComponent = ComponentType<{ topic: TopicId }>;

export const VisualRegistry: Record<VisualId | string, VisualComponent> = {
  "interdependence-ops": () => <InterdependenceMap topic="operations" />,
  "interdependence-mkt": () => <InterdependenceMap topic="marketing" />,
  "interdependence-fin": () => <InterdependenceMap topic="finance" />,
  "interdependence-hr": () => <InterdependenceMap topic="hr" />,
  "ops-ito": ItoExplorer,
  "ops-4v": FourVs,
  "ops-gantt-lab": GanttLab,
  "ops-performance": PerformanceObjectives,
  "ops-supply-chain": SupplyChainFlow,
  "ops-inventory": InventoryLab,
  "ops-quality": QualityVisual,
  "ops-simulator": OpsSimulator,
  "mkt-swot": SwotBuilder,
  "mkt-plc": PlcChart,
  "mkt-objectives": ObjectivesDashboard,
  "mkt-segmentation": Segmentation,
  "mkt-positioning": PositioningMap,
  "mkt-mix": MarketingMix,
  "mkt-pricing": PricingStrategies,
  "mkt-promotion": PromotionMix,
  "mkt-distribution": DistributionChannels,
  "mkt-global": GlobalSlider,
  "mkt-simulator": MktSimulator,
  "fin-objectives": FinObjectives,
  "fin-internal-external": InternalExternal,
  "fin-debt-equity": DebtEquityTree,
  "fin-relationship": FinRelationship,
  "fin-income": IncomeStatementVisual,
  "fin-balance": BalanceSheetVisual,
  "fin-cashflow": CashFlowVisual,
  "fin-ratio-dashboard": RatioDashboard,
  "fin-profitability": ProfitabilityGraph,
  "fin-working-capital": WorkingCapitalFlow,
  "fin-rev-exp": RevExpChart,
  "fin-exchange": ExchangeVisual,
  "fin-simulator": FinanceSimulator,
  "hr-stakeholders": StakeholderMap,
  "hr-regulation": RegulationOverview,
  "hr-lifecycle": HrLifecycle,
  "hr-leadership": LeadershipCompare,
  "hr-recruitment": RecruitmentWeigher,
  "hr-training": TrainingFlow,
  "hr-performance": PerformanceFlow,
  "hr-rewards": RewardsCompare,
  "hr-disputes": DisputesFlow,
  "hr-dashboard": HrDashboard,
  "hr-turnover": TurnoverSimulator,
  "hr-simulator": HrSimulator,
};
