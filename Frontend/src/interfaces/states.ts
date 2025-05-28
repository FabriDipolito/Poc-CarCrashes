export interface AccidentData {
  id: {
    caseId: number;
    year: string;
  };
  crashDate: string;
  state: number;
  stateName: string;
  countyName: string;
  totalVehicles: number;
  fatals: number;
  persons: number;
  peds: number;
}

export interface PieChartComponentProps {
  arrayOfYears: number[];
}

export interface PieChartDataItem {
  id: string;
  label: string;
  value: number;
}

export interface AreaChartComponentProps {
  arrayOfYears: number[];
}

export interface AreaChartDataItem {
  name: string;
  total: number;
}
