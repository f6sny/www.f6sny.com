// * with help of Alexander Lichter, Apr 18, 2020, https://blog.lichter.io/posts/nuxt-api-call-organization-and-decoupling/
export default $axios => () => ({
    index() {
      // Dummy function, no use
      return $axios.$get('/posts')
    },
  
    // ! Jokes Calls #
    // ! #############
    getJokes(start){
        console.log(`Getting jokes starting from ${start}`)
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


    // ! Pages Calls #
    // ! #############
    getPages(){
        return $axios.$get(`/pages`)
    },

    getPageBySlug(slug){
        return $axios.$get(encodeURI(`/pages?slug=${slug}`))
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
        return $axios.$get(`/comments/jokes:${id}?_sort=id:desc`)
        
    },

    postComment(comment, joke_id){
        return $axios.$post(`/comments/jokes:${joke_id}`,comment)
    },


    // ! Vote Calls #
    // ! ############
    vote(id, value){
        return $axios.$post(`/jokes/${id}/vote`,{"data": {"value": `${value}`}})
    },
    

    // ! Users Calls #
    // ! #############
    getCurrentUser(){
        return $axios.$get(`/users/me`)
    },

    getUserByUsername(username){
        return $axios.$get(encodeURI(`/users?username=${ username }`))
    },

    getUserJokesByID(user_id, start){
        return $axios.$get(encodeURI(`/jokes?author=${ user_id }&_sort=id:desc&_start=${start}`))
    },

    getUserCommentsByID(user_id){
        return $axios.$get(encodeURI(`/users/${ username }/comments`))
    },

    updateUserData(user_id, user_data){
        return $axios.$put(`/users/${user_id}`, user_data)
    },

    forgotPassword(email){
        return $axios.$post(`/auth/forgot-password`, { email : email, } )
    },

    resetPassword(data){
        return $axios.$post(`/auth/reset-password`, data )
    },


    // ! Global Calls #
    // ! #############
    getCounters(){
        return $axios.$get('/globalcalls/counters')
    }
})