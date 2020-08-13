import {
    chromeExtension,
    simpleReloader,
} from 'rollup-plugin-chrome-extension';

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
    ],
}
