export enum ExtractionScore {
    MustInclude,
    ShouldInclude,
    None,
    ShouldExclude,
    MustExclude
}

export abstract class ExtractionRule {
    abstract name: string

    abstract shouldExtract(str: string): ExtractionScore | undefined
}
