<template>
  <div>
    <LoginHeader/>
    <RegisterSection/>
    <LoginFooter/>
  </div>
</template>

<script setup lang="ts" name="Register">
  import LoginHeader from '@/views/Login/components/LoginHeader.vue'
  import LoginFooter from '@/views/Login/components/LoginFooter.vue'
  import RegisterSection from './components/RegisterSection.vue'
</script>

<style scoped lang="scss">

</style>
