const { loadJs } = import('../util')

const loadBimface = async () => {
  if (window.BimfaceSDKLoader) return window.BimfaceSDKLoader
  try {
    await loadJs(
      'https://static.bimface.com/api/BimfaceSDKLoader/BimfaceSDKLoader@latest-release.js'
    )
    return window.BimfaceSDKLoader
  } catch (e) {
    return undefined
  }
}

export default loadBimface
