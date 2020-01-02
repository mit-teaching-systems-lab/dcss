const postcssEnvFunction = require('postcss-env-function');
const DCSS_BRAND_LOGO =
    process.env.DCSS_BRAND_LOGO || '/images/MIT-TSL-Logo-Icons.png';
module.exports = {
    plugins: [
        postcssEnvFunction({
            importFrom: [
                {
                    environmentVariables: {
                        '--DCSS_BRAND_LOGO': `url("${DCSS_BRAND_LOGO}")`
                    }
                }
            ]
        })
    ]
};
