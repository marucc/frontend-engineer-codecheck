import { useCallback, useMemo } from 'react'

import { usePopulationContext } from '../../hooks/usePopulationContext'
import { usePrefectures } from '../../hooks/usePrefectures'
import { getSeriesStyle } from '../../utils/seriesStyles'
import styles from './PrefectureSelector.module.css'

export const PrefectureSelector = () => {
  const {
    populations,
    selectedCodes,
    loadingCodes,
    error: populationError,
    addPrefecture,
    removePrefecture,
  } = usePopulationContext()
  const { prefectures, loading, error: prefecturesError } = usePrefectures()

  const styleIndexMap = useMemo(() => {
    const map = new Map<number, number>()
    populations.forEach((p) => map.set(p.prefCode, p.styleIndex))
    return map
  }, [populations])

  const handleChange = useCallback(
    (prefCode: number, prefName: string, checked: boolean) => {
      if (checked) {
        addPrefecture(prefCode, prefName)
      } else {
        removePrefecture(prefCode)
      }
    },
    [addPrefecture, removePrefecture]
  )

  return (
    <div className={styles.container}>
      {loading && <p className={styles.loading}>読み込み中...</p>}
      {prefecturesError && (
        <p className={styles.error}>エラー: {prefecturesError}</p>
      )}
      {populationError && <p className={styles.error}>{populationError}</p>}
      {!loading && !prefecturesError && (
        <div className={styles.grid}>
          {prefectures.map((pref) => {
            const isSelected = selectedCodes.has(pref.prefCode)
            const isLoading = loadingCodes.has(pref.prefCode)
            const styleIndex = styleIndexMap.get(pref.prefCode)
            const style =
              styleIndex !== undefined ? getSeriesStyle(styleIndex) : undefined
            return (
              <label
                key={pref.prefCode}
                className={`${styles.label} ${isSelected ? styles.selected : ''}`}
              >
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  name="prefecture"
                  checked={isSelected}
                  disabled={isLoading}
                  onChange={(e) =>
                    handleChange(pref.prefCode, pref.prefName, e.target.checked)
                  }
                />
                {pref.prefName}
                {isLoading && (
                  <span className={styles.spinner} aria-label="読み込み中" />
                )}
                {style && (
                  <span
                    className={styles.legendIcon}
                    style={{ color: style.color }}
                  >
                    <span className={styles.legendLine} />
                    <span
                      className={styles.marker}
                      data-symbol={style.symbol}
                    />
                  </span>
                )}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
