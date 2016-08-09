import './main/MainCtrl';
import './config/ConfigCtrl';
import './joystick/JoystickDirective';

import { IHttpService } from 'angular';

deferredBootstrapper.bootstrap({
    element: document.body,
    module: 'app',
    resolve: {
        APP_CONFIG: ['$http', function ($http: IHttpService) {
            return $http.get('/api/config');
        }]
    }
});
