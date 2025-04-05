import { IBE } from "./ibe";

async function main() {
    const pkg = await IBE.getPkg()
    console.log("pkg", pkg);
    const answer = await IBE.setPkg(pkg.p, pkg.q, pkg.n)
    console.log("setPkg", answer);
    const message = "Hello world!"
    const table = "test_table"
    const id = "test_id"
    const cle = await IBE.genererCles(table, id)
    const c = await IBE.chiffrer(message, cle.a)
    console.log("chiffrer", c);
    const d = await IBE.dechiffrer(c.message_chiffre, cle.r, cle.a)
    console.log("dechiffrer", d);
}


main()