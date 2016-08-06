import * as angular from 'angular';
import { IAppOptions, IJoystickOptions } from './IAppOptions';

let app = angular.module('app', []);

// the app config settings
app.value('appOptions', <IAppOptions>{
    joystickOptions: null
});

app.run(['APP_CONFIG', 'appOptions', (config, appOptions: IAppOptions) => {
    // set up appOptions using config
    let joystickOptions = <IJoystickOptions>config.joystick;
    appOptions.joystickOptions = joystickOptions;
}]);
