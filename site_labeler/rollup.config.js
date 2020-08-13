import {
    chromeExtension,
    simpleReloader,
} from 'rollup-plugin-chrome-extension';
import del from 'rollup-plugin-delete';

/** @noinspection */
export default {
    input: ['app/manifest.json'],
    output: {
        dir: 'build',
        format: 'esm',
    },
    plugins: [
        chromeExtension(),
        simpleReloader(),
        del({targets: 'build/*'})
    ],
}
