import { createApp } from 'vue'
import './css/style.css'
import App from './App.vue'

import router from './routing/router';

const app = createApp( App );
app.use( router );
app.mount( '#app' );