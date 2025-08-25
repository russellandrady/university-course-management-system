import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Students } from "@/components/ui/custom/students"
import { Courses } from "@/components/ui/custom/courses"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("students")

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-4rem)]">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-background/30 backdrop-blur-md shadow-2xl border border-gray-200/40 md:min-h-min flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
          {/* Fixed position tabs at top */}
          <div className="sticky top-0 z-10 bg-background/30 backdrop-blur-md p-4 border-b border-gray-200/40">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <TabsContent value="students" className="mt-0 flex justify-center items-center">
              <Students />
            </TabsContent>

            <TabsContent value="courses"className="mt-0 flex justify-center items-center">
              <Courses />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}