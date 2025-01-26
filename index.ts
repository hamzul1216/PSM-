import fs from "fs";
import Papa from "papaparse";

// Fungsi untuk membaca file CSV
async function readCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return reject(err);
      Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: reject,
      });
    });
  });
}

// Fungsi untuk mencari titik potong antar garis
function findIntersection(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): number | null {
  const denominator = (y1 - y2) * (x3 - x4) - (y3 - y4) * (x1 - x2);
  if (denominator === 0) return null;
  return (
    ((y3 - y1) * (x1 - x2) * (x3 - x4) +
      x3 * (y1 - y2) * (x3 - x4) -
      x1 * (y3 - y4) * (x1 - x2)) /
    denominator
  );
}

// Fungsi untuk menghitung rate
function calculateRate(prices: any[], condition: (row: any) => boolean): number {
  return Math.round((prices.filter(condition).length / prices.length) * 100 * 10) / 10;
}

// Fungsi deteksi harga
function detectIntersection(
  responseRates: any[],
  condition: (prev: any, curr: any) => boolean,
  getXValues: (prev: any, curr: any) => [number, number, number, number, number, number, number, number]
): number | null {
  for (let i = 1; i < responseRates.length; i++) {
    const prev = responseRates[i - 1];
    const curr = responseRates[i];
    if (condition(prev, curr)) {
      const [x1, y1, x2, y2, x3, y3, x4, y4] = getXValues(prev, curr);
      return findIntersection(x1, y1, x2, y2, x3, y3, x4, y4);
    }
  }
  return null;
}

// Fungsi utama
async function main() {
  const args = process.argv;
  const csvFileIndex = args.indexOf("--csvfile");
  if (csvFileIndex === -1 || !args[csvFileIndex + 1]) {
    console.error("Error: File CSV tidak disediakan. Gunakan --csvfile <nama_file>");
    process.exit(1);
  }
  const csvFilePath = args[csvFileIndex + 1];

  try {
    const data = await readCSV(csvFilePath);

    if (!data || data.length === 0) {
      console.error("Error: Data CSV kosong atau tidak valid.");
      process.exit(1);
    }

    const prices = data.map((row: any) => ({
      tooCheap: parseFloat(row["安すぎる"]),
      tooExpensive: parseFloat(row["高すぎる"]),
      expensive: parseFloat(row["高い"]),
      cheap: parseFloat(row["安い"]),
    }));

    const minPrice = Math.floor(Math.min(...prices.map((row) => row.tooCheap)) / 50) * 50;
    const maxPrice = Math.ceil(Math.max(...prices.map((row) => row.tooExpensive)) / 50) * 50;

    const responseRates = [];
    for (let price = minPrice; price <= maxPrice; price += 50) {
      responseRates.push({
        price,
        tooExpensiveRate: calculateRate(prices, (row) => row.tooExpensive <= price),
        tooCheapRate: calculateRate(prices, (row) => row.tooCheap >= price),
        expensiveRate: calculateRate(prices, (row) => row.expensive <= price),
        cheapRate: calculateRate(prices, (row) => row.cheap >= price),
      });
    }

    let highestPrice = detectIntersection(
      responseRates,
      (prev, curr) => prev.tooExpensiveRate < prev.cheapRate && curr.tooExpensiveRate >= curr.cheapRate,
      (prev, curr) => [
        prev.price, prev.tooExpensiveRate,
        curr.price, curr.tooExpensiveRate,
        prev.price, prev.cheapRate,
        curr.price, curr.cheapRate
      ]
    );

    let compromisePrice = detectIntersection(
      responseRates,
      (prev, curr) => prev.cheapRate > prev.expensiveRate && curr.cheapRate <= curr.expensiveRate,
      (prev, curr) => [
        prev.price, prev.cheapRate,
        curr.price, curr.cheapRate,
        prev.price, prev.expensiveRate,
        curr.price, curr.expensiveRate
      ]
    );

    let idealPrice = detectIntersection(
      responseRates,
      (prev, curr) => prev.tooExpensiveRate < prev.tooCheapRate && curr.tooExpensiveRate >= curr.tooCheapRate,
      (prev, curr) => [
        prev.price, prev.tooExpensiveRate,
        curr.price, curr.tooExpensiveRate,
        prev.price, prev.tooCheapRate,
        curr.price, curr.tooCheapRate
      ]
    );

    let minQualityPrice = detectIntersection(
      responseRates,
      (prev, curr) => prev.tooCheapRate > prev.expensiveRate && curr.tooCheapRate <= curr.expensiveRate,
      (prev, curr) => [
        prev.price, prev.tooCheapRate,
        curr.price, curr.tooCheapRate,
        prev.price, prev.expensiveRate,
        curr.price, curr.expensiveRate
      ]
    );
    
    console.log("------------------------");
    console.log(`最高価格        : ${Math.ceil(highestPrice ?? 0)} 円`);
    console.log(`妥協価格        : ${Math.ceil(compromisePrice ?? 0)} 円`);
    console.log(`理想価格        : ${Math.ceil(idealPrice ?? 0)} 円`);
    console.log(`最低品質保証価格: ${Math.ceil(minQualityPrice ?? 0)} 円`);
    console.log("------------------------");

  } catch (error) {
    console.error("Error:", error);
  }
}

main();