import { Transfer, Rarible } from '../generated/Rarible/Rarible'
import { RaribleOwner, RaribleBalance, TransferTrace } from '../generated/schema'
import { BigInt, log } from "@graphprotocol/graph-ts"

export function handleTransfer(event: Transfer): void {
    let id = event.params.tokenId.toHex()
    //let rarible = new RaribleOwner(id)
    let rarible = RaribleOwner.load(id)
    if (rarible == null) {
      rarible = new RaribleOwner(id)
    }
    rarible.tokenId = event.params.tokenId
    rarible.owner = event.params.to
    rarible.contract = event.address
    rarible.save()

    //collect the entities of transfer traces
    let transferEntity = new TransferTrace(event.transaction.hash.toHex())
    transferEntity.from = event.params.from
    transferEntity.to = event.params.to
    transferEntity.timestamp = event.block.timestamp
    transferEntity.save()

    //update the amount of the token hold by the owner "to"
    let contract = Rarible.bind(event.address)
    let raribleBalance = new RaribleBalance(event.params.to.toHex())
    let callResult = contract.try_balanceOf(event.params.to)
    if (callResult.reverted) {
        log.info("getBalanceOf reverted", [])
      } 
    raribleBalance.amount = callResult.value
    log.info('Update token balance: id: {}, address: {}, balance: {}', [event.params.to.toHex(), event.address.toString(), raribleBalance.amount.toString()]);  
    //raribleBalance.amount = contract.try_balanceOf(event.params.to).value
    raribleBalance.save()

    // let previousOwner = event.params.from.toHex()
    // let raribleBalance = RaribleBalance.load(previousOwner)
    // if (raribleBalance != null) {
    //     if (raribleBalance.amount > BigInt.fromI32(0)) {
    //         raribleBalance.amount = raribleBalance.amount - BigInt.fromI32(1)
    //     }
    //     raribleBalance.save()
    // } 
    
    // let newOwner = event.params.to.toHex()
    // let newRaribleBalance = RaribleBalance.load(newOwner)
    // if (newRaribleBalance == null) {
    //     newRaribleBalance = new RaribleBalance(newOwner)
    //     newRaribleBalance.amount = BigInt.fromI32(0)
    // }
    // newRaribleBalance.amount = newRaribleBalance.amount + BigInt.fromI32(1)
    // newRaribleBalance.save()
}
