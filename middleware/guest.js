export default function ({ store, redirect }) {
    if (this.$store.state.auth.loggedIn) {
    return redirect("/");
    }
   }
   