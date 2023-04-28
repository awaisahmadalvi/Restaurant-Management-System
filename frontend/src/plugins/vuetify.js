import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import colors from 'vuetify/lib/util/colors'
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {

            dark: {
                primary: colors.deepOrange.lighten1, //Theme
                text: colors.grey.lighten5, //Theme
                // primary: "#21CFF3",
                // accent: "#FF4081",
                accent: colors.teal.lighten1,
                secondary: "#21dc79",
                success: "#86af3f",
                // info: "#f34fc6",
                info: colors.deepPurple,
                warning: "#FB8C00",
                error: "#FF5252",
                background: '#262837', //Theme
                danger: colors.red.accent4, //Theme
                title: '#1F1D2C',
                neutral: colors.grey.darken1,
            },
            light: {
                primary: colors.deepOrange.lighten2, //Theme
                text: colors.grey.darken4, //Theme
                // primary: "#22daff",
                // accent: "#ff6b99",
                accent: colors.teal.lighten2,
                secondary: "#26ff8c",
                success: "#a5d64c",
                // info: "#ff53d0",
                info: colors.deepPurple.lighten2,
                warning: "#ff8e00",
                error: "#ff5252",
                background: colors.indigo.lighten5,
                danger: colors.red.accent3, //Theme
                title: colors.blueGrey.darken1,
                neutral: colors.grey.base,
            }
            // light: {
            //     primary: colors.deepOrange.lighten2,
            //     secondary: '#424242',
            //     accent: '#82B1FF',
            //     // error: colors.red.accent1,
            //     error: '#FF5252',
            //     info: '#2196F3',
            //     success: '#4CAF50',
            //     warning: '#FFC107',
            //     // background: colors.pink,
            // },
            // dark: {
            //     primary: '#1976D2',
            //     secondary: '#424242',
            //     accent: '#82B1FF',
            //     error: '#FF5252',
            //     info: '#2196F3',
            //     success: '#4CAF50',
            //     warning: '#FFC107',
            //     anchor: '#8c9eff',

            // },
        },
    },
});
