import * as cli from '../lib/cli/pingo-ts'

function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        throw new Error("argument error.")
    }

    let app = new cli.PingoTs
    app.apply(args[0])
}

main();