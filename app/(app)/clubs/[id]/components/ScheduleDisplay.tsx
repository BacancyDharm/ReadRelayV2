type Section = {
    id: string,
    section_number: number,
    title: string | null,
    start_page: number,
    end_page: number,
    deadline: string
}

export default function ScheduleDisplay({
    sections, onEdit, isLeader,}: {
        sections: Section[],
        onEdit: () => void,
        isLeader: boolean
    }
){
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Reading Schedule</h3>
                {isLeader && (
                    <button className="text-xs text-blue-600 hover:underline"
                    onClick={onEdit}>
                        Edit
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {sections.map((section, index) => {
                          const deadline = new Date(section.deadline)
                          const isOverdue = deadline < new Date()
                          const pageRange = section.end_page - section.start_page + 1
                
                          return (
                            <div
                              key={section.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                            >
                              {/* Section number bubble */}
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                                {section.section_number}
                              </div>
                
                              {/* Section info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {section.title ?? `Section ${section.section_number}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Pages {section.start_page}–{section.end_page}
                                  <span className="mx-1">·</span>
                                  {pageRange} pages
                                </p>
                              </div>
                
                              {/* Deadline */}
                              <div className="text-right shrink-0">
                                <p className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-700'}`}>
                                  {deadline.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </p>
                                {isOverdue && (
                                  <p className="text-xs text-red-400">Overdue</p>
                                )}
                              </div>
                            </div>
                          )
                        })}
            </div>
        </div>
    )
}