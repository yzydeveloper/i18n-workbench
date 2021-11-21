import Config from './../core/Config'
export class Commands {
    public static extract = `${Config.extensionName}.extract`
    public static transform = `${Config.extensionName}.transform`
    public static config_locales = `${Config.extensionName}.config-locales`
    public static config_locales_auto = `${Config.extensionName}.config-locales-auto`
}
