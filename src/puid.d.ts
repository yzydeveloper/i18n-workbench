
declare module 'puid' {
    export interface PuidConstructor {
        generate(): string
    }
    export default class {
        // new(options: boolean | string): object
        constructor(options: boolean | string)
        generate(): string
    }
}
