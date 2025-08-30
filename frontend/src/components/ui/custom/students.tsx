import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useUserStore } from "@/store/userStore"
import { DashboardManager } from "@/api/services/DashboardService"
import type { StudentResponse } from "@/types/student/StudentResponse"
import { DataTable } from "./dataTable"
import { z } from "zod"
import { useTokenStore } from "@/store/tokenStore"

const studentColumns = [
  { key: "name", label: "Name" },
  { key: "studentId", label: "Student Id" },
  { key: "registeredYear", label: "Registered Year" },
]

const studentAddFields = [
  { key: "name", label: "Name" },
  { key: "studentId", label: "Student Id" },
  { key: "registeredYear", label: "Registered Year" },
  { key: "password", label: "Password", type: "password" },
]

const studentEditFields = [
  { key: "name", label: "Name" },
  { key: "studentId", label: "Student Id" },
  { key: "registeredYear", label: "Registered Year" },
]

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  studentId: z.string().min(1, "Student ID is required"),
  registeredYear: z.coerce.number().min(1900, "Registered Year must be valid"),
  password: z.string().min(8, "Password must be at least 8 characters long").optional(),
});

export function Students() {
  const userStore = useUserStore()
  const students = userStore.studentPage?.students ?? []
  const totalPages = userStore.studentPage?.totalPages ?? 0

  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const token = useTokenStore((state) => state.token);


  const [userTypedSomething, setUserTypedSomething] = useState(false)

  const { refetch } = useQuery({
    queryKey: ["students", page, size, debouncedSearch],
    queryFn: () =>
      DashboardManager.fetchStudents({
        page,
        size,
        search: debouncedSearch,
      }).then(() => setUserTypedSomething(true)),
      enabled: !!token && (!userStore.studentPage || page !== 0)
  })

  const handleEdit = (row: StudentResponse) => {
    console.log("Editing row:", row);
  }

  const handleSearch = (search: string) => {
    setPage(0)
    setDebouncedSearch(search)
  }

  useEffect(() => {
    if (debouncedSearch === "" && !userTypedSomething) {
      return;
    }
    refetch();
  }, [debouncedSearch])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <DataTable
      data={students}
      columns={studentColumns}
      searchPlaceholder="Search students..."
      onEdit={handleEdit}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      currentPage={page}
      totalPages={totalPages}
      editModalTitle="Update Student"
      addModalTitle="Add Student"
      editFields={studentEditFields}
      addFields={studentAddFields}
      formSchema={formSchema}
      onAdd={(data) => DashboardManager.addStudent(data)}
      onUpdate={(data) => DashboardManager.updateStudent(data)}
      tableTitle="Students"
      onDelete={(id) => DashboardManager.deleteStudent(id)}
    />
  )
}
