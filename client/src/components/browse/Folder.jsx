import React from 'react'

const Folder = ({ folder }) => {
  return (
    <div className="bg-slate-200/85 border border-slate-200/85 hover:bg-slate-100 hover:border-slate-100 rounded-md px-1 py-2 flex justify-center items-center gap-2 cursor-pointer">
      <div className="text-5xl basis-3/12">📁</div>
      <div className="text-sm truncate basis-9/12">{folder.name}</div>
    </div>
  )
}

export default Folder
