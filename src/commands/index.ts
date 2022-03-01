import type { ExtensionModule } from './../core'
import ExtractCommand from './extract'
import ConfigLocaleCommand from './configLocalePaths'

export * from './commands'

export default <ExtensionModule> function (ctx) {
    ExtractCommand(ctx)
    ConfigLocaleCommand(ctx)
}
