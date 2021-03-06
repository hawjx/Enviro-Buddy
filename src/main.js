import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Routescomp from './routes.js'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import firebase from "firebase/app";
import "firebase/auth";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
    // Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(VueRouter)
Vue.config.productionTip = false

const myRouter = new VueRouter({
    routes: Routescomp,
    mode: 'history',
})

firebase.getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    })
};


myRouter.beforeEach(async(to, from, next) => {
    const noAuth = to.matched.some(record => record.meta.noAuth);

    let currUser = await firebase.getCurrentUser()

    if (!noAuth && currUser) {
        if (!currUser.emailVerified) {
            alert("Please verify your email")
            next({ path: "/login" })
        } else {
            next()
        }
    } else if (!noAuth && !currUser) {
        alert("Please signup or Login first")
        next({ path: "/" })
    } else if (noAuth && currUser) {
        if (currUser.emailVerified) {
            alert("Please logout first")
            next({ path: '/mkt-category' })
        } else {
            next()
        }
    } else {
        next()
    }
})


new Vue({
    render: h => h(App),
    router: myRouter
}).$mount('#app')