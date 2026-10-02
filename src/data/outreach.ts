export const outreachStats = [
  { value: "20+", label: "STATES" },
  { value: "150+", label: "DEALERS" },
  { value: "5000+", label: "DRONES DEPLOYED" },
  { value: "200+", label: "TRAINING CENTERS" },
];

export interface StateData {
  id: string;
  name: string;
  dronesDeployed: number;
  farmersReached: number;
  cx: number; // SVG x coordinate
  cy: number; // SVG y coordinate
}

export const stateData: StateData[] = [
  { id: "MH", name: "Maharashtra", dronesDeployed: 850, farmersReached: 12500, cx: 210, cy: 300 },
  { id: "PB", name: "Punjab", dronesDeployed: 620, farmersReached: 9800, cx: 200, cy: 120 },
  { id: "AP", name: "Andhra Pradesh", dronesDeployed: 540, farmersReached: 8200, cx: 265, cy: 360 },
  { id: "TN", name: "Tamil Nadu", dronesDeployed: 480, farmersReached: 7100, cx: 255, cy: 420 },
  { id: "UP", name: "Uttar Pradesh", dronesDeployed: 720, farmersReached: 11000, cx: 265, cy: 200 },
  { id: "MP", name: "Madhya Pradesh", dronesDeployed: 430, farmersReached: 6500, cx: 250, cy: 250 },
  { id: "RJ", name: "Rajasthan", dronesDeployed: 380, farmersReached: 5800, cx: 185, cy: 205 },
  { id: "HR", name: "Haryana", dronesDeployed: 410, farmersReached: 6200, cx: 210, cy: 150 },
  { id: "GJ", name: "Gujarat", dronesDeployed: 370, farmersReached: 5600, cx: 165, cy: 265 },
  { id: "KA", name: "Karnataka", dronesDeployed: 520, farmersReached: 7800, cx: 235, cy: 390 },
];
