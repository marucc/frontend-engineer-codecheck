import { Link } from 'react-router-dom'

import styles from './NotFound.module.css'

export const NotFound = () => {
  return (
    <div className={styles.container}>
      <h1>ページが見つかりません</h1>
      <p>お探しのページは存在しないか、移動した可能性があります。</p>
      <Link to="/">トップへ戻る</Link>
    </div>
  )
}
