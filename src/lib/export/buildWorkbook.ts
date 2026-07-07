import ExcelJS from "exceljs";

import type { Asset, ExpenseItem, IncomeItem, Liability, StrategyAllocation } from "@/lib/wealth/types";

const NAVY = "0E2A47";
const INPUT_FILL = "E4EEF6";

export interface ExportLabels {
  summarySheet: string;
  incomeExpenseSheet: string;
  assetsSheet: string;
  liabilitiesSheet: string;
  strategySheet: string;
  projectionSheet: string;
  legalSheet: string;
  summary: {
    title: string;
    totalAssets: string;
    totalLiabilities: string;
    netWorth: string;
    monthlyIncome: string;
    monthlyExpenses: string;
    cashFlow: string;
    savingsRate: string;
    liquidAssets: string;
    emergencyFundMonths: string;
    debtToAssets: string;
    debtToIncome: string;
  };
  columns: {
    name: string;
    category: string;
    amount: string;
    value: string;
    currency: string;
    interestRate: string;
    monthlyPayment: string;
    targetPercentage: string;
    currentValue: string;
    actualPercentage: string;
    deviation: string;
    year: string;
    estimatedValue: string;
    contributed: string;
  };
  incomeTitle: string;
  expenseTitle: string;
  projectionInitial: string;
  projectionMonthly: string;
  projectionRate: string;
  projectionYears: string;
  disclaimerTitle: string;
  disclaimerBody: string;
}

export interface ExportData {
  fullName: string;
  baseCurrency: string;
  income: IncomeItem[];
  expenses: ExpenseItem[];
  assets: Asset[];
  liabilities: Liability[];
  strategy: StrategyAllocation[];
  categoryLabels: {
    income: Record<string, string>;
    expense: Record<string, string>;
    asset: Record<string, string>;
    liability: Record<string, string>;
  };
  liquidAssetLabel: string;
  projectionDefaults: { initial: number; monthly: number; ratePercent: number; years: number };
}

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${NAVY}` } };
  });
}

function styleInputCell(cell: ExcelJS.Cell) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${INPUT_FILL}` } };
  cell.protection = { locked: false };
}

function styleTitleCell(cell: ExcelJS.Cell) {
  cell.font = { bold: true, size: 14, color: { argb: `FF${NAVY}` } };
}

async function protectSheet(sheet: ExcelJS.Worksheet) {
  await sheet.protect("", { selectLockedCells: true, selectUnlockedCells: true });
}

function quote(sheetName: string): string {
  return `'${sheetName}'`;
}

