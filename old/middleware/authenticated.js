export default function ({ store, redirect }) {
    // If the user is not authenticated
    // it is not linked with the current authentication module
    if (!this.$store.state.auth.loggedIn) {
      //return redirect('/')
    }
  }