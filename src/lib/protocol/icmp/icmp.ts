import * as protocol from '../protocol'
import * as pingable from '../pingable'

import * as dns from 'dns'

const raw = require("raw-socket");

export class Icmp extends protocol.Protocol implements pingable.Pingable {
    constructor() {
        super()
    }

    private _count: number = 0

    ping(hostname: string) {
        let addr = this.getAddrByName(hostname)
        let socket = this.createSocket()
        let interval = 1000

        addr.then((addr) => {
                setInterval(
                    () => this.pingAsync(socket, addr),
                    interval
                )
            }
        )
    }

    private createSocket(): object {
        let options = {
            protocol: raw.Protocol.ICMP,
        };
        let socket = raw.createSocket(options);

        socket.on("close", function () {
            console.log("socket closed");
            process.exit(-1);
        });
        socket.on("error", function (error: any) {
            console.log("error: " + error.toString());
            process.exit(-1);
        });

        //get echo reply set.
        socket.on("message", function (buffer: Buffer, source: string) {
            let recievedUnixtime: number = new Date().getTime()
            const pseudo = 20 + 8
            let sendUnixtime: number = +buffer.slice(pseudo, pseudo + 13)
            let icmpSeq: number = +buffer.slice(pseudo + 13, buffer.length)

            console.log(buffer.length + " bytes from " + source + " : " +
                "icmp_seq=" + icmpSeq.toString() + ", " +
                "time=" + (recievedUnixtime - sendUnixtime) + "ms")
        });
        return socket
    }

    async getAddrByName(name: string): Promise<string> {
        const dnsPromise = dns.promises
        const lookupAddress = await dnsPromise.lookup(name)
        return lookupAddress.address
    }

    private async pingAsync(socket: any, addr: string) {
        await this.sendEchoRequest(socket, addr);
    }

    private sendEchoRequest(socket: any, addr: string): Promise<void> {
        let sendUnixtime = new Date().getTime()
        let dateData = new TextEncoder().encode(sendUnixtime.toString())
        let default8BytesData = new Uint8Array(
            [
                0x08, 0x00, 0x00, 0x00, 0x00, 0x01, 0x0a, 0x09,
            ]
        )
        this._count += 1
        let countData = new TextEncoder().encode(this._count.toString())
        let concatArray = new Uint8Array(
            [...default8BytesData, ...dateData, ...countData]
        )
        let buffer = Buffer.from(concatArray)
        raw.writeChecksum(buffer, 2, raw.createChecksum(buffer));

        return new Promise<void>(
            (resolve, reject) => {
                socket.send(buffer, 0, buffer.length, addr, function (error: any) {
                    if (error) {
                        console.log(error.toString());
                        reject(new Error("raw socket error"));
                    } else {
                        resolve();
                    }
                });
            }
        )
    }
}