export async function buildWorkbook(data: ExportData, labels: ExportLabels): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Julià Regader";
  workbook.created = new Date();

  const currency = data.baseCurrency;
  const currencyFmt = `#,##0.00 "${currency}"`;
  const percentFmt = "0.0%";

  // El Resumen se crea primero para que sea la primera pestaña visible en
  // Excel, pero se rellena al final, una vez conocemos cuántas filas de
  // datos tiene cada una de las demás hojas.
  const summarySheet = workbook.addWorksheet(labels.summarySheet);

  // ---------------------------------------------------------------------
  // Ingresos y gastos
  // ---------------------------------------------------------------------
  const ieSheet = workbook.addWorksheet(labels.incomeExpenseSheet);
  ieSheet.getCell("A1").value = labels.incomeTitle;
  styleTitleCell(ieSheet.getCell("A1"));
  ieSheet.getCell("F1").value = labels.expenseTitle;
  styleTitleCell(ieSheet.getCell("F1"));

  const ieHeader = ieSheet.getRow(2);
  ieHeader.getCell(1).value = labels.columns.name;
  ieHeader.getCell(2).value = labels.columns.category;
  ieHeader.getCell(3).value = labels.columns.amount;
  ieHeader.getCell(4).value = labels.columns.currency;
  ieHeader.getCell(6).value = labels.columns.name;
  ieHeader.getCell(7).value = labels.columns.category;
  ieHeader.getCell(8).value = labels.columns.amount;
  ieHeader.getCell(9).value = labels.columns.currency;
  styleHeaderRow(ieHeader);

  data.income.forEach((item, i) => {
    const row = ieSheet.getRow(3 + i);
    row.getCell(1).value = item.name;
    row.getCell(2).value = data.categoryLabels.income[item.category] ?? item.category;
    row.getCell(3).value = item.amount;
    row.getCell(3).numFmt = currencyFmt;
    row.getCell(4).value = item.currency;
    [1, 2, 3, 4].forEach((c) => styleInputCell(row.getCell(c)));
  });
  const lastIncomeRow = Math.max(3, 2 + data.income.length);

  data.expenses.forEach((item, i) => {
    const row = ieSheet.getRow(3 + i);
    row.getCell(6).value = item.name;
    row.getCell(7).value = data.categoryLabels.expense[item.category] ?? item.category;
    row.getCell(8).value = item.amount;
    row.getCell(8).numFmt = currencyFmt;
    row.getCell(9).value = item.currency;
    [6, 7, 8, 9].forEach((c) => styleInputCell(row.getCell(c)));
  });
  const lastExpenseRow = Math.max(3, 2 + data.expenses.length);

  ieSheet.columns.forEach((col) => (col.width = 18));
  await protectSheet(ieSheet);

  // ---------------------------------------------------------------------
  // Activos
  // ---------------------------------------------------------------------
  const assetsSheet = workbook.addWorksheet(labels.assetsSheet);
  const assetsHeader = assetsSheet.getRow(1);
  ["name", "category", "value", "currency"].forEach((key, i) => {
    assetsHeader.getCell(i + 1).value = labels.columns[key as keyof typeof labels.columns];
  });
  styleHeaderRow(assetsHeader);
  data.assets.forEach((asset, i) => {
    const row = assetsSheet.getRow(2 + i);
    row.getCell(1).value = asset.name;
    row.getCell(2).value = data.categoryLabels.asset[asset.category] ?? asset.category;
    row.getCell(3).value = asset.value;
    row.getCell(3).numFmt = currencyFmt;
    row.getCell(4).value = asset.currency;
    [1, 2, 3, 4].forEach((c) => styleInputCell(row.getCell(c)));
  });
  const lastAssetRow = Math.max(2, 1 + data.assets.length);
  assetsSheet.columns.forEach((col) => (col.width = 20));
  await protectSheet(assetsSheet);

  // ---------------------------------------------------------------------
  // Pasivos
  // ---------------------------------------------------------------------
  const liabilitiesSheet = workbook.addWorksheet(labels.liabilitiesSheet);
  const liabilitiesHeader = liabilitiesSheet.getRow(1);
  ["name", "category", "value", "currency", "interestRate", "monthlyPayment"].forEach((key, i) => {
    liabilitiesHeader.getCell(i + 1).value = labels.columns[key as keyof typeof labels.columns];
  });
  styleHeaderRow(liabilitiesHeader);
  data.liabilities.forEach((liability, i) => {
    const row = liabilitiesSheet.getRow(2 + i);
    row.getCell(1).value = liability.name;
    row.getCell(2).value = data.categoryLabels.liability[liability.category] ?? liability.category;
    row.getCell(3).value = liability.value;
    row.getCell(3).numFmt = currencyFmt;
    row.getCell(4).value = liability.currency;
    row.getCell(5).value = liability.interest_rate ?? undefined;
    row.getCell(6).value = liability.monthly_payment ?? undefined;
    row.getCell(6).numFmt = currencyFmt;
    [1, 2, 3, 4, 5, 6].forEach((c) => styleInputCell(row.getCell(c)));
  });
  const lastLiabilityRow = Math.max(2, 1 + data.liabilities.length);
  liabilitiesSheet.columns.forEach((col) => (col.width = 20));
  await protectSheet(liabilitiesSheet);

  // ---------------------------------------------------------------------
  // Estrategia de inversión
  // ---------------------------------------------------------------------
  const strategySheet = workbook.addWorksheet(labels.strategySheet);
  const strategyHeader = strategySheet.getRow(1);
  ["name", "targetPercentage", "currentValue", "currency", "actualPercentage", "deviation"].forEach(
    (key, i) => {
      strategyHeader.getCell(i + 1).value = labels.columns[key as keyof typeof labels.columns];
    },
  );
  styleHeaderRow(strategyHeader);
  const lastStrategyRow = Math.max(2, 1 + data.strategy.length);
  data.strategy.forEach((allocation, i) => {
    const rowIndex = 2 + i;
    const row = strategySheet.getRow(rowIndex);
    row.getCell(1).value = allocation.asset_class;
    row.getCell(2).value = allocation.target_percentage;
    row.getCell(2).numFmt = "0.0";
    row.getCell(3).value = allocation.current_value;
    row.getCell(3).numFmt = currencyFmt;
    row.getCell(4).value = allocation.currency;
    row.getCell(5).value = {
      formula: `IF(SUM($C$2:$C$${lastStrategyRow})>0,C${rowIndex}/SUM($C$2:$C$${lastStrategyRow})*100,0)`,
    };
    row.getCell(5).numFmt = "0.0";
    row.getCell(6).value = { formula: `E${rowIndex}-B${rowIndex}` };
    row.getCell(6).numFmt = "0.0";
    [1, 2, 3, 4].forEach((c) => styleInputCell(row.getCell(c)));
  });
  strategySheet.columns.forEach((col) => (col.width = 18));
  await protectSheet(strategySheet);

  // ---------------------------------------------------------------------
  // Proyección (interés compuesto)
  // ---------------------------------------------------------------------
  const projectionSheet = workbook.addWorksheet(labels.projectionSheet);
  projectionSheet.getCell("A1").value = labels.projectionInitial;
  projectionSheet.getCell("B1").value = data.projectionDefaults.initial;
  projectionSheet.getCell("B1").numFmt = currencyFmt;
  projectionSheet.getCell("A2").value = labels.projectionMonthly;
  projectionSheet.getCell("B2").value = data.projectionDefaults.monthly;
  projectionSheet.getCell("B2").numFmt = currencyFmt;
  projectionSheet.getCell("A3").value = labels.projectionRate;
  projectionSheet.getCell("B3").value = data.projectionDefaults.ratePercent;
  projectionSheet.getCell("A4").value = labels.projectionYears;
  projectionSheet.getCell("B4").value = data.projectionDefaults.years;
  [1, 2, 3, 4].forEach((r) => styleInputCell(projectionSheet.getCell(`B${r}`)));

  const tableStartRow = 6;
  const tableHeader = projectionSheet.getRow(tableStartRow);
  tableHeader.getCell(1).value = labels.columns.year;
  tableHeader.getCell(2).value = labels.columns.estimatedValue;
  tableHeader.getCell(3).value = labels.columns.contributed;
  styleHeaderRow(tableHeader);

  const years = Math.max(1, Math.min(50, data.projectionDefaults.years || 20));
  for (let year = 0; year <= years; year += 1) {
    const rowIndex = tableStartRow + 1 + year;
    const row = projectionSheet.getRow(rowIndex);
    row.getCell(1).value = year;
    if (year === 0) {
      row.getCell(2).value = { formula: "$B$1" };
      row.getCell(3).value = { formula: "$B$1" };
    } else {
      const prevRow = rowIndex - 1;
      row.getCell(2).value = { formula: `B${prevRow}*(1+$B$3/100)+$B$2*12` };
      row.getCell(3).value = { formula: `C${prevRow}+$B$2*12` };
    }
    row.getCell(2).numFmt = currencyFmt;
    row.getCell(3).numFmt = currencyFmt;
  }
  projectionSheet.columns.forEach((col) => (col.width = 20));
  await protectSheet(projectionSheet);

  // ---------------------------------------------------------------------
  // Aviso legal
  // ---------------------------------------------------------------------
  const legalSheet = workbook.addWorksheet(labels.legalSheet);
  legalSheet.getCell("A1").value = labels.disclaimerTitle;
  styleTitleCell(legalSheet.getCell("A1"));
  legalSheet.getCell("A3").value = labels.disclaimerBody;
  legalSheet.getCell("A3").alignment = { wrapText: true, vertical: "top" };
  legalSheet.getColumn(1).width = 90;
  legalSheet.getRow(3).height = 80;

  // ---------------------------------------------------------------------
  // Resumen — se rellena al final, con fórmulas que referencian las demás
  // hojas (ya conocemos el nº de filas de cada una).
  // ---------------------------------------------------------------------
  summarySheet.getCell("A1").value = labels.summary.title;
  styleTitleCell(summarySheet.getCell("A1"));

  const liquidLabel = data.liquidAssetLabel;
  const summaryRows: [string, { formula: string }, string?][] = [
    [labels.summary.totalAssets, { formula: `SUM(${quote(labels.assetsSheet)}!C2:C${lastAssetRow})` }],
    [
      labels.summary.totalLiabilities,
      { formula: `SUM(${quote(labels.liabilitiesSheet)}!C2:C${lastLiabilityRow})` },
    ],
    [labels.summary.netWorth, { formula: "B3-B4" }],
    [
      labels.summary.monthlyIncome,
      { formula: `SUM(${quote(labels.incomeExpenseSheet)}!C3:C${lastIncomeRow})` },
    ],
    [
      labels.summary.monthlyExpenses,
      { formula: `SUM(${quote(labels.incomeExpenseSheet)}!H3:H${lastExpenseRow})` },
    ],
    [labels.summary.cashFlow, { formula: "B6-B7" }],
    [labels.summary.savingsRate, { formula: 'IF(B6>0,B8/B6,"")' }, percentFmt],
    [
      labels.summary.liquidAssets,
      {
        formula: `SUMIF(${quote(labels.assetsSheet)}!B2:B${lastAssetRow},"${liquidLabel}",${quote(labels.assetsSheet)}!C2:C${lastAssetRow})`,
      },
    ],
    [labels.summary.emergencyFundMonths, { formula: 'IF(B7>0,B10/B7,"")' }, "0.0"],
    [labels.summary.debtToAssets, { formula: 'IF(B3>0,B4/B3,"")' }, percentFmt],
    [labels.summary.debtToIncome, { formula: 'IF(B6>0,B4/B6,"")' }, percentFmt],
  ];

  summaryRows.forEach(([label, value, fmt], i) => {
    const rowIndex = 3 + i;
    const row = summarySheet.getRow(rowIndex);
    row.getCell(1).value = label;
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = value;
    row.getCell(2).numFmt = fmt ?? currencyFmt;
  });

  summarySheet.getColumn(1).width = 28;
  summarySheet.getColumn(2).width = 20;
  await protectSheet(summarySheet);
  summarySheet.views = [{ state: "frozen", ySplit: 2 }];

  return workbook;
}
