import { useCallback, useMemo, useState } from 'react'

import { usePopulationContext } from '../../hooks/usePopulationContext'
import { usePrefectures } from '../../hooks/usePrefectures'
import { getSeriesStyle } from '../../utils/seriesStyles'
import styles from './PrefectureSelector.module.css'

export const PrefectureSelector = () => {
  const { populations, addPrefecture, removePrefecture } =
    usePopulationContext()
  const { prefectures, loading, error } = usePrefectures()
  const [selectedCodes, setSelectedCodes] = useState<Set<number>>(new Set())

  const styleIndexMap = useMemo(() => {
    const map = new Map<number, number>()
    populations.forEach((p) => map.set(p.prefCode, p.styleIndex))
    return map
  }, [populations])

  const handleChange = useCallback(
    (prefCode: number, prefName: string, checked: boolean) => {
      if (checked) {
        setSelectedCodes((prev) => new Set(prev).add(prefCode))
        addPrefecture(prefCode, prefName)
      } else {
        setSelectedCodes((prev) => {
          const next = new Set(prev)
          next.delete(prefCode)
          return next
        })
        removePrefecture(prefCode)
      }
    },
    [addPrefecture, removePrefecture]
  )

  return (
    <div className={styles.container}>
      {loading && <p className={styles.loading}>読み込み中...</p>}
      {error && <p className={styles.error}>エラー: {error}</p>}
      {!loading && !error && (
        <div className={styles.grid}>
          {prefectures.map((pref) => {
            const styleIndex = styleIndexMap.get(pref.prefCode)
            const style =
              styleIndex !== undefined ? getSeriesStyle(styleIndex) : undefined
            return (
              <label
                key={pref.prefCode}
                className={`${styles.label} ${selectedCodes.has(pref.prefCode) ? styles.selected : ''}`}
              >
                <input
                  type="checkbox"
                  className={styles.srOnly}
                  name="prefecture"
                  checked={selectedCodes.has(pref.prefCode)}
                  onChange={(e) =>
                    handleChange(pref.prefCode, pref.prefName, e.target.checked)
                  }
                />
                <span
                  className={styles.legendIcon}
                  style={{ color: style?.color ?? '#ccc' }}
                >
                  <span className={styles.legendLine} />
                  {style && (
                    <span
                      className={styles.marker}
                      data-symbol={style.symbol}
                    />
                  )}
                </span>
                {pref.prefName}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
