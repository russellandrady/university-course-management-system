import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useUserStore } from "@/store/userStore"
import { DashboardManager } from "@/api/services/DashboardService"
import { DataTable } from "./dataTable"
import { z } from "zod"
import { useTokenStore } from "@/store/tokenStore"

const courseColumns = [
  { key: "courseId", label: "Course ID" },
  { key: "name", label: "Name" },
  { key: "credits", label: "Credits" },
  { key: "mandatory", label: "Mandatory" },
]

const courseEditFields = [
  { key: "courseId", label: "Course ID" },
  { key: "name", label: "Name" },
  { key: "credits", label: "Credits", type: "number" },
  { key: "mandatory", label: "Mandatory", type: "boolean" },
]

const courseAddFields = [
  { key: "courseId", label: "Course ID" },
  { key: "name", label: "Name" },
  { key: "credits", label: "Credits", type: "number" },
  { key: "mandatory", label: "Mandatory", type: "boolean" },
]

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  courseId: z.string().min(1, "Course ID is required"),
  credits: z.coerce.number().min(1, "Credits must be at least 1"),
  mandatory: z.coerce.boolean(),
});

export function Courses() {
  const userStore = useUserStore()
  const courses = userStore.coursePage?.courses ?? []
  
  const totalPages = userStore.coursePage?.totalPages ?? 0
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [userTypedSomething, setUserTypedSomething] = useState(false)

  const token = useTokenStore((state) => state.token);

  const { refetch } = useQuery({
    queryKey: ["courses", page, size, debouncedSearch],
    queryFn: () =>
      DashboardManager.fetchCourses({
        page,
        size,
        search: debouncedSearch,
      }).then(() => setUserTypedSomething(true)),
      enabled: !!token && (!userStore.coursePage || page !== 0)
  })

  const handleEdit = (row: any) => {
    // Handle edit logic here
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
      data={courses}
      columns={courseColumns}
      searchPlaceholder="Search courses..."
      onEdit={handleEdit}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      currentPage={page}
      totalPages={totalPages}
      editModalTitle="Update Course"
      addModalTitle="Add Course"
      editFields={courseEditFields}
      addFields={courseAddFields}
      formSchema={formSchema}
      onAdd={(data) => DashboardManager.addCourse(data)}
      onUpdate={(data) => DashboardManager.updateCourse(data)}
      tableTitle="Courses"
      onDelete={(id) => DashboardManager.deleteCourse(id)}
    />
  )
}
