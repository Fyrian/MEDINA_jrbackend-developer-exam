<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from 'primevue/useconfirm'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

// Declarations - create interface(model) for contacts
interface Contact {
  username: string
  email: string
}
const contacts = ref<Contact[]>([])
const editedContact = ref<Contact>({ username: '', email: '' })
let selectedContactIndex: number = -1
const isEditDialogVisible = ref(false)
const confirm = useConfirm()
const toast = useToast()

// Load all contacts from the localStorage
function loadContacts(): void {
  const data: string | null = localStorage.getItem('contacts')
  // If the data is valid (not empty)
  if (data) {
    contacts.value = JSON.parse(data)
  }
}

// Show Dialog to edit a contact
function editContact(contact: Contact): void {
  selectedContactIndex = contacts.value.findIndex((u) => u.username === contact.username)
  // Checks if the contact selected exists
  if (selectedContactIndex !== -1) {
    editedContact.value = { ...contact }
    isEditDialogVisible.value = true
  }
}

// Save edited contact details
function updateContact(): void {
  if (selectedContactIndex !== -1) {
    // Save the new details in the contacts array
    // selectedContactIndex is determined in the editContact() method to point to the selected contact (if valid)
    contacts.value[selectedContactIndex] = { ...editedContact.value }
    localStorage.setItem('contacts', JSON.stringify(contacts.value))
    isEditDialogVisible.value = false
  }
}

// Delete selected contact
function deleteContact(contact: Contact) {
  // Filters which contact to delete via the username
  contacts.value = contacts.value.filter((u) => u.username !== contact.username)
  localStorage.setItem('contacts', JSON.stringify(contacts.value))
}

// Determine if all fields in the form are filled
const isFormValid = computed(() => {
  // Disables the submit button if false
  return editedContact.value.username.trim() !== '' && editedContact.value.email.trim() !== ''
})

// Checks if username field is empty (triggers red outline around TextInput)
const isUsernameEmpty = computed(() => {
  return editedContact.value.username.trim() === ''
})

// Checks if email field is empty (triggers red outline around TextInput)
const isEmailEmpty = computed(() => {
  return editedContact.value.email.trim() === ''
})

// Delete contact through the ConfirmPopup component
const confirmForDelete = (event: { currentTarget: any }, contact: Contact) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this contact?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      // If user confirms action, display toast and delete selected contact
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Contact deleted', life: 3000 })
      deleteContact(contact)
    }
  })
}

onMounted(loadContacts)
</script>

<template>
  <Card>
    <template #content>
      <!-- Table value is bound to the contacts variable for easy table update -->
      <DataTable
        id="local-storage-table"
        :value="contacts"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10]"
      >
        <Column field="username" header="Username"></Column>
        <Column field="email" header="Email"></Column>
        <Column header="Actions">
          <template #body="contact">
            <div class="flex gap-1 mt-1">
              <Button
                label="Edit"
                @click="editContact(contact.data)"
                class="p-button-sm p-button-success w-full"
              />
              <Toast />
              <ConfirmPopup />
              <Button
                label="Delete"
                @click="confirmForDelete($event, contact.data)"
                class="p-button-sm p-button-danger w-full"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Dialog for the edit form -->
      <Dialog header="Edit Contact" v-model:visible="isEditDialogVisible" modal>
        <form @submit.prevent="updateContact">
          <div class="flex flex-column gap-3">
            <InputGroup>
              <InputGroupAddon><i class="pi pi-user"></i></InputGroupAddon>
              <InputText
                id="username"
                v-model="editedContact.username"
                placeholder="Username"
                :invalid="isUsernameEmpty"
              />
            </InputGroup>

            <InputGroup>
              <InputGroupAddon><i class="pi pi-envelope"></i></InputGroupAddon>
              <InputText
                id="email"
                v-model="editedContact.email"
                placeholder="Email"
                :invalid="isEmailEmpty"
              />
            </InputGroup>
          </div>

          <div class="flex justify-content-end mt-3">
            <Button label="Save" type="submit" :disabled="!isFormValid" />
          </div>
        </form>
      </Dialog>
    </template>
  </Card>
</template>
