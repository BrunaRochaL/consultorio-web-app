import { useEffect, useState } from 'react'

import { formatTime } from '@/utils/common/helpers'

const useFormatTime = (locale: string = 'pt-BR'): string => {
  const [time, setTime] = useState<string>(formatTime(new Date(), locale))

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime(new Date(), locale))
    }, 1000)

    return () => clearInterval(timer)
  }, [locale])

  return time
}

export default useFormatTime
