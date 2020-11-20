<template>
  <b-modal id="userModal">
    <template #modal-title>Sign in or register</template>
    <template #modal-footer>
      <b-button type="submit" variant="warning">Register</b-button>
      <b-button variant="primary">Login</b-button>
      <b-button variant="secondary" @click="show = false">Close</b-button>
    </template>
    <form action="" method="post">
      <div class="modal-body">
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            type="email"
            class="form-control"
            name="email"
            id="email"
            aria-describedby="emailHelp"
            value=""
          />
          <small id="emailHelp" class="form-text text-muted"
            >We'll never share your email with anyone else.</small
          >
          <!-- @if(hasErrorFor('email'))
              <div class="invalid-feedback">
                {{ getErrorFor("email") }}
              </div>
              @endif -->
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            name="password"
            value=""
          />
          <!-- @if(hasErrorFor('password'))
              <div class="invalid-feedback">
                {{ getErrorFor("password") }}
              </div>
              @endif -->
        </div>

        <div class="form-group form-check">
          <input type="checkbox" class="form-check-input" id="rememberMe" />
          <label class="form-check-label" for="rememberMe">Remember Me</label>
        </div>
      </div>
    </form>
  </b-modal>
</template>
<script></script>
