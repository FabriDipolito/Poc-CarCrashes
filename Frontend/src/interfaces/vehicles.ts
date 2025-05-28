export interface Vehicle {
  vehicleId: number;
  makeId: number;
  makeName: string;
  model: number;
  modelName: string;
  modelYear: string;
  bodyType: number;
  bodyTypeName: string;
  accidentId: number;
  year: string;
}

export interface PieChartDataItem {
  id: number;
  label: string;
  value: number;
  color: string;
}

interface YearNode {
  name: string;
  loc: number;
}

interface ModelNode {
  name: string;
  children: YearNode[];
}

export interface TreeMapData {
  name: string;
  children: ModelNode[];
}

export interface TreeMapComponentProps {
  makeId: number | undefined;
  filterType: string;
}
