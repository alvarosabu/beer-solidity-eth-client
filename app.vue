<script setup>
import IconEthereum from '~icons/mdi/ethereum'
import IconLoading from '~icons/mdi/loading'
import { ethers } from 'ethers'
import { useStaggered } from './composables/useStaggered'

import { abi } from './config/beer-portal.json'
const currentAccount = ref('')
const contractAddress = '0x2B019b87EF85EC74C404BFe527bbB201772865dD'
const beerPortalContract = ref(null)
let provider
const contractABI = abi
const beers = ref([])
const beerCount = ref(0)
const message = ref('')
const totalBalance = ref(0)
const isMinning = ref(false)

const { beforeEnter, enter, leave } = useStaggered(600)

function checkIfWalletIsConnected() {
  /*
   * First make sure we have access to window.ethereum
   */
  const { ethereum } = window

  if (!ethereum) {
    console.log('Make sure you have metamask!')
    return
  } else {
    console.log('We have the ethereum object', ethereum)
  }
}

async function checkAuthorization() {
  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    console.log({ accounts })

    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account:', account)
      currentAccount.value = account
    } else {
      console.log('No authorized account found')
    }
  } catch (error) {
    console.log(error)
  }
}

async function connectWallet() {
  try {
    const { ethereum } = window

    if (!ethereum) {
      alert('Get MetaMask!')
      return
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

    console.log('Connected', accounts[0])
    currentAccount.value = accounts[0]
  } catch (error) {
    console.log(error)
  }
}

async function getSmartContract() {
  try {
    provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    beerPortalContract.value = new ethers.Contract(
      contractAddress,
      contractABI,
      signer,
    )

    await getTotalBeers()
    await getAllBeers()
    await getTotalBalance()
  } catch (error) {
    console.error(error)
  }
}

async function getTotalBeers() {
  let count = await beerPortalContract.value.getTotalBeers()
  beerCount.value = count.toNumber()
}

async function getAllBeers() {
  beers.value = await beerPortalContract.value.getAllBeers()
  console.log(beers.value)
}

async function getTotalBalance() {
  totalBalance.value = ethers.utils.formatEther(
    await provider.getBalance(beerPortalContract.value.address),
  )
}

async function beerMe() {
  try {
    const { ethereum } = window

    if (ethereum) {
      /*
       * Execute the actual beer from your smart contract
       */
      isMinning.value = true
      const beerTxn = await beerPortalContract.value.sendBeer(
        message.value,
        1,
        { gasLimit: 300000 },
      )
      console.log('⛏ Mining...', beerTxn.hash)

      await beerTxn.wait()
      console.log('☑️ Mined -- ', beerTxn.hash)
      isMinning.value = false
      await getTotalBeers()
      await getAllBeers()
      await getTotalBalance()
      message.value = ''
    } else {
      console.log("Ethereum object doesn't exist!")
    }
  } catch (error) {
    console.error(error)
    isMinning.value = false
  }
  message.value = ''
}

watch(currentAccount, async () => {
  await getSmartContract()
})

const beerArray = computed(() =>
  beers.value.map(beer => ({
    address: beer.beerer,
    timestamp: new Date(beer.timestamp * 1000),
    message: beer.message,
  })),
)

onMounted(async () => {
  checkIfWalletIsConnected()
  await checkAuthorization()
})
</script>
<template>
  <div
    class="
      bg-primary-400
      text-white
      w-full
      h-full
      absolute
      inset-0
      flex flex-col
      items-center
      justify-center
    "
  >
    <span class="bg-primary-500 p-1.5 rounded absolute top-1 right-1 text-sm"
      >🍺 x {{ beerCount }}</span
    >
    <span
      class="
        bg-primary-500
        p-1.5
        rounded
        absolute
        top-1
        right-16
        flex
        items-center
        text-sm
      "
    >
      {{ totalBalance }}<icon-ethereum
    /></span>
    <h1 class="font-display text-secondary-400 text-6xl mb-8">
      🍺 Beer Portal
    </h1>
    <p class="text-2xl font-sans mb-8">
      Send a FE to the metaverse with your 🍺
    </p>
    <div class="flex" v-if="currentAccount">
      <input
        type="text"
        placeholder="Send a message"
        class="py-2.5 px-3 bg-gray-50 text-gray-700 rounded mr-4"
        v-model="message"
      />
      <button
        class="
          bg-secondary-400
          py-2.5
          px-1.5
          font-bold
          rounded
          flex
          items-center
        "
        @click="beerMe"
      >
        <IconLoading v-show="isMinning" class="animate-spin mr-4" /> Beer me! 🍺
      </button>
    </div>
    <transition-group
      appear
      name="staggered-fade"
      tag="ul"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
      class="py-8 w-3/4 list-none"
    >
      <li
        v-for="(beer, $index) of beerArray"
        :key="beer.address"
        :data-index="$index"
        class="border border-primary-200 py-2.5 px-3 mb-4 w-full"
      >
        <i>{{ beer.message }}</i> by
        <a
          :href="`https://rinkeby.etherscan.io/address/${beer.address}`"
          class="text-secondary-400 hover:text-secondary-300 transition-all"
          >{{ beer.address }}</a
        >
      </li>
    </transition-group>
    <button
      v-if="!currentAccount"
      class="bg-secondary-400 py-2.5 px-1.5 font-bold rounded flex items-center"
      @click="connectWallet"
    >
      <img src="/metamask-fox.svg" class="w-4 h-4 mr-2" /> Connect Wallet
    </button>

    <footer
      class="
        fixed
        h-8
        bottom-0
        w-full
        bg-primary-500
        flex
        justify-center
        items-center
      "
    >
      Made by
      <a href="https://twitter.com/alvaro_code" class="text-secondary-400 mx-2">
        Alvaro</a
      >
      with
      <a
        href="https://v3.nuxtjs.org/"
        class="mx-2 flex items-center text-sm text-secondary-400"
        ><img src="/nuxt-logo.svg" class="w-4 h-4 mr-2" /> Nuxt.js</a
      >
    </footer>
  </div>
</template>
