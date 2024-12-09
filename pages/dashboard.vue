<script setup lang="ts">
definePageMeta({
  middleware: 'auth' as any,
});

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  ListFilter,
  CircleUser,
  PlusCircle,
  Trash2,
  Pencil
} from 'lucide-vue-next'
import { tasksControllerFilter, tasksControllerListStatuses, type TaskModel, type TaskStatusModel } from '@/api/generated'
import { createAuthHeaders } from '~/shared/create-auth-headers'
import AddTaskModal from '@/components/app/add-task.vue'
import DeleteTaskModal from '~/components/app/delete-task.vue';
import UpdateTaskModal from '~/components/app/update-task.vue';

const userName = ref<string | null>(null);
const tasks = ref<TaskModel[]>([])
const selectedTask = ref<TaskModel | undefined>()
const isLoading = ref(true)
const isAddTask = ref(false)
const isUpdateTask = ref(false)
const isDeleteTask = ref(false)
const router = useRouter()
const selectedStatusId = ref(0)

const statuses = ref<TaskStatusModel[]>([])

const getSelectedStatusName = computed(() => {
  if (selectedStatusId.value === 0) {
    return 'All'
  }
  const selectedStatus = statuses.value.find(status => status.id === selectedStatusId.value)
  return selectedStatus ? selectedStatus.name : 'Filter'
})

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

const selectStatus = (id: number) => {
  selectedStatusId.value = id
}


const fetchUserName = () => {
  userName.value = useCookie('userName').value || '';
};

const openAddTask = () => {
  isAddTask.value = true
}

const closeAddTask = () => {
  isAddTask.value = false
}

const openUpdateTask = (task: TaskModel) => {
  selectedTask.value = task
  isUpdateTask.value = true
}

const closeUpdateTask = () => {
  selectedTask.value = undefined
  isUpdateTask.value = false
}

const openDeleteTask = (task: TaskModel) => {
  selectedTask.value = task
  isDeleteTask.value = true
}

const closeDeleteTask = () => {
  selectedTask.value = undefined
  isDeleteTask.value = false
}

const addTask = (task: TaskModel) => {
  tasks.value = [...tasks.value, task]
}

const updateTask = (task: TaskModel) => {
  tasks.value = tasks.value.map(t => {
    if (task.id === t.id) {
      t = task
    }
    return t
  })
}

const removeTask = (id: number) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

const fetchTasks = async () => {
  try {
    const response = await tasksControllerFilter(selectedStatusId.value > 0 ?{ statusId: selectedStatusId.value } : {} as any, { headers: createAuthHeaders() })
    if (response.status === 200) {
      tasks.value = response.data
    }
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  const authToken = useCookie('authToken');
  const userName = useCookie('userName');

  authToken.value = null;
  userName.value = null;

  router.push('/login');
};

onMounted(() => {
  fetchUserName();
  fetchTasks()
  fetchStatus()
})

watch(selectedStatusId, () => {
  fetchTasks()
})


</script>

<template>


  <div class="flex min-h-screen w-full flex-col bg-muted/40">

    <AddTaskModal :isOpen="isAddTask" :onClose="closeAddTask" :onAdd="addTask" />

    <UpdateTaskModal :isOpen="isUpdateTask" :onClose="closeUpdateTask" :onUpdate="updateTask" :task="selectedTask" />

    <DeleteTaskModal :isOpen="isDeleteTask" :onClose="closeDeleteTask" :taskId="selectedTask?.id"
      :taskName="selectedTask?.name" :onDelete="removeTask" />

    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <header
        class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
            <span v-if="userName">{{ userName }}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="logout">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </header>
      <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div class="flex items-center">

          <div class="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="sm" class="h-7 gap-1">
                  <ListFilter class="h-3.5 w-3.5" />
                  <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {{ getSelectedStatusName }}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem :class="{ 'checked': selectedStatusId === 0 }" @click="selectStatus(0)">
                  All
                </DropdownMenuItem>

                <DropdownMenuItem v-for="status in statuses" :key="status.id"
                  :class="{ 'checked': status.id === selectedStatusId }" @click="selectStatus(status.id)">
                  {{ status.name }}
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
            <Button @click="openAddTask()" size="sm" class="h-7 gap-1">
              <PlusCircle class="h-3.5 w-3.5" />
              <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Task
              </span>
            </Button>
          </div>
        </div>
        <Card class="mt-8">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              Manage your tasks and view their performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span class="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="isLoading">
                  <TableRow v-for="n in 5" :key="'skeleton-' + n">
                    <TableCell>
                      <Skeleton class="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton class="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton class="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton class="h-4 w-[50px]" />
                    </TableCell>
                  </TableRow>
                </template>
                <template v-else>
                  <TableRow v-for="task in tasks" :key="task.id">
                    <TableCell class="font-medium">
                      {{ task.name }}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {{ task.status.name }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button @click="openUpdateTask(task)" size="sm" class="h-7 gap-1">
                        <Pencil class="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button @click="openDeleteTask(task)" size="sm" class="h-7 gap-1">
                        <Trash2 class="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </template>
              </TableBody>
            </Table>
          </CardContent>

        </Card>
      </main>
    </div>
  </div>
</template>