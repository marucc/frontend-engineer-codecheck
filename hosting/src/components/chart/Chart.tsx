import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useMemo, useRef } from 'react'

import { usePopulationContext } from '../../hooks/usePopulationContext'
import { getSeriesStyle } from '../../utils/seriesStyles'
import styles from './Chart.module.css'

export const Chart = () => {
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { populations, populationType } = usePopulationContext()

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const observer = new ResizeObserver(() => {
      const chart = chartRef.current?.chart
      if (chart) {
        chart.setSize(wrapper.clientWidth, wrapper.clientHeight, false)
      }
    })
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [populations])

  const series: Highcharts.SeriesOptionsType[] = useMemo(
    () =>
      populations.map((pref) => {
        const composition = pref.data.find((d) => d.label === populationType)
        const { color, symbol } = getSeriesStyle(pref.styleIndex)
        return {
          type: 'line' as const,
          id: `pref-${pref.prefCode}`,
          name: pref.prefName,
          color,
          marker: { symbol, enabled: true, lineWidth: 0 },
          data:
            composition?.data.map((entry) => [entry.year, entry.value]) ?? [],
        }
      }),
    [populations, populationType]
  )

  const options: Highcharts.Options = useMemo(
    () => ({
      chart: { marginTop: 25, marginBottom: 45 },
      title: { text: undefined },
      xAxis: { title: { text: '年', align: 'high', y: -19 }, type: 'linear' },
      yAxis: { title: { text: '人口数' } },
      series,
      legend: { enabled: false },
      credits: { enabled: false },
      responsive: { rules: [] },
    }),
    [series]
  )

  if (populations.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.placeholder}>都道府県を選択してください</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div ref={wrapperRef} className={styles.chartWrapper}>
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: '100%', height: '100%' } }}
        />
      </div>
    </div>
  )
}
