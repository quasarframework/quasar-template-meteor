

// This defines all the collections, publications and methods that the application provides
// as an API to the client.
import './register-api.js';

import { setMinimumBrowserVersions } from 'meteor/modern-browsers';

setMinimumBrowserVersions({
    chrome: 45,
    firefox: 44,
    edge: 17,
    ie: Infinity,
    mobileSafari: [10, 3],
    opera: 32,
    safari: [11, 1],
    electron: [0, 36],
}, 'service workers');
