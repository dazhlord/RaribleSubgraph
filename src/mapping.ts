import { Transfer } from '../generated/Rarible/Rarible'
import { RaribleOwner, RaribleBalance } from '../generated/schema'
import { BigInt, Address } from "@graphprotocol/graph-ts"

export function handleTransfer(event: Transfer): void {
    let id = event.transaction.hash.toHex()
    let rarible = RaribleOwner.load(id)
    if (rarible == null) {
        rarible = new RaribleOwner(id)
    }
    rarible.tokenId = event.params.tokenId
    rarible.owner = event.params.to
    rarible.contract = event.address
    rarible.save()

    let previousOwner = event.params.from.toHex()
    let raribleBalance = RaribleBalance.load(previousOwner)
    if (raribleBalance != null) {
        if (raribleBalance.amount > BigInt.fromI32(0)) {
            raribleBalance.amount = raribleBalance.amount - BigInt.fromI32(1)
        }
        raribleBalance.save()
    } 
    
    let newOwner = event.params.to.toHex()
    let newRaribleBalance = RaribleBalance.load(newOwner)
    if (newRaribleBalance == null) {
        newRaribleBalance = new RaribleBalance(newOwner)
        newRaribleBalance.amount = BigInt.fromI32(0)
    }
    newRaribleBalance.amount = newRaribleBalance.amount + BigInt.fromI32(1)
    newRaribleBalance.save()
}