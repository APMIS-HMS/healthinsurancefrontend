import {writeFile} from 'fs';
import {argv} from 'yargs';

// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = argv.environment;
const targetPath = `./src/environments/environment.${environment}.ts`;
let isProd = false;
if (environment === 'prod.huwe' || environment === 'prod.lagos' ||
    environment === 'prod.nhis') {
  isProd = true;
}

let envConfigFile = `
export const environment = {
  production: ${isProd},
  platform: "${process.env.LASHMA_PLATFORM_NAME}",
  logo: "${process.env.LASHMA_LOGO}",
  secondary_logo: "",
  title: "${process.env.LASHMA_TITLE}",
  primary-color: "${process.env.LASHMA_TITLE_TAB_COLOR}",
  background-color: "${process.env.LASHMA_BACKGROUND_COLOR}"
};
`;
if (environment === 'prod.huwe') {
  envConfigFile = `
  export const environment = {
    production: ${isProd},
    platform: "${process.env.HUWE_PLATFORM_NAME}",
    logo: "${process.env.HUWE_LOGO}",
    secondary_logo: "",
    title: "${process.env.HUWE_TITLE}",
    primary-color: "${process.env.HUWE_TITLE_TAB_COLOR}",
    background-color: "${process.env.HUWE_BACKGROUND_COLOR}"
  };
  `;
} else if (environment === 'prod.lagos') {
  envConfigFile = `
  export const environment = {
    production: ${isProd},
    platform: "${process.env.LASHMA_PLATFORM_NAME}",
    logo: "${process.env.LASHMA_LOGO}",
    title: "${process.env.LASHMA_TITLE}",
    primary-color: "${process.env.LASHMA_TITLE_TAB_COLOR}",
    background-color: "${process.env.LASHMA_BACKGROUND_COLOR}"
  };
  `;
} else if (environment === 'prod.nhis') {
  envConfigFile = `
  export const environment = {
    production: ${isProd},
    platform: "${process.env.NHIS_PLATFORM_NAME}",
    logo: "${process.env.NHIS_LOGO}",
    title: "${process.env.NHIS_TITLE}",
    primary-color: "${process.env.NHIS_TITLE_TAB_COLOR}",
    background-color: "${process.env.NHIS_BACKGROUND_COLOR}"
  };
  `;
}

writeFile(targetPath, envConfigFile, function(err) {
  if (err) {
  }
});
