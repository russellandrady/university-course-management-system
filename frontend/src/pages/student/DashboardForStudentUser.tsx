import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { DashboardManager } from "@/api/services/DashboardService";
import { DataTable } from "@/components/ui/custom/dataTable";
import { useTokenStore } from "@/store/tokenStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns = [
  { key: "courseId", label: "Course ID" },
  { key: "courseName", label: "Course Name" },
  { key: "offeredYear", label: "Year" },
  { key: "result", label: "Result" },
];

export default function DashboardForStudentUser() {
  const userStore = useUserStore();
  const studentUser = userStore.studentUserPage;
  const totalPages = 1; // Only one page for this user
  const token = useTokenStore((state) => state.token);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userTypedSomething, setUserTypedSomething] = useState(false);

  const { refetch } = useQuery({
    queryKey: ["studentUserPage", page, size, debouncedSearch],
    queryFn: () =>
      DashboardManager.fetchStudentUserPage({ search: debouncedSearch }),
  });

  const handleSearch = (search: string) => {
    setPage(0);
    setDebouncedSearch(search);
  };

  useEffect(() => {
    if (debouncedSearch === "" && !userTypedSomething) {
      return;
    }
    refetch();
  }, [debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!studentUser) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-4rem)]">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-background/30 backdrop-blur-md shadow-2xl border border-gray-200/40 md:min-h-min flex flex-col">
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-stretch mt-0 mb-2 p-2">
          <Card className="flex-1 min-w-0 min-h-0 border-none">
            <CardHeader className="">
              <CardTitle className="text-base font-medium text-muted-foreground text-center">
                Student ID
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-center font-mono text-sm">
                {studentUser.studentId}
              </p>
            </CardContent>
          </Card>

          <Card className="flex-1 min-w-0 border-none">
            <CardHeader className="">
              <CardTitle className="text-base font-medium text-muted-foreground text-center">
                Name
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-center text-sm">{studentUser.name}</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mt-0 flex justify-center items-center">
            <DataTable
              data={studentUser.courseOfferings}
              columns={columns}
              tableTitle="Course Offerings"
              searchPlaceholder="Search course offerings..."
              onSearch={handleSearch}
              onPageChange={handlePageChange}
              currentPage={page}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
