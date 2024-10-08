/* eslint-disable react/prop-types */
import { forwardRef } from "react";



export const Input = forwardRef(({error, ...props}, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={`rounded h-11 text-zinc-700 px-4 py-2 border ${error ? 'border-red-600' : 'border-[#019C87]'} ${error ? 'focus:ring-red-600' : 'focus:ring-[#019C87]'}`}
    />
  )
})

Input.displayName = 'Input'