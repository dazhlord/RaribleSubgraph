import { Transfer } from '../generated/Rarible/Rarible'
import { RaribleOwner } from '../generated/schema'

export function handleTransfer(event: Transfer): void {
    let id = event.params.tokenId.toHex()
    let rarible = RaribleOwner.load(id)
    if (rarible == null) {
        rarible = new RaribleOwner(id)
    }
    rarible.owner = event.params.to
    rarible.save()
}