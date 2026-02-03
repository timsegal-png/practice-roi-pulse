export interface PracticeData {
  odsCode: string;
  name: string;
  listSize: number;
}

// Cache for parsed practice data
let practicesCache: Map<string, PracticeData> | null = null;
let loadingPromise: Promise<void> | null = null;

/**
 * Load and parse the practices CSV file
 */
async function loadPractices(): Promise<Map<string, PracticeData>> {
  if (practicesCache) {
    return practicesCache;
  }

  if (loadingPromise) {
    await loadingPromise;
    return practicesCache!;
  }

  loadingPromise = (async () => {
    try {
      const response = await fetch('/data/practices.csv');
      const csvText = await response.text();
      
      practicesCache = new Map();
      const lines = csvText.split('\n');
      
      // Skip header row, parse each line
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Parse CSV line (handle commas in quoted fields)
        const fields = parseCSVLine(line);
        if (fields.length >= 5) {
          const practiceName = fields[0];
          const odsCode = fields[1].toUpperCase();
          const listSize = parseInt(fields[4], 10);
          
          if (odsCode && !isNaN(listSize)) {
            practicesCache.set(odsCode, {
              odsCode,
              name: practiceName,
              listSize,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load practices data:', error);
      practicesCache = new Map();
    }
  })();

  await loadingPromise;
  return practicesCache!;
}

/**
 * Parse a CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Lookup a practice by ODS code
 */
export async function lookupPractice(odsCode: string): Promise<PracticeData | null> {
  const practices = await loadPractices();
  return practices.get(odsCode.toUpperCase()) || null;
}

/**
 * Validate ODS code format
 */
export function validateOdsCode(code: string): boolean {
  // ODS codes are typically 5-7 alphanumeric characters
  const pattern = /^[A-Za-z0-9]{5,7}$/;
  return pattern.test(code.trim());
}

/**
 * Search for practices by partial ODS code or name
 */
export async function searchPractices(query: string, limit = 10): Promise<PracticeData[]> {
  const practices = await loadPractices();
  const upperQuery = query.toUpperCase();
  const results: PracticeData[] = [];
  
  for (const [, practice] of practices) {
    if (
      practice.odsCode.includes(upperQuery) ||
      practice.name.toUpperCase().includes(upperQuery)
    ) {
      results.push(practice);
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

/**
 * Get the total number of practices loaded
 */
export async function getPracticeCount(): Promise<number> {
  const practices = await loadPractices();
  return practices.size;
}
