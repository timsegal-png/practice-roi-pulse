// Mock NHS Practice data mapped by ODS Code
// In production, this would integrate with the NHS ODS API
export interface PracticeData {
  odsCode: string;
  name: string;
  listSize: number;
  address?: string;
}

// Sample NHS GP practices with realistic data
const practiceDatabase: Record<string, PracticeData> = {
  // London
  "E87001": { odsCode: "E87001", name: "The Lister Medical Centre", listSize: 8500, address: "London" },
  "E87002": { odsCode: "E87002", name: "St. Thomas' Family Practice", listSize: 12400, address: "London" },
  "E87003": { odsCode: "E87003", name: "Bloomsbury Surgery", listSize: 4200, address: "London" },
  "E87004": { odsCode: "E87004", name: "King's Cross Medical Centre", listSize: 15800, address: "London" },
  "E87005": { odsCode: "E87005", name: "Chelsea & Westminster Practice", listSize: 7200, address: "London" },
  
  // Manchester
  "Y03001": { odsCode: "Y03001", name: "Manchester Health Centre", listSize: 9800, address: "Manchester" },
  "Y03002": { odsCode: "Y03002", name: "Piccadilly Medical Practice", listSize: 6100, address: "Manchester" },
  "Y03003": { odsCode: "Y03003", name: "Northern Quarter Surgery", listSize: 3800, address: "Manchester" },
  
  // Birmingham
  "M85001": { odsCode: "M85001", name: "Birmingham Central Practice", listSize: 11200, address: "Birmingham" },
  "M85002": { odsCode: "M85002", name: "Edgbaston Medical Centre", listSize: 5500, address: "Birmingham" },
  
  // Leeds
  "B82001": { odsCode: "B82001", name: "Leeds City Medical Centre", listSize: 8900, address: "Leeds" },
  "B82002": { odsCode: "B82002", name: "Headingley Family Practice", listSize: 4800, address: "Leeds" },
  
  // Bristol
  "L81001": { odsCode: "L81001", name: "Bristol Harbourside Surgery", listSize: 7600, address: "Bristol" },
  "L81002": { odsCode: "L81002", name: "Clifton Medical Practice", listSize: 13500, address: "Bristol" },
  
  // Liverpool
  "N85001": { odsCode: "N85001", name: "Liverpool Central Practice", listSize: 10100, address: "Liverpool" },
  
  // Sheffield
  "C84001": { odsCode: "C84001", name: "Sheffield Health Centre", listSize: 6700, address: "Sheffield" },
  
  // Newcastle
  "A84001": { odsCode: "A84001", name: "Newcastle City Practice", listSize: 8200, address: "Newcastle" },
  
  // Large practices
  "F84001": { odsCode: "F84001", name: "Greater London Medical Group", listSize: 95000, address: "London" },
  "F84002": { odsCode: "F84002", name: "Midlands Health Network", listSize: 45000, address: "Birmingham" },
};

export function lookupPractice(odsCode: string): PracticeData | null {
  const normalizedCode = odsCode.toUpperCase().trim();
  return practiceDatabase[normalizedCode] || null;
}

export function validateOdsCode(code: string): boolean {
  // ODS codes are typically 5-6 alphanumeric characters
  const pattern = /^[A-Z0-9]{5,6}$/i;
  return pattern.test(code.trim());
}

export function getAllPractices(): PracticeData[] {
  return Object.values(practiceDatabase);
}
