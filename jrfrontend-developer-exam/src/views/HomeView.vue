<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import type { ToastServiceMethods } from 'primevue/toastservice'

// Declarations - create interface(model) for contacts
interface Contact {
  username: string
  email: string
}
const contacts = ref<Contact[]>([])
const newContact = ref<Contact>({ username: '', email: '' })
const toast: ToastServiceMethods = useToast()

// Add to table below form and localStorage
function addContact(): void {
  contacts.value.push({ ...newContact.value })
  saveContactToLocalStorage({ ...newContact.value })
  // Display a toast alert to inform user that contact has been added
  toast.add({
    severity: 'success',
    summary: 'New Contact Saved!',
    detail: 'Contact was saved successfully',
    life: 3000
  })

  // Clear entry fields and refocus on the username field
  clearFields()
  const userNameInput = document.getElementById('username')
  userNameInput?.focus()
}

// Dedicated method to store contact to localStorage
function saveContactToLocalStorage(contact: Contact): void {
  // Get all contacts from the localStorage and push the new contact
  const existingContacts = JSON.parse(localStorage.getItem('contacts') || '[]')
  existingContacts.push(contact)

  // Push updated array to localStorage
  localStorage.setItem('contacts', JSON.stringify(existingContacts))
}

// Clear fields in the form (bound to the @click directive)
const clearFields = (): void => {
  newContact.value.username = ''
  newContact.value.email = ''
}

// Determine if all fields in the form are filled
const isFormValid = computed(() => {
  // Disables the submit button if false
  return newContact.value.username.trim() !== '' && newContact.value.email.trim() !== ''
})

// Initialize the table below form to always have at least one entry
function initializeTable(): void {
  const initialContact: Contact = { username: 'Kelsier', email: 'lordofscars@gmail.com' }
  contacts.value.push(initialContact)

  // Checks if we already added the initial data on the first page load
  if (!localStorage.getItem('initialDataSaved')) {
    saveContactToLocalStorage(initialContact)
    localStorage.setItem('initialDataSaved', 'true')
  }
}
onMounted(initializeTable)
</script>

<template>
  <main>
    <form @submit.prevent="addContact">
      <Card style="margin-bottom: 1rem; overflow: hidden">
        <template #title>NEW USER FORM</template>
        <template #subtitle>Enter user details</template>
        <template #content>
          <div class="flex flex-column gap-3">
            <InputGroup>
              <InputGroupAddon><i class="pi pi-user"></i></InputGroupAddon>
              <InputText id="username" v-model="newContact.username" placeholder="Username" />
            </InputGroup>

            <InputGroup>
              <InputGroupAddon><i class="pi pi-envelope"></i></InputGroupAddon>
              <InputText v-model="newContact.email" placeholder="Email" />
            </InputGroup>
          </div>
        </template>
        <template #footer>
          <div class="flex gap-3 mt-1">
            <Button
              label="Cancel"
              @click="clearFields"
              severity="secondary"
              outlined
              class="w-full"
            />
            <Toast />
            <Button
              label="Save"
              type="submit"
              severity="success"
              class="w-full"
              :disabled="!isFormValid"
            />
          </div>
        </template>
      </Card>
    </form>

    <!-- Table value is bound to the contacts variable for easy table update -->
    <Card>
      <template #content>
        <DataTable
          id="temporary-storage-table"
          :value="contacts"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10]"
        >
          <Column field="username" header="Username"></Column>
          <Column field="email" header="Email"></Column>
        </DataTable>
      </template>
    </Card>
  </main>
</template>
