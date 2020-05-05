/*
    1.定义state：存放状态（即数据）
 */
import {playMode} from "common/js/config";
import {initialSearch,initialPlay,initialFavorite} from "common/js/cache";

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: [],
  searchHistory: initialSearch(),
  playHistory: initialPlay(),
  favorite: initialFavorite()
}

export default state
