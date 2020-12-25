// * with help of Alexander Lichter, Apr 18, 2020, https://blog.lichter.io/posts/nuxt-api-call-organization-and-decoupling/
export default $axios => () => ({
    index() {
      // Dummy function, no use
      return $axios.$get('/posts')
    },
  
    // ! Jokes Calls #
    // ! #############
    getJokes(start){
        return $axios.$get(`/jokes?_start=${start}`)
    },

    getJokeBySlug(slug){
        return $axios.$get(encodeURI(`/jokes?slug=${slug}`))
    },

    getJokeByID(id){
        return $axios.$get(`/jokes/${id}`)
    },

    searchJokesByKeywords(keywords, start){
        return $axios.$get(encodeURI(`/jokes?_q=${keywords}&_start=${start}`))
    },

    getPendingJokes(){
        return $axios.$get(`/jokes/pending`)
    },

    postJoke(joke){
        return $axios.$post(`/jokes`,joke);
    },


    // ! Tags Calls #
    // ! ############
    getTags(){
        return $axios.$get(`/tags`);
    },

    getTagJokesBySlug(slug, start){
        return $axios.$get(encodeURI(`/jokes?tags.slug=${slug}&_start=${start}`));
    },

    getTagBySlug(slug){
        return $axios.$get(encodeURI(`/tags?slug=${slug}`));
    },


    // ! Commets Calls #
    // ! ###############
    getLatestComments(){
        return $axios.$get('/globalcalls/getLatestComments')
    },

    getComment(){
        return $axios.$get('/globalcalls/getLatestComments')
    },

    getComments(id){
        console.log(id)
        return $axios.$get(`/comments/jokes:${id}`)
        
    },

    postComment(){
        return $axios.$get('/globalcalls/getLatestComments')
    },


    // ! Vote Calls #
    // ! ############
    vote(id, value){
        return $axios.$post(`/jokes/${id}/vote`,{"data": {"value": `${value}`}})
    },
    
    // ! Users Calls #
    // ! #############
    getUserByUsername(username){
        return $axios.$get(encodeURI(`/users-permissions/username/${ username }`))
    },


    // ! Global Calls #
    // ! #############
    getCounters(){
        return $axios.$get('/globalcalls/counters')
    }
})