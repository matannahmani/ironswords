/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import webpack from 'webpack';

/** @type {import("next").NextConfig} */
const config = {
    webpack: (webpackConfig, { webpack }) => {
        webpackConfig.plugins.push(
            // Remove node: from import specifiers, because Next.js does not yet support node: scheme
            // https://github.com/vercel/next.js/issues/28774
            new webpack.NormalModuleReplacementPlugin(
                /^node:/,
                (resource : any) => {
                    resource.request = resource.request.replace(/^node:/, '');
                },
            ),
        );

        return webpackConfig;
    },
};

export default config;
