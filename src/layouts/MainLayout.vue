<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">
        <q-btn
          to="/camera"
          flat
          round
          icon="eva-camera-outline"
          size="18px"
          dense
          class="large-screen-only q-mr-sm"
        />
        <q-separator vertical spaced class="large-screen-only" />
        <q-toolbar-title class="text-grand-hotel text-bold">
          Quasargram
        </q-toolbar-title>
        <q-btn
          to="/"
          flat
          round
          icon="eva-home-outline"
          size="18px"
          dense
          class="large-screen-only"
        />
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white " bordered>
      <transition
        appear
        enter-active-class="animated fadeIn animate__delay-4s"
        leave-active-class="animated fadeOut"
      >
        <div class="banner-container bg-primary" v-if="showAppInstallBanner">
          <div class="constrain">
            <q-banner inline-actions dense class="bg-primary text-white">
              <template #avatar>
                <q-avatar
                  icon="eva-camera-outline"
                  color="white"
                  text-color="grey-10"
                  font-size="22px"
                />
              </template>
              Install Quasargram?
              <template #action>
                <q-btn
                  flat
                  label="Yes"
                  dense
                  class="q-px-sm"
                  @click="installApp"
                />
                <q-btn
                  flat
                  label="Later"
                  dense
                  class="q-px-sm"
                  @click="showAppInstallBanner = false"
                />
                <q-btn
                  flat
                  label="Never"
                  dense
                  class="q-px-sm"
                  @click="neverShowAppInstallBanner"
                />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>
      <q-tabs
        class="text-grey-10 small-screen-only"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab icon="eva-home-outline" to="/" exact />
        <q-route-tab icon="eva-camera-outline" to="/camera" exact />
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
let defferedPrompt;
export default {
  name: 'MainLayout',
  data() {
    return {
      showAppInstallBanner: false,
    };
  },
  methods: {
    installApp() {
      this.showAppInstallBanner = false;

      defferedPrompt.prompt();

      defferedPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.neverShowAppInstallBanner();
        } else {
        }
      });
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set('neverShowAppInstallBanner', true);
    },
  },
  mounted() {
    const showBanner = this.$q.localStorage.getItem(
      'neverShowAppInstallBanner'
    );

    if (!showBanner) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        defferedPrompt = e;
        this.showAppInstallBanner = true;
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.q-footer .q-tab__icon {
  font-size: 30px;
}

.q-toolbar {
  @media (min-width: $breakpoint-sm-min) {
    height: 77px;
  }
}

.q-toolbar__title {
  font-size: 30px;
  @media (max-width: $breakpoint-xs-max) {
    text-align: center;
  }
}
</style>
