<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { Textarea } from '@/components/ui/textarea'
import { type TaskModel, tasksControllerListStatuses, tasksControllerUpdate, type TaskStatusModel } from '@/api/generated'
import { validateRequiredFields } from '~/shared/validate-required-fields'
import { toast } from '../ui/toast'
import { removeEmptyProps } from '~/shared/remove-empty-props'
import { createAuthHeaders } from '~/shared/create-auth-headers'
import { Loader2 } from 'lucide-vue-next'

const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')


const props = defineProps(['isOpen', 'onClose', 'onAdd', 'onUpdate', 'task'])


const form = reactive({
  id: 0,
  name: '',
  description: '',
  statusId: '',
  start_date: '',
  end_date: ''
})

const isOpen = ref(props.isOpen)
const isLoading = ref(false)
const statuses = ref<TaskStatusModel[]>([])


const fetchStatus = async () => {
  try {

    const response = await tasksControllerListStatuses({
      headers: createAuthHeaders()
    })

    if (response.status === 200) {
      statuses.value = response.data
    }
  } catch (_) { }
}

watch(() => props.task, (newValue) => {
  if (newValue) {
    form.id = newValue.id
    form.name = newValue.name
    form.description = newValue.description
    form.start_date = newValue.start_date
    form.end_date = newValue.end_date
    form.statusId = String(newValue?.status?.id)
  }
})

watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue
})

const closeModal = () => {
  props.onClose()
}

watch(isOpen, (newValue) => {
  if (!newValue) {
    props.onClose()
  } else {
    fetchStatus()
  }
})


const handleSubmit = async () => {

  const requiredFields = ['id', 'name', 'statusId']

  const resultValidateRequiredFields = validateRequiredFields(form, requiredFields)
  if (resultValidateRequiredFields instanceof Error) {
    return toast({
      title: 'Required Field',
      description: resultValidateRequiredFields.message,
      variant: 'destructive'
    })
  }

  try {
    isLoading.value = true

    const response = await tasksControllerUpdate({ ...removeEmptyProps(form), statusId: Number(form.statusId) } as any, { headers: createAuthHeaders() })

    if (response.status === 204) {

      toast({
        title: 'Success',
        description: 'Task updated successfully',
      })

      props.onUpdate({
        ...form,
        status: statuses.value.find(s => s.id === Number(form.statusId))
      })

      closeModal()
    }
  } catch (error) {
    console.error('Error updating task:', error)
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
  <UseTemplate>
    <form class="grid items-start gap-4 px-4" @submit.prevent="handleSubmit">
      <div class="grid gap-2">
        <Label html-for="name">Name</Label>
        <Input v-model="form.name" id="name" type="name" />
      </div>

      <div class="grid gap-2">
        <Label html-for="name">Start Date</Label>
        <Input v-model="form.start_date" id="startDate" type="date" />
      </div>

      <div class="grid gap-2">
        <Label html-for="name">End Date</Label>
        <Input v-model="form.end_date" id="endDate" type="date" />
      </div>

      <div class="grid gap-2">
        <Label html-for="description">Description</Label>
        <Textarea v-model="form.description" placeholder="Type your description here." />
      </div>

      <Select class="grid gap-2" v-model="form.statusId">
        <SelectTrigger>
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem v-for="status in statuses" :key="status.id" :value="status.id.toString()">
              {{ status.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button disabled v-if="isLoading" class="w-full">
        <Loader2 class="w-4 h-4 mr-2 animate-spin" />
      </Button>

      <Button v-if="!isLoading" type="submit">
        Update Task
      </Button>
    </form>
  </UseTemplate>

  <Dialog v-if="isDesktop && isOpen" v-model:open="isOpen">

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update Task</DialogTitle>
        <DialogDescription>
          Add a new task to your list. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <GridForm />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="isOpen">

    <DrawerContent>
      <DrawerHeader class="text-left">
        <DrawerTitle>Add Task</DrawerTitle>
        <DrawerDescription>
          Add a new task to your list. Click save when you're done.
        </DrawerDescription>
      </DrawerHeader>
      <GridForm />
      <DrawerFooter class="pt-2">
        <DrawerClose as-child>
          <Button v-if="!isLoading"  variant="outline">
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>