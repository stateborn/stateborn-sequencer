import ENV_VARS_LIST from './default-env-vars';
export const getProperty = (propertyName: string): string => {
    const value: string =  <string>process.env[`${propertyName}`];
    if (value !== undefined) {
        return value;
    } else {
        const defaultValue =  Object(ENV_VARS_LIST)[propertyName];
        if (defaultValue) {
            console.warn(`ENV VAR ${propertyName} not set, returning default value ${propertyName}=${Object(ENV_VARS_LIST)[propertyName]}`)
            return defaultValue;
        } else {
            throw new Error(`Required ENV VAR ${propertyName} not set! Please set it and restart the application!`);
        }
    }
};

export const getBooleanProperty = (propertyName: string): boolean => {
    return getProperty(propertyName) === 'true';
};