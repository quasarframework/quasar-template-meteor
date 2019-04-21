
import { Stars } from '../lib/collections.js';


/* permissions (thanks to ongoworks:security) */
    Security.permit(['insert', 'update','remove'])
        .collections([Stars]).allowInClientCode();

