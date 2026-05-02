export interface FuneralHallGenerated {
  id: string;
  name: string;
  region: string;
  district: string;
  type: "hospital" | "public" | "private";
  address: string;
  phone: string;
  rooms: number;
  naverMapUrl: string;
  features: string[];
  homepage?: string;
  parkingSpaces?: number;
  storageCapacity?: number;
}
