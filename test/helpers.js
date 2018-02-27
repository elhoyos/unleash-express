const { UnleashExpress } = require('../lib/unleash-express');
const express = require('express');
const supertest = require('supertest');
const cookieParser = require('cookie-parser');

class Unleash {
    constructor(features = {}) {
        this.features = features;
    }

    experiment(feature) {
        const feat = this.features[feature];
        let variant;

        if (feat.variants) {
            feat.currentVariantIndex = feat.currentVariantIndex || 0;
            variant = feat.variants[feat.currentVariantIndex];
            if (feat.currentVariantIndex + 1 < feat.variants.length) {
                feat.currentVariantIndex++;
            }
        } else {
            variant = feat.variant;
        }

        return variant;
    }
}

function setupApp(options = {}) {
    const unleash = options.unleash || new Unleash();
    const unleashExpress = new UnleashExpress(unleash);

    const app = express();
    app.use(cookieParser());
    app.use(unleashExpress.middleware());
    app.use((err, req, res, next) => {
        console.error(err.stack);
    });

    const request = supertest;

    return {
        app,
        request,
    }
}

module.exports.Unleash = Unleash;
module.exports.setupApp = setupApp;