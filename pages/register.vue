<script setup lang="ts">
definePageMeta({
  middleware: 'auth' as any,
});

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { validateRequiredFields, validateEmailField } from '@/shared'
import { useToast } from '@/components/ui/toast/use-toast'
import { usersControllerSignUp } from '@/api/generated'
import { Loader2 } from 'lucide-vue-next'

const { toast } = useToast()

const form = reactive({
  email: '',
  name: ''
})

const isLoading = ref(false)

const handleRegister = async () => {
  const requiredFields = ['email', 'name']

  const resultValidateRequiredFields = validateRequiredFields(form, requiredFields)
  if (resultValidateRequiredFields instanceof Error) {
    return toast({
      title: 'Required Field',
      description: resultValidateRequiredFields.message,
      variant: 'destructive'
    })
  }

  const resultValidateEmailField = validateEmailField(form)
  if (resultValidateEmailField instanceof Error) {
    return toast({
      title: 'Invalid Field',
      description: resultValidateEmailField.message,
      variant: 'destructive'
    })
  }


  try {
    isLoading.value = true
    const response = await usersControllerSignUp({
      email: form.email,
      name: form.name
    })

    toast({
      title: "Account created successfully",
      description: "Your account has been created. A temporary password has been sent to your e-mail.",
    });


  } catch (error) {
    return toast({
      variant: "destructive",
      title: "E-mail already used",
      description: "This e-mail is already registered. Try using another e-mail.",
    })
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <Card class="w-full max-w-sm">
      <form @submit.prevent="handleRegister">
        <CardHeader>
          <CardTitle class="text-2xl">
            Register
          </CardTitle>
          <CardDescription>
            Enter your name and email below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input v-model="form.email" id="email" type="email" placeholder="m@example.com" />
          </div>
          <div class="grid gap-2">
            <Label for="name">Name</Label>
            <Input v-model="form.name" id="name" type="text" />
          </div>
        </CardContent>
        <CardFooter>

          <Button v-if="!isLoading" class="w-full">
            Sign up
          </Button>

          <Button disabled v-if="isLoading" class="w-full">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" />
          </Button>

        </CardFooter>
      </form>
    </Card>
  </div>
</template>