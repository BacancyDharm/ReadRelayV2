
const Header = ({name} : {
    name: string
}) => {
  return (
   <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="">
            <h1 className="text-lg font-bold text-gray-900">ReadRelay</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{name}</span>
          </div>
        </div>
      </header> 
  )
}

export default Header