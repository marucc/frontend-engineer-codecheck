// Highcharts デフォルトカラーパレット10色
const COLORS = [
  '#2caffe',
  '#544fc5',
  '#00e272',
  '#fe6a35',
  '#6b8abc',
  '#d568fb',
  '#2ee0ca',
  '#fa4b42',
  '#feb56a',
  '#91e8e1',
]

// 色と素になるように7種
const SYMBOLS = [
  'circle',
  'diamond',
  'square',
  'triangle',
  'triangle-down',
  'circle',
  'diamond',
]

export const getSeriesStyle = (seriesIndex: number) => ({
  color: COLORS[seriesIndex % COLORS.length],
  symbol: SYMBOLS[seriesIndex % SYMBOLS.length],
})
