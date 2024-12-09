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
import { usersControllerSignIn } from '@/api/generated'
import { Loader2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const { toast } = useToast()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)

const handleLogin = async () => {
  const requiredFields = ['email', 'password']

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
    const response = await usersControllerSignIn({
      email: form.email,
      password: form.password
    })

    const authToken = useCookie('authToken');
    const userName = useCookie('userName');

    authToken.value = response.data.accessToken;
    userName.value = response.data.name;

    router.push('/dashboard')

  } catch (error) {
    return toast({
      variant: "destructive",
      title: "Credentials Invalid",
      description: "E-mail or password is invalid.",
    })
  } finally {
    isLoading.value = false
  }

}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <Card class="w-full max-w-sm">
      <form @submit.prevent="handleLogin">
        <CardHeader>
          <CardTitle class="text-2xl">
            Login
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input v-model="form.email" id="email" type="email" placeholder="m@example.com" />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input v-model="form.password" id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button v-if="!isLoading" class="w-full">
            Sign in
          </Button>

          <Button disabled v-if="isLoading" class="w-full">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" />
          </Button>

        </CardFooter>
      </form>

      <div class="mb-8 text-center text-sm">
        Don't have an account?
        <NuxtLink to="/register" class="underline">
          Sign up
        </NuxtLink>
      </div>

    </Card>
  </div>
</template>