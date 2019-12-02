import { Application } from 'spectron';

import * as path from 'path';

var electronPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron');
var appPath = path.join(__dirname, '..');


describe('Main window', () => {
    let app: Application = new Application({
        path: electronPath,
        args: [appPath]
    });;

    beforeEach(function () {
        return app.start();
    });

    afterEach(function () {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    it('opens the window', async () => {
        await app.client.waitUntilWindowLoaded()
        console.log(app)
    });


});