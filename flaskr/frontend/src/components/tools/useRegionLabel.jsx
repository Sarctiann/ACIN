import { useMemo } from 'react'

const useRegionLabel = () => {
  
  const RegionLabel = useMemo(() => {
    return require(`../../languages/${window.language}.json`)
  })

  return RegionLabel
}

export default useRegionLabel