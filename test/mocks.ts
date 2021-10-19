function makeTx(address: string) {
  return {
    txid: '98c4fb85c7344c4b889fd2982127c1f66388311d16f07005c07acf7721c2087b',
    vin: [
      {
        prevout: {
          scriptpubkey_address: address,
        }
      }
    ]
  }
}

export const YES_VOTE_TXS = [
  makeTx('31tXY8LMEcc3YzWwpFQj7ZGYE2U2BM1kk4'),
]

export const NO_VOTE_TXS = [
  makeTx('1LoPvZSimetbef4Lg28ivi9hnEek6Fr9Z4'),
]
