export interface Pingable {
    ping(hostname: string): void

    getAddrByName(name: string): Promise<string>
}
