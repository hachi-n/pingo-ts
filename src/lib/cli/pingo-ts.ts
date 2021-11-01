import * as icmp from '../protocol/icmp/icmp'
import * as pingable from '../protocol/pingable'

export class PingoTs {
    constructor() {
        // options
    }

    apply(hostname: string) {
        let i = new icmp.Icmp
        this.ping(i, hostname);
    }

    private ping(p: pingable.Pingable, hostname: string) {
        p.ping(hostname);
    }
}