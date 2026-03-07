import { useCallback, useState } from 'react'

import { usePopulationContext } from '../../hooks/usePopulationContext'
import { usePrefectures } from '../../hooks/usePrefectures'
import styles from './PrefectureSelector.module.css'

export const PrefectureSelector = () => {
  const { addPrefecture, removePrefecture } = usePopulationContext()
  const { prefectures, loading, error } = usePrefectures()
  const [selectedCodes, setSelectedCodes] = useState<Set<number>>(new Set())

  const handleChange = useCallback(
    (prefCode: number, prefName: string, checked: boolean) => {
      setSelectedCodes((prev) => {
        const next = new Set(prev)
        if (checked) {
          next.add(prefCode)
          addPrefecture(prefCode, prefName)
        } else {
          next.delete(prefCode)
          removePrefecture(prefCode)
        }
        return next
      })
    },
    [addPrefecture, removePrefecture]
  )

  return (
    <div className={styles.container}>
      {loading && <p className={styles.loading}>読み込み中...</p>}
      {error && <p className={styles.error}>エラー: {error}</p>}
      {!loading && !error && (
        <div className={styles.grid}>
          {prefectures.map((pref) => (
            <label key={pref.prefCode} className={styles.label}>
              <input
                type="checkbox"
                name="prefecture"
                checked={selectedCodes.has(pref.prefCode)}
                onChange={(e) =>
                  handleChange(pref.prefCode, pref.prefName, e.target.checked)
                }
              />
              {pref.prefName}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
