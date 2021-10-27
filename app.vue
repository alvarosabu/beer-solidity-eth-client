<script setup>
const currentAccount = ref('')
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
    <h1 class="font-display text-secondary-400 text-6xl mb-8">
      🍺 Beer Portal
    </h1>
    <p class="text-2xl font-sans mb-8">
      Send a FE to the metaverse with your 🍺
    </p>
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
