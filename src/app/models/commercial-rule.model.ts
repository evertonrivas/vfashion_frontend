import { CustomerCurve } from "./system.enum"

export interface CommercialRule {
    id:CustomerCurve
    frequency:number,
    liquidity:number,
    injury:number,
    mix:number,
    volume:number[]
}
