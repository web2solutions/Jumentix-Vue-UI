<template>
<div>
  <xForm
    :entity="entity"
    :forms="forms"
    :uploaders="uploaders"
    :bus="bus"
    :ref="'xForm'"
    :key="entity"
    :currentFormMode="currentFormMode"
    :showHeadline="false"
    :hideFields="hideFields"
    :hideCloseButton="true"
    :isFormSimple="true"
  ></xForm>
  <v-snackbar
    v-model="snack"
    :timeout="3000"
    :color="snackColor"
    :top="true"
    >
      {{ snackText }}
    <v-btn flat @click="snack = false">Close</v-btn>
  </v-snackbar>
</div>
</template>

<script>
import xSimpleForm from './xSimpleForm.vm.js';
export default xSimpleForm;
</script>
<style lang="css">

.flatpickr-input{
    width: 100%;
}
.flatpickr-wrapper{
    width: 100% !important;
}

.ck-content{
    height: 250px !important;
}
</style>
