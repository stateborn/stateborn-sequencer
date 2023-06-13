import envVarsList from './env-vars-list';
export const getProperty = (propertyName: string): string => {
    const value: string =  <string>process.env[`${propertyName}`];
    if (value !== undefined) {
        return value;
    } else {
        const defaultValue =  Object(envVarsList)[propertyName];
        if (defaultValue) {
            console.warn(`ENV VAR ${propertyName} not set, returning default value ${propertyName}=${Object(envVarsList)[propertyName]}`)
            return defaultValue;
        } else {
            throw new Error(`Required ENV VAR ${propertyName} not set! Please set it and restart the application!`);
        }
    }
};

export const getNumberProperty = (propertyName: string): number => {
    const value: number =  Number(process.env[`${propertyName}`]);
    if (value !== undefined) {
        return value;
    } else {
        throw new Error(`Fatal: number based env var ${propertyName} not set!`);
    }
};

export const getBooleanProperty = (propertyName: string): boolean => {
    return JSON.parse(process.env[`${propertyName}`]!);
};

export const getArrayProperty = (propertyName: string): string[] => {
    return JSON.parse(<string>process.env[`${propertyName}`]);
};
