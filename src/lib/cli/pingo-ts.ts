import * as icmp from '../protocol/icmp/icmp'
import * as pingable from '../protocol/pingable'

export class PingoTs {
    constructor() {
        // options
    }

    apply() {
        let i = new icmp.Icmp
        const domain = "www.google.com"
        this.ping(i, domain);
    }

    private ping(p: pingable.Pingable, hostname: string) {
        p.ping(hostname);
    }
}