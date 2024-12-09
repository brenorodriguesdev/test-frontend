<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { toast } from '../ui/toast'
import { tasksControllerDelete } from '@/api/generated'
import { createAuthHeaders } from '~/shared/create-auth-headers'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'

const props = defineProps(['isOpen', 'onClose', 'taskId', 'taskName', 'onDelete'])

const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')

const isOpen = ref(props.isOpen)
const isLoading = ref(false)

watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue
})

const closeModal = () => {
  props.onClose()
}

watch(isOpen, (newValue) => {
  if (!newValue) {
    props.onClose()
  }
})

const handleDelete = async () => {
  try {
    isLoading.value = true
    const response = await tasksControllerDelete(props.taskId, { headers: createAuthHeaders() })

    if (response.status === 204) {
      props.onDelete(props.taskId)
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      })
      closeModal()
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to delete task',
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
  <UseTemplate>
    <form class="grid items-start gap-4 px-4" @submit.prevent="handleDelete">
      <div :class="isDesktop ? 'flex space-x-2' : 'flex space-x-2 mb-4'">
        <div class="flex-1">
          <Button variant="destructive" disabled v-if="isLoading" class="w-full">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" />
          </Button>

          <Button variant="destructive" v-if="!isLoading" type="submit" class="w-full">
            Delete Task
          </Button>
        </div>

        <DrawerClose as-child class="flex-1">
          <Button variant="outline" class="w-full">
            Cancel
          </Button>
        </DrawerClose>
      </div>
    </form>
  </UseTemplate>

  <Dialog v-if="isDesktop && isOpen" v-model:open="isOpen">

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the task <strong>{{ props.taskName }}</strong>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <GridForm />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="isOpen" class="mb-12">

    <DrawerContent>
      <DrawerHeader class="text-left">
        <DrawerTitle>Delete Task</DrawerTitle>
        <DrawerDescription>
          Are you sure you want to delete the task <strong>{{ props.taskName }}</strong>? This action cannot be undone.
        </DrawerDescription>
      </DrawerHeader>
      <GridForm />
    </DrawerContent>
  </Drawer>
</template>