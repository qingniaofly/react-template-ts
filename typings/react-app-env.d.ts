/// <reference types="node" />
/// <reference types="react-dom" />

declare namespace NodeJS {
    interface ProcessEnv {/* eslint-disable-line */
        readonly NODE_ENV: "development" | "production" | "test"
        readonly PUBLIC_URL: string
        readonly HTTPS: boolean
    }
}

declare module "*.bmp" {
    const src: string
    export default src
}

declare module "*.gif" {
    const src: string
    export default src
}

declare module "*.jpg" {
    const src: string
    export default src
}

declare module "*.jpeg" {
    const src: string
    export default src
}

declare module "*.png" {
    const src: string
    export default src
}

declare module "*.webp" {
    const src: string
    export default src
}

type SvgrComponent = React.StatelessComponent<React.SVGAttributes<SVGElement>>
declare module "*.svg" {
    const content: SvgrComponent
    export default content
}

declare module "*.module.css" {
    const classes: { [key: string]: string }
    export default classes
}

declare module "*.module.scss" {
    const classes: { [key: string]: string }
    export default classes
}

declare module "*.module.sass" {
    const classes: { [key: string]: string }
    export default classes
}
