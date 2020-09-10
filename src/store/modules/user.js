const getDefaultState = () => {
  return {
    userInfo: null,
    accessToken: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_USERINFO(state, userInfo) {
    if (userInfo != null) {
      state.accessToken = userInfo.access_token
      state.userInfo = userInfo.profile
    } else {
      state.accessToken = ''
      state.userInfo = null
    }
  }
}

const actions = {
  SetUserInfo({ commit }, userInfo) {
    commit('SET_USERINFO', userInfo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

