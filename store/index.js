export const state = () => ({
    search_keywords: '',
    counters: {
        "total_jokes": 0,
        "pending_jokes": 0,
        "deleted_jokes": 0,
        "comments": 0,
        "users": 0,
        "visits": 0
        },
    tags: {},
})

export const getters = {
    isAuthenticated(state) {
        return state.auth.loggedIn;
    },
   
    loggedInUser(state) {
        return state.auth.user;
    },
};

export const mutations = {
    async setCounters(state, counters) {
		state.counters = counters;
	},
	async setTags(state, tags) {
		state.tags = tags;
    },
    async setSearchKeyword(state, keyword) {
		state.search_keywords = keyword;
    },  
}

export const actions ={
    async nuxtServerInit({ commit }){
        commit('setTags', await this.$f6snyApi.getTags());
    },
    async updateCounters({commit}){
        commit('setCounters', await this.$f6snyApi.getCounters());
    }
}