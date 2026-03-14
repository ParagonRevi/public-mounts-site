import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'


function App() {
  const [mounts, setMounts] = useState([])

  // ✅ 1. Сначала объявляем функцию
  async function fetchMounts() {
    const { data, error } = await supabase
        .from('gds_mounts')
        .select('mount_id, data, advance_data, gear_data')

    if (error) console.error('Error:', error)
    else setMounts(data)
  }

  // ✅ 2. Потом используем её в useEffect
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMounts()
  }, []) // Пустой массив зависимостей = запуск только при монтировании

  return (
      <div>
        <h1>Mounts Database</h1>
        <pre>{JSON.stringify(mounts, null, 2)}</pre>
      </div>
  )
}

export default App