/**
 * 获取state数据
 */

export const singer = state => state.singer // 歌手详情页单个歌手数据

export const playing = state => state.playing // 是否播放
export const fullScreen = state => state.fullScreen // 播放器展开收起
export const playlist = state => state.playlist // 歌曲播放列表
export const sequenceList = state => state.sequenceList // 歌曲顺序列表
export const mode = state => state.mode // 播放模式
export const currentIndex = state => state.currentIndex // 当前播放歌曲索引
export const currentSong = (state) => { // 当前播放歌曲
  return state.playlist[state.currentIndex] || {}
}